import { useQuery } from 'react-query';
import { getCamenities, getReplies } from './quiz.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';

export const useCamenities = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CAMENITY').list(params)], () => getCamenities(params));

export const useReplies = (params, onSuccess?: (data) => void, onError?: (error: Error) => void) =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CAMENITY').list(params)], () => getReplies(params), {
    onSuccess,
    onError,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    enabled: !!params?.postNo,
  });
