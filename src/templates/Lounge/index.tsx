import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Typography, Chip, ClubCard } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useSeminarList, paramProps, useSeminarImageList } from 'src/services/seminars/seminars.queries';
import QuizArticleCard from 'src/stories/components/QuizArticleCard';
import Carousel from 'nuka-carousel';
import { useContentTypes, useJobGroups } from 'src/services/code/code.queries';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useSessionStore } from 'src/store/session';
import { useQuizRankDetail, useQuizRoungeDetail } from 'src/services/quiz/quiz.queries';
import MuiToggleButton from '@mui/material/ToggleButton';
import { styled } from '@mui/material/styles';

/** import icon */
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import useDidMountEffect from 'src/hooks/useDidMountEffect';

const levelGroup = [
  {
    name: '0',
  },
  {
    name: '1',
  },
  {
    name: '2',
  },
  {
    name: '3',
  },
  {
    name: '4',
  },
  {
    name: '5',
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
  const [jobGroup, setJobGroup] = useState([]);
  const [view, setView] = React.useState('list');
  const [viewLevel, setViewLevel] = React.useState('list');

  const { isFetched: isContentFetched } = useQuizRoungeDetail(params, data => {
    setContents(data?.contents);
    setTotalElements(data?.totalElements);
    setTotalPage(data?.totalPages);
  });

  const { isFetched: isQuizRankListFetched } = useQuizRankDetail(data => {
    setRankContents(data);
  });

  console.log(rankContents);

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
    setPage(1);
  }

  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setContentTypes(data.data.contents || []);
    const contentsType = data.length >= 0 && data[0].id;
    setParams({
      ...params,
      // contentsType,
    });
  });

  useDidMountEffect(() => {
    setParams({
      // ...params,
      page,
      keyword: keyWorld,
    });
  }, [page, keyWorld]);

  const handleJobs = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setJobGroup(newFormats);
    setParams({
      recommendJobGroups: newFormats.join(','),
      recommendLevels: recommendLevels.join(','),
      page,
    });
    setPage(1);
    setView(null);
  };

  const handleAllJobs = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    setView(newFormats);

    if (newFormats !== null) {
      const idList = contentTypes.map(item => item.id);
      setJobGroup(idList);

      setParams({
        recommendJobGroups: idList.join(','),
        recommendLevels: recommendLevels.join(','),
        page,
      });
    } else {
      setParams({
        recommendJobGroups: '',
        recommendLevels: recommendLevels.join(','),
        page,
      });
      setJobGroup([]);
    }

    setPage(1);
  };

  const handleAllLevel = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    setViewLevel(newFormats);
    if (newFormats !== null) {
      const idList = levelGroup.map(item => item.name);
      setRecommendLevels(idList);

      setParams({
        recommendJobGroups: jobGroup.join(','),
        recommendLevels: idList.join(','),
        page,
      });
    } else {
      setParams({
        recommendJobGroups: jobGroup.join(','),
        recommendLevels: '',
        page,
      });
      setRecommendLevels([]);
    }

    setPage(1);
  };

  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendLevels(newFormats);
    setParams({
      recommendJobGroups: jobGroup.join(','),
      recommendLevels: newFormats.join(','),
      page,
    });
    setPage(1);
    setViewLevel(null);
  };

  // 아래 함수는 clubQuizStatusType에 따라 이미지 URL을 반환합니다.
  function getImage(clubQuizStatusType) {
    let imageUrl = '';

    switch (clubQuizStatusType) {
      case '0002':
        imageUrl = '/assets/images/icons/new.png'; // NEW 이미지 URL
        break;
      case '0003':
        imageUrl = '/assets/images/icons/hot.png'; // HOT 이미지 URL
        break;
      default:
        imageUrl = ''; // 상태 없음이나 다른 경우 이미지 없음
    }

    return imageUrl ? <img src={imageUrl} className="tw-w-[30px]" alt={clubQuizStatusType} /> : null;
  }

  const ToggleButton = styled(MuiToggleButton)({
    '&.Mui-selected, &.Mui-selected:hover': {
      color: 'black',
      fontWeight: 'bold',
      fontSize: '16px',
      backgroundColor: 'white',
    },
  });

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
                <Grid item xs={12} className="tw-font-bold tw-text-3xl tw-text-black">
                  <div className={cx('filter-area')}>
                    <div className="tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                      <ToggleButtonGroup
                        style={{ display: 'inline' }}
                        value={view}
                        onChange={handleAllJobs}
                        aria-label="text alignment"
                        size="small"
                        exclusive
                      >
                        <ToggleButton
                          value="list"
                          aria-label="fff"
                          style={{
                            fontSize: '16px',
                            margin: '5px',
                            height: '30px',
                            border: '0px',
                          }}
                        >
                          전체직군
                        </ToggleButton>
                      </ToggleButtonGroup>
                      <ToggleButtonGroup
                        style={{ display: 'inline' }}
                        value={jobGroup}
                        onChange={handleJobs}
                        aria-label="text alignment"
                        size="small"
                      >
                        {isContentTypeFetched &&
                          contentTypes?.map((item, index) => (
                            <ToggleButton
                              key={`job-${index}`}
                              value={item.id}
                              aria-label="fff"
                              className="tw-px-4"
                              style={{
                                fontSize: '16px',
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
                    <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                      <ToggleButtonGroup
                        style={{ display: 'inline' }}
                        value={viewLevel}
                        onChange={handleAllLevel}
                        aria-label="text alignment"
                        size="small"
                        exclusive
                      >
                        <ToggleButton
                          value="list"
                          aria-label="fff"
                          style={{
                            fontSize: '16px',
                            margin: '5px',
                            height: '30px',
                            border: '0px',
                          }}
                        >
                          전체레벨
                        </ToggleButton>
                      </ToggleButtonGroup>

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
                            className="tw-px-4"
                            aria-label="fff"
                            style={{
                              fontSize: '16px',
                              margin: '5px',
                              height: '30px',
                              border: '0px',
                            }}
                          >
                            레벨{item.name}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Box>
            <article>
              <div className={cx('content-area')}>
                {isContentFetched &&
                  (contents.length > 0 ? (
                    contents.map((item, index) => {
                      return (
                        <div key={index} className="tw-mb-10">
                          <div className="tw-flex tw-items-center tw-space-x-4 ">
                            <img
                              className="tw-w-10 tw-h-10 tw-rounded-full tw-ring-1"
                              src={item?.profileImageUrl}
                              alt=""
                            />
                            <div className="tw-text-base tw-font-semibold tw-text-black">
                              <div>{item?.clubLeaderNickname}</div>
                            </div>
                          </div>

                          <div className="tw-px-0 tw-py-0  border tw-rounded-lg tw-my-4">
                            <div className="tw-text-black tw-px-5 tw-py-4">
                              <div className="tw-flex tw-items-center tw-justify-between">
                                <div className="tw-pb-4 tw-text-gray-500 tw-text-sm tw-font-bold tw-flex tw-items-center">
                                  <div>[퀴즈클럽]</div>
                                  <div className="tw-pl-2">
                                    {item?.clubQuizStatusType && <div>{getImage(item.clubQuizStatusType)}</div>}
                                  </div>
                                </div>
                                <div className="tw-pb-4 tw-text-gray-500 tw-text-sm tw-font-medium">
                                  {item?.publishDate}
                                </div>
                              </div>
                              <hr className="tw-y-1 tw-mb-4 tw-h-[0px] tw-border-t tw-bg-gray-300 " />
                              <div className="tw-py-7 tw-px-5 tw-bg-gray-50 tw-rounded-lg">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                                  <div className="tw-col-span-1 tw-flex tw-flex-col tw-items-center tw-justify-center tw-pr-2">
                                    <img src="/assets/images/icons/quiz.png" className="tw-w-5 tw-h-5" alt="메이커" />
                                  </div>
                                  <div className="tw-col-span-11">{item?.content} </div>
                                </div>
                              </div>
                              <div className="tw-py-7 ">
                                {item?.hashTags?.map((name, i) => (
                                  <span key={i} className="tw-text-base tw-text-gray-400">
                                    #{name}
                                  </span>
                                ))}
                              </div>
                              <div className="tw-text-left tw-pt-3 tw-flex tw-items-center tw-gap-5 tw-flex tw-items-center tw-justify-between">
                                <div>
                                  <span className="tw-pr-3">
                                    <AssignmentOutlinedIcon className="tw-mr-2 tw-w-5" />
                                    {item?.activeCount}
                                  </span>
                                  <span className="tw-pr-3">
                                    <FavoriteBorderIcon className="tw-mr-2  tw-w-5" />
                                    <span>{item?.likeCount}</span>
                                  </span>
                                  <span className="tw-pr-3">
                                    <ContentCopyOutlinedIcon className="tw-mr-2  tw-w-5" />
                                    <span>{item?.answerCount}</span>
                                  </span>
                                </div>
                                <div className="tw-text-sm">
                                  {item?.isClubMember ? (
                                    item?.isAnswered ? (
                                      <button
                                        className="tw-font-bold"
                                        onClick={() =>
                                          router.push('/quiz/round-answers/' + `${item?.clubQuizSequence}`)
                                        }
                                      >
                                        답변완료
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => router.push('/quiz/solution/' + `${item?.clubQuizSequence}`)}
                                        className="tw-text-blue-500 tw-font-bold"
                                      >
                                        퀴즈풀러가기
                                      </button>
                                    )
                                  ) : (
                                    <button
                                      onClick={() => router.push('/quiz/round-answers/' + `${item?.clubQuizSequence}`)}
                                      className="tw-font-bold"
                                    >
                                      답변 보러가기
                                    </button>
                                  )}
                                </div>
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
            <div className="tw-bg-gray-50 tw-rounded-lg tw-mt-10 tw-p-5 tw-text-black ">
              <div>
                <div className="tw-flex tw-items-center tw-pb-5 tw-gap-2">
                  <div>
                    <img src="/assets/images/icons/maker.png" className="tw-w-4" alt="메이커" />
                  </div>
                  <div className="tw-font-bold tw-text-[16px]">이달의 메이커</div>
                </div>
                <div className="tw-bg-white tw-p-5 tw-rounded-md">
                  {rankContents?.maker ? (
                    <div className="tw-grid tw-grid-cols-7 tw-gap-2  ">
                      <div className="tw-col-span-2  tw-flex tw-flex-col tw-items-center tw-justify-center">
                        <img
                          className="tw-w-12 tw-h-12 tw-ring-1 tw-rounded-full"
                          src={rankContents?.maker?.profileImageUrl}
                          alt=""
                        />
                        <div className="tw-py-3 tw-text-base tw-font-semibold tw-text-black">
                          <div>{rankContents?.maker?.nickname}</div>
                        </div>
                      </div>

                      <div className="tw-col-span-5 tw-px-5 tw-font-bold tw-text-[12px] tw-text-black tw-flex tw-flex-col tw-justify-center">
                        <div className="tw-flex tw-justify-between">
                          <div> 이번달 등록 질문 수 </div>
                          <div className="tw-text-blue-600">
                            {rankContents?.maker?.madeQuizCount.toLocaleString()}개
                          </div>
                        </div>
                        <div className="tw-flex tw-justify-between">
                          <div> 받은 총 좋아요 수 </div>
                          <div className="tw-text-blue-600">
                            {rankContents?.maker?.receivedLikeCount.toLocaleString()}개
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={cx('content--empty')}>데이터가 없습니다.</div>
                  )}
                  <div>
                    {rankContents?.maker?.quizzes?.map((item, index) => {
                      return (
                        <div key={index} className="tw-py-1 tw-text-sm">
                          <div className="tw-flex tw-items-center tw-gap-2 tw-py-2">
                            <div className="tw-rounded-full tw-bg-gray-400 tw-text-white tw-w-[19px] tw-text-center">
                              {index + 1}
                            </div>
                            <div className="tw-line-clamp-2 tw-text-sm tw-font-medium">{item?.content}</div>
                          </div>
                          <div className="tw-flex tw-items-center tw-gap-4 tw-pl-7">
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
                <div className="tw-flex tw-items-center tw-py-5 tw-gap-2">
                  <div>
                    <img src="/assets/images/icons/quiz.png" className="tw-w-4" alt="메이커" />
                  </div>
                  <div className="tw-font-bold tw-text-[16px]">이달의 퀴즈</div>
                </div>
                <div className="tw-bg-white tw-p-5 tw-py-2 tw-rounded-md">
                  {rankContents?.quizzes?.length === 0 ? (
                    <div className={cx('content--empty', 'tw-py-3')}>데이터가 없습니다.</div>
                  ) : (
                    rankContents?.quizzes?.map((item, index) => {
                      return (
                        <div key={index} className="tw-py-1 tw-text-sm">
                          <div className="tw-flex tw-items-center tw-gap-2 tw-py-2">
                            <div className="tw-rounded-full tw-bg-gray-400 tw-text-white tw-w-[19px] tw-text-center">
                              {index + 1}
                            </div>
                            <div className="tw-line-clamp-2 tw-text-sm tw-font-medium">{item?.content}</div>
                          </div>
                          <div className="tw-flex tw-items-center tw-gap-4 tw-pl-7">
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
                    })
                  )}
                </div>
              </div>
              <div>
                <div className="tw-flex tw-items-center tw-py-5 tw-gap-2">
                  <div>
                    <img src="/assets/images/icons/club.png" className="tw-w-4" alt="메이커" />
                  </div>
                  <div className="tw-font-bold tw-text-[16px]">이달의 클럽</div>
                </div>
                <div className="tw-bg-white tw-p-5 tw-py-2 tw-rounded-md">
                  {rankContents?.clubs?.length === 0 ? (
                    <div className={cx('content--empty', 'tw-py-3')}>데이터가 없습니다.</div>
                  ) : (
                    rankContents?.clubs?.map((item, index) => {
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
                    })
                  )}
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
