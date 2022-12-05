import { spawn } from 'child_process';

import { green } from 'chalk';

import { resolve as resolvePath } from './cwd';

export const run = async (command: string) =>
  new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    console.log(`run: ${green(`${cmd} ${args.join(' ')}`)}`);
    const app = spawn(cmd, args, {
      cwd: resolvePath(),
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    const onProcessExit = () => app.kill('SIGHUP');

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit);

      if (code === 0) resolve();
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        );
    });
    process.on('exit', onProcessExit);
  });
