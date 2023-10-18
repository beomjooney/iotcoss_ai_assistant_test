import { QueryClient, useQuery } from 'react-query';
import { RecommendContentsResponse } from 'src/models/recommend';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { CommunityObject, RepliesResponse, KeyworldObject, MentoObject } from 'src/models/community';
import {
  communityList,
  getPost,
  popularKeyWorldList,
  popularMentoList,
  popularPostList,
  popularPostSearchList,
  repliesList,
} from './community.api';
import { User } from 'src/models/user';

export interface paramProps {
  [x: string]: any;
  /** 조회 개수 */
  size?: number;
  /** 추천 직군 타입 필터링 */
  afterCursor?: number;
  /** 추천 직군 타입 필터링 */
  relatedJobGroups?: string;
  /** 검색어 필터링 */
  keyword?: string;
  /** 추천 레벨 필터링 */
  recommendLevels?: string;
}

export const usePopularPostList = (onSuccess?: (data: CommunityObject[]) => void, onError?: (error: Error) => void) => {
  return useQuery<CommunityObject[], Error>(QUERY_KEY_FACTORY('POPULAR_POST').lists(), () => popularPostList(), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};

export const useCommunityList = (
  pageName: string,
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 6;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('COMMUNITY').list({ size: DEFAULT_SIZE, ...params, pageName }),
    () => communityList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useRepliesList = (
  params?: paramProps,
  onSuccess?: (data: RepliesResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 6;
  return useQuery<RepliesResponse, Error>(QUERY_KEY_FACTORY('COMMUNITY').list(params), () => repliesList(params), {
    enabled: false,
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};

export const usePopularPostSearchList = (
  postNo: number,
  onSuccess?: (data: RepliesResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<RepliesResponse, Error>(
    [QUERY_KEY_FACTORY('COMMUNITY').detail(postNo)],
    () => popularPostSearchList(postNo),
    {
      enabled: false,
      onSuccess,
      onError,
    },
  );
};

export const useGetPost = (
  postNo: number,
  onSuccess?: (data: RepliesResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<RepliesResponse, Error>(
    [QUERY_KEY_FACTORY('COMMUNITY').detail(postNo)],
    () => popularPostSearchList(postNo),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: !!postNo,
      retry: false,
    },
  );
};

export const usePopularKeyWorldList = (
  onSuccess?: (data: KeyworldObject[]) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<KeyworldObject[], Error>(QUERY_KEY_FACTORY('COMMUNITY').lists(), () => popularKeyWorldList(), {
    onSuccess,
    onError,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePopularMentoList = (onSuccess?: (data: User[]) => void, onError?: (error: Error) => void) => {
  return useQuery<User[], Error>(QUERY_KEY_FACTORY('MENTORS').lists(), () => popularMentoList(), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};

export const fetchCommunityPost = async (postNo: number): Promise<QueryClient> => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QUERY_KEY_FACTORY('COMMUNITY').detail(postNo)], () => getPost(postNo));
  return queryClient;
};
