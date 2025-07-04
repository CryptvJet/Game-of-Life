export class GameOfLife {
  constructor(canvas, config, onGenUpdate) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = config;
    this.onGenUpdate = onGenUpdate;

    this.running = false;
    this.gen = 0;

    this.cellSize = config.cellSize;
    this.speed = config.speed;

    this.resize();
    this.clear();

    // Draw loop
    this._raf = null;
    this._lastStep = 0;

    // Mouse events for toggling cells
    this.canvas.addEventListener('mousedown', (e) => this.handleMouse(e));
    this.canvas.addEventListener('mousemove', (e) => {
      if (e.buttons === 1) this.handleMouse(e);
    });
  }

  resize() {
    // Calculate grid size
    const width = this.canvas.width;
    const height = this.canvas.height;
    this.cols = Math.floor(width / this.cellSize);
    this.rows = Math.floor(height / this.cellSize);
    // Re-init grid, keeping existing state if possible
    const old = this.grid || [];
    this.grid = [];
    for (let y = 0; y < this.rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.cols; x++) {
        this.grid[y][x] = (old[y] && old[y][x]) ? old[y][x] : 0;
      }
    }
    this.draw();
  }

  handleMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / this.cellSize);
    const y = Math.floor((e.clientY - rect.top) / this.cellSize);
    if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
      this.grid[y][x] = this.grid[y][x] ? 0 : 1;
      this.draw();
    }
  }

  step() {
    const newGrid = [];
    for (let y = 0; y < this.rows; y++) {
      newGrid[y] = [];
      for (let x = 0; x < this.cols; x++) {
        const n = this.countNeighbors(x, y);
        if (this.grid[y][x]) {
          newGrid[y][x] = n === 2 || n === 3 ? 1 : 0;
        } else {
          newGrid[y][x] = n === 3 ? 1 : 0;
        }
      }
    }
    this.grid = newGrid;
    this.gen++;
    if (this.onGenUpdate) this.onGenUpdate(this.gen);
    this.draw();
  }

  countNeighbors(x, y) {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
          n += this.grid[ny][nx];
        }
      }
    }
    return n;
  }

  draw() {
    const { ctx, cellSize, cols, rows } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw cells
    ctx.fillStyle = this.config.cellColor;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (this.grid[y][x]) {
          ctx.fillRect(
            x * cellSize,
            y * cellSize,
            cellSize - 1,
            cellSize - 1
          );
        }
      }
    }
    // Optionally: grid lines
    if (this.config.showGrid) {
      ctx.strokeStyle = this.config.gridColor;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, rows * cellSize);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(cols * cellSize, y * cellSize);
        ctx.stroke();
      }
    }
  }

  run() {
    if (this.running) return;
    this.running = true;
    const loop = (timestamp) => {
      if (!this.running) return;
      if (!this._lastStep) this._lastStep = timestamp;
      const interval = 1000 / this.speed;
      if (timestamp - this._lastStep >= interval) {
        this.step();
        this._lastStep = timestamp;
      }
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  pause() {
    this.running = false;
    cancelAnimationFrame(this._raf);
    this._raf = null;
    this._lastStep = 0;
  }

  toggle() {
    if (this.running) {
      this.pause();
    } else {
      this.run();
    }
  }

  clear() {
    this.pause();
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.grid[y][x] = 0;
      }
    }
    this.gen = 0;
    if (this.onGenUpdate) this.onGenUpdate(this.gen);
    this.draw();
  }

  randomize() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.grid[y][x] = Math.random() > 0.7 ? 1 : 0;
      }
    }
    this.gen = 0;
    if (this.onGenUpdate) this.onGenUpdate(this.gen);
    this.draw();
  }

  setSpeed(s) {
    this.speed = s;
  }

  setCellSize(size) {
    this.cellSize = size;
    this.resize();
    this.draw();
  }
}