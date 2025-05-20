// QuizClubDetailInfo.jsx
import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

/** import pagenation */
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useMyClubList } from 'src/services/seminars/seminars.queries';

/**icon */
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SettingsIcon from '@mui/icons-material/Settings';

import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import SearchIcon from '@mui/icons-material/Search';
import router from 'next/router';

import { CommunityCard } from 'src/stories/components';
import { Button, Typography, Profile, Modal, ArticleCard } from 'src/stories/components';
const cx = classNames.bind(styles);

//comment
import {
  useQuizAnswerDetail,
  useQuizRankDetail,
  useQuizSolutionDetail,
  useQuizMyClubInfo,
} from 'src/services/quiz/quiz.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import CircularProgress from '@mui/material/CircularProgress';
import { useAIQuizAnswer } from 'src/services/quiz/quiz.mutations';

const AIQuizList = ({
  contentUrl,
  contentType,
  contentSequence,
  selectedJob,
  quiz,
  sortQuizType,
  index,
  handleEditQuiz,
  handleDeleteQuiz,
  updateQuizList,
  isContentModalClick,
  fileList,
  isGlobalLoading,
  setIsGlobalLoading,
  jobLevel,
}) => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [quizList, setQuizList] = useState({});
  const {
    mutate: onAIQuizAnswer,
    isSuccess: answerSuccess,
    isError: answerError,
    data: aiQuizAnswerData,
  } = useAIQuizAnswer();

  useEffect(() => {
    if (answerSuccess || answerError) {
      setIsLoadingAI(false);
      setIsGlobalLoading(false);
    }
  }, [answerSuccess, answerError]);

  useEffect(() => {
    if (quiz) {
      setQuizList(quiz);
    }
  }, [quiz]);

  useEffect(() => {
    if (contentUrl) {
      console.log('contentUrl', contentUrl);
    }
  }, [contentUrl]);

  useEffect(() => {
    if (aiQuizAnswerData) {
      const updatedQuizList = {
        ...quizList,
        modelAnswer: aiQuizAnswerData[0].answer,
        modelAnswerKeywords: aiQuizAnswerData[0].keywords,
      };
      setQuizList(updatedQuizList);
      console.log('updatedQuizList', updatedQuizList);
      updateQuizList(updatedQuizList);
    }
  }, [aiQuizAnswerData]);

  const handleAIAnswerClick = async (quizIndex, quiz) => {
    if (!contentType) {
      alert('지식콘텐츠 유형을 선택하세요.');
      return;
    }

    if (contentType !== '0320' && !contentUrl) {
      alert('콘텐츠 URL을 입력해주세요.');
      return false;
    }

    // Find the specific quiz in quizList and create formattedQuizList
    const params = {
      isNew: isContentModalClick ? false : true,
      contentSequence: contentSequence,
      contentType: contentType,
      jobs: selectedJob,
      jobLevels: jobLevel,
      quizzes: [
        {
          no: index + 1,
          question: quizList.question,
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
    setIsGlobalLoading(true);
    onAIQuizAnswer(formData); // Ensure this function returns a promise
  };

  const handleDeleteQuizLoading = question => {
    if (isGlobalLoading) {
      alert('모범 답안 생성중에는 삭제할 수 없습니다.');
      return;
    } else {
      handleDeleteQuiz(question);
    }
  };

  return (
    <div className="border tw-rounded-lg tw-my-5">
      <div className="border-bottom tw-bg-gray-100 tw-px-5 tw-py-3">
        <div className="tw-flex tw-justify-between tw-items-center">
          <div className="tw-flex-none tw-w-14 tw-items-center">
            <div className="tw-flex tw-flex-col tw-items-center">
              <img className="tw-w-10 border tw-rounded-full" src="/assets/images/main/ellipse_201.png" alt={`Quiz`} />
              <p className="tw-pt-1 tw-text-sm tw-text-center tw-text-black">퀴즈 {index + 1}</p>
            </div>
          </div>
          <div className={`tw-flex-auto tw-px-5 tw-text-sm ${isContentModalClick ? 'tw-w-[250px]' : ''}`}>
            {quizList?.question}
          </div>
          <div className="tw-flex-auto tw-w-[200px] tw-flex tw-justify-end">
            {sortQuizType === 'DESC' && (
              <button
                onClick={() => handleEditQuiz(index)}
                className="tw-mr-3 tw-px-4 tw-py-2 tw-text-sm tw-bg-gray-300 tw-rounded-md "
              >
                수정하기
              </button>
            )}
            <button
              onClick={() => handleDeleteQuizLoading(quizList?.question)}
              className="tw-px-4 tw-py-2 tw-text-sm tw-bg-gray-300 tw-rounded-md"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
      <div className="tw-flex tw-justify-start tw-items-center tw-px-2 tw-pt-5">
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
        <div className="tw-p-5 tw-flex-col tw-items-center tw-w-full">
          {quizList?.modelAnswer && quizList.modelAnswer.trim() !== '' ? (
            <p className={`tw-py-5 tw-text-sm tw-font-medium tw-text-left ${isContentModalClick ? 'tw-w-full' : ''}`}>
              {quizList.modelAnswer}
            </p>
          ) : (
            <div className="tw-text-center tw-pb-5">
              <button
                onClick={() => {
                  // Add your button click handler logic here
                  handleAIAnswerClick(index, quizList.question);
                }}
                className="tw-mt-2  tw-w-[140px] tw-px-4 tw-py-2 tw-text-white tw-bg-black tw-rounded tw-text-sm"
              >
                {isLoadingAI ? <CircularProgress color="info" size={18} /> : '모범 답안 생성'}
              </button>
            </div>
          )}

          <div className="tw-flex tw-items-center tw-py-5 tw-pb-0 tw-text-sm tw-font-bold tw-gap-2 tw-flex-wrap">
            채점기준 주요 키워드/문구 :
            {Array.isArray(quizList?.modelAnswerKeywords) ? (
              quizList.modelAnswerKeywords.map((tag, tagIndex) => (
                <div
                  key={tagIndex}
                  className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-gray-400"
                >
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-white">
                    {tag}
                  </p>
                </div>
              ))
            ) : typeof quizList?.modelAnswerKeywords === 'string' ? (
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-gray-400">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-white">
                  {quizList.modelAnswerKeywords}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuizList;
