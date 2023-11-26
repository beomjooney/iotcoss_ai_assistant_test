import { axiosGeneralAPI } from '../../index';

export async function authCheck() {
  return await axiosGeneralAPI().get('');
}

// 목록 조회
export async function getTerms(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/admin/v1/terms', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 상세 조회
export async function getTermInfo(sequence: string) {
  const { data } = await axiosGeneralAPI().get(`/api/admin/v1/terms/${sequence}`);
  return data;
}

// 수정
export const saveTerm = async (sequence: string, body) =>
  await axiosGeneralAPI().put(`/api/admin/v1/terms/${sequence}`, body);

// 등록
export const addTerm = async (params: any) => await axiosGeneralAPI().post('/api/admin/v1/terms', params);

// 삭제
export const deleteTerm = async quizId => await axiosGeneralAPI().delete(`/api/admin/v1/terms/`);
