import { axiosGeneralAPI } from '../../index';

export async function authCheck() {
  return await axiosGeneralAPI().get('');
}

// 목록 조회
export async function getPoints(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/admin/v1/points-histories', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 상세 조회
export async function getPointInfo(sequence: string) {
  const { data } = await axiosGeneralAPI().get(`/api/admin/v1/points-histories/${sequence}`);
  return data;
}
