import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Typography, Chip, ClubCard } from 'src/stories/components';
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
import { makeStyles } from '@material-ui/core/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

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

const studyStatus = [
  {
    id: '0001',
    name: '학습 예정',
  },
  {
    id: '0002',
    name: '학습 중',
  },
  {
    id: '0003',
    name: '학습 완료',
  },
];

const useStyles = makeStyles(theme => ({
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

export function StudyRoomTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();
  const { logged } = useSessionStore.getState();
  const router = useRouter();
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [skillIdsClk, setSkillIdsClk] = useState<any[]>([1, 2, 3, 4, 5]);
  const [page, setPage] = useState(1);
  const [badgePage, setBadgePage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [quizPage, setQuizPage] = useState(1);
  const [quizTotalPage, setQuizTotalPage] = useState(1);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);
  const [viewFilter, setViewFilter] = useState('0001');
  const [params, setParams] = useState<paramProps>({ page, viewFilter });
  const [quizParams, setQuizParams] = useState<paramProps>({ page });
  const [badgeParams, setBadgeParams] = useState<paramProps>({ page: badgePage, isAchieved: true });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [badgeContents, setBadgeContents] = useState<RecommendContent[]>([]);
  const [quizList, setQuizList] = useState<RecommendContent[]>([]);
  const [images, setSeminarImages] = useState<any[]>([]);
  const [recommendJobGroup, setRecommendJobGroup] = useState<any[]>([]);
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [jobGroup, setJobGroup] = useState([]);
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));
  const [recommendLevels, setRecommendLevels] = useState([]);
  let [isLiked, setIsLiked] = useState(false);
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();
  const [value, onChange] = useState<Date>(new Date());
  const day = moment(value).format('YYYY-MM-DD');
  const currDate = new Date();
  const currDateTime = moment(currDate).format('MM-DD');
  const [open, setOpen] = React.useState(false);

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
    console.log(calendarYearMonth);
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
          <StyledTableCell style={{ padding: 8 }}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8, fontWeight: 600 }}>{row.clubName}</StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="right">
            {row.leaderNickname}
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="right">
            {row.recruitedMemberCount}
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="right">
            {row.startAt.split(' ')[0]}
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="right">
            {row.studyWeekCount}회
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="right">
            <div className="progress tw-rounded tw-h-2 tw-p-0">
              <span style={{ width: `${parseInt(row.clubRunRate)}%` }}>
                <span className="progress-line"></span>
              </span>
            </div>
          </StyledTableCell>
          <StyledTableCell style={{ padding: 8 }} align="right">
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
    console.log(yearMonth, clubsForTargetDate);
    setQuizStatusList(clubsForTargetDate);
    // setCalendarYearMonth(yearMonth);
  };

  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black max-lg:!tw-text-base">
              나의 학습방
            </Grid>
            <Grid item xs={6} className="max-lg:tw-p-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-sm">
              나의 퀴즈클럽 진행사항을 한 눈에 보여주고 있어요!
            </Grid>
            <Grid item xs={4} justifyContent="flex-end" className="tw-flex">
              <button
                onClick={() => (location.href = '/quiz-my')}
                type="button"
                className="tw-text-white tw-bg-blue-500 tw-mr-3 tw-focus:ring-4  tw-font-medium tw-rounded tw-text-sm tw-px-5 tw-py-2.5 "
              >
                내가 만든 클럽 {'>'}
              </button>
              <button
                onClick={() => (location.href = '/quiz-make')}
                type="button"
                className="tw-text-white tw-bg-gray-400  tw-focus:ring-4  tw-font-medium tw-rounded tw-text-sm tw-px-5 tw-py-2.5  "
              >
                내가 만든 퀴즈 관리하기 {'>'}
              </button>
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
                    <Toggle
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
                      className={cx('fixed-width', 'tw-mr-4', 'max-lg:!tw-hidden')}
                    />
                  ))}
                  <Toggle
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
                <Grid item xs={8}>
                  {isContentFetched && active === 0 && (
                    <div>
                      <TableContainer component={Paper} className=" tw-mb-5" elevation={0}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>클럽명</StyledTableCell>
                              <StyledTableCell align="right">리더</StyledTableCell>
                              <StyledTableCell align="right">참가자</StyledTableCell>
                              <StyledTableCell align="right">학습시작일</StyledTableCell>
                              <StyledTableCell align="right">학습주기</StyledTableCell>
                              <StyledTableCell align="right">상세보기</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {contents.map(row => (
                              <StyledTableRow key={row.clubName}>
                                <StyledTableCell component="th" scope="row">
                                  {row.clubName}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row.leaderNickname}</StyledTableCell>
                                <StyledTableCell align="right">{row.recruitedMemberCount}</StyledTableCell>
                                <StyledTableCell align="right">{row.startAt.split(' ')[0]}</StyledTableCell>
                                <StyledTableCell align="right">
                                  {row.studyCycle.toString()},{row.studyWeekCount}회
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  <span className="tw-bg-gray-300 tw-text-white tw-text-xs tw-font-medium tw-mr-2 tw-px-2.5 tw-py-3 tw-rounded">
                                    오픈예정
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
                  {isContentFetched && active === 1 && (
                    <TableContainer component={Paper} className=" tw-mb-5" elevation={0}>
                      <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell>클럽명</StyledTableCell>
                            <StyledTableCell align="right">리더</StyledTableCell>
                            <StyledTableCell align="right">참가자</StyledTableCell>
                            <StyledTableCell align="right">학습시작일</StyledTableCell>
                            <StyledTableCell align="right">학습주기</StyledTableCell>
                            <StyledTableCell align="right">학습현황</StyledTableCell>
                            <StyledTableCell align="right">상세보기</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {contents.map(row => (
                            <Row key={row.clubName} row={row} />
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  {active === 4 && (
                    <div>
                      <div className="tw-grid tw-grid-cols-7 tw-gap-4">
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
                <Grid item xs={4}>
                  <div className="tw-bg-gray-50 tw-rounded-md tw-h-[400px] tw-p-5 tw-text-black ">
                    <div className="tw-font-bold tw-text-base tw-pb-5">나의 학습 갤린더</div>
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
                              <div> {item.clubName}</div>
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
                      {isQuizFetched &&
                        quizList.map((item, i) => (
                          <div
                            key={i}
                            className="tw-flex tw-items-center tw-rounded-md tw-grid tw-grid-cols-6 tw-gap-0  tw-bg-white tw-text-sm  tw-p-4 tw-mb-5"
                          >
                            <div className="tw-col-span-5 ">
                              <div> {item.clubName}</div>
                              <div className="tw-font-bold"> 3회차</div>
                              <div> Q. {item.quizContent}</div>
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
                        ))}
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
                    {/* <Pagination showCount={5} page={quizPage} setPage={setQuizPage} total={quizTotalPage} /> */}
                  </div>
                </Grid>
              </Grid>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}

export default StudyRoomTemplate;
