import { axiosGeneralAPI } from '../index';

export async function authCheck() {
  return await axiosGeneralAPI().get('');
}

export async function getClubs(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/clubs', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 조회
export async function getClubInfo(memberId: string) {
  //   const { data } = await axiosGeneralAPI().get(`/api/internal/v1/members/${memberId}`);
  //   return data;
  return null;
}

// 수정
export const saveClub = async (memberId: string, body) =>
  //await axiosGeneralAPI().put(`/api/internal/v1/members`, body);
  await null;

// 삭제
export const deleteClub = async memberId => await axiosGeneralAPI().delete(``);
