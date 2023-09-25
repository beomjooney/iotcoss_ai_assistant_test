import { axiosGeneralAPI } from '../index';

// 직무 조회
export async function getJobs() {
  const { data } = await axiosGeneralAPI().get('/jobs');
  return data;
}

// 직무 조회
export const getQuizList = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/quizzes', { params });
  return data.data;
};

// 직무 조회
export const getMyQuiz = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/quizzes/me', { params });
  return data.data;
};
// 직무 조회
export const getMyQuizReply = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/replies/me', { params });
  return data.data;
};
