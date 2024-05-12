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

/**icon */
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import SearchIcon from '@mui/icons-material/Search';
import router from 'next/router';

import { CommunityCard } from 'src/stories/components';
const cx = classNames.bind(styles);

//comment
import { useQuizAnswerDetail, useQuizRankDetail, useQuizSolutionDetail } from 'src/services/quiz/quiz.queries';

const QuizClubDetaillSolution = ({
  clubInfo,
  totalElements,
  quizList,
  border,
  page,
  totalPage,
  leaders,
  clubQuizzes,
  handlePageChange,
  representativeQuizzes,
}) => {
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
  // const [activeTab, setActiveTab] = useState('myQuiz');
  const [activeTab, setActiveTab] = useState('community');
  const [selectedOption, setSelectedOption] = useState('latest');
  const [answerContents, setAnswerContents] = useState<RecommendContent[]>([]);
  const [totalElementsCm, setTotalElementsCm] = useState(0);
  const [totalPageCm, setTotalPageCm] = useState(1);
  const [beforeOnePick, setBeforeOnePick] = useState(1);

  const [params, setParams] = useState<any>({ id: '154', page });

  const { isFetched: isQuizAnswerListFetched } = useQuizAnswerDetail(params, data => {
    //console.log(data);
    setAnswerContents(data?.contents);
    setTotalElementsCm(data?.totalElements);
    setTotalPageCm(data?.totalPages);
    // isOnePicked가 true인 객체를 찾고 그 객체의 clubQuizAnswerSequence 값을 가져옵니다.
    console.log(data?.contents.find(item => item.isOnePicked === true)?.clubQuizAnswerSequence);
    setBeforeOnePick(data?.contents.find(item => item.isOnePicked === true)?.clubQuizAnswerSequence);
  });

  const handleChangeQuiz = event => {
    setSelectedOption(event.target.value);
  };

  const handleTabClick = tab => {
    setActiveTab(tab);
  };

  const data = {
    title: '나의 학습 현황',
    tabs: [
      {
        name: '학생',
        status: '학습 현황',
        sessions: [
          { session: '1회', date: '07-01 (월)' },
          { session: '2회', date: '07-08 (월)' },
          { session: '3회', date: '07-15 (월)' },
          { session: '4회', date: '07-22 (월)' },
          { session: '5회', date: '07-29 (월)' },
          { session: '6회', date: '08-05 (월)' },
          { session: '7회', date: '08-12 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
        ],
      },
    ],
    progress: {
      currentSession: '5회',
      student: '김동서',
      sessions: [
        { date: '09-03 (월)', isChecked: true, status: 'completed' },
        { date: '00-16 (월)', isChecked: true, status: 'completed' },
        { date: '09-18 (수)', isChecked: true, status: 'completed' },
        { date: '09-25 (수)', isChecked: true, status: 'completed' },
        { date: 'D+2', isWarning: true, status: 'completed' },
        { date: 'D-14', isFuture: true, status: 'upcoming' },
        { date: 'D-21', isFuture: true, status: 'upcoming' },
        { date: 'D-28', isFuture: true, status: 'upcoming' },
        { date: 'D-21', isFuture: true, status: 'upcoming' },
        { date: 'D-28', isFuture: true, status: 'upcoming' },
        { date: 'D-28', isFuture: true, status: 'upcoming' },
        { date: 'D-28', isFuture: true, status: 'upcoming' },
        { date: 'D-28', isFuture: true, status: 'feature' },
        { date: 'D-28', isFuture: true, status: 'feature' },
        { date: 'D-28', isFuture: true, status: 'feature' },
        { date: 'D-28', isFuture: true, status: 'feature' },
        { date: 'D-28', isFuture: true, status: 'feature' },
        { date: 'D-28', isFuture: true, status: 'feature' },
      ],
    },
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
        <div className="tw-h-[280px] tw-relative tw-overflow-hidden tw-rounded-[8.75px] tw-bg-white border border-[#e9ecf2]">
          <img
            src="/assets/images/quiz/rectangle_183.png"
            className="tw-w-[280px] tw-h-[280px]  tw-left-0 tw-top-[-0.01px] tw-object-cover"
          />
          <p className="tw-absolute tw-left-[305.38px] tw-top-[65.63px] tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black">
            임베디드 시스템
          </p>
          <p className="tw-absolute tw-left-[440.13px] tw-top-[69.13px] tw-text-[12.25px] tw-text-left tw-text-black">
            [전공선택] 3학년 화요일 A반{' '}
          </p>
          <p className="tw-absolute tw-left-[305.38px] tw-top-[118.13px] tw-text-sm tw-text-left tw-text-black">
            <span className="tw-text-sm tw-text-left tw-text-black">학습 주기 : 매주 화요일 (총 12회)</span>
            <br />
            <span className="tw-text-sm tw-text-left tw-text-black">
              학습 기간 : 12주 (2024. 09. 03 ~ 2024. 11. 03)
            </span>
            <br />
            <span className="tw-text-sm tw-text-left tw-text-black">참여 인원 : 24명</span>
          </p>
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-[305.38px] tw-top-[24.5px] tw-gap-[7px]">
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] tw-bg-[#d7ecff]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-text-left tw-text-[#235a8d]">
                소프트웨어융합대학
              </p>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] tw-bg-[#e4e4e4]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-text-left tw-text-[#313b49]">
                컴퓨터공학과
              </p>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] tw-bg-[#ffdede]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-text-left tw-text-[#b83333]">3학년</p>
            </div>
          </div>
          <svg
            width={28}
            height={28}
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="tw-w-7 tw-h-7 tw-absolute tw-left-[95%] tw-top-[21px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M25.6663 10.7807L17.278 10.0573L13.9997 2.33398L10.7213 10.069L2.33301 10.7807L8.70301 16.299L6.78967 24.5007L13.9997 20.149L21.2097 24.5007L19.308 16.299L25.6663 10.7807ZM13.9997 17.9673L9.61301 20.6157L10.7797 15.6223L6.90634 12.2623L12.0163 11.819L13.9997 7.11732L15.9947 11.8307L21.1047 12.274L17.2313 15.634L18.398 20.6273L13.9997 17.9673Z"
              fill="#CED4DE"
            />
          </svg>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[305.38px] tw-top-[231px] tw-gap-[7px]">
            <img className="tw-flex-grow-0 tw-flex-shrink-0" src="/assets/images/quiz/ellipse_209_2.png" />
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">양황규 교수</p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[90%] tw-top-[220.5px] tw-overflow-hidden tw-gap-[7px] tw-px-[24.5px] tw-py-[10.0625px] tw-rounded-[3.5px] tw-bg-[#e11837]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-font-bold tw-text-center tw-text-white">
              참여하기
            </p>
          </div>
        </div>

        <div className=" tw-h-12 border-left tw-relative tw-flex tw-items-center tw-mt-14 border-bottom">
          {/* Tab 1: My Quiz */}
          <div
            className={`tw-w-[164px] tw-h-12 tw-relative tw-cursor-pointer ${
              activeTab === 'myQuiz' ? 'border-b-0' : ''
            }`}
            onClick={() => handleTabClick('myQuiz')}
          >
            <div
              className={`tw-w-[164px] border-left tw-h-12 tw-absolute tw-left-[-1px] tw-top-[-1px] tw-rounded-tl-lg tw-rounded-tr-lg ${
                activeTab === 'myQuiz' ? 'tw-bg-white' : 'tw-bg-[#f6f7fb]'
              } border-top border-right`}
            />
            <p
              className={`tw-absolute tw-left-[52px] tw-top-3 tw-text-base tw-text-center ${
                activeTab === 'myQuiz' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              마이퀴즈
            </p>
          </div>
          {/* Divider Line */}
          {/* Tab 2: Community */}
          <div
            className={`tw-w-[164px] tw-h-12 tw-relative tw-ml-2.5 tw-cursor-pointer ${
              activeTab === 'community' ? 'border-b-0' : ''
            }`}
            onClick={() => handleTabClick('community')}
          >
            <div
              className={`tw-w-[164px] tw-h-12 tw-absolute tw-left-[-1px] tw-top-[-1px] tw-rounded-tl-lg tw-rounded-tr-lg ${
                activeTab === 'community' ? 'tw-bg-white' : 'tw-bg-[#f6f7fb]'
              } border-right border-top border-left`}
            />
            <p
              className={`tw-absolute tw-left-[52px] tw-top-3 tw-text-base tw-text-center ${
                activeTab === 'community' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              커뮤니티
            </p>
          </div>
        </div>
        {/* Content Section */}
        {activeTab === 'myQuiz' && (
          <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg tw-py-4 tw-overflow-hidden">
            <p className="tw-text-xl tw-font-bold tw-text-black tw-py-4">{data.title}</p>
            <div className="tw-overflow-auto tw-rounded-lg">
              <div className="">
                <div className="tw-flex tw-flex-row">
                  {/* 새로운 div 추가 */}
                  <div className="tw-flex justify-center ">
                    <p className="tw-text-base tw-font-medium tw-text-[#31343d] tw-w-24 tw-text-center">
                      {data.tabs[0].name}
                      <div className="tw-py-2">
                        <Avatar className="tw-mx-auto" sx={{ width: 32, height: 32 }}></Avatar>
                        <div className="tw-text-sm tw-py-2">김동서</div>
                      </div>
                    </p>
                    <p className="tw-text-base tw-font-medium tw-text-[#31343d] tw-w-24 tw-text-center">
                      {data.tabs[0].status}
                      <div className="tw-py-2">
                        <div className="progress tw-rounded tw-h-2 tw-p-0">
                          <span style={{ width: `70%` }}>
                            <span className="progress-line"></span>
                          </span>
                        </div>
                      </div>
                    </p>
                  </div>

                  <div className="tw-ml-10 tw-grid tw-grid-cols-9 tw-gap-4" style={{ width: '100%' }}>
                    {data.tabs[0].sessions.map((session, idx) => (
                      <div key={idx} className="tw-items-center tw-flex-shrink-0 border tw-rounded-lg">
                        <div className=" border-bottom tw-pb-3 tw-px-0 tw-pt-0 tw-bg-[#f6f7fb] tw-rounded-t-lg">
                          <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d] tw-pt-1">
                            {session.session}
                          </p>
                          <p className="tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2] tw-pt-1">
                            {session.date}
                          </p>
                        </div>
                        <div className="tw-pt-3 tw-pb-2">
                          {
                            <div className="tw-flex tw-justify-center">
                              <circle cx={10} cy={10} r={10} fill="#31343D" />
                              {data.progress.sessions[idx].status === 'completed' ? (
                                <svg
                                  width={20}
                                  height={20}
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="tw-w-5 tw-h-5"
                                  preserveAspectRatio="none"
                                >
                                  <circle cx={10} cy={10} r={10} fill="#31343D" />
                                  <path d="M6 9L9.60494 13L14 7" stroke="white" strokeWidth="1.5" />
                                </svg>
                              ) : data.progress.sessions[idx].status === 'upcoming' ? (
                                <div className="tw-w-5 tw-h-5 tw-relative ">
                                  <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute left-[-1px] top-[-1px]"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <circle cx={10} cy={10} r="9.5" fill="white" stroke="#E11837" />
                                  </svg>
                                  <p className="tw-absolute tw-left-[7px] tw-top-[3.5px] tw-text-xs tw-font-medium tw-text-center tw-text-[#e11837]">
                                    ?
                                  </p>
                                </div>
                              ) : data.progress.sessions[idx].status === 'feature' ? (
                                <div className="tw-w-5 tw-h-5">
                                  <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <circle cx={10} cy={10} r="9.5" fill="#F6F7FB" stroke="#E0E4EB" />
                                  </svg>
                                  <p className="tw-text-xs tw-font-medium tw-text-center tw-text-white">-</p>
                                </div>
                              ) : null}
                            </div>
                          }
                        </div>
                        <p
                          className={`tw-text-xs tw-font-medium tw-text-center tw-pb-2 ${
                            data.progress.sessions[idx].isWarning ? 'tw-text-[#e11837]' : 'tw-text-[#9ca5b2]'
                          }`}
                        >
                          {data.progress.sessions[idx].date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={cx('content-wrap')}>
              <div className={cx('container', 'tw-mt-10')}>
                <Grid container direction="row" alignItems="center" rowSpacing={0}>
                  <Grid
                    container
                    justifyContent="flex-start"
                    xs={6}
                    sm={10}
                    className="tw-text-xl tw-text-black tw-font-bold"
                  >
                    퀴즈목록 {totalElements}
                  </Grid>
                  <Grid container justifyContent="flex-end" xs={6} sm={2} style={{ textAlign: 'right' }}>
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
                {quizList.map((item, index) => {
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
                        {item?.isRepresentative ? <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}></Grid> : <></>}
                        <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}>
                          <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">Q{index + 1}.</div>
                          <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                            {item?.weekNumber}주차 ({item?.dayOfWeek})
                          </div>
                          <div className="tw-flex-auto tw-mt-10 tw-text-center tw-text-sm tw-text-[#f44] tw-font-bold">
                            D-2
                          </div>
                        </Grid>

                        <Grid item xs={12} sm={item?.isRepresentative ? 10 : 11}>
                          {item?.isPublished ? (
                            <div className="tw-rounded-xl">
                              <div
                                className={`tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1   ${
                                  item?.answer ? 'tw-rounded-tl-xl tw-rounded-tr-xl' : 'tw-rounded-xl'
                                }`}
                              >
                                <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                  <img className="tw-w-10 tw-h-10 " src="/assets/images/quiz/ellipse_209.png" />
                                  <div className="tw-text-xs tw-text-left tw-text-black">양황규 교수님</div>
                                </div>
                                {item?.isRepresentative === true && (
                                  <div className="tw-p-3">
                                    <button
                                      type="button"
                                      data-tooltip-target="tooltip-default"
                                      className="border tw-w-0.5/12 tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-bold tw-px-3 tw-py-1 tw-rounded"
                                    >
                                      대표
                                    </button>
                                  </div>
                                )}
                                <div className="tw-flex-auto tw-px-5 tw-w-3/12">
                                  <div className="tw-font-medium tw-text-black">{item?.content}</div>
                                </div>
                                {item?.answer?.answerStatus === '0001' ? (
                                  <div className="">
                                    <button
                                      type="button"
                                      onClick={() => router.push('/quiz/solution/' + `${item?.clubQuizSequence}`)}
                                      data-tooltip-target="tooltip-default"
                                      className="max-lg:tw-w-[60px]  tw-bg-gray-300 tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                    >
                                      1차답변 입력완료
                                    </button>
                                  </div>
                                ) : item?.answer?.answerStatus === '0002' ? (
                                  <div className="">
                                    <button
                                      type="button"
                                      onClick={() => router.push('/quiz/solution/' + `${item?.clubQuizSequence}`)}
                                      data-tooltip-target="tooltip-default"
                                      className="max-lg:tw-w-[60px] tw-bg-gray-300 tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                    >
                                      이해도 입력완료
                                    </button>
                                  </div>
                                ) : (
                                  <div className="">
                                    <button
                                      // onClick={() => router.push('/quiz/round-answers/' + `${item?.clubQuizSequence}`)}
                                      onClick={() => router.push('/quiz/answers/' + `${item?.clubQuizSequence}`)}
                                      type="button"
                                      data-tooltip-target="tooltip-default"
                                      className="tw-mr-3 about-content-rightmax-lg:tw-w-[60px] tw-bg-black tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                    >
                                      아티클 보기
                                    </button>
                                    <button
                                      onClick={() => router.push('/quiz/answers/' + `${item?.clubQuizSequence}`)}
                                      type="button"
                                      data-tooltip-target="tooltip-default"
                                      className="max-lg:tw-w-[60px] border border-danger tw-text-black tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                    >
                                      전체 답변보기 {'>'}
                                    </button>
                                  </div>
                                )}
                              </div>
                              {item?.answer?.text ? (
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
                                        stroke-width={2}
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                    <img
                                      className="border tw-rounded-full tw-w-10 tw-h-10 "
                                      src="/assets/images/quiz/아그리파_1.png"
                                    />
                                    <div className="tw-text-xs tw-text-left tw-text-black">김동서</div>
                                  </div>
                                  <div className="tw-flex-auto tw-w-9/12 tw-px-5">
                                    <div className="tw-font-medium tw-text-[#9ca5b2] tw-text-sm tw-line-clamp-2">
                                      {item?.answer?.text} Docker는 쿠버네티스가 오케스트레이션하는 컨테이너 런타임으로
                                      사용할 수 있습니다. 쿠버네티스가 노드에 대해 포드를 예약하면 해당 노드의
                                      kubelet(각 컨테이너의 실행을 보장하는 서비스)이 지정된 컨테이너를 실행하도록
                                      Docker에 명령...
                                    </div>
                                  </div>
                                  <div className="tw-flex-auto">
                                    <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-right tw-text-[#9ca5b2]">
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
                                        <path d="M1 1L5 5L1 9" stroke="#9CA5B2" stroke-width="1.5" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
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
                                        stroke-width={2}
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                    <img
                                      className="border tw-rounded-full tw-w-10 tw-h-10 "
                                      src="/assets/images/quiz/아그리파_1.png"
                                    />
                                    <div className="tw-text-xs tw-text-left tw-text-black">김동서</div>
                                  </div>
                                  <div className="tw-flex-auto tw-w-1.5/12">
                                    <div className="tw-font-medium tw-text-gray-500 tw-text-sm tw-line-clamp-2">
                                      {item?.answer?.answerStatus === '0000' ? (
                                        <div className="tw-text-center">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              router.push('/quiz/solution/' + `${item?.clubQuizSequence}`);
                                            }}
                                            data-tooltip-target="tooltip-default"
                                            className=" max-lg:tw-w-[60px] tw-px-[30.5px] tw-py-[9.5px] tw-rounded tw-bg-[#E11837] tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                          >
                                            퀴즈 풀러가기
                                          </button>
                                        </div>
                                      ) : item?.answer?.answerStatus === '0001' ? (
                                        <div className="">
                                          <button
                                            type="button"
                                            onClick={() => router.push('/quiz/solution/' + `${item?.clubQuizSequence}`)}
                                            data-tooltip-target="tooltip-default"
                                            className="max-lg:tw-w-[60px]  tw-bg-gray-300 tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                          >
                                            1차답변 입력완료
                                          </button>
                                        </div>
                                      ) : item?.answer?.answerStatus === '0002' ? (
                                        <div className="">
                                          <button
                                            type="button"
                                            onClick={() => router.push('/quiz/solution/' + `${item?.clubQuizSequence}`)}
                                            data-tooltip-target="tooltip-default"
                                            className="max-lg:tw-w-[60px] tw-bg-gray-300 tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                          >
                                            이해도 입력완료
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="">
                                          <button
                                            // onClick={() => router.push('/quiz/round-answers/' + `${item?.clubQuizSequence}`)}
                                            onClick={() => router.push('/quiz/answers/' + `${item?.clubQuizSequence}`)}
                                            type="button"
                                            data-tooltip-target="tooltip-default"
                                            className="max-lg:tw-w-[60px] tw-bg-[#FF8D8D] tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                          >
                                            전체 답변보기 {'>'}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="border tw-rounded-xl p-4">
                              {item?.isRepresentative === true && (
                                <button
                                  type="button"
                                  data-tooltip-target="tooltip-default"
                                  className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-bold tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                                >
                                  대표
                                </button>
                              )}
                              {item?.publishDate} 질문공개
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'community' && (
          <>
            <div className="tw-mt-5 tw-h-[52px] tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb]">
              <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-5 tw-top-[13px] tw-gap-4">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded tw-bg-[#e11837]">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-text-left tw-text-white">
                    공지
                  </p>
                </div>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">
                  공지사항입니다. 학생들은 꼭 읽어주세요! 퀴즈 진행할 때 해당내용 참고하여 진행바랍니다.
                </p>
              </div>
              <div className="tw-flex tw-justify-end tw-items-center tw-absolute tw-left-[870px] tw-top-3 tw-gap-5">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-right tw-text-[#9ca5b2]">
                  24.06.12ㅣ18:00:00
                </p>
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                  <img className="tw-flex-grow-0 tw-flex-shrink-0" src="/assets/images/quiz/ellipse_209_2.png" />
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-black">양황규 교수</p>
                </div>
              </div>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                정렬 :
              </p>

              <RadioGroup className="tw-py-5" value={selectedOption} onChange={handleChangeQuiz} row>
                <FormControlLabel
                  value="latest"
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
                      최신순
                    </p>
                  }
                />
                <FormControlLabel
                  value="oldest"
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
                      좋아요순
                    </p>
                  }
                />
              </RadioGroup>
            </div>
            <div className="border border-secondary tw-px-10 tw-py-5 tw-rounded-xl">
              <div>
                {/* reply */}
                {answerContents.length === 0 ? (
                  <div className="tw-text-center  tw-w-full border tw-rounded-md tw-my-10">
                    <div className="tw-p-10  tw-mb-5">
                      <div className="tw-p-10">데이터가 없습니다.</div>
                    </div>
                  </div>
                ) : (
                  answerContents.map((item, index) => {
                    return (
                      <CommunityCard
                        key={index}
                        board={item}
                        // writer={memberSample}
                        className={cx('reply-container__item')}
                        beforeOnePick={beforeOnePick}
                        setBeforeOnePick={setBeforeOnePick}
                        // memberId={memberId}
                        // onPostDeleteSubmit={onPostDeleteSubmit}
                      />
                    );
                  })
                )}

                <div className="tw-flex tw-justify-start tw-items-center tw-gap-3">
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow tw-flex-shrink tw-relative tw-gap-2">
                    <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-10 tw-h-10">
                      <div className="tw-absolute tw-left-[-0.5px] tw-top-[-0.5px]" />
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 relative"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M6 6V12C6 12.7956 6.31607 13.5587 6.87868 14.1213C7.44129 14.6839 8.20435 15 9 15H19M19 15L15 11M19 15L15 19"
                          stroke="#31343D"
                          stroke-width={2}
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <p class="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-center tw-text-[#313b49]">
                      <div class="tw-w-10 tw-h-[42.62px] tw-flex tw-justify-center tw-items-center">
                        <img
                          src="/assets/images/quiz/아그리파_1.png"
                          class="tw-w-[26.44px] tw-h-[38.31px] tw-object-cover"
                        />
                      </div>
                    </p>
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-left tw-text-[#313b49]">
                      김동서
                    </p>
                    <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-gap-2">
                      <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#d7ecff]">
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#235a8d]">
                          소프트웨어융합대학
                        </p>
                      </div>
                      <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#e4e4e4]">
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#313b49]">
                          컴퓨터공학과
                        </p>
                      </div>
                      <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#ffdede]">
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#b83333]">
                          2학년
                        </p>
                      </div>
                      <p className="tw-text-xs tw-text-left tw-text-[#9ca5b2] tw-ml-auto">24.06.12ㅣ18:00:00</p>
                    </div>
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-relative tw-gap-2 tw-left-24 tw-py-2">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[964px] tw-text-sm tw-text-left tw-text-[#313b49]">
                    Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.
                  </p>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10px] tw-text-left tw-text-[#9ca5b2]">
                    답글쓰기
                  </p>
                </div>
                {/* comment */}
                <div className="tw-grid tw-grid-cols-10 tw-items-center tw-gap-3 tw-py-5">
                  <div className="tw-col-span-9">
                    <div className="tw-form-floating tw-w-full tw-pt-1">
                      <textarea
                        className="tw-form-control tw-w-full"
                        placeholder="Leave a comment here"
                        id="floatingTextarea"
                        style={{ height: '60px', resize: 'none', padding: 10 }}
                      ></textarea>
                    </div>
                  </div>
                  <div className="tw-col-span-1">
                    <button className=" tw-py-[20px] tw-w-full tw-h-full tw-rounded tw-bg-white border border-secondary tw-border-[#e9ecf2] tw-text-sm tw-text-center tw-text-[#6a7380]">
                      댓글달기
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-grid tw-grid-cols-10 tw-items-center tw-gap-3 tw-py-5">
              <div className="tw-col-span-9">
                <div className="tw-form-floating tw-w-full tw-pt-1">
                  <textarea
                    className="tw-form-control tw-w-full"
                    placeholder="Leave a comment here"
                    id="floatingTextarea"
                    style={{ height: '60px', resize: 'none', padding: 10 }}
                  ></textarea>
                </div>
              </div>
              <div className="tw-col-span-1">
                <button className="tw-bg-[#31343d] tw-py-[20px] tw-w-full tw-h-full tw-rounded border border-secondary tw-text-sm tw-text-center tw-text-white">
                  글쓰기
                </button>
              </div>
            </div>
            {/* pagenation */}
            {/* 검색 */}
            <div className="tw-flex tw-items-center tw-justify-center tw-text-center tw-py-5">
              <div className="tw-flex tw-items-center tw-justify-center tw-w-full  tw-gap-3">
                <TextField
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  InputProps={{
                    style: { height: '43px', width: '300px' },
                    startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                  }}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      // Add your submit function here
                    }
                  }}
                />
                <button className="tw-w-[100px] tw-bg-[#E9ECF2] tw-py-[12px] tw-px-14 tw-px-4 tw-h-full tw-rounded tw-border tw-border-secondary tw-text-sm">
                  검색
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizClubDetaillSolution;
