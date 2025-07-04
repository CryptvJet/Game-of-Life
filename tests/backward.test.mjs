import assert from 'node:assert/strict';
import { GameOfLife } from '../src/game.js';

const g = new GameOfLife(2,2,[3],[2,3]);
g.clear();
g.paint(0,0,'#ff0000','picked');
const before = g.grid.map(r => r.map(c => ({...c})));

g.step();
assert.notDeepEqual(g.grid, before);

g.stepBackward();
assert.deepEqual(g.grid, before);

console.log('Backward step test passed');
