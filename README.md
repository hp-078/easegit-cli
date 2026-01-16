# EaseGit

**Automatic checkpoints before Git can hurt you.**

## What is EaseGit?

EaseGit creates automatic safety checkpoints before dangerous Git operations and lets you undo them with one command.

- Automatic protection during rebase, merge, push, checkout
- Restore everything in one command
- Zero configuration
- Invisible until needed

## Installation

```bash
npm install -g easegit-cli   # installs command names: easegit (preferred) and easegit-cli
cd my-repo
easegit init                 # or: easegit-cli init
```

No global install? Use `npx easegit init` (or `npx easegit-cli init`). On Windows ensure your global npm bin (e.g., `%AppData%\npm`) is on `PATH`.

## Usage

### Setup (one time)

```bash
easegit init
```

This installs Git hooks that automatically create checkpoints before dangerous operations.

### Normal work (unchanged)

```bash
git commit
git merge
git rebase
git push --force
```

EaseGit runs silently in the background. You won't notice it.

### When something breaks

```bash
easegit undo
```

This restores your working directory, staged files, and untracked files to the last safe checkpoint.

### Check status

```bash
easegit status
```

Shows when the last checkpoint was created and what operation triggered it.

## How it works

EaseGit installs Git hooks that automatically create checkpoints before:

- `git rebase`
- `git merge`
- `git push`
- `git checkout`
- `git pull`
- `git reset`

Each checkpoint captures:

- All working files
- Staged changes
- Untracked files

Checkpoints are stored as Git objects under hidden refs. Your commit history is never modified.

## Recovery

If a Git operation damages your working state, run:

```bash
easegit undo
```

This restores everything exactly as it was before the operation.

## Commands

- `easegit init` - Set up EaseGit in this repository
- `easegit status` - Show last checkpoint information
- `easegit undo` - Restore last checkpoint

## What EaseGit is NOT

- Not a Git replacement
- Not a backup tool
- Not a tutorial
- No configuration needed
- No GUI

## Philosophy

Git is powerful but dangerous. EaseGit makes it safe by creating automatic undo points before operations that can lose work.

You never have to remember to create a checkpoint. EaseGit does it automatically.

## License

MIT
