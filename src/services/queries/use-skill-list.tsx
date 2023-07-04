import { useQuery } from 'react-query';
import { SkillListResponse } from '../../models/skill-list';
import { getSkillList } from '../apiService';

export const useSkillList = (onSuccess: (data: SkillListResponse) => void, onError: (error: Error) => void) => {
  return useQuery<SkillListResponse, Error>('getSkillList', getSkillList, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};
