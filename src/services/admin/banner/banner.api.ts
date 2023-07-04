import { axiosGeneralAPI } from '../../index';

export async function getSeminarBanner() {
  const { data } = await axiosGeneralAPI().get('/banners/seminar');
  return data;
}

export async function addSeminarBanner(params: any[]) {
  const { data } = await axiosGeneralAPI().put('/banners/seminar', params);
  return data;
}
