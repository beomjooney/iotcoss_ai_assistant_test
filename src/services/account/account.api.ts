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
  const { data } = await axiosGeneralAPI().get(`/members/${memberId}`);
  return data;
}

// 회원 정보 수정
export const editInfo = async (memberId, body) => await axiosGeneralAPI().put(`/members/${memberId}`, body);

// 회원 정보 수정
export const deleteMember = async memberId => await axiosGeneralAPI().delete(`/members/${memberId}`);

// 서비스 이용 약관 조회
export async function termsInfo(params: any) {
  const { data } = await axiosGeneralAPI().get(`/terms?type=${params.type}`);
  return data;
}

//login
export async function login(params: any[]) {
  const { data } = await axiosGeneralAPI().post('/oauth2/token', new URLSearchParams(params), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return data;
}

// 회원 등록
export const loginSignUp = async body => await axiosGeneralAPI().post('/members', body);

// 회원 OTP
export const loginOtp = async body => await axiosGeneralAPI().post('/otp', body);

// 회원 OTP
export const loginOtpVerification = async body => {
  const { data } = await axiosGeneralAPI().put('/otp/verification', body);
  return data.result;
};
