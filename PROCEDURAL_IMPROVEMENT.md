# Procedural Generation Improvement System

## Overview

An AI-driven iterative improvement system for procedural generation. This tool enables systematic refinement of game elements through:
- **Screenshot capture** for visual analysis
- **Inspiration management** with reference images  
- **Task tracking** with iteration history
- **AI agent integration** for autonomous improvement

## Quick Start

### 1. Check Inspiration
```bash
npm run improve check-inspo
```

If you need more reference images:
```bash
npm run improve fetch-inspo
```
This creates a guide for AI agents to fetch inspiration images.

### 2. Create an Improvement Task
```bash
npm run improve create "Better Buildings" "Add more variety to building generation" buildings
```

This creates:
```
improvement-tasks/
└── task_1234567890/
    ├── task.json          (metadata)
    ├── before/            (initial screenshots)
    ├── iterations/        (progress screenshots)
    ├── final/             (completed screenshots)
    └── capture-test.json  (automated capture)
```

### 3. Capture "Before" Screenshots
```bash
npm run improve capture task_1234567890 10
```

Generates an automated test to capture screenshots. Run it:
```bash
npm run test:agent -- improvement-tasks/task_1234567890/capture-test.json
```

Move relevant screenshots from `tmp/screenshots/` to `improvement-tasks/task_1234567890/before/`.

### 4. Iterate and Improve

**Make code changes**, then document:
```bash
npm run improve note task_1234567890 1 "Added window variety and roof styles"
```

Capture iteration screenshots and repeat.

### 5. Complete the Task
```bash
npm run improve complete task_1234567890 "Buildings now have 5x variety!"
```

## Detailed Workflow

### Phase 1: Preparation

```bash
# 1. Check if we have inspiration
npm run improve check-inspo

# Output:
# 📸 Inspiration Images:
#    Found: 0
#    Required: 3
#    Status: ⚠️ Need more
```

If insufficient:
```bash
npm run improve fetch-inspo
```

This creates `inspo/FETCH_GUIDE.json` with instructions for AI agents.

**AI Agent Task**: Read the guide and fetch 3+ inspiration images from:
- Megaman gameplay screenshots
- Fez game screenshots  
- FTL game screenshots

Save images as: `inspo/megaman_level1.png`, `inspo/fez_village.png`, etc.

### Phase 2: Task Creation

```bash
npm run improve create "Improve Building Roofs" "Add more roof variety and colors" buildings
```

Creates a new task with unique ID.

### Phase 3: Baseline Capture

```bash
npm run improve capture task_1234567890 5
```

This generates an automated test scenario. Run it to capture initial state:

```bash
npm run test:agent -- improvement-tasks/task_1234567890/capture-test.json
```

**Manual step**: Review `tmp/screenshots/` and copy relevant images to `improvement-tasks/task_1234567890/before/`.

### Phase 4: Iteration Loop

1. **Analyze current state**
   - Review screenshots in `before/` folder
   - Compare with inspiration images in `inspo/`

2. **Make improvements**
   - Edit procedural generation code
   - Test changes: `npm run dev`

3. **Capture results**
   - Take new screenshots (use in-game or test runner)
   - Save to `improvement-tasks/task_1234567890/iterations/iteration_1/`

4. **Document changes**
   ```bash
   npm run improve note task_1234567890 1 "Added 3 new roof styles, improved color palette"
   ```

5. **Repeat** until satisfied

### Phase 5: Completion

```bash
npm run improve complete task_1234567890 "Roofs now have 5 styles and look much better!"
```

Task moves from active to completed.

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run improve check-inspo` | Check inspiration image count |
| `npm run improve fetch-inspo` | Generate fetch guide for AI |
| `npm run improve create <name> <desc> [target]` | Create new task |
| `npm run improve capture <task-id> [count]` | Generate screenshot capture test |
| `npm run improve note <task-id> <iteration> "<note>"` | Add iteration note |
| `npm run improve complete <task-id> ["notes"]` | Mark task complete |
| `npm run improve list` | List all tasks |

## Configuration

Edit `improvement-config.json`:

```json
{
  "config": {
    "inspiration": {
      "folder": "inspo",
      "minimumImages": 3,
      "seedTerms": [
        "Megaman gameplay screenshot",
        "Fez game screenshot",
        "FTL game screenshot"
      ]
    },
    "screenshots": {
      "folder": "improvement-tasks",
      "captureInterval": 5000,
      "screenshotsPerSession": 10
    }
  }
}
```

### Adding More Seed Terms

```json
{
  "seedTerms": [
    "Megaman gameplay screenshot",
    "Fez game screenshot",
    "FTL game screenshot",
    "Celeste level design",
    "Hollow Knight environment"
  ]
}
```

## Folder Structure

```
smolbot/
├── improvement-config.json          (Configuration)
├── inspo/                           (Inspiration images)
│   ├── FETCH_GUIDE.json            (AI agent guide)
│   ├── megaman_level1.png
│   ├── fez_village.png
│   └── ftl_ship_interior.png
└── improvement-tasks/              (Task workspace)
    ├── task_1234567890/
    │   ├── task.json              (Metadata)
    │   ├── capture-test.json      (Auto-capture test)
    │   ├── before/                (Initial screenshots)
    │   ├── iterations/            (Progress screenshots)
    │   │   ├── iteration_1/
    │   │   ├── iteration_2/
    │   │   └── iteration_3/
    │   └── final/                 (Completed screenshots)
    └── task_0987654321/
        └── ...
```

## AI Agent Workflow

### Skill: Improve Procedural Generation

```javascript
async function improveProceduralGeneration(component) {
    // 1. Check inspiration
    const inspo = await runCommand('npm run improve check-inspo');
    
    if (!inspo.hasEnough) {
        // 2. Fetch inspiration (AI agent task)
        await fetchInspirationImages();
    }
    
    // 3. Create task
    const taskId = await runCommand(
        `npm run improve create "Better ${component}" "Improve variety" ${component}`
    );
    
    // 4. Capture baseline
    await runCommand(`npm run improve capture ${taskId} 10`);
    await runCommand(`npm run test:agent -- improvement-tasks/${taskId}/capture-test.json`);
    
    // 5. Analyze current state
    const analysis = await analyzeScreenshots(taskId);
    
    // 6. Iteration loop
    for (let i = 1; i <= 5; i++) {
        // Make code improvements
        await improveCode(component, analysis, inspiration);
        
        // Capture results
        await captureIteration(taskId, i);
        
        // Document changes
        await runCommand(`npm run improve note ${taskId} ${i} "Iteration ${i} changes"`);
        
        // Re-analyze
        analysis = await analyzeScreenshots(taskId, i);
        
        if (analysis.isGoodEnough) break;
    }
    
    // 7. Complete
    await runCommand(`npm run improve complete ${taskId} "Improvements completed"`);
}
```

### Fetching Inspiration (AI Agent Task)

When `fetch-inspo` is run, it creates `inspo/FETCH_GUIDE.json`:

```json
{
  "task": "fetch_inspiration_images",
  "searchTerms": [
    "Megaman gameplay screenshot",
    "Fez game screenshot",
    "FTL game screenshot"
  ],
  "targetFolder": "inspo",
  "minimumImages": 3,
  "instructions": [
    "1. Use web_search or image search to find gameplay screenshots",
    "2. Look for high-quality images showing game levels/environments",
    "3. Download and save to inspo/ folder",
    "4. Name files descriptively: megaman_level_1.png, fez_village.png, etc.",
    "5. Verify images are suitable inspiration (clear, representative)"
  ]
}
```

**AI Agent Implementation**:
```javascript
async function fetchInspiration() {
    const guide = JSON.parse(fs.readFileSync('inspo/FETCH_GUIDE.json'));
    
    for (const term of guide.searchTerms) {
        // Use web search tool
        const results = await web_search({ query: term + " high quality" });
        
        // Extract image URLs from results
        // Download images
        // Save to inspo/ folder
    }
    
    // Verify minimum count met
    const count = fs.readdirSync('inspo').filter(f => /\.(png|jpg)$/i.test(f)).length;
    console.log(`✅ Fetched ${count} inspiration images`);
}
```

## Example: Improving Buildings

```bash
# 1. Start improvement
npm run improve create "Building Variety" "Add more building types" buildings

# Output: Created task task_1707513600000

# 2. Capture current state
npm run improve capture task_1707513600000 5
npm run test:agent -- improvement-tasks/task_1707513600000/capture-test.json

# 3. Review screenshots and inspiration
# Open improvement-tasks/task_1707513600000/before/
# Open inspo/ folder for reference

# 4. Edit ProceduralLevelGenerator.js
# - Add new building types
# - Improve window placement
# - Add roof variety

# 5. Test changes
npm run dev

# 6. Capture iteration
# Take screenshots and save to iterations/iteration_1/

# 7. Document
npm run improve note task_1707513600000 1 "Added 3 building types, randomized windows"

# 8. Repeat steps 4-7 as needed

# 9. Complete
npm run improve complete task_1707513600000 "Buildings now have 5x variety!"
```

## Tips for AI Agents

### Analyzing Screenshots

```javascript
async function analyzeScreenshots(taskId, iteration = 'before') {
    const folder = `improvement-tasks/${taskId}/${iteration}/`;
    const screenshots = fs.readdirSync(folder).filter(f => f.endsWith('.png'));
    
    // For each screenshot:
    // - Detect repetition (same buildings appearing)
    // - Count unique elements
    // - Compare with inspiration images
    // - Generate improvement suggestions
    
    return {
        uniqueElements: 5,
        repetitionScore: 0.7, // 0 = no repetition, 1 = highly repetitive
        matchesInspiration: true,
        suggestions: [
            'Add more roof variations',
            'Randomize window positions',
            'Include decorative elements'
        ]
    };
}
```

### Making Code Improvements

```javascript
async function improveCode(component, analysis, inspiration) {
    // Read current code
    const code = fs.readFileSync(`src/utils/${component}Generator.js`, 'utf-8');
    
    // Apply improvements based on analysis
    // - Add randomization where needed
    // - Increase variety pools
    // - Implement suggestions
    
    // Write updated code
    fs.writeFileSync(`src/utils/${component}Generator.js`, improvedCode);
    
    console.log(`✅ Applied ${analysis.suggestions.length} improvements to ${component}`);
}
```

## Success Metrics

Track these for each task:
- **Before uniqueness**: How many unique elements in baseline?
- **After uniqueness**: How many unique elements after improvements?
- **Iteration count**: How many iterations to reach satisfaction?
- **Inspiration alignment**: How well does result match inspiration?

## Future Enhancements

- [ ] Automated diff detection between iterations
- [ ] ML-based image similarity scoring
- [ ] Automatic inspiration fetching with web_search
- [ ] Visual comparison UI
- [ ] A/B testing framework
- [ ] Community voting on improvements

---

**Related Documentation**:
- `AGENTS.md` - AI agent integration guide
- `improvement-config.json` - System configuration
- `inspo/FETCH_GUIDE.json` - Inspiration fetch instructions
