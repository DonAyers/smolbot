import Phaser from 'phaser';
import ProceduralLevelGenerator from '../utils/ProceduralLevelGenerator';
import Player from '../components/Player';
import Enemy from '../components/Enemy';
import HealthUI from '../components/HealthUI';
import AnimationDebugger from '../utils/AnimationDebugger';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const levelWidth = 4000;
        const levelHeight = 1200;
        
        // Set world bounds
        this.physics.world.setBounds(0, 0, levelWidth, levelHeight);
        
        // Set camera background color (in case graphics don't cover everything)
        this.cameras.main.setBackgroundColor('#87CEEB');
        
        // --- Parallax background layers ---
        // Create a sky rectangle that's larger than the screen to ensure full coverage
        const skyWidth = this.cameras.main.width * 2; // Extra wide
        const skyHeight = this.cameras.main.height * 2; // Extra tall
        
        const skyGraphics = this.add.graphics();
        skyGraphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xC8E6FF, 0xC8E6FF, 1);
        skyGraphics.fillRect(-skyWidth / 2, -skyHeight / 2, skyWidth, skyHeight);
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
        
        // Hills layer (medium parallax) - positioned at bottom of screen
        const hillScale = 2.5;
        const hillTileW = 256 * hillScale;
        const hillTileH = 256 * hillScale;
        const numHillTiles = Math.ceil(levelWidth / hillTileW) + 1;
        for (let i = 0; i < numHillTiles; i++) {
            // Position hills at the bottom of the world
            this.add.image(i * hillTileW, levelHeight - hillTileH, 'bg_hills')
                .setOrigin(0, 0)
                .setDisplaySize(hillTileW, hillTileH)
                .setScrollFactor(0.3)
                .setDepth(-8);
        }
        
        // Trees layer (closer parallax, scattered placement)
        const treeTypes = ['tree_green_01', 'tree_green_02', 'tree_green_03', 'tree_green_04', 'tree_green_05'];
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * levelWidth;
            const y = levelHeight - 250 - Math.random() * 100;
            const treeKey = treeTypes[Math.floor(Math.random() * treeTypes.length)];
            this.add.image(x, y, treeKey)
                .setOrigin(0.5, 1)
                .setScale(0.6 + Math.random() * 0.4)
                .setScrollFactor(0.5)
                .setDepth(-7);
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
        this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
        
        // Create enemies group
        this.enemies = this.physics.add.group();
        
        // Spawn a few enemies on platforms
        this.spawnEnemies(platforms);
        
        // Add collision between enemies and platforms
        this.physics.add.collider(this.enemies, platforms);
        
        // Add collision between player and enemies (damage)
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        
        // Display instructions (fixed to camera)
        this.add.text(16, 16, 'smolbot', {
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
        
        this.add.text(16, 110, 'Press V to view sprites', {
            fontSize: '14px',
            fill: '#00ffff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0).setDepth(100);
        
        // Create Health UI (below instructions)
        this.healthUI = new HealthUI(this, 20, 145, this.player.stats);
        
        // Create Animation Debugger (press D to toggle)
        this.animDebugger = new AnimationDebugger(this, this.player);
        
        // Add R key to regenerate level
        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();
        });
        
        // Add V key to open sprite viewer
        this.input.keyboard.on('keydown-V', () => {
            this.scene.pause();
            this.scene.launch('SpriteViewerScene');
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
        
        // Update Health UI
        if (this.healthUI) {
            this.healthUI.update();
        }
        
        // Update Animation Debugger
        if (this.animDebugger) {
            this.animDebugger.update();
        }
        
        // Update all enemies
        this.enemies.getChildren().forEach(enemy => {
            enemy.update();
        });
        
        // Check for game over
        if (this.player && this.player.stats.isDead() && !this.gameOverShown) {
            this.showGameOver();
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        // Only take damage if not already invulnerable
        if (!player.stats.isInvulnerable) {
            player.takeDamage(1);
        }
    }

    showGameOver() {
        this.gameOverShown = true;
        
        const centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        
        const gameOverText = this.add.text(centerX, centerY, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
        
        const restartText = this.add.text(centerX, centerY + 60, 'Press R to Restart', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
    }
}
