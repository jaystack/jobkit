export interface JobInfo {
  cwd: string
  buildNumber: number
  params: object
}

export interface ApiFactoryRegistry {
  [apiName: string]: Function
}
