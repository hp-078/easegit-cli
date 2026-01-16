import { getLatestCheckpointRef, getCheckpointInfo, restoreFromTree } from '../git/plumbing';

/**
 * Restore the most recent checkpoint
 */
export function restoreCheckpoint(): void {
  const refName = getLatestCheckpointRef();
  
  if (!refName) {
    throw new Error('No checkpoint found to restore');
  }
  
  const info = getCheckpointInfo(refName);
  
  if (!info) {
    throw new Error('Checkpoint data is corrupted');
  }
  
  // Restore working directory from the checkpoint
  restoreFromTree(info.commitSha);
  
  console.log(`Restored checkpoint from ${new Date(info.timestamp).toLocaleString()}`);
  console.log(`Operation: ${info.operation}`);
}
