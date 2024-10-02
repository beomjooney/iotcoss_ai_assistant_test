import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import { useMemberActiveSummaryInfo } from 'src/services/account/account.queries';
import router from 'next/router';
import { Mobile, Desktop } from 'src/hooks/mediaQuery';
import { useQuizActivityHistory } from 'src/services/quiz/quiz.queries';
import { Pagination } from 'src/stories/components';
import { useEffect } from 'react';
import { TextField } from '@mui/material';

/**table */
import SettingsIcon from '@mui/icons-material/Settings';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const cx = classNames.bind(styles);

export function AdminClubTemplate() {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any>([]);

  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState('');
  const { isFetched: isUserFetched } = useMemberActiveSummaryInfo(data => setSummary(data));

  const { isFetched: isContentFetched, refetch: refetch } = useQuizActivityHistory(params, data => {
    console.log(data);
    setContents(data);
    setTotalPage(data?.totalPage);
    setPage(data?.page);
  });

  useEffect(() => {
    setParams({
      page,
    });
  }, [page]);

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          {isUserFetched && (
            <>
              <Desktop>
                <div>
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <div className="tw-font-bold tw-text-xl tw-text-black tw-p-0">회원정보 관리</div>
                    <TextField
                      size="small"
                      placeholder="검색"
                      value={''}
                      onChange={e => {
                        setSearch(e.target.value);
                      }}
                    />
                  </div>
                  <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-5 tw-flex tw-items-center tw-justify-between tw-gap-5"></div>
                  <TableContainer>
                    <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                      <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                        <TableRow>
                          <TableCell align="center" width={100}>
                            <div className="tw-font-bold tw-text-base">등록일자</div>
                          </TableCell>
                          <TableCell align="center" width={120}>
                            <div className="tw-font-bold tw-text-base">등록자</div>
                          </TableCell>
                          <TableCell align="center">
                            <div className="tw-font-bold tw-text-base">지식컨텐츠 타이틀</div>
                          </TableCell>
                          <TableCell align="center" width={100}>
                            <div className="tw-font-bold tw-text-base">유형</div>
                          </TableCell>
                          <TableCell align="center" width={100}>
                            <div className="tw-font-bold tw-text-base">즐겨찾기</div>
                          </TableCell>
                          <TableCell align="center" width={100}>
                            <div className="tw-font-bold tw-text-base">URL</div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-base">
                              1회 <br />
                            </div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-base">
                              <span className="tw-text-sm tw-font-medium tw-text-gray-400">test</span>
                            </div>
                          </TableCell>
                          <TableCell align="left" component="th" scope="row">
                            <div className="tw-font-bold tw-text-base">11</div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-sm">{' 123'}</div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-sm">123</div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-sm">213건</div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <div className="tw-mt-10">
                    <Pagination page={page} setPage={setPage} total={totalPage} />
                  </div>
                </div>
              </Desktop>
              <Mobile>
                <div className="tw-font-bold tw-text-xl tw-text-black tw-py-10">나의 활동내역</div>
                <div className="tw-gap-0 tw-p-5 tw-gap-5">
                  <div className="tw-h-[300px] border-3 border-primary tw-border-indigo-500 tw-text-base tw-font-bold tw-text-gray-600 tw-text-center tw-p-5">
                    <div className="tw-text-xl tw-py-4 tw-text-blue-500">Today</div>
                    <div className="tw-text-xl tw-py-2 tw-text-gray-400">
                      {summary?.todaySummary?.date} ({summary?.todaySummary?.dayOfWeek})
                    </div>
                    <div>학습예정</div>
                    <div className="tw-py-5">
                      <button
                        onClick={() => router.push('/studyroom')}
                        className="tw-bg-red-500 tw-rounded-md tw-text-sm tw-text-white tw-font-bold tw-py-2.5 tw-px-14 tw-rounded"
                      >
                        나의 학습방
                      </button>
                    </div>
                  </div>
                  {/* <div className="tw-h-[300px] border tw-mt-5 tw-text-base tw-font-bold tw-text-gray-600 tw-text-center  tw-rounded-md  tw-p-5">
                    <div className="tw-text-xl tw-py-4 tw-text-black">최근 획득한 배지</div>
                    <div className="tw-text-center">
                      <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
                        <img
                          className="tw-object-cover tw-h-[80px] "
                          src={`${process.env.NEXT_PUBLIC_GENERAL_URL}/assets/images/badge/${summary?.lastAchievedBadge?.badgeId}.png`}
                          alt=""
                        />
                      </div>
                      <div className="tw-text-sm tw-text-black tw-font-bold">{summary?.lastAchievedBadge?.name}</div>
                      <div className="tw-text-sm tw-text-black tw-line-clamp-1">
                        {summary?.lastAchievedBadge?.description}
                      </div>
                      <div className="tw-text-sm tw-text-black">
                        {summary?.lastAchievedBadge?.achievementAt?.split(' ')[0]}
                      </div>
                    </div>
                    <div className="tw-py-5">
                      <button
                        onClick={() => router.push('/profile')}
                        className="tw-bg-[#c1a876] tw-rounded-md tw-text-sm tw-text-white tw-font-bold tw-py-2.5 tw-px-14 tw-rounded"
                      >
                        배지 전체보기
                      </button>
                    </div>
                  </div> */}
                </div>
                <div className="tw-font-bold tw-text-xl tw-text-black tw-py-10">나의 활동로그</div>
                <div className="border tw-rounded-md">
                  {isContentFetched ? (
                    contents?.contents?.length > 0 ? (
                      contents.contents.map((item, index) => (
                        <div key={index} role="tw-list" className="tw-divide-y tw-divide-gray-100 border-bottom">
                          <div className="tw-justify-between">
                            <div className="tw-min-w-0 tw-p-3 tw-font-semibold">
                              {item?.date} {item?.dayOfWeek}
                            </div>
                            {item?.activities.map((activity, idx) => (
                              <div key={idx} className="tw-cursor-pointer border-top tw-p-3 tw-text-black tw-text-sm">
                                {!activity?.isChecked && (
                                  <div className="tw-bottom-auto tw-left-auto tw-right-0 tw-top-0 tw-z-10 tw-inline-block tw-rounded-full tw-bg-red-600 tw-p-[3px] tw-text-sm tw-mx-2 tw-mr-3"></div>
                                )}
                                {activity?.activityMessage}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="tw-p-3 tw-text-center tw-text-gray-500">활동내역이 없습니다.</div>
                    )
                  ) : (
                    <div className="tw-p-3 tw-text-center tw-text-gray-500">Loading...</div>
                  )}
                </div>
              </Mobile>
            </>
          )}
          <div className="tw-mt-10">{/* <Pagination page={page} setPage={setPage} total={totalPage} /> */}</div>
        </div>
      </section>
    </div>
  );
}
