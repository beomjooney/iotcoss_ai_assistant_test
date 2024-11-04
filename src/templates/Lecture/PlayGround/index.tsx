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
          <>
            <>
              <div className="tw-mt-10"></div>
            </>
          </>
        )}
      </div>
    </div>
  );
}

export default LecturePlayGroundTemplate;
