# Autonomous Agent System for Game Improvement

## 🤖 Overview

This system enables **fully autonomous improvement** of the game using Copilot CLI sub-agents. An agent can analyze the game, find references, make improvements, find assets, and iterate—all without manual intervention at each step.

## 🎯 Vision

```bash
npm run improve:auto task_1234567890 3
```

The agent will:
1. 🔍 Find reference images from seed games (Megaman, Fez, FTL)
2. 📊 Analyze current implementation vs references
3. 🛠️ Make code improvements
4. 🎨 Find or request assets as needed
5. 📸 Capture and compare screenshots
6. 🔄 Iterate until satisfied

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────────────────┐
│  Autonomous Improvement System                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Agent Improvement Runner                │  │
│  │  - Orchestrates the improvement loop     │  │
│  │  - Spawns Copilot CLI sub-agents         │  │
│  │  - Manages iterations                    │  │
│  └──────────────────────────────────────────┘  │
│                    │                            │
│                    ├──────────────┐             │
│                    ▼              ▼             │
│  ┌────────────────────┐  ┌──────────────────┐  │
│  │ Reference Agent    │  │ Improvement Agent│  │
│  │ - Web search       │  │ - Code analysis  │  │
│  │ - Image finding    │  │ - Implementation │  │
│  │ - Documentation    │  │ - Testing        │  │
│  └────────────────────┘  └──────────────────┘  │
│           │                       │             │
│           └───────────┬───────────┘             │
│                       ▼                         │
│  ┌──────────────────────────────────────────┐  │
│  │  Asset Discovery Agent                   │  │
│  │  - Search OpenGameArt.org                │  │
│  │  - Search Itch.io, Kenney.nl             │  │
│  │  - Generate AI prompts                   │  │
│  │  - Document findings                     │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 📋 Usage

### 1. Create Improvement Task

```bash
npm run improve create "Building Variety" "Add more architectural details" buildings
```

Creates task folder structure:
```
improvement-tasks/task_1234567890/
├── before/           # Baseline screenshots
├── iterations/       # Each iteration's screenshots
├── final/           # Final result
├── analysis.md      # Your analysis notes
└── prompts/         # Generated agent prompts
```

### 2. Run Autonomous Agent

```bash
npm run improve:auto task_1234567890 3
```

This spawns an orchestrator that:
1. Checks for reference images
2. Launches reference-finding agent if needed
3. Runs 3 improvement iterations
4. Each iteration:
   - Captures screenshots
   - Spawns improvement agent
   - Documents changes

### 3. Manual Agent Execution (Current)

Until Copilot CLI spawning is fully integrated:

```bash
# The auto runner creates prompt files
npm run improve:auto task_1234567890

# Then manually run:
copilot --allow-all-tools -p "$(cat improvement-tasks/task_1234567890/prompt-find-references.txt)"

# After reference gathering:
copilot --allow-all-tools -p "$(cat improvement-tasks/task_1234567890/prompt-iteration-1.txt)"
```

## 🔍 Reference Image Discovery

### Automatic Search

The reference agent searches:

1. **Web Search** for each seed game:
   ```
   "Megaman X buildings screenshots"
   "Fez platformer architecture pixel art"
   "FTL ship interior rooms"
   ```

2. **Documentation**: Creates detailed markdown files:
   ```markdown
   # Megaman X - Building Inspiration
   
   ## Key Features:
   - Industrial pipes and vents
   - Layered backgrounds
   - Cyberpunk details
   
   ## Color Palette:
   - Dark grays and metallics
   - Bright accent colors
   ```

3. **Saves to**: `inspo/` folder

### Manual Search (if needed)

```bash
# Search specific game/style
web_search "Megaman X level design buildings"
web_search "Fez pixel art architecture"
```

## 🎨 Asset Discovery

### When You Need New Assets

The improvement agent can detect when it needs assets that don't exist. When this happens:

```bash
npm run assets:find task_1234567890 "neon signs" "Glowing signs for buildings" "Cyberpunk" "Blade Runner"
```

This creates:
1. **Asset request document** with:
   - Description of need
   - Style references
   - Search prompts for multiple sources
   - AI generation prompts

2. **Search agent prompt** that will:
   - Search OpenGameArt.org
   - Search Itch.io
   - Search Kenney.nl
   - Document findings with licenses
   - Provide download links

### Asset Sources

The agent searches:

| Source | Type | License | Quality |
|--------|------|---------|---------|
| **OpenGameArt.org** | Community | CC0, CC-BY | ⭐⭐⭐⭐ |
| **Kenney.nl** | Professional | CC0 | ⭐⭐⭐⭐⭐ |
| **Itch.io** | Indie packs | Varies | ⭐⭐⭐⭐ |
| **CraftPix** | Commercial | Free tier | ⭐⭐⭐ |

### AI Generation Fallback

If no suitable assets found, the agent generates prompts for:
- DALL-E
- Midjourney
- Stable Diffusion
- PixelArt generators

Example generated prompt:
```
Create pixel art neon signs in Cyberpunk style.

Requirements:
- Pixel art style, 32-bit era
- Transparent background (PNG)
- Size: 64x64 or 128x64
- Color palette: Bright neons (pink, cyan, yellow)
- Glowing effect
- Multiple variations (5-10)

Style: Blade Runner, Cyberpunk 2077, neon signage
```

## 🔄 Improvement Loop Details

### What the Improvement Agent Does

**Iteration N:**

1. **📖 Read Context**
   ```
   - Review inspo/ folder
   - Read target code file
   - Check previous iteration notes
   - Look at latest screenshots
   ```

2. **🎯 Identify Gaps**
   ```
   - Compare current vs reference style
   - List specific visual differences
   - Prioritize by impact
   ```

3. **💡 Plan Changes**
   ```
   - 3-5 specific improvements
   - Check asset availability
   - Estimate effort
   ```

4. **🛠️ Implement**
   ```
   - Edit target file(s)
   - Add new methods/logic
   - Follow existing patterns
   ```

5. **✅ Test**
   ```
   - Run capture test
   - Review screenshots
   - Verify no breakage
   ```

6. **📝 Document**
   ```
   - Save iteration notes
   - Record what changed
   - Note any blockers
   ```

### Agent Prompt Structure

Each improvement iteration gets a detailed prompt:

```
You are an autonomous game improvement agent.

TASK: [Name]
ITERATION: [N]
TARGET FILE: [path/to/file.js]

CONTEXT:
[Previous iterations, reference materials, current state]

INSTRUCTIONS:
1. Read references
2. Analyze current code
3. Plan 3-5 improvements
4. Check assets
5. Implement changes
6. Test and capture
7. Document

SUCCESS CRITERIA:
✅ Code compiles
✅ Visual improvements visible
✅ Aligns with references
✅ No broken gameplay
```

## 🚀 Advanced Usage

### Custom Agent Prompts

You can customize agent behavior by editing prompt templates:

```javascript
// In agent-improvement-runner.js
buildImprovementPrompt(iterationNum) {
    // Modify to change agent behavior
    // Add constraints, priorities, etc.
}
```

### Multi-Agent Collaboration

For complex tasks, spawn multiple agents:

```bash
# Agent 1: Find assets
copilot -p "$(cat improvement-tasks/task_123/asset-discovery-prompt.txt)"

# Agent 2: Implement improvements (runs after assets found)
copilot -p "$(cat improvement-tasks/task_123/prompt-iteration-1.txt)"

# Agent 3: Polish and optimize
copilot -p "Optimize performance of building generation in src/utils/ProceduralLevelGenerator.js"
```

### Integration with MCP Tools

The agents can use MCP tools if available:

```javascript
// Example: GitHub MCP for browsing examples
github-search-code "phaser procedural buildings"

// Example: Web fetch for documentation
web_fetch "https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Image.html"
```

## 📊 Monitoring Progress

### Task Status

```bash
npm run improve list
```

Shows:
- Active tasks
- Iteration count
- Last updated
- Status

### Review Screenshots

```bash
# View in file explorer
start improvement-tasks/task_1234567890/iterations/
```

Compare:
- `before/` - Baseline
- `iteration_1/` - After first round
- `iteration_2/` - After second round
- etc.

### Read Logs

Each agent run creates logs:
```
improvement-tasks/task_1234567890/
├── prompt-find-references.txt     # Reference search prompt
├── prompt-iteration-1.txt         # First improvement prompt
├── iteration-1-notes.md           # What changed
├── asset-request-*.md             # Asset needs
└── asset-findings.md              # Asset search results
```

## 🎓 Best Practices

### 1. Start with References

Always gather 3+ reference images before starting improvements:
```bash
npm run improve check-inspo
# If needed:
npm run improve fetch-inspo
```

### 2. Iterate Incrementally

Don't try to do everything at once:
```bash
# Better: 3 focused iterations
npm run improve:auto task_123 3

# Not: 1 massive iteration
```

### 3. Document Asset Needs Early

If you realize you need assets:
```bash
npm run assets:find task_123 "window types" "Various window sprites"
```

Don't wait until implementation to discover missing assets.

### 4. Review Between Iterations

After each iteration:
1. Look at screenshots
2. Read the notes
3. Verify the direction is correct
4. Adjust if needed

### 5. Use Sprite Viewer

After improvements, test in-game:
```bash
npm run dev
# Press V to open Sprite Viewer
# Press D for Animation Debugger
```

## 🔮 Future Enhancements

### Planned Features

- [ ] **Direct Copilot CLI spawning** (currently manual)
- [ ] **Screenshot diff visualization** (before/after comparison)
- [ ] **Automated quality scoring** (AI-based visual assessment)
- [ ] **Asset auto-download** (fetch from OpenGameArt automatically)
- [ ] **Multi-modal prompts** (send images to agents)
- [ ] **Parallel agent execution** (reference + implementation simultaneously)
- [ ] **Learning system** (remember what works across tasks)

### Integration Ideas

```javascript
// Screenshot diff
const diff = await compareScreenshots(before, after);
if (diff.improvement > 0.3) {
    console.log('Significant improvement!');
}

// Quality scoring
const score = await assessVisualQuality(screenshot, references);
if (score < 0.7) {
    console.log('Needs more work');
    runAnotherIteration();
}

// Auto-asset download
const assets = await searchOpenGameArt('neon signs');
await downloadAndOrganize(assets[0].url);
```

## 📖 Examples

### Example 1: Building Improvements

```bash
# Create task
npm run improve create "Better Buildings" "More architectural variety" buildings

# Run autonomous agent (3 iterations)
npm run improve:auto task_1234567890 3

# Agent will:
# 1. Find building references from Megaman, Fez, FTL
# 2. Analyze current building generation
# 3. Add window patterns, rooftop details, side decorations
# 4. Capture screenshots each iteration
# 5. Document all changes
```

### Example 2: Enemy Design

```bash
# Create task
npm run improve create "Enemy Variety" "More enemy types and behaviors" enemies

# Find assets first
npm run assets:find task_2345678901 "robot enemies" "Various robot enemy sprites" "Megaman" "Metal Slug"

# Run the asset discovery agent
copilot -p "$(cat improvement-tasks/task_2345678901/asset-discovery-prompt.txt)"

# After assets acquired, run improvement
npm run improve:auto task_2345678901 3
```

### Example 3: Terrain Generation

```bash
# Create task
npm run improve create "Terrain Diversity" "More interesting platforms and layouts" terrain

# Auto-run
npm run improve:auto task_3456789012 5  # 5 iterations

# The agent will autonomously:
# - Search for platformer level design references
# - Analyze ProceduralLevelGenerator.js
# - Implement varied platform patterns
# - Test and iterate
# - Request assets if needed
```

## 🆘 Troubleshooting

### Agent doesn't find good references

**Solution**: Be more specific in seed terms
```json
// improvement-config.json
"seedTerms": [
    "Megaman X city stage buildings",  // More specific
    "Fez architecture pixel art",
    "FTL ship rooms interior"
]
```

### Agent can't find needed assets

**Solution**: Generate AI art or commission
```bash
npm run assets:find task_123 "specific asset" "description"
# Use the AI generation prompt from asset-request-*.md
```

### Iterations not improving

**Solution**: 
1. Check if references are clear
2. Review agent notes for blockers
3. Manually review code and suggest direction
4. Reduce iteration count, focus on one aspect

### Code breaks after agent changes

**Solution**:
1. Review the iteration notes
2. Check for syntax errors
3. Revert to previous iteration:
   ```bash
   git diff HEAD improvement-tasks/task_123/iterations/iteration_N/
   ```
4. Apply changes manually with fixes

## 🎯 Success Metrics

A successful autonomous improvement run should show:

✅ **Visual Improvements**: Screenshots show clear upgrades  
✅ **Code Quality**: Clean, maintainable changes  
✅ **No Breakage**: Game still works  
✅ **Documentation**: Clear notes on what changed  
✅ **Asset Integration**: If needed, assets found and organized  

## 🤝 Contributing to Agent System

To improve the agent system itself:

1. **Better Prompts**: Edit prompt templates in `agent-improvement-runner.js`
2. **New Agents**: Create new agent types (polish-agent, optimization-agent, etc.)
3. **Tool Integration**: Add MCP tools or web search capabilities
4. **Automation**: Implement direct Copilot CLI spawning
5. **Visualization**: Build screenshot comparison tools

---

## 🎮 Ready to Go?

```bash
# 1. Create a task
npm run improve create "My Improvement" "What to improve" component

# 2. Run the autonomous agent
npm run improve:auto task_<id> 3

# 3. Follow the prompts to execute sub-agents

# 4. Review results
npm run improve list

# 5. Complete when satisfied
npm run improve complete task_<id> "Final notes"
```

**Let the agents do the work! 🤖✨**
