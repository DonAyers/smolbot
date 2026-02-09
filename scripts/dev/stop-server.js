import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function killDevServer() {
    try {
        if (process.platform === 'win32') {
            // Windows: Find and kill node processes running vite on port 3000
            const { stdout } = await execAsync('netstat -ano | findstr :3000');
            const lines = stdout.split('\n');
            const pids = new Set();
            
            lines.forEach(line => {
                const match = line.match(/LISTENING\s+(\d+)/);
                if (match) {
                    pids.add(match[1]);
                }
            });
            
            if (pids.size === 0) {
                console.log('✓ No dev server running on port 3000');
                return;
            }
            
            for (const pid of pids) {
                await execAsync(`taskkill /F /PID ${pid}`);
                console.log(`✓ Killed process ${pid}`);
            }
        } else {
            // Unix-like systems
            await execAsync('lsof -ti:3000 | xargs kill -9');
            console.log('✓ Dev server stopped');
        }
    } catch (error) {
        if (error.message.includes('No such process') || error.stderr?.includes('No such process')) {
            console.log('✓ No dev server running');
        } else {
            console.log('✓ Dev server stopped (or wasn\'t running)');
        }
    }
}

killDevServer();
