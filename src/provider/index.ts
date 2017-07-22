import { JobInfo, ApiFactoryRegistry } from '../types'
import apiFactories from './apis'

const SCRIPT_PATH = process.argv[2]
const JOB_INFO = JSON.parse(process.argv[3])

function createApis(factories: ApiFactoryRegistry, jobInfo: JobInfo) {
  const apis = {}
  Object.keys(factories).forEach(
    apiName => (apis[apiName] = factories[apiName](jobInfo))
  )
  return apis
}

async function run(path: string, jobInfo: JobInfo) {
  const apis = createApis(apiFactories, jobInfo)
  const job = require(path)
  console.log('-----------------------------------------------')
  await job({ ...jobInfo, ...apis })
  console.log('-----------------------------------------------')
}

process.on('unhandledRejection', error => console.error(error))

run(SCRIPT_PATH, JOB_INFO)