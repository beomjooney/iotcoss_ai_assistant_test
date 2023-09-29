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
import QuizSolutionDetail from 'src/stories/components/QuizSolutionDetail';
import { useQuizSolutionDetail, useQuizSolutionDetailStatus } from 'src/services/quiz/quiz.queries';
// import { Item } from '@shopify/polaris/build/ts/src/components/ActionList/components';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// import { remark } from 'remark';
// import html from 'remark-html';

const cx = classNames.bind(styles);
export interface QuizSolutionTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizSolutionTemplate({ id }: QuizSolutionTemplateProps) {
  const { user } = useStore();
  const [value, setValue] = React.useState(0);
  const [isBookmark, setIsBookmark] = useState(true);
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState<boolean>(false);
  const [myParticipation, setMyParticipation] = useState(null);
  const [restTime, setRestTime] = useState(0);
  const [clubStatus, setClubStatus] = useState('0000');
  const [clubMemberStatus, setClubMemberStatus] = useState('0001');
  const [applicationButton, setApplicationButton] = useState<ReactNode>(null);
  const { memberId, logged } = useSessionStore.getState();

  const { isFetched: isParticipantListFetched, data } = useQuizSolutionDetail(id);
  const { isFetched: isParticipantListStatusFetched, data: quizSolutionDetailStatus } = useQuizSolutionDetailStatus(id);

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

  //   TEMPORARY("0001") -> 임시저장상태
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
    if (!logged) {
      setApplicationButton(<Button label="로그인 후 신청 가능합니다" color="lite-gray" size="large" />);
    } else if (isParticipantListFetched) {
      console.log(1111, data?.clubStatus, clubMemberStatus);

      if (data?.isLeader && data?.clubStatus == '0007') {
        setApplicationButton(
          <button
            // disabled
            type="button"
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
            // onClick={() => router.push('/quiz/solution')}
          >
            모집 완료 ({data?.startAt}) 퀴즈클럽 시작
          </button>,
        );
      } else if (data?.isLeader && data?.clubStatus == '0004') {
        setApplicationButton(
          <button
            type="button"
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            퀴즈 풀기
          </button>,
        );
      } else if (data?.clubStatus == '0006' && clubMemberStatus == '0006') {
        setApplicationButton(
          <button
            type="button"
            onClick={() => handleParticipant()}
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            참여하기
          </button>,
        );
      } else if (data?.clubStatus == '0006' && clubMemberStatus == '0001') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            가입요청 승인중
          </button>,
        );
      } else if (data?.clubStatus == '0006' && clubMemberStatus == '0002') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            가입승인 완료
          </button>,
        );
      } else if (data?.clubStatus == '0006' && clubMemberStatus == '0003') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            진행불가
          </button>,
        );
      } else if (data?.clubStatus == '0006' && clubMemberStatus == '0004') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            모집완료
          </button>,
        );
      } else if (data?.clubStatus == '0007') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            모집완료
          </button>,
        );
      } else if (data?.clubStatus == '0004' && clubMemberStatus == '0002') {
        setApplicationButton(
          <button
            type="button"
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            퀴즈풀기
          </button>,
        );
      } else if (data?.clubStatus == '0004' && clubMemberStatus == '0006') {
        setApplicationButton(
          <button
            disabled
            type="button"
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            진행중 참여 불가
          </button>,
        );
      } else if (data?.clubStatus == '0005') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            진행 종료
          </button>,
        );
      }
    }
  }, [logged, data, clubMemberStatus]);
  const youtText = '#h1 ##h2';
  const [value1, setValue1] = useState('# A demo of `react-markdown`');
  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black max-lg:!tw-text-base">
              퀴즈클럽
            </Grid>
            <Grid item xs={7} className="max-lg:tw-p-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-sm">
              관심 주제별로 성장 퀴즈를 풀고 네트워킹 할 수 있는 클럽을 만나보세요!
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex"></Grid>
          </Grid>
        </div>
      </div>
      <QuizSolutionDetail
        data={data}
        quizStatus={quizSolutionDetailStatus}
        title="퀴즈풀기"
        subTitle="퀴즈클럽 풀고 천하무적 커리어를 만들어요!"
        imageName="top_banner_seminar.svg"
      />
    </div>
  );
}

export default QuizSolutionTemplate;
