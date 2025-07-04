// Classic Game of Life patterns and insertion

export const patternsList = {
  "Glider": [
    [1,0,0],
    [0,1,1],
    [1,1,0]
  ],
  "Small Exploder": [
    [0,1,0],
    [1,1,1],
    [1,0,1],
    [0,1,0]
  ],
  "Exploder": [
    [1,0,1,0,1],
    [1,0,1,0,1],
    [1,1,1,1,1],
    [1,0,1,0,1],
    [1,0,1,0,1]
  ],
  "10 Cell Row": [
    [1,1,1,1,1,1,1,1,1,1]
  ],
  "Lightweight Spaceship": [
    [0,1,1,1,1],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,1,0]
  ],
  "Tumbler": [
    [0,1,1,0,1,1,0],
    [0,1,1,0,1,1,0],
    [0,0,1,0,1,0,0],
    [1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1],
    [1,1,0,0,0,1,1]
  ],
  "Pulsar": [
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,1,1,1,0,0]
  ],
  "Blinker": [
    [1,1,1]
  ],
  "Toad": [
    [0,1,1,1],
    [1,1,1,0]
  ],
  "Beacon": [
    [1,1,0,0],
    [1,1,0,0],
    [0,0,1,1],
    [0,0,1,1]
  ],
  "Pentadecathlon": [
    [0,1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [0,1,1,0,0,1,1,0]
  ],
  // You can add more patterns here!
};

export function insertPattern(game, baseRow, baseCol, patternName, color, colorMode) {
  const pattern = patternsList[patternName];
  if (!pattern) return;
  const pr = Math.floor(pattern.length / 2);
  const pc = Math.floor(pattern[0].length / 2);
  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      if (pattern[r][c]) {
        game.paint(baseRow + r - pr, baseCol + c - pc, color, colorMode);
      }
    }
  }
}