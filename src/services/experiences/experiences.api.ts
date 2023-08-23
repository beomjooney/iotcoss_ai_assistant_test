import { axiosGeneralAPI } from '../index';

// 경험 목록 조회
export const experienceList = async () => {
  const { data } = await axiosGeneralAPI().get('/api/v1/experiences');
  return data;
};

// 나의 경험 목록 조회
export const myExperienceList = async memberId => {
  const { data } = await axiosGeneralAPI().get(`/members/${memberId}/experience`);
  return data.experiences;
};
