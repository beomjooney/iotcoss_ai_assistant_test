import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
// import Pagination from 'src/stories/components/Pagination';
import { paramProps } from 'src/services/seminars/seminars.queries';
import { useQuizFriends, useQuizFriendsRequest } from 'src/services/quiz/quiz.queries';
import { RecommendContent } from 'src/models/recommend';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import {
  useFriendAcceptPost,
  useFriendRejectPost,
  useFriendsDeletePost,
} from 'src/services/admin/friends/friends.mutations';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const cx = classNames.bind(styles);

export function MyFriendsTemplate() {
  const { memberId } = useSessionStore.getState();
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageMember, setPageMember] = useState(1);
  const [totalPageMember, setTotalPageMember] = useState(1);
  const [totalElementsMember, setTotalElementsMember] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPoint, setTotalPoint] = useState(0);
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [contentsRequest, setContentsRequest] = useState<RecommendContent[]>([]);
  const [summary, setSummary] = useState({});

  const { mutate: onFriendsDelete, isSuccess: isDeleteSuccess } = useFriendsDeletePost();
  const { mutate: onFriendsAccept, isSuccess: isAcceptSuccess } = useFriendAcceptPost();
  const { mutate: onFriendsReject, isSuccess: isRejectSuccess } = useFriendRejectPost();

  const { isFetched: isFetchedRequest, refetch: refetchRequest } = useQuizFriendsRequest(data => {
    setContentsRequest(data?.contents);
    setTotalElements(data?.totalElements);
    setTotalPage(data?.totalPage);
  });
  const { isFetched, refetch } = useQuizFriends(data => {
    setContents(data?.contents);
    // setTotalPoint(data?.total);
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFriendDelete = async (sequence: number) => {
    if (confirm('친구를 삭제하시겠습니까?')) {
      let params = {
        memberFriendSequence: sequence.toString(),
      };
      onFriendsDelete({ data: params });
      await refetch();
    }
  };

  const handleFriendAccept = async (sequence: number) => {
    if (confirm('친구수락을 하시겠습니까?')) {
      let params = {
        memberFriendRequestSequence: sequence.toString(),
        isAccept: true,
      };
      onFriendsAccept(params);
      await refetch();
    }
  };

  const handleFriendReject = async (sequence: number) => {
    if (confirm('거절을 하시겠습니까?')) {
      let params = {
        memberFriendRequestSequence: sequence.toString(),
        isAccept: false,
      };
      onFriendsReject(params);
      await refetch();
    }
  };

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          <Grid container direction="row" alignItems="center" rowSpacing={0}>
            <Grid
              container
              justifyContent="flex-start"
              xs={6}
              sm={10}
              className="tw-text-xl tw-text-black tw-font-bold"
            >
              친구신청 ({totalElements})
            </Grid>
            <Divider className="tw-py-3 tw-mb-3" />
            {contentsRequest?.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <Grid
                    className="tw-py-2 border-bottom tw-text-base"
                    key={index}
                    container
                    direction="row"
                    justifyContent="left"
                    alignItems="center"
                    rowSpacing={3}
                  >
                    <Grid item xs={12} sm={1}>
                      <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                        <img className="tw-w-10 tw-h-10 border tw-rounded-full" src={item?.member?.profileImageUrl} />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <div className="tw-text-left tw-text-black">{item?.member?.nickname}</div>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div className="tw-text-left tw-text-black">{item?.memberId}</div>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div className="tw-text-left tw-text-black">{item?.jobGroup?.name}</div>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div className="tw-text-left tw-text-black">{item?.job?.name}</div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}
                    >
                      <div className="tw-gap-3">
                        <button
                          onClick={() => handleJoinMember(item?.member?.memberUUID)}
                          type="button"
                          data-tooltip-target="tooltip-default"
                          className="tw-py-2 tw-px-5 tw-mr-3 tw-bg-red-600 tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleRejectMember(item?.member?.memberUUID)}
                          type="button"
                          data-tooltip-target="tooltip-default"
                          className="tw-py-2 tw-px-5 tw-bg-black border tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                        >
                          거절
                        </button>
                      </div>
                    </Grid>
                  </Grid>
                </React.Fragment>
              );
            })}
            <Grid container justifyContent="flex-end" xs={6} sm={2} style={{ textAlign: 'right' }}>
              <Pagination
                count={totalPage}
                size="small"
                siblingCount={0}
                page={page}
                renderItem={item => (
                  <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                )}
                onChange={handlePageChange}
              />
            </Grid>
          </Grid>

          <Grid container direction="row" alignItems="center" rowSpacing={0}>
            <Grid
              container
              justifyContent="flex-start"
              xs={6}
              sm={10}
              className="tw-text-xl tw-text-black tw-font-bold tw-mt-10 tw-mb-5"
            >
              친구목록 ({totalElements})
            </Grid>

            <Grid container justifyContent="flex-end" xs={6} sm={2} style={{ textAlign: 'right' }}>
              <Pagination
                count={totalPage}
                size="small"
                siblingCount={0}
                page={page}
                renderItem={item => (
                  <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                )}
                onChange={handlePageChange}
              />
            </Grid>
          </Grid>

          {isFetched && (
            <div>
              {contents.length > 0 ? (
                contents.map((item, index) => (
                  <div
                    key={index}
                    className="tw-p-3 center tw-grid tw-grid-cols-7 border-bottom tw-flex tw-items-center tw-space-x-4"
                  >
                    <div className="tw-col-span-3 tw-flex  tw-items-center ">
                      <img
                        src={item?.imageUrl}
                        alt="image"
                        className={cx('rounded-circle', 'profile-image', 'tw-h-12', 'tw-w-12')}
                      />
                      <div className="tw-pl-5 tw-font-bold tw-text-lg tw-text-black">{item.nickname}</div>
                    </div>
                    <div className="tw-col-span-4 tw-text-right">
                      {item.memberFriendStatus === '0001' && (
                        <div>
                          <button
                            onClick={() => handleFriendAccept(item.sequence)}
                            className="tw-mr-3 tw-bg-gray-500 tw-text-white tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            친구수락하기
                          </button>
                          <button
                            onClick={() => handleFriendReject(item.sequence)}
                            className="tw-bg-white tw-text-black border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            친구거절하기
                          </button>
                        </div>
                      )}
                      {item.memberFriendStatus === '0002' && (
                        <div className="">
                          {/* <button
                            onClick={() => (window.location.href = '/profile/' + `${item.friendMemberUUID}`)}
                            className="tw-bg-gray-500 tw-mr-3 tw-text-white tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            프로필보기
                          </button> */}
                          <button
                            onClick={() => handleFriendDelete(item.sequence)}
                            className="tw-bg-white tw-text-black border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            삭제하기
                          </button>
                        </div>
                      )}
                      {item.memberFriendStatus === '0003' && (
                        <div className="">
                          <button className="tw-bg-gray-500  tw-text-white tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded">
                            내가 친구 거절한 요청
                          </button>
                        </div>
                      )}
                      {item.memberFriendStatus === '0004' && (
                        <div className="">
                          <button
                            disabled
                            className="tw-bg-gray-500  tw-text-white tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            친구 승인 대기중
                          </button>
                        </div>
                      )}
                      {item.memberFriendStatus === '0005' && (
                        <div className="">
                          <button
                            disabled
                            className="tw-bg-gray-500  tw-text-white tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            상대방이 친구 거절
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="tw-text-center  tw-w-full border tw-rounded-md">
                  <div className="tw-p-10  tw-mb-5">
                    <div className="tw-p-10">친구 관리에 친구가 없습니다.</div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="tw-mt-10">{/* <Pagination page={page} setPage={setPage} total={totalPage} /> */}</div>
        </div>
      </section>
    </div>
  );
}
