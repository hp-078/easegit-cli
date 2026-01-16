# EaseGit Quick Start

## Installation & Setup (30 seconds)

```bash
# 1. Build the project
cd easegit-CLI
npm install
npm run build

# 2. Link globally (optional - makes 'easegit' available everywhere)
npm link

# 3. Initialize in your Git repository
cd /path/to/your/repo
easegit init
```

Done! EaseGit is now protecting you.

## Daily Usage

Just work normally:
```bash
git commit -m "Add feature"
git merge feature-branch
git rebase main
git push --force
```

EaseGit runs silently in the background.

## When Disaster Strikes

```bash
# Something went wrong?
easegit undo

# That's it. Everything is restored.
```

## Check Status

```bash
easegit status
```

Output:
```
Last checkpoint:
  Time: 1/16/2026, 3:45:12 PM
  Operation: rebase
  Undo available: yes
```

## Real Example

```bash
# You're working on a feature
echo "important code" > feature.js
echo "todo notes" > notes.txt

# You accidentally checkout and lose your work
git checkout main
# ⚠ EaseGit: last Git operation damaged your working state.
# Run `easegit undo` to restore the last safe checkpoint.

# Panic! But then you remember...
easegit undo
# Restored checkpoint from 1/16/2026, 3:45:12 PM
# Operation: checkout

# Your files are back!
cat feature.js  # "important code"
cat notes.txt   # "todo notes"
```

## What Gets Protected

EaseGit creates checkpoints before:
- ✅ `git rebase`
- ✅ `git merge`
- ✅ `git checkout`
- ✅ `git push`
- ✅ `git pull`
- ✅ `git reset`

## What Gets Saved

Each checkpoint captures:
- ✅ All tracked files
- ✅ Staged changes
- ✅ **Untracked files** (even those!)

Nothing is lost.

## Important Notes

1. **No configuration needed** - Just run `easegit init` once
2. **No performance impact** - Checkpoints are fast
3. **No cloud/network** - Everything stays local
4. **No commit history changes** - HEAD never moves
5. **No user intervention** - Everything is automatic

## Troubleshooting

### "Not a Git repository"
→ Run `easegit init` inside a Git repository

### "No checkpoint found"
→ Make a Git operation first (commit, checkout, etc.)
→ Checkpoints are created automatically before dangerous operations

### Hooks not running
→ Make sure you ran `easegit init`
→ Check `.git/hooks/` contains: pre-rebase, pre-merge-commit, pre-push, post-checkout

## Under the Hood

Checkpoints are stored as Git commits under hidden refs:
```bash
git for-each-ref refs/easegit/checkpoints/
```

You can inspect them like any Git commit:
```bash
git log refs/easegit/checkpoints/<timestamp>
```

But you don't need to. That's what `easegit undo` is for.

## Three Commands. That's It.

```
easegit init     # Setup (once per repo)
easegit status   # Check last checkpoint
easegit undo     # Restore everything
```

No flags. No options. No complexity.

---

**You're protected. Now go break things fearlessly.** 🚀
