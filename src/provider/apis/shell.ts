import { Readable } from 'stream';
import execa = require('execa');
import { JobInfo } from '../../types';

export interface Options {
  cwd?: string;
  env?: object;
  stream?: NodeJS.WritableStream;
}

export const shell = async (
  command: string,
  { cwd = process.cwd(), env = {}, stream = process.stdout }: Options = {}
) => {
  const promise = execa.shell(command, { cwd, env });
  if (stream) {
    promise.stdout.pipe(stream);
  }
  const result = await promise;
  return result.stdout;
};

export default (jobInfo: JobInfo) => (command: string, { cwd, env, stream }: Options = {}) =>
  shell(command, { cwd, stream });
