import assert from 'node:assert/strict';
import { GameOfLife } from '../src/game.js';

const g = new GameOfLife(10, 10);
const aliveColors = new Set();
for (let i=0;i<3;i++) {
  g.randomize(10,10);
  aliveColors.clear();
  for (let r=0;r<g.rows;r++) {
    for (let c=0;c<g.cols;c++) {
      const cell = g.getCell(r,c);
      if (cell.alive) aliveColors.add(cell.color);
    }
  }
  assert.ok(aliveColors.size <= 5, `too many colors: ${aliveColors.size}`);
}
console.log('Randomize palette test passed');
