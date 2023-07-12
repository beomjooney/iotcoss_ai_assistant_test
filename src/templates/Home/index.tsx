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
    // if (!logged) {
    //   if (confirm('로그인이 필요한 페이지 입니다.\n로그인 페이지로 이동하시겠습니까?')) {
    //     await router.push('/account/login');
    //     return;
    //   }
    // } else {
    //   if (hasUserResumeStory) {
    //     // 정보가 있을 경우 멘티 멘토 구분하여 파라미터 세팅
    //     await router.push(
    //       {
    //         pathname: `/growth-story/${memberId}`,
    //         query: { prevPath: '/', type: userType === '0001' ? 'MENTEE' : 'MENTOR' },
    //       },
    //       `/growth-story/${memberId}`,
    //     );
    //   } else {
    //     // 메인에서 신청할 경우는 무조건 멘토
    //     await router.push({ pathname: '/growth-story', query: { type: 'MENTEE' } }, '/growth-story');
    //   }
    // }
  };

  return (
    <div className={cx('career-main', 'tw-px-[450px]')}>
      <div className="tw-w-full tw-bg-white tw-border-solid tw-rounded-2xl overflow-hidden">
        <div className="flex justify-center">
          <img
            // className={cx('top-banner__image')}
            className="h-40 w-full object-cover"
            src="/assets/images/banner/banner_bg.png"
            alt="Card"
          />
        </div>
        <div className="row align-items-center">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div
              className={cx(
                'absolute-content',
                'tw-bottom-52',
                'tw-left-24',
                'hero-content',
                'section-title',
                'text-left',
              )}
            >
              <Typography type="H1" tag="div" extendClass={cx('title__desc')}>
                매일 새로운 기술과 쏱아져 나오는데
                <br />
                상위 10%의 개발자들은 어떻게 학습하고
                <br />
                어떻게 트렌드를 따라가는거죠?
              </Typography>
              <div className="tw-font-bold tw-text-3xl tw-text-black tw-tracking-tight tw-mt-8">
                성장 가속 서비스 인빈서블X
              </div>

              <div className={cx('fit-content', 'action-btn')}>
                <Button size="main" onClick={handleUserResumeButton} className="tw-w-72 tw-h-12">
                  <Typography type="B1" tag="div" weight="bold">
                    지금 시작하기!
                    {/* {hasUserResumeStory ? '수정' : '입력'}하러 가기 */}
                  </Typography>
                </Button>
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
        <section className={cx('job-group-area')}>
          <div className={cx('justify-content-center', 'ptb-100', 'job-group__wrap')}>
            <SectionHeader title="크루님! 인빈서블X만 믿고 따라오세요!" subTitle="개발자 상위 10%의 습관과 학습비법" />
            <div className={cx('growth-area', 'pt-60', 'flex-wrap-container')}>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={2} sm={4} md={4} key={1}>
                  <div className="w-1/2 bg-white shadow tw-rounded-xl overflow-hidden tw-h-[450px]">
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="tw-h-64 tw-w-64 object-cover"
                        src="/assets/images/icons/megaphone_icon_182174.png"
                        alt="Card"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-black tw-text-xl tw-font-bold mb-4">퀴즈로 뇌를 깨워요!</div>
                      <p className="text-black tw-text-base">
                        오늘 학습할 새로운 지식을 접하기 전에 핵심 주제에 대한 퀴즈를 제시하여, 생각할 기회를
                        제공합니다.
                      </p>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={2} sm={4} md={4} key={1}>
                  <div className="w-1/2 bg-white shadow tw-rounded-xl overflow-hidden tw-h-[450px]">
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="tw-h-64 tw-w-64 tw-object-cover"
                        src="/assets/images/icons/8202590 1.png"
                        alt="Card"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-black tw-text-xl tw-font-bold mb-4">나의 지식을 펼쳐봐요!</div>
                      <p className="text-black tw-text-base">
                        내가 아는 모든 지식을 동원하여, 퀴즈의 정답을 입력하면서, 나의 수준을 정확하게 알 수 있어요.
                      </p>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={2} sm={4} md={4} key={1}>
                  <div className="w-1/2 bg-white shadow tw-rounded-xl overflow-hidden  tw-h-[450px]">
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="tw-h-64 tw-w-64 tw-object-cover"
                        src="/assets/images/icons/bookmark-folder.png"
                        alt="Card"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-black tw-text-xl tw-font-bold mb-4">나새로운 지식을 흡수해요!</div>
                      <p className="text-black tw-text-base">
                        퀴즈의 정답이 녹아 있는 엄선된 아티클을 읽으면서, 지식을 흡수하고 나만의 노트를 만들어요.
                      </p>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="tw-w-full tw-my-10 tw-relative tw-mb-24">
              <img
                className="tw-w-full tw-h-[300px] tw-object-center"
                src="/assets/images/banner/Frame 2434.png"
                alt=""
              />
              <div className="tw-w-full tw-absolute tw-top-1/2 tw-left-1/2 tw--translate-x-1/2 tw--translate-y-1/2 tw-text-center tw-transform">
                <p className="tw-text-2xl tw-font-bold tw-text-black">
                  꾸준히 최신 트렌드를 보고 기억할 수 있도록 도와드릴게요!
                </p>
              </div>
            </div>
            <SectionHeader
              title="리더님! 크루와 함께 성장하세요!"
              subTitle="새로운 인적 네트워크를 형성하고 기회를 창출하는 지름길"
            />
            <div className={cx('growth-area', 'pt-60', 'flex-wrap-container')}>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 8, md: 12 }}>
                <Grid item xs={6} sm={4} md={6} key={1}>
                  <div className="w-1/2 bg-white shadow tw-rounded-xl overflow-hidden tw-h-[450px]">
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="tw-h-64 tw-object-cover"
                        src="/assets/images/icons/3d-render-hand-high-five-gesture-team-work-clap 1.png"
                        alt="Card"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-black tw-text-xl tw-font-bold mb-4">
                        새로운 인적 네트워크를 형성해보세요!
                      </div>
                      <p className="text-black tw-text-base">
                        다양한 분야의 리더님, 크루님이 이곳에 모여 있습니다. 함께 활동하면서 자연스럽게 친분을 쌓고
                        새로운 기회를 만드실 수 있습니다.
                      </p>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6} sm={4} md={6} key={1}>
                  <div className="w-1/2 bg-white shadow tw-rounded-xl overflow-hidden tw-h-[450px]">
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="tw-h-64 tw-w-64 object-cover"
                        src="/assets/images/icons/7911246 1.png"
                        alt="Card"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-black tw-text-xl tw-font-bold mb-4">평판과 리더십을 올려드릴게요!</div>
                      <p className="text-black tw-text-base">
                        리더님의 지식과 선한 영향력은 명성을 높이기에 충분합니다. 인빈서블X가 리더님의 명성과 커리어를
                        높여 드리기 위해 지원을 아끼지 않겠습니다.
                      </p>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>

            <SectionHeader
              title="메이커님! 지식을 선점하고 전수하세요.!"
              subTitle="새로운 지식을 가장 빠르게 내 것으로 만드는 방법"
            />

            <div className={cx('growth-area', 'pt-60', 'flex-wrap-container')}>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={2} sm={4} md={4} key={1}>
                  <div className="w-1/2 bg-white shadow tw-rounded-xl overflow-hidden tw-h-[450px]">
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="tw-h-64 tw-w-64 tw-object-cover"
                        src="/assets/images/icons/megaphone_icon_182174.png"
                        alt="Card"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-black tw-text-xl tw-font-bold mb-4">리더가 퀴즈를 선택해요!</div>
                      <p className="text-black tw-text-base">
                        리더가 클럽을 만들고, 학습 날짜 별 퀴즈를 선정해요. 메이커님의 퀴즈가 많이 배치될 수록 혜택이
                        커집니다.
                      </p>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={2} sm={4} md={4} key={1}>
                  <div className="w-1/2 bg-white shadow tw-rounded-xl overflow-hidden tw-h-[450px]">
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="tw-h-64 tw-w-64 tw-object-cover"
                        src="/assets/images/icons/8202590 1.png"
                        alt="Card"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-black tw-text-xl tw-font-bold mb-4">크루가 퀴즈를 풀어요!</div>
                      <p className="text-black tw-text-base">
                        메이커님이 만든 퀴즈를 크루가 풀어요. 크루가 열심히 풀수록 메이커님의 명성과 혜택이 올라갑니다.
                      </p>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={2} sm={4} md={4} key={1}>
                  <div className="w-1/2 bg-white shadow tw-rounded-xl overflow-hidden tw-h-[450px]">
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="tw-h-64 tw-w-64 tw-object-cover"
                        src="/assets/images/icons/bookmark-folder.png"
                        alt="Card"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-black tw-text-xl tw-font-bold mb-4">좋은 퀴즈는 영원해요!</div>
                      <p className="text-black tw-text-base">
                        좋은 퀴즈는 수학의 정석이랑 같은 위치로 성장할 수 있어요. 퀴즈와 아티클 조합만으로 원작자가
                        됩니다.
                      </p>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>

            <div className="tw-w-full tw-my-10 tw-relative">
              <img
                className="tw-w-full tw-h-[300px] tw-object-center"
                src="/assets/images/banner/Frame 2434.png"
                alt=""
              />
              <div className="tw-w-full tw-absolute tw-top-1/2 tw-left-1/2 tw--translate-x-1/2 tw--translate-y-1/2 tw-text-center tw-transform">
                <p className="tw-text-2xl tw-font-bold tw-text-black">
                  인빈서블X는 크루, 리더, 메이커가 함께 성장하는 플랫폼입니다.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* <section className={cx('justify-content-center', 'ptb-100', 'col-md-12')}>
          <div className="section-heading text-center mb-5">
            <SectionHeader title="커리어멘토스 추천 멘토" subTitle="SKILLED MENTOR" />
            <div className={cx('flex-wrap-container', 'pt-60')}>
              {isMentorFetched &&
                mentorList.length > 0 &&
                mentorList.slice(0, 4).map((mentor, i) => <Profile key={i} mentorInfo={mentor} showDesc />)}
            </div>
          </div>
          <Button size="footer" label="모든 멘토 보러 가기" onClick={() => router.push('/mentoring')} />
        </section> */}
      </div>
    </div>
  );
}

export default HomeTemplate;
