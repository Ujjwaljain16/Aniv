// Development Navigation Shortcuts
// Press number keys to jump to sections quickly during development

// Only enable in development (localhost)
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

if (isDev) {
    document.addEventListener('keydown', (e) => {
        // Only work if not typing in an input
        if (e.target.tagName === 'INPUT') return;
        
        const shortcuts = {
            '1': 0,  // ref-arrival
            '2': 1,  // ref-distance
            '3': 2,  // ref-effort
            '4': 3,  // ref-meeting
            '5': 4,  // ref-growth (THE ONE YOU WANT!)
            '6': 5,  // ref-choice
            '7': 6,  // ref-gratitude
            '8': 7,  // ref-pre-chapters
            '9': 8,  // ref-chapters
        };
        
        if (shortcuts.hasOwnProperty(e.key)) {
            e.preventDefault();
            
            // Hide gateway/arrival/pause-room screens
            const gateway = document.getElementById('gateway');
            const arrival = document.getElementById('arrival');
            const pauseRoom = document.getElementById('pause-room');
            const app = document.getElementById('app');
            
            if (gateway) {
                gateway.style.opacity = '0';
                gateway.style.pointerEvents = 'none';
            }
            if (arrival) {
                arrival.style.opacity = '0';
                arrival.style.pointerEvents = 'none';
            }
            if (pauseRoom) {
                pauseRoom.style.opacity = '0';
                pauseRoom.style.pointerEvents = 'none';
            }
            if (app) {
                app.style.opacity = '1';
                app.style.pointerEvents = 'auto';
            }
            
            // Unlock if locked
            if (window.isLocked !== undefined) {
                window.isLocked = false;
            }
            
            // Jump to section
            const targetIndex = shortcuts[e.key];
            if (window.flow) {
                // Hide all sections first
                window.flow.forEach(id => {
                    document.getElementById(id)?.classList.remove('active');
                });
                
                // Show target and update BOTH currentIndex variables
                window.currentIndex = targetIndex;
                // Also update the local currentIndex in main.js scope
                if (window.updateCurrentIndex) {
                    window.updateCurrentIndex(targetIndex);
                }
                document.getElementById(window.flow[targetIndex])?.classList.add('active');
                
                console.log(`🚀 Jumped to: ${window.flow[targetIndex]}`);
            }
        }
        
        // Press 'R' to reload from start
        if (e.key === 'r' || e.key === 'R') {
            location.reload();
        }
    });

    console.log('🎮 DEV SHORTCUTS ACTIVE:');
    console.log('Press 1-9 to jump to sections');
    console.log('Press 5 for Growth section');
    console.log('Press R to reload');
} else {
    console.log('📱 Production mode - use tap/click navigation');
}
