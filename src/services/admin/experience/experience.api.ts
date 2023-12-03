import { axiosGeneralAPI } from '../../index';

interface SkillParamsProps {
  page: number;
  size: number;
}
export async function getExperience(args: SkillParamsProps) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/experience', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

export const saveExperience = async (serviceId, body) => await axiosGeneralAPI().put(`/experience/${serviceId}`, body);

export const deleteExperience = async serviceId => await axiosGeneralAPI().delete(`/experience/${serviceId}`);

export const addExperience = async body => await axiosGeneralAPI().post(`/experience`, body);

// 목록 조회
export async function getDevusExperiences(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/admin/v1/experiences', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 상세 조회
export async function getDevusExperienceInfo(sequence: string) {
  const { data } = await axiosGeneralAPI().get(`/api/admin/v1/experiences/${sequence}`);
  return data;
}

// 수정
export const saveDevusExperience = async (sequence: string, body) =>
  await axiosGeneralAPI().put(`/api/admin/v1/experiences/${sequence}`, body);

// 등록
export const addDevusExperience = async (params: any) =>
  await axiosGeneralAPI().post('/api/admin/v1/experiences', params);

// 삭제
export const deleteDevusExperience = async quizId => await axiosGeneralAPI().delete(`/api/admin/v1/experiences/`);
