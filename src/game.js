export class GameOfLife {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() > 0.8 ? 1 : 0)
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
          newGrid[r][c] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          newGrid[r][c] = neighbors === 3 ? 1 : 0;
        }
      }
    }
    this.grid = newGrid;
  }
}