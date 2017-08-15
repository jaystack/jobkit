import ini = require('ini');
import { JobInfo } from '../../types';
import { shell } from './shell';

const CONFIG_PATTERN = /^\s*([^\s#;]+)\s*=\s*"([^\s]*)"/;
const ARRAY_CONFIG_PATTERN = /(.+)\[\]/;

const checkOptions = (possibleOptions: string[], options: object) => {
  if (Object.keys(options).some(optionKey => !possibleOptions.includes(optionKey)))
    throw new Error('Invalid npm command option');
};

const createOptionsString = (options: object) => {
  return Object.keys(options)
    .filter(key => options[key])
    .map(key => (typeof options[key] === 'boolean' ? `--${key}` : `--${key}=${options[key]}`))
    .join(' ');
};

const resolveArgs = args => {
  const options = args.find(arg => typeof arg === 'object') || {};
  const argumentList = args.filter(arg => typeof arg === 'string') || '';
  return { argumentList, options };
};

const createCommand = (
  command: string,
  {
    cwd,
    possibleOptions,
    stream = process.stdout,
    postProcess = _ => _,
    postFixedOptions = {}
  }: {
    cwd: string;
    possibleOptions?: string[];
    stream?: NodeJS.WritableStream;
    postProcess?: (value: string) => any;
    postFixedOptions?: object;
  }
) => {
  return (...args) => {
    const { argumentList, options } = resolveArgs(args);
    if (possibleOptions) checkOptions(possibleOptions, options);
    const argumentString = argumentList.join(' ');
    const optionsString = createOptionsString({ ...options, ...postFixedOptions });
    return shell(`npm ${command} ${optionsString} ${argumentString}`, { cwd, stream }).then(postProcess);
  };
};

const parseConfigValue = exp => {
  try {
    return exp ? eval(exp) : '';
  } catch (error) {
    return exp;
  }
};

const parseList = list => list.split('\n').filter(_ => _);

const npm = cwd => {
  return {
    access: {
      public: createCommand('access public', { cwd }),
      restricted: createCommand('access restricted', { cwd }),
      grant: createCommand('access grant', { cwd }),
      revoke: createCommand('access revoke', { cwd }),
      listPackages: createCommand('access ls-packages', { cwd, stream: null, postProcess: JSON.parse }),
      listCollaborators: createCommand('access ls-collaborators', { cwd, stream: null, postProcess: JSON.parse })
    },
    login: createCommand('adduser', { cwd }),
    bin: createCommand('bin', { cwd, stream: null }),
    build: createCommand('build', { cwd }),
    cache: {
      add: createCommand('cache add', { cwd }),
      clean: createCommand('cache clean', { cwd }),
      verify: createCommand('cache verify', { cwd })
    },
    config: {
      get: createCommand('config get', { cwd, stream: null, postProcess: parseConfigValue }),
      set: createCommand('config set', { cwd, stream: null }),
      delete: createCommand('config delete', { cwd, stream: null }),
      list: createCommand('config list', { cwd, stream: null, postProcess: ini.parse })
    },
    dedupe: createCommand('dedupe', { cwd }),
    deprecate: createCommand('deprecate', { cwd }),
    distTag: {
      add: createCommand('dist-tag add', { cwd }),
      remove: createCommand('dist-tag rm', { cwd }),
      list: createCommand('dist-tag ls', { cwd, stream: null, postProcess: parseList })
    },
    //init:
    install: createCommand('install', { cwd }),
    link: createCommand('link', { cwd }),
    logout: createCommand('logout', { cwd }),
    list: createCommand('list', { cwd }),
    outdated: createCommand('outdated', { cwd }),
    owner: {
      add: createCommand('owner add', { cwd }),
      remove: createCommand('owner rm', { cwd }),
      list: createCommand('owner ls', { cwd, stream: null, postProcess: parseList })
    },
    pack: createCommand('pack', { cwd }),
    ping: createCommand('ping', { cwd }),
    prefix: createCommand('prefix', { cwd }),
    prune: createCommand('prune', { cwd }),
    publish: createCommand('publish', { cwd }),
    rebuild: createCommand('rebuild', { cwd }),
    restart: createCommand('restart', { cwd }),
    root: createCommand('root', { cwd }),
    run: createCommand('run', { cwd }),
    search: createCommand('search', { cwd, postFixedOptions: { json: true }, stream: null, postProcess: JSON.parse }),
    shrinkwrap: createCommand('shrinkwrap', { cwd }),
    star: createCommand('star', { cwd }),
    unstart: createCommand('unstar', { cwd }),
    stars: createCommand('stars', { cwd }),
    start: createCommand('start', { cwd }),
    stop: createCommand('stop', { cwd }),
    team: {
      create: createCommand('team create', { cwd }),
      destroy: createCommand('team destroy', { cwd }),
      add: createCommand('team add', { cwd }),
      remove: createCommand('team rm', { cwd }),
      list: createCommand('team ls', { cwd, stream: null, postProcess: JSON.parse })
    },
    test: createCommand('test', { cwd }),
    uninstall: createCommand('uninstall', { cwd }),
    unpublish: createCommand('unpublish', { cwd }),
    update: createCommand('update', { cwd }),
    version: createCommand('version', { cwd, stream: null }),
    view: createCommand('view', { cwd, stream: null }),
    show: createCommand('show', { cwd, stream: null }),
    info: createCommand('info', { cwd, stream: null }),
    whoAmI: createCommand('whoami', { cwd, stream: null })
  };
};

export default (jobInfo: JobInfo) => {
  const commands = npm(process.cwd());
  Object.keys(commands).forEach(name => (npm[name] = commands[name]));
  return npm;
};
