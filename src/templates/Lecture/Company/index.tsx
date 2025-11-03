import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import { ExperiencesResponse } from 'src/models/experiences';
import { useOptions } from 'src/services/experiences/experiences.queries';
import { UseQueryResult } from 'react-query';
import AICompanyFeedbackSummary from 'src/stories/components/AICompanyFeedbackSummary/index';
import {
  useLearnerAnalysisMembers,
  useLearnerAnalysisMemberClubs,
  useLearnerAnalysisMemberClubDetail,
} from 'src/services/seminars/seminars.queries';
import Paginations from 'src/stories/components/Pagination';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  useQuizAIFeedbackLectureGetMember,
  useQuizFileDownload,
  useQuizAIFeedbackLectureGetMemberCQI,
} from 'src/services/quiz/quiz.queries';
import { useSessionStore } from '../../../store/session';
import MentorsModal from 'src/stories/components/MentorsModal';
import { useLectureClubEvaluationReport } from 'src/services/community/community.mutations';

export interface LectureCompanyTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

const cx = classNames.bind(styles);

export function LectureCompanyTemplate({ id }: LectureCompanyTemplateProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [clientState, setClientState] = useState({
    roles: [],
    studyOrderLabelType: null,
  });

  const [page, setPage] = useState(1);
  const [pageStudent, setPageStudent] = useState(1);
  const [questionPage, setQuestionPage] = useState(1);
  const [studentQuestionPage, setStudentQuestionPage] = useState(1);
  const [totalStudentPage, setTotalStudentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [clubStudySequence, setClubStudySequence] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  const [aiEvaluationParamsTotal, setAiEvaluationParamsTotal] = useState(null);
  const [aiEvaluationParamsTotalCQI, setAiEvaluationParamsTotalCQI] = useState(null);
  const [aiFeedbackDataTotal, setAiFeedbackDataTotal] = useState<any>(null);
  const [aiFeedbackDataTotalReport, setAiFeedbackDataTotalReport] = useState<any>(null);
  const [aiFeedbackDataTotalQuiz, setAiFeedbackDataTotalQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCQIReport, setIsLoadingCQIReport] = useState(false);
  const [isAIFeedbackModalOpen, setIsAIFeedbackModalOpen] = useState(false);
  const [key, setKey] = useState('');
  const [fileName, setFileName] = useState('');
  const [memberUUID, setMemberUUID] = useState('');
  const [memberUUIDList, setMemberUUIDList] = useState('');
  const [selectedStudentInfo, setSelectedStudentInfo] = useState<any>(null);
  const [sortType, setSortType] = useState('DILIGENCE');
  const [myClubLectureQA, setMyClubLectureQA] = useState<any>(null);
  const [sortLectureType, setSortLectureType] = useState('STUDY_ORDER_ASC');
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [learnerAnalysisParams, setLearnerAnalysisParams] = useState<any>({
    sortType: 'DESC',
    page: 1,
    size: 10,
    keyword: '',
    jobGroup: '',
    job: '',
    clubMemberEvaluationSortType: 'DILIGENCE',
  });
  const [learnerAnalysisData, setLearnerAnalysisData] = useState<any>(null);
  const [memberClubsData, setMemberClubsData] = useState<any[]>([]);
  const [selectedMemberClubSequence, setSelectedMemberClubSequence] = useState<any>(null);
  const [memberClubDetailData, setMemberClubDetailData] = useState<any>(null);
  const [jobs, setJobs] = useState([]);
  const handleChange = event => {
    const selectedCode = event.target.value;
    const selected = (optionsData as any)?.data?.jobs?.find(u => u.code === selectedCode);
    setAge(selectedCode);
    setJobs(selected ? selected.jobs : []);

    // 대학 선택 시 jobGroup 업데이트 및 학과 초기화
    setLearnerAnalysisParams(prev => ({
      ...prev,
      jobGroup: selectedCode || '',
      job: '', // 대학 변경 시 학과 초기화
      page: 1,
    }));
    setJob(''); // 학과도 초기화
    setPageStudent(1);
  };

  const handleChangeJob = event => {
    const selectedCode = event.target.value;
    const selected = jobs?.find(u => u.code === selectedCode);
    setJob(selectedCode);

    // 학과 선택 시 job 업데이트
    setLearnerAnalysisParams(prev => ({
      ...prev,
      job: selectedCode || '',
      page: 1,
    }));
    setPageStudent(1);
  };

  const [myClubParams, setMyClubParams] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    data: { sortType: 'NAME', page: 1 },
  });
  const [myClubLectureParams, setMyClubLectureParams] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    data: { orderBy: 'STUDY_ORDER', lecturePage: 1, sortType: 'ASC' },
  });

  const [myClubLectureStudentQA, setMyClubLectureStudentQA] = useState<any>({
    clubSequence: selectedClub?.clubSequence || id,
    memberUUID: '',
    data: { studentQuestionPage: 1 },
  });
  const [answer, setAnswer] = useState('');

  const { data: optionsData }: UseQueryResult<ExperiencesResponse> = useOptions();

  /** 개별 클럽의 CQI 보고서 생성 */
  const {
    mutate: onLectureClubEvaluationReport,
    isSuccess: lectureClubEvaluationReportSucces,
    isError: lectureClubEvaluationReportError,
  } = useLectureClubEvaluationReport();

  // AI 피드백 데이터 조회
  const {
    refetch: refetchAIEvaluationTotal,
    isError: isErrorAIEvaluationTotal,
    isSuccess: isSuccessAIEvaluationTotal,
  } = useQuizAIFeedbackLectureGetMember(
    aiEvaluationParamsTotal,
    data => {
      console.log('🎉 AI Evaluation Total SUCCESS:', data);
      setAiFeedbackDataTotal(data);
    },
    error => {
      console.error('❌ AI Evaluation Total ERROR:', error);
      alert('피드백 데이터를 불러오는데 실패했습니다.');
    },
  );

  // CQI 피드백 데이터 조회
  const {
    refetch: refetchAIEvaluationTotalCQI,
    isError: isErrorAIEvaluationTotalCQI,
    isSuccess: isSuccessAIEvaluationTotalCQI,
  } = useQuizAIFeedbackLectureGetMemberCQI(
    aiEvaluationParamsTotalCQI,
    data => {
      console.log('🎉 AI Evaluation Total SUCCESS:', data);
      setAiFeedbackDataTotalReport(data);
    },
    error => {
      console.error('❌ AI Evaluation Total ERROR:', error);
      alert('피드백 데이터를 불러오는데 실패했습니다.');
    },
  );

  useEffect(() => {
    if (lectureClubEvaluationReportSucces || lectureClubEvaluationReportError) {
      refetchAIEvaluationTotalCQI();
      setIsLoadingCQIReport(false);
    }
  }, [lectureClubEvaluationReportSucces, lectureClubEvaluationReportError]);

  useEffect(() => {
    if (isSuccessAIEvaluationTotalCQI || isErrorAIEvaluationTotalCQI) {
      refetchAIEvaluationTotalCQI();
      setIsLoadingCQIReport(false);
    }
  }, [isSuccessAIEvaluationTotalCQI, isErrorAIEvaluationTotalCQI]);

  const handleChangeQuiz = event => {
    const value = event.target.value;
    setSortType(value);
    // 정렬 타입에 따라 clubMemberEvaluationSortType 매핑
    let clubMemberEvaluationSortType = value; // DILIGENCE, UNDERSTANDING, PARTICIPATION, AVERAGE
    let sortTypeParam = 'DESC'; // 기본값은 내림차순

    setLearnerAnalysisParams(prev => ({
      ...prev,
      sortType: sortTypeParam,
      clubMemberEvaluationSortType: clubMemberEvaluationSortType,
      page: 1,
    }));
    setPageStudent(1);
  };

  useDidMountEffect(() => {
    setMyClubParams({
      clubSequence: selectedClub?.clubSequence || id,
      data: { sortType: sortType, page: pageStudent, orderBy: sortType === 'NAME' ? 'ASC' : 'DESC' },
    });
  }, [pageStudent]);

  useDidMountEffect(() => {
    let dataParam = {};
    if (sortLectureType === 'STUDY_ORDER_ASC') {
      dataParam = { orderBy: 'STUDY_ORDER', page: page, sortType: 'ASC' };
    } else if (sortLectureType === 'STUDY_ORDER_DESC') {
      dataParam = { orderBy: 'STUDY_ORDER', page: page, sortType: 'DESC' };
    } else {
      dataParam = { orderBy: 'QUESTION_COUNT', page: page, sortType: 'DESC' };
    }

    setMyClubLectureParams({
      clubSequence: selectedClub?.clubSequence || id,
      data: dataParam,
    });
  }, [page]);

  useDidMountEffect(() => {
    console.log('questionPage', questionPage);
    setMyClubLectureQA({
      clubSequence: selectedClub?.clubSequence || id,
      sequence: clubStudySequence,
      data: { questionPage: questionPage },
    });
  }, [questionPage]);

  // 페이지가 변경될 때만 동작하도록 수정, memberUUID가 없으면 실행하지 않음
  useDidMountEffect(() => {
    if (memberUUID) {
      setMyClubLectureStudentQA({
        clubSequence: selectedClub?.clubSequence || id,
        sequence: clubStudySequence,
        memberUUID: memberUUID,
        data: { studentQuestionPage: studentQuestionPage },
      });
    } else {
      console.error('memberUUID is missing');
    }
  }, [studentQuestionPage, memberUUID]); // memberUUID가 없을 때 에러 방지

  useEffect(() => {
    if (memberUUID) {
      console.log('memberUUID', memberUUID);
      setMyClubLectureStudentQA({
        clubSequence: selectedClub?.clubSequence || id,
        memberUUID: memberUUID,
        data: { studentQuestionPage: 1 },
      });
    }
  }, [memberUUID]);

  const { isFetched: isParticipantListFetcheds, isSuccess: isParticipantListSuccess } = useQuizFileDownload(
    key,
    data => {
      console.log('file download', data, fileName);
      if (data) {
        const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        window.open(url, '_blank', 'noopener,noreferrer');
        setKey('');
        setFileName('');
      }
    },
  );

  function formatDate(sentAt) {
    if (!sentAt) return '';
    const date = new Date(sentAt);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  }

  // 클라이언트 마운트 후 상태 설정
  useEffect(() => {
    setIsMounted(true);
    try {
      const { roles, studyOrderLabelType } = useSessionStore.getState();
      setClientState({ roles, studyOrderLabelType });
    } catch (error) {
      console.error('Session store error:', error);
    }
  }, []);

  // 학습자 분석 데이터 조회
  const {
    isFetched: isLearnerAnalysisFetched,
    isSuccess: isLearnerAnalysisSuccess,
    refetch: refetchLearnerAnalysis,
  } = useLearnerAnalysisMembers(
    learnerAnalysisParams,
    data => {
      console.log('🎉 Learner Analysis SUCCESS:', data);
      setLearnerAnalysisData(data);
      if (data?.totalPages) {
        setTotalStudentPage(data.totalPages);
      }
      if (data?.totalElements) {
        setTotalElements(data.totalElements);
      }
    },
    error => {
      console.error('❌ Learner Analysis ERROR:', error);
      alert('학습자 분석 데이터를 불러오는데 실패했습니다.');
    },
  );

  // 회원별 퀴즈클럽 목록 조회
  const {
    data: memberClubsResponse,
    isFetched: isMemberClubsFetched,
    isSuccess: isMemberClubsSuccess,
    refetch: refetchMemberClubs,
  } = useLearnerAnalysisMemberClubs(
    memberUUIDList,
    data => {
      console.log('🎉 Member Clubs SUCCESS:', data);
      setMemberClubsData(data || []);
      // 첫 번째 클럽을 기본 선택
      if (data && data.length > 0) {
        setSelectedMemberClubSequence(String(data[0].clubSequence));
      }
    },
    error => {
      console.error('❌ Member Clubs ERROR:', error);
      alert('퀴즈클럽 목록을 불러오는데 실패했습니다.');
    },
  );

  // 회원별 클럽 상세 조회
  const {
    data: memberClubDetailResponse,
    isFetched: isMemberClubDetailFetched,
    isSuccess: isMemberClubDetailSuccess,
    refetch: refetchMemberClubDetail,
  } = useLearnerAnalysisMemberClubDetail(
    memberUUIDList,
    selectedMemberClubSequence ? Number(selectedMemberClubSequence) : undefined,
    data => {
      console.log('🎉 Member Club Detail SUCCESS:', data);
      setMemberClubDetailData(data);
    },
    error => {
      console.error('❌ Member Club Detail ERROR:', error);
      alert('클럽 상세 정보를 불러오는데 실패했습니다.');
    },
  );

  console.log('memberClubDetailResponse', memberClubDetailResponse);

  useDidMountEffect(() => {
    if (learnerAnalysisParams) {
      refetchLearnerAnalysis();
    }
  }, [learnerAnalysisParams]);

  // AI 개별 피드백 데이터 조회
  useDidMountEffect(() => {
    if (aiEvaluationParamsTotal) {
      refetchAIEvaluationTotal();
    }
  }, [aiEvaluationParamsTotal]);

  useDidMountEffect(() => {
    if (aiEvaluationParamsTotalCQI) {
      refetchAIEvaluationTotalCQI();
    }
  }, [aiEvaluationParamsTotalCQI]);

  // 회원별 퀴즈클럽 목록이 로드되면 첫 번째 클럽 선택 및 AI 평가 파라미터 설정
  useDidMountEffect(() => {
    if (memberClubsData && memberClubsData.length > 0 && memberUUIDList) {
      const firstClub = memberClubsData[0];
      setSelectedMemberClubSequence(String(firstClub.clubSequence));
      setSelectedClub(firstClub);
      setAiEvaluationParamsTotal({
        clubSequence: firstClub.clubSequence,
        memberUUID: memberUUIDList,
      });
    }
  }, [memberClubsData, memberUUIDList]);

  // 클럽 선택 시 상세 데이터 자동 조회
  useDidMountEffect(() => {
    if (selectedMemberClubSequence && memberUUIDList) {
      refetchMemberClubDetail();
    }
  }, [selectedMemberClubSequence, memberUUIDList]);

  // 마운트되지 않았을 때 로딩 표시
  if (!isMounted) {
    return (
      <div className={cx('seminar-container')}>
        <div className={cx('container')}>
          <div className="tw-pt-8">
            <div className="tw-flex tw-justify-center tw-items-center tw-h-[50vh]">
              <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <div className="tw-pt-8">
          <div className="tw-flex tw-justify-start tw-items-start tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#313b49]">메뉴1</p>
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
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#313b49]">상세메뉴</p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              추천 학습자 대시보드
            </p>
          </div>
          <Divider className="tw-py-2 tw-bg-['#efefef']" />
        </div>
        <>
          <div className="tw-min-h-[1000px] tw-flex tw-flex-col">
            <div className="tw-flex tw-gap-2 tw-items-center tw-mt-10 tw-mb-10">
              <div className="tw-flex tw-items-center tw-gap-5">
                <select
                  className="tw-h-10 tw-w-[250px] form-select block tw-px-4 tw-rounded"
                  onChange={handleChange}
                  value={age}
                  aria-label="Default select example"
                >
                  <option value="">대학을 선택해주세요.</option>
                  {(optionsData as any)?.data?.jobs?.map((university, index) => (
                    <option key={index} value={university.code}>
                      {university.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="tw-flex tw-items-center tw-gap-2">
                <select
                  className="tw-h-10 tw-w-[250px] form-select block tw-px-4 tw-rounded"
                  onChange={handleChangeJob}
                  value={job}
                  aria-label="Default select example"
                >
                  <option value="">학과를 선택해주세요.</option>
                  {jobs.map((job, index) => (
                    <option key={index} value={job.code}>
                      {job.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="tw-flex tw-justify-between tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
              <div>
                <RadioGroup
                  className="tw-items-center tw-py-5 tw-gap-3"
                  value={sortType}
                  onChange={handleChangeQuiz}
                  row
                >
                  <p className="tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] tw-mb-1">
                    정렬 :
                  </p>
                  <FormControlLabel
                    value="DILIGENCE"
                    control={
                      <Radio
                        sx={{
                          color: '#ced4de',
                          '&.Mui-checked': { color: '#007bff' },
                        }}
                        icon={<CheckBoxOutlineBlankRoundedIcon />}
                        checkedIcon={<CheckBoxRoundedIcon />}
                      />
                    }
                    label={
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                        성실도순
                      </p>
                    }
                  />
                  <FormControlLabel
                    value="UNDERSTANDING"
                    control={
                      <Radio
                        sx={{
                          color: '#ced4de',
                          '&.Mui-checked': { color: '#007bff' },
                        }}
                        icon={<CheckBoxOutlineBlankRoundedIcon />}
                        checkedIcon={<CheckBoxRoundedIcon />}
                      />
                    }
                    label={
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                        이해도순
                      </p>
                    }
                  />
                  <FormControlLabel
                    value="PARTICIPATION"
                    control={
                      <Radio
                        sx={{
                          color: '#ced4de',
                          '&.Mui-checked': { color: '#007bff' },
                        }}
                        icon={<CheckBoxOutlineBlankRoundedIcon />}
                        checkedIcon={<CheckBoxRoundedIcon />}
                      />
                    }
                    label={
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                        참여도순
                      </p>
                    }
                  />
                  <FormControlLabel
                    value="AVERAGE"
                    control={
                      <Radio
                        sx={{
                          color: '#ced4de',
                          '&.Mui-checked': { color: '#007bff' },
                        }}
                        icon={<CheckBoxOutlineBlankRoundedIcon />}
                        checkedIcon={<CheckBoxRoundedIcon />}
                      />
                    }
                    label={
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                        전체 평균 점수순
                      </p>
                    }
                  />
                </RadioGroup>
              </div>
            </div>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                  <TableRow>
                    <TableCell align="center" width={150}>
                      <div className="tw-font-bold tw-text-base">이름</div>
                    </TableCell>
                    <TableCell align="center" width={120}>
                      <div className="tw-font-bold tw-text-base">대학</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">학과</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">이해도</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">성실도</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">사고도</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">완성도</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">참여도</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">평균 점수</div>
                    </TableCell>
                    <TableCell align="center" width={100}>
                      <div className="tw-font-bold tw-text-base">상세보기</div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {learnerAnalysisData?.contents?.map((info, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" component="th" scope="row">
                        <div className="tw-flex tw-items-center">
                          <img
                            className="tw-w-10 tw-h-10 tw-rounded-full"
                            src={info?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
                            alt="Profile"
                          />
                          <div className="tw-ml-2">{info?.member?.nickname}</div>
                        </div>
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                        <div className="tw-font-bold tw-grid tw-gap-1 tw-justify-center tw-items-center">
                          <div>
                            <span className="tw-text-sm tw-text-gray-500">{info?.jobGroup?.name || '-'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                          <span className="tw-font-bold">{info?.job?.name || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.understandingScore || 0}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.diligenceScore || 0}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.criticalThinkingScore || 0}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.completionScore || 0}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.participationScore || 0}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row">
                        <div className="tw-cursor-pointer">
                          <div className=" tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                            <span className="tw-font-bold">{info?.averageScore || 0}</span> / 100
                          </div>
                        </div>
                      </TableCell>
                      <TableCell padding="none" align="center" component="th" scope="row" width={100}>
                        <div
                          onClick={() => {
                            if (!info?.member?.memberUUID) {
                              return;
                            }
                            setSelectedStudentInfo(info);
                            setMemberUUIDList(info?.member?.memberUUID);
                            setIsAIFeedbackModalOpen(true);
                            // memberUUID 설정 후 hook이 자동으로 API 호출
                          }}
                          className="tw-gap-1 tw-p-1 tw-rounded-[5px] tw-w-[70px] tw-flex tw-justify-center tw-items-center tw-bg-[#6A7380] tw-text-white tw-cursor-pointer tw-text-sm tw-mx-auto"
                        >
                          <p>상세보기</p>
                          <svg
                            width={7}
                            height={10}
                            viewBox="0 0 7 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-grow-0 flex-shrink-0"
                            preserveAspectRatio="none"
                          >
                            <path d="M1 1L5 5L1 9" stroke="#fff" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="tw-mt-10">
              <Paginations
                page={pageStudent}
                setPage={newPage => {
                  setPageStudent(newPage);
                  setLearnerAnalysisParams(prev => ({
                    ...prev,
                    page: newPage,
                  }));
                }}
                total={totalStudentPage}
              />
            </div>
            {learnerAnalysisData?.contents?.length === 0 && (
              <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[50vh]')}>
                <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">데이터가 없습니다.</p>
              </div>
            )}
          </div>
        </>
      </div>

      {/* AI 피드백 모달 */}
      <MentorsModal
        isOpen={isAIFeedbackModalOpen}
        isContentModalClick={true}
        onAfterClose={() => {
          setIsAIFeedbackModalOpen(false);
          setSelectedStudentInfo(null);
          setIsLoading(false); // loading 상태 초기화 추가
          setMemberClubsData([]);
          setSelectedMemberClubSequence(null);
          setMemberUUIDList('');
          setMemberClubDetailData(null);
        }}
        title={'학습자분석 상세보기'}
      >
        <div>
          <div className="tw-flex tw-justify-between tw-items-center tw-gap-4 tw-mb-4">
            <div className="tw-text-xl tw-font-bold tw-text-black tw-text-center">
              수강완료 퀴즈클럽 ({memberClubsData.length})
            </div>
            <div className="tw-flex tw-gap-2">
              {selectedStudentInfo?.jobGroup?.name && (
                <span className="tw-px-2 tw-py-1 tw-text-xs tw-rounded-md tw-font-medium tw-bg-blue-200 tw-text-blue-900">
                  {selectedStudentInfo.jobGroup.name}
                </span>
              )}
              {selectedStudentInfo?.job?.name && (
                <span className="tw-px-2 tw-py-1 tw-text-xs tw-rounded-md tw-font-medium tw-bg-gray-100 tw-text-gray-700">
                  {selectedStudentInfo.job.name}
                </span>
              )}
            </div>
          </div>

          <div className="tw-mb-4">
            <select
              className="tw-w-full tw-h-14 form-select block w-full  tw-font-bold tw-px-4"
              value={selectedMemberClubSequence || ''}
              onChange={event => {
                const clubSequenceStr = event.target.value;
                const clubSequence = Number(clubSequenceStr);
                setSelectedMemberClubSequence(clubSequenceStr);
                const selectedClubData = memberClubsData.find(club => club.clubSequence === clubSequence);
                if (selectedClubData) {
                  setSelectedClub(selectedClubData);
                  setAiEvaluationParamsTotal({
                    clubSequence: clubSequence,
                    memberUUID: memberUUIDList,
                  });
                }
              }}
            >
              <option value="" disabled>
                퀴즈클럽을 선택해주세요.
              </option>
              {memberClubsData?.map((club, index) => (
                <option key={index} value={String(club.clubSequence)}>
                  {club.clubName}
                </option>
              ))}
            </select>
          </div>

          {/* 새로운 API 데이터 표시 */}
          <AICompanyFeedbackSummary
            aiFeedbackDataTotal={memberClubDetailResponse?.lectureClubEvaluation || null}
            aiFeedbackDataTotalQuiz={aiFeedbackDataTotalQuiz}
            isLoading={isLoading}
            isFeedbackOptions={true}
            isAdmin={true}
            clubSequence={selectedClub?.clubSequence || id}
            memberUUID={memberUUIDList}
          />
        </div>
      </MentorsModal>
    </div>
  );
}

export default LectureCompanyTemplate;
