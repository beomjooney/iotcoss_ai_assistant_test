import { axiosGeneralAPI } from '../index';

// 직무 조회
export async function getJobs() {
  const { data } = await axiosGeneralAPI().get('/jobs');
  return data;
}

// 퀴즈 조회
export const getQuizList = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/quizzes', { params });
  return data.data;
};

// 내 퀴즈 조회
export const getMyQuiz = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/quizzes/me', { params });
  return data.data;
};
// 내 댓글 조회
export const getMyQuizReply = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/replies/me', { params });
  return data.data;
};

// 퀴즈 댓글 조회
export const getQuizReply = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/replies', { params });
  return data.data;
};
