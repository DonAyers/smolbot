# AI Agent Guide

Complete guide for AI agents to autonomously develop, test, and improve Smolbot.

## Table of Contents

1. [Overview](#overview)
2. [Testing Framework](#testing-framework)
3. [Improvement System](#improvement-system)
4. [Asset Discovery](#asset-discovery)
5. [Complete Workflow](#complete-workflow)

---

## Overview

This document explains three integrated systems for autonomous development:

1. **agent-runner.js** - Automated testing with Playwright
2. **agent-improvement-runner.js** - Iterative improvement orchestration
3. **asset-discovery-agent.js** - Asset finding and generation

Together, these enable fully autonomous game development cycles.

---

## Testing Framework

### Quick Start

```bash
npm run test:agent -- tests/hello-world.json
```

### Components

1. **Game State Exposure** (`src/main.js`) - Exposes Phaser to browser
2. **Test Runner** (`agent-runner.js`) - Playwright automation
3. **Test Scenarios** (`tests/*.json`) - JSON test definitions
4. **Visual Output** (`tmp/screenshots/`) - Screenshots + state dumps

### Creating Tests

Create `tests/your-test.json`:
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

### Available Actions

**check_canvas** - Verify canvas exists:
```json
{"action": "check_canvas"}
```

**wait** - Pause execution:
```json
{"action": "wait", "seconds": 2}
// OR
{"action": "wait", "ms": 1000}
```

**press_key** - Simulate keyboard:
```json
{
  "action": "press_key",
  "key": "Space",
  "duration": 100
}
```

Common keys: `"Space"`, `"ArrowLeft"`, `"ArrowRight"`, `"ArrowUp"`, `"ArrowDown"`

**screenshot** - Capture visual + state:
```json
{
  "action": "screenshot",
  "name": "level_1_start",
  "saveState": true
}
```

Outputs:
- `tmp/screenshots/level_1_start_[timestamp].png`
- `tmp/screenshots/level_1_start_[timestamp].txt`

**assert** - Verify conditions:
```json
{
  "action": "assert",
  "type": "player_x",
  "operator": "greater_than",
  "value": 100
}
```

Types: `player_x`, `player_y`, `sprite_x`, `sprite_y`, `scene`
Operators: `equals`, `greater_than`, `less_than`, `not_null`

**execute_js** - Run custom code:
```json
{
  "action": "execute_js",
  "code": "window.__GAME_STATE__.getPlayerPosition()"
}
```

### Game State API

Available in browser during development:

```javascript
// Direct game access
window.__GAME_INSTANCE__

// Helper functions
window.__GAME_STATE__.getScene()
window.__GAME_STATE__.getActiveSceneName()
window.__GAME_STATE__.getPlayer()
window.__GAME_STATE__.getPlayerPosition()
window.__GAME_STATE__.getGameState()
```

### Example Tests

**Player Movement**:
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

**Scene Transitions**:
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

### Best Practices

1. **Always wait after loading** - Give game 1-2s to initialize
2. **Capture before and after** - Screenshot significant actions
3. **Use assertions liberally** - Verify at each critical step
4. **Read state dumps** - Check .txt files when analyzing failures
5. **Test incrementally** - Small focused tests per feature
6. **Name meaningfully** - Use descriptive names like "player_jump_apex"

---

## Improvement System

### Quick Start

```bash
# 1. Create task
npm run improve create "Building Improvements" "Add variety" buildings

# 2. Run autonomous agent
npm run improve:auto task_<id> 3

# 3. Execute sub-agents (copy commands from output)
copilot --allow-all-tools -p "$(cat improvement-tasks/task_<id>/prompt-iteration-1.txt)"
```

### Architecture

```
┌──────────────────────────────────────────┐
│  Autonomous Improvement Loop             │
├──────────────────────────────────────────┤
│                                          │
│  Phase 1: Reference Finding              │
│    ├─ Web search for inspiration         │
│    ├─ Find seed game screenshots         │
│    └─ Document styles                    │
│                                          │
│  Phase 2: Iteration (repeat N times)     │
│    ├─ Analyze code                       │
│    ├─ Plan changes                       │
│    ├─ Check asset needs                  │
│    ├─ Implement improvements             │
│    ├─ Test and capture screenshots       │
│    └─ Document changes                   │
│                                          │
│  Phase 3: Asset Discovery (if needed)    │
│    ├─ Search web for assets              │
│    └─ Generate with AI                   │
│                                          │
└──────────────────────────────────────────┘
```

### Components

**agent-improvement-runner.js** - Orchestrator
- Generates prompts for sub-agents
- Manages iteration workflow
- Captures screenshots automatically
- Tracks progress

**improvement-manager.js** - Task Manager
- Creates task structures
- Records notes
- Manages screenshots
- Tracks completion

**improvement-config.json** - Configuration
- Seed game references
- Screenshot settings
- Quality thresholds

### Workflow

**1. Create Task**:
```bash
npm run improve create "Better Buildings" "More variety" buildings
# → Creates: task_1234567890
```

**2. Run Auto-Agent**:
```bash
npm run improve:auto task_1234567890 3
```

Generates prompts:
- `prompt-find-references.txt` - Reference search
- `prompt-iteration-1.txt` - First improvement
- `prompt-iteration-2.txt` - Second improvement
- `prompt-iteration-3.txt` - Third improvement

**3. Execute Sub-Agents**:
```bash
# Find references
copilot -p "$(cat improvement-tasks/task_1234567890/prompt-find-references.txt)"

# Iteration 1
copilot -p "$(cat improvement-tasks/task_1234567890/prompt-iteration-1.txt)"

# Iteration 2
copilot -p "$(cat improvement-tasks/task_1234567890/prompt-iteration-2.txt)"
```

**4. Review Progress**:
```bash
# List tasks
npm run improve list

# View screenshots
start improvement-tasks\task_1234567890\iterations\
```

**5. Complete Task**:
```bash
npm run improve complete task_1234567890 "Buildings look great!"
```

### Task Structure

```
improvement-tasks/task_<id>/
├── before/                       # Baseline screenshots
├── iterations/                   # Progress screenshots
│   ├── iteration_1/
│   ├── iteration_2/
│   └── iteration_3/
├── final/                        # Completed result
├── prompt-find-references.txt    # Reference agent prompt
├── prompt-iteration-1.txt        # Improvement prompts
├── iteration-1-notes.md          # Change documentation
└── asset-request-*.md            # Asset requirements
```

### Commands

| Command | Purpose |
|---------|---------|
| `npm run improve create <name> <desc> [target]` | Create task |
| `npm run improve:auto <task-id> [iterations]` | Generate prompts |
| `npm run improve list` | View all tasks |
| `npm run improve complete <task-id> ["notes"]` | Mark complete |
| `npm run improve note <task-id> <iter> "<note>"` | Add note |

---

## Asset Discovery

### When You Need Assets

The improvement agent can detect missing assets and request them:

```bash
npm run assets:find task_<id> "neon signs" "Glowing signs for buildings"
```

Creates:
1. **Asset request document** with requirements
2. **Search prompts** for multiple sources
3. **AI generation prompts** as fallback

### Asset Sources

The agent searches:

| Source | License | Quality |
|--------|---------|---------|
| **OpenGameArt.org** | CC0, CC-BY | ⭐⭐⭐⭐ |
| **Kenney.nl** | CC0 | ⭐⭐⭐⭐⭐ |
| **Itch.io** | Varies | ⭐⭐⭐⭐ |
| **CraftPix** | Free tier | ⭐⭐⭐ |

### AI Generation Fallback

If assets not found online, generates prompts for:
- DALL-E / Midjourney / Stable Diffusion
- Local AI (see [Local AI Guide](LOCAL_AI.md))

Example generated prompt:
```
Create pixel art neon signs in Cyberpunk style.

Requirements:
- 32-bit pixel art
- Transparent background (PNG)
- Size: 64x64 or 128x64
- Bright neon colors (pink, cyan, yellow)
- Glowing effect
- Multiple variations (5-10)

Style: Blade Runner, Cyberpunk 2077
```

---

## Complete Workflow

### Full Autonomous Example

```bash
# 1. Create improvement task
npm run improve create "Building Variety" "More architectural details" buildings

# 2. Start autonomous loop (creates prompts)
npm run improve:auto task_1234567890 3

# 3. Execute reference search
copilot -p "$(cat improvement-tasks/task_1234567890/prompt-find-references.txt)"

# 4. Execute iteration 1
copilot -p "$(cat improvement-tasks/task_1234567890/prompt-iteration-1.txt)"
# → Agent analyzes, codes improvements, captures screenshots

# 5. Agent realizes it needs new assets
# → Creates assets-needed.md

# 6. Run asset discovery
npm run assets:find task_1234567890 "window variety" "Different window types"
copilot -p "$(cat improvement-tasks/task_1234567890/asset-discovery-prompt.txt)"
# → Agent searches web, documents findings

# 7. Download assets to staging
# → Watcher auto-organizes (if running)
# → Or: npm run organize-assets

# 8. Execute iteration 2 (with new assets)
copilot -p "$(cat improvement-tasks/task_1234567890/prompt-iteration-2.txt)"

# 9. Execute iteration 3 (polish)
copilot -p "$(cat improvement-tasks/task_1234567890/prompt-iteration-3.txt)"

# 10. Review and complete
npm run improve list
npm run improve complete task_1234567890 "Excellent results!"
```

### Integration Points

**With Testing Framework**:
```javascript
// After improvements, run tests
await runCommand('npm run test:agent -- tests/building-test.json');
```

**With Asset Organization**:
```javascript
// After finding assets, organize automatically
await runCommand('npm run watch-assets'); // or organize-assets
```

**With Local AI**:
```javascript
// Generate custom assets if not found
await runCommand('npm run assets:generate asset-request.json');
```

### Best Practices

1. **Start with references** - Always gather 3+ inspiration images
2. **Iterate incrementally** - Small focused changes per iteration
3. **Document asset needs early** - Don't wait until implementation
4. **Review between iterations** - Verify direction is correct
5. **Use sprite viewer** - Press V in-game to verify assets
6. **Test frequently** - Run automated tests after each change

---

## Troubleshooting

### Test hangs on server start
Wait up to 30 seconds. Check if port 3000 is available.

### Canvas not found
Add `wait` action before `check_canvas`.

### Player state is null
Player doesn't exist in BootScene, only in GameScene.

### Screenshots are blank
Wait 500ms-1s after scene transitions before capturing.

### Agent doesn't find good references
Be more specific in seed terms or game style descriptions.

### Agent can't find needed assets
Use AI generation or commission custom art.

### Iterations not improving
- Check if references are clear
- Review agent notes for blockers
- Reduce iteration count, focus on one aspect
- Manually guide the direction

---

## Related Documentation

- [Asset Management](ASSETS.md) - Asset organization
- [Quick Start](QUICK_START.md) - Fast setup guide
- [Local AI](LOCAL_AI.md) - AI asset generation
- [Procedural Improvement](PROCEDURAL_IMPROVEMENT.md) - Detailed improvement workflow
- [Animation Debugging](learning/ANIMATION_DEBUGGING.md) - Animation tips

---

**See also**: `agent-runner.js`, `agent-improvement-runner.js`, `asset-discovery-agent.js`, `improvement-manager.js`
