import { GameOfLife } from './game.js';
import { patternsList, insertPattern } from './patterns.js';

// ...existing UI and controls as before...

// --- Patterns Modal Menu ---
const openPatternsBtn = document.getElementById('open-patterns-menu');
const patternModal = document.getElementById('pattern-modal');
const closePatternsBtn = document.getElementById('close-patterns-menu');
const patternList = document.getElementById('pattern-list');
const patternSearch = document.getElementById('pattern-search');

// Show modal
openPatternsBtn.onclick = function() {
  patternModal.classList.add('visible');
  renderPatternList('');
  patternSearch.value = '';
  patternSearch.focus();
};
// Hide modal
closePatternsBtn.onclick = function() {
  patternModal.classList.remove('visible');
};
// Hide modal on outside click
patternModal.addEventListener('mousedown', e => {
  if (e.target === patternModal) patternModal.classList.remove('visible');
});
// Search filter
patternSearch.oninput = function() {
  renderPatternList(patternSearch.value.trim());
};

function renderPatternList(filter) {
  const filterLower = filter.toLowerCase();
  patternList.innerHTML = '';
  Object.entries(patternsList)
    .filter(([name]) => name.toLowerCase().includes(filterLower))
    .forEach(([name, pattern]) => {
      const item = document.createElement('div');
      item.className = 'pattern-item';
      item.title = name;
      // Render preview
      const preview = document.createElement('div');
      preview.className = 'pattern-preview';
      preview.appendChild(makePatternCanvas(pattern));
      // Name
      const pname = document.createElement('div');
      pname.className = 'pattern-name';
      pname.innerText = name;
      // Compose
      item.appendChild(preview);
      item.appendChild(pname);
      item.onclick = () => {
        insertPattern(game, Math.floor(rows/2), Math.floor(cols/2), name, aliveColor, colorMode);
        drawGrid();
        patternModal.classList.remove('visible');
      };
      patternList.appendChild(item);
    });
}
// Helper: Make a mini-canvas for preview
function makePatternCanvas(pattern) {
  const size = 28;
  const pad = 2;
  const rows = pattern.length;
  const cols = Math.max(...pattern.map(row => row.length));
  const cell = Math.min(size / cols, size / rows, 6);
  const w = cols * cell + pad*2;
  const h = rows * cell + pad*2;
  const c = document.createElement('canvas');
  c.width = w; c.height = h; c.style.width = w+'px'; c.style.height = h+'px';
  const ctx = c.getContext('2d');
  ctx.fillStyle = "#ff00cc";
  for (let r=0; r<rows; r++) for (let d=0; d<pattern[r].length; d++)
    if (pattern[r][d]) ctx.fillRect(pad+d*cell, pad+r*cell, cell-1, cell-1);
  ctx.strokeStyle = "#aaa";
  ctx.strokeRect(0,0,w,h);
  return c;
}

// ...rest of main.js (grid logic etc) as before...