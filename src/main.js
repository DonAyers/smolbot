import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [BootScene, GameScene]
};

const game = new Phaser.Game(config);

if (import.meta.env.DEV) {
    window.__GAME_INSTANCE__ = game;
    
    window.__GAME_STATE__ = {
        getScene: () => game.scene.getScenes(true)[0],
        getActiveSceneName: () => {
            const scene = game.scene.getScenes(true)[0];
            return scene ? scene.scene.key : null;
        },
        getPlayer: () => {
            const scene = game.scene.getScenes(true)[0];
            return scene?.player || null;
        },
        getPlayerPosition: () => {
            const scene = game.scene.getScenes(true)[0];
            if (scene?.player) {
                return { x: scene.player.x, y: scene.player.y };
            }
            return null;
        },
        getGameState: () => {
            const scene = game.scene.getScenes(true)[0];
            const player = scene?.player;
            const enemies = scene?.enemies ? scene.enemies.getChildren() : [];
            
            return {
                activeScene: scene ? scene.scene.key : null,
                player: player ? {
                    x: player.x,
                    y: player.y,
                    velocityX: player.body?.velocity.x || 0,
                    velocityY: player.body?.velocity.y || 0,
                    visible: player.visible,
                    active: player.active,
                    scale: player.scale
                } : null,
                enemies: enemies.map(enemy => ({
                    x: enemy.x,
                    y: enemy.y,
                    velocityX: enemy.body?.velocity.x || 0,
                    direction: enemy.direction,
                    active: enemy.active
                })),
                enemyCount: enemies.length,
                gameTime: game.loop.time,
                fps: Math.round(game.loop.actualFps)
            };
        }
    };
}
