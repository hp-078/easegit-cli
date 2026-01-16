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
  } catch (error) {
    // Silently fail - checkpoints are best-effort
    // We never want to block the user's Git operation
  }
}

// CommonJS export for hook scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCheckpoint };
}
