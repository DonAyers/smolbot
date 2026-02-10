/**
 * Simple Game Configuration Manager
 */
export default class GameConfig {
    static config = {
        render: {
            player: true,
            enemies: true,
            buildings: true,
            trees: true,
            props: true,
            parallax: true
        },
        debug: {
            showFPS: true,
            showHitboxes: false
        }
    };

    static async load() {
        try {
            const response = await fetch('/config/game-config.json');
            this.config = await response.json();
            console.log('✅ Config loaded:', this.config);
        } catch (error) {
            console.warn('⚠️  Using default config');
        }
    }

    static should(feature) {
        const parts = feature.split('.');
        let value = this.config;
        for (const part of parts) {
            value = value?.[part];
        }
        return value !== false;
    }
}
