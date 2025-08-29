// QuizClubDetailInfo.jsx
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

/** import pagenation */
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
/**icon */
import SearchIcon from '@mui/icons-material/Search';
import router from 'next/router';

import { CommunityCard } from 'src/stories/components';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { Button, Typography, Profile, Modal, ArticleCard } from 'src/stories/components';
const cx = classNames.bind(styles);

//comment
import { useQuizAnswerDetail, useQuizRankDetail, useQuizSolutionDetail } from 'src/services/quiz/quiz.queries';

const QuizClubListView = ({
  clubInfo,
  totalElements,
  quizList,
  border,
  page,
  totalPage,
  leaders,
  clubQuizzes,
  handlePageChange,
  representativeQuizzes,
}) => {
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
  // const [activeTab, setActiveTab] = useState('myQuiz');
  const [activeTab, setActiveTab] = useState('community');
  const [selectedOption, setSelectedOption] = useState('latest');
  const [answerContents, setAnswerContents] = useState<any[]>([]);
  const [totalElementsCm, setTotalElementsCm] = useState(0);
  const [totalPageCm, setTotalPageCm] = useState(1);
  const [beforeOnePick, setBeforeOnePick] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isResultOpen, setIsResultOpen] = useState<boolean>(false);

  const [params, setParams] = useState<any>({ id: '225', page });

  const { isFetched: isQuizAnswerListFetched } = useQuizAnswerDetail(params, data => {
    //console.log(data);
    setAnswerContents(data?.contents);
    setTotalElementsCm(data?.totalElements);
    setTotalPageCm(data?.totalPages);
    // isOnePicked가 true인 객체를 찾고 그 객체의 clubQuizAnswerSequence 값을 가져옵니다.
    console.log(data?.contents.find(item => item.isOnePicked === true)?.clubQuizAnswerSequence);
    setBeforeOnePick(data?.contents.find(item => item.isOnePicked === true)?.clubQuizAnswerSequence);
  });

  const handleChangeQuiz = event => {
    setSelectedOption(event.target.value);
  };

  const [selected, setSelected] = useState(null);

  const handleToggle = num => {
    setSelected(num);
  };

  const handleTabClick = tab => {
    setActiveTab(tab);
  };

  const dateInfo = {
    student: [
      {
        name: '김승테',
        answers: '서킷브레이커가 실행(오픈)되면 Fail Fast 함으로써 외부...',
        date: '24.06.12ㅣ18:30:25',
      },
      {
        name: '김승테',
        answers:
          'CircuitBreaker를 제공하는 라이브러리 중에CircuitBreaker를 제공하는 라이브러리 중에CircuitBreaker를 제공하는 라이브러리 중에CircuitBreaker를 제공하는 라이브러리 중에...',
        date: '24.06.12ㅣ18:30:25',
      },
      {
        name: '김승테',
        answers: '외부 API를 호출하는 메서드 위에 @CircuitBreaker ...',
        date: '24.06.12ㅣ18:30:25',
      },
      {
        name: '김승테',
        answers: '각 모듈마다 장애 전파를 막을 수 있기 때문에 분산...',
        date: '24.06.12ㅣ18:30:25',
      },
      {
        name: '김승테',
        answers: '',
        date: '24.06.12ㅣ18:30:25',
      },
    ],
  };

  return (
    <div className={`tw-relative tw-overflow-hidden tw-bg-white ${borderStyle}`}>
      <div className="tw-pt-[35px]">
        <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden border-t-0 border-r-0 border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">나의 클럽</p>
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
              퀴즈 목록 전체보기
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
              전체 답변보기
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              전체 답변보기 & 채점하기
            </p>
          </div>
        </div>
        <Divider className="tw-pb-3" />
        {/* Content Section */}
        <div className=" tw-w-[1120px] tw-h-12 tw-overflow-hidden tw-flex tw-items-center tw-gap-8 tw-my-5">
          <div className="tw-flex tw-items-center tw-gap-4">
            <p className="tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">퀴즈선택</p>
            <div className="">
              <select
                className="tw-w-[200px] tw-text-[#e11837] tw-h-12 tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb] tw-flex tw-items-center tw-pl-5 form-select"
                aria-label="Default select example"
              >
                <option selected>5회. 10-01 (화)</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
              {/* <p className="tw-text-sm tw-font-medium tw-text-left tw-text-[#e11837]">5회. 10-01 (화)</p>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-w-7 tw-h-7 tw-ml-auto tw-mr-4"
                preserveAspectRatio="none"
              >
                <path
                  d="M14.0141 20.1948L22.4281 11.7808L20.4499 9.7998L14.0141 16.2398L7.5797 9.7998L5.6001 11.7794L14.0141 20.1948Z"
                  fill="#9CA5B2"
                ></path>
              </svg> */}
            </div>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-gap-8">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left">
              <span className="tw-text-[#31343d]">퀴즈제출 : </span>
              <span className="tw-text-[#e11837]">24명</span>
              <span className="tw-text-[#31343d]"> / 30명</span>
            </p>
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left">
              <span className="tw-text-[#31343d]">오늘 제출된 답변 : </span>
              <span className="tw-text-[#e11837]">8개</span>
            </p>
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left">
              <span className="tw-text-[#31343d]">피드백 현황 : </span>
              <span className="tw-text-[#e11837]">16개</span>
              <span className="tw-text-[#31343d]"> / 24개 (8개 남음)</span>
            </p>
          </div>
        </div>
        <div className="tw-my-10 tw-h-[100px] tw-rounded-lg tw-bg-white border border-secondary tw-flex tw-justify-center tw-items-center">
          <p className="tw-text-base tw-font-bold tw-text-center tw-text-black">
            Q. Spring에서 적용가능한 Circuit breaker 라이브러리와 특징에 대해서 설명하세요.
          </p>
        </div>
      </div>
      <div className="tw-ml-auto tw-flex tw-w-[170px] tw-justify-center tw-justify-start tw-items-center tw-relative tw-gap-1 tw-px-3 tw-py-[8px] tw-rounded tw-bg-[#31343d]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-3.5 tw-h-3.5 tw-relative"
          preserveAspectRatio="none"
        >
          <g clipPath="url(#clip0_804_29965)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.17539 1.22496C6.38189 1.01874 6.65817 0.897392 6.94974 0.884865C7.2413 0.872339 7.52697 0.969541 7.75039 1.15729L7.82506 1.22554L8.93339 2.33329H10.5002C10.7945 2.33335 11.0778 2.44458 11.2935 2.6447C11.5092 2.84482 11.6413 3.11905 11.6634 3.41246L11.6669 3.49996V5.06679L12.7752 6.17513C12.9816 6.38165 13.1031 6.65805 13.1156 6.94975C13.1281 7.24146 13.0308 7.52725 12.8429 7.75071L12.7746 7.82479L11.6663 8.93313V10.5C11.6664 10.7943 11.5552 11.0778 11.3551 11.2936C11.155 11.5094 10.8806 11.6416 10.5871 11.6637L10.5002 11.6666H8.93398L7.82564 12.775C7.61912 12.9813 7.34272 13.1028 7.05102 13.1153C6.75931 13.1279 6.47352 13.0305 6.25006 12.8426L6.17598 12.775L5.06764 11.6666H3.50023C3.20589 11.6667 2.9224 11.5556 2.70657 11.3554C2.49075 11.1553 2.35855 10.881 2.33648 10.5875L2.33356 10.5V8.93313L1.22523 7.82479C1.01884 7.61827 0.897392 7.34187 0.884864 7.05017C0.872337 6.75846 0.96964 6.47267 1.15756 6.24921L1.22523 6.17513L2.33356 5.06679V3.49996C2.33361 3.20572 2.44484 2.92238 2.64496 2.70668C2.84509 2.49098 3.11932 2.35886 3.41273 2.33679L3.50023 2.33329H5.06706L6.17539 1.22496ZM8.79631 5.24004L6.32064 7.71571L5.28931 6.68438C5.17985 6.575 5.03143 6.51358 4.87669 6.51363C4.72195 6.51369 4.57357 6.57521 4.46419 6.68467C4.35481 6.79413 4.29339 6.94255 4.29344 7.09729C4.2935 7.25203 4.35502 7.40041 4.46448 7.50979L5.86681 8.91213C5.9264 8.97174 5.99715 9.01904 6.07502 9.0513C6.15289 9.08357 6.23635 9.10017 6.32064 9.10017C6.40493 9.10017 6.4884 9.08357 6.56627 9.0513C6.64414 9.01904 6.71489 8.97174 6.77448 8.91213L9.62114 6.06488C9.7274 5.95486 9.7862 5.80751 9.78487 5.65456C9.78354 5.50161 9.72219 5.3553 9.61404 5.24715C9.50588 5.13899 9.35958 5.07765 9.20663 5.07632C9.05368 5.07499 8.90633 5.13378 8.79631 5.24004Z"
              fill="white"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_804_29965">
              <rect width="14" height="14" fill="white"></rect>
            </clipPath>
          </defs>
        </svg>
        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-white">
          AI 피드백 및 채점하기
        </p>
      </div>
      <TableContainer className="tw-py-5" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
        <Table style={{ width: '100%' }}>
          <TableHead style={{ backgroundColor: '#F6F7FB' }}>
            <TableRow>
              <TableCell align="center">등록순</TableCell>
              <TableCell align="center" width={120}>
                이름
              </TableCell>
              <TableCell align="center" width={400}>
                답변
              </TableCell>
              <TableCell align="center">날짜</TableCell>
              <TableCell align="center">AI채점/교수채점</TableCell>
              <TableCell align="center">상세보기</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dateInfo.student.map((info, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell padding="none" align="center" component="th" scope="row">
                  <div className={info.answers ? 'tw-text-black' : 'tw-text-gray-400'}>{index}</div>
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  <div className="tw-flex tw-items-center tw-gap-3">
                    <img
                      className={info.answers ? '' : 'tw-opacity-50'}
                      src="/assets/images/quiz/아그리파_1.png"
                      alt="아그리파"
                    />
                    <div className={info.answers ? 'tw-text-black' : 'tw-text-gray-400'}>{info.name}</div>
                  </div>
                </TableCell>
                {info.answers ? (
                  <>
                    <TableCell align="left" component="th" scope="row">
                      <div className="tw-line-clamp-2">{info.answers}</div>
                    </TableCell>
                    <TableCell align="left" component="th" scope="row">
                      <div className="tw-text-gray-400 tw-text-[12px]">{info.date}</div>
                    </TableCell>
                    <TableCell align="left" component="th" scope="row">
                      <div className="tw-flex tw-justify-center tw-items-center tw-gap-1">
                        <input
                          maxLength={3}
                          style={{ padding: 0, height: 25, width: 35, textAlign: 'center', backgroundColor: '#F6F7FB' }}
                          type="text"
                          className="tw-bg-[#F6F7FB] tw-rounded"
                          aria-label="Recipient's username with two button addons"
                        />
                        <p className="tw-text-xl tw-text-center tw-text-[#31343d]">/</p>
                        <input
                          maxLength={3}
                          style={{ padding: 0, height: 25, width: 35, textAlign: 'center' }}
                          type="text"
                          className="tw-bg-[#F6F7FB] tw-rounded"
                          aria-label="Recipient's username with two button addons"
                        />
                      </div>
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      <div className="tw-flex tw-justify-center tw-items-center tw-gap-3">
                        <button
                          className="tw-w-24 max-lg:tw-mr-1 tw-bg-black tw-rounded-md tw-text-xs tw-text-white tw-py-2.5 tw-px-4"
                          onClick={() => (location.href = '/my-clubs')}
                        >
                          AI답변보기
                        </button>
                        <button
                          className="tw-w-24 max-lg:tw-mr-1 tw-bg-[#e11837] tw-rounded-md tw-text-xs tw-text-white tw-py-2.5 tw-px-4"
                          onClick={() => setIsModalOpen(true)}
                        >
                          채점하기
                        </button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <TableCell align="center" colSpan={4} component="th" scope="row">
                    <div className="tw-text-gray-300 tw-text-base">퀴즈 미참여</div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={isModalOpen}
        onAfterClose={() => setIsModalOpen(false)}
        title="상세답변보기"
        maxWidth="1000px"
        maxHeight="700px"
      >
        <div className={cx('seminar-check-popup')}>
          <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-h-20">
            <div className="tw-h-20 tw-overflow-hidden tw-rounded-tl-lg tw-rounded-tr-lg tw-bg-[#f6f7fb] tw-border tw-relative">
              <div className="tw-flex tw-flex-col tw-justify-start tw-items-center tw-absolute tw-top-[13px] tw-left-4 tw-gap-[3px]">
                <img className="tw-flex-grow-0 tw-flex-shrink-0" src="/assets/images/quiz/ellipse_209_2.png" />
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10px] tw-text-center tw-text-black">
                  양황규 교수님
                </div>
              </div>
              <div className="tw-left-[94px] tw-top-7 tw-text-base tw-font-bold tw-text-left tw-text-black tw-absolute">
                Spring에서 적용가능한 Circuit breaker 라이브러리와 특징에 대해서 설명하세요.
              </div>
            </div>
          </div>
          <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[880px] tw-h-[156px] tw-relative tw-overflow-hidden border tw-border-r tw-border-b tw-border-l tw-border-[#e9ecf2]">
            <div className="tw-absolute tw-left-[149px] tw-top-[114px] tw-text-xs tw-text-left tw-text-[#478af5]">
              ㄴ 첨부된 파일 : 240000_퀴즈과제제출_김승태.pdf
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-w-6 tw-h-6 tw-absolute tw-left-4 tw-top-4"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                stroke="#9CA5B2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[52px] tw-top-4 tw-gap-5">
              <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[77px] tw-h-9">
                <p className="tw-absolute tw-left-11 tw-top-[9px] tw-text-xs tw-text-left tw-text-black">김승태</p>
                <img
                  alt="아그리파_1"
                  className="tw-absolute tw-left-[-0.5px] tw-top-[-0.5px]"
                  src="/assets/images/quiz/아그리파_1.png"
                />
              </div>
              <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-text-left tw-text-[#31343d]">
                  사전답변
                </div>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#9ca5b2]">
                  24.06.12ㅣ18:30:25
                </p>
              </div>
            </div>
            <div className="tw-w-[691px] tw-absolute tw-left-[149px] tw-top-[60px] tw-text-sm tw-text-left tw-text-[#31343d]">
              EAI는 엔터프라이즈 어플리케이션 인테그레이션의 약자입니다. 시스템이 서로 얽히고 복잡해지면서 통제가 잘
              안되는 상황이 발생하여 이런 문제를 해결하기 위해 등장한 솔루션이 바로 EAI 입니다.
            </div>
          </div>
          <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[880px] tw-h-[156px] tw-relative tw-overflow-hidden border-left border-right border-bottom tw-border-[#e9ecf2]">
            <div className="tw-absolute tw-left-[149px] tw-top-[114px] tw-text-xs tw-text-left tw-text-[#478af5]">
              ㄴ 첨부된 파일 : 240000_퀴즈과제제출_김승태.pdf
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-w-6 tw-h-6 tw-absolute tw-left-4 tw-top-4"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                stroke="#9CA5B2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[52px] tw-top-4 tw-gap-5">
              <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[77px] tw-h-9">
                <p className="tw-absolute tw-left-11 tw-top-[9px] tw-text-xs tw-text-left tw-text-black">김승태</p>
                <img
                  alt="아그리파_1"
                  className="tw-absolute tw-left-[-0.5px] tw-top-[-0.5px]"
                  src="/assets/images/quiz/아그리파_1.png"
                />
              </div>
              <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-text-left tw-text-[#31343d]">
                  사전답변
                </p>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#9ca5b2]">
                  24.06.12ㅣ18:30:25
                </p>
              </div>
            </div>
            <p className="tw-w-[691px] tw-absolute tw-left-[149px] tw-top-[60px] tw-text-sm tw-text-left tw-text-[#31343d]">
              EAI는 엔터프라이즈 어플리케이션 인테그레이션의 약자입니다. 시스템이 서로 얽히고 복잡해지면서 통제가 잘
              안되는 상황이 발생하여 이런 문제를 해결하기 위해 등장한 솔루션이 바로 EAI 입니다.
            </p>
          </div>
          {!isResultOpen && (
            <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[880px] tw-h-[148px] tw-relative tw-overflow-hidden tw-rounded-bl-lg tw-rounded-br-lg border-bottom border-left border-right">
              <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[52px] tw-top-4 tw-gap-3">
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[113px] tw-h-9">
                  <p className="tw-absolute tw-left-11 tw-top-[9px] tw-text-xs tw-text-left tw-text-black">
                    양황규 교수님
                  </p>
                  <img
                    alt="ellipse_209_2"
                    className="tw-absolute tw-left-[-0.5px] tw-top-[-0.5px]"
                    src="/assets/images/quiz/ellipse_209_2.png"
                  />
                </div>
              </div>
              <svg
                width="7"
                height="17"
                viewBox="0 0 7 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-w-[5.13px] tw-h-[14.8px]"
                preserveAspectRatio="none"
              >
                <path
                  d="M2.0133 7.67739V8.17739V7.67739ZM1.28027 14.2552H0.780273H1.28027ZM1.87982 7.67739C1.87982 7.95353 2.10367 8.17739 2.37982 8.17739C2.65596 8.17739 2.87982 7.95353 2.87982 7.67739H1.87982ZM3.84587 1.09961V0.599609V1.09961ZM5.31193 4.3885H5.81193H5.31193ZM4.81193 7.67739C4.81193 7.95353 5.03578 8.17739 5.31193 8.17739C5.58807 8.17739 5.81193 7.95353 5.81193 7.67739H4.81193ZM1.78027 9.32183C1.78027 8.93621 1.84978 8.59115 1.95165 8.36261L1.03829 7.95546C0.865227 8.34371 0.780273 8.83518 0.780273 9.32183H1.78027ZM1.95165 8.36261C2.00234 8.24889 2.04884 8.19142 2.07314 8.16884C2.09497 8.14855 2.07412 8.17739 2.0133 8.17739V7.17739C1.50296 7.17739 1.19298 7.60843 1.03829 7.95546L1.95165 8.36261ZM2.0133 8.17739H5.67844V7.17739H2.0133V8.17739ZM5.67844 8.17739C5.61763 8.17739 5.59677 8.14855 5.6186 8.16884C5.6429 8.19142 5.6894 8.24889 5.74009 8.36261L6.65345 7.95546C6.49876 7.60843 6.18878 7.17739 5.67844 7.17739V8.17739ZM5.74009 8.36261C5.84196 8.59115 5.91147 8.93621 5.91147 9.32183H6.91147C6.91147 8.83518 6.82652 8.34371 6.65345 7.95546L5.74009 8.36261ZM5.91147 9.32183V14.2552H6.91147V9.32183H5.91147ZM5.91147 14.2552C5.91147 14.6408 5.84196 14.9858 5.74009 15.2144L6.65345 15.6215C6.82652 15.2333 6.91147 14.7418 6.91147 14.2552H5.91147ZM5.74009 15.2144C5.6894 15.3281 5.6429 15.3856 5.6186 15.4082C5.59677 15.4284 5.61763 15.3996 5.67844 15.3996V16.3996C6.18878 16.3996 6.49876 15.9686 6.65345 15.6215L5.74009 15.2144ZM5.67844 15.3996H2.0133V16.3996H5.67844V15.3996ZM2.0133 15.3996C2.07412 15.3996 2.09497 15.4284 2.07314 15.4082C2.04884 15.3856 2.00234 15.3281 1.95165 15.2144L1.03829 15.6215C1.19298 15.9686 1.50296 16.3996 2.0133 16.3996V15.3996ZM1.95165 15.2144C1.84978 14.9858 1.78027 14.6408 1.78027 14.2552H0.780273C0.780273 14.7418 0.865227 15.2333 1.03829 15.6215L1.95165 15.2144ZM1.78027 14.2552V9.32183H0.780273V14.2552H1.78027ZM2.97936 11.7885C2.97936 12.0571 3.0257 12.3394 3.13002 12.5735L4.04339 12.1663C4.01025 12.092 3.97936 11.956 3.97936 11.7885H2.97936ZM3.13002 12.5735C3.21599 12.7663 3.43274 13.1107 3.84587 13.1107V12.1107C3.95529 12.1107 4.02375 12.1612 4.04597 12.1819C4.06571 12.2002 4.05971 12.2029 4.04339 12.1663L3.13002 12.5735ZM3.84587 13.1107C4.259 13.1107 4.47576 12.7663 4.56172 12.5735L3.64835 12.1663C3.63203 12.2029 3.62603 12.2002 3.64578 12.1819C3.66799 12.1612 3.73646 12.1107 3.84587 12.1107V13.1107ZM4.56172 12.5735C4.66605 12.3394 4.71239 12.0571 4.71239 11.7885H3.71239C3.71239 11.956 3.68149 12.092 3.64835 12.1663L4.56172 12.5735ZM4.71239 11.7885C4.71239 11.5199 4.66605 11.2376 4.56172 11.0035L3.64835 11.4107C3.68149 11.485 3.71239 11.6209 3.71239 11.7885H4.71239ZM4.56172 11.0035C4.47576 10.8107 4.25901 10.4663 3.84587 10.4663V11.4663C3.73645 11.4663 3.66799 11.4158 3.64577 11.3951C3.62603 11.3768 3.63203 11.3741 3.64835 11.4107L4.56172 11.0035ZM3.84587 10.4663C3.43274 10.4663 3.21598 10.8107 3.13002 11.0035L4.04339 11.4107C4.05971 11.3741 4.06572 11.3768 4.04597 11.3951C4.02375 11.4158 3.95529 11.4663 3.84587 11.4663V10.4663ZM3.13002 11.0035C3.0257 11.2376 2.97936 11.5199 2.97936 11.7885H3.97936C3.97936 11.6209 4.01025 11.485 4.04339 11.4107L3.13002 11.0035ZM2.87982 7.67739V4.3885H1.87982V7.67739H2.87982ZM2.87982 4.3885C2.87982 3.56675 3.02655 2.80341 3.2659 2.26647L2.35253 1.85933C2.042 2.55597 1.87982 3.46571 1.87982 4.3885H2.87982ZM3.2659 2.26647C3.52361 1.68833 3.77298 1.59961 3.84587 1.59961V0.599609C3.14112 0.599609 2.64469 1.2039 2.35253 1.85933L3.2659 2.26647ZM3.84587 1.59961C3.91876 1.59961 4.16813 1.68833 4.42585 2.26647L5.33921 1.85933C5.04705 1.2039 4.55062 0.599609 3.84587 0.599609V1.59961ZM4.42585 2.26647C4.66519 2.80341 4.81193 3.56675 4.81193 4.3885H5.81193C5.81193 3.46571 5.64974 2.55597 5.33921 1.85933L4.42585 2.26647ZM4.81193 4.3885V7.67739H5.81193V4.3885H4.81193Z"
                  fill="white"
                ></path>
              </svg>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-w-6 tw-h-6 tw-absolute tw-left-4 tw-top-4"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                  stroke="#9CA5B2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>

              <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-56 tw-top-16 tw-gap-3">
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[260px] tw-h-12 tw-relative tw-overflow-hidden tw-rounded tw-bg-white border">
                  <p className="tw-absolute tw-left-[76px] tw-top-3.5 tw-text-sm tw-font-bold tw-text-center tw-text-[#6a7380]">
                    꼬리 질문 추가하기
                  </p>
                </div>
                <div
                  onClick={() => setIsResultOpen(true)}
                  className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-w-[260px] tw-h-12 tw-relative tw-overflow-hidden tw-rounded tw-bg-[#e11837]"
                >
                  <p className="tw-absolute tw-left-[101px] tw-top-3 tw-text-base tw-font-bold tw-text-center tw-text-white">
                    채점하기
                  </p>
                </div>
              </div>
            </div>
          )}
          {isResultOpen && (
            <div>
              <div className="tw-flex tw-pt-14">
                <div className="tw-flex tw-justify-start tw-items-center tw-top-[13px] tw-left-4 tw-gap-3">
                  <img alt="ellipse_209_2" className="tw-flex-shrink-0" src="/assets/images/quiz/ellipse_209_2.png" />
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12px] tw-text-center tw-text-black">
                    양황규 교수님
                  </p>
                </div>
                <div className="tw-px-3 tw-py-[px] tw-flex tw-items-center">
                  <button
                    className="tw-w-32 max-lg:tw-mr-1 tw-bg-black tw-rounded-md tw-text-xs tw-text-white tw-py-2 tw-px-4"
                    onClick={() => (location.href = '/my-clubs')}
                  >
                    AI답변 불러오기
                  </button>
                </div>
                <div className="tw-flex tw-justify-end tw-flex-grow">
                  <div className="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-text-sm">
                    교수 채점:
                    {[1, 2, 3, 4, 5].map(num => (
                      <div
                        key={num}
                        className={`tw-flex tw-justify-center tw-items-center tw-text-sm tw-w-7 tw-h-7 tw-rounded-full tw-border ${
                          selected === num ? 'tw-bg-red-500 tw-text-white' : 'tw-bg-gray-100 tw-text-black'
                        } tw-cursor-pointer`}
                        onClick={() => handleToggle(num)}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="tw-py-5">
                <textarea
                  className="tw-form-control tw-w-full tw-rounded"
                  placeholder="Leave a comment here"
                  id="floatingTextarea"
                  style={{ height: '80px', resize: 'none', padding: 10 }}
                ></textarea>
              </div>
              <div className="tw-mb-5">
                <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-5">
                  <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[120px] tw-h-[21px] tw-relative tw-flex tw-items-center">
                    <p className="tw-text-sm tw-text-left tw-text-[#31343d] tw-mb-0 tw-ml-6">지식콘텐츠 추가</p>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-w-4 tw-h-4 tw-absolute tw-left-0 tw-top-1/2 tw-transform tw--translate-y-1/2"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M15.9986 5.15045C15.9711 6.17832 15.5703 7.15593 14.8788 7.88172L12.3521 10.5433C11.9975 10.9189 11.5756 11.2166 11.1109 11.4192C10.6462 11.6218 10.148 11.7252 9.6451 11.7236H9.64147C9.13017 11.7232 8.62414 11.6148 8.15325 11.405C7.68237 11.1951 7.25618 10.888 6.89987 10.5017C6.54355 10.1155 6.26433 9.65792 6.07869 9.15608C5.89305 8.65425 5.80477 8.11832 5.81905 7.57995C5.82208 7.4602 5.86938 7.34644 5.95087 7.26289C6.03236 7.17934 6.1416 7.1326 6.25532 7.13265H6.26768C6.38327 7.13605 6.49285 7.18766 6.57233 7.27613C6.65182 7.3646 6.69471 7.48269 6.69158 7.60445C6.68031 8.02017 6.74827 8.43406 6.89146 8.82163C7.03465 9.20921 7.25016 9.56261 7.52524 9.86094C7.80032 10.1593 8.12939 10.3965 8.493 10.5585C8.85661 10.7206 9.24737 10.8042 9.64219 10.8045C10.0303 10.8054 10.4147 10.7254 10.7733 10.5689C11.1318 10.4125 11.4574 10.1828 11.7312 9.89302L14.2579 7.23222C14.7915 6.64455 15.0856 5.86019 15.0771 5.047C15.0687 4.23382 14.7583 3.45644 14.2126 2.88125C13.6668 2.30606 12.929 1.97876 12.157 1.96942C11.385 1.96007 10.6403 2.26942 10.0821 2.83124L9.28227 3.67375C9.20041 3.75999 9.08938 3.80843 8.97361 3.80843C8.85784 3.80843 8.74682 3.75999 8.66496 3.67375C8.5831 3.58752 8.53711 3.47057 8.53711 3.34862C8.53711 3.22667 8.5831 3.10972 8.66496 3.02349L9.46478 2.18098C9.82008 1.80657 10.2419 1.50957 10.7062 1.30693C11.1705 1.1043 11.6681 1 12.1707 1C12.6733 1 13.1709 1.1043 13.6352 1.30693C14.0995 1.50957 14.5213 1.80657 14.8766 2.18098C15.2453 2.56976 15.5348 3.03356 15.7277 3.54409C15.9206 4.05462 16.0128 4.60118 15.9986 5.15045ZM6.71921 12.7254L5.91939 13.5679C5.6454 13.8585 5.31931 14.0889 4.96007 14.2456C4.60083 14.4024 4.2156 14.4823 3.82677 14.4809C3.24266 14.4804 2.67178 14.2976 2.18629 13.9555C1.70079 13.6134 1.32247 13.1273 1.09914 12.5588C0.875804 11.9902 0.817484 11.3647 0.931547 10.7613C1.04561 10.1578 1.32694 9.60353 1.73997 9.16846L4.26449 6.50766C4.6825 6.0662 5.21676 5.76718 5.79801 5.64938C6.37927 5.53158 6.98072 5.60042 7.52439 5.84697C8.06806 6.09353 8.52888 6.50644 8.84712 7.03217C9.16536 7.5579 9.32633 8.17221 9.30918 8.79546C9.30605 8.91722 9.34894 9.03531 9.42842 9.12378C9.50791 9.21225 9.61749 9.26386 9.73308 9.26726H9.74544C9.85916 9.26731 9.9684 9.22058 10.0499 9.13703C10.1314 9.05348 10.1787 8.93971 10.1817 8.81997C10.2034 8.01296 9.99459 7.21769 9.58228 6.53714C9.16996 5.8566 8.57315 5.32215 7.86915 5.00303C7.16515 4.6839 6.3864 4.5948 5.63377 4.74726C4.88114 4.89973 4.18932 5.28674 3.6479 5.85816L1.12047 8.51896C0.585568 9.08257 0.221265 9.80055 0.0735987 10.5822C-0.0740675 11.3638 0.00153027 12.174 0.290839 12.9104C0.580148 13.6468 1.07018 14.2763 1.69903 14.7194C2.32787 15.1625 3.06729 15.3994 3.82386 15.4C4.32671 15.4015 4.82484 15.2979 5.2894 15.0952C5.75396 14.8925 6.17569 14.5946 6.53016 14.2189L7.32998 13.3764C7.37101 13.3339 7.40363 13.2831 7.42596 13.2272C7.44829 13.1713 7.45989 13.1113 7.46009 13.0506C7.46029 12.99 7.44909 12.9299 7.42713 12.8738C7.40517 12.8177 7.37288 12.7668 7.33213 12.7239C7.29139 12.681 7.24299 12.6471 7.18973 12.624C7.13646 12.6009 7.07939 12.5892 7.0218 12.5895C6.96421 12.5898 6.90725 12.6021 6.85419 12.6256C6.80113 12.6492 6.75303 12.6837 6.71267 12.7269L6.71921 12.7254Z"
                        fill="black"
                      ></path>
                    </svg>
                  </div>
                  <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[120px] tw-h-[21px] tw-relative tw-flex tw-items-center">
                    <p className="tw-text-sm tw-text-left tw-text-[#31343d] tw-mb-0 tw-ml-6">파일 추가</p>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-w-4 tw-h-4 tw-absolute tw-left-0 tw-top-1/2 tw-transform tw--translate-y-1/2"
                      preserveAspectRatio="none"
                    >
                      <g clipPath="url(#clip0_801_18847)">
                        <path
                          d="M2.6114 6.86336C2.56053 6.9152 2.49984 6.95638 2.43288 6.98449C2.36591 7.01259 2.29402 7.02707 2.2214 7.02707C2.14877 7.02707 2.07688 7.01259 2.00991 6.98449C1.94295 6.95638 1.88226 6.9152 1.8314 6.86336C1.72786 6.75804 1.66985 6.61625 1.66985 6.46856C1.66985 6.32087 1.72786 6.17909 1.8314 6.07376L6.6562 1.20016C7.74419 0.355364 8.8386 -0.050236 9.92819 0.00496403C11.301 0.075364 12.3698 0.598564 13.277 1.45696C14.2018 2.33216 14.8002 3.58096 14.8002 5.09456C14.8002 6.25616 14.4626 7.27856 13.7498 8.18576L6.9474 15.1938C6.2594 15.7578 5.4946 16.0306 4.6754 15.9978C3.6354 15.9546 2.8618 15.6186 2.2866 15.0498C1.613 14.385 1.2002 13.5682 1.2002 12.4698C1.2002 11.5962 1.5018 10.7898 2.1242 10.033L8.1114 3.92016C8.5914 3.40816 9.061 3.10416 9.541 3.03056C9.86137 2.9801 10.1892 3.00876 10.496 3.11403C10.8028 3.21931 11.0791 3.39801 11.301 3.63456C11.7266 4.08496 11.909 4.64656 11.845 5.28576C11.801 5.72176 11.6226 6.12336 11.2946 6.50816L5.7906 12.1466C5.74006 12.1986 5.67968 12.24 5.61296 12.2685C5.54624 12.2969 5.47453 12.3118 5.402 12.3123C5.32947 12.3127 5.25758 12.2987 5.19052 12.2711C5.12346 12.2435 5.06256 12.2028 5.0114 12.1514C4.90722 12.0467 4.84834 11.9052 4.84745 11.7575C4.84655 11.6099 4.9037 11.4677 5.0066 11.3618L10.4842 5.75216C10.6442 5.56416 10.7282 5.37456 10.7482 5.17296C10.7802 4.85296 10.7034 4.61696 10.5042 4.40656C10.4036 4.29881 10.2779 4.21759 10.1383 4.17014C9.99877 4.12268 9.84963 4.11046 9.7042 4.13456C9.5098 4.16416 9.2378 4.34096 8.9026 4.69776L2.9402 10.7834C2.5106 11.3074 2.3026 11.8634 2.3026 12.4706C2.3026 13.2338 2.5786 13.7802 3.0562 14.2514C3.4362 14.6274 3.9522 14.8514 4.7202 14.8834C5.2642 14.905 5.7682 14.725 6.2066 14.3698L12.9242 7.44976C13.4402 6.78816 13.6978 6.00976 13.6978 5.09536C13.6978 3.90976 13.2362 2.94816 12.5234 2.27296C11.7954 1.58336 10.9634 1.17696 9.873 1.12096C9.0666 1.07936 8.221 1.39296 7.3794 2.03776L2.6114 6.86336Z"
                          fill="#31343D"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_801_18847">
                          <rect width="16" height="16" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setIsResultOpen(false)}
                className="tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-left-56 tw-top-16 tw-gap-3"
              >
                <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[260px] tw-h-12 tw-relative tw-overflow-hidden tw-rounded tw-bg-gray-200 tw-flex tw-items-center">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-mx-auto tw-text-sm tw-font-bold tw-text-center tw-text-white">
                    취소
                  </p>
                </div>
                <div
                  onClick={() => setIsResultOpen(true)}
                  className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-w-[260px] tw-h-12 tw-relative tw-overflow-hidden tw-rounded tw-bg-[#e11837] tw-flex tw-items-center"
                >
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-mx-auto tw-text-base tw-font-bold tw-text-center tw-text-white">
                    다음
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default QuizClubListView;
