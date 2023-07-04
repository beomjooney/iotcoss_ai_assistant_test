import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Button from 'src/stories/components/Button';
import Profile from 'src/stories/components/Profile';
import { User } from 'src/models/user';
import Link from 'next/link';
import React from 'react';

export interface MentorPickProps {
  // TODO 컴포넌트 props으로 item 전체를 받는게 맞는 구조인지 고민 중
  /** 멘토 정보 */
  mentorInfo?: User;
  /** bootstrap medium device size */
  mdSize?: string;
}

const cx = classNames.bind(styles);

const MentorPick = ({ mentorInfo, mdSize = 'col-md-10' }: MentorPickProps) => {
  return (
    <div className={cx('mento-pick', mdSize)}>
      <Profile mentorInfo={mentorInfo} className={cx('mento-pick__profile')} colorMode="primary" />
      <div className={cx('content-area')}>
        <div className={cx('content-area__wrap')}>
          <h4 className={cx('content-area__title')}>{mentorInfo?.nickname} 멘토</h4>
          <p className={cx('content-area__desc')}>{mentorInfo?.introductionMessage}</p>
          {/* // TODO 직업 포함 여부 확인 중 <p className={cx('content-area__desc')}>{mentorInfo?.job}</p>*/}
          <div className={cx('content-area__buttons')}>
            {/*TODO 2차 개발 범위*/}
            {/*<Button color="primary" label="멘토 세미나 보러가기" size="medium" />*/}
            <Link href={`/mentoring/${mentorInfo?.memberId}`}>
              <Button type="button" color="secondary" size="medium">
                멘토 소개 페이지 방문 &gt;
              </Button>
            </Link>
          </div>
          <span className={cx('content-area__heart')}>&#x2665;</span>
        </div>
      </div>
    </div>
  );
};

export default MentorPick;
