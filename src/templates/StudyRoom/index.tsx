import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { ToggleLabel, Pagination, Typography, Chip, ClubCard, CourseCard } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import {
  useStudyRoomList,
  paramProps,
  useStudyQuizList,
  useStudyQuizCalendarList,
  useStudyQuizBadgeList,
} from 'src/services/studyroom/studyroom.queries';
import QuizArticleCard from 'src/stories/components/QuizArticleCard';
import Carousel from 'nuka-carousel';
import { ArticleEnum } from '../../config/types';
import CircleIcon from '@mui/icons-material/Circle';
import { useContentJobTypes, useContentTypes, useJobGroups } from 'src/services/code/code.queries';
import Banner from '../../stories/components/Banner';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/system/Box';
import Divider from '@mui/material/Divider';
import { useSessionStore } from 'src/store/session';
import { useDeleteLike, useSaveLike } from 'src/services/community/community.mutations';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';

/** import galendar  */
import moment from 'moment';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Badge from '@mui/material/Badge';

/** import pagenation */
import _Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Stack from '@mui/material/Stack';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';

/** table */
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
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
    backgroundColor: '#F6F7FB',
    borderRight: '2px solid black',
    zIndex: 1,
  },
  stickyFirst: {
    left: 0,
  },
  stickySecond: {
    left: 100, // 이 값을 `Dessert` 열의 너비에 맞게 조정하세요.
  },
  stickyThread: {
    left: 220, // 이 값을 `Dessert` 열의 너비에 맞게 조정하세요.
  },
  root: {
    '& > *': {
      margin: theme.spacing(0),
    },
  },
  font1: {
    // top: '0%',
    marginTop: '10px',
    width: '100%',
    right: '50%',
    pointerEvents: 'none', // Make the element non-interactive
  },
}));
const cx = classNames.bind(styles);

const studyStatus = [
  {
    id: '0001',
    name: '가입한 클럽',
  },
  {
    id: '0002',
    name: '나의 학습내역',
  },
  {
    id: '0003',
    name: '학습완료',
  },
  {
    id: '0004',
    name: '내가 푼 퀴즈',
  },
  {
    id: '0005',
    name: '저장한 지식콘텐츠',
  },
];

const dateInfo = {
  sessions: [
    { number: '1회', date: '07-01 (월)' },
    { number: '2회', date: '07-08 (월)' },
    { number: '3회', date: '07-15 (월)' },
    { number: '4회', date: '07-22 (월)' },
    { number: '5회', date: '07-29 (월)' },
    { number: '6회', date: '08-05 (월)' },
    { number: '7회', date: '08-12 (월)' },
    { number: '8회', date: '08-19 (월)' },
    { number: '9회', date: '08-19 (월)' },
    { number: '10회', date: '08-19 (월)' },
    { number: '11회', date: '08-19 (월)' },
    { number: '12회', date: '08-19 (월)' },
    { number: '12회', date: '08-19 (월)' },
    { number: '12회', date: '08-19 (월)' },
    { number: '12회', date: '08-19 (월)' },
    { number: '12회', date: '08-19 (월)' },
    { number: '12회', date: '08-19 (월)' },
  ],
  student: [
    {
      name: '김승테',
      sessions: [
        {
          date: '09-03 (월)',
          color: '#31343D',
          text: '3',
        },
        {
          date: '00-16 (월)',
          color: '#FF8F60',
          text: '?',
        },
        {
          date: '09-18 (수)',
          color: '#E11837',
          text: '?',
        },
        {
          date: 'D+2',
          color: 'white',
          borderColor: '#E11837',
          text: '?',
          isBold: true,
        },
        {
          date: 'D+2',
          color: 'white',
          borderColor: '#E11837',
          text: '?',
          isBold: true,
        },
        {
          date: 'D+2',
          color: 'white',
          borderColor: '#E11837',
          text: '?',
          isBold: true,
        },
        {
          date: 'D+2',
          color: '#F6F7FB',
          borderColor: '#E0E4EB',
          text: '',
          isBold: false,
        },
      ],
    },
  ],
};

const courseData = [
  {
    imageSrc: '/assets/images/quiz/rectangle_183.png',
    status: '진행중',
    college: '소프트웨어융합대학',
    department: '컴퓨터공학과',
    year: '2학년',
    courseTitle: '임베디드 시스템',
    courseDetails: '[전공선택] 2학년 화요일 A반',
    professor: '양황규 교수님',
    courseSchedule: '2023.00.00 ~ 2023.00.00ㅣ월, 목ㅣ퀴즈클럽 12주ㅣ학습 24회',
  },
  {
    imageSrc: '/assets/images/quiz/rectangle_183.png',
    status: '종료',
    college: '공과대학',
    department: '기계공학과',
    year: '3학년',
    courseTitle: '열역학',
    courseDetails: '[전공필수] 3학년 수요일 B반',
    professor: '김철수 교수님',
    courseSchedule: '2023.01.15 ~ 2023.06.30ㅣ화, 금ㅣ퀴즈클럽 16주ㅣ학습 32회',
  },
  {
    imageSrc: '/assets/images/quiz/rectangle_183.png',
    status: '예정',
    college: '인문대학',
    department: '영문학과',
    year: '1학년',
    courseTitle: '영미문학개론',
    courseDetails: '[교양선택] 1학년 월요일 C반',
    professor: '이영희 교수님',
    courseSchedule: '2023.09.01 ~ 2023.12.20ㅣ월, 수ㅣ퀴즈클럽 14주ㅣ학습 28회',
  },
];

export function StudyRoomTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();
  const { logged } = useSessionStore.getState();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [badgePage, setBadgePage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [quizPage, setQuizPage] = useState(1);
  const [quizTotalPage, setQuizTotalPage] = useState(1);
  const [viewFilter, setViewFilter] = useState('0001');
  const [params, setParams] = useState<paramProps>({ page, viewFilter });
  const [quizParams, setQuizParams] = useState<paramProps>({ page });
  const [badgeParams, setBadgeParams] = useState<paramProps>({ page: badgePage, isAchieved: true });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [badgeContents, setBadgeContents] = useState<RecommendContent[]>([]);
  const [quizList, setQuizList] = useState<RecommendContent[]>([]);
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  const [value, onChange] = useState<Date>(new Date());
  const day = moment(value).format('YYYY-MM-DD');
  const currDate = new Date();
  const currDateTime = moment(currDate).format('MM-DD');
  const [open, setOpen] = React.useState(false);
  const [contentJobType, setContentJobType] = useState<any[]>([]);

  const [selectedOption, setSelectedOption] = useState('latest');

  const handleChangeQuiz = event => {
    setSelectedOption(event.target.value);
  };

  /**calendar param */
  const [calendarYearMonth, setCalendarYearMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));
  const [highlightedDays, setHighlightedDays] = React.useState([]); // 년월일 형식의 문자열로 변경
  const [calendarList, setCalendarList] = React.useState([]);
  const [quizStatusList, setQuizStatusList] = React.useState([]);
  const [calendarParams, setCalendarParams] = useState<paramProps>({ calendarYearMonth });

  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setQuizPage(value);
  };

  function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: string[] }) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
    const isSelected = highlightedDays.some(item => item.date === props.day.format('YYYY-MM-DD'));
    const count = highlightedDays.find(item => item.date === props.day.format('YYYY-MM-DD'))?.count || 0;

    const dots = Array.from({ length: count }, (_, index) => (
      <span key={index} className="tw-font-bold tw-text-2xl tw-text-blue-500 tw-h-[10px]">
        .
      </span>
    ));
    return (
      <Badge
        classes={{
          badge: classes.font1,
        }}
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? dots : undefined}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
  }
  const { isFetched: isContentFetched, refetch: refetch } = useStudyRoomList(params, data => {
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPages);
  });
  const { isFetched: isQuizFetched, refetch: QuizRefetch } = useStudyQuizList(quizParams, data => {
    setQuizList(data.data.contents || []);
    setQuizTotalPage(data.data.totalPages);
  });
  const { isFetched: isQuizCalendarFetched, refetch: QuizRefetchCalendar } = useStudyQuizCalendarList(
    calendarParams,
    data => {
      const newData = data?.map(item => ({
        date: item.date,
        count: Math.min(item.clubs.length, 3), // Limit to a maximum of 3
      }));
      setCalendarList(data);
      setHighlightedDays(newData);
    },
  );

  const { isFetched: isQuizbadgeFetched, refetch: QuizRefetchBadge } = useStudyQuizBadgeList(badgeParams, data => {
    setBadgeContents(data.data.contents);
  });

  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setContentTypes(data.data.contents || []);
    const contentsType = data.length >= 0 && data[0].id;
    setParams({
      ...params,
      // contentsType,
    });
  });

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  useEffect(() => {
    setParams({
      // ...params,
      page,
      viewFilter,
    });
  }, [page]);

  useEffect(() => {
    setQuizParams({
      // ...params,
      page: quizPage,
    });
  }, [quizPage]);

  useEffect(() => {
    //console.log(calendarYearMonth);
    setCalendarParams({ calendarYearMonth });
  }, [calendarYearMonth]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f9f9f9',
      color: '#000',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: '15px',
    },
  }));

  function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <StyledTableCell style={{ padding: 8 }} align="center">
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8, fontWeight: 600 }} align="center">
            {row.clubName}
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="center">
            {row.leaderNickname}
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="center">
            {row.recruitedMemberCount}
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="center">
            {row.startAt.split(' ')[0]}
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="center">
            {row.studyWeekCount}회
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="center">
            <div className="progress tw-rounded tw-h-2 tw-p-0">
              <span style={{ width: `${parseInt(row.clubRunRate)}%` }}>
                <span className="progress-line"></span>
              </span>
            </div>
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="center">
            <button
              onClick={() => (location.href = '/quiz/' + `${row.clubSequence}`)}
              className="tw-bg-blue-500 tw-text-white tw-text-xs tw-font-medium tw-mr-2 tw-px-2.5 tw-py-3 tw-rounded"
            >
              입장하기
            </button>
          </StyledTableCell>
        </TableRow>
        <TableRow className=" tw-bg-blue-50">
          <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <div className="tw-p-3 tw-pl-14">
                <div className="tw-text-sm tw-grid tw-grid-cols-8 tw-gap-4 tw-text-gray-500">
                  <div className="tw-col-span-2">클럽생성일 | {row.clubCreatedAt.split(' ')[0]}</div>
                  <div className="tw-col-span-2"> 클럽가입일 | {row.clubJoinedAt?.split(' ')[0]}</div>
                  <div className="tw-col-span-2">
                    학습횟수 : {row.studyCount} / {row.studyTotalCount} 회
                  </div>
                </div>
              </div>
            </Collapse>
          </StyledTableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein };
  }

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {},
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const handleMonthChange = (date: Dayjs) => {
    // Extract year and month in 'YYYY-MM' format
    const yearMonth = date.format('YYYY-MM');
    setCalendarYearMonth(yearMonth);
  };
  const handleDayChange = (date: Dayjs) => {
    // Extract year and month in 'YYYY-MM' format
    const yearMonth = date.format('YYYY-MM-DD');

    // 해당 날짜의 clubs 리스트 찾기
    const clubsForTargetDate = calendarList.find(item => item.date === yearMonth)?.clubs || [];
    //console.log(yearMonth, clubsForTargetDate);
    setQuizStatusList(clubsForTargetDate);
    // setCalendarYearMonth(yearMonth);
  };
  return (
    <>
      <Desktop>
        <div className={cx('seminar-container')}>
          {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

          <div className={cx('container')}>
            <div className="tw-py-[60px]">
              <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
                <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black max-lg:!tw-text-base">
                  나의 학습방
                </Grid>
                <Grid
                  item
                  xs={10}
                  className="max-lg:tw-p-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-sm"
                >
                  나의 퀴즈클럽 진행사항을 한 눈에 보여주고 있어요!
                </Grid>
                {/* <Grid item xs={4} justifyContent="flex-end" className="tw-flex">
                  <button
                    onClick={() => (location.href = '/quiz-my')}
                    type="button"
                    className="tw-text-blue-600 tw-bg-white border border-primary tw-mr-3  tw-font-bold tw-rounded tw-text-sm tw-px-5 tw-py-2.5 "
                  >
                    내가 만든 클럽 {'>'}
                  </button>
                  <button
                    onClick={() => (location.href = '/quiz-make')}
                    type="button"
                    className="tw-text-blue-600 tw-bg-white border border-primary tw-font-bold tw-rounded tw-text-sm tw-px-5 tw-py-2.5  "
                  >
                    내가 만든 퀴즈 {'>'}
                  </button>
                </Grid> */}
              </Grid>
            </div>
            <Box sx={{ width: '100%', typography: 'body1', marginTop: '20px', marginBottom: '20px' }}>
              <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
                <Grid item xs={12} className="tw-font-bold tw-text-3xl tw-text-black">
                  {/* <SecondTabs tabs={testBoards} /> */}

                  <div className={cx('filter-area')}>
                    <div className={cx('mentoring-button__group', 'gap-12', 'justify-content-center')}>
                      {studyStatus.map((item, i) => (
                        <ToggleLabel
                          key={item.id}
                          label={item.name}
                          name={item.name}
                          value={item.id}
                          variant="small"
                          checked={active === i}
                          isActive
                          type="tabButton"
                          onChange={() => {
                            setActive(i);
                            setContentType(item.id);
                            setParams({
                              ...params,
                              viewFilter: item.id,
                              page,
                            });
                            setPage(1);
                          }}
                          className={cx('fixed-width', 'max-lg:!tw-hidden')}
                        />
                      ))}
                      <ToggleLabel
                        label="배지보기"
                        name="배지보기"
                        value=""
                        variant="small"
                        checked={active === 4}
                        isActive
                        type="tabButton"
                        onChange={() => {
                          setActive(4);
                        }}
                        className={cx('fixed-width')}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Box>

            <Divider className="tw-mb-6 tw-border tw-bg-['#efefef']" />
            <article>
              <div className={cx('content-area')}>
                <section className={cx('content', 'flex-wrap-container')}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="left"
                    // alignItems="center"
                    rowSpacing={3}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12}>
                      {isContentFetched && active === 0 && (
                        <>
                          <Grid
                            container
                            direction="row"
                            justifyContent="left"
                            // alignItems="center"
                            rowSpacing={3}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                          >
                            <Grid item xs={8}>
                              <RadioGroup
                                className="tw-items-center tw-pb-3 tw-gap-3"
                                value={selectedOption}
                                onChange={handleChangeQuiz}
                                row
                              >
                                <p className="tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] tw-mb-1">
                                  정렬 :
                                </p>
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

                              <div className="tw-py-4 ">
                                {courseData.map((course, index) => (
                                  <div key={index} className="tw-pb-5">
                                    <CourseCard key={index} data={course} />
                                  </div>
                                ))}

                                {/* <Pagination count={totalPage} page={page} onChange={handleChange} /> */}
                                <div className="tw-py-4">
                                  <Pagination page={page} setPage={setPage} total={totalPage} />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={4}>
                              <div className="tw-bg-gray-50 tw-rounded-md tw-h-[400px] tw-p-5 tw-text-black ">
                                <div className="tw-font-bold tw-text-base tw-pb-5">나의 학습 캘린더</div>
                                <div className="tw-bg-white">
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar
                                      onMonthChange={handleMonthChange}
                                      onChange={handleDayChange}
                                      showDaysOutsideCurrentMonth
                                      slots={{
                                        day: ServerDay,
                                      }}
                                      slotProps={{
                                        day: {
                                          highlightedDays,
                                        } as any,
                                      }}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>

                              {quizStatusList.length > 0 && (
                                <div className="tw-bg-gray-50 tw-rounded-md tw-p-5 tw-text-black ">
                                  <div className="tw-font-bold tw-text-base tw-pb-5">퀴즈 상태</div>
                                  {quizStatusList.map((item, i) => {
                                    return (
                                      // TODO API Response 보고 댓글 작성자로 수정 필요
                                      <div
                                        key={i}
                                        className="tw-flex tw-items-center tw-rounded-md tw-grid tw-grid-cols-6 tw-gap-0  tw-bg-white tw-text-sm  tw-p-4 tw-mb-5"
                                      >
                                        <div className="tw-col-span-4 ">
                                          <div className="tw-line-clamp-2"> {item.clubName}</div>
                                        </div>
                                        <div className="tw-col-span-2 tw-text-right">
                                          <button
                                            disabled
                                            className={`tw-w-[60px] tw-text-center tw-text-white tw-text-blue-800 tw-text-xs tw-font-medium tw-px-3 tw-py-2 tw-rounded ${
                                              item.isComplete ? 'tw-bg-gray-400' : 'tw-bg-blue-500'
                                            }`}
                                          >
                                            {item.isComplete ? '완료 ' : '미완료'}
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              <div className="tw-bg-gray-50 tw-rounded-md tw-h-[430px] tw-p-5 tw-text-black ">
                                <div className="tw-font-bold tw-text-base tw-pb-5">내가 풀어야 할 퀴즈</div>
                                {/* {isQuizFetched && (
                        {quizList.map((item,i)=> (
                          <div  key={item.id} className="tw-bg-white">
                          {item.clubName}
                    </div>
                              ))}
                      )} */}
                                <div className="tw-mb-5">
                                  {isQuizFetched && quizList.length > 0 ? (
                                    quizList.map((item, i) => (
                                      <div
                                        key={i}
                                        className="tw-flex tw-items-center tw-rounded-md tw-grid tw-grid-cols-6 tw-gap-0  tw-bg-white tw-text-sm  tw-p-4 tw-mb-5"
                                      >
                                        <div className="tw-col-span-5 tw-pr-3">
                                          <div className="tw-line-clamp-1"> {item.clubName}</div>
                                          <div className="tw-font-bold"> 3회차</div>
                                          <div className="tw-line-clamp-1"> Q. {item.quizContent}</div>
                                        </div>
                                        <div className="tw-col-span-1">
                                          <button
                                            onClick={() => router.push('/quiz/solution/' + `${item?.clubQuizSequence}`)}
                                            className="tw-text-center tw-bg-blue-500 tw-text-white tw-text-blue-800 tw-text-xs tw-font-medium tw-px-3 tw-py-2 tw-rounded"
                                          >
                                            GO {'>'}
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="tw-flex tw-items-center tw-rounded-md tw-gap-0  tw-bg-white tw-text-sm  tw-p-4 tw-mb-5">
                                      오늘은 풀어야 할 퀴즈가 없어요.
                                    </div>
                                  )}
                                </div>
                                <Stack spacing={2} className="tw-items-center">
                                  <_Pagination
                                    count={quizTotalPage}
                                    size="small"
                                    siblingCount={0}
                                    page={quizPage}
                                    renderItem={item => (
                                      <PaginationItem
                                        slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                        {...item}
                                      />
                                    )}
                                    onChange={handleChange}
                                  />
                                </Stack>
                                {/* <Pagination showCount={5} page={quizPage} setPage={setQuizPage} total={quizTotalPage} /> */}
                              </div>
                            </Grid>
                          </Grid>
                        </>
                      )}
                      {isContentFetched && active === 1 && (
                        <>
                          {courseData.map((course, index) => (
                            <div key={index} className="tw-pb-5">
                              <CourseCard key={index} data={course} />
                              <TableContainer>
                                <Table
                                  className={classes.table}
                                  aria-label="simple table"
                                  style={{ tableLayout: 'fixed' }}
                                >
                                  <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                                    <TableRow>
                                      <TableCell
                                        align="center"
                                        width={100}
                                        className={`${classes.sticky} ${classes.stickyFirst}`}
                                      >
                                        학생
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        width={120}
                                        className={`${classes.stickyBoard} ${classes.stickySecond}`}
                                      >
                                        학습현황
                                      </TableCell>

                                      {dateInfo.sessions.map((session, index) => (
                                        <TableCell key={index} width={100} align="right">
                                          <div>
                                            <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d] tw-left-[15px] tw-top-0">
                                              {session.number}
                                            </p>
                                            <p className="tw-w-full tw-h-3.5 tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2] tw-bottom-0">
                                              {session.date}
                                            </p>
                                          </div>
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {dateInfo.student.map((info, index) => (
                                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell
                                          align="center"
                                          width={100}
                                          component="th"
                                          scope="row"
                                          className={`${classes.stickyWhite} ${classes.stickyFirst}`}
                                        >
                                          <div className="tw-flex tw-items-center tw-gap-3">
                                            <img src="/assets/images/quiz/아그리파_1.png" alt="아그리파" />
                                            <div>test</div>
                                          </div>
                                        </TableCell>
                                        <TableCell
                                          align="center"
                                          width={120}
                                          component="th"
                                          scope="row"
                                          className={`${classes.stickyWhiteBoard} ${classes.stickySecond}`}
                                        >
                                          <div className="tw-grid tw-grid-cols-5 tw-gap-1 tw-justify-center tw-items-center">
                                            <div className="tw-col-span-3 progress tw-rounded tw-h-2 tw-p-0">
                                              <span style={{ width: `70%` }}>
                                                <span className="progress-line"></span>
                                              </span>
                                            </div>
                                            <div className="tw-col-span-2">5회</div>
                                          </div>
                                        </TableCell>
                                        {info.sessions.map((info, index) => (
                                          <TableCell
                                            padding="none"
                                            key={index}
                                            align="center"
                                            width={100}
                                            component="th"
                                            scope="row"
                                          >
                                            <div className="tw-h-12 tw-flex tw-justify-center tw-items-center">
                                              <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="tw-left-[-1px] tw-top-[-1px]"
                                                preserveAspectRatio="xMidYMid meet"
                                              >
                                                <circle
                                                  cx="10"
                                                  cy="10"
                                                  r="9.5"
                                                  fill={info.color}
                                                  stroke={info.borderColor || info.color}
                                                ></circle>
                                                <text
                                                  x="10" // x 좌표, 원의 중심
                                                  y="10" // y 좌표, 원의 중심을 약간 조정해야 할 수 있습니다
                                                  textAnchor="middle" // 텍스트를 x 좌표의 중앙에 정렬
                                                  dominantBaseline="central" // 텍스트를 y 좌표의 중앙에 정렬
                                                  fill="white" // 텍스트 색상
                                                  className="tw-text-xs tw-font-medium tw-text-center"
                                                >
                                                  {info.text}
                                                </text>
                                              </svg>
                                            </div>
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </div>
                          ))}
                        </>
                      )}
                      {isContentFetched && active === 2 && (
                        <div>
                          <TableContainer component={Paper} className=" tw-mb-5  tw-h-[400px]" elevation={0}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell align="center" sx={{ width: '28%' }}>
                                    클럽명
                                  </StyledTableCell>
                                  <StyledTableCell align="center">리더</StyledTableCell>
                                  <StyledTableCell align="center">참가자</StyledTableCell>
                                  <StyledTableCell align="center">학습시작일</StyledTableCell>
                                  <StyledTableCell align="center">학습주기</StyledTableCell>
                                  <StyledTableCell align="center">상세보기</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {contents.map(row => (
                                  <StyledTableRow key={row.clubName}>
                                    <StyledTableCell component="th" scope="row" align="center">
                                      {row.clubName}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.leaderNickname}</StyledTableCell>
                                    <StyledTableCell align="center">{row.recruitedMemberCount}</StyledTableCell>
                                    <StyledTableCell align="center">{row.startAt.split(' ')[0]}</StyledTableCell>
                                    <StyledTableCell align="center">
                                      {row.studyCycle.toString()},{row.studyWeekCount}회
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <span className="tw-bg-gray-300 tw-text-white tw-text-xs tw-font-medium tw-mr-2 tw-px-2.5 tw-py-3 tw-rounded">
                                        학습종료
                                      </span>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          {/* <Pagination count={totalPage} page={page} onChange={handleChange} /> */}
                          <Pagination page={page} setPage={setPage} total={totalPage} />
                        </div>
                      )}
                      {active === 4 && (
                        <div>
                          <div className="tw-grid tw-grid-cols-7 tw-gap-4  tw-h-[400px]">
                            {badgeContents.map((item, index) => (
                              <div key={index} className="tw-text-center">
                                <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
                                  <img
                                    className="tw-object-cover tw-h-15 "
                                    src={`${process.env.NEXT_PUBLIC_GENERAL_URL}/assets/images/badge/${item?.badgeId}.png`}
                                    alt=""
                                  />
                                </div>
                                <div className="tw-text-sm tw-text-black tw-font-bold">{item?.name}</div>
                                <div className="tw-text-sm tw-text-black tw-line-clamp-1">{item?.description}</div>
                                <div className="tw-text-sm tw-text-black">{item?.achievementAt?.split(' ')[0]}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </section>
              </div>
            </article>
          </div>
        </div>
      </Desktop>
      <Mobile>
        <div className={cx('seminar-container')}>
          <div className={cx('container')}>
            <div className="tw-py-[60px]">
              <div className="tw-text-[24px] tw-font-bold tw-text-black tw-text-center">나의 학습방</div>
              <div className="tw-text-[12px] tw-text-black tw-text-center tw-mb-10">
                나의 퀴즈클럽 진행사항을 한 눈에 보여주고 있어요!
              </div>
              <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
                <Grid item xs={6} justifyContent="center" className="tw-flex">
                  <button
                    onClick={() => (location.href = '/quiz-my')}
                    type="button"
                    className="tw-text-blue-600 tw-bg-white border border-primary tw-mr-3  tw-font-bold tw-rounded tw-text-sm tw-w-full tw-py-2.5 "
                  >
                    내가 만든 클럽 {'>'}
                  </button>
                </Grid>
                <Grid item xs={6} justifyContent="center" className="tw-flex">
                  <button
                    onClick={() => (location.href = '/quiz-make')}
                    type="button"
                    className="tw-text-blue-600 tw-bg-white border border-primary tw-font-bold tw-rounded tw-text-sm tw-w-full tw-py-2.5  "
                  >
                    내가 만든 퀴즈 {'>'}
                  </button>
                </Grid>
              </Grid>

              <Box sx={{ width: '100%', typography: 'body1', marginTop: '20px', marginBottom: '20px' }}>
                <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
                  <Grid item xs={12} className="tw-font-bold tw-text-3xl tw-text-black">
                    {/* <SecondTabs tabs={testBoards} /> */}

                    <div className={cx('filter-area')}>
                      <div className={cx('mentoring-button__group', 'tw-px-0', 'justify-content-center')}>
                        {studyStatus.map((item, i) => (
                          <ToggleLabel
                            key={item.id}
                            label={item.name}
                            name={item.name}
                            value={item.id}
                            variant="small"
                            checked={active === i}
                            isActive
                            type="tabButton"
                            onChange={() => {
                              setActive(i);
                              setContentType(item.id);
                              setParams({
                                ...params,
                                viewFilter: item.id,
                                page,
                              });
                              setPage(1);
                            }}
                            className={cx('tw-mr-2 !tw-w-[90px]')}
                          />
                        ))}
                        <ToggleLabel
                          label="배지보기"
                          name="배지보기"
                          value=""
                          variant="small"
                          checked={active === 4}
                          isActive
                          type="tabButton"
                          onChange={() => {
                            setActive(4);
                          }}
                          className={cx('tw-mr-2 !tw-w-[95px]')}
                        />
                        <ToggleLabel
                          label="나의 학습 캘린더"
                          name="나의 학습 캘린더"
                          value=""
                          variant="small"
                          checked={active === 5}
                          isActive
                          type="tabButton"
                          onChange={() => {
                            setActive(5);
                          }}
                          className={cx('tw-mt-3 tw-mr-2 !tw-w-[150px]')}
                        />
                        <ToggleLabel
                          label="내가 풀어야할 퀴즈"
                          name="내가 풀어야할 퀴즈"
                          value=""
                          variant="small"
                          checked={active === 6}
                          isActive
                          type="tabButton"
                          onChange={() => {
                            setActive(6);
                          }}
                          className={cx('tw-mr-2 !tw-w-[150px]')}
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Box>
              {isContentFetched && active === 0 && (
                <div>
                  <div className="tw-bg-[#f9f9f9] tw-text-black tw-p-7 tw-rounded-lg tw-text-base">
                    학습 예정 클럽정보
                  </div>
                  {contents.map((row, index) => (
                    <div key={index} className="tw-px-3 tw-pt-4">
                      <div className="tw-py-2 tw-text-black tw-font-bold tw-text-base">{row.clubName}</div>
                      <div className="tw-text-base">리더: {row.leaderNickname}</div>
                      <div className="tw-text-base">참가자: {row.recruitedMemberCount}명</div>
                      <div className="tw-text-base">학습시작예정: {row.startAt.split(' ')[0]}</div>
                      <div className="tw-grid tw-grid-cols-8 tw-gap-4">
                        <div className="tw-col-span-4 ">
                          <div className="tw-text-base">
                            학습주기: {row.studyCycle.toString()},{row.studyWeekCount}회
                          </div>
                          <div className="tw-text-base">학습횟수: {row.recruitedMemberCount}회</div>
                        </div>
                        <div className="tw-col-span-4 tw-flex tw-items-center tw-justify-end">
                          <span className="tw-bg-[#b8b8b8] tw-text-white tw-text-xs tw-font-medium tw-mr-2 tw-px-2.5 tw-py-3 tw-rounded tw-text-base">
                            {row.startAt.split(' ')[0].split('-')[1]}/{row.startAt.split(' ')[0].split('-')[2]} 오픈예정
                          </span>
                        </div>
                      </div>
                      <Divider className="tw-mb-6 tw-border tw-bg-['#efefef']" />
                    </div>
                  ))}
                </div>
              )}
              {isContentFetched && active === 1 && (
                <div>
                  <div className="tw-bg-[#f9f9f9] tw-text-black tw-p-7 tw-rounded-lg tw-text-base">
                    학습 중 클럽정보
                  </div>
                  {contents.map((row, index) => (
                    <div key={index} className="tw-px-3 tw-pt-4">
                      <div className="tw-py-2 tw-text-black tw-font-bold tw-text-base">{row.clubName}</div>
                      <div className="tw-text-base">리더: {row.leaderNickname}</div>
                      <div className="tw-text-base">참가자: {row.recruitedMemberCount}명</div>
                      <div className="tw-text-base">학습시작예정: {row.startAt.split(' ')[0]}</div>
                      <div className="tw-grid tw-grid-cols-8 tw-gap-4">
                        <div className="tw-col-span-4 ">
                          <div className="tw-text-base">
                            학습주기: {row.studyCycle.toString()},{row.studyWeekCount}회
                          </div>
                          <div className="tw-text-base">학습횟수: {row.recruitedMemberCount}회</div>
                          <div className="tw-text-base">학습현황: {parseInt(row.clubRunRate)}%</div>
                          <div className="tw-p-3 tw-pl-0">
                            <div className="progress tw-rounded tw-h-2 tw-p-0">
                              <span style={{ width: `${parseInt(row.clubRunRate)}%` }}>
                                <span className="progress-line"></span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="tw-col-span-4 tw-flex tw-items-center tw-justify-end">
                          <span
                            onClick={() => (location.href = '/quiz/' + `${row.clubSequence}`)}
                            className="tw-bg-blue-500 tw-text-white tw-text-xs tw-font-medium tw-mr-2 tw-px-2.5 tw-py-3 tw-rounded"
                          >
                            입장하기
                          </span>
                        </div>
                      </div>
                      <div className="tw-bg-gray-50 tw-rounded-md tw-p-5 tw-text-gray-400 tw-mb-3  tw-text-base">
                        <div>클럽생성일: {row.clubCreatedAt.split(' ')[0]}</div>
                        <div>클럽가입일: {row.clubJoinedAt.split(' ')[0]}</div>
                        <div>
                          학습횟수: {row.studyCount} / {row.studyTotalCount} 회
                        </div>
                      </div>
                      <Divider className="tw-mb-6 tw-border tw-bg-['#efefef']" />
                    </div>
                  ))}
                </div>
              )}
              {isContentFetched && active === 2 && (
                <div>
                  <div className="tw-bg-[#f9f9f9] tw-text-black tw-p-7 tw-rounded-lg tw-text-base">
                    학습 완료 클럽정보
                  </div>
                  {contents.map((row, index) => (
                    <div key={index} className="tw-px-3 tw-pt-4">
                      <div className="tw-py-2 tw-text-black tw-font-bold tw-text-base">{row.clubName}</div>
                      <div className="tw-text-base">리더: {row.leaderNickname}</div>
                      <div className="tw-text-base">참가자: {row.recruitedMemberCount}명</div>
                      <div className="tw-text-base">학습시작예정: {row.startAt.split(' ')[0]}</div>
                      <div className="tw-grid tw-grid-cols-8 tw-gap-4">
                        <div className="tw-col-span-4 ">
                          <div className="tw-text-base">
                            학습주기: {row.studyCycle.toString()},{row.studyWeekCount}회
                          </div>
                          <div className="tw-text-base">학습횟수: {row.recruitedMemberCount}회</div>
                        </div>
                        <div className="tw-col-span-4 tw-flex tw-items-center tw-justify-end">
                          <span className="tw-bg-[#b8b8b8] tw-text-white tw-text-xs tw-font-medium tw-mr-2 tw-px-2.5 tw-py-3 tw-rounded tw-text-base">
                            학습완료
                          </span>
                        </div>
                      </div>
                      <Divider className="tw-mb-6 tw-border tw-bg-['#efefef']" />
                    </div>
                  ))}
                </div>
              )}
              {active === 4 && (
                <div>
                  <div className="tw-grid tw-grid-cols-4 tw-gap-4">
                    {badgeContents.map((item, index) => (
                      <div key={index} className="tw-text-center">
                        <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
                          <img
                            className="tw-object-cover tw-h-15 "
                            src={`${process.env.NEXT_PUBLIC_GENERAL_URL}/assets/images/badge/${item?.badgeId}.png`}
                            alt=""
                          />
                        </div>
                        <div className="tw-text-sm tw-text-black tw-font-bold">{item?.name}</div>
                        <div className="tw-text-sm tw-text-black tw-line-clamp-1">{item?.description}</div>
                        <div className="tw-text-sm tw-text-black">{item?.achievementAt?.split(' ')[0]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {active === 5 && (
                <div>
                  <div className="tw-bg-gray-50 tw-rounded-md tw-h-[400px] tw-p-5 tw-text-black ">
                    <div className="tw-font-bold tw-text-base tw-pb-5">나의 학습 캘린더</div>
                    <div className="tw-bg-white">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                          onMonthChange={handleMonthChange}
                          onChange={handleDayChange}
                          showDaysOutsideCurrentMonth
                          slots={{
                            day: ServerDay,
                          }}
                          slotProps={{
                            day: {
                              highlightedDays,
                            } as any,
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  {quizStatusList.length > 0 && (
                    <div className="tw-bg-gray-50 tw-rounded-md tw-p-5 tw-text-black ">
                      <div className="tw-font-bold tw-text-base tw-pb-5">퀴즈 상태</div>
                      {quizStatusList.map((item, i) => {
                        return (
                          // TODO API Response 보고 댓글 작성자로 수정 필요
                          <div
                            key={i}
                            className="tw-flex tw-items-center tw-rounded-md tw-grid tw-grid-cols-6 tw-gap-0  tw-bg-white tw-text-sm  tw-p-4 tw-mb-5"
                          >
                            <div className="tw-col-span-4 ">
                              <div className="tw-line-clamp-2"> {item.clubName}</div>
                            </div>
                            <div className="tw-col-span-2 tw-text-right">
                              <button
                                disabled
                                className={`tw-w-[60px] tw-text-center tw-text-white tw-text-blue-800 tw-text-xs tw-font-medium tw-px-3 tw-py-2 tw-rounded ${
                                  item.isComplete ? 'tw-bg-gray-400' : 'tw-bg-blue-500'
                                }`}
                              >
                                {item.isComplete ? '완료 ' : '미완료'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {active === 6 && (
                <div className="tw-bg-gray-50 tw-rounded-md tw-h-[430px] tw-p-5 tw-text-black ">
                  <div className="tw-font-bold tw-text-base tw-pb-5">내가 풀어야 할 퀴즈</div>
                  <div className="tw-mb-5">
                    {isQuizFetched && quizList.length > 0 ? (
                      quizList.map((item, i) => (
                        <div
                          key={i}
                          className="tw-flex tw-items-center tw-rounded-md tw-grid tw-grid-cols-6 tw-gap-0  tw-bg-white tw-text-sm  tw-p-4 tw-mb-5"
                        >
                          <div className="tw-col-span-5 tw-pr-3">
                            <div className="tw-line-clamp-1"> {item.clubName}</div>
                            <div className="tw-font-bold"> 3회차</div>
                            <div className="tw-line-clamp-1"> Q. {item.quizContent}</div>
                          </div>
                          <div className="tw-col-span-1">
                            <button
                              onClick={() => router.push('/quiz/solution/' + `${item?.clubQuizSequence}`)}
                              className="tw-text-center tw-bg-blue-500 tw-text-white tw-text-blue-800 tw-text-xs tw-font-medium tw-px-3 tw-py-2 tw-rounded"
                            >
                              GO {'>'}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="tw-flex tw-items-center tw-rounded-md tw-gap-0  tw-bg-white tw-text-sm  tw-p-4 tw-mb-5">
                        오늘은 풀어야 할 퀴즈가 없어요.
                      </div>
                    )}
                  </div>
                  <Stack spacing={2} className="tw-items-center">
                    <_Pagination
                      count={quizTotalPage}
                      size="small"
                      siblingCount={0}
                      page={quizPage}
                      renderItem={item => (
                        <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                      )}
                      onChange={handleChange}
                    />
                  </Stack>
                </div>
              )}
            </div>
          </div>
        </div>
      </Mobile>
    </>
  );
}

export default StudyRoomTemplate;
