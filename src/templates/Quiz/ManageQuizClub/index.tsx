import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import Divider from '@mui/material/Divider';
import {
  paramProps,
  useMyClubList,
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

import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';

export interface ManageQuizClubTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function ManageQuizClubTemplate({ id }: ManageQuizClubTemplateProps) {
  const { mutate: onCrewBan, isSuccess: isBanSuccess } = useCrewBanDelete();
  const { mutate: onCrewAccept, isSuccess: isAcceptSuccess } = useCrewAcceptPost();
  const { mutate: onCrewReject, isSuccess: isRejectSuccess } = useCrewRejectPost();

  console.log('clubsequence : ', id);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageMember, setPageMember] = useState(1);
  const [totalPageMember, setTotalPageMember] = useState(1);
  const [totalElementsMember, setTotalElementsMember] = useState(0);
  const [myClubList, setMyClubList] = useState<any>([]);
  const [myMemberList, setMyMemberList] = useState<any>([]);
  const [myMemberRequestList, setMyMemberRequestList] = useState<any>([]);
  const [myClubParams, setMyClubParams] = useState<any>({ clubSequence: id, page });
  const [myClubMemberParams, setMyClubMemberParams] = useState<any>({ clubSequence: id, page });
  const [active, setActive] = useState(0);
  const [params, setParams] = useState<paramProps>({ page });
  const [quizList, setQuizList] = useState<any>([]);
  const [keyWorld, setKeyWorld] = useState('');
  const [selectedValue, setSelectedValue] = useState(id);
  const [activeTab, setActiveTab] = useState('myQuiz');

  const [pageQuiz, setPageQuiz] = useState(1);
  const [totalQuizPage, setTotalQuizPage] = useState(1);
  const [totalQuizElements, setTotalQuizElements] = useState(0);
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

  const handleInputQuizSearchChange = event => {
    setQuizSearch(event.target.value);
  };

  //new logic
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const handleCheckboxChange = quizSequence => {
    // Filter out items with quizSequence as null and count them
    const nullQuizSequenceCount = quizList.filter(item => item.quizSequence === null).length;

    if (!selectedQuizIds?.includes(quizSequence) && nullQuizSequenceCount <= 0) {
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
                contentDescription: newQuiz.contentDescription,
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

  const handleChangeQuizType = event => {
    setSortQuizType(event.target.value);
  };

  //퀴즈 리스트
  const { isFetched: isQuizData, refetch } = useQuizList(params, data => {
    console.log(data);
    setQuizListData(data.contents || []);
    setTotalQuizzPage(data.totalPages);
    setTotalQuizzElements(data.totalElements);

    console.log(data.totalPages);
    console.log(data.totalElements);
  });

  // 퀴즈클럽 리스트
  const { isFetched: isContentFetched, refetch: refetchMyClub } = useMyClubList({}, data => {
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

  console.log(myClubMemberParams);
  // 내 회원 목록 조회
  const { isFetched: isMemberFetched, refetch: refetchMyMember } = useMyMemberList(myClubMemberParams, data => {
    console.log('isMemberFetched', data);
    setTotalPageMember(data?.totalPages);
    setTotalElementsMember(data?.totalElements);
    setMyMemberList(data?.contents || []);
  });

  // 퀴즈클럽 정보 조회
  const { isFetched: isParticipantListFetched } = useQuizMyClubInfo(myQuizParams, data => {
    console.log('first get data');
    setQuizList(data?.contents || []);
    setSelectedQuizIds(data?.contents.map(item => item?.quizSequence));
    console.log(data?.contents.map(item => item?.quizSequence));
    setTotalQuizPage(data?.totalPages);
    setTotalQuizElements(data?.totalElements);
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
  const [sortQuizType, setSortQuizType] = useState('ASC');

  useDidMountEffect(() => {
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
  }, [sortType, selectedClub]);

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
    console.log(selectedSession);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const handlePageChangeMember = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageMember(value);
  };
  const handlePageChangeQuiz = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageQuiz(value);
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

  const dragList = (item: any, index: any) => (
    <div
      key={item.key}
      className={`simple-drag-row ${item?.isPublished ? '' : 'drag-disabled'}`}
      style={{ cursor: item?.isPublished ? 'default' : 'move' }} // 조건부 스타일 적용
    >
      <QuizBreakerInfo
        publishDate={item?.publishDate}
        dayOfWeek={item?.dayOfWeek}
        avatarSrc={item?.maker?.profileImageUrl}
        userName={item?.maker?.nickname}
        questionText={item?.question}
        index={item?.quizSequence !== undefined ? item?.quizSequence : null}
        answerText={item?.modelAnswer}
        handleAddClick={handleAddClick}
        isPublished={item?.isPublished}
        isDeleteQuiz={false}
        handleCheckboxDelete={handleCheckboxDelete}
        knowledgeContentTitle={item?.contentDescription}
      />
    </div>
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleAddClick = () => {
    // console.log('quizList.length', quizList.length);
    // if (quizList.length > 1) setIsModalOpen(true);
    // else alert('퀴즈 생성 주기를 입력해주세요.');
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
      isPublished: scheduleMap[index].isPublished,
      modelAnswer: scheduleMap[index].modelAnswer,
      quizUri: scheduleMap[index].quizUri,
      contentDescription: scheduleMap[index].contentDescription,
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
              <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-[31.5px] tw-gap-3.5">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
                  퀴즈클럽 관리하기
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

            <Grid item xs={0.9} justifyContent="flex-end" className="tw-flex">
              {/* {contents?.isBeforeOpening ? ( */}
              <div className="">
                <button
                  type="button"
                  onClick={() => router.push(`/manage-quiz-club/${id}`)}
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
              className={`tw-absolute tw-left-[52px] tw-top-3 tw-text-base tw-text-center ${
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
                      클럽 가입 신청 ({totalElements})
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
                    퀴즈 목록 ({totalQuizElements || 0})
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
                      <button type="button" onClick={handleAddClick} className="tw-text-black tw-text-sm ">
                        성장퀴즈 추가하기
                      </button>
                    </p>
                  </div>
                </div>

                <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6 tw-my-4">
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                      정렬 :
                    </p>

                    <RadioGroup value={sortQuizType} onChange={handleChangeQuizType} row>
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
                <Grid container direction="row" justifyContent="left" alignItems="start" rowSpacing={4}>
                  <Grid item xs={1}>
                    {quizList?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="tw-h-[223.25px] tw-flex tw-flex-col tw-items-center tw-justify-center tw-mb-4"
                        >
                          <div className=" tw-text-center tw-text-black tw-font-bold">Q{item?.order}.</div>
                          <div className="tw-text-center tw-text-sm tw-text-black tw-font-bold">
                            {item?.publishDate?.slice(5, 10)} {item?.dayOfWeek ? `(${item.dayOfWeek})` : ''}
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
