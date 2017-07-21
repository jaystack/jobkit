import git = require('simple-git/promise')
import { JobInfo } from '../../types'

export default (jobInfo: JobInfo) => {
  const defaultApi = git(jobInfo.cwd)
  defaultApi['cwd'] = (cwd: string) => git(cwd)
  return defaultApi
}
