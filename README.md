# Tetris

A classic Tetris game built with HTML5 Canvas, CSS3, and vanilla JavaScript.

![Tetris](https://img.shields.io/badge/Tetris-Classic%20Game-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- 🎮 **Classic Gameplay**: All 7 tetromino shapes with authentic mechanics
- 🎨 **Modern Design**: Dark theme with gradient UI and smooth animations
- 🔊 **Sound Effects**: Retro arcade sounds for all game actions
- 🎵 **Background Music**: Iconic Tetris theme (Korobeiniki) looping soundtrack
- 📊 **Score System**: Track score, lines cleared, and current level
- 👀 **Next Piece Preview**: See the upcoming piece to plan your moves
- 📱 **Mobile Friendly**: On-screen touch controls for mobile devices
- ⌨️ **Keyboard Support**: Full keyboard controls for desktop play
- 🚀 **Progressive Difficulty**: Speed increases as you level up

## How to Play

### Objective
Arrange falling tetromino blocks to create complete horizontal lines. Completed lines disappear, earning you points and clearing space for more blocks.

### Controls

#### Keyboard Controls
| Key | Action |
|-----|--------|
| ← Left Arrow | Move piece left |
| → Right Arrow | Move piece right |
| ↓ Down Arrow | Soft drop (move down faster) |
| ↑ Up Arrow | Rotate piece |
| Space | Hard drop (instant drop) |

#### On-Screen Controls
- **◀** - Move left
- **▶** - Move right
- **↻** - Rotate
- **▼** - Soft drop
- **⤋** - Hard drop
- **▶** - Start game
- **⏸** - Pause game
- **⏹** - Stop/Reset game
- **🔊/🔇** - Mute/Unmute sound effects
- **🎵** - Toggle background music (on/off)

### Game Mechanics

#### Sound Effects
| Event | Sound |
|-------|-------|
| Move Left/Right | Short beep |
| Rotate | Higher pitch beep |
| Hard Drop | Low thud |
| Line Clear | Pleasant chime (multi-note for multiple lines) |
| Level Up | Ascending arpeggio |
| Game Over | Descending tone sequence |
| Start Game | Victory fanfare |
| Pause | Confirmation beep |

#### Background Music
- **Tetris Theme (Korobeiniki)**: Classic Russian folk melody
- Automatically starts when you begin the game
- Pauses when the game is paused
- Toggle on/off with the 🎵 button
- Controlled independently from sound effects

#### Scoring
- **Line Clear**: 100 × current level points per line
- **Multiple Lines**: Each line cleared in a single drop counts separately

#### Leveling
- Level up every **10 lines** cleared
- Higher levels = faster falling speed

#### Game Over
The game ends when a new piece cannot enter the board (stack reaches the top).

## Tetromino Shapes

| Shape | Color | Description |
|-------|-------|-------------|
| I | Pink | Straight line (4 blocks) |
| O | Cyan | Square (2×2) |
| T | Green | T-shape |
| S | Purple | S-curve |
| Z | Orange | Z-curve |
| J | Yellow | J-shape |
| L | Blue | L-shape |

## Technical Details

### Tech Stack
- **HTML5 Canvas**: Rendering game graphics
- **CSS3**: Styling with flexbox, grid, and gradients
- **Vanilla JavaScript**: Game logic (no frameworks required)

### File Structure
```
tetris/
├── index.html      # Main HTML file
├── style.css       # Styles and animations
├── script.js       # Game logic
└── README.md       # This file
```

### Browser Compatibility
Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## How to Run

1. **Clone or download** this repository
2. **Open** `index.html` in any modern web browser
3. **Click** the ▶ button to start playing

No build process or dependencies required!

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

## Tips & Strategies

1. **Plan ahead**: Use the next piece preview to plan your moves
2. **Keep it flat**: Try to maintain a flat surface for more placement options
3. **Save the I piece**: Keep it for clearing multiple lines at once (Tetris!)
4. **Use hard drop**: Space bar for quick placement when you're sure
5. **Watch your speed**: Higher levels fall faster - stay focused!

## License

MIT License - Feel free to use, modify, and distribute.

---

Enjoy playing Tetris! 🎮
