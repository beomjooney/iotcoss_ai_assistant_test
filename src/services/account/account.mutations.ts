import { deleteCookie } from 'cookies-next';
import { useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import {
  getIdVerification,
  deleteMember,
  editInfo,
  login,
  loginOtp,
  loginOtpVerification,
  loginSignUp,
  saveProfile,
  changePhone,
  changePassword,
  userUpdate,
} from './account.api';
import { setCookie } from 'cookies-next';
import router from 'next/router';

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
      console.log(error);
      const { code, message } = error;
      // alert(`mutation error : [${code}] ${message}`);
      if (code === 'C06000') {
        alert('로그인 실패 횟수 초과');
      } else if (code === 'C06002') {
        alert('이메일 계정 또는 암호가 일치하지 않습니다. 다시 한번 확인해 주세요.');
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LOGIN').all),
    onSuccess: async data => {
      console.log('data', data);

      const { responseCode, message } = data;
      if (typeof data.responseCode === 'undefined') {
        setCookie('access_token', data?.access_token);
        // alert('회원가입이 정상적으로 되었습니다.');
        // router.push('/account/login');
        location.href = '/';
      } else if (responseCode === '0400') {
        alert('테넌트 정보를 찾을 수 없습니다.');
        router.push('/account/login');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
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
      console.log('data', data);
      const { responseCode, message } = data.data;
      if (responseCode === '0000') {
        alert('회원가입이 정상적으로 되었습니다.');
        router.push('/account/login');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
      // alert('회원가입이 정상적으로 되었습니다.');
      // alert('회원가입이 정상적으로 되었습니다.');
      // location.href = '/account/login';
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

// export const useLoginId = (): UseMutationResult => {
//   const queryClient = useQueryClient();
//   // TODO : any 타입 변경
//   return useMutation<any, any, any>(requestBody => getIdVerification(requestBody), {
//     onError: (error, variables, context) => {
//       const { code, message } = error;
//       alert(`mutation error : [${code}] ${message}`);
//     },
//     onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('OTP').all),
//     onSuccess: async data => {
//       // alert('좋아요.~');
//     },
//   });
// };

export const useLoginOtpVerification = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => loginOtpVerification(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('OTP').all),
    onSuccess: async data => {},
  });
};

export const useChangePhone = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => changePhone(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('OTP').all),
    onSuccess: async data => {},
  });
};

export const useChangePassword = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => changePassword(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('OTP').all),
    onSuccess: async data => {
      alert('비밀번호 변경이 완료되었습니다.');
    },
  });
};
export const useUserUpdate = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => userUpdate(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('OTP').all),
    onSuccess: async data => {
      alert('회원정보 수정이 완료되었습니다.');
    },
  });
};
