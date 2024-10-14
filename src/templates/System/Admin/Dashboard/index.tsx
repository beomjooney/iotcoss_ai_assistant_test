import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import { useMemberActiveSummaryInfo } from 'src/services/account/account.queries';
import {
  useClubApprovalList,
  useClubStatsSummary,
  useClubQuizStatsSummary,
  useClubActiveQuizStatsSummary,
  useClubSummary,
  useClubChartSummary,
} from 'src/services/studyroom/studyroom.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import router from 'next/router';
import { Mobile, Desktop } from 'src/hooks/mediaQuery';
import { useQuizActivityHistory } from 'src/services/quiz/quiz.queries';
import { Pagination } from 'src/stories/components';
import { useEffect } from 'react';
import { TextField } from '@mui/material';
// Next.js의 dynamic import로 ApexChart를 불러옵니다.\
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false }) as any;

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const cx = classNames.bind(styles);

export function AdminDashboardTemplate() {
  const { memberId } = useSessionStore.getState();
  const [value, setValue] = React.useState([null, null]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElement, setTotalElement] = useState(0);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any>([]);

  const [summary, setSummary] = useState({});
  const [quizSummary, setQuizSummary] = useState({});
  const [activeQuizSummary, setActiveQuizSummary] = useState({});
  const [clubSummary, setClubSummary] = useState({});
  const [category, setCategory] = useState([]);
  const [incrementalInstructorCount, setIncrementalInstructorCount] = useState([]);
  const [totalInstructorCount, setTotalInstructorCount] = useState([]);
  const [incrementalStudentCount, setIncrementalStudentCount] = useState([]);
  const [totalStudentCount, setTotalStudentCount] = useState([]);

  const [startDay, setStartDay] = React.useState<Dayjs | null>(dayjs());
  const [endDay, setEndDay] = React.useState<Dayjs | null>(dayjs().add(30, 'day'));

  const [member, setMember] = useState([]);
  const [club, setClub] = useState([]);
  const [search, setSearch] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [memberList, setMemberList] = useState<any[]>([]);
  const [memberParams, setMemberParams] = useState<any>({ page: page, keyword: search });
  const [summaryParams, setSummaryParams] = useState<any>({
    statsDateSearchStart: startDay.format('YYYY-MM-DD'),
    statsDateSearchEnd: endDay.format('YYYY-MM-DD'),
    size: 100,
    page: 1,
  });

  const [quizParams, setQuizParams] = useState<any>({
    statsDateSearchStart: startDay.format('YYYY-MM-DD'),
    statsDateSearchEnd: endDay.format('YYYY-MM-DD'),
    size: 5,
    page: 1,
  });

  const [activeQuizParams, setActiveQuizParams] = useState<any>({
    statsDateSearchStart: startDay.format('YYYY-MM-DD'),
    statsDateSearchEnd: endDay.format('YYYY-MM-DD'),
    size: 5,
    page: 1,
  });

  const [clubParams, setClubParams] = useState<any>({
    statsDateSearchStart: startDay.format('YYYY-MM-DD'),
    statsDateSearchEnd: endDay.format('YYYY-MM-DD'),
    size: 5,
    page: 1,
  });
  const [clubChartParams, setClubChartParams] = useState<any>({
    statsDateSearchStart: startDay.format('YYYY-MM-DD'),
    statsDateSearchEnd: endDay.format('YYYY-MM-DD'),
    size: 5,
    page: 1,
  });

  const { isFetched: isMemberListFetched, refetch: QuizRefetchBadge } = useClubApprovalList(memberParams, data => {
    console.log(data);
    setTotalElement(data?.data?.openRequestClubCount);
    setContents(data?.data?.pageable?.contents);
    setTotalPage(data?.data?.pageable?.totalPages);
    setPage(data?.data?.pageable?.page);
  });

  const { isFetched: isSummaryFetched, refetch: refetchSummary } = useClubStatsSummary(summaryParams, data => {
    console.log(data);
    setSummary(data?.data);
  });

  const { isFetched: isQuizFetched, refetch: refetchQuiz } = useClubQuizStatsSummary(quizParams, data => {
    console.log(data);
    setQuizSummary(data?.data);
  });

  const { isFetched: isActiveQuizFetched, refetch: refetchActiveQuiz } = useClubActiveQuizStatsSummary(
    activeQuizParams,
    data => {
      console.log(data);
      setActiveQuizSummary(data?.data);
    },
  );

  const { isFetched: isClubSummaryFetched, refetch: refetchClubSummary } = useClubSummary(clubParams, data => {
    setClubSummary(data?.data);
  });

  const [chartSeries, setChartSeries] = useState([
    {
      name: '교수자 신규',
      data: [0, 0, 0, 0, 0, 0, 0],
      type: 'line',
    },
    {
      name: '학습자 신규',
      data: [0, 0, 0, 0, 0, 0, 0],
      type: 'line',
    },
    {
      name: '교수자 누적',
      data: [0, 0, 0, 0, 0, 0, 0],
      type: 'bar',
      yAxisIndex: 1, // 오른쪽 Y축에 연결
    },
    {
      name: '학습자 누적',
      data: [0, 0, 0, 0, 0, 0, 0],
      type: 'bar',
      yAxisIndex: 1, // 오른쪽 Y축에 연결
    },
  ]);
  const { isFetched: isClubChartSummaryFetched, refetch: refetchClubChartSummary } = useClubChartSummary(
    clubChartParams,
    data => {
      console.log('setClubChartSummary', data);
      // 데이터 분리
      data?.data?.contents?.forEach(item => {
        console.log('item', item);
        category.push(item.statsDate);
        incrementalInstructorCount.push(item.incrementalInstructorCount);
        totalInstructorCount.push(item.totalInstructorCount);
        incrementalStudentCount.push(item.incrementalStudentCount);
        totalStudentCount.push(item.totalStudentCount);
      });

      console.log('category', category);
      console.log('incrementalInstructorCount', incrementalInstructorCount);
      console.log('totalInstructorCount', totalInstructorCount);
      console.log('incrementalStudentCount', incrementalStudentCount);
      console.log('totalStudentCount', totalStudentCount);

      setChartSeries([
        {
          name: '교수자 신규',
          data: incrementalInstructorCount,
          type: 'line',
        },
        {
          name: '학습자 신규',
          data: incrementalStudentCount,
          type: 'line',
        },
        {
          name: '교수자 누적',
          data: totalInstructorCount,
          type: 'bar',
          yAxisIndex: 1, // 오른쪽 Y축에 연결
        },
        {
          name: '학습자 누적',
          data: totalStudentCount,
          type: 'bar',
          yAxisIndex: 1, // 오른쪽 Y축에 연결
        },
      ]);
    },
  );

  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: 'multi-chart',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false, // 데이터 레이블을 비활성화하여 막대 차트의 카운터 제거
    },
    xaxis: {
      categories: category,
    },
    yaxis: [
      {
        title: {
          text: '신규', // 왼쪽 Y축의 이름
        },
        labels: {
          formatter: value => `${value}`,
        },
      },
      {
        opposite: true,
        title: {
          text: '누적', // 오른쪽 Y축의 이름
        },
        labels: {
          formatter: value => `${value}`,
        },
      },
    ],
    stroke: {
      width: [2, 2, 0, 0], // 선형 차트의 두께 설정
    },
    fill: {
      opacity: [0.8, 0.8, 1, 1], // 바차트의 불투명도 설정
    },
    markers: {
      size: 4,
    },
    colors: ['#BDB7FF', '#77ADDE', '#817BCE', '#246184'], // 노랑, 초록, 파랑, 주황
  });

  // const { isFetched: isContentFetched, refetch: refetch } = useQuizActivityHistory(params, data => {
  //   console.log(data);
  //   setContents(data?.data?.content);
  //   setTotalPage(data?.data?.totalPage);
  //   setPage(data?.data?.page);
  // });

  // T를 공백으로 바꾸고 소수점 부분을 제거하는 함수
  const formatDate = date => {
    return date.split('.')[0].replace('T', ' '); // T를 공백으로 바꾸고 소수점 이하 제거
  };

  useDidMountEffect(() => {
    setMemberParams({
      // ...params,
      page,
      keyword: searchKeyword,
    });
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, searchKeyword]);

  const onChangeHandleFromToStartDate = date => {
    if (date) {
      // Convert date to a Dayjs object
      const formattedDate = dayjs(date);
      // Format the date as 'YYYY-MM-DD'
      const formattedDateString = formattedDate.format('YYYY-MM-DD');
      // Set both today and todayEnd
      setStartDay(formattedDate);
    }
  };
  const onChangeHandleFromToEndDate = date => {
    if (date) {
      // Convert date to a Dayjs object
      const formattedDate = dayjs(date);
      // Format the date as 'YYYY-MM-DD'
      const formattedDateString = formattedDate.format('YYYY-MM-DD');
      // Set both today and todayEnd
      setEndDay(formattedDate);
    }
  };

  const handleSearch = () => {
    console.log('startDay', startDay.format('YYYY-MM-DD'));
    setClubChartParams({
      ...clubChartParams,
      statsDateSearchStart: startDay.format('YYYY-MM-DD'),
      statsDateSearchEnd: endDay.format('YYYY-MM-DD'),
    });

    setSummaryParams({
      ...summaryParams,
      statsDateSearchStart: startDay.format('YYYY-MM-DD'),
      statsDateSearchEnd: endDay.format('YYYY-MM-DD'),
    });

    setQuizParams({
      ...quizParams,
      statsDateSearchStart: startDay.format('YYYY-MM-DD'),
      statsDateSearchEnd: endDay.format('YYYY-MM-DD'),
    });

    setActiveQuizParams({
      ...activeQuizParams,
      statsDateSearchStart: startDay.format('YYYY-MM-DD'),
      statsDateSearchEnd: endDay.format('YYYY-MM-DD'),
    });

    setClubParams({
      ...clubParams,
      statsDateSearchStart: startDay.format('YYYY-MM-DD'),
      statsDateSearchEnd: endDay.format('YYYY-MM-DD'),
    });
  };

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          {isMemberListFetched && (
            <>
              <Desktop>
                <div>
                  <div className="tw-flex tw-items-center tw-justify-between tw-mb-5">
                    <div className="tw-font-bold tw-text-xl tw-text-black tw-p-0">통계/분석 </div>
                    {/* <TextField
                      size="small"
                      value={search} // 상태값을 TextField에 반영
                      placeholder="검색"
                      onChange={e => setSearch(e.target.value)} // 입력된 값 업데이트
                      onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
                      InputProps={{
                        style: { height: '43px' },
                        startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                      }}
                    /> */}
                  </div>
                  {isMemberListFetched && (
                    <div className="">
                      <div className="border tw-p-7 tw-rounded-lg">
                        <div className="tw-flex tw-justify-between tw-font-bold tw-text-xl tw-text-black tw-mt-5 tw-mb-10">
                          <div className="tw-font-bold tw-text-lg tw-text-black">사용자수 통계</div>
                          <div className="tw-font-bold tw-text-lg tw-text-black tw-flex tw-gap-3">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                format="YYYY-MM-DD"
                                slotProps={{
                                  textField: { size: 'small', style: { backgroundColor: 'white', width: '140px' } },
                                }}
                                value={startDay}
                                onChange={e => onChangeHandleFromToStartDate(e)}
                              />
                            </LocalizationProvider>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                format="YYYY-MM-DD"
                                slotProps={{
                                  textField: { size: 'small', style: { backgroundColor: 'white', width: '140px' } },
                                }}
                                value={endDay}
                                onChange={e => onChangeHandleFromToEndDate(e)}
                              />
                            </LocalizationProvider>
                            <button
                              className="tw-text-sm tw-bg-black tw-text-white tw-px-3 tw-py-0 tw-rounded-md"
                              onClick={() => handleSearch()}
                            >
                              검색
                            </button>
                          </div>
                        </div>
                        <div className="tw-font-bold tw-text-lg tw-text-black tw-mb-5">방문현황 요약</div>
                        <div>
                          <div className="tw-flex tw-gap-8">
                            <div className="border tw-w-60 tw-h-[120px] tw-relative tw-rounded-lg tw-bg-[#fdfdff] tw-border tw-border-[#e9ecf2]">
                              <div className="tw-flex tw-p-5 tw-pb-0 tw-items-center tw-gap-1 ">
                                <p className=" tw-text-sm tw-font-medium tw-text-left tw-text-[#6a7380] tw-mr-2">
                                  교수자 신규
                                </p>
                                <svg
                                  width={7}
                                  height={9}
                                  viewBox="0 0 7 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className=""
                                  preserveAspectRatio="none"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.06216 5.25L3.03108 0L0 5.25H1.53108V9H4.53108V5.25H6.06216Z"
                                    fill="#FF0027"
                                  />
                                </svg>
                                <p className=" tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                                  +{summary?.incrementalInstructorCount}
                                </p>
                              </div>
                              <p className="tw-px-5   tw-text-[50px] tw-font-light  tw-text-[#1573ff]">
                                {summary?.totalInstructorCount}
                              </p>
                            </div>
                            <div className="border tw-w-60 tw-h-[120px] tw-relative tw-rounded-lg tw-bg-[#fdfdff] tw-border tw-border-[#e9ecf2]">
                              <div className="tw-flex tw-p-5 tw-pb-0 tw-items-center tw-gap-1 ">
                                <p className=" tw-text-sm tw-font-medium tw-text-left tw-text-[#6a7380] tw-mr-2">
                                  학습자 신규
                                </p>
                                <svg
                                  width={7}
                                  height={9}
                                  viewBox="0 0 7 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className=""
                                  preserveAspectRatio="none"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0.000322801 3.75L3.03141 9L6.0625 3.75L4.53141 3.75L4.53141 -1.33852e-07L1.53141 -3.9612e-07L1.53141 3.75L0.000322801 3.75Z"
                                    fill="#1573FF"
                                  />
                                </svg>
                                <p className=" tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                                  +{summary?.incrementalStudentCount}
                                </p>
                              </div>
                              <p className="tw-px-5   tw-text-[50px] tw-font-light  tw-text-[#1573ff]">
                                {summary?.totalStudentCount}
                              </p>
                            </div>
                            <div className="border tw-w-60 tw-h-[120px] tw-relative tw-rounded-lg tw-bg-[#fdfdff] tw-border tw-border-[#e9ecf2]">
                              <div className="tw-flex tw-p-5 tw-pb-0 tw-items-center tw-gap-1 ">
                                <p className=" tw-text-sm tw-font-medium tw-text-left tw-text-[#6a7380] tw-mr-2">
                                  방문자수
                                </p>
                                <svg
                                  width={7}
                                  height={9}
                                  viewBox="0 0 7 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className=""
                                  preserveAspectRatio="none"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.06216 5.25L3.03108 0L0 5.25H1.53108V9H4.53108V5.25H6.06216Z"
                                    fill="#FF0027"
                                  />
                                </svg>
                                <p className=" tw-text-sm tw-text-left tw-text-[#9ca5b2]">+3명</p>
                              </div>
                              <p className="tw-px-5   tw-text-[50px] tw-font-light  tw-text-[#1573ff]">0</p>
                            </div>
                          </div>
                        </div>
                        <div className="tw-font-bold tw-text-lg tw-text-black tw-my-10">일별 사용자 분포</div>
                        <div className="border tw-rounded-lg">
                          {isClubChartSummaryFetched && (
                            <Chart options={chartOptions} series={chartSeries} type="bar" />
                          )}
                        </div>
                      </div>
                      <div className="tw-py-5 tw-px-7 border tw-rounded-lg tw-mt-10">
                        <div className="tw-flex tw-gap-5">
                          <div className="tw-w-1/2 ">
                            <div className="tw-text-lg tw-text-black tw-font-bold">
                              사용자 답변 통계
                              <span className="tw-text-gray-500 tw-text-sm tw-font-normal tw-ml-2">최근 일주일</span>
                            </div>
                            <div className="tw-flex tw-items-center border tw-rounded-lg tw-p-5 tw-gap-5 tw-my-5 tw-bg-[#fdfdff]">
                              <div className="tw-w-1/2 ">
                                <p className="tw-px-5 tw-text-center tw-text-[50px] tw-font-light  tw-text-[#1573ff]">
                                  {summary?.totalAnswerCount}
                                </p>
                              </div>
                              <div className="tw-w-1/2 ">
                                <div className="tw-flex tw-items-center tw-justify-between">
                                  <div>방영우</div>
                                  <div className="tw-text-sm tw-text-gray-600 tw-font-bold">32건</div>
                                </div>
                                <div className="tw-flex tw-items-center tw-justify-between">
                                  <div>방영우</div>
                                  <div className="tw-text-sm tw-text-gray-600 tw-font-bold">32건</div>
                                </div>
                                <div className="tw-flex tw-items-center tw-justify-between">
                                  <div>방영우</div>
                                  <div className="tw-text-sm tw-text-gray-600 tw-font-bold">32건</div>
                                </div>
                                <div className="tw-flex tw-items-center tw-justify-between">
                                  <div>방영우</div>
                                  <div className="tw-text-sm tw-text-gray-600 tw-font-bold">32건</div>
                                </div>
                                <div className="tw-flex tw-items-center tw-justify-between">
                                  <div>방영우</div>
                                  <div className="tw-text-sm tw-text-gray-600 tw-font-bold">32건</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="tw-w-1/2 ">
                            <div className="tw-text-lg tw-text-black tw-font-bold">
                              사용자 리액션 통계
                              <span className="tw-text-gray-500 tw-text-sm tw-font-normal tw-ml-2">최근 일주일</span>
                            </div>
                            <div className="tw-flex tw-items-center border tw-rounded-lg tw-p-5 tw-gap-5 tw-my-5 tw-bg-[#fdfdff]">
                              <div className="tw-w-1/2 ">
                                <p className="tw-px-5 tw-text-center tw-text-[50px] tw-font-light  tw-text-[#1573ff]">
                                  {summary?.totalReactionCount}
                                </p>
                              </div>
                              <div className="tw-w-1/2 ">
                                <div className="tw-flex tw-items-center tw-justify-between">
                                  <div>방영우</div>
                                  <div className="tw-text-sm tw-text-gray-600 tw-font-bold">32건</div>
                                </div>
                                <div className="tw-flex tw-items-center tw-justify-between">
                                  <div>방영우</div>
                                  <div className="tw-text-sm tw-text-gray-600 tw-font-bold">32건</div>
                                </div>
                                <div className="tw-flex tw-items-center tw-justify-between">
                                  <div>방영우</div>
                                  <div className="tw-text-sm tw-text-gray-600 tw-font-bold">32건</div>
                                </div>
                                <div className="tw-flex tw-items-center tw-justify-between">
                                  <div>방영우</div>
                                  <div className="tw-text-sm tw-text-gray-600 tw-font-bold">32건</div>
                                </div>
                                <div className="tw-flex tw-items-center tw-justify-between">
                                  <div>방영우</div>
                                  <div className="tw-text-sm tw-text-gray-600 tw-font-bold">32건</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="tw-py-5 tw-px-7 border tw-rounded-lg tw-mt-10">
                        <div className="tw-flex tw-gap-5 tw-items-center tw-mb-10">
                          <div className="tw-text-lg tw-text-black tw-font-bold">퀴즈 통계</div>
                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="tw-w-5 tw-h-5 tw-relative"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <rect x="0.5" y="0.5" width={19} height={19} rx="3.5" fill="white" />
                            <rect x="0.5" y="0.5" width={19} height={19} rx="3.5" stroke="#E0E4EB" />
                            <path
                              d="M15 9.37383C14.8472 8.27191 14.3369 7.2509 13.5479 6.46809C12.7589 5.68527 11.7348 5.18408 10.6335 5.04171C9.53224 4.89934 8.41476 5.12369 7.45325 5.68021C6.49174 6.23673 5.73953 7.09453 5.3125 8.12149M5 5.61681V8.12149H7.5M5 10.6262C5.15285 11.7281 5.66308 12.7491 6.4521 13.5319C7.24112 14.3147 8.26515 14.8159 9.36646 14.9583C10.4678 15.1007 11.5852 14.8763 12.5467 14.3198C13.5083 13.7633 14.2605 12.9055 14.6875 11.8785M15 14.3832V11.8785H12.5"
                              stroke="#6A7380"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="tw-flex tw-justify-between tw-items-center tw-text-base tw-text-black tw-font-bold tw-my-5 tw-mt-10">
                          <div>인기 퀴즈</div>
                          <div
                            onClick={() => {
                              setQuizParams({ ...quizParams, size: 100 });
                            }}
                            className="tw-text-[#9ca5b2] tw-cursor-pointer tw-text-sm"
                          >
                            전체보기 &gt;
                          </div>
                        </div>
                        {quizSummary?.contents?.map((quiz, index) => (
                          <div
                            key={index}
                            className="tw-px-5 tw-mb-5 tw-flex tw-justify-between tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[70px] tw-relative tw-overflow-hidden tw-rounded tw-bg-[#fdfdff] border"
                          >
                            <div className="tw-flex tw-justify-start tw-items-center  tw-gap-2">
                              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#2474ed]">
                                {index + 1}.
                              </p>
                              <p className="tw-w-[500px] tw-flex-grow-0 tw-flex-shrink-0 tw-text-base  tw-text-left tw-text-black tw-line-clamp-2">
                                {quiz?.question}
                              </p>
                            </div>
                            <div className="tw-flex tw-justify-start tw-items-center   tw-gap-2">
                              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-center tw-text-[#9ca5b2]">
                                {quiz?.memberName}
                              </p>
                              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-10 tw-h-5">
                                  <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-0 tw-gap-1">
                                    <svg
                                      width={20}
                                      height={20}
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                                      preserveAspectRatio="none"
                                    >
                                      <path
                                        d="M15.4444 2.22168C15.857 2.22168 16.2527 2.38557 16.5444 2.67729C16.8361 2.96901 17 3.36468 17 3.77724V13.1106C17 13.5231 16.8361 13.9188 16.5444 14.2105C16.2527 14.5022 15.857 14.6661 15.4444 14.6661H13.8889V16.2217C13.8889 16.6342 13.725 17.0299 13.4333 17.3216C13.1416 17.6133 12.7459 17.7772 12.3333 17.7772H4.55556C4.143 17.7772 3.74733 17.6133 3.45561 17.3216C3.16389 17.0299 3 16.6342 3 16.2217V6.88835C3 6.47579 3.16389 6.08013 3.45561 5.7884C3.74733 5.49668 4.143 5.33279 4.55556 5.33279H6.11111V3.77724C6.11111 3.36468 6.275 2.96901 6.56672 2.67729C6.85845 2.38557 7.25411 2.22168 7.66667 2.22168H15.4444ZM12.3333 6.88835H4.55556V16.2217H12.3333V6.88835ZM8.44444 12.3328C8.65072 12.3328 8.84855 12.4147 8.99442 12.5606C9.14028 12.7065 9.22222 12.9043 9.22222 13.1106C9.22222 13.3168 9.14028 13.5147 8.99442 13.6605C8.84855 13.8064 8.65072 13.8883 8.44444 13.8883H6.88889C6.68261 13.8883 6.48478 13.8064 6.33892 13.6605C6.19306 13.5147 6.11111 13.3168 6.11111 13.1106C6.11111 12.9043 6.19306 12.7065 6.33892 12.5606C6.48478 12.4147 6.68261 12.3328 6.88889 12.3328H8.44444ZM15.4444 3.77724H7.66667V5.33279H12.3333C12.7459 5.33279 13.1416 5.49668 13.4333 5.7884C13.725 6.08013 13.8889 6.47579 13.8889 6.88835V13.1106H15.4444V3.77724ZM10 9.22168C10.1982 9.2219 10.3889 9.29781 10.5331 9.4339C10.6772 9.56998 10.764 9.75598 10.7756 9.95388C10.7872 10.1518 10.7228 10.3466 10.5956 10.4987C10.4683 10.6507 10.2879 10.7484 10.091 10.7718L10 10.7772H6.88889C6.69065 10.777 6.49997 10.7011 6.35582 10.565C6.21167 10.4289 6.12493 10.2429 6.11331 10.045C6.10169 9.84714 6.16608 9.65227 6.29332 9.50025C6.42055 9.34824 6.60104 9.25054 6.79789 9.22712L6.88889 9.22168H10Z"
                                        fill="#9CA5B2"
                                      />
                                    </svg>
                                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                                      {quiz?.activeCount}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-10 tw-h-5">
                                <div className="tw-flex tw-justify-start tw-items-center  tw-top-0 tw-gap-1">
                                  <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <path
                                      d="M4.28425 12.9481L4.98425 13.0917C5.01689 12.9317 4.9937 12.7653 4.91854 12.6203L4.28425 12.9481ZM7.05068 15.7146L7.37854 15.0803C7.23353 15.0051 7.06715 14.9819 6.90711 15.0146L7.05068 15.7146ZM3.56997 16.4289L2.86997 16.2853C2.84628 16.4011 2.85168 16.5209 2.8857 16.6341C2.91972 16.7473 2.98129 16.8502 3.06489 16.9338C3.14849 17.0173 3.25151 17.0788 3.36472 17.1127C3.47793 17.1466 3.59778 17.1519 3.71354 17.1281L3.56997 16.4289ZM15.7128 10.0003C15.7128 11.5158 15.1108 12.9693 14.0392 14.0409C12.9675 15.1125 11.5141 15.7146 9.99854 15.7146V17.1431C13.9435 17.1431 17.1414 13.9453 17.1414 10.0003H15.7128ZM4.28425 10.0003C4.28425 8.48476 4.88629 7.03131 5.95793 5.95967C7.02957 4.88803 8.48302 4.28599 9.99854 4.28599V2.85742C6.05354 2.85742 2.85568 6.05528 2.85568 10.0003H4.28425ZM9.99854 4.28599C11.5141 4.28599 12.9675 4.88803 14.0392 5.95967C15.1108 7.03131 15.7128 8.48476 15.7128 10.0003H17.1414C17.1414 6.05528 13.9435 2.85742 9.99854 2.85742V4.28599ZM4.91854 12.6203C4.50017 11.8104 4.28263 10.9118 4.28425 10.0003H2.85568C2.85568 11.1796 3.1414 12.2939 3.64997 13.276L4.91854 12.6203ZM9.99854 15.7146C9.08701 15.716 8.18848 15.4985 7.37854 15.0803L6.72283 16.3489C7.73536 16.8721 8.85878 17.1445 9.99854 17.1431V15.7146ZM3.58425 12.8046L2.86997 16.2853L4.26997 16.5724L4.98425 13.0917L3.58425 12.8046ZM3.71354 17.1281L7.19425 16.4146L6.90711 15.0146L3.4264 15.7289L3.71354 17.1281Z"
                                      fill="#9CA5B2"
                                    />
                                    <path
                                      d="M7.85547 8.57129H12.1412"
                                      stroke="#9CA5B2"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M7.85547 11.4287H12.1412"
                                      stroke="#9CA5B2"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                                    {quiz?.answerCount}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="tw-flex tw-justify-between tw-items-center tw-text-base tw-text-black tw-font-bold tw-my-5 tw-mt-10">
                          <div>활성 퀴즈</div>
                          <div
                            onClick={() => {
                              setActiveQuizParams({ ...activeQuizParams, size: 15 });
                            }}
                            className="tw-text-[#9ca5b2] tw-cursor-pointer tw-text-sm"
                          >
                            전체보기 &gt;
                          </div>
                        </div>
                        {activeQuizSummary?.contents?.map((quiz, index) => (
                          <div
                            key={index}
                            className="tw-px-5 tw-mb-5 tw-flex tw-justify-between tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-h-[70px] tw-relative tw-overflow-hidden tw-rounded tw-bg-[#fdfdff] border"
                          >
                            <div className="tw-flex tw-justify-start tw-items-center  tw-gap-2">
                              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#2474ed]">
                                {index + 1}.
                              </p>
                              <p className="tw-w-[500px] tw-flex-grow-0 tw-flex-shrink-0 tw-text-base  tw-text-left tw-text-black tw-line-clamp-2">
                                {quiz?.question}
                              </p>
                            </div>
                            <div className="tw-flex tw-justify-start tw-items-center   tw-gap-2">
                              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-center tw-text-[#9ca5b2]">
                                {quiz?.memberName}
                              </p>
                              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2">
                                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-10 tw-h-5">
                                  <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-0 tw-gap-1">
                                    <svg
                                      width={20}
                                      height={20}
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                                      preserveAspectRatio="none"
                                    >
                                      <path
                                        d="M15.4444 2.22168C15.857 2.22168 16.2527 2.38557 16.5444 2.67729C16.8361 2.96901 17 3.36468 17 3.77724V13.1106C17 13.5231 16.8361 13.9188 16.5444 14.2105C16.2527 14.5022 15.857 14.6661 15.4444 14.6661H13.8889V16.2217C13.8889 16.6342 13.725 17.0299 13.4333 17.3216C13.1416 17.6133 12.7459 17.7772 12.3333 17.7772H4.55556C4.143 17.7772 3.74733 17.6133 3.45561 17.3216C3.16389 17.0299 3 16.6342 3 16.2217V6.88835C3 6.47579 3.16389 6.08013 3.45561 5.7884C3.74733 5.49668 4.143 5.33279 4.55556 5.33279H6.11111V3.77724C6.11111 3.36468 6.275 2.96901 6.56672 2.67729C6.85845 2.38557 7.25411 2.22168 7.66667 2.22168H15.4444ZM12.3333 6.88835H4.55556V16.2217H12.3333V6.88835ZM8.44444 12.3328C8.65072 12.3328 8.84855 12.4147 8.99442 12.5606C9.14028 12.7065 9.22222 12.9043 9.22222 13.1106C9.22222 13.3168 9.14028 13.5147 8.99442 13.6605C8.84855 13.8064 8.65072 13.8883 8.44444 13.8883H6.88889C6.68261 13.8883 6.48478 13.8064 6.33892 13.6605C6.19306 13.5147 6.11111 13.3168 6.11111 13.1106C6.11111 12.9043 6.19306 12.7065 6.33892 12.5606C6.48478 12.4147 6.68261 12.3328 6.88889 12.3328H8.44444ZM15.4444 3.77724H7.66667V5.33279H12.3333C12.7459 5.33279 13.1416 5.49668 13.4333 5.7884C13.725 6.08013 13.8889 6.47579 13.8889 6.88835V13.1106H15.4444V3.77724ZM10 9.22168C10.1982 9.2219 10.3889 9.29781 10.5331 9.4339C10.6772 9.56998 10.764 9.75598 10.7756 9.95388C10.7872 10.1518 10.7228 10.3466 10.5956 10.4987C10.4683 10.6507 10.2879 10.7484 10.091 10.7718L10 10.7772H6.88889C6.69065 10.777 6.49997 10.7011 6.35582 10.565C6.21167 10.4289 6.12493 10.2429 6.11331 10.045C6.10169 9.84714 6.16608 9.65227 6.29332 9.50025C6.42055 9.34824 6.60104 9.25054 6.79789 9.22712L6.88889 9.22168H10Z"
                                        fill="#9CA5B2"
                                      />
                                    </svg>
                                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                                      {quiz?.activeCount}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-10 tw-h-5">
                                <div className="tw-flex tw-justify-start tw-items-center  tw-top-0 tw-gap-1">
                                  <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <path
                                      d="M4.28425 12.9481L4.98425 13.0917C5.01689 12.9317 4.9937 12.7653 4.91854 12.6203L4.28425 12.9481ZM7.05068 15.7146L7.37854 15.0803C7.23353 15.0051 7.06715 14.9819 6.90711 15.0146L7.05068 15.7146ZM3.56997 16.4289L2.86997 16.2853C2.84628 16.4011 2.85168 16.5209 2.8857 16.6341C2.91972 16.7473 2.98129 16.8502 3.06489 16.9338C3.14849 17.0173 3.25151 17.0788 3.36472 17.1127C3.47793 17.1466 3.59778 17.1519 3.71354 17.1281L3.56997 16.4289ZM15.7128 10.0003C15.7128 11.5158 15.1108 12.9693 14.0392 14.0409C12.9675 15.1125 11.5141 15.7146 9.99854 15.7146V17.1431C13.9435 17.1431 17.1414 13.9453 17.1414 10.0003H15.7128ZM4.28425 10.0003C4.28425 8.48476 4.88629 7.03131 5.95793 5.95967C7.02957 4.88803 8.48302 4.28599 9.99854 4.28599V2.85742C6.05354 2.85742 2.85568 6.05528 2.85568 10.0003H4.28425ZM9.99854 4.28599C11.5141 4.28599 12.9675 4.88803 14.0392 5.95967C15.1108 7.03131 15.7128 8.48476 15.7128 10.0003H17.1414C17.1414 6.05528 13.9435 2.85742 9.99854 2.85742V4.28599ZM4.91854 12.6203C4.50017 11.8104 4.28263 10.9118 4.28425 10.0003H2.85568C2.85568 11.1796 3.1414 12.2939 3.64997 13.276L4.91854 12.6203ZM9.99854 15.7146C9.08701 15.716 8.18848 15.4985 7.37854 15.0803L6.72283 16.3489C7.73536 16.8721 8.85878 17.1445 9.99854 17.1431V15.7146ZM3.58425 12.8046L2.86997 16.2853L4.26997 16.5724L4.98425 13.0917L3.58425 12.8046ZM3.71354 17.1281L7.19425 16.4146L6.90711 15.0146L3.4264 15.7289L3.71354 17.1281Z"
                                      fill="#9CA5B2"
                                    />
                                    <path
                                      d="M7.85547 8.57129H12.1412"
                                      stroke="#9CA5B2"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M7.85547 11.4287H12.1412"
                                      stroke="#9CA5B2"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                                    {quiz?.answerCount}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="tw-py-5 tw-px-7 border tw-rounded-lg tw-mt-10">
                        <div className="tw-flex tw-gap-5 tw-items-center tw-mb-10">
                          <div className="tw-text-lg tw-text-black tw-font-bold">클럽 통계</div>
                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="tw-w-5 tw-h-5 tw-relative"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <rect x="0.5" y="0.5" width={19} height={19} rx="3.5" fill="white" />
                            <rect x="0.5" y="0.5" width={19} height={19} rx="3.5" stroke="#E0E4EB" />
                            <path
                              d="M15 9.37383C14.8472 8.27191 14.3369 7.2509 13.5479 6.46809C12.7589 5.68527 11.7348 5.18408 10.6335 5.04171C9.53224 4.89934 8.41476 5.12369 7.45325 5.68021C6.49174 6.23673 5.73953 7.09453 5.3125 8.12149M5 5.61681V8.12149H7.5M5 10.6262C5.15285 11.7281 5.66308 12.7491 6.4521 13.5319C7.24112 14.3147 8.26515 14.8159 9.36646 14.9583C10.4678 15.1007 11.5852 14.8763 12.5467 14.3198C13.5083 13.7633 14.2605 12.9055 14.6875 11.8785M15 14.3832V11.8785H12.5"
                              stroke="#6A7380"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="tw-flex tw-justify-between tw-items-center tw-text-base tw-text-black tw-font-bold tw-my-5 tw-mt-10">
                          <div>클럽 답변 & 리액션</div>
                          <div
                            onClick={() => {
                              setClubParams({ ...clubParams, size: 15 });
                            }}
                            className="tw-text-[#9ca5b2] tw-cursor-pointer tw-text-sm"
                          >
                            전체보기 &gt;
                          </div>
                        </div>

                        {clubSummary?.contents?.map((quiz, index) => (
                          <div
                            key={index}
                            className="tw-p-5 tw-mb-5 tw-flex tw-justify-between tw-self-stretch tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-overflow-hidden tw-rounded tw-bg-[#fdfdff] border"
                          >
                            <div className="tw-flex tw-justify-start tw-items-center  tw-gap-2">
                              <div className="tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
                                <div className="tw-flex tw-flex-row tw-justify-start tw-items-center tw-gap-1">
                                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#2474ed]">
                                    {index + 1}.
                                  </p>
                                  <p className="tw-w-[500px] tw-flex-grow-0 tw-flex-shrink-0 tw-text-base  tw-text-left tw-text-black tw-line-clamp-1">
                                    {quiz?.club?.clubName}
                                  </p>
                                </div>
                                <div className="tw-pl-4 tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm  tw-text-left tw-text-gray-400 tw-line-clamp-1">
                                  <span className="tw-text-black tw-pr-3">{quiz?.club?.leaderNickname}</span> |
                                  <span className="tw-text-gray-400 tw-px-2">
                                    {quiz?.club?.startAt.split(' ')[0]} ~ {quiz?.club?.endAt.split(' ')[0]}
                                  </span>
                                  {quiz?.club?.studyCycle?.length > 0 ? `| ${quiz?.club?.studyCycle.toString()} ` : ''}{' '}
                                  | &nbsp;퀴즈클럽 : {quiz?.club?.weekCount} 주 | 학습 : {quiz?.club?.weekCount}회
                                </div>
                              </div>
                            </div>
                            <div className="tw-flex tw-justify-start tw-items-center   tw-gap-2">
                              <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-2">
                                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-h-5">
                                  <div className="tw-flex tw-justify-start tw-items-center tw-top-0 tw-gap-1">
                                    <svg
                                      width={21}
                                      height={20}
                                      viewBox="0 0 21 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                                      preserveAspectRatio="xMidYMid meet"
                                    >
                                      <path
                                        d="M4.99519 12.9481L5.69519 13.0917C5.72783 12.9317 5.70464 12.7653 5.62948 12.6203L4.99519 12.9481ZM7.76162 15.7146L8.08948 15.0803C7.94447 15.0051 7.77808 14.9819 7.61805 15.0146L7.76162 15.7146ZM4.28091 16.4289L3.58091 16.2853C3.55721 16.4011 3.56262 16.5209 3.59664 16.6341C3.63066 16.7473 3.69223 16.8502 3.77583 16.9338C3.85943 17.0173 3.96245 17.0788 4.07566 17.1127C4.18886 17.1466 4.30872 17.1519 4.42448 17.1281L4.28091 16.4289ZM16.4238 10.0003C16.4238 11.5158 15.8217 12.9693 14.7501 14.0409C13.6785 15.1125 12.225 15.7146 10.7095 15.7146V17.1431C14.6545 17.1431 17.8523 13.9453 17.8523 10.0003H16.4238ZM4.99519 10.0003C4.99519 8.48476 5.59723 7.03131 6.66887 5.95967C7.7405 4.88803 9.19395 4.28599 10.7095 4.28599V2.85742C6.76448 2.85742 3.56662 6.05528 3.56662 10.0003H4.99519ZM10.7095 4.28599C12.225 4.28599 13.6785 4.88803 14.7501 5.95967C15.8217 7.03131 16.4238 8.48476 16.4238 10.0003H17.8523C17.8523 6.05528 14.6545 2.85742 10.7095 2.85742V4.28599ZM5.62948 12.6203C5.21111 11.8104 4.99357 10.9118 4.99519 10.0003H3.56662C3.56662 11.1796 3.85234 12.2939 4.36091 13.276L5.62948 12.6203ZM10.7095 15.7146C9.79795 15.716 8.89942 15.4985 8.08948 15.0803L7.43376 16.3489C8.4463 16.8721 9.56972 17.1445 10.7095 17.1431V15.7146ZM4.29519 12.8046L3.58091 16.2853L4.98091 16.5724L5.69519 13.0917L4.29519 12.8046ZM4.42448 17.1281L7.90519 16.4146L7.61805 15.0146L4.13734 15.7289L4.42448 17.1281Z"
                                        fill="#9CA5B2"
                                      />
                                    </svg>
                                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                                      {quiz?.answerReplyCount}
                                    </p>
                                  </div>
                                </div>
                                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                                  <svg
                                    width={21}
                                    height={20}
                                    viewBox="0 0 21 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <path
                                      d="M10.7109 15.9947C10.2594 15.6135 9.74914 15.2171 9.20944 14.7953H9.20244C7.30195 13.316 5.14805 11.6422 4.19675 9.63656C3.88422 8.99803 3.71859 8.30332 3.71095 7.59893C3.70886 6.63241 4.11609 5.70588 4.84062 5.02874C5.56514 4.3516 6.5458 3.98102 7.56094 4.00075C8.38738 4.00199 9.19603 4.22935 9.89054 4.65575C10.1957 4.8443 10.4718 5.07238 10.7109 5.33341C10.9514 5.0734 11.2276 4.84546 11.532 4.65575C12.2262 4.22927 13.0347 4.00189 13.8609 4.00075C14.8761 3.98102 15.8567 4.3516 16.5813 5.02874C17.3058 5.70588 17.713 6.63241 17.7109 7.59893C17.7038 8.30445 17.5381 9.00035 17.2251 9.63989C16.2738 11.6455 14.1206 13.3187 12.2201 14.7953L12.2131 14.8006C11.6727 15.2197 11.1631 15.6162 10.7116 16L10.7109 15.9947ZM7.56094 5.33341C6.9089 5.32564 6.28 5.56319 5.81095 5.99441C5.35902 6.41697 5.10644 6.99593 5.11089 7.59893C5.11888 8.11233 5.24103 8.61831 5.46935 9.08351C5.91841 9.94887 6.52432 10.732 7.25925 11.397C7.95294 12.0633 8.75094 12.7083 9.44114 13.2507C9.63224 13.4007 9.82684 13.5519 10.0214 13.7032L10.1439 13.7985C10.3308 13.9437 10.524 14.0943 10.7109 14.2422L10.72 14.2342L10.7242 14.2309H10.7284L10.7347 14.2262H10.7382H10.7417L10.7543 14.2162L10.783 14.1943L10.7879 14.1903L10.7956 14.1849H10.7998L10.8061 14.1796L11.2709 13.8164L11.3927 13.7212C11.5894 13.5686 11.784 13.4173 11.9751 13.2674C12.6653 12.725 13.464 12.0807 14.1577 11.411C14.8927 10.7464 15.4987 9.9634 15.9476 9.09817C16.1801 8.62894 16.304 8.11767 16.3109 7.59893C16.3138 6.99779 16.0614 6.42105 15.6109 5.99974C15.1428 5.56657 14.5138 5.32707 13.8609 5.33341C13.0643 5.32696 12.3027 5.64483 11.7679 6.20696L10.7109 7.36638L9.65394 6.20696C9.11919 5.64483 8.3576 5.32696 7.56094 5.33341Z"
                                      fill="#9CA5B2"
                                    />
                                  </svg>
                                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                                    {quiz?.answerReactionCount}
                                  </p>
                                </div>
                                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                                  <svg
                                    width={15}
                                    height={16}
                                    viewBox="0 0 15 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="flex-grow-0 flex-shrink-0 w-5 h-5 "
                                    preserveAspectRatio="none"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M7.85594 2.21297C4.6596 2.21297 2.06845 4.80412 2.06845 8.00046C2.06845 8.9583 2.30061 9.85992 2.71112 10.654C2.78241 10.7919 2.80428 10.9501 2.77307 11.1022L2.26151 13.5949L4.75422 13.0833C4.90629 13.0521 5.06446 13.074 5.20236 13.1453C5.99648 13.5558 6.89811 13.788 7.85594 13.788C11.0523 13.788 13.6434 11.1968 13.6434 8.00046C13.6434 4.80412 11.0523 2.21297 7.85594 2.21297ZM0.710949 8.00046C0.710949 4.05439 3.90987 0.855469 7.85594 0.855469C11.802 0.855469 15.0009 4.05439 15.0009 8.00046C15.0009 11.9465 11.802 15.1455 7.85594 15.1455C6.76324 15.1455 5.72623 14.8997 4.79868 14.46L1.52615 15.1316C1.30266 15.1775 1.07108 15.108 0.909751 14.9467C0.748425 14.7853 0.678941 14.5537 0.724806 14.3303L1.3964 11.0577C0.956692 10.1302 0.710949 9.09317 0.710949 8.00046Z"
                                      fill="#9CA5B2"
                                    />
                                    <path
                                      d="M8 10.9978C7.8065 10.839 7.5878 10.6738 7.3565 10.498H7.3535C6.539 9.88168 5.61591 9.18425 5.20821 8.34857C5.07426 8.08251 5.00328 7.79305 5 7.49955C4.99911 7.09684 5.17364 6.71078 5.48415 6.42864C5.79466 6.1465 6.21494 5.99209 6.65 6.00031C7.00419 6.00083 7.35075 6.09556 7.6484 6.27323C7.77919 6.35179 7.89753 6.44682 8 6.55559C8.10305 6.44725 8.22141 6.35227 8.3519 6.27323C8.64942 6.09553 8.9959 6.00079 9.35 6.00031C9.78506 5.99209 10.2053 6.1465 10.5159 6.42864C10.8264 6.71078 11.0009 7.09684 11 7.49955C10.9969 7.79352 10.9259 8.08348 10.7918 8.34995C10.3841 9.18564 9.4613 9.88279 8.6468 10.498L8.6438 10.5003C8.4122 10.6749 8.1938 10.8401 8.0003 11L8 10.9978Z"
                                      fill="#9CA5B2"
                                    />
                                  </svg>
                                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                                    {quiz?.answerReplyReactionCount}
                                  </p>
                                </div>
                                <div className="tw-flex tw-justify-start tw-items-center  tw-gap-1">
                                  <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <path
                                      d="M4.28425 12.9481L4.98425 13.0917C5.01689 12.9317 4.9937 12.7653 4.91854 12.6203L4.28425 12.9481ZM7.05068 15.7146L7.37854 15.0803C7.23353 15.0051 7.06715 14.9819 6.90711 15.0146L7.05068 15.7146ZM3.56997 16.4289L2.86997 16.2853C2.84628 16.4011 2.85168 16.5209 2.8857 16.6341C2.91972 16.7473 2.98129 16.8502 3.06489 16.9338C3.14849 17.0173 3.25151 17.0788 3.36472 17.1127C3.47793 17.1466 3.59778 17.1519 3.71354 17.1281L3.56997 16.4289ZM15.7128 10.0003C15.7128 11.5158 15.1108 12.9693 14.0392 14.0409C12.9675 15.1125 11.5141 15.7146 9.99854 15.7146V17.1431C13.9435 17.1431 17.1414 13.9453 17.1414 10.0003H15.7128ZM4.28425 10.0003C4.28425 8.48476 4.88629 7.03131 5.95793 5.95967C7.02957 4.88803 8.48302 4.28599 9.99854 4.28599V2.85742C6.05354 2.85742 2.85568 6.05528 2.85568 10.0003H4.28425ZM9.99854 4.28599C11.5141 4.28599 12.9675 4.88803 14.0392 5.95967C15.1108 7.03131 15.7128 8.48476 15.7128 10.0003H17.1414C17.1414 6.05528 13.9435 2.85742 9.99854 2.85742V4.28599ZM4.91854 12.6203C4.50017 11.8104 4.28263 10.9118 4.28425 10.0003H2.85568C2.85568 11.1796 3.1414 12.2939 3.64997 13.276L4.91854 12.6203ZM9.99854 15.7146C9.08701 15.716 8.18848 15.4985 7.37854 15.0803L6.72283 16.3489C7.73536 16.8721 8.85878 17.1445 9.99854 17.1431V15.7146ZM3.58425 12.8046L2.86997 16.2853L4.26997 16.5724L4.98425 13.0917L3.58425 12.8046ZM3.71354 17.1281L7.19425 16.4146L6.90711 15.0146L3.4264 15.7289L3.71354 17.1281Z"
                                      fill="#9CA5B2"
                                    />
                                    <path
                                      d="M7.85547 8.57129H12.1412"
                                      stroke="#9CA5B2"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M7.85547 11.4287H12.1412"
                                      stroke="#9CA5B2"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                                    {quiz?.answerCount}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Desktop>
            </>
          )}
          <div className="tw-mt-10">{/* <Pagination page={page} setPage={setPage} total={totalPage} /> */}</div>
        </div>
      </section>
    </div>
  );
}
