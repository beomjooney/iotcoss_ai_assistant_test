import { axiosGeneralAPI } from '../index';

interface CamenityProps {
  page: number;
  size: number;
}
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
export const savePost = async body => await axiosGeneralAPI().post(`/api/v1/quizzes`, body);
export const saveClubQuizPost = async body => await axiosGeneralAPI().post(`/api/v1/clubs`, body);

export const deletePost = async postNo => await axiosGeneralAPI().delete(`/posts/${postNo}`);

export const addPosts = async body => await axiosGeneralAPI().post(`/posts`, body);

export const saveReply = async body =>
  await axiosGeneralAPI().put(`/posts/${body.parentPostNo}/${body.postReplyNo}`, body);

export const deleteReply = async body =>
  await axiosGeneralAPI().delete(`/posts/${body.parentPostNo}/${body.postReplyNo}`);

// 세미나 상세 조회
export const quizSolutionDetail = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/club/quizzes/${id}`);
  return data.data;
};

// 세미나 상세 조회
export const clubDetailQuizList = async params => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${params.id}/quizzes/my-answers`, { params });
  return data.data;
};

export async function getReplies(args: CamenityProps) {
  let params = JSON.parse(JSON.stringify(args));
  let postNo = params.postNo;
  delete params['postNo'];
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get(`/posts/${postNo}`);
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}
