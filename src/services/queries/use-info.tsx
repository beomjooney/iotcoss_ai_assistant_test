import { useQuery } from 'react-query';
import { InfoResponse } from '../../models/info';
import { getInfo } from '../apiService';

export const useInfo = (onSuccess: (data: InfoResponse) => void, onError: (error: Error) => void) => {
  return useQuery<InfoResponse, Error>('getInfo', getInfo, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};
