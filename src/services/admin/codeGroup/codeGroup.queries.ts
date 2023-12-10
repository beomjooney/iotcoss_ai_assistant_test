import { useQuery } from 'react-query';
import { getCodeGroupInfo, getCodeGroups } from './codeGroup.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useCodeGroups = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CODE_LIST').list(params)], () => getCodeGroups(params));

export const useCodeGroup = sequence =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CODE_LIST').detail(sequence)], () => getCodeGroupInfo(sequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
