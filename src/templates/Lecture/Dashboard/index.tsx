import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import { PieChart } from 'react-minimal-pie-chart';
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`&.${tableRowClasses.root}`]: {
    height: '150px',
  },
}));

export interface LectureDashboardTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
    overflowX: 'auto',
  },
  sticky: {
    position: 'sticky',
    backgroundColor: '#F6F7FB',
    zIndex: 1,
  },
  stickyWhite: {
    position: 'sticky',
    backgroundColor: 'white',
    zIndex: 1,
  },
  stickyWhiteBoard: {
    position: 'sticky',
    backgroundColor: 'white',
    borderRight: '2px solid black',
    zIndex: 1,
  },
  stickyBoard: {
    position: 'sticky',
    backgroundColor: '#fff !important',
    borderRight: '2px solid black',
    zIndex: 1,
  },
  stickyFirst: {
    left: 0,
    // zIndex: 2,
  },
  stickySecond: {
    left: 150, // Adjust according to the width of the first column
    // zIndex: 2,
  },
  stickyThird: {
    left: 270, // Adjust according to the width of the first two columns
    // zIndex: 2,
  },
  // Add a new class for scrollable container
  scrollContainer: {
    overflowX: 'auto',
    display: 'block',
  },
  // New class to add bottom border to TableRow
  tableRow: {
    borderBottom: '1px solid #E0E0E0', // Light gray underline
    // height: '500px',
  },
}));

const cx = classNames.bind(styles);

export function LectureDashboardTemplate({ id }: LectureDashboardTemplateProps) {
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

  useDidMountEffect(() => {
    if (isSuccess) {
      setAnswer('');
      refetchMyDashboardQA();
    }
  }, [isSuccess]);

  useDidMountEffect(() => {
    if (isDeleteSuccess) {
      refetchMyDashboardStudentQA();
      refetchMyDashboardStudent();
    }
  }, [isDeleteSuccess]);

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

  // 강의클럽 대시보드 강의별 참여 현황
  const { isFetched: isDashboardLectureFetched, refetch: refetchMyDashboardLecture } = useMyDashboardLecture(
    myClubLectureParams,
    data => {
      console.log('useMyDashboardLecture', data);
      setTotalPage(data?.totalPages);
      setTotalElements(data?.totalElements);
      setMyDashboardLectureList(data || []);
    },
  );

  // 강의클럽 대시보드 강의별 참여 현황
  const { isFetched: isDashboardQAFetched, refetch: refetchMyDashboardQA } = useMyDashboardQA(myClubLectureQA, data => {
    console.log('useMyDashboardQA', data);
    setTotalQuestionPage(data?.totalPages);
    setMyDashboardQA(data || []);
  });

  // 강의클럽 대시보드 학생별 참여 현황
  const { isFetched: isDashboardStudentQAFetched, refetch: refetchMyDashboardStudentQA } = useMyDashboardStudentQA(
    myClubLectureStudentQA,
    data => {
      console.log('useMyDashboardStudentQA', data);
      setTotalStudentQuestionPage(data?.totalPages);
      setMyDashboardStudentQA(data || []);
    },
  );

  /** my quiz replies */

  const [sortType, setSortType] = useState('NAME');
  const [sortLectureType, setSortLectureType] = useState('STUDY_ORDER_ASC');

  useDidMountEffect(() => {
    console.log('clubStudySequence', clubStudySequence);
    refetchMyDashboardQA();
  }, [myClubLectureQA]);

  useDidMountEffect(() => {
    console.log('clubStudySequence', clubStudySequence);
    refetchMyDashboardStudentQA();
  }, [myClubLectureStudentQA]);

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

  const handleDeleteQuestion = () => {
    let params = {
      questionMemberUUID: memberUUID,
      clubSequence: selectedClub?.clubSequence || id,
    };
    // console.log('handleDeleteQuestion', params);
    if (confirm('전체질문을 삭제하시겠습니까?')) {
      onDeleteQuestion(params);
    }
  };

  const handleTabClick = tab => {
    setActiveTab(tab);
  };
  const classes = useStyles();

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log('handlePageChange', value);
    setLecturePage(value);
  };
  const handleQAPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log('handleQAPageChange', value);
    setQuestionPage(value);
  };
  const handleStudentQAPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log('handleStudentQAPageChange', value);
    setStudentQuestionPage(value);
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

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key, fileName);
    setKey(key);
    setFileName(fileName);
  };

  function formatDate(sentAt) {
    if (!sentAt) return '';

    const date = new Date(sentAt);

    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${month}-${day} ${hours}:${minutes}`;
  }

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
              강의 대시보드
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              강의 대시보드
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
                        강의명 : {session?.clubName}
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
                  onClick={() => router.push(`/manage-lecture-club/${selectedValue}`)}
                  className="tw-h-14  tw-text-black tw-bg-[#CED4DE] border tw-font-medium tw-rounded-md tw-text-sm tw-px-6 tw-py-2 "
                >
                  <SettingsIcon className="tw-bg-[#CED4DE] tw-text-white" />
                </button>
              </div>
            </Grid>
          </Grid>
        </div>
        {true && (
          <>
            <>
              <div className="tw-mt-10">
                <div className="tw-w-12/12 ">
                  <div className="tw-flex tw-items-center tw-justify-between tw-gap-4">
                    <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-4">
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xl tw-font-bold tw-text-left tw-text-[#31343d]">
                        이번주 학습 주차
                      </p>
                      <svg
                        width={1}
                        height={17}
                        viewBox="0 0 1 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <line x1="0.5" y1="0.5" x2="0.5" y2="16.5" stroke="#9CA5B2" />
                      </svg>
                      <p className="tw-flex tw-text-xl tw-font-bold tw-text-left tw-text-[#2474ed]">
                        {myDashboardList?.studyOrder}주차 {myDashboardList?.studyDate}{' '}
                        {myDashboardList?.dayOfWeek && `(${myDashboardList.dayOfWeek})`}
                      </p>
                    </div>
                    <p
                      onClick={() => router.push(`/view-all-lecture/${selectedValue}`)}
                      className="tw-cursor-pointer tw-text-base tw-font-bold tw-text-right tw-tw-tw-tw-text-[#313b49]"
                    >
                      전체 학습 보기
                    </p>
                  </div>
                  <div className="tw-flex tw-justify-between tw-items-center tw-gap-3 tw-px-5 tw-my-5 tw-h-[100px] tw-relative tw-rounded-lg tw-bg-white border border-[#e9ecf2]">
                    <div className=" tw-flex">
                      <p className=" tw-text-base tw-text-center tw-text-black tw-mr-5 tw-font-bold">
                        {myDashboardList?.studyOrder}주차 {myDashboardList?.clubStudyName}
                      </p>
                      <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-gap-2">
                        <div className="tw-flex tw-justify-end tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded tw-bg-white border border-[#2474ed]">
                          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-medium tw-text-right tw-text-[#2474ed]">
                            {myDashboardList?.clubStudyType === '0100' ? '온라인' : '오프라인'}
                          </p>
                        </div>
                        <div className="tw-flex tw-justify-end tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded tw-bg-white border border-[#31343d]">
                          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-medium tw-text-right tw-text-[#31343d]">
                            정규
                          </p>
                        </div>
                      </div>
                    </div>

                    <svg
                      width={34}
                      height={34}
                      viewBox="0 0 34 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[34px] h-[34px] relative tw-cursor-pointer"
                      preserveAspectRatio="none"
                      onClick={() => {
                        setIsModalOpen(true);
                        console.log('setClubStudySequence', myDashboardList?.clubStudySequence);
                        setClubStudySequence(myDashboardList?.clubStudySequence);
                        setMyClubLectureQA({
                          clubSequence: selectedClub?.clubSequence || id,
                          sequence: myDashboardList?.clubStudySequence,
                          data: { questionPage: 1 },
                        });
                      }}
                    >
                      <rect x="0.5" y="0.5" width={33} height={33} rx="3.5" stroke="#CED4DE" />
                      <path
                        d="M24.4993 24.4993L20.761 20.7543M22.8327 15.7493C22.8327 17.628 22.0864 19.4296 20.758 20.758C19.4296 22.0864 17.628 22.8327 15.7493 22.8327C13.8707 22.8327 12.0691 22.0864 10.7407 20.758C9.41229 19.4296 8.66602 17.628 8.66602 15.7493C8.66602 13.8707 9.41229 12.0691 10.7407 10.7407C12.0691 9.41229 13.8707 8.66602 15.7493 8.66602C17.628 8.66602 19.4296 9.41229 20.758 10.7407C22.0864 12.0691 22.8327 13.8707 22.8327 15.7493V15.7493Z"
                        stroke="#9CA5B2"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="tw-w-full tw-flex">
                    <div className="tw-w-3/12 tw-pr-5">
                      <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-relative tw-gap-7 tw-px-5 tw-pt-7 tw-pb-8 tw-rounded-[10px] tw-bg-[#f6f7fb]">
                        <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-4">
                          <div className="tw-bg-white tw-p-5 tw-w-full  tw-rounded-lg">
                            <div className=" tw-flex tw-justify-between tw-items-center">
                              <p className=" tw-text-sm tw-font-bold tw-text-left tw-text-[#31343d]">클럽인원</p>
                              <p className="  tw-text-2xl tw-font-bold tw-text-left tw-text-black">
                                {myDashboardList?.clubMemberCount}명
                              </p>
                            </div>
                            <div className=" tw-flex tw-justify-between tw-items-center tw-mt-3">
                              <p className=" tw-text-sm tw-font-bold tw-text-left tw-text-[#31343d]">승인대기</p>
                              <p
                                className="  tw-text-2xl tw-font-bold tw-text-left tw-text-blue-600 tw-cursor-pointer"
                                onClick={() => router.push(`/manage-lecture-club/${selectedValue}`)}
                              >
                                {myDashboardList?.memberApprovalWaitCount}명
                              </p>
                            </div>
                          </div>
                          <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[220px] tw-h-[151px] tw-relative tw-overflow-hidden tw-rounded tw-bg-white">
                            <p className="tw-absolute tw-left-5 tw-top-[18px] tw-text-sm tw-font-bold tw-text-left tw-text-[#31343d]">
                              클럽정보
                            </p>
                            <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-absolute tw-left-[50px] tw-top-14 tw-gap-1">
                              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-4">
                                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                                  <p className="tw-font-bold tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#31343d]">
                                    강의 주수
                                  </p>
                                  <svg
                                    width={1}
                                    height={13}
                                    viewBox="0 0 1 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="tw-flex-grow-0 tw-flex-shrink-0"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <line x1="0.5" y1="0.5" x2="0.5" y2="12.5" stroke="#E9ECF2" />
                                  </svg>
                                </div>
                                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-left tw-text-[#31343d]">
                                  {myDashboardList?.weekCount}주
                                </p>
                              </div>
                              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-4">
                                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm  tw-font-bold tw-text-left tw-text-[#31343d]">
                                    강의 주차
                                  </p>
                                  <svg
                                    width={1}
                                    height={13}
                                    viewBox="0 0 1 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="tw-flex-grow-0 tw-flex-shrink-0"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <line x1="0.5" y1="0.5" x2="0.5" y2="12.5" stroke="#E9ECF2" />
                                  </svg>
                                </div>
                                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-left">
                                  <span className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-left tw-text-[#2474ed]">
                                    {myDashboardList?.studyOrder}
                                  </span>
                                  <span className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-left tw-text-[#31343d]">
                                    / {myDashboardList?.clubStudyCount}회
                                  </span>
                                </p>
                              </div>
                              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-4">
                                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-left tw-text-[#31343d]">
                                    남은 학습
                                  </p>
                                  <svg
                                    width={1}
                                    height={13}
                                    viewBox="0 0 1 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="tw-flex-grow-0 tw-flex-shrink-0"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <line x1="0.5" y1="0.5" x2="0.5" y2="12.5" stroke="#E9ECF2" />
                                  </svg>
                                </div>
                                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-left tw-text-[#31343d]">
                                  {myDashboardList?.remainingClubStudyCount}회
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tw-w-3/12 tw-pr-5">
                      <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
                        <div className="tw-flex tw-px-4 tw-justify-between tw-items-center tw-bg-[#f6f7fb] tw-h-[60.5px] tw-overflow-hidden border-bottom">
                          <p className="tw-flex tw-text-base tw-font-bold tw-text-left tw-text-gray-500">
                            최근 학습 질의 내역
                          </p>
                          <div className="tw-flex">
                            [
                            <div className="tw-text-blue-600 tw-font-bold">
                              {myDashboardList?.recentQuestions?.totalElements || 0}
                            </div>
                            ]
                            {/* <div className="tw-flex">
                              <svg
                                width={28}
                                height={28}
                                viewBox="0 0 28 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="tw-w-7 tw-h-7"
                                preserveAspectRatio="xMidYMid meet"
                              >
                                <path
                                  d="M19.2095 13.5977L10.7955 5.18372L8.81445 7.16192L15.2545 13.5977L8.81445 20.0321L10.7941 22.0117L19.2095 13.5977Z"
                                  fill="#9CA5B2"
                                />
                              </svg>
                            </div> */}
                          </div>
                        </div>
                        <div className="tw-overflow-auto tw-h-[267px]">
                          {myDashboardList?.recentQuestions?.contents?.map((data, index) => (
                            <div
                              key={index}
                              className="tw-flex tw-px-3 tw-justify-start tw-items-center border-bottom tw-flex-grow-0 tw-flex-shrink-0  tw-h-[54px] tw-relative tw-overflow-hidden tw-bg-white tw-border-t-0 tw-border-r-0 tw-border-b tw-border-l-0 tw-border-[#e9ecf2] tw-min-w-[400px]"
                            >
                              <div className=" tw-text-sm tw-flex tw-justify-start tw-items-center tw-left-3 tw-gap-3">
                                <div className="tw-flex tw-flex-col tw-items-center tw-w-10">
                                  <img
                                    className="tw-w-8 tw-h-8 tw-rounded-full"
                                    src={
                                      data?.member?.profileImageUrl ||
                                      '/assets/images/account/default_profile_image.png'
                                    }
                                    alt="Profile"
                                  />
                                  <div className="tw-w-10 tw-text-xs tw-text-center">{data?.member?.nickname}</div>
                                </div>

                                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                                  <div className="tw-text-xs tw-text-gray-400">{formatDate(data?.sentAt)}</div>
                                  <div>{data?.question}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="tw-w-3/12 tw-pr-5">
                      <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
                        <div className="tw-flex tw-px-4 tw-justify-between tw-items-center tw-bg-[#f6f7fb] tw-h-[60.5px] tw-overflow-hidden border-bottom">
                          <p className="tw-flex tw-text-base tw-font-bold tw-text-left tw-text-gray-500">
                            최근 미응답 내역
                          </p>
                          <div className="tw-flex">
                            [
                            <div className="tw-text-blue-600 tw-font-bold">
                              {myDashboardList?.recentUnansweredQuestions?.totalElements || 0}
                            </div>
                            ]
                          </div>
                        </div>
                        <div className="tw-overflow-auto tw-h-[267px]">
                          {myDashboardList?.recentUnansweredQuestions?.contents?.map((data, index) => (
                            <div
                              key={index}
                              className="tw-flex tw-px-3 tw-justify-start tw-items-center border-bottom tw-flex-grow-0 tw-flex-shrink-0  tw-h-[54px] tw-relative tw-overflow-hidden tw-bg-white tw-border-t-0 tw-border-r-0 tw-border-b tw-border-l-0 tw-border-[#e9ecf2] tw-min-w-[400px]"
                            >
                              <div className=" tw-text-sm tw-flex tw-justify-start tw-items-center tw-left-6 tw-top-3 tw-gap-3">
                                <div className="tw-flex tw-flex-col tw-items-center tw-w-10">
                                  <img
                                    className="tw-w-8 tw-h-8 tw-rounded-full"
                                    src={
                                      data?.member?.profileImageUrl ||
                                      '/assets/images/account/default_profile_image.png'
                                    }
                                  />
                                  <div className="tw-w-10 tw-text-xs tw-text-center">{data?.member?.nickname}</div>
                                </div>
                                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                                  <div className="tw-text-xs tw-text-gray-400">{formatDate(data?.sentAt)}</div>
                                  <div>{data?.question}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="tw-w-3/12">
                      <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
                        <div className="tw-flex tw-px-4 tw-justify-between tw-items-center tw-bg-[#f6f7fb] tw-h-[60.5px] tw-overflow-hidden border-bottom">
                          <p className=" tw-text-base tw-font-bold tw-text-left tw-text-gray-500">AI피드백 현황</p>
                          {/* <div className="tw-flex">
                            <svg
                              width={28}
                              height={28}
                              viewBox="0 0 28 28"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="tw-w-7 tw-h-7"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <path
                                d="M19.2095 13.5977L10.7955 5.18372L8.81445 7.16192L15.2545 13.5977L8.81445 20.0321L10.7941 22.0117L19.2095 13.5977Z"
                                fill="#9CA5B2"
                              />
                            </svg>
                          </div> */}
                        </div>
                        <div className=" tw-h-[175px]  tw-flex tw-justify-center tw-items-center">
                          <div className="tw-w-[130px] tw-h-[130px]">
                            <PieChart
                              labelPosition={50}
                              lengthAngle={360}
                              lineWidth={20}
                              paddingAngle={0}
                              radius={50}
                              rounded
                              startAngle={0}
                              data={[
                                {
                                  color: '#2474ed',
                                  title: '강의자료에서 답변',
                                  value: myDashboardList?.lectureContentBasedAnswerCount,
                                },
                                {
                                  color: '#facc15',
                                  title: '일반 서치 답변',
                                  value: myDashboardList?.generalAnswerCount,
                                },
                                {
                                  color: '#ef4444',
                                  title: 'AI미응답',
                                  value: myDashboardList?.noAnswerCount,
                                },
                              ]}
                            />
                            <div className="chart_inside" style={{ cursor: 'pointer' }}>
                              <span style={{ fontSize: 'x-small', color: 'white', fontWeight: 'bold' }}>123</span>
                              <span style={{ fontSize: 'xx-small', color: 'white' }}>calories</span>
                            </div>
                          </div>
                          {/* <Circle
                            className="tw-h-[120px]"
                            trailWidth={9}
                            trailColor="#DADADA"
                            percent={myDashboardList?.participationPercentage}
                            strokeWidth={9}
                            strokeColor="#e11837"
                          /> */}
                          <div className="tw-flex tw-justify-center tw-items-center tw-absolute tw-h-full tw-w-full">
                            <p className="tw-text-base tw-font-bold tw-text-black">
                              {myDashboardList?.totalQuestionCount}개
                            </p>
                          </div>
                        </div>
                        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-relative tw-gap-0.5">
                          <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[184px] tw-h-[21px] tw-relative">
                            <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[1.5px] tw-gap-2">
                              <p className="tw-font-bold tw-flex-grow-0 tw-flex-shrink-0 tw-w-[91px]  tw-text-xs tw-text-left tw-text-[#31343d]">
                                강의자료 답변
                              </p>
                              <svg
                                width={1}
                                height={13}
                                viewBox="0 0 1 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="tw-flex-grow-0 tw-flex-shrink-0"
                                preserveAspectRatio="xMidYMid meet"
                              >
                                <line x1="0.5" y1="0.5" x2="0.5" y2="12.5" stroke="#E9ECF2" />
                              </svg>
                            </div>
                            <p className="tw-absolute tw-left-[113px] tw-top-0 tw-text-sm tw-font-bold tw-text-left">
                              <span className="tw-text-sm  tw-text-left tw-text-[#2474ed]">
                                {myDashboardList?.lectureContentBasedAnswerCount}
                              </span>
                              <span className="tw-text-sm  tw-text-left tw-text-[#31343d]">
                                / {myDashboardList?.totalQuestionCount}개
                              </span>
                            </p>
                          </div>
                          <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[184px] tw-h-[21px] tw-relative">
                            <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[1.5px] tw-gap-2">
                              <p className="tw-font-bold tw-flex-grow-0 tw-flex-shrink-0 tw-w-[91px] tw-text-xs tw-text-left tw-text-[#31343d]">
                                일반서치 답변
                              </p>
                              <svg
                                width={1}
                                height={13}
                                viewBox="0 0 1 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="tw-flex-grow-0 tw-flex-shrink-0"
                                preserveAspectRatio="xMidYMid meet"
                              >
                                <line x1="0.5" y1="0.5" x2="0.5" y2="12.5" stroke="#E9ECF2" />
                              </svg>
                            </div>
                            <p className="tw-absolute tw-left-[113px] tw-top-0 tw-text-sm tw-font-bold tw-text-right">
                              <span className="tw-text-sm  tw-text-right tw-text-yellow-400">
                                {myDashboardList?.generalAnswerCount}
                              </span>
                              <span className="tw-text-sm  tw-text-right tw-text-[#31343d]">
                                {' '}
                                / {myDashboardList?.totalQuestionCount}개
                              </span>
                            </p>
                          </div>
                          <div className="tw-mb-7 tw-flex-grow-0 tw-flex-shrink-0 tw-w-[184px] tw-h-[21px] tw-relative">
                            <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[1.5px] tw-gap-2">
                              <p className="tw-font-bold tw-flex-grow-0 tw-flex-shrink-0 tw-w-[91px] tw-text-xs tw-text-left tw-text-[#31343d]">
                                AI 미응답
                              </p>
                              <svg
                                width={1}
                                height={13}
                                viewBox="0 0 1 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="tw-flex-grow-0 tw-flex-shrink-0"
                                preserveAspectRatio="xMidYMid meet"
                              >
                                <line x1="0.5" y1="0.5" x2="0.5" y2="12.5" stroke="#E9ECF2" />
                              </svg>
                            </div>
                            <p className="tw-absolute tw-left-[113px] tw-top-0 tw-text-sm tw-font-bold tw-text-right">
                              <span className="tw-text-sm  tw-text-right tw-text-red-500">
                                {myDashboardList?.noAnswerCount}
                              </span>
                              <span className="tw-text-sm  tw-text-right tw-text-[#31343d]">
                                {' '}
                                / {myDashboardList?.totalQuestionCount}개
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>

            <div className="tw-h-12 border-left tw-relative tw-flex tw-items-center tw-mt-14 border-bottom">
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
                  className={`tw-absolute tw-left-[41px] tw-top-3 tw-text-base tw-text-center ${
                    activeTab === 'myQuiz' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
                  }`}
                >
                  학생별 보기
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
                  className={`tw-absolute tw-left-[41px] tw-top-3 tw-text-base tw-text-center ${
                    activeTab === 'community' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
                  }`}
                >
                  강의별 보기
                </p>
              </div>
              {/* Tab 3: Playground */}
              {(roles.includes('ROLE_INSTRUCTOR') || roles.includes('ROLE_MANAGER')) && (
                <div
                  className={`tw-w-[164px] tw-h-12 tw-relative tw-ml-auto tw-cursor-pointer`}
                  style={{ marginRight: '-20px' }}
                  onClick={() => router.push(`/lecture-playground/${id}`)}
                >
                  <div className="tw-text-white tw-text-sm tw-rounded-lg tw-bg-black tw-w-[144px] tw-h-10 tw-absolute tw-left-[-1px] tw-top-[-1px] tw-flex tw-justify-center tw-items-center">
                    <svg
                      width={19}
                      height={19}
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[18px] tw-h-[18px] tw-relative tw-mr-1"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M5.75 16.249H4.25V14.749H2V13.249H4.25V11.749H5.75V16.249ZM17 14.749H7.25V13.249H17V14.749ZM13.25 11.749H11.75V10.249H2V8.74902H11.75V7.25802H13.25V11.749ZM17 10.249H14.75V8.74902H17V10.249ZM8.75 7.24902H7.25V5.74902H2V4.24902H7.25V2.74902H8.75V7.24902ZM17 5.74902H10.25V4.24902H17V5.74902Z"
                        fill="white"
                      />
                    </svg>
                    플레이그라운드
                  </div>
                </div>
              )}
            </div>

            {activeTab === 'myQuiz' && (
              <div>
                <div className="tw-flex tw-justify-between tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                  <div>
                    <RadioGroup
                      className="tw-items-center tw-py-5 tw-gap-3"
                      value={sortType}
                      onChange={handleChangeQuiz}
                      row
                    >
                      <p className="tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] tw-mb-1">
                        정렬 :
                      </p>
                      <FormControlLabel
                        value="NAME"
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
                            이름순
                          </p>
                        }
                      />
                      <FormControlLabel
                        value="PARTICIPATION_RATE"
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
                            참여도순
                          </p>
                        }
                      />
                      <FormControlLabel
                        value="QUESTION_COUNT"
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
                            질의많은순
                          </p>
                        }
                      />
                    </RadioGroup>
                  </div>
                  <div className="tw-flex tw-items-center tw-justify-end tw-text-center tw-py-5">
                    <div className="tw-flex tw-justify-end tw-items-center tw-gap-3">
                      <div className="tw-flex tw-justify-end tw-items-center tw-gap-3">
                        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                          <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative">
                            <div className="tw-w-4 tw-h-4 tw-absolute tw-left-0 tw-top-[0.5px] tw-overflow-hidden tw-rounded-sm tw-bg-[#6a7380]">
                              <p className="tw-absolute tw-left-1 tw-top-px tw-text-[8px] tw-font-medium tw-text-center tw-text-white">
                                N
                              </p>
                            </div>
                          </div>
                          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                            AI답변
                          </p>
                        </div>
                        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-gap-1">
                          <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                            <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative">
                              <div className="tw-w-4 tw-h-4 tw-absolute tw-left-0 tw-top-[0.5px] tw-overflow-hidden tw-rounded-sm tw-bg-[#31343d]">
                                <p className="tw-absolute tw-left-1 tw-top-px tw-text-[8px] tw-font-medium tw-text-center tw-text-white">
                                  N
                                </p>
                              </div>
                            </div>
                            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                              교수자답변
                            </p>
                          </div>
                        </div>
                        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                          <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative">
                            <div className="tw-w-4 tw-h-4 tw-absolute tw-left-0 tw-top-[0.5px] tw-overflow-hidden tw-rounded-sm border">
                              <p className="tw-absolute tw-left-[4.5px] tw-top-[-3px] tw-text-xs tw-font-medium tw-text-center tw-text-[#31343d]">
                                -
                              </p>
                            </div>
                          </div>
                          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                            미답변
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <TableContainer>
                  <Table aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                    <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                      <TableRow>
                        <TableCell align="center" width={150} className={`${classes.sticky} ${classes.stickyFirst}`}>
                          <div className="tw-font-bold tw-text-base">학습자</div>
                        </TableCell>
                        <TableCell align="center" width={120} className={`${classes.sticky} ${classes.stickySecond}`}>
                          <div className="tw-font-bold tw-text-base">학습 참여도</div>
                        </TableCell>
                        <TableCell align="center" width={100} className={`${classes.sticky} ${classes.stickyThird}`}>
                          <div className="tw-font-bold tw-text-base">답변/질의</div>
                        </TableCell>

                        {myDashboardStudentList?.schedules?.map((session, index) => (
                          <TableCell key={index} width={90} align="right">
                            <div>
                              <p className="tw-text-base tw-font-bold tw-text-center tw-text-[#31343d] tw-left-[15px] tw-top-0">
                                {session?.order}회
                              </p>
                              <p className="tw-w-full tw-h-3.5 tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2] tw-bottom-0">
                                {session?.publishDate?.slice(5)} ({session?.dayOfWeek})
                              </p>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {myDashboardStudentList?.students?.contents?.map((info, index) => (
                        <TableRow key={index}>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            className={`${classes.stickyWhite} ${classes.stickyFirst}`}
                          >
                            <div className="tw-flex tw-items-center">
                              <img
                                className="tw-w-10 tw-h-10 tw-rounded-full"
                                src={
                                  info?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'
                                }
                                alt="Profile"
                              />
                              <div className="tw-ml-2">{info?.member?.nickname}</div>
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            className={`${classes.stickyWhite} ${classes.stickySecond}`}
                          >
                            <div
                              onClick={() => {
                                //학생별 상세 질의 이력 조회
                                setIsStudentModalOpen(true);
                                setClubStudySequence(info?.clubStudySequence);
                                setMemberUUID(info?.member?.memberUUID);
                                setStudentQuestionPage(1); // 페이지를 1로 초기화
                              }}
                              className="tw-cursor-pointer"
                            >
                              <div className="tw-font-bold tw-grid tw-gap-1 tw-justify-center tw-items-center">
                                <div>
                                  {info?.participatedStudyCount} / {info?.totalStudyCount}
                                  <span className="tw-text-sm tw-text-gray-500">{info?.studyCount}회</span>
                                </div>
                                <div className="tw-w-[70px] progress tw-rounded tw-h-2 tw-p-0">
                                  <span
                                    style={{
                                      width: `${(info?.participatedStudyCount / info?.totalStudyCount) * 100}%`,
                                    }}
                                  >
                                    <span className="progress-line"></span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            padding="none"
                            align="center"
                            component="th"
                            scope="row"
                            className={`${classes.stickyWhiteBoard} ${classes.stickyThird}`}
                          >
                            <div
                              onClick={() => {
                                //학생별 상세 질의 이력 조회
                                // setIsStudentModalOpen(true);
                                // setClubStudySequence(info?.clubStudySequence);
                                // setMyClubLectureStudentQA({
                                //   clubSequence: selectedClub?.clubSequence || id,
                                //   memberUUID: info?.member?.memberUUID,
                                //   data: { studentQuestionPage: 1 },
                                // });
                                setIsStudentModalOpen(true);
                                setClubStudySequence(info?.clubStudySequence);
                                setMemberUUID(info?.member?.memberUUID);
                                setStudentQuestionPage(1); // 페이지를 1로 초기화
                              }}
                              className="tw-cursor-pointer"
                            >
                              <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                                <span className="tw-font-bold">{info?.answeredCount}</span> / {info?.totalQuestionCount}
                              </div>
                            </div>
                          </TableCell>
                          {info?.lectureParticipation.map((info, index) => {
                            return (
                              <TableCell
                                padding="none"
                                key={index}
                                align="center"
                                width={100}
                                component="th"
                                scope="row"
                              >
                                <div className="tw-h-12 tw-flex tw-justify-center tw-items-center ">
                                  <div className="tw-flex tw-justify-center tw-items-center">
                                    <div className="border tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-overflow-hidden tw-gap-2.5 tw-px-2  tw-py-px tw-rounded-tl-sm tw-rounded-bl-sm tw-bg-[#6a7380]">
                                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-white">
                                        {info?.aiAnswerCount}
                                      </p>
                                    </div>
                                    <div className="border tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-overflow-hidden tw-gap-2.5 tw-px-2 tw-py-px tw-bg-[#313b49]">
                                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-white">
                                        {info?.instructorAnswerCount}
                                      </p>
                                    </div>
                                    <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-overflow-hidden tw-gap-2.5 tw-px-2 tw-py-px tw-rounded-tr-sm tw-rounded-br-sm tw-bg-white border">
                                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-[#313b49]">
                                        {info?.noAnswerCount}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <div className="tw-mt-10">
                  <Paginations page={pageStudent} setPage={setPageStudent} total={totalStudentPage} />
                </div>
                {myDashboardStudentList?.students?.contents?.length === 0 && (
                  <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[50vh]')}>
                    <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">데이터가 없습니다.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'community' && (
              <div>
                <div className="tw-flex tw-justify-between tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                  <div>
                    <RadioGroup
                      className="tw-items-center tw-py-5 tw-gap-3"
                      value={sortLectureType}
                      onChange={handleChangeLecture}
                      row
                    >
                      <p className="tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] tw-mb-1">
                        정렬 :
                      </p>

                      <FormControlLabel
                        value="STUDY_ORDER_ASC"
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
                            강의 오름차순
                          </p>
                        }
                      />
                      <FormControlLabel
                        value="STUDY_ORDER_DESC"
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
                            강의 내림차순
                          </p>
                        }
                      />

                      <FormControlLabel
                        value="QUESTION_COUNT"
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
                            질의많은순
                          </p>
                        }
                      />
                    </RadioGroup>
                  </div>
                  <div>
                    <Pagination
                      count={totalPage}
                      size="small"
                      siblingCount={0}
                      page={lecturePage}
                      renderItem={item => (
                        <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                      )}
                      onChange={handlePageChange}
                    />
                  </div>
                </div>
                <TableContainer>
                  <Table aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                    <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                      <TableRow>
                        <TableCell align="center" width={98} className="border-right">
                          <div className="tw-font-bold tw-text-base">강의주차</div>
                        </TableCell>
                        <TableCell align="center" width={98} className="border-right">
                          <div className="tw-font-bold tw-text-base">강의기간</div>
                        </TableCell>
                        <TableCell align="center" width={98}>
                          <div className="tw-font-bold tw-text-base">총 질의수</div>
                        </TableCell>
                        <TableCell align="center" width={105}>
                          <div className="tw-font-bold tw-text-base">
                            AI답변
                            <br />
                            (강의자료)
                          </div>
                        </TableCell>
                        <TableCell align="center" width={105}>
                          <div className="tw-font-bold tw-text-base">
                            AI답변 수 <br />
                            (범용자료)
                          </div>
                        </TableCell>
                        <TableCell align="center" width={98} className="border-right">
                          <div className="tw-font-bold tw-text-base">미답변 수</div>
                        </TableCell>
                        <TableCell align="center" className="border-right">
                          <div className="tw-font-bold tw-text-base">주요 질의응답</div>
                        </TableCell>
                        <TableCell align="center" width={110}>
                          <div className="tw-font-bold tw-text-base ">상세보기</div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {myDashboardLectureList?.contents?.map((info, index) => (
                        <StyledTableRow key={index}>
                          <TableCell align="center" component="th" scope="row" className="border-right">
                            <div className="tw-font-bold tw-text-base">
                              {info?.studyOrder}회 <br />
                            </div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row" className="border-right">
                            <div className="tw-font-bold tw-text-base">
                              <span className="tw-text-sm tw-font-medium tw-text-gray-400">
                                {info?.startDate?.substring(5)}({info?.startDayOfWeek})<br></br>~
                                {info?.endDate?.substring(5)}({info?.endDayOfWeek})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-base">{info?.totalQuestionCount}</div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-base">{info?.lectureContentAiAnswerCount}</div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div className="tw-font-bold tw-text-base">{info?.generalContentAiAnswerCount}</div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row" className="border-right">
                            <div className="tw-font-bold tw-text-base">{info?.unansweredQuestionCount} </div>
                          </TableCell>
                          <TableCell align="left" component="th" scope="row" className="border-right">
                            <div className="tw-h-[150px] tw-overflow-auto">
                              <div className="tw-font-bold tw-text-sm">
                                {info?.questionAnswer?.question ? 'Q. ' + info.questionAnswer.question : ''}
                              </div>
                              <div className="tw-font-bold tw-text-sm">
                                <Markdown className="markdown-container tw-prose tw-pr-2 tw-break-words">
                                  {info?.questionAnswer?.answer
                                    ? 'AI답변 ' +
                                      (info.questionAnswer.answerType === '0200'
                                        ? '(강의자료) : '
                                        : info.questionAnswer.answerType === '0300'
                                        ? '(일반서치) : '
                                        : '') +
                                      info.questionAnswer.answer
                                    : ''}
                                </Markdown>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <button
                              onClick={() => {
                                setIsModalOpen(true);
                                setClubStudySequence(info?.clubStudySequence);
                                console.log('setClubStudySequence', info?.clubStudySequence);
                                setMyClubLectureQA({
                                  clubSequence: selectedClub?.clubSequence || id,
                                  sequence: info?.clubStudySequence,
                                  data: { questionPage: 1 },
                                });
                              }}
                              className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded tw-cursor-pointer"
                            >
                              상세보기
                            </button>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {myDashboardLectureList?.contents?.length === 0 && (
                  <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[50vh]')}>
                    <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">데이터가 없습니다.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {/* <div className="tw-mt-10">
          <Paginations page={pageStudent} setPage={setPageStudent} total={totalStudentPage} />
        </div> */}
      </div>
      <Modal
        isOpen={isModalOpen}
        onAfterClose={() => {
          setQuestionPage(1);
          setIsModalOpen(false);
        }}
        title="질의응답"
        maxWidth="1100px"
        maxHeight="800px"
      >
        <div className={cx('seminar-check-popup')}>
          <TableContainer>
            <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
              <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                <TableRow>
                  <TableCell align="left" width={160} className="border-right">
                    <div className="tw-font-bold tw-text-base">학생</div>
                  </TableCell>
                  <TableCell align="left" width={250} className="border-right">
                    <div className="tw-font-bold tw-text-base">질문</div>
                  </TableCell>
                  <TableCell align="left" className="border-right">
                    <div className="tw-font-bold tw-text-base">답변내역</div>
                  </TableCell>
                  <TableCell align="left" width={100}>
                    <div className="tw-font-bold tw-text-base">추가답변</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myDashboardQA?.members?.map((info, memberIndex) => (
                  <React.Fragment key={memberIndex}>
                    {info.questionAnswers.map((questionInfo, questionIndex) => (
                      <TableRow key={questionIndex}>
                        {/* Render the student info only for the first question */}
                        {questionIndex === 0 && (
                          <TableCell
                            align="left"
                            component="th"
                            scope="row"
                            className="border-right"
                            rowSpan={info.questionAnswers.length}
                          >
                            <div className="tw-flex tw-justify-start tw-items-center tw-gap-2">
                              <img
                                src={info?.icon?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
                                className="tw-w-10 tw-h-10 border tw-rounded-full"
                                alt="Profile"
                              />
                              <div className="tw-ml-2">{info?.icon?.nickname}</div>
                            </div>
                          </TableCell>
                        )}

                        {/* Question Column */}
                        <TableCell align="left" component="th" scope="row" className="border-right">
                          <div className="tw-font-bold tw-text-sm">{questionInfo?.question}</div>
                        </TableCell>

                        {/* Answer Details Column */}
                        <TableCell align="left" component="th" scope="row" className="border-right">
                          <div className="tw-h-[150px] tw-overflow-auto">
                            <div className="tw-font-bold tw-text-sm">
                              <Markdown className="markdown-container tw-prose tw-pr-2 tw-break-words">
                                {questionInfo?.answer
                                  ? 'AI답변 : ' +
                                    (questionInfo?.answerType === '0200'
                                      ? '(강의자료) : '
                                      : questionInfo?.answerType === '0300'
                                      ? '(일반서치) : '
                                      : '') +
                                    questionInfo?.answer
                                  : null}
                              </Markdown>
                              {questionInfo?.instructorAnswer && (
                                <div className="tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-400">
                                  추가답변 : {questionInfo?.instructorAnswer}
                                </div>
                              )}
                              {openInputIndex === questionInfo?.lectureQuestionSerialNumber && (
                                <div className="tw-mt-2 tw-flex tw-justify-start tw-items-center tw-gap-2">
                                  <TextField
                                    type="text"
                                    placeholder="답변을 추가하세요"
                                    size="small"
                                    className="tw-border tw-px-0 tw-py-0 tw-w-full tw-rounded"
                                    value={answer}
                                    onChange={e => {
                                      setAnswer(e.target.value);
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      console.log(questionInfo);
                                      if (answer === '') {
                                        alert('답변을 입력해주세요.');
                                      } else {
                                        onSaveAnswer({
                                          clubSequence: questionInfo.clubSequence,
                                          clubStudySequence: questionInfo.clubStudySequence,
                                          lectureQuestionSerialNumber: questionInfo.lectureQuestionSerialNumber,
                                          answer: answer,
                                        });
                                      }
                                    }}
                                    className="tw-w-[80px] tw-text-sm tw-font-bold border tw-py-2.5 tw-px-3 tw-rounded"
                                  >
                                    저장
                                  </button>
                                  <button
                                    onClick={e => {
                                      e.preventDefault();
                                      setOpenInputIndex(null);
                                    }}
                                    className="tw-w-[80px] tw-text-sm tw-font-bold border tw-py-2.5 tw-px-3 tw-rounded"
                                  >
                                    삭제
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Render files if present */}
                            {questionInfo?.files?.length > 0 && (
                              <div className="tw-mt-2 tw-text-sm tw-flex tw-justify-start tw-items-center tw-flex-wrap tw-gap-2">
                                <div>강의자료 : </div>
                                {questionInfo.files.map((fileEntry, fileIndex) => (
                                  <div key={fileIndex} className="border tw-px-2 tw-py-0.5 tw-rounded">
                                    <span
                                      onClick={() => {
                                        window.open(file.url, '_blank');
                                        // onFileDownload(fileEntry.key, fileEntry.name);
                                      }}
                                      className="tw-text-gray-400 tw-cursor-pointer"
                                    >
                                      {fileEntry?.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reference URLs */}
                            {questionInfo?.referenceUrls && (
                              <div className="tw-mt-2 tw-text-sm tw-flex tw-justify-start tw-items-center tw-flex-wrap tw-gap-2">
                                <div>출처 : </div>
                                <div className="border tw-px-2 tw-py-0.5 tw-rounded">
                                  <span className="tw-text-gray-400 tw-cursor-pointer">
                                    {questionInfo?.referenceUrls}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Additional Answer Button Column */}
                        <TableCell align="center" component="th" scope="row">
                          <button
                            onClick={e => {
                              e.preventDefault();
                              setIsInputOpen(true);
                              setOpenInputIndex(questionInfo?.lectureQuestionSerialNumber);
                            }}
                            className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded"
                          >
                            +
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            {myDashboardQA?.members?.length === 0 && (
              <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[20vh]')}>
                <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">데이터가 없습니다.</p>
              </div>
            )}
            <div className="tw-flex tw-justify-center tw-items-center tw-my-5">
              <Pagination
                count={totalQuestionPage}
                size="small"
                siblingCount={0}
                page={questionPage}
                renderItem={item => (
                  <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                )}
                onChange={handleQAPageChange}
              />
            </div>
          </TableContainer>
        </div>
      </Modal>
      <Modal
        isOpen={isStudentModalOpen}
        onAfterClose={() => {
          setIsStudentModalOpen(false);
        }}
        title="학생별 상세보기"
        maxWidth="1100px"
        maxHeight="820px"
      >
        <div className={cx('seminar-check-popup', 'tw-h-[650px] tw-overflow-auto')}>
          {roles.includes('ROLE_MANAGER') && (
            <div className="tw-flex tw-justify-end tw-items-center tw-gap-3">
              <button
                onClick={() => {
                  handleDeleteQuestion();
                }}
                className="tw-text-sm tw-font-bold tw-text-white tw-bg-black tw-rounded tw-py-2 tw-px-4 tw-mb-3"
              >
                질문내역삭제
              </button>
            </div>
          )}
          <TableContainer>
            <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
              <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                <TableRow>
                  <TableCell align="left" width={200} className="border-right">
                    <div className="tw-font-bold tw-text-base">강의회차</div>
                  </TableCell>
                  <TableCell align="left" width={250} className="border-right">
                    <div className="tw-font-bold tw-text-base">강의질문</div>
                  </TableCell>
                  <TableCell align="left" className="">
                    <div className="tw-font-bold tw-text-base">답변내역</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myDashboardStudentQA?.contents?.map((info, memberIndex) => (
                  <React.Fragment key={memberIndex}>
                    <TableRow key={memberIndex}>
                      {/* Render the student info only for the first question */}
                      <TableCell align="left" component="th" scope="row" className="border-right">
                        <div className="">
                          {/* <img
                            src={info?.icon?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
                            className="tw-w-10 tw-h-10 border tw-rounded-full"
                            alt="Profile"
                          /> */}
                          <div className="tw-font-bold tw-text-sm">{info?.studyOrder}회차</div>
                          <div className="">
                            {info?.startDate?.substring(5)}({info?.startDayOfWeek}) ~ {info?.endDate?.substring(5)}(
                            {info?.endDayOfWeek})
                          </div>
                        </div>
                      </TableCell>

                      {/* Question Column */}
                      <TableCell align="left" component="th" scope="row" className="border-right">
                        <div className="tw-h-[150px] tw-overflow-auto">
                          <div className="tw-font-bold tw-text-sm">{info?.question}</div>
                        </div>
                      </TableCell>

                      {/* Answer Details Column */}
                      <TableCell align="left" component="th" scope="row" className="">
                        <div className="tw-h-[150px] tw-overflow-auto">
                          <div className="tw-font-bold tw-text-sm">
                            <Markdown className="markdown-container tw-prose tw-pr-2 tw-break-words">
                              {info?.answer
                                ? 'AI답변 : ' +
                                  (info?.answerType === '0200'
                                    ? '(강의자료) : '
                                    : info?.answerType === '0300'
                                    ? '(일반서치) : '
                                    : '') +
                                  info?.answer
                                : null}
                            </Markdown>
                            {info?.instructorAnswer && (
                              <div className="tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-400">
                                추가답변 : {info?.instructorAnswer}
                              </div>
                            )}
                          </div>

                          {/* Render files if present */}
                          {info?.clubContents?.length > 0 && (
                            <div className="tw-mt-2 tw-text-sm tw-flex tw-justify-start tw-items-center tw-flex-wrap tw-gap-2">
                              <div>강의자료 : </div>
                              {info?.clubContents?.map((fileEntry, fileIndex) => (
                                <div key={fileIndex} className="border tw-px-2 tw-py-0.5 tw-rounded">
                                  <span
                                    onClick={() => {
                                      window.open(fileEntry.url, '_blank');
                                      // onFileDownload(fileEntry.key, fileEntry.name);
                                    }}
                                    className="tw-text-gray-400 tw-cursor-pointer"
                                  >
                                    {fileEntry?.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            {myDashboardStudentQA?.members?.length === 0 && (
              <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[20vh]')}>
                <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">데이터가 없습니다.</p>
              </div>
            )}
          </TableContainer>
        </div>
        <div className="tw-flex tw-justify-center tw-items-center tw-my-5">
          <Pagination
            count={totalStudentQuestionPage}
            size="small"
            siblingCount={0}
            page={studentQuestionPage}
            renderItem={item => (
              <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
            )}
            onChange={handleStudentQAPageChange}
          />
        </div>
      </Modal>
    </div>
  );
}

export default LectureDashboardTemplate;
