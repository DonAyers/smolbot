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
        const groundLevel = 1000; // Where platforms start
        
        // Set world bounds
        this.physics.world.setBounds(0, 0, levelWidth, levelHeight);
        
        // Set camera background color as fallback
        this.cameras.main.setBackgroundColor('#87CEEB');
        
        // --- Parallax background layers ---
        
        // 1. SKY - Enhanced multi-stop gradient fixed to camera
        // Fills the entire camera viewport regardless of world position
        const skyGraphics = this.add.graphics();
        skyGraphics.fillGradientStyle(
            0x5B8DBE, 0x5B8DBE,  // Top color (deeper blue)
            0xB8D8F0, 0xB8D8F0,  // Bottom color (horizon glow)
            1
        );
        skyGraphics.fillRect(0, 0, 1280, 720); // Match camera size
        skyGraphics.setScrollFactor(0); // Fixed to camera
        skyGraphics.setDepth(-100);
        
        // 2. DISTANT MOUNTAINS - Very slow parallax, furthest back
        this.createDistantMountains(levelWidth, groundLevel);
        
        // 3. FAR CITYSCAPE SILHOUETTES - Distant skyscrapers
        this.createFarCityscape(levelWidth, groundLevel);
        
        // 4. FAR CLOUDS - Slow parallax, tiled across world
        const cloudScale = 2;
        const cloudTileW = 256 * cloudScale;
        const cloudTileH = 256 * cloudScale;
        const numCloudTiles = Math.ceil(levelWidth / cloudTileW) + 2;
        
        for (let i = 0; i < numCloudTiles; i++) {
            this.add.image(i * cloudTileW, 200, 'bg_clouds')
                .setOrigin(0, 0)
                .setDisplaySize(cloudTileW, cloudTileH)
                .setScrollFactor(0.1)
                .setDepth(-50)
                .setAlpha(0.8);
        }
        
        // 5. MID-DISTANCE INDUSTRIAL STRUCTURES - Smokestacks, water towers
        this.createIndustrialStructures(levelWidth, groundLevel);
        
        // 6. HILLS - Medium parallax, tiled across world at ground level
        const hillScale = 2.5;
        const hillTileW = 256 * hillScale;
        const hillTileH = 256 * hillScale;
        const numHillTiles = Math.ceil(levelWidth / hillTileW) + 2;
        
        for (let i = 0; i < numHillTiles; i++) {
            // Position hills so their bottom aligns with ground level
            this.add.image(i * hillTileW, groundLevel - hillTileH, 'bg_hills')
                .setOrigin(0, 0)
                .setDisplaySize(hillTileW, hillTileH)
                .setScrollFactor(0.3)
                .setDepth(-30);
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

    createDistantMountains(levelWidth, groundLevel) {
        // Create layered mountain silhouettes in the far background
        const mountainGraphics = this.add.graphics();
        const mountainColor = 0x3A4A5C; // Dark blue-gray
        
        // Generate 3-4 mountain peaks across the level
        const numPeaks = 3 + Math.floor(Math.random() * 2);
        const peakSpacing = levelWidth / numPeaks;
        
        for (let i = 0; i < numPeaks; i++) {
            const peakX = i * peakSpacing + peakSpacing / 2 + (Math.random() - 0.5) * peakSpacing * 0.3;
            const peakHeight = 200 + Math.random() * 150;
            const peakWidth = 300 + Math.random() * 200;
            const baseY = groundLevel - 200;
            
            // Draw triangular mountain peak
            mountainGraphics.fillStyle(mountainColor, 0.6);
            mountainGraphics.fillTriangle(
                peakX, baseY - peakHeight,           // Top
                peakX - peakWidth / 2, baseY,        // Bottom left
                peakX + peakWidth / 2, baseY         // Bottom right
            );
        }
        
        mountainGraphics.setDepth(-80);
        mountainGraphics.setScrollFactor(0.05);
    }

    createFarCityscape(levelWidth, groundLevel) {
        // Create distant skyscraper silhouettes
        const cityscapeColor = 0x556677;
        const numBuildings = 8 + Math.floor(Math.random() * 4);
        const spacing = levelWidth / numBuildings;
        
        for (let i = 0; i < numBuildings; i++) {
            const x = i * spacing + Math.random() * spacing * 0.5;
            const width = 40 + Math.random() * 80;
            const height = 150 + Math.random() * 250;
            const y = groundLevel - 250;
            
            // Building silhouette
            const building = this.add.rectangle(
                x + width / 2,
                y - height / 2,
                width,
                height,
                cityscapeColor,
                0.4
            );
            building.setDepth(-40);
            building.setScrollFactor(0.2);
            building.setOrigin(0.5, 0.5);
            
            // Add occasional lit windows as small dots
            if (Math.random() < 0.6) {
                const numWindows = 3 + Math.floor(Math.random() * 5);
                for (let w = 0; w < numWindows; w++) {
                    const winX = x + 10 + Math.random() * (width - 20);
                    const winY = y - 20 - Math.random() * (height - 40);
                    
                    const window = this.add.circle(winX, winY, 2, 0xFFFF88, 0.6);
                    window.setDepth(-39);
                    window.setScrollFactor(0.2);
                }
            }
        }
    }

    createIndustrialStructures(levelWidth, groundLevel) {
        // Add smokestacks, water towers, and industrial shapes
        const numStructures = 5 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numStructures; i++) {
            const x = 200 + Math.random() * (levelWidth - 400);
            const structureType = Math.random();
            
            if (structureType < 0.5) {
                // Smokestack
                const stackHeight = 100 + Math.random() * 80;
                const stackWidth = 15 + Math.random() * 10;
                const y = groundLevel - 180;
                
                const stack = this.add.rectangle(
                    x,
                    y - stackHeight / 2,
                    stackWidth,
                    stackHeight,
                    0x666666,
                    0.5
                );
                stack.setDepth(-20);
                stack.setScrollFactor(0.4);
                
                // Smoke puff at top
                const smoke = this.add.circle(x, y - stackHeight, stackWidth, 0x888888, 0.3);
                smoke.setDepth(-20);
                smoke.setScrollFactor(0.4);
                
            } else {
                // Water tower or tank
                const tankHeight = 40 + Math.random() * 30;
                const tankWidth = 50 + Math.random() * 30;
                const legHeight = 60 + Math.random() * 40;
                const y = groundLevel - 150;
                
                // Tank body
                const tank = this.add.ellipse(
                    x,
                    y - legHeight - tankHeight / 2,
                    tankWidth,
                    tankHeight,
                    0x777777,
                    0.5
                );
                tank.setDepth(-20);
                tank.setScrollFactor(0.4);
                
                // Support legs
                const leg1 = this.add.rectangle(x - tankWidth / 3, y - legHeight / 2, 4, legHeight, 0x666666, 0.5);
                leg1.setDepth(-20);
                leg1.setScrollFactor(0.4);
                
                const leg2 = this.add.rectangle(x + tankWidth / 3, y - legHeight / 2, 4, legHeight, 0x666666, 0.5);
                leg2.setDepth(-20);
                leg2.setScrollFactor(0.4);
            }
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
