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
  saveLectureTempPost,
  saveLecturePost,
  saveLectureModify,
  saveClubQuizTempPost,
} from './quiz.api';
import router from 'next/router';

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
      const { responseCode, message } = error;
      if (responseCode === 'CO5000') {
        alert('AI 모델 답안 생성 실패');
      } else {
        alert(`mutation error : [${responseCode}] ${message}`);
      }
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
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('클럽이 개설 되었습니다.\n관리자가 클럽 승인대기 중입니다.');
        router.push('/quiz');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
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
      alert('저장 되었습니다.');
    },
  });
};

export const useClubQuizTempSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveClubQuizTempPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('TEMP').all),
    onSuccess: async data => {
      alert('저장 되었습니다.');
    },
  });
};

export const useLectureTempSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveLectureTempPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('TEMP').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('임시저장이 되었습니다.');
      } else if (responseCode === '1420') {
        alert('강의 주차 등록 시 시작일이 중복됩니다. 다른 날짜를 선택해 주세요.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

export const useLectureSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveLecturePost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('TEMP').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('강의클럽이 개설 되었습니다.\n관리자가 클럽 승인대기 중입니다.');
        router.push('/lecture');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

export const useLectureModify = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveLectureModify(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('TEMP').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('강의클럽이 수정되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
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
