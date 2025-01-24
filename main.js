document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character');
    const heart = document.getElementById('heart');
    const message = document.getElementById('message');
    const victorySound = document.getElementById('victory-sound');
    const backgroundMusic = document.getElementById('background-music');
    const startScreen = document.getElementById('start-screen');
    const playButton = document.getElementById('play-button');
    const gameContainer = document.querySelector('.game-container');
    
    let position = 50;
    let isJumping = false;
    let gameCompleted = false;
    
    // Try to force landscape orientation on mobile devices
    async function forceLandscape() {
        try {
            await document.documentElement.requestFullscreen();
            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape');
            }
        } catch (err) {
            console.log('Could not force landscape orientation:', err);
        }
    }
    
    // Call forceLandscape when the page loads and when orientation changes
    forceLandscape();
    window.addEventListener('orientationchange', forceLandscape);
    
    function moveCharacter() {
        if (gameCompleted) return;
        
        const containerWidth = gameContainer.offsetWidth;
        const step = containerWidth / 600; // Adjust speed based on container width
        
        position += step;
        character.style.left = position + 'px';
        
        // Auto jump near platforms
        const platforms = document.querySelectorAll('.platform');
        platforms.forEach(platform => {
            const platformLeft = platform.offsetLeft;
            if (position >= platformLeft - 50 && position <= platformLeft - 30 && !isJumping) {
                jump();
            }
        });
        
        // Check for heart collision
        const heartRect = heart.getBoundingClientRect();
        const characterRect = character.getBoundingClientRect();
        
        if (characterRect.right >= heartRect.left && 
            characterRect.left <= heartRect.right && 
            !gameCompleted) {
            completeGame();
        }
        
        if (position < containerWidth - 50) {
            requestAnimationFrame(moveCharacter);
        }
    }
    
    function jump() {
        if (isJumping) return;
        isJumping = true;
        character.style.animation = 'jump 1s';
        
        setTimeout(() => {
            character.style.animation = 'none';
            isJumping = false;
        }, 1000);
    }
    
    function completeGame() {
        gameCompleted = true;
        victorySound.play();
        message.classList.remove('hidden');
        message.classList.add('show');
        
        // Start background music after victory sound
        victorySound.addEventListener('ended', () => {
            backgroundMusic.play();
        });
    }
    
    // Handle orientation change
    window.addEventListener('resize', () => {
        if (!gameCompleted) {
            position = 50;
            character.style.left = position + 'px';
        }
    });
    
    // Start game when play button is clicked
    playButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        forceLandscape(); // Try to force landscape when starting
        setTimeout(() => {
            moveCharacter();
        }, 1000);
    });
    
    // Prevent scrolling on mobile
    document.body.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
});