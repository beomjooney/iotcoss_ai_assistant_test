import { useQuery } from 'react-query';
import { EdgeResponse } from 'src/models/edge';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { edgeList, edgeInfoList } from './edge.api';

export const useEdge = (onSuccess?: (data: EdgeResponse) => void, onError?: (error: Error) => void) => {
  return useQuery<EdgeResponse, Error>(QUERY_KEY_FACTORY('EDGE').lists(), async () => await edgeList(), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};

export const useEdgeInfo = (
  pathId: string,
  onSuccess?: (data: EdgeResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<EdgeResponse, Error>(QUERY_KEY_FACTORY('EDGE_INFO').list({ pathId }), () => edgeInfoList(pathId), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5분 유지
    enabled: false,
  });
};
