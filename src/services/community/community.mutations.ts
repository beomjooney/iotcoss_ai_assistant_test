import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import {
  saveLiked,
  deleteLiked,
  saveReply,
  deleteReply,
  popularPostList,
  saveCommunity,
  deletePost,
  modifyCommunity,
  answerSave,
  comprehensionSave,
  saveQuizLiked,
  saveQuizLikedReply,
  deleteQuizLiked,
  deleteQuizLikedReply,
  answerUpdate,
  saveReReply,
  saveQuizOnePick,
  deleteQuizOnePick,
  saveFavorite,
  deleteFavorite,
  myReplyDelete,
  myReplyUpdate,
  deletePostContent,
  deletePostQuiz,
  deleteReReply,
  myReReplyUpdate,
  clubJoin,
  saveContentLiked,
  deleteContentLiked,
  hidePostQuiz,
  publishPostQuiz,
  recoverPostQuiz,
  quizModify,
  checkAlarm,
  deleteClub,
  clubCancel,
  lectureClubEvaluation,
  lectureClubEvaluationMember,
  lectureClubFeedbackSave,
  lectureClubEvaluationReport,
} from './community.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';

export const useSaveLike = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((postId: number) => saveLiked(postId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요.~');
    },
  });
};
export const useContentSaveLike = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((postId: number) => saveContentLiked(postId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요.~');
    },
  });
};
export const useQuizLike = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((postId: number) => saveQuizLiked(postId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요.~');
    },
  });
};

export const useQuizLikeReply = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((params: any) => saveQuizLikedReply(params), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요.~');
    },
  });
};
export const useQuizDeleteLike = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((postId: number) => deleteQuizLiked(postId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요.~');
    },
  });
};
export const useQuizDeleteLikeReply = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((params: any) => deleteQuizLikedReply(params), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요.~');
    },
  });
};
export const useQuizOnePick = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((params: any) => saveQuizOnePick(params), {
    onError: (error, variables, context) => {
      // const { code, message } = error;
      // alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요.~');
    },
  });
};
export const useQuizDeleteOnePick = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((params: any) => deleteQuizOnePick(params), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요.~');
    },
  });
};

export const useDeleteLike = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((postId: number) => deleteLiked(postId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요. 취소요~');
    },
  });
};
export const useContentDeleteLike = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((postId: number) => deleteContentLiked(postId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요. 취소요~');
    },
  });
};

// 즐겨찾기
export const useSaveFavorite = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((postId: number) => saveFavorite(postId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요.~');
    },
  });
};

// 알람 확인
export const useCheckAlarm = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((postId: number) => checkAlarm(postId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요.~');
    },
  });
};

export const useDeleteFavorite = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((postId: number) => deleteFavorite(postId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요. 취소요~');
    },
  });
};

export const useDeleteClub = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>((postId: number) => deleteClub(postId), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('LIKE').all),
    onSuccess: async data => {
      // alert('좋아요. 취소요~');
    },
  });
};

export const useSaveReply = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => saveReply(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useSaveReReply = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => saveReReply(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useAnswerSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => answerSave(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      if (responseCode === '0413') {
        alert('유효하지 않은 url입니다.');
      } else {
        alert(`mutation error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {
      data;
    },
  });
};
export const useAnswerUpdate = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => answerUpdate(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      if (responseCode === '0413') {
        alert('유효하지 않은 url입니다.');
      } else {
        alert(`mutation error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};
export const useComprehensionSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => comprehensionSave(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useDeleteReply = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => deleteReply(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useDeleteReReply = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => deleteReReply(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useDeletePost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => deletePost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useDeletePostContent = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => deletePostContent(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useDeletePostQuiz = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => deletePostQuiz(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ').all),
    onSuccess: async data => {},
  });
};

export const useRecoverPostQuiz = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => recoverPostQuiz(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ').all),
    onSuccess: async data => {},
  });
};

export const useHidePostQuiz = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => hidePostQuiz(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ').all),
    onSuccess: async data => {},
  });
};

export const usePublishPostQuiz = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => publishPostQuiz(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ').all),
    onSuccess: async data => {},
  });
};

export const useQuizModify = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => quizModify(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ').all),
    onSuccess: async data => {
      const { responseCode, message } = data.data;
      if (responseCode === '0000') {
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

export const useSaveCommunity = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => saveCommunity(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('COMMUNITY').all),
    onSuccess: async data => {
      // alert('커뮤니티 글쓰기가 완료되었습니다.');
    },
  });
};

export const useModifyCommunity = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => modifyCommunity(requestBody), {
    onError: (error, variables, context) => {
      alert(`mutation error : ${error}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('COMMUNITY').all),
    onSuccess: async data => {
      // alert('커뮤니티 글쓰기가 완료되었습니다.');
    },
  });
};

//커뮤니티 업데이트 삭제
export const useMyReplyDelete = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => myReplyDelete(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};
export const useMyReplyUpdate = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => myReplyUpdate(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useMyReReplyUpdate = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => myReReplyUpdate(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useClubJoin = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => clubJoin(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      if (responseCode === '0000') {
      } else if (responseCode === '0401') {
        alert('유효하지 않은 참여 코드입니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useLectureClubEvaluation = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => lectureClubEvaluation(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      if (responseCode === '0000') {
      } else if (responseCode === '0401') {
        alert('유효하지 않은 참여 코드입니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

/** 개별 클럽의 피드백 생성 */
export const useLectureClubEvaluationMember = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => lectureClubEvaluationMember(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      if (responseCode === '0000') {
      } else if (responseCode === '0401') {
        alert('유효하지 않은 참여 코드입니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};



/** 개별 클럽의 CQI 보고서 생성 */
export const useLectureClubEvaluationReport = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => lectureClubEvaluationReport(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      if (responseCode === '0000') {
      } else if (responseCode === '0401') {
        alert('유효하지 않은 참여 코드입니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useLectureClubFeedbackSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => lectureClubFeedbackSave(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      if (responseCode === '0000') {
      } else if (responseCode === '0401') {
        alert('유효하지 않은 참여 코드입니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};

export const useClubCancel = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => clubCancel(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('REPLY').all),
    onSuccess: async data => {},
  });
};
