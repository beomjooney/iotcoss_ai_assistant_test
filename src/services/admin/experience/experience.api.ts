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
