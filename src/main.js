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
      Array.from({ length: this.cols }, () =>
        Math.random() > 0.77
          ? { alive: 1, color: this._randomColor(), ghost: 0, ghostColor: null, ghostFade: 0 }
          : { alive: 0, color: null, ghost: 0, ghostColor: null, ghostFade: 0 }
      )
    );
  }

  clear() {
    this.grid = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () =>
        ({ alive: 0, color: null, ghost: 0, ghostColor: null, ghostFade: 0 })
      )
    );
  }

  getCell(row, col) {
    if (row < 0 || col < 0 || row >= this.rows || col >= this.cols) return null;
    return this.grid[row][col];
  }

  paint(row, col, color) {
    if (row < 0 || col < 0 || row >= this.rows || col >= this.cols) return;
    const cell = this.grid[row][col];
    cell.alive = 1;
    cell.color = color;
    cell.ghost = 0;
    cell.ghostColor = null;
    cell.ghostFade = 0;
  }

  step() {
    const newGrid = Array.from({ length: this.rows }, () => Array(this.cols));
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        const neighbors = this._neighbors(r, c);

        const liveNeighbors = neighbors.filter(n => n && n.alive).length;

        let newCell = { ...cell };

        // Calculate average color of live neighbors
        let avgColor = null;
        if (liveNeighbors > 0) {
          const rgb = [0, 0, 0];
          let count = 0;
          neighbors.forEach(n => {
            if (n && n.alive && n.color) {
              const c = this._hexToRgb(n.color);
              rgb[0] += c[0]; rgb[1] += c[1]; rgb[2] += c[2];
              count++;
            }
          });
          if (count) {
            rgb[0] = Math.round(rgb[0] / count);
            rgb[1] = Math.round(rgb[1] / count);
            rgb[2] = Math.round(rgb[2] / count);
            avgColor = this._rgbToHex(rgb[0], rgb[1], rgb[2]);
          }
        }

        // Apply Rules
        if (cell.alive) {
          if (liveNeighbors === this.surviveCount) {
            newCell.alive = 1;
          } else {
            newCell.alive = 0;
            newCell.ghost = 1;
            newCell.ghostColor = cell.color;
            newCell.ghostFade = 0.18;
            newCell.color = null;
          }
        } else {
          if (liveNeighbors === this.bornAt) {
            newCell.alive = 1;
            newCell.color = avgColor || "#ff00cc";
            newCell.ghost = 0;
            newCell.ghostColor = null;
            newCell.ghostFade = 0;
          } else if (cell.ghost) {
            newCell.ghostFade = (cell.ghostFade || 0) * 0.93;
            if (newCell.ghostFade < 0.03) {
              newCell.ghost = 0;
              newCell.ghostColor = null;
              newCell.ghostFade = 0;
            }
          }
        }
        if (newCell.ghost && newCell.ghostColor) {
          newCell.ghostColor = this._hexToRgba(newCell.ghostColor, newCell.ghostFade || 0.13);
        }
        newGrid[r][c] = newCell;
      }
    }
    this.grid = newGrid;
  }

  _neighbors(row, col) {
    const dirs = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    return dirs.map(([dr, dc]) => this.getCell(row + dr, col + dc));
  }

  _randomColor() {
    const h = Math.floor(Math.random() * 360);
    return `hsl(${h},90%,60%)`;
  }
  _hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const int = parseInt(hex, 16);
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  }
  _rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join('');
  }
  _hexToRgba(hex, alpha) {
    const [r, g, b] = this._hexToRgb(hex);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Resize grid (preserving as much as possible)
  resize(newRows, newCols) {
    const newGrid = Array.from({ length: newRows }, (_, r) =>
      Array.from({ length: newCols }, (_, c) =>
        (this.grid[r] && this.grid[r][c]) ? { ...this.grid[r][c] } :
          { alive: 0, color: null, ghost: 0, ghostColor: null, ghostFade: 0 }
      )
    );
    this.rows = newRows;
    this.cols = newCols;
    this.grid = newGrid;
  }
}