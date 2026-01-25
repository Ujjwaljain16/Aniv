// Final Section - Cinematic Image Reveal

function initFinalSection() {
    const stayBtn = document.getElementById('btn-stay');
    const initialText = document.getElementById('initial-text');
    const imageContainer = document.getElementById('final-image-container');
    const finalTextContainer = document.getElementById('final-text-container');
    
    console.log('🎉 Final section elements:', { 
        stayBtn: !!stayBtn, 
        initialText: !!initialText, 
        imageContainer: !!imageContainer, 
        finalTextContainer: !!finalTextContainer 
    });
    
    if (!stayBtn || !initialText || !imageContainer || !finalTextContainer) {
        console.error('Missing elements!');
        return;
    }
    
    console.log('✅ All elements found, setting up click handler');
    
    stayBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent navigation
        
        console.log('🎬 Stay button clicked - beginning cinematic reveal');
        
        // 1. Fade out initial text and button together
        console.log('Step 1: Fading out initial text');
        requestAnimationFrame(() => {
            initialText.style.opacity = '0';
            initialText.style.transform = 'translateY(-20px)';
        });
        
        setTimeout(() => {
            console.log('Step 2: Hiding initial text, showing image container');
            initialText.style.display = 'none';
            
            // 2. Reveal the image with scale animation
            imageContainer.style.display = 'block';
            
            // Force reflow to ensure display:block is applied
            imageContainer.offsetHeight;
            
            requestAnimationFrame(() => {
                console.log('Step 3: Animating image in');
                imageContainer.style.opacity = '1';
                imageContainer.style.transform = 'scale(1)';
            });
            
            // 3. After image is fully visible, show final text
            setTimeout(() => {
                console.log('Step 4: Showing final text container');
                finalTextContainer.style.display = 'block';
                
                // Force reflow
                finalTextContainer.offsetHeight;
                
                requestAnimationFrame(() => {
                    console.log('Step 5: Fading in final text');
                    finalTextContainer.style.opacity = '1';
                });
                
                // 4. Subtle heart pulse animation
                setTimeout(() => {
                    console.log('Step 6: Starting heart pulse');
                    const hearts = finalTextContainer.querySelectorAll('p');
                    console.log('Found paragraphs:', hearts.length);
                    
                    // The heart is the second paragraph
                    if (hearts.length >= 2) {
                        const heart = hearts[1];
                        heart.style.transition = 'transform 0.3s ease';
                        
                        setInterval(() => {
                            requestAnimationFrame(() => {
                                heart.style.transform = 'scale(1.15)';
                                setTimeout(() => {
                                    requestAnimationFrame(() => {
                                        heart.style.transform = 'scale(1)';
                                    });
                                }, 300);
                            });
                        }, 2000);
                        
                        console.log('❤️ Heart pulse started');
                        
                        // 5. After heart pulses, expand image to fullscreen B&W overlay
                        setTimeout(() => {
                            console.log('Step 7: Expanding to fullscreen overlay');
                            
                            // Fade out text first
                            finalTextContainer.style.transition = 'opacity 1s ease';
                            finalTextContainer.style.opacity = '0';
                            
                            // Expand image to fullscreen after short delay
                            setTimeout(() => {
                                imageContainer.style.transition = 'all 2s ease';
                                imageContainer.style.position = 'fixed';
                                imageContainer.style.top = '0';
                                imageContainer.style.left = '0';
                                imageContainer.style.width = '100vw';
                                imageContainer.style.height = '100vh';
                                imageContainer.style.maxWidth = 'none';
                                imageContainer.style.margin = '0';
                                imageContainer.style.zIndex = '9999';
                                imageContainer.style.borderRadius = '0';
                                
                                const img = imageContainer.querySelector('img');
                                if (img) {
                                    img.style.width = '100%';
                                    img.style.height = '100%';
                                    img.style.objectFit = 'cover'; // Fill entire screen
                                    img.style.objectPosition = 'center 35%'; // Focus on faces (upper portion)
                                    img.style.borderRadius = '0';
                                    img.style.filter = 'grayscale(100%)';
                                }
                                
                                // --- NEW SEQUENCE STARTS HERE ---
                                // 6. Pause for 2 seconds, then zoom in slowly
                                setTimeout(() => {
                                    console.log('Step 8: Zooming starts');
                                    
                                    // Start with just zoom (very slow)
                                    if (img) {
                                        img.style.transition = 'transform 15s ease-out'; // Long zoom duration
                                        img.style.transform = 'scale(1.3)'; // Zoom in
                                    }

                                    // 7. Wait 4 seconds, THEN start fading out slowly (while zoom continues)
                                    setTimeout(() => {
                                         console.log('Step 9: Fading out image slowly');
                                         if (img) {
                                            // Update transition to include opacity
                                            img.style.transition = 'transform 15s ease-out, opacity 5s ease'; 
                                            img.style.opacity = '0';
                                         }
                                         
                                         // Fade container too
                                         imageContainer.style.transition = 'opacity 5s ease';
                                         imageContainer.style.opacity = '0';

                                         // 8. Show the final black screen text after fade completes
                                         setTimeout(() => {
                                            console.log('Step 10: Showing really final message');
                                            const reallyFinalMsg = document.getElementById('really-final-message');
                                            if (reallyFinalMsg) {
                                                reallyFinalMsg.style.display = 'flex';
                                                reallyFinalMsg.style.pointerEvents = 'auto';
                                                // Force reflow
                                                reallyFinalMsg.offsetHeight;
                                                reallyFinalMsg.style.opacity = '1';
                                                
                                                // 9. Final Redirect/Reload after reading
                                                setTimeout(() => {
                                                    console.log('👋 sequence complete, reloading');
                                                    location.reload();
                                                }, 10000); // Wait 10s for reading
                                            }
                                         }, 5000); // 5s fade duration

                                    }, 4000); // Wait 4s before starting fade

                                }, 2000); // 2s pause after fullscreen

                            }, 500);
                        }, 4000); // Wait 4s after heart starts pulsing
                    }
                }, 500);
            }, 3200); // Wait 3.2s after image animation starts (3s transition + 200ms)
        }, 1500); // Wait for initial text to fade out
    });
    
    console.log('✅ Click handler attached to Stay button');
}

// Initialize when Final section becomes active
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, setting up observer for final section');
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active') && 
                mutation.target.id === 'ref-final') {
                console.log('🎯 Final section became active!');
                initFinalSection();
                observer.disconnect();
            }
        });
    });
    
    const finalSection = document.getElementById('ref-final');
    if (finalSection) {
        console.log('✅ Final section found, observing for active class');
        observer.observe(finalSection, { attributes: true, attributeFilter: ['class'] });
        
        // Also check if it's already active
        if (finalSection.classList.contains('active')) {
            console.log('🎯 Final section already active!');
            initFinalSection();
        }
    } else {
        console.error('❌ Final section not found!');
    }
});
