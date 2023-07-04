import { useQuery } from 'react-query';
import { ProfileResponse } from '../../models/profile';
import { getNodeProfile } from '../apiService';

export const useNodeProfile = (onSuccess: (data: ProfileResponse) => void, onError: (error: Error) => void, nodeId) => {
  return useQuery<ProfileResponse, Error>(['post', nodeId], getNodeProfile, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};
