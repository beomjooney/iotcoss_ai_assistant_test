import Paragraph from 'antd/es/skeleton/Paragraph';
import { axiosGeneralAPI } from '../index';

export async function authCheck() {
  return await axiosGeneralAPI().get('');
}

// refresh token
export async function reissueToken() {
  return await axiosGeneralAPI().get('');
}

// 데이터 불러오기 예제
export async function memberLogin() {
  const { data } = await axiosGeneralAPI().get(`/code/group`);
  return data;
}

// 회원 정보 조회
export async function memberInfo(memberId: string) {
  const { data } = await axiosGeneralAPI().get(`/api/v1/profiles/${memberId}`);
  return data.data;
}

// 회원 정보 조회
export async function personalInfo(memberId: string) {
  const { data } = await axiosGeneralAPI().get(`/api/v1/my/personal`);
  return data.data;
}

// 회원 요약 조회
export async function memberSummaryInfo() {
  const { data } = await axiosGeneralAPI().get(`/api/v1/my/activity/simple`);
  // const { data } = await axiosGeneralAPI().get(`/members/${memberId}`);
  return data.data;
}

// 회원 활동 조회
export async function memberActiveSummaryInfo() {
  const { data } = await axiosGeneralAPI().get(`/api/v1/my/activities`);
  // const { data } = await axiosGeneralAPI().get(`/members/${memberId}`);
  return data.data;
}

// 회원 정보 저장
export const getProfile = async body => await axiosGeneralAPI().get(`/api/v1/profiles/${body}`);

// 회원 정보 저장
export const saveProfile = async body => await axiosGeneralAPI().put(`/api/v1/my/personal`, body);

// 회원 정보 수정
export const editInfo = async (memberId, body) => await axiosGeneralAPI().put(`/members/${memberId}`, body);

// 회원 정보 삭제
export const deleteMember = async memberId => await axiosGeneralAPI().delete(`/members/${memberId}`);

// 서비스 이용 약관 조회
export async function termsInfo(params: any) {
  // const { data } = await axiosGeneralAPI().get(`/api/v1/terms?typeCode=${params.type}`);
  let url;
  if (params.type === '0001') {
    url = '/api/v1/terms/service1';
  } else {
    url = `/api/v1/terms/privacy1`;
  }
  const { data } = await axiosGeneralAPI().get(url);
  return data.data;
}

//login
export async function login(params: any[]) {
  const { data } = await axiosGeneralAPI().post('/oauth2/token', new URLSearchParams(params), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  console.log(data);
  return data;
}

// 회원 등록
export const loginSignUp = async body => await axiosGeneralAPI().post('/api/v1/signup', body);

// 회원 OTP
// export const getIdVerification = async body => {
//   console.log(body);
//   await axiosGeneralAPI().get('/api/v1/member/validate', { body });
// };
export const loginOtp = async body => await axiosGeneralAPI().post('/api/v1/otp', body);

// 회원 OTP
export const loginOtpVerification = async body => {
  const { data } = await axiosGeneralAPI().put('/api/v1/otp/verification', body);
  return data.data;
};

// 회원 OTP
export async function getIdVerification(params: any) {
  const { data } = await axiosGeneralAPI().get('/api/v1/member/validate', { params });
  return data.data;
}

export async function changePhone(params: any) {
  const { data } = await axiosGeneralAPI().put('/api/v1/my/phonenumber', params);
  return data.data;
}

export async function changePassword(params: any) {
  const { data } = await axiosGeneralAPI().put('/api/v1/my/password', params);
  return data.data;
}

export async function userUpdate(params: any) {
  const { data } = await axiosGeneralAPI().put('/api/v1/my/personal', params);
  return data.data;
}
