import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Typography, Chip, ClubCard } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import {
  useStudyRoomList,
  paramProps,
  useSeminarImageList,
  useStudyQuizList,
} from 'src/services/studyroom/studyroom.queries';
import QuizArticleCard from 'src/stories/components/QuizArticleCard';
import Carousel from 'nuka-carousel';
import { ArticleEnum } from '../../config/types';
import { useContentJobTypes, useContentTypes, useJobGroups } from 'src/services/code/code.queries';
import Banner from '../../stories/components/Banner';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/system/Box';
import Divider from '@mui/material/Divider';
import { useSessionStore } from 'src/store/session';
import { useDeleteLike, useSaveLike } from 'src/services/community/community.mutations';
import { styled } from '@mui/material/styles';
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

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // css import
import moment from 'moment';

// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

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

const cx = classNames.bind(styles);

export function StudyRoomTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();
  const { logged } = useSessionStore.getState();
  const router = useRouter();
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [skillIdsClk, setSkillIdsClk] = useState<any[]>([1, 2, 3, 4, 5]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [quizPage, setQuizPage] = useState(1);
  const [quizTotalPage, setQuizTotalPage] = useState(1);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);
  const [viewFilter, setViewFilter] = useState('0002');
  const [params, setParams] = useState<paramProps>({ page, viewFilter });
  const [contents, setContents] = useState<RecommendContent[]>([]);
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

  const mark = ['2023-9-10', '2023-9-11', '2023-9-12'];

  const { isFetched: isContentFetched, refetch: refetch } = useStudyRoomList(params, data => {
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPages);
  });
  const { isFetched: isQuizFetched, refetch: QuizRefetch } = useStudyQuizList(params, data => {
    setQuizList(data.data.contents || []);
    setQuizTotalPage(data.data.totalPages);
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

  const handleJobs = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    console.log('job', event.currentTarget, newFormats);
    setJobGroup(newFormats);

    setParams({
      ...params,
      recommendJobGroups: contentType,
      recommendJobs: newFormats.join(','),
      page,
    });
    setPage(1);
    console.log(newFormats);
  };

  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendLevels(newFormats);

    setParams({
      ...params,
      recommendJobGroups: contentType,
      recommendLevels: newFormats.join(','),
      page,
    });
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein };
  }

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

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
                      setParams({
                        page,
                      });
                      setPage(1);
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
                      <TableContainer component={Paper} className=" tw-mb-5">
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
                      <Pagination page={page} setPage={setPage} total={totalPage} />
                    </div>
                  )}
                  {isContentFetched && active === 1 && (
                    <div>
                      <TableContainer component={Paper} className=" tw-mb-5">
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
                              <React.Fragment key={row.clubName}>
                                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                  <TableCell>
                                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                  </TableCell>
                                  <TableCell>{row.clubName}</TableCell>
                                  <TableCell align="right">{row.leaderNickname}</TableCell>
                                  <TableCell align="right">{row.recruitedMemberCount}</TableCell>
                                  <TableCell align="right">{row.startAt.split(' ')[0]}</TableCell>
                                  <TableCell align="right">{row.studyWeekCount}회</TableCell>
                                  <TableCell align="right">{row.clubRunRate}%</TableCell>
                                  <TableCell align="right">
                                    <span className="tw-bg-blue-500 tw-text-white tw-text-xs tw-font-medium tw-mr-2 tw-px-2.5 tw-py-3 tw-rounded">
                                      입장하기
                                    </span>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                      <Box sx={{ margin: 1 }}>
                                        <Typography variant="h5" gutterBottom component="div">
                                          클럽생성일 : {row.clubCreatedAt} 클럽가입일 : {row.clubJoinedAt} 학습진행 :{' '}
                                          {row.studyCount} / {row.studyTotalCount} 회
                                        </Typography>
                                      </Box>
                                    </Collapse>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Pagination page={page} setPage={setPage} total={totalPage} />
                    </div>
                  )}
                  {active === 4 && <div>sdfasdfdsfdd</div>}
                </Grid>
                <Grid item xs={4}>
                  <div className="tw-bg-gray-50 tw-rounded-md tw-h-[400px] tw-p-5 tw-text-black ">
                    <div className="tw-font-bold tw-text-base tw-pb-5">나의 학습 갤린더</div>
                    <div className="tw-bg-white">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateCalendar />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div className="tw-bg-gray-50 tw-rounded-md tw-h-[400px] tw-p-5 tw-text-black ">
                    <div className="tw-font-bold tw-text-base tw-pb-5">내가 풀어야 할 퀴즈</div>
                    {/* {isQuizFetched && (
                        {quizList.map((item,i)=> (
                          <div  key={item.id} className="tw-bg-white">
                          {item.clubName}
                    </div>
                              ))}
                      )} */}
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
                            <div className="tw-text-center tw-bg-blue-500 tw-text-white tw-text-blue-800 tw-text-xs tw-font-medium tw-px-0 tw-py-1 tw-rounded">
                              GO {'>'}
                            </div>
                          </div>
                        </div>
                      ))}
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
