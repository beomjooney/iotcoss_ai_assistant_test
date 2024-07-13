import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ReactModal from 'react-modal';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Toggle } from 'src/stories/components';
import CircularProgress from '@mui/material/CircularProgress';
import { TagsInput } from 'react-tag-input-component';

const cx = classNames.bind(styles);
Modal.setAppElement('#__next'); // Modal 접근성 설정

const studyStatus = [
  {
    id: '0100',
    name: '아티클',
  },
  {
    id: '0200',
    name: '영상',
  },
  {
    id: '0320',
    name: '첨부파일',
  },
];

const generatedQuizzes = [
  {
    question:
      'React Query에서 데이터를 캐시하고 쿼리에 대한 종속성이 변경될 때 자동으로 다시 가져올 수 있게 하는 중요한 개념은 무엇인가요?',
    keyword: 'queryKey',
  },
  {
    question: 'React Query에서 데이터를 가져오기 위해 사용하는 훅은 무엇인가요?',
    keyword: 'useQuery',
  },
  {
    question: '특정 쿼리 키에 대한 모든 정보를 무효화시키기 위해 사용하는 메서드는 무엇인가요?',
    keyword: 'invalidate',
  },
];

const ProfessorExpModal = ({ title, isOpen, onRequestClose, closable = true }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [value, setValue] = useState('one');
  const [contentType, setContentType] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');
  const [quizList, setQuizList] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState(['react']);
  const [aiFeedback, setAiFeedback] = useState('');

  const handleAIQuizClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleQuizClick = (e, index) => {
    e.stopPropagation(); // 이벤트 버블링 중지
    console.log('수정하기');
    setSelectedQuizIndex(index);
    setEditedQuestion(generatedQuizzes[index].question); // 클릭 시 수정할 질문을 초기화
  };
  const handleQuizMoveClick = question => {
    setSelectedQuiz(question);
  };

  const handleInputChange = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
    setEditedQuestion(e.target.value);
  };

  const handleAnswerChange = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
    setEditedAnswer(e.target.value);
  };

  const handleInputClick = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
  };

  const handleAnswerClick = e => {
    e.stopPropagation(); // 이벤트 버블링 중지
  };

  const handleSaveClick = (e, index) => {
    e.stopPropagation(); // 이벤트 버블링 중지
    const updatedQuizzes = [...generatedQuizzes];
    updatedQuizzes[selectedQuizIndex].question = editedQuestion;
    setSelectedQuizIndex(null); // 수정 완료 후 선택 해제
    // 여기서 updatedQuizzes를 상태로 관리하거나 부모 컴포넌트로 전달하는 로직을 추가하세요
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

                  <div>
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 URL</div>
                    <TextField
                      required
                      disabled
                      value={contentUrl}
                      onChange={e => setContentUrl(e.target.value)}
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

                  <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 제목</div>
                  <TextField
                    required
                    id="username"
                    value={contentTitle}
                    onChange={e => setContentTitle(e.target.value)}
                    name="username"
                    disabled
                    variant="outlined"
                    type="search"
                    size="small"
                    fullWidth
                    sx={{
                      '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    }}
                  />

                  <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">퀴즈만들기</div>
                  <button
                    disabled={isLoading} // 로딩 중일 때 버튼 비활성화
                    onClick={handleAIQuizClick}
                    className="tw-w-[120px] tw-mt-1 tw-col-span-1 tw-px-2 tw-py-3 tw-text-sm tw-bg-[#313B49] tw-rounded tw-text-white"
                  >
                    {isLoading ? <CircularProgress size={20} /> : '퀴즈 생성하기'}
                  </button>

                  {generatedQuizzes.map((item, i) => (
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
                                // handleAIAnswerClick(index, quizList.question);
                              }}
                              className="tw-w-[140px] tw-px-4 tw-py-[9px] tw-text-sm tw-bg-black tw-text-white tw-rounded-md"
                            >
                              {isLoadingAI ? <CircularProgress color="info" size={18} /> : 'AI 모범답안생성'}
                            </button>
                          </div>
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
                          <TagsInput
                            value={selectedKeyword}
                            onChange={setSelectedKeyword}
                            name="fruits"
                            placeHolder="채점기준 주요 키워드/문구를 입력하고 엔터 입력"
                          />
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
                              rows={4}
                              value={editedAnswer}
                              onChange={handleAnswerChange}
                              onClick={handleAnswerClick}
                              className="tw-bg-white tw-w-full tw-border tw-rounded-md tw-px-2 tw-py-1"
                            />
                          </div>
                          <div className="tw-flex tw-justify-start tw-items-center tw-p-5 tw-pt-0">
                            <button className="tw-w-[140px] tw-mr-5 tw-px-4 tw-py-2.5 tw-text-sm tw-bg-black tw-text-white tw-rounded-md">
                              AI채점/피드백
                            </button>
                            <div className="tw-text-sm tw-mr-2">AI채점 :</div>
                            <TextField
                              disabled
                              size="small"
                              id="outlined-basic"
                              variant="outlined"
                              className="tw-w-[80px]"
                            />
                          </div>
                        </div>
                        <div className="border tw-rounded-lg tw-mt-5">
                          <div className="border-bottom  tw-bg-[#F6F7FB]  tw-px-5 tw-py-3">
                            <div className="tw-flex tw-justify-between tw-items-center tw-text-lg tw-font-bold">
                              AI피드백
                            </div>
                          </div>
                          <div className="tw-flex tw-justify-start tw-items-center tw-p-5 tw-pt-5">{aiFeedback}</div>
                        </div>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>

                <div className="tw-flex tw-justify-end tw-items-center tw-w-full tw-mt-5 tw-pb-10">
                  {value === 'two' && (
                    <button
                      onClick={() => {
                        setValue('three');
                      }}
                      className="tw-w-[120px] tw-mt-1 tw-px-2 tw-py-3 tw-text-sm  tw-bg-[#313B49] tw-rounded tw-text-white"
                    >
                      다음
                    </button>
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
