#!/usr/bin/env node

/**
 * Local Asset Generator with AI Evaluation
 * 
 * Uses Ollama + OllamaDiffuser for local asset generation and evaluation:
 * 1. Generates pixel art using Stable Diffusion XL + Pixel Art LoRA
 * 2. Evaluates quality using LLaVA vision models
 * 3. Iteratively refines until quality threshold met
 * 4. Automatically organizes into asset folders
 * 5. Generates game-ready sprite specifications
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');

class LocalAssetGenerator {
    constructor(options = {}) {
        this.outputDir = options.outputDir || 'generated-assets';
        this.qualityThreshold = options.qualityThreshold || 7; // 0-10 scale
        this.maxIterations = options.maxIterations || 5;
        this.ollamaModel = options.ollamaModel || 'llava:13b';
        this.imageSize = options.imageSize || '512x512';
        this.pixelDensity = options.pixelDensity || '32'; // 8, 16, 32, 64 bit style
        
        // Ensure output directory exists
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    /**
     * Generate a pixel art asset with iterative improvement
     */
    async generateAsset(request) {
        console.log(`\n🎨 Starting generation: ${request.name}`);
        console.log(`   Type: ${request.type}`);
        console.log(`   Description: ${request.description}`);

        const taskDir = path.join(this.outputDir, `task_${Date.now()}`);
        fs.mkdirSync(taskDir, { recursive: true });

        let bestImage = null;
        let bestScore = 0;
        let bestPrompt = null;

        for (let iteration = 1; iteration <= this.maxIterations; iteration++) {
            console.log(`\n--- Iteration ${iteration}/${this.maxIterations} ---`);

            // Generate prompt
            const prompt = this.buildPrompt(request, iteration, bestScore > 0 ? {
                score: bestScore,
                feedback: bestImage?.feedback
            } : null);

            console.log(`📝 Prompt: ${prompt}`);

            // Generate image
            const imagePath = path.join(taskDir, `iteration_${iteration}.png`);
            const generated = await this.generateImage(prompt, imagePath);

            if (!generated) {
                console.log('❌ Generation failed, skipping...');
                continue;
            }

            // Evaluate with LLaVA
            const evaluation = await this.evaluateImage(imagePath, request);
            console.log(`\n📊 Evaluation:`);
            console.log(`   Score: ${evaluation.score}/10`);
            console.log(`   Feedback: ${evaluation.feedback}`);

            // Track best result
            if (evaluation.score > bestScore) {
                bestScore = evaluation.score;
                bestImage = { path: imagePath, evaluation };
                bestPrompt = prompt;
            }

            // Check if we met the threshold
            if (evaluation.score >= this.qualityThreshold) {
                console.log(`\n✅ Quality threshold met! (${evaluation.score}/10)`);
                break;
            }
        }

        // Save results
        if (bestImage) {
            const finalPath = path.join(taskDir, `${request.name}.png`);
            fs.copyFileSync(bestImage.path, finalPath);

            const metadata = {
                name: request.name,
                type: request.type,
                description: request.description,
                prompt: bestPrompt,
                score: bestScore,
                evaluation: bestImage.evaluation,
                timestamp: new Date().toISOString()
            };

            fs.writeFileSync(
                path.join(taskDir, `${request.name}.json`),
                JSON.stringify(metadata, null, 2)
            );

            console.log(`\n🎉 Best result saved:`);
            console.log(`   Score: ${bestScore}/10`);
            console.log(`   Path: ${finalPath}`);

            return { success: true, path: finalPath, metadata };
        }

        console.log(`\n❌ Failed to generate acceptable asset after ${this.maxIterations} iterations`);
        return { success: false };
    }

    /**
     * Build generation prompt with context and refinement
     */
    buildPrompt(request, iteration, previousResult) {
        let prompt = `${this.pixelDensity}-bit pixel art style, `;

        // Add core description
        prompt += request.description;

        // Add type-specific keywords
        const typeKeywords = {
            'character': 'game sprite, character design, side view',
            'enemy': 'enemy sprite, hostile creature, game enemy',
            'building': 'building, architecture, structure',
            'prop': 'game object, prop, item',
            'tile': 'tileable, seamless, terrain',
            'background': 'background element, scenery',
            'ui': 'UI element, interface, icon'
        };

        if (typeKeywords[request.type]) {
            prompt += `, ${typeKeywords[request.type]}`;
        }

        // Add style guidance
        prompt += `, clean pixel art, sharp edges, limited color palette`;

        // Add game-specific context if provided
        if (request.gameStyle) {
            prompt += `, ${request.gameStyle} style`;
        }

        // Add refinement based on previous feedback
        if (previousResult && iteration > 1) {
            const feedback = previousResult.feedback.toLowerCase();
            
            if (feedback.includes('blurry') || feedback.includes('unclear')) {
                prompt += ', crisp sharp details';
            }
            if (feedback.includes('color')) {
                prompt += ', vibrant limited palette';
            }
            if (feedback.includes('simple') || feedback.includes('plain')) {
                prompt += ', more detail and character';
            }
        }

        // Technical settings (commented for reference)
        // These would be passed to the generation command separately
        // - Downscale by 8x with nearest neighbor for pixelated look
        // - No style keywords like "pixel art" in prompt (handled by LoRA)

        return prompt;
    }

    /**
     * Generate image using OllamaDiffuser or similar tool
     */
    async generateImage(prompt, outputPath) {
        console.log('🖼️  Generating image...');

        // Check if OllamaDiffuser is available
        const hasOllamaDiffuser = await this.checkCommand('ollamadiffuser');

        if (hasOllamaDiffuser) {
            return this.generateWithOllamaDiffuser(prompt, outputPath);
        }

        // Fallback: Check for Ollama's native image generation
        const hasOllamaImage = await this.checkOllamaImageSupport();
        if (hasOllamaImage) {
            return this.generateWithOllama(prompt, outputPath);
        }

        console.log('⚠️  No image generation tool found.');
        console.log('   Install OllamaDiffuser: pip install ollamadiffuser');
        console.log('   Or update Ollama for native image generation support');
        return false;
    }

    /**
     * Generate with OllamaDiffuser (SDXL + Pixel Art LoRA)
     */
    generateWithOllamaDiffuser(prompt, outputPath) {
        return new Promise((resolve) => {
            const args = [
                'generate',
                '--prompt', prompt,
                '--output', outputPath,
                '--model', 'sdxl',
                '--lora', 'pixel-art-xl-v1.1',
                '--width', this.imageSize.split('x')[0],
                '--height', this.imageSize.split('x')[1],
                '--steps', '30',
                '--cfg-scale', '7.5'
            ];

            const proc = spawn('ollamadiffuser', args);
            let output = '';

            proc.stdout.on('data', (data) => {
                output += data.toString();
                process.stdout.write('.');
            });

            proc.on('close', (code) => {
                console.log(''); // New line after dots
                if (code === 0 && fs.existsSync(outputPath)) {
                    console.log('✅ Image generated successfully');
                    resolve(true);
                } else {
                    console.log(`❌ Generation failed with code ${code}`);
                    resolve(false);
                }
            });

            proc.on('error', (err) => {
                console.log(`❌ Error: ${err.message}`);
                resolve(false);
            });
        });
    }

    /**
     * Generate with Ollama native image generation
     */
    generateWithOllama(prompt, outputPath) {
        return new Promise((resolve) => {
            const proc = spawn('ollama', ['run', 'x/z-image-turbo', prompt]);
            
            let output = '';
            proc.stdout.on('data', (data) => {
                output += data.toString();
            });

            proc.on('close', (code) => {
                if (code === 0) {
                    // Parse output to extract image path and move to outputPath
                    // This is experimental and may vary by Ollama version
                    console.log('⚠️  Ollama native generation completed, but format may vary');
                    resolve(false); // For now, consider this unsupported
                } else {
                    resolve(false);
                }
            });

            proc.on('error', () => resolve(false));
        });
    }

    /**
     * Evaluate image quality using LLaVA vision model
     */
    async evaluateImage(imagePath, request) {
        console.log('🔍 Evaluating with LLaVA...');

        const evaluationPrompt = this.buildEvaluationPrompt(request);

        return new Promise((resolve) => {
            // Ollama vision API call
            const proc = spawn('ollama', ['run', this.ollamaModel]);
            
            let output = '';
            
            proc.stdout.on('data', (data) => {
                output += data.toString();
            });

            proc.stdin.write(`Analyze this pixel art image: ${imagePath}\n\n${evaluationPrompt}\n`);
            proc.stdin.end();

            proc.on('close', () => {
                const evaluation = this.parseEvaluation(output);
                resolve(evaluation);
            });

            proc.on('error', (err) => {
                console.log(`⚠️  Evaluation error: ${err.message}`);
                resolve({ score: 5, feedback: 'Could not evaluate' });
            });
        });
    }

    /**
     * Build evaluation prompt for LLaVA
     */
    buildEvaluationPrompt(request) {
        return `You are a pixel art expert evaluating game assets. Analyze this image for:

1. **Pixel Art Quality** (0-10):
   - Are edges crisp and clean?
   - Is the pixel grid visible and intentional?
   - Does it avoid blur or anti-aliasing artifacts?

2. **Style Consistency**:
   - Matches ${this.pixelDensity}-bit pixel art style?
   - Limited, cohesive color palette?
   - Appropriate level of detail?

3. **Game Asset Suitability**:
   - Type: ${request.type}
   - Purpose: ${request.description}
   - Would it work well in a ${request.gameStyle || 'platformer'} game?

4. **Overall Assessment**:
   - Visual appeal and clarity
   - Readability at game scale
   - Professional quality

Please provide:
- SCORE: X/10 (single number)
- FEEDBACK: Specific suggestions for improvement (2-3 sentences)

Format your response as:
SCORE: 7
FEEDBACK: The character has good proportions but the colors are slightly muddy. Consider using a more vibrant palette with higher contrast. The outline could be crisper.`;
    }

    /**
     * Parse LLaVA evaluation response
     */
    parseEvaluation(output) {
        // Extract score
        const scoreMatch = output.match(/SCORE:\s*(\d+)/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;

        // Extract feedback
        const feedbackMatch = output.match(/FEEDBACK:\s*(.+?)(?=\n\n|\n[A-Z]+:|$)/is);
        const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'No specific feedback provided.';

        return { score, feedback };
    }

    /**
     * Check if a command exists
     */
    async checkCommand(cmd) {
        return new Promise((resolve) => {
            const proc = spawn(process.platform === 'win32' ? 'where' : 'which', [cmd]);
            proc.on('close', (code) => resolve(code === 0));
            proc.on('error', () => resolve(false));
        });
    }

    /**
     * Check if Ollama supports image generation
     */
    async checkOllamaImageSupport() {
        // This would check Ollama version/capabilities
        // For now, return false as it's experimental
        return false;
    }

    /**
     * Batch generate multiple assets
     */
    async generateBatch(requests) {
        const results = [];

        for (const request of requests) {
            const result = await this.generateAsset(request);
            results.push(result);

            if (result.success) {
                console.log(`\n✅ ${request.name} completed successfully`);
            } else {
                console.log(`\n❌ ${request.name} failed`);
            }
        }

        return results;
    }
}

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];

    const generator = new LocalAssetGenerator({
        outputDir: 'generated-assets',
        qualityThreshold: 7,
        maxIterations: 5,
        ollamaModel: 'llava:13b',
        pixelDensity: '32'
    });

    if (command === 'generate') {
        const requestFile = args[1];
        if (!requestFile) {
            console.log('Usage: node local-asset-generator.js generate <request-file.json>');
            process.exit(1);
        }

        const request = JSON.parse(fs.readFileSync(requestFile, 'utf8'));
        generator.generateAsset(request).then((result) => {
            process.exit(result.success ? 0 : 1);
        });

    } else if (command === 'batch') {
        const batchFile = args[1];
        if (!batchFile) {
            console.log('Usage: node local-asset-generator.js batch <batch-file.json>');
            process.exit(1);
        }

        const requests = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
        generator.generateBatch(requests).then(() => {
            console.log('\n✅ Batch generation complete');
        });

    } else {
        console.log(`
Local Asset Generator with AI Evaluation

Commands:
  generate <file>   Generate single asset from JSON request
  batch <file>      Generate multiple assets from JSON array

Example request.json:
{
  "name": "robot-hero",
  "type": "character",
  "description": "small friendly robot with tank treads",
  "gameStyle": "retro platformer like Megaman"
}

Installation:
  pip install ollamadiffuser
  ollama pull llava:13b

Setup SDXL + Pixel Art LoRA:
  ollamadiffuser download sdxl
  ollamadiffuser download lora pixel-art-xl-v1.1
        `);
    }
}

module.exports = LocalAssetGenerator;
