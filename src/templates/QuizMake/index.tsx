import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Chip, MentorsModal, AIQuizList } from 'src/stories/components';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import SearchIcon from '@mui/icons-material/Search';
import { UseQueryResult } from 'react-query';
import { useMyQuiz, useMyQuizContents } from 'src/services/jobs/jobs.queries';
import { useQuizSave, useAIQuizSave, useAIQuizAnswer, useQuizContentSave } from 'src/services/quiz/quiz.mutations';
import { useDeletePost } from 'src/services/community/community.mutations';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { makeStyles } from '@material-ui/core';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Checkbox from '@mui/material/Checkbox';
import KnowledgeComponent from 'src/stories/components/KnowledgeComponent';
import ArticleList from 'src/stories/components/ArticleList';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TagsInput } from 'react-tag-input-component';
import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { useOptions } from 'src/services/experiences/experiences.queries';
import CircularProgress from '@mui/material/CircularProgress';

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { set } from 'lodash';

const studyStatus = [
  {
    id: '0100',
    name: '아티클',
  },
  {
    id: '0200',
    name: '영상',
  },
  {
    id: '0300',
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

  // const { contentTypes, setContentTypes } = useStore();

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState<boolean>(false);
  const [isContentModalClick, setIsContentModalClick] = useState<boolean>(false);
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [jobGroup, setJobGroup] = useState([]);
  const [active, setActive] = useState('0100');
  const [activeQuiz, setActiveQuiz] = useState('0001');
  const [contentType, setContentType] = useState('0100');
  const [jobGroups, setJobGroups] = useState<any[]>([]);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [quizPage, setQuizPage] = useState(1);
  const [totalQuizPage, setTotalQuizPage] = useState(1);
  const [params, setParams] = useState<any>({ page, quizSortType: '0001' });
  const [quizParams, setQuizParams] = useState<any>({ quizPage, sortType: 'DESC' });
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [quizUrl, setQuizUrl] = React.useState('');
  const [quizName, setQuizName] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<any[]>([]);
  const [selected, setSelected] = useState([]);
  const open = Boolean(anchorEl);
  const [keyWorld, setKeyWorld] = useState('');
  const [removeIndex, setRemoveIndex] = React.useState('');

  const [expanded, setExpanded] = useState(0); // 현재 확장된 Accordion의 인덱스
  const [isModify, setIsModify] = useState(false);

  const [selected1, setSelected1] = useState([]);
  const [selected2, setSelected2] = useState([]);
  const [selected3, setSelected3] = useState([]);
  const [quizCount, setQuizCount] = useState('0');
  const [aiQuiz, setAiQuiz] = useState(false);
  const [quizSortType, setQuizSortType] = useState('0001');
  const [contentSortType, setContentSortType] = useState('');
  const [sortType, setSortType] = useState('DESC');

  const [universityCode, setUniversityCode] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [selectedJobName, setSelectedJobName] = useState('');
  const [selectedJob, setSelectedJob] = useState('');

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [jobLevel, setJobLevel] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [sortQuizType, setSortQuizType] = useState('ASC');
  const [question, setQuestion] = useState('');
  const [modelAnswerFinal, setModelAnswerFinal] = useState('');
  const [quizList, setQuizList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // 로딩 상태를 관리하기 위해 useState 훅 사용
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState({});
  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log(quizList);
  }, [quizList]);

  const handleChangeQuiz = event => {
    setQuizSortType(event.target.value);
  };

  const handleChangeContent = event => {
    console.log(event.target.value);
    setContentSortType(event.target.value);
  };

  const handleClickContent = data => {
    console.log(data);
    setContentType(data.contentType);
    setContentUrl(data.url);
    setContentTitle(data.description);
    setContentTitle(data.description);
    setSelectedSubject(data.subject);
    setSelectedChapter(data.chapter);
    setJobLevel(data.jobLevels && data.jobLevels.length > 0 ? data.jobLevels[0].code : []);

    setUniversityCode(data.jobGroups[0].code);

    const selected = optionsData?.data?.jobs?.find(u => u.code === data.jobGroups[0].code);
    setJobs(selected ? selected.jobs : []);
    setSelectedJob(selected?.jobs[0]?.code || '');
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
      setTotalPage(data.totalPages);
    },
  );
  const { isFetched: isOptionFetched, data: optionsData }: UseQueryResult<any> = useOptions();

  //quiz delete
  const { mutate: onQuizSave, isSuccess: postSuccess } = useQuizSave();
  const { mutate: onQuizContentSave, isSuccess: postContentSuccess } = useQuizContentSave();
  const { mutate: onAIQuizSave, isSuccess: updateSuccess, isError: updateError, data: aiQuizData } = useAIQuizSave();
  const { mutate: onAIQuizAnswer, isSuccess: answerSuccess, data: aiQuizAnswerData } = useAIQuizAnswer();

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
    //console.log('delete 1 !!!', params, page);

    setContentTitle('');
    // setContentUrl('');
    setSelectedSubject('');
    setSelectedChapter('');
    setSelected1([]);
    setSelected2([]);
    setSelectedUniversity('');
    setSelectedJob('');
    setJobLevel('');
    setQuizList([]);

    refetchMyQuiz();
    refetchMyQuizContent();
  }, [postSuccess, postContentSuccess]);

  // const { isFetched: isContentTypeFetched } = useContentTypes(data => {
  //   setContentTypes(data.data.contents || []);
  //   const contentsType = data.length >= 0 && data[0].id;
  //   // setParams({
  //   //   ...params,
  //   //   contentsType,
  //   // });
  // });

  // const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
  //   setContentJobType(data.data.contents || []);
  // });

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
    setSelectedJob('');
    setActiveQuiz(optionsData?.data?.jobLevels[0].code);
    setJobLevel(optionsData?.data?.jobLevels[0].code);
    setSelectedSubject('');
    setSelectedChapter('');
    setSelected1([]);
    setSelected2([]);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setParams({
      page,
      keyword: keyWorld,
      quizSortType: quizSortType,
    });
  }, [page, keyWorld, quizSortType]);

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

  const handleAIAnswerClick = async (quizIndex, quiz) => {
    if (!contentUrl) {
      alert('지식컨텐츠 URL을 입력하세요.');
      return;
    }

    if (!selectedJob || selectedJob.length === 0) {
      alert('하나 이상의 학과를 선택하세요.');
      return;
    }

    // Find the specific quiz in quizList and create formattedQuizList
    const formattedQuizList = quizList
      .filter(q => q.question === quiz)
      .map((q, index) => ({
        no: index + 1,
        question: q.question,
      }));

    const params = {
      contentType: contentType,
      contentUrl: contentUrl,
      job: selectedJob,
      quizzes: formattedQuizList,
    };

    console.log('ai quiz click', params);
    // setIsLoadingAI(true);

    setIndex(quizIndex);
    setIsLoadingAI(prevState => ({ ...prevState, [quizIndex]: true }));
    try {
      await onAIQuizAnswer(params); // Ensure this function returns a promise
    } catch (error) {
      console.error('Error generating AI answer:', error);
    } finally {
      console.log('!!!!!!!!!!!!!!!!!!!');
      setIsLoadingAI(prevState => ({ ...prevState, [quizIndex]: false }));
    }
  };

  const handleAIQuizClick = () => {
    console.log('ai quiz click');
    // 유효성 검사
    if (!quizSortType) {
      alert('퀴즈 유형을 선택하세요.');
      return;
    }

    if (!contentUrl) {
      alert('콘텐츠 URL을 입력하세요.');
      return;
    }

    if (!selectedUniversity || selectedUniversity.length === 0) {
      alert('하나 이상의 대학을 선택하세요.');
      return;
    }

    if (!selectedJob || selectedJob.length === 0) {
      alert('하나 이상의 학과를 선택하세요.');
      return;
    }

    if (!quizCount) {
      alert('퀴즈 수를 입력하세요.');
      return;
    }

    console.log('AI 퀴즈 클릭');
    const formData = new FormData();
    formData.append('contentType', contentType);
    formData.append('contentUrl', contentUrl);
    formData.append('jobGroups', selectedUniversity);
    formData.append('jobs', selectedJob);
    formData.append('quizCount', quizCount);

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
    if (!contentUrl) {
      alert('콘텐츠 URL을 입력해주세요.');
      return false;
    }
    if (!selectedSubject) {
      alert('선택된 과목을 입력해주세요.');
      return false;
    }
    if (!selectedChapter) {
      alert('선택된 챕터를 입력해주세요.');
      return false;
    }
    if (!selected1.length) {
      alert('선택된 기술을 입력해주세요.');
      return false;
    }
    if (!selected2.length) {
      alert('선택된 키워드를 입력해주세요.');
      return false;
    }
    if (!selectedUniversity) {
      alert('선택된 대학교를 입력해주세요.');
      return false;
    }
    if (!selectedJob) {
      alert('선택된 직업을 입력해주세요.');
      return false;
    }
    if (!jobLevel) {
      alert('직업 레벨을 입력해주세요.');
      return false;
    }
    if (!isContentModalOpen) {
      console.log('content modal');
      const params = {
        contentType: contentType,
        description: contentTitle,
        url: contentUrl,
        studySubject: selectedSubject,
        studyChapter: selectedChapter,
        skills: selected1,
        jobGroups: [selectedUniversity],
        jobs: [selectedJob],
        jobLevels: [jobLevel],
        studyKeywords: selected2,
      };
      onQuizContentSave(params);
      setActiveTab('지식컨텐츠');
    } else {
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
          isNew: true,
          // contentType: contentType,
          description: contentTitle,
          url: contentUrl,
          studySubject: selectedSubject,
          studyChapter: selectedChapter,
          skills: selected1,
          jobGroups: [selectedUniversity],
          jobs: [selectedJob],
          jobLevels: [jobLevel],
          studyKeywords: selected2,
        },
        quizzes: updatedQuizList,
      };

      console.log(params);
      onQuizSave(params);
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
    setSelectedJob(''); // Clear the selected job when university changes
  };

  const handleJobChange = e => {
    setSelectedJob(e.target.value);
    const selectedCode = e.target.value;
    const selected = jobs?.find(u => u.code === selectedCode);
    setSelectedJobName(selected ? selected.name : '');
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
    setQuizCount('0');
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
    console.log(quizList);
    // Handle delete action
    const updatedQuizzes = quizList.filter(quiz => quiz.question !== questionToDelete);
    setQuizList(updatedQuizzes);
    setQuestion('');
    setModelAnswerFinal('');
    setSelected3([]);
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
                  onClick={() => handleAddClick(true)}
                  className=" tw-text-[#e11837] tw-mr-3 tw-font-bold tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                  style={{ border: '1px solid', color: '#e11837', width: '150px' }}
                >
                  + 퀴즈 만들기
                </button>
                <button
                  type="button"
                  onClick={() => handleAddClick(false)}
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

              {myQuizData?.contents?.map((data, index) => (
                <div key={index}>
                  <KnowledgeComponent data={data} refetchMyQuiz={refetchMyQuiz} />
                </div>
              ))}

              <div className="tw-mt-10">
                <Pagination page={page} setPage={setPage} total={totalPage} />
              </div>
            </div>
          )}

          {/* 퀴즈목록에 해당하는 div */}
          {activeTab === '휴지통' && (
            <div className={cx('container, tw-h-[50vh] tw-text-center')}>데이터가 없습니다.</div>
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
              {myQuizContentData?.contents?.map((data, index) => (
                <div key={index}>
                  <ArticleList data={data} refetchMyQuizContent={refetchMyQuizContent} />
                </div>
              ))}
              <div className="tw-mt-10">
                <Pagination page={quizPage} setPage={setQuizPage} total={totalQuizPage} />
              </div>
            </div>
          )}
        </div>

        <MentorsModal
          isQuiz={true}
          title={'퀴즈 만들기'}
          isOpen={isModalOpen}
          isContentModalClick={isContentModalClick}
          onAfterClose={() => {
            setIsModalOpen(false);
            setIsContentModalClick(false);
          }}
        >
          <div className={`${isContentModalClick ? 'tw-flex' : ' '}`}>
            <div className="">
              <Accordion
                disableGutters
                sx={{ backgroundColor: '#e9ecf2' }}
                defaultExpanded
                // expanded={expanded === 0}
                // onChange={handleChange(0)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div className="tw-flex tw-justify-between tw-items-center tw-w-full">
                    <div className="tw-text-lg tw-font-bold">지식컨텐츠 정보 입력</div>
                    {!isContentModalOpen && (
                      <button
                        onClick={e => {
                          e.stopPropagation(); // This stops the event from propagating to the AccordionSummary
                          setIsContentModalClick(true);
                        }}
                        className="tw-text-sm tw-bg-black tw-p-2 tw-rounded tw-mr-5 tw-text-white"
                      >
                        지식컨텐츠 불러오기
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

                  <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 URL</div>
                  <TextField
                    required
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
                  <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 제목</div>
                  <TextField
                    required
                    id="username"
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
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    disabled={jobs.length === 0}
                    onChange={handleJobChange}
                    value={selectedJob}
                  >
                    <option disabled value="">
                      학과를 선택해주세요.
                    </option>
                    {jobs.map((job, index) => (
                      <option key={index} value={job.code}>
                        {job.name}
                      </option>
                    ))}
                  </select>

                  <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">추천 학년</div>
                  {optionsData?.data?.jobLevels?.map((item, i) => (
                    <Toggle
                      key={item.code}
                      label={item.name}
                      name={item.name}
                      value={item.code}
                      variant="small"
                      checked={activeQuiz === item.code}
                      isActive
                      type="tabButton"
                      onChange={() => {
                        setActiveQuiz(item.code);
                        console.log(item);
                        setJobLevel(item.code);
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
                    onChange={handleInputChapterChange}
                    variant="outlined"
                    type="search"
                    size="small"
                    fullWidth
                    sx={{
                      '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    }}
                  />
                  <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">학습 키워드</div>
                  <TagsInput
                    value={selected1}
                    onChange={setSelected1}
                    name="fruits"
                    placeHolder="학습 키워드 입력 후 엔터를 쳐주세요."
                  />
                  <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">스킬</div>
                  <TagsInput
                    value={selected2}
                    onChange={setSelected2}
                    name="fruits"
                    placeHolder="스킬 입력 후 엔터를 쳐주세요."
                  />
                </AccordionDetails>
              </Accordion>

              {isContentModalOpen && (
                <Accordion defaultExpanded disableGutters sx={{ backgroundColor: '#e9ecf2' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="tw-text-lg tw-font-bold">퀴즈 정보 입력</div>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                    <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6">
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
                        <TagsInput
                          value={selected3}
                          onChange={setSelected3}
                          name="fruits"
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
                            {' '}
                            {/* Added col-span-4 */}
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
                            {isLoading ? <CircularProgress size={20} /> : '퀴즈 생성하기'}
                          </button>
                        </div>
                      </>
                    )}

                    {quizList.map((quiz, index) => (
                      <div key={index}>
                        <AIQuizList
                          contentType={contentType}
                          contentUrl={contentUrl}
                          selectedJob={selectedJob}
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
                    className="tw-text-white tw-text-sm tw-px-10 tw-py-3 tw-text-base tw-bg-red-500 tw-rounded-md hover:tw-bg-gray-400"
                  >
                    지식컨텐츠 저장
                  </button>
                </div>
              </div>
            </div>
            {isContentModalClick && (
              <div className="tw-flex-1 tw-p-5 tw-ml-5 tw-w-full">
                <div className="tw-text-lg tw-font-bold tw-mb-5 tw-text-black">템플릿 불러오기</div>
                <FormControl>
                  <RadioGroup
                    aria-labelledby=""
                    defaultValue=""
                    name="radio-buttons-group"
                    value={contentSortType}
                    onChange={handleChangeContent}
                  >
                    {myQuizContentData?.contents?.map((data, index) => (
                      <FormControlLabel
                        key={index}
                        className="tw-w-full border tw-p-2 tw-mb-2 tw-rounded-lg"
                        style={{ width: '330px' }}
                        value={data.contentSequence}
                        control={<Radio />}
                        label={data.description}
                        onClick={() => {
                          console.log(data);
                          handleClickContent(data);
                          // setContentSortType(data.contentSequence);
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                <div className="tw-mt-5">
                  <Pagination page={quizPage} setPage={setQuizPage} total={totalQuizPage} />
                </div>
              </div>
            )}
          </div>
        </MentorsModal>
      </div>
    </>
  );
}

export default QuizMakeTemplate;
