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
- **Health System** - Visual health display with damage and invulnerability
- **Animation System** - Smooth character animations with debugging tools
- **Asset Auto-Organization** - Drop zip files, get organized assets
- **AI Agent Testing** - Autonomous testing framework using Playwright
- **Robot sprites with tank treads** - Animated character movement
- **Vite** - Fast development server with HMR

## Quick Start

```bash
npm install
npm run dev          # Start dev server at http://localhost:3000
npm run watch-assets # (Optional) Auto-process asset drops
```

## Development Commands

```bash
npm run dev                        # Start dev server
npm run build                      # Build for production
npm run preview                    # Preview production build
npm run watch-assets               # Watch for new assets (auto-unzip & organize)
npm run organize-assets            # Manually organize assets
npm run organize-assets:dry-run    # Preview asset organization
npm run test:agent -- tests/your-test.json  # Run AI agent test
```

## Asset Workflow

### Automatic (Recommended)
```bash
# Terminal 1: Start watcher
npm run watch-assets

# Terminal 2: Start dev server  
npm run dev

# Then just drop .zip files into to-be-processed-assets/
# Everything happens automatically!
```

### Manual
```bash
# Add assets to staging folder
cp ~/Downloads/asset-pack.zip to-be-processed-assets/

# Organize
npm run organize-assets
```

See [ASSET_WATCHER.md](ASSET_WATCHER.md) and [ASSET_WORKFLOW.md](ASSET_WORKFLOW.md) for details.

## AI Agent Testing

This project includes an autonomous testing framework for AI-driven development. See [AGENTS.md](AGENTS.md) for complete documentation.

**Quick test:**
```bash
npm run test:agent -- tests/small-tiles-spritesheet.json
```

Results appear in `tmp/screenshots/` with visual captures and state dumps.

## In-Game Debug Tools

Press these keys while playing:
- **V** - Sprite Viewer (see all atlas frames)
- **D** - Animation Debugger (live animation state)
- **R** - Regenerate level

## Documentation

- [AGENTS.md](AGENTS.md) - AI agent integration guide
- [ASSET_WATCHER.md](ASSET_WATCHER.md) - Automatic asset processing
- [ASSET_WORKFLOW.md](ASSET_WORKFLOW.md) - Manual asset organization
- [ANIMATION_DEBUGGING_LESSONS.md](ANIMATION_DEBUGGING_LESSONS.md) - Animation tips

## License

Code: MIT  
Assets: CC0 (Kenney)

