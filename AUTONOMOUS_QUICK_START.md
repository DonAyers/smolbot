# Quick Start: Autonomous Game Improvement

## 🚀 5-Minute Setup

### 1. Create an Improvement Task

```bash
npm run improve create "Building Improvements" "Add more architectural variety" buildings
```

Output:
```
✅ Created improvement task: Building Improvements
   ID: task_1234567890
```

### 2. Run the Autonomous Agent

```bash
npm run improve:auto task_1234567890 3
```

This creates agent prompts for:
- Finding reference images
- Making 3 improvement iterations

### 3. Execute the Sub-Agents

The system outputs commands like:

```bash
copilot --allow-all-tools -p "$(cat improvement-tasks/task_1234567890/prompt-find-references.txt)"
```

Run each one to execute that phase.

### 4. Review Results

```bash
# See task status
npm run improve list

# View screenshots
start improvement-tasks\task_1234567890\iterations\

# Read what changed
type improvement-tasks\task_1234567890\iteration-1-notes.md
```

## 🎯 Common Workflows

### Improve Buildings

```bash
# Create task
npm run improve create "Better Buildings" "More variety and detail" buildings

# Auto-run (creates prompts)
npm run improve:auto task_<id> 3

# Execute each agent manually (copy commands from output)
```

### Find Assets

```bash
# Need new assets?
npm run assets:find task_<id> "neon signs" "Glowing signs" "Cyberpunk"

# Executes search agent
copilot -p "$(cat improvement-tasks/task_<id>/asset-discovery-prompt.txt)"

# Download to: to-be-processed-assets/
# Asset watcher auto-organizes
```

### Complete Task

```bash
npm run improve complete task_<id> "Buildings look amazing!"
```

## 📖 Full Documentation

See [AUTONOMOUS_AGENTS.md](./AUTONOMOUS_AGENTS.md) for complete details on:
- Architecture
- Agent types
- Advanced usage
- Troubleshooting
- Best practices

## 🎮 Try It Now!

```bash
# Start with buildings
npm run improve create "Building Test" "Test the autonomous system" buildings
npm run improve:auto task_<id> 2

# Follow the output instructions to run agents
# Review the results!
```

**That's it! The agents handle the heavy lifting.** 🤖✨
