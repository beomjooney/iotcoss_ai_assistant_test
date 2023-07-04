import { useQuery } from 'react-query';
import { SkillResponse } from 'src/models/skills';
import { mySkillList, skillList } from './skill.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';

export const useSkills = (onSuccess?: (data: SkillResponse) => void, onError?: (error: Error) => void) => {
  return useQuery<SkillResponse, Error>(QUERY_KEY_FACTORY('SKILL').lists(), () => skillList(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5분 유지
  });
};

export const useMySkills = (
  memberId: string,
  onSuccess?: (data: SkillResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<SkillResponse, Error>(QUERY_KEY_FACTORY('SKILL').list({ memberId }), () => mySkillList(memberId), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};
