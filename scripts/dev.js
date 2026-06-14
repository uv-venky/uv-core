import { spawn } from 'child_process';
import path from 'path';

function run(command, args) {
  const child = spawn(command, args, { stdio: 'inherit', shell: true });
  child.on('close', (code) => {
    if (code && code !== 0) {
      console.error(`Process ${command} exited with code ${code}`);
    }
  });
  return child;
}

console.log('Starting uv-core compilation & asset sync in watch mode...');

// 1. Watch TypeScript files
run('npx', ['tsc', '-p', 'tsconfig.json', '--watch', '--preserveWatchOutput']);

// 2. Watch TypeScript alias paths
run('npx', ['tsc-alias', '-p', 'tsconfig.json', '--watch']);

// 3. Watch CSS files
run('node', [path.resolve('scripts/copy-css.js'), '--watch']);
