import assert from 'node:assert/strict';
import { GameOfLife } from '../src/game.js';
import { insertPattern, patternsList } from '../src/patterns.js';

patternsList['ColorTest'] = [
  [0,'#ff0000'],
  ['#00ff00',1]
];

const g = new GameOfLife(4,4);
g.clear();
insertPattern(g, 1, 1, 'ColorTest', '#ffffff', 'picked');

assert.equal(g.getCell(0,1).color, '#ff0000');
assert.equal(g.getCell(1,0).color, '#00ff00');
assert.equal(g.getCell(1,1).color, '#ffffff');

console.log('Color pattern insert test passed');

