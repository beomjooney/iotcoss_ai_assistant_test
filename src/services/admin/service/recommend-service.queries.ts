import { useQuery } from 'react-query';
import { getRecommedService } from './recommend-service.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useRecommendService = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_RECOMMENDCONTENTS').list(params)], () => getRecommedService(params));
