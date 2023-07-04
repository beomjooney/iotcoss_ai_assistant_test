import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { approveMentor, saveGrowthStory, saveMentor } from './mentors.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';

/**
 * 멘토 승인
 */
export const useApproveMentor = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => approveMentor(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      if (code === 'C04009') {
        alert('멘토 신청이 완료된 회원 입니다.');
      } else {
        alert(`error code: ${code}, message: ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('MENTORS').all),
    onSuccess: async data => {
      alert('멘토 신청이 등록 되었습니다.');
    },
  });
};

/**
 * 멘토 등록
 */
export const useSaveMentor = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => saveMentor(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      if (code === 'C04009') {
        alert('멘토 신청이 완료된 회원 입니다.');
      } else {
        alert(`error code: ${code}, message: ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('MENTORS').all),
    onSuccess: async data => {
      alert('성장스토리가 등록 되었습니다.');
    },
  });
};

/**
 * 멘토 수정
 */
export const useSaveGrowthStory = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => saveGrowthStory(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      if (code === 'C04009') {
        alert('멘토 신청이 완료된 회원 입니다.');
      } else {
        alert(`error code: ${code}, message: ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('MENTORS').all),
    onSuccess: async () => {
      alert('성장스토리가 수정 되었습니다.');
    },
  });
};
