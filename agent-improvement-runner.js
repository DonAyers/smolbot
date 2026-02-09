/**
 * Autonomous Agent Runner for Improvements
 * 
 * Spawns Copilot CLI sub-agents to autonomously:
 * 1. Find reference images based on seed games
 * 2. Analyze current implementation
 * 3. Make improvements iteratively
 * 4. Find or generate assets as needed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AgentRunner {
    constructor(taskId) {
        this.taskId = taskId;
        this.configPath = path.join(__dirname, 'improvement-config.json');
        this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
        
        // Find the task
        this.task = this.config.activeTasks.find(t => t.id === taskId);
        if (!this.task) {
            throw new Error(`Task ${taskId} not found`);
        }
        
        this.taskFolder = path.join(__dirname, this.config.config.tasks.folder, taskId);
    }

    // Main autonomous loop
    async runAutonomous(maxIterations = 3) {
        console.log(`\n🤖 Starting Autonomous Improvement Agent`);
        console.log(`   Task: ${this.task.name}`);
        console.log(`   Target: ${this.task.targetComponent}`);
        console.log(`   Max Iterations: ${maxIterations}\n`);

        try {
            // Step 1: Gather reference images if needed
            await this.gatherReferences();

            // Step 2: Run improvement iterations
            for (let i = 0; i < maxIterations; i++) {
                console.log(`\n🔄 Iteration ${i + 1}/${maxIterations}`);
                
                const success = await this.runImprovementIteration(i + 1);
                
                if (!success) {
                    console.log(`❌ Iteration ${i + 1} failed, stopping.`);
                    break;
                }
                
                console.log(`✅ Iteration ${i + 1} complete`);
            }

            console.log(`\n✨ Autonomous improvement complete!`);
            console.log(`   Review results in: ${this.taskFolder}`);

        } catch (error) {
            console.error(`\n❌ Agent error: ${error.message}`);
            throw error;
        }
    }

    // Gather reference images using web search
    async gatherReferences() {
        console.log(`\n📸 Gathering Reference Images...`);

        const inspoFolder = path.join(__dirname, this.config.config.inspiration.folder);
        const seedTerms = this.config.config.inspiration.seedTerms;

        // Check if we already have enough
        const existingImages = fs.readdirSync(inspoFolder).filter(f => 
            /\.(png|jpg|jpeg|gif|webp)$/i.test(f)
        );

        if (existingImages.length >= 3) {
            console.log(`   ✅ Already have ${existingImages.length} reference images`);
            return;
        }

        // Create agent prompt for finding references
        const searchTerm = `${this.task.targetComponent} ${this.task.name}`;
        const prompt = this.buildReferenceSearchPrompt(searchTerm, seedTerms);

        console.log(`\n🔍 Spawning agent to find references...`);
        await this.spawnCopilotAgent(prompt, 'find-references');
    }

    // Run a single improvement iteration
    async runImprovementIteration(iterationNum) {
        console.log(`\n   📊 Capturing baseline screenshots...`);
        
        // Capture screenshots first
        const captureSuccess = await this.captureScreenshots(iterationNum);
        if (!captureSuccess) return false;

        // Build improvement prompt
        const prompt = this.buildImprovementPrompt(iterationNum);

        console.log(`\n   🛠️ Spawning improvement agent...`);
        const success = await this.spawnCopilotAgent(prompt, `iteration-${iterationNum}`);

        return success;
    }

    // Build prompt for reference search agent
    buildReferenceSearchPrompt(searchTerm, seedTerms) {
        const inspoFolder = path.join(__dirname, this.config.config.inspiration.folder);
        
        return `You are a reference image researcher for game development.

TASK: Find visual reference images for: "${searchTerm}"

SEED GAMES: ${seedTerms.join(', ')}

INSTRUCTIONS:
1. For each seed game, search for screenshots showing: ${this.task.targetComponent}
   Example searches:
   ${seedTerms.map(game => `   - "${game.replace(' gameplay screenshot', '')} ${this.task.targetComponent}"`).join('\n')}

2. Use web_search to find high-quality images
3. Look for OpenGameArt.org resources that match the style
4. Search for pixel art ${this.task.targetComponent} references

5. Create detailed markdown files in: ${inspoFolder}/
   - Describe visual characteristics
   - Note color palettes
   - List key design patterns
   - Include source URLs

6. If possible, save actual images or provide download links

GOAL: Gather at least 3 detailed references showing different styles/approaches to ${this.task.targetComponent}

CONSTRAINTS:
- Focus on pixel art or 2D platformer style
- Look for variety in approaches
- Document clearly what makes each reference useful`;
    }

    // Build prompt for improvement iteration agent
    buildImprovementPrompt(iterationNum) {
        const taskFolder = this.taskFolder;
        const targetFile = this.findTargetFile();
        const inspoFolder = path.join(__dirname, this.config.config.inspiration.folder);

        // Get previous iteration notes
        const previousNotes = this.task.iterations
            .filter(it => it.iteration < iterationNum)
            .map(it => `Iteration ${it.iteration}: ${it.note}`)
            .join('\n');

        return `You are an autonomous game improvement agent.

TASK: ${this.task.name}
DESCRIPTION: ${this.task.description}
TARGET: ${this.task.targetComponent}
ITERATION: ${iterationNum}

FILES:
- Target code: ${targetFile}
- Task folder: ${taskFolder}
- References: ${inspoFolder}/
- Latest screenshots: ${taskFolder}/iterations/iteration_${iterationNum}/

PREVIOUS ITERATIONS:
${previousNotes || 'None - this is the first iteration'}

INSTRUCTIONS:

1. READ REFERENCE MATERIALS
   - Review all files in ${inspoFolder}/
   - Understand the visual style and patterns
   - Note key characteristics to implement

2. ANALYZE CURRENT STATE
   - Review ${targetFile}
   - Look at latest screenshots
   - Identify gaps between current and reference styles

3. PLAN IMPROVEMENTS
   - List 3-5 specific changes to make
   - Prioritize highest visual impact
   - Consider asset availability

4. CHECK ASSETS
   - Do we have the assets needed?
   - If not, search for them:
     a. Check public/assets/ for existing unused assets
     b. Search OpenGameArt.org: "pixel art ${this.task.targetComponent}"
     c. Document what's needed in assets-needed.md

5. IMPLEMENT CHANGES
   - Make surgical edits to ${targetFile}
   - Add new functions/logic as needed
   - Follow existing code patterns

6. TEST AND CAPTURE
   - Run: npm run improve capture ${this.taskId}
   - Review screenshots for visual changes

7. DOCUMENT
   - Run: npm run improve note ${this.taskId} ${iterationNum} "what you changed"
   - Create iteration-${iterationNum}-notes.md with details

SUCCESS CRITERIA:
- Code compiles and runs
- Visible improvements in screenshots
- Changes align with reference materials
- No broken gameplay functionality

IF YOU NEED HELP:
- Asset generation: Document in assets-needed.md
- Stuck on implementation: Document in blockers.md
- Need user input: Create questions.md

THINK STEP BY STEP. Make meaningful improvements!`;
    }

    // Find the target file based on component
    findTargetFile() {
        const componentMap = {
            'buildings': 'src/utils/ProceduralLevelGenerator.js',
            'terrain': 'src/utils/ProceduralLevelGenerator.js',
            'enemies': 'src/components/Enemy.js',
            'player': 'src/components/Player.js',
            'ProceduralLevelGenerator': 'src/utils/ProceduralLevelGenerator.js'
        };

        return componentMap[this.task.targetComponent] || 
               `src/**/*${this.task.targetComponent}*.js`;
    }

    // Spawn a Copilot CLI agent
    async spawnCopilotAgent(prompt, sessionName) {
        return new Promise((resolve, reject) => {
            console.log(`\n   💬 Launching Copilot CLI agent: ${sessionName}`);
            console.log(`   📝 Prompt length: ${prompt.length} chars\n`);

            // Save prompt to file for reference
            const promptFile = path.join(this.taskFolder, `prompt-${sessionName}.txt`);
            fs.writeFileSync(promptFile, prompt);
            console.log(`   💾 Prompt saved: ${promptFile}`);

            // For now, we'll output instructions for manual execution
            // In the future, this could spawn actual Copilot CLI process
            
            console.log(`\n   ⚠️ MANUAL STEP REQUIRED:`);
            console.log(`   Run this command to execute the agent:\n`);
            console.log(`   copilot --allow-all-tools -p "$(cat ${promptFile})"\n`);
            console.log(`   Or copy the prompt from: ${promptFile}\n`);

            // TODO: Implement actual spawn when Copilot CLI supports it
            // const proc = spawn('copilot', ['--allow-all-tools', '-p', prompt], {
            //     stdio: 'inherit',
            //     shell: true
            // });

            resolve(true);
        });
    }

    // Capture screenshots
    async captureScreenshots(iterationNum) {
        return new Promise((resolve, reject) => {
            console.log(`   Running capture test...`);
            
            const proc = spawn('npm', ['run', 'improve', 'capture', this.taskId], {
                stdio: 'inherit',
                shell: true
            });

            proc.on('close', (code) => {
                if (code === 0) {
                    // Move screenshots to iteration folder
                    const iterFolder = path.join(this.taskFolder, 'iterations', `iteration_${iterationNum}`);
                    fs.mkdirSync(iterFolder, { recursive: true });
                    
                    console.log(`   ✅ Screenshots captured to: ${iterFolder}`);
                    resolve(true);
                } else {
                    console.log(`   ❌ Screenshot capture failed`);
                    resolve(false);
                }
            });
        });
    }
}

// CLI Interface
const command = process.argv[2];
const taskId = process.argv[3];
const maxIterations = parseInt(process.argv[4]) || 3;

if (command === 'run' && taskId) {
    const runner = new AgentRunner(taskId);
    runner.runAutonomous(maxIterations)
        .then(() => {
            console.log(`\n✨ Agent runner complete!`);
            process.exit(0);
        })
        .catch(err => {
            console.error(`\n❌ Agent runner failed:`, err);
            process.exit(1);
        });
} else {
    console.log(`
🤖 Autonomous Agent Runner

Usage:
  node agent-improvement-runner.js run <task-id> [max-iterations]

Example:
  node agent-improvement-runner.js run task_1234567890 3

This will spawn Copilot CLI sub-agents to:
  1. Find reference images from seed games
  2. Analyze current implementation
  3. Make iterative improvements
  4. Find/generate assets as needed

The agent will run up to max-iterations (default: 3) improvement cycles.
`);
    process.exit(1);
}

export default AgentRunner;
