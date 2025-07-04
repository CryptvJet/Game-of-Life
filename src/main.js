import { GameOfLife } from './game.js';
import { patternsList, insertPattern } from './patterns.js';

// UI Elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startPauseBtn = document.getElementById('start-pause');
const directionSlider = document.getElementById('direction-slider');
const directionValue = document.getElementById('direction-value');
const clearBtn = document.getElementById('clear');
const resetBtn = document.getElementById('reset');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const colorPicker = document.getElementById('color-picker');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const frameValue = document.getElementById('frame-value');
const ghostFadeSlider = document.getElementById('ghostfade-slider');
const ghostFadeValue = document.getElementById('ghostfade-value');
const colorModeSelect = document.getElementById('colormode-select');
const neighborTypeSelect = document.getElementById('neighbortype-select');
const vibranceSlider = document.getElementById('vibrance-slider');
const vibranceValue = document.getElementById('vibrance-value');
const bsBirth = document.getElementById('bs-birth');
const bsSurvive = document.getElementById('bs-survive');
const showGridCheckbox = document.getElementById('showgrid-checkbox');

// Grid settings
let cellSize = 13;
let rows, cols, game;
let running = false;
let aliveColor = colorPicker.value;

// Simulation settings (defaults)
let bornAt = [3];
let surviveCount = [2, 3];
let fps = parseInt(speedSlider.value);
let ghostFadeBase = parseInt(ghostFadeSlider.value) / 100;
let colorMode = colorModeSelect.value;
let neighborType = neighborTypeSelect.value;
let vibrance = parseInt(vibranceSlider.value);
let showGrid = showGridCheckbox.checked;
let animationId = null;
let lastFrame = 0;
let frameInterval = 1000 / fps;
let frameCount = 0;
let forward = true;

// --- B/S Rule Checkboxes ---
function makeCheckboxGroup(container, arr, labelPrefix, onChange) {
  container.innerHTML = '';
  for (let i = 0; i <= 8; i++) {
    let cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = i;
    cb.id = `${labelPrefix}-${i}`;
    cb.checked = arr.includes(i);
    cb.onchange = () => onChange();
    let lbl = document.createElement('label');
    lbl.htmlFor = cb.id;
    lbl.style.fontSize = '0.95em';
    lbl.style.marginRight = '0.3em';
    lbl.innerText = i;
    container.appendChild(cb);
    container.appendChild(lbl);
  }
}
makeCheckboxGroup(bsBirth, bornAt, 'b', updateBSRules);
makeCheckboxGroup(bsSurvive, surviveCount, 's', updateBSRules);
function updateBSRules() {
  bornAt = [];
  surviveCount = [];
  bsBirth.querySelectorAll('input[type=checkbox]').forEach(cb => { if (cb.checked) bornAt.push(parseInt(cb.value)); });
  bsSurvive.querySelectorAll('input[type=checkbox]').forEach(cb => { if (cb.checked) surviveCount.push(parseInt(cb.value)); });
  game.setRules(bornAt, surviveCount);
}

// --- Canvas/grid resizing ---
function resizeCanvasAndGrid(keepState = false) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);

  if (keepState && game) {
    game.resize(rows, cols);
  } else {
    game = new GameOfLife(rows, cols, bornAt, surviveCount, ghostFadeBase, colorMode, neighborType, vibrance);
  }
  drawGrid();
}

// --- Drawing ---
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = game.getCell(row, col);
      if (cell && cell.alive) {
        ctx.fillStyle = cell.color || aliveColor;
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      } else if (cell && cell.ghost) {
        ctx.fillStyle = cell.ghostColor || "rgba(255,0,255,0.13)";
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
  if (showGrid) {
    ctx.strokeStyle = "rgba(200,200,200,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= cols; x++) {
      const xPos = x * cellSize + 0.5;
      ctx.moveTo(xPos, 0);
      ctx.lineTo(xPos, rows * cellSize);
    }
    for (let y = 0; y <= rows; y++) {
      const yPos = y * cellSize + 0.5;
      ctx.moveTo(0, yPos);
      ctx.lineTo(cols * cellSize, yPos);
    }
    ctx.stroke();
  }
}

// --- Animation loop with adjustable speed ---
function animate(now = 0) {
  if (!running) return;
  if (!lastFrame) lastFrame = now;
  const elapsed = now - lastFrame;
  if (elapsed >= frameInterval) {
    if (forward) {
      game.step();
      frameCount++;
    } else {
      game.stepBackward();
      frameCount = Math.max(0, frameCount - 1);
    }
    drawGrid();
    frameValue.innerText = frameCount;
    lastFrame = now;
  }
  animationId = requestAnimationFrame(animate);
}

// --- Controls ---
startPauseBtn.onclick = function() {
  running = !running;
  if (running) {
    startPauseBtn.innerText = '\u23f8 Pause';
    lastFrame = 0;
    animate();
  } else {
    startPauseBtn.innerText = '\u25b6 Start / \u23F8 Pause';
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};
directionSlider.oninput = function(e) {
  forward = parseInt(e.target.value) === 1;
  directionValue.innerText = forward ? 'Forward' : 'Reverse';
};
clearBtn.onclick = function() {
  game.clear();
  drawGrid();
  frameCount = 0;
  frameValue.innerText = frameCount;
};
resetBtn.onclick = function() {
  game.randomize();
  drawGrid();
  frameCount = 0;
  frameValue.innerText = frameCount;
};
zoomInBtn.onclick = function() {
  cellSize = Math.min(cellSize + 2, 40);
  resizeCanvasAndGrid(true);
};
zoomOutBtn.onclick = function() {
  cellSize = Math.max(cellSize - 2, 5);
  resizeCanvasAndGrid(true);
};
colorPicker.oninput = e => { aliveColor = e.target.value; };
ghostFadeSlider.oninput = function(e) {
  ghostFadeBase = parseInt(e.target.value) / 100;
  ghostFadeValue.innerText = ghostFadeBase.toFixed(2);
  game.setGhostFade(ghostFadeBase);
};
colorModeSelect.onchange = function(e) {
  colorMode = colorModeSelect.value;
  game.setColorMode(colorMode);
};
neighborTypeSelect.onchange = function(e) {
  neighborType = neighborTypeSelect.value;
  game.setNeighborType(neighborType);
};
vibranceSlider.oninput = function(e) {
  vibrance = parseInt(e.target.value);
  vibranceValue.innerText = vibrance;
  game.setVibrance(vibrance);
};
showGridCheckbox.onchange = function(e) {
  showGrid = e.target.checked;
  canvas.style.background = showGrid ? '#fff' : '#000';
  drawGrid();
};
speedSlider.oninput = function(e) {
  fps = parseInt(e.target.value);
  speedValue.innerText = fps;
  frameInterval = 1000 / fps;
};

// --- Drawing/Painting ---
let painting = false;
function pointerToCell(e) {
  const rect = canvas.getBoundingClientRect();
  let clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  return { row, col };
}
function paintCell(e) {
  if (!game) return;
  const { row, col } = pointerToCell(e);
  game.paint(row, col, aliveColor, colorMode);
  drawGrid();
}
canvas.addEventListener('pointerdown', e => { painting = true; paintCell(e); });
canvas.addEventListener('pointermove', e => { if (painting) paintCell(e); });
canvas.addEventListener('pointerup', () => painting = false);
canvas.addEventListener('pointerleave', () => painting = false);
canvas.addEventListener('touchend', () => painting = false);

// --- Sliders display ---
speedValue.innerText = fps;
frameValue.innerText = frameCount;
ghostFadeValue.innerText = ghostFadeBase.toFixed(2);
vibranceValue.innerText = vibrance;
directionValue.innerText = forward ? 'Forward' : 'Reverse';
directionSlider.value = forward ? 1 : 0;
showGridCheckbox.checked = showGrid;
canvas.style.background = showGrid ? '#fff' : '#000';

// --- Responsive resizing ---
window.addEventListener('resize', () => resizeCanvasAndGrid(true));

// --- Initial load ---
resizeCanvasAndGrid();
game.clear();
insertPattern(game, Math.floor(rows/2), Math.floor(cols/2), 'Rose', aliveColor, colorMode);
drawGrid();

// --- Pattern Modal Menu ---
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