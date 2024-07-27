import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import { CommunityCard } from 'src/stories/components';
import { RecommendContent } from 'src/models/recommend';
import { useQuizAnswerDetail, useQuizRankDetail, useQuizRoungeInfo } from 'src/services/quiz/quiz.queries';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import Avatar from '@mui/material/Avatar';
/** import icon */
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

/** import pagenation */
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useSessionStore } from 'src/store/session';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useSaveFavorite, useDeleteFavorite } from 'src/services/community/community.mutations';
import { getButtonText } from 'src/utils/clubStatus';

const cx = classNames.bind(styles);
export interface QuizAnswersRoundDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizAnswersRoundDetailTemplate({ id }: QuizAnswersRoundDetailTemplateProps) {
  const router = useRouter();
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [rankContents, setRankContents] = useState<RecommendContent[]>([]);
  const [answerContents, setAnswerContents] = useState<RecommendContent[]>([]);
  const [bestAnswerContents, setBestAnswerContents] = useState<RecommendContent[]>([]);
  const [myAnswerContents, setMyAnswerContents] = useState<RecommendContent[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [beforeOnePick, setBeforeOnePick] = useState(1);
  const [keyWorld, setKeyWorld] = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const [params, setParams] = useState<any>({ id, page });
  let [isLiked, setIsLiked] = useState(false);
  const { memberId, logged } = useSessionStore.getState();
  const { mutate: onSaveFavorite, isSuccess: isSuccessFavorite } = useSaveFavorite();
  const { mutate: onDeleteFavorite, isSuccess: isSuccessDelete } = useDeleteFavorite();

  const handleQuizClick = quiz => {
    console.log(quiz);
    setSelectedQuiz(quiz);

    setParams({
      club: id,
      quiz: quiz?.quizSequence,
      data: { page, keyword: keyWorld },
    });
  };

  const { isFetched: isParticipantListFetched, data } = useQuizRoungeInfo(id, data => {
    console.log('first get data');
    const index = data.clubQuizzes.findIndex(item => item.isPublished === true);
    //clubQuizzes[0]
    setSelectedQuiz(data.clubQuizzes[index]);
    console.log(data);
    setContents(data);

    setParams({
      club: id,
      quiz: data.clubQuizzes[index]?.quizSequence,
      data: { page, keyword: keyWorld },
    });
  });

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    if (contents?.clubQuizzes?.length > 0) {
      const index = contents?.clubQuizzes?.findIndex(item => item.isPublished === true);
      console.log(contents?.clubQuizzes[index]);
      setSelectedQuiz(contents?.clubQuizzes[index]);
      setIsLiked(contents?.club?.isFavorite);
    }
  }, [contents]);

  const {
    isFetched: isQuizAnswerListFetched,
    refetch: refetchReply,
    isSuccess,
    data: quizAnswerData,
  } = useQuizAnswerDetail(params, data => {
    console.log('useQuizAnswerDetail');
  });

  useEffect(() => {
    if (isSuccess) {
      console.log(quizAnswerData);
      setAnswerContents(quizAnswerData?.answers);
      setBestAnswerContents(quizAnswerData?.bestAnswer);
      setMyAnswerContents(quizAnswerData?.myAnswer);
      setTotalElements(quizAnswerData?.totalElements);
      setTotalPage(quizAnswerData?.totalPages);

      console.log(quizAnswerData?.bestAnswer);
      console.log(quizAnswerData?.myAnswer);
    }
  }, [isSuccess, quizAnswerData]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useDidMountEffect(() => {
    if (selectedQuiz) refetchReply();
  }, [selectedQuiz]);

  const onChangeFavorite = function (postNo: number, isFavorites: boolean) {
    console.log(postNo, isFavorites);

    if (logged) {
      setIsLiked(!isLiked);
      console.log(isLiked);
      if (isLiked) {
        onDeleteFavorite(postNo);
      } else {
        onSaveFavorite(postNo);
      }
    } else {
      alert('로그인 후 좋아요를 클릭 할 수 있습니다.');
    }
  };

  return (
    <>
      <Desktop>
        <div className={cx('seminar-detail-container')}>
          <div className={cx('container')}>
            <div className="tw-pt-[35px]">
              <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden border-t-0 border-r-0 border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
                <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
                    퀴즈클럽
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
                    클럽 상세보기
                  </p>
                </div>
                <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
                    클럽 상세보기
                  </p>
                </div>
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
                      <p className="tw-text-[12.25px] tw-text-[#235a8d]">{contents?.club?.jobGroups[0].name}</p>
                    </div>
                    <div className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                      <p className="tw-text-[12.25px] tw-text-[#313b49]">{contents?.club?.jobLevels[0].name}</p>
                    </div>
                    <div className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                      <p className="tw-text-[12.25px] tw-text-[#b83333]">{contents?.club?.jobs[0].name}</p>
                    </div>
                    <div className="tw-flex-1"></div>{' '}
                    {/* 빈 div로 flex-grow를 추가하여 버튼을 오른쪽으로 밀어냅니다. */}
                    <button
                      className=""
                      onClick={() => {
                        onChangeFavorite(contents?.club?.clubSequence, contents?.club?.isFavorite);
                      }}
                    >
                      {isLiked ? <StarIcon color="error" /> : <StarBorderIcon color="disabled" />}
                    </button>
                  </div>
                </div>

                <div className="tw-text-[20.5px] tw-font-bold tw-text-black tw-mt-4">{contents?.club?.clubName}</div>
                <p className="tw-text-sm tw-mt-2 tw-text-black">{contents?.club?.description}</p>
                <div className="tw-mt-4">
                  <p className="tw-text-sm tw-text-black">
                    학습 주기 : 매주 {contents?.club?.studyCycle.toString()}요일 (총 {contents?.club?.studyWeekCount}회)
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
                      src={contents?.club?.leaderProfileImageUrl || '/assets/avatars/1.jpg'}
                      className="tw-mr-2 border tw-rounded-full tw-w-10 tw-h-10"
                    />
                    <p className="tw-text-sm tw-text-black">{contents?.club?.leaderNickname}</p>
                  </div>
                  <div className="tw-flex tw-gap-4">
                    <div className="tw-bg-gray-400 tw-rounded-[3.5px]  tw-w-[130px] tw-py-[10.0625px] tw-cursor-pointer">
                      <p className="tw-text-[12.25px] tw-font-bold tw-text-white tw-text-center">
                        {getButtonText(contents?.club?.clubStatus)}
                      </p>
                    </div>
                    <div
                      className="tw-bg-[#e11837] tw-rounded-[3.5px] tw-w-[130px] tw-py-[10.0625px] tw-cursor-pointer"
                      onClick={() => router.push('/quiz/' + `${contents?.club?.clubSequence}`)}
                    >
                      <p className="tw-text-[12.25px] tw-font-bold tw-text-white tw-text-center">클럽상세보기</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-overflow-auto tw-rounded-lg tw-pt-10 ">
              <div className="tw-flex tw-flex-row">
                {/* 새로운 div 추가 */}
                <div className="overflow-auto overflow-auto-hover" style={{ width: '100%' }}>
                  <div className="tw-grid tw-grid-flow-col tw-gap-4 border-bottom" style={{ width: 'max-content' }}>
                    {contents?.clubQuizzes?.map((session, idx) => {
                      const isSelected = selectedQuiz?.quizSequence === session.quizSequence;
                      const isPublished = session?.isPublished === false;

                      return (
                        <div
                          key={idx}
                          onClick={() => !isPublished && handleQuizClick(session)}
                          className={`tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer
          ${isSelected ? 'tw-bg-red-500 tw-text-white' : ''}
          ${isPublished ? 'tw-bg-white tw-text-gray-200' : ''}
        `}
                        >
                          <div className="tw-pb-3 tw-px-0 tw-pt-0 tw-rounded-t-lg">
                            <p className="tw-text-base tw-font-bold tw-text-center tw-pt-3">{session?.order}회</p>
                            <p className="tw-text-sm tw-font-medium tw-text-center tw-pt-1">
                              {session?.publishDate.split('-').slice(1).join('-')} ({session?.dayOfWeek})
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {selectedQuiz && (
              <div>
                {selectedQuiz.isPublished ? (
                  <>
                    <div className="tw-my-4 tw-p-4 tw-border tw-rounded-lg tw-bg-gray-100">
                      <div className="tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-0">
                        <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                          <img
                            className="border tw-rounded-full tw-w-10 tw-h-10"
                            src={selectedQuiz?.maker?.profileImageUrl || '/assets/avatars/1.jpg'}
                            alt="프로필 이미지"
                          />
                          <div className="tw-text-xs tw-text-left tw-text-black">{selectedQuiz?.maker?.nickname}</div>
                        </div>
                        <div className="tw-flex-auto tw-w-9/12 tw-px-5">
                          <div className="tw-font-medium tw-text-black tw-text-base tw-line-clamp-2">
                            {selectedQuiz?.question}
                          </div>
                        </div>
                        <div className="tw-flex-auto">
                          <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                            <button
                              onClick={() => window.open(selectedQuiz.contentUrl, '_blank')}
                              className="tw-bg-black tw-p-1.5 tw-text-white tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-text-right tw-text-[#9ca5b2]"
                            >
                              지식컨텐츠 보기
                            </button>
                            <button
                              onClick={() => {
                                router.push(
                                  {
                                    pathname: `/quiz/all-answers/${selectedQuiz?.clubSequence}`,
                                    query: {
                                      publishDate: selectedQuiz?.publishDate,
                                    },
                                  },
                                  `/quiz/all-answers/${selectedQuiz?.clubSequence}`,
                                );
                              }}
                              // onClick={() => {
                              //   router.push(
                              //     {
                              //       pathname: `/quiz/all-answers/{contents?.club?.clubSequence}`,
                              //       query: {
                              //         clubSequence: selectedQuiz?.quizSequence,
                              //       },
                              //     },
                              //     `/quiz/all-answers/${contents?.club?.clubSequence}`,
                              //   );
                              // }}
                              className="border border-danger tw-bg-white tw-text-black tw-p-1.5 tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-font-bold tw-flex tw-items-center"
                            >
                              전체 답변보기
                              <svg
                                width={7}
                                height={10}
                                viewBox="0 0 7 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-grow-0 flex-shrink-0 tw-ml-1"
                                preserveAspectRatio="none"
                              >
                                <path d="M1 1L5 5L1 9" stroke="black" strokeWidth="1.5" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {(selectedQuiz.myAnswerStatus === '0000' || selectedQuiz.myAnswerStatus === '0001') && (
                      <div className="tw-mt-4 border tw-rounded-lg tw-p-5 tw-text-center">
                        <div className="tw-mt-4 tw-pt-4 tw-text-base tw-text-center">
                          <p>아직 해당 퀴즈를 풀지 않았어요.! 퀴즈를 풀고 다른 클럽원들의 답변도 확인해보세요.!</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            router.push(
                              {
                                pathname: `/quiz/solution/${selectedQuiz?.quizSequence}`,
                                query: {
                                  clubSequence: selectedQuiz?.clubSequence,
                                },
                              },
                              `/quiz/solution/${selectedQuiz?.quizSequence}`,
                            );
                          }}
                          className="tw-text-white tw-w-[150px] tw-bg-red-500 tw-my-8 tw-text-sm tw-font-medium tw-rounded tw-text-base tw-px-7 tw-py-3"
                        >
                          퀴즈 풀러가기
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="tw-mt-4 tw-p-4 tw-border tw-rounded-lg tw-bg-gray-100 tw-text-center">
                    <p>퀴즈가 오픈되지 않습니다.</p>
                  </div>
                )}
              </div>
            )}
            <div className="tw-rounded-xl">
              {selectedQuiz?.myAnswerStatus === '0003' && (
                <div>
                  {/* bestAnswerContents가 있을 경우에만 CommunityCard를 렌더링합니다. */}
                  {isQuizAnswerListFetched && bestAnswerContents !== null && (
                    <CommunityCard
                      board={bestAnswerContents || []}
                      replies={bestAnswerContents?.replies}
                      selectedQuiz={selectedQuiz}
                      className={cx('reply-container__item')}
                      type="best"
                      beforeOnePick={beforeOnePick}
                      setBeforeOnePick={setBeforeOnePick}
                      refetchReply={refetchReply}
                    />
                  )}
                  {isQuizAnswerListFetched && myAnswerContents !== null && (
                    <CommunityCard
                      type="my"
                      board={myAnswerContents || []}
                      replies={myAnswerContents?.replies}
                      selectedQuiz={selectedQuiz}
                      className={cx('reply-container__item')}
                      beforeOnePick={beforeOnePick}
                      setBeforeOnePick={setBeforeOnePick}
                      refetchReply={refetchReply}
                    />
                  )}
                  {isQuizAnswerListFetched &&
                    answerContents?.contents?.length > 0 &&
                    answerContents?.contents?.map((item, index) => {
                      return (
                        <CommunityCard
                          type="answer"
                          key={index}
                          board={item || []}
                          selectedQuiz={selectedQuiz}
                          replies={item?.replies}
                          className={cx('reply-container__item ')}
                          beforeOnePick={beforeOnePick}
                          setBeforeOnePick={setBeforeOnePick}
                          refetchReply={refetchReply}
                        />
                      );
                    })}
                </div>
              )}
            </div>
            <div className="tw-flex tw-justify-center tw-mt-10">
              <Pagination count={totalPage} page={page} onChange={handlePageChange} />
            </div>
          </div>
        </div>
      </Desktop>
    </>
  );
}

export default QuizAnswersRoundDetailTemplate;
