import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} texture - Enemy texture key
     * @param {number} patrolDistance - Distance to patrol left/right
     */
    constructor(scene, x, y, texture = 'enemy-idle', patrolDistance = 100) {
        super(scene, x, y, texture);
        
        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Scale down to match player size
        this.setScale(0.25);
        
        // Physics properties
        this.setBounce(0);
        this.setCollideWorldBounds(true);
        this.setGravityY(0); // Gravity is set globally in config
        
        // Enemy properties
        this.speed = 50;
        this.patrolDistance = patrolDistance;
        this.startX = x;
        this.direction = 1; // 1 = right, -1 = left
        
        // Try to play idle animation if it exists
        if (this.anims && this.anims.exists('enemy-walk')) {
            this.play('enemy-walk');
        } else if (this.anims && this.anims.exists('enemy-idle')) {
            this.play('enemy-idle');
        }
    }

    update() {
        // Simple patrol behavior
        this.setVelocityX(this.speed * this.direction);
        
        // Flip sprite based on direction
        this.setFlipX(this.direction < 0);
        
        // Change direction when reaching patrol boundaries
        if (this.direction > 0 && this.x >= this.startX + this.patrolDistance) {
            this.direction = -1;
        } else if (this.direction < 0 && this.x <= this.startX - this.patrolDistance) {
            this.direction = 1;
        }
    }
}
