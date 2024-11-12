'use client';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import { useRef } from 'react';

import {
  paramProps,
  useMyLectureList,
  useMyLectureDashboardList,
  useMyLectureDashboardChatList,
  useMyDashboardLecture,
  useMyDashboardQA,
  useMyDashboardStudentQA,
} from 'src/services/seminars/seminars.queries';
import { useSaveAnswer, useDeleteQuestion, useChatQuery } from 'src/services/seminars/seminars.mutations';
import Grid from '@mui/material/Grid';
import { useMyAllLectureInfo } from 'src/services/quiz/quiz.queries';
import Paginations from 'src/stories/components/Pagination';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';

/**import quiz modal  */
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import SettingsIcon from '@mui/icons-material/Settings';

import { useQuizFileDownload } from 'src/services/quiz/quiz.queries';
import router from 'next/router';
import { useSessionStore } from '../../../store/session';
import Markdown from 'react-markdown';

export interface LecturePlayGroundTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

const cx = classNames.bind(styles);

export function LecturePlayGroundTemplate({ id }: LecturePlayGroundTemplateProps) {
  const { roles } = useSessionStore.getState();
  const [page, setPage] = useState(1);
  const [pageStudent, setPageStudent] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalStudentPage, setTotalStudentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [myClubList, setMyClubList] = useState<any>([]);
  const [myDashboardList, setMyDashboardList] = useState<any>([]);
  const [myDashboardChatList, setMyDashboardChatList] = useState<any>([]);
  const [selectedClub, setSelectedClub] = useState(null);

  const [myClubParams, setMyClubParams] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    data: { sortType: 'NAME', page: 1 },
  });

  const [answer, setAnswer] = useState('');
  const { mutate: onSaveAnswer, isSuccess, isError } = useSaveAnswer();
  const { mutate: onDeleteQuestion, isSuccess: isDeleteSuccess } = useDeleteQuestion();
  const { mutate: onChatQuery, isSuccess: isChatSuccess, data: chatData, isError: isChatError } = useChatQuery();

  useEffect(() => {
    if (isChatError) {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: messages.length + 1, sender: 'bot', text: '오류가 발생했습니다.' },
      ]);
      setIsLoading(false);
    }
  }, [isChatError]);

  useEffect(() => {
    if (chatData) {
      setMessages(prevMessages => [...prevMessages, { id: messages.length + 1, sender: 'bot', text: chatData.answer }]);
      setMessages(prevMessages => [
        ...prevMessages,
        { id: messages.length + 2, sender: 'bot', text: '감사합니다! 더 도와드릴 내용이 있으신가요?' },
      ]);
      setIsLoading(false);
    }
  }, [chatData]);

  const [myClubSequenceParams, setMyClubSequenceParams] = useState<any>({ clubSequence: id });
  const [selectedValue, setSelectedValue] = useState(null);
  const [key, setKey] = useState('');
  const [fileName, setFileName] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [quizList, setQuizList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [myClubSubTitleParams, setMyClubSubTitleParams] = useState<any>({
    clubSequence: id,
    page,
    clubType: '0200',
    size: 100,
  });

  // 퀴즈클럽 리스트
  const { isFetched: isContentFetched, refetch: refetchMyClub } = useMyLectureList(myClubSubTitleParams, data => {
    console.log(data?.data?.contents);
    setMyClubList(data?.data?.contents || []);
  });

  // 강의클럽 대시 보드 요약 조회
  const { isFetched: isDashboardFetched, refetch: refetchMyDashboard } = useMyLectureDashboardList(
    myClubSequenceParams,
    data => {
      console.log('useMyLectureDashboardList', data);
      console.log('useMyLectureDashboardList', data?.clubStudySequence);
      setMyDashboardList(data || []);
    },
  );

  const { isFetched: isParticipantListFetched, data } = useMyAllLectureInfo(myClubParams, data => {
    console.log('first get data', data);
    setQuizList(data?.contents || []);
    setTotalPage(data?.totalPages);
    setTotalElements(data?.totalElements);
  });

  // 강의클럽 대시보드 학생 참여 현황
  const {
    isFetched: isDashboardChatFetched,
    isLoading: isDashboardChatLoading,
    refetch: refetchMyDashboardChat,
  } = useMyLectureDashboardChatList(myClubParams, data => {
    const formattedQuestions = data?.referenceQuestions?.map((question, index) => ({
      id: index + 1,
      sender: 'init',
      text: question,
    }));

    console.log('chatlist', data, formattedQuestions);
    setMyDashboardChatList(formattedQuestions);
    setTotalStudentPage(data?.students?.totalPages);
  });

  /** my quiz replies */

  const [sortType, setSortType] = useState('NAME');
  const [sortLectureType, setSortLectureType] = useState('STUDY_ORDER_ASC');

  useDidMountEffect(() => {
    setMyClubParams({
      clubSequence: selectedClub?.clubSequence || id,
      data: { sortType: sortType, page: pageStudent },
    });
  }, [pageStudent]);

  const handleQuizChange = event => {
    const selectedValue = event.target.value === '' ? null : event.target.value;
    setSelectedValue(selectedValue);
    setMessages([]);
  };

  // Ref to the inner scrollable container
  const innerScrollRef = useRef(null);

  // Function to scroll to the bottom of the inner container
  const scrollToBottom = () => {
    if (innerScrollRef.current) {
      innerScrollRef.current.scrollTop = innerScrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Run when combinedMessages changes

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      if (input === '') return;

      console.log('1', id, selectedValue);

      scrollToBottom(); // Scroll the inner container to the bottom
      setInput(''); // Clear input field after sending the message
      setIsLoading(true);
      setMessages(prevMessages => [...prevMessages, { id: messages.length + 1, sender: 'user', text: input }]);
      onChatQuery({
        clubSequence: id,
        clubStudySequence: selectedValue || null,
        query: input,
      }); // 검색 함수 실행
      e.preventDefault(); // 엔터 시 기본 동작 방지
    }
  };

  const handleInitMessageClick = (text: string) => {
    if (text === '') return;
    console.log('2', id, selectedValue);

    scrollToBottom(); // Scroll the inner container to the bottom
    setIsLoading(true);
    setMessages(prevMessages => [...prevMessages, { id: messages.length + 1, sender: 'user', text: text }]);
    onChatQuery({
      clubSequence: id,
      clubStudySequence: selectedValue || null,
      query: text,
    }); // 검색 함수 실행
  };

  const handleSendMessage = () => {
    if (input === '') return;
    console.log('3', id, selectedValue);
    scrollToBottom(); // Scroll the inner container to the bottom
    setMessages(prevMessages => [...prevMessages, { id: messages.length + 1, sender: 'user', text: input }]);
    setIsLoading(true);
    onChatQuery({
      clubSequence: id,
      clubStudySequence: selectedValue || null,
      query: input,
    }); // 검색 함수 실행
  };

  const { isFetched: isParticipantListFetcheds, isSuccess: isParticipantListSuccess } = useQuizFileDownload(
    key,
    data => {
      console.log('file download', data, fileName);
      if (data) {
        // blob 데이터를 파일로 저장하는 로직
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
    },
  );

  // 새 메시지가 추가될 때마다 스크롤 하단으로 이동
  const getMessageStyle = (sender: 'user' | 'bot' | 'init') => {
    if (sender === 'user') {
      return 'tw-bg-[#D7ECFF] tw-text-black';
    } else if (sender === 'bot') {
      return 'tw-bg-[#ECECEC] tw-text-black';
    } else {
      return 'tw-bg-[#fff] tw-text-black border';
    }
  };

  const getMessageAlignment = (sender: 'user' | 'bot' | 'init') => {
    if (sender === 'user') {
      return 'tw-justify-end';
    } else if (sender === 'bot') {
      return 'tw-justify-start';
    } else {
      return 'tw-justify-end '; // init 메시지를 중앙 정렬로
    }
  };

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <div className="tw-pt-8">
          <div className="tw-flex tw-justify-start tw-items-start tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              My강의클럽
            </div>

            {isClient && (
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
            )}
            <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              플레이그라운드
            </div>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              플레이그라운드
            </div>
          </div>
          <Divider className="tw-py-2 tw-bg-['#efefef']" />
        </div>
        <Mobile>
          <div className="tw-pt-[60px]">
            <div className="tw-text-[24px] tw-font-bold tw-text-black tw-text-center">
              퀴즈클럽 {'-'} 내가 만든 클럽
            </div>
            <div className="tw-text-[12px] tw-text-black tw-text-center tw-mb-10">
              내가 만든 클럽 페이지에 관한 간단한 설명란
            </div>
          </div>
        </Mobile>
        <div className="tw-flex tw-items-center tw-mt-6">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={11} className="tw-font-bold tw-text-xl">
              <select
                className="tw-h-14 form-select block w-full tw-font-bold tw-px-4"
                onChange={handleQuizChange}
                value={selectedValue}
                aria-label="Default select example"
              >
                {isContentFetched && (
                  <>
                    <option
                      className="tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer"
                      value={''}
                    >
                      전체 회차
                    </option>
                    {quizList?.map((session, idx) => (
                      <option
                        key={idx}
                        className="tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer"
                        value={session?.clubStudySequence}
                      >
                        회차 {session?.studyOrder}주차 : {session?.clubStudyName}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </Grid>

            <Grid item xs={1} justifyContent="flex-end" className="tw-flex">
              <div className="">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="tw-h-14  tw-text-black tw-bg-[#CED4DE] border tw-font-medium tw-rounded-md tw-text-sm tw-px-6 tw-py-2 "
                >
                  <SettingsIcon className="tw-bg-[#CED4DE] tw-text-white" />
                </button>
              </div>
            </Grid>
          </Grid>
        </div>
        <div className="tw-grid tw-grid-cols-10 tw-mt-5">
          <div className="tw-col-span-4  border-right">
            <div className="tw-flex tw-justify-start tw-items-center tw-h-14 tw-px-8 tw-py-5 tw-rounded-tl-lg tw-bg-[#f6f7fb] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-font-semibold tw-text-left tw-text-[#1f2633]">
                  질의응답 활용 강의자료
                </div>
                <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2.5 tw-py-px tw-rounded-sm tw-bg-[#e7eaf1]">
                  <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#1f2633]">
                    3
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-bg-[#fcfcff]">
              <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-overflow-hidden tw-gap-3 tw-px-8 tw-py-4">
                <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow tw-gap-1">
                  <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-w-6 tw-h-6 tw-relative tw-gap-2.5">
                    {isClient && (
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path
                          d="M5.25642 17.9163C4.83547 17.9163 4.47917 17.7705 4.1875 17.4788C3.89583 17.1871 3.75 16.8308 3.75 16.4099V3.58943C3.75 3.16848 3.89583 2.81217 4.1875 2.52051C4.47917 2.22884 4.83547 2.08301 5.25642 2.08301H11.875L16.25 6.45797V16.4099C16.25 16.8308 16.1041 17.1871 15.8125 17.4788C15.5208 17.7705 15.1645 17.9163 14.7435 17.9163H5.25642ZM11.25 7.08297V3.33299H5.25642C5.19231 3.33299 5.13353 3.3597 5.0801 3.41311C5.02669 3.46654 4.99998 3.52531 4.99998 3.58943V16.4099C4.99998 16.474 5.02669 16.5328 5.0801 16.5862C5.13353 16.6396 5.19231 16.6663 5.25642 16.6663H14.7435C14.8077 16.6663 14.8664 16.6396 14.9199 16.5862C14.9733 16.5328 15 16.474 15 16.4099V7.08297H11.25Z"
                          fill="#313B49"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-flex-grow tw-gap-2">
                    <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0">
                      <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                        <div className="tw-flex-grow w-[338px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                          프로그래밍과 하드웨어의 관계
                        </div>
                      </div>
                      <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                        <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[13px] tw-text-left tw-text-[#9ca5b2]">
                          PDF
                        </div>
                        {isClient && (
                          <svg
                            width={1}
                            height={6}
                            viewBox="0 0 1 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-grow-0 flex-shrink-0"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <line x1="0.5" y1="0.5" x2="0.5" y2="5.5" stroke="#9CA5B2" />
                          </svg>
                        )}
                        <div className="tw-container tw-flex-grow-0 tw-flex-shrink-0 tw-text-[13px] tw-text-left tw-text-[#9ca5b2]">
                          5mb
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-overflow-hidden tw-gap-3 tw-px-8 tw-py-4">
                <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow tw-gap-1">
                  <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-w-6 tw-h-6 tw-relative tw-gap-2.5">
                    {isClient && (
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path
                          d="M5.25642 17.9163C4.83547 17.9163 4.47917 17.7705 4.1875 17.4788C3.89583 17.1871 3.75 16.8308 3.75 16.4099V3.58943C3.75 3.16848 3.89583 2.81217 4.1875 2.52051C4.47917 2.22884 4.83547 2.08301 5.25642 2.08301H11.875L16.25 6.45797V16.4099C16.25 16.8308 16.1041 17.1871 15.8125 17.4788C15.5208 17.7705 15.1645 17.9163 14.7435 17.9163H5.25642ZM11.25 7.08297V3.33299H5.25642C5.19231 3.33299 5.13353 3.3597 5.0801 3.41311C5.02669 3.46654 4.99998 3.52531 4.99998 3.58943V16.4099C4.99998 16.474 5.02669 16.5328 5.0801 16.5862C5.13353 16.6396 5.19231 16.6663 5.25642 16.6663H14.7435C14.8077 16.6663 14.8664 16.6396 14.9199 16.5862C14.9733 16.5328 15 16.474 15 16.4099V7.08297H11.25Z"
                          fill="#313B49"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-flex-grow tw-gap-2">
                    <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0">
                      <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                        <div className="tw-flex-grow w-[338px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                          프로그래밍과 하드웨어의 관계
                        </div>
                      </div>
                      <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                        <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[13px] tw-text-left tw-text-[#9ca5b2]">
                          PDF
                        </div>
                        {isClient && (
                          <svg
                            width={1}
                            height={6}
                            viewBox="0 0 1 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-grow-0 flex-shrink-0"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <line x1="0.5" y1="0.5" x2="0.5" y2="5.5" stroke="#9CA5B2" />
                          </svg>
                        )}
                        <div className="tw-container flex-grow-0 tw-flex-shrink-0 tw-text-[13px] tw-text-left tw-text-[#9ca5b2]">
                          5mb
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-h-14 tw-px-8 tw-py-5  tw-bg-[#f6f7fb] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-font-semibold tw-text-left tw-text-[#1f2633]">
                  질의응답 자료
                </div>
                <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2.5 tw-py-px tw-rounded-sm tw-bg-[#e7eaf1]">
                  <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#1f2633]">
                    3
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-flex tw-flex-col tw-justify-start tw-items-start ">
              <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[75px] tw-relative tw-gap-4 tw-pl-3 tw-pr-8 tw-py-3 tw-bg-[#fcfcff] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[33px] tw-text-base tw-font-medium tw-text-center tw-text-[#1f2633]">
                  1
                </div>
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-13 tw-text-base tw-font-medium tw-text-center tw-text-[#6a7380]">
                  황혜경
                </div>
                <div className="tw-flex-grow w-[277px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                  클라우드를 iot 플랫폼으로 생각할 수 있어? 아니면 둘이 또 다른 개념이야?
                </div>
              </div>
              <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[49px] tw-relative tw-gap-4 tw-pl-3 tw-pr-8 tw-py-3 tw-bg-[#fcfcff] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[33px] tw-text-base tw-font-medium tw-text-center tw-text-[#1f2633]">
                  2
                </div>
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-13 tw-text-base tw-font-medium tw-text-center tw-text-[#6a7380]">
                  권수빈
                </div>
                <div className="tw-flex-grow w-[277px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                  rvi가 5는 뭘 의미하는거야?
                </div>
              </div>
              <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[49px] tw-relative tw-gap-4 tw-pl-3 tw-pr-8 tw-py-3 tw-bg-[#fcfcff] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[33px] tw-text-base tw-font-medium tw-text-center tw-text-[#1f2633]">
                  3
                </div>
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-13 tw-text-base tw-font-medium tw-text-center tw-text-[#6a7380]">
                  김상우
                </div>
                <div className="tw-flex-grow w-[277px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                  お。日本語できますか？
                </div>
              </div>
              <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[49px] tw-relative tw-gap-4 tw-pl-3 tw-pr-8 tw-py-3 tw-bg-[#fcfcff] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[33px] tw-text-base tw-font-medium tw-text-center tw-text-[#1f2633]">
                  4
                </div>
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-13 tw-text-base tw-font-medium tw-text-center tw-text-[#6a7380]">
                  김백건
                </div>
                <div className="tw-flex-grow w-[277px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                  NFC에 대해 알려줘
                </div>
              </div>
              <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[75px] tw-relative tw-gap-4 tw-pl-3 tw-pr-8 tw-py-3 tw-bg-[#fcfcff] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[33px] tw-text-base tw-font-medium tw-text-center tw-text-[#1f2633]">
                  5
                </p>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-13 tw-text-base tw-font-medium tw-text-center tw-text-[#6a7380]">
                  권수빈
                </p>
                <p className="tw-flex-grow w-[277px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                  AE ID가 고유해야 하는 범위가 어디까지인거야? absolute라 하니까 정확히는 모르겠어
                </p>
              </div>
              <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[75px] tw-relative tw-gap-4 tw-pl-3 tw-pr-8 tw-py-3 tw-bg-[#fcfcff] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[33px] tw-text-base tw-font-medium tw-text-center tw-text-[#1f2633]">
                  6
                </p>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-13 tw-text-base tw-font-medium tw-text-center tw-text-[#6a7380]">
                  박제혁
                </p>
                <p className="tw-flex-grow w-[277px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                  아니 이 개 멍청한 새끼야 아까 말했던 거를 한국어로 하라고 =
                </p>
              </div>
              <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[75px] tw-relative tw-gap-4 tw-pl-3 tw-pr-8 tw-py-3 tw-bg-[#fcfcff] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[33px] tw-text-base tw-font-medium tw-text-center tw-text-[#1f2633]">
                  7
                </p>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-13 tw-text-base tw-font-medium tw-text-center tw-text-[#6a7380]">
                  오정현
                </p>
                <p className="tw-flex-grow w-[277px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                  보통 AE쪽에서 CSE쪽으로 요청하는거 아니야??
                </p>
              </div>
            </div>
          </div>
          <div className="tw-col-span-6 tw-flex tw-flex-col  ">
            <div className="tw-flex tw-justify-start tw-items-center tw-h-14 tw-px-8 tw-py-5 tw-rounded-tr-lg tw-bg-[#f6f7fb] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-font-semibold tw-text-left tw-text-[#1f2633]">
                  대화
                </div>
              </div>
            </div>

            <div className="tw-overflow-y-auto tw-p-10 tw-h-[580px]" ref={innerScrollRef}>
              <div>
                <img className="tw-w-[61px] tw-h-[56px]" src="/assets/images/main/_chatbot.png" />
                <div className="tw-w-[381px] tw-text-xl tw-text-left tw-text-[#313b49] tw-py-8 tw-font-bold">
                  <div className="tw-w-[381px] tw-text-lg tw-text-left tw-text-[#313b49]">안녕하세요!</div>
                  <div className="tw-w-[381px] tw-text-lg tw-text-left tw-text-[#313b49] tw-pt-1">
                    우리 수업의 AI 조교를 테스트하고,
                  </div>
                  <div className="tw-w-[381px] tw-text-lg tw-text-left tw-text-[#313b49] tw-pt-1">
                    질의 응답된 결과를 확인해보세요!
                  </div>
                </div>
              </div>
              {[...myDashboardChatList, ...messages].map((message, index) => {
                // '\n숫자' 패턴을 찾아 공백을 추가
                const messageText = message.text.replace(/\n(\d+)/g, '\n $1');
                console.log(messageText);

                return message.sender === 'init' ? (
                  <div
                    key={`${message.id}-${index}`}
                    onClick={() => handleInitMessageClick(messageText)}
                    className={`tw-cursor-pointer tw-text-sm tw-flex ${getMessageAlignment(message.sender)} tw-mb-4`}
                  >
                    <div className={`tw-p-3 tw-rounded-lg tw-max-w-xs ${getMessageStyle(message.sender)}`}>
                      <Markdown className="markdown-container tw-prose tw-pr-2 tw-break-words">{messageText}</Markdown>
                    </div>
                  </div>
                ) : (
                  <div
                    key={`${message.id}-${index}`}
                    className={`tw-text-sm tw-flex ${getMessageAlignment(message.sender)} tw-mb-4`}
                  >
                    <div className={`tw-p-3 tw-rounded-lg tw-max-w-xs ${getMessageStyle(message.sender)}`}>
                      <div className="flex-wrap flex-grow-0 flex-shrink-0 text-base text-left text-black">
                        <Markdown className="markdown-container tw-prose tw-pr-2 tw-break-words">
                          {messageText}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                  <svg width={0} height={0}>
                    <defs>
                      <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e01cd5" />
                        <stop offset="100%" stopColor="#1CB5E0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
                </div>
              )}
            </div>

            <div className="tw-flex tw-items-center tw-p-4 tw-border-t tw-bg-white">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="tw-flex-1 tw-h-12 tw-px-2 tw-border"
                placeholder="메시지를 입력하세요..."
                disabled={isLoading}
              />
              <button onClick={e => handleSendMessage()} disabled={isLoading} className=" tw-text-white tw-rounded-lg">
                {isClient && (
                  <svg
                    width={50}
                    height={50}
                    viewBox="0 0 52 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[45px] tw-h-[45px]"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 0H48C50.2091 0 52 1.79086 52 4V48C52 50.2091 50.2091 52 48 52H0V0Z" fill="#E0E4EB" />
                    <path
                      d="M35.944 24.6874L20.1471 15.8467C19.8839 15.6932 19.5808 15.6219 19.2768 15.642C18.9727 15.662 18.6816 15.7725 18.4409 15.9592C18.195 16.1532 18.0164 16.4198 17.9306 16.721C17.8448 17.0223 17.856 17.3429 17.9627 17.6374L20.5971 24.9967C20.6238 25.0701 20.6721 25.1336 20.7358 25.1788C20.7994 25.2241 20.8753 25.2488 20.9534 25.2499H27.7221C27.9167 25.2468 28.1053 25.3176 28.2497 25.4481C28.3941 25.5786 28.4836 25.759 28.5002 25.953C28.5066 26.0553 28.492 26.1579 28.4572 26.2544C28.4224 26.3509 28.3681 26.4392 28.2978 26.5139C28.2276 26.5886 28.1427 26.648 28.0485 26.6886C27.9543 26.7292 27.8528 26.7501 27.7502 26.7499H20.9534C20.8753 26.7509 20.7994 26.7756 20.7358 26.8209C20.6721 26.8661 20.6238 26.9296 20.5971 27.003L17.9627 34.3624C17.8837 34.5891 17.8599 34.8314 17.8933 35.0691C17.9266 35.3069 18.0163 35.5333 18.1547 35.7295C18.2931 35.9256 18.4763 36.086 18.6892 36.1971C18.902 36.3083 19.1383 36.3671 19.3784 36.3686C19.6338 36.3675 19.8851 36.303 20.1096 36.1811L35.944 27.3124C36.176 27.1806 36.3689 26.9897 36.5031 26.7592C36.6373 26.5286 36.708 26.2666 36.708 25.9999C36.708 25.7331 36.6373 25.4711 36.5031 25.2405C36.3689 25.01 36.176 24.8191 35.944 24.6874Z"
                      fill="white"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LecturePlayGroundTemplate;
