import { useQuery } from 'react-query';
import { getExperience, getDevusExperienceInfo, getDevusExperiences } from './experience.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useExperience = params =>
  useQuery([QUERY_KEY_FACTORY('EXPERIENCE').list(params)], () => getExperience(params));

export const useDevusExperiences = params =>
  useQuery([QUERY_KEY_FACTORY('EXPERIENCE').list(params)], () => getDevusExperiences(params));

export const useDevusExperience = sequence =>
  useQuery([QUERY_KEY_FACTORY('EXPERIENCE').detail(sequence)], () => getDevusExperienceInfo(sequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
