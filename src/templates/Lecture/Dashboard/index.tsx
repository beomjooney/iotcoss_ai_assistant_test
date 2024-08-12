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
import Modal from 'src/stories/components/Modal';

import router from 'next/router';

export interface LectureDashboardTemplateProps {
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

export function LectureDashboardTemplate({ id }: LectureDashboardTemplateProps) {
  const [page, setPage] = useState(1);
  const [myClubList, setMyClubList] = useState<any>([]);
  const [myDashboardList, setMyDashboardList] = useState<any>([]);
  const [myClubParams, setMyClubParams] = useState<any>({ clubSequence: id, data: { sortType: '0001' } });
  const [params, setParams] = useState<paramProps>({ page });
  const [selectedValue, setSelectedValue] = useState(id);
  const [activeTab, setActiveTab] = useState('myQuiz');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    console.log('value', value);
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
  const handleTabClick = tab => {
    setActiveTab(tab);
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
              <div className="tw-w-full tw-flex tw-py-5">
                <div className="tw-w-3/12 tw-pr-5">
                  <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-h-[471px] tw-relative tw-gap-7 tw-px-5 tw-pt-7 tw-pb-8 tw-rounded-[10px] tw-bg-[#f6f7fb]">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                      안녕하세요! 클럽장님
                    </p>
                    <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-4">
                      <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[220px] tw-h-14 tw-relative tw-overflow-hidden tw-rounded">
                        <div className="tw-w-[220px] tw-h-14 tw-left-[-1px] tw-top-[-1px] tw-bg-white" />
                        <p className="tw-absolute tw-left-5 tw-top-[18px] tw-text-sm tw-font-bold tw-text-left tw-text-[#31343d]">
                          클럽인원
                        </p>
                        <p className="tw-absolute tw-left-[155px] tw-top-2.5 tw-text-2xl tw-font-bold tw-text-left tw-text-black">
                          30
                        </p>
                        <p className="tw-absolute tw-left-[185px] tw-top-[18px] tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                          명
                        </p>
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
                              12주
                            </p>
                          </div>
                          <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-4">
                            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm  tw-font-bold tw-text-left tw-text-[#31343d]">
                                강의 회차
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
                                1
                              </span>
                              <span className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-left tw-text-[#31343d]">
                                / 12회
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
                              11회
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tw-w-10/12 ">
                  <div className="tw-flex tw-items-center tw-justify-between tw-gap-4">
                    <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-4">
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-font-bold tw-text-left tw-text-[#31343d]">
                        이번주 학습 회차
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
                      <p className="tw-flex tw-text-lg tw-font-medium tw-text-left tw-text-[#2474ed]">
                        1회차. 06-04(화)
                      </p>
                    </div>
                    <p
                      onClick={() => router.push(`/view-all-lecture/${selectedValue}`)}
                      className="tw-cursor-pointer tw-text-sm tw-font-medium tw-text-right tw-tw-tw-tw-text-[#313b49]"
                    >
                      전체 학습 보기
                    </p>
                  </div>
                  <div className="tw-my-5 tw-h-[100px] tw-relative tw-rounded-lg tw-bg-white border border-[#e9ecf2]">
                    <svg
                      width={28}
                      height={28}
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-w-7 tw-h-7 tw-absolute tw-left-[792px] tw-top-9"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        d="M19.2095 13.5977L10.7955 5.18372L8.81445 7.16192L15.2545 13.5977L8.81445 20.0321L10.7941 22.0117L19.2095 13.5977Z"
                        fill="#9CA5B2"
                      />
                    </svg>
                    <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[239px] tw-top-[37px] tw-gap-3">
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-text-left tw-text-black">
                        1회차 임베디드 시스템 관련 강의제목
                      </p>
                      <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-gap-2">
                        <div className="tw-flex tw-justify-end tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded tw-bg-white border border-[#2474ed]">
                          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-medium tw-text-right tw-text-[#2474ed]">
                            오프라인
                          </p>
                        </div>
                        <div className="tw-flex tw-justify-end tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded tw-bg-white border border-[#31343d]">
                          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-medium tw-text-right tw-text-[#31343d]">
                            정규
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tw-w-full tw-flex">
                    <div className="tw-w-8/12 tw-pr-5">
                      <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
                        <div className="tw-flex tw-px-4 tw-justify-between tw-items-center tw-bg-[#f6f7fb] tw-h-[60.5px] tw-overflow-hidden border-bottom">
                          <p className="tw-flex tw-text-base tw-font-bold tw-text-left tw-text-gray-500">
                            최근 학습 질의 내역
                          </p>
                          <div className="tw-flex">
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
                          </div>
                        </div>
                        <div className=" tw-h-[245px] tw-flex tw-justify-center tw-items-start">
                          <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-relative">
                            <div className="border-bottom tw-flex-grow-0 tw-flex-shrink-0 tw-w-[554px] tw-h-[52px] tw-relative tw-overflow-hidden tw-bg-white tw-border-t-0 tw-border-r-0 tw-border-b tw-border-l-0 tw-border-[#e9ecf2]">
                              <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-6 tw-top-3 tw-gap-3">
                                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                                  <img
                                    className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full"
                                    src="/assets/avatars/3.jpg"
                                  />
                                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-medium tw-text-left tw-text-black">
                                    김승태
                                  </p>
                                </div>
                                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#6a7380]">
                                  EAI가 뭐야?
                                </p>
                              </div>
                            </div>
                            <div className="border-bottom tw-flex-grow-0 tw-flex-shrink-0 tw-w-[554px] tw-h-[52px] tw-relative tw-overflow-hidden tw-bg-white tw-border-t-0 tw-border-r-0 tw-border-b tw-border-l-0 tw-border-[#e9ecf2]">
                              <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-6 tw-top-3 tw-gap-3">
                                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                                  <img
                                    className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full"
                                    src="/assets/avatars/3.jpg"
                                  />
                                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-medium tw-text-left tw-text-black">
                                    김승태
                                  </p>
                                </div>
                                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#6a7380]">
                                  EAI가 뭐야?
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tw-w-4/12">
                      <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
                        <div className="tw-flex tw-px-4 tw-justify-between tw-items-center tw-bg-[#f6f7fb] tw-h-[60.5px] tw-overflow-hidden border-bottom">
                          <p className=" tw-text-base tw-font-bold tw-text-left tw-text-gray-500">AI피드백 현황</p>
                          <div className="tw-flex">
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
                          </div>
                        </div>
                        <div className=" tw-h-[175px]  tw-flex tw-justify-center tw-items-center">
                          <Circle
                            className="tw-h-[120px]"
                            trailWidth={9}
                            trailColor="#DADADA"
                            percent={myDashboardList?.participationPercentage}
                            strokeWidth={9}
                            strokeColor="#e11837"
                          />
                          <div className="tw-flex tw-justify-center tw-items-center tw-absolute tw-h-full tw-w-full">
                            <p className="tw-text-base tw-font-bold tw-text-black">
                              1 / {myDashboardList?.participationPercentage}개
                            </p>
                          </div>
                        </div>
                        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-relative tw-gap-0.5">
                          <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[182px] tw-h-[21px] tw-relative">
                            <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[1.5px] tw-gap-2">
                              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#31343d]">
                                강의자료에서 답변
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
                            <p className="tw-absolute tw-left-[115px] tw-top-0 tw-text-sm tw-font-medium tw-text-left">
                              <span className="tw-text-sm tw-font-medium tw-text-left tw-text-[#2474ed]">24</span>
                              <span className="tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]"> / 30개</span>
                            </p>
                          </div>
                          <div className="tw-mb-7 tw-flex-grow-0 tw-flex-shrink-0 tw-w-[184px] tw-h-[21px] tw-relative">
                            <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[1.5px] tw-gap-2">
                              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[91px] tw-text-xs tw-text-left tw-text-[#31343d]">
                                일반 서치 답변
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
                            <p className="tw-absolute tw-left-[123px] tw-top-0 tw-text-sm tw-font-medium tw-text-right">
                              <span className="tw-text-sm tw-font-medium tw-text-right tw-text-[#2474ed]">8</span>
                              <span className="tw-text-sm tw-font-medium tw-text-right tw-text-[#31343d]"> / 30개</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>

            <div className=" tw-h-12 border-left tw-relative tw-flex tw-items-center tw-mt-14 border-bottom">
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
            </div>

            {activeTab === 'myQuiz' && (
              <div>
                <div className="tw-flex tw-justify-between tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
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
                      <div className="tw-flex tw-justify-end tw-items-center tw-gap-3">
                        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-gap-1">
                          <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                            <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative">
                              <div className="tw-w-4 tw-h-4 tw-absolute tw-left-0 tw-top-[0.5px] tw-overflow-hidden tw-rounded-sm tw-bg-[#ced4de]">
                                <p className="tw-absolute tw-left-1 tw-top-px tw-text-[8px] tw-font-medium tw-text-center tw-text-white">
                                  N
                                </p>
                              </div>
                            </div>
                            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                              응답완료
                            </p>
                          </div>
                        </div>
                        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                          <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative">
                            <div className="tw-w-4 tw-h-4 tw-absolute tw-left-0 tw-top-[0.5px] tw-overflow-hidden tw-rounded-sm tw-bg-[#e11837]">
                              <p className="tw-absolute tw-left-1 tw-top-px tw-text-[8px] tw-font-medium tw-text-center tw-text-white">
                                N
                              </p>
                            </div>
                          </div>
                          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                            응답대기
                          </p>
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
                            미학습
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <TableContainer>
                  <Table className={classes.table} aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                    <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                      <TableRow>
                        <TableCell align="center" width={140} className={`${classes.sticky} ${classes.stickyFirst}`}>
                          <div className="tw-font-bold tw-text-base">학습자</div>
                        </TableCell>
                        <TableCell align="center" width={120}>
                          <div className="tw-font-bold tw-text-base">학습 참여도</div>
                        </TableCell>
                        <TableCell
                          align="center"
                          width={110}
                          className={`${classes.stickyBoard} ${classes.stickySecond}`}
                        >
                          <div className="tw-font-bold tw-text-base">답변/질의</div>
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
                              <img
                                src={info?.member?.profileImageUrl || '/assets/avatars/3.jpg'}
                                className="tw-w-10 tw-h-10 border tw-rounded-full"
                                alt="Profile"
                              />
                              <div className="tw-ml-2">{info?.member?.nickname}</div>
                            </div>
                          </TableCell>
                          <TableCell align="center" width={120} component="th" scope="row">
                            <div className="tw-font-bold tw-grid tw-gap-1 tw-justify-center tw-items-center">
                              <div>
                                10 / {''}
                                <span className="tw-text-sm tw-text-gray-500">{info?.studyCount}회</span>
                              </div>
                              <div className="tw-w-[70px] progress tw-rounded tw-h-2 tw-p-0">
                                <span
                                  style={{
                                    width: `${(info?.studyCount / myDashboardList?.progress?.totalStudyCount) * 100}%`,
                                  }}
                                >
                                  <span className="progress-line"></span>
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            padding="none"
                            align="center"
                            width={110}
                            component="th"
                            scope="row"
                            className={`${classes.stickyWhiteBoard} ${classes.stickySecond}`}
                          >
                            <div className="">
                              <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                                <span className="tw-font-bold">{info?.gradingFinalPoints}</span> / {info?.totalPoints}
                              </div>
                            </div>
                          </TableCell>
                          {info?.results.map((info, index) => {
                            const { fill, borderColor, text } = getCircleColor(info?.status);
                            return (
                              <TableCell
                                padding="none"
                                key={index}
                                align="center"
                                width={100}
                                component="th"
                                scope="row"
                              >
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
              </div>
            )}

            {activeTab === 'community' && (
              <div>
                <div className="tw-flex tw-justify-between tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
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
                          강의 오름차순
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
                          강의 내림차순
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
                          질의많은순
                        </p>
                      }
                    />
                  </RadioGroup>
                </div>
                <TableContainer>
                  <Table className={classes.table} aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                    <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                      <TableRow>
                        <TableCell align="center" width={100} className="border-right">
                          <div className="tw-font-bold tw-text-base">강의회차</div>
                        </TableCell>
                        <TableCell align="center" width={100}>
                          <div className="tw-font-bold tw-text-base">총 질의수</div>
                        </TableCell>
                        <TableCell align="center" width={110}>
                          <div className="tw-font-bold tw-text-base">
                            AI답변
                            <br />
                            (강의자료)
                          </div>
                        </TableCell>
                        <TableCell align="center" width={110}>
                          <div className="tw-font-bold tw-text-base">
                            AI답변 수 <br />
                            (범용자료)
                          </div>
                        </TableCell>
                        <TableCell align="center" width={100} className="border-right">
                          <div className="tw-font-bold tw-text-base">미답변 수</div>
                        </TableCell>
                        <TableCell align="center" className="border-right">
                          <div className="tw-font-bold tw-text-base">주요 질의응답</div>
                        </TableCell>
                        <TableCell align="center" width={110}>
                          <div className="tw-font-bold tw-text-base">상세보기</div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" component="th" scope="row" className="border-right">
                          <div className="tw-font-bold tw-text-base">
                            1회 <br />
                            <span className="tw-text-sm tw-font-medium tw-text-gray-400">07-01(월)</span>
                          </div>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                          <div className="tw-font-bold tw-text-base">19</div>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                          <div className="tw-font-bold tw-text-base">19</div>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                          <div className="tw-font-bold tw-text-base">19</div>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row" className="border-right">
                          <div className="tw-font-bold tw-text-base">
                            19 <span className=" tw-text-gray-400">/ 19</span>
                          </div>
                        </TableCell>
                        <TableCell align="left" component="th" scope="row" className="border-right">
                          <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                          <div className="tw-font-bold tw-text-sm">AI답변 : 모데로가 토크나이저거가 뭐야?</div>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded"
                          >
                            상세보기
                          </button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </>
        )}
        <Modal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} title="질의응답" maxWidth="900px">
          <div className={cx('seminar-check-popup')}>
            <TableContainer>
              <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                  <TableRow>
                    <TableCell align="left" width={150} className="border-right">
                      <div className="tw-font-bold tw-text-base">학생</div>
                    </TableCell>
                    <TableCell align="left" width={300} className="border-right">
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
                  <TableRow>
                    <TableCell align="center" component="th" scope="row" className="border-right">
                      <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
                        <img
                          src={'/assets/avatars/3.jpg'}
                          className="tw-w-10 tw-h-10 border tw-rounded-full"
                          alt="Profile"
                        />
                        <div className="tw-ml-2">김흐흐</div>
                      </div>
                    </TableCell>
                    <TableCell align="left" component="th" scope="row" className="border-right">
                      <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                    </TableCell>
                    <TableCell align="left" component="th" scope="row" className="border-right">
                      <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                      <div className="tw-font-bold tw-text-sm">AI답변 : 모데로가 토크나이저거가 뭐야?</div>
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      <button className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded">
                        +
                      </button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" component="th" scope="row" className="border-right" rowSpan={2}>
                      <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
                        <img
                          src={'/assets/avatars/3.jpg'}
                          className="tw-w-10 tw-h-10 border tw-rounded-full"
                          alt="Profile"
                        />
                        <div className="tw-ml-2">김찬영</div>
                      </div>
                    </TableCell>
                    <TableCell align="left" component="th" scope="row" className="border-right">
                      <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                    </TableCell>
                    <TableCell align="left" component="th" scope="row" className="border-right">
                      <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                      <div className="tw-font-bold tw-text-sm">AI답변 : 모데로가 토크나이저거가 뭐야?</div>
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      <button className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded">
                        +
                      </button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left" component="th" scope="row" className="border-right">
                      <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                    </TableCell>
                    <TableCell align="left" component="th" scope="row" className="border-right">
                      <div className="tw-font-bold tw-text-sm">Q. 모데로가 토크나이저거가 뭐야?</div>
                      <div className="tw-font-bold tw-text-sm">AI답변 : 모데로가 토크나이저거가 뭐야?</div>
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      <button className="tw-text-sm tw-font-bold border tw-py-2 tw-px-3 tw-text-gray-400 tw-rounded">
                        +
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default LectureDashboardTemplate;
