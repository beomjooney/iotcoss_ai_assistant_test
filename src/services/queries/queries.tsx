import { useQuery } from 'react-query';
import { ArticleResponse } from '../../models/article';
import { ReqResUsersResponse } from '../../models/reqres';
import { getArticles, getReqResUsers } from '../apiService';

const useArticles = (onSuccess: (data: ArticleResponse) => void, onError: (error: Error) => void) => {
  return useQuery<ArticleResponse, Error>('getArticles', getArticles, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};

export const useUsers = (onSuccess: (data: ReqResUsersResponse) => void, onError: (error: Error) => void) => {
  return useQuery<ReqResUsersResponse, Error>('getUsers', getReqResUsers, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};
