import { JobInfo } from '../../types'
import shellFactory from './shell'

export function npm(shell) {
  return {
    install: () => shell('npm install'),
    test: () => shell('npm test'),
    run: (script: string) => shell(`npm run ${script}`)
  }
}

export default function(jobInfo: JobInfo) {
  const shell = shellFactory(jobInfo)
  const commands = npm.bind(null, shell)()
  Object.keys(commands).forEach(name => (npm[name] = commands[name]))
  return npm
}
