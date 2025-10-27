import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import { PieChart } from 'react-minimal-pie-chart';
import AICompanyFeedbackSummary from 'src/stories/components/AICompanyFeedbackSummary/index';
import {
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
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { Mobile } from 'src/hooks/mediaQuery';
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
import AIFeedbackSummary from 'src/stories/components/AIFeedbackSummary/index';
import AICqiReport from 'src/stories/components/AICqiReport/index';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/material/styles';
import {
  useQuizAIFeedbackLectureGetMember,
  useQuizFileDownload,
  useQuizAIFeedbackLectureGetMemberCQI,
} from 'src/services/quiz/quiz.queries';
import Markdown from 'react-markdown';
import router from 'next/router';
import { useSessionStore } from '../../../store/session';
import { useStudyOrderLabel } from 'src/hooks/useStudyOrderLabel';
import MentorsModal from 'src/stories/components/MentorsModal';
import {
  useLectureClubEvaluationMember,
  useLectureClubEvaluationReport,
} from 'src/services/community/community.mutations';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`&.${tableRowClasses.root}`]: {
    height: '150px',
  },
}));

export interface LectureCompanyTemplateProps {
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
  stickyFourth: {
    left: 370, // Adjust according to the width of the first two columns
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

export function LectureCompanyTemplate({ id }: LectureCompanyTemplateProps) {
  const classes = useStyles();
  const [isMounted, setIsMounted] = useState(false);
  const [clientState, setClientState] = useState({
    roles: [],
    studyOrderLabelType: null,
  });

  const { studyOrderLabelType } = useSessionStore.getState();
  const { studyOrderLabel } = useStudyOrderLabel(studyOrderLabelType);
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
  const [aiEvaluationParamsTotal, setAiEvaluationParamsTotal] = useState(null);
  const [aiEvaluationParamsTotalCQI, setAiEvaluationParamsTotalCQI] = useState(null);
  const [aiFeedbackDataTotal, setAiFeedbackDataTotal] = useState<any>(null);
  const [aiFeedbackDataTotalReport, setAiFeedbackDataTotalReport] = useState<any>(null);
  const [aiFeedbackDataTotalQuiz, setAiFeedbackDataTotalQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCQIReport, setIsLoadingCQIReport] = useState(false);
  const [isCQIReportModalOpen, setIsCQIReportModalOpen] = useState(false);
  const [myClubSequenceParams, setMyClubSequenceParams] = useState<any>({ clubSequence: id });
  const [selectedValue, setSelectedValue] = useState(id);
  const [activeTab, setActiveTab] = useState('myQuiz');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAIFeedbackModalOpen, setIsAIFeedbackModalOpen] = useState(false);
  const [key, setKey] = useState('');
  const [fileName, setFileName] = useState('');
  const [memberUUID, setMemberUUID] = useState('');
  const [memberUUIDList, setMemberUUIDList] = useState('');
  const [selectedStudentInfo, setSelectedStudentInfo] = useState<any>(null);
  const [sortType, setSortType] = useState('NAME');
  const [myClubLectureQA, setMyClubLectureQA] = useState<any>(null);
  const [sortLectureType, setSortLectureType] = useState('STUDY_ORDER_ASC');
  const [age, setAge] = useState('');
  const handleChange = event => {
    setAge(event.target.value);
  };
  const [myClubSubTitleParams, setMyClubSubTitleParams] = useState<any>({
    clubSequence: id,
    page,
    clubType: '0200',
    size: 100,
  });

  const [myClubParams, setMyClubParams] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    data: { sortType: 'NAME', page: 1 },
  });
  const [myClubLectureParams, setMyClubLectureParams] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    data: { orderBy: 'STUDY_ORDER', lecturePage: 1, sortType: 'ASC' },
  });

  const [myClubLectureStudentQA, setMyClubLectureStudentQA] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    memberUUID: '',
    data: { studentQuestionPage: 1 },
  });
  const [answer, setAnswer] = useState('');

  const { mutate: onSaveAnswer, isSuccess, isError } = useSaveAnswer();
  const { mutate: onDeleteQuestion, isSuccess: isDeleteSuccess } = useDeleteQuestion();

  /** 개별 클럽의 로딩 상태 설정 */
  const {
    mutate: onLectureClubEvaluationMember,
    isSuccess: lectureClubEvaluationMemberSucces,
    isError: lectureClubEvaluationMemberError,
  } = useLectureClubEvaluationMember();

  /** 개별 클럽의 CQI 보고서 생성 */
  const {
    mutate: onLectureClubEvaluationReport,
    isSuccess: lectureClubEvaluationReportSucces,
    isError: lectureClubEvaluationReportError,
  } = useLectureClubEvaluationReport();

  // AI 피드백 데이터 조회
  const {
    refetch: refetchAIEvaluationTotal,
    isError: isErrorAIEvaluationTotal,
    isSuccess: isSuccessAIEvaluationTotal,
  } = useQuizAIFeedbackLectureGetMember(
    aiEvaluationParamsTotal,
    data => {
      console.log('🎉 AI Evaluation Total SUCCESS:', data);
      setAiFeedbackDataTotal(data);
    },
    error => {
      console.error('❌ AI Evaluation Total ERROR:', error);
      alert('피드백 데이터를 불러오는데 실패했습니다.');
    },
  );

  // CQI 피드백 데이터 조회
  const {
    refetch: refetchAIEvaluationTotalCQI,
    isError: isErrorAIEvaluationTotalCQI,
    isSuccess: isSuccessAIEvaluationTotalCQI,
  } = useQuizAIFeedbackLectureGetMemberCQI(
    aiEvaluationParamsTotalCQI,
    data => {
      console.log('🎉 AI Evaluation Total SUCCESS:', data);
      setAiFeedbackDataTotalReport(data);
    },
    error => {
      console.error('❌ AI Evaluation Total ERROR:', error);
      alert('피드백 데이터를 불러오는데 실패했습니다.');
    },
  );

  useEffect(() => {
    if (lectureClubEvaluationReportSucces || lectureClubEvaluationReportError) {
      refetchAIEvaluationTotalCQI();
      setIsLoadingCQIReport(false);
    }
  }, [lectureClubEvaluationReportSucces, lectureClubEvaluationReportError]);

  useEffect(() => {
    if (lectureClubEvaluationMemberSucces || lectureClubEvaluationMemberError) {
      refetchAIEvaluationTotal();
      setIsLoading(false);
    }
  }, [lectureClubEvaluationMemberSucces, lectureClubEvaluationMemberError]);

  useEffect(() => {
    if (isSuccessAIEvaluationTotalCQI || isErrorAIEvaluationTotalCQI) {
      refetchAIEvaluationTotalCQI();
      setIsLoadingCQIReport(false);
    }
  }, [isSuccessAIEvaluationTotalCQI, isErrorAIEvaluationTotalCQI]);

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
      data: { sortType: sortType, page: pageStudent, orderBy: sortType === 'NAME' ? 'ASC' : 'DESC' },
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
    setAiFeedbackDataTotalReport({});
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
        const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        window.open(url, '_blank', 'noopener,noreferrer');
        setKey('');
        setFileName('');
      }
    },
  );

  function formatDate(sentAt) {
    if (!sentAt) return '';
    const date = new Date(sentAt);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  }

  // 클라이언트 마운트 후 상태 설정
  useEffect(() => {
    setIsMounted(true);
    try {
      const { roles, studyOrderLabelType } = useSessionStore.getState();
      setClientState({ roles, studyOrderLabelType });
    } catch (error) {
      console.error('Session store error:', error);
    }
  }, []);

  // AI 개별 피드백 데이터 조회
  useDidMountEffect(() => {
    if (aiEvaluationParamsTotal) {
      refetchAIEvaluationTotal();
    }
  }, [aiEvaluationParamsTotal]);

  useDidMountEffect(() => {
    if (aiEvaluationParamsTotalCQI) {
      refetchAIEvaluationTotalCQI();
    }
  }, [aiEvaluationParamsTotalCQI]);

  // 마운트되지 않았을 때 로딩 표시
  if (!isMounted) {
    return (
      <div className={cx('seminar-container')}>
        <div className={cx('container')}>
          <div className="tw-pt-8">
            <div className="tw-flex tw-justify-center tw-items-center tw-h-[50vh]">
              <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <div className="tw-pt-8">
          <div className="tw-flex tw-justify-start tw-items-start tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#313b49]">메뉴1</p>
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
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#313b49]">상세메뉴</p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              추천 학습자 대시보드
            </p>
          </div>
          <Divider className="tw-py-2 tw-bg-['#efefef']" />
        </div>
        <>
          <div className="tw-min-h-[1000px] tw-flex tw-flex-col">
            <div className="tw-flex tw-gap-2 tw-items-center tw-mt-10 tw-mb-10">
              <div className="tw-flex tw-items-center tw-gap-5">
                <select
                  className="tw-h-10 tw-w-[250px] form-select block tw-px-4 tw-rounded"
                  onChange={handleChange}
                  value={age}
                  aria-label="Default select example"
                >
                  <option value="">대학을 선택해주세요</option>
                  <option value="0100">대학1</option>
                  <option value="0200">대학2</option>
                  <option value="0300">대학3</option>
                </select>
              </div>
              <div className="tw-flex tw-items-center tw-gap-2">
                <select
                  className="tw-h-10 tw-w-[250px] form-select block tw-px-4 tw-rounded"
                  onChange={handleChange}
                  value={age}
                  aria-label="Default select example"
                >
                  <option value="">학과 전체</option>
                  <option value="0100">교수자 답변노출</option>
                  <option value="0200">AI 답변노출</option>
                  <option value="0300">교수자+AI 답변노출</option>
                </select>
              </div>
            </div>
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
            </div>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                  <TableRow>
                    <TableCell align="center" width={150}>
                      <div className="tw-font-bold tw-text-base">이름</div>
                    </TableCell>
                    <TableCell align="center" width={120}>
                      <div className="tw-font-bold tw-text-base">대학</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">학과</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">이해도</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">성실도</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">사고도</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">완성도</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">참여도</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">평균 점수</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">상세보기</div>
                    </TableCell>

                    {/* {myDashboardStudentList?.schedules?.map((session, index) => (
                      <TableCell key={index} width={90} align="right">
                        <div>
                          <p className="tw-text-base tw-font-bold tw-text-center tw-text-[#31343d] tw-left-[15px] tw-top-0">
                            {session?.order} {studyOrderLabel}
                          </p>
                          <p className="tw-w-full tw-h-3.5 tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2] tw-bottom-0">
                            {session?.publishDate?.slice(5)} ({session?.dayOfWeek})
                          </p>
                        </div>
                      </TableCell>
                    ))} */}
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
                            src={info?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
                            alt="Profile"
                          />
                          <div className="tw-ml-2">{info?.member?.nickname}</div>
                        </div>
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                        <div className="tw-font-bold tw-grid tw-gap-1 tw-justify-center tw-items-center">
                          <div>
                            <span className="tw-text-sm tw-text-gray-500">국어대학교</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                          <span className="tw-font-bold">국어문학</span>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.answeredCount}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.answeredCount}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.answeredCount}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.answeredCount}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.answeredCount}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.answeredCount}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row" width={100}>
                        <div
                          onClick={() => {
                            if (!info?.comprehensiveEvaluationViewable) {
                              return;
                            }
                            setSelectedStudentInfo(info);
                            setIsAIFeedbackModalOpen(true);
                            setAiEvaluationParamsTotal({
                              clubSequence: selectedClub?.clubSequence || id,
                              memberUUID: info?.member?.memberUUID,
                            });
                            setMemberUUIDList(info?.member?.memberUUID);
                          }}
                          className={`tw-gap-1 tw-p-1 tw-rounded-[5px] tw-w-[70px] tw-flex tw-justify-center tw-items-center tw-bg-[#6A7380] tw-text-white tw-cursor-pointer tw-text-sm tw-mx-auto ${
                            info?.comprehensiveEvaluationViewable
                              ? 'tw-bg-[#6A7380] tw-text-white tw-cursor-pointer'
                              : 'tw-bg-gray-300 tw-text-gray-500 tw-cursor-not-allowed'
                          }`}
                        >
                          <p>상세보기</p>
                          <svg
                            width={7}
                            height={10}
                            viewBox="0 0 7 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-grow-0 flex-shrink-0"
                            preserveAspectRatio="none"
                          >
                            <path d="M1 1L5 5L1 9" stroke="#fff" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </TableCell>
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
        </>
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
                                        window.open(fileEntry.url, '_blank');
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
          {isMounted && clientState.roles.includes('ROLE_MANAGER') && (
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
                    <div className="tw-font-bold tw-text-base">강의{studyOrderLabel}</div>
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
                          <div className="tw-font-bold tw-text-sm">
                            {info?.studyOrder} {studyOrderLabel}
                          </div>
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

      {/* AI 피드백 모달 */}
      <MentorsModal
        isOpen={isAIFeedbackModalOpen}
        isContentModalClick={true}
        onAfterClose={() => {
          setIsAIFeedbackModalOpen(false);
          setSelectedStudentInfo(null);
          setIsLoading(false); // loading 상태 초기화 추가
        }}
        title={'학습자분석 상세보기'}
      >
        <div>
          <div className="tw-flex tw-justify-between tw-items-center tw-gap-4 tw-mb-4">
            <div className="tw-text-xl tw-font-bold tw-text-black tw-text-center">수강완료 퀴즈클럽</div>
            <div className="tw-flex tw-gap-2">
              <span className="tw-px-2 tw-py-1 tw-text-xs tw-rounded-md tw-font-medium tw-bg-blue-200 tw-text-blue-900">
                미래커리어대학
              </span>
              <span className="tw-px-2 tw-py-1 tw-text-xs tw-rounded-md tw-font-medium tw-bg-gray-100 tw-text-gray-700">
                스포츠레저산업학과
              </span>
              <span className="tw-px-2 tw-py-1 tw-text-xs tw-rounded-md tw-font-medium tw-bg-yellow-200 tw-text-yellow-900">
                1학년
              </span>
            </div>
          </div>

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
          <AICompanyFeedbackSummary
            aiFeedbackDataTotal={aiFeedbackDataTotal || null}
            aiFeedbackDataTotalQuiz={aiFeedbackDataTotalQuiz}
            isLoading={isLoading}
            isFeedbackOptions={true}
            isAdmin={true}
            clubSequence={selectedClub?.clubSequence || id}
            memberUUID={memberUUIDList}
          />
        </div>
      </MentorsModal>

      {/* CQI 보고서 모달 */}
      <MentorsModal
        isOpen={isCQIReportModalOpen}
        isContentModalClick={true}
        title={'CQI 보고서'}
        onAfterClose={() => {
          setIsCQIReportModalOpen(false);
          setIsLoadingCQIReport(false);
          setAiFeedbackDataTotalReport({});
        }}
      >
        <div>
          <div className="tw-flex  tw-justify-end tw-items-center tw-gap-4 tw-mb-4">
            <button
              onClick={() => {
                console.log('CQI 보고서 생성');
                onLectureClubEvaluationReport({
                  clubSequence: selectedClub?.clubSequence || id,
                });
                setIsLoadingCQIReport(true);
              }}
              className="tw-text-base tw-text-center tw-bg-black tw-text-white tw-px-4 tw-py-2 tw-rounded-md"
            >
              {isLoadingCQIReport
                ? 'CQI 보고서 생성중...'
                : aiFeedbackDataTotalReport?.studentFeedback
                  ? 'CQI 보고서 AI초안 재생성'
                  : 'CQI 보고서 AI초안 생성'}
            </button>
          </div>
          <AICqiReport
            aiFeedbackDataTotal={aiFeedbackDataTotalReport}
            isLoading={isLoadingCQIReport}
            isAdmin={true}
            clubSequence={selectedClub?.clubSequence || id}
          />
        </div>
      </MentorsModal>
    </div>
  );
}

export default LectureCompanyTemplate;
