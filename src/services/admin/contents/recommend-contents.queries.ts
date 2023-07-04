import { useQuery } from 'react-query';
import { getRecommend } from './recommend-contents.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useRecommendContents = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_RECOMMENDCONTENTS').list(params)], () => getRecommend(params));
