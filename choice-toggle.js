// Multiple Choice Toggles Interaction

let currentToggle = 0;
const totalToggles = 5;
let isToggling = false;
let darknessLevel = 0;

function initChoiceToggles() {
    const container = document.getElementById('choice-toggles-container');
    const finalText = document.getElementById('choice-final-text');
    
    if (!container || !finalText) return;
    
    const toggleItems = container.querySelectorAll('.choice-toggle-item');
    
    // Show first toggle in NEUTRAL state (not activated)
    if (toggleItems[0]) {
        toggleItems[0].classList.add('visible');
        // Don't add 'active' class - let user click to activate
    }
    
    // Click anywhere in container to advance
    container.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent navigation
        
        if (isToggling || currentToggle >= totalToggles) return;
        
        activateNextToggle(toggleItems, finalText, container);
    });
}

function activateNextToggle(toggleItems, finalText, container) {
    if (currentToggle >= totalToggles) return;
    
    isToggling = true;
    const toggle = toggleItems[currentToggle];
    
    // 1. Activate current toggle (already visible)
    toggle.classList.add('active');
    
    // 2. Swap text
    const beforeText = toggle.querySelector('.before-text');
    const afterText = toggle.querySelector('.after-text');
    
    setTimeout(() => {
        if (beforeText) beforeText.style.display = 'none';
        if (afterText) afterText.style.display = 'block';
    }, 400);
    
    // 3. Slight background darkening
    darknessLevel += 0.02;
    document.body.style.filter = `brightness(${1 - darknessLevel})`;
    
    // 4. Wait for text to be visible
    setTimeout(() => {
        currentToggle++;
        
        // 5. Check if all toggles done
        if (currentToggle >= totalToggles) {
            // Last toggle lingers longer
            setTimeout(() => {
                // Hide container
                container.style.transition = 'opacity 2s ease';
                container.style.opacity = '0';
                
                // Reveal final text (synced with container fade)
                setTimeout(() => {
                    finalText.classList.add('revealed');
                }, 1500); // Sync with container fade
            }, 2500); // Linger on last toggle
        } else {
            // Fade out current toggle (both knob and text together)
            setTimeout(() => {
                toggle.classList.remove('active');
                toggle.classList.add('completed');
                toggle.style.transition = 'opacity 1s ease';
                toggle.style.opacity = '0';
                
                // After current toggle fades completely, show next
                setTimeout(() => {
                    // Reset current toggle state
                    toggle.classList.remove('visible', 'completed');
                    toggle.style.opacity = '';
                    
                    // Reset text for next time (if needed)
                    if (beforeText) beforeText.style.display = 'block';
                    if (afterText) afterText.style.display = 'none';
                    
                    // Show next toggle in neutral state
                    const nextToggle = toggleItems[currentToggle];
                    if (nextToggle) {
                        nextToggle.classList.add('visible');
                        // Don't add 'active' - let user click to activate
                        isToggling = false;
                    }
                }, 1000); // Wait for fade to complete
            }, 2000); // Keep text visible for 2 seconds
        }
    }, 800);
}

// Initialize when Choice section becomes active
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active') && 
                mutation.target.id === 'ref-choice') {
                initChoiceToggles();
                observer.disconnect();
            }
        });
    });
    
    const choiceSection = document.getElementById('ref-choice');
    if (choiceSection) {
        observer.observe(choiceSection, { attributes: true, attributeFilter: ['class'] });
    }
});
