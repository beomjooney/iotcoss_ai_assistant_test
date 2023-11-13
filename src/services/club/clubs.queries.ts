import { QueryClient, useQuery } from 'react-query';
import { RecommendContent, RecommendContentsResponse } from 'src/models/recommend';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { getClubInfo, getClubs } from './clubs.api';

export const useClubs = params => useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').list(params)], () => getClubs(params));

export const useClub = memberId =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').detail(memberId)], () => getClubInfo(memberId), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
