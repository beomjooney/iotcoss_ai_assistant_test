import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Typography, Chip, ClubCard, CommunityCard } from 'src/stories/components';
import React, { useEffect, useRef, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useSeminarList, paramProps, useSeminarImageList } from 'src/services/seminars/seminars.queries';
import QuizArticleCard from 'src/stories/components/QuizArticleCard';
import Carousel from 'nuka-carousel';
import { ArticleEnum } from '../../config/types';
import { useContentJobTypes, useContentTypes, useJobGroups } from 'src/services/code/code.queries';
import Banner from '../../stories/components/Banner';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/system/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import moment from 'moment';

import { useSessionStore } from 'src/store/session';
import { useDeleteLike, useSaveLike } from 'src/services/community/community.mutations';
import { useMemberInfo } from 'src/services/account/account.queries';
import { User } from 'src/models/user';
import { useStudyQuizBadgeList } from 'src/services/studyroom/studyroom.queries';
import { useMyQuiz, useMyQuizReply } from 'src/services/jobs/jobs.queries';
import { UseQueryResult } from 'react-query';
import QuizMyReply from 'src/stories/components/QuizMyReply';
import { deleteCookie } from 'cookies-next';
/**import Popup */
import ProfileModal from 'src/stories/components/ProfileModal';
import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useSkills } from 'src/services/skill/skill.queries';
import { SkillResponse } from 'src/models/skills';
import { useUploadImage } from 'src/services/image/image.mutations';
import { useSaveProfile } from 'src/services/account/account.mutations';

const cx = classNames.bind(styles);

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

export function ProfileTemplate() {
  const { jobGroups, contentTypes, setContentTypes } = useStore();
  const { logged } = useSessionStore.getState();
  const router = useRouter();
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [images, setSeminarImages] = useState<any[]>([]);
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  let [isLiked, setIsLiked] = useState(false);
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();
  const [keyWorld, setKeyWorld] = useState('');

  /**image */
  const { mutate: onSaveImage, data: imageUrl, isSuccess: imageSuccess } = useUploadImage();

  /**save profile */
  const { mutate: onSave, isSuccess: onSuccess } = useSaveProfile();

  /**file image  */
  const [file, setFile] = useState(null);
  const [fileImageUrl, setFileImageUrl] = useState(null);

  /** get profile */
  const { user, setUser } = useStore();
  const [userInfo, setUserInfo] = useState<User>(user);
  const { memberId } = useSessionStore.getState();
  const [customSkills, setCustomSkills] = useState([]);

  const recommendLevelsRef = useRef(null);
  const jobGroupRef = useRef(null);
  const endDateRef = useRef<any>([]);

  const [formFields, setFormFields] = useState([
    {
      sequence: '',
      jobName: '',
      companyName: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      isFreelance: false,
      isDelete: false,
    },
  ]);

  const { isFetched: isUserInfo, refetch } = useMemberInfo(memberId, user => {
    //console.log(user);
    const jsonArray = user.customSkills.map(item => ({ name: item }));
    //console.log(jsonArray);
    setCustomSkills(jsonArray);
    setSelectedSkills(user.customSkills);
    //console.log(user.level, user.jobGroup);
    setRecommendLevels(user?.level?.toString());
    setRecommendJobGroups(user.jobGroup || []);
    setNickName(user.nickname);
    setIntroductionMessage(user.introductionMessage);
    setFormFields(
      user.careers.length > 0
        ? user.careers
        : [
            {
              sequence: '',
              jobName: '',
              companyName: '',
              startDate: '',
              endDate: '',
              isCurrent: false,
              isFreelance: false,
              isDelete: false,
            },
          ],
    );
    setExperienceYears(user.experienceYears);
    setUserInfo(user);
  });

  useEffect(() => {
    refetch();
  }, [onSuccess]);

  /**logout */
  const handleLogout = async () => {
    deleteCookie('access_token');
    localStorage.removeItem('auth-store');
    localStorage.removeItem('app-storage');
    location.href = '/';
  };

  /** get badge */
  const [badgePage, setBadgePage] = useState(1);
  const [badgeParams, setBadgeParams] = useState<paramProps>({ page: badgePage, isAchieved: true });
  const [badgeContents, setBadgeContents] = useState<RecommendContent[]>([]);
  const { isFetched: isQuizbadgeFetched, refetch: QuizRefetchBadge } = useStudyQuizBadgeList(badgeParams, data => {
    setBadgeContents(data.data.contents);
  });

  /** my quiz */
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [myParams, setMyParams] = useState<paramProps>({ page });
  const { data: myQuizListData, refetch: refetchMyJob }: UseQueryResult<any> = useMyQuiz(myParams, data => {
    setTotalPage(data.totalPage);
  });

  /** my quiz replies */
  const [quizPage, setQuizPage] = useState(1);
  const [quizTotalPage, setQuizTotalPage] = useState(1);
  const [myQuizParams, setMyQuizParams] = useState<paramProps>({ page: quizPage });
  const { data: myQuizReplyData }: UseQueryResult<any> = useMyQuizReply(myQuizParams, data => {
    //console.log(data);
    setQuizTotalPage(data.totalPages);
  });

  /**work start end */
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDatealue] = React.useState<Dayjs | null>(null);

  /** job */
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  /**skill data */
  const [jobGroup, setJobGroup] = useState([]);
  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setJobGroup(data.data.contents || []);
  });
  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const fixedOptions = [];
  const [selectedSkills, setSelectedSkills] = useState([]);

  /**popup */
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [recommendJobGroups, setRecommendJobGroups] = useState([]);
  const [recommendLevels, setRecommendLevels] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);

  /** introduce message */
  const [introductionMessage, setIntroductionMessage] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setIntroductionMessage(value);
  };
  const onNickNameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setNickName(value);
  };
  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    setRecommendLevels(newFormats);
  };

  const handleJobGroups = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendJobGroups(newFormats);
  };

  const handleAddFields = () => {
    const values = [
      ...formFields,
      {
        sequence: '',
        jobName: '',
        companyName: '',
        startDate: today,
        endDate: today,
        isCurrent: false,
        isFreelance: false,
        isDelete: false,
      },
    ];
    setFormFields(values);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //console.log(formFields);
  };

  const handleSkillsChange = (event, newValue) => {
    // newValue 배열에서 각 객체의 name 속성을 추출하여 새로운 배열을 만듭니다.
    const selectedSkillNames = newValue.map(option => option.name);
    setSelectedSkills(selectedSkillNames);
    const jsonArray = selectedSkillNames.map(item => ({ name: item }));
    const json = { ...selectedSkillNames, jsonArray };
    setCustomSkills(json.jsonArray);
  };
  const handleJobChange = (index, event, newValue) => {
    handleInputChange(index, event, 'job', newValue.id);
  };

  const handleRemoveFields = (index: number) => {
    if (formFields.length === 1) {
      alert('At least one form must remain');
      return;
    }

    const values = [...formFields];
    values.splice(index, 1);
    setFormFields(values);
  };

  const [careersInfo, setCareersInfo] = useState([]);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>, key, id) => {
    const values = [...formFields];
    let datetime: string;

    switch (key) {
      case 'text':
        if (e.target.name === 'companyName') {
          values[index].companyName = e.target.value;
        }
        break;
      case 'startDate':
      case 'endDate':
        datetime = e.format('YYYY-MM-DD');
        values[index][key] = datetime;
        break;
      case 'isFreelance':
        values[index][key] = !values[index][key];
        // setIsFreelance(!isFreelance);
        break;
      case 'isCurrent':
        if (!values[index][key] === true) {
          values[index]['endDate'] = null;
        }
        values[index][key] = !values[index][key];
        break;
      case 'job':
        values[index][key] = id;
        break;
      default:
        values[index][key] = !values[index][key];
        // setIsCurrent(!isCurrent);
        break;
    }

    setCareersInfo(values);
    setFormFields(values);
  };

  const handleProfileSave = async () => {
    // fileImageUrl이 null인 경우 imageUrl을 사용하도록 조건문 추가
    const profileImageKey = imageUrl || user?.profileImageUrl;
    const isCurrentCount = formFields.filter(data => data.isCurrent === true).map((data, index) => {}).length;

    if (recommendJobGroups.length === 0) {
      alert('직군 필수 입력값을 선택해주세요.');
      jobGroupRef.current.focus();
      return 0;
    }

    if (recommendLevels === '') {
      alert('레벨 필수 입력값을 선택해주세요.');
      recommendLevelsRef.current.focus();
      return 0;
    }

    if (isCurrentCount > 1) {
      alert('재직 경력은 1개만 선택해주세요.');
      return 0;
    }

    const params = {
      nickname: nickName,
      careers: formFields[0].companyName ? formFields : [],
      jobGroupType: recommendJobGroups,
      level: recommendLevels,
      customSkills: selectedSkills,
      introductionMessage: introductionMessage,
      profileImageUrl: profileImageKey,
    };

    onSave(params);
    setIsModalOpen(false);
  };

  const dateNow = new Date();
  const today = dateNow.toISOString().slice(0, 10);

  const initStartDate = formFields?.reduce((curr, prev) => {
    return prev.startDate;
  });

  const diffTimeCalc = (startDate, endDate) => {
    let diffStartDate = new Date(moment(startDate).format('YYYY-MM-DD'));
    let diffEndDate = new Date(moment(endDate).format('YYYY-MM-DD'));

    const diffTime = (Number(diffEndDate) - Number(diffStartDate)) / (1000 * 60 * 60 * 24 * 30 * 12);

    return Math.floor(diffTime);
  };

  const careerTimes = careersInfo?.map((data, index) => {
    const result = [];
    let careerTimeDiffView: number;
    let careerTimeDiff = diffTimeCalc(data.startDate, data.endDate);

    if (!isNaN(careerTimeDiff) && careerTimeDiff > 0 && careerTimeDiff != undefined) {
      careerTimeDiffView = careerTimeDiff;
    }

    return (result[index] = careerTimeDiffView);
  });

  // const totalCareerYear = careerTimes.reduce(function add(sum, currValue) {
  //   return sum + currValue;
  // }, 0);

  const careersViewResult = formFields?.map((data, key) => {
    if (initStartDate) {
      if (data.isCurrent == true) {
        let diffTimeView: string;
        const lastEndDate = data.endDate;
        let diffTime = diffTimeCalc(initStartDate, lastEndDate);

        if (!isNaN(diffTime) && diffTime > 0 && diffTime != undefined) {
          diffTimeView = `${diffTime}년차`;
        }

        return (
          <div key={data.sequence}>
            {data.companyName} | {data.jobName} | {experienceYears}년차
          </div>
        );
      }
    }
  });

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const image = e.target.result;
      setFileImageUrl(image);
    };
    reader.readAsDataURL(file);
    onSaveImage(file);
  }, [file]);

  const onFileChange = files => {
    if (!files || files.length === 0) return;
    setFile(files[0]);
  };

  useEffect(() => {
    setMyParams({
      page,
    });
  }, [page]);

  useEffect(() => {
    setMyQuizParams({
      quizPage,
    });
  }, [quizPage]);

  useEffect(() => {
    setCareersInfo(formFields);
  }, [formFields]);

  return (
    <div className={cx('seminarseminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-[60px]">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black max-lg:!tw-text-base">
              프로필
            </Grid>
            <Grid item xs={7} className="max-lg:tw-p-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-sm">
              나의 프로필을 완성하고 다양한 크루들과 교류해보세요.
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex"></Grid>
          </Grid>
        </div>
      </div>
      {isUserInfo && (
        <div className={cx('content-wrap')}>
          <div className="tw-bg-gray-100">
            <div className={cx('container')}>
              <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-py-10 tw-font-bold tw-text-black">
                <div className="tw-col-span-2">
                  <img className="tw-w-32 tw-h-32 tw-ring-1 tw-rounded-full" src={userInfo?.profileImageUrl} alt="" />
                </div>
                <div className="tw-col-span-10 tw-text-left  tw-flex tw-flex-col  tw-justify-start">
                  <div className=" tw-text-black">
                    <div className="tw-font-bold tw-text-xl tw-grid tw-items-center tw-grid-cols-6">
                      <div className="tw-col-span-4">
                        {userInfo?.nickname} 님
                        <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600">
                          {userInfo?.jobGroupName}
                        </span>
                        <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
                          {userInfo?.level} 레벨
                        </span>
                        {userInfo?.jobName && (
                          <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-300 tw-text-sm tw-font-light tw-text-gray-600">
                            {userInfo.jobName}
                          </span>
                        )}
                      </div>
                      <div className="tw-col-span-2 tw-text-right">
                        <span className="tw-inline-flex tw-item-right">
                          <div className="tw-flex tw-justify-between tw-mt-2 tw-gap-2">
                            <Button
                              className="tw-w-full tw-bg-white "
                              variant="outlined"
                              sx={{
                                borderColor: 'gray',
                                color: 'gray',
                              }}
                              onClick={() => setIsModalOpen(true)}
                            >
                              수정하기
                            </Button>
                            <Button
                              className="tw-w-full tw-bg-white"
                              variant="outlined"
                              onClick={handleLogout}
                              sx={{
                                borderColor: 'gray',
                                color: 'gray',
                              }}
                            >
                              로그아웃
                            </Button>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="tw-font-bold tw-text-base tw-text-black tw-mt-5">
                    {careersViewResult ?? careersViewResult}
                    {/* {userInfo?.careers?.[userInfo?.careers?.length - 1]?.companyName} |
                    {userInfo?.careers?.[userInfo?.careers?.length - 1]?.jobName} */}
                  </div>
                  <div className="tw-py-2">
                    {userInfo?.customSkills?.map((name, i) => (
                      <span
                        key={i}
                        className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-bg-black tw-text-white"
                      >
                        {name}
                      </span>
                    ))}
                    {/* {userInfo?.customExperiences?.map((name, i) => (
                      <span
                        key={i}
                        className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-gray-700"
                      >
                        {name}
                      </span>
                    ))} */}
                  </div>

                  <div className="tw-mt-3 tw-font-light tw-text-base tw-text-gray-500">
                    {userInfo?.introductionMessage}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('container')}>
            <div className="tw-py-10 tw-text-xl tw-text-black tw-font-bold">
              나의 보유포인트 : {userInfo?.points?.toLocaleString()} point
            </div>
          </div>
        </div>
      )}
      <div className={cx('container')}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <div className="tw-flex tw-gap-5">
            <Toggle
              label="보유배지"
              name="보유배지"
              value=""
              variant="small"
              checked={active === 0}
              isActive
              type="tabButton"
              onChange={() => {
                setActive(0);
              }}
              className={cx('fixed-width')}
            />
            <Toggle
              label="만든퀴즈"
              name="만든퀴즈"
              value=""
              variant="small"
              checked={active === 1}
              isActive
              type="tabButton"
              onChange={() => {
                setActive(1);
                setMyParams({
                  page,
                });
                setPage(1);
              }}
              className={cx('fixed-width')}
            />
            <Toggle
              label="작성글"
              name="작성글"
              value=""
              variant="small"
              checked={active === 2}
              isActive
              type="tabButton"
              onChange={() => {
                setActive(2);
                setMyQuizParams({
                  quizPage,
                });
                setQuizPage(1);
              }}
              className={cx('fixed-width')}
            />
          </div>
        </Box>
        <Divider className="tw-my-10 tw-border tw-bg-['#efefef']" />
        {active == 0 && (
          <div>
            <div className="tw-grid tw-grid-cols-8 tw-gap-4">
              {badgeContents.map((item, index) => (
                <div key={index} className="tw-text-center">
                  <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
                    <img
                      className="tw-object-cover tw-h-[80px] "
                      src={`${process.env.NEXT_PUBLIC_GENERAL_URL}/assets/images/badge/${item?.badgeId}.png`}
                      alt=""
                    />
                  </div>
                  <div className="tw-text-sm tw-text-black tw-font-bold">{item?.name}</div>
                  <div className="tw-text-sm tw-text-black tw-line-clamp-1">{item?.description}</div>
                  <div className="tw-text-sm tw-text-black">{item?.achievementAt?.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {active == 1 && (
          <div>
            {myQuizListData?.contents.map((item, index) => (
              <div key={`admin-quiz-${index}`} className="tw-flex tw-pb-5">
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
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        )}
        {active == 2 && (
          <div>
            {myQuizReplyData?.contents?.map((item, index) => {
              return (
                <QuizMyReply
                  key={index}
                  board={item}
                  // writer={memberSample}
                  className={cx('reply-container__item')}
                  // memberId={memberId}
                  // onPostDeleteSubmit={onPostDeleteSubmit}
                />
              );
            })}
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        )}
        <article>
          <div className={cx('content-area')}>
            <section className={cx('content', 'flex-wrap-container')}>
              <Grid
                container
                direction="row"
                justifyContent="left"
                alignItems="center"
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              ></Grid>
              {/* {isContentFetched &&
                (contents.length > 0 ? (
                  contents.map((item, i) => {
                    return (
                      <ArticleCard
                        uiType={ArticleEnum.MENTOR_SEMINAR}
                        content={item}
                        key={i}
                        className={cx('container__item')}
                      />
                    );
                  })
                ) : (
                  <div className={cx('content--empty')}>데이터가 없습니다.</div>
                ))} */}
            </section>
          </div>
        </article>
        {isUserInfo && (
          <ProfileModal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
            <div className="tw-font-bold tw-text-xl tw-text-black tw-mt-0 tw-mb-5 tw-text-center">
              {user?.name || user?.nickname}님 데브어스에 오신 것을 환영합니다!
            </div>
            <div className="tw-font-semibold tw-text-base tw-text-black tw-mt-0  tw-text-center">
              직군 및 레벨을 설정하시면 님께
            </div>
            <div className="tw-font-semibold tw-text-base  tw-text-black tw-mt-0 tw-mb-10 tw-text-center">
              꼭 맞는 커멘 서비스를 추천받으실 수 있습니다!
            </div>

            <div className="border tw-p-7 tw-rounded-xl">
              <div className="tw-font-bold tw-text-base tw-text-black">개인정보</div>

              <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
                <img
                  className="tw-w-32 tw-h-32 tw-ring-1 tw-rounded-full"
                  src={fileImageUrl ?? userInfo?.profileImageUrl}
                  alt=""
                />
              </div>
              <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
                <button color="primary" className="tw-bg-blue-500 tw-px-5 tw-py-2 tw-rounded-md">
                  <label htmlFor={`input-file`} className="tw-text-white tw-text-sm">
                    사진 변경
                  </label>
                  <input
                    hidden
                    id={`input-file`}
                    accept="image/*"
                    type="file"
                    onChange={e => onFileChange(e.target?.files)}
                  />
                </button>
              </div>
              <div className="tw-mt-2 tw-border-t tw-border-gray-100">
                <dl className="tw-divide-y tw-divide-gray-100">
                  <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0  tw-flex tw-justify-center tw-items-center">
                    <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">이메일</dt>
                    <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                      {user?.email}
                    </dd>
                  </div>
                  <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0  tw-flex tw-justify-center tw-items-center">
                    <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">이름</dt>
                    <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                      {user?.name}
                    </dd>
                  </div>
                  <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0  tw-flex tw-justify-center tw-items-center">
                    <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">닉네임</dt>
                    <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                      <TextField
                        size="small"
                        fullWidth
                        id="outlined-basic"
                        label=""
                        name="companyName"
                        variant="outlined"
                        onChange={onNickNameChange}
                        value={nickName}
                      />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="border tw-p-7 tw-rounded-xl tw-mt-5">
              <div className="tw-font-bold tw-text-base tw-text-black">필수 | 직군 및 레벨</div>

              <dl className="tw-divide-y tw-divide-gray-100 tw-py-5">
                <div className="tw-px-4 tw-pt-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                  <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">(*) 직군선택</dt>
                  <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">
                    <ToggleButtonGroup
                      value={recommendJobGroups}
                      exclusive
                      onChange={handleJobGroups}
                      aria-label="text alignment"
                    >
                      {jobGroup?.map((item, index) => (
                        <ToggleButton
                          ref={jobGroupRef} // ref를 할당합니다.
                          key={`job-${index}`}
                          value={item.id}
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
                          {item.name}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </dd>
                </div>

                <div className="tw-px-4 tw-pt-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                  <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">(*) 레벨선택</dt>
                  <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">
                    <ToggleButtonGroup
                      value={recommendLevels}
                      exclusive
                      onChange={handleRecommendLevels}
                      aria-label="text alignment"
                    >
                      {levelGroup?.map((item, index) => (
                        <ToggleButton
                          ref={recommendLevelsRef} // ref를 할당합니다.
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
                  </dd>
                </div>
                <div className="tw-px-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0">
                  <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900"></dt>
                  <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                    {recommendLevels?.toString() === '0' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        0레벨 : 직무스킬(개발언어/프레임워크 등) 학습 중. 상용서비스 개발 경험 없음.
                      </div>
                    )}
                    {recommendLevels?.toString() === '1' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        1레벨 : 상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요.
                      </div>
                    )}
                    {recommendLevels?.toString() === '2' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        2레벨 : 상용 서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능.
                      </div>
                    )}
                    {recommendLevels?.toString() === '3' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        3레벨 : 상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능.
                      </div>
                    )}
                    {recommendLevels?.toString() === '4' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        4레벨 : 다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더.
                      </div>
                    )}
                    {recommendLevels?.toString() === '5' && (
                      <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                        5레벨 : 본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩.
                      </div>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="border tw-p-7 tw-rounded-xl tw-mt-5 ">
              <div className="tw-font-bold tw-text-base tw-text-black">선택 | 경력사항</div>
              <div className="tw-mt-2 tw-border-t tw-border-gray-100">
                <form onSubmit={handleSubmit} style={{ padding: '2%' }}>
                  {formFields.map((field, index) => (
                    <div key={index} style={{ marginBottom: 5 }} className="">
                      <dl className="tw-divide-y tw-divide-gray-100">
                        <div className="tw-px-4 tw-pt-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                          <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">회사명</dt>
                          <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-4 tw-mt-0">
                            <TextField
                              size="small"
                              id="outlined-basic"
                              label=""
                              name="companyName"
                              variant="outlined"
                              value={field.companyName}
                              onChange={e => handleInputChange(index, e, 'text')}
                              style={{ marginRight: 10 }}
                            />
                          </dd>
                          <dt className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-1 tw-flex tw-justify-end">
                            <button
                              className="tw-text-sm tw-bg-black tw-text-white tw-py-2 tw-px-4 tw-rounded"
                              type="button"
                              onClick={() => handleRemoveFields(index)}
                            >
                              삭제
                            </button>
                          </dt>
                        </div>
                        <div className="tw-px-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                          <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900"></dt>
                          <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">
                            <div className="tw-flex tw-items-center tw-gap-1">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.isFreelance}
                                    onChange={e => handleInputChange(index, e, 'isFreelance')}
                                    name="jason"
                                  />
                                }
                                label="프리랜서의 경우, 체크해주세요."
                              />
                            </div>
                          </dd>
                        </div>
                        <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                          <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">직무</dt>
                          <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                            <div className="tw-grid tw-grid-cols-2 tw-flex tw-justify-center tw-items-center">
                              <div className="tw-col-span-1 ">
                                <Autocomplete
                                  fullWidth
                                  limitTags={2}
                                  size="small"
                                  id="checkboxes-tags-demo"
                                  getOptionLabel={option => option.name || []}
                                  options={contentJobType || []}
                                  onChange={(e, v) => handleJobChange(index, e, v)}
                                  renderInput={params => (
                                    <TextField {...params} label="" placeholder="직무를 변경해주세요." />
                                  )}
                                />
                              </div>
                              {field.jobName && (
                                <div className="tw-col-span-1 tw-text-base tw-px-2 tw-font-bold tw-pl-5">
                                  현재직무 : {field.jobName}
                                </div>
                              )}
                            </div>
                          </dd>
                        </div>

                        <div className="tw-px-4 tw-pt-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                          <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">근무기간</dt>
                          <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                            <div className="tw-grid tw-grid-cols-3 tw-flex tw-justify-center tw-items-center tw-gap-1">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  format="YYYY-MM-DD"
                                  slotProps={{ textField: { size: 'small' } }}
                                  value={dayjs(field.startDate)}
                                  onChange={e => handleInputChange(index, e, 'startDate')}
                                />
                                <DatePicker
                                  disabled={field.isCurrent}
                                  format="YYYY-MM-DD"
                                  slotProps={{ textField: { size: 'small' } }}
                                  value={dayjs(field.endDate)}
                                  onChange={e => handleInputChange(index, e, 'endDate')}
                                  key={index}
                                  inputRef={element => {
                                    endDateRef.current[index] = element;
                                  }}
                                />
                              </LocalizationProvider>
                              {careerTimes[index] && <div className="tw-px-2">{careerTimes[index]}년차</div>}
                            </div>
                          </dd>
                        </div>
                        <div className="tw-px-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                          <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900"></dt>
                          <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">
                            <div className="tw-flex tw-items-center tw-gap-1">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.isCurrent}
                                    onChange={e => handleInputChange(index, e, 'isCurrent')}
                                    name="isCurrent"
                                  />
                                }
                                label="재직 중인 경우, 체크해 주세요."
                              />
                            </div>
                          </dd>
                        </div>
                        <div className="tw-flex tw-justify-center tw-items-center"></div>
                        <Divider className="tw-border tw-bg-['#efefef']" />
                      </dl>
                    </div>
                  ))}

                  <div className="tw-text-center tw-flex tw-justify-end tw-items-center">
                    <button
                      type="button"
                      onClick={() => handleAddFields()}
                      className="tw-text-sm tw-bg-black tw-text-white tw-py-2 tw-px-4 tw-rounded"
                    >
                      경력 추가하기
                    </button>
                  </div>
                  {/* <button type="submit">Submit</button> */}
                </form>
              </div>
            </div>
            <div className="border tw-p-7 tw-rounded-xl tw-mt-5">
              <div className="tw-font-bold tw-text-base tw-text-black">선택 | 보유스킬</div>
              <div className="tw-mt-2 tw-border-t tw-border-gray-100">
                <dl className="tw-divide-y tw-divide-gray-100">
                  <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0  tw-flex tw-justify-center tw-items-center">
                    <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">보유스킬</dt>
                    <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                      <Autocomplete
                        fullWidth
                        multiple
                        limitTags={2}
                        size="small"
                        id="checkboxes-tags-demo"
                        value={customSkills}
                        getOptionLabel={option => option.name || []}
                        options={skillData || []}
                        onChange={handleSkillsChange} // onchange 이벤트 핸들러 추가
                        renderInput={params => (
                          <TextField {...params} label="보유스킬을 입력해주세요." placeholder="스킬" />
                        )}
                      />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="border tw-p-7 tw-rounded-xl tw-mt-5 ">
              <div className="tw-font-bold tw-text-base tw-text-black">선택 | 자기소개</div>
              <div className="tw-mt-2 tw-border-t tw-border-gray-100">
                <dl className="tw-divide-y tw-divide-gray-100">
                  <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 ">
                    <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">한줄소개</dt>
                    <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                      <TextField
                        fullWidth
                        id="margin-none"
                        multiline
                        rows={3}
                        onChange={onMessageChange}
                        value={introductionMessage}
                        // defaultValue="클럽 소개 내용을 입력해주세요."
                      />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="tw-p-3 tw-rounded-xl tw-mt-5 tw-text-center">
              <button
                type="button"
                onClick={() => handleProfileSave()}
                className="tw-text-sm tw-bg-black tw-text-white tw-py-2 tw-px-4 tw-rounded"
              >
                수정하기
              </button>
            </div>
          </ProfileModal>
        )}
      </div>
    </div>
  );
}

export default ProfileTemplate;
