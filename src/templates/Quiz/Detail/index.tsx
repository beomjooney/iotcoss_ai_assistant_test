import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { paramProps, useSeminarDetail, useClubAboutDetail } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { useParticipantSeminar } from 'src/services/seminars/seminars.mutations';
import { useSessionStore } from 'src/store/session';
import { useClubDetailQuizList } from 'src/services/quiz/quiz.queries';
import { useQuizDeleteLike, useQuizLike, useSaveLike } from 'src/services/community/community.mutations';
import QuizClubDetailInfo from 'src/stories/components/QuizClubDetailInfo';
import QuizClubDetaillSolution from 'src/stories/components/QuizClubDetaillSolution';

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
  const [contents, setContents] = useState<any>({});
  const [clubAbout, setClubAbout] = useState<any>({});
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
  const [params, setParams] = useState<paramProps>({ page });
  let [isLiked, setIsLiked] = useState(false);

  // 퀴즈 소개 정보 조회
  const { isFetched: isClubAboutFetched } = useClubAboutDetail(id, data => {
    // setClubMemberStatus(data?.clubMemberStatus);
    //console.log(data);
    console.log(data);
    setClubAbout(data);
    console.log('clubMemberStatus', data?.clubMemberStatus);
    console.log('clubStatus ', data?.clubStatus);
  });

  const { isFetched: isParticipantListFetched, isLoading } = useSeminarDetail(id, data => {
    // setClubMemberStatus(data?.clubMemberStatus);
    //console.log(data);
    console.log(data);
    setContents(data);
  });

  const { isFetched: isQuizListFetched, refetch } = useClubDetailQuizList(params, id, data => {
    console.log(data?.contents);
    setQuizList(data?.contents);
    setTotalPage(data?.totalPages);
    setTotalElements(data?.totalElements);
  });

  const { mutate: onParticipant } = useParticipantSeminar();
  const { mutate: onSaveLike, isSuccess: isSuccessLike } = useQuizLike();
  const { mutate: onDeleteLike, isSuccess: isSuccessDelete } = useQuizDeleteLike();

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
    }
  }, [logged, contents, clubMemberStatus]);

  // 클럽 상세 보기 이동 상태
  // 조건 1
  // - clubMemberStatus : 0000/0009(미가입), 0001(신청 중 - 버튼 텍스트 변경 및 버튼 비활성화), 0003(거절), 0004(강퇴 - 버튼 비활성화)
  // - clubStatus : 상관 없음

  // 조건 2
  // - clubMemberStatus : 0002 (가입완료)
  // - clubStatus : 0200(개설 예정), 0210 (개설 연기), 0220 (취소), 0300(모집중), 0310(모집완료)

  // Define the eligibility condition

  // 클럽 퀴즈 풀기 화면 조건
  const isQuizScreen =
    (clubAbout?.clubStatus === '4000' || clubAbout?.clubStatus === '0500') &&
    clubAbout?.clubMemberStatus === '0002' &&
    isParticipantListFetched;

  // 클럽 상세 보기 화면 조건
  const isClubDetailScreen =
    ['0000', '0009', '0001', '0003', '0004'].includes(clubMemberStatus) ||
    (clubMemberStatus === '0002' && ['0200', '0210', '0220', '0300', '0310'].includes(clubAbout?.clubStatus));

  return (
    <div className={cx('seminar-detail-container')}>
      {/* 퀴즈 풀기 화면 */}
      {isParticipantListFetched && isQuizScreen ? (
        <QuizClubDetaillSolution
          border={false}
          totalElements={totalElements}
          totalPage={totalPage}
          page={page}
          handlePageChange={handlePageChange}
          contents={contents}
          quizList={quizList}
        />
      ) : (
        // 클럽 상세 보기 화면
        isClubAboutFetched &&
        isClubDetailScreen && (
          <div className={cx('seminar-container')}>
            <div className={cx('container')}>
              <QuizClubDetailInfo
                border={true}
                clubData={clubAbout}
                user={clubAbout?.leader}
                selectedUniversityName={clubAbout?.jobGroups?.[0]?.name ?? 'N/A'}
                jobLevelName={clubAbout?.jobGroups?.[0]?.name ?? 'N/A'}
                selectedJobName={clubAbout?.jobs?.[0]?.name ?? 'N/A'}
                selectedQuizzes={clubAbout?.clubQuizzes}
              />
            </div>
          </div>
        )
      )}

      {/* {isClubAboutFetched && isEligible ? (
        <div className={cx('container')}>
          <QuizClubDetaillSolution
            border={false}
            totalElements={totalElements}
            totalPage={totalPage}
            page={page}
            handlePageChange={handlePageChange}
            contents={contents}
            quizList={quizList}
          />
        </div>
      ) : (
        <div className={cx('seminar-container')}>
          <div className={cx('container')}>
            <QuizClubDetailInfo
              border={true}
              clubData={clubAbout}
              user={clubAbout?.leader}
              selectedUniversityName={clubAbout?.jobGroups?.[0]?.name ?? 'N/A'}
              jobLevelName={clubAbout?.jobGroups?.[0]?.name ?? 'N/A'}
              selectedJobName={clubAbout?.jobs?.[0]?.name ?? 'N/A'}
              selectedQuizzes={clubAbout?.clubQuizzes}
            />
          </div>
        </div>
      )} */}
      {/* <div className="tw-mt-10">{applicationButton}</div> */}
    </div>
  );
}

export default QuizDetailTemplate;
