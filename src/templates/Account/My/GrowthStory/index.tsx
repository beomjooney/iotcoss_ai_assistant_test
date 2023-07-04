import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Button from 'src/stories/components/Button';
import React from 'react';
import { Typography } from 'src/stories/components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../../store/session';

const cx = classNames.bind(styles);

interface GrowthStoryTemplateProps {
  hasInfoData?: any;
  userType?: any;
}

export function GrowthStoryTemplate({ hasInfoData, userType }: GrowthStoryTemplateProps) {
  const { memberId } = useSessionStore.getState();
  const router = useRouter();

  const onGrowthStory = async () => {
    if (hasInfoData) {
      await router.push(
        { pathname: `/growth-story/${memberId}`, query: { type: userType === '0001' ? 'MENTEE' : 'MENTOR' } },
        `/growth-story/${memberId}`,
      );
    } else {
      // 여기서 신청은 무조건 멘티
      await router.push({ pathname: '/growth-story', query: { type: 'MENTEE' } }, '/growth-story');
    }
  };

  return (
    <div className={cx('growth-story-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          {!hasInfoData && (
            <>
              <Image src={`/assets/images/icons/emoticon-cry-outline.svg`} alt="sorry" width="52" height="52" />
              <Typography type="B1" tag="p" extendClass="pl-3">
                등록된 성장 스토리가 없습니다.
              </Typography>
            </>
          )}
          {!!hasInfoData && (
            <Button color="primary" label={'성장 스토리 수정하기 >'} size="small" onClick={onGrowthStory} />
          )}
          {!hasInfoData && (
            <Button color="primary" label={'성장 스토리 입력하기 >'} size="small" onClick={onGrowthStory} />
          )}
        </div>
      </section>
    </div>
  );
}
