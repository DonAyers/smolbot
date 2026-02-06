import Phaser from 'phaser';
import ProceduralLevelGenerator from '../utils/ProceduralLevelGenerator';
import Player from '../components/Player';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Initialize the procedural level generator
        const levelGenerator = new ProceduralLevelGenerator(this);
        
        // Generate a level (this will create platforms and obstacles)
        const platforms = levelGenerator.generateLevel();
        
        // Add player character
        this.player = new Player(this, 100, 450, 'robot-idle');
        this.physics.add.collider(this.player, platforms);
        
        // Display instructions
        this.add.text(16, 16, 'Procedurally Generated Platformer', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        
        this.add.text(16, 56, 'Arrow keys to move, Up/Space to jump!', {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        
        this.add.text(16, 86, 'Press R to regenerate level', {
            fontSize: '14px',
            fill: '#ffff00',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        
        // Add R key to regenerate level
        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();
        });
    }

    update() {
        // Update player
        if (this.player) {
            this.player.update();
        }
    }
}
