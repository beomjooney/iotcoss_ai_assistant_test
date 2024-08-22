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

const LectureDetaillSolution = ({
  totalElements,
  contents,
  quizList,
  border,
  page,
  totalPage,
  handlePageChange,
  study,
  selectedImageBanner,
  selectedImage,
}) => {
  console.log('contents', contents);
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
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">강의클럽</p>
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
              강의 상세보기
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              강의 상세보기
            </p>
          </div>
        </div>
        <div
          style={{ backgroundImage: `url(${contents?.backgroundImageUrl})` }}
          className="tw-rounded-lg tw-bg-cover tw-bg-center tw-w-full tw-overflow-hidden tw-px-14 tw-pt-[40px] tw-py-5"
        >
          <Grid container direction="row" justifyContent="space-between" alignItems="start" rowSpacing={0}>
            <Grid item xs={8}>
              <div className="tw-flex tw-item tw-text-base tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                <span className="tw-inline-flex tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
                  {contents?.jobGroups[0] || 'N/A'}
                </span>
                <span className="tw-inline-flex tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded ">
                  {contents?.jobLevels[0] || 'N/A'}
                </span>
                <span className="tw-inline-flex tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded ">
                  {contents?.jobs[0] || 'N/A'}
                </span>
                <button
                  className=""
                  onClick={() => {
                    onChangeLike(contents?.club?.clubSequence);
                  }}
                >
                  {isLiked ? <StarIcon color="primary" /> : <StarBorderIcon color="disabled" />}
                </button>
              </div>
              <div className="tw-text-black tw-text-3xl tw-font-bold tw-py-3">{contents?.club?.name}</div>
            </Grid>
            <Grid item xs={4} container justifyContent="flex-end">
              <div className="">
                <img
                  className="tw-w-40 tw-h-40 tw-rounded-lg"
                  src={contents?.clubImageUrl || '/assets/images/banner/Rectangle_190.png'}
                />
                <div className="tw-mt-5">
                  <button className="tw-w-40 tw-text-base tw-text-[12.25px] tw-font-bold tw-text-center tw-text-white tw-bg-blue-500 tw-px-4 tw-py-4 tw-rounded">
                    {getButtonText(contents?.clubStatus)}
                  </button>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className="tw-px-[50px] tw-absolute tw-top-[300px] tw-left-0 tw-right-0 tw-bottom-0 tw-rounded-[8.75px] tw-py-[40px]">
          <div className="tw-flex tw-items-end tw-gap-[16px]">
            <img
              className="tw-w-40 tw-h-40 border tw-rounded-full"
              src={contents?.club?.leaderProfileImageUrl || '/assets/images/account/default_profile_image.png'}
            />
            <div className="tw-flex tw-items-center">
              <div className="tw-flex tw-text-sm tw-text-black border tw-py-1 tw-px-2  tw-mr-5 tw-rounded-lg">
                교수자
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-[14px]  tw-gap-3">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21.875px] tw-font-bold tw-text-left tw-text-black">
                  {contents?.leader?.nickname || 'N/A'}
                </p>
              </div>
              {/* <p className="tw-text-[12.25px] tw-text-[#6a7380]">{user?.position}</p> */}
            </div>
          </div>
        </div>

        {/* Content Section */}
        {/* {activeTab === 'myQuiz' && ( */}
        <div className="tw-mt-[130px] tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg tw-py-4 tw-overflow-hidden">
          <div className="tw-rounded-[8.75px] tw-mb-[30px] border">
            <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
              <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
                <img
                  src="/assets/images/quiz/Calendar_perspective_matte.png"
                  className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
                />
              </div>
              <div className="tw-col-start-2 tw-col-end-12">
                <div className="tw-flex tw-flex-col">
                  <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">강의 일정</p>
                </div>
                <div className="tw-flex">
                  <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">강의기간 : </p>
                  <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2">
                    {contents.startAt.split('T')[0]} ~ {contents.endAt.split('T')[0]}
                  </p>
                </div>
                <div className="tw-flex">
                  <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">강의현황 : </p>
                  <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">
                    {getButtonText(contents?.clubStatus)}
                  </p>
                </div>
                <div className="tw-flex">
                  <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">학습 키워드 : </p>
                  <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">
                    {contents?.studyKeywords?.toString()}
                  </p>
                </div>
                <div className="tw-flex">
                  <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">학습 스킬 : </p>
                  <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">{contents?.skills?.toString()}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('content-wrap')}>
            <Grid container direction="row" alignItems="center" rowSpacing={0}>
              <Grid
                item
                container
                justifyContent="flex-start"
                xs={6}
                sm={10}
                className="tw-text-xl tw-text-black tw-font-bold"
              >
                강의 목록
              </Grid>
              <Grid container justifyContent="flex-end" item xs={6} sm={2} style={{ textAlign: 'right' }}>
                {/* <Pagination
                  count={totalPage}
                  size="small"
                  siblingCount={0}
                  page={page}
                  renderItem={item => (
                    <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                  )}
                  onChange={handlePageChange}
                /> */}
              </Grid>
            </Grid>
            <Divider className="tw-py-3 tw-mb-3" />
            {study?.map((item, index) => {
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
                    <>
                      <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}>
                        <div
                          className={`tw-flex-auto tw-text-center  tw-font-bold ${
                            item?.isCompleted ? 'tw-text-black' : 'tw-text-gray-300 tw-font-normal'
                          }`}
                        >
                          {item?.studyOrder}회차
                        </div>
                        <div
                          className={`tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold ${
                            item?.isCompleted ? 'tw-text-black' : 'tw-text-gray-300 tw-font-normal'
                          }`}
                        >
                          {item?.studyDate.split('-').slice(1).join('-')} ({item?.dayOfWeek})
                        </div>
                      </Grid>

                      <Grid item xs={12} sm={11}>
                        <div className="tw-rounded-xl">
                          <div
                            className={`tw-py-7 tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1 tw-rounded-lg ${
                              item?.isCompleted ? 'tw-bg-[#F6F7FB] ' : 'tw-bg-white border  tw-opacity-50'
                            }`}
                          >
                            <div className="tw-flex tw-item-center  tw-px-5 tw-w-9/12 tw-gap-4">
                              <div className="tw-flex tw-font-medium tw-text-black">{item?.clubStudyName}</div>
                              {item?.clubStudyType === '0100' ? (
                                <div className="tw-text-xs tw-text-center tw-px-2 tw-py-1 tw-text-white tw-bg-blue-500 tw-rounded-md">
                                  온라인
                                </div>
                              ) : (
                                <div className="border border-primary tw-text-xs tw-text-center tw-px-2 tw-py-1 tw-text-blue-500 tw-bg-white tw-rounded-md">
                                  오프라인
                                </div>
                              )}
                            </div>
                            <div className="tw-flex-auto">
                              <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                {item?.isCompleted ? (
                                  <button
                                    onClick={() => {
                                      // router.push('/lecture-list/' + `${contents?.clubSequence}`);
                                      router.push(
                                        {
                                          pathname: `/lecture-list/${contents?.clubSequence}`,
                                          query: {
                                            clubStudySequence: item?.clubStudySequence,
                                          },
                                        },
                                        `/lecture-list/${contents?.clubSequence}`,
                                      );
                                    }}
                                    className="tw-bg-black tw-text-xs tw-px-2 tw-py-1 tw-text-white tw-rounded-md  tw-font-bold tw-text-right"
                                  >
                                    Q&A 보기
                                  </button>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </>
                  </Grid>
                </React.Fragment>
              );
            })}
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

export default LectureDetaillSolution;
