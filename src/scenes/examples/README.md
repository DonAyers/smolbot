# Asset Loading Examples

This folder contains three different approaches to loading and using game assets in Phaser 3.

## Which Approach Should I Use?

### 🟢 For AI-Assisted Development: Individual PNGs
**File**: `BootScene.IndividualPNGs.js`

**Use when:**
- Working with AI agents to iterate quickly
- You have separate files like `idle.png`, `walk-1.png`, etc.
- Prototyping and testing different assets
- Want clear, semantic file names

**Pros:**
- AI can easily understand "player-jump.png"
- Easy to swap individual frames
- Great for rapid iteration

**Cons:**
- More HTTP requests (slower loading)
- Not optimal for production

---

### 🟡 For Production: Sprite Sheets
**File**: `BootScene.SpriteSheet.js`

**Use when:**
- Ready to optimize performance
- Have a spritesheet file (all frames in one image)
- Know the exact frame dimensions and layout

**Pros:**
- Best performance (one texture, one request)
- Industry standard approach
- Smaller file size

**Cons:**
- Need to know frame numbers (frame 0, 1, 2...)
- Requires image editor to modify frames

---

### 🟢 Best of Both Worlds: Texture Atlas
**File**: `BootScene.TextureAtlas.js`

**Use when:**
- Want performance AND semantic names
- Using tools like TexturePacker, Shoebox, or similar

**Pros:**
- Performance of sprite sheets
- Semantic frame names like `'idle.png'`
- AI-friendly AND production-ready
- Can pack different-sized sprites efficiently

**Cons:**
- Requires atlas generation tool
- Extra JSON file to manage

---

## How to Use These Examples

1. **Choose your approach** based on your current needs
2. **Copy the content** from the example file
3. **Replace** `src/scenes/BootScene.js` with the content
4. **Organize your assets** in the matching folder structure:

### Individual PNGs:
```
public/assets/images/
  player/
    idle.png
    walk-1.png
    walk-2.png
    jump.png
    fall.png
```

### Sprite Sheet:
```
public/assets/images/
  player-spritesheet.png (256x32, 8 frames of 32x32)
```

### Texture Atlas:
```
public/assets/images/
  player-atlas.png
  player-atlas.json
```

---

## Recommended Workflow

### Starting Out (AI-Friendly)
1. Use **Individual PNGs**
2. Name files descriptively: `player-jump.png`, `enemy-attack.png`
3. Let AI help you quickly iterate

### Moving to Production
1. Use a tool to combine PNGs into **Texture Atlas**:
   - [TexturePacker](https://www.codeandweb.com/texturepacker) (free version available)
   - [Leshy SpriteSheet Tool](https://www.leshylabs.com/apps/sstool/) (free)
   - [Free Texture Packer](http://free-tex-packer.com/) (online, free)

2. Switch to **BootScene.TextureAtlas.js**
3. Keep semantic names, gain performance!

---

## Your Robot Pack Assets

Since you mentioned having robot pack assets with both individual PNGs and sprite sheets:

**Option 1 - Quick Start**: Use the individual PNGs
- Copy them to `public/assets/images/robot/`
- Use `BootScene.IndividualPNGs.js`
- Start coding immediately

**Option 2 - Optimized**: Use the sprite sheets
- Copy sprite sheet to `public/assets/images/`
- Open sprite sheet in an image viewer to count frames
- Document frame layout (which frame is which action)
- Use `BootScene.SpriteSheet.js`

Need help setting up with your specific assets? Just let me know!
