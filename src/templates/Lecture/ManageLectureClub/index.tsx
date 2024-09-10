import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import Divider from '@mui/material/Divider';
import {
  paramProps,
  useMyClubList,
  useMyLectureList,
  useMyMemberList,
  useMyMemberRequestList,
} from 'src/services/seminars/seminars.queries';
import { useCrewBanDelete, useCrewAcceptPost, useCrewRejectPost } from 'src/services/admin/friends/friends.mutations';

import Grid from '@mui/material/Grid';

/** drag list */
import ReactDragList from 'react-drag-list';

/**import quiz modal  */
import { useQuizList } from 'src/services/jobs/jobs.queries';
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
import { useQuizMyClubInfo } from 'src/services/quiz/quiz.queries';
import QuizBreakerInfo from 'src/stories/components/QuizBreakerInfo';
import { useSaveQuiz } from 'src/services/admin/members/members.mutations';
import router from 'next/router';

//quiz
import { MentorsModal } from 'src/stories/components';
import Paginations from 'src/stories/components/Pagination';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import QuizBreakerInfoCheck from 'src/stories/components/QuizBreakerInfoCheck';
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
import { useLectureModify } from 'src/services/quiz/quiz.mutations';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
export const generateUUID = () => {
  return uuidv4();
};

export interface ManageLectureClubTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function ManageLectureClubTemplate({ id }: ManageLectureClubTemplateProps) {
  const { mutate: onCrewBan, isSuccess: isBanSuccess } = useCrewBanDelete();
  const { mutate: onCrewAccept, isSuccess: isAcceptSuccess } = useCrewAcceptPost();
  const { mutate: onCrewReject, isSuccess: isRejectSuccess } = useCrewRejectPost();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageMember, setPageMember] = useState(1);
  const [totalPageMember, setTotalPageMember] = useState(1);
  const [totalElementsMember, setTotalElementsMember] = useState(0);
  const [value, setValue] = React.useState(0);
  const [myClubList, setMyClubList] = useState<any>([]);
  const [myMemberList, setMyMemberList] = useState<any>([]);
  const [myMemberRequestList, setMyMemberRequestList] = useState<any>([]);
  const [ids, setIds] = useState<any>(id);
  const [myClubParams, setMyClubParams] = useState<any>({ clubSequence: id, page });
  const [myRequestMemberParams, setMyRequestMemberParams] = useState<any>({ clubSequence: id, page });
  const [myClubMemberParams, setMyClubMemberParams] = useState<any>({ clubSequence: id, page });
  const [active, setActive] = useState(0);
  const [params, setParams] = useState<paramProps>({ page });
  const [quizList, setQuizList] = useState<any>([]);
  const [keyWorld, setKeyWorld] = useState('');
  const [selectedValue, setSelectedValue] = useState(id);

  const [activeTab, setActiveTab] = useState('myQuiz');
  // const [activeTab, setActiveTab] = useState('community');

  const [pageQuiz, setPageQuiz] = useState(1);
  const [myQuizParams, setMyQuizParams] = useState<any>({ clubSequence: id, sortType: 'ASC', page });
  const [updateKey, setUpdateKey] = useState(0); // 상태 업데이트 강제 트리거를 위한 키
  //quiz new logic
  const [selectedQuizIds, setSelectedQuizIds] = useState([]);
  const [quizListData, setQuizListData] = useState<any[]>([]);
  const { mutate: onQuizSave } = useSaveQuiz();

  //quiz
  const [pageQuizz, setPageQuizz] = useState(1);
  const [totalQuizzPage, setTotalQuizzPage] = useState(1);
  const [totalQuizzElements, setTotalQuizzElements] = useState(0);
  const [quizUrl, setQuizUrl] = React.useState('');
  const [quizName, setQuizName] = React.useState('');
  const [quizSearch, setQuizSearch] = React.useState('');
  const [allQuizData, setAllQuizData] = useState([]);
  const [jobGroupPopUp, setJobGroupPopUp] = useState([]);
  const [profile, setProfile] = useState<any>([]);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState<boolean>(false);
  const [memberUUID, setMemberUUID] = useState<string>('');

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

  const handleChange = (event, newIndex) => {
    //console.log('SubTab - index', newIndex, event);
    setActive(newIndex);
    setValue(newIndex);
  };

  const handleInputQuizSearchChange = event => {
    setQuizSearch(event.target.value);
  };

  //new logic
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [clubAbout, setClubAbout] = useState<any>({});
  const handleCheckboxChange = quizSequence => {
    // Filter out items with quizSequence as null and count them
    const nullQuizSequenceCount = quizList.filter(item => item.quizSequence === null).length;

    if (!selectedQuizIds.includes(quizSequence) && nullQuizSequenceCount <= 0) {
      alert('퀴즈를 추가 할 수 없습니다.');
      return;
    }

    setSelectedQuizIds(prevSelectedQuizIds => {
      const updatedSelectedQuizIds = prevSelectedQuizIds.includes(quizSequence)
        ? prevSelectedQuizIds.filter(id => id !== quizSequence)
        : [...prevSelectedQuizIds, quizSequence];

      setQuizList(prevSelectedQuizzes => {
        const alreadySelected = prevSelectedQuizzes.some(quiz => quiz.quizSequence === quizSequence);
        console.log(alreadySelected);
        if (alreadySelected) {
          // When unchecked, set quizSequence to null
          return prevSelectedQuizzes.map(quiz =>
            quiz.quizSequence === quizSequence ? { ...quiz, quizSequence: null } : quiz,
          );
        } else {
          console.log(quizList);
          const newQuiz = allQuizData.find(quiz => quiz.quizSequence === quizSequence);
          const reconstructedQuiz = newQuiz
            ? {
                quizSequence: newQuiz.quizSequence,
                question: newQuiz.question,
                leaderUri: newQuiz.memberUri,
                leaderUUID: newQuiz.memberUUID,
                leaderProfileImageUrl: newQuiz.memberProfileImageUrl,
                leaderNickname: newQuiz.memberNickname,
                contentUrl: newQuiz.contentUrl,
                contentTitle: newQuiz.contentTitle,
                modelAnswer: newQuiz.modelAnswer,
                quizUri: newQuiz.quizUri,
              }
            : null;

          console.log(newQuiz);
          console.log(reconstructedQuiz);

          // Find the first item with null values in scheduleData
          const firstNullItemIndex = quizList.findIndex(item => item.quizSequence === null);

          if (firstNullItemIndex !== -1 && newQuiz) {
            // Update the first null item with the new quiz data
            const updatedScheduleData = [...quizList];
            updatedScheduleData[firstNullItemIndex] = {
              ...updatedScheduleData[firstNullItemIndex],
              ...reconstructedQuiz,
            };
            console.log(updatedScheduleData);
            setScheduleData(updatedScheduleData);
            return updatedScheduleData;
          }
        }
      });
      return updatedSelectedQuizIds;
    });
  };

  useEffect(() => {
    // 상태 업데이트 후 추가 작업 수행
    console.log('scheduleData가 업데이트되었습니다.', quizList);
    // setUpdateKey를 호출하여 강제 리렌더링
    setUpdateKey(prevKey => prevKey + 1);
  }, [quizList]);

  const handleChangeQuiz = event => {
    setSortType(event.target.value);
  };

  // 퀴즈 소개 정보 조회
  const { isFetched: isClubAboutFetched, refetch: refetchClubAbout } = useLectureAboutDetailInfo(ids, data => {
    console.log(data);
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
    console.log('load temp', clubForm.studyKeywords);
    setStudyKeywords(clubForm.studyKeywords || []);
    setStudySubject(clubForm.studySubject || '');
    setUniversityCode(clubForm.jobGroups[0].code || '');
    setRecommendLevels(clubForm.jobLevels.map(item => item.code) || '');
    console.log(clubForm?.jobLevels?.map(item => item.name));

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

    setPreview(clubForm.clubImageUrl);
    setPreviewBanner(clubForm.backgroundImageUrl);
    setPreviewProfile(clubForm.instructorProfileImageUrl);

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
  const { isFetched: isContentFetched, refetch: refetchMyClub } = useMyLectureList(myClubParams, data => {
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

  /** get badge */
  const [badgePage, setBadgePage] = useState(1);
  const [badgeParams, setBadgeParams] = useState<any>({ page: badgePage, memberUUID: memberUUID });
  const [badgeContents, setBadgeContents] = useState<any[]>([]);
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
  }, [isAcceptSuccess, isRejectSuccess]);

  /** my quiz replies */
  const [selectedClub, setSelectedClub] = useState(null);
  const [sortType, setSortType] = useState('0001');
  const [sortQuizType, setSortQuizType] = useState('ASC');

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
  }, [sortType, selectedValue]);

  useDidMountEffect(() => {
    setMyClubMemberParams({
      clubSequence: selectedClub?.clubSequence,
      page: pageMember,
    });
  }, [pageMember]);

  useDidMountEffect(() => {
    setMyQuizParams({
      clubSequence: selectedClub?.clubSequence,
      page: pageQuiz,
      sortType: sortQuizType,
    });
  }, [pageQuiz, sortQuizType]);

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

  //수정
  const [paramss, setParamss] = useState<any>({});
  const [levelNames, setLevelNames] = useState([]);
  const [lectureLanguage, setLectureLanguage] = useState('kor');
  const [contentLanguage, setContentLanguage] = useState('kor');
  const [lectureAILanguage, setLectureAILanguage] = useState('kor');
  const [participationCode, setParticipationCode] = useState('');
  const [isPublic, setIsPublic] = useState('0001');
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
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['Step.1 강의 정보입력', 'Step.2 강의 커리큘럼 입력', 'Step.3 개설될 강의 미리보기'];
  const [urlCode, setUrlCode] = useState('');
  let [key, setKey] = useState('');
  let [fileName, setFileName] = useState('');

  const { mutate: onLectureModify, isError, isSuccess: clubSuccess, data: clubDatas } = useLectureModify();

  const getJobLevelNames = (jobLevelCodes, jobLevels) => {
    return jobLevelCodes?.map(code => {
      const jobLevel = jobLevels.find(level => level.code === code.toString().padStart(4, '0'));
      return jobLevel ? jobLevel.name : '';
    });
  };

  const handleFileChange = event => {
    const files = Array.from(event.target.files);
    const allowedExtensions = /(\.pdf)$/i;
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
          contentId: 'content_id_' + generateUUID(),
        })),
      ],
    }));
  };

  const handleNextTwo = () => {
    console.log('next');
    handlerClubSaveTemp('validation');
  };

  const [lectureContents, setLectureContents] = useState({
    files: [],
    urls: [],
  });

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key, fileName);
    setKey(key);
    setFileName(fileName);
    // onFileDownload(key);
  };

  const handleRemoveFileLocal = fileIndex => {
    // setFileList(fileList.filter((_, i) => i !== fileIndex));
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

  const handlerQuizInit = async () => {
    setScheduleData(defaultScheduleData);
  };

  const handleProfileDelete = e => {
    setPreviewProfile(null);
    setSelectedImageProfileCheck(null);
  };

  const handleImageChange = (event, type) => {
    console.log(type);
    const file = event.target.files[0];
    if (file) {
      if (type === 'card') {
        setSelectedImage('');
        setSelectedImageCheck(file);
      } else if (type === 'banner') {
        setSelectedImageBanner('');
        setSelectedImageBannerCheck(file);
      } else if (type === 'profile') {
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

  const handleSave = () => {
    handlerClubSaveTemp('save');
  };

  const handlerClubSaveTemp = type => {
    // const selectedJobCode = jobs.find(j => j.code === selectedJob)?.code || '';

    // 필수 항목 체크
    if (!clubName) {
      alert('클럽 이름을 입력해주세요');
      return false;
    }

    if (!universityCode) {
      alert('학교를 선택해주세요');
      return false;
    }

    if (!selectedJob || selectedJob.length === 0) {
      alert('최소 하나의 학과를 선택해주세요');
      return false;
    }

    if (startDay && endDay) {
      if (startDay.isSame(endDay, 'day')) {
        alert('시작 날짜와 종료 날짜가 같습니다.');
        return false;
      } else if (startDay.isAfter(endDay)) {
        alert('시작 날짜가 종료 날짜 이후일 수 없습니다.');
        return false;
      }
    }

    if (!recommendLevels || recommendLevels.length === 0) {
      alert('최소 하나의 학년을 선택해주세요');
      return false;
    }

    // startAt이 endAt보다 앞서야 하고, 두 날짜는 같을 수 없음
    if (startDay && endDay) {
      const startDate = new Date(params.startAt);
      const endDate = new Date(params.endAt);

      if (startDate >= endDate) {
        alert('종료 날짜는 시작 날짜보다 늦어야 합니다');
        return false;
      }
    }

    if (!studySubject) {
      alert('학습 주제를 입력해주세요');
      return false;
    }

    if (studyKeywords.length === 0) {
      alert('학습 키워드를 입력해주세요');
      return false;
    }

    if (isPublic === '0002') {
      if (!participationCode) {
        alert('참여 코드를 입력해주세요');
        return false;
      }
    }

    if (!introductionText) {
      alert('설명을 입력해주세요');
      return false;
    }

    if (!preview) {
      alert('강의 카드 이미지를 선택해주세요.');
      return false;
    }
    if (!previewBanner) {
      alert('강의 배경 이미지를 선택해주세요.');
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
      lectureLanguage: lectureLanguage || '',
      contentLanguage: contentLanguage || '',
      aiConversationLanguage: lectureAILanguage || '',
      description: introductionText || '',
      useCurrentProfileImage: 'true',
    };

    console.log(clubFormParams);
    const formData = new FormData();
    formData.append('clubForm.clubId', 'lecture_club_' + generateUUID());
    formData.append('clubForm.clubName', clubFormParams.clubName);
    formData.append('clubForm.jobGroups', clubFormParams.jobGroups.toString());
    formData.append('clubForm.jobs', clubFormParams.jobs.toString());
    formData.append('clubForm.jobLevels', clubFormParams.jobLevels.toString());
    formData.append('clubForm.startAt', clubFormParams.startAt);
    formData.append('clubForm.endAt', clubFormParams.endAt);
    formData.append('clubForm.studySubject', clubFormParams.studySubject);
    formData.append('clubForm.studyKeywords', clubFormParams.studyKeywords.toString());
    formData.append('clubForm.isPublic', clubFormParams.isPublic);
    formData.append('clubForm.participationCode', clubFormParams.participationCode);
    formData.append('clubForm.lectureLanguage', clubFormParams.lectureLanguage);
    formData.append('clubForm.contentLanguage', clubFormParams.contentLanguage);
    formData.append('clubForm.aiConversationLanguage', clubFormParams.aiConversationLanguage);
    formData.append('clubForm.description', clubFormParams.description);
    formData.append('clubForm.useCurrentProfileImage', clubFormParams.useCurrentProfileImage);

    if (selectedImage) {
      console.log('selectedImage', selectedImage);
      formData.append('clubForm.clubImageFile', selectedImageCheck);
    }
    if (selectedImageBanner) {
      formData.append('clubForm.backgroundImageFile', selectedImageBannerCheck);
    }
    if (selectedImageProfile) {
      formData.append('clubForm.instructorProfileImageFile', selectedImageProfileCheck);
    }

    console.log(clubFormParams);
    console.log('scheduleData', scheduleData);

    let shouldStop = false;

    for (let i = 0; i < scheduleData.length; i++) {
      const item = scheduleData[i];

      if (shouldStop) return;

      if (item?.files) {
        for (let j = 0; j < item.files.length; j++) {
          const file = item.files[j];
          if (file.serialNumber) {
            formData.append(`clubStudies[${i}].files[${j}].serialNumber`, file.serialNumber);
            formData.append(`clubStudies[${i}].files[${j}].isNew`, 'false');
          } else {
            formData.append(`clubStudies[${i}].files[${j}].isNew`, 'true');
            formData.append(`clubStudies[${i}].files[${j}].file`, file);
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

      if (item.studyDate === '') {
        alert(`${i + 1}번째 강의 시작일을 입력해주세요.`);
        shouldStop = true;
        return; // 함수 전체를 종료
      }

      if (item.clubStudyName === '') {
        alert(`${i + 1}번째 강의 이름을 입력해주세요.`);
        shouldStop = true;
        return; // 함수 전체를 종료
      }

      // studyDate가 순차적인지 확인하는 로직 추가
      if (i > 0) {
        const prevItem = scheduleData[i - 1];
        if (dayjs(item.studyDate).isBefore(dayjs(prevItem.studyDate))) {
          alert(`${i + 1}번째 강의 시작일이 이전 강의 시작일보다 이전입니다. 날짜를 확인해주세요.`);
          shouldStop = true;
          return; // 함수 전체를 종료
        }
      }

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
      // const nextDay = dayjs(item.studyDate).add(1, 'day').format('YYYY-MM-DD');
      const nextDay = dayjs(item.studyDate).format('YYYY-MM-DD');
      formData.append(`clubStudies[${i}].studyDate`, nextDay);
    }

    lectureContents?.files?.forEach((file, j) => {
      if (file.serialNumber) {
        formData.append('lectureContents.files[' + j + '].isNew', 'false');
        formData.append('lectureContents.files[' + j + '].serialNumber', file.serialNumber);
      } else {
        formData.append('lectureContents.files[' + j + '].isNew', 'true');
        formData.append('lectureContents.files[' + j + '].file', file.file);
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
      onLectureModify({ formData, id: selectedClub?.clubSequence });
    }
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
          return { ...item, files: [...(item.files || []), ...updated] };
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
            studyDate: startDay,
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
        handleStartDayChange={handleStartDayChange}
        handleUrlChange={handleUrlChange}
        handleTypeChange={handleTypeChange}
        lectureNameChange={lectureNameChange}
        handleRemoveInput={handleRemoveInput}
        scheduleUrlAdd={scheduleUrlAdd}
        scheduleFileAdd={scheduleFileAdd}
        handleRemoveFile={handleRemoveFile}
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
      studyDate: '',
      // studyDate: dayjs().format('YYYY-MM-DD'),
    };

    // Update scheduleData with the new data
    setScheduleData([...scheduleData, newData]);
  };

  function handleDeleteMember(memberUUID: any): void {
    const isConfirmed = window.confirm('클럽 회원을 강퇴하시겠습니까?');
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

  const handleQuizSave = () => {
    const hasNullQuizSequence = quizList.some(quiz => quiz.quizSequence === null);

    if (hasNullQuizSequence) {
      alert('퀴즈를 등록해주세요.');
      return;
    }
    console.log(quizList);
    onQuizSave({ club: selectedClub?.clubSequence, data: quizList });
  };

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  const handleInputQuizChange = event => {
    setQuizName(event.target.value);
  };

  const [jobGroups, setJobGroups] = useState<any[]>([]);
  const [contentTypes, setContentTypes] = useState<any[]>([]);
  const [jobs, setJobs] = useState([]);
  const quizRef = useRef(null);
  const quizUrlRef = useRef(null);

  const handleInputQuizUrlChange = event => {
    setQuizUrl(event.target.value);
  };

  const handleJobGroups = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setJobGroupPopUp(newFormats);
  };

  const handleJobsPopUp = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setJobs(newFormats);
  };

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

  const [selectedJobQuiz, setSelectedJobQuiz] = useState<string>('');
  const [universityCodeQuiz, setUniversityCodeQuiz] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const handleUniversityChangeQuiz = e => {
    setUniversityCodeQuiz(e.target.value);
  };

  const handleJobChangeQuiz = e => {
    setSelectedJobQuiz(e.target.value);
  };

  const handleLevelChangeQuiz = e => {
    setSelectedLevel(e.target.value);
  };

  const useStyles = makeStyles(theme => ({
    selected: {
      '&&': {
        backgroundColor: '#000',
        color: 'white',
      },
    },
  }));

  const classes = useStyles();

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <>
          <Desktop>
            {/* <Divider className="tw-y-5 tw-bg-['#efefef']" /> */}
            <div className="tw-pt-8">
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
              <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-[31.5px] tw-gap-3.5">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
                  강의클럽 관리하기
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
            <Grid item xs={11.1} className="tw-font-bold tw-text-xl">
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
              className={`tw-absolute tw-left-[52px] tw-top-3 tw-text-base tw-text-center ${
                activeTab === 'myQuiz' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              학생목록
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
              className={`tw-absolute tw-left-[35px] tw-top-3 tw-text-base tw-text-center ${
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
              className={`tw-absolute tw-left-[35px] tw-top-3 tw-text-base tw-text-center ${
                activeTab === 'lecture' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              커리큘럼관리
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
                      className="tw-text-xl tw-text-black tw-font-bold"
                    >
                      강의클럽 가입 신청 ({totalElements})
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
                      sm={10}
                      className="tw-text-xl tw-text-black tw-font-bold"
                    >
                      강의클럽 학생 목록 ({totalElementsMember || 0})
                    </Grid>

                    <Grid item container justifyContent="flex-end" xs={6} sm={2} style={{ textAlign: 'right' }}>
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
                  <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6 tw-my-4">
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
                                  // onClick={() => router.push('/quiz-answers/' + `${item?.clubQuizSequence}`)}
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
        {activeTab === 'community' && (
          <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg">
            <div className={cx('content-wrap')}>
              <div className={cx('container')}>
                <div className="tw-flex tw-justify-between tw-items-center tw-relative tw-gap-3">
                  <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">강의 기본정보</div>
                  <button
                    className="tw-w-[150px] border tw-text-gray-500 tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-text-sm tw-rounded"
                    onClick={() => handleSave()}
                  >
                    수정하기
                  </button>
                </div>
                <div className={cx('content-area')}>
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-2">강의명</div>
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
                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 대학</div>
                        <select
                          className="form-select"
                          onChange={handleUniversityChange}
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
                      </div>

                      <div>
                        <div>
                          <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                            추천 학과(다중 선택 가능)
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
                                      추천 대학을 먼저 선택하고, 학과를 선택해주세요.
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
                          강의 시작일
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
                          강의 종료일
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

                    <div className="tw-mb-[12px] tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                      추천 학년
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

                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">언어 설정</div>
                    <div className="tw-grid tw-grid-cols-3 tw-gap-8 tw-py-5">
                      <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                          강의언어
                        </p>
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
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                          콘텐츠언어
                        </p>
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
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                          AI대화언어
                        </p>
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
                    <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">강의 상세정보 입력</div>
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
                </div>

                <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">강의 꾸미기</div>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-5">강의 카드 이미지 선택</div>
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

                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-5">강의 배경 이미지 선택</div>
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

                {previewProfile ? (
                  <img
                    src={previewProfile}
                    alt="Image Preview"
                    className="border tw-w-[100px] tw-h-[100px] tw-rounded-full"
                  />
                ) : (
                  <img
                    src="/assets/images/account/default_profile_image.png"
                    alt="Image"
                    className="tw-w-[100px] tw-h-[100px] tw-rounded-full border"
                  />
                )}

                <div className="tw-text-sm tw-font-bold tw-text-black tw-mt-5 tw-my-5">
                  직접 업로드를 하지 않으면 현재 프로필 이미지 사용합니다.
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
                <button
                  onClick={e => handleProfileDelete(e)}
                  type="button"
                  className="tw-text-black border tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lecture' && (
          <div>
            <article>
              <div className="tw-relative">
                <div className="tw-flex tw-justify-between tw-items-center tw-relative tw-gap-3">
                  <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">강의 커리큘럼</div>
                  <button
                    className="tw-w-[150px] border tw-text-gray-500 tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-text-sm tw-rounded"
                    onClick={() => handleSave()}
                  >
                    수정하기
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
                            {index + 1} 주차
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
                  {/* <div ref={containerRef} style={{ touchAction: 'pan-y' }}>
                      <DraggableList
                        itemKey="studyOrder"
                        template={Item}
                        list={scheduleData}
                        onMoveEnd={newList => _onListChange(newList)}
                        // container={() => containerRef.current}
                      />
                    </div> */}
                </Grid>
              </Grid>

              <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
                <div className="tw-w-1/12 tw-flex tw-justify-center tw-items-center">
                  <div className="tw-w-[59px] tw-h-[46px] tw-relative tw-flex tw-flex-col tw-items-center">
                    <p className="tw-text-base tw-font-bold tw-text-center tw-text-[#ced4de]">주차</p>
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
                          강의주차 추가하기
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
                <div className="tw-absolute tw-bottom-0 tw-right-0">
                  <button
                    onClick={handlerQuizInit}
                    className="tw-flex tw-justify-center tw-items-center tw-w-[124px] tw-relative tw-overflow-hidden tw-gap-2 tw-px-7 tw-py-[11.5px] tw-rounded tw-bg-[#e9ecf2]"
                  >
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-[#6a7380]">
                      초기화
                    </p>
                  </button>
                </div>
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
                        accept=".pdf"
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
                      placeholder="강의자료 URL을 입력해주세요. http://"
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
                          <div className="tw-flex tw-text-sm tw-items-center" style={{ minWidth: '6.1rem' }}>
                            업로드된 파일 :
                          </div>
                          <div className="tw-text-left tw-pl-5 tw-text-sm tw-flex tw-flex-wrap tw-gap-2">
                            {lectureContents.files.map((fileEntry, index) => (
                              <div key={index} className="border tw-px-3 tw-p-1 tw-rounded">
                                <span
                                  onClick={() => {
                                    onFileDownload(fileEntry.fileKey, fileEntry.name);
                                  }}
                                  className="tw-text-blue-600 tw-cursor-pointer"
                                >
                                  {fileEntry?.file?.name || fileEntry.name}
                                </span>
                                <button
                                  className="tw-ml-2 tw-cursor-pointer"
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
                              <div key={index} className="border tw-px-3 tw-p-1 tw-rounded">
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

      <MentorsModal title="퀴즈 등록하기" isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
        <div className="tw-mb-8">
          <div className="tw-grid tw-grid-cols-3 tw-gap-8 tw-pb-4">
            <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">대학</p>
              <select
                className="form-select"
                onChange={handleUniversityChangeQuiz}
                aria-label="Default select example"
                value={universityCodeQuiz}
              >
                <option value="">대학을 선택해주세요.</option>
                {optionsData?.data?.jobs?.map((university, index) => (
                  <option key={index} value={university.code}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">학과</p>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={handleJobChangeQuiz}
                value={selectedJobQuiz}
              >
                <option value="">학과를 선택해주세요.</option>
                {jobs.map((job, index) => (
                  <option key={index} value={job.code}>
                    {job.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">학년</p>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={handleLevelChangeQuiz}
                value={selectedLevel}
              >
                <option value="">레벨을 선택해주세요.</option>
                {optionsData?.data?.jobLevels.map((job, index) => (
                  <option key={index} value={job.code}>
                    {job.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">검색</p>
            <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
              <TextField
                size="small"
                fullWidth
                placeholder="퀴즈 키워드를 입력해주세요."
                onChange={handleInputQuizSearchChange}
                id="margin-none"
                value={quizSearch}
                name="quizSearch"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    searchKeyworld((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>
          </div>

          <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.5);', paddingY: '10px' }} />

          <p className="tw-text-xl tw-font-bold tw-text-left tw-text-black tw-py-5">
            {/* 퀴즈목록 {totalQuizzElements}개 */}
            퀴즈목록 전체 : {totalQuizzElements}개 - (퀴즈선택 : {selectedQuizIds?.length} / {quizList.length})
          </p>
          {quizListData.map((item, index) => (
            <div key={index}>
              <QuizBreakerInfoCheck
                avatarSrc="https://via.placeholder.com/40"
                userName={item.memberNickname}
                questionText={item.question}
                index={item.quizSequence}
                selectedQuizIds={selectedQuizIds}
                handleCheckboxChange={handleCheckboxChange}
                hashtags={['']}
                tags={['소프트웨어융합대학', '컴퓨터공학과', '2학년']}
                answerText={item.modelAnswer}
              />
            </div>
          ))}

          <div className="tw-pt-5">
            <Paginations page={pageQuizz} setPage={setPageQuizz} total={totalQuizzPage} showCount={5} />
          </div>
          <div className="tw-py-10  tw-flex tw-items-center tw-justify-center ">
            <button
              className="tw-px-10 tw-text-sm tw-bg-[#E11837] tw-text-white tw-font-bold tw-py-3 tw-rounded tw-gap-1"
              onClick={() => setIsModalOpen(false)}
            >
              등록하기
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
