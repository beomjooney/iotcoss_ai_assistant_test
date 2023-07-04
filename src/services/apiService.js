import ApiConfig from '../config/api-config';
import { apiClient, reqResApiClient } from './apiClient';

const getArticles = () => {
  return apiClient.get(ApiConfig.ARTICLES);
};

const getNodes = () => {
  return apiClient.get(ApiConfig.NODES);
};

const getEdges = () => {
  return apiClient.get(ApiConfig.EDGES);
};

const getProfile = pathId => {
  // const [_, pathId] = 'e5/path';
  // const [_, pathId] = queryKey;
  console.log('Api Service Edge query Key : ', pathId.queryKey[1]);
  // return apiClient.get(`/growth-edges/${pathId.queryKey[1]}/path`);
  return apiClient.get(`/growth-edges/sw_develop_edge_4/path`);
};

const getNodeProfile = nodeId => {
  console.log('Api Service Node query Key : ', nodeId.queryKey[1]);
  return apiClient.get(`/growth-nodes/${nodeId.queryKey[1]}/capabilities`);
  // return apiClient.get(`/growth-nodes/sw_develop_node_5/capabilities`);
};

const getInfo = () => {
  return apiClient.get(ApiConfig.INFO);
};

const getReqResUsers = () => {
  return reqResApiClient.get(ApiConfig.REQ_RES_USERS);
};

const getPath = () => {
  return apiClient.get(ApiConfig.PATH);
};

const getTalkList = () => {
  return apiClient.get(ApiConfig.TALK_LIST);
};

const postConnect = data => {
  return apiClient.post(ApiConfig.EDGE_EVENT, data);
};

const getSkillList = () => {
  return apiClient.get(ApiConfig.SKILL_LIST);
};

const getExperienceList = () => {
  return apiClient.get(ApiConfig.EXPERIENCE_LIST);
};

export {
  getArticles,
  getReqResUsers,
  getNodes,
  getEdges,
  getProfile,
  getInfo,
  getPath,
  postConnect,
  getTalkList,
  getSkillList,
  getExperienceList,
  getNodeProfile,
};
