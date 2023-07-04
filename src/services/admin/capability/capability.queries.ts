import { useQuery } from 'react-query';
import { getCapabilities } from './capability.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useCapabilities = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CAPABILITY').list(params)], () => getCapabilities(params));
