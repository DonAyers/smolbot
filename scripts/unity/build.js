// Unity Build Automation Script
// This script triggers Unity builds from the command line
//
// Usage:
//   node scripts/unity/build.js [target] [options]
//
// Examples:
//   node scripts/unity/build.js linux
//   node scripts/unity/build.js windows --scene=MainScene
//   node scripts/unity/build.js webgl --development

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Configuration
const UNITY_PATH = process.env.UNITY_PATH || '/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app/Contents/MacOS/Unity';
const PROJECT_PATH = path.join(projectRoot, 'UnityProject');
const BUILD_PATH = path.join(projectRoot, 'Builds');

// Build targets
const BUILD_TARGETS = {
  linux: 'Linux64',
  windows: 'Win64',
  mac: 'OSXUniversal',
  webgl: 'WebGL',
  headless: 'LinuxHeadlessSimulation'
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const target = args[0] || 'linux';
  
  const options = {
    target,
    buildTarget: BUILD_TARGETS[target] || BUILD_TARGETS.linux,
    development: args.includes('--development'),
    scene: null,
    method: 'BuildScript.PerformBuild'
  };
  
  // Parse scene option
  const sceneArg = args.find(arg => arg.startsWith('--scene='));
  if (sceneArg) {
    options.scene = sceneArg.split('=')[1];
  }
  
  return options;
}

// Execute Unity build
async function executeBuild(options) {
  console.log('🎮 Unity Build Automation');
  console.log('========================');
  console.log(`Target: ${options.target}`);
  console.log(`Build Target: ${options.buildTarget}`);
  console.log(`Development: ${options.development}`);
  console.log(`Project: ${PROJECT_PATH}`);
  console.log('');
  
  // Ensure build directory exists
  const targetBuildPath = path.join(BUILD_PATH, options.target);
  fs.mkdirSync(targetBuildPath, { recursive: true });
  
  // Build Unity command line arguments
  const unityArgs = [
    '-quit',                                    // Quit after completion
    '-batchmode',                               // Run without UI
    '-nographics',                              // Don't initialize graphics device
    `-projectPath`, PROJECT_PATH,               // Project location
    `-buildTarget`, options.buildTarget,        // Build target platform
    `-logFile`, '-',                            // Log to stdout
    `-executeMethod`, options.method,           // Editor method to call
  ];
  
  // Add development build flag if specified
  if (options.development) {
    unityArgs.push('-development');
  }
  
  console.log('🔨 Starting build...');
  console.log(`Command: ${UNITY_PATH} ${unityArgs.join(' ')}`);
  console.log('');
  
  return new Promise((resolve, reject) => {
    const unity = spawn(UNITY_PATH, unityArgs, {
      cwd: projectRoot,
      stdio: 'inherit'
    });
    
    unity.on('exit', (code) => {
      if (code === 0) {
        console.log('');
        console.log('✅ Build completed successfully!');
        console.log(`Output: ${targetBuildPath}`);
        resolve();
      } else {
        console.error('');
        console.error(`❌ Build failed with exit code ${code}`);
        reject(new Error(`Unity build failed with exit code ${code}`));
      }
    });
    
    unity.on('error', (err) => {
      console.error('❌ Failed to start Unity:', err);
      reject(err);
    });
  });
}

// Validate Unity installation
function validateUnity() {
  if (!fs.existsSync(UNITY_PATH)) {
    console.error('❌ Unity not found at:', UNITY_PATH);
    console.error('');
    console.error('Please set UNITY_PATH environment variable or install Unity at default location.');
    console.error('');
    console.error('Example:');
    console.error('  export UNITY_PATH=/path/to/Unity');
    process.exit(1);
  }
  
  if (!fs.existsSync(PROJECT_PATH)) {
    console.error('❌ Unity project not found at:', PROJECT_PATH);
    console.error('');
    console.error('Please create the Unity project first.');
    console.error('See docs/UNITY_QUICK_START.md for setup instructions.');
    process.exit(1);
  }
}

// Main execution
async function main() {
  try {
    validateUnity();
    const options = parseArgs();
    await executeBuild(options);
  } catch (error) {
    console.error('❌ Build error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { executeBuild, parseArgs };
