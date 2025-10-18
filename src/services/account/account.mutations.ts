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
  requestProfessor,
  emailSend,
  emailJoinSend,
  resetPassword,
  join,
  loginSignUpDSU,
  loginIdTest,
  loginIdPasswordTest,
} from './account.api';
import { setCookie } from 'cookies-next';
import router from 'next/router';

export const useSaveProfile = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(
    requestBody => {
      return saveProfile(requestBody);
    },
    {
      onError: (error, variables, context) => {
        const { code, message } = error;
        alert(`mutation error : [${code}] ${message}`);
      },
      onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ').all),
      onSuccess: async data => {
        console.log('data', data);
        if (data.data.responseCode === '0000') {
          if (data.isProfessor === false) {
            alert('수정이 완료되었습니다.');
          }
        } else {
          alert(`error : [${data.responseCode}] ${data.message}`);
        }
      },
    },
  );
};

// 교수자 권한 요청
export const useRequestProfessor = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => requestProfessor(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('PROFESSOR_REQUEST').all),
    onSuccess: async data => {
      if (data.responseCode === '0000') {
        alert('교수자 권한 요청이 완료되었습니다.');
      } else if (data.responseCode === 'C04009') {
        alert('교수자 권한 요청이 이미 존재합니다.');
      } else {
        alert(`error : [${data.responseCode}] ${data.message}`);
      }
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
      const { responseCode, message } = error;
      if (responseCode === 'C06000') {
        alert('로그인 시도 횟수를 초과했습니다.');
      } else if (responseCode === 'C06002') {
        alert('이메일 계정 또는 암호가 일치하지 않습니다. 다시 한번 확인해 주세요.');
      } else if (responseCode === 'C06005') {
        alert('학사DB 연동모듈에 오류가 발생하였습니다. 관리자에게 문의 해주세요.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LOGIN').all),
    onSuccess: async data => {
      console.log('data', data);

      const { responseCode, message } = data;
      if (responseCode === '0000') {
        setCookie('access_token', data?.access_token);
      } else if (responseCode === '1403') {
      } else if (responseCode === 'C06005') {
        alert('학사DB 연동모듈에 오류가 발생하였습니다. 관리자에게 문의 해주세요.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

export const useLoginIdTest = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => loginIdTest(requestBody), {
    onError: (error, variables, context) => {
      console.log(error);
      const { responseCode, message } = error;
      if (responseCode === 'C06000') {
        // alert('로그인 시도 횟수를 초과했습니다.');
      } else if (responseCode === 'C06002') {
        // alert('이메일 계정 또는 암호가 일치하지 않습니다. 다시 한번 확인해 주세요.');
      } else {
        // alert(`error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LOGIN').all),
    onSuccess: async data => {
      console.log('data', data);

      alert('아이디 검증이 완료되었습니다.');
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        // setCookie('access_token', data?.access_token);
      } else if (responseCode === '1403') {
      } else {
        // alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};
export const useLoginIdPasswordTest = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => loginIdPasswordTest(requestBody), {
    onError: (error, variables, context) => {
      console.log(error);
      const { responseCode, message } = error;
      if (responseCode === 'C06000') {
        // alert('로그인 시도 횟수를 초과했습니다.');
      } else if (responseCode === 'C06002') {
        // alert('이메일 계정 또는 암호가 일치하지 않습니다. 다시 한번 확인해 주세요.');
      } else {
        // alert(`error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LOGIN').all),
    onSuccess: async data => {
      console.log('data', data);
      alert('아이디 비밀번호 검증이 완료되었습니다.');

      const { responseCode, message } = data;
      if (responseCode === '0000') {
      } else if (responseCode === '1403') {
      } else {
        // alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};
export const useEmainSend = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => emailSend(requestBody), {
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
      if (responseCode === '0000') {
        // setCookie('access_token', data?.access_token);
      } else if (responseCode === '0400') {
        alert('회원을 찾을 수 없습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

export const useEmainJoinSend = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => emailJoinSend(requestBody), {
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
      if (responseCode === '0000') {
        // setCookie('access_token', data?.access_token);
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
        router.push('/account/member-registration-complete');
        // router.push('/account/login');
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

export const useLoginSignUpDSU = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => loginSignUpDSU(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LOGIN').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data.data;
      if (responseCode === '0000') {
        // alert('회원가입이 정상적으로 되었습니다.');
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
    onSuccess: async data => { },
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
    onSuccess: async data => { },
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
      // alert('비밀번호 변경이 완료되었습니다.');
    },
  });
};

export const useResetPassword = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => resetPassword(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('OTP').all),
    onSuccess: async data => {
      alert('비밀번호 변경이 완료되었습니다.');
      router.push('/account/login');
    },
  });
};
export const useJoin = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => join(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('OTP').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      console.log('responseCode', responseCode);
      if (responseCode === '0000') {
      } else if (responseCode === '4016') {
        // alert('세션이 만료되었습니다.\n다시 회원가입해주세요.');
        // router.push('/account/signup');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
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
