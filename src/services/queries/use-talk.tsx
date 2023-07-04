import { useQuery } from 'react-query';
import { TalkListResponse } from 'src/models/talk-list';
import { getTalkList } from '../apiService';

export const useTalkList = (onSuccess: (data: TalkListResponse) => void, onError: (error: Error) => void) => {
  return useQuery<TalkListResponse, Error>('getTalkList', getTalkList, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};
