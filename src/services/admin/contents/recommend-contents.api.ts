import { axiosGeneralAPI } from '../../index';

interface RecommendParamsProps {
  recommendLevels: number;
  page: number;
  size: number;
}
export async function getRecommend(args: RecommendParamsProps) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/recommend/contents', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

export const saveContents = async (contentId, body) =>
  await axiosGeneralAPI().put(`/recommend/contents/${contentId}`, body);

export const deleteContents = async contentId => await axiosGeneralAPI().delete(`/recommend/contents/${contentId}`);

export const addContent = async body => await axiosGeneralAPI().post(`/recommend/contents`, body);
