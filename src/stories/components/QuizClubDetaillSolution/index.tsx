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
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

import { getButtonText } from 'src/utils/clubStatus';

/**icon */
import {
  useSaveLike,
  useDeleteLike,
  useSaveReply,
  useDeleteReply,
  useDeletePost,
} from 'src/services/community/community.mutations';
import router from 'next/router';

import { CommunityCard } from 'src/stories/components';
import { Button, Typography, Profile, Modal, ArticleCard } from 'src/stories/components';
const cx = classNames.bind(styles);

//comment

const QuizClubDetaillSolution = ({ totalElements, contents, quizList, border, page, totalPage, handlePageChange }) => {
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  let [isLiked, setIsLiked] = useState(contents?.club?.isFavorite);
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();

  const [expandedItems, setExpandedItems] = useState(() => Array(quizList?.length || 0).fill(false));
  const [expandedQuizzData, setExpandedQuizzData] = useState(
    () => quizList?.map(item => Array(item?.makeupQuizzes?.length || 0).fill(false)) || [],
  );

  const toggleExpand = index => {
    setExpandedItems(prev => {
      const newExpandedItems = [...prev];
      newExpandedItems[index] = !newExpandedItems[index];
      return newExpandedItems;
    });
  };

  const toggleExpandQuizzData = (itemIndex, quizzIndex) => {
    setExpandedQuizzData(prev => {
      const newExpandedQuizzData = [...prev];

      // itemIndex가 유효한지 확인하고 초기화
      if (!newExpandedQuizzData[itemIndex]) {
        newExpandedQuizzData[itemIndex] = [];
      }

      // quizzIndex가 유효한지 확인하고 초기화
      if (typeof newExpandedQuizzData[itemIndex][quizzIndex] === 'undefined') {
        newExpandedQuizzData[itemIndex][quizzIndex] = 0;
      }

      newExpandedQuizzData[itemIndex][quizzIndex] = !newExpandedQuizzData[itemIndex][quizzIndex];
      console.log(newExpandedQuizzData);
      return newExpandedQuizzData;
    });
  };

  const onChangeLike = function (postNo: number) {
    event.preventDefault();
    setIsLiked(!isLiked);
    if (isLiked) {
      onDeleteLike(postNo);
    } else {
      onSaveLike(postNo);
    }
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
              클럽 상세보기
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              클럽 상세보기
            </p>
          </div>
        </div>
        <div className="tw-h-[280] tw-relative tw-overflow-hidden tw-rounded-[8.75px] tw-bg-white border border-[#e9ecf2] tw-grid tw-grid-cols-3 tw-gap-4">
          <div className="tw-col-span-1">
            <img src={contents?.club?.clubImageUrl} width={320} height={320} className="tw-object-cover" />
          </div>
          <div className="tw-col-span-2 tw-flex tw-flex-col tw-py-4 tw-pr-4">
            <div className="tw-col-span-2 tw-flex tw-flex-col tw-py-4 tw-pr-4">
              <div className="tw-flex tw-gap-[7px]">
                <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                  <p className="tw-text-[12.25px] tw-text-[#235a8d]">{contents?.club?.jobGroups[0].name || 'N/A'}</p>
                </div>
                <div className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                  <p className="tw-text-[12.25px] tw-text-[#313b49]">{contents?.club?.jobLevels[0].name || 'N/A'}</p>
                </div>
                <div className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                  <p className="tw-text-[12.25px] tw-text-[#b83333]">{contents?.club?.jobs[0].name || 'N/A'} </p>
                </div>
                <div className="tw-flex-1"></div> {/* 빈 div로 flex-grow를 추가하여 버튼을 오른쪽으로 밀어냅니다. */}
                <button
                  className=""
                  onClick={() => {
                    onChangeLike(contents?.club?.clubSequence);
                  }}
                >
                  {isLiked ? <StarIcon color="primary" /> : <StarBorderIcon color="disabled" />}
                </button>
              </div>
            </div>

            <div className="tw-text-[20.5px] tw-font-bold tw-text-black tw-mt-4">{contents?.club?.clubName}</div>
            <p className="tw-text-[12.25px] tw-mt-2 tw-text-black">{contents?.club?.description}</p>
            <div className="tw-mt-4">
              <p className="tw-text-sm tw-text-black">
                학습 주기 : 매주 {contents?.club?.studyCycle.toString()}요일 (총 {contents?.club?.studyCycle}회)
              </p>
              <p className="tw-text-sm tw-text-black">
                학습 기간 : {contents?.club?.weekCount}주 ({contents?.club?.startAt.split(' ')[0]} ~{' '}
                {contents?.club?.endAt.split(' ')[0]})
              </p>
              <p className="tw-text-sm tw-text-black">
                참여 현황 : {contents?.club?.publishedCount} / {contents?.club?.studyCount} 학습중
              </p>
              <p className="tw-text-sm tw-text-black">참여 인원 : {contents?.club?.recruitedMemberCount}명</p>
            </div>
            <div className="tw-flex tw-items-center tw-mt-auto tw-justify-between tw-w-full">
              <div className="tw-flex tw-items-center">
                <img
                  src={contents?.club?.leaderProfileImageUrl}
                  className="tw-mr-2 border tw-rounded-full tw-w-9 tw-h-9"
                />
                <p className="tw-text-sm tw-text-black">{contents?.club?.leaderNickname}</p>
              </div>
              <div className="tw-flex tw-gap-4">
                <div
                  className="tw-bg-gray-400 tw-rounded-[3.5px] tw-px-[24.5px] tw-py-[10.0625px] tw-cursor-pointer"
                  // onClick={() => {
                  //   setIsModalOpen(true);
                  // }}
                >
                  <p className="tw-text-[12.25px] tw-font-bold tw-text-white tw-text-center">
                    {getButtonText(contents?.club?.clubStatus)}
                  </p>
                </div>
                <div
                  className="tw-bg-[#e11837] tw-rounded-[3.5px] tw-px-[24.5px] tw-py-[10.0625px] tw-cursor-pointer"
                  onClick={() => router.push('/quiz/round-answers/' + `${contents?.club?.clubSequence}`)}
                >
                  <p className="tw-text-[12.25px] tw-font-bold tw-text-white tw-text-center">퀴즈라운지</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {/* {activeTab === 'myQuiz' && ( */}
        <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg tw-py-4 tw-overflow-hidden">
          <p className="tw-text-xl tw-font-bold tw-text-black tw-py-4">나의 학습 현황</p>
          <div className="tw-overflow-auto tw-rounded-lg">
            <div className="tw-flex tw-flex-row">
              {/* 새로운 div 추가 */}
              <div className="tw-flex justify-center ">
                <div className="tw-text-base tw-font-medium tw-text-[#31343d] tw-w-24 tw-text-center">
                  학생
                  <div className="tw-py-2">
                    <Avatar
                      className="tw-mx-auto border tw-rounded-full"
                      sx={{ width: 32, height: 32 }}
                      src={contents?.progress?.profileImageUrl}
                    ></Avatar>
                    <div className="tw-text-sm tw-py-2"> {contents?.progress?.nickname}</div>
                  </div>
                </div>
                <div className="tw-text-base tw-font-medium tw-text-[#31343d] tw-w-24 tw-text-center">
                  학습현황
                  <div className="tw-py-5">
                    <div className="tw-flex tw-items-center">
                      <div className="progress tw-rounded tw-h-2 tw-p-0 tw-flex-grow">
                        <span
                          style={{
                            width: `${
                              (contents?.progress?.currentRound / contents?.progress?.studyStatuses.length) * 100
                            }%`,
                          }}
                        >
                          <span className="progress-line"></span>
                        </span>
                      </div>
                      <div className="tw-ml-2 tw-text-base tw-font-bold">{contents?.progress?.currentRound}회</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tw-ml-10 tw-grid tw-grid-cols-9 tw-gap-4" style={{ width: '100%' }}>
                {contents?.progress?.studyStatuses.map((session, idx) => (
                  <div key={idx} className="tw-items-center tw-flex-shrink-0 border tw-rounded-lg">
                    <div className=" border-bottom tw-pb-3 tw-px-0 tw-pt-0 tw-bg-[#f6f7fb] tw-rounded-t-lg">
                      <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d] tw-pt-1">
                        {session?.order}회
                      </p>
                      <p className="tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2] tw-pt-1">
                        {session?.publishDate.split('-').slice(1).join('-')}
                      </p>
                    </div>
                    <div className="tw-pt-3 tw-pb-2">
                      {
                        <div className="tw-flex tw-justify-center">
                          {/* <circle cx={10} cy={10} r={10} fill="#31343D" /> */}
                          {session?.status === '0003' ? (
                            <svg
                              width={20}
                              height={20}
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="tw-w-5 tw-h-5"
                              preserveAspectRatio="none"
                            >
                              <circle cx={10} cy={10} r={10} fill="#31343D" />
                              <path d="M6 9L9.60494 13L14 7" stroke="white" strokeWidth="1.5" />
                            </svg>
                          ) : session?.status === '0002' ? (
                            <div className="tw-w-5 tw-h-5 tw-relative ">
                              <svg
                                width={20}
                                height={20}
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-[-1px] top-[-1px]"
                                preserveAspectRatio="xMidYMid meet"
                              >
                                <circle cx={10} cy={10} r="9.5" fill="white" stroke="#E11837" />
                              </svg>
                              <p className="tw-absolute tw-left-[7px] tw-top-[3.5px] tw-text-xs tw-font-medium tw-text-center tw-text-[#e11837]">
                                ?
                              </p>
                            </div>
                          ) : session?.status === '0001' ? (
                            <div className="tw-w-5 tw-h-5">
                              <svg
                                width={20}
                                height={20}
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="xMidYMid meet"
                              >
                                <circle cx={10} cy={10} r="9.5" fill="#F6F7FB" stroke="#E0E4EB" />
                              </svg>
                              <p className="tw-text-xs tw-font-medium tw-text-center tw-text-white">-</p>
                            </div>
                          ) : null}
                        </div>
                      }
                    </div>
                    <p
                      className={`tw-text-xs tw-font-medium tw-text-center tw-pb-2 ${
                        session?.answerStatus === '0002' ? 'tw-text-[#e11837]' : 'tw-text-[#9ca5b2]'
                      }`}
                    >
                      {session?.completedDate ? session?.completedDate : 'D' + session?.relativeDaysToPublishDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={cx('content-wrap')}>
            <div className={cx('container', 'tw-mt-10')}>
              <Grid container direction="row" alignItems="center" rowSpacing={0}>
                <Grid
                  item
                  container
                  justifyContent="flex-start"
                  xs={6}
                  sm={10}
                  className="tw-text-xl tw-text-black tw-font-bold"
                >
                  퀴즈 목록 {contents?.club?.publishedCount} / {contents?.club?.studyCount}
                </Grid>
                <Grid container justifyContent="flex-end" item xs={6} sm={2} style={{ textAlign: 'right' }}>
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
              {quizList?.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid
                      className="tw-pt-10"
                      key={index}
                      container
                      direction="row"
                      justifyContent="left"
                      alignItems="center"
                      rowSpacing={3}
                    >
                      {item?.makeupQuizzes?.length > 0 ? (
                        <>
                          <>
                            <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}>
                              <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">
                                Q{index + 1}.
                              </div>
                              <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                                {item?.publishDate.split('-').slice(1).join('-')} ({item?.dayOfWeek})
                              </div>
                              <div
                                className={`tw-flex-auto tw-mt-10 tw-text-center tw-text-sm ${
                                  item?.answer?.answerStatus === '0003' ? 'tw-text-gray' : 'tw-text-[#f44]'
                                } tw-font-bold`}
                              >
                                {item?.answer?.relativeDaysToPublishDate === 0
                                  ? 'D-' + item?.answer?.relativeDaysToPublishDate
                                  : 'D' + item?.answer?.relativeDaysToPublishDate}
                              </div>
                            </Grid>

                            <Grid item xs={12} sm={11}>
                              <div className="tw-rounded-xl">
                                <div
                                  className={`tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1   ${
                                    item?.answer ? 'tw-rounded-tl-xl tw-rounded-tr-xl' : 'tw-rounded-xl'
                                  }`}
                                >
                                  <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                    <img
                                      className="tw-w-10 tw-h-10 border tw-rounded-full"
                                      src={item?.maker?.profileImageUrl}
                                    />
                                    <div className="tw-text-xs tw-text-left tw-text-black">{item?.maker?.nickname}</div>
                                  </div>
                                  <div className="tw-flex-auto tw-px-5 tw-w-10/12">
                                    <div className="tw-font-medium tw-text-black">{item?.question}</div>
                                  </div>
                                  {item?.answer?.answerStatus === '0003' && (
                                    <div className="tw-flex-auto">
                                      <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                        <button
                                          onClick={() => {
                                            window.open(item?.contentUrl, '_blank'); // data?.articleUrl을 새 탭으로 열기
                                          }}
                                          className="tw-bg-black tw-p-1.5 tw-text-white tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                        >
                                          지식컨텐츠 보기
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="border border-secondary tw-bg-white tw-flex tw-items-center tw-p-4  tw-py-3 tw-rounded-bl-xl tw-rounded-br-xl">
                                  <div className="tw-w-1.5/12 tw-pl-14 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                                  <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                    <img
                                      className="border tw-rounded-full tw-w-10 tw-h-10 "
                                      src={item?.answer?.member?.profileImageUrl}
                                    />
                                    <div className="tw-text-xs tw-text-left tw-text-black">
                                      {item?.answer?.member?.nickname}
                                    </div>
                                  </div>
                                  <div className="tw-flex-auto tw-w-9/12 tw-px-5">
                                    <div className="tw-font-medium tw-text-[#9ca5b2] tw-text-sm tw-line-clamp-2">
                                      {item?.answer?.text}
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
                          </>
                          {item?.makeupQuizzes?.map((item, quizzIndex) => {
                            return (
                              <>
                                <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}></Grid>
                                <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}>
                                  <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold"></div>
                                  <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                                    {item?.publishDate.split('-').slice(1).join('-')} ({item?.dayOfWeek})
                                  </div>
                                  <div
                                    className={`tw-flex-auto tw-mt-10 tw-text-center tw-text-sm ${
                                      item?.answer?.answerStatus === '0003' ? 'tw-text-gray' : 'tw-text-[#f44]'
                                    } tw-font-bold`}
                                  >
                                    {item?.answer?.relativeDaysToPublishDate === 0
                                      ? 'D-' + item?.answer?.relativeDaysToPublishDate
                                      : 'D' + item?.answer?.relativeDaysToPublishDate}
                                  </div>
                                </Grid>

                                <Grid item xs={12} sm={10}>
                                  <div className="tw-rounded-xl">
                                    <div
                                      className={`tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1   ${
                                        item?.answer ? 'tw-rounded-tl-xl tw-rounded-tr-xl' : 'tw-rounded-xl'
                                      }`}
                                    >
                                      <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                        <img
                                          className="tw-w-10 tw-h-10 border tw-rounded-full"
                                          src={item?.maker?.profileImageUrl}
                                        />
                                        <div className="tw-text-xs tw-text-left tw-text-black">
                                          {item?.maker?.nickname}
                                        </div>
                                      </div>
                                      <div className="tw-flex-auto tw-px-5 tw-w-10/12">
                                        <div className="tw-font-medium tw-text-black">{item?.question}</div>
                                      </div>
                                      {item?.answer?.answerStatus === '0003' && (
                                        <div className="tw-flex-auto">
                                          <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                            <button
                                              onClick={() => {
                                                window.open(item?.contentUrl, '_blank'); // data?.articleUrl을 새 탭으로 열기
                                              }}
                                              className="tw-bg-black tw-p-1.5 tw-text-white tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                            >
                                              지식컨텐츠 보기
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    {item?.answer?.answerStatus === '0003' ? (
                                      <>
                                        <div className="border border-secondary tw-bg-white tw-flex tw-items-center tw-p-4  tw-py-3 tw-rounded-bl-xl tw-rounded-br-xl">
                                          <div className="tw-w-1.5/12 tw-pl-14 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                                          <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                            <img
                                              className="border tw-rounded-full tw-w-10 tw-h-10 "
                                              src={item?.answer?.member?.profileImageUrl}
                                            />
                                            <div className="tw-text-xs tw-text-left tw-text-black">
                                              {item?.answer?.member?.nickname}
                                            </div>
                                          </div>
                                          <div className="tw-flex-auto tw-w-9/12 tw-px-5">
                                            <div
                                              className={`tw-font-medium tw-text-[#9ca5b2] tw-text-sm ${
                                                expandedQuizzData &&
                                                expandedQuizzData[index] &&
                                                !expandedQuizzData[index][quizzIndex]
                                                  ? 'tw-line-clamp-2'
                                                  : ''
                                              }`}
                                            >
                                              {item?.answer?.text}
                                            </div>
                                          </div>
                                          <div className="tw-flex-auto">
                                            <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                              <p
                                                onClick={() => toggleExpandQuizzData(index, quizzIndex)}
                                                className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                              >
                                                {expandedQuizzData[index] && expandedQuizzData[index][quizzIndex]
                                                  ? '접기'
                                                  : '자세히보기'}
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
                                      </>
                                    ) : (
                                      <div className="border border-secondary tw-bg-white tw-flex tw-items-center  tw-py-1 tw-rounded-bl-xl tw-rounded-br-xl">
                                        <div className="tw-w-1.5/12 tw-pl-14 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                                        <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                          <div
                                            className="border tw-rounded-full tw-w-10 tw-h-10"
                                            src={item?.maker?.profileImageUrl}
                                          />
                                          <div className="tw-text-xs tw-text-left tw-text-black">
                                            {' '}
                                            {item?.maker?.nickname}
                                          </div>
                                        </div>
                                        <div className="tw-flex-auto tw-w-1.5/12 tw-py-3">
                                          <div className="tw-font-medium tw-text-gray-500 tw-text-sm tw-line-clamp-2">
                                            <div className="tw-text-center">
                                              <button
                                                type="button"
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
                                                data-tooltip-target="tooltip-default"
                                                className=" max-lg:tw-w-[60px] tw-px-[30.5px] tw-py-[9.5px] tw-rounded tw-bg-[#E111837] tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                              >
                                                퀴즈 풀러가기
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Grid>
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}>
                            <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">Q{index + 1}.</div>
                            <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                              {item?.publishDate.split('-').slice(1).join('-')} ({item?.dayOfWeek})
                            </div>
                            <div
                              className={`tw-flex-auto tw-mt-10 tw-text-center tw-text-sm ${
                                item?.answer?.answerStatus === '0003' ? 'tw-text-gray' : 'tw-text-[#f44]'
                              } tw-font-bold`}
                            >
                              {item?.answer?.relativeDaysToPublishDate === 0
                                ? 'D-' + item?.answer?.relativeDaysToPublishDate
                                : 'D' + item?.answer?.relativeDaysToPublishDate}
                            </div>
                          </Grid>

                          <Grid item xs={12} sm={11}>
                            <div className="tw-rounded-xl">
                              <div
                                className={`tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1   ${
                                  item?.answer ? 'tw-rounded-tl-xl tw-rounded-tr-xl' : 'tw-rounded-xl'
                                }`}
                              >
                                <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                  <img
                                    className="tw-w-10 tw-h-10 border tw-rounded-full"
                                    src={item?.maker?.profileImageUrl}
                                  />
                                  <div className="tw-text-xs tw-text-left tw-text-black">{item?.maker?.nickname}</div>
                                </div>
                                <div className="tw-flex-auto tw-px-5 tw-w-10/12">
                                  <div className="tw-font-medium tw-text-black">{item?.question}</div>
                                </div>
                                {item?.answer?.answerStatus === '0003' && (
                                  <div className="tw-flex-auto">
                                    <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                      <button
                                        onClick={() => {
                                          window.open(item?.contentUrl, '_blank'); // data?.articleUrl을 새 탭으로 열기
                                        }}
                                        className="tw-bg-black tw-p-1.5 tw-text-white tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                                      >
                                        지식컨텐츠 보기
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {item?.answer?.answerStatus === '0003' ? (
                                <>
                                  <div className="border border-secondary tw-bg-white tw-flex tw-items-center tw-p-4  tw-py-3 tw-rounded-bl-xl tw-rounded-br-xl">
                                    <div className="tw-w-1.5/12 tw-pl-14 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                                    <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                      <img
                                        className="border tw-rounded-full tw-w-10 tw-h-10 "
                                        src={item?.answer?.member?.profileImageUrl}
                                      />
                                      <div className="tw-text-xs tw-text-left tw-text-black">
                                        {item?.answer?.member?.nickname}
                                      </div>
                                    </div>
                                    <div className="tw-flex-auto tw-w-9/12 tw-px-5">
                                      <div
                                        className={`tw-font-medium tw-text-[#9ca5b2] tw-text-sm ${
                                          !expandedItems[index] ? 'tw-line-clamp-2' : ''
                                        }`}
                                      >
                                        {item?.answer?.text}
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
                                </>
                              ) : (
                                <div className="border border-secondary tw-bg-white tw-flex tw-items-center  tw-py-1 tw-rounded-bl-xl tw-rounded-br-xl">
                                  <div className="tw-w-1.5/12 tw-pl-14 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                                  <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                    <div
                                      className="border tw-rounded-full tw-w-10 tw-h-10"
                                      src={item?.maker?.profileImageUrl}
                                    />
                                    <div className="tw-text-xs tw-text-left tw-text-black">{item?.maker?.nickname}</div>
                                  </div>
                                  <div className="tw-flex-auto tw-w-1.5/12 tw-py-3">
                                    <div className="tw-font-medium tw-text-gray-500 tw-text-sm tw-line-clamp-2">
                                      <div className="tw-text-center">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            // router.push('/quiz/solution/' + `${item?.quizSequence}`);
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
                                          data-tooltip-target="tooltip-default"
                                          className=" max-lg:tw-w-[60px] tw-px-[30.5px] tw-py-[9.5px] tw-rounded tw-bg-[#E11837] tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                        >
                                          퀴즈 풀러가기
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Grid>
                        </>
                      )}
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

export default QuizClubDetaillSolution;
