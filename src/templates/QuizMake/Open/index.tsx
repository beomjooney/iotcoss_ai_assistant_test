import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Chip, MentorsModal, Pagination, Toggle, Typography } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useSeminarList, paramProps, useSeminarImageList } from 'src/services/seminars/seminars.queries';
import QuizArticleCard from 'src/stories/components/QuizArticleCard';
import Carousel from 'nuka-carousel';
import { useContentTypes, useJobGroups } from 'src/services/code/code.queries';
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
import TextField, { TextFieldProps } from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// import ToggleButton from 'src/stories/components/ToggleButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { UseQueryResult } from 'react-query';
import { useSkills } from '../../../../src/services/skill/skill.queries';
import { SkillResponse } from '../../../../src/models/skills';
import { DateTimePicker, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { ExperiencesResponse } from 'src/models/experiences';
import { useExperiences } from 'src/services/experiences/experiences.queries';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { useRecommendContents } from 'src/services/contents/contents.queries';
import { useJobs, useMyJobs, useQuizzList } from 'src/services/jobs/jobs.queries';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useClubQuizSave, useQuizSave } from 'src/services/quiz/quiz.mutations';
import { jobColorKey } from 'src/config/colors';

const dayGroup = [
  {
    id: '월',
    groupId: '0001',
    name: '월',
    description: '월',
    order: 1,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '화',
    groupId: '0001',
    name: '화',
    description: '화',
    order: 2,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '수',
    groupId: '0001',
    name: '수',
    description: '수',
    order: 3,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '목',
    groupId: '0001',
    name: '목',
    description: '목',
    order: 3,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '금',
    groupId: '0001',
    name: '금',
    description: '금',
    order: 3,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '토',
    groupId: '0001',
    name: '토',
    description: '토',
    order: 4,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '일',
    groupId: '0001',
    name: '일',
    description: '일',
    order: 4,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
];

const privateGroup = [
  {
    id: '0100',
    groupId: '0001',
    name: '공개',
    description: '공개',
    active: true,
    order: 1,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0200',
    groupId: '0001',
    name: '비공개',
    description: '비공개',
    active: false,
    order: 2,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
];

const jobGroupIdx = [
  {
    id: '0100',
    groupId: '0001',
    name: '기획',
    description: '기획',
    order: 1,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0200',
    groupId: '0001',
    name: '디자인',
    description: '디자인',
    order: 2,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0300',
    groupId: '0001',
    name: '개발',
    description: '개발',
    order: 3,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0400',
    groupId: '0001',
    name: '엔지니어링',
    description: '엔지니어링',
    order: 4,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
];

const jobGroup1 = [
  {
    id: '0100',
    groupId: '0001',
    name: '프론트엔드 개발자',
    description: '프론트엔드 개발자',
    order: 1,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0200',
    groupId: '0001',
    name: '백엔드 개발자',
    description: '백엔드 개발자',
    order: 2,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0300',
    groupId: '0001',
    name: 'AI 개발',
    description: 'AI 개발',
    order: 3,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0400',
    groupId: '0001',
    name: '상관없음',
    description: '상관없음',
    order: 4,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
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

const contentQuizTypes = [
  {
    id: '0100',
    groupId: '0001',
    name: '퀴즈 검색하기',
    description: '레벨 0',
    order: 1,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0200',
    groupId: '0001',
    name: '퀴즈 직접 등록하기',
    description: '레벨 1',
    order: 2,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
  {
    id: '0301',
    groupId: '0001',
    name: '퀴즈 만들기 불러오기',
    description: '레벨 3',
    order: 3,
    createdAt: '2022-10-14 15:46:30.123',
    updatedAt: '2022-10-14 15:46:30.123',
  },
];

const cx = classNames.bind(styles);

export function QuizOpenTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();
  const [searchParams, setSearchParams] = useState({});
  const onChangeKeyword = event => {
    const { name, value } = event.currentTarget;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const onChange = (name, value) => {
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const timeValues = {
    from: '00:00:00.000',
    to: '23:59:00.000',
  };
  const [today, setToday] = React.useState<Dayjs | null>(dayjs());
  const [todayEnd, setTodayEnd] = React.useState<Dayjs | null>(dayjs());
  const onChangeHandleFromToStartDate = date => {
    let formattedDate = date?.format('YYYY-MM-DD');
    setToday(formattedDate);
    console.log(formattedDate);
    // if (!formattedDate) {
    //   let time = timeValues[item?.dateType] || '00:00:00.000';
    //   let datetime = `${formattedDate} ${time}`;
    //   setSearchParams({
    //     ...searchParams,
    //     [item?.name]: '',
    //   });
    // } else {
    //   let time = timeValues[item?.dateType] || '00:00:00.000';
    //   let datetime = `${formattedDate} ${time}`;
    //   setSearchParams({
    //     ...searchParams,
    //     [item?.name]: datetime,
    //   });
    // }
  };
  const onChangeHandleFromToEndDate = date => {
    let formattedDate = date?.format('YYYY-MM-DD');
    setTodayEnd(formattedDate);
    console.log(formattedDate);
    // if (!formattedDate) {
    //   let time = timeValues[item?.dateType] || '00:00:00.000';
    //   let datetime = `${formattedDate} ${time}`;
    //   setSearchParams({
    //     ...searchParams,
    //     [item?.name]: '',
    //   });
    // } else {
    //   let time = timeValues[item?.dateType] || '00:00:00.000';
    //   let datetime = `${formattedDate} ${time}`;
    //   setSearchParams({
    //     ...searchParams,
    //     [item?.name]: datetime,
    //   });
    // }
  };

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);

  const [seminarFilter, setSeminarFilter] = useState(['0002']);
  const [paramss, setParamss] = useState({});
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [images, setSeminarImages] = useState<any[]>([]);
  const [quizList, setQuizList] = useState<any[]>([]);
  const [quizListParam, setQuizListParam] = useState<any[]>([]);

  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));
  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();

  const { data: jobsData, refetch }: UseQueryResult<any> = useQuizzList();
  const { data: myJobsData, refetch: refetchMyJob }: UseQueryResult<any> = useMyJobs();

  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<any[]>([]);
  const [isPublic, setIsPublic] = useState('공개');

  const { mutate: onQuizSave } = useQuizSave();
  const { mutate: onClubQuizSave } = useClubQuizSave();

  const handleFormat = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setSkillIds(newFormats);
    console.log(newFormats);
  };
  const handleFormatEx = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setExperienceIds(newFormats);
    console.log(newFormats);
  };

  const [introductionMessage, setIntroductionMessage] = useState<string>('');
  const handleJobGroup = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendJobGroups(newFormats);
    console.log(newFormats);
  };
  const handleJobs = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setJobGroup(newFormats);
    console.log(newFormats);
  };

  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendLevels(newFormats);
  };
  const handleStudyCycle = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setStudyCycle(newFormats);
  };

  const handleIsPublic = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    setIsPublic(newFormats);
  };
  const handleToggleRecommandJobGroup = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendJobGroups(newFormats);
  };

  const { isFetched: isContentFetched } = useSeminarList(params, data => {
    setContents(data.data || []);
    setTotalPage(data.totalPage);
  });

  // const { isFetched: isContentImageFetched } = useSeminarImageList(data => {
  //   setSeminarImages(data || []);
  // });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddClick = () => {
    // onGetJobsData && onGetJobsData();
    // getJobsList();
    console.log('modal ');
    setIsModalOpen(true);
    // setChapterNo(chapterNo);
  };

  const handleQuizInsertClick = async () => {
    const params = {
      content: quizName,
      articleUrl: quizUrl,
      recommendJobGroups: ['0100'],
      recommendJobs: ['0111'],
      recommendLevels: ['0'],
      relatedSkills: ['string'],
      relatedExperiences: ['string'],
      hashTags: ['string'],
    };

    setQuizUrl('');
    setQuizName('');
    await onQuizSave(params);
    await refetchMyJob();
    setActive(2);
  };

  function getObjectsWithSequences(arr, sequenceArray) {
    console.log(arr, sequenceArray);

    return arr
      .filter(item => sequenceArray.includes(String(item.sequence)))
      .map(item => ({
        ...item,
        quizSequence: 1,
        order: 0,
        isRepresentative: true,
        isPublic: true,
        publishAt: '2023-08-22 00:00:00',
      }));
  }

  function getObjectsWithSequencesParam(arr, sequenceArray) {
    console.log(arr, sequenceArray);

    return arr
      .filter(item => sequenceArray.includes(String(item.sequence)))
      .map((item, index) => ({
        quizSequence: item.sequence,
        order: index + 1,
        isRepresentative: true,
        isPublic: true,
        publishAt: '2023-08-22 00:00:00',
      }));
  }

  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.currentTarget;
    const quizData = jobsData?.contents;
    const result = [...state];

    if (result.indexOf(name) > -1) {
      result.splice(result.indexOf(name), 1);
    } else {
      result.push(name);
    }
    setState(result);
    console.log(state, quizData, result);
    const filteredData = getObjectsWithSequences(quizData, result);
    const filteredDataParam = getObjectsWithSequencesParam(quizData, result);
    console.log(filteredData);
    console.log(filteredDataParam);
    setQuizList(filteredData);
    setQuizListParam(filteredDataParam);

    // const test = jobsData?.data.content;
    // console.log(test);
    // setState(test[1]);
    // const sequenceArray = [15, 16, 17, 18];
    // const filteredData = getObjectsWithSequences(test, sequenceArray);
    // console.log(filteredData);
  };

  useEffect(() => {
    setParams({
      ...params,
      page,
      recommendJobGroups: jobGroupsFilter.join(','),
      recommendLevels: levelsFilter.join(','),
      seminarStatus: seminarFilter.join(','),
    });
  }, [page, jobGroupsFilter, levelsFilter, seminarFilter]);

  const setNewCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };
  const [jobGroup, setJobGroup] = useState([]);
  const [studyCycle, setStudyCycle] = useState([]);
  const [recommendJobGroups, setRecommendJobGroups] = useState([]);
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [clubName, setClubName] = useState<string>('');
  const [alignment, setAlignment] = React.useState<string | null>('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [active, setActive] = useState(0);
  const [popupParams, setPopupParams] = useState<paramProps>({
    page,
    size: 16,
  });
  const PAGE_NAME = 'contents';
  const { isFetched: isContentListFetched, isFetching } = useRecommendContents(PAGE_NAME, params, data => {
    setContents(data.data || []);
    console.log(contents);
    // setTotalPage(data.totalPage > 0 ? data.totalPage : 1);
  });

  useEffect(() => {
    console.log('fasdaf');
    if (active == 0) {
      refetch();
    } else if (active == 2) {
      refetchMyJob();
    }
  }, [active]);

  const [state, setState] = React.useState([]);

  useEffect(() => {
    if (isFetching) return;
    setParams({
      ...params,
    });
  }, [page]);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const boxWidth = 110;
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const steps = [
    'Step1. 클럽 개설 약속',
    'Step2. 클럽 세부사항 설정',
    'Step3. 성장 퀴즈 선택',
    'Step4. 개설한 성장 미리보기',
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [quizUrl, setQuizUrl] = React.useState('');
  const [quizName, setQuizName] = React.useState('');
  const [quizSearch, setQuizSearch] = React.useState('');

  const isStepOptional = (step: number) => {
    return step === 1 || step === 2 || step === 3;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleCancel = () => {
    console.log('next');
    router.push('/quiz');
  };
  const handleNext = () => {
    console.log('next');
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleNextLast = () => {
    console.log(quizListParam);
    const params = { ...paramss, clubQuizzes: quizListParam };
    //console.log(params);
    onClubQuizSave(params);
    router.push('/quiz');
  };

  const handleNextOne = () => {
    const params = {
      jobGroup: jobGroup,
      name: clubName,
      studyCycle: studyCycle,
      recommendJobGroups: [recommendJobGroups],
      recommendLevels: [recommendLevels],
      startAt: today.format('YYYY-MM-DD') + ' 00:00:00',
      endAt: todayEnd.format('YYYY-MM-DD') + ' 00:00:00',
      description: introductionMessage,
      studyWeekCount: 0,
      isPublic: true,
      recruitMemberCount: 0,
      publicYn: 'Y',
      participationCode: '',
      relatedSkills: skillIds,
      relatedExperiences: experienceIds,
      clubQuizzes: quizListParam,
    };
    setParamss(params);
    console.log('next');
    if (jobGroup.length === 0) {
      alert('등록을 원하는 분야를 선택해주세요.');
      return;
    }

    if (clubName === '') {
      alert('클럽 이름을 입력해주세요.');
      return;
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);

    console.log(activeStep);
  };

  const handleInputChange = event => {
    setClubName(event.target.value);
  };

  const handleInputQuizChange = event => {
    setQuizName(event.target.value);
  };

  const handleInputQuizUrlChange = event => {
    setQuizUrl(event.target.value);
  };

  const handleInputQuizSearchChange = event => {
    setQuizSearch(event.target.value);
  };

  const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setIntroductionMessage(value);
  };

  const onToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.currentTarget;
    if (name === 'skillIds') {
      const result = [...skillIds];

      if (result.indexOf(value) > -1) {
        result.splice(result.indexOf(value), 1);
      } else {
        result.push(value);
      }
      setSkillIds(result);
    } else if (name === 'experienceIds') {
      const result = [...experienceIds];

      if (result.indexOf(value) > -1) {
        result.splice(result.indexOf(value), 1);
      } else {
        result.push(value);
      }
      setExperienceIds(result);
    }
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="dfsdf" subTitle="sdfadf" /> */}

      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={5} className="tw-font-bold tw-text-3xl tw-text-black">
              성장퀴즈 &gt; 성장퀴즈 클럽 개설하기
            </Grid>
            <Grid item xs={4} className="tw-font-semi tw-text-base tw-text-black">
              나와 크루들의 성장을 이끌 퀴즈 클럽을 개설해요!
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              {/* <button
                type="button"
                className="tw-text-black tw-border tw-border-indigo-600 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5"
              >
                <Link href="/quiz1" className="nav-link">
                  임시저장 불러오기
                </Link>
              </button> */}
            </Grid>
          </Grid>
        </div>

        <Stepper activeStep={activeStep} alternativeLabel className="tw-my-10">
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === 0 && (
          <div>
            <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10 tw-text-center">개설 전, 약속해요.</div>
            <div className={cx('content-area', ' tw-text-center')}>
              모두의 성장을 돕는 좋은 클럽이 되도록 노력해주실거죠?
            </div>
            <div className={cx('content-area', ' tw-text-center')}>
              모두가 퀴즈클럽를 통해 성장할 수 있도록 공정한 관리를 부탁드릴게요!
            </div>
            <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
              <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                <div className="tw-row-span-2">
                  {isStepOptional(activeStep) && (
                    <button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    >
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '다음'}
                    </button>
                  )}
                  <button
                    onClick={handleCancel}
                    className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                  >
                    취소하기
                  </button>
                  <button
                    className="tw-w-[300px] tw-bg-[#2474ED] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    onClick={handleNext}
                  >
                    약속할게요.
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeStep === 1 && (
          <article>
            <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">클럽 정보입력</div>
            <div className={cx('content-area')}>
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-2">클럽명</div>
              <TextField
                size="small"
                fullWidth
                label={'클럽명을 입력해주세요.'}
                onChange={handleInputChange}
                id="margin-none"
                value={clubName}
                name="clubName"
              />
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-2">클럽 이미지 선택</div>

              <div className="tw-grid tw-grid-flow-col tw-gap-0 tw-content-end">
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
              </div>

              <div>
                <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-content-start">
                  <div>
                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 직군</div>
                    <ToggleButtonGroup value={jobGroup} exclusive onChange={handleJobs} aria-label="text alignment">
                      {jobGroupIdx?.map((item, index) => (
                        <ToggleButton
                          key={`job-${index}`}
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
                      ))}
                    </ToggleButtonGroup>

                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 레벨</div>
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

                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                      성장퀴즈 주기 (복수 선택 가능)
                    </div>
                    <ToggleButtonGroup value={studyCycle} onChange={handleStudyCycle} aria-label="" color="standard">
                      {dayGroup?.map((item, index) => (
                        <ToggleButton
                          key={`job1-${index}`}
                          value={item.id}
                          name={item.name}
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
                  </div>
                  <div>
                    <div>
                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천직무</div>

                      <ToggleButtonGroup
                        value={recommendJobGroups}
                        exclusive
                        onChange={handleJobGroup}
                        aria-label=""
                        color="standard"
                      >
                        {jobGroup1?.map((item, index) => (
                          <ToggleButton
                            key={`job-${index}`}
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
                        ))}
                      </ToggleButtonGroup>

                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">공개/비공개 설정</div>
                      <ToggleButtonGroup
                        value={isPublic}
                        onChange={handleIsPublic}
                        exclusive
                        aria-label=""
                        color="standard"
                      >
                        {privateGroup?.map((item, index) => (
                          <ToggleButton
                            key={`job-${index}`}
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
                        ))}
                      </ToggleButtonGroup>
                      <TextField
                        className="tw-pl-1 tw-mt-1"
                        size="small"
                        disabled
                        label={'입장코드를 설정해주세요.'}
                        id="margin-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">관련스킬</div>

                <ToggleButtonGroup value={skillIds} onChange={handleFormat} aria-label="" color="standard">
                  {skillData.data.contents?.map((item, index) => {
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
                <ToggleButtonGroup value={experienceIds} onChange={handleFormatEx} aria-label="" color="standard">
                  {experienceData.data.contents?.map((item, index) => {
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
                {/* {experienceData.data.contents?.map((item, index) => {
                  return (
                    <ToggleButton
                      key={`custom-skill-${index}`}
                      className="tw-mb-3 tw-mr-3"
                      label={item.name}
                      name="experienceIds"
                      value={item.name}
                      onChange={onToggleChange}
                      variant="small"
                      type="multiple"
                      isActive
                      isBorder
                    />
                  );
                })} */}
                <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-content-start">
                  <div>
                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">퀴즈클럽 시작일</div>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        inputFormat="YYYY-MM-DD"
                        value={today}
                        onChange={e => onChangeHandleFromToStartDate(e)}
                        renderInput={params => <TextField {...params} variant="standard" />}
                      />
                    </LocalizationProvider>
                    <div className="tw-text-sm tw-text-black tw-mt-2 tw-my-0">* 스펙업 주기는 기본 12주 입니다.</div>
                  </div>
                  <div>
                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">클럽 모집 마감일</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        inputFormat="YYYY-MM-DD"
                        value={todayEnd}
                        onChange={e => onChangeHandleFromToEndDate(e)}
                        renderInput={params => <TextField {...params} variant="standard" />}
                      />
                    </LocalizationProvider>
                    <div className="tw-text-sm tw-text-black tw-mt-2 tw-my-0">
                      *스펙업 시작일보다 이른 날짜만 설정이 가능합니다.
                    </div>
                  </div>
                </div>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">성장퀴즈 클럽 소개</div>
                <TextField
                  fullWidth
                  id="margin-none"
                  multiline
                  rows={6}
                  onChange={onMessageChange}
                  value={introductionMessage}
                  defaultValue="클럽 소개 내용을 입력해주세요."
                />
              </div>
            </div>
            <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
              <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                <div className="tw-row-span-2">
                  {/* {isStepOptional(activeStep) && (
                    <button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    >
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '다음'}
                    </button>
                  )} */}
                  <button className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded">
                    임시 저장하기
                  </button>
                  <button
                    className="tw-w-[300px] tw-bg-[#2474ED] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    onClick={handleNextOne}
                  >
                    {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '다음'}
                  </button>
                </div>
              </div>
            </div>
          </article>
        )}

        {activeStep === 2 && (
          <>
            <article>
              <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">퀴즈 등록하기</div>
              <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
                <button
                  type="button"
                  onClick={() => handleAddClick()}
                  className="tw-text-white tw-bg-blue-500 hover:tw-bg-blue-800 tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
                >
                  퀴즈 등록하기 +
                </button>
              </Grid>
              {quizList.map((item, index) => {
                return (
                  <div key={index} className="">
                    <div className="tw-flex tw-items-center tw-p-4 tw-border border mb-3 mt-3 rounded">
                      <div className="tw-flex-auto">
                        <div className="tw-font-medium tw-text-black">{item.content}</div>
                      </div>
                      <div className="">김찬영</div>
                      <svg className="tw-ml-6 tw-h-6 tw-w-6 tw-flex-none" fill="none">
                        <path
                          d="M12 8v1a1 1 0 0 0 1-1h-1Zm0 0h-1a1 1 0 0 0 1 1V8Zm0 0V7a1 1 0 0 0-1 1h1Zm0 0h1a1 1 0 0 0-1-1v1ZM12 12v1a1 1 0 0 0 1-1h-1Zm0 0h-1a1 1 0 0 0 1 1v-1Zm0 0v-1a1 1 0 0 0-1 1h1Zm0 0h1a1 1 0 0 0-1-1v1ZM12 16v1a1 1 0 0 0 1-1h-1Zm0 0h-1a1 1 0 0 0 1 1v-1Zm0 0v-1a1 1 0 0 0-1 1h1Zm0 0h1a1 1 0 0 0-1-1v1Z"
                          fill="#64748B"
                        ></path>
                      </svg>
                    </div>
                  </div>
                );
                // <ArticleCard uiType={item.contentsType} content={item} key={i} className={cx('container__item')} />
              })}
              <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
                <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                  <div className="tw-row-span-2">
                    <button
                      onClick={handleBack}
                      className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    >
                      이전
                    </button>
                    <button
                      className="tw-w-[300px] tw-bg-[#2474ED] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                      onClick={handleNext}
                    >
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '미리보기'}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </>
        )}
        {activeStep === 3 && (
          <>
            <article>
              <div className="tw-p-10 tw-bg-gray-50">
                <div className="tw-flex tw-flex-col tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow md:tw-flex-row hover:tw-bg-gray-100 dark:tw-border-gray-700 dark:tw-bg-gray-800 dark:hover:tw-bg-gray-700">
                  <img
                    className="tw-object-cover tw-rounded-t-lg tw-h-[245px] md:tw-h-[245px] md:tw-w-[220px] md:tw-rounded-none md:tw-rounded-l-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                  <div className="tw-flex tw-flex-col tw-justify-between tw-p-4 tw-leading-normal">
                    <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                      {paramss.recommendJobGroups.map((name, i) => (
                        <Chip
                          key={`job_${i}`}
                          chipColor={jobColorKey(recommendJobGroups[i])}
                          radius={4}
                          variant="outlined"
                        >
                          dd
                        </Chip>
                      ))}
                    </div>
                    <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                      {paramss.relatedExperiences.map((name, i) => (
                        <Chip key={`job_${i}`} chipColor={jobColorKey(experienceIds[i])} radius={4} variant="outlined">
                          dd
                        </Chip>
                      ))}
                    </div>
                    <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                      <Chip chipColor="primary" radius={4} variant="filled">
                        {paramss.recommendLevels.sort().join(',')}레벨
                      </Chip>
                    </div>
                    <div className="tw-mb-3 tw-text-sm tw-font-semibold tw-text-gray-500 dark:tw-text-gray-400">
                      모집마감일 : {paramss.startAt}
                    </div>
                    <h6 className="tw-mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
                      {paramss.clubName}
                    </h6>

                    <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-400 dark:tw-text-gray-400">
                      {paramss.studyCycle.toString()} | {0} 주 | 학습 {0}회
                    </div>

                    {/* <div className="tw-flex tw-items-center tw-space-x-4">
                    <img className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full" src={item?.author?.avatar} alt="" />
                    <div className="tw-text-sm tw-font-semibold tw-text-black dark:tw-text-white">
                      <div>{item?.author?.displayName}</div>
                    </div>
                  </div> */}
                  </div>
                </div>
              </div>
              <div className="tw-text-lg tw-mt-5 tw-font-bold tw-text-black">김찬영</div>
              <div className="tw-text-xl tw-mt-5 tw-font-bold tw-text-black">퀴즈클럽 소개</div>
              <div className="tw-text-base tw-mt-5 tw-text-black"> {paramss.description}</div>
              <div className="tw-text-xl tw-mt-5 tw-font-bold tw-text-black">퀴즈클럽 질문 미리보기</div>
              <div className="tw-text-sm tw-mt-5 tw-mb-2 tw-font-bold tw-text-gray ">12주 총 학습 36회 진행</div>
              {quizList.map((item, index) => {
                return (
                  <div key={index} className="">
                    <div className="tw-flex tw-items-center tw-px-0 tw-border  mb-2 mt-0 rounded">
                      <Chip chipColor="primary" radius={4} variant="filled">
                        대표
                      </Chip>
                      <div className="tw-flex-auto tw-ml-3">
                        <div className="tw-font-medium tw-text-black">{item.content}</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
                <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                  <div className="tw-row-span-2">
                    <button
                      onClick={handleBack}
                      className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    >
                      이전
                    </button>
                    <button
                      className="tw-w-[300px] tw-bg-[#2474ED] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                      onClick={handleNextLast}
                    >
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '미리보기'}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </>
        )}
      </div>
      <MentorsModal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
        <div className="tw-font-bold tw-text-xl tw-text-black tw-my-5 tw-text-center">퀴즈 등록하기</div>
        <div className={cx('mentoring-register-container__card-nodes')}>
          {contentQuizTypes.map((item, i) => (
            <Toggle
              className={cx('fixed-width')}
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
                //   setPopUpParams({
                //     ...popupParams,
                //     // contentsType: item.id,
                //     // page: 1,
                //     // seminarEndDateFrom:
                //     //   item.id === ArticleEnum.SEMINAR ? moment().format('YYYY-MM-DD HH:mm:ss.SSS') : null,
                //   });
                //   setPage(1);
              }}
            />
          ))}
        </div>
        {active === 0 && (
          <div>
            <div className="tw-mt-10">
              <TextField
                size="small"
                fullWidth
                label={'퀴즈 키워드를 입력하세요.'}
                onChange={handleInputQuizSearchChange}
                id="margin-none"
                value={quizSearch}
                name="quizSearch"
              />
            </div>
            {jobsData?.contents.map((item, index) => (
              <div key={index} className="tw-flex">
                <Checkbox
                  onChange={handleChangeCheck}
                  checked={state.includes(String(item.sequence))}
                  name={item.sequence}
                  className="tw-mr-3"
                />
                <div className="tw-flex tw-w-full tw-items-center tw-p-4 tw-border border mb-3 mt-3 rounded">
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
              </div>
            ))}
          </div>
        )}
        {active == 1 && (
          <div>
            <div className="tw-mt-10">
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
        )}
        {active === 2 && (
          <div>
            <div className="tw-mt-10">
              <TextField
                size="small"
                fullWidth
                label={'퀴즈 키워드를 입력하세요.'}
                onChange={handleInputQuizSearchChange}
                id="margin-none"
                value={quizSearch}
                name="quizSearch"
              />
            </div>
            {myJobsData?.content.map((item, index) => (
              <div key={index} className="tw-flex">
                <Checkbox
                  onChange={handleChangeCheck}
                  checked={state.includes(String(item.sequence))}
                  name={item.sequence}
                  className="tw-mr-3"
                />
                <div className="tw-flex tw-w-full tw-items-center tw-p-4 tw-border border mb-3 mt-3 rounded">
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
              </div>
            ))}
          </div>
        )}
      </MentorsModal>
    </div>
  );
}

export default QuizOpenTemplate;
