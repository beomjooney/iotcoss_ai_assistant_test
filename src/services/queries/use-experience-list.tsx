import { useQuery } from 'react-query';
import { ExperienceListResponse } from '../../models/experience-list';
import { getExperienceList } from '../apiService';

export const useExperienceList = (
  onSuccess: (data: ExperienceListResponse) => void,
  onError: (error: Error) => void,
) => {
  return useQuery<ExperienceListResponse, Error>('getExperienceList', getExperienceList, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};
