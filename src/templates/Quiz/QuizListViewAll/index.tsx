import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { paramProps, useMySeminarList, useSeminarDetail, useSeminarList } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { useParticipantSeminar } from 'src/services/seminars/seminars.mutations';
import { useSessionStore } from 'src/store/session';
import { useClubDetailQuizList } from 'src/services/quiz/quiz.queries';
import { useQuizDeleteLike, useQuizLike, useSaveLike } from 'src/services/community/community.mutations';
import QuizClubListView from 'src/stories/components/QuizClubListView';
import router from 'next/router';

const cx = classNames.bind(styles);
export interface QuizListViewAllTemplateProps {
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

export function QuizListViewAllTemplate({ id }: QuizListViewAllTemplateProps) {
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

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <QuizClubListView
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
      </div>
    </div>
  );
}

export default QuizListViewAllTemplate;
