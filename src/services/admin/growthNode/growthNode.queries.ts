import { useQuery } from 'react-query';
import { getNodeList, getDetailGrowthNode } from './growthNode.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useGetNodeList = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_GROWTHNODE').list(params)], () => getNodeList(params));

export const useGetDetailGrowthNode = (nodeId: string, onSuccess?: (data) => void, onError?: (error: Error) => void) =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_GROWTHNODE').detail(nodeId)], () => getDetailGrowthNode(nodeId), {
    onSuccess,
    onError,
    enabled: !!nodeId,
    retry: false,
  });
