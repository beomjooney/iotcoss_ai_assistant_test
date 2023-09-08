import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Typography, Chip, MentorsModal, Textfield } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useSeminarList, paramProps, useSeminarImageList } from 'src/services/seminars/seminars.queries';
import QuizArticleCard from 'src/stories/components/QuizArticleCard';
import Carousel from 'nuka-carousel';
import { ArticleEnum } from '../../config/types';
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
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useQuizSave } from 'src/services/quiz/quiz.mutations';
import { useContentJobTypes, useContentTypes, useJobGroups, useJobGroupss } from 'src/services/code/code.queries';
import { useExperiences } from 'src/services/experiences/experiences.queries';
import { SkillResponse } from 'src/models/skills';
import { useSkills } from 'src/services/skill/skill.queries';
import { ExperiencesResponse } from 'src/models/experiences';
import { TagsInput } from 'react-tag-input-component';
import { useDeletePost } from 'src/services/community/community.mutations';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { makeStyles } from '@material-ui/core';

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
];

const options = ['삭제하기', '퀴즈 비공개'];

export type ArticleLikeUser = {
  userId: string;
  name: string;
  profileImageUrl: string;
};

const cx = classNames.bind(styles);

export function QuizMakeTemplate() {
  const { contentTypes, setContentTypes } = useStore();

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [skillIdsClk, setSkillIdsClk] = useState<any[]>([1, 2, 3, 4, 5]);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);
  const [seminarFilter, setSeminarFilter] = useState(['0002']);
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [images, setSeminarImages] = useState<any[]>([]);
  const [recommendJobGroup, setRecommendJobGroup] = useState<any[]>([]);
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [jobGroup, setJobGroup] = useState([]);
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  const [jobGroups, setJobGroups] = useState<any[]>([]);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page });
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [quizUrl, setQuizUrl] = React.useState('');
  const [quizName, setQuizName] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<any[]>([]);
  const [selected, setSelected] = useState([]);
  const open = Boolean(anchorEl);
  const [keyWorld, setKeyWorld] = useState('');
  const [removeIndex, setRemoveIndex] = React.useState('');

  //api call
  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { isFetched: isJobGroupFetched } = useJobGroupss(data => setJobGroups(data.data.contents || []));
  const { data: myQuizData, refetch: refetchMyJob }: UseQueryResult<any> = useMyJobs(params, data => {
    setTotalPage(data.totalPages);
  });
  //quiz delete
  const { mutate: onDeletePost, isSuccess: deletePostSucces } = useDeletePost();
  const { mutate: onQuizSave, isSuccess: postSucces } = useQuizSave();

  const handleDropMenuClick = (event: React.MouseEvent<HTMLElement>, removeIndex) => {
    setRemoveIndex(removeIndex);
    setAnchorEl(event.currentTarget);
  };
  const handleClickQuiz = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFormat = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setSkillIds(newFormats);
    console.log(newFormats);
  };
  const handleFormatEx = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setExperienceIds(newFormats);
    console.log(newFormats);
  };

  useDidMountEffect(() => {
    console.log('delete 1 !!!', params, page);
    refetchMyJob();
  }, [deletePostSucces, postSucces]);

  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setContentTypes(data.data.contents || []);
    const contentsType = data.length >= 0 && data[0].id;
    // setParams({
    //   ...params,
    //   contentsType,
    // });
  });

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const handleAddClick = () => {
    // onGetJobsData && onGetJobsData();
    // getJobsList();
    console.log('modal ');
    setQuizUrl('');
    setQuizName('');
    setJobGroup([]);
    setJobs([]);
    setRecommendLevels([]);
    setSkillIds([]);
    setExperienceIds([]);
    setSelected([]);

    setIsModalOpen(true);
    // setChapterNo(chapterNo);
  };

  const handleJobGroups = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    console.log(event.currentTarget);
    setJobGroup(newFormats);
    console.log(newFormats);
  };
  const handleJobs = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    console.log(event.currentTarget);
    setJobs(newFormats);
    console.log(newFormats);
  };

  const handleInputQuizChange = event => {
    setQuizName(event.target.value);
  };

  const handleInputQuizUrlChange = event => {
    setQuizUrl(event.target.value);
  };

  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendLevels(newFormats);
  };

  useEffect(() => {
    setParams({
      // ...params,
      page,
      keyword: keyWorld,
    });
  }, [page, keyWorld]);

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    console.log(index, removeIndex);
    if (index === 0) {
      if (window.confirm('정말로 삭제하시겠습니까?')) {
        onDeletePost({
          postNo: removeIndex,
        });
      }
    }

    setAnchorEl(null);
  };

  const handleQuizInsertClick = async () => {
    const params = {
      content: quizName,
      articleUrl: quizUrl,
      recommendJobGroups: [jobGroup],
      recommendJobs: jobs,
      recommendLevels: [recommendLevels],
      relatedSkills: skillIds,
      relatedExperiences: experienceIds,
      hashTags: selected,
    };

    setIsModalOpen(false);
    onQuizSave(params);
  };

  const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiPaper-root': {
        boxShadow: '0px 0px 0px 0px rgba(0,0,0,0.75);',
      },
    },
  }));
  const classes = useStyles();
  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={3} className="tw-font-bold tw-text-3xl tw-text-black">
              내가 만든 퀴즈
            </Grid>
            <Grid item xs={6} className="tw-font-semi tw-text-base tw-text-black">
              <div>나와 크루들의 성장을 돕기위해 내가 만든 퀴즈 리스트예요!</div>
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                type="button"
                onClick={() => handleAddClick()}
                className="tw-text-white tw-bg-blue-500 tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
              >
                퀴즈 직접 등록하기
              </button>
            </Grid>
          </Grid>
        </div>
        <Box sx={{ width: '100%', typography: 'body1', marginTop: '20px', marginBottom: '20px' }}>
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={8} className="tw-font-bold tw-text-3xl tw-text-black">
              <div className="tw-text-xl">퀴즈목록 ({myQuizData?.contents?.length})</div>
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
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    searchKeyworld((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider className="tw-mb-3 tw-border tw-bg-['#efefef']" />
        <article>
          <div className={cx('content-area')}>
            <section className={cx('content', 'flex-wrap-container')}>
              {myQuizData?.contents?.map((item, index) => (
                <div key={index} className="tw-p-4 tw-border border tw-w-full tw-rounded-xl">
                  <div className="tw-flex tw-w-full tw-items-center"></div>
                  <div className="tw-flex  tw-items-center">
                    <div className="tw-flex-auto">
                      <div className="tw-font-medium tw-text-black">
                        <div className="tw-p-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                          {item?.recommendJobGroupNames?.map((name, i) => (
                            <span
                              key={i}
                              className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600"
                            >
                              {name}
                            </span>
                          ))}
                          <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
                            {item?.recommendLevels?.sort().join(',')}레벨
                          </span>
                          {item?.recommendJobNames?.map((name, i) => (
                            <span
                              key={i}
                              className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-100 tw-text-sm tw-font-light tw-text-gray-600"
                            >
                              {name}
                            </span>
                          ))}
                          {item?.hashTags?.map((name, i) => (
                            <span
                              key={i}
                              className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-gray-700"
                            >
                              {name}
                            </span>
                          ))}
                          {/* {item?.relatedExperiences?.map((name, i) => (
                            <Chip
                              key={`job_${i}`}
                              chipColor={jobColorKey(item?.relatedExperiences[i])}
                              radius={4}
                              className="tw-mr-2"
                              variant="outlined"
                            >
                              {name}
                            </Chip>
                          ))} */}
                        </div>
                      </div>
                    </div>
                    <div className="tw-text-gray-400 tw-text-sm tw-mr-5">{item.createdAt}</div>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? 'long-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={event => handleDropMenuClick(event, item.sequence)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <div>
                      <Menu
                        id="lock-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        className={classes.root}
                        MenuListProps={{
                          'aria-labelledby': 'lock-button',
                          role: 'listbox',
                          style: {
                            border: '1px solid rgb(218, 226, 237)',
                            boxShadow: 'none !important',
                            borderRadius: '12px',
                          },
                        }}
                      >
                        {options.map((option, index) => (
                          <MenuItem key={index} onClick={event => handleMenuItemClick(event, index)}>
                            {option}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  </div>
                  <div className="tw-flex  tw-items-center tw-p-3">
                    <div className="tw-flex-auto">
                      <div className="tw-font-medium tw-text-black tw-text-base">{item.content}</div>
                    </div>
                    {/* <div className="">{item.memberName}</div> */}
                  </div>
                  <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-3 ">
                    <div className="tw-col-span-1 tw-text-sm tw-font-bold tw-text-black">아티클</div>
                    <div className="tw-col-span-9 tw-text-sm tw-text-gray-600">{item.articleUrl}</div>
                    <div className="tw-col-span-2 tw-text-sm tw-text-right">
                      댓글 : {item.activeCount} 답변 : {item.answerCount}
                    </div>
                  </div>
                </div>
              ))}
            </section>
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </article>
      </div>
      <MentorsModal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
        <div className="tw-font-bold tw-text-xl tw-text-black tw-my-5 tw-mb-2 tw-text-left tw-mt-0">
          퀴즈 직접 등록하기
        </div>
        <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-5 tw-text-left tw-mt-0">
          내가 공부하고 싶거나 크루들과 공유하고 싶은 주제 & 아티클로 퀴즈를 만들어요!
        </div>

        <div>
          <div className="tw-font-bold tw-text-sm tw-text-black tw-mt-10">필수 입력</div>
          <div className="tw-mt-5">
            <TextField
              size="small"
              fullWidth
              label={'질문을 입력하세요.'}
              onChange={handleInputQuizChange}
              id="margin-none"
              value={quizName}
              name="quizName"
            />
          </div>
          <div className="tw-mt-10">
            <TextField
              size="small"
              fullWidth
              label={'아티클(질문에 대한 답변에 참고가 될 아티클 링크를 입력해주세요.'}
              onChange={handleInputQuizUrlChange}
              id="margin-none"
              value={quizUrl}
              name="quizUrl"
            />
          </div>
          <div className="tw-font-bold tw-text-sm tw-text-black tw-mt-10 tw-mb-5">선택 입력</div>
          <div>
            <div className="tw-font-semibold tw-text-sm tw-text-black  tw-my-2">추천 직군</div>
            <ToggleButtonGroup value={jobGroup} exclusive onChange={handleJobGroups} aria-label="text alignment">
              {contentTypes?.map((item, index) => (
                <ToggleButton
                  key={`job-${index}`}
                  value={item.id}
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
            <div className="tw-font-semibold tw-text-sm tw-text-black  tw-my-2">추천 직무</div>
            <ToggleButtonGroup
              style={{ display: 'inline' }}
              value={jobs}
              onChange={handleJobs}
              aria-label="text alignment"
            >
              {jobGroups?.map((item, index) => (
                <ToggleButton
                  key={`job-${index}`}
                  value={item.id}
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

            <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 레벨</div>
            <ToggleButtonGroup
              exclusive
              value={recommendLevels}
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
            {recommendLevels.toString() === '0' && (
              <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                0레벨 : 직무스킬(개발언어/프레임워크 등) 학습 중. 상용서비스 개발 경험 없음.
              </div>
            )}
            {recommendLevels.toString() === '1' && (
              <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                1레벨 : 상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요.
              </div>
            )}
            {recommendLevels.toString() === '2' && (
              <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                2레벨 : 상용 서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능.
              </div>
            )}
            {recommendLevels.toString() === '3' && (
              <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                3레벨 : 상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능.
              </div>
            )}
            {recommendLevels.toString() === '4' && (
              <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                4레벨 : 다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더.
              </div>
            )}
            {recommendLevels.toString() === '5' && (
              <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                5레벨 : 본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩.
              </div>
            )}

            <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">관련스킬</div>

            <ToggleButtonGroup
              style={{ display: 'inline' }}
              value={skillIds}
              onChange={handleFormat}
              aria-label=""
              color="standard"
            >
              {skillData?.data?.contents?.map((item, index) => {
                return (
                  <ToggleButton
                    key={`skillIds-${index}`}
                    value={item.name}
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
                );
              })}
            </ToggleButtonGroup>

            <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">관련경험</div>
            <ToggleButtonGroup
              style={{ display: 'inline' }}
              value={experienceIds}
              onChange={handleFormatEx}
              aria-label=""
              color="standard"
            >
              {experienceData?.data?.contents?.map((item, index) => {
                return (
                  <ToggleButton
                    key={`skillIds-${index}`}
                    value={item.name}
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
                );
              })}
            </ToggleButtonGroup>
          </div>
          <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">해시태그</div>
          <TagsInput
            value={selected}
            onChange={setSelected}
            name="fruits"
            placeHolder="#해쉬태그 입력 후 엔터를 쳐주세요.
              "
          />
          <div className="tw-text-center">
            <button
              type="button"
              onClick={() => handleQuizInsertClick()}
              className="tw-mt-5 tw-text-white tw-bg-blue-500 hover:tw-bg-blue-800 tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
            >
              퀴즈 등록하기
            </button>
          </div>
        </div>
      </MentorsModal>
    </div>
  );
}

export default QuizMakeTemplate;
