import { isGitRepo } from './git/plumbing';
import { restoreCheckpoint } from './snapshot/restore';

export async function undo(): Promise<void> {
  if (!isGitRepo()) {
    throw new Error('Not a Git repository');
  }
  
  restoreCheckpoint();
}
