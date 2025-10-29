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
  saveLectureModifyAI,
  saveLectureModifyCur,
  saveAIQuizMyAnswerSavePut,
  saveExcel,
  saveQuizExcel,
  saveQuizAiExcel,
  getContent,
  quizClubEvaluation,
  saveContentFile,
  saveContentQuizAiExcel,
  saveContentQuizContent,
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

export const useQuizClubEvaluation = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => quizClubEvaluation(requestBody), {
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

export const useSavePost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => savePost(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      if (responseCode === '0413') {
        alert('유효하지 않은 url입니다.');
      } else {
        alert(`mutation error : [${responseCode}] ${message}`);
      }
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
      const { responseCode, message } = data.data;
      if (responseCode === '0000') {
        alert('퀴즈가 등록되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

export const useQuizExcelSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveQuizExcel(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      alert(`[${responseCode}] 지식콘텐츠/퀴즈 일괄등록하기 : ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      const { responseCode, message } = data.data;
      if (responseCode === '0000') {
        // alert('지식콘텐츠/퀴즈가 등록되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};
export const useQuizAiExcelSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveQuizAiExcel(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      alert(`[${responseCode}] 지식콘텐츠/퀴즈(AI생성) 일괄등록하기 : ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      const { responseCode, message } = data.data;
      if (responseCode === '0000') {
        // alert('지식콘텐츠/퀴즈(AI생성) 등록되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

//지식콘텐츠 일괄 등록
export const useContentExcelSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveExcel(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      alert(`[${responseCode}] 지식콘텐츠 일괄등록하기 : ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      const { responseCode, message } = data.data;
      if (responseCode === '0000') {
        // alert('지식콘텐츠가 등록되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

//지식콘텐츠(파일) 일괄 등록
export const useContentFileSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveContentFile(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      alert(`[${responseCode}] 지식콘텐츠(파일) 일괄등록하기 : ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CONTENT_FILE').all),
    onSuccess: async data => {
      const { responseCode, message } = data.data;
      if (responseCode === '0000') {
        // alert('지식콘텐츠(파일) 등록되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

//지식콘텐츠(파일) + 퀴즈(AI생성) 엑셀 일괄
export const useContentQuizAiExcelSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveContentQuizAiExcel(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      alert(`[${responseCode}] 지식콘텐츠(파일) 일괄등록하기 : ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CONTENT_QUIZ_AI_EXCEL').all),
    onSuccess: async data => {
      const { responseCode, message } = data.data;
      if (responseCode === '0000') {
        // alert('지식콘텐츠(파일) 등록되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
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

export const useQuizContent = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => getContent(requestBody), {
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
      const { responseCode, message } = error;
      if (responseCode === '1410') {
        alert('AI 퀴즈 생성이 지원되지 않는 사이트입니다.');
      } else if (responseCode === '0413') {
        alert('유효하지 않은 url입니다.');
      } else {
        alert(`[${responseCode}] AI 퀴즈 생성 실패`);
        // alert(`mutation error : [${responseCode}] ${message}`);
      }
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
      } else if (responseCode === '0413') {
        alert('유효하지 않은 url입니다.');
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
      const { responseCode, message } = error;
      if (responseCode === '0413') {
        alert('유효하지 않은 url입니다.');
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

export const useAIQuizMyAnswerSavePut = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveAIQuizMyAnswerSavePut(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_GROWTHEDGE').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
      } else if (responseCode === '0410') {
        alert('셀프 채점을 허용하지 않는 클럽입니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
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
      const { responseCode, message } = error;
      if (responseCode === '1425') {
        alert('퀴즈 공개일의 경우 종료일을 공개일 이후로 설정해주세요.');
      } else {
        alert(`mutation error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        console.log('data?.clubStatus', data?.data?.clubStatus);
        if (data?.data?.clubStatus === '0100') {
          alert('클럽이 개설 되었습니다.\n관리자가 클럽 승인 대기 중입니다.');
        } else {
          alert('클럽이 개설 되었습니다.');
        }
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
      const { responseCode, message } = error;
      if (responseCode === '1425') {
        alert('퀴즈 공개일의 경우 종료일을 공개일 이후로 설정해주세요.');
      } else {
        alert(`mutation error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('TEMP').all),
    onSuccess: async data => {
      alert('저장 되었습니다.');
    },
  });
};

export const useClubQuizContentSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveContentQuizContent(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      alert(`mutation error : [${responseCode}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CONTENT_QUIZ_CONTENT').all),
    onSuccess: async data => {
      alert('퀴즈 AI생성 및 등록 완료되었습니다.');
    },
  });
};

export const useClubQuizTempSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveClubQuizTempPost(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      if (responseCode === '1425') {
        alert('퀴즈 공개일의 경우 종료일을 공개일 이후로 설정해주세요.');
      } else if (responseCode === '1428') {
        alert('이미 공개된 퀴즈를 삭제할 수 없습니다.');
      } else if (responseCode === '1426') {
        alert('퀴즈의 공개일이 클럽 시작일/종료일 기간내에 있어야 합니다.');
      } else {
        alert(`mutation error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('TEMP').all),
    onSuccess: async data => {
      // alert('저장 되었습니다.');
    },
  });
};

export const useLectureTempSave = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveLectureTempPost(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      if (responseCode === '1426') {
        alert('다음 커리큘럼 강의에서 종료일을 강의 종료일보다 이전으로 설정해주세요.');
      } else if (responseCode === '0413') {
        alert('유효하지 않은 url입니다.');
      } else {
        alert(`mutation error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('TEMP').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('임시저장이 되었습니다.');
      } else if (responseCode === '1420') {
        alert('시작일이 중복됩니다. 다른 날짜를 선택해 주세요.');
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
      const { responseCode, message } = error;
      if (responseCode === '1420') {
        alert('시작일이 중복됩니다. 다른 날짜를 선택해 주세요.');
      } else if (responseCode === '0413') {
        alert('유효하지 않은 url입니다.');
      } else {
        alert(`mutation error : [${responseCode}] ${message}`);
      }
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('TEMP').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('🎉 강의클럽이 성공적으로 개설되었습니다!');
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
      const { responseCode, message } = error;
      if (responseCode === '1426') {
        alert('커리큘럼에서 종료일을 강의 종료일보다 이전으로 설정해주세요.');
      } else {
        alert(`mutation error : [${responseCode}] ${message}`);
      }
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

export const useLectureModifyCur = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveLectureModifyCur(requestBody), {
    onError: (error, variables, context) => {
      const { responseCode, message } = error;
      alert(`mutation error : [${responseCode}] ${message}`);
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

export const useLectureModifyAI = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveLectureModifyAI(requestBody), {
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
