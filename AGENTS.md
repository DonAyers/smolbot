# AI Agent Testing Guide for Smolbot

## Overview

This document explains how AI agents can autonomously develop, test, and verify changes to the Smolbot Phaser.js game using the headless testing framework.

## Architecture

The testing framework consists of:

1. **Game State Exposure** (`src/main.js`) - Exposes Phaser game instance and state helpers to the browser's window object
2. **Test Runner** (`agent-runner.js`) - Playwright-based automation that launches the game and executes test scenarios
3. **Test Scenarios** (`tests/*.json`) - JSON files describing actions and assertions
4. **Visual Output** (`tmp/screenshots/`) - Screenshots and state dumps for verification

## Quick Start

### Running a Test

```bash
npm run test:agent -- tests/hello-world.json
```

### Creating a Test

Create a JSON file in the `tests/` directory with the following structure:

```json
{
  "name": "My Test Name",
  "description": "What this test verifies",
  "actions": [
    {"action": "wait", "seconds": 2},
    {"action": "check_canvas"},
    {"action": "screenshot", "name": "my_screenshot", "saveState": true}
  ]
}
```

## Available Actions

### `check_canvas`
Verifies that the Phaser canvas element exists in the DOM.

```json
{"action": "check_canvas"}
```

### `wait`
Pauses execution for a specified duration.

```json
{"action": "wait", "ms": 1000}
// OR
{"action": "wait", "seconds": 2}
```

### `press_key`
Simulates a keyboard key press.

```json
{
  "action": "press_key",
  "key": "Space",
  "duration": 100
}
```

Common keys: `"Space"`, `"ArrowLeft"`, `"ArrowRight"`, `"ArrowUp"`, `"ArrowDown"`, `"KeyW"`, `"KeyA"`, `"KeyS"`, `"KeyD"`

### `screenshot`
Captures a screenshot of the game and optionally saves the game state.

```json
{
  "action": "screenshot",
  "name": "level_1_start",
  "saveState": true
}
```

Outputs:
- `tmp/screenshots/level_1_start_[timestamp].png` - Visual screenshot
- `tmp/screenshots/level_1_start_[timestamp].txt` - Game state and console logs

### `assert`
Verifies game state conditions.

```json
{
  "action": "assert",
  "type": "player_x",
  "operator": "greater_than",
  "value": 100
}
```

**Assertion Types:**
- `player_x` - Player X coordinate
- `player_y` - Player Y coordinate
- `sprite_x` - Alias for player_x
- `sprite_y` - Alias for player_y
- `scene` - Active scene name

**Operators:**
- `equals` - Exact match
- `greater_than` - Value is greater
- `less_than` - Value is less
- `not_null` - Value exists

### `execute_js`
Executes arbitrary JavaScript in the browser context.

```json
{
  "action": "execute_js",
  "code": "window.__GAME_STATE__.getPlayerPosition()"
}
```

## Game State API

When running in development mode, the following helpers are available in the browser:

### `window.__GAME_INSTANCE__`
Direct access to the Phaser.Game instance.

### `window.__GAME_STATE__.getScene()`
Returns the currently active scene object.

### `window.__GAME_STATE__.getActiveSceneName()`
Returns the name/key of the active scene.

### `window.__GAME_STATE__.getPlayer()`
Returns the player sprite object (if available).

### `window.__GAME_STATE__.getPlayerPosition()`
Returns `{x, y}` coordinates of the player.

### `window.__GAME_STATE__.getGameState()`
Returns comprehensive game state:

```javascript
{
  activeScene: "GameScene",
  player: {
    x: 400,
    y: 300,
    velocityX: 0,
    velocityY: 0,
    visible: true,
    active: true
  },
  gameTime: 12345,
  fps: 60
}
```

## Workflow for AI Agents

### 1. Making Changes
When modifying game code, follow this process:

1. Make your code changes
2. Write a test scenario that exercises the new functionality
3. Run the test
4. Review screenshots and state dumps in `tmp/screenshots/`
5. Verify the behavior matches expectations

### 2. Debugging Failures
When a test fails:

1. Check the console output for error messages
2. Look for `error_[timestamp].png` and `error_[timestamp].txt` in `tmp/screenshots/`
3. Review the game state dump to understand what went wrong
4. Read recent console logs in the state dump file

### 3. Example Test Scenarios

#### Testing Player Movement
```json
{
  "name": "Player Movement Test",
  "actions": [
    {"action": "wait", "seconds": 2},
    {"action": "screenshot", "name": "before_move", "saveState": true},
    {"action": "press_key", "key": "ArrowRight", "duration": 500},
    {"action": "wait", "ms": 100},
    {"action": "screenshot", "name": "after_move", "saveState": true},
    {"action": "assert", "type": "player_x", "operator": "greater_than", "value": 400}
  ]
}
```

#### Testing Scene Transitions
```json
{
  "name": "Scene Transition Test",
  "actions": [
    {"action": "wait", "seconds": 2},
    {"action": "assert", "type": "scene", "operator": "equals", "value": "BootScene"},
    {"action": "wait", "seconds": 3},
    {"action": "assert", "type": "scene", "operator": "equals", "value": "GameScene"}
  ]
}
```

## Output Files

### Screenshots (`tmp/screenshots/*.png`)
PNG images showing the visual state of the game at the moment of capture.

### State Dumps (`tmp/screenshots/*.txt`)
Text files containing:
- Timestamp
- Complete game state JSON
- Last 10 console log entries

Example state dump:
```
Game State Snapshot: initial_load
Timestamp: 2026-02-06T20:00:00.000Z

=== GAME STATE ===
{
  "activeScene": "GameScene",
  "player": {
    "x": 400,
    "y": 300,
    "velocityX": 0,
    "velocityY": 0,
    "visible": true,
    "active": true
  },
  "gameTime": 5432,
  "fps": 60
}

=== CONSOLE LOGS (Last 10) ===
[log] Phaser initialized
[log] GameScene started
```

## Best Practices for AI Agents

1. **Always wait after loading** - Give the game 1-2 seconds to initialize before taking actions
2. **Capture before and after** - Take screenshots before and after significant actions
3. **Use assertions liberally** - Verify state at each critical step
4. **Read state dumps** - When analyzing failures, read the .txt files, not just screenshots
5. **Test incrementally** - Create small, focused tests for each feature
6. **Clean up** - The `tmp/` folder is gitignored, so it's safe for test output
7. **Name meaningfully** - Use descriptive screenshot names like "player_jump_apex" not "test1"

## Troubleshooting

### Test hangs on server start
The Vite server may take time to start. The runner waits up to 30 seconds. If it consistently fails, check if port 3000 is available.

### Canvas not found
Ensure the game has had time to initialize. Add a `wait` action before `check_canvas`.

### Player state is null
The player object may not exist in all scenes. BootScene typically doesn't have a player - it transitions to GameScene.

### Screenshots are blank
Wait for the scene to fully render before capturing. Add a 500ms-1s delay after scene transitions.

## Extending the Framework

### Adding New Actions
Edit `agent-runner.js` and add a case to the `executeAction` switch statement:

```javascript
case 'my_custom_action':
    await this.myCustomAction(params);
    break;
```

### Adding New Assertions
Add cases to the `assertCondition` method in `agent-runner.js`:

```javascript
case 'my_custom_check':
    actualValue = state.someValue;
    break;
```

### Exposing More Game State
Edit the `window.__GAME_STATE__` object in `src/main.js` to expose additional game properties.

## Example: Complete Development Cycle

1. **Feature Request**: "Add double jump ability"

2. **Implementation**: 
   - Modify player code to track jump count
   - Add double jump logic

3. **Expose State**:
   ```javascript
   // In src/main.js
   window.__GAME_STATE__.getJumpCount = () => {
       return scene?.player?.jumpCount || 0;
   };
   ```

4. **Write Test** (`tests/double-jump.json`):
   ```json
   {
     "name": "Double Jump Test",
     "actions": [
       {"action": "wait", "seconds": 2},
       {"action": "press_key", "key": "Space", "duration": 100},
       {"action": "wait", "ms": 200},
       {"action": "press_key", "key": "Space", "duration": 100},
       {"action": "wait", "ms": 500},
       {"action": "screenshot", "name": "double_jump", "saveState": true}
     ]
   }
   ```

5. **Run Test**:
   ```bash
   npm run test:agent -- tests/double-jump.json
   ```

6. **Verify**: Check `tmp/screenshots/double_jump_*.txt` for jump count and player Y position

## Conclusion

This framework enables AI agents to:
- ✅ Automatically test game features
- ✅ Verify changes without human intervention
- ✅ Capture visual and state information for analysis
- ✅ Iterate quickly with immediate feedback

For questions or issues, refer to the test runner source code in `agent-runner.js`.
