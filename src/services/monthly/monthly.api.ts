import { axiosGeneralAPI } from '../index';

interface CamenityProps {
  page: number;
  size: number;
}

// 이달의 메이커, 퀴즈, 클럽 조회
export const getMonthlyRanking = async () => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/monthly/ranking`);
  return data.data;
};

// 이달의 퀴즈 랭킹 목록 조회
export const getMonthlyQuizzes = async () => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/monthly/quizzes`);
  return data.data;
};

// 이달의 메이커 랭킹 목록 조회
export const getMonthlyMaker = async () => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/monthly/maker`);
  return data.data;
};

// 이달의 메이커 퀴즈 목록 조회
export const getMonthlyMakerQuizzes = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/monthly/maker/quizzes', { params });
  return { data: data };
};

// 이달의 클럽 랭킹 목록 조회
export const getMonthlyClubs = async () => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/monthly/clubs`);
  return data.data;
};

// 퀴즈 관련 모든 응답 조회
export const getQuizzesAnswers = async (quizSequence: number) => {
  console.log(quizSequence);

  const { data } = await axiosGeneralAPI().get(`/api/v1/quizzes/${quizSequence}/answers`);
  return { data: data || [] };
};

export async function getCamenities(args: CamenityProps) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/posts', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}
