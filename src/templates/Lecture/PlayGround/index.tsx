import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import { useRef } from 'react';
import {
  paramProps,
  useMyLectureList,
  useMyLectureDashboardList,
  useMyLectureDashboardStudentList,
  useMyDashboardLecture,
  useMyDashboardQA,
  useMyDashboardStudentQA,
} from 'src/services/seminars/seminars.queries';
import { useSaveAnswer, useDeleteQuestion } from 'src/services/seminars/seminars.mutations';
import Grid from '@mui/material/Grid';
import Paginations from 'src/stories/components/Pagination';

/**import quiz modal  */
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import SettingsIcon from '@mui/icons-material/Settings';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import Modal from 'src/stories/components/Modal';
import TextField from '@mui/material/TextField';

/** import pagenation */
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/material/styles';

//**download */
import { useQuizFileDownload } from 'src/services/quiz/quiz.queries';
import Markdown from 'react-markdown';
import router from 'next/router';
import { useSessionStore } from '../../../store/session';

export interface LecturePlayGroundTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

const cx = classNames.bind(styles);

export function LecturePlayGroundTemplate({ id }: LecturePlayGroundTemplateProps) {
  const { roles } = useSessionStore.getState();
  const [page, setPage] = useState(1);
  const [pageStudent, setPageStudent] = useState(1);
  const [lecturePage, setLecturePage] = useState(1);
  const [questionPage, setQuestionPage] = useState(1);
  const [studentQuestionPage, setStudentQuestionPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalStudentPage, setTotalStudentPage] = useState(1);
  const [totalQuestionPage, setTotalQuestionPage] = useState(1);
  const [totalStudentQuestionPage, setTotalStudentQuestionPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [myClubList, setMyClubList] = useState<any>([]);
  const [myDashboardList, setMyDashboardList] = useState<any>([]);
  const [myDashboardStudentList, setMyDashboardStudentList] = useState<any>([]);
  const [myDashboardLectureList, setMyDashboardLectureList] = useState<any>([]);
  const [myDashboardQA, setMyDashboardQA] = useState<any>([]);
  const [myDashboardStudentQA, setMyDashboardStudentQA] = useState<any>([]);
  const [clubStudySequence, setClubStudySequence] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [openInputIndex, setOpenInputIndex] = useState(null);

  const [myClubParams, setMyClubParams] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    data: { sortType: 'NAME', page: 1 },
  });
  const [myClubLectureParams, setMyClubLectureParams] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    data: { orderBy: 'STUDY_ORDER', lecturePage: 1, sortType: 'ASC' },
  });

  const [myClubLectureQA, setMyClubLectureQA] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    sequence: clubStudySequence,
    data: { questionPage: 1 },
  });

  const [myClubLectureStudentQA, setMyClubLectureStudentQA] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    memberUUID: '',
    data: { studentQuestionPage: 1 },
  });

  const [answer, setAnswer] = useState('');
  const { mutate: onSaveAnswer, isSuccess, isError } = useSaveAnswer();
  const { mutate: onDeleteQuestion, isSuccess: isDeleteSuccess } = useDeleteQuestion();

  const [myClubSequenceParams, setMyClubSequenceParams] = useState<any>({ clubSequence: id });
  const [params, setParams] = useState<paramProps>({ page });
  const [selectedValue, setSelectedValue] = useState(id);
  const [activeTab, setActiveTab] = useState('myQuiz');
  // const [activeTab, setActiveTab] = useState('community');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [key, setKey] = useState('');
  const [fileName, setFileName] = useState('');
  const [memberUUID, setMemberUUID] = useState('');

  const [myClubSubTitleParams, setMyClubSubTitleParams] = useState<any>({
    clubSequence: id,
    page,
    clubType: '0200',
    size: 100,
  });

  const handleChangeQuiz = event => {
    setSortType(event.target.value);
  };

  const handleChangeLecture = event => {
    setSortLectureType(event.target.value);
  };

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

  // 강의클럽 대시보드 학생 참여 현황
  const { isFetched: isDashboardStudentFetched, refetch: refetchMyDashboardStudent } = useMyLectureDashboardStudentList(
    myClubParams,
    data => {
      console.log('useMyLectureDashboardStudentList', data);
      setMyDashboardStudentList(data || []);
      setTotalStudentPage(data?.students?.totalPages);
    },
  );

  /** my quiz replies */

  const [sortType, setSortType] = useState('NAME');
  const [sortLectureType, setSortLectureType] = useState('STUDY_ORDER_ASC');

  useDidMountEffect(() => {
    setMyClubParams({
      clubSequence: selectedClub?.clubSequence || id,
      data: { sortType: sortType, page: 1, orderBy: sortType === 'NAME' ? 'ASC' : 'DESC' },
    });

    setMyClubSequenceParams({ clubSequence: selectedClub?.clubSequence || id });

    let dataParam = {};
    if (sortLectureType === 'STUDY_ORDER_ASC') {
      dataParam = { orderBy: 'STUDY_ORDER', page: lecturePage, sortType: 'DESC' };
    } else if (sortLectureType === 'STUDY_ORDER_DESC') {
      dataParam = { orderBy: 'STUDY_ORDER', page: lecturePage, sortType: 'ASC' };
    } else {
      dataParam = { orderBy: 'QUESTION_COUNT', page: lecturePage, sortType: 'DESC' };
    }

    setMyClubLectureParams({
      clubSequence: selectedClub?.clubSequence || id,
      data: dataParam,
    });
    setPageStudent(1);
  }, [sortType, selectedClub, sortLectureType, lecturePage]);

  useDidMountEffect(() => {
    setMyClubParams({
      clubSequence: selectedClub?.clubSequence || id,
      data: { sortType: sortType, page: pageStudent },
    });
  }, [pageStudent]);

  useDidMountEffect(() => {
    let dataParam = {};
    if (sortLectureType === 'STUDY_ORDER_ASC') {
      dataParam = { orderBy: 'STUDY_ORDER', page: page, sortType: 'ASC' };
    } else if (sortLectureType === 'STUDY_ORDER_DESC') {
      dataParam = { orderBy: 'STUDY_ORDER', page: page, sortType: 'DESC' };
    } else {
      dataParam = { orderBy: 'QUESTION_COUNT', page: page, sortType: 'DESC' };
    }

    setMyClubLectureParams({
      clubSequence: selectedClub?.clubSequence || id,
      data: dataParam,
    });
  }, [page]);

  useDidMountEffect(() => {
    console.log('questionPage', questionPage);
    setMyClubLectureQA({
      clubSequence: selectedClub?.clubSequence || id,
      sequence: clubStudySequence,
      data: { questionPage: questionPage },
    });
  }, [questionPage]);

  // 페이지가 변경될 때만 동작하도록 수정, memberUUID가 없으면 실행하지 않음
  useDidMountEffect(() => {
    if (memberUUID) {
      setMyClubLectureStudentQA({
        clubSequence: selectedClub?.clubSequence || id,
        sequence: clubStudySequence,
        memberUUID: memberUUID,
        data: { studentQuestionPage: studentQuestionPage },
      });
    } else {
      console.error('memberUUID is missing');
    }
  }, [studentQuestionPage, memberUUID]); // memberUUID가 없을 때 에러 방지

  useEffect(() => {
    if (memberUUID) {
      console.log('memberUUID', memberUUID);
      setMyClubLectureStudentQA({
        clubSequence: selectedClub?.clubSequence || id,
        memberUUID: memberUUID,
        data: { studentQuestionPage: 1 },
      });
    }
  }, [memberUUID]);

  const handleQuizChange = event => {
    const value = event.target.value;
    const selectedSession = myClubList?.find(session => {
      return session.clubSequence === Number(value);
    });

    console.log('value', value);
    setSelectedValue(value);
    setSelectedClub(selectedSession);
    console.log(selectedSession);
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

  const initialMessages = [
    { id: 1, sender: 'init', text: '강의 질문내용 요약해줘' },
    { id: 2, sender: 'init', text: '키워드/용어 관련 질문 요약해줘' },
    { id: 3, sender: 'init', text: '강의 공통질문 요약해줘' },
    { id: 4, sender: 'init', text: '강의 연관성이 높은 질문과 질문자 추출해줘' },
    {
      id: 5,
      sender: 'bot',
      text: '안녕하세요! ',
    },
    { id: 6, sender: 'user', text: '여기 예제를 준비했습니다. 아래 입력창을 통해 대화를 이어가세요!' },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // 새 메시지가 추가될 때마다 스크롤 하단으로 이동

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 새 메시지가 추가될 때마다 스크롤 하단으로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: input,
      };
      setMessages([...messages, newMessage]);
      setInput('');

      // 챗봇 응답 추가 (간단한 예제)
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: '감사합니다! 더 도와드릴 내용이 있으신가요?',
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }, 1000);
    }
  };

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
        {/* <Divider className="tw-y-5 tw-bg-['#efefef']" /> */}
        <div className="tw-pt-8">
          <div className="tw-flex tw-justify-start tw-items-start tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              My강의클럽
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
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              플레이그라운드
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              플레이그라운드
            </p>
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
                className="tw-h-14 form-select block w-full  tw-font-bold tw-px-4"
                onChange={handleQuizChange}
                value={selectedValue}
                aria-label="Default select example"
              >
                {isContentFetched &&
                  myClubList?.map((session, idx) => {
                    return (
                      <option
                        key={idx}
                        className="tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer"
                        value={session?.clubSequence}
                      >
                        회차 {session?.order}주차 : {session?.clubName}
                      </option>
                    );
                  })}
              </select>
            </Grid>

            <Grid item xs={1} justifyContent="flex-end" className="tw-flex">
              {/* {contents?.isBeforeOpening ? ( */}
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
        {true && (
          <div className="tw-grid tw-grid-cols-10 tw-mt-5">
            <div className="tw-col-span-4  border-right">
              {/* Left Column Content */}
              <div className="tw-flex tw-justify-start tw-items-center tw-h-14 tw-px-8 tw-py-5 tw-rounded-tl-lg tw-bg-[#f6f7fb] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-font-semibold tw-text-left tw-text-[#1f2633]">
                    질의응답 활용 강의자료
                  </p>
                  <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2.5 tw-py-px tw-rounded-sm tw-bg-[#e7eaf1]">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#1f2633]">
                      3
                    </p>
                  </div>
                </div>
              </div>
              <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-bg-[#fcfcff]">
                <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-overflow-hidden tw-gap-3 tw-px-8 tw-py-4">
                  <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow tw-gap-1">
                    <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-w-6 tw-h-6 tw-relative tw-gap-2.5">
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
                    </div>
                    <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-flex-grow tw-gap-2">
                      <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0">
                        <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                          <p className="tw-flex-grow w-[338px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                            프로그래밍과 하드웨어의 관계
                          </p>
                        </div>
                        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[13px] tw-text-left tw-text-[#9ca5b2]">
                            PDF
                          </p>
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
                          <p className="tw-container tw-flex-grow-0 tw-flex-shrink-0 tw-text-[13px] tw-text-left tw-text-[#9ca5b2]">
                            5mb
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-overflow-hidden tw-gap-3 tw-px-8 tw-py-4">
                  <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow tw-gap-1">
                    <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-w-6 tw-h-6 tw-relative tw-gap-2.5">
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
                    </div>
                    <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-flex-grow tw-gap-2">
                      <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0">
                        <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                          <p className="tw-flex-grow w-[338px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                            프로그래밍과 하드웨어의 관계
                          </p>
                        </div>
                        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[13px] tw-text-left tw-text-[#9ca5b2]">
                            PDF
                          </p>
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
                          <p className="tw-containerflex-grow-0 tw-flex-shrink-0 tw-text-[13px] tw-text-left tw-text-[#9ca5b2]">
                            5mb
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-h-14 tw-px-8 tw-py-5  tw-bg-[#f6f7fb] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-font-semibold tw-text-left tw-text-[#1f2633]">
                    질의응답 자료
                  </p>
                  <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2.5 tw-py-px tw-rounded-sm tw-bg-[#e7eaf1]">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#1f2633]">
                      3
                    </p>
                  </div>
                </div>
              </div>
              <div className="tw-flex tw-flex-col tw-justify-start tw-items-start ">
                <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[75px] tw-relative tw-gap-4 tw-pl-3 tw-pr-8 tw-py-3 tw-bg-[#fcfcff] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[33px] tw-text-base tw-font-medium tw-text-center tw-text-[#1f2633]">
                    1
                  </p>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-13 tw-text-base tw-font-medium tw-text-center tw-text-[#6a7380]">
                    황혜경
                  </p>
                  <p className="tw-flex-grow w-[277px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                    클라우드를 iot 플랫폼으로 생각할 수 있어? 아니면 둘이 또 다른 개념이야?
                  </p>
                </div>
                <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[49px] tw-relative tw-gap-4 tw-pl-3 tw-pr-8 tw-py-3 tw-bg-[#fcfcff] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[33px] tw-text-base tw-font-medium tw-text-center tw-text-[#1f2633]">
                    2
                  </p>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-13 tw-text-base tw-font-medium tw-text-center tw-text-[#6a7380]">
                    권수빈
                  </p>
                  <p className="tw-flex-grow w-[277px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                    rvi가 5는 뭘 의미하는거야?
                  </p>
                </div>
                <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[49px] tw-relative tw-gap-4 tw-pl-3 tw-pr-8 tw-py-3 tw-bg-[#fcfcff] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[33px] tw-text-base tw-font-medium tw-text-center tw-text-[#1f2633]">
                    3
                  </p>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-13 tw-text-base tw-font-medium tw-text-center tw-text-[#6a7380]">
                    김상우
                  </p>
                  <p className="tw-flex-grow w-[277px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                    お。日本語できますか？
                  </p>
                </div>
                <div className="tw-flex tw-justify-start tw-items-start tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[49px] tw-relative tw-gap-4 tw-pl-3 tw-pr-8 tw-py-3 tw-bg-[#fcfcff] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[33px] tw-text-base tw-font-medium tw-text-center tw-text-[#1f2633]">
                    4
                  </p>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-13 tw-text-base tw-font-medium tw-text-center tw-text-[#6a7380]">
                    김백건
                  </p>
                  <p className="tw-flex-grow w-[277px] tw-text-base tw-font-medium tw-text-left tw-text-[#1f2633]">
                    NFC에 대해 알려줘
                  </p>
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
              {/* Right Column Content */}
              <div className="tw-flex tw-justify-start tw-items-center tw-h-14 tw-px-8 tw-py-5 tw-rounded-tr-lg tw-bg-[#f6f7fb] tw-border-t-0 tw-border-r tw-border-b tw-border-l-0 tw-border-[#e0e4eb]">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-font-semibold tw-text-left tw-text-[#1f2633]">
                    대화
                  </p>
                </div>
              </div>

              <div className="tw-overflow-y-auto tw-p-10 tw-h-[580px]">
                <div>
                  <img className="tw-w-[61px] tw-h-[56px]" src="/assets/images/main/_chatbot.png" />
                  <p className="tw-w-[381px] tw-text-xl tw-text-left tw-text-[#313b49] tw-py-8">
                    <div className="tw-w-[381px] tw-text-lg tw-text-left tw-text-[#313b49]">안녕하세요!</div>
                    <div className="tw-w-[381px] tw-text-lg tw-text-left tw-text-[#313b49] tw-pt-1">
                      우리 수업의 AI 조교를 테스트하고,
                    </div>
                    <div className="tw-w-[381px] tw-text-lg tw-text-left tw-text-[#313b49] tw-pt-1">
                      질의 응답된 결과를 확인해보세요!
                    </div>
                  </p>
                </div>
                {messages.map(message => (
                  <div key={message.id} className={`tw-text-sm tw-flex ${getMessageAlignment(message.sender)} tw-mb-4`}>
                    <div className={`tw-p-3 tw-rounded-lg tw-max-w-xs ${getMessageStyle(message.sender)}`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {/* <div ref={messagesEndRef} /> */}
              </div>

              {/* 입력 영역을 하단에 고정 */}
              <div className="tw-flex tw-items-center tw-p-4 tw-border-t tw-bg-white">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="tw-flex-1 tw-h-12 tw-px-2 tw-border"
                  placeholder="메시지를 입력하세요..."
                />
                <button onClick={handleSendMessage} className=" tw-text-white tw-rounded-lg">
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
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LecturePlayGroundTemplate;
