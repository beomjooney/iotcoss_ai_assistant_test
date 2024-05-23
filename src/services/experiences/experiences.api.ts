import { axiosGeneralAPI } from '../index';

interface ExperienceParamsProps {
  recommendLevels: number;
  page: number;
  size: number;
}

// 경험 목록 조회
export const experienceList = async () => {
  const { data } = await axiosGeneralAPI().get('/api/v1/club/options');
  return data;
};

// 경험 목록 조회 + page
// export async function experienceList(args: ExperienceParamsProps) {
//   let params = JSON.parse(JSON.stringify(args));
//   Object.keys(params).forEach(key => {
//     if (params[key] === null || params[key] === '' || params[key] === undefined) {
//       delete params[key];
//     }
//   });
//   const { data, headers } = await axiosGeneralAPI().get('/api/v1/experiences', { params });
//   const totalPage = Number(headers['page-count']);
//   return { data: data || [], nextPage: params.page + 1, totalPage };
// }

// 나의 경험 목록 조회
export const myExperienceList = async memberId => {
  const { data } = await axiosGeneralAPI().get(`/members/${memberId}/experience`);
  return data.experiences;
};
