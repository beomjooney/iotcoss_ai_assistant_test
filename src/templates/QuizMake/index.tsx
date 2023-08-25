import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Typography, Chip } from 'src/stories/components';
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
import { UseQueryResult } from 'react-query';
import { useMyJobs } from 'src/services/jobs/jobs.queries';

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

export function QuizMakeTemplate() {
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

  const { data: myJobsData, refetch: refetchMyJob }: UseQueryResult<any> = useMyJobs();

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

  console.log(contentJobType);

  const handleJobs = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    console.log(event.currentTarget);
    setJobGroup(newFormats);
    console.log(newFormats);
  };

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.currentTarget;
    console.log(value, checked);
    if (checked) {
      setSkillIds([1, 2, 3, 4, 5]);
    } else {
      setSkillIds([]);
    }
    console.log(skillIds);
  };

  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendLevels(newFormats);
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const result = [...skillIds];

    if (result.indexOf(value) > -1) {
      result.splice(result.indexOf(value), 1);
    } else {
      result.push(value);
    }
    setSkillIds(result);
    console.log(skillIds);
    // setJobGroup(value);
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

  const toggleFilter = (id, type: 'jobGroup' | 'level' | 'status') => {
    if (type === 'jobGroup') {
      const index = jobGroupsFilter.indexOf(id);
      setJobGroupsFilter(prevState => setNewCheckItem(id, index, prevState));
    } else if (type === 'level') {
      const index = levelsFilter.indexOf(id);
      setLevelsFilter(prevState => setNewCheckItem(id, index, prevState));
    } else {
      const index = seminarFilter.indexOf(id);
      setSeminarFilter(prevState => setNewCheckItem(id, index, prevState));
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const boxWidth = 110;
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleClick = (article: Article) => {
    if (window.innerWidth < 768) {
      const paramObj = {
        articleId: article.articleId.toString(),
        boardId: article.boardId.toString(),
      };
    } else {
    }
  };

  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black">
              내가 만든 퀴즈
            </Grid>
            <Grid item xs={7} className="tw-font-semi tw-text-base tw-text-black">
              나와 크루들의 성장을 돕기위해 내가 만든 퀴즈 리스트예요!
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                type="button"
                className="tw-text-white tw-bg-blue-500 hover:tw-bg-blue-800 tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
              >
                <Link href="/quiz/open" className="nav-link">
                  퀴즈 직접 등록하기
                </Link>
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
                      setPage(0);
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
                          setPage(0);
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
        <article>
          <div className={cx('content-area')}>
            <section className={cx('content', 'flex-wrap-container')}>
              {myJobsData?.data.content.map((item, index) => (
                <div
                  key={index}
                  className="tw-flex tw-w-full tw-items-center tw-p-4 tw-border border mb-3 mt-3 rounded"
                >
                  <div className="tw-flex-auto">
                    <div className="tw-font-medium tw-text-black">{item.content}</div>
                  </div>
                  <div className="">김찬영</div>
                  <svg className="tw-ml-6 tw-h-6 tw-w-6 tw-flex-none" fill="none">
                    <path
                      d="M12 8v1a1 1 0 0 0 1-1h-1Zm0 0h-1a1 1 0 0 0 1 1V8Zm0 0V7a1 1 0 0 0-1 1h1Zm0 0h-1a1 1 0 0 0 1 1v-1Zm0 0v-1a1 1 0 0 0-1 1h1Zm0 0h1a1 1 0 0 0-1-1v1ZM12 12v1a1 1 0 0 0 1-1h-1Zm0 0h-1a1 1 0 0 0 1 1v-1Zm0 0v-1a1 1 0 0 0-1 1h1Zm0 0h-1a1 1 0 0 0 1 1v-1ZM12 16v1a1 1 0 0 0 1-1h-1Zm0 0h-1a1 1 0 0 0 1 1v-1Zm0 0v-1a1 1 0 0 0-1 1h1Zm0 0h1a1 1 0 0 0-1-1v1Z"
                      fill="#64748B"
                    ></path>
                  </svg>
                </div>
              ))}
            </section>
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </article>
      </div>
    </div>
  );
}

export default QuizMakeTemplate;
