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
import { useQuizRankDetail, useQuizRoungeDetail } from 'src/services/quiz/quiz.queries';
import { CommunityCard } from 'src/stories/components';

/** import icon */
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

const levelGroup = [
  {
    id: '0100',
    groupId: '0001',
    name: '0',
    description: '레벨 0',
  },
  {
    id: '0200',
    groupId: '0001',
    name: '1',
    description: '레벨 1',
  },
  {
    id: '0300',
    groupId: '0001',
    name: '2',
    description: '레벨 2',
  },
  {
    id: '0301',
    groupId: '0001',
    name: '3',
    description: '레벨 3',
  },
  {
    id: '0302',
    groupId: '0001',
    name: '4',
    description: '레벨 4',
  },
  ,
  {
    id: '0303',
    groupId: '0001',
    name: '5',
    description: '레벨 5',
  },
];

const cx = classNames.bind(styles);

export function LoungeTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();
  const { logged } = useSessionStore.getState();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page });
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [keyWorld, setKeyWorld] = useState('');
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [rankContents, setRankContents] = useState<RecommendContent[]>([]);
  const [totalElements, setTotalElements] = useState(0);

  const { isFetched: isContentFetched } = useQuizRoungeDetail(params, data => {
    console.log(data?.contents);
    setContents(data?.contents);
    setTotalElements(data?.totalElements);
    setTotalPage(data?.totalPages);
  });

  const { isFetched: isQuizRankListFetched } = useQuizRankDetail(data => {
    setRankContents(data);
  });

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setContentTypes(data.data.contents || []);
    const contentsType = data.length >= 0 && data[0].id;
    setParams({
      ...params,
      // contentsType,
    });
  });

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

  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendLevels(newFormats);

    setParams({
      ...params,
      recommendJobGroups: contentType,
      recommendLevels: newFormats.join(','),
      page,
    });
  };

  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-[60px]">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black">
              라운지
            </Grid>
            <Grid item xs={8} className="max-lg:tw-p-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-sm">
              모든 퀴즈클럽과 답변을 한 곳에서 볼 수 있고, 한달동안 우수한 성장을 이룬 클럽/메이커/리더를 발표해요!
            </Grid>
            <Grid item xs={2} justifyContent="flex-end" className="tw-flex"></Grid>
          </Grid>
        </div>
        <Grid container direction="row" justifyContent="left" rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={8}>
            <Box sx={{ width: '100%', typography: 'body1', marginBottom: '20px' }}>
              <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
                <Grid item xs={9} className="tw-font-bold tw-text-3xl tw-text-black">
                  <div className={cx('filter-area')}>
                    <div className={cx('mentoring-button__group', 'gap-12', 'justify-content-center')}>
                      <Toggle
                        label="전체직군"
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
                        className="tw-w-10"
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
                                recommendJobGroups: item.id,
                                page,
                              });
                              setPage(1);
                            }}
                            className={cx('fixed-width', 'tw-ml-4', 'max-lg:!tw-hidden')}
                          />
                        ))}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={3} className="tw-font-semi tw-text-base tw-text-black">
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
            <div>
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
            <article>
              <div className={cx('content-area')}>
                {isContentFetched &&
                  (contents.length > 0 ? (
                    contents.map((item, index) => {
                      return (
                        <div key={index} className="tw-mb-10">
                          <div className="tw-flex tw-items-center tw-space-x-4 ">
                            <img className="tw-w-10 tw-h-10 tw-rounded-full" src={item?.profileImageUrl} alt="" />
                            <div className="tw-text-base tw-font-semibold tw-text-black">
                              <div>{item?.clubLeaderNickname}</div>
                            </div>
                          </div>

                          <div className="tw-px-0 tw-py-0  border tw-rounded-lg tw-my-4">
                            <div className="tw-text-black tw-px-5 tw-py-4">
                              <div className="tw-pb-4 tw-text-gray-500 tw-text-sm tw-font-bold">[퀴즈클럽]</div>
                              <hr className="tw-y-1 tw-mb-4 tw-h-[0px] tw-border-t tw-bg-gray-300 " />
                              <div className="tw-p-7 tw-bg-gray-50 tw-rounded-lg">
                                <span className="tw-font-bold tw-text-[16px] tw-text-black">{item?.content}</span>
                              </div>
                              <div className="tw-py-7 ">
                                {item?.hashTags?.map((name, i) => (
                                  <span key={i} className="tw-text-base tw-text-gray-400">
                                    #{name}
                                  </span>
                                ))}
                              </div>
                              <div className="tw-text-left tw-pt-3 tw-flex tw-items-center tw-gap-4">
                                <span>
                                  <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                                  {item?.activeCount}
                                </span>
                                <span>
                                  <FavoriteBorderIcon className="tw-mr-1  tw-w-5" />
                                  <span>{item?.likeCount}</span>
                                </span>
                                <span>
                                  <ContentCopyOutlinedIcon className="tw-mr-1  tw-w-5" />
                                  <span>{item?.answerCount}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={cx('content--empty')}>데이터가 없습니다.</div>
                  ))}
                <div className="tw-mt-10">
                  <Pagination page={page} setPage={setPage} total={totalPage} />
                </div>
              </div>
            </article>
          </Grid>
          <Grid item xs={4}>
            <div className="tw-bg-gray-50 tw-rounded-lg tw-h-[1260px] tw-p-5 tw-text-black ">
              <div>
                <div className="tw-font-bold tw-text-base tw-pb-5">이달의 메이커</div>
                <div className="tw-bg-white tw-p-5 tw-rounded-md">
                  {rankContents?.maker ? (
                    <div className="tw-grid tw-grid-cols-4 tw-gap-4 ">
                      <div className="tw-col-span-1  tw-flex tw-flex-col tw-items-center tw-justify-center">
                        <img
                          className="tw-w-12 tw-h-12 tw-ring-1 tw-rounded-full"
                          src={rankContents?.maker?.profileImageUrl}
                          alt=""
                        />
                        <div className="tw-py-3 tw-text-base tw-font-semibold tw-text-black">
                          <div>{rankContents?.maker?.nickname}</div>
                        </div>
                      </div>
                      <div className="tw-col-span-3 tw-font-bold tw-text-black tw-flex tw-flex-col tw-items-center tw-justify-center">
                        <div>
                          이번달 등록 질문 수 :{' '}
                          <span className="tw-text-blue-600">{rankContents?.maker?.madeQuizCount}개</span>
                        </div>
                        <div>
                          받은 총 좋아요 수 :{' '}
                          <span className="tw-text-blue-600">{rankContents?.maker?.receivedLikeCount}개</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>데이터가 없습니다.</div>
                  )}
                  <div>
                    {rankContents?.maker?.quizzes?.map((item, index) => {
                      return (
                        <div key={index} className="tw-py-3 tw-text-sm">
                          <div>
                            {index + 1}. {item?.content}
                          </div>
                          <div className="tw-flex tw-items-center tw-gap-4">
                            <span>
                              <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                              {item?.answerCount}
                            </span>
                            <span>
                              <StarBorderIcon className="tw-mr-1  tw-w-5" />
                              <span>{item?.likeCount}</span>
                            </span>
                            <span>
                              <FavoriteBorderIcon className="tw-mr-1  tw-w-5" />
                              <span>{item?.activeCount}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div>
                <div className="tw-font-bold tw-text-base tw-py-5">이달의 퀴즈</div>
                <div className="tw-bg-white tw-p-5 tw-py-2 tw-rounded-md">
                  {rankContents?.quizzes?.map((item, index) => {
                    return (
                      <div key={index} className="tw-py-3 tw-text-sm">
                        <div>
                          {index + 1}. {item?.content}
                        </div>
                        <div className="tw-flex tw-items-center tw-gap-4">
                          <span>
                            <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                            {item?.answerCount}
                          </span>
                          <span>
                            <StarBorderIcon className="tw-mr-1  tw-w-5" />
                            <span>{item?.likeCount}</span>
                          </span>
                          <span>
                            <FavoriteBorderIcon className="tw-mr-1  tw-w-5" />
                            <span>{item?.activeCount}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="tw-font-bold tw-text-base tw-py-5">이달의 클럽</div>
                <div className="tw-bg-white tw-p-5 tw-py-2 tw-rounded-md">
                  {rankContents?.clubs?.map((item, index) => {
                    return (
                      <div key={index} className="tw-py-3 tw-text-sm ">
                        <div className="tw-grid tw-grid-cols-4 tw-gap-4 tw-flex tw-items-center tw-justify-center">
                          <div className="tw-col-span-1  tw-flex tw-flex-col ">
                            <img className="tw-w-12 tw-h-12 tw-rounded-md" src={item?.clubImageUrl} alt="" />
                          </div>
                          <div className="tw-col-span-3  tw-text-black ">
                            <div>
                              <span className="tw-text-gray-400">{item?.recommendJobNames?.toString()}</span>
                            </div>
                            <div>
                              <span className="tw-font-bold">{item?.clubName}</span>
                            </div>
                            <div>
                              <span className=" tw-text-sm">
                                {item?.clubLeaderNickname} | 평균실행률 : {item?.averageProgressPercentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default LoungeTemplate;
