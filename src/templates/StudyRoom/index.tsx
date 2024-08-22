import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { ToggleLabel, Pagination, Typography, Chip, ClubCard, CourseCard } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import {
  useStudyRoomList,
  useStudyReminder,
  useStudyQuizList,
  useStudyProgress,
  useStudyQuizCalendarList,
  useStudyQuizBadgeList,
} from 'src/services/studyroom/studyroom.queries';
import { useMyQuiz, useMyQuizContents } from 'src/services/jobs/jobs.queries';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import Divider from '@mui/material/Divider';

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
import { Desktop, Mobile } from 'src/hooks/mediaQuery';

/** table */
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArticleList from 'src/stories/components/ArticleList';
import { UseQueryResult } from 'react-query';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  sticky: {
    position: 'sticky',
    backgroundColor: '#fff !important',
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
  },
  stickySecond: {
    left: 140, // 이 값을 `Dessert` 열의 너비에 맞게 조정하세요.
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
    top: '0%',
    marginTop: '10px',
    width: '100%',
    // right: '50%',
    left: '-35px',
    pointerEvents: 'none', // Make the element non-interactive
    textAlign: 'center', // Center align text horizontally
    marginLeft: 'auto', // Automatically adjust left margin
    marginRight: 'auto', // Automatically adjust right margin
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
    name: '내가 푼 퀴즈',
  },
  {
    id: '0004',
    name: '저장한 지식콘텐츠',
  },
];

export function StudyRoomTemplate() {
  const router = useRouter();
  const [badgePage, setBadgePage] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [viewFilter, setViewFilter] = useState('0002');
  const [clubViewFilter, setClubViewFilter] = useState('');
  const [params, setParams] = useState<any>({ page, clubViewFilter: '' });
  // completed-quizzes
  const [quizSortType, setQuizSortType] = useState('ASC');
  const [quizPage, setQuizPage] = useState(1);
  const [quizTotalPage, setQuizTotalPage] = useState(1);
  const [quizParams, setQuizParams] = useState<any>({ quizPage });
  /**progress */
  const [progressPage, setProgressPage] = useState(1);
  const [progressTotalPage, setProgressTotalPage] = useState(1);
  const [progressClubViewFilter, setProgressClubViewFilter] = useState('');
  const [progressParams, setProgressParams] = useState<any>({
    page: progressPage,
    clubViewFilter: progressClubViewFilter,
  });
  /**content */
  const [sortType, setSortType] = useState('ASC');
  const [contentPage, setContentPage] = useState(1);
  const [contentTotalPage, setContentTotalPage] = useState(1);
  const [contentParams, setContentParams] = useState<any>({
    page: contentPage,
    sortType: sortType,
  });

  /**badge */
  const [badgeClubViewFilter, setBadgeClubViewFilter] = useState('0001');
  const [badgeParams, setBadgeParams] = useState<any>({ page: badgePage, isAchieved: true });
  const [contents, setContents] = useState<any[]>([]);
  const [progressContents, setProgressContents] = useState<any[]>([]);
  const [reminderContents, setReminderContents] = useState<any[]>([]);
  const [badgeContents, setBadgeContents] = useState<any[]>([]);
  const [quizList, setQuizList] = useState<any[]>([]);
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  const [value, onChange] = useState<Date>(new Date());

  const handleChangeQuiz = event => {
    setClubViewFilter(event.target.value);
  };
  const handleChangeSortType = event => {
    setSortType(event.target.value);
  };
  const handleChangeQuizSortType = event => {
    setQuizSortType(event.target.value);
  };
  const handleChangeQuizProcessType = event => {
    setProgressClubViewFilter(event.target.value);
  };
  const handleChangeBadgeSortType = event => {
    setBadgeClubViewFilter(event.target.value);
  };

  /**calendar param */
  const [calendarYearMonth, setCalendarYearMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));
  const [highlightedDays, setHighlightedDays] = React.useState([]); // 년월일 형식의 문자열로 변경
  const [calendarList, setCalendarList] = React.useState([]);
  const [quizStatusList, setQuizStatusList] = React.useState([]);
  const [calendarParams, setCalendarParams] = useState<any>({ calendarYearMonth });

  const [expandedItems, setExpandedItems] = useState(() => Array(quizList?.length || 0).fill(false));

  const classes = useStyles();

  function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: string[] }) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
    const isSelected = highlightedDays.some(item => item.date === props.day.format('YYYY-MM-DD'));
    const count = highlightedDays.find(item => item.date === props.day.format('YYYY-MM-DD'))?.count || 0;

    const dots = Array.from({ length: count }, (_, index) => (
      <span key={index} className="tw-font-bold tw-text-2xl tw-text-red-500 tw-h-[10px]">
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

  // 학습방 리스트
  const { isFetched: isContentFetched, refetch: refetch } = useStudyRoomList(params, data => {
    console.log(data);
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPages);
  });

  // 리바인드 리스트
  const { isFetched: isReminderFetched, refetch: refetchReminder } = useStudyReminder(quizParams, data => {
    console.log(data);
    setReminderContents(data.data || []);
    setQuizTotalPage(data.data.totalPages);
  });

  // 나의학습내역
  const { isFetched: isProgressFetched, refetch: refetchProgress } = useStudyProgress(progressParams, data => {
    console.log('refetchProgress', data.data.contents);
    setProgressContents(data.data.contents || []);
    setProgressTotalPage(data.data.totalPages);
  });

  // 내가푼 퀴즈
  const { isFetched: isQuizFetched, refetch: QuizRefetch } = useStudyQuizList(quizParams, data => {
    console.log(data);
    setQuizList(data.data.contents || []);
    setQuizTotalPage(data.data.totalPages);
  });

  //지식컨텐츠
  const { data: myQuizContentData, refetch: refetchMyQuizContent }: UseQueryResult<any> = useMyQuizContents(
    contentParams,
    data => {
      console.log(data.contents);
      setContentTotalPage(data.totalPages);
    },
  );

  const { isFetched: isQuizCalendarFetched, refetch: QuizRefetchCalendar } = useStudyQuizCalendarList(
    calendarParams,
    data => {
      const newData = data?.map(item => ({
        date: item.date,
        count: Math.min(item.clubs.length, 3), // Limit to a maximum of 3
      }));
      setCalendarList(data);
      setHighlightedDays(newData);

      const todayDate = moment().format('YYYY-MM-DD'); // 오늘 날짜 가져오기
      // 해당 날짜의 clubs 리스트 찾기
      const clubsForTargetDate = data?.find(item => item.date === todayDate)?.clubs || [];
      setQuizStatusList(clubsForTargetDate);
    },
  );

  const toggleExpand = index => {
    setExpandedItems(prev => {
      const newExpandedItems = [...prev];
      newExpandedItems[index] = !newExpandedItems[index];
      return newExpandedItems;
    });
  };

  const { isFetched: isQuizbadgeFetched, refetch: QuizRefetchBadge } = useStudyQuizBadgeList(badgeParams, data => {
    setBadgeContents(data.data.contents);
  });

  useEffect(() => {
    setParams({
      page,
      clubViewFilter: clubViewFilter,
    });
  }, [page, clubViewFilter]);

  useEffect(() => {
    setProgressParams({
      page: progressPage,
      clubViewFilter: progressClubViewFilter,
    });
  }, [progressPage, progressClubViewFilter]);

  useEffect(() => {
    setQuizParams({
      page: quizPage,
    });
  }, [quizPage]);

  useEffect(() => {
    setQuizParams({
      page: quizPage,
      sortType: quizSortType,
    });
  }, [quizPage, quizSortType]);

  useEffect(() => {
    setContentParams({
      page: contentPage,
      sortType: sortType,
    });
  }, [contentPage, sortType]);

  useEffect(() => {
    //console.log(calendarYearMonth);
    setCalendarParams({ calendarYearMonth });
  }, [calendarYearMonth]);

  const handleMonthChange = (date: Dayjs) => {
    // Extract year and month in 'YYYY-MM' format
    const yearMonth = date.format('YYYY-MM');
    setCalendarYearMonth(yearMonth);
  };
  const handleDayChange = (date: Dayjs) => {
    // Extract year and month in 'YYYY-MM' format
    const yearMonth = date.format('YYYY-MM-DD');
    console.log(yearMonth);

    // 해당 날짜의 clubs 리스트 찾기
    const clubsForTargetDate = calendarList.find(item => item.date === yearMonth)?.clubs || [];
    setQuizStatusList(clubsForTargetDate);
  };
  return (
    <>
      <div className={cx('seminar-container')}>
        <div className={cx('container')}>
          <div className="tw-py-[60px]">
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black max-lg:!tw-text-base">
                나의 학습방
              </Grid>
              <Grid item xs={10} className="max-lg:tw-p-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-sm">
                나의 퀴즈클럽 진행사항을 한 눈에 보여주고 있어요!
              </Grid>
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
                          // setParams({
                          //   ...params,
                          //   clubViewFilter: item.id,
                          //   page,
                          // });
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
                              value={clubViewFilter}
                              onChange={handleChangeQuiz}
                              row
                            >
                              <p className="tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] tw-mb-1">
                                정렬 :
                              </p>
                              <FormControlLabel
                                value=""
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
                                    전체
                                  </p>
                                }
                              />
                              <FormControlLabel
                                value="0002"
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
                                    진행중
                                  </p>
                                }
                              />
                              <FormControlLabel
                                value="0001"
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
                                    학습 예정
                                  </p>
                                }
                              />
                              <FormControlLabel
                                value="0003"
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
                                    학습 완료
                                  </p>
                                }
                              />
                            </RadioGroup>

                            <div className="tw-py-4 ">
                              {isContentFetched &&
                                contents.map((course, index) => (
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
                            <div className="tw-bg-gray-50 tw-rounded-t-lg tw-w-[360px] tw-p-5 tw-text-black ">
                              <div className="tw-font-bold tw-text-base tw-pb-5">나의 학습 캘린더</div>
                              <div className="tw-bg-white tw-pb-1 tw-rounded-lg">
                                <div>
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
                                {quizStatusList.length > 0 && (
                                  <div className="tw-bg-white border border-danger tw-mb-5 tw-mx-5 tw-p-3 tw-rounded-lg">
                                    {quizStatusList.map((item, i) => (
                                      <div key={i}>
                                        <div
                                          className={`tw-text-sm ${
                                            item.isComplete ? 'tw-text-gray-500' : 'tw-text-red-500'
                                          }`}
                                        >
                                          {item.clubName} | Q{item.order} | {item.isComplete ? '완료' : '미완료'}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="tw-bg-gray-50   tw-w-[360px] tw-px-5 tw-pb-5 tw-text-black ">
                              <div className="tw-font-bold tw-text-base tw-pb-5">오늘 풀어야 할 퀴즈</div>
                              <div className="tw-mb-5">
                                {reminderContents?.todayQuizzes?.length > 0 ? (
                                  reminderContents.todayQuizzes?.map((item, i) => (
                                    <div
                                      key={i}
                                      className="tw-flex tw-items-center tw-rounded-md tw-bg-white tw-text-sm tw-p-4 tw-mb-5"
                                    >
                                      <div className="tw-flex-grow tw-pr-3">
                                        <div className="tw-line-clamp-1 tw-font-bold tw-mb-1">
                                          {item.clubName} [{item.order}회]
                                        </div>
                                        <div className="tw-line-clamp-1">Q. {item.question}</div>
                                      </div>
                                      <div>
                                        <button
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
                                          className="tw-text-center tw-bg-red-500 tw-text-white tw-text-xs tw-font-medium tw-w-10 tw-py-1 tw-rounded"
                                        >
                                          GO {'>'}
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="tw-flex tw-items-center tw-rounded-md tw-bg-white tw-text-sm tw-p-4 tw-mb-5">
                                    오늘은 풀어야 할 퀴즈가 없어요.
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className=" tw-w-[360px] tw-rounded-b-lg tw-bg-gray-50 tw-px-5 tw-pb-5 tw-text-black ">
                              <div className="tw-font-bold tw-text-base tw-pb-5">밀린퀴즈</div>
                              <div className="tw-mb-5">
                                {reminderContents?.delayedQuizzes?.length > 0 ? (
                                  reminderContents?.delayedQuizzes?.map((item, i) => (
                                    <div
                                      key={i}
                                      className="tw-flex tw-items-center tw-rounded-md tw-bg-white tw-text-sm tw-p-4 tw-mb-5"
                                    >
                                      <div className="tw-flex-grow tw-pr-3">
                                        <div className="tw-line-clamp-1 tw-font-bold tw-mb-1">
                                          {item.clubName} [{item.order}회]
                                        </div>
                                        <div className="tw-line-clamp-1">Q. {item.question}</div>
                                      </div>
                                      <div>
                                        <button
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
                                          className="tw-text-center tw-bg-red-500 tw-text-white tw-text-xs tw-font-medium tw-w-10 tw-py-1 tw-rounded"
                                        >
                                          GO {'>'}
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="tw-flex tw-items-center tw-rounded-md tw-bg-white tw-text-sm tw-p-4 tw-mb-5">
                                    오늘은 풀어야 할 퀴즈가 없어요.
                                  </div>
                                )}
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {/* 나의 학습내역 */}
                    {isContentFetched && active === 1 && (
                      <>
                        <RadioGroup
                          className="tw-items-center tw-pb-5 tw-gap-3"
                          value={progressClubViewFilter}
                          onChange={handleChangeQuizProcessType}
                          row
                        >
                          <p className="tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] tw-mb-1">
                            정렬 :
                          </p>
                          <FormControlLabel
                            value=""
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
                                전체
                              </p>
                            }
                          />
                          <FormControlLabel
                            value="0002"
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
                                진행중
                              </p>
                            }
                          />
                          <FormControlLabel
                            value="0003"
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
                                학습 완료
                              </p>
                            }
                          />
                        </RadioGroup>
                        <div className="tw-pb-5">
                          {/* <CourseCard key={index} data={course} /> */}

                          {isProgressFetched ? (
                            progressContents && progressContents.length > 0 ? (
                              progressContents.map((course, index) => (
                                <div key={index} className="tw-pb-5">
                                  <CourseCard key={index} data={course.club} border={true} />
                                  <TableContainer className="border tw-rounded-b-lg">
                                    <Table
                                      className={classes.table}
                                      aria-label="simple table"
                                      style={{ tableLayout: 'fixed' }}
                                    >
                                      <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                                        <TableRow>
                                          <TableCell
                                            align="center"
                                            width={140}
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

                                          {course.schedules.map((session, index) => (
                                            <TableCell key={index} width={100} align="right">
                                              <div>
                                                <p className="tw-pb-1 tw-text-sm tw-font-bold tw-text-center tw-text-[#31343d] tw-left-[15px] tw-top-0">
                                                  {session.order}회
                                                </p>
                                                <p className="tw-w-full tw-h-3.5 tw-text-sm tw-font-medium tw-text-center tw-text-[#9ca5b2] tw-bottom-0">
                                                  {session.publishDate ? (
                                                    <>
                                                      {moment(session.publishDate).format('MM-DD')} ({session.dayOfWeek}
                                                      )
                                                    </>
                                                  ) : null}
                                                </p>
                                              </div>
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        <TableRow
                                          key={index}
                                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                          <TableCell
                                            align="center"
                                            component="th"
                                            scope="row"
                                            className={`${classes.stickyWhite} ${classes.stickyFirst}`}
                                          >
                                            <div className="tw-flex tw-items-center tw-gap-3 ">
                                              <img
                                                src={
                                                  course?.participantProgress?.member?.profileImageUrl ||
                                                  '/assets/images/account/default_profile_image.png'
                                                }
                                                className="tw-w-9 tw-h-9 tw-rounded-full border"
                                                alt="아그리파"
                                              />
                                              <div>{course.participantProgress.member.nickname}</div>
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
                                                <span
                                                  style={{
                                                    width: `${
                                                      ((course?.participantProgress?.studyCount || 0) /
                                                        (course?.participantProgress?.totalStudyCount || 0)) *
                                                      100
                                                    }%`,
                                                  }}
                                                >
                                                  <span className="progress-line"></span>
                                                </span>
                                              </div>
                                              <div className="tw-col-span-2">
                                                {course.participantProgress.studyCount}회
                                              </div>
                                            </div>
                                          </TableCell>
                                          {course.participantProgress.results.map((info, index) => {
                                            let borderColor = '';
                                            let color = '';
                                            let text = '';

                                            switch (info.status) {
                                              case '0003':
                                                borderColor = '#31343D';
                                                color = '#31343D';
                                                text = 'v';
                                                break;
                                              case '0001':
                                                borderColor = '#E0E4EB';
                                                color = '#f6f7fb';
                                                text = ' ';
                                                break;
                                              case '0002':
                                                borderColor = '#E11837';
                                                color = 'white';
                                                text = '?';
                                                break;
                                            }

                                            return (
                                              <TableCell
                                                padding="none"
                                                key={index}
                                                align="center"
                                                width={100}
                                                component="th"
                                                scope="row"
                                              >
                                                <div className="tw-h-10 tw-flex tw-justify-center tw-items-center">
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
                                                      fill={color}
                                                      stroke={borderColor}
                                                    ></circle>
                                                    <text
                                                      x="10"
                                                      y="10"
                                                      textAnchor="middle"
                                                      dominantBaseline="central"
                                                      fill="white"
                                                      className="tw-text-xs tw-font-medium tw-text-center"
                                                    >
                                                      {text}
                                                    </text>
                                                  </svg>
                                                </div>
                                                <div className="tw-text-sm tw-text-gray-300">
                                                  {info.publishDate
                                                    ? info.status === '0001'
                                                      ? 'D-' + info.relativeDaysToPublishDate
                                                      : moment(info.publishDate).format('MM-DD')
                                                    : null}
                                                </div>
                                              </TableCell>
                                            );
                                          })}
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </div>
                              ))
                            ) : (
                              <section className="tw-text-center tw-h-[200px] tw-flex tw-items-center tw-justify-center tw-text-[#9ca5b2]">
                                데이터가 없습니다.
                              </section>
                            )
                          ) : null}
                        </div>
                        <Pagination page={progressPage} setPage={setProgressPage} total={progressTotalPage} />
                      </>
                    )}
                    {isContentFetched && active === 2 && (
                      <div className="">
                        <RadioGroup
                          className="tw-items-center tw-pb-5 tw-gap-3"
                          value={quizSortType}
                          onChange={handleChangeQuizSortType}
                          row
                        >
                          <p className="tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] tw-mb-1">
                            정렬 :
                          </p>
                          <FormControlLabel
                            value="ASC"
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
                            value="DESC"
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
                                오래된순
                              </p>
                            }
                          />
                        </RadioGroup>
                        {quizList.length === 0 && (
                          <section className="tw-text-center tw-h-[200px] tw-flex tw-items-center tw-justify-center tw-text-[#9ca5b2]">
                            데이터가 없습니다.
                          </section>
                        )}
                        {quizList.map((item, index) => (
                          <div key={index} className="tw-pb-7 tw-text-black tw-text-sm">
                            <div className="tw-pb-3">
                              <span className="tw-text-sm tw-font-bold">{item?.clubName} </span>
                              <span className="tw-text-sm">{item?.clubDescription}</span>
                            </div>
                            <Grid item xs={12} sm={12}>
                              <div className="tw-rounded-xl">
                                <div
                                  className={`tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1   ${
                                    item?.answer ? 'tw-rounded-tl-xl tw-rounded-tr-xl' : 'tw-rounded-xl'
                                  }`}
                                >
                                  <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                    <img
                                      className="tw-w-10 tw-h-10 border tw-rounded-full"
                                      src={
                                        item?.quiz?.maker?.profileImageUrl ||
                                        '/assets/images/account/default_profile_image.png'
                                      }
                                    />
                                    <div className="tw-text-xs tw-text-left tw-text-black">
                                      {item?.quiz?.maker?.nickname}
                                    </div>
                                  </div>
                                  <div className="tw-flex-auto tw-px-5 tw-w-10/12">
                                    <div className="tw-font-medium tw-text-black">{item?.quiz?.question}</div>
                                  </div>
                                  <div className="tw-flex-auto">
                                    <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                      <button
                                        onClick={() => {
                                          window.open(item?.quiz?.contentUrl, '_blank'); // data?.articleUrl을 새 탭으로 열기
                                        }}
                                        className="tw-bg-black tw-p-1.5 tw-text-white tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                      >
                                        지식컨텐츠 보기
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="border border-secondary tw-bg-white tw-flex tw-items-center tw-p-4  tw-py-3 tw-rounded-bl-xl tw-rounded-br-xl">
                                  <div className="tw-w-0.5/12 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                                  <div className="tw-w-1/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                    <img
                                      className="border tw-rounded-full tw-w-10 tw-h-10 "
                                      src={
                                        item?.member?.profileImageUrl ||
                                        '/assets/images/account/default_profile_image.png'
                                      }
                                    />
                                    <div className="tw-text-xs tw-text-left tw-text-black">
                                      {item?.member?.nickname}
                                    </div>
                                  </div>
                                  <div className="tw-flex-auto tw-w-1/12 tw-px-0 tw-text-center">
                                    <div className="tw-font-medium tw-text-black tw-text-sm">최종답변</div>
                                  </div>
                                  <div className="tw-flex-auto tw-w-11/12 tw-px-5">
                                    <div
                                      className={`tw-font-medium tw-text-[#9ca5b2] tw-text-sm ${
                                        !expandedItems[index] ? 'tw-line-clamp-2' : ''
                                      }`}
                                    >
                                      {item?.answer}
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
                          </div>
                        ))}
                        <Pagination page={quizPage} setPage={setPage} total={totalPage} />
                      </div>
                    )}
                    {active === 3 && (
                      <div>
                        <RadioGroup
                          className="tw-items-center tw-pb-5 tw-gap-3"
                          value={sortType}
                          onChange={handleChangeSortType}
                          row
                        >
                          <p className="tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] tw-mb-1">
                            정렬 :
                          </p>
                          <FormControlLabel
                            value="ASC"
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
                            value="DESC"
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
                                오래된순
                              </p>
                            }
                          />
                        </RadioGroup>

                        {myQuizContentData?.contents?.length === 0 && (
                          <section className="tw-text-center tw-h-[200px] tw-flex tw-items-center tw-justify-center tw-text-[#9ca5b2]">
                            데이터가 없습니다.
                          </section>
                        )}
                        {myQuizContentData?.contents?.map((data, index) => (
                          <div key={index}>
                            <ArticleList data={data} refetchMyQuizContent={refetchMyQuizContent} />
                          </div>
                        ))}

                        <div className="tw-py-4">
                          <Pagination page={contentPage} setPage={setContentPage} total={contentTotalPage} />
                        </div>
                      </div>
                    )}
                    {active === 4 && (
                      <div>
                        <RadioGroup
                          className="tw-items-center tw-pb-5 tw-gap-3"
                          value={badgeClubViewFilter}
                          onChange={handleChangeBadgeSortType}
                          row
                        >
                          <p className="tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] tw-mb-1">
                            정렬 :
                          </p>
                          <FormControlLabel
                            value="0001"
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
                            value="0002"
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
                                오래된순
                              </p>
                            }
                          />
                          <FormControlLabel
                            value="0003"
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
                                획득한 배지만 보기
                              </p>
                            }
                          />
                        </RadioGroup>
                        <div className="tw-mb-4 tw-bg-gray-100 tw-rounded-lg tw-p-4 tw-font-bold tw-text-black tw-text-sm">
                          성장을 위한 활동을 통해 얻는 실행력 배지들을 모아보세요.
                        </div>
                        <div className="tw-grid tw-grid-cols-10 tw-gap-4">
                          {badgeContents?.contents?.length === 0 && (
                            <section className="tw-text-center tw-h-[200px] tw-flex tw-items-center tw-justify-center tw-text-[#9ca5b2]">
                              데이터가 없습니다.
                            </section>
                          )}
                          {badgeContents.map((item, index) => (
                            <div key={index} className="tw-text-center">
                              <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
                                <img
                                  className="tw-object-cover tw-h-[70px] tw-w-[70px]"
                                  src={`${process.env.NEXT_PUBLIC_GENERAL_URL}/assets/images/badge/${item?.badgeId}.png`}
                                  alt=""
                                />
                              </div>
                              <div className="tw-text-sm tw-text-black tw-font-bold  tw-line-clamp-1">{item?.name}</div>
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
    </>
  );
}

export default StudyRoomTemplate;
