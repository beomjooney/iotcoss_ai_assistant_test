import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Button, Chip, MentorsModal, Pagination, Toggle, Typography } from 'src/stories/components';
import React, { useEffect, useState, useRef } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useSeminarList, paramProps, useSeminarImageList } from 'src/services/seminars/seminars.queries';
import QuizArticleCard from 'src/stories/components/QuizArticleCard';
import Carousel from 'nuka-carousel';
import { useContentJobTypes, useContentTypes, useJobGroups, useJobGroupss } from 'src/services/code/code.queries';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/system/Box';
import Image from 'next/image';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// import ToggleButton from 'src/stories/components/ToggleButton';
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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useClubQuizSave, useQuizSave } from 'src/services/quiz/quiz.mutations';
import { jobColorKey } from 'src/config/colors';
import { TagsInput } from 'react-tag-input-component';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useUploadImage } from 'src/services/image/image.mutations';
import Tooltip from 'src/stories/components/Tooltip';
import { makeStyles, withStyles } from '@mui/styles';
import styled from '@emotion/styled';
import MuiTabs from '@material-ui/core/Tabs';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';

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
  width: 260,
  height: 8,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: '#2474ED',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#2474ED',
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;
  return <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}></ColorlibStepIconRoot>;
}

const dayGroup = [
  {
    id: '월',
    groupId: '0001',
    name: '월',
    description: '월',
    order: 1,
  },
  {
    id: '화',
    groupId: '0001',
    name: '화',
    description: '화',
    order: 2,
  },
  {
    id: '수',
    groupId: '0001',
    name: '수',
    description: '수',
    order: 3,
  },
  {
    id: '목',
    groupId: '0001',
    name: '목',
    description: '목',
    order: 3,
  },
  {
    id: '금',
    groupId: '0001',
    name: '금',
    description: '금',
    order: 3,
  },
  {
    id: '토',
    groupId: '0001',
    name: '토',
    description: '토',
    order: 4,
  },
  {
    id: '일',
    groupId: '0001',
    name: '일',
    description: '일',
    order: 4,
  },
];

const privateGroup = [
  {
    id: '0100',
    groupId: '0001',
    name: '공개',
    description: '공개',
    active: true,
    order: 1,
  },
  {
    id: '0200',
    groupId: '0001',
    name: '비공개',
    description: '비공개',
    active: false,
    order: 2,
  },
];

const levelGroup = [
  {
    name: '0',
    description: '레벨 0',
  },
  {
    name: '1',
    description: '레벨 1',
  },
  {
    name: '2',
    description: '레벨 2',
  },
  {
    name: '3',
    description: '레벨 3',
  },
  {
    name: '4',
    description: '레벨 4',
  },
  {
    name: '5',
    description: '레벨 5',
  },
];

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

  // const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data.data.contents || []));
  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();

  // const { data: quizListData, refetch }: UseQueryResult<any> = useQuizList(params);
  const { isFetched: isQuizData, refetch } = useQuizList(params, data => {
    //console.log('kimcy2', data);
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

    const resultArray1 = [];
    //console.log('resultArray1 ', resultArray1);
    // quizListOrigin.map((item, index) => {
    //   //console.log(' filteredData[index]', quizListCopy[index]);
    //   if (index < quizListCopy.length) {
    //     resultArray1.push({
    //       ...item,
    //       quizSequence: quizListCopy[index].sequence,
    //       content: quizListCopy[index].content,
    //       memberName: quizListCopy[index].memberName,
    //       isRepresentative: quizListCopy[index]?.isRepresentative,
    //       order: index,
    //     });
    //   } else {
    //     resultArray1.push(item);
    //   }
    // });

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

  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.currentTarget;
    const quizData = quizListData;
    const result = [...state];

    if (result.length >= quizListOrigin.length) {
      alert('더이상 퀴즈를 선택할수 없습니다.');
      return;
    }

    //console.log('name -------------', name, result, quizData, quizListCopy);

    if (result.indexOf(name) > -1) {
      result.splice(result.indexOf(name), 1);
    } else {
      result.push(name);
    }
    setState(result);
    //console.log(state, quizData, result);
    const filteredData = getObjectsWithSequences(quizData, result);
    const valueData = getObjectsWithSequences(quizData, [name]);

    //console.log('filteredData------', filteredData, quizListOrigin);
    //studyCycle 로직추가
    //setQuizListCopy(quizListOrigin);

    const resultArray1 = [];
    //console.log('quizListCopy ', quizListCopy);
    //console.log('quizListOrigin ', quizListOrigin);
    //console.log('resultArray1 ', resultArray1);
    const flag = true;
    if (checked) {
      //console.log('add', quizListOrigin);
      quizListOrigin.map((item, index) => {
        // //console.log(item);
        if (typeof item.order === 'undefined' && flag === true) {
          //console.log('undefind');
          resultArray1.push({
            ...item,
            quizSequence: valueData[0].sequence,
            content: valueData[0].content,
            memberName: valueData[0].memberName,
            isRepresentative: false,
            order: index,
          });
          flag = false;
        } else {
          //console.log('mmn');
          resultArray1.push(item);
        }
      });
      setQuizListCopy(resultArray1);
      setQuizListOrigin(resultArray1);
    } else {
      //console.log('remove', valueData);
      const modifiedArray = quizListOrigin.map(item => {
        if (item.quizSequence === valueData[0].sequence) {
          const { isRepresentative, memberName, order, quizSequence, content, ...rest } = item;
          return rest;
        }
        return item;
      });
      //console.log('remove', modifiedArray);
      setQuizListCopy(modifiedArray);
      setQuizListOrigin(modifiedArray);
      setQuizList(modifiedArray);
    }

    setQuizList(result);
    //console.log(resultArray1);
    // setQuizListCopy(resultArray1);
    // setQuizList(filteredData);
    // setQuizListParam(filteredDataParam);
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

  const setNewCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };
  const [jobGroup, setJobGroup] = useState([]);
  const [jobGroupName, setJobGroupName] = useState([]);
  const [jobGroupObject, setJobGroupObject] = useState([]);
  const [jobGroupPopUp, setJobGroupPopUp] = useState([]);
  const [studyCycle, setStudyCycle] = useState([]);
  const [recommendJobGroups, setRecommendJobGroups] = useState([]);
  const [recommendJobGroupsName, setRecommendJobGroupsName] = useState([]);
  const [recommendJobGroupsObject, setRecommendJobGroupsObject] = useState([]);
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [recommendJobGroupsPopUp, setRecommendJobGroupsPopUp] = useState([]);
  const [recommendLevelsPopUp, setRecommendLevelsPopUp] = useState([]);
  const [clubName, setClubName] = useState<string>('');
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

  const steps = [
    'Step1. 클럽 개설 약속',
    'Step2. 클럽 세부사항 설정',
    'Step3. 성장 퀴즈 선택',
    'Step4. 개설한 성장 미리보기',
  ];

  const [activeStep, setActiveStep] = React.useState(0);
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
    if (activeStep === 2) {
      console.log(quizListOrigin.length, quizList.length);
      if (quizList.length < 3) {
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
      if (countIsRepresentative !== 3) {
        alert('대표 퀴즈는 3개로 설정 해주세요.');
        return 0;
      }
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

    //console.log(activeStep);
  };

  const handleInputChange = event => {
    setClubName(event.target.value);
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

  const useStyles = makeStyles(theme => ({
    selected: {
      '&&': {
        backgroundColor: '#000',
        color: 'white',
      },
    },
  }));

  const StyledSubTabs = styled(MuiTabs)`
    .MuiButtonBase-root.MuiTab-root {
      background: white;
      border-radius: 10px 10px 0 0;
      border-top: 2px solid gray;
      border-left: 2px solid gray;
      border-right: 2px solid gray;
      margin-left: 0px;
      margin-right: 0px;
    }

    .MuiButtonBase-root.MuiTab-root.Mui-selected {
      border-top: 2px solid gray;
      border-left: 2px solid gray;
      border-right: 2px solid gray;
      border-bottom: none; /* not working */
      text-color: #000;
      font-weight: 600;
      z-index: 10;
    }
    .MuiButtonBase-root.MuiTab-root {
      border-bottom: 2px solid gray;
      z-index: 10;
    }

    .MuiTabs-indicator {
      display: none;
    }
  `;

  const handleClickTab = index => {
    setActive(index);
    // tabPannelRefs[index].current?.scrollIntoView({ block: 'center' });
  };

  const classes = useStyles();

  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="dfsdf" subTitle="sdfadf" /> */}

      <div className={cx('container')}>
        <div className="tw-py-5 tw-mb-16">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={5} className="tw-font-bold tw-text-3xl tw-text-black">
              성장퀴즈 &gt; 성장퀴즈 클럽 개설하기
            </Grid>
            <Grid item xs={4} className="tw-font-semi tw-text-base tw-text-black">
              나와 크루들의 성장을 이끌 퀴즈 클럽을 개설해요!
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              {/* <button
                type="button"
                className="tw-text-black tw-border tw-border-indigo-600 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5"
              >
                <Link href="/quiz1" className="nav-link">
                  임시저장 불러오기
                </Link>
              </button> */}
            </Grid>
          </Grid>
        </div>

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
          <div className="tw-mb-10">
            <div className="tw-font-bold tw-text-xl tw-text-black tw-my-20 tw-text-center">개설 전, 약속해요.</div>
            <div className={cx('content-area', ' tw-text-center')}>
              모두의 성장을 돕는 좋은 클럽이 되도록 노력해주실거죠?
            </div>
            <div className={cx('content-area', ' tw-text-center', 'tw-mb-10')}>
              모두가 퀴즈클럽를 통해 성장할 수 있도록 공정한 관리를 부탁드릴게요!
            </div>
            <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
              <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                <div className="tw-row-span-2">
                  {isStepOptional(activeStep) && (
                    <button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    >
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '다음'}
                    </button>
                  )}
                  <button
                    onClick={handleCancel}
                    className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                  >
                    취소하기
                  </button>
                  <button
                    className="tw-w-[300px] tw-bg-[#2474ED] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    onClick={handleNext}
                  >
                    약속할게요.
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeStep === 1 && (
          <article>
            <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">클럽 정보입력</div>
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
                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 직군</div>
                    <ToggleButtonGroup
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
                    </ToggleButtonGroup>

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
                          레벨 {item.name}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                    {recommendLevels.toString() === '0' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        0레벨 : 직무스킬(개발언어/프레임워크 등) 학습 중. 상용서비스 개발 경험 없음.
                      </div>
                    )}
                    {recommendLevels.toString() === '1' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        1레벨 : 상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요.
                      </div>
                    )}
                    {recommendLevels.toString() === '2' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        2레벨 : 상용 서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능.
                      </div>
                    )}
                    {recommendLevels.toString() === '3' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        3레벨 : 상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능.
                      </div>
                    )}
                    {recommendLevels.toString() === '4' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        4레벨 : 다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더.
                      </div>
                    )}
                    {recommendLevels.toString() === '5' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        5레벨 : 본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩.
                      </div>
                    )}

                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                      성장퀴즈 주기 (복수 선택 가능)
                    </div>
                    <ToggleButtonGroup value={studyCycle} onChange={handleStudyCycle} aria-label="" color="standard">
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
                  <div>
                    <div>
                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천직무</div>
                      <ToggleButtonGroup
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
                      </ToggleButtonGroup>

                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">공개/비공개 설정</div>
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
                        className="tw-pl-1 tw-mt-1"
                        size="small"
                        disabled
                        label={'입장코드를 설정해주세요.'}
                        id="margin-none"
                      />
                    </div>
                  </div>
                </div>
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
                <ToggleButtonGroup value={experienceIds} onChange={handleFormatEx} aria-label="" color="standard">
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
                </ToggleButtonGroup>
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
                <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-content-start">
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
                </div>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">성장퀴즈 클럽 소개</div>
                <TextField
                  fullWidth
                  id="margin-none"
                  multiline
                  rows={6}
                  onChange={onMessageChange}
                  value={introductionMessage}
                  defaultValue="클럽 소개 내용을 입력해주세요."
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
                    className="tw-w-[300px] tw-bg-[#2474ED] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    onClick={handleNextOne}
                  >
                    {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '다음'}
                  </button>
                </div>
              </div>
            </div>
          </article>
        )}

        {activeStep === 2 && (
          <>
            <article className="tw-mt-10">
              <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
                <Grid item xs={2} className="tw-font-bold tw-text-xl tw-text-black">
                  퀴즈 등록하기 {quizList.length}
                </Grid>
                <Grid item xs={7} className="tw-font-bold tw-text-xl tw-text-black ">
                  <div className="tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500">
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
                </Grid>
                <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
                  <button
                    type="button"
                    onClick={handleAddClick}
                    className="tw-text-white tw-bg-blue-500 tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5 "
                  >
                    성장퀴즈 추가하기
                  </button>
                </Grid>
              </Grid>
              <div className="tw-mt-10"></div>
              {quizListCopy.length === 0
                ? quizListOrigin.map((item, index) => {
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
                        <Grid item xs={1}>
                          <div className="tw-flex-auto tw-text-center">
                            <button
                              type="button"
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
                        </Grid>
                        <Grid item xs={10}>
                          <div className="tw-flex tw-items-center tw-h-16 tw-p-4 tw-border border mb-3 mt-3 rounded">
                            <div className="tw-flex-auto">
                              <div className="tw-font-medium tw-text-black">{item.content}</div>
                            </div>
                            <div className="">{item.memberName}</div>
                            <svg className="tw-ml-6 tw-h-6 tw-w-6 tw-flex-none" fill="none">
                              <path
                                d="M12 8v1a1 1 0 0 0 1-1h-1Zm0 0h-1a1 1 0 0 0 1 1V8Zm0 0V7a1 1 0 0 0-1 1h1Zm0 0h1a1 1 0 0 0-1-1v1ZM12 12v1a1 1 0 0 0 1-1h-1Zm0 0h-1a1 1 0 0 0 1 1v-1Zm0 0v-1a1 1 0 0 0-1 1h1Zm0 0h1a1 1 0 0 0-1-1v1ZM12 16v1a1 1 0 0 0 1-1h-1Zm0 0h-1a1 1 0 0 0 1 1v-1Zm0 0v-1a1 1 0 0 0-1 1h1Zm0 0h1a1 1 0 0 0-1-1v1Z"
                                fill="#64748B"
                              ></path>
                            </svg>
                          </div>
                        </Grid>
                      </Grid>
                    );
                  })
                : quizListOrigin.map((item, index) => {
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
                        <Grid item xs={1}>
                          <div className="tw-flex-auto tw-text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteQuiz(item.quizSequence)}
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
                        </Grid>
                        <Grid item xs={10}>
                          <div className="tw-flex tw-items-center  tw-h-16 tw-p-4 tw-border border mb-3 mt-3 rounded">
                            <div className="tw-flex-auto">
                              <div className="tw-font-medium tw-text-black">{item?.content}</div>
                            </div>

                            <div className="">
                              {item?.isRepresentative === true && (
                                <div onClick={() => handleClickQuiz(item?.quizSequence, item?.isRepresentative)}>
                                  <Tooltip
                                    content="클릭시 대표퀴즈로 설정됩니다.대표퀴즈 설정은 3개까지 가능합니다."
                                    placement="bottom"
                                    trigger="mouseEnter"
                                    warpClassName={cx('icon-height')}
                                  >
                                    <button
                                      type="button"
                                      data-tooltip-target="tooltip-default"
                                      className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                                    >
                                      대표
                                    </button>
                                  </Tooltip>
                                </div>
                              )}
                              {item?.isRepresentative === false && (
                                <div onClick={() => handleClickQuiz(item?.quizSequence, item?.isRepresentative)}>
                                  <Tooltip
                                    content="클릭시 대표퀴즈로 설정됩니다.대표퀴즈 설정은 3개까지 가능합니다."
                                    placement="bottom"
                                    trigger="mouseEnter"
                                    warpClassName={cx('icon-height')}
                                  >
                                    <button
                                      type="button"
                                      data-tooltip-target="tooltip-default"
                                      className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                                    >
                                      대표
                                    </button>
                                  </Tooltip>
                                </div>
                              )}
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    );
                  })}
              <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
                <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                  <div className="tw-row-span-2">
                    <button
                      onClick={handleBack}
                      className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    >
                      이전
                    </button>
                    <button
                      className="tw-w-[300px] tw-bg-[#2474ED] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                      onClick={handleNext}
                    >
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '미리보기'}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </>
        )}
        {activeStep === 3 && (
          <>
            <article>
              <div className="tw-p-10 tw-bg-gray-50 tw-mt-10">
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

                    {/* <div className="tw-flex tw-items-center tw-space-x-4">
                    <img className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full" src={item?.author?.avatar} alt="" />
                    <div className="tw-text-sm tw-font-semibold tw-text-black dark:tw-text-white">
                      <div>{item?.author?.displayName}</div>
                    </div>
                  </div> */}
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
              })}

              <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
                <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                  <div className="tw-row-span-2">
                    <button
                      onClick={handleBack}
                      className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    >
                      이전
                    </button>
                    <button
                      className="tw-w-[300px] tw-bg-[#2474ED] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                      onClick={handleNextLast}
                    >
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '미리보기'}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </>
        )}
      </div>
      <MentorsModal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
        <div className="tw-font-bold tw-text-xl tw-text-black tw-mt-0 tw-mb-10 tw-text-center">퀴즈 등록하기</div>
        <Box width="100%" sx={{ borderBottom: '1px solid LightGray' }}>
          {/* <div
            style={{
              borderBottom: '2px solid gray',
              height: 51,
              flexGrow: 1,
            }}
          ></div> */}
          <Tabs value={value} onChange={handleChange}>
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
                label={'퀴즈 키워드를 입력하세요.'}
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
            </div>
            {quizListData.map((item, index) => (
              <div key={`admin-menu-${index}`} className="tw-flex tw-pb-5">
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
                        <div className="tw-text-sm tw-font-normal tw-text-gray-500  tw-line-clamp-1">
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
                    <div className="tw-text-gray-400 tw-text-sm  tw-line-clamp-1">{item.createdAt}</div>
                  </div>
                  <div className="tw-flex  tw-items-center py-2">
                    <div className="tw-flex-auto">
                      <div className="tw-font-medium tw-text-black tw-text-base tw-line-clamp-1">{item.content}</div>
                    </div>
                    {/* <div className="">{item.memberName}</div> */}
                  </div>
                  <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-1 tw-text-sm tw-font-bold tw-text-black">아티클</div>
                    <div className="tw-col-span-9 tw-text-sm tw-text-gray-600  tw-line-clamp-1">{item.articleUrl}</div>
                    <div className="tw-col-span-2 tw-text-sm tw-text-right">
                      댓글 : {item.activeCount} 답변 : {item.answerCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Pagination page={page} setPage={setPage} total={totalPage} />
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
                    레벨 {item.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              {recommendLevelsPopUp.toString() === '0' && (
                <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                  0레벨 : 직무스킬(개발언어/프레임워크 등) 학습 중. 상용서비스 개발 경험 없음.
                </div>
              )}
              {recommendLevelsPopUp.toString() === '1' && (
                <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                  1레벨 : 상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요.
                </div>
              )}
              {recommendLevelsPopUp.toString() === '2' && (
                <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                  2레벨 : 상용 서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능.
                </div>
              )}
              {recommendLevelsPopUp.toString() === '3' && (
                <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                  3레벨 : 상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능.
                </div>
              )}
              {recommendLevelsPopUp.toString() === '4' && (
                <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                  4레벨 : 다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더.
                </div>
              )}
              {recommendLevelsPopUp.toString() === '5' && (
                <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                  5레벨 : 본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩.
                </div>
              )}

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
                      <div className="tw-font-medium tw-text-black tw-text-base tw-line-clamp-1">{item.content}</div>
                    </div>
                    {/* <div className="">{item.memberName}</div> */}
                  </div>
                  <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-1 tw-text-sm tw-font-bold tw-text-black">아티클</div>
                    <div className="tw-col-span-9 tw-text-sm tw-text-gray-600  tw-line-clamp-1">{item.articleUrl}</div>
                    <div className="tw-col-span-2 tw-text-sm tw-text-right">
                      댓글 : {item.activeCount} 답변 : {item.answerCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </MentorsModal>
    </div>
  );
}

export default QuizOpenTemplate;
