// QuizClubDetailInfo.jsx
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';

import Divider from '@mui/material/Divider';

const QuizClubDetaillSolution = ({ clubInfo, border, leaders, clubQuizzes, representativeQuizzes }) => {
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';

  const [activeTab, setActiveTab] = useState('myQuiz');

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

  const renderSessions = sessions => {
    return sessions.map((session, idx) => {
      const isCompleted = session.status === 'completed';
      const isUpcoming = session.status === 'upcoming';
      const hasWarning = session.isWarning || false;
      const isChecked = session.isChecked || false;

      return (
        <div key={idx} className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[48px] tw-relative tw-bg-white">
          {isCompleted ? (
            isChecked ? (
              <div className="tw-flex tw-justify-center">
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
              </div>
            ) : (
              <div className="tw-flex tw-justify-center">
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
              </div>
            )
          ) : isUpcoming ? (
            <div className="tw-flex tw-justify-center">
              <div className="tw-w-5 tw-h-5 ">
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
            </div>
          ) : null}
          <p
            className={`tw-w-[54px] tw-h-3.5 tw-text-xs tw-font-medium tw-text-center ${
              hasWarning ? 'tw-text-[#e11837]' : 'tw-text-[#9ca5b2]'
            }`}
          >
            {session.date}
          </p>
        </div>
      );
    });
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

                  <div className="tw-px-3 tw-grid tw-grid-cols-12 tw-gap-5 " style={{ width: '100%' }}>
                    {data.tabs[0].sessions.map((session, idx) => (
                      <div key={idx} className="tw-items-center tw-flex-shrink-0 ">
                        <div className=" border-bottom tw-pb-3 tw-px-0 tw-pt-0 ">
                          <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d]">
                            {session.session}
                          </p>
                          <p className="tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2]">{session.date}</p>
                        </div>
                        <div className="tw-py-3">
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
                          className={`tw-text-xs tw-font-medium tw-text-center ${
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
              {/* <div className="tw-mt-4 tw-w-[100%] tw-bg-white">
                <div className="tw-mt-4 tw-flex">
                  <div className="tw-flex tw-items-center">
                    <div className="tw-flex tw-items-center tw-w-20">
                      <svg
                        width={36}
                        height={36}
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="tw-mr-2"
                      >
                        <circle cx={18} cy={18} r={18} fill="#E9ECF2" />
                      </svg>
                      <div className="tw-text-xs tw-font-medium tw-text-black">{data.progress.student}</div>
                    </div>
                    <p className="tw-text-base tw-font-medium tw-text-[#31343d]  tw-w-20">
                      {data.progress.currentSession}
                    </p>
                  </div>

                  {renderSessions(data.progress.sessions)}
                </div>
              </div> */}
            </div>
          </div>
        )}
        {activeTab === 'community' && <div className="tw-p-4 tw-mt-4 tw-border tw-rounded tw-bg-gray-100"></div>}
      </div>
    </div>
  );
};

export default QuizClubDetaillSolution;
