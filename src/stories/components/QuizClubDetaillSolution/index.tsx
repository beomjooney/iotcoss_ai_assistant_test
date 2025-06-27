// QuizClubDetailInfo.jsx
import React, { useState, useRef, useEffect } from 'react';
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
import { useStore } from 'src/store';
import UserIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';

import { getButtonText } from 'src/utils/clubStatus';
import {
  useSaveLike,
  useDeleteLike,
  useSaveReply,
  useDeleteReply,
  useDeletePost,
} from 'src/services/community/community.mutations';
import router from 'next/router';

import { useQuizGetAIMyAnswer } from 'src/services/quiz/quiz.queries';
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
  const { user } = useStore();
  let [isLiked, setIsLiked] = useState(contents?.club?.isFavorite);
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();
  const [isResultOpen, setIsResultOpen] = useState<boolean>(false);
  const [clubQuizThreads, setClubQuizThreads] = useState<any>([]);
  const [isHideAI, setIsHideAI] = useState(true);
  const [isAIData, setIsAIData] = useState({});
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [quizSequence, setQuizSequence] = useState<number>(0);
  const [quizParams, setQuizParams] = useState<any>({});
  const [quizParamsAll, setQuizParamsAll] = useState<any>({});
  const [grade, setGrade] = useState('');
  const [fileList, setFileList] = useState([]);
  const [inputList, setInputList] = useState([]);
  const [clubQuizGetThreads, setClubQuizGetThreads] = useState<any>('');
  const [expandedItems, setExpandedItems] = useState(() => Array(quizList?.length || 0).fill(false));
  const [key, setKey] = useState('');
  const [fileName, setFileName] = useState('');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [isTotalFeedbackModalOpen, setIsTotalFeedbackModalOpen] = useState<boolean>(false);
  const [state, setState] = React.useState({
    series: [
      {
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'radar',
      },
      title: {
        text: 'Basic Radar Chart',
      },
      yaxis: {
        stepSize: 20,
      },
      xaxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June'],
      },
    },
  });
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
    data.clubQuizThreads.map(item => {
      // Check if the threadType is '0004' and return null to hide the div
      if (item?.threadType === '0004') {
        setIsHideAI(false);
        setIsAIData(item);
        console.log('false');
      }
    });
  });

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

  useEffect(() => {
    if (answerSuccessSavePut) {
      refetchQuizAnswer();
      setIsLoadingAI(false);
    }
  }, [answerSuccessSavePut, answerErrorSavePut]);

  useEffect(() => {
    if (aiQuizAnswerDataSavePut) {
      console.log('aiQuizAnswerDataSavePut', aiQuizAnswerDataSavePut);
    }
  }, [aiQuizAnswerDataSavePut]);

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

  useDidMountEffect(() => {
    refetchQuizAnswer();
  }, [quizParams]);

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    setKey(key);
    setFileName(fileName);
  };

  const handleUpdate = () => {
    console.log('Update function called');
    // 수정 기능 구현
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
                  className="tw-bg-[#e11837] tw-rounded-[3.5px] tw-px-[24.5px] tw-py-[10.0625px] tw-cursor-pointer"
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
                onClick={() => setIsTotalFeedbackModalOpen(true)}
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
                            <button
                              onClick={() => setIsFeedbackModalOpen(true)}
                              className="tw-bg-gray-800 tw-text-white tw-px-2 tw-py-1 tw-rounded-full tw-whitespace-nowrap tw-cursor-pointer tw-border-none"
                            >
                              피드백보기
                            </button>
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
                        {session?.status === '0003' && clubAbout?.feedbackType === '0200' && !session?.grade && (
                          <div className="tw-mt-2">
                            <button
                              onClick={() => handleClick('sfasd', session?.quizSequence, true)}
                              className="tw-text-xs tw-bg-blue-500 tw-text-white tw-px-2 tw-py-1 tw-rounded tw-w-full tw-whitespace-nowrap"
                            >
                              채점하기
                            </button>
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
                                            handleClick('sfasd', item?.quizSequence, false);
                                            // toggleExpand(index)
                                          }}
                                          className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                        >
                                          {/* {expandedItems[index] ? '접기' : '자세히보기'} */}
                                          자세히보기
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
                                          className=" max-lg:tw-w-[60px] tw-px-[30.5px] tw-py-[9.5px] tw-rounded tw-bg-[#E11837] tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
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
          setIsTotalFeedbackModalOpen(false);
        }}
      >
        <div className="tw-max-h-[80vh] tw-overflow-y-auto">
          {/* 전체 퀴즈 총평 피드백 */}
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
                        as
                        any
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
                            data: [90, 60, 50, 70, 100], // 이해도, 성실도, 사고도, 완성도, 참여도
                          },
                          {
                            name: '평균 점수',
                            data: [75, 80, 65, 85, 70], // 비교군 데이터 (점선)
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
                    <span className="tw-text-sm tw-text-gray-700">참됨도</span>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                        <div className="tw-w-[34%] tw-h-full tw-bg-black tw-rounded-full"></div>
                      </div>
                    </div>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <span className="tw-text-sm tw-font-medium">34/100</span>
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                    <span className="tw-text-sm tw-text-gray-700">참됨도</span>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                        <div className="tw-w-[34%] tw-h-full tw-bg-black tw-rounded-full"></div>
                      </div>
                    </div>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <span className="tw-text-sm tw-font-medium">34/100</span>
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                    <span className="tw-text-sm tw-text-gray-700">참됨도</span>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                        <div className="tw-w-[34%] tw-h-full tw-bg-black tw-rounded-full"></div>
                      </div>
                    </div>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <span className="tw-text-sm tw-font-medium">34/100</span>
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                    <span className="tw-text-sm tw-text-gray-700">참됨도</span>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                        <div className="tw-w-[34%] tw-h-full tw-bg-black tw-rounded-full"></div>
                      </div>
                    </div>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <span className="tw-text-sm tw-font-medium">34/100</span>
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                    <span className="tw-text-sm tw-text-gray-700">참됨도</span>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                        <div className="tw-w-[34%] tw-h-full tw-bg-black tw-rounded-full"></div>
                      </div>
                    </div>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <span className="tw-text-sm tw-font-medium">34/100</span>
                    </div>
                  </div>

                  <div className="tw-mt-4 tw-pt-3  tw-border-t tw-border-gray-200">
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <span className="tw-text-base tw-font-bold tw-text-black">총점</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-text-sm tw-text-gray-600">학습 평점지수 : </div>
                        <div className="tw-text-sm tw-text-gray-600">3.7</div>
                      </div>
                    </div>
                  </div>

                  <div className="tw-flex tw-justify-between tw-items-center border-white tw-rounded-full tw-p-5 tw-bg-[#F3F9FF]">
                    <span className="tw-text-sm tw-font-bold tw-text-gray-700">내 점수</span>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                        <div className="tw-w-[50%] tw-h-full tw-bg-blue-500 tw-rounded-full"></div>
                      </div>
                    </div>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <span className="tw-text-sm tw-font-medium">100/100</span>
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
                  학습자님은 이번 학습에서 뛰어난 개념적 이해 능력과 높은 분석적 사고를 보여 주었습니다. 특히 정의 및
                  개념적인 이해 부분에서 뛰어난 실력을 보여주었고, 알부 구성요소 분석 능력 또한 뛰어났습니다. 다만, 일부
                  답변에서 보다 구체적인 설명을 통해 응답하시는 뿌리깊은 지식을 바탕으로 심화 학습을 진행하신다면, 더욱
                  체계적이고 완성도 높은 퀴즈 해결 능력을 갖추실 수 있을 것입니다.
                </p>
              </div>
            </div>

            {/* 강점 */}
            <div className="tw-mb-6">
              <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">강점</div>
              <div className="tw-space-y-2">
                <p className="tw-text-base tw-text-gray-700">
                  • 핵실 개념(예: Pod, Node, Master 등)의 정의를 정확히 장악되어 있는 시도
                </p>
                <p className="tw-text-base tw-text-gray-700">
                  • 기술 용어 사용에 대한 익숙함 (예: 오브젝트의이션, 클러스터, API Server 등)
                </p>
                <p className="tw-text-base tw-text-gray-700">
                  • 서술형 문장 구성의 우수성 - 비전문자도 이해할 수 있을 정도 명확함
                </p>
              </div>
            </div>

            {/* 약점 */}
            <div className="tw-mb-6">
              <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">약점</div>
              <div className="tw-space-y-2">
                <p className="tw-text-base tw-text-gray-700">
                  • 문체에서 요구하는 "비교", "단계", "예제 구별" 등을 명확히 서술하지 못한 사이가 저차 분될
                </p>
                <p className="tw-text-base tw-text-gray-700">
                  • 일부 용어 간 구체적인 예시와 실제 상태를 위하는 하고 있지 는 찾라를 생각로 있었음
                </p>
                <p className="tw-text-base tw-text-gray-700">
                  • Kubernetes 구성요소 간의 종체적인 술셀나 레시시트 감히라는 케이피니트가 필뤄던 부답이 있상됨
                </p>
              </div>
            </div>

            {/* 학습 추천 */}
            <div className="tw-mb-6">
              <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">학습 추천</div>
              <div className="tw-space-y-2">
                <p className="tw-text-base tw-text-gray-700">
                  • Kubernetes 전체 구조를 시각적으로 이해할 수 있는 아키텍처 다이어그램 학습
                </p>
                <p className="tw-text-base tw-text-gray-700 tw-ml-4">
                  <a
                    href="https://doublepe.monday.com/boards/5349177278/pulses/9235906161"
                    className="tw-text-blue-500 tw-underline"
                  >
                    https://doublepe.monday.com/boards/5349177278/pulses/9235906161
                  </a>
                </p>
                <p className="tw-text-base tw-text-gray-700">
                  • kubectl 명령어를 활용한 실습을 통해 구성 요소를 설치 학습하고 개별적 연관
                </p>
                <p className="tw-text-base tw-text-gray-700 tw-ml-4">
                  <a
                    href="https://doublepe.monday.com/boards/6349177278/pulses/9235906161"
                    className="tw-text-blue-500 tw-underline"
                  >
                    https://doublepe.monday.com/boards/6349177278/pulses/9235906161
                  </a>
                </p>
                <p className="tw-text-base tw-text-gray-700">
                  • "Pod은 왜 컨테이너보다 상위 단위를 쓰는가?" 같은 응용상 질문에 대한 사고 훈련
                </p>
              </div>
            </div>

            {/* 개별 퀴즈 피드백 요약 */}
            <div
              className="tw-text-black tw-text-base tw-font-bold tw-mb-3"
              style={{
                fontFamily: 'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
              }}
            >
              개별 퀴즈 피드백 요약
            </div>
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
                      10회
                    </span>
                    <span
                      className="tw-text-sm tw-text-gray-600"
                      style={{
                        fontFamily:
                          'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                      }}
                    >
                      10.03 (목) Kubernetes 구성요소의 역할에 대해서 설명하세요. (Master, Node, Pod 등)
                    </span>
                  </div>
                  <span className="tw-text-xs tw-text-gray-500 tw-cursor-pointer tw-flex tw-items-center">
                    자세히보기
                    <svg className="tw-w-3 tw-h-3 tw-ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

                <div className="tw-bg-[#F6F7FB] tw-p-6">
                  <div className="tw-mb-6">
                    <div className="tw-flex tw-items-center tw-mb-2">
                      <span className="tw-text-sm tw-font-medium tw-text-gray-700">평점(4.5/5)</span>
                    </div>
                    <div className="tw-w-64">
                      <div className="tw-bg-gray-200 tw-rounded-full tw-h-2">
                        <div className="tw-bg-blue-500 tw-h-2 tw-rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Summary */}
                  <div>
                    <div className="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">피드백 요약</div>
                    <ul className="tw-space-y-2">
                      <li className="tw-flex tw-items-start">
                        <div className="tw-w-1.5 tw-h-1.5 tw-bg-gray-400 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></div>
                        <span className="tw-text-sm tw-text-gray-600">정의는 잘 기술됨.</span>
                      </li>
                      <li className="tw-flex tw-items-start">
                        <div className="tw-w-1.5 tw-h-1.5 tw-bg-gray-400 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></div>
                        <span className="tw-text-sm tw-text-gray-600">질문 핵심인 "구성요소의 역할"이 빠짐.</span>
                      </li>
                      <li className="tw-flex tw-items-start">
                        <div className="tw-w-1.5 tw-h-1.5 tw-bg-gray-400 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></div>
                        <span className="tw-text-sm tw-text-gray-600">
                          구성요소별 설명을 덧붙이면 훨씬 완성도 있는 답안이 됩니다.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MentorsModal>

      {/* 피드백 모달 */}
      <MentorsModal
        isOpen={isFeedbackModalOpen}
        onAfterClose={() => setIsFeedbackModalOpen(false)}
        title="피드백 보기"
        height="80%"
        isContentModalClick={false}
      >
        <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-pb-4">
          {/* Header */}
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-5 tw-mb-4 border">
            <div className="tw-flex tw-items-center tw-justify-between">
              <div className="tw-flex tw-items-center tw-gap-2">
                <span className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-sm tw-font-medium tw-bg-gray-200 tw-text-gray-700">
                  답변수정변완료
                </span>
                <span className="tw-text-base tw-font-bold tw-text-gray-600">6회</span>
                <span className="tw-text-sm tw-text-gray-600">10:03 (월)</span>
              </div>
              <div className="tw-flex tw-items-center tw-gap-2">
                <span className="tw-text-sm tw-text-gray-600">김철민</span>
                <div className="tw-w-8 tw-h-8 tw-bg-orange-400 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                  <UserIcon className="tw-w-4 tw-h-4 tw-text-white" />
                </div>
                <DescriptionIcon className="tw-w-5 tw-h-5 tw-text-gray-400" />
              </div>
            </div>

            <div className="tw-mt-3">
              <p className="tw-text-gray-800">
                EAI, ESB, API 게이트 웨이, 서비스 메쉬에 대해하여 설명해주세요.
                <span className="tw-text-blue-500">[1]</span>
              </p>
            </div>
          </div>

          {/* 사전답변 Section */}
          <div className="tw-bg-[#F6F7FB] tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200 tw-mb-4">
            <div className="tw-p-5">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3">
                <div className="tw-font-bold tw-text-gray-800 tw-text-lg">사전답변</div>
                <span className="tw-text-sm tw-text-gray-500">10-28 (월) | 18:30:25</span>
              </div>
              <p className="tw-text-gray-700 tw-leading-relaxed">
                쿠버네티스는 컨테이너화된 애플리케이션을 배포, 관리, 확장할 때 수반되는 다수의 수동 프로세스를
                자동화하는 플랫폼입니다.
              </p>
            </div>
          </div>

          {/* 최종답변 Section */}
          <div className="tw-bg-[#F6F7FB] tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200 tw-mb-4">
            <div className="tw-p-5">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3">
                <div className="tw-font-bold tw-text-gray-800 tw-text-lg">최종답변</div>
                <span className="tw-text-sm tw-text-gray-500">10-28 (월) | 22:30:55</span>
              </div>
              <div className="tw-space-y-4 tw-text-gray-700 tw-leading-relaxed">
                <p>
                  Docker는 쿠버네티스가 오케스트레이션하는 컨테이너 런타임으로 사용할 수 있습니다. 쿠버네티스가 노드에
                  대해 포드를 예약하면 해당 노드의 kubelet(각 컨테이너의 실행을 보장하는 서비스)이 지정된 컨테이너를
                  실행하도록 Docker에 명령 Docker는 쿠버네티스가 오케스트레이션하는 컨테이너 런타임으로 사용할 수
                  있습니다. Docker는 쿠버네티스가 오케스트레이션.
                </p>
                <div className="tw-mt-4 tw-flex tw-items-center tw-gap-2">
                  <p className="tw-text-sm tw-text-gray-600">업로드된 파일:</p>
                  <button className="tw-text-blue-500 hover:tw-text-blue-700 tw-underline tw-text-sm tw-bg-transparent tw-border-none tw-p-0 tw-cursor-pointer">
                    240000_쿠스터해결.pdf
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI 피드백 Section */}
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm border tw-mb-4">
            <div className="tw-p-5">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3">
                <div className="tw-w-6 tw-h-6 tw-bg-blue-500 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                  <span className="tw-text-white tw-text-xs tw-font-bold">AI</span>
                </div>
                <div className="tw-font-bold tw-text-gray-500 tw-text-lg">AI피드백</div>
                <span className="tw-text-sm tw-text-gray-500">10-28 (월) | 23:50:05</span>
              </div>

              <div className="tw-mb-4">
                <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                  <span className="tw-text-sm tw-font-medium tw-text-gray-700">평점(4.5/5)</span>
                </div>
                <div className="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-2">
                  <div className="tw-bg-blue-500 tw-h-2 tw-rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="tw-space-y-4">
                <div>
                  <div className="tw-font-bold tw-text-gray-500 tw-mb-2">전체 피드백</div>
                  <p className="tw-text-gray-700 tw-leading-relaxed">
                    답변이 전체적으로 Kubernetes의 정의와 목적을 잘 설명하고 있습니다. 특히 "컨테이너화된 애플리케이션
                    관리의 자동화"라는 핵심 개념을 명확하게 언급한 점이 좋습니다.
                  </p>
                </div>

                <div>
                  <div className="tw-font-bold tw-text-gray-500 tw-mb-2">개선 포인트</div>
                  <p className="tw-text-gray-700 tw-leading-relaxed tw-mb-3">
                    하지만 질문은 "구성요소의 역할(Master, Node, Pod 등)"에 대한 설명을 요구하고 있었기 때문에, 주요
                    구성요소별 역할이 빠져있다는 점이 아쉽습니다. 예를 들어 다음과 같은 점이 있습니다.
                  </p>
                  <ul className="tw-space-y-2 tw-text-gray-700">
                    <li className="tw-flex tw-items-start tw-gap-2">
                      <span className="tw-text-blue-500 tw-mt-1">•</span>
                      <span>Master: 클러스터를 제어하고 스케줄링을 담당하는 중앙 제어 플레인</span>
                    </li>
                    <li className="tw-flex tw-items-start tw-gap-2">
                      <span className="tw-text-blue-500 tw-mt-1">•</span>
                      <span>Node: 실제로 컨테이너(Pod)를 실행하는 워커 머신</span>
                    </li>
                    <li className="tw-flex tw-items-start tw-gap-2">
                      <span className="tw-text-blue-500 tw-mt-1">•</span>
                      <span>Pod: 하나 이상의 컨테이너를 포함하는 배포 단위로, 네트워크와 스토리지를 공유함.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="tw-font-bold tw-text-gray-500 tw-mb-2">개선 예시</div>
                  <p className="tw-text-gray-700 tw-leading-relaxed">
                    Kubernetes는 컨테이너 애플리케이션의 배포 및 관리를 자동화하는 오픈소스 플랫폼이며, 주요 구성요소는
                    Master, Node, Pod가 있습니다. Master는 클러스터 제어와 스케줄링을 담당하며, Node는 실제 작업을
                    수행하는 서버입니다. Pod는 하나 이상의 컨테이너를 묶는 단위로, 공통의 네트워크와 스토리지를
                    공유합니다.
                  </p>
                </div>

                <div>
                  <div className="tw-font-bold tw-text-gray-500 tw-mb-2">피드백 요약</div>
                  <ul className="tw-space-y-1 tw-text-gray-700">
                    <li className="tw-flex tw-items-start tw-gap-2">
                      <span className="tw-text-blue-500 tw-mt-1">•</span>
                      <span>정의는 잘 기술함.</span>
                    </li>
                    <li className="tw-flex tw-items-start tw-gap-2">
                      <span className="tw-text-blue-500 tw-mt-1">•</span>
                      <span>집중 핵심인 "구성요소의 역할"이 빠짐.</span>
                    </li>
                    <li className="tw-flex tw-items-start tw-gap-2">
                      <span className="tw-text-blue-500 tw-mt-1">•</span>
                      <span>구성요소별 설명을 덧붙이면 훨씬 완성도 있는 답변이 됩니다.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MentorsModal>
    </div>
  );
};

export default QuizClubDetaillSolution;
