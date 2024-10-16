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
export const crewAcceptPost = async params => {
  const { data } = await axiosGeneralAPI().put(
    `/api/v1/my/clubs/${params.club}/member-requests/${params.memberUUID}/decision`,
    {
      isAccept: true,
    },
  );
  return data;
};
export const crewRejectPost = async params => {
  const { data } = await axiosGeneralAPI().put(
    `/api/v1/my/clubs/${params.club}/member-requests/${params.memberUUID}/decision`,
    {
      isAccept: false,
    },
  );
  return data;
};

export const instructorAccept = async params => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/clubs/${params.club}/instructors`, {
    memberUUIDs: params.memberUUIDs,
  });
  return data;
};

export const instructorDelete = async params => {
  const { data } = await axiosGeneralAPI().delete(`/api/v1/clubs/${params.club}/instructors/${params.memberUUID}`);
  return data;
};

export const instructorBan = async params => {
  const { data } = await axiosGeneralAPI().put(`/api/v1/clubs/${params.club}/members/${params.memberUUID}/ban`);
  return data;
};

export const deleteQuiz = async params => {
  const { data } = await axiosGeneralAPI().delete(`/api/manager/v1/contents/${params.quizSequence}`);
  return data;
};

export const crewBan = async params => {
  const { data } = await axiosGeneralAPI().delete(`/api/v1/clubs/${params.club}/members/${params.memberUUID}/ban`);
  return data;
};

export const savePost = async body =>
  await axiosGeneralAPI().put(`/api/v1/friend-requests/${body.memberFriendRequestSequence}/decision`, {
    isAccept: true,
  });

export const saveAdminPost = async body =>
  await axiosGeneralAPI().put(`/api/v1/members/${body.memberUUID}/instructor/authority/approve`);

export const rejectAdminPost = async body =>
  await axiosGeneralAPI().put(`/api/v1/members/${body.memberUUID}/instructor/authority/reject`, {
    rejectReason: body.rejectReason,
  });

export const saveAdminClubPost = async body =>
  await axiosGeneralAPI().put(`/api/manager/v1/clubs/${body.clubSequence}/approval`);

export const rejectAdminClubPost = async body =>
  await axiosGeneralAPI().put(`/api/manager/v1/clubs/${body.clubSequence}/rejection`, {
    rejectReason: body.rejectReason,
  });

export const rejectPost = async body =>
  await axiosGeneralAPI().put(`/api/v1/friend-requests/${body.memberFriendRequestSequence}/decision`, {
    isAccept: false,
  });

export const deletePost = async body => {
  await axiosGeneralAPI().delete(`/api/v1/friends/${body.data.memberFriendSequence}`);
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
