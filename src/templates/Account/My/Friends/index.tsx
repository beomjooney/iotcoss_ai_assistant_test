import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import Pagination from 'src/stories/components/Pagination';
import { paramProps, useSeminarMeFavoriteList } from 'src/services/seminars/seminars.queries';
import { useQuizFriends } from 'src/services/quiz/quiz.queries';
import { RecommendContent } from 'src/models/recommend';

/** import table */
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const cx = classNames.bind(styles);

export function MyFriendsTemplate() {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPoint, setTotalPoint] = useState(0);
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [summary, setSummary] = useState({});

  const { isFetched } = useQuizFriends(data => {
    console.log(data);
    setContents(data?.contents);
    // setTotalPoint(data?.total);
  });

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          {isFetched && (
            <div>
              {contents?.map((item, index) => (
                <div
                  key={index}
                  className="tw-p-3 center tw-grid tw-grid-cols-6 border-bottom tw-flex tw-items-center tw-space-x-4"
                >
                  <div className="tw-col-span-1 tw-flex  tw-items-center ">
                    <img
                      src={item?.imageUrl}
                      alt={'image'}
                      className={cx('rounded-circle', 'profile-image', 'tw-h-12')}
                    />
                    {/*TODO 원래 job(직업)임*/}
                    <div className="tw-pl-5 tw-font-bold tw-text-lg tw-text-black">{item.nickname}</div>
                  </div>
                  <div className="tw-col-span-5 tw-text-right">
                    {item.memberFriendStatus === '0001' && (
                      <div>
                        <button className="tw-mr-3 tw-bg-gray-500 tw-text-white tw-text-sm tw-font-right tw-px-4  tw-py-3 tw-rounded">
                          수락하기
                        </button>
                        <button className="tw-bg-white tw-text-black border tw-text-sm tw-font-right tw-px-4  tw-py-3 tw-rounded">
                          거절하기
                        </button>
                      </div>
                    )}
                    {item.memberFriendStatus === '0002' && (
                      <div className="">
                        <button
                          onClick={() => (location.href = '/profile/' + `${item.friendMemberUUID}`)}
                          className="tw-bg-gray-500 tw-mr-3 tw-text-white tw-text-sm tw-font-right tw-px-4  tw-py-3 tw-rounded"
                        >
                          프로필보기
                        </button>
                        <button className="tw-bg-white tw-text-black border tw-text-sm tw-font-right tw-px-4  tw-py-3 tw-rounded">
                          삭제하기
                        </button>
                      </div>
                    )}
                    {item.memberFriendStatus === '0003' && (
                      <div className="">
                        <button className="tw-bg-gray-500  tw-text-white tw-text-sm tw-font-right tw-px-4  tw-py-3 tw-rounded">
                          친구 거절
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="tw-mt-10">{/* <Pagination page={page} setPage={setPage} total={totalPage} /> */}</div>
        </div>
      </section>
    </div>
  );
}
