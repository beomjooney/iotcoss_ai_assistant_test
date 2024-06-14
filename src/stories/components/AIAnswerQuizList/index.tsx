// QuizClubDetailInfo.jsx
import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import CircularProgress from '@mui/material/CircularProgress';

import { useMyClubList } from 'src/services/seminars/seminars.queries';
import { useAIQuizAnswerList, useAIQuizAnswerListPut } from 'src/services/quiz/quiz.mutations';

/**icon */
const cx = classNames.bind(styles);

//comment
import {
  useQuizAnswerDetail,
  useQuizRankDetail,
  useQuizSolutionDetail,
  useQuizMyClubInfo,
} from 'src/services/quiz/quiz.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';

const AIAnswerQuizList = ({ info, refetchReply }) => {
  const [page, setPage] = useState(1);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [value, setValue] = useState('');
  const [valueAI, setValueAI] = useState('');
  const [quizList, setQuizList] = useState({});
  const { mutate: onAIQuizAnswer, isError, isSuccess: answerSuccess, data: aiQuizAnswerData } = useAIQuizAnswerList();
  const {
    mutate: onAIQuizAnswerPut,
    isSuccess: answerSuccessPut,
    data: aiQuizAnswerDataPut,
  } = useAIQuizAnswerListPut();

  useEffect(() => {
    if (aiQuizAnswerData) {
      refetchReply();
      // setValueAI(aiQuizAnswerData?.grading);
      // console.log('updatedQuizList', aiQuizAnswerData);
    }
  }, [aiQuizAnswerData]);
  useEffect(() => {
    if (isError) {
      // alert('AI 채점 실패');
      setIsLoadingAI(false);
    }
  }, [isError]);

  useEffect(() => {
    if (info) {
      setValueAI(info.gradingAi);
      setValue(info.gradingFinal);
    }
  }, [info]);

  useEffect(() => {
    if (answerSuccess) {
      setIsLoadingAI(false);
    }
  }, [answerSuccess]);

  const handleAIAnswerClick = async () => {
    // Find the specific quiz in quizList and create formattedQuizList
    const params = {
      clubSequence: info.clubSequence,
      quizSequence: info.quizSequence,
      memberUUID: info.member.memberUUID,
    };

    console.log('ai quiz click', params);
    setIsLoadingAI(true);

    onAIQuizAnswer(params); // Ensure this function returns a promise
  };

  const handleClick = () => {
    if (value.trim() === '') {
      alert('교수채점을 해주세요.');
      return;
    }

    const params = {
      clubSequence: info.clubSequence,
      quizSequence: info.quizSequence,
      memberUUID: info.member.memberUUID,
      grading: parseFloat(value),
    };

    onAIQuizAnswerPut(params);
  };

  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-gap-1">
      <input
        maxLength={3}
        disabled
        value={valueAI}
        style={{
          padding: 0,
          height: 35,
          width: 45,
          textAlign: 'center',
          backgroundColor: '#F6F7FB',
        }}
        type="text"
        className="tw-bg-[#F6F7FB] tw-rounded tw-mr-2"
        aria-label="Recipient's username with two button addons"
      />
      <p className="tw-text-xl tw-text-center tw-text-[#31343d]">/</p>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        maxLength={3}
        style={{ padding: 0, height: 35, width: 45, textAlign: 'center' }}
        type="text"
        className="tw-bg-[#F6F7FB] tw-rounded tw-mx-2"
        aria-label="Recipient's username with two button addons"
      />
      <button
        className=" max-lg:tw-mr-1 border tw-rounded-md tw-text-sm tw-text-black tw-py-2.5 tw-px-4"
        onClick={() => handleClick()}
      >
        저장
      </button>
      <button
        className="tw-w-[110px] tw-bg-black max-lg:tw-mr-1  tw-rounded-md tw-text-sm tw-text-white tw-py-2.5  tw-ml-2"
        onClick={() => {
          // Add your button click handler logic here
          handleAIAnswerClick();
        }}
      >
        {isLoadingAI ? <CircularProgress color="info" size={18} /> : '  AI피드백/채점'}
      </button>
    </div>
  );
};

export default AIAnswerQuizList;
