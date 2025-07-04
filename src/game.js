export class GameOfLife {
  constructor(
    rows, cols,
    bornAt = [2], surviveCount = [2],
    ghostFade = 0,
    colorMode = "picked",
    neighborType = "moore",
    vibrance = 100
  ) {
    this.rows = rows;
    this.cols = cols;
    this.bornAt = bornAt;
    this.surviveCount = surviveCount;
    this.ghostFade = ghostFade;
    this.colorMode = colorMode;
    this.neighborType = neighborType;
    this.vibrance = vibrance;
    this.hue = Math.random() * 360;
    this.randomize();
  }

  setRules(bornArr, surviveArr) {
    this.bornAt = bornArr;
    this.surviveCount = surviveArr;
  }
  setGhostFade(val) { this.ghostFade = val; }
  setColorMode(val) { this.colorMode = val; }
  setNeighborType(val) { this.neighborType = val; }
  setVibrance(val) { this.vibrance = val; }

  randomize() {
    this.grid = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () =>
        Math.random() > 0.8
          ? { alive: 1, color: this._pickColor(), ghost: 0, ghostColor: null, ghostFade: 0 }
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

  paint(row, col, color, colorMode) {
    if (row < 0 || col < 0 || row >= this.rows || col >= this.cols) return;
    const cell = this.grid[row][col];
    cell.alive = 1;
    cell.color = this._pickColor(color, colorMode);
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

        if (cell.alive) {
          if (this.surviveCount.includes(liveNeighbors)) {
            newCell.alive = 1;
          } else {
            newCell.alive = 0;
            newCell.ghost = 1;
            newCell.ghostColor = cell.color;
            newCell.ghostFade = this.ghostFade;
            newCell.color = null;
          }
        } else {
          if (this.bornAt.includes(liveNeighbors)) {
            newCell.alive = 1;
            newCell.color = this._pickColor(avgColor);
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
          newCell.ghostColor = this._hexToRgba(
            newCell.ghostColor,
            newCell.ghostFade ?? 0.13
          );
        }
        newGrid[r][c] = newCell;
      }
    }
    this.grid = newGrid;
  }

  _neighbors(row, col) {
    let dirs;
    switch (this.neighborType) {
      case "vonneumann":
        dirs = [
          [-1, 0], [0, -1], [0, 1], [1, 0]
        ]; break;
      case "extended":
        dirs = [];
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            if (dr === 0 && dc === 0) continue;
            dirs.push([dr, dc]);
          }
        }
        break;
      case "moore":
      default:
        dirs = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1]
        ];
        break;
    }
    return dirs.map(([dr, dc]) => this.getCell(row + dr, col + dc));
  }

  _pickColor(avg = null, mode = null) {
    if (!mode) mode = this.colorMode;
    switch (mode) {
      case "random":
        return this._randomColor();
      case "hue":
        this.hue = (this.hue + 31 + Math.random() * 14) % 360;
        return `hsl(${this.hue},${this.vibrance}%,60%)`;
      case "blend":
        return avg || this._randomColor();
      case "picked":
      default:
        if (avg) return avg;
        return "#ff00cc";
    }
  }

  _randomColor() {
    const h = Math.floor(Math.random()*360);
    return `hsl(${h},${this.vibrance}%,60%)`;
  }
  _hexToRgb(hex) {
    // Support hex, rgb(), and hsl() color formats
    if (!hex) return [0, 0, 0];
    if (hex.startsWith("rgb")) {
      const m = hex.match(/\d+(?:\.\d+)?/g);
      if (m && m.length >= 3) return [Number(m[0]), Number(m[1]), Number(m[2])];
      return [0, 0, 0];
    }
    if (hex.startsWith("hsl")) {
      const m = hex.match(/\d+(?:\.\d+)?/g);
      if (m && m.length >= 3) return this._hslToRgb(Number(m[0]), Number(m[1]), Number(m[2]));
      return [0, 0, 0];
    }
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const int = parseInt(hex, 16);
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  }
  _hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
  }
  _rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join('');
  }
  _hexToRgba(hex, alpha) {
    const [r, g, b] = this._hexToRgb(hex);
    return `rgba(${r},${g},${b},${alpha})`;
  }

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