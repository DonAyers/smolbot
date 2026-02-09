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
- **Procedural generation** - Buildings, platforms, and environments
- **Health system** - Visual health display with damage mechanics
- **Animation system** - Smooth character animations with debug tools
- **Asset auto-organization** - Drop zip files, get organized assets
- **Local AI generation** - Generate pixel art with SDXL + quality evaluation
- **AI agent testing** - Autonomous testing framework
- **Autonomous improvement** - Self-improving game development
- **Robot sprites with tank treads** - Animated character movement
- **Vite** - Fast development server with HMR

## Quick Start

```bash
npm install
npm run dev          # Start dev server at http://localhost:3000
npm run watch-assets # (Optional) Auto-process asset drops
```

See [docs/QUICK_START.md](docs/QUICK_START.md) for detailed setup.

## Key Commands

```bash
# Development
npm run dev                        # Start dev server
npm run build                      # Build for production
npm run watch-assets               # Auto-process assets

# Assets
npm run organize-assets            # Organize from staging
npm run organize-assets:dry-run    # Preview organization

# AI Testing & Improvement
npm run test:agent -- tests/*.json # Run automated test
npm run improve create <name>      # Create improvement task
npm run improve:auto <task-id> N   # Run N improvement iterations

# AI Asset Generation
npm run assets:generate <file>     # Generate asset locally
npm run assets:find <task> <type>  # Find assets online
```

## In-Game Tools

Press while playing:
- **V** - Sprite Viewer (see all frames)
- **D** - Animation Debugger (live state)
- **R** - Regenerate level

## Documentation

### Getting Started
- **[Quick Start](docs/QUICK_START.md)** - 5-minute setup guide
- **[Asset Management](docs/ASSETS.md)** - Complete asset workflow
- **[AI Agents](docs/AGENTS.md)** - Testing & improvement systems
- **[Local AI](docs/LOCAL_AI.md)** - AI asset generation

### Advanced
- **[Procedural Improvement](docs/PROCEDURAL_IMPROVEMENT.md)** - Detailed improvement workflow
- **[Animation Debugging](docs/learning/ANIMATION_DEBUGGING.md)** - Animation tips & lessons

### System Files
- **[.copilot/instructions.md](.copilot/instructions.md)** - AI assistant guidance

## License

Code: MIT  
Assets: CC0 (Kenney)

