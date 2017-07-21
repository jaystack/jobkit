export interface JobInfo {
  cwd: string
  env: object
  buildNumber: number
}

export interface ApiFactoryRegistry {
  [apiName: string]: Function
}