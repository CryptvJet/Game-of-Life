function generateDolphinPattern() {
  const w = 50, h = 50;
  const body = '#00ced1';
  const shade = '#4682b4';
  const arr = Array.from({ length: h }, () => Array(w).fill(0));
  const cx = 20, cy = 25, a = 15, b = 8;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (((x - cx) / a) ** 2 + ((y - cy) / b) ** 2 <= 1) {
        arr[y][x] = body;
      }
      if ((x - 33) ** 2 + (y - 22) ** 2 <= 49) {
        arr[y][x] = body;
      }
    }
  }
  for (let y = 18; y < 24; y++) {
    for (let x = 18; x < 25; x++) {
      if (y <= (-0.5 * (x - 18)) + 24) {
        arr[y][x] = shade;
      }
    }
  }
  for (let y = 22; y < 32; y++) {
    for (let x = 36; x < w; x++) {
      if (Math.abs(y - 27) <= (x - 36) / 2) {
        arr[y][x] = body;
      }
    }
  }
  arr[21][36] = shade;
  return arr;
}

function generateWavePattern() {
  const w = 50, h = 50;
  const colors = ['#0000ff', '#00bfff', '#1e90ff', '#87cefa', '#e0ffff'];
  const arr = Array.from({ length: h }, () => Array(w).fill(0));
  for (let x = 0; x < w; x++) {
    const hp = Math.round(10 * Math.sin((2 * Math.PI * x) / w)) + 25;
    for (let y = hp; y < h; y++) {
      const d = y - hp;
      const color = d < colors.length ? colors[colors.length - 1 - d] : colors[0];
      arr[y][x] = color;
    }
  }
  return arr;
}

export const patternsList = {
  // Oscillators
  "Blinker": [
    [1,1,1]
  ],
  "Toad": [
    [0,1,1,1],
    [1,1,1,0]
  ],
  "Beacon": [
    [1,1,0,0],
    [1,1,0,0],
    [0,0,1,1],
    [0,0,1,1]
  ],
  "Pulsar": [
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,1,1,1,0,0]
  ],
  "Pentadecathlon": [
    [0,1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [0,1,1,0,0,1,1,0]
  ],

  // Spaceships
  "Glider": [
    [1,0,0],
    [0,1,1],
    [1,1,0]
  ],
  "LWSS": [
    [0,1,1,1,1],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,1,0]
  ],
  "MWSS": [
    [0,1,1,1,1,1],
    [1,0,0,0,0,1],
    [0,0,0,0,0,1],
    [1,0,0,0,1,0]
  ],
  "HWSS": [
    [0,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0]
  ],

  // Methuselahs
  "R-pentomino": [
    [0,1,1],
    [1,1,0],
    [0,1,0]
  ],
  "Diehard": [
    [0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0],
    [0,1,0,0,0,1,1]
  ],
  "Acorn": [
    [0,1,0,0,0,0,0],
    [0,0,0,1,0,0,0],
    [1,1,0,0,1,1,1]
  ],

  // Still Lifes
  "Block": [
    [1,1],
    [1,1]
  ],
  "Beehive": [
    [0,1,1,0],
    [1,0,0,1],
    [0,1,1,0]
  ],
  "Loaf": [
    [0,1,1,0],
    [1,0,0,1],
    [0,1,0,1],
    [0,0,1,0]
  ],
  "Boat": [
    [1,1,0],
    [1,0,1],
    [0,1,0]
  ],
  "Tub": [
    [0,1,0],
    [1,0,1],
    [0,1,0]
  ],
  "Ship": [
    [1,1,0],
    [1,0,1],
    [1,1,1]
  ],
  "Snake": [
    [1,1,0,0],
    [1,0,1,0],
    [0,1,0,1],
    [0,0,1,1]
  ],
  "Long Bar": [
    [1,1,1,1,1,1]
  ],
  "Small Exploder": [
    [0,1,0],
    [1,1,1],
    [1,0,1],
    [0,1,0]
  ],
  "Exploder": [
    [1,0,1,0,1],
    [0,1,0,1,0],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [1,0,1,0,1]
  ],
  "Tumbler": [
    [0,1,1,0,1,1,0],
    [0,1,1,0,1,1,0],
    [0,0,1,0,1,0,0],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [0,0,1,0,1,0,0]
  ],
  "10 Cell Row": [
    [1,1,1,1,1,1,1,1,1,1]
  ],
  "Pi Heptomino": [
    [0,1,1],
    [1,1,1],
    [0,1,0]
  ],
  "B Heptomino": [
    [0,1,1],
    [1,1,0],
    [0,1,1]
  ],
  "F Pentomino": [
    [0,1,1],
    [1,1,0],
    [0,1,0]
  ],
  // Example color pattern - a simple rose
  "Rose": [
    [0,0,"#ff0000",0,0],
    [0,"#ff0000","#ff0000","#ff0000",0],
    ["#ff0000","#ff0000","#ff0000","#ff0000","#ff0000"],
    [0,"#ff0000","#ff0000","#ff0000",0],
    [0,0,"#ff0000",0,0],
    [0,0,"#00aa00",0,0],
    [0,"#00aa00","#00aa00","#00aa00",0],
    ["#00aa00",0,"#00aa00",0,"#00aa00"]
  ],
  // Guns
  "Gosper Glider Gun": [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ],
  "Sunflower": [
    [0, "#ff0", "#ff0", 0],
    ["#ff0", "#ffa500", "#ffa500", "#ff0"],
    ["#ff0", "#ffa500", "#ffa500", "#ff0"],
    [0, "#ff0", "#ff0", 0]
  ],
  "Ice Star": [
    [0, "#00ffff", 0],
    ["#00ffff", "#ffffff", "#00ffff"],
    [0, "#00ffff", 0]
  ],
  "Peach Blossom": [
    [0, "#ffc0cb", 0],
    ["#ffc0cb", "#ff69b4", "#ffc0cb"],
    [0, "#ffc0cb", 0]
  ],
  "Ocean Wave": [
    ["#0066cc", "#0099cc", "#00cccc"],
    ["#0099cc", "#00cccc", "#00ffff"],
    ["#00cccc", "#00ffff", "#e0ffff"]
  ],
  "Lava Core": [
    [0, "#ff4500", 0],
    ["#ff6347", "#ff0000", "#ff6347"],
    [0, "#ff4500", 0]
  ],
  "Crystal Bloom": [
    [0, "#e0ffff", 0],
    ["#add8e6", "#ffffff", "#add8e6"],
    [0, "#e0ffff", 0]
  ],
  "Galaxy Spiral": [
    ["#800080", "#4b0082", "#0000ff"],
    ["#4b0082", "#8a2be2", "#4b0082"],
    ["#0000ff", "#4b0082", "#800080"]
  ],
  "Leaf Cluster": [
    [0, "#228b22", 0],
    ["#32cd32", "#00ff00", "#32cd32"],
    [0, "#228b22", 0]
  ],
  "Candy Twist": [
    ["#ff69b4", "#fff", "#ff69b4"],
    ["#fff", "#ff69b4", "#fff"],
    ["#ff69b4", "#fff", "#ff69b4"]
  ],
  "Snowflake": [
    [0, "#add8e6", 0],
    ["#add8e6", "#ffffff", "#add8e6"],
    [0, "#add8e6", 0]
  ],
  "Flame Burst": [
    ["#ff4500", "#ff6347", "#ff4500"],
    ["#ff6347", "#ffd700", "#ff6347"],
    ["#ff4500", "#ff6347", "#ff4500"]
  ],
  "Emerald Gem": [
    [0, "#00ff7f", 0],
    ["#00fa9a", "#7fff00", "#00fa9a"],
    [0, "#00ff7f", 0]
  ],
  "Cotton Candy Swirl": [
    ["#ffb6c1", "#fff", "#add8e6"],
    ["#fff", "#ffb6c1", "#fff"],
    ["#add8e6", "#fff", "#ffb6c1"]
  ],
  "Neon Cross": [
    [0, "#39ff14", 0],
    ["#39ff14", "#ff00ff", "#39ff14"],
    [0, "#39ff14", 0]
  ],
  "Palm Tree": [
    [0, "#228B22", 0],
    ["#8B4513", "#228B22", "#8B4513"],
    [0, "#8B4513", 0],
    [0, "#8B4513", 0],
    [0, "#8B4513", 0]
  ],
  "Flamingo": [
    [0, "#ff69b4", 0],
    [0, "#ff69b4", "#ff69b4"],
    ["#000000", "#ff69b4", "#000000"],
    [0, "#000000", 0],
    [0, "#000000", 0]
  ],
  "Dolphin": generateDolphinPattern(),
  "Sun Over Beach": [
    ["#ffdd00", "#ffdd00", "#ffdd00"],
    [0, "#87ceeb", 0],
    ["#87ceeb", "#87ceeb", "#87ceeb"],
    ["#f4a460", "#f4a460", "#f4a460"],
    ["#f4a460", "#f4a460", "#f4a460"]
  ],
  "Ocean Wave 2": generateWavePattern(),
  // Expand as much as you want!
};

export function insertPattern(game, baseRow, baseCol, patternName, color, colorMode) {
  const pattern = patternsList[patternName];
  if (!pattern) return;
  const pr = Math.floor(pattern.length / 2);
  const pc = Math.floor(pattern[0].length / 2);
  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      const cell = pattern[r][c];
      if (cell) {
        const cellColor = typeof cell === 'string' ? cell : color;
        game.paint(baseRow + r - pr, baseCol + c - pc, cellColor, colorMode);
      }
    }
  }
}
