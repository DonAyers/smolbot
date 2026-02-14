# Unity Agentic Development POC

## Overview

This document outlines a proof-of-concept (POC) for transitioning the SmallBot project to Unity Game Engine with a focus on enabling agentic (autonomous AI-driven) development workflows.

## Why Unity?

### Advantages Over Phaser

1. **Advanced 2D Tools**
   - Built-in 2D tilemap system with rule tiles
   - Sprite animation with sophisticated state machines
   - Physics2D with joints, effectors, and colliders
   - Lighting2D system for atmospheric effects

2. **Agentic AI Capabilities**
   - Unity ML-Agents: Train AI agents to play-test automatically
   - Unity Sentis: Run neural networks at runtime
   - Unity AI Suite: Built-in AI assistants for code and asset generation
   - Automated testing with Unity Test Framework

3. **Headless Automation**
   - `-batchmode -nographics` for CI/CD pipelines
   - Scriptable builds via Editor scripts
   - Automated testing without GUI
   - Build automation for multiple platforms

4. **Professional Pipeline**
   - Asset pipeline for automatic import/processing
   - Editor extensibility via C# scripts
   - Version control integration (Plastic SCM, Git LFS)
   - Industry-standard workflow

### Challenges vs Phaser

1. **Complexity**: Steeper learning curve, C# vs JavaScript
2. **File Size**: Larger builds (~50-200MB vs <5MB)
3. **Web Deployment**: WebGL builds are larger and slower
4. **Testing**: More complex than Playwright for web
5. **Iteration**: Slower compile times vs instant HMR

## Agentic Development Pipeline

### Current Phaser Pipeline (for comparison)

```
Asset Drop → Organize → Game Update → Playwright Test → AI Analysis → Improvement
```

### Proposed Unity Pipeline

```
Asset Drop → Unity Import → Auto-Process → Build → ML-Agent Test → Analysis → Code Gen → Rebuild
```

## Architecture

### Project Structure

```
UnityProject/
├── Assets/
│   ├── Scripts/              # C# game scripts
│   │   ├── Core/             # Core game systems
│   │   ├── Agents/           # ML-Agent implementations
│   │   └── Editor/           # Editor automation scripts
│   ├── Scenes/               # Game scenes
│   ├── Prefabs/              # Reusable game objects
│   ├── Sprites/              # 2D pixel art assets
│   ├── Animations/           # Animation controllers
│   ├── Tilemaps/             # Tilemap assets and rule tiles
│   └── Tests/                # Unity Test Framework tests
├── Packages/                 # Unity packages
│   └── com.unity.ml-agents/  # ML-Agents package
├── ProjectSettings/          # Unity project settings
└── Builds/                   # Build output directory
```

### Automation Scripts (Outside Unity)

```
scripts/
├── unity/
│   ├── build.js              # Trigger Unity builds
│   ├── test-runner.js        # Run Unity tests
│   ├── import-assets.js      # Organize and import assets
│   └── ml-agent-runner.js    # Run ML-Agent training/testing
└── agents/
    ├── unity-improvement.js  # AI-driven code improvements
    └── unity-tester.js       # Automated game testing
```

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goals:**
- Set up Unity project with 2D configuration
- Configure version control (Git LFS for large files)
- Create basic 2D scene with player movement
- Set up build automation

**Deliverables:**
- Unity project initialized
- `.gitignore` and `.gitattributes` configured
- Basic 2D platformer prototype
- Build script that produces executable

**Tasks:**
1. Install Unity Hub and Unity Editor (LTS version)
2. Create new 2D project with appropriate settings
3. Import Kenney pixel art assets
4. Create simple player controller in C#
5. Set up camera follow system
6. Create build automation script

### Phase 2: Automated Testing (Week 3-4)

**Goals:**
- Set up Unity Test Framework
- Implement headless build and test execution
- Create basic ML-Agent for automated playtesting
- Integrate with CI/CD

**Deliverables:**
- Unity Test Framework configured
- Automated test suite
- ML-Agent that can navigate basic level
- GitHub Actions workflow for builds

**Tasks:**
1. Set up EditMode and PlayMode tests
2. Create editor script for headless testing
3. Implement ML-Agent with basic observations
4. Train agent to reach goal points
5. Create test scenario framework
6. Set up GitHub Actions for Unity builds

### Phase 3: Asset Pipeline (Week 5-6)

**Goals:**
- Automate asset import and organization
- Create custom asset processors
- Implement sprite slicing automation
- Set up animation generation

**Deliverables:**
- Asset import automation
- Custom AssetPostprocessor scripts
- Automated sprite atlas generation
- Animation controller templates

**Tasks:**
1. Create AssetPostprocessor for auto-configuration
2. Implement sprite sheet auto-slicing
3. Create animation controller generator
4. Build asset organization system
5. Integrate with existing asset management scripts

### Phase 4: Agentic Development (Week 7-8)

**Goals:**
- Implement AI-driven code generation for Unity
- Create autonomous improvement pipeline
- Set up feedback loop with ML-Agents
- Develop metrics collection system

**Deliverables:**
- Code generation system for C# Unity scripts
- Automated improvement pipeline
- Performance metrics collection
- Agent-driven playtesting reports

**Tasks:**
1. Create C# code generation templates
2. Implement Unity API wrapper for AI agents
3. Build improvement iteration system
4. Create ML-Agent training automation
5. Develop analytics dashboard
6. Set up continuous improvement loop

### Phase 5: Integration & Refinement (Week 9-10)

**Goals:**
- Polish all systems
- Create comprehensive documentation
- Develop tutorial/examples
- Benchmark against Phaser approach

**Deliverables:**
- Complete documentation
- Video tutorials
- Comparison report
- Production-ready pipeline

**Tasks:**
1. Write comprehensive setup guide
2. Create example improvement tasks
3. Record demonstration videos
4. Compare metrics with Phaser version
5. Document lessons learned

## Technical Specifications

### Unity Configuration

- **Version**: Unity 2022.3 LTS (Long Term Support)
- **Render Pipeline**: Universal Render Pipeline (URP) 2D
- **ML-Agents**: Version 2.0+
- **Test Framework**: Unity Test Framework 1.1+

### Build Targets

- **Primary**: Linux Headless (for ML training)
- **Secondary**: Windows/Mac Standalone
- **Tertiary**: WebGL (for demos)

### ML-Agent Configuration

```yaml
behaviors:
  SmallBotAgent:
    trainer_type: ppo
    max_steps: 500000
    time_horizon: 64
    summary_freq: 10000
    keep_checkpoints: 5
```

### Editor Automation

Key Unity CLI commands:

```bash
# Build project
unity -quit -batchmode -nographics -projectPath . -buildTarget Linux64 -buildPath builds/linux

# Run tests
unity -quit -batchmode -nographics -projectPath . -runTests -testPlatform PlayMode

# Execute custom editor method
unity -quit -batchmode -nographics -projectPath . -executeMethod EditorScript.MethodName
```

## Comparison: Unity vs Phaser

### Feasibility Analysis

| Aspect | Phaser | Unity | Winner |
|--------|--------|-------|--------|
| **Setup Time** | Fast (minutes) | Slow (hours) | Phaser |
| **Web Testing** | Excellent (Playwright) | Good (WebGL + Playwright) | Phaser |
| **ML Integration** | Manual (external tools) | Native (ML-Agents) | Unity |
| **2D Features** | Good | Excellent | Unity |
| **Automation** | Good (JS ecosystem) | Excellent (Editor scripts) | Unity |
| **Build Size** | Small (<5MB) | Large (50-200MB) | Phaser |
| **Iteration Speed** | Fast (HMR) | Moderate (compile time) | Phaser |
| **AI Testing** | Manual agents | ML-Agents | Unity |
| **Production Ready** | Yes | Yes | Tie |
| **Learning Curve** | Low | High | Phaser |

### Recommendation

**For this POC**: Unity is feasible and offers significant advantages for agentic development:

**Pros:**
- Native ML-Agents for autonomous testing
- Sophisticated 2D tooling
- Professional asset pipeline
- Strong automation capabilities
- Industry-standard practices

**Cons:**
- Higher complexity and learning curve
- Slower iteration during development
- Larger file sizes
- More setup overhead

**Verdict**: Worth exploring as an alternative, especially if:
1. You want advanced 2D features (lighting, particles, physics)
2. ML-driven autonomous testing is a priority
3. You're comfortable with C# and Unity workflow
4. Build size and web deployment aren't critical concerns

## Next Steps

1. **Approve POC Plan**: Review and approve this implementation plan
2. **Set Up Environment**: Install Unity and configure development environment
3. **Create Prototype**: Build minimal 2D platformer in Unity
4. **Test Automation**: Implement headless build and basic ML-Agent
5. **Evaluate**: Compare development experience with Phaser
6. **Decide**: Make informed decision about continuing with Unity vs staying with Phaser

## Resources

### Unity Documentation
- [Unity Manual](https://docs.unity3d.com/Manual/index.html)
- [Unity 2D Guide](https://docs.unity3d.com/Manual/Unity2D.html)
- [ML-Agents Documentation](https://unity-technologies.github.io/ml-agents/)
- [Unity Test Framework](https://docs.unity3d.com/Packages/com.unity.test-framework@latest)

### External Resources
- [Unity CI/CD Best Practices](https://unity.com/solutions/ci-cd)
- [Agentic AI in Games](https://www.databricks.com/blog/leveraging-agentic-ai-games)
- [Unity AI Suite](https://unity.com/features/ai)

### Community
- [Unity Forums](https://forum.unity.com/)
- [ML-Agents GitHub](https://github.com/Unity-Technologies/ml-agents)
- [Unity Learn](https://learn.unity.com/)

## Questions for Discussion

1. **Scope**: Should we replace Phaser entirely or run parallel experiments?
2. **Timeline**: Is 10 weeks realistic for this POC?
3. **Resources**: Do we have access to Unity licenses and hardware for ML training?
4. **Skills**: What's the team's C# and Unity experience level?
5. **Goals**: What specific metrics define success for this POC?
6. **Web Priority**: How important is web deployment vs standalone builds?

## Success Metrics

The POC will be considered successful if it achieves:

1. **Automation**: Can build, test, and iterate without manual intervention
2. **ML Testing**: ML-Agent can successfully playtest and provide feedback
3. **Asset Pipeline**: Assets auto-import and organize correctly
4. **Code Generation**: Can generate working C# Unity scripts
5. **Improvement Loop**: Can run autonomous improvement iterations
6. **Documentation**: Clear setup and usage documentation
7. **Performance**: Iteration time comparable to Phaser approach

## Conclusion

This Unity POC is **feasible and worth pursuing** as an experimental branch. The advanced 2D features, native ML-Agents integration, and professional automation capabilities make it a strong candidate for agentic game development.

However, it comes with increased complexity and a steeper learning curve. The recommendation is to:

1. Build the POC as outlined
2. Run it parallel to the Phaser version
3. Compare developer experience and capabilities
4. Make an informed decision based on actual results

The agentic development pipeline is achievable in both frameworks, but Unity may offer more sophisticated automation and testing capabilities at the cost of increased complexity.
