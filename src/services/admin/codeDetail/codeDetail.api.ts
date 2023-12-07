import { axiosGeneralAPI } from '../../index';

export async function authCheck() {
  return await axiosGeneralAPI().get('');
}

// 목록 조회
export async function getCodeDetails(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/internal/v1/code/group/details', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 상세 조회
export async function getCodeDetailInfo(sequence: string) {
  const { data } = await axiosGeneralAPI().get(`/api/internal/v1/code/group/detail${sequence}`);
  return data;
}

// 수정
export const saveCodeDetail = async (sequence: string, body) =>
  await axiosGeneralAPI().put(`/api/internal/v1/code/group/detail${sequence}`, body);

// 등록
export const addCodeDetail = async (params: any) =>
  await axiosGeneralAPI().post('/api/internal/v1/code/group/detail', params);

// 삭제
export const deleteCodeDetail = async quizId =>
  await axiosGeneralAPI().delete(`/api/internal/v1/code/group/detail${quizId}`);

/*
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
 */
