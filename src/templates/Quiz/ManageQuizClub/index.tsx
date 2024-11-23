import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import Divider from '@mui/material/Divider';
import {
  paramProps,
  useMyClubList,
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
  useQuizOpen,
} from 'src/services/admin/friends/friends.mutations';

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
import { useQuizMyClubInfo, useQuizMyInfo } from 'src/services/quiz/quiz.queries';
import { useClubAboutDetailInfo } from 'src/services/seminars/seminars.queries';
import QuizBreakerInfo from 'src/stories/components/QuizBreakerInfo';
import { useSaveQuiz } from 'src/services/admin/members/members.mutations';
import router from 'next/router';

//quiz
import { MentorsModal, Tag } from 'src/stories/components';
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

import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { makeStyles } from '@mui/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

//group
import { dayGroup, privateGroup, levelGroup, openGroup, images, scheduleDataDummy, imageBanner } from './group';
import { Toggle } from 'src/stories/components';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useUploadImage } from 'src/services/image/image.mutations';
import { v4 as uuidv4 } from 'uuid';
import { useClubQuizTempSave } from 'src/services/quiz/quiz.mutations';

export const generateUUID = () => {
  return uuidv4();
};

export interface ManageQuizClubTemplateProps {
  /** 세미나 아이디 */
  id?: any;
  title?: string;
  subtitle?: boolean;
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export function ManageQuizClubTemplate({ id, title, subtitle }: ManageQuizClubTemplateProps) {
  const { mutate: onTempSave, isSuccess: tempSucces } = useClubQuizTempSave();
  const { mutate: onCrewBan, isSuccess: isBanSuccess } = useCrewBanDelete();
  const { mutate: onCrewAccept, isSuccess: isAcceptSuccess } = useCrewAcceptPost();
  const { mutate: onCrewReject, isSuccess: isRejectSuccess } = useCrewRejectPost();
  const { mutate: onSaveImage, data: imageUrl, isSuccess: imageSuccess } = useUploadImage();
  const { mutate: onInstructorsAccept, isSuccess: isInstructorsAcceptSuccess } = useInstructorsAccept();
  const { mutate: onInstructorsDelete, isSuccess: isInstructorsDeleteSuccess } = useInstructorsDelete();
  const { mutate: onQuizOpen, isSuccess: isQuizOpenSuccess } = useQuizOpen();

  const [professorRequestSortType, setProfessorRequestSortType] = useState('0001');
  const [quizType, setQuizType] = useState('0100');
  const [participationCode, setParticipationCode] = useState('');
  const [isPublic, setIsPublic] = useState('0001');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageMember, setPageMember] = useState(1);
  const [pageMemberModal, setPageMemberModal] = useState(1);
  const [totalPageMember, setTotalPageMember] = useState(1);
  const [totalPageMemberModal, setTotalPageMemberModal] = useState(1);
  const [totalElementsMember, setTotalElementsMember] = useState(0);
  const [totalElementsMemberModal, setTotalElementsMemberModal] = useState(0);
  const [myClubList, setMyClubList] = useState<any>([]);
  const [myMemberList, setMyMemberList] = useState<any>([]);
  const [myMemberRequestList, setMyMemberRequestList] = useState<any>([]);
  const [myClubParams, setMyClubParams] = useState<any>({ clubSequence: id, page });
  const [professorRequestParams, setProfessorRequestParams] = useState<any>({
    clubSequence: id,
    page,
  });

  const [myClubMemberParams, setMyClubMemberParams] = useState<any>({ clubSequence: id, page });
  const [params, setParams] = useState<paramProps>({ page });
  const [quizList, setQuizList] = useState<any>([]);
  const [keyWorld, setKeyWorld] = useState('');
  const [keyWorldProfessor, setKeyWorldProfessor] = useState('');
  const [selectedValue, setSelectedValue] = useState(id);
  const [activeTab, setActiveTab] = useState('myQuiz');
  // const [activeTab, setActiveTab] = useState('community`');
  console.log('subtitle', subtitle);
  const [pageQuiz, setPageQuiz] = useState(1);
  const [totalQuizPage, setTotalQuizPage] = useState(1);
  const [myQuizParams, setMyQuizParams] = useState<any>({ clubSequence: id, sortType: 'ASC', page });
  const [myQuizParamsSubTitle, setMyQuizParamsSubTitle] = useState<any>({
    page,
    subtitle: subtitle,
    clubType: '0100',
    size: 100,
  });
  const [updateKey, setUpdateKey] = useState(0); // 상태 업데이트 강제 트리거를 위한 키
  const [selectedQuizIds, setSelectedQuizIds] = useState([]);
  const [quizListData, setQuizListData] = useState<any[]>([]);
  const [quizListBackupData, setQuizListBackupData] = useState<any[]>([]);
  const { mutate: onQuizSave, data: quizSaveData } = useSaveQuiz();

  useEffect(() => {
    if (quizSaveData) {
      console.log(quizSaveData?.data?.responseCode);
      if (quizSaveData?.data?.responseCode === '0000') {
        // setQuizListData(quizSaveData);
        console.log('퀴즈 수정 성공');
      } else if (quizSaveData?.data?.responseCode === '0401') {
        refetchMyInfo();
        console.log('오픈되어있는 퀴즈는 순서를 변경할 수 없습니다.');
      } else {
        console.log('퀴즈 수정에 실패했습니다. : ' + quizSaveData?.data?.responseCode);
      }
    }
  }, [quizSaveData]);

  //quiz
  const [pageQuizz, setPageQuizz] = useState(1);
  const [totalQuizzPage, setTotalQuizzPage] = useState(1);
  const [totalQuizzElements, setTotalQuizzElements] = useState(0);
  const [quizSearch, setQuizSearch] = React.useState('');
  const [allQuizData, setAllQuizData] = useState([]);
  const [profile, setProfile] = useState<any>([]);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState<boolean>(false);
  const [memberUUID, setMemberUUID] = useState<string>('');
  const [universityCodeQuiz, setUniversityCodeQuiz] = useState<string>('');
  const [selectedJobQuiz, setSelectedJobQuiz] = useState<string[]>([]);
  const [selectedUniversityNameQuiz, setSelectedUniversityNameQuiz] = useState('');
  const [jobsQuiz, setJobsQuiz] = useState([]);
  const [personNameQuiz, setPersonNameQuiz] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  //club
  const [ids, setIds] = useState<any>(id);
  const [studySubject, setStudySubject] = useState('');
  const [clubName, setClubName] = useState<string>('');
  const [universityCode, setUniversityCode] = useState<string>('');
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [selectedJobName, setSelectedJobName] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageCheck, setSelectedImageCheck] = useState(null);
  const [selectedImageBanner, setSelectedImageBanner] = useState('');
  const [selectedImageBannerCheck, setSelectedImageBannerCheck] = useState(null);
  const [selectedImageProfile, setSelectedImageProfile] = useState('/assets/images/account/default_profile_image.png');
  const [selectedImageProfileCheck, setSelectedImageProfileCheck] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [personName, setPersonName] = useState([]);
  const [selectedJob, setSelectedJob] = useState([]);
  const [studyCycleNum, setStudyCycleNum] = useState([]);
  const [num, setNum] = useState(0);
  const [startDay, setStartDay] = React.useState<Dayjs | null>(dayjs());
  const [endDay, setEndDay] = React.useState<Dayjs | null>(dayjs());
  const [studyKeywords, setStudyKeywords] = useState([]);
  const [optionsSkills, setOptionsSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [dayParams, setDayParams] = useState<any>({});
  const [buttonFlag, setButtonFlag] = useState(false);
  const [introductionText, setIntroductionText] = useState<string>('');
  const [recommendationText, setRecommendationText] = useState<string>('');
  const [learningText, setLearningText] = useState<string>('');
  const [memberIntroductionText, setMemberIntroductionText] = useState<string>('');
  const [careerText, setCareerText] = useState<string>('');
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobLevelName, setJobLevelName] = useState([]);
  const [levelNames, setLevelNames] = useState([]);
  const [requestProfessorList, setRequestProfessorList] = useState<any>([]);
  const [totalElementsProfessor, setTotalElementsProfessor] = useState(0);
  const [selectedUUIDs, setSelectedUUIDs] = useState<string[]>([]);
  const [pageProfessor, setPageProfessor] = useState(1);
  const [scheduleSaveData, setScheduleSaveData] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState('true');
  const handleChange = event => {
    console.log('test', event.target.value);
    setSelectedOption(event.target.value);
  };

  const cx = classNames.bind(styles);

  const { data: optionsData }: UseQueryResult<ExperiencesResponse> = useOptions();

  const handleCheckboxRequestChange = (uuid, isChecked) => {
    if (isChecked) {
      // 체크되었을 경우 UUID 추가
      setSelectedUUIDs([...selectedUUIDs, uuid]);
    } else {
      // 체크 해제되었을 경우 UUID 제거
      setSelectedUUIDs(selectedUUIDs.filter(id => id !== uuid));
    }
  };

  useEffect(() => {
    if (isInstructorsAcceptSuccess || isInstructorsDeleteSuccess || isBanSuccess) {
      refetchProfessorRequest();
      refetchMyMember();
      setSelectedUUIDs([]);
    }
  }, [isInstructorsAcceptSuccess, isInstructorsDeleteSuccess, isBanSuccess]);

  useEffect(() => {
    // Merge new data from quizListData into allQuizData
    console.log('quizListData', quizListData);
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

  const handleQuizType = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    if (newFormats) {
      setScheduleData([]);
      setNum(0);
      setSelectedQuizIds([]);
      setStudyCycleNum([]);
      setQuizType(newFormats);
    }
  };

  const handleStudyCycle = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setStudyCycleNum(newFormats);
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
  };

  const handleNumChange = event => {
    setNum(event.target.value);
  };

  const handleIsPublic = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    setIsPublic(newFormats);
    console.log(newFormats);
    if (newFormats === '0002') {
      setIsPublic('0002');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setOptionsSkills(prevState => [...prevState, inputValue.trim()]);
      setInputValue(''); // Clear the input
    }
  };

  const handleInputStudySubjectChange = event => {
    setStudySubject(event.target.value);
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

  const handleAddInput = () => {
    if (inputValue.trim() !== '') {
      setOptionsSkills(prevState => [...prevState, inputValue.trim()]);
      setInputValue(''); // Clear the input
    }
  };

  const handleTabClick = tab => {
    setActiveTab(tab);
  };

  const handleInputQuizSearchChange = event => {
    setQuizSearch(event.target.value);
  };

  //클럽 정보
  const { refetch: refetchGetTemp }: UseQueryResult<any> = useClubAboutDetailInfo(ids, data => {
    console.log('quiz club temp', data);
    const clubForm = data?.form || {};
    const quizList = data?.clubQuizzes || [];

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
    setNum(clubForm.studyCount || 0);
    setQuizType(clubForm.quizOpenType || '');
    setStartDay(clubForm.startAt ? dayjs(clubForm.startAt) : dayjs());
    setEndDay(clubForm.endAt ? dayjs(clubForm.endAt) : dayjs());
    setStudyKeywords(clubForm.studyKeywords || []);
    setStudySubject(clubForm.studySubject || '');
    setStudyCycleNum(clubForm.studyCycle || 0);
    setUniversityCode(clubForm.jobGroups[0]?.code || '');
    setSelectedUniversityName(clubForm.jobGroups[0]?.name || '');
    setSelectedJobName(clubForm.jobs[0]?.name || '');
    setJobLevelName(clubForm.jobLevels[0]?.name || '');
    setLevelNames(clubForm.jobLevels.map(item => item.name));
    const selected = optionsData?.data?.jobs?.find(u => u.code === clubForm.jobGroups[0]?.code);
    setJobs(selected ? selected.jobs : []);
    const jobsCode = clubForm.jobs.map(item => item.code);
    setSelectedJob(jobsCode || []);
    const jobsName = clubForm.jobs.map(item => item.name);
    console.log(jobsName);
    setPersonName(jobsName || []);
    setButtonFlag(true);
    setScheduleData(quizList);
    setSelectedOption(data?.isRepresentativeQuizPublic.toString());

    // Filter out items with quizSequence not null and extract quizSequence values
    const quizSequenceNumbers = quizList.filter(item => item.quizSequence !== null).map(item => item.quizSequence);
    setSelectedQuizIds(quizSequenceNumbers);

    setPreview(clubForm.clubImageUrl || '/assets/images/banner/Rectangle_190.png');
    setPreviewBanner(clubForm.backgroundImageUrl || '/assets/images/banner/Rectangle_200.png');
    setPreviewProfile(clubForm.instructorProfileImageUrl);

    setSelectedImage('');
    setSelectedImageBanner('');
    setSelectedImageProfile('');
  });

  useDidMountEffect(() => {
    setProfessorRequestParams({
      clubSequence: selectedClub?.clubSequence,
      page: pageProfessor,
      sortType: professorRequestSortType,
    });
  }, [pageProfessor, professorRequestSortType]);

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

  const handleOpenQuiz = quizSequence => {
    let params = {
      club: selectedClub?.clubSequence,
      quizSequence,
    };
    onQuizOpen(params);
  };

  const [scheduleData, setScheduleData] = useState<any[]>([]);
  //new logic
  // const handleCheckboxChange = quizSequence => {
  //   // Filter out items with quizSequence as null and count them
  //   const nullQuizSequenceCount = quizList.filter(item => item.quizSequence === null).length;

  //   if (!selectedQuizIds?.includes(quizSequence) && nullQuizSequenceCount <= 0) {
  //     alert('퀴즈를 추가 할 수 없습니다.');
  //     return;
  //   }

  //   setSelectedQuizIds(prevSelectedQuizIds => {
  //     const updatedSelectedQuizIds = prevSelectedQuizIds.includes(quizSequence)
  //       ? prevSelectedQuizIds.filter(id => id !== quizSequence)
  //       : [...prevSelectedQuizIds, quizSequence];

  //     setQuizList(prevSelectedQuizzes => {
  //       const alreadySelected = prevSelectedQuizzes.some(quiz => quiz.quizSequence === quizSequence);
  //       console.log(alreadySelected);
  //       if (alreadySelected) {
  //         // When unchecked, set quizSequence to null
  //         return prevSelectedQuizzes.map(quiz =>
  //           quiz.quizSequence === quizSequence ? { ...quiz, quizSequence: null } : quiz,
  //         );
  //       } else {
  //         console.log(quizList);
  //         const newQuiz = allQuizData.find(quiz => quiz.quizSequence === quizSequence);
  //         const reconstructedQuiz = newQuiz
  //           ? {
  //               quizSequence: newQuiz.quizSequence,
  //               question: newQuiz.question,
  //               leaderUri: newQuiz.memberUri,
  //               leaderUUID: newQuiz.memberUUID,
  //               leaderProfileImageUrl: newQuiz.memberProfileImageUrl,
  //               leaderNickname: newQuiz.memberNickname,
  //               contentUrl: newQuiz.contentUrl,
  //               contentTitle: newQuiz.contentTitle,
  //               modelAnswer: newQuiz.modelAnswer,
  //               quizUri: newQuiz.quizUri,
  //               contentDescription: newQuiz.contentDescription,
  //             }
  //           : null;

  //         console.log(newQuiz);
  //         console.log(reconstructedQuiz);

  //         // Find the first item with null values in scheduleData
  //         const firstNullItemIndex = quizList.findIndex(item => item.quizSequence === null);

  //         if (firstNullItemIndex !== -1 && newQuiz) {
  //           // Update the first null item with the new quiz data
  //           const updatedScheduleData = [...quizList];
  //           updatedScheduleData[firstNullItemIndex] = {
  //             ...updatedScheduleData[firstNullItemIndex],
  //             ...reconstructedQuiz,
  //           };
  //           console.log(updatedScheduleData);
  //           setScheduleData(updatedScheduleData);
  //           return updatedScheduleData;
  //         }
  //       }
  //     });
  //     return updatedSelectedQuizIds;
  //   });
  // };
  const [order, setOrder] = useState(null);
  const [eachMaxQuizLength, setEachMaxQuizLength] = useState(null);
  const handleCheckboxChange = quizSequence => {
    console.log('order', order);
    console.log('eachMaxQuizLength', eachMaxQuizLength);
    console.log('selectedQuizIds', selectedQuizIds.length);

    const nullQuizSequenceCount = quizList.filter(item => item.quizSequence === null).length;

    if (order) {
      const existingOrderQuiz = quizList.find(item => item.order === order && item.quizSequence !== null);

      // 이미 다른 퀴즈가 매핑된 경우 경고창 표시 및 기존 선택 해제
      if (
        existingOrderQuiz &&
        existingOrderQuiz.quizSequence !== quizSequence &&
        !selectedQuizIds.includes(quizSequence)
      ) {
        alert('퀴즈가 이미 선택되었습니다. 이전 퀴즈를 취소해주세요.');
        setSelectedQuizIds(prevSelectedQuizIds => prevSelectedQuizIds.filter(id => id !== quizSequence));
        setQuizList(prevSelectedQuizzes =>
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

      setQuizList(prevSelectedQuizzes => {
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
                  // leaderUri: newQuiz.memberUri,
                  // leaderUUID: newQuiz.memberUUID,
                  // leaderProfileImageUrl: newQuiz.memberProfileImageUrl,
                  // leaderNickname: newQuiz.memberNickname,
                  leaderUri: newQuiz.memberUri,
                  leaderUUID: newQuiz.memberUUID,
                  profileImageUrl: newQuiz.memberProfileImageUrl,
                  nickname: newQuiz.memberNickname,
                },
                contentUrl: newQuiz.contentUrl,
                contentTitle: newQuiz.contentTitle,
                modelAnswer: newQuiz.modelAnswer,
                description: newQuiz.content.description,
                quizUri: newQuiz.quizUri,
              }
            : null;

          console.log(newQuiz);
          console.log(reconstructedQuiz);

          let firstNullItemIndex;
          if (order) {
            firstNullItemIndex = quizList.findIndex(item => item.order === order);
          } else {
            firstNullItemIndex = quizList.findIndex(item => item.quizSequence === null);
          }

          if (firstNullItemIndex !== -1 && newQuiz) {
            const updatedScheduleData = [...quizList];
            updatedScheduleData[firstNullItemIndex] = {
              ...updatedScheduleData[firstNullItemIndex],
              ...reconstructedQuiz,
            };
            console.log(updatedScheduleData);
            setQuizList(updatedScheduleData);
            return updatedScheduleData;
          }
        }

        if (order && selectedQuizIds.length >= eachMaxQuizLength) {
          alert('퀴즈를 추가 할 수 없습니다.');
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
      setQuizList(prevSelectedQuizzes =>
        prevSelectedQuizzes.map(quiz => (quiz.quizSequence === quizSequence ? { ...quiz, quizSequence: null } : quiz)),
      );
      return updatedSelectedQuizIds;
    });
  };

  useEffect(() => {
    // setUpdateKey를 호출하여 강제 리렌더링
    setUpdateKey(prevKey => prevKey + 1);
  }, [quizList]);

  const handleChangeQuiz = event => {
    setSortType(event.target.value);
  };

  const handleChangeQuizModal = event => {
    setSortTypeModal(event.target.value);
  };

  const handleChangeQuizType = event => {
    if (event.target.value === 'ASC') {
      setSortQuizType('ASC');
      setQuizList(prevQuizList => [...prevQuizList].sort((a, b) => a.order - b.order));
    } else {
      setSortQuizType('DESC');
      setQuizList(prevQuizList => [...prevQuizList].sort((a, b) => b.order - a.order));
    }
  };

  const handleInputChange = event => {
    setClubName(event.target.value);
  };

  //퀴즈 리스트
  const { isFetched: isQuizData, refetch } = useQuizList(params, data => {
    console.log('useQuizList', data);
    setQuizListData(data.contents || []);
    setQuizListBackupData(data.contents || []);
    setTotalQuizzPage(data.totalPages);
    setTotalQuizzElements(data.totalElements);

    console.log(data.totalPages);
    console.log(data.totalElements);
  });

  useEffect(() => {
    if (isQuizOpenSuccess) {
      refetchMyInfo();
    }
  }, [isQuizOpenSuccess]);

  // 퀴즈클럽 리스트

  const { isFetched: isContentFetched, refetch: refetchMyClub } = useMyClubList(myQuizParamsSubTitle, data => {
    setMyClubList(data?.data?.contents || []);
    const foundClub = data?.data?.contents?.find(club => club.clubSequence === parseInt(id));
    setSelectedClub(foundClub);
  });

  // 내 요청 회원 목록 조회
  const { isFetched: isDashboardRequestFetched, refetch: refetchMyDashboardRequest } = useMyMemberRequestList(
    myClubParams,
    data => {
      console.log(data?.contents);
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

  console.log(myClubMemberParams);
  // 내 회원 목록 조회
  const { isFetched: isMemberFetched, refetch: refetchMyMember } = useMyMemberList(myClubMemberParams, data => {
    console.log('isMemberFetched', data);
    setTotalPageMemberModal(data?.totalPages);
    setTotalElementsMember(data?.totalElements);
    setMyMemberList(data?.contents || []);
  });

  // 퀴즈클럽 정보 조회
  // const { isFetched: isParticipantListFetched } = useQuizMyClubInfo(myQuizParams, data => {
  //   console.log('first get data');
  //   // setQuizList(data?.contents || []);
  //   setSelectedQuizIds(data?.contents.map(item => item?.quizSequence));
  //   setTotalQuizPage(data?.totalPages);
  //   setTotalQuizElements(data?.totalElements);
  //   console.log(data);
  // });

  const { isFetched: isMyInfoFetched, refetch: refetchMyInfo } = useQuizMyInfo(myQuizParams, data => {
    console.log('first get data>>>>', data.clubQuizzes);
    setQuizList(data?.clubQuizzes || []);
    console.log(data);
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
  const [sortTypeModal, setSortTypeModal] = useState('0001');
  const [isProfessorModalOpen, setIsProfessorModalOpen] = useState(false);
  const [sortQuizType, setSortQuizType] = useState('ASC');

  useDidMountEffect(() => {
    console.log('=================================================');
    setMyClubParams({
      clubSequence: selectedClub?.clubSequence,
      sortType: sortType,
      page: page,
    });

    setMyClubMemberParams({
      clubSequence: selectedClub?.clubSequence,
      sortType: sortType,
      page: pageMember,
    });

    setMyQuizParams({
      clubSequence: selectedClub?.clubSequence,
      page: pageQuiz,
      sortType: sortQuizType,
    });

    setProfessorRequestParams({
      clubSequence: selectedClub?.clubSequence,
      page: pageProfessor,
      sortType: professorRequestSortType,
    });
  }, [sortType, selectedClub]);

  useDidMountEffect(() => {
    setMyClubMemberParams({
      clubSequence: selectedClub?.clubSequence,
      page: pageMemberModal,
      sortType: sortTypeModal,
      keyword: keyWorldProfessor,
    });
  }, [pageMemberModal, sortTypeModal, keyWorldProfessor]);

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
  }, [pageQuiz]);

  useDidMountEffect(() => {
    setParams({
      page: pageQuizz,
      keyword: keyWorld,
    });
  }, [pageQuizz]);

  useEffect(() => {
    setParams({
      page,
      keyword: keyWorld,
      jobGroups: universityCodeQuiz,
      jobs: selectedJobQuiz.toString(),
      jobLevels: selectedLevel,
    });
  }, [page, keyWorld, universityCodeQuiz, selectedJobQuiz, selectedLevel]);

  const handleQuizChange = event => {
    const value = event.target.value;
    const selectedSession = myClubList?.find(session => session.clubSequence === Number(value));

    setSelectedValue(value);
    setSelectedClub(selectedSession);
    setIds(selectedSession.clubSequence);
    console.log(selectedSession);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const handlePageChangeMember = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageMember(value);
  };
  const handlePageChangeMemberModal = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageMemberModal(value);
  };
  const handlePageChangeQuiz = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageQuiz(value);
  };

  const handleProfileDelete = e => {
    setPreviewProfile(null);
    setSelectedImageProfileCheck(null);
  };

  const dragList = (item: any, index: any) => (
    <div
      key={item.key}
      className={`simple-drag-row ${item?.hasBeenPublished ? '' : 'drag-disabled'}`}
      style={{ cursor: item?.hasBeenPublished ? 'default' : 'move' }} // 조건부 스타일 적용
    >
      <QuizBreakerInfo
        publishDate={item?.publishDate}
        dayOfWeek={item?.dayOfWeek}
        avatarSrc={item?.member?.profileImageUrl}
        userName={item?.member?.nickname}
        questionText={item?.question}
        index={item?.quizSequence !== undefined ? item?.quizSequence : null}
        answerText={item?.modelAnswer}
        handleAddClick={handleAddClick}
        isPublished={item?.isPublished}
        isDeleteQuiz={!item?.hasBeenPublished}
        // isDeleteQuiz={false}
        handleCheckboxDelete={handleCheckboxDelete}
        knowledgeContentTitle={item?.contentDescription || item?.contentTitle}
        hasBeenPublished={item.hasBeenPublished}
        order={item.order}
      />
    </div>
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleAddClick = order => {
    console.log('order', order);
    // console.log('quizList.length', quizList.length);
    // if (quizList.length > 1) setIsModalOpen(true);
    // else alert('퀴즈 생성 주기를 입력해주세요.');
    setOrder(order);
    setEachMaxQuizLength(selectedQuizIds.length + 1);
    setIsModalOpen(true);
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

  const handleUpdate = (evt: any, updated: any) => {
    console.log('updated', updated);
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
      member: scheduleMap[index].member,
      contentUrl: scheduleMap[index].contentUrl,
      contentTitle: scheduleMap[index].contentTitle,
      isPublished: scheduleMap[index].isPublished,
      modelAnswer: scheduleMap[index].modelAnswer,
      quizUri: scheduleMap[index].quizUri,
      contentDescription: scheduleMap[index].contentDescription,
      hasBeenPublished: scheduleMap[index].hasBeenPublished,
    }));

    // 상태 업데이트
    setQuizList(mergeData);
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

  const handleInputDayChange = (index, part, value) => {
    const updatedScheduleData = [...scheduleData];
    const dateParts = updatedScheduleData[index].publishDate.split('-');

    if (part === 'month') {
      const day = new Date(startDay.format('YYYY-MM-DD'));
      const newDate = new Date(day.getFullYear(), value - 1, dateParts[2]);
      if (newDate < day) {
        alert('월은 시작 날짜보다 이전일 수 없습니다.');
        return;
      }
      dateParts[1] = value.padStart(2, '0');
    } else if (part === 'day') {
      if (value < 0 || value > 31) {
        alert('일은 1에서 31 사이여야 합니다.');
        return;
      }
      dateParts[2] = value.padStart(2);
    }

    updatedScheduleData[index].publishDate = dateParts.join('-');
    setScheduleSaveData(updatedScheduleData);
  };

  function renderDatesAndSessionsModify() {
    return (
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-3">
        {scheduleData.map((session, index) => (
          <div key={index} className="tw-flex-grow tw-flex-shrink relative">
            <div className="tw-text-center">
              <Checkbox
                disabled={true}
                checked={selectedSessions.includes(index)}
                onChange={() => handleCheckboxDayChange(index)}
              />
              <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d]">{index + 1}회</p>
              <div className="tw-flex tw-justify-center tw-items-center  tw-left-0 tw-top-0 tw-overflow-hidden tw-gap-1 tw-px-0 tw-py-[3px] tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                <input
                  style={{ padding: 0, height: 25, width: 25, textAlign: 'center' }}
                  type="text"
                  maxLength={2}
                  disabled={true}
                  className="form-control tw-text-sm"
                  value={session.publishDate.split('-')[1]}
                  onChange={e => handleInputDayChange(index, 'month', e.target.value)}
                ></input>
                <input
                  style={{ padding: 0, height: 25, width: 25, textAlign: 'center' }}
                  type="text"
                  disabled={true}
                  className="form-control tw-text-sm"
                  value={session.publishDate.split('-')[2]}
                  onChange={e => handleInputDayChange(index, 'day', e.target.value)}
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

  const handleQuizSave = () => {
    const hasNullQuizSequence = quizList.some(quiz => quiz.quizSequence === null);

    if (hasNullQuizSequence) {
      alert('퀴즈를 등록해주세요.');
      return;
    }
    console.log(quizList);

    // publishDate와 quizSequence만 남기기
    const filteredData = quizList.map(({ publishDate, quizSequence }) => ({
      publishDate,
      quizSequence,
    }));

    onQuizSave({ club: selectedClub?.clubSequence, data: filteredData, selectedOption: selectedOption });
  };

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  function searchKeyworldProfessor(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorldProfessor(_keyworld);
  }

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

  // 파일 이름 추출 함수
  const extractFileName = path => {
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  const handlerClubSaveTemp = () => {
    if (!clubName) {
      alert('클럽 이름을 입력해주세요');
      return false;
    }

    if (!universityCode) {
      alert('학교를 선택해주세요');
      return false;
    }

    // if (!selectedJob || selectedJob.length === 0) {
    //   alert('최소 하나의 학과를 선택해주세요');
    //   return false;
    // }

    // if (!recommendLevels || recommendLevels.length === 0) {
    //   alert('최소 하나의 학년을 선택해주세요');
    //   return false;
    // }

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
      skills: skills || '',
      introductionText: introductionText || '',
      recommendationText: recommendationText || '',
      learningText: learningText || '',
      memberIntroductionText: memberIntroductionText || '',
      careerText: careerText || '',
      studyKeywords: studyKeywords || '',
      quizOpenType: quizType,
      description: '',
      answerPublishType: '0001',
      clubTemplatePublishType: '0001',
      clubRecruitType: '0100',
      useCurrentProfileImage: 'false',
    };

    const formData = new FormData();
    formData.append('clubId', 'quiz_club_' + generateUUID());
    formData.append('clubName', clubFormParams.clubName);
    formData.append('jobGroups', clubFormParams.jobGroups.toString());
    formData.append('jobs', clubFormParams.jobs.toString());
    formData.append('jobLevels', clubFormParams.jobLevels.toString());
    formData.append('isPublic', clubFormParams.isPublic.toString());
    if (clubFormParams.participationCode !== '') {
      formData.append('participationCode', clubFormParams.participationCode);
    }
    formData.append('quizOpenType', clubFormParams.quizOpenType);
    formData.append('studyCycle', clubFormParams.studyCycle.toString());
    formData.append('startDate', clubFormParams.startAt);
    formData.append('endDate', clubFormParams.endAt);
    formData.append('studyWeekCount', clubFormParams.studyCount.toString());
    formData.append('studySubject', clubFormParams.studySubject);
    formData.append('studyKeywords', clubFormParams.studyKeywords.toString());
    // formData.append('form.studyChapter', clubFormParams.studyChapter);
    formData.append('skills', clubFormParams.skills.toString());
    formData.append('introductionText', clubFormParams.introductionText);
    formData.append('recommendationText', clubFormParams.recommendationText);
    formData.append('learningText', clubFormParams.learningText);
    formData.append('memberIntroductionText', clubFormParams.memberIntroductionText);
    formData.append('careerText', clubFormParams.careerText);
    formData.append('useCurrentProfileImage', clubFormParams.useCurrentProfileImage);

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

    // for (let i = 0; i < scheduleData.length; i++) {
    //   const item = scheduleData[i];
    //   formData.append(`clubQuizzes[${i}].quizSequence`, item.quizSequence || '');
    //   formData.append(`clubQuizzes[${i}].publishDate`, item.publishDate || '');
    // }

    // const params = {
    //   clubForm: clubFormParams,
    //   clubQuizzes: scheduleData,
    // };
    console.log(params);

    const clubParam = {
      clubSequence: selectedClub?.clubSequence,
      formData: formData,
    };
    onTempSave(clubParam);
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

  function handleInstructorDelete(memberUUID: any): void {
    let params = {
      club: selectedClub?.clubSequence,
      memberUUID: memberUUID,
    };
    onInstructorsDelete(params);
    // 회원 강퇴 로직 추가
  }

  const handleUniversitySearchChange = e => {
    const selectedCode = e.target.value;
    const selected = optionsData?.data?.jobs?.find(u => u.code === selectedCode);
    setUniversityCodeQuiz(selectedCode);
    setSelectedUniversityNameQuiz(selected ? selected.name : '');
    setJobsQuiz(selected ? selected.jobs : []);
    setPersonNameQuiz([]); // Clear the selected job when university changes
    setSelectedJobQuiz([]); // Clear the selected job when university changes
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
                    퀴즈클럽 관리하기
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
                className="tw-h-14 form-select block w-full tw-bg-gray-100 tw-text-red-500 tw-font-bold tw-px-8"
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
                        퀴즈클럽 : {session?.clubName}
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
                    onClick={() => router.back()}
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
              className={`tw-absolute tw-left-[50px] tw-top-3 tw-text-base tw-text-center ${
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
              className={`tw-absolute tw-left-[43px] tw-top-3 tw-text-base tw-text-center ${
                activeTab === 'member' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              교수자관리
            </p>
          </div>
          {/* Tab 2: 클럽관리 */}
          <div
            className={`tw-w-[164px] tw-h-12 tw-relative tw-ml-2.5 tw-cursor-pointer ${
              activeTab === 'club' ? 'border-b-0' : ''
            }`}
            onClick={() => handleTabClick('club')}
          >
            <div
              className={`tw-w-[164px] tw-h-12 tw-absolute tw-left-[-1px] tw-top-[-1px] tw-rounded-tl-lg tw-rounded-tr-lg ${
                activeTab === 'club' ? 'tw-bg-white' : 'tw-bg-[#f6f7fb]'
              } border-right border-top border-left`}
            />
            <p
              className={`tw-absolute tw-left-[35px] tw-top-3 tw-text-base tw-text-center ${
                activeTab === 'club' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              클럽정보관리
            </p>
          </div>
          {/* Tab 3: 퀴즈관리 */}
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
              className={`tw-absolute tw-left-[50px] tw-top-3 tw-text-base tw-text-center ${
                activeTab === 'community' ? 'tw-font-bold tw-text-black' : 'tw-text-[#9ca5b2]'
              }`}
            >
              퀴즈관리
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
                      클럽 가입 신청 ({totalElements || 0})
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
                                src={item?.member?.profileImageUrl}
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
                      클럽 학생 목록 ({totalElementsMember || 0})
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
                        <Grid
                          className="tw-py-2 border-bottom tw-text-base "
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
                                src={item?.member?.profileImageUrl}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={2}>
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
                            sm={2}
                            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}
                          >
                            <div className="tw-gap-3">
                              <button
                                // onClick={() => router.push('/quiz-answers/' + `${item?.clubQuizSequence}`)}
                                onClick={() => handleClickProfile(item?.member?.memberUUID)}
                                type="button"
                                data-tooltip-target="tooltip-default"
                                className="tw-py-2 tw-mr-3 tw-bg-black tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded"
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
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 교수자 관리 */}
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
                          setIsProfessorModalOpen(true);
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

        {activeTab === 'club' && (
          <div className={cx('container')}>
            <div className="tw-flex tw-justify-between tw-items-center tw-relative tw-gap-3">
              <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">퀴즈클럽 기본정보</div>
              <button
                className="tw-w-[150px] border tw-text-gray-500 tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-text-sm tw-rounded"
                onClick={() => handlerClubSaveTemp()}
              >
                수정하기
              </button>
            </div>

            <div className={cx('content-area')}>
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-2">클럽명</div>
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
                            setLevelNames(prevNames => [...prevNames, item.name]);
                          }
                        }}
                        className={cx('tw-mr-2 !tw-w-[85px] !tw-h-[37px]')}
                      />
                    ))}
                  </div>

                  <div>
                    <div>
                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 학과</div>
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
                                <span style={{ color: 'gray' }}>추천 대학을 먼저 선택하고, 학과를 선택해주세요.</span>
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

                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">공개/비공개 설정</div>
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
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">퀴즈 생성(오픈) 주기</div>

                  <ToggleButtonGroup value={quizType} exclusive onChange={handleQuizType} aria-label="text alignment">
                    {openGroup?.map((item, index) => (
                      <ToggleButton
                        classes={{ selected: classes.selected }}
                        disabled
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
                {/* Conditionally render a div based on recommendType and recommendLevels */}
                {quizType == '0100' && (
                  <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb] tw-pb-5">
                    <div className="tw-flex tw-p-5 tw-gap-5">
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
                          disabled
                          value={num}
                          name="num"
                          style={{ backgroundColor: 'white' }}
                        />
                      </div>
                      <div className="tw-flex-none tw-h-14 ... tw-ml-5 ">
                        <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">&nbsp;</p>
                      </div>
                    </div>
                    {scheduleData?.length > 0 && (
                      <div className="tw-p-5">
                        <div className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                          퀴즈 클럽회차
                        </div>
                        <div className="tw-rounded-lg tw-bg-white">{renderDatesAndSessionsView()}</div>
                        <div className="tw-rounded-lg tw-bg-white">{renderDatesAndSessionsModify()}</div>
                      </div>
                    )}
                  </div>
                )}

                {quizType == '0200' && (
                  <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb] tw-pb-5">
                    <div className="tw-flex tw-p-5 ...">
                      <div className="tw-flex-none tw-w-1/4 tw-h-14 ...">
                        <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">클럽 시작일</p>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            disabled
                            format="YYYY-MM-DD"
                            slotProps={{ textField: { size: 'small', style: { backgroundColor: 'white' } } }}
                            value={startDay}
                            onChange={e => onChangeHandleFromToStartDate(e)}
                          />
                        </LocalizationProvider>
                      </div>
                      <div className="tw-flex-none tw-w-1/4 tw-h-14 ... ">
                        <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                          클럽퀴즈 회차 입력
                        </p>
                        <TextField
                          size="small"
                          fullWidth
                          disabled
                          onChange={handleNumChange}
                          id="margin-none"
                          value={num}
                          name="num"
                          style={{ backgroundColor: 'white' }}
                        />
                      </div>
                      <div className="tw-flex-none tw-h-14 ... tw-ml-5 ">
                        <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">&nbsp;</p>
                      </div>
                    </div>
                  </div>
                )}
                {quizType == '0300' && (
                  <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb] tw-pb-5">
                    <p className="tw-text-sm tw-text-left tw-text-black tw-font-semibold tw-pt-5 tw-px-5">
                      날짜/요일을 지정할 필요 없이 학생이 퀴즈를 풀면 자동으로 다음 회차가 열립니다.
                    </p>
                    <div className="tw-flex tw-p-5 ...">
                      <div className="tw-flex-none tw-w-1/4 tw-h-14 ...">
                        <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">클럽 시작일</p>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            disabled
                            format="YYYY-MM-DD"
                            slotProps={{ textField: { size: 'small', style: { backgroundColor: 'white' } } }}
                            value={startDay}
                            onChange={e => onChangeHandleFromToStartDate(e)}
                          />
                        </LocalizationProvider>
                      </div>
                      <div className="tw-flex-none tw-w-1/4 tw-h-14 ... ">
                        <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                          클럽퀴즈 회차 입력
                        </p>
                        <TextField
                          size="small"
                          fullWidth
                          disabled
                          onChange={handleNumChange}
                          id="margin-none"
                          value={num}
                          name="num"
                          style={{ backgroundColor: 'white' }}
                        />
                      </div>
                      <div className="tw-flex-none tw-h-14 ... tw-ml-5 ">
                        <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">&nbsp;</p>
                      </div>
                    </div>
                  </div>
                )}

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
                  placeHolder="학습 키워드 입력 후 엔터를 쳐주세요."
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
            <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-5">클럽 카드 이미지 선택</div>
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

            <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-5">클럽 배경 이미지 선택</div>
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

            <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-5">강의내 교수 프로필 이미지</div>

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
        )}
        {activeTab === 'community' && (
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
                    퀴즈 목록 ({selectedQuizIds?.length || 0})
                  </Grid>

                  <Grid item container justifyContent="flex-end" xs={6} sm={2} style={{ textAlign: 'right' }}>
                    <Pagination
                      count={totalQuizPage}
                      size="small"
                      siblingCount={0}
                      page={pageQuiz}
                      renderItem={item => (
                        <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                      )}
                      onChange={handlePageChangeQuiz}
                    />
                  </Grid>
                </Grid>
                <Divider className="tw-py-3 tw-mb-5" />

                <div className="tw-h-20 tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border tw-border-[#e9ecf2]">
                  <div className="tw-absolute tw-top-7 tw-left-1/2 tw-transform tw--translate-x-1/2 tw-flex tw-justify-center tw-items-center tw-gap-2">
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
                      <button type="button" onClick={e => handleAddClick(null)} className="tw-text-black tw-text-sm ">
                        퀴즈 일괄등록하기
                      </button>
                    </p>
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

                <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6 tw-my-4">
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                      정렬 :
                    </p>

                    <RadioGroup value={sortQuizType} onChange={handleChangeQuizType} row>
                      <FormControlLabel
                        value="ASC"
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
                            최신순
                          </p>
                        }
                      />
                      <FormControlLabel
                        value="DESC"
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
                            오래된순
                          </p>
                        }
                      />
                    </RadioGroup>
                  </div>
                </div>
                <Grid container direction="row" justifyContent="left" alignItems="start" rowSpacing={4}>
                  <Grid item xs={1}>
                    {quizList?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="tw-h-[223.25px] tw-flex tw-flex-col tw-items-center tw-justify-start tw-mb-4"
                        >
                          <div className="tw-pt-3">
                            <div className="tw-text-center tw-text-lg tw-text-black tw-font-bold">{item?.order}회</div>
                            {item?.hasBeenPublished ? (
                              <div className="tw-text-center tw-text-xs tw-text-black tw-font-bold">
                                {item?.publishDate?.slice(5, 10)} 오픈됨
                                {/* {item?.dayOfWeek ? `(${item.dayOfWeek})` : ''} */}
                              </div>
                            ) : quizType === '0200' ? (
                              <div
                                onClick={() => handleOpenQuiz(item?.quizSequence)}
                                className="tw-cursor-pointer tw-mt-2 tw-text-center tw-rounded-md tw-text-xs tw-text-blue-500 border border-primary tw-px-1 tw-py-1"
                              >
                                오픈하기
                              </div>
                            ) : (
                              <div className="tw-text-center tw-text-xs tw-text-black tw-font-bold">
                                {item?.publishDate?.slice(5, 10)} {item?.dayOfWeek ? `(${item.dayOfWeek})` : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </Grid>
                  <Grid item xs={11}>
                    <ReactDragList
                      dataSource={quizList}
                      rowKey="order"
                      row={dragList}
                      handles={false}
                      className="simple-drag"
                      rowClassName="simple-drag-row"
                      onUpdate={handleUpdate}
                      key={updateKey} // 상태 업데이트를 강제 트리거
                      // disabled={true}
                    />
                  </Grid>
                </Grid>

                {quizList.length === 0 && (
                  <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[50vh]')}>
                    <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">
                      퀴즈 데이터가 없습니다.
                    </p>
                  </div>
                )}
                <div className="tw-text-center tw-pt-14">
                  <button
                    onClick={() => handleQuizSave()}
                    type="button"
                    data-tooltip-target="tooltip-default"
                    className="tw-py-3 tw-px-10 tw-w-[180px] tw-bg-red-600 tw-text-white max-lg:tw-w-[60px] tw-text-sm tw-font-bold tw-rounded"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MentorsModal
        zIndex={200}
        title="교수자 추가하기"
        isOpen={isProfessorModalOpen}
        onAfterClose={() => {
          setIsProfessorModalOpen(false);
          setPageProfessor(1);
          setSortType('0001');
          setSelectedUUIDs([]);
          setKeyWorldProfessor('');
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
              클럽 학습자 목록 ({totalElementsMemberModal || 0})
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
                    setPageProfessor(1);
                    searchKeyworldProfessor((e.target as HTMLInputElement).value);
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

              <RadioGroup value={sortTypeModal} onChange={handleChangeQuizModal} row>
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
                count={totalPageMemberModal}
                size="small"
                siblingCount={0}
                page={pageMemberModal}
                renderItem={item => (
                  <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                )}
                onChange={handlePageChangeMemberModal}
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

      <MentorsModal title="퀴즈 등록하기" isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
        <div className="tw-mb-8">
          <div className="tw-grid tw-grid-cols-3 tw-gap-3 tw-pb-4">
            <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">대학</p>
              <select
                className="form-select"
                onChange={handleUniversitySearchChange}
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
                      return <span style={{ color: 'gray' }}>대학을 선택하고, 학과를 선택해주세요.</span>;
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
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">학년</p>
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
                userName={item.memberNickname}
                questionText={item.question}
                index={item.quizSequence}
                selectedQuizIds={selectedQuizIds}
                handleCheckboxChange={handleCheckboxChange}
                tags={item}
                answerText={item.modelAnswer}
                knowledgeContentTitle={item?.contentDescription}
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

export default ManageQuizClubTemplate;
