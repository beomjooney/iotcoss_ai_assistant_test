import { deleteCookie } from 'cookies-next';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../../queryKeys';
import { saveContents, deleteContents, addContent } from './recommend-contents.api';

export const useSaveContent = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveContents(requestBody.contentsId, requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_RECOMMENDCONTENTS').all),
    onSuccess: async data => {
      alert('수정이 완료되었습니다.');
    },
  });
};

export const useDeleteContent = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(contentsId => deleteContents(contentsId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_RECOMMENDCONTENTS').all),
    onSuccess: async () => {
      alert('추천콘텐츠가 삭제되었습니다.');
    },
  });
};

export const useAddContent = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => addContent(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('EXPERIENCE').all),
    onSuccess: async data => {
      alert('추가가 완료되었습니다.');
    },
  });
};
