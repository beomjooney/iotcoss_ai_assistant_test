import { QueryClient, useQuery } from 'react-query';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import {
  getMentor,
  getMentorList,
  getMentorProfile,
  getMentorUri,
  mentorList,
  myMentorList,
  recommendMentors,
} from './mentors.api';
import { MyMentorListResponse, User } from 'src/models/user';

export const useMyMentorList = (
  memberId: string,
  onSuccess?: (data: MyMentorListResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<MyMentorListResponse, Error>(
    QUERY_KEY_FACTORY('MENTORS').list({ memberId }),
    () => myMentorList(memberId),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useMentorList = (onSuccess?: (data: User[]) => void, onError?: (error: Error) => void) => {
  return useQuery<User[], Error>(QUERY_KEY_FACTORY('MENTORS').lists(), () => mentorList(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};

export const useGetMentorList = (params: any) =>
  useQuery([QUERY_KEY_FACTORY('MENTORS').list(params)], () => getMentorList(params));

export const useRecommendMentors = (params: any) =>
  useQuery([QUERY_KEY_FACTORY('MENTORS').list(params)], () => recommendMentors(params));

export const useMentor = (
  mentorId: string,
  onSuccess?: (data: MyMentorListResponse) => void,
  onError?: (error: Error) => void,
) =>
  useQuery([QUERY_KEY_FACTORY('MENTORS').detail(mentorId)], () => getMentor(mentorId), {
    onSuccess,
    onError,
    enabled: !!mentorId,
    retry: false,
  });

export const useMentorUri = (
  mentorUri: string,
  onSuccess?: (data: MyMentorListResponse) => void,
  onError?: (error: Error) => void,
) =>
  useQuery([QUERY_KEY_FACTORY('MENTORS').detail(mentorUri)], () => getMentorUri(mentorUri), {
    onSuccess,
    onError,
    enabled: !!mentorUri,
    retry: false,
  });

export const fetchMentor = async (mentorUri: string): Promise<QueryClient> => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QUERY_KEY_FACTORY('MENTORS').detail(mentorUri)], () => getMentorUri(mentorUri));
  return queryClient;
};

export const useMentorProfile = (
  mentorId: string,
  onSuccess?: (data: MyMentorListResponse) => void,
  onError?: (error: Error) => void,
) =>
  useQuery([QUERY_KEY_FACTORY('MENTORS').account(mentorId)], () => getMentorProfile(mentorId), {
    onSuccess,
    onError,
    enabled: !!mentorId,
    retry: false,
  });
