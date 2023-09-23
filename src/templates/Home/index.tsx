import styles from './index.module.scss';
import {
  Button,
  GrowthFieldCard,
  ArticleCard,
  Profile,
  Typography,
  MentorsModal,
  Toggle,
} from 'src/stories/components';
import classNames from 'classnames/bind';
import SectionHeader from 'src/stories/components/SectionHeader';
import { useContentTypes, useJobGroups, useJobGroupss } from 'src/services/code/code.queries';
import { useEffect, useState } from 'react';
import { ArticleEnum } from 'src/config/types';
import { useRecommendContents } from 'src/services/contents/contents.queries';
import { useStore } from 'src/store';
import { useMentorList } from 'src/services/mentors/mentors.queries';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../store/session';
import Grid from '@mui/material/Grid';
import ProfileModal from 'src/stories/components/ProfileModal';
import { User } from 'src/models/user';
import { useMemberInfo } from 'src/services/account/account.queries';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import TextField from '@mui/material/TextField';

/** date picker */
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const cx = classNames.bind(styles);
const PAGE_NAME = 'main';

const levelGroup = [
  {
    id: '0100',
    groupId: '0001',
    name: '0',
    description: '레벨 0',
    order: 1,
  },
  {
    id: '0200',
    groupId: '0001',
    name: '1',
    description: '레벨 1',
    order: 2,
  },
  {
    id: '0300',
    groupId: '0001',
    name: '2',
    description: '레벨 2',
    order: 3,
  },
  {
    id: '0301',
    groupId: '0001',
    name: '3',
    description: '레벨 3',
    order: 3,
  },
  {
    id: '0302',
    groupId: '0001',
    name: '4',
    description: '레벨 4',
    order: 3,
  },
  {
    id: '0302',
    groupId: '0001',
    name: '5',
    description: '레벨 5',
    order: 4,
  },
];

export interface HomeProps {
  logged: boolean;
  hasUserResumeStory: boolean;
  userType: any; // 0001 멘티
}

export function HomeTemplate({ logged = false, hasUserResumeStory, userType }: HomeProps) {
  const router = useRouter();
  // const { jobGroups, setJobGroups } = useStore();
  const [vodList, setVodList] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const [mentorList, setMentorList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  /**work start end */
  const [workStartDate, setWorkStartDate] = React.useState<Dayjs | null>(null);
  const [workEndDate, setVsetWorkEndDatealue] = React.useState<Dayjs | null>(null);
  const [marketingAgree, setMarketingAgree] = useState<boolean>(false);

  /** job & level */
  const [jobGroup, setJobGroup] = useState([]);
  const [recommendJobGroups, setRecommendJobGroups] = useState([]);
  const [recommendLevels, setRecommendLevels] = useState([0]);
  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setJobGroup(data.data.contents || []);
  });

  /** get profile */
  const { user, setUser } = useStore();
  const [userInfo, setUserInfo] = useState<User>(user);
  const { memberId } = useSessionStore.getState();
  useMemberInfo(memberId, user => {
    setUserInfo(user);
  });

  // const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data));
  // const { isFetched: isVodFetched } = useRecommendContents(
  //   PAGE_NAME,
  //   { contentsType: ArticleEnum.VOD, size: 8 },
  //   data => setVodList(data.data),
  // );
  // const { isFetched: isTopicFetched } = useRecommendContents(
  //   PAGE_NAME,
  //   { contentsType: ArticleEnum.ARTICLE, size: 8 },
  //   data => setTopicList(data.data),
  // );
  // const { isFetched: isMentorFetched } = useMentorList(data => setMentorList(data));
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

  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendLevels(newFormats);
  };

  const handleJobGroups = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendJobGroups(newFormats);
  };

  const workList = [
    { title: '경력 1', no: 1 },
    { title: '경력 2', no: 2 },
    { title: '경력 3', no: 3 },
    { title: '경력 4', no: 4 },
    { title: '경력 5', no: 5 },
    { title: '경력 6', no: 6 },
    { title: '경력 7', no: 7 },
    { title: '경력 8', no: 8 },
    { title: '경력 9', no: 9 },
    { title: '경력 10', no: 10 },
  ];

  const [formFields, setFormFields] = useState([{ name: '', value: '', workStartDate: '', workEndDate: '' }]);

  const handleAddFields = () => {
    const values = [...formFields, { name: '', value: '', workStartDate: '', workEndDate: '' }];
    setFormFields(values);
  };

  const handleRemoveFields = (index: number) => {
    if (formFields.length === 1) {
      alert('At least one form must remain');
      return;
    }
    const values = [...formFields].splice(index, 1);
    setFormFields(values);
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>, key) => {
    const values = [...formFields];
    if (key === 'text') {
      if (e.target.name === 'name') {
        values[index].name = e.target.value;
      } else {
        values[index].value = e.target.value;
      }
    } else {
      const datetime = e.format('YYYY-MM-DD');
      values[index][key] = datetime;
    }
    setFormFields(values);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formFields);
  };

  useEffect(() => {
    console.log('formFields changed:', formFields);
  }, [formFields]);

  return (
    <div className={cx('career-main')}>
      <div>
        <img
          src="/assets/images/banner/banner_bg.png"
          alt="main_background"
          className={cx('top-banner__image', 'max-md:!tw-right-0')}
        />
        <div className="container text-white">
          <div className="row align-items-center   max-md:tw-pt-72  lg:tw-pt-20  lg:tw-pl-24">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="hero-content section-title text-center text-lg-left my-5 tw-mt-14">
                {/*<Typography type="B1" tag="div" weight="bold" extendClass={cx('mb-5')}>*/}
                {/*  WELCOME TO CAREERMENTORS!*/}
                {/*</Typography>*/}
                <div className={cx('tw-text-black', 'tw-font-semibold', 'tw-text-xl')}>
                  매일 새로운 기술과 쏟아져 나오는데
                  <br />
                  상위 10%의 개발자들은 어떻게 학습하고
                  <br />
                  어떻게 트렌드를 따라가는 거죠?
                </div>
                <div className="tw-font-bold tw-text-3xl tw-text-black tw-tracking-tight tw-mt-14 max-md:tw-mb-5">
                  성장 가속 서비스 데브어스
                </div>
                <div className={cx('fit-content', 'action-btn')}>
                  <Button size="main" onClick={handleUserResumeButton} className="tw-w-72 tw-h-12">
                    <Typography type="B1" tag="div" weight="bold">
                      지금 시작하기!
                    </Typography>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cx('main-container', 'container')}>
        <section className={cx('job-group-area')}>
          <div className={cx('justify-content-center', 'pt-300', 'max-md:!tw-pt-12', 'job-group__wrap')}>
            <SectionHeader title="크루님! 데브어스만 믿고 따라오세요!" subTitle="개발자 상위 10%의 습관과 학습비법" />
            <div className={cx('growth-area', 'pt-60', 'flex-wrap-container')}>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={2} sm={4} md={4}>
                  <div
                    className="w-1/2 bg-white  tw-rounded-xl overflow-hidden tw-h-[450px] max-md:tw-h-[500px]"
                    style={{ boxShadow: '-12px 13px 40px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="max-lg:tw-h-40 max-lg:tw-w-40 tw-h-64 tw-w-64 object-cover"
                        src="/assets/images/icons/3.png"
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
                <Grid item xs={2} sm={4} md={4}>
                  <div
                    className="w-1/2 bg-white  tw-rounded-xl overflow-hidden tw-h-[450px]  max-md:tw-h-[500px]"
                    style={{ boxShadow: '-12px 13px 40px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="max-lg:tw-h-40 max-lg:tw-w-40  tw-h-64 tw-w-64 tw-object-cover"
                        src="/assets/images/icons/1.png"
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
                <Grid item xs={2} sm={4} md={4}>
                  <div
                    className="w-1/2 bg-white  tw-rounded-xl overflow-hidden  tw-h-[450px] max-md:tw-h-[500px]"
                    style={{ boxShadow: '-12px 13px 40px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="max-lg:tw-h-40 max-lg:tw-w-40 tw-h-64 tw-w-64 tw-object-cover"
                        src="/assets/images/icons/2.png"
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
                <Grid item xs={6} sm={4} md={6}>
                  <div
                    className="w-1/2 bg-white tw-rounded-xl overflow-hidden tw-h-[450px] max-md:tw-h-[500px]"
                    style={{ boxShadow: '-12px 13px 40px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="max-lg:tw-h-40 max-lg:tw-w-40 tw-h-64 tw-object-cover"
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
                <Grid item xs={6} sm={4} md={6}>
                  <div
                    className="w-1/2 bg-white tw-rounded-xl overflow-hidden tw-h-[450px] max-md:tw-h-[500px]"
                    style={{ boxShadow: '-12px 13px 40px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="max-lg:tw-h-40 max-lg:tw-w-40 tw-h-64 tw-w-64 object-cover"
                        src="/assets/images/icons/7911246 1.png"
                        alt="Card"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-black tw-text-xl tw-font-bold mb-4">평판과 리더십을 올려드릴게요!</div>
                      <p className="text-black tw-text-base">
                        리더님의 지식과 선한 영향력은 명성을 높이기에 충분합니다. 데브어스가 리더님의 명성과 커리어를
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
                <Grid item xs={2} sm={4} md={4}>
                  <div
                    className="w-1/2 bg-white  tw-rounded-xl overflow-hidden tw-h-[450px] max-md:tw-h-[500px]"
                    style={{ boxShadow: '-12px 13px 40px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="max-lg:tw-h-40 max-lg:tw-w-40 tw-h-64 tw-w-64 tw-object-cover"
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
                <Grid item xs={2} sm={4} md={4}>
                  <div
                    className="w-1/2 bg-white  tw-rounded-xl overflow-hidden tw-h-[450px] max-md:tw-h-[500px]"
                    style={{ boxShadow: '-12px 13px 40px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="max-lg:tw-h-40 max-lg:tw-w-40 tw-h-64 tw-w-64 tw-object-cover"
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
                <Grid item xs={2} sm={4} md={4}>
                  <div
                    className="w-1/2 bg-white  tw-rounded-xl overflow-hidden tw-h-[450px] max-md:tw-h-[500px]"
                    style={{ boxShadow: '-12px 13px 40px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <img
                        className="max-lg:tw-h-40 max-lg:tw-w-40 tw-h-64 tw-w-64 tw-object-cover"
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
                  데브어스는 크루, 리더, 메이커가 함께 성장하는 플랫폼입니다.
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
                mentorList.slice(0, 4)  ((mentor, i) => <Profile key={i} mentorInfo={mentor} showDesc />)}
            </div>
          </div>
          <Button size="footer" label="모든 멘토 보러 가기" onClick={() => router.push('/mentoring')} />
        </section> */}
      </div>

      <ProfileModal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
        <div className="tw-font-bold tw-text-xl tw-text-black tw-mt-0 tw-mb-5 tw-text-center">
          님 데브어스에 오신 것을 환영합니다!
        </div>
        <div className="tw-font-semibold tw-text-base tw-text-black tw-mt-0  tw-text-center">
          직군 및 레벨을 설정하시면 님께
        </div>
        <div className="tw-font-semibold tw-text-base  tw-text-black tw-mt-0 tw-mb-10 tw-text-center">
          꼭 맞는커멘 서비스를 추천받으실 수 있습니다!
        </div>

        <div className="border tw-p-7 tw-rounded-xl">
          <div className="tw-font-bold tw-text-base tw-text-black">개인정보</div>

          <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
            <img className="tw-w-32 tw-h-32 tw-ring-1 tw-rounded-full" src={userInfo?.profileImageUrl} alt="" />
          </div>
          <div className="tw-mt-2 tw-border-t tw-border-gray-100">
            <dl className="tw-divide-y tw-divide-gray-100">
              <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-3 tw-gap-4 tw-px-0">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">이메일</dt>
                <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-2 tw-mt-0">
                  {userInfo?.email}
                </dd>
              </div>
              <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-3 tw-gap-4 tw-px-0">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">이름</dt>
                <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-2 tw-mt-0">
                  {userInfo?.name}
                </dd>
              </div>
              <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-3 tw-gap-4 tw-px-0">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">닉네임</dt>
                <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-2 tw-mt-0">
                  {userInfo?.nickname}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="border tw-p-7 tw-rounded-xl tw-mt-5">
          <div className="tw-font-bold tw-text-base tw-text-black">필수 | 직군 및 레벨</div>

          <dl className="tw-divide-y tw-divide-gray-100 tw-py-5">
            <div className="tw-px-4 tw-pt-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
              <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">(*) 직군선택</dt>
              <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">
                <ToggleButtonGroup
                  value={recommendJobGroups}
                  exclusive
                  onChange={handleJobGroups}
                  aria-label="text alignment"
                >
                  {jobGroup?.map((item, index) => (
                    <ToggleButton
                      key={`job-${index}`}
                      value={item.id}
                      aria-label="fff"
                      className="tw-ring-1 tw-ring-slate-900/10"
                      style={{
                        borderRadius: '5px',
                        borderLeft: '0px',
                        margin: '5px',
                        height: '35px',
                        border: '0px',
                      }}
                    >
                      {item.name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </dd>
            </div>

            <div className="tw-px-4 tw-pt-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
              <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">(*) 레벨선택</dt>
              <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">
                <ToggleButtonGroup
                  value={recommendLevels}
                  exclusive
                  onChange={handleRecommendLevels}
                  aria-label="text alignment"
                >
                  {levelGroup?.map((item, index) => (
                    <ToggleButton
                      key={`job-${index}`}
                      value={item.name}
                      aria-label="fff"
                      className="tw-ring-1 tw-ring-slate-900/10"
                      style={{
                        borderRadius: '5px',
                        borderLeft: '0px',
                        margin: '5px',
                        height: '35px',
                        border: '0px',
                      }}
                    >
                      레벨 {item.name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </dd>
            </div>
            <div className="tw-px-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0">
              <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900"></dt>
              <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                {recommendLevels?.toString() === '0' && (
                  <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                    0레벨 : 직무스킬(개발언어/프레임워크 등) 학습 중. 상용서비스 개발 경험 없음.
                  </div>
                )}
                {recommendLevels?.toString() === '1' && (
                  <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                    1레벨 : 상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요.
                  </div>
                )}
                {recommendLevels?.toString() === '2' && (
                  <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                    2레벨 : 상용 서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능.
                  </div>
                )}
                {recommendLevels?.toString() === '3' && (
                  <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                    3레벨 : 상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능.
                  </div>
                )}
                {recommendLevels?.toString() === '4' && (
                  <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                    4레벨 : 다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더.
                  </div>
                )}
                {recommendLevels?.toString() === '5' && (
                  <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                    5레벨 : 본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩.
                  </div>
                )}
              </dd>
            </div>
          </dl>
        </div>
        <div className="border tw-p-7 tw-rounded-xl tw-mt-5 ">
          <div className="tw-font-bold tw-text-base tw-text-black">선택 | 경력사항</div>
          <div className="tw-mt-2 tw-border-t tw-border-gray-100">
            <form onSubmit={handleSubmit} style={{ padding: '2%' }}>
              {formFields.map((field, index) => (
                <div key={index} style={{ marginBottom: 5 }} className="">
                  <dl className="tw-divide-y tw-divide-gray-100">
                    <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                      <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">회사명</dt>
                      <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                        <TextField
                          size="small"
                          id="outlined-basic"
                          label=""
                          name="name"
                          variant="outlined"
                          value={field.name}
                          onChange={e => handleInputChange(index, e, 'text')}
                          style={{ marginRight: 10 }}
                        />
                      </dd>
                    </div>
                    <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                      <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">직무</dt>
                      <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                        <TextField
                          size="small"
                          id="outlined-basic"
                          label=""
                          variant="outlined"
                          name="value"
                          value={field.value}
                          onChange={e => handleInputChange(index, e, 'text')}
                          style={{ marginRight: 10 }}
                        />
                      </dd>
                    </div>

                    <div className="tw-px-4 tw-pt-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                      <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">근무기간</dt>
                      <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                        <div className="tw-flex tw-justify-center tw-items-center tw-gap-1">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="YYYY-MM-DD"
                              slotProps={{ textField: { size: 'small' } }}
                              value={workStartDate}
                              onChange={e => handleInputChange(index, e, 'workStartDate')}
                            />
                            <DatePicker
                              format="YYYY-MM-DD"
                              slotProps={{ textField: { size: 'small' } }}
                              value={workEndDate}
                              onChange={e => handleInputChange(index, e, 'workEndDate')}
                            />
                          </LocalizationProvider>
                        </div>
                      </dd>
                    </div>
                    <div className="tw-px-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                      <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900"></dt>
                      <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                        <div className="tw-flex tw-items-center tw-gap-1">
                          {/* <Toggle
                            label="재직중 경우 체크 해주세요."
                            type="checkBox"
                            variant="small"
                            value={marketingAgree}
                            onChange={() => setMarketingAgree(!marketingAgree)}
                          /> */}
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={marketingAgree}
                                onChange={() => setMarketingAgree(!marketingAgree)}
                                name="jason"
                              />
                            }
                            label="재직중 경우 체크 해주세요."
                          />
                        </div>
                      </dd>
                    </div>
                    <div className="tw-flex tw-justify-center tw-items-center">
                      <button
                        className="tw-text-sm tw-bg-black tw-text-white tw-py-2 tw-mb-5 tw-px-4 tw-rounded"
                        type="button"
                        onClick={() => handleRemoveFields(index)}
                      >
                        경력사항 제거
                      </button>
                    </div>
                  </dl>
                </div>
              ))}

              <div className="tw-text-center tw-flex tw-justify-end tw-items-center">
                <Button type="button" onClick={() => handleAddFields()} style={{ marginTop: 10, marginRight: 10 }}>
                  경력 추가하기
                </Button>
              </div>
              {/* <button type="submit">Submit</button> */}
            </form>
            {/* <dl className="tw-divide-y tw-divide-gray-100">
              <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-3 tw-gap-4 tw-px-0">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">이메일</dt>
                <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-2 tw-mt-0">
                  {userInfo?.email}
                </dd>
              </div>
              <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-3 tw-gap-4 tw-px-0">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">이름</dt>
                <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-2 tw-mt-0">
                  {userInfo?.name}
                </dd>
              </div>
              <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-3 tw-gap-4 tw-px-0">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">닉네임</dt>
                <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-2 tw-mt-0">
                  {userInfo?.nickname}
                </dd>
              </div>
            </dl> */}
          </div>
        </div>
      </ProfileModal>
    </div>
  );
}

export default HomeTemplate;
