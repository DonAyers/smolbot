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
        
        // Load enemy assets (red robot)
        this.load.image('enemy-idle', 'assets/images/enemy-idle.png');
        this.load.image('enemy-walk-1', 'assets/images/enemy-walk-1.png');
        this.load.image('enemy-walk-2', 'assets/images/enemy-walk-2.png');
        
        // Load new 64x64 platform tiles
        this.load.image('tile-grass-block', 'assets/images/tile-grass-block.png');
        this.load.image('tile-dirt-block', 'assets/images/tile-dirt-block.png');
        this.load.image('tile-brick', 'assets/images/tile-brick.png');
        
        // Load building tiles for vertical structures
        this.load.image('building-window', 'assets/images/building-window.png');
        this.load.image('building-wall', 'assets/images/building-wall.png');
        
        // Load background
        this.load.image('background', 'assets/images/background.png');
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
        
        // Create enemy animations
        this.anims.create({
            key: 'enemy-idle',
            frames: [{ key: 'enemy-idle' }],
            frameRate: 1
        });
        
        this.anims.create({
            key: 'enemy-walk',
            frames: [
                { key: 'enemy-walk-1' },
                { key: 'enemy-walk-2' }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        this.scene.start('GameScene');
    }
}
