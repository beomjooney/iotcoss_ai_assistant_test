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
import { Desktop, Mobile } from 'src/hooks/mediaQuery';

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

  useEffect(() => {
    if (phone.length === 11) {
      setPhone(phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
    } else if (phone.length === 13) {
      setPhone(phone.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
    }
  }, [phone]);

  return (
    <div className={cx('career-main ')}>
      <section
        className={cx('top-banner', 'hero-section', 'hero-section-3', 'tw-flex tw-justify-center tw-items-center ')}
      >
        <div
          className="tw-w-[1120px] tw-h-[520px] tw-relative tw-overflow-hidden tw-rounded-[20px]"
          style={{
            background:
              'linear-gradient(to right, rgba(254,226,255,0.59) 0%, rgba(207,238,255,0.59) 64.58%, rgba(186,251,255,0.59) 100%)',
          }}
        >
          <svg
            width={478}
            height={412}
            viewBox="0 0 478 412"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="tw-absolute tw-left-[671px] tw-top-[137px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <g style={{ mixBlendMode: 'multiply' }} filter="url(#filter0_f_320_40043)">
              <circle cx="390.5" cy="390.5" r="360.5" fill="url(#paint0_radial_320_40043)" />
            </g>
            <defs>
              <filter
                id="filter0_f_320_40043"
                x={0}
                y={0}
                width={781}
                height={781}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feflood flood-opacity={0} result="BackgroundImageFix" />
                <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <fegaussianblur stdDeviation={15} result="effect1_foregroundBlur_320_40043" />
              </filter>
              <radialgradient
                id="paint0_radial_320_40043"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(390.5 390.5) rotate(90) scale(292.5)"
              >
                <stop stop-color="#FAFFC5" stop-opacity="0.5" />
                <stop offset={1} stop-color="white" stop-opacity={0} />
              </radialgradient>
            </defs>
          </svg>
          <svg
            width={718}
            height={412}
            viewBox="0 0 718 412"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="tw-absolute tw-left-[431px] tw-top-[-441px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <g style={{ mixBlendMode: 'multiply' }} filter="url(#filter0_f_320_40044)">
              <circle cx={441} cy={-29} r={411} fill="url(#paint0_radial_320_40044)" />
            </g>
            <defs>
              <filter
                id="filter0_f_320_40044"
                x={0}
                y={-470}
                width={882}
                height={882}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feflood flood-opacity={0} result="BackgroundImageFix" />
                <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <fegaussianblur stdDeviation={15} result="effect1_foregroundBlur_320_40044" />
              </filter>
              <radialgradient
                id="paint0_radial_320_40044"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(441 -29) rotate(90) scale(333.474)"
              >
                <stop stop-color="#AEC5FF" />
                <stop offset={1} stop-color="white" stop-opacity={0} />
              </radialgradient>
            </defs>
          </svg>
          <div className="tw-w-[1280px] tw-h-[591px] tw-absolute tw-left-[-1px] tw-top-[-30px] tw-bg-white/20" />
          <svg
            width={787}
            height={520}
            viewBox="0 0 787 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="tw-absolute tw-left-[332px] tw-top-[-148px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle cx={453} cy={306} r={453} fill="url(#paint0_radial_320_40046)" />
            <defs>
              <radialgradient
                id="paint0_radial_320_40046"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(453 306) rotate(90) scale(322.897)"
              >
                <stop offset="0.438441" stop-color="white" />
                <stop offset={1} stop-color="white" stop-opacity={0} />
              </radialgradient>
            </defs>
          </svg>
          <p className="tw-absolute tw-left-[57px] tw-top-[95px] tw-text-sm tw-font-medium tw-text-left tw-text-black">
            Dongseo University
          </p>
          <p className="tw-absolute tw-left-[57px] tw-top-[116px] tw-text-[32px] tw-text-left tw-text-black">
            <span className="tw-text-[32px] tw-text-left tw-text-black">MY </span>
            <span className="tw-text-[32px] tw-font-bold tw-text-left tw-text-black">BRIGHT</span>
            <span className="tw-text-[32px] tw-text-left tw-text-black"> FUTURE</span>
          </p>
          <div className="tw-w-[81px] tw-h-[3px] tw-absolute tw-left-[139px] tw-top-[177px] tw-bg-[#e11837]" />
          <p className="tw-absolute tw-left-[57px] tw-top-[209px] tw-text-base tw-font-medium tw-text-left tw-text-black">
            <span className="tw-text-base tw-font-medium tw-text-left tw-text-black">
              각 분야의 전문가들이 메이커로서 핵심 질문과 아티클을 답으로 제시합니다.
            </span>
            <br />
            <span className="tw-text-base tw-font-medium tw-text-left tw-text-black">
              관리자는 클럽을 만들고 학습자들이 함께 풀 문제를 엄선합니다.
            </span>
            <br />
            <span className="tw-text-base tw-font-medium tw-text-left tw-text-black">
              학습자는 관리자만 따라가면 대한민국 최고의 전문가로 성장할 수 있습니다.
            </span>
          </p>
          <div className="tw-w-48 tw-h-20">
            <div className="tw-w-48 tw-h-20 tw-absolute tw-left-[261.38px] tw-top-[373.5px] tw-rounded-lg tw-bg-[#478af5]" />
            <p className="tw-absolute tw-left-[358px] tw-top-[385px] tw-text-lg tw-text-left tw-text-white">
              <span className="tw-text-lg tw-font-bold tw-text-left tw-text-white">교수자 </span>
              <br />
              <span className="tw-text-lg tw-font-medium tw-text-left tw-text-white">체험하기</span>
            </p>
            <svg
              width={42}
              height={47}
              viewBox="0 0 42 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-absolute tw-left-[292.69px] tw-top-[389.45px]"
              preserveAspectRatio="none"
            >
              <path
                d="M33.6774 0L20.7988 22.6382L7.92022 0H2.27815C1.14541 0 0.236328 1.04737 0.236328 2.33391V44.6661C0.236328 45.9609 1.15262 47 2.27815 47H7.92022V15.1498L16.3472 29.9698C16.7224 30.6296 17.3717 31.0337 18.0644 31.0337H23.5333C24.2259 31.0337 24.868 30.6296 25.2504 29.9698L33.6774 15.1498V47H39.3195C40.4523 47 41.3613 45.9526 41.3613 44.6661V2.33391C41.3613 1.03912 40.445 0 39.3195 0H33.6774Z"
                fill="url(#paint0_linear_320_40054)"
              />
              <defs>
                <lineargradient
                  id="paint0_linear_320_40054"
                  x1="20.7988"
                  y1={0}
                  x2="20.7988"
                  y2={47}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#005DE2" />
                  <stop offset={1} stop-color="#003178" />
                </lineargradient>
              </defs>
            </svg>
          </div>
          <div className="tw-w-48 tw-h-20">
            <div className="tw-w-48 tw-h-20">
              <div className="tw-w-48 tw-h-20 tw-absolute tw-left-[46.5px] tw-top-[373.5px] tw-rounded-lg tw-bg-[#7ed869]" />
              <p className="tw-absolute tw-left-[140px] tw-top-[385px] tw-text-lg tw-text-left tw-text-white">
                <span className="tw-text-lg tw-font-bold tw-text-left tw-text-white">학습자</span>
                <span className="tw-text-lg tw-font-medium tw-text-left tw-text-white"> </span>
                <br />
                <span className="tw-text-lg tw-font-medium tw-text-left tw-text-white">체험하기</span>
              </p>
              <svg
                width={40}
                height={45}
                viewBox="0 0 40 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-absolute tw-left-[76.83px] tw-top-[390.45px]"
                preserveAspectRatio="none"
              >
                <path
                  d="M20.5213 36.5848C13.0805 36.5848 7.1448 29.3931 7.9857 20.891C8.64993 14.2046 13.6246 8.89971 19.631 8.44184C24.4219 8.07871 28.69 10.6996 31.0926 14.8125C31.46 15.4361 32.0889 15.815 32.7531 15.815H39.7559C37.0919 6.23145 28.8455 -0.604941 19.2635 0.0423856C9.68161 0.689712 1.0819 9.79175 0.424735 20.9937C-0.338427 34.0981 8.95378 45 20.5213 45C29.5592 45 37.2049 38.3452 39.7559 29.1879H32.7531C32.0818 29.1879 31.4529 29.5668 31.0855 30.1983C28.8313 34.0507 24.9449 36.5927 20.5213 36.5927V36.5848Z"
                  fill="url(#paint0_linear_320_40059)"
                />
                <defs>
                  <lineargradient
                    id="paint0_linear_320_40059"
                    x1="17.3795"
                    y1="11.7612"
                    x2="30.639"
                    y2="46.1551"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#3EA521" />
                    <stop offset={1} stop-color="#14842D" />
                  </lineargradient>
                </defs>
              </svg>
            </div>
          </div>
          <img
            className="tw-w-[314px] tw-h-[533px] tw-absolute tw-left-[769px] tw-top-[43px]"
            src="/assets/images/main/image_2.png"
          />
          <img
            src="/assets/images/main/image_1.png"
            className="tw-w-[406px] tw-h-[479px] tw-absolute tw-left-[582px] tw-top-[43px] tw-object-cover"
          />
        </div>
      </section>

      <div className={cx('main-container tw-flex tw-justify-center tw-items-center tw-pt-12')}>
        <section className={cx('job-group-area', 'container', 'tw-pb-1 tw-flex tw-justify-center tw-items-center')}>
          <div className="tw-w-[1100px] tw-h-[319px] tw-relative">
            <div className="tw-w-[550px] tw-left-[558.87px] tw-top-[189px] tw-absolute tw-text-right tw-text-black tw-text-base tw-font-medium tw-leading-normal tw-font-['Inter']">
              동서대 출신 상위 1% 선배들이 모교와 후배를 위하여 힘을 보탭니다.
              <br />
              실무보다 좋은 수업은 없습니다. 각 분야에 진출한 동서대 최고의 선배들의
              <br />
              경험이 녹아 있는 생생한 퀴즈를 풀면서 함께 성장해보세요.
            </div>
            <div className="tw-w-[126.77px] tw-left-[973.23px] tw-top-[29px] tw-absolute tw-text-right tw-text-black tw-text-sm tw-font-medium tw-leading-[21px]">
              Dongseo University
            </div>
            <div className="tw-w-[480px] tw-left-[625.80px] tw-top-[50px] tw-absolute tw-text-right">
              <span className="tw-text-black tw-text-[32px] tw-font-bold tw-font-['Noto Sans CJK KR']">Before</span>
              <span className="tw-text-black tw-text-[32px] tw-font-['Noto Sans CJK KR']"> Dongseo </span>
              <span className="tw-text-black tw-text-[32px] tw-font-bold tw-font-['Noto Sans CJK KR']">After</span>
              <span className="tw-text-black tw-text-[32px] tw-font-['Noto Sans CJK KR']"> Dongse</span>
            </div>
            <div className="tw-w-[80.85px] tw-h-[3px] tw-left-[1019.15px] tw-top-[112px] tw-absolute tw-bg-rose-600" />
            <img
              className="tw-w-[511.07px] tw-h-[319px] tw-left-0 tw-top-0 tw-absolute"
              src="/assets/images/main/image_3.png"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomeTemplate;
