# Local AI Asset Generation

Generate and evaluate pixel art assets locally using Stable Diffusion and vision models.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Integration](#integration)
5. [Examples](#examples)

---

## Overview

This system provides **fully local AI-powered asset generation** with:
- **Zero cost** - No API keys or subscriptions
- **Complete privacy** - All processing on your machine
- **Quality assurance** - AI evaluates every generation
- **Iterative refinement** - Automatically improves until threshold met

### Technology Stack

**Generation**:
- **OllamaDiffuser** - Stable Diffusion CLI runner
- **SDXL** - Stable Diffusion XL base model (~6GB)
- **Pixel Art XL LoRA** - Specialized pixel art training

**Evaluation**:
- **LLaVA** - Vision model for quality scoring
- **Ollama** - Model runner (13B recommended)

### How It Works

```
1. Parse asset request (type, description, style)
   ↓
2. Build prompt (type-specific keywords + context)
   ↓
3. Generate image (SDXL + Pixel Art LoRA)
   ↓
4. Evaluate with LLaVA (score 0-10)
   ↓
5. If score < threshold: refine prompt and repeat
   ↓
6. Save best result + metadata
```

---

## Installation

### Prerequisites

✅ Python 3.8+
✅ Node.js (already installed)
✅ Ollama (already installed)

### Step 1: Install OllamaDiffuser

```bash
pip install ollamadiffuser
```

### Step 2: Download Models

```bash
# Download SDXL base model (~6GB)
ollamadiffuser download sdxl

# Download Pixel Art LoRA
ollamadiffuser download lora pixel-art-xl-v1.1

# Or manually from: https://civitai.com/models/120096/pixel-art-xl
# Place in: ~/.ollamadiffuser/loras/

# Download LLaVA for evaluation
ollama pull llava:13b
# Or llava:7b (8GB RAM) or llava:34b (32GB RAM)
```

### Step 3: Verify Installation

```bash
# Test generation
ollamadiffuser generate \
  --prompt "small robot character, 32-bit pixel art" \
  --output test-robot.png \
  --model sdxl \
  --lora pixel-art-xl-v1.1 \
  --steps 30

# Test evaluation
ollama run llava:13b "Analyze this pixel art: test-robot.png"
```

### Step 4: Test Integration

```bash
npm run assets:generate example-asset-requests/robot-character.json
```

Expected output:
```
🎨 Starting generation: robot-hero
   Type: character

--- Iteration 1/5 ---
📝 Prompt: 32-bit pixel art style, small friendly robot...
🖼️  Generating...
✅ Generated successfully
🔍 Evaluating...
📊 Score: 7.5/10

--- Iteration 2/5 ---
📝 Refined prompt with more detail...
🖼️  Generating...
✅ Generated successfully
🔍 Evaluating...
📊 Score: 8.5/10

✅ Quality threshold met!
```

---

## Usage

### Single Asset

Create `asset-request.json`:
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
npm run assets:generate asset-request.json
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
  }
]
```

Generate:
```bash
npm run assets:generate:batch batch-requests.json
```

### Asset Types

Supported types with auto-optimized prompts:

| Type | Auto Keywords | Examples |
|------|---------------|----------|
| `character` | game sprite, side view | Player, NPC, hero |
| `enemy` | hostile creature, enemy sprite | Monsters, robots |
| `building` | architecture, structure | Houses, towers |
| `prop` | game object, item | Barrels, crates |
| `tile` | tileable, seamless | Platforms, terrain |
| `background` | scenery element | Hills, clouds |
| `ui` | interface, icon | Buttons, HUD |

### Configuration

Edit `local-asset-generator.js` or pass options:

```javascript
const generator = new LocalAssetGenerator({
    outputDir: 'generated-assets',
    qualityThreshold: 7,        // Min score (0-10)
    maxIterations: 5,           // Max refinement loops
    ollamaModel: 'llava:13b',   // 7b/13b/34b
    imageSize: '512x512',       // Generation size
    pixelDensity: '32'          // 8/16/32/64-bit style
});
```

### Output

Each generation creates:
```
generated-assets/task_<id>/
├── iteration_1.png          # First attempt
├── iteration_2.png          # Refined
├── robot-hero.png           # Best result
└── robot-hero.json          # Metadata
```

Metadata includes:
```json
{
  "name": "robot-hero",
  "type": "character",
  "description": "small friendly robot with tank treads",
  "prompt": "32-bit pixel art, small friendly robot...",
  "score": 8.5,
  "evaluation": {
    "score": 8.5,
    "feedback": "Excellent pixel art with crisp edges..."
  },
  "timestamp": "2026-02-09T21:00:00.000Z"
}
```

---

## Integration

### With Asset Organization

```bash
# Move to staging
cp generated-assets/task_*/robot-hero.png to-be-processed-assets/

# Auto-organize
npm run organize-assets
```

Or programmatically:
```javascript
const generator = new LocalAssetGenerator();
const result = await generator.generateAsset(request);

if (result.success) {
    await organizer.organizeFile(result.path);
}
```

### With Improvement System

```javascript
// Detect missing assets
const neededAssets = analyzeCodeForMissingAssets();

// Generate requests
const requests = neededAssets.map(asset => ({
    name: asset.name,
    type: asset.type,
    description: generateDescription(asset),
    gameStyle: 'retro platformer'
}));

// Generate with evaluation
const generator = new LocalAssetGenerator();
const results = await generator.generateBatch(requests);

// Organize and test
for (const result of results) {
    if (result.success) {
        await organizeAsset(result.path);
        await testInGame(result.metadata.name);
    }
}
```

### With Agent Workflow

From improvement iterations:
```bash
# Agent realizes it needs assets
npm run assets:find task_<id> "neon signs" "Glowing cyberpunk signs"

# If not found online, generate locally
npm run assets:generate improvement-tasks/task_<id>/asset-request.json
```

---

## Examples

### Robot Character

```json
{
  "name": "tank-robot",
  "type": "character",
  "description": "small friendly robot with visible tank treads, antenna, and glowing eyes",
  "gameStyle": "NES Megaman style, 16-color palette"
}
```

### Enemy Drone

```json
{
  "name": "security-drone",
  "type": "enemy",
  "description": "flying security drone with red warning light and spinning propellers",
  "gameStyle": "cyberpunk industrial platformer"
}
```

### Platform Tileset

```json
{
  "name": "metal-platform",
  "type": "tile",
  "description": "industrial metal platform with rivets, seamless tileable",
  "gameStyle": "retro sci-fi platformer"
}
```

### UI Element

```json
{
  "name": "health-bar",
  "type": "ui",
  "description": "retro game health bar with segmented sections",
  "gameStyle": "8-bit NES interface"
}
```

---

## Quality Evaluation

LLaVA scores on 4 criteria:

### 1. Pixel Art Quality (0-10)
- ✅ Crisp, clean edges
- ✅ Visible pixel grid
- ✅ No blur or anti-aliasing
- ✅ Proper pixelation

### 2. Style Consistency (0-10)
- ✅ Matches bit depth (8/16/32/64)
- ✅ Limited color palette
- ✅ Appropriate detail level
- ✅ Consistent style

### 3. Game Asset Suitability (0-10)
- ✅ Matches requested type
- ✅ Works at game scale
- ✅ Readable and clear
- ✅ Fits game style

### 4. Overall Assessment (0-10)
- ✅ Visual appeal
- ✅ Professional quality
- ✅ Production ready

**Final Score**: Average of all dimensions

---

## Troubleshooting

### OllamaDiffuser not found
```bash
pip install --user ollamadiffuser
# Add to PATH or use: python -m ollamadiffuser
```

### SDXL model missing
```bash
ollamadiffuser download sdxl
# Check: ollamadiffuser list
```

### Out of memory (GPU)
```bash
# Use CPU mode (slower but works)
ollamadiffuser generate --device cpu --prompt "..."
```

### LLaVA not responding
```bash
ollama pull llava:13b
ollama list  # Verify
```

### Low quality scores
- Try different `pixelDensity` (16, 32, 64)
- Add more specific keywords
- Reference game styles ("Megaman", "Celeste")
- Increase `maxIterations` for more refinement

### Generation too slow
- Use smaller LLaVA model: `llava:7b`
- Reduce `maxIterations` from 5 to 3
- Use smaller `imageSize`: `256x256`
- Enable GPU acceleration (CUDA)

---

## Hardware Recommendations

### Minimum
- CPU: 4+ cores
- RAM: 16GB
- Storage: 20GB free
- GPU: Optional (CPU works)

### Recommended
- CPU: 8+ cores
- RAM: 32GB
- Storage: 50GB free
- GPU: NVIDIA GTX 1660+

### Performance
- Generation: ~30-60s per image (GPU)
- Evaluation: ~10-20s (LLaVA 13B)
- Full loop: ~2-3 minutes (3 iterations)

---

## LLaVA Model Comparison

| Model | Parameters | RAM | Speed | Quality |
|-------|------------|-----|-------|---------|
| `llava:7b` | 7B | ~8GB | Fast | Good |
| `llava:13b` | 13B | ~16GB | Medium | Better ⭐ |
| `llava:34b` | 34B | ~32GB | Slow | Best |

**Recommendation**: Start with `llava:13b` for best balance.

---

## Pixel Art Tips

From community best practices:

1. **Don't use "pixel art" in prompts** - LoRA handles style
2. **Downscale 8x** with nearest neighbor for crisp pixels
3. **Use specific subjects** - "small robot" not "character"
4. **Limited palette** - "8 colors", "NES palette"
5. **Avoid style mixing** - No "realistic" or "photographic"

---

## Commands Reference

```bash
# Installation
pip install ollamadiffuser
ollama pull llava:13b
ollamadiffuser download sdxl
ollamadiffuser download lora pixel-art-xl-v1.1

# Generation
npm run assets:generate <request.json>
npm run assets:generate:batch <batch.json>

# Manual testing
ollamadiffuser generate --prompt "..." --output test.png --model sdxl
ollama run llava:13b "Analyze: test.png"

# Check status
ollamadiffuser list
ollama list
```

---

## Related Documentation

- [Asset Management](ASSETS.md) - Asset organization
- [Agents Guide](AGENTS.md) - AI agent workflows
- [Quick Start](QUICK_START.md) - Fast setup guide

---

**See also**: `local-asset-generator.js`, `example-asset-requests/`
