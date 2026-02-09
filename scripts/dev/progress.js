#!/usr/bin/env node

/**
 * Progress Screenshot System
 * 
 * Captures the "best" screenshot of current game state and saves it to
 * the progress folder with timestamp for historical tracking.
 * Also updates README.md with the latest screenshot.
 * 
 * Usage:
 *   npm run save-progress
 *   npm run save-progress -- "Added flying enemies"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

class ProgressTracker {
    constructor() {
        this.projectRoot = projectRoot;
        this.progressDir = path.join(projectRoot, 'progress');
        this.tmpDir = path.join(projectRoot, 'tmp/screenshots');
        this.readmePath = path.join(projectRoot, 'README.md');
    }

    /**
     * Capture and save progress screenshot
     */
    async saveProgress(note = '') {
        console.log('📸 Capturing progress screenshot...\n');

        // Ensure progress directory exists
        if (!fs.existsSync(this.progressDir)) {
            fs.mkdirSync(this.progressDir, { recursive: true });
        }

        // 1. Start dev server
        console.log('🚀 Starting dev server...');
        await this.startDevServer();

        // 2. Capture screenshot
        console.log('📷 Capturing game screenshot...');
        const screenshot = await this.captureScreenshot();

        if (!screenshot) {
            console.log('❌ Failed to capture screenshot');
            await this.stopDevServer();
            return false;
        }

        // 3. Save to progress folder
        const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const filename = `progress-${timestamp}.png`;
        const destPath = path.join(this.progressDir, filename);

        fs.copyFileSync(screenshot, destPath);
        console.log(`✅ Saved: progress/${filename}\n`);

        // 4. Update latest.png symlink/copy
        const latestPath = path.join(this.progressDir, 'latest.png');
        if (fs.existsSync(latestPath)) {
            fs.unlinkSync(latestPath);
        }
        fs.copyFileSync(screenshot, latestPath);

        // 5. Update metadata
        this.updateMetadata(filename, note);

        // 6. Update README
        this.updateReadme();

        // 7. Stop server
        await this.stopDevServer();

        console.log('✨ Progress saved successfully!\n');
        console.log('💡 Commit with: git add progress/ README.md && git commit -m "docs: Update progress screenshot"\n');

        return true;
    }

    /**
     * Start dev server
     */
    async startDevServer() {
        return new Promise((resolve) => {
            this.serverProcess = spawn('npm', ['run', 'dev'], {
                cwd: this.projectRoot,
                detached: true,
                stdio: 'ignore'
            });

            // Wait for server to be ready
            setTimeout(resolve, 5000);
        });
    }

    /**
     * Stop dev server
     */
    async stopDevServer() {
        if (this.serverProcess) {
            process.kill(-this.serverProcess.pid);
        }
    }

    /**
     * Capture screenshot using test runner
     */
    async captureScreenshot() {
        return new Promise((resolve) => {
            // Create minimal test config for screenshot
            const testConfig = {
                name: 'Progress Screenshot',
                actions: [
                    { action: 'wait', seconds: 3 },
                    { action: 'screenshot', name: 'progress', saveState: false }
                ]
            };

            const testPath = path.join(this.tmpDir, 'progress-test.json');
            if (!fs.existsSync(this.tmpDir)) {
                fs.mkdirSync(this.tmpDir, { recursive: true });
            }
            fs.writeFileSync(testPath, JSON.stringify(testConfig, null, 2));

            // Run test
            const proc = spawn('node', [
                path.join(projectRoot, 'scripts/agents/runner.js'),
                testPath
            ], {
                cwd: this.projectRoot
            });

            proc.on('close', () => {
                // Find latest progress screenshot
                const files = fs.readdirSync(this.tmpDir)
                    .filter(f => f.startsWith('progress_'))
                    .sort()
                    .reverse();

                if (files.length > 0) {
                    resolve(path.join(this.tmpDir, files[0]));
                } else {
                    resolve(null);
                }
            });

            proc.on('error', () => resolve(null));
        });
    }

    /**
     * Update progress metadata
     */
    updateMetadata(filename, note) {
        const metadataPath = path.join(this.progressDir, 'history.json');
        let metadata = [];

        if (fs.existsSync(metadataPath)) {
            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        }

        metadata.push({
            date: new Date().toISOString(),
            filename,
            note: note || 'Progress update',
            commit: this.getCurrentCommit()
        });

        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    }

    /**
     * Get current git commit
     */
    getCurrentCommit() {
        try {
            const { execSync } = require('child_process');
            return execSync('git rev-parse --short HEAD', {
                cwd: this.projectRoot,
                encoding: 'utf8'
            }).trim();
        } catch {
            return 'unknown';
        }
    }

    /**
     * Update README with latest screenshot
     */
    updateReadme() {
        if (!fs.existsSync(this.readmePath)) return;

        let readme = fs.readFileSync(this.readmePath, 'utf8');

        // Create progress section if doesn't exist
        if (!readme.includes('## Progress')) {
            readme += '\n\n## Progress\n\n![Latest Screenshot](progress/latest.png)\n\n*Latest development screenshot - see [progress/history.json](progress/history.json) for full history*\n';
        } else {
            // Update existing section
            readme = readme.replace(
                /!\[Latest Screenshot\]\(progress\/[^\)]+\)/,
                '![Latest Screenshot](progress/latest.png)'
            );
        }

        fs.writeFileSync(this.readmePath, readme);
        console.log('✅ Updated README.md\n');
    }

    /**
     * List progress history
     */
    listProgress() {
        const metadataPath = path.join(this.progressDir, 'history.json');
        
        if (!fs.existsSync(metadataPath)) {
            console.log('📁 No progress history yet. Run `npm run save-progress` to start tracking!\n');
            return;
        }

        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        
        console.log('📸 Progress History:\n');
        metadata.reverse().forEach((entry, i) => {
            const date = new Date(entry.date).toLocaleDateString();
            console.log(`${metadata.length - i}. ${date} - ${entry.note}`);
            console.log(`   📷 ${entry.filename}`);
            console.log(`   🔗 Commit: ${entry.commit}\n`);
        });
    }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    const command = args[0];

    const tracker = new ProgressTracker();

    if (command === 'list') {
        tracker.listProgress();
    } else {
        const note = args.join(' ') || 'Progress update';
        tracker.saveProgress(note).then(success => {
            process.exit(success ? 0 : 1);
        });
    }
}

export default ProgressTracker;
