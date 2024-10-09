import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import { useMemberActiveSummaryInfo } from 'src/services/account/account.queries';
import { useClubApprovalList } from 'src/services/studyroom/studyroom.queries';
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

import { useAdminClubAcceptPost, useAdminClubRejectPost } from 'src/services/admin/friends/friends.mutations';

const cx = classNames.bind(styles);

export function AdminClubApprovalTemplate() {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElement, setTotalElement] = useState(0);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any>([]);

  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [memberList, setMemberList] = useState<any[]>([]);
  const [memberParams, setMemberParams] = useState<any>({ page: page, keyword: search });

  const { mutate: onAdminAccept, isSuccess: isAcceptSuccess } = useAdminClubAcceptPost();
  const { mutate: onAdminReject, isSuccess: isRejectSuccess } = useAdminClubRejectPost();

  const { isFetched: isMemberListFetched, refetch: QuizRefetchBadge } = useClubApprovalList(memberParams, data => {
    console.log(data);
    setTotalElement(data?.data?.openRequestClubCount);
    setContents(data?.data?.pageable?.contents);
    setTotalPage(data?.data?.pageable?.totalPages);
    setPage(data?.data?.pageable?.page);
  });

  useEffect(() => {
    if (isAcceptSuccess || isRejectSuccess) {
      QuizRefetchBadge();
    }
  }, [isAcceptSuccess, isRejectSuccess]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, searchKeyword]);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 시 기본 동작 방지
      setSearchKeyword(search); // 검색 함수 실행
      setPage(1);
    }
  };

  const handleAdminAccept = async (clubSequence: string) => {
    if (confirm('클럽 승인을 하시겠습니까?')) {
      let params = {
        clubSequence,
      };
      onAdminAccept(params);
    }
  };

  const handleAdminReject = async (clubSequence: string) => {
    if (confirm('클럽 거절을 하시겠습니까?')) {
      let params = {
        clubSequence,
        rejectReason: 'test reject',
      };
      onAdminReject(params);
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
                    <div className="tw-font-bold tw-text-xl tw-text-black tw-p-0">클럽개설신청 ({totalElement})</div>
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
                          <TableCell align="left" width={110}>
                            <div className="tw-text-base tw-font-bold">신청일시</div>
                          </TableCell>
                          <TableCell align="left" width={70}>
                            <div className=" tw-text-base tw-font-bold">구분</div>
                          </TableCell>
                          <TableCell align="left" width={140}>
                            <div className=" tw-text-base tw-font-bold">클럽명</div>
                          </TableCell>
                          <TableCell align="left" width={110}>
                            <div className=" tw-text-base tw-font-bold">대학/학과</div>
                          </TableCell>
                          <TableCell align="left" width={90}>
                            <div className=" tw-text-base tw-font-bold">교수자</div>
                          </TableCell>
                          <TableCell align="left" width={80}>
                            <div className=" tw-text-base tw-font-bold">상태</div>
                          </TableCell>
                          <TableCell align="center" width={190}>
                            <div className=" tw-text-base tw-font-bold">승인/거절</div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contents.length > 0 ? (
                          contents.map((content, index) => (
                            <TableRow key={index}>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-sm tw-font-medium tw-text-gray-400">
                                  {formatDate(content.createdAt).split(' ')[0]}
                                </div>
                                <div className="tw-text-sm tw-font-medium tw-text-gray-400">
                                  {formatDate(content.createdAt).split(' ')[1]}
                                </div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
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
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-sm tw-line-clamp-1">{content.clubName}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-sm tw-line-clamp-1">{content.jobs.toString()}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-sm">{content.instructorName}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-sm">
                                  {(() => {
                                    switch (content.status) {
                                      case '0001':
                                        return (
                                          <div>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="72"
                                              height="24"
                                              viewBox="0 0 72 24"
                                              fill="none"
                                            >
                                              <rect width="72" height="24" rx="12" fill="#313B4B" fillOpacity="0.05" />
                                              <circle cx="23" cy="12" r="3" fill="#31343D" />
                                              <path
                                                d="M45.791 16.0811H35.457V15.2432H38.0215V12.1963C37.5306 11.9424 37.1497 11.6165 36.8789 11.2188C36.6081 10.8167 36.4727 10.3639 36.4727 9.86035C36.4727 9.28483 36.6483 8.77913 36.9995 8.34326C37.3507 7.90316 37.8374 7.5625 38.4595 7.32129C39.0858 7.08008 39.7988 6.95736 40.5986 6.95312C41.3984 6.95736 42.1094 7.08008 42.7314 7.32129C43.3577 7.5625 43.8465 7.90316 44.1978 8.34326C44.549 8.77913 44.7246 9.28483 44.7246 9.86035C44.7246 10.3555 44.5934 10.8019 44.3311 11.1997C44.0687 11.5933 43.7005 11.917 43.2266 12.1709V15.2432H45.791V16.0811ZM40.5986 7.77832C39.985 7.77409 39.4391 7.85872 38.9609 8.03223C38.4827 8.20573 38.1082 8.45117 37.8374 8.76855C37.5708 9.08171 37.4375 9.44564 37.4375 9.86035C37.4375 10.2751 37.5708 10.6432 37.8374 10.9648C38.1082 11.2822 38.4827 11.5298 38.9609 11.7075C39.4391 11.881 39.985 11.9678 40.5986 11.9678C41.208 11.9678 41.7518 11.8789 42.23 11.7012C42.7082 11.5234 43.0827 11.2759 43.3535 10.9585C43.6243 10.6411 43.7598 10.2751 43.7598 9.86035C43.7598 9.44564 43.6243 9.08171 43.3535 8.76855C43.0827 8.45117 42.7082 8.20573 42.23 8.03223C41.7518 7.85872 41.208 7.77409 40.5986 7.77832ZM42.2236 15.2432V12.5581C41.7201 12.6893 41.1784 12.7549 40.5986 12.7549C40.0146 12.7549 39.4814 12.6914 38.999 12.5645V15.2432H42.2236ZM50.0391 8.66699C50.0391 9.12826 50.1618 9.57048 50.4072 9.99365C50.6569 10.4126 50.9997 10.7829 51.4355 11.1045C51.8714 11.4219 52.3665 11.6631 52.9209 11.8281L52.4385 12.6025C51.7826 12.4079 51.2049 12.1053 50.7056 11.6948C50.2062 11.2843 49.8296 10.8019 49.5757 10.2476C49.3302 10.8654 48.9578 11.4071 48.4585 11.8726C47.9634 12.3338 47.3815 12.6745 46.7129 12.8945L46.2305 12.1328C46.7806 11.9466 47.2694 11.68 47.6968 11.333C48.1284 10.9818 48.4627 10.5755 48.6997 10.1143C48.9409 9.65299 49.0615 9.17057 49.0615 8.66699V8.42578H46.5098V7.62598H49.0615V6.19141H50.0645V7.62598H52.5908V8.42578H50.0391V8.66699ZM55.5488 13.085H54.5459V10.3047H52.2354V9.47949H54.5459V6.24219H55.5488V13.085ZM51.8037 13.3896C52.5866 13.3896 53.2616 13.4701 53.8286 13.6309C54.3957 13.7917 54.8294 14.0265 55.1299 14.3354C55.4346 14.6401 55.5869 15.0104 55.5869 15.4463C55.5869 15.8779 55.4346 16.2482 55.1299 16.5571C54.8294 16.866 54.3957 17.1009 53.8286 17.2617C53.2616 17.4225 52.5866 17.5029 51.8037 17.5029C51.0208 17.5029 50.3459 17.4225 49.7788 17.2617C49.2118 17.1009 48.7759 16.866 48.4712 16.5571C48.1707 16.2482 48.0205 15.8779 48.0205 15.4463C48.0205 15.0104 48.1707 14.6401 48.4712 14.3354C48.7759 14.0265 49.2118 13.7917 49.7788 13.6309C50.3459 13.4701 51.0208 13.3896 51.8037 13.3896ZM51.8037 14.1641C51.2282 14.1683 50.7288 14.2212 50.3057 14.3228C49.8867 14.4243 49.5651 14.5724 49.3408 14.7671C49.1165 14.9575 49.0065 15.1839 49.0107 15.4463C49.0065 15.7044 49.1165 15.9308 49.3408 16.1255C49.5693 16.3159 49.8931 16.4619 50.312 16.5635C50.7352 16.665 51.2324 16.7158 51.8037 16.7158C52.3792 16.7158 52.8765 16.665 53.2954 16.5635C53.7144 16.4619 54.036 16.3159 54.2603 16.1255C54.4845 15.9351 54.5967 15.7087 54.5967 15.4463C54.5967 15.1839 54.4845 14.9575 54.2603 14.7671C54.0402 14.5724 53.7207 14.4243 53.3018 14.3228C52.8828 14.2212 52.3835 14.1683 51.8037 14.1641Z"
                                                fill="#31343D"
                                              />
                                            </svg>
                                          </div>
                                        );
                                      case '0002':
                                        return (
                                          <div>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="72"
                                              height="24"
                                              viewBox="0 0 72 24"
                                              fill="none"
                                            >
                                              <rect width="72" height="24" rx="12" fill="#06C090" fillOpacity="0.05" />
                                              <path
                                                d="M22.1516 14.3996L26.1182 10.4496L25.2682 9.59961L22.1516 12.6996L20.7349 11.2996L19.8849 12.1496L22.1516 14.3996ZM23.0016 18.3996C22.1238 18.3996 21.296 18.2329 20.5182 17.8996C19.7405 17.5663 19.0599 17.1079 18.4766 16.5246C17.8932 15.9413 17.4349 15.2607 17.1016 14.4829C16.7682 13.7052 16.6016 12.8774 16.6016 11.9996C16.6016 11.1107 16.7682 10.2802 17.1016 9.50794C17.4349 8.73572 17.8932 8.05794 18.4766 7.47461C19.0599 6.89128 19.7405 6.43294 20.5182 6.09961C21.296 5.76628 22.1238 5.59961 23.0016 5.59961C23.8905 5.59961 24.721 5.76628 25.4932 6.09961C26.2655 6.43294 26.9432 6.89128 27.5266 7.47461C28.1099 8.05794 28.5682 8.73572 28.9016 9.50794C29.2349 10.2802 29.4016 11.1107 29.4016 11.9996C29.4016 12.8774 29.2349 13.7052 28.9016 14.4829C28.5682 15.2607 28.1099 15.9413 27.5266 16.5246C26.9432 17.1079 26.2655 17.5663 25.4932 17.8996C24.721 18.2329 23.8905 18.3996 23.0016 18.3996Z"
                                                fill="#06C090"
                                              />
                                              <path
                                                d="M41.1191 6.95312C41.1191 7.41439 41.3138 7.85872 41.7031 8.28613C42.0924 8.71354 42.596 9.07536 43.2139 9.37158C43.8359 9.66357 44.4749 9.85189 45.1309 9.93652L44.7627 10.7236C44.1829 10.6348 43.618 10.4782 43.0679 10.2539C42.522 10.0254 42.0332 9.74186 41.6016 9.40332C41.1742 9.06055 40.8441 8.6818 40.6113 8.26709C40.3786 8.68604 40.0464 9.06689 39.6147 9.40967C39.1831 9.74821 38.6922 10.0296 38.1421 10.2539C37.5962 10.4782 37.0312 10.6348 36.4473 10.7236L36.0537 9.93652C36.7266 9.85189 37.374 9.66569 37.9961 9.37793C38.6182 9.08594 39.1217 8.72835 39.5068 8.30518C39.8962 7.87777 40.0908 7.42708 40.0908 6.95312V6.43262H41.1191V6.95312ZM45.7402 12.4502H35.457V11.6377H45.7402V12.4502ZM40.5986 13.5166C41.4069 13.5166 42.1009 13.5928 42.6807 13.7451C43.2604 13.8975 43.7048 14.1239 44.0137 14.4243C44.3226 14.7205 44.4792 15.0824 44.4834 15.5098C44.4792 15.9329 44.3226 16.2948 44.0137 16.5952C43.7048 16.8957 43.2604 17.1242 42.6807 17.2808C42.1009 17.4416 41.4069 17.5241 40.5986 17.5283C39.7819 17.5241 39.0815 17.4416 38.4976 17.2808C37.9178 17.1242 37.4735 16.8957 37.1646 16.5952C36.8556 16.2948 36.7012 15.9329 36.7012 15.5098C36.7012 15.0824 36.8535 14.7205 37.1582 14.4243C37.4671 14.1239 37.9136 13.8975 38.4976 13.7451C39.0815 13.5928 39.7819 13.5166 40.5986 13.5166ZM40.5986 14.2783C39.6846 14.2868 38.9736 14.3989 38.4658 14.6147C37.9622 14.8263 37.7126 15.1247 37.7168 15.5098C37.7126 15.8991 37.9622 16.1995 38.4658 16.4111C38.9736 16.6227 39.6846 16.7285 40.5986 16.7285C41.5042 16.7285 42.2109 16.6227 42.7188 16.4111C43.2266 16.1995 43.4805 15.8991 43.4805 15.5098C43.4805 15.1247 43.2244 14.8263 42.7124 14.6147C42.2046 14.3989 41.5 14.2868 40.5986 14.2783ZM55.5107 14.5068H54.5205V6.25488H55.5107V14.5068ZM55.8662 17.2871H48.2236V13.6689H49.2139V16.4492H55.8662V17.2871ZM49.417 7.04199C49.9756 7.04199 50.4792 7.16048 50.9277 7.39746C51.3805 7.63021 51.7339 7.95817 51.9878 8.38135C52.2459 8.80029 52.375 9.27637 52.375 9.80957C52.375 10.3512 52.2459 10.8337 51.9878 11.2568C51.7339 11.6758 51.3805 12.0037 50.9277 12.2407C50.4792 12.4735 49.9756 12.5898 49.417 12.5898C48.8584 12.5898 48.3527 12.4735 47.8999 12.2407C47.4513 12.0037 47.098 11.6758 46.8398 11.2568C46.5859 10.8337 46.459 10.3512 46.459 9.80957C46.459 9.27637 46.5859 8.80029 46.8398 8.38135C47.098 7.95817 47.4513 7.63021 47.8999 7.39746C48.3527 7.16048 48.8584 7.04199 49.417 7.04199ZM49.417 7.91797C49.0404 7.91797 48.6997 7.99837 48.395 8.15918C48.0946 8.31999 47.8576 8.54427 47.6841 8.83203C47.5148 9.11979 47.4323 9.44564 47.4365 9.80957C47.4323 10.1777 47.5148 10.5078 47.6841 10.7998C47.8576 11.0876 48.0946 11.3118 48.395 11.4727C48.6997 11.6335 49.0404 11.7139 49.417 11.7139C49.7852 11.7139 50.1195 11.6335 50.4199 11.4727C50.7246 11.3118 50.9637 11.0876 51.1372 10.7998C51.3107 10.5078 51.3975 10.1777 51.3975 9.80957C51.3975 9.44987 51.3107 9.12614 51.1372 8.83838C50.9637 8.55062 50.7246 8.32633 50.4199 8.16553C50.1195 8.00049 49.7852 7.91797 49.417 7.91797Z"
                                                fill="#06C090"
                                              />
                                            </svg>
                                          </div>
                                        );
                                      case '0003':
                                        return (
                                          <div>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="72"
                                              height="24"
                                              viewBox="0 0 72 24"
                                              fill="none"
                                            >
                                              <rect width="72" height="24" rx="12" fill="#FE2E36" fillOpacity="0.05" />
                                              <path
                                                d="M20.6516 15.1996L23.0016 12.8496L25.3516 15.1996L26.2016 14.3496L23.8516 11.9996L26.2016 9.64961L25.3516 8.79961L23.0016 11.1496L20.6516 8.79961L19.8016 9.64961L22.1516 11.9996L19.8016 14.3496L20.6516 15.1996ZM23.0016 18.3996C22.1238 18.3996 21.296 18.2329 20.5182 17.8996C19.7405 17.5663 19.0599 17.1079 18.4766 16.5246C17.8932 15.9413 17.4349 15.2607 17.1016 14.4829C16.7682 13.7052 16.6016 12.8774 16.6016 11.9996C16.6016 11.1107 16.7682 10.2802 17.1016 9.50794C17.4349 8.73572 17.8932 8.05794 18.4766 7.47461C19.0599 6.89128 19.7405 6.43294 20.5182 6.09961C21.296 5.76628 22.1238 5.59961 23.0016 5.59961C23.8905 5.59961 24.721 5.76628 25.4932 6.09961C26.2655 6.43294 26.9432 6.89128 27.5266 7.47461C28.1099 8.05794 28.5682 8.73572 28.9016 9.50794C29.2349 10.2802 29.4016 11.1107 29.4016 11.9996C29.4016 12.8774 29.2349 13.7052 28.9016 14.4829C28.5682 15.2607 28.1099 15.9413 27.5266 16.5246C26.9432 17.1079 26.2655 17.5663 25.4932 17.8996C24.721 18.2329 23.8905 18.3996 23.0016 18.3996Z"
                                                fill="#FF5B5B"
                                              />
                                              <path
                                                d="M44.8008 17.5283H43.8105V11.6123H41.1191V10.7871H43.8105V6.24219H44.8008V17.5283ZM41.1445 7.47363C41.1445 11.0537 39.4349 13.6901 36.0156 15.3828L35.4697 14.583C38.377 13.1781 39.9342 11.0791 40.1416 8.28613H35.9648V7.47363H41.1445ZM50.1025 7.99414C50.1025 8.43848 50.2189 8.87012 50.4517 9.28906C50.6886 9.70801 51.0166 10.0804 51.4355 10.4062C51.8545 10.7321 52.3327 10.9818 52.8701 11.1553L52.375 11.9424C51.7402 11.7308 51.1816 11.4176 50.6992 11.0029C50.221 10.584 49.8592 10.0994 49.6138 9.54932C49.3599 10.1587 48.9811 10.6982 48.4775 11.168C47.974 11.6335 47.3942 11.9805 46.7383 12.209L46.2432 11.4219C46.7891 11.2314 47.2778 10.9585 47.7095 10.603C48.1453 10.2476 48.486 9.84131 48.7314 9.38428C48.9769 8.92725 49.0996 8.45964 49.0996 7.98145V7.66406H46.5479V6.83887H52.6289V7.66406H50.1025V7.99414ZM55.5361 12.082H54.5459V9.59375H52.2734V8.76855H54.5459V6.24219H55.5361V12.082ZM55.5361 15.3447H49.2393V16.6016H55.9678V17.4014H48.249V14.583H54.5459V13.4531H48.2236V12.6406H55.5361V15.3447Z"
                                                fill="#FE2E36"
                                              />
                                            </svg>
                                          </div>
                                        );
                                      case '0004':
                                        return (
                                          <div>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="72"
                                              height="24"
                                              viewBox="0 0 72 24"
                                              fill="none"
                                            >
                                              <rect width="72" height="24" rx="12" fill="#2300FF" fillOpacity="0.05" />
                                              <path
                                                d="M17.5 14.6667C18.614 14.6667 19.5 13.7794 19.5 12.6667C19.5 11.5541 18.614 10.6667 17.5 10.6667C16.386 10.6667 15.5 11.5541 15.5 12.6667C15.5 13.7794 16.386 14.6667 17.5 14.6667Z"
                                                fill="#8170E8"
                                              />
                                              <path
                                                d="M23.378 11.4574C23.2216 10.6894 22.9146 9.96003 22.4747 9.31137C22.0437 8.67233 21.4937 8.12231 20.8547 7.69137C20.2052 7.25302 19.4761 6.94613 18.7087 6.78804C18.3054 6.70613 17.8948 6.66592 17.4833 6.66804V5.33337L14.8333 7.33337L17.4833 9.33337V8.00137C17.806 8.00004 18.1287 8.03071 18.44 8.09471C19.0365 8.21763 19.6031 8.45611 20.108 8.79671C20.6056 9.13214 21.0339 9.5604 21.3693 10.058C21.8901 10.8282 22.1679 11.737 22.1667 12.6667C22.1671 13.2907 22.0424 13.9084 21.8 14.4834C21.6828 14.7606 21.539 15.0258 21.3707 15.2754C21.2027 15.5241 21.0112 15.7561 20.7987 15.968C20.1533 16.6121 19.334 17.0539 18.4413 17.2394C17.8205 17.3653 17.1808 17.3653 16.56 17.2394C15.9632 17.1163 15.3963 16.8776 14.8913 16.5367C14.3943 16.2015 13.9665 15.7737 13.6313 15.2767C13.1112 14.5057 12.8333 13.5968 12.8333 12.6667H11.5C11.4999 13.8626 11.8572 15.0313 12.526 16.0227C12.9579 16.6601 13.5073 17.2094 14.1447 17.6414C15.1351 18.3117 16.3041 18.6689 17.5 18.6667C17.9062 18.6671 18.3114 18.6262 18.7093 18.5447C19.4766 18.3865 20.2054 18.0796 20.8547 17.6414C21.1732 17.4261 21.4704 17.1808 21.742 16.9087C22.0144 16.6369 22.2599 16.3395 22.4753 16.0207C23.1452 15.0306 23.5021 13.8621 23.5 12.6667C23.5004 12.2605 23.4595 11.8553 23.378 11.4574Z"
                                                fill="#8170E8"
                                              />
                                              <path
                                                d="M39.6562 17.5283H38.6914V11.6631H37.1553V16.957H36.2031V6.4834H37.1553V10.8125H38.6914V6.24219H39.6562V17.5283ZM33.2959 9.32715C33.2959 10.0212 33.389 10.6771 33.5752 11.2949C33.7656 11.9085 34.0449 12.4523 34.4131 12.9263C34.7812 13.396 35.2298 13.7663 35.7588 14.0371L35.1621 14.8115C34.5993 14.5068 34.1211 14.0879 33.7275 13.5547C33.3382 13.0173 33.042 12.3952 32.8389 11.6885C32.6442 12.4883 32.3459 13.1865 31.9438 13.7832C31.5461 14.3799 31.0531 14.8496 30.4648 15.1924L29.8428 14.4307C30.376 14.1387 30.8288 13.7388 31.2012 13.231C31.5736 12.7231 31.855 12.137 32.0454 11.4727C32.2358 10.8083 32.3311 10.0931 32.3311 9.32715V8.42578H30.1094V7.58789H35.3906V8.42578H33.2959V9.32715ZM51.0264 16.0811H40.6924V15.2432H43.2568V12.1963C42.766 11.9424 42.3851 11.6165 42.1143 11.2188C41.8434 10.8167 41.708 10.3639 41.708 9.86035C41.708 9.28483 41.8836 8.77913 42.2349 8.34326C42.5861 7.90316 43.0728 7.5625 43.6948 7.32129C44.3211 7.08008 45.0342 6.95736 45.834 6.95312C46.6338 6.95736 47.3447 7.08008 47.9668 7.32129C48.5931 7.5625 49.0819 7.90316 49.4331 8.34326C49.7843 8.77913 49.96 9.28483 49.96 9.86035C49.96 10.3555 49.8288 10.8019 49.5664 11.1997C49.304 11.5933 48.9359 11.917 48.4619 12.1709V15.2432H51.0264V16.0811ZM45.834 7.77832C45.2204 7.77409 44.6745 7.85872 44.1963 8.03223C43.7181 8.20573 43.3436 8.45117 43.0728 8.76855C42.8062 9.08171 42.6729 9.44564 42.6729 9.86035C42.6729 10.2751 42.8062 10.6432 43.0728 10.9648C43.3436 11.2822 43.7181 11.5298 44.1963 11.7075C44.6745 11.881 45.2204 11.9678 45.834 11.9678C46.4434 11.9678 46.9871 11.8789 47.4653 11.7012C47.9435 11.5234 48.318 11.2759 48.5889 10.9585C48.8597 10.6411 48.9951 10.2751 48.9951 9.86035C48.9951 9.44564 48.8597 9.08171 48.5889 8.76855C48.318 8.45117 47.9435 8.20573 47.4653 8.03223C46.9871 7.85872 46.4434 7.77409 45.834 7.77832ZM47.459 15.2432V12.5581C46.9554 12.6893 46.4137 12.7549 45.834 12.7549C45.25 12.7549 44.7168 12.6914 44.2344 12.5645V15.2432H47.459ZM55.2744 8.66699C55.2744 9.12826 55.3971 9.57048 55.6426 9.99365C55.8923 10.4126 56.235 10.7829 56.6709 11.1045C57.1068 11.4219 57.6019 11.6631 58.1562 11.8281L57.6738 12.6025C57.0179 12.4079 56.4403 12.1053 55.9409 11.6948C55.4416 11.2843 55.0649 10.8019 54.811 10.2476C54.5656 10.8654 54.1932 11.4071 53.6938 11.8726C53.1987 12.3338 52.6169 12.6745 51.9482 12.8945L51.4658 12.1328C52.016 11.9466 52.5047 11.68 52.9321 11.333C53.3638 10.9818 53.6981 10.5755 53.9351 10.1143C54.1763 9.65299 54.2969 9.17057 54.2969 8.66699V8.42578H51.7451V7.62598H54.2969V6.19141H55.2998V7.62598H57.8262V8.42578H55.2744V8.66699ZM60.7842 13.085H59.7812V10.3047H57.4707V9.47949H59.7812V6.24219H60.7842V13.085ZM57.0391 13.3896C57.8219 13.3896 58.4969 13.4701 59.064 13.6309C59.631 13.7917 60.0648 14.0265 60.3652 14.3354C60.6699 14.6401 60.8223 15.0104 60.8223 15.4463C60.8223 15.8779 60.6699 16.2482 60.3652 16.5571C60.0648 16.866 59.631 17.1009 59.064 17.2617C58.4969 17.4225 57.8219 17.5029 57.0391 17.5029C56.2562 17.5029 55.5812 17.4225 55.0142 17.2617C54.4471 17.1009 54.0112 16.866 53.7065 16.5571C53.4061 16.2482 53.2559 15.8779 53.2559 15.4463C53.2559 15.0104 53.4061 14.6401 53.7065 14.3354C54.0112 14.0265 54.4471 13.7917 55.0142 13.6309C55.5812 13.4701 56.2562 13.3896 57.0391 13.3896ZM57.0391 14.1641C56.4635 14.1683 55.9642 14.2212 55.541 14.3228C55.1221 14.4243 54.8005 14.5724 54.5762 14.7671C54.3519 14.9575 54.2419 15.1839 54.2461 15.4463C54.2419 15.7044 54.3519 15.9308 54.5762 16.1255C54.8047 16.3159 55.1284 16.4619 55.5474 16.5635C55.9705 16.665 56.4678 16.7158 57.0391 16.7158C57.6146 16.7158 58.1118 16.665 58.5308 16.5635C58.9497 16.4619 59.2713 16.3159 59.4956 16.1255C59.7199 15.9351 59.832 15.7087 59.832 15.4463C59.832 15.1839 59.7199 14.9575 59.4956 14.7671C59.2756 14.5724 58.9561 14.4243 58.5371 14.3228C58.1182 14.2212 57.6188 14.1683 57.0391 14.1641Z"
                                                fill="#5744CB"
                                              />
                                            </svg>
                                          </div>
                                        );
                                      default:
                                        return <div>Unknown Status</div>;
                                    }
                                  })()}
                                </div>
                              </TableCell>
                              <TableCell align="center" component="th" scope="row">
                                {(() => {
                                  switch (content.status) {
                                    case '0001':
                                      return (
                                        <div>
                                          <div className="tw-gap-3">
                                            <button
                                              onClick={() => handleAdminReject(content.clubSequence)}
                                              type="button"
                                              data-tooltip-target="tooltip-default"
                                              className="tw-py-2 tw-px-5 tw-mr-3 tw-bg-white tw-text-gray-500  border max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                            >
                                              거절
                                            </button>
                                            <button
                                              onClick={() => handleAdminAccept(content.clubSequence)}
                                              type="button"
                                              data-tooltip-target="tooltip-default"
                                              className="tw-py-2 tw-px-5 tw-bg-blue-600 tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                            >
                                              승인
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    case '0002':
                                      return (
                                        <div>
                                          <div className="tw-text-sm tw-font-medium tw-text-gray-400">
                                            {formatDate(content.resolvedAt).split(' ')[0]}
                                          </div>
                                          <div className="tw-text-sm tw-font-medium tw-text-gray-400">
                                            {formatDate(content.resolvedAt).split(' ')[1]}
                                          </div>
                                        </div>
                                      );
                                    case '0003':
                                      return (
                                        <div>
                                          <div>
                                            <div className="tw-text-sm tw-font-medium tw-text-gray-400">
                                              {formatDate(content.resolvedAt).split(' ')[0]}
                                            </div>
                                            <div className="tw-text-sm tw-font-medium tw-text-gray-400">
                                              {formatDate(content.resolvedAt).split(' ')[1]}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    case '0004':
                                      return (
                                        <div className="tw-gap-3">
                                          <button
                                            onClick={() => handleAdminReject(content.clubSequence)}
                                            type="button"
                                            data-tooltip-target="tooltip-default"
                                            className="tw-py-2 tw-px-5 tw-mr-3 tw-bg-white tw-text-gray-500  border max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                          >
                                            거절
                                          </button>
                                          <button
                                            onClick={() => handleAdminAccept(content.clubSequence)}
                                            type="button"
                                            data-tooltip-target="tooltip-default"
                                            className="tw-py-2 tw-px-5 tw-bg-blue-600 tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                          >
                                            승인
                                          </button>
                                        </div>
                                      );
                                    default:
                                      return <div>Unknown Status</div>;
                                  }
                                })()}

                                {/* <div className="tw-gap-3">
                                  <button
                                    onClick={() => handleAdminReject(content.clubSequence)}
                                    type="button"
                                    data-tooltip-target="tooltip-default"
                                    className="tw-py-2 tw-px-5 tw-mr-3 tw-bg-white tw-text-gray-500  border max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                  >
                                    거절
                                  </button>
                                  <button
                                    onClick={() => handleAdminAccept(content.clubSequence)}
                                    type="button"
                                    data-tooltip-target="tooltip-default"
                                    className="tw-py-2 tw-px-5 tw-bg-blue-600 tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                  >
                                    승인
                                  </button>
                                </div> */}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell align="center" colSpan={10}>
                              <div className="tw-text-sm">데이터가 없습니다</div>
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
