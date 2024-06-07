import { axiosGeneralAPI } from '../../index';

interface CamenityProps {
  page: number;
  size: number;
}
export async function getCamenities(args: CamenityProps) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/posts', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}
export const crewAcceptPost = async body => await axiosGeneralAPI().put(`/api/v1/club/crew-requests/decision`, body);

export const crewRejectPost = async body => await axiosGeneralAPI().put(`/api/v1/club/crew-requests/decision`, body);

export const crewBan = async params =>
  await axiosGeneralAPI().delete(`/api/v1/clubs/${params.club}/members/${params.memberUUID}/ban`);

export const savePost = async body => await axiosGeneralAPI().put(`/api/v1/member/friend/requests`, body);

export const rejectPost = async body => await axiosGeneralAPI().put(`/api/v1/member/friend/requests`, body);

export const deletePost = async body => {
  await axiosGeneralAPI().delete(`/api/v1/member/friends`, body);
};

export const addPosts = async body => await axiosGeneralAPI().post(`/posts`, body);

export const saveReply = async body =>
  await axiosGeneralAPI().put(`/posts/${body.parentPostNo}/${body.postReplyNo}`, body);

export const deleteReply = async body =>
  await axiosGeneralAPI().delete(`/posts/${body.parentPostNo}/${body.postReplyNo}`);

export async function getReplies(args: CamenityProps) {
  let params = JSON.parse(JSON.stringify(args));
  let postNo = params.postNo;
  delete params['postNo'];
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get(`/posts/${postNo}`);
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}
