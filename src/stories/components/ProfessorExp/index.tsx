import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import ReactModal from 'react-modal';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Toggle } from 'src/stories/components';
import CircularProgress from '@mui/material/CircularProgress';
import { TagsInput } from 'react-tag-input-component';
import { useAIQuizSave, useAIQuizAnswer, useAIQuizAnswerFeedback } from 'src/services/quiz/quiz.mutations';

const cx = classNames.bind(styles);
Modal.setAppElement('#__next'); // Modal 접근성 설정

const studyStatus = [
  {
    id: '0100',
    name: '아티클',
  },
  {
    id: '0210',
    name: '영상',
  },
  {
    id: '0320',
    name: '첨부파일',
  },
];

const ProfessorExpModal = ({ title, isOpen, onRequestClose, closable = true }) => {
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
      setQuizKeyWorlds((aiQuizData as any).contentKeywords);
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
    }
  }, [aiQuizAnswerData]);

  const handleAIQuizClick = () => {
    console.log('ai quiz click');
    // 유효성 검사
    if (!contentType) {
      alert('지식컨텐츠 유형을 선택하세요.');
      return;
    }

    if (contentType === '0320' && !fileList[0]) {
      alert('파일을 추가해주세요.');
      return;
    }

    if (!contentTitle) {
      alert('지식컨텐츠 제목을 입력해주세요.');
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

  const handleQuizMoveClick = question => {
    setSelectedQuiz(question);
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
          height: '90%',
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
        <div>
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
                  <span className="!tw-mt-5 tw-text-sm">AI 퀴즈만들기</span>
                </div>
              }
              wrapped
              sx={{
                marginRight: 4,
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
                  <span className="!tw-mt-5 tw-text-sm">AI 모범답안 만들기</span>
                </div>
              }
              wrapped
              sx={{
                marginRight: 4,
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
                  <span className="!tw-mt-5 tw-text-sm">AI 채점/피드백</span>
                </div>
              }
              wrapped
              sx={{
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
                    <div className="tw-text-lg tw-font-bold">지식컨텐츠 정보 입력</div>
                  </div>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                  <div className="tw-text-sm tw-font-bold tw-py-2">지식컨텐츠 유형</div>
                  <div className={cx('mentoring-button__group', 'tw-px-0', 'tw-justify-center', 'tw-items-center')}>
                    {studyStatus.map((item, i) => (
                      <Toggle
                        key={item.id}
                        label={item.name}
                        name={item.name}
                        value={item.id}
                        variant="small"
                        checked={contentType === item.id}
                        isActive
                        type="tabButton"
                        onChange={() => {
                          setContentType(item.id);
                        }}
                        className={cx('tw-mr-2 !tw-w-[90px]')}
                      />
                    ))}
                  </div>
                  {contentType === '0320' ? (
                    <div>
                      <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">파일 업로드</div>
                      <div className="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-text-center">
                        <div className="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-text-center">
                          {fileList.length > 0 ? (
                            <div>
                              {fileList.map((file, index) => (
                                <div
                                  className="tw-cursor-pointer tw-underline"
                                  onClick={() => {
                                    onFileDownload(contentUrl, fileName);
                                  }}
                                  key={index}
                                >
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div>파일을 추가해주세요. (pdf)</div>
                          )}
                        </div>
                        <div className="tw-flex tw-items-center tw-gap-2 border tw-px-4 tw-py-2 tw-rounded">
                          <svg
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 absolute left-0 top-0.5"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <g clipPath="url(#clip0_679_9101)">
                              <path
                                d="M2.61042 6.86336C2.55955 6.9152 2.49887 6.95638 2.4319 6.98449C2.36494 7.01259 2.29304 7.02707 2.22042 7.02707C2.14779 7.02707 2.0759 7.01259 2.00894 6.98449C1.94197 6.95638 1.88128 6.9152 1.83042 6.86336C1.72689 6.75804 1.66887 6.61625 1.66887 6.46856C1.66887 6.32087 1.72689 6.17909 1.83042 6.07376L6.65522 1.20016C7.74322 0.355364 8.83762 -0.050236 9.92722 0.00496403C11.3 0.075364 12.3688 0.598564 13.276 1.45696C14.2008 2.33216 14.7992 3.58096 14.7992 5.09456C14.7992 6.25616 14.4616 7.27856 13.7488 8.18576L6.94642 15.1938C6.25842 15.7578 5.49362 16.0306 4.67442 15.9978C3.63442 15.9546 2.86082 15.6186 2.28562 15.0498C1.61202 14.385 1.19922 13.5682 1.19922 12.4698C1.19922 11.5962 1.50082 10.7898 2.12322 10.033L8.11042 3.92016C8.59042 3.40816 9.06002 3.10416 9.54002 3.03056C9.86039 2.9801 10.1883 3.00876 10.495 3.11403C10.8018 3.21931 11.0781 3.39801 11.3 3.63456C11.7256 4.08496 11.908 4.64656 11.844 5.28576C11.8 5.72176 11.6216 6.12336 11.2936 6.50816L5.78962 12.1466C5.73909 12.1986 5.6787 12.24 5.61198 12.2685C5.54527 12.2969 5.47355 12.3118 5.40102 12.3123C5.3285 12.3127 5.25661 12.2987 5.18954 12.2711C5.12248 12.2435 5.06159 12.2028 5.01042 12.1514C4.90625 12.0467 4.84737 11.9052 4.84647 11.7575C4.84557 11.6099 4.90273 11.4677 5.00562 11.3618L10.4832 5.75216C10.6432 5.56416 10.7272 5.37456 10.7472 5.17296C10.7792 4.85296 10.7024 4.61696 10.5032 4.40656C10.4026 4.29881 10.2769 4.21759 10.1374 4.17014C9.99779 4.12268 9.84865 4.11046 9.70322 4.13456C9.50882 4.16416 9.23682 4.34096 8.90162 4.69776L2.93922 10.7834C2.50962 11.3074 2.30162 11.8634 2.30162 12.4706C2.30162 13.2338 2.57762 13.7802 3.05522 14.2514C3.43522 14.6274 3.95122 14.8514 4.71922 14.8834C5.26322 14.905 5.76722 14.725 6.20562 14.3698L12.9232 7.44976C13.4392 6.78816 13.6968 6.00976 13.6968 5.09536C13.6968 3.90976 13.2352 2.94816 12.5224 2.27296C11.7944 1.58336 10.9624 1.17696 9.87202 1.12096C9.06562 1.07936 8.22002 1.39296 7.37842 2.03776L2.61042 6.86336Z"
                                fill="#31343D"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_679_9101">
                                <rect width={16} height={16} fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <button className=" tw-text-sm tw-text-left tw-text-[#31343d]" onClick={handleButtonClick}>
                            파일추가
                          </button>
                          <input
                            accept=".pdf"
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 URL</div>
                      <TextField
                        required
                        value={contentUrl}
                        onChange={handleContentUrlChange}
                        id="username"
                        name="username"
                        variant="outlined"
                        type="search"
                        size="small"
                        fullWidth
                        sx={{
                          '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                        }}
                      />
                    </div>
                  )}
                  <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 제목</div>
                  <TextField
                    required
                    id="username"
                    value={contentTitle}
                    onChange={e => setContentTitle(e.target.value)}
                    name="username"
                    variant="outlined"
                    type="search"
                    size="small"
                    fullWidth
                    sx={{
                      '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    }}
                  />
                  <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">퀴즈만들기</div>
                  <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm">
                    생성할 퀴즈 개수 :
                    <select
                      className="form-select tw-w-[100px] tw-h-[40px]"
                      onChange={handleQuizCountChange}
                      aria-label="Default select example"
                      value={quizCount}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                      <option value={9}>9</option>
                      <option value={10}>10</option>
                    </select>
                    <button
                      disabled={isLoading} // 로딩 중일 때 버튼 비활성화
                      onClick={handleAIQuizClick}
                      className="tw-w-[120px] tw-mt-1 tw-col-span-1 tw-px-2 tw-py-3 tw-text-sm tw-bg-[#313B49] tw-rounded tw-text-white"
                    >
                      {isLoading ? <CircularProgress size={20} /> : '퀴즈 생성하기'}
                    </button>
                  </div>
                  {aiQuizData?.generatedQuizzes.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => handleQuizMoveClick(item.question)}
                      className={`tw-cursor-pointer tw-rounded-lg tw-bg-[#F6F7FB] border tw-px-5 tw-py-3 tw-my-5 ${
                        selectedQuiz === item.question ? 'border-dark' : ''
                      }`}
                    >
                      <div className="tw-flex tw-justify-between tw-items-center">
                        <div className="tw-flex-none tw-w-14 tw-items-center">
                          <div className="tw-flex tw-flex-col tw-items-center">
                            <img
                              className="tw-w-10 border tw-rounded-full"
                              src="/assets/images/main/ellipse_201.png"
                              alt={`Quiz`}
                            />
                            <p className="tw-pt-1 tw-text-sm tw-text-center tw-text-black">퀴즈 {i + 1}</p>
                          </div>
                        </div>
                        <div className="tw-flex-auto tw-px-5 tw-text-base tw-w-full">
                          {selectedQuizIndex === i ? (
                            <TextField
                              fullWidth
                              type="text"
                              multiline
                              rows={2}
                              value={editedQuestion}
                              onChange={handleInputChange}
                              onClick={handleInputClick}
                              className="tw-bg-white tw-w-full tw-border tw-rounded-md tw-px-2 tw-py-1"
                            />
                          ) : (
                            item.question
                          )}
                        </div>
                        <div className="tw-flex-auto tw-w-32 tw-flex tw-justify-end">
                          {selectedQuizIndex === i ? (
                            <button
                              onClick={e => handleSaveClick(e, i)}
                              className="tw-w-28 tw-px-4 tw-py-3 tw-text-sm tw-bg-white border tw-rounded-md"
                            >
                              저장하기
                            </button>
                          ) : (
                            <button
                              onClick={e => handleQuizClick(e, i)}
                              className="tw-w-28 tw-px-4 tw-py-3 tw-text-sm tw-bg-white border tw-rounded-md"
                            >
                              수정하기
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
              <div className="tw-flex tw-justify-end tw-items-center tw-w-full tw-mt-5 tw-pb-10">
                <button
                  onClick={() => {
                    if (selectedQuiz === null) {
                      alert('퀴즈를 선택해주세요.');
                      return;
                    }
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
                            <TagsInput
                              value={quizKeyWorlds}
                              onChange={setQuizKeyWorlds}
                              name="fruits"
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

export default ProfessorExpModal;
