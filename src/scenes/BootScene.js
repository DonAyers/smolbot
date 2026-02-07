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
        this.load.atlasXML('robots', 'assets/images/spritesheet_robotsSide.png', 'assets/images/spritesheet_robotsSide.xml');
        
        // Load building tiles (70x70 from kenney_platformer-art-buildings)
        // Dark house style
        this.load.image('houseDarkBottomLeft', 'assets/images/houseDarkBottomLeft.png');
        this.load.image('houseDarkBottomMid', 'assets/images/houseDarkBottomMid.png');
        this.load.image('houseDarkBottomRight', 'assets/images/houseDarkBottomRight.png');
        this.load.image('houseDarkMidLeft', 'assets/images/houseDarkMidLeft.png');
        this.load.image('houseDarkMidRight', 'assets/images/houseDarkMidRight.png');
        this.load.image('houseDarkTopLeft', 'assets/images/houseDarkTopLeft.png');
        this.load.image('houseDarkTopMid', 'assets/images/houseDarkTopMid.png');
        this.load.image('houseDarkTopRight', 'assets/images/houseDarkTopRight.png');
        // Beige house style
        this.load.image('houseBeigeBottomLeft', 'assets/images/houseBeigeBottomLeft.png');
        this.load.image('houseBeigeBottomMid', 'assets/images/houseBeigeBottomMid.png');
        this.load.image('houseBeigeBottomRight', 'assets/images/houseBeigeBottomRight.png');
        this.load.image('houseBeigeMidLeft', 'assets/images/houseBeigeMidLeft.png');
        this.load.image('houseBeigeMidRight', 'assets/images/houseBeigeMidRight.png');
        this.load.image('houseBeigeTopLeft', 'assets/images/houseBeigeTopLeft.png');
        this.load.image('houseBeigeTopMid', 'assets/images/houseBeigeTopMid.png');
        this.load.image('houseBeigeTopRight', 'assets/images/houseBeigeTopRight.png');
        // Gray house style
        this.load.image('houseGrayBottomLeft', 'assets/images/houseGrayBottomLeft.png');
        this.load.image('houseGrayBottomMid', 'assets/images/houseGrayBottomMid.png');
        this.load.image('houseGrayBottomRight', 'assets/images/houseGrayBottomRight.png');
        this.load.image('houseGrayMidLeft', 'assets/images/houseGrayMidLeft.png');
        this.load.image('houseGrayMidRight', 'assets/images/houseGrayMidRight.png');
        this.load.image('houseGrayTopLeft', 'assets/images/houseGrayTopLeft.png');
        this.load.image('houseGrayTopMid', 'assets/images/houseGrayTopMid.png');
        this.load.image('houseGrayTopRight', 'assets/images/houseGrayTopRight.png');
        // Roofs
        this.load.image('roofRedLeft', 'assets/images/roofRedLeft.png');
        this.load.image('roofRedMid', 'assets/images/roofRedMid.png');
        this.load.image('roofRedRight', 'assets/images/roofRedRight.png');
        this.load.image('roofRedTopLeft', 'assets/images/roofRedTopLeft.png');
        this.load.image('roofRedTopMid', 'assets/images/roofRedTopMid.png');
        this.load.image('roofRedTopRight', 'assets/images/roofRedTopRight.png');
        this.load.image('roofGreyLeft', 'assets/images/roofGreyLeft.png');
        this.load.image('roofGreyMid', 'assets/images/roofGreyMid.png');
        this.load.image('roofGreyRight', 'assets/images/roofGreyRight.png');
        this.load.image('roofGreyTopLeft', 'assets/images/roofGreyTopLeft.png');
        this.load.image('roofGreyTopMid', 'assets/images/roofGreyTopMid.png');
        this.load.image('roofGreyTopRight', 'assets/images/roofGreyTopRight.png');
        // Building details
        this.load.image('bldg-window', 'assets/images/window.png');
        this.load.image('windowOpen', 'assets/images/windowOpen.png');
        this.load.image('windowCheckered', 'assets/images/windowCheckered.png');
        this.load.image('doorKnob', 'assets/images/doorKnob.png');
        this.load.image('doorKnobAlt', 'assets/images/doorKnobAlt.png');
        this.load.image('doorOpen', 'assets/images/doorOpen.png');
        this.load.image('awningGreen', 'assets/images/awningGreen.png');
        this.load.image('awningRed', 'assets/images/awningRed.png');
        this.load.image('chimney', 'assets/images/chimney.png');
        this.load.image('fenceLong', 'assets/images/fenceLong.png');
        
        // Industrial building tiles
        this.load.image('bricks_brown', 'assets/images/bricks_brown.png');
        this.load.image('bricks_grey', 'assets/images/bricks_grey.png');
        this.load.image('building-window', 'assets/images/building-window.png');
        this.load.image('building-door', 'assets/images/building-door.png');
        
        // Trees and nature (background decorations)
        this.load.image('tree_green_01', 'assets/images/GREEN_01.png');
        this.load.image('tree_green_02', 'assets/images/GREEN_02.png');
        this.load.image('tree_green_03', 'assets/images/GREEN_03.png');
        this.load.image('tree_green_04', 'assets/images/GREEN_04.png');
        this.load.image('tree_green_05', 'assets/images/GREEN_05.png');
        this.load.image('tree_green_08', 'assets/images/GREEN_08.png');
        this.load.image('tree_green_09', 'assets/images/GREEN_09.png');
        this.load.image('tree_orange_01', 'assets/images/ORANGE_01.png');
        this.load.image('tree_orange_02', 'assets/images/ORANGE_02.png');
        this.load.image('tree_orange_03', 'assets/images/ORANGE_03.png');
        this.load.image('tree_pine', 'assets/images/Pine_01.png');
        this.load.image('bush_01', 'assets/images/BUSH_01.png');
        this.load.image('bush_02', 'assets/images/BUSH_02.png');
        this.load.image('bush_03', 'assets/images/BUSH_03.png');
        this.load.image('rock_01', 'assets/images/Rock_01.png');
        this.load.image('rock_02', 'assets/images/Rock_02.png');
        this.load.image('rock_03', 'assets/images/Rock_03.png');
        
        // Scifi props (foreground decorations)
        this.load.image('barrel_01', 'assets/images/Baril 1.png');
        this.load.image('barrel_02', 'assets/images/Baril 2.png');
        this.load.image('barrel_green', 'assets/images/Green Barrel.png');
        this.load.image('pipe', 'assets/images/Pipe.png');
        this.load.image('pipe2', 'assets/images/Pipe2.png');
        this.load.image('neon', 'assets/images/Neon.png');
        this.load.image('lamp', 'assets/images/Lamp 1.png');
        
        // Grass terrain tiles (70x70 from extended tileset)
        this.load.image('grassHalf', 'assets/images/grassHalf.png');
        this.load.image('grassHalfLeft', 'assets/images/grassHalfLeft.png');
        this.load.image('grassHalfMid', 'assets/images/grassHalfMid.png');
        this.load.image('grassHalfRight', 'assets/images/grassHalfRight.png');
        
        // Dirt/ground fill tiles (64x64 from new platformer pack)
        this.load.image('terrain_grass_block', 'assets/images/terrain_grass_block.png');
        this.load.image('terrain_grass_block_top', 'assets/images/terrain_grass_block_top.png');
        this.load.image('terrain_grass_block_center', 'assets/images/terrain_grass_block_center.png');
        this.load.image('terrain_grass_block_left', 'assets/images/terrain_grass_block_left.png');
        this.load.image('terrain_grass_block_right', 'assets/images/terrain_grass_block_right.png');
        this.load.image('terrain_grass_block_bottom', 'assets/images/terrain_grass_block_bottom.png');
        this.load.image('terrain_grass_block_top_left', 'assets/images/terrain_grass_block_top_left.png');
        this.load.image('terrain_grass_block_top_right', 'assets/images/terrain_grass_block_top_right.png');
        this.load.image('terrain_dirt_block_center', 'assets/images/terrain_dirt_block_center.png');
        
        // Load backgrounds for parallax layers
        this.load.image('background', 'assets/images/background.png');
        this.load.image('bg_hills', 'assets/images/bg_hills.png');
        this.load.image('bg_clouds', 'assets/images/bg_clouds.png');
    }

    create() {
        // Create animations for each robot color
        const colors = ['blue', 'green', 'yellow', 'red'];
        colors.forEach(color => {
            const prefix = color;
            this.anims.create({
                key: `${prefix}-idle`,
                frames: [
                    { key: 'robots', frame: `robot_${color}Drive1.png` }
                ],
                frameRate: 1,
                repeat: 0
            });
            this.anims.create({
                key: `${prefix}-walk`,
                frames: [
                    { key: 'robots', frame: `robot_${color}Drive1.png` },
                    { key: 'robots', frame: `robot_${color}Drive2.png` }
                ],
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: `${prefix}-jump`,
                frames: [{ key: 'robots', frame: `robot_${color}Jump.png` }],
                frameRate: 1
            });
            this.anims.create({
                key: `${prefix}-hurt`,
                frames: [{ key: 'robots', frame: `robot_${color}Hurt.png` }],
                frameRate: 1
            });
        });

        // Legacy aliases so old code still works
        this.anims.create({
            key: 'robot-idle',
            frames: [
                { key: 'robots', frame: 'robot_blueDrive1.png' }
            ],
            frameRate: 1,
            repeat: 0
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
