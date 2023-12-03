import { useQuery } from 'react-query';
import { getAlarmInfo, getAlarm } from './alarm.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useAlarms = params => useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').list(params)], () => getAlarm(params));

export const useAlarm = sequence =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').detail(sequence)], () => getAlarmInfo(sequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
