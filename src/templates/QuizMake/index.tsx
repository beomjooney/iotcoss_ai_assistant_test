import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Chip, MentorsModal, Textfield } from 'src/stories/components';
import React, { useEffect, useState, useRef } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import SearchIcon from '@mui/icons-material/Search';
import { UseQueryResult } from 'react-query';
import { useMyQuiz, useMyQuizContents } from 'src/services/jobs/jobs.queries';
import { useQuizSave } from 'src/services/quiz/quiz.mutations';
import { useContentJobTypes, useContentTypes } from 'src/services/code/code.queries';
import { useDeletePost } from 'src/services/community/community.mutations';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { makeStyles } from '@material-ui/core';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Checkbox from '@mui/material/Checkbox';
import KnowledgeComponent from 'src/stories/components/KnowledgeComponent';
import ArticleList from 'src/stories/components/ArticleList';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TagsInput } from 'react-tag-input-component';
import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { useOptions } from 'src/services/experiences/experiences.queries';

const studyStatus = [
  {
    id: '0001',
    name: '아티클',
  },
  {
    id: '0002',
    name: '영상',
  },
  {
    id: '0003',
    name: '첨부파일',
  },
];

const gradeStatus = [
  {
    id: '0001',
    name: '1학년',
  },
  {
    id: '0002',
    name: '2학년',
  },
  {
    id: '0003',
    name: '3학년',
  },
  {
    id: '0004',
    name: '4학년',
  },
  {
    id: '0005',
    name: '취업준비생',
  },
  {
    id: '0006',
    name: '상관없음',
  },
];

const options = ['삭제하기'];
// const options = ['삭제하기', '퀴즈 비공개'];

export type ArticleLikeUser = {
  userId: string;
  name: string;
  profileImageUrl: string;
};

const cx = classNames.bind(styles);

export function QuizMakeTemplate() {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password must be at least 4 characters')
      .max(8, 'Password must not exceed 8 characters'),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // const { contentTypes, setContentTypes } = useStore();

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [jobGroup, setJobGroup] = useState([]);
  const [active, setActive] = useState('0001');
  const [activeQuiz, setActiveQuiz] = useState('0001');
  const [contentType, setContentType] = useState('0001');
  const [jobGroups, setJobGroups] = useState<any[]>([]);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [quizPage, setQuizPage] = useState(1);
  const [totalQuizPage, setTotalQuizPage] = useState(1);
  const [params, setParams] = useState<any>({ page, quizSortType: '0001' });
  const [quizParams, setQuizParams] = useState<any>({ quizPage, sortType: 'DESC' });
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [quizUrl, setQuizUrl] = React.useState('');
  const [quizName, setQuizName] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<any[]>([]);
  const [selected, setSelected] = useState([]);
  const open = Boolean(anchorEl);
  const [keyWorld, setKeyWorld] = useState('');
  const [removeIndex, setRemoveIndex] = React.useState('');

  const [expanded, setExpanded] = useState(0); // 현재 확장된 Accordion의 인덱스
  const [selectedButton, setSelectedButton] = React.useState(null);

  const [selected1, setSelected1] = useState([]);
  const [selected2, setSelected2] = useState([]);
  const [selected3, setSelected3] = useState([]);
  const [quizCount, setQuizCount] = useState('');
  const [aiQuiz, setAiQuiz] = useState(false);
  const [quizSortType, setQuizSortType] = useState('0001');
  const [sortType, setSortType] = useState('DESC');

  const [universityCode, setUniversityCode] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [selectedJobName, setSelectedJobName] = useState('');
  const [selectedJob, setSelectedJob] = useState('');

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [jobLevel, setJobLevel] = useState([]);
  const [contentUrl, setContentUrl] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [sortQuizType, setSortQuizType] = useState('ASC');
  const [question, setQuestion] = useState('');
  const [modelAnswerFinal, setModelAnswerFinal] = useState('');
  const [quizList, setQuizList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    console.log(quizList);
  }, [quizList]);

  const handleChangeQuiz = event => {
    setQuizSortType(event.target.value);
  };
  const handleChangeSortType = event => {
    setSortType(event.target.value);
  };

  // api call
  const { data: myQuizData, refetch: refetchMyQuiz }: UseQueryResult<any> = useMyQuiz(params, data => {
    setContents(data.content);
    setTotalPage(data.totalPages);
  });

  const { data: myQuizContentData, refetch: refetchMyQuizContent }: UseQueryResult<any> = useMyQuizContents(
    quizParams,
    data => {
      console.log(data.contents);
      setTotalPage(data.totalPages);
    },
  );

  const { isFetched: isOptionFetched, data: optionsData }: UseQueryResult<any> = useOptions();

  //quiz delete
  const { mutate: onDeletePost, isSuccess: deletePostSuccess } = useDeletePost();
  const { mutate: onQuizSave, isSuccess: postSuccess } = useQuizSave();

  useDidMountEffect(() => {
    //console.log('delete 1 !!!', params, page);

    setContentTitle('');
    setContentUrl('');
    setSelectedSubject('');
    setSelectedChapter('');
    setSelected1([]);
    setSelected2([]);
    setSelectedUniversity('');
    setSelectedJob('');
    setJobLevel([]);
    setQuizList([]);

    refetchMyQuiz();
    refetchMyQuizContent();
  }, [deletePostSuccess, postSuccess]);

  // const { isFetched: isContentTypeFetched } = useContentTypes(data => {
  //   setContentTypes(data.data.contents || []);
  //   const contentsType = data.length >= 0 && data[0].id;
  //   // setParams({
  //   //   ...params,
  //   //   contentsType,
  //   // });
  // });

  // const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
  //   setContentJobType(data.data.contents || []);
  // });

  const handleAddClick = () => {
    // onGetJobsData && onGetJobsData();
    // getJobsList();
    //console.log('modal ');
    setQuizUrl('');
    setQuizName('');
    setJobGroup([]);
    setJobs([]);
    setRecommendLevels([]);
    setExperienceIds([]);
    setSelected([]);

    setIsModalOpen(true);
    // setChapterNo(chapterNo);
  };

  useEffect(() => {
    setParams({
      page,
      keyword: keyWorld,
      quizSortType: quizSortType,
    });
  }, [page, keyWorld, quizSortType]);

  useEffect(() => {
    setQuizParams({
      page: quizPage,
      keyword: keyWorld,
      sortType: sortType,
    });
  }, [quizPage, keyWorld, sortType]);

  useEffect(() => {
    setExpanded(0);
  }, [isModalOpen]);

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  const handleMenuItemClick = (index: number) => {
    console.log(index, removeIndex);
    // if (index === 0) {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      onDeletePost({
        postNo: index,
      });
    }
    // }
  };

  // const handleAiQuizClick = () => {
  //   console.log('ai quiz click');
  //   // Validation check
  //   if (!question || !modelAnswerFinal || !selected3) {
  //     alert('퀴즈 질문, 모델 답변, 모델 키워드를 입력해주세요.');
  //     return;
  //   }

  //   const params = {
  //     question: question,
  //     modelAnswerFinal: modelAnswerFinal,
  //     modelAnswerKeywords: selected3,
  //   };

  //   // Add to quiz list
  //   setQuizList(prevQuizList => [...prevQuizList, params]);

  //   // Reset fields
  //   setQuestion('');
  //   setModelAnswerFinal('');
  //   setSelected3([]);
  // };

  const handleAiQuizClick = () => {
    if (editingIndex !== null) {
      const updatedQuizzes = quizList.map((quiz, index) =>
        index === editingIndex ? { question, modelAnswer: modelAnswerFinal, modelAnswerKeywords: selected3 } : quiz,
      );
      setQuizList(updatedQuizzes);
      setEditingIndex(null);
    } else {
      const newQuiz = { question, modelAnswer: modelAnswerFinal, modelAnswerKeywords: selected3 };
      setQuizList([...quizList, newQuiz]);
    }
    setQuestion('');
    setModelAnswerFinal('');
    setSelected3([]);
  };

  const handleEditQuiz = index => {
    const quizToEdit = quizList[index];
    setQuestion(quizToEdit.question);
    setModelAnswerFinal(quizToEdit.modelAnswer);
    setSelected3(quizToEdit.modelAnswerKeywords);
    setEditingIndex(index);
  };

  const handleQuizInsertClick = async () => {
    if (
      !contentTitle ||
      !contentUrl ||
      !selectedSubject ||
      !selectedChapter ||
      !selected1.length ||
      !selected2.length ||
      !selectedUniversity ||
      !selectedJob ||
      !jobLevel
    ) {
      alert('모든 필드를 입력해주세요.');
      return false;
    }

    if (!quizList.length) {
      alert('퀴즈를 추가해주세요.');
      return false;
    }

    const params = {
      content: {
        isNew: true,
        // contentType: contentType,
        description: contentTitle,
        url: contentUrl,
        studySubject: selectedSubject,
        studyChapter: selectedChapter,
        skills: selected1,
        jobGroups: [selectedUniversity],
        jobs: [selectedJob],
        jobLevels: [jobLevel],
        studyKeywords: selected2,
      },
      quizzes: quizList,
    };

    setIsModalOpen(false);
    onQuizSave(params);
  };

  const [activeTab, setActiveTab] = useState('퀴즈목록');
  const handleTabClick = tabName => {
    setActiveTab(tabName);
  };

  const handleUniversityChange = e => {
    const selectedCode = e.target.value;
    const selected = optionsData?.data?.jobs?.find(u => u.code === selectedCode);
    setUniversityCode(selectedCode);
    setSelectedUniversity(selectedCode);
    setSelectedUniversityName(selected ? selected.name : '');
    setJobs(selected ? selected.jobs : []);
    setSelectedJob(''); // Clear the selected job when university changes
  };

  const handleJobChange = e => {
    setSelectedJob(e.target.value);
    const selectedCode = e.target.value;
    const selected = jobs?.find(u => u.code === selectedCode);
    setSelectedJobName(selected ? selected.name : '');
  };

  const handleInputSubjectChange = event => {
    setSelectedSubject(event.target.value);
  };
  const handleContentTitleChange = event => {
    setContentTitle(event.target.value);
  };
  const handleContentUrlChange = event => {
    setContentUrl(event.target.value);
  };
  const handleInputChapterChange = event => {
    setSelectedChapter(event.target.value);
  };

  const handleChangeQuizType = event => {
    setSortQuizType(event.target.value);
  };
  const handleQuestionChange = event => {
    setQuestion(event.target.value);
  };
  const handleModelAnswerChange = event => {
    setModelAnswerFinal(event.target.value);
  };

  const handleDeleteQuiz = questionToDelete => {
    // Handle delete action
    const updatedQuizzes = quizList.filter(quiz => quiz.question !== questionToDelete);
    setQuizList(updatedQuizzes);
  };

  return (
    <>
      <div className={cx('seminar-container')}>
        <div className={cx('container')}>
          <div className="xl:tw-py-[60px] tw-pt-[50px]">
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={12} sm={2} className="tw-font-bold sm:tw-text-3xl tw-text-2xl tw-text-black">
                나의 퀴즈
              </Grid>
              <Grid item xs={12} sm={6} className="tw-font-semi tw-text-base tw-text-black">
                <div>나와 학습자들의 성장을 돕기위해 내가 만든 퀴즈 리스트예요!</div>
              </Grid>
              <Grid item xs={12} sm={4} justifyContent="flex-end" className="tw-flex">
                <button
                  type="button"
                  onClick={() => handleAddClick()}
                  className=" tw-text-[#e11837] tw-mr-3 tw-font-bold tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                  style={{ border: '1px solid', color: '#e11837', width: '150px' }}
                >
                  + 퀴즈 만들기
                </button>
                <button
                  type="button"
                  onClick={() => handleAddClick()}
                  style={{ border: '1px solid', color: 'black', width: '150px' }}
                  className="tw-text-black tw-bg-white tw-font-bold tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                >
                  + 지식컨텐츠 등록
                </button>
              </Grid>
            </Grid>
          </div>
          <Box sx={{ width: '100%', typography: 'body1', marginTop: '0px', marginBottom: '40px' }}>
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={6} sm={9} className="tw-font-bold tw-text-3xl tw-text-black">
                <div className="tw-flex tw-justify-start tw-items-start tw-gap-10">
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-h-11 tw-relative tw-gap-2.5">
                    <p
                      className={`tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-text-left tw-cursor-pointer ${
                        activeTab === '퀴즈목록' ? 'tw-font-bold tw-text-black' : 'tw-text-[#6a7380]'
                      } tw-hover:tw-font-bold tw-hover:tw-text-black`}
                      onClick={() => handleTabClick('퀴즈목록')}
                    >
                      퀴즈목록
                    </p>
                  </div>
                  <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-h-11 tw-relative tw-gap-2.5">
                    <p
                      className={`tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-text-left tw-cursor-pointer ${
                        activeTab === '지식컨텐츠' ? 'tw-font-bold tw-text-black' : 'tw-text-[#6a7380]'
                      } tw-hover:tw-font-bold tw-hover:tw-text-black`}
                      onClick={() => handleTabClick('지식컨텐츠')}
                    >
                      지식컨텐츠
                    </p>
                  </div>
                  <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-h-11 tw-relative tw-gap-2.5">
                    <p
                      className={`tw-flex-grow-0 tw-flex-shrink-0 tw-text-lg tw-text-left tw-cursor-pointer ${
                        activeTab === '휴지통' ? 'tw-font-bold tw-text-black' : 'tw-text-[#6a7380]'
                      } tw-hover:tw-font-bold tw-hover:tw-text-black`}
                      onClick={() => handleTabClick('휴지통')}
                    >
                      휴지통
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} sm={3} className="tw-font-semi tw-text-base tw-text-black">
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  InputProps={{
                    style: { height: '43px' },
                    startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                  }}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      searchKeyworld((e.target as HTMLInputElement).value);
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* 퀴즈목록에 해당하는 div */}
          {activeTab === '퀴즈목록' && (
            <div>
              <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6 tw-mb-8">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                    정렬 :
                  </p>

                  <RadioGroup value={quizSortType} onChange={handleChangeQuiz} row>
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
                          오래된순
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
                          학년순
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
                          많이 복사된 순
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
                          답변순
                        </p>
                      }
                    />
                  </RadioGroup>
                </div>
              </div>
              <KnowledgeComponent contents={myQuizData?.contents} />

              <div className="tw-mt-10">
                <Pagination page={page} setPage={setPage} total={totalPage} />
              </div>
            </div>
          )}

          {/* 퀴즈목록에 해당하는 div */}
          {activeTab === '휴지통' && (
            <div className={cx('container, tw-h-[50vh] tw-text-center')}>데이터가 없습니다.</div>
          )}

          {/* 휴지통에 해당하는 div */}
          {activeTab === '지식컨텐츠' && (
            <div>
              <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6 tw-mb-8">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                    정렬 :
                  </p>

                  <RadioGroup value={sortType} onChange={handleChangeSortType} row>
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
                          최신순
                        </p>
                      }
                    />
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
                          오래된순
                        </p>
                      }
                    />
                  </RadioGroup>
                </div>
              </div>

              <ArticleList myQuizData={myQuizContentData} />

              <div className="tw-mt-10">
                <Pagination page={quizPage} setPage={setQuizPage} total={totalQuizPage} />
              </div>
            </div>
          )}
        </div>
        <MentorsModal title={'퀴즈 직접 등록하기'} isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
          <div>
            <Accordion
              disableGutters
              sx={{ backgroundColor: '#e9ecf2' }}
              defaultExpanded
              // expanded={expanded === 0}
              // onChange={handleChange(0)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="tw-text-lg tw-font-bold">지식컨텐츠 정보 입력</div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                <div className="tw-text-sm tw-font-bold tw-py-2">지식컨텐츠 유형</div>
                <div className={cx('mentoring-button__group', 'tw-px-0', 'tw-justify-center', 'tw-items-center')}>
                  {studyStatus.map((item, i) => (
                    <Toggle
                      key={item.id}
                      label={item.name}
                      name={item.name}
                      value={item.id}
                      variant="small"
                      checked={active === item.id}
                      isActive
                      type="tabButton"
                      onChange={() => {
                        setActive(item.id);
                        setContentType(item.id);
                        // setParams({
                        //   ...params,
                        //   viewFilter: item.id,
                        //   page,
                        // });
                        // setPage(1);
                      }}
                      className={cx('tw-mr-2 !tw-w-[90px]')}
                    />
                  ))}
                </div>

                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 URL</div>
                <TextField
                  required
                  value={contentUrl}
                  onChange={handleContentUrlChange}
                  id="username"
                  name="username"
                  variant="outlined"
                  type="search"
                  size="small"
                  fullWidth
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                  }}
                />
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 제목</div>
                <TextField
                  required
                  id="username"
                  value={contentTitle}
                  onChange={handleContentTitleChange}
                  name="username"
                  variant="outlined"
                  type="search"
                  size="small"
                  fullWidth
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                  }}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              disableGutters
              defaultExpanded
              sx={{ backgroundColor: '#e9ecf2' }}
              // expanded={expanded === 1}
              // onChange={handleChange(1)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="tw-text-lg tw-font-bold">지식컨텐츠 태깅</div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                <div className="tw-text-sm tw-font-bold tw-py-2">추천 대학</div>
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
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">추천 학과</div>
                <select
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
                </select>

                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">추천 학년</div>
                {optionsData?.data?.jobLevels?.map((item, i) => (
                  <Toggle
                    key={item.code}
                    label={item.name}
                    name={item.name}
                    value={item.code}
                    variant="small"
                    checked={activeQuiz === item.code}
                    isActive
                    type="tabButton"
                    onChange={() => {
                      setActiveQuiz(item.code);
                      console.log(item);
                      setJobLevel(item.code);
                      // setParams({
                      //   ...params,
                      //   viewFilter: item.id,
                      //   page,
                      // });
                      // setPage(1);
                    }}
                    className={cx('tw-mr-2 !tw-w-[90px]')}
                  />
                ))}
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">학습 주제</div>
                <TextField
                  required
                  id="username"
                  name="username"
                  variant="outlined"
                  type="search"
                  value={selectedSubject}
                  size="small"
                  onChange={handleInputSubjectChange}
                  fullWidth
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                  }}
                />
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">학습 챕터</div>
                <TextField
                  required
                  id="username"
                  name="username"
                  value={selectedChapter}
                  onChange={handleInputChapterChange}
                  variant="outlined"
                  type="search"
                  size="small"
                  fullWidth
                  sx={{
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                  }}
                />
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">학습 키워드</div>
                <TagsInput
                  value={selected1}
                  onChange={setSelected1}
                  name="fruits"
                  placeHolder="학습 키워드 입력 후 엔터를 쳐주세요."
                />
                <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">스킬</div>
                <TagsInput
                  value={selected2}
                  onChange={setSelected2}
                  name="fruits"
                  placeHolder="스킬 입력 후 엔터를 쳐주세요."
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              defaultExpanded
              disableGutters
              sx={{ backgroundColor: '#e9ecf2' }}
              // expanded={expanded === 2}
              // onChange={handleChange(2)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="tw-text-lg tw-font-bold">퀴즈 정보 입력</div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6">
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
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
                            수동생성
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
                            AI자동생성
                          </p>
                        }
                      />
                    </RadioGroup>
                  </div>
                </div>

                {sortQuizType === 'ASC' && (
                  <>
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">퀴즈</div>
                    <TextField
                      required
                      id="username"
                      name="username"
                      variant="outlined"
                      type="search"
                      value={question}
                      size="small"
                      onChange={handleQuestionChange}
                      fullWidth
                      sx={{
                        '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                      }}
                    />
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">모범답안</div>
                    <TextField
                      required
                      id="username"
                      name="username"
                      value={modelAnswerFinal}
                      onChange={handleModelAnswerChange}
                      variant="outlined"
                      type="search"
                      size="small"
                      fullWidth
                      sx={{
                        '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                      }}
                    />
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-2">주요 키워드/문구</div>
                    <TagsInput
                      value={selected3}
                      onChange={setSelected3}
                      name="fruits"
                      placeHolder="주요 키워드/문구 입력 후 엔터를 쳐주세요."
                    />
                    <div className="tw-text-right tw-mt-5">
                      <button
                        onClick={handleAiQuizClick}
                        className="tw-px-5 tw-py-3 tw-text-sm tw-bg-red-500 tw-rounded tw-text-white"
                      >
                        퀴즈 생성하기
                      </button>
                    </div>
                    {quizList.map((quiz, index) => (
                      <div key={index} className="border tw-rounded-lg tw-my-5">
                        <div className="border-bottom tw-bg-gray-100 tw-px-5 tw-py-3">
                          <div className="tw-flex tw-justify-between tw-items-center">
                            <div className="tw-flex-none tw-w-14 tw-items-center">
                              <div className="tw-flex tw-flex-col tw-items-center">
                                <img
                                  className="tw-w-12 border tw-rounded-full"
                                  src="/assets/images/quiz/ellipse_201.png"
                                  alt={`Quiz ${index}`}
                                />
                                <p className="tw-pt-1 tw-text-sm tw-text-center tw-text-black">퀴즈 {index + 1}</p>
                              </div>
                            </div>
                            <div className="tw-flex-auto tw-w-64 tw-px-5">{quiz.question}</div>
                            <div className="tw-flex-auto tw-w-32 tw-flex tw-justify-end">
                              <button
                                onClick={() => handleEditQuiz(index)}
                                className="tw-mr-3 tw-px-4 tw-py-2 tw-text-sm tw-bg-gray-300 tw-rounded-md hover:tw-bg-gray-400"
                              >
                                수정하기
                              </button>
                              <button
                                onClick={() => handleDeleteQuiz(quiz.question)}
                                className="tw-px-4 tw-py-2 tw-text-sm tw-bg-gray-300 tw-rounded-md hover:tw-bg-gray-400"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="tw-flex tw-justify-start tw-items-center tw-p-5">
                          <div className="tw-flex-none tw-w-14 tw-items-center">
                            <div className="tw-flex tw-flex-col tw-items-center">
                              <svg
                                width={24}
                                height={25}
                                viewBox="0 0 24 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 relative"
                                preserveAspectRatio="none"
                              >
                                <path
                                  d="M6 6.3252V12.3252C6 13.1208 6.31607 13.8839 6.87868 14.4465C7.44129 15.0091 8.20435 15.3252 9 15.3252H19M19 15.3252L15 11.3252M19 15.3252L15 19.3252"
                                  stroke="#CED4DE"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="tw-flex-none tw-w-14 tw-items-center">
                            <div className="tw-flex tw-flex-col tw-items-center">
                              <img
                                className="tw-w-10 border tw-rounded-full"
                                src="/assets/images/quiz/ellipse_202.png"
                              />
                              <p className="tw-pt-1 tw-text-sm tw-text-center tw-text-black">모범답안</p>
                            </div>
                          </div>
                          <div className="tw-flex-col tw-items-center">
                            <div className="tw-flex-auto tw-w-82 tw-px-5">{quiz.question}</div>
                            <div className="tw-flex tw-p-5 tw-pb-0 tw-text-sm tw-font-bold tw-gap-2">
                              채점기준 주요 키워드/문구 :
                              {quiz.modelAnswerKeywords?.map((tag, tagIndex) => (
                                <div
                                  key={tagIndex}
                                  className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-gray-400"
                                >
                                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-white">
                                    {tag}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* <p className="">{quiz.modelAnswer}</p>
                        <p>{quiz.modelKeyword}</p> */}
                      </div>
                    ))}
                  </>
                )}

                {sortQuizType === 'DESC' && (
                  <>
                    <div className="tw-text-sm tw-font-bold tw-mt-4">생성할 퀴즈 개수</div>
                    <div className="tw-grid tw-grid-cols-2 tw-items-center">
                      <div className="tw-col-span-4">
                        {' '}
                        {/* Added col-span-4 */}
                        <TextField
                          required
                          id="username"
                          name="username"
                          label="생성할 퀴즈 개수를 입력해주세요."
                          variant="outlined"
                          type="search"
                          size="small"
                          fullWidth
                          sx={{
                            '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                          }}
                          margin="dense"
                        />
                      </div>
                      <div className="tw-pl-4">
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked
                              sx={{
                                color: '#ced4de',
                                '&.Mui-checked': { color: '#e11837' },
                              }}
                            />
                          }
                          label={<p className="tw-text-sm tw-font-bold tw-text-left tw-text-[#31343d]">AI퀴즈</p>}
                        />
                        <button className="tw-px-4 tw-py-3 tw-text-sm tw-bg-gray-300 tw-rounded-md hover:tw-bg-gray-400">
                          퀴즈 생성하기
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </AccordionDetails>
            </Accordion>

            <div className="tw-py-5 tw-text-center">
              {/* <button
                onClick={handlePreviousAccordion}
                className="tw-text-sm tw-px-10 tw-py-2 tw-text-base tw-bg-gray-300 tw-rounded-md hover:tw-bg-gray-400"
                style={{ marginRight: 'auto' }} // 왼쪽 정렬
              >
                이전
              </button> */}
              {/* <button
                onClick={handleNextAccordion}
                className="tw-px-10 tw-py-2 tw-text-base tw-bg-gray-300 tw-rounded-md hover:tw-bg-gray-400"
                style={{ marginLeft: 'auto' }} // 오른쪽 정렬
              >
                {expanded === 2 ? '완료' : '다음'}
              </button> */}

              <button
                onClick={handleQuizInsertClick}
                className="tw-text-white tw-text-sm tw-px-10 tw-py-3 tw-text-base tw-bg-red-500 tw-rounded-md hover:tw-bg-gray-400"
                style={{ marginLeft: 'auto' }} // 오른쪽 정렬
              >
                지식컨텐츠 저장
              </button>
            </div>
          </div>
        </MentorsModal>
      </div>
    </>
  );
}

export default QuizMakeTemplate;
