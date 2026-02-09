# Complete Setup Guide: Local AI Asset Generation

## Overview

This guide walks through setting up **fully local AI asset generation and evaluation** using:
- **OllamaDiffuser** - Stable Diffusion runner (Ollama-style CLI)
- **SDXL** - Stable Diffusion XL base model
- **Pixel Art XL LoRA** - Specialized pixel art training
- **LLaVA** - Vision model for quality evaluation via Ollama

## Prerequisites

✅ You already have:
- Node.js installed
- Ollama installed
- Git/GitHub setup

## Step-by-Step Installation

### Step 1: Install Python Dependencies

OllamaDiffuser requires Python 3.8+:

```bash
# Check Python version
python --version  # Should be 3.8 or higher

# Install OllamaDiffuser
pip install ollamadiffuser

# Verify installation
ollamadiffuser --version
```

### Step 2: Download Base Models

Download SDXL (Stable Diffusion XL):

```bash
# This downloads ~6GB
ollamadiffuser download sdxl

# Check status
ollamadiffuser list
```

### Step 3: Download Pixel Art LoRA

Download specialized pixel art training weights:

```bash
# Download Pixel Art XL v1.1 from Civitai
ollamadiffuser download lora pixel-art-xl-v1.1

# If that doesn't work, manual download:
# Visit: https://civitai.com/models/120096/pixel-art-xl
# Download "pixelartxl_v1.1.safetensors"
# Place in: ~/.ollamadiffuser/loras/
```

### Step 4: Install LLaVA Vision Model

LLaVA evaluates generated images:

```bash
# Download 13B model (recommended - 16GB RAM)
ollama pull llava:13b

# Or use 7B if you have less RAM (8GB)
ollama pull llava:7b

# Or use 34B for best quality (32GB RAM)
ollama pull llava:34b

# Verify
ollama list
```

### Step 5: Test the Pipeline

Test generation:

```bash
# Generate a simple test image
ollamadiffuser generate \
  --prompt "small robot character, 32-bit pixel art" \
  --output test-robot.png \
  --model sdxl \
  --lora pixel-art-xl-v1.1 \
  --steps 30

# Check output
ls -la test-robot.png  # Unix
dir test-robot.png     # Windows
```

Test evaluation:

```bash
# Evaluate with LLaVA
ollama run llava:13b

# At prompt, paste:
# "Analyze this pixel art image: ./test-robot.png
#  Rate its quality 0-10 considering: crisp edges, pixel grid visibility, 
#  color palette, and game asset suitability."

# Type and press Enter
# Should get detailed analysis with score
```

### Step 6: Run Complete System

Now use the integrated system:

```bash
# Generate a character with automatic evaluation
npm run assets:generate example-asset-requests/robot-character.json
```

Expected output:
```
🎨 Starting generation: tank-robot-hero
   Type: character
   Description: small friendly robot with visible tank treads

--- Iteration 1/5 ---
📝 Prompt: 32-bit pixel art style, small friendly robot...
🖼️  Generating image...
✅ Image generated successfully
🔍 Evaluating with LLaVA...

📊 Evaluation:
   Score: 7.5/10
   Feedback: Good pixel art with clear tank treads. Could use more contrast.

--- Iteration 2/5 ---
📝 Prompt: 32-bit pixel art style, small friendly robot... crisp sharp details
🖼️  Generating image...
✅ Image generated successfully
🔍 Evaluating with LLaVA...

📊 Evaluation:
   Score: 8.5/10
   Feedback: Excellent improvement! Sharp edges and vibrant colors.

✅ Quality threshold met! (8.5/10)

🎉 Best result saved:
   Score: 8.5/10
   Path: generated-assets/task_1234567890/tank-robot-hero.png
```

## Configuration

### Adjust Quality Threshold

Edit `local-asset-generator.js`:

```javascript
const generator = new LocalAssetGenerator({
    qualityThreshold: 7,    // Lower = accepts more quickly
                            // Higher = more refinement iterations
    maxIterations: 5        // Max refinement attempts
});
```

### Choose LLaVA Model Size

Trade-off between speed and quality:

```javascript
const generator = new LocalAssetGenerator({
    ollamaModel: 'llava:7b',   // Fast, 8GB RAM
    // ollamaModel: 'llava:13b', // Balanced, 16GB RAM (recommended)
    // ollamaModel: 'llava:34b', // Best, 32GB RAM
});
```

### Adjust Pixel Density

```javascript
const generator = new LocalAssetGenerator({
    pixelDensity: '16',  // 8, 16, 32, or 64-bit style
    imageSize: '256x256' // Smaller = faster, larger = more detail
});
```

## Creating Asset Requests

### Single Asset Request

`my-asset.json`:
```json
{
  "name": "my-asset-name",
  "type": "character|enemy|building|prop|tile|background|ui",
  "description": "Detailed description of what you want",
  "gameStyle": "Reference style like 'Megaman', 'Celeste', 'FTL'"
}
```

### Batch Request

`batch.json`:
```json
[
  { "name": "asset1", "type": "character", ... },
  { "name": "asset2", "type": "enemy", ... },
  { "name": "asset3", "type": "prop", ... }
]
```

## Troubleshooting

### Issue: `ollamadiffuser: command not found`

**Solution:**
```bash
# Ensure pip installed to user directory
pip install --user ollamadiffuser

# Add to PATH (Windows)
# Add: C:\Users\<YourName>\AppData\Local\Programs\Python\Python3X\Scripts

# Or use full path
python -m ollamadiffuser --version
```

### Issue: `SDXL model not found`

**Solution:**
```bash
# Re-download
ollamadiffuser download sdxl

# Check location
ollamadiffuser list

# Manually check:
ls ~/.ollamadiffuser/models/  # Unix
dir %USERPROFILE%\.ollamadiffuser\models\  # Windows
```

### Issue: `LoRA not loading`

**Solution:**
```bash
# Manual download from Civitai:
# 1. Visit: https://civitai.com/models/120096/pixel-art-xl
# 2. Download: pixelartxl_v1.1.safetensors
# 3. Place in: ~/.ollamadiffuser/loras/ (create if needed)
# 4. Rename to: pixel-art-xl-v1.1.safetensors
```

### Issue: Out of memory during generation

**Solution:**
```bash
# Use CPU mode (slower but works)
ollamadiffuser generate --device cpu --prompt "..."

# Or reduce image size
ollamadiffuser generate --width 256 --height 256 --prompt "..."
```

### Issue: LLaVA evaluation failing

**Solution:**
```bash
# Verify Ollama is running
ollama list

# Re-pull model
ollama pull llava:13b

# Test manually
ollama run llava:13b "Describe this: test.png"
```

### Issue: Low quality scores (< 5)

**Causes:**
- Prompt needs refinement
- Wrong pixel density setting
- LoRA not loading properly

**Solutions:**
1. Check LoRA is loaded: `ollamadiffuser list loras`
2. Try different pixel density: 16, 32, 64
3. Add more specific keywords to description
4. Reference specific game styles

### Issue: Generation too slow

**Solutions:**
1. Use smaller LLaVA model: `llava:7b`
2. Reduce `maxIterations` from 5 to 3
3. Reduce image size: `256x256` instead of `512x512`
4. Use GPU if available (CUDA)

## Hardware Recommendations

### Minimum
- **CPU**: 4+ cores
- **RAM**: 16GB
- **Storage**: 20GB free
- **GPU**: Optional (CPU mode works)

### Recommended
- **CPU**: 8+ cores
- **RAM**: 32GB
- **Storage**: 50GB free
- **GPU**: NVIDIA GTX 1660 or better (CUDA)

### Optimal
- **CPU**: 12+ cores
- **RAM**: 64GB
- **Storage**: 100GB SSD
- **GPU**: NVIDIA RTX 3060 or better

## Integration with Autonomous System

Once set up, the system can:

1. **Identify missing assets** in code
2. **Generate requests** automatically
3. **Generate images** with AI
4. **Evaluate quality** with vision models
5. **Refine iteratively** until threshold met
6. **Auto-organize** into proper folders
7. **Test in-game** with screenshot comparison
8. **Continue until satisfied**

See `AUTONOMOUS_AGENTS.md` for full integration guide.

## Next Steps

1. ✅ Complete this installation
2. 📝 Create test asset request
3. 🎨 Generate your first asset
4. 🔍 Review output and adjust settings
5. 🚀 Integrate with improvement system
6. 🤖 Run fully autonomous asset pipeline

## See Also

- `LOCAL_AI_GENERATION.md` - Complete usage guide
- `local-asset-generator.js` - Tool source code
- `example-asset-requests/` - Example requests
- `AUTONOMOUS_AGENTS.md` - Full system architecture
- `asset-discovery-agent.js` - Web-based asset search (alternative)

## Commands Quick Reference

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
ollama run llava:13b "Analyze this: test.png"

# Check status
ollamadiffuser list
ollama list
```

## Resources

- **OllamaDiffuser**: https://www.ollamadiffuser.com/
- **Pixel Art XL LoRA**: https://civitai.com/models/120096/pixel-art-xl
- **LLaVA**: https://ollama.com/library/llava
- **SDXL Documentation**: https://stablediffusionxl.com/

---

**Ready to generate your first AI asset? Run:**
```bash
npm run assets:generate example-asset-requests/robot-character.json
```
