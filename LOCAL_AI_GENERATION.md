# Local AI Asset Generation with Ollama

Complete guide to generating and evaluating pixel art assets locally using AI.

## Overview

This system uses:
- **OllamaDiffuser** + **SDXL** + **Pixel Art XL LoRA** for generation
- **LLaVA** vision models via Ollama for quality evaluation
- Iterative refinement until quality threshold met

## Installation

### 1. Install Ollama
```bash
# Already installed ✅
ollama --version
```

### 2. Install OllamaDiffuser
```bash
pip install ollamadiffuser
```

### 3. Download Models
```bash
# Download SDXL base model
ollamadiffuser download sdxl

# Download Pixel Art XL LoRA v1.1
ollamadiffuser download lora pixel-art-xl-v1.1

# Download LLaVA for evaluation
ollama pull llava:13b
```

### 4. Verify Installation
```bash
# Test OllamaDiffuser
ollamadiffuser --help

# Test LLaVA
ollama run llava:13b "Describe this image" --image test.png
```

## Usage

### Generate Single Asset

Create a request file `asset-request.json`:
```json
{
  "name": "robot-hero",
  "type": "character",
  "description": "small friendly robot with tank treads and antenna",
  "gameStyle": "retro platformer like Megaman"
}
```

Generate:
```bash
node local-asset-generator.js generate asset-request.json
```

### Batch Generation

Create `batch-requests.json`:
```json
[
  {
    "name": "flying-enemy",
    "type": "enemy",
    "description": "flying drone with propellers",
    "gameStyle": "cyberpunk industrial"
  },
  {
    "name": "health-pickup",
    "type": "prop",
    "description": "glowing health crystal",
    "gameStyle": "sci-fi pixel art"
  },
  {
    "name": "metal-platform",
    "type": "tile",
    "description": "industrial metal platform with rivets",
    "gameStyle": "retro platformer"
  }
]
```

Generate batch:
```bash
node local-asset-generator.js batch batch-requests.json
```

## How It Works

### Generation Loop
```
1. Build prompt from request + context
   ↓
2. Generate image with SDXL + Pixel Art LoRA
   ↓
3. Evaluate with LLaVA vision model
   ↓
4. Score quality (0-10)
   ↓
5. If score < threshold (7):
   - Analyze feedback
   - Refine prompt
   - Generate again (max 5 iterations)
   ↓
6. Save best result + metadata
```

### Evaluation Criteria

LLaVA evaluates on:
1. **Pixel Art Quality** (0-10)
   - Crisp edges
   - Visible pixel grid
   - No blur or anti-aliasing

2. **Style Consistency**
   - Matches pixel density (8/16/32/64-bit)
   - Limited color palette
   - Appropriate detail level

3. **Game Asset Suitability**
   - Fits requested type
   - Works at game scale
   - Readable and clear

4. **Overall Assessment**
   - Visual appeal
   - Professional quality
   - Usability in-game

## Configuration

Edit `local-asset-generator.js` or pass options:

```javascript
const generator = new LocalAssetGenerator({
    outputDir: 'generated-assets',     // Output folder
    qualityThreshold: 7,               // Minimum score (0-10)
    maxIterations: 5,                  // Max refinement loops
    ollamaModel: 'llava:13b',          // Vision model (7b/13b/34b)
    imageSize: '512x512',              // Generation size
    pixelDensity: '32'                 // 8, 16, 32, 64-bit style
});
```

## Asset Types

Supported types with auto-optimized prompts:

| Type | Keywords | Examples |
|------|----------|----------|
| `character` | game sprite, side view | Player, NPC, hero |
| `enemy` | hostile creature, enemy sprite | Monsters, robots, drones |
| `building` | architecture, structure | Houses, factories, towers |
| `prop` | game object, item | Barrels, crates, pickups |
| `tile` | tileable, seamless | Platforms, terrain, floors |
| `background` | scenery element | Hills, clouds, trees |
| `ui` | interface, icon | Buttons, health bars, icons |

## Output

For each asset, generates:
```
generated-assets/
└── task_1234567890/
    ├── iteration_1.png          # First attempt
    ├── iteration_2.png          # Refined
    ├── iteration_3.png          # ...
    ├── robot-hero.png           # Best result
    └── robot-hero.json          # Metadata
```

Metadata includes:
```json
{
  "name": "robot-hero",
  "type": "character",
  "description": "small friendly robot with tank treads",
  "prompt": "32-bit pixel art style, small friendly robot...",
  "score": 8.5,
  "evaluation": {
    "score": 8.5,
    "feedback": "Excellent pixel art with crisp edges and great color palette. Tank treads are well-defined."
  },
  "timestamp": "2026-02-09T21:00:00.000Z"
}
```

## Integration with Asset Organization

Auto-organize generated assets:
```bash
# Move to staging folder
cp generated-assets/task_*/robot-hero.png to-be-processed-assets/

# Run organization
npm run organize-assets
```

Or integrate directly:
```javascript
const generator = new LocalAssetGenerator();
const organizer = require('./organize-assets');

const result = await generator.generateAsset(request);
if (result.success) {
    await organizer.organizeFile(result.path);
}
```

## Integration with Improvement System

Use with autonomous improvement:
```javascript
// In improvement-manager.js or agent-improvement-runner.js

// 1. Identify needed assets
const neededAssets = analyzeCodeForMissingAssets();

// 2. Generate requests
const requests = neededAssets.map(asset => ({
    name: asset.name,
    type: asset.type,
    description: generateDescription(asset),
    gameStyle: 'retro platformer'
}));

// 3. Generate with evaluation
const generator = new LocalAssetGenerator();
const results = await generator.generateBatch(requests);

// 4. Organize and test
for (const result of results) {
    if (result.success) {
        await organizeAsset(result.path);
        await testInGame(result.metadata.name);
    }
}
```

## LLaVA Model Comparison

| Model | Parameters | RAM | Speed | Quality |
|-------|------------|-----|-------|---------|
| `llava:7b` | 7B | ~8GB | Fast | Good |
| `llava:13b` | 13B | ~16GB | Medium | Better |
| `llava:34b` | 34B | ~32GB | Slow | Best |

**Recommendation**: Start with `llava:13b` for balance of quality and speed.

## Pixel Art LoRA Tips

From Civitai and community best practices:

1. **Don't use "pixel art" in prompts** - LoRA handles style
2. **Downscale results 8x** with nearest neighbor for crisp pixels
3. **Use specific subjects** - "small robot" not "character"
4. **Limited palette keywords** - "8 colors", "gameboy palette"
5. **Avoid style mixing** - Don't add "realistic" or "photographic"

## Troubleshooting

### OllamaDiffuser not found
```bash
pip install ollamadiffuser
# Or: pip install --user ollamadiffuser
```

### SDXL model missing
```bash
ollamadiffuser download sdxl
# Downloads ~6GB model
```

### Out of memory (CUDA/GPU)
```bash
# Use CPU mode (slower but works)
ollamadiffuser generate --device cpu --prompt "..."
```

### LLaVA not responding
```bash
# Pull model explicitly
ollama pull llava:13b

# Test manually
ollama run llava:13b
```

### Low quality scores
- Try different `pixelDensity` (16, 32, 64)
- Add more specific description keywords
- Reference game style ("like Megaman", "Celeste style")
- Increase `maxIterations` for more refinement

## Advanced: Custom Evaluation

Override `evaluateImage()` for custom criteria:

```javascript
class CustomAssetGenerator extends LocalAssetGenerator {
    buildEvaluationPrompt(request) {
        return `Evaluate this pixel art specifically for:
        
1. Tank tread visibility and detail
2. Antenna prominence  
3. Friendly, approachable design
4. Megaman-style proportions
5. Limited 16-color NES palette

Score 0-10 with specific feedback.`;
    }
}
```

## Examples

### Generate Robot Character
```json
{
  "name": "tank-robot",
  "type": "character",
  "description": "small friendly robot with visible tank treads, antenna, and glowing eyes",
  "gameStyle": "NES Megaman style, 16-color palette"
}
```

### Generate Enemy Drone
```json
{
  "name": "security-drone",
  "type": "enemy",
  "description": "flying security drone with red warning light and spinning propellers",
  "gameStyle": "cyberpunk industrial platformer"
}
```

### Generate Platform Tiles
```json
{
  "name": "metal-platform-tileset",
  "type": "tile",
  "description": "industrial metal platform with rivets, seamless tileable",
  "gameStyle": "retro sci-fi platformer"
}
```

## Performance

Typical times (13B LLaVA + SDXL on mid-range GPU):
- Single generation: ~30-60s
- LLaVA evaluation: ~10-20s
- Full refinement loop (3 iterations): ~2-3 minutes

## Next Steps

1. **Install dependencies** (see Installation)
2. **Create test request** (use examples above)
3. **Run single generation** to verify setup
4. **Integrate with improvement system** for full autonomy
5. **Create batch requests** for multiple assets

## See Also

- `asset-discovery-agent.js` - Web-based asset search
- `organize-assets.js` - Asset organization
- `improvement-manager.js` - Improvement system
- `AUTONOMOUS_AGENTS.md` - Full agent architecture
