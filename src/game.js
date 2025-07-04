export class GameOfLife {
  constructor(rows, cols, bornAt = 3, surviveCount = 2) {
    this.rows = rows;
    this.cols = cols;
    this.bornAt = bornAt;
    this.surviveCount = surviveCount;
    this.randomize();
  }

  setRules(bornAt, surviveCount) {
    this.bornAt = bornAt;
    this.surviveCount = surviveCount;
  }

  randomize() {
    this.grid = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => Math.random() > 0.7 ? 1 : 0)
    );
  }

  clear() {
    this.grid = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => 0)
    );
  }

  isAlive(row, col) {
    return this.grid[row] && this.grid[row][col];
  }

  step() {
    const newGrid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const neighbors = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1]
        ].reduce((acc, [dr, dc]) => {
          const nr = r + dr, nc = c + dc;
          return acc + (this.grid[nr]?.[nc] || 0);
        }, 0);
        if (this.grid[r][c]) {
          newGrid[r][c] = (neighbors === this.surviveCount) ? 1 : 0;
        } else {
          newGrid[r][c] = (neighbors === this.bornAt) ? 1 : 0;
        }
      }
    }
    this.grid = newGrid;
  }
}