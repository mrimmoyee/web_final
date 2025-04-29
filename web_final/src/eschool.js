// Global indices for tutorials and resources
let currentTutorialIndex = 0;
let currentResourceIndex = 0;

// Toggle Guide Assistant
export function toggleGuide() {
    const guide = document.getElementById('guideAssistant');
    if (guide) {
        guide.style.display = guide.style.display === 'block' ? 'none' : 'block';
        console.log('Toggled guide visibility:', guide.style.display);
    } else {
        console.log('Guide assistant element not found');
    }
}

// Toggle Light/Dark Mode with localStorage persistence
export function toggleMode() {
    const body = document.body;
    const modeBtn = document.querySelector('.mode-btn');
    const modeIcon = modeBtn ? modeBtn.querySelector('.mode-icon') : null;

    body.classList.toggle('light-mode');
    const isLightMode = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    console.log('Toggled theme:', isLightMode ? 'light' : 'dark');

    if (modeBtn) {
        if (isLightMode) {
            modeBtn.innerHTML = '<i class="fas fa-sun mode-icon"></i> Light Mode';
        } else {
            modeBtn.innerHTML = '<i class="fas fa-moon mode-icon"></i> Dark Mode';
        }
    } else {
        console.log('Mode button not found');
    }
}

// Apply saved theme on page load
export function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const modeBtn = document.querySelector('.mode-btn');
        if (modeBtn) {
            modeBtn.innerHTML = '<i class="fas fa-sun mode-icon"></i> Light Mode';
        }
        console.log('Applied saved theme: light');
    } else {
        console.log('No saved theme or theme is dark');
    }
}

// Infinite 3D Carousel Scrolling
let scrollPosition = 0;
const tileWidth = 270; // Width of tile + gap (250px + 20px)
let realTileCount = 0;
let totalTileCount = 0;

export function initializeCarousel() {
    console.log('Initializing carousel...');
    const carousel = document.getElementById('carousel');
    if (!carousel) {
        console.log('No carousel found on this page, skipping initialization.');
        return; // Exit if carousel doesn't exist
    }

    console.log('Carousel found, setting up tiles...');
    const originalTiles = Array.from(carousel.children);
    realTileCount = originalTiles.length;
    console.log('Number of original tiles:', realTileCount);

    // Clone tiles for infinite scrolling (duplicate at start and end)
    const clonesBefore = originalTiles.map(tile => {
        const clone = tile.cloneNode(true);
        clone.classList.add('clone');
        return clone;
    });
    const clonesAfter = originalTiles.map(tile => {
        const clone = tile.cloneNode(true);
        clone.classList.add('clone');
        return clone;
    });

    // Add cloned tiles to the carousel
    clonesBefore.forEach(clone => carousel.insertBefore(clone, carousel.firstChild));
    clonesAfter.forEach(clone => carousel.appendChild(clone));

    totalTileCount = carousel.children.length;
    console.log('Total tiles after cloning:', totalTileCount);

    // Set initial scroll position to the start of the real tiles
    scrollPosition = -realTileCount * tileWidth;
    carousel.style.transform = `translateX(${scrollPosition}px)`;
    console.log('Initial scroll position set:', scrollPosition);

    // Re-attach event listeners to all tiles
    const allTiles = document.querySelectorAll('.tile');
    console.log('Attaching event listeners to', allTiles.length, 'tiles');
    allTiles.forEach((tile, index) => {
        tile.addEventListener('click', () => {
            const subject = tile.getAttribute('data-subject');
            console.log(`Tile ${index} clicked, redirecting to course-details.html?subject=${subject}`);
            window.location.href = `course-details.html?subject=${encodeURIComponent(subject)}`;
        });
    });

    // Apply initial 3D effects and highlight middle tile
    updateTileEffects();
    console.log('Carousel initialization complete');
}

export function scrollCarousel(direction) {
    console.log('Scrolling carousel:', direction);
    const carousel = document.getElementById('carousel');
    if (!carousel) return; // Exit if carousel doesn't exist

    const tiles = carousel.children;

    // Calculate the new scroll position
    scrollPosition += direction === 'left' ? tileWidth : -tileWidth;

    // Apply smooth transition
    carousel.style.transition = 'transform 0.5s ease';
    carousel.style.transform = `translateX(${scrollPosition}px)`;

    // Check boundaries for infinite scroll
    requestAnimationFrame(() => {
        const maxScroll = 0; // Rightmost edge (start of clones before)
        const minScroll = -(realTileCount * tileWidth * 2); // Leftmost edge (end of clones after)

        if (scrollPosition >= maxScroll) {
            // Jump to the start of the real tiles after the animation
            setTimeout(() => {
                carousel.style.transition = 'none';
                scrollPosition = -realTileCount * tileWidth;
                carousel.style.transform = `translateX(${scrollPosition}px)`;
                updateTileEffects();
            }, 500); // Match transition duration
        } else if (scrollPosition <= minScroll) {
            // Jump to the end of the real tiles after the animation
            setTimeout(() => {
                carousel.style.transition = 'none';
                scrollPosition = -realTileCount * tileWidth;
                carousel.style.transform = `translateX(${scrollPosition}px)`;
                updateTileEffects();
            }, 500); // Match transition duration
        } else {
            updateTileEffects();
        }
    });
}

function updateTileEffects() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return; // Exit if carousel doesn't exist

    const tiles = carousel.children;

    const centerIndex = Math.floor((totalTileCount + (scrollPosition / tileWidth)) % realTileCount);
    Array.from(tiles).forEach((tile, index) => {
        const relativeIndex = (index - realTileCount + totalTileCount) % totalTileCount;
        const offset = (index - centerIndex) * 5; // Smaller offset for smoother 3D effect
        tile.style.transform = `translateZ(0px) rotateY(${offset / 10}deg) scale(${Math.abs(offset) === 0 ? 1.2 : 1})`; // Front-facing, scale up middle
        if (Math.abs(offset) === 0) {
            tile.classList.add('middle-tile');
        } else {
            tile.classList.remove('middle-tile');
        }
    });
}

// Event listeners for subject tiles and activity button
document.addEventListener('DOMContentLoaded', () => {
    console.log('eschool.js DOMContentLoaded event fired');
    const activityBtn = document.getElementById('activityBtn');

    // Initialize the carousel for infinite scrolling, if it exists
    initializeCarousel();

    if (activityBtn) {
        activityBtn.addEventListener('click', () => {
            alert('Activity started! Enjoy learning!');
            activityBtn.classList.add('pulse');
        });
    }

    // Apply saved theme on page load
    applySavedTheme();
});
