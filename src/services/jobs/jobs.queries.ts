import { useQuery } from 'react-query';
import { getJobs, getMyJobs } from './jobs.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';

export const useJobs = () =>
  useQuery(QUERY_KEY_FACTORY('ACCOUNT_MEMBER_LOGIN').details(), () => getJobs(), {
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
export const useMyJobs = () =>
  useQuery(QUERY_KEY_FACTORY('ACCOUNT_MEMBER_MY_LOGIN').details(), () => getMyJobs(), {
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
