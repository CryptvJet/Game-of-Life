# Game-of-Life
Open Source Game of Life

# 🌈 ColorLife: A Multidimensional Cellular Automaton

**ColorLife** is a creative, interactive reimagining of Conway’s Game of Life, adding color as a dynamic, meaningful dimension. Each cell becomes a living pixel with its own color, memory, and the capacity for visual "ghosts"—traces of what came before.

---

## 🚀 Features

- **Grid fills the entire browser window**
- **Controls overlay the grid** (always clickable, never hidden)
- **Start/Pause, Clear, Reset, Zoom in/out**
- **Color picker** for user-selected living cell color
- **Click and drag** to paint live cells in real time
- **Customizable rules**: “born” and “survive” counts
- **Ghost layer**: dead cells fade, showing memory of past life
- **Cells inherit the average color of their three parents**
- **Mobile and desktop touch/click support**
- **Vanilla HTML, CSS, and JavaScript: no dependencies**

---

## ✨ Project Vision

> Extend traditional cellular automata by making **color** an active part of the rules, state, and memory. Explore emergence, resonance, and visual physics through interactive play.

---

## 🖥️ Getting Started

### Quick Start

1. **Clone or download this repository**
2. **Open `index.html` in your browser**

That’s it! The simulation will fill your screen and controls will be visible on top.

---

## 🕹️ Controls

| Button/Slider         | Description                                                    |
|---------------------- |----------------------------------------------------------------|
| ▶ Start / ⏸ Pause    | Start or pause the automaton                                   |
| 🧹 Clear              | Erase all living and ghost cells                               |
| 🔄 Reset              | Randomize the board                                            |
| ➕ / ➖                | Zoom in/out (change cell size)                                 |
| 🎨 Color Picker       | Choose color for user-painted living cells                     |
| Cells Born At         | Adjust the number of neighbors needed for a cell to be born    |
| Survival Count        | Adjust the number of neighbors for a cell to survive           |
| Click & Drag Canvas   | Paint live cells with selected color                           |

---

## 🎨 Color, Memory, and Ghosts

- **Live cell:** Uses your selected color (or inherits color blend from three parents)
- **Ghost cell:** When a cell dies, its color fades gradually, leaving a visible "memory"
- **Color blending:** When a new cell is born, it averages the RGB values of its three neighbors

---

## 🌈 In Development / Future Ideas

- Full parameter panel (grid size, fade speed, etc.)
- Save/load patterns, export/import as JSON
- Advanced color logic: harmonic bonuses, entropy, and more
- Pattern seeding from images or code
- Sound synthesis: color-to-audio mapping
- **Binary Pulse Theory**: explorations in fundamental oscillation and emergence

---

## 📁 File Structure

```
.
├── index.html
├── style.css
└── src/
    ├── main.js
    └── game.js
```

---

## 🧠 Binary Pulse Theory (BPT)

> Everything originates from a foundational pulse between 0 and 1—a universal oscillation between being and non-being, form and void. This simulation explores what emerges when such a pulse is seeded with color, memory, and time.

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

Enjoy exploring ColorLife!  
Contributions and creative experiments welcome.