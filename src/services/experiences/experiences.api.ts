import { axiosGeneralAPI } from '../index';

// 경험 목록 조회
export const experienceList = async () => {
  const { data } = await axiosGeneralAPI().get('/experience');
  return data;
};

// 나의 경험 목록 조회
export const myExperienceList = async memberId => {
  const { data } = await axiosGeneralAPI().get(`/members/${memberId}/experience`);
  return data.experiences;
};
