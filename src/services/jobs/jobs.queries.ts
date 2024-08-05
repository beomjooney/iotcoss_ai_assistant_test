import { useQuery } from 'react-query';
import {
  getQuizList,
  getMyQuiz,
  getJobs,
  getMyQuizReply,
  getQuizReply,
  getGetSchedule,
  getGetTemp,
  getMyQuizContents,
  getMyQuizThresh,
  getLectureGetTemp,
} from './jobs.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { RecommendContentsResponse } from 'src/models/recommend';
import { paramProps } from '../community/community.queries';

// export const useJobs = () =>
//   useQuery(QUERY_KEY_FACTORY('ACCOUNT_MEMBER_LOGIN').details(), () => getJobs(), {
//     // refetchOnWindowFocus: false,
//     // enabled: false,
//   });

export const useJobs = () =>
  useQuery(QUERY_KEY_FACTORY('ACCOUNT_MEMBER_LOGIN').details(), () => getJobs(), {
    refetchOnWindowFocus: false,
    enabled: false,
  });

export const useQuizList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('ADMIN_CAMENITY').list({ size: DEFAULT_SIZE, ...params }),
    () => getQuizList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useMyQuiz = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 5;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('ACCOUNT_MEMBER_LOGIN').list({ size: DEFAULT_SIZE, ...params }),
    () => getMyQuiz({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
export const useMyQuizContents = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 7;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('QUIZ_CONTENTS').list({ size: DEFAULT_SIZE, ...params }),
    () => getMyQuizContents({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
export const useMyQuizThresh = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 5;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('MY_SEMINAR_PARTICIPANTS').list({ size: DEFAULT_SIZE, ...params }),
    () => getMyQuizThresh({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
export const useGetSchedule = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SCHEDULE').list(params), () => getGetSchedule(params), {
    onSuccess,
    onError,
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetTemp = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('TEMP').details(), () => getGetTemp(), {
    onSuccess,
    onError,
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export const useLectureGetTemp = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('TEMP').details(), () => getLectureGetTemp(), {
    onSuccess,
    onError,
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export const useMyQuizReply = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('ACCOUNT_MEMBER_MY_LOGIN').list({ size: DEFAULT_SIZE, ...params }),
    () => getMyQuizReply({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};
export const useQuizReply = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('QUIZ').list({ size: DEFAULT_SIZE, ...params }),
    () => getQuizReply({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};
