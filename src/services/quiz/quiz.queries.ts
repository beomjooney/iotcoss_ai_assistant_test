import { useQuery } from 'react-query';
import { clubDetailQuizList, getCamenities, getReplies, quizSolutionDetail } from './quiz.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';

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

export const useQuizSolutionDetail = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => quizSolutionDetail(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: true,
    enabled: !!id,
  });
};

export const useClubDetailQuizList = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').detail({ size: DEFAULT_SIZE, ...params }),
    () => clubDetailQuizList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: true,
    },
  );
};
