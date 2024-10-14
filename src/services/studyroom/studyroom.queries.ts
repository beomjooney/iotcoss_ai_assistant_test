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
  clubMyList,
  clubQuizManage,
  mySeminarList,
  seminarDetail,
  seminarImageList,
  studyRoomList,
  seminarMeFavoriteList,
  seminarMeList,
  seminarMeWaitList,
  seminarParticipantList,
  studyQuizList,
  studyQuizCalendarList,
  studyQuizBadgeList,
  studyQuizOpponentBadgeList,
  studyReminder,
  studyProgress,
  studyQuizMemberList,
  studyQuizRoleMemberList,
  quizContentsList,
  quizList,
  clubApprovalList,
  clubAdminList,
  clubTermsList,
  clubStatsSummary,
  clubQuizStatsSummary,
  clubActiveQuizStatsSummary,
  clubSummary,
  clubChartSummary,
} from './studyroom.api';

export interface paramProps {
  viewFilter?: string;
  seminarType?: string;
  pageCalendar?: number;
  page?: number;
  size?: number;
  seminarStatus?: string; // 0001   진행예정 / 0002   완료 / 0003   연기 / 0004   취소
  recommendJobGroups?: string;
  recommendLevels?: string;
  keyword?: string;
  excludeSeminarIds?: any; // 콤마(,)로 구분
  enabled?: boolean;
  lecturerMemberId?: string;
  calendarYearMonth?: string;
}

export const useMyClubList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 8;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => clubMyList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useStudyRoomList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 8;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => studyRoomList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
export const useStudyProgress = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 4;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('TEMP').list({ size: DEFAULT_SIZE, ...params }),
    () => studyProgress({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
export const useStudyReminder = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => studyReminder({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
export const useStudyQuizList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 6;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('ADMIN_CODE_LIST').list({ size: DEFAULT_SIZE, ...params }),
    () => studyQuizList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useStudyQuizBadgeList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 100;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('QUIZ').list({ size: DEFAULT_SIZE, ...params }),
    () => studyQuizBadgeList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useStudyQuizMemberList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 15;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('MENTORS').list({ size: DEFAULT_SIZE, ...params }),
    () => studyQuizMemberList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useQuizContentsList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 15;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('QUIZ_CONTENTS').list({ size: DEFAULT_SIZE, ...params }),
    () => quizContentsList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useClubApprovalList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 15;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('QUIZ_CONTENTS').list({ size: DEFAULT_SIZE, ...params }),
    () => clubApprovalList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useClubStatsSummary = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 15;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('CLUB_STATS_SUMMARY').list({ size: DEFAULT_SIZE, ...params }),
    () => clubStatsSummary({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useClubQuizStatsSummary = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 15;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('CLUB_QUIZ_STATS_SUMMARY').list({ size: DEFAULT_SIZE, ...params }),
    () => clubQuizStatsSummary({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useClubActiveQuizStatsSummary = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  // const DEFAULT_SIZE = 5;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('CLUB_ACTIVE_QUIZ_STATS_SUMMARY').list({ ...params }),
    () => clubActiveQuizStatsSummary({ ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useClubSummary = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  // const DEFAULT_SIZE = 5;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('CLUB_SUMMARY').list({ ...params }),
    () => clubSummary({ ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useClubChartSummary = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  // const DEFAULT_SIZE = 5;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('CLUB_CHART_SUMMARY').list({ ...params }),
    () => clubChartSummary({ ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useClubTermsList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 15;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('QUIZ_CONTENTS').list({ size: DEFAULT_SIZE, ...params }),
    () => clubTermsList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useClubAdminList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 15;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('QUIZ_CONTENTS').list({ size: DEFAULT_SIZE, ...params }),
    () => clubAdminList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useQuizList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 15;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('QUIZ').list({ size: DEFAULT_SIZE, ...params }),
    () => quizList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useStudyQuizRoleMemberList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 15;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('NODE_INFO').list({ size: DEFAULT_SIZE, ...params }),
    () => studyQuizRoleMemberList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useStudyQuizOpponentBadgeList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 100;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('QUIZ').list({ size: DEFAULT_SIZE, ...params }),
    () => studyQuizOpponentBadgeList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );
};

export const useStudyQuizCalendarList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('QUIZ').list({ ...params }),
    () => studyQuizCalendarList({ ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};
export const useSeminarMeWaitList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => seminarMeWaitList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};
export const useSeminarMeList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => seminarMeList({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};

export const useSeminarMeFavoriteList = (
  params?: paramProps,
  onSuccess?: (data: RecommendContentsResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<RecommendContentsResponse, Error>(
    QUERY_KEY_FACTORY('SEMINAR').list({ size: DEFAULT_SIZE, ...params }),
    () => seminarMeFavoriteList({ size: DEFAULT_SIZE, ...params }),
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
    refetchOnWindowFocus: true,
    enabled: !!id,
  });
};

export const useSeminarDetail = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
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
