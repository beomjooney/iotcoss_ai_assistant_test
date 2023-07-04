import { axiosGeneralAPI } from '../index';

// 노드 목록 조회
export const nodeList = () => {
  return axiosGeneralAPI().get('/navigation/growth-nodes');
};

export const nodeInfoList = nodeId => {
  return axiosGeneralAPI().get(`/growth-nodes/${nodeId}/capabilities`);
  // return axiosGeneralAPI().get(`/growth-nodes/sw_develop_node_5/capabilities`);
};
