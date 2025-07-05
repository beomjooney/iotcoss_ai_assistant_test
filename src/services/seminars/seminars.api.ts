import { axiosGeneralAPI } from '../index';

// lecture 상세 조회
export const clubAboutDetailInfo = async id => {
  if (!id) {
    console.warn('ID is null or undefined, skipping the API call.');
    return null; // 또는 빈 객체 {} 등 원하는 기본값 반환
  }
  const { data } = await axiosGeneralAPI().get(`/api/v2/quiz-clubs/${id}`);
  return data.data;
};
// 세미나 목록 조회
export const clubMyList = async params => {
  const endpoint = params.subtitle === undefined || params.subtitle ? '/api/v1/my/clubs' : '/api/manager/v1/clubs';
  const { data, headers } = await axiosGeneralAPI().get(endpoint, {
    params: {
      page: params.page,
      size: params.size,
      clubType: params.clubType,
      clubViewFilter: params.clubViewFilter,
      keyword: params.keyword,
    },
  });
  // const { data, headers } = await axiosGeneralAPI().get('/seminars', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data.data || [], nextPage: params.page + 1, totalPage };
};

// 세미나 목록 조회
export const lectureMyList = async params => {
  const endpoint = params.subtitle === undefined || params.subtitle ? '/api/v1/my/clubs' : '/api/manager/v1/clubs';
  const { data, headers } = await axiosGeneralAPI().get(endpoint, {
    params: { page: params.page, size: params.size, clubType: params.clubType },
  });
  // const { data, headers } = await axiosGeneralAPI().get('/seminars', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data.data || [], nextPage: params.page + 1, totalPage };
};

export const seminarList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/clubs', { params });
  // const { data, headers } = await axiosGeneralAPI().get('/seminars', { params });
  const totalPage = Number(headers['page-count']);

  return { data: data.data || [], nextPage: params.page + 1, totalPage };
};
export const clubMyCommunityList = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/my/replies', { params });
  // const totalPage = Number(headers['page-count']);

  return { data: data.data };
};

export const clubWaitingList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/my/member-request-clubs', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data.data || [], nextPage: params.page + 1, totalPage };
};
export const clubFavoriteList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/my/favorite/clubs', { params });
  const totalPage = Number(headers['page-count']);

  return { data: data.data || [], nextPage: params.page + 1, totalPage };
};

// 세미나 이미지 목록 조회
export const seminarImageList = async () => {
  const { data } = await axiosGeneralAPI().get('/banners/seminar');
  return data || [];
};

// 클럽 퀴즈 목록 조회
export const clubQuizManage = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${id}/quizzes/me`);
  return data.data;
};

// 클럽 퀴즈 목록 조회
export const myDashboardList = async (params: any) => {
  console.log(params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${params.clubSequence}/dashboard`, {
    params: {
      sortType: params.data.sortType,
    },
  });
  return data.data;
};

// 클럽 퀴즈 목록 조회
export const myLectureDashboardStudentList = async (params: any) => {
  console.log(params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/lecture-clubs/${params.clubSequence}/dashboard/students`, {
    params: {
      orderBy: params.data.sortType,
      page: params.data.page,
      size: params.size,
      sortType: params.data.orderBy,
    },
  });
  return data.data;
};

// 클럽 퀴즈 목록 조회
export const myLectureDashboardChatList = async (params: any) => {
  console.log(params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/llm/ai-playground/reference-questions`, {
    // params: {
    //   orderBy: params.data.sortType,
    //   page: params.data.page,
    //   size: params.size,
    //   sortType: params.data.orderBy,
    // },
  });
  return data.data;
};

// 클럽 퀴즈 목록 조회
export const myDashboardLecture = async (params: any) => {
  console.log(params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/lecture-clubs/${params.clubSequence}/dashboard/studies`, {
    params: {
      orderBy: params.data.orderBy,
      page: params.data.page,
      size: params.size,
      sortType: params.data.sortType,
    },
  });
  return data.data;
};

// 클럽 퀴즈 목록 조회
export const myDashboardQA = async (params: any) => {
  const { data } = await axiosGeneralAPI().get(
    `/api/v1/lecture-clubs/${params.clubSequence}/dashboard/${params.sequence}/questions`,
    {
      params: {
        page: params.data.questionPage,
        size: params.size,
      },
    },
  );
  return data.data;
};

// 클럽 퀴즈 목록 조회
export const myExcel = async (params: any) => {
  const { data } = await axiosGeneralAPI().get(
    `/api/v1/clubs/${params.clubSequence}/studies/${params.sequence}/questions/download`,
    {
      responseType: 'blob',
      headers: {
        Accept: '*/*',
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
};

// 클럽 퀴즈 목록 조회
export const myAllClubExcel = async (params: any) => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${params.clubSequence}/questions/download`, {
    responseType: 'blob',
    headers: {
      Accept: '*/*',
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// 클럽 퀴즈 목록 조회
export const myDashboardStudentQA = async (params: any) => {
  console.log(params);
  const { data } = await axiosGeneralAPI().get(
    `/api/v1/lecture-clubs/${params.clubSequence}/members/${params.memberUUID}/questions`,
    {
      params: {
        page: params.data.studentQuestionPage,
        size: params.size,
      },
    },
  );
  return data.data;
};

// 클럽 퀴즈 목록 조회
export const myLectureDashboardList = async (params: any) => {
  console.log(params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/lecture-clubs/${params.clubSequence}/dashboard`, {});
  return data.data;
};

// 클럽 퀴즈 목록 조회
export const myLectureChatList = async (params: any) => {
  // Remove properties with null values
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null));

  const { data } = await axiosGeneralAPI().get(`/api/v1/llm/instructor/ai-assistant/messages`, {
    params: filteredParams,
  });
  return data.data;
};

export const myLectureContentList = async (params: any) => {
  // Remove properties with null values
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null));

  const { data } = await axiosGeneralAPI().get(`/api/v1/llm/instructor/ai-assistant/message-contents`, {
    params: filteredParams,
  });
  return data.data;
};

// 내 회원 목록 조회
export const myMemberRequestList = async (params: any) => {
  console.log(params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/my/clubs/${params.clubSequence}/member-requests`, {
    params: {
      page: params.page,
      size: params.size,
    },
  });
  return data.data;
};

// 내 회원 목록 조회
export const professorRequestList = async (params: any) => {
  console.log(params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${params.clubSequence}/instructors`, {
    params: {
      page: params.page,
      size: params.size,
      clubMemberSortType: params.sortType,
      keyword: params.keyword,
      isInstructorRole: true,
    },
  });
  return data.data;
};

// 내 회원 목록 조회
export const myMemberList = async (params: any) => {
  console.log(params);
  const { data } = await axiosGeneralAPI().get(`/api/v1/my/clubs/${params.clubSequence}/members`, {
    params: {
      page: params.page,
      size: params.size,
      clubMemberSortType: params.sortType,
      keyword: params.keyword,
    },
  });
  return data.data;
};

// 클럽 크루 목록 조회
export const clubQuizCrewManage = async (params: any) => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/club/members/me`, { params });
  return data.data;
};

// 세미나 상세 조회
export const seminarDetail = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${id}/my-progress`);
  return data.data;
};

// 초대 조회
export const guestTenant = async domain => {
  const { data } = await axiosGeneralAPI().get(`/guest/tenants/${domain}`);
  return data.data;
};

// club 상세 조회
export const clubAboutDetail = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${id}/about`);
  return data.data;
};

// lecture 상세 조회
export const lectureAboutDetail = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/lecture-club/${id}`);
  return data.data;
};

// lecture 상세 조회
export const lectureAboutDetailInfo = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/lecture-club/${id}/about`);
  return data.data;
};

// lecture 상세 조회
export const lectureEvaluation = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/lecture-clubs/${id}/evaluation/status`);
  return data.data;
};

// 강의클럽 질문 답변
export const saveAnswer = async (params: any) =>
  await axiosGeneralAPI().put(
    `/api/v1/lecture-clubs/${params.clubSequence}/studies/${params.clubStudySequence}/questions/${params.lectureQuestionSerialNumber}/instructor-answer`,
    {
      answer: params.answer,
    },
  );

export const chatQuery = async (params: any) => {
  // Remove properties with null values
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null));

  const { data } = await axiosGeneralAPI().post(`/api/v1/llm/ai-playground/query`, filteredParams);
  return data.data;
};

// 강의클럽 질문 삭제
export const deleteQuestion = async (params: any) =>
  await axiosGeneralAPI().delete(`/api/v1/delete-club-question/member-club`, {
    params,
  });

// 세미나 생성
export const saveSeminar = async (params: any) => await axiosGeneralAPI().post('/seminars', params);

// 세미나 개설 신청
export const openSeminar = async (params: any) =>
  await axiosGeneralAPI().post(`/seminars/${params.mentorId}/establishment`, {
    memberId: params.memberId,
    mentorId: params.mentorId,
    seminarEstablishmentType: '0001',
    establishmentRegistStatus: '0001',
  });

// 세미나 앵콜 신청
export const encoreSeminar = async (params: any) =>
  await axiosGeneralAPI().post(`/seminars/${params.seminarId}/establishment`, {
    memberId: params.memberId,
    mentorId: params.mentorId,
    seminarEstablishmentType: '0002',
    establishmentRegistStatus: '0001',
  });

// 세미나 참가
export const participantSeminar = async (params: any) =>
  await axiosGeneralAPI().post(`/api/v1/club/crew-requests`, params);

// 세미나 취소
export const participantCancelSeminar = async (params: any) =>
  await axiosGeneralAPI().delete(`/seminars/${params.seminarId}/participants/${params.memberId}`);

// 세미나 참여 승인/승인취소
export const participantApplySeminar = async (params: any) =>
  await axiosGeneralAPI().put(`/seminars/${params.seminarId}/participants/${params.memberId}`, params);

// 세미나 참가자 전체 조회
export const seminarParticipantList = async id => {
  const { data } = await axiosGeneralAPI().get(`/seminars/${id}/participants`);
  return data || [];
};

// 나의 참여 세미나 조회
export const mySeminarList = async params => {
  const { data } = await axiosGeneralAPI().get('/my/seminars/participant', { params });
  return data || [];
};

// 세미나 수정
export const updateSeminar = async (params: any) =>
  await axiosGeneralAPI().put(`/seminars/${params.seminarId}`, params);

// 세미나 삭제
export const deleteSeminar = async (seminarId: string) => await axiosGeneralAPI().delete(`/seminars/${seminarId}`);
