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

        // Load robot spritesheet with tank treads
        this.load.atlasXML('robots', 'assets/spritesheets/spritesheet_robotsSide.png', 'assets/spritesheets/spritesheet_robotsSide.xml');
        
        // Load building tiles (70x70 from kenney_platformer-art-buildings)
        // Dark house style
        this.load.image('houseDarkBottomLeft', 'assets/images/buildings/houseDarkBottomLeft.png');
        this.load.image('houseDarkBottomMid', 'assets/images/buildings/houseDarkBottomMid.png');
        this.load.image('houseDarkBottomRight', 'assets/images/buildings/houseDarkBottomRight.png');
        this.load.image('houseDarkMidLeft', 'assets/images/buildings/houseDarkMidLeft.png');
        this.load.image('houseDarkMidRight', 'assets/images/buildings/houseDarkMidRight.png');
        this.load.image('houseDarkTopLeft', 'assets/images/buildings/houseDarkTopLeft.png');
        this.load.image('houseDarkTopMid', 'assets/images/buildings/houseDarkTopMid.png');
        this.load.image('houseDarkTopRight', 'assets/images/buildings/houseDarkTopRight.png');
        // Beige house style
        this.load.image('houseBeigeBottomLeft', 'assets/images/buildings/houseBeigeBottomLeft.png');
        this.load.image('houseBeigeBottomMid', 'assets/images/buildings/houseBeigeBottomMid.png');
        this.load.image('houseBeigeBottomRight', 'assets/images/buildings/houseBeigeBottomRight.png');
        this.load.image('houseBeigeMidLeft', 'assets/images/buildings/houseBeigeMidLeft.png');
        this.load.image('houseBeigeMidRight', 'assets/images/buildings/houseBeigeMidRight.png');
        this.load.image('houseBeigeTopLeft', 'assets/images/buildings/houseBeigeTopLeft.png');
        this.load.image('houseBeigeTopMid', 'assets/images/buildings/houseBeigeTopMid.png');
        this.load.image('houseBeigeTopRight', 'assets/images/buildings/houseBeigeTopRight.png');
        // Gray house style
        this.load.image('houseGrayBottomLeft', 'assets/images/buildings/houseGrayBottomLeft.png');
        this.load.image('houseGrayBottomMid', 'assets/images/buildings/houseGrayBottomMid.png');
        this.load.image('houseGrayBottomRight', 'assets/images/buildings/houseGrayBottomRight.png');
        this.load.image('houseGrayMidLeft', 'assets/images/buildings/houseGrayMidLeft.png');
        this.load.image('houseGrayMidRight', 'assets/images/buildings/houseGrayMidRight.png');
        this.load.image('houseGrayTopLeft', 'assets/images/buildings/houseGrayTopLeft.png');
        this.load.image('houseGrayTopMid', 'assets/images/buildings/houseGrayTopMid.png');
        this.load.image('houseGrayTopRight', 'assets/images/buildings/houseGrayTopRight.png');
        // Roofs
        this.load.image('roofRedLeft', 'assets/images/buildings/roofRedLeft.png');
        this.load.image('roofRedMid', 'assets/images/buildings/roofRedMid.png');
        this.load.image('roofRedRight', 'assets/images/buildings/roofRedRight.png');
        this.load.image('roofRedTopLeft', 'assets/images/buildings/roofRedTopLeft.png');
        this.load.image('roofRedTopMid', 'assets/images/buildings/roofRedTopMid.png');
        this.load.image('roofRedTopRight', 'assets/images/buildings/roofRedTopRight.png');
        this.load.image('roofGreyLeft', 'assets/images/buildings/roofGreyLeft.png');
        this.load.image('roofGreyMid', 'assets/images/buildings/roofGreyMid.png');
        this.load.image('roofGreyRight', 'assets/images/buildings/roofGreyRight.png');
        this.load.image('roofGreyTopLeft', 'assets/images/buildings/roofGreyTopLeft.png');
        this.load.image('roofGreyTopMid', 'assets/images/buildings/roofGreyTopMid.png');
        this.load.image('roofGreyTopRight', 'assets/images/buildings/roofGreyTopRight.png');
        // Building details
        this.load.image('bldg-window', 'assets/images/buildings/window.png');
        this.load.image('windowOpen', 'assets/images/buildings/windowOpen.png');
        this.load.image('windowCheckered', 'assets/images/buildings/windowCheckered.png');
        this.load.image('doorKnob', 'assets/images/buildings/doorKnob.png');
        this.load.image('doorKnobAlt', 'assets/images/buildings/doorKnobAlt.png');
        this.load.image('doorOpen', 'assets/images/buildings/doorOpen.png');
        this.load.image('awningGreen', 'assets/images/buildings/awningGreen.png');
        this.load.image('awningRed', 'assets/images/buildings/awningRed.png');
        this.load.image('chimney', 'assets/images/buildings/chimney.png');
        this.load.image('fenceLong', 'assets/images/buildings/fenceLong.png');
        
        // Industrial building tiles
        this.load.image('bricks_brown', 'assets/images/buildings/bricks_brown.png');
        this.load.image('bricks_grey', 'assets/images/buildings/bricks_grey.png');
        this.load.image('building-window', 'assets/images/buildings/building-window.png');
        this.load.image('building-door', 'assets/images/buildings/building-door.png');
        
        // Trees and nature (background decorations)
        this.load.image('tree_green_01', 'assets/images/environment/GREEN_01.png');
        this.load.image('tree_green_02', 'assets/images/environment/GREEN_02.png');
        this.load.image('tree_green_03', 'assets/images/environment/GREEN_03.png');
        this.load.image('tree_green_04', 'assets/images/environment/GREEN_04.png');
        this.load.image('tree_green_05', 'assets/images/environment/GREEN_05.png');
        this.load.image('tree_green_08', 'assets/images/environment/GREEN_08.png');
        this.load.image('tree_green_09', 'assets/images/environment/GREEN_09.png');
        this.load.image('tree_orange_01', 'assets/images/environment/ORANGE_01.png');
        this.load.image('tree_orange_02', 'assets/images/environment/ORANGE_02.png');
        this.load.image('tree_orange_03', 'assets/images/environment/ORANGE_03.png');
        this.load.image('tree_pine', 'assets/images/environment/Pine_01.png');
        this.load.image('bush_01', 'assets/images/environment/BUSH_01.png');
        this.load.image('bush_02', 'assets/images/environment/BUSH_02.png');
        this.load.image('bush_03', 'assets/images/environment/BUSH_03.png');
        this.load.image('rock_01', 'assets/images/environment/Rock_01.png');
        this.load.image('rock_02', 'assets/images/environment/Rock_02.png');
        this.load.image('rock_03', 'assets/images/environment/Rock_03.png');
        
        // Scifi props (foreground decorations)
        this.load.image('barrel_01', 'assets/images/props/Baril 1.png');
        this.load.image('barrel_02', 'assets/images/props/Baril 2.png');
        this.load.image('barrel_green', 'assets/images/props/Green Barrel.png');
        this.load.image('pipe', 'assets/images/props/Pipe.png');
        this.load.image('pipe2', 'assets/images/props/Pipe2.png');
        this.load.image('neon', 'assets/images/props/Neon.png');
        this.load.image('lamp', 'assets/images/props/Lamp 1.png');
        
        // Grass terrain tiles (70x70 from extended tileset)
        this.load.image('grassHalf', 'assets/images/tiles/grassHalf.png');
        this.load.image('grassHalfLeft', 'assets/images/tiles/grassHalfLeft.png');
        this.load.image('grassHalfMid', 'assets/images/tiles/grassHalfMid.png');
        this.load.image('grassHalfRight', 'assets/images/tiles/grassHalfRight.png');
        
        // Dirt/ground fill tiles (64x64 from new platformer pack)
        this.load.image('terrain_grass_block', 'assets/images/tiles/terrain_grass_block.png');
        this.load.image('terrain_grass_block_top', 'assets/images/tiles/terrain_grass_block_top.png');
        this.load.image('terrain_grass_block_center', 'assets/images/tiles/terrain_grass_block_center.png');
        this.load.image('terrain_grass_block_left', 'assets/images/tiles/terrain_grass_block_left.png');
        this.load.image('terrain_grass_block_right', 'assets/images/tiles/terrain_grass_block_right.png');
        this.load.image('terrain_grass_block_bottom', 'assets/images/tiles/terrain_grass_block_bottom.png');
        this.load.image('terrain_grass_block_top_left', 'assets/images/tiles/terrain_grass_block_top_left.png');
        this.load.image('terrain_grass_block_top_right', 'assets/images/tiles/terrain_grass_block_top_right.png');
        this.load.image('terrain_dirt_block_center', 'assets/images/tiles/terrain_dirt_block_center.png');
        
        // Load backgrounds for parallax layers
        this.load.image('background', 'assets/images/backgrounds/background.png');
        this.load.image('bg_hills', 'assets/images/backgrounds/bg_hills.png');
        this.load.image('bg_clouds', 'assets/images/backgrounds/bg_clouds.png');
    }

    create() {
        // Create animations for each robot color
        const colors = ['blue', 'green', 'yellow', 'red'];
        colors.forEach(color => {
            const prefix = color;
            // Idle: use Drive1 for stationary robot WITH treads
            this.anims.create({
                key: `${prefix}-idle`,
                frames: [{ key: 'robots', frame: `robot_${color}Drive1.png` }],
                frameRate: 1
            });
            // Walk: animate treads with Drive1/Drive2
            this.anims.create({
                key: `${prefix}-walk`,
                frames: [
                    { key: 'robots', frame: `robot_${color}Drive1.png` },
                    { key: 'robots', frame: `robot_${color}Drive2.png` }
                ],
                frameRate: 8,
                repeat: -1
            });
            // Jump: use Jump frame (has treads)
            this.anims.create({
                key: `${prefix}-jump`,
                frames: [{ key: 'robots', frame: `robot_${color}Jump.png` }],
                frameRate: 1
            });
            // Fall: use Drive1 (has treads, not Hurt which lacks treads)
            this.anims.create({
                key: `${prefix}-fall`,
                frames: [{ key: 'robots', frame: `robot_${color}Drive1.png` }],
                frameRate: 1
            });
            // Damage: use Damage1 for hit reaction
            this.anims.create({
                key: `${prefix}-damage`,
                frames: [{ key: 'robots', frame: `robot_${color}Damage1.png` }],
                frameRate: 1
            });
        });

        // Legacy aliases so old code still works
        this.anims.create({
            key: 'robot-idle',
            frames: [{ key: 'robots', frame: 'robot_blueDrive1.png' }],
            frameRate: 1
        });
        this.anims.create({
            key: 'robot-walk',
            frames: [
                { key: 'robots', frame: 'robot_blueDrive1.png' },
                { key: 'robots', frame: 'robot_blueDrive2.png' }
            ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'robot-jump',
            frames: [{ key: 'robots', frame: 'robot_blueJump.png' }],
            frameRate: 1
        });
        this.anims.create({
            key: 'robot-fall',
            frames: [{ key: 'robots', frame: 'robot_blueDrive1.png' }],
            frameRate: 1
        });
        this.anims.create({
            key: 'enemy-idle',
            frames: [{ key: 'robots', frame: 'robot_redBody.png' }],
            frameRate: 1
        });
        this.anims.create({
            key: 'enemy-walk',
            frames: [
                { key: 'robots', frame: 'robot_redDrive1.png' },
                { key: 'robots', frame: 'robot_redDrive2.png' }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.scene.start('GameScene');
    }
}
