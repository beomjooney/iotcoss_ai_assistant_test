import { axiosGeneralAPI } from '../index';

// 노드 목록 조회
export const edgeList = () => {
  return axiosGeneralAPI().get('/navigation/growth-edges');
};

export const edgeInfoList = pathId => {
  return axiosGeneralAPI().get(`/growth-edges/${pathId}/path`);
  // return axiosGeneralAPI().get(`/growth-edges/sw_develop_edge_4`);
};
