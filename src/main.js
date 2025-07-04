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

// Grid settings
let cellSize = 10;
let rows, cols, game;
let animationId;
let running = false;
let aliveColor = colorPicker.value;

// Rule settings
let bornAt = parseInt(bornSlider.value); // Default 3
let surviveCount = parseInt(surviveSlider.value); // Default 2

function resizeCanvasAndGrid() {
  // Calculate available height for canvas (window - controls)
  const layout = document.getElementById('main-layout');
  // Find space taken by controls
  const controlsHeight = (
    document.getElementById('controls').offsetHeight +
    document.getElementById('color-controls').offsetHeight +
    document.getElementById('sliders').offsetHeight +
    60 // Extra margin/padding fudge factor
  );
  const availableHeight = window.innerHeight - controlsHeight;
  // Fill as much as possible
  canvas.width = window.innerWidth;
  canvas.height = Math.max(200, availableHeight);

  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);
  if (!game || game.rows !== rows || game.cols !== cols) {
    game = new GameOfLife(rows, cols, bornAt, surviveCount);
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.fillStyle = game.isAlive(row, col) ? aliveColor : "#ffe0fa";
      ctx.fillRect(
        col * cellSize,
        row * cellSize,
        cellSize - 1,
        cellSize - 1
      );
    }
  }
}

function animate() {
  game.step();
  drawGrid();
  animationId = requestAnimationFrame(animate);
}

// --- Controls ---
startPauseBtn.onclick = function() {
  running = !running;
  if (running) {
    startPauseBtn.innerText = '⏸ Pause';
    animate();
  } else {
    startPauseBtn.innerText = '▶ Start';
    cancelAnimationFrame(animationId);
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
  resizeCanvasAndGrid();
  drawGrid();
};

zoomOutBtn.onclick = function() {
  cellSize = Math.max(cellSize - 2, 2);
  resizeCanvasAndGrid();
  drawGrid();
};

colorPicker.oninput = function(e) {
  aliveColor = e.target.value;
  drawGrid();
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

// --- Initial Setup ---
bornValue.innerText = bornAt;
surviveValue.innerText = surviveCount;

// Responsive resizing
function onResize() {
  resizeCanvasAndGrid();
  drawGrid();
}
window.addEventListener('resize', onResize);

// Initial load
resizeCanvasAndGrid();
drawGrid();
