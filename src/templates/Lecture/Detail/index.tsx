import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useState } from 'react';
import { useStore } from 'src/store';
import { paramProps, useMyProgress, useLectureAboutDetailInfo } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { useSessionStore } from 'src/store/session';
import LectureDetaillSolution from 'src/stories/components/LectureDetaillSolution';

const cx = classNames.bind(styles);
export interface LectureDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function LectureDetailTemplate({ id }: LectureDetailTemplateProps) {
  const { user } = useStore();
  const [contents, setContents] = useState<any>({});
  const [clubAbout, setClubAbout] = useState<any>({});
  const [quizList, setQuizList] = useState<RecommendContent[]>([]);
  const [clubMemberStatus, setClubMemberStatus] = useState('0001');
  const [applicationButton, setApplicationButton] = useState<ReactNode>(null);
  const { memberId, logged } = useSessionStore.getState();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [params, setParams] = useState<paramProps>({ page });

  // 퀴즈 소개 정보 조회
  const { isFetched: isClubAboutFetched, refetch: refetchClubAbout } = useLectureAboutDetailInfo(id, data => {
    console.log('useLectureAboutDetail', data);
    setClubAbout(data);
    console.log('clubMemberStatus', data?.clubMemberStatus);
    console.log('clubStatus ', data?.clubStatus);
  });

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

  const isQuizScreen = clubAbout?.lectureClub?.clubAboutStatus === '0401';
  console.log('isQuizScreen', isQuizScreen, clubAbout?.clubAboutStatus);

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        {/* `퀴즈` 풀기 화면 */}
        {isParticipantListFetched && (
          <LectureDetaillSolution
            border={false}
            totalElements={totalElements}
            totalPage={totalPage}
            page={page}
            handlePageChange={handlePageChange}
            contents={clubAbout?.lectureClub || []}
            study={clubAbout?.clubStudies || []}
            quizList={quizList}
            refetchClubAbout={refetchClubAbout}
            selectedImageBanner="/assets/images/banner/Rectangle_200.png"
            selectedImage="/assets/images/banner/Rectangle_190.png"
          />
        )}
      </div>
    </div>
  );
}

export default LectureDetailTemplate;
