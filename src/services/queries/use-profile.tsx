import { useQuery } from 'react-query';
import { ProfileResponse } from '../../models/profile';
import { getProfile } from '../apiService';

// export const getProfile1 = async ({ queryKey }) => {
//   const [_, prodId] = queryKey;
//   const { data } = await axios.get(`/api/v1/products/${prodId}`);
//   return data;
// };

// export const useProfile = (onSuccess: (data: ProfileResponse) => void, onError: (error: Error) => void, pathId) => {
//   console.log('USE Profile : ', pathId);
//   return useQuery<ProfileResponse, Error>('getProfile', getProfile, {
//     onSuccess,
//     onError,
//     refetchOnWindowFocus: false,
//   });
// };

export const useProfile = (onSuccess: (data: ProfileResponse) => void, onError: (error: Error) => void, pathId) => {
  // return useQuery<ProfileResponse, Error>('getProfile', getProfile, {
  //   onSuccess,
  //   onError,
  //   refetchOnWindowFocus: false,
  // });
  return useQuery<ProfileResponse, Error>(['post', pathId], getProfile, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};
