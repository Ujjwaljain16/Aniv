import './style.css'

// Configuration
const CONFIG = {
  cooldownMs: 2000, // 2s pace (faster)
  breathMs: 500,    // "Empty" state duration
  minSwipeDist: 50 
};

// Flow State
const flow = [
  'ref-arrival',
  'ref-distance',
  'ref-effort',
  'ref-meeting',
  'ref-growth',
  'ref-choice',
  'ref-gratitude',
  'ref-pre-chapters',
  'ref-chapters',
  'ref-scrapbook',
  'ref-map',
  'ref-sky',
  'ref-hold-1',
  'ref-hold-2',
  'ref-letters',
  'ref-future',
  'ref-private',
  'ref-final'
];

let currentIndex = 0;
let isInteracting = false;
let lastInteractionTime = Date.now();
let isLocked = true;

// Export for dev shortcuts
window.flow = flow;
window.currentIndex = currentIndex;
window.isLocked = isLocked;

// Helper to update currentIndex from dev shortcuts
window.updateCurrentIndex = function(newIndex) {
    currentIndex = newIndex;
    window.currentIndex = newIndex;
    // Also unlock when jumping via dev shortcuts
    isLocked = false;
    window.isLocked = false;
};

// Init
window.addEventListener('load', () => {
    // Force reset
    currentIndex = 0;
    updateVisibility();
    
    // Setup 
    setupGateway();
    setupArrival();
    setupPauseRoom();
    setupChapters();
    setupNewSections();
    fetchWeather(); // Live Sky
    
    console.log("Experience Ready (Locked).");
});

// Sky Logic (Cached)
async function fetchWeather() {
    const CACHE_KEY = 'us_sky_data';
    const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour

    const applySky = (data) => {
         const blrCode = data.blr.current.weather_code;
         const ngpCode = data.ngp.current.weather_code;
         const blrDay = data.blr.current.is_day;
         const ngpDay = data.ngp.current.is_day;

         // Helper for Colors (Abstract)
         const getColor = (c, isDay) => {
            if (!isDay) return '#1a1b41'; // Night base (Deep Indigo)
            // Simple logic: Clear=Blue, Cloud=GreyBlue, Rain=Slate
            if (c === 0) return '#87CEEB'; 
            if (c <= 3) return '#B0C4DE'; 
            return '#708090'; 
         };

         const c1 = getColor(blrCode, blrDay);
         const c2 = getColor(ngpCode, ngpDay);
         
         const bg = document.getElementById('sky-live-bg');
         if (bg) {
             bg.style.background = `linear-gradient(90deg, ${c1}, ${c2})`;
             console.log("Sky loaded (Cached/Live).");
         }
    };

    try {
        // 1. Check Cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_DURATION) {
                applySky(parsed.data);
                return;
            }
        }

        console.log("Fetching fresh sky...");
        const [blr, ngp] = await Promise.all([
            fetch('https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current=weather_code,is_day'),
            fetch('https://api.open-meteo.com/v1/forecast?latitude=21.14&longitude=79.08&current=weather_code,is_day')
        ]).then(responses => Promise.all(responses.map(r => r.json())));

        // 2. Save Cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: { blr, ngp }
        }));

        applySky({ blr, ngp });
        
    } catch (e) {
        console.error("Sky fetch silent fail", e);
        // Fallback is CSS default (transparent/dark)
    }
}


window.toggleLetter = function(el) {
    el.classList.toggle('open');
};

function setupNewSections() {
    // Buttons to advance main flow
    const mappings = [
        { id: 'btn-continue-letters', target: 'next' },
        { id: 'btn-continue-hold', target: 'next' },
        { id: 'btn-continue-future', target: 'next' },
        { id: 'btn-continue-final-page', target: 'next' },
    ];
    
    mappings.forEach(m => {
        const btn = document.getElementById(m.id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                advance();
            });
        }
    });

    // Private Gate Toggle
    const btnPrivate = document.getElementById('btn-enter-private');
    if (btnPrivate) {
        btnPrivate.addEventListener('click', (e) => {
             e.stopPropagation();
             document.getElementById('private-gate').style.display = 'none';
             document.getElementById('private-content').style.display = 'flex';
        });
    }

    // DISABLED: Old Stay button handler - now using final-section.js
    // The Stay (Final Blackout -> Memory Reveal)
    // const btnStay = document.getElementById('btn-stay');
    // if (btnStay) {
    //     btnStay.addEventListener('click', (e) => {
    //         e.stopPropagation();
    //         // 1. Fade out the text/app (Clean slate)
    //         document.body.classList.add('blackout');
    //         
    //         // DISABLED: Old memory reveal - now using final-section.js
    //         // setTimeout(() => {
    //         //     const img = document.getElementById('final-memory');
    //         //     if(img) img.style.opacity = 1;
    //         // }, 500);
    //         
    //         console.log("Stay. Revealing memory.");
    //     });
    // }
}

// Expose to window for HTML onclick
window.toggleChapter = function(card, event) {
    if (event) event.stopPropagation(); // Prevent navigation
    
    const allCards = document.querySelectorAll('.chapter-card');
    const wasExpanded = card.classList.contains('expanded');
    
    // Close all
    allCards.forEach(c => c.classList.remove('expanded'));
    
    // Open clicked if it wasn't open
    if (!wasExpanded) {
        card.classList.add('expanded');
    }
};

// Expose toggleLetter for envelope clicks
window.toggleLetter = function(envelope, event) {
    if (event) event.stopPropagation(); // Prevent navigation
    envelope.classList.toggle('open');
};

function setupChapters() {
    const btn = document.getElementById('btn-continue-closing');
    if (btn) {
        btn.addEventListener('click', (e) => {
             e.stopPropagation(); // prevent body click
             advance(); // Manually advance to next (closing)
        });
    }
}

function setupGateway() {
    const input = document.getElementById('password-input');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkPassword(input.value);
        }
    });
}

function setupArrival() {
    const btn = document.getElementById('btn-come-in');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        enterPauseRoom();
    });
}

function setupPauseRoom() {
    const btn = document.getElementById('btn-okay');
    const toggle = document.getElementById('sound-toggle');
    
    if (btn) {
        btn.addEventListener('click', () => {
            enterMainApp();
        });
    }
    
    // Toggle Visual
    if (toggle) {
        toggle.addEventListener('click', () => {
             // Just a visual toggle for now
             const isActive = toggle.classList.toggle('active');
             toggle.style.opacity = isActive ? '1' : '0.5';
             // Flip icon? Keep simple: Cross line means off.
             // If active (Sound On), we remove the cross lines?
             // Let's just swap SVG or opacity. User said "Optional sound toggle (off default)".
             // We'll assume the current SVG is "Off" (has lines).
             // If ON, we'd remove lines.
             if (isActive) {
                 toggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
             } else {
                 toggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
             }
        });
    }
}

function checkPassword(val) {
    const cleanVal = val.toLowerCase().trim();
    if (cleanVal === 'pholluuxdovie') {
        unlockToArrival();
    } else {
        reject();
    }
}

// Hint System
const hints = [
  "It’s not something new.",
  "It’s how we call each other.",
  "The names only we use.",
  "Try writing both… together."
];
let failedAttempts = 0;

function reject() {
    const input = document.getElementById('password-input');
    const errorMsg = document.getElementById('error-msg');
    
    // 1. Increment Logic
    failedAttempts++;
    
    // 2. Select Hint (Cap at last hint)
    const hintIndex = Math.min(failedAttempts - 1, hints.length - 1);
    const hintText = hints[hintIndex];
    
    // 3. Update Text
    if (errorMsg.textContent !== hintText) {
        // Fade out slightly before changing if it's already visible? 
        // Simpler: Just update text. The slow fade-in handles the emotion.
        errorMsg.style.opacity = 0;
        setTimeout(() => {
            errorMsg.textContent = hintText;
            // 4. Progressive Warmth (Optional micro-detail)
            if (failedAttempts > 1) {
                 errorMsg.style.color = '#e2e8f0'; // Warmer/Lighter (Text Light) instead of Teal
                 // Or keep teal but brighten it? User said "increase text warmth". 
                 // Let's use a subtle warm white/pinkish tint from palette if needed, 
                 // but standard text-light is warmer than teal.
            }
            
            // 5. Fade In Slowly
            errorMsg.style.opacity = 0.8; 
        }, 500); // Short pause for text swap
    } else {
        // If text is same (shouldn't happen with increment, but just in case)
        errorMsg.style.opacity = 0.8;
    }
    
    // 6. No Shake.
    // "No shake, no alert"
    
    // 7. Auto-hide? 
    // "I'm guiding you, not correcting you." -> Guides usually stay visible longer.
    // Let's leave it visible or fade out very slowly after a long time.
    // Existing was 3s. Let's make it 8s.
    // Actually, user didn't ask to hide it, but we need to clear it eventually or it looks like a permanent label.
    // Let's clear after 5s to keep UI clean.
    setTimeout(() => { errorMsg.style.opacity = 0 }, 5000);
}

function unlockToArrival() {
    isLocked = false;
    const gateway = document.getElementById('gateway');
    const arrival = document.getElementById('arrival');
    
    // 1. Fade out gateway input first
    gateway.style.opacity = 0;
    gateway.style.pointerEvents = 'none';

    // 2. Emotional Pause (300ms) before the light hits
    setTimeout(() => {
        // 3. Transition to Arrival Mode (Warm)
        document.body.classList.add('arrival-mode');
        
        // 4. Reveal Arrival Text
        setTimeout(() => {
            arrival.style.opacity = 1;
            arrival.style.pointerEvents = 'auto';
            arrival.classList.add('active'); // Trigger Animation
        }, 1000); 
    }, 300);
}

function enterPauseRoom() {
    const arrival = document.getElementById('arrival');
    const pauseRoom = document.getElementById('pause-room');
    
    // 1. Fade out Arrival
    arrival.style.opacity = 0;
    arrival.style.pointerEvents = 'none';
    arrival.classList.remove('active'); // Reset
    
    // 2. Transition back to Dark Mode (The Pause Room is dark/original bg?)
    // Request didn't specify background change for Pause Room.
    // "Initial state: Empty screen".
    // If we remove 'arrival-mode', we go back to the Dark Gradient.
    // This fits "Silence".
    document.body.classList.remove('arrival-mode');
    
    // 3. Fade in Pause Room
    setTimeout(() => {
        pauseRoom.style.opacity = 1;
        pauseRoom.style.pointerEvents = 'auto';
        pauseRoom.classList.add('active'); // Trigger Animation
    }, 1000); // Wait for bg transition match
}

function enterMainApp() {
    const pauseRoom = document.getElementById('pause-room');
    const app = document.getElementById('app');
    
    // 1. Fade out Pause Room
    pauseRoom.style.opacity = 0;
    pauseRoom.style.pointerEvents = 'none';
    
    // 2. Fade in App
    setTimeout(() => {
        app.style.opacity = 1;
        app.style.pointerEvents = 'auto'; 
    }, 2000);
}

// Interaction Hander
document.body.addEventListener('click', handleInteraction);
document.body.addEventListener('touchstart', handleInteraction, { passive: false });

function handleInteraction(e) {
  if (isLocked) return; 
  if (document.body.classList.contains('arrival-mode')) return; // Ignore body clicks in arrival mode
  
  // Prevent default zoom/scroll behavior quirks
  // e.preventDefault(); 
  
  if (isInteracting) return;

  // Special Case: Chapters Section handles its own scrolling/interaction
  if (['ref-chapters', 'ref-scrapbook', 'ref-map', 'ref-letters', 'ref-private', 'ref-final'].includes(flow[currentIndex])) return;
  
  // Ignore Inputs/Buttons
  if (['INPUT', 'BUTTON'].includes(e.target.tagName)) return;
  
  const now = Date.now();
  const timeSinceLast = now - lastInteractionTime;
  
  // Safety Cooldown Check
  if (timeSinceLast < CONFIG.cooldownMs) {
    console.log(`Ignored: Cooldown active (${timeSinceLast}ms < ${CONFIG.cooldownMs}ms)`);
    return;
  }
  
  // Determine Direction (Left 30% = Back, Rest = Next)
  let direction = 1;
  const x = e.clientX || (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0);
  if (x > 0 && x < window.innerWidth * 0.3) {
      direction = -1;
  }

  advance(direction);
}

function advance(direction = 1) {
  // Boundary Checks
  if (direction === 1 && currentIndex >= flow.length - 1) {
    // End state reached (Stay/Closing handles itself mostly, but if we tap?)
    return;
  }
  if (direction === -1 && currentIndex <= 0) {
      console.log("Cannot go back: Start of flow.");
      return;
  }
  
  const nextIndex = currentIndex + direction;
  
  isInteracting = true;
  lastInteractionTime = Date.now();
  
  // 1. Exhale (Fade Out current)
  document.body.classList.add('breathing');
  
  // 2. The Breath (Wait)
  setTimeout(() => {
    // Swap content while invisible
    document.getElementById(flow[currentIndex]).classList.remove('active');
    currentIndex = nextIndex;
    document.getElementById(flow[currentIndex]).classList.add('active');
    
    // 3. Inhale (Fade In next)
    requestAnimationFrame(() => {
        document.body.classList.remove('breathing');
        
        lastInteractionTime = Date.now(); 
        
        // Lock interaction during the fade-in (3s)
        setTimeout(() => {
             isInteracting = false;
             console.log(`Unlocked: ${flow[currentIndex]}`);
        }, 3000); 
        
        console.log(`Advanced to: ${flow[currentIndex]} (Dir: ${direction})`);
    });
    
  }, CONFIG.breathMs);
}

function updateVisibility() {
    flow.forEach((id, index) => {
        const el = document.getElementById(id);
        if (index === currentIndex) el.classList.add('active');
        else el.classList.remove('active');
    });
}

// Click Navigation
// Left-click = backward, Right-click = forward
document.body.addEventListener('click', (e) => {
    const locked = isLocked || window.isLocked;
    console.log('Click detected', { isLocked, 'window.isLocked': window.isLocked, locked, isInteracting, target: e.target });
    
    // Ignore if clicking on interactive elements
    if (e.target.closest('button, input, .chapter-card, .growth-step, .choice-toggle-item, .choice-toggles-container')) {
        console.log('Ignored - interactive element');
        return;
    }
    
    if (locked) {
        console.log('Ignored - locked');
        return;
    }
    
    if (isInteracting) {
        console.log('Ignored - interacting');
        return;
    }
    
    console.log('Navigating backward');
    // Left click = backward
    advance(-1);
});

document.body.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Prevent context menu
    const locked = isLocked || window.isLocked;
    console.log('Right-click detected', { isLocked, 'window.isLocked': window.isLocked, locked, isInteracting, target: e.target });
    
    // Ignore if clicking on interactive elements
    if (e.target.closest('button, input, .chapter-card, .growth-step, .choice-toggle-item, .choice-toggles-container')) {
        console.log('Ignored - interactive element');
        return;
    }
    
    if (locked) {
        console.log('Ignored - locked');
        return;
    }
    
    if (isInteracting) {
        console.log('Ignored - interacting');
        return;
    }
    
    console.log('Navigating forward');
    // Right click = forward
    advance(1);
});
