import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { saveClub, getClubInfo, getClubs, deleteClub } from './clubs.api';

export const useSaveClub = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => saveClub(requestBody.memberId, requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_MEMBERS').all),
    onSuccess: async data => {
      alert('수정이 완료되었습니다.');
    },
  });
};

export const useDeleteClub = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => deleteClub(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_MEMBERS').all),
    onSuccess: async () => {
      alert('삭제가 완료되었습니다.');
    },
  });
};
