import { useQuery } from 'react-query';
import { getMentors } from './mentors.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useMentors = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MENTORS').list(params)], () => getMentors(params));
