import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { paramProps, useLectureAboutDetailInfo, useLectureEvaluation } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { useSessionStore } from 'src/store/session';
import LectureDetaillSolution from 'src/stories/components/LectureDetaillSolution';

const cx = classNames.bind(styles);
export interface LectureDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function LectureDetailTemplate({ id }: LectureDetailTemplateProps) {
  const [contents, setContents] = useState<any>({});
  const [clubAbout, setClubAbout] = useState<any>({});
  const [lectureEvaluation, setLectureEvaluation] = useState<any>({});
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
    setClubAbout(data);
  });

  // 강의클럽 총평 상태 조회
  const { isFetched: isLectureEvaluationStatusFetched, refetch: refetchLectureEvaluationStatus } = useLectureEvaluation(
    id,
    data => {
      setLectureEvaluation(data);
    },
  );

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

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        {isClubAboutFetched && (
          <LectureDetaillSolution
            border={false}
            totalElements={totalElements}
            totalPage={totalPage}
            lectureEvaluation={lectureEvaluation}
            page={page}
            handlePageChange={handlePageChange}
            contents={clubAbout?.lectureClub || []}
            study={clubAbout?.clubStudies || []}
            quizList={quizList}
            refetchClubAbout={refetchClubAbout}
            refetchLectureEvaluationStatus={refetchLectureEvaluationStatus}
            selectedImageBanner="/assets/images/banner/Rectangle_200.png"
            selectedImage="/assets/images/banner/Rectangle_190.png"
          />
        )}
      </div>
    </div>
  );
}

export default LectureDetailTemplate;
