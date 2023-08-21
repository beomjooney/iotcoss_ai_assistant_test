import { axiosGeneralAPI } from '../index';

// 회원별 멘토 목록 조회
export const myMentorList = async memberId => {
  const { data } = await axiosGeneralAPI().get(`/members/${memberId}/mentors`);
  return data;
};

// 멘토 전체 목록 조회
export const mentorList = async () => {
  const { data } = await axiosGeneralAPI().get(`/mentors`);
  return data;
};

// 멘토 전체 목록 검색 조건
export const getMentorList = async (params: any) => {
  const payload = Object.entries(params)
    .map(k => k.join('='))
    .join('&');

  const { data, headers } = await axiosGeneralAPI().get(`/mentors?${payload}`);
  const totalCount = Number(headers['total-count']);
  const totalPage = Number(headers['page-count']);

  return { data: data || [], nextPage: params.page + 1, totalCount, totalPage };
};

// 추천 멘토 전체 조회
export const recommendMentors = async (params: any) => {
  const memberId = params.memberId;
  delete params.memberId;

  const payload = Object.entries(params)
    .map(k => k.join('='))
    .join('&');

  const { data, headers } = await axiosGeneralAPI().get(`/members/${memberId}/recommend-mentors?${payload}`);
  const totalCount = Number(headers['total-count']);
  const totalPage = Number(headers['page-count']);

  return { data: data || [], nextPage: params.page + 1, totalCount, totalPage };
};

export const saveMentor = async (params: any) => await axiosGeneralAPI().post(`/mentoring?type=${params.type}`, params);
export const approveMentor = async (params: any) => await axiosGeneralAPI().put(`/mentors/${params.memberId}`, params);

export const saveGrowthStory = async (params: any) => {
  await axiosGeneralAPI().put(`/mentoring/${params.memberId}`, params);
};

export const getMentor = async (mentorId: string) => {
  const { data } = await axiosGeneralAPI().get(`/api/v1/members/profile`);
  return data;
};
// export const getMentor = async (mentorId: string) => {
//   const { data } = await axiosGeneralAPI().get(`/mentoring/${mentorId}`);
//   return data;
// };

export const getMentorUri = async (mentorId: string) => {
  const { data } = await axiosGeneralAPI().get(`/mentoring/uri/${mentorId}`);
  return data;
};

// 멘토 상세 조회
export const getMentorProfile = async (mentorId: string) => {
  const { data } = await axiosGeneralAPI().get(`/mentors/${mentorId}`);
  return data;
};
