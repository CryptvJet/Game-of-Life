import { GameOfLife } from './game.js';
import { setupControls } from './ui.js';
import { config } from './config.js';

const canvas = document.getElementById('gameCanvas');
const genCounter = document.getElementById('genCounter');

// Responsive canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (window.game) window.game.resize();
}
window.addEventListener('resize', resizeCanvas);

// Game instance
window.game = new GameOfLife(canvas, config, (gen) => {
  genCounter.textContent = `Gen: ${gen}`;
});
resizeCanvas();

setupControls(window.game);
