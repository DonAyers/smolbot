import Phaser from 'phaser';

const ENEMY_COLORS = ['red', 'yellow', 'green'];

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'enemy-idle', patrolDistance = 100) {
        // Pick a random enemy color
        const color = ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)];
        super(scene, x, y, 'robots', `robot_${color}Body.png`);
        this.enemyColor = color;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Scale to match player size
        this.setScale(0.3);

        this.setBounce(0);
        this.setCollideWorldBounds(true);
        this.setGravityY(0);

        // Tighter physics body
        this.body.setSize(this.width * 0.7, this.height * 0.85);
        this.body.setOffset(this.width * 0.15, this.height * 0.15);

        this.speed = 40 + Math.random() * 40; // vary speed
        this.patrolDistance = patrolDistance;
        this.startX = x;
        this.direction = Math.random() < 0.5 ? 1 : -1;

        // Use the color-specific walk animation
        this.play(`${color}-walk`, true);
    }

    update() {
        this.setVelocityX(this.speed * this.direction);
        this.setFlipX(this.direction < 0);

        if (this.direction > 0 && this.x >= this.startX + this.patrolDistance) {
            this.direction = -1;
        } else if (this.direction < 0 && this.x <= this.startX - this.patrolDistance) {
            this.direction = 1;
        }
    }
}
