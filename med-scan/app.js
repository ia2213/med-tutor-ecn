const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const CASES = {
  neuro_mri_reel: {
    label: '🧠 IRM Cérébrale – Patient SEP (T1w)',
    specialty: 'Neurochirurgie',
    guide: {
      objectif: 'Identifier les lésions de démyélinisation, évaluer la charge lésionnelle, chercher un effet de masse.',
      structures: ['Cortex (substance grise)', 'Substance blanche (SB)', 'Corps calleux', 'Noyaux gris centraux (NGC)', 'Ventricules latéraux', 'Cervelet', 'Tronc cérébral (TC)', 'Citerne de la base'],
      chercher: ['Hypersignaux T2/FLAIR en SB → plaques SEP', 'Effet de masse → déviation ligne médiane', 'Prise de contraste annulaire → tumeur ou abcès', 'Dilatation ventriculaire → hydrocéphalie'],
      urgences: ['Déviation ligne médiane > 5mm → bloc', 'Effacement sillons + HIC → PL contre-indiquée', 'Herniation uncale → midriase + trouble conscience'],
      fenetres: ['Cerveau: W 80 / L 40', 'Os: W 2000 / L 600'],
      mnemo: '"SCAN‑SEP": Sillons, Corps calleux, Asymétrie, NGC, SEP-plaques, Effet de masse, Prise contraste'
    },
    quiz: [
      { q: 'Un hypersignal FLAIR périventriculaire chez un patient de 35 ans évoque en premier :', options: ['SEP', 'AVC lacunaire', 'Glioblastome', 'Métastase'], answer: 0, exp: 'Les plaques de SEP sont typiquement périventriculaires, ovoïdes, orientées perpendiculairement aux ventricules (doigts de Dawson).' },
      { q: 'La déviation de la ligne médiane à partir de combien de mm est une indication neurochirurgicale urgente ?', options: ['5 mm', '10 mm', '2 mm', '15 mm'], answer: 0, exp: 'Au-delà de 5mm de déviation, le risque d engagement est majeur et la chirurgie d urgence doit être discutée.' }
    ]
  },
  scanner_crane_reel: {
    label: '💻 Scanner Cérébral – Patient Réel (DICOM)',
    specialty: 'Neurochirurgie',
    guide: {
      objectif: 'Dépister une hémorragie intracrânienne, un effet de masse, une contusion osseuse ou un processus expansif.',
      structures: ['Voûte crânienne (os)', 'Espaces sous-arachnoïdiens (ESA)', 'Parenchyme cérébral', 'Citernes de la base', 'Tentoire du cervelet', 'Sinus veineux dure-mériens'],
      chercher: ['Hyperdensité spontanée (≥60 UH) = sang frais → hématome', 'Hypodensité = oedème, ischémie, nécrose', 'Effacement cisternae = engagement', 'Fracture crânienne = fenêtre osseuse obligatoire'],
      urgences: ['Hématome sous-dural > 1cm → évacuation chirurgicale', 'Déviation ligne médiane > 5mm → bloc', 'Effacement citernes basales → engagement iminent → ACSOS'],
      fenetres: ['Parenchyme: W 80 / L 40', 'Hématome: W 150 / L 75', 'Os: W 2000 / L 600'],
      mnemo: '"ABCDE-neuro": Asymétrie, Blood (hyperdensité), Citernes, Déviation, Effet de masse'
    },
    quiz: [
      { q: 'Une lésion spontanément hyperdense en TDM sans injection correspond à :', options: ['Du sang frais', 'Une tumeur', 'Un oedème', 'Du LCS'], answer: 0, exp: 'Les produits de dégradation de l hémoglobine (oxyhémoglobine puis méthémoglobine) absorbent fortement les RX → hyperdensité spontanée (60-90 UH).' },
      { q: 'Le signe de l hyperdensité spontanée de l artère sylvienne signe :', options: ['Thrombus intra-artériel (AVC ischémique)', 'Hémorragie méningée', 'Contusion cérébrale', 'Abcès'], answer: 0, exp: 'Le "Dense MCA sign" traduit un thrombus dans l artère sylvienne et est corrélé à un mauvais pronostic sans thrombolyse/thrombectomie.' }
    ]
  },
  radio_rachis_reel: {
    label: '🦴 Radiographie Rachis – Patient Réel',
    specialty: 'Orthopédie',
    guide: {
      objectif: 'Analyser l alignement rachidien, la hauteur discale, les pédicules, les plateaux vertébraux et les parties molles.',
      structures: ['Corps vertébraux (C1-S1)', 'Disques intervertébraux', 'Pédicules (double contour ovalaire)', 'Apophyses épineuses + lames', 'Articulations zygapophysaires', 'Mur postérieur'],
      chercher: ['Tassement cunéiforme → fracture ostéoporotique ou traumatique', 'Pincement discal asymétrique → hernie, instabilité', 'Lyse isthmique L4-L5-S1 → spondylolyse', 'Olisthésis (translation) → spondylolisthésis'],
      urgences: ['Translation > 3.5mm OU angulation > 11° → instabilité → immobiliser', 'Fracture burst + déficit neuro → chirurgie urgente', 'Dislocation C1-C2 → risque tétraplégique'],
      fenetres: ['Os: W 2000 / L 600', 'Parties molles: W 400 / L 60'],
      mnemo: '"ABCD-rachis": Alignement, Bords vertébraux, Corps vertébraux, Disques'
    },
    quiz: [
      { q: 'Un glissement antérieur du corps de L5 sur S1 associé à une lyse isthmique bilatérale définit :', options: ['Spondylolisthésis L5-S1', 'Hernie discale L5-S1', 'Fracture tassement', 'Métastase vertébrale'], answer: 0, exp: 'Le spondylolisthésis par lyse isthmique est la cause la plus fréquente chez le jeune adulte sportif. Grader selon Meyerding (I à IV selon % de glissement).' },
      { q: 'Quelle mesure sur la radio de face confirme une scoliose structurale ?', options: ['Angle de Cobb > 10°', 'Angle de Cobb > 5°', 'Translation > 3mm', 'Rotation > 2°'], answer: 0, exp: 'L angle de Cobb > 10° sur radio de face debout définit une scoliose structurale. Au-delà de 50°, la chirurgie est discutée.' }
    ]
  }
};

const imageEl = document.getElementById('med-image');
const slider = document.getElementById('slice-slider');
const hudInfo = document.getElementById('hud');
const loadingOverlay = document.getElementById('loading-overlay');
const progressBar = document.getElementById('progress-bar');
const loadingText = document.getElementById('loading-text');
const caseSelect = document.getElementById('case-select');
const specialtyBadge = document.getElementById('specialty-badge');
const viewerArea = document.getElementById('viewer-area');
const guideHeader = document.getElementById('guide-header');
const guideContent = document.getElementById('guide-content');
const guideChevron = document.getElementById('guide-chevron');
const guideText = document.getElementById('guide-text');
const btnFenetre = document.getElementById('btn-fenetre');
const quizModal = document.getElementById('quiz-modal');
const quizContainer = document.getElementById('quiz-container');

let imageCache = [];
let currentIndex = 0;
let totalSlices = 0;
let isDragging = false;
let startY = 0;
let startIndexTemp = 0;
let currentCaseId = '';
let boneWindow = false;

// Populate dropdown options text (in HTML the values match keys)
caseSelect.innerHTML = Object.keys(CASES).map(k => `<option value="${k}">${CASES[k].label}</option>`).join('');

async function loadDataset(caseId) {
    currentCaseId = caseId;
    const caseDef = CASES[caseId];
    specialtyBadge.innerText = caseDef.specialty;
    
    loadingOverlay.style.display = 'flex';
    imageEl.style.display = 'none';
    progressBar.style.width = '0%';
    slider.disabled = true;
    imageCache = [];

    renderGuide(caseDef.guide);

    try {
        const response = await fetch(`datasets/${caseId}/metadata.json`);
        if (!response.ok) throw new Error('Data not found');
        const metadata = await response.json();
        
        totalSlices = metadata.total_slices;
        slider.max = totalSlices - 1;
        
        let loadedCount = 0;
        loadingText.innerText = `Téléchargement (0/${totalSlices})...`;

        const promises = metadata.slices.map((filename) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    progressBar.style.width = `${(loadedCount/totalSlices)*100}%`;
                    loadingText.innerText = `Téléchargement (${loadedCount}/${totalSlices})...`;
                    resolve(img);
                };
                img.onerror = () => resolve(null);
                img.src = `datasets/${caseId}/${filename}`;
            });
        });

        const loadedImages = await Promise.all(promises);
        imageCache = loadedImages.filter(img => img !== null);
        totalSlices = imageCache.length;
        slider.max = totalSlices - 1;
        
        currentIndex = Math.floor(totalSlices / 2);
        slider.value = currentIndex;
        slider.disabled = false;
        
        loadingOverlay.style.display = 'none';
        imageEl.style.display = 'block';
        updateRenderer();
        
    } catch (e) {
        loadingText.innerText = 'Erreur de chargement (Le dataset est en cours de création)';
        console.error(e);
    }
}

function updateRenderer() {
    if (imageCache.length === 0) return;
    currentIndex = Math.max(0, Math.min(totalSlices - 1, currentIndex));
    imageEl.src = imageCache[currentIndex].src;
    hudInfo.innerHTML = `Coupe ${currentIndex + 1} / ${totalSlices}<br><span style="color:#8b949e">Z-Axis</span>`;
    
    if ((currentIndex === 0 || currentIndex === totalSlices - 1) && tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Windowing
btnFenetre.addEventListener('click', () => {
    boneWindow = !boneWindow;
    btnFenetre.classList.toggle('active', boneWindow);
    if(boneWindow) {
        imageEl.style.filter = "brightness(1.4) contrast(2)";
        btnFenetre.innerText = "Fenêtre Os";
    } else {
        imageEl.style.filter = "brightness(1) contrast(1)";
        btnFenetre.innerText = "Fenêtre Standard";
    }
});

function renderGuide(guide) {
    guideText.innerHTML = `
        <div class="mb-2"><strong>🎯 Objectif:</strong> ${guide.objectif}</div>
        <div class="mb-2"><strong>🔎 Structures à identifier:</strong><ul class="list-disc pl-5 mt-1">${guide.structures.map(s => `<li>${s}</li>`).join('')}</ul></div>
        <div class="mb-2"><strong>⚠️ À chercher:</strong><ul class="list-disc pl-5 mt-1">${guide.chercher.map(s => `<li>${s}</li>`).join('')}</ul></div>
        <div class="mb-2 text-[#ff7b72]"><strong>🚨 Critères d'urgence:</strong><ul class="list-disc pl-5 mt-1">${guide.urgences.map(s => `<li>${s}</li>`).join('')}</ul></div>
        <div class="mb-2 text-[#58a6ff]"><strong>💡 Modèle de lecture:</strong> ${guide.mnemo}</div>
    `;
}

guideHeader.addEventListener('click', () => {
    guideContent.classList.toggle('open');
    guideChevron.innerText = guideContent.classList.contains('open') ? '▲' : '▼';
});

caseSelect.addEventListener('change', (e) => loadDataset(e.target.value));
slider.addEventListener('input', (e) => { currentIndex = parseInt(e.target.value); updateRenderer(); });

// Interactions
viewerArea.addEventListener('touchstart', (e) => {
    if(!imageCache.length) return;
    isDragging = true; startY = e.touches[0].clientY; startIndexTemp = currentIndex;
    e.preventDefault();
}, { passive: false });

viewerArea.addEventListener('touchmove', (e) => {
    if (!isDragging) return; e.preventDefault();
    const deltaY = e.touches[0].clientY - startY;
    const sliceDelta = Math.floor(deltaY / -5); 
    const newIdx = startIndexTemp + sliceDelta;
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx < totalSlices) {
        currentIndex = newIdx; slider.value = currentIndex; updateRenderer();
    }
}, { passive: false });

viewerArea.addEventListener('touchend', () => isDragging = false);

viewerArea.addEventListener('mousedown', (e) => {
    if(!imageCache.length) return;
    isDragging = true; startY = e.clientY; startIndexTemp = currentIndex; e.preventDefault();
});

viewerArea.addEventListener('mousemove', (e) => {
    if (!isDragging) return; e.preventDefault();
    const sliceDelta = Math.floor((e.clientY - startY) / -5); 
    const newIdx = startIndexTemp + sliceDelta;
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx < totalSlices) {
        currentIndex = newIdx; slider.value = currentIndex; updateRenderer();
    }
});
window.addEventListener('mouseup', () => isDragging = false);

viewerArea.addEventListener('wheel', (e) => {
    if(!imageCache.length) return; e.preventDefault();
    currentIndex += e.deltaY > 0 ? 1 : -1;
    slider.value = currentIndex; updateRenderer();
}, { passive: false });

// Quiz
document.getElementById('btn-start-quiz').addEventListener('click', () => {
    const quiz = CASES[currentCaseId].quiz;
    quizContainer.innerHTML = quiz.map((q, idx) => `
        <div class="mb-4">
            <p class="font-bold text-gray-200 mb-2">${idx+1}. ${q.q}</p>
            ${q.options.map((opt, oIdx) => `
                <div class="quiz-option" data-q="${idx}" data-o="${oIdx}">${opt}</div>
            `).join('')}
            <div class="quiz-exp" id="exp-${idx}">${q.exp}</div>
        </div>
    `).join('');
    quizModal.style.display = 'flex';
});

document.getElementById('btn-close-quiz').addEventListener('click', () => {
    quizModal.style.display = 'none';
});

quizContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('quiz-option')) {
        const qIdx = e.target.dataset.q;
        const oIdx = parseInt(e.target.dataset.o);
        const correctIdx = CASES[currentCaseId].quiz[qIdx].answer;
        
        // Disable others
        const siblings = e.target.parentElement.querySelectorAll('.quiz-option');
        siblings.forEach(s => s.style.pointerEvents = 'none');
        
        if (oIdx === correctIdx) {
            e.target.classList.add('correct');
        } else {
            e.target.classList.add('wrong');
            siblings[correctIdx].classList.add('correct');
        }
        document.getElementById(`exp-${qIdx}`).style.display = 'block';
    }
});

loadDataset('neuro_mri_reel');