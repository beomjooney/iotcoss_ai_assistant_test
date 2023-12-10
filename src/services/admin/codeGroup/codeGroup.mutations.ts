import { deleteCookie } from 'cookies-next';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../../queryKeys';
import { deleteCodeGroup, saveCodeGroup, addCodeGroup } from './codeGroup.api';

export const useSaveCodeGroup = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => saveCodeGroup(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CODE_LIST').all),
    onSuccess: async data => {
      alert('수정이 완료되었습니다.');
    },
  });
};

export const useDeleteCodeGroup = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => deleteCodeGroup(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CODE_LIST').all),
    onSuccess: async () => {
      alert('회원삭제가 완료되었습니다.');
    },
  });
};

export const useAddCodeGroup = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => addCodeGroup(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CODE_LIST').all),
    onSuccess: async data => {
      alert('등록이 완료되었습니다.');
    },
  });
};
