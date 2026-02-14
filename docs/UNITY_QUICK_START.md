# Unity POC Quick Start Guide

This guide will help you get started with the Unity POC for agentic game development. Follow these steps to set up your environment and begin implementation.

## Prerequisites

### Required Software
- **Unity Hub** (latest version)
- **Unity 2022.3 LTS** (will install via Hub)
- **Node.js** v18+ (for build automation scripts)
- **Python 3.8+** (for ML-Agents)
- **Git LFS** (for large binary files)

### Recommended Tools
- **Visual Studio Code** or **Visual Studio 2022** (for C# development)
- **Unity Extension** for VS Code
- **Git** for version control

### System Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Ubuntu 20.04+
- **RAM**: 8GB minimum, 16GB recommended
- **Disk**: 20GB free space for Unity + project
- **GPU**: Recommended for ML training (CUDA compatible)

## Installation Steps

### 1. Install Unity Hub

Download from [unity.com/download](https://unity.com/download)

```bash
# Linux (example)
wget https://public-cdn.cloud.unity3d.com/hub/prod/UnityHub.AppImage
chmod +x UnityHub.AppImage
./UnityHub.AppImage
```

### 2. Install Unity Editor

1. Open Unity Hub
2. Go to **Installs** tab
3. Click **Add**
4. Select **Unity 2022.3 LTS** (Long Term Support)
5. Add these modules:
   - ✅ Linux Build Support
   - ✅ Windows Build Support (if on Mac/Linux)
   - ✅ WebGL Build Support
   - ✅ Documentation (optional)

### 3. Create Unity Account

1. Create free account at [id.unity.com](https://id.unity.com)
2. Activate **Personal** license (free for revenue < $100k/year)
3. In Unity Hub: **Settings** → **License** → **Activate**

### 4. Install Git LFS

```bash
# macOS
brew install git-lfs

# Ubuntu/Debian
sudo apt-get install git-lfs

# Windows
# Download from https://git-lfs.github.com/
```

Initialize Git LFS:
```bash
git lfs install
```

### 5. Set Up Python Environment

```bash
# Create virtual environment
python3 -m venv unity-ml-env

# Activate it
source unity-ml-env/bin/activate  # Mac/Linux
# OR
unity-ml-env\Scripts\activate     # Windows

# Install ML-Agents
pip install mlagents
```

## Create Unity Project

### Option A: Create New Project

1. Open Unity Hub
2. Click **Projects** tab → **New project**
3. Select **2D (URP)** template
4. **Project name**: SmallBotUnity
5. **Location**: Choose directory
6. Click **Create project**

### Option B: From Repository (After Phase 1 Complete)

```bash
# Clone repository
git clone https://github.com/DonAyers/smolbot.git
cd smolbot
git checkout copilot/explore-unity-game-environment

# Pull LFS files
git lfs pull

# Open in Unity Hub
# File → Open Project → Select UnityProject/ directory
```

## Initial Configuration

### 1. Configure Project for Pixel Art

Once Unity opens:

1. **Edit** → **Project Settings** → **Quality**
   - Set **Texture Quality** to **Full Res**
   - Disable **Anti Aliasing**

2. **Edit** → **Project Settings** → **Player**
   - Set **Color Space** to **Linear** (for better lighting)

3. **Window** → **Rendering** → **Lighting**
   - Disable **Auto Generate** (for pixel art)

4. **Edit** → **Project Settings** → **Graphics**
   - Ensure **URP** asset is assigned

### 2. Set Up Folders

Create this structure in **Assets/**:
```
Assets/
├── Scripts/
│   ├── Core/
│   ├── Agents/
│   └── Editor/
├── Scenes/
├── Prefabs/
├── Sprites/
├── Animations/
├── Tilemaps/
└── Tests/
```

### 3. Configure Git for Unity

Create `.gitignore` in project root:
```gitignore
# Unity
[Ll]ibrary/
[Tt]emp/
[Oo]bj/
[Bb]uild/
[Bb]uilds/
[Ll]ogs/
[Uu]ser[Ss]ettings/

# Unity specific
*.pidb.meta
*.pdb.meta
*.mdb.meta

# OS
.DS_Store
Thumbs.db

# Keep LFS tracked files
!Assets/**/*.png
!Assets/**/*.jpg
!Assets/**/*.psd
!Assets/**/*.fbx
!Assets/**/*.wav
!Assets/**/*.mp3
```

Create `.gitattributes`:
```gitattributes
# Unity LFS
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.psd filter=lfs diff=lfs merge=lfs -text
*.fbx filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
```

### 4. Install Unity Packages

1. **Window** → **Package Manager**
2. Click **+** → **Add package by name**
3. Add these packages:
   - `com.unity.ml-agents` (ML-Agents)
   - `com.unity.test-framework` (Testing)
   - `com.unity.2d.animation` (2D Animation)
   - `com.unity.2d.pixel-perfect` (Pixel Perfect Camera)

## Verify Setup

### Test Unity Editor

1. **File** → **New Scene**
2. Create GameObject (right-click Hierarchy → **2D Object** → **Sprite**)
3. Press **Play** button
4. Should enter play mode without errors

### Test Headless Build

```bash
# From project root
unity -quit -batchmode -nographics -projectPath . -logFile -
```

Should complete without errors.

### Test ML-Agents Python

```bash
# Activate Python environment
source unity-ml-env/bin/activate

# Check installation
mlagents-learn --help
```

Should display help text.

## Next Steps

Now you're ready to begin implementing the Unity POC!

### Phase 1: Follow the Issues

Start with **Issue #1** from [UNITY_ROADMAP.md](UNITY_ROADMAP.md):
1. Issue #1: Unity Project Initialization
2. Issue #2: Git Configuration
3. Issue #3: Asset Import
4. Issue #4: Player Controller
5. Issue #5: Basic Level
6. Issue #6: Build Automation

### Useful Unity Learning Resources

**Official:**
- [Unity Learn](https://learn.unity.com/) - Free tutorials
- [Unity Manual](https://docs.unity3d.com/Manual/index.html)
- [Unity Scripting API](https://docs.unity3d.com/ScriptReference/)

**2D Specific:**
- [2D Game Dev Tutorial](https://learn.unity.com/project/2d-game-kit)
- [Pixel Perfect Camera](https://docs.unity3d.com/Packages/com.unity.2d.pixel-perfect@latest)
- [2D Tilemap Extras](https://github.com/Unity-Technologies/2d-extras)

**ML-Agents:**
- [ML-Agents Documentation](https://unity-technologies.github.io/ml-agents/)
- [Getting Started](https://unity-technologies.github.io/ml-agents/Getting-Started/)
- [Example Projects](https://github.com/Unity-Technologies/ml-agents/tree/main/Project)

### Development Workflow

```bash
# 1. Work in Unity Editor
# Make changes, test in editor

# 2. Test via CLI
npm run unity:build

# 3. Run tests
npm run unity:test

# 4. Train ML-Agent (later)
mlagents-learn config/ppo-config.yaml --run-id=test-run

# 5. Commit changes
git add .
git commit -m "Implement feature X"
git push
```

## Troubleshooting

### Unity Won't Open Project
**Problem**: Missing Unity version
**Solution**: Install exact Unity version in Unity Hub

### Git LFS Issues
**Problem**: Large files not tracked
**Solution**: 
```bash
git lfs track "*.png"
git add .gitattributes
```

### ML-Agents Import Fails
**Problem**: Package not found
**Solution**: Add package by git URL:
```
https://github.com/Unity-Technologies/ml-agents.git?path=com.unity.ml-agents
```

### Build Fails
**Problem**: Missing build target
**Solution**: Install build support in Unity Hub → Installs → Add Modules

### Python Errors
**Problem**: ML-Agents version mismatch
**Solution**: 
```bash
pip install mlagents==0.30.0  # Match Unity package version
```

## Getting Help

- **Unity Forums**: [forum.unity.com](https://forum.unity.com)
- **ML-Agents Discord**: [Unity ML-Agents](https://discord.com/invite/unity-ml-agents)
- **Stack Overflow**: Tag [unity3d]
- **GitHub Issues**: Open issue in this repo

## Summary Checklist

Before starting Phase 1, verify:
- [ ] Unity Hub installed
- [ ] Unity 2022.3 LTS installed
- [ ] Unity account activated
- [ ] Git LFS configured
- [ ] Python environment set up
- [ ] ML-Agents package installed
- [ ] Can open Unity project
- [ ] Can run headless build
- [ ] Reviewed UNITY_POC.md
- [ ] Reviewed UNITY_ROADMAP.md

## Estimated Time

- **Setup**: 2-3 hours
- **Phase 1** (Issues #1-6): 1-2 weeks
- **Full POC** (All phases): 10-12 weeks

## Important Notes

⚠️ **This is experimental**: The Unity POC is exploratory. Document learnings as you go.

⚠️ **Parallel development**: Continue Phaser development while exploring Unity.

⚠️ **Measure everything**: Track iteration speed, build times, test effectiveness.

⚠️ **ML training takes time**: Agent training can take hours to days.

⚠️ **Disk space**: Unity projects are large (5-10GB+).

---

Ready to begin? Start with [UNITY_ROADMAP.md](UNITY_ROADMAP.md) Issue #1!
