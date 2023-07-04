import { useQuery } from 'react-query';
import { getPushhistory } from './pushhisotry.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const usePushHistory = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_PUSHHISTORY').list(params)], () => getPushhistory(params));
