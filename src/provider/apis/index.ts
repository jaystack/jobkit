import { SimpleGit } from 'simple-git/promise'
import shell, { Options } from './shell'
import git from './git'
import sleep from './sleep'
import npm from './npm'
import docker from './docker'
import Docker = require('dockerode')
import { JobInfo } from '../../types'

export default {
  shell,
  git,
  sleep,
  npm,
  docker
}
