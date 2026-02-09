# Integrating Local AI Generation with Autonomous System

## Overview

This guide shows how to integrate the local AI asset generator with the autonomous improvement system for **fully autonomous asset creation and testing**.

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│         Autonomous Improvement Loop with AI Assets           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Improvement Agent Analyzes Code                          │
│     └─> Identifies missing/needed assets                     │
│                                                              │
│  2. Asset Discovery Decision                                 │
│     ├─> Search web (asset-discovery-agent.js)               │
│     └─> Generate locally (local-asset-generator.js) ⭐       │
│                                                              │
│  3. Local AI Generation                                      │
│     ├─> Create asset request from context                    │
│     ├─> Generate with SDXL + LoRA                           │
│     ├─> Evaluate with LLaVA                                 │
│     └─> Refine until quality threshold met                   │
│                                                              │
│  4. Asset Organization                                       │
│     └─> Auto-organize into proper folders                    │
│                                                              │
│  5. Code Integration                                         │
│     ├─> Update BootScene.js with load statements            │
│     └─> Update game code to use new assets                   │
│                                                              │
│  6. In-Game Testing                                          │
│     ├─> Start dev server                                    │
│     ├─> Capture screenshots                                 │
│     └─> Visual comparison with pixelmatch                    │
│                                                              │
│  7. Quality Assessment                                       │
│     ├─> LLaVA evaluates in-game result                      │
│     ├─> Compare before/after screenshots                    │
│     └─> Calculate quality score                              │
│                                                              │
│  8. Decision Point                                           │
│     ├─> If quality met: Commit changes ✅                   │
│     └─> Else: Regenerate or refine (go to step 3)           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Enhance agent-improvement-runner.js

Add asset generation capability:

```javascript
// In agent-improvement-runner.js

const LocalAssetGenerator = require('./local-asset-generator');

class ImprovedAutonomousRunner {
    constructor() {
        this.assetGenerator = new LocalAssetGenerator({
            qualityThreshold: 7,
            maxIterations: 5,
            ollamaModel: 'llava:13b'
        });
    }

    /**
     * Check if code references missing assets
     */
    async analyzeCodeForMissingAssets(taskId) {
        const task = this.loadTask(taskId);
        const targetFile = task.metadata.targetFile;
        
        // Read code and extract asset references
        const code = fs.readFileSync(targetFile, 'utf8');
        const assetRefs = this.extractAssetReferences(code);
        
        // Check which assets don't exist
        const missing = [];
        for (const ref of assetRefs) {
            const assetPath = this.resolveAssetPath(ref);
            if (!fs.existsSync(assetPath)) {
                missing.push({
                    reference: ref,
                    path: assetPath,
                    type: this.inferAssetType(ref)
                });
            }
        }
        
        return missing;
    }

    /**
     * Generate missing assets with AI
     */
    async generateMissingAssets(missingAssets, taskId) {
        console.log(`\n🎨 Generating ${missingAssets.length} missing assets...`);
        
        const requests = missingAssets.map(asset => ({
            name: path.basename(asset.reference, path.extname(asset.reference)),
            type: asset.type,
            description: this.generateAssetDescription(asset, taskId),
            gameStyle: this.getGameStyle(taskId)
        }));
        
        const results = await this.assetGenerator.generateBatch(requests);
        
        // Organize generated assets
        for (let i = 0; i < results.length; i++) {
            if (results[i].success) {
                await this.organizeGeneratedAsset(
                    results[i].path,
                    missingAssets[i].path
                );
            }
        }
        
        return results;
    }

    /**
     * Generate asset description from context
     */
    generateAssetDescription(asset, taskId) {
        const task = this.loadTask(taskId);
        const description = task.metadata.description;
        
        // Extract relevant context
        const type = asset.type;
        const name = path.basename(asset.reference);
        
        // Build description using AI or templates
        const templates = {
            'character': `game character sprite for ${description}`,
            'enemy': `enemy sprite for ${description}`,
            'building': `building or structure for ${description}`,
            'prop': `game prop or decoration for ${description}`,
            'tile': `tileable terrain or platform for ${description}`
        };
        
        return templates[type] || `game asset for ${description}`;
    }

    /**
     * Get game style from config or task
     */
    getGameStyle(taskId) {
        const config = this.loadConfig();
        const games = config.inspirationGames || ['Megaman', 'Celeste'];
        return `${games[0]} style platformer`;
    }

    /**
     * Enhanced improvement iteration with asset generation
     */
    async runImprovementIteration(taskId, iterationNum) {
        console.log(`\n--- Iteration ${iterationNum} ---`);
        
        // 1. Check for missing assets BEFORE making changes
        const missingBefore = await this.analyzeCodeForMissingAssets(taskId);
        
        // 2. Run normal improvement (make code changes)
        await super.runImprovementIteration(taskId, iterationNum);
        
        // 3. Check for NEW missing assets after changes
        const missingAfter = await this.analyzeCodeForMissingAssets(taskId);
        const newMissing = missingAfter.filter(a => 
            !missingBefore.some(b => b.reference === a.reference)
        );
        
        // 4. Generate any new missing assets
        if (newMissing.length > 0) {
            console.log(`\n📦 Detected ${newMissing.length} new asset needs`);
            await this.generateMissingAssets(newMissing, taskId);
        }
        
        // 5. Capture screenshots (assets now exist)
        await this.captureScreenshots(taskId, iterationNum);
        
        // 6. Evaluate quality (including new assets)
        const quality = await this.evaluateIteration(taskId, iterationNum);
        
        return quality;
    }
}
```

### Step 2: Create Asset Analysis Helper

```javascript
// asset-analyzer.js

class AssetAnalyzer {
    /**
     * Extract all asset references from code
     */
    extractAssetReferences(code) {
        const patterns = [
            /this\.load\.image\(['"]([^'"]+)['"]/g,
            /this\.load\.spritesheet\(['"]([^'"]+)['"]/g,
            /this\.load\.atlas\(['"]([^'"]+)['"]/g,
            /this\.load\.audio\(['"]([^'"]+)['"]/g,
        ];
        
        const refs = new Set();
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(code)) !== null) {
                refs.add(match[1]);
            }
        }
        
        return Array.from(refs);
    }

    /**
     * Infer asset type from reference
     */
    inferAssetType(ref) {
        const lower = ref.toLowerCase();
        
        if (lower.includes('character') || lower.includes('player') || lower.includes('hero')) {
            return 'character';
        }
        if (lower.includes('enemy') || lower.includes('monster') || lower.includes('drone')) {
            return 'enemy';
        }
        if (lower.includes('building') || lower.includes('house') || lower.includes('tower')) {
            return 'building';
        }
        if (lower.includes('tile') || lower.includes('platform') || lower.includes('terrain')) {
            return 'tile';
        }
        if (lower.includes('background') || lower.includes('bg_') || lower.includes('sky')) {
            return 'background';
        }
        if (lower.includes('ui_') || lower.includes('button') || lower.includes('icon')) {
            return 'ui';
        }
        
        return 'prop'; // Default
    }

    /**
     * Resolve asset reference to file path
     */
    resolveAssetPath(ref) {
        // Check common locations
        const locations = [
            `public/assets/images/${ref}`,
            `public/assets/images/${ref}.png`,
            `public/assets/spritesheets/${ref}`,
            `public/assets/spritesheets/${ref}.png`,
            `public/assets/audio/${ref}`,
            `public/assets/audio/${ref}.mp3`,
        ];
        
        for (const loc of locations) {
            if (fs.existsSync(loc)) {
                return loc;
            }
        }
        
        // Return expected path even if doesn't exist
        return `public/assets/images/${ref}.png`;
    }
}

module.exports = new AssetAnalyzer();
```

### Step 3: Add to Improvement Config

```json
// improvement-config.json

{
  "inspirationGames": ["Megaman", "Celeste", "FTL"],
  "assetGeneration": {
    "enabled": true,
    "autoGenerate": true,
    "qualityThreshold": 7,
    "maxIterations": 5,
    "ollamaModel": "llava:13b",
    "pixelDensity": "32"
  }
}
```

### Step 4: Enhanced Prompt Generation

Update `buildImprovementPrompt()` to include asset context:

```javascript
buildImprovementPrompt(taskId, iterationNum) {
    // ... existing code ...
    
    // Add asset generation capability
    prompt += `\n## Asset Generation\n\n`;
    prompt += `If you need new assets that don't exist:\n\n`;
    prompt += `1. Create a request file:\n`;
    prompt += `   - example-asset-requests/my-asset.json\n`;
    prompt += `   - Include: name, type, description, gameStyle\n\n`;
    prompt += `2. Generate locally:\n`;
    prompt += `   - npm run assets:generate my-asset.json\n`;
    prompt += `   - System will iterate until quality >= 7/10\n\n`;
    prompt += `3. Organize automatically:\n`;
    prompt += `   - npm run organize-assets\n`;
    prompt += `   - Assets placed in correct folders\n\n`;
    
    return prompt;
}
```

## Usage Examples

### Example 1: Building Improvements Need Props

```bash
# 1. Create task
npm run improve create "Add rooftop details" "Add antennas and props" buildings

# 2. Run autonomous improvement
npm run improve:auto task_xxx 3

# During iteration:
# - Agent adds code referencing "antenna-tower.png"
# - System detects missing asset
# - Generates request automatically
# - Calls local AI generator
# - Evaluates with LLaVA
# - Organizes into public/assets/images/props/
# - Updates BootScene.js
# - Tests in-game
# - Captures screenshots
# - Compares quality
```

### Example 2: New Enemy Type

```bash
# Agent decides to add flying enemies
# Code: this.load.image('flying-drone', 'assets/images/enemies/flying-drone.png')
# System detects missing asset
# Auto-generates request:
{
  "name": "flying-drone",
  "type": "enemy",
  "description": "hostile flying security drone with propellers",
  "gameStyle": "cyberpunk platformer"
}
# Generates with AI
# Tests in-game
# Continues iteration if needed
```

## Visual Comparison Integration

Combine AI generation with visual comparison:

```javascript
async evaluateIteration(taskId, iterationNum) {
    // 1. Visual comparison (pixelmatch)
    const visualScore = await this.compareScreenshots(taskId, iterationNum);
    
    // 2. LLaVA evaluation of screenshots
    const aiScore = await this.evaluateWithLLaVA(taskId, iterationNum);
    
    // 3. Combined score
    const combinedScore = (visualScore.avgQuality + aiScore) / 2;
    
    return {
        visual: visualScore,
        ai: aiScore,
        combined: combinedScore
    };
}

async evaluateWithLLaVA(taskId, iterationNum) {
    const screenshots = this.getScreenshots(taskId, iterationNum);
    const prompt = `Evaluate these game screenshots for:
    1. Visual quality and aesthetics
    2. Asset integration (do new assets fit?)
    3. Overall game feel
    4. Professional appearance
    Score 0-10.`;
    
    // Call LLaVA on each screenshot
    let totalScore = 0;
    for (const screenshot of screenshots) {
        const score = await this.assetGenerator.evaluateImage(screenshot, {
            type: 'game-screenshot',
            description: prompt
        });
        totalScore += score.score;
    }
    
    return totalScore / screenshots.length;
}
```

## Complete Autonomous Flow

```bash
# Single command for complete autonomy:
npm run improve:autonomous buildings 5

# System will:
# 1. Create improvement task
# 2. Find reference images from inspirationGames
# 3. Make code improvements
# 4. Detect missing assets
# 5. Generate assets with AI
# 6. Evaluate asset quality (LLaVA)
# 7. Organize assets
# 8. Update asset loading code
# 9. Test in-game
# 10. Capture screenshots
# 11. Visual comparison (pixelmatch)
# 12. LLaVA evaluation of game
# 13. Calculate combined score
# 14. If < threshold: refine (go to step 3)
# 15. If >= threshold: save and continue
# 16. Repeat for N iterations
# 17. Generate final report
# 18. (Optional) Commit best iteration
```

## Configuration Matrix

| Setting | Aggressive | Balanced | Conservative |
|---------|-----------|----------|--------------|
| Quality Threshold | 6 | 7 | 8 |
| Max Asset Iterations | 3 | 5 | 7 |
| Max Game Iterations | 3 | 5 | 10 |
| LLaVA Model | 7b | 13b | 34b |
| Auto-commit | Yes | Manual | Manual |

## Benefits of Integration

### 1. Complete Autonomy
- No manual asset searching
- No manual asset creation
- No manual organization
- System handles everything

### 2. Quality Assurance
- AI evaluates every asset (LLaVA)
- Visual comparison of results (pixelmatch)
- Combined quality scoring
- Iterative refinement

### 3. Fast Iteration
- Local generation (30-60s)
- No API rate limits
- Parallel processing
- Immediate feedback

### 4. Cost Efficiency
- $0 per generation
- Unlimited iterations
- No API keys needed
- Complete privacy

## Next Steps

1. ✅ Local AI generation working
2. 🔄 Integrate with agent-improvement-runner.js
3. 🔄 Add asset analysis helpers
4. 🔄 Enhance prompt generation
5. 🔄 Add combined quality scoring
6. 🔄 Test complete autonomous flow
7. 🚀 Deploy production system

## See Also

- `local-asset-generator.js` - Core generation system
- `agent-improvement-runner.js` - Orchestrator
- `improvement-manager.js` - Task management
- `LOCAL_AI_GENERATION.md` - Usage guide
- `AUTONOMOUS_AGENTS.md` - Complete architecture
