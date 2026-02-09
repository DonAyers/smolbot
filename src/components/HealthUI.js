import Phaser from 'phaser';

export default class HealthUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y, playerStats) {
        super(scene, x, y);
        
        this.playerStats = playerStats;
        this.hearts = [];
        
        // Create heart emojis
        this.createHearts();
        
        // Add to scene
        scene.add.existing(this);
        
        // Fix to camera
        this.setScrollFactor(0);
        this.setDepth(100);
    }

    createHearts() {
        const heartSpacing = 40;
        
        for (let i = 0; i < this.playerStats.getMaxHealth(); i++) {
            const heart = this.scene.add.text(
                i * heartSpacing,
                0,
                '❤️',
                {
                    fontSize: '32px'
                }
            );
            
            this.add(heart);
            this.hearts.push(heart);
        }
    }

    update() {
        const currentHealth = this.playerStats.getHealth();
        
        // Update heart visibility
        this.hearts.forEach((heart, index) => {
            if (index < currentHealth) {
                heart.setText('❤️');
                heart.setAlpha(1);
            } else {
                heart.setText('🖤');
                heart.setAlpha(0.5);
            }
        });

        // Flashing effect during invulnerability
        if (this.playerStats.isInvulnerable) {
            const flashAlpha = Math.sin(Date.now() / 100) * 0.3 + 0.7;
            this.hearts.forEach((heart, index) => {
                if (index < currentHealth) {
                    heart.setAlpha(flashAlpha);
                }
            });
        }
    }
}
