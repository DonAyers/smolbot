export default class PlayerStats {
    constructor(scene) {
        this.scene = scene;
        this.maxHealth = 3;
        this.health = 3;
        this.isInvulnerable = false;
        this.invulnerabilityDuration = 1500; // 1.5 seconds
    }

    takeDamage(amount = 1) {
        if (this.isInvulnerable) return false;

        this.health = Math.max(0, this.health - amount);
        
        if (this.health > 0) {
            this.startInvulnerability();
        }

        return true;
    }

    heal(amount = 1) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    startInvulnerability() {
        this.isInvulnerable = true;
        this.scene.time.delayedCall(this.invulnerabilityDuration, () => {
            this.isInvulnerable = false;
        });
    }

    isDead() {
        return this.health <= 0;
    }

    getHealth() {
        return this.health;
    }

    getMaxHealth() {
        return this.maxHealth;
    }
}
