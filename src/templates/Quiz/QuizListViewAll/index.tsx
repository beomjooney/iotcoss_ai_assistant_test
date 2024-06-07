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

export function QuizListViewAllTemplate({ id }: QuizListViewAllTemplateProps) {
  const { user } = useStore();
  const [contentHtml, setContentHtml] = useState('');
  const [page, setPage] = useState(1);

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <QuizClubListView border={false} id={id} />
      </div>
    </div>
  );
}

export default QuizListViewAllTemplate;
