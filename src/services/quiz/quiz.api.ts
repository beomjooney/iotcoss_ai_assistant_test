import { size } from 'lodash';
import { axiosGeneralAPI } from '../index';

import { v4 as uuidv4 } from 'uuid';

export const generateUUID = () => {
  return uuidv4();
};

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
export const saveContent = async body =>
  await axiosGeneralAPI().post(`/api/v1/content`, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const saveAIQuizPost = async body => {
  const { data } = await axiosGeneralAPI().post(`/api/v1/ai-quizzes`, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.data;
};

export const saveAIQuizAnswer = async body => {
  const { data } = await axiosGeneralAPI().post(`/api/v1/ai-model-answers`, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.data;
};

export const saveAIQuizAnswerFeedback = async body => {
  const { data } = await axiosGeneralAPI().post(`/api/v1/ai-feedback`, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.data;
};

export const saveAIQuizAnswerList = async body => {
  const { data } = await axiosGeneralAPI().put(
    `/api/v1/clubs/${body.clubSequence}/quizzes/${body.quizSequence}/answers/${body.memberUUID}/ai-evaluation`,
  );
  return data.data;
};

export const saveAIQuizAnswerListPut = async body => {
  const { data } = await axiosGeneralAPI().put(
    `/api/v1/clubs/${body.clubSequence}/quizzes/${body.quizSequence}/answers/${body.memberUUID}/grade`,
    { grading: body.grading },
  );
  return data.data;
};
export const saveAIQuizAnswerSavePut = async body => {
  const { data } = await axiosGeneralAPI().put(
    `/api/v1/clubs/${body.quizSaveParams.clubSequence}/quizzes/${body.quizSaveParams.quizSequence}/answers/${body.quizSaveParams.memberUUID}/feedback`,
    body.formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data.data;
};

export const saveAIQuizAnswerEvaluation = async body => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/clubs/${body.club}/quizzes/${body.quiz}/answers-evaluation`);
  return data.data;
};
export const saveClubQuizPost = async body => {
  body.clubForm.clubId = 'quiz_club_' + generateUUID();
  const { data } = await axiosGeneralAPI().post(`/api/v1/club`, body);
  return data;
};

export const saveClubTempPost = async body => {
  // body.clubForm.clubId = 'quiz_club_temporary_' + generateUUID();
  await axiosGeneralAPI().put(`/api/v2/quiz-club/temporary`, body, {
    headers: { 'content-type': 'multipart/form-data' },
  });
  // await axiosGeneralAPI().post(`/api/v1/club/temporary`, body);
};

export const saveLectureTempPost = async body => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/lecture-club/temporary`, body, {
    headers: { 'content-type': 'multipart/form-data' },
  });
  return data;
};

export const saveLecturePost = async body => {
  const { data } = await axiosGeneralAPI().post(`/api/v1/lecture-club`, body, {
    headers: { 'content-type': 'multipart/form-data' },
  });
  return data;
};

export const saveLectureModify = async body => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/lecture-club/${body.id}`, body.formData, {
    headers: { 'content-type': 'multipart/form-data' },
  });
  return data;
};

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
  console.log('params', params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/my/clubs/${params.clubSequence}/quizzes`, {
    params: {
      page: params.page,
      size: params.size,
      sortType: params.sortType,
      isPublished: params.isPublished,
    },
  });
  return data.data;
};

export const lectureQAInfo = async params => {
  console.log('params', params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/club/lecture/questions`, {
    params: {
      clubSequence: params.clubSequence,
      clubStudySequence: params.clubStudySequence,
      page: params.page,
      size: params.size,
      questionStatuses: params.questionStatuses,
    },
  });
  return data.data;
};

export const lectureStudyQAInfo = async params => {
  console.log('params', params);
  const { data } = await axiosGeneralAPI().get(
    `/api/v1/lecture-clubs/${params.clubSequence}/studies/${params.clubStudySequence}`,
  );
  return data.data;
};

export const myAllLectureInfo = async params => {
  console.log('params', params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/lecture-clubs/${params.clubSequence}/studies`, {
    params: {
      page: params.page,
      size: params.size,
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

export const quizGetAIAnswer = async params => {
  const { data } = await axiosGeneralAPI().get(
    `/api/v1/clubs/${params.club}/quizzes/${params.quiz}/answers/${params.memberUUID}/with-ai-feedback`,
  );
  return data.data;
};

export const quizGetAIAnswerGet = async params => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/quizzes/${params.quiz}/ai-answer`);
  return data.data;
};

export const quizGetAIAnswerAll = async params => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${params.club}/quizzes/${params.quiz}/evaluation/status`);
  return data.data;
};

export const quizFileDownload = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/download/files`, {
    params: {
      fileKeys: id,
    },
    responseType: 'blob',
    headers: {
      Accept: '*/*',
      'Content-Type': 'multipart/form-data',
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
export const quizFriends = async params => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/my/friends`, { params });
  return data.data;
};

// 나의 친구 신청 조회
export const quizFriendsRequest = async params => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/my/friend-requests`, { params });
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
    `/api/v1/clubs/${params.club}/quizzes/${params.quiz}/answers`,
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

export const quizAnswerMemberAIDetail = async params => {
  console.log(params);
  const { data } = await axiosGeneralAPI().get(
    `/api/v1/my/clubs/${params.club}/quizzes/${params.quiz}/member-answers`,
    {
      params: {
        page: params.page,
        size: params.size,
        keyword: params.keyword,
      },
    },
  );
  return data.data;
};

// 알람 히스토리
export const quizAlarmHistory = async params => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/activity/alarms`, { params });
  return data.data;
};
export const quizActivityHistory = async params => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/activity/alarms`, { params });
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
