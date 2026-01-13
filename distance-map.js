// Distance Map - Cinematic Scroll Interactions
// Handles progressive reveal, line drawing, moon pulse, and scroll hint

let scrollHintShown = false;
let moonPulsed = false;
let lineDrawObserver = null;
let revealObserver = null;

export function initDistanceMap() {
    console.log('🗺️ Initializing Distance Map interactions');
    
    // Setup progressive reveal for all map elements
    setupProgressiveReveal();
    
    // Setup line drawing animation
    setupLineDrawing();
    
    // Setup moon pulse moment
    setupMoonPulse();
    
    // Setup scroll hint
    setupScrollHint();
}

export function cleanupDistanceMap() {
    if (lineDrawObserver) lineDrawObserver.disconnect();
    if (revealObserver) revealObserver.disconnect();
    scrollHintShown = false;
    moonPulsed = false;
}

// Progressive reveal - elements fade in as they enter viewport
function setupProgressiveReveal() {
    const mapElements = document.querySelectorAll('[data-reveal]');
    
    if (!mapElements.length) return;
    
    // Start all elements hidden
    mapElements.forEach(el => {
        el.classList.add('map-element-hidden');
    });
    
    // Observe and reveal as they enter viewport
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.remove('map-element-hidden');
                    entry.target.classList.add('map-element-visible');
                }, 100);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });
    
    mapElements.forEach(el => revealObserver.observe(el));
}

// Line drawing - grows with scroll position
function setupLineDrawing() {
    const mapSection = document.getElementById('ref-map');
    const line = document.querySelector('.map-line');
    
    if (!mapSection || !line) return;
    
    mapSection.addEventListener('scroll', () => {
        const scrollLeft = mapSection.scrollLeft;
        const scrollWidth = mapSection.scrollWidth - mapSection.clientWidth;
        const scrollPercent = (scrollLeft / scrollWidth) * 100;
        
        // Draw line from 0% to 100% based on scroll
        line.style.width = `${Math.min(scrollPercent, 100)}%`;
    });
}

// Moon pulse - single glow when moon reaches center
function setupMoonPulse() {
    const moon = document.getElementById('map-moon');
    const moonDate = document.getElementById('moon-date');
    
    if (!moon) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !moonPulsed) {
                moonPulsed = true;
                
                // Add glow and pulse
                moon.classList.add('moon-glow');
                
                // Fade in date after pulse
                if (moonDate) {
                    setTimeout(() => {
                        moonDate.style.opacity = '0.6';
                    }, 800);
                }
                
                observer.disconnect();
            }
        });
    }, {
        threshold: 0.8,
        rootMargin: '0px'
    });
    
    observer.observe(moon);
}

// Scroll hint - fades after first scroll
function setupScrollHint() {
    const hint = document.querySelector('.scroll-hint');
    const mapSection = document.getElementById('ref-map');
    
    if (!hint || !mapSection) return;
    
    const hideHint = () => {
        if (!scrollHintShown) {
            scrollHintShown = true;
            hint.classList.add('hidden');
            mapSection.removeEventListener('scroll', hideHint);
        }
    };
    
    mapSection.addEventListener('scroll', hideHint);
    
    // Also hide after 5 seconds if no scroll
    setTimeout(() => {
        if (!scrollHintShown) {
            hint.classList.add('hidden');
        }
    }, 5000);
}
