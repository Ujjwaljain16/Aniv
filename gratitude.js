// Gratitude Section - Receipt of Quiet Things

let gratitudeInitialized = false;

function initGratitude() {
    if (gratitudeInitialized) return;
    gratitudeInitialized = true;
    
    const gratitudeSection = document.getElementById('ref-gratitude');
    if (!gratitudeSection) return;
    
    const items = gratitudeSection.querySelectorAll('.gratitude-item');
    const finalText = document.getElementById('gratitude-final');
    
    console.log('🌸 Gratitude initialized, fading in items...');
    
    // Fade in items one by one
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
            console.log(`Item ${index + 1} visible`);
        }, (index + 1) * 1200); // 1.2s between each item
    });
    
    // Show final text after all items
    const totalDelay = items.length * 1200 + 2000; // Extra 2s after last item
    setTimeout(() => {
        if (finalText) {
            finalText.classList.add('revealed');
            console.log('Final text revealed');
        }
    }, totalDelay);
}

// Initialize when Gratitude section becomes active
document.addEventListener('DOMContentLoaded', () => {
    const gratitudeSection = document.getElementById('ref-gratitude');
    if (!gratitudeSection) return;
    
    // Check if already active
    if (gratitudeSection.classList.contains('active')) {
        initGratitude();
    }
    
    // Watch for active class
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active') && 
                mutation.target.id === 'ref-gratitude') {
                initGratitude();
            }
        });
    });
    
    observer.observe(gratitudeSection, { attributes: true, attributeFilter: ['class'] });
});
