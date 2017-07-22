import { JobInfo } from '../../types'
import Docker = require('dockerode')

export default function(jobInfo: JobInfo) {
  const docker = new Docker()
  docker['create'] = create.bind(docker)
  return docker
}

function create(
  image: string,
  options?: Docker.ContainerCreateOptions
): Promise<Docker.Container> {
  let extendedOptions = { ...options || {}, Image: image }
  return this.createContainer(extendedOptions)
}
