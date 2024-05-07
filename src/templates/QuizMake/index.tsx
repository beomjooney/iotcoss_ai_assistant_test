import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Chip, MentorsModal, Textfield } from 'src/stories/components';
import React, { useEffect, useState, useRef } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import SearchIcon from '@mui/icons-material/Search';
import { UseQueryResult } from 'react-query';
import { useMyQuiz } from 'src/services/jobs/jobs.queries';
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
import { useDeletePost } from 'src/services/community/community.mutations';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { makeStyles } from '@material-ui/core';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Checkbox from '@mui/material/Checkbox';
import KnowledgeComponent from 'src/stories/components/KnowledgeComponent';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TagsInput } from 'react-tag-input-component';

import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';

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

const studyStatus = [
  {
    id: '0001',
    name: '학습예정',
  },
  {
    id: '0002',
    name: '학습 중',
  },
  {
    id: '0003',
    name: '학습완료',
  },
];

const gradeStatus = [
  {
    id: '0001',
    name: '1학년',
  },
  {
    id: '0002',
    name: '2학년',
  },
  {
    id: '0003',
    name: '3학년',
  },
  {
    id: '0004',
    name: '4학년',
  },
  {
    id: '0005',
    name: '취업준비생',
  },
  {
    id: '0006',
    name: '상관없음',
  },
];

const options = ['삭제하기'];
// const options = ['삭제하기', '퀴즈 비공개'];

export type ArticleLikeUser = {
  userId: string;
  name: string;
  profileImageUrl: string;
};

const cx = classNames.bind(styles);

export function QuizMakeTemplate() {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password must be at least 4 characters')
      .max(8, 'Password must not exceed 8 characters'),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

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

  const [expanded, setExpanded] = useState(0); // 현재 확장된 Accordion의 인덱스
  const [selectedButton, setSelectedButton] = React.useState(null);

  const [selected1, setSelected1] = useState([]);
  const [selected2, setSelected2] = useState([]);
  const [quizCount, setQuizCount] = useState('');
  const [aiQuiz, setAiQuiz] = useState(false);

  const [selectedOption, setSelectedOption] = useState('latest');

  const handleChangeQuiz = event => {
    setSelectedOption(event.target.value);
  };

  const handleQuizCountChange = e => {
    setQuizCount(e.target.value);
  };

  const handleAiQuizChange = e => {
    setAiQuiz(e.target.checked);
  };

  const handleSubmitQuiz = e => {
    e.preventDefault();
    // Your logic for quiz creation
    console.log(`Quiz count: ${quizCount}`);
    console.log(`AI Quiz: ${aiQuiz}`);
  };

  const handleClick = buttonValue => {
    setSelectedButton(buttonValue);
  };

  const handleChange = index => (event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  const handlePreviousAccordion = () => {
    setExpanded(prevExpanded => (prevExpanded === null || prevExpanded === 0 ? null : prevExpanded - 1));
  };

  const handleNextAccordion = () => {
    if (expanded !== 2) {
      setExpanded(prevExpanded => (prevExpanded === null ? 0 : prevExpanded + 1));
    }
  };

  const quizRef = useRef(null);
  const quizUrlRef = useRef(null);

  // 데이터 예시
  // 데이터 배열로 묶어주기
  const knowledgeData = [
    {
      title: 'ESB와 API Gateway 차이점에 대해서 설명하세요',
      date: '2024.06.30',
      content:
        'EAI는 엔터프라이즈 어플리케이션 인테그레이션의 약자입니다. 시스템이 서로 얽히고 복잡해지면서 통제가 잘 안되는 상황이 발생하여 이런 문제를 해결하기 위해 등장한 솔루션이 바로 EAI 입니다.',
      tags: ['소프트웨어융합대학', '컴퓨터공학과', '2학년'],
      likes: 32,
      comments: 27,
      hashtags: ['MVVM', '해시태그'],
    },
    {
      title: 'ESB와 API Gateway 차이점에 대해서 설명하세요',
      date: '2024.06.30',
      content:
        'EAI는 엔터프라이즈 어플리케이션 인테그레이션의 약자입니다. 시스템이 서로 얽히고 복잡해지면서 통제가 잘 안되는 상황이 발생하여 이런 문제를 해결하기 위해 등장한 솔루션이 바로 EAI 입니다.',
      tags: ['소프트웨어융합대학', '컴퓨터공학과', '2학년'],
      likes: 32,
      comments: 27,
      hashtags: ['MVVM', '해시태그'],
    },
    // 다른 데이터도 이어서 넣어주면 됩니다.
  ];

  //api call
  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { isFetched: isJobGroupFetched } = useJobGroupss(data => setJobGroups(data.data.contents || []));
  const { data: myQuizData, refetch: refetchMyJob }: UseQueryResult<any> = useMyQuiz(params, data => {
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
    //console.log(newFormats);
  };
  const handleFormatEx = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setExperienceIds(newFormats);
    //console.log(newFormats);
  };

  useDidMountEffect(() => {
    //console.log('delete 1 !!!', params, page);
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
    //console.log('modal ');
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
    //console.log(event.currentTarget);
    setJobGroup(newFormats);
    //console.log(newFormats);
  };
  const handleJobs = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    //console.log(event.currentTarget);
    setJobs(newFormats);
    //console.log(newFormats);
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
    //console.log(index, removeIndex);
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
    if (quizName === '') {
      alert('질문을 입력해주세요.');
      quizRef.current.focus();
      return;
    }

    if (quizUrl === '') {
      alert('아티클을 입력해주세요.');
      quizUrlRef.current.focus();
      return;
    }

    if (jobGroup?.length === 0 || jobGroup?.length === undefined) {
      alert('추천 직군을 선택해주세요.');
      return;
    }

    if (recommendLevels?.length === 0 || recommendLevels?.length === undefined) {
      alert('추천 레벨을 선택해주세요.');
      return;
    }

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

  const [activeTab, setActiveTab] = useState('퀴즈목록');
  const handleTabClick = tabName => {
    setActiveTab(tabName);
  };

  return (
    <>
      <div className={cx('seminar-container')}>
        <div className={cx('container')}>
          <div className="xl:tw-py-[60px] tw-pt-[50px]">
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={12} sm={2} className="tw-font-bold sm:tw-text-3xl tw-text-2xl tw-text-black">
                나의 퀴즈
              </Grid>
              <Grid item xs={12} sm={6} className="tw-font-semi tw-text-base tw-text-black">
                <div>나와 학습자들의 성장을 돕기위해 내가 만든 퀴즈 리스트예요!</div>
              </Grid>
              <Grid item xs={12} sm={4} justifyContent="flex-end" className="tw-flex">
                <button
                  type="button"
                  onClick={() => handleAddClick()}
                  className=" tw-text-[#e11837] tw-mr-3 tw-font-bold tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                  style={{ border: '1px solid', color: '#e11837', width: '150px' }}
                >
                  + 퀴즈 만들기
                </button>
                <button
                  type="button"
                  onClick={() => handleAddClick()}
                  style={{ border: '1px solid', color: 'black', width: '150px' }}
                  className="tw-text-black tw-bg-white tw-font-bold tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                >
                  + 지식컨텐츠 등록
                </button>
              </Grid>
            </Grid>
          </div>
          <Box sx={{ width: '100%', typography: 'body1', marginTop: '0px', marginBottom: '40px' }}>
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={6} sm={9} className="tw-font-bold tw-text-3xl tw-text-black">
                <div className="tw-flex tw-justify-start tw-items-start tw-gap-10">
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-h-11 tw-relative tw-gap-2.5">
                    <p
                      className={`tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-text-left tw-cursor-pointer ${
                        activeTab === '퀴즈목록' ? 'tw-font-bold tw-text-black' : 'tw-text-[#6a7380]'
                      } tw-hover:tw-font-bold tw-hover:tw-text-black`}
                      onClick={() => handleTabClick('퀴즈목록')}
                    >
                      퀴즈목록
                    </p>
                  </div>
                  <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-h-11 tw-relative tw-gap-2.5">
                    <p
                      className={`tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-text-left tw-cursor-pointer ${
                        activeTab === '지식컨텐츠' ? 'tw-font-bold tw-text-black' : 'tw-text-[#6a7380]'
                      } tw-hover:tw-font-bold tw-hover:tw-text-black`}
                      onClick={() => handleTabClick('지식컨텐츠')}
                    >
                      지식컨텐츠
                    </p>
                  </div>
                  <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-h-11 tw-relative tw-gap-2.5">
                    <p
                      className={`tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-text-left tw-cursor-pointer ${
                        activeTab === '휴지통' ? 'tw-font-bold tw-text-black' : 'tw-text-[#6a7380]'
                      } tw-hover:tw-font-bold tw-hover:tw-text-black`}
                      onClick={() => handleTabClick('휴지통')}
                    >
                      휴지통
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} sm={3} className="tw-font-semi tw-text-base tw-text-black">
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

          <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6 tw-mb-8">
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                정렬 :
              </p>

              <RadioGroup value={selectedOption} onChange={handleChangeQuiz} row>
                <FormControlLabel
                  value="latest"
                  control={
                    <Radio
                      sx={{
                        color: '#ced4de',
                        '&.Mui-checked': { color: '#e11837' },
                      }}
                      icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                      checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                    />
                  }
                  label={
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                      최신순
                    </p>
                  }
                />
                <FormControlLabel
                  value="oldest"
                  control={
                    <Radio
                      sx={{
                        color: '#ced4de',
                        '&.Mui-checked': { color: '#e11837' },
                      }}
                      icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                      checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                    />
                  }
                  label={
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                      오래된순
                    </p>
                  }
                />
                <FormControlLabel
                  value="oldest1"
                  control={
                    <Radio
                      sx={{
                        color: '#ced4de',
                        '&.Mui-checked': { color: '#e11837' },
                      }}
                      icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                      checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                    />
                  }
                  label={
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                      학년순
                    </p>
                  }
                />
                <FormControlLabel
                  value="oldest2"
                  control={
                    <Radio
                      sx={{
                        color: '#ced4de',
                        '&.Mui-checked': { color: '#e11837' },
                      }}
                      icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                      checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                    />
                  }
                  label={
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                      많이 복사된 순
                    </p>
                  }
                />
                <FormControlLabel
                  value="oldest3"
                  control={
                    <Radio
                      sx={{
                        color: '#ced4de',
                        '&.Mui-checked': { color: '#e11837' },
                      }}
                      icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                      checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                    />
                  }
                  label={
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                      답변순
                    </p>
                  }
                />
              </RadioGroup>
            </div>
          </div>

          {/* 퀴즈목록에 해당하는 div */}
          {activeTab === '퀴즈목록' && (
            <div>
              <KnowledgeComponent knowledgeData={knowledgeData} />
            </div>
          )}

          {/* 퀴즈목록에 해당하는 div */}
          {activeTab === '휴지통' && (
            <div>
              <KnowledgeComponent knowledgeData={knowledgeData} />
            </div>
          )}

          {/* 휴지통에 해당하는 div */}
          {activeTab === '지식컨텐츠' && (
            <div>
              <article>
                <div className={cx('content-area')}>
                  <section className={cx('content', 'flex-wrap-container')}>
                    {myQuizData?.contents?.map((item, index) => (
                      <div key={index} className="tw-w-full">
                        <Desktop>
                          <div className="tw-p-4 tw-border border tw-w-full tw-rounded-xl">
                            <div className="tw-flex tw-w-full tw-items-center"></div>
                            <div className="tw-flex  tw-items-center">
                              <div className="tw-flex-auto ">
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
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-3">
                              <div className="tw-col-span-1 tw-text-sm tw-font-bold tw-text-black ">아티클</div>
                              <div className="tw-col-span-9 tw-text-sm tw-text-gray-600">{item.articleUrl}</div>
                              <div className="tw-col-span-2 tw-text-sm tw-text-right">
                                댓글 : {item.activeCount} 답변 : {item.answerCount}
                              </div>
                            </div>
                          </div>
                        </Desktop>
                        <Mobile>
                          <div className="tw-p-5 tw-border border tw-w-full tw-rounded-xl">
                            {/* 첫 번째 컬럼 */}
                            <div className="md:tw-w-full">
                              <div className="tw-font-medium tw-text-black">
                                <div className="tw-text-sm tw-font-normal tw-text-gray-500">
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
                                </div>
                                <div className="tw-text-gray-400 tw-text-base tw-py-1 tw-text-right">
                                  {item.createdAt}
                                </div>
                              </div>
                            </div>
                            {/* 두 번째 컬럼 */}
                            <div className="md:tw-w-full">
                              <div className="tw-flex  tw-items-center py-2">
                                <div className="tw-flex-auto">
                                  <div className="tw-font-medium tw-text-black tw-text-base tw-line-clamp-1">
                                    {item.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* 세 번째 컬럼 */}
                            <div className="md:tw-w-full">
                              <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                <div className="tw-col-span-2 tw-text-sm tw-font-bold tw-text-black">아티클</div>
                                <div className="tw-col-span-10 tw-text-sm tw-text-gray-600  tw-line-clamp-1">
                                  {item.articleUrl}
                                </div>
                              </div>
                            </div>
                            <div className="tw-col-span-2 tw-text-sm tw-text-right">
                              댓글 : {item.activeCount} 답변 : {item.answerCount}
                            </div>
                          </div>
                        </Mobile>
                      </div>
                    ))}
                  </section>
                  <Pagination page={page} setPage={setPage} total={totalPage} />
                </div>
              </article>
            </div>
          )}
        </div>
        <MentorsModal title={'퀴즈 직접 등록하기'} isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
          <div>
            <Accordion
              disableGutters
              sx={{ backgroundColor: '#e9ecf2' }}
              expanded={expanded === 0}
              onChange={handleChange(0)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="tw-text-lg tw-font-bold">지식컨텐츠 정보 입력</div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white' }}>
                <div className="tw-text-sm tw-font-bold tw-py-2">지식컨텐츠 유형</div>
                <div className={cx('mentoring-button__group', 'tw-px-0', 'justify-content-center')}>
                  {studyStatus.map((item, i) => (
                    <Toggle
                      key={item.id}
                      label={item.name}
                      name={item.name}
                      value={item.id}
                      variant="small"
                      checked={active === i}
                      isActive
                      type="tabButton"
                      onChange={() => {
                        setActive(i);
                        setContentType(item.id);
                        setParams({
                          ...params,
                          viewFilter: item.id,
                          page,
                        });
                        setPage(1);
                      }}
                      className={cx('tw-mr-2 !tw-w-[90px]')}
                    />
                  ))}
                </div>
                <div className="tw-text-sm tw-font-bold tw-pt-5">지식컨텐츠 URL</div>
                <TextField
                  required
                  id="username"
                  name="username"
                  label="학번 혹은 이메일을 입력해주세요."
                  variant="outlined"
                  type="search"
                  size="small"
                  fullWidth
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    // '& input': { height: ' 0.8em;' },
                  }}
                  margin="dense"
                  {...register('username')}
                  error={errors.username ? true : false}
                  helperText={errors.username?.message}
                />
                <div className="tw-text-sm tw-font-bold tw-pt-5">지식컨텐츠 제목</div>
                <TextField
                  required
                  id="username"
                  name="username"
                  label="제목을 입력해주세요."
                  variant="outlined"
                  type="search"
                  size="small"
                  fullWidth
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    // '& input': { height: ' 0.8em;' },
                  }}
                  margin="dense"
                  {...register('username')}
                  error={errors.username ? true : false}
                  helperText={errors.username?.message}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              disableGutters
              sx={{ backgroundColor: '#e9ecf2' }}
              expanded={expanded === 1}
              onChange={handleChange(1)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="tw-text-lg tw-font-bold">지식컨텐츠 태깅</div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white' }}>
                <div className="tw-text-sm tw-font-bold tw-py-2">추천 대학</div>
                <TagsInput
                  value={selected1}
                  onChange={setSelected1}
                  name="fruits"
                  placeHolder="추천대학 입력 후 엔터를 쳐주세요."
                />
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">추천 전공</div>
                <TagsInput
                  value={selected1}
                  onChange={setSelected1}
                  name="fruits"
                  placeHolder="추천전공 입력 후 엔터를 쳐주세요."
                />
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">추천 학년</div>
                {gradeStatus.map((item, i) => (
                  <Toggle
                    key={item.id}
                    label={item.name}
                    name={item.name}
                    value={item.id}
                    variant="small"
                    checked={active === i}
                    isActive
                    type="tabButton"
                    onChange={() => {
                      setActive(i);
                      setContentType(item.id);
                      setParams({
                        ...params,
                        viewFilter: item.id,
                        page,
                      });
                      setPage(1);
                    }}
                    className={cx('tw-mr-2 !tw-w-[90px]')}
                  />
                ))}
                <div className="tw-text-sm tw-font-bold tw-pt-5">학습 주제</div>
                <TextField
                  required
                  id="username"
                  name="username"
                  label="학습 주제를 입력해주세요."
                  variant="outlined"
                  type="search"
                  size="small"
                  fullWidth
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    // '& input': { height: ' 0.8em;' },
                  }}
                  margin="dense"
                  {...register('username')}
                  error={errors.username ? true : false}
                  helperText={errors.username?.message}
                />
                <div className="tw-text-sm tw-font-bold tw-pt-5">학습 챕터</div>
                <TextField
                  required
                  id="username"
                  name="username"
                  label="학습 챕터를 입력해주세요."
                  variant="outlined"
                  type="search"
                  size="small"
                  fullWidth
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    // '& input': { height: ' 0.8em;' },
                  }}
                  margin="dense"
                  {...register('username')}
                  error={errors.username ? true : false}
                  helperText={errors.username?.message}
                />
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">학습 키워드</div>
                <TagsInput
                  value={selected1}
                  onChange={setSelected1}
                  name="fruits"
                  placeHolder="추천전공 입력 후 엔터를 쳐주세요."
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              disableGutters
              sx={{ backgroundColor: '#e9ecf2' }}
              expanded={expanded === 2}
              onChange={handleChange(2)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="tw-text-lg tw-font-bold">퀴즈 정보 입력</div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white' }}>
                <div className="tw-text-sm tw-font-bold tw-pt-5">생성할 퀴즈 개수</div>
                <div className="tw-grid tw-grid-cols-2 tw-items-center">
                  <div>
                    {/* col-span을 4로 변경 */}
                    <TextField
                      required
                      id="username"
                      name="username"
                      label="생성할 퀴즈 개수를 입력해주세요."
                      variant="outlined"
                      type="search"
                      size="small"
                      fullWidth
                      sx={{
                        '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                      }}
                      margin="dense"
                    />
                  </div>
                  <div className="tw-pl-4">
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultChecked
                          sx={{
                            color: '#ced4de',
                            '&.Mui-checked': { color: '#e11837' },
                          }}
                        />
                      }
                      label={<p className="tw-text-sm tw-font-bold tw-text-left tw-text-[#31343d]">AI퀴즈</p>}
                    />
                    <button
                      type="submit"
                      className="tw-px-4 tw-py-2 tw-text-sm tw-bg-gray-300 tw-rounded-md hover:tw-bg-gray-400"
                    >
                      퀴즈 생성하기
                    </button>
                  </div>
                  <div></div>
                </div>
              </AccordionDetails>
            </Accordion>

            <div className="tw-py-5 tw-flex tw-justify-between">
              <button
                onClick={handlePreviousAccordion}
                className="tw-px-10 tw-py-2 tw-text-base tw-bg-gray-300 tw-rounded-md hover:tw-bg-gray-400"
                style={{ marginRight: 'auto' }} // 왼쪽 정렬
              >
                이전
              </button>
              <button
                onClick={handleNextAccordion}
                className="tw-px-10 tw-py-2 tw-text-base tw-bg-gray-300 tw-rounded-md hover:tw-bg-gray-400"
                style={{ marginLeft: 'auto' }} // 오른쪽 정렬
              >
                {expanded === 2 ? '완료' : '다음'} {/* expanded가 2일 때는 "완료", 그 외에는 "다음" 표시 */}
              </button>
            </div>
          </div>
        </MentorsModal>
        {/* <MentorsModal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
          <div className="tw-font-bold tw-text-xl tw-text-black tw-my-5 tw-mb-2 tw-text-left tw-mt-0">
            퀴즈 직접 등록하기
          </div>
          <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-5 tw-text-left tw-mt-0">
            내가 공부하고 싶거나 크루들과 공유하고 싶은 주제 & 아티클로 퀴즈를 만들어요!
          </div>

          <div>
            <div className="tw-font-bold tw-text-base tw-text-black">필수 입력</div>
            <div>
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2 tw-mt-5">* 질문</div>
              <TextField
                size="small"
                fullWidth
                placeholder="ex) Github Actions와 기존 Github의 차이점에 대해 설명하세요."
                onChange={handleInputQuizChange}
                id="margin-none"
                value={quizName}
                ref={quizRef}
                name="quizName"
              />
            </div>
            <div>
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2 tw-mt-5">
                * 아티클 (질문에 대한 답변에 참고가 될 아티클 링크를 입력해주세요.)
              </div>
              <TextField
                size="small"
                fullWidth
                placeholder="http://"
                onChange={handleInputQuizUrlChange}
                id="margin-none"
                value={quizUrl}
                ref={quizUrlRef}
                name="quizUrl"
              />
            </div>
            <div>
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2 tw-mt-5">추천 직군</div>
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
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2 tw-mt-5">* 추천 직무</div>
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

              <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2 tw-mt-5">* 추천 레벨</div>
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

              <div className="tw-font-bold tw-text-base tw-text-black tw-pt-10">선택 입력</div>

              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-2 tw-mt-5">관련스킬</div>

              <ToggleButtonGroup
                style={{ display: 'inline' }}
                value={skillIds}
                onChange={handleFormat}
                aria-label=""
                color="standard"
              >
                {skillData?.map((item, index) => {
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

              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-mb-2">관련경험</div>
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
            <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-mb-2">해시태그</div>
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
        </MentorsModal> */}
      </div>
    </>
  );
}

export default QuizMakeTemplate;
