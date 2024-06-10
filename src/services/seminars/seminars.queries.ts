import { QueryClient, useQuery } from 'react-query';
import {
  RecommendContent,
  RecommendContentsResponse,
  SeminarContent,
  SeminarImages,
  SeminarParticipant,
} from 'src/models/recommend';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import {
  clubMeWaitList,
  clubMyList,
  clubQuizCrewManage,
  clubQuizManage,
  mySeminarList,
  seminarDetail,
  seminarImageList,
  seminarList,
  clubFavoriteList,
  clubWaitingList,
  clubAboutDetail,
  seminarParticipantList,
  myDashboardList,
  myMemberList,
  myMemberRequestList,
} from './seminars.api';

export interface paramProps {
  seminarType?: string;
  page?: number;
  size?: number;
  seminarStatus?: string; // 0001   진행예정 / 0002   완료 / 0003   연기 / 0004   취소
  recommendJobGroups?: string;
  recommendLevels?: string;
  keyword?: string;
  studyCycle?: string;
  excludeSeminarIds?: any; // 콤마(,)로 구분
  enabled?: boolean;
  lecturerMemberId?: string;
}

export const useMyClubList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 8;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => clubMyList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

// 내 대시보드 목록 조회
export const useMyDashboardList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('DASHBOARD').list({ ...params }), () => myDashboardList(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};

// 내 요청 회원 목록 조회
export const useMyMemberRequestList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('DASHBOARD').list({ size: DEFAULT_SIZE, ...params }),
    () => myMemberRequestList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
// 내 회원 목록 조회
export const useMyMemberList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('COMMUNITY').list({ size: DEFAULT_SIZE, ...params }),
    () => myMemberList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useSeminarList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 8;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => seminarList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
export const useClubMeWaitList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => clubMeWaitList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};
export const useClubWaitingList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => clubWaitingList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};

export const useClubFavoriteList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => clubFavoriteList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};

export const useSeminarImageList = (onSuccess?: (data: SeminarImages[]) => void, onError?: (error: Error) => void) => {
  return useQuery<SeminarImages[], Error>(QUERY_KEY_FACTORY('SEMINAR_IMAGES').lists(), () => seminarImageList(), {
    onSuccess,
    onError,
    refetchOnWindowFocus: true,
  });
};

export const useClubQuizManage = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => clubQuizManage(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: true,
  });
};

export const useClubQuizCrewManage = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => clubQuizCrewManage({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};

export const useSeminarDetail = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: true,
    enabled: !!id,
  });
};

export const useClubAboutDetail = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ_ABOUT').detail(id), () => clubAboutDetail(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: true,
    enabled: !!id,
  });
};

export const useSeminarParticipantList = (
  seminarId: any,
  logged?: boolean,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('SEMINAR_PARTICIPANTS').list({ size: seminarId }),
    () => seminarParticipantList(seminarId),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: !!logged,
    },
  );
};

export const useMySeminarList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContent[]) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<RecommendContent[], Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ type: 'participant' }),
    () => mySeminarList({ ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: params?.enabled ?? true,
    },
  );
};

export const fetchSeminar = async (seminarId: string): Promise<QueryClient> => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QUERY_KEY_FACTORY('SEMINAR').detail(seminarId)], () => seminarDetail(seminarId));
  return queryClient;
};
