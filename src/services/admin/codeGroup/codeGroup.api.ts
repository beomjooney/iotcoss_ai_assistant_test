import { axiosGeneralAPI } from '../../index';

export async function authCheck() {
  return await axiosGeneralAPI().get('');
}

// 목록 조회
export async function getCodeGroups(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/internal/v1/code/group', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 상세 조회
export async function getCodeGroupInfo(sequence: string) {
  const { data } = await axiosGeneralAPI().get(`/api/internal/v1/code/group/${sequence}`);
  return data;
}

// 수정
export const saveCodeGroup = async (sequence: string, body) =>
  await axiosGeneralAPI().put(`/api/internal/v1/code/${sequence}`, body);

// 등록
export const addCodeGroup = async (params: any) => await axiosGeneralAPI().post('/api/internal/v1/code/', params);

// 삭제
export const deleteCodeGroup = async quizId => await axiosGeneralAPI().delete(`/api/internal/v1/code/group/${quizId}`);
