import { useQuery } from 'react-query';
import { getMemberInfo, getMembers } from './members.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useMembers = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').list(params)], () => getMembers(params));

export const useMember = uuid =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').detail(uuid)], () => getMemberInfo(uuid), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
