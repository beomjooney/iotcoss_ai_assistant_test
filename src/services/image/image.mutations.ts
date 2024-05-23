import { useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { postImage } from './image.api';

export const useUploadImage = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(file => postImage(file), {
    onError: (error, variables, context) => {
      // alert(`사진 업로드에 실패하였습니다. ${error}`);
    },
    onSettled: data => queryClient.invalidateQueries(QUERY_KEY_FACTORY('IMAGE').detail(data)),
    onSuccess: async data => {
      return data as string;
    },
  });
};
