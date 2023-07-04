import { useQuery } from 'react-query';
import { EdgeResponse } from 'src/models/edge';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { pathList } from './path.api';

export const usePath = (onSuccess?: (data: EdgeResponse) => void, onError?: (error: Error) => void) => {
  return useQuery<EdgeResponse, Error>(QUERY_KEY_FACTORY('PATH').lists(), () => pathList(), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5분 유지
  });
};
