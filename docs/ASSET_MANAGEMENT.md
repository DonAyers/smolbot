# Asset Management & Progress Tracking Workflow

## Overview

This document describes the asset cleanup and progress tracking system for maintaining a lean, efficient repository.

## Asset Audit System

### Purpose
Prevents committing unused assets to reduce repository size and improve clone/download times.

### Usage

```bash
# Check for unused assets
npm run audit-assets

# Clean unused assets (removes files)
npm run audit-assets:clean

# Review report
cat asset-audit-report.json
```

### How It Works

1. **Scans Code**: Finds all asset references in `src/` directory
   - `this.load.image()`, `this.load.spritesheet()`, `this.load.atlas()`, etc.

2. **Scans Git**: Lists all assets committed to `public/assets/`

3. **Compares**: Identifies assets in git but not referenced in code

4. **Reports**: Shows unused assets by category with total wasted space

5. **Cleans** (with `--clean`): Removes unused assets from filesystem

### Example Output

```
🔍 Asset Audit Starting...

✅ Found 839 committed assets
✅ Found 107 referenced assets

⚠️  Found 740 UNUSED assets:

📁 images (711)
📁 spritesheets (19)
📁 audio (10)

💾 Total wasted space: 7.62 MB

💡 Run with --clean to remove unused assets
```

### When to Run

- **Before committing** new assets
- **Before releases** to keep repo lean
- **After refactoring** that changes asset usage
- **Monthly** as maintenance

### Workflow

```bash
# 1. Add new assets
cp my-assets/*.png public/assets/images/characters/

# 2. Use them in code
# (update BootScene.js, GameScene.js, etc.)

# 3. Test the game
npm run dev

# 4. Run audit before commit
npm run audit-assets

# 5. Clean any unused
npm run audit-assets:clean

# 6. Commit only what's used
git add public/assets/
git commit -m "feat: Add new character sprites"
```

## Progress Screenshot System

### Purpose
Tracks visual evolution of the game over time with historical screenshots committed to repository.

### Usage

```bash
# Capture current game state
npm run save-progress

# Capture with custom note
npm run save-progress -- "Added flying enemies"

# List progress history
npm run progress:list
```

### How It Works

1. **Starts dev server**: Launches game temporarily
2. **Captures screenshot**: Uses test runner to screenshot game
3. **Saves to progress/**: Stores with date-stamped filename
4. **Updates latest**: Copies to `progress/latest.png`
5. **Updates README**: Embeds latest screenshot
6. **Records metadata**: Saves to `progress/history.json`
7. **Stops server**: Cleans up

### Folder Structure

```
progress/
├── latest.png              # Always current (referenced in README)
├── progress-2026-02-09.png # Historical snapshots
├── progress-2026-02-10.png
├── progress-2026-02-15.png
└── history.json            # Full metadata
```

### Metadata Example

```json
[
  {
    "date": "2026-02-09T21:00:00.000Z",
    "filename": "progress-2026-02-09.png",
    "note": "Added flying enemies",
    "commit": "abc1234"
  }
]
```

### When to Save Progress

- ✅ After completing a major feature
- ✅ After significant visual improvements
- ✅ Before/after big refactors
- ✅ Weekly for regular projects
- ✅ At milestones (v0.1, v0.2, etc.)

### Example Workflow

```bash
# 1. Complete feature
# (make changes, test game)

# 2. Capture progress
npm run save-progress -- "Implemented building generation"

# 3. Review what was saved
npm run progress:list

# 4. Commit progress
git add progress/ README.md
git commit -m "docs: Update progress screenshot"

# 5. Continue development
```

## .gitignore Strategy

### What IS Committed

✅ **Used Assets**
- `public/assets/` - Only assets referenced in code

✅ **Progress Screenshots**
- `progress/` - Historical game evolution

✅ **Documentation**
- `docs/` - All guides and references

✅ **Source Code**
- `src/` - Game logic and components

✅ **Configuration**
- `package.json`, `vite.config.js`, etc.

### What is NOT Committed

❌ **Source Asset Packs**
- `asset-sources/` - Original unprocessed packs (large)

❌ **Staging Folders**
- `to-be-processed-assets/` - Temporary processing

❌ **Generated Files**
- `generated-assets/` - AI-generated until verified
- `improvement-tasks/` - Task outputs
- `tmp/` - Temporary files
- `screenshots/` - Test screenshots (except progress/)

❌ **Archives**
- `*.zip`, `*.rar`, `*.tar.gz` - Never commit these

❌ **Inspiration**
- `inspo/` - Reference images (large, not needed for builds)

## Pre-Commit Checklist

Before every commit with asset changes:

```bash
# 1. Run asset audit
npm run audit-assets

# 2. Clean if needed
npm run audit-assets:clean

# 3. Stage deletions
git add -u

# 4. Verify what's staged
git status

# 5. Commit
git commit -m "refactor: Remove unused assets"
```

## Maintenance Schedule

### Weekly
- [ ] Run `npm run audit-assets`
- [ ] Save progress screenshot if changes made

### Monthly  
- [ ] Run `npm run audit-assets:clean`
- [ ] Review `progress/` folder size
- [ ] Clean up old task outputs

### Before Releases
- [ ] Full asset audit and cleanup
- [ ] Save milestone progress screenshot
- [ ] Verify `.gitignore` is correct
- [ ] Check repository size: `git count-objects -vH`

## Repository Size Management

### Check Current Size

```bash
# Total size
git count-objects -vH

# Size by folder
du -sh public/assets/*
```

### Target Sizes

- **Total repo**: < 50 MB
- **Assets folder**: < 10 MB
- **Progress folder**: < 5 MB
- **Per asset**: < 100 KB

### If Over Target

1. Run `npm run audit-assets:clean`
2. Compress large images
3. Remove old progress screenshots (keep milestones)
4. Consider using Git LFS for large assets

## Git LFS (Optional)

For projects with many large assets:

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.png"
git lfs track "*.jpg"

# Commit
git add .gitattributes
git commit -m "chore: Add Git LFS tracking"
```

## Automation with Hooks

### Pre-commit Hook (Optional)

Create `.git/hooks/pre-commit`:

```bash
#!/bin/sh

# Run asset audit
npm run audit-assets

# Check for issues
if [ $? -ne 0 ]; then
    echo "❌ Asset audit found issues. Run 'npm run audit-assets:clean' to fix."
    exit 1
fi

echo "✅ Asset audit passed"
exit 0
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Troubleshooting

### "Asset not found" errors

**Problem**: Audit deleted an asset that was actually used

**Solution**:
1. Check `asset-audit-report.json` for the file
2. If it was used, the reference might be dynamic or indirect
3. Add asset back manually
4. Update code to use static references

### Progress screenshot fails

**Problem**: `save-progress` doesn't capture screenshot

**Solution**:
1. Check dev server starts: `npm run dev`
2. Check test runner works: `npm run test:agent -- tests/hello-world.json`
3. Verify `tmp/screenshots/` is writable
4. Check browser automation (Playwright) is installed

### Large repository size

**Problem**: Repo is over 50 MB after cleanup

**Solution**:
1. Check what's largest: `du -sh * | sort -h`
2. Review `progress/` - delete old non-milestone screenshots
3. Compress images: Use tools like pngquant, imageoptim
4. Consider Git LFS for remaining large files

## Best Practices

### Asset Addition
1. Add to staging folder first (`to-be-processed-assets/`)
2. Let auto-organizer place in correct location
3. Use in code
4. Test thoroughly
5. Run audit before commit
6. Commit only used assets

### Progress Tracking
1. Save progress after significant changes
2. Use descriptive notes
3. Keep milestones (v0.1, v0.2)
4. Delete intermediate screenshots older than 2 months
5. Always keep `latest.png`

### Documentation
1. Keep README.md updated with latest screenshot
2. Update progress/ history when saving
3. Document any major asset changes
4. Link to progress in release notes

## See Also

- [Asset Organization](ASSETS.md) - Asset workflow and structure
- [Agent Testing](AGENTS.md) - Using test framework
- [Quick Start](QUICK_START.md) - Getting started guide
