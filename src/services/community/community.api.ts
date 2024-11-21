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
export const repliesList = async params => {
  const { data } = await axiosGeneralAPI().get(
    `/api/v1/clubs/${params.clubSequence}/quizzes/${params.quizSequence}/answers/${params.memberId}/replies`,
  );
  return { data: data || [] };
};

// 인기 포스터 조회
export const popularPostSearchList = async (postNo: number) => {
  const { data } = await axiosGeneralAPI().get(`/posts/${postNo}`);
  return { data: data || [] };
};

export const saveLiked = async (postNo: number) => await axiosGeneralAPI().post(`/api/v1/clubs/${postNo}/favorite`);
export const deleteLiked = async (postId: number) => await axiosGeneralAPI().delete(`/api/v1/clubs/${postId}/favorite`);
export const saveContentLiked = async (postNo: number) =>
  await axiosGeneralAPI().post(`/api/v1/contents/${postNo}/like`);
export const deleteContentLiked = async (postId: number) =>
  await axiosGeneralAPI().delete(`/api/v1/contents/${postId}/like`);

export const saveFavorite = async (postNo: number) => await axiosGeneralAPI().post(`/api/v1/clubs/${postNo}/favorite`);
export const deleteFavorite = async (postId: number) =>
  await axiosGeneralAPI().delete(`/api/v1/clubs/${postId}/favorite`);

export const deleteClub = async (postId: number) => await axiosGeneralAPI().delete(`/api/v1/clubs/${postId}`);

export const saveQuizLiked = async (postNo: number) =>
  await axiosGeneralAPI().post(`/api/v1/club/quiz/answers/${postNo}/like`);

// 댓글 좋아요 삭제
export const deleteQuizLiked = async (postNo: number) =>
  await axiosGeneralAPI().delete(`/api/v1/club/quiz/answers/${postNo}/like`);

//퀴즈 댓글 좋아요
export const saveQuizLikedReply = async (params: any) =>
  await axiosGeneralAPI().post(`/api/v1/clubs/${params.club}/quizzes/${params.quiz}/answers/${params.memberUUID}/like`);

//퀴즈 댓글 좋아요 삭제
export const deleteQuizLikedReply = async (params: any) =>
  await axiosGeneralAPI().delete(
    `/api/v1/clubs/${params.club}/quizzes/${params.quiz}/answers/${params.memberUUID}/like`,
  );

export const saveQuizOnePick = async (params: any) =>
  await axiosGeneralAPI().post(
    `/api/v1/clubs/${params.club}/quizzes/${params.quiz}/answers/${params.memberUUID}/onepick`,
  );

export const deleteQuizOnePick = async (params: any) =>
  await axiosGeneralAPI().delete(
    `/api/v1/clubs/${params.club}/quizzes/${params.quiz}/answers/${params.memberUUID}/onepick`,
  );

export const saveReply = async (params: any) => {
  const { data } = await axiosGeneralAPI().post(`/api/v1/reply`, params);
  return { data: data || [] };
};

export const deleteReply = async (params: any) => {
  // await axiosGeneralAPI().delete(`/posts/${params.parentPostNo}/replies/${params.postReplyNo}`);
  const { data } = await axiosGeneralAPI().delete(`/api/v1/my/replies/${params.answerReplySequence}`, {
    data: params.body,
  });
};

export const saveReReply = async (params: any) => {
  const { data } = await axiosGeneralAPI().post(`/api/v1/replies/${params.clubQuizAnswerReplySequence}/reply`, {
    body: params.body,
  });
  return { data: data || [] };
};
export const answerSave = async (params: any) => {
  const { data } = await axiosGeneralAPI().post(
    `/api/v1/clubs/${params.club}/quizzes/${params.quiz}/preanswer`,
    params.formData,
    {
      headers: { 'content-type': 'multipart/form-data' },
    },
  );
  return { data: data.data || [] };
};
export const answerUpdate = async (params: any) => {
  const { data } = await axiosGeneralAPI().post(
    `/api/v1/clubs/${params.club}/quizzes/${params.quiz}/postanswer`,
    params.formData,
    {
      headers: { 'content-type': 'multipart/form-data' },
    },
  );
  return { data: data.data || [] };
};
export const comprehensionSave = async (params: any) => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/club/quizzes/comprehension`, params.data);
  return { data: data || [] };
};

export const checkAlarm = async (params: any) => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/activity/alarms/${params}/check`);
  return { data: data || [] };
};

export const deletePost = async (params: any) => {
  await axiosGeneralAPI().delete(`/api/v1/quizzes/${params.postNo}`);
};
export const deletePostContent = async (params: any) => {
  await axiosGeneralAPI().delete(`/api/v1/my/contents/${params.contentSequence}`);
};
export const deletePostQuiz = async (params: any) => {
  await axiosGeneralAPI().delete(`/api/v1/my/quizzes/${params.quizSequence}`);
};
export const recoverPostQuiz = async (params: any) => {
  await axiosGeneralAPI().put(`/api/v1/my/quizzes/${params.quizSequence}/restore`);
};
export const hidePostQuiz = async (params: any) => {
  await axiosGeneralAPI().put(`/api/v1/my/quizzes/${params.quizSequence}/hide`);
};
export const publishPostQuiz = async (params: any) => {
  await axiosGeneralAPI().put(`/api/v1/my/quizzes/${params.quizSequence}/open`);
};
export const quizModify = async (params: any) => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/my/quizzes/${params.quizSequence}`, params.quizzes);
  return { data: data || [] };
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

//나의 댓글 삭제
export const myReplyDelete = async (params: any) => {
  console.log(params);
  // await axiosGeneralAPI().delete(`/posts/${params.parentPostNo}/replies/${params.postReplyNo}`);
  const { data } = await axiosGeneralAPI().delete(`/api/v1/my/replies/${params.answerReplySequence}`, {
    body: params.body,
  });
};

export const myReplyUpdate = async (params: any) => {
  console.log(params);
  // await axiosGeneralAPI().delete(`/posts/${params.parentPostNo}/replies/${params.postReplyNo}`);
  const { data } = await axiosGeneralAPI().put(`/api/v1/my/replies/${params.answerReplySequence}`, {
    body: params.body,
  });
};

export const deleteReReply = async (params: any) => {
  // await axiosGeneralAPI().delete(`/posts/${params.parentPostNo}/replies/${params.postReplyNo}`);
  const { data } = await axiosGeneralAPI().delete(`/api/v1/my/replies/${params.answerReplySequence}`, {
    data: params.body,
  });
};

export const myReReplyUpdate = async (params: any) => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/my/replies/${params.answerReplySequence}`, {
    body: params.body,
  });
};

export const clubJoin = async (params: any) => {
  const { data } = await axiosGeneralAPI().post(`/api/v1/clubs/${params.clubSequence}/join`, {
    participationCode: params.participationCode,
  });
};

export const clubCancel = async (params: any) => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/clubs/${params.clubSequence}/join/cancel`);
};
