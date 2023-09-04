import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Pagination, Typography, Chip, Toggle } from 'src/stories/components';
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

interface BoardListItemType {
  id: number;
  name: string;
  boardType?: string;
  status: 'ACTIVE' | 'DEACTIVATED';
  layoutType: 'LIST' | 'IMAGE_TEXT' | 'IMAGE';
  enableHashtag: boolean;
  enableReply: boolean;
  index: number;
  articleCnt?: number;
}

const testBoards: BoardListItemType[] = [
  {
    id: 1,
    name: '전체보기',
    boardType: 'techlog',
    status: 'ACTIVE',
    layoutType: 'LIST',
    enableHashtag: true,
    enableReply: true,
    index: 1,
  },
  {
    id: 2,
    name: '개발',
    boardType: 'techlog',
    status: 'ACTIVE',
    layoutType: 'LIST',
    enableHashtag: true,
    enableReply: true,
    index: 2,
  },
  {
    id: 3,
    name: '엔지니어링',
    boardType: 'techlog',
    status: 'ACTIVE',
    layoutType: 'LIST',
    enableHashtag: true,
    enableReply: true,
    index: 2,
  },
  {
    id: 4,
    name: '기획/PM/PO',
    boardType: 'techlog',
    status: 'ACTIVE',
    layoutType: 'LIST',
    enableHashtag: true,
    enableReply: true,
    index: 2,
  },
  {
    id: 5,
    name: '디자인',
    boardType: 'techlog',
    status: 'ACTIVE',
    layoutType: 'LIST',
    enableHashtag: true,
    enableReply: true,
    index: 2,
  },
];

const levelGroup = [
  {
    id: '0100',
    groupId: '0001',
    name: '0',
    description: '레벨 0',
    order: 1,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0200',
    groupId: '0001',
    name: '1',
    description: '레벨 1',
    order: 2,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0300',
    groupId: '0001',
    name: '2',
    description: '레벨 2',
    order: 3,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0301',
    groupId: '0001',
    name: '3',
    description: '레벨 3',
    order: 3,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0302',
    groupId: '0001',
    name: '4',
    description: '레벨 4',
    order: 3,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
];

export type ArticleLikeUser = {
  userId: string;
  name: string;
  profileImageUrl: string;
};

const boardTags: string[] = ['모든', '트렌드', '질문', '소프트웨어', '프로세스'];

const cx = classNames.bind(styles);

export function QuizTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();

  const router = useRouter();
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [skillIdsClk, setSkillIdsClk] = useState<any[]>([1, 2, 3, 4, 5]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);
  const [seminarFilter, setSeminarFilter] = useState(['0002']);
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

  const { isFetched: isContentFetched } = useSeminarList(params, data => {
    console.log('quiz club : ', data.data.data.contents);
    setContents(data.data.data.contents || []);
    setTotalPage(data.data.totalPage);
  });

  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setContentTypes(data.data.contents || []);
    const contentsType = data.length >= 0 && data[0].id;
    console.log(data.data.contents);
    setParams({
      ...params,
      contentsType,
    });
  });

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const handleJobs = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    console.log(event.currentTarget);
    setJobGroup(newFormats);
    console.log(newFormats);
  };

  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendLevels(newFormats);
  };

  useEffect(() => {
    console.log('active');
    setParams({
      // ...params,
      page,
      recommendJobGroup: contentType,
      recommendJobs: jobGroup.join(','),
      recommendLevels: recommendLevels.join(','),
    });
  }, [page, jobGroupsFilter, levelsFilter, seminarFilter, jobGroup, recommendLevels]);

  const setNewCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

  // const handleClick = (article: Article) => {
  //   if (window.innerWidth < 768) {
  //     const paramObj = {
  //       articleId: article.articleId.toString(),
  //       boardId: article.boardId.toString(),
  //     };
  //   } else {
  //   }
  // };

  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black">
              성장퀴즈
            </Grid>
            <Grid item xs={7} className="tw-font-semi tw-text-base tw-text-black">
              관심 주제별로 성장 퀴즈를 풀고 네트워킹 할 수 있는 클럽을 만나보세요!
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                type="button"
                onClick={() => (location.href = '/quiz/open')}
                className="tw-text-white tw-bg-blue-500 hover:tw-bg-blue-800 tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
              >
                성장퀴즈 클럽 개설하기 +
              </button>
            </Grid>
          </Grid>
        </div>
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
                        ...params,
                        page,
                        recommendJobGroup: '',
                      });
                      setPage(1);
                    }}
                    className={cx('fixed-width')}
                  />
                  {isContentTypeFetched &&
                    contentTypes.map((item, i) => (
                      <Toggle
                        key={item.id}
                        label={item.name}
                        name={item.name}
                        value={item.id}
                        variant="small"
                        checked={active === i + 1}
                        isActive
                        type="tabButton"
                        onChange={() => {
                          setActive(i + 1);
                          setContentType(item.id);
                          setParams({
                            ...params,
                            recommendJobGroup: item.id,
                            page,
                          });
                          setPage(1);
                        }}
                        className={cx('fixed-width', 'tw-ml-4')}
                      />
                    ))}
                </div>
              </div>
            </Grid>
            <Grid item xs={4} className="tw-font-semi tw-text-base tw-text-black">
              <TextField
                fullWidth
                id="outlined-basic"
                label=""
                variant="outlined"
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
                      // value={item.id}
                      // variant="small"
                      // checked={active === i + 1}
                      // isActive
                      // type="tabButton"
                      // onChange={() => {
                      //   setActive(i + 1);
                      //   setParams({
                      //     ...params,
                      //     recommendJobGroup: item.id,
                      //     page,
                      //   });
                      //   setPage(0);
                      // }}
                      // className={cx('fixed-width')}
                    >
                      {item.name}
                    </ToggleButton>
                  ))}
              </ToggleButtonGroup>
            </div>

            <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
              <span className="tw-font-bold tw-text-base tw-text-black tw-mr-4">레벨</span>
              <ToggleButtonGroup
                value={recommendLevels}
                onChange={handleRecommendLevels}
                aria-label="text alignment"
                size="small"
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
                      height: '30px',
                      border: '0px',
                    }}
                  >
                    레벨 {item.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
          </div>
        )}
        <article>
          <div className={cx('content-area')}>
            <section className={cx('content', 'flex-wrap-container')}>
              <Grid
                container
                direction="row"
                justifyContent="left"
                alignItems="center"
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {isContentFetched &&
                  (contents.length > 0 ? (
                    contents.map((item, index) => {
                      return (
                        <Grid key={index} item xs={6}>
                          <a
                            href={'/quiz/' + `${index}`}
                            className="tw-flex tw-flex-col tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow md:tw-flex-row md:tw-max-w-xl hover:tw-bg-gray-100 dark:tw-border-gray-700 dark:tw-bg-gray-800 dark:hover:tw-bg-gray-700"
                          >
                            <img
                              className="tw-object-cover tw-w-[220px] tw-rounded-t-lg tw-h-[245px] md:tw-h-[245px] md:tw-w-[220px] md:tw-rounded-none md:tw-rounded-l-lg"
                              src="/assets/images/banner/Rectangle1.png"
                              alt=""
                            />
                            <div className="tw-flex tw-flex-col tw-justify-between tw-p-4 tw-leading-normal">
                              <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                                {item?.recommendJobGroups.map((name, i) => (
                                  <Chip
                                    key={`job_${i}`}
                                    chipColor={jobColorKey(item?.recommendJobGroups[i])}
                                    radius={4}
                                    className="tw-mr-2"
                                    variant="outlined"
                                  >
                                    {name}
                                  </Chip>
                                ))}
                                {item?.relatedExperiences.map((name, i) => (
                                  <Chip
                                    key={`job_${i}`}
                                    chipColor={jobColorKey(item?.relatedExperiences[i])}
                                    radius={4}
                                    className="tw-mr-2"
                                    variant="outlined"
                                  >
                                    {name}
                                  </Chip>
                                ))}
                                <Chip chipColor="primary" radius={4} variant="filled">
                                  {item?.recommendLevels.sort().join(',')}레벨
                                </Chip>
                              </div>
                              <div className="tw-mb-3 tw-text-sm tw-font-semibold tw-text-gray-500 dark:tw-text-gray-400">
                                모집마감일 : {item.endAt}
                              </div>
                              <h6 className="tw-mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
                                {item.name}
                              </h6>
                              <p className="tw-line-clamp-2 tw-mb-3 tw-font-normal tw-text-gray-700 dark:tw-text-gray-400">
                                {item.description}
                              </p>

                              <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-400 dark:tw-text-gray-400">
                                {item.studyCycle.toString()} | {item.studyWeekCount} 주 | 학습 {item.recruitMemberCount}
                                회
                              </div>

                              <div className="tw-flex tw-items-center tw-space-x-4">
                                <img
                                  className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full"
                                  src={item?.author?.avatar}
                                  alt=""
                                />
                                <div className="tw-text-sm tw-font-semibold tw-text-black dark:tw-text-white">
                                  <div>{item?.author?.displayName}</div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Grid>
                        // <ArticleCard
                        //   uiType={ArticleEnum.MENTOR_SEMINAR}
                        //   content={item}
                        //   key={i}
                        //   className={cx('container__item')}
                        // />
                      );
                    })
                  ) : (
                    <div className={cx('content--empty')}>데이터가 없습니다.</div>
                  ))}
              </Grid>
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

export default QuizTemplate;
