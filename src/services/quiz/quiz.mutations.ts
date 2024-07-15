import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import {
  addPosts,
  deletePost,
  savePost,
  saveReply,
  deleteReply,
  saveClubQuizPost,
  quizOrder,
  saveClubTempPost,
  saveAIQuizPost,
  saveAIQuizAnswer,
  saveContent,
  saveAIQuizAnswerList,
  saveAIQuizAnswerListPut,
  saveAIQuizAnswerSavePut,
  saveAIQuizAnswerEvaluation,
  saveAIQuizAnswerFeedback,
} from './quiz.api';

export const useQuizOrder = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => quizOrder(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ').all),
    onSuccess: async data => {
      alert('수정이 완료되었습니다.');
    },
  });
};

export const useSavePost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => savePost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      alert('수정이 완료되었습니다.');
    },
  });
};

export const useQuizSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => savePost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      // alert('수정이 완료되었습니다.');
    },
  });
};

export const useQuizContentSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveContent(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('PATH').all),
    onSuccess: async data => {
      // alert('수정이 완료되었습니다.');
    },
  });
};

export const useAIQuizSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveAIQuizPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      // alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      // alert('수정이 완료되었습니다.');
    },
  });
};

export const useAIQuizAnswer = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveAIQuizAnswer(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      // alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_GROWTHEDGE').all),
    onSuccess: async data => {
      // alert('수정이 완료되었습니다.');
    },
  });
};

export const useAIQuizAnswerFeedback = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveAIQuizAnswerFeedback(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ_CONTENTS').all),
    onSuccess: async data => {
      // alert('수정이 완료되었습니다.');
    },
  });
};

export const useAIQuizAnswerList = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveAIQuizAnswerList(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      // alert(`mutation error : [${code}] ${message}`);
      alert(`AI 채점 실패`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_GROWTHEDGE').all),
    onSuccess: async data => {
      // alert('수정이 완료되었습니다.');
    },
  });
};

export const useAIQuizAnswerListPut = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveAIQuizAnswerListPut(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_GROWTHEDGE').all),
    onSuccess: async data => {
      // alert('수정이 완료되었습니다.');
    },
  });
};

export const useAIQuizAnswerSavePut = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveAIQuizAnswerSavePut(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_GROWTHEDGE').all),
    onSuccess: async data => {
      // alert('수정이 완료되었습니다.');
    },
  });
};

export const useAIQuizAnswerEvaluation = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveAIQuizAnswerEvaluation(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('OTP').all),
    onSuccess: async data => {
      // alert('수정이 완료되었습니다.');
    },
  });
};

export const useClubQuizSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveClubQuizPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      alert('클럽이 개설 되었습니다.\n관리자가 클럽 승인대기 중입니다.');
    },
  });
};

export const useClubTempSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveClubTempPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('TEMP').all),
    onSuccess: async data => {
      alert('임시저장 되었습니다.');
    },
  });
};

export const useDeletePost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(postNo => deletePost(postNo), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async () => {
      alert('삭제되었습니다.');
    },
  });
};

export const useAddPost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => addPosts(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      alert('추가가 완료되었습니다.');
    },
  });
};

export const useSaveReply = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveReply(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      alert('수정이 완료되었습니다.');
    },
  });
};

export const useDeleteReply = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(body => deleteReply(body), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async () => {
      alert('삭제되었습니다.');
    },
  });
};
