import { axiosGeneralAPI } from '../index';

export async function authCheck() {
  return await axiosGeneralAPI().get('');
}

// 클럽 목록 조회
export async function getClubs(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/admin/v1/clubs', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 클럽 상세 조회
export async function getClubInfo(clubSequence: string) {
  const { data } = await axiosGeneralAPI().get(`/api/admin/v1/clubs/${clubSequence}`);
  return data;
}

// 클럽 수정
export const saveClub = async (memberId: string, body) =>
  //await axiosGeneralAPI().put(`/api/internal/v1/members`, body);
  await null;

// 클럽삭제
export const deleteClub = async clubSequence => await axiosGeneralAPI().delete(`/api/manager/v1/clubs/${clubSequence}`);

// 클럽퀴즈 목록 조회
export async function getClubQuizs(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/admin/v1/clubs/quizzes', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 클럽퀴즈 상세 조회
export async function getClubQuizInfo(clubSequence: string) {
  const { data } = await axiosGeneralAPI().get(`/api/admin/v1/clubs/quizzes/${clubSequence}`);
  return data;
}
