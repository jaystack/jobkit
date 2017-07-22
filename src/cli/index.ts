import { JobInfo } from '../types'
import Docker = require('dockerode')
import * as path from 'path'

//console.log(process.argv)

const OUTER_JOBKIT_PATH = process.argv[1]
const OUTER_WORK_DIR = process.argv[1]
const INNER_JOBKIT_PATH = '/jobkit'
const INNER_WORK_DIR = '/jobkit/workdir'
const JOB_WORK_DIR = '/home/job'

console.log('OUTER_JOBKIT_PATH', OUTER_JOBKIT_PATH)
console.log('OUTER_WORK_DIR', OUTER_WORK_DIR)

function getAbsoluteScriptPath(workDir: string, scriptPath: string): string {
  return path.join(workDir, scriptPath)
}

interface RunOptions {
  stream?: NodeJS.WritableStream
  params?: object
}

async function run(
  scriptPath: string,
  { stream = process.stdout, params = {} }: RunOptions = {}
) {
  const absoluteProviderPath = getAbsoluteScriptPath(
    INNER_JOBKIT_PATH,
    'lib/provider'
  )
  const absoluteInnerScriptPath = getAbsoluteScriptPath(
    INNER_WORK_DIR,
    scriptPath
  )
  const jobInfo: JobInfo = { cwd: JOB_WORK_DIR, buildNumber: 1, params }
  const docker = new Docker()
  const container = await docker.run(
    'node',
    [
      'node',
      absoluteProviderPath,
      absoluteInnerScriptPath,
      JSON.stringify(jobInfo)
    ],
    stream,
    {
      Volumes: {
        [INNER_JOBKIT_PATH]: {},
        [INNER_WORK_DIR]: {},
        [JOB_WORK_DIR]: {},
        ['/var/run/docker.sock']: {}
      },
      Hostconfig: {
        Binds: [
          `${OUTER_JOBKIT_PATH}:${INNER_JOBKIT_PATH}`,
          `${OUTER_WORK_DIR}:${INNER_WORK_DIR}`,
          `/var/run/docker.sock:/var/run/docker.sock`
        ],
        AutoRemove: true
      },
      WorkingDir: JOB_WORK_DIR
    }
  )
}

run(process.argv[2], { params: { a: 1 } })
