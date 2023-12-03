import { useQuery } from 'react-query';
import { SkillResponse } from 'src/models/skills';
import { getBadges, getBadgeInfo } from './badge.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useBadges = params => useQuery([QUERY_KEY_FACTORY('SKILL').list(params)], () => getBadges(params));

export const useBadge = sequence =>
  useQuery([QUERY_KEY_FACTORY('SKILL').detail(sequence)], () => getBadgeInfo(sequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
