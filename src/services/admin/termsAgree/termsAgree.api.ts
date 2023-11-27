import { axiosGeneralAPI } from '../../index';

export async function authCheck() {
  return await axiosGeneralAPI().get('');
}

// 목록 조회
export async function getTermsAgree(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/admin/v1/terms-agreements', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 상세 조회
export async function getTermsAgreeInfo(sequence: string) {
  const { data } = await axiosGeneralAPI().get(`/api/admin/v1/terms-agreements/${sequence}`);
  return data;
}

// 삭제
export const deleteTermsAgree = async quizId => await axiosGeneralAPI().delete(`/api/admin/v1/terms-agreements/`);
