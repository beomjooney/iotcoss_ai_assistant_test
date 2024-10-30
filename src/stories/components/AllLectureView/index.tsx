// QuizClubDetailInfo.jsx
import React, { useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

/** import pagenation */
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import {
  useMyClubList,
  useMyLectureList,
  useMyDashboardQA,
  useMyExcel,
  useMyAllClubExcel,
} from 'src/services/seminars/seminars.queries';

/**icon */
import SettingsIcon from '@mui/icons-material/Settings';
import router from 'next/router';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@mui/material/TextField';

import { Button, Typography, Profile, Modal, ArticleCard } from 'src/stories/components';
const cx = classNames.bind(styles);

//comment
import { useMyAllLectureInfo } from 'src/services/quiz/quiz.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import Markdown from 'react-markdown';
import { useSaveAnswer } from 'src/services/seminars/seminars.mutations';

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
  const [myDashboardQA, setMyDashboardQA] = useState<any>([]);
  const [clubStudySequence, setClubStudySequence] = useState('');
  const [totalQuestionPage, setTotalQuestionPage] = useState(1);
  const [questionPage, setQuestionPage] = useState(1);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [openInputIndex, setOpenInputIndex] = useState(null);
  const [myClubSubTitleParams, setMyClubSubTitleParams] = useState<any>({
    clubSequence: id,
    page,
    clubType: '0200',
    size: 100,
  });

  const [answer, setAnswer] = useState('');
  const { mutate: onSaveAnswer, isSuccess, isError } = useSaveAnswer();
  useDidMountEffect(() => {
    if (isSuccess) {
      setAnswer('');
      refetchMyDashboardQA();
    }
  }, [isSuccess]);

  const [myClubLectureQA, setMyClubLectureQA] = useState<any>({
    clubSequence: selectedClub || id,
    sequence: clubStudySequence,
    data: { questionPage: 1 },
  });

  const [myClubExcel, setMyClubExcel] = useState<any>({
    clubSequence: selectedClub || id,
    sequence: clubStudySequence,
  });

  const [myAllClubExcel, setMyAllClubExcel] = useState<any>({
    clubSequence: selectedClub || id,
    sequence: clubStudySequence,
  });

  const [params, setParams] = useState<any>({ id: '225', page });
  const [myClubParams, setMyClubParams] = useState<any>({
    clubSequence: id,
    sortType: 'ASC',
    isPublished: '',
    page,
  });

  // 강의클럽 대시보드 강의별 참여 현황
  const { isFetched: isDashboardQAFetched, refetch: refetchMyDashboardQA } = useMyDashboardQA(myClubLectureQA, data => {
    console.log('useMyDashboardQA', data);
    setTotalQuestionPage(data?.totalPages);
    setMyDashboardQA(data || []);
  });

  // 강의클럽 대시보드 강의별 참여 현황
  const { isFetched: isExcelFetched, refetch: refetchMyExcel } = useMyExcel(myClubExcel, data => {
    console.log('useMyExcel', data);
    if (data) {
      // blob 데이터를 파일로 저장하는 로직
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '질문/답변.xlsx'); // 다운로드할 파일 이름과 확장자를 설정합니다.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });

  // 강의클럽 대시보드 강의별 참여 현황
  const { isFetched: isAllExcelFetched, refetch: refetchMyAllExcel } = useMyAllClubExcel(myAllClubExcel, data => {
    console.log('useMyExcel', data);
    if (data) {
      // blob 데이터를 파일로 저장하는 로직
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '전체 질문/답변.xlsx'); // 다운로드할 파일 이름과 확장자를 설정합니다.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });

  // 강의클럽 리스트
  const { isFetched: isContentFetched, refetch: refetchMyClub } = useMyLectureList(myClubSubTitleParams, data => {
    setMyClubList(data?.data?.contents || []);
  });

  const { isFetched: isParticipantListFetched, data } = useMyAllLectureInfo(myClubParams, data => {
    console.log('first get data', data);
    setQuizList(data?.contents || []);
    setTotalPage(data?.totalPages);
    // setSelectedClub(data?.contents[0].clubSequence);
    setTotalElements(data?.totalElements);
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

  useDidMountEffect(() => {
    setMyClubLectureQA({
      clubSequence: selectedClub,
      sequence: clubStudySequence,
      data: { questionPage: questionPage },
    });
  }, [questionPage]);

  const handleQuizChange = event => {
    const value = event.target.value;
    setSelectedValue(value);
    setSelectedClub(value);
    setIsPublished('');
    setSortType('ASC');
  };

  useDidMountEffect(() => {
    console.log('clubStudySequence', clubStudySequence);
    refetchMyDashboardQA();
  }, [myClubLectureQA]);

  useDidMountEffect(() => {
    console.log('clubStudySequence', clubStudySequence);
    refetchMyExcel();
  }, [myClubExcel]);

  useDidMountEffect(() => {
    console.log('clubStudySequence', clubStudySequence);
    refetchMyAllExcel();
  }, [myAllClubExcel]);

  const handleQAPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(value);
    setQuestionPage(value);
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
                  // onClick={() => router.push(`/manage-quiz-club/${selectedValue}`)}
                  onClick={() => router.push('/lecture-dashboard/' + selectedValue)}
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
                  sm={6}
                  className="tw-text-xl tw-text-black tw-font-bold"
                >
                  전체 학습 보기
                </Grid>

                <Grid container justifyContent="flex-end" item xs={6} sm={6} style={{ textAlign: 'right' }}>
                  <div className="tw-flex tw-justify-end tw-items-center tw-gap-5">
                    <button
                      onClick={() => {
                        setMyAllClubExcel({
                          clubSequence: selectedClub || id,
                        });
                      }}
                      className="tw-text-sm tw-font-bold border tw-py-3 tw-px-4 tw-text-black tw-rounded"
                    >
                      수업전체 질문/답변 출력
                    </button>

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
                  </div>
                </Grid>
              </Grid>
              <div className="tw-py-3 tw-mb-3" />
              <TableContainer>
                <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                  <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                    <TableRow>
                      <TableCell align="center" width={100}>
                        <div className="tw-font-bold tw-text-base">강의주차</div>
                      </TableCell>
                      <TableCell align="center" width={110}>
                        <div className="tw-font-bold tw-text-base">기간</div>
                      </TableCell>
                      <TableCell align="center">
                        <div className="tw-font-bold tw-text-base">강의제목</div>
                      </TableCell>
                      <TableCell align="center" width={100}>
                        <div className="tw-font-bold tw-text-base">강의형태</div>
                      </TableCell>
                      <TableCell align="center" width={90}>
                        <div className="tw-font-bold tw-text-base">타입</div>
                      </TableCell>
                      <TableCell align="center" width={100}>
                        <div className="tw-font-bold tw-text-base">질의응답</div>
                      </TableCell>
                      <TableCell align="center" width={110}>
                        <div className="tw-font-bold tw-text-base">상세보기</div>
                      </TableCell>
                      <TableCell align="center" width={150}>
                        <div className="tw-font-bold tw-text-base">Excel</div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quizList?.map((item, idx) => {
                      return (
                        <TableRow key={idx}>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-base">
                              {item?.studyOrder}회 <br />
                            </div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-base">
                              <span className="tw-text-sm tw-font-medium tw-text-gray-400">
                                {item?.startDate?.substring(5)}({item?.startDayOfWeek})<br></br>~{' '}
                                {item?.endDate?.substring(5)}({item?.endDayOfWeek})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell align="left" component="th" scope="row">
                            <div className="tw-font-bold tw-text-base">{item?.clubStudyName}</div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-sm">
                              {' '}
                              {item?.clubStudyType === '0100' ? '온라인' : '오프라인'}
                            </div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-sm">{item?.type === 'REGULAR' ? '정규' : '특별'}</div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-sm">{item?.questionCount}건</div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <button
                              onClick={() => {
                                setIsModalOpen(true);
                                setClubStudySequence(item?.clubStudySequence);
                                console.log('setClubStudySequence', selectedClub, item?.clubStudySequence);
                                setMyClubLectureQA({
                                  clubSequence: selectedClub || id,
                                  sequence: item?.clubStudySequence,
                                  data: { questionPage: 1 },
                                });
                              }}
                              className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded"
                            >
                              상세보기
                            </button>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <button
                              onClick={() => {
                                setClubStudySequence(item?.clubStudySequence);
                                console.log('setClubStudySequence', selectedClub, item?.clubStudySequence);
                                setMyClubExcel({
                                  clubSequence: selectedClub || id,
                                  sequence: item?.clubStudySequence,
                                });
                              }}
                              className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded"
                            >
                              질문/답변 출력
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onAfterClose={() => {
          setQuestionPage(1);
          setIsModalOpen(false);
        }}
        title="질의응답"
        maxWidth="1100px"
        maxHeight="800px"
      >
        <div className={cx('seminar-check-popup')}>
          <TableContainer>
            <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
              <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                <TableRow>
                  <TableCell align="left" width={160} className="border-right">
                    <div className="tw-font-bold tw-text-base">학생</div>
                  </TableCell>
                  <TableCell align="left" width={250} className="border-right">
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
                {myDashboardQA?.members?.map((info, memberIndex) => (
                  <React.Fragment key={memberIndex}>
                    {info.questionAnswers.map((questionInfo, questionIndex) => (
                      <TableRow key={questionIndex}>
                        {/* Render the student info only for the first question */}
                        {questionIndex === 0 && (
                          <TableCell
                            align="left"
                            component="th"
                            scope="row"
                            className="border-right"
                            rowSpan={info.questionAnswers.length}
                          >
                            <div className="tw-flex tw-justify-start tw-items-center tw-gap-2">
                              <img
                                src={info?.icon?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
                                className="tw-w-10 tw-h-10 border tw-rounded-full"
                                alt="Profile"
                              />
                              <div className="tw-ml-2">{info?.icon?.nickname}</div>
                            </div>
                          </TableCell>
                        )}

                        {/* Question Column */}
                        <TableCell align="left" component="th" scope="row" className="border-right">
                          <div className="tw-h-[150px] tw-overflow-auto">
                            <div className="tw-font-bold tw-text-sm">{questionInfo?.question}</div>
                          </div>
                        </TableCell>

                        {/* Answer Details Column */}
                        <TableCell align="left" component="th" scope="row" className="border-right">
                          <div className="tw-h-[150px] tw-overflow-auto">
                            <div className="tw-font-bold tw-text-sm">
                              <Markdown className="markdown-container tw-prose tw-pr-2 tw-break-words">
                                {questionInfo?.answer
                                  ? 'AI답변 : ' +
                                    (questionInfo?.answerType === '0200'
                                      ? '(강의자료) : '
                                      : questionInfo?.answerType === '0300'
                                      ? '(일반서치) : '
                                      : '') +
                                    questionInfo?.answer
                                  : null}
                              </Markdown>
                              {questionInfo?.instructorAnswer && (
                                <div className="tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-400">
                                  추가답변 : {questionInfo?.instructorAnswer}
                                </div>
                              )}
                              {questionInfo?.clubContents?.length > 0 && (
                                <div className="tw-mt-2 tw-text-sm tw-flex tw-justify-start tw-items-center tw-flex-wrap tw-gap-2">
                                  <div>강의자료 : </div>
                                  {questionInfo.clubContents.map((fileEntry, fileIndex) => (
                                    <div key={fileIndex} className="border tw-px-2 tw-py-0.5 tw-rounded">
                                      <span
                                        onClick={() => {
                                          window.open(file.url, '_blank');
                                          // onFileDownload(fileEntry.key, fileEntry.name);
                                        }}
                                        className="tw-text-gray-400 tw-cursor-pointer"
                                      >
                                        {fileEntry?.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {openInputIndex === questionInfo?.lectureQuestionSerialNumber && (
                                <div className="tw-mt-2 tw-flex tw-justify-start tw-items-center tw-gap-2">
                                  <TextField
                                    type="text"
                                    placeholder="답변을 추가하세요"
                                    size="small"
                                    className="tw-border tw-px-0 tw-py-0 tw-w-full tw-rounded"
                                    value={answer}
                                    onChange={e => {
                                      setAnswer(e.target.value);
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      console.log(questionInfo);
                                      if (answer === '') {
                                        alert('답변을 입력해주세요.');
                                      } else {
                                        onSaveAnswer({
                                          clubSequence: questionInfo.clubSequence,
                                          clubStudySequence: questionInfo.clubStudySequence,
                                          lectureQuestionSerialNumber: questionInfo.lectureQuestionSerialNumber,
                                          answer: answer,
                                        });
                                      }
                                    }}
                                    className="tw-w-[80px] tw-text-sm tw-font-bold border tw-py-2.5 tw-px-3 tw-rounded"
                                  >
                                    저장
                                  </button>
                                  <button
                                    onClick={e => {
                                      e.preventDefault();
                                      setOpenInputIndex(null);
                                    }}
                                    className="tw-w-[80px] tw-text-sm tw-font-bold border tw-py-2.5 tw-px-3 tw-rounded"
                                  >
                                    삭제
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Render files if present */}
                            {questionInfo?.files?.length > 0 && (
                              <div className="tw-mt-2 tw-text-sm tw-flex tw-justify-start tw-items-center tw-flex-wrap tw-gap-2">
                                <div>강의자료 : </div>
                                {questionInfo.files.map((fileEntry, fileIndex) => (
                                  <div key={fileIndex} className="border tw-px-2 tw-py-0.5 tw-rounded">
                                    <span
                                      onClick={() => {
                                        window.open(fileEntry.url, '_blank');
                                        // onFileDownload(fileEntry.key, fileEntry.name);
                                      }}
                                      className="tw-text-gray-400 tw-cursor-pointer"
                                    >
                                      {fileEntry?.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reference URLs */}
                            {questionInfo?.referenceUrls && (
                              <div className="tw-mt-2 tw-text-sm tw-flex tw-justify-start tw-items-center tw-flex-wrap tw-gap-2">
                                <div>출처 : </div>
                                <div className="border tw-px-2 tw-py-0.5 tw-rounded">
                                  <span className="tw-text-gray-400 tw-cursor-pointer">
                                    {questionInfo?.referenceUrls}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Additional Answer Button Column */}
                        <TableCell align="center" component="th" scope="row">
                          <button
                            onClick={e => {
                              e.preventDefault();
                              setIsInputOpen(true);
                              setOpenInputIndex(questionInfo?.lectureQuestionSerialNumber);
                            }}
                            className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded"
                          >
                            +
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            {myDashboardQA?.members?.length === 0 && (
              <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[20vh]')}>
                <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">데이터가 없습니다.</p>
              </div>
            )}
            <div className="tw-flex tw-justify-center tw-items-center tw-my-5">
              <Pagination
                count={totalQuestionPage}
                size="small"
                siblingCount={0}
                page={questionPage}
                renderItem={item => (
                  <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                )}
                onChange={handleQAPageChange}
              />
            </div>
          </TableContainer>
        </div>
      </Modal>
    </div>
  );
};

export default AllLectureView;
