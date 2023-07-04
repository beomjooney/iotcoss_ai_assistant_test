import { axiosGeneralAPI } from '../../index';

interface RecommendParamsProps {
  recommendLevels: number;
  page: number;
  size: number;
}
export async function getRecommedService(args: RecommendParamsProps) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/recommend/service', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

export const saveRecommendService = async (serviceId, body) =>
  await axiosGeneralAPI().put(`/recommend/service/${serviceId}`, body);

export const deleteRecommendService = async serviceId =>
  await axiosGeneralAPI().delete(`/recommend/service/${serviceId}`);

export const addRecommendService = async body => await axiosGeneralAPI().post(`/recommend/service`, body);
