# SmallBot - 2D Platformer

A procedurally generated 2D platformer built with Phaser 3.

## Features

- **Phaser 3** - Modern HTML5 game framework
- **Vite** - Fast development server with HMR
- **Procedural Generation** - Levels generated using Simplex noise and algorithms
- **Modular Architecture** - Clean scene and component structure
- **Flexible Asset Pipeline** - Supports individual PNGs, sprite sheets, or texture atlases

## Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:3000** to see the game!

## Adding Your Robot Assets

You mentioned having robot pack assets. Here's how to add them:

### Option 1: Individual PNG Files (Recommended for AI workflow)

1. **Copy your PNGs** to `public/assets/images/robot/`
   ```
   public/assets/images/robot/
     ├── idle.png
     ├── walk-1.png
     ├── walk-2.png
     ├── jump.png
     └── ...
   ```

2. **Use the example**: Copy content from `src/scenes/examples/BootScene.IndividualPNGs.js` to `src/scenes/BootScene.js`

3. **Update paths** to match your file names

4. **Uncomment player code** in `src/scenes/GameScene.js`:
   ```javascript
   import Player from '../components/Player';
   // ...
   this.player = new Player(this, 100, 450, 'robot-idle');
   this.physics.add.collider(this.player, platforms);
   ```

### Option 2: Sprite Sheet (Better performance)

1. **Copy sprite sheet** to `public/assets/images/robot-spritesheet.png`

2. **Document the frames**: Note which frame number corresponds to which action

3. **Use the example**: Copy content from `src/scenes/examples/BootScene.SpriteSheet.js`

4. **Update frame numbers** to match your sprite sheet layout

📖 **See `src/scenes/examples/README.md` for detailed guide on all three asset approaches**

## Project Structure

```
SmallBot/
├── public/
│   └── assets/          # Place your game assets here
│       ├── images/      # Sprites, tilesets, backgrounds
│       ├── audio/       # Sound effects and music
│       └── tilemaps/    # Tilemap JSON files (if using Tiled)
├── src/
│   ├── scenes/          # Game scenes
│   │   ├── BootScene.js        # Asset loading scene
│   │   ├── GameScene.js        # Main game scene
│   │   └── examples/           # Three asset loading examples
│   ├── utils/           # Utility classes
│   │   └── ProceduralLevelGenerator.js  # Level generation algorithms
│   ├── components/      # Reusable game components
│   │   └── Player.js           # Player character with animations
│   └── main.js          # Game configuration and entry point
├── index.html
├── vite.config.js
└── package.json
```

## Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Procedural Generation

The project includes `ProceduralLevelGenerator.js` with multiple generation methods:

- **Simplex Noise** (Active) - For organic, natural-looking platform placement
- **Maze Generation** - Using the `generate-maze` package (commented out, ready to use)
- **Chunk-based** - Template for room/segment-based generation

Customize generation in `src/utils/ProceduralLevelGenerator.js`

## For AI-Assisted Development

This project is optimized for working with AI coding assistants:

### Asset Loading Examples
- Three complete examples in `src/scenes/examples/`
- Choose individual PNGs for maximum AI understanding
- Use semantic file names like `robot-jump.png`

### Documentation
- `public/assets/ASSET_GUIDE.md` - Comprehensive asset workflow guide
- `src/scenes/examples/README.md` - How to choose and use each approach
- Inline code comments explain all major systems

### Player Component
- Ready-to-use player in `src/components/Player.js`
- Automatically handles animations if they exist
- Works with or without sprites (falls back to green rectangle)

## Next Steps

1. ✅ **Add your robot assets** (see "Adding Your Robot Assets" above)
2. ✅ **Uncomment player code** in `GameScene.js` to make it playable
3. Add enemies and collectibles
4. Create additional scenes (menu, game over, etc.)
5. Add sound effects and music
6. Implement scoring and progression system
7. Customize procedural generation algorithms

## Packages Used

- **phaser** - Game framework
- **simplex-noise** - Noise-based procedural generation  
- **generate-maze** - Maze algorithm for level generation
- **vite** - Build tool and dev server

## Resources

- [Phaser 3 Documentation](https://docs.phaser.io/)
- [Phaser Examples](https://phaser.io/examples)
- [Procedural Tilemap Tutorial](https://phaser.io/news/2019/02/procedural-maze-generation-in-phaser-3)
- [Asset Loading Guide](public/assets/ASSET_GUIDE.md)

