import { deleteCookie } from 'cookies-next';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../../queryKeys';
import { saveRecommendService, deleteRecommendService, addRecommendService } from './recommend-service.api';

export const useSaveService = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveRecommendService(requestBody.serviceId, requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_RECOMMENDSERVICE').all),
    onSuccess: async data => {
      alert('수정이 완료되었습니다.');
    },
  });
};

export const useDeleteService = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(serviceId => deleteRecommendService(serviceId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_RECOMMENDSERVICE').all),
    onSuccess: async () => {
      alert('추천서비스가 삭제되었습니다.');
    },
  });
};

export const useAddService = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => addRecommendService(requestBody), {
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
