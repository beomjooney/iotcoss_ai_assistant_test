import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { setSaveOnePick, setDeleteOnePick, setSaveLiked, setDeleteLiked } from './monthly.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';

// 클럽 퀴즈 답변 원픽 달기
export const useSaveOnePicked = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>((clubQuizAnswerSequence: number) => setSaveOnePick(clubQuizAnswerSequence), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      //alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      //alert('onepick');
    },
  });
};

// 클럽 퀴즈 답변 원픽 제거
export const useDeleteOnePicked = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>((clubQuizAnswerSequence: number) => setDeleteOnePick(clubQuizAnswerSequence), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      //alert('not onepick');
    },
  });
};

// 클럽 퀴즈 답변 좋아요 달기
export const useSaveLiked = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>((clubQuizAnswerSequence: number) => setSaveLiked(clubQuizAnswerSequence), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      //alert('like');
    },
  });
};

// 클럽 퀴즈 답변 좋아요 제거
export const useDeleteLiked = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>((clubQuizAnswerSequence: number) => setDeleteLiked(clubQuizAnswerSequence), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      //alert('not like');
    },
  });
};
