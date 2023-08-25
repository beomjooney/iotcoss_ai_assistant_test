import { axiosGeneralAPI } from '../index';

// 직무 조회
export async function getJobs() {
  const { data } = await axiosGeneralAPI().get('/api/v1/quizzes');
  return data;
}

// 직무 조회
export const getMyJobs = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/quizzes/me', { params });
  return data;
};
