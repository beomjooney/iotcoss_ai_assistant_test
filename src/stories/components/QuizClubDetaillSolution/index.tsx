// QuizClubDetailInfo.jsx
import React, { useState, useRef } from 'react';
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
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import MentorsModal from 'src/stories/components/MentorsModal';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useSessionStore } from 'src/store/session';

import { getButtonText } from 'src/utils/clubStatus';

/**icon */
import {
  useSaveLike,
  useDeleteLike,
  useSaveReply,
  useDeleteReply,
  useDeletePost,
} from 'src/services/community/community.mutations';
import router from 'next/router';

import {
  useQuizGetAIMyAnswer,
  useQuizAIFeedback,
  useQuizAIFeedbackTotal,
  useQuizAIFeedbackQuiz,
} from 'src/services/quiz/quiz.queries';
import { useAIQuizMyAnswerSavePut } from 'src/services/quiz/quiz.mutations';
import { useQuizFileDownload } from 'src/services/quiz/quiz.queries';
import dynamic from 'next/dynamic';

// ReactApexChart를 동적으로 import하여 SSR 비활성화
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const cx = classNames.bind(styles);

const QuizClubDetaillSolution = ({
  totalElements,
  clubAbout,
  contents,
  quizList,
  border,
  page,
  totalPage,
  handlePageChange,
  refetchParticipant,
}) => {
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { memberId } = useSessionStore.getState();
  let [isLiked, setIsLiked] = useState(contents?.club?.isFavorite);
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();
  const [clubQuizThreads, setClubQuizThreads] = useState<any>([]);
  const [isHideAI, setIsHideAI] = useState(true);
  const [isAIData, setIsAIData] = useState({});
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [quizSequence, setQuizSequence] = useState<number>(0);
  const [quizParams, setQuizParams] = useState<any>({});
  const [grade, setGrade] = useState('');
  const [fileList, setFileList] = useState([]);
  const [inputList, setInputList] = useState([]);
  const [expandedItems, setExpandedItems] = useState(() => Array(quizList?.length || 0).fill(false));
  const [key, setKey] = useState('');
  const [fileName, setFileName] = useState('');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [isTotalFeedbackModalOpen, setIsTotalFeedbackModalOpen] = useState<boolean>(false);
  const [aiFeedbackData, setAiFeedbackData] = useState<any>(null);
  const [aiFeedbackDataTotal, setAiFeedbackDataTotal] = useState<any>(null);
  const [aiFeedbackDataTotalQuiz, setAiFeedbackDataTotalQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedQuizSequence, setSelectedQuizSequence] = useState<number>(0);
  const [aiEvaluationParams, setAiEvaluationParams] = useState<any>(null);
  const [aiEvaluationParamsTotal, setAiEvaluationParamsTotal] = useState<any>(null);
  const [aiEvaluationParamsTotalQuiz, setAiEvaluationParamsTotalQuiz] = useState<any>(null);
  const { isFetched: isParticipantListFetcheds } = useQuizFileDownload(key, data => {
    if (data) {
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      // 브라우저에서 PDF를 새 탭에서 열기
      window.open(url, '_blank', 'noopener,noreferrer');
      setKey('');
      setFileName('');
    }
  });

  const textInput = useRef(null);
  const [expandedQuizzData, setExpandedQuizzData] = useState(
    () => quizList?.map(item => Array(item?.makeupQuizzes?.length || 0).fill(false)) || [],
  );

  const { isFetched: isQuizGetanswer, refetch: refetchQuizAnswer } = useQuizGetAIMyAnswer(quizParams, data => {
    console.log('data', data);
    setClubQuizThreads(data);
    if (data?.clubQuizThreads?.length > 0) {
      data.clubQuizThreads.map(item => {
        // Check if the threadType is '0004' and return null to hide the div
        if (item?.threadType === '0004') {
          setIsHideAI(false);
          setIsAIData(item);
          console.log('false');
        }
      });
    }
  });

  // AI 피드백 데이터 조회
  const { refetch: refetchAIEvaluation } = useQuizAIFeedback(
    aiEvaluationParams,
    data => {
      console.log('AI Evaluation data:', data);
      setAiFeedbackData(data);
      setIsFeedbackModalOpen(true);
    },
    error => {
      console.error('AI Evaluation error:', error);
      alert('피드백 데이터를 불러오는데 실패했습니다.');
    },
  );

  // AI 피드백 데이터 조회
  const { refetch: refetchAIEvaluationTotal } = useQuizAIFeedbackTotal(
    aiEvaluationParamsTotal,
    data => {
      setIsLoading(false);
      console.log('AI Evaluation data:', data);
      setAiFeedbackDataTotal(data);
      setIsTotalFeedbackModalOpen(true);
    },
    error => {
      console.error('AI Evaluation error:', error);
      alert('피드백 데이터를 불러오는데 실패했습니다.');
    },
  );

  // AI 피드백 데이터 조회
  const { refetch: refetchAIEvaluationTotalQuiz } = useQuizAIFeedbackQuiz(
    aiEvaluationParamsTotalQuiz,
    data => {
      console.log('AI Evaluation data:', data);
      setAiFeedbackDataTotalQuiz(data);
    },
    error => {
      console.error('AI Evaluation error:', error);
      alert('피드백 데이터를 불러오는데 실패했습니다.');
    },
  );

  const toggleExpand = index => {
    setExpandedItems(prev => {
      const newExpandedItems = [...prev];
      newExpandedItems[index] = !newExpandedItems[index];
      return newExpandedItems;
    });
  };

  const handleClick = (memberUUID: string, quizSequence: number, answerStatus: boolean) => {
    console.log(memberUUID, quizSequence);
    setIsModalOpen(true);
    setGrade('');
    setInputList([]);
    setFileList([]);
    setIsHideAI(answerStatus);
    setQuizSequence(quizSequence);
    setQuizParams({
      club: clubAbout?.clubSequence,
      quiz: quizSequence,
    });
  };

  const {
    mutate: onAIQuizAnswerSavePut,
    isSuccess: answerSuccessSavePut,
    isError: answerErrorSavePut,
    data: aiQuizAnswerDataSavePut,
  } = useAIQuizMyAnswerSavePut();

  useDidMountEffect(() => {
    if (aiEvaluationParams) {
      refetchAIEvaluation();
    }
  }, [aiEvaluationParams]);

  useDidMountEffect(() => {
    if (aiEvaluationParamsTotalQuiz) {
      refetchAIEvaluationTotalQuiz();
    }
  }, [aiEvaluationParamsTotalQuiz]);

  useDidMountEffect(() => {
    if (aiEvaluationParamsTotal) {
      refetchAIEvaluationTotal();
    }
  }, [aiEvaluationParamsTotal]);

  useDidMountEffect(() => {
    if (answerSuccessSavePut) {
      refetchQuizAnswer();
      setIsLoadingAI(false);
    }
  }, [answerSuccessSavePut, answerErrorSavePut]);

  useDidMountEffect(() => {
    refetchQuizAnswer();
  }, [quizParams]);

  const handlerSave = () => {
    // Uncomment and replace with actual API call
    setIsLoadingAI(true);
    console.log('clubAbout?.clubSequence, quizSequence', clubAbout?.clubSequence, quizSequence);
    onAIQuizAnswerSavePut({
      club: clubAbout?.clubSequence,
      quiz: quizSequence,
    });
  };

  const toggleExpandQuizzData = (itemIndex, quizzIndex) => {
    setExpandedQuizzData(prev => {
      const newExpandedQuizzData = [...prev];

      // itemIndex가 유효한지 확인하고 초기화
      if (!newExpandedQuizzData[itemIndex]) {
        newExpandedQuizzData[itemIndex] = [];
      }

      // quizzIndex가 유효한지 확인하고 초기화
      if (typeof newExpandedQuizzData[itemIndex][quizzIndex] === 'undefined') {
        newExpandedQuizzData[itemIndex][quizzIndex] = 0;
      }

      newExpandedQuizzData[itemIndex][quizzIndex] = !newExpandedQuizzData[itemIndex][quizzIndex];
      console.log(newExpandedQuizzData);
      return newExpandedQuizzData;
    });
  };

  const onChangeLike = function (postNo: number) {
    event.preventDefault();
    setIsLiked(!isLiked);
    if (isLiked) {
      onDeleteLike(postNo);
    } else {
      onSaveLike(postNo);
    }
  };

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    setKey(key);
    setFileName(fileName);
  };

  const handleUpdate = () => {
    console.log('Update function called');
    // 수정 기능 구현
  };

  // 피드백보기 버튼 클릭 시 API 호출
  const handleFeedbackClick = (quizSequence: number) => {
    console.log('피드백보기 클릭:', {
      quizSequence,
      clubSequence: clubAbout?.clubSequence,
      memberId,
    });

    setSelectedQuizSequence(quizSequence);
    setAiEvaluationParams({
      club: clubAbout?.clubSequence,
      quiz: quizSequence,
      memberUUID: memberId, // 실제 memberId 사용
    });
    setIsFeedbackModalOpen(true);
  };

  // 총평 피드백 보기
  const handleTotalFeedbackClick = (clubSequence: number) => {
    setAiEvaluationParamsTotal({
      clubSequence: clubAbout?.clubSequence,
    });
    setAiEvaluationParamsTotalQuiz({
      clubSequence: clubAbout?.clubSequence,
    });
    setIsTotalFeedbackModalOpen(true);
    setIsLoading(true);
  };

  return (
    <div className={`tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white ${borderStyle}`}>
      <div className="tw-pt-[35px]">
        <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden border-t-0 border-r-0 border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">퀴즈클럽</p>
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
              클럽 상세보기
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              클럽 상세보기
            </p>
          </div>
        </div>
        <div className="tw-h-[280] tw-relative tw-overflow-hidden tw-rounded-[8.75px] tw-bg-white border border-[#e9ecf2] tw-grid tw-grid-cols-3 tw-gap-4">
          <div className="tw-col-span-1">
            <img
              src={clubAbout?.clubImageUrl || '/assets/images/banner/Rectangle_190.png'}
              width={320}
              className="tw-object-cover tw-h-[320px]"
            />
          </div>
          <div className="tw-col-span-2 tw-flex tw-flex-col tw-py-4 tw-pr-4">
            <div className="tw-col-span-2 tw-flex tw-flex-col tw-py-4 tw-pr-4">
              <div className="tw-flex tw-gap-[7px]">
                <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                  <p className="tw-text-[12.25px] tw-text-[#235a8d]">{contents?.club?.jobGroups[0]?.name || 'N/A'}</p>
                </div>
                <div className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                  <p className="tw-text-[12.25px] tw-text-[#313b49]">{contents?.club?.jobLevels[0]?.name || 'N/A'}</p>
                </div>
                <div className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                  <p className="tw-text-[12.25px] tw-text-[#b83333]">{contents?.club?.jobs[0]?.name || 'N/A'} </p>
                </div>
                <div className="tw-flex-1"></div> {/* 빈 div로 flex-grow를 추가하여 버튼을 오른쪽으로 밀어냅니다. */}
                <button
                  className=""
                  onClick={() => {
                    onChangeLike(contents?.club?.clubSequence);
                  }}
                >
                  {isLiked ? <StarIcon color="primary" /> : <StarBorderIcon color="disabled" />}
                </button>
              </div>
            </div>

            <div className="tw-text-[20.5px] tw-font-bold tw-text-black tw-mt-2">{contents?.club?.clubName}</div>
            <p className="tw-text-[12.25px] tw-mt-2 tw-text-black">{contents?.club?.description}</p>
            <div className="tw-mt-2">
              <p className="tw-text-sm tw-text-black">
                {/* 학습 주기 : 매주 {contents?.club?.studyCycle.toString()}요일 (총 {contents?.club?.weekCount}회) */}
                학습 주기 :{' '}
                {contents?.club?.studyCycle.length > 0
                  ? `매주 ${contents.club.studyCycle.toString()}요일 (총 ${contents?.club?.weekCount}회)`
                  : `${contents?.club?.weekCount}회`}
              </p>
              <p className="tw-text-sm tw-text-black">
                학습 기간 : {contents?.club?.weekCount}주 ({contents?.club?.startAt.split(' ')[0]} ~{' '}
                {contents?.club?.endAt.split(' ')[0]})
              </p>
              <p className="tw-text-sm tw-text-black">
                참여 현황 : {contents?.club?.publishedCount} / {contents?.club?.studyCount} 학습중
              </p>
              <p className="tw-text-sm tw-text-black">참여 인원 : {contents?.club?.recruitedMemberCount}명</p>
            </div>
            <div className="tw-flex tw-items-center tw-mt-auto tw-justify-between tw-w-full tw-py-2">
              <div className="tw-flex tw-items-center">
                <img
                  src={contents?.club?.leaderProfileImageUrl || '/assets/images/account/default_profile_image.png'}
                  className="tw-mr-2 tw-rounded-full tw-ring-1 tw-ring-gray-200 tw-w-9 tw-h-9"
                />
                <p className="tw-text-sm tw-text-black">{contents?.club?.leaderNickname}</p>
              </div>
              <div className="tw-flex tw-gap-4">
                <div
                  className="tw-bg-gray-400 tw-rounded-[3.5px] tw-px-[24.5px] tw-py-[10.0625px] tw-cursor-pointer"
                  // onClick={() => {
                  //   setIsModalOpen(true);
                  // }}
                >
                  <p className="tw-text-[12.25px] tw-font-bold tw-text-white tw-text-center">
                    {getButtonText(contents?.club?.clubStatus)}
                  </p>
                </div>
                <div
                  className="tw-bg-[#2474ED] tw-rounded-[3.5px] tw-px-[24.5px] tw-py-[10.0625px] tw-cursor-pointer"
                  onClick={() => router.push('/quiz/round-answers/' + `${contents?.club?.clubSequence}`)}
                >
                  <p className="tw-text-[12.25px] tw-font-bold tw-text-white tw-text-center">퀴즈라운지</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg tw-py-4 tw-overflow-hidden">
          <div className="tw-flex tw-justify-between tw-items-center tw-py-4">
            <p className="tw-text-xl tw-font-bold tw-text-black">나의 학습 현황</p>
            <div className="tw-flex tw-items-center tw-gap-2">
              <div className="tw-flex tw-items-center">
                <div className="tw-text-base tw-text-black tw-leading-relaxed tw-mr-2">
                  모든 퀴즈를 완료하였습니다! 총평 피드백을 확인해보세요.
                </div>
              </div>
              <button
                onClick={() => handleTotalFeedbackClick(contents?.club?.clubSequence)}
                className="tw-bg-[#2474ED] tw-hover:bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-full tw-text-base tw-font-medium"
              >
                총평 피드백보기
              </button>
            </div>
          </div>
          {/* 나의 학습 현황 */}
          <div className=" tw-rounded-lg tw-p-8 tw-mb-8 tw-border tw-bg-[#F6F7FB]">
            <div className="tw-flex tw-items-start tw-gap-8 ">
              {/* 왼쪽: 원형 진행률 */}
              <div className="tw-flex-shrink-0">
                <div className="tw-relative tw-w-32 tw-h-32">
                  {/* 원형 진행률 배경 */}
                  <svg className="tw-w-32 tw-h-32 tw-transform tw--rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="#E0E4EB" strokeWidth="8" fill="none" />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#334155"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - (contents?.progress?.currentRound || 0) / (contents?.progress?.studyStatuses?.length || 1))}`}
                      strokeLinecap="round"
                      className="tw-transition-all tw-duration-500"
                    />
                  </svg>
                  {/* 중앙 텍스트 */}
                  <div className="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center">
                    <div className="tw-text-2xl tw-font-bold tw-text-black">
                      {Math.round(
                        ((contents?.progress?.currentRound || 0) / (contents?.progress?.studyStatuses?.length || 1)) *
                          100,
                      )}
                      %
                    </div>
                    <div className="tw-text-sm tw-text-gray-500">
                      {contents?.progress?.currentRound || 0}회/{contents?.progress?.studyStatuses?.length || 0}회
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 회차별 진행 상황 */}
              <div className="tw-flex-1 tw-overflow-auto">
                {/* 회차별 진행 상황 - 가로 스크롤 적용 */}
                <div
                  className="tw-overflow-auto tw-pb-4 tw-w-full"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#d1d5db #f9fafb',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <div
                    className="tw-flex tw-gap-4"
                    style={{
                      minWidth: `${(contents?.progress?.studyStatuses?.length || 0) * 100}px`,
                      width: 'max-content',
                    }}
                  >
                    {contents?.progress?.studyStatuses?.map((session, idx) => (
                      <div
                        key={idx}
                        className="tw-text-center tw-flex-shrink-0 tw-bg-white tw-px-2 tw-py-4 tw-rounded-[20px]"
                        style={{ width: '92px' }}
                      >
                        {/* 상태 아이콘 */}
                        <div className="tw-flex tw-justify-center tw-mb-2">
                          {session?.status === '0003' ? (
                            <div className="tw-w-6 tw-h-6 tw-bg-black tw-rounded-full tw-flex tw-items-center tw-justify-center">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                  d="M4 8L7 11L12 6"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          ) : session?.status === '0002' ? (
                            <div className="tw-w-6 tw-h-6 border-danger border tw-rounded-full tw-flex tw-items-center tw-justify-center tw-bg-white">
                              <span className="tw-text-red-500 tw-text-sm tw-font-bold">?</span>
                            </div>
                          ) : (
                            <div className="tw-w-6 tw-h-6 border border-dark tw-rounded-full tw-bg-gray-50"></div>
                          )}
                        </div>

                        {/* 회차 정보 */}
                        <div className="tw-text-sm tw-font-medium tw-text-black tw-mb-1">{session?.order}회</div>
                        <div className="tw-text-xs tw-text-gray-500 tw-mb-2">
                          {session?.publishDate?.split('-').slice(1).join('-') || ''}
                        </div>

                        {/* 상태 라벨 */}
                        <div className="tw-text-xs tw-pt-2">
                          {session?.status === '0003' ? (
                            <span
                              onClick={() => handleFeedbackClick(session?.quizSequence)}
                              className="tw-bg-gray-800 tw-text-white tw-px-2 tw-py-1 tw-rounded-full tw-whitespace-nowrap tw-cursor-pointer tw-border-none"
                            >
                              피드백보기
                            </span>
                          ) : session?.relativeDaysToPublishDate != null ? (
                            session.relativeDaysToPublishDate === 0 ? (
                              <span className="tw-bg-blue-500 tw-text-white tw-px-2 tw-py-1 tw-rounded-full tw-whitespace-nowrap">
                                D-day
                              </span>
                            ) : session.relativeDaysToPublishDate > 0 ? (
                              <span className="tw-bg-blue-400 tw-text-white tw-px-2 tw-py-1 tw-rounded-full tw-whitespace-nowrap">
                                D+{session.relativeDaysToPublishDate}
                              </span>
                            ) : (
                              <span className="tw-bg-blue-600 tw-text-white tw-px-2 tw-py-1 tw-rounded-full tw-whitespace-nowrap">
                                D{session.relativeDaysToPublishDate}
                              </span>
                            )
                          ) : null}
                        </div>

                        {/* 채점하기 버튼 */}
                        {/* {session?.status === '0003' && clubAbout?.feedbackType === '0200' && !session?.grade && (
                          <div className="tw-mt-2">
                            <button
                              onClick={() => handleClick('sfasd', session?.quizSequence, true)}
                              className="tw-text-xs tw-bg-blue-500 tw-text-white tw-px-2 tw-py-1 tw-rounded-full tw-whitespace-nowrap tw-cursor-pointer tw-border-none"
                            >
                              채점하기
                            </button>
                          </div>
                        )} */}
                        {session?.status === '0003' && (
                          <div className="text-xs font-medium text-center text-[#9ca5b2] py-2">
                            {session?.grade ? (
                              <span className="tw-text-xs tw-text-black tw-rounded-full tw-bg-gray-200 tw-px-2 tw-py-1 tw-font-medium tw-text-center tw-text-[#9ca5b2]">
                                점수 : {session?.grade}
                              </span>
                            ) : clubAbout?.feedbackType === '0200' ? (
                              <span
                                onClick={() => handleClick('sfasd', session?.quizSequence, true)}
                                className="tw-py-1 tw-px-2 tw-bg-blue-500 tw-text-white tw-rounded-full tw-w-full tw-cursor-pointer tw-text-xs"
                              >
                                채점하기
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 스크롤 안내 텍스트 */}
                <div className="tw-text-xs tw-text-gray-400 tw-text-center tw-mt-2">
                  ← 좌우로 스크롤하여 더 많은 회차를 확인하세요 →
                </div>
              </div>
            </div>
          </div>
          <div className={cx('content-wrap')}>
            <div className={cx('tw-mt-10')}>
              <Grid container direction="row" alignItems="center" rowSpacing={0}>
                <Grid
                  item
                  container
                  justifyContent="flex-start"
                  xs={6}
                  sm={10}
                  className="tw-text-xl tw-text-black tw-font-bold"
                >
                  퀴즈 목록 {contents?.club?.publishedCount} / {contents?.club?.studyCount}
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
              <Divider className="tw-py-3 tw-mb-3" />

              {quizList?.length === 0 && (
                <div className="tw-p-10 tw-rounded-lg border tw-mt-10 tw-text-center tw-text-gray-500 tw-text-base tw-font-medium">
                  아직 오픈된 퀴즈가 없습니다.
                </div>
              )}
              {quizList?.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid
                      className="tw-pt-10"
                      key={index}
                      container
                      direction="row"
                      justifyContent="left"
                      alignItems="center"
                      rowSpacing={3}
                    >
                      {item?.makeupQuizzes?.length > 0 ? (
                        <>
                          <>
                            <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}>
                              <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">
                                Q{item?.order}.
                              </div>
                              <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                                {/* {item?.publishDate?.split('-').slice(1).join('-')} ({item?.dayOfWeek}) */}
                                {item?.publishDate?.slice(5, 10)} {item?.dayOfWeek ? `(${item.dayOfWeek})` : ''}
                              </div>
                              <div
                                className={`tw-flex-auto tw-mt-10 tw-text-center tw-text-sm ${
                                  item?.answer?.answerStatus === '0003' ? 'tw-text-gray' : 'tw-text-[#f44]'
                                } tw-font-bold`}
                              >
                                {item?.answer?.relativeDaysToPublishDate !== undefined
                                  ? item?.answer?.relativeDaysToPublishDate <= 0
                                    ? `D-${Math.abs(item?.answer?.relativeDaysToPublishDate)}`
                                    : `D+${item?.answer?.relativeDaysToPublishDate}`
                                  : ''}
                              </div>
                            </Grid>

                            <Grid item xs={12} sm={11}>
                              <div className="tw-rounded-xl">
                                <div
                                  className={`tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1   ${
                                    item?.answer ? 'tw-rounded-tl-xl tw-rounded-tr-xl' : 'tw-rounded-xl'
                                  }`}
                                >
                                  <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                    <img
                                      className="tw-w-10 tw-h-10 tw-rounded-full tw-ring-1 tw-ring-gray-200"
                                      src={
                                        item?.maker?.profileImageUrl ||
                                        '/assets/images/account/default_profile_image.png'
                                      }
                                    />
                                    <div className="tw-text-xs tw-text-left tw-text-black">{item?.maker?.nickname}</div>
                                  </div>
                                  <div className="tw-flex-auto tw-px-5 tw-w-10/12">
                                    <div className="tw-font-medium tw-text-black">{item?.question}</div>
                                  </div>
                                  {item?.answer?.answerStatus === '0003' && (
                                    <div className="tw-flex-auto">
                                      <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                        <button
                                          onClick={() => {
                                            // window.open(item?.contentUrl, '_blank'); // data?.articleUrl을 새 탭으로 열기
                                            onFileDownload(item?.contentUrl, 'test.pdf');
                                          }}
                                          className="tw-bg-black tw-p-1.5 tw-text-white tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                        >
                                          지식콘텐츠 보기
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="border border-secondary tw-bg-white tw-flex tw-items-center tw-p-4  tw-py-3 tw-rounded-bl-xl tw-rounded-br-xl">
                                  <div className="tw-w-1.5/12 tw-pl-14 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                                        stroke="#31343D"
                                        strokeWidth={2}
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                    <img
                                      className="tw-rounded-full tw-w-10 tw-h-10 tw-ring-1 tw-ring-gray-200"
                                      src={
                                        item?.answer?.member?.profileImageUrl ||
                                        '/assets/images/account/default_profile_image.png'
                                      }
                                    />

                                    <div className="tw-text-xs tw-text-left tw-text-black">
                                      {item?.answer?.member?.nickname}
                                    </div>
                                  </div>
                                  <div className="tw-flex-auto tw-w-9/12 tw-px-5">
                                    <div className="tw-font-medium tw-text-[#9ca5b2] tw-text-sm tw-line-clamp-2">
                                      {item?.answer?.text}
                                    </div>
                                  </div>
                                  <div className="tw-flex-auto">
                                    <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                      <p
                                        onClick={() => toggleExpand(index)}
                                        className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                      >
                                        {expandedItems[index] ? '접기' : '자세히보기'}
                                      </p>
                                      <svg
                                        width={7}
                                        height={10}
                                        viewBox="0 0 7 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="flex-grow-0 flex-shrink-0"
                                        preserveAspectRatio="none"
                                      >
                                        <path d="M1 1L5 5L1 9" stroke="#9CA5B2" strokeWidth="1.5" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </>
                          {item?.makeupQuizzes?.map((item, quizzIndex) => {
                            return (
                              <>
                                <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}></Grid>
                                <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}>
                                  <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold"></div>
                                  <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                                    {item?.publishDate?.split('-').slice(1).join('-')}
                                    {item?.dayOfWeek ? `(${item.dayOfWeek})` : ''}
                                  </div>
                                  <div
                                    className={`tw-flex-auto tw-mt-10 tw-text-center tw-text-sm ${
                                      item?.answer?.answerStatus === '0003' ? 'tw-text-gray' : 'tw-text-[#f44]'
                                    } tw-font-bold`}
                                  >
                                    {item?.answer?.relativeDaysToPublishDate !== undefined
                                      ? item?.answer?.relativeDaysToPublishDate <= 0
                                        ? `D-${Math.abs(item?.answer?.relativeDaysToPublishDate)}`
                                        : `D+${item?.answer?.relativeDaysToPublishDate}`
                                      : ''}
                                  </div>
                                </Grid>

                                <Grid item xs={12} sm={10}>
                                  <div className="tw-rounded-xl">
                                    <div
                                      className={`tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1   ${
                                        item?.answer ? 'tw-rounded-tl-xl tw-rounded-tr-xl' : 'tw-rounded-xl'
                                      }`}
                                    >
                                      <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                        <img
                                          className="tw-w-10 tw-h-10 tw-rounded-full tw-ring-1 tw-ring-gray-200"
                                          src={item?.maker?.profileImageUrl}
                                        />
                                        <div className="tw-text-xs tw-text-left tw-text-black">
                                          {item?.maker?.nickname}
                                        </div>
                                      </div>
                                      <div className="tw-flex-auto tw-px-5 tw-w-10/12">
                                        <div className="tw-font-medium tw-text-black">{item?.question}</div>
                                      </div>
                                      {item?.answer?.answerStatus === '0003' && (
                                        <div className="tw-flex-auto">
                                          <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                            <button
                                              onClick={() => {
                                                window.open(item?.contentUrl, '_blank'); // data?.articleUrl을 새 탭으로 열기
                                              }}
                                              className="tw-bg-black tw-p-1.5 tw-text-white tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                            >
                                              지식콘텐츠 보기
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    {item?.answer?.answerStatus === '0003' ? (
                                      <>
                                        <div className="border border-secondary tw-bg-white tw-flex tw-items-center tw-p-4  tw-py-3 tw-rounded-bl-xl tw-rounded-br-xl">
                                          <div className="tw-w-1.5/12 tw-pl-14 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                                                stroke="#31343D"
                                                strokeWidth={2}
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </div>
                                          <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                            <img
                                              className="tw-rounded-full tw-w-10 tw-h-10 tw-ring-1 tw-ring-gray-200"
                                              src={item?.answer?.member?.profileImageUrl}
                                            />
                                            <div className="tw-text-xs tw-text-left tw-text-black">
                                              {item?.answer?.member?.nickname}
                                            </div>
                                          </div>
                                          <div className="tw-flex-auto tw-w-9/12 tw-px-5">
                                            <div
                                              className={`tw-font-medium tw-text-[#9ca5b2] tw-text-sm ${
                                                expandedQuizzData &&
                                                expandedQuizzData[index] &&
                                                !expandedQuizzData[index][quizzIndex]
                                                  ? 'tw-line-clamp-2'
                                                  : ''
                                              }`}
                                            >
                                              {item?.answer?.text}
                                            </div>
                                          </div>
                                          <div className="tw-flex-auto">
                                            <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                              <p
                                                onClick={() => toggleExpandQuizzData(index, quizzIndex)}
                                                className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                              >
                                                {expandedQuizzData[index] && expandedQuizzData[index][quizzIndex]
                                                  ? '접기'
                                                  : '자세히보기'}
                                              </p>
                                              <svg
                                                width={7}
                                                height={10}
                                                viewBox="0 0 7 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="flex-grow-0 flex-shrink-0"
                                                preserveAspectRatio="none"
                                              >
                                                <path d="M1 1L5 5L1 9" stroke="#9CA5B2" strokeWidth="1.5" />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="border border-secondary tw-bg-white tw-flex tw-items-center  tw-py-1 tw-rounded-bl-xl tw-rounded-br-xl">
                                        <div className="tw-w-1.5/12 tw-pl-14 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                                              stroke="#31343D"
                                              strokeWidth={2}
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </div>
                                        <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                          <img
                                            className="tw-rounded-full tw-w-10 tw-h-10 tw-ring-1 tw-ring-gray-200"
                                            src={
                                              item?.maker?.profileImageUrl ||
                                              '/assets/images/account/default_profile_image.png'
                                            }
                                            alt={item?.maker?.nickname || '사용자'}
                                          />
                                          <div className="tw-text-xs tw-text-left tw-text-black">
                                            {item?.maker?.nickname}
                                          </div>
                                        </div>
                                        <div className="tw-flex-auto tw-w-1.5/12 tw-py-3">
                                          <div className="tw-font-medium tw-text-gray-500 tw-text-sm tw-line-clamp-2">
                                            <div className="tw-text-center">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  router.push(
                                                    {
                                                      pathname: `/quiz/solution/${item?.quizSequence}`,
                                                      query: {
                                                        clubSequence: item?.clubSequence,
                                                      },
                                                    },
                                                    `/quiz/solution/${item?.quizSequence}`,
                                                  );
                                                }}
                                                data-tooltip-target="tooltip-default"
                                                className=" max-lg:tw-w-[60px] tw-px-[30.5px] tw-py-[9.5px] tw-rounded tw-bg-[#E111837] tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                              >
                                                퀴즈 풀러가기
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Grid>
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}>
                            <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">Q{item.order}.</div>
                            <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                              {item?.publishDate?.split('-').slice(1).join('-')}
                              {item?.dayOfWeek ? `(${item.dayOfWeek})` : ''}
                            </div>
                            <div
                              className={`tw-flex-auto tw-mt-10 tw-text-center tw-text-sm ${
                                item?.answer?.answerStatus === '0003' ? 'tw-text-gray' : 'tw-text-[#f44]'
                              } tw-font-bold`}
                            >
                              {item?.answer?.relativeDaysToPublishDate !== undefined
                                ? item?.answer?.relativeDaysToPublishDate < 0
                                  ? `D${item?.answer?.relativeDaysToPublishDate}`
                                  : item?.answer?.relativeDaysToPublishDate === 0
                                    ? `D-0`
                                    : `D+${item?.answer?.relativeDaysToPublishDate}`
                                : ''}
                            </div>
                          </Grid>

                          <Grid item xs={12} sm={11}>
                            <div className="tw-rounded-xl">
                              <div
                                className={`tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1   ${
                                  item?.answer ? 'tw-rounded-tl-xl tw-rounded-tr-xl' : 'tw-rounded-xl'
                                }`}
                              >
                                <div className="tw-w-1.5/12 tw-py-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                  <img
                                    className="tw-w-10 tw-h-10 tw-rounded-full tw-mb-1 tw-ring-1 tw-ring-gray-200"
                                    src={item?.maker?.profileImageUrl}
                                  />
                                  <div className="tw-text-xs tw-text-left tw-text-black">{item?.maker?.nickname}</div>
                                </div>
                                <div className="tw-flex-auto tw-px-5 tw-w-10/12">
                                  <div className="tw-font-medium tw-text-black">{item?.question}</div>
                                </div>
                                {item?.answer?.answerStatus === '0003' && (
                                  <div className="tw-flex-auto">
                                    <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                      <button
                                        onClick={() => {
                                          if (item?.file?.name?.toLowerCase().endsWith('.pdf')) {
                                            onFileDownload(item?.file?.key, item?.file?.name);
                                          } else {
                                            window.open(item?.contentUrl, '_blank'); // data?.articleUrl을 새 탭으로 열기
                                          }
                                        }}
                                        className="tw-bg-black tw-p-1.5 tw-text-white tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                      >
                                        지식콘텐츠 보기
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {item?.answer?.answerStatus === '0003' ? (
                                <>
                                  <div className="border border-secondary tw-bg-white tw-flex tw-items-center tw-p-4  tw-py-3 tw-rounded-bl-xl tw-rounded-br-xl">
                                    <div className="tw-w-1.5/12 tw-pl-10 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                                          stroke="#31343D"
                                          strokeWidth={2}
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                      <img
                                        className="tw-rounded-full tw-w-10 tw-h-10 tw-mb-1 tw-ring-1 tw-ring-gray-200"
                                        src={
                                          item?.answer?.member?.profileImageUrl ||
                                          '/assets/images/account/default_profile_image.png'
                                        }
                                      />
                                      <div className="tw-text-xs tw-text-black">{item?.answer?.member?.nickname}</div>
                                    </div>
                                    <div className="tw-flex-auto tw-w-9/12 tw-px-5">
                                      <div
                                        className={`tw-font-medium tw-text-[#9ca5b2] tw-text-sm ${
                                          !expandedItems[index] ? 'tw-line-clamp-2' : ''
                                        }`}
                                      >
                                        {item?.answer?.text}
                                      </div>
                                    </div>
                                    <div className="tw-flex-auto">
                                      <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                        <p
                                          onClick={() => {
                                            handleFeedbackClick(item?.quizSequence);
                                            // handleClick('sfasd', item?.quizSequence, false);
                                          }}
                                          className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                        >
                                          피드백보기
                                        </p>
                                        <svg
                                          width={7}
                                          height={10}
                                          viewBox="0 0 7 10"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="flex-grow-0 flex-shrink-0"
                                          preserveAspectRatio="none"
                                        >
                                          <path d="M1 1L5 5L1 9" stroke="#9CA5B2" strokeWidth="1.5" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="border border-secondary tw-bg-white tw-flex tw-items-center  tw-py-1 tw-rounded-bl-xl tw-rounded-br-xl">
                                  <div className="tw-w-1.5/12 tw-pl-14 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                                        stroke="#31343D"
                                        strokeWidth={2}
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                    <img
                                      className="tw-rounded-full tw-w-10 tw-h-10 tw-mb-1 tw-ring-1 tw-ring-gray-200"
                                      src={
                                        item?.answer?.member?.profileImageUrl ||
                                        '/assets/images/account/default_profile_image.png'
                                      }
                                    />
                                    <div className="tw-text-xs tw-text-left tw-text-black">
                                      {item?.answer?.member?.nickname}
                                    </div>
                                  </div>
                                  <div className="tw-flex-auto tw-w-1.5/12 tw-py-3">
                                    <div className="tw-font-medium tw-text-gray-500 tw-text-sm tw-line-clamp-2">
                                      <div className="tw-text-center">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            router.push(
                                              {
                                                pathname: `/quiz/solution/${item?.quizSequence}`,
                                                query: {
                                                  clubSequence: item?.clubSequence,
                                                },
                                              },
                                              `/quiz/solution/${item?.quizSequence}`,
                                            );
                                          }}
                                          data-tooltip-target="tooltip-default"
                                          className=" max-lg:tw-w-[60px] tw-px-[30.5px] tw-py-[9.5px] tw-rounded tw-bg-[#2474ED] tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                        >
                                          퀴즈 풀러가기
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <MentorsModal
        isContentModalClick={false}
        title={'채점 및 피드백 상세보기'}
        isOpen={isModalOpen}
        onAfterClose={() => {
          refetchParticipant();
          setIsModalOpen(false);
        }}
      >
        {isQuizGetanswer && (
          <div className="tw-rounded-xl tw-pb-10">
            <div className="tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-4 tw-rounded-t-xl">
              <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <img
                  className="tw-w-10 tw-h-10 tw-ring-1 tw-ring-gray-200 tw-rounded-full"
                  src={clubQuizThreads?.member?.profileImageUrl}
                />
                <div className="tw-text-xs tw-text-left tw-text-black">{clubQuizThreads?.member?.nickname}</div>
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
                      <img className="tw-rounded-full tw-w-10 tw-h-10 border" src="/assets/images/main/chatbot2.png" />
                    ) : (
                      <img
                        className="tw-rounded-full tw-w-10 tw-h-10 tw-ring-1 tw-ring-gray-200"
                        src={item?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
                      />
                    )}
                  </div>
                  <div className="tw-flex-auto tw-w-9/12 tw-px-3">
                    <div className="tw-py-2">
                      <div className="tw-font-medium tw-text-[#9ca5b2] tw-text-sm">
                        <span
                          className={`tw-font-bold ${item?.threadType === '0003' ? 'tw-text-black' : 'tw-text-black'}`}
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
                          // <>
                          //   <div className="tw-float-right tw-text-black">
                          //     AI 채점 : <span className="tw-font-bold">{item?.gradingAi}</span>
                          //   </div>
                          // </>
                          <div className=" tw-border-gray-200">
                            <div className="tw-py-4 tw-space-y-4">
                              {/* Rating Section */}
                              <div>
                                <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                                  <span className="tw-text-sm tw-font-medium">평점({item?.gradingAi || '4.5'}/5)</span>
                                </div>
                                <div className="tw-w-32 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                                  <div
                                    className="tw-h-2 tw-bg-blue-500 tw-rounded-full tw-transition-all tw-duration-300"
                                    style={{ width: `${((parseFloat(item?.gradingAi) || 4.5) / 5) * 100}%` }}
                                  ></div>
                                </div>
                              </div>

                              {/* Content Sections */}
                              <div className="tw-space-y-3">
                                <div>
                                  <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">
                                    전체 피드백
                                  </div>
                                  ㅅㅅ <p className="tw-text-base !tw-text-black">{item?.aiEvaluation?.feedback}</p>
                                </div>

                                <div>
                                  <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">
                                    개선 포인트
                                  </div>
                                  <p className="tw-text-base tw-text-black">{item?.aiEvaluation?.improvePoints}</p>
                                </div>
                                <div>
                                  <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">개선 예선</div>
                                  <p className="tw-text-base tw-text-black">{item?.aiEvaluation?.improveExample}</p>
                                </div>

                                <div>
                                  <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">
                                    피드백 요약
                                  </div>
                                  <p className="tw-text-base tw-text-black">{item?.aiEvaluation?.summaryFeedback}</p>
                                </div>

                                <div>
                                  <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">
                                    추가 학습 자료
                                  </div>
                                  <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded tw-p-4">
                                    <div className="tw-space-y-3">
                                      {item?.aiEvaluation?.additionalResources?.length > 0 ? (
                                        item.aiEvaluation.additionalResources.map((resource, index) => (
                                          <div key={index} className="tw-flex tw-items-start tw-gap-2">
                                            <div className="tw-w-1.5 tw-h-1.5 tw-bg-blue-500 tw-rounded-full tw-mt-2 tw-flex-shrink-0"></div>
                                            <div className="tw-text-base">
                                              <div className="tw-font-medium tw-text-blue-800 tw-mb-1">
                                                {resource.title}
                                              </div>
                                              <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="tw-text-blue-600 tw-underline tw-text-xs tw-break-all"
                                              >
                                                {resource.url}
                                              </a>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="tw-text-gray-500 tw-text-sm">추가 학습 자료가 없습니다.</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
                                    // window.open(file.url, '_blank');
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
                <div className="tw-text-center tw-py-10">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      refetchParticipant();
                    }}
                    className="tw-bg-gray-200 tw-mr-3 tw-text-white tw-text-sm tw-text-black tw-py-3 tw-px-4 tw-w-40 tw-rounded"
                  >
                    취소
                  </button>
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
      </MentorsModal>

      {/* 총평 피드백 모달 */}
      <MentorsModal
        isContentModalClick={false}
        title={'총평 피드백보기'}
        isOpen={isTotalFeedbackModalOpen}
        onAfterClose={() => {
          setIsLoading(false);
          setIsTotalFeedbackModalOpen(false);
        }}
      >
        <div className="tw-max-h-[80vh] tw-overflow-y-auto tw-pb-20">
          {/* 전체 퀴즈 총평 피드백 */}
          {isLoading && (
            <div className="tw-flex tw-items-center tw-justify-center tw-h-full">
              <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-b-2 tw-border-blue-500 tw-mb-4"></div>
              <p className="tw-text-gray-600 tw-text-base">총평 피드백을 불러오는 중입니다...</p>
            </div>
          )}
          {!isLoading && (
            <div className="border tw-border-gray-200 tw-rounded-lg tw-p-4">
              <div className="tw-flex tw-items-center tw-mb-4">
                <div className="tw-w-8 tw-h-8 tw-bg-blue-500 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-3">
                  <span className="tw-text-white tw-text-sm tw-font-bold">AI</span>
                </div>
                <div className="tw-flex tw-items-center tw-gap-2">
                  <p className="tw-text-base tw-font-bold tw-text-black">AI피드백</p>
                  <p className="tw-text-sm tw-text-gray-500">10.28(월) 23:50:05</p>
                </div>
              </div>

              <div className="tw-text-blue-600 tw-text-base tw-mb-4 tw-font-bold tw-cursor-pointer">학습자 분석</div>

              {/* 학습자 분석 차트 영역 */}
              <div className=" tw-p-6 tw-rounded-lg tw-mb-6">
                <div className="tw-grid tw-gap-6" style={{ gridTemplateColumns: '60% 40%' }}>
                  {/* 레이더 차트 영역 (간단한 표현) */}
                  <div className="tw-relative tw-flex tw-items-center tw-justify-center">
                    {/* 레이더 차트 컨테이너 */}
                    <div className="tw-w-full tw-h-full">
                      {typeof window !== 'undefined' && (
                        <ReactApexChart
                          options={{
                            chart: {
                              type: 'radar',
                              toolbar: {
                                show: false,
                              },
                              background: 'transparent',
                            },
                            colors: ['#3B82F6', '#F59E0B'],
                            fill: {
                              type: 'solid',
                              opacity: [0.6, 0.3],
                            },
                            stroke: {
                              width: [2, 2],
                              dashArray: [0, 5],
                            },
                            markers: {
                              size: [4, 4],
                            },
                            xaxis: {
                              categories: ['이해도', '성실도', '사고도', '완성도', '참여도'],
                              labels: {
                                style: {
                                  colors: '#374151',
                                  fontSize: '12px',
                                  fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
                                  fontWeight: 500,
                                },
                              },
                            },
                            yaxis: {
                              show: false,
                              min: 0,
                              max: 100,
                            },
                            grid: {
                              show: false,
                            },
                            plotOptions: {
                              radar: {
                                size: 130,
                                polygons: {
                                  fill: {
                                    colors: ['transparent'],
                                  },
                                },
                              },
                            },
                            dataLabels: {
                              enabled: false,
                            },
                            legend: {
                              show: true,
                              position: 'bottom',
                              horizontalAlign: 'center',
                              fontSize: '12px',
                              fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
                            },
                          }}
                          series={[
                            {
                              name: '내 점수',
                              data: [
                                aiFeedbackDataTotal?.myEvaluationScores?.understanding || 0,
                                aiFeedbackDataTotal?.myEvaluationScores?.diligence || 0,
                                aiFeedbackDataTotal?.myEvaluationScores?.criticalThinking || 0,
                                aiFeedbackDataTotal?.myEvaluationScores?.completion || 0,
                                aiFeedbackDataTotal?.myEvaluationScores?.participation || 0,
                              ], // 이해도, 성실도, 사고도, 완성도, 참여도
                            },
                            {
                              name: '평균 점수',
                              data: [
                                aiFeedbackDataTotal?.averageEvaluationScores?.understanding || 0,
                                aiFeedbackDataTotal?.averageEvaluationScores?.diligence || 0,
                                aiFeedbackDataTotal?.averageEvaluationScores?.criticalThinking || 0,
                                aiFeedbackDataTotal?.averageEvaluationScores?.completion || 0,
                                aiFeedbackDataTotal?.averageEvaluationScores?.participation || 0,
                              ], // 비교군 데이터 (점선)
                            },
                          ]}
                          type="radar"
                          width="100%"
                          height="110%"
                        />
                      )}
                    </div>
                  </div>

                  {/* 상세 점수 */}
                  <div className="tw-space-y-3">
                    <div className="tw-text-base tw-font-bold tw-text-black tw-mb-4">상세 항목</div>

                    <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                      <span className="tw-text-sm tw-text-gray-700">이해도</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                          <div
                            className="tw-h-full tw-bg-black tw-rounded-full tw-transition-all tw-duration-300"
                            style={{ width: `${aiFeedbackDataTotal?.myEvaluationScores?.understanding || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-font-medium">
                          {aiFeedbackDataTotal?.myEvaluationScores?.understanding || 0}/100
                        </span>
                      </div>
                    </div>
                    <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                      <span className="tw-text-sm tw-text-gray-700">성실도</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                          <div
                            className="tw-h-full tw-bg-black tw-rounded-full tw-transition-all tw-duration-300"
                            style={{ width: `${aiFeedbackDataTotal?.myEvaluationScores?.diligence || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-font-medium">
                          {aiFeedbackDataTotal?.myEvaluationScores?.diligence || 0}/100
                        </span>
                      </div>
                    </div>
                    <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                      <span className="tw-text-sm tw-text-gray-700">사고도</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                          <div
                            className="tw-h-full tw-bg-black tw-rounded-full tw-transition-all tw-duration-300"
                            style={{ width: `${aiFeedbackDataTotal?.myEvaluationScores?.criticalThinking || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-font-medium">
                          {aiFeedbackDataTotal?.myEvaluationScores?.criticalThinking || 0}/100
                        </span>
                      </div>
                    </div>
                    <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                      <span className="tw-text-sm tw-text-gray-700">완성도</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                          <div
                            className="tw-h-full tw-bg-black tw-rounded-full tw-transition-all tw-duration-300"
                            style={{ width: `${aiFeedbackDataTotal?.myEvaluationScores?.completion || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-font-medium">
                          {aiFeedbackDataTotal?.myEvaluationScores?.completion || 0}/100
                        </span>
                      </div>
                    </div>
                    <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                      <span className="tw-text-sm tw-text-gray-700">참여도</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                          <div
                            className="tw-h-full tw-bg-black tw-rounded-full tw-transition-all tw-duration-300"
                            style={{ width: `${aiFeedbackDataTotal?.myEvaluationScores?.participation || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-font-medium">
                          {aiFeedbackDataTotal?.myEvaluationScores?.participation || 0}/100
                        </span>
                      </div>
                    </div>

                    <div className="tw-mt-4 tw-pt-3  tw-border-t tw-border-gray-200">
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-base tw-font-bold tw-text-black">총점</span>
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <div className="tw-text-sm tw-text-gray-600">학습 평점지수 : </div>
                          <div className="tw-text-sm tw-text-gray-600">
                            {aiFeedbackDataTotal?.totalScore?.average || 0}/5
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tw-flex tw-justify-between tw-items-center border-white tw-rounded-full tw-p-5 tw-bg-[#F3F9FF]">
                      <span className="tw-text-sm tw-font-bold tw-text-gray-700">내 점수</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                          <div
                            className="tw-h-full tw-bg-blue-500 tw-rounded-full tw-transition-all tw-duration-300"
                            style={{ width: `${((aiFeedbackDataTotal?.totalScore?.myScore || 0) / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-font-medium">
                          {aiFeedbackDataTotal?.totalScore?.myScore || 0}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 학습 총평 피드백 */}
              <div className="tw-mb-6">
                <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">학습 총평 피드백</div>
                <div className="tw-rounded-lg">
                  <p className="tw-text-base tw-text-gray-700 tw-leading-relaxed">
                    {aiFeedbackDataTotal?.feedback?.overallFeedback}
                  </p>
                </div>
              </div>

              {/* 강점 */}
              <div className="tw-mb-6">
                <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">강점</div>
                <div className="tw-space-y-2">
                  <p className="tw-text-base tw-text-gray-700">{aiFeedbackDataTotal?.feedback?.strengths}</p>
                </div>
              </div>

              {/* 약점 */}
              <div className="tw-mb-6">
                <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">약점</div>
                <div className="tw-space-y-2">
                  <p className="tw-text-base tw-text-gray-700">{aiFeedbackDataTotal?.feedback?.weaknesses}</p>
                </div>
              </div>
              {/* 약점 */}
              <div className="tw-mb-6">
                <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">개선</div>
                <div className="tw-space-y-2">
                  <p className="tw-text-base tw-text-gray-700">{aiFeedbackDataTotal?.feedback?.improvement}</p>
                </div>
              </div>

              {/* 학습 추천 */}
              <div className="tw-mb-6">
                <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">학습 추천</div>
                {aiFeedbackDataTotal?.recommendations?.length > 0 ? (
                  <div className="tw-space-y-4">
                    {aiFeedbackDataTotal.recommendations.map((recommendation, index) => (
                      <div key={index} className="tw-bg-gray-50 tw-p-4 tw-rounded-lg">
                        <div className="tw-text-base tw-text-gray-700 tw-mb-3 tw-font-medium">
                          {recommendation.recommendation}
                        </div>
                        {recommendation.resources?.length > 0 && (
                          <div className="tw-space-y-2">
                            {recommendation.resources.map((resource, resourceIndex) => (
                              <div key={resourceIndex} className="tw-pl-4 tw-border-l-2 tw-border-blue-200">
                                <div className="tw-text-sm tw-font-medium tw-text-blue-800 tw-mb-1">
                                  {resource.title}
                                </div>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="tw-text-blue-500 tw-underline tw-text-sm tw-break-all"
                                >
                                  {resource.url}
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="tw-text-gray-500 tw-text-sm">학습 추천 자료가 없습니다.</p>
                )}
              </div>

              {/* 개별 퀴즈 피드백 요약 */}
              <div
                className="tw-text-black tw-text-base tw-font-bold tw-mb-3"
                style={{
                  fontFamily:
                    'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                }}
              >
                개별 퀴즈 피드백 요약
              </div>
              {aiFeedbackDataTotalQuiz && (
                <div>
                  {aiFeedbackDataTotalQuiz?.contents.map(item => (
                    <div>
                      <div className="tw-mb-4">
                        <div className="border tw-border-gray-200 tw-rounded-lg tw-bg-white">
                          <div className="tw-flex tw-justify-between tw-items-center border-bottom tw-px-4">
                            <div className="tw-flex tw-items-center tw-gap-3 tw-p-4">
                              <span
                                className="tw-text-lg tw-font-bold tw-text-black"
                                style={{
                                  fontFamily:
                                    'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                                }}
                              >
                                {item.order}회
                              </span>
                              <span
                                className="tw-text-sm tw-text-gray-600"
                                style={{
                                  fontFamily:
                                    'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                                }}
                              >
                                {item.publishDate} {item.question}
                              </span>
                            </div>
                          </div>

                          <div className="tw-bg-[#F6F7FB] tw-p-6">
                            <div className="tw-mb-6">
                              <div className="tw-flex tw-items-center tw-mb-2">
                                <span className="tw-text-sm tw-font-medium tw-text-gray-700">
                                  평점({item.grading || 0}/5)
                                </span>
                              </div>
                              <div className="tw-w-64">
                                <div className="tw-bg-gray-200 tw-rounded-full tw-h-2">
                                  <div
                                    className="tw-bg-blue-500 tw-h-2 tw-rounded-full"
                                    style={{ width: `${((item.grading || 0) / 5) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            {/* Feedback Summary */}
                            <div>
                              <div className="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">피드백 요약</div>
                              <ul className="tw-space-y-2">
                                <li className="tw-flex tw-items-start">
                                  <div className="tw-w-1.5 tw-h-1.5 tw-bg-gray-400 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></div>
                                  <span className="tw-text-sm tw-text-gray-600">
                                    {item.summaryFeedback || '피드백 요약이 없습니다.'}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </MentorsModal>

      {/* 피드백 모달 */}
      <MentorsModal
        isOpen={isFeedbackModalOpen}
        onAfterClose={() => {
          setIsFeedbackModalOpen(false);
        }}
        title="피드백 보기"
        height="80%"
        isProfile={true}
        isContentModalClick={false}
      >
        <div className="tw-max-w-4xl tw-mx-auto tw-min-h-screen tw-pb-5">
          {/* Header */}
          <div className="tw-space-y-4">
            <div className="border tw-rounded-lg">
              <div className="tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between">
                <div className="tw-flex tw-items-center tw-gap-3">
                  <span className="tw-text-sm tw-text-gray-500 tw-bg-[#9CA5B2] tw-text-white tw-rounded-full tw-px-2 tw-py-1">
                    답변완료
                  </span>
                  {/* <span className="tw-font-semibold">6회</span>
                  <span className="tw-text-gray-500 tw-text-sm">10:03(월)</span> */}
                </div>
                <div className="tw-flex tw-items-center tw-gap-2">
                  <span className="tw-text-sm tw-text-gray-500">{aiFeedbackData?.member?.nickname}</span>
                  <img src={aiFeedbackData?.member?.profileImageUrl} className="tw-w-6 tw-h-6 tw-rounded-full" />
                </div>
                {/* Main Topic */}
              </div>
              <div className="tw-p-4">
                <p className="tw-text-base tw-text-black">{aiFeedbackData?.question}</p>
              </div>
            </div>
            {/* First Response */}
            {aiFeedbackData?.clubQuizThreads.map(item => (
              <div
                className={`tw-space-y-2 border tw-p-4 tw-rounded-lg ${
                  item?.threadType === '0001' || item?.threadType === '0002' ? 'tw-bg-[#F6F7FB]' : ''
                }`}
              >
                <div className="tw-flex tw-items-center tw-gap-2">
                  <span className="tw-font-semibold tw-text-gray-800">
                    {item.threadType === '0001'
                      ? '사전답변'
                      : item.threadType === '0002'
                        ? '최종답변'
                        : item.threadType === '0003'
                          ? 'AI피드백'
                          : item.threadType === '0004'
                            ? '교수자답변'
                            : '최종답변'}
                  </span>
                  <span className="tw-text-xs tw-text-gray-500">{item.createdAt}</span>
                </div>
                <div className="tw-rounded-lg tw-border tw-border-gray-200">
                  {/* <p className="tw-text-sm tw-text-gray-700 tw-leading-relaxed">{item.text}</p> */}
                  {item?.threadType === '0003' ? (
                    <div className="">
                      <div className="tw-py-4 tw-space-y-4">
                        {/* Rating Section */}
                        <div>
                          <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                            <span className="tw-text-sm tw-font-medium">평점({item?.gradingAi || '4.5'}/5)</span>
                          </div>
                          <div className="tw-w-32 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                            <div
                              className="tw-h-2 tw-bg-blue-500 tw-rounded-full tw-transition-all tw-duration-300"
                              style={{ width: `${((parseFloat(item?.gradingAi) || 4.5) / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Content Sections */}
                        <div className="tw-space-y-3">
                          <div>
                            <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">전체 피드백</div>
                            <p className="tw-text-base !tw-text-black">{item?.aiEvaluation?.feedback}</p>
                          </div>

                          <div>
                            <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">개선 포인트</div>
                            <p className="tw-text-base tw-text-black">{item?.aiEvaluation?.improvePoints}</p>
                          </div>
                          <div>
                            <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">개선 예선</div>
                            <p className="tw-text-base tw-text-black">{item?.aiEvaluation?.improveExample}</p>
                          </div>

                          <div>
                            <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">피드백 요약</div>
                            <p className="tw-text-base tw-text-black">{item?.aiEvaluation?.summaryFeedback}</p>
                          </div>

                          <div>
                            <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">추가 학습 자료</div>
                            <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded tw-p-4">
                              <div className="tw-space-y-3">
                                {item?.aiEvaluation?.additionalResources?.length > 0 ? (
                                  item.aiEvaluation.additionalResources.map((resource, index) => (
                                    <div key={index} className="tw-flex tw-items-start tw-gap-2">
                                      <div className="tw-w-1.5 tw-h-1.5 tw-bg-blue-500 tw-rounded-full tw-mt-2 tw-flex-shrink-0"></div>
                                      <div className="tw-text-base">
                                        <div className="tw-font-medium tw-text-blue-800 tw-mb-1">{resource.title}</div>
                                        <a
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="tw-text-blue-600 tw-underline tw-text-xs tw-break-all"
                                        >
                                          {resource.url}
                                        </a>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="tw-text-gray-500 tw-text-sm">추가 학습 자료가 없습니다.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`tw-text-[#9ca5b2] tw-text-base ${item?.threadType === '0003' ? 'tw-text-black' : ''}`}
                    >
                      {item?.text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MentorsModal>

      {/* 총평 피드백 모달 */}
    </div>
  );
};

export default QuizClubDetaillSolution;
