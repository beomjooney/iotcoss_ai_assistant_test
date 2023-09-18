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
  const { data } = await axiosGeneralAPI().get(`/posts/${postNo}/replies`);
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
  await axiosGeneralAPI().post(`/api/v1/club/quizzes/${postNo}/like`);
export const deleteQuizLiked = async (postId: number) =>
  await axiosGeneralAPI().delete(`/api/v1/club/quizzes/${postNo}/like`);

export const saveReply = async (params: any) => {
  console.log('saveReply : ', params);
  const { data } = await axiosGeneralAPI().post(`/posts/${params.postNo}/replies`, params.data);
  return { data: data || [] };
};
export const answerSave = async (params: any) => {
  console.log('answerSave : ', params);
  const { data } = await axiosGeneralAPI().post(`/api/v1/club/quizzes/preanswer`, params.data);
  return { data: data || [] };
};
export const comprehensionSave = async (params: any) => {
  console.log('comprehensionSave : ', params);
  const { data } = await axiosGeneralAPI().post(`/api/v1/club/quizzes/comprehension`, params.data);
  return { data: data || [] };
};

export const deleteReply = async (params: any) => {
  console.log('deleteReply : ', params);
  await axiosGeneralAPI().delete(`/posts/${params.parentPostNo}/replies/${params.postReplyNo}`);
};

export const deletePost = async (params: any) => {
  console.log('deletePost : ', params);
  await axiosGeneralAPI().delete(`/api/v1/quizzes/${params.postNo}`);
};

// 글쓰기 생성
export const saveCommunity = async (params: any) => await axiosGeneralAPI().post('/posts', params);
// 글쓰기 수정
export const modifyCommunity = async (params: any) => {
  console.log('modifyCommunity : ', params);
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
