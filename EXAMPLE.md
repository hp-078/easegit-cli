# EaseGit Usage Example

## Installation
```bash
npm install -g easegit
cd your-git-repo
easegit init
```

## Example Scenario

### Before EaseGit
```bash
# You have uncommitted work
echo "important work" > myfile.txt

# Accidentally check out old branch
git checkout main

# Your work is gone! 😱
```

### With EaseGit
```bash
# You have uncommitted work
echo "important work" > myfile.txt

# Accidentally check out old branch
git checkout main
# ⚠ EaseGit: last Git operation damaged your working state.
# Run `easegit undo` to restore the last safe checkpoint.

# Restore everything instantly
easegit undo

# Your work is back! ✅
```

## Protected Operations

EaseGit automatically creates checkpoints before:
- `git rebase`
- `git merge`
- `git checkout`
- `git push`
- `git pull`
- `git reset`

## Commands

### `easegit init`
Set up EaseGit in your repository (one-time setup)

### `easegit status`
Check when the last checkpoint was created
```
Last checkpoint:
  Time: 1/16/2026, 3:45:12 PM
  Operation: rebase
  Undo available: yes
```

### `easegit undo`
Restore your working directory to the last checkpoint
```
Restored checkpoint from 1/16/2026, 3:45:12 PM
Operation: rebase
```

## How It Works

1. EaseGit installs Git hooks during `easegit init`
2. These hooks run automatically before dangerous operations
3. Each checkpoint captures:
   - All tracked files
   - Staged changes
   - **Untracked files** (yes, even those!)
4. Everything is stored using Git's native object database
5. No external databases or cloud storage needed

## Philosophy

**"If you can't undo it, you shouldn't do it."**

EaseGit makes Git safe by giving you a universal undo button. You never have to think about creating checkpoints—they happen automatically before anything dangerous.
