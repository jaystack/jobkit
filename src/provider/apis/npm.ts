import { JobInfo } from '../../types';
import { shell } from './shell';
import { promisify } from 'util';

const checkOptions = (possibleOptions: string[], options: object) => {
  if (Object.keys(options).some(optionKey => !possibleOptions.includes(optionKey)))
    throw new Error('Invalid npm command option');
};

const createOptionsString = (options: object) => {
  return Object.keys(options).map(key => (typeof options[key] === 'boolean' ? `--${key}` : `--${key}=${options[key]}`));
};

const npm = cwd => {
  return {
    install: () => shell('npm install', { cwd }),
    test: () => shell('npm test', { cwd }),
    run: (script: string) => shell(`npm run ${script}`, { cwd })
  };
};

export default (jobInfo: JobInfo) => {
  const commands = npm(process.cwd());
  Object.keys(commands).forEach(name => (npm[name] = commands[name]));
  return npm;
};
