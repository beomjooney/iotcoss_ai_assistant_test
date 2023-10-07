import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Image from 'next/image';
import { Typography } from '../index';
import { Desktop } from 'src/hooks/mediaQuery';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useEffect, useState } from 'react';
import {
  useAnswerSave,
  useAnswerUpdate,
  useComprehensionSave,
  useDeleteLike,
  useDeleteReply,
  useSaveLike,
  useSaveReply,
} from 'src/services/community/community.mutations';
import { useSessionStore } from 'src/store/session';
const { logged } = useSessionStore.getState();
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import React from 'react';
/** import stepper */
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import styled from '@emotion/styled';
import MuiTabs from '@material-ui/core/Tabs';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import router from 'next/router';
import Avatar from '@mui/material/Avatar';

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

export interface BannerProps {
  /** 배경 이미지 */
  imageName?: string;
  /** 제목 */
  title: string;
  /** 클래스 */
  data: object;
  className?: string;
  subTitle?: string;
  quizStatus: object;
}

const cx = classNames.bind(styles);
// const Banner = ({ imageName = 'top_banner_seminar.jpg', title, subTitle, className }: BannerProps) => {
const quizSolutionDetail = ({
  imageName = 'seminar_bg.png',
  title,
  subTitle,
  className,
  data,
  quizStatus,
}: BannerProps) => {
  const steps = ['Step1. 답변 입력', 'Step2. 아티클 읽기', 'Step3. 답변 수정(선택)'];

  let [isLiked, setIsLiked] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [type, setType] = React.useState('0001'); // 초기값 설정
  const [introductionMessage, setIntroductionMessage] = useState<string>('');

  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();
  const { mutate: onAnswerSave, isSuccess: isAnswerSave } = useAnswerSave();
  const { mutate: onAnswerUpdate, isSuccess: isAnswerUpdate } = useAnswerUpdate();
  const { mutate: onComprehensionSave, isSuccess: isComprehensionSave } = useComprehensionSave();

  console.log('status', quizStatus);

  useEffect(() => {
    if (quizStatus?.answerStatus === '0001') {
      setIntroductionMessage(quizStatus?.preAnswer);
      setActiveStep(1);
    } else if (quizStatus?.answerStatus === '0002') {
      setIntroductionMessage(quizStatus?.preAnswer);
      setActiveStep(2);
    }
  }, [quizStatus]);

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleTypeChange = event => {
    setType(event.target.value); // 라디오 버튼의 값을 상태에 업데이트
    console.log(event.target.value);
  };

  useEffect(() => {
    setIsLiked(data?.isFavorite);
  }, [data]);

  const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setIntroductionMessage(value);
  };

  const handleNext = () => {
    if (introductionMessage === '') {
      alert('답변을 입력해주세요.');
      return;
    }
    if (activeStep === 0) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
      onAnswerSave({
        data: {
          clubQuizSequence: data?.clubQuizSequence,
          preAnswer: introductionMessage,
        },
      });
    }
    if (activeStep === 2) {
      onAnswerUpdate({
        data: {
          clubQuizSequence: data?.clubQuizSequence,
          postAnswer: introductionMessage,
        },
      });

      // router.push(`/quiz/growth/${data?.clubSequence}`);
      router.push(
        {
          pathname: `/quiz/growth/${data?.clubSequence}`,
          query: { qid: data?.clubQuizSequence },
        },
        `/quiz/growth/${data?.clubSequence}`,
      );
    }
  };

  const handleComprehension = () => {
    onComprehensionSave({
      data: {
        clubQuizSequence: data?.clubQuizSequence,
        comprehensionStatus: type,
      },
    });
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };
  return (
    <div className={cx('content-area', className, 'tw-bg-gray-100')}>
      <div className="container tw-p-40 tw-leading-normal tw-text-black tw-text-xl tw-pt-10 tw-pb-10">
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
              {data?.recommendJobGroupNames?.map((name, i) => (
                <span
                  key={i}
                  className="tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded"
                >
                  {name}
                </span>
              ))}
              {data?.recommendLevels.map((name, i) => (
                <span
                  key={i}
                  className="tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded "
                >
                  {name} 레벨
                </span>
              ))}
              {data?.recommendJobNames.map((name, i) => (
                <span
                  className="tw-bg-gray-300 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded "
                  key={i}
                >
                  {name}
                </span>
              ))}
            </div>
          </Grid>
          <Grid item xs={2} className="tw-text-base tw-font-semibold  tw-text-left">
            <div>{data?.activeCount}명 참가 완료</div>
          </Grid>
        </Grid>

        <div className="tw-mt-10 tw-bg-white tw-rounded-3xl tw-h-full tw-p-10 tw-text-center">
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
                <img className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full" src={data?.clubLeaderProfileImageUrl} alt="" />
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
              <button
                type="button"
                onClick={handleNext}
                className=" tw-text-white tw-w-[300px] tw-bg-blue-500 tw-mt-5 tw-focus:ring-4  tw-font-medium tw-rounded tw-text-sm tw-px-7 tw-py-3 "
              >
                {activeStep === 0 ? '답변입력 및 아티클 읽기' : '수정완료 및 답변 제출하기'}
              </button>
            </div>
          )}

          {activeStep === 1 && (
            <div>
              {/* <iframe
                className="border tw-rounded-lg"
                width="100%"
                height="600px"
                src={data?.articleUrl}
                title="YouTube video player"
                allow="accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture"
              ></iframe> */}
              <div className="border tw-rounded-lg tw-p-5 tw-my-5">
                <button
                  type="button"
                  onClick={() => {
                    window.open(data?.articleUrl, '_blank'); // data?.articleUrl을 새 탭으로 열기
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
                    <FormControlLabel value="0003" control={<Radio />} label="적용 경험은 없지만, 원리는 알고 있다." />
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
        {/*todo url 경로에 따라 자동 셋팅 구현*/}
        <div className="tw-bg-white tw-border tw-border-gray-200">
          <div className="tw-flex tw-w-full tw-flex-col tw-justify-between tw-px-10 tw-leading-normal"></div>
        </div>
      </div>
    </div>
  );
};

export default quizSolutionDetail;
