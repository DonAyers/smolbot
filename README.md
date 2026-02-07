# SmallBot - 2D Platformer

A procedurally generated 2D side-scrolling platformer built with Phaser 3.

## Credits

### Game Assets
All game assets are from [Kenney](https://kenney.nl/) and are public domain (CC0).

**Asset Packs Used:**
- [Robot Pack](https://kenney.nl/assets/robot-pack) - Player and enemy sprites with tank treads
- [Pixel Platformer](https://kenney.nl/assets/pixel-platformer) - Building tiles (18x18)
- [Platformer Art: Buildings](https://kenney.nl/assets/platformer-art-buildings) - Building decorations
- [New Platformer Pack](https://kenney.nl/assets/new-platformer-pack) - Backgrounds

Special thanks to Kenney for providing these amazing free assets!

## Features

- **Phaser 3** - Modern HTML5 game framework
- **Side-scrolling camera** - Follows player through 4000x2400 world
- **Procedural building generation** - Tall buildings with windows and doors
- **AI Agent Testing** - Autonomous testing framework using Playwright
- **Robot sprites with tank treads** - Animated character movement
- **Vite** - Fast development server with HMR

## Quick Start

```bash
npm install
npm run dev          # Start dev server at http://localhost:3000
```

## Development Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run test:agent -- tests/your-test.json  # Run AI agent test
```

## AI Agent Testing

This project includes an autonomous testing framework for AI-driven development. See [AGENTS.md](AGENTS.md) for complete documentation.

**Quick test:**
```bash
npm run test:agent -- tests/small-tiles-spritesheet.json
```

Results appear in `tmp/screenshots/` with visual captures and state dumps.

## License

Code: MIT  
Assets: CC0 (Kenney)

