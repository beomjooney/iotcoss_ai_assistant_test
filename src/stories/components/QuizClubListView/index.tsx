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

/**icon */
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import SearchIcon from '@mui/icons-material/Search';
import router from 'next/router';

import { CommunityCard } from 'src/stories/components';
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
  const [answerContents, setAnswerContents] = useState<RecommendContent[]>([]);
  const [totalElementsCm, setTotalElementsCm] = useState(0);
  const [totalPageCm, setTotalPageCm] = useState(1);
  const [beforeOnePick, setBeforeOnePick] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  const handleTabClick = tab => {
    setActiveTab(tab);
  };

  const data = {
    title: '나의 학습 현황',
    tabs: [
      {
        name: '학생',
        status: '학습 현황',
        sessions: [
          { session: '1회', date: '07-01 (월)' },
          { session: '2회', date: '07-08 (월)' },
          { session: '3회', date: '07-15 (월)' },
          { session: '4회', date: '07-22 (월)' },
          { session: '5회', date: '07-29 (월)' },
          { session: '6회', date: '08-05 (월)' },
          { session: '7회', date: '08-12 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
          { session: '8회', date: '08-19 (월)' },
        ],
      },
    ],
    progress: {
      currentSession: '5회',
      student: '김동서',
      sessions: [
        { date: '09-03 (월)', isChecked: true, status: 'completed' },
        { date: '00-16 (월)', isChecked: true, status: 'completed' },
        { date: '09-18 (수)', isChecked: true, status: 'completed' },
        { date: '09-25 (수)', isChecked: true, status: 'completed' },
        { date: 'D+2', isWarning: true, status: 'completed' },
        { date: 'D-14', isFuture: true, status: 'upcoming' },
        { date: 'D-21', isFuture: true, status: 'upcoming' },
        { date: 'D-28', isFuture: true, status: 'upcoming' },
        { date: 'D-21', isFuture: true, status: 'upcoming' },
        { date: 'D-28', isFuture: true, status: 'upcoming' },
        { date: 'D-28', isFuture: true, status: 'upcoming' },
        { date: 'D-28', isFuture: true, status: 'upcoming' },
        { date: 'D-28', isFuture: true, status: 'feature' },
        { date: 'D-28', isFuture: true, status: 'feature' },
        { date: 'D-28', isFuture: true, status: 'feature' },
        { date: 'D-28', isFuture: true, status: 'feature' },
        { date: 'D-28', isFuture: true, status: 'feature' },
        { date: 'D-28', isFuture: true, status: 'feature' },
      ],
    },
  };

  return (
    <div className={`tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white ${borderStyle}`}>
      <div className="tw-pt-[35px]">
        <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden border-t-0 border-r-0 border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">퀴즈클럽</p>
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
              퀴즈클럽 전체보기
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              클럽 상세보기
            </p>
          </div>
        </div>

        <Divider className="tw-mb-5" />
        <Grid item xs={11.1} className="tw-font-bold tw-text-xl tw-text-black ">
          <select className="form-select border-danger" aria-label="Default select example">
            <option selected>퀴즈클럽 임베디드 시스템 [전공선택] 3학년 화요일 A반 </option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </Grid>
        {/* Content Section */}
        <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg">
          <div className={cx('content-wrap')}>
            <div className={cx('container', 'tw-mt-10')}>
              <Grid container direction="row" alignItems="center" rowSpacing={0}>
                <Grid
                  container
                  justifyContent="flex-start"
                  xs={6}
                  sm={10}
                  className="tw-text-xl tw-text-black tw-font-bold"
                >
                  퀴즈목록 {totalElements}
                </Grid>

                <Grid container justifyContent="flex-end" xs={6} sm={2} style={{ textAlign: 'right' }}>
                  <Pagination
                    count={totalPage}
                    size="small"
                    siblingCount={0}
                    page={page}
                    renderItem={item => (
                      <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                    )}
                    onChange={handlePageChange}
                  />
                </Grid>
              </Grid>
              <Divider className="tw-py-3 tw-mb-3" />
              <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                    정렬 :
                  </p>

                  <RadioGroup value={selectedOption} onChange={handleChangeQuiz} row>
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
                          오래된순
                        </p>
                      }
                    />
                    <FormControlLabel
                      value="oldest1"
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
                          진행중인 퀴즈만 보기
                        </p>
                      }
                    />
                  </RadioGroup>
                </div>
              </div>
              {quizList.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid
                      className="tw-pt-8"
                      key={index}
                      container
                      direction="row"
                      justifyContent="left"
                      alignItems="center"
                      rowSpacing={3}
                    >
                      <Grid item xs={12} sm={1}>
                        <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">Q{index + 1}.</div>
                        <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                          {item?.weekNumber}주차 ({item?.dayOfWeek})
                        </div>
                      </Grid>

                      <Grid item xs={12} sm={11}>
                        <div className="">
                          <div className="tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1 tw-rounded-xl">
                            <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                              <img className="tw-w-10 tw-h-10 " src="/assets/images/quiz/ellipse_209.png" />
                              <div className="tw-text-xs tw-text-left tw-text-black">양황규 교수님</div>
                            </div>
                            <div className="tw-flex-auto tw-px-5 tw-w-3/12">
                              <div className="tw-font-medium tw-text-black">{item?.content}</div>
                            </div>
                            <div className="">
                              <button
                                onClick={() => router.push('/quiz-answers/' + `${item?.clubQuizSequence}`)}
                                type="button"
                                data-tooltip-target="tooltip-default"
                                className="max-lg:tw-w-[60px] tw-bg-white border border-danger tw-text-black tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                              >
                                답변확인 및 채점하기 {'>'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} title="퀴즈풀러가기" maxWidth="900px">
        <div className={cx('seminar-check-popup')}>
          <div className={cx('mb-5')}>
            <span className={cx('text-bold', 'tw-text-xl', 'tw-font-bold')}>가입 신청이 완료되었습니다!</span>
          </div>
          <div>가입 신청 후 클럽장 승인이 완료될때까지 기다려주세요!</div>
          <div>승인 완료 후 MY페이지나 퀴즈클럽 페이지 상단에서 가입된 클럽을 확인하실 수 있습니다.</div>
          <br></br>
          <br></br>
          <div className="tw-mt-5">
            <Button className="tw-mr-5" color="red" label="확인" size="modal" onClick={() => setIsModalOpen(false)} />
            {/* <Button
              color="primary"
              label="연락처 입력하러가기"
              size="modal"
              onClick={() =>
                router.push(
                  {
                    pathname: '/profile',
                    query: { isOpenModal: true, beforeQuizSequence: id },
                  },
                  '/profile',
                )
              }
            /> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizClubListView;
