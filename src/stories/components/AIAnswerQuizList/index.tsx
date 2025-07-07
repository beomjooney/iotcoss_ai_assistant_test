// QuizClubDetailInfo.jsx
import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useAIQuizAnswerList, useAIQuizAnswerListPut } from 'src/services/quiz/quiz.mutations';

const AIAnswerQuizList = ({ info, refetchReply }) => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [value, setValue] = useState('');
  const [valueAI, setValueAI] = useState(null);

  const { mutate: onAIQuizAnswer, isError, isSuccess: answerSuccess, data: aiQuizAnswerData } = useAIQuizAnswerList();
  const {
    mutate: onAIQuizAnswerPut,
    isSuccess: answerSuccessPut,
    data: aiQuizAnswerDataPut,
  } = useAIQuizAnswerListPut();

  useEffect(() => {
    if (answerSuccessPut) {
      alert('AI 채점과 교수 채점이 저장되었습니다.');
    }
  }, [answerSuccessPut]);

  useEffect(() => {
    if (aiQuizAnswerData) {
      refetchReply();
    }
  }, [aiQuizAnswerData]);

  useEffect(() => {
    if (isError) {
      setIsLoadingAI(false);
    }
  }, [isError]);

  useEffect(() => {
    if (info) {
      setValueAI(info.gradingAi || '');
      setValue(info.gradingFinal);
    }
  }, [info]);

  useEffect(() => {
    if (answerSuccess) {
      setIsLoadingAI(false);
    }
  }, [answerSuccess]);

  const handleAIAnswerClick = async () => {
    if (info?.answerStatus !== '0003') {
      alert('답변이 없습니다.');
      return;
    }

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
    console.log(valueAI);
    console.log('value', value);

    if (value === null || value === '') {
      alert('교수 채점 기준을 입력하세요.');
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
        value={valueAI || ''}
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
      <span className="tw-text-xl tw-text-center tw-text-[#31343d]">/</span>
      <input
        value={value || ''}
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
        className={`tw-w-[110px] tw-bg-black tw-rounded-md tw-text-sm tw-text-white tw-py-2.5 tw-ml-2
              ${valueAI !== null && valueAI !== '' ? 'tw-bg-gray-400' : 'tw-bg-black'}
              disabled:tw-bg-gray-400 max-lg:tw-mr-1`}
        disabled={valueAI !== null && valueAI !== ''} // 초기값이거나 빈 값일 때 활성화
        onClick={() => {
          handleAIAnswerClick();
        }}
      >
        {isLoadingAI ? <CircularProgress color="info" size={18} /> : 'AI 채점/피드백'}
      </button>
    </div>
  );
};

export default AIAnswerQuizList;
