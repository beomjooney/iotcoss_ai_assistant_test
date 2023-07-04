import { axiosGeneralAPI } from '../../index';

interface SkillParamsProps {
  recommendLevels: number;
  page: number;
  size: number;
}
export async function getSkills(args: SkillParamsProps) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/skills', { params });
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
