export function setupControls(game) {
  const playPauseBtn = document.getElementById('playPauseBtn');
  const stepBtn = document.getElementById('stepBtn');
  const randomBtn = document.getElementById('randomBtn');
  const clearBtn = document.getElementById('clearBtn');
  const speedSlider = document.getElementById('speedSlider');
  const cellSizeSlider = document.getElementById('cellSizeSlider');

  playPauseBtn.addEventListener('click', () => {
    game.toggle();
    playPauseBtn.textContent = game.running ? '⏸️' : '▶️';
  });

  stepBtn.addEventListener('click', () => {
    game.step();
  });

  randomBtn.addEventListener('click', () => {
    game.randomize();
  });

  clearBtn.addEventListener('click', () => {
    game.clear();
  });

  speedSlider.addEventListener('input', (e) => {
    game.setSpeed(Number(e.target.value));
  });

  cellSizeSlider.addEventListener('input', (e) => {
    game.setCellSize(Number(e.target.value));
  });
}