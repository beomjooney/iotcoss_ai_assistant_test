import { axiosGeneralAPI } from '../index';

// 직무 조회
export async function getJobs() {
  const { data } = await axiosGeneralAPI().get('/jobs');
  return data;
}
