import { JobInfo } from '../../types';

export default function(jobInfo: JobInfo) {
  return (time: number) => new Promise(resolve => setTimeout(resolve, time));
}
