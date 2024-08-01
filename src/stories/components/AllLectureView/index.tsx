// QuizClubDetailInfo.jsx
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

/** import pagenation */
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useMyClubList } from 'src/services/seminars/seminars.queries';

/**icon */
import SettingsIcon from '@mui/icons-material/Settings';
import router from 'next/router';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { Button, Typography, Profile, Modal, ArticleCard } from 'src/stories/components';
const cx = classNames.bind(styles);

//comment
import {
  useQuizAnswerDetail,
  useQuizRankDetail,
  useQuizSolutionDetail,
  useQuizMyClubInfo,
} from 'src/services/quiz/quiz.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';

const AllLectureView = ({ border, id }) => {
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
  // const [activeTab, setActiveTab] = useState('myQuiz');
  const [activeTab, setActiveTab] = useState('community');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [myClubList, setMyClubList] = useState<any>([]);
  const [quizList, setQuizList] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState(id);
  const [selectedClub, setSelectedClub] = useState<any>(id);
  const [sortType, setSortType] = useState('ASC');
  const [isPublished, setIsPublished] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [params, setParams] = useState<any>({ id: '225', page });
  const [myClubParams, setMyClubParams] = useState<any>({
    clubSequence: id,
    sortType: 'ASC',
    isPublished: '',
    page,
  });

  // 퀴즈클럽 리스트
  const { isFetched: isContentFetched, refetch: refetchMyClub } = useMyClubList({}, data => {
    setMyClubList(data?.data?.contents || []);
  });

  const { isFetched: isParticipantListFetched, data } = useQuizMyClubInfo(myClubParams, data => {
    console.log('first get data', data);
    setQuizList(data?.contents || []);
    setTotalPage(data?.totalPages);
    // setSelectedClub(data?.contents[0].clubSequence);
    setTotalElements(data?.totalElements);
    console.log(data);
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useDidMountEffect(() => {
    setMyClubParams({
      clubSequence: selectedClub,
      sortType: sortType,
      page: page,
      isPublished: isPublished,
    });
  }, [sortType, page, selectedClub]);

  const handleQuizChange = event => {
    const value = event.target.value;
    setSelectedValue(value);
    setSelectedClub(value);
    setIsPublished('');
    setSortType('ASC');
  };

  const handleChangeQuiz = event => {
    if (event.target.value === '') {
      setSortType('');
      setIsPublished('true');
    } else {
      setIsPublished('');
      setSortType(event.target.value);
    }
  };

  return (
    <div className={`tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white ${borderStyle}`}>
      <div className="tw-pt-[35px]">
        <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden border-t-0 border-r-0 border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              My강의클럽
            </p>
            <svg
              width={17}
              height={16}
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[15.75px] tw-h-[15.75px] tw-relative"
              preserveAspectRatio="none"
            >
              <path
                d="M6.96925 11.25L10.3438 7.8755L6.96925 4.50101L6.40651 5.06336L9.21905 7.8755L6.40651 10.6877L6.96925 11.25Z"
                fill="#313B49"
              />
            </svg>
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              강의 대시보드
            </p>
            <svg
              width={17}
              height={16}
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[15.75px] tw-h-[15.75px] tw-relative"
              preserveAspectRatio="none"
            >
              <path
                d="M6.96925 11.25L10.3438 7.8755L6.96925 4.50101L6.40651 5.06336L9.21905 7.8755L6.40651 10.6877L6.96925 11.25Z"
                fill="#313B49"
              />
            </svg>
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              전체 학습보기
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              전체 학습 보기
            </p>
          </div>
        </div>

        <Divider className="tw-mb-5" />
        <div className="tw-flex tw-items-center tw-mt-6">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={11.1} className="tw-font-bold tw-text-xl">
              <select
                className="tw-h-14 form-select block w-full tw-font-bold tw-px-8"
                onChange={handleQuizChange}
                value={selectedValue}
                aria-label="Default select example"
              >
                {isContentFetched &&
                  myClubList?.map((session, idx) => {
                    return (
                      <option
                        key={idx}
                        className="tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer"
                        value={session?.clubSequence}
                      >
                        강의명 : {session?.clubName}
                      </option>
                    );
                  })}
              </select>
            </Grid>

            <Grid item xs={0.9} justifyContent="flex-end" className="tw-flex">
              {/* {contents?.isBeforeOpening ? ( */}
              <div className="">
                <button
                  type="button"
                  onClick={() => router.push(`/manage-quiz-club/${selectedValue}`)}
                  className="tw-h-14  tw-text-black tw-bg-[#CED4DE] border tw-font-medium tw-rounded-md tw-text-sm tw-px-6 tw-py-2 "
                >
                  <SettingsIcon className="tw-bg-[#CED4DE] tw-text-white" />
                </button>
              </div>
            </Grid>
          </Grid>
        </div>
        {/* Content Section */}
        <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg">
          <div className={cx('content-wrap')}>
            <div className={cx('container', 'tw-mt-10')}>
              <Grid container direction="row" alignItems="center" rowSpacing={0}>
                <Grid
                  container
                  item
                  justifyContent="flex-start"
                  xs={6}
                  sm={10}
                  className="tw-text-xl tw-text-black tw-font-bold"
                >
                  퀴즈목록 ({totalElements})
                </Grid>

                <Grid container justifyContent="flex-end" item xs={6} sm={2} style={{ textAlign: 'right' }}>
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
              <div className="tw-py-3 tw-mb-3" />
              <TableContainer>
                <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                  <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                    <TableRow>
                      <TableCell align="center" width={100}>
                        <div className="tw-font-bold tw-text-base">회차</div>
                      </TableCell>
                      <TableCell align="center">
                        <div className="tw-font-bold tw-text-base">강의제목</div>
                      </TableCell>
                      <TableCell align="center" width={110}>
                        <div className="tw-font-bold tw-text-base">강의형태</div>
                      </TableCell>
                      <TableCell align="center" width={110}>
                        <div className="tw-font-bold tw-text-base">타입</div>
                      </TableCell>
                      <TableCell align="center" width={100}>
                        <div className="tw-font-bold tw-text-base">질의응답</div>
                      </TableCell>
                      <TableCell align="center" width={110}>
                        <div className="tw-font-bold tw-text-base">상세보기</div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" component="th" scope="row">
                        <div className="tw-font-bold tw-text-base">
                          1회 <br />
                          <span className="tw-text-sm tw-font-medium tw-text-gray-400">07-01(월)</span>
                        </div>
                      </TableCell>
                      <TableCell align="left" component="th" scope="row">
                        <div className="tw-font-bold tw-text-base">1회차 임베디드 시스템 관련 제목</div>
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                        <div className="tw-font-bold tw-text-sm">오프라인</div>
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                        <div className="tw-font-bold tw-text-sm">정규</div>
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                        <div className="tw-font-bold tw-text-sm">17건</div>
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                        <button
                          onClick={() => {
                            setIsModalOpen(true);
                          }}
                          className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded"
                        >
                          상세보기
                        </button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} title="질의응답" maxWidth="900px">
        <div className={cx('seminar-check-popup')}>
          <TableContainer>
            <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
              <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                <TableRow>
                  <TableCell align="left" width={150} className="border-right">
                    <div className="tw-font-bold tw-text-base">학생</div>
                  </TableCell>
                  <TableCell align="left" width={300} className="border-right">
                    <div className="tw-font-bold tw-text-base">질문</div>
                  </TableCell>
                  <TableCell align="left" className="border-right">
                    <div className="tw-font-bold tw-text-base">답변내역</div>
                  </TableCell>
                  <TableCell align="left" width={100}>
                    <div className="tw-font-bold tw-text-base">추가답변</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center" component="th" scope="row" className="border-right">
                    <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
                      <img
                        src={'/assets/avatars/3.jpg'}
                        className="tw-w-10 tw-h-10 border tw-rounded-full"
                        alt="Profile"
                      />
                      <div className="tw-ml-2">김흐흐</div>
                    </div>
                  </TableCell>
                  <TableCell align="left" component="th" scope="row" className="border-right">
                    <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                  </TableCell>
                  <TableCell align="left" component="th" scope="row" className="border-right">
                    <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                    <div className="tw-font-bold tw-text-sm">AI답변 : 모데로가 토크나이저거가 뭐야?</div>
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    <button className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded">
                      +
                    </button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" component="th" scope="row" className="border-right" rowSpan={2}>
                    <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
                      <img
                        src={'/assets/avatars/3.jpg'}
                        className="tw-w-10 tw-h-10 border tw-rounded-full"
                        alt="Profile"
                      />
                      <div className="tw-ml-2">김찬영</div>
                    </div>
                  </TableCell>
                  <TableCell align="left" component="th" scope="row" className="border-right">
                    <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                  </TableCell>
                  <TableCell align="left" component="th" scope="row" className="border-right">
                    <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                    <div className="tw-font-bold tw-text-sm">AI답변 : 모데로가 토크나이저거가 뭐야?</div>
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    <button className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded">
                      +
                    </button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" component="th" scope="row" className="border-right">
                    <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                  </TableCell>
                  <TableCell align="left" component="th" scope="row" className="border-right">
                    <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                    <div className="tw-font-bold tw-text-sm">AI답변 : 모데로가 토크나이저거가 뭐야?</div>
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    <button className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded">
                      +
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Modal>
    </div>
  );
};

export default AllLectureView;
