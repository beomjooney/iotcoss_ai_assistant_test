import { axiosGeneralAPI } from '../index';

// 노드 목록 조회
export const pathList = () => {
  return axiosGeneralAPI().get('growth-edges/main/course');
};
