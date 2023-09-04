import { axiosGeneralAPI } from '../index';

// 직무 조회
export const getQuizList = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/quizzes', { params });
  return data.data;
};

// 직무 조회
export const getMyJobs = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/quizzes/me', { params });
  return data.data;
};
