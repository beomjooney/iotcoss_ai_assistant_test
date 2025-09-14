// QuizClubDetailInfo.jsx
import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { TextField } from '@mui/material';

/** import pagenation */
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useClubJoin, useLectureClubEvaluation } from 'src/services/community/community.mutations';
import { getButtonText, getClubAboutStatus } from 'src/utils/clubStatus';

/**icon */
import { useSaveLike, useDeleteLike } from 'src/services/community/community.mutations';
import router from 'next/router';
import { Button, Modal } from 'src/stories/components';

// 챗봇
import ChatbotModal from 'src/stories/components/ChatBot';
import { useSessionStore } from '../../../../src/store/session';
import { useStudyOrderLabel } from 'src/hooks/useStudyOrderLabel';
import MentorsModal from 'src/stories/components/MentorsModal';
import AIFeedbackSummary from 'src/stories/components/AIFeedbackSummary/index';
import { useQuizAIFeedbackLectureGetTotal } from 'src/services/quiz/quiz.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';

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
  refetchClubAbout,
  lectureEvaluation,
  refetchLectureEvaluationStatus,
}) => {
  const { studyOrderLabelType } = useSessionStore.getState();
  const { studyOrderLabel } = useStudyOrderLabel(studyOrderLabelType);
  console.log('contents', contents);
  console.log('study', study);
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  let [isLiked, setIsLiked] = useState(false);
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();
  const [participationCode, setParticipationCode] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isTotalFeedbackModalOpen, setIsTotalFeedbackModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiEvaluationParamsTotal, setAiEvaluationParamsTotal] = useState({ clubSequence: contents.clubSequence });
  const [aiFeedbackDataTotal, setAiFeedbackDataTotal] = useState(null);
  const [aiFeedbackDataTotalQuiz, setAiFeedbackDataTotalQuiz] = useState(null);

  const { roles, menu, token, logged } = useSessionStore.getState();

  const [isClient, setIsClient] = useState(false); // 클라이언트 사이드에서만 렌어링하도록 상태 추가
  useEffect(() => {
    setIsClient(true); // 클라이언트 사이드에서 상태를 true로 설정
  }, []);

  useEffect(() => {
    setIsLiked(contents?.isFavorite);
  }, [contents?.isFavorite]);

  const { mutate: onClubJoin, isSuccess: clubJoinSucces } = useClubJoin();
  const {
    mutate: onLectureClubEvaluation,
    isSuccess: lectureClubEvaluationSucces,
    isError: lectureClubEvaluationError,
  } = useLectureClubEvaluation();

  useEffect(() => {
    if (lectureClubEvaluationSucces) {
      refetchAIEvaluationTotal();
      setIsLoading(false);
    }

    if (lectureClubEvaluationError) {
      setIsLoading(false);
    }
  }, [lectureClubEvaluationSucces, lectureClubEvaluationError]);

  useEffect(() => {
    if (clubJoinSucces) {
      refetchClubAbout();
      refetchLectureEvaluationStatus();
    }
  }, [clubJoinSucces]);

  const onChangeLike = function (postNo: number) {
    event.preventDefault();
    setIsLiked(!isLiked);
    if (isLiked) {
      onDeleteLike(postNo);
    } else {
      onSaveLike(postNo);
    }
  };

  const handlerClubJoin = (clubSequence: number, isPublic: boolean) => {
    console.log('test');
    setIsModalOpen(true);
  };

  // 총평 피드백 보기
  const handleTotalFeedbackClick = (clubSequence: number) => {
    refetchAIEvaluationTotal();
  };

  useEffect(() => {
    if (aiFeedbackDataTotal) {
      setIsTotalFeedbackModalOpen(true);
    }
  }, [aiFeedbackDataTotal]);

  // AI 피드백 데이터 조회
  const {
    refetch: refetchAIEvaluationTotal,
    isError: isErrorAIEvaluationTotal,
    isSuccess: isSuccessAIEvaluationTotal,
  } = useQuizAIFeedbackLectureGetTotal(
    aiEvaluationParamsTotal,
    data => {
      console.log('🎉 AI Evaluation Total SUCCESS:', data);
      setAiFeedbackDataTotal(data);
    },
    error => {
      console.error('❌ AI Evaluation Total ERROR:', error);
      alert('피드백 데이터를 불러오는데 실패했습니다.');
    },
  );

  // 모든 상태 변화를 추적하기 위한 useEffect 수정
  useDidMountEffect(() => {
    console.log('=== API 상태 변화 감지 ===');
    console.log('isErrorAIEvaluationTotal:', isErrorAIEvaluationTotal);
    console.log('isSuccessAIEvaluationTotal:', isSuccessAIEvaluationTotal);
    console.log('========================');

    if (isErrorAIEvaluationTotal || isSuccessAIEvaluationTotal) {
      setIsLoading(false);
    }
  }, [isErrorAIEvaluationTotal, isSuccessAIEvaluationTotal]);

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
              <div className="tw-gap-3  tw-flex tw-items-center tw-flex-wrap tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                {contents?.jobGroups?.[0]?.name && (
                  <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                    <p className="tw-text-[12.25px] tw-text-[#235a8d]">
                      {contents?.jobGroups && contents?.jobGroups.length > 0 ? contents?.jobGroups[0]?.name : ''}
                    </p>
                  </div>
                )}
                {contents?.jobs?.length > 0 &&
                  contents?.jobs.map((job, index) => (
                    <div key={index} className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                      <p className="tw-text-[12.25px] tw-text-[#b83333]">{job?.name}</p>
                    </div>
                  ))}

                {contents?.jobLevels?.length > 0 &&
                  contents?.jobLevels.map((jobLevel, index) => (
                    <div key={index} className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                      <p className="tw-text-[12.25px] tw-text-[#313b49]">{jobLevel?.name || ''}</p>
                    </div>
                  ))}
                <button
                  className=""
                  onClick={() => {
                    onChangeLike(contents?.clubSequence);
                  }}
                >
                  {isLiked ? <StarIcon color="error" /> : <StarBorderIcon color="disabled" />}
                </button>
              </div>
              <div className="tw-text-black tw-text-2xl tw-font-bold tw-py-3">{contents?.clubName}</div>
            </Grid>
            <Grid item xs={4} container justifyContent="flex-end">
              <div className="tw-z-0">
                <img
                  alt="Rectangle_190"
                  className="tw-w-40 tw-h-40 tw-rounded-lg "
                  src={contents?.clubImageUrl || '/assets/images/banner/Rectangle_190.png'}
                />
                <div className="tw-mt-5">
                  {contents?.clubAboutStatus === '0300' ? (
                    <button
                      onClick={() => handlerClubJoin(contents?.clubSequence, contents?.isPublic)}
                      className="tw-cursor-pointer tw-w-40 tw-text-[14px] tw-font-bold tw-text-center tw-text-white tw-bg-[#31343D] tw-px-4 tw-py-4 tw-rounded"
                    >
                      참여하기
                    </button>
                  ) : (
                    <button className="tw-w-40 tw-text-[12.25px] tw-bg-[#31343D] tw-font-bold tw-text-center tw-text-white tw-bg-primary tw-px-4 tw-py-4 tw-rounded">
                      {getClubAboutStatus(contents?.clubAboutStatus)}
                    </button>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className="tw-pointer-events-none tw-px-[50px] tw-absolute tw-top-[300px] tw-left-0 tw-right-0 tw-bottom-0 tw-rounded-[8.75px] tw-py-[40px]">
          <div className="tw-flex tw-items-end tw-gap-[16px]">
            <img
              alt="default_profile_image"
              className="tw-w-40 tw-h-40 tw-rounded-full"
              src={contents?.leader?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
            />
            <div className="tw-flex tw-items-center">
              <div className="tw-flex tw-text-sm tw-text-black border tw-py-1 tw-px-2  tw-mr-5 tw-rounded-lg">
                교수자
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-[14px]  tw-gap-3">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21.875px] tw-font-bold tw-text-left tw-text-black">
                  {contents?.leader?.nickname || ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {contents?.clubAboutStatus === '0401' ? (
          <div className="tw-mt-[130px] tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg tw-py-4 tw-overflow-hidden">
            <div className="tw-rounded-[8.75px] tw-mb-[30px] border">
              <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
                <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
                  <img
                    alt="Calendar_perspective_matte"
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
                      {contents?.startAt?.split('T')[0]} ~ {contents?.endAt?.split('T')[0]}
                    </p>
                  </div>
                  <div className="tw-flex">
                    <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">강의현황 : </p>
                    <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">
                      {getButtonText(contents?.clubStatus)}
                    </p>
                  </div>
                  <div className="tw-flex">
                    <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">학습 주제 : </p>
                    <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">{contents?.studySubject}</p>
                  </div>
                  <div className="tw-flex">
                    <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">학습 키워드 : </p>
                    <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">
                      {contents?.studyKeywords?.toString()}
                    </p>
                  </div>
                  <div className="tw-flex">
                    <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">참여 인원 : </p>
                    <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">
                      {contents?.recruitedMemberCount || 0} / {contents?.recruitMemberCount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={cx('content-wrap')} style={{ minHeight: '1000px' }}>
              <Grid container direction="row" alignItems="center" rowSpacing={0}>
                <Grid
                  item
                  container
                  justifyContent="flex-start"
                  xs={6}
                  sm={6}
                  className="tw-text-xl tw-text-black tw-font-bold"
                >
                  강의 목록 ({study?.length || 0})
                </Grid>
                <Grid container justifyContent="flex-end" item xs={6} sm={6} style={{ textAlign: 'right' }}>
                  {lectureEvaluation?.comprehensiveEvaluationViewable ? (
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <div className="tw-flex tw-items-center">
                        <div className="tw-text-base tw-text-black tw-leading-relaxed tw-mr-2">
                          {lectureEvaluation?.minimumQuestionCount}회 이상 질문 완료 하였습니다. 학습 총평 피드백을 확인
                          해보세요.
                        </div>
                      </div>
                      <button
                        disabled={!lectureEvaluation?.minimumQuestionsAsked || !contents?.clubSequence}
                        title={
                          !lectureEvaluation?.minimumQuestionsAsked
                            ? '질의응답을 완료해야 총평 피드백을 확인할 수 있습니다.'
                            : !contents?.clubSequence
                            ? '클럽 정보를 불러오는 중입니다.'
                            : ''
                        }
                        onClick={() => handleTotalFeedbackClick(contents?.clubSequence)}
                        className={`tw-px-4 tw-py-2 tw-rounded-full tw-text-base tw-font-medium ${
                          lectureEvaluation?.minimumQuestionsAsked && contents?.clubSequence
                            ? 'tw-bg-[#2474ED] tw-hover:bg-blue-600 tw-text-white tw-cursor-pointer'
                            : 'tw-bg-gray-300 tw-text-gray-500 tw-cursor-not-allowed'
                        }`}
                      >
                        총평 피드백보기
                      </button>
                    </div>
                  ) : null}
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
                            {item?.studyOrder}
                            {studyOrderLabel}
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}>
                          <div
                            className={`tw-flex-auto tw-text-center tw-text-sm tw-text-gray-400 tw-font-normal ${
                              item?.isCompleted ? 'tw-text-black' : 'tw-text-gray-300 tw-font-normal'
                            }`}
                          >
                            {item?.startDate.split('-').slice(1).join('-')}({item?.startDayOfWeek}) ~
                          </div>
                          <div
                            className={`tw-flex-auto tw-text-center tw-text-sm tw-text-gray-400 tw-font-normal ${
                              item?.isCompleted ? 'tw-text-black' : 'tw-text-gray-300 tw-font-normal'
                            }`}
                          >
                            {item?.endDate.split('-').slice(1).join('-')}({item?.endDayOfWeek})
                          </div>
                        </Grid>

                        <Grid item xs={12} sm={10}>
                          <div className="tw-rounded-xl">
                            <div
                              className={`tw-py-7 tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-rounded-lg ${
                                item?.isCompleted ? 'tw-bg-[#F6F7FB] ' : 'tw-bg-white border  tw-opacity-50'
                              }`}
                            >
                              <div className="tw-flex tw-item-center tw-px-5  tw-w-10/12 tw-gap-4">
                                <div className="tw-flex tw-font-medium tw-text-black">{item?.clubStudyName}</div>
                                {item?.clubStudyType === '0200' ? (
                                  <div className="tw-text-xs tw-text-center tw-px-2 tw-py-1 tw-text-white tw-bg-blue-500 tw-rounded-md">
                                    온라인
                                  </div>
                                ) : (
                                  <div className="border border-primary tw-text-xs tw-text-center tw-px-2 tw-py-1 tw-text-blue-500 tw-bg-white tw-rounded-md">
                                    오프라인
                                  </div>
                                )}
                                {item?.clubStudyUrl && (
                                  <span className="tw-text-sm tw-text-center tw-px-2 tw-text-whit tw-flex tw-items-center">
                                    <span className="tw-font-bold tw-pr-2">강의 URL : </span> {item?.clubStudyUrl}
                                  </span>
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
                                          `/lecture-list/${contents?.clubSequence}?clubStudySequence=${item?.clubStudySequence}`,
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
        ) : (
          <>
            <div className=" tw-py-8 tw-mt-[120px]">
              <div className="tw-flex tw-justify-start tw-items-center border tw-px-10 tw-py-3 tw-rounded-lg tw-gap-3">
                <div className="tw-flex tw-text-sm tw-text-black tw-font-bold">강의언어 : </div>
                <div className="tw-flex tw-text-sm tw-text-black border tw-py-1 tw-px-2  tw-mr-5 tw-rounded-lg">
                  {contents?.lectureLanguage === 'kor' ? '한국어' : '영어'}
                </div>
                <div className="tw-flex tw-text-sm tw-text-black  tw-font-bold">콘텐츠 언어 : </div>
                <div className="tw-flex tw-text-sm tw-text-black border tw-py-1 tw-px-2  tw-mr-5 tw-rounded-lg">
                  {contents?.contentLanguage === 'kor' ? '한국어' : '영어'}
                </div>
                <div className="tw-flex tw-text-sm tw-text-black  tw-font-bold">AI대화언어 : </div>
                <div className="tw-flex tw-text-sm tw-text-black border tw-py-1 tw-px-2  tw-mr-5 tw-rounded-lg">
                  {contents?.aiConversationLanguage === 'kor' ? '한국어' : '영어'}
                </div>
              </div>
            </div>

            <div className="tw-rounded-[8.75px] tw-mb-[30px] tw-bg-[#F9F9FD]">
              <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
                <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
                  <img
                    alt="Comment_perspective_matte"
                    src="/assets/images/quiz/Comment_perspective_matte.png"
                    className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
                  />
                </div>
                <div className="tw-col-start-2 tw-col-end-12">
                  <div className="tw-flex tw-flex-col">
                    <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">학습 주제</p>
                    <p className="tw-text-base tw-text-left tw-text-black">{contents?.clubName || ''}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-rounded-[8.75px] tw-mb-[30px] tw-bg-[#F9F9FD]">
              <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
                <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
                  <img
                    alt="Message_perspective_matte"
                    src="/assets/images/quiz/Message_perspective_matte.png"
                    className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
                  />
                </div>
                <div className="tw-col-start-2 tw-col-end-12">
                  <div className="tw-flex tw-flex-col">
                    <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">학습 키워드</p>
                    <p className="tw-text-left tw-flex tw-flex-wrap tw-gap-2">
                      {contents?.studyKeywords?.map((keyword, index) => (
                        <span
                          key={index}
                          className="tw-text-sm tw-bg-[#6A7380] tw-px-3 tw-py-1 tw-text-white tw-rounded tw-break-words tw-inline-block"
                        >
                          {keyword}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-rounded-[8.75px] tw-mb-[30px] tw-bg-[#F9F9FD]">
              <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
                <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
                  <img
                    alt="Success_perspective_matte"
                    src="/assets/images/quiz/Success_perspective_matte.png"
                    className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
                  />
                </div>
                <div className="tw-col-start-2 tw-col-end-12">
                  <div className="tw-flex tw-flex-col">
                    <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">강의 소개</p>
                    <p className="tw-text-base tw-text-left tw-text-black">{contents?.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-rounded-[8.75px] tw-mb-[30px] tw-bg-[#F9F9FD]">
              <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
                <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
                  <img
                    alt="Calendar_perspective_matte"
                    src="/assets/images/quiz/Calendar_perspective_matte.png"
                    className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
                  />
                </div>
                <div className="tw-col-start-2 tw-col-end-12">
                  <div className="tw-flex tw-flex-col">
                    <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">강의 일정</p>
                    <p className="tw-text-base tw-text-left tw-text-black">
                      시작일 : {contents?.startAt?.replace('T', ' ').split(' ')[0]}
                    </p>
                    <p className="tw-text-base tw-text-left tw-text-black">
                      종료일 : {contents?.endAt?.replace('T', ' ').split(' ')[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {isClient && !modalIsOpen && logged && menu.use_lecture_club && (
          <div>
            <div
              className="tw-fixed tw-bottom-0 tw-right-0  tw-mr-4 md:tw-mr-10 tw-mb-4 md:tw-mb-8 tw-cursor-pointer tw-z-10"
              onClick={() => setModalIsOpen(true)}
            >
              <img alt="chatbot" className="tw-w-[140px] tw-h-[140px]" src="/assets/images/main/chatbot.png" />
            </div>
          </div>
        )}
        {isClient && <ChatbotModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} token={token} />}
      </div>
      <Modal title="&nbsp;" isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} maxWidth="900px">
        <div className={cx('seminar-check-popup')}>
          {contents?.isPublic ? (
            <div>
              <div className={cx('tw-mt-14', 'tw-mb-10')}>
                <span className={cx('text-bold', 'tw-text-xl', 'tw-font-bold')}>강의클럽가입 신청을 하시겠습니까?</span>
              </div>
              <div>가입 신청 후 클럽장 승인이 완료될때까지 기다려주세요!</div>
              <div>승인 완료 후 MY학습방이나 강의클럽 페이지에서 가입된 클럽을 확인하실 수 있습니다.</div>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <div className="tw-mt-5 tw-flex tw-justify-center gap-3">
                <Button
                  color="red"
                  label="강의클럽 가입요청"
                  size="modal"
                  onClick={() => {
                    setIsModalOpen(false);
                    onClubJoin({
                      clubSequence: contents?.clubSequence,
                      participationCode: participationCode,
                    });
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className={cx('tw-my-10')}>
                <span className={cx('text-bold', 'tw-text-xl', 'tw-font-bold')}>참여코드를 입력해주세요.</span>
              </div>
              <div>참여코드 입력 후 클럽장 승인이 완료될때까지 기다려주세요!</div>
              <div>승인 완료 후 MY학습방이나 강의클럽 페이지에서 가입된 클럽을 확인하실 수 있습니다.</div>
              <br></br>
              <br></br>
              <div>
                <TextField
                  placeholder="참여코드를 입력해주세요."
                  value={participationCode}
                  onChange={e => {
                    setParticipationCode(e.target.value);
                  }}
                />
              </div>
              <br></br>
              <div className="tw-mt-5 tw-flex tw-justify-center gap-3">
                <Button
                  color="red"
                  label="확인"
                  size="modal"
                  onClick={() => {
                    if (participationCode.length === 0) {
                      alert('참여코드를 입력해주세요.');
                    } else {
                      console.log(participationCode, contents?.clubSequence);
                      onClubJoin({
                        clubSequence: contents?.clubSequence,
                        participationCode: participationCode,
                      });
                      setIsModalOpen(false);
                      setParticipationCode('');
                    }
                  }}
                />
                <Button
                  color="lite-gray"
                  label="닫기"
                  size="modal"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
      {/* 총평 피드백 모달 */}
      <MentorsModal
        isContentModalClick={true}
        title={'학습총평 피드백보기'}
        isOpen={isTotalFeedbackModalOpen}
        onAfterClose={() => {
          setIsLoading(false);
          setIsTotalFeedbackModalOpen(false);
          setAiFeedbackDataTotal(null);
        }}
      >
        <div>
          <div className="tw-flex tw-justify-between tw-items-center tw-gap-4 tw-mb-4">
            <div className="tw-text-xl tw-font-bold tw-text-black tw-text-center">총평피드백 보기</div>
            <button
              disabled={!lectureEvaluation?.comprehensiveEvaluationEnabled || isLoading}
              onClick={() => {
                if (contents?.clubSequence) {
                  onLectureClubEvaluation({
                    clubSequence: contents.clubSequence,
                  });
                  setIsLoading(true);
                } else {
                  alert('클럽 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
                }
              }}
              className={`tw-text-base tw-text-center tw-px-4 tw-py-2 tw-rounded-md ${
                lectureEvaluation?.comprehensiveEvaluationEnabled && !isLoading
                  ? 'tw-bg-black tw-text-white tw-cursor-pointer'
                  : 'tw-bg-gray-300 tw-text-gray-500 tw-cursor-not-allowed'
              }`}
            >
              {isLoading ? 'AI피드백 생성중...' : 'AI피드백 생성'}
            </button>
          </div>
          {lectureEvaluation?.comprehensiveEvaluationViewable ? (
            <AIFeedbackSummary
              aiFeedbackDataTotal={aiFeedbackDataTotal}
              aiFeedbackDataTotalQuiz={aiFeedbackDataTotalQuiz}
              isLoading={isLoading}
              isFeedbackOptions={true}
            />
          ) : (
            <div className="tw-h-[400px] tw-flex tw-justify-center tw-items-center">
              <div className="tw-text-center tw-text-gray-500 tw-text-base">총평 피드백 보기 권한이 없습니다.</div>
            </div>
          )}
        </div>
      </MentorsModal>
    </div>
  );
};

export default LectureDetaillSolution;
