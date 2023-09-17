import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import BannerDetail from 'src/stories/components/BannerDetail';
import { jobColorKey } from 'src/config/colors';
import Chip from 'src/stories/components/Chip';
import { useStore } from 'src/store';
import { Button, Typography, Profile, Modal, ArticleCard, Pagination } from 'src/stories/components';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useMySeminarList, useSeminarDetail, useSeminarList } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { ArticleEnum } from 'src/config/types';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import {
  useEncoreSeminar,
  useOpenSeminar,
  useParticipantCancelSeminar,
  useParticipantSeminar,
} from 'src/services/seminars/seminars.mutations';
import { useSessionStore } from 'src/store/session';
import Grid from '@mui/material/Grid';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import router from 'next/router';
import { useClubDetailQuizList, useQuizSolutionDetail } from 'src/services/quiz/quiz.queries';
import Divider from '@mui/material/Divider';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

// import { Item } from '@shopify/polaris/build/ts/src/components/ActionList/components';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// import { remark } from 'remark';
// import html from 'remark-html';

const cx = classNames.bind(styles);
export interface QuizAnswersDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizAnswersDetailTemplate({ id }: QuizAnswersDetailTemplateProps) {
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
  const [params, setParams] = useState<paramProps>({ id, page });
  let [isLiked, setIsLiked] = useState(false);

  const { isFetched: isParticipantListFetched, data } = useQuizSolutionDetail(id, data => {
    setContents(data);
  });

  // const { isFetched: isParticipantListFetched, data } = useSeminarDetail(id, data => {
  //   setClubMemberStatus(data?.clubMemberStatus);
  // });
  // const { isFetched: isQuizListFetched } = useClubDetailQuizList(params, data => {
  //   setQuizList(data?.contents);
  //   setTotalPage(data?.totalPages);
  // });

  const { mutate: onParticipant } = useParticipantSeminar();
  const { mutate: onCancelParticipant } = useParticipantCancelSeminar();
  const { mutate: onEncoreSeminar } = useEncoreSeminar();

  let tabPannelRefs = [];

  const onOpenSeminarFnc = () => {
    if (logged) {
      if (confirm('세미나 앵콜 신청을 하시겠습니까?')) {
        onEncoreSeminar({
          seminarId: id,
          memberId: memberId,
          mentorId: data?.seminarLecturer?.memberId,
        });
      }
    } else {
      alert('로그인 세미나 앵콜 신청을 할 수 있습니다.');
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
    console.log('club join');
    if (!logged) {
      alert('로그인이 필요합니다.');
      return;
    }

    // if (!user?.phoneNumber || user?.phoneNumber?.length === 0) {
    //   alert('마이커리어>회원정보에 휴대전화 등록 후 신청 가능 합니다.');
    //   return;
    // }

    onParticipant({ clubSequence: id });
    setClubMemberStatus('0001');

    //setIsModalOpen(false);
    //setIsModalCancelOpen(false);
    // setApplicationButton(<Button color="lite-gray" label="승인 대기 중" size="large" />);
  };

  const handleCancelParticipant = () => {
    if (!logged) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!user?.phoneNumber || user?.phoneNumber?.length === 0) {
      alert('마이커리어>회원정보에 휴대전화 등록 후 취소 가능 합니다.');
      return;
    }

    onCancelParticipant({ seminarId: id, memberId });
    setIsModalOpen(false);
    setIsModalCancelOpen(false);
    setApplicationButton(
      <Button label="멘토 세미나 참여 신청하기" size="large" onClick={() => setIsModalOpen(true)} />,
    );
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

  const lectureName = () => {
    return data?.seminarLecturer?.nickname ?? data?.seminarLecturer?.name;
  };

  useEffect(() => {
    setParams({
      // ...params,
      id,
      page,
    });
  }, [page]);

  return (
    <div className={cx('seminar-detail-container')}>
      {/* <BannerDetail data={data} title="퀴즈클럽" subTitle="클럽 상세보기" imageName="top_banner_seminar.svg" /> */}
      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={9} className="tw-font-bold tw-text-3xl tw-text-black">
              퀴즈클럽 {'>'} 클럽 상세보기 {'>'} 답변 전체보기
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                onClick={() => router.back()}
                type="button"
                className="tw-text-white tw-bg-blue-500  tw-focus:ring-4  tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
              >
                뒤로가기
              </button>
            </Grid>
          </Grid>

          <Divider className="tw-my-7 tw-border tw-bg-['#efefef']" />

          <div className="tw-p-0 tw-text-sm tw-font-normal tw-text-gray-500 ">
            {contents?.recommendJobGroupNames?.map((name, i) => (
              <span
                key={i}
                className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600"
              >
                {name}
              </span>
            ))}
            <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
              {contents?.recommendLevels?.sort().join(',')}레벨
            </span>
            {contents?.recommendJobNames?.map((name, i) => (
              <span
                key={i}
                className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-100 tw-text-sm tw-font-light tw-text-gray-600"
              >
                {name}
              </span>
            ))}
            {contents?.hashTags?.map((name, i) => (
              <span
                key={i}
                className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-gray-700"
              >
                {name}
              </span>
            ))}
          </div>
          <div className="tw-text-black tw-font-bold tw-text-2xl tw-py-4">{contents?.clubName}</div>
        </div>

        <Divider className="tw-my-1 tw-border tw-bg-['#efefef']" />

        <Grid
          container
          direction="row"
          justifyContent="left"
          className="tw-mt-2"
          // alignItems="center"
          rowSpacing={3}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={8}>
            <div className="tw-bg-gray-50 tw-rounded-lg tw-p-5 tw-text-black ">
              <div className="tw-flex tw-items-center tw-space-x-4 tw-my-5">
                <img
                  className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full"
                  src={contents?.clubLeaderProfileImageUrl}
                  alt=""
                />
                <div className="tw-text-base tw-font-semibold tw-text-black">
                  <div>{contents?.clubLeaderNickname}</div>
                </div>
              </div>
              <div className="tw-text-center tw-space-x-4 tw-my-5">
                <div className="tw-text-sm tw-font-semibold tw-text-black">
                  <div>
                    Q{contents?.order}. {contents?.weekNumber}주차 {contents?.studyDay}요일
                  </div>
                </div>
              </div>
              <div className="tw-text-center">
                {contents?.isRepresentative === true && (
                  <span
                    type="button"
                    data-tooltip-target="tooltip-default"
                    className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-bold tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                  >
                    대표
                  </span>
                )}
                <span className="tw-font-bold tw-text-xl tw-text-black">{contents?.content}</span>
              </div>
              <div className="tw-text-center tw-py-3">
                <span className="tw-font-right tw-text-base tw-text-gray-400">#123 #1231</span>
              </div>
              <div className="tw-text-left tw-py-3">
                <span className="tw-font-bold tw-text-base tw-text-black">active {contents?.activeCount}</span>
                <span className="tw-font-bold tw-text-base tw-text-black">like {contents?.likeCount}</span>
                <span className="tw-font-bold tw-text-base tw-text-black">answers {contents?.answerCount}</span>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="tw-bg-gray-50 tw-rounded-lg tw-h-[400px] tw-p-5 tw-text-black ">
              <div className="tw-font-bold tw-text-base tw-pb-5">이달의 메이커</div>
              <div className="tw-bg-white">ㅇㅇ</div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default QuizAnswersDetailTemplate;
