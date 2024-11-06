import styles from './index.module.scss';
import React, { useState, useEffect } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { TextField } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { MentorsModal, Toggle, Tag } from 'src/stories/components';
import { TextareaAutosize } from '@mui/base';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  useDeletePostQuiz,
  useHidePostQuiz,
  usePublishPostQuiz,
  useQuizModify,
  useRecoverPostQuiz,
} from 'src/services/community/community.mutations';
import classNames from 'classnames/bind';
import { useOptions } from 'src/services/experiences/experiences.queries';
import { UseQueryResult } from 'react-query';

import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useQuizFileDownload } from 'src/services/quiz/quiz.queries';
import { useAIQuizAnswer } from 'src/services/quiz/quiz.mutations';

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

const KnowledgeComponent = ({ data, refetchMyQuiz, refetchMyQuizThresh, thresh = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [active, setActive] = useState('0100');
  const [contentType, setContentType] = useState('0100');
  const [contentUrl, setContentUrl] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [universityCode, setUniversityCode] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [jobLevel, setJobLevel] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState('');
  const [selected1, setSelected1] = useState([]);
  const [selected2, setSelected2] = useState([]);
  const [selected3, setSelected3] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState([]);
  const [question, setQuestion] = useState('');
  const [modelAnswerFinal, setModelAnswerFinal] = useState('');
  const [modelAnswerAi, setModelAnswerAi] = useState('');
  const [personName, setPersonName] = useState([]);
  const [isContentTitle, setIsContentTitle] = useState(false);
  const [isContent, setIsContent] = useState(false);

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  let [key, setKey] = useState('');
  let [fileName, setFileName] = useState('');

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { isFetched: isOptionFetched, data: optionsData }: UseQueryResult<any> = useOptions();

  const { mutate: onDeletePostQuiz, isSuccess: deletePostQuizSuccess } = useDeletePostQuiz();
  const { mutate: onRecoverPostQuiz, isSuccess: recoverPostQuizSuccess } = useRecoverPostQuiz();
  const { mutate: onHidePostQuiz, isSuccess: hidePostQuizSuccess } = useHidePostQuiz();
  const { mutate: onPublishPostQuiz, isSuccess: publishPostQuizSuccess } = usePublishPostQuiz();
  const { mutate: onQuizModify, isSuccess: quizModifySuccess } = useQuizModify();
  const {
    mutate: onAIQuizAnswer,
    isSuccess: answerSuccess,
    isError: answerError,
    data: aiQuizAnswerData,
  } = useAIQuizAnswer();

  useEffect(() => {
    if (answerSuccess || answerError) {
      setIsLoadingAI(false);
    }
  }, [answerSuccess, answerError]);

  useEffect(() => {
    if (aiQuizAnswerData) {
      // const updatedQuizList = {
      //   ...quizList,
      //   modelAnswer: aiQuizAnswerData[0].answer,
      // };
      // setQuizList(updatedQuizList);
      setModelAnswerFinal(aiQuizAnswerData[0].answer);
      console.log('aiQuizAnswerData', aiQuizAnswerData);
      // updateQuizList(updatedQuizList);
    }
  }, [aiQuizAnswerData]);

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
    if (deletePostQuizSuccess || hidePostQuizSuccess || publishPostQuizSuccess || recoverPostQuizSuccess) {
      refetchMyQuiz();
      refetchMyQuizThresh();
    }
  }, [deletePostQuizSuccess, hidePostQuizSuccess, publishPostQuizSuccess, recoverPostQuizSuccess]);

  useEffect(() => {
    if (quizModifySuccess) {
      refetchMyQuiz();
    }
  }, [quizModifySuccess]);

  const handleDelete = contentSequence => {
    // Handle delete action
    console.log('Delete clicked', contentSequence);
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      onDeletePostQuiz({
        quizSequence: data.quizSequence,
      });
    }
    handleClose();
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

  const handleRecover = contentSequence => {
    // Handle delete action
    console.log('Delete clicked', contentSequence);
    if (window.confirm('정말로 복구 하시겠습니까?')) {
      onRecoverPostQuiz({
        quizSequence: data.quizSequence,
      });
    }
    handleClose();
  };

  const handleHide = contentSequence => {
    // Handle delete action
    console.log('Delete clicked', contentSequence);
    if (window.confirm('정말로 비공개하시겠습니까?')) {
      onHidePostQuiz({
        quizSequence: data.quizSequence,
      });
    }
    handleClose();
  };

  const handlePublish = contentSequence => {
    // Handle delete action
    console.log('Delete clicked', contentSequence);
    if (window.confirm('정말로 공개하시겠습니까?')) {
      onPublishPostQuiz({
        quizSequence: data.quizSequence,
      });
    }
    handleClose();
  };

  const cx = classNames.bind(styles);

  const newCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };
  const handleUniversityChange = e => {
    const selectedCode = e.target.value;
    const selected = optionsData?.data?.jobs?.find(u => u.code === selectedCode);
    setUniversityCode(selectedCode);
    setSelectedUniversity(selectedCode);
    setSelectedUniversityName(selected ? selected.name : '');
    setJobs(selected ? selected.jobs : []);
    setSelectedJob([]); // Clear the selected job when university changes
  };

  const handleUpdate = contentSequence => {
    // Handle delete action
    console.log('Delete clicked', data);
    setUpdateFlag(true);
    setContentType(data.content.contentType);
    // setContentType('0200');
    setContentUrl(data.content.url);
    setContentTitle(data.content.description);
    setQuestion(data.question);
    setModelAnswerFinal(data.modelAnswer);
    setModelAnswerAi(data.modelAnswerAi);
    setSelectedSubject(data.content?.studySubject);
    setSelectedChapter(data.content?.studyChapter);
    setSelected2(data.content?.skills);
    setSelected1(data.content?.studyKeywords);
    setUniversityCode(data.jobGroups[0].code);
    setActiveQuiz(data.jobLevels && data.jobLevels.length > 0 ? data.jobLevels[0].code : '');

    const selected = optionsData?.data?.jobs?.find(u => u.code === data.jobGroups[0].code);
    setJobs(selected ? selected.jobs : []);
    const jobsCode = data.jobs.map(item => item.code);
    setSelectedJob(jobsCode || []);
    const jobsName = data.jobs.map(item => item.name);
    console.log(jobsName);
    setPersonName(jobsName || []);
    // Extracting the codes from the data array
    const extractedCodes = data.jobLevels.map(item => item.code);
    setJobLevel(extractedCodes || []);
    setSelected3(data?.modelAnswerKeywords);
    handleClose();
  };

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    setKey(key);
    setFileName(fileName);
  };

  const handleAIAnswerClick = async (quizIndex, quiz) => {
    if (!contentType) {
      alert('지식콘텐츠 유형을 선택하세요.');
      return;
    }

    if (contentType !== '0320' && !contentUrl) {
      alert('콘텐츠 URL을 입력해주세요.');
      return false;
    }

    if (!selectedJob || selectedJob.length === 0) {
      alert('하나 이상의 학과를 선택하세요.');
      return;
    }

    // Find the specific quiz in quizList and create formattedQuizList
    const params = {
      isNew: false,
      contentSequence: data.content.contentSequence,
      contentType: contentType,
      jobs: selectedJob,
      jobLevels: jobLevel,
      quizzes: [
        {
          no: 1,
          question: question,
        },
      ],
    };

    const formData = new FormData();

    if (contentType === '0320') {
      formData.append('file', fileList[0]);
    } else {
      params['contentUrl'] = contentUrl;
    }

    // 객체를 JSON 문자열로 변환합니다.
    const jsonString = JSON.stringify(params);
    // FormData에 JSON 문자열을 추가하면서 명시적으로 'Content-Type'을 설정합니다.
    const blob = new Blob([jsonString], { type: 'application/json' });
    formData.append('request', blob);

    console.log('ai quiz click', params);
    setIsLoadingAI(true);
    onAIQuizAnswer(formData); // Ensure this function returns a promise
  };

  const handleEditQuizContent = () => {
    console.log('edit quiz');

    setIsContent(true);
  };

  const handleEditSaveQuizContent = () => {
    console.log('edit save quiz');
    const params = {
      content: {
        isNew: false,
        contentSequence: data.content.contentSequence,
        contentType: contentType,
        description: contentTitle,
        url: contentUrl,
        studySubject: selectedSubject,
        studyChapter: selectedChapter,
        skills: selected2,
        studyKeywords: selected1,
      },
      question: question,
      modelAnswerFinal: modelAnswerFinal,
      modelAnswerKeywords: selected3,
      jobGroups: [universityCode],
      jobs: selectedJob,
      jobLevels: jobLevel,
    };

    const body = {
      quizzes: params,
      quizSequence: data.quizSequence,
    };

    onQuizModify(body);

    setIsContent(false);
  };

  const handleEditQuiz = () => {
    console.log('edit quiz');

    setIsContentTitle(true);
  };

  const handleEditSaveQuiz = () => {
    console.log('edit save quiz');
    const params = {
      content: {
        isNew: false,
        contentSequence: data.content.contentSequence,
        contentType: contentType,
        description: contentTitle,
        url: contentUrl,
        studySubject: selectedSubject,
        studyChapter: selectedChapter,
        skills: selected2,
        studyKeywords: selected1,
      },
      question: question,
      modelAnswerFinal: modelAnswerFinal,
      modelAnswerKeywords: selected3,
      jobGroups: [universityCode],
      jobs: selectedJob,
      jobLevels: jobLevel,
    };

    const body = {
      quizzes: params,
      quizSequence: data.quizSequence,
    };

    onQuizModify(body);
    setIsContentTitle(false);
  };

  return (
    <div>
      <div className="tw-pb-6">
        <div className="tw-flex tw-justify-between tw-items-center tw-px-8  tw-h-20 tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb]">
          <div className="tw-flex tw-items-center tw-gap-5  tw-text-base tw-text-left tw-text-black">
            <div className="tw-text-sm tw-text-center tw-text-[#9ca5b2] tw-w-14 tw-text-white tw-bg-black tw-rounded tw-py-1  ">
              {data.publishStatus === '0001' ? '비공개' : '공개'}
            </div>
            <div className=" tw-text-left tw-text-black">{data.question}</div>
          </div>
          <div className="tw-flex tw-w-64 tw-justify-end tw-items-center tw-gap-5">
            <p className="tw-text-sm tw-text-right tw-text-[#9ca5b2]">{data.createdAt}</p>
            <svg
              onClick={handleClick}
              width={28}
              height={28}
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-w-7 tw-h-7 tw-relative"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M14 8.75C14.9665 8.75 15.75 7.9665 15.75 7C15.75 6.0335 14.9665 5.25 14 5.25C13.0335 5.25 12.25 6.0335 12.25 7C12.25 7.9665 13.0335 8.75 14 8.75Z"
                fill="#6A7380"
              />
              <path
                d="M14 15.75C14.9665 15.75 15.75 14.9665 15.75 14C15.75 13.0335 14.9665 12.25 14 12.25C13.0335 12.25 12.25 13.0335 12.25 14C12.25 14.9665 13.0335 15.75 14 15.75Z"
                fill="#6A7380"
              />
              <path
                d="M14 22.75C14.9665 22.75 15.75 21.9665 15.75 21C15.75 20.0335 14.9665 19.25 14 19.25C13.0335 19.25 12.25 20.0335 12.25 21C12.25 21.9665 13.0335 22.75 14 22.75Z"
                fill="#6A7380"
              />
            </svg>
          </div>
        </div>

        <div className="tw-p-5 tw-mt-3 tw-flex-grow-0 tw-flex-shrink-0  tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border">
          <div className="tw-pb-5 tw-flex tw-justify-start tw-items-center text-sm tw-left-[52px] tw-top-5 tw-gap-2">
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-w-6 tw-h-6 tw-left-4 tw-top-4"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                stroke="#9CA5B2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <Menu
              disableScrollLock={true}
              id="account-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                '.MuiPaper-root': {
                  boxShadow: 'none',
                  border: '1px solid #E0E0E0',
                },
              }}
            >
              {thresh ? (
                <div>
                  <MenuItem onClick={handleRecover}>복구하기</MenuItem>
                  <MenuItem onClick={handleDelete}>영구 삭제하기</MenuItem>
                </div>
              ) : (
                <div>
                  <MenuItem onClick={handleUpdate}>퀴즈 수정하기</MenuItem>
                  <MenuItem onClick={handleDelete}>삭제하기</MenuItem>
                  {data.publishStatus === '0001' ? (
                    <MenuItem onClick={handlePublish}>퀴즈 공개</MenuItem>
                  ) : (
                    <MenuItem onClick={handleHide}>퀴즈 비공개</MenuItem>
                  )}
                </div>
              )}
            </Menu>

            {/* Render tags */}
            <div className="tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500">
              <div className="tw-flex tw-flex-wrap tw-gap-3">
                {data?.jobGroups[0]?.name && (
                  <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-[10.5px]">
                    <p className="tw-text-[12.25px] tw-text-[#235a8d]">{data?.jobGroups[0]?.name}</p>
                  </div>
                )}

                {data?.jobs?.length > 0 &&
                  data.jobs.map(
                    (job, index) =>
                      job?.name && (
                        <div key={index} className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-[10.5px]">
                          <p className="tw-text-[12.25px] tw-text-[#b83333]">{job.name}</p>
                        </div>
                      ),
                  )}

                {data?.jobLevels?.length > 0 &&
                  data.jobLevels.map((jobLevel, index) => (
                    <div key={index} className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-[10.5px]">
                      <p className="tw-text-[12.25px] tw-text-[#313b49]">{jobLevel.name || 'N/A'}</p>
                    </div>
                  ))}
                {data?.content?.skills?.map((hashtag, hashtagIndex) => (
                  <div key={hashtagIndex} className=" tw-rounded-[3.5px] tw-px-[5px]">
                    <p className="tw-text-[12.25px] tw-text-[#313b49]">#{hashtag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="tw-flex tw-px-8">
            <p className="tw-w-[85px] text-sm tw-font-bold tw-left-[52px] tw-top-[58px] tw-text-sm tw-pr-3 tw-text-left tw-text-[#31343d]">
              모범답안
            </p>
            <p className="tw-w-[973px] text-sm tw-left-[119px] tw-top-[58px] tw-text-sm tw-text-left tw-text-[#31343d] tw-line-clamp-2">
              {data.modelAnswer}
            </p>
          </div>
          <div className="tw-flex tw-px-8 tw-pt-2">
            <p className="tw-w-[110px] text-sm tw-font-bold tw-left-[52px] tw-top-[58px] tw-text-sm tw-pr-3 tw-text-left tw-text-[#31343d]">
              모범답안 키워드
            </p>
            {data?.modelAnswerKeywords?.map((hashtag, hashtagIndex) => (
              <div key={hashtagIndex} className=" tw-rounded-[3.5px] tw-px-[5px]">
                <p className="tw-text-[12.25px] tw-text-[#313b49] tw-font-bold">#{hashtag}</p>
              </div>
            ))}
          </div>

          <div className="tw-flex  tw-justify-between tw-px-8 tw-pt-2">
            <div className="tw-flex tw-justify-start tw-items-start">
              <p className="tw-text-sm tw-text-left tw-text-[#31343d] tw-pr-3 tw-font-bold ">지식콘텐츠</p>
              {data?.content?.contentType === '0320' ? (
                <p
                  onClick={() => {
                    onFileDownload(data?.content?.url, data?.content?.name);
                  }}
                  className="tw-cursor-pointer tw-underline tw-text-sm tw-font-medium tw-text-left tw-text-[#9ca5b2]"
                >
                  {data?.content?.name}
                </p>
              ) : (
                <p
                  onClick={() => window.open(data?.content?.url, '_blank')}
                  className="tw-w-[600px] tw-line-clamp-1 tw-cursor-pointer tw-text-sm tw-font-medium tw-text-left tw-text-[#9ca5b2]"
                >
                  {data?.content?.url}
                </p>
              )}
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-gap-2">
              <div className="tw-w-10 tw-h-[21px]">
                <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-0 tw-gap-1">
                  <svg
                    width={20}
                    height={21}
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M4.2859 13.4476L4.9859 13.5912C5.01854 13.4312 4.99535 13.2648 4.92019 13.1198L4.2859 13.4476ZM7.05233 16.2141L7.38019 15.5798C7.23518 15.5046 7.06879 15.4814 6.90876 15.5141L7.05233 16.2141ZM3.57162 16.9284L2.87162 16.7848C2.84793 16.9006 2.85333 17.0204 2.88735 17.1336C2.92137 17.2468 2.98294 17.3497 3.06654 17.4333C3.15014 17.5168 3.25316 17.5783 3.36637 17.6122C3.47957 17.6461 3.59943 17.6514 3.71519 17.6276L3.57162 16.9284ZM15.7145 10.4998C15.7145 12.0153 15.1124 13.4688 14.0408 14.5404C12.9692 15.612 11.5157 16.2141 10.0002 16.2141V17.6426C13.9452 17.6426 17.143 14.4448 17.143 10.4998H15.7145ZM4.2859 10.4998C4.2859 8.98427 4.88794 7.53082 5.95958 6.45918C7.03121 5.38754 8.48467 4.78551 10.0002 4.78551V3.35693C6.05519 3.35693 2.85733 6.55479 2.85733 10.4998H4.2859ZM10.0002 4.78551C11.5157 4.78551 12.9692 5.38754 14.0408 6.45918C15.1124 7.53082 15.7145 8.98427 15.7145 10.4998H17.143C17.143 6.55479 13.9452 3.35693 10.0002 3.35693V4.78551ZM4.92019 13.1198C4.50182 12.3099 4.28428 11.4113 4.2859 10.4998H2.85733C2.85733 11.6791 3.14305 12.7934 3.65162 13.7755L4.92019 13.1198ZM10.0002 16.2141C9.08866 16.2155 8.19013 15.998 7.38019 15.5798L6.72447 16.8484C7.73701 17.3716 8.86043 17.6441 10.0002 17.6426V16.2141ZM3.5859 13.3041L2.87162 16.7848L4.27162 17.0719L4.9859 13.5912L3.5859 13.3041ZM3.71519 17.6276L7.1959 16.9141L6.90876 15.5141L3.42805 16.2284L3.71519 17.6276Z"
                      fill="#9CA5B2"
                    />
                    <path
                      d="M7.85712 9.07129H12.1428"
                      stroke="#9CA5b2"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.85712 11.9282H12.1428"
                      stroke="#9CA5b2"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                    {data.answerCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MentorsModal
        isQuiz={true}
        title={'퀴즈 수정하기'}
        isContentModalClick={false}
        isOpen={updateFlag}
        onAfterClose={() => {
          setUpdateFlag(false);
        }}
      >
        <div>
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
                  <div className="tw-text-lg tw-font-bold">지식콘텐츠 정보 입력</div>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                <div className="tw-text-sm tw-font-bold tw-py-2">지식콘텐츠 유형</div>
                <div className={cx('mentoring-button__group', 'tw-px-0', 'tw-justify-center', 'tw-items-center')}>
                  {studyStatus.map((item, i) => (
                    <Toggle
                      key={item.id}
                      label={item.name}
                      name={item.name}
                      value={item.id}
                      variant="small"
                      checked={contentType === item.id}
                      isActive
                      type="tabButton"
                      onChange={() => {
                        setContentType(item.id);
                      }}
                      className={cx('tw-mr-2 !tw-w-[90px]')}
                      disabled
                    />
                  ))}
                </div>

                {contentType === '0320' ? (
                  <div>
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">파일 업로드</div>
                    <div className="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-text-center">
                      <div
                        className="tw-cursor-pointer tw-underline"
                        onClick={() => {
                          onFileDownload(data?.content?.url, data?.content?.name);
                        }}
                      >
                        {data.content.name || '파일정보가 없습니다.'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식콘텐츠 URL</div>
                    <TextField
                      required
                      disabled
                      value={contentUrl}
                      onChange={e => setContentUrl(e.target.value)}
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

                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식콘텐츠 제목</div>
                <TextField
                  required
                  id="username"
                  value={contentTitle}
                  onChange={e => setContentTitle(e.target.value)}
                  name="username"
                  disabled
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
                <div className="tw-text-sm tw-font-bold tw-py-2">추천 대학</div>
                <select
                  className="form-select"
                  onChange={handleUniversityChange}
                  disabled
                  aria-label="Default select example"
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
                    disabled
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
                    // disabled={jobs.length === 0}
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
                    value={item.code}
                    variant="small"
                    checked={jobLevel.indexOf(item.code) >= 0}
                    isActive
                    disabled
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
                  type="search"
                  value={selectedSubject}
                  size="small"
                  disabled
                  onChange={e => setSelectedSubject(e.target.value)}
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
                  onChange={e => setSelectedChapter(e.target.value)}
                  variant="outlined"
                  type="search"
                  size="small"
                  fullWidth
                  disabled
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                  }}
                />
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">학습 키워드</div>

                <div className="tw-flex tw-gap-2 tw-flex-wrap">
                  {selected1.length > 0 &&
                    selected1.map((job, index) => (
                      <div key={index} className="tw-bg-gray-400 tw-rounded-[3.5px]  tw-px-3 tw-py-1">
                        <p className="tw-text-[12.25px] tw-text-white">{job || 'N/A'}</p>
                      </div>
                    ))}
                </div>
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">관련 기술</div>
                <div className="tw-flex tw-gap-2 tw-flex-wrap">
                  {selected2.length > 0 &&
                    selected2.map((job, index) => (
                      <div key={index} className="tw-bg-gray-400  tw-rounded-[3.5px] tw-px-3 tw-py-1">
                        <p className="tw-text-[12.25px] tw-text-white">{job || 'N/A'}</p>
                      </div>
                    ))}
                </div>
                {/* <TagsInput value={selected2} onChange={setSelected2} name="fruits" disabled placeHolder="" /> */}
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded disableGutters sx={{ backgroundColor: '#e9ecf2' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="tw-text-lg tw-font-bold">퀴즈 정보 입력</div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                <div className="tw-flex tw-justify-between tw-items-center">
                  <div className="tw-text-base tw-font-bold tw-pt-5 tw-pb-2">퀴즈</div>
                  <div>
                    <button
                      onClick={() => {
                        handleAIAnswerClick(0, modelAnswerFinal);
                      }}
                      className="tw-mt-2 tw-px-3 tw-mr-2 tw-py-1 tw-text-black tw-bg-white border border-dark tw-rounded tw-text-sm"
                    >
                      {isLoadingAI ? <CircularProgress color="info" size={18} /> : 'AI모범답안 생성'}
                    </button>
                    <button
                      onClick={() => {
                        setUpdateFlag(false);
                      }}
                      className="tw-mt-2 tw-px-3 tw-py-1 tw-text-black tw-bg-white border border-dark tw-rounded tw-text-sm"
                    >
                      {'수정 완료'}
                    </button>
                  </div>
                </div>
                <div className="border tw-rounded-lg tw-my-2">
                  <div className="border-bottom tw-bg-gray-100 tw-px-5 tw-py-3">
                    <div className="tw-flex tw-justify-between tw-items-center">
                      <div className="tw-flex-none tw-w-14 tw-items-center">
                        <div className="tw-flex tw-flex-col tw-items-center">
                          <img
                            className="tw-w-10 border tw-rounded-full"
                            src="/assets/images/main/ellipse_201.png"
                            alt={`Quiz`}
                          />
                          <p className="tw-pt-1 tw-text-sm tw-text-center tw-text-black">퀴즈</p>
                        </div>
                      </div>
                      {isContentTitle ? (
                        <TextField
                          required
                          id="username"
                          name="username"
                          variant="outlined"
                          type="search"
                          value={question}
                          size="small"
                          onChange={e => setQuestion(e.target.value)}
                          fullWidth
                          sx={{
                            width: '430px',
                            backgroundColor: 'white',
                            '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                          }}
                        />
                      ) : (
                        <div className={`tw-flex-auto tw-px-5 tw-text-base }`}>{question}</div>
                      )}
                      <div className="tw-flex-auto tw-w-32 tw-flex tw-justify-end">
                        {isContentTitle ? (
                          <button
                            onClick={() => handleEditSaveQuiz()}
                            className="tw-px-5 tw-py-2.5 tw-text-sm tw-w-28 tw-bg-blue-500 tw-rounded-md tw-text-white"
                          >
                            저장
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditQuiz()}
                            className="tw-px-5 tw-py-2.5 tw-text-sm tw-w-28 border tw-bg-white tw-rounded-md "
                          >
                            수정하기
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-start tw-items-center tw-px-5 tw-pt-5">
                    <div className="tw-flex-none tw-w-14 tw-items-center">
                      <div className="tw-flex tw-flex-col tw-items-center">
                        <svg
                          width={24}
                          height={25}
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 relative"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M6 6.3252V12.3252C6 13.1208 6.31607 13.8839 6.87868 14.4465C7.44129 15.0091 8.20435 15.3252 9 15.3252H19M19 15.3252L15 11.3252M19 15.3252L15 19.3252"
                            stroke="#CED4DE"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="tw-flex-none tw-w-14 tw-items-center">
                      <div className="tw-flex tw-flex-col tw-items-center">
                        <img className="tw-w-9 border tw-rounded-full" src="/assets/images/main/ellipse_202.png" />
                        <p className="tw-pt-1 tw-text-sm tw-text-center tw-text-black">모범답안</p>
                      </div>
                    </div>
                    <div className="tw-p-5 tw-pr-0 tw-pt-0 tw-flex-col tw-items-center tw-w-full">
                      <div className="tw-flex  tw-items-center">
                        {isContent ? (
                          <div className="tw-pr-5 tw-pb-5 tw-pt-5 tw-w-full">
                            <TextareaAutosize
                              style={{
                                width: '100%',
                                height: 120,
                                borderRadius: '5px',
                                padding: 12,
                                resize: 'none',
                              }}
                              minRows={4}
                              required
                              id="username"
                              name="username"
                              value={modelAnswerFinal}
                              onChange={e => setModelAnswerFinal(e.target.value)}
                            />
                          </div>
                        ) : (
                          <p className="tw-pr-5 tw-pt-5 tw-text-base tw-font-medium tw-text-left">{modelAnswerFinal}</p>
                        )}

                        <div className="tw-w-32 tw-flex tw-justify-end">
                          {isContent ? (
                            <button
                              onClick={() => handleEditSaveQuizContent()}
                              className="tw-px-5 tw-py-2.5 tw-text-sm tw-w-28 tw-bg-blue-500 tw-rounded-md tw-text-white"
                            >
                              저장
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditQuizContent()}
                              className="tw-px-5 tw-py-2.5 tw-text-sm tw-w-28 border tw-bg-white tw-rounded-md "
                            >
                              수정하기
                            </button>
                          )}
                        </div>
                      </div>

                      {isContent ? (
                        <Tag
                          value={selected3}
                          onChange={setSelected3}
                          placeHolder="주요 키워드/문구 입력 후 엔터를 쳐주세요."
                        />
                      ) : (
                        <div className="tw-flex tw-items-center tw-pr-5 tw-pt-5 tw-pb-0 tw-text-sm tw-font-bold tw-gap-2 tw-flex-wrap">
                          채점기준 주요 키워드/문구 :
                          {selected3.map((tag, tagIndex) => (
                            <div
                              key={tagIndex}
                              className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-gray-400"
                            >
                              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-white">
                                {tag}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <div className="tw-py-5 tw-text-center"></div>
          </div>
        </div>
      </MentorsModal>
    </div>
  );
};

export default KnowledgeComponent;
