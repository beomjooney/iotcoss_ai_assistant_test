import { axiosGeneralAPI } from '../../index';

export async function authCheck() {
  return await axiosGeneralAPI().get('');
}

export async function getMembers(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/admin/v1/members', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 회원 정보 조회
export async function getMemberInfo(memberId: string) {
  const { data } = await axiosGeneralAPI().get(`/api/admin/v1/members/${memberId}`);
  return data;
}

// 회원 정보 수정
export const saveMember = async (memberId: string, body) =>
  await axiosGeneralAPI().put(`/api/internal/v1/members`, body);

// 회원 정보 삭제
export const deleteMember = async memberId => await axiosGeneralAPI().delete(`/api/internal/v1/members/${memberId}`);
