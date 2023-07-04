import { axiosGeneralAPI } from '../index';

// 상세코드 리스트 조회
export const codeDetailList = async groupId => {
  if (groupId) {
    const { data } = await axiosGeneralAPI().get(`/code/group/${groupId}/details`);
    return data;
  } else {
    const { data } = await axiosGeneralAPI().get(`/code/group`);
    return data;
  }
};

export const getCodeList = async params => {
  const { data } = await axiosGeneralAPI().get(`/code/group`, params);
  return data;
};

export const saveCodeList = async (id, body) => await axiosGeneralAPI().put(`/code/group/${id}`, body);

export const deleteCodeList = async id => await axiosGeneralAPI().delete(`/code/group/${id}`);

export const saveDetailCode = async (id, groupId, body) =>
  await axiosGeneralAPI().put(`/code/group/${groupId}/details/${id}`, body);

export const deleteDetailCode = async (id, groupId) =>
  await axiosGeneralAPI().delete(`/code/group/${groupId}/details/${id}`);

export const addDetailCode = async (groupId, body) =>
  await axiosGeneralAPI().post(`/code/group/${groupId}/details`, body);

export const addCode = async body => await axiosGeneralAPI().post(`/code/group`, body);
