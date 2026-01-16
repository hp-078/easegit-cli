# EaseGit Development Guide

## Project Structure

```
easegit-CLI/
├── bin/
│   └── easegit              # CLI entry point
├── src/
│   ├── index.ts             # Main router
│   ├── init.ts              # easegit init command
│   ├── status.ts            # easegit status command
│   ├── undo.ts              # easegit undo command
│   ├── git/
│   │   └── plumbing.ts      # Low-level Git operations
│   └── snapshot/
│       ├── create.ts        # Checkpoint creation logic
│       └── restore.ts       # Checkpoint restoration logic
├── hooks/
│   ├── pre-rebase           # Hook: before rebase
│   ├── pre-merge-commit     # Hook: before merge
│   ├── pre-push             # Hook: before push
│   └── post-checkout        # Hook: after checkout
├── dist/                    # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Building

```bash
npm install
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

## Testing Locally

```bash
# Build the project
npm run build

# Test in a Git repository
cd /path/to/test-repo
node /path/to/easegit-CLI/bin/easegit init
```

Or use the provided test script:
```bash
.\test.ps1
```

## How It Works

### 1. Initialization (`easegit init`)
- Checks if current directory is a Git repo
- Creates hooks directory if needed
- Copies hook scripts from `hooks/` to `.git/hooks/`
- Makes hooks executable

### 2. Checkpoint Creation (Automatic)
- Hooks execute before dangerous Git operations
- `createTreeFromWorkingDir()` captures all files (tracked, staged, untracked)
- Creates a temporary Git index
- Writes a tree object
- Creates a commit object with the tree
- Stores commit under `refs/easegit/checkpoints/<timestamp>`
- Never touches HEAD or user's commit history

### 3. Status Check (`easegit status`)
- Queries `refs/easegit/checkpoints/` for latest checkpoint
- Parses commit message for timestamp and operation
- Displays checkpoint info

### 4. Undo (`easegit undo`)
- Gets latest checkpoint ref
- Reads commit SHA
- Checks out files from that commit
- Cleans untracked files
- Restores index
- HEAD remains unchanged

## Git Plumbing Used

- `git write-tree` - Create tree object from index
- `git commit-tree` - Create commit object from tree
- `git update-ref` - Create hidden refs
- `git for-each-ref` - Query checkpoint refs
- `git checkout <sha> -- .` - Restore files without moving HEAD
- `git clean -fd` - Remove untracked files

## Design Principles

1. **Silent by default** - Only speak when something breaks
2. **Never block operations** - Checkpoint failures are silent
3. **Use Git's storage** - No custom databases
4. **Zero configuration** - Works out of the box
5. **Focused scope** - Only do one thing perfectly

## Package Publishing

```bash
npm publish
```

The `files` field in package.json ensures these are included:
- `dist/` (compiled code)
- `bin/` (CLI entry)
- `hooks/` (hook templates)

## Key Files

### src/git/plumbing.ts
Low-level Git operations. All Git commands go through here.

### src/snapshot/create.ts
Checkpoint creation logic. Called by hooks before dangerous operations.

### src/snapshot/restore.ts
Restoration logic. Called by `easegit undo`.

### hooks/*
Template hook scripts installed during `easegit init`. These use Node.js to call compiled TypeScript functions.

## Testing

Manual test workflow:
1. Create a test repo
2. Run `easegit init`
3. Make changes (tracked, staged, untracked)
4. Run a dangerous operation (e.g., `git checkout`)
5. Verify checkpoint was created: `easegit status`
6. Restore: `easegit undo`
7. Verify all changes are back

## Limitations

- Windows-specific path handling in current implementation
- Requires Node.js 16+
- Hooks require execute permissions (handled automatically)
- Large repos may have slower checkpoint creation

## Future Improvements (Out of Scope for MVP)

- Checkpoint garbage collection
- Multiple undo levels
- Checkpoint naming/tagging
- Diff between checkpoints

Remember: **The MVP is done. Don't add features unless they strengthen the core promise.**
