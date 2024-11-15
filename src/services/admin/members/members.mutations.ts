import { deleteCookie } from 'cookies-next';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../../queryKeys';
import { deleteMember, saveMember, saveQuiz } from './members.api';

export const useSaveMember = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => saveMember(requestBody.memberId, requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_MEMBERS').all),
    onSuccess: async data => {
      // alert('수정이 완료되었습니다.');
    },
  });
};
export const useSaveQuiz = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(
    requestBody => saveQuiz(requestBody.club, requestBody.data, requestBody.selectedOption),
    {
      onError: (error, variables, context) => {
        const { code, message } = error;
        alert(`mutation error : [${code}] ${message}`);
      },
      onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_MEMBERS').all),
      onSuccess: async data => {
        console.log('data?.data?.responseCode', data?.data?.responseCode);
        if (data?.data?.responseCode === '0000') {
          alert('퀴즈 수정이 완료되었습니다.');
        } else if (data?.data?.responseCode === '0401') {
          alert('오픈되어있는 퀴즈는 순서를 변경할 수 없습니다.');
        } else {
          alert('퀴즈 수정 실패했습니다. : ' + data?.data?.responseCode);
        }
      },
    },
  );
};

export const useDeleteMember = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => deleteMember(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_MEMBERS').all),
    onSuccess: async () => {
      alert('회원삭제가 완료되었습니다.');
    },
  });
};
