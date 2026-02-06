import Phaser from 'phaser';
import ProceduralLevelGenerator from '../utils/ProceduralLevelGenerator';
import Player from '../components/Player';
import Enemy from '../components/Enemy';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Add parallax background
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.setScrollFactor(0.3); // Slower scroll for parallax effect
        
        // Tile the background to cover the expanded world
        for (let i = 1; i < 3; i++) {
            const bgTile = this.add.image(bg.width * i, 0, 'background').setOrigin(0, 0);
            bgTile.setScrollFactor(0.3);
        }
        
        // Initialize the procedural level generator
        const levelGenerator = new ProceduralLevelGenerator(this);
        
        // Generate a level (this will create platforms and obstacles)
        const platforms = levelGenerator.generateLevel();
        
        // Add player character
        this.player = new Player(this, 100, 450, 'robot-idle');
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
        // Spawn enemies on some platforms
        const platformChildren = platforms.getChildren();
        
        // Pick a few platforms to spawn enemies on (skip the first few near spawn)
        for (let i = 5; i < platformChildren.length; i += 3) {
            const platform = platformChildren[i];
            if (platform) {
                const enemy = new Enemy(
                    this, 
                    platform.x, 
                    platform.y - 50, 
                    'enemy-idle',
                    80 // patrol distance
                );
                this.enemies.add(enemy);
            }
        }
    }

    update() {
        // Update player
        if (this.player) {
            this.player.update();
        }
        
        // Update all enemies
        this.enemies.getChildren().forEach(enemy => {
            enemy.update();
        });
    }
}
