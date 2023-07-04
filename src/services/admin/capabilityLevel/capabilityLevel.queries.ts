import { useQuery } from 'react-query';
import { getCapabilitiesLevel, getDetailCapabilitiesLevel, getCapabilitiesBasedLevel } from './capabilityLevel.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useCapabilitiesLevel = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CAPABILITY_LEVEL').list(params)], () => getCapabilitiesLevel(params));

export const useGetDetailCapabilitiesLevel = (
  nodeId: string,
  onSuccess?: (data) => void,
  onError?: (error: Error) => void,
) =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CAPABILITY_LEVEL').detail(nodeId)], () => getDetailCapabilitiesLevel(nodeId), {
    onSuccess,
    onError,
    enabled: !!nodeId,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

export const useGetCapabilitiesBasedLevel = (
  capabilityId: string,
  onSuccess?: (data) => void,
  onError?: (error: Error) => void,
) =>
  useQuery(
    [QUERY_KEY_FACTORY('ADMIN_CAPABILITY_LEVEL').detail(capabilityId)],
    () => getCapabilitiesBasedLevel(capabilityId),
    {
      onSuccess,
      onError,
      enabled: !!capabilityId,
      retry: false,
    },
  );
