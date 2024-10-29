import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import { useMemberActiveSummaryInfo } from 'src/services/account/account.queries';
import { useStudyQuizMemberList } from 'src/services/studyroom/studyroom.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
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

import SearchIcon from '@mui/icons-material/Search';

const cx = classNames.bind(styles);

export function AdminClubTemplate() {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any>([]);

  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [memberList, setMemberList] = useState<any[]>([]);
  const [memberParams, setMemberParams] = useState<any>({ page: page, keyword: search });

  const { isFetched: isUserFetched } = useMemberActiveSummaryInfo(data => setSummary(data));

  const { isFetched: isMemberListFetched, refetch: QuizRefetchBadge } = useStudyQuizMemberList(memberParams, data => {
    console.log(data);
    setContents(data?.data?.contents);
    setTotalPage(data?.data?.totalPage);
    setPage(data?.data?.page);
  });

  // const { isFetched: isContentFetched, refetch: refetch } = useQuizActivityHistory(params, data => {
  //   console.log(data);
  //   setContents(data?.data?.content);
  //   setTotalPage(data?.data?.totalPage);
  //   setPage(data?.data?.page);
  // });

  // T를 공백으로 바꾸고 소수점 부분을 제거하는 함수
  const formatDate = date => {
    return date.split('.')[0].replace('T', ' '); // T를 공백으로 바꾸고 소수점 이하 제거
  };

  useDidMountEffect(() => {
    setMemberParams({
      // ...params,
      page,
      keyword: searchKeyword,
    });
  }, [page, searchKeyword]);

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
                    <div className="tw-font-bold tw-text-xl tw-text-black tw-p-0">회원정보 관리</div>
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
                  <TableContainer
                    style={{
                      overflowY: 'auto', // 높이를 초과하면 스크롤이 생김
                    }}
                  >
                    <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                      <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                        <TableRow>
                          <TableCell align="left" width={250}>
                            <div className="tw-text-base tw-font-bold">회원아이디</div>
                          </TableCell>
                          <TableCell align="left" width={200}>
                            <div className=" tw-text-base tw-font-bold">회원명</div>
                          </TableCell>
                          <TableCell align="left" width={250}>
                            <div className=" tw-text-base tw-font-bold">이메일</div>
                          </TableCell>
                          <TableCell align="left" width={120}>
                            <div className=" tw-text-base tw-font-bold">전화번호</div>
                          </TableCell>
                          <TableCell align="left" width={90}>
                            <div className=" tw-text-base tw-font-bold">연령대</div>
                          </TableCell>
                          <TableCell align="left" width={100}>
                            <div className=" tw-text-base tw-font-bold">회원유형</div>
                          </TableCell>
                          <TableCell align="left" width={180}>
                            <div className=" tw-text-base tw-font-bold">직군유형</div>
                          </TableCell>
                          <TableCell align="left" width={100}>
                            <div className=" tw-text-base tw-font-bold">레벨</div>
                          </TableCell>
                          <TableCell align="left" width={130}>
                            <div className=" tw-text-base tw-font-bold">이메일수신</div>
                          </TableCell>
                          <TableCell align="left" width={130}>
                            <div className=" tw-text-base tw-font-bold">문자수신</div>
                          </TableCell>
                          <TableCell align="left" width={130}>
                            <div className=" tw-text-base tw-font-bold">카카오톡수신</div>
                          </TableCell>
                          <TableCell align="left" width={100}>
                            <div className=" tw-text-base tw-font-bold">포인트</div>
                          </TableCell>
                          <TableCell align="left" width={160}>
                            <div className=" tw-text-base tw-font-bold">등록일자</div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contents.length > 0 ? (
                          contents.map((content, index) => (
                            <TableRow key={index}>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-base">
                                  <span className="tw-text-sm tw-font-medium">{content.memberId}</span>
                                </div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm tw-line-clamp-1">{content.name}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">{content.email}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">{content.phoneNumber}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">{content.ageRange}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">{content.memberType}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">{content.jobGroup}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">{content.jobLevel}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">{content.isEmailReceive ? 'T' : 'F'}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">{content.isKakaoReceive ? 'T' : 'F'}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">{content.isSmsReceive ? 'T' : 'F'}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">{content.points}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-sm">{formatDate(content.createdAt)}</div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell align="center" colSpan={4}>
                              <div className="tw-text-sm tw-text-gray-500">데이터가 없습니다</div>
                            </TableCell>
                          </TableRow>
                        )}
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
