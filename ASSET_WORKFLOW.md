# Asset Organization Workflow

## Quick Start

### For Humans

1. **Create staging folder** (one time):
   ```bash
   mkdir to-be-processed-assets
   ```

2. **Add your assets**:
   - Download an asset pack (e.g., from Kenney.nl)
   - Extract it into `to-be-processed-assets/`
   - Or just drop loose files there

3. **Preview organization**:
   ```bash
   npm run organize-assets:dry-run
   ```

4. **Organize assets**:
   ```bash
   npm run organize-assets
   ```

5. **Done!** Assets are now organized in `public/assets/`

### For AI Agents

When a user adds assets to the project:

```javascript
// 1. Check if staging folder exists and has content
const stagingFolder = 'to-be-processed-assets';
if (fs.existsSync(stagingFolder) && fs.readdirSync(stagingFolder).length > 0) {
    
    // 2. Preview organization
    await runCommand('npm run organize-assets:dry-run');
    
    // 3. Review results, ask user if many unclassified
    
    // 4. Execute organization
    await runCommand('npm run organize-assets');
    
    // 5. Update BootScene.js with new assets
    
    // 6. Test in-game
}
```

## Staging Folders

Two folder names are recognized automatically:
- `to-be-processed-assets/` (recommended)
- `asset-sources/`

Both are gitignored, so you can keep assets here without committing them.

## Examples

### Example 1: Kenney Asset Pack
```bash
# Download and extract
unzip kenney_pixel-platformer.zip -d to-be-processed-assets/

# Preview what will happen
npm run organize-assets:dry-run

# Organize
npm run organize-assets
```

### Example 2: Custom Assets
```bash
# Create staging folder if it doesn't exist
mkdir to-be-processed-assets

# Copy your assets
cp ~/Downloads/my-sprites/* to-be-processed-assets/

# Organize with dry run first
npm run organize-assets:dry-run

# If it looks good, organize
npm run organize-assets
```

### Example 3: Mixed Asset Sources
```bash
# Add multiple asset packs
cp -r kenney_pack_1/* to-be-processed-assets/
cp -r kenney_pack_2/* to-be-processed-assets/
cp -r custom_assets/* to-be-processed-assets/

# Tool handles everything at once
npm run organize-assets
```

## Advanced Usage

### Organize from specific folder
```bash
npm run organize-assets -- "path/to/assets"
```

### Organize with dry-run from specific folder
```bash
npm run organize-assets -- "path/to/assets" --dry-run
```

### Direct node command
```bash
node organize-assets.js to-be-processed-assets
node organize-assets.js to-be-processed-assets --dry-run
```

## Target Structure

Assets are organized into:

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

## Classification

The tool automatically categorizes files based on their names:

| Category | Examples |
|----------|----------|
| **backgrounds** | `bg_clouds.png`, `background.png`, `hills.png` |
| **buildings** | `houseDark*.png`, `roof*.png`, `window.png` |
| **characters** | `robot_*Drive*.png`, `player_*.png`, `*_idle.png` |
| **enemies** | `enemy-*.png`, `monster_*.png` |
| **environment** | `tree*.png`, `bush*.png`, `rock*.png`, `GREEN_*.png` |
| **props** | `barrel*.png`, `pipe.png`, `lamp*.png`, `Machine*.png` |
| **tiles** | `terrain_*.png`, `*Half*.png`, `tile_*.png` |
| **ui** | `button*.png`, `icon_*.png`, `hud_*.png` |
| **spritesheets** | `spritesheet_*.png`, `*.xml`, `*atlas*.png` |
| **audio** | `*.mp3`, `*.wav`, `*.ogg` |

## Output

### Console Output
```
📂 Using default staging folder: to-be-processed-assets

🔍 Scanning assets in: to-be-processed-assets

📊 Scan Complete:
   Total files: 156
   Skipped: 12
   To organize: 144

📦 Classification Breakdown:
   backgrounds: 15 files
   buildings: 38 files
   characters: 22 files
   props: 25 files
   tiles: 26 files
   environment: 18 files

✨ Organizing files...

  ✅ Copied bg_clouds.png → backgrounds/
  ✅ Copied houseDarkBottomLeft.png → buildings/
  ✅ Copied robot_blueDrive1.png → characters/
  ...

✅ Organization Complete!
   Files copied: 144
   Errors: 0
   Manifest saved to: asset-manifest.json
```

### Manifest File

After organizing, `asset-manifest.json` is created:

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
      "buildings": 38,
      ...
    }
  },
  "files": [
    {
      "original": "bg_clouds.png",
      "category": "backgrounds",
      "target": "public/assets/images/backgrounds/bg_clouds.png"
    },
    ...
  ]
}
```

## Unclassified Files

If files don't match any pattern:

```
⚠️  Unclassified files (need manual review):
   - custom_sprite_01.png
   - unknown_asset.png
```

These need manual classification - move them to the appropriate folder.

## Safety Features

✅ **No overwriting**: Existing files are automatically skipped
✅ **Dry run mode**: Preview before making changes
✅ **Manifest generation**: Track what was organized
✅ **Skip patterns**: Ignores readme, license, preview files
✅ **Gitignored staging**: Assets don't clutter your repo

## Troubleshooting

### "No staging folder found"
Create one: `mkdir to-be-processed-assets`

### "Too many unclassified files"
- Check file naming patterns
- Update classification rules in `organize-assets.js`
- Manually move edge cases after organizing

### "Files in wrong category"
- Run with `--dry-run` to preview
- Adjust patterns in `CLASSIFICATION_RULES`
- Manually move misclassified files

### "Duplicates detected"
Tool skips existing files automatically. Check manifest to see what was skipped.

## After Organizing

1. **Update BootScene.js**: Add load statements for new assets
2. **Test in-game**: Run `npm run dev` and verify assets appear
3. **Update documentation**: Note new asset types in ASSET_GUIDE.md
4. **Clean staging folder**: Delete or move processed assets

## Tips

💡 Always run `--dry-run` first to preview
💡 Keep staging folder clean - delete after organizing
💡 Name files consistently for better auto-classification
💡 Check manifest for any issues before testing
💡 Use sprite viewer (press V in-game) to verify assets

## AI Agent Notes

When implementing asset organization:
- Check staging folder automatically
- Run dry-run and parse output
- Report unclassified files to user
- Update BootScene after organizing
- Verify assets load correctly
- Clean up staging folder after success

---

**Quick Commands**:
```bash
npm run organize-assets:dry-run  # Preview only
npm run organize-assets           # Organize assets
```
