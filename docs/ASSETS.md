# Asset Management Guide

Complete guide to managing, organizing, and automating game assets in Smolbot.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Manual Workflow](#manual-workflow)
4. [Auto-Organization](#auto-organization)
5. [File Watching](#file-watching)
6. [Asset Discovery](#asset-discovery)

---

## Overview

Smolbot uses a multi-layered asset system:
- **Staging folders** for incoming assets
- **Auto-classification** based on file patterns
- **File watching** for hands-free processing
- **Asset discovery** for finding/generating new assets

### Asset Categories

```
public/assets/
├── images/
│   ├── backgrounds/     ← clouds, hills, sky
│   ├── buildings/       ← houses, roofs, windows
│   ├── characters/      ← player sprites
│   ├── enemies/         ← enemy sprites
│   ├── environment/     ← trees, rocks, plants
│   ├── props/           ← barrels, crates, machines
│   ├── tiles/           ← terrain, platforms
│   └── ui/              ← buttons, icons
├── spritesheets/        ← atlases, XML files
└── audio/               ← sounds, music
```

---

## Quick Start

### For Humans

**Automatic (Recommended)**:
```bash
# Terminal 1: Start watcher
npm run watch-assets

# Terminal 2: Start dev server
npm run dev

# Then just drop .zip files into to-be-processed-assets/
```

**Manual**:
```bash
# 1. Create staging folder (one time)
mkdir to-be-processed-assets

# 2. Add assets (copy or extract)
cp ~/Downloads/asset-pack.zip to-be-processed-assets/

# 3. Preview
npm run organize-assets:dry-run

# 4. Organize
npm run organize-assets
```

### For AI Agents

```javascript
// Check if watcher is running
const watcherRunning = await checkProcess('asset-watcher');
if (!watcherRunning) {
    console.log('💡 Tip: Run `npm run watch-assets` for automatic processing');
}

// Or manually process
const stagingFolder = 'to-be-processed-assets';
if (fs.existsSync(stagingFolder) && hasFiles(stagingFolder)) {
    // Preview
    await runCommand('npm run organize-assets:dry-run');
    
    // Organize
    await runCommand('npm run organize-assets');
    
    // Update BootScene.js
    await updateAssetLoads();
    
    // Test in-game
    await runCommand('npm run dev');
}
```

---

## Manual Workflow

### Step 1: Setup

Create staging folder (one-time):
```bash
mkdir to-be-processed-assets
```

**Note**: Both `to-be-processed-assets/` and `asset-sources/` are recognized and gitignored.

### Step 2: Add Assets

Extract or copy assets to staging:
```bash
# Extract zip
unzip ~/Downloads/kenney-pack.zip -d to-be-processed-assets/

# Or copy files directly
cp ~/Downloads/my-sprites/* to-be-processed-assets/
```

### Step 3: Preview Organization

Always preview before organizing:
```bash
npm run organize-assets:dry-run
```

Output shows:
```
📊 Scan Complete:
   Total files: 156
   To organize: 144

📦 Classification Breakdown:
   backgrounds: 15 files
   buildings: 38 files
   characters: 22 files
   props: 25 files
   tiles: 26 files
   environment: 18 files
```

### Step 4: Organize

If preview looks good:
```bash
npm run organize-assets
```

Outputs:
- Console log with progress
- `asset-manifest.json` with complete mapping

### Step 5: Integration

After organizing:
1. ✅ Update `src/scenes/BootScene.js` with load statements
2. ✅ Test in-game: `npm run dev`
3. ✅ Use Sprite Viewer (press V) to verify
4. ✅ Clean staging folder

---

## Auto-Organization

### Classification System

The organizer uses 50+ patterns to auto-classify files:

| Category | Pattern Examples | Sample Files |
|----------|------------------|--------------|
| **backgrounds** | `bg_*`, `*cloud*`, `*hill*`, `*sky*` | bg_clouds.png, hills.png |
| **buildings** | `house*`, `roof*`, `window*`, `brick*` | houseDark.png, window_green.png |
| **characters** | `*Drive*`, `*idle*`, `player_*`, `robot_*` | robot_blueDrive1.png, player_idle.png |
| **enemies** | `enemy*`, `monster_*`, `hostile*` | enemy-fly.png, monster_green.png |
| **environment** | `tree*`, `bush*`, `rock*`, `plant*` | tree_large.png, bush_small.png |
| **props** | `barrel*`, `crate*`, `pipe*`, `lamp*` | barrel_red.png, crate_wood.png |
| **tiles** | `tile_*`, `*Half*`, `terrain_*` | tile_0000.png, grassHalfMid.png |
| **ui** | `button*`, `icon_*`, `hud_*` | buttonBlue.png, icon_health.png |
| **spritesheets** | `*sheet*`, `*atlas*`, `*.xml` | spritesheet_characters.png |
| **audio** | `*.mp3`, `*.wav`, `*.ogg` | jump.wav, music_loop.mp3 |

### Advanced Options

**Organize specific folder**:
```bash
npm run organize-assets -- "path/to/folder"
```

**Direct command**:
```bash
node organize-assets.js to-be-processed-assets
node organize-assets.js to-be-processed-assets --dry-run
```

### Output Files

**Console Output**:
- File-by-file progress
- Classification breakdown
- Error reporting
- Summary statistics

**asset-manifest.json**:
```json
{
  "timestamp": "2026-02-09T20:25:00.000Z",
  "sourceFolder": "to-be-processed-assets",
  "stats": {
    "scanned": 156,
    "copied": 144,
    "skipped": 12,
    "byCategory": {
      "backgrounds": 15,
      "buildings": 38
    }
  },
  "files": [
    {
      "original": "bg_clouds.png",
      "category": "backgrounds",
      "target": "public/assets/images/backgrounds/bg_clouds.png"
    }
  ]
}
```

### Safety Features

✅ **No overwriting**: Existing files are skipped
✅ **Dry run mode**: Preview before committing
✅ **Manifest tracking**: Complete audit trail
✅ **Skip patterns**: Ignores readme, license, preview files
✅ **Gitignored staging**: Clean repository

---

## File Watching

### What It Does

The asset watcher provides **fully automatic** asset processing:
1. 📦 Detects .zip files → Unzips automatically
2. 🔄 Auto-organizes extracted contents
3. 📊 Reports progress in real-time
4. 🎯 Keeps watching for more files

### Starting the Watcher

```bash
npm run watch-assets
```

Output:
```
🔍 Asset Watcher Service
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📂 Watching folders:
   👁️  to-be-processed-assets/
   👁️  asset-sources/

💡 Tips:
   • Drop .zip files → auto-unzips & organizes
   • Drop loose files → auto-organizes
   • Add entire folders → auto-organizes

🎯 Waiting for assets... (Ctrl+C to stop)
```

### How It Works

When you drop a file:
```
📥 Detected: kenney-pack.zip
   → Unzipping...
   ✅ Extracted 156 files to kenney-pack/
   🗑️  Deleted original zip file
   → Auto-organizing assets...

🔄 Running asset organizer...

✨ Organizing files...
  ✅ Copied bg_clouds.png → backgrounds/
  ...

✅ Organization complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Waiting for more assets...
```

### Features

🔄 **Auto-Unzipping**: Detects and extracts .zip files
📁 **Multi-Folder**: Watches both staging folders
⏱️ **Smart Timing**: Waits for file write completion
🛡️ **Safe Operations**: Continues on errors, no overwrites
🎯 **Clean-up**: Optional zip deletion after extraction

### Configuration

**Keep zip files after extraction**:
```bash
KEEP_ZIP_FILES=true npm run watch-assets
```

**Run in background** (Windows):
```powershell
Start-Process -WindowStyle Hidden npm run watch-assets
```

**Run in background** (macOS/Linux):
```bash
npm run watch-assets &
```

### Troubleshooting

**Watcher not detecting files**:
```bash
# Check permissions
ls -la to-be-processed-assets/
```

**Zip extraction fails**:
```bash
# Verify zip integrity
unzip -t to-be-processed-assets/pack.zip
```

**Multiple processes conflicting**:
```bash
# Kill existing processes
taskkill /IM node.exe /F  # Windows
pkill -9 node            # Unix

# Restart
npm run watch-assets
```

---

## Asset Discovery

For finding or generating new assets, see [Asset Discovery Agent](../asset-discovery-agent.js) or the [Agents Guide](AGENTS.md).

### Web-Based Discovery

```bash
npm run assets:find task_<id> "asset-type" "description" "style-refs"
```

Searches:
- OpenGameArt.org (CC0, CC-BY)
- Kenney.nl (CC0)
- Itch.io (various licenses)
- CraftPix freebies

### AI Generation

For custom assets that don't exist, use [Local AI Generation](LOCAL_AI.md):
```bash
npm run assets:generate example-asset-requests/robot-character.json
```

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run watch-assets` | Start file watcher (automatic) |
| `npm run organize-assets` | Organize from staging folder |
| `npm run organize-assets:dry-run` | Preview organization |
| `npm run organize-assets -- "path"` | Organize specific folder |

---

## Tips & Best Practices

💡 **Start watcher during dev sessions** for hands-free workflow
💡 **Always preview first** with dry-run mode
💡 **Check manifest** after organizing for verification
💡 **Update BootScene immediately** to keep game in sync
💡 **Use Sprite Viewer (V key)** to verify assets load correctly
💡 **Clean staging folder** after successful organization

❌ Don't drop extremely large files (>1GB)
❌ Don't edit files while being processed
❌ Don't run multiple watchers on same folder
❌ Don't commit staging folders to git (gitignored)

---

## Related Documentation

- [Agents Guide](AGENTS.md) - AI agent workflows
- [Quick Start](QUICK_START.md) - Fast setup guide
- [Local AI](LOCAL_AI.md) - AI asset generation
- [Animation Debugging](learning/ANIMATION_DEBUGGING.md) - Animation tips

---

**See also**: `organize-assets.js`, `asset-watcher.js`, `asset-discovery-agent.js`
