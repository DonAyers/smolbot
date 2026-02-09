/**
 * Asset Organizer - Automatically organizes game assets into proper folders
 * 
 * Usage: node organize-assets.js <source-folder>
 * Example: node organize-assets.js "kenney_new-pack"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target directory structure
const ASSET_DIRS = {
    backgrounds: 'public/assets/images/backgrounds',
    buildings: 'public/assets/images/buildings',
    characters: 'public/assets/images/characters',
    enemies: 'public/assets/images/enemies',
    environment: 'public/assets/images/environment',
    props: 'public/assets/images/props',
    tiles: 'public/assets/images/tiles',
    ui: 'public/assets/images/ui',
    spritesheets: 'public/assets/spritesheets',
    audio: 'public/assets/audio'
};

// Classification rules based on file name patterns
const CLASSIFICATION_RULES = {
    backgrounds: [
        /background/i, /bg_/i, /cloud/i, /hill/i, /sky/i, /mountain/i,
        /moon/i, /sun/i, /star/i, /castle_/i, /tower_/i, /temple/i, /piramid/i
    ],
    buildings: [
        /house/i, /building/i, /roof/i, /window/i, /door/i, /chimney/i,
        /awning/i, /fence(?!_broken)/i, /brick/i, /wall(?!.*\d)/i
    ],
    characters: [
        /robot_(?!.*pack)/i, /player/i, /character/i, /hero/i,
        /idle/i, /walk/i, /jump/i, /run/i, /damage/i, /hurt/i, /drive/i
    ],
    enemies: [
        /enemy/i, /monster/i, /alien/i, /hostile/i, /mob/i
    ],
    environment: [
        /tree/i, /bush/i, /rock/i, /stone/i, /plant/i, /flower/i, /grass(?!Half)/i,
        /GREEN_\d+/i, /ORANGE_\d+/i, /BUSH_\d+/i, /Pine_/i, /Rock_\d+/i,
        /fence_broken/i
    ],
    props: [
        /barrel/i, /baril/i, /crate/i, /box/i, /pipe/i, /lamp/i, /light/i,
        /machine/i, /device/i, /computer/i, /screen/i, /desk/i, /chair/i,
        /locker/i, /bed/i, /ladder/i, /pillar/i, /door(?!Knob|Open|Top)/i,
        /neon/i, /sign/i
    ],
    tiles: [
        /tile/i, /terrain/i, /platform/i, /ground/i, /slice\d+/i,
        /Half(?:Left|Mid|Right)?/i, /grass(?:Half)/i, /dirt/i, /metal/i,
        /snow/i, /sand/i, /castle(?:Half)/i, /cake/i, /choco/i
    ],
    ui: [
        /button/i, /menu/i, /panel/i, /hud/i, /icon/i, /cursor/i,
        /bar/i, /health/i, /ui/i, /interface/i
    ],
    spritesheets: [
        /spritesheet/i, /atlas/i, /tilemap/i, /\.xml$/i
    ],
    audio: [
        /\.mp3$/i, /\.wav$/i, /\.ogg$/i, /\.m4a$/i
    ]
};

// Files to skip
const SKIP_PATTERNS = [
    /^preview/i, /^sample/i, /^license/i, /^readme/i,
    /\.txt$/i, /\.md$/i, /\.zip$/i, /\.DS_Store$/i, /Thumbs\.db$/i
];

class AssetOrganizer {
    constructor(sourceFolder) {
        this.sourceFolder = path.resolve(sourceFolder);
        this.stats = {
            scanned: 0,
            copied: 0,
            skipped: 0,
            errors: 0,
            byCategory: {}
        };
        this.fileManifest = [];
    }

    // Classify a file based on its name and path
    classifyFile(filePath, fileName) {
        // Skip certain files
        if (SKIP_PATTERNS.some(pattern => pattern.test(fileName))) {
            return 'skip';
        }

        // Check each category's rules
        for (const [category, patterns] of Object.entries(CLASSIFICATION_RULES)) {
            if (patterns.some(pattern => pattern.test(fileName) || pattern.test(filePath))) {
                return category;
            }
        }

        // Check file extension for audio
        const ext = path.extname(fileName).toLowerCase();
        if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
            return 'audio';
        }

        // Check for XML files (likely spritesheets)
        if (ext === '.xml') {
            return 'spritesheets';
        }

        // Default: check if it's an image
        if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
            return 'unclassified';
        }

        return 'skip';
    }

    // Scan directory recursively
    async scanDirectory(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                await this.scanDirectory(fullPath);
            } else if (entry.isFile()) {
                this.stats.scanned++;
                const relativePath = path.relative(this.sourceFolder, fullPath);
                const category = this.classifyFile(relativePath, entry.name);

                this.fileManifest.push({
                    originalPath: fullPath,
                    relativePath: relativePath,
                    fileName: entry.name,
                    category: category,
                    size: fs.statSync(fullPath).size
                });

                if (category === 'skip') {
                    this.stats.skipped++;
                } else {
                    this.stats.byCategory[category] = (this.stats.byCategory[category] || 0) + 1;
                }
            }
        }
    }

    // Copy file to target directory
    copyFile(sourceFile, targetCategory) {
        try {
            const targetDir = path.join(__dirname, ASSET_DIRS[targetCategory]);
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const fileName = path.basename(sourceFile);
            const targetPath = path.join(targetDir, fileName);

            // Check if file already exists
            if (fs.existsSync(targetPath)) {
                console.log(`  ⚠️  Skipping ${fileName} (already exists)`);
                return false;
            }

            fs.copyFileSync(sourceFile, targetPath);
            console.log(`  ✅ Copied ${fileName} → ${targetCategory}/`);
            return true;
        } catch (err) {
            console.error(`  ❌ Error copying ${sourceFile}:`, err.message);
            this.stats.errors++;
            return false;
        }
    }

    // Organize all files
    async organize(dryRun = false) {
        console.log(`\n🔍 Scanning assets in: ${this.sourceFolder}\n`);

        // Scan all files
        await this.scanDirectory(this.sourceFolder);

        console.log(`\n📊 Scan Complete:`);
        console.log(`   Total files: ${this.stats.scanned}`);
        console.log(`   Skipped: ${this.stats.skipped}`);
        console.log(`   To organize: ${this.stats.scanned - this.stats.skipped}\n`);

        // Show classification breakdown
        console.log(`📦 Classification Breakdown:`);
        for (const [category, count] of Object.entries(this.stats.byCategory)) {
            console.log(`   ${category}: ${count} files`);
        }

        // Show unclassified files
        const unclassified = this.fileManifest.filter(f => f.category === 'unclassified');
        if (unclassified.length > 0) {
            console.log(`\n⚠️  Unclassified files (need manual review):`);
            unclassified.forEach(f => {
                console.log(`   - ${f.relativePath}`);
            });
        }

        if (dryRun) {
            console.log(`\n🔍 DRY RUN - No files were copied`);
            console.log(`   Run without --dry-run to actually copy files\n`);
            return;
        }

        // Confirm before copying
        console.log(`\n❓ Proceed with copying files? (This is a simulation - answer 'y')`);
        console.log(`   Type 'y' to continue, any other key to cancel\n`);

        // Auto-proceed for this implementation
        console.log(`✨ Organizing files...\n`);

        // Copy files
        for (const file of this.fileManifest) {
            if (file.category !== 'skip' && file.category !== 'unclassified') {
                if (this.copyFile(file.originalPath, file.category)) {
                    this.stats.copied++;
                }
            }
        }

        // Generate manifest file
        this.generateManifest();

        // Print summary
        console.log(`\n✅ Organization Complete!`);
        console.log(`   Files copied: ${this.stats.copied}`);
        console.log(`   Errors: ${this.stats.errors}`);
        console.log(`   Manifest saved to: asset-manifest.json\n`);
    }

    // Generate manifest file
    generateManifest() {
        const manifest = {
            timestamp: new Date().toISOString(),
            sourceFolder: this.sourceFolder,
            stats: this.stats,
            files: this.fileManifest.map(f => ({
                original: f.relativePath,
                category: f.category,
                target: f.category !== 'skip' && f.category !== 'unclassified'
                    ? `${ASSET_DIRS[f.category]}/${f.fileName}`
                    : null
            }))
        };

        fs.writeFileSync(
            path.join(__dirname, 'asset-manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
    }
}

// CLI Interface
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const folderArgs = args.filter(arg => arg !== '--dry-run');
let sourceFolder = folderArgs[0];

// Default to staging folders if they exist and no folder specified
if (!sourceFolder) {
    const stagingFolders = ['to-be-processed-assets', 'asset-sources'];
    for (const folder of stagingFolders) {
        const folderPath = path.join(__dirname, folder);
        if (fs.existsSync(folderPath)) {
            const files = fs.readdirSync(folderPath);
            // Check if folder has files (excluding README and hidden files)
            if (files.length > 0 && !files.every(f => f === 'README.md' || f.startsWith('.'))) {
                sourceFolder = folderPath;
                console.log(`📂 Using default staging folder: ${folder}\n`);
                break;
            }
        }
    }
}

if (!sourceFolder) {
    console.log(`
Asset Organizer - Automatically organize game assets

Usage:
  node organize-assets.js [source-folder] [options]

Options:
  --dry-run    Preview changes without copying files

Default Staging Folders:
  If no folder is specified, will look for:
  • to-be-processed-assets/
  • asset-sources/
  
  Just drop your asset packs into either folder!

Examples:
  node organize-assets.js
  node organize-assets.js --dry-run
  node organize-assets.js "kenney_new-pack"
  node organize-assets.js "downloaded-assets" --dry-run

Workflow:
  1. Create a staging folder: mkdir to-be-processed-assets
  2. Extract/copy your asset pack there
  3. Run: npm run organize-assets:dry-run (preview)
  4. Run: npm run organize-assets (organize!)

This tool will:
  • Scan all files in the source folder
  • Classify them by type (backgrounds, characters, props, etc.)
  • Copy them to the appropriate organized folders
  • Generate a manifest file for reference

Note: Staging folder is currently empty or doesn't exist.
      Add some assets first!
`);
    process.exit(1);
}

if (!fs.existsSync(sourceFolder)) {
    console.error(`❌ Error: Folder not found: ${sourceFolder}`);
    process.exit(1);
}

// Run organizer
const organizer = new AssetOrganizer(sourceFolder);
organizer.organize(dryRun).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
