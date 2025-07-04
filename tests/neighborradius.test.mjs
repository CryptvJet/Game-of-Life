import assert from 'node:assert/strict';
import { GameOfLife } from '../src/game.js';

const g = new GameOfLife(5,5,[3],[2,3],0,'picked','moore',100,2);
assert.equal(g._neighbors(2,2).length, 24);

g.setNeighborType('vonneumann');
g.setNeighborRadius(2);
assert.equal(g._neighbors(2,2).length, 12);

console.log('Neighbor radius test passed');
