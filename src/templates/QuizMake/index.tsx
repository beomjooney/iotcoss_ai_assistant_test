import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, MentorsModal, AIQuizList, Tag } from 'src/stories/components';
import React, { useEffect, useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import SearchIcon from '@mui/icons-material/Search';
import { UseQueryResult } from 'react-query';
import { useMyQuiz, useMyQuizContents, useMyQuizThresh } from 'src/services/jobs/jobs.queries';
import {
  useQuizSave,
  useAIQuizSave,
  useAIQuizAnswer,
  useQuizContentSave,
  useQuizExcelSave,
  useQuizAiExcelSave,
  useContentExcelSave,
  useContentFileSave,
  useContentQuizAiExcelSave,
} from 'src/services/quiz/quiz.mutations';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import KnowledgeComponent from 'src/stories/components/KnowledgeComponent';
import ArticleList from 'src/stories/components/ArticleList';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { useOptions } from 'src/services/experiences/experiences.queries';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import validator from 'validator';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useQuizKnowledgeDownload } from 'src/services/quiz/quiz.queries';
import { v4 as uuidv4 } from 'uuid';
import { useSessionStore } from 'src/store/session';
import { useGetGroupLabel } from 'src/hooks/useGetGroupLabel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export const generateUUID = () => {
  return uuidv4();
};

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
  const { jobGroupLabelType } = useSessionStore.getState();
  const { groupLabel, subGroupLabel } = useGetGroupLabel(jobGroupLabelType);

  const [isMounted, setIsMounted] = useState(false); // Need this for the react-tooltip
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalExcelOpen, setIsModalExcelOpen] = useState<boolean>(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState<boolean>(false);
  const [isContentModalClick, setIsContentModalClick] = useState<boolean>(false);
  const [isFileOpen, setIsFileOpen] = useState<boolean>(false);
  const [isAIExcelOpen, setIsAIExcelOpen] = useState<boolean>(false);
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
  const [contents, setContents] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<any[]>([]);
  const [selected, setSelected] = useState([]);
  const [keyWorld, setKeyWorld] = useState('');
  const [keyWorldKnowledge, setKeyWorldKnowledge] = useState('');
  const [contentSequence, setContentSequence] = useState('');
  const [expanded, setExpanded] = useState(0); // 현재 확장된 Accordion의 인덱스
  const [isModify, setIsModify] = useState(false);
  const [selected1, setSelected1] = useState([]);
  const [selected2, setSelected2] = useState([]);
  const [selected3, setSelected3] = useState([]);
  const [quizCount, setQuizCount] = useState(1);
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
  const [fileCount, setFileCount] = useState(1);
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
  const [fileListKnowledge, setFileListKnowledge] = useState([]);
  const [fileNameCopyKnowledge, setFileNameCopyKnowledge] = useState([]);
  const [fileName, setFileName] = useState('');
  const [fileNameCopy, setFileNameCopy] = useState([]);
  const [key, setKey] = useState('');
  const [selectedOption, setSelectedOption] = useState('false');
  const [selectedOptionFile, setSelectedOptionFile] = useState('false');
  const [contentQuizAIExcelSuccessFlag, setContentQuizAIExcelSuccessFlag] = useState(false);
  const [contentQuizAIExcelSuccessLoading, setContentQuizAIExcelSuccessLoading] = useState(false);
  const [contentFileSuccessFlag, setContentFileSuccessFlag] = useState(false);
  const [contentFileSuccessLoading, setContentFileSuccessLoading] = useState(false);
  const [knowledgeFileName, setKnowledgeFileName] = useState('');
  const [knowledgeFile, setKnowledgeFile] = useState([]);
  const [knowledgeQuizFileName, setKnowledgeQuizFileName] = useState('');
  const [knowledgeQuizFile, setKnowledgeQuizFile] = useState([]);
  const [knowledgeQuizAIFileName, setKnowledgeQuizAIFileName] = useState('');
  const [knowledgeQuizAIFile, setKnowledgeQuizAIFile] = useState([]);
  const [excelSuccessFlag, setExcelSuccessFlag] = useState(false);
  const [quizExcelSuccessFlag, setQuizExcelSuccessFlag] = useState(false);
  const [quizAIExcelSuccessFlag, setQuizAIExcelSuccessFlag] = useState(false);
  const [excelSuccessLoading, setExcelSuccessLoading] = useState(false);
  const [quizExcelSuccessLoading, setQuizExcelSuccessLoading] = useState(false);
  const [quizAIExcelSuccessLoading, setQuizAIExcelSuccessLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState({});
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('퀴즈목록');
  const [quizSearch, setQuizSearch] = React.useState('');

  const handleChangeOption = event => {
    console.log('test', event.target.value);
    setSelectedOption(event.target.value);
  };

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

    setSelectedJob(data.jobs.map(item => item.code) || []);
    setSelected2(data.skills);
    setFileName(data.name);
    setFileNameCopy(data.name);
    setQuizCount(1);
    setQuizList([]);
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

  //excel 업로드
  const { mutate: onExcelSave, isSuccess: excelSuccess, isError: excelError } = useContentExcelSave();
  const { mutate: onQuizExcelSave, isSuccess: quizExcelSuccess, isError: quizExcelError } = useQuizExcelSave();
  const { mutate: onQuizAIExcelSave, isSuccess: quizAIExcelSuccess, isError: quizAIExcelError } = useQuizAiExcelSave();

  //지식콘텐츠(파일) 일괄 등록 오류 처리
  const { mutate: onContentFileSave, isSuccess: contentFileSuccess, isError: contentFileError } = useContentFileSave();

  // 지식콘텐츠(파일) + 퀴즈(AI생성) 엑셀 일괄
  const {
    mutate: onContentQuizAIExcelSave,
    isSuccess: contentQuizAIExcelSuccess,
    isError: contentQuizAIExcelError,
  } = useContentQuizAiExcelSave();

  useEffect(() => {
    if (excelError) {
      setExcelSuccessLoading(false);
    }

    if (quizExcelError) {
      setQuizExcelSuccessLoading(false);
    }

    if (quizAIExcelError) {
      setQuizAIExcelSuccessLoading(false);
    }

    if (contentFileError) {
      setContentFileSuccessLoading(false);
    }

    if (contentQuizAIExcelError) {
      setContentQuizAIExcelSuccessLoading(false);
    }
  }, [excelError, quizExcelError, quizAIExcelError, contentFileError, contentQuizAIExcelError]);

  useEffect(() => {
    if (excelSuccess) {
      setExcelSuccessFlag(true);
      setKnowledgeFile([]);
      setKnowledgeFileName('');
      setExcelSuccessLoading(false);
      alert('지식콘텐츠(아티클) 엑셀 파일 업로드가 완료되었습니다.');
    }
  }, [excelSuccess]);

  useEffect(() => {
    if (quizExcelSuccess) {
      setQuizExcelSuccessFlag(true);
      setKnowledgeQuizFile([]);
      setKnowledgeQuizFileName('');
      setQuizExcelSuccessLoading(false);
      alert('지식콘텐츠(퀴즈) 엑셀 파일 업로드가 완료되었습니다.');
    }
  }, [quizExcelSuccess]);

  useEffect(() => {
    if (quizAIExcelSuccess) {
      setQuizAIExcelSuccessFlag(true);
      setKnowledgeQuizAIFile([]);
      setKnowledgeQuizAIFileName('');
      setQuizAIExcelSuccessLoading(false);
      alert('지식콘텐츠(퀴즈) + 퀴즈(AI생성) 엑셀 파일 업로드가 완료되었습니다.');
    }
  }, [quizAIExcelSuccess]);

  useEffect(() => {
    if (contentFileSuccess) {
      setContentFileSuccessFlag(true);
      setContentFileSuccessLoading(false);
      refetchMyQuiz();
      refetchMyQuizContent();
      setFileList([]);
      setFileListKnowledge([]);
      setJobLevel([]);
      setSelected1([]);
      setSelected2([]);
      setSelectedSubject('');
      setSelectedChapter('');
      setPersonName([]);
      setUniversityCode('');
      setJobs([]);
      setContentSortType('');
      alert('지식콘텐츠(파일) 일괄 등록이 완료되었습니다.');
    }
  }, [contentFileSuccess]);

  useEffect(() => {
    if (contentQuizAIExcelSuccess) {
      setContentQuizAIExcelSuccessFlag(true);
      setContentQuizAIExcelSuccessLoading(false);
      refetchMyQuiz();
      refetchMyQuizContent();
      setFileList([]);
      setFileListKnowledge([]);
      setJobLevel([]);
      setSelected1([]);
      setSelected2([]);
      setSelectedSubject('');
      setSelectedChapter('');
      setPersonName([]);
      setUniversityCode('');
      setJobs([]);
      setContentSortType('');
      alert('지식콘텐츠(파일) + 퀴즈(AI생성) 엑셀 일괄 등록이 완료되었습니다.');
    }
  }, [contentQuizAIExcelSuccess]);

  const onCloseExcelModal = () => {
    setKnowledgeFileName('');
    setKnowledgeQuizFileName('');
    setKnowledgeQuizAIFileName('');
    setKnowledgeFile([]);
    setKnowledgeQuizFile([]);
    setKnowledgeQuizAIFile([]);
    setExcelSuccessFlag(false);
    setQuizExcelSuccessFlag(false);
    setQuizAIExcelSuccessFlag(false);
    refetchMyQuiz();
    refetchMyQuizContent();
    setFileList([]);
    setFileListKnowledge([]);
    setJobLevel([]);
    setSelected1([]);
    setSelected2([]);
    setSelectedSubject('');
    setSelectedChapter('');
    setPersonName([]);
    setUniversityCode('');
    setJobs([]);
    setContentSortType('');
    setIsFileOpen(false);
    setIsAIExcelOpen(false);
  };

  //excel 다운로드
  const {
    refetch: isExcelDownloadFetcheds,
    isSuccess: isExcelDownloadSuccess,
    isError: isExcelDownloadError,
  } = useQuizKnowledgeDownload(key, data => {
    console.log('file download', data, fileName);
    if (data) {
      // blob 데이터를 파일로 저장하는 로직
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      if (key === 'content') {
        link.setAttribute('download', '지식콘텐츠_템플릿.xlsx'); // 다운로드할 파일 이름과 확장자를 설정합니다.
      } else if (key === 'quiz') {
        link.setAttribute('download', '지식콘텐츠/퀴즈_템플릿.xlsx'); // 다운로드할 파일 이름과 확장자를 설정합니다.
      } else if (key === 'quiz-ai') {
        link.setAttribute('download', '지식콘텐츠/퀴즈_AI퀴즈_템플릿.xlsx'); // 다운로드할 파일 이름과 확장자를 설정합니다.
      } else {
        link.setAttribute('download', '템플릿.xlsx'); // 다운로드할 파일 이름과 확장자를 설정합니다.
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setKey('');
      setFileName('');
    }
  });

  useEffect(() => {
    if (isExcelDownloadError) {
      alert('퀴즈 템플릿 다운로드 중 오류가 발생했습니다.');
    }
  }, [isExcelDownloadError]);

  useEffect(() => {
    if (key) {
      isExcelDownloadFetcheds();
    }
  }, [key]);

  const handleQuizAdd = () => {
    // 중복 등록 방지: 로딩 중이면 함수 실행 중단
    if (contentQuizAIExcelSuccessLoading || contentFileSuccessLoading) {
      return;
    }

    setQuizAIExcelSuccessFlag(false);
    setQuizExcelSuccessFlag(false);
    setExcelSuccessFlag(false);
    if (!knowledgeFile && !knowledgeQuizFile && !knowledgeQuizAIFile) {
      alert('엑셀 파일을 업로드해주세요.');
      return;
    }

    if (knowledgeFile.length > 0) {
      const formData = new FormData();
      formData.append('file', knowledgeFile[0]);
      setExcelSuccessLoading(true);
      onExcelSave(formData);
    }

    if (knowledgeQuizFile.length > 0) {
      const formData = new FormData();
      formData.append('file', knowledgeQuizFile[0]);
      setQuizExcelSuccessLoading(true);
      onQuizExcelSave(formData);
    }

    if (knowledgeQuizAIFile.length > 0) {
      const formData = new FormData();
      formData.append('file', knowledgeQuizAIFile[0]);
      setQuizAIExcelSuccessLoading(true);
      onQuizAIExcelSave(formData);
    }

    if (isFileOpen || isAIExcelOpen) {
      if (fileListKnowledge.length === 0) {
        alert('지식콘텐츠 파일을 업로드해주세요.');
        return false;
      }

      if (!selectedUniversity) {
        alert('추천 대학을 선택해주세요.');
        return false;
      }

      if (!selectedJob.length) {
        alert('추천 학과를 선택해주세요.');
        return false;
      }

      if (!jobLevel.length) {
        alert('추천 학년을 선택해주세요.');
        return false;
      }
    }

    if (isAIExcelOpen) {
      console.log('지식콘텐츠(파일) + 퀴즈(AI생성) 엑셀 일괄');
      const formData = new FormData();
      fileListKnowledge.forEach((file, index) => {
        formData.append('contentFiles', file);
      });
      formData.append('jobGroup', selectedUniversity);
      formData.append('job', selectedJob.join(','));
      formData.append('jobLevels', jobLevel.join(','));
      formData.append('studySubject', selectedSubject);
      formData.append('studyChapter', selectedChapter);
      formData.append('studyKeywords', selected1.join(','));
      formData.append('skills', selected2.join(','));
      formData.append('publishStatus', selectedOptionFile === 'true' ? '0001' : '0002');
      formData.append('totalQuizCount', fileCount.toString());
      console.log(formData);

      formData.forEach((value, key) => {
        console.log(key, value);
      });
      setContentQuizAIExcelSuccessLoading(true);
      onContentQuizAIExcelSave(formData);
    } else if (isFileOpen) {
      console.log('지식콘텐츠(파일) 일괄 등록');
      const formData = new FormData();
      fileListKnowledge.forEach((file, index) => {
        formData.append('contentFiles', file);
      });
      formData.append('jobGroup', selectedUniversity);
      formData.append('job', selectedJob.join(','));
      formData.append('jobLevels', jobLevel.join(','));
      formData.append('studySubject', selectedSubject);
      formData.append('studyChapter', selectedChapter);
      formData.append('studyKeywords', selected1.join(','));
      formData.append('skills', selected2.join(','));
      console.log(formData);

      formData.forEach((value, key) => {
        console.log(key, value);
      });
      setContentFileSuccessLoading(true);
      onContentFileSave(formData);
    }
  };

  const handleExcelDownload = (type: string) => {
    setKey(type);
  };

  useEffect(() => {
    if (updateError) {
      setIsLoading(false);
    }
  }, [updateError]);

  useEffect(() => {
    if (optionsData) {
      setJobLevel(optionsData?.data?.jobLevels[0]?.code);
    }
  }, [optionsData]);

  useEffect(() => {
    if (aiQuizData) {
      console.log(aiQuizData);
      if (aiQuizData?.generatedQuizzes && aiQuizData?.generatedQuizzes.length > 0) {
        const formattedQuizList = aiQuizData.generatedQuizzes.map((quiz: any) => ({
          question: quiz.question,
          modelAnswerKeywords: quiz.keywords,
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
      setIsLoadingAI(prevState => ({ ...prevState, [index]: false }));
    }
  }, [answerSuccess]);

  useDidMountEffect(() => {
    setContentTitle('');
    setSelectedSubject('');
    setSelectedChapter('');
    setSelected1([]);
    setSelected2([]);
    setSelectedUniversity('');
    setSelectedJob([]);
    setPersonName([]);
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
    // 작은 지연 추가
    window.scrollTo(0, 0);
  }, [page, keyWorld, quizSortType]);

  useEffect(() => {
    setParamsThresh({
      page: pageThresh,
      keyword: keyWorld,
      quizSortType: threshSortType,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageThresh, keyWorld, threshSortType]);

  useEffect(() => {
    setQuizParams({
      page: quizPage,
      keyword: keyWorld,
      sortType: sortType,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [quizPage, keyWorld, sortType]);

  useEffect(() => {
    setExpanded(0);
  }, [isModalOpen]);

  function searchKeyworldKnowledge(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorldKnowledge(_keyworld);
  }

  const newCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

  const handleAIQuizClick = () => {
    console.log('ai quiz click', quizCount, quizSortType);
    // 유효성 검사
    if (!contentType) {
      alert('지식콘텐츠 유형을 선택하세요.');
      return;
    }

    if (contentType !== '0320' && !contentUrl) {
      alert('콘텐츠 URL을 입력해주세요.');
      return false;
    }

    if (!selectedUniversity || selectedUniversity.length === 0) {
      alert(`추천 ${groupLabel}을 선택하세요.`);
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
    setIsLoading(true);
    onAIQuizSave(formData);
  };

  const handleQuizClick = () => {
    if (!question || !selected3) {
      alert('퀴즈 질문,  키워드를 입력해주세요.');
      return;
    }

    if (selected3.length === 0) {
      alert('채점기준 주요 키워드/문구를 입력해주세요.');
      return;
    }

    // 중복 검사: 수정 중인 항목의 인덱스를 제외한 나머지 항목과 비교
    const isDuplicate = quizList.some((quiz, index) => quiz.question === question && index !== editingIndex);

    if (isDuplicate) {
      alert('동일한 퀴즈 질문이 이미 존재합니다.');
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
    if (!contentType) {
      alert('지식콘텐츠 유형을 선택하세요.');
      return;
    }

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
    if (!selectedUniversity) {
      alert(`추천 ${groupLabel}을 선택해주세요.`);
      return false;
    }

    if (isContentModalOpen) {
      // 콘텐츠 등록
      console.log('지식콘텐츠');
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
        contentId: 'content_id_' + uuidv4(),
      };

      const formData = new FormData();
      formData.append('file', fileList[0]);
      const jsonString = JSON.stringify(params);
      const blob = new Blob([jsonString], { type: 'application/json' });
      formData.append('request', blob);

      onQuizContentSave(formData);
      setActiveTab('지식콘텐츠');
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
        quizId: 'quiz_id_' + uuidv4(),
        modelAnswerFinal: modelAnswer,
        modelAnswerAi: '',
      }));

      const params = {
        publishStatus: selectedOption === 'true' ? '0002' : '0001',
        content: {
          isNew: !isContentModalClick, // Simplified ternary expression
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
          ...(!isContentModalClick && { contentId: 'content_id_' + uuidv4() }), // Conditionally add contentId when isNew is true
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
        if (quiz.modelAnswerFinal === undefined || quiz.modelAnswerFinal === '') {
          alert(`퀴즈 ${index + 1}에 모범 답변이 없습니다.`);
          return false; // Exit the function if modelAnswerFinal is undefined
        }
      }
      onQuizSave(formData);
      setActiveTab('퀴즈목록');
    }
    setIsModalOpen(false);
  };

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

  const handleExcelChange = (event, type: string) => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.xlsx)$/i;

    if (!allowedExtensions.exec(file.name)) {
      alert('허용되지 않는 파일 형식입니다. xlsx 파일만 업로드 가능합니다.');
      event.target.value = ''; // input 초기화
      return;
    }

    if (file) {
      if (type === 'content') {
        setKnowledgeFileName(file.name);
        setKnowledgeFile([file]);
        setExcelSuccessFlag(false);
      } else if (type === 'quiz') {
        setKnowledgeQuizFileName(file.name);
        setKnowledgeQuizFile([file]);
        setQuizExcelSuccessFlag(false);
      } else if (type === 'quiz-ai') {
        setKnowledgeQuizAIFileName(file.name);
        setKnowledgeQuizAIFile([file]);
        setQuizAIExcelSuccessFlag(false);
      }
    }
    event.target.value = null;
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

  const handleInputQuizSearchChange = event => {
    setQuizSearch(event.target.value);
  };

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  const fileInputRef = useRef(null);
  const fileInputRefKnowledge = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleButtonClickKnowledge = () => {
    fileInputRefKnowledge.current.click();
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.pdf|\.pptx)$/i;

    if (!allowedExtensions.exec(file.name)) {
      alert('허용되지 않는 파일 형식입니다.');
      event.target.value = ''; // input 초기화
      return;
    }

    setFileList([file]); // 하나의 파일만 받도록 설정
    setFileNameCopy([file]); // 하나의 파일만 받도록 설정
  };

  const handleFileChangeKnowledge = event => {
    const files = Array.from(event.target.files);
    const allowedExtensions = /(\.pdf|\.pptx)$/i;

    // 모든 파일이 허용된 확장자인지 확인
    const invalidFiles = files.filter(file => !allowedExtensions.exec(file.name));

    if (invalidFiles.length > 0) {
      alert('허용되지 않는 파일 형식이 포함되어 있습니다. (pdf, pptx만 허용)');
      event.target.value = ''; // input 초기화
      return;
    }

    setFileListKnowledge(files); // 여러 파일을 받도록 설정
    setFileNameCopyKnowledge(files); // 여러 파일을 받도록 설정
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
            <Grid item xs={12} sm={1.5} className="tw-font-bold sm:tw-text-3xl tw-text-2xl tw-text-black">
              My퀴즈
            </Grid>
            <Grid item xs={12} sm={4.5} className="tw-font-semi tw-text-base tw-text-black">
              <div>나와 학습자들의 성장을 돕기위해 내가 만든 퀴즈 리스트예요!</div>
            </Grid>
            <Grid item xs={12} sm={6} justifyContent="flex-end" className="tw-flex">
              <BootstrapTooltip title="엑셀 파일을 업로드하여 퀴즈를 일괄등록할 수 있어요!" placement="top">
                <button
                  type="button"
                  onClick={() => setIsModalExcelOpen(true)}
                  className=" tw-mr-3 tw-font-bold tw-rounded-md tw-text-sm  tw-py-3"
                  style={{ border: '1px solid #B8B8B8', color: '#2474ED', width: '165px' }}
                >
                  + 지식/퀴즈 일괄등록
                </button>
              </BootstrapTooltip>
              <BootstrapTooltip title="지식콘텐츠 등록과 퀴즈만들기를 동시에 할 수 있어요!" placement="top">
                <button
                  type="button"
                  onClick={() => handleAddClick(false)}
                  className="tw-mr-3 tw-font-bold tw-rounded-md tw-text-sm  tw-py-3"
                  style={{ border: '1px solid #B8B8B8', color: '#2474ED', width: '165px' }}
                >
                  + 퀴즈 만들기
                </button>
              </BootstrapTooltip>
              <BootstrapTooltip title="지식콘텐츠만 미리 등록해 놓고, 나중에 활용할 수 있어요!" placement="top">
                <button
                  type="button"
                  onClick={() => handleAddClick(true)}
                  style={{ border: '1px solid #B8B8B8', color: 'black', width: '165px' }}
                  className="tw-text-black tw-bg-white tw-font-bold tw-rounded-md tw-text-sm  tw-py-3"
                >
                  +지식콘텐츠 등록
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
                    className={`tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-text-left tw-cursor-pointer ${activeTab === '퀴즈목록' ? 'tw-font-bold tw-text-black' : 'tw-text-[#6a7380]'
                      } tw-hover:tw-font-bold tw-hover:tw-text-black`}
                    onClick={() => handleTabClick('퀴즈목록')}
                  >
                    퀴즈목록
                  </p>
                </div>
                <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-h-11 tw-relative tw-gap-2.5">
                  <p
                    className={`tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-text-left tw-cursor-pointer ${activeTab === '지식콘텐츠' ? 'tw-font-bold tw-text-black' : 'tw-text-[#6a7380]'
                      } tw-hover:tw-font-bold tw-hover:tw-text-black`}
                    onClick={() => handleTabClick('지식콘텐츠')}
                  >
                    지식콘텐츠
                  </p>
                </div>
                <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-h-11 tw-relative tw-gap-2.5">
                  <p
                    className={`tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-text-left tw-cursor-pointer ${activeTab === '휴지통' ? 'tw-font-bold tw-text-black' : 'tw-text-[#6a7380]'
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
                placeholder="퀴즈, 지식콘텐츠 제목으로 검색해주세요."
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
          <div style={{ minHeight: '100vh' }}>
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
                  <KnowledgeComponent
                    data={data}
                    refetchMyQuiz={refetchMyQuiz}
                    refetchMyQuizThresh={refetchMyQuizThresh}
                  />
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
        {activeTab === '지식콘텐츠' && (
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
            {/* 지식콘텐츠 */}
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
        zIndex={200}
        title={isContentModalOpen ? '지식콘텐츠 만들기' : '퀴즈 만들기'}
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
          setKeyWorldKnowledge('');
          setQuizSearch('');
        }}
      >
        <div className={`${isContentModalClick ? 'tw-flex' : ' '}`}>
          <div className="tw-w-[670px]">
            <Accordion disableGutters sx={{ backgroundColor: '#e9ecf2' }} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="tw-flex tw-justify-between tw-items-center tw-w-full">
                  <div className="tw-text-lg tw-font-bold">지식콘텐츠 정보 입력</div>
                  {!isContentModalOpen && (
                    <button
                      onClick={e => {
                        if (isContentModalClick) {
                          console.log('지식콘텐츠 닫기');
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
                          setFileNameCopy([]);
                          setJobLevel([]);
                          setSelected1([]);
                          setSelected2([]);
                          setSelectedSubject('');
                          setSelectedChapter('');
                          setPersonName([]);
                          setUniversityCode('');
                          setJobs([]);
                          setContentSortType('');
                          setKeyWorldKnowledge('');
                          setQuizSearch('');
                        } else {
                          e.stopPropagation(); // This stops the event from propagating to the AccordionSummary
                          setIsContentModalClick(true);
                        }
                      }}
                      className="tw-text-sm tw-bg-black tw-p-2 tw-rounded tw-mr-5 tw-text-white"
                    >
                      {isContentModalClick ? '지식콘텐츠 닫기' : '지식콘텐츠 불러오기'}
                    </button>
                  )}
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                <div className="tw-flex tw-justify-between tw-items-center">
                  <div className="tw-text-sm tw-font-bold tw-py-2">
                    지식콘텐츠 유형<span className="tw-text-red-500 tw-ml-1">*</span>
                  </div>
                  <div className="tw-text-sm  tw-py-2">
                    <span className="tw-text-red-500 tw-mr-1">*</span>필수입력사항
                  </div>
                </div>
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
                            accept=".pdf,.pptx"
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
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">
                      지식콘텐츠 URL<span className="tw-text-red-500 tw-ml-1">*</span>
                    </div>
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
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">
                  지식콘텐츠 제목<span className="tw-text-red-500 tw-ml-1">*</span>
                </div>
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
                <div className="tw-text-lg tw-font-bold">지식콘텐츠 태깅</div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                <div className="tw-text-sm tw-font-bold tw-py-2">
                  추천 {groupLabel}
                  <span className="tw-text-red-500 tw-ml-1">*</span>
                </div>
                <select
                  className="form-select"
                  onChange={handleUniversityChange}
                  aria-label="Default select example"
                  disabled={isContentModalClick}
                  value={universityCode}
                >
                  <option value="">{groupLabel}을 선택해주세요.</option>
                  {optionsData?.data?.jobs?.map((university, index) => (
                    <option key={index} value={university.code}>
                      {university.name}
                    </option>
                  ))}
                </select>
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">추천 {subGroupLabel}</div>
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
                        return (
                          <span style={{ color: 'gray' }}>
                            추천 {groupLabel}을 먼저 선택하고, {subGroupLabel}을 선택해주세요.
                          </span>
                        );
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

                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">
                  추천 학년<span className="tw-text-red-500 tw-ml-1">*</span>
                </div>
                {optionsData?.data?.jobLevels?.map((item, i) => (
                  <Toggle
                    key={item.code}
                    label={item.name}
                    name={item.name}
                    disabled={isContentModalClick}
                    value={item.code}
                    variant="small"
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
                    <Tag value={selected1} onChange={setSelected1} placeHolder="학습 키워드 입력 후 엔터를 쳐주세요." />
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">스킬</div>
                    <Tag value={selected2} onChange={setSelected2} placeHolder="스킬 입력 후 엔터를 쳐주세요." />
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
                      <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">
                        퀴즈 <span className="tw-text-red-500 tw-ml-1">*</span>
                      </div>
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
                      <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">
                        모범답안 <span className="tw-text-red-500 tw-ml-1">*</span>
                      </div>
                      <textarea
                        value={modelAnswerFinal}
                        className="tw-form-control tw-w-full tw-py-[8px] tw-p-3"
                        id="floatingTextarea"
                        rows={2} // 두 줄 높이로 설정
                        onChange={handleModelAnswerChange}
                      ></textarea>
                      <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">
                        채점기준 주요 키워드/문구 <span className="tw-text-red-500 tw-ml-1">*</span>
                      </div>
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
                          {isModify ? '수정하기' : '퀴즈입력'}
                        </button>
                      </div>
                    </>
                  )}

                  {sortQuizType === 'ASC' && (
                    <>
                      <div className="tw-text-sm tw-font-bold tw-mt-4">
                        생성할 퀴즈 개수<span className="tw-text-red-500 tw-ml-1">*</span>
                      </div>
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
                        isGlobalLoading={isGlobalLoading}
                        setIsGlobalLoading={setIsGlobalLoading}
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

            <div className="tw-py-5 tw-text-center tw-flex tw-justify-between tw-items-center">
              <div>
                {!isContentModalOpen && (
                  <div className="tw-text-left">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio1"
                        value="false"
                        checked={selectedOption === 'false'}
                        onChange={handleChangeOption}
                      />
                      <label className="form-check-label" htmlFor="inlineRadio1">
                        비공개 퀴즈 생성
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio2"
                        value="true"
                        checked={selectedOption === 'true'}
                        onChange={handleChangeOption}
                      />
                      <label className="form-check-label" htmlFor="inlineRadio2">
                        공개 퀴즈로 전환
                      </label>
                    </div>
                  </div>
                )}
              </div>
              <div className={`tw-text-right ${isContentModalOpen ? 'tw-flex tw-justify-end tw-w-full' : ''}`}>
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
            <div className="tw-w-[390px] tw-p-5 tw-pr-0 tw-ml-5">
              <div className="tw-text-lg tw-font-bold tw-mb-5 tw-text-black">지식콘텐츠 불러오기</div>
              <div className="tw-mb-3">
                <TextField
                  size="small"
                  fullWidth
                  placeholder="지식콘텐츠 키워드를 입력해주세요."
                  onChange={handleInputQuizSearchChange}
                  id="margin-none"
                  value={quizSearch}
                  name="quizSearch"
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                  }}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      searchKeyworldKnowledge((e.target as HTMLInputElement).value);
                    }
                  }}
                />
              </div>
              <Divider sx={{ mt: 2, mb: 2, bgcolor: 'secondary.gray' }} component="div" />
              <FormControl fullWidth>
                <RadioGroup
                  aria-labelledby=""
                  defaultValue=""
                  name="radio-buttons-group"
                  value={contentSortType}
                  onChange={handleChangeContent}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 18,
                    },
                  }}
                >
                  {myQuizContentData?.contents?.length === 0 && (
                    <div className="tw-text-center tw-text-sm tw-text-gray-500 tw-py-5">
                      등록된 지식콘텐츠가 없습니다.
                    </div>
                  )}
                  {myQuizContentData?.contents?.map((data, index) => (
                    <FormControlLabel
                      sx={{ marginLeft: 0, marginRight: 0 }}
                      key={index}
                      className="border tw-p-1 tw-mb-2 tw-rounded-lg"
                      style={{ width: '100%' }}
                      value={data.contentSequence}
                      control={<Radio />}
                      label={data.name}
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
      <MentorsModal
        isOpen={isModalExcelOpen}
        onAfterClose={() => {
          onCloseExcelModal();
          setIsModalExcelOpen(false);
        }}
        title="지식/퀴즈 일괄 등록하기"
        isContentModalClick={false}
        height="75%"
      >
        <div className="tw-px-20">
          <div className="tw-mb-5">
            <div className="tw-flex tw-flex-row tw-items-start tw-justify-between tw-mb-5 tw-mt-5">
              <div className=" tw-font-bold tw-text-black tw-flex tw-items-center">지식콘텐츠(아티클) 일괄 등록</div>
              {excelSuccessLoading && (
                <div className="tw-flex tw-items-center tw-justify-center tw-ml-2">
                  <svg width="40" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle fill="#1694FF" stroke="#1694FF" stroke-width="2" r="15" cx="40" cy="100">
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.4"
                      ></animate>
                    </circle>
                    <circle fill="#1694FF" stroke="#1694FF" stroke-width="2" r="15" cx="100" cy="100">
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.2"
                      ></animate>
                    </circle>
                    <circle fill="#1694FF" stroke="#1694FF" stroke-width="2" r="15" cx="160" cy="100">
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="0"
                      ></animate>
                    </circle>
                  </svg>
                  <span className="tw-ml-1 tw-font-medium tw-text-black tw-text-sm">엑셀 파일 업로드 중</span>
                </div>
              )}

              {excelSuccessFlag && (
                <div className="tw-flex tw-items-center tw-justify-center tw-ml-2">
                  <svg
                    width="24"
                    height="22"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-w-6 tw-h-6 tw-relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M24 42C26.3638 42 28.7044 41.5344 30.8883 40.6298C33.0722 39.7253 35.0565 38.3994 36.7279 36.7279C38.3994 35.0565 39.7253 33.0722 40.6298 30.8883C41.5344 28.7044 42 26.3638 42 24C42 21.6362 41.5344 19.2956 40.6298 17.1117C39.7253 14.9278 38.3994 12.9435 36.7279 11.2721C35.0565 9.60062 33.0722 8.27475 30.8883 7.37017C28.7044 6.46558 26.3638 6 24 6C19.2261 6 14.6477 7.89642 11.2721 11.2721C7.89642 14.6477 6 19.2261 6 24C6 28.7739 7.89642 33.3523 11.2721 36.7279C14.6477 40.1036 19.2261 42 24 42ZM23.536 31.28L33.536 19.28L30.464 16.72L21.864 27.038L17.414 22.586L14.586 25.414L20.586 31.414L22.134 32.962L23.536 31.28Z"
                      fill="#478AF5"
                    ></path>
                  </svg>
                  <span className="tw-ml-2 tw-font-medium tw-text-black tw-text-sm">엑셀 파일 업로드 완료</span>
                </div>
              )}
            </div>
            <div className="tw-flex tw-items-center tw-justify-start tw-gap-4">
              <button
                onClick={() => handleExcelDownload('content')}
                className="tw-text-sm tw-text-black tw-w-40 tw-h-10 tw-rounded tw-bg-white tw-border border tw-flex tw-items-center tw-justify-center tw-gap-2"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M3.33203 13.3367V14.1667C3.33203 14.8297 3.59542 15.4656 4.06426 15.9344C4.53311 16.4033 5.16899 16.6667 5.83203 16.6667H14.1654C14.8284 16.6667 15.4643 16.4033 15.9331 15.9344C16.402 15.4656 16.6654 14.8297 16.6654 14.1667V13.3333M9.9987 3.75V12.9167M9.9987 12.9167L12.9154 10M9.9987 12.9167L7.08203 10"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                양식 다운로드
              </button>
              {/* 첫 번째 양식 업로드 버튼 */}
              <label htmlFor="dropzone-file3" className="tw-cursor-pointer">
                <div className="tw-text-black border tw-text-sm tw-w-40 tw-h-10 tw-rounded tw-bg-white tw-flex tw-items-center tw-justify-center tw-gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M3.33203 13.3367V14.1667C3.33203 14.8297 3.59542 15.4656 4.06426 15.9344C4.53311 16.4033 5.16899 16.6667 5.83203 16.6667H14.1654C14.8284 16.6667 15.4643 16.4033 15.9331 15.9344C16.402 15.4656 16.6654 14.8297 16.6654 14.1667V13.3333M9.9987 12.9167V3.75M9.9987 3.75L12.9154 6.66667M9.9987 3.75L7.08203 6.66667"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  양식 업로드
                </div>
                <input
                  id="dropzone-file3"
                  type="file"
                  className="tw-hidden"
                  onChange={e => handleExcelChange(e, 'content')}
                />
              </label>

              <div
                className={`tw-flex tw-items-center tw-justify-start tw-gap-2 tw-w-[200px] tw-h-10 tw-rounded tw-bg-white tw-text-sm tw-text-left ${knowledgeFileName ? 'tw-text-blue-500 tw-underline' : 'tw-text-gray-500 '
                  }`}
              >
                {knowledgeFileName || '선택한 파일 없음'}
                {knowledgeFileName && (
                  <div
                    className="tw-cursor-pointer"
                    onClick={() => {
                      setKnowledgeFileName('');
                      setKnowledgeFile([]);
                      setExcelSuccessFlag(false);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <rect width="16" height="16" rx="4" fill="#F6F7FB"></rect>
                      <path
                        d="M5.6 11L5 10.4L7.4 8L5 5.6L5.6 5L8 7.4L10.4 5L11 5.6L8.6 8L11 10.4L10.4 11L8 8.6L5.6 11Z"
                        fill="#313B49"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="tw-mb-5">
            <div className="tw-justify-between tw-my-10">
              <div
                className="tw-font-bold tw-text-black tw-flex tw-items-center tw-gap-2 tw-cursor-pointer"
                onClick={() => {
                  setIsFileOpen(!isFileOpen);
                  setIsAIExcelOpen(false);

                  setFileListKnowledge([]);
                  setJobLevel([]);
                  setSelected1([]);
                  setSelected2([]);
                  setSelectedSubject('');
                  setSelectedChapter('');
                  setPersonName([]);
                  setUniversityCode('');
                  setJobs([]);
                  setContentSortType('');
                }}
              >
                지식콘텐츠(파일) 일괄 등록 {isFileOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </div>
            </div>
            {isFileOpen && (
              <div className="border tw-p-5 tw-rounded-lg">
                <div className="">
                  <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-5">
                    파일 업로드<span className="tw-text-blue-500 tw-text-sm tw-ml-1">*</span>
                  </div>
                  <div className="tw-flex tw-gap-2 tw-justify-between tw-pb-5">
                    <div className="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-text-center">
                      <div className="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-text-left">
                        {!isContentModalClick ? (
                          <div>
                            {fileListKnowledge.length > 0 ? (
                              <div>
                                {fileListKnowledge.map((file, index) => (
                                  <div key={index}>
                                    {index + 1}. {file.name}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="tw-text-sm tw-text-gray-500 tw-underline">파일을 추가해주세요. (pdf)</div>
                            )}
                          </div>
                        ) : (
                          <div>{fileNameCopyKnowledge || '파일정보가 없습니다.'}</div>
                        )}
                      </div>
                    </div>
                    <div
                      onClick={handleButtonClickKnowledge}
                      className="tw-cursor-pointer tw-flex tw-items-center tw-gap-2 border tw-px-4 tw-py-2 tw-rounded tw-h-[35px]"
                    >
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
                      <button className=" tw-text-sm tw-text-left tw-text-[#31343d] ">파일추가</button>
                      <input
                        accept=".pdf,.pptx"
                        type="file"
                        multiple
                        ref={fileInputRefKnowledge}
                        style={{ display: 'none' }}
                        onChange={handleFileChangeKnowledge}
                      />
                    </div>
                  </div>

                  <div className="tw-flex tw-gap-2">
                    <div className="tw-w-1/2">
                      <div className="tw-text-sm tw-font-medium tw-text-black tw-py-2">
                        추천 {groupLabel}
                        <span className="tw-text-blue-500 tw-ml-1">*</span>
                      </div>
                      <select
                        className="form-select"
                        onChange={handleUniversityChange}
                        aria-label="Default select example"
                        disabled={isContentModalClick}
                        value={universityCode}
                      >
                        <option value="">{groupLabel}을 선택해주세요.</option>
                        {optionsData?.data?.jobs?.map((university, index) => (
                          <option key={index} value={university.code}>
                            {university.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="tw-w-1/2">
                      <div className="tw-text-sm tw-font-medium tw-text-black tw-py-2">
                        추천 {subGroupLabel} <span className="tw-text-blue-500 tw-ml-1">*</span>
                      </div>
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
                              return (
                                <span style={{ color: 'gray' }}>
                                  추천 {groupLabel}을 먼저 선택하고, {subGroupLabel}을 선택해주세요.
                                </span>
                              );
                            }
                            return selected.join(', ');
                          }}
                          disabled={jobs.length === 0 || isContentModalClick}
                          value={personName}
                          onChange={handleChange}
                          MenuProps={{
                            disableScrollLock: true,
                            style: {
                              zIndex: 9999,
                            },
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
                    </div>
                  </div>
                  <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-2">
                    추천 학년<span className="tw-text-blue-500 tw-ml-1">*</span>
                  </div>
                  {optionsData?.data?.jobLevels?.map(item => (
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
                  <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-3">학습 주제</div>
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
                  <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-3">학습 챕터</div>
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
                  <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-2">학습 키워드</div>
                  <Tag value={selected1} onChange={setSelected1} placeHolder="학습 키워드 입력 후 엔터를 쳐주세요." />
                  <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-2">스킬</div>
                  <Tag value={selected2} onChange={setSelected2} placeHolder="스킬 입력 후 엔터를 쳐주세요." />
                </div>
              </div>
            )}
          </div>

          <div className="tw-mb-5">
            <div className="tw-flex tw-flex-row tw-items-start tw-justify-between tw-mb-5">
              <div className=" tw-font-bold tw-text-black tw-flex tw-items-center ">
                지식콘텐츠(아티클) + 퀴즈 엑셀 일괄 등록
              </div>

              {quizExcelSuccessLoading && (
                <div className="tw-flex tw-items-center tw-justify-center tw-ml-2">
                  <svg width="40" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle fill="#1694FF" stroke="#1694FF" stroke-width="2" r="15" cx="40" cy="100">
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.4"
                      ></animate>
                    </circle>
                    <circle fill="#1694FF" stroke="#1694FF" stroke-width="2" r="15" cx="100" cy="100">
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.2"
                      ></animate>
                    </circle>
                    <circle fill="#1694FF" stroke="#1694FF" stroke-width="2" r="15" cx="160" cy="100">
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="0"
                      ></animate>
                    </circle>
                  </svg>
                  <span className="tw-ml-1 tw-font-medium tw-text-black tw-text-sm">엑셀 파일 업로드 중</span>
                </div>
              )}

              {quizExcelSuccessFlag && (
                <div className="tw-flex tw-items-center tw-justify-center tw-ml-2">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-w-6 tw-h-6 tw-relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M24 42C26.3638 42 28.7044 41.5344 30.8883 40.6298C33.0722 39.7253 35.0565 38.3994 36.7279 36.7279C38.3994 35.0565 39.7253 33.0722 40.6298 30.8883C41.5344 28.7044 42 26.3638 42 24C42 21.6362 41.5344 19.2956 40.6298 17.1117C39.7253 14.9278 38.3994 12.9435 36.7279 11.2721C35.0565 9.60062 33.0722 8.27475 30.8883 7.37017C28.7044 6.46558 26.3638 6 24 6C19.2261 6 14.6477 7.89642 11.2721 11.2721C7.89642 14.6477 6 19.2261 6 24C6 28.7739 7.89642 33.3523 11.2721 36.7279C14.6477 40.1036 19.2261 42 24 42ZM23.536 31.28L33.536 19.28L30.464 16.72L21.864 27.038L17.414 22.586L14.586 25.414L20.586 31.414L22.134 32.962L23.536 31.28Z"
                      fill="#478AF5"
                    ></path>
                  </svg>
                  <span className="tw-ml-2 tw-font-medium tw-text-black tw-text-sm">엑셀 파일 업로드 완료</span>
                </div>
              )}
            </div>
            <div className="tw-flex tw-items-center tw-justify-start tw-gap-4">
              <button
                onClick={() => handleExcelDownload('quiz')}
                className="tw-text-sm tw-text-black tw-w-40 tw-h-10 tw-rounded tw-bg-white tw-border border tw-flex tw-items-center tw-justify-center tw-gap-2"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M3.33203 13.3367V14.1667C3.33203 14.8297 3.59542 15.4656 4.06426 15.9344C4.53311 16.4033 5.16899 16.6667 5.83203 16.6667H14.1654C14.8284 16.6667 15.4643 16.4033 15.9331 15.9344C16.402 15.4656 16.6654 14.8297 16.6654 14.1667V13.3333M9.9987 3.75V12.9167M9.9987 12.9167L12.9154 10M9.9987 12.9167L7.08203 10"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                양식 다운로드
              </button>
              {/* 첫 번째 양식 업로드 버튼 */}
              <label htmlFor="dropzone-file4" className="tw-cursor-pointer">
                <div className="tw-text-black border tw-text-sm tw-w-40 tw-h-10 tw-rounded tw-bg-white tw-flex tw-items-center tw-justify-center tw-gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M3.33203 13.3367V14.1667C3.33203 14.8297 3.59542 15.4656 4.06426 15.9344C4.53311 16.4033 5.16899 16.6667 5.83203 16.6667H14.1654C14.8284 16.6667 15.4643 16.4033 15.9331 15.9344C16.402 15.4656 16.6654 14.8297 16.6654 14.1667V13.3333M9.9987 12.9167V3.75M9.9987 3.75L12.9154 6.66667M9.9987 3.75L7.08203 6.66667"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  양식 업로드
                </div>
                <input
                  id="dropzone-file4"
                  type="file"
                  className="tw-hidden"
                  onChange={e => handleExcelChange(e, 'quiz')}
                />
              </label>
              <div
                className={`tw-flex tw-items-center tw-justify-start tw-gap-2 tw-w-[200px] tw-h-10 tw-rounded tw-bg-white tw-text-sm tw-text-left ${knowledgeQuizFileName ? 'tw-text-blue-500 tw-underline' : 'tw-text-gray-500 '
                  }`}
              >
                {knowledgeQuizFileName || '선택한 파일 없음'}
                {knowledgeQuizFileName && (
                  <div
                    className="tw-cursor-pointer"
                    onClick={() => {
                      setKnowledgeQuizFileName('');
                      setKnowledgeQuizFile([]);
                      setQuizExcelSuccessFlag(false);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <rect width="16" height="16" rx="4" fill="#F6F7FB"></rect>
                      <path
                        d="M5.6 11L5 10.4L7.4 8L5 5.6L5.6 5L8 7.4L10.4 5L11 5.6L8.6 8L11 10.4L10.4 11L8 8.6L5.6 11Z"
                        fill="#313B49"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="">
            <div className="tw-flex tw-items-start tw-justify-between tw-mb-5">
              <div className=" tw-font-bold tw-text-black">지식콘텐츠(아티클) + 퀴즈(AI생성) 엑셀 일괄 등록</div>
              {quizAIExcelSuccessLoading && (
                <div className="tw-flex tw-items-center tw-justify-center tw-ml-2">
                  <svg width="40" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle fill="#1694FF" stroke="#1694FF" stroke-width="2" r="15" cx="40" cy="100">
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.4"
                      ></animate>
                    </circle>
                    <circle fill="#1694FF" stroke="#1694FF" stroke-width="2" r="15" cx="100" cy="100">
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.2"
                      ></animate>
                    </circle>
                    <circle fill="#1694FF" stroke="#1694FF" stroke-width="2" r="15" cx="160" cy="100">
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="0"
                      ></animate>
                    </circle>
                  </svg>
                  <span className="tw-ml-1 tw-font-medium tw-text-black tw-text-sm">엑셀 파일 업로드 중</span>
                </div>
              )}
              {quizAIExcelSuccessFlag && (
                <div className="tw-flex tw-items-center tw-justify-center tw-ml-2">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-w-6 tw-h-6 tw-relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M24 42C26.3638 42 28.7044 41.5344 30.8883 40.6298C33.0722 39.7253 35.0565 38.3994 36.7279 36.7279C38.3994 35.0565 39.7253 33.0722 40.6298 30.8883C41.5344 28.7044 42 26.3638 42 24C42 21.6362 41.5344 19.2956 40.6298 17.1117C39.7253 14.9278 38.3994 12.9435 36.7279 11.2721C35.0565 9.60062 33.0722 8.27475 30.8883 7.37017C28.7044 6.46558 26.3638 6 24 6C19.2261 6 14.6477 7.89642 11.2721 11.2721C7.89642 14.6477 6 19.2261 6 24C6 28.7739 7.89642 33.3523 11.2721 36.7279C14.6477 40.1036 19.2261 42 24 42ZM23.536 31.28L33.536 19.28L30.464 16.72L21.864 27.038L17.414 22.586L14.586 25.414L20.586 31.414L22.134 32.962L23.536 31.28Z"
                      fill="#478AF5"
                    ></path>
                  </svg>
                  <span className="tw-ml-2 tw-font-medium tw-text-black tw-text-sm">엑셀 파일 업로드 완료</span>
                </div>
              )}
            </div>
            <div className="tw-flex tw-items-center tw-justify-start tw-gap-4">
              <button
                onClick={() => handleExcelDownload('quiz-ai')}
                className="tw-text-sm tw-text-black tw-w-40 tw-h-10 tw-rounded tw-bg-white tw-border border tw-flex tw-items-center tw-justify-center tw-gap-2"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M3.33203 13.3367V14.1667C3.33203 14.8297 3.59542 15.4656 4.06426 15.9344C4.53311 16.4033 5.16899 16.6667 5.83203 16.6667H14.1654C14.8284 16.6667 15.4643 16.4033 15.9331 15.9344C16.402 15.4656 16.6654 14.8297 16.6654 14.1667V13.3333M9.9987 3.75V12.9167M9.9987 12.9167L12.9154 10M9.9987 12.9167L7.08203 10"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                양식 다운로드
              </button>
              {/* 첫 번째 양식 업로드 버튼 */}
              <label htmlFor="dropzone-file5" className="tw-cursor-pointer">
                <div className="tw-text-black border tw-text-sm tw-w-40 tw-h-10 tw-rounded tw-bg-white tw-flex tw-items-center tw-justify-center tw-gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M3.33203 13.3367V14.1667C3.33203 14.8297 3.59542 15.4656 4.06426 15.9344C4.53311 16.4033 5.16899 16.6667 5.83203 16.6667H14.1654C14.8284 16.6667 15.4643 16.4033 15.9331 15.9344C16.402 15.4656 16.6654 14.8297 16.6654 14.1667V13.3333M9.9987 12.9167V3.75M9.9987 3.75L12.9154 6.66667M9.9987 3.75L7.08203 6.66667"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  양식 업로드
                </div>
                <input
                  id="dropzone-file5"
                  type="file"
                  className="tw-hidden"
                  onChange={e => handleExcelChange(e, 'quiz-ai')}
                />
              </label>
              <div
                className={`tw-flex tw-items-center tw-justify-start tw-gap-2 tw-w-[200px] tw-h-10 tw-rounded tw-bg-white tw-text-sm tw-text-left ${knowledgeQuizAIFileName ? 'tw-text-blue-500 tw-underline' : 'tw-text-gray-500 '
                  }`}
              >
                {knowledgeQuizAIFileName || '선택한 파일 없음'}
                {knowledgeQuizAIFileName && (
                  <div
                    className="tw-cursor-pointer"
                    onClick={() => {
                      setKnowledgeQuizAIFileName('');
                      setKnowledgeQuizAIFile([]);
                      setQuizAIExcelSuccessFlag(false);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <rect width="16" height="16" rx="4" fill="#F6F7FB"></rect>
                      <path
                        d="M5.6 11L5 10.4L7.4 8L5 5.6L5.6 5L8 7.4L10.4 5L11 5.6L8.6 8L11 10.4L10.4 11L8 8.6L5.6 11Z"
                        fill="#313B49"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="tw-my-10">
              <div
                className=" tw-font-bold tw-text-black tw-cursor-pointer"
                onClick={() => {
                  setIsAIExcelOpen(!isAIExcelOpen);
                  setIsFileOpen(false);
                  setFileListKnowledge([]);
                  setJobLevel([]);
                  setSelected1([]);
                  setSelected2([]);
                  setSelectedSubject('');
                  setSelectedChapter('');
                  setPersonName([]);
                  setUniversityCode('');
                  setJobs([]);
                  setContentSortType('');
                }}
              >
                지식콘텐츠(파일) + 퀴즈(AI생성) 엑셀 일괄 등록{' '}
                {isAIExcelOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </div>

              {isAIExcelOpen && (
                <div className="border tw-p-5 tw-rounded-lg tw-mt-5">
                  <div className="">
                    <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-2">
                      파일 업로드<span className="tw-text-blue-500 tw-text-sm tw-ml-1">*</span>
                    </div>
                    <div className="tw-flex tw-gap-2 tw-justify-between tw-pb-5">
                      <div className="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-text-center">
                        <div className="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-text-left ">
                          {!isContentModalClick ? (
                            <div>
                              {fileListKnowledge.length > 0 ? (
                                <div>
                                  {fileListKnowledge.map((file, index) => (
                                    <div key={index}>
                                      {index + 1}. {file.name}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="tw-text-sm tw-text-gray-500 tw-underline">
                                  파일을 추가해주세요. (pdf)
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>{fileNameCopyKnowledge || '파일정보가 없습니다.'}</div>
                          )}
                        </div>
                      </div>
                      <div
                        onClick={handleButtonClickKnowledge}
                        className="tw-cursor-pointer tw-flex tw-items-center tw-gap-2 border tw-px-4 tw-py-2 tw-rounded tw-h-[35px]"
                      >
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
                        <button className=" tw-text-sm tw-text-left tw-text-[#31343d]">파일추가</button>
                        <input
                          accept=".pdf,.pptx"
                          type="file"
                          multiple
                          ref={fileInputRefKnowledge}
                          style={{ display: 'none' }}
                          onChange={handleFileChangeKnowledge}
                        />
                      </div>
                    </div>

                    <div className="tw-flex tw-gap-5 tw-mb-5">
                      <div className="tw-w-1/2">
                        <div className="tw-text-sm tw-font-medium tw-text-black tw-py-2">
                          파일별 생성 퀴즈 개수 <span className="tw-text-blue-500 tw-ml-1">*</span>
                        </div>
                        <TextField
                          required
                          id="username"
                          name="username"
                          variant="outlined"
                          type="search"
                          value={fileCount}
                          size="small"
                          onChange={e => setFileCount(Number(e.target.value))}
                          fullWidth
                          sx={{
                            '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                          }}
                        />
                      </div>
                      <div className="tw-w-1/2">
                        <div className="tw-text-left tw-flex tw-items-center tw-justify-start tw-gap-2 tw-h-full tw-mt-4">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="inlineRadioOptions"
                              id="inlineRadio1"
                              value="false"
                              checked={selectedOptionFile === 'false'}
                              onChange={handleChangeOption}
                            />
                            <label className="form-check-label" htmlFor="inlineRadio1">
                              비공개 퀴즈 생성
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="inlineRadioOptions"
                              id="inlineRadio2"
                              value="true"
                              checked={selectedOptionFile === 'true'}
                              onChange={e => setSelectedOptionFile(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="inlineRadio2">
                              공개 퀴즈로 전환
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tw-flex tw-gap-5">
                      <div className="tw-w-1/2">
                        <div className="tw-text-sm tw-font-medium tw-text-black tw-py-2">
                          추천 {groupLabel}
                          <span className="tw-text-blue-500 tw-ml-1">*</span>
                        </div>
                        <select
                          className="form-select"
                          onChange={handleUniversityChange}
                          aria-label="Default select example"
                          disabled={isContentModalClick}
                          value={universityCode}
                        >
                          <option value="">{groupLabel}을 선택해주세요.</option>
                          {optionsData?.data?.jobs?.map((university, index) => (
                            <option key={index} value={university.code}>
                              {university.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="tw-w-1/2">
                        <div className="tw-text-sm tw-font-medium tw-text-black tw-py-2">
                          추천 {subGroupLabel}
                          <span className="tw-text-blue-500 tw-ml-1">*</span>
                        </div>
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
                                return (
                                  <span style={{ color: 'gray' }}>
                                    추천 {groupLabel}을 먼저 선택하고, {subGroupLabel}을 선택해주세요.
                                  </span>
                                );
                              }
                              return selected.join(', ');
                            }}
                            disabled={jobs.length === 0 || isContentModalClick}
                            value={personName}
                            onChange={handleChange}
                            MenuProps={{
                              disableScrollLock: true,
                              style: {
                                zIndex: 9999,
                              },
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
                      </div>
                    </div>
                    <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-2">
                      추천 학년<span className="tw-text-blue-500 tw-ml-1">*</span>
                    </div>
                    {optionsData?.data?.jobLevels?.map(item => (
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
                    <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-3">학습 주제</div>
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
                    <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-3">학습 챕터</div>
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
                    <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-2">학습 키워드</div>
                    <Tag value={selected1} onChange={setSelected1} placeHolder="학습 키워드 입력 후 엔터를 쳐주세요." />
                    <div className="tw-text-sm tw-font-medium tw-text-black tw-pt-5 tw-pb-2">스킬</div>
                    <Tag value={selected2} onChange={setSelected2} placeHolder="스킬 입력 후 엔터를 쳐주세요." />
                  </div>
                </div>
              )}
            </div>

            <div className="tw-flex tw-items-center tw-justify-center tw-w-full tw-pb-10  tw-gap-4">
              <button
                onClick={handleQuizAdd}
                disabled={contentQuizAIExcelSuccessLoading || contentFileSuccessLoading}
                className="tw-flex tw-items-center tw-justify-center tw-w-[150px] tw-h-11 tw-rounded tw-bg-blue-500 tw-text-base tw-text-white tw-text-left disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
              >
                {contentQuizAIExcelSuccessLoading || contentFileSuccessLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  '등록하기'
                )}
              </button>
              <button
                onClick={() => {
                  onCloseExcelModal();
                  setIsModalExcelOpen(false);
                }}
                className="tw-flex tw-items-center tw-justify-center tw-w-[150px] tw-h-11 tw-rounded tw-bg-black tw-text-base tw-text-white tw-text-left"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </MentorsModal>
    </div>
  );
}

export default QuizMakeTemplate;
