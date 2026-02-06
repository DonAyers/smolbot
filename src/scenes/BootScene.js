import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create a simple loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
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

        // Load robot character assets
        this.load.image('robot-idle', 'assets/images/robot-idle.png');
        this.load.image('robot-walk-1', 'assets/images/robot-walk-1.png');
        this.load.image('robot-walk-2', 'assets/images/robot-walk-2.png');
        this.load.image('robot-jump', 'assets/images/robot-jump.png');
        this.load.image('robot-fall', 'assets/images/robot-fall.png');
        
        // Load platform tiles
        this.load.image('tile-grass', 'assets/images/tile-grass.png');
        this.load.image('tile-dirt', 'assets/images/tile-dirt.png');
    }

    create() {
        // Create robot animations
        this.anims.create({
            key: 'robot-idle',
            frames: [{ key: 'robot-idle' }],
            frameRate: 1
        });
        
        this.anims.create({
            key: 'robot-walk',
            frames: [
                { key: 'robot-walk-1' },
                { key: 'robot-walk-2' }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        this.anims.create({
            key: 'robot-jump',
            frames: [{ key: 'robot-jump' }],
            frameRate: 1
        });
        
        this.anims.create({
            key: 'robot-fall',
            frames: [{ key: 'robot-fall' }],
            frameRate: 1
        });
        
        this.scene.start('GameScene');
    }
}
