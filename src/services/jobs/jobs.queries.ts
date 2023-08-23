import { useQuery } from 'react-query';
import { getJobs } from './jobs.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';

export const useJobs = () =>
  useQuery(QUERY_KEY_FACTORY('ACCOUNT_MEMBER_LOGIN').details(), () => getJobs(), {
    refetchOnWindowFocus: false,
    // enabled: false,
  });
