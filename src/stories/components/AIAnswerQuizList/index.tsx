// QuizClubDetailInfo.jsx
import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useAIQuizAnswerList, useAIQuizAnswerListPut } from 'src/services/quiz/quiz.mutations';

interface AIAnswerQuizListProps {
  info: any;
  refetchReply: () => void;
  onGradeChange?: (score: string) => void;
  initialValue?: string;
}

const AIAnswerQuizList = ({ info, refetchReply, onGradeChange, initialValue = '' }: AIAnswerQuizListProps) => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [valueAI, setValueAI] = useState(null);
  const [isUserEditing, setIsUserEditing] = useState(false); // 사용자 수정 상태 추가
  console.log('info', info);

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
      // API 응답에서 grading 값을 valueAI에 설정
      const responseData = aiQuizAnswerData as { data?: { grading?: number } };
      if (responseData?.data?.grading !== undefined) {
        setValueAI(String(responseData.data.grading));
      }
      // refetchReply는 부모 컴포넌트에서 전체 목록을 다시 가져오는 함수이므로 호출해도 됩니다.
      // 하지만 AI 채점 후에는 부모 컴포넌트에서 자동으로 목록이 갱신되므로 호출하지 않아도 됩니다.
      refetchReply();
    }
  }, [aiQuizAnswerData]);

  useEffect(() => {
    if (isError) {
      setIsLoadingAI(false);
    }
  }, [isError]);

  // 퀴즈가 변경되면 수정 상태 초기화
  useEffect(() => {
    setIsUserEditing(false);
  }, [info?.quizSequence]);

  useEffect(() => {
    if (info) {
      setValueAI(info.gradingAi || '');
      // 사용자가 수정 중이 아닐 때만 기존 데이터 설정
      if (!isUserEditing) {
        const existingGrade = info.gradingFinal || initialValue;
        setValue(existingGrade);
        // 부모 컴포넌트에도 기존 데이터 전달
        if (existingGrade && onGradeChange) {
          onGradeChange(existingGrade);
        }
      }
    }
  }, [info, initialValue, isUserEditing]);

  // initialValue가 변경되면 value 업데이트 (기존 데이터가 없고 사용자가 수정 중이 아닐 때만)
  useEffect(() => {
    if (!info?.gradingFinal && !isUserEditing) {
      setValue(initialValue);
    }
  }, [initialValue, info?.gradingFinal, isUserEditing]);

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

  // 점수 입력 핸들러
  const handleGradeChange = e => {
    const inputValue = e.target.value;

    // 사용자가 수정을 시작했음을 표시
    setIsUserEditing(true);

    // 빈 값 허용
    if (inputValue === '') {
      setValue('');
      onGradeChange?.('');
      return;
    }

    // 숫자만 허용 (소수점 포함)
    const numericValue = inputValue.replace(/[^0-9.]/g, '');

    // 소수점이 여러 개인 경우 첫 번째만 유지
    const parts = numericValue.split('.');
    const formattedValue = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : numericValue;

    // 5점을 초과하지 않도록 제한
    const grade = parseFloat(formattedValue);
    if (!isNaN(grade) && grade > 5) {
      alert('점수는 0~5점 사이로 입력해주세요.');
      return;
    }

    setValue(formattedValue);
    onGradeChange?.(formattedValue);
  };

  // 점수 입력 완료 시 유효성 검증
  const handleGradeBlur = e => {
    const grade = parseFloat(e.target.value);

    if (e.target.value !== '' && (isNaN(grade) || grade < 0 || grade > 5)) {
      alert('점수는 0~5점 사이의 숫자로 입력해주세요.');
      setValue('');
      onGradeChange?.('');
      e.target.focus();
    }
  };

  // 입력 필드 포커스 시
  const handleGradeFocus = () => {
    setIsUserEditing(true);
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

    console.log('params', params);

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
        value={value}
        onChange={handleGradeChange}
        onBlur={handleGradeBlur}
        onFocus={handleGradeFocus}
        maxLength={3}
        style={{ padding: 0, height: 35, width: 45, textAlign: 'center' }}
        type="text"
        className="tw-bg-[#F6F7FB] tw-rounded tw-mx-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
        aria-label="점수 입력 (0~5점)"
        placeholder="0~5"
      />
      <button
        className=" max-lg:tw-mr-1 border tw-rounded-md tw-text-sm tw-text-black tw-py-2.5 tw-px-4"
        onClick={() => handleClick()}
        disabled={info.answerStatus !== '0003'}
      >
        저장
      </button>
      <button
        className={`tw-w-[110px] tw-bg-black tw-rounded-md tw-text-sm tw-text-white tw-py-2.5 tw-ml-2
              ${info.feedbackStatus === '0001' && info.answerStatus === '0003' ? 'tw-bg-black' : 'tw-bg-gray-400'}
              disabled:tw-bg-gray-400 max-lg:tw-mr-1`}
        disabled={info.answerStatus !== '0003' || info?.feedbackStatus === '0002'}
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
