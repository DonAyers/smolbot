import Phaser from 'phaser';

/**
 * Sprite Atlas Viewer Scene
 * Press 'V' in game to open this scene and view all frames in an atlas
 */
export default class SpriteViewerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SpriteViewerScene' });
    }

    create() {
        // Semi-transparent black background
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.95)');
        
        // Title
        this.add.text(20, 20, 'SPRITE ATLAS VIEWER - Robot Spritesheet', {
            fontSize: '24px',
            fill: '#00ff00',
            fontFamily: 'monospace'
        });
        
        this.add.text(20, 50, 'Press V to return to game', {
            fontSize: '16px',
            fill: '#ffff00',
            fontFamily: 'monospace'
        });
        
        // Get all frames from the robots atlas
        const frames = this.textures.get('robots').getFrameNames();
        
        // Display frames in a grid
        const startX = 50;
        const startY = 100;
        const cols = 4;
        const cellWidth = 250;
        const cellHeight = 220;
        
        frames.forEach((frameName, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * cellWidth;
            const y = startY + row * cellHeight;
            
            // Background for each cell
            const bg = this.add.graphics();
            bg.fillStyle(0x222222, 0.5);
            bg.fillRect(x - 10, y - 10, cellWidth - 20, cellHeight - 20);
            
            // Display the sprite
            const sprite = this.add.image(x + 80, y + 60, 'robots', frameName);
            sprite.setScale(0.8);
            
            // Add border to see bounds
            const bounds = sprite.getBounds();
            const border = this.add.graphics();
            border.lineStyle(1, 0x00ff00, 0.5);
            border.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            
            // Label with frame name
            const label = this.add.text(x, y + 130, frameName, {
                fontSize: '11px',
                fill: '#ffffff',
                fontFamily: 'monospace',
                wordWrap: { width: cellWidth - 30 }
            });
            
            // Check if frame name contains "Body", "Drive", "Jump", etc
            let category = '';
            if (frameName.includes('Body')) category = '🟢 BODY (no treads)';
            else if (frameName.includes('Drive')) category = '🟡 DRIVE (has treads)';
            else if (frameName.includes('Jump')) category = '🔵 JUMP';
            else if (frameName.includes('Hurt')) category = '🔴 HURT';
            else if (frameName.includes('Damage')) category = '🟠 DAMAGE';
            else if (frameName.includes('tracks')) category = '⚙️ TREADS ONLY';
            
            this.add.text(x, y + 160, category, {
                fontSize: '10px',
                fill: '#00ff00',
                fontFamily: 'monospace'
            });
        });
        
        // Toggle back to game
        this.input.keyboard.on('keydown-V', () => {
            this.scene.stop();
            this.scene.resume('GameScene');
        });
    }
}
