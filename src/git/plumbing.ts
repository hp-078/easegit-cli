import { execSync } from 'child_process';
import * as path from 'path';

/**
 * Execute a Git command and return output
 */
export function gitExec(args: string[], cwd?: string): string {
  try {
    return execSync(`git ${args.join(' ')}`, {
      cwd: cwd || process.cwd(),
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
  } catch (error: any) {
    throw new Error(`Git command failed: ${error.message}`);
  }
}

/**
 * Check if current directory is a Git repository
 */
export function isGitRepo(): boolean {
  try {
    gitExec(['rev-parse', '--git-dir']);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the Git directory path
 */
export function getGitDir(): string {
  return gitExec(['rev-parse', '--git-dir']);
}

/**
 * Get the root directory of the Git repository
 */
export function getRepoRoot(): string {
  return gitExec(['rev-parse', '--show-toplevel']);
}

/**
 * Create a tree object from the current working directory and index
 * Returns the tree SHA
 */
export function createTreeFromWorkingDir(): string {
  const fs = require('fs');
  
  // Add all files including untracked to index temporarily
  const originalIndex = path.join(getGitDir(), 'index');
  const tempIndex = path.join(getGitDir(), 'index.easegit.tmp');
  
  try {
    // Copy current index
    fs.copyFileSync(originalIndex, tempIndex);
    
    // Set temporary index
    process.env.GIT_INDEX_FILE = tempIndex;
    
    // Add all files including untracked
    gitExec(['add', '-A']);
    
    // Write tree
    const treeSha = gitExec(['write-tree']);
    
    return treeSha;
  } finally {
    // Restore original index
    delete process.env.GIT_INDEX_FILE;
    
    // Clean up temp index
    try {
      fs.unlinkSync(tempIndex);
    } catch {}
  }
}

/**
 * Create a ref under refs/easegit/checkpoints/
 */
export function createCheckpointRef(treeSha: string, operation: string): string {
  const timestamp = Date.now();
  const refName = `refs/easegit/checkpoints/${timestamp}`;
  
  // Create a commit object for the checkpoint
  // Use multiple -m flags for multi-line messages (Windows compatible)
  const commitArgs = ['commit-tree', treeSha, '-m', `EaseGit checkpoint before ${operation}`, '-m', `Timestamp: ${timestamp}`];
  try {
    const head = gitExec(['rev-parse', 'HEAD']);
    commitArgs.splice(2, 0, '-p', head);
  } catch {
    // No HEAD yet (empty repo)
  }
  
  const commitSha = gitExec(commitArgs).trim();
  
  // Update ref
  gitExec(['update-ref', refName, commitSha]);
  
  return refName;
}

/**
 * Get the most recent checkpoint ref
 */
export function getLatestCheckpointRef(): string | null {
  try {
    // Use -version:refname to sort refs numerically by the timestamp in the refname
    const refs = gitExec(['for-each-ref', 'refs/easegit/checkpoints/', '--sort=-version:refname', '--format=%(refname)', '--count=1']);
    return refs || null;
  } catch {
    return null;
  }
}

/**
 * Get checkpoint info
 */
export function getCheckpointInfo(refName: string): { timestamp: number; operation: string; commitSha: string } | null {
  try {
    const commitSha = gitExec(['rev-parse', refName]);
    const message = gitExec(['log', '-1', '--format=%B', commitSha]);
    
    const timestampMatch = message.match(/Timestamp: (\d+)/);
    const operationMatch = message.match(/checkpoint before (.+)/);
    
    if (!timestampMatch) return null;
    
    return {
      timestamp: parseInt(timestampMatch[1]),
      operation: operationMatch ? operationMatch[1].split('\n')[0] : 'unknown',
      commitSha
    };
  } catch {
    return null;
  }
}

/**
 * Restore working directory from a commit SHA (restores all files including untracked)
 */
export function restoreFromTree(commitSha: string): void {
  // Get the tree from the commit
  const treeSha = gitExec(['rev-parse', `${commitSha}^{tree}`]);
  
  // Clear working directory first (except .git)
  gitExec(['clean', '-fd']);
  
  // Read the tree into index
  gitExec(['read-tree', treeSha]);
  
  // Checkout all files from index into working directory
  gitExec(['checkout-index', '-f', '-a']);
  
  // Reset the index to match the restored tree so git status shows clean
  gitExec(['reset', '--mixed']);
}

/**
 * Check if there are merge conflicts
 */
export function hasMergeConflicts(): boolean {
  try {
    const status = gitExec(['status', '--porcelain']);
    return status.includes('UU ') || status.includes('AA ') || status.includes('DD ');
  } catch {
    return false;
  }
}

/**
 * Check if HEAD is detached
 */
export function isDetachedHead(): boolean {
  try {
    gitExec(['symbolic-ref', 'HEAD']);
    return false;
  } catch {
    return true;
  }
}

/**
 * Check if working directory is dirty
 */
export function isDirty(): boolean {
  try {
    const status = gitExec(['status', '--porcelain']);
    return status.length > 0;
  } catch {
    return false;
  }
}

// CommonJS exports for hook scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gitExec,
    isGitRepo,
    getGitDir,
    getRepoRoot,
    createTreeFromWorkingDir,
    createCheckpointRef,
    getLatestCheckpointRef,
    getCheckpointInfo,
    restoreFromTree,
    hasMergeConflicts,
    isDetachedHead,
    isDirty
  };
}
