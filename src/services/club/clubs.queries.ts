import { QueryClient, useQuery } from 'react-query';
import { RecommendContent, RecommendContentsResponse } from 'src/models/recommend';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { getClubInfo, getClubs } from './clubs.api';

export const useClubs = params => useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').list(params)], () => getClubs(params));

export const useClub = clubSequence =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').detail(clubSequence)], () => getClubInfo(clubSequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
