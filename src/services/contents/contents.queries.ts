import { useQuery } from 'react-query';
import { RecommendContentsResponse } from 'src/models/recommend';
import { ArticleType } from 'src/config/types';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { recommendContentList } from './contents.api';
import { List } from 'lodash';

export interface paramProps {
  /** 컨텐츠 타입 필터링 */
  contentsType?: string;
  /** 페이지 */
  page?: number;
  /** 조회 개수 */
  size?: number;
  /** 추천 직군 타입 필터링 */
  recommendJobGroups?: string;
  /** 검색어 필터링 */
  keywords?: string;
  /** 추천 레벨 필터링 */
  recommendLevels?: string;
  /** 세미나 종료 일자 필터링 */
  seminarEndDateFrom?: string;
}

export const useRecommendContents = (
  pageName: string, // 페이지 별 캐싱 필요 (ex- 메인, 추천 콘텐츠 메뉴 구분)
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 15;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('RECOMMEND_CONTENT').list({ ...params, pageName }),
    () => recommendContentList({ ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: !!params.contentsType,
    },
  );
};
