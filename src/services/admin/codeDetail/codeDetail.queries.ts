import { useQuery } from 'react-query';
import { getCodeDetailInfo, getCodeDetails } from './codeDetail.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useCodeDetails = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CODE_LIST').list(params)], () => getCodeDetails(params));

export const useCodeDetail = sequence =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CODE_LIST').detail(sequence)], () => getCodeDetailInfo(sequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
