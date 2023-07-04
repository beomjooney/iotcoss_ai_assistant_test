import { useQuery } from 'react-query';
import { NodeResponse } from 'src/models/node';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { nodeList, nodeInfoList } from './node.api';

export const useNode = (onSuccess?: (data: NodeResponse) => void, onError?: (error: Error) => void) => {
  return useQuery<NodeResponse, Error>(QUERY_KEY_FACTORY('NODE').lists(), async () => await nodeList(), {
    onSuccess,
    onError,
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5분 유지
  });
};

export const useNodeInfo = (
  nodeId: string,
  onSuccess?: (data: NodeResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<NodeResponse, Error>(QUERY_KEY_FACTORY('NODE_INFO').list({ nodeId }), () => nodeInfoList(nodeId), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5분 유지
    enabled: false,
  });
};
