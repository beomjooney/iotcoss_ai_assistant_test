import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import { useMemberActiveSummaryInfo } from 'src/services/account/account.queries';
import { useClubAdminList } from 'src/services/studyroom/studyroom.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import router from 'next/router';
import { Mobile, Desktop } from 'src/hooks/mediaQuery';
import { useQuizActivityHistory } from 'src/services/quiz/quiz.queries';
import { Pagination } from 'src/stories/components';
import { useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import { ManageLectureClubTemplate, ManageQuizClubTemplate } from 'src/templates';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';

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

export function AdminClubsTemplate() {
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
  const [open, setOpen] = useState(false);
  const [clubType, setClubType] = useState('0100');
  const [clubSequence, setClubSequence] = useState(null);

  const { isFetched: isUserFetched } = useMemberActiveSummaryInfo(data => setSummary(data));

  const { isFetched: isMemberListFetched, refetch: QuizRefetchBadge } = useClubAdminList(memberParams, data => {
    console.log(data);
    setContents(data?.data?.contents);
    setTotalPage(data?.data?.totalPages);
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
    return date?.split('.')[0].split('T')[0]; // T를 공백으로 바꾸고 소수점 이하 제거
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
      setPage(1);
    }
  };

  const toggleDrawer = (newOpen: boolean, type: string, sequence: number) => () => {
    console.log('click node drawer');
    setPage(1);
    setClubType(type);
    setClubSequence(sequence);
    setOpen(newOpen);
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
                    <div className="tw-font-bold tw-text-xl tw-text-black tw-p-0">클럽 관리</div>
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
                    <Table className="" aria-label="simple table">
                      <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                        <TableRow>
                          <TableCell align="left" width={70}>
                            <div className="tw-text-base tw-font-bold">구분</div>
                          </TableCell>
                          <TableCell align="left" width={240}>
                            <div className=" tw-text-base tw-font-bold">클럽명</div>
                          </TableCell>
                          <TableCell align="left" width={140}>
                            <div className=" tw-text-base tw-font-bold">대학/학과</div>
                          </TableCell>
                          <TableCell align="left" width={100}>
                            <div className=" tw-text-base tw-font-bold">교수자</div>
                          </TableCell>
                          <TableCell align="left" width={100}>
                            <div className=" tw-text-base tw-font-bold">구성</div>
                          </TableCell>
                          <TableCell align="left" width={130}>
                            <div className=" tw-text-base tw-font-bold">운영기간</div>
                          </TableCell>
                          <TableCell align="center" width={130}>
                            <div className=" tw-text-base tw-font-bold">관리</div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contents.map((content, index) => (
                          <TableRow key={index}>
                            <TableCell align="center" component="th" scope="row">
                              <div className=" tw-text-base">
                                <span className="tw-text-sm tw-font-medium">
                                  {content.clubType === '0100' ? (
                                    <div>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="18"
                                        viewBox="0 0 32 18"
                                        fill="none"
                                      >
                                        <rect x="0.5" y="0.5" width="31" height="17" rx="1.5" stroke="#5A64FF" />
                                        <path
                                          d="M11.8867 4.30469V4.76172C11.875 5.50586 11.875 6.79492 11.5469 8.64062C12.0039 8.61133 12.4668 8.57031 12.918 8.52344L12.9883 9.22656C11.9219 9.36133 10.8145 9.44922 9.73047 9.49609V13.3281H8.80469V9.53125C7.81445 9.57227 6.85352 9.57812 5.98047 9.57812L5.85156 8.81641C7.29297 8.79883 8.95703 8.78711 10.6094 8.69922C10.7383 8.06641 10.8203 7.49805 10.8789 6.98828L6.71875 7.35156L6.56641 6.56641L10.9375 6.32031C10.9727 5.82227 10.9844 5.40625 10.9844 5.06641H6.78906V4.30469H11.8867ZM14.5938 3.53125V13.9492H13.6797V3.53125H14.5938ZM25.832 11.793V12.5664H16.293V11.793H25.832ZM21.5195 5.82812C21.5195 7.49219 23.582 8.91016 25.375 9.20312L25 9.92969C23.4062 9.61914 21.7246 8.59961 21.0625 7.16406C20.3887 8.61133 18.7129 9.66016 17.1484 9.97656L16.7617 9.23828C18.5195 8.93359 20.5703 7.49219 20.5703 5.82812V5.34766H17.0781V4.58594H25.0117V5.34766H21.5195V5.82812Z"
                                          fill="#5A64FF"
                                        />
                                      </svg>
                                    </div>
                                  ) : (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="18"
                                        viewBox="0 0 32 18"
                                        fill="none"
                                      >
                                        <rect x="0.5" y="0.5" width="31" height="17" rx="1.5" stroke="#06C090" />
                                        <path
                                          d="M14.0664 3.53125V6.25H15.6367V7.01172H14.0664V9.78906H13.1523V3.53125H14.0664ZM11.2305 4.30469C11.2305 6.95312 9.35547 8.91016 6.32031 9.80078L5.93359 9.05078C8.44727 8.32422 10.0527 6.87695 10.2461 5.06641H6.39062V4.30469H11.2305ZM10.7734 9.90625C12.8711 9.90625 14.1836 10.668 14.1836 11.9102C14.1836 13.1758 12.8711 13.9258 10.7734 13.9258C8.69922 13.9258 7.35156 13.1758 7.36328 11.9102C7.35156 10.668 8.69922 9.90625 10.7734 9.90625ZM10.7734 10.6445C9.25 10.6328 8.26562 11.125 8.27734 11.9102C8.26562 12.6953 9.25 13.1875 10.7734 13.1875C12.3086 13.1875 13.293 12.6953 13.293 11.9102C13.293 11.125 12.3086 10.6328 10.7734 10.6445ZM19.7031 4.29297C21.3438 4.29297 22.5039 5.28906 22.5039 6.74219C22.5039 8.19531 21.3438 9.19141 19.7031 9.19141C18.0625 9.19141 16.8789 8.19531 16.8906 6.74219C16.8789 5.28906 18.0625 4.29297 19.7031 4.29297ZM19.7031 5.10156C18.5898 5.10156 17.7812 5.76953 17.793 6.74219C17.7812 7.71484 18.5898 8.38281 19.7031 8.38281C20.8047 8.38281 21.6016 7.71484 21.6016 6.74219C21.6016 5.76953 20.8047 5.10156 19.7031 5.10156ZM24.8359 3.53125V13.9727H23.9219V3.53125H24.8359ZM16.3516 10.8906C18.2734 10.8906 20.9219 10.8789 23.2305 10.5391L23.3008 11.2188C20.9219 11.6641 18.3555 11.6758 16.4805 11.6758L16.3516 10.8906Z"
                                          fill="#06C090"
                                        />
                                      </svg>
                                    </>
                                  )}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell align="left" component="th" scope="row">
                              <div className=" tw-text-sm tw-line-clamp-1">{content.clubName}</div>
                            </TableCell>
                            <TableCell align="left" component="th" scope="row">
                              <div className=" tw-text-sm">{content?.jobGroups?.map(item => item.name).join(', ')}</div>
                            </TableCell>
                            <TableCell align="left" component="th" scope="row">
                              <div className=" tw-text-sm ">{content?.instructorName}</div>
                            </TableCell>
                            <TableCell align="left" component="th" scope="row">
                              <div className=" tw-text-sm">
                                {content.clubType === '0100' ? '퀴즈' : '강의'} {content?.count || 0}개
                              </div>
                            </TableCell>
                            <TableCell align="left" component="th" scope="row">
                              <div className=" tw-text-sm tw-text-gray-400">{formatDate(content.startAt)}</div>
                              <div className=" tw-text-sm tw-text-gray-400">~{formatDate(content.endAt)}</div>
                            </TableCell>

                            <TableCell align="left" component="th" scope="row">
                              <button
                                onClick={toggleDrawer(true, content.clubType, content.clubSequence)}
                                type="button"
                                data-tooltip-target="tooltip-default"
                                className="tw-py-1 tw-bg-black tw-text-white  max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-rounded-md"
                              >
                                클럽관리
                              </button>
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
        <Drawer anchor={'right'} open={open} onClose={toggleDrawer(false, '0100', null)}>
          <div className="tw-px-10">
            <div className="tw-flex tw-justify-end">
              <IconButton onClick={toggleDrawer(false, '0100', null)}>
                <CancelIcon />
              </IconButton>
            </div>
            {clubType === '0100' ? (
              <>
                <ManageQuizClubTemplate id={clubSequence} title="승인된 클럽 관리" subtitle={false} />;
              </>
            ) : (
              <div className="">
                <ManageLectureClubTemplate id={clubSequence} title="승인된 클럽 관리" subtitle={false} />;
              </div>
            )}
          </div>
        </Drawer>
      </section>
    </div>
  );
}
