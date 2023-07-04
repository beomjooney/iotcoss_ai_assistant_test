import { axiosGeneralAPI } from '../../index';

interface RecommendParamsProps {
  recommendLevels: number;
  page: number;
  size: number;
}

export async function getNodeList(args: RecommendParamsProps) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/growth-nodes', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

export const getDetailGrowthNode = async nodeId => await axiosGeneralAPI().get(`/growth-nodes/${nodeId}`);

export const saveGrowthNode = async (nodeId, body) => await axiosGeneralAPI().put(`/growth-nodes/${nodeId}`, body);

export const deleteGrowthNode = async nodeId => await axiosGeneralAPI().delete(`/growth-nodes/${nodeId}`);

export const addGrowthNode = async body => await axiosGeneralAPI().post(`/growth-nodes`, body);
