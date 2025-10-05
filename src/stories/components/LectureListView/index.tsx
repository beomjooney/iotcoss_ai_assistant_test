import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useMyDashboardQA, useLectureAboutDetailInfo } from 'src/services/seminars/seminars.queries';
import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { Modal } from 'src/stories/components';
import { useLectureQAInfo, useLectureStudyQAInfo, useQuizFileDownload } from 'src/services/quiz/quiz.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useSessionStore } from '../../../../src/store/session';
import { useStudyOrderLabel } from 'src/hooks/useStudyOrderLabel';
import ChatbotModal from 'src/stories/components/ChatBot';
import Markdown from 'react-markdown';

const cx = classNames.bind(styles);

const LectureListView = ({ border, id, clubStudySequence }) => {
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [myClubList, setMyClubList] = useState<any>([]);
  const [quizList, setQuizList] = useState<any>([]);
  const [studyQAInfo, setStudyQAInfo] = useState<any>([]);
  const [studySequence, setStudySequence] = useState(clubStudySequence);
  const [selectedClub, setSelectedClub] = useState<any>(id);
  const [sortType, setSortType] = useState('');
  const [isPublished, setIsPublished] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const { menu, token, logged, studyOrderLabelType } = useSessionStore.getState();
  const { studyOrderLabel } = useStudyOrderLabel(studyOrderLabelType);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  let [key, setKey] = useState('');
  let [fileName, setFileName] = useState('');
  const [totalQuestionPage, setTotalQuestionPage] = useState(1);
  const [myDashboardQA, setMyDashboardQA] = useState<any>([]);
  const [questionPage, setQuestionPage] = useState(1);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [openInputIndex, setOpenInputIndex] = useState(null);
  const [clubAbout, setClubAbout] = useState<any>({});
  const [isClient, setIsClient] = useState(false); // 클라이언트 사이드에서만 렌어링하도록 상태 추가
  const [includeReferenceToAnswer, setIncludeReferenceToAnswer] = useState(false);

  useEffect(() => {
    setIsClient(true); // 클라이언트 사이드에서 상태를 true로 설정
  }, []);

  useEffect(() => {
    if (clubStudySequence) {
      console.log('clubStudySequence', clubStudySequence);
      setStudySequence(clubStudySequence); // Update state when clubStudySequence is available
    }
  }, [clubStudySequence]);

  const [myClubParams, setMyClubParams] = useState<any>({
    clubSequence: id,
    clubStudySequence: studySequence,
    questionStatuses: '',
    page,
  });

  const [myStudyClubParams, setMyStudyClubParams] = useState<any>({
    clubSequence: id,
    clubStudySequence: studySequence,
  });

  const { isFetched: isStudyQAInfoFetched } = useLectureStudyQAInfo(myStudyClubParams, data => {
    console.log('second get data', data);
    setStudyQAInfo(data || []);
  });

  const { isFetched: isQAInfoFetched } = useLectureQAInfo(myClubParams, data => {
    console.log('first get data', data);
    setQuizList(data?.contents || []);
    setTotalPage(data?.totalPages);
    setTotalElements(data?.totalElements);
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useDidMountEffect(() => {
    setMyClubParams({
      clubSequence: selectedClub,
      clubStudySequence: studySequence,
      questionStatuses: sortType,
      page: page,
    });
  }, [sortType, page, selectedClub]);

  const handleChangeQuiz = event => {
    if (event.target.value === '') {
      setSortType('');
      setIsPublished('true');
    } else {
      setIsPublished('');
      setSortType(event.target.value);
    }
  };

  const { isFetched: isParticipantListFetcheds } = useQuizFileDownload(key, data => {
    if (data) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // 다운로드할 파일 이름과 확장자를 설정합니다.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setKey('');
      setFileName('');
    }
  });

  // 퀴즈 소개 정보 조회
  const { isFetched: isClubAboutFetched, refetch: refetchClubAbout } = useLectureAboutDetailInfo(id, data => {
    console.log('useLectureAboutDetail', data);
    setClubAbout(data);
    setMyClubList(data?.clubStudies);
    console.log('clubMemberStatus', data?.clubMemberStatus);
    console.log('clubStatus ', data?.clubStatus);
    console.log('includeReferenceToAnswer ', data?.lectureClub?.includeReferenceToAnswer);
    setIncludeReferenceToAnswer(data?.lectureClub?.includeReferenceToAnswer);
  });

  const [myClubLectureQA, setMyClubLectureQA] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    sequence: studySequence,
    data: { questionPage: 1 },
  });

  // 강의클럽 대시보드 강의별 참여 현황
  const { isFetched: isDashboardQAFetched, refetch: refetchMyDashboardQA } = useMyDashboardQA(myClubLectureQA, data => {
    console.log('useMyDashboardQA', data);
    setTotalQuestionPage(data?.totalPages);
    setMyDashboardQA(data || []);
  });

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    if (!includeReferenceToAnswer) {
      alert('강의자료를 다운로드 할 수 없습니다.');
      return;
    } else {
      setKey(key);
      setFileName(fileName);
    }
  };

  const handleQAPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(value);
    setQuestionPage(value);
  };

  useDidMountEffect(() => {
    console.log('clubStudySequence', clubStudySequence);
    refetchMyDashboardQA();
  }, [myClubLectureQA]);

  useDidMountEffect(() => {
    console.log('questionPage', questionPage);
    setMyClubLectureQA({
      clubSequence: selectedClub?.clubSequence || id,
      sequence: clubStudySequence,
      data: { questionPage: questionPage },
    });
  }, [questionPage]);

  const handleQuizChange = event => {
    const value = event.target.value;
    const selectedSession = myClubList?.find(session => {
      return session.clubStudySequence === Number(value);
    });

    console.log('value', value);
    location.href = `/lecture-list/${id}?clubStudySequence=${value}`;
    setStudySequence(value);
    console.log(selectedSession);
  };

  return (
    <div className={`tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white ${borderStyle}`}>
      <div className="tw-pt-[35px]">
        <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden border-t-0 border-r-0 border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">강의클럽</p>
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
              강의 상세보기
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
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">Q & A</p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              Q&A 보기
            </p>
          </div>
        </div>
        <Divider className="tw-mb-5" />
        <div className="tw-flex tw-items-center tw-mt-6">
          <select
            className="tw-h-14 form-select block w-full  tw-font-bold tw-px-4"
            onChange={handleQuizChange}
            value={studySequence}
            aria-label="Default select example"
          >
            {isClubAboutFetched &&
              myClubList?.map((session, idx) => {
                return (
                  <option
                    key={idx}
                    className="tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer"
                    value={session?.clubStudySequence}
                  >
                    강의 : {session?.clubStudyName}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="tw-text-xl tw-text-black  tw-font-bold tw-mt-6">{studyOrderLabel} 정보</div>

        <Divider className="tw-py-3 tw-mb-3" />
        <div className="tw-text-black tw-my-5">
          <div className="tw-text-lg tw-font-medium tw-py-3">
            {studyQAInfo?.studyOrder}
            {studyOrderLabel} : {studyQAInfo?.startDate} ({studyQAInfo?.startDayOfWeek})
          </div>
          <div className="tw-text-lg tw-font-medium tw-py-3">강의URL : {studyQAInfo?.clubStudyUrl}</div>
        </div>
        <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg">
          <div className={cx('content-wrap')}>
            <div className={cx('', 'tw-mt-10')}>
              <Grid container direction="row" alignItems="center" rowSpacing={0}>
                <Grid
                  container
                  item
                  justifyContent="flex-start"
                  xs={6}
                  sm={9}
                  className="tw-text-xl tw-text-black tw-font-bold"
                >
                  질의응답내역 ({totalElements})
                </Grid>

                <Grid container justifyContent="flex-end" item xs={6} sm={3} style={{ textAlign: 'right' }}>
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
              <Divider className="tw-py-3 tw-mb-5" />
              <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6  tw-my-5">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                    정렬 :
                  </p>

                  <RadioGroup value={sortType} onChange={handleChangeQuiz} row>
                    <FormControlLabel
                      value=""
                      control={
                        <Radio
                          sx={{
                            color: '#ced4de',
                            '&.Mui-checked': { color: '#e11837' },
                          }}
                          icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                          checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                        />
                      }
                      label={
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                          모두보기
                        </p>
                      }
                    />

                    <FormControlLabel
                      value="0200"
                      control={
                        <Radio
                          sx={{
                            color: '#ced4de',
                            '&.Mui-checked': { color: '#e11837' },
                          }}
                          icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                          checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                        />
                      }
                      label={
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                          강의자료에서 답변
                        </p>
                      }
                    />

                    <FormControlLabel
                      value="0300"
                      control={
                        <Radio
                          sx={{
                            color: '#ced4de',
                            '&.Mui-checked': { color: '#e11837' },
                          }}
                          icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                          checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                        />
                      }
                      label={
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                          일반 서치 답변
                        </p>
                      }
                    />
                  </RadioGroup>
                </div>
              </div>

              {quizList.length === 0 && (
                <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[50vh]')}>
                  <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">
                    질의응답내역 데이터가 없습니다.
                  </p>
                </div>
              )}

              {quizList.map((item, index) => {
                return (
                  <div className="" key={index}>
                    <div className="tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 tw-py-1 tw-rounded-xl tw-my-3">
                      <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                        <img
                          alt="default_profile_image"
                          className="tw-w-10 tw-h-10 border tw-rounded-full"
                          src={item?.questioner?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
                        />
                        <div className="tw-text-xs tw-text-left tw-text-black tw-mt-2">
                          {item?.questioner?.nickname}
                        </div>
                      </div>
                      <div className="tw-flex-auto tw-px-5 tw-w-3/12">
                        <div className={`tw-font-medium tw-text-black`}>{item?.question}</div>
                      </div>
                      <div className="tw-pr-4"></div>
                    </div>
                    <div className=" border  tw-px-4 tw-py-5 tw-rounded-lg tw-mt-0">
                      <div className="tw-flex tw-items-center ">
                        <div className="tw-w-1/12 tw-text-lg tw-font-medium  tw-flex tw-items-start tw-justify-center">
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 relative"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <path
                              d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                              stroke="#9CA5B2"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="tw-w-1/12 tw-text-sm tw-text-black  tw-font-bold  ">AI답변 : </div>
                        <div className="tw-text-sm tw-w-10/12">
                          <div className="tw-text-gray-500">
                            <div className="tw-text-gray-500">
                              {item?.questionStatus === '0200'
                                ? '[강의자료기반 답변] '
                                : item?.questionStatus === '0201'
                                ? '[일반지식기반 답변] '
                                : item?.questionStatus === '0300'
                                ? '[교수자 답변] '
                                : item?.questionStatus === '0130'
                                ? '[일반지식기반 미검색] '
                                : item?.questionStatus === '0110'
                                ? '[금지어답변불가] '
                                : item?.questionStatus
                                ? '[답변불가]'
                                : ''}
                            </div>

                            <Markdown className="markdown-container tw-prose tw-pr-2 tw-break-words">
                              {item?.ai1stAnswer}
                            </Markdown>
                          </div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center ">
                        <div className="tw-w-2/12 tw-text-lg tw-font-medium  tw-flex tw-items-start tw-justify-center"></div>
                        <div className="tw-text-sm tw-w-10/12">
                          {item?.ai1stContents?.files?.length > 0 && includeReferenceToAnswer && (
                            <div className="tw-flex ">
                              <div className="tw-text-left tw-text-sm">
                                <ul className="">
                                  {item?.ai1stContents?.files?.map((file, index) => (
                                    <div
                                      key={index}
                                      onClick={() => {
                                        onFileDownload(file.key, file.name);
                                      }}
                                      className="tw-underline tw-text-blue-500 tw-cursor-pointer tw-p-1 tw-pl-0   tw-my-1"
                                    >
                                      ㄴ첨부된파일 : {file.name}
                                    </div>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {item?.instructor1stAnswer && (
                      <div className="tw-flex tw-items-center border tw-border tw-px-4 tw-py-5 tw-rounded-lg tw-mt-3">
                        <div className="tw-w-1/12 tw-text-lg tw-font-medium  tw-flex tw-items-start tw-justify-center">
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 relative"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <path
                              d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                              stroke="#9CA5B2"
                              stroke-width="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="tw-w-1/12 tw-text-sm tw-text-black  tw-font-bold  ">교수답변 : </div>
                        <div className="tw-text-sm tw-w-11/12">
                          <span className="tw-text-gray-500">{item?.instructor1stAnswer}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {isClient && !modalIsOpen && logged && menu.use_lecture_club && (
          <div
            className="tw-fixed tw-bottom-0 tw-right-0  tw-mr-4 md:tw-mr-10 tw-mb-4 md:tw-mb-8 tw-cursor-pointer tw-z-10"
            onClick={() => setModalIsOpen(true)}
          >
            <img alt="chatbot" className="tw-w-[140px] tw-h-[140px]" src="/assets/images/main/chatbot.png" />
          </div>
        )}
        {isClient && <ChatbotModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} token={token} />}
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
                          <div className="tw-font-bold tw-text-sm">{questionInfo?.question}</div>
                        </TableCell>

                        {/* Answer Details Column */}
                        <TableCell align="left" component="th" scope="row" className="border-right">
                          <div className="tw-h-[150px] tw-overflow-auto">
                            <div className="tw-font-bold tw-text-sm">
                              <Markdown className="markdown-container tw-prose tw-pr-2 tw-break-words">
                                {questionInfo?.answer
                                  ? 'AI답변 : ' +
                                    (questionInfo?.answerType === '0200'
                                      ? '(강의자료기반 답변) : '
                                      : questionInfo?.answerType === '0201'
                                      ? '(일반지식기반 답변) : '
                                      : questionInfo?.answerType === '0300'
                                      ? '(교수자 답변) : '
                                      : questionInfo?.answerType === '0130'
                                      ? '(일반지식기반 미검색) : '
                                      : questionInfo?.answerType === '0110'
                                      ? '(금지어답변불가) : '
                                      : '(답변불가) : ') +
                                    questionInfo?.answer
                                  : null}
                              </Markdown>
                              {openInputIndex === questionInfo?.lectureQuestionSerialNumber && (
                                <div className="tw-mt-2 tw-flex tw-justify-start tw-items-center tw-gap-2">
                                  <TextField
                                    type="text"
                                    placeholder="답변을 추가하세요"
                                    size="small"
                                    className="tw-border tw-px-0 tw-py-0 tw-w-full tw-rounded"
                                  />
                                  <button className="tw-w-[80px] tw-text-sm tw-font-bold border tw-py-2.5 tw-px-3 tw-rounded">
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
                                        onFileDownload(fileEntry.key, fileEntry.name);
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
            <div className="tw-flex tw-justify-center tw-items-center tw-my-10">
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

export default LectureListView;
