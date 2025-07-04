import assert from 'node:assert/strict';
import { GameOfLife } from '../src/game.js';

const g = new GameOfLife(3, 3);
assert.doesNotThrow(() => g.randomize(100, 100));

for (let r = 0; r < g.rows; r++) {
  for (let c = 0; c < g.cols; c++) {
    const cell = g.getCell(r, c);
    assert.ok(cell && typeof cell.alive === 'number');
  }
}

console.log('Randomize size test passed');
