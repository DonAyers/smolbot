# 🚀 Autonomous System Improvements & Tool Recommendations

Based on research of available npm packages, MCP tools, and AI automation frameworks, here are actionable improvements for the autonomous agent system.

---

## 🎯 Priority Improvements

### 1. **Visual Regression Testing & Screenshot Comparison**

**Problem**: Currently screenshots are captured but not automatically compared.

**Solution**: Integrate visual diff tools

#### Recommended Packages:

**Option A: pixelmatch** (Fast, lightweight)
```bash
npm install pixelmatch pngjs
```

**Why**: 
- 150 lines of code, no dependencies
- ~150% faster than alternatives
- Anti-aliasing aware
- Perfect for before/after comparison

**Implementation**:
```javascript
// In improvement-manager.js
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs';

async function compareIterations(taskId, iteration) {
    const before = PNG.sync.read(fs.readFileSync(`before/capture_0.png`));
    const after = PNG.sync.read(fs.readFileSync(`iteration_${iteration}/capture_0.png`));
    
    const diff = new PNG({ width: before.width, height: before.height });
    
    const numDiffPixels = pixelmatch(
        before.data,
        after.data,
        diff.data,
        before.width,
        before.height,
        { threshold: 0.1 }
    );
    
    // Save diff image
    fs.writeFileSync(`iteration_${iteration}/diff.png`, PNG.sync.write(diff));
    
    const percentDiff = (numDiffPixels / (before.width * before.height)) * 100;
    
    return {
        numDiffPixels,
        percentDiff,
        hasMeaningfulChange: percentDiff > 1, // >1% different
        diffImage: `iteration_${iteration}/diff.png`
    };
}
```

**Option B: odiff** (SIMD-optimized, fastest)
```bash
npm install odiff-bin
```

**Why**:
- 10x faster for large images
- Supports anti-aliasing detection
- Cross-format support
- Server mode for CI/CD

**Option C: ai-visual-tester** (AI-powered quality assessment)
```bash
npm install ai-visual-tester
```

**Why**:
- Uses GPT-4 Vision for semantic analysis
- Detects UX issues, not just pixels
- Human-like feedback ("The button looks misaligned")
- Good for quality scoring

---

### 2. **AI Agent Orchestration Framework**

**Problem**: Manual execution of sub-agents, no orchestration layer

**Solution**: Integrate LangChain.js for agent coordination

#### Recommended: LangChain.js

```bash
npm install langchain @langchain/core @langchain/community
```

**Why**:
- Native TypeScript/Node.js support
- Agent orchestration built-in
- Tool calling & memory
- Multi-agent workflows

**Implementation**:
```javascript
// In agent-improvement-runner.js
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { DynamicTool } from "@langchain/core/tools";

class LangChainOrchestrator {
    async createAgent(tools, systemPrompt) {
        const model = new ChatOpenAI({ temperature: 0 });
        const prompt = await pull("hwchase17/openai-functions-agent");
        
        const agent = await createOpenAIFunctionsAgent({
            llm: model,
            tools,
            prompt
        });
        
        return new AgentExecutor({ agent, tools });
    }
    
    async runImprovementLoop(taskId, iterations) {
        // Define tools the agent can use
        const tools = [
            new DynamicTool({
                name: "capture_screenshots",
                description: "Capture game screenshots for comparison",
                func: async () => {
                    // Run test:agent
                    return "Screenshots captured";
                }
            }),
            new DynamicTool({
                name: "compare_images",
                description: "Compare before/after screenshots",
                func: async (input) => {
                    // Run pixelmatch
                    return "Images are 15% different";
                }
            }),
            new DynamicTool({
                name: "modify_code",
                description: "Make code changes to target file",
                func: async (changes) => {
                    // Apply code edits
                    return "Code modified";
                }
            }),
            new DynamicTool({
                name: "search_assets",
                description: "Search for game assets online",
                func: async (query) => {
                    // Run asset discovery
                    return "Found 5 matching assets";
                }
            })
        ];
        
        const agent = await this.createAgent(tools, `
            You are an autonomous game improvement agent.
            Goal: Improve building generation in the game.
            Run ${iterations} improvement cycles.
        `);
        
        const result = await agent.invoke({
            input: `Improve the building generation in task ${taskId}`
        });
        
        return result;
    }
}
```

**Benefits**:
- ✅ True autonomous execution
- ✅ Agent can call tools directly
- ✅ Memory between iterations
- ✅ Planning and reasoning
- ✅ Error recovery

---

### 3. **Local AI for Pixel Art Generation**

**Problem**: Asset discovery depends on finding existing assets

**Solution**: Add local pixel art generation capability

#### Recommended: ComfyUI + Stable Diffusion

**Setup**:
```bash
# 1. Install Python dependencies
pip install comfyui torch torchvision torchaudio

# 2. Download Pixel Art LoRA models
# Place in: ComfyUI/models/loras/

# 3. Create Node.js wrapper
npm install child_process
```

**Implementation**:
```javascript
// pixel-art-generator.js
import { spawn } from 'child_process';
import fs from 'fs';

class PixelArtGenerator {
    async generate(prompt, outputPath) {
        // Create ComfyUI workflow
        const workflow = {
            "1": {
                "class_type": "CheckpointLoaderSimple",
                "inputs": { "ckpt_name": "pixelart_xl.safetensors" }
            },
            "2": {
                "class_type": "CLIPTextEncode",
                "inputs": { "text": prompt }
            },
            // ... full workflow
        };
        
        fs.writeFileSync('workflow.json', JSON.stringify(workflow));
        
        return new Promise((resolve, reject) => {
            const proc = spawn('python', [
                'ComfyUI/main.py',
                '--workflow', 'workflow.json',
                '--output', outputPath
            ]);
            
            proc.on('close', (code) => {
                if (code === 0) resolve(outputPath);
                else reject(new Error('Generation failed'));
            });
        });
    }
}

// Usage in asset-discovery-agent.js
if (noAssetsFound) {
    const generator = new PixelArtGenerator();
    await generator.generate(
        "pixel art neon sign, cyberpunk style, 64x64, transparent background",
        "to-be-processed-assets/generated-neon-sign.png"
    );
}
```

**Alternative: mdsanima-cli** (Simpler, no GPU needed)
```bash
pip install mdsanima-cli

# Generate pixel art from command line
mdsanima pixelate input.png --output pixel-art.png --scale 4
```

---

### 4. **MCP Server Integration**

**Problem**: Agents can't directly interact with file system, browser, etc.

**Solution**: Create MCP servers for game-specific tools

#### Install MCP SDK:
```bash
npm install @modelcontextprotocol/sdk @modelcontextprotocol/server-filesystem
```

**Implementation**:
```javascript
// game-dev-mcp-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
    name: 'game-dev-tools',
    version: '1.0.0'
}, {
    capabilities: {
        tools: {}
    }
});

// Tool: Capture game screenshots
server.setRequestHandler('tools/call', async (request) => {
    if (request.params.name === 'capture_screenshots') {
        const { taskId } = request.params.arguments;
        
        // Run capture test
        const result = await runCaptureTest(taskId);
        
        return {
            content: [{
                type: 'text',
                text: `Captured ${result.count} screenshots`
            }]
        };
    }
    
    if (request.params.name === 'compare_images') {
        // Run pixelmatch
        const diff = await compareImages(
            request.params.arguments.before,
            request.params.arguments.after
        );
        
        return {
            content: [{
                type: 'text',
                text: `Images are ${diff.percentDiff}% different`
            }, {
                type: 'image',
                data: diff.diffImageBase64,
                mimeType: 'image/png'
            }]
        };
    }
    
    if (request.params.name === 'modify_procedural_generation') {
        // Edit ProceduralLevelGenerator.js
        const changes = request.params.arguments.changes;
        await applyCodeChanges('src/utils/ProceduralLevelGenerator.js', changes);
        
        return {
            content: [{
                type: 'text',
                text: 'Code changes applied'
            }]
        };
    }
});

// Tool: Run game tests
server.setRequestHandler('tools/list', async () => ({
    tools: [
        {
            name: 'capture_screenshots',
            description: 'Capture game screenshots for a task',
            inputSchema: {
                type: 'object',
                properties: {
                    taskId: { type: 'string' }
                }
            }
        },
        {
            name: 'compare_images',
            description: 'Compare two images and generate diff',
            inputSchema: {
                type: 'object',
                properties: {
                    before: { type: 'string' },
                    after: { type: 'string' }
                }
            }
        },
        {
            name: 'modify_procedural_generation',
            description: 'Make changes to level generation code',
            inputSchema: {
                type: 'object',
                properties: {
                    changes: { type: 'string' }
                }
            }
        },
        {
            name: 'search_opengameart',
            description: 'Search OpenGameArt.org for assets',
            inputSchema: {
                type: 'object',
                properties: {
                    query: { type: 'string' }
                }
            }
        }
    ]
}));

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Usage**:
```json
// In copilot config
{
  "mcpServers": {
    "game-dev-tools": {
      "command": "node",
      "args": ["game-dev-mcp-server.js"]
    }
  }
}
```

Now agents can directly call:
```
use_mcp_tool("game-dev-tools", "capture_screenshots", { taskId: "task_123" })
use_mcp_tool("game-dev-tools", "compare_images", { before: "...", after: "..." })
```

---

### 5. **Procedural Generation Enhancement Tools**

#### Wave Function Collapse (for better layouts)

```bash
npm install @joshmilligan/wave-function-collapse
```

**Usage**:
```javascript
// In ProceduralLevelGenerator.js
import WFC from '@joshmilligan/wave-function-collapse';

generateBuildingLayout(width, height) {
    const wfc = new WFC({
        tileSize: 70,
        outputWidth: width,
        outputHeight: height,
        patterns: [
            { tile: 'wall', neighbors: { top: ['roof'], bottom: ['wall', 'floor'] } },
            { tile: 'window', neighbors: { left: ['wall'], right: ['wall'] } },
            // ... more rules
        ]
    });
    
    const layout = wfc.generate();
    return layout;
}
```

**Benefits**:
- More coherent building designs
- Constraint-based generation
- Pattern-driven variety

---

## 📦 Complete Package List

### Visual Testing & Comparison
```bash
npm install pixelmatch pngjs               # Fast pixel comparison
npm install odiff-bin                      # SIMD-optimized comparison
npm install ai-visual-tester               # AI quality assessment
npm install resemblejs                     # Alternative comparison
```

### AI Agent Orchestration
```bash
npm install langchain @langchain/core @langchain/community @langchain/openai
npm install @langchain/anthropic          # For Claude
```

### MCP Integration
```bash
npm install @modelcontextprotocol/sdk @modelcontextprotocol/server-filesystem
```

### Procedural Generation
```bash
npm install @joshmilligan/wave-function-collapse
npm install dungeon-generator             # For dungeon/maze generation
npm install simplex-noise                 # Already installed
```

### Asset Generation (Python, but callable from Node)
```bash
pip install mdsanima-cli                  # Pixel art CLI
pip install pixel-artist                  # Image to pixel art
# ComfyUI for advanced AI generation (separate setup)
```

### Utilities
```bash
npm install sharp                         # Image processing
npm install jimp                          # Pure JS image manipulation
npm install ora                           # Spinner for long-running tasks
npm install chalk                         # Colored console output
```

---

## 🎯 Implementation Roadmap

### Phase 1: Visual Comparison (Immediate Value)
1. Install `pixelmatch` and `pngjs`
2. Add `compareIterations()` to improvement-manager.js
3. Generate diff images automatically
4. Add quality scoring (% changed)
5. Auto-decision: if <1% change, iteration didn't work

**Effort**: 2-3 hours  
**Value**: High - automated validation

### Phase 2: AI Quality Assessment (High Impact)
1. Install `ai-visual-tester`
2. Add semantic analysis after each iteration
3. Generate quality reports
4. Agent can read reports and adjust

**Effort**: 3-4 hours  
**Value**: Very High - AI judges quality

### Phase 3: LangChain Orchestration (Game Changer)
1. Install langchain packages
2. Create orchestrator class
3. Define tools for agents
4. True autonomous execution

**Effort**: 1-2 days  
**Value**: Revolutionary - full autonomy

### Phase 4: MCP Server (Production Ready)
1. Create game-dev MCP server
2. Expose all tools via MCP
3. Integration with Copilot CLI
4. Agents call tools directly

**Effort**: 2-3 days  
**Value**: Production-grade system

### Phase 5: Local Asset Generation (Complete Independence)
1. Set up ComfyUI with Pixel Art models
2. Create Node.js wrapper
3. Integrate with asset-discovery-agent
4. Auto-generate missing assets

**Effort**: 3-5 days  
**Value**: Never blocked on assets

---

## 💡 Quick Wins

### 1. Add Screenshot Diff (Today)

```javascript
// Add to improvement-manager.js
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

async captureAndCompare(taskId, iteration) {
    // Existing capture logic...
    
    // NEW: Compare with baseline
    if (iteration > 0) {
        const diff = await this.compareScreenshots(
            `${taskFolder}/before/capture_0.png`,
            `${taskFolder}/iterations/iteration_${iteration}/capture_0.png`
        );
        
        console.log(`\n📊 Visual Changes:`);
        console.log(`   Pixels changed: ${diff.numDiffPixels}`);
        console.log(`   Percent changed: ${diff.percentDiff.toFixed(2)}%`);
        console.log(`   Diff image: ${diff.diffImage}\n`);
        
        // Save metrics
        fs.writeFileSync(
            `${taskFolder}/iterations/iteration_${iteration}/metrics.json`,
            JSON.stringify(diff, null, 2)
        );
    }
}
```

### 2. Add Quality Scoring (Today)

```javascript
function scoreVisualQuality(metrics) {
    // Simple heuristic scoring
    const score = {
        hasChanges: metrics.percentDiff > 1,
        isMeaningful: metrics.percentDiff > 5 && metrics.percentDiff < 50,
        isBreaking: metrics.percentDiff > 90, // Probably broke something
        quality: 0
    };
    
    if (score.isBreaking) score.quality = 0;
    else if (score.isMeaningful) score.quality = 0.8;
    else if (score.hasChanges) score.quality = 0.5;
    else score.quality = 0.1; // No visible change
    
    return score;
}
```

### 3. Add Progress Spinner (Today)

```bash
npm install ora chalk
```

```javascript
import ora from 'ora';
import chalk from 'chalk';

async runImprovementIteration(iterationNum) {
    const spinner = ora(`Running iteration ${iterationNum}...`).start();
    
    try {
        spinner.text = 'Capturing screenshots...';
        await this.captureScreenshots(iterationNum);
        
        spinner.text = 'Comparing images...';
        const diff = await this.compareImages(iterationNum);
        
        spinner.text = 'Analyzing quality...';
        const score = this.scoreQuality(diff);
        
        if (score.quality > 0.7) {
            spinner.succeed(chalk.green(`Iteration ${iterationNum} successful! Quality: ${score.quality}`));
        } else {
            spinner.warn(chalk.yellow(`Iteration ${iterationNum} completed. Quality: ${score.quality}`));
        }
    } catch (error) {
        spinner.fail(chalk.red(`Iteration ${iterationNum} failed: ${error.message}`));
    }
}
```

---

## 🚀 Next Steps

**Recommend starting with:**

1. **Install pixelmatch** (30 min)
   ```bash
   npm install pixelmatch pngjs
   ```

2. **Add visual comparison** (1-2 hours)
   - Implement `compareIterations()`
   - Generate diff images
   - Add to improvement flow

3. **Add quality scoring** (30 min)
   - Simple heuristic first
   - Can upgrade to AI later

4. **Test with existing task** (30 min)
   ```bash
   npm run improve:auto task_1770670568629 2
   # Will now show visual diffs!
   ```

5. **Then choose next enhancement:**
   - AI quality assessment (ai-visual-tester)
   - LangChain orchestration
   - MCP server
   - Local asset generation

---

## 📚 Resources

- [Pixelmatch Docs](https://github.com/mapbox/pixelmatch)
- [LangChain.js Guide](https://js.langchain.com/docs/introduction/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [ComfyUI Pixel Art](https://www.kokutech.com/blog/gamedev/tips/art/pixel-art-generation-with-comfyui)
- [Wave Function Collapse](https://github.com/mxgmn/WaveFunctionCollapse)

---

**Ready to implement?** Let's start with the visual comparison - it's the quickest win with the highest impact! 🎯
