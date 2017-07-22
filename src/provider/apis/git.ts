import git = require('simple-git/promise')
import { JobInfo } from '../../types'

export default (jobInfo: JobInfo) => {
  const commands = git(process.cwd())
  Object.keys(commands).forEach(name => (git[name] = commands[name]))
  return git
}
