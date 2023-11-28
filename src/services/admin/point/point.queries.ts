import { useQuery } from 'react-query';
import { getPointInfo, getPoints } from './point.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const usePoints = params => useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').list(params)], () => getPoints(params));

export const usePoint = sequence =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').detail(sequence)], () => getPointInfo(sequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
