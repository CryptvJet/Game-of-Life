import { GameOfLife } from './game.js';
import { patternsList, insertPattern } from './patterns.js';

// UI Elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startPauseBtn = document.getElementById('start-pause');
const clearBtn = document.getElementById('clear');
const resetBtn = document.getElementById('reset');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const colorPicker = document.getElementById('color-picker');
const bornSlider = document.getElementById('born-slider');
const bornValue = document.getElementById('born-value');
const surviveSlider = document.getElementById('survive-slider');
const surviveValue = document.getElementById('survive-value');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const cellSizeSlider = document.getElementById('cellsize-slider');
const cellSizeValue = document.getElementById('cellsize-value');
const ghostFadeSlider = document.getElementById('ghostfade-slider');
const ghostFadeValue = document.getElementById('ghostfade-value');
const colorModeSelect = document.getElementById('colormode-select');
const neighborTypeSelect = document.getElementById('neighbortype-select');
const vibranceSlider = document.getElementById('vibrance-slider');
const vibranceValue = document.getElementById('vibrance-value');
const patternsButtons = document.getElementById('patterns-buttons');
const bsBirth = document.getElementById('bs-birth');
const bsSurvive = document.getElementById('bs-survive');

// Grid settings
let cellSize = parseInt(cellSizeSlider.value);
let rows, cols, game;
let running = false;
let aliveColor = colorPicker.value;

// Simulation settings (defaults)
let bornAt = [2];
let surviveCount = [2];
let fps = parseInt(speedSlider.value);
let ghostFadeBase = parseInt(ghostFadeSlider.value) / 100;
let colorMode = colorModeSelect.value;
let neighborType = neighborTypeSelect.value;
let vibrance = parseInt(vibranceSlider.value);
let animationId = null;
let lastFrame = 0;
let frameInterval = 1000 / fps;

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

// --- Patterns ---
function reloadPatterns() {
  patternsButtons.innerHTML = '';
  for (let name of Object.keys(patternsList)) {
    let btn = document.createElement('button');
    btn.innerText = name;
    btn.className = 'pattern-button';
    btn.onclick = () => {
      insertPattern(game, Math.floor(rows/2), Math.floor(cols/2), name, aliveColor, colorMode);
      drawGrid();
    };
    patternsButtons.appendChild(btn);
  }
}
reloadPatterns();

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
}

// --- Animation loop with adjustable speed ---
function animate(now = 0) {
  if (!running) return;
  if (!lastFrame) lastFrame = now;
  const elapsed = now - lastFrame;
  if (elapsed >= frameInterval) {
    game.step();
    drawGrid();
    lastFrame = now;
  }
  animationId = requestAnimationFrame(animate);
}

// --- Controls ---
startPauseBtn.onclick = function() {
  running = !running;
  if (running) {
    startPauseBtn.innerText = '⏸ Pause';
    lastFrame = 0;
    animate();
  } else {
    startPauseBtn.innerText = '▶ Start';
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};
clearBtn.onclick = function() { game.clear(); drawGrid(); };
resetBtn.onclick = function() { game.randomize(); drawGrid(); };
zoomInBtn.onclick = function() {
  cellSize = Math.min(cellSize + 2, 40);
  cellSizeSlider.value = cellSize;
  cellSizeValue.innerText = cellSize;
  resizeCanvasAndGrid(true);
};
zoomOutBtn.onclick = function() {
  cellSize = Math.max(cellSize - 2, 5);
  cellSizeSlider.value = cellSize;
  cellSizeValue.innerText = cellSize;
  resizeCanvasAndGrid(true);
};
colorPicker.oninput = e => { aliveColor = e.target.value; };
cellSizeSlider.oninput = function(e) {
  cellSize = parseInt(e.target.value);
  cellSizeValue.innerText = cellSize;
  resizeCanvasAndGrid(true);
};
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
bornSlider.oninput = function(e) {
  let v = parseInt(e.target.value);
  bornValue.innerText = v;
  bsBirth.querySelectorAll('input[type=checkbox]').forEach((cb, i) => cb.checked = (i === v));
  updateBSRules();
};
surviveSlider.oninput = function(e) {
  let v = parseInt(e.target.value);
  surviveValue.innerText = v;
  bsSurvive.querySelectorAll('input[type=checkbox]').forEach((cb, i) => cb.checked = (i === v));
  updateBSRules();
};
speedSlider.oninput = function(e) {
  fps = parseInt(e.target.value);
  speedValue.innerText = fps;
  frameInterval = 1000 / fps;
};

// --- Drawing/Painting ---
let painting = false;
function paintCell(e) {
  const rect = canvas.getBoundingClientRect();
  let clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  game.paint(row, col, aliveColor, colorMode);
  drawGrid();
}
canvas.addEventListener('pointerdown', e => { painting = true; paintCell(e); });
canvas.addEventListener('pointermove', e => { if (painting) paintCell(e); });
canvas.addEventListener('pointerup', () => painting = false);
canvas.addEventListener('pointerleave', () => painting = false);
canvas.addEventListener('touchend', () => painting = false);

// --- Sliders display ---
bornValue.innerText = bornAt[0];
surviveValue.innerText = surviveCount[0];
speedValue.innerText = fps;
cellSizeValue.innerText = cellSize;
ghostFadeValue.innerText = ghostFadeBase.toFixed(2);
vibranceValue.innerText = vibrance;

// --- Responsive resizing ---
window.addEventListener('resize', () => resizeCanvasAndGrid(true));

// --- Initial load ---
resizeCanvasAndGrid();
drawGrid();