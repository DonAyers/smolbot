# Smolbot Asset Organization Guide

## Overview
Assets have been reorganized by **function** rather than by source pack, following Phaser.js best practices. This makes it easier to find what you need based on what you're building.

## Directory Structure

```
public/assets/
├── images/
│   ├── characters/       # Player characters, robots, NPCs
│   ├── enemies/          # Enemy sprites
│   ├── tiles/            # Terrain and platform tiles
│   │   └── scifi/        # Sci-fi themed walls, floors, chunks
│   ├── backgrounds/      # Sky, parallax layers, backdrop elements
│   ├── buildings/        # Building parts (walls, roofs, windows, doors)
│   ├── environment/      # Natural decorations (bushes, trees, rocks, fences)
│   ├── props/            # Interactive objects (barrels, lamps, machinery)
│   └── ui/               # User interface elements
├── spritesheets/         # Pre-packed sprite atlases with XML/JSON
└── audio/                # Sound effects and music
```

## Category Details

### Characters (`images/characters/`)
- **Robot sprites**: Blue, green, red, yellow robots in multiple states
  - `robot_[color]Body.png` - Idle state
  - `robot_[color]Drive1/2.png` - Walking animation
  - `robot_[color]Jump.png` - Jump state
  - `robot_[color]Hurt.png` - Damage state
  - `robot_[color]Damage1/2.png` - Damaged appearance
  - `tracks_*.png` - Tank tracks for robot movement effects
- **Sci-fi characters**: Character 1-4 from sci-fi packs

### Tiles (`images/tiles/`)
Platform and terrain tiles for level building:
- **Pixel platformer** basic tiles
- **Extended tilesets** with themes: Cake, Castle, Choco, Dirt, Grass, Metal, Purple, Sand, Snow, Tundra
- **Industrial expansion** tiles
- **Sci-fi tiles** (`tiles/scifi/`): Floors, walls, chunks, doors, stairs, ladders

### Backgrounds (`images/backgrounds/`)
- Cloud layers
- Hill parallax layers
- Sky gradients
- Environmental backdrops

### Buildings (`images/buildings/`)
Modular building components:
- **House parts**: Beige, dark, and gray variants with top/mid/bottom sections
- **Roofs**: Gray and red variants
- **Windows**: Various styles (open, closed, checkered, low)
- **Doors**: Different states and types
- **Chimneys**: Regular, low, thin variants
- **Awnings**: Green and red variants

### Environment (`images/environment/`)
Natural and decorative elements:
- **Vegetation**: Bushes (BUSH_01-03), pine trees (Pine_01)
- **Rocks**: Various sizes (Rock_01-04)
- **Fences**: Different styles and conditions
- **Nature tiles**: GREEN_* and ORANGE_* series

### Props (`images/props/`)
Interactive and decorative objects from the sci-fi packs:
- **Furniture**: Beds, chairs, desks, lockers
- **Technology**: Computers, screens, devices, machinery
- **Medical**: Health packs, medical devices, cryo boxes
- **Industrial**: Barrels, pipes, lamps, neon signs
- **Story elements**: Blood effects, destroyed items, props

### UI (`images/ui/`)
Interface elements from the RPG UI pack:
- Buttons, panels, frames
- Health bars, progress indicators
- Icons and symbols
- Slice sprites for 9-slice scaling

### Spritesheets (`spritesheets/`)
Pre-packed sprite atlases with accompanying XML or JSON data files:
- `spritesheet_robotsSide.png` + `.xml` - Complete robot animations
- Tilemap sheets for quick level loading
- UI sprite sheets
- Background element sheets
- Space shooter assets

### Audio (`audio/`)
Sound effects and music from the platformer pack.

## Source Packs
Assets originated from:
- **Kenney Pixel Platformer** - Basic platformer tiles and tilemaps
- **Kenney New Platformer Pack** - Characters, backgrounds, tiles
- **Kenney Robot Pack** - Robot character sprites (side and top view)
- **Kenney Background Elements** - Sky, clouds, environmental layers
- **Kenney Platformer Art: Buildings** - Modular building components
- **Kenney Platformer Art: Extended Tileset** - 10 themed tile variations
- **Kenney Pixel Platformer Industrial Expansion** - Industrial theme tiles
- **Kenney Space Shooter Extension** - Space/shooter sprites (in spritesheets)
- **Kenney UI Pack RPG Expansion** - Interface elements
- **Pack 01 (Pixel Art) / Sci-Fi Assets** - Sci-fi environments and props

Original Kenney folders are preserved in the project root for reference and license information.

## Usage in Phaser

### Loading Individual Sprites
```javascript
// In your scene's preload()
this.load.image('robot-blue-idle', 'assets/images/characters/robot_blueBody.png');
this.load.image('grass-tile', 'assets/images/tiles/grassHalf.png');
this.load.image('cloud-bg', 'assets/images/backgrounds/cloud_01.png');
```

### Loading Spritesheets
```javascript
// For XML atlas (TexturePacker format)
this.load.atlasXML(
    'robots', 
    'assets/spritesheets/spritesheet_robotsSide.png',
    'assets/spritesheets/spritesheet_robotsSide.xml'
);

// For JSON atlas
this.load.atlas(
    'ui',
    'assets/spritesheets/ui-sheet.png',
    'assets/spritesheets/ui-sheet.json'
);
```

### Loading Audio
```javascript
this.load.audio('jump', 'assets/audio/jump.ogg');
this.load.audio('collect', 'assets/audio/collect.wav');
```

## Tips

1. **Use spritesheets for animated characters** - More efficient than individual images
2. **Backgrounds go in layers** - Load multiple background images for parallax scrolling
3. **Tiles are tileable** - Most tiles are designed to seamlessly connect
4. **Props enhance atmosphere** - Mix environment and props for rich scenes
5. **Check licenses** - All assets include license files from their original packs

## Need Something?

- **Character animation?** → Check `characters/` or `spritesheets/`
- **Level terrain?** → Check `tiles/` (and `tiles/scifi/` for sci-fi levels)
- **Background scenery?** → Check `backgrounds/`
- **Decorations?** → Check `environment/` and `props/`
- **City/building scene?** → Check `buildings/`
- **Interface elements?** → Check `ui/`

---

**Last updated**: February 2026
**Organized by**: AI Asset Organization System
