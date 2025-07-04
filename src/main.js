import { GameOfLife } from './game.js';

// --- Parameters for block size ---
const BLOCK_SIZE = 10; // Each visual cell is a 10x10 logical cell block

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

// "Visual cell" settings
let cellSize = 13;
let displayCols, displayRows;
let game;
let running = false;
let aliveColor = colorPicker.value;

// Rule settings
let bornAt = parseInt(bornSlider.value);
let surviveCount = parseInt(surviveSlider.value);

// Animation speed
let fps = parseInt(speedSlider.value);
let animationId = null;
let lastFrame = 0;
let frameInterval = 1000 / fps;

// --- Canvas/grid resizing ---
function resizeCanvasAndGrid(keepState = false) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  displayCols = Math.floor(canvas.width / cellSize);
  displayRows = Math.floor(canvas.height / cellSize);

  // Underlying logical grid is BLOCK_SIZE times finer
  let logicCols = displayCols * BLOCK_SIZE;
  let logicRows = displayRows * BLOCK_SIZE;

  if (keepState && game) {
    game.resize(logicRows, logicCols);
  } else {
    game = new GameOfLife(logicRows, logicCols, bornAt, surviveCount);
  }
  drawGrid();
}

// --- Drawing ---
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let dRow = 0; dRow < displayRows; dRow++) {
    for (let dCol = 0; dCol < displayCols; dCol++) {
      // Aggregate the block
      let aliveCount = 0;
      let ghostCount = 0;
      let colorSum = [0, 0, 0];
      let ghostColorSum = [0, 0, 0];
      let ghostAlphaSum = 0;
      for (let y = 0; y < BLOCK_SIZE; y++) {
        for (let x = 0; x < BLOCK_SIZE; x++) {
          let row = dRow * BLOCK_SIZE + y;
          let col = dCol * BLOCK_SIZE + x;
          const cell = game.getCell(row, col);
          if (cell && cell.alive) {
            aliveCount++;
            if (cell.color) {
              const rgb = hexToRgbArr(cell.color);
              colorSum[0] += rgb[0];
              colorSum[1] += rgb[1];
              colorSum[2] += rgb[2];
            }
          } else if (cell && cell.ghost && cell.ghostColor) {
            ghostCount++;
            const rgba = parseGhostRgba(cell.ghostColor);
            ghostColorSum[0] += rgba[0];
            ghostColorSum[1] += rgba[1];
            ghostColorSum[2] += rgba[2];
            ghostAlphaSum += rgba[3];
          }
        }
      }
      // Draw alive or ghost average
      if (aliveCount > 0) {
        ctx.fillStyle = rgbToHex(
          colorSum[0]/aliveCount,
          colorSum[1]/aliveCount,
          colorSum[2]/aliveCount
        );
        ctx.fillRect(dCol * cellSize, dRow * cellSize, cellSize, cellSize);
      } else if (ghostCount > 0) {
        // Draw averaged ghost color, averaged alpha
        ctx.fillStyle = rgbaString(
          ghostColorSum[0]/ghostCount,
          ghostColorSum[1]/ghostCount,
          ghostColorSum[2]/ghostCount,
          ghostAlphaSum/ghostCount
        );
        ctx.fillRect(dCol * cellSize, dRow * cellSize, cellSize, cellSize);
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
  bornAt = parseInt(e.target.value);
  bornValue.innerText = bornAt;
  game.setRules(bornAt, surviveCount);
};

surviveSlider.oninput = function(e) {
  surviveCount = parseInt(e.target.value);
  surviveValue.innerText = surviveCount;
  game.setRules(bornAt, surviveCount);
};

speedSlider.oninput = function(e) {
  fps = parseInt(e.target.value);
  speedValue.innerText = fps;
  frameInterval = 1000 / fps;
};

// --- Drawing/Painting ---
// Paint a BLOCK_SIZE x BLOCK_SIZE region
let painting = false;

function paintCell(e) {
  const rect = canvas.getBoundingClientRect();
  let clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const dCol = Math.floor(x / cellSize);
  const dRow = Math.floor(y / cellSize);

  for (let dy = 0; dy < BLOCK_SIZE; dy++) {
    for (let dx = 0; dx < BLOCK_SIZE; dx++) {
      const row = dRow * BLOCK_SIZE + dy;
      const col = dCol * BLOCK_SIZE + dx;
      game.paint(row, col, aliveColor);
    }
  }
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

// --- COLOR helpers ---
function hexToRgbArr(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const int = parseInt(hex, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, "0")).join('');
}
function parseGhostRgba(rgba) {
  // "rgba(255,0,255,0.13)"
  const arr = rgba.match(/[\d.]+/g).map(Number);
  return arr; // [r,g,b,a]
}
function rgbaString(r,g,b,a) {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}