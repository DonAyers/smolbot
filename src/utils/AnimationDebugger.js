/**
 * Animation Debugger Overlay
 * Shows current animation frame and allows manual frame stepping
 */
export default class AnimationDebugger {
    constructor(scene, sprite) {
        this.scene = scene;
        this.sprite = sprite;
        this.enabled = false;
        
        // Create UI elements (fixed to camera)
        const x = 400;
        const y = 16;
        
        this.background = scene.add.graphics();
        this.background.fillStyle(0x000000, 0.8);
        this.background.fillRect(x, y, 400, 120);
        this.background.setScrollFactor(0).setDepth(200).setVisible(false);
        
        this.text = scene.add.text(x + 10, y + 10, '', {
            fontSize: '14px',
            fill: '#00ff00',
            fontFamily: 'monospace'
        }).setScrollFactor(0).setDepth(201).setVisible(false);
        
        // Toggle with 'D' key
        scene.input.keyboard.on('keydown-D', () => {
            this.toggle();
        });
    }
    
    toggle() {
        this.enabled = !this.enabled;
        this.background.setVisible(this.enabled);
        this.text.setVisible(this.enabled);
    }
    
    update() {
        if (!this.enabled) return;
        
        const anim = this.sprite.anims.currentAnim;
        const frame = this.sprite.anims.currentFrame;
        
        let info = 'ANIMATION DEBUGGER (Press D to toggle)\n';
        info += '─────────────────────────────────\n';
        
        if (anim) {
            info += `Animation: ${anim.key}\n`;
            info += `Frame: ${frame ? frame.textureFrame : 'none'}\n`;
            info += `Progress: ${this.sprite.anims.getProgress().toFixed(2)}\n`;
            info += `Playing: ${this.sprite.anims.isPlaying}\n`;
            info += `FPS: ${anim.frameRate} | Repeat: ${anim.repeat === -1 ? 'forever' : anim.repeat}\n`;
        } else {
            info += 'No animation playing\n';
        }
        
        this.text.setText(info);
    }
    
    destroy() {
        this.background.destroy();
        this.text.destroy();
    }
}
