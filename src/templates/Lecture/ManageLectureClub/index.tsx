import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import Divider from '@mui/material/Divider';
import {
  paramProps,
  useMyLectureList,
  useMyMemberList,
  useMyMemberRequestList,
  useProfessorRequestList,
} from 'src/services/seminars/seminars.queries';
import {
  useCrewBanDelete,
  useCrewAcceptPost,
  useCrewRejectPost,
  useInstructorsAccept,
  useInstructorsDelete,
  useCrewAcceptAllPost,
} from 'src/services/admin/friends/friends.mutations';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

/** drag list */
import ReactDragList from 'react-drag-list';

/**import quiz modal  */
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import SettingsIcon from '@mui/icons-material/Settings';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';

/** import pagenation */
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

//comment
import { useQuizFileDownload } from 'src/services/quiz/quiz.queries';
import router from 'next/router';

//quiz
import { MentorsModal } from 'src/stories/components';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import MyProfile from 'src/stories/components/MyProfile';
import { useGetProfile } from 'src/services/account/account.queries';
import { useStudyQuizOpponentBadgeList } from 'src/services/studyroom/studyroom.queries';
import { ExperiencesResponse } from 'src/models/experiences';
import { useOptions } from 'src/services/experiences/experiences.queries';
import { UseQueryResult } from 'react-query';
import { useLectureAboutDetailInfo } from 'src/services/seminars/seminars.queries';

//수정
import { InputAdornment, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Toggle, Tag } from 'src/stories/components';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { makeStyles } from '@mui/styles';
import { images, imageBanner } from './group';
import LectureBreakerInfo from 'src/stories/components/LectureBreakerInfo';
import { useLectureModify, useLectureModifyAI, useLectureModifyCur } from 'src/services/quiz/quiz.mutations';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { useStore } from 'src/store';
import { useGetScheduleDay } from 'src/services/jobs/jobs.queries';
import { useSessionStore } from 'src/store/session';
import { useGetGroupLabel } from 'src/hooks/useGetGroupLabel';
import { useStudyOrderLabel } from 'src/hooks/useStudyOrderLabel';
import 'dayjs/locale/ko';
// locale 설정
dayjs.locale('ko');

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
export const generateUUID = () => {
  return uuidv4();
};

export interface ManageLectureClubTemplateProps {
  /** 세미나 아이디 */
  id?: any;
  /** 타이틀 */
  title?: string;
  /** 서브타이틀 */
  subtitle?: boolean;
}

export function ManageLectureClubTemplate({ id, title, subtitle }: ManageLectureClubTemplateProps) {
  const { jobGroupLabelType, studyOrderLabelType } = useSessionStore.getState();
  const { groupLabel, subGroupLabel } = useGetGroupLabel(jobGroupLabelType);
  const { studyOrderLabel } = useStudyOrderLabel(studyOrderLabelType);
  const { mutate: onCrewBan, isSuccess: isBanSuccess } = useCrewBanDelete();
  const { mutate: onCrewAccept, isSuccess: isAcceptSuccess } = useCrewAcceptPost();
  const { mutate: onCrewReject, isSuccess: isRejectSuccess } = useCrewRejectPost();
  const { mutate: onCrewAcceptAll, isSuccess: isAcceptAllSuccess } = useCrewAcceptAllPost();
  const { mutate: onInstructorsAccept, isSuccess: isInstructorsAcceptSuccess } = useInstructorsAccept();
  const { mutate: onInstructorsDelete, isSuccess: isInstructorsDeleteSuccess } = useInstructorsDelete();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [totalElementsProfessor, setTotalElementsProfessor] = useState(0);
  const [pageMember, setPageMember] = useState(1);
  const [pageProfessor, setPageProfessor] = useState(1);
  const [totalPageMember, setTotalPageMember] = useState(1);
  const [totalElementsMember, setTotalElementsMember] = useState(0);
  const [myClubList, setMyClubList] = useState<any>([]);
  const [myMemberList, setMyMemberList] = useState<any>([]);
  const [myMemberRequestList, setMyMemberRequestList] = useState<any>([]);
  const [requestProfessorList, setRequestProfessorList] = useState<any>([]);
  const [ids, setIds] = useState<any>(id);
  const [myClubParams, setMyClubParams] = useState<any>({ clubSequence: id, page });
  const [selectedClub, setSelectedClub] = useState(null);
  const [sortType, setSortType] = useState('0001');
  const [professorRequestSortType, setProfessorRequestSortType] = useState('0001');
  const [sortQuizType, setSortQuizType] = useState('ASC');
  const [forbiddenKeywords, setForbiddenKeywords] = useState([]);

  const [myClubSubTitleParams, setMyClubSubTitleParams] = useState<any>({
    clubSequence: id,
    page,
    clubType: '0200',
    subtitle: subtitle,
    size: 100,
  });

  const [professorRequestParams, setProfessorRequestParams] = useState<any>({
    clubSequence: id,
    page,
  });
  const [myRequestMemberParams, setMyRequestMemberParams] = useState<any>({ clubSequence: id, page });
  const [myClubMemberParams, setMyClubMemberParams] = useState<any>({
    clubSequence: id,
    page,
    sortType: professorRequestSortType,
  });
  const [params, setParams] = useState<paramProps>({ page });
  const [quizList, setQuizList] = useState<any>([]);
  const [keyWorld, setKeyWorld] = useState('');
  const [selectedValue, setSelectedValue] = useState(id);
  const [activeTab, setActiveTab] = useState('myQuiz');
  const [pageQuiz, setPageQuiz] = useState(1);
  const [myQuizParams, setMyQuizParams] = useState<any>({ clubSequence: id, sortType: 'ASC', page });
  const [updateKey, setUpdateKey] = useState(0); // 상태 업데이트 강제 트리거를 위한 키
  const [quizListData, setQuizListData] = useState<any[]>([]);
  const [allQuizData, setAllQuizData] = useState([]);
  const [profile, setProfile] = useState<any>([]);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState<boolean>(false);
  const [memberUUID, setMemberUUID] = useState<string>('');
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [clubAbout, setClubAbout] = useState<any>({});
  const { user, setUser } = useStore();
  const [paramss, setParamss] = useState<any>({});
  const [levelNames, setLevelNames] = useState([]);
  const [lectureLanguage, setLectureLanguage] = useState('kor');
  const [aiAnswerLengths, setAiAnswerLengths] = useState('medium');
  const [contentLanguage, setContentLanguage] = useState('kor');
  const [lectureAILanguage, setLectureAILanguage] = useState('kor');
  const [participationCode, setParticipationCode] = useState('');
  const [isPublic, setIsPublic] = useState('0001');
  const [isQuestionsPublic, setIsQuestionsPublic] = useState('true');
  const [enableAiQuestion, setEnableAiQuestion] = useState('false');
  const [includeReferenceToAnswer, setIncludeReferenceToAnswer] = useState('true');
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [startDay, setStartDay] = React.useState<Dayjs | null>(dayjs());
  const [endDay, setEndDay] = React.useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [clubName, setClubName] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState([]);
  const [universityCode, setUniversityCode] = useState<string>('');
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [personName, setPersonName] = useState([]);
  const [studySubject, setStudySubject] = useState('');
  const [studyKeywords, setStudyKeywords] = useState([]);
  const [introductionText, setIntroductionText] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageCheck, setSelectedImageCheck] = useState(null);
  const [selectedImageBanner, setSelectedImageBanner] = useState('');
  const [selectedImageBannerCheck, setSelectedImageBannerCheck] = useState(null);
  const [selectedImageProfile, setSelectedImageProfile] = useState('/assets/images/account/default_profile_image.png');
  const [selectedImageProfileCheck, setSelectedImageProfileCheck] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [urlCode, setUrlCode] = useState('');
  const [studyCycleNum, setStudyCycleNum] = useState([]);
  let [key, setKey] = useState('');
  let [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreements, setAgreements] = useState(true);
  const [dayParams, setDayParams] = useState<any>({});
  const [aiSummarySettings, setAiSummarySettings] = useState({
    minimumCompletionCount: 1, // 최소 실행 설정 (기본값: 10회)
    comprehensiveEvaluationPermissions: ['0001'], // 배열로 관리
    comprehensiveEvaluationViewPermissions: ['0001', '0003'], // 배열로 관리
  });

  const [badgePage, setBadgePage] = useState(1);
  const [badgeParams, setBadgeParams] = useState<any>({ page: badgePage, memberUUID: memberUUID });
  const [badgeContents, setBadgeContents] = useState<any[]>([]);

  const cx = classNames.bind(styles);

  const { data: optionsData }: UseQueryResult<ExperiencesResponse> = useOptions();

  useEffect(() => {
    // Merge new data from quizListData into allQuizData
    setAllQuizData(prevAllQuizData => {
      const mergedQuizData = [...prevAllQuizData];
      const existingSequences = new Set(mergedQuizData.map(quiz => quiz.quizSequence));

      quizListData.forEach(quiz => {
        if (!existingSequences.has(quiz.quizSequence)) {
          mergedQuizData.push(quiz);
          existingSequences.add(quiz.quizSequence);
        }
      });

      return mergedQuizData;
    });
  }, [quizListData]);

  const handleTabClick = tab => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (isInstructorsAcceptSuccess || isInstructorsDeleteSuccess || isBanSuccess) {
      refetchProfessorRequest();
      refetchMyMember();
      setSelectedUUIDs([]);
    }
  }, [isInstructorsAcceptSuccess, isInstructorsDeleteSuccess, isBanSuccess]);

  useEffect(() => {
    // 상태 업데이트 후 추가 작업 수행
    console.log('scheduleData가 업데이트되었습니다.', quizList);
    setUpdateKey(prevKey => prevKey + 1);
  }, [quizList]);

  const handleChangeQuiz = event => {
    console.log('event.target.value', event.target.value);
    setSortType(event.target.value);
    setPageMember(1);
  };

  const handleChangeProfessorRequest = event => {
    setProfessorRequestSortType(event.target.value);
  };

  const handleChangeProfessorRequestButton = event => {
    console.log('123  ', selectedUUIDs);
    if (selectedUUIDs.length === 0) {
      alert('교수자를 선택해주세요.');
      return;
    }
    let params = {
      club: selectedClub?.clubSequence,
      memberUUIDs: selectedUUIDs,
    };
    onInstructorsAccept(params);
  };

  // 퀴즈 소개 정보 조회
  const { isFetched: isClubAboutFetched, refetch: refetchClubAbout } = useLectureAboutDetailInfo(ids, data => {
    console.log('data.lectureClub', data);
    if (!data?.lectureClub) {
      alert('club이 없습니다.');
      return;
    }
    setClubAbout(data.lectureClub);
    console.log('useLectureAboutDetail', data);

    const clubForm = data?.lectureClub || {};
    const lectureList = data?.clubStudies || [];
    const lectureContents = data?.lectureContents || [];

    console.log('load temp', data);
    console.log('lectureList', lectureList);

    setParamss(clubForm);

    setClubName(clubForm.clubName || '');
    setStartDay(clubForm.startAt ? dayjs(clubForm.startAt) : dayjs());
    setEndDay(clubForm.endAt ? dayjs(clubForm.endAt) : dayjs());
    setIsPublic(clubForm.isPublic ? '0001' : '0002');

    setForbiddenKeywords(clubForm.forbiddenWords || []);

    //ai조교 config
    console.log('clubForm.isQuestionsPublic', clubForm.isQuestionsPublic);
    console.log('clubForm.enableAiQuestion', clubForm.enableAiQuestion);
    setIsQuestionsPublic(clubForm.isQuestionsPublic ? 'true' : 'false');
    setEnableAiQuestion(clubForm.enableAiQuestion ? 'true' : 'false');
    setIncludeReferenceToAnswer(clubForm.includeReferenceToAnswer ? 'true' : 'false');

    console.log('load temp', clubForm.studyKeywords);
    setStudyKeywords(clubForm.studyKeywords || []);
    setStudySubject(clubForm.studySubject || '');
    setUniversityCode(clubForm.jobGroups[0]?.code || '');
    setRecommendLevels(clubForm.jobLevels.map(item => item.code) || '');
    console.log(clubForm?.jobLevels?.map(item => item.name));
    setStudyCycleNum(clubForm.clubStudyCount || 0);
    setLevelNames(clubForm.jobLevels.map(item => item.name));

    const selected = optionsData?.data?.jobs?.find(u => u.code === clubForm.jobGroups[0]?.code);
    setSelectedUniversityName(clubForm.jobGroups[0]?.name || '');
    const jobsName = clubForm.jobs.map(item => item.name);
    setJobs(selected ? selected.jobs : []);
    const jobsCode = clubForm.jobs.map(item => item.code);
    setSelectedJob(jobsCode || []);
    setPersonName(jobsName || []);
    setIntroductionText(clubForm.description || '');

    setLectureLanguage(clubForm.lectureLanguage);
    setContentLanguage(clubForm.contentLanguage);
    setLectureAILanguage(clubForm.aiConversationLanguage);
    setAiAnswerLengths(clubForm.aiAnswerLengthType || 'medium');
    setAgreements(clubForm.useCurrentProfileImage);

    setPreview(clubForm.clubImageUrl);
    setPreviewBanner(clubForm.backgroundImageUrl);
    setSelectedImageCheck(clubForm.clubImageUrl);
    setSelectedImageBannerCheck(clubForm.backgroundImageUrl);
    setPreviewProfile(clubForm.instructorProfileImageUrl);

    setAiSummarySettings({
      minimumCompletionCount: clubForm.comprehensiveEvaluationMinimumCount,
      comprehensiveEvaluationPermissions: clubForm.comprehensiveEvaluationPermissions,
      comprehensiveEvaluationViewPermissions: clubForm.comprehensiveEvaluationViewPermissions,
    });

    setSelectedImage('');
    setSelectedImageBanner('');
    setSelectedImageProfile('');

    // Add fileList and urlList to each item in the data array
    const updatedData = lectureList.map(item => ({
      ...item,
      isNew: 'false',
      fileList: [],
      urlList: [],
    }));

    console.log('updatedData', updatedData);

    setScheduleData(updatedData);
    setLectureContents(lectureContents);
  });

  // 강의클럽 리스트
  const { isFetched: isContentFetched, refetch: refetchMyClub } = useMyLectureList(myClubSubTitleParams, data => {
    setMyClubList(data?.data?.contents || []);
    const foundClub = data?.data?.contents?.find(club => club.clubSequence === parseInt(id));
    setSelectedClub(foundClub);
  });

  // 내 요청 회원 목록 조회
  const { isFetched: isDashboardRequestFetched, refetch: refetchMyDashboardRequest } = useMyMemberRequestList(
    myClubParams,
    data => {
      console.log('내 요청 회원 목록 조회', data);
      setMyMemberRequestList(data?.contents || []);
      setTotalElements(data?.totalElements);
    },
  );

  // 교수자 요청 회원 목록 조회
  const { isFetched: isProfessorRequestFetched, refetch: refetchProfessorRequest } = useProfessorRequestList(
    professorRequestParams,
    data => {
      console.log('교수자 요청 회원 목록 조회', data);
      setRequestProfessorList(data?.contents || []);
      setTotalElementsProfessor(data?.totalElements);
    },
  );

  // 내 회원 목록 조회
  const { isFetched: isMemberFetched, refetch: refetchMyMember } = useMyMemberList(myClubMemberParams, data => {
    console.log(data);
    setTotalPageMember(data?.totalPages);
    setTotalElementsMember(data?.totalElements);
    setMyMemberList(data?.contents || []);
  });

  // 회원 프로필 정보
  const { isFetched: isProfileFetched, refetch: refetchProfile } = useGetProfile(memberUUID, data => {
    console.log(data?.data?.data);
    setProfile(data?.data?.data);
  });

  const { isFetched: isQuizbadgeFetched, refetch: QuizRefetchBadge } = useStudyQuizOpponentBadgeList(
    badgeParams,
    data => {
      setBadgeContents(data?.data?.contents);
    },
  );

  useEffect(() => {
    refetchMyMember();
  }, [isBanSuccess]);

  useEffect(() => {
    refetchMyMember();
    refetchMyDashboardRequest();
  }, [isAcceptSuccess, isRejectSuccess, isAcceptAllSuccess]);

  useDidMountEffect(() => {
    setMyClubParams({
      clubSequence: selectedValue,
      sortType: sortType,
      page: page,
    });
    setMyRequestMemberParams({
      clubSequence: selectedValue,
      sortType: sortType,
      page: pageMember,
    });
    setMyClubMemberParams({
      clubSequence: selectedValue,
      page: pageMember,
    });
    setProfessorRequestParams({
      clubSequence: selectedValue,
      page: pageMember,
    });
  }, [selectedValue]);

  useDidMountEffect(() => {
    setMyClubMemberParams({
      clubSequence: selectedClub?.clubSequence,
      page: pageMember,
      sortType: sortType,
      keyword: keyWorld,
    });
  }, [pageMember, sortType, keyWorld]);

  useDidMountEffect(() => {
    setMyQuizParams({
      clubSequence: selectedClub?.clubSequence,
      page: pageQuiz,
      sortType: sortQuizType,
    });
  }, [pageQuiz, sortQuizType]);

  useDidMountEffect(() => {
    setProfessorRequestParams({
      clubSequence: selectedClub?.clubSequence,
      page: pageProfessor,
      sortType: professorRequestSortType,
    });
  }, [pageProfessor, professorRequestSortType]);

  const handleQuizChange = event => {
    const value = event.target.value;
    const selectedSession = myClubList?.find(session => session.clubSequence === Number(value));

    setSelectedValue(value);
    setSelectedClub(selectedSession);
    setIds(selectedSession.clubSequence);
    console.log('selectedSession', selectedSession.clubSequence);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const handlePageChangeMember = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageMember(value);
  };

  //get schedule
  const { refetch: refetchGetSchedule, isSuccess: isScheduleSuccess }: UseQueryResult<any> = useGetScheduleDay(
    dayParams,
    data => {
      // setScheduleData(data.schedules);
      // 데이터를 변환하여 schedule에 추가
      const schedule = [];
      data.schedules.forEach(item => {
        const currentDay = moment(item.publishDate, 'YYYY-MM-DD');
        schedule.push({
          studyOrder: item.order,
          clubStudyName: '',
          clubStudyType: '0100',
          clubStudyUrl: '',
          urls: [],
          files: [],
          startDate: currentDay.format('YYYY-MM-DD'),
          endDate: currentDay.add(1, 'days').format('YYYY-MM-DD'),
        });
      });
      console.log('schedule', schedule);
      setScheduleData(schedule);
    },
  );

  const { mutate: onLectureModify, isError, isSuccess: clubSuccess, data: clubDatas } = useLectureModify();
  const {
    mutate: onLectureModifyCur,
    isError: isErrorCur,
    isSuccess: clubSuccessCur,
    data: clubDatasCur,
  } = useLectureModifyCur();

  const {
    mutate: onLectureModifyAI,
    isError: isErrorAI,
    isSuccess: clubSuccessAI,
    data: clubDatasAI,
  } = useLectureModifyAI();

  useEffect(() => {
    if (clubSuccess || clubSuccessAI || clubSuccessCur) {
      setIsProcessing(false);
      refetchClubAbout();
    }
  }, [clubSuccess, clubSuccessAI, clubSuccessCur]);

  useEffect(() => {
    if (isError || isErrorAI || isErrorCur) {
      setIsProcessing(false);
      refetchClubAbout();
    }
  }, [isError, isErrorAI, isErrorCur]);

  const { isFetched: isParticipantListFetcheds, isSuccess: isParticipantListSuccess } = useQuizFileDownload(
    key,
    data => {
      console.log('file download', data, fileName);
      if (data) {
        // 파일 확장자 확인
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        const isPdf = fileExtension === 'pdf';

        if (isPdf) {
          // PDF 파일인 경우 새 탭에서 열기
          const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          // PDF가 아닌 경우 다운로드
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url); // URL 객체 해제
        }

        setKey('');
        setFileName('');
      }
    },
  );

  const handleFileChange = event => {
    const files = Array.from(event.target.files);
    const allowedExtensions = /(\.pdf|\.pptx)$/i;
    const maxFileSize = 50 * 1024 * 1024; // 50MB in bytes

    for (let i = 0; i < files.length; i++) {
      if (!allowedExtensions.exec(files[i].name)) {
        alert('허용되지 않는 파일 형식입니다.');
        event.target.value = ''; // input 초기화
        return;
      }
      if (files[i].size > maxFileSize) {
        alert('파일 크기는 50MB를 초과할 수 없습니다.');
        event.target.value = ''; // input 초기화
        return;
      }
    }

    setLectureContents(prevContents => ({
      ...prevContents,
      files: [
        ...(prevContents.files || []),
        ...files.map(file => ({
          isNew: 'true',
          file: file,
          name: file.name,
          externalSharingLink: '',
          contentId: 'content_id_' + generateUUID(),
        })),
      ],
    }));
    event.target.value = '';
  };

  const [lectureContents, setLectureContents] = useState({
    files: [],
    urls: [],
  });

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleCheckboxChangeAgreements = event => {
    console.log('event', event.target.checked);
    setAgreements(event.target.checked);
  };

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key, fileName);
    setKey(key);
    setFileName(fileName);
  };

  const handleRemoveFileLocal = fileIndex => {
    setLectureContents(prevContents => ({
      ...prevContents,
      files: prevContents.files.filter((_, i) => i !== fileIndex),
    }));
  };

  const handleRemoveInputLocal = inputIndex => {
    setLectureContents(prevContents => ({
      ...prevContents,
      urls: prevContents.urls.filter((_, i) => i !== inputIndex),
    }));
  };

  const handleAddInput = input => {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      alert('URL은 http:// 또는 https://로 시작해야 합니다.');
      return;
    }

    if (!validator.isURL(input)) {
      // setErrorMessage('Is Valid URL');
      alert('올바른 URL을 입력해주세요.');
      return;
    }

    console.log(lectureContents);
    if (urlCode !== '') {
      setLectureContents(prevContents => ({
        ...prevContents,
        urls: [
          ...(prevContents.urls || []),
          {
            isNew: 'true',
            url: input,
            contentId: 'content_id_' + generateUUID(),
          },
        ],
      }));
      setUrlCode(''); // Clear the input field after adding
    }
  };

  const handleImageChange = (event, type) => {
    console.log(type);
    const file = event.target.files[0];
    if (file) {
      if (type === 'card') {
        setSelectedImage('card');
        setSelectedImageCheck(file);
      } else if (type === 'banner') {
        setSelectedImageBanner('banner');
        setSelectedImageBannerCheck(file);
      } else if (type === 'profile') {
        setSelectedImageProfile('profile');
        setAgreements(false);
        setSelectedImageProfileCheck(file);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'card') {
          setPreview(reader.result);
        } else if (type === 'banner') {
          console.log('banner');
          setPreviewBanner(reader.result);
        } else if (type === 'profile') {
          setPreviewProfile(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = null;
  };

  // 파일 이름 추출 함수
  const extractFileName = path => {
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  const handleImageClick = async (image, type, path) => {
    // console.log('image select', `${process.env['NEXT_PUBLIC_GENERAL_URL']}` + image);
    console.log('path', path);
    console.log('image', image);
    let url;
    if (path) {
      url = path;
    } else {
      console.log('false');
      // url = `${process.env['NEXT_PUBLIC_GENERAL_URL']}` + image;
      url = image;
    }
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], extractFileName(image), { type: blob.type });
    console.log('file', file);

    if (type === 'card') {
      setPreview(image);
      setSelectedImage(image);
      setSelectedImageCheck(file);
    } else if (type === 'banner') {
      setPreviewBanner(image);
      setSelectedImageBanner(image);
      setSelectedImageBannerCheck(file);
    } else if (type === 'profile') {
      console.log('profile');
      setPreviewProfile(image);
      setSelectedImageProfile(image);
      setSelectedImageProfileCheck(file);
    }
  };

  const newCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

  const onChangeHandleFromToStartDate = date => {
    if (date) {
      // Convert date to a Dayjs object
      const formattedDate = dayjs(date);
      // Format the date as 'YYYY-MM-DD'
      const formattedDateString = formattedDate.format('YYYY-MM-DD');
      // Set both today and todayEnd
      setStartDay(formattedDate);
    }
  };

  const handleStudyCycleNum = event => {
    setStudyCycleNum(event.target.value);
  };

  const onChangeHandleFromToEndDate = date => {
    if (date) {
      // Convert date to a Dayjs object
      const formattedDate = dayjs(date);
      // Format the date as 'YYYY-MM-DD'
      const formattedDateString = formattedDate.format('YYYY-MM-DD');
      // Set both today and todayEnd
      setEndDay(formattedDate);
    }
  };

  // 강의 AI 수정
  const handleSave = () => {
    setIsProcessing(true);
    handlerClubSaveTemp('save');
  };

  // 강의 수정
  const handleClubSave = () => {
    setIsProcessing(true);
    handlerClubSave();
  };

  const handleAISave = () => {
    setIsProcessing(true);
    const clubFormParams = {
      lectureLanguage: lectureLanguage || '',
      contentLanguage: contentLanguage || '',
      aiConversationLanguage: lectureAILanguage || '',
      isQuestionsPublic: isQuestionsPublic,
      enableAiQuestion: enableAiQuestion,
      includeReferenceToAnswer: includeReferenceToAnswer,
      forbiddenWords: forbiddenKeywords || [],
      comprehensiveEvaluationMinimumCount: aiSummarySettings?.minimumCompletionCount,
      comprehensiveEvaluationPermissions: aiSummarySettings?.comprehensiveEvaluationPermissions,
      comprehensiveEvaluationViewPermissions: aiSummarySettings?.comprehensiveEvaluationViewPermissions,
      aiAnswerLengthType: aiAnswerLengths || 'medium',
    };

    onLectureModifyAI({ clubFormParams, id: selectedClub?.clubSequence });
  };

  const handlerClubSaveTemp = type => {
    const formData = new FormData();
    formData.append('clubId', 'lecture_club_' + generateUUID());

    let shouldStop = false;
    const previousSchedules = [];

    for (let i = 0; i < scheduleData.length; i++) {
      const item = scheduleData[i];
      if (shouldStop) return;
      if (item?.files) {
        for (let j = 0; j < item.files.length; j++) {
          const file = item.files[j];
          if (file.serialNumber) {
            formData.append(`clubStudies[${i}].files[${j}].serialNumber`, file.serialNumber);
            formData.append(`clubStudies[${i}].files[${j}].externalSharingLink`, file.externalSharingLink);
            formData.append(`clubStudies[${i}].files[${j}].isNew`, 'false');
          } else {
            formData.append(`clubStudies[${i}].files[${j}].isNew`, 'true');
            formData.append(`clubStudies[${i}].files[${j}].file`, file.file || file);
            formData.append(`clubStudies[${i}].files[${j}].externalSharingLink`, file.externalSharingLink || '');
            formData.append(`clubStudies[${i}].files[${j}].contentId`, 'content_id_' + generateUUID());
          }
        }
      }

      if (item?.urls) {
        for (let k = 0; k < item.urls.length; k++) {
          const url = item.urls[k];
          formData.append(`clubStudies[${i}].urls[${k}].isNew`, 'true');
          formData.append(`clubStudies[${i}].urls[${k}].url`, url.url);
          formData.append(`clubStudies[${i}].urls[${k}].contentId`, 'content_id_' + generateUUID());
        }
      }

      if (item.startDate === '') {
        alert(`${i + 1}번째 강의 시작일을 입력해주세요.`);
        shouldStop = true;
        setIsProcessing(false);
        return; // 함수 전체를 종료
      }
      if (item.endDate === '') {
        alert(`${i + 1}번째 강의 종료일을 입력해주세요.`);
        shouldStop = true;
        setIsProcessing(false);
        return; // 함수 전체를 종료
      }

      if (item.clubStudyName === '') {
        alert(`${i + 1}번째 강의 이름을 입력해주세요.`);
        shouldStop = true;
        setIsProcessing(false);
        return; // 함수 전체를 종료
      }

      const nextDay3 = dayjs(item.startDate);
      const nextDay4 = dayjs(item.endDate);

      // 시작일이 종료일보다 크거나 같을 경우 오류 처리
      if (dayjs(nextDay4).isBefore(dayjs(nextDay3), 'day')) {
        alert(`${i + 1}번째 강의 : 종료일은 시작일보다 뒤에 있어야 합니다.`);
        setIsProcessing(false);
        return; // 혹은 필요에 따라 validation 실패시 코드 실행 중단
      }

      // 중복된 날짜 검사
      for (let prev of previousSchedules) {
        if (
          nextDay3.isBetween(prev.startDate, prev.endDate, null, '[]') ||
          nextDay4.isBetween(prev.startDate, prev.endDate, null, '[]') ||
          prev.startDate.isBetween(nextDay3, nextDay4, null, '[]') ||
          prev.endDate.isBetween(nextDay3, nextDay4, null, '[]')
        ) {
          alert(
            `${i + 1}번째 강의의 시작일(${nextDay3.format('YYYY-MM-DD')})과 종료일(${nextDay4.format(
              'YYYY-MM-DD',
            )})이 이전 강의날짜와 겹칩니다.`,
          );
          setIsProcessing(false);
          return;
        }
      }

      // 이전 강의 리스트에 현재 강의 추가
      previousSchedules.push({ startDate: nextDay3, endDate: nextDay4 });

      // 임시저장 로직에 false 추가, isNew 속성이 없으면 true로 설정
      if (item.isNew === undefined) {
        formData.append(`clubStudies[${i}].isNew`, 'true');
        formData.append(`clubStudies[${i}].clubStudyId`, 'club_study_id_' + generateUUID());
      } else {
        formData.append(`clubStudies[${i}].isNew`, item.isNew);
        formData.append(`clubStudies[${i}].clubStudySequence`, item.clubStudySequence);
        formData.append(`clubStudies[${i}].clubStudyId`, 'club_study_id_' + generateUUID());
      }

      formData.append(`clubStudies[${i}].studyOrder`, (i + 1).toString());
      formData.append(`clubStudies[${i}].clubStudyName`, item.clubStudyName);
      formData.append(`clubStudies[${i}].clubStudyType`, item.clubStudyType);
      formData.append(`clubStudies[${i}].clubStudyUrl`, item.clubStudyUrl || '');

      // 현재 날짜 값에 하루를 더하기
      const nextDay = dayjs(item.startDate).format('YYYY-MM-DD');
      const nextDay2 = dayjs(item.endDate).format('YYYY-MM-DD');

      formData.append(`clubStudies[${i}].startDate`, nextDay);
      formData.append(`clubStudies[${i}].endDate`, nextDay2);
    }

    lectureContents?.files?.forEach((file, j) => {
      if (file.serialNumber) {
        formData.append('lectureContents.files[' + j + '].isNew', 'false');
        formData.append('lectureContents.files[' + j + '].serialNumber', file.serialNumber);
        formData.append('lectureContents.files[' + j + '].externalSharingLink', file.externalSharingLink);
      } else {
        formData.append('lectureContents.files[' + j + '].isNew', 'true');
        formData.append('lectureContents.files[' + j + '].file', file.file || file);
        formData.append('lectureContents.files[' + j + '].externalSharingLink', file.externalSharingLink || '');
        formData.append('lectureContents.files[' + j + '].contentId', 'content_id_' + generateUUID());
      }
    });

    lectureContents?.urls?.forEach((url, k) => {
      formData.append('lectureContents.urls[' + k + '].isNew', 'true');
      formData.append('lectureContents.urls[' + k + '].url', url.url);
      formData.append('lectureContents.urls[' + k + '].contentId', 'content_id_' + generateUUID());
    });

    // To log the formData contents
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (type === 'save') {
      onLectureModifyCur({ formData, id: selectedClub?.clubSequence });
    }
  };

  // 강의 수정
  const handlerClubSave = () => {
    if (!clubName) {
      alert('클럽 이름을 입력해주세요');
      setIsProcessing(false);
      return false;
    }

    if (!universityCode) {
      alert(groupLabel + '을 선택해주세요');
      setIsProcessing(false);
      return false;
    }

    if (!selectedJob || selectedJob.length === 0) {
      alert('최소 하나의 ' + subGroupLabel + '를 선택해주세요');
      setIsProcessing(false);
      return false;
    }

    // if (studyCycleNum.length === 0) {
    //   alert('강의 회차 설정을 해주세요.');
    //   setIsProcessing(false);
    //   return false;
    // }

    if (startDay && endDay) {
      if (startDay.isSame(endDay, 'day')) {
        alert('시작 날짜와 종료 날짜가 같습니다.');
        setIsProcessing(false);
        return false;
      } else if (startDay.isAfter(endDay)) {
        alert('시작 날짜가 종료 날짜 이후일 수 없습니다.');
        setIsProcessing(false);
        return false;
      }
    }

    if (!recommendLevels || recommendLevels.length === 0) {
      alert('최소 하나의 학년을 선택해주세요');
      setIsProcessing(false);
      return false;
    }

    // startAt이 endAt보다 앞서야 하고, 두 날짜는 같을 수 없음
    if (startDay && endDay) {
      const startDate = new Date(params.startAt);
      const endDate = new Date(params.endAt);

      if (startDate >= endDate) {
        alert('종료 날짜는 시작 날짜보다 늦어야 합니다');
        setIsProcessing(false);
        return false;
      }
    }

    if (isPublic === '0002') {
      if (!participationCode) {
        alert('참여 코드를 입력해주세요');
        setIsProcessing(false);
        return false;
      }
    }

    if (!preview) {
      alert('강의 카드 이미지를 선택해주세요.');
      setIsProcessing(false);
      return false;
    }
    if (!previewBanner) {
      alert('강의 배경 이미지를 선택해주세요.');
      setIsProcessing(false);
      return false;
    }

    const clubFormParams = {
      clubName: clubName || '',
      jobGroups: [universityCode] || [],
      jobs: selectedJob || [],
      jobLevels: recommendLevels || [],
      startAt: (startDay ? startDay.format('YYYY-MM-DD') : '') + 'T00:00:00',
      endAt: (endDay ? endDay.format('YYYY-MM-DD') : '') + 'T00:00:00',
      studySubject: studySubject || '',
      studyKeywords: studyKeywords || '',
      isPublic: isPublic === '0001' ? 'true' : 'false',
      participationCode: participationCode || '',
      description: introductionText || '',
      useCurrentProfileImage: agreements,
      clubStudyCount: studyCycleNum,
      comprehensiveEvaluationPermissions: [],
      comprehensiveEvaluationViewPermissions: [],
      comprehensiveEvaluationMinimumCount: 0,
    };

    console.log(clubFormParams);
    const formData = new FormData();

    formData.append('clubId', 'lecture_club_' + generateUUID());
    formData.append('clubName', clubFormParams.clubName);
    formData.append('jobGroups', clubFormParams.jobGroups.toString());
    formData.append('jobs', clubFormParams.jobs.toString());
    formData.append('jobLevels', clubFormParams.jobLevels.toString());
    formData.append('startAt', clubFormParams.startAt);
    formData.append('endAt', clubFormParams.endAt);
    formData.append('clubStudyCount', clubFormParams.clubStudyCount);
    formData.append('studySubject', clubFormParams.studySubject);
    formData.append('studyKeywords', clubFormParams.studyKeywords.toString());
    formData.append('isPublic', clubFormParams.isPublic);
    formData.append('participationCode', clubFormParams.participationCode);
    formData.append('description', clubFormParams.description);
    formData.append('useCurrentProfileImage', clubFormParams.useCurrentProfileImage);

    for (let i = 0; i < aiSummarySettings?.comprehensiveEvaluationPermissions?.length; i++) {
      formData.append(
        'comprehensiveEvaluationPermissions[' + i + ']',
        aiSummarySettings.comprehensiveEvaluationPermissions[i],
      );
    }
    for (let i = 0; i < aiSummarySettings?.comprehensiveEvaluationViewPermissions?.length; i++) {
      formData.append(
        'comprehensiveEvaluationViewPermissions[' + i + ']',
        aiSummarySettings?.comprehensiveEvaluationViewPermissions[i],
      );
    }
    formData.append('comprehensiveEvaluationMinimumCount', aiSummarySettings?.minimumCompletionCount);

    if (selectedImage) {
      console.log('selectedImage', selectedImage);
      formData.append('clubImageFile', selectedImageCheck);
    }
    if (selectedImageBanner) {
      formData.append('backgroundImageFile', selectedImageBannerCheck);
    }
    if (selectedImageProfile) {
      formData.append('instructorProfileImageFile', selectedImageProfileCheck);
    }

    console.log(clubFormParams);
    console.log('scheduleData', scheduleData);

    // To log the formData contents
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    onLectureModify({ formData, id: selectedClub?.clubSequence });
  };

  const handleComprehensiveEvaluationPermissionChange = (code: string, isChecked: boolean) => {
    setAiSummarySettings(prev => {
      const currentPermissions = prev.comprehensiveEvaluationPermissions || [];

      let newPermissions;
      if (isChecked) {
        // 체크된 경우: 배열에 코드 추가 (중복 방지)
        if (!currentPermissions.includes(code)) {
          return {
            ...prev,
            comprehensiveEvaluationPermissions: [...currentPermissions, code],
          };
        }
      } else {
        // 체크 해제된 경우: 배열에서 코드 제거
        return {
          ...prev,
          comprehensiveEvaluationPermissions: currentPermissions.filter(permission => permission !== code),
        };
      }

      return prev;
    });
  };

  const handleComprehensiveEvaluationViewPermissionChange = (code: string, isChecked: boolean) => {
    setAiSummarySettings(prev => {
      const currentPermissions = prev.comprehensiveEvaluationViewPermissions || [];

      if (isChecked) {
        // 체크된 경우: 배열에 코드 추가 (중복 방지)
        if (!currentPermissions.includes(code)) {
          return {
            ...prev,
            comprehensiveEvaluationViewPermissions: [...currentPermissions, code],
          };
        }
      } else {
        // 체크 해제된 경우: 배열에서 코드 제거
        return {
          ...prev,
          comprehensiveEvaluationViewPermissions: currentPermissions.filter(permission => permission !== code),
        };
      }

      return prev;
    });
  };

  // AI 학습총평 설정 변경 핸들러
  const handleAiSummarySettingChange = (setting: string, value: boolean | string) => {
    setAiSummarySettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleIsPublic = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    if (newFormats !== null) {
      setIsPublic(newFormats);
      if (newFormats === '0002') {
        setIsPublic('0002');
      } else {
        setIsPublic('0001');
        setParticipationCode('');
      }
    }
  };

  const handleIsQuestionsPublic = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    if (newFormats !== null) {
      setIsQuestionsPublic(newFormats);
    }
  };
  const handleEnableAiQuestion = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    if (newFormats !== null) {
      setEnableAiQuestion(newFormats);
    }
  };
  const handleIncludeReferenceToAnswer = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    if (newFormats !== null) {
      setIncludeReferenceToAnswer(newFormats);
    }
  };

  const onMessageChange1 = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setIntroductionText(value);
  };

  const handleChanges = (event: SelectChangeEvent<typeof personName>) => {
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

  const handleUniversityChange = e => {
    console.log('handleUniversityChange', e.target.value);
    const selectedCode = e.target.value;
    const selected = optionsData?.data?.jobs?.find(u => u.code === selectedCode);
    setUniversityCode(selectedCode);
    setSelectedUniversity(selectedCode);
    setSelectedUniversityName(selected ? selected.name : '');
    setJobs(selected ? selected.jobs : []);
    setSelectedJob([]); // Clear the selected job when university changes
    setPersonName([]); // Clear the selected job when university changes
  };

  const handleInputStudySubjectChange = event => {
    setStudySubject(event.target.value);
  };

  const handleUrlChange = (order: any, updated: any) => {
    console.log('scheduleUrlAdd', order, updated);

    setScheduleData(
      scheduleData.map(item => {
        // Update the urlList of the item with matching order
        if (item.studyOrder === order) {
          return { ...item, clubStudyUrl: updated };
        }
        return item;
      }),
    );
  };

  const scheduleFileAdd = (order: any, updated: any) => {
    console.log('scheduleFileAdd', order, updated);

    setScheduleData(
      scheduleData.map(item => {
        // Update the urlList of the item with matching order
        if (item.studyOrder === order) {
          // File 객체를 래핑하는 객체 생성 (File 객체는 수정하지 않음)
          const newFiles = updated.map(file => ({
            file: file, // 원본 File 객체 보존
            name: file.name,
            size: file.size,
            type: file.type,
            externalSharingLink: '',
          }));
          return { ...item, files: [...(item.files || []), ...newFiles] };
        }
        return item;
      }),
    );
  };

  // Function to handle removing a URL from the list
  const handleRemoveFile = (order, fileIndex) => {
    console.log('handleRemoveFile', order, fileIndex);
    setScheduleData(prevData =>
      prevData.map(item => {
        if (item.studyOrder === order) {
          // Return the item with the URL at urlIndex removed from urlList
          return {
            ...item,
            files: item.files.filter((_, index) => index !== fileIndex),
          };
        }
        return item;
      }),
    );
  };

  const handleStartDayChange = (order, startDay) => {
    console.log('handleRemoveFile', order, startDay);
    setScheduleData(prevData =>
      prevData.map(item => {
        if (item.studyOrder === order) {
          // Return the item with the URL at urlIndex removed from urlList
          return {
            ...item,
            startDate: startDay,
          };
        }
        return item;
      }),
    );
  };

  const handleEndDayChange = (order, endDay) => {
    console.log('handleRemoveFile', order, endDay);
    setScheduleData(prevData =>
      prevData.map(item => {
        if (item.studyOrder === order) {
          // Return the item with the URL at urlIndex removed from urlList
          return {
            ...item,
            endDate: endDay,
          };
        }
        return item;
      }),
    );
  };

  // Function to handle deleting data based on order
  const handleCheckboxDelete = orderToDelete => {
    console.log('delete', orderToDelete);
    // Filter out the item with the given order
    const updatedData = scheduleData.filter(item => item.studyOrder !== orderToDelete);

    // Step 1: Sort the array based on the current order value
    const sortedData = updatedData.sort((a, b) => a.studyOrder - b.studyOrder);

    // Step 2: Assign new order values sequentially
    sortedData.forEach((item, index) => {
      item.studyOrder = index;
    });

    // Update state with the filtered data
    setScheduleData(sortedData);
  };

  // Function to handle removing a URL from the list
  const handleRemoveInput = (order, urlIndex) => {
    console.log('handleRemoveInput', order, urlIndex);
    setScheduleData(prevData =>
      prevData.map(item => {
        if (item.studyOrder === order) {
          // Return the item with the URL at urlIndex removed from urlList
          return {
            ...item,
            urls: item.urls.filter((_, index) => index !== urlIndex),
          };
        }
        return item;
      }),
    );
  };

  const handleTypeChange = (order, type) => {
    console.log('handleTypeChange', order, type);
    setScheduleData(prevData =>
      prevData.map(item => {
        if (item.studyOrder === order) {
          // Return the item with the URL at urlIndex removed from urlList
          return {
            ...item,
            clubStudyType: type,
          };
        }
        return item;
      }),
    );
  };

  const lectureNameChange = (order: any, updated: any) => {
    console.log('scheduleUrlAdd', order, updated);

    setScheduleData(
      scheduleData.map(item => {
        // Update the urlList of the item with matching order
        if (item.studyOrder === order) {
          return { ...item, clubStudyName: updated };
        }
        return item;
      }),
    );
  };

  const lectureNameUrl2 = (order: any, updated: any, flag: boolean, indexs: number) => {
    console.log('scheduleUrlAdd', order, updated, indexs);

    if (flag) {
      setLectureContents(prevContents => ({
        ...prevContents,
        files: (prevContents.files || []).map(
          file =>
            file.serialNumber === indexs
              ? { ...file, externalSharingLink: updated } // serialNumber가 일치하면 업데이트
              : file, // 나머지 파일은 그대로 유지
        ),
      }));
    } else {
      setLectureContents(prevContents => ({
        ...prevContents,
        files: (prevContents.files || []).map(
          (file, index) =>
            index === indexs
              ? { ...file, externalSharingLink: updated } // serialNumber가 일치하면 업데이트
              : file, // 나머지 파일은 그대로 유지
        ),
      }));
    }
  };

  const lectureNameUrl = (order: any, updated: any, flag: boolean, indexs: number) => {
    console.log('scheduleUrlAdd', order, updated, indexs);

    if (flag) {
      setScheduleData(
        scheduleData.map(item => {
          if (item.studyOrder === order) {
            return {
              ...item,
              files: item.files
                ? item.files.map(
                    file =>
                      file.serialNumber === indexs
                        ? { ...file, externalSharingLink: updated } // 해당 파일만 업데이트
                        : file, // 다른 파일은 그대로 유지
                  )
                : [], // files 배열이 없는 경우 빈 배열 유지
            };
          }
          return item;
        }),
      );
    } else {
      setScheduleData(
        scheduleData.map(item => {
          console.log('item', item);
          if (item.studyOrder === order) {
            return {
              ...item,
              files: item.files.map((file, index) => {
                console.log(index, index);
                if (indexs === index) {
                  return {
                    ...file,
                    externalSharingLink: updated, // 해당 파일의 externalSharingLink 업데이트
                  };
                }
                return file; // 다른 파일은 그대로 유지
              }),
            };
          }
          return item; // 다른 studyOrder는 그대로 유지
        }),
      );
    }
  };

  const scheduleUrlAdd = (order: any, updated: any) => {
    console.log('scheduleUrlAdd', order, updated);

    setScheduleData(
      scheduleData.map(item => {
        // Update the urlList of the item with matching order
        if (item.studyOrder === order) {
          return {
            ...item,
            urls: [
              ...(item.urls || []),
              {
                isNew: 'true',
                url: updated,
              },
            ],
          };
        }
        return item;
      }),
    );
  };

  //
  const dragList = (item: any, index: any) => (
    <div key={item.order} className="simple-drag-row">
      <LectureBreakerInfo
        isProcessing={isProcessing}
        handleStartDayChange={handleStartDayChange}
        handleEndDayChange={handleEndDayChange}
        handleUrlChange={handleUrlChange}
        handleTypeChange={handleTypeChange}
        lectureNameChange={lectureNameChange}
        lectureNameUrl={lectureNameUrl}
        handleRemoveInput={handleRemoveInput}
        scheduleUrlAdd={scheduleUrlAdd}
        scheduleFileAdd={scheduleFileAdd}
        handleRemoveFile={handleRemoveFile}
        onFileDownload={onFileDownload}
        // avatarSrc={item.leaderProfileImageUrl}
        item={item}
        urlList={item.urls}
        fileList={item.files}
        userName={item.clubStudyName}
        questionText={item.question}
        order={item.studyOrder !== undefined ? item.studyOrder : null}
        answerText={item.modelAnswer}
        handleCheckboxDelete={handleCheckboxDelete}
        handleAddClick={handleAddClick}
        publishDate={item.publishDate}
        dayOfWeek={item.dayOfWeek}
        isPublished={item.isPublished}
      />
    </div>
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleAddClick = () => {
    const newOrder = scheduleData.length + 1; // Determine the new order based on the current length of scheduleData
    const newData = {
      studyOrder: newOrder,
      clubStudyName: '',
      clubStudyType: '0100',
      clubStudyUrl: '',
      urls: [],
      files: [],
      startDate: '',
      endDate: '',
    };

    // Update scheduleData with the new data
    setScheduleData([...scheduleData, newData]);
  };

  function handleDeleteMember(memberUUID: any): void {
    const isConfirmed = window.confirm('클럽 회원을 강퇴 하시겠습니까?');
    if (isConfirmed) {
      console.log(memberUUID);
      let params = {
        club: selectedClub?.clubSequence,
        memberUUID: memberUUID,
      };
      onCrewBan(params);
      // 회원 강퇴 로직 추가
    } else {
      // no를 선택한 경우 아무것도 하지 않음
    }
  }

  function handleInstructorDelete(memberUUID: any): void {
    let params = {
      club: selectedClub?.clubSequence,
      memberUUID: memberUUID,
    };
    onInstructorsDelete(params);
    // 회원 강퇴 로직 추가
  }

  function handleJoinMember(memberUUID: any): void {
    const isConfirmed = window.confirm('클럽 회원을 가입하시겠습니까?');
    if (isConfirmed) {
      console.log(memberUUID);
      let params = {
        club: selectedClub?.clubSequence,
        memberUUID: memberUUID,
      };
      onCrewAccept(params);
      // 회원 강퇴 로직 추가
    } else {
      // no를 선택한 경우 아무것도 하지 않음
    }
  }

  function handleRejectMember(memberUUID: any): void {
    const isConfirmed = window.confirm('클럽 회원을 거절하시겠습니까?');
    if (isConfirmed) {
      console.log(memberUUID);
      let params = {
        club: selectedClub?.clubSequence,
        memberUUID: memberUUID,
      };
      onCrewReject(params);
      // 회원 강퇴 로직 추가
    } else {
      // no를 선택한 경우 아무것도 하지 않음
    }
  }

  const handleUpdate = (evt: any, updated: any) => {
    // 인덱스로 일정 항목을 보유할 맵
    const scheduleMap = updated.reduce((acc, item, index) => {
      acc[index] = item;
      return acc;
    }, {});

    // 관련 필드만 추출하고 'order'로 정렬
    const sortedReducedData = updated
      .map(({ order, dayOfWeek, weekNumber, publishDate }) => ({
        order,
        dayOfWeek,
        weekNumber,
        publishDate,
      }))
      .sort((a, b) => a.order - b.order);

    // 정렬된 데이터와 원본 항목의 추가 속성을 병합
    console.log(scheduleMap);
    const mergeData = sortedReducedData.map((item, index) => ({
      ...item,
      quizSequence: scheduleMap[index].quizSequence,
      question: scheduleMap[index].question,
      maker: scheduleMap[index].maker,
      contentUrl: scheduleMap[index].contentUrl,
      contentTitle: scheduleMap[index].contentTitle,
      modelAnswer: scheduleMap[index].modelAnswer,
      quizUri: scheduleMap[index].quizUri,
    }));

    // 상태 업데이트
    setQuizList(mergeData);
  };

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  const [jobGroups, setJobGroups] = useState<any[]>([]);
  const [contentTypes, setContentTypes] = useState<any[]>([]);
  const [jobs, setJobs] = useState([]);

  // 프로필 정보 수정 시 변경 적용
  useEffect(() => {
    if (memberUUID) {
      console.log('memberUUID', memberUUID);
      refetchProfile();
      QuizRefetchBadge();
    }
  }, [memberUUID]);

  const handleClickProfile = memberUUID => {
    setIsModalProfileOpen(true);
    console.log('memberUUID1', memberUUID);
    setMemberUUID(memberUUID);
    setBadgeParams({ page: badgePage, memberUUID: memberUUID });
  };

  const [selectedUUIDs, setSelectedUUIDs] = useState<string[]>([]);

  // 체크박스 클릭 핸들러
  const handleCheckboxRequestChange = (uuid, isChecked) => {
    if (isChecked) {
      // 체크되었을 경우 UUID 추가
      setSelectedUUIDs([...selectedUUIDs, uuid]);
    } else {
      // 체크 해제되었을 경우 UUID 제거
      setSelectedUUIDs(selectedUUIDs.filter(id => id !== uuid));
    }
  };

  const useStyles = makeStyles(theme => ({
    selected: {
      '&&': {
        backgroundColor: '#000',
        color: 'white',
      },
    },
  }));

  const handleBatchAcceptMember = () => {
    if (!myMemberRequestList || myMemberRequestList.length === 0) {
      alert('클럽 가입 신청이 없습니다.');
      return;
    }

    const isConfirmed = window.confirm('클럽 회원을 일괄 가입하시겠습니까?');
    if (isConfirmed) {
      let params = {
        club: selectedClub?.clubSequence,
      };
      onCrewAcceptAll(params);
    }
  };

  const classes = useStyles();

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <>
          <Desktop>
            {/* <Divider className="tw-y-5 tw-bg-['#efefef']" /> */}
            <div className={subtitle ? 'tw-pt-8' : ''}>
              {subtitle && (
                <div className="tw-flex tw-justify-start tw-items-start tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
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
                    강의클럽 대시보드
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
                    강의클럽 관리하기
                  </p>
                </div>
              )}
              <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-[31.5px] tw-gap-3.5">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
                  {title}
                </p>
              </div>
              <Divider className="tw-py-2 tw-bg-['#efefef']" />
            </div>
          </Desktop>
          <Mobile>
            <div className="tw-pt-[60px]">
              <div className="tw-text-[24px] tw-font-bold tw-text-black tw-text-center">
                퀴즈클럽 {'-'} 내가 만든 클럽
              </div>
              <div className="tw-text-[12px] tw-text-black tw-text-center tw-mb-10">
                내가 만든 클럽 페이지에 관한 간단한 설명란
              </div>
            </div>
          </Mobile>
        </>
        <div className="tw-flex tw-items-center tw-mt-6">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={subtitle ? 11.1 : 12} className="tw-font-bold tw-text-xl">
              <select
                className="tw-h-14 form-select block w-full tw-bg-gray-100 tw-font-bold tw-px-8"
                onChange={handleQuizChange}
                value={selectedValue}
                aria-label="Default select example"
              >
                {isContentFetched &&
                  myClubList?.map((session, idx) => {
                    return (
                      <option
                        key={idx}
                        className="tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer"
                        value={session?.clubSequence}
                      >
                        강의명 : {session?.clubName}
                      </option>
                    );
                  })}
              </select>
            </Grid>

            {subtitle && (
              <Grid item xs={0.9} justifyContent="flex-end" className="tw-flex">
                {/* {contents?.isBeforeOpening ? ( */}
                <div className="">
                  <button
                    type="button"
                    // onClick={() => router.push(`/manage-quiz-club/${id}`)}
                    onClick={() => router.push('/lecture-dashboard/' + selectedValue)}
                    className="tw-h-14  tw-text-black tw-bg-[#CED4DE] border tw-font-medium tw-rounded-md tw-text-sm tw-px-6 tw-py-2 "
                  >
                    <SettingsIcon className="tw-bg-[#CED4DE] tw-text-white" />
                  </button>
                </div>
              </Grid>
            )}
          </Grid>
        </div>

        <div className=" tw-h-12 border-left tw-relative tw-flex tw-items-center tw-mt-14 border-bottom">
          {/* Tab 1: My Quiz */}
          <div
            className={`tw-w-[164px] tw-h-12 tw-relative tw-cursor-pointer ${
              activeTab === 'myQuiz' ? 'border-b-0' : ''
            }`}
            onClick={() => handleTabClick('myQuiz')}
          >
            <div
              className={`tw-w-[164px] border-left tw-h-12 tw-absolute tw-left-[-1px] tw-top-[-1px] tw-rounded-tl-lg tw-rounded-tr-lg ${
                activeTab === 'myQuiz' ? 'tw-bg-white' : 'tw-bg-[#f6f7fb]'
              } border-top border-right`}
            />
            <p
              className={`tw-absolute tw-top-3 tw-left-0 tw-right-0 tw-text-base tw-text-center ${
                activeTab === 'myQuiz' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              학생목록
            </p>
          </div>
          <div
            className={`tw-w-[164px] tw-h-12 tw-relative  tw-ml-2.5 tw-cursor-pointer ${
              activeTab === 'member' ? 'border-b-0' : ''
            }`}
            onClick={() => handleTabClick('member')}
          >
            <div
              className={`tw-w-[164px] border-left tw-h-12 tw-absolute tw-left-[-1px] tw-top-[-1px] tw-rounded-tl-lg tw-rounded-tr-lg ${
                activeTab === 'member' ? 'tw-bg-white' : 'tw-bg-[#f6f7fb]'
              } border-top border-right`}
            />
            <p
              className={`tw-absolute tw-top-3 tw-left-0 tw-right-0 tw-text-base tw-text-center ${
                activeTab === 'member' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              교수자관리
            </p>
          </div>
          {/* Divider Line */}
          {/* Tab 2: Community */}
          <div
            className={`tw-w-[164px] tw-h-12 tw-relative tw-ml-2.5 tw-cursor-pointer ${
              activeTab === 'community' ? 'border-b-0' : ''
            }`}
            onClick={() => handleTabClick('community')}
          >
            <div
              className={`tw-w-[164px] tw-h-12 tw-absolute tw-left-[-1px] tw-top-[-1px] tw-rounded-tl-lg tw-rounded-tr-lg ${
                activeTab === 'community' ? 'tw-bg-white' : 'tw-bg-[#f6f7fb]'
              } border-right border-top border-left`}
            />
            <p
              className={`tw-absolute tw-top-3 tw-left-0 tw-right-0 tw-text-base tw-text-center ${
                activeTab === 'community' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              강의정보관리
            </p>
          </div>
          <div
            className={`tw-w-[164px] tw-h-12 tw-relative tw-ml-2.5 tw-cursor-pointer ${
              activeTab === 'lecture' ? 'border-b-0' : ''
            }`}
            onClick={() => handleTabClick('lecture')}
          >
            <div
              className={`tw-w-[164px] tw-h-12 tw-absolute tw-left-[-1px] tw-top-[-1px] tw-rounded-tl-lg tw-rounded-tr-lg ${
                activeTab === 'lecture' ? 'tw-bg-white' : 'tw-bg-[#f6f7fb]'
              } border-right border-top border-left`}
            />
            <p
              className={`tw-absolute tw-top-3 tw-left-0 tw-right-0 tw-text-base tw-text-center ${
                activeTab === 'lecture' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              커리큘럼관리
            </p>
          </div>
          <div
            className={`tw-w-[164px] tw-h-12 tw-relative tw-ml-2.5 tw-cursor-pointer ${
              activeTab === 'ai' ? 'border-b-0' : ''
            }`}
            onClick={() => handleTabClick('ai')}
          >
            <div
              className={`tw-w-[164px] tw-h-12 tw-absolute tw-left-[-1px] tw-top-[-1px] tw-rounded-tl-lg tw-rounded-tr-lg ${
                activeTab === 'ai' ? 'tw-bg-white' : 'tw-bg-[#f6f7fb]'
              } border-right border-top border-left`}
            />
            <p
              className={`tw-absolute tw-top-3 tw-left-0 tw-right-0 tw-text-base tw-text-center ${
                activeTab === 'ai' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              AI조교관리
            </p>
          </div>
        </div>
        {/* Content Section */}
        {activeTab === 'myQuiz' && (
          <div>
            <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg">
              <div className={cx('content-wrap')}>
                <div className={cx('container', 'tw-mt-10')}>
                  <Grid container direction="row" alignItems="center" rowSpacing={0}>
                    <Grid
                      item
                      container
                      justifyContent="flex-start"
                      xs={6}
                      sm={10}
                      className="tw-text-xl tw-text-black tw-font-bold tw-flex tw-justify-between tw-items-center tw-gap-5"
                    >
                      <div>강의클럽 가입 신청 ({totalElements || 0})</div>
                      <button
                        onClick={() => handleBatchAcceptMember()}
                        type="button"
                        className="tw-text-sm tw-font-medium border tw-py-2 tw-px-5 tw-rounded-md tw-text-black tw-rounded"
                      >
                        일괄 승인
                      </button>
                    </Grid>

                    <Grid item container justifyContent="flex-end" xs={6} sm={2} style={{ textAlign: 'right' }}>
                      <Pagination
                        count={totalPage}
                        size="small"
                        siblingCount={0}
                        page={page}
                        renderItem={item => (
                          <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                        )}
                        onChange={handlePageChange}
                      />
                    </Grid>
                  </Grid>
                  <Divider className="tw-py-3 tw-mb-3" />

                  {myMemberRequestList.length === 0 && (
                    <div className=" tw-mt-10 tw-text-center tw-text-black  tw-py-20 border tw-text-base tw-rounded tw-bg-white">
                      클럽 가입 신청이 없습니다.
                    </div>
                  )}

                  {myMemberRequestList?.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Grid
                          item
                          className="tw-py-2 border-bottom tw-text-base"
                          key={index}
                          container
                          direction="row"
                          justifyContent="left"
                          alignItems="center"
                          rowSpacing={3}
                        >
                          <Grid item xs={12} sm={1}>
                            <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                              <img
                                alt="profile"
                                className="tw-w-10 tw-h-10 border tw-rounded-full"
                                src={
                                  item?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'
                                }
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <div className="tw-text-left tw-text-black tw-line-clamp-1">{item?.member?.nickname}</div>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <div className="tw-text-left tw-text-black">{item?.memberId}</div>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <div className="tw-text-left tw-text-black">{item?.jobGroup?.name}</div>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <div className="tw-text-left tw-text-black">{item?.job?.name}</div>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={3}
                            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}
                          >
                            <div className="tw-gap-3">
                              <button
                                onClick={() => handleJoinMember(item?.member?.memberUUID)}
                                type="button"
                                data-tooltip-target="tooltip-default"
                                className="tw-py-2 tw-px-5 tw-mr-3 tw-bg-red-600 tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                              >
                                승인
                              </button>
                              <button
                                onClick={() => handleRejectMember(item?.member?.memberUUID)}
                                type="button"
                                data-tooltip-target="tooltip-default"
                                className="tw-py-2 tw-px-5 tw-bg-black border tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                              >
                                거절
                              </button>
                            </div>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </div>
                <div className={cx('container', 'tw-mt-10')}>
                  <Grid container direction="row" alignItems="center" rowSpacing={0}>
                    <Grid
                      item
                      container
                      justifyContent="flex-start"
                      xs={6}
                      sm={6}
                      className="tw-text-xl tw-text-black tw-font-bold"
                    >
                      강의클럽 학생 목록 ({totalElementsMember || 0})
                    </Grid>

                    <Grid item container justifyContent="flex-end" xs={6} sm={6} style={{ textAlign: 'right' }}>
                      <Pagination
                        count={totalPageMember}
                        size="small"
                        siblingCount={0}
                        page={pageMember}
                        renderItem={item => (
                          <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                        )}
                        onChange={handlePageChangeMember}
                      />
                    </Grid>
                  </Grid>

                  <Divider className="tw-py-3 tw-mb-3" />
                  <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6 tw-my-5">
                    <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                        정렬 :
                      </p>

                      <RadioGroup value={sortType} onChange={handleChangeQuiz} row>
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
                              가나다순
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
                              학번순
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
                              가입최신순
                            </p>
                          }
                        />
                        <FormControlLabel
                          value="0004"
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
                              가입오래된순
                            </p>
                          }
                        />
                      </RadioGroup>
                    </div>
                  </div>

                  {myMemberList.length === 0 && (
                    <div className="tw-h-[500px]">
                      <div className=" tw-mt-10 tw-text-center tw-text-black  tw-py-20 border tw-text-base tw-rounded tw-bg-white">
                        클럽 학생이 없습니다.
                      </div>
                    </div>
                  )}
                  <div className="tw-h-[800px]">
                    {myMemberList.map((item, index) => {
                      return (
                        <div key={index} className="">
                          <Grid
                            className="tw-py-2 border-bottom tw-text-base"
                            key={index}
                            container
                            direction="row"
                            justifyContent="left"
                            alignItems="center"
                            rowSpacing={3}
                          >
                            <Grid item xs={12} sm={1}>
                              <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                                <img
                                  className="tw-w-10 tw-h-10 border tw-rounded-full"
                                  src={
                                    item?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'
                                  }
                                />
                              </div>
                            </Grid>
                            <Grid item xs={12} sm={1}>
                              <div className="tw-text-left tw-text-black">{item?.member?.nickname}</div>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <div className="tw-text-left tw-text-black">{item?.memberId}</div>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <div className="tw-text-left tw-text-black">{item?.jobGroup?.name}</div>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <div className="tw-text-left tw-text-black">{item?.job?.name}</div>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={3}
                              style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}
                            >
                              <div className="tw-gap-3">
                                <button
                                  onClick={() => handleClickProfile(item?.member?.memberUUID)}
                                  type="button"
                                  data-tooltip-target="tooltip-default"
                                  className="tw-py-2 tw-mr-3 tw-bg-black tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                >
                                  프로필 보기
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(item?.member?.memberUUID)}
                                  type="button"
                                  data-tooltip-target="tooltip-default"
                                  className="tw-py-2 tw-bg-white border tw-text-black max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                                >
                                  강퇴
                                </button>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'member' && (
          <div>
            <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg">
              <div className={cx('content-wrap', 'tw-h-[100vh]')}>
                <div className={cx('container', 'tw-mt-10')}>
                  <Grid container direction="row" alignItems="center" rowSpacing={0}>
                    <Grid
                      item
                      container
                      justifyContent="flex-start"
                      xs={6}
                      sm={10}
                      className="tw-text-xl tw-text-black tw-font-bold"
                    >
                      클럽 교수자 목록 ({totalElementsProfessor || 0})
                    </Grid>

                    <Grid item container justifyContent="flex-end" xs={6} sm={2} style={{ textAlign: 'right' }}>
                      <Pagination
                        count={totalPage}
                        size="small"
                        siblingCount={0}
                        page={page}
                        renderItem={item => (
                          <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                        )}
                        onChange={handlePageChange}
                      />
                    </Grid>
                  </Grid>
                  <Divider className="tw-py-3 tw-mb-3" />

                  <div className="tw-flex tw-justify-between tw-items-center tw-h-12 tw-gap-6 tw-mb-8 tw-mt-5">
                    <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                        정렬 :
                      </p>

                      <RadioGroup value={professorRequestSortType} onChange={handleChangeProfessorRequest} row>
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
                              가나다순
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
                              가입최신순
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
                              가입오래된순
                            </p>
                          }
                        />
                      </RadioGroup>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setSelectedUUIDs([]);
                          setIsModalOpen(true);
                          setKeyWorld('');
                        }}
                        type="button"
                        data-tooltip-target="tooltip-default"
                        className="tw-py-3 tw-px-8 tw-bg-white border tw-text-gray-500 max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                      >
                        교수자 추가
                      </button>
                    </div>
                  </div>

                  {requestProfessorList.length === 0 && (
                    <div className=" tw-mt-10 tw-text-center tw-text-black  tw-py-20 border tw-text-base tw-rounded tw-bg-white">
                      클럽 가입 신청이 없습니다.
                    </div>
                  )}

                  {requestProfessorList?.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Grid
                          item
                          className="tw-py-2 border-bottom tw-text-base"
                          key={index}
                          container
                          direction="row"
                          justifyContent="left"
                          alignItems="center"
                          rowSpacing={3}
                        >
                          <Grid item xs={12} sm={1}>
                            <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                              <img
                                alt="profile"
                                className="tw-w-10 tw-h-10 border tw-rounded-full"
                                src={
                                  item?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'
                                }
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <div className="tw-text-left tw-text-black">{item?.member?.nickname}</div>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <div className="tw-text-left tw-text-black">{item?.memberId}</div>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <div className="tw-text-left tw-text-black">{item?.jobGroup?.name}</div>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <div className="tw-text-left tw-text-black">{item?.job?.name}</div>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={3}
                            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}
                          >
                            <div className="tw-gap-3">
                              <button
                                onClick={() => handleClickProfile(item?.member?.memberUUID)}
                                type="button"
                                data-tooltip-target="tooltip-default"
                                className="tw-py-2 tw-mr-3 tw-bg-black tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                              >
                                프로필 보기
                              </button>
                              <button
                                onClick={() => handleInstructorDelete(item?.member?.memberUUID)}
                                type="button"
                                data-tooltip-target="tooltip-default"
                                className="tw-py-2 tw-px-5 tw-mr-3 tw-bg-white border tw-text-gray-500 max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                              >
                                권한삭제
                              </button>
                              <button
                                onClick={() => handleDeleteMember(item?.member?.memberUUID)}
                                type="button"
                                data-tooltip-target="tooltip-default"
                                className="tw-py-2 tw-px-5 tw-bg-white border max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                              >
                                강퇴
                              </button>
                            </div>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'community' && (
          <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg">
            {/* 강의 기본정보 */}
            <div className={cx('content-wrap')}>
              <div className={cx('container')}>
                <div className="tw-flex tw-justify-between tw-items-center tw-relative tw-gap-3">
                  <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">1. 강의 기본정보</div>
                  <button
                    disabled={isProcessing}
                    className="tw-w-[150px] border tw-text-gray-500 tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-text-sm tw-rounded"
                    onClick={() => handleClubSave()}
                  >
                    {isProcessing ? <CircularProgress color="info" size={18} /> : '수정하기'}
                  </button>
                </div>
                <div className={cx('content-area')}>
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-2">
                    강의명 <span className="tw-text-red-500">*</span>
                  </div>
                  <TextField
                    size="small"
                    fullWidth
                    onChange={e => setClubName(e.target.value)}
                    id="margin-none"
                    value={clubName}
                    name="clubName"
                  />

                  <div>
                    <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-content-start">
                      <div>
                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                          추천 {groupLabel} <span className="tw-text-red-500">*</span>
                        </div>
                        <select
                          className="form-select"
                          onChange={handleUniversityChange}
                          aria-label="Default select example"
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

                      <div>
                        <div>
                          <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                            추천 {subGroupLabel}(다중 선택 가능) <span className="tw-text-red-500">*</span>
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
                                      추천 {groupLabel}을 먼저 선택하고, {subGroupLabel}를 선택해주세요.
                                    </span>
                                  );
                                }
                                return selected.join(', ');
                              }}
                              // disabled={jobs.length === 0}
                              value={personName}
                              onChange={handleChanges}
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
                        </div>
                      </div>
                    </div>

                    <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-content-start">
                      <div>
                        <div className="tw-mb-[12px] tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                          강의 시작일 <span className="tw-text-red-500">*</span>
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="YYYY-MM-DD"
                            slotProps={{
                              textField: { size: 'small', style: { backgroundColor: 'white', width: '100%' } },
                            }}
                            value={startDay}
                            onChange={e => onChangeHandleFromToStartDate(e)}
                          />
                        </LocalizationProvider>
                      </div>
                      <div>
                        <div className="tw-mb-[12px] tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                          강의 종료일 <span className="tw-text-red-500">*</span>
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="YYYY-MM-DD"
                            slotProps={{
                              textField: { size: 'small', style: { backgroundColor: 'white', width: '100%' } },
                            }}
                            value={endDay}
                            onChange={e => onChangeHandleFromToEndDate(e)}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>

                    <div className="tw-mb-10 tw-content-start">
                      <div>
                        <div className="tw-mb-[12px] tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                          강의 회차 설정 <span className="tw-text-red-500">*</span>
                        </div>

                        <div className="tw-flex tw-items-center tw-gap-2 tw-mt-1">
                          <TextField
                            disabled={true}
                            size="small"
                            type="number"
                            onChange={handleStudyCycleNum}
                            id="margin-none"
                            value={studyCycleNum}
                            inputProps={{
                              min: 1,
                              max: 100,
                            }}
                            name="studyCycleNum"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="tw-mb-[12px] tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                      추천 학년 <span className="tw-text-red-500">*</span>
                    </div>

                    {optionsData?.data?.jobLevels?.map((item, i) => (
                      <Toggle
                        key={item.code}
                        label={item.name}
                        name={item.name}
                        value={item.code}
                        variant="small"
                        checked={recommendLevels.indexOf(item.code) >= 0}
                        isActive
                        type="tabButton"
                        onChange={() => {
                          const index = recommendLevels.indexOf(item.code);
                          setRecommendLevels(prevState => newCheckItem(item.code, index, prevState));
                          if (index >= 0) {
                            // Remove the name if the code is already in the array
                            setLevelNames(prevNames => prevNames.filter(name => name !== item.name));
                          } else {
                            // Add the name if the code is not in the array
                            setLevelNames(prevNames => [...(prevNames ? prevNames : []), item.name]);
                          }
                        }}
                        className={cx('tw-mr-2 !tw-w-[85px] !tw-h-[37px]')}
                      />
                    ))}

                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-2">학습 주제</div>
                    <TextField
                      size="small"
                      fullWidth
                      onChange={handleInputStudySubjectChange}
                      id="margin-none"
                      value={studySubject}
                      name="studySubject"
                    />

                    <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-content-start">
                      <div>
                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2 tw-mb-3">
                          학습 키워드
                        </div>
                        <Tag value={studyKeywords} onChange={setStudyKeywords} placeHolder="학습 키워드 입력 후 엔터" />
                      </div>

                      <div>
                        <div>
                          <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                            공개/비공개 설정
                          </div>
                          <div className="tw-flex tw-items-center tw-gap-2 tw-mt-1">
                            <ToggleButtonGroup value={isPublic} onChange={handleIsPublic} exclusive aria-label="">
                              <ToggleButton
                                classes={{ selected: classes.selected }}
                                value="0001"
                                className="tw-ring-1 tw-ring-slate-900/10"
                                style={{
                                  width: 70,
                                  borderRadius: '5px',
                                  borderLeft: '0px',
                                  margin: '5px',
                                  height: '35px',
                                  border: '0px',
                                }}
                                sx={{
                                  '&.Mui-selected': {
                                    backgroundColor: '#000',
                                    color: '#fff',
                                  },
                                }}
                              >
                                공개
                              </ToggleButton>
                              <ToggleButton
                                classes={{ selected: classes.selected }}
                                value="0002"
                                className="tw-ring-1 tw-ring-slate-900/10"
                                style={{
                                  width: 70,
                                  borderRadius: '5px',
                                  borderLeft: '0px',
                                  margin: '5px',
                                  height: '35px',
                                  border: '0px',
                                }}
                                sx={{
                                  '&.Mui-selected': {
                                    backgroundColor: '#000',
                                    color: '#fff',
                                  },
                                }}
                              >
                                비공개
                              </ToggleButton>
                            </ToggleButtonGroup>
                            <TextField
                              fullWidth
                              className="tw-pl-1"
                              size="small"
                              value={participationCode}
                              onChange={e => setParticipationCode(e.target.value)}
                              disabled={isPublic === '0001'}
                              placeholder="입장코드를 설정해주세요."
                              id="margin-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">2. 강의 상세정보 입력</div>
                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">
                      간략한 강의 소개 내용을 입력해주세요.
                    </div>
                    <TextField
                      fullWidth
                      id="margin-none"
                      multiline
                      rows={4}
                      onChange={onMessageChange1}
                      value={introductionText}
                      placeholder="비전공자 개발자라면, 컴퓨터 공학 지식에 대한 갈증이 있을텐데요.
                    혼자서는 끝까지 하기 어려운 개발 공부를 함께 퀴즈 클럽에서 해봅시다.
                    멀리 가려면 함께 가라는 말이 있는데, 우리 전원 퀴즈클럽 달성도 100% 만들어 보아요!"
                    />
                  </div>

                  {/* AI 학습총평 설정 패널 */}
                  <div className="tw-p-6 tw-px-0 tw-border tw-mt-5">
                    <div className="tw-grid tw-grid-cols-3 tw-gap-6">
                      {/* AI 학습총평 실행 관한 */}
                      <div>
                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-3">AI 학습총평 실행 권한</div>
                        <div className="">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  aiSummarySettings.comprehensiveEvaluationPermissions?.includes('0001') || false
                                }
                                onChange={e => handleComprehensiveEvaluationPermissionChange('0001', e.target.checked)}
                                sx={{
                                  color: '#9CA3AF',
                                  '&.Mui-checked': {
                                    color: '#000',
                                  },
                                }}
                              />
                            }
                            label={<span className="tw-text-sm tw-text-gray-700">교수자 실행 (기본)</span>}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  aiSummarySettings.comprehensiveEvaluationPermissions?.includes('0003') || false
                                }
                                onChange={e => handleComprehensiveEvaluationPermissionChange('0003', e.target.checked)}
                                sx={{
                                  color: '#9CA3AF',
                                  '&.Mui-checked': {
                                    color: '#000',
                                  },
                                }}
                              />
                            }
                            label={<span className="tw-text-sm tw-text-gray-700">학습자 실행 (선택)</span>}
                          />
                        </div>
                      </div>

                      {/* AI 학습총평 보기 권한 */}
                      <div>
                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-3">AI 학습총평 보기 권한</div>
                        <div className="">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  aiSummarySettings.comprehensiveEvaluationViewPermissions?.includes('0001') || false
                                }
                                onChange={e =>
                                  handleComprehensiveEvaluationViewPermissionChange('0001', e.target.checked)
                                }
                                sx={{
                                  color: '#9CA3AF',
                                  '&.Mui-checked': {
                                    color: '#000',
                                  },
                                }}
                              />
                            }
                            label={<span className="tw-text-sm tw-text-gray-700">교수자 보기</span>}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  aiSummarySettings.comprehensiveEvaluationViewPermissions?.includes('0003') || false
                                }
                                onChange={e =>
                                  handleComprehensiveEvaluationViewPermissionChange('0003', e.target.checked)
                                }
                                sx={{
                                  color: '#9CA3AF',
                                  '&.Mui-checked': {
                                    color: '#000',
                                  },
                                }}
                              />
                            }
                            label={<span className="tw-text-sm tw-text-gray-700">학습자 보기</span>}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-3">
                          최소 실행 설정 (AI 학습총평을 보기 위한 최소 완료 개수)
                        </div>
                        <FormControl size="small" className="tw-w-full">
                          <Select
                            value={aiSummarySettings.minimumCompletionCount}
                            onChange={e =>
                              handleAiSummarySettingChange('minimumCompletionCount', e.target.value as number)
                            }
                            sx={{
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#D1D5DB',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#9CA3AF',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#2474ED',
                              },
                            }}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
                              <MenuItem key={num} value={num}>
                                {num}회
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    {/* 최소 실행 설정 */}
                  </div>
                </div>

                <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">3. 강의 꾸미기</div>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-5">
                  강의 카드 이미지 선택 <span className="tw-text-red-500">*</span>
                </div>
                <div className="tw-grid tw-grid-flow-col tw-gap-0 tw-content-end">
                  {preview ? (
                    <img src={preview} alt="Image Preview" className="tw-w-[100px] tw-h-[100px] tw-rounded-lg border" />
                  ) : (
                    <div className="tw-w-[100px] tw-h-[100px] tw-rounded-lg border"></div>
                  )}
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Image ${index + 1}`}
                      className={`image-item ${
                        selectedImage === image ? 'selected' : ''
                      } tw-object-cover tw-w-[100px] tw-rounded-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg`}
                      style={{ opacity: selectedImage !== image ? 0.2 : 1 }}
                      onClick={() => handleImageClick(image, 'card', false)}
                    />
                  ))}
                  <div className="tw-flex tw-items-center tw-justify-center tw-w-[100px] tw-h-[100px]">
                    <label
                      htmlFor="dropzone-file"
                      className="tw-flex tw-flex-col tw-items-center tw-justify-center  tw-w-[100px] tw-h-[100px] tw-border-2 tw-border-gray-300 tw-border-dashed tw-rounded-lg tw-cursor-pointer tw-bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-pt-5 tw-pb-6">
                        <svg
                          className="tw-w-8 tw-h-8 tw-mb-4 tw-text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="tw-mb-2 tw-text-sm tw-text-gray-500 dark:text-gray-400">
                          <span className="tw-font-semibold">image upload</span>
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="tw-hidden"
                        onChange={e => handleImageChange(e, 'card')}
                      />
                    </label>
                  </div>
                </div>

                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-5">
                  강의 배경 이미지 선택 <span className="tw-text-red-500">*</span>
                </div>
                <div className="tw-grid tw-grid-flow-col tw-gap-0 tw-content-end">
                  {previewBanner ? (
                    <img
                      src={previewBanner}
                      alt="Image Preview"
                      className="tw-w-[100px] tw-h-[100px] tw-rounded-lg border"
                    />
                  ) : (
                    <div className="tw-w-[100px] tw-h-[100px] tw-rounded-lg border"></div>
                  )}
                  {imageBanner.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Image ${index + 1}`}
                      className={`image-item ${
                        selectedImageBanner === image ? 'selected' : ''
                      } tw-object-cover tw-w-[260px] tw-rounded-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[200px] md:tw-rounded-lg`}
                      style={{ opacity: selectedImageBanner !== image ? 0.2 : 1 }}
                      onClick={() => handleImageClick(image, 'banner', false)}
                    />
                  ))}
                  <div className="tw-flex tw-items-center tw-justify-center tw-w-[100px] tw-h-[100px]">
                    <label
                      htmlFor="dropzone-file2"
                      className="tw-flex tw-flex-col tw-items-center tw-justify-center  tw-w-[100px] tw-h-[100px] tw-border-2 tw-border-gray-300 tw-border-dashed tw-rounded-lg tw-cursor-pointer tw-bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-pt-5 tw-pb-6">
                        <svg
                          className="tw-w-8 tw-h-8 tw-mb-4 tw-text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="tw-mb-2 tw-text-sm tw-text-gray-500 dark:text-gray-400">
                          <span className="tw-font-semibold">image upload</span>
                        </p>
                      </div>
                      <input
                        id="dropzone-file2"
                        type="file"
                        className="tw-hidden"
                        onChange={e => handleImageChange(e, 'banner')}
                      />
                    </label>
                  </div>
                </div>

                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-5">
                  강의내 교수 프로필 이미지
                </div>

                {agreements === true ? (
                  <img
                    className="border tw-w-28 tw-h-28 tw-rounded-full"
                    src={user?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
                    alt=""
                  />
                ) : (
                  <img
                    className="border tw-w-28 tw-h-28 tw-rounded-full"
                    src={previewProfile || '/assets/images/account/default_profile_image.png'}
                    alt=""
                  />
                )}

                <div className="tw-flex tw-items-center tw-justify-start tw-gap-1">
                  <Checkbox checked={agreements} onChange={e => handleCheckboxChangeAgreements(e)} />
                  <div className="tw-text-sm tw-font-bold tw-text-black tw-mt-5 tw-my-5">현재 프로필 이미지 사용</div>
                </div>
                <button
                  onClick={() => document.getElementById('dropzone-file3').click()}
                  type="button"
                  className="tw-text-black tw-mr-5 border border-dark tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                >
                  + 직접 업로드
                </button>
                <input
                  id="dropzone-file3"
                  type="file"
                  className="tw-hidden"
                  onChange={e => handleImageChange(e, 'profile')}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="tw-h-[60vh]">
            <div className="tw-flex tw-justify-between tw-items-center tw-relative tw-gap-3">
              <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">AI조교 설정</div>
              <div>{isProcessing}</div>
              <button
                className="tw-w-[150px] border tw-text-gray-500 tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-text-sm tw-rounded"
                onClick={() => handleAISave()}
              >
                {isProcessing ? <CircularProgress color="info" size={18} /> : '수정하기'}
              </button>
            </div>

            <div className="tw-grid tw-grid-cols-3 tw-gap-4 tw-content-start">
              <div>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2">타 학습자 질의/답변 보기</div>
                <div>
                  <div className="tw-flex tw-items-center tw-mt-1">
                    <ToggleButtonGroup
                      value={isQuestionsPublic}
                      onChange={handleIsQuestionsPublic}
                      exclusive
                      aria-label=""
                      sx={{
                        '& .MuiToggleButton-root': {
                          width: 70,
                          height: 35,
                          margin: '0 8px',
                          borderRadius: '5px !important',
                          border: '1px solid rgba(0, 0, 0, 0.12) !important',
                          '&.Mui-selected': {
                            backgroundColor: '#000',
                            color: '#fff',
                            borderColor: '#000 !important',
                          },
                          '&:not(.Mui-selected)': {
                            backgroundColor: '#fff',
                            color: '#000',
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        },
                      }}
                    >
                      <ToggleButton value="true" className="tw-ring-1 tw-ring-slate-900/10">
                        공개
                      </ToggleButton>
                      <ToggleButton value="false" className="tw-ring-1 tw-ring-slate-900/10">
                        비공개
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                </div>
              </div>
              <div>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2">
                  AI 질문제한 (시험 등 AI조교 기능 제한이 필요할 때)
                </div>
                <div>
                  <div className="tw-flex tw-items-center tw-mt-1">
                    <ToggleButtonGroup
                      value={enableAiQuestion}
                      onChange={handleEnableAiQuestion}
                      exclusive
                      aria-label=""
                      sx={{
                        '& .MuiToggleButton-root': {
                          width: 70,
                          height: 35,
                          margin: '0 8px',
                          borderRadius: '5px !important',
                          border: '1px solid rgba(0, 0, 0, 0.12) !important',
                          '&.Mui-selected': {
                            backgroundColor: '#000',
                            color: '#fff',
                            borderColor: '#000 !important',
                          },
                          '&:not(.Mui-selected)': {
                            backgroundColor: '#fff',
                            color: '#000',
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        },
                      }}
                    >
                      <ToggleButton value="false" className="tw-ring-1 tw-ring-slate-900/10">
                        ON
                      </ToggleButton>
                      <ToggleButton value="true" className="tw-ring-1 tw-ring-slate-900/10">
                        OFF
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                </div>
              </div>
              <div>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2">답변레퍼런스 포함여부</div>
                <div>
                  <div className="tw-flex tw-items-center tw-mt-1">
                    <ToggleButtonGroup
                      value={includeReferenceToAnswer}
                      onChange={handleIncludeReferenceToAnswer}
                      exclusive
                      aria-label=""
                      sx={{
                        '& .MuiToggleButton-root': {
                          width: 70,
                          height: 35,
                          margin: '0 8px',
                          borderRadius: '5px !important',
                          border: '1px solid rgba(0, 0, 0, 0.12) !important',
                          '&.Mui-selected': {
                            backgroundColor: '#000',
                            color: '#fff',
                            borderColor: '#000 !important',
                          },
                          '&:not(.Mui-selected)': {
                            backgroundColor: '#fff',
                            color: '#000',
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        },
                      }}
                    >
                      <ToggleButton value="true" className="tw-ring-1 tw-ring-slate-900/10">
                        ON
                      </ToggleButton>
                      <ToggleButton value="false" className="tw-ring-1 tw-ring-slate-900/10">
                        OFF
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-grid tw-grid-cols-3 tw-gap-4 tw-content-start">
              <div className=" tw-mt-7 tw-mr-3">
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2">답변품질 설정</div>
                <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3 tw-mt-5">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">답변길이</p>
                  <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                    <select
                      className="tw-px-5 tw-w-full tw-text-black"
                      onChange={e => setAiAnswerLengths(e.target.value)}
                      value={aiAnswerLengths}
                    >
                      <option value="very_short">매우짧게</option>
                      <option value="short">짧게</option>
                      <option value="medium">보통</option>
                      <option value="long">길게</option>
                      <option value="very_long">매우길게</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">언어 설정</div>
            <div className="tw-grid tw-grid-cols-3 tw-gap-8 tw-py-5">
              <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">강의언어</p>
                <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                  <select
                    className="tw-px-5 tw-w-full tw-text-black"
                    onChange={e => setLectureLanguage(e.target.value)}
                    value={lectureLanguage}
                  >
                    <option value="kor">한국어</option>
                    <option value="eng">영어</option>
                  </select>
                </div>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">콘텐츠언어</p>
                <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                  <select
                    className="tw-px-5 tw-w-full tw-text-black"
                    onChange={e => setContentLanguage(e.target.value)}
                    value={contentLanguage}
                  >
                    <option value="kor">한국어</option>
                    <option value="eng">영어</option>
                  </select>
                </div>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">AI대화언어</p>
                <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                  <select
                    className="tw-px-5 tw-w-full tw-text-black"
                    onChange={e => setLectureAILanguage(e.target.value)}
                    value={lectureAILanguage}
                  >
                    <option value="kor">한국어</option>
                    <option value="eng">영어</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-7 tw-my-2">질문 제한 키워드</div>
            <div className=" tw-w-full  tw-mt-1">
              <Tag
                value={forbiddenKeywords}
                onChange={setForbiddenKeywords}
                placeHolder="질문 제한 키워드 입력 해주세요."
              />
            </div>

            {/* AI 학습총평 설정 패널 */}
            <div className="tw-p-6 tw-px-0 tw-border">
              <div className="tw-grid tw-grid-cols-3 tw-gap-6">
                {/* AI 학습총평 실행 관한 */}
                <div>
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-3">AI 학습총평 실행 권한</div>
                  <div className="">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={aiSummarySettings.comprehensiveEvaluationPermissions?.includes('0001') || false}
                          onChange={e => handleComprehensiveEvaluationPermissionChange('0001', e.target.checked)}
                          sx={{
                            color: '#9CA3AF',
                            '&.Mui-checked': {
                              color: '#000',
                            },
                          }}
                        />
                      }
                      label={<span className="tw-text-sm tw-text-gray-700">교수자 실행 (기본)</span>}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={aiSummarySettings.comprehensiveEvaluationPermissions?.includes('0003') || false}
                          onChange={e => handleComprehensiveEvaluationPermissionChange('0003', e.target.checked)}
                          sx={{
                            color: '#9CA3AF',
                            '&.Mui-checked': {
                              color: '#000',
                            },
                          }}
                        />
                      }
                      label={<span className="tw-text-sm tw-text-gray-700">학습자 실행 (선택)</span>}
                    />
                  </div>
                </div>

                {/* AI 학습총평 보기 권한 */}
                <div>
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-3">AI 학습총평 보기 권한</div>
                  <div className="">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={aiSummarySettings.comprehensiveEvaluationViewPermissions?.includes('0001') || false}
                          onChange={e => handleComprehensiveEvaluationViewPermissionChange('0001', e.target.checked)}
                          sx={{
                            color: '#9CA3AF',
                            '&.Mui-checked': {
                              color: '#000',
                            },
                          }}
                        />
                      }
                      label={<span className="tw-text-sm tw-text-gray-700">교수자 보기</span>}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={aiSummarySettings.comprehensiveEvaluationViewPermissions?.includes('0003') || false}
                          onChange={e => handleComprehensiveEvaluationViewPermissionChange('0003', e.target.checked)}
                          sx={{
                            color: '#9CA3AF',
                            '&.Mui-checked': {
                              color: '#000',
                            },
                          }}
                        />
                      }
                      label={<span className="tw-text-sm tw-text-gray-700">학습자 보기</span>}
                    />
                  </div>
                </div>

                {/* 최소 실행 설정 */}
                <div>
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-3">
                    최소 실행 설정 (AI 학습총평을 보기 위한 최소 완료 개수)
                  </div>
                  <FormControl size="small" className="tw-w-full">
                    <Select
                      value={aiSummarySettings?.minimumCompletionCount || 1}
                      onChange={e => handleAiSummarySettingChange('minimumCompletionCount', e.target.value as number)}
                      sx={{
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#D1D5DB',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#9CA3AF',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2474ED',
                        },
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
                        <MenuItem key={num} value={num}>
                          {num}회
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'lecture' && (
          <div>
            {/* 강의 커리큘럼 */}
            <article>
              <div className="tw-relative">
                <div className="tw-flex tw-justify-between tw-items-center tw-relative tw-gap-3">
                  <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">강의 커리큘럼</div>
                  <div>{isProcessing && <>강의수정시 약 2분이 소요될 예정입니다. 잠시만 기다려 주세요 😊</>}</div>
                  <button
                    disabled={isProcessing}
                    className="tw-w-[150px] border tw-text-gray-500 tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-text-sm tw-rounded"
                    onClick={() => handleSave()}
                  >
                    {isProcessing ? <CircularProgress color="info" size={18} /> : '수정하기'}
                  </button>
                </div>
              </div>

              <div className="tw-mt-10"></div>

              <Grid container direction="row" justifyContent="left" alignItems="flex-start" rowSpacing={4}>
                <Grid item xs={1}>
                  {scheduleData.map((item, index) => {
                    return (
                      <div key={index} className="tw-h-[412px] tw-flex tw-flex-col tw-items-center tw-justify-start">
                        {/* <div className=" tw-text-center tw-text-black tw-font-bold tw-mt-5">강의</div> */}
                        {item.studyOrder && (
                          <div className="tw-text-center tw-text-lg tw-text-black tw-font-bold tw-mt-4">
                            {index + 1} {studyOrderLabel}
                            <div className="tw-flex tw-justify-center tw-mt-2">
                              <svg
                                width={20}
                                height={20}
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="tw-w-5 tw-h-5"
                                preserveAspectRatio="xMidYMid meet"
                              >
                                <path
                                  d="M9.2 11.8V10H11V11.8H9.2ZM5.6 11.8V10H7.4V11.8H5.6ZM12.8 11.8V10H14.6V11.8H12.8ZM9.2 15.4V13.6H11V15.4H9.2ZM5.6 15.4V13.6H7.4V15.4H5.6ZM12.8 15.4V13.6H14.6V15.4H12.8ZM2 19V2.8H4.7V1H6.5V2.8H13.7V1H15.5V2.8H18.2V19H2ZM3.8 17.2H16.4V8.2H3.8V17.2ZM3.8 6.4H16.4V4.6H3.8V6.4Z"
                                  fill="#CED4DE"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Grid>
                <Grid item xs={11}>
                  <ReactDragList
                    dataSource={scheduleData}
                    rowKey="studyOrder"
                    row={dragList}
                    disabled={isDisabled}
                    handles={false}
                    className="simple-drag"
                    rowClassName="simple-drag-row"
                    onUpdate={handleUpdate}
                    key={updateKey} // 상태 업데이트를 강제 트리거
                  />
                </Grid>
              </Grid>

              <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
                <div className="tw-w-1/12 tw-flex tw-justify-center tw-items-center">
                  <div className="tw-w-[59px] tw-h-[46px] tw-relative tw-flex tw-flex-col tw-items-center">
                    <p className="tw-text-base tw-font-bold tw-text-center tw-text-[#ced4de]">{studyOrderLabel}</p>
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-w-5 tw-h-5 tw-mt-2"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        d="M9.2 11.8V10H11V11.8H9.2ZM5.6 11.8V10H7.4V11.8H5.6ZM12.8 11.8V10H14.6V11.8H12.8ZM9.2 15.4V13.6H11V15.4H9.2ZM5.6 15.4V13.6H7.4V15.4H5.6ZM12.8 15.4V13.6H14.6V15.4H12.8ZM2 19V2.8H4.7V1H6.5V2.8H13.7V1H15.5V2.8H18.2V19H2ZM3.8 17.2H16.4V8.2H3.8V17.2ZM3.8 6.4H16.4V4.6H3.8V6.4Z"
                        fill="#CED4DE"
                      />
                    </svg>
                  </div>
                </div>

                <div className="tw-w-11/12 tw-mt-5">
                  <div className="tw-h-24 tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border tw-border-[#e9ecf2]">
                    <div className="tw-absolute tw-top-9 tw-left-1/2 tw-transform tw--translate-x-1/2 tw-flex tw-justify-center tw-items-center tw-gap-2">
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-6 tw-h-6 tw-relative"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g clipPath="url(#tw-clip0_320_49119)">
                          <circle cx={12} cy={12} r="11.5" stroke="#9CA5B2" strokeDasharray="2.25 2.25" />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.75 7.5H11.25V11.25L7.5 11.25V12.75H11.25V16.5H12.75V12.75H16.5V11.25L12.75 11.25V7.5Z"
                            fill="#9CA5B2"
                          />
                        </g>
                        <defs>
                          <clipPath id="tw-clip0_320_49119">
                            <rect width={24} height={24} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-medium tw-text-left tw-text-[#9ca5b2]">
                        <button type="button" onClick={handleAddClick} className="tw-text-black tw-text-base ">
                          강의{studyOrderLabel} 추가하기
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.5);', paddingY: '40px' }} />

              <div className="tw-relative tw-mt-12">
                <p className="tw-text-xl tw-font-bold tw-text-left tw-text-black tw-py-5">공통 강의자료 등록</p>
                <p className="tw-text-base tw-text-left tw-text-black">
                  <span className="tw-text-base tw-text-left tw-text-black">
                    해당 학기에서 공통적으로 사용하는 강의자료를 등록해주세요. 등록된 자료는 AI조교의 학습에 활용되며,{' '}
                    <br />
                    학생들의 질의응답에 사용됩니다. 추후 강의 대시보드에서도 업로드 및 수정이 가능합니다.
                  </span>
                  <br />
                </p>
              </div>

              <div className=" tw-p-5 tw-mt-14  border tw-rounded-lg">
                <div className="tw-w-full tw-flex tw-justify-start tw-items-center ">
                  <div className="tw-flex tw-text-black tw-text-base tw-w-[140px]">강의자료 업로드 : </div>
                  <div className="tw-flex tw-items-center tw-gap-2 tw-w-full tw-px-5">
                    <div className="tw-w-[160px] tw-flex tw-items-center tw-gap-2 border tw-px-2 tw-py-2.5 tw-rounded">
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
                        파일 업로드 +
                      </button>
                      <input
                        accept=".pdf .pptx"
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                    </div>
                    <TextField
                      fullWidth
                      className="tw-pl-1"
                      size="small"
                      value={urlCode}
                      onChange={e => setUrlCode(e.target.value)}
                      placeholder="강의영상 유튜브 URL을 입력해주세요. https://www.youtube.com/"
                      id="margin-none"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => handleAddInput(urlCode)}>
                              <AddIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </div>
                {lectureContents.files?.length > 0 && (
                  <div className="tw-flex">
                    <div className="tw-w-[130px] tw-py-5"></div>
                    <div className="tw-w-11/12 tw-pt-5">
                      <div className="tw-w-full tw-flex tw-justify-start tw-px-5 tw-items-center">
                        <div className="tw-flex tw-py-2">
                          <div className="tw-flex tw-text-sm tw-items-start tw-mt-1" style={{ minWidth: '6.1rem' }}>
                            업로드된 파일 :
                          </div>
                          <div className="tw-text-left tw-pl-5 tw-text-sm tw-flex tw-flex-wrap tw-gap-2">
                            {lectureContents.files.map((fileEntry, index) => (
                              <div key={index} className="tw-flex tw-items-center tw-gap-2">
                                <div className="border tw-flex tw-justify-between  tw-w-[400px]">
                                  <div className=" tw-px-2 tw-p-1 tw-rounded tw-line-clamp-1">
                                    <span
                                      onClick={() => {
                                        onFileDownload(fileEntry.fileKey, fileEntry.name);
                                      }}
                                      className="tw-text-blue-600 tw-cursor-pointer tw-line-clamp-1"
                                    >
                                      {fileEntry?.file?.name || fileEntry.name}
                                    </span>
                                  </div>
                                  <button
                                    className="tw-px-2 tw-cursor-pointer"
                                    onClick={() => handleRemoveFileLocal(index)}
                                  >
                                    <svg
                                      width={8}
                                      height={8}
                                      viewBox="0 0 6 6"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="flex-grow-0 flex-shrink-0"
                                      preserveAspectRatio="none"
                                    >
                                      <path
                                        d="M5.39571 0L3 2.39571L0.604286 0L0 0.604286L2.39571 3L0 5.39571L0.604286 6L3 3.60429L5.39571 6L6 5.39571L3.60429 3L6 0.604286L5.39571 0Z"
                                        fill="#6A7380"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <TextField
                                  size="small"
                                  onChange={e => {
                                    // console.log('e', e);
                                    if (fileEntry.serialNumber) {
                                      lectureNameUrl2(0, e.target.value, true, fileEntry.serialNumber);
                                    } else {
                                      lectureNameUrl2(0, e.target.value, false, index);
                                    }
                                  }}
                                  id="margin-none"
                                  value={fileEntry.externalSharingLink}
                                  name="clubName"
                                  placeholder="파일 url을 입력해주세요."
                                  sx={{
                                    backgroundColor: 'white',
                                    '& .MuiInputBase-root': {
                                      height: '28px', // 원하는 높이로 설정
                                    },
                                  }}
                                  onDragStart={e => e.preventDefault()} // Prevent default drag behavior on TextField
                                />
                                <div className="tw-p-1 tw-text-center tw-bg-black tw-text-white tw-rounded tw-items-center tw-gap-2 tw-px-2">
                                  {isProcessing
                                    ? '등록 중'
                                    : fileEntry.fileUploadStatus === '0000'
                                    ? '등록 전'
                                    : fileEntry.fileUploadStatus === '1000'
                                    ? '등록 중'
                                    : fileEntry.fileUploadStatus === '2000'
                                    ? '등록 완료'
                                    : fileEntry.fileUploadStatus === '3000'
                                    ? '등록 실패'
                                    : '등록 전'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {lectureContents?.urls?.length > 0 && (
                  <div className="tw-flex">
                    <div className="tw-w-[130px] tw-py-5"></div>
                    <div className="tw-w-11/12">
                      <div className="tw-w-full tw-flex tw-justify-start tw-px-5 tw-items-center">
                        <div className="tw-flex tw-py-2">
                          <div className="tw-flex tw-text-sm tw-items-center" style={{ minWidth: '6.1rem' }}>
                            첨부된 URL :
                          </div>
                          <div className="tw-text-left tw-pl-5 tw-text-sm tw-flex tw-flex-wrap tw-gap-2">
                            {lectureContents?.urls?.map((file, index) => (
                              <div key={index} className="tw-flex tw-items-center tw-gap-2">
                                <div className="border tw-px-3 tw-p-1 tw-rounded">
                                  <span className="tw-text-[#FF8F60]">{file.url}</span>
                                  <button
                                    className="tw-ml-2 tw-cursor-pointer"
                                    onClick={() => handleRemoveInputLocal(index)}
                                  >
                                    <svg
                                      width={8}
                                      height={8}
                                      viewBox="0 0 6 6"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="flex-grow-0 flex-shrink-0"
                                      preserveAspectRatio="none"
                                    >
                                      <path
                                        d="M5.39571 0L3 2.39571L0.604286 0L0 0.604286L2.39571 3L0 5.39571L0.604286 6L3 3.60429L5.39571 6L6 5.39571L3.60429 3L6 0.604286L5.39571 0Z"
                                        fill="#6A7380"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <div className="tw-p-1 tw-text-center tw-bg-black tw-text-white tw-rounded tw-items-center tw-gap-2 tw-px-2">
                                  {isProcessing
                                    ? '등록 중'
                                    : file.fileUploadStatus === '0000'
                                    ? '등록 전'
                                    : file.fileUploadStatus === '1000'
                                    ? '등록 중'
                                    : file.fileUploadStatus === '2000'
                                    ? '등록 완료'
                                    : file.fileUploadStatus === '3000'
                                    ? '등록 실패'
                                    : '등록 전'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>
        )}
      </div>

      <MentorsModal
        zIndex={2000}
        title="교수자 추가하기"
        isOpen={isModalOpen}
        onAfterClose={() => {
          setIsModalOpen(false);
          setPageMember(1);
          setSortType('0001');
          setSelectedUUIDs([]);
          setKeyWorld('');
        }}
      >
        <div className="tw-mb-8">
          <Grid container direction="row" alignItems="center" rowSpacing={0}>
            <Grid
              item
              container
              justifyContent="flex-start"
              xs={6}
              sm={6}
              className="tw-text-xl tw-text-black tw-font-bold"
            >
              클럽 학습자 목록 ({totalElementsMember || 0})
            </Grid>

            <Grid item container justifyContent="flex-end" xs={6} sm={6} style={{ textAlign: 'right' }}>
              <TextField
                fullWidth
                id="outlined-basic"
                label=""
                placeholder="이름검색"
                variant="outlined"
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    setPageMember(1);
                    searchKeyworld((e.target as HTMLInputElement).value);
                  }
                }}
                InputProps={{
                  style: { height: '43px' },
                  startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                }}
              />
            </Grid>
          </Grid>
          <div className="tw-flex tw-justify-between tw-items-center tw-h-12 tw-my-5">
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                정렬 :
              </p>

              <RadioGroup value={sortType} onChange={handleChangeQuiz} row>
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
                      가나다순
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
                      가입최신순
                    </p>
                  }
                />
                <FormControlLabel
                  value="0004"
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
                      가입오래된순
                    </p>
                  }
                />
              </RadioGroup>
            </div>
            <div>
              <Pagination
                count={totalPageMember}
                size="small"
                siblingCount={0}
                page={pageMember}
                renderItem={item => (
                  <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                )}
                onChange={handlePageChangeMember}
              />
            </div>
          </div>
          {myMemberList.length === 0 ? (
            <div className="">
              <div className=" tw-mt-10 tw-text-center tw-text-black  tw-py-20 border tw-text-base tw-rounded tw-bg-white">
                클럽 학생이 없습니다.
              </div>
            </div>
          ) : (
            <div className="tw-h-[500px] tw-overflow-y-auto">
              {myMemberList.map((item, index) => {
                return (
                  <div key={index} className="">
                    <Grid
                      className="tw-py-2 border-bottom tw-text-base"
                      key={index}
                      container
                      direction="row"
                      justifyContent="left"
                      alignItems="center"
                      rowSpacing={3}
                    >
                      <Grid item xs={12} sm={1}>
                        <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                          <img
                            className="tw-w-10 tw-h-10 border tw-rounded-full"
                            src={item?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <div className="tw-text-left tw-text-black tw-line-clamp-1">{item?.member?.nickname}</div>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <div className="tw-text-left tw-text-black tw-line-clamp-1">{item?.memberId}</div>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <div className="tw-text-left tw-text-black tw-line-clamp-1">{item?.jobGroup?.name}</div>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <div className="tw-text-left tw-text-black tw-line-clamp-1">{item?.job?.name}</div>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}
                      >
                        <div className=" tw-flex tw-justify-center tw-items-center">
                          <button
                            onClick={() => handleClickProfile(item?.member?.memberUUID)}
                            type="button"
                            data-tooltip-target="tooltip-default"
                            className="tw-py-2 tw-mr-3 tw-bg-black tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
                          >
                            프로필 보기
                          </button>
                          <Checkbox
                            checked={selectedUUIDs.includes(item?.member?.memberUUID)}
                            onChange={e => handleCheckboxRequestChange(item?.member?.memberUUID, e.target.checked)}
                            {...label}
                          />
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                );
              })}
            </div>
          )}

          <div className="tw-text-right">
            <button
              onClick={() => {
                handleChangeProfessorRequestButton(selectedUUIDs);
              }}
              type="button"
              data-tooltip-target="tooltip-default"
              className="tw-w-[125px] tw-mt-10 tw-py-3 tw-bg-blue-500  tw-text-white tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
            >
              확인
            </button>
          </div>
        </div>
      </MentorsModal>

      <MentorsModal
        isProfile={true}
        title={'프로필 보기'}
        isOpen={isModalProfileOpen}
        onAfterClose={() => setIsModalProfileOpen(false)}
      >
        {isProfileFetched && (
          <div>
            <MyProfile profile={profile} badgeContents={badgeContents} />
          </div>
        )}
      </MentorsModal>
    </div>
  );
}

export default ManageLectureClubTemplate;
