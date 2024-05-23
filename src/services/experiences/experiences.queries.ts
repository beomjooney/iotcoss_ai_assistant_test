import { useQuery } from 'react-query';
import { ExperiencesResponse } from 'src/models/experiences';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { experienceList, myExperienceList } from './experiences.api';

export const useOptions = (onSuccess?: (data: ExperiencesResponse) => void, onError?: (error: Error) => void) => {
  return useQuery<ExperiencesResponse, Error>(QUERY_KEY_FACTORY('EXPERIENCE').lists(), () => experienceList(), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5분 유지
  });
};

export const useMyExperiences = (
  memberId: string,
  onSuccess?: (data: ExperiencesResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<ExperiencesResponse, Error>(
    QUERY_KEY_FACTORY('EXPERIENCE').list({ memberId }),
    () => myExperienceList(memberId),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
