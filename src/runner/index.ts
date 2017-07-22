import { JobInfo } from '../types'
import Docker = require('dockerode')
import * as path from 'path'

const OUTER_JOBKIT_PATH = path.join(__dirname, '../..')
const INNER_JOBKIT_PATH = '/jobkit'
const CWD = process.cwd()
const INNER_SOURCE_DIR = '/jobkit/temp'
const INNER_WORK_DIR = '/home/job'
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
  const absoluteInnerScriptPath = path.join(INNER_SOURCE_DIR, scriptPath)
  const jobInfo: JobInfo = { buildNumber: 1, params }
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
      WorkingDir: INNER_WORK_DIR,
      Env: env,
      Volumes: {
        [INNER_JOBKIT_PATH]: {},
        [INNER_SOURCE_DIR]: {},
        [INNER_WORK_DIR]: {},
        [DOCKER_SOCKET_PATH]: {}
      },
      Hostconfig: {
        Binds: [
          `${OUTER_JOBKIT_PATH}:${INNER_JOBKIT_PATH}`,
          `${CWD}:${INNER_SOURCE_DIR}`,
          `${DOCKER_SOCKET_PATH}:${DOCKER_SOCKET_PATH}`
        ],
        AutoRemove: true
      }
    }
  )
}

process.on('unhandledRejection', error => console.error(error))
