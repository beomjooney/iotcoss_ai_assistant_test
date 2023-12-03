import { axiosGeneralAPI } from '../../index';

interface SkillParamsProps {
  recommendLevels: number;
  page: number;
  size: number;
}

export const skillList = async () => {
  const { data } = await axiosGeneralAPI().get('/api/v1/skills');
  return data;
};

export async function getSkills(args: SkillParamsProps) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/skills', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

export const saveSkills = async (serviceId, body) => await axiosGeneralAPI().put(`/skills/${serviceId}`, body);

export const deleteSkills = async serviceId => await axiosGeneralAPI().delete(`/skills/${serviceId}`);

export const addSkills = async body => await axiosGeneralAPI().post(`/skills`, body);

export const getSkillsExcel = async () =>
  await axiosGeneralAPI().get(`/skills/excel/download`, { params: { page: 1, size: 5000 }, responseType: 'blob' });

export const updateSkillsExcel = async body =>
  await axiosGeneralAPI().post(`/skills/excel/upload`, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });

// 목록 조회
export async function getDevusSkills(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/admin/v1/skills', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 상세 조회
export async function getDevusSkillInfo(sequence: string) {
  const { data } = await axiosGeneralAPI().get(`/api/admin/v1/skills/${sequence}`);
  return data;
}

// 수정
export const saveDevusSkill = async (sequence: string, body) =>
  await axiosGeneralAPI().put(`/api/admin/v1/skills/${sequence}`, body);

// 등록
export const addDevusSkill = async (params: any) => await axiosGeneralAPI().post('/api/admin/v1/skills', params);

// 삭제
export const deleteDevusSkill = async skillId => await axiosGeneralAPI().delete(`/api/admin/v1/quizzes/${skillId}`);
