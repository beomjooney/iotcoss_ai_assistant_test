import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../../services/queryKeys';
import { saveCodeList, deleteCodeList, saveDetailCode, deleteDetailCode, addCode, addDetailCode } from './code.api';

export const useSaveCodeList = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveCodeList(requestBody?.id, requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CODE_LIST').all),
    onSuccess: async data => {
      alert('추가가 완료되었습니다.');
    },
  });
};

export const useAddCode = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => addCode(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CODE_LIST').all),
    onSuccess: async data => {
      alert('추가가 완료되었습니다.');
    },
  });
};

export const useAddDetailCode = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => addDetailCode(requestBody.groupId, requestBody), {
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
export const useDeleteCodeList = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(id => deleteCodeList(id), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CODE_LIST').all),
    onSuccess: async () => {
      alert('삭제되었습니다.');
    },
  });
};

export const useSaveDetailCode = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveDetailCode(requestBody?.id, requestBody.groupId, requestBody), {
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

export const useDeleteDetailCode = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(content => deleteDetailCode(content.id, content.groupId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CODE_LIST').all),
    onSuccess: async () => {
      alert('삭제되었습니다.');
    },
  });
};
