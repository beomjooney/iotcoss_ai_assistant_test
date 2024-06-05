import { useQuery } from 'react-query';
import {
  clubDetailQuizList,
  getCamenities,
  getReplies,
  quizAlarmHistory,
  quizAnswerDetail,
  quizFriends,
  quizGrowthDetail,
  quizPoint,
  quizRanking,
  quizRoungeDetail,
  quizRoungeInfo,
  quizSolutionDetail,
  quizSolutionDetailStatus,
  quizFileDownload,
  quizAnswerMemberDetail,
  quizGetProgress,
  quizGetAnswer,
} from './quiz.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { User } from 'src/models/user';

export const useCamenities = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CAMENITY').list(params)], () => getCamenities(params));

export const useReplies = (params, onSuccess?: (data) => void, onError?: (error: Error) => void) =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CAMENITY').list(params)], () => getReplies(params), {
    onSuccess,
    onError,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    enabled: !!params?.postNo,
  });

export const useQuizSolutionDetail = (
  id,
  clubSequence,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => quizSolutionDetail(id, clubSequence), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
export const useQuizRoungeInfo = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => quizRoungeInfo(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const useQuizFileDownload = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => quizFileDownload(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
export const useQuizSolutionDetailStatus = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').detail(id), () => quizSolutionDetailStatus(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!id,
  });
};

export const useQuizRankDetail = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => quizRanking(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};

export const useQuizFriends = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => quizFriends(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};

export const useQuizGrowthDetail = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').detail(id), () => quizGrowthDetail(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: true,
  });
};

export const useQuizAlarmHistory = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const DEFAULT_SIZE = 100;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').detail({ size: DEFAULT_SIZE, ...params }),
    () => quizAlarmHistory({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: true,
    },
  );
};

export const useQuizAnswerDetail = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').detail({ size: DEFAULT_SIZE, ...params }),
    () => quizAnswerDetail({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: false,
    },
  );
};

//클럽퀴즈 진행현황 조회
export const useQuizGetProgress = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('EDGE').detail(params), () => quizGetProgress(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

//클럽퀴즈 진행현황 조회
export const useQuizGetAnswer = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('EDGE').detail(params), () => quizGetAnswer(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

export const useQuizAnswerMemberDetail = (
  params,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').detail({ size: DEFAULT_SIZE, ...params }),
    () => quizAnswerMemberDetail({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: false,
    },
  );
};

export const useQuizRoungeDetail = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('TERMS').detail({ size: DEFAULT_SIZE, ...params }),
    () => quizRoungeDetail({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: true,
    },
  );
};

export const useClubDetailQuizList = (
  params,
  id,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').detail({ size: DEFAULT_SIZE, ...params }),
    () => clubDetailQuizList({ size: DEFAULT_SIZE, ...params }, id),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: true,
    },
  );
};

export const useQuizPoint = (onSuccess?: (data: User) => void, onError?: (error: Error) => void) =>
  useQuery<User, Error>(QUERY_KEY_FACTORY('QUIZ').details(), () => quizPoint(), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    // enabled: !!memberId && memberId !== 'Guest',
    // staleTime: 10 * 60 * 1000, // 10분 유지
  });
