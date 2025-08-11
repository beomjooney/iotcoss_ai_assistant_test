import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import {
  deleteSeminar,
  encoreSeminar,
  openSeminar,
  participantApplySeminar,
  participantCancelSeminar,
  participantSeminar,
  saveSeminar,
  saveAnswer,
  deleteQuestion,
  updateSeminar,
  chatQuery,
  requestAdvisors,
  deleteAdvisor,
} from './seminars.api';

export const useSaveSeminar = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => saveSeminar(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('SEMINAR').all),
    onSuccess: async data => {
      alert('세미나 개설이 완료되었습니다.');
    },
  });
};

export const useSaveAnswer = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => saveAnswer(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('SEMINAR').all),
    onSuccess: async data => {},
  });
};

export const useChatQuery = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => chatQuery(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('SEMINAR').all),
    onSuccess: async data => {},
  });
};

export const useDeleteQuestion = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => deleteQuestion(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ_ABOUT').all),
    onSuccess: async data => {
      alert('질문내역이 삭제되었습니다.');
    },
  });
};

export const useOpenSeminar = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => openSeminar(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('SEMINAR_OPEN').all),
    onSuccess: async data => {
      alert('세미나 개설 신청이 완료되었습니다.');
    },
  });
};

export const useEncoreSeminar = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => encoreSeminar(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('SEMINAR_ENCORE').all),
    onSuccess: async data => {
      alert('세미나 개설 신청이 완료되었습니다.');
    },
  });
};

export const useParticipantSeminar = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => participantSeminar(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('SEMINAR').all),
    onSuccess: async () => {
      alert('클럽 신청이 완료되었습니다.');
    },
  });
};

export const useParticipantCancelSeminar = (): UseMutationResult => {
  const queryClient = useQueryClient();
  // TODO : any 타입 변경
  return useMutation<any, any, any>(requestBody => participantCancelSeminar(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('SEMINAR').all),
    onSuccess: async () => {
      alert('세미나 취소가 완료되었습니다.');
    },
  });
};

export const useParticipantApplySeminar = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => participantApplySeminar(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(QUERY_KEY_FACTORY('SEMINAR').all);
      await queryClient.invalidateQueries(QUERY_KEY_FACTORY('SEMINAR_PARTICIPANTS').all);
    },
    onSuccess: async () => {
      alert('세미나 신청 승인/취소가 처리되었습니다.');
    },
  });
};

export const useUpdateSeminar = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => updateSeminar(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(QUERY_KEY_FACTORY('SEMINAR').all);
      await queryClient.invalidateQueries(QUERY_KEY_FACTORY('SEMINAR_PARTICIPANTS').all);
    },
    onSuccess: async () => {
      alert('수정되었습니다.');
    },
  });
};

export const useDeleteSeminar = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => deleteSeminar(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_SEMINAR').all);
    },
    onSuccess: async () => {
      alert('삭제되었습니다.');
    },
  });
};

// 지도교수자 신청
export const useRequestAdvisors = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, string[]>(advisorUUIDs => requestAdvisors(advisorUUIDs), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`지도교수자 신청 실패: [${code}] ${message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(QUERY_KEY_FACTORY('PROFESSOR_REQUEST').all);
      await queryClient.invalidateQueries(QUERY_KEY_FACTORY('PROFESSOR_CANDIDATE').all);
    },
    onSuccess: async () => {
      alert('지도교수자 신청이 완료되었습니다.');
    },
  });
};

// 지도교수자 삭제
export const useDeleteAdvisor = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, string>(advisorUUID => deleteAdvisor(advisorUUID), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`지도교수자 삭제 실패: [${code}] ${message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(QUERY_KEY_FACTORY('PROFESSOR_REQUEST').all);
      await queryClient.invalidateQueries(QUERY_KEY_FACTORY('PROFESSOR_CANDIDATE').all);
    },
    onSuccess: async () => {
      alert('지도교수자가 삭제되었습니다.');
    },
  });
};
