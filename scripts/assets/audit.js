#!/usr/bin/env node

/**
 * Asset Audit System
 * 
 * Scans the codebase to find which assets are actually referenced,
 * compares with committed assets, and reports unused files.
 * 
 * Usage:
 *   npm run audit-assets           # Report unused assets
 *   npm run audit-assets --clean   # Remove unused assets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

class AssetAuditor {
    constructor() {
        this.projectRoot = projectRoot;
        this.assetsDir = path.join(projectRoot, 'public/assets');
        this.srcDir = path.join(projectRoot, 'src');
        this.referencedAssets = new Set();
        this.committedAssets = new Set();
    }

    /**
     * Main audit process
     */
    async audit(options = {}) {
        console.log('🔍 Asset Audit Starting...\n');

        // 1. Find all committed assets
        this.findCommittedAssets();
        console.log(`✅ Found ${this.committedAssets.size} committed assets\n`);

        // 2. Find all referenced assets in code
        this.findReferencedAssets();
        console.log(`✅ Found ${this.referencedAssets.size} referenced assets\n`);

        // 3. Find unused assets
        const unused = this.findUnusedAssets();
        
        if (unused.length === 0) {
            console.log('✅ All committed assets are being used!\n');
            return { success: true, unused: [] };
        }

        // 4. Report unused assets
        console.log(`⚠️  Found ${unused.length} UNUSED assets:\n`);
        
        const byCategory = this.categorizeUnused(unused);
        for (const [category, files] of Object.entries(byCategory)) {
            console.log(`\n📁 ${category} (${files.length}):`);
            files.slice(0, 10).forEach(file => {
                console.log(`   - ${file}`);
            });
            if (files.length > 10) {
                console.log(`   ... and ${files.length - 10} more`);
            }
        }

        // 5. Calculate size savings
        const totalSize = this.calculateUnusedSize(unused);
        console.log(`\n💾 Total wasted space: ${this.formatBytes(totalSize)}\n`);

        // 6. Clean if requested
        if (options.clean) {
            this.cleanUnusedAssets(unused);
        } else {
            console.log('💡 Run with --clean to remove unused assets\n');
        }

        return { success: true, unused, totalSize };
    }

    /**
     * Find all assets committed to git
     */
    findCommittedAssets() {
        try {
            const output = execSync('git ls-files public/assets/', {
                cwd: this.projectRoot,
                encoding: 'utf8'
            });

            const files = output.split('\n').filter(Boolean);
            files.forEach(file => {
                // Store relative to public/assets/
                const relative = file.replace('public/assets/', '');
                this.committedAssets.add(relative);
            });
        } catch (error) {
            console.error('❌ Error reading git files:', error.message);
        }
    }

    /**
     * Find all assets referenced in source code
     */
    findReferencedAssets() {
        // Patterns to search for asset loading
        const patterns = [
            /this\.load\.image\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/g,
            /this\.load\.spritesheet\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/g,
            /this\.load\.atlas\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/g,
            /this\.load\.atlasXML\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/g,
            /this\.load\.audio\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/g,
        ];

        // Scan all JS files
        this.scanDirectory(this.srcDir, '.js', (filePath, content) => {
            patterns.forEach(pattern => {
                let match;
                while ((match = pattern.exec(content)) !== null) {
                    // match[2] is the asset path
                    const assetPath = match[2];
                    // Normalize path (remove 'assets/' prefix if present)
                    const normalized = assetPath
                        .replace(/^assets\//, '')
                        .replace(/^\//, '');
                    this.referencedAssets.add(normalized);
                }
            });
        });
    }

    /**
     * Scan directory recursively
     */
    scanDirectory(dir, ext, callback) {
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                this.scanDirectory(filePath, ext, callback);
            } else if (file.endsWith(ext)) {
                const content = fs.readFileSync(filePath, 'utf8');
                callback(filePath, content);
            }
        });
    }

    /**
     * Find unused assets
     */
    findUnusedAssets() {
        const unused = [];

        for (const asset of this.committedAssets) {
            // Skip directories and non-asset files
            if (!this.isAssetFile(asset)) continue;

            // Check if asset or any variant is referenced
            if (!this.isReferenced(asset)) {
                unused.push(asset);
            }
        }

        return unused;
    }

    /**
     * Check if file is an asset (not metadata)
     */
    isAssetFile(file) {
        const ext = path.extname(file).toLowerCase();
        const assetExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp3', '.wav', '.ogg'];
        return assetExts.includes(ext);
    }

    /**
     * Check if asset is referenced
     */
    isReferenced(asset) {
        // Check exact match
        if (this.referencedAssets.has(asset)) return true;

        // Check without extension (sprite frames)
        const withoutExt = asset.replace(/\.\w+$/, '');
        if (this.referencedAssets.has(withoutExt)) return true;

        // Check parent path (for atlases loading directory)
        const parts = asset.split('/');
        for (let i = 1; i < parts.length; i++) {
            const partialPath = parts.slice(i).join('/');
            if (this.referencedAssets.has(partialPath)) return true;
        }

        return false;
    }

    /**
     * Categorize unused assets
     */
    categorizeUnused(unused) {
        const categories = {};

        unused.forEach(asset => {
            const parts = asset.split('/');
            const category = parts[0] || 'root';
            
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(asset);
        });

        return categories;
    }

    /**
     * Calculate total size of unused assets
     */
    calculateUnusedSize(unused) {
        let total = 0;

        unused.forEach(asset => {
            const fullPath = path.join(this.assetsDir, asset);
            if (fs.existsSync(fullPath)) {
                const stats = fs.statSync(fullPath);
                total += stats.size;
            }
        });

        return total;
    }

    /**
     * Format bytes to human readable
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Clean unused assets
     */
    cleanUnusedAssets(unused) {
        console.log('\n🧹 Cleaning unused assets...\n');

        let removed = 0;
        unused.forEach(asset => {
            const fullPath = path.join(this.assetsDir, asset);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                console.log(`   ❌ Removed: ${asset}`);
                removed++;
            }
        });

        console.log(`\n✅ Removed ${removed} unused assets\n`);
        console.log('💡 Run `git add -u` to stage deletions\n');
    }

    /**
     * Generate report
     */
    generateReport(results) {
        const reportPath = path.join(this.projectRoot, 'asset-audit-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
        console.log(`📄 Report saved: ${reportPath}\n`);
    }
}

// CLI Interface
const isMain = import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || 
               process.argv[1].endsWith('audit.js');

if (isMain) {
    const args = process.argv.slice(2);
    const clean = args.includes('--clean');

    const auditor = new AssetAuditor();
    auditor.audit({ clean }).then(results => {
        auditor.generateReport(results);
        process.exit(results.success ? 0 : 1);
    }).catch(err => {
        console.error('❌ Error:', err.message);
        process.exit(1);
    });
}

export default AssetAuditor;
