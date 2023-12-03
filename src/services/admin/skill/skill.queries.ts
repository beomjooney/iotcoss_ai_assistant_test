import { useQuery } from 'react-query';
import { SkillResponse } from 'src/models/skills';
import { skillList, getSkills, getSkillsExcel, getDevusSkills, getDevusSkillInfo } from './skill.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useSkills = params => useQuery([QUERY_KEY_FACTORY('SKILL').list(params)], () => getSkills(params));

// export const useSkills = (onSuccess?: (data: SkillResponse) => void, onError?: (error: Error) => void) => {
//   return useQuery<SkillResponse, Error>(QUERY_KEY_FACTORY('SKILL').lists(), () => getSkills(), {
//     onSuccess,
//     onError,
//     // refetchOnWindowFocus: false,
//     staleTime: 5 * 60 * 1000, // 5분 유지
//   });
// };

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

export const useDevusSkills = params =>
  useQuery([QUERY_KEY_FACTORY('SKILL').list(params)], () => getDevusSkills(params));

export const useDevusSkill = sequence =>
  useQuery([QUERY_KEY_FACTORY('SKILL').detail(sequence)], () => getDevusSkillInfo(sequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
