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
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
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
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
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
