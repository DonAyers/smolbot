import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AgentTestRunner {
    constructor(testFilePath) {
        this.testFilePath = testFilePath;
        this.browser = null;
        this.page = null;
        this.viteProcess = null;
        this.baseURL = 'http://localhost:3000';
        this.screenshotDir = path.join(__dirname, 'tmp', 'screenshots');
        this.consoleLogs = [];
    }

    async startViteServer() {
        console.log('🚀 Starting Vite dev server...');
        
        return new Promise((resolve, reject) => {
            this.viteProcess = spawn('npm', ['run', 'dev'], {
                shell: true,
                stdio: 'pipe'
            });

            let output = '';
            let resolved = false;
            
            this.viteProcess.stdout.on('data', (data) => {
                const chunk = data.toString();
                output += chunk;
                console.log('[Vite]', chunk.trim());
                
                // Check for various Vite ready indicators
                if (!resolved && (
                    output.includes('Local:') || 
                    output.includes('localhost:3000') ||
                    output.includes('ready in')
                )) {
                    resolved = true;
                    console.log('✅ Vite server started');
                    setTimeout(resolve, 2000); // Give it a moment to fully initialize
                }
            });

            this.viteProcess.stderr.on('data', (data) => {
                console.error('[Vite error]', data.toString());
            });

            this.viteProcess.on('error', (err) => {
                if (!resolved) reject(err);
            });
            
            // Timeout after 30 seconds
            setTimeout(() => {
                if (!resolved) {
                    reject(new Error('Vite server start timeout'));
                }
            }, 30000);
        });
    }

    async stopViteServer() {
        if (this.viteProcess) {
            console.log('🛑 Stopping Vite server...');
            this.viteProcess.kill();
            this.viteProcess = null;
        }
    }

    async initBrowser() {
        console.log('🌐 Launching browser...');
        this.browser = await chromium.launch({ headless: true });
        this.page = await this.browser.newPage();
        
        // Capture console logs
        this.page.on('console', msg => {
            const logEntry = {
                type: msg.type(),
                text: msg.text(),
                timestamp: Date.now()
            };
            this.consoleLogs.push(logEntry);
            console.log(`[Browser ${msg.type()}]`, msg.text());
        });

        // Capture page errors
        this.page.on('pageerror', error => {
            console.error('[Browser Error]', error.message);
            this.consoleLogs.push({
                type: 'error',
                text: error.message,
                timestamp: Date.now()
            });
        });

        await this.page.goto(this.baseURL);
        console.log('✅ Browser initialized and game loaded');
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }

    async executeAction(action) {
        const { action: actionType, ...params } = action;

        switch (actionType) {
            case 'press_key':
                await this.pressKey(params.key, params.duration);
                break;
            
            case 'wait':
                await this.wait(params.ms || params.seconds * 1000);
                break;
            
            case 'screenshot':
                await this.takeScreenshot(params.name, params.saveState);
                break;
            
            case 'assert':
                await this.assertCondition(params);
                break;
            
            case 'check_canvas':
                await this.checkCanvas();
                break;
            
            case 'execute_js':
                await this.executeJS(params.code);
                break;
            
            default:
                console.warn(`⚠️ Unknown action type: ${actionType}`);
        }
    }

    async pressKey(key, duration = 100) {
        console.log(`⌨️ Pressing key: ${key}`);
        await this.page.keyboard.down(key);
        await this.wait(duration);
        await this.page.keyboard.up(key);
    }

    async wait(ms) {
        console.log(`⏳ Waiting ${ms}ms...`);
        await this.page.waitForTimeout(ms);
    }

    async takeScreenshot(name, saveState = true) {
        const timestamp = Date.now();
        const filename = `${name}_${timestamp}.png`;
        const filepath = path.join(this.screenshotDir, filename);
        
        console.log(`📸 Taking screenshot: ${filename}`);
        await this.page.screenshot({ path: filepath, fullPage: false });
        
        if (saveState) {
            await this.saveGameState(name, timestamp);
        }
        
        return filepath;
    }

    async saveGameState(name, timestamp) {
        const state = await this.getGameState();
        const stateFilename = `${name}_${timestamp}.txt`;
        const stateFilepath = path.join(this.screenshotDir, stateFilename);
        
        const stateText = [
            `Game State Snapshot: ${name}`,
            `Timestamp: ${new Date(timestamp).toISOString()}`,
            ``,
            `=== GAME STATE ===`,
            JSON.stringify(state, null, 2),
            ``,
            `=== CONSOLE LOGS (Last 10) ===`,
            ...this.consoleLogs.slice(-10).map(log => 
                `[${log.type}] ${log.text}`
            )
        ].join('\n');
        
        fs.writeFileSync(stateFilepath, stateText);
        console.log(`💾 Saved game state: ${stateFilename}`);
    }

    async getGameState() {
        return await this.page.evaluate(() => {
            if (window.__GAME_STATE__) {
                return window.__GAME_STATE__.getGameState();
            }
            return { error: 'Game state not available' };
        });
    }

    async checkCanvas() {
        console.log('🎮 Checking if game canvas exists...');
        const canvasExists = await this.page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            return canvas !== null;
        });
        
        if (canvasExists) {
            console.log('✅ Canvas found!');
        } else {
            throw new Error('❌ Canvas not found!');
        }
        
        return canvasExists;
    }

    async assertCondition(params) {
        const { type, value, operator = 'equals' } = params;
        
        console.log(`🔍 Asserting: ${type} ${operator} ${value}`);
        
        const state = await this.getGameState();
        let actualValue;
        
        switch (type) {
            case 'sprite_x':
            case 'player_x':
                actualValue = state.player?.x;
                break;
            case 'sprite_y':
            case 'player_y':
                actualValue = state.player?.y;
                break;
            case 'scene':
                actualValue = state.activeScene;
                break;
            default:
                throw new Error(`Unknown assertion type: ${type}`);
        }
        
        let passed = false;
        switch (operator) {
            case 'equals':
                passed = actualValue === value;
                break;
            case 'greater_than':
                passed = actualValue > value;
                break;
            case 'less_than':
                passed = actualValue < value;
                break;
            case 'not_null':
                passed = actualValue != null;
                break;
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
        
        if (passed) {
            console.log(`✅ Assertion passed: ${actualValue} ${operator} ${value}`);
        } else {
            throw new Error(`❌ Assertion failed: ${actualValue} ${operator} ${value}`);
        }
    }

    async executeJS(code) {
        console.log(`🔧 Executing JS: ${code.substring(0, 50)}...`);
        return await this.page.evaluate((code) => {
            return eval(code);
        }, code);
    }

    async runTest() {
        const testFile = fs.readFileSync(this.testFilePath, 'utf-8');
        const testData = JSON.parse(testFile);
        
        console.log(`\n📋 Running test: ${testData.name || 'Unnamed Test'}`);
        if (testData.description) {
            console.log(`📝 Description: ${testData.description}`);
        }
        console.log('');

        try {
            await this.startViteServer();
            await this.initBrowser();
            
            for (let i = 0; i < testData.actions.length; i++) {
                const action = testData.actions[i];
                console.log(`\n[${i + 1}/${testData.actions.length}] Executing action:`, action.action);
                await this.executeAction(action);
            }
            
            console.log('\n✅ Test completed successfully!\n');
            return { success: true };
            
        } catch (error) {
            console.error('\n❌ Test failed:', error.message);
            
            // Take error screenshot
            try {
                await this.takeScreenshot('error', true);
            } catch (e) {
                console.error('Failed to capture error screenshot:', e.message);
            }
            
            return { success: false, error: error.message };
            
        } finally {
            await this.closeBrowser();
            await this.stopViteServer();
        }
    }
}

// Main execution
const testFile = process.argv[2];

if (!testFile) {
    console.error('Usage: node agent-runner.js <test-file.json>');
    process.exit(1);
}

const runner = new AgentTestRunner(testFile);
runner.runTest().then(result => {
    process.exit(result.success ? 0 : 1);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
