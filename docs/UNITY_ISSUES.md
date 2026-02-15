# Unity POC - GitHub Issues to Create

This document contains the text for creating GitHub issues for the Unity POC implementation. Copy and paste each issue into GitHub.

## Labels to Create First

Create these labels in the repository:
- `unity-poc` (color: #0052CC) - All Unity POC related issues
- `phase-1` (color: #00875A) - Phase 1 issues
- `phase-2` (color: #00875A) - Phase 2 issues
- `phase-3` (color: #00875A) - Phase 3 issues
- `phase-4` (color: #00875A) - Phase 4 issues
- `phase-5` (color: #00875A) - Phase 5 issues
- `ml-agents` (color: #5243AA) - ML-Agents specific work
- `automation` (color: #FF5630) - Automation pipeline work

---

## Issue #1: Unity Project Initialization

**Title**: Set up Unity 2D project structure and configuration

**Labels**: `unity-poc`, `phase-1`, `enhancement`

**Body**:
```markdown
## Overview
Initialize a new Unity 2D project configured for pixel art platformer development. This is the foundation for the Unity POC.

## Context
This is part of the Unity agentic development POC. See [docs/UNITY_POC.md](../docs/UNITY_POC.md) for full context.

## Tasks
- [ ] Install Unity Hub and Unity 2022.3 LTS
- [ ] Create new 2D project with URP (Universal Render Pipeline)
- [ ] Configure project settings for pixel art (no filtering, pixel-perfect camera)
- [ ] Set up initial scene structure
- [ ] Create basic folder organization in Assets/
- [ ] Document Unity version and packages used

## Acceptance Criteria
- [ ] Unity project opens without errors
- [ ] 2D settings are properly configured for pixel art
- [ ] Project structure follows Unity best practices
- [ ] README includes Unity version requirements

## Resources
- [Unity Quick Start Guide](../docs/UNITY_QUICK_START.md)
- [Unity 2D Documentation](https://docs.unity3d.com/Manual/Unity2D.html)
- [Pixel Perfect Package](https://docs.unity3d.com/Packages/com.unity.2d.pixel-perfect@latest)

## Estimated Effort
2-4 hours

## Dependencies
None - this is the first issue
```

---

## Issue #2: Git Configuration for Unity

**Title**: Configure Git for Unity projects (LFS, .gitignore, .gitattributes)

**Labels**: `unity-poc`, `phase-1`, `enhancement`

**Body**:
```markdown
## Overview
Set up version control properly for Unity projects to avoid repository bloat and merge conflicts.

## Context
Unity projects have specific version control needs including Git LFS for binary files and proper .gitignore configuration.

## Tasks
- [ ] Add Unity-specific .gitignore
- [ ] Configure .gitattributes for Unity files
- [ ] Set up Git LFS for large binary files (textures, audio, models)
- [ ] Document what files should/shouldn't be committed
- [ ] Test with initial commit

## Acceptance Criteria
- [ ] Only necessary files are tracked in Git
- [ ] Binary files use LFS
- [ ] Meta files are properly tracked
- [ ] Library/ and Temp/ are ignored
- [ ] Can clone and open project on fresh machine

## Resources
- [GitHub's Unity .gitignore](https://github.com/github/gitignore/blob/main/Unity.gitignore)
- [Unity Version Control Best Practices](https://docs.unity3d.com/Manual/ExternalVersionControlSystemSupport.html)
- [Git LFS Documentation](https://git-lfs.github.com/)

## Estimated Effort
1-2 hours

## Dependencies
Depends on #1 (Unity Project Initialization)
```

---

## Issue #3: Import Kenney Assets

**Title**: Import Kenney pixel art assets into Unity

**Labels**: `unity-poc`, `phase-1`, `assets`, `enhancement`

**Body**:
```markdown
## Overview
Import the existing Kenney asset packs (Robot Pack, Pixel Platformer, etc.) into Unity and configure them for 2D use.

## Context
We have Kenney assets already organized in the asset-sources/ directory from the Phaser version. These need to be imported and configured for Unity.

## Tasks
- [ ] Copy assets from asset-sources/ to Unity project
- [ ] Configure import settings (sprites, pixels-per-unit, filter mode)
- [ ] Create sprite atlases for performance
- [ ] Organize sprites in Unity folders matching Phaser organization
- [ ] Set up sprite slicing for sprite sheets
- [ ] Test asset loading in scene

## Acceptance Criteria
- [ ] All assets visible and usable in Unity
- [ ] Import settings are correct (Point filter, appropriate PPU)
- [ ] Sprite atlases generated and working
- [ ] Assets organized by type/pack
- [ ] Sprite sheets are properly sliced

## Resources
- [Unity Sprite Import Settings](https://docs.unity3d.com/Manual/class-TextureImporter.html)
- [Sprite Atlas Documentation](https://docs.unity3d.com/Manual/class-SpriteAtlas.html)
- Asset packs location: `asset-sources/`

## Estimated Effort
2-3 hours

## Dependencies
Depends on #1 (Unity Project Initialization)
```

---

## Issue #4: Basic Player Controller

**Title**: Implement 2D player controller in C#

**Labels**: `unity-poc`, `phase-1`, `gameplay`, `enhancement`

**Body**:
```markdown
## Overview
Create a basic 2D platformer player controller with movement, jumping, and animations.

## Context
This establishes the core gameplay mechanics in Unity, analogous to the player controller in the Phaser version.

## Tasks
- [ ] Create Player prefab with sprites
- [ ] Implement PlayerController C# script
- [ ] Add physics (Rigidbody2D, Collider2D)
- [ ] Set up input system (keyboard controls: WASD/Arrows, Space to jump)
- [ ] Create basic animations (idle, walk, jump)
- [ ] Set up Animation Controller with state transitions
- [ ] Test movement and physics

## Acceptance Criteria
- [ ] Player can move left/right smoothly
- [ ] Jump physics feel good (tunable jump height and gravity)
- [ ] Animations transition correctly based on state
- [ ] Controls are responsive
- [ ] No jittering or physics issues

## Reference
- Phaser player controller: `src/components/Player.js`
- Similar controls and feel expected

## Resources
- [Unity 2D Character Controller Tutorial](https://learn.unity.com/tutorial/creating-a-2d-character-controller)
- [Rigidbody2D Documentation](https://docs.unity3d.com/ScriptReference/Rigidbody2D.html)

## Estimated Effort
4-6 hours

## Dependencies
Depends on #3 (Import Kenney Assets)
```

---

## Issue #5: Basic Level Setup

**Title**: Create basic 2D platformer level with tilemaps

**Labels**: `unity-poc`, `phase-1`, `gameplay`, `enhancement`

**Body**:
```markdown
## Overview
Set up a simple test level using Unity's Tilemap system to validate the player controller and establish the basic game loop.

## Context
This creates a playable scene that demonstrates the Unity setup is working end-to-end.

## Tasks
- [ ] Create Tilemap with collision
- [ ] Build simple test level (platforms, ground)
- [ ] Add camera follow script
- [ ] Set up scene boundaries
- [ ] Add goal/win condition
- [ ] Add obstacles/hazards
- [ ] Test complete gameplay loop (start to goal)

## Acceptance Criteria
- [ ] Level is fully playable from start to finish
- [ ] Camera follows player smoothly
- [ ] Collisions work correctly (ground, platforms, walls)
- [ ] Can reach end goal
- [ ] Level demonstrates core mechanics

## Resources
- [Unity Tilemap Tutorial](https://learn.unity.com/tutorial/introduction-to-tilemaps)
- [Cinemachine (Camera Follow)](https://docs.unity3d.com/Packages/com.unity.cinemachine@latest)

## Estimated Effort
3-4 hours

## Dependencies
Depends on #4 (Basic Player Controller)
```

---

## Issue #10: Basic ML-Agent Implementation

**Title**: Create ML-Agent that can navigate simple level

**Labels**: `unity-poc`, `phase-2`, `ml-agents`, `ai`, `enhancement`

**Body**:
```markdown
## Overview
Implement a basic ML-Agent that can learn to navigate the test level and reach the goal. This demonstrates autonomous AI testing capability.

## Context
This is a key differentiator for Unity - ML-Agents can learn to play the game autonomously and potentially discover issues that manual tests would miss.

## Tasks
- [ ] Create SmallBotAgent C# script implementing Agent interface
- [ ] Define observations (player position, goal position, nearby obstacles via raycasts)
- [ ] Define actions (move left/right, jump)
- [ ] Implement reward system (progress toward goal, reaching goal, falling)
- [ ] Create training configuration (ppo-config.yaml)
- [ ] Set up training environment
- [ ] Train agent to reach goal (may take several hours)
- [ ] Validate learned behavior

## Acceptance Criteria
- [ ] Agent observes environment correctly (verified in debug mode)
- [ ] Agent can control player character via actions
- [ ] Agent receives appropriate rewards (positive for progress, negative for falling)
- [ ] After training, agent can consistently reach goal (>80% success rate)
- [ ] Agent behavior looks reasonable (not exploiting bugs)

## Training Notes
- Initial training may take 2-6 hours depending on hardware
- Use TensorBoard to monitor training progress
- May need multiple training runs to tune hyperparameters

## Resources
- [ML-Agents Getting Started](https://unity-technologies.github.io/ml-agents/Getting-Started/)
- [Reward Function Best Practices](https://unity-technologies.github.io/ml-agents/Learning-Environment-Design-Agents/)
- [PPO Algorithm](https://unity-technologies.github.io/ml-agents/Training-Configuration-File/)

## Estimated Effort
6-8 hours (including training time)

## Dependencies
- Depends on #9 (ML-Agents Package Installation)
- Depends on #5 (Basic Level Setup)
```

---

## Quick Start Instructions

1. **Create labels** first (see list at top)
2. **Create issues** in order (1-5 first, then 10 as example)
3. **Start with Issue #1** to begin implementation
4. **Follow the roadmap** in [UNITY_ROADMAP.md](../docs/UNITY_ROADMAP.md) for all 28 issues

## Full Issue List

All 28 issues are detailed in [UNITY_ROADMAP.md](../docs/UNITY_ROADMAP.md):
- **Phase 1** (Foundation): Issues #1-6
- **Phase 2** (Testing): Issues #7-12
- **Phase 3** (Assets): Issues #13-16
- **Phase 4** (Agentic Dev): Issues #17-22
- **Phase 5** (Polish): Issues #23-28

## Automation

Consider using GitHub CLI to batch-create issues:

```bash
gh issue create --title "..." --body "..." --label "unity-poc,phase-1"
```

Or use the GitHub API to script issue creation from the roadmap document.
```

