import styles from './index.module.scss';
import { Button, Typography } from 'src/stories/components';
import classNames from 'classnames/bind';
import SectionHeader from 'src/stories/components/SectionHeader';
import { useContentJobTypes, useContentTypes, useJobGroups, useJobGroupss } from 'src/services/code/code.queries';
import { useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../store/session';
import Grid from '@mui/material/Grid';
import ProfileModal from 'src/stories/components/ProfileModal';
import { User } from 'src/models/user';
import { useMemberInfo } from 'src/services/account/account.queries';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import TextField from '@mui/material/TextField';

/** date picker */
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import Autocomplete from '@mui/material/Autocomplete';
import { useSkills } from 'src/services/skill/skill.queries';
import { SkillResponse } from 'src/models/skills';
import { UseQueryResult } from 'react-query';
import { Divider } from 'antd';
import { useUploadImage } from 'src/services/image/image.mutations';
import { useSaveProfile } from 'src/services/account/account.mutations';
import useDidMountEffect from 'src/hooks/useDidMountEffect';

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

export interface HomeProps {
  logged: boolean;
  // hasUserResumeStory: boolean;
  // userType: any; // 0001 멘티
}

export function HomeTemplate({ logged = false }: HomeProps) {
  const router = useRouter();
  // const { jobGroups, setJobGroups } = useStore();
  const [vodList, setVodList] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const [mentorList, setMentorList] = useState([]);
  const [phone, setPhone] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**skill data */
  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const fixedOptions = [];
  const [selectedSkills, setSelectedSkills] = useState([]);

  const recommendLevelsRef = useRef(null);
  const jobGroupRef = useRef(null);
  const phoneRef = useRef(null);

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

  const onPhoneChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setPhone(value);
  };

  /**work start end */
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDatealue] = React.useState<Dayjs | null>(null);
  const [isFreelance, setIsFreelance] = useState<boolean>(false);
  const [isCurrent, setIsCurrent] = useState<boolean>(false);

  /** job & level */
  const [jobGroup, setJobGroup] = useState([]);
  const [recommendJobGroups, setRecommendJobGroups] = useState([]);
  const [recommendLevels, setRecommendLevels] = useState('');
  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setJobGroup(data.data.contents || []);
  });
  /**image */
  const { mutate: onSaveImage, data: imageUrl, isSuccess: imageSuccess } = useUploadImage();

  /** job */
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  /**file image  */
  const [file, setFile] = useState(null);
  const [fileImageUrl, setFileImageUrl] = useState(null);

  /** get profile */
  const { user, setUser } = useStore();
  const { memberId } = useSessionStore.getState();
  const { isFetched: isUser, data } = useMemberInfo(memberId, user => {
    //console.log(data);
    setUser(user);
    setNickName(user?.nickname);
    setPhone(user?.phoneNumber || '');
  });

  // console.log('profileList', isUser, data?.jobGroup, !!!data?.jobGroup);
  // console.log('data', data);
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /**save profile */
  const { mutate: onSave } = useSaveProfile();

  // 클릭 이벤트 핸들러를 정의합니다.
  const handleUserButton = async () => {
    if (logged) {
      // 조건에 따라 원하는 동작을 수행합니다.
      router.push('/quiz');
    } else {
      // 다른 조건에 대한 동작을 수행할 수 있습니다.
      router.push('/account/login');
    }
  };

  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    setRecommendLevels(newFormats);
  };

  const handleJobGroups = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendJobGroups(newFormats);
  };

  const [formFields, setFormFields] = useState([
    { companyName: '', startDate: '', endDate: '', isCurrent: false, isFreelance: false, isDelete: false },
  ]);

  const handleAddFields = () => {
    const values = [
      ...formFields,
      { companyName: '', startDate: today, endDate: today, isCurrent: false, isFreelance: false, isDelete: false },
    ];
    setFormFields(values);
  };

  const handleProfileSave = async () => {
    //console.log(imageUrl);
    //console.log(fileImageUrl);

    console.log(phone);
    // 전화번호 유효성 검사
    const regex = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    if (!regex.test(phone) || phone === '') {
      alert('유효하지 않은 전화번호입니다.');
      setPhone('');
      phoneRef.current.focus();
      return 0;
    }

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
    // fileImageUrl이 null인 경우 imageUrl을 사용하도록 조건문 추가
    const profileImageKey = imageUrl || user?.profileImageUrl;

    //console.log(profileImageKey);
    const params = {
      nickname: nickName,
      phoneNumber: phone,
      careers: formFields[0].companyName ? formFields : [],
      jobGroupType: recommendJobGroups,
      level: recommendLevels,
      customSkills: selectedSkills,
      introductionMessage: introductionMessage,
      profileImageUrl: profileImageKey,
    };
    onSave(params);
    // if (data !== null && data !== undefined) {
    //   data.jobGroup = '0000';
    // }
    setIsOpen(false);
    console.log(
      'ㅇㅇ',
      data.jobGroup,
      !!!data.jobGroup,
      data?.jobGroup === undefined ? false : true,
      !!!data.jobGroup && data?.jobGroup === undefined ? false : true,
    );
  };

  const handleRemoveFields = (index: number) => {
    if (formFields.length === 1) {
      alert('At least one form must remain');
      return;
    }
    const values = [...formFields].splice(index, 1);
    setFormFields(values);
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>, key, id) => {
    const values = [...formFields];
    if (key === 'text') {
      if (e.target.name === 'companyName') {
        values[index].companyName = e.target.value;
      }
    } else if (key === 'startDate' || key === 'endDate') {
      const datetime = e.format('YYYY-MM-DD');
      values[index][key] = datetime;
    } else if (key === 'isFreelance') {
      values[index][key] = !values[index][key];
      // setIsFreelance(!isFreelance);
    } else if (key === 'job') {
      // 이 부분을 수정하여 id를 사용하도록 변경
      values[index][key] = id;
    } else {
      values[index][key] = !values[index][key];
      // setIsCurrent(!isCurrent);
    }
    // values[index].sequence = index + 1;
    setFormFields(values);
  };

  const handleSkillsChange = (event, newValue) => {
    // newValue 배열에서 각 객체의 name 속성을 추출하여 새로운 배열을 만듭니다.
    const selectedSkillNames = newValue.map(option => option.name);
    setSelectedSkills(selectedSkillNames);
    //console.log(selectedSkillNames);
    // 여기에서 선택된 값(newValue)을 처리하거나 원하는 작업을 수행할 수 있습니다.
  };
  const handleJobChange = (index, event, newValue) => {
    handleInputChange(index, event, 'job', newValue.id);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //console.log(formFields);
  };

  const dateNow = new Date();
  const today = dateNow.toISOString().slice(0, 10);

  useDidMountEffect(() => {
    console.log('useEffect', data?.jobGroup);
    if (data?.jobGroup === undefined || data?.jobGroup === '') {
      console.log('useEffect 1');
      setIsOpen(false);
    } else if (data?.jobGroup === null) {
      console.log('useEffect 2');
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [data]);

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

  return (
    <div className={cx('career-main')}>
      <section className={cx('top-banner', 'hero-section', 'hero-section-3')}>
        <div>
          <img src="/assets/images/main_1.png" alt="main_background" className={cx('top-banner__image')} />
          {/* <div className="container text-white">
            <div className={cx('fit-content', 'action-btn')}>
              <button
                className="tw-w-[240px] tw-h-[48px]  tw-bg-white tw-text-blue-500  tw-rounded-full"
                onClick={handleUserButton}
              >
                <Typography type="B1" tag="div" weight="bold">
                  지금 시작하기!
                </Typography>
              </button>
            </div>
          </div> */}
        </div>
      </section>
      <div className="tw-h-20 tw-text-center tw-bg-[#fafafa] tw-flex tw-items-center tw-justify-center">
        <button className="tw-w-[240px] tw-h-[48px] tw-bg-black tw-text-white tw-rounded-md" onClick={handleUserButton}>
          <Typography type="B1" tag="div" weight="bold">
            지금 시작하기!
          </Typography>
        </button>
      </div>
      <img src="/assets/images/main_2.png" />
      <img src="/assets/images/main_3.png" alt="main_background" />
      <div className={cx('main-container', 'tw-bg-[#fafafa]')}>
        <section className={cx('job-group-area', 'container', 'tw-pb-1')}>
          <div className={cx('justify-content-center', 'tw-pt-[80px]', 'max-md:!tw-pt-12', 'job-group__wrap')}>
            <SectionHeader
              title="누구나 ‘크루’, ‘리더’, ‘메이커’가 될 수 있어요!"
              subTitle="데브어스에서 다음과 같은 역할을 맡아 나만의 성장루틴을 만들어보세요."
            />
            <div className={cx('growth-area', 'pt-60', 'flex-wrap-container')}>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={2} sm={4} md={4}>
                  <div
                    className="w-1/2 bg-white  tw-rounded-xl overflow-hidden tw-h-[680px] max-md:tw-h-[680px] tw-px-[55px] max-md:tw-px-4"
                    style={{ boxShadow: '-12px 13px 40px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="tw-flex tw-justify-center tw-items-center tw-pt-20 tw-pb-5">
                      <img
                        className="max-lg:tw-h-[80px] max-lg:tw-w-[80px] tw-h-[162px] tw-w-[162px] tw-object-cover"
                        src="/assets/images/icons/megaphone_icon_182174.png"
                        alt="Card"
                      />
                    </div>
                    <div className="tw-pt-0 tw-px-5">
                      <div className="text-black tw-text-[24px] tw-font-bold mb-4">크루님!</div>
                      <p className="text-black tw-text-base tw-font-bold">
                        최고의 개발자가 이끄는 클럽에 참여해서 함께 성장하세요!
                      </p>
                    </div>
                    <div className="tw-py-10">
                      <div className="tw-bg-[#f2f2f2] tw-font-bold tw-rounded-full tw-py-3 tw-px-5 tw-text-gray-800">
                        크루 가이드
                      </div>
                    </div>
                    <div className=" tw-text-left tw-text-[14px] tw-text-black">
                      1. 성장 퀴즈 클럽에 참가해요.
                      <br /> 2. 직무 키워드의 퀴즈와 아티클을 보며 나의 언어로 정리해요. <br /> 3. 서로의 답변을 보며,
                      생각을 확장해요.
                    </div>

                    <div className="tw-py-10">
                      <button
                        onClick={() => {
                          {
                            if (!logged) {
                              alert('로그인 후, 사용이 가능합니다.');
                              return false;
                            } else {
                              router.push('/quiz');
                            }
                          }
                        }}
                        className="tw-bg-[#3EA521] tw-font-bold tw-text-white tw-p-3 max-lg:tw-w-[100%] tw-w-[220px] tw-rounded-md"
                      >
                        클럽 가입하러 가기
                      </button>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                  <div
                    className="w-1/2 bg-white  tw-rounded-xl overflow-hidden tw-h-[680px] max-md:tw-h-[680px] tw-px-[55px]  max-md:tw-px-4"
                    style={{ boxShadow: '-12px 13px 40px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="tw-flex tw-justify-center tw-items-center tw-pt-20 tw-pb-5">
                      <img
                        className="max-lg:tw-h-[80px] max-lg:tw-w-[80px] tw-h-[162px] tw-w-[162px] tw-object-cover"
                        src="/assets/images/icons/8202590 1.png"
                        alt="Card"
                      />
                    </div>
                    <div className="tw-pt-0 tw-px-5">
                      <div className="text-black tw-text-[24px] tw-font-bold mb-4">리더님!</div>
                      <p className="text-black tw-text-base tw-font-bold">
                        클럽을 만들고 운영하면서<br></br> 존경받는 리더가 되어보세요!
                      </p>
                    </div>
                    <div className="tw-py-10">
                      <div className="tw-bg-[#f2f2f2] tw-font-bold tw-rounded-full tw-py-3 tw-px-5 tw-text-gray-800">
                        리더 가이드
                      </div>
                    </div>
                    <div className=" tw-text-left tw-text-[14px] tw-text-black">
                      1. 성장 퀴즈 클럽의 주제를 정하고 클럽을 개설하여 크루를 이끌어요.<br></br> 2. 함께할 퀴즈를
                      정하고, 답변을 작성해요.<br></br> 3. 함께 공부하는 크루의 학습을 독려해요.
                    </div>

                    <div className="tw-py-10">
                      <button
                        onClick={() => {
                          if (!logged) {
                            alert('로그인 후, 사용이 가능합니다.');
                            return false;
                          } else {
                            router.push('/quiz/open');
                          }
                        }}
                        className="tw-bg-[#0E977D] tw-font-bold tw-text-white tw-p-3 max-lg:tw-w-[100%] tw-w-[220px] tw-rounded-md"
                      >
                        클럽 개설하러 가기
                      </button>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                  <div
                    className="w-1/2 bg-white  tw-rounded-xl overflow-hidden tw-h-[680px] max-md:tw-h-[680px] tw-px-[55px]  max-md:tw-px-4"
                    style={{ boxShadow: '-12px 13px 40px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="tw-flex tw-justify-center tw-items-center tw-pt-20 tw-pb-5">
                      <img
                        className="max-lg:tw-h-[80px] max-lg:tw-w-[80px] tw-h-[162px] tw-w-[162px] tw-object-cover"
                        src="/assets/images/icons/bookmark-folder.png"
                        alt="Card"
                      />
                    </div>
                    <div className="tw-pt-0 tw-px-5">
                      <div className="text-black tw-text-[24px] tw-font-bold mb-4">메이커님!</div>
                      <p className="text-black tw-text-base tw-font-medium">
                        리더가 가져가고 크루가 많이 푸는<br></br> 좋은 퀴즈를 만들어보세요!
                      </p>
                    </div>
                    <div className="tw-py-10">
                      <div className="tw-bg-[#f2f2f2] tw-font-bold tw-rounded-full tw-py-3 tw-px-5 tw-text-gray-800">
                        메이커 가이드
                      </div>
                    </div>
                    <div className=" tw-text-left tw-text-[14px] tw-text-black">
                      1. 직무와 관련된 질문을 만들어요. <br></br>2. 질문 키워드와 관련된 유용한 아티클을 선정해요.
                      <br></br>
                      <p className="h-[14px]">&nbsp;</p>
                    </div>

                    <div className="tw-py-10">
                      <button
                        onClick={() => {
                          if (!logged) {
                            alert('로그인 후, 사용이 가능합니다.');
                            return false;
                          } else {
                            router.push('/quiz-make');
                          }
                        }}
                        className="tw-bg-blue-500 tw-font-bold tw-text-white max-lg:tw-w-[100%] tw-p-3 tw-w-[220px] tw-rounded-md"
                      >
                        퀴즈 만들러 가기
                      </button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </section>
      </div>
      <div className="tw-py-50 tw-bg-white tw-text-center tw-mt-24">
        <p className="tw-text-[16px] tw-font-bold tw-text-black tw-py-5">
          상위 1% 리더들과 상위 10% 열정크루들이 모여 함께 성장하는
        </p>
        <div className="tw-flex tw-justify-center tw-mb-10">
          <img src="/assets/images/devus 2.png" width="123" alt="logo" className="Header_image-logo__NzBUu"></img>
        </div>
      </div>

      {isUser && (
        <ProfileModal
          // isOpen={!!!data?.jobGroup && data?.jobGroup === undefined ? false : true}
          isOpen={isOpen}
          // onAfterClose={() => setIsModalOpen(false)}
        >
          <div className="tw-font-bold tw-text-xl tw-text-black tw-mt-0 tw-mb-5 tw-text-center">
            {user?.name || user?.nickname}님 데브어스에 오신 것을 환영합니다!
          </div>
          <div className="tw-font-semibold tw-text-base tw-text-black tw-mt-0  tw-text-center">
            직군 및 레벨을 설정하시면 님께
          </div>
          <div className="tw-font-semibold tw-text-base  tw-text-black tw-mt-0 tw-mb-10 tw-text-center">
            꼭 맞는커멘 서비스를 추천받으실 수 있습니다!
          </div>

          <div className="border tw-p-7 tw-rounded-xl">
            <div className="tw-font-bold tw-text-base tw-text-black">개인정보</div>

            <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
              <img
                className="tw-w-32 tw-h-32 tw-ring-1 tw-rounded-full"
                src={fileImageUrl ?? user?.profileImageUrl}
                alt=""
              />
            </div>
            <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
              <Button type="button" color="primary" className={cx('change-button')}>
                <label htmlFor={`input-file`}>사진 변경</label>
                <input
                  hidden
                  id={`input-file`}
                  accept="image/*"
                  type="file"
                  onChange={e => onFileChange(e.target?.files)}
                />
              </Button>
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
                      id="outlined-basic"
                      label=""
                      name="companyName"
                      variant="outlined"
                      onChange={onNickNameChange}
                      value={nickName}
                      inputProps={{
                        style: {
                          height: '20px',
                        },
                      }}
                    />
                  </dd>
                </div>
                <div className="tw-px-4 tw-py-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0  tw-flex tw-justify-center tw-items-center">
                  <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">(*) 전화번호</dt>
                  <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">
                    <TextField
                      inputRef={phoneRef} // ref를 할당합니다.
                      size="small"
                      id="outlined-basic"
                      label=""
                      name="companyName"
                      variant="outlined"
                      onChange={onPhoneChange}
                      value={phone}
                      inputProps={{
                        maxLength: 13,
                        style: {
                          height: '20px',
                        },
                      }}
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
                          <Autocomplete
                            fullWidth
                            limitTags={2}
                            size="small"
                            id="checkboxes-tags-demo"
                            getOptionLabel={option => option.name || []}
                            options={contentJobType || []}
                            onChange={(e, v) => handleJobChange(index, e, v)}
                            renderInput={params => (
                              <TextField {...params} label="" placeholder="직무를 선택해주세요." />
                            )}
                          />
                        </dd>
                      </div>

                      <div className="tw-px-4 tw-pt-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                        <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">근무기간</dt>
                        <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                          <div className="tw-flex tw-justify-center tw-items-center tw-gap-1">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                format="YYYY-MM-DD"
                                slotProps={{ textField: { size: 'small' } }}
                                value={startDate}
                                onChange={e => handleInputChange(index, e, 'startDate')}
                              />
                              <DatePicker
                                format="YYYY-MM-DD"
                                slotProps={{ textField: { size: 'small' } }}
                                value={endDate}
                                onChange={e => handleInputChange(index, e, 'endDate')}
                              />
                            </LocalizationProvider>
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
                                  // checked={isCurrent}
                                  checked={field.isCurrent}
                                  onChange={e => handleInputChange(index, e, 'isCurrent')}
                                  // onChange={() => setMarketingAgree(!marketingAgree)}
                                  name="jason"
                                />
                              }
                              label="재직 중인 경우, 체크 해주세요."
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
              저장하기
            </button>
          </div>
        </ProfileModal>
      )}
    </div>
  );
}

export default HomeTemplate;
