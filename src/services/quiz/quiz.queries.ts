import { useQuery } from 'react-query';
import {
  clubDetailQuizList,
  getCamenities,
  getReplies,
  quizAlarmHistory,
  quizAnswerDetail,
  quizFriends,
  quizGrowthDetail,
  quizPoint,
  quizRanking,
  quizRoungeDetail,
  quizRoungeInfo,
  quizSolutionDetail,
  quizSolutionDetailStatus,
  quizFileDownload,
  quizAnswerMemberDetail,
  quizGetProgress,
  quizGetAnswer,
  quizMyClubInfo,
  quizGetAIAnswer,
  quizAnswerMemberAIDetail,
  quizGetAIAnswerGet,
  quizGetAIAnswerAll,
  quizFriendsRequest,
  quizActivityHistory,
  myAllLectureInfo,
  lectureQAInfo,
  lectureStudyQAInfo,
  quizMyInfo,
  quizGetAIMyAnswer,
  quizKnowledgeDownload,
  quizGetAIAnswerGetTotal,
  quizGetAIAnswerGetQuiz,
  getAIQuizAnswer,
  quizGetAIAnswerGetTotalLecture,
  quizGetAIAnswerPostTotalLecture,
  quizGetAIAnswerGetTotalLectureMember,
  quizGetAIAnswerGetTotalLectureMemberReport,
  quizGetAIAnswerGetTotalLectureMemberCQI,
} from './quiz.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { User } from 'src/models/user';

export const useCamenities = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CAMENITY').list(params)], () => getCamenities(params));

export const useReplies = (params, onSuccess?: (data) => void, onError?: (error: Error) => void) =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CAMENITY').list(params)], () => getReplies(params), {
    onSuccess,
    onError,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    enabled: !!params?.postNo,
  });

export const useQuizSolutionDetail = (
  id,
  clubSequence,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  console.log(clubSequence);
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => quizSolutionDetail(id, clubSequence), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
export const useQuizRoungeInfo = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => quizRoungeInfo(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const useQuizMyClubInfo = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const DEFAULT_SIZE = 50;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('SEMINAR').detail({ size: DEFAULT_SIZE, ...params }),
    () => quizMyClubInfo({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useQuizMyInfo = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const DEFAULT_SIZE = 100;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ_MY_INFO').detail({ size: DEFAULT_SIZE, ...params }),
    () => quizMyInfo({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useLectureQAInfo = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('SEMINAR').detail({ size: DEFAULT_SIZE, ...params }),
    () => lectureQAInfo({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useLectureStudyQAInfo = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('LECTURE_QA_INFO').detail({ size: DEFAULT_SIZE, ...params }),
    () => lectureStudyQAInfo({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useMyAllLectureInfo = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('SEMINAR').detail({ size: DEFAULT_SIZE, ...params }),
    () => myAllLectureInfo({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useQuizFileDownload = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => quizFileDownload(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
export const useQuizKnowledgeDownload = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').detail(id), () => quizKnowledgeDownload(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });
};
export const useQuizSolutionDetailStatus = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').detail(id), () => quizSolutionDetailStatus(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!id,
  });
};

export const useQuizRankDetail = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => quizRanking(), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
  });
};

export const useQuizFriends = (params?: any, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('ADMIN_CAMENITY').list({ size: DEFAULT_SIZE, ...params }),
    () => quizFriends({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useQuizFriendsRequest = (
  params?: any,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').list({ size: DEFAULT_SIZE, ...params }),
    () => quizFriendsRequest({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    },
  );
};

export const useQuizGrowthDetail = (id, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').detail(id), () => quizGrowthDetail(id), {
    onSuccess,
    onError,
    refetchOnWindowFocus: true,
  });
};

export const useQuizAlarmHistory = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const DEFAULT_SIZE = 30;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').detail({ size: DEFAULT_SIZE, ...params.params }),
    () => quizAlarmHistory({ size: DEFAULT_SIZE, ...params.params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: params.logged,
    },
  );
};

export const useQuizActivityHistory = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ_LIST').detail({ size: DEFAULT_SIZE, ...params }),
    () => quizActivityHistory({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useQuizAnswerDetail = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').detail({ size: DEFAULT_SIZE, ...params }),
    () => quizAnswerDetail({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: false,
    },
  );
};

//클럽퀴즈 진행현황 조회
export const useQuizGetProgress = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('EDGE').detail(params), () => quizGetProgress(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

//클럽퀴즈 진행현황 조회
export const useQuizGetAnswer = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('EDGE').detail(params), () => quizGetAnswer(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

//클럽퀴즈 진행현황 조회
export const useQuizGetAIAnswer = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('EDGE').detail(params), () => quizGetAIAnswer(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

//클럽퀴즈 진행현황 조회
export const useGetAIQuizAnswer = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('CONTENT_DASHBOARD').detail(params), () => getAIQuizAnswer(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

//클럽퀴즈 진행현황 조회
export const useQuizGetAIMyAnswer = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('EDGE').detail(params), () => quizGetAIMyAnswer(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

//클럽퀴즈 진행현황 조회
export const useQuizGetAIAnswerGet = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ_CONTENTS').detail(params), () => quizGetAIAnswerGet(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });
};

//클럽퀴즈 진행현황 조회
export const useQuizGetAIAnswerAll = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('SCHEDULE').detail(params), () => quizGetAIAnswerAll(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

// AI 피드백 조회 전용 훅
export const useQuizAIFeedback = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  console.log('useQuizAIFeedback params:', params);
  return useQuery<any, Error>(QUERY_KEY_FACTORY('EDGE').detail(params), () => quizGetAIMyAnswer(params), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

// AI 피드백 조회 전용 훅
export const useQuizAIFeedbackTotal = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  console.log('useQuizAIFeedbackTotal params:', params);
  return useQuery<any, Error>(
    ['quiz-ai-feedback-total', params?.clubSequence],
    () => {
      console.log('API 호출 시작:', params);
      return quizGetAIAnswerGetTotal(params);
    },
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
    },
  );
};

// export const useQuizAIFeedbackLectureGetTotal = (
//   params,
//   onSuccess?: (data: any) => void,
//   onError?: (error: Error) => void,
// ) => {
//   console.log('useQuizAIFeedbackLectureTotal params:', params);
//   return useQuery<any, Error>(
//     ['quiz-ai-feedback-lecture-total', params?.clubSequence],
//     () => {
//       console.log('API 호출 시작:', params);
//       return quizGetAIAnswerGetTotalLecture(params);
//     },
//     {
//       onSuccess,
//       onError,
//       refetchOnWindowFocus: false,
//       enabled: false,
//       retry: false,
//     },
//   );
// };

export const useQuizAIFeedbackLectureGetTotal = (
  params,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('DASHBOARD_QUIZ').list({ ...params }),

    () => quizGetAIAnswerGetTotalLecture(params),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );
};

export const useQuizAIFeedbackLectureGetMember = (
  params,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('CONTENT_DASHBOARD_QUIZ').list({ ...params }),

    () => quizGetAIAnswerGetTotalLectureMember(params),
    {
      onSuccess,
      onError: error => {
        const { responseCode, message } = error;
        alert(`error : [${responseCode}] ${message}`);
      },
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );
};

export const useQuizAIFeedbackLectureGetMemberCQI = (
  params,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('DASHBOARD_QUIZ_REPORT_CQI').list({ ...params }),

    () => quizGetAIAnswerGetTotalLectureMemberCQI(params),
    {
      onSuccess,
      onError,
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );
};

export const useQuizAIFeedbackLectureGetMemberReport = (
  params,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('DASHBOARD_QUIZ_REPORT').list({ ...params }),

    () => quizGetAIAnswerGetTotalLectureMemberReport(params),
    {
      onSuccess,
      onError,
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );
};

export const useQuizAIFeedbackLecturePostTotal = (
  params,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  console.log('useQuizAIFeedbackLectureTotal params:', params);
  return useQuery<any, Error>(
    ['quiz-ai-feedback-lecture-total', params?.clubSequence],
    () => {
      console.log('API 호출 시작:', params);
      return quizGetAIAnswerPostTotalLecture(params);
    },
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
    },
  );
};

export const useQuizAIFeedbackQuiz = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  console.log('useQuizAIFeedbackQuiz params:', params);
  return useQuery<any, Error>(
    ['quiz-ai-feedback-quiz', params?.clubSequence],
    () => {
      console.log('API 호출 시작:', params);
      return quizGetAIAnswerGetQuiz(params);
    },
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
    },
  );
};

export const useQuizAnswerMemberDetail = (
  params,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').detail({ size: DEFAULT_SIZE, ...params }),
    () => quizAnswerMemberDetail({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: false,
    },
  );
};
export const useQuizAnswerMemberAIDetail = (
  params,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').detail({ size: DEFAULT_SIZE, ...params }),
    () => quizAnswerMemberAIDetail({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: false,
    },
  );
};

export const useQuizRoungeDetail = (params, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('TERMS').detail({ size: DEFAULT_SIZE, ...params }),
    () => quizRoungeDetail({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
      enabled: true,
    },
  );
};

export const useClubDetailQuizList = (
  params,
  id,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').detail({ size: DEFAULT_SIZE, ...params }),
    () => clubDetailQuizList({ size: DEFAULT_SIZE, ...params }, id),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );
};

export const useClubDetailQuizListDemo = (
  params,
  id,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  // return useQuery<SeminarContent, Error>(QUERY_KEY_FACTORY('SEMINAR').detail(id), () => seminarDetail(id), {
  // TODO : 수정 해주세요. 타입에러 나요. -> 세미나 상세 Profile 컴포넌트에 셋 할때 발생
  const DEFAULT_SIZE = 10;
  return useQuery<any, Error>(
    QUERY_KEY_FACTORY('QUIZ').detail({ size: DEFAULT_SIZE, ...params }),
    () => clubDetailQuizList({ size: DEFAULT_SIZE, ...params }, id),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );
};

export const useQuizPoint = (onSuccess?: (data: User) => void, onError?: (error: Error) => void) =>
  useQuery<User, Error>(QUERY_KEY_FACTORY('QUIZ').details(), () => quizPoint(), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    // enabled: !!memberId && memberId !== 'Guest',
    // staleTime: 10 * 60 * 1000, // 10분 유지
  });
