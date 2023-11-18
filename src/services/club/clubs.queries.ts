import { QueryClient, useQuery } from 'react-query';
import { RecommendContent, RecommendContentsResponse } from 'src/models/recommend';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { getClubs, getClubInfo, getClubQuizs, getClubQuizInfo } from './clubs.api';

export const useClubs = params => useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').list(params)], () => getClubs(params));

export const useClub = clubSequence =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').detail(clubSequence)], () => getClubInfo(clubSequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });

export const useClubQuizs = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').list(params)], () => getClubQuizs(params));

export const useClubQuiz = clubSequence =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').detail(clubSequence)], () => getClubQuizInfo(clubSequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
