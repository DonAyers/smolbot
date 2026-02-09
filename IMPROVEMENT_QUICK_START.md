# Quick Start: Procedural Generation Improvement System

## What You Have

A complete system for **iteratively improving procedural generation** using AI-driven workflows with visual feedback.

## The Workflow

```
1. Check Inspiration → 2. Create Task → 3. Capture Before → 
4. Improve Code → 5. Capture After → 6. Document → 7. Repeat 4-6 → 8. Complete
```

## Commands

```bash
# Check if you have reference images
npm run improve check-inspo

# Generate guide for AI to fetch inspiration
npm run improve fetch-inspo

# Create improvement task
npm run improve create "Task Name" "Description" target

# Generate screenshot capture test
npm run improve capture task_1234567890 10

# Add iteration notes
npm run improve note task_1234567890 1 "What changed"

# Complete task
npm run improve complete task_1234567890 "Final notes"

# List all tasks
npm run improve list
```

## Example Session

```bash
# 1. Check inspiration
npm run improve check-inspo
# → Shows: Need 3 images

# 2. Fetch inspiration (AI agent reads guide and fetches)
npm run improve fetch-inspo
# AI agent: Downloads Megaman, Fez, FTL screenshots to inspo/

# 3. Create task
npm run improve create "Better Buildings" "More variety" buildings
# → Created: task_1234567890

# 4. Capture baseline
npm run improve capture task_1234567890 5
npm run test:agent -- improvement-tasks/task_1234567890/capture-test.json
# → Screenshots in tmp/screenshots/
# → Move relevant ones to improvement-tasks/task_1234567890/before/

# 5. Make improvements
# Edit src/utils/ProceduralLevelGenerator.js
# Test: npm run dev

# 6. Document iteration
npm run improve note task_1234567890 1 "Added 3 building types"

# 7. Repeat 5-6 as needed

# 8. Complete
npm run improve complete task_1234567890 "Buildings now have 5x variety!"
```

## Folder Structure Created

```
improvement-tasks/
└── task_1234567890/
    ├── task.json              # Metadata
    ├── capture-test.json      # Automated test
    ├── before/                # Initial state
    ├── iterations/            # Progress screenshots
    │   ├── iteration_1/
    │   └── iteration_2/
    └── final/                 # Completed state

inspo/
├── FETCH_GUIDE.json          # AI agent instructions
├── megaman_level1.png
├── fez_village.png
└── ftl_ship.png
```

## Configuration

Edit `improvement-config.json` to customize:
- Seed terms (games for inspiration)
- Minimum inspiration image count
- Screenshot settings

## AI Agent Integration

The system is designed for AI agents to:
1. **Fetch inspiration** - Read FETCH_GUIDE.json and download images
2. **Analyze screenshots** - Compare before/after, detect patterns
3. **Make improvements** - Edit code based on analysis
4. **Iterate automatically** - Repeat until quality threshold met

See `PROCEDURAL_IMPROVEMENT.md` for full AI agent workflow.

## Tips

💡 Start with checking inspiration - you need references!
💡 Use descriptive task names - easier to track
💡 Capture plenty of screenshots - more data = better analysis
💡 Document every iteration - track what worked/didn't
💡 Compare with inspiration often - keep aligned with goals

## Next Steps

1. **Get inspiration**: `npm run improve fetch-inspo` (then AI fetches)
2. **Create first task**: Target a specific component
3. **Capture baseline**: See current state
4. **Iterate**: Make small improvements, document each
5. **Complete**: Celebrate the improvements!

---

**Full Documentation**: See `PROCEDURAL_IMPROVEMENT.md`
