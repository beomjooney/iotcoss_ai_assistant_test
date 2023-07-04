import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { QUERY_KEY_FACTORY } from '../../../services/queryKeys';
import { saveSkills, addSkills, deleteSkills, updateSkillsExcel } from './skill.api';

export const useSaveSkill = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => saveSkills(requestBody?.skillId, requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('SKILL').all),
    onSuccess: async data => {
      alert('수정이 완료되었습니다.');
    },
  });
};

export const useAddSkill = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => addSkills(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('SKILL').all),
    onSuccess: async data => {
      alert('추가가 완료되었습니다.');
    },
  });
};

export const useDeleteSkill = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(id => deleteSkills(id), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('SKILL').all),
    onSuccess: async () => {
      alert('삭제되었습니다.');
    },
  });
};

export const useUpdateSkillExcel = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(requestBody => updateSkillsExcel(requestBody), {
    onError: (error, variables, context) => {
      const { code, message } = error;
      alert(`mutation error : [${code}] ${message || '엑셀 업로드에 실패했습니다.'}`);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY_FACTORY('SKILL').all),
    onSuccess: async data => {
      const url = window.URL.createObjectURL(new Blob([data?.data || []], { type: 'application/octet-stream' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '커리어멘토스_양식_엑셀 스킬 다운로드.xlsx');
      document.body.appendChild(link);
      link.click();
      alert(
        '엑셀 업로드가 완료되었습니다. 업로드 성공 수 : ' +
          data.headers['excel-upload-success-count'] +
          ' 업로드 실패 수 : ' +
          data.headers['excel-upload-fail-count'] +
          '',
      );
    },
  });
};
