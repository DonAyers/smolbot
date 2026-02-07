# Copilot Instructions for Smolbot

This file contains project-specific guidance and lessons learned to help AI assistants work efficiently on this codebase.

## Project Overview

Smolbot is a procedurally generated 2D side-scrolling platformer built with:
- **Phaser 3.90.0** - Game engine
- **Vite 7.3.1** - Build tool and dev server
- **Playwright** - Headless testing framework for autonomous AI development

## Key Architecture Decisions

### Asset Management
- **Tile size:** 18x18 pixels for building tiles (brick-wall, brick-window, brick-door)
- **Sprite scale:** Player and enemies are scaled to 0.25 (25%) to match world size
- **Robot sprites:** ~157x150px frames, scaled to ~40x37px in-game
- **Asset source:** Kenney asset packs (stored in `kenney_*/` folders, excluded from git)
- **Active assets:** Only copy needed assets to `public/assets/images/`
- **Unused assets:** Delete from public folder to keep repo clean
- **Spritesheet format:** Using atlasXML for robot sprites (spritesheet_robotsSide.png + .xml)

### Animation System
- **Format:** Texture atlas with XML definition
- **Player animations:** robot-idle, robot-walk (with tank treads), robot-jump, robot-fall
- **Enemy animations:** enemy-idle, enemy-walk
- **Frame naming:** robot_blueBody.png, robot_blueDrive1.png, robot_redBody.png, etc.
- **Setup location:** BootScene.create() method

### World Structure
- **World bounds:** 4000x2400 (5x wider, 4x taller than viewport)
- **Viewport:** 800x600
- **Camera:** Follows player with lerp smoothing (0.1, 0.1)
- **Parallax:** Background scrolls at 0.3x speed
- **Physics:** Arcade physics with gravity Y: 800

### Code Organization
```
src/
  ├── components/          # Player, Enemy classes
  ├── scenes/             # BootScene (loading), GameScene (main)
  ├── utils/              # ProceduralLevelGenerator
  └── main.js             # Game config + state exposure
```

## AI Agent Testing Framework

**Critical:** This project has a headless testing system that allows AI agents to verify their own work.

### How to Test Your Changes

1. **Write a test:** Create `tests/your-feature.json`
2. **Run it:** `npm run test:agent tests/your-feature.json`
3. **Check results:** Screenshots and state dumps in `tmp/screenshots/`

### Test Workflow Example
```bash
# After implementing double jump
npm run test:agent tests/double-jump.json
# Check tmp/screenshots/double_jump_*.txt for jump count
```

### Available Test Actions
- `wait` - Pause execution (ms or seconds)
- `press_key` - Simulate keyboard input (duration in ms)
- `screenshot` - Capture visual + state (saveState: true)
- `assert` - Verify conditions (player_x, player_y, scene)
- `check_canvas` - Verify Phaser canvas exists
- `execute_js` - Run arbitrary JS in browser context

### Game State API (Development Mode Only)
```javascript
window.__GAME_INSTANCE__              // Phaser.Game instance
window.__GAME_STATE__.getGameState()  // Full state object
window.__GAME_STATE__.getPlayer()     // Player sprite
window.__GAME_STATE__.getPlayerPosition() // {x, y}
```

**Always expose new game state** when adding features. Example:
```javascript
// In src/main.js
window.__GAME_STATE__.getJumpCount = () => {
    return scene?.player?.jumpCount || 0;
};
```

## Common Patterns

### Adding New Assets
1. Copy from `kenney_*/` to `public/assets/images/`
2. Load in `BootScene.js` preload()
3. Use in game code
4. Delete unused assets before committing

### Creating New Entities
1. Create class in `src/components/`
2. Extend `Phaser.Physics.Arcade.Sprite`
3. Apply scale (0.25 for robot-sized sprites)
4. Add to scene in `GameScene.js`
5. Add colliders for physics interactions

### Modifying Level Generation
- Edit `src/utils/ProceduralLevelGenerator.js`
- Methods: `generateLevel()`, `generatePlatforms()`, `generateBuildings()`
- Remember to update world bounds in `generateLevel()`
- Test with R key (regenerate level in-game)

## Development Server

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run stop             # Stop any running server
npm run restart          # Stop and restart
npm run test:agent -- <test-file.json>  # Run agent test
```

## Performance Considerations

- **Enemy count:** Currently ~160 enemies for 4000x2400 world
- **Target FPS:** 60 (achieved with current setup)
- **Physics:** Use static groups for platforms (non-moving)
- **Optimization:** Enemies update every frame but are simple patrol AI

## Known Issues & Quirks

1. **Window object access:** Game instance only exposed in dev mode (`import.meta.env.DEV`)
2. **Vite HMR:** Sometimes requires full page reload for asset changes
3. **Test runner:** Needs 2-3 second wait for level generation to complete
4. **Building tiles:** 70x70 size slightly different from platform tiles (64x64)

## Git Strategy

**Commit:**
- Source code
- Active assets in `public/assets/images/`
- Test files in `tests/`
- Documentation

**Don't Commit:**
- `kenney_*/` folders (source archives)
- `*.zip` files
- `tmp/` folder (test output)
- `node_modules/`, `dist/`

## Quick Reference

### Sprite Scales
- Player/Enemy: 0.25
- Tiles: 1.0 (native size)

### Key Bindings
- Arrow keys: Movement
- Up/Space: Jump
- R: Regenerate level

### Critical Files
- `src/main.js` - Game state exposure for testing
- `src/scenes/BootScene.js` - Asset loading
- `src/scenes/GameScene.js` - Main game logic
- `src/utils/ProceduralLevelGenerator.js` - Level generation
- `agent-runner.js` - Test execution engine
- `AGENTS.md` - Detailed testing guide for AI agents

## Development Philosophy

**Test-Driven:** Write tests for new features before considering them complete.

**State-First:** Expose game state to window object so tests can verify behavior.

**Asset-Conscious:** Only commit assets that are actively used in the game.

**Autonomous-Ready:** Design features so AI can verify them without human intervention.

## Future AI Agents: Start Here

1. Read `AGENTS.md` for complete testing framework guide
2. Check `src/` structure to understand codebase
3. Look at `tests/` for examples of testing patterns
4. Use `npm run test:agent` after making changes
5. Review screenshots in `tmp/screenshots/` to verify visually

## Tips for Efficiency

- **Parallel tool calls:** Read multiple files at once when exploring
- **Test early:** Run tests as soon as you implement something
- **Clean assets:** Remove unused files immediately
- **Expose state:** Add to `window.__GAME_STATE__` for testability
- **Check screenshots:** Visual verification is faster than manual testing
