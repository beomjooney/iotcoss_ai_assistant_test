import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { useSessionStore } from 'src/store/session';
import LectureListView from 'src/stories/components/LectureListView';

const cx = classNames.bind(styles);
export interface LectureListViewAllTemplateProps {
  /** 세미나 아이디 */
  id?: any;
  /** 강의 시퀀스 */
  clubStudySequence?: any;
}

export function LectureListViewAllTemplate({ id, clubStudySequence }: LectureListViewAllTemplateProps) {
  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <LectureListView border={false} id={id} clubStudySequence={clubStudySequence} />
      </div>
    </div>
  );
}

export default LectureListViewAllTemplate;
