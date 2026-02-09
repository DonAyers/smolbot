/**
 * Procedural Generation Improvement System
 * 
 * This tool manages iterative improvements to procedural generation:
 * 1. Captures game screenshots for analysis
 * 2. Manages inspiration/reference images
 * 3. Tracks improvement tasks
 * 4. Facilitates AI-driven design iteration
 * 5. Compares screenshots with visual diff
 * 6. Scores iteration quality automatically
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import ora from 'ora';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ImprovementManager {
    constructor() {
        this.configPath = path.join(__dirname, 'improvement-config.json');
        this.config = this.loadConfig();
    }

    loadConfig() {
        if (fs.existsSync(this.configPath)) {
            return JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
        }
        throw new Error('improvement-config.json not found');
    }

    saveConfig() {
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    }

    // Create a new improvement task
    createTask(name, description, targetComponent) {
        const task = {
            id: `task_${Date.now()}`,
            name: name,
            description: description,
            targetComponent: targetComponent, // e.g., "buildings", "terrain", "enemies"
            status: 'in-progress',
            createdAt: new Date().toISOString(),
            screenshots: [],
            inspirationUsed: [],
            iterations: [],
            notes: []
        };

        // Create task folder
        const taskFolder = path.join(__dirname, this.config.config.tasks.folder, task.id);
        fs.mkdirSync(taskFolder, { recursive: true });
        fs.mkdirSync(path.join(taskFolder, 'before'), { recursive: true });
        fs.mkdirSync(path.join(taskFolder, 'iterations'), { recursive: true });
        fs.mkdirSync(path.join(taskFolder, 'final'), { recursive: true });

        // Save task metadata
        fs.writeFileSync(
            path.join(taskFolder, 'task.json'),
            JSON.stringify(task, null, 2)
        );

        this.config.activeTasks.push(task);
        this.saveConfig();

        console.log(`\n✅ Created improvement task: ${task.name}`);
        console.log(`   ID: ${task.id}`);
        console.log(`   Folder: ${taskFolder}`);
        console.log(`   Target: ${targetComponent}\n`);

        return task;
    }

    // Check if we have enough inspiration images
    checkInspiration() {
        const inspoFolder = path.join(__dirname, this.config.config.inspiration.folder);
        
        if (!fs.existsSync(inspoFolder)) {
            fs.mkdirSync(inspoFolder, { recursive: true });
        }

        const images = fs.readdirSync(inspoFolder).filter(file => 
            /\.(png|jpg|jpeg|gif|webp)$/i.test(file)
        );

        const minRequired = this.config.config.inspiration.minimumImages;
        const hasEnough = images.length >= minRequired;

        console.log(`\n📸 Inspiration Images:`);
        console.log(`   Found: ${images.length}`);
        console.log(`   Required: ${minRequired}`);
        console.log(`   Status: ${hasEnough ? '✅ Sufficient' : '⚠️ Need more'}\n`);

        if (!hasEnough) {
            console.log(`💡 Suggestion: Fetch inspiration images`);
            console.log(`   Run: node improvement-manager.js fetch-inspiration\n`);
        }

        return {
            hasEnough,
            count: images.length,
            required: minRequired,
            images: images.map(img => path.join(inspoFolder, img))
        };
    }

    // Fetch inspiration images from web
    async fetchInspiration() {
        console.log('\n🔍 Fetching inspiration images...\n');
        
        const inspoFolder = path.join(__dirname, this.config.config.inspiration.folder);
        const seedTerms = this.config.config.inspiration.seedTerms;

        console.log('📝 Search terms:');
        seedTerms.forEach(term => console.log(`   • ${term}`));
        console.log('');

        // Create a guide for AI agents to fetch images
        const guide = {
            task: 'fetch_inspiration_images',
            searchTerms: seedTerms,
            targetFolder: inspoFolder,
            minimumImages: this.config.config.inspiration.minimumImages,
            instructions: [
                '1. Use web_search or image search to find gameplay screenshots',
                '2. Look for high-quality images showing game levels/environments',
                '3. Download and save to inspo/ folder',
                '4. Name files descriptively: megaman_level_1.png, fez_village.png, etc.',
                '5. Verify images are suitable inspiration (clear, representative)'
            ],
            guidelines: [
                'Focus on level design and visual style',
                'Avoid UI-heavy screenshots',
                'Prefer in-game screenshots over artwork',
                'Look for variety in composition and lighting'
            ]
        };

        // Save guide for agent
        const guidePath = path.join(inspoFolder, 'FETCH_GUIDE.json');
        fs.writeFileSync(guidePath, JSON.stringify(guide, null, 2));

        console.log('📄 Created fetch guide: inspo/FETCH_GUIDE.json');
        console.log('\n💡 This is an AI agent task:');
        console.log('   An AI agent should read the guide and fetch images');
        console.log('   Suggested approach:');
        console.log('   1. Read inspo/FETCH_GUIDE.json');
        console.log('   2. Use web search to find images');
        console.log('   3. Download to inspo/ folder');
        console.log('   4. Verify minimum count met\n');

        return guide;
    }

    // Capture game screenshots for a task
    async captureScreenshots(taskId, count = 5) {
        const task = this.config.activeTasks.find(t => t.id === taskId);
        if (!task) {
            throw new Error(`Task ${taskId} not found`);
        }

        console.log(`\n📸 Capturing ${count} screenshots for: ${task.name}\n`);

        const taskFolder = path.join(__dirname, this.config.config.tasks.folder, taskId);
        const screenshotFolder = path.join(taskFolder, 'before');

        // Create a test scenario for automated capture
        const testScenario = {
            name: `Capture screenshots for ${task.name}`,
            description: `Automated screenshot capture for improvement task`,
            actions: []
        };

        // Add actions to capture screenshots at intervals
        for (let i = 0; i < count; i++) {
            testScenario.actions.push(
                { action: 'wait', seconds: 2 },
                { action: 'screenshot', name: `capture_${i}`, saveState: true },
                { action: 'press_key', key: 'ArrowRight', duration: 1000 }, // Move right to see different content
                { action: 'wait', ms: 500 }
            );
        }

        // Save test scenario
        const testPath = path.join(taskFolder, 'capture-test.json');
        fs.writeFileSync(testPath, JSON.stringify(testScenario, null, 2));

        console.log(`✅ Created capture test: ${testPath}`);
        console.log(`\n💡 To capture screenshots, run:`);
        console.log(`   npm run test:agent -- "${testPath}"`);
        console.log(`\n   Screenshots will appear in tmp/screenshots/`);
        console.log(`   Move relevant ones to: ${screenshotFolder}\n`);

        return testPath;
    }

    // Add iteration notes
    addIterationNote(taskId, iteration, note, screenshotPaths = []) {
        const task = this.config.activeTasks.find(t => t.id === taskId);
        if (!task) {
            throw new Error(`Task ${taskId} not found`);
        }

        const iterationData = {
            number: iteration,
            timestamp: new Date().toISOString(),
            note: note,
            screenshots: screenshotPaths,
            changes: []
        };

        task.iterations.push(iterationData);
        
        // Update task file
        const taskFolder = path.join(__dirname, this.config.config.tasks.folder, taskId);
        fs.writeFileSync(
            path.join(taskFolder, 'task.json'),
            JSON.stringify(task, null, 2)
        );

        this.saveConfig();

        console.log(`\n✅ Added iteration ${iteration} to task: ${task.name}`);
        console.log(`   Note: ${note}\n`);
    }

    // Complete a task
    completeTask(taskId, finalNotes = '') {
        const taskIndex = this.config.activeTasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            throw new Error(`Task ${taskId} not found`);
        }

        const task = this.config.activeTasks[taskIndex];
        task.status = 'completed';
        task.completedAt = new Date().toISOString();
        task.finalNotes = finalNotes;

        // Move to completed
        this.config.completedTasks.push(task);
        this.config.activeTasks.splice(taskIndex, 1);
        this.saveConfig();

        console.log(`\n✅ Completed task: ${task.name}`);
        console.log(`   Total iterations: ${task.iterations.length}`);
        console.log(`   Final notes: ${finalNotes || 'None'}\n`);
    }

    // List all tasks
    listTasks() {
        console.log('\n📋 Active Improvement Tasks:\n');
        
        if (this.config.activeTasks.length === 0) {
            console.log('   No active tasks\n');
        } else {
            this.config.activeTasks.forEach(task => {
                console.log(`   ${task.id}`);
                console.log(`   ├─ Name: ${task.name}`);
                console.log(`   ├─ Target: ${task.targetComponent}`);
                console.log(`   ├─ Created: ${new Date(task.createdAt).toLocaleDateString()}`);
                console.log(`   └─ Iterations: ${task.iterations.length}\n`);
            });
        }

        if (this.config.completedTasks.length > 0) {
            console.log('✅ Completed Tasks:\n');
            this.config.completedTasks.forEach(task => {
                console.log(`   ${task.name} (${task.iterations.length} iterations)`);
            });
            console.log('');
        }
    }

    // Compare screenshots between iterations
    async compareScreenshots(beforePath, afterPath, outputPath) {
        const spinner = ora('Comparing screenshots...').start();
        
        try {
            const img1 = PNG.sync.read(fs.readFileSync(beforePath));
            const img2 = PNG.sync.read(fs.readFileSync(afterPath));
            
            const { width, height } = img1;
            const diff = new PNG({ width, height });
            
            const numDiffPixels = pixelmatch(
                img1.data,
                img2.data,
                diff.data,
                width,
                height,
                { threshold: 0.1 }
            );
            
            // Save diff image
            fs.writeFileSync(outputPath, PNG.sync.write(diff));
            
            const totalPixels = width * height;
            const percentDiff = (numDiffPixels / totalPixels) * 100;
            
            spinner.succeed(chalk.green('Screenshot comparison complete'));
            
            return {
                numDiffPixels,
                totalPixels,
                percentDiff,
                hasMeaningfulChange: percentDiff > 1,
                diffImage: outputPath,
                width,
                height
            };
        } catch (error) {
            spinner.fail(chalk.red(`Comparison failed: ${error.message}`));
            throw error;
        }
    }

    // Score iteration quality based on visual changes
    scoreIteration(metrics) {
        const score = {
            hasChanges: metrics.percentDiff > 1,
            isMeaningful: metrics.percentDiff > 5 && metrics.percentDiff < 50,
            isBreaking: metrics.percentDiff > 90,
            quality: 0,
            rating: '',
            recommendation: ''
        };
        
        if (score.isBreaking) {
            score.quality = 0;
            score.rating = '💔 Breaking';
            score.recommendation = 'Too many changes - likely broke something';
        } else if (score.isMeaningful) {
            score.quality = 0.8;
            score.rating = '⭐ Excellent';
            score.recommendation = 'Meaningful visual improvements detected';
        } else if (score.hasChanges) {
            score.quality = 0.5;
            score.rating = '✓ Moderate';
            score.recommendation = 'Some changes visible but may be subtle';
        } else {
            score.quality = 0.1;
            score.rating = '⚠️ Minimal';
            score.recommendation = 'No significant visual changes detected';
        }
        
        return score;
    }

    // Compare all screenshots for an iteration
    async compareIteration(taskId, iteration) {
        const taskFolder = path.join(__dirname, this.config.config.tasks.folder, taskId);
        const beforeFolder = path.join(taskFolder, 'before');
        const iterFolder = path.join(taskFolder, 'iterations', `iteration_${iteration}`);
        const diffFolder = path.join(iterFolder, 'diffs');
        
        // Create diffs folder
        if (!fs.existsSync(diffFolder)) {
            fs.mkdirSync(diffFolder, { recursive: true });
        }
        
        console.log(`\n📊 Comparing Iteration ${iteration} Screenshots:\n`);
        
        // Find all capture screenshots
        const beforeFiles = fs.readdirSync(beforeFolder)
            .filter(f => f.startsWith('capture_') && f.endsWith('.png'))
            .sort();
        
        const comparisons = [];
        
        for (const file of beforeFiles) {
            const beforePath = path.join(beforeFolder, file);
            const afterPath = path.join(iterFolder, file);
            
            if (!fs.existsSync(afterPath)) {
                console.log(chalk.yellow(`   ⚠️ ${file}: No matching 'after' screenshot`));
                continue;
            }
            
            const diffPath = path.join(diffFolder, `diff_${file}`);
            
            const metrics = await this.compareScreenshots(beforePath, afterPath, diffPath);
            const score = this.scoreIteration(metrics);
            
            console.log(`   ${file}:`);
            console.log(`   ├─ Changed pixels: ${metrics.numDiffPixels.toLocaleString()}`);
            console.log(`   ├─ Percent changed: ${metrics.percentDiff.toFixed(2)}%`);
            console.log(`   ├─ Quality score: ${score.quality.toFixed(2)}`);
            console.log(`   ├─ Rating: ${score.rating}`);
            console.log(`   └─ Diff saved: ${path.relative(__dirname, diffPath)}\n`);
            
            comparisons.push({
                file,
                metrics,
                score
            });
        }
        
        // Calculate overall iteration score
        const avgQuality = comparisons.reduce((sum, c) => sum + c.score.quality, 0) / comparisons.length;
        const totalChange = comparisons.reduce((sum, c) => sum + c.metrics.percentDiff, 0) / comparisons.length;
        
        const iterationScore = {
            avgQuality,
            totalChange,
            comparisons,
            timestamp: new Date().toISOString()
        };
        
        // Save metrics
        fs.writeFileSync(
            path.join(iterFolder, 'visual-metrics.json'),
            JSON.stringify(iterationScore, null, 2)
        );
        
        console.log(chalk.bold(`📈 Overall Iteration ${iteration} Score:`));
        console.log(`   Average Quality: ${avgQuality.toFixed(2)}`);
        console.log(`   Average Change: ${totalChange.toFixed(2)}%`);
        console.log(`   Metrics saved: ${path.relative(__dirname, path.join(iterFolder, 'visual-metrics.json'))}\n`);
        
        return iterationScore;
    }
}

// CLI Interface
const command = process.argv[2];
const manager = new ImprovementManager();

switch (command) {
    case 'create':
        {
            const name = process.argv[3];
            const description = process.argv[4];
            const target = process.argv[5] || 'general';
            
            if (!name) {
                console.log('\nUsage: node improvement-manager.js create <name> <description> [target]\n');
                console.log('Example:');
                console.log('  node improvement-manager.js create "Better Buildings" "Improve building variety" buildings\n');
                process.exit(1);
            }
            
            manager.createTask(name, description, target);
        }
        break;

    case 'check-inspo':
        manager.checkInspiration();
        break;

    case 'fetch-inspo':
        await manager.fetchInspiration();
        break;

    case 'capture':
        {
            const taskId = process.argv[3];
            const count = parseInt(process.argv[4]) || 5;
            
            if (!taskId) {
                console.log('\nUsage: node improvement-manager.js capture <task-id> [count]\n');
                manager.listTasks();
                process.exit(1);
            }
            
            await manager.captureScreenshots(taskId, count);
        }
        break;

    case 'note':
        {
            const taskId = process.argv[3];
            const iteration = parseInt(process.argv[4]);
            const note = process.argv[5];
            
            if (!taskId || !iteration || !note) {
                console.log('\nUsage: node improvement-manager.js note <task-id> <iteration> "<note>"\n');
                manager.listTasks();
                process.exit(1);
            }
            
            manager.addIterationNote(taskId, iteration, note);
        }
        break;

    case 'complete':
        {
            const taskId = process.argv[3];
            const finalNotes = process.argv[4] || '';
            
            if (!taskId) {
                console.log('\nUsage: node improvement-manager.js complete <task-id> ["final notes"]\n');
                manager.listTasks();
                process.exit(1);
            }
            
            manager.completeTask(taskId, finalNotes);
        }
        break;

    case 'list':
        manager.listTasks();
        break;

    case 'compare':
        {
            const taskId = process.argv[3];
            const iteration = parseInt(process.argv[4]);
            
            if (!taskId || !iteration) {
                console.log('\nUsage: node improvement-manager.js compare <task-id> <iteration>\n');
                console.log('Example:');
                console.log('  node improvement-manager.js compare task_1234567890 1\n');
                process.exit(1);
            }
            
            manager.compareIteration(taskId, iteration)
                .then(() => process.exit(0))
                .catch(err => {
                    console.error(chalk.red(`\n❌ Comparison failed: ${err.message}\n`));
                    process.exit(1);
                });
        }
        break;

    default:
        console.log(`
Procedural Generation Improvement Manager

Usage:
  node improvement-manager.js <command> [options]

Commands:
  create <name> <description> [target]   Create new improvement task
  check-inspo                            Check inspiration image count
  fetch-inspo                            Generate guide for fetching inspiration
  capture <task-id> [count]              Capture game screenshots for task
  compare <task-id> <iteration>          Compare iteration screenshots with baseline
  note <task-id> <iteration> "<note>"    Add iteration note to task
  complete <task-id> ["notes"]           Mark task as complete
  list                                   List all tasks

Examples:
  node improvement-manager.js create "Better Buildings" "More variety" buildings
  node improvement-manager.js check-inspo
  node improvement-manager.js fetch-inspo
  node improvement-manager.js capture task_1234567890 10
  node improvement-manager.js compare task_1234567890 1
  node improvement-manager.js note task_1234567890 1 "Added window variety"
  node improvement-manager.js complete task_1234567890 "Buildings look great!"
  node improvement-manager.js list

Workflow:
  1. Check inspiration: check-inspo
  2. Fetch if needed: fetch-inspo (AI agent task)
  3. Create task: create "Task Name" "Description" target
  4. Capture before: capture <task-id>
  5. Make code changes
  6. Capture iteration screenshots
  7. Compare: compare <task-id> <iteration>  ⭐ NEW!
  8. Add notes: note <task-id> <iteration> "What changed"
  9. Repeat steps 5-8
  10. Complete: complete <task-id> "Final notes"
`);
        break;
}
