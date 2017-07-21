import { JobInfo } from '../../types'
import { shell } from './shell'

export function npm(cwd) {
  return {
    install: () => shell('npm install', { cwd }),
    test: () => shell('npm test', { cwd }),
    run: (script: string) => shell(`npm run ${script}`, { cwd })
  }
}

export default function({ cwd }: JobInfo) {
  const commands = npm(cwd)
  Object.keys(commands).forEach(name => (npm[name] = commands[name]))
  return npm
}
