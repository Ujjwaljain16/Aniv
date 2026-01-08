
// ========================================
// GROWTH SECTION: CLIMBING STEPS INTERACTION
// ========================================

let currentStep = 1;
const totalSteps = 7;
let isRevealing = false; // Lock to prevent multiple reveals

function initClimbingSteps() {
    const growthSection = document.getElementById('ref-growth');
    const stepsContainer = growthSection?.querySelector('.growth-steps-container');
    const instruction = document.getElementById('climb-instruction');
    
    if (!stepsContainer) return;
    
    // Click handler for the container
    stepsContainer.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent bubbling to main navigation
        
        // Prevent multiple reveals at once
        if (isRevealing) return;
        
        if (currentStep < totalSteps) {
            isRevealing = true; // Lock
            currentStep++;
            const nextStep = stepsContainer.querySelector(`[data-step="${currentStep}"]`);
            
            if (nextStep) {
                nextStep.style.display = 'flex';
                nextStep.style.flexDirection = 'column';
                // Trigger animation
                setTimeout(() => {
                    nextStep.style.opacity = '1';
                    nextStep.style.transform = 'translateY(0)';
                    // Smooth scroll to new step
                    nextStep.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Unlock after animation completes
                    setTimeout(() => {
                        isRevealing = false;
                    }, 800); // Match animation duration
                }, 50);
            } else {
                isRevealing = false; // Unlock if step not found
            }
            
            // Hide instruction after first click
            if (currentStep === 2 && instruction) {
                instruction.style.opacity = '0';
                setTimeout(() => instruction.style.display = 'none', 500);
            }
        }
    });
}

// Initialize when Growth section becomes active
document.addEventListener('DOMContentLoaded', () => {
    // We'll call this when the section becomes active
    // For now, initialize on load
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active') && 
                mutation.target.id === 'ref-growth') {
                initClimbingSteps();
                observer.disconnect();
            }
        });
    });
    
    const growthSection = document.getElementById('ref-growth');
    if (growthSection) {
        observer.observe(growthSection, { attributes: true, attributeFilter: ['class'] });
    }
});
