import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { paramProps, useMySeminarList, useSeminarDetail, useSeminarList } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { useSessionStore } from 'src/store/session';
import { useClubDetailQuizList } from 'src/services/quiz/quiz.queries';
import { useQuizDeleteLike, useQuizLike, useSaveLike } from 'src/services/community/community.mutations';
import QuizClubAnswersView from 'src/stories/components/QuizClubAnswersView';
import router from 'next/router';
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
import { useAIQuizAnswerSavePut, useAIQuizAnswerEvaluation } from 'src/services/quiz/quiz.mutations';
import Pagination from '@mui/material/Pagination';

import {
  useQuizAnswerMemberAIDetail,
  useQuizGetProgress,
  useQuizRoungeInfo,
  useQuizGetAIAnswer,
  useQuizGetAIAnswerGet,
  useQuizGetAIAnswerAll,
  useQuizFileDownload,
} from 'src/services/quiz/quiz.queries';

const cx = classNames.bind(styles);
export interface QuizViewAllAnswersTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizViewAllAnswersTemplate({ id }: QuizViewAllAnswersTemplateProps) {
  const { user } = useStore();
  const [value, setValue] = React.useState(0);
  const [isBookmark, setIsBookmark] = useState(true);
  const [quizList, setQuizList] = useState<RecommendContent[]>([]);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState<boolean>(false);
  const [myParticipation, setMyParticipation] = useState(null);
  const [restTime, setRestTime] = useState(0);
  const [clubStatus, setClubStatus] = useState('0000');
  const [clubMemberStatus, setClubMemberStatus] = useState('0001');
  const [applicationButton, setApplicationButton] = useState<ReactNode>(null);
  const { memberId, logged } = useSessionStore.getState();
  const [contentHtml, setContentHtml] = useState('');
  let [isLiked, setIsLiked] = useState(false);

  const [quizListData, setQuizListData] = useState<any[]>([]);
  const [contents, setContents] = useState<any>([]);
  const [quizProgressData, setQuizProgressData] = useState<any>([]);
  const [clubQuizThreads, setClubQuizThreads] = useState<any>([]);
  const [clubQuizGetThreads, setClubQuizGetThreads] = useState<any>('');
  const [clubQuizGetThreadsAll, setClubQuizGetThreadsAll] = useState<any>('');
  const [beforeOnePick, setBeforeOnePick] = useState(1);
  const [keyWorld, setKeyWorld] = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  const [page, setPage] = useState(1);
  const [params, setParams] = useState<any>({ id, page });
  const [quizParams, setQuizParams] = useState<any>({});
  const [quizParamsAll, setQuizParamsAll] = useState<any>({});
  const [quizSaveParams, setQuizSaveParams] = useState<any>({});
  const [listParams, setListParams] = useState<any>({ id, page });
  const [totalPage, setTotalPage] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isCompleteAI, setIsCompleteAI] = useState(false);
  const [isHideAI, setIsHideAI] = useState(true);
  const [isAIData, setIsAIData] = useState({});

  let [key, setKey] = useState('');
  let [fileName, setFileName] = useState('');

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
    data: aiQuizAnswerDataEvaluation,
  } = useAIQuizAnswerEvaluation();

  useEffect(() => {
    if (answerSuccessSavePut) {
      alert('등록이 완료되었습니다.');
      refetchQuizAnswer();
    }
  }, [answerSuccessSavePut]);

  const handlerTodayQuizSolution = () => {
    if (user.phoneNumber === null || user.phoneNumber === '') {
      setIsModalOpen(true);
    } else {
      const firstItemWithNullAnswer = quizList.find(item => item.answer.answerStatus === '0000');
      router.push('/quiz/solution/' + `${firstItemWithNullAnswer?.clubQuizSequence}`);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    setParams({
      ...params,
      page,
    });
  }, [page]);

  useEffect(() => {
    if (contents?.clubQuizzes?.length > 0) {
      console.log('content!!');
      console.log(contents.clubQuizzes[0]);
      console.log(contents.clubQuizzes[0].question);
      setSelectedQuiz(contents.clubQuizzes[0]);
    }
  }, [contents]);

  const { isFetched: isParticipantListFetched, data } = useQuizRoungeInfo(id, data => {
    console.log('first get data');
    setSelectedQuiz(data.clubQuizzes[0]);
    console.log(data.clubQuizzes[0]?.quizSequence);
    setContents(data);

    setParams({
      club: id,
      quiz: data.clubQuizzes[0]?.quizSequence,
      page,
      keyword: keyWorld,
    });

    setQuizParamsAll({
      club: id,
      quiz: data.clubQuizzes[0]?.quizSequence,
    });
  });

  const { isFetched: isQuizGetanswer, refetch: refetchQuizAnswer } = useQuizGetAIAnswer(quizParams, data => {
    console.log('second get data');
    console.log('data', data);
    setClubQuizThreads(data);
    data.clubQuizThreads.map(item => {
      // Check if the threadType is '0004' and return null to hide the div
      if (item?.threadType === '0004') {
        setIsHideAI(false);
        setIsAIData(item);
        console.log('false');
      }
    });
  });

  const {
    isFetched: isQuizGetanswerGet,
    refetch: refetchQuizAnswerGet,
    isSuccess: isSuccessQuizGetAnswerGet,
  } = useQuizGetAIAnswerGet(quizParams, data => {
    console.log('three get data');
    console.log('data', data);
    setClubQuizGetThreads(data);
  });

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

  // useDidMountEffect(() => {

  //   console.log('updatedQuizData', updatedQuizData);
  // }, [clubQuizGetThreadsAll]);

  const { isFetched: isQuizAnswer, refetch: refetchQuizPrgress } = useQuizGetProgress(params, data => {
    console.log('second get data');
    console.log('data', data);
    setQuizProgressData(data);
  });

  const {
    isFetched: isQuizAnswerListFetched,
    refetch: refetchReply,
    isSuccess,
    data: quizAnswerData,
  } = useQuizAnswerMemberAIDetail(params, data => {
    //member data-list
    console.log('useQuizAnswerDetail', data.totalPages);
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
    const selectedSession = contents.clubQuizzes.find(
      session => session.publishDate.split('-').slice(1).join('-') === value,
    );

    if (selectedSession) {
      if (!selectedSession.isPublished) {
        alert('퀴즈가 공개되지 않았습니다.');
        setSelectedValue(''); // Reset to the default value
        setParams({
          club: id,
          quiz: data.clubQuizzes[0]?.quizSequence,
          page,
          keyword: keyWorld,
        });
        setSelectedQuiz(contents?.clubQuizzes[0]);
        return;
      } else {
        setSelectedValue(selectedSession.publishDate.split('-').slice(1).join('-'));
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
      console.log('quizAnswerData');
      console.log(quizAnswerData.contents);
      setQuizListData(quizAnswerData.contents || []);
      setTotalPage(quizAnswerData.totalPages);
    }
  }, [isSuccess, quizAnswerData]);

  const handleClick = (memberUUID: string, quizSequence: number) => {
    console.log(memberUUID, quizSequence);
    setIsModalOpen(true);
    setClubQuizGetThreads('');
    setGrade('');
    setInputList([]);
    setFileList([]);
    setIsHideAI(true);

    setQuizParams({
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
        return '체점중';
      case '0002':
        return '체점완료';
      case '1101':
        return '체점실패';
      case '9999':
        return '체점실패';
      case '0001':
        return '체점실패';
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
        // 10초가 경과하면 정지
        clearInterval(newIntervalId);
        setIntervalId(null);
        refetchReply();
      } else {
        refetchQuizAnswerAll();
        console.log('set interval', isCompleteAIRef.current); // Use the ref value here
      }
    }, 1000); // 1000 밀리초 = 1초

    setIntervalId(newIntervalId);
  };

  const [fileList, setFileList] = useState([]);
  const [inputList, setInputList] = useState([]);

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleAddInput = () => {
    setInputList([...inputList, { id: Date.now(), value: '', url: '' }]);
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
      alert('Invalid feedback');
      return;
    }
    formData.append('feedback', clubQuizGetThreads);

    // Validate fileList
    // if (!Array.isArray(fileList) || fileList.some(file => !(file instanceof File))) {
    //   alert('Invalid file list');
    //   return;
    // }

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
      alert('Invalid grade');
      return;
    }
    formData.append('grading', grade);
    // formData.append('isNew', grade);

    // Validate inputList
    if (!Array.isArray(inputList)) {
      alert('Invalid input list');
      return;
    }

    for (let i = 0; i < inputList.length; i++) {
      const input = inputList[i];

      if (!input.url || typeof input.url !== 'string') {
        alert(`인덱스 ${i}에서 유효하지 않은 URL`);
        return;
      }

      // URL validation: must start with http:// or https://
      const urlPattern = /^(http:\/\/|https:\/\/)/;
      if (!urlPattern.test(input.url)) {
        alert(`인덱스 ${i}에서 URL이 http:// 또는 https://로 시작해야 합니다`);
        return;
      }

      if (!input.value || typeof input.value !== 'string') {
        alert(`인덱스 ${i}에서 유효하지 않은 설명`);
        return;
      }

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
    // onFileDownload(key);
  };

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
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
          ${isSelected ? 'tw-bg-red-500 tw-text-white' : ''}
          ${isPublished ? 'tw-bg-white tw-text-gray-200' : ''}
        `}
                      value={session?.publishDate.split('-').slice(1).join('-')}
                    >
                      {session?.order}.회 {session?.publishDate.split('-').slice(1).join('-')} ({session?.dayOfWeek})
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
                className=" tw-bg-black max-lg:tw-mr-1  tw-rounded-md tw-text-sm tw-text-white tw-py-2.5 tw-px-4"
                onClick={() => {
                  onAIQuizAnswerEvaluation(quizParamsAll);
                  handleClickTime();
                }}
              >
                일괄 AI피드백/채점
              </button>
            </div>

            <TableContainer className="tw-py-5" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
              <Table style={{ width: '100%' }}>
                <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                  <TableRow>
                    <TableCell align="center" width={50}></TableCell>
                    <TableCell align="center" width={135}>
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
                    <TableCell align="center">상세보기</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isQuizAnswerListFetched &&
                    quizListData?.map((info, index) => (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                          <div className="tw-text-black tw-text-sm tw-line-clamp-1">{info?.text}</div>
                        </TableCell>
                        <TableCell padding="none" align="center" component="th" scope="row">
                          <div className="tw-text-black">{info?.createdAt}</div>
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
                          <AIAnswerQuizList info={info} refetchReply={refetchReply} />
                        </TableCell>
                        <TableCell padding="none" align="center" component="th" scope="row">
                          <button
                            className="tw-w-24 max-lg:tw-mr-1 border tw-rounded-md tw-text-sm tw-text-black tw-py-2.5 tw-px-4"
                            onClick={() => handleClick(info?.member?.memberUUID, info?.quizSequence)}
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
          onAfterClose={() => setIsModalOpen(false)}
        >
          {isQuizGetanswer && (
            <div className="tw-rounded-xl tw-pb-10">
              <div className="tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-4 tw-rounded-t-xl">
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
                const isLastItem = index === clubQuizThreads.clubQuizThreads.length - 1;
                return (
                  <div
                    key={index}
                    className={`border-bottom border-left border-right border-secondary tw-bg-white tw-flex tw-p-3 ${
                      isLastItem ? 'tw-rounded-bl-xl tw-rounded-br-xl' : ''
                    }`}
                  >
                    <div className="tw-w-1/12 tw-pt-3 tw-flex tw-flex-col tw-items-center">
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
                          d="M6 6.32422V12.3242C6 13.1199 6.31607 13.8829 6.87868 14.4455C7.44129 15.0081 8.20435 15.3242 9 15.3242H19M19 15.3242L15 11.3242M19 15.3242L15 19.3242"
                          stroke="#c0c3c9"
                          strokeWidth={2}
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col">
                      <img className="border tw-rounded-full tw-w-10 tw-h-10 " src={item?.member?.profileImageUrl} />
                      <div className="tw-text-xs tw-text-left tw-text-black tw-pt-2">{item?.member?.nickname}</div>
                    </div>
                    <div className="tw-flex-auto tw-w-9/12 tw-px-5">
                      <div className="tw-py-2">
                        <div className="tw-font-medium tw-text-[#9ca5b2] tw-text-sm">
                          <span
                            className={`tw-font-bold ${
                              item?.threadType === '0003' ? 'tw-text-red-500' : 'tw-text-black'
                            }`}
                          >
                            {item?.threadType === '0001' && '사전 답변'}
                            {item?.threadType === '0002' && '사후 답변'}
                            {item?.threadType === '0003' && 'AI답변'}
                            {item?.threadType === '0004' && item?.member?.nickname}
                          </span>
                          <span className="tw-px-4">{item?.createdAt.replace('T', ' | ').split('.')[0]}</span>

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
                      <div
                        className={`tw-font-medium tw-text-[#9ca5b2] tw-text-sm ${
                          item?.threadType === '0003' ? 'tw-text-black' : ''
                        }`}
                      >
                        {item?.text}
                      </div>

                      <div className="tw-flex  tw-py-2">
                        <div className="tw-text-left tw-text-sm">
                          <ul className="">
                            {item?.contents?.map((file, index) => (
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
                                ㄴ지식컨텐츠 : {file.description}
                              </div>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="tw-text-sm tw-flex tw-items-center tw-gap-2">
                        {item?.files?.length > 0 && (
                          <div className="tw-flex ">
                            <div className="tw-text-left tw-text-sm">
                              <ul className="">
                                {item?.files?.map((file, index) => (
                                  <div
                                    key={index}
                                    onClick={() => {
                                      onFileDownload(file.key, file.name);
                                    }}
                                    className="tw-underline tw-text-blue-500 tw-cursor-pointer tw-p-1  tw-mb-1"
                                  >
                                    ㄴ첨부된파일 : {file.name}
                                  </div>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isHideAI === true && (
                // Check if the threadType is '0004' and return null to hide the div
                <div>
                  <div className="tw-py-5 tw-flex tw-items-center tw-gap-3 tw-text-sm tw-text-black">
                    <img src={user?.member?.profileImageUrl} className="tw-w-10 tw-h-10 border tw-rounded-full" />
                    <div className="tw-flex-grow">
                      {user?.member?.nickname}
                      <button
                        onClick={() => {
                          setClubQuizGetThreads('');
                          refetchQuizAnswerGet();
                          setIsLoadingAI(true);
                        }}
                        className="tw-w-[140px] tw-ml-3 tw-rounded tw-bg-black tw-text-white tw-text-sm tw-text-black tw-py-2 tw-px-4"
                      >
                        {isLoadingAI ? <CircularProgress color="info" size={18} /> : 'AI피드백 불러오기'}
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
                        width={17}
                        height={15}
                        viewBox="0 0 17 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-0 top-1"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M13.7404 10.9501C14.4723 10.9501 15.1742 10.669 15.6917 10.1685C16.2093 9.66806 16.5 8.98929 16.5 8.28152C16.5 7.57376 16.2093 6.89499 15.6917 6.39452C15.1742 5.89406 14.4723 5.6129 13.7404 5.6129H12.9519C13.0669 5.11727 13.0687 4.60677 12.957 4.11054C12.8454 3.61432 12.6225 3.14209 12.3012 2.72082C11.9799 2.29956 11.5663 1.9375 11.0842 1.65532C10.6021 1.37314 10.0609 1.17637 9.49138 1.07625C8.92189 0.976118 8.33532 0.974593 7.76515 1.07176C7.19499 1.16892 6.6524 1.36287 6.16835 1.64254C5.19079 2.20735 4.51107 3.087 4.27872 4.08798C3.43817 4.05542 2.61153 4.29415 1.94033 4.76329C1.26913 5.23243 0.795119 5.90281 0.599459 6.65963C0.403799 7.41646 0.498659 8.21266 0.867798 8.91191C1.23694 9.61117 1.85739 10.17 2.62293 10.4927M8.22108 7.13783V14M8.22108 14L5.85567 11.7126M8.22108 14L10.5865 11.7126"
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <button onClick={handleAddInput} className="tw-text-sm tw-text-left tw-text-[#31343d]">
                        지식콘텐츠 불러오기
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
                        accept=".jpeg,.jpg,.png,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.hwp"
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  {inputList.length > 0 && (
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
                                placeholder="지식컨텐츠 제목을 입력하세요."
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
                        setIsModalOpen(false);
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
            </div>
          )}
        </MentorsModal>

        {/* <QuizClubAnswersView
          QuizProgressData={quizProgressData}
          clubQuizThreads={clubQuizThreads}
          selectedValue={selectedValue}
          handleQuizChange={handleQuizChange}
          border={false}
          clubInfo={clubInfo}
          leaders={leaders}
          clubQuizzes={clubQuizzes}
          totalElements={totalElements}
          totalPage={totalPage}
          page={page}
          handlePageChange={handlePageChange}
          quizList={quizList}
          representativeQuizzes={representativeQuizzes}
        /> */}
      </div>
    </div>
  );
}

export default QuizViewAllAnswersTemplate;
