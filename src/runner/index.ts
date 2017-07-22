import { JobInfo } from '../types'
import Docker = require('dockerode')
import * as path from 'path'

const CWD = process.argv[1]
const OUTER_JOBKIT_PATH = path.join(__dirname, '../..')
const OUTER_WORK_DIR = OUTER_JOBKIT_PATH // ez lesz majd a pollozott repo
const INNER_JOBKIT_PATH = '/jobkit'
const INNER_WORK_DIR = '/jobkit/workdir'
const JOB_WORK_DIR = '/home/job'
const DOCKER_SOCKET_PATH = '/var/run/docker.sock'

export interface RunOptions {
  stream?: NodeJS.WritableStream
  params?: object
  env?: string[]
}

export default async function run(
  scriptPath: string,
  { stream = process.stdout, params = {}, env = [] }: RunOptions = {}
) {
  const absoluteProviderPath = path.join(INNER_JOBKIT_PATH, 'lib/provider')
  const absoluteInnerScriptPath = path.join(INNER_WORK_DIR, scriptPath)
  const jobInfo: JobInfo = { cwd: JOB_WORK_DIR, buildNumber: 1, params }
  const docker = new Docker()
  await docker.run(
    'node',
    [
      'node',
      absoluteProviderPath,
      absoluteInnerScriptPath,
      JSON.stringify(jobInfo)
    ],
    stream,
    {
      WorkingDir: JOB_WORK_DIR,
      Env: env,
      Volumes: {
        [INNER_JOBKIT_PATH]: {},
        [INNER_WORK_DIR]: {},
        [JOB_WORK_DIR]: {},
        [DOCKER_SOCKET_PATH]: {}
      },
      Hostconfig: {
        Binds: [
          `${OUTER_JOBKIT_PATH}:${INNER_JOBKIT_PATH}`,
          `${OUTER_WORK_DIR}:${INNER_WORK_DIR}`,
          `${DOCKER_SOCKET_PATH}:${DOCKER_SOCKET_PATH}`
        ],
        AutoRemove: true
      }
    }
  )
}

process.on('unhandledRejection', error => console.error(error))
