import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { paramProps, useMyProgress, useClubAboutDetail } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { useParticipantSeminar } from 'src/services/seminars/seminars.mutations';
import { useSessionStore } from 'src/store/session';
import { useClubDetailQuizList } from 'src/services/quiz/quiz.queries';
import QuizClubDetailInfo from 'src/stories/components/QuizClubDetailInfo';
import QuizClubDetaillSolution from 'src/stories/components/QuizClubDetaillSolution';

const cx = classNames.bind(styles);
export interface QuizDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizDetailTemplate({ id }: QuizDetailTemplateProps) {
  const { user } = useStore();
  const [contents, setContents] = useState<any>({});
  const [clubAbout, setClubAbout] = useState<any>({});
  const [quizList, setQuizList] = useState<RecommendContent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [clubMemberStatus, setClubMemberStatus] = useState('0001');
  const [applicationButton, setApplicationButton] = useState<ReactNode>(null);
  const { memberId, logged } = useSessionStore.getState();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [params, setParams] = useState<paramProps>({ page });

  // 퀴즈 소개 정보 조회
  const { isFetched: isClubAboutFetched, refetch: refetchClubAbout } = useClubAboutDetail(id, data => {
    console.log(data);
    setClubAbout(data);
    console.log('clubMemberStatus', data?.clubMemberStatus);
    console.log('clubStatus ', data?.clubStatus);
  });

  //my-progress
  const { isFetched: isParticipantListFetched, isLoading } = useMyProgress(id, data => {
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    setParams({
      // ...params,
      page,
    });
  }, [page]);

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

  // console.log('clubStatus', clubAbout?.clubStatus);
  // console.log('clubMemberStatus', clubAbout?.clubMemberStatus);

  const isQuizScreen = clubAbout?.clubAboutStatus === '0401' && isParticipantListFetched;

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        {/* 퀴즈 풀기 화면 */}
        {isParticipantListFetched && isQuizScreen ? (
          <QuizClubDetaillSolution
            border={false}
            totalElements={totalElements}
            totalPage={totalPage}
            page={page}
            handlePageChange={handlePageChange}
            contents={contents}
            clubAbout={clubAbout}
            quizList={quizList}
          />
        ) : (
          // 클럽 상세 보기 화면
          isClubAboutFetched && (
            <div>
              <QuizClubDetailInfo
                border={true}
                refetchClubAbout={refetchClubAbout}
                clubData={clubAbout}
                user={clubAbout?.leader}
                selectedUniversityName={clubAbout?.jobGroups?.[0]?.name ?? 'N/A'}
                jobLevelName={clubAbout?.jobLevels ?? ''}
                selectedJobName={clubAbout?.jobs?.[0]?.name ?? ''}
                selectedQuizzes={clubAbout?.clubQuizzes}
                selectedOption={clubAbout?.isRepresentativeQuizPublic.toString()}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default QuizDetailTemplate;
