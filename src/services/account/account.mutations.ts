import { deleteCookie } from 'cookies-next';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { deleteMember, editInfo, login, loginOtp, loginOtpVerification, loginSignUp, saveProfile } from './account.api';
import { setCookie } from 'cookies-next';

export const useSaveProfile = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveProfile(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ').all),
    onSuccess: async data => {
      // alert('수정이 완료되었습니다.');
    },
  });
};
export const useEditUser = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => editInfo(requestBody.memberId, requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('MENTORS').all),
    onSuccess: async data => {
      alert('수정이 완료되었습니다.');
    },
  });
};

export const useDeleteMember = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => deleteMember(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      if (code == 'C04012') {
        alert(`회원을 탈퇴하려면 세미나신청을 취소 해주세요.! ${message.split('=').reverse()[0]}`);
      } else {
        alert(`mutation error : [${code}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('MENTORS').all),
    onSuccess: async () => {
      alert('회원삭제가 완료되었습니다.');
      deleteCookie('access_token');
      localStorage.removeItem('auth-store');
      location.href = '/';
    },
  });
};

export const useLogin = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => login(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LOGIN').all),
    onSuccess: async data => {
      setCookie('access_token', data?.access_token);
      // alert('좋아요.~');
    },
  });
};

export const useLoginSignUp = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => loginSignUp(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LOGIN').all),
    onSuccess: async data => {
      // alert('회원가입이 정상적으로 되었습니다.');
      alert('회원가입이 정상적으로 되었습니다.');
      location.href = '/account/login';
      // alert('좋아요.~');
    },
  });
};

export const useLoginOtp = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => loginOtp(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('OTP').all),
    onSuccess: async data => {
      // alert('좋아요.~');
    },
  });
};

export const useLoginOtpVerification = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => loginOtpVerification(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('OTP').all),
    onSuccess: async data => {
      if (data) {
        alert('인증에 성공했습니다.');
      } else {
        alert('유효하지 않은 번호입니다.');
      }
    },
  });
};
