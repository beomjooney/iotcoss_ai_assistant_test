import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { MentorsModal, Pagination } from 'src/stories/components';
import React, { useEffect, useState, useRef } from 'react';
import { paramProps } from 'src/services/seminars/seminars.queries';
import { useContentJobTypes, useJobGroupss } from 'src/services/code/code.queries';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { UseQueryResult } from 'react-query';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { ExperiencesResponse } from 'src/models/experiences';
import { useOptions } from 'src/services/experiences/experiences.queries';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { useMyQuiz, useQuizList, useGetSchedule, useGetTemp } from 'src/services/jobs/jobs.queries';
import Checkbox from '@mui/material/Checkbox';
import { useClubQuizSave, useQuizSave, useClubTempSave } from 'src/services/quiz/quiz.mutations';
import { TagsInput } from 'react-tag-input-component';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useUploadImage } from 'src/services/image/image.mutations';
import { makeStyles } from '@mui/styles';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigatePrevIcon from '@mui/icons-material/NavigateBefore';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LectureBreakerInfo from 'src/stories/components/LectureBreakerInfo';
import LectureDetailInfo from 'src/stories/components/LectureDetailInfo';
/** drag list */
import ReactDragList from 'react-drag-list';
import { useStore } from 'src/store';

import { InputAdornment, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { Toggle } from 'src/stories/components';

//group
import { images, imageBanner } from './group';

const cx = classNames.bind(styles);

const defaultScheduleData = [];
for (let i = 0; i < 2; i++) {
  defaultScheduleData.push({
    order: i + 1,
    weekNumber: i + 1,
    quizSequence: null,
    publishDate: null,
    dayOfWeek: null,
  });
}

export function LectureOpenTemplate() {
  const [startDay, setStartDay] = React.useState<Dayjs | null>(dayjs());

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

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [participationCode, setParticipationCode] = useState('');
  const [levelsFilter, setLevelsFilter] = useState([]);
  const [jobGroups, setJobGroups] = useState<any[]>([]);
  const [seminarFilter, setSeminarFilter] = useState(['0002']);
  const [paramss, setParamss] = useState({});
  const [params, setParams] = useState<any>({ page });
  const [dayParams, setDayParams] = useState<any>({});
  const [myParams, setMyParams] = useState<paramProps>({ page });
  const [quizListParam, setQuizListParam] = useState<any[]>([]);
  const [quizListData, setQuizListData] = useState<any[]>([]);
  const [allQuizData, setAllQuizData] = useState([]);
  const [scheduleData, setScheduleData] = useState<any[]>(defaultScheduleData);
  const [scheduleSaveData, setScheduleSaveData] = useState<any[]>([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [selectedJobName, setSelectedJobName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLevelName, setSelectedLevelName] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [buttonFlag, setButtonFlag] = useState(false);
  const [personName, setPersonName] = useState([]);
  const [inputList, setInputList] = useState([]);
  const [fileList, setFileList] = useState([]);

  const handleFileChange = event => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.pdf)$/i;

    if (!allowedExtensions.exec(file.name)) {
      alert('허용되지 않는 파일 형식입니다.');
      event.target.value = ''; // input 초기화
      return;
    }

    setFileList([file]); // 하나의 파일만 받도록 설정
  };

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

  const { data: optionsData }: UseQueryResult<ExperiencesResponse> = useOptions();
  const { isFetched: isQuizData, refetch } = useQuizList(params, data => {
    setQuizListData(data.contents || []);
    setTotalElements(data.totalElements);
    setTotalPage(data.totalPages);
  });

  const { data: myQuizListData, refetch: refetchMyJob }: UseQueryResult<any> = useMyQuiz(myParams);

  //get schedule
  const { refetch: refetchGetSchedule }: UseQueryResult<any> = useGetSchedule(dayParams, data => {
    setScheduleData(data);
  });

  //temp 조회
  const { refetch: refetchGetTemp }: UseQueryResult<any> = useGetTemp(data => {
    console.log('load temp', data);
    const clubForm = data?.clubForm || {};
    const quizList = data?.clubQuizzes || [];

    setClubName(clubForm.clubName || '');
    setIntroductionText(clubForm.introductionText || '');
    setRecommendationText(clubForm.recommendationText || '');
    setLearningText(clubForm.learningText || '');
    setMemberIntroductionText(clubForm.memberIntroductionText || '');
    setCareerText(clubForm.careerText || '');
    setSkills(clubForm.skills || []);
    const extractedCodes = clubForm.jobLevels.map(item => item.code);
    setRecommendLevels(extractedCodes || []);
    setNum(clubForm.studyCount || 0);
    setQuizType(clubForm.quizOpenType || '');
    setStartDay(clubForm.startAt ? dayjs(clubForm.startAt) : dayjs());
    setStudyKeywords(clubForm.studyKeywords || []);
    setStudyChapter(clubForm.studyChapter || '');
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

    // Filter out items with quizSequence not null and extract quizSequence values
    const quizSequenceNumbers = quizList.filter(item => item.quizSequence !== null).map(item => item.quizSequence);
    setSelectedQuizIds(quizSequenceNumbers);
  });

  //temp 등록
  const { mutate: onTempSave, isSuccess: tempSucces } = useClubTempSave();

  const [skillIdsPopUp, setSkillIdsPopUp] = useState<any[]>([]);
  const [experienceIdsPopUp, setExperienceIdsPopUp] = useState<any[]>([]);
  const [isPublic, setIsPublic] = useState('0001');
  const [studyKeywords, setStudyKeywords] = useState([]);
  const [studyChapter, setStudyChapter] = useState('');
  const [studySubject, setStudySubject] = useState('');
  const [skills, setSkills] = useState([]);
  const [universityCodeQuiz, setUniversityCodeQuiz] = useState<string>('');
  const [selectedJobQuiz, setSelectedJobQuiz] = useState<string>('');

  const [keyWorld, setKeyWorld] = useState('');
  const [myKeyWorld, setMyKeyWorld] = useState('');
  const { mutate: onQuizSave, isSuccess: postSucces } = useQuizSave();
  const { mutate: onClubQuizSave, isError, isSuccess: clubSuccess } = useClubQuizSave();

  //quiz new logic
  const [selectedQuizIds, setSelectedQuizIds] = useState([]);

  const quizRef = useRef(null);
  const quizUrlRef = useRef(null);

  const { mutate: onSaveImage, data: imageUrl, isSuccess: imageSuccess } = useUploadImage();
  const [selectedImage, setSelectedImage] = useState('/assets/images/banner/Rectangle_190.png');
  const [selectedImageBanner, setSelectedImageBanner] = useState('/assets/images/banner/Rectangle_200.png');

  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [contentTypes, setContentTypes] = useState<any[]>([]);
  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const { mutate: onClubTempSave, isSuccess: tempSuccess } = useClubTempSave();
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

  useEffect(() => {
    setParams({
      page,
      keyword: keyWorld,
      jobGroups: universityCodeQuiz,
      jobs: selectedJobQuiz,
      jobLevels: selectedLevel,
    });
  }, [page, keyWorld, universityCodeQuiz, selectedJobQuiz, selectedLevel]);

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
    console.log(selectedCodes);
  };

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  function searchMyKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setMyKeyWorld(_keyworld);
  }

  const handleImageClick = async image => {
    //console.log('image select', `${process.env['NEXT_PUBLIC_GENERAL_URL']}` + image);
    setSelectedImage(image);
    // if (!image || image.length === 0) return;
    // let imageUrl = `${process.env['NEXT_PUBLIC_GENERAL_URL']}` + image;
    // const response = await fetch(imageUrl);
    // const data = await response.blob();
    // const ext = imageUrl.split('.').pop(); // url 구조에 맞게 수정할 것
    // const filename = imageUrl.split('/').pop(); // url 구조에 맞게 수정할 것
    // const metadata = { type: `image/${ext}` };
    // onSaveImage(new File([data], filename!, metadata));
  };
  const handleFormatExPopUp = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setExperienceIdsPopUp(newFormats);
    //console.log(newFormats);
  };

  const [introductionText, setIntroductionText] = useState<string>('');
  const [recommendationText, setRecommendationText] = useState<string>('');
  const [learningText, setLearningText] = useState<string>('');
  const [memberIntroductionText, setMemberIntroductionText] = useState<string>('');
  const [careerText, setCareerText] = useState<string>('');

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

  const handleIsPublic = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    setIsPublic(newFormats);
    console.log(newFormats);
    if (newFormats === '0002') {
      setIsPublic('0002');
    }
  };

  useDidMountEffect(() => {
    refetchMyJob();
  }, [postSucces]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddClick = () => {
    if (scheduleData.length >= 1) setIsModalOpen(true);
    else alert('퀴즈 생성 주기를 입력해주세요.');
  };

  const handleQuizInsertClick = () => {
    const params = {
      content: quizName,
      articleUrl: quizUrl,
      recommendJobGroups: [jobGroupPopUp],
      recommendJobs: jobs,
      recommendLevels: recommendLevels,
      relatedSkills: skillIdsPopUp,
      relatedExperiences: experienceIdsPopUp,
      hashTags: selected,
    };

    if (quizName === '') {
      alert('질문을 입력해주세요.');
      quizRef.current.focus();
      return;
    }

    if (quizUrl === '') {
      alert('아티클을 입력해주세요.');
      quizUrlRef.current.focus();
      return;
    }

    if (jobGroup?.length === 0 || jobGroup?.length === undefined) {
      alert('추천 직군을 선택해주세요.');
      return;
    }

    if (recommendLevels?.length === 0 || recommendLevels?.length === undefined) {
      alert('추천 학년을 선택해주세요.');
      return;
    }

    setQuizUrl('');
    setQuizName('');
    onQuizSave(params);
    setActive(2);
  };

  //new logic
  const handleCheckboxChange = quizSequence => {
    // Filter out items with quizSequence as null and count them
    const nullQuizSequenceCount = scheduleData.filter(item => item.quizSequence === null).length;

    if (!selectedQuizIds.includes(quizSequence) && nullQuizSequenceCount <= 0) {
      alert('퀴즈를 추가 할 수 없습니다.');
      return;
    }

    setSelectedQuizIds(prevSelectedQuizIds => {
      const updatedSelectedQuizIds = prevSelectedQuizIds.includes(quizSequence)
        ? prevSelectedQuizIds.filter(id => id !== quizSequence)
        : [...prevSelectedQuizIds, quizSequence];

      setScheduleData(prevSelectedQuizzes => {
        const alreadySelected = prevSelectedQuizzes.some(quiz => quiz.quizSequence === quizSequence);

        if (alreadySelected) {
          // When unchecked, set quizSequence to null
          return prevSelectedQuizzes.map(quiz =>
            quiz.quizSequence === quizSequence ? { ...quiz, quizSequence: null } : quiz,
          );
        } else {
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
          const firstNullItemIndex = scheduleData.findIndex(item => item.quizSequence === null);

          if (firstNullItemIndex !== -1 && newQuiz) {
            // Update the first null item with the new quiz data
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

  useEffect(() => {
    setParams({
      ...params,
      page,
      recommendJobGroups: jobGroupsFilter.join(','),
      recommendLevels: levelsFilter.join(','),
      seminarStatus: seminarFilter.join(','),
    });
  }, [page, jobGroupsFilter, levelsFilter, seminarFilter]);

  const [jobGroup, setJobGroup] = useState([]);
  const [jobLevelName, setJobLevelName] = useState([]);
  const [jobGroupPopUp, setJobGroupPopUp] = useState([]);
  const [studyCycleNum, setStudyCycleNum] = useState([]);
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [universityCode, setUniversityCode] = useState<string>('');
  const [levelNames, setLevelNames] = useState([]);

  const [quizType, setQuizType] = useState('0100');
  const [recommendLevelsPopUp, setRecommendLevelsPopUp] = useState([]);
  const [clubName, setClubName] = useState<string>('');
  const [num, setNum] = useState(0);
  const [active, setActive] = useState(0);
  const { isFetched: isJobGroupsFetched } = useJobGroupss(data => setJobGroups(data.data.contents || []));
  const { user, setUser } = useStore();

  const PAGE_NAME = 'contents';

  useEffect(() => {
    if (active == 0) {
      refetch();
    } else if (active == 1) {
      setQuizUrl('');
      setQuizName('');
      setJobGroupPopUp([]);
      setJobs([]);
      setRecommendLevelsPopUp([]);
      setSkillIdsPopUp([]);
      setExperienceIdsPopUp([]);
    } else if (active == 2) {
      refetchMyJob();
    }
  }, [active]);

  useEffect(() => {
    if (clubSuccess) {
      router.push('/quiz');
    }
  }, [clubSuccess]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newIndex) => {
    //console.log('SubTab - index', newIndex, event);
    setActive(newIndex);
    setValue(newIndex);
  };

  const steps = ['Step 1.클럽 세부사항 설정', 'Step 2.퀴즈 선택', 'Step 3. 개설될 클럽 미리보기'];

  const [activeStep, setActiveStep] = React.useState(2);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [quizUrl, setQuizUrl] = React.useState('');
  const [quizName, setQuizName] = React.useState('');
  const [quizSearch, setQuizSearch] = React.useState('');

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNextTwo = () => {
    console.log('next');
    console.log(scheduleData);

    const newData = [...scheduleData];
    const nullQuizSequences = scheduleData
      .map((item, index) => (item.quizSequence === null ? index + 1 : null))
      .filter(index => index !== null);

    // if (nullQuizSequences.length > 0) {
    //   alert(`${nullQuizSequences.join(', ')} 번째 퀴즈를 등록해주세요.`);
    //   return;
    // }

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

    // 정렬된 데이터와 원본 항목의 추가 속성을 병합
    const mergeData = sortedReducedData.map((item, index) => ({
      ...item,
      quizSequence: scheduleMap[index].quizSequence,
      question: scheduleMap[index].question,
      leaderUri: scheduleMap[index].leaderUri,
      leaderUUID: scheduleMap[index].leaderUUID,
      leaderProfileImageUrl: scheduleMap[index].leaderProfileImageUrl,
      leaderNickname: scheduleMap[index].leaderNickname,
      contentUrl: scheduleMap[index].contentUrl,
      contentTitle: scheduleMap[index].contentTitle,
      modelAnswer: scheduleMap[index].modelAnswer,
      quizUri: scheduleMap[index].quizUri,
    }));

    // 상태 업데이트
    setScheduleData(mergeData);
  };

  useEffect(() => {
    // 상태 업데이트 후 추가 작업 수행
    console.log('scheduleData가 업데이트되었습니다.', scheduleData);
    // setUpdateKey를 호출하여 강제 리렌더링
    setUpdateKey(prevKey => prevKey + 1);
  }, [scheduleData]);

  const dragList = (item: any, index: any) => (
    <div key={item.order} className="simple-drag-row">
      <LectureBreakerInfo
        avatarSrc={item.leaderProfileImageUrl}
        userName={item.leaderNickname}
        questionText={item.question}
        index={item.quizSequence !== undefined ? item.quizSequence : null}
        answerText={item.modelAnswer}
        handleCheckboxDelete={handleCheckboxDelete}
        handleAddClick={handleAddClick}
        publishDate={item.publishDate}
        dayOfWeek={item.dayOfWeek}
        isPublished={item.isPublished}
      />
    </div>
  );

  const handleNextThree = () => {
    console.log('NextLast');
    console.log(quizListParam);
    const params = { ...paramss, clubQuizzes: scheduleData };
    console.log(params);
    onClubQuizSave(params);
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

    handlerClubMakeProfessorManual();

    const _selectedUniversityCode =
      optionsData?.data?.jobs?.find(u => u.code === selectedUniversity)?.code || universityCode;
    setUniversityCode(_selectedUniversityCode);
    console.log(jobs);
    // const selectedJobCode = jobs.find(j => j.code === selectedJob)?.code || 'None';
    console.log('selectedJob', selectedJob);

    const clubFormParams = {
      clubName: clubName,
      clubImageUrl: imageUrl,
      jobGroups: [_selectedUniversityCode],
      jobs: selectedJob,
      jobLevels: recommendLevels,
      isPublic: true,
      participationCode: participationCode,
      studyCycle: studyCycleNum,
      startAt: startDay.format('YYYY-MM-DD') + ' 00:00:00',
      studyCount: num,
      studyWeekCount: num,
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
      answerPublishType: '0001',
      clubTemplatePublishType: '0001',
      clubRecruitType: '0100',
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
    // if (jobGroup.length === 0) {
    //   alert('등록을 원하는 분야를 선택해주세요.');
    //   return;
    // }

    console.log(setQuizType);

    // if (clubName === '') {
    //   alert('클럽 이름을 입력해주세요.');
    //   return;
    // }

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
  const handleInputStudyChapterChange = event => {
    setStudyChapter(event.target.value);
  };
  const handleInputChange = event => {
    setClubName(event.target.value);
  };

  const handleNumChange = event => {
    setNum(event.target.value);
  };

  const handleInputQuizSearchChange = event => {
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
    // const selectedJobCode = jobs.find(j => j.code === selectedJob)?.code || '';
    const clubFormParams = {
      clubName: clubName || '',
      clubImageUrl: imageUrl || '',
      jobGroups: [universityCode] || [],
      jobs: selectedJob || [],
      jobLevels: recommendLevels || [],
      isPublic: true,
      participationCode: '',
      studyCycle: studyCycleNum || '',
      startAt: (startDay ? startDay.format('YYYY-MM-DD') : '') + ' 00:00:00',
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
      answerPublishType: '0001',
      clubTemplatePublishType: '0001',
      clubRecruitType: '0100',
    };

    const params = {
      clubForm: clubFormParams,
      clubQuizzes: scheduleData,
    };
    console.log(params);

    onTempSave(params);
  };

  const handlerClubMake = () => {
    if (studyCycleNum.length === 0) {
      alert('요일을 입력해주세요.');
      return;
    }

    console.log(studyCycleNum);
    console.log(num);
    console.log(startDay.format('YYYY-MM-DD'));

    setDayParams({
      // ...params,
      studyCycle: studyCycleNum.join(','),
      studyWeekCount: num,
      startDate: startDay.format('YYYY-MM-DD'),
    });
    setButtonFlag(true);
    setSelectedQuizIds([]);
  };
  const handlerClubMakeManual = () => {
    const weeks = [];
    for (let i = 0; i < num; i++) {
      weeks.push({
        order: i + 1,
        quizSequence: null,
      });
    }
    setScheduleData(weeks);
    setButtonFlag(true);
  };

  const handlerClubMakeProfessorManual = () => {
    const weeks = [];
    for (let i = 0; i < 2; i++) {
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
                  value={session.publishDate.split('-')[1]}
                  onChange={e => handleInputDayChange(index, 'month', e.target.value)}
                ></input>
                <input
                  style={{ padding: 0, height: 25, width: 25, textAlign: 'center' }}
                  type="text"
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

  const handleUniversityChangeQuiz = e => {
    setUniversityCodeQuiz(e.target.value);
  };

  const handleJobChangeQuiz = e => {
    setSelectedJobQuiz(e.target.value);
  };

  const handleLevelChangeQuiz = e => {
    setSelectedLevel(e.target.value);
  };

  const classes = useStyles();

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <Desktop>
          <div className="tw-pt-[40px] tw-pt-5 tw-pb-0">
            <Stack spacing={2}>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Typography key="1" variant="body2">
                  강의클럽
                </Typography>
                <Typography key="2" color="text.primary" variant="body2">
                  강의 개설하기
                </Typography>
              </Breadcrumbs>
              <div className="tw-flex tw-justify-between tw-items-center tw-left-0 !tw-mt-0 tw-gap-4">
                <div className="tw-flex tw-justify-start tw-items-center tw-gap-4">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-2xl tw-font-extrabold tw-text-left tw-text-black">
                    강의 개설하기
                  </p>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                    학습자들의 성장을 이끌 강의를 개설해요!
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
                성장퀴즈 &gt; 성장퀴즈 클럽 개설하기
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
              <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">강의 기본정보 입력</div>
              <div className={cx('content-area')}>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-2">강의명</div>
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
                        <option>대학을 선택해주세요.</option>
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
                          value={startDay}
                          onChange={e => onChangeHandleFromToStartDate(e)}
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
                          setLevelNames(prevNames => [...prevNames, item.name]);
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
                      <TagsInput
                        value={studyKeywords}
                        onChange={setStudyKeywords}
                        name="fruits"
                        placeHolder="학습 키워드를 입력해주세요. 입력 후 엔터를 쳐주세요"
                      />
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
                        {/* <select
                          className="form-select"
                          aria-label="Default select example"
                          disabled={jobs.length === 0}
                          onChange={handleJobChange}
                          value={selectedJob}
                        >
                          <option disabled value="">
                            학과를 선택해주세요.
                          </option>
                          {jobs.map((job, index) => (
                            <option key={index} value={job.code}>
                              {job.name}
                            </option>
                          ))}
                        </select> */}
                      </div>
                    </div>
                  </div>

                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">언어 설정</div>
                  <div className="tw-grid tw-grid-cols-3 tw-gap-8 tw-py-5">
                    <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">강의언어</p>
                      <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                        <select className="tw-px-5 tw-w-full tw-text-black">
                          <option value="ko">한국어</option>
                          <option value="en">영어</option>
                        </select>
                      </div>
                    </div>
                    <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                        콘텐츠언어
                      </p>
                      <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                        <select className="tw-px-5 tw-w-full tw-text-black">
                          <option value="ko">한국어</option>
                          <option value="en">영어</option>
                        </select>
                      </div>
                    </div>
                    <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                        AI대화언어
                      </p>
                      <div className="tw-flex-grow tw-flex-shrink tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                        <select className="tw-px-5 tw-w-full tw-text-black">
                          <option value="ko">한국어</option>
                          <option value="en">영어</option>
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
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    className={`image-item ${
                      selectedImage === image ? 'selected' : ''
                    } tw-object-cover tw-w-[100px] tw-rounded-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg`}
                    style={{ opacity: selectedImage !== image ? 0.2 : 1 }}
                    onClick={() => handleImageClick(image)}
                  />
                ))}
              </div>

              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-5">강의 배경 이미지 선택</div>
              <div className="tw-grid tw-grid-flow-col tw-gap-0 tw-content-end">
                {imageBanner.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    className={`image-item ${
                      selectedImageBanner === image ? 'selected' : ''
                    } tw-object-cover tw-w-[260px] tw-rounded-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[260px] md:tw-rounded-lg`}
                    style={{ opacity: selectedImageBanner !== image ? 0.2 : 1 }}
                    onClick={() => handleImageClick(image)}
                  />
                ))}
              </div>

              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-5">
                강의내 교수 프로필 이미지
              </div>

              <img
                src="/assets/images/account/default_profile_image.png"
                alt="Image"
                className="tw-w-[100px] tw-h-[100px] tw-rounded-lg"
              />
              <div className="tw-text-sm tw-font-bold tw-text-black tw-mt-5 tw-my-5">
                직접 업로드를 하지 않으면 현재 프로필 이미지 사용합니다.
              </div>

              <button
                onClick={() => router.push('/lecture/open')}
                type="button"
                className="tw-text-black tw-mr-5 border border-dark tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
              >
                + 직접 업로드
              </button>
              <button
                onClick={() => router.push('/lecture/open')}
                type="button"
                className="tw-text-black border tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
              >
                삭제
              </button>

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
                      className="tw-w-[150px]  tw-bg-gray-200 tw-text-gray-400 tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-text-sm tw-rounded"
                      onClick={handleNextOne}
                    >
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기' : '다음'}{' '}
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
                  <p className="tw-text-xl tw-font-bold tw-text-left tw-text-black tw-py-5">강의 커리큘럼 입력</p>
                  <p className="tw-text-base tw-text-left tw-text-black">
                    <span className="tw-text-base tw-text-left tw-text-black">
                      회차별 강의 제목 및 커리큘럼을 입력해주세요. 날짜와 온/오프라인 여부 및 강의자료 업로드 등 강의에
                      대한 상세 내용을 구성해주세요. <br />
                      추후 강의 대시보드에서도 수정이 가능합니다~ 순서 변경 및 삭제로 편집하여 커리큘럼을 만들어주세요!
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

                <div className="tw-mt-10"></div>

                <Grid container direction="row" justifyContent="left" alignItems="flex-start" rowSpacing={4}>
                  <Grid item xs={1}>
                    {scheduleData.map((item, index) => {
                      return (
                        <div key={index} className="tw-h-[209px] tw-flex tw-flex-col tw-items-center tw-justify-start">
                          {/* <div className=" tw-text-center tw-text-black tw-font-bold tw-mt-5">강의</div> */}
                          {item.weekNumber && (
                            <div className="tw-text-center tw-text-lg tw-text-black tw-font-bold tw-mt-4">
                              {item.weekNumber} 회차 {item.dayOfWeek ? `(${item.dayOfWeek})` : ''}
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

                <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
                  <div className="tw-w-1/12 tw-flex tw-justify-center tw-items-center">
                    <div className="tw-w-[59px] tw-h-[46px] tw-relative tw-flex tw-flex-col tw-items-center">
                      <p className="tw-text-base tw-font-bold tw-text-center tw-text-[#ced4de]">회차</p>
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
                          <button type="button" onClick={handleAddClick} className="tw-text-black tw-text-sm ">
                            강의회차 추가하기
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
                        value={participationCode}
                        onChange={e => setParticipationCode(e.target.value)}
                        placeholder="강의자료 URL을 입력해주세요."
                        id="margin-none"
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
                  </div>

                  <div className="tw-w-full tw-flex tw-justify-end tw-px-5 tw-items-center">
                    {inputList.length > 0 && (
                      <div className="tw-mt-3 tw-flex  tw-py-2 tw-w-[664px]">
                        <div className="tw-flex-1 tw-text-left tw-pl-5">
                          {inputList.map((input, index) => (
                            <div key={input.id} style={{ marginBottom: '10px' }}>
                              <div className="tw-flex tw-items-center tw-gap-2">
                                <TextField
                                  fullWidth
                                  className="tw-pl-1"
                                  size="small"
                                  value={participationCode}
                                  placeholder="강의자료 URL을 입력해주세요."
                                  onChange={event => handleInputChange(input.id, event)}
                                  id="margin-none"
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
                                {/* <input
                                type="text"
                                className="border tw-w-full tw-rounded tw-text-sm tw-p-2"
                                value={input.url}
                                placeholder="http://"

                              /> */}
                                <button
                                  className="tw-text-white tw-bg-black tw-rounded tw-w-[60px] tw-py-2 tw-ml-2"
                                  onClick={() => handleDeleteInput(input.id)}
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

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
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '다음'}
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
              <LectureDetailInfo
                selectedImageBanner={selectedImageBanner}
                selectedImage={selectedImage}
                border={true}
                clubData={paramss?.clubForm}
                user={user}
                selectedUniversityName={selectedUniversityName}
                jobLevelName={levelNames}
                selectedJobName={personName}
                selectedQuizzes={scheduleData}
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
    </div>
  );
}

export default LectureOpenTemplate;
