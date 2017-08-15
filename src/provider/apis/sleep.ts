import { JobInfo } from '../../types';

export default (jobInfo: JobInfo) => {
  return (time: number) => new Promise(resolve => setTimeout(resolve, time));
};
