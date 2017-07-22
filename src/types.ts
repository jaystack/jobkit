export interface JobInfo {
  buildNumber: number
  params: object
}

export interface ApiFactoryRegistry {
  [apiName: string]: Function
}
