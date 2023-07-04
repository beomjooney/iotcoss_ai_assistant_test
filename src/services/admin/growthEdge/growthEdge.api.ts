import { axiosGeneralAPI } from '../../index';

export async function getEdgeList(args) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/growth-edges', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

export const getDetailGrowthEdge = async edgeId => await axiosGeneralAPI().get(`/growth-edges/${edgeId}`);

export const saveGrowthEdge = async (edgeId, body) => await axiosGeneralAPI().put(`/growth-edges/${edgeId}`, body);

export const deleteGrowthEdge = async edgeId => await axiosGeneralAPI().delete(`/growth-edges/${edgeId}`);

export const addGrowthEdge = async body => await axiosGeneralAPI().post(`/growth-edges`, body);
