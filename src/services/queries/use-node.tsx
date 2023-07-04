import { useQuery } from 'react-query';
import { NodeResponse } from '../../models/node';
import { getNodes } from '../apiService';

export const useNodes = (onSuccess: (data: NodeResponse) => void, onError: (error: Error) => void) => {
  return useQuery<NodeResponse, Error>('getNodes', getNodes, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};
