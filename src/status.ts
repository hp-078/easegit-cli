import { isGitRepo, getLatestCheckpointRef, getCheckpointInfo } from './git/plumbing';

export async function status(): Promise<void> {
  if (!isGitRepo()) {
    throw new Error('Not a Git repository');
  }
  
  const refName = getLatestCheckpointRef();
  
  if (!refName) {
    console.log('No checkpoints available');
    console.log('EaseGit will create checkpoints automatically before dangerous operations');
    return;
  }
  
  const info = getCheckpointInfo(refName);
  
  if (!info) {
    console.log('Checkpoint data corrupted');
    return;
  }
  
  const date = new Date(info.timestamp);
  
  console.log('Last checkpoint:');
  console.log(`  Time: ${date.toLocaleString()}`);
  console.log(`  Operation: ${info.operation}`);
  console.log(`  Undo available: yes`);
}
