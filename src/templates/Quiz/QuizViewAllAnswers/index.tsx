import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'src/store';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import AIAnswerQuizList from 'src/stories/components/AIAnswerQuizList';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MentorsModal from 'src/stories/components/MentorsModal';
import CircularProgress from '@mui/material/CircularProgress';
import {
  useAIQuizAnswerSavePut,
  useAIQuizAnswerEvaluation,
  useAIQuizAnswerListPut,
} from 'src/services/quiz/quiz.mutations';
import Pagination from '@mui/material/Pagination';
import { useAIQuizAnswerList } from 'src/services/quiz/quiz.mutations';

import { v4 as uuidv4 } from 'uuid';
export const generateUUID = () => {
  return uuidv4();
};

import {
  useQuizAnswerMemberAIDetail,
  useQuizGetProgress,
  useQuizRoungeInfo,
  useQuizGetAIAnswer,
  useQuizGetAIAnswerGet,
  useQuizGetAIAnswerAll,
  useQuizFileDownload,
  useGetAIQuizAnswer,
} from 'src/services/quiz/quiz.queries';
import { info } from 'console';

const cx = classNames.bind(styles);
export interface QuizViewAllAnswersTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizViewAllAnswersTemplate({ id }: QuizViewAllAnswersTemplateProps) {
  const { user } = useStore();
  const router = useRouter();
  const { publishDate, quizSequence } = router.query;
  console.log('publishDate, quizSequence', publishDate, quizSequence, id);
  const [quizListData, setQuizListData] = useState<any[]>([]);
  const [contents, setContents] = useState<any>([]);
  const [quizProgressData, setQuizProgressData] = useState<any>([]);
  const [clubQuizThreads, setClubQuizThreads] = useState<any>([]);
  const [clubQuizGetThreads, setClubQuizGetThreads] = useState<any>('');
  const [clubQuizGetThreadsAll, setClubQuizGetThreadsAll] = useState<any>('');
  const [keyWorld, setKeyWorld] = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const [selectedValue, setSelectedValue] = useState(quizSequence || '');
  const [page, setPage] = useState(1);
  const [params, setParams] = useState<any>({ id, page });
  const [quizParams, setQuizParams] = useState<any>({});
  const [quizParamsAI, setQuizParamsAI] = useState<any>({});
  const [quizParamsAll, setQuizParamsAll] = useState<any>({});
  const [quizSaveParams, setQuizSaveParams] = useState<any>({});
  const [totalPage, setTotalPage] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isLoadingAIAll, setIsLoadingAIAll] = useState(false);
  const [isLoadingAIAllSave, setIsLoadingAIAllSave] = useState(false);
  const [isCompleteAI, setIsCompleteAI] = useState(false);
  const [isHideAI, setIsHideAI] = useState(true);
  const [isAIData, setIsAIData] = useState({});
  const [memberUUID, setMemberUUID] = useState('');
  const [triggerQuizAnswerRefetch, setTriggerQuizAnswerRefetch] = useState(false);
  let [key, setKey] = useState('');
  let [fileName, setFileName] = useState('');

  const { mutate: onAIQuizAnswer, isError, isSuccess: answerSuccess, data: aiQuizAnswerData } = useAIQuizAnswerList();

  useEffect(() => {
    if (isError) {
      setIsLoadingAI(false);
    }
  }, [isError]);

  const { isFetched: isParticipantListFetcheds, datas } = useQuizFileDownload(key, data => {
    // console.log('file download', data);
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
  });

  // Create a ref to hold the value of isCompleteAI
  const isCompleteAIRef = useRef(isCompleteAI);

  useEffect(() => {
    isCompleteAIRef.current = isCompleteAI;
  }, [isCompleteAI]);

  const {
    mutate: onAIQuizAnswerSavePut,
    isSuccess: answerSuccessSavePut,
    data: aiQuizAnswerDataSavePut,
  } = useAIQuizAnswerSavePut();

  const {
    mutate: onAIQuizAnswerEvaluation,
    isSuccess: answerSuccessEvaluation,
    isError: answerErrorEvaluation,
    data: aiQuizAnswerDataEvaluation,
  } = useAIQuizAnswerEvaluation();

  useEffect(() => {
    if (answerErrorEvaluation) {
      setIsLoadingAIAll(false);
      isCompleteAIRef.current = true;
      // interval이 실행 중이 아닐 때만 호출 (interval 내에서 이미 호출됨)
      if (!intervalId) {
        refetchQuizAnswerAll();
      }
    }
  }, [answerErrorEvaluation, intervalId]);

  useEffect(() => {
    if (answerSuccessEvaluation) {
      // interval이 실행 중이 아닐 때만 호출 (interval 내에서 이미 호출됨)
      if (!intervalId) {
        refetchQuizAnswerAll();
      }
    }
  }, [answerSuccessEvaluation, intervalId]);

  useEffect(() => {
    if (answerSuccessSavePut) {
      alert('등록이 완료되었습니다.');
      refetchQuizAnswer();
    }
  }, [answerSuccessSavePut]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    setParams({
      ...params,
      page,
    });
  }, [page]);

  const { isFetched: isParticipantListFetched, data } = useQuizRoungeInfo(id, data => {
    console.log('first get data', data);

    let index; // `index` 변수 선언

    if (selectedValue) {
      index = data?.clubQuizzes?.findIndex(item => {
        return item.quizSequence === parseInt(selectedValue);
      });
    } else {
      index = 0;
    }
    setSelectedQuiz(data?.clubQuizzes[index]);
    const selectedSession = data?.clubQuizzes[index] ? data.clubQuizzes[index].quizSequence : null;
    setSelectedValue(selectedSession);
    setContents(data);

    setParams({
      club: id,
      quiz: data?.clubQuizzes[index]?.quizSequence,
      page,
      keyword: keyWorld,
    });

    setQuizParamsAll({
      club: id,
      quiz: data?.clubQuizzes[index]?.quizSequence,
    });
  });

  useEffect(() => {
    if (aiQuizAnswerData) {
      setIsLoadingAI(false);
      console.log('aiQuizAnswerData', aiQuizAnswerData);
      if (aiQuizAnswerData?.responseCode === '0000') {
        setClubQuizGetThreads(aiQuizAnswerData?.data?.feedback);
      } else {
        alert(`error : [${aiQuizAnswerData?.responseCode}] ${aiQuizAnswerData?.message}`);
      }
    }
  }, [aiQuizAnswerData]);

  const {
    mutate: onAIQuizAnswerPut,
    isSuccess: answerSuccessPut,
    data: aiQuizAnswerDataPut,
  } = useAIQuizAnswerListPut();

  const { isFetched: isQuizGetanswer, refetch: refetchQuizAnswer } = useQuizGetAIAnswer(quizParams, data => {
    console.log('second get data');
    console.log('data', data);
    setClubQuizThreads(data);
    if (data?.clubQuizThreads?.length > 0) {
      data.clubQuizThreads.map(item => {
        // Check if the threadType is '0004' and return null to hide the div
        if (item?.threadType === '0004') {
          setIsHideAI(false);
          setIsAIData(item);
          console.log('false');
        }
      });
    }
  });

  // quizParams 설정 후 refetch 트리거
  useEffect(() => {
    if (triggerQuizAnswerRefetch && quizParams.club && quizParams.quiz && quizParams.memberUUID) {
      refetchQuizAnswer();
      setTriggerQuizAnswerRefetch(false);
    }
  }, [triggerQuizAnswerRefetch, quizParams]);

  const {
    isFetched: isQuizGetanswerGet,
    refetch: refetchQuizAnswerGet,
    isSuccess: isSuccessQuizGetAnswerGet,
    isError: isErrorQuizGetAnswerGet,
  } = useQuizGetAIAnswerGet(quizParams, data => {
    console.log('three get data');
    console.log('data', data);
    setClubQuizGetThreads(data);
  });

  useEffect(() => {
    if (isErrorQuizGetAnswerGet) {
      alert('AI피드백 초안생성에 실패하였습니다.');
      setIsLoadingAI(false);
    }
  }, [isErrorQuizGetAnswerGet]);

  const {
    isFetched: isQuizGetanswerAll,
    refetch: refetchQuizAnswerAll,
    isSuccess: isSuccessQuizGetAnswerAll,
  } = useQuizGetAIAnswerAll(quizParamsAll, data => {
    console.log('fore get data');

    // console.log(data?.evaluationStatuses);
    const evaluationMap = data?.evaluationStatuses?.reduce((map, obj) => {
      map[obj.memberUUID] = obj.aiEvaluationStatus;
      return map;
    }, {});

    const updatedQuizData = quizListData.map(item => {
      const memberUUID = item?.member?.memberUUID;
      if (memberUUID && evaluationMap[memberUUID]) {
        return {
          ...item,
          aiEvaluationStatus: evaluationMap[memberUUID],
        };
      }
      return item;
    });

    setIsCompleteAI(data.isComplete);
    setQuizListData(updatedQuizData);
    console.log('data', data);
    console.log('updatedQuizData', updatedQuizData);

    setQuizParamsAll({
      ...quizParamsAll,
    });
    setClubQuizGetThreadsAll(data);
  });

  const { isFetched: isQuizAnswer, refetch: refetchQuizPrgress } = useQuizGetProgress(params, data => {
    setQuizProgressData(data);
  });

  const { refetch: refetchQuizAnswerAI } = useGetAIQuizAnswer(quizParamsAI, data => {
    // setQuizProgressDataAI(data);
    console.log('data', data);
    setIsLoadingAI(false);
    setGrade(data?.data?.grading);
    setClubQuizGetThreads(data?.data?.feedback);
  });

  const {
    isFetched: isQuizAnswerListFetched,
    refetch: refetchReply,
    isSuccess,
    data: quizAnswerData,
  } = useQuizAnswerMemberAIDetail(params, data => {
    //member data-list
    setTotalElements(data.totalElements);
    setTotalPage(data.totalPages);
  });

  useEffect(() => {
    if (clubQuizGetThreads) {
      setIsLoadingAI(false);
    }
  }, [clubQuizGetThreads]);

  useDidMountEffect(() => {
    if (params.club) {
      refetchReply();
    }
  }, [params]);

  useDidMountEffect(() => {
    if (selectedQuiz) {
      refetchReply();
      refetchQuizPrgress();
    }
  }, [selectedQuiz]);

  useDidMountEffect(() => {
    refetchQuizAnswer();
  }, [quizParams]);

  const textInput = useRef(null);

  const handleQuizChange = event => {
    const value = event.target.value;
    const selectedSession = contents.clubQuizzes.find(session => session.quizSequence === parseInt(value));

    // 퀴즈 변경 시 저장된 점수 초기화
    setGradeScores({});

    if (selectedSession) {
      if (!selectedSession.quizSequence) {
        alert('퀴즈가 공개되지 않았습니다.');
        const result = contents.clubQuizzes.find(item => item.quizSequence === true);
        const selectedSessionValue = result ? result.quizSequence : null;
        console.log('selectedSessionValue 2', selectedSessionValue);
        setSelectedValue(selectedSessionValue); // Reset to the default value

        setParams({
          club: id,
          quiz: data.clubQuizzes[0]?.quizSequence,
          page,
          keyword: keyWorld,
        });
        setSelectedQuiz(contents?.clubQuizzes[0]);
        return;
      } else {
        setSelectedValue(selectedSession.quizSequence);
      }
    }

    setParams({
      club: id,
      quiz: selectedSession?.quizSequence,
      page,
      keyword: keyWorld,
    });

    setQuizParamsAll({
      club: id,
      quiz: selectedSession?.quizSequence,
    });

    setSelectedQuiz(selectedSession);
    console.log(selectedSession);
  };

  useEffect(() => {
    if (isSuccess) {
      setQuizListData(quizAnswerData.contents || []);
      setTotalPage(quizAnswerData.totalPages);
    }
  }, [isSuccess, quizAnswerData]);

  const handleClick = (memberUUID: string, quizSequence: number, answerStatus: string) => {
    if (answerStatus !== '0003') {
      alert('AI채점 / 교수채점을 한뒤에\n상세보기를 눌러주세요.');
      return;
    }
    console.log(memberUUID, quizSequence);
    setIsModalOpen(true);
    setClubQuizGetThreads('');
    setGrade('');
    setInputList([]);
    setFileList([]);
    setIsHideAI(true);
    setMemberUUID(memberUUID);
    setQuizParams({
      club: id,
      quiz: selectedQuiz?.quizSequence,
      memberUUID: memberUUID,
    });

    setQuizParamsAI({
      club: id,
      quiz: selectedQuiz?.quizSequence,
      memberUUID: memberUUID,
    });

    setQuizSaveParams({
      clubSequence: id,
      quizSequence: selectedQuiz?.quizSequence,
      memberUUID: memberUUID,
    });

    // refetchQuizAnswerGet();
  };

  const renderStatusMessage = status => {
    switch (status) {
      case '0101':
        return '채점중';
      case '0002':
        return '채점완료';
      case '1101':
        return '채점실패';
      case '9999':
        return '채점실패';
      case '0001':
        return '채점실패';
      default:
        return '';
    }
  };

  const [intervalId, setIntervalId] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const handleClickTime = () => {
    // 이미 실행 중인 interval이 있다면 정리
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // 현재 시간 저장
    const now = Date.now();
    setStartTime(now);

    // 1초마다 실행
    const newIntervalId = setInterval(() => {
      const currentTime = Date.now();
      // Create a map for quick lookup

      // console.log(clubQuizGetThreadsAll);
      if (currentTime - now >= 60000 || isCompleteAIRef.current === true) {
        // 60초가 경과하거나 완료되면 정지
        clearInterval(newIntervalId);
        setIntervalId(null);
        setIsLoadingAIAll(false);
        refetchReply();
        // 완료 시 마지막으로 한 번 더 호출하여 최종 상태 업데이트
        refetchQuizAnswerAll();
      } else {
        refetchQuizAnswerAll();
        console.log('set interval', isCompleteAIRef.current); // Use the ref value here
      }
    }, 1000); // 1000 밀리초 = 1초

    setIntervalId(newIntervalId);
    // interval 시작 시 즉시 한 번 호출하여 채점 상태 업데이트
    refetchQuizAnswerAll();
  };

  const [fileList, setFileList] = useState([]);
  const [inputList, setInputList] = useState([]);

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleAddInput = () => {
    // Ensure inputList is always an array
    setInputList(prevInputList => [...(prevInputList || []), { id: Date.now(), value: '', url: '' }]);
  };

  const handleDeleteInput = id => {
    setInputList(inputList.filter(input => input.id !== id));
  };

  const handleFileChange = event => {
    const files = Array.from(event.target.files);
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.xls|\.xlsx|\.doc|\.docx|\.ppt|\.pptx|\.hwp)$/i;

    for (let i = 0; i < files.length; i++) {
      if (!allowedExtensions.exec(files[i].name)) {
        alert('허용되지 않는 파일 형식입니다.');
        event.target.value = ''; // input 초기화
        return;
      }
    }
    setFileList(prevFileList => [...prevFileList, ...files]);
  };

  const handleInputChange = (id, event) => {
    const newInputList = inputList.map(input => {
      if (input.id === id) {
        return { ...input, url: event.target.value };
      }
      return input;
    });
    setInputList(newInputList);
  };
  const handleInputContentChange = (id, event) => {
    const newInputList = inputList.map(input => {
      if (input.id === id) {
        return { ...input, value: event.target.value };
      }
      return input;
    });
    console.log(newInputList); // Updated to log newInputList instead of inputList
    setInputList(newInputList);
  };

  const handleDeleteFile = index => {
    setFileList(prevFileList => prevFileList.filter((_, i) => i !== index));
  };

  const [grade, setGrade] = useState('');

  const handlerSave = () => {
    const formData = new FormData();

    // Validate clubQuizGetThreads
    if (!clubQuizGetThreads || typeof clubQuizGetThreads !== 'string') {
      alert('피드백을 입력해주세요.');
      return;
    }
    formData.append('feedback', clubQuizGetThreads);

    console.log(fileList);
    let _index = 0;
    fileList.forEach((file, index) => {
      if (file.key) {
        // Set properties if key exists
        formData.append(`fileKeys[${index}]`, file.key);
      } else {
        // Set isNew to true if key doesn't exist
        formData.append(`newFiles[${_index}]`, file);
        _index++;
      }
    });

    // Validate grade
    if (grade === '') {
      alert('점수를 입력해주세요.');
      return false;
    }
    formData.append('grading', grade);

    for (let i = 0; i < inputList?.length; i++) {
      const input = inputList[i];

      if (input.url === '' && input.value === '') {
        continue;
      }

      if (!input.url || typeof input.url !== 'string') {
        alert(`${i + 1}번째 지식콘텐츠 URL이 유효하지 않습니다.`);
        return false;
      }

      // URL validation: must start with http:// or https://
      const urlPattern = /^(http:\/\/|https:\/\/)/;
      if (!urlPattern.test(input.url)) {
        alert(`인덱스 ${i}에서 URL이 http:// 또는 https://로 시작해야 합니다`);
        return false;
      }

      if (!input.value || typeof input.value !== 'string') {
        alert(`인덱스 ${i}에서 유효하지 않은 설명`);
        return false;
      }

      formData.append(`contents[${i}].contentId`, 'feedback_' + generateUUID());
      formData.append(`contents[${i}].url`, input.url);
      formData.append(`contents[${i}].description`, input.value);
      if (isHideAI) {
        formData.append(`contents[${i}].isNew`, 'true');
      } else {
        formData.append(`contents[${i}].isNew`, 'false');
      }
    }

    // To log the formData contents
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const body = { quizSaveParams, formData };
    console.log(body);

    // Uncomment and replace with actual API call
    onAIQuizAnswerSavePut(body);
  };

  const handleUpdate = () => {
    setIsHideAI(true);
    setClubQuizGetThreads(isAIData?.text);
    setGrade(isAIData?.gradingFinal);
    setFileList(isAIData?.files);
    const transformedData = isAIData?.contents?.map(item => ({
      id: item.contentSequence,
      url: item.url,
      value: item.description,
    }));

    setInputList(transformedData);
  };

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    setKey(key);
    setFileName(fileName);
  };

  // 각 항목의 점수를 관리하는 state 추가
  const [gradeScores, setGradeScores] = useState({});

  // 점수 업데이트 핸들러
  const handleGradeUpdate = (memberUUID, quizSequence, score) => {
    const key = `${memberUUID}_${quizSequence}`;
    setGradeScores(prev => ({
      ...prev,
      [key]: score,
    }));
  };

  // quizListData가 로드되면 기존 점수 데이터 초기화
  useEffect(() => {
    if (quizListData.length > 0) {
      const existingGrades = {};
      quizListData.forEach(item => {
        if (item.gradingFinal) {
          const key = `${item.member.memberUUID}_${item.quizSequence}`;
          existingGrades[key] = item.gradingFinal;
        }
      });
      setGradeScores(existingGrades);
    }
  }, [quizListData]);

  // 일괄채점 처리 함수
  const handleBulkGrading = async () => {
    // 점수가 입력된 항목들 필터링
    const gradedItems = quizListData.filter(item => {
      const key = `${item.member.memberUUID}_${item.quizSequence}`;
      const score = gradeScores[key];
      return score && score !== '' && !isNaN(parseFloat(score));
    });

    if (gradedItems.length === 0) {
      alert('채점할 항목이 없습니다. 점수를 입력해주세요.');
      return;
    }

    // 유효성 검증
    const invalidItems = gradedItems.filter(item => {
      const key = `${item.member.memberUUID}_${item.quizSequence}`;
      const grade = parseFloat(gradeScores[key]);
      return isNaN(grade) || grade < 0 || grade > 5;
    });

    if (invalidItems.length > 0) {
      alert(
        `유효하지 않은 점수가 있습니다. 0~5점 사이의 값을 입력해주세요.\n문제가 있는 항목: ${invalidItems.length}개`,
      );
      return;
    }

    setIsLoadingAIAllSave(true);

    try {
      const results = [];

      // 순차적으로 처리
      for (const item of gradedItems) {
        try {
          const key = `${item.member.memberUUID}_${item.quizSequence}`;
          const params = {
            clubSequence: item.clubSequence,
            quizSequence: item.quizSequence,
            memberUUID: item.member.memberUUID,
            grading: parseFloat(gradeScores[key]),
          };

          await onAIQuizAnswerPut(params);
          results.push({ success: true, item });
        } catch (error) {
          console.error('채점 실패:', error);
          results.push({ success: false, item, error });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      if (failCount === 0) {
        alert(`일괄채점이 완료되었습니다.\n성공: ${successCount}개`);

        // 성공 시 입력된 점수 초기화 (최신 데이터로 업데이트됨)
        setGradeScores({});
      } else {
        alert(
          `일괄채점이 완료되었습니다.\n성공: ${successCount}개\n실패: ${failCount}개\n\n실패한 항목은 다시 시도해주세요.`,
        );
      }
    } catch (error) {
      console.error('일괄채점 오류:', error);
      alert('일괄채점 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoadingAIAllSave(false);
    }
  };

  return (
    <div className={cx('container tw-pb-[250px]')}>
      <div className="tw-pt-[35px]">
        <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden border-t-0 border-r-0 border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              나의클럽
            </p>
            <svg
              width={17}
              height={16}
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[15.75px] tw-h-[15.75px] tw-relative"
              preserveAspectRatio="none"
            >
              <path
                d="M6.96925 11.25L10.3438 7.8755L6.96925 4.50101L6.40651 5.06336L9.21905 7.8755L6.40651 10.6877L6.96925 11.25Z"
                fill="#313B49"
              />
            </svg>
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              퀴즈클럽 대시보드
            </p>
            <svg
              width={17}
              height={16}
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[15.75px] tw-h-[15.75px] tw-relative"
              preserveAspectRatio="none"
            >
              <path
                d="M6.96925 11.25L10.3438 7.8755L6.96925 4.50101L6.40651 5.06336L9.21905 7.8755L6.40651 10.6877L6.96925 11.25Z"
                fill="#313B49"
              />
            </svg>
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              퀴즈목록 전체보기
            </p>
            <svg
              width={17}
              height={16}
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[15.75px] tw-h-[15.75px] tw-relative"
              preserveAspectRatio="none"
            >
              <path
                d="M6.96925 11.25L10.3438 7.8755L6.96925 4.50101L6.40651 5.06336L9.21905 7.8755L6.40651 10.6877L6.96925 11.25Z"
                fill="#313B49"
              />
            </svg>
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              전체답변보기
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              전체 답변보기
            </p>
          </div>
        </div>
      </div>

      <div className="tw-flex tw-py-5">
        <div className="tw-w-[300px] tw-py-4 tw-flex tw-items-center">
          <p className="tw-w-[100px] tw-text-base tw-text-[#313b49] tw-font-bold">퀴즈선택</p>
          <div className="tw-w-full">
            <select
              className="form-select block w-full tw-bg-gray-100 tw-text-red-500 tw-font-bold"
              onChange={handleQuizChange}
              // value={selectedValue?.split('-').slice(1).join('-')}
              value={selectedValue}
              aria-label="Default select example"
            >
              {contents?.clubQuizzes?.map((session, idx) => {
                const isSelected = selectedQuiz?.quizSequence === session.quizSequence;
                const isPublished = session?.isPublished === false;

                return (
                  <option
                    key={idx}
                    className={`tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer
          ${isSelected ? '' : ''}
          ${isPublished ? '' : ''}
        `}
                    value={session?.quizSequence}
                  >
                    {session?.order}회 {session?.publishDate?.split('-').slice(1).join('-')}
                    {session?.dayOfWeek ? ` (${session?.dayOfWeek})` : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="tw-p-4  tw-flex tw-items-center">
          <p className="tw-px-3 tw-text-black tw-font-bold">
            퀴즈제출 : <span className="tw-text-red-500">{quizProgressData?.solvedMemberCount}명</span> /{' '}
            {quizProgressData?.totalMemberCount}명
          </p>
          <p className="tw-px-3 tw-text-black tw-font-bold">
            오늘 제출된 답변 : <span className="tw-text-red-500">{quizProgressData?.todaySolvedMemberCount}개</span>
          </p>
          <p className="tw-px-3 tw-text-black tw-font-bold">
            피드백 현황 : <span className="tw-text-red-500">{quizProgressData?.feedbackCount}개 </span>/{' '}
            {quizProgressData?.totalMemberCount}개 (
            {quizProgressData?.totalMemberCount - quizProgressData?.feedbackCount}개 남음)
          </p>
        </div>
      </div>

      {isParticipantListFetched && (
        <>
          <div className="tw-text-black tw-font-bold tw-py-10 tw-p-4 border tw-rounded-lg tw-text-center tw-mb-4">
            <p>Q. {selectedQuiz?.question}</p>
          </div>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <button
              className="tw-min-w-[150px] tw-bg-black max-lg:tw-mr-1 tw-rounded-md tw-text-sm tw-text-white tw-py-2.5 tw-px-4 disabled:tw-opacity-70 disabled:tw-cursor-not-allowed"
              disabled={isLoadingAIAllSave || quizListData.length === 0}
              onClick={handleBulkGrading}
            >
              {isLoadingAIAllSave ? (
                <div className="tw-flex tw-items-center tw-justify-center">
                  <CircularProgress color="inherit" size={18} />
                  <span className="tw-ml-2">채점 중...</span>
                </div>
              ) : (
                '일괄 저장'
              )}
            </button>
            <button
              className="tw-min-w-[150px] tw-bg-black max-lg:tw-mr-1 tw-rounded-md tw-text-sm tw-text-white tw-py-2.5 tw-px-4 disabled:tw-opacity-70 disabled:tw-cursor-not-allowed"
              disabled={isLoadingAIAll}
              onClick={() => {
                onAIQuizAnswerEvaluation({
                  ...quizParamsAll,
                  quizSize: quizListData.length,
                });
                handleClickTime();
                setIsLoadingAIAll(true);
              }}
            >
              {isLoadingAIAll ? (
                <div className="tw-flex tw-items-center tw-justify-center">
                  <CircularProgress color="inherit" size={18} />
                  <span className="tw-ml-2">처리 중...</span>
                </div>
              ) : (
                '일괄 AI채점/피드백'
              )}
            </button>
          </div>

          <TableContainer className="tw-py-5" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
            <Table style={{ width: '100%' }}>
              <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                <TableRow>
                  <TableCell align="center" width={45}></TableCell>
                  <TableCell align="center" width={155}>
                    이름
                  </TableCell>
                  <TableCell align="center" width={340}>
                    답변
                  </TableCell>
                  <TableCell align="center" width={140}>
                    날짜
                  </TableCell>
                  <TableCell align="center" width={90}></TableCell>
                  <TableCell align="center" width={320}>
                    AI채점 / 교수채점
                  </TableCell>
                  <TableCell align="center" width={100}>
                    상세보기
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isQuizAnswerListFetched &&
                  quizListData?.map((info, index) => (
                    <TableRow
                      key={index}
                      className={`${info?.answerStatus === '0003' ? '' : 'tw-bg-gray-100'}`}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-text-black">{index + 1 + (page - 1) * 10}</div>
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                        <div className="tw-flex tw-items-center tw-gap-3 tw-text-black">
                          <img className="border tw-rounded-full tw-w-8 tw-h-8" src={info?.member?.profileImageUrl} />
                          <div className="tw-text-black">{info?.member?.nickname}</div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="left" component="th" scope="row">
                        <div className="tw-text-black tw-line-clamp-1">
                          {info?.answerStatus === '0003' ? info?.text : 'AI피드백/채점을 할 수 없습니다.'}
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-text-black tw-line-clamp-1">
                          {info?.createdAt ? info.createdAt.replace('T', ' | ').split('.')[0] : ''}
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        {info?.aiEvaluationStatus && (
                          <div>
                            <span className="tw-bg-red-500 tw-rounded tw-text-white tw-py-1.5 tw-px-2">
                              {renderStatusMessage(info?.aiEvaluationStatus)}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <AIAnswerQuizList
                          info={info}
                          refetchReply={() => {
                            setQuizParams({
                              club: id,
                              quiz: info.quizSequence,
                              memberUUID: info.member.memberUUID,
                            });
                            setTriggerQuizAnswerRefetch(true);
                          }}
                          onGradeChange={score => handleGradeUpdate(info.member.memberUUID, info.quizSequence, score)}
                          initialValue={
                            gradeScores[`${info.member.memberUUID}_${info.quizSequence}`] || info.gradingFinal || ''
                          }
                          refetchQuizAnswerAll={refetchQuizAnswerAll}
                        />
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <button
                          className="tw-w-24 max-lg:tw-mr-1 border tw-rounded-md tw-text-sm tw-text-black tw-py-2.5 tw-px-4"
                          onClick={() =>
                            handleClick(info?.member?.memberUUID, info?.quizSequence, info?.answerStatus)
                          }
                        >
                          상세보기
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="tw-flex tw-justify-center tw-p-5">
            <Pagination count={totalPage} page={page} onChange={handlePageChange} />
          </div>
        </>
      )}

      <MentorsModal
        isContentModalClick={false}
        title={'AI답변보기'}
        isOpen={isModalOpen}
        isProfile={true}
        onAfterClose={() => {
          refetchReply();
          setIsModalOpen(false);
        }}
      >
        {!isQuizGetanswer ? (
          <div className="tw-flex tw-justify-center tw-items-center tw-py-20">
            <CircularProgress size={40} />
            <span className="tw-ml-3 tw-text-gray-600">데이터를 불러오는 중...</span>
          </div>
        ) : (
          <div className="tw-rounded-xl tw-pb-10 tw-space-y-5">
            <div className="border tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-4 tw-rounded-lg">
              <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <img
                  className="tw-w-10 tw-h-10 border tw-rounded-full"
                  src={clubQuizThreads?.member?.profileImageUrl}
                />
                <div className="tw-text-xs tw-text-left tw-text-black">{clubQuizThreads?.member?.nickname}</div>
              </div>
              <div className="tw-flex-auto tw-px-10 tw-w-10/12">
                <div className="tw-font-bold tw-text-black">{clubQuizThreads?.question}</div>
              </div>
            </div>
            {clubQuizThreads?.clubQuizThreads?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`border tw-flex tw-p-3 tw-rounded-lg ${item?.threadType === '0001' || item?.threadType === '0002' ? 'tw-bg-[#f6f7fb]' : 'tw-bg-white'
                    }`}
                >
                  <div className="tw-w-1.5/12  tw-py-2 tw-flex tw-flex-col">
                    {item?.threadType === '0003' ? (
                      <img className="tw-rounded-full tw-w-14 tw-h-14 border" src="/assets/images/main/chatbot.png" />
                    ) : (
                      <img
                        className="tw-rounded-full tw-w-10 tw-h-10 border"
                        src={item?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
                      />
                    )}
                  </div>
                  <div className="tw-flex-auto tw-w-9/12 tw-px-3">
                    <div className="tw-py-2">
                      <div className="tw-font-medium tw-text-[#9ca5b2] tw-text-base">
                        <span
                          className={`tw-font-bold ${item?.threadType === '0003' ? 'tw-text-red-500' : 'tw-text-black'
                            }`}
                        >
                          {item?.threadType === '0001' && '사전답변'}
                          {item?.threadType === '0002' && '사후답변'}
                          {item?.threadType === '0003' && 'AI피드백'}
                          {item?.threadType === '0004' && '교수님 평가'}
                        </span>
                        <span className="tw-px-4 tw-text-sm">
                          {item?.createdAt ? item.createdAt.replace('T', ' | ').split('.')[0] : ''}
                        </span>

                        {item?.threadType === '0003' && (
                          <>
                            <div className="tw-float-right tw-text-black">
                              AI 채점 : <span className="tw-font-bold">{item?.gradingAi}</span>
                            </div>
                          </>
                        )}

                        {item?.threadType === '0004' && (
                          <div className="tw-float-right">
                            <div className="tw-float-right tw-text-black">
                              교수 채점 : <span className="tw-font-bold">{item?.gradingFinal}</span>
                            </div>
                            <button
                              onClick={() => handleUpdate()}
                              className="tw-px-5 tw-underline tw-float-right tw-text-black"
                            >
                              수정하기
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {item?.threadType === '0003' ? (
                      <div className="">
                        <div className="tw-py-4 tw-space-y-4">
                          {/* Rating Section */}
                          <div>
                            <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                              <span className="tw-text-sm tw-font-medium">평점({item?.gradingAi || '4.5'}/5)</span>
                            </div>
                            <div className="tw-w-32 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                              <div
                                className="tw-h-2 tw-bg-blue-500 tw-rounded-full tw-transition-all tw-duration-300"
                                style={{ width: `${((parseFloat(item?.gradingAi) || 4.5) / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Content Sections */}
                          <div className="tw-space-y-3">
                            <div>
                              <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">전체 피드백</div>
                              <p className="tw-text-base tw-text-black">{item?.aiEvaluation?.feedback}</p>
                            </div>

                            <div>
                              <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">개선 포인트</div>
                              <p className="tw-text-base tw-text-black">{item?.aiEvaluation?.improvePoint}</p>
                            </div>
                            <div>
                              <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">개선 예선</div>
                              <p className="tw-text-base tw-text-black">{item?.aiEvaluation?.improveExample}</p>
                            </div>

                            <div>
                              <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">피드백 요약</div>
                              <p className="tw-text-base tw-text-black">{item?.aiEvaluation?.summaryFeedback}</p>
                            </div>

                            <div>
                              <div className="tw-text-base tw-font-medium tw-text-gray-500 tw-mb-3">
                                추가 학습 자료
                              </div>
                              <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded tw-p-4">
                                <div className="tw-space-y-3">
                                  {item?.aiEvaluation?.additionalResources?.length > 0 ? (
                                    item.aiEvaluation.additionalResources.map((resource, index) => (
                                      <div key={index} className="tw-flex tw-items-start tw-gap-2">
                                        <div className="tw-w-1.5 tw-h-1.5 tw-bg-blue-500 tw-rounded-full tw-mt-2 tw-flex-shrink-0"></div>
                                        <div className="tw-text-base">
                                          <div className="tw-font-medium tw-text-blue-800 tw-mb-1">
                                            {resource.title}
                                          </div>
                                          <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="tw-text-blue-600 tw-underline tw-text-xs tw-break-all"
                                          >
                                            {resource.url}
                                          </a>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="tw-text-gray-500 tw-text-sm">추가 학습 자료가 없습니다.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`tw-text-[#9ca5b2] tw-text-base ${item?.threadType === '0003' ? 'tw-text-black' : ''
                          }`}
                      >
                        {item?.text}
                      </div>
                    )}

                    <div className="tw-flex  tw-py-2">
                      <div className="tw-text-left tw-text-sm">
                        <ul className="">
                          {item?.contents?.map((file, index) => {
                            // Skip rendering if file.url is null or undefined
                            if (!file.url) return null;

                            return (
                              <div
                                onClick={() => {
                                  let url = file.url;
                                  // Ensure the URL is absolute
                                  if (!/^https?:\/\//i.test(url)) {
                                    // If the URL does not start with 'http://' or 'https://', prepend the base URL
                                    url = new URL(url, window.location.origin).href;
                                  }
                                  console.log(url); // Log the corrected URL to the console
                                  window.open(url, '_blank'); // Open the corrected URL in a new tab
                                }}
                                key={index}
                                className="tw-cursor-pointer tw-text-[#fca380] tw-underline tw-p-1 tw-mb-1"
                              >
                                ㄴ지식컨텐츠 : {file.url}
                              </div>
                            );
                          })}
                        </ul>
                      </div>
                    </div>

                    <div className="tw-text-sm tw-flex tw-items-center tw-justify-end tw-gap-2">
                      {item?.files?.length > 0 && (
                        <div className="tw-text-left tw-text-sm tw-flex tw-items-center tw-gap-2">
                          <div className="tw-text-sm tw-font-medium tw-text-gray-500 tw-p-1">업로드 파일 : </div>
                          <ul className="">
                            {item?.files?.map((file, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  onFileDownload(file.key, file.name);
                                }}
                                className="tw-underline tw-text-blue-500 tw-cursor-pointer tw-p-1"
                              >
                                {file.name}
                              </div>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isHideAI === true && (
              // Check if the threadType is '0004' and return null to hide the div
              <div className="border tw-p-5 tw-mt-5 tw-rounded-lg">
                <div className="tw-py-5 tw-flex tw-items-center tw-gap-3 tw-text-sm tw-text-black">
                  <img src={user?.member?.profileImageUrl} className="tw-w-10 tw-h-10 border tw-rounded-full" />
                  <div className="tw-flex-grow">
                    {user?.member?.nickname}
                    <button
                      onClick={() => {
                        setIsLoadingAI(true);
                        refetchQuizAnswerAI();
                      }}
                      disabled={isLoadingAI}
                      className="tw-min-w-[140px] tw-ml-3 tw-rounded tw-bg-black tw-text-white tw-text-sm tw-py-2 tw-px-4 disabled:tw-opacity-70 disabled:tw-cursor-not-allowed"
                    >
                      {isLoadingAI ? (
                        <div className="tw-flex tw-items-center tw-justify-center">
                          <CircularProgress color="inherit" size={18} />
                          <span className="tw-ml-2">생성 중...</span>
                        </div>
                      ) : (
                        'AI피드백 초안생성'
                      )}
                    </button>
                  </div>
                  <div className="tw-ml-auto">점수 : </div>
                  <input
                    maxLength={3}
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    style={{
                      padding: 0,
                      height: 35,
                      width: 85,
                      textAlign: 'center',
                      backgroundColor: '#F6F7FB',
                    }}
                    placeholder="점수 입력"
                    type="text"
                    className="tw-bg-[#F6F7FB] tw-rounded tw-mr-2"
                    aria-label="Recipient's username with two button addons"
                  />
                </div>
                <textarea
                  className="tw-bg-gray-100 tw-text-sm tw-form-control tw-w-full tw-py-[8px] tw-p-5"
                  id="floatingTextarea"
                  placeholder="피드백을 입력해주세요."
                  onChange={e => setClubQuizGetThreads(e.target.value)}
                  value={clubQuizGetThreads || ''}
                  ref={textInput}
                  rows={4}
                ></textarea>

                <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-5 tw-py-3">
                  <div className="tw-flex tw-items-center tw-gap-1">
                    <svg
                      width={17}
                      height={16}
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 absolute left-0 top-[3px]"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M16.4986 5.15045C16.4711 6.17832 16.0703 7.15593 15.3788 7.88172L12.8521 10.5433C12.4975 10.9189 12.0756 11.2166 11.6109 11.4192C11.1462 11.6218 10.648 11.7252 10.1451 11.7236H10.1415C9.63017 11.7232 9.12414 11.6148 8.65325 11.405C8.18237 11.1951 7.75618 10.888 7.39987 10.5017C7.04355 10.1155 6.76433 9.65792 6.57869 9.15608C6.39305 8.65425 6.30477 8.11832 6.31905 7.57995C6.32208 7.4602 6.36938 7.34644 6.45087 7.26289C6.53236 7.17934 6.6416 7.1326 6.75532 7.13265H6.76768C6.88327 7.13605 6.99285 7.18766 7.07233 7.27613C7.15182 7.3646 7.19471 7.48269 7.19158 7.60445C7.18031 8.02017 7.24827 8.43406 7.39146 8.82163C7.53465 9.20921 7.75016 9.56261 8.02524 9.86094C8.30032 10.1593 8.62939 10.3965 8.993 10.5585C9.35661 10.7206 9.74737 10.8042 10.1422 10.8045C10.5303 10.8054 10.9147 10.7254 11.2733 10.5689C11.6318 10.4125 11.9574 10.1828 12.2312 9.89302L14.7579 7.23222C15.2915 6.64455 15.5856 5.86019 15.5771 5.047C15.5687 4.23382 15.2583 3.45644 14.7126 2.88125C14.1668 2.30606 13.429 1.97876 12.657 1.96942C11.885 1.96007 11.1403 2.26942 10.5821 2.83124L9.78227 3.67375C9.70041 3.75999 9.58938 3.80843 9.47361 3.80843C9.35784 3.80843 9.24682 3.75999 9.16496 3.67375C9.0831 3.58752 9.03711 3.47057 9.03711 3.34862C9.03711 3.22667 9.0831 3.10972 9.16496 3.02349L9.96478 2.18098C10.3201 1.80657 10.7419 1.50957 11.2062 1.30693C11.6705 1.1043 12.1681 1 12.6707 1C13.1733 1 13.6709 1.1043 14.1352 1.30693C14.5995 1.50957 15.0213 1.80657 15.3766 2.18098C15.7453 2.56976 16.0348 3.03356 16.2277 3.54409C16.4206 4.05462 16.5128 4.60118 16.4986 5.15045ZM7.21921 12.7254L6.41939 13.5679C6.1454 13.8585 5.81931 14.0889 5.46007 14.2456C5.10083 14.4024 4.7156 14.4823 4.32677 14.4809C3.74266 14.4804 3.17178 14.2976 2.68629 13.9555C2.20079 13.6134 1.82247 13.1273 1.59914 12.5588C1.3758 11.9902 1.31748 11.3647 1.43155 10.7613C1.54561 10.1578 1.82694 9.60353 2.23997 9.16846L4.76449 6.50766C5.1825 6.0662 5.71676 5.76718 6.29801 5.64938C6.87927 5.53158 7.48072 5.60042 8.02439 5.84697C8.56806 6.09353 9.02888 6.50644 9.34712 7.03217C9.66536 7.5579 9.82633 8.17221 9.80918 8.79546C9.80605 8.91722 9.84894 9.03531 9.92842 9.12378C10.0079 9.21225 10.1175 9.26386 10.2331 9.26726H10.2454C10.3592 9.26731 10.4684 9.22058 10.5499 9.13703C10.6314 9.05348 10.6787 8.93971 10.6817 8.81997C10.7034 8.01296 10.4946 7.21769 10.0823 6.53714C9.66996 5.8566 9.07315 5.32215 8.36915 5.00303C7.66515 4.6839 6.8864 4.5948 6.13377 4.74726C5.38114 4.89973 4.68932 5.28674 4.1479 5.85816L1.62047 8.51896C1.08557 9.08257 0.721265 9.80055 0.573599 10.5822C0.425933 11.3638 0.50153 12.174 0.790839 12.9104C1.08015 13.6468 1.57018 14.2763 2.19903 14.7194C2.82787 15.1625 3.56729 15.3994 4.32386 15.4C4.82671 15.4015 5.32484 15.2979 5.7894 15.0952C6.25396 14.8925 6.67569 14.5946 7.03016 14.2189L7.82998 13.3764C7.87101 13.3339 7.90363 13.2831 7.92596 13.2272C7.94829 13.1713 7.95989 13.1113 7.96009 13.0506C7.96029 12.99 7.94909 12.9299 7.92713 12.8738C7.90517 12.8177 7.87288 12.7668 7.83213 12.7239C7.79139 12.681 7.74299 12.6471 7.68973 12.624C7.63646 12.6009 7.57939 12.5892 7.5218 12.5895C7.46421 12.5898 7.40725 12.6021 7.35419 12.6256C7.30113 12.6492 7.25303 12.6837 7.21267 12.7269L7.21921 12.7254Z"
                        fill="black"
                      />
                    </svg>
                    <button onClick={handleAddInput} className="tw-top-0 tw-text-sm tw-text-left tw-text-[#31343d]">
                      지식콘텐츠 추가
                    </button>
                  </div>
                  <div className="tw-flex tw-items-center tw-gap-1">
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
                      accept=".jpeg,.jpg,.png,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.hwp,.pdf"
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {inputList?.length > 0 && (
                  <div className="tw-flex  tw-py-2">
                    <div className="tw-flex-none tw-w-30  tw-text-sm tw-mt-2">업로드 링크 : </div>
                    <div className="tw-flex-1 tw-text-left tw-pl-5">
                      {inputList.map((input, index) => (
                        <div key={input.id} style={{ marginBottom: '10px' }}>
                          <div className="tw-flex tw-items-center tw-gap-2">
                            <input
                              type="text"
                              className="border tw-w-full tw-rounded tw-text-sm tw-p-2"
                              value={input.url}
                              placeholder="http://"
                              onChange={event => handleInputChange(input.id, event)}
                            />
                            <input
                              type="text"
                              className="border tw-w-full tw-rounded tw-text-sm tw-p-2"
                              value={input.value}
                              placeholder="지식콘텐츠 제목을 입력하세요."
                              onChange={event => handleInputContentChange(input.id, event)}
                            />
                            <button
                              className="tw-text-white tw-bg-black tw-rounded tw-w-[90px] tw-py-2 tw-ml-2"
                              onClick={() => handleDeleteInput(input.id)}
                            >
                              -
                            </button>
                            <button
                              className="tw-text-white tw-bg-black tw-rounded tw-w-[90px] tw-py-2"
                              onClick={handleAddInput}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {fileList.length > 0 && (
                  <div className="tw-flex tw-py-2">
                    <div className="tw-flex-none tw-w-34 tw-text-sm tw-items-center">업로드 파일 : </div>
                    <div className="tw-text-left tw-pl-5 tw-text-sm">
                      <ul className="tw-flex tw-flex-wrap tw-max-h-40 tw-overflow-y-auto tw-p-2 tw-pt-0 tw-pl-0 tw-border tw-rounded">
                        {fileList.map((file, index) => (
                          <li
                            key={index}
                            className="border tw-p-1 tw-mb-1 tw-mr-2 tw-rounded tw-flex tw-items-center"
                          >
                            {file.name}
                            <button
                              className="tw-ml-2 tw-text-sm tw-text-red-500"
                              onClick={() => handleDeleteFile(index)}
                            >
                              삭제
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="tw-text-center tw-py-10">
                  <button
                    onClick={() => {
                      setIsHideAI(false);
                    }}
                    className="tw-bg-gray-200 tw-mr-3 tw-text-white tw-text-sm tw-text-black tw-py-3 tw-px-4 tw-w-40 tw-rounded"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      handlerSave();
                    }}
                    className="tw-bg-red-500 tw-text-white tw-text-sm tw-text-black tw-py-3 tw-px-4 tw-w-40 tw-rounded"
                  >
                    저장하기
                  </button>
                </div>
              </div>
            )}
            <div className="tw-flex tw-justify-center tw-items-center tw-pt-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  refetchReply();
                }}
                className="tw-bg-black tw-text-white tw-text-sm tw-text-black tw-py-3 tw-px-4 tw-w-40 tw-rounded"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </MentorsModal>
    </div>
  );
}

export default QuizViewAllAnswersTemplate;
