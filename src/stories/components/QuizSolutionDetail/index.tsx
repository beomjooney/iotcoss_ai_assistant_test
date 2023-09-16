import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Image from 'next/image';
import { Typography } from '../index';
import { Desktop } from 'src/hooks/mediaQuery';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useEffect, useState } from 'react';
import { useDeleteLike, useDeleteReply, useSaveLike, useSaveReply } from 'src/services/community/community.mutations';
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
}

const cx = classNames.bind(styles);
// const Banner = ({ imageName = 'top_banner_seminar.jpg', title, subTitle, className }: BannerProps) => {
const BannerDetail = ({ imageName = 'seminar_bg.png', title, subTitle, className, data }: BannerProps) => {
  const steps = ['Step1. 답변 입력', 'Step2. 아티클 읽기', 'Step3. 답변 수정(선택)'];

  let [isLiked, setIsLiked] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();

  const isStepOptional = (step: number) => {
    return step === 1 || step === 2 || step === 3;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  useEffect(() => {
    setIsLiked(data?.isFavorite);
  }, [data]);

  const onChangeLike = function (postNo: number) {
    event.preventDefault();
    if (logged) {
      setIsLiked(!isLiked);
      if (isLiked) {
        onDeleteLike(postNo);
      } else {
        onSaveLike(postNo);
      }
    } else {
      alert('로그인 후 좋아요를 클릭 할 수 있습니다.');
    }
  };
  return (
    <div className={cx('content-area', className, 'tw-bg-gray-100')}>
      <div className="container tw-p-52 tw-leading-normal tw-text-black tw-text-xl tw-pt-10 tw-pb-10">
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
              {data?.recommendJobGroupNames.map((name, i) => (
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
            minRows={9}
            placeholder="답변을 25자 이상 입력해주세요."
            style={{
              width: '100%',
              backgroundColor: '#f8f9fa',
              border: '0px solid #B0B7C1',
              borderRadius: '15px',
              padding: 12,
              resize: 'none',
            }}
            name="introductionMessage"
            // onChange={onMessageChange}
            // value={introductionMessage}
          />
          <button
            type="button"
            className=" tw-text-white tw-bg-gray-300 tw-mt-5 tw-focus:ring-4  tw-font-medium tw-rounded tw-text-base tw-px-7 tw-py-3 "
          >
            답변입력 및 아티클 읽기
          </button>
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

export default BannerDetail;
