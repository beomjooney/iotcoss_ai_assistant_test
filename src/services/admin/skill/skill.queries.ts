import { useQuery } from 'react-query';
import { getSkills, getSkillsExcel } from './skill.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useSkills = params => useQuery([QUERY_KEY_FACTORY('SKILL').list(params)], () => getSkills(params));

export const useExcelSkills = () =>
  useQuery([QUERY_KEY_FACTORY('SKILL').list('')], () => getSkillsExcel(), {
    enabled: false,
    onSuccess: async data => {
      const url = window.URL.createObjectURL(new Blob([data?.data || []], { type: data.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '커리어멘토스_양식_엑셀 스킬 다운로드.xlsx');
      document.body.appendChild(link);
      link.click();
    },
    onError: error => {
      alert('다운로드에 실패했습니다.');
    },
  });
