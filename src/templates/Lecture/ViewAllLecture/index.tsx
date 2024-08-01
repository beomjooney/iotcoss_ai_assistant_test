import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import AllLectureView from 'src/stories/components/AllLectureView';

const cx = classNames.bind(styles);
export interface ViewAllLectureTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function ViewAllLectureTemplate({ id }: ViewAllLectureTemplateProps) {
  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <AllLectureView border={false} id={id} />
      </div>
    </div>
  );
}

export default ViewAllLectureTemplate;
