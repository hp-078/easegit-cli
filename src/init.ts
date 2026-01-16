import * as fs from 'fs';
import * as path from 'path';
import { isGitRepo, getGitDir } from './git/plumbing';

export async function init(): Promise<void> {
  if (!isGitRepo()) {
    throw new Error('Not a Git repository. Run this command inside a Git repository.');
  }
  
  const gitDir = getGitDir();
  const hooksDir = path.join(gitDir, 'hooks');
  
  // Ensure hooks directory exists
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }
  
  // Hook definitions
  const hooks = [
    'pre-rebase',
    'pre-merge-commit',
    'pre-push',
    'post-checkout'
  ];
  
  // Get the hooks template directory (from installed package)
  // This will be in node_modules/easegit/hooks or local hooks/ during development
  const packageHooksDir = path.join(__dirname, '..', 'hooks');
  
  // Install hooks
  for (const hookName of hooks) {
    const hookPath = path.join(hooksDir, hookName);
    const templatePath = path.join(packageHooksDir, hookName);
    
    if (fs.existsSync(templatePath)) {
      // Copy the hook template
      const hookContent = fs.readFileSync(templatePath, 'utf8');
      fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });
    }
  }
  
  console.log('EaseGit initialized successfully');
  console.log('Automatic checkpoints will be created before dangerous operations');
}
