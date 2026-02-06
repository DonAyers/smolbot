import Phaser from 'phaser';

/**
 * Example: Loading and using SPRITE SHEETS
 * Uncomment this and replace BootScene.js content to use this approach
 */
export default class BootSceneSpriteSheet extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
        });

        // === LOAD SPRITE SHEETS ===
        // Player sprite sheet (8 frames, 32x32 each, horizontal layout)
        this.load.spritesheet('player', 'assets/images/player-spritesheet.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        
        // Tiles sprite sheet
        this.load.spritesheet('tiles', 'assets/images/tiles-spritesheet.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        
        // Props sprite sheet
        this.load.spritesheet('items', 'assets/images/items-spritesheet.png', {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {
        // === CREATE ANIMATIONS FROM SPRITE SHEET ===
        
        // Idle animation (frame 6)
        this.anims.create({
            key: 'player-idle',
            frames: [{ key: 'player', frame: 6 }],
            frameRate: 1
        });
        
        // Walk animation (frames 0-3)
        this.anims.create({
            key: 'player-walk',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        // Jump animation (frame 4)
        this.anims.create({
            key: 'player-jump',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 1
        });
        
        // Fall animation (frame 5)
        this.anims.create({
            key: 'player-fall',
            frames: [{ key: 'player', frame: 5 }],
            frameRate: 1
        });
        
        this.scene.start('GameScene');
    }
}
