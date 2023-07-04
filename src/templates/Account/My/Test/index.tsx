import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Button from 'src/stories/components/Button';
import SectionHeader from 'src/stories/components/SectionHeader';
import Chip from 'src/stories/components/Chip';
import React from 'react';
import { useJobGroups } from 'src/services/code/code.queries';
import { useStore } from 'src/store';
import { useExperiences } from 'src/services/experiences/experiences.queries';
import { useSkills } from 'src/services/skill/skill.queries';
import { jobColorKey } from 'src/config/colors';

const cx = classNames.bind(styles);

export function LevelTendencyTestTemplate() {
  const { jobGroups, setJobGroups, experiences, setExperiences, skills, setSkills } = useStore();
  const levels = [
    { icon: 'ti-tag', level: 1 },
    { icon: 'ti-tag', level: 2 },
    { icon: 'ti-tag', level: 3 },
    { icon: 'ti-tag', level: 4 },
    { icon: 'ti-tag', level: 5 },
  ];

  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));
  const { isFetched: isExperienceFetched } = useExperiences(data => setExperiences(data || []));
  const { isFetched: isSkillFetched } = useSkills(data => setSkills(data || []));

  return (
    <article className={cx('main-container')}>
      <section className={cx('check1-area')}>
        <SectionHeader title="성장을 원하는 분야를 선택해주세요." subTitle="CHECK 01" size="small" />
        <div className={cx('growth-field-area')}>
          {isJobGroupFetched &&
            jobGroups.map((item, i) => {
              return (
                // TODO chip css id 변경 필요
                <Chip
                  key={i}
                  chipColor={jobColorKey(item.id)}
                  radius={4}
                  variant="outlined"
                  className={cx('growth-field-area__chip')}
                >
                  {item.name}
                </Chip>
              );
            })}
        </div>
      </section>
      <section className={cx('check2-area')}>
        <SectionHeader title="내가 생각하는 해당 분야의 레벨을 선택해주세요." subTitle="CHECK 02" size="small" />
        <div className={cx('level-area')}>
          {levels.map(item => {
            return (
              <div key={item.level}>
                <div className={cx('icon-area', 'pb-2')}>
                  <span className={cx('icon', item.icon, 'icon-md')} />
                </div>
                <Chip chipColor="black" radius={4} variant="outlined">
                  {item.level}레벨
                </Chip>
              </div>
            );
          })}
        </div>
      </section>
      <section className={cx('check3-area')}>
        <SectionHeader
          title="[선택한 레벨] 보유 경험을 선택해주세요. (다중선택 가능)"
          subTitle="CHECK 03"
          size="small"
        />
        <div className={cx('skills-area')}>
          {isExperienceFetched &&
            experiences.map((item, i) => {
              return (
                <Chip key={i} chipColor="black" radius={4} variant="outlined" className={cx('skills-area__item')}>
                  {item.experienceName}
                </Chip>
              );
            })}
        </div>
      </section>
      <section className={cx('check4-area')}>
        <SectionHeader
          title="[선택한 레벨] 보유 스킬을 선택해주세요. (다중선택 가능)"
          subTitle="CHECK 04"
          size="small"
        />
        <div className={cx('skills-area')}>
          {isSkillFetched &&
            skills.map((item, i) => {
              return (
                <Chip key={i} chipColor="black" radius={4} variant="outlined" className={cx('skills-area__item')}>
                  {item.skillName}
                </Chip>
              );
            })}
        </div>
      </section>
      <div className={cx('button-area')}>
        <img src="/assets/images/career/level-tendency.png" alt="coming-soon" />
        <Button color="primary" label="테스트 결과 확인하기 >" size="large" onClick={() => alert('준비중입니다.')} />
      </div>
    </article>
  );
}
