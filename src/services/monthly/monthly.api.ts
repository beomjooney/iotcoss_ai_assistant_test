import { axiosGeneralAPI } from '../index';

interface CamenityProps {
  page: number;
  size: number;
}

// 이달의 메이커, 퀴즈, 클럽 조회
export const monthlyRanking = async () => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/monthly/ranking`);
  return data.data;
};

// 이달의 퀴즈 랭킹 목록 조회
export const monthlyQuizzes = async () => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/monthly/quizzes`);
  return data.data;
};

// 이달의 메이커 랭킹 목록 조회
export const monthlyMaker = async () => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/monthly/maker`);
  return data.data;
};

// 이달의 메이커 퀴즈 목록 조회
export const monthlyMakerQuizzes = async () => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/monthly/maker/quizzes`);
  return data.data;
};

// 이달의 클럽 랭킹 목록 조회
export const monthlyClubs = async () => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/monthly/clubs`);
  return data.data;
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
