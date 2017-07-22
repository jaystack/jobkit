import { JobInfo } from '../../types'
import Docker = require('dockerode')

export default function(jobInfo: JobInfo) {
  return new Docker()
}
