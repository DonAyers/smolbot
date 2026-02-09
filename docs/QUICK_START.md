# Quick Start Guide

Get up and running with Smolbot development in minutes.

## Table of Contents

1. [5-Minute Setup](#5-minute-setup)
2. [Common Commands](#common-commands)
3. [Quick Workflows](#quick-workflows)

---

## 5-Minute Setup

### Basic Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → Opens at http://localhost:3000

# 3. Play the game!
# Use arrow keys to move, Space to jump, R to regenerate level
```

### With Auto-Asset Processing

```bash
# Terminal 1: Start asset watcher
npm run watch-assets

# Terminal 2: Start dev server
npm run dev

# Then drop .zip files into to-be-processed-assets/
# Everything happens automatically!
```

### First Test

```bash
# Run a test to verify everything works
npm run test:agent -- tests/hello-world.json

# Check output in tmp/screenshots/
```

---

## Common Commands

### Development

```bash
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview                # Preview production build
```

### Assets

```bash
npm run watch-assets           # Auto-process dropped assets
npm run organize-assets        # Manually organize assets
npm run organize-assets:dry-run  # Preview organization
```

### AI Testing

```bash
npm run test:agent -- tests/your-test.json  # Run automated test
```

### Improvement System

```bash
# Create improvement task
npm run improve create "Task Name" "Description" target

# Run autonomous improvement
npm run improve:auto task_<id> 3

# List all tasks
npm run improve list

# Complete task
npm run improve complete task_<id> "Notes"
```

### Asset Generation (Local AI)

```bash
# Generate single asset
npm run assets:generate example-asset-requests/robot-character.json

# Batch generate
npm run assets:generate:batch example-asset-requests/batch-example.json

# Find assets online
npm run assets:find task_<id> "asset-type" "description"
```

---

## Quick Workflows

### 1. Adding New Assets

**Automatic**:
```bash
# Start watcher
npm run watch-assets

# Drop .zip files into to-be-processed-assets/
# Assets are auto-organized!
```

**Manual**:
```bash
# Add to staging
cp ~/Downloads/asset-pack.zip to-be-processed-assets/

# Preview
npm run organize-assets:dry-run

# Organize
npm run organize-assets
```

**After organizing**:
1. Update `src/scenes/BootScene.js` with load statements
2. Test in-game: `npm run dev`
3. Press **V** to open Sprite Viewer
4. Press **D** to toggle Animation Debugger

### 2. Making Code Changes

```bash
# 1. Make changes
# Edit src/scenes/GameScene.js (or any file)

# 2. Test manually
npm run dev

# 3. Write automated test
# Create tests/your-test.json

# 4. Run test
npm run test:agent -- tests/your-test.json

# 5. Review results
# Check tmp/screenshots/
```

### 3. Improving Procedural Generation

```bash
# 1. Create improvement task
npm run improve create "Better Buildings" "More variety" buildings

# 2. Run autonomous agent (generates prompts)
npm run improve:auto task_1234567890 3

# 3. Execute sub-agents
# Follow the command output to run each agent prompt

# 4. Review screenshots
# Check improvement-tasks/task_1234567890/iterations/

# 5. Complete when satisfied
npm run improve complete task_1234567890 "Buildings improved!"
```

### 4. Generating Custom Assets

**Prerequisites** (one-time):
```bash
pip install ollamadiffuser
ollama pull llava:13b
ollamadiffuser download sdxl
ollamadiffuser download lora pixel-art-xl-v1.1
```

**Generate**:
```bash
# Create asset request (asset-request.json)
{
  "name": "my-asset",
  "type": "character",
  "description": "small robot with glowing eyes",
  "gameStyle": "retro platformer"
}

# Generate with AI
npm run assets:generate asset-request.json

# Output in: generated-assets/
```

### 5. Full Autonomous Development Cycle

```bash
# 1. Create improvement task
npm run improve create "Building Variety" "Add more types" buildings

# 2. Run autonomous loop
npm run improve:auto task_<id> 3

# 3. Execute reference gathering
copilot -p "$(cat improvement-tasks/task_<id>/prompt-find-references.txt)"

# 4. Execute iteration 1
copilot -p "$(cat improvement-tasks/task_<id>/prompt-iteration-1.txt)"

# 5. If assets needed
npm run assets:find task_<id> "windows" "Window variety"
# Or generate: npm run assets:generate asset-request.json

# 6. Execute iteration 2 & 3
copilot -p "$(cat improvement-tasks/task_<id>/prompt-iteration-2.txt)"
copilot -p "$(cat improvement-tasks/task_<id>/prompt-iteration-3.txt)"

# 7. Complete
npm run improve complete task_<id> "Great results!"
```

---

## In-Game Debug Tools

Press these keys while playing:

| Key | Tool | Purpose |
|-----|------|---------|
| **V** | Sprite Viewer | See all atlas frames |
| **D** | Animation Debugger | Live animation state |
| **R** | Regenerate | New level layout |

---

## Directory Structure

```
smolbot/
├── src/
│   ├── components/        # Player, Enemy classes
│   ├── scenes/           # BootScene, GameScene
│   ├── utils/            # ProceduralLevelGenerator
│   └── main.js           # Game config
├── public/
│   └── assets/           # Organized game assets
├── tests/                # Automated test scenarios
├── docs/                 # Documentation
├── improvement-tasks/    # Improvement workspace
└── to-be-processed-assets/  # Asset staging
```

---

## Common Issues

### Port 3000 already in use
```bash
# Kill existing process
npm run stop
# Or manually: taskkill /IM node.exe /F (Windows)
```

### Assets not loading
```bash
# Check BootScene.js has load statements
# Verify files exist in public/assets/
# Check browser console for errors
```

### Test hangs
```bash
# Wait 30 seconds for Vite to start
# Check if port 3000 is available
# Verify test file is valid JSON
```

### Watcher not detecting files
```bash
# Check folder exists: to-be-processed-assets/
# Verify file permissions
# Restart watcher: Ctrl+C then npm run watch-assets
```

---

## Next Steps

### Learn More

- **[Asset Management](ASSETS.md)** - Complete asset workflow
- **[AI Agents](AGENTS.md)** - Autonomous development
- **[Local AI](LOCAL_AI.md)** - Generate assets locally
- **[Procedural Improvement](PROCEDURAL_IMPROVEMENT.md)** - Detailed improvement guide
- **[Animation Debugging](learning/ANIMATION_DEBUGGING.md)** - Animation tips

### Try Examples

```bash
# Test the testing framework
npm run test:agent -- tests/small-tiles-spritesheet.json

# Create your first improvement task
npm run improve create "Test Task" "Testing the system" buildings

# Generate a test asset
npm run assets:generate example-asset-requests/robot-character.json
```

### Join Development

1. Make changes to the game
2. Write tests to verify
3. Use improvement system for iterations
4. Generate custom assets as needed
5. Document your learnings

---

## Tips

💡 **Start watcher during dev** for hands-free asset processing
💡 **Use dry-run first** to preview asset organization
💡 **Press V in-game** to verify assets loaded correctly
💡 **Write tests early** to catch regressions
💡 **Document iterations** when using improvement system
💡 **Keep staging clean** after processing assets

---

## Quick Reference Card

```bash
# Development
npm run dev                          # Start game
npm run watch-assets                 # Watch for new assets

# Assets
npm run organize-assets:dry-run      # Preview
npm run organize-assets              # Organize

# Testing
npm run test:agent -- tests/X.json  # Run test

# Improvement
npm run improve create "Name" "Desc" target
npm run improve:auto task_<id> 3

# Generation
npm run assets:generate request.json
```

---

**Ready to develop? Run `npm run dev` and start coding!**
