# Asset Organization System - Summary

## What It Does

Automatically organizes game assets into the proper directory structure based on intelligent pattern matching.

## How To Use

### Simple Workflow

```bash
# 1. Add assets to staging folder
to-be-processed-assets/
├── kenney_pack/
│   ├── robot_blueDrive1.png
│   ├── bg_clouds.png
│   └── houseDark*.png
└── custom_sprites/
    └── *.png

# 2. Preview
npm run organize-assets:dry-run

# 3. Organize
npm run organize-assets
```

That's it! Assets are now organized in `public/assets/`.

## For AI Agents

```javascript
// Detect assets in staging
if (hasAssetsInStaging()) {
    // Preview
    await run('npm run organize-assets:dry-run');
    
    // Organize
    await run('npm run organize-assets');
    
    // Update BootScene.js
    updateAssetLoads();
}
```

## Key Features

✅ **Auto-detection** - Recognizes 10+ asset categories
✅ **Safe** - Never overwrites existing files
✅ **Documented** - Generates manifest of all changes
✅ **Gitignored** - Staging folders don't pollute repo
✅ **Smart** - Over 50 classification patterns

## Asset Categories

- backgrounds → clouds, hills, sky
- buildings → houses, roofs, windows
- characters → player sprites, animations
- enemies → enemy sprites
- environment → trees, rocks, plants
- props → barrels, crates, machines
- tiles → terrain, platforms
- ui → buttons, icons
- spritesheets → atlases, XML files
- audio → sounds, music

## Commands

| Command | Purpose |
|---------|---------|
| `npm run organize-assets:dry-run` | Preview changes |
| `npm run organize-assets` | Execute organization |

## Files Created

- `asset-manifest.json` - Complete mapping of organized assets
- Organized files in `public/assets/` subdirectories

## Documentation

- Full guide: `ASSET_WORKFLOW.md`
- AI agent integration: `AGENTS.md`
- Classification rules: See `organize-assets.js`

## Quick Test

```bash
# Create test files
mkdir -p to-be-processed-assets
touch to-be-processed-assets/test_robot_idle.png
touch to-be-processed-assets/test_bg_clouds.png

# Preview
npm run organize-assets:dry-run

# Will show:
#   characters: 1 file (test_robot_idle.png)
#   backgrounds: 1 file (test_bg_clouds.png)
```

## Next Steps After Organizing

1. Update `src/scenes/BootScene.js` with new assets
2. Test in-game: `npm run dev`
3. Use Sprite Viewer (press V) to verify
4. Clean staging folder

---

**Created**: 2026-02-09
**Tool**: `organize-assets.js`
**npm scripts**: `organize-assets`, `organize-assets:dry-run`
