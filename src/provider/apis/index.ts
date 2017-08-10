import { SimpleGit } from 'simple-git/promise';
import fs from './fs';
import shell, { Options } from './shell';
import git from './git';
import sleep from './sleep';
import npm from './npm';
import docker from './docker';
import Docker = require('dockerode');
import { JobInfo } from '../../types';
import * as fsTypes from 'fs-extra';

export default {
  shell,
  git,
  sleep,
  npm,
  docker,
  fs
};
