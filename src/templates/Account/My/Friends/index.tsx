import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import Pagination from 'src/stories/components/Pagination';
import { paramProps, useSeminarMeFavoriteList } from 'src/services/seminars/seminars.queries';
import { useQuizFriends } from 'src/services/quiz/quiz.queries';
import { RecommendContent } from 'src/models/recommend';
import {
  useFriendAcceptPost,
  useFriendRejectPost,
  useFriendsDeletePost,
} from 'src/services/admin/friends/friends.mutations';

const cx = classNames.bind(styles);

export function MyFriendsTemplate() {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPoint, setTotalPoint] = useState(0);
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [summary, setSummary] = useState({});

  const { mutate: onFriendsDelete, isSuccess: isDeleteSuccess } = useFriendsDeletePost();
  const { mutate: onFriendsAccept, isSuccess: isAcceptSuccess } = useFriendAcceptPost();
  const { mutate: onFriendsReject, isSuccess: isRejectSuccess } = useFriendRejectPost();

  const { isFetched, refetch } = useQuizFriends(data => {
    setContents(data?.contents);
    // setTotalPoint(data?.total);
  });

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
          {isFetched && (
            <div>
              {contents.length > 0 ? (
                contents.map((item, index) => (
                  <div
                    key={index}
                    className="tw-p-3 center tw-grid tw-grid-cols-6 border-bottom tw-flex tw-items-center tw-space-x-4"
                  >
                    <div className="tw-col-span-2 tw-flex  tw-items-center ">
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
                          <button
                            onClick={() => (window.location.href = '/profile/' + `${item.friendMemberUUID}`)}
                            className="tw-bg-gray-500 tw-mr-3 tw-text-white tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            프로필보기
                          </button>
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
