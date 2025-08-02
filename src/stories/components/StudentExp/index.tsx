import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import ReactModal from 'react-modal';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, TextField, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { Toggle, Tag } from 'src/stories/components';
import CircularProgress from '@mui/material/CircularProgress';
import { useAIQuizSave, useAIQuizAnswer, useAIQuizAnswerFeedback } from 'src/services/quiz/quiz.mutations';
import { useClubAdminList } from 'src/services/studyroom/studyroom.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useClubAboutDetailInfo, useSeminarList } from 'src/services/seminars/seminars.queries';
import { UseQueryResult } from 'react-query';
import QuizSolutionDetailDemo from 'src/stories/components/QuizSolutionDetailDemo';
import { useQuizSolutionDetail, useQuizGetAIMyAnswer } from 'src/services/quiz/quiz.queries';
import { useStudyRoomList } from 'src/services/studyroom/studyroom.queries';
import { useClubDetailQuizListDemo } from 'src/services/quiz/quiz.queries';
import { useAIQuizMyAnswerSavePut } from 'src/services/quiz/quiz.mutations';

const cx = classNames.bind(styles);
Modal.setAppElement('#__next'); // Modal 접근성 설정

const StudentExpModal = ({ title, isOpen, onRequestClose, closable = true }) => {
  const [value, setValue] = useState('one');
  const [contentType, setContentType] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedModifyQuestion, setEditedModifyQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');
  const [quizList, setQuizList] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [key, setKey] = useState('');
  const [fileName, setFileName] = useState('');
  const [quizKeyWorlds, setQuizKeyWorlds] = useState([]);
  const [modelAnswer, setModelAnswer] = useState('');
  const [quizCount, setQuizCount] = useState(3);
  const [flag, setFlag] = useState(false);
  const [myClubList, setMyClubList] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any>([]);
  const [memberParams, setMemberParams] = useState<any>({ page: page, keyword: search, clubType: '0100' });
  const [selectedValue, setSelectedValue] = useState('');
  const [sortType, setSortType] = useState('');
  const [isPublished, setIsPublished] = useState('');
  const [pageQuiz, setPageQuiz] = useState(1);
  const [sortQuizType, setSortQuizType] = useState('ASC');
  const [totalQuizPage, setTotalQuizPage] = useState(1);
  const [quizFlag, setQuizFlag] = useState('one');
  const [quizParams, setQuizParams] = useState<any>({});
  const [clubQuizThreads, setClubQuizThreads] = useState<any>([]);
  const [isHideAI, setIsHideAI] = useState(true);
  const [isAIData, setIsAIData] = useState<any>({});

  useEffect(() => {
    document.body.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, []);

  const { isFetched: isMemberListFetched, refetch: QuizRefetchBadge } = useStudyRoomList(memberParams, data => {
    console.log('memberList', data, data?.data?.contents[0]?.clubSequence);
    setSelectedClub(data?.data?.contents[0]?.clubSequence);
    setContents(data?.data?.contents);
    setTotalPage(data?.data?.totalPages);
    setPage(data?.data?.page);
  });

  const { isFetched: isQuizListFetched, refetch } = useClubDetailQuizListDemo(params, selectedClub, data => {
    console.log('quizList', data?.contents);
    setSelectedValue(data?.contents[0]?.quizSequence);
    setQuizList(data?.contents);
    setTotalPage(data?.totalPages);
    // setTotalElements(data?.totalElements);
  });

  const {
    isFetched: isParticipantListFetched,
    refetch: refetchGetStatusQuizTemp,
    data,
  } = useQuizSolutionDetail(selectedValue, selectedClub);

  const { isFetched: isQuizGetanswer, refetch: refetchQuizAnswer } = useQuizGetAIMyAnswer(quizParams, data => {
    console.log('data', data);
    setClubQuizThreads(data);
    data.clubQuizThreads.map(item => {
      // Check if the threadType is '0004' and return null to hide the div
      if (item?.threadType === '0004') {
        setIsHideAI(false);
        setIsAIData(item);
        console.log('false');
      }
    });
  });
  const {
    mutate: onAIQuizAnswerSavePut,
    isSuccess: answerSuccessSavePut,
    isError: answerErrorSavePut,
    data: aiQuizAnswerDataSavePut,
  } = useAIQuizMyAnswerSavePut();

  const { mutate: onAIQuizSave, isSuccess: updateSuccess, isError: updateError, data: aiQuizData } = useAIQuizSave();
  const {
    mutate: onAIQuizAnswer,
    isSuccess: answerSuccess,
    isError: answerError,
    data: aiQuizAnswerData,
  } = useAIQuizAnswer();

  const {
    mutate: onAIQuizAnswerFeedback,
    isSuccess: answerFeedbackSuccess,
    isError: answerFeedbackError,
    data: aiQuizAnswerFeedbackData,
  } = useAIQuizAnswerFeedback();

  const handleClubChange = event => {
    const value = event.target.value;
    console.log('value', value);
    // setSelectedValue(contents[0].clubSequence);
    setSelectedClub(value);
    setIsPublished('');
    setSortType('ASC');
  };
  const handleQuizChange = event => {
    const value = event.target.value;
    setSelectedValue(value);
    console.log(value);
  };

  useEffect(() => {
    if (answerSuccessSavePut) {
      refetchQuizAnswer();
      setIsLoadingAI(false);
    }
  }, [answerSuccessSavePut, answerErrorSavePut]);

  useDidMountEffect(() => {
    refetchQuizAnswer();
  }, [quizParams]);

  useEffect(() => {
    if (selectedQuiz) {
      refetchGetStatusQuizTemp();
    }
  }, [selectedQuiz]);

  useEffect(() => {
    if (selectedClub) {
      console.log('selectedClub', selectedClub);
      refetch();
    }
  }, [selectedClub]);

  useEffect(() => {
    if (answerFeedbackSuccess) {
      setIsLoadingFeedback(false);
    }
    if (answerFeedbackError) {
      alert('AI 피드백 생성 중 오류가 발생했습니다.');
      setIsLoadingFeedback(false);
    }
  }, [answerFeedbackSuccess, answerFeedbackError]);

  useEffect(() => {
    if (answerSuccess) {
      setIsLoadingAI(false);
    }

    if (answerError) {
      alert('AI 퀴즈 생성 중 오류가 발생했습니다.');
      setIsLoadingAI(false);
    }
  }, [answerSuccess, answerError]);

  useEffect(() => {
    if (aiQuizData) {
      setQuizList((aiQuizData as any).generatedQuizzes);
      // setQuizKeyWorlds((aiQuizData as any).contentKeywords);
    }
  }, [aiQuizData]);

  useEffect(() => {
    if (updateSuccess) {
      setIsLoading(false);
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (aiQuizAnswerData) {
      console.log(aiQuizAnswerData);
      setModelAnswer(aiQuizAnswerData[0].answer);
      setQuizKeyWorlds(aiQuizAnswerData[0].keywords);
    }
  }, [aiQuizAnswerData]);

  const handleAIQuizClick = () => {
    console.log('ai quiz click');
    // 유효성 검사
    if (!contentType) {
      alert('지식콘텐츠 유형을 선택하세요.');
      return;
    }

    if (contentType === '0320' && !fileList[0]) {
      alert('파일을 추가해주세요.');
      return;
    }

    if (!contentTitle) {
      alert('지식콘텐츠 제목을 입력해주세요.');
      return;
    }

    console.log('AI 퀴즈 클릭');
    const formData = new FormData();

    const params = {
      isNew: true,
      contentType: contentType,
      jobs: [],
      jobLevels: [],
      quizCount: quizCount,
    };

    if (contentType === '0320') {
      formData.append('file', fileList[0]);
    } else {
      params['contentUrl'] = contentUrl;
    }

    const jsonString = JSON.stringify(params);
    const blob = new Blob([jsonString], { type: 'application/json' });
    formData.append('request', blob);

    // 로딩 상태를 true로 설정
    setIsLoading(true);
    onAIQuizSave(formData);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    // setValue(newValue);
    // if (newValue === 'one') {
    //   setModelAnswer('');
    // }
  };

  const handlerSave = () => {
    // Uncomment and replace with actual API call
    setIsLoadingAI(true);
    onAIQuizAnswerSavePut({
      club: selectedClub,
      quiz: selectedValue,
    });
  };

  const handleAnswerChange = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
    setEditedAnswer(e.target.value);
  };

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    setKey(key);
    setFileName(fileName);
  };

  useEffect(() => {
    if (updateError) {
      alert('AI 퀴즈 생성 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  }, [updateError]);

  const handleAIAnswerClick = async (quizIndex, quiz) => {
    if (contentType !== '0320' && !contentUrl) {
      alert('콘텐츠 URL을 입력해주세요.');
      return false;
    }

    // Find the specific quiz in quizList and create formattedQuizList
    const params = {
      isNew: true,
      contentType: contentType,
      jobs: [],
      jobLevels: [],
      quizzes: [
        {
          no: quizIndex,
          question: quiz,
        },
      ],
    };

    const formData = new FormData();

    if (contentType === '0320') {
      formData.append('file', fileList[0]);
    } else {
      params['contentUrl'] = contentUrl;
    }

    // 객체를 JSON 문자열로 변환합니다.
    const jsonString = JSON.stringify(params);
    // FormData에 JSON 문자열을 추가하면서 명시적으로 'Content-Type'을 설정합니다.
    const blob = new Blob([jsonString], { type: 'application/json' });
    formData.append('request', blob);

    console.log('ai quiz click', params);
    setIsLoadingAI(true);

    onAIQuizAnswer(formData); // Ensure this function returns a promise
  };

  const handleAIFeedbackClick = () => {
    if (!editedAnswer) {
      alert(' 학습자 답변을 입력해주세요.');
      return false;
    }

    // Find the specific quiz in quizList and create formattedQuizList
    const params = {
      contentType: contentType,
      modelAnswer: modelAnswer,
      question: selectedQuiz,
      studentAnswer: editedAnswer,
    };

    const formData = new FormData();

    if (contentType === '0320') {
      formData.append('file', fileList[0]);
    } else {
      params['contentUrl'] = contentUrl;
    }

    // 객체를 JSON 문자열로 변환합니다.
    const jsonString = JSON.stringify(params);
    // FormData에 JSON 문자열을 추가하면서 명시적으로 'Content-Type'을 설정합니다.
    const blob = new Blob([jsonString], { type: 'application/json' });
    formData.append('request', blob);

    console.log('ai quiz click', params);
    setIsLoadingAI(true);

    onAIQuizAnswerFeedback(formData); // Ensure this function returns a promise
    setIsLoadingFeedback(true);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterClose={onRequestClose}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 15, 15, 0.79)',
          zIndex: 1030,
        },
        content: {
          position: 'absolute',
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1000px',
          height: '80%',
          border: '1px solid #ccc',
          background: '#fff',
          overflow: 'hidden',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '10px',
          outline: 'none',
          padding: '0px',
        },
      }}
    >
      {closable && (
        <div className="tw-flex tw-justify-between tw-items-center tw-px-5 tw-py-4 border-bottom">
          <div className={cx('closable tw-font-bold tw-text-xl tw-text-black tw-my-10 tw-mb-2 tw-text-left tw-mt-0')}>
            {title}
          </div>
          <IconButton
            onClick={onRequestClose}
            className={cx('closable')}
            size="small"
            sx={{
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}
      <div className={cx('content tw-bg-[#fdfdff] tw-h-[90%]  tw-flex tw-flex-col tw-items-center')}>
        <div className="tw-pt-5">
          <Tabs
            TabIndicatorProps={{
              sx: {
                backgroundColor: 'black',
              },
            }}
            value={value}
            onChange={handleChange}
            aria-label="wrapped label tabs example"
          >
            <Tab
              value="one"
              label={
                <div>
                  <span className="tw-text-lg tw-font-bold tw-normal-case">Step 1</span> <br />
                  <span className="!tw-mt-5 tw-text-sm">클럽/퀴즈 선택하기</span>
                </div>
              }
              wrapped
              sx={{
                width: '150px',
                '&:hover': {
                  color: 'black',
                },
                '&.Mui-selected': {
                  color: 'black',
                },
              }}
            />
            <Tab
              value="two"
              label={
                <div>
                  <span className="tw-text-lg tw-font-bold tw-normal-case">Step 2</span> <br />
                  <span className="!tw-mt-5 tw-text-sm">사전답변하기 - 지식콘텐츠 보기 - 최종답변하기</span>
                </div>
              }
              wrapped
              sx={{
                width: '400px',
                '&:hover': {
                  color: 'black',
                },
                '&.Mui-selected': {
                  color: 'black',
                },
              }}
            />
            <Tab
              value="three"
              label={
                <div>
                  <span className="tw-text-lg tw-font-bold tw-normal-case">Step 3</span> <br />
                  <span className="!tw-mt-5 tw-text-sm">지식콘텐츠 보기</span>
                </div>
              }
              wrapped
              sx={{
                width: '150px',
                '&:hover': {
                  color: 'black',
                },
                '&.Mui-selected': {
                  color: 'black',
                },
              }}
            />
          </Tabs>
        </div>
        <div className="tw-w-full tw-px-20 tw-h-full tw-p-5 tw-mt-5">
          {value === 'one' && (
            <div className="tw-w-full tw-h-full">
              <Accordion
                disableGutters
                sx={{ backgroundColor: '#e9ecf2' }}
                defaultExpanded
                // expanded={expanded === 0}
                // onChange={handleChange(0)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div className="tw-flex tw-justify-between tw-items-center tw-w-full">
                    <div className="tw-text-lg tw-font-bold">지식콘텐츠 정보 입력</div>
                  </div>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                  <div className="tw-py-5">
                    <div className="tw-text-sm tw-font-bold tw-py-2">퀴즈클럽</div>
                    <select
                      className="tw-h-14 form-select block w-full tw-bg-gray-100 tw-font-bold tw-px-8"
                      onChange={handleClubChange}
                      value={selectedClub}
                      aria-label="Default select example"
                    >
                      {isMemberListFetched &&
                        contents?.map((session, idx) => {
                          return (
                            <option
                              key={idx}
                              className="tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer"
                              value={session?.clubSequence}
                            >
                              {session?.clubName}
                            </option>
                          );
                        })}
                    </select>
                    <div className="tw-text-sm tw-font-bold  tw-pt-10  tw-py-2">퀴즈 리스트</div>
                    <select
                      className="tw-h-14 form-select block w-full tw-bg-gray-100 tw-font-bold tw-px-8"
                      onChange={handleQuizChange}
                      value={selectedQuiz}
                      aria-label="Default select example"
                    >
                      {quizList && quizList.length > 0 ? (
                        quizList.map((session, idx) => {
                          // session?.question 값이 null 또는 undefined인지 확인
                          if (!session?.question) return null;

                          return (
                            <option
                              key={idx}
                              className="tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer"
                              value={session?.quizSequence}
                            >
                              {session?.question}
                            </option>
                          );
                        })
                      ) : (
                        <option className="tw-text-center tw-text-gray-500">퀴즈 리스트가 없습니다.</option>
                      )}
                    </select>
                  </div>
                </AccordionDetails>
              </Accordion>
              <div className="tw-flex tw-justify-end tw-items-center tw-w-full tw-mt-5 tw-pb-10">
                <button
                  onClick={() => {
                    // if (selectedQuiz === null) {
                    //   alert('퀴즈를 선택해주세요.');
                    //   return;
                    // }
                    setValue('two');
                  }}
                  className="tw-w-[120px] tw-mt-1 tw-px-2 tw-py-3 tw-text-sm  tw-bg-[#313B49] tw-rounded tw-text-white"
                >
                  다음
                </button>
              </div>
            </div>
          )}
          {value === 'two' && (
            <div>
              <div className="tw-w-full tw-h-full">
                <Accordion
                  disableGutters
                  sx={{ backgroundColor: '#e9ecf2' }}
                  defaultExpanded
                  // expanded={expanded === 0}
                  // onChange={handleChange(0)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="tw-flex tw-justify-between tw-items-center tw-w-full">
                      <div className="tw-text-lg tw-font-bold">사전답변하기</div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                    <div>
                      <QuizSolutionDetailDemo
                        data={data}
                        setQuizFlag={setQuizFlag}
                        // quizStatus={quizSolutionDetailStatus}
                        title="퀴즈풀기"
                        subTitle="퀴즈클럽 풀고 천하무적 커리어를 만들어요!"
                        imageName="top_banner_seminar.svg"
                      />
                    </div>
                    {value === 'three' && (
                      <>
                        <div className="border tw-rounded-lg tw-my-5">
                          <div className="border-bottom  tw-bg-[#F6F7FB]  tw-px-5 tw-py-3">
                            <div className="tw-flex tw-justify-between tw-items-center tw-text-lg tw-font-bold">
                              학습자 답변
                            </div>
                          </div>
                          <div className="tw-flex tw-justify-start tw-items-center tw-p-5 tw-pt-5">
                            <TextField
                              fullWidth
                              type="text"
                              multiline
                              rows={3}
                              value={editedAnswer}
                              onChange={handleAnswerChange}
                              onClick={handleAnswerClick}
                              className="tw-bg-white tw-w-full tw-border tw-rounded-md tw-py-2"
                            />
                          </div>
                          <div className="tw-flex tw-justify-start tw-items-center tw-p-5 tw-pt-0">
                            <button
                              onClick={handleAIFeedbackClick}
                              className="tw-w-[140px] tw-mr-5 tw-px-4 tw-py-2.5 tw-text-sm tw-bg-black tw-text-white tw-rounded-md"
                            >
                              {isLoadingFeedback ? <CircularProgress color="info" size={18} /> : 'AI채점/피드백'}
                            </button>
                            <div className="tw-text-sm tw-mr-2">AI채점 :</div>
                            <TextField
                              disabled
                              size="small"
                              id="outlined-basic"
                              variant="outlined"
                              className="tw-w-[80px]"
                              value={aiQuizAnswerFeedbackData?.grading}
                            />
                          </div>
                        </div>
                        <div className="border tw-rounded-lg tw-mt-5">
                          <div className="border-bottom  tw-bg-[#F6F7FB]  tw-px-5 tw-py-3">
                            <div className="tw-flex tw-justify-between tw-items-center tw-text-lg tw-font-bold">
                              AI피드백
                            </div>
                          </div>
                          <div className="tw-flex tw-justify-start tw-items-center tw-p-5 tw-my-5">
                            {aiQuizAnswerFeedbackData?.feedback}
                          </div>
                        </div>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>

                <div className="tw-flex tw-justify-end tw-items-center tw-w-full tw-mt-5 tw-pb-10">
                  {value === 'two' && (
                    <div>
                      <button
                        onClick={() => {
                          setValue('one');
                        }}
                        className="tw-w-[120px] tw-mt-1 tw-mr-3 tw-px-2 tw-py-3 tw-text-sm  tw-bg-gray-400 tw-rounded tw-text-white"
                      >
                        이전
                      </button>

                      <button
                        disabled={selectedQuiz === undefined}
                        onClick={() => {
                          if (quizFlag === 'three') {
                            console.log('selectedQuiz', selectedQuiz);
                            setValue('three');
                            setQuizParams({
                              club: selectedClub,
                              quiz: selectedValue,
                            });
                          } else {
                            alert('최종답변을 작성 해주세요.');
                          }
                        }}
                        className="tw-w-[120px] tw-mt-1 tw-px-2 tw-py-3 tw-text-sm  tw-bg-[#313B49] tw-rounded tw-text-white"
                      >
                        다음
                      </button>
                    </div>
                  )}
                </div>
                <div className="tw-flex tw-justify-end tw-items-center tw-w-full tw-mt-5 tw-pb-10">
                  {value === 'three' && (
                    <div>
                      <button
                        onClick={() => {
                          setValue('two');
                        }}
                        className="tw-w-[120px] tw-mt-1 tw-mr-3 tw-px-2 tw-py-3 tw-text-sm  tw-bg-gray-400 tw-rounded tw-text-white"
                      >
                        이전
                      </button>
                      <button
                        onClick={() => {
                          onRequestClose();
                        }}
                        className="tw-w-[120px] tw-mt-1 tw-px-2 tw-py-3 tw-text-sm  tw-bg-[#313B49] tw-rounded tw-text-white"
                      >
                        종료1
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {value === 'three' && (
            <div>
              <div className="tw-w-full tw-h-full">
                <Accordion
                  disableGutters
                  sx={{ backgroundColor: '#e9ecf2' }}
                  defaultExpanded
                  // expanded={expanded === 0}
                  // onChange={handleChange(0)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="tw-flex tw-justify-between tw-items-center tw-w-full">
                      <div className="tw-text-lg tw-font-bold">지식콘텐츠 보기</div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                    {value === 'three' && (
                      <div className="tw-rounded-xl">
                        <div className="tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-4 tw-rounded-t-xl">
                          <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                            <img
                              className="tw-w-10 tw-h-10 border tw-rounded-full"
                              src={clubQuizThreads?.member?.profileImageUrl}
                            />
                            <div className="tw-text-xs tw-text-left tw-text-black">
                              {clubQuizThreads?.member?.nickname}
                            </div>
                          </div>
                          <div className="tw-flex-auto tw-px-10 tw-w-10/12">
                            <div className="tw-font-bold tw-text-black">{clubQuizThreads?.question}</div>
                          </div>
                        </div>
                        {clubQuizThreads?.clubQuizThreads?.map((item, index) => {
                          const isLastItem = index === clubQuizThreads.clubQuizThreads.length - 1;
                          return (
                            <div
                              key={index}
                              className={`border-bottom border-left border-right border-secondary tw-bg-white tw-flex tw-p-3 ${
                                isLastItem ? 'tw-rounded-bl-xl tw-rounded-br-xl' : ''
                              }`}
                            >
                              <div className="tw-w-1/12 tw-pt-3 tw-flex tw-flex-col tw-items-center">
                                <svg
                                  width={24}
                                  height={25}
                                  viewBox="0 0 24 25"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-6 h-6 relative"
                                  preserveAspectRatio="none"
                                >
                                  <path
                                    d="M6 6.32422V12.3242C6 13.1199 6.31607 13.8829 6.87868 14.4455C7.44129 15.0081 8.20435 15.3242 9 15.3242H19M19 15.3242L15 11.3242M19 15.3242L15 19.3242"
                                    stroke="#c0c3c9"
                                    strokeWidth={2}
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="tw-w-1.5/12  tw-py-2 tw-flex tw-flex-col">
                                {item?.threadType === '0003' ? (
                                  <img
                                    className="tw-rounded-full tw-w-10 tw-h-10 border"
                                    src="/assets/images/main/chatbot2.png"
                                  />
                                ) : (
                                  <img
                                    className="tw-rounded-full tw-w-10 tw-h-10 "
                                    src={
                                      item?.member?.profileImageUrl ||
                                      '/assets/images/account/default_profile_image.png'
                                    }
                                  />
                                )}
                              </div>
                              <div className="tw-flex-auto tw-w-9/12 tw-px-3">
                                <div className="tw-py-2">
                                  <div className="tw-font-medium tw-text-[#9ca5b2] tw-text-sm">
                                    <span
                                      className={`tw-font-bold ${
                                        item?.threadType === '0003' ? 'tw-text-black' : 'tw-text-black'
                                      }`}
                                    >
                                      {item?.threadType === '0001' && '사전답변'}
                                      {item?.threadType === '0002' && '사후답변'}
                                      {item?.threadType === '0003' && 'AI멘토'}
                                      {item?.threadType === '0004' && '교수님 평가'}
                                    </span>
                                    <span className="tw-px-4">
                                      {item?.createdAt ? item.createdAt.replace('T', ' | ').split('.')[0] : ''}
                                    </span>

                                    {item?.threadType === '0003' && (
                                      <>
                                        <div className="tw-float-right tw-text-black">
                                          AI 채점 : <span className="tw-font-bold">{item?.gradingAi}</span>
                                        </div>
                                      </>
                                    )}

                                    {item?.threadType === '0004' && (
                                      <div className="tw-float-right">
                                        <div className="tw-float-right tw-text-black">
                                          교수 채점 : <span className="tw-font-bold">{item?.gradingFinal}</span>
                                        </div>
                                        <button
                                          onClick={() => handleUpdate()}
                                          className="tw-px-5 tw-underline tw-float-right tw-text-black"
                                        >
                                          수정하기
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={`tw-font-medium tw-text-[#9ca5b2] tw-text-sm ${
                                    item?.threadType === '0003' ? 'tw-text-black' : ''
                                  }`}
                                >
                                  {item?.text}
                                </div>

                                <div className="tw-flex  tw-py-2">
                                  <div className="tw-text-left tw-text-sm">
                                    <ul className="">
                                      {item?.contents?.map((file, index) => {
                                        // Skip rendering if file.url is null or undefined
                                        if (!file.url) return null;

                                        return (
                                          <div
                                            onClick={() => {
                                              let url = file.url;
                                              // Ensure the URL is absolute
                                              if (!/^https?:\/\//i.test(url)) {
                                                // If the URL does not start with 'http://' or 'https://', prepend the base URL
                                                url = new URL(url, window.location.origin).href;
                                              }
                                              console.log(url); // Log the corrected URL to the console
                                              window.open(url, '_blank'); // Open the corrected URL in a new tab
                                            }}
                                            key={index}
                                            className="tw-cursor-pointer tw-text-[#fca380] tw-underline tw-p-1 tw-mb-1"
                                          >
                                            ㄴ지식컨텐츠 : {file.url}
                                          </div>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                </div>

                                <div className="tw-text-sm tw-flex tw-items-center tw-gap-2">
                                  {item?.files?.length > 0 && (
                                    <div className="tw-flex ">
                                      <div className="tw-text-left tw-text-sm">
                                        <ul className="">
                                          {item?.files?.map((file, index) => (
                                            <div
                                              key={index}
                                              onClick={() => {
                                                onFileDownload(file.key, file.name);
                                              }}
                                              className="tw-underline tw-text-blue-500 tw-cursor-pointer tw-p-1  tw-mb-1"
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
                          );
                        })}
                        {isHideAI === true && (
                          // Check if the threadType is '0004' and return null to hide the div
                          <div>
                            <div className="tw-text-center tw-pt-10">
                              <button
                                onClick={() => {
                                  handlerSave();
                                }}
                                className="tw-bg-blue-500 tw-text-white tw-text-sm tw-text-black tw-py-3 tw-px-4 tw-w-40 tw-rounded"
                              >
                                {isLoadingAI ? '채점 중입니다.' : 'AI 채점/피드백'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>

                <div className="tw-flex tw-justify-end tw-items-center tw-w-full tw-mt-5">
                  {value === 'two' && (
                    <div>
                      <button
                        onClick={() => {
                          setValue('one');
                        }}
                        className="tw-w-[120px] tw-mt-1 tw-mr-3 tw-px-2 tw-py-3 tw-text-sm  tw-bg-gray-400 tw-rounded tw-text-white"
                      >
                        이전
                      </button>

                      <button
                        disabled={selectedQuiz === undefined}
                        onClick={() => {
                          if (quizFlag === 'three') {
                            setValue('three');
                          } else {
                            alert('최종답변을 작성 해주세요.');
                          }
                        }}
                        className="tw-w-[120px] tw-mt-1 tw-px-2 tw-py-3 tw-text-sm  tw-bg-[#313B49] tw-rounded tw-text-white"
                      >
                        다음
                      </button>
                    </div>
                  )}
                </div>
                <div className="tw-flex tw-justify-end tw-items-center tw-w-full tw-mt-5 tw-pb-10">
                  {value === 'three' && (
                    <div>
                      <button
                        onClick={() => {
                          setValue('two');
                        }}
                        className="tw-w-[120px] tw-mt-1 tw-mr-3 tw-px-2 tw-py-3 tw-text-sm  tw-bg-gray-400 tw-rounded tw-text-white"
                      >
                        이전
                      </button>
                      <button
                        onClick={() => {
                          onRequestClose();
                        }}
                        className="tw-w-[120px] tw-mt-1 tw-px-2 tw-py-3 tw-text-sm  tw-bg-[#313B49] tw-rounded tw-text-white"
                      >
                        종료
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ReactModal>
  );
};

export default StudentExpModal;
