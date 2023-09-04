import { useQuery } from 'react-query';
import { getQuizList, getMyJobs } from './jobs.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { RecommendContentsResponse } from 'src/models/recommend';
import { paramProps } from '../community/community.queries';

// export const useJobs = () =>
//   useQuery(QUERY_KEY_FACTORY('ACCOUNT_MEMBER_LOGIN').details(), () => getJobs(), {
//     // refetchOnWindowFocus: false,
//     // enabled: false,
//   });

export const useQuizList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 100;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('ACCOUNT_MEMBER_MY_LOGIN').list({ size: DEFAULT_SIZE, ...params }),
    () => getQuizList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};

export const useMyJobs = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('ACCOUNT_MEMBER_MY_LOGIN').list({ size: DEFAULT_SIZE, ...params }),
    () => getMyJobs({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};
