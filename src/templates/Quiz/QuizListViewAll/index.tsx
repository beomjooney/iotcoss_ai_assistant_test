import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React from 'react';
import QuizClubListView from 'src/stories/components/QuizClubListView';

const cx = classNames.bind(styles);
export interface QuizListViewAllTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizListViewAllTemplate({ id }: QuizListViewAllTemplateProps) {
  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <QuizClubListView border={false} id={id} />
      </div>
    </div>
  );
}

export default QuizListViewAllTemplate;
