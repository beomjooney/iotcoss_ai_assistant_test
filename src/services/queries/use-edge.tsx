import { useMutation, useQuery } from 'react-query';
import { EdgeResponse } from '../../models/edge';
import { getEdges, postConnect } from '../apiService';

export const useEdges = (onSuccess: (data: EdgeResponse) => void, onError: (error: Error) => void) => {
  return useQuery<EdgeResponse, Error>('getEdges', getEdges, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};

export const usePostConnect = (onSuccess: (data: EdgeResponse) => void, onError: (error: Error) => void) => {
  return useMutation<EdgeResponse, Error>((param: any) => postConnect(param), {
    onSuccess,
    onError,
  });
};
