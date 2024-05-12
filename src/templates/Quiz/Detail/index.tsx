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
import QuizClubDetailInfo from 'src/stories/components/QuizClubDetailInfo';
import QuizClubDetaillSolution from 'src/stories/components/QuizClubDetaillSolution';

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

const clubInfo = {
  intro: '비전공자 개발자라면, 컴퓨터 공학 지식에 대한 갈증이 있을텐데요...',
  benefits: '개발에 대한 기초적인 지식을 기반으로...',
  schedule: '2023.06.01 - 2023.06.18 / 주2회(월, 수) 총 36개 퀴즈',
  recommendation: '컴공에 대한 기초적인 지식이 있으신 분...',
};

const leaders = {
  name: '양황규 교수님',
  position: '교수ㅣ컴퓨터공학과ㅣ20년차',
  description: '동서대학교 석현태 교수입니다.',
  greeting: '안녕하세요. 이 퀴즈 클럽을 운영하게 된 양황규 교수입니다...',
  career: '(현) 카카오 개발 리더...',
  projects: '카카오 모빌리티 앱 개발...',
  tags: ['JAVA', 'Spring5', 'Go'],
  departments: [
    { label: '소프트웨어융합대학', bgColor: 'tw-bg-[#d7ecff]', textColor: 'tw-text-[#235a8d]' },
    { label: '컴퓨터공학과', bgColor: 'tw-bg-[#e4e4e4]', textColor: 'tw-text-[#313b49]' },
  ],
};

const representativeQuizzes = [
  { question: 'ESB와 API Gateway 차이점에 대해서 설명하세요' },
  { question: 'Grafana 주요기능 및 역할에 대해서 설명하세요.' },
  { question: '대용량 DB 트래픽 처리를 위한 Query Off Loading에 대해서 설명하세요.' },
];

const clubQuizzes = {
  title: '임베디드 시스템',
  details: '[전공선택] 3학년 화요일 A반',
  schedule: '학습 주기 : 매주 화요일 (총 12회)',
  duration: '학습 기간 : 12주 (2024. 09. 03 ~ 2024. 11. 03)',
  participants: '참여 인원 : 24명',
  leader: '양황규 교수',
  tags: [
    { label: '소프트웨어융합대학', bgColor: 'tw-bg-[#d7ecff]', textColor: 'tw-text-[#235a8d]' },
    { label: '컴퓨터공학과', bgColor: 'tw-bg-[#e4e4e4]', textColor: 'tw-text-[#313b49]' },
    { label: '3학년', bgColor: 'tw-bg-[#ffdede]', textColor: 'tw-text-[#b83333]' },
  ],
};

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
        // setApplicationButton(
        //   <button
        //     type="button"
        //     onClick={handlerTodayQuizSolution}
        //     className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
        //   >
        //     오늘의 퀴즈 풀기
        //   </button>,
        // );
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
        // setApplicationButton(
        //   <button
        //     type="button"
        //     onClick={handlerTodayQuizSolution}
        //     className="tw-w-full tw-text-white tw-bg-[#555555]   tw-font-semibold tw-text-xl tw-px-5 tw-py-8"
        //   >
        //     오늘의 퀴즈 풀기
        //   </button>,
        // );
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
            onClick={() => handleParticipant()}
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
        (true ? (
          // (contents?.clubStatus == '0004' && contents?.clubMemberStatus == '0002' ? (
          <div className={cx('container')}>
            <QuizClubDetaillSolution
              border={false}
              clubInfo={clubInfo}
              leaders={leaders}
              clubQuizzes={clubQuizzes}
              totalElements={totalElements}
              totalPage={totalPage}
              page={page}
              handlePageChange={handlePageChange}
              quizList={quizList}
              representativeQuizzes={representativeQuizzes}
            />
            {/* <BannerDetail
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
            <div className={cx('content-wrap')}>
              <div className="tw-bg-[#F2F9FF]">
                <div className={cx('container')}>
                  <div className="tw-leading-normal tw-text-black tw-font-bold tw-text-xl tw-pt-10">실행율</div>
                  <div className="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-font-bold tw-text-black">
                    <div className="tw-span-cols-1 "></div>
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
                      <Grid item xs={12} sm={1}>
                        <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">Q{index + 1}.</div>
                        <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                          {item?.weekNumber}주차 ({item?.dayOfWeek})
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={11}>
                        {item?.isPublished ? (
                          <div className="border tw-rounded-xl">
                            <div
                              className={`tw-bg-zinc-50 tw-flex tw-items-center tw-p-4 max-lg:tw-p-3 tw-py-6   ${
                                item?.answer ? 'tw-rounded-tl-xl tw-rounded-tr-xl' : 'tw-rounded-xl'
                              }`}
                            >
                              {item?.isRepresentative === true && (
                                <button
                                  type="button"
                                  data-tooltip-target="tooltip-default"
                                  className="tw-w-0.5/12 tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-bold tw-px-3 tw-py-1 tw-rounded"
                                >
                                  대표
                                </button>
                              )}
                              <div className="tw-flex-auto tw-px-5 tw-w-3/12">
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
                                    className="max-lg:tw-w-[60px] tw-w-[120px] tw-bg-[#2474ED] tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
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
                                    className="max-lg:tw-w-[60px]  tw-bg-gray-300 tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
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
                                    className="max-lg:tw-w-[60px] tw-bg-gray-300 tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
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
                                    className="max-lg:tw-w-[60px] tw-bg-[#FF8D8D] tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
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
                })}
              </div>
            </div> */}
          </div>
        ) : (
          <div className={cx('seminar-container')}>
            <div className={cx('container')}>
              <QuizClubDetailInfo
                border={false}
                clubInfo={clubInfo}
                leaders={leaders}
                clubQuizzes={clubQuizzes}
                representativeQuizzes={representativeQuizzes}
              />
            </div>
          </div>
        ))}
      {/* <div className="tw-mt-10">{applicationButton}</div> */}
    </div>
  );
}

export default QuizDetailTemplate;
