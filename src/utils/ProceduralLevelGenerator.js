import { createNoise2D } from 'simplex-noise';

export default class ProceduralLevelGenerator {
    constructor(scene) {
        this.scene = scene;
        this.platforms = null;
        this.noise = createNoise2D();
    }

    generateLevel() {
        // Create a physics group for platforms
        this.platforms = this.scene.physics.add.staticGroup();

        // Level parameters
        const levelWidth = 800;
        const levelHeight = 600;
        const platformWidth = 50;
        const platformHeight = 20;
        
        // Ground level
        this.createGround(levelWidth, levelHeight);
        
        // Generate floating platforms using Perlin noise
        this.generatePlatforms(levelWidth, levelHeight, platformWidth, platformHeight);
        
        return this.platforms;
    }

    createGround(width, height) {
        // Create solid ground at the bottom using tile sprites
        const groundY = height - 50;
        const tileSize = 18; // Kenney tiles are 18x18
        const numGroundTiles = Math.ceil(width / tileSize);
        
        for (let i = 0; i < numGroundTiles; i++) {
            const x = i * tileSize + tileSize / 2;
            
            // Use tile sprite if loaded, otherwise use colored rectangle
            let ground;
            if (this.scene.textures.exists('tile-grass')) {
                ground = this.scene.add.image(x, groundY, 'tile-grass');
            } else {
                ground = this.scene.add.rectangle(x, groundY, tileSize, tileSize, 0x4a4a4a);
            }
            
            this.scene.physics.add.existing(ground, true);
            this.platforms.add(ground);
        }
    }

    generatePlatforms(width, height, platformWidth, platformHeight) {
        const seed = Math.random() * 1000;
        const numPlatforms = 12;
        const tileSize = 18;
        
        for (let i = 0; i < numPlatforms; i++) {
            // Use noise for more organic placement
            const noiseX = this.noise(i * 0.3 + seed, 0);
            const noiseY = this.noise(0, i * 0.3 + seed);
            
            // Map noise values (-1 to 1) to screen coordinates
            const x = ((noiseX + 1) / 2) * (width - 150) + 75;
            const y = ((noiseY + 1) / 2) * (height - 250) + 100;
            
            // Vary platform width (2-6 tiles)
            const numTiles = 2 + Math.floor(Math.random() * 5);
            
            // Create platform from tiles
            for (let j = 0; j < numTiles; j++) {
                const tileX = x + (j - numTiles / 2) * tileSize;
                
                let platform;
                if (this.scene.textures.exists('tile-dirt')) {
                    platform = this.scene.add.image(tileX, y, 'tile-dirt');
                } else {
                    platform = this.scene.add.rectangle(tileX, y, tileSize, tileSize, 0x6a6a6a);
                }
                
                this.scene.physics.add.existing(platform, true);
                this.platforms.add(platform);
            }
        }
    }

    // Alternative generation method using rooms/chunks
    generateChunkedLevel() {
        // This method could be used for more structured levels
        // Implement room templates and stitch them together
        // Example: Create predefined room patterns and randomly arrange them
    }

    // Alternative generation method using maze algorithm
    generateMazeLevel() {
        // Use the generate-maze package to create a maze-like structure
        // Then convert maze cells to platforms
        // const Maze = require('generate-maze');
        // const maze = Maze(20, 15, true, Math.random());
        // Convert maze array to platforms...
    }
}
