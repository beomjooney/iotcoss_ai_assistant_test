import { axiosGeneralAPI } from '../../index';

// 목록 조회
export async function getBadges(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/admin/v1/badges', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 상세 조회
export async function getBadgeInfo(sequence: string) {
  const { data } = await axiosGeneralAPI().get(`/api/admin/v1/badges/${sequence}`);
  return data;
}

// 수정
export const saveBadge = async (badgeSequence: string, body) =>
  await axiosGeneralAPI().put(`/api/admin/v1/badges/${badgeSequence}`, body);

// 등록
export const addBadge = async (params: any) => await axiosGeneralAPI().post('/api/admin/v1/badges', params);

// 삭제
export const deleteBadge = async skillId => await axiosGeneralAPI().delete(`/api/admin/v1/badges/${skillId}`);
