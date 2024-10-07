import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import { useMemberActiveSummaryInfo } from 'src/services/account/account.queries';
import { useStudyQuizRoleMemberList } from 'src/services/studyroom/studyroom.queries';
import router from 'next/router';
import { Mobile, Desktop } from 'src/hooks/mediaQuery';
import { useQuizActivityHistory } from 'src/services/quiz/quiz.queries';
import { Pagination } from 'src/stories/components';
import { useEffect } from 'react';
import { TextField } from '@mui/material';
import useDidMountEffect from 'src/hooks/useDidMountEffect';

/**table */
import SettingsIcon from '@mui/icons-material/Settings';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import SearchIcon from '@mui/icons-material/Search';

import {
  useFriendAcceptPost,
  useFriendRejectPost,
  useAdminRejectPost,
  useAdminAcceptPost,
} from 'src/services/admin/friends/friends.mutations';

const cx = classNames.bind(styles);

export function AdminRoleTemplate() {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any>([]);

  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [memberParams, setMemberParams] = useState<any>({ page: page, keyword: search });

  const { isFetched: isUserFetched } = useMemberActiveSummaryInfo(data => setSummary(data));

  const { mutate: onAdminAccept, isSuccess: isAcceptSuccess } = useAdminAcceptPost();
  const { mutate: onAdminReject, isSuccess: isRejectSuccess } = useAdminRejectPost();

  const { isFetched: isMemberListFetched, refetch: QuizRefetchBadge } = useStudyQuizRoleMemberList(
    memberParams,
    data => {
      console.log(data, data?.data?.contents);
      setContents(data?.data?.contents);
      setTotalPage(data?.data?.totalPages);
      setPage(data?.data?.page);
    },
  );

  useDidMountEffect(() => {
    setMemberParams({
      // ...params,
      page,
      keyword: searchKeyword,
    });
  }, [page, searchKeyword]);

  const handleAdminAccept = async (tenantUUID: string, memberUUID: string) => {
    if (confirm('관리자 권한을 승인 하시겠습니까?')) {
      let params = {
        tenantUUID,
        memberUUID,
      };
      onAdminAccept(params);
    }
  };

  const handleAdminReject = async (tenantUUID: string, memberUUID: string) => {
    if (confirm('관리자 신청을 거절 하시겠습니까?')) {
      let params = {
        tenantUUID,
        memberUUID,
        rejectReason: 'test reject',
      };
      onAdminReject(params);
    }
  };

  const renderStatusImage = status => {
    switch (status) {
      case '0001':
        return <img src="/assets/images/account/BadgeReq.jpg" alt="요청" />;
      case '0002':
        return <img src="/assets/images/account/BadgeApp.jpg" alt="승인" />;
      case '0003':
        return <img src="/assets/images/account/BadgeReject.jpg" alt="거절" />;
      case '0004':
        return <img src="/assets/images/account/BadgeReReq.jpg" alt="재요청" />;
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 시 기본 동작 방지
      setSearchKeyword(search); // 검색 함수 실행
    }
  };

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          {isMemberListFetched && (
            <>
              <Desktop>
                <div>
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <div className="tw-font-bold tw-text-xl tw-text-black tw-p-0">교수자 권환 관리</div>
                    <TextField
                      size="small"
                      value={search} // 상태값을 TextField에 반영
                      placeholder="검색"
                      onChange={e => setSearch(e.target.value)} // 입력된 값 업데이트
                      onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
                      InputProps={{
                        style: { height: '43px' },
                        startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                      }}
                    />
                  </div>
                  <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-5 tw-flex tw-items-center tw-justify-between tw-gap-5"></div>
                  <TableContainer>
                    <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                      <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                        <TableRow>
                          <TableCell align="left" width={120}>
                            <div className="tw-font-bold tw-text-base">신청일시</div>
                          </TableCell>
                          <TableCell align="left" width={120}>
                            <div className="tw-font-bold tw-text-base">회원명</div>
                          </TableCell>
                          <TableCell align="left">
                            <div className="tw-font-bold tw-text-base">대학/직군</div>
                          </TableCell>
                          <TableCell align="left">
                            <div className="tw-font-bold tw-text-base">학과/직무</div>
                          </TableCell>
                          <TableCell align="left" width={100}>
                            <div className="tw-font-bold tw-text-base">상태</div>
                          </TableCell>
                          <TableCell align="left" width={200}>
                            <div className="tw-font-bold tw-text-base">승인/거절</div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contents.map((content, index) => (
                          <TableRow key={index}>
                            <TableCell align="left" component="th" scope="row">
                              <div className="tw-text-sm tw-text-gray-400">{content?.requestedAt.split(' ')[0]}</div>
                              <div className="tw-text-sm tw-text-gray-400">{content?.requestedAt.split(' ')[1]}</div>
                            </TableCell>
                            <TableCell align="left" component="th" scope="row">
                              <div className="tw-font-bold tw-text-sm">
                                <span className="tw-text-sm tw-font-medium ">{content?.memberName}</span>
                              </div>
                            </TableCell>
                            <TableCell align="left" component="th" scope="row">
                              <div className="tw-font-medium tw-text-sm">{content?.jobGroupId?.name}</div>
                            </TableCell>
                            <TableCell align="left" component="th" scope="row">
                              <div className="tw-font-medium tw-text-sm">{content?.jobId?.name}</div>
                            </TableCell>
                            <TableCell align="left" component="th" scope="row">
                              <div className="tw-font-medium tw-text-sm">
                                {renderStatusImage(content?.requestStatus)}
                              </div>
                            </TableCell>
                            <TableCell align="left" component="th" scope="row">
                              <div className="tw-gap-3">
                                <button
                                  onClick={() => handleAdminAccept(content?.tenantUUID, content?.memberUUID)}
                                  type="button"
                                  data-tooltip-target="tooltip-default"
                                  className="tw-py-2 tw-px-5 tw-mr-3 tw-bg-white tw-text-gray-400  border max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                >
                                  승인
                                </button>
                                <button
                                  onClick={() => handleAdminReject(content?.tenantUUID, content?.memberUUID)}
                                  type="button"
                                  data-tooltip-target="tooltip-default"
                                  className="tw-py-2 tw-px-5 tw-bg-blue-600 tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                >
                                  거절
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <div className="tw-mt-10">
                    <Pagination page={page} setPage={setPage} total={totalPage} />
                  </div>
                </div>
              </Desktop>
            </>
          )}
          <div className="tw-mt-10">{/* <Pagination page={page} setPage={setPage} total={totalPage} /> */}</div>
        </div>
      </section>
    </div>
  );
}
