import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Typography, Chip, ClubCard } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useSeminarList, paramProps, useSeminarImageList } from 'src/services/seminars/seminars.queries';
import QuizArticleCard from 'src/stories/components/QuizArticleCard';
import Carousel from 'nuka-carousel';
import { ArticleEnum } from '../../config/types';
import { useContentJobTypes, useContentTypes, useJobGroups } from 'src/services/code/code.queries';
import Banner from '../../stories/components/Banner';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/system/Box';
import Image from 'next/image';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SecondTabs from 'src/stories/components/Tab/SecondTab';
import ListItemtag from 'src/stories/components/QuizItemCard/ListItemTag';
import SecondTechLogCard from 'src/stories/components/QuizItemCard/SecondTechLogCard';
import Card6 from 'src/stories/components/QuizItemCard/Card6';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { jobColorKey } from 'src/config/colors';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useSessionStore } from 'src/store/session';
import { useDeleteLike, useSaveLike } from 'src/services/community/community.mutations';
import { useMemberInfo } from 'src/services/account/account.queries';
import { User } from 'src/models/user';

const cx = classNames.bind(styles);

export function ProfileTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();
  const { logged } = useSessionStore.getState();
  const router = useRouter();
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [skillIdsClk, setSkillIdsClk] = useState<any[]>([1, 2, 3, 4, 5]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [images, setSeminarImages] = useState<any[]>([]);
  const [recommendJobGroup, setRecommendJobGroup] = useState<any[]>([]);
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [jobGroup, setJobGroup] = useState([]);
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));
  const [recommendLevels, setRecommendLevels] = useState([]);
  let [isLiked, setIsLiked] = useState(false);
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();
  const [keyWorld, setKeyWorld] = useState('');

  /** get profile */
  const { user, setUser } = useStore();
  const [userInfo, setUserInfo] = useState<User>(user);
  const { memberId } = useSessionStore.getState();
  console.log('memberId', memberId);
  const { isFetched: isUserInfo } = useMemberInfo(memberId, user => {
    setUserInfo(user);
    console.log(user);
  });

  // const { isFetched: isContentFetched, refetch } = useSeminarList(params, data => {
  //   setContents(data.data.contents || []);
  //   setTotalPage(data.data.totalPages);
  // });

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  // const { isFetched: isContentTypeFetched } = useContentTypes(data => {
  //   setContentTypes(data.data.contents || []);
  //   const contentsType = data.length >= 0 && data[0].id;
  //   setParams({
  //     ...params,
  //     // contentsType,
  //   });
  // });

  // const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
  //   setContentJobType(data.data.contents || []);
  // });

  useEffect(() => {
    setParams({
      // ...params,
      page,
      keyword: keyWorld,
    });
  }, [page, keyWorld]);

  const handleJobs = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    console.log('job', event.currentTarget, newFormats);
    setJobGroup(newFormats);

    setParams({
      ...params,
      recommendJobGroups: contentType,
      recommendJobs: newFormats.join(','),
      page,
    });
    setPage(1);
    console.log(newFormats);
  };

  return (
    <div className={cx('seminarseminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black max-lg:!tw-text-base">
              프로필
            </Grid>
            <Grid item xs={7} className="max-lg:tw-p-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-sm">
              나의 프로필을 완성하고 다양한 크루들과 교류해보세요.
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                onClick={() => (location.href = '/quiz/open')}
                type="button"
                className="tw-text-white tw-bg-blue-500 tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
              >
                나의 프로필을 완성하고 다양한 크루들과 교류해보세요.
              </button>
            </Grid>
          </Grid>
        </div>
      </div>
      {isUserInfo && (
        <div className={cx('content-wrap')}>
          <div className="tw-bg-gray-100">
            <div className={cx('container')}>
              <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-py-10 tw-font-bold tw-text-black">
                <div className="tw-col-span-2">
                  <img className="tw-w-32 tw-h-32 tw-ring-1 tw-rounded-full" src={userInfo?.profileImageUrl} alt="" />
                </div>
                <div className="tw-col-span-10 tw-text-left  tw-flex tw-flex-col  tw-justify-start">
                  <div className=" tw-text-black">
                    <div className="tw-font-bold tw-text-xl">
                      {userInfo?.nickname} 님
                      <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600">
                        {userInfo?.jobGroupName}
                      </span>
                      <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
                        {userInfo?.level} 레벨
                      </span>
                      <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-300 tw-text-sm tw-font-light tw-text-gray-600">
                        {userInfo?.jobName}
                      </span>
                    </div>
                  </div>
                  <div className="tw-font-bold tw-text-base tw-text-black tw-mt-5">
                    {userInfo?.careers?.[userInfo?.careers?.length - 1].companyName} |
                    {userInfo?.careers?.[userInfo?.careers?.length - 1].job}
                  </div>
                  <div className="tw-py-2">
                    {userInfo?.customSkills?.map((name, i) => (
                      <span
                        key={i}
                        className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-bg-black tw-text-white"
                      >
                        {name}
                      </span>
                    ))}
                    {/* {userInfo?.customExperiences?.map((name, i) => (
                      <span
                        key={i}
                        className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-gray-700"
                      >
                        {name}
                      </span>
                    ))} */}
                  </div>

                  <div className="tw-mt-3 tw-font-light tw-text-base tw-text-gray-500">
                    {userInfo?.introductionMessage}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={cx('container')}>
        <Box sx={{ width: '100%', typography: 'body1', marginTop: '20px', marginBottom: '20px' }}>
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={8} className="tw-font-bold tw-text-3xl tw-text-black">
              {/* <SecondTabs tabs={testBoards} /> */}

              <div className={cx('filter-area')}>
                <div className={cx('mentoring-button__group', 'gap-12', 'justify-content-center')}>
                  <Toggle
                    label="전체보기"
                    name="전체보기"
                    value=""
                    variant="small"
                    checked={active === 0}
                    isActive
                    type="tabButton"
                    onChange={() => {
                      setActive(0);
                      setParams({
                        page,
                      });
                      setPage(1);
                    }}
                    className={cx('fixed-width')}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={4} className="tw-font-semi tw-text-base tw-text-black">
              <TextField
                fullWidth
                id="outlined-basic"
                label=""
                variant="outlined"
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    searchKeyworld((e.target as HTMLInputElement).value);
                  }
                }}
                InputProps={{
                  style: { height: '43px' },
                  startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider className="tw-mb-6 tw-border tw-bg-['#efefef']" />
        {active != 0 && (
          <div>
            <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 직군</div>
              <ToggleButtonGroup
                style={{ display: 'inline' }}
                value={jobGroup}
                onChange={handleJobs}
                aria-label="text alignment"
                size="small"
              >
                {isContentTypeJobFetched &&
                  contentJobType.map((item, i) => (
                    <ToggleButton
                      key={item.id}
                      value={item.id}
                      className="tw-ring-1 tw-ring-slate-900/10"
                      style={{
                        borderRadius: '5px',
                        borderLeft: '0px',
                        margin: '5px',
                        height: '30px',
                        border: '0px',
                      }}
                    >
                      {item.name}
                    </ToggleButton>
                  ))}
              </ToggleButtonGroup>
            </div>
          </div>
        )}
        <article>
          {/* <div className={cx('filter-area', 'top-filter')}>
            <div className={cx('seminar-button__group')}></div>
          </div> */}

          <div className={cx('content-area')}>
            <section className={cx('content', 'flex-wrap-container')}>
              <Grid
                container
                direction="row"
                justifyContent="left"
                alignItems="center"
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              ></Grid>
              {/* {isContentFetched &&
                (contents.length > 0 ? (
                  contents.map((item, i) => {
                    return (
                      <ArticleCard
                        uiType={ArticleEnum.MENTOR_SEMINAR}
                        content={item}
                        key={i}
                        className={cx('container__item')}
                      />
                    );
                  })
                ) : (
                  <div className={cx('content--empty')}>데이터가 없습니다.</div>
                ))} */}
            </section>
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </article>
      </div>
    </div>
  );
}

export default ProfileTemplate;
