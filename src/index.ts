import { init } from './init';
import { status } from './status';
import { undo } from './undo';

const command = process.argv[2];

async function main() {
  try {
    switch (command) {
      case 'init':
        await init();
        break;
      case 'status':
        await status();
        break;
      case 'undo':
        await undo();
        break;
      default:
        console.log('EaseGit - Automatic Git safety checkpoints\n');
        console.log('Commands:');
        console.log('  easegit init     Set up EaseGit in this repository');
        console.log('  easegit status   Show last checkpoint information');
        console.log('  easegit undo     Restore last checkpoint');
        process.exit(command ? 1 : 0);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main();
