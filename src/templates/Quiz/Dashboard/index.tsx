import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import { paramProps, useMyClubList, useMyDashboardList } from 'src/services/seminars/seminars.queries';
import Grid from '@mui/material/Grid';

/**import quiz modal  */
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import SettingsIcon from '@mui/icons-material/Settings';
import { Line, Circle } from 'rc-progress';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import router from 'next/router';

export interface QuizDashboardTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

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
    left: 140, // 이 값을 `Dessert` 열의 너비에 맞게 조정하세요.
  },
  stickyThread: {
    left: 240, // 이 값을 `Dessert` 열의 너비에 맞게 조정하세요.
  },
}));
const cx = classNames.bind(styles);

export function QuizDashboardTemplate({ id }: QuizDashboardTemplateProps) {
  const [page, setPage] = useState(1);
  const [myClubList, setMyClubList] = useState<any>([]);
  const [myDashboardList, setMyDashboardList] = useState<any>([]);
  const [myClubParams, setMyClubParams] = useState<any>({ clubSequence: id, data: { sortType: '0001' } });
  const [params, setParams] = useState<paramProps>({ page });
  const [selectedValue, setSelectedValue] = useState(id);

  const handleChangeQuiz = event => {
    setSortType(event.target.value);
  };

  // 퀴즈클럽 리스트
  const { isFetched: isContentFetched, refetch: refetchMyClub } = useMyClubList({}, data => {
    console.log(data?.data?.contents);
    setMyClubList(data?.data?.contents || []);
  });

  // 퀴즈클럽 대시보드
  const { isFetched: isDashboardFetched, refetch: refetchMyDashboard } = useMyDashboardList(myClubParams, data => {
    console.log(data);
    setMyDashboardList(data || []);
  });

  /** my quiz replies */
  const [selectedClub, setSelectedClub] = useState(null);
  const [sortType, setSortType] = useState('0001');

  useDidMountEffect(() => {
    setMyClubParams({
      clubSequence: selectedClub?.clubSequence || id,
      data: { sortType: sortType },
    });
  }, [sortType, selectedClub]);

  const handleQuizChange = event => {
    const value = event.target.value;
    const selectedSession = myClubList?.find(session => {
      return session.clubSequence === Number(value);
    });

    setSelectedValue(value);
    setSelectedClub(selectedSession);
    console.log(selectedSession);
  };

  const getCircleColor = galendar => {
    switch (galendar) {
      case '0001':
        return { text: 'gray', fill: 'white', borderColor: 'white' };
      case '0002':
        return { text: 'white', fill: '#FF8F60', borderColor: '#FF8F60' };
      case '0003':
        return { text: 'white', fill: '#E11837', borderColor: '#E11837' };
      case '0004':
        return { text: 'white', fill: '#31343D', borderColor: '#31343D' };
      default:
        return { text: 'white', fill: 'gray', borderColor: 'gray' };
    }
  };

  const classes = useStyles();
  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <>
          <Desktop>
            {/* <Divider className="tw-y-5 tw-bg-['#efefef']" /> */}
            <div className="tw-pt-8">
              <div className="tw-flex tw-justify-start tw-items-start tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
                  나의클럽
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
                  퀴즈클럽 대시보드
                </p>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-[31.5px] tw-gap-3.5">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
                  퀴즈클럽 대시보드
                </p>
              </div>
              <Divider className="tw-py-2 tw-bg-['#efefef']" />
            </div>
          </Desktop>
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
        </>
        <div className="tw-flex tw-items-center tw-mt-6">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={11.1} className="tw-font-bold tw-text-xl">
              <select
                className="tw-h-14 form-select block w-full tw-bg-gray-100 tw-text-red-500 tw-font-bold tw-px-8"
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
                        퀴즈클럽 : {session?.clubName}
                      </option>
                    );
                  })}
              </select>
            </Grid>

            <Grid item xs={0.9} justifyContent="flex-end" className="tw-flex">
              {/* {contents?.isBeforeOpening ? ( */}
              <div className="">
                <button
                  type="button"
                  onClick={() => router.push(`/manage-quiz-club/${id}`)}
                  className="tw-h-14  tw-text-black tw-bg-[#CED4DE] border tw-font-medium tw-rounded-md tw-text-sm tw-px-6 tw-py-2 "
                >
                  <SettingsIcon className="tw-bg-[#CED4DE] tw-text-white" />
                </button>
              </div>
            </Grid>
          </Grid>
        </div>
        <div className="tw-w-full tw-py-5 tw-cursor-pointer">
          <div
            onClick={() => router.push(`/quiz-list/${id}`)}
            className="tw-h-[50px] tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border tw-border-secondary"
          >
            <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-[28.21px] tw-top-[14px] tw-gap-[16.133331298828125px]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                퀴즈 목록/답변 전체보기 & 채점하기
              </p>
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-w-6 tw-h-6 tw-absolute tw-right-[2%] tw-top-[14px]"
              preserveAspectRatio="none"
            >
              <path
                d="M16.4647 11.6552L9.25269 4.44319L7.55469 6.13879L13.0747 11.6552L7.55469 17.1704L9.25149 18.8672L16.4647 11.6552Z"
                fill="#9CA5B2"
              ></path>
            </svg>
          </div>
        </div>
        {true && (
          <>
            <div className="tw-grid tw-grid-cols-4 tw-gap-10">
              <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
                <div className="tw-h-[60.5px] tw-overflow-hidden border-bottom">
                  <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[20.16px] tw-top-[18.15px] tw-gap-[12.09999942779541px]">
                    <div className="tw-w-[4.03px] tw-h-[16.13px] tw-bg-[#e11837]"></div>
                    <p className=" tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">참여인원</p>
                  </div>
                </div>
                <div className="tw-py-8">
                  <p className="tw-text-center tw-text-[68.91717529296875px] tw-font-bold tw-text-left tw-text-[#31343d]">
                    {myDashboardList?.recruitedMemberCount}
                    <span className="tw-text-center tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">
                      명
                    </span>
                  </p>
                </div>
              </div>
              <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
                <div className="tw-h-[60.5px] tw-overflow-hidden border-bottom">
                  <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[20.16px] tw-top-[18.15px] tw-gap-[12.09999942779541px]">
                    <div className="tw-w-[4.03px] tw-h-[16.13px] tw-bg-[#e11837]"></div>
                    <p className=" tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">학습현황</p>
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-h-[70%] tw-justify-center tw-gap-1">
                  <p className="tw-ml-10 tw-text-left tw-text-base tw-font-bold tw-text-[#31343d]">
                    클럽 주수 : {myDashboardList?.progress?.weekCount}주
                  </p>
                  <p className="tw-ml-10 tw-text-left tw-text-base tw-font-bold tw-text-[#31343d]">
                    학습 회차 : <span className="tw-text-[#e11837]">{myDashboardList?.progress?.currentRound}회차</span>{' '}
                    / {myDashboardList?.progress?.totalStudyCount}회
                  </p>
                  <p className="tw-ml-10 tw-text-left tw-text-base tw-font-bold tw-text-[#31343d]">
                    남은 학습 : {myDashboardList?.progress?.remainingStudyCount}회
                  </p>
                </div>
              </div>
              <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
                <div className="tw-h-[60.5px] tw-overflow-hidden border-bottom">
                  <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[20.16px] tw-top-[18.15px] tw-gap-[12.09999942779541px]">
                    <div className="tw-w-[4.03px] tw-h-[16.13px] tw-bg-[#e11837]"></div>
                    <p className=" tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">현재 진행중인 퀴즈</p>
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-h-[70%] tw-justify-center tw-gap-1">
                  <p className="tw-px-5 tw-text-center tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                    {myDashboardList?.currentQuizQuestion}
                  </p>
                </div>
              </div>
              <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
                <div className="tw-h-[60.5px] tw-overflow-hidden border-bottom">
                  <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[20.16px] tw-top-[18.15px] tw-gap-[12.09999942779541px]">
                    <div className="tw-w-[4.03px] tw-h-[16.13px] tw-bg-[#e11837]"></div>
                    <p className=" tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">이번주 참여율</p>
                  </div>
                </div>
                <div className=" tw-h-[70%] tw-flex tw-justify-center tw-items-center">
                  <Circle
                    className="tw-h-[120px]"
                    trailWidth={9}
                    trailColor="#DADADA"
                    percent={myDashboardList?.participationPercentage}
                    strokeWidth={9}
                    strokeColor="#e11837"
                  />
                  <div className="tw-flex tw-justify-center tw-items-center tw-absolute tw-h-full tw-w-full">
                    <p className="tw-text-xl tw-font-bold tw-text-[#e11837]">
                      {myDashboardList?.participationPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-flex tw-justify-between tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
              <RadioGroup className="tw-items-center tw-py-5 tw-gap-3" value={sortType} onChange={handleChangeQuiz} row>
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
                      가나다순
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
                      합산점수 높은순
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
                      합산점수 낮은순
                    </p>
                  }
                />
              </RadioGroup>
              <div className="tw-flex tw-items-center tw-justify-end tw-text-center tw-py-5">
                <div className="tw-flex tw-justify-end tw-items-center tw-gap-3">
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-flex-grow-0 tw-flex-shrink-0"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <circle cx="7" cy="7.5" r="6.5" fill="white" stroke="#E11837"></circle>
                    </svg>
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                      미제출
                    </p>
                  </div>
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-flex-grow-0 tw-flex-shrink-0"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <circle cx="7" cy="7.5" r="7" fill="#FF4444"></circle>
                    </svg>
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                      미채점
                    </p>
                  </div>
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-flex-grow-0 tw-flex-shrink-0"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <circle cx="7" cy="7.5" r="7" fill="#31343D"></circle>
                    </svg>
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                      채점완료
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <DataGrid columns={columns} rows={rows} />; */}
            <TableContainer>
              <Table className={classes.table} aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                  <TableRow>
                    <TableCell align="center" width={140} className={`${classes.sticky} ${classes.stickyFirst}`}>
                      <div className="tw-font-bold tw-text-base"> 학생</div>
                    </TableCell>
                    <TableCell align="center" width={120} className={`${classes.stickyBoard} ${classes.stickySecond}`}>
                      <div className="tw-font-bold tw-text-base">학습현황</div>
                    </TableCell>
                    <TableCell align="center" width={110}>
                      <div className="tw-font-bold tw-text-base">합산점수</div>
                    </TableCell>

                    {myDashboardList?.schedules?.map((session, index) => (
                      <TableCell key={index} width={100} align="right">
                        <div>
                          <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d] tw-left-[15px] tw-top-0">
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
                  {myDashboardList?.participantProgresses?.map((info, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell
                        align="center"
                        width={140}
                        component="th"
                        scope="row"
                        className={`${classes.stickyWhite} ${classes.stickyFirst}`}
                      >
                        <div className="tw-flex tw-items-center">
                          {info?.member?.profileImageUrl ? (
                            <img
                              src={info.member.profileImageUrl}
                              className="tw-w-10 tw-h-10 border tw-rounded-full"
                              alt="Profile"
                            />
                          ) : (
                            <div className="tw-w-10 tw-h-10"></div> // 여기에 높이와 너비를 맞춘 빈 div 추가
                          )}
                          <div className="tw-ml-2">{info?.member?.nickname}</div>
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
                                width: `${(info?.studyCount / myDashboardList?.progress?.totalStudyCount) * 100}%`,
                              }}
                            >
                              <span className="progress-line"></span>
                            </span>
                          </div>
                          <div className="tw-col-span-2">{info?.studyCount}회</div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" width={110} component="th" scope="row">
                        <div className="">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.gradingFinalPoints}</span> / {info?.totalPoints}
                          </div>
                        </div>
                      </TableCell>
                      {info?.results.map((info, index) => {
                        const { fill, borderColor, text } = getCircleColor(info?.status);
                        return (
                          <TableCell padding="none" key={index} align="center" width={100} component="th" scope="row">
                            <div className="tw-h-12 tw-flex tw-justify-center tw-items-center">
                              {info?.status !== '0001' && (
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="tw-left-[-1px] tw-top-[-1px]"
                                  preserveAspectRatio="xMidYMid meet"
                                >
                                  <circle cx="10" cy="10" r="9.5" fill={fill} stroke={borderColor || fill}></circle>
                                  <text
                                    x="10"
                                    y="10"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill={text}
                                    className="tw-text-xs tw-font-medium tw-text-center"
                                  >
                                    {info?.status === '0004' && info?.gradingFinal}
                                    {info?.status === '0003' && '?'}
                                    {info?.status === '0002' && '-'}
                                  </text>
                                </svg>
                              )}
                              <div className="tw-text-gray-400">
                                {info?.status === '0001' && 'D' + info?.relativeDaysToPublishDate}
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
          </>
        )}
      </div>
    </div>
  );
}

export default QuizDashboardTemplate;
