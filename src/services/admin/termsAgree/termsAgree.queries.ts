import { useQuery } from 'react-query';
import { getTermsAgreeInfo, getTermsAgree } from './termsAgree.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useTermsAgrees = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').list(params)], () => getTermsAgree(params));

export const useTermsAgree = sequence =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').detail(sequence)], () => getTermsAgreeInfo(sequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
