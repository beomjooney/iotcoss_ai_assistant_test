import { useQuery } from 'react-query';
import {
  getIdVerification,
  login,
  memberActiveSummaryInfo,
  memberInfo,
  memberLogin,
  memberSummaryInfo,
  termsInfo,
} from './account.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { User } from 'src/models/user';
import { Terms, Token } from 'src/models/account';

export const useTestData = () =>
  useQuery(QUERY_KEY_FACTORY('ACCOUNT_MEMBER_LOGIN').details(), () => memberLogin(), {
    refetchOnWindowFocus: false,
    enabled: false,
  });

export const useMemberSummaryInfo = (onSuccess?: (data: User) => void, onError?: (error: Error) => void) =>
  useQuery<User, Error>(QUERY_KEY_FACTORY('MEMBER').details(), () => memberSummaryInfo(), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    // enabled: !!memberId && memberId !== 'Guest',
    // staleTime: 10 * 60 * 1000, // 10분 유지
  });
export const useMemberActiveSummaryInfo = (onSuccess?: (data: User) => void, onError?: (error: Error) => void) =>
  useQuery<User, Error>(QUERY_KEY_FACTORY('QUIZ').details(), () => memberActiveSummaryInfo(), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    // enabled: !!memberId && memberId !== 'Guest',
    // staleTime: 10 * 60 * 1000, // 10분 유지
  });
export const useMemberInfo = (memberId: any, onSuccess?: (data: User) => void, onError?: (error: Error) => void) =>
  useQuery<User, Error>(QUERY_KEY_FACTORY('MEMBER').details(), () => memberInfo(memberId), {
    onSuccess,
    onError,
    refetchOnWindowFocus: true,
    enabled: !!memberId,
    retry: false,
  });

export const useTermsList = (params: any) =>
  useQuery([QUERY_KEY_FACTORY('TERMS').list(params)], () => termsInfo(params), {
    refetchOnWindowFocus: false,
    enabled: false,
    // staleTime: 10 * 60 * 1000, // 10분 유지
  });

// export const useIdVerification = params =>
//   useQuery([QUERY_KEY_FACTORY('ACCOUNT_MEMBER_LOGIN').list(params)], () => getIdVerification(params), {
//     refetchOnWindowFocus: false,
//     enabled: false,
//   });

export const useIdVerification = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('ACCOUNT_MEMBER_LOGIN').list(params), () => getIdVerification(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};
