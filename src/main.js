import { GameOfLife } from './game.js';

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

// Grid settings
let cellSize = 13;
let rows, cols, game;
let running = false;
let aliveColor = colorPicker.value;

// Rule settings (slider value * 10)
let bornAt = parseInt(bornSlider.value) * 10;
let surviveCount = parseInt(surviveSlider.value) * 10;

// Animation speed
let fps = parseInt(speedSlider.value);
let animationId = null;
let lastFrame = 0;
let frameInterval = 1000 / fps;

// --- Canvas/grid resizing ---
function resizeCanvasAndGrid(keepState = false) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);

  if (keepState && game) {
    game.resize(rows, cols);
  } else {
    game = new GameOfLife(rows, cols, bornAt, surviveCount);
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

clearBtn.onclick = function() {
  game.clear();
  drawGrid();
};

resetBtn.onclick = function() {
  game.randomize();
  drawGrid();
};

zoomInBtn.onclick = function() {
  cellSize = Math.min(cellSize + 2, 40);
  resizeCanvasAndGrid(true);
};

zoomOutBtn.onclick = function() {
  cellSize = Math.max(cellSize - 2, 2);
  resizeCanvasAndGrid(true);
};

colorPicker.oninput = function(e) {
  aliveColor = e.target.value;
};

bornSlider.oninput = function(e) {
  bornAt = parseInt(e.target.value) * 10;
  bornValue.innerText = bornAt;
  game.setRules(bornAt, surviveCount);
};

surviveSlider.oninput = function(e) {
  surviveCount = parseInt(e.target.value) * 10;
  surviveValue.innerText = surviveCount;
  game.setRules(bornAt, surviveCount);
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
  game.paint(row, col, aliveColor);
  drawGrid();
}

canvas.addEventListener('pointerdown', e => {
  painting = true;
  paintCell(e);
});
canvas.addEventListener('pointermove', e => {
  if (painting) paintCell(e);
});
canvas.addEventListener('pointerup', () => painting = false);
canvas.addEventListener('pointerleave', () => painting = false);
canvas.addEventListener('touchend', () => painting = false);

// --- Sliders display ---
bornValue.innerText = bornAt;
surviveValue.innerText = surviveCount;
speedValue.innerText = fps;

// --- Responsive resizing ---
window.addEventListener('resize', () => resizeCanvasAndGrid(true));

// --- Initial load ---
resizeCanvasAndGrid();
drawGrid();