import assert from 'node:assert/strict';
import { GameOfLife } from '../src/game.js';

const g = new GameOfLife(1,1);

assert.deepEqual(g._hexToRgb('#ff0000'), [255,0,0]);
assert.deepEqual(g._hexToRgb('rgb(1, 2, 3)'), [1,2,3]);
assert.deepEqual(g._hexToRgb('hsl(120, 100%, 50%)'), [0,255,0]);

console.log('All tests passed');
