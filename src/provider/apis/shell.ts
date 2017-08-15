import execa = require('execa');
import { JobInfo } from '../../types';

export interface Options {
  cwd?: string;
  env?: object;
  quiet?: boolean;
}

export const shell = async (command: string, { cwd, env = {}, quiet = false }: Options = {}) => {
  const promise = execa.shell(command, { cwd, env });
  if (!quiet) {
    promise.stdout.pipe(process.stdout);
    //promise.stderr.pipe(process.stderr)
  }
  const result = await promise;
  return result.stdout;
};

export default (jobInfo: JobInfo) => (command: string, { cwd, env, quiet }: Options = {}) =>
  shell(command, { cwd: process.cwd(), quiet });
