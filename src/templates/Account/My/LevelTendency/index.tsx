import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Chip from 'src/stories/components/Chip';
import Button from 'src/stories/components/Button';
import Profile from 'src/stories/components/Profile';
import { useState } from 'react';
import { useMySkills } from 'src/services/skill/skill.queries';
import { useMyExperiences } from 'src/services/experiences/experiences.queries';
import { useSessionStore } from 'src/store/session';
import { useMemberInfo } from 'src/services/account/account.queries';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';

const cx = classNames.bind(styles);

export function LevelTendencyTemplate() {
  const { memberId } = useSessionStore.getState();
  const { user, setUser } = useStore();

  const router = useRouter();
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);

  const { isFetched: isUserFetched } = useMemberInfo(memberId, data => setUser(data));
  useMyExperiences(memberId, data => setExperiences(data || []));
  useMySkills(memberId, data => setSkills(data || []));

  const needTest = !(user.level && user.jobGroup);

  return (
    <article className={cx('main-container')}>
      {needTest ? (
        <div className={cx('main-container--not')}>
          <section className={cx('content')}>
            등록된 테스트 내역이 없습니다. <br />
            MY 레벨&성향을 테스트해보세요!
          </section>
          <Button
            color="primary"
            label={`레벨 & 성향 테스트 하러가기 >`}
            size="small"
            onClick={() => router.push('/account/my')}
          />
        </div>
      ) : (
        <>
          <section className={cx('my-profile-area')}>
            {isUserFetched && <Profile mentorInfo={user} className={cx('my-profile-area__profile')} />}
            <p className={cx('my-profile-area__desc')}>
              Grursus mal suada faci lisis Lorem ipsum dolarorit more ametion consectetur elit. Vesti bulum a nec odio
              aea the dumm ipsumm ipsum that dolocons rsus suada and fadolorit consectetur elit. All the Lorem Ipsum
              generators on the Internet tend repeat predefined chunks dummt necessary, making this the first true dummy
              generator on the Internet.
            </p>
          </section>
          <section className={cx('my-skill-area')}>
            <h4>MY 보유 스킬</h4>
            <div className={cx('skills-area')}>
              {skills.map((item, i) => {
                return (
                  <Chip key={i} chipColor="black" radius={4} variant="outlined" className={cx('skills-area__item')}>
                    {item.skillName}
                  </Chip>
                );
              })}
            </div>
          </section>
          <section className={cx('my-experience-area')}>
            <h4>MY 보유 경험</h4>
            <div className={cx('skills-area')}>
              {experiences.map((item, i) => {
                return (
                  <Chip key={i} chipColor="black" radius={4} variant="outlined" className={cx('skills-area__item')}>
                    {item.experienceName}
                  </Chip>
                );
              })}
            </div>
          </section>
          <div className={cx('button-area')}>
            <Button color="secondary" label={`테스트 다시하기 >`} size="large" />
            <Button color="primary" label={`추천 학습 보러가기 >`} size="large" />
          </div>
        </>
      )}
    </article>
  );
}
