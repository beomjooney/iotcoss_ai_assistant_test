import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, MentorsModal, AIQuizList, Tag } from 'src/stories/components';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import SearchIcon from '@mui/icons-material/Search';
import { UseQueryResult } from 'react-query';
import { useMyQuiz, useMyQuizContents, useMyQuizThresh } from 'src/services/jobs/jobs.queries';
import { useQuizSave, useAIQuizSave, useAIQuizAnswer, useQuizContentSave } from 'src/services/quiz/quiz.mutations';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import KnowledgeComponent from 'src/stories/components/KnowledgeComponent';
import ArticleList from 'src/stories/components/ArticleList';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { useOptions } from 'src/services/experiences/experiences.queries';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import validator from 'validator';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useQuizFileDownload } from 'src/services/quiz/quiz.queries';

const studyStatus = [
  {
    id: '0100',
    name: '아티클',
  },
  {
    id: '0210',
    name: '영상',
  },
  {
    id: '0320',
    name: '첨부파일',
  },
];

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

  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // Need this for the react-tooltip
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState<boolean>(false);
  const [isContentModalClick, setIsContentModalClick] = useState<boolean>(false);
  const [jobGroup, setJobGroup] = useState([]);
  const [active, setActive] = useState('');
  const [activeQuiz, setActiveQuiz] = useState('');
  const [contentType, setContentType] = useState('');
  const [jobs, setJobs] = useState([]);
  const [pageThresh, setPageThresh] = useState(1);
  const [totalPageThresh, setTotalPageThresh] = useState(1);
  const [paramsThresh, setParamsThresh] = useState<any>({ pageThresh, quizSortType: '0001' });
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [quizPage, setQuizPage] = useState(1);
  const [totalQuizPage, setTotalQuizPage] = useState(1);
  const [params, setParams] = useState<any>({ page, quizSortType: '0001' });
  const [quizParams, setQuizParams] = useState<any>({ quizPage, sortType: 'DESC' });
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<any[]>([]);
  const [selected, setSelected] = useState([]);
  const open = Boolean(anchorEl);
  const [keyWorld, setKeyWorld] = useState('');
  const [contentSequence, setContentSequence] = useState('');

  const [expanded, setExpanded] = useState(0); // 현재 확장된 Accordion의 인덱스
  const [isModify, setIsModify] = useState(false);

  const [selected1, setSelected1] = useState([]);
  const [selected2, setSelected2] = useState([]);
  const [selected3, setSelected3] = useState([]);
  const [quizCount, setQuizCount] = useState(1);
  const [aiQuiz, setAiQuiz] = useState(false);
  const [quizSortType, setQuizSortType] = useState('0001');
  const [contentSortType, setContentSortType] = useState('');
  const [threshSortType, setThreshSortType] = useState('0001');
  const [sortType, setSortType] = useState('DESC');

  const [universityCode, setUniversityCode] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [selectedJobName, setSelectedJobName] = useState('');
  const [selectedJob, setSelectedJob] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [jobLevel, setJobLevel] = useState([]);
  const [contentUrl, setContentUrl] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [sortQuizType, setSortQuizType] = useState('ASC');
  const [question, setQuestion] = useState('');
  const [modelAnswerFinal, setModelAnswerFinal] = useState('');
  const [quizList, setQuizList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState('');
  const [fileNameCopy, setFileNameCopy] = useState([]);
  const [key, setKey] = useState('');

  // 로딩 상태를 관리하기 위해 useState 훅 사용
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState({});
  const [index, setIndex] = useState(0);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    const jobsList = typeof value === 'string' ? value.split(',') : value;
    setPersonName(jobsList);

    // Convert selected names to corresponding codes
    const selectedCodes = jobsList
      .map(name => {
        const job = jobs.find(job => job.name === name);
        return job ? job.code : null;
      })
      .filter(code => code !== null);

    setSelectedJob(selectedCodes);
    console.log(selectedCodes);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChangeQuiz = event => {
    setQuizSortType(event.target.value);
  };
  const handleChangeThresh = event => {
    setThreshSortType(event.target.value);
  };

  const handleChangeContent = event => {
    console.log(event.target.value);
    setContentSortType(event.target.value);
  };

  const handleClickContent = data => {
    console.log(data);
    setContentType(data.contentType);
    setActive(data.contentType);
    setContentUrl(data.url);
    setContentTitle(data.description || '');
    setSelectedSubject(data.studySubject || '');
    setSelectedChapter(data.studyChapter || '');
    // setJobLevel(data.jobLevels && data.jobLevels.length > 0 ? data.jobLevels[0].code : '0001');
    setJobLevel(data.jobLevels.map(item => item.code));
    setSelectedUniversity(data.jobGroups[0]?.code || '');
    setUniversityCode(data.jobGroups[0]?.code || '');
    setSelected1(data.studyKeywords);
    setContentSequence(data.contentSequence);

    const selected = optionsData?.data?.jobs?.find(u => u.code === data.jobGroups[0]?.code);
    setJobs(selected ? selected.jobs : []);

    const jobsName = data.jobs.map(item => item.name);
    console.log(jobsName);
    setPersonName(jobsName || []);

    setSelectedJob(selected?.jobs.map(item => item.code) || []);
    setSelected2(data.skills);
    setFileName(data.name);
    setFileNameCopy(data.name);
    setQuizCount(1);
    setQuizList([]);
    // setFileName(data.name);
  };

  const handleChangeSortType = event => {
    setSortType(event.target.value);
  };

  // api call
  const { data: myQuizData, refetch: refetchMyQuiz }: UseQueryResult<any> = useMyQuiz(params, data => {
    setContents(data.content);
    setTotalPage(data.totalPages);
  });

  const { data: myQuizContentData, refetch: refetchMyQuizContent }: UseQueryResult<any> = useMyQuizContents(
    quizParams,
    data => {
      console.log(data.contents);
      setTotalQuizPage(data.totalPages);
    },
  );

  const { data: myQuizThreshData, refetch: refetchMyQuizThresh }: UseQueryResult<any> = useMyQuizThresh(
    paramsThresh,
    data => {
      console.log(data.contents);
      setTotalPageThresh(data.totalPages);
    },
  );
  const { isFetched: isOptionFetched, data: optionsData }: UseQueryResult<any> = useOptions();

  //quiz delete
  const { mutate: onQuizSave, isSuccess: postSuccess, isError: postError } = useQuizSave();
  const { mutate: onQuizContentSave, isSuccess: postContentSuccess } = useQuizContentSave();
  const { mutate: onAIQuizSave, isSuccess: updateSuccess, isError: updateError, data: aiQuizData } = useAIQuizSave();
  const { mutate: onAIQuizAnswer, isSuccess: answerSuccess, data: aiQuizAnswerData } = useAIQuizAnswer();

  const { isFetched: isParticipantListFetcheds, isSuccess: isParticipantListSuccess } = useQuizFileDownload(
    key,
    data => {
      console.log('file download', data, fileName);
      if (data) {
        // blob 데이터를 파일로 저장하는 로직
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // 다운로드할 파일 이름과 확장자를 설정합니다.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setKey('');
        setFileName('');
      }
    },
  );

  useEffect(() => {
    if (updateError) {
      alert('AI 퀴즈 생성 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  }, [updateError]);

  useEffect(() => {
    if (optionsData) {
      setJobLevel(optionsData?.data?.jobLevels[0].code);
    }
  }, [optionsData]);

  useEffect(() => {
    if (aiQuizData) {
      console.log(aiQuizData);
      if (aiQuizData?.generatedQuizzes && aiQuizData?.generatedQuizzes.length > 0) {
        const formattedQuizList = aiQuizData.generatedQuizzes.map((quiz: any) => ({
          question: quiz.question,
          modelAnswerKeywords: [quiz.keyword],
        }));
        setQuizList(formattedQuizList);
        console.log(formattedQuizList);
      }
    }
  }, [aiQuizData]);

  // 성공 상태를 감지하여 로딩 상태를 업데이트하기 위해 useEffect 훅 사용
  useEffect(() => {
    if (updateSuccess) {
      setIsLoading(false);
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (answerSuccess) {
      // setIsLoadingAI(false);
      setIsLoadingAI(prevState => ({ ...prevState, [index]: false }));
    }
  }, [answerSuccess]);

  useDidMountEffect(() => {
    setContentTitle('');
    // setContentUrl('');
    setSelectedSubject('');
    setSelectedChapter('');
    setSelected1([]);
    setSelected2([]);
    setSelectedUniversity('');
    setSelectedJob([]);
    setJobLevel([]);
    setQuizList([]);
    setQuizCount(1);
    setFileName('');
    setFileNameCopy([]);

    refetchMyQuiz();
    refetchMyQuizContent();
  }, [postSuccess, postContentSuccess]);

  const handleAddClick = (isContent: boolean) => {
    setIsContentModalOpen(isContent);
    setContentUrl('');
    setContentTitle('');
    setJobGroup([]);
    setJobs([]);
    setRecommendLevels([]);
    setExperienceIds([]);
    setSelected([]);
    setUniversityCode('');
    setSelectedUniversity('');
    setSelectedUniversityName('');
    setSelectedJobName('');
    setSelectedJob([]);
    setActiveQuiz('');
    setJobLevel([]);
    setSelectedSubject('');
    setSelectedChapter('');
    setSelected1([]);
    setSelected2([]);
    setIsModalOpen(true);
    setContentSortType('');
  };

  useEffect(() => {
    setParams({
      page,
      keyword: keyWorld,
      quizSortType: quizSortType,
    });
  }, [page, keyWorld, quizSortType]);

  useEffect(() => {
    setParamsThresh({
      page: pageThresh,
      keyword: keyWorld,
      quizSortType: threshSortType,
    });
  }, [pageThresh, keyWorld, threshSortType]);

  useEffect(() => {
    setQuizParams({
      page: quizPage,
      keyword: keyWorld,
      sortType: sortType,
    });
  }, [quizPage, keyWorld, sortType]);

  useEffect(() => {
    setExpanded(0);
  }, [isModalOpen]);

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  const newCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

  const handleAIQuizClick = () => {
    console.log('ai quiz click');
    // 유효성 검사
    if (!quizSortType) {
      alert('퀴즈 유형을 선택하세요.');
      return;
    }

    if (contentType !== '0320' && !contentUrl) {
      alert('콘텐츠 URL을 입력해주세요.');
      return false;
    }

    // if (!contentUrl) {
    //   alert('콘텐츠 URL을 입력하세요.');
    //   return;
    // }

    if (!selectedUniversity || selectedUniversity.length === 0) {
      alert('하나 이상의 대학을 선택하세요.');
      return;
    }

    if (!selectedJob || selectedJob.length === 0) {
      alert('하나 이상의 학과를 선택하세요.');
      return;
    }

    if (quizCount < 1) {
      alert('생성 퀴즈 개수는 1개 이상 설정해야 합니다.');
      return;
    }

    console.log('AI 퀴즈 클릭');
    const formData = new FormData();

    const params = {
      isNew: isContentModalClick ? false : true,
      contentSequence: contentSequence,
      contentType: contentType,
      jobs: selectedJob,
      jobLevels: jobLevel,
      quizCount: quizCount,
    };

    if (contentType === '0320') {
      formData.append('file', fileList[0]);
    } else {
      params['contentUrl'] = contentUrl;
    }

    const jsonString = JSON.stringify(params);
    const blob = new Blob([jsonString], { type: 'application/json' });
    formData.append('request', blob);
    // formData.append('contentType', contentType);
    // formData.append('jobLevels', jobLevel.join(','));
    // formData.append('jobs', selectedJob.join(','));
    // formData.append('quizCount', quizCount);

    // 로딩 상태를 true로 설정
    setIsLoading(true);
    onAIQuizSave(formData);
  };

  const handleQuizClick = () => {
    // Validation check
    if (!question || !selected3) {
      alert('퀴즈 질문,  키워드를 입력해주세요.');
      return;
    }

    if (editingIndex !== null) {
      const updatedQuizzes = quizList.map((quiz, index) =>
        index === editingIndex ? { question, modelAnswer: modelAnswerFinal, modelAnswerKeywords: selected3 } : quiz,
      );
      setQuizList(updatedQuizzes);
      setEditingIndex(null);
    } else {
      const newQuiz = { question, modelAnswer: modelAnswerFinal, modelAnswerKeywords: selected3 };
      setQuizList([...quizList, newQuiz]);
    }
    setQuestion('');
    setModelAnswerFinal('');
    setSelected3([]);
    setIsModify(false);
  };

  const handleEditQuiz = index => {
    const quizToEdit = quizList[index];
    setQuestion(quizToEdit.question);
    setModelAnswerFinal(quizToEdit.modelAnswer);
    setSelected3(quizToEdit.modelAnswerKeywords);
    setEditingIndex(index);
    setIsModify(true);
  };

  const handleQuizInsertClick = async () => {
    console.log(selectedUniversity);
    console.log(isContentModalOpen);

    if (!contentTitle) {
      alert('콘텐츠 제목을 입력해주세요.');
      return false;
    }

    if (contentType !== '0320') {
      if (!contentUrl) {
        alert('콘텐츠 URL을 입력해주세요.');
        return false;
      }

      if (validator.isURL(contentUrl)) {
      } else {
        alert('유효한 URL을 입력해주세요.');
        return false;
      }

      const urlPattern = /^(http:\/\/|https:\/\/)/;
      if (!urlPattern.test(contentUrl)) {
        alert(`URL이 http:// 또는 https://로 시작해야 합니다`);
        return false;
      }
    }

    console.log(selectedSubject);
    if (!selectedSubject) {
      alert('주제를 입력해주세요.');
      return false;
    }
    if (!selectedChapter) {
      alert('챕터를 입력해주세요.');
      return false;
    }
    if (!selected1.length) {
      alert('학습 키워드를 입력해주세요.');
      return false;
    }
    if (!selected2.length) {
      alert('학습 기술을 입력해주세요.');
      return false;
    }
    if (!selectedUniversity) {
      alert('추천 대학을 입력해주세요.');
      return false;
    }

    if (selectedJob.length === 0) {
      alert('추천 학과를 입력해주세요.');
      return false;
    }
    if (jobLevel.length === 0) {
      alert('추천 학년을 입력해주세요.');
      return false;
    }
    if (isContentModalOpen) {
      // 콘텐츠 등록
      console.log('지식컨텐츠');
      const params = {
        contentType: contentType,
        description: contentTitle,
        url: contentUrl,
        studySubject: selectedSubject,
        studyChapter: selectedChapter,
        skills: selected2,
        jobGroups: [selectedUniversity],
        jobs: selectedJob,
        jobLevels: jobLevel,
        studyKeywords: selected1,
      };

      const formData = new FormData();
      formData.append('file', fileList[0]);
      const jsonString = JSON.stringify(params);
      const blob = new Blob([jsonString], { type: 'application/json' });
      formData.append('request', blob);

      onQuizContentSave(formData);
      setActiveTab('지식컨텐츠');
    } else {
      // 콘텐츠 등록
      console.log('퀴즈 등록');
      if (!quizList.length) {
        alert('퀴즈를 추가해주세요.');
        return false;
      }

      console.log('quiz modal');
      // modelAnswer를 modelAnswerAI로 변경하고 기존 modelAnswer 제거
      const updatedQuizList = quizList.map(({ modelAnswer, ...rest }) => ({
        ...rest,
        modelAnswerFinal: modelAnswer,
        modelAnswerAi: '',
      }));

      const params = {
        content: {
          isNew: isContentModalClick ? false : true,
          contentSequence: contentSequence,
          contentType: contentType,
          description: contentTitle,
          url: contentUrl,
          studySubject: selectedSubject,
          studyChapter: selectedChapter,
          skills: selected1,
          jobGroups: [selectedUniversity],
          jobs: selectedJob,
          jobLevels: jobLevel,
          studyKeywords: selected2,
        },
        quizzes: updatedQuizList,
      };

      const formData = new FormData();
      formData.append('file', fileList[0]);
      const jsonString = JSON.stringify(params);
      const blob = new Blob([jsonString], { type: 'application/json' });
      formData.append('request', blob);

      console.log(params);

      for (let index = 0; index < params.quizzes.length; index++) {
        const quiz = params.quizzes[index];
        console.log(quiz);
        if (quiz.modelAnswerFinal === undefined) {
          alert(`퀴즈 ${index + 1}에 모범 답변이 없습니다.`);
          return false; // Exit the function if modelAnswerFinal is undefined
        }
      }
      onQuizSave(formData);
      setActiveTab('퀴즈목록');
    }
    setIsModalOpen(false);
  };

  const [activeTab, setActiveTab] = useState('퀴즈목록');
  const handleTabClick = tabName => {
    setActiveTab(tabName);
  };

  const handleUniversityChange = e => {
    const selectedCode = e.target.value;
    const selected = optionsData?.data?.jobs?.find(u => u.code === selectedCode);
    setUniversityCode(selectedCode);
    setSelectedUniversity(selectedCode);
    setSelectedUniversityName(selected ? selected.name : '');
    setJobs(selected ? selected.jobs : []);
    setSelectedJob([]); // Clear the selected job when university changes
    setPersonName([]);
    console.log(selected);
  };

  const handleInputSubjectChange = event => {
    setSelectedSubject(event.target.value);
  };
  const handleContentTitleChange = event => {
    setContentTitle(event.target.value);
  };
  const handleContentUrlChange = event => {
    setContentUrl(event.target.value);
  };
  const handleQuizCountChange = event => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      if (value > 10) {
        alert('숫자는 10 이하로 입력해주세요.');
      } else {
        setQuizCount(value);
      }
    }
  };
  const handleInputChapterChange = event => {
    setSelectedChapter(event.target.value);
  };

  const handleChangeQuizType = event => {
    setSortQuizType(event.target.value);
    setQuizList([]);
    setQuestion('');
    setModelAnswerFinal('');
    setSelected3([]);
    setQuizCount(1);
  };
  const handleQuestionChange = event => {
    setQuestion(event.target.value);
  };
  const handleModelAnswerChange = event => {
    setModelAnswerFinal(event.target.value);
  };

  const updateQuizList = newQuiz => {
    const index = quizList.findIndex(quiz => quiz.question === newQuiz.question);

    if (index !== -1) {
      // 중복된 경우 덮어쓰기
      const updatedQuizList = [...quizList];
      updatedQuizList[index] = newQuiz;
      setQuizList(updatedQuizList);
    } else {
      // 새로운 퀴즈 추가
      setQuizList([...quizList, newQuiz]);
    }

    console.log([...quizList, newQuiz]);
  };

  const handleDeleteQuiz = questionToDelete => {
    // Handle delete action
    const updatedQuizzes = quizList.filter(quiz => quiz.question !== questionToDelete);
    setQuizList(updatedQuizzes);
    setQuestion('');
    setModelAnswerFinal('');
    setSelected3([]);
    console.log(quizList);
  };

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#D8ECFF',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#D8ECFF',
      color: '#478AF5',
      fontSize: '11px',
    },
  }));

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.pdf)$/i;

    if (!allowedExtensions.exec(file.name)) {
      alert('허용되지 않는 파일 형식입니다.');
      event.target.value = ''; // input 초기화
      return;
    }

    setFileList([file]); // 하나의 파일만 받도록 설정
    setFileNameCopy([file]); // 하나의 파일만 받도록 설정
  };

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    setKey(key);
    setFileName(fileName);
  };

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <div className="tw-py-[60px] tw-pt-[50px]">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={12} sm={2} className="tw-font-bold sm:tw-text-3xl tw-text-2xl tw-text-black">
              나의 퀴즈
            </Grid>
            <Grid item xs={12} sm={6} className="tw-font-semi tw-text-base tw-text-black">
              <div>나와 학습자들의 성장을 돕기위해 내가 만든 퀴즈 리스트예요!</div>
            </Grid>
            <Grid item xs={12} sm={4} justifyContent="flex-end" className="tw-flex">
              <BootstrapTooltip title="지식콘텐츠 등록과 퀴즈만들기를 동시에 할 수 있어요!" placement="top">
                <button
                  type="button"
                  onClick={() => handleAddClick(false)}
                  className=" tw-text-[#e11837] tw-mr-3 tw-font-bold tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                  style={{ border: '1px solid #B8B8B8', color: '#e11837', width: '150px' }}
                >
                  + 퀴즈 만들기
                </button>
              </BootstrapTooltip>
              <BootstrapTooltip title="지식콘텐츠만 미리 등록해 놓고, 나중에 활용할 수 있어요!" placement="top">
                <button
                  type="button"
                  onClick={() => handleAddClick(true)}
                  style={{ border: '1px solid #B8B8B8', color: 'black', width: '150px' }}
                  className="tw-text-black tw-bg-white tw-font-bold tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                >
                  +지식컨텐츠 등록
                </button>
              </BootstrapTooltip>
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

        {/* 퀴즈목록에 해당하는 div */}
        {activeTab === '퀴즈목록' && (
          <div>
            <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6 tw-mb-8">
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                  정렬 :
                </p>

                <RadioGroup value={quizSortType} onChange={handleChangeQuiz} row>
                  <FormControlLabel
                    value="0001"
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
                    value="0002"
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
                    value="0003"
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
                    value="0004"
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
                    value="0005"
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

            {myQuizData?.contents?.length > 0 ? (
              myQuizData.contents.map((data, index) => (
                <div key={index}>
                  <KnowledgeComponent data={data} refetchMyQuiz={refetchMyQuiz} refetchMyQuizThresh={() => {}} />
                </div>
              ))
            ) : (
              <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[20vh]')}>
                <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">데이터가 없습니다.</p>
              </div>
            )}

            <div className="tw-mt-10">
              <Pagination page={page} setPage={setPage} total={totalPage} />
            </div>
          </div>
        )}

        {/* 퀴즈목록에 해당하는 div */}
        {activeTab === '휴지통' && (
          <div>
            <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6 tw-mb-8">
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                  정렬 :
                </p>

                <RadioGroup value={threshSortType} onChange={handleChangeThresh} row>
                  <FormControlLabel
                    value="0001"
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
                    value="0002"
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
                </RadioGroup>
              </div>
            </div>
            {myQuizThreshData?.contents?.length > 0 ? (
              <div>
                {myQuizThreshData?.contents?.map((data, index) => (
                  <div key={index}>
                    <KnowledgeComponent
                      data={data}
                      thresh={true}
                      refetchMyQuiz={refetchMyQuiz}
                      refetchMyQuizThresh={refetchMyQuizThresh}
                    />
                  </div>
                ))}
                <div className="tw-mt-10">
                  <Pagination page={pageThresh} setPage={setPageThresh} total={totalPageThresh} />
                </div>
              </div>
            ) : (
              <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[20vh]')}>
                <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">데이터가 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* 휴지통에 해당하는 div */}
        {activeTab === '지식컨텐츠' && (
          <div>
            <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6 tw-mb-8">
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                  정렬 :
                </p>

                <RadioGroup value={sortType} onChange={handleChangeSortType} row>
                  <FormControlLabel
                    value="DESC"
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
                    value="ASC"
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
                </RadioGroup>
              </div>
            </div>
            {/* 지식컨텐츠 */}
            <div>
              {myQuizContentData?.contents.length > 0 ? (
                myQuizContentData?.contents.map((data, index) => (
                  <div key={index}>
                    <ArticleList data={data} refetchMyQuizContent={refetchMyQuizContent} />
                  </div>
                ))
              ) : (
                <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[20vh]')}>
                  <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">데이터가 없습니다.</p>
                </div>
              )}
            </div>

            <div className="tw-mt-10">
              <Pagination page={quizPage} setPage={setQuizPage} total={totalQuizPage} />
            </div>
          </div>
        )}
      </div>

      <MentorsModal
        isQuiz={true}
        // title={'퀴즈 만들기'}
        title={isContentModalOpen ? '지식컨텐츠 만들기' : '퀴즈 만들기'}
        isOpen={isModalOpen}
        isContentModalClick={isContentModalClick}
        onAfterClose={() => {
          setIsModalOpen(false);
          setIsContentModalClick(false);
          setActive('');
          setContentType('');
          setContentUrl('');
          setContentTitle('');
          setFileList([]);
          setQuizList([]);
          setSortQuizType('ASC');
          setFileName('');
          setFileNameCopy([]);
          setQuizCount(1);
          setPage(1);
        }}
      >
        <div className={`${isContentModalClick ? 'tw-flex' : ' '}`}>
          <div className="">
            <Accordion disableGutters sx={{ backgroundColor: '#e9ecf2' }} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="tw-flex tw-justify-between tw-items-center tw-w-full">
                  <div className="tw-text-lg tw-font-bold">지식컨텐츠 정보 입력</div>
                  {!isContentModalOpen && (
                    <button
                      onClick={e => {
                        if (isContentModalClick) {
                          console.log('지식컨텐츠 닫기');
                          e.stopPropagation(); // This stops the event from propagating to the AccordionSummary
                          setIsContentModalClick(false);
                          setActive('');
                          setContentType('');
                          setContentUrl('');
                          setContentTitle('');
                          setFileList([]);
                          setQuizList([]);
                          setSortQuizType('ASC');
                          setFileName('');
                          setFileNameCopy('');
                          setJobLevel([]);
                          setSelected1([]);
                          setSelected2([]);
                          setSelectedSubject('');
                          setSelectedChapter('');
                          setPersonName([]);
                          setUniversityCode('');
                          setJobs([]);
                          setContentSortType('');
                        } else {
                          e.stopPropagation(); // This stops the event from propagating to the AccordionSummary
                          setIsContentModalClick(true);
                        }
                      }}
                      className="tw-text-sm tw-bg-black tw-p-2 tw-rounded tw-mr-5 tw-text-white"
                    >
                      {isContentModalClick ? '지식컨텐츠 닫기' : '지식컨텐츠 불러오기'}
                    </button>
                  )}
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                <div className="tw-text-sm tw-font-bold tw-py-2">지식컨텐츠 유형</div>
                <div className={cx('mentoring-button__group', 'tw-px-0', 'tw-justify-center', 'tw-items-center')}>
                  {studyStatus.map((item, i) => (
                    <Toggle
                      key={item.id}
                      label={item.name}
                      name={item.name}
                      value={item.id}
                      variant="small"
                      disabled={isContentModalClick}
                      checked={active === item.id}
                      isActive
                      type="tabButton"
                      onChange={() => {
                        setActive(item.id);
                        setContentType(item.id);
                      }}
                      className={cx('tw-mr-2 !tw-w-[90px]')}
                    />
                  ))}
                </div>
                {active === '0320' ? (
                  <div>
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">파일 업로드</div>
                    <div className="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-text-center">
                      <div className="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-text-center">
                        <div
                          className="tw-cursor-pointer tw-underline"
                          onClick={() => {
                            onFileDownload(contentUrl, fileName);
                          }}
                        >
                          {!isContentModalClick ? (
                            <div>
                              {fileList.length > 0 ? (
                                <div>
                                  {fileList.map((file, index) => (
                                    <div key={index}>{file.name}</div>
                                  ))}
                                </div>
                              ) : (
                                <div>파일을 추가해주세요. (pdf)</div>
                              )}
                            </div>
                          ) : (
                            <div>{fileNameCopy || '파일정보가 없습니다.'}</div>
                          )}
                        </div>
                      </div>
                      {!isContentModalClick && (
                        <div className="tw-flex tw-items-center tw-gap-2 border tw-px-4 tw-py-2 tw-rounded">
                          <svg
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 absolute left-0 top-0.5"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <g clipPath="url(#clip0_679_9101)">
                              <path
                                d="M2.61042 6.86336C2.55955 6.9152 2.49887 6.95638 2.4319 6.98449C2.36494 7.01259 2.29304 7.02707 2.22042 7.02707C2.14779 7.02707 2.0759 7.01259 2.00894 6.98449C1.94197 6.95638 1.88128 6.9152 1.83042 6.86336C1.72689 6.75804 1.66887 6.61625 1.66887 6.46856C1.66887 6.32087 1.72689 6.17909 1.83042 6.07376L6.65522 1.20016C7.74322 0.355364 8.83762 -0.050236 9.92722 0.00496403C11.3 0.075364 12.3688 0.598564 13.276 1.45696C14.2008 2.33216 14.7992 3.58096 14.7992 5.09456C14.7992 6.25616 14.4616 7.27856 13.7488 8.18576L6.94642 15.1938C6.25842 15.7578 5.49362 16.0306 4.67442 15.9978C3.63442 15.9546 2.86082 15.6186 2.28562 15.0498C1.61202 14.385 1.19922 13.5682 1.19922 12.4698C1.19922 11.5962 1.50082 10.7898 2.12322 10.033L8.11042 3.92016C8.59042 3.40816 9.06002 3.10416 9.54002 3.03056C9.86039 2.9801 10.1883 3.00876 10.495 3.11403C10.8018 3.21931 11.0781 3.39801 11.3 3.63456C11.7256 4.08496 11.908 4.64656 11.844 5.28576C11.8 5.72176 11.6216 6.12336 11.2936 6.50816L5.78962 12.1466C5.73909 12.1986 5.6787 12.24 5.61198 12.2685C5.54527 12.2969 5.47355 12.3118 5.40102 12.3123C5.3285 12.3127 5.25661 12.2987 5.18954 12.2711C5.12248 12.2435 5.06159 12.2028 5.01042 12.1514C4.90625 12.0467 4.84737 11.9052 4.84647 11.7575C4.84557 11.6099 4.90273 11.4677 5.00562 11.3618L10.4832 5.75216C10.6432 5.56416 10.7272 5.37456 10.7472 5.17296C10.7792 4.85296 10.7024 4.61696 10.5032 4.40656C10.4026 4.29881 10.2769 4.21759 10.1374 4.17014C9.99779 4.12268 9.84865 4.11046 9.70322 4.13456C9.50882 4.16416 9.23682 4.34096 8.90162 4.69776L2.93922 10.7834C2.50962 11.3074 2.30162 11.8634 2.30162 12.4706C2.30162 13.2338 2.57762 13.7802 3.05522 14.2514C3.43522 14.6274 3.95122 14.8514 4.71922 14.8834C5.26322 14.905 5.76722 14.725 6.20562 14.3698L12.9232 7.44976C13.4392 6.78816 13.6968 6.00976 13.6968 5.09536C13.6968 3.90976 13.2352 2.94816 12.5224 2.27296C11.7944 1.58336 10.9624 1.17696 9.87202 1.12096C9.06562 1.07936 8.22002 1.39296 7.37842 2.03776L2.61042 6.86336Z"
                                fill="#31343D"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_679_9101">
                                <rect width={16} height={16} fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <button className=" tw-text-sm tw-text-left tw-text-[#31343d]" onClick={handleButtonClick}>
                            파일추가
                          </button>
                          <input
                            accept=".pdf"
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 URL</div>
                    <TextField
                      required
                      disabled={isContentModalClick}
                      value={contentUrl}
                      onChange={handleContentUrlChange}
                      id="username"
                      name="username"
                      variant="outlined"
                      type="search"
                      size="small"
                      fullWidth
                      sx={{
                        '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                      }}
                    />
                  </div>
                )}
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 제목</div>
                <TextField
                  required
                  id="username"
                  disabled={isContentModalClick}
                  value={contentTitle}
                  onChange={handleContentTitleChange}
                  name="username"
                  variant="outlined"
                  type="search"
                  size="small"
                  fullWidth
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                  }}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion disableGutters defaultExpanded sx={{ backgroundColor: '#e9ecf2' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="tw-text-lg tw-font-bold">지식컨텐츠 태깅</div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                <div className="tw-text-sm tw-font-bold tw-py-2">추천 대학</div>
                <select
                  className="form-select"
                  onChange={handleUniversityChange}
                  aria-label="Default select example"
                  disabled={isContentModalClick}
                  value={universityCode}
                >
                  <option>대학을 선택해주세요.</option>
                  {optionsData?.data?.jobs?.map((university, index) => (
                    <option key={index} value={university.code}>
                      {university.name}
                    </option>
                  ))}
                </select>
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">추천 학과</div>
                <FormControl sx={{ width: '100%' }} size="small">
                  <Select
                    className="tw-w-full tw-text-black"
                    size="small"
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    displayEmpty
                    renderValue={selected => {
                      if (selected.length === 0) {
                        return <span style={{ color: 'gray' }}>추천 대학을 먼저 선택하고, 학과를 선택해주세요.</span>;
                      }
                      return selected.join(', ');
                    }}
                    disabled={jobs.length === 0 || isContentModalClick}
                    value={personName}
                    onChange={handleChange}
                    MenuProps={{
                      disableScrollLock: true,
                    }}
                  >
                    {jobs.map((job, index) => (
                      <MenuItem key={index} value={job.name}>
                        <Checkbox checked={personName.indexOf(job.name) > -1} />
                        <ListItemText primary={job.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">추천 학년</div>
                {optionsData?.data?.jobLevels?.map((item, i) => (
                  <Toggle
                    key={item.code}
                    label={item.name}
                    name={item.name}
                    disabled={isContentModalClick}
                    value={item.code}
                    variant="small"
                    // checked={activeQuiz === item.code}
                    checked={jobLevel.indexOf(item.code) >= 0}
                    isActive
                    type="tabButton"
                    onChange={() => {
                      const index = jobLevel.indexOf(item.code);
                      setJobLevel(prevState => newCheckItem(item.code, index, prevState));
                    }}
                    className={cx('tw-mr-3 !tw-w-[85px]')}
                  />
                ))}
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">학습 주제</div>
                <TextField
                  required
                  id="username"
                  name="username"
                  variant="outlined"
                  disabled={isContentModalClick}
                  type="search"
                  value={selectedSubject}
                  size="small"
                  onChange={handleInputSubjectChange}
                  fullWidth
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                  }}
                />
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">학습 챕터</div>
                <TextField
                  required
                  id="username"
                  name="username"
                  value={selectedChapter}
                  disabled={isContentModalClick}
                  onChange={handleInputChapterChange}
                  variant="outlined"
                  type="search"
                  size="small"
                  fullWidth
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                  }}
                />
                {isContentModalClick ? (
                  <>
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2 ">학습 키워드</div>
                    <div className="tw-flex tw-gap-2 tw-flex-wrap  tw-w-[500px]">
                      {selected1.length > 0 &&
                        selected1.map((job, index) => (
                          <div key={index} className="tw-bg-gray-400 tw-rounded-[3.5px]  tw-px-3 tw-py-1">
                            <p className="tw-text-[12.25px] tw-text-white">{job || 'N/A'}</p>
                          </div>
                        ))}
                    </div>
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">스킬</div>
                    <div className="tw-flex tw-gap-2 tw-flex-wrap">
                      {selected2.length > 0 &&
                        selected2.map((job, index) => (
                          <div key={index} className="tw-bg-gray-400  tw-rounded-[3.5px] tw-px-3 tw-py-1">
                            <p className="tw-text-[12.25px] tw-text-white">{job || 'N/A'}</p>
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">학습 키워드</div>
                    {/* <TagsInput
                      value={selected1}
                      onChange={setSelected1}
                      name="fruits"
                      placeHolder="학습 키워드 입력 후 엔터를 쳐주세요."
                    /> */}
                    <Tag value={selected1} onChange={setSelected1} placeHolder="학습 키워드 입력 후 엔터를 쳐주세요." />
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">스킬</div>
                    <Tag value={selected2} onChange={setSelected2} placeHolder="스킬 입력 후 엔터를 쳐주세요." />
                    {/* <TagsInput
                      value={selected2}
                      onChange={setSelected2}
                      name="fruits"
                      placeHolder="스킬 입력 후 엔터를 쳐주세요."
                    /> */}
                  </>
                )}
              </AccordionDetails>
            </Accordion>

            {!isContentModalOpen && (
              <Accordion defaultExpanded disableGutters sx={{ backgroundColor: '#e9ecf2' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div className="tw-text-lg tw-font-bold">퀴즈 정보 입력</div>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                  <div className="tw-flex tw-justify-start tw-items-center tw-h-12 tw-gap-6">
                    <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                      <RadioGroup value={sortQuizType} onChange={handleChangeQuizType} row>
                        <FormControlLabel
                          value="ASC"
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
                              AI자동생성
                            </p>
                          }
                        />
                        <FormControlLabel
                          value="DESC"
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
                              수동생성
                            </p>
                          }
                        />
                      </RadioGroup>
                    </div>
                  </div>

                  {sortQuizType === 'DESC' && (
                    <>
                      <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">퀴즈</div>
                      <TextField
                        required
                        id="username"
                        name="username"
                        variant="outlined"
                        type="search"
                        value={question}
                        size="small"
                        onChange={handleQuestionChange}
                        fullWidth
                        sx={{
                          '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                        }}
                      />
                      <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">모범답안</div>
                      <TextField
                        required
                        id="username"
                        name="username"
                        value={modelAnswerFinal}
                        onChange={handleModelAnswerChange}
                        variant="outlined"
                        type="search"
                        size="small"
                        fullWidth
                        sx={{
                          '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                        }}
                      />
                      <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">채점기준 주요 키워드/문구</div>
                      {/* <TagsInput
                        value={selected3}
                        onChange={selected3}
                        name="fruits"
                        placeHolder="주요 키워드/문구 입력 후 엔터를 쳐주세요."
                      /> */}
                      <Tag
                        value={selected3}
                        onChange={setSelected3}
                        placeHolder="주요 키워드/문구 입력 후 엔터를 쳐주세요."
                      />
                      <div className="tw-text-right tw-mt-5">
                        <button
                          onClick={handleQuizClick}
                          className="tw-px-5 tw-py-3 tw-text-sm tw-bg-black tw-rounded tw-text-white"
                        >
                          {isModify ? '수정하기' : '퀴즈 생성하기'}
                        </button>
                      </div>
                    </>
                  )}

                  {sortQuizType === 'ASC' && (
                    <>
                      <div className="tw-text-sm tw-font-bold tw-mt-4">생성할 퀴즈 개수</div>
                      <div className="tw-grid tw-grid-cols-6 tw-items-center">
                        <div className="tw-col-span-5 tw-mr-5">
                          <TextField
                            required
                            id="username"
                            name="username"
                            value={quizCount}
                            onChange={handleQuizCountChange}
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
                        <button
                          disabled={isLoading} // 로딩 중일 때 버튼 비활성화
                          onClick={handleAIQuizClick}
                          className="tw-mt-1 tw-col-span-1 tw-px-2 tw-py-2.5 tw-text-sm tw-bg-black tw-rounded-md tw-text-white"
                        >
                          {isLoading ? <CircularProgress size={20} /> : '퀴즈 생성'}
                        </button>
                      </div>
                    </>
                  )}
                  {quizList.map((quiz, index) => (
                    <div key={index}>
                      <AIQuizList
                        fileList={fileList}
                        jobLevel={jobLevel}
                        contentType={contentType}
                        contentUrl={contentUrl}
                        selectedJob={selectedJob}
                        isContentModalClick={isContentModalClick}
                        contentSequence={contentSequence}
                        quiz={quiz}
                        index={index}
                        sortQuizType={sortQuizType}
                        handleDeleteQuiz={handleDeleteQuiz}
                        handleEditQuiz={handleEditQuiz}
                        updateQuizList={updateQuizList}
                      />
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            )}

            <div className="tw-py-5 tw-text-center">
              <div className="tw-text-right">
                <button
                  onClick={handleQuizInsertClick}
                  className="tw-text-white tw-text-sm tw-px-7 tw-py-3 tw-text-base tw-bg-[#CA001f] tw-rounded-md"
                >
                  등록하기
                </button>
              </div>
            </div>
          </div>
          {isContentModalClick && (
            <div className="tw-flex-1 tw-p-5 tw-pr-0 tw-ml-5 tw-w-full">
              <div className="tw-text-lg tw-font-bold tw-mb-5 tw-text-black">템플릿 불러오기</div>
              <FormControl fullWidth>
                <RadioGroup
                  aria-labelledby=""
                  defaultValue=""
                  name="radio-buttons-group"
                  value={contentSortType}
                  onChange={handleChangeContent}
                >
                  {myQuizContentData?.contents?.map((data, index) => (
                    <FormControlLabel
                      sx={{ marginLeft: 0, marginRight: 0 }}
                      key={index}
                      className="border tw-p-2 tw-mb-2 tw-rounded-lg"
                      style={{ width: '100%' }}
                      value={data.contentSequence}
                      control={<Radio />}
                      label={data.description}
                      onClick={() => {
                        handleClickContent(data);
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <div className="tw-mt-5">
                <Pagination page={quizPage} setPage={setQuizPage} showCount={5} total={totalQuizPage} />
              </div>
            </div>
          )}
        </div>
      </MentorsModal>
    </div>
  );
}

export default QuizMakeTemplate;
