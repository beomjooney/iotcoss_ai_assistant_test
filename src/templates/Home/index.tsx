import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useContentJobTypes, useContentTypes, useJobGroups, useJobGroupss } from 'src/services/code/code.queries';
import { useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../store/session';
import Grid from '@mui/material/Grid';
import { User } from 'src/models/user';
import ChatbotModal from 'src/stories/components/ChatBot';

/** date picker */
import React from 'react';

const cx = classNames.bind(styles);
export interface HomeProps {
  logged: boolean;
  // hasUserResumeStory: boolean;
  // userType: any; // 0001 멘티
}

export function HomeTemplate({ logged = false }: HomeProps) {
  const router = useRouter();
  // const { jobGroups, setJobGroups } = useStore();
  const { token } = useSessionStore.getState();
  /** get profile */
  // const { user, setUser } = useStore();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openChatbot = () => {
    const width = 450;
    const height = 700;
    const left = window.screen.width - width;
    const top = window.screen.height - height;

    window.open(
      'http://3.39.99.82:9998/aichatbot',
      'Chatbot',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
    );
  };
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
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation={15} result="effect1_foregroundBlur_320_40043" />
              </filter>
              <radialGradient
                id="paint0_radial_320_40043"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(390.5 390.5) rotate(90) scale(292.5)"
              >
                <stop stopColor="#FAFFC5" stopOpacity="0.5" />
                <stop offset={1} stopColor="white" stopOpacity={0} />
              </radialGradient>
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
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation={15} result="effect1_foregroundBlur_320_40044" />
              </filter>
              <radialGradient
                id="paint0_radial_320_400044"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(441 -29) rotate(90) scale(333.474)"
              >
                <stop stopColor="#AEC5FF" />
                <stop offset={1} stopColor="white" stoppacity={0} />
              </radialGradient>
            </defs>
          </svg>
          <div className="tw-w-[1280px] tw-h-[591px] tw-absolute tw-left-[-1px] tw-top-[-30px] tw-bg-white/20" />
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
            <div className="tw-absolute tw-left-[285px] tw-top-[385px] tw-text-lg tw-text-left tw-text-white">
              <div className="tw-flex tw-items-center">
                <img className=" tw-rounded-full tw-w-12 tw-h-12" src="/assets/images/main/teacher1.png" />
                <div className="tw-ml-4">
                  <span className="tw-text-lg tw-font-bold tw-text-left tw-text-white">교수자</span>
                  <br />
                  <span className="tw-text-lg tw-font-medium tw-text-left tw-text-white">체험하기</span>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-w-48 tw-h-20">
            <div className="tw-w-48 tw-h-20">
              <div className="tw-w-48 tw-h-20 tw-absolute tw-left-[46.5px] tw-top-[373.5px] tw-rounded-lg tw-bg-[#7ed869]" />
              <div className="tw-absolute tw-left-[70px] tw-top-[385px] tw-text-lg tw-text-left tw-text-white">
                <div className="tw-flex tw-items-center">
                  <img className=" tw-rounded-full tw-w-12 tw-h-12" src="/assets/images/main/teacher2.png" />
                  <div className="tw-ml-4">
                    <span className="tw-text-lg tw-font-bold tw-text-left tw-text-white">학습자</span>
                    <br />
                    <span className="tw-text-lg tw-font-medium tw-text-left tw-text-white">체험하기</span>
                  </div>
                </div>
              </div>
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
        <div className="tw-w-[1120px] tw-h-[392px] tw-flex tw-gap-10">
          <div
            className="tw-w-[544px] tw-h-[392px] tw-overflow-hidden tw-rounded-[20px]"
            style={{ filter: 'drop-shadow(-12px 13px 40px rgba(0,0,0,0.03))' }}
          >
            <div className="tw-w-[544px] tw-h-[496px] tw-absolute tw-left-[-1px] tw-top-[-1px] tw-bg-white" />
            <p className="tw-w-[352px] tw-absolute tw-left-24 tw-top-[218px] tw-text-xl tw-font-bold tw-text-center tw-text-black">
              동서대 재학생 여러분!
            </p>
            <p className="tw-w-[352px] tw-absolute tw-left-24 tw-top-[268px] tw-text-base tw-text-center tw-text-black">
              <span className="tw-w-[352px] tw-text-base tw-text-center tw-text-black">
                선배님과 교수님이 엄선한 지식을 공부하세요.
              </span>
              <br />
              <span className="tw-w-[352px] tw-text-base tw-text-center tw-text-black">
                퀴즈로 뇌를 깨우고, 엄선된 콘텐츠를 보면서
              </span>
              <br />
              <span className="tw-w-[352px] tw-text-base tw-text-center tw-text-black">
                최고의 인재로 성장할 수 있어요!
              </span>
            </p>
            <img
              src="/assets/images/main/user-interaction-1.png"
              className="tw-w-[190px] tw-h-[190px] tw-absolute tw-left-44 tw-top-[27px] tw-object-cover"
            />
          </div>
          <div
            className="tw-w-[544px] tw-h-[392px] tw-overflow-hidden tw-rounded-[20px]"
            style={{ filter: 'drop-shadow(-12px 13px 40px rgba(0,0,0,0.03))' }}
          >
            <div className="tw-w-[544px] tw-h-[496px] tw-absolute tw-left-[-1px] tw-top-[-1px] tw-bg-white" />
            <p className="tw-w-[352px] tw-absolute tw-left-24 tw-top-[219px] tw-text-xl tw-font-bold tw-text-center tw-text-black">
              동서대 선배님! 교수님!
            </p>
            <p className="tw-w-[352px] tw-absolute tw-left-24 tw-top-[269px] tw-text-base tw-text-center tw-text-black">
              <span className="tw-w-[352px] tw-text-base tw-text-center tw-text-black">
                후배들이 기다리고 있습니다.
              </span>
              <br />
              <span className="tw-w-[352px] tw-text-base tw-text-center tw-text-black">
                함께 활동하면서 자연스럽게 친분을 쌓고,{' '}
              </span>
              <br />
              <span className="tw-w-[352px] tw-text-base tw-text-center tw-text-black">
                선배님의 지식을 전수해주세요!
              </span>
            </p>
            <img
              src="/assets/images/main/branding-badge-1.png"
              className="tw-w-[161px] tw-h-[161px] tw-absolute tw-left-[191px] tw-top-[34px] tw-object-cover"
            />
          </div>
        </div>
      </div>

      <div className={cx('main-container tw-flex tw-justify-center tw-items-center tw-pt-12')}>
        <div
          className="tw-w-[1120px] tw-h-[400px] tw-relative tw-overflow-hidden"
          style={{
            backgroundImage: 'url(/assets/images/main/background.png)',
            backgroundPosition: 'center',
            borderRadius: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.0)',
          }}
        >
          <div className="tw-w-[497.13px] tw-h-[213px]">
            <div className="tw-w-[550px] tw-left-[528.87px] tw-top-[250px] tw-absolute tw-text-right tw-text-black tw-text-base tw-font-medium tw-leading-normal tw-font-['Inter']">
              동서대 출신 상위 1% 선배들이 모교와 후배를 위하여 힘을 보탭니다.
              <br />
              실무보다 좋은 수업은 없습니다. 각 분야에 진출한 동서대 최고의 선배들의
              <br />
              경험이 녹아 있는 생생한 퀴즈를 풀면서 함께 성장해보세요.
            </div>
            <p className="tw-w-[146.77px] tw-absolute tw-left-[928.36px] tw-top-[118px] tw-text-base tw-font-bold tw-text-right tw-text-black">
              Dongseo University
            </p>
            <p className="tw-w-[497px] tw-absolute tw-left-[578px] tw-top-[139px] tw-text-[32px] tw-text-right tw-text-black">
              <span className="tw-w-[497px] tw-text-[32px] tw-font-bold tw-text-right tw-text-black">Before</span>
              <span className="tw-w-[497px] tw-text-[32px] tw-text-right tw-text-black"> Dongseo </span>
              <span className="tw-w-[497px] tw-text-[32px] tw-font-bold tw-text-right tw-text-black">After</span>
              <span className="tw-w-[497px] tw-text-[32px] tw-text-right tw-text-black"> Dongseo</span>
            </p>
            <div className="tw-w-[79px] tw-h-[3px] tw-absolute tw-left-[860.5px] tw-top-[193.5px] tw-bg-[#e11837]" />
            <div className="tw-w-[103px] tw-h-[3px] tw-absolute tw-left-[617.5px] tw-top-[193.5px] tw-bg-[#e11837]" />
          </div>
          <img
            src="/assets/images/main/dsu_1.png"
            className="tw-w-[404px] tw-h-[404px] tw-absolute tw-left-[50px] tw-top-[-4px] tw-object-cover"
          />
        </div>
        {!modalIsOpen && (
          <div>
            <div
              className="tw-fixed tw-bottom-0 tw-right-0 tw-w-16 tw-h-16 tw-mr-10 tw-mb-8 tw-cursor-pointer tw-z-10"
              onClick={() => setModalIsOpen(true)}
            >
              <img src="/assets/images/main/chatbot.png" />
            </div>
          </div>
        )}
        <ChatbotModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} token={token} />
      </div>
    </div>
  );
}

export default HomeTemplate;
