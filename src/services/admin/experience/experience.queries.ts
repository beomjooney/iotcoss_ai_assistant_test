import { useQuery } from 'react-query';
import { getExperience } from './experience.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useExperience = params =>
  useQuery([QUERY_KEY_FACTORY('EXPERIENCE').list(params)], () => getExperience(params));
