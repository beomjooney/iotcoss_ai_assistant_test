import { axiosGeneralAPI } from '../index';

// 커뮤니티 인기 목록 조회
export const popularPostList = async () => {
  const { data } = await axiosGeneralAPI().get(`/popular-posts/`);
  return data || [];
};

// 커뮤니티 인기 키워드 조회
export const popularKeyWorldList = async () => {
  const { data } = await axiosGeneralAPI().get(`/popular/keywords`);
  return data.popularKeywords || [];
};

// 커뮤니티 멘토 조회
export const popularMentoList = async () => {
  const { data } = await axiosGeneralAPI().get(`/popular/mentors`);
  return data || [];
};

// 커뮤니티 목록 조회
export const communityList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/posts', { params });
  // console.log(headers);
  const nextCursor = Number(headers['after-cursor']);
  // console.log(data);
  // console.log('nextCursor : ', data, nextCursor);
  // return { data: data || [] };
  return { data: data || [], nextCursor };
};

// 댓글 조회
export const repliesList = async (postNo: number) => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/answers/${postNo}/replies`);
  return { data: data || [] };
};

// 인기 포스터 조회
export const popularPostSearchList = async (postNo: number) => {
  const { data } = await axiosGeneralAPI().get(`/posts/${postNo}`);
  return { data: data || [] };
};

export const saveLiked = async (postNo: number) => await axiosGeneralAPI().post(`/api/v1/favorite/clubs/${postNo}`);
export const deleteLiked = async (postId: number) => await axiosGeneralAPI().delete(`/api/v1/favorite/clubs/${postId}`);

export const saveQuizLiked = async (postNo: number) =>
  await axiosGeneralAPI().post(`/api/v1/club/quiz/answers/${postNo}/like`);

export const deleteQuizLiked = async (postNo: number) =>
  await axiosGeneralAPI().delete(`/api/v1/club/quiz/answers/${postNo}/like`);

export const saveQuizOnePick = async (postNo: number) =>
  await axiosGeneralAPI().post(`/api/v1/club/quiz/answers/${postNo}/onepick`);

export const deleteQuizOnePick = async (postNo: number) =>
  await axiosGeneralAPI().delete(`/api/v1/club/quiz/answers/${postNo}/onepick`);

export const saveReply = async (params: any) => {
  const { data } = await axiosGeneralAPI().post(`/api/v1/replies`, params);
  return { data: data || [] };
};
export const saveReReply = async (params: any) => {
  const { data } = await axiosGeneralAPI().post(`/api/v1/re-replies`, params);
  return { data: data || [] };
};
export const answerSave = async (params: any) => {
  const { data } = await axiosGeneralAPI().post(`/api/v1/club/quizzes/preanswer`, params.data);
  return { data: data || [] };
};
export const answerUpdate = async (params: any) => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/club/quizzes/postanswer`, params.data);
  return { data: data || [] };
};
export const comprehensionSave = async (params: any) => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/club/quizzes/comprehension`, params.data);
  return { data: data || [] };
};

export const deleteReply = async (params: any) => {
  await axiosGeneralAPI().delete(`/posts/${params.parentPostNo}/replies/${params.postReplyNo}`);
};

export const deletePost = async (params: any) => {
  await axiosGeneralAPI().delete(`/api/v1/quizzes/${params.postNo}`);
};

// 글쓰기 생성
export const saveCommunity = async (params: any) => await axiosGeneralAPI().post('/posts', params);
// 글쓰기 수정
export const modifyCommunity = async (params: any) => {
  await axiosGeneralAPI().put(`/posts/${params.postNo}`, {
    title: params.title,
    body: params.body,
    keywords: params.keywords,
    relatedJobGroups: params.relatedJobGroups,
    relatedLevels: params.relatedLevels,
  });
};

export const getPost = async (postNo: number) => {
  const { data } = await axiosGeneralAPI().get(`/posts/${postNo}`);
  return data;
};

// export const saveReply = async (postNo: number) => await axiosGeneralAPI().post(`/posts/${postNo}/replies`);
// export const deleteLiked = async (postId: number) => await axiosGeneralAPI().delete(`/posts/${postId}/like`);
