import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import ReactModal from 'react-modal';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Toggle, Tag } from 'src/stories/components';
import CircularProgress from '@mui/material/CircularProgress';
import { useAIQuizSave, useAIQuizAnswer, useAIQuizAnswerFeedback } from 'src/services/quiz/quiz.mutations';
import { useClubAdminList } from 'src/services/studyroom/studyroom.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useClubAboutDetailInfo, useSeminarList } from 'src/services/seminars/seminars.queries';
import { UseQueryResult } from 'react-query';
import {
  paramProps,
  useMyClubList,
  useMyMemberList,
  useMyMemberRequestList,
  useProfessorRequestList,
} from 'src/services/seminars/seminars.queries';

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
  // const [myQuizParams, setMyQuizParams] = useState<any>({ clubSequence: id, sortType: 'ASC', page });

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

  // useDidMountEffect(() => {
  //   setMyQuizParams({
  //     clubSequence: selectedClub?.clubSequence,
  //     page: pageQuiz,
  //     sortType: sortQuizType,
  //   });
  // }, [pageQuiz, sortQuizType, selectedClub]);

  const { isFetched: isMemberListFetched, refetch: QuizRefetchBadge } = useSeminarList(memberParams, data => {
    console.log('memberList', data, data?.data?.contents[0].clubSequence);
    setSelectedClub(data?.data?.contents[0].clubSequence);
    setContents(data?.data?.contents);
    setTotalPage(data?.data?.totalPages);
    setPage(data?.data?.page);
  });

  const { refetch: refetchGetTemp }: UseQueryResult<any> = useClubAboutDetailInfo(selectedClub, data => {
    console.log(data);
    const quizList = data?.clubQuizzes || [];
    setQuizList(quizList);
  });

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
    setSelectedValue(value);
    setSelectedClub(value);
    setIsPublished('');
    setSortType('ASC');
  };
  const handleQuizChange = event => {
    const value = event.target.value;
    console.log(value);
  };

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

  const handleQuizCountChange = e => {
    setQuizCount(e.target.value);
  };

  const handleQuizMoveClick = item => {
    setSelectedQuiz(item.question);
    setQuizKeyWorlds(item.keywords);
  };

  const handleQuizClick = (e, index) => {
    e.stopPropagation(); // 이벤트 버블링 중지
    setSelectedQuizIndex(index);
    setEditedQuestion(quizList[index].question);
  };
  const handleQuizModifyClick = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
    setFlag(true);
    setEditedModifyQuestion(modelAnswer);
  };

  const handleSaveClick = (e, index) => {
    e.stopPropagation(); // 이벤트 버블링 중지
    const updatedQuizList = [...quizList];
    updatedQuizList[index].question = editedQuestion;
    setQuizList(updatedQuizList);
    setSelectedQuizIndex(null);
    setEditedQuestion('');
  };

  const handleModifySaveClick = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
    setFlag(false);
    setModelAnswer(editedModifyQuestion);
  };

  const handleInputChange = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
    setEditedQuestion(e.target.value);
  };

  const handleModifyInputChange = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
    setEditedModifyQuestion(e.target.value);
  };

  const handleAnswerChange = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
    setEditedAnswer(e.target.value);
  };

  const handleInputClick = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
  };

  const handleModifyInputClick = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
  };

  const handleAnswerClick = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
  };

  const handleContentUrlChange = event => {
    setContentUrl(event.target.value);
  };

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.pdf)$/i;

    if (!allowedExtensions.exec(file.name)) {
      alert('허용되지 않는 파일 형식입니다.');
      event.target.value = ''; // input 초기화
      return;
    }

    setFileList([file]); // 하나의 파일만 받도록 설정
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
          <div className={cx('closable')} onClick={onRequestClose}>
            <span className="ti-close" style={{ cursor: 'pointer' }} />
          </div>
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
                  <span className="!tw-mt-5 tw-text-sm">사전답변하기</span>
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
            <Tab
              value="four"
              label={
                <div>
                  <span className="tw-text-lg tw-font-bold tw-normal-case">Step 4</span> <br />
                  <span className="!tw-mt-5 tw-text-sm">최종답변하기</span>
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
              value="five"
              label={
                <div>
                  <span className="tw-text-lg tw-font-bold tw-normal-case">Step 5</span> <br />
                  <span className="!tw-mt-5 tw-text-sm">AI 피드백 받기</span>
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
                      value={selectedValue}
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
                      {quizList?.map((session, idx) => {
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
                      })}
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
          {(value === 'two' || value === 'three') && (
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
                      <div className="tw-text-lg tw-font-bold">
                        {value === 'two' ? '퀴즈 답안정보 입력' : '학습자 답안정보 입력'}
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                    <div className="border tw-rounded-lg tw-my-5">
                      <div className="border-bottom  tw-bg-[#F6F7FB]  tw-px-5 tw-py-3">
                        <div className="tw-flex tw-justify-between tw-items-center">
                          <div className="tw-flex-none tw-w-14 tw-items-center">
                            <div className="tw-flex tw-flex-col tw-items-center">
                              <img
                                className="tw-w-10 border tw-rounded-full"
                                src="/assets/images/main/ellipse_201.png"
                                alt={`Quiz`}
                              />
                              <p className="tw-pt-1 tw-text-sm tw-text-center tw-text-black">퀴즈 1</p>
                            </div>
                          </div>
                          <div className="tw-flex-auto tw-px-5 tw-w-[370px] tw-text-base">{selectedQuiz}</div>
                          {modelAnswer ? (
                            <>
                              {flag ? (
                                <button
                                  onClick={e => handleModifySaveClick(e)}
                                  className="tw-w-28 tw-px-4 tw-py-3 tw-text-sm tw-bg-white border tw-rounded-md"
                                >
                                  저장하기
                                </button>
                              ) : (
                                <button
                                  onClick={e => handleQuizModifyClick(e)}
                                  className="tw-w-28 tw-px-4 tw-py-3 tw-text-sm tw-bg-white border tw-rounded-md"
                                >
                                  수정하기
                                </button>
                              )}
                            </>
                          ) : (
                            <div className="tw-flex-auto !tw-w-[310px] tw-items-center tw-flex tw-justify-end tw-gap-2">
                              <div className="tw-text-sm tw-font-bold">답안글자수</div>
                              <select className="tw-pl-1 tw-text-sm">
                                <option value="100">100이내</option>
                                <option value="200">200이내</option>
                                <option value="300">300이내</option>
                                <option value="400">400이내</option>
                                <option value="500">500이내</option>
                              </select>
                              <button
                                onClick={() => {
                                  // Add your button click handler logic here
                                  handleAIAnswerClick(1, selectedQuiz);
                                }}
                                className="tw-w-[140px] tw-px-4 tw-py-[9px] tw-text-sm tw-bg-black tw-text-white tw-rounded-md"
                              >
                                {isLoadingAI ? <CircularProgress color="info" size={18} /> : 'AI 모범답안생성'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="tw-flex tw-justify-start tw-items-center tw-px-5 tw-pt-5">
                        <div className="tw-flex-none tw-w-14 tw-items-center">
                          <div className="tw-flex tw-flex-col tw-items-center">
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
                                d="M6 6.3252V12.3252C6 13.1208 6.31607 13.8839 6.87868 14.4465C7.44129 15.0091 8.20435 15.3252 9 15.3252H19M19 15.3252L15 11.3252M19 15.3252L15 19.3252"
                                stroke="#CED4DE"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="tw-flex-none tw-w-14 tw-items-center">
                          <div className="tw-flex tw-flex-col tw-items-center">
                            <img className="tw-w-9 border tw-rounded-full" src="/assets/images/main/ellipse_202.png" />
                            <p className="tw-pt-1 tw-text-sm tw-text-center tw-text-black">모범답안</p>
                          </div>
                        </div>
                        <div className="tw-p-5 tw-flex-col tw-items-center tw-w-full">
                          <div className="tw-py-5">
                            {flag ? (
                              <TextField
                                fullWidth
                                type="text"
                                multiline
                                rows={4}
                                value={editedModifyQuestion}
                                onChange={handleModifyInputChange}
                                onClick={handleModifyInputClick}
                                className="tw-bg-white tw-w-full tw-border tw-rounded-md tw-px-2 tw-py-1"
                              />
                            ) : (
                              <>
                                {modelAnswer ? (
                                  <div className="tw-py-5">{modelAnswer}</div>
                                ) : (
                                  <div className="tw-py-5">AI 모범답안버튼을 클릭해주세요.</div>
                                )}
                              </>
                            )}
                          </div>

                          <div className="tw-py-2">
                            {/* <TagsInput
                              value={quizKeyWorlds}
                              onChange={setQuizKeyWorlds}
                              name="fruits"
                              placeHolder="채점기준, 키워드/문구를 입력하고 엔터 입력"
                            /> */}
                            <Tag
                              value={quizKeyWorlds}
                              onChange={setQuizKeyWorlds}
                              placeHolder="채점기준, 키워드/문구를 입력하고 엔터 입력"
                            />
                          </div>
                        </div>
                      </div>
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
                        onClick={() => {
                          if (modelAnswer) {
                            setValue('three');
                          } else {
                            alert('AI 모범답안생성 버튼을 클릭해주세요.');
                          }
                        }}
                        className="tw-w-[120px] tw-mt-1 tw-px-2 tw-py-3 tw-text-sm  tw-bg-[#313B49] tw-rounded tw-text-white"
                      >
                        다음
                      </button>
                    </div>
                  )}

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
