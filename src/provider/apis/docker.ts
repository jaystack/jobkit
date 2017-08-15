import { JobInfo } from '../../types';
import Docker from '../../Docker';

export default (jobInfo: JobInfo) => {
  return new Docker();
};
