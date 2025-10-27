import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { MentorsModal, Pagination, Tag } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { paramProps } from 'src/services/seminars/seminars.queries';
import { useContentJobTypes, useJobGroupss } from 'src/services/code/code.queries';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { UseQueryResult } from 'react-query';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { ExperiencesResponse } from 'src/models/experiences';
import { useOptions } from 'src/services/experiences/experiences.queries';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { useQuizList, useGetSchedule, useGetTemp, useMyQuizContents } from 'src/services/jobs/jobs.queries';
import Checkbox from '@mui/material/Checkbox';
import { useClubQuizContentSave, useClubQuizSave, useClubTempSave } from 'src/services/quiz/quiz.mutations';
import { useUploadImage } from 'src/services/image/image.mutations';
import { makeStyles } from '@mui/styles';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigatePrevIcon from '@mui/icons-material/NavigateBefore';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import QuizBreakerInfo from 'src/stories/components/QuizBreakerInfo';
import QuizBreakerInfoCheck from 'src/stories/components/QuizBreakerInfoCheck';
import QuizClubDetailInfo from 'src/stories/components/QuizClubDetailInfo';
/** drag list */
import ReactDragList from 'react-drag-list';
import { useStore } from 'src/store';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Toggle } from 'src/stories/components';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { Button, Modal } from 'src/stories/components';
//group
import { dayGroup, feedbackGroup, openGroup, images, scheduleDataDummy, imageBanner } from './group';
import { v4 as uuidv4 } from 'uuid';
export const generateUUID = () => {
  return uuidv4();
};

import { useSessionStore } from 'src/store/session';
import { useGetGroupLabel } from 'src/hooks/useGetGroupLabel';
import QuizBreakerInfoCheckContent from 'src/stories/components/QuizBreakerInfoContentCheck';

const cx = classNames.bind(styles);

export function QuizOpenTemplate() {
  const { jobGroupLabelType } = useSessionStore.getState();
  const { groupLabel, subGroupLabel } = useGetGroupLabel(jobGroupLabelType);

  const [startDay, setStartDay] = React.useState<Dayjs | null>(dayjs());
  const [endDay, setEndDay] = React.useState<Dayjs | null>(dayjs().add(4, 'month'));
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalContentPage, setTotalContentPage] = useState(1);
  const [contentPage, setContentPage] = useState(1);
  const [contentKeyWorld, setContentKeyWorld] = useState('');
  const [totalQuizPage, setTotalQuizPage] = useState(1);
  const [participationCode, setParticipationCode] = useState('');
  const [jobGroups, setJobGroups] = useState<any[]>([]);
  const [paramss, setParamss] = useState({});
  const [params, setParams] = useState<any>({});
  const [contentParams, setContentParams] = useState<any>({});
  const [quizPage, setQuizPage] = useState(1);
  const [quizParams, setQuizParams] = useState<any>({ quizPage, sortType: 'DESC' });
  const [dayParams, setDayParams] = useState<any>({});
  const [myParams, setMyParams] = useState<paramProps>({ page });
  const [quizListParam, setQuizListParam] = useState<any[]>([]);
  const [quizListData, setQuizListData] = useState<any[]>([]);
  const [contentListData, setContentListData] = useState<any[]>([]);
  const [allQuizData, setAllQuizData] = useState([]);
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [scheduleSaveData, setScheduleSaveData] = useState<any[]>([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [selectedUniversityNameQuiz, setSelectedUniversityNameQuiz] = useState('');
  const [selectedUniversityNameContent, setSelectedUniversityNameContent] = useState('');
  const [selectedJobName, setSelectedJobName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [jobs, setJobs] = useState([]);
  const [jobsQuiz, setJobsQuiz] = useState([]);
  const [jobsContent, setJobsContent] = useState([]);
  const [selectedJob, setSelectedJob] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalContentElements, setTotalContentElements] = useState(0);
  const [buttonFlag, setButtonFlag] = useState(false);
  const [personName, setPersonName] = useState([]);
  const [personNameQuiz, setPersonNameQuiz] = useState([]);
  const [personNameContent, setPersonNameContent] = useState([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageCheck, setSelectedImageCheck] = useState(null);
  const [selectedImageBanner, setSelectedImageBanner] = useState('');
  const [selectedImageBannerCheck, setSelectedImageBannerCheck] = useState(null);
  const [selectedImageProfile, setSelectedImageProfile] = useState('/assets/images/account/default_profile_image.png');
  const [selectedImageProfileCheck, setSelectedImageProfileCheck] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // 함수가 실행 중인지 확인하는 상태
  const [selectedOption, setSelectedOption] = useState('true');
  const [skillIdsPopUp, setSkillIdsPopUp] = useState<any[]>([]);
  const [experienceIdsPopUp, setExperienceIdsPopUp] = useState<any[]>([]);
  const [isPublic, setIsPublic] = useState('0001');
  const [studyKeywords, setStudyKeywords] = useState([]);
  const [studyChapter, setStudyChapter] = useState('');
  const [studySubject, setStudySubject] = useState('');
  const [optionsSkills, setOptionsSkills] = useState<string[]>([]);
  const [universityCodeQuiz, setUniversityCodeQuiz] = useState<string>('');
  const [universityCodeContent, setUniversityCodeContent] = useState<string>('');
  const [contentUniversityCodeQuiz, setContentUniversityCodeQuiz] = useState<string>('');
  const [selectedJobQuiz, setSelectedJobQuiz] = useState<string[]>([]);
  const [selectedJobContent, setSelectedJobContent] = useState<string[]>([]);
  const [contentSelectedJobQuiz, setContentSelectedJobQuiz] = useState<string[]>([]);
  const [contentSelectedLevel, setContentSelectedLevel] = useState<string>('');
  const [agreements, setAgreements] = useState(true);
  const [order, setOrder] = useState(null);
  const [eachMaxQuizLength, setEachMaxQuizLength] = useState(null);
  const [keyWorld, setKeyWorld] = useState('');
  const [myKeyWorld, setMyKeyWorld] = useState('');
  const [answerExposureType, setAnswerExposureType] = useState('0100');
  const [answerPublishType, setAnswerPublishType] = useState('0002');
  const [comprehensiveEvaluationMinimumCount, setComprehensiveEvaluationMinimumCount] = useState(1);
  const [introductionText, setIntroductionText] = useState<string>('');
  const [recommendationText, setRecommendationText] = useState<string>('');
  const [learningText, setLearningText] = useState<string>('');
  const [memberIntroductionText, setMemberIntroductionText] = useState<string>('');
  const [careerText, setCareerText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenKnowledgeContent, setIsModalOpenKnowledgeContent] = useState<boolean>(false);
  const [selectedQuizIds, setSelectedQuizIds] = useState([]);
  const [selectedContentIds, setSelectedContentIds] = useState([]);
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [isModalContentOpen, setIsModalContentOpen] = useState<boolean>(false);

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

  const handleChange = event => {
    console.log('test', event.target.value);
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    handleImageClick(selectedImageProfile, 'profile', false);
  }, []);

  const { data: optionsData }: UseQueryResult<ExperiencesResponse> = useOptions();

  useEffect(() => {
    setOptionsSkills(optionsData?.data?.skills || []);
  }, [optionsData]);

  // 퀴즈 목록 조회 (모달에서만 호출)
  const { isFetched: isQuizData, refetch: refetchQuizList } = useQuizList(params, data => {
    console.log('quiz data', data.contents);
    setQuizListData(data.contents || []);
    setTotalElements(data.totalElements);
    setTotalPage(data.totalPages);
  });

  // 지식콘텐츠기반 퀴즈(AI생성) 일괄 등록 (모달에서만 호출)
  const { data: myQuizContentData, refetch: refetchMyQuizContent }: UseQueryResult<any> = useMyQuizContents(
    contentParams,
    data => {
      console.log(data.contents);
      setContentListData(data.contents || []);
      setTotalContentElements(data.totalElements);
      setTotalContentPage(data.totalPages);
    },
  );

  //get schedule
  const { refetch: refetchGetSchedule, isSuccess: isScheduleSuccess }: UseQueryResult<any> = useGetSchedule(
    dayParams,
    data => {
      console.log('schedule data', data);
      setScheduleData(data);
    },
  );

  useEffect(() => {
    if (isScheduleSuccess) {
      alert('퀴즈 생성(오픈) 주기 설정이 완료되었습니다.');
    }
  }, [isScheduleSuccess]);

  //temp 조회
  const { refetch: refetchGetTemp }: UseQueryResult<any> = useGetTemp(data => {
    console.log('load temp', data);

    if (data) {
      const clubForm = data?.form || {};
      const quizList = data?.clubQuizzes || [];

      const quizListData = quizList.map(item => {
        if (item.quizSequence < 0) {
          return {
            order: item.order,
            weekNumber: item.order, // Assuming weekNumber should match the order as per your example
            quizSequence: null,
            publishDate: item.publishDate, // Preserve original publishDate if it exists
            dayOfWeek: item.dayOfWeek,
          };
        }
        return item;
      });

      console.log('quizListData', quizListData);

      setClubName(clubForm.clubName || '');
      setIntroductionText(clubForm.introductionText || '');
      setRecommendationText(clubForm.recommendationText || '');
      setLearningText(clubForm.learningText || '');
      setMemberIntroductionText(clubForm.memberIntroductionText || '');
      setCareerText(clubForm.careerText || '');
      setSkills(clubForm.skills || []);
      setOptionsSkills(prevState => Array.from(new Set([...prevState, ...(clubForm?.skills || [])])));
      const extractedCodes = clubForm.jobLevels?.map(item => item.code);
      setRecommendLevels(extractedCodes || []);
      setNum(clubForm.weekCount || 0);
      setQuizType(clubForm.quizOpenType || '');
      setStartDay(clubForm.startAt ? dayjs(clubForm.startAt) : dayjs());
      setEndDay(clubForm.endAt ? dayjs(clubForm.endAt) : dayjs().add(4, 'month'));
      setStudyKeywords(clubForm.studyKeywords || []);
      // setStudyChapter(clubForm.studyChapter || '');
      setStudySubject(clubForm.studySubject || '');
      setNum(clubForm.studyCount || '');
      setStudyCycleNum(clubForm.studyCycle || 0);
      setUniversityCode(clubForm?.jobGroups?.[0]?.code || '');
      setSelectedUniversityName(clubForm?.jobGroups?.[0]?.name || '');
      setSelectedJobName(clubForm.jobs?.[0]?.name || '');
      setJobLevelName(clubForm.jobLevels?.[0]?.name || '');
      setLevelNames(clubForm.jobLevels?.map(item => item.name));
      const selected = optionsData?.data?.jobs?.find(u => u.code === clubForm.jobGroups?.[0]?.code);
      setJobs(selected ? selected.jobs : []);
      const jobsCode = clubForm.jobs?.map(item => item.code);
      setSelectedJob(jobsCode || []);
      const jobsName = clubForm.jobs?.map(item => item.name);
      console.log(jobsName);
      setPersonName(jobsName || []);
      setButtonFlag(true);
      // setScheduleData(quizList);
      setScheduleData(quizListData);
      setAgreements(clubForm.useCurrentProfileImage);
      setSelectedOption(data?.isRepresentativeQuizPublic?.toString());
      setFeedbackType(clubForm.feedbackType);
      setAnswerExposureType(clubForm.answerExposureType);
      setAnswerPublishType(clubForm.answerPublishType);
      setComprehensiveEvaluationMinimumCount(clubForm.comprehensiveEvaluationMinimumCount);
      // Filter out items with quizSequence not null and greater than or equal to zero, then extract quizSequence values
      const quizSequenceNumbers = quizList
        .filter(item => item.quizSequence !== null && item.quizSequence >= 0)
        .map(item => item.quizSequence);

      setSelectedQuizIds(quizSequenceNumbers);

      setPreview(clubForm.clubImageUrl);
      setPreviewBanner(clubForm.backgroundImageUrl);
      setPreviewProfile(clubForm.instructorProfileImageUrl);

      setSelectedImage('');
      setSelectedImageBanner('');
      // setSelectedImageProfile('');
    } else {
      alert('임시저장 데이터가 없습니다. 임시저장을 해주세요.');
    }
  });

  //temp 등록
  const { mutate: onTempSave, isSuccess: tempSucces } = useClubTempSave();
  const {
    mutate: onClubQuizSave,
    isError,
    isSuccess: clubSuccess,
    data: clubDatas,
    isError: clubError,
  } = useClubQuizSave();
  const {
    mutate: onClubQuizContentSave,
    isError: clubQuizContentError,
    isSuccess: clubQuizContentSuccess,
    data: clubQuizContentDatas,
  } = useClubQuizContentSave();

  const { mutate: onSaveImage, data: imageUrl, isSuccess: imageSuccess } = useUploadImage();
  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const handleAnswerExposureTypeChange = event => {
    setAnswerExposureType(event.target.value);
  };

  const handleAnswerPublishTypeChange = event => {
    setAnswerPublishType(event.target.value);
  };

  useEffect(() => {
    if (clubError) {
      setIsProcessing(false);
    }
  }, [clubError]);

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

  useEffect(() => {
    if (Object.keys(dayParams).length > 0) {
      console.log('start');
      refetchGetSchedule();
    }
  }, [dayParams]);

  useDidMountEffect(() => {
    setParams({
      page,
      keyword: keyWorld,
      jobGroups: universityCodeQuiz,
      jobs: selectedJobQuiz.toString(),
      jobLevels: selectedLevel,
    });
  }, [page, keyWorld, universityCodeQuiz, selectedJobQuiz, selectedLevel]);

  useDidMountEffect(() => {
    setContentParams({
      page: contentPage,
      keyword: contentKeyWorld,
      jobGroups: contentUniversityCodeQuiz,
      jobs: contentSelectedJobQuiz.toString(),
      jobLevels: contentSelectedLevel,
    });
  }, [contentPage, contentKeyWorld, contentUniversityCodeQuiz, contentSelectedJobQuiz, contentSelectedLevel]);

  useEffect(() => {
    setMyParams({
      // ...params,
      page,
      keyword: myKeyWorld,
    });
  }, [myKeyWorld]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageUrl = `${process.env.NEXT_PUBLIC_GENERAL_URL}${selectedImage}`;
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        const data = await response.blob();
        const ext = selectedImage.split('.').pop(); // Extract extension from the selectedImage
        const filename = selectedImage.split('/').pop(); // Extract filename from the selectedImage
        const metadata = { type: `image/${ext}` };
        const imageFile = new File([data], filename, metadata);
        onSaveImage(imageFile);
      } catch (error) {
        console.error('Error fetching or saving image:', error);
      }
    };

    if (selectedImage) {
      fetchImage();
    }
  }, [selectedImage, onSaveImage]);

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
  };

  const handleChangesQuiz = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    const jobsList = typeof value === 'string' ? value.split(',') : value;
    setPersonNameQuiz(jobsList);

    // Convert selected names to corresponding codes
    const selectedCodes = jobsList
      .map(name => {
        const job = jobsQuiz.find(job => job.name === name);
        return job ? job.code : null;
      })
      .filter(code => code !== null);

    setSelectedJobQuiz(selectedCodes);
  };

  const handleChangesContent = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    const jobsList = typeof value === 'string' ? value.split(',') : value;
    setPersonNameContent(jobsList);

    // Convert selected names to corresponding codes
    const selectedUniversity = optionsData?.data?.jobs?.find(u => u.code === contentUniversityCodeQuiz);
    const selectedCodes = jobsList
      .map(name => {
        const job = selectedUniversity?.jobs?.find(job => job.name === name);
        return job ? job.code : null;
      })
      .filter(code => code !== null);

    setContentSelectedJobQuiz(selectedCodes);
  };

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  // 파일 이름 추출 함수
  const extractFileName = path => {
    const parts = path.split('/');
    return parts[parts.length - 1];
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
        // setSelectedImageProfile();
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

  const handleQuizType = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    if (newFormats) {
      setScheduleData([]);
      setNum(0);
      setSelectedQuizIds([]);
      setStudyCycleNum([]);
      setQuizType(newFormats);
    }
  };
  const handleFeedbackType = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    setFeedbackType(newFormats);
  };

  const handleStudyCycle = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setStudyCycleNum(newFormats);
  };

  const handleIsPublic = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    setIsPublic(newFormats);
    console.log(newFormats);
    if (newFormats === '0002') {
      setIsPublic('0002');
    }
  };

  // 퀴즈 개별등록하기
  const handleAddClick = order => {
    setOrder(order);
    setEachMaxQuizLength(selectedQuizIds.length + 1);
    if (scheduleData.length >= 1) {
      setIsModalOpen(true);
      refetchQuizList();
      // 퀴즈 목록 조회는 React Query가 자동으로 처리
    } else {
      alert('퀴즈 생성 주기를 입력해주세요.');
    }
  };

  // 지식콘텐츠기반 퀴즈(AI생성) 일괄 등록
  const handleAddClickKnowledgeContent = order => {
    setOrder(order);
    setEachMaxQuizLength(selectedQuizIds.length + 1);
    if (scheduleData.length >= 1) {
      setIsModalOpenKnowledgeContent(true);
      // 지식콘텐츠기반 퀴즈(AI생성) 일괄 등록 API 호출
      refetchMyQuizContent();
    } else {
      alert('퀴즈 생성 주기를 입력해주세요.');
    }
  };

  // 지식콘텐츠 체크박스 변경 핸들러
  const handleContentCheckboxChange = contentSequence => {
    const maxContentCount = scheduleData.length; // 최대 선택 가능한 개수는 scheduleData.length
    const nullQuizSequenceCount = scheduleData.filter(item => item.quizSequence === null).length;

    setSelectedContentIds(prevSelectedContentIds => {
      const isCurrentlySelected = prevSelectedContentIds.includes(contentSequence);

      if (isCurrentlySelected) {
        // 이미 선택된 경우 해제
        const newSelectedContentIds = prevSelectedContentIds.filter(id => id !== contentSequence);

        // scheduleData에서 해당 콘텐츠 제거
        console.log('콘텐츠 해제 - contentSequence:', contentSequence);
        setScheduleData(prevScheduleData => {
          const updatedScheduleData = prevScheduleData.map(item =>
            item.contentSequence === contentSequence
              ? {
                  ...item,
                  quizSequence: null,
                  contentSequence: null,
                  contentTitle: null,
                  contentName: null,
                  contentUrl: null,
                }
              : item,
          );
          console.log('해제 후 scheduleData 업데이트:', updatedScheduleData);
          return updatedScheduleData;
        });

        return newSelectedContentIds;
      } else {
        // 선택하려는 경우 최대 개수 확인 (퀴즈와 지식콘텐츠 합계)
        const totalSelectedCount = getTotalSelectedCount();
        if (totalSelectedCount >= maxContentCount) {
          alert(`퀴즈와 지식콘텐츠는 총 ${maxContentCount}개까지만 선택할 수 있습니다.`);
          return prevSelectedContentIds;
        }

        // 선택 가능한 경우 추가
        const newSelectedContentIds = [...prevSelectedContentIds, contentSequence];

        // scheduleData에 콘텐츠 정보 추가
        const selectedContent = contentListData.find(content => content.contentSequence === contentSequence);
        if (selectedContent) {
          const firstNullItemIndex = scheduleData.findIndex(
            item => item.quizSequence === null && item.contentSequence === null,
          );

          console.log('콘텐츠 선택 - 빈 슬롯 인덱스:', firstNullItemIndex);
          console.log('선택된 콘텐츠:', selectedContent);

          if (firstNullItemIndex !== -1) {
            setScheduleData(prevScheduleData => {
              const updatedScheduleData = [...prevScheduleData];
              updatedScheduleData[firstNullItemIndex] = {
                ...updatedScheduleData[firstNullItemIndex],
                contentSequence: contentSequence,
                contentTitle: selectedContent.name,
                contentName: selectedContent.name,
                contentUrl: selectedContent.url || '',
                quizSequence: null, // 지식콘텐츠는 퀴즈가 아니므로 null
              };
              console.log('업데이트된 scheduleData:', updatedScheduleData[firstNullItemIndex]);
              return updatedScheduleData;
            });
          } else {
            console.log('빈 슬롯을 찾을 수 없습니다.');
          }
        }

        return newSelectedContentIds;
      }
    });
  };

  // 통합된 선택 개수 계산
  const getTotalSelectedCount = () => {
    const selectedQuizCount = selectedQuizIds.length;
    const selectedContentCount = selectedContentIds.length;
    return selectedQuizCount + selectedContentCount;
  };

  //new logic
  const handleCheckboxChange = quizSequence => {
    console.log('order', order);
    console.log('eachMaxQuizLength', eachMaxQuizLength);
    console.log('selectedQuizIds', selectedQuizIds.length);

    const nullQuizSequenceCount = scheduleData.filter(item => item.quizSequence === null).length;

    if (order) {
      const existingOrderQuiz = scheduleData.find(item => item.order === order && item.quizSequence !== null);

      // 이미 다른 퀴즈가 매핑된 경우 경고창 표시 및 기존 선택 해제
      if (
        existingOrderQuiz &&
        existingOrderQuiz.quizSequence !== quizSequence &&
        !selectedQuizIds.includes(quizSequence)
      ) {
        alert('퀴즈가 이미 선택되었습니다. 이전 퀴즈를 취소해주세요.');
        setSelectedQuizIds(prevSelectedQuizIds => prevSelectedQuizIds.filter(id => id !== quizSequence));
        setScheduleData(prevSelectedQuizzes =>
          prevSelectedQuizzes.map(quiz =>
            quiz.quizSequence === quizSequence ? { ...quiz, quizSequence: null } : quiz,
          ),
        );
        return;
      }
    }

    if (!selectedQuizIds.includes(quizSequence) && nullQuizSequenceCount <= 0) {
      alert('퀴즈를 추가 할 수 없습니다.');
      return;
    }

    setSelectedQuizIds(prevSelectedQuizIds => {
      const updatedSelectedQuizIds = prevSelectedQuizIds.includes(quizSequence)
        ? prevSelectedQuizIds.filter(id => id !== quizSequence)
        : [...prevSelectedQuizIds, quizSequence];

      setScheduleData(prevSelectedQuizzes => {
        if (!Array.isArray(prevSelectedQuizzes)) {
          return [];
        }

        console.log('nullQuizSequenceCount', nullQuizSequenceCount, selectedQuizIds.length);

        const alreadySelected = prevSelectedQuizzes.some(quiz => quiz.quizSequence === quizSequence);

        if (alreadySelected) {
          // unchecked 시 quizSequence null 처리
          return prevSelectedQuizzes.map(quiz =>
            quiz.quizSequence === quizSequence ? { ...quiz, quizSequence: null } : quiz,
          );
        } else {
          const newQuiz = allQuizData.find(quiz => quiz.quizSequence === quizSequence);
          const reconstructedQuiz = newQuiz
            ? {
                quizSequence: newQuiz.quizSequence,
                question: newQuiz.question,
                member: {
                  leaderUri: newQuiz.memberUri,
                  leaderUUID: newQuiz.memberUUID,
                  profileImageUrl: newQuiz.memberProfileImageUrl,
                  nickname: newQuiz.memberNickname,
                },
                contentTitle: newQuiz.contentTitle,
                modelAnswer: newQuiz.modelAnswer,
                contentName: newQuiz.content.name,
                contentUrl: newQuiz.content.url,
                quizUri: newQuiz.quizUri,
              }
            : null;

          console.log(newQuiz);
          console.log(reconstructedQuiz);

          let firstNullItemIndex;
          if (order) {
            firstNullItemIndex = scheduleData.findIndex(item => item.order === order);
          } else {
            firstNullItemIndex = scheduleData.findIndex(item => item.quizSequence === null);
          }

          if (firstNullItemIndex !== -1 && newQuiz) {
            const updatedScheduleData = [...scheduleData];
            updatedScheduleData[firstNullItemIndex] = {
              ...updatedScheduleData[firstNullItemIndex],
              ...reconstructedQuiz,
            };
            console.log(updatedScheduleData);
            setScheduleData(updatedScheduleData);
            return updatedScheduleData;
          }
        }

        // 통합된 개수 제한 확인 (퀴즈와 지식콘텐츠 합계)
        const totalSelectedCount = getTotalSelectedCount();
        if (totalSelectedCount >= scheduleData.length) {
          alert(`퀴즈와 지식콘텐츠는 총 ${scheduleData.length}개까지만 선택할 수 있습니다.`);
          return;
        }
      });
      return updatedSelectedQuizIds;
    });
  };

  const handleCheckboxDelete = quizSequence => {
    setSelectedQuizIds(prevSelectedQuizIds => {
      const updatedSelectedQuizIds = prevSelectedQuizIds.filter(id => id !== quizSequence);
      console.log('After Deletion, Selected Quiz IDs:', updatedSelectedQuizIds);
      setScheduleData(prevSelectedQuizzes =>
        prevSelectedQuizzes.map(quiz => (quiz.quizSequence === quizSequence ? { ...quiz, quizSequence: null } : quiz)),
      );
      return updatedSelectedQuizIds;
    });
  };

  const [jobLevelName, setJobLevelName] = useState([]);
  const [jobGroupPopUp, setJobGroupPopUp] = useState([]);
  const [studyCycleNum, setStudyCycleNum] = useState([]);
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [skills, setSkills] = useState([]);
  const [universityCode, setUniversityCode] = useState<string>('');
  const [levelNames, setLevelNames] = useState([]);

  const [quizType, setQuizType] = useState('0100');
  const [feedbackType, setFeedbackType] = useState('0100');
  const [recommendLevelsPopUp, setRecommendLevelsPopUp] = useState([]);
  const [clubName, setClubName] = useState<string>('');
  const [num, setNum] = useState(0);
  const [active, setActive] = useState(0);
  const { isFetched: isJobGroupsFetched } = useJobGroupss(data => setJobGroups(data.data.contents || []));
  const { user, setUser } = useStore();

  useEffect(() => {
    if (active == 0) {
      // refetch();
    } else if (active == 1) {
      setQuizUrl('');
      setQuizName('');
      setJobGroupPopUp([]);
      setJobs([]);
      setRecommendLevelsPopUp([]);
      setSkillIdsPopUp([]);
      setExperienceIdsPopUp([]);
    } else if (active == 2) {
      // refetchMyJob();
    }
  }, [active]);

  const steps = ['Step 1.클럽 세부사항 설정', 'Step 2.퀴즈 선택', 'Step 3. 개설될 클럽 미리보기'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [quizUrl, setQuizUrl] = React.useState('');
  const [quizName, setQuizName] = React.useState('');
  // const [keyWorld, setKeyWorld] = React.useState('');

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNextTwo = () => {
    window.scrollTo(0, 0);
    console.log('next');
    console.log(scheduleData);

    const newData = [...scheduleData];
    const nullQuizSequences = scheduleData
      .map((item, index) => (item.quizSequence === null ? index + 1 : null))
      .filter(index => index !== null);

    if (nullQuizSequences.length > 0) {
      alert(`${nullQuizSequences.join(', ')} 번째 퀴즈를 등록해주세요.`);
      return;
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };
  const [updateKey, setUpdateKey] = useState(0); // 상태 업데이트 강제 트리거를 위한 키
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

    const mergeData = sortedReducedData.map((item, index) => ({
      ...item,
      quizSequence: scheduleMap[index].quizSequence,
      question: scheduleMap[index].question,
      member: {
        leaderUri: scheduleMap[index].leaderUri,
        leaderUUID: scheduleMap[index].memberUUID,
        profileImageUrl: scheduleMap[index].member?.profileImageUrl,
        nickname: scheduleMap[index].member?.nickname,
      },
      contentUrl: scheduleMap[index].contentUrl,
      contentTitle: scheduleMap[index].contentTitle,
      modelAnswer: scheduleMap[index].modelAnswer,
      quizUri: scheduleMap[index].quizUri,
    }));

    setScheduleData(mergeData);
  };

  useEffect(() => {
    console.log('scheduleData가 업데이트되었습니다.', scheduleData);
    setUpdateKey(prevKey => prevKey + 1);
  }, [scheduleData]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setOptionsSkills(prevState => [...prevState, inputValue.trim()]);
      setInputValue(''); // Clear the input
    }
  };

  const handleAddInput = () => {
    if (inputValue.trim() !== '') {
      setOptionsSkills(prevState => [...prevState, inputValue.trim()]);
      setInputValue(''); // Clear the input
    }
  };

  const dragList = (item: any, index: any) => (
    <div key={item.order} className="simple-drag-row">
      <QuizBreakerInfo
        isDeleteQuiz={true}
        avatarSrc={
          item.leaderProfileImageUrl ||
          item?.member?.profileImageUrl ||
          '/assets/images/account/default_profile_image.png'
        }
        userName={item.leaderNickname || item?.member?.nickname}
        questionText={item.question}
        index={item.quizSequence !== undefined ? item.quizSequence : null}
        order={item.order}
        answerText={item.modelAnswer}
        handleCheckboxDelete={handleCheckboxDelete}
        handleAddClick={handleAddClick}
        publishDate={item.publishDate}
        dayOfWeek={item.dayOfWeek}
        isPublished={item.isPublished}
        knowledgeContentTitle={item?.contentName}
      />
    </div>
  );

  const handleNextThree = () => {
    if (isProcessing) return; // 이미 함수가 실행 중이면 종료
    setIsProcessing(true); // 함수가 실행 중임을 표시
    console.log('NextLast');
    console.log(quizListParam);
    const params = { ...paramss, clubQuizzes: scheduleData };
    console.log(params);

    const formData = new FormData();
    formData.append('clubId', 'quiz_club_' + generateUUID());
    formData.append('form.clubName', params.clubForm.clubName);
    formData.append('form.answerExposureType', params.clubForm.answerExposureType);
    formData.append('form.answerPublishType', params.clubForm.answerPublishType);
    formData.append('form.feedbackType', params.clubForm.feedbackType);
    formData.append('form.jobGroups', params.clubForm.jobGroups.toString());
    formData.append('form.jobs', params.clubForm.jobs.toString());
    formData.append('form.jobLevels', params.clubForm.jobLevels.toString());
    formData.append('form.isPublic', params.clubForm.isPublic.toString());
    if (params.clubForm.participationCode !== '') {
      formData.append('form.participationCode', params.clubForm.participationCode);
    }
    formData.append('form.quizOpenType', params.clubForm.quizOpenType);
    formData.append('form.studyCycle', params.clubForm.studyCycle.toString());
    formData.append('form.startDate', params.clubForm.startAt);
    formData.append('form.endDate', params.clubForm.endAt);
    formData.append('form.studyCount', params.clubForm.studyCount.toString());
    formData.append('form.studySubject', params.clubForm.studySubject);
    formData.append('form.studyKeywords', params.clubForm.studyKeywords.toString());
    formData.append('form.skills', params.clubForm.skills.toString());
    formData.append('form.introductionText', params.clubForm.introductionText);
    formData.append('form.recommendationText', params.clubForm.recommendationText);
    formData.append('form.learningText', params.clubForm.learningText);
    formData.append('form.memberIntroductionText', params.clubForm.memberIntroductionText);
    formData.append('form.careerText', params.clubForm.careerText);
    formData.append('form.useCurrentProfileImage', params.clubForm.useCurrentProfileImage);
    formData.append('isRepresentativeQuizPublic', selectedOption);

    if (selectedImage) {
      console.log('selectedImage', selectedImage);
      formData.append('form.clubImageFile', selectedImageCheck);
    }
    if (selectedImageBanner) {
      formData.append('form.backgroundImageFile', selectedImageBannerCheck);
    }
    if (selectedImageProfile) {
      formData.append('form.instructorProfileImageFile', selectedImageProfileCheck);
    }

    for (let i = 0; i < scheduleData.length; i++) {
      const item = scheduleData[i];
      formData.append(`clubQuizzes[${i}].quizSequence`, item.quizSequence || '');
      formData.append(`clubQuizzes[${i}].publishDate`, item.publishDate || '');
    }

    onClubQuizSave(formData);
  };

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#D8ECFF',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#D8ECFF',
      color: '#478AF5',
      fontSize: '11px',
    },
  }));

  const handleNextOne = () => {
    window.scrollTo(0, 0);

    const _selectedUniversityCode =
      optionsData?.data?.jobs?.find(u => u.code === selectedUniversity)?.code || universityCode;
    setUniversityCode(_selectedUniversityCode);
    console.log(jobs);
    console.log('selectedJob', selectedJob);
    console.log('preview', preview);

    const clubFormParams = {
      clubName: clubName,
      clubImageUrl: preview,
      jobGroups: [_selectedUniversityCode],
      jobs: selectedJob,
      jobLevels: recommendLevels,
      isPublic: true,
      participationCode: participationCode,
      studyCycle: studyCycleNum,
      startAt: startDay.format('YYYY-MM-DD'),
      endAt: endDay.format('YYYY-MM-DD'),
      studyCount: num,
      studySubject: studySubject,
      studyChapter: studyChapter,
      skills: skills,
      introductionText: introductionText,
      recommendationText: recommendationText,
      learningText: learningText,
      memberIntroductionText: memberIntroductionText,
      careerText: careerText,
      studyKeywords: studyKeywords,
      quizOpenType: quizType,
      description: '',
      clubTemplatePublishType: '0001',
      clubRecruitType: '0100',
      useCurrentProfileImage: agreements,
      instructorProfileImageUrl: previewProfile,
      feedbackType: feedbackType,
      answerExposureType: answerExposureType,
      answerPublishType: answerPublishType,
    };

    //scheduleData null insert
    const updatedData = scheduleData.map(item => ({
      ...item,
      ...(item.quizSequence === undefined && { quizSequence: null }),
    }));
    setScheduleData(updatedData);

    const params = {
      clubForm: clubFormParams,
      clubQuizzes: scheduleData,
    };
    console.log(params);
    console.log(scheduleData);

    setParamss(params);
    console.log(quizType);
    console.log('next', params);

    if (num == 0) {
      alert('클럽퀴즈 회차를 입력 해주세요.');
      return;
    }

    if (clubName === '') {
      alert('클럽 이름을 입력해주세요.');
      return;
    }

    const startAt = startDay ? startDay.format('YYYY-MM-DD') : '';
    const endAt = endDay ? endDay.format('YYYY-MM-DD') : '';

    if (startAt === endAt) {
      alert('시작일과 종료일이 같습니다.');
      return false;
    }

    if (startAt > endAt) {
      alert('종료일이 시작일보다 앞에 있습니다.');
      return false;
    }

    if (quizType == '0100') {
      if (studyCycleNum.length === 0) {
        alert('요일을 입력해주세요.');
        return;
      }
      if (buttonFlag == false) {
        alert('클럽퀴즈 회차 입력의 확인버튼을 눌러주세요. ');
        return;
      }
    } else if (quizType == '0200' || quizType == '0300') {
      if (buttonFlag == false) {
        alert('클럽퀴즈 회차 입력 후 확인 버튼 눌러주세요.');
        return;
      }
    }

    let newSkipped = skipped;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleInputStudySubjectChange = event => {
    setStudySubject(event.target.value);
  };
  const handleInputChange = event => {
    setClubName(event.target.value);
  };

  const handleNumChange = event => {
    setNum(event.target.value);
  };

  const handleInputQuizSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    searchKeyworld(event.target.value);
    setQuizSearch(event.target.value);
  };

  const onMessageChange1 = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setIntroductionText(value);
  };
  const onMessageChange2 = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setRecommendationText(value);
  };
  const onMessageChange3 = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setLearningText(value);
  };
  const onMessageChange4 = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setMemberIntroductionText(value);
  };
  const onMessageChange5 = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setCareerText(value);
  };

  const handlerClubTemp = async () => {
    await refetchGetTemp();
  };

  const handlerQuizInit = async () => {
    const newData = scheduleData.map(item => ({
      ...item,
      quizSequence: null,
      quizUri: null,
      leaderUUID: null,
      leaderUri: null,
      leaderNickname: null,
      leaderProfileImageUrl: null,
      question: null,
      modelAnswer: null,
      contentTitle: null,
      contentUrl: null,
    }));

    setScheduleData(newData);
    setSelectedQuizIds([]);
  };

  const handlerClubSaveTemp = () => {
    if (!clubName) {
      alert('클럽 이름을 입력해주세요');
      return false;
    }

    if (!universityCode) {
      alert('추천 ' + groupLabel + '을 선택해주세요');
      return false;
    }

    if (quizType === '0100') {
      if (studyCycleNum.length === 0) {
        alert('퀴즈 주기를 선택해주세요');
        return false;
      }
    }

    if (num == 0) {
      alert('클럽퀴즈 회차를 입력 해주세요.');
      return false;
    }

    if (!preview) {
      alert('클럽 카드 이미지를 선택해주세요.');
      return false;
    }
    if (!previewBanner) {
      alert('클럽 배경 이미지를 선택해주세요.');
      return false;
    }

    const startAt = startDay ? startDay.format('YYYY-MM-DD') : '';
    const endAt = endDay ? endDay.format('YYYY-MM-DD') : '';

    if (startAt === endAt) {
      alert('시작일과 종료일이 같습니다.');
      return false;
    }

    if (startAt > endAt) {
      alert('종료일이 시작일보다 앞에 있습니다.');
      return false;
    }

    const clubFormParams = {
      clubName: clubName || '',
      clubImageUrl: imageUrl || '',
      jobGroups: [universityCode] || [],
      jobs: selectedJob || [],
      jobLevels: recommendLevels || [],
      isPublic: true,
      participationCode: '',
      studyCycle: studyCycleNum || '',
      startAt: startDay ? startDay.format('YYYY-MM-DD') : '',
      endAt: endDay ? endDay.format('YYYY-MM-DD') : '',
      studyCount: num,
      studySubject: studySubject || '',
      studyChapter: studyChapter || '',
      skills: skills || '',
      introductionText: introductionText || '',
      recommendationText: recommendationText || '',
      learningText: learningText || '',
      memberIntroductionText: memberIntroductionText || '',
      careerText: careerText || '',
      studyKeywords: studyKeywords || '',
      quizOpenType: quizType,
      description: '',
      clubTemplatePublishType: '0001',
      clubRecruitType: '0100',
      useCurrentProfileImage: agreements,
      feedbackType: feedbackType,
      answerExposureType: answerExposureType,
      answerPublishType: answerPublishType,
      representativeQuizUse: selectedOption === 'true' ? true : false,
      comprehensiveEvaluationMinimumCount: comprehensiveEvaluationMinimumCount,
    };

    const formData = new FormData();
    formData.append('clubId', 'quiz_club_' + generateUUID());
    formData.append('form.clubName', clubFormParams.clubName);
    formData.append('form.jobGroups', clubFormParams.jobGroups.toString());
    formData.append('form.jobs', clubFormParams.jobs.toString());
    formData.append('form.jobLevels', clubFormParams.jobLevels.toString());
    formData.append('form.isPublic', clubFormParams.isPublic.toString());
    formData.append('form.feedbackType', clubFormParams.feedbackType);
    if (clubFormParams.participationCode !== '') {
      formData.append('form.participationCode', clubFormParams.participationCode);
    }
    formData.append('form.quizOpenType', clubFormParams.quizOpenType);
    formData.append('form.studyCycle', clubFormParams.studyCycle.toString());
    formData.append('form.startDate', clubFormParams.startAt);
    formData.append('form.endDate', clubFormParams.endAt);
    formData.append('form.studyCount', clubFormParams.studyCount.toString());
    formData.append('form.studySubject', clubFormParams.studySubject);
    formData.append('form.studyKeywords', clubFormParams.studyKeywords.toString());
    formData.append('form.skills', clubFormParams.skills.toString());
    formData.append('form.introductionText', clubFormParams.introductionText);
    formData.append('form.recommendationText', clubFormParams.recommendationText);
    formData.append('form.learningText', clubFormParams.learningText);
    formData.append('form.memberIntroductionText', clubFormParams.memberIntroductionText);
    formData.append('form.careerText', clubFormParams.careerText);
    formData.append('form.answerExposureType', clubFormParams.answerExposureType);
    formData.append('form.answerPublishType', clubFormParams.answerPublishType);
    formData.append('form.useCurrentProfileImage', clubFormParams.useCurrentProfileImage);
    formData.append('form.comprehensiveEvaluationMinimumCount', clubFormParams.comprehensiveEvaluationMinimumCount);

    //대표퀴즈 사용 여부
    formData.append('isRepresentativeQuizPublic', selectedOption);

    if (selectedImage) {
      console.log('selectedImage', selectedImage);
      formData.append('form.clubImageFile', selectedImageCheck);
    }
    if (selectedImageBanner) {
      formData.append('form.backgroundImageFile', selectedImageBannerCheck);
    }
    if (selectedImageProfile) {
      formData.append('form.instructorProfileImageFile', selectedImageProfileCheck);
    }

    for (let i = 0; i < scheduleData.length; i++) {
      const item = scheduleData[i];
      formData.append(`clubQuizzes[${i}].quizSequence`, item.quizSequence || '');
      formData.append(`clubQuizzes[${i}].publishDate`, item.publishDate || '');
    }

    console.log(params);
    onTempSave(formData);
  };

  const handlerClubMake = () => {
    if (studyCycleNum.length === 0) {
      alert('요일을 입력해주세요.');
      return;
    }

    if (num == 0) {
      alert('클럽퀴즈 회차를 입력 해주세요.');
      return false;
    }

    console.log(studyCycleNum);
    console.log(num);
    console.log(startDay.format('YYYY-MM-DD'));

    setDayParams({
      // ...params,
      studyCycle: studyCycleNum.join(','),
      studyCount: num,
      startDate: startDay.format('YYYY-MM-DD'),
    });
    setButtonFlag(true);
    setSelectedQuizIds([]);
  };

  const handlerClubMakeManual = () => {
    const weeks = [];

    if (num == 0) {
      alert('클럽퀴즈 회차를 입력 해주세요.');
      return false;
    }

    for (let i = 0; i < num; i++) {
      weeks.push({
        order: i + 1,
        quizSequence: null,
      });
    }
    setScheduleData(weeks);
    setButtonFlag(true);
    setSelectedQuizIds([]);
    alert('학습자 자동 오픈 주기 설정이 완료되었습니다.');
  };

  const handlerClubMakeProfessorManual = () => {
    const weeks = [];

    if (num == 0) {
      alert('클럽퀴즈 회차를 입력 해주세요.');
      return false;
    }
    for (let i = 0; i < num; i++) {
      weeks.push({
        order: i + 1,
        weekNumber: i + 1,
        quizSequence: null,
        publishDate: null,
        dayOfWeek: null,
      });
    }
    setScheduleData(weeks);
    setButtonFlag(true);
    setSelectedQuizIds([]);
    alert('퀴즈 생성(수동) 주기 설정이 완료되었습니다.');
  };

  const useStyles = makeStyles(theme => ({
    selected: {
      '&&': {
        backgroundColor: '#000',
        color: 'white',
      },
    },
  }));

  // 주어진 요일로부터 원하는 횟수만큼의 날짜를 생성하는 함수
  function renderDatesAndSessionsView() {
    return (
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-4">
        {scheduleData.map((session, index) => (
          <div key={index} className="tw-flex-shrink-0">
            <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d]">{index + 1}회</p>
            <p className="tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2]">
              {session.publishDate}
              {/* {session.replace(/\((.*?)요일\)/, '($1)')} */}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // const handleInputDayChange = (index, part, value) => {
  //   const updatedScheduleData = [...scheduleData];
  //   const dateParts = updatedScheduleData[index].publishDate?.split('-');

  //   if (part === 'month') {
  //     const day = new Date(startDay.format('YYYY-MM-DD'));
  //     const newDate = new Date(day.getFullYear(), value - 1, dateParts[2]);
  //     if (newDate < day) {
  //       alert('월은 시작 날짜보다 이전일 수 없습니다.');
  //       return;
  //     }
  //     dateParts[1] = value.padStart(2, '0');
  //   } else if (part === 'day') {
  //     if (value < 0 || value > 31) {
  //       alert('일은 1에서 31 사이여야 합니다.');
  //       return;
  //     }
  //     dateParts[2] = value.padStart(2);
  //   }

  //   updatedScheduleData[index].publishDate = dateParts.join('-');
  //   setScheduleSaveData(updatedScheduleData);
  // };

  const handleInputBlur = (index, part) => {
    const updatedScheduleData = [...scheduleData];
    const dateParts = updatedScheduleData[index].publishDate.split('-');

    if (part === 'month') {
      const monthValue = parseInt(dateParts[1], 10);
      if (monthValue < 10 && dateParts[1].length === 1) {
        dateParts[1] = `0${monthValue}`; // Add leading zero if necessary
      }
    } else if (part === 'day') {
      const dayValue = parseInt(dateParts[2], 10);
      if (dayValue < 10 && dateParts[2].length === 1) {
        dateParts[2] = `0${dayValue}`; // Add leading zero if necessary
      }
    }

    updatedScheduleData[index].publishDate = dateParts.join('-');
    setScheduleData(updatedScheduleData);
  };

  const handleInputDayChange = (index, part, value) => {
    const updatedScheduleData = [...scheduleData];
    const dateParts = updatedScheduleData[index].publishDate.split('-');

    if (part === 'month') {
      const day = new Date(startDay.format('YYYY-MM-DD'));
      const newDate = new Date(day.getFullYear(), value - 1, dateParts[2]);
      // console.log('newDate', day, newDate);

      if (value < 1 || value > 12) {
        if (value === '') {
          dateParts[1] = value;
        } else {
          alert('월은 1에서 12 사이여야 합니다.');
          return;
        }
      }
      // const formattedValue = value < 10 ? `0${value}` : `${value}`;
      dateParts[1] = value; // Add leading zero for months less than 10
    } else if (part === 'day') {
      if (value < 0 || value > 31) {
        alert('일은 1에서 31 사이여야 합니다.');
        return;
      }
      // dateParts[2] = value.padStart(2);
      dateParts[2] = value;
    }

    updatedScheduleData[index].publishDate = dateParts.join('-');
    setScheduleSaveData(updatedScheduleData);
  };

  const handleCheckboxDayChange = index => {
    setSelectedSessions(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleDelete = () => {
    const updatedScheduleData = scheduleData.filter((_, i) => !selectedSessions.includes(i));
    setNum(updatedScheduleData.length);
    setScheduleData(updatedScheduleData);
    setSelectedSessions([]);
  };

  const newCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

  // Define the function to handle checkbox change
  const handleCheckboxChangeAgreements = event => {
    console.log('event', event.target.checked);
    setAgreements(event.target.checked);
  };

  function renderDatesAndSessionsModify() {
    return (
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-3">
        {scheduleData.map((session, index) => (
          <div key={index} className="tw-flex-grow tw-flex-shrink relative">
            <div className="tw-text-center">
              <Checkbox checked={selectedSessions.includes(index)} onChange={() => handleCheckboxDayChange(index)} />
              <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d]">{index + 1}회</p>
              <div className="tw-flex tw-justify-center tw-items-center  tw-left-0 tw-top-0 tw-overflow-hidden tw-gap-1 tw-px-0 tw-py-[3px] tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                <input
                  style={{ padding: 0, height: 25, width: 25, textAlign: 'center' }}
                  type="text"
                  maxLength={2}
                  className="form-control tw-text-sm"
                  value={session.publishDate?.split('-')[1]}
                  onChange={e => handleInputDayChange(index, 'month', e.target.value)}
                  onBlur={() => handleInputBlur(index, 'month')}
                ></input>
                <input
                  style={{ padding: 0, height: 25, width: 25, textAlign: 'center' }}
                  type="text"
                  className="form-control tw-text-sm"
                  value={session.publishDate?.split('-')[2]}
                  onChange={e => handleInputDayChange(index, 'day', e.target.value)}
                  onBlur={() => handleInputBlur(index, 'day')}
                ></input>
                <p className="tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2]">{session.dayOfWeek}</p>
              </div>
            </div>
            <div className="tw-w-6 tw-h-6 tw-left-[21px] tw-top-0 tw-overflow-hidden">
              <div className="tw-w-4 tw-h-4 tw-left-[2.77px] tw-top-[2.77px] tw-rounded tw-bg-white tw-border-[1.45px] tw-border-[#ced4de]"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const handleUniversityChange = e => {
    const selectedCode = e.target.value;
    const selected = optionsData?.data?.jobs?.find(u => u.code === selectedCode);
    setUniversityCode(selectedCode);
    setSelectedUniversity(selectedCode);
    setSelectedUniversityName(selected ? selected.name : '');
    setJobs(selected ? selected.jobs : []);
    setSelectedJob([]); // Clear the selected job when university changes
    setPersonName([]); // Clear the selected job when university changes
  };

  const handleContentUniversityChange = e => {
    const selectedCode = e.target.value;
    const selected = optionsData?.data?.jobs?.find(u => u.code === selectedCode);
    setContentUniversityCodeQuiz(selectedCode);
    setSelectedUniversityNameContent(selectedCode);
    setSelectedUniversityNameContent(selected ? selected.name : '');
    setJobsContent(selected ? selected.jobs : []);
    setSelectedJobContent([]); // Clear the selected job when university changes
    setPersonNameContent([]); // Clear the selected job when university changes
  };

  const handleUniversitySearchChange = e => {
    const selectedCode = e.target.value;
    const selected = optionsData?.data?.jobs?.find(u => u.code === selectedCode);
    setUniversityCodeQuiz(selectedCode);
    setSelectedUniversityNameQuiz(selected ? selected.name : '');
    setJobsQuiz(selected ? selected.jobs : []);
    setPersonNameQuiz([]); // Clear the selected job when university changes
    setSelectedJobQuiz([]); // Clear the selected job when university changes
  };

  const handleLevelChangeQuiz = e => {
    setSelectedLevel(e.target.value);
  };

  const handleContentLevelChangeQuiz = e => {
    setContentSelectedLevel(e.target.value);
  };

  const classes = useStyles();

  // minimumCompletionCount 변경 핸들러 추가
  const handleComprehensiveEvaluationMinimumCountChange = event => {
    const value = Number(event.target.value);
    const maxPossibleCount = num;

    if (value < 1) {
      alert('총평실행 최소답변수는 1 이상이어야 합니다.');
      return;
    }

    if (value > maxPossibleCount) {
      alert(`총평실행 최소답변수는 ${maxPossibleCount}를 초과할 수 없습니다.`);
      return;
    }
    setComprehensiveEvaluationMinimumCount(value);
  };

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <Desktop>
          <div className="tw-pt-[40px] tw-pt-5 tw-pb-0">
            <Stack spacing={2}>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Typography key="1" variant="body2">
                  퀴즈 클럽
                </Typography>
                <Typography key="2" color="text.primary" variant="body2">
                  퀴즈클럽 개설하기
                </Typography>
              </Breadcrumbs>
              <div className="tw-flex tw-justify-between tw-items-center tw-left-0 !tw-mt-0 tw-gap-4">
                <div className="tw-flex tw-justify-start tw-items-center tw-gap-4">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-2xl tw-font-extrabold tw-text-left tw-text-black">
                    퀴즈클럽 개설하기
                  </p>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                    학습자들의 성장을 이끌 퀴즈 클럽을 개설해요!
                  </p>
                </div>
                <div className="tw-flex tw-justify-end tw-items-center tw-gap-4">
                  <button
                    onClick={handlerClubTemp}
                    className="border tw-flex tw-justify-center tw-items-center tw-w-40 tw-relative tw-overflow-hidden tw-gap-2 tw-px-6 tw-py-[11.5px] tw-rounded tw-bg-white tw-border tw-border-gray-400"
                  >
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-[#6a7380]">
                      임시저장 불러오기
                    </p>
                  </button>
                </div>
              </div>
            </Stack>
            <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.5);', paddingY: '10px' }} />
          </div>
        </Desktop>
        <Mobile>
          <div className="tw-py-5 tw-mb-0">
            <div className="tw-pt-[60px]">
              <div className="tw-text-[24px] tw-font-bold tw-text-black tw-text-center">
                퀴즈 &gt; 퀴즈 클럽 개설하기
              </div>
              <div className="tw-text-[12px] tw-text-black tw-text-center tw-mb-10">
                나와 크루들의 성장을 이끌 퀴즈 클럽을 개설해요!
              </div>
            </div>
          </div>
        </Mobile>

        {activeStep === 0 && (
          <article>
            <Desktop>
              <div className="tw-flex tw-justify-between tw-items-center tw-w-full tw-my-10">
                {steps.map((step, index) => (
                  <div key={index} className="tw-w-1/3">
                    <div className="tw-px-2">
                      <div
                        className={`tw-flex tw-justify-center tw-items-center tw-w-full tw-relative tw-overflow-hidden tw-gap-2 tw-px-6 tw-py-1  ${
                          index < activeStep
                            ? 'tw-bg-gray-300 tw-text-white'
                            : index === activeStep
                              ? 'tw-bg-blue-600  tw-text-white'
                              : 'tw-bg-gray-300 tw-text-white'
                        }`}
                      ></div>
                      <div
                        className={`tw-flex tw-text-sm tw-justify-center tw-items-center tw-w-full tw-relative tw-overflow-hidden tw-gap-2 tw-px-6 tw-py-[11.5px] tw-rounded ${
                          index < activeStep
                            ? ' tw-text-gray-400'
                            : index === activeStep
                              ? ' tw-text-black tw-font-bold'
                              : ' tw-text-gray-400'
                        }`}
                      >
                        {step}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="tw-flex tw-justify-between tw-items-center tw-gap-4">
                <div className=" tw-text-xl tw-font-bold tw-text-black tw-my-10">클럽 기본정보 입력</div>
                <div className=" tw-text-sm tw-text-black tw-my-10">
                  <span className="tw-text-red-500 tw-mr-1">*</span>필수입력사항
                </div>
              </div>
              <div className={cx('content-area')}>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-2">
                  클럽명 <span className="tw-text-red-500">*</span>
                </div>
                <TextField
                  size="small"
                  fullWidth
                  onChange={handleInputChange}
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

                            // `setRecommendLevels` 호출
                            setRecommendLevels(prevState => newCheckItem(item.code, index, prevState));

                            setLevelNames(prevNames => {
                              // prevNames가 배열이 아닌 경우 빈 배열로 초기화
                              const safePrevNames = Array.isArray(prevNames) ? prevNames : [];

                              if (index >= 0) {
                                // 이미 배열에 있는 경우 해당 이름 제거
                                return safePrevNames.filter(name => name !== item.name);
                              } else {
                                // 배열에 없는 경우 해당 이름 추가
                                return [...safePrevNames, item.name];
                              }
                            });
                          }}
                          className={cx('tw-mr-2 !tw-w-[85px] !tw-h-[37px]')}
                        />
                      ))}
                    </div>

                    <div>
                      <div>
                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                          추천 {subGroupLabel}
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
                            disabled={jobs.length === 0}
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

                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                          공개/비공개 설정 <span className="tw-text-red-500">*</span>
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
                  <div className="tw-pb-5">
                    <div className="tw-flex tw-gap-4">
                      <div className="tw-flex-1 ">
                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                          퀴즈 생성(오픈) 주기 <span className="tw-text-red-500">*</span>
                        </div>

                        <ToggleButtonGroup
                          value={quizType}
                          exclusive
                          onChange={handleQuizType}
                          aria-label="text alignment"
                        >
                          {openGroup?.map((item, index) => (
                            <ToggleButton
                              classes={{ selected: classes.selected }}
                              key={`open-${index}`}
                              value={item.name}
                              aria-label="fff"
                              className="tw-ring-1 tw-ring-slate-900/10"
                              style={{
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
                              <BootstrapTooltip
                                title={
                                  item.name === '0100'
                                    ? ''
                                    : item.name === '0200'
                                      ? '클럽 관리자가 퀴즈 오픈을 수동으로 설정할 수 있어요!'
                                      : item.name === '0300'
                                        ? '학습자가 이전 퀴즈를 모두 학습/답변하였을 경우에 다음 퀴즈가 자동으로 오픈이 돼요!'
                                        : ''
                                }
                                placement="top"
                              >
                                {item?.description}
                              </BootstrapTooltip>
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      </div>
                      <div className="tw-flex-1 ">
                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                          퀴즈 채점/피드백 방식 설정 <span className="tw-text-red-500">*</span>
                        </div>

                        <ToggleButtonGroup
                          value={feedbackType}
                          exclusive
                          onChange={handleFeedbackType}
                          aria-label="text alignment"
                        >
                          {feedbackGroup?.map((item, index) => (
                            <ToggleButton
                              classes={{ selected: classes.selected }}
                              key={`open-${index}`}
                              value={item.name}
                              aria-label="fff"
                              className="tw-ring-1 tw-ring-slate-900/10"
                              style={{
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
                              {item?.description}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      </div>
                    </div>
                  </div>
                  {/* Conditionally render a div based on recommendType and recommendLevels */}
                  {quizType == '0100' && (
                    <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb] tw-pb-5">
                      <div className="tw-flex tw-p-5 tw-gap-3">
                        <div className="tw-flex-grow tw-w-1/2 tw-h-14 ...">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                            퀴즈 주기 (복수선택가능)
                          </p>
                          <ToggleButtonGroup
                            value={studyCycleNum}
                            onChange={handleStudyCycle}
                            aria-label=""
                            color="standard"
                          >
                            {dayGroup?.map((item, index) => (
                              <ToggleButton
                                classes={{ selected: classes.selected }}
                                key={`job1-${index}`}
                                value={item.id}
                                name={item.name}
                                className="tw-ring-1 tw-ring-slate-900/10"
                                style={{
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
                                {item.name}
                              </ToggleButton>
                            ))}
                          </ToggleButtonGroup>
                        </div>
                        <div className="tw-flex-none tw-w-1/6 tw-h-14 ...">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">클럽 시작일</p>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="YYYY-MM-DD"
                              slotProps={{ textField: { size: 'small', style: { backgroundColor: 'white' } } }}
                              value={startDay}
                              onChange={e => onChangeHandleFromToStartDate(e)}
                            />
                          </LocalizationProvider>
                        </div>
                        <div className="tw-flex-none tw-w-1/6 tw-h-14 ...">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">클럽 종료일</p>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="YYYY-MM-DD"
                              slotProps={{ textField: { size: 'small', style: { backgroundColor: 'white' } } }}
                              value={endDay}
                              onChange={e => onChangeHandleFromToEndDate(e)}
                            />
                          </LocalizationProvider>
                        </div>
                        <div className="tw-flex-none tw-w-1/6 tw-h-14 ... ">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                            클럽퀴즈 회차 입력
                          </p>
                          <TextField
                            size="small"
                            fullWidth
                            onChange={handleNumChange}
                            id="margin-none"
                            value={num}
                            name="num"
                            style={{ backgroundColor: 'white' }}
                          />
                        </div>
                        <div className="tw-flex-none tw-h-14 ... tw-ml-5 ">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">&nbsp;</p>
                          <button
                            onClick={handlerClubMake}
                            className="tw-flex tw-justify-center tw-items-center tw-w-20 tw-relative tw-overflow-hidden tw-gap-2 tw-px-7 tw-py-[10px] tw-rounded tw-bg-[#31343d]"
                          >
                            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-white">
                              확인
                            </p>
                          </button>
                        </div>
                      </div>
                      {scheduleData?.length > 0 && (
                        <div className="tw-p-5">
                          <div className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                            퀴즈 클럽회차
                          </div>
                          <div className="tw-rounded-lg tw-bg-white">{renderDatesAndSessionsView()}</div>
                          <div
                            onClick={handleDelete}
                            className="tw-cursor-pointer tw-text-sm tw-text-right tw-text-black tw-py-5 tw-font-semibold"
                          >
                            선택회차 삭제하기
                          </div>
                          <div className="tw-rounded-lg tw-bg-white">{renderDatesAndSessionsModify()}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {quizType == '0200' && (
                    <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb] tw-pb-5">
                      <div className="tw-flex tw-p-5 tw-gap-3">
                        <div className="tw-flex-none tw-w-1/6 tw-h-14 ...">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">클럽 시작일</p>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="YYYY-MM-DD"
                              slotProps={{ textField: { size: 'small', style: { backgroundColor: 'white' } } }}
                              value={startDay}
                              onChange={e => onChangeHandleFromToStartDate(e)}
                            />
                          </LocalizationProvider>
                        </div>
                        <div className="tw-flex-none tw-w-1/6 tw-h-14 ...">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">클럽 종료일</p>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="YYYY-MM-DD"
                              slotProps={{ textField: { size: 'small', style: { backgroundColor: 'white' } } }}
                              value={endDay}
                              onChange={e => onChangeHandleFromToEndDate(e)}
                            />
                          </LocalizationProvider>
                        </div>
                        <div className="tw-flex-none tw-w-1/6 tw-h-14 ... ">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                            클럽퀴즈 회차 입력
                          </p>
                          <TextField
                            size="small"
                            fullWidth
                            onChange={handleNumChange}
                            id="margin-none"
                            value={num}
                            name="num"
                            style={{ backgroundColor: 'white' }}
                          />
                        </div>
                        <div className="tw-flex-none tw-h-14 ... tw-ml-5 ">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">&nbsp;</p>
                          <button
                            onClick={handlerClubMakeProfessorManual}
                            className="tw-flex tw-justify-center tw-items-center tw-w-20 tw-relative tw-overflow-hidden tw-gap-2 tw-px-7 tw-py-[10px] tw-rounded tw-bg-[#31343d]"
                          >
                            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-white">
                              확인
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {quizType == '0300' && (
                    <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb] tw-pb-5">
                      <p className="tw-text-sm tw-text-left tw-text-black tw-font-semibold tw-pt-5 tw-px-5">
                        날짜/요일을 지정할 필요 없이 학생이 퀴즈를 풀면 자동으로 다음 회차가 열립니다.
                      </p>
                      <div className="tw-flex tw-p-5 tw-gap-3">
                        <div className="tw-flex-none tw-w-1/6 tw-h-14 ...">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">클럽 시작일</p>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="YYYY-MM-DD"
                              slotProps={{ textField: { size: 'small', style: { backgroundColor: 'white' } } }}
                              value={startDay}
                              onChange={e => onChangeHandleFromToStartDate(e)}
                            />
                          </LocalizationProvider>
                        </div>

                        <div className="tw-flex-none tw-w-1/6 tw-h-14 ...">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">클럽 종료일</p>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="YYYY-MM-DD"
                              slotProps={{ textField: { size: 'small', style: { backgroundColor: 'white' } } }}
                              value={endDay}
                              onChange={e => onChangeHandleFromToEndDate(e)}
                            />
                          </LocalizationProvider>
                        </div>
                        <div className="tw-flex-none tw-w-1/6 tw-h-14 ... ">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                            클럽퀴즈 회차 입력
                          </p>
                          <TextField
                            size="small"
                            fullWidth
                            onChange={handleNumChange}
                            id="margin-none"
                            value={num}
                            name="num"
                            style={{ backgroundColor: 'white' }}
                          />
                        </div>
                        <div className="tw-flex-none tw-h-14 ... tw-ml-5 ">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">&nbsp;</p>
                          <button
                            onClick={handlerClubMakeManual}
                            className="tw-flex tw-justify-center tw-items-center tw-w-20 tw-relative tw-overflow-hidden tw-gap-2 tw-px-7 tw-py-[10px] tw-rounded tw-bg-[#31343d]"
                          >
                            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-white">
                              확인
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="tw-flex tw-flex-row tw-gap-5">
                    <div className="tw-flex-1/12">
                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-2">답변노출유형</div>
                      <select
                        className="tw-h-10 tw-w-[200px] form-select block tw-px-4 tw-mt-2 tw-rounded"
                        onChange={handleAnswerExposureTypeChange}
                        value={answerExposureType}
                        aria-label="Default select example"
                      >
                        <option value="0100">교수자 답변노출</option>
                        <option value="0200">AI 답변노출</option>
                        <option value="0300">교수자+AI 답변노출</option>
                      </select>
                    </div>
                    <div className="tw-flex-1/12">
                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-2">답변공개유형</div>
                      <select
                        className="tw-h-10 tw-w-[200px] form-select block tw-px-4 tw-mt-2 tw-rounded"
                        onChange={handleAnswerPublishTypeChange}
                        value={answerPublishType}
                        aria-label="Default select example"
                      >
                        <option value="0002">공개</option>
                        <option value="0001">비공개</option>
                      </select>
                    </div>
                    <div className="tw-flex-1/12">
                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-2">
                        총평실행 최소답변수
                      </div>
                      <TextField
                        size="small"
                        fullWidth
                        onChange={handleComprehensiveEvaluationMinimumCountChange}
                        id="margin-none"
                        value={comprehensiveEvaluationMinimumCount}
                        name="comprehensiveEvaluationMinimumCount"
                        style={{ backgroundColor: 'white' }}
                      />
                    </div>
                  </div>

                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-2">학습 주제</div>
                  <TextField
                    size="small"
                    fullWidth
                    onChange={handleInputStudySubjectChange}
                    id="margin-none"
                    value={studySubject}
                    name="studySubject"
                  />
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">학습 챕터</div>
                  <Tag
                    value={studyKeywords}
                    onChange={setStudyKeywords}
                    placeHolder="학습 챕터를 입력 후 엔터를 쳐주세요."
                  />
                  <div className="tw-flex tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">
                    관련기술
                    <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-px-3 tw-py-0.5 tw-rounded">
                      <p
                        onClick={() => {
                          window.open('https://camen.co.kr/skill', '_blank');
                        }}
                        className="tw-cursor-pointer tw-underline tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#478af5]"
                      >
                        커리어 스킬/경험
                      </p>
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.59022 10.2974C8.69166 11.0153 7.5523 11.362 6.40615 11.2661C5.25999 11.1702 4.19405 10.6391 3.42725 9.78186C2.66045 8.92461 2.251 7.80629 2.28299 6.65658C2.31498 5.50687 2.78599 4.41304 3.59927 3.59976C4.41255 2.78648 5.50638 2.31547 6.65609 2.28348C7.8058 2.25149 8.92412 2.66094 9.78137 3.42774C10.6386 4.19454 11.1697 5.26048 11.2656 6.40663C11.3615 7.55279 11.0148 8.69215 10.2969 9.59071L13.7342 13.0274C13.7833 13.0731 13.8227 13.1283 13.8501 13.1897C13.8774 13.251 13.8921 13.3172 13.8933 13.3844C13.8945 13.4515 13.8821 13.5182 13.857 13.5804C13.8318 13.6427 13.7944 13.6993 13.7469 13.7467C13.6994 13.7942 13.6429 13.8316 13.5806 13.8568C13.5184 13.8819 13.4517 13.8943 13.3845 13.8931C13.3174 13.8919 13.2512 13.8772 13.1899 13.8499C13.1285 13.8226 13.0733 13.7832 13.0276 13.734L9.59022 10.2974ZM4.30622 9.25604C3.81692 8.76669 3.48366 8.14326 3.34856 7.46456C3.21347 6.78585 3.2826 6.08233 3.54723 5.44291C3.81185 4.80348 4.26009 4.25686 4.8353 3.87211C5.4105 3.48736 6.08685 3.28176 6.77887 3.2813C7.47089 3.28083 8.14751 3.48552 8.72323 3.86949C9.29895 4.25347 9.74793 4.79949 10.0134 5.43856C10.2789 6.07762 10.349 6.78105 10.2148 7.45994C10.0806 8.13882 9.7482 8.76269 9.25955 9.25271L9.25622 9.25604L9.25289 9.25871C8.59628 9.91379 7.70651 10.2815 6.779 10.281C5.8515 10.2805 4.96212 9.91183 4.30622 9.25604Z"
                          fill="#478AF5"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="tw-px-1">
                    {optionsSkills?.map((item, i) => (
                      <Toggle
                        key={i}
                        label={item}
                        name={item}
                        value={item}
                        variant="small"
                        checked={skills.indexOf(item) >= 0}
                        isActive
                        type="tabButton"
                        onChange={() => {
                          const index = skills.indexOf(item);
                          console.log(index);
                          setSkills(prevState => newCheckItem(item, index, prevState));
                        }}
                        className={cx('tw-mr-2  !tw-h-[37px] tw-mb-2')}
                      />
                    ))}
                    <TextField
                      size="small"
                      onChange={e => setInputValue(e.target.value)}
                      placeholder="관련스킬/경험을 입력해주세요. ex) JAVA, PM"
                      onKeyPress={handleKeyPress}
                      value={inputValue}
                      style={{ width: '350px' }} //assign the width as your requirement
                      name="studySubject"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleAddInput}>
                              <AddIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">클럽 기본정보 입력</div>
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">
                    간략한 클럽 소개 내용을 입력해주세요.
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
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">
                    어떤 사람이 우리 클럽에 가입하면 좋을지 추천해주세요.
                  </div>
                  <TextField
                    fullWidth
                    id="margin-none"
                    multiline
                    rows={4}
                    onChange={onMessageChange2}
                    value={recommendationText}
                    placeholder="컴공에 대한 기초적인 지식이 있으신 분
                    학원 공부가 맞지 않으신 분
                    다른 사람들과 자유롭게 의견 나누면서 공부하고 싶으신 분"
                  />
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">
                    우리 클럽을 통해 얻을 수 있는 것은 무엇인가요?
                  </div>
                  <TextField
                    fullWidth
                    id="margin-none"
                    multiline
                    rows={4}
                    onChange={onMessageChange3}
                    value={learningText}
                    placeholder="개발 트랜드를 따라갈 수 있어요.
                    정확히 몰랐던 기초를 다질 수 있어요.
                    동종업계 인맥을 넓힐 수 있어요."
                  />
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">
                    교수자님의 인사 말씀을 남겨주세요.
                  </div>
                  <TextField
                    fullWidth
                    id="margin-none"
                    multiline
                    rows={4}
                    onChange={onMessageChange4}
                    value={memberIntroductionText}
                    placeholder="안녕하세요. 만나서 반가워요."
                  />
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">
                    교수자님의 이력 및 경력을 남겨주세요.
                  </div>
                  <TextField
                    fullWidth
                    id="margin-none"
                    multiline
                    rows={4}
                    onChange={onMessageChange5}
                    value={careerText}
                    placeholder="(현) ○○○ 개발 리더
                    (전) △△ 개발 팀장
                    (전) □□□□ 개발 사원"
                  />
                </div>
              </div>

              <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">클럽 꾸미기</div>
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-5">
                클럽 카드 이미지 선택<span className="tw-text-red-500 tw-ml-1">*</span>
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
                클럽 배경 이미지 선택 <span className="tw-text-red-500">*</span>
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

              {/* {previewProfile ? (
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
              )} */}
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

              <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
                <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                  <div className="tw-row-span-2">
                    <button
                      className="tw-w-[150px] border tw-mr-4 tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded tw-text-sm"
                      onClick={() => handlerClubSaveTemp()}
                    >
                      임시 저장하기
                    </button>
                    <button
                      className="tw-w-[150px] tw-bg-[#E11837] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-text-sm tw-rounded"
                      onClick={handleNextOne}
                    >
                      {activeStep === steps.length - 1 ? '퀴즈 클럽 개설하기' : '다음'}{' '}
                      <NavigateNextIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              </div>
            </Desktop>
          </article>
        )}

        {activeStep === 1 && (
          <>
            <Desktop>
              <article className="tw-mt-8">
                <div className="tw-relative">
                  <p className="tw-text-xl tw-font-bold tw-text-left tw-text-black tw-py-5">퀴즈 등록하기</p>
                  <p className="tw-text-base tw-text-left tw-text-black">
                    <span className="tw-text-base tw-text-left tw-text-black">
                      클럽 세부사항에서 선택한 항목에 따라 자동으로 추천된 퀴즈 목록입니다. 퀴즈를 클릭하시면 다른
                      퀴즈로 변경할 수 있습니다.
                    </span>
                    <br />
                    <span className="tw-text-base tw-text-left tw-text-black">
                      퀴즈 순서 및 삭제로 편집하여 우리 클럽에 맞는 퀴즈 목록을 만들어주세요!
                    </span>
                  </p>
                  <div className="tw-absolute tw-bottom-0 tw-right-0">
                    <button
                      onClick={handlerQuizInit}
                      className="tw-flex tw-justify-center tw-items-center tw-w-[124px] tw-relative tw-overflow-hidden tw-gap-2 tw-px-7 tw-py-[11.5px] tw-rounded tw-bg-[#e9ecf2]"
                    >
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-[#6a7380]">
                        퀴즈 초기화
                      </p>
                    </button>
                  </div>
                </div>

                <div className="tw-grid tw-grid-cols-3 tw-gap-8 tw-py-12">
                  <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                      {groupLabel}
                    </p>
                    <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                      <TextField
                        size="small"
                        fullWidth
                        id="margin-none"
                        disabled
                        value={selectedUniversityName}
                        name="clubName"
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                      {subGroupLabel}
                    </p>
                    <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                      <TextField size="small" fullWidth id="margin-none" value={personName} disabled />
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">학년</p>
                    <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                      <TextField size="small" fullWidth disabled id="margin-none" value={levelNames} name="clubName" />
                    </div>
                  </div>
                </div>

                <div className="tw-h-24 tw-flex tw-justify-center tw-items-center  tw-relative tw-overflow-hidden tw-gap-8">
                  <div className="tw-flex-1 tw-flex tw-justify-center tw-items-center  tw-h-20 tw-gap-2 border tw-rounded-lg">
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
                    <button
                      type="button"
                      onClick={e => handleAddClickKnowledgeContent(null)}
                      className="tw-text-black tw-text-base tw-font-medium tw-text-black"
                    >
                      지식콘텐츠기반 퀴즈(AI생성) 일괄 등록
                    </button>
                  </div>
                  <div className="tw-flex-1 tw-flex tw-justify-center tw-items-center tw-gap-2  tw-h-20 border tw-rounded-lg">
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
                    <button
                      type="button"
                      onClick={e => handleAddClick(null)}
                      className="tw-text-black tw-text-base tw-font-medium"
                    >
                      퀴즈 개별등록하기
                    </button>
                  </div>
                </div>

                <div className="tw-text-sm tw-flex tw-justify-end tw-items-center tw-relative tw-gap-3 tw-pt-5">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="inlineRadio1"
                      value="true"
                      checked={selectedOption === 'true'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      대표퀴즈 사용
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="inlineRadio2"
                      value="false"
                      checked={selectedOption === 'false'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio2">
                      대표퀴즈 사용 안함
                    </label>
                  </div>
                </div>

                <div className="tw-mt-5"></div>

                <Grid container direction="row" justifyContent="left" alignItems="flex-start" rowSpacing={4}>
                  <Grid item xs={1}>
                    {scheduleData?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="tw-h-[234.5px] tw-flex tw-flex-col tw-items-center tw-justify-center"
                        >
                          <div className="tw-text-center tw-text-black tw-font-bold tw-text-sm">
                            {index + 1 <= 3 ? '대표' : ''}
                          </div>

                          <div className="tw-text-center tw-text-black tw-font-bold tw-text-sm">
                            Q{index + 1}. {item.order}회차{' '}
                          </div>
                          {item.weekNumber && (
                            <div className="tw-text-center tw-text-sm tw-text-black tw-font-bold">
                              {item.dayOfWeek ? `${item.publishDate?.slice(5, 10)}(${item.dayOfWeek})` : ''}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </Grid>
                  <Grid item xs={11}>
                    <ReactDragList
                      dataSource={scheduleData}
                      rowKey="order"
                      row={dragList}
                      handles={false}
                      className="simple-drag"
                      rowClassName="simple-drag-row"
                      onUpdate={handleUpdate}
                      key={updateKey} // 상태 업데이트를 강제 트리거
                    />
                  </Grid>
                </Grid>

                <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
                  <div className="tw-flex tw-gap-5 tw-mt-3">
                    <button
                      onClick={handleBack}
                      className="border tw-w-[150px] tw-btn-outline-secondary tw-text-sm tw-outline-blue-500 tw-bg-white tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-rounded tw-flex tw-items-center tw-justify-center tw-gap-1"
                    >
                      <NavigatePrevIcon fontSize="small" />
                      이전
                    </button>
                    <button
                      className="tw-w-[150px] border tw-font-bold tw-py-3  tw-text-sm tw-px-4 tw-rounded tw-text-black tw-font-bold"
                      onClick={() => handlerClubSaveTemp()}
                    >
                      임시 저장하기
                    </button>
                    <button
                      className="tw-w-[150px] tw-bg-[#E11837] tw-text-white  tw-text-sm tw-font-bold tw-py-3 tw-px-4 tw-rounded tw-flex tw-items-center tw-justify-center tw-gap-1"
                      onClick={handleNextTwo}
                    >
                      {activeStep === steps.length - 1 ? '퀴즈 클럽 개설하기 >' : '다음'}
                      <NavigateNextIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              </article>
            </Desktop>
          </>
        )}
        {activeStep === 2 && (
          <>
            <article>
              <QuizClubDetailInfo
                border={true}
                previewProfile={previewProfile}
                clubData={paramss?.clubForm}
                user={user}
                selectedUniversityName={selectedUniversityName}
                jobLevelName={levelNames}
                selectedJobName={personName}
                selectedQuizzes={scheduleData}
                selectedOption={selectedOption}
              />
              <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
                <div className="tw-flex tw-gap-5 tw-mt-3">
                  <button
                    onClick={handleBack}
                    className="border tw-w-[240px] tw-text-sm tw-btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-rounded tw-flex tw-items-center tw-justify-center tw-gap-1"
                  >
                    <NavigatePrevIcon fontSize="small" />
                    이전
                  </button>
                  <button
                    disabled={isProcessing}
                    className="tw-w-[240px] tw-text-sm tw-bg-[#E11837] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-rounded tw-flex tw-items-center tw-justify-center tw-gap-1"
                    onClick={handleNextThree}
                  >
                    {activeStep === steps.length - 1 ? '클럽 개설하기' : '다음'}
                    <NavigateNextIcon fontSize="small" />
                  </button>
                </div>
              </div>
            </article>
          </>
        )}
      </div>

      {/* 퀴즈 개별등록하기 */}
      <MentorsModal
        zIndex={200}
        title="퀴즈 등록하기"
        isOpen={isModalOpen}
        onAfterClose={() => {
          setIsModalOpen(false);
          setPage(1);
          setKeyWorld('');
          setUniversityCodeQuiz('');
          setSelectedLevel('');
        }}
        isContentModalClick={false}
      >
        <div className="tw-mb-8">
          <div className="tw-grid tw-grid-cols-3 tw-gap-3 tw-pb-4">
            <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-text-left tw-text-black">{groupLabel}</p>
              <select
                className="form-select"
                onChange={handleUniversitySearchChange}
                aria-label="Default select example"
                value={universityCodeQuiz}
              >
                <option value="">{groupLabel}을 선택해주세요.</option>
                {optionsData?.data?.jobs?.map((university, index) => (
                  <option key={index} value={university.code}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-text-left tw-text-black">{subGroupLabel}</p>
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
                          {groupLabel}을 선택하고, {subGroupLabel}를 선택해주세요.
                        </span>
                      );
                    }
                    return selected.join(', ');
                  }}
                  disabled={jobsQuiz.length === 0}
                  value={personNameQuiz}
                  onChange={handleChangesQuiz}
                  MenuProps={{
                    disableScrollLock: true,
                  }}
                >
                  {jobsQuiz.map((job, index) => (
                    <MenuItem key={index} value={job.name}>
                      <Checkbox checked={personNameQuiz.indexOf(job.name) > -1} />
                      <ListItemText primary={job.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-text-left tw-text-black">학년</p>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={handleLevelChangeQuiz}
                value={selectedLevel}
              >
                <option value="">학년을 선택해주세요.</option>
                {optionsData?.data?.jobLevels.map((job, index) => (
                  <option key={index} value={job.code}>
                    {job.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-text-left tw-text-black">검색</p>
            <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
              <TextField
                size="small"
                fullWidth
                placeholder="퀴즈 키워드를 입력해주세요."
                onChange={e => setKeyWorld(e.target.value)}
                id="margin-none"
                value={keyWorld}
                name="keyWorld"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                }}
              />
            </div>
          </div>

          <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.5);', paddingY: '10px' }} />

          <p className="tw-text-xl tw-font-bold tw-text-left tw-text-black tw-py-5">
            퀴즈목록 전체 : {totalElements}개 - (퀴즈선택 : {selectedQuizIds.length} / {scheduleData?.length})
          </p>
          {quizListData.map((item, index) => (
            <div key={index}>
              <QuizBreakerInfoCheck
                userName={item.memberNickname}
                questionText={item.question}
                index={item.quizSequence}
                selectedQuizIds={selectedQuizIds}
                handleCheckboxChange={handleCheckboxChange}
                tags={item}
                answerText={item.modelAnswer}
                knowledgeContentTitle={item?.content?.name}
              />
            </div>
          ))}
          <div className="tw-pt-5">
            <Pagination page={page} setPage={setPage} total={totalPage} showCount={5} />
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

      {/* 지식콘텐츠기반 퀴즈(AI생성) 일괄 등록 */}
      <MentorsModal
        zIndex={200}
        title="지식콘텐츠기반 퀴즈(AI생성) 일괄 등록"
        isOpen={isModalOpenKnowledgeContent}
        onAfterClose={() => {
          setIsModalOpenKnowledgeContent(false);
          setContentPage(1);
          setContentKeyWorld('');
          setContentUniversityCodeQuiz('');
          setContentSelectedJobQuiz([]);
          setContentSelectedLevel('');
        }}
        isContentModalClick={false}
      >
        <div className="tw-mb-8">
          <div className="tw-grid tw-grid-cols-3 tw-gap-3 tw-pb-4">
            <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">{groupLabel}</p>
              <select
                className="form-select"
                onChange={handleContentUniversityChange}
                aria-label="Default select example"
                value={contentUniversityCodeQuiz}
              >
                <option value="">{groupLabel}을 선택해주세요.</option>
                {optionsData?.data?.jobs?.map((university, index) => (
                  <option key={index} value={university.code}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-text-left tw-text-black">{subGroupLabel}</p>
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
                          {groupLabel}을 선택하고, {subGroupLabel}를 선택해주세요.
                        </span>
                      );
                    }
                    return selected.join(', ');
                  }}
                  disabled={(() => {
                    const selectedUniversity = optionsData?.data?.jobs?.find(u => u.code === contentUniversityCodeQuiz);
                    return !selectedUniversity || !selectedUniversity.jobs || selectedUniversity.jobs.length === 0;
                  })()}
                  value={personNameContent}
                  onChange={handleChangesContent}
                  MenuProps={{
                    disableScrollLock: true,
                  }}
                >
                  {(() => {
                    const selectedUniversity = optionsData?.data?.jobs?.find(u => u.code === contentUniversityCodeQuiz);
                    return (
                      selectedUniversity?.jobs?.map((job, index) => (
                        <MenuItem key={index} value={job.name}>
                          <Checkbox checked={personNameContent.indexOf(job.name) > -1} />
                          <ListItemText primary={job.name} />
                        </MenuItem>
                      )) || []
                    );
                  })()}
                </Select>
              </FormControl>
            </div>

            <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-text-left tw-text-black">학년</p>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={handleContentLevelChangeQuiz}
                value={contentSelectedLevel}
              >
                <option value="">학년을 선택해주세요.</option>
                {optionsData?.data?.jobLevels.map((job, index) => (
                  <option key={index} value={job.code}>
                    {job.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-text-left tw-text-black">검색</p>
            <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
              <TextField
                size="small"
                fullWidth
                placeholder="퀴즈 키워드를 입력해주세요."
                onChange={e => setContentKeyWorld(e.target.value)}
                id="margin-none"
                value={contentKeyWorld}
                name="contentKeyWorld"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                }}
              />
            </div>
          </div>

          <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.5);', paddingY: '10px' }} />

          <p className="tw-text-xl tw-font-bold tw-text-left tw-text-black tw-py-5">
            `지식콘텐츠목록 전체` : {totalContentElements}개 - (콘텐츠선택 : {getTotalSelectedCount()} /{' '}
            {scheduleData?.length})
          </p>
          {contentListData.map((item, index) => (
            <div key={index}>
              <QuizBreakerInfoCheckContent
                questionText={item.name}
                index={item.contentSequence}
                selectedContentIds={selectedContentIds}
                handleCheckboxChange={handleContentCheckboxChange}
              />
            </div>
          ))}
          <div className="tw-pt-5">
            <Pagination page={contentPage} setPage={setContentPage} total={totalContentPage} showCount={5} />
          </div>
          <div className="tw-py-10 tw-gap-4  tw-flex tw-items-center tw-justify-center ">
            <button
              className="tw-w-[200px] tw-px-10 tw-text-base tw-bg-blue-500 tw-text-white tw-py-3 tw-rounded"
              onClick={() => setIsModalContentOpen(true)}
            >
              퀴즈 AI생성 등록하기
            </button>
            <button
              className="tw-w-[200px] tw-px-10 tw-text-base tw-py-3 tw-rounded border"
              onClick={() => {
                setIsModalOpenKnowledgeContent(false);
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </MentorsModal>
      <Modal isOpen={isModalContentOpen} onAfterClose={() => setIsModalContentOpen(false)} title="" maxWidth="800px">
        <div className={cx('seminar-check-popup')}>
          <div>
            <br></br>
            <br></br>
            <div className={cx('mb-5')}>
              <span className={cx('text-bold', 'tw-text-xl', 'tw-font-bold')}>퀴즈 AI생성 및 등록 진행</span>
            </div>
            <br></br>
            <div className="tw-text-base">
              12개 퀴즈를 AI로 생성 및 자동 등록 하시겠습니까?.
              <br />
              생성 시작 후 등록까지 2~3분 가량 시간이 소요됩니다.
            </div>
            <br></br>
            <br></br>
            <div className="tw-mt-5 tw-flex tw-justify-center tw-gap-4">
              <Button
                color="gray"
                label="취소"
                size="modal"
                onClick={() => {
                  setIsModalContentOpen(false);
                  // onClubJoin({
                  //   clubSequence: clubData?.clubSequence,
                  //   participationCode: participationCode,
                  // });
                }}
              />
              <Button
                color="primary"
                label="진행하기"
                size="modal"
                onClick={() => {
                  setIsModalOpen(false);
                  console.log('selectedContentIds', selectedContentIds);
                  onClubQuizContentSave({
                    publishDates: ['2025-10-26', '2025-10-27'],
                    contentSequences: selectedContentIds,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default QuizOpenTemplate;
