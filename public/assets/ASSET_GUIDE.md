# Asset Organization Guide

> **NOTE**: Assets have been reorganized! See [ORGANIZATION.md](./ORGANIZATION.md) for the new structure and complete asset catalog.

---

## Current Organization

Your assets are now organized in `public/assets/` by function:
- **images/characters/** - Player sprites, robots, NPCs
- **images/tiles/** - Terrain, platforms, walls (including `tiles/scifi/`)
- **images/backgrounds/** - Sky, clouds, parallax layers
- **images/buildings/** - Building components
- **images/environment/** - Natural decorations
- **images/props/** - Interactive objects
- **images/ui/** - Interface elements
- **spritesheets/** - Pre-packed atlases
- **audio/** - Sound effects

See [ORGANIZATION.md](./ORGANIZATION.md) for detailed catalog and usage examples.

---

## Option 1: Individual PNGs (AI-Friendly Approach)

### Pros
- ✅ **Semantic file names** - AI can easily understand "player-jump.png" vs "frame 5"
- ✅ **Easy to modify** - Swap out individual frames without touching others
- ✅ **Easier debugging** - Know exactly which file is being used
- ✅ **AI can generate** - AI can describe and reference specific actions
- ✅ **Flexible** - Can always combine into sprite sheet later

### Cons
- ❌ More HTTP requests (slower initial load)
- ❌ More GPU texture switches (lower FPS)
- ❌ Takes more disk space

### Recommended Structure
```
assets/images/player/
  ├── idle.png (32x32)
  ├── walk-1.png
  ├── walk-2.png
  ├── walk-3.png
  ├── walk-4.png
  ├── jump.png
  ├── fall.png
  └── land.png

assets/images/enemy-bot/
  ├── idle.png
  ├── patrol-1.png
  ├── patrol-2.png
  └── attack.png
```

### Loading in BootScene.js
```javascript
// Individual images
this.load.image('player-idle', 'assets/images/player/idle.png');
this.load.image('player-walk-1', 'assets/images/player/walk-1.png');
this.load.image('player-walk-2', 'assets/images/player/walk-2.png');
this.load.image('player-jump', 'assets/images/player/jump.png');

// Create animations from individual images
this.anims.create({
    key: 'walk',
    frames: [
        { key: 'player-walk-1' },
        { key: 'player-walk-2' },
        { key: 'player-walk-3' },
        { key: 'player-walk-4' }
    ],
    frameRate: 10,
    repeat: -1
});
```

---

## Option 2: Sprite Sheets (Production Standard)

### Pros
- ✅ **Better performance** - One HTTP request, one GPU texture
- ✅ **Industry standard** - Professional game dev practice
- ✅ **Smaller file size** - Better compression
- ✅ **Organized** - All related frames in one file

### Cons
- ❌ Requires knowing frame layout/dimensions
- ❌ AI needs documentation to understand frame mapping
- ❌ Harder to modify single frames (need image editor)

### Recommended Structure
```
assets/images/
  ├── player-spritesheet.png (256x32, 8 frames @ 32x32)
  ├── enemy-bot-spritesheet.png
  └── tiles-spritesheet.png

assets/images/docs/
  ├── player-spritesheet.md (Frame documentation for AI)
  └── spritesheet-map.json (Optional metadata)
```

### Loading in BootScene.js
```javascript
// Sprite sheet
this.load.spritesheet('player', 'assets/images/player-spritesheet.png', {
    frameWidth: 32,
    frameHeight: 32
});

// Create animations from sprite sheet
this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'jump',
    frames: [{ key: 'player', frame: 4 }],
    frameRate: 1
});
```

### Frame Documentation (for AI assistance)
```markdown
# player-spritesheet.png Frame Map
- Frame 0-3: Walk cycle
- Frame 4: Jump
- Frame 5: Fall
- Frame 6: Idle
- Frame 7: Land
```

---

## Hybrid Approach (RECOMMENDED)

### Best of Both Worlds
1. **Start with individual PNGs during prototyping**
   - Easy for AI to help you iterate
   - Quick to test different assets
   
2. **Use tools to convert to sprite sheets for optimization**
   - Use TexturePacker, Shoebox, or free online tools
   - Do this when ready for performance optimization

3. **Keep documentation for AI context**
   - Simple markdown files describing frame layouts
   - AI can reference docs when making changes

### Quick Conversion Tools
- **Free Online**: [Sprite Sheet Packer](https://www.codeandweb.com/tp-online)
- **Free Desktop**: [Leshy SpriteSheet Tool](https://www.leshylabs.com/apps/sstool/)
- **Phaser CLI**: Can generate atlases from folders

### Example Conversion Workflow
```bash
# Your files
/source/
  player-idle.png
  player-walk-1.png
  player-walk-2.png

# Run through packer
# Output:
  player-spritesheet.png
  player-spritesheet.json (atlas data)

# Load atlas in Phaser (best of both worlds!)
this.load.atlas('player', 
    'assets/images/player-spritesheet.png',
    'assets/images/player-spritesheet.json'
);
```

---

## My Recommendation for You

**Start with individual PNGs**, because:
1. You're working with AI agents - semantic names are valuable
2. You're prototyping - flexibility > performance right now
3. You can optimize later when gameplay is solid
4. The robot pack assets you have are probably already separated

**Upgrade to sprite sheets when:**
- Your game has 20+ individual images
- Loading time becomes noticeable
- You're ready to publish/optimize
- You have finalized your character animations

Would you like me to set up the project for either approach?
