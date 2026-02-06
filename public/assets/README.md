# Assets Folder

This folder is where you place all your game assets.

## Folder Structure

- **images/** - Sprite sheets, individual sprites, backgrounds, tilesets
- **audio/** - Sound effects (.mp3, .ogg) and background music
- **tilemaps/** - Tiled map JSON exports (if using Tiled Map Editor)

## Recommended Asset Specifications

### Player Sprite
- Size: 32x32 or 64x64 pixels
- Format: PNG with transparency
- Sprite sheet layout: Horizontal strip with frames

### Platforms/Tiles
- Size: 16x16, 32x32, or 64x64 pixels (consistent throughout)
- Format: PNG
- Can be individual tiles or a tileset

### Example Asset Sources (Free)
- **OpenGameArt.org** - Free game assets
- **itch.io** - Many free asset packs
- **Kenney.nl** - High-quality free game assets
- **Piskel** - Free online pixel art editor

## Loading Assets

Add asset loading code in `src/scenes/BootScene.js`:

```javascript
preload() {
    // Images
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('platform', 'assets/images/platform.png');
    
    // Sprite sheets
    this.load.spritesheet('player', 'assets/images/player.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    
    // Audio
    this.load.audio('jump', 'assets/audio/jump.mp3');
    this.load.audio('music', 'assets/audio/background-music.mp3');
}
```

## Quick Start Without Custom Assets

The game currently uses simple colored rectangles for platforms. You can start coding gameplay immediately and add graphics later!
