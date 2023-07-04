import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../../queryKeys';
import { saveCapabilitiesLevel, deleteCapabilitiesLevel, addCapabilitiesLevel } from './capabilityLevel.api';

export const useSaveCapabilitiesLevel = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(
    ({ capabilityId, requestBody }) => saveCapabilitiesLevel(capabilityId, requestBody),
    {
      onError: (error, variables, context) => {
        const { code, message } = error;
        alert(`mutation error : [${code}] ${message}`);
      },
      onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAPABILITY').all),
      onSuccess: async data => {
        alert('수정이 완료되었습니다.');
      },
    },
  );
};

export const useDeleteCapabilitiesLevel = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(capabilityId => deleteCapabilitiesLevel(capabilityId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAPABILITY').all),
    onSuccess: async () => {
      alert('삭제되었습니다.');
    },
  });
};

export const useAddCapabilitiesLevel = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(
    requestBody => addCapabilitiesLevel(requestBody?.capabilityId, requestBody.capabilityLevels),
    {
      onError: (error, variables, context) => {
        const { code, message } = error;
        alert(`mutation error : [${code}] ${message}`);
      },
      onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAPABILITY').all),
      onSuccess: async data => {
        alert('추가가 완료되었습니다.');
      },
    },
  );
};
