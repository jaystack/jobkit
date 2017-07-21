import execa = require('execa')
import { JobInfo } from '../../types'

export interface Options {
  cwd?: string
  env?: object
  quiet?: boolean
}

export async function shell(command: string, { cwd, env, quiet }: Options = {}) {
  try {
    const result = await execa.shell(command, { cwd, env })
    if (!quiet) console.log(result.stdout)
    return result.stdout
  } catch (error) {
    if (!quiet) console.log(error.message)
    return error.message
  }
}

export default (jobInfo: JobInfo) => (
  command: string,
  { cwd = jobInfo.cwd, env = jobInfo.env || {}, quiet = false }: Options = {}
) => shell(command, { cwd, env, quiet })
