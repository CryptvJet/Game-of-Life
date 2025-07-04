import assert from 'node:assert/strict';
import { GameOfLife } from '../src/game.js';

const g = new GameOfLife(1, 1, [2], [2], 0);

g.clear();
g.paint(0, 0, '#ff0000', 'picked');

g.step();
const cell = g.getCell(0, 0);
assert.equal(cell.ghost, 1);
assert.equal(cell.ghostFade, 0);
assert.ok(cell.ghostColor.endsWith(',0)'));

console.log('Ghost fade 0 test passed');
