import classNames from 'classnames/bind';
import styles from './index.module.scss';
import MentorPick from 'src/stories/components/MentorPick';
import Button from 'src/stories/components/Button';
import { useMyMentorList } from 'src/services/mentors/mentors.queries';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import Link from 'next/link';

const cx = classNames.bind(styles);

export function MyMentorPickTemplate() {
  const { memberId } = useSessionStore.getState();

  const [mentors, setMentors] = useState([]);

  const { isFetched } = useMyMentorList(memberId, data => data && setMentors(data.mentors || []));

  return (
    <article className={cx('main-container')}>
      <section className={cx('mentor-area')}>
        {isFetched &&
          (mentors.length === 0
            ? '데이터가 없습니다.'
            : mentors.map((mentor, i) => <MentorPick key={i} mentorInfo={mentor} />))}
      </section>
      <div className={cx('button-area')}>
        <Link href={`/mentoring`}>
          <Button type="button" color="primary" size="my-page">
            추천멘토 보러가기 &gt;
          </Button>
        </Link>
      </div>
    </article>
  );
}
