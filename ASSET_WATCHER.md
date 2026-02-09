# Asset Watcher Service

## What It Does

Monitors staging folders and **automatically** processes new assets:
1. 📦 **Detects .zip files** → Unzips automatically
2. 🔄 **Auto-organizes** extracted contents
3. 📊 **Reports progress** in real-time
4. 🎯 **Keeps watching** for more files

## Quick Start

### Start the Watcher

```bash
npm run watch-assets
```

You'll see:
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

### Drop Assets

While watcher is running:
```bash
# In another terminal or file explorer:
cp ~/Downloads/kenney-pack.zip to-be-processed-assets/
```

Watcher automatically:
```
📥 Detected: kenney-pack.zip
   → Unzipping...
   ✅ Extracted 156 files to kenney-pack/
   🗑️  Deleted original zip file
   → Auto-organizing assets...

🔄 Running asset organizer...

📊 Scan Complete:
   Total files: 156
   To organize: 144

✨ Organizing files...
  ✅ Copied bg_clouds.png → backgrounds/
  ...

✅ Organization complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Waiting for more assets...
```

## Workflows

### Workflow 1: Drop & Forget (Recommended)

```bash
# Terminal 1: Start watcher
npm run watch-assets

# Terminal 2: Start dev server
npm run dev

# Then just drag & drop .zip files into to-be-processed-assets/
# Everything happens automatically!
```

### Workflow 2: Manual Control

```bash
# Add assets without watcher
cp assets.zip to-be-processed-assets/

# Manually unzip and organize
unzip to-be-processed-assets/assets.zip -d to-be-processed-assets/
npm run organize-assets
```

### Workflow 3: AI Agent Mode

```javascript
// AI agent workflow
async function handleAssetDrop(zipPath) {
    // 1. Copy to staging
    await copyFile(zipPath, 'to-be-processed-assets/');
    
    // 2. Watcher auto-processes (if running)
    // OR manually trigger:
    await runCommand('node organize-assets.js to-be-processed-assets/');
    
    // 3. Update BootScene
    await updateAssetLoads();
    
    // 4. Verify in-game
    await runCommand('npm run dev');
}
```

## Features

### 🔄 Auto-Processing

- **Zip Detection**: Automatically unzips .zip files
- **Auto-Organization**: Runs organizer on extracted contents
- **Clean-Up**: Deletes zip after successful extraction
- **Error Handling**: Continues watching even if one file fails

### 📂 Multi-Folder Support

Watches both:
- `to-be-processed-assets/`
- `asset-sources/`

### ⏱️ Smart Timing

- Waits for file write to complete (2 second stability threshold)
- Prevents duplicate processing
- Handles multiple simultaneous drops

### 🛡️ Safe Operations

- Never overwrites existing organized assets
- Skips hidden files and system files
- Generates manifest for audit trail
- Graceful shutdown on Ctrl+C

## Configuration

### Keep Zip Files

By default, zip files are deleted after extraction. To keep them:

```bash
KEEP_ZIP_FILES=true npm run watch-assets
```

Or set in `.env`:
```
KEEP_ZIP_FILES=true
```

### Watch Additional Folders

Edit `asset-watcher.js`:
```javascript
const WATCH_FOLDERS = [
    path.join(__dirname, 'to-be-processed-assets'),
    path.join(__dirname, 'asset-sources'),
    path.join(__dirname, 'my-custom-folder')  // Add more here
];
```

## Advanced Usage

### Run Watcher in Background

**Windows (PowerShell):**
```powershell
Start-Process -WindowStyle Hidden npm run watch-assets
```

**macOS/Linux:**
```bash
npm run watch-assets &
```

### Run on System Startup

**Windows - Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: At log on
4. Action: Start a program
   - Program: `node`
   - Arguments: `C:\path\to\smolbot\asset-watcher.js`
   - Start in: `C:\path\to\smolbot`

**macOS - launchd:**
Create `~/Library/LaunchAgents/com.smolbot.assetwatcher.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.smolbot.assetwatcher</string>
    <key>ProgramArguments</key>
    <array>
        <string>node</string>
        <string>/path/to/smolbot/asset-watcher.js</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>/path/to/smolbot</string>
</dict>
</plist>
```

**Linux - systemd:**
Create `/etc/systemd/system/smolbot-watcher.service`:
```ini
[Unit]
Description=Smolbot Asset Watcher
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/smolbot
ExecStart=/usr/bin/node /path/to/smolbot/asset-watcher.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### Integrate with Dev Workflow

**Run watcher alongside dev server:**

Create a script `dev-with-watcher.js`:
```javascript
import { spawn } from 'child_process';

// Start watcher
const watcher = spawn('npm', ['run', 'watch-assets'], { 
    stdio: 'inherit',
    shell: true 
});

// Wait a bit then start dev server
setTimeout(() => {
    const dev = spawn('npm', ['run', 'dev'], { 
        stdio: 'inherit',
        shell: true 
    });
}, 2000);
```

Add to package.json:
```json
"scripts": {
    "dev:full": "node dev-with-watcher.js"
}
```

## Troubleshooting

### Watcher not detecting files

**Solution**: Check file permissions and ensure folders exist
```bash
ls -la to-be-processed-assets/
# Should show rwx permissions
```

### Zip extraction fails

**Solution**: Verify zip file integrity
```bash
unzip -t to-be-processed-assets/pack.zip
```

### Organization runs but assets aren't visible

**Solution**: Update BootScene.js and restart dev server
```bash
# Edit src/scenes/BootScene.js
npm run restart
```

### Multiple processes conflicting

**Solution**: Kill all node processes and restart
```bash
# Windows
taskkill /IM node.exe /F

# macOS/Linux  
pkill -9 node

# Then restart
npm run watch-assets
```

## For AI Agents

### Detection Pattern

```javascript
// Check if watcher is running
const isWatcherRunning = await checkProcess('asset-watcher.js');

if (!isWatcherRunning) {
    // Suggest to user
    console.log('💡 Tip: Run `npm run watch-assets` for automatic asset processing');
}
```

### Integration Strategy

```javascript
async function setupAssetWorkflow() {
    // 1. Check if staging folder exists
    ensureFolder('to-be-processed-assets');
    
    // 2. Ask user if they want auto-processing
    const autoProcess = await askUser('Enable automatic asset processing?');
    
    if (autoProcess) {
        // 3. Start watcher in background
        startWatcher();
        
        // 4. Inform user
        console.log('✅ Drop .zip files into to-be-processed-assets/ for auto-processing');
    } else {
        // 5. Provide manual instructions
        console.log('📝 Run `npm run organize-assets` when ready');
    }
}
```

### Post-Processing Hook

After watcher organizes assets:
1. Read `asset-manifest.json`
2. Parse new assets
3. Generate BootScene load statements
4. Update documentation
5. Run tests

## Command Reference

| Command | Purpose |
|---------|---------|
| `npm run watch-assets` | Start watcher service |
| `npm run organize-assets` | Manual organization |
| `npm run organize-assets:dry-run` | Preview organization |

## Architecture

```
┌─────────────────────┐
│  File System Event  │
│  (zip dropped)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Chokidar Watcher   │
│  (detects file)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Unzip Handler      │
│  (extracts files)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Asset Organizer    │
│  (classifies &      │
│   copies to target) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Manifest Generator │
│  (asset-manifest.   │
│   json)             │
└─────────────────────┘
```

## Best Practices

✅ **Start watcher during dev sessions**
✅ **Drop multiple zips at once** - processes sequentially
✅ **Check manifest after processing** - verify correctness
✅ **Update BootScene immediately** - keep game in sync
✅ **Test in-game** - verify assets load correctly

❌ Don't drop extremely large files (>1GB) - may timeout
❌ Don't edit files while being processed
❌ Don't run multiple watchers on same folder
❌ Don't commit staging folders to git (already gitignored)

## Tips & Tricks

💡 **Batch Processing**: Drop multiple zips - they queue automatically
💡 **Quick Test**: Drop a small zip first to verify workflow
💡 **Background Mode**: Run watcher in separate terminal/screen
💡 **Auto-Restart**: Use nodemon for auto-restart on code changes
💡 **Logging**: Output is color-coded for easy scanning

---

**Related Documentation:**
- `ASSET_WORKFLOW.md` - Manual organization workflow
- `ASSET_ORGANIZATION_SUMMARY.md` - Quick reference
- `AGENTS.md` - AI agent integration guide
