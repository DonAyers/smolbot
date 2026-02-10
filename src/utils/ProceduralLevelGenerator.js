import { createNoise2D } from 'simplex-noise';

// Building style definitions using the Kenney building tiles (70x70 each)
const BUILDING_STYLES = [
    {
        name: 'dark',
        type: 'residential',
        bottomLeft: 'houseDarkBottomLeft',
        bottomMid: 'houseDarkBottomMid',
        bottomRight: 'houseDarkBottomRight',
        midLeft: 'houseDarkMidLeft',
        midRight: 'houseDarkMidRight',
        topLeft: 'houseDarkTopLeft',
        topMid: 'houseDarkTopMid',
        topRight: 'houseDarkTopRight',
    },
    {
        name: 'beige',
        type: 'residential',
        bottomLeft: 'houseBeigeBottomLeft',
        bottomMid: 'houseBeigeBottomMid',
        bottomRight: 'houseBeigeBottomRight',
        midLeft: 'houseBeigeMidLeft',
        midRight: 'houseBeigeMidRight',
        topLeft: 'houseBeigeTopLeft',
        topMid: 'houseBeigeTopMid',
        topRight: 'houseBeigeTopRight',
    },
    {
        name: 'gray',
        type: 'residential',
        bottomLeft: 'houseGrayBottomLeft',
        bottomMid: 'houseGrayBottomMid',
        bottomRight: 'houseGrayBottomRight',
        midLeft: 'houseGrayMidLeft',
        midRight: 'houseGrayMidRight',
        topLeft: 'houseGrayTopLeft',
        topMid: 'houseGrayTopMid',
        topRight: 'houseGrayTopRight',
    },
    {
        name: 'brick_brown',
        type: 'industrial',
        bottomLeft: 'bricks_brown',
        bottomMid: 'bricks_brown',
        bottomRight: 'bricks_brown',
        midLeft: 'bricks_brown',
        midRight: 'bricks_brown',
        topLeft: 'bricks_brown',
        topMid: 'bricks_brown',
        topRight: 'bricks_brown',
    },
    {
        name: 'brick_grey',
        type: 'industrial',
        bottomLeft: 'bricks_grey',
        bottomMid: 'bricks_grey',
        bottomRight: 'bricks_grey',
        midLeft: 'bricks_grey',
        midRight: 'bricks_grey',
        topLeft: 'bricks_grey',
        topMid: 'bricks_grey',
        topRight: 'bricks_grey',
    }
];

const ROOF_STYLES = [
    {
        left: 'roofRedLeft', mid: 'roofRedMid', right: 'roofRedRight',
        topLeft: 'roofRedTopLeft', topMid: 'roofRedTopMid', topRight: 'roofRedTopRight'
    },
    {
        left: 'roofGreyLeft', mid: 'roofGreyMid', right: 'roofGreyRight',
        topLeft: 'roofGreyTopLeft', topMid: 'roofGreyTopMid', topRight: 'roofGreyTopRight'
    }
];

const WINDOW_TYPES = ['bldg-window', 'windowOpen', 'windowCheckered'];
const DOOR_TYPES = ['doorKnob', 'doorKnobAlt'];
const ROOFTOP_PROPS = ['box', 'crate', 'computer', 'machine'];
const BUILDING_PROPS = ['ac-unit', 'ladder-attached', 'pipe', 'pipe2', 'vent', 'neon'];

const TILE_SIZE = 70; // All building/grass tiles are 70x70
const BUILDING_SCALE = 0.5; // Scale buildings down to fit better with player

// Tree types for background decoration
const TREE_TYPES = [
    'tree_green_01', 'tree_green_02', 'tree_green_03', 'tree_green_04', 
    'tree_green_05', 'tree_green_08', 'tree_green_09',
    'tree_orange_01', 'tree_orange_02', 'tree_orange_03', 'tree_pine'
];

const BUSH_TYPES = ['bush_01', 'bush_02', 'bush_03'];
const ROCK_TYPES = ['rock_01', 'rock_02', 'rock_03'];
const BARREL_TYPES = ['barrel_01', 'barrel_02', 'barrel_green'];
const PROP_TYPES = ['pipe', 'pipe2', 'neon', 'lamp'];

export default class ProceduralLevelGenerator {
    constructor(scene) {
        this.scene = scene;
        this.platforms = null;
        this.decorations = null;
        this.noise = createNoise2D();
    }

    generateLevel() {
        this.platforms = this.scene.physics.add.staticGroup();
        this.decorations = this.scene.add.group();

        const levelWidth = 4000;
        const levelHeight = 1200;

        this.scene.physics.world.setBounds(0, 0, levelWidth, levelHeight);
        this.scene.cameras.main.setBounds(0, 0, levelWidth, levelHeight);

        const groundY = levelHeight - TILE_SIZE;

        // 1. Create the ground
        this.createGround(levelWidth, groundY);

        // 2. Add trees in background (before buildings)
        this.generateTrees(levelWidth, groundY);

        // 3. Generate buildings
        this.generateBuildings(levelWidth, groundY);

        // 4. Add floating platforms
        this.generateFloatingPlatforms(levelWidth, groundY);

        // 5. Add ground-level props and decorations
        this.generateGroundProps(levelWidth, groundY);

        return this.platforms;
    }

    createGround(width, groundY) {
        const numTiles = Math.ceil(width / TILE_SIZE) + 1;

        for (let i = 0; i < numTiles; i++) {
            const x = i * TILE_SIZE + TILE_SIZE / 2;

            // top row: grass surface
            const grass = this.scene.add.image(x, groundY, 'terrain_grass_block');
            grass.setDisplaySize(TILE_SIZE, TILE_SIZE);
            this.scene.physics.add.existing(grass, true);
            this.platforms.add(grass);

            // fill row below
            const dirt = this.scene.add.image(x, groundY + TILE_SIZE, 'terrain_dirt_block_center');
            dirt.setDisplaySize(TILE_SIZE, TILE_SIZE);
            this.scene.physics.add.existing(dirt, true);
            this.platforms.add(dirt);
        }
    }

    generateBuildings(levelWidth, groundY) {
        const scaledTileSize = TILE_SIZE * BUILDING_SCALE;
        const minGap = scaledTileSize * 6;

        let cursor = scaledTileSize * 8;

        // Background decorative buildings (no collision)
        this.generateBackgroundBuildings(levelWidth, groundY);

        // Foreground buildings (5-7 regular buildings)
        const buildingCount = 5 + Math.floor(Math.random() * 3);
        for (let i = 0; i < buildingCount && cursor < levelWidth - scaledTileSize * 6; i++) {
            const widthInTiles = 3 + Math.floor(Math.random() * 4);
            const floorsCount = 2 + Math.floor(Math.random() * 4);

            const style = BUILDING_STYLES[Math.floor(Math.random() * BUILDING_STYLES.length)];
            const roof = ROOF_STYLES[Math.floor(Math.random() * ROOF_STYLES.length)];

            // Decide if this is traversable or an obstacle
            const isTraversable = Math.random() < 0.6; // 60% have ledges

            this.createBuilding(cursor, groundY, widthInTiles, floorsCount, style, roof, isTraversable);

            cursor += widthInTiles * scaledTileSize + minGap + Math.floor(Math.random() * scaledTileSize * 3);
        }

        // Create a tall climbable building near the end
        this.createTallEndBuilding(levelWidth, groundY);
    }

    generateBackgroundBuildings(levelWidth, groundY) {
        const scaledTileSize = TILE_SIZE * BUILDING_SCALE;
        const bgBuildingCount = 4 + Math.floor(Math.random() * 3);

        for (let i = 0; i < bgBuildingCount; i++) {
            const x = 400 + Math.random() * (levelWidth - 800);
            const widthInTiles = 4 + Math.floor(Math.random() * 5);
            const floorsCount = 3 + Math.floor(Math.random() * 6);

            const style = BUILDING_STYLES[Math.floor(Math.random() * BUILDING_STYLES.length)];
            const roof = ROOF_STYLES[Math.floor(Math.random() * ROOF_STYLES.length)];

            this.createBackgroundBuilding(x, groundY, widthInTiles, floorsCount, style, roof);
        }
    }

    createBackgroundBuilding(startX, groundY, widthTiles, floors, style, roofStyle) {
        const scaledTileSize = TILE_SIZE * BUILDING_SCALE * 0.7; // Smaller for background
        const depth = -5; // Behind everything but in front of parallax
        
        // Generate unique tint for this background building (more muted)
        const bgTint = this.generateBackgroundBuildingTint();

        for (let floor = 0; floor < floors; floor++) {
            const tileY = groundY - (floor + 1) * scaledTileSize + scaledTileSize / 2;

            for (let col = 0; col < widthTiles; col++) {
                const tileX = startX + col * scaledTileSize + scaledTileSize / 2;
                let textureKey;

                const isLeft = col === 0;
                const isRight = col === widthTiles - 1;
                const isBottom = floor === 0;
                const isTop = floor === floors - 1;

                if (isBottom) {
                    textureKey = isLeft ? style.bottomLeft : isRight ? style.bottomRight : style.bottomMid;
                } else if (isTop) {
                    textureKey = isLeft ? style.topLeft : isRight ? style.topRight : style.topMid;
                } else {
                    textureKey = isLeft ? style.midLeft : isRight ? style.midRight : style.bottomMid;
                }

                const tile = this.scene.add.image(tileX, tileY, textureKey);
                tile.setScale(BUILDING_SCALE * 0.7);
                tile.setDepth(depth);
                tile.setAlpha(0.7); // Increased from 0.6 for better visibility
                tile.setTint(bgTint); // Apply muted tint
                tile.setScrollFactor(0.5); // Parallax effect
                this.decorations.add(tile);
                
                // Add sparse windows to background buildings
                if (!isLeft && !isRight && floor > 0 && floor < floors - 1 && Math.random() < 0.4) {
                    const win = this.scene.add.rectangle(
                        tileX, tileY,
                        scaledTileSize * 0.3,
                        scaledTileSize * 0.4,
                        0xFFFF88,
                        0.3
                    );
                    win.setDepth(depth + 1);
                    win.setScrollFactor(0.5);
                    this.decorations.add(win);
                }
            }
        }

        // Add roof
        const roofBaseY = groundY - floors * scaledTileSize - scaledTileSize / 2;
        for (let col = 0; col < widthTiles; col++) {
            const tileX = startX + col * scaledTileSize + scaledTileSize / 2;
            const isLeft = col === 0;
            const isRight = col === widthTiles - 1;
            const roofKey = isLeft ? roofStyle.topLeft : isRight ? roofStyle.topRight : roofStyle.topMid;
            const roofTop = this.scene.add.image(tileX, roofBaseY, roofKey);
            roofTop.setScale(BUILDING_SCALE * 0.7);
            roofTop.setDepth(depth);
            roofTop.setAlpha(0.6);
            roofTop.setScrollFactor(0.5);
            this.decorations.add(roofTop);
        }
    }

    createTallEndBuilding(levelWidth, groundY) {
        const scaledTileSize = TILE_SIZE * BUILDING_SCALE;
        const startX = levelWidth - scaledTileSize * 12; // Near the end
        const widthInTiles = 5;
        const floorsCount = 12 + Math.floor(Math.random() * 4); // 12-15 floors!

        // Pick an industrial style for the tall building
        const industrialStyles = BUILDING_STYLES.filter(s => s.type === 'industrial');
        const style = industrialStyles[Math.floor(Math.random() * industrialStyles.length)];
        const roof = ROOF_STYLES[Math.floor(Math.random() * ROOF_STYLES.length)];

        // Create the main building structure
        this.createBuilding(startX, groundY, widthInTiles, floorsCount, style, roof, true);

        // Add extra ledges on alternating floors for climbing
        for (let floor = 2; floor < floorsCount; floor += 2) {
            const ledgeY = groundY - (floor + 0.5) * scaledTileSize;
            const buildingRightX = startX + widthInTiles * scaledTileSize;

            // Right side ledge for climbing
            const ledgeWidth = 2;
            for (let t = 0; t < ledgeWidth; t++) {
                const tileX = buildingRightX + t * scaledTileSize + scaledTileSize / 2;
                const key = t === ledgeWidth - 1 ? 'grassHalfRight' : 'grassHalfMid';

                const plat = this.scene.add.image(tileX, ledgeY, key);
                plat.setScale(BUILDING_SCALE);
                this.scene.physics.add.existing(plat, true);
                plat.body.setSize(TILE_SIZE * BUILDING_SCALE, TILE_SIZE * BUILDING_SCALE);
                this.platforms.add(plat);
            }
        }
    }

    createBuilding(startX, groundY, widthTiles, floors, style, roofStyle, isTraversable = true) {
        const scaledTileSize = TILE_SIZE * BUILDING_SCALE;
        
        // Choose window pattern for this building
        const windowPattern = this.chooseWindowPattern(style.type);
        
        // Add subtle color variation per building
        const buildingTint = this.generateBuildingTint(style.type);
        
        for (let floor = 0; floor < floors; floor++) {
            const tileY = groundY - (floor + 1) * scaledTileSize + scaledTileSize / 2;

            for (let col = 0; col < widthTiles; col++) {
                const tileX = startX + col * scaledTileSize + scaledTileSize / 2;
                let textureKey;

                const isLeft = col === 0;
                const isRight = col === widthTiles - 1;
                const isBottom = floor === 0;
                const isTop = floor === floors - 1;

                if (isBottom) {
                    textureKey = isLeft ? style.bottomLeft : isRight ? style.bottomRight : style.bottomMid;
                } else if (isTop) {
                    textureKey = isLeft ? style.topLeft : isRight ? style.topRight : style.topMid;
                } else {
                    if (isLeft) textureKey = style.midLeft;
                    else if (isRight) textureKey = style.midRight;
                    else textureKey = style.bottomMid;
                }

                const tile = this.scene.add.image(tileX, tileY, textureKey);
                tile.setScale(BUILDING_SCALE);
                tile.setTint(buildingTint); // Apply color variation
                this.scene.physics.add.existing(tile, true);
                tile.body.setSize(TILE_SIZE * BUILDING_SCALE, TILE_SIZE * BUILDING_SCALE);
                this.platforms.add(tile);

                // Add windows using pattern-based logic with enhanced lighting
                if (!isLeft && !isRight && !isBottom && floor > 0) {
                    if (this.shouldPlaceWindow(floor, col, widthTiles, floors, windowPattern)) {
                        const winType = style.type === 'industrial' ? 'building-window' : 
                                      WINDOW_TYPES[Math.floor(Math.random() * WINDOW_TYPES.length)];
                        const win = this.scene.add.image(tileX, tileY, winType);
                        win.setScale(BUILDING_SCALE);
                        win.setDepth(1);
                        
                        // Enhanced window glow with more variety and warmth
                        const glowChance = Math.random();
                        if (glowChance < 0.5) {
                            // 50% warm yellow/orange glow
                            const warmTints = [0xFFFF99, 0xFFFF88, 0xFFDD88, 0xFFF0AA];
                            win.setTint(warmTints[Math.floor(Math.random() * warmTints.length)]);
                        } else if (glowChance < 0.65) {
                            // 15% cool blue/cyan glow (screens, TVs)
                            const coolTints = [0x88CCFF, 0x99DDFF, 0xAADDFF];
                            win.setTint(coolTints[Math.floor(Math.random() * coolTints.length)]);
                        }
                        // 35% no tint (dark/off windows)
                        
                        this.decorations.add(win);
                    }
                }

                // Add door on ground floor interior
                if (isBottom && !isLeft && !isRight && col === Math.floor(widthTiles / 2)) {
                    const doorType = style.type === 'industrial' ? 'building-door' :
                                   DOOR_TYPES[Math.floor(Math.random() * DOOR_TYPES.length)];
                    const door = this.scene.add.image(tileX, tileY, doorType);
                    door.setScale(BUILDING_SCALE);
                    door.setDepth(1);
                    this.decorations.add(door);
                }
            }
        }

        // Roof
        const roofBaseY = groundY - floors * scaledTileSize - scaledTileSize / 2;
        const roofTopY = roofBaseY - scaledTileSize;

        for (let col = 0; col < widthTiles; col++) {
            const tileX = startX + col * scaledTileSize + scaledTileSize / 2;
            const isLeft = col === 0;
            const isRight = col === widthTiles - 1;

            const roofBottomKey = isLeft ? roofStyle.left : isRight ? roofStyle.right : roofStyle.mid;
            const roofBottom = this.scene.add.image(tileX, roofBaseY, roofBottomKey);
            roofBottom.setScale(BUILDING_SCALE);
            this.scene.physics.add.existing(roofBottom, true);
            roofBottom.body.setSize(TILE_SIZE * BUILDING_SCALE, TILE_SIZE * BUILDING_SCALE);
            this.platforms.add(roofBottom);

            const roofTopKey = isLeft ? roofStyle.topLeft : isRight ? roofStyle.topRight : roofStyle.topMid;
            const roofTop = this.scene.add.image(tileX, roofTopY, roofTopKey);
            roofTop.setScale(BUILDING_SCALE);
            this.decorations.add(roofTop);
        }

        // Chimney on residential buildings
        if (style.type === 'residential' && Math.random() < 0.6) {
            const chimneyX = startX + Math.floor(widthTiles * 0.7) * scaledTileSize + scaledTileSize / 2;
            const ch = this.scene.add.image(chimneyX, roofTopY - scaledTileSize * 0.6, 'chimney');
            ch.setScale(BUILDING_SCALE);
            ch.setDepth(2);
            this.decorations.add(ch);
        }

        // Awning on residential buildings
        if (style.type === 'residential' && Math.random() < 0.4 && widthTiles >= 4) {
            const awningType = Math.random() < 0.5 ? 'awningGreen' : 'awningRed';
            const awX = startX + scaledTileSize + scaledTileSize / 2;
            const awY = groundY - scaledTileSize + scaledTileSize * 0.1;
            const aw = this.scene.add.image(awX, awY, awningType);
            aw.setScale(BUILDING_SCALE);
            aw.setDepth(2);
            this.decorations.add(aw);
        }

        // Add rooftop props and details
        this.addRooftopDetails(startX, roofTopY, widthTiles, style);

        // Add decorative signs and neon lights
        this.addBuildingSignage(startX, groundY, widthTiles, floors, style);

        // Add side decorations (pipes, vents, AC units)
        this.addBuildingSideDetails(startX, groundY, widthTiles, floors, style);

        // Add balconies or fire escapes on taller buildings
        if (floors >= 4 && Math.random() < 0.5) {
            this.addBuildingFeature(startX, groundY, widthTiles, floors, style);
        }

        // Add ledge platforms for traversable buildings
        if (isTraversable) {
            this.addBuildingLedges(startX, groundY, widthTiles, floors, scaledTileSize);
        }
    }

    addBuildingLedges(startX, groundY, widthTiles, floors, scaledTileSize) {
        const buildingLeftX = startX;
        const buildingRightX = startX + widthTiles * scaledTileSize;

        for (let floor = 1; floor < floors; floor++) {
            const ledgeY = groundY - (floor + 0.5) * scaledTileSize;

            // Left ledge (extends left from building)
            if (Math.random() < 0.5) {
                const ledgeWidth = 1 + Math.floor(Math.random() * 2); // 1-2 tiles
                for (let t = 0; t < ledgeWidth; t++) {
                    const tileX = buildingLeftX - (t + 1) * scaledTileSize + scaledTileSize / 2;
                    let key;
                    if (t === ledgeWidth - 1) key = 'grassHalfLeft';
                    else key = 'grassHalfMid';

                    const plat = this.scene.add.image(tileX, ledgeY, key);
                    plat.setScale(BUILDING_SCALE);
                    this.scene.physics.add.existing(plat, true);
                    plat.body.setSize(TILE_SIZE * BUILDING_SCALE, TILE_SIZE * BUILDING_SCALE);
                    this.platforms.add(plat);
                }
            }

            // Right ledge (extends right from building)
            if (Math.random() < 0.5) {
                const ledgeWidth = 1 + Math.floor(Math.random() * 2);
                for (let t = 0; t < ledgeWidth; t++) {
                    const tileX = buildingRightX + t * scaledTileSize + scaledTileSize / 2;
                    let key;
                    if (t === ledgeWidth - 1) key = 'grassHalfRight';
                    else key = 'grassHalfMid';

                    const plat = this.scene.add.image(tileX, ledgeY, key);
                    plat.setScale(BUILDING_SCALE);
                    this.scene.physics.add.existing(plat, true);
                    plat.body.setSize(TILE_SIZE * BUILDING_SCALE, TILE_SIZE * BUILDING_SCALE);
                    this.platforms.add(plat);
                }
            }
        }
    }

    generateFloatingPlatforms(levelWidth, groundY) {
        const platformCount = 8 + Math.floor(Math.random() * 6);

        for (let i = 0; i < platformCount; i++) {
            const x = 300 + Math.random() * (levelWidth - 600);
            const y = groundY - 200 - Math.random() * 400;
            const widthTiles = 2 + Math.floor(Math.random() * 4);

            for (let t = 0; t < widthTiles; t++) {
                const tileX = x + t * TILE_SIZE;
                let key;
                if (t === 0) key = 'grassHalfLeft';
                else if (t === widthTiles - 1) key = 'grassHalfRight';
                else key = 'grassHalfMid';

                const plat = this.scene.add.image(tileX, y, key);
                this.scene.physics.add.existing(plat, true);
                this.platforms.add(plat);
            }
        }
    }

    generateTrees(levelWidth, groundY) {
        const treeCount = 12 + Math.floor(Math.random() * 8); // 12-20 trees

        for (let i = 0; i < treeCount; i++) {
            const x = 100 + Math.random() * (levelWidth - 200);
            const treeType = TREE_TYPES[Math.floor(Math.random() * TREE_TYPES.length)];
            
            // Trees are in background with parallax
            const tree = this.scene.add.image(x, groundY - 50, treeType);
            tree.setScale(0.6 + Math.random() * 0.4); // Random scale 0.6-1.0
            tree.setDepth(-6); // Behind buildings, in front of parallax hills
            tree.setScrollFactor(0.4); // Parallax effect
            tree.setOrigin(0.5, 1); // Anchor at bottom
            this.decorations.add(tree);

            // Sometimes add bushes or rocks near trees
            if (Math.random() < 0.4) {
                const bushType = BUSH_TYPES[Math.floor(Math.random() * BUSH_TYPES.length)];
                const bush = this.scene.add.image(x + 40, groundY - 10, bushType);
                bush.setScale(0.4);
                bush.setDepth(-6);
                bush.setScrollFactor(0.4);
                bush.setOrigin(0.5, 1);
                this.decorations.add(bush);
            }

            if (Math.random() < 0.3) {
                const rockType = ROCK_TYPES[Math.floor(Math.random() * ROCK_TYPES.length)];
                const rock = this.scene.add.image(x - 30, groundY - 5, rockType);
                rock.setScale(0.5);
                rock.setDepth(-6);
                rock.setScrollFactor(0.4);
                rock.setOrigin(0.5, 1);
                this.decorations.add(rock);
            }
        }
    }

    generateGroundProps(levelWidth, groundY) {
        const propCount = 15 + Math.floor(Math.random() * 10); // 15-25 props

        for (let i = 0; i < propCount; i++) {
            const x = 200 + Math.random() * (levelWidth - 400);
            
            // Mix of barrels and other props
            let propType;
            const rand = Math.random();
            if (rand < 0.6) {
                // 60% barrels
                propType = BARREL_TYPES[Math.floor(Math.random() * BARREL_TYPES.length)];
            } else {
                // 40% other props
                propType = PROP_TYPES[Math.floor(Math.random() * PROP_TYPES.length)];
            }
            
            const prop = this.scene.add.image(x, groundY - 15, propType);
            prop.setScale(0.4 + Math.random() * 0.2); // Scale 0.4-0.6
            prop.setDepth(1); // In front of buildings
            prop.setOrigin(0.5, 1);
            this.decorations.add(prop);
        }
    }

    chooseWindowPattern(buildingType) {
        const patterns = ['grid', 'alternating', 'sparse', 'dense', 'columns'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    generateBuildingTint(buildingType) {
        // Enhanced color variations to make buildings more distinct and vibrant
        if (buildingType === 'industrial') {
            // Industrial: wider range of cool and metallic tones
            const tints = [
                0xE0E0E0, 0xD0D8E0, 0xE8E8E8, 0xC8D0D8, // Original grays
                0xC0D0E0, 0xD8E0E8, 0xB8C8D8, 0xE0E8F0, // More blue tones
                0xD0D0D8, 0xC8C8D0, 0xE0DFE8  // Subtle purples
            ];
            return tints[Math.floor(Math.random() * tints.length)];
        } else {
            // Residential: expanded warm and inviting tones
            const tints = [
                0xFFFFFF, 0xFFF8F0, 0xF8F0E8, 0xF0E8E0, // Original beiges
                0xFFE8D8, 0xF8E0D0, 0xFFD8C8, // Warm peachy tones
                0xF0F0E8, 0xF8F8E8, 0xFFF0E0, // Cream tones
                0xF0E0F0, 0xE8E0F0  // Soft lavenders
            ];
            return tints[Math.floor(Math.random() * tints.length)];
        }
    }

    generateBackgroundBuildingTint() {
        // Enhanced muted tints for background buildings with better atmospheric depth
        const tints = [
            0xB0B8C0, 0xC0C0C8, 0xA8B0B8, 0xD0D0D8, 0xB8C0C8, // Original
            0xA0A8B8, 0xB8C0D0, 0xC8D0D8, 0xA8B8C0, // More variety
            0xB0B0C0, 0xC0C8D0, 0xB8B8C8  // Atmospheric blues
        ];
        return tints[Math.floor(Math.random() * tints.length)];
    }

    shouldPlaceWindow(floor, col, widthTiles, totalFloors, pattern) {
        switch (pattern) {
            case 'grid':
                // Every other floor and column
                return floor % 2 === 0 && col % 2 === 1;
            
            case 'alternating':
                // Checkerboard pattern
                return (floor + col) % 2 === 0;
            
            case 'sparse':
                // Random but sparse (30%)
                return Math.random() < 0.3;
            
            case 'dense':
                // Most positions have windows (80%)
                return Math.random() < 0.8;
            
            case 'columns':
                // Vertical columns of windows
                return col === 1 || col === widthTiles - 2;
            
            default:
                return Math.random() < 0.5;
        }
    }

    addRooftopDetails(startX, roofTopY, widthTiles, style) {
        const scaledTileSize = TILE_SIZE * BUILDING_SCALE;

        // Enhanced rooftop equipment with more variety
        const propChance = style.type === 'industrial' ? 0.9 : 0.5; // Increased chances
        
        if (Math.random() < propChance) {
            const numProps = 2 + Math.floor(Math.random() * 4); // More props (2-5)
            
            for (let i = 0; i < numProps; i++) {
                const xOffset = (1 + Math.floor(Math.random() * (widthTiles - 2))) * scaledTileSize;
                const propX = startX + xOffset;
                const propY = roofTopY - scaledTileSize * 0.5;
                
                // Expanded prop types based on building style
                let propType;
                if (style.type === 'industrial') {
                    const industrialProps = ['box', 'crate', 'computer', 'machine', 'ac-unit', 'vent', 'vent', 'machine'];
                    propType = industrialProps[Math.floor(Math.random() * industrialProps.length)];
                } else {
                    const residentialProps = [...ROOFTOP_PROPS, 'ac-unit', 'vent', 'lamp'];
                    propType = residentialProps[Math.floor(Math.random() * residentialProps.length)];
                }
                
                const prop = this.scene.add.image(propX, propY, propType);
                prop.setScale(BUILDING_SCALE * (0.7 + Math.random() * 0.3)); // Varied sizes
                prop.setDepth(3);
                this.decorations.add(prop);
            }
        }

        // Enhanced antenna with better styling on tall industrial buildings
        if (style.type === 'industrial' && Math.random() < 0.6) { // Increased chance
            const centerX = startX + (widthTiles * scaledTileSize) / 2;
            const antennaHeight = scaledTileSize * (1.5 + Math.random()); // Varied heights
            const antennaY = roofTopY - antennaHeight / 2;
            
            // Main antenna pole
            const antenna = this.scene.add.rectangle(
                centerX, 
                antennaY, 
                4, // Slightly thicker
                antennaHeight,
                0x888888
            );
            antenna.setDepth(3);
            this.decorations.add(antenna);
            
            // Enhanced top decoration (animated blinking light)
            const lightColors = [0xff0000, 0xff6600, 0xffff00];
            const lightColor = lightColors[Math.floor(Math.random() * lightColors.length)];
            const topDecor = this.scene.add.circle(centerX, antennaY - antennaHeight/2, 6, lightColor);
            topDecor.setDepth(3);
            this.decorations.add(topDecor);
            
            // Add glow effect
            const glow = this.scene.add.circle(centerX, antennaY - antennaHeight/2, 10, lightColor, 0.4);
            glow.setDepth(3);
            this.decorations.add(glow);
        }
        
        // Enhanced rooftop lighting with better variety
        if (Math.random() < 0.4) { // Increased chance
            const lightX = startX + (1 + Math.floor(Math.random() * (widthTiles - 2))) * scaledTileSize;
            const lightY = roofTopY - scaledTileSize * 0.3;
            
            // Varied light colors for atmosphere
            const lightColors = [
                { base: 0xFFFF00, glow: 0xFFFF88 }, // Yellow
                { base: 0xFFFFFF, glow: 0xFFFFFF }, // White
                { base: 0xFF6600, glow: 0xFF9944 }  // Orange
            ];
            const chosenLight = lightColors[Math.floor(Math.random() * lightColors.length)];
            
            // Main light fixture
            const light = this.scene.add.circle(lightX, lightY, 5, chosenLight.base, 0.9);
            light.setDepth(3);
            this.decorations.add(light);
            
            // Enhanced glow effect
            const glow = this.scene.add.circle(lightX, lightY, 12, chosenLight.glow, 0.4);
            glow.setDepth(2);
            this.decorations.add(glow);
        }
    }

    addBuildingSideDetails(startX, groundY, widthTiles, floors, style) {
        const scaledTileSize = TILE_SIZE * BUILDING_SCALE;

        // Add pipes or vents on the side of industrial buildings
        if (style.type === 'industrial' && Math.random() < 0.6) {
            const side = Math.random() < 0.5 ? 'left' : 'right';
            const sideX = side === 'left' ? startX : startX + widthTiles * scaledTileSize;
            
            const numFloors = Math.min(floors, 3 + Math.floor(Math.random() * 3));
            for (let f = 1; f < numFloors; f++) {
                const pipeY = groundY - (f + 0.5) * scaledTileSize;
                
                const pipe = this.scene.add.rectangle(
                    sideX + (side === 'left' ? -5 : 5),
                    pipeY,
                    8,
                    scaledTileSize * 0.8,
                    0x666666
                );
                pipe.setDepth(2);
                this.decorations.add(pipe);
            }
        }

        // Add AC units or vents on residential buildings
        if (style.type === 'residential' && floors >= 3 && Math.random() < 0.5) {
            const floorForAC = 1 + Math.floor(Math.random() * (floors - 2));
            const acY = groundY - (floorForAC + 0.5) * scaledTileSize;
            const acX = startX + widthTiles * scaledTileSize + scaledTileSize * 0.2;
            
            const ac = this.scene.add.image(acX, acY, 'ac-unit');
            ac.setScale(BUILDING_SCALE * 0.6);
            ac.setDepth(2);
            this.decorations.add(ac);
        }
    }

    addBuildingSignage(startX, groundY, widthTiles, floors, style) {
        const scaledTileSize = TILE_SIZE * BUILDING_SCALE;
        
        // Enhanced neon signs with more variety and color
        if (Math.random() < 0.5) { // Increased chance
            const signFloor = floors >= 3 ? 1 + Math.floor(Math.random() * 2) : 1;
            const signY = groundY - signFloor * scaledTileSize;
            const signX = startX + (widthTiles * scaledTileSize) / 2;
            
            // Expanded color palette for signs
            const signColors = [
                0x00FFFF, // Cyan
                0xFF00FF, // Magenta
                0xFF0088, // Hot pink
                0x00FF88, // Green-cyan
                0xFFFF00, // Yellow
                0xFF6600  // Orange
            ];
            
            const signColor = style.type === 'industrial' ? 
                signColors[Math.floor(Math.random() * 3)] : // Industrial: cooler colors
                signColors[3 + Math.floor(Math.random() * 3)]; // Residential: warmer colors
            
            // Create glowing neon effect with varied sizes
            const signWidth = scaledTileSize * (widthTiles * 0.5 + Math.random() * 0.3);
            const signHeight = scaledTileSize * (0.25 + Math.random() * 0.15);
            const sign = this.scene.add.rectangle(
                signX,
                signY - scaledTileSize * 0.3,
                signWidth,
                signHeight,
                signColor,
                0.7 // Slightly more opaque
            );
            sign.setDepth(3);
            this.decorations.add(sign);
            
            // Enhanced multi-layer glow border
            const glow = this.scene.add.rectangle(
                signX,
                signY - scaledTileSize * 0.3,
                signWidth + 6,
                signHeight + 6,
                signColor,
                0.3
            );
            glow.setDepth(2);
            this.decorations.add(glow);
            
            // Add outer glow layer for more atmosphere
            const outerGlow = this.scene.add.rectangle(
                signX,
                signY - scaledTileSize * 0.3,
                signWidth + 12,
                signHeight + 12,
                signColor,
                0.1
            );
            outerGlow.setDepth(2);
            this.decorations.add(outerGlow);
        }

        // Enhanced shop awnings with more variety
        if (style.type === 'residential' && widthTiles >= 3 && Math.random() < 0.4) { // Increased chance
            const awningX = startX + scaledTileSize * 1.5;
            const awningY = groundY - scaledTileSize * 1.2;
            
            // Varied awning colors
            const awningColors = [0xFF6666, 0x66FF66, 0x6666FF, 0xFFFF66, 0xFF66FF];
            const awningColor = awningColors[Math.floor(Math.random() * awningColors.length)];
            
            const awning = this.scene.add.rectangle(
                awningX,
                awningY,
                scaledTileSize * 1.5,
                scaledTileSize * 0.25,
                awningColor,
                0.9
            );
            awning.setDepth(2);
            this.decorations.add(awning);
            
            // Add striped pattern effect
            const stripe = this.scene.add.rectangle(
                awningX,
                awningY,
                scaledTileSize * 1.5,
                scaledTileSize * 0.08,
                0xFFFFFF,
                0.3
            );
            stripe.setDepth(2);
            this.decorations.add(stripe);
        }
    }

    addBuildingFeature(startX, groundY, widthTiles, floors, style) {
        const scaledTileSize = TILE_SIZE * BUILDING_SCALE;
        const featureType = Math.random() < 0.5 ? 'balcony' : 'overhang';
        
        if (featureType === 'balcony' && widthTiles >= 4) {
            // Add a balcony on a random mid-floor
            const balconyFloor = 2 + Math.floor(Math.random() * (floors - 3));
            const balconyY = groundY - (balconyFloor + 1) * scaledTileSize;
            const balconyX = startX + widthTiles * scaledTileSize;
            
            // Create small extending platform
            const platform = this.scene.add.rectangle(
                balconyX + scaledTileSize * 0.5,
                balconyY,
                scaledTileSize,
                5,
                0x8B4513
            );
            platform.setDepth(2);
            this.decorations.add(platform);
            
            // Add railing
            const railing = this.scene.add.rectangle(
                balconyX + scaledTileSize * 0.5,
                balconyY - scaledTileSize * 0.3,
                scaledTileSize,
                2,
                0x654321
            );
            railing.setDepth(2);
            this.decorations.add(railing);
        } else if (featureType === 'overhang') {
            // Add an overhang at the top
            const overhangY = groundY - (floors + 0.5) * scaledTileSize;
            
            for (let col = 0; col < widthTiles + 2; col++) {
                const overhangX = startX + (col - 1) * scaledTileSize + scaledTileSize / 2;
                const overhang = this.scene.add.rectangle(
                    overhangX,
                    overhangY,
                    scaledTileSize,
                    5,
                    0x555555
                );
                overhang.setDepth(1);
                this.decorations.add(overhang);
            }
        }
    }
}
