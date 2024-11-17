import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState, useRef, useEffect } from 'react';
import { useSessionStore } from 'src/store/session';
import { useMemberActiveSummaryInfo } from 'src/services/account/account.queries';
import { useQuizList } from 'src/services/studyroom/studyroom.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import Divider from '@mui/material/Divider';

import { Mobile, Desktop } from 'src/hooks/mediaQuery';
import Drawer from '@mui/material/Drawer';

/**table */
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useQuizFileDownload } from 'src/services/quiz/quiz.queries';

/**accordion */
import { useQuizSave, useAIQuizSave, useAIQuizAnswer, useQuizContentSave } from 'src/services/quiz/quiz.mutations';
import { Toggle, Pagination, MentorsModal, AIQuizList, Tag } from 'src/stories/components';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { v4 as uuidv4 } from 'uuid';
import { useOptions } from 'src/services/experiences/experiences.queries';
import { Radio, RadioGroup, FormControlLabel, TextField, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import validator from 'validator';
import { UseQueryResult } from 'react-query';
import { useMyQuiz, useMyQuizContents, useMyQuizThresh } from 'src/services/jobs/jobs.queries';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import { useQuizContentDelete } from 'src/services/admin/friends/friends.mutations';

const cx = classNames.bind(styles);

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

export function AdminQuizTemplate() {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any>([]);

  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [memberList, setMemberList] = useState<any[]>([]);
  const [memberParams, setMemberParams] = useState<any>({ page: page, keyword: search });
  const [open, setOpen] = React.useState(false);

  /**accordion */
  const [isContentModalClick, setIsContentModalClick] = useState<boolean>(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState<boolean>(false);
  const [active, setActive] = useState('');
  const [contentType, setContentType] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [quizList, setQuizList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileNameCopy, setFileNameCopy] = useState([]);
  const [key, setKey] = useState('');
  const [sortQuizType, setSortQuizType] = useState('ASC');
  const [jobLevel, setJobLevel] = useState([]);
  const [selected1, setSelected1] = useState([]);
  const [selected2, setSelected2] = useState([]);
  const [selected3, setSelected3] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [jobs, setJobs] = useState([]);
  const [universityCode, setUniversityCode] = useState('');
  const [contentSortType, setContentSortType] = useState('');
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [selectedJobName, setSelectedJobName] = useState('');
  const [selectedJob, setSelectedJob] = useState([]);
  const [quizCount, setQuizCount] = useState(1);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelAnswerFinal, setModelAnswerFinal] = useState('');
  const [isModify, setIsModify] = useState(false);
  // 로딩 상태를 관리하기 위해 useState 훅 사용
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState({});
  const [index, setIndex] = useState(0);
  const [contentSequence, setContentSequence] = useState('');
  const [quizSortType, setQuizSortType] = useState('0001');
  const [threshSortType, setThreshSortType] = useState('0001');
  const [sortType, setSortType] = useState('DESC');
  const [activeTab, setActiveTab] = useState('퀴즈목록');
  const [quizPage, setQuizPage] = useState(1);
  const [totalQuizPage, setTotalQuizPage] = useState(1);
  const [keyWorld, setKeyWorld] = useState('');
  const [selectedOption, setSelectedOption] = useState('false');
  const handleChangeOption = event => {
    console.log('test', event.target.value);
    setSelectedOption(event.target.value);
  };

  const { data: optionsData }: UseQueryResult<ExperiencesResponse> = useOptions();
  //quiz delete
  const { mutate: onQuizSave, isSuccess: postSuccess, isError: postError } = useQuizSave();
  const { mutate: onQuizContentSave, isSuccess: postContentSuccess } = useQuizContentSave();
  const { mutate: onAIQuizSave, isSuccess: updateSuccess, isError: updateError, data: aiQuizData } = useAIQuizSave();
  const { mutate: onAIQuizAnswer, isSuccess: answerSuccess, data: aiQuizAnswerData } = useAIQuizAnswer();
  const { mutate: onQuizContentDelete, isSuccess: isAcceptSuccess } = useQuizContentDelete();
  const { isFetched: isMemberListFetched, refetch: QuizRefetchBadge } = useQuizList(memberParams, data => {
    console.log(data);
    setContents(data?.data?.contents);
    setTotalPage(data?.data?.totalPages);
    setPage(data?.data?.page);
  });
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

  useDidMountEffect(() => {
    setContentTitle('');
    setContentUrl('');
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
    setContentType('');
    setSelectedOption('false');
    toggleDrawer(false);
    setOpen(false);
    QuizRefetchBadge();
  }, [postSuccess, postContentSuccess]);

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
      // setIsLoadingAI(false);
      setIsLoadingAI(prevState => ({ ...prevState, [index]: false }));
    }
  }, [answerSuccess]);

  const [quizParams, setQuizParams] = useState<any>({ quizPage, sortType: 'DESC' });

  const { data: myQuizContentData, refetch: refetchMyQuizContent }: UseQueryResult<any> = useMyQuizContents(
    quizParams,
    data => {
      console.log(data.contents);
      setTotalQuizPage(data.totalPages);
    },
  );

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    setKey(key);
    setFileName(fileName);
  };

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
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

  const handleQuizClick = () => {
    // Validation check
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

  const handleInputChapterChange = event => {
    setSelectedChapter(event.target.value);
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

  useEffect(() => {
    if (isAcceptSuccess) {
      // alert('지식콘텐츠 삭제가 되었습니다.');
      QuizRefetchBadge();
    }
  }, [isAcceptSuccess]);

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

    // if (!contentUrl) {
    //   alert('콘텐츠 URL을 입력하세요.');
    //   return;
    // }

    // if (!selectedUniversity || selectedUniversity.length === 0) {
    //   alert('하나 이상의 대학을 선택하세요.');
    //   return;
    // }

    // if (!selectedJob || selectedJob.length === 0) {
    //   alert('하나 이상의 학과를 선택하세요.');
    //   return;
    // }

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
    // 로딩 상태를 true로 설정
    setIsLoading(true);
    onAIQuizSave(formData);
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
    // if (!selectedSubject) {
    //   alert('주제를 입력해주세요.');
    //   return false;
    // }
    // if (!selectedChapter) {
    //   alert('챕터를 입력해주세요.');
    //   return false;
    // }
    // if (!selected1.length) {
    //   alert('학습 키워드를 입력해주세요.');
    //   return false;
    // }
    // if (!selected2.length) {
    //   alert('스킬을 입력해주세요.');
    //   return false;
    // }
    if (!selectedUniversity) {
      alert('추천 대학을 입력해주세요.');
      return false;
    }

    // if (selectedJob.length === 0) {
    //   alert('추천 학과를 입력해주세요.');
    //   return false;
    // }
    // if (jobLevel.length === 0) {
    //   alert('추천 학년을 입력해주세요.');
    //   return false;
    // }
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
        publishStatus: selectedOption === 'true' ? '0002' : '0001',
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
  };

  const [keyWorldKnowledge, setKeyWorldKnowledge] = useState('');
  const [quizSearch, setQuizSearch] = React.useState('');

  const handleInputQuizSearchChange = event => {
    setQuizSearch(event.target.value);
  };

  function searchKeyworldKnowledge(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorldKnowledge(_keyworld);
  }

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

  const handleEditQuiz = index => {
    const quizToEdit = quizList[index];
    setQuestion(quizToEdit.question);
    setModelAnswerFinal(quizToEdit.modelAnswer);
    setSelected3(quizToEdit.modelAnswerKeywords);
    setEditingIndex(index);
    setIsModify(true);
  };

  const handleChangeQuizType = event => {
    setSortQuizType(event.target.value);
    setQuizList([]);
    setQuestion('');
    setModelAnswerFinal('');
    setSelected3([]);
    setQuizCount(1);
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

  const toggleDrawer = (newOpen: boolean) => () => {
    console.log('click node drawer');
    setOpen(newOpen);
  };

  const handleContentUrlChange = event => {
    setContentUrl(event.target.value);
  };
  const handleInputSubjectChange = event => {
    setSelectedSubject(event.target.value);
  };
  const handleContentTitleChange = event => {
    setContentTitle(event.target.value);
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

    setSelectedJob(data.jobs.map(item => item.code) || []);
    setSelected2(data.skills);
    setFileName(data.name);
    setFileNameCopy(data.name);
    setQuizCount(1);
    setQuizList([]);
    // setFileName(data.name);
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

  // T를 공백으로 바꾸고 소수점 부분을 제거하는 함수
  const formatDate = date => {
    return date?.split('.')[0].replace('T', ' '); // T를 공백으로 바꾸고 소수점 이하 제거
  };

  useDidMountEffect(() => {
    setMemberParams({
      // ...params,
      page,
      keyword: searchKeyword,
    });
    window.scrollTo(0, 0);
  }, [page, searchKeyword]);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 시 기본 동작 방지
      setSearchKeyword(search); // 검색 함수 실행
      setPage(1);
    }
  };

  const handleChangeContent = event => {
    console.log(event.target.value);
    setContentSortType(event.target.value);
  };

  const handleDelete = quizSequence => {
    if (confirm('퀴즈를 삭제하시겠습니까?')) {
      let params = {
        quizSequence: quizSequence,
      };
      onQuizContentDelete(params);
    }
  };

  const handleQuestionChange = event => {
    setQuestion(event.target.value);
  };
  const handleModelAnswerChange = event => {
    setModelAnswerFinal(event.target.value);
  };

  useEffect(() => {
    setQuizParams({
      page: quizPage,
      keyword: keyWorldKnowledge,
      sortType: sortType,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [quizPage, keyWorldKnowledge, sortType]);

  const newCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

  const handleCloseDrawer = () => {
    setIsContentModalClick(false);
    setActive('');
    setContentTitle('');
    setContentUrl('');
    setSelectedSubject('');
    setSelectedChapter('');
    setSelected1([]);
    setSelected2([]);
    setUniversityCode('');
    setSelectedUniversity('');
    setSelectedJob([]);
    setPersonName([]);
    setJobLevel([]);
    setQuizList([]);
    setQuizCount(1);
    setFileName('');
    setFileNameCopy([]);
    setContentType('');
    setSelectedOption('false');
    toggleDrawer(false);
    setOpen(false);
  };

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          {isMemberListFetched && (
            <>
              <Desktop>
                <div>
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <div className="tw-font-bold tw-text-xl tw-text-black tw-p-0">퀴즈 관리</div>
                    <TextField
                      size="small"
                      value={search} // 상태값을 TextField에 반영
                      placeholder="검색"
                      onChange={e => setSearch(e.target.value)} // 입력된 값 업데이트
                      onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
                      InputProps={{
                        style: { height: '43px' },
                        startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                      }}
                    />
                  </div>
                  <div className="tw-flex tw-items-center tw-justify-end tw-py-5">
                    <button
                      onClick={toggleDrawer(true)}
                      type="button"
                      data-tooltip-target="tooltip-default"
                      className="tw-py-2 tw-px-5 tw-mr-3 tw-bg-blue-600 tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-medium  tw-rounded-md"
                    >
                      등록
                    </button>
                  </div>
                  <TableContainer
                    style={{
                      overflowY: 'auto', // 높이를 초과하면 스크롤이 생김
                    }}
                  >
                    <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                      <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                        <TableRow>
                          <TableCell align="left" width={160}>
                            <div className="tw-text-base tw-font-bold">등록일자</div>
                          </TableCell>
                          <TableCell align="left" width={100}>
                            <div className=" tw-text-base tw-font-bold">등록자</div>
                          </TableCell>
                          <TableCell align="left" width={250}>
                            <div className=" tw-text-base tw-font-bold">퀴즈 타이틀</div>
                          </TableCell>
                          <TableCell align="left" width={100}>
                            <div className=" tw-text-base tw-font-bold">풀린횟수</div>
                          </TableCell>
                          <TableCell align="left" width={100}>
                            <div className=" tw-text-base tw-font-bold">복사횟수</div>
                          </TableCell>
                          <TableCell align="left" width={100}>
                            <div className=" tw-text-base tw-font-bold">삭제하기</div>
                          </TableCell>
                          <TableCell align="left" width={250}>
                            <div className=" tw-text-base tw-font-bold">지식콘텐츠</div>
                          </TableCell>
                          <TableCell align="left" width={180}>
                            <div className=" tw-text-base tw-font-bold">추천대학</div>
                          </TableCell>
                          <TableCell align="left" width={180}>
                            <div className=" tw-text-base tw-font-bold">추천학과</div>
                          </TableCell>
                          <TableCell align="left" width={180}>
                            <div className=" tw-text-base tw-font-bold">추천레벨</div>
                          </TableCell>
                          <TableCell align="left" width={130}>
                            <div className=" tw-text-base tw-font-bold">태그</div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contents.length > 0 ? (
                          contents.map((content, index) => (
                            <TableRow key={index}>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-base">
                                  <span className="tw-text-sm tw-font-medium">{formatDate(content?.createdAt)}</span>
                                </div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm tw-line-clamp-1">{content.creatorName}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm   tw-line-clamp-1">{content.question}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm ">{content.activeCount}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">{content.answerCount}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <button
                                  onClick={() => handleDelete(content.quizSequence)}
                                  type="button"
                                  data-tooltip-target="tooltip-default"
                                  className="tw-py-2 tw-px-5 tw-bg-black tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-rounded-md"
                                >
                                  삭제
                                </button>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm tw-line-clamp-1">{content.contentName}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm">
                                  {content.jobGroups?.map(item => item.name).join(', ')}
                                </div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm tw-line-clamp-1">
                                  {content.jobs?.map(item => item.name).join(', ')}
                                </div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm  tw-line-clamp-1">
                                  {content?.jobLevels?.map(item => item.name).join(', ')}
                                </div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className=" tw-text-sm tw-line-clamp-1">{content.skills.join(', ')}</div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell align="center" colSpan={6}>
                              <div className="tw-text-sm tw-text-gray-500">데이터가 없습니다</div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <div className="tw-mt-10">
                    <Pagination page={page} setPage={setPage} total={totalPage} />
                  </div>
                </div>
              </Desktop>
            </>
          )}
          <Drawer anchor={'right'} open={open} onClose={handleCloseDrawer}>
            <div className="tw-flex tw-justify-end">
              <IconButton onClick={handleCloseDrawer}>
                <CancelIcon />
              </IconButton>
            </div>
            <div className={`tw-p-5 ${isContentModalClick ? 'tw-flex' : ' '}`}>
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
                          {isContentModalClick ? '지식콘텐츠 닫기' : '지식콘텐츠 불러오기'}
                        </button>
                      )}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                    <div className="tw-text-sm tw-font-bold tw-py-2">
                      지식콘텐츠 유형<span className="tw-text-red-500 tw-ml-1">*</span>
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
                              <button
                                className=" tw-text-sm tw-text-left tw-text-[#31343d]"
                                onClick={handleButtonClick}
                              >
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
                      추천 대학<span className="tw-text-red-500 tw-ml-1">*</span>
                    </div>
                    <select
                      className="form-select"
                      onChange={handleUniversityChange}
                      aria-label="Default select example"
                      disabled={isContentModalClick}
                      value={universityCode}
                    >
                      <option value="">대학을 선택해주세요.</option>
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
                            return (
                              <span style={{ color: 'gray' }}>추천 대학을 먼저 선택하고, 학과를 선택해주세요.</span>
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
                        <Tag
                          value={selected1}
                          onChange={setSelected1}
                          placeHolder="학습 키워드 입력 후 엔터를 쳐주세요."
                        />
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
                          className="border tw-p-2 tw-mb-2 tw-rounded-lg"
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
          </Drawer>
          <div className="tw-mt-10">{/* <Pagination page={page} setPage={setPage} total={totalPage} /> */}</div>
        </div>
      </section>
    </div>
  );
}
