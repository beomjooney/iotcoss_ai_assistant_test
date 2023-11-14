import { axiosGeneralAPI } from '../../index';

export async function authCheck() {
  return await axiosGeneralAPI().get('');
}

// 목록 조회
export async function getQuizs(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('api/admin/v1/quizzes', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 상세 조회
export async function getQuizInfo(quizId: string) {
  const { data } = await axiosGeneralAPI().get(`/api/admin/v1/quizzes/${quizId}`);
  return data;
}

// 수정
export const saveQuiz = async (quizId: string, body) => await axiosGeneralAPI().put(`/api/internal/v1/members`, body);

// 삭제
export const deleteQuiz = async quizId => await axiosGeneralAPI().delete(`/api/internal/v1/members`);
