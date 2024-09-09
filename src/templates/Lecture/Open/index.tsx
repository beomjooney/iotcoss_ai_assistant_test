import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { paramProps } from 'src/services/seminars/seminars.queries';
import { useContentJobTypes, useJobGroupss } from 'src/services/code/code.queries';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { UseQueryResult } from 'react-query';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { ExperiencesResponse } from 'src/models/experiences';
import { useOptions } from 'src/services/experiences/experiences.queries';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { useMyQuiz, useQuizList, useGetSchedule, useLectureGetTemp } from 'src/services/jobs/jobs.queries';
import Checkbox from '@mui/material/Checkbox';
import {
  useClubQuizSave,
  useQuizSave,
  useClubTempSave,
  useLectureTempSave,
  useLectureSave,
} from 'src/services/quiz/quiz.mutations';
import { TagsInput } from 'react-tag-input-component';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { makeStyles } from '@mui/styles';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigatePrevIcon from '@mui/icons-material/NavigateBefore';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LectureBreakerInfo from 'src/stories/components/LectureBreakerInfo';
import LectureOpenDetailInfo from 'src/stories/components/LectureOpenDetailInfo';
/** drag list */
import ReactDragList from 'react-drag-list';
import DraggableList from 'react-draggable-list';
import { useStore } from 'src/store';

import { InputAdornment, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { Toggle, Tag } from 'src/stories/components';

//group
import { images, imageBanner } from './group';
import validator from 'validator';
import { useQuizFileDownload } from 'src/services/quiz/quiz.queries';

import { v4 as uuidv4 } from 'uuid';

export const generateUUID = () => {
  return uuidv4();
};

const cx = classNames.bind(styles);

const defaultScheduleData = [];
for (let i = 0; i < 2; i++) {
  defaultScheduleData.push({
    studyOrder: i + 1,
    clubStudyName: '',
    urls: [],
    files: [],
    clubStudyType: '0100',
    clubStudyUrl: '',
    studyDate: dayjs().add(i, 'day').format('YYYY-MM-DD'), // i 만큼 날짜를 증가시킴
  });
}

export function LectureOpenTemplate() {
  const router = useRouter();
  const [startDay, setStartDay] = React.useState<Dayjs | null>(dayjs());
  const [endDay, setEndDay] = React.useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [participationCode, setParticipationCode] = useState('');
  const [urlCode, setUrlCode] = useState('');
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
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [personName, setPersonName] = useState([]);
  const [inputList, setInputList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [lectureLanguage, setLectureLanguage] = useState('kor');
  const [contentLanguage, setContentLanguage] = useState('kor');
  const [lectureAILanguage, setLectureAILanguage] = useState('kor');
  const [skillIdsPopUp, setSkillIdsPopUp] = useState<any[]>([]);
  const [experienceIdsPopUp, setExperienceIdsPopUp] = useState<any[]>([]);
  const [isPublic, setIsPublic] = useState('0001');
  const [studyKeywords, setStudyKeywords] = useState([]);
  const [studyChapter, setStudyChapter] = useState('');
  const [studySubject, setStudySubject] = useState('');
  const [skills, setSkills] = useState([]);
  const [universityCodeQuiz, setUniversityCodeQuiz] = useState<string>('');
  const [selectedJobQuiz, setSelectedJobQuiz] = useState<string>('');

  const steps = ['Step.1 강의 정보입력', 'Step.2 강의 커리큘럼 입력', 'Step.3 개설될 강의 미리보기'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [quizUrl, setQuizUrl] = React.useState('');
  const [quizName, setQuizName] = React.useState('');

  const [recommendLevels, setRecommendLevels] = useState([]);
  const [universityCode, setUniversityCode] = useState<string>('');
  const [levelNames, setLevelNames] = useState([]);

  const [quizType, setQuizType] = useState('0100');
  const [recommendLevelsPopUp, setRecommendLevelsPopUp] = useState([]);
  const [clubName, setClubName] = useState<string>('');
  const [num, setNum] = useState(0);
  const [active, setActive] = useState(0);

  const [keyWorld, setKeyWorld] = useState('');
  const [myKeyWorld, setMyKeyWorld] = useState('');

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

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
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

  // jobLevels 코드에 해당하는 이름을 찾는 함수
  const getJobLevelNames = (jobLevelCodes, jobLevels) => {
    return jobLevelCodes?.map(code => {
      const jobLevel = jobLevels.find(level => level.code === code.toString().padStart(4, '0'));
      return jobLevel ? jobLevel.name : '';
    });
  };

  //불러오기
  const { refetch: refetchGetTemp }: UseQueryResult<any> = useLectureGetTemp(data => {
    console.log('load temp', data);
    const clubForm = data?.clubForm || {};
    const lectureList = data?.clubStudies || [];
    const lectureContents = data?.lectureContents || [];

    // lectureContents가 빈 객체이면 빈 배열로 변경
    // if (Object.keys(lectureContents).length === 0) {
    //   lectureContents([]);
    // }

    setParamss(clubForm);

    setClubName(clubForm.clubName || '');
    setStartDay(clubForm.startAt ? dayjs(clubForm.startAt) : dayjs());
    setEndDay(clubForm.endAt ? dayjs(clubForm.endAt) : dayjs());
    setIsPublic(clubForm.isPublic ? '0001' : '0002');
    setStudyKeywords(clubForm.studyKeywords || []);
    setStudySubject(clubForm.studySubject || '');
    setUniversityCode(clubForm.jobGroups || '');
    setRecommendLevels(clubForm.jobLevels || '');
    console.log(clubForm?.jobLevels?.map(item => item.name));
    const selectedLevel = optionsData?.data?.jobLevels?.find(u => u.code === clubForm?.jobLevels?.toString());

    // clubForm.jobLevels의 이름 리스트 생성
    const jobLevelNames = getJobLevelNames(clubForm.jobLevels, optionsData?.data?.jobLevels || []);
    console.log('jobLevelNames', jobLevelNames);
    setLevelNames(jobLevelNames);

    const selected = optionsData?.data?.jobs?.find(u => u.code === clubForm?.jobGroups?.toString());
    setSelectedUniversityName(selected?.name || '');
    setJobs(selected ? selected.jobs : []);
    setSelectedJob(clubForm.jobs || []);

    const names = selected?.jobs
      .filter(department => clubForm.jobs.includes(department.code))
      .map(department => department.name);

    setPersonName(names || []);
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

    // // Filter out items with quizSequence not null and extract quizSequence values
    // const quizSequenceNumbers = quizList.filter(item => item.quizSequence !== null).map(item => item.quizSequence);
    // setSelectedQuizIds(quizSequenceNumbers);
  });

  //temp 등록
  const { mutate: onTempSave, isSuccess: tempSucces } = useLectureTempSave();
  const { mutate: onQuizSave, isSuccess: postSucces } = useQuizSave();
  const { mutate: onLectureSave, isError, isSuccess: clubSuccess, data: clubDatas } = useLectureSave();

  //quiz new logic
  const [selectedQuizIds, setSelectedQuizIds] = useState([]);

  const quizRef = useRef(null);
  const quizUrlRef = useRef(null);

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

  const [contentJobType, setContentJobType] = useState<any[]>([]);
  // const [lectureContents, setLectureContents] = useState<any[]>([]);
  const [lectureContents, setLectureContents] = useState({
    files: [],
    urls: [],
  });

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  let [key, setKey] = useState('');
  let [fileName, setFileName] = useState('');

  const { isFetched: isParticipantListFetcheds, isSuccess: isParticipantListSuccess } = useQuizFileDownload(
    key,
    data => {
      console.log('file download', data, fileName);
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
    },
  );

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key, fileName);
    setKey(key);
    setFileName(fileName);
    // onFileDownload(key);
  };

  useEffect(() => {
    console.log('lectureContents', lectureContents);
  }, [lectureContents]);
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

  const handleProfileDelete = e => {
    setPreviewProfile(null);
    setSelectedImageProfileCheck(null);
  };

  // 파일 이름 추출 함수
  const extractFileName = path => {
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  useEffect(() => {
    handleImageClick(selectedImageProfile, 'profile', false);
  }, []);

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

  const [introductionText, setIntroductionText] = useState<string>('');
  const [recommendationText, setRecommendationText] = useState<string>('');
  const [learningText, setLearningText] = useState<string>('');
  const [memberIntroductionText, setMemberIntroductionText] = useState<string>('');
  const [careerText, setCareerText] = useState<string>('');

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

  useDidMountEffect(() => {
    refetchMyJob();
  }, [postSucces]);

  // Function to handle adding new data
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

  useEffect(() => {
    setParams({
      ...params,
      page,
      recommendJobGroups: jobGroupsFilter.join(','),
      recommendLevels: levelsFilter.join(','),
      seminarStatus: seminarFilter.join(','),
    });
  }, [page, jobGroupsFilter, levelsFilter, seminarFilter]);

  const { isFetched: isJobGroupsFetched } = useJobGroupss(data => setJobGroups(data.data.contents || []));
  const { user, setUser } = useStore();

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

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNextTwo = () => {
    console.log('next');
    handlerClubSaveTemp('validation');
  };
  const [updateKey, setUpdateKey] = useState(0); // 상태 업데이트 강제 트리거를 위한 키

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

  const handleCheckboxDelete = orderToDelete => {
    console.log('delete', orderToDelete);

    // Step 1: Filter out the item with the given order to delete
    const updatedData = scheduleData.filter(item => item.studyOrder !== orderToDelete);

    // Step 2: Reassign studyOrder sequentially to maintain correct order after deletion
    const adjustedData = updatedData.map((item, index) => {
      return {
        ...item,
        studyOrder: index + 1, // Assign new studyOrder starting from 1
      };
    });

    // Update state with the adjusted data
    setScheduleData(adjustedData);
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

  const handleUpdate = (evt: any, updated: any) => {
    console.log('handleUpdate', updated);
    // 인덱스로 일정 항목을 보유할 맵
    // const scheduleMap = updated.reduce((acc, item, index) => {
    //   acc[index] = item;
    //   return acc;
    // }, {});
    // // 관련 필드만 추출하고 'order'로 정렬
    const sortedReducedData = updated
      .map(({ order, dayOfWeek, weekNumber, publishDate }) => ({
        order,
        dayOfWeek,
        weekNumber,
        publishDate,
      }))
      .sort((a, b) => a.order - b.order);
    console.log(sortedReducedData);
    // // 정렬된 데이터와 원본 항목의 추가 속성을 병합
    // const mergeData = sortedReducedData.map((item, index) => ({
    //   ...item,
    //   quizSequence: scheduleMap[index].quizSequence,
    //   question: scheduleMap[index].question,
    //   leaderUri: scheduleMap[index].leaderUri,
    //   leaderUUID: scheduleMap[index].leaderUUID,
    //   leaderProfileImageUrl: scheduleMap[index].leaderProfileImageUrl,
    //   leaderNickname: scheduleMap[index].leaderNickname,
    //   contentUrl: scheduleMap[index].contentUrl,
    //   contentTitle: scheduleMap[index].contentTitle,
    //   modelAnswer: scheduleMap[index].modelAnswer,
    //   quizUri: scheduleMap[index].quizUri,
    // }));
    // // 상태 업데이트
    // setScheduleData(mergeData);
  };

  useEffect(() => {
    // 상태 업데이트 후 추가 작업 수행
    console.log('scheduleData가 업데이트되었습니다.', scheduleData);
    // setUpdateKey를 호출하여 강제 리렌더링
    // setUpdateKey(prevKey => prevKey + 1);
  }, [scheduleData]);

  const containerRef = useRef(null);

  const _onListChange = newList => {
    setScheduleData(newList);
  };

  const Item = React.forwardRef(({ item, itemSelected, dragHandleProps }, ref) => {
    const { onMouseDown, onTouchStart } = dragHandleProps;

    return (
      <div key={item.studyOrder} ref={ref}>
        <LectureBreakerInfo
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          handleStartDayChange={handleStartDayChange}
          handleUrlChange={handleUrlChange}
          handleTypeChange={handleTypeChange}
          lectureNameChange={lectureNameChange}
          handleRemoveInput={handleRemoveInput}
          scheduleUrlAdd={scheduleUrlAdd}
          scheduleFileAdd={scheduleFileAdd}
          handleRemoveFile={handleRemoveFile}
          onFileDownload={onFileDownload}
          item={item}
          // avatarSrc={item.leaderProfileImageUrl}
          urlList={item.urls}
          fileList={item.files}
          userName={item.leaderNickname}
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
  });

  const handleNextThree = () => {
    console.log('NextLast');
    // setActiveStep(prevActiveStep => prevActiveStep + 1);
    handlerClubSaveTemp('save');
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
    handlerClubSaveTemp('validation');
  };
  useEffect(() => {
    console.log('activeStep 업데이트되었습니다.', activeStep);
  }, [activeStep]);

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleInputStudySubjectChange = event => {
    setStudySubject(event.target.value);
  };

  const onMessageChange1 = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setIntroductionText(value);
  };

  const handlerClubTemp = async () => {
    await refetchGetTemp();
  };

  const handlerQuizInit = async () => {
    const defaultScheduleDataInit = [];
    for (let i = 0; i < 2; i++) {
      defaultScheduleDataInit.push({
        studyOrder: i + 1,
        clubStudyName: '',
        urls: [],
        files: [],
        clubStudyType: '0100',
        clubStudyUrl: '',
        studyDate: dayjs().add(i, 'day').format('YYYY-MM-DD'), // i 만큼 날짜를 증가시킴
      });
    }

    setScheduleData(defaultScheduleDataInit);
  };

  //임시저장
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

      if (activeStep === 1) {
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
      const nextDay = dayjs(item.studyDate).add(1, 'day').format('YYYY-MM-DD');
      formData.append(`clubStudies[${i}].studyDate`, nextDay);
    }

    console.log('formData', lectureContents);

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

    if (type === 'temp') {
      onTempSave(formData);
    } else if (type === 'save') {
      // onLectureSave(formData);
    } else if (type === 'validation') {
      console.log(prevActiveStep => prevActiveStep + 1);
      setActiveStep(prevActiveStep => prevActiveStep + 1);
      setParamss(clubFormParams);
      window.scrollTo(0, 0);
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

  const newCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

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
                      {/* <TagsInput
                        value={studyKeywords}
                        onChange={setStudyKeywords}
                        name="fruits"
                        placeHolder="학습 키워드 입력 후 엔터"
                      /> */}
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

              <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
                <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                  <div className="tw-row-span-2">
                    <button
                      className="tw-w-[150px] border tw-mr-4 tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded tw-text-sm"
                      onClick={() => handlerClubSaveTemp('temp')}
                    >
                      임시 저장하기
                    </button>
                    <button
                      className="tw-w-[150px]  tw-bg-blue-600 tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-text-sm tw-rounded"
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
                        강의 초기화
                      </p>
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
                              {index + 1} 회차
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
                      onClick={() => handlerClubSaveTemp('temp')}
                    >
                      임시 저장하기
                    </button>
                    <button
                      className="tw-w-[150px] tw-bg-blue-600 tw-text-white  tw-text-sm tw-font-bold tw-py-3 tw-px-4 tw-rounded tw-flex tw-items-center tw-justify-center tw-gap-1"
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
              <LectureOpenDetailInfo
                selectedImageBanner={previewBanner}
                selectedImage={preview}
                selectedProfile={previewProfile}
                border={true}
                clubData={paramss}
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
                    className="tw-w-[240px] tw-text-sm tw-bg-blue-600 tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-rounded tw-flex tw-items-center tw-justify-center tw-gap-1"
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
