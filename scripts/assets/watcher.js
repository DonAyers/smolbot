/**
 * Asset Watcher Service
 * 
 * Monitors staging folders for new assets and automatically processes them:
 * - Unzips any .zip files
 * - Runs organize-assets on the extracted contents
 * - Provides real-time feedback via console
 * 
 * Usage: npm run watch-assets
 */

import chokidar from 'chokidar';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Staging folders to watch
const WATCH_FOLDERS = [
    path.join(projectRoot, 'to-be-processed-assets'),
    path.join(projectRoot, 'asset-sources')
];

// State tracking
const processedFiles = new Set();
const processing = new Map(); // Track files currently being processed

class AssetWatcher {
    constructor() {
        this.watcher = null;
        this.isProcessing = false;
    }

    start() {
        console.log('');
        console.log('🔍 Asset Watcher Service');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('📂 Watching folders:');
        
        // Create folders if they don't exist
        WATCH_FOLDERS.forEach(folder => {
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
                console.log(`   ✅ Created: ${path.basename(folder)}/`);
            } else {
                console.log(`   👁️  ${path.basename(folder)}/`);
            }
        });
        
        console.log('');
        console.log('💡 Tips:');
        console.log('   • Drop .zip files → auto-unzips & organizes');
        console.log('   • Drop loose files → auto-organizes');
        console.log('   • Add entire folders → auto-organizes');
        console.log('');
        console.log('🎯 Waiting for assets... (Ctrl+C to stop)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');

        // Watch for changes
        this.watcher = chokidar.watch(WATCH_FOLDERS, {
            ignored: [
                /(^|[\/\\])\../, // hidden files
                /README\.md$/,
                /node_modules/,
                /\.git/
            ],
            persistent: true,
            ignoreInitial: false, // Process existing files
            awaitWriteFinish: {
                stabilityThreshold: 2000, // Wait 2s after file stops changing
                pollInterval: 100
            }
        });

        this.watcher
            .on('add', filePath => this.handleNewFile(filePath))
            .on('error', error => console.error(`❌ Watcher error: ${error}`))
            .on('ready', () => {
                console.log('✅ Watcher ready\n');
            });
    }

    async handleNewFile(filePath) {
        const fileName = path.basename(filePath);
        const ext = path.extname(filePath).toLowerCase();
        
        // Skip if already processed or currently processing
        if (processedFiles.has(filePath) || processing.has(filePath)) {
            return;
        }

        // Mark as processing
        processing.set(filePath, true);

        console.log(`\n📥 Detected: ${fileName}`);

        try {
            if (ext === '.zip') {
                await this.handleZipFile(filePath);
            } else if (this.isImageOrAudio(ext)) {
                // Individual asset file detected
                console.log(`   → Image/audio file detected`);
                // Don't process immediately - wait for more files or user trigger
                console.log(`   → Waiting for more files... (run 'npm run organize-assets' to process now)`);
            } else {
                console.log(`   → Skipping non-asset file`);
            }

            // Mark as processed
            processedFiles.add(filePath);
        } catch (error) {
            console.error(`❌ Error processing ${fileName}:`, error.message);
        } finally {
            processing.delete(filePath);
        }
    }

    async handleZipFile(zipPath) {
        const fileName = path.basename(zipPath);
        const extractFolder = path.join(path.dirname(zipPath), path.basename(zipPath, '.zip'));

        console.log(`   → Unzipping...`);

        try {
            // Unzip
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(extractFolder, true);
            
            const entries = zip.getEntries();
            console.log(`   ✅ Extracted ${entries.length} files to ${path.basename(extractFolder)}/`);

            // Optional: Delete zip after extraction
            const keepZip = process.env.KEEP_ZIP_FILES === 'true';
            if (!keepZip) {
                fs.unlinkSync(zipPath);
                console.log(`   🗑️  Deleted original zip file`);
            }

            // Wait a moment for file system to settle
            await this.delay(1000);

            // Auto-organize the extracted contents
            console.log(`   → Auto-organizing assets...`);
            await this.runOrganizer(extractFolder);

        } catch (error) {
            console.error(`   ❌ Failed to unzip: ${error.message}`);
        }
    }

    async runOrganizer(sourceFolder) {
        return new Promise((resolve, reject) => {
            console.log(`\n🔄 Running asset organizer...`);
            
            const organizerPath = path.join(__dirname, 'organize.js');
            const organizer = spawn('node', [organizerPath, sourceFolder], {
                stdio: 'inherit',
                shell: true
            });

            organizer.on('close', (code) => {
                if (code === 0) {
                    console.log(`\n✅ Organization complete!`);
                    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                    console.log(`\n🎯 Waiting for more assets...\n`);
                    resolve();
                } else {
                    console.error(`\n❌ Organizer exited with code ${code}`);
                    reject(new Error(`Organizer failed with code ${code}`));
                }
            });

            organizer.on('error', (error) => {
                console.error(`\n❌ Failed to run organizer: ${error.message}`);
                reject(error);
            });
        });
    }

    isImageOrAudio(ext) {
        const assetExtensions = [
            '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
            '.mp3', '.wav', '.ogg', '.m4a',
            '.xml', '.json'
        ];
        return assetExtensions.includes(ext);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        if (this.watcher) {
            this.watcher.close();
            console.log('\n👋 Asset watcher stopped');
        }
    }
}

// Start watcher
const watcher = new AssetWatcher();
watcher.start();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down gracefully...');
    watcher.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    watcher.stop();
    process.exit(0);
});

// Keep alive
process.stdin.resume();
