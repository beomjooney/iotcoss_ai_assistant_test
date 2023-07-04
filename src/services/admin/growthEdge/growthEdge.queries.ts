import { useQuery } from 'react-query';
import { getEdgeList, getDetailGrowthEdge } from './growthEdge.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useGetEdgeList = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_GROWTHEDGE').list(params)], () => getEdgeList(params));

export const useGetDetailGrowthEdge = (edgeId: string, onSuccess?: (data) => void, onError?: (error: Error) => void) =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_GROWTHEDGE').detail(edgeId)], () => getDetailGrowthEdge(edgeId), {
    onSuccess,
    onError,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!edgeId,
    retry: false,
  });
