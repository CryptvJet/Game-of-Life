import { GameOfLife } from './game.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let cellSize = 15;
let rows, cols, game;

function resizeCanvasAndGrid() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);
  game = new GameOfLife(rows, cols); // Fresh grid on resize
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.fillStyle = game.isAlive(row, col) ? "#00FF00" : "#222";
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
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resizeCanvasAndGrid();
  drawGrid();
});

resizeCanvasAndGrid();
drawGrid();
animate();