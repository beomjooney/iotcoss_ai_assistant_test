import { axiosGeneralAPI } from '../../index';

export async function getMentors(params: any) {
  const { data, headers } = await axiosGeneralAPI().get('/mentors', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

export async function mentorApprove(params: any) {
  const { data } = await axiosGeneralAPI().put(`/mentors/${params.mentorId}`, { type: params.type });
  return data;
}

export async function mentorReject(params: any) {
  const { data } = await axiosGeneralAPI().put(`/mentors/${params.mentorId}`, { type: params.type });
  return data;
}

export async function mentorCertification(params: any) {
  const { data } = await axiosGeneralAPI().put(`/mentors/${params.mentorId}/authentication`, { authenticatedYn: true });
  return data;
}

export async function deleteMentoring(mentorId: string) {
  const { data } = await axiosGeneralAPI().delete(`/mentoring/${mentorId}`);
  return data;
}
