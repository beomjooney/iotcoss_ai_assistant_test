import { axiosGeneralAPI } from '../index';

// 추천 콘텐츠 목록 조회
export const recommendContentList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/quizzes', { params });
  const totalPage = Number(headers['page-count']);

  return { data: data || [], nextPage: params.page + 1, totalPage };
};
