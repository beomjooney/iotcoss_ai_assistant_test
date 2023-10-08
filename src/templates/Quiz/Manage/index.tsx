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
import { boolean } from 'yup';

const cx = classNames.bind(styles);
export interface QuizManageTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

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

export function QuizManageTemplate({ id }: QuizManageTemplateProps) {
  const { user } = useStore();
  const [page, setPage] = useState(1);
  const [value, setValue] = React.useState(0);
  const [isBookmark, setIsBookmark] = useState(true);
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [quizList, setQuizList] = useState<RecommendContent[]>([]);
  const [quizOriginList, setQuizOriginList] = useState<RecommendContent[]>([]);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState<boolean>(false);
  const { memberId, logged } = useSessionStore.getState();
  const [itemList, setItemList] = useState<any[]>([]);
  const [active, setActive] = useState(0);
  const [quizUrl, setQuizUrl] = React.useState('');
  const [quizName, setQuizName] = React.useState('');
  const [total, setTotal] = React.useState(0);
  const [quizSearch, setQuizSearch] = React.useState('');
  const [params, setParams] = useState<paramProps>({ page });
  const [myParams, setMyParams] = useState<paramProps>({ page });
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
  const [keyWorld, setKeyWorld] = useState('');
  const [myKeyWorld, setMyKeyWorld] = useState('');

  const quizRef = useRef(null);
  const quizUrlRef = useRef(null);

  /**quiz insert */
  const [skillIdsClk, setSkillIdsClk] = useState<any[]>([1, 2, 3, 4, 5]);
  const [jobGroup, setJobGroup] = useState([]);
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<any[]>([]);

  /** get quiz data */
  const { isFetched: isQuizData } = useQuizList(params, data => {
    //console.log('kimcy2', data);
    setQuizListData(data.contents || []);
    setTotalPage(data.totalPages);
  });

  const { data: myQuizListData }: UseQueryResult<any> = useMyQuiz(myParams);
  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();

  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [contentTypes, setContentTypes] = useState<any[]>([]);
  const [jobGroups, setJobGroups] = useState<any[]>([]);
  const [recommendLevelsPopUp, setRecommendLevelsPopUp] = useState([]);
  const [publishedData, setPublishedData] = useState([]);

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setContentTypes(data.data.contents || []);
  });

  /**save profile */
  const { mutate: onQuizOrder, isSuccess: isSuccessOrder } = useQuizOrder();

  useEffect(() => {
    refetchQuizList();
  }, [isSuccessOrder]);

  useEffect(() => {
    setParams({
      page,
      keyword: keyWorld,
    });
  }, [page, keyWorld]);

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

  const handleInputQuizSearchChange = event => {
    setQuizSearch(event.target.value);
  };

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

    console.log('name -------------', name, quizData, quizListCopy);

    if (result.indexOf(name) > -1) {
      result.splice(result.indexOf(name), 1);
    } else {
      result.push(name);
    }
    setState(result);
    //console.log(state, quizData, result);
    const filteredData = getObjectsWithSequences(quizData, [result]);
    const valueData = getObjectsWithSequences(quizData, [name]);

    console.log('filteredData------', filteredData);
    console.log('filteredData------', valueData);
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
        console.log('flag', flag);
        console.log(' total', total);
        console.log('length', result.length);
        // console.log('item', item);
        if (typeof item.order === 'undefined' && flag === true) {
          console.log('undefind');
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

    console.log(resultArray1);
    setQuizList(filteredData);
    setQuizList(result); //퀴즈카운트용
  };

  function handleDeleteQuiz(quizSequence) {
    //console.log('delete', quizSequence);
    //console.log('item.sequence !== ', quizList);
    // "sequence"가 71인 객체를 제외하고 새로운 배열 생성
    const filteredData = quizList.filter(item => item.quizSequence !== quizSequence);
    //console.log('filteredData', filteredData);
    //console.log('quizListCopy', quizListCopy);
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

    console.log('modifiedArray', modifiedArray);
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

    console.log(filteredDataRemove);

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
    //console.log(newFormats);
  };

  const handleRecommendLevelsPopUp = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendLevelsPopUp(newFormats);
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
    console.log(countIsRepresentative);
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
    await onQuizOrder(transformedData);
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
      recommendJobGroups: [jobGroup],
      recommendJobs: jobs,
      recommendLevels: [recommendLevels],
      relatedSkills: skillIds,
      relatedExperiences: experienceIds,
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

    setIsModalOpen(false);
    onQuizSave(params);
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
  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <div className="tw-py-5 tw-mb-16">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={4} className="tw-font-bold tw-text-3xl tw-text-black">
              내가 만든 클럽 &gt; 퀴즈관리
            </Grid>
            <Grid item xs={5} className="tw-font-semi tw-text-base tw-text-black">
              나의 퀴즈클럽 클럽 페이지에 관련 간단한 설명
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex"></Grid>
          </Grid>
        </div>
        <div className="tw-flex tw-items-center tw-mb-6">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-xl tw-text-black">
              <div className="tw-text-base tw-font-right tw-mr-5 tw-text-black">
                총 {quizList.length}/{total}개
              </div>
            </Grid>

            <Grid item xs={7} className="tw-font-bold tw-text-xl tw-text-black ">
              <div className="tw-p-0 tw-text-sm tw-font-normal tw-text-gray-500 ">
                {contents?.recommendJobGroupNames?.map((name, i) => (
                  <span
                    key={i}
                    className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600"
                  >
                    {name}
                  </span>
                ))}
                <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
                  {contents?.recommendLevels?.sort().join(',')}레벨
                </span>
                {contents?.recommendJobNames?.map((name, i) => (
                  <span
                    key={i}
                    className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-100 tw-text-sm tw-font-light tw-text-gray-600"
                  >
                    {name}
                  </span>
                ))}
                {contents?.hashTags?.map((name, i) => (
                  <span
                    key={i}
                    className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-gray-700"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              {/* {contents?.isBeforeOpening ? ( */}
              <div className="">
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="tw-mr-4 tw-text-black tw-bg-white border tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5 "
                >
                  퀴즈 수정하기
                </button>
                <button
                  type="button"
                  onClick={handleQuizAdd}
                  className="tw-text-white tw-bg-blue-500 tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5 "
                >
                  성장퀴즈 추가하기
                </button>
              </div>
              {/* ) : (
                <div></div>
              )} */}
            </Grid>
          </Grid>
        </div>
        <Grid container direction="row" justifyContent="left" alignItems="center">
          <Grid item xs={1}>
            {isQuizListFetch &&
              publishedData.map((item, index) => {
                return (
                  <Grid key={index} container direction="row" justifyContent="left" alignItems="center" rowSpacing={3}>
                    <Grid item xs={10}>
                      <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">Q{index + 1}.</div>
                      <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                        {item?.weekNumber} 주차 ({item?.studyDay})
                      </div>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1} className="">
                      <div className=" tw-p-4 tw-border mb-3 mt-3 tw-h-[60px] "></div>
                    </Grid>
                  </Grid>
                );
              })}
            {isQuizListFetch &&
              quizListCopy.map((item, index) => {
                return (
                  <Grid key={index} container direction="row" justifyContent="left" alignItems="center" rowSpacing={3}>
                    <Grid item xs={10}>
                      {item?.weekNumber ? (
                        <div>
                          <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">
                            Q{item?.weekNumber}.
                          </div>
                          <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                            {item?.weekNumber} 주차 ({item?.studyDay})
                          </div>
                        </div>
                      ) : (
                        <></> // 아무것도 렌더링하지 않음
                      )}
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1} className="">
                      <div className=" tw-p-4 tw-border mb-3 mt-3 tw-h-[60px] "></div>
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
          <Grid item xs={11}>
            {/* {contents?.isBeforeOpening ? ( */}
            <div>
              {publishedData.map((item, index) => {
                return (
                  <Grid
                    key={'drag444-' + index}
                    container
                    direction="row"
                    justifyContent="left"
                    alignItems="center"
                    rowSpacing={3}
                  >
                    <Grid item xs={12}>
                      <div className="tw-flex tw-items-center tw-p-4 tw-border border mb-3 mt-3 rounded  tw-h-[60px]">
                        <div className="tw-flex-auto">
                          <div className="tw-font-medium tw-text-black">{item?.content}</div>
                        </div>

                        <div className="">
                          {item?.isRepresentative === true && (
                            <div>
                              <button
                                type="button"
                                data-tooltip-target="tooltip-default"
                                className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                              >
                                대표
                              </button>
                            </div>
                          )}
                          {item?.isRepresentative === false && (
                            // <div onClick={() => handleClickQuiz(item?.quizSequence, item?.isRepresentative)}>
                            <button
                              type="button"
                              data-tooltip-target="tooltip-default"
                              className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                            >
                              대표
                            </button>
                            // </div>
                          )}
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                );
              })}
              <ReactDragList
                dataSource={quizListCopy}
                rowKey="order"
                row={dragList}
                handles={false}
                className="simple-drag"
                rowClassName="simple-drag-row"
                onUpdate={handleUpdate}
              />
            </div>
            {/* ) : (
              <div>
                {quizListOrigin.map((item, index) => {
                  return (
                    <Grid
                      key={'drag333-' + index}
                      container
                      direction="row"
                      justifyContent="left"
                      alignItems="center"
                      rowSpacing={3}
                    >
                      <Grid item xs={1}>
                        <div className="tw-flex-auto tw-text-center"></div>
                      </Grid>
                      <Grid item xs={11}>
                        <div className="tw-flex tw-items-center tw-p-4 tw-border border mb-3 mt-3 rounded  tw-h-[60px]">
                          <div className="tw-flex-auto">
                            <div className="tw-font-medium tw-text-black">{item?.content}</div>
                          </div>

                          <div className="">
                            {item?.isRepresentative === true && (
                              <div>
                                <button
                                  type="button"
                                  data-tooltip-target="tooltip-default"
                                  className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                                >
                                  대표
                                </button>
                              </div>
                            )}
                            {item?.isRepresentative === false && (
                              // <div onClick={() => handleClickQuiz(item?.quizSequence, item?.isRepresentative)}>
                              <button
                                type="button"
                                data-tooltip-target="tooltip-default"
                                className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                              >
                                대표
                              </button>
                              // </div>
                            )}
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  );
                })}
              </div>
            )} */}
          </Grid>
        </Grid>
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
            {quizListData?.map((item, index) => (
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
                        <div className="tw-text-sm tw-font-normal tw-text-gray-500 tw-line-clamp-1">
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

export default QuizManageTemplate;
function onQuizSave(params: {
  content: string;
  articleUrl: string;
  recommendJobGroups: any[];
  recommendJobs: any[];
  recommendLevels: any[];
  relatedSkills: any;
  relatedExperiences: any;
  hashTags: any[];
}) {
  throw new Error('Function not implemented.');
}
