const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    if(tg.setHeaderColor) tg.setHeaderColor('#111827');
    if(tg.setBackgroundColor) tg.setBackgroundColor('#000000');
}

const viewerContainer = document.getElementById('viewer-container');
const imageEl = document.getElementById('med-image');
const slider = document.getElementById('slice-slider');
const hudInfo = document.getElementById('hud-info');
const loadingEl = document.getElementById('loading');
const caseSelect = document.getElementById('case-select');

let currentDataset = null;
let imageCache = [];
let currentIndex = 0;
let totalSlices = 0;

let isDragging = false;
let startY = 0;
let startIndexTemp = 0;

async function loadDataset(caseId) {
    loadingEl.style.display = 'block';
    imageEl.style.display = 'none';
    hudInfo.innerHTML = 'Chargement...';
    
    slider.disabled = true;
    imageCache = [];

    try {
        const response = await fetch(`datasets/${caseId}/metadata.json`);
        const metadata = await response.json();
        currentDataset = metadata;
        totalSlices = metadata.total_slices;
        
        slider.max = totalSlices - 1;
        
        let loadedCount = 0;
        hudInfo.innerHTML = `Téléchargement (0/${totalSlices})...`;

        // Parallel download of images
        const promises = metadata.slices.map((filename, i) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    hudInfo.innerHTML = `Téléchargement (${loadedCount}/${totalSlices})...`;
                    resolve(img);
                };
                img.onerror = () => {
                    resolve(null);
                };
                img.src = `datasets/${caseId}/${filename}`;
            });
        });

        // Wait for all to load
        const loadedImages = await Promise.all(promises);
        
        // Filter out any failed loads
        imageCache = loadedImages.filter(img => img !== null);
        totalSlices = imageCache.length;
        slider.max = totalSlices - 1;
        
        currentIndex = Math.floor(totalSlices / 2); // Start in the middle
        slider.value = currentIndex;
        slider.disabled = false;
        
        loadingEl.style.display = 'none';
        imageEl.style.display = 'block';
        
        updateRenderer();
        
    } catch (e) {
        hudInfo.innerHTML = 'Erreur lors du chargement des données.';
        loadingEl.style.display = 'none';
        console.error(e);
    }
}

function updateRenderer() {
    if (imageCache.length === 0) return;
    
    // Clamp index
    currentIndex = Math.max(0, Math.min(totalSlices - 1, currentIndex));
    
    // Set Image
    imageEl.src = imageCache[currentIndex].src;
    
    // Update HUD
    hudInfo.innerHTML = `Coupe: ${currentIndex + 1}/${totalSlices}<br>Z-Index: ${(currentIndex * 1.0).toFixed(1)}mm`;
    
    // Haptic feedback edge bump
    if (currentIndex === 0 || currentIndex === totalSlices - 1) {
        if(tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    }
}

// SLIDER Interaction
slider.addEventListener('input', (e) => {
    currentIndex = parseInt(e.target.value);
    updateRenderer();
});

// TOUCH INTERACTION (Scroll like in RadiAnt or Cornerstone)
viewerContainer.addEventListener('touchstart', (e) => {
    if(imageCache.length === 0) return;
    isDragging = true;
    startY = e.touches[0].clientY;
    startIndexTemp = currentIndex;
    e.preventDefault(); // prevent scroll
}, { passive: false });

viewerContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientY = e.touches[0].clientY;
    const deltaY = clientY - startY;
    
    // Sensitivity: 1 slice per 3 pixels of drag
    const sliceDelta = Math.floor(deltaY / -5); 
    
    const newIdx = startIndexTemp + sliceDelta;
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx < totalSlices) {
        currentIndex = newIdx;
        slider.value = currentIndex;
        updateRenderer();
    }
}, { passive: false });

viewerContainer.addEventListener('touchend', () => {
    isDragging = false;
});

// MOUSE INTERACTION
viewerContainer.addEventListener('mousedown', (e) => {
    if(imageCache.length === 0) return;
    isDragging = true;
    startY = e.clientY;
    startIndexTemp = currentIndex;
    e.preventDefault();
});

viewerContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientY = e.clientY;
    const deltaY = clientY - startY;
    
    const sliceDelta = Math.floor(deltaY / -5); 
    
    const newIdx = startIndexTemp + sliceDelta;
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx < totalSlices) {
        currentIndex = newIdx;
        slider.value = currentIndex;
        updateRenderer();
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

viewerContainer.addEventListener('wheel', (e) => {
    if(imageCache.length === 0) return;
    e.preventDefault();
    const sliceDelta = e.deltaY > 0 ? 1 : -1;
    currentIndex += sliceDelta;
    slider.value = currentIndex;
    updateRenderer();
}, { passive: false });


// Add case switch listener
caseSelect.addEventListener('change', (e) => {
    loadDataset(e.target.value);
});


// Init
loadDataset('neuro_case1');
