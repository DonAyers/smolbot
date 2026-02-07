import Phaser from 'phaser';
import ProceduralLevelGenerator from '../utils/ProceduralLevelGenerator';
import Player from '../components/Player';
import Enemy from '../components/Enemy';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const levelWidth = 4000;
        const levelHeight = 1200;
        
        // --- Parallax background layers ---
        // Sky gradient fill behind everything
        const skyGraphics = this.add.graphics();
        skyGraphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xC8E6FF, 0xC8E6FF, 1);
        skyGraphics.fillRect(0, 0, levelWidth, levelHeight);
        skyGraphics.setScrollFactor(0).setDepth(-10);
        
        // Far clouds layer (slowest parallax)
        const cloudScale = 2;
        const cloudTileW = 256 * cloudScale;
        const cloudTileH = 256 * cloudScale;
        const numCloudTiles = Math.ceil(levelWidth / cloudTileW) + 1;
        for (let i = 0; i < numCloudTiles; i++) {
            const cloud = this.add.image(i * cloudTileW, 50, 'bg_clouds')
                .setOrigin(0, 0)
                .setDisplaySize(cloudTileW, cloudTileH)
                .setScrollFactor(0.1)
                .setDepth(-9)
                .setAlpha(0.7);
        }
        
        // Hills layer (medium parallax)
        const hillScale = 2.5;
        const hillTileW = 256 * hillScale;
        const hillTileH = 256 * hillScale;
        const numHillTiles = Math.ceil(levelWidth / hillTileW) + 1;
        for (let i = 0; i < numHillTiles; i++) {
            this.add.image(i * hillTileW, levelHeight - hillTileH - 20, 'bg_hills')
                .setOrigin(0, 0)
                .setDisplaySize(hillTileW, hillTileH)
                .setScrollFactor(0.3)
                .setDepth(-8);
        }
        
        // Initialize the procedural level generator
        const levelGenerator = new ProceduralLevelGenerator(this);
        
        // Generate a level (this will create platforms and obstacles)
        const platforms = levelGenerator.generateLevel();
        
        // Add player character with robot spritesheet
        this.player = new Player(this, 100, 1000);
        this.physics.add.collider(this.player, platforms);
        
        // Make camera follow the player with smooth lerp
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1);
        
        // Create enemies group
        this.enemies = this.physics.add.group();
        
        // Spawn a few enemies on platforms
        this.spawnEnemies(platforms);
        
        // Add collision between enemies and platforms
        this.physics.add.collider(this.enemies, platforms);
        
        // Display instructions (fixed to camera)
        this.add.text(16, 16, 'Side-Scrolling Platformer', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0).setDepth(100);
        
        this.add.text(16, 56, 'Arrow keys to move, Up/Space to jump!', {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0).setDepth(100);
        
        this.add.text(16, 86, 'Press R to regenerate level', {
            fontSize: '14px',
            fill: '#ffff00',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0).setDepth(100);
        
        // Add R key to regenerate level
        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();
        });
    }
    
    spawnEnemies(platforms) {
        // Spawn enemies along the ground at intervals
        const groundY = 1060; // slightly above ground level
        const levelWidth = 4000;
        const numEnemies = 4 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < numEnemies; i++) {
            const x = 400 + (levelWidth - 800) * (i / numEnemies) + Math.random() * 200;
            const enemy = new Enemy(
                this,
                x,
                groundY,
                'enemy-idle',
                120
            );
            this.enemies.add(enemy);
        }
    }

    update(time, delta) {
        // Update player
        if (this.player) {
            this.player.update(time, delta);
        }
        
        // Update all enemies
        this.enemies.getChildren().forEach(enemy => {
            enemy.update();
        });
    }
}
