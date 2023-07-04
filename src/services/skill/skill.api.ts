import { axiosGeneralAPI } from '../index';

export const skillList = async () => {
  const { data } = await axiosGeneralAPI().get('/skills');
  return data;
};

export const mySkillList = async memberId => {
  const { data } = await axiosGeneralAPI().get(`/members/${memberId}/skills`);
  return data?.experiences;
};
