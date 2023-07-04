import { useQuery } from 'react-query';
import { EdgeResponse } from '../../models/edge';
import { getPath } from '../apiService';

export const usePath = (onSuccess: (data: EdgeResponse) => void, onError: (error: Error) => void) => {
  return useQuery<EdgeResponse, Error>('getPath', getPath, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};
