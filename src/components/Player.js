import Phaser from 'phaser';
import PlayerStats from './PlayerStats';

const PLAYER_COLORS = ['blue', 'green', 'yellow'];

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, colorIndex = null) {
        // Pick a robot color
        const color = colorIndex !== null
            ? PLAYER_COLORS[colorIndex % PLAYER_COLORS.length]
            : PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
        
        super(scene, x, y, 'robots', `robot_${color}Drive1.png`);
        this.robotColor = color;
        
        // Initialize stats system
        this.stats = new PlayerStats(scene);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Scale robot to a good game size (~55px tall)
        this.setScale(0.35);
        
        this.setBounce(0);
        this.setCollideWorldBounds(true);
        this.setGravityY(0);
        this.setDragX(0);
        
        // Tighter physics body
        this.body.setSize(this.width * 0.7, this.height * 0.85);
        this.body.setOffset(this.width * 0.15, this.height * 0.15);
        
        // Movement tuning
        this.speed = 220;
        this.jumpForce = -480;
        this.jumpHoldForce = -35;   // extra upward force while holding jump
        this.maxJumpHoldTime = 200; // ms you can hold jump for extra height
        this.airControlFactor = 0.85; // horizontal control while airborne
        
        // Coyote time & jump buffer
        this.coyoteTime = 90;       // ms grace period after leaving ground
        this.jumpBufferTime = 120;  // ms buffer for pressing jump early
        this._lastGroundedAt = 0;
        this._jumpPressedAt = 0;
        this._jumpHeldSince = 0;
        this._isJumping = false;
        
        // Controls
        this.cursors = scene.input.keyboard.createCursorKeys();
        
        // Animation prefix for this color
        this._animPrefix = color;
        this.play(`${color}-idle`);
    }

    update(time, delta) {
        // Check if dead
        if (this.stats.isDead()) {
            this.setTint(0x666666);
            this.setVelocity(0, 0);
            return;
        }

        // Visual feedback for invulnerability
        if (this.stats.isInvulnerable) {
            this.setAlpha(Math.sin(time / 50) * 0.3 + 0.7);
        } else {
            this.setAlpha(1);
        }

        const onGround = this.body.blocked.down || this.body.touching.down;
        
        if (onGround) {
            this._lastGroundedAt = time;
            this._isJumping = false;
        }
        
        const canCoyoteJump = (time - this._lastGroundedAt) < this.coyoteTime;
        const wantJump = this.cursors.up.isDown || (this.cursors.space && this.cursors.space.isDown);
        
        // Record jump press for buffer
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || 
            (this.cursors.space && Phaser.Input.Keyboard.JustDown(this.cursors.space))) {
            this._jumpPressedAt = time;
        }
        
        const hasBufferedJump = (time - this._jumpPressedAt) < this.jumpBufferTime;
        
        // --- Horizontal movement ---
        const accel = onGround ? 1.0 : this.airControlFactor;
        
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.speed * accel);
            this.setFlipX(true);
            if (onGround && this.anims.currentAnim?.key !== `${this._animPrefix}-walk`) {
                this.play(`${this._animPrefix}-walk`);
            }
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(this.speed * accel);
            this.setFlipX(false);
            if (onGround && this.anims.currentAnim?.key !== `${this._animPrefix}-walk`) {
                this.play(`${this._animPrefix}-walk`);
            }
        } else {
            // Ground friction: stop quickly, air: drift a little
            if (onGround) {
                this.setVelocityX(0);
                if (this.anims.currentAnim?.key !== `${this._animPrefix}-idle`) {
                    this.play(`${this._animPrefix}-idle`);
                }
            } else {
                this.setVelocityX(this.body.velocity.x * 0.92); // gentle air drag
            }
        }
        
        // --- Jump ---
        if ((hasBufferedJump || wantJump) && (onGround || canCoyoteJump) && !this._isJumping) {
            this.setVelocityY(this.jumpForce);
            this._isJumping = true;
            this._jumpHeldSince = time;
            this._jumpPressedAt = 0; // consume buffer
            this._lastGroundedAt = 0; // consume coyote
            if (this.anims.currentAnim?.key !== `${this._animPrefix}-jump`) {
                this.play(`${this._animPrefix}-jump`);
            }
        }
        
        // Variable jump height: hold for higher, release for shorter
        if (this._isJumping && wantJump && this.body.velocity.y < 0) {
            const holdDuration = time - this._jumpHeldSince;
            if (holdDuration < this.maxJumpHoldTime) {
                this.body.velocity.y += this.jumpHoldForce;
            }
        }
        
        // Cut jump short if released early
        if (this._isJumping && !wantJump && this.body.velocity.y < this.jumpForce * 0.4) {
            this.body.velocity.y = this.jumpForce * 0.4;
        }
        
        // Fall animation
        if (!onGround && this.body.velocity.y > 50) {
            if (this.anims.currentAnim?.key !== `${this._animPrefix}-fall`) {
                this.play(`${this._animPrefix}-fall`);
            }
        }
    }

    takeDamage(amount = 1) {
        if (this.stats.takeDamage(amount)) {
            // Damage effect: knockback
            const knockbackX = this.flipX ? 200 : -200;
            const knockbackY = -150;
            this.setVelocity(knockbackX, knockbackY);
            
            // Flash red and play damage animation briefly
            this.play(`${this._animPrefix}-damage`);
            this.setTint(0xff0000);
            this.scene.time.delayedCall(100, () => {
                this.clearTint();
            });
        }
    }
}
