import styles from './index.module.scss';
import { Button, GrowthFieldCard, ArticleCard, Profile, Typography } from 'src/stories/components';
import classNames from 'classnames/bind';
import SectionHeader from 'src/stories/components/SectionHeader';
import { useJobGroups } from 'src/services/code/code.queries';
import { useState } from 'react';
import { ArticleEnum } from 'src/config/types';
import { useRecommendContents } from 'src/services/contents/contents.queries';
import { useStore } from 'src/store';
import { useMentorList } from 'src/services/mentors/mentors.queries';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../store/session';
import Grid from '@mui/material/Grid';

const cx = classNames.bind(styles);
const PAGE_NAME = 'main';

export interface HomeProps {
  logged: boolean;
  hasUserResumeStory: boolean;
  userType: any; // 0001 멘티
}

export function HomeTemplate({ logged = false, hasUserResumeStory = false, userType }: HomeProps) {
  const router = useRouter();
  const { memberId } = useSessionStore.getState();
  const { jobGroups, setJobGroups } = useStore();
  const [vodList, setVodList] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const [mentorList, setMentorList] = useState([]);

  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data));
  const { isFetched: isVodFetched } = useRecommendContents(
    PAGE_NAME,
    { contentsType: ArticleEnum.VOD, size: 8 },
    data => setVodList(data.data),
  );
  const { isFetched: isTopicFetched } = useRecommendContents(
    PAGE_NAME,
    { contentsType: ArticleEnum.ARTICLE, size: 8 },
    data => setTopicList(data.data),
  );
  const { isFetched: isMentorFetched } = useMentorList(data => setMentorList(data));
  const handleUserResumeButton = async () => {
    if (!logged) {
      if (confirm('로그인이 필요한 페이지 입니다.\n로그인 페이지로 이동하시겠습니까?')) {
        await router.push('/account/login');
        return;
      }
    } else {
      if (hasUserResumeStory) {
        // 정보가 있을 경우 멘티 멘토 구분하여 파라미터 세팅
        await router.push(
          {
            pathname: `/growth-story/${memberId}`,
            query: { prevPath: '/', type: userType === '0001' ? 'MENTEE' : 'MENTOR' },
          },
          `/growth-story/${memberId}`,
        );
      } else {
        // 메인에서 신청할 경우는 무조건 멘토
        await router.push({ pathname: '/growth-story', query: { type: 'MENTEE' } }, '/growth-story');
      }
    }
  };

  return (
    <div className={cx('career-main', 'tw-px-[396px]')}>
      <div className="tw-w-full tw-bg-white tw-border-solid tw-border  tw-rounded-2xl overflow-hidden">
        <div className="flex justify-center">
          <img
            className={cx('top-banner__image')}
            // className="h-40 w-full object-cover"
            src="/assets/images/banner/top_banner_main.png"
            alt="Card"
          />
        </div>
        <div className="py-4 px-6">
          <div className="row align-items-center">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="hero-content section-title text-center text-lg-left tw-p-10 mt-lg-0">
                {/*<Typography type="B1" tag="div" weight="bold" extendClass={cx('mb-5')}>*/}
                {/*  WELCOME TO CAREERMENTORS!*/}
                {/*</Typography>*/}
                <Typography type="A1" extendClass={cx('title')}>
                  함께 성장하는 공간,
                </Typography>
                <Typography type="A2" weight="bold" extendClass={cx('title--highlight')}>
                  커리어멘토스
                </Typography>
                <Typography type="H3" tag="div" extendClass={cx('mt-5', 'title__desc')}>
                  세상은 넓고, 할일은 많습니다. 그리고 사람은 다양합니다.
                  <br />
                  커리어멘토스는 단순한 멘토-멘티 매칭 서비스가 아닙니다.
                  <br />
                  성향과 역량에 맞는 목표 모델과 최적의 루트를 찾아드립니다.
                  <br />
                  지금 성장 스토리를 입력하시고 새롭게 시작해보세요!
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <section className={cx('top-banner', 'hero-section')}>
        <div className="tw-p-0">
          <img
            src="/assets/images/banner/top_banner_main.png"
            alt="main_background"
            className={cx('top-banner__image')}
          />
          <div className="container text-white">
            <div className="row align-items-center">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div className="hero-content section-title text-center text-lg-left my-5 mt-lg-0">
                  <Typography type="A1" extendClass={cx('title')}>
                    함께 성장하는 공간,
                  </Typography>
                  <Typography type="A2" weight="bold" extendClass={cx('title--highlight')}>
                    커리어멘토스
                  </Typography>
                  <Typography type="H3" tag="div" extendClass={cx('mt-5', 'title__desc')}>
                    세상은 넓고, 할일은 많습니다. 그리고 사람은 다양합니다.
                    <br />
                    커리어멘토스는 단순한 멘토-멘티 매칭 서비스가 아닙니다.
                    <br />
                    성향과 역량에 맞는 목표 모델과 최적의 루트를 찾아드립니다.
                    <br />
                    지금 성장 스토리를 입력하시고 새롭게 시작해보세요!
                  </Typography>
                </div>
              </div>
            </div>
            <div className={cx('fit-content', 'action-btn')}>
              <Button size="main" onClick={handleUserResumeButton}>
                <Typography type="B1" tag="div" weight="bold">
                  성장 스토리 {hasUserResumeStory ? '수정' : '입력'}하러 가기
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      </section> */}
      <div className={cx('main-container', 'container')}>
        <section className={cx('job-group-area', 'border-bottom')}>
          <div className={cx('justify-content-center', 'ptb-100', 'job-group__wrap')}>
            <SectionHeader title="커리어멘토스 성장 분야" subTitle="WHAT WE OFFER" />
            <div className={cx('growth-area', 'pt-60', 'flex-wrap-container')}>
              {isJobGroupFetched &&
                jobGroups &&
                jobGroups.map((item, i) => (
                  <GrowthFieldCard
                    key={i}
                    description={item.description}
                    title={item.name}
                    type={item.id}
                    lgSize="col-lg-6"
                    link={item.id}
                  />
                ))}
            </div>
          </div>
        </section>
        <section className={cx('justify-content-center', 'ptb-100', 'col-md-12')}>
          <div className="section-heading text-center mb-5">
            <SectionHeader title="추천 성장 강의" subTitle="VOD" />
            <div className={cx('flex-wrap-container', 'pt-60')}>
              <Grid container spacing={{ xs: 1.5, md: 1.5, sm: 1.5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                {isVodFetched &&
                  vodList.map((item, i) => (
                    <Grid item xs={6} sm={6} md={3} key={i}>
                      <ArticleCard key={item.contentsId} uiType={item.contentsType} content={item} />
                    </Grid>
                  ))}
              </Grid>
            </div>
          </div>
          <Button size="footer" label="모든 강의 보러 가기" onClick={() => router.push('/seminar')} />
        </section>
        <section className={cx('justify-content-center', 'ptb-100', 'col-md-12')}>
          <div className="section-heading text-center mb-5">
            <SectionHeader title="추천 성장 토픽" subTitle="TOPICS" />
            <div className={cx('flex-wrap-container', 'pt-60')}>
              <Grid container spacing={{ xs: 1.5, md: 1.5, sm: 1.5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                {isTopicFetched &&
                  topicList.map((item, i) => (
                    <Grid item xs={6} sm={6} md={3} key={i}>
                      <ArticleCard key={item.contentsId} uiType={item.contentsType} content={item} />
                    </Grid>
                  ))}
              </Grid>
            </div>
          </div>
          <Button size="footer" label="모든 토픽 보러 가기" onClick={() => router.push('/contents')} />
        </section>
        <section className={cx('justify-content-center', 'ptb-100', 'col-md-12')}>
          <div className="section-heading text-center mb-5">
            <SectionHeader title="커리어멘토스 추천 멘토" subTitle="SKILLED MENTOR" />
            <div className={cx('flex-wrap-container', 'pt-60')}>
              {isMentorFetched &&
                mentorList.length > 0 &&
                mentorList.slice(0, 4).map((mentor, i) => <Profile key={i} mentorInfo={mentor} showDesc />)}
            </div>
          </div>
          <Button size="footer" label="모든 멘토 보러 가기" onClick={() => router.push('/mentoring')} />
        </section>
      </div>
    </div>
  );
}

export default HomeTemplate;
