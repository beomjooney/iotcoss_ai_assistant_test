import { axiosGeneralAPI } from '../index';

// 세미나 목록 조회
export const clubMyList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/clubs/me', { params });
  // const { data, headers } = await axiosGeneralAPI().get('/seminars', { params });
  const totalPage = Number(headers['page-count']);

  return { data: data.data || [], nextPage: params.page + 1, totalPage };
};

export const studyRoomList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/study/clubs', { params });
  return { data: data.data || [] };
};

export const studyProgress = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/study/progresses', { params });
  return { data: data.data || [] };
};

export const studyReminder = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/study/reminder', { params });
  return { data: data.data || [] };
};

export const studyQuizList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/study/completed-quizzes', { params });
  return { data: data.data || [] };
};

export const studyQuizBadgeList = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/my/badges', { params });
  return { data: data.data };
};

export const studyQuizOpponentBadgeList = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/badges', { params });
  return { data: data.data };
};

export const studyQuizMemberList = async params => {
  const { data } = await axiosGeneralAPI().get('/api/manager/v1/members', { params });
  return { data: data.data };
};

export const studyQuizRoleMemberList = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/members/instructor/authority/requests', { params });
  return { data: data.data };
};

export const studyQuizCalendarList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/study/calendar', { params });
  return data.data;
};
export const seminarMeWaitList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/club/crew-requests/me', { params });
  const totalPage = Number(headers['page-count']);

  return { data: data.data || [], nextPage: params.page + 1, totalPage };
};

export const seminarMeList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/club/crew-requests/me', { params });
  const totalPage = Number(headers['page-count']);

  return { data: data.data || [], nextPage: params.page + 1, totalPage };
};
export const seminarMeFavoriteList = async params => {
  const { data, headers } = await axiosGeneralAPI().get('/api/v1/favorite/clubs/me', { params });
  const totalPage = Number(headers['page-count']);

  return { data: data.data || [], nextPage: params.page + 1, totalPage };
};

// 세미나 이미지 목록 조회
export const seminarImageList = async () => {
  const { data } = await axiosGeneralAPI().get('/banners/seminar');
  return data || [];
};

// 세미나 상세 조회
export const clubQuizManage = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/${id}/quizzes/me`);
  return data.data;
};

// 세미나 상세 조회
export const seminarDetail = async id => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/clubs/detail/${id}`);
  return data.data;
};

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
