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
  clubMyCommunityList,
  clubMyList,
  clubQuizCrewManage,
  clubQuizManage,
  mySeminarList,
  seminarDetail,
  guestTenant,
  seminarImageList,
  seminarList,
  clubFavoriteList,
  clubWaitingList,
  clubAboutDetail,
  seminarParticipantList,
  myDashboardList,
  myMemberList,
  myMemberRequestList,
  lectureAboutDetail,
  lectureMyList,
  myLectureDashboardList,
  myLectureDashboardStudentList,
  myDashboardLecture,
  myDashboardQA,
  lectureAboutDetailInfo,
  myDashboardStudentQA,
  clubAboutDetailInfo,
  professorRequestList,
  myExcel,
  myAllClubExcel,
  myLectureDashboardChatList,
  myLectureChatList,
  myLectureContentList,
  lectureEvaluation,
  professorManageList,
  professorCandidateList,
  myStudentsList,
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
  recruitType?: string;
  clubType?: string;
  memberSortType?: string;
}

export const useMyLectureList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 100;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: params.size, ...params }),
    () => lectureMyList({ size: params.size, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useClubAboutDetailInfo = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('LECTURE_ABOUT').detail(id), () => clubAboutDetailInfo(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useMyClubList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  // const DEFAULT_SIZE = 100;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: params.size, ...params }),
    () => clubMyList({ size: params.size, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

//
export const useMyStudentsList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('STUDENT').list({ size: DEFAULT_SIZE, ...params }),
    () => myStudentsList({ size: DEFAULT_SIZE, ...params }),
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

// 내 대시보드 목록 조회
export const useMyLectureDashboardList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('DASHBOARD').list({ ...params }),

    () => myLectureDashboardList(params),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

// 내 대시보드 목록 조회
export const useMyLectureChatList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('DASHBOARD').list({ size: DEFAULT_SIZE, ...params }),
    () => myLectureChatList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

// 내 대시보드 목록 조회
export const useMyLectureContentList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('CONTENT_DASHBOARD').list({ size: DEFAULT_SIZE, ...params }),
    () => myLectureContentList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

// 내 대시보드 목록 조회
export const useMyLectureDashboardStudentList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('STUDENT_DASHBOARD').list({ size: DEFAULT_SIZE, ...params }),
    () => myLectureDashboardStudentList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
export const useMyLectureDashboardChatList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('CHAT_DASHBOARD').list({ size: DEFAULT_SIZE, ...params }),
    () => myLectureDashboardChatList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

// 내 대시보드 목록 조회
export const useMyDashboardLecture = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('DASHBOARD_LECTURE').list({ size: DEFAULT_SIZE, ...params }),
    () => myDashboardLecture({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

// 내 대시보드 목록 조회
export const useMyDashboardQA = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 3;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('DASHBOARD_QA').list({ size: DEFAULT_SIZE, ...params }),
    () => myDashboardQA({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );
};

// 내 대시보드 목록 조회
export const useMyExcel = (params?: paramProps, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const DEFAULT_SIZE = 3;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('EXCEL').list({ size: DEFAULT_SIZE, ...params }),
    () => myExcel({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );
};

// 내 대시보드 목록 조회
export const useMyAllClubExcel = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 3;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('EXCEL').list({ size: DEFAULT_SIZE, ...params }),
    () => myAllClubExcel({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );
};

// 내 대시보드 목록 조회
export const useMyDashboardStudentQA = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 3;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('DASHBOARD_STUDENT_QA').list({ size: DEFAULT_SIZE, ...params }),
    () => myDashboardStudentQA({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );
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

// 내 요청 회원 목록 조회
export const useProfessorRequestList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('PROFESSOR_REQUEST').list({ size: DEFAULT_SIZE, ...params }),
    () => professorRequestList({ size: DEFAULT_SIZE, ...params }),
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
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 8;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => seminarList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
export const useClubMyCommunityList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => clubMyCommunityList({ size: DEFAULT_SIZE, ...params }),
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

export const useProfessorManageList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('PROFESSOR_REQUEST').list({ size: DEFAULT_SIZE, ...params }),
    () => professorManageList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};

// 지도교수자 신청 목록 조회
export const useProfessorCandidateList = (
  params?: paramProps,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 7;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('PROFESSOR_CANDIDATE').list({ size: DEFAULT_SIZE, ...params }),
    () => professorCandidateList({ size: DEFAULT_SIZE, ...params }),
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
    retry: false,
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
      refetchOnWindowFocus: false,
    },
  );
};

export const useMyProgress = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: !!id,
    retry: false,
  });
};

export const useClubAboutDetail = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ_ABOUT').detail(id), () => clubAboutDetail(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const useLectureAboutDetail = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('LECTURE_ABOUT').detail(id), () => lectureAboutDetail(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};

export const useLectureAboutDetailInfo = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('LECTURE_ABOUT').detail(id), () => lectureAboutDetailInfo(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useLectureEvaluation = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('LECTURE_EVALUATION').detail(id), () => lectureEvaluation(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    retry: false,
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

export const useGuestTenant = (domain: string, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('GUEST_TENANT').detail(domain), () => guestTenant(domain), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};

export const fetchSeminar = async (seminarId: string): Promise<QueryClient> => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QUERY_KEY_FACTORY('SEMINAR').detail(seminarId)], () => seminarDetail(seminarId));
  return queryClient;
};

export const fetchGuestTenats = async (domain: string): Promise<QueryClient> => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QUERY_KEY_FACTORY('GUEST_TENANT').detail(domain)], () => guestTenant(domain));
  return queryClient;
};
