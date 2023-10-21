import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import BannerDetail from 'src/stories/components/BannerDetail';
import { jobColorKey } from 'src/config/colors';
import Chip from 'src/stories/components/Chip';
import { useStore } from 'src/store';
import { Button, Typography, Profile, Modal, ArticleCard } from 'src/stories/components';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { paramProps, useMySeminarList, useSeminarDetail, useSeminarList } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { ArticleEnum } from 'src/config/types';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import { useParticipantSeminar } from 'src/services/seminars/seminars.mutations';
import { useSessionStore } from 'src/store/session';
import Grid from '@mui/material/Grid';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import { useClubDetailQuizList } from 'src/services/quiz/quiz.queries';
import Divider from '@mui/material/Divider';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { useQuizDeleteLike, useQuizLike, useSaveLike } from 'src/services/community/community.mutations';

/** rc progress */
import { Line, Circle } from 'rc-progress';

/** import pagenation */
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import PersonIcon from '@mui/icons-material/Person';
import Stack from '@mui/material/Stack';
import router from 'next/router';

const cx = classNames.bind(styles);
export interface QuizDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizDetailTemplate({ id }: QuizDetailTemplateProps) {
  const { user } = useStore();
  const [value, setValue] = React.useState(0);
  const [isBookmark, setIsBookmark] = useState(true);
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [quizList, setQuizList] = useState<RecommendContent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState<boolean>(false);
  const [myParticipation, setMyParticipation] = useState(null);
  const [restTime, setRestTime] = useState(0);
  const [clubStatus, setClubStatus] = useState('0000');
  const [clubMemberStatus, setClubMemberStatus] = useState('0001');
  const [applicationButton, setApplicationButton] = useState<ReactNode>(null);
  const { memberId, logged } = useSessionStore.getState();
  const [contentHtml, setContentHtml] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [params, setParams] = useState<paramProps>({ id, page });
  let [isLiked, setIsLiked] = useState(false);

  const { isFetched: isParticipantListFetched, isLoading } = useSeminarDetail(id, data => {
    setClubMemberStatus(data?.clubMemberStatus);
    //console.log(data);
    setContents(data);
  });
  const { isFetched: isQuizListFetched, refetch } = useClubDetailQuizList(params, data => {
    setQuizList(data?.contents);
    setTotalPage(data?.totalPages);
    setTotalElements(data?.totalElements);
  });

  const { mutate: onParticipant } = useParticipantSeminar();
  const { mutate: onSaveLike, isSuccess: isSuccessLike } = useQuizLike();
  const { mutate: onDeleteLike, isSuccess: isSuccessDelete } = useQuizDeleteLike();

  let tabPannelRefs = [];

  const onChangeLike = function (postNo: number, isLikes: boolean) {
    //console.log(postNo, isLikes);
    if (logged) {
      setIsLiked(!isLikes);
      if (isLikes) {
        onDeleteLike(postNo);
      } else {
        onSaveLike(postNo);
      }
    } else {
      alert('로그인 후 좋아요를 클릭 할 수 있습니다.');
    }
  };

  // REQUESTED("0001") -> 가입 요청
  // CONFIRMED("0002") -> 가입 승인
  // REJECTED("0003") -> 가입 거절
  // BANNED("0004") -> 강퇴
  // DELETED("0005") -> 삭제 (안보임)
  // NONE("0006") -> 클럽과 관계없음 (가입전)

  // TEMPORARY("0001") -> 임시저장상태
  // REQUESTED("0002") -> 개설요청 대기중
  // PENDING("0003") -> 개설 후 모집기간 전 (아직 이 상태는 안쓰고요)
  // IN_PROGRESS("0004") -> 스터디진행중
  // COMPLETE("0005") -> 스터디 완료
  // RECRUITING("0006") -> 모집중
  // RECRUITMENT_ENDED("0007") -> 모집완료, 시작전
  // REJECTED("0008") -> 개설 거절
  // APPROVAL_EXPIRED("0009") -> 개설 승인 유효기간 종료
  // DELETED("0010") -> 삭제 (안보임)

  const handleParticipant = () => {
    //console.log('club join');
    if (!logged) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (user.phoneNumber === null) {
      setIsModalOpen(true);
    } else {
      onParticipant({ clubSequence: id });
      setClubMemberStatus('0001');
    }
  };

  const handleClickTab = index => {
    tabPannelRefs[index].current?.scrollIntoView({ block: 'center' });
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    className?: any;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, className, ...other } = props;
    tabPannelRefs[index] = useRef();

    return (
      <div
        role="tabpanel"
        id={`seminar-tabpanel-${index}`}
        className={cx(`seminar-tabpanel-${index}`, 'seminar-tabpanel', className)}
        aria-labelledby={`simple-tab-${index}`}
        ref={tabPannelRefs[index]}
        {...other}
      >
        {children}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handlerTodayQuizSolution = () => {
    console.log(user);
    if (user.phoneNumber === null || user.phoneNumber === '') {
      setIsModalOpen(true);
    } else {
      const firstItemWithNullAnswer = quizList.find(item => item.answer.answerStatus === '0000');
      router.push('/quiz/solution/' + `${firstItemWithNullAnswer?.clubQuizSequence}`);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    setParams({
      // ...params,
      id,
      page,
    });
  }, [page]);

  useEffect(() => {
    refetch();
  }, [isSuccessLike, isSuccessDelete]);

  useEffect(() => {
    if (!logged) {
      setApplicationButton(
        <button
          disabled
          type="button"
          className="tw-w-full tw-text-white tw-bg-gray-400   tw-font-semibold tw-text-xl tw-px-5 tw-py-5"
        >
          로그인 후 신청 가능합니다.
        </button>,
      );
    } else if (isParticipantListFetched) {
      // console.log(1111, contents?.clubStatus, clubMemberStatus);

      if (contents?.isLeader && contents?.clubStatus == '0007') {
        setApplicationButton(
          <button
            // disabled
            type="button"
            className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
          >
            모집 완료 ({contents?.startAt}) 퀴즈클럽 시작
          </button>,
        );
      } else if (contents?.isLeader && contents?.clubStatus == '0004') {
        setApplicationButton(
          <button
            type="button"
            onClick={handlerTodayQuizSolution}
            className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
          >
            오늘의 퀴즈 풀기
          </button>,
        );
      } else if (contents?.clubStatus == '0006' && clubMemberStatus == '0006') {
        setApplicationButton(
          <button
            type="button"
            onClick={() => handleParticipant()}
            className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
          >
            참여하기
          </button>,
        );
      } else if (contents?.clubStatus == '0006' && clubMemberStatus == '0001') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
          >
            가입요청 승인중
          </button>,
        );
      } else if (contents?.clubStatus == '0006' && clubMemberStatus == '0002') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
          >
            가입승인 완료
          </button>,
        );
      } else if (contents?.clubStatus == '0006' && clubMemberStatus == '0003') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
          >
            진행불가
          </button>,
        );
      } else if (contents?.clubStatus == '0006' && clubMemberStatus == '0004') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
          >
            모집완료
          </button>,
        );
      } else if (contents?.clubStatus == '0007') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
          >
            모집완료
          </button>,
        );
      } else if (contents?.clubStatus == '0004' && clubMemberStatus == '0002') {
        setApplicationButton(
          <button
            type="button"
            onClick={handlerTodayQuizSolution}
            className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
          >
            오늘의 퀴즈 풀기
          </button>,
        );
      } else if (contents?.clubStatus == '0004' && clubMemberStatus == '0006') {
        setApplicationButton(
          <button
            disabled
            type="button"
            className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
          >
            진행중 참여 불가
          </button>,
        );
      } else if (contents?.clubStatus == '0005') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
          >
            진행 종료
          </button>,
        );
      }
    }
  }, [logged, contents, clubMemberStatus]);
  return (
    <div className={cx('seminar-detail-container')}>
      {isParticipantListFetched &&
        (contents?.clubStatus == '0004' && contents?.clubMemberStatus == '0002' ? (
          <div>
            <BannerDetail
              data={contents}
              title="퀴즈클럽"
              subTitle="클럽 상세보기"
              className="tw-bg-[#fffff]"
              imageName="top_banner_seminar.svg"
              onClick={() => handleParticipant()}
              setIsModalOpen={function (file: boolean): void {
                throw new Error('Function not implemented.');
              }}
            />
            {/*바로 밑에 자식만 sticky 적용됨*/}
            <div className={cx('content-wrap')}>
              <div className="tw-bg-[#F2F9FF]">
                <div className={cx('container')}>
                  <div className="tw-leading-normal tw-text-black tw-font-bold tw-text-xl tw-pt-10">실행율</div>
                  <div className="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-font-bold tw-text-black">
                    <div className="tw-span-cols-1"></div>
                    <div className="tw-span-cols-1 tw-text-center">
                      <div className="tw-text-center tw-flex tw-justify-center tw-items-center">
                        <Circle
                          className="tw-h-[150px] tw-mb-5 "
                          trailWidth={8}
                          trailColor="#DADADA"
                          percent={contents?.progress?.myRunRate}
                          strokeWidth={8}
                          strokeColor="#2474ED"
                        />
                      </div>
                      <div className="tw-mt-5">
                        나의 실행률{' '}
                        <span className="tw-font-bold tw-text-blue-500">{parseInt(contents?.progress?.myRunRate)}</span>
                        %
                      </div>
                      <div>
                        <span className="tw-font-bold tw-text-blue-500">{contents?.progress?.myStudyCount}</span>회 /{' '}
                        <span className="tw-font-bold tw-text-gray-400">{contents?.studyTotalCount}회</span>
                      </div>
                    </div>
                    <div className="tw-span-cols-1 tw-text-center">
                      <div className="tw-text-center tw-flex tw-justify-center tw-items-center">
                        <Circle
                          className="tw-h-[150px] tw-mb-5"
                          trailWidth={8}
                          trailColor="#DADADA"
                          percent={contents?.progress?.myRunRate}
                          strokeWidth={8}
                          strokeColor="#9A9A9A"
                        />
                      </div>
                      <div className="tw-mt-5">
                        평균 실행률 :{' '}
                        <span className="tw-font-bold tw-text-gray-400">
                          {parseInt(contents?.progress?.averageRunRate)}
                        </span>
                        %
                      </div>
                      <div>
                        {contents?.progress?.averageStudyCount}회 /
                        <span className="tw-font-bold tw-text-gray-400">{contents?.studyTotalCount}회</span>
                      </div>
                    </div>
                    <div className="tw-font-medium tw-span-cols-1 tw-flex tw-items-end">
                      <PersonIcon className="tw-mr-1  tw-w-5" />
                      {contents?.recruitedMemberCount}
                    </div>
                  </div>
                </div>
              </div>
              <div className={cx('container', 'tw-mt-10')}>
                <Grid container direction="row" alignItems="center" rowSpacing={0}>
                  <Grid container justifyContent="flex-start" xs={10} className="tw-text-xl tw-text-black tw-font-bold">
                    퀴즈목록 {totalElements}
                  </Grid>
                  <Grid container justifyContent="flex-end" xs={2} style={{ textAlign: 'right' }}>
                    {/* <Pagination page={page} setPage={setPage} total={totalPage} /> */}
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
                {quizList.map((item, index) => {
                  return (
                    <Grid
                      className="tw-pt-5"
                      key={index}
                      container
                      direction="row"
                      justifyContent="left"
                      alignItems="center"
                      rowSpacing={3}
                    >
                      <Grid item xs={1}>
                        <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">Q{index + 1}.</div>
                        <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                          {item?.weekNumber}주차 ({item?.dayOfWeek})
                        </div>
                      </Grid>
                      <Grid item xs={11}>
                        {item?.isPublished ? (
                          <div className="border tw-rounded-xl">
                            <div
                              className={`tw-bg-zinc-50 tw-flex tw-items-center tw-p-4  tw-py-6   ${
                                item?.answer ? 'tw-rounded-tl-xl tw-rounded-tr-xl' : 'tw-rounded-xl'
                              }`}
                            >
                              {item?.isRepresentative === true && (
                                <button
                                  type="button"
                                  data-tooltip-target="tooltip-default"
                                  className="tw-w-[60px] tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-bold tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                                >
                                  대표
                                </button>
                              )}
                              <div className="tw-flex-auto tw-px-5">
                                <div className="tw-font-medium tw-text-black">{item?.content}</div>
                              </div>

                              <div className="tw-mr-7">
                                <button
                                  onClick={() => {
                                    onChangeLike(item?.clubQuizSequence, item?.isLiked);
                                  }}
                                >
                                  {item?.isLiked ? (
                                    <ThumbUpAltIcon color="primary" />
                                  ) : (
                                    <ThumbUpOffAltIcon color="disabled" />
                                  )}
                                </button>
                              </div>

                              {item?.answer?.answerStatus === '0000' ? (
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (user.phoneNumber === null || user.phoneNumber === '') {
                                        setIsModalOpen(true);
                                      } else {
                                        router.push('/quiz/solution/' + `${item?.clubQuizSequence}`);
                                      }
                                    }}
                                    data-tooltip-target="tooltip-default"
                                    className="tw-w-[120px] tw-bg-[#2474ED] tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                  >
                                    퀴즈 풀러가기 {'>'}
                                  </button>
                                </div>
                              ) : item?.answer?.answerStatus === '0001' ? (
                                <div className="">
                                  <button
                                    type="button"
                                    onClick={() => router.push('/quiz/solution/' + `${item?.clubQuizSequence}`)}
                                    data-tooltip-target="tooltip-default"
                                    className="tw-bg-gray-300 tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                  >
                                    1차답변 입력완료
                                  </button>
                                </div>
                              ) : item?.answer?.answerStatus === '0002' ? (
                                <div className="">
                                  <button
                                    type="button"
                                    onClick={() => router.push('/quiz/solution/' + `${item?.clubQuizSequence}`)}
                                    data-tooltip-target="tooltip-default"
                                    className="tw-bg-gray-300 tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                  >
                                    이해도 입력완료
                                  </button>
                                </div>
                              ) : (
                                <div className="">
                                  <button
                                    // onClick={() => router.push('/quiz/round-answers/' + `${item?.clubQuizSequence}`)}
                                    onClick={() => router.push('/quiz/answers/' + `${item?.clubQuizSequence}`)}
                                    type="button"
                                    data-tooltip-target="tooltip-default"
                                    className="tw-bg-[#FF8D8D] tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                  >
                                    전체 답변보기 {'>'}
                                  </button>
                                </div>
                              )}
                            </div>
                            {item?.answer ? (
                              <div className="tw-bg-white tw-flex tw-items-center tw-p-4  tw-py-6 tw-rounded-bl-xl tw-rounded-br-xl">
                                <div className="tw-flex-auto">
                                  <div className="tw-font-medium tw-text-gray-500 tw-text-sm tw-line-clamp-2">
                                    {item?.answer?.text}
                                  </div>
                                </div>
                                {/* <div className="">
                                <div className="tw-font-medium tw-text-black ">
                                  <button
                                    onClick={() => router.push('/quiz/round-answers/' + `${item?.clubQuizSequence}`)}
                                    // onClick={() => router.push('/quiz/answers/' + `${item?.clubQuizSequence}`)}
                                    type="button"
                                    data-tooltip-target="tooltip-default"
                                    className="tw-bg-white tw-text-gray-500 tw-text-sm tw-font-right tw-px-3 tw-py-1 tw-rounded"
                                  >
                                    자세히보기
                                  </button>
                                </div>
                              </div> */}
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        ) : (
                          <div className="border tw-rounded-xl p-4">
                            {item?.isRepresentative === true && (
                              <button
                                type="button"
                                data-tooltip-target="tooltip-default"
                                className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-bold tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                              >
                                대표
                              </button>
                            )}
                            {item?.publishDate} 질문공개
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  );
                  // <ArticleCard uiType={item.contentsType} content={item} key={i} className={cx('container__item')} />
                })}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <BannerDetail
              data={contents}
              title="퀴즈클럽"
              subTitle="클럽 상세보기"
              imageName="top_banner_seminar.svg"
              className="tw-bg-[#FFFAF1]"
              setIsModalOpen={setIsModalOpen}
            />
            <div className="tw-bg-[#FFFAF1]">
              <div className="container">
                <div className={cx('content-wrap')}>
                  <div className={cx('content', 'tw-px-11')}>
                    <Tabs
                      indicatorColor="white"
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                      className={cx('tabs', 'sticky', 'tw-bg-red-500')}
                      style={{ backgroundColor: '#FFFAF1' }}
                    >
                      <Tab
                        style={{ backgroundColor: '#fff' }}
                        label="퀴즈클럽 소개"
                        {...a11yProps(0)}
                        onClick={() => handleClickTab(0)}
                      />
                      <Tab
                        style={{ backgroundColor: '#fff' }}
                        label="크루활동"
                        {...a11yProps(1)}
                        onClick={() => handleClickTab(1)}
                      />
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
            <div className="container tw-px-11">
              <TabPanel value={value} index={0} className="tw-p-5">
                <div className="tw-flex tw-items-center tw-space-x-4 tw-my-5">
                  <img
                    className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full"
                    src={contents?.leaderProfileImageUrl}
                    alt=""
                  />
                  <div className="tw-text-base tw-font-semibold tw-text-black dark:tw-text-white">
                    <div>{contents?.leaderNickname}</div>
                  </div>
                </div>

                <div className="tw-text-xl tw-mb-10 tw-font-bold tw-text-black dark:tw-text-gray-400">
                  퀴즈클럽 소개
                </div>
                <div className="tw-text-base tw-mb-10 tw-font-normal tw-text-black dark:tw-text-gray-400">
                  {/* <ReactMarkdown children={value1} remarkPlugins={[remarkGfm]} /> */}
                  <div dangerouslySetInnerHTML={{ __html: contents?.description }} />
                </div>

                <div className="tw-text-xl tw-mb-10 tw-font-bold tw-text-black dark:tw-text-gray-400">
                  퀴즈클럽 질문 미리보기
                </div>

                <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-400 dark:tw-text-gray-400">
                  {contents?.studyWeekCount}주 총 학습 {contents?.studyTotalCount}회 진행
                </div>

                {contents?.clubQuizzes?.map((item, index) => {
                  if (item?.isRepresentative === true) {
                    return (
                      <div key={index} className="">
                        <div className="tw-grid  tw-grid-cols-12 tw-flex tw-items-center tw-px-0 tw-border mb-2 mt-0 rounded">
                          <div className="tw-col-span-1 ">
                            <div className="tw-mx-3 tw-py-2 tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-text-center  tw-rounded">
                              대표 {index + 1}
                            </div>
                          </div>
                          <div className="tw-col-span-11 ">
                            <div className="tw-font-medium tw-text-black">{item.content}</div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // 다른 경우에는 렌더링하지 않음
                    return null;
                  }
                })}
              </TabPanel>
              <TabPanel value={value} index={1}>
                {/* <Profile
                      showDesc
                      mentorInfo={data?.seminarLecturer}
                      className={cx('seminar-tabpanel-1__profile', 'col-md-4')}
                      imageSize={160}
                      colorMode="primary"
                      isDetail
                    /> */}
              </TabPanel>
              <TabPanel value={value} index={2}>
                {/* <Typography type="H3" bold>
                    크루활동
                  </Typography> */}
                <div
                  dangerouslySetInnerHTML={{ __html: contents?.seminarCurriculum }}
                  className={cx('seminar-tabpanel__html-content')}
                />
              </TabPanel>
            </div>
            <div className={cx('container')}>
              {/*바로 밑에 자식만 sticky 적용됨*/}
              <div className={cx('content-wrap')}>
                <div className={cx('content')}>
                  {contents?.imageUrl3 && (
                    <Image
                      src={`${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${contents?.imageUrl3}`}
                      alt={`${contents?.seminarTitle}`}
                      layout="responsive"
                      width="736"
                      height="420"
                      objectFit="fill"
                      unoptimized={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      <div className="tw-mt-10">{applicationButton}</div>
      <Modal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} title="퀴즈풀러가기" maxWidth="900px">
        <div className={cx('seminar-check-popup')}>
          <div className={cx('mb-5')}>
            <span className={cx('text-bold', 'tw-text-xl', 'tw-font-bold')}>퀴즈 클럽 가입에 연락처가 필요합니다.</span>
          </div>
          <div>효과적이고 원활한 퀴즈 클럽 진행을 위해,</div>
          <div>클럽 소통 채널을 개설할 예정입니다.</div>
          <br></br>
          <div>프로필로 이동하여, 연락처를 기입해주세요.</div>
          <div>연라거는 클럽 활동 외에 다른 용도로 사용되지 않습니다.</div>
          <br></br>
          <div className="tw-mt-5">
            <Button
              className="tw-mr-5"
              color="lite-gray"
              label="취소"
              size="modal"
              onClick={() => setIsModalOpen(false)}
            />
            <Button
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
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default QuizDetailTemplate;
