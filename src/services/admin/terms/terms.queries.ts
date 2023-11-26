import { useQuery } from 'react-query';
import { getTermInfo, getTerms } from './terms.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useTerms = params => useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').list(params)], () => getTerms(params));

export const useTerm = sequence =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').detail(sequence)], () => getTermInfo(sequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
