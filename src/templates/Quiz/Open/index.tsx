import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Button, Chip, MentorsModal, Pagination, Toggle } from 'src/stories/components';
import React, { useEffect, useState, useRef } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useSeminarList, paramProps, useSeminarImageList } from 'src/services/seminars/seminars.queries';
import { useContentJobTypes, useContentTypes, useJobGroups, useJobGroupss } from 'src/services/code/code.queries';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/system/Box';
import Image from 'next/image';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { UseQueryResult } from 'react-query';
import { useSkills } from '../../../../src/services/skill/skill.queries';
import { SkillResponse } from '../../../../src/models/skills';
import { DatePicker, DateTimePicker, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { ExperiencesResponse } from 'src/models/experiences';
import { useExperiences } from 'src/services/experiences/experiences.queries';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { useRecommendContents } from 'src/services/contents/contents.queries';
import { useJobs, useMyQuiz, useQuizList } from 'src/services/jobs/jobs.queries';
import Checkbox from '@mui/material/Checkbox';
import { useClubQuizSave, useQuizSave } from 'src/services/quiz/quiz.mutations';
import { TagsInput } from 'react-tag-input-component';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useUploadImage } from 'src/services/image/image.mutations';
import { makeStyles, withStyles } from '@mui/styles';
import styled from '@emotion/styled';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
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

//group
import { dayGroup, privateGroup, levelGroup, openGroup } from './group';

const clubInfo = {
  intro: '비전공자 개발자라면, 컴퓨터 공학 지식에 대한 갈증이 있을텐데요...',
  benefits: '개발에 대한 기초적인 지식을 기반으로...',
  schedule: '2023.06.01 - 2023.06.18 / 주2회(월, 수) 총 36개 퀴즈',
  recommendation: '컴공에 대한 기초적인 지식이 있으신 분...',
};

const leaders = {
  name: '양황규 교수님',
  position: '교수ㅣ컴퓨터공학과ㅣ20년차',
  description: '동서대학교 석현태 교수입니다.',
  greeting: '안녕하세요. 이 퀴즈 클럽을 운영하게 된 양황규 교수입니다...',
  career: '(현) 카카오 개발 리더...',
  projects: '카카오 모빌리티 앱 개발...',
  tags: ['JAVA', 'Spring5', 'Go'],
  departments: [
    { label: '소프트웨어융합대학', bgColor: 'tw-bg-[#d7ecff]', textColor: 'tw-text-[#235a8d]' },
    { label: '컴퓨터공학과', bgColor: 'tw-bg-[#e4e4e4]', textColor: 'tw-text-[#313b49]' },
  ],
};

const representativeQuizzes = [
  { question: 'ESB와 API Gateway 차이점에 대해서 설명하세요' },
  { question: 'Grafana 주요기능 및 역할에 대해서 설명하세요.' },
  { question: '대용량 DB 트래픽 처리를 위한 Query Off Loading에 대해서 설명하세요.' },
];

const clubQuizzes = {
  title: '임베디드 시스템',
  details: '[전공선택] 3학년 화요일 A반',
  schedule: '학습 주기 : 매주 화요일 (총 12회)',
  duration: '학습 기간 : 12주 (2024. 09. 03 ~ 2024. 11. 03)',
  participants: '참여 인원 : 24명',
  leader: '양황규 교수',
  tags: [
    { label: '소프트웨어융합대학', bgColor: 'tw-bg-[#d7ecff]', textColor: 'tw-text-[#235a8d]' },
    { label: '컴퓨터공학과', bgColor: 'tw-bg-[#e4e4e4]', textColor: 'tw-text-[#313b49]' },
    { label: '3학년', bgColor: 'tw-bg-[#ffdede]', textColor: 'tw-text-[#b83333]' },
  ],
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    display: 'none', //
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      display: 'none', // line 스타일을 제거하고 감춥니다.
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      display: 'none', // line 스타일을 제거하고 감춥니다.
    },
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: '#EFEFEF',
  zIndex: 1,
  color: '#fff',
  width: 350,
  height: 8,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: '#E11837',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#E11837',
  }),
  '@media (max-width: 1024px)': {
    // 모바일 화면 크기에 따라 변경
    width: 60,
  },
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;
  return <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}></ColorlibStepIconRoot>;
}

const cx = classNames.bind(styles);

export function QuizOpenTemplate() {
  // const { contentTypes, setContentTypes } = useStore();
  const [searchParams, setSearchParams] = useState({});
  const onChangeKeyword = event => {
    const { name, value } = event.currentTarget;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const onChange = (name, value) => {
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const [startDay, setStartDay] = React.useState<Dayjs | null>(dayjs());
  const [endDay, setEndDay] = React.useState<Dayjs | null>(dayjs());
  // const [today, setToday] = useState(dayjs().add(1, 'month'));

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
      setEndDay(formattedDate); // You can also format this if needed
    }
  };

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);
  const [jobGroups, setJobGroups] = useState<any[]>([]);
  const [seminarFilter, setSeminarFilter] = useState(['0002']);
  const [paramss, setParamss] = useState({});
  const [params, setParams] = useState<paramProps>({ page });
  const [myParams, setMyParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  // const [images, setSeminarImages] = useState<any[]>([]);
  const [quizList, setQuizList] = useState<any[]>([]);
  const [quizListCopy, setQuizListCopy] = useState<any[]>([]);
  const [quizListOrigin, setQuizListOrigin] = useState<any[]>([]);
  const [quizListParam, setQuizListParam] = useState<any[]>([]);
  const [quizListData, setQuizListData] = useState<any[]>([]);
  const [allQuizData, setAllQuizData] = useState([]);

  // const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data.data.contents || []));
  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();

  // const { data: quizListData, refetch }: UseQueryResult<any> = useQuizList(params);
  const { isFetched: isQuizData, refetch } = useQuizList(params, data => {
    setQuizListData(data.contents || []);
    setTotalPage(data.totalPages);
  });
  const { data: myQuizListData, refetch: refetchMyJob }: UseQueryResult<any> = useMyQuiz(myParams);

  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<any[]>([]);
  const [skillIdsPopUp, setSkillIdsPopUp] = useState<any[]>([]);
  const [experienceIdsPopUp, setExperienceIdsPopUp] = useState<any[]>([]);
  const [fileImageUrl, setFileImageUrl] = useState(null);
  const [isPublic, setIsPublic] = useState('공개');
  const [selected, setSelected] = useState([]);
  const { mutate: onSaveImage, data: imageUrl, isSuccess: imageSuccess } = useUploadImage();
  const [file, setFile] = useState(null);
  const [keyWorld, setKeyWorld] = useState('');
  const [myKeyWorld, setMyKeyWorld] = useState('');
  const { mutate: onQuizSave, isSuccess: postSucces } = useQuizSave();
  const { mutate: onClubQuizSave, isError, isSuccess: clubSuccess } = useClubQuizSave();

  //quiz new logic
  const [selectedQuizIds, setSelectedQuizIds] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);

  const quizRef = useRef(null);
  const quizUrlRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState('/assets/images/banner/Rectangle_190.png');

  const images = [
    '/assets/images/banner/Rectangle_190.png',
    '/assets/images/banner/Rectangle_191.png',
    '/assets/images/banner/Rectangle_192.png',
    '/assets/images/banner/Rectangle_193.png',
    '/assets/images/banner/Rectangle_195.png',
    '/assets/images/banner/Rectangle_196.png',
    '/assets/images/banner/Rectangle_197.png',
    '/assets/images/banner/Rectangle_198.png',
    '/assets/images/banner/Rectangle_199.png',
  ];

  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [contentTypes, setContentTypes] = useState<any[]>([]);
  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setContentTypes(data.data.contents || []);
  });

  useEffect(() => {
    // Merge new data from quizListData into allQuizData
    setAllQuizData(prevAllQuizData => {
      const mergedQuizData = [...prevAllQuizData];
      const existingSequences = new Set(mergedQuizData.map(quiz => quiz.sequence));

      quizListData.forEach(quiz => {
        if (!existingSequences.has(quiz.sequence)) {
          mergedQuizData.push(quiz);
          existingSequences.add(quiz.sequence);
        }
      });

      return mergedQuizData;
    });
  }, [quizListData]);

  useEffect(() => {
    setParams({
      // ...params,
      page,
      keyword: keyWorld,
    });
  }, [page, keyWorld]);

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

  const handleFormat = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setSkillIds(newFormats);
    //console.log(newFormats);
  };
  const handleFormatEx = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setExperienceIds(newFormats);
    //console.log(newFormats);
  };
  const handleFormatPopUp = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setSkillIdsPopUp(newFormats);
    //console.log(newFormats);
  };
  const handleFormatExPopUp = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setExperienceIdsPopUp(newFormats);
    //console.log(newFormats);
  };

  const [introductionMessage, setIntroductionMessage] = useState<string>('');
  const handleJobGroup = (event: React.MouseEvent<HTMLElement>, newFormats: { id: string; name: string }[]) => {
    if (newFormats) {
      setRecommendJobGroups(newFormats.id);
      setRecommendJobGroupsName([newFormats.name]);
      setRecommendJobGroupsObject(newFormats);
      //console.log(newFormats);
    }
  };
  const handleJobs = (event: React.MouseEvent<HTMLElement>, newFormats: { id: string; name: string }[]) => {
    if (newFormats) {
      setJobGroupName([newFormats.name]);
      setJobGroup(newFormats.id);
      setJobGroupObject(newFormats);
    }
    //console.log(newFormats.id);
  };
  const handleRecommendLevelsPopUp = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    if (newFormats) {
      setRecommendLevelsPopUp(newFormats);
    }
  };

  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    if (newFormats) {
      setRecommendLevels(newFormats);
    }
  };
  const handleRecommendType = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    if (newFormats) {
      setRecommendType(newFormats);
    }
  };

  const handleStudyCycle = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setStudyCycle(newFormats);
  };

  const handleIsPublic = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    setIsPublic(newFormats);
  };
  const handleToggleRecommandJobGroup = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendJobGroups(newFormats);
  };

  useDidMountEffect(() => {
    //console.log('delete 1 !!!', params, page);
    refetchMyJob();
  }, [postSucces]);

  // const { isFetched: isContentFetched } = useSeminarList(params, data => {
  //   setContents(data.data || []);
  //   setTotalPage(data.totalPage);
  // });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleQuizInsertClick = () => {
    const params = {
      content: quizName,
      articleUrl: quizUrl,
      recommendJobGroups: [jobGroupPopUp],
      recommendJobs: jobs,
      recommendLevels: [recommendLevelsPopUp],
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
      alert('추천 레벨을 선택해주세요.');
      return;
    }

    setQuizUrl('');
    setQuizName('');
    onQuizSave(params);
    setActive(2);
  };

  function getObjectsWithSequences(arr, sequenceArray) {
    //console.log(arr, sequenceArray);

    return arr
      .filter(item => sequenceArray.includes(String(item.sequence)))
      .map(item => ({
        ...item,
        quizSequence: 1,
        order: 0,
        isRepresentative: false,
        // isPublic: true,
        // publishAt: '2023-08-22 00:00:00',
      }));
  }

  function handleDeleteQuiz(quizSequence) {
    //console.log('delete', quizSequence);

    // "sequence"가 71인 객체를 제외하고 새로운 배열 생성
    const filteredData = quizListOrigin.filter(item => item.sequence !== quizSequence);
    //console.log('filteredData', filteredData);
    //console.log('quizListCopy', quizListCopy);
    //console.log('quizListOrigin', quizListOrigin);

    // filter 메서드를 사용하여 특정 quizSequence를 가진 요소를 제거하고 키 제거
    // map 메서드를 사용하여 targetSequence에 해당하는 요소만 수정
    const modifiedArray = quizListOrigin.map(item => {
      if (item.quizSequence === quizSequence) {
        const { isRepresentative, memberName, order, quizSequence, content, ...rest } = item;
        return rest;
      }
      return item;
    });

    //console.log('modifiedArray', modifiedArray);

    //console.log('filteredArray1', state, quizSequence, resultArray1);
    const filteredArray = state.filter(item => {
      if (quizSequence !== undefined) {
        return item !== quizSequence.toString();
      }
      // 만약 quizSequence가 undefined이면 여기서 필터링을 하지 않고 모든 아이템을 유지합니다.
      return true;
    });

    //console.log('filteredArray', filteredArray);
    //console.log('filtmodifiedArrayeredArray2', modifiedArray);
    //console.log('filteredData', filteredData);
    setState(filteredArray);
    setQuizListCopy(modifiedArray);
    setQuizList(filteredArray);
    setQuizListOrigin(modifiedArray);
  }
  function handleClickQuiz(quizSequence, flag) {
    //console.log(quizSequence, flag);
    // "quizSequence"가 83인 객체를 찾아서 "isRepresentative" 값을 변경
    const updatedData = quizListOrigin.map(item => {
      if (item.quizSequence === quizSequence) {
        return {
          ...item,
          isRepresentative: !flag,
        };
      }
      return item;
    });
    //console.log(updatedData);
    // "isRepresentative" 값이 true인 개수를 세기 위한 변수
    let countIsRepresentative = 0;

    // 데이터를 순회하면서 "isRepresentative" 값이 true인 경우 카운트 증가
    updatedData.forEach(quiz => {
      if (quiz.isRepresentative === true) {
        countIsRepresentative++;
      }
    });

    // "isRepresentative" 값이 4개 이상인 경우 알림 창 표시
    if (countIsRepresentative >= 4) {
      alert('대표 퀴즈는 3개입니다.');
    } else {
      setQuizListOrigin(updatedData);
    }
  }
  //new logic
  const handleCheckboxChange = quizSequence => {
    setSelectedQuizIds(prevSelectedQuizIds => {
      const updatedSelectedQuizIds = prevSelectedQuizIds.includes(quizSequence)
        ? prevSelectedQuizIds.filter(id => id !== quizSequence)
        : [...prevSelectedQuizIds, quizSequence];

      console.log('Updated Selected Quiz IDs:', updatedSelectedQuizIds);

      // Update selectedQuizzes by filtering from allQuizData
      setSelectedQuizzes(prevSelectedQuizzes => {
        // Remove quiz if it is already in selected quizzes, else add it
        const alreadySelected = prevSelectedQuizzes.some(quiz => quiz.sequence === quizSequence);

        if (alreadySelected) {
          return prevSelectedQuizzes.filter(quiz => quiz.sequence !== quizSequence);
        } else {
          const newQuiz = allQuizData.find(quiz => quiz.sequence === quizSequence);
          return newQuiz
            ? [...prevSelectedQuizzes, { ...newQuiz, isRepresentative: newQuiz.isRepresentative || false }]
            : prevSelectedQuizzes;
        }
      });

      return updatedSelectedQuizIds;
    });
  };

  const handleCheckboxDelete = quizSequence => {
    setSelectedQuizIds(prevSelectedQuizIds => {
      const updatedSelectedQuizIds = prevSelectedQuizIds.filter(id => id !== quizSequence);

      console.log('After Deletion, Selected Quiz IDs:', updatedSelectedQuizIds);

      setSelectedQuizzes(prevSelectedQuizzes => prevSelectedQuizzes.filter(quiz => quiz.sequence !== quizSequence));

      return updatedSelectedQuizIds;
    });
  };

  const handleCheckboxIsRepresentative = sequence => {
    setSelectedQuizzes(prevSelectedQuizzes => {
      const updatedSelectedQuizzes = prevSelectedQuizzes.map(quiz =>
        quiz.sequence === sequence ? { ...quiz, isRepresentative: !quiz.isRepresentative } : quiz,
      );

      console.log('Updated Selected Quizzes with isRepresentative:', updatedSelectedQuizzes);

      return updatedSelectedQuizzes;
    });

    setAllQuizData(prevAllQuizData => {
      const updatedAllQuizData = prevAllQuizData.map(quiz =>
        quiz.sequence === sequence ? { ...quiz, isRepresentative: !quiz.isRepresentative } : quiz,
      );

      return updatedAllQuizData;
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
  const [dayArr, setDayArr] = useState([]);
  const [jobGroupName, setJobGroupName] = useState([]);
  const [jobGroupObject, setJobGroupObject] = useState([]);
  const [jobGroupPopUp, setJobGroupPopUp] = useState([]);
  const [studyCycle, setStudyCycle] = useState([]);
  const [recommendJobGroups, setRecommendJobGroups] = useState([]);
  const [recommendJobGroupsName, setRecommendJobGroupsName] = useState([]);
  const [recommendJobGroupsObject, setRecommendJobGroupsObject] = useState([]);
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [recommendType, setRecommendType] = useState(null);
  const [recommendJobGroupsPopUp, setRecommendJobGroupsPopUp] = useState([]);
  const [recommendLevelsPopUp, setRecommendLevelsPopUp] = useState([]);
  const [clubName, setClubName] = useState<string>('');
  const [num, setNum] = useState<string>(null);
  const [alignment, setAlignment] = React.useState<string | null>('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [active, setActive] = useState(0);
  const [jobs, setJobs] = useState([]);
  const { isFetched: isJobGroupsFetched } = useJobGroupss(data => setJobGroups(data.data.contents || []));
  const [popupParams, setPopupParams] = useState<paramProps>({
    page,
    size: 16,
  });
  const PAGE_NAME = 'contents';
  const { isFetched: isContentListFetched, isFetching } = useRecommendContents(PAGE_NAME, params, data => {
    setContents(data.data || []);
    //console.log(contents);
    // setTotalPage(data.totalPage > 0 ? data.totalPage : 1);
  });

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
      setSelected([]);
    } else if (active == 2) {
      refetchMyJob();
    }
  }, [active]);

  useEffect(() => {
    if (clubSuccess) {
      router.push('/quiz');
    }
  }, [clubSuccess]);

  const [state, setState] = React.useState([]);

  // useEffect(() => {
  //   if (isFetching) return;
  //   setParams({
  //     ...params,
  //   });
  // }, [page]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const boxWidth = 110;
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

  const isStepOptional = (step: number) => {
    return step === 1 || step === 2 || step === 3;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleCancel = () => {
    //console.log('next');
    router.push('/quiz');
  };
  const handleNext = () => {
    //console.log('next');
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep === 1) {
      console.log(quizListOrigin.length, quizList.length);
      if (selectedQuizzes.length < 3) {
        alert('퀴즈를 3개 이상 추가해주세요');
        return 0;
      }

      // "isRepresentative" 값이 true인 개수를 세기 위한 변수
      let countIsRepresentative = 0;

      // 데이터를 순회하면서 "isRepresentative" 값이 true인 경우 카운트 증가
      quizListOrigin.forEach(quiz => {
        if (quiz.isRepresentative === true) {
          countIsRepresentative++;
        }
      });
      //console.log(countIsRepresentative);
      // "isRepresentative" 값이 3개가 아닌 경우 알림 창 표시
      // if (countIsRepresentative !== 3) {
      //   alert('대표 퀴즈는 3개로 설정 해주세요.');
      //   return 0;
      // }
    }
    // 필터링하여 새로운 배열 생성
    const filteredData = quizListOrigin
      .filter(
        item => item.quizSequence !== undefined && item.isRepresentative !== undefined && item.order !== undefined,
      )
      .map(item => ({
        quizSequence: item.quizSequence,
        isRepresentative: item.isRepresentative,
        order: item.order,
      }));
    // //console.log(filteredData);
    setQuizListParam(filteredData);
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleNextLast = () => {
    //console.log(quizListParam);
    const params = { ...paramss, clubQuizzes: quizListParam };
    ////console.log(params);
    onClubQuizSave(params);
  };

  function sortByWeek(a, b) {
    const weekA = parseInt(a.week.replace('주차', ''));
    const weekB = parseInt(b.week.replace('주차', ''));
    return weekA - weekB;
  }

  // "studyCycle" 속성을 기준으로 정렬하는 함수
  function sortByDay(a, b) {
    const dayA = studyCycle.indexOf(a.studyCycle);
    const dayB = studyCycle.indexOf(b.studyCycle);

    return dayA - dayB;
  }

  const handleNextOne = () => {
    window.scrollTo(0, 0);
    //console.log('imageUrl key', imageUrl);
    //요일 정렬

    const params = {
      clubImageUrl: imageUrl,
      recommendJobs: [recommendJobGroups],
      name: clubName,
      studyCycle: studyCycle.sort(sortByDay),
      recommendJobGroups: [jobGroup],
      recommendLevels: [recommendLevels],
      startAt: startDay.format('YYYY-MM-DD') + ' 00:00:00',
      recruitDeadlineAt: endDay.format('YYYY-MM-DD') + ' 00:00:00',
      description: introductionMessage,
      studyWeekCount: studyCycle.length * 12,
      isPublic: true,
      recruitMemberCount: 12,
      publicYn: 'Y',
      participationCode: '',
      relatedSkills: skillIds,
      relatedExperiences: experienceIds,
      clubQuizzes: quizListParam,
    };
    setParamss(params);
    console.log('next', params);
    if (jobGroup.length === 0) {
      alert('등록을 원하는 분야를 선택해주세요.');
      return;
    }

    if (clubName === '') {
      alert('클럽 이름을 입력해주세요.');
      return;
    }

    if (studyCycle.length === 0) {
      alert('요일을 입력해주세요.');
      return;
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    //퀴즈클럽 개수 생성
    const numberOfIterations = 12;
    const resultObject = {};
    //studyCycle
    const modifiedArray = studyCycle.sort(sortByDay).map(item => {
      const objectWithTest = { studyCycle: item };
      const newArray = [];

      for (let i = 0; i < numberOfIterations; i++) {
        const combinedObject = {
          ...objectWithTest,
          week: i + 1 + '주차',
        };
        newArray.push(combinedObject);
      }
      return newArray;
    });

    // 모든 배열을 하나로 합치는 과정
    const combinedArray = [].concat(...modifiedArray);
    const sortedData = combinedArray.sort(sortByWeek);
    // 정렬된 결과
    setQuizListOrigin(sortedData);

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleInputChange = event => {
    setClubName(event.target.value);
  };

  const handleNumChange = event => {
    setNum(event.target.value);
  };

  const handleInputQuizChange = event => {
    setQuizName(event.target.value);
  };

  const handleInputQuizUrlChange = event => {
    setQuizUrl(event.target.value);
  };

  const handleInputQuizSearchChange = event => {
    setQuizSearch(event.target.value);
  };

  const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setIntroductionMessage(value);
  };

  const handleJobGroups = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    //console.log(event.currentTarget);
    setJobGroupPopUp(newFormats);
    //console.log(newFormats);
  };
  const handleJobsPopUp = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    //console.log(event.currentTarget);
    setJobs(newFormats);
    //console.log(newFormats);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handlerClubMake = () => {
    if (studyCycle.length === 0) {
      alert('요일을 입력해주세요.');
      return;
    }

    console.log(studyCycle);
    console.log(num);
    console.log(startDay.format('YYYY-MM-DD'));
    renderDatesAndSessions(startDay.format('YYYY-MM-DD'), studyCycle, num);
  };
  const handlerClubMakeManual = () => {
    console.log(studyCycle);
    console.log(num);
    console.log(startDay.format('YYYY-MM-DD'));
    renderDatesAndSessionsManual(startDay.format('YYYY-MM-DD'), num);
  };

  const koreanWeekdays = ['일', '월', '화', '수', '목', '금', '토'];

  function getDayOfWeekInKorean(month, day) {
    // Create a Date object to calculate the day of the week
    const date = new Date(`2024-${month}-${day}`);
    const dayOfWeek = date.getDay();
    return `(${koreanWeekdays[dayOfWeek]}요일)`;
  }
  const handleInputChangeManual = (index, subIndex, value) => {
    const updatedDayArr = [...dayArr];
    const dateParts = updatedDayArr[index].trim() ? updatedDayArr[index].split(' ') : ['01-01', '(월요일)'];
    const [month, day] = dateParts[0].split('-');
    const dayOfWeek = dateParts[1];

    const updatedDate = subIndex === 0 ? `${value}-${day}` : `${month}-${value}`;
    const newDayOfWeek = getDayOfWeekInKorean(subIndex === 0 ? value : month, subIndex === 1 ? value : day);

    updatedDayArr[index] = `${updatedDate} ${newDayOfWeek}`;
    console.log(updatedDayArr);
    setDayArr(updatedDayArr);
  };

  const useStyles = makeStyles(theme => ({
    selected: {
      '&&': {
        backgroundColor: '#000',
        color: 'white',
      },
    },
  }));

  // 요일을 숫자로 매핑하는 함수
  function getDayIndex(day) {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return weekdays.indexOf(day);
  }

  // 주어진 요일로부터 원하는 횟수만큼의 날짜를 생성하는 함수
  function generateDates(startDate, days, num) {
    const start = new Date(startDate);
    const dates = [];
    let count = 0;

    while (count < num) {
      if (days.includes(start.getDay())) {
        const dayName = ['일', '월', '화', '수', '목', '금', '토'][start.getDay()];
        dates.push(
          `${(start.getMonth() + 1).toString().padStart(2, '0')}-${start
            .getDate()
            .toString()
            .padStart(2, '0')} (${dayName}요일)`,
        );
        count++;
      }
      start.setDate(start.getDate() + 1);
    }

    return dates;
  }

  // 주어진 날짜와 회차 정보를 보여주는 함수
  function renderDatesAndSessions(startDate, days, num) {
    const daysIndex = days.map(getDayIndex);
    const dates = generateDates(startDate, daysIndex, num);
    // const sessions = Array.from({ length: num }, (_, index) => index + 1);
    console.log(dates);
    setDayArr(dates);
  }

  function generateDatesManual(startDate, num) {
    const start = new Date(startDate);
    const dates = [];
    let count = 0;

    while (count < num) {
      const dayName = ['일', '월', '화', '수', '목', '금', '토'][start.getDay()];
      if (count === 0) {
        dates.push(
          `${(start.getMonth() + 1).toString().padStart(2, '0')}-${start
            .getDate()
            .toString()
            .padStart(2, '0')} (${dayName}요일)`,
        );
      } else {
        dates.push(' ');
      }
      start.setDate(start.getDate() + 1);
      count++;
    }

    return dates;
  }

  // 주어진 날짜와 회차 정보를 보여주는 함수
  function renderDatesAndSessionsManual(startDate, num) {
    const dates = generateDatesManual(startDate, num);
    console.log(dates);
    setDayArr(dates);
  }

  function renderDatesAndSessionsView() {
    return (
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-4">
        {dayArr.map((session, index) => (
          <div key={session} className="tw-flex-shrink-0">
            <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d]">{index + 1}회</p>
            <p className="tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2]">
              {session.replace(/\((.*?)요일\)/, '($1)')}
            </p>
          </div>
        ))}
      </div>
    );
  }

  function renderDatesAndSessionsModify() {
    return (
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-3">
        {dayArr.map((session, index) => (
          <div key={session} className="tw-flex-grow tw-flex-shrink relative">
            <div className="tw-text-center">
              <Checkbox />
              <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d]">{index + 1}회</p>
              <div className="tw-flex tw-justify-center tw-items-center  tw-left-0 tw-top-0 tw-overflow-hidden tw-gap-1 tw-px-0 tw-py-[3px] tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                <input
                  style={{ padding: 0, height: 25, width: 25, textAlign: 'center' }}
                  type="text"
                  maxLength={2}
                  className="form-control tw-text-sm"
                  value={session.split(' ')[0].split('-')[0]}
                ></input>
                <input
                  style={{ padding: 0, height: 25, width: 25, textAlign: 'center' }}
                  type="text"
                  className="form-control tw-text-sm"
                  value={session.split(' ')[0].split('-')[1]}
                ></input>
                <p className="tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2]">
                  {session.split(' ')[1].replace(/\((.*?)요일\)/, '($1)')}
                </p>
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
  function renderDatesAndSessionsModifyManual() {
    return (
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-3">
        {dayArr.map((session, index) => (
          <div key={index} className="tw-flex-grow tw-flex-shrink relative">
            <div className="tw-text-center">
              <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d]">{index + 1}회</p>
              <div className="tw-flex tw-justify-center tw-items-center tw-left-0 tw-top-0 tw-overflow-hidden tw-gap-1 tw-px-0 tw-py-[3px] tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                <input
                  style={{ padding: 0, height: 25, width: 25, textAlign: 'center' }}
                  type="text"
                  maxLength={2}
                  className="form-control tw-text-sm"
                  defaultValue={session.trim() ? session.split(' ')[0].split('-')[0] : ''}
                  onChange={e => handleInputChangeManual(index, 0, e.target.value)}
                ></input>
                <input
                  style={{ padding: 0, height: 25, width: 25, textAlign: 'center' }}
                  type="text"
                  maxLength={2}
                  className="form-control tw-text-sm"
                  defaultValue={session.trim() ? session.split(' ')[0].split('-')[1] : ''}
                  onChange={e => handleInputChangeManual(index, 1, e.target.value)}
                ></input>
                <p className="tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2]">
                  {session.trim() ? session.split(' ')[1].replace(/\((.*?)요일\)/, '($1)') : ''}
                </p>
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

  const classes = useStyles();

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <Desktop>
          <div className="tw-pt-[40px] tw-pt-5 tw-pb-14">
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
                  <button className="tw-flex tw-justify-center tw-items-center tw-w-40 tw-relative tw-overflow-hidden tw-gap-2 tw-px-7 tw-py-[11.5px] tw-rounded tw-bg-[#31343d]">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-white">
                      템플릿 불러오기
                    </p>
                  </button>
                  <button className="border tw-flex tw-justify-center tw-items-center tw-w-40 tw-relative tw-overflow-hidden tw-gap-2 tw-px-6 tw-py-[11.5px] tw-rounded tw-bg-white tw-border tw-border-gray-400">
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

        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  <div className="tw-font-semibold">{label}</div>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === 0 && (
          <article>
            <Desktop>
              <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">클럽 기본정보 입력</div>
              <div className={cx('content-area')}>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-2">클럽명</div>
                <TextField
                  size="small"
                  fullWidth
                  label={'클럽명을 입력해주세요.'}
                  onChange={handleInputChange}
                  id="margin-none"
                  value={clubName}
                  name="clubName"
                />
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-2">클럽 이미지 선택</div>

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

                <div>
                  <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-content-start">
                    <div>
                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 대학</div>
                      <select className="form-select" aria-label="Default select example">
                        <option selected>대학을 선택해주세요.</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                      {/* <ToggleButtonGroup
                        value={jobGroupObject}
                        exclusive
                        onChange={handleJobs}
                        aria-label="text alignment"
                      >
                        {contentTypes?.map((item, index) => (
                          <ToggleButton
                            classes={{ selected: classes.selected }}
                            key={`job-1-${index}`}
                            value={item}
                            className="tw-ring-1 tw-ring-slate-900/10"
                            style={{
                              borderRadius: '5px',
                              borderLeft: '0px',
                              margin: '5px',
                              height: '35px',
                              border: '0px',
                            }}
                          >
                            {item.name}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup> */}

                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 레벨</div>

                      <ToggleButtonGroup
                        value={recommendLevels}
                        exclusive
                        onChange={handleRecommendLevels}
                        aria-label="text alignment"
                      >
                        {levelGroup?.map((item, index) => (
                          <ToggleButton
                            classes={{ selected: classes.selected }}
                            key={`job-2-${index}`}
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
                          >
                            {item.description}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </div>

                    <div>
                      <div>
                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 학과</div>
                        <select className="form-select" aria-label="Default select example">
                          <option selected>학과를 선택해주세요.</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                        {/* <ToggleButtonGroup
                          style={{ display: 'inline' }}
                          value={recommendJobGroupsObject}
                          exclusive
                          onChange={handleJobGroup}
                          aria-label=""
                          color="standard"
                        >
                          {contentJobType?.map((item, index) => (
                            <ToggleButton
                              classes={{ selected: classes.selected }}
                              key={`job-3-${index}`}
                              value={item}
                              className="tw-ring-1 tw-ring-slate-900/10"
                              style={{
                                borderRadius: '5px',
                                borderLeft: '0px',
                                margin: '5px',
                                height: '35px',
                                border: '0px',
                              }}
                            >
                              {item.name}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup> */}

                        <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                          공개/비공개 설정
                        </div>
                        <div className="tw-flex tw-items-center tw-gap-2 tw-mt-1">
                          <ToggleButtonGroup
                            value={isPublic}
                            onChange={handleIsPublic}
                            exclusive
                            aria-label=""
                            color="standard"
                          >
                            {privateGroup?.map((item, index) => (
                              <ToggleButton
                                classes={{ selected: classes.selected }}
                                key={`job-4-${index}`}
                                value={item.name}
                                className="tw-ring-1 tw-ring-slate-900/10"
                                style={{
                                  width: 70,
                                  borderRadius: '5px',
                                  borderLeft: '0px',
                                  margin: '5px',
                                  height: '35px',
                                  border: '0px',
                                }}
                              >
                                {item.name}
                              </ToggleButton>
                            ))}
                          </ToggleButtonGroup>
                          <TextField
                            fullWidth
                            className="tw-pl-1"
                            size="small"
                            disabled
                            label={'입장코드를 설정해주세요.'}
                            id="margin-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tw-pb-5">
                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                      퀴즈 생성(오픈) 주기
                    </div>

                    <ToggleButtonGroup
                      value={recommendType}
                      exclusive
                      onChange={handleRecommendType}
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
                        >
                          {item.description}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </div>
                  {/* Conditionally render a div based on recommendType and recommendLevels */}
                  {recommendType == 0 && (
                    <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb] tw-pb-5">
                      <div className="tw-flex tw-p-5 ...">
                        <div className="tw-flex-grow tw-w-1/2 tw-h-14 ...">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                            퀴즈 주기 (복수선택가능)
                          </p>
                          <ToggleButtonGroup
                            value={studyCycle}
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
                              >
                                {item.name}
                              </ToggleButton>
                            ))}
                          </ToggleButtonGroup>
                        </div>
                        <div className="tw-flex-none tw-w-1/4 tw-h-14 ...">
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
                        <div className="tw-flex-none tw-w-1/4 tw-h-14 ... ">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                            클럽퀴즈 회차 입력
                          </p>
                          <TextField
                            size="small"
                            fullWidth
                            label={'클럽퀴즈 회차를 입력해주세요.'}
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
                      {dayArr.length > 0 && (
                        <div className="tw-p-5">
                          <div className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                            퀴즈 클럽회차
                          </div>
                          <div className="tw-rounded-lg tw-bg-white">{renderDatesAndSessionsView()}</div>
                          <div className="tw-text-sm tw-text-right tw-text-black tw-py-5 tw-font-semibold">
                            선택회차 삭제하기
                          </div>
                          <div className="tw-rounded-lg tw-bg-white">{renderDatesAndSessionsModify()}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {recommendType == 1 && (
                    <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb] tw-pb-5">
                      <div className="tw-flex tw-p-5 ...">
                        <div className="tw-flex-none tw-w-1/4 tw-h-14 ...">
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
                        <div className="tw-flex-none tw-w-1/4 tw-h-14 ... ">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                            클럽퀴즈 회차 입력
                          </p>
                          <TextField
                            size="small"
                            fullWidth
                            label={'클럽퀴즈 회차를 입력해주세요.'}
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
                      {dayArr.length > 0 && (
                        <div className="tw-p-5">
                          <div className="tw-rounded-lg tw-bg-white">{renderDatesAndSessionsModifyManual()}</div>
                        </div>
                      )}
                    </div>
                  )}
                  {recommendType == 2 && (
                    <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb] tw-pb-5">
                      <p className="tw-text-sm tw-text-left tw-text-black tw-font-semibold tw-pt-5 tw-px-5">
                        날짜/요일을 지정할 필요 없이 학생이 퀴즈를 풀면 자동으로 다음 회차가 열립니다.
                      </p>
                      <div className="tw-flex tw-p-5 ...">
                        <div className="tw-flex-none tw-w-1/4 tw-h-14 ...">
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
                        <div className="tw-flex-none tw-w-1/4 tw-h-14 ... ">
                          <p className="tw-text-sm tw-text-left tw-text-black tw-py-2 tw-font-semibold">
                            클럽퀴즈 회차 입력
                          </p>
                          <TextField
                            size="small"
                            fullWidth
                            label={'클럽퀴즈 회차를 입력해주세요.'}
                            onChange={handleNumChange}
                            id="margin-none"
                            value={num}
                            name="num"
                            style={{ backgroundColor: 'white' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-2">학습 주제</div>
                  <TextField
                    size="small"
                    fullWidth
                    label={'학습 주제를 입력해주세요.'}
                    onChange={handleInputChange}
                    id="margin-none"
                    value={clubName}
                    name="clubName"
                  />
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">학습 쳅터</div>
                  <TextField
                    size="small"
                    fullWidth
                    label={'학습 챕터를 입력해주세요.'}
                    onChange={handleInputChange}
                    id="margin-none"
                    value={clubName}
                    name="clubName"
                  />
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">학습 키워드</div>
                  <TagsInput
                    value={selected}
                    onChange={setSelected}
                    name="fruits"
                    placeHolder="학습 키워드를 입력해주세요."
                  />
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">관련스킬</div>
                  <ToggleButtonGroup
                    style={{ display: 'inline' }}
                    value={skillIds}
                    onChange={handleFormat}
                    aria-label=""
                    color="standard"
                  >
                    {skillData?.map((item, index) => {
                      return (
                        <ToggleButton
                          classes={{ selected: classes.selected }}
                          key={`skillIds-${index}`}
                          value={item.name}
                          className="tw-ring-1 tw-ring-slate-900/10"
                          style={{
                            borderRadius: '5px',
                            borderLeft: '0px',
                            margin: '5px',
                            height: '35px',
                            border: '0px',
                          }}
                        >
                          {item.name}
                        </ToggleButton>
                      );
                    })}
                  </ToggleButtonGroup>
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">관련경험</div>
                  {/* <ToggleButtonGroup value={experienceIds} onChange={handleFormatEx} aria-label="" color="standard">
                    {experienceData.data.contents?.map((item, index) => {
                      return (
                        <ToggleButton
                          classes={{ selected: classes.selected }}
                          key={`skillIds-${index}`}
                          value={item.name}
                          className="tw-ring-1 tw-ring-slate-900/10"
                          style={{
                            borderRadius: '5px',
                            borderLeft: '0px',
                            margin: '5px',
                            height: '35px',
                            border: '0px',
                          }}
                        >
                          {item.name}
                        </ToggleButton>
                      );
                    })}
                  </ToggleButtonGroup> */}
                  {/* {experienceData.data.contents?.map((item, index) => {
                    return (
                      <ToggleButton
                        key={`custom-skill-${index}`}
                        className="tw-mb-3 tw-mr-3"
                        label={item.name}
                        name="experienceIds"
                        value={item.name}
                        onChange={onToggleChange}
                        variant="small"
                        type="multiple"
                        isActive
                        isBorder
                      />
                    );
                  })} */}
                  {/* <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-content-start">
                    <div>
                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">퀴즈클럽 시작일</div>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="YYYY-MM-DD"
                          slotProps={{ textField: { size: 'small' } }}
                          value={startDay}
                          onChange={e => onChangeHandleFromToStartDate(e)}
                        />
                      </LocalizationProvider>
                      <div className="tw-text-sm tw-text-black tw-mt-2 tw-my-0">* 스펙업 주기는 기본 12주 입니다.</div>
                    </div>
                    <div>
                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">클럽 모집 마감일</div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="YYYY-MM-DD"
                          slotProps={{ textField: { size: 'small' } }}
                          value={endDay}
                          onChange={e => onChangeHandleFromToEndDate(e)}
                        />
                      </LocalizationProvider>
                      <div className="tw-text-sm tw-text-black tw-mt-2 tw-my-0">
                        *스펙업 시작일보다 이른 날짜만 설정이 가능합니다.
                      </div>
                    </div>
                  </div> */}
                  <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">클럽 기본정보 입력</div>
                  <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">
                    간략한 클럽 소개 내용을 입력해주세요.
                  </div>
                  <TextField
                    fullWidth
                    id="margin-none"
                    multiline
                    rows={4}
                    onChange={onMessageChange}
                    value={introductionMessage}
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
                    onChange={onMessageChange}
                    value={introductionMessage}
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
                    onChange={onMessageChange}
                    value={introductionMessage}
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
                    onChange={onMessageChange}
                    value={introductionMessage}
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
                    onChange={onMessageChange}
                    value={introductionMessage}
                    placeholder="(현) ○○○ 개발 리더
                    (전) △△ 개발 팀장
                    (전) □□□□ 개발 사원"
                  />
                </div>
              </div>
              <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
                <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                  <div className="tw-row-span-2">
                    {/* {isStepOptional(activeStep) && (
                    <button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    >
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '다음'}
                    </button>
                  )} */}
                    {/* <button className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded">
                    임시 저장하기
                  </button> */}
                    <button
                      className="tw-w-[150px] border tw-mr-4 tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded tw-text-sm"
                      onClick={handleNextOne}
                    >
                      임시 저장하기
                    </button>
                    <button
                      className="tw-w-[150px] tw-bg-[#E11837] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-text-sm tw-rounded"
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
                  <p className="tw-text-xl tw-font-bold tw-text-left tw-text-black tw-py-10">퀴즈 등록하기</p>
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
                    <div className="tw-flex tw-justify-center tw-items-center tw-w-[124px] tw-relative tw-overflow-hidden tw-gap-2 tw-px-7 tw-py-[11.5px] tw-rounded tw-bg-[#e9ecf2]">
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-center tw-text-[#6a7380]">
                        퀴즈 초기화
                      </p>
                    </div>
                  </div>
                </div>

                <div className="tw-grid tw-grid-cols-3 tw-gap-8 tw-py-12">
                  <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">대학</p>
                    <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[314px] tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                      <TextField
                        size="small"
                        fullWidth
                        label={'클럽명을 입력해주세요.'}
                        onChange={handleInputChange}
                        id="margin-none"
                        value={clubName}
                        name="clubName"
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">학과</p>
                    <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[314px] tw-h-11 tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                      <TextField
                        size="small"
                        fullWidth
                        label={'클럽명을 입력해주세요.'}
                        onChange={handleInputChange}
                        id="margin-none"
                        value={clubName}
                        name="clubName"
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">학년</p>
                    <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[314px] tw-h-11 tw-relative tw-rounded tw-bg-white tw-border tw-border-[#e0e4eb]">
                      <TextField
                        size="small"
                        fullWidth
                        label={'클럽명을 입력해주세요.'}
                        onChange={handleInputChange}
                        id="margin-none"
                        value={clubName}
                        name="clubName"
                      />
                    </div>
                  </div>
                </div>

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
                      <g clip-path="url(#tw-clip0_320_49119)">
                        <circle cx={12} cy={12} r="11.5" stroke="#9CA5B2" stroke-dasharray="2.25 2.25" />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12.75 7.5H11.25V11.25L7.5 11.25V12.75H11.25V16.5H12.75V12.75H16.5V11.25L12.75 11.25V7.5Z"
                          fill="#9CA5B2"
                        />
                      </g>
                      <defs>
                        <clippath id="tw-clip0_320_49119">
                          <rect width={24} height={24} fill="white" />
                        </clippath>
                      </defs>
                    </svg>
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-medium tw-text-left tw-text-[#9ca5b2]">
                      <button type="button" onClick={handleAddClick} className="tw-text-black tw-text-sm ">
                        성장퀴즈 추가하기
                      </button>
                    </p>
                  </div>
                </div>

                <div className="tw-mt-10"></div>

                {selectedQuizzes.map((item, index) => {
                  return (
                    <Grid
                      key={index}
                      container
                      direction="row"
                      justifyContent="left"
                      alignItems="center"
                      rowSpacing={3}
                    >
                      <Grid item xs={1}>
                        <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">Q{index + 1}.</div>
                        <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                          {index + 1} 주차 ({item.studyCycle})
                        </div>
                      </Grid>
                      {/* <Grid item xs={1}>
                        <div className="tw-flex-auto tw-text-center">
                          <button
                            type="button"
                            // onClick={() => handleDeleteQuiz(item.quizSequence)}
                            onClick={() => handleCheckboxDelete(item.sequence)}
                            className="tw-text-blue-700 border tw-border-blue-700 tw-font-medium tw-rounded-lg tw-text-sm tw-p-2.5 tw-text-center tw-inline-flex tw-items-center tw-mr-2"
                          >
                            <svg
                              className="tw-w-4 tw-h-4"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="2 2 12 12"
                            >
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                            <span className="sr-only">Icon description</span>
                          </button>
                        </div>
                      </Grid> */}
                      <Grid item xs={11}>
                        <QuizBreakerInfo
                          avatarSrc="https://via.placeholder.com/40"
                          userName={item.memberName}
                          questionText={item.content}
                          isRepresentative={item.isRepresentative}
                          index={item.sequence}
                          answerText="EAI는 엔터프라이즈 어플리케이션 인테그레이션의 약자입니다. 시스템이 서로 얽히고 복잡해지면서 통제가 잘 안되는 상황이 발생하여 이런 문제를 해결하기 위해 등장한 솔루션이 바로 EAI 입니다."
                          handleCheckboxDelete={handleCheckboxDelete}
                          handleCheckboxIsRepresentative={handleCheckboxIsRepresentative}
                        />
                        {/* <div className="tw-flex tw-items-center  tw-h-16 tw-p-4 tw-border border mb-3 mt-3 rounded">
                          <div className="tw-flex-auto">
                            <div className="tw-font-medium tw-text-black">{item?.content}</div>
                          </div>

                          <div className="">
                            {item?.isRepresentative !== undefined && (
                              <div onClick={() => handleCheckboxIsRepresentative(item?.sequence)}>
                                <Tooltip
                                  content="클릭시 대표퀴즈로 설정됩니다.대표퀴즈 설정은 3개까지 가능합니다."
                                  placement="bottom"
                                  trigger="mouseEnter"
                                  warpClassName={cx('icon-height')}
                                >
                                  <button
                                    type="button"
                                    data-tooltip-target="tooltip-default"
                                    className={`tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded ${
                                      item?.isRepresentative
                                        ? 'tw-bg-green-100 tw-text-green-800'
                                        : 'tw-bg-gray-100 tw-text-gray-800'
                                    }`}
                                  >
                                    대표
                                  </button>
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        </div> */}
                      </Grid>
                    </Grid>
                  );
                })}
                <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
                  <div className="tw-flex tw-gap-5 tw-mt-3">
                    <button
                      onClick={handleBack}
                      className="border tw-w-[150px] tw-btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-rounded tw-flex tw-items-center tw-justify-center tw-gap-1"
                    >
                      <NavigatePrevIcon fontSize="small" />
                      이전
                    </button>
                    <button
                      className="tw-w-[150px] tw-bg-[#E11837] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-rounded tw-flex tw-items-center tw-justify-center tw-gap-1"
                      onClick={handleNext}
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
              <QuizClubDetailInfo
                border={true}
                clubInfo={clubInfo}
                leaders={leaders}
                clubQuizzes={clubQuizzes}
                representativeQuizzes={representativeQuizzes}
              />
              {/* <div className="tw-p-10 tw-bg-gray-50 tw-mt-10">
                <div className="tw-flex tw-flex-col tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow md:tw-flex-row">
                  <img
                    className="tw-object-cover tw-rounded-t-lg tw-h-[245px] md:tw-h-[245px] md:tw-w-[220px] md:tw-rounded-none md:tw-rounded-l-lg"
                    src={`${process.env['NEXT_PUBLIC_GENERAL_URL']}` + selectedImage}
                    alt=""
                  />
                  <div className="tw-flex tw-flex-col tw-justify-between tw-p-4 tw-leading-normal">
                    <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500">
                      {recommendJobGroupsName.map((name, i) => (
                        <span
                          key={i}
                          className="tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded"
                        >
                          {name}
                        </span>
                      ))}
                      {paramss?.recommendLevels.map((name, i) => (
                        <span
                          key={i}
                          className="tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded "
                        >
                          {name} 레벨
                        </span>
                      ))}
                      {jobGroupName?.map((name, i) => (
                        <span
                          className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded "
                          key={i}
                        >
                          {name}
                        </span>
                      ))}
                    </div>

                    <h6 className="tw-mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
                      {paramss.name}
                    </h6>
                    <p className="tw-line-clamp-2 tw-mb-3 tw-font-normal tw-text-gray-700">{paramss.description}</p>

                    <div className="tw-mb-3 tw-text-sm tw-font-semibold tw-text-gray-500">
                      모집마감일 : {paramss.startAt}
                    </div>
                    <h6 className="tw-mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
                      {paramss.clubName}
                    </h6>

                    <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-400">
                      {paramss.studyCycle.toString()} | {paramss.studyWeekCount} 주 | 학습 {paramss.recruitMemberCount}
                      회
                    </div>

                    <div className="tw-flex tw-items-center tw-space-x-4">
                      <img className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full" src={item?.author?.avatar} alt="" />
                      <div className="tw-text-sm tw-font-semibold tw-text-black dark:tw-text-white">
                        <div>{item?.author?.displayName}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tw-text-lg tw-mt-5 tw-font-bold tw-text-black">{paramss.memberName}</div>
              <div className="tw-text-xl tw-mt-5 tw-font-bold tw-text-black">퀴즈클럽 소개</div>
              <div className="tw-text-base tw-mt-5 tw-text-black"> {paramss.description}</div>
              <div className="tw-text-xl tw-mt-5 tw-font-bold tw-text-black">퀴즈클럽 질문 미리보기</div>
              <div className="tw-text-sm tw-mt-5 tw-mb-2 tw-font-bold tw-text-gray ">12주 총 학습 36회 진행</div>
              {quizListOrigin.map((item, index) => {
                if (item?.isRepresentative === true) {
                  return (
                    <div key={index} className="">
                      <div className="tw-flex tw-items-center tw-px-0 tw-border mb-2 mt-0 rounded">
                        <span className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded">
                          대표
                        </span>
                        <div className="tw-flex-auto tw-ml-3">
                          <div className="tw-font-medium tw-text-black">{item.content}</div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // 다른 경우에는 렌더링하지 않음
                  return null;
                }
              })} */}

              <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
                <div className="tw-flex tw-gap-5 tw-mt-3">
                  <button
                    onClick={handleBack}
                    className="border tw-w-[240px] tw-btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-rounded tw-flex tw-items-center tw-justify-center tw-gap-1"
                  >
                    <NavigatePrevIcon fontSize="small" />
                    이전
                  </button>
                  <button
                    className="tw-w-[240px] tw-bg-[#E11837] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-rounded tw-flex tw-items-center tw-justify-center tw-gap-1"
                    onClick={handleNextLast}
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
      <MentorsModal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
        <Box width="100%" sx={{ borderBottom: '1px solid LightGray' }}>
          <p className="tw-text-xl tw-font-bold tw-text-center tw-text-black tw-pb-7">퀴즈 등록하기</p>
          <Tabs value={value} onChange={handleChange} centered>
            {/* <StyledSubTabs value={value} onChange={handleChange}> */}
            <Tab disableRipple className="tw-text-black tw-text-base" label="퀴즈 검색하기" />
            <Tab
              disableRipple
              // style={{ marginRight: '-1px', marginLeft: '-1px' }}
              className="tw-text-black tw-text-base "
              label="퀴즈 직접 등록하기"
            />
            <Tab disableRipple className="tw-text-black tw-text-base" label="퀴즈 만들기 불러오기" />
          </Tabs>
          {/* </StyledSubTabs> */}
          {/* <div
            style={{
              borderBottom: '2px solid gray',
              height: 51,
              flexGrow: 1,
            }}
          ></div> */}
        </Box>
        {active === 0 && (
          <div className="">
            <div className="tw-mt-10 tw-mb-8">
              <TextField
                size="small"
                fullWidth
                placeholder="퀴즈 키워드를 입력해주세요."
                onChange={handleInputQuizSearchChange}
                id="margin-none"
                value={quizSearch}
                name="quizSearch"
                InputProps={{
                  style: { height: '45px' },
                  startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    searchKeyworld((e.target as HTMLInputElement).value);
                  }
                }}
              />

              <div className="tw-grid tw-grid-cols-3 tw-gap-8 tw-pt-8 tw-pb-4">
                <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">대학</p>
                  <select className="form-select" aria-label="Default select example">
                    <option selected>대학을 선택해주세요.</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">학과</p>
                  <select className="form-select" aria-label="Default select example">
                    <option selected>대학을 선택해주세요.</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">학년</p>
                  <select className="form-select" aria-label="Default select example">
                    <option selected>대학을 선택해주세요.</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </div>
            </div>
            <p className="tw-text-xl tw-font-bold tw-text-left tw-text-black tw-pb-5">퀴즈검색 00개</p>
            {quizListData.map((item, index) => (
              <>
                <QuizBreakerInfoCheck
                  avatarSrc="https://via.placeholder.com/40"
                  userName={item.memberName}
                  questionText={item.content}
                  index={item.sequence}
                  selectedQuizIds={selectedQuizIds}
                  handleCheckboxChange={handleCheckboxChange}
                  hashtags={['MVVM', '해시태그']}
                  tags={['소프트웨어융합대학', '컴퓨터공학과', '2학년']}
                  answerText="EAI는 엔터프라이즈 어플리케이션 인테그레이션의 약자입니다. 시스템이 서로 얽히고 복잡해지면서 통제가 잘 안되는 상황이 발생하여 이런 문제를 해결하기 위해 등장한 솔루션이 바로 EAI 입니다."
                />
              </>
            ))}
            <Pagination page={page} setPage={setPage} total={totalPage} showCount={5} />
          </div>
        )}
        {active == 1 && (
          <div>
            <div className="tw-font-bold tw-text-base tw-text-black tw-pt-10">필수 입력</div>
            <div>
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2 tw-mt-5">* 질문</div>
              <TextField
                size="small"
                fullWidth
                placeholder="ex) Github Actions와 기존 Github의 차이점에 대해 설명하세요."
                onChange={handleInputQuizChange}
                id="margin-none"
                value={quizName}
                ref={quizRef}
                name="quizName"
              />
            </div>
            <div>
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2 tw-mt-5">
                * 아티클 (질문에 대한 답변에 참고가 될 아티클 링크를 입력해주세요.)
              </div>
              <TextField
                size="small"
                fullWidth
                placeholder="http://"
                onChange={handleInputQuizUrlChange}
                id="margin-none"
                value={quizUrl}
                ref={quizUrlRef}
                name="quizUrl"
              />
            </div>
            <div>
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2 tw-mt-5">추천 직군</div>
              <ToggleButtonGroup value={jobGroupPopUp} exclusive onChange={handleJobGroups} aria-label="text alignment">
                {contentTypes?.map((item, index) => (
                  <ToggleButton
                    key={`job-${index}`}
                    value={item.id}
                    className="tw-ring-1 tw-ring-slate-900/10"
                    style={{
                      borderRadius: '5px',
                      borderLeft: '0px',
                      margin: '5px',
                      height: '35px',
                      border: '0px',
                    }}
                  >
                    {item.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2 tw-mt-5">* 추천 직무</div>
              <ToggleButtonGroup
                style={{ display: 'inline' }}
                value={jobs}
                onChange={handleJobsPopUp}
                aria-label="text alignment"
              >
                {jobGroups?.map((item, index) => (
                  <ToggleButton
                    key={`job-${index}`}
                    value={item.id}
                    className="tw-ring-1 tw-ring-slate-900/10"
                    style={{
                      borderRadius: '5px',
                      borderLeft: '0px',
                      margin: '5px',
                      height: '35px',
                      border: '0px',
                    }}
                  >
                    {item.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <div className="tw-font-semibold tw-text-sm tw-text-black tw-my-2 tw-mt-5">* 추천 레벨</div>
              <ToggleButtonGroup
                exclusive
                value={recommendLevelsPopUp}
                onChange={handleRecommendLevelsPopUp}
                aria-label="text alignment"
              >
                {levelGroup?.map((item, index) => (
                  <ToggleButton
                    key={`job-${index}`}
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
                  >
                    {item.description}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <div className="tw-font-bold tw-text-base tw-text-black tw-pt-10">선택 입력</div>

              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-2 tw-mt-5">관련스킬</div>

              <ToggleButtonGroup
                style={{ display: 'inline' }}
                value={skillIdsPopUp}
                onChange={handleFormatPopUp}
                aria-label=""
                color="standard"
              >
                {skillData?.map((item, index) => {
                  return (
                    <ToggleButton
                      key={`skillIds-${index}`}
                      value={item.name}
                      className="tw-ring-1 tw-ring-slate-900/10"
                      style={{
                        borderRadius: '5px',
                        borderLeft: '0px',
                        margin: '5px',
                        height: '35px',
                        border: '0px',
                      }}
                    >
                      {item.name}
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>

              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-mb-2">관련경험</div>
              <ToggleButtonGroup
                style={{ display: 'inline' }}
                value={experienceIdsPopUp}
                onChange={handleFormatExPopUp}
                aria-label=""
                color="standard"
              >
                {experienceData?.data?.contents?.map((item, index) => {
                  return (
                    <ToggleButton
                      key={`skillIds-${index}`}
                      value={item.name}
                      className="tw-ring-1 tw-ring-slate-900/10"
                      style={{
                        borderRadius: '5px',
                        borderLeft: '0px',
                        margin: '5px',
                        height: '35px',
                        border: '0px',
                      }}
                    >
                      {item.name}
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </div>
            <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-mb-2">해시태그</div>
            <TagsInput
              value={selected}
              onChange={setSelected}
              name="fruits"
              placeHolder="#해쉬태그 입력 후 엔터를 쳐주세요.
              "
            />
            <div className="tw-text-center tw-mt-5">
              <button
                type="button"
                onClick={() => handleQuizInsertClick()}
                className="tw-mt-5 tw-text-white tw-bg-blue-500  tw-font-medium tw-rounded-md tw-text-base tw-px-5 tw-py-2.5"
              >
                퀴즈 등록하기
              </button>
            </div>
          </div>
        )}
        {active === 2 && (
          <div>
            <div className="tw-mt-10 tw-mb-8">
              <TextField
                size="small"
                fullWidth
                label={'내 퀴즈 키워드를 입력하세요.'}
                onChange={handleInputQuizSearchChange}
                id="margin-none"
                // value={quizSearch}
                name="quizSearch"
                InputProps={{
                  style: { height: '45px' },
                  startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    searchMyKeyworld((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>
            {myQuizListData?.contents.map((item, index) => (
              <>
                <QuizBreakerInfoCheck
                  avatarSrc="https://via.placeholder.com/40"
                  userName={item.memberName}
                  questionText={item.content}
                  index={item.sequence}
                  selectedQuizIds={selectedQuizIds}
                  handleCheckboxChange={handleCheckboxChange}
                  hashtags={['MVVM', '해시태그']}
                  tags={['소프트웨어융합대학', '컴퓨터공학과', '2학년']}
                  answerText="EAI는 엔터프라이즈 어플리케이션 인테그레이션의 약자입니다. 시스템이 서로 얽히고 복잡해지면서 통제가 잘 안되는 상황이 발생하여 이런 문제를 해결하기 위해 등장한 솔루션이 바로 EAI 입니다."
                />
                {/* <Desktop>
                  <div key={`admin-quiz-${index}`} className="tw-flex tw-pb-5">
                    <Checkbox
                      disableRipple
                      onChange={handleChangeCheck}
                      checked={state.includes(String(item.sequence))}
                      name={item.sequence}
                      className="tw-mr-3"
                    />
                    <div className="tw-p-4 tw-border border tw-w-full tw-rounded-lg">
                      <div className="tw-flex tw-w-full tw-items-center"></div>
                      <div className="tw-flex  tw-items-center">
                        <div className="tw-flex-auto">
                          <div className="tw-font-medium tw-text-black">
                            <div className="tw-text-sm tw-font-normal tw-text-gray-500">
                              {item?.recommendJobGroupNames?.map((name, i) => (
                                <span
                                  key={i}
                                  className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600"
                                >
                                  {name}
                                </span>
                              ))}
                              <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
                                {item?.recommendLevels?.sort().join(',')}레벨
                              </span>
                              {item?.recommendJobNames?.map((name, i) => (
                                <span
                                  key={i}
                                  className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-100 tw-text-sm tw-font-light tw-text-gray-600"
                                >
                                  {name}
                                </span>
                              ))}
                              {item?.hashTags?.map((name, i) => (
                                <span
                                  key={i}
                                  className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-gray-700"
                                >
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="tw-text-gray-400 tw-text-sm ">{item.createdAt}</div>
                      </div>
                      <div className="tw-flex  tw-items-center py-2">
                        <div className="tw-flex-auto">
                          <div className="tw-font-medium tw-text-black tw-text-base tw-line-clamp-1">
                            {item.content}
                          </div>
                        </div>
                      </div>
                      <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                        <div className="tw-col-span-1 tw-text-sm tw-font-bold tw-text-black">아티클</div>
                        <div className="tw-col-span-9 tw-text-sm tw-text-gray-600  tw-line-clamp-1">
                          {item.articleUrl}
                        </div>
                        <div className="tw-col-span-2 tw-text-sm tw-text-right">
                          댓글 : {item.activeCount} 답변 : {item.answerCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </Desktop> */}
              </>
            ))}
          </div>
        )}
      </MentorsModal>
    </div>
  );
}

export default QuizOpenTemplate;
