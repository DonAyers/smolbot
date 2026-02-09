/**
 * Asset Discovery and Generation Agent
 * 
 * Helps find or generate pixel art assets for the game using:
 * - OpenGameArt.org search
 * - Web search for free assets
 * - AI image generation prompts
 * - Asset organization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

class AssetDiscoveryAgent {
    constructor() {
        this.sources = [
            'https://opengameart.org',
            'https://itch.io/game-assets',
            'https://kenney.nl/assets',
            'https://craftpix.net/freebies/'
        ];
    }

    // Generate search prompts for finding assets
    generateSearchPrompts(assetType, style = 'pixel art') {
        return {
            openGameArt: `site:opengameart.org ${style} ${assetType} 2D platformer`,
            general: `${style} ${assetType} free game assets 2D`,
            itch: `site:itch.io ${style} ${assetType} free`,
            kenney: `site:kenney.nl ${assetType} ${style}`
        };
    }

    // Generate prompt for AI image generation
    generateAIPrompt(assetType, styleReference) {
        return `Create pixel art ${assetType} in ${styleReference} style.

Requirements:
- Pixel art style, 16-bit or 32-bit era
- Transparent background (PNG)
- Appropriate size for 2D platformer (typically 32x32 to 128x128)
- Color palette matching ${styleReference}
- Clean, readable sprites
- Multiple variations if possible

Technical specs:
- Format: PNG
- Transparency: Yes
- Palette: Limited colors (8-32 colors typical)
- Style: Sharp pixels, no anti-aliasing
- Theme: ${styleReference}

Output should be suitable for Phaser.js game engine.`;
    }

    // Create a comprehensive asset request document
    createAssetRequest(taskId, assetType, description, styleReferences) {
        const timestamp = Date.now();
        const requestFile = path.join(projectRoot, 'improvement-tasks', taskId, `asset-request-${timestamp}.md`);

        const content = `# Asset Request: ${assetType}

**Task ID**: ${taskId}
**Created**: ${new Date().toISOString()}

## What We Need

${description}

## Style References

${styleReferences.map(ref => `- ${ref}`).join('\n')}

## Search Prompts

### OpenGameArt.org
\`\`\`
${this.generateSearchPrompts(assetType).openGameArt}
\`\`\`

### General Web Search
\`\`\`
${this.generateSearchPrompts(assetType).general}
\`\`\`

### Itch.io
\`\`\`
${this.generateSearchPrompts(assetType).itch}
\`\`\`

### Kenney Assets
\`\`\`
${this.generateSearchPrompts(assetType).kenney}
\`\`\`

## AI Generation Prompt

If generating assets with AI:

\`\`\`
${this.generateAIPrompt(assetType, styleReferences.join(', '))}
\`\`\`

## Manual Search Links

- [OpenGameArt.org Search](https://opengameart.org/art-search-advanced?keys=${encodeURIComponent(assetType)}&field_art_type_tid%5B%5D=9)
- [Itch.io Game Assets](https://itch.io/game-assets/free/tag-pixel-art)
- [Kenney Assets](https://kenney.nl/assets?q=${encodeURIComponent(assetType)})
- [CraftPix Free Assets](https://craftpix.net/freebies/)

## Instructions for Agent

1. **Search Phase**: Use web_search with the prompts above
2. **Evaluate Phase**: Check license compatibility (CC0, CC-BY, MIT preferred)
3. **Download Phase**: Save to \`to-be-processed-assets/\`
4. **Organize Phase**: Asset watcher will auto-organize
5. **Integrate Phase**: Update BootScene.js with new asset loads

## License Requirements

✅ Compatible:
- CC0 (Public Domain)
- CC-BY (Attribution required)
- MIT
- GPL (if game is GPL)

❌ Avoid:
- All Rights Reserved
- Non-commercial only (if game might be commercial)
- No-derivatives

## Integration Checklist

After acquiring assets:

- [ ] Assets in \`to-be-processed-assets/\`
- [ ] Asset watcher organized them
- [ ] Check \`asset-manifest.json\`
- [ ] Update \`src/scenes/BootScene.js\`
- [ ] Test in Sprite Viewer (press V)
- [ ] Use in target component
- [ ] Test gameplay
- [ ] Commit changes

## Notes

Add any notes about the asset search here...
`;

        fs.writeFileSync(requestFile, content);
        console.log(`\n📄 Asset request created: ${requestFile}`);
        
        return requestFile;
    }

    // Create agent prompt for asset discovery
    createDiscoveryAgentPrompt(taskId, assetType, description, styleReferences) {
        const requestFile = this.createAssetRequest(taskId, assetType, description, styleReferences);

        return `You are an asset discovery agent for game development.

TASK: Find ${assetType} assets

REQUIREMENTS: ${description}

STYLE REFERENCES: ${styleReferences.join(', ')}

REQUEST DOCUMENT: ${requestFile}
(Review this file for search prompts and instructions)

YOUR MISSION:

1. **SEARCH FOR EXISTING ASSETS**
   Use web_search to find free pixel art ${assetType}:
   
   a. OpenGameArt.org:
      - Search: "${this.generateSearchPrompts(assetType).openGameArt}"
      - Look for CC0 or CC-BY licensed assets
      - Download links are usually direct
   
   b. Itch.io:
      - Search: "${this.generateSearchPrompts(assetType).itch}"
      - Many free pixel art packs
      - Check license in description
   
   c. Kenney.nl:
      - Search: "${this.generateSearchPrompts(assetType).kenney}"
      - All assets are CC0 (public domain)
      - High quality, consistent style
   
   d. General search:
      - Look for indie game dev resources
      - Reddit /r/gameassets
      - GitHub repositories with assets

2. **DOCUMENT FINDINGS**
   For each promising asset:
   - URL
   - License
   - Description
   - Why it fits our needs
   
   Create: ${path.join(projectRoot, 'improvement-tasks', taskId, 'asset-findings.md')}

3. **IF NO SUITABLE ASSETS FOUND**
   Document in asset-findings.md:
   - What you searched for
   - What you found but didn't work (and why)
   - Recommendation to generate with AI or commission

4. **DOWNLOAD INSTRUCTIONS**
   If you find good assets:
   - Provide download URLs
   - Note any attribution requirements
   - Suggest where to extract (to-be-processed-assets/)

5. **ALTERNATIVE: AI GENERATION**
   If searching fails, document:
   - Specific AI generation prompts (see request doc)
   - Recommended tools (DALL-E, Midjourney, Stable Diffusion)
   - Style parameters

DELIVERABLES:
✅ asset-findings.md with search results
✅ Download URLs or generation prompts
✅ License information
✅ Integration recommendations

START SEARCHING! Focus on OpenGameArt.org and Kenney.nl first (best free resources).`;
    }
}

// CLI Interface
const command = process.argv[2];

if (command === 'search') {
    const taskId = process.argv[3];
    const assetType = process.argv[4];
    const description = process.argv[5] || `${assetType} for game`;
    const styleRefs = process.argv.slice(6);

    if (!taskId || !assetType) {
        console.log(`
🔍 Asset Discovery Agent

Usage:
  node asset-discovery-agent.js search <task-id> <asset-type> [description] [style-refs...]

Example:
  node asset-discovery-agent.js search task_123 "building windows" "Various window sprites" "Megaman X" "Fez"

This will:
  1. Create an asset request document
  2. Generate search prompts for multiple sources
  3. Create a Copilot agent prompt for autonomous search

Then run:
  copilot --allow-all-tools -p "$(cat improvement-tasks/task_123/asset-discovery-prompt.txt)"
`);
        process.exit(1);
    }

    const agent = new AssetDiscoveryAgent();
    const prompt = agent.createDiscoveryAgentPrompt(
        taskId,
        assetType,
        description,
        styleRefs.length > 0 ? styleRefs : ['pixel art', '2D platformer']
    );

    const promptFile = path.join(projectRoot, 'improvement-tasks', taskId, 'asset-discovery-prompt.txt');
    fs.writeFileSync(promptFile, prompt);

    console.log(`\n✅ Asset discovery setup complete!`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Review: ${promptFile}`);
    console.log(`   2. Run agent: copilot --allow-all-tools -p "$(cat ${promptFile})"`);
    console.log(`   3. Agent will search and document findings`);
    console.log(`   4. Download assets to: to-be-processed-assets/`);
    console.log(`   5. Asset watcher will organize automatically\n`);

} else {
    console.log(`
🔍 Asset Discovery Agent

Commands:
  search <task-id> <asset-type> [description] [style-refs...]
    Create asset discovery request and agent prompt

Example:
  node asset-discovery-agent.js search task_123 "neon signs" "Glowing signs for buildings" "Cyberpunk" "Blade Runner"
`);
    process.exit(1);
}

export default AssetDiscoveryAgent;
