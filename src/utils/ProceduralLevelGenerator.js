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

        // Expanded level parameters for side-scrolling
        const levelWidth = 4000; // 5x wider than screen
        const levelHeight = 2400; // 4x taller than screen
        const platformWidth = 50;
        const platformHeight = 20;
        
        // Set world bounds for the camera and physics
        this.scene.physics.world.setBounds(0, 0, levelWidth, levelHeight);
        this.scene.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
        
        // Ground level
        this.createGround(levelWidth, levelHeight);
        
        // Generate floating platforms using Perlin noise
        this.generatePlatforms(levelWidth, levelHeight, platformWidth, platformHeight);
        
        // Generate tall building-like structures
        this.generateBuildings(levelWidth, levelHeight);
        
        return this.platforms;
    }

    createGround(width, height) {
        // Create solid ground at the bottom using tile sprites
        const groundY = height - 50;
        const tileSize = 64; // New tiles are 64x64
        const numGroundTiles = Math.ceil(width / tileSize);
        
        for (let i = 0; i < numGroundTiles; i++) {
            const x = i * tileSize + tileSize / 2;
            
            // Use tile sprite if loaded, otherwise use colored rectangle
            let ground;
            if (this.scene.textures.exists('tile-grass-block')) {
                ground = this.scene.add.image(x, groundY, 'tile-grass-block');
            } else {
                ground = this.scene.add.rectangle(x, groundY, tileSize, tileSize, 0x4a4a4a);
            }
            
            this.scene.physics.add.existing(ground, true);
            this.platforms.add(ground);
        }
    }

    generatePlatforms(width, height, platformWidth, platformHeight) {
        const seed = Math.random() * 1000;
        const numPlatforms = 60; // More platforms for larger world
        const tileSize = 64; // New tiles are 64x64
        
        for (let i = 0; i < numPlatforms; i++) {
            // Use noise for more organic placement
            const noiseX = this.noise(i * 0.3 + seed, 0);
            const noiseY = this.noise(0, i * 0.3 + seed);
            
            // Map noise values (-1 to 1) to screen coordinates
            const x = ((noiseX + 1) / 2) * (width - 150) + 75;
            const y = ((noiseY + 1) / 2) * (height - 300) + 100;
            
            // Vary platform width (2-6 tiles for good jumpability)
            const numTiles = 2 + Math.floor(Math.random() * 5);
            
            // Create platform from tiles
            for (let j = 0; j < numTiles; j++) {
                const tileX = x + (j - numTiles / 2) * tileSize;
                
                let platform;
                if (this.scene.textures.exists('tile-dirt-block')) {
                    platform = this.scene.add.image(tileX, y, 'tile-dirt-block');
                } else {
                    platform = this.scene.add.rectangle(tileX, y, tileSize, tileSize, 0x6a6a6a);
                }
                
                this.scene.physics.add.existing(platform, true);
                this.platforms.add(platform);
            }
        }
    }
    
    generateBuildings(width, height) {
        const tileSize = 70; // Building tiles are 70x70
        const numBuildings = 8; // Number of tall structures
        
        for (let i = 0; i < numBuildings; i++) {
            // Evenly distribute buildings across the level
            const baseX = (width / numBuildings) * i + (width / numBuildings / 2);
            
            // Vary building height (tall buildings for vertical exploration)
            const buildingHeight = 400 + Math.random() * 800;
            const buildingWidth = 3 + Math.floor(Math.random() * 4); // 3-6 tiles wide
            
            // Start from ground and build up
            const groundY = height - 50;
            const numFloors = Math.floor(buildingHeight / (tileSize * 2)); // Space between floors
            
            for (let floor = 0; floor < numFloors; floor++) {
                const floorY = groundY - (floor * tileSize * 2);
                
                // Create floor platform with windows
                for (let j = 0; j < buildingWidth; j++) {
                    const tileX = baseX + (j - buildingWidth / 2) * tileSize;
                    
                    let platform;
                    // Alternate between windows and walls for variety
                    const useWindow = Math.random() > 0.3;
                    
                    if (this.scene.textures.exists('building-window') && useWindow) {
                        platform = this.scene.add.image(tileX, floorY, 'building-window');
                    } else if (this.scene.textures.exists('building-wall')) {
                        platform = this.scene.add.image(tileX, floorY, 'building-wall');
                    } else {
                        platform = this.scene.add.rectangle(tileX, floorY, tileSize, tileSize, 0x8a8a8a);
                    }
                    
                    this.scene.physics.add.existing(platform, true);
                    this.platforms.add(platform);
                }
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
