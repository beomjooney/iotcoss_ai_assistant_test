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
export const saveClubQuizPost = async body => await axiosGeneralAPI().post(`/api/v1/club`, body);
export const saveClubTempPost = async body => await axiosGeneralAPI().post(`/api/v1/club/temporary`, body);

export const deletePost = async postNo => await axiosGeneralAPI().delete(`/posts/${postNo}`);

export const addPosts = async body => await axiosGeneralAPI().post(`/posts`, body);

export const saveReply = async body =>
  await axiosGeneralAPI().put(`/posts/${body.parentPostNo}/${body.postReplyNo}`, body);

export const deleteReply = async body =>
  await axiosGeneralAPI().delete(`/posts/${body.parentPostNo}/${body.postReplyNo}`);

// 퀴즈 순서변경
export const quizOrder = async body => await axiosGeneralAPI().put(`/api/v1/club/quizzes`, body);

// 퀴즈 상세 조회
export const quizSolutionDetail = async (id, clubSequence) => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${clubSequence}/quizzes/${id}/my-status`);
  return data.data;
};

export const quizRoungeInfo = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${id}/quizzes`);
  return data.data;
};

export const quizMyClubInfo = async params => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/my/clubs/${params.clubSequence}/quizzes`, {
    params: {
      page: params.page,
      size: params.size,
      sortType: params.sortType,
    },
  });
  return data.data;
};

export const quizGetProgress = async params => {
  const { data } = await axiosGeneralAPI().get(
    `/api/v1/clubs/${params.club}/quizzes/${params.quiz}/progress`,
    params.data,
  );
  return data.data;
};

export const quizGetAnswer = async params => {
  const { data } = await axiosGeneralAPI().get(
    `/api/v1/clubs/${params.club}/quizzes/${params.quiz}/answers/${params.memberUUID}`,
  );
  return data.data;
};

export const quizFileDownload = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/download/files`, {
    params: {
      fileKeys: id,
    },
  });
  return data;
};
// 라운지 상세 조회
export const quizRoungeDetail = async params => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/club/quizzes/lounge`, { params });
  return data.data;
};

// 퀴즈 상태 조회
export const quizSolutionDetailStatus = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/club/quizzes/${id}/answer/me`);
  return data.data;
};

export const quizRanking = async () => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/monthly/ranking`);
  return data.data;
};

// 나의 친구 조회
export const quizFriends = async () => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/member/friends`);
  return data.data;
};

// 퀴즈 요약
export const quizGrowthDetail = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${id}/growth/summary`);
  return data.data;
};

// 퀴즈 답변
export const quizAnswerDetail = async params => {
  const { data } = await axiosGeneralAPI().get(
    `/api/v1/clubs/${params.club}/quizzes/${params.quiz}/answers-with-replies`,
    params.data,
  );
  return data.data;
};

export const quizAnswerMemberDetail = async params => {
  console.log(params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${params.club}/quizzes/${params.quiz}/member-answers`, {
    params: params.data,
  });
  return data.data;
};

// 알람 히스토리
export const quizAlarmHistory = async params => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/events`, { params });
  return data.data;
};

// 내 퀴즈 답변
export const clubDetailQuizList = async (params, id) => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${id}/quizzes-my-answers`, {
    params,
  });
  return data.data;
};

// 포인트 조회
export async function quizPoint() {
  const { data } = await axiosGeneralAPI().get(`/api/v1/points/histories`);
  return data.data;
}

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
