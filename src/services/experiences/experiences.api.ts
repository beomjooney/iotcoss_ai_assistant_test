import { axiosGeneralAPI } from '../index';

interface ExperienceParamsProps {
  recommendLevels: number;
  page: number;
  size: number;
}

// 경험 목록 조회
export const experienceList = async () => {
  const { data } = await axiosGeneralAPI().get('/api/v1/experiences');
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

// 목록 조회
export async function getDevusExperiences(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/api/admin/v1/experiences', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

// 상세 조회
export async function getDevusExperienceInfo(sequence: string) {
  const { data } = await axiosGeneralAPI().get(`/api/admin/v1/experiences/${sequence}`);
  return data;
}

// 수정
export const saveDevusExperience = async (sequence: string, body) =>
  await axiosGeneralAPI().put(`/api/admin/v1/experiences/${sequence}`, body);

// 등록
export const addDevusExperience = async (params: any) =>
  await axiosGeneralAPI().post('/api/admin/v1/experiences', params);

// 삭제
export const deleteDevusExperience = async experienceId =>
  await axiosGeneralAPI().delete(`/api/admin/v1/experiences/${experienceId}`);
