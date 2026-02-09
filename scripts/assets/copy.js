import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure directories exist
const imagesDir = path.join(__dirname, 'public', 'assets', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Copy robot assets
const robotSource = path.join(__dirname, 'kenney_robot-pack', 'PNG', 'Side view');
const robotFiles = [
    { src: 'robot_blueBody.png', dest: 'robot-idle.png' },
    { src: 'robot_blueDrive1.png', dest: 'robot-walk-1.png' },
    { src: 'robot_blueDrive2.png', dest: 'robot-walk-2.png' },
    { src: 'robot_blueJump.png', dest: 'robot-jump.png' },
    { src: 'robot_blueHurt.png', dest: 'robot-fall.png' }
];

console.log('Copying robot assets...');
robotFiles.forEach(file => {
    const src = path.join(robotSource, file.src);
    const dest = path.join(imagesDir, file.dest);
    fs.copyFileSync(src, dest);
    console.log(`  ✓ ${file.dest}`);
});

// Copy platform tiles
const tilesSource = path.join(__dirname, 'kenney_pixel-platformer', 'Tiles');
const tileFiles = [
    'tile_0000.png', // grass platform
    'tile_0001.png', // dirt
    'tile_0018.png', // platform edge
];

console.log('\nCopying platform tiles...');
tileFiles.forEach((file) => {
    const src = path.join(tilesSource, file);
    let destName;
    if (file === 'tile_0000.png') destName = 'tile-grass.png';
    else if (file === 'tile_0001.png') destName = 'tile-dirt.png';
    else if (file === 'tile_0018.png') destName = 'tile-edge.png';
    
    const dest = path.join(imagesDir, destName);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`  ✓ ${destName}`);
    }
});

console.log('\n✨ Assets copied successfully!');
