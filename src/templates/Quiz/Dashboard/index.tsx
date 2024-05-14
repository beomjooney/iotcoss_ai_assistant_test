import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import BannerDetail from 'src/stories/components/BannerDetail';
import { jobColorKey } from 'src/config/colors';
import Chip from 'src/stories/components/Chip';
import { useStore } from 'src/store';
import { Pagination, MentorsModal } from 'src/stories/components';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Divider from '@mui/material/Divider';
import { paramProps, useClubQuizManage } from 'src/services/seminars/seminars.queries';
import { useContentJobTypes, useContentTypes, useJobGroups, useJobGroupss } from 'src/services/code/code.queries';
import Tooltip from 'src/stories/components/Tooltip';
import { RecommendContent } from 'src/models/recommend';
import { useSessionStore } from 'src/store/session';
import Grid from '@mui/material/Grid';

/** drag list */
import ReactDragList from 'react-drag-list';
import { useQuizOrder } from 'src/services/quiz/quiz.mutations';

/**import quiz modal  */
import { useJobs, useMyQuiz, useQuizList } from 'src/services/jobs/jobs.queries';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Box from '@mui/system/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import { UseQueryResult } from 'react-query';
import { useSkills } from 'src/services/skill/skill.queries';
import { useExperiences } from 'src/services/experiences/experiences.queries';
import { TagsInput } from 'react-tag-input-component';
import { useQuizSave } from 'src/services/quiz/quiz.mutations';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import SettingsIcon from '@mui/icons-material/Settings';
import { Line, Circle } from 'rc-progress';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import router from 'next/router';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  sticky: {
    position: 'sticky',
    backgroundColor: '#F6F7FB',
    zIndex: 1,
  },
  stickyWhite: {
    position: 'sticky',
    backgroundColor: 'white',
    zIndex: 1,
  },
  stickyWhiteBoard: {
    position: 'sticky',
    backgroundColor: 'white',
    borderRight: '2px solid black',
    zIndex: 1,
  },
  stickyBoard: {
    position: 'sticky',
    backgroundColor: '#F6F7FB',
    borderRight: '2px solid black',
    zIndex: 1,
  },
  stickyFirst: {
    left: 0,
  },
  stickySecond: {
    left: 100, // 이 값을 `Dessert` 열의 너비에 맞게 조정하세요.
  },
  stickyThread: {
    left: 220, // 이 값을 `Dessert` 열의 너비에 맞게 조정하세요.
  },
});
const cx = classNames.bind(styles);
export interface QuizDashboardTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

const columns = [
  { key: 'id', name: 'ID' },
  { key: 'title', name: 'Title' },
];

const rows = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' },
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
];

export function QuizDashboardTemplate({ id }: QuizDashboardTemplateProps) {
  const [page, setPage] = useState(1);
  const [value, setValue] = React.useState(0);
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [quizList, setQuizList] = useState<RecommendContent[]>([]);
  const [itemList, setItemList] = useState<any[]>([]);
  const [active, setActive] = useState(0);
  const [quizUrl, setQuizUrl] = React.useState('');
  const [quizName, setQuizName] = React.useState('');
  const [total, setTotal] = React.useState(0);
  const [quizSearch, setQuizSearch] = React.useState('');
  const [params, setParams] = useState<paramProps>({ page });

  const [state, setState] = React.useState([]);
  const [jobGroupPopUp, setJobGroupPopUp] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [jobs, setJobs] = useState([]);
  const [skillIdsPopUp, setSkillIdsPopUp] = useState<any[]>([]);
  const [experienceIdsPopUp, setExperienceIdsPopUp] = useState<any[]>([]);
  const [selected, setSelected] = useState([]);

  const [totalPage, setTotalPage] = useState(1);
  const [quizListCopy, setQuizListCopy] = useState<any[]>([]);
  const [quizListOrigin, setQuizListOrigin] = useState<any[]>([]);
  const [quizListData, setQuizListData] = useState<any[]>([]);
  const [myQuizListData, setMyQuizListData] = useState<any[]>([]);
  const [tabQuizListData, setTabQuizListData] = useState<any[]>([]);
  const [keyWorld, setKeyWorld] = useState('');
  const [myKeyWorld, setMyKeyWorld] = useState('');
  const [selectedOption, setSelectedOption] = useState('latest');

  const quizRef = useRef(null);
  const quizUrlRef = useRef(null);
  const quizStartPos = useRef(null);

  /**quiz insert */
  const [skillIdsClk, setSkillIdsClk] = useState<any[]>([1, 2, 3, 4, 5]);
  const [jobGroup, setJobGroup] = useState([]);
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<any[]>([]);

  const handleChangeQuiz = event => {
    setSelectedOption(event.target.value);
  };
  const dateInfo = {
    sessions: [
      { number: '1회', date: '07-01 (월)' },
      { number: '2회', date: '07-08 (월)' },
      { number: '3회', date: '07-15 (월)' },
      { number: '4회', date: '07-22 (월)' },
      { number: '5회', date: '07-29 (월)' },
      { number: '6회', date: '08-05 (월)' },
      { number: '7회', date: '08-12 (월)' },
      { number: '8회', date: '08-19 (월)' },
      { number: '9회', date: '08-19 (월)' },
      { number: '10회', date: '08-19 (월)' },
      { number: '11회', date: '08-19 (월)' },
      { number: '12회', date: '08-19 (월)' },
      { number: '12회', date: '08-19 (월)' },
      { number: '12회', date: '08-19 (월)' },
      { number: '12회', date: '08-19 (월)' },
      { number: '12회', date: '08-19 (월)' },
      { number: '12회', date: '08-19 (월)' },
    ],
    student: [
      {
        name: '김승테',
        sessions: [
          {
            date: '09-03 (월)',
            color: '#31343D',
            text: '3',
          },
          {
            date: '00-16 (월)',
            color: '#FF8F60',
            text: '?',
          },
          {
            date: '09-18 (수)',
            color: '#E11837',
            text: '?',
          },
          {
            date: 'D+2',
            color: 'white',
            borderColor: '#E11837',
            text: '?',
            isBold: true,
          },
          {
            date: 'D+2',
            color: 'white',
            borderColor: '#E11837',
            text: '?',
            isBold: true,
          },
          {
            date: 'D+2',
            color: 'white',
            borderColor: '#E11837',
            text: '?',
            isBold: true,
          },
          {
            date: 'D+2',
            color: '#F6F7FB',
            borderColor: '#E0E4EB',
            text: '',
            isBold: false,
          },
        ],
      },
      {
        name: '김승테',
        sessions: [
          {
            date: '09-03 (월)',
            color: '#31343D',
            text: '3',
          },
          {
            date: '00-16 (월)',
            color: '#FF8F60',
            text: '?',
          },
          {
            date: '09-18 (수)',
            color: '#E11837',
            text: '?',
          },
          {
            date: 'D+2',
            color: 'white',
            borderColor: '#E11837',
            text: '?',
            isBold: true,
          },
          {
            date: 'D+2',
            color: 'white',
            borderColor: '#E11837',
            text: '?',
            isBold: true,
          },
          {
            date: 'D+2',
            color: 'white',
            borderColor: '#E11837',
            text: '?',
            isBold: true,
          },
        ],
      },
    ],
  };

  /** get quiz data */
  const { isFetched: isQuizData, refetch } = useQuizList(params, data => {
    setQuizListData(data.contents || []);
    setTotalPage(data.totalPages);
  });

  /** my quiz replies */
  const [quizPage, setQuizPage] = useState(1);
  const [quizTotalPage, setQuizTotalPage] = useState(1);
  const [myParams, setMyParams] = useState<paramProps>({ quizPage });
  // const { data: myQuizListData, refetch: refetchMyQuiz }: UseQueryResult<any> = useMyQuiz(myParams, data => {
  // });

  /** get quiz data */
  const { isFetched: isMyQuizData, refetch: refetchMyQuiz } = useMyQuiz(myParams, data => {
    setMyQuizListData(data.contents || []);
    setQuizTotalPage(data.totalPages);
  });

  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();

  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [contentTypes, setContentTypes] = useState<any[]>([]);
  const [jobGroups, setJobGroups] = useState<any[]>([]);
  const [recommendLevelsPopUp, setRecommendLevelsPopUp] = useState([]);
  const [publishedData, setPublishedData] = useState([]);

  /** quiz save */
  const { mutate: onQuizSave, isSuccess: postSucces } = useQuizSave();

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setContentTypes(data.data.contents || []);
  });

  const { isFetched: isJobGroupsFetched } = useJobGroupss(data => setJobGroups(data.data.contents || []));

  /**save profile */
  const { mutate: onQuizOrder, isSuccess: isSuccessOrder } = useQuizOrder();

  useEffect(() => {
    if (postSucces) {
      refetchMyQuiz();
      quizStartPos.current.scrollTop = 0;
    }
  }, [postSucces]);

  useEffect(() => {
    if (isSuccessOrder) {
      refetchQuizList();
    }
  }, [isSuccessOrder]);

  useDidMountEffect(() => {
    setParams({
      page,
      keyword: keyWorld,
    });
  }, [page, keyWorld]);

  useDidMountEffect(() => {
    setMyParams({
      page: quizPage,
      keyword: myKeyWorld,
    });
  }, [quizPage, myKeyWorld]);

  useDidMountEffect(() => {
    setKeyWorld('');
    setMyKeyWorld('');
    if (active == 0) {
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
    }
  }, [active]);

  /** include quiz */
  const { isFetched: isQuizListFetch, refetch: refetchQuizList } = useClubQuizManage(id, data => {
    setContents(data || []);

    const publishedData = data.quizzes.filter(item => item.isPublished);
    const unpublishedData = data.quizzes.filter(item => !item.isPublished);

    //console.log('Published Data:', publishedData);
    //console.log('Unpublished Data:', unpublishedData);
    //console.log(' Data size:', data.weekCount * data.studyCycle.length);

    setPublishedData(publishedData);
    setQuizListCopy(unpublishedData || []);
    setTotal(data.weekCount * data.studyCycle.length);
    setQuizListOrigin(data.quizzes);
    setQuizList(data.quizzes);
    const quizSequenceArray = data.quizzes.map(item => item.quizSequence.toString());
    setState(quizSequenceArray);
  });

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

  const handleChange = (event, newIndex) => {
    //console.log('SubTab - index', newIndex, event);
    setActive(newIndex);
    setValue(newIndex);
  };

  function getObjectsWithSequences(arr, sequenceArray) {
    //console.log(arr, sequenceArray);
    //console.log(arr.length, sequenceArray.length);

    return arr
      .filter(item => sequenceArray.includes(item.sequence.toString()))
      .map(item => ({
        ...item,
        // quizSequence: 1,
        // order: 0,
        // isRepresentative: false,
        // isPublic: true,
        // publishAt: '2023-08-22 00:00:00',
      }));
  }

  function getObjectsWithSequencesParam(arr, sequenceArray) {
    //console.log(arr, sequenceArray);

    return arr
      .filter(item => sequenceArray.includes(String(item.sequence)))
      .map((item, index) => ({
        quizSequence: item.sequence,
        order: index + 1,
        isRepresentative: false,
        // isPublic: true,
        // publishAt: '2023-08-22 00:00:00',
      }));
  }

  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.currentTarget;
    const quizData = quizListData;
    const result = [...state];

    if (result.length >= total) {
      alert('더이상 퀴즈를 선택할수 없습니다. \n퀴즈를 지우고 추가해주세요.');
      return;
    }

    //console.log('name -------------', name, quizData, quizListCopy);

    if (result.indexOf(name) > -1) {
      result.splice(result.indexOf(name), 1);
    } else {
      result.push(name);
    }
    setState(result);
    //console.log('state', state);
    //console.log('quizData', quizData);
    //console.log('result', result);
    //console.log('name', name);
    const filteredData = getObjectsWithSequences(quizData, [result]);
    const valueData = getObjectsWithSequences(quizData, [name]);

    //console.log('filteredData------', filteredData);
    //console.log('filteredData------', valueData);
    //studyCycle 로직추가
    //setQuizListCopy(quizListOrigin);

    const resultArray1 = [];
    //console.log('quizListCopy ', quizListCopy);
    //console.log('quizListOrigin ', quizListOrigin);
    const flag = true;
    const flag1 = true;
    if (checked) {
      //console.log('add');
      quizListCopy.map((item, index) => {
        // //console.log(item);
        //console.log('flag', flag);
        //console.log(' total', total);
        //console.log('length', result.length);
        // console.log('item', item);
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
          resultArray1.push(item);
        }
      });

      //console.log(valueData[0]);

      if (result.length <= total && flag === true) {
        resultArray1.push({
          clubQuizSequence: valueData[0].clubQuizSequence,
          clubSequence: parseInt(id),
          quizSequence: valueData[0].sequence,
          content: valueData[0].content,
          memberName: valueData[0].memberName,
          activeCount: valueData[0].activeCount,
          answerCount: valueData[0].answerCount,
          isPublished: valueData[0].isPublished,
          likeCount: valueData[0].likeCount,
          publishDate: valueData[0].publishDate,
          studyDay: valueData[0].studyDay,
          weekNumber: valueData[0].weekNumber,
          isRepresentative: false,
          order: result.length,
        });
      }

      setQuizListCopy(resultArray1);
    } else {
      //console.log('remove', valueData);
      const modifiedArray = quizListCopy.map(item => {
        if (item.quizSequence === valueData[0].sequence) {
          const {
            isRepresentative,
            memberName,
            order,
            // quizSequence,
            content,
            publishDate,
            // studyDay,
            // weekNumber,
            likeCount,
            isPublished,
            answerCount,
            activeCount,
            ...rest
          } = item;
          return rest;
        }
        return item;
      });
      setQuizListCopy(modifiedArray);
    }

    //console.log(resultArray1);
    setQuizList(filteredData);
    setQuizList(result); //퀴즈카운트용
  };
  const handleChangeMyCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.currentTarget;
    const quizData = myQuizListData;
    const result = [...state];

    if (result.length >= total) {
      alert('더이상 퀴즈를 선택할수 없습니다. \n퀴즈를 지우고 추가해주세요.');
      return;
    }
    if (result.indexOf(name) > -1) {
      result.splice(result.indexOf(name), 1);
    } else {
      result.push(name);
    }
    setState(result);
    const filteredData = getObjectsWithSequences(quizData, [result]);
    const valueData = getObjectsWithSequences(quizData, [name]);
    const resultArray1 = [];
    const flag = true;
    const flag1 = true;
    if (checked) {
      //console.log('add');
      quizListCopy.map((item, index) => {
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
          resultArray1.push(item);
        }
      });

      //console.log(valueData[0]);

      if (result.length <= total && flag === true) {
        resultArray1.push({
          clubQuizSequence: valueData[0].clubQuizSequence,
          clubSequence: parseInt(id),
          quizSequence: valueData[0].sequence,
          content: valueData[0].content,
          memberName: valueData[0].memberName,
          activeCount: valueData[0].activeCount,
          answerCount: valueData[0].answerCount,
          isPublished: valueData[0].isPublished,
          likeCount: valueData[0].likeCount,
          publishDate: valueData[0].publishDate,
          studyDay: valueData[0].studyDay,
          weekNumber: valueData[0].weekNumber,
          isRepresentative: false,
          order: result.length,
        });
      }

      setQuizListCopy(resultArray1);
    } else {
      const modifiedArray = quizListCopy.map(item => {
        if (item.quizSequence === valueData[0].sequence) {
          const {
            isRepresentative,
            memberName,
            order,
            // quizSequence,
            content,
            publishDate,
            // studyDay,
            // weekNumber,
            likeCount,
            isPublished,
            answerCount,
            activeCount,
            ...rest
          } = item;
          return rest;
        }
        return item;
      });
      setQuizListCopy(modifiedArray);
    }
    setQuizList(filteredData);
    setQuizList(result); //퀴즈카운트용
  };

  function handleDeleteQuiz(quizSequence) {
    //console.log('delete', quizSequence);
    //console.log('item.sequence !== ', quizList);
    // "sequence"가 71인 객체를 제외하고 새로운 배열 생성
    const filteredData = quizList.filter(item => item.quizSequence !== quizSequence);
    //console.log('filteredData', filteredData);
    //console.log('Delete quizListCopy', quizListCopy);
    //console.log('quizListOrigin', quizListOrigin);

    const resultArray1 = [];
    //console.log('resultArray1 ', resultArray1);

    // filter 메서드를 사용하여 특정 quizSequence를 가진 요소를 제거하고 키 제거
    // map 메서드를 사용하여 targetSequence에 해당하는 요소만 수정
    const modifiedArray = quizListCopy.map(item => {
      if (item.quizSequence === quizSequence) {
        const {
          isRepresentative,
          memberName,
          order,
          quizSequence,
          content,
          publishDate,
          // studyDay,
          // weekNumber,
          likeCount,
          isPublished,
          answerCount,
          activeCount,
          ...rest
        } = item;
        return rest;
      }
      return item;
    });

    //console.log('Deleted modifiedArray', modifiedArray);
    //console.log('filteredArray1', state, quizSequence, resultArray1);
    const filteredArray = state.filter(item => {
      if (quizSequence !== undefined) {
        return item !== quizSequence.toString();
      }
      return true;
    });
    //퀴즈가 클럽에 등록이 안되어있는경우. 등록 삭제일때 문제 발생.
    // "weekNumber"가 undefined인 항목을 필터링하여 새로운 배열 생성
    // const filteredDataRemove = modifiedArray.filter(item => item.content !== undefined);
    // "weekNumber"가 undefined이거나 "content"가 null인 항목을 필터링하여 새로운 배열 생성
    const filteredDataRemove = modifiedArray.filter(item => item.activeCount !== null);

    //console.log(filteredDataRemove);

    //console.log('filteredArray', filteredArray);
    //console.log('filtmodifiedArrayeredArray2', modifiedArray);
    //console.log('filteredData', filteredData);
    setState(filteredArray);
    setQuizListCopy(filteredDataRemove);
    setQuizList(filteredData);
  }

  // 드래그해서 변경된 리스트를 브라우저상에 나타나게 만드는것
  const handleFormatExPopUp = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setExperienceIdsPopUp(newFormats);
  };

  const handleRecommendLevelsPopUp = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    if (newFormats) {
      setRecommendLevelsPopUp(newFormats);
    }
  };

  const handleFormatPopUp = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setSkillIdsPopUp(newFormats);
    //console.log(newFormats);
  };

  const handleJobsPopUp = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    //console.log(event.currentTarget);
    setJobs(newFormats);
    //console.log(newFormats);
  };

  const handleUpdate = (evt: any, updated: any) => {
    //console.log(evt); // tslint:disable-line
    //console.log(updated); // tslint:disable-line
    setItemList([...updated]);
  };

  const handleJobGroups = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    //console.log(event.currentTarget);
    setJobGroupPopUp(newFormats);
    //console.log(newFormats);
  };

  const handleQuizAdd = () => {
    setIsModalOpen(true);
  };

  const handleInputQuizChange = event => {
    setQuizName(event.target.value);
  };

  const handleInputQuizUrlChange = event => {
    setQuizUrl(event.target.value);
  };

  const handleAddClick = async () => {
    const arrayList = [...publishedData, ...quizListCopy];

    // Transforming the data into an array of objects with "clubQuizSequence" and "order" properties
    //"isRepresentative" 값이 true인 개수를 세기 위한 변수
    let countIsRepresentative = 0;

    //데이터를 순회하면서 "isRepresentative" 값이 true인 경우 카운트 증가
    arrayList.forEach(quiz => {
      if (quiz.isRepresentative === true) {
        countIsRepresentative++;
      }
    });
    //console.log(countIsRepresentative);
    //"isRepresentative" 값이 3개가 아닌 경우 알림 창 표시
    if (countIsRepresentative !== 3) {
      alert('대표 퀴즈는 3개입니다.');
      return;
    }

    // 빈 객체를 제거한 새로운 배열 생성
    // "content" 필드가 있는 항목만 필터링
    const filteredData = arrayList.filter(item => item.hasOwnProperty('content'));
    const transformedData = {
      clubSequence: contents?.clubSequence, // Add the "clubSequence" property with a value of 2
      clubQuizzes: filteredData.map((item, index) => ({
        quizSequence: item.quizSequence,
        isRepresentative: item.isRepresentative,
        // order: index,
      })),
    };
    //console.log(transformedData);
    onQuizOrder(transformedData);
  };

  function handleClickQuiz(quizSequence, flag) {
    //console.log(quizSequence, flag);
    // "quizSequence"가 83인 객체를 찾아서 "isRepresentative" 값을 변경
    //console.log(quizListCopy);
    const updatedData = quizListCopy.map(item => {
      if (item.quizSequence === quizSequence) {
        return {
          ...item,
          isRepresentative: !flag,
        };
      }
      return item;
    });
    //console.log(updatedData);
    // const arrayList = [...publishedData, ...quizListCopy];
    // "isRepresentative" 값이 true인 개수를 세기 위한 변수
    // let countIsRepresentative = 0;

    // 데이터를 순회하면서 "isRepresentative" 값이 true인 경우 카운트 증가
    // arrayList.forEach(quiz => {
    //   if (quiz.isRepresentative === true) {
    //     countIsRepresentative++;
    //   }
    // });
    //console.log(countIsRepresentative);
    // "isRepresentative" 값이 3개가 아닌 경우 알림 창 표시
    // if (countIsRepresentative >= 3) {
    //   alert('대표 퀴즈는 3개입니다.');
    // } else {
    //   setQuizListCopy(updatedData);
    // }
    setQuizListCopy(updatedData);
  }

  const handleQuizInsertClick = async () => {
    const params = {
      content: quizName,
      articleUrl: quizUrl,
      recommendJobGroups: [jobGroupPopUp],
      recommendJobs: jobs,
      recommendLevels: [recommendLevelsPopUp],
      relatedSkills: skillIds,
      relatedExperiences: experienceIds,
      hashTags: selected,
    };

    if (quizName === '') {
      alert('질문을 입력해주세요.');
      quizRef.current.scrollTop = 0;
      return;
    }

    if (quizUrl === '') {
      alert('아티클을 입력해주세요.');
      quizUrlRef.current.scrollTop = 0;
    }

    //console.log(jobs, jobGroup);

    if (jobGroupPopUp?.length === 0 || jobGroupPopUp?.length === undefined) {
      alert('추천 직군을 선택해주세요.');
      return;
    }

    if (recommendLevelsPopUp?.length === 0 || recommendLevelsPopUp?.length === undefined) {
      alert('추천 레벨을 선택해주세요.');
      return;
    }

    onQuizSave(params);
    setActive(2);
    setValue(2);
  };

  const dragList = (item: any, index: any) => (
    <Grid
      key={'drag-' + item.sequence}
      container
      direction="row"
      justifyContent="left"
      alignItems="center"
      rowSpacing={3}
    >
      <Grid item xs={1}>
        <div className="tw-flex-auto tw-text-center">
          <button
            type="button"
            className="tw-text-blue-700 border tw-border-blue-700 tw-font-medium tw-rounded-lg tw-text-sm tw-p-2.5 tw-text-center tw-inline-flex tw-items-center tw-mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="tw-w-6 tw-h-6 tw-text-black"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>

            <span className="sr-only">Icon description</span>
          </button>
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
              className="tw-w-6 tw-h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth={1}
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
        <div className="tw-flex tw-items-center tw-p-4 tw-border border mb-3 mt-3 rounded  tw-h-[60px]">
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
                  퀴즈클럽 대시보드
                </p>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-[31.5px] tw-gap-3.5">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
                  퀴즈클럽 대시보드
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
            <Grid item xs={11.1} className="tw-font-bold tw-text-xl tw-text-black ">
              <select className="form-select border-danger" aria-label="Default select example">
                <option selected>퀴즈클럽 임베디드 시스템 [전공선택] 3학년 화요일 A반 </option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </Grid>

            <Grid item xs={0.9} justifyContent="flex-end" className="tw-flex">
              {/* {contents?.isBeforeOpening ? ( */}
              <div className="">
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="tw-text-black tw-bg-[#CED4DE] border tw-font-medium tw-rounded-md tw-text-sm tw-px-6 tw-py-2 "
                >
                  <SettingsIcon className="tw-bg-[#CED4DE] tw-text-white" />
                </button>
              </div>
            </Grid>
          </Grid>
        </div>
        <div className="tw-w-full tw-py-5 tw-cursor-pointer">
          <div
            onClick={() => router.push('/quiz-list/20')}
            className="tw-h-[50px] tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border tw-border-secondary"
          >
            <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-[28.21px] tw-top-[14px] tw-gap-[16.133331298828125px]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">
                ㄴ 퀴즈 목록 전체보기
              </p>
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-w-6 tw-h-6 tw-absolute tw-right-[2%] tw-top-[14px]"
              preserveAspectRatio="none"
            >
              <path
                d="M16.4647 11.6552L9.25269 4.44319L7.55469 6.13879L13.0747 11.6552L7.55469 17.1704L9.25149 18.8672L16.4647 11.6552Z"
                fill="#9CA5B2"
              ></path>
            </svg>
          </div>
        </div>
        <div className="tw-grid tw-grid-cols-4 tw-gap-10">
          <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
            <div className="tw-h-[60.5px] tw-overflow-hidden border-bottom">
              <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[20.16px] tw-top-[18.15px] tw-gap-[12.09999942779541px]">
                <div className="tw-w-[4.03px] tw-h-[16.13px] tw-bg-[#e11837]"></div>
                <p className=" tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">참여인원</p>
              </div>
            </div>
            <div className="tw-py-8">
              <p className="tw-text-center tw-text-[68.91717529296875px] tw-font-bold tw-text-left tw-text-[#31343d]">
                30
                <span className="tw-text-center tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">명</span>
              </p>
            </div>
          </div>
          <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
            <div className="tw-h-[60.5px] tw-overflow-hidden border-bottom">
              <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[20.16px] tw-top-[18.15px] tw-gap-[12.09999942779541px]">
                <div className="tw-w-[4.03px] tw-h-[16.13px] tw-bg-[#e11837]"></div>
                <p className=" tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">학습현황</p>
              </div>
            </div>
            <div className="tw-flex tw-flex-col tw-h-[70%] tw-justify-center tw-gap-1">
              <p className="tw-ml-10 tw-text-left tw-text-base tw-font-bold tw-text-[#31343d]">클럽 주수 : 12주</p>
              <p className="tw-ml-10 tw-text-left tw-text-base tw-font-bold tw-text-[#31343d]">
                학습 회차 : <span className="tw-text-[#e11837]">5회차</span> / 24회
              </p>
              <p className="tw-ml-10 tw-text-left tw-text-base tw-font-bold tw-text-[#31343d]">남은 학습 : 19회</p>
            </div>
          </div>
          <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
            <div className="tw-h-[60.5px] tw-overflow-hidden border-bottom">
              <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[20.16px] tw-top-[18.15px] tw-gap-[12.09999942779541px]">
                <div className="tw-w-[4.03px] tw-h-[16.13px] tw-bg-[#e11837]"></div>
                <p className=" tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">현재 진행중인 퀴즈</p>
              </div>
            </div>
            <div className="tw-flex tw-flex-col tw-h-[70%] tw-justify-center tw-gap-1">
              <p className="tw-px-5 tw-text-center tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                Spring에서 적용가능한 Circuit breaker 라이브러리와 특징에 대해서 설명하세요.
              </p>
            </div>
          </div>
          <div className="tw-relative tw-overflow-hidden tw-rounded-[8.07px] tw-bg-white border tw-border-[#e9ecf2]">
            <div className="tw-h-[60.5px] tw-overflow-hidden border-bottom">
              <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[20.16px] tw-top-[18.15px] tw-gap-[12.09999942779541px]">
                <div className="tw-w-[4.03px] tw-h-[16.13px] tw-bg-[#e11837]"></div>
                <p className=" tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">이번주 참여율</p>
              </div>
            </div>
            <div className=" tw-h-[70%] tw-flex tw-justify-center tw-items-center">
              <Circle
                className="tw-h-[120px]"
                trailWidth={9}
                trailColor="#DADADA"
                percent={80}
                strokeWidth={9}
                strokeColor="#e11837"
              />
              <div className="tw-flex tw-justify-center tw-items-center tw-absolute tw-h-full tw-w-full">
                <p className="tw-text-xl tw-font-bold tw-text-[#e11837]">80%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-flex tw-justify-between tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
          <RadioGroup
            className="tw-items-center tw-py-5 tw-gap-3"
            value={selectedOption}
            onChange={handleChangeQuiz}
            row
          >
            <p className="tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] tw-mb-1">정렬 :</p>
            <FormControlLabel
              value="latest"
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
              value="oldest"
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
                  좋아요순
                </p>
              }
            />
          </RadioGroup>
          <p className="tw-flex tw-items-center tw-justify-end tw-text-center tw-py-5">
            <div className="tw-flex tw-justify-end tw-items-center tw-gap-3">
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tw-flex-grow-0 tw-flex-shrink-0"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <circle cx="7" cy="7.5" r="6.5" fill="white" stroke="#E11837"></circle>
                </svg>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                  미제출
                </p>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tw-flex-grow-0 tw-flex-shrink-0"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <circle cx="7" cy="7.5" r="7" fill="#FF4444"></circle>
                </svg>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                  미채점
                </p>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tw-flex-grow-0 tw-flex-shrink-0"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <circle cx="7" cy="7.5" r="7" fill="#31343D"></circle>
                </svg>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                  채점완료
                </p>
              </div>
            </div>
          </p>
        </div>
        {/* <DataGrid columns={columns} rows={rows} />; */}
        <TableContainer>
          <Table className={classes.table} aria-label="simple table" style={{ tableLayout: 'fixed' }}>
            <TableHead style={{ backgroundColor: '#F6F7FB' }}>
              <TableRow>
                <TableCell align="center" width={100} className={`${classes.sticky} ${classes.stickyFirst}`}>
                  학생
                </TableCell>
                <TableCell align="center" width={120} className={`${classes.stickyBoard} ${classes.stickySecond}`}>
                  학습현황
                </TableCell>
                <TableCell align="center" width={140}>
                  합산점수
                </TableCell>

                {dateInfo.sessions.map((session, index) => (
                  <TableCell key={index} width={100} align="right">
                    <div>
                      <p className="tw-text-base tw-font-medium tw-text-center tw-text-[#31343d] tw-left-[15px] tw-top-0">
                        {session.number}
                      </p>
                      <p className="tw-w-full tw-h-3.5 tw-text-xs tw-font-medium tw-text-center tw-text-[#9ca5b2] tw-bottom-0">
                        {session.date}
                      </p>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dateInfo.student.map((info, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell
                    align="center"
                    width={100}
                    component="th"
                    scope="row"
                    className={`${classes.stickyWhite} ${classes.stickyFirst}`}
                  >
                    <div className="tw-flex tw-items-center tw-gap-3">
                      <img src="/assets/images/quiz/아그리파_1.png" alt="아그리파" />
                      <div>test</div>
                    </div>
                  </TableCell>
                  <TableCell
                    align="center"
                    width={120}
                    component="th"
                    scope="row"
                    className={`${classes.stickyWhiteBoard} ${classes.stickySecond}`}
                  >
                    <div className="tw-grid tw-grid-cols-5 tw-gap-1 tw-justify-center tw-items-center">
                      <div className="tw-col-span-3 progress tw-rounded tw-h-2 tw-p-0">
                        <span style={{ width: `70%` }}>
                          <span className="progress-line"></span>
                        </span>
                      </div>
                      <div className="tw-col-span-2">5회</div>
                    </div>
                  </TableCell>
                  <TableCell padding="none" align="center" width={130} component="th" scope="row">
                    <div className="border-bottom">
                      <div className="tw-grid tw-grid-cols-2 tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                        <div className="tw-col-span-1 tw-text-xs">
                          교수
                          <br />
                          채점
                        </div>
                        <div className="tw-col-span-1">
                          <span className="tw-font-bold">5.28</span> /
                          <span className="tw-font-bold tw-text-[#9CA5B2]">60</span>
                        </div>
                      </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-2 tw-gap-0 tw-justify-center tw-items-center tw-p-2">
                      <div className="tw-col-span-1 tw-text-xs">
                        AI
                        <br />
                        채점
                      </div>
                      <div className="tw-col-span-1">
                        <span className="tw-font-bold">5.28</span> /
                        <span className="tw-font-bold tw-text-[#9CA5B2]">60</span>
                      </div>
                    </div>
                  </TableCell>
                  {info.sessions.map((info, index) => (
                    <TableCell padding="none" key={index} align="center" width={100} component="th" scope="row">
                      <div className="border-bottom">
                        <div className="tw-h-12 tw-flex tw-justify-center tw-items-center">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="tw-left-[-1px] tw-top-[-1px]"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="9.5"
                              fill={info.color}
                              stroke={info.borderColor || info.color}
                            ></circle>
                            <text
                              x="10" // x 좌표, 원의 중심
                              y="10" // y 좌표, 원의 중심을 약간 조정해야 할 수 있습니다
                              textAnchor="middle" // 텍스트를 x 좌표의 중앙에 정렬
                              dominantBaseline="central" // 텍스트를 y 좌표의 중앙에 정렬
                              fill="white" // 텍스트 색상
                              className="tw-text-xs tw-font-medium tw-text-center"
                            >
                              {info.text}
                            </text>
                          </svg>
                        </div>
                      </div>
                      <div className="tw-h-12 tw-text-center tw-flex tw-justify-center tw-items-center">
                        <div>
                          <span className="">3.21</span>
                        </div>
                      </div>
                    </TableCell>
                  ))}

                  <p className="tw-absolute tw-left-[310px] tw-top-[22px] tw-text-base tw-font-semibold tw-text-center tw-text-[#31343d]">
                    5/60
                  </p>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
        </Box>
        {active === 0 && (
          <div className="">
            <div className="tw-mt-10 tw-mb-8">
              <TextField
                size="small"
                fullWidth
                label={'퀴즈 키워드를 입력하세요.'}
                id="margin-none"
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
          <div ref={quizStartPos}>
            <div className="tw-mt-10 tw-mb-8">
              <TextField
                size="small"
                fullWidth
                label={'내 퀴즈 키워드를 입력하세요.'}
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
            {myQuizListData?.map((item, index) => (
              <div key={`admin-quiz-${index}`} className="tw-flex tw-pb-5">
                <Checkbox
                  disableRipple
                  onChange={handleChangeMyCheck}
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
            <Pagination page={quizPage} setPage={setQuizPage} total={quizTotalPage} />
          </div>
        )}
      </MentorsModal>
    </div>
  );
}

export default QuizDashboardTemplate;
