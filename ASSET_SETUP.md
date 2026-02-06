# 🚀 Asset Setup Instructions

## Quick Start - Copy Assets

**Run this command** to copy the Kenney assets into the game:

### Option 1: Windows Batch File
```bash
copy-assets.bat
```

### Option 2: Node.js Script
```bash
node copy-assets.js
```

### Option 3: Manual Copy
Copy these files manually if the scripts don't work:

**Robot Character:**
```
kenney_robot-pack/PNG/Side view/robot_blueBody.png 
  → public/assets/images/robot-idle.png

kenney_robot-pack/PNG/Side view/robot_blueDrive1.png 
  → public/assets/images/robot-walk-1.png

kenney_robot-pack/PNG/Side view/robot_blueDrive2.png 
  → public/assets/images/robot-walk-2.png

kenney_robot-pack/PNG/Side view/robot_blueJump.png 
  → public/assets/images/robot-jump.png

kenney_robot-pack/PNG/Side view/robot_blueHurt.png 
  → public/assets/images/robot-fall.png
```

**Platform Tiles:**
```
kenney_pixel-platformer/Tiles/tile_0000.png 
  → public/assets/images/tile-grass.png

kenney_pixel-platformer/Tiles/tile_0001.png 
  → public/assets/images/tile-dirt.png
```

## What's Been Set Up

✅ **Player Character** - Blue robot with walk, jump, and fall animations  
✅ **Platform Tiles** - Grass and dirt tiles for procedural generation  
✅ **Controls** - Arrow keys to move, Up/Space to jump  
✅ **Level Regeneration** - Press 'R' to generate a new level  
✅ **Procedural Generation** - Uses Simplex noise for organic platform placement  

## Game Controls

- **←/→ Arrow Keys** - Move left/right
- **↑ Arrow or Space** - Jump
- **R** - Regenerate level

## Testing the Game

1. **Copy the assets** (using one of the methods above)
2. **Check the dev server** - Should still be running at http://localhost:3000
3. **Refresh the browser** - You should see the blue robot!
4. **Play!** - Jump around the procedurally generated platforms

## If Assets Don't Load

The game will still work! It falls back to:
- **Green rectangle** for the player
- **Gray rectangles** for platforms

This lets you test the gameplay even without assets.

## Next Steps

### Try Different Colors
Want a different color robot? Copy these instead:
- `robot_redBody.png`, `robot_redDrive1.png`, etc.
- `robot_greenBody.png`, `robot_greenDrive1.png`, etc.
- `robot_yellowBody.png`, `robot_yellowDrive1.png`, etc.

### Add More Tiles
The `kenney_pixel-platformer/Tiles/` folder has 180 different tiles! 
Try adding:
- `tile_0018.png` - Platform edges
- `tile_0053.png` - Spikes (hazards)
- Characters from `Tiles/Characters/`

### Customize Generation
Edit `src/utils/ProceduralLevelGenerator.js` to:
- Change platform density
- Adjust platform sizes
- Add different tile types
- Create themed levels

Enjoy! 🎮
