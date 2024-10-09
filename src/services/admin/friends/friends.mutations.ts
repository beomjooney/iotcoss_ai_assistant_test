import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../../queryKeys';
import {
  addPosts,
  deletePost,
  savePost,
  saveReply,
  deleteReply,
  rejectPost,
  crewAcceptPost,
  crewRejectPost,
  crewBan,
  instructorAccept,
  instructorDelete,
  instructorBan,
  saveAdminPost,
  rejectAdminPost,
  saveAdminClubPost,
  rejectAdminClubPost,
} from './friends.api';

export const useCrewBanDelete = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => crewBan(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('강의클럽에서 강퇴 되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};
export const useCrewAcceptPost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => crewAcceptPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('클럽 가입이 되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

export const useInstructorsAccept = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => instructorAccept(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('INSTRUCTORS_ACCEPT').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('교수자 권한이 부여되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

export const useInstructorsDelete = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => instructorDelete(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('INSTRUCTORS_DELETE').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('교수자 권한 삭제가 완료되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

export const useInstructorBan = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => instructorBan(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('INSTRUCTORS_DELETE').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('해당클럽에서 강퇴가 되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

export const useCrewRejectPost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => crewRejectPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('ADMIN_CAMENITY').all),
    onSuccess: async data => {
      console.log('data', data);
      const { responseCode, message } = data;
      if (responseCode === '0000') {
        alert('클럽 거절이 되었습니다.');
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    },
  });
};

export const useFriendAcceptPost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => savePost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ_ABOUT').all),
    onSuccess: async data => {
      alert('친구 수락이 되었습니다.');
    },
  });
};

export const useAdminAcceptPost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveAdminPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ_ABOUT').all),
    onSuccess: async data => {
      alert('관리자 신청이 승인되었습니다.');
    },
  });
};

export const useAdminClubAcceptPost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveAdminClubPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ_ABOUT').all),
    onSuccess: async data => {
      alert('클럽 승인이 되었습니다.');
    },
  });
};

export const useAdminClubRejectPost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => rejectAdminClubPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ_ABOUT').all),
    onSuccess: async data => {
      alert('클럽 거절이 되었습니다.');
    },
  });
};

export const useAdminRejectPost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => rejectAdminPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ_ABOUT').all),
    onSuccess: async data => {
      alert('관리자 신청이 거절되었습니다.');
    },
  });
};

export const useFriendRejectPost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => rejectPost(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('QUIZ_ABOUT').all),
    onSuccess: async data => {
      alert('친구 거절이 되었습니다.');
    },
  });
};

export const useFriendsDeletePost = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => deletePost(requestBody), {
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
