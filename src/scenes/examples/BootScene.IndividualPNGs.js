import Phaser from 'phaser';

/**
 * Example: Loading and using INDIVIDUAL PNG files
 * Uncomment this and replace BootScene.js content to use this approach
 */
export default class BootSceneIndividualPNGs extends Phaser.Scene {
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

        // === LOAD INDIVIDUAL PNGs ===
        // Player character states
        this.load.image('player-idle', 'assets/images/player/idle.png');
        this.load.image('player-walk-1', 'assets/images/player/walk-1.png');
        this.load.image('player-walk-2', 'assets/images/player/walk-2.png');
        this.load.image('player-walk-3', 'assets/images/player/walk-3.png');
        this.load.image('player-walk-4', 'assets/images/player/walk-4.png');
        this.load.image('player-jump', 'assets/images/player/jump.png');
        this.load.image('player-fall', 'assets/images/player/fall.png');
        
        // Platforms and tiles
        this.load.image('ground-tile', 'assets/images/tiles/ground.png');
        this.load.image('platform-tile', 'assets/images/tiles/platform.png');
        
        // Props
        this.load.image('coin', 'assets/images/items/coin.png');
        this.load.image('spike', 'assets/images/hazards/spike.png');
    }

    create() {
        // === CREATE ANIMATIONS FROM INDIVIDUAL IMAGES ===
        
        // Idle animation
        this.anims.create({
            key: 'player-idle',
            frames: [{ key: 'player-idle' }],
            frameRate: 1
        });
        
        // Walk animation
        this.anims.create({
            key: 'player-walk',
            frames: [
                { key: 'player-walk-1' },
                { key: 'player-walk-2' },
                { key: 'player-walk-3' },
                { key: 'player-walk-4' }
            ],
            frameRate: 10,
            repeat: -1
        });
        
        // Jump animation
        this.anims.create({
            key: 'player-jump',
            frames: [{ key: 'player-jump' }],
            frameRate: 1
        });
        
        // Fall animation
        this.anims.create({
            key: 'player-fall',
            frames: [{ key: 'player-fall' }],
            frameRate: 1
        });
        
        this.scene.start('GameScene');
    }
}
