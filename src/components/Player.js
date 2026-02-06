import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} texture - Texture key ('player' for spritesheet, 'player-idle' for individual PNG)
     */
    constructor(scene, x, y, texture = null) {
        super(scene, x, y, texture);
        
        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Scale down the player sprite to be appropriately sized
        this.setScale(0.25);
        
        // Physics properties
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.setGravityY(0); // Gravity is set globally in config
        
        // Player properties
        this.speed = 160;
        this.jumpForce = -500;
        
        // If no sprite is loaded, create a simple rectangle for testing
        if (!texture || !this.scene.textures.exists(texture)) {
            this.displayWidth = 32;
            this.displayHeight = 32;
            const graphics = scene.make.graphics({ x: 0, y: 0 }, false);
            graphics.fillStyle(0x00ff00, 1);
            graphics.fillRect(0, 0, 32, 32);
            graphics.generateTexture('player-temp', 32, 32);
            this.setTexture('player-temp');
            graphics.destroy();
        }
        
        // Set up controls
        this.cursors = scene.input.keyboard.createCursorKeys();
        
        // Try to play idle animation if it exists
        if (this.anims && this.anims.exists('robot-idle')) {
            this.play('robot-idle');
        } else if (this.anims && this.anims.exists('player-idle')) {
            this.play('player-idle');
        }
    }

    update() {
        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
            
            // Play walk animation if exists and grounded
            if (this.body.touching.down) {
                if (this.anims.exists('robot-walk')) {
                    this.play('robot-walk', true);
                } else if (this.anims.exists('player-walk')) {
                    this.play('player-walk', true);
                }
            }
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
            
            // Play walk animation if exists and grounded
            if (this.body.touching.down) {
                if (this.anims.exists('robot-walk')) {
                    this.play('robot-walk', true);
                } else if (this.anims.exists('player-walk')) {
                    this.play('player-walk', true);
                }
            }
        } else {
            this.setVelocityX(0);
            
            // Play idle animation if exists and grounded
            if (this.body.touching.down) {
                if (this.anims.exists('robot-idle')) {
                    this.play('robot-idle', true);
                } else if (this.anims.exists('player-idle')) {
                    this.play('player-idle', true);
                }
            }
        }
        
        // Jump (only if touching ground)
        if (this.cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(this.jumpForce);
            
            // Play jump animation if exists
            if (this.anims.exists('robot-jump')) {
                this.play('robot-jump');
            } else if (this.anims.exists('player-jump')) {
                this.play('player-jump');
            }
        }
        
        // Space bar alternative for jump
        if (this.cursors.space && this.cursors.space.isDown && this.body.touching.down) {
            this.setVelocityY(this.jumpForce);
            
            // Play jump animation if exists
            if (this.anims.exists('robot-jump')) {
                this.play('robot-jump');
            } else if (this.anims.exists('player-jump')) {
                this.play('player-jump');
            }
        }
        
        // Play fall animation if in air and moving down
        if (!this.body.touching.down && this.body.velocity.y > 0) {
            if (this.anims.exists('robot-fall')) {
                this.play('robot-fall', true);
            } else if (this.anims.exists('player-fall')) {
                this.play('player-fall', true);
            }
        }
    }
}
