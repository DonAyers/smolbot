# Unity POC - README

This directory contains automation scripts for the Unity POC.

## Scripts

### build.js
Triggers Unity builds from the command line without opening the Unity Editor.

```bash
node scripts/unity/build.js linux
node scripts/unity/build.js windows --development
```

### test-runner.js  
Runs Unity tests headlessly and reports results.

```bash
node scripts/unity/test-runner.js
node scripts/unity/test-runner.js --mode=editmode
node scripts/unity/test-runner.js --filter=PlayerTests
```

### ml-agent-runner.js
Manages ML-Agents training, testing, and monitoring.

```bash
node scripts/unity/ml-agent-runner.js train --config=ppo-config
node scripts/unity/ml-agent-runner.js test --model=SmallBotAgent
node scripts/unity/ml-agent-runner.js monitor --run-id=run-123
```

## Setup

1. Set UNITY_PATH environment variable:
```bash
export UNITY_PATH=/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app/Contents/MacOS/Unity
```

2. Create Unity project (see docs/UNITY_QUICK_START.md)

3. Install ML-Agents Python package:
```bash
python3 -m venv unity-ml-env
source unity-ml-env/bin/activate
pip install mlagents
```

## Documentation

See [docs/UNITY_POC.md](../../docs/UNITY_POC.md) for complete documentation.
