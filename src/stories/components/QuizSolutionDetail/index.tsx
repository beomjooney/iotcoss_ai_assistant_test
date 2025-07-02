import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import {
  useAnswerSave,
  useAnswerUpdate,
  useComprehensionSave,
  useDeleteLike,
  useSaveLike,
} from 'src/services/community/community.mutations';
import { useSessionStore } from 'src/store/session';
const { logged } = useSessionStore.getState();
import TextareaAutosize from '@mui/material/TextareaAutosize';
import React, { useRef } from 'react';

/** import stepper */
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import styled from '@emotion/styled';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { useQuizFileDownload } from 'src/services/quiz/quiz.queries';
import { useAIQuizMyAnswerSavePut } from 'src/services/quiz/quiz.mutations';
import MentorsModal from 'src/stories/components/MentorsModal';

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
  width: 200,
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
}));

const ColorlibStepIconRootMobile = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: '#EFEFEF',
  zIndex: 1,
  color: '#fff',
  width: 80,
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
  return (
    <>
      <Desktop>
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}></ColorlibStepIconRoot>
      </Desktop>
      <Mobile>
        <ColorlibStepIconRootMobile
          ownerState={{ completed, active }}
          className={className}
        ></ColorlibStepIconRootMobile>
      </Mobile>
    </>
  );
}

export interface BannerProps {
  /** 배경 이미지 */
  imageName?: string;
  /** 제목 */
  title: string;
  /** 클래스 */
  data: object;
  className?: string;
  subTitle?: string;
  // quizStatus: object;
}

const cx = classNames.bind(styles);
// const Banner = ({ imageName = 'top_banner_seminar.jpg', title, subTitle, className }: BannerProps) => {
const quizSolutionDetail = ({
  imageName = 'seminar_bg.png',
  title,
  subTitle,
  className,
  data,
}: // quizStatus,
BannerProps) => {
  const steps = ['Step1. 답변 입력', 'Step2. 지식콘텐츠 읽기', 'Step3. 답변 수정(선택)'];
  const [inputList, setInputList] = useState([]);
  let [isLiked, setIsLiked] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [type, setType] = React.useState('0001'); // 초기값 설정
  const [introductionMessage, setIntroductionMessage] = useState<string>('');
  const [postIntroductionMessage, setPostIntroductionMessage] = useState<string>('');
  const [contentUrl, setContentUrl] = useState<string>('');
  const [preAnswer, setPreAnswer] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();
  const { mutate: onAnswerSave, isSuccess: isAnswerSave, data: answerRes } = useAnswerSave();
  const { mutate: onAnswerUpdate, isSuccess: isAnswerUpdate, data: answerUpdateRes } = useAnswerUpdate();
  const { mutate: onComprehensionSave, isSuccess: isComprehensionSave } = useComprehensionSave();

  const {
    mutate: onAIQuizAnswerSavePut,
    isSuccess: answerSuccessSavePut,
    isError: answerErrorSavePut,
    data: aiQuizAnswerDataSavePut,
  } = useAIQuizMyAnswerSavePut();

  const { isFetched: isParticipantListFetcheds, isSuccess: isParticipantListSuccess } = useQuizFileDownload(
    key,
    data => {
      console.log('file download', data, fileName);
      if (data) {
        const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        // 브라우저에서 PDF를 새 탭에서 열기
        window.open(url, '_blank', 'noopener,noreferrer');
        setKey('');
        setFileName('');
      }
    },
  );

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    setKey(key);
    setFileName(fileName);
  };

  useEffect(() => {
    if (answerSuccessSavePut) {
      setIsFeedbackModalOpen(true);
      setIsLoadingAI(false);
    }
  }, [answerSuccessSavePut]);

  useEffect(() => {
    if (isAnswerUpdate) {
      console.log('answerUpdateRes', answerUpdateRes);
      if (answerUpdateRes?.data?.feedbackType === '0200') {
        setShowSubmitAnswerModal(true);
      } else {
        location.href = `/quiz/${data?.clubSequence}`;
      }
    }
  }, [isAnswerUpdate]);

  useEffect(() => {
    if (isAnswerSave) {
      setContentUrl(answerRes?.data?.contentUrl);
      setPreAnswer(answerRes?.data?.preAnswer);
    }
  }, [isAnswerSave]);

  useEffect(() => {
    console.log('data', data);
    setContentUrl(data?.contentUrl);
    if (data?.status?.answerStatus === '0001') {
      setIntroductionMessage(data?.status?.preAnswer);
      setActiveStep(1);
    } else if (data?.status?.answerStatus === '0002') {
      setIntroductionMessage(data?.status?.preAnswer);
      setActiveStep(2);
      console.log('data2', data);
    }
  }, [data]);

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleAddInput = () => {
    setInputList([...inputList, { id: Date.now(), value: '' }]);
  };

  const handleTypeChange = event => {
    setType(event.target.value); // 라디오 버튼의 값을 상태에 업데이트
    console.log(event.target.value);
  };

  const handleInputChange = (id, event) => {
    const newInputList = inputList.map(input => {
      if (input.id === id) {
        return { ...input, value: event.target.value };
      }
      return input;
    });
    setInputList(newInputList);
  };

  useEffect(() => {
    setIsLiked(data?.isFavorite);
  }, [data]);

  const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setIntroductionMessage(value);
  };
  const onPostMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setPostIntroductionMessage(value);
  };
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = event => {
    const files = Array.from(event.target.files);
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.xls|\.xlsx|\.doc|\.docx|\.ppt|\.pptx|\.hwp|\.pdf)$/i;

    for (let i = 0; i < files.length; i++) {
      if (!allowedExtensions.exec(files[i].name)) {
        alert('허용되지 않는 파일 형식입니다.');
        event.target.value = ''; // input 초기화
        return;
      }
    }

    setFileList(prevFileList => [...prevFileList, ...files]);
  };
  const handleNext = () => {
    if (introductionMessage === '') {
      alert('답변을 입력해주세요.');
      return;
    }

    if (introductionMessage.length < 25) {
      alert('답변은 최소 25자 이상이어야 합니다.');
      return;
    }

    const inputData = inputList.map(input => input.value).filter(value => value !== '');
    console.log(inputData);

    const invalidUrls = inputData.filter(value => !value.startsWith('http://') && !value.startsWith('https://'));

    if (invalidUrls.length > 0) {
      alert('일부 URL이 잘못되었습니다. http:// 또는 https://로 시작해야 합니다');
      return;
    }

    if (activeStep === 0) {
      const formData = new FormData();
      formData.append('preAnswer', introductionMessage);
      formData.append('urls', inputData.toString());
      fileList.forEach((file, index) => {
        formData.append('files', file);
      });

      setActiveStep(prevActiveStep => prevActiveStep + 1);
      // FormData 내용을 콘솔에 출력
      onAnswerSave({
        formData,
        club: data?.clubSequence,
        quiz: data?.quizSequence,
      });

      setFileList([]);
      setInputList([]);
    }
    if (activeStep === 2) {
      if (postIntroductionMessage.length < 25) {
        alert('답변은 최소 25자 이상이어야 합니다.');
        return;
      }

      // 팝업창 띄우기
      setShowSubmitModal(true);
    }
  };

  const [fileList, setFileList] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSubmitAnswerModal, setShowSubmitAnswerModal] = useState(false);

  const handleDeleteFile = index => {
    setFileList(prevFileList => prevFileList.filter((_, i) => i !== index));
  };

  const handleComprehension = () => {
    setPostIntroductionMessage(introductionMessage);
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleFinalSubmit = () => {
    const inputData = inputList.map(input => input.value).filter(value => value !== '');

    const formData = new FormData();
    formData.append('postAnswer', postIntroductionMessage);
    formData.append('urls', inputData.toString());
    fileList.forEach((file, index) => {
      formData.append('files', file);
    });

    onAnswerUpdate({
      formData,
      club: data?.clubSequence,
      quiz: data?.quizSequence,
    });

    setShowSubmitModal(false);
  };

  const handleFinalSubmit2 = () => {
    setIsLoadingAI(true);
    onAIQuizAnswerSavePut({
      club: data?.clubSequence,
      quiz: data?.quizSequence,
    });
  };

  const handleModalClose = () => {
    setShowSubmitModal(false);
    location.href = `/quiz/${data?.clubSequence}`;
  };
  const handleModalClose2 = () => {
    setShowSubmitAnswerModal(false);
    location.href = `/quiz/${data?.clubSequence}`;
  };
  return (
    <>
      <Desktop>
        <div className={cx('content tw-px-44 ', className, '')}>
          <div className=" tw-my-10 container !tw-pl-0 !tw-pr-0">
            <div className="tw-h-[60px] tw-flex  tw-gap-4 tw-items-center tw-px-5 border border-danger tw-rounded-lg">
              <div className="tw-text-[17.229293823242188px] tw-font-medium tw-text-left tw-text-[#e11837]">
                퀴즈클럽
              </div>
              <div className=" tw-text-[17.229293823242188px] tw-font-medium tw-text-left tw-text-black">
                {data?.clubName}
              </div>
              <div className="tw-text-sm tw-text-left tw-text-black tw-mt-1">{data?.clubDescription}</div>
            </div>
          </div>
          <div className="container tw-p-40 tw-leading-normal tw-text-black tw-text-xl tw-pt-10 tw-pb-10 tw-bg-gray-100">
            <div className="tw-inline-flex tw-items-center">
              <div className="tw-py-1  tw-text-bold tw-mr-2 tw-text-[#f44]">{data?.order}회</div>
              {data?.publishDate && (
                <div className="tw-py-1 tw-text-bold tw-mr-2">{data.publishDate.split('-').slice(1).join('-')}</div>
              )}

              {data?.studyDay && <div className="tw-py-1 tw-font-bold tw-mr-2">({data.studyDay})</div>}
              <div className="tw-py-1 tw-font-bold tw-mr-2">
                {activeStep === 0 || activeStep === 1 ? '사전답변' : activeStep === 2 ? '사후답변' : ''}
              </div>
            </div>
            <Grid
              className=" tw-mt-2"
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              rowSpacing={0}
            >
              <Grid item xs={10}>
                <div className="tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                  <div className="tw-flex tw-gap-[7px]">
                    <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                      <p className="tw-text-[12.25px] tw-text-[#235a8d]"> {data?.jobGroups?.[0]?.name ?? '없음'}</p>
                    </div>
                    <div className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                      <p className="tw-text-[12.25px] tw-text-[#313b49]">{data?.jobLevels?.[0]?.name ?? '없음'}</p>
                    </div>
                    <div className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                      <p className="tw-text-[12.25px] tw-text-[#b83333]">{data?.jobs?.[0]?.name ?? '없음'}</p>
                    </div>
                  </div>
                </div>
              </Grid>
              {/* <Grid item xs={2} className="tw-text-base tw-font-semibold  tw-text-left">
                <div>{data?.activeCount}명 참가 완료</div>
              </Grid> */}
            </Grid>

            <div className="tw-mt-10 tw-bg-white tw-rounded-3xl tw-h-full  tw-p-10 tw-text-center border">
              <div className="tw-pt-4 tw-pb-10">
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
              </div>
              {(activeStep === 0 || activeStep === 2) && (
                <div>
                  <div className="tw-flex tw-items-center tw-mb-8 ">
                    <div className="tw-w-[100px] tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                      <img
                        className="tw-w-9 tw-h-9 tw-ring-1 tw-rounded-full"
                        src={data?.member?.profileImageUrl}
                        alt=""
                      />
                      <div className="tw-text-xs tw-text-left tw-text-black tw-mt-2">{data?.member?.nickname}</div>
                    </div>
                    <div className="tw-text-lg tw-font-semibold tw-text-black tw-text-left">
                      <div>{data?.question}</div>
                    </div>
                  </div>
                  {activeStep === 2 && <div className="tw-text-left tw-font-bold tw-text-base tw-pb-4">사전답변</div>}
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={15}
                    disabled={activeStep === 2}
                    placeholder="답변을 25자 이상 입력해주세요."
                    style={{
                      width: '100%',
                      backgroundColor: '#f8f9fa',
                      border: '0px solid #B0B7C1',
                      borderRadius: '15px',
                      fontSize: '15px',
                      padding: 12,
                      resize: 'none',
                      maxHeight: '350px', // 최대 높이 설정 (스크롤을 표시하려면 설정)
                      overflow: 'auto',
                    }}
                    name="introductionMessage"
                    onChange={onMessageChange}
                    value={introductionMessage}
                  />
                  {activeStep === 2 && (
                    <>
                      <div className="tw-text-left tw-font-bold tw-text-base tw-py-4">최종답변</div>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={15}
                        placeholder="답변을 25자 이상 입력해주세요."
                        style={{
                          width: '100%',
                          backgroundColor: '#f8f9fa',
                          border: '0px solid #B0B7C1',
                          borderRadius: '15px',
                          fontSize: '15px',
                          padding: 12,
                          resize: 'none',
                          maxHeight: '350px', // 최대 높이 설정 (스크롤을 표시하려면 설정)
                          overflow: 'auto',
                        }}
                        name="introductionMessage"
                        onChange={onPostMessageChange}
                        value={postIntroductionMessage}
                      />
                    </>
                  )}
                  <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3  tw-py-2">
                    <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[79px] tw-h-[21px] tw-relative">
                      <button
                        className="tw-absolute tw-left-6 tw-top-0 tw-text-sm tw-text-left tw-text-[#31343d]"
                        onClick={handleButtonClick}
                      >
                        파일추가
                      </button>
                      <input
                        accept=".jpeg,.jpg,.png,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.hwp,.pdf"
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 absolute left-0 top-0.5"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g clip-path="url(#clip0_679_9101)">
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
                    </div>
                    <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[79px] tw-h-[21px] tw-relative">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 absolute left-0 top-0.5"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g clip-path="url(#clip0_675_10029)">
                          <path
                            d="M14.2953 1.74475C12.6382 0.0876875 9.94195 0.0876875 8.28492 1.74475L5.2797 4.74997L5.98685 5.45706L8.99201 2.45184C9.60151 1.84235 10.4282 1.49994 11.2901 1.49995C11.7169 1.49995 12.1395 1.58401 12.5338 1.74734C12.9281 1.91067 13.2864 2.15007 13.5882 2.45186C13.89 2.75365 14.1294 3.11193 14.2927 3.50624C14.4561 3.90055 14.5401 4.32317 14.5401 4.74996C14.5401 5.17676 14.456 5.59938 14.2927 5.99369C14.1294 6.388 13.89 6.74627 13.5882 7.04806L10.583 10.0533L11.29 10.7604L14.2952 7.75516C15.9525 6.09809 15.9525 3.40184 14.2953 1.74475ZM7.04745 13.5888C6.43796 14.1983 5.61131 14.5407 4.74935 14.5407C3.8874 14.5407 3.06075 14.1983 2.45126 13.5888C1.84177 12.9793 1.49936 12.1527 1.49936 11.2907C1.49936 10.4288 1.84177 9.60212 2.45126 8.99263L5.27973 6.16416L4.57264 5.45706L1.74414 8.28553C1.34795 8.67984 1.03343 9.14843 0.818604 9.66447C0.603776 10.1805 0.492854 10.7339 0.49219 11.2928C0.491527 11.8518 0.601135 12.4054 0.814737 12.9219C1.02834 13.4385 1.34174 13.9078 1.73699 14.3031C2.13224 14.6983 2.60158 15.0117 3.11813 15.2253C3.63468 15.4389 4.18829 15.5485 4.74726 15.5479C5.30622 15.5472 5.85957 15.4363 6.37561 15.2214C6.89164 15.0066 7.36023 14.6921 7.75454 14.2959L10.583 11.4675L9.87589 10.7604L7.04745 13.5888Z"
                            fill="#31343D"
                          />
                          <path
                            d="M4.04297 11.2908L11.114 4.21973L11.8212 4.92685L4.75006 11.9979L4.04297 11.2908Z"
                            fill="#31343D"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_675_10029">
                            <rect width={16} height={16} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <button
                        onClick={handleAddInput}
                        className="tw-absolute tw-left-6 tw-top-0 tw-text-sm tw-text-left tw-text-[#31343d]"
                      >
                        링크추가
                      </button>
                    </div>
                  </div>
                  {fileList.length > 0 && (
                    <div className="tw-flex  tw-py-2">
                      <div className="tw-flex tw-w-34 tw-text-sm tw-items-center">업로드된 파일 : </div>
                      <div className="tw-text-left tw-pl-5 tw-text-sm">
                        <ul className="tw-flex tw-space-x-2">
                          {fileList.map((file, index) => (
                            <div key={index} className="border tw-p-1 tw-rounded">
                              {file.name}
                              <button
                                className="tw-ml-2 tw-text-sm tw-text-red-500"
                                onClick={() => handleDeleteFile(index)}
                              >
                                삭제
                              </button>
                            </div>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {inputList.length > 0 && (
                    <div className="tw-flex  tw-py-2">
                      <div className="tw-flex-none tw-w-30  tw-text-sm tw-mt-2">업로드된 링크 : </div>
                      <div className="tw-flex-1 tw-text-left tw-pl-5">
                        {inputList.map((input, index) => (
                          <div key={input.id} style={{ marginBottom: '10px' }}>
                            <input
                              placeholder="https://"
                              type="text"
                              className="border tw-w-full tw-rounded tw-text-sm tw-p-2 "
                              value={input.value}
                              onChange={event => handleInputChange(input.id, event)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    className=" tw-text-white tw-bg-red-500 tw-mt-5 tw-focus:ring-4  tw-font-medium tw-rounded tw-text-sm tw-px-7 tw-py-3 "
                  >
                    {activeStep === 0 ? '답변입력 및 지식콘텐츠 읽기' : '수정완료 및 답변 제출하기'}
                  </button>
                </div>
              )}

              {activeStep === 1 && (
                <div>
                  <div className="border tw-rounded-lg tw-p-5 tw-my-5 tw-h-[300px]">
                    <button
                      type="button"
                      onClick={() => {
                        if (data?.contentType === '0320') {
                          setKey(data?.contentKey);
                        } else {
                          window.open(contentUrl, '_blank'); // data?.articleUrl을 새 탭으로 열기
                        }
                      }}
                      className=" tw-text-white tw-w-[150px]  tw-bg-red-500 tw-my-8 tw-text-sm  tw-font-medium tw-rounded tw-text-base tw-px-7 tw-py-3 "
                    >
                      아티클 보기
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleComprehension}
                    className="tw-text-white tw-bg-red-500 tw-mt-5 tw-focus:ring-4  tw-font-medium tw-rounded tw-text-sm tw-px-7 tw-py-3 "
                  >
                    답변수정 하러가기
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={cx('banner-container__wrap', ' tw-pb-20')}>
            <div className="tw-bg-white tw-border tw-border-gray-200">
              <div className="tw-flex tw-w-full tw-flex-col tw-justify-between tw-px-10 tw-leading-normal"></div>
            </div>
          </div>
        </div>
      </Desktop>
      <Mobile>
        <div className={cx('content-area', className, 'tw-bg-[#F6F7FB]')}>
          <div className="container tw-p-5 tw-leading-normal tw-text-black tw-text-xl">
            <div className="tw-py-1 tw-text-base">{data?.publishDate}</div>
            <div className="tw-py-1 tw-font-bold">{data?.clubName}</div>

            <Grid
              className=" tw-mt-2"
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              rowSpacing={0}
            >
              <Grid item xs={10}>
                <div className="tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                  <span className="tw-bg-black tw-text-white tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
                    진행중
                  </span>
                </div>
              </Grid>
              <Grid item xs={2} className="tw-text-base tw-font-semibold  tw-text-left">
                <div>{data?.activeCount}명 참가 완료</div>
              </Grid>
            </Grid>

            <div className="tw-mt-10 tw-bg-white tw-rounded-3xl tw-h-full max-lg:tw-p-5 tw-p-10 tw-text-center">
              <div className="tw-pt-4 tw-pb-10">
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
              </div>
              {(activeStep === 0 || activeStep === 2) && (
                <div>
                  <div className="tw-flex tw-items-center tw-space-x-4 tw-mb-8 ">
                    <img
                      className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full"
                      src={data?.clubLeaderProfileImageUrl}
                      alt=""
                    />
                    <div className="tw-text-lg tw-font-semibold tw-text-black tw-text-left">
                      <div>
                        <span className="tw-text-blue-500">Q1.</span> {data?.content}
                      </div>
                    </div>
                  </div>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={15}
                    placeholder="답변을 25자 이상 입력해주세요."
                    style={{
                      width: '100%',
                      backgroundColor: '#F6F7FB',
                      border: '0px solid #B0B7C1',
                      borderRadius: '15px',
                      fontSize: '15px',
                      padding: 12,
                      resize: 'none',
                      maxHeight: '350px', // 최대 높이 설정 (스크롤을 표시하려면 설정)
                      overflow: 'auto',
                    }}
                    name="introductionMessage"
                    onChange={onMessageChange}
                    value={introductionMessage}
                  />
                  <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                    <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[79px] tw-h-[21px] tw-relative">
                      <p className="tw-absolute tw-left-6 tw-top-0 tw-text-sm tw-text-left tw-text-[#31343d]">
                        파일추가
                      </p>
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 absolute left-0 top-0.5"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g clip-path="url(#clip0_679_9101)">
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
                    </div>
                    <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[79px] tw-h-[21px] tw-relative">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 absolute left-0 top-0.5"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g clip-path="url(#clip0_675_10029)">
                          <path
                            d="M14.2953 1.74475C12.6382 0.0876875 9.94195 0.0876875 8.28492 1.74475L5.2797 4.74997L5.98685 5.45706L8.99201 2.45184C9.60151 1.84235 10.4282 1.49994 11.2901 1.49995C11.7169 1.49995 12.1395 1.58401 12.5338 1.74734C12.9281 1.91067 13.2864 2.15007 13.5882 2.45186C13.89 2.75365 14.1294 3.11193 14.2927 3.50624C14.4561 3.90055 14.5401 4.32317 14.5401 4.74996C14.5401 5.17676 14.456 5.59938 14.2927 5.99369C14.1294 6.388 13.89 6.74627 13.5882 7.04806L10.583 10.0533L11.29 10.7604L14.2952 7.75516C15.9525 6.09809 15.9525 3.40184 14.2953 1.74475ZM7.04745 13.5888C6.43796 14.1983 5.61131 14.5407 4.74935 14.5407C3.8874 14.5407 3.06075 14.1983 2.45126 13.5888C1.84177 12.9793 1.49936 12.1527 1.49936 11.2907C1.49936 10.4288 1.84177 9.60212 2.45126 8.99263L5.27973 6.16416L4.57264 5.45706L1.74414 8.28553C1.34795 8.67984 1.03343 9.14843 0.818604 9.66447C0.603776 10.1805 0.492854 10.7339 0.49219 11.2928C0.491527 11.8518 0.601135 12.4054 0.814737 12.9219C1.02834 13.4385 1.34174 13.9078 1.73699 14.3031C2.13224 14.6983 2.60158 15.0117 3.11813 15.2253C3.63468 15.4389 4.18829 15.5485 4.74726 15.5479C5.30622 15.5472 5.85957 15.4363 6.37561 15.2214C6.89164 15.0066 7.36023 14.6921 7.75454 14.2959L10.583 11.4675L9.87589 10.7604L7.04745 13.5888Z"
                            fill="#31343D"
                          />
                          <path
                            d="M4.04297 11.2908L11.114 4.21973L11.8212 4.92685L4.75006 11.9979L4.04297 11.2908Z"
                            fill="#31343D"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_675_10029">
                            <rect width={16} height={16} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <p className="tw-absolute tw-left-6 tw-top-0 tw-text-sm tw-text-left tw-text-[#31343d]">
                        링크추가
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className=" tw-text-white tw-w-[300px] tw-bg-blue-500 tw-mt-5 tw-focus:ring-4  tw-font-medium tw-rounded tw-text-sm tw-px-7 tw-py-3 "
                  >
                    {activeStep === 0 ? '답변입력 및 지식콘텐츠 읽기' : '수정완료 및 답변 제출하기'}
                  </button>
                </div>
              )}

              {activeStep === 1 && (
                <div>
                  <div className="border tw-rounded-lg tw-p-5 tw-my-5">
                    <button
                      type="button"
                      onClick={() => {
                        if (data?.contentType === '0320') {
                          // setKey(data?.contentKey);
                        } else {
                          if (data?.name?.toLowerCase().endsWith('.pdf')) {
                            onFileDownload(data?.contentKey, 'test.pdf');
                          } else {
                            window.open(contentUrl, '_blank');
                          }
                        }
                      }}
                      className=" tw-text-white tw-w-[150px] tw-bg-blue-500 tw-my-8 tw-text-sm  tw-font-medium tw-rounded tw-text-base tw-px-7 tw-py-3 "
                    >
                      아티클 보기
                    </button>
                  </div>
                  <div className="border tw-rounded-lg tw-p-5 tw-mt-14">
                    <div className="tw-text-xl tw-font-bold tw-py-5">오늘의 퀴즈는 알고 있었던 내용이었나요?</div>
                    <FormControl className="tw-py-5">
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={type} // 현재 선택된 값 설정
                        onChange={handleTypeChange} // 라디오 버튼 클릭 이벤트 처리
                        name="radio-buttons-group"
                      >
                        <FormControlLabel value="0001" control={<Radio />} label="처음 들어본 내용이다." />
                        <FormControlLabel value="0002" control={<Radio />} label="들어본 적은 있지만 잘 모른다." />
                        <FormControlLabel
                          value="0003"
                          control={<Radio />}
                          label="적용 경험은 없지만, 원리는 알고 있다."
                        />
                        <FormControlLabel value="0004" control={<Radio />} label="적용 경험이 있고, 설명할 수 있다." />
                        <FormControlLabel value="0005" control={<Radio />} label="세미나에서 설명할 수 있을 것 같다." />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <button
                    type="button"
                    onClick={handleComprehension}
                    className=" tw-text-white tw-w-[300px] tw-bg-blue-500 tw-text-sm tw-mt-5 tw-focus:ring-4  tw-font-medium tw-rounded tw-text-base tw-px-7 tw-py-3 "
                  >
                    읽기완료
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={cx('banner-container__wrap', ' tw-pb-20')}>
            <div className="tw-bg-white tw-border tw-border-gray-200">
              <div className="tw-flex tw-w-full tw-flex-col tw-justify-between tw-px-10 tw-leading-normal"></div>
            </div>
          </div>
        </div>
      </Mobile>

      {/* 최종답변 제출 확인 팝업 */}
      {showSubmitModal && (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
          <div className="tw-bg-white tw-rounded-xl tw-py-20 tw-max-w-3xl tw-w-full tw-mx-4 tw-shadow-2xl">
            <div className="tw-text-center">
              <div className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-4">최종답변을 제출하시겠습니까?</div>
              <div className="tw-text-black tw-mb-8 tw-leading-relaxed tw-text-lg tw-py-20">
                제출된 답변은 퀴즈클럽 교수자님께 전달되며, 이후 피드백을 My학습방에서 확인하실 수 있습니다.
                <br />
                최종답변을 제출한 후, 교수님 및 스터디팀을 받을 수 있습니다.
              </div>
              <div className="tw-flex tw-gap-4 tw-justify-center">
                <button
                  onClick={handleModalClose}
                  className="tw-px-8 tw-py-3 tw-bg-gray-200 tw-text-gray-700 tw-rounded-md tw-font-medium tw-hover:bg-gray-300 tw-transition-colors tw-w-[150px]"
                >
                  취소
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="tw-px-8 tw-py-3 tw-bg-blue-500 tw-text-white tw-rounded-md tw-font-medium tw-hover:bg-blue-600 tw-transition-colors tw-w-[150px]"
                >
                  제출하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 피드백 모달 */}
      <MentorsModal
        isOpen={isFeedbackModalOpen}
        onAfterClose={() => setIsFeedbackModalOpen(false)}
        title="피드백 보기"
        height="80%"
        isProfile={true}
        isContentModalClick={false}
      >
        <div className="pb-6">
          <div className="tw-p-6 border tw-rounded-lg">
            <div>
              <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-mb-3">
                <div className="tw-text-black tw-text-xl tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-bold tw-gap-2">
                  <img src="/assets/images/main/chatbot.png" className="tw-w-12 tw-h-12" />
                  <span className="tw-text-black tw-text-lg tw-font-bold">AI피드백</span>
                </div>
                <div className="tw-text-base tw-font-medium tw-mb-2">
                  AI 피드백 평점 : {aiQuizAnswerDataSavePut?.data?.grading}
                </div>
              </div>

              <div className="tw-mb-4">
                <div className="tw-text-base tw-font-medium tw-mb-2">전체 피드백</div>
                <div className="tw-bg-gray-50 tw-p-4 tw-rounded tw-text-base tw-leading-relaxed">
                  {aiQuizAnswerDataSavePut?.data?.feedback ||
                    '답변이 전체적으로 Kubernetes의 정의와 목적을 잘 설명하고 있습니다. 특히 "컨테이너화된 애플리케이션을 관리하는 핵심 개념을 담고 있다"는 표현이 매우 적절합니다. 예를 들어 다음과 같은 정보가 추가되면 더 완전한 답변이 됩니다.'}
                </div>
              </div>

              <div className="tw-mb-4">
                <div className="tw-text-base tw-font-medium tw-mb-2">개선 포인트</div>
                <div className="tw-space-y-2">
                  {aiQuizAnswerDataSavePut?.data?.improvePoints ? (
                    <div className="tw-flex tw-items-start tw-gap-2">
                      <div className="tw-w-1 tw-h-1 tw-bg-gray-400 tw-rounded-full tw-mt-2 tw-flex-shrink-0"></div>
                      <div className="tw-text-base">{aiQuizAnswerDataSavePut?.data?.improvePoints}</div>
                    </div>
                  ) : null}
                  {aiQuizAnswerDataSavePut?.data?.improveExample && (
                    <div className="tw-mt-3 tw-bg-blue-50 tw-p-3 tw-rounded">
                      <div className="tw-text-base tw-font-medium tw-mb-1 tw-text-blue-700">개선 예시</div>
                      <div className="tw-text-base tw-text-blue-800">{aiQuizAnswerDataSavePut.data.improveExample}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="tw-mb-4">
                <div className="tw-text-base tw-font-medium tw-mb-2">피드백 요약</div>
                <div className="tw-bg-gray-50 tw-p-4 tw-rounded tw-text-base tw-leading-relaxed">
                  {aiQuizAnswerDataSavePut?.data?.summaryFeedback ||
                    '전반적으로 핵심 개념 설명이 부족하며, 구체적 내용과 자신의 이해를 포함하는 답변이 필요합니다.'}
                </div>
              </div>

              {aiQuizAnswerDataSavePut?.data && (
                <div>
                  <div className="tw-text-base tw-font-medium tw-mb-2">추가 학습 자료</div>
                  {aiQuizAnswerDataSavePut?.data?.additionalResources?.length > 0 ? (
                    <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded tw-p-4">
                      <div className="tw-space-y-3">
                        {aiQuizAnswerDataSavePut?.data?.additionalResources?.map((resource, index) => (
                          <div key={index} className="tw-flex tw-items-start tw-gap-2">
                            <div className="tw-w-1.5 tw-h-1.5 tw-bg-blue-500 tw-rounded-full tw-mt-2 tw-flex-shrink-0"></div>
                            <div className="tw-text-base">
                              <div className="tw-font-medium tw-text-blue-800 tw-mb-1">{resource.title}</div>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tw-text-blue-600 tw-underline tw-text-sm tw-break-all"
                              >
                                {resource.url}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="tw-text-gray-500 tw-text-sm">추가 학습 자료가 없습니다.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </MentorsModal>

      {showSubmitAnswerModal && (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
          <div className="tw-bg-white tw-rounded-xl tw-py-20 tw-max-w-3xl tw-w-full tw-mx-4 tw-shadow-2xl">
            <div className="tw-text-center">
              <div className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-4">답변이 제출되었습니다.</div>
              <div className="tw-text-black tw-mb-8 tw-leading-relaxed tw-text-lg tw-py-20">
                제출한 퀴즈답변에 대한 AI피드백을 받을 수 있습니다.
                <br />
                AI피드백을 받으러 갈까요?
              </div>
              <div className="tw-flex tw-gap-4 tw-justify-center">
                <button
                  onClick={handleModalClose2}
                  className="tw-px-8 tw-py-3 tw-bg-gray-200 tw-text-gray-700 tw-rounded-md tw-font-medium tw-hover:bg-gray-300 tw-transition-colors tw-w-[180px]"
                >
                  닫기
                </button>
                <button
                  onClick={handleFinalSubmit2}
                  className="tw-px-8 tw-py-3 tw-bg-blue-500 tw-text-white tw-rounded-md tw-font-medium tw-hover:bg-blue-600 tw-transition-colors tw-w-[180px]"
                >
                  {isLoadingAI ? 'AI피드백 채점 중...' : 'AI피드백 받기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default quizSolutionDetail;
