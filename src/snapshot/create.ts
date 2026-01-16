import { createTreeFromWorkingDir, createCheckpointRef } from '../git/plumbing';

/**
 * Create a checkpoint of the current working state
 */
export function createCheckpoint(operation: string): void {
  try {
    // Create tree from current working directory (includes untracked files)
    const treeSha = createTreeFromWorkingDir();
    
    // Store as checkpoint ref
    createCheckpointRef(treeSha, operation);
  } catch (error: any) {
    // Log errors to help debug, but don't block the operation
    // Checkpoints are best-effort and should never fail a git operation
    if (process.env.EASEGIT_DEBUG) {
      console.error('[EaseGit Debug] Checkpoint creation failed:', error.message);
    }
  }
}

// CommonJS export for hook scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCheckpoint };
}
