import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../store/session';
import ChatbotModal from 'src/stories/components/ChatBot';
import ProfessorExpModal from 'src/stories/components/ProfessorExp';
import { useColorPresets } from 'src/utils/use-theme-color';
import { useColorPresetName } from 'src/utils/use-theme-color';
import { usePresets } from 'src/utils/color-presets';
import { setCookie } from 'cookies-next';
/** date picker */
import React from 'react';

const cx = classNames.bind(styles);
export interface HomeProps {
  logged: boolean;
  tenantName: string;
}

export function HomeTemplate({ logged = false, tenantName = '' }: HomeProps) {
  const router = useRouter();
  const { token, roles } = useSessionStore.getState();
  const COLOR_PRESETS = usePresets();
  const { setColorPresetName } = useColorPresetName();
  const { setColorPresets } = useColorPresets();
  const [isClient, setIsClient] = useState(false); // 클라이언트 사이드에서만 렌어링하도록 상태 추가

  useEffect(() => {
    setIsClient(true); // 클라이언트 사이드에서 상태를 true로 설정
    if (!COLOR_PRESETS || COLOR_PRESETS.length === 0) return;

    const preset = COLOR_PRESETS.find(preset => preset.name === tenantName) || COLOR_PRESETS[0];
    setColorPresetName(preset.name);
    setColorPresets(preset.colors);
  }, []);

  const [modalIsProfessor, setModalIsProfessor] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className={cx('career-main')}>
      <section
        className={cx(
          'top-banner',
          'hero-section',
          'hero-section-3',
          'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center',
        )}
      >
        <div
          className="tw-w-full md:tw-w-[1120px] tw-h-[320px] md:tw-h-[520px] tw-relative tw-overflow-hidden tw-rounded-[20px]"
          style={{
            background:
              'linear-gradient(to right, rgba(254,226,255,0.59) 0%, rgba(207,238,255,0.59) 64.58%, rgba(186,251,255,0.59) 100%)',
          }}
        >
          <svg
            width={278}
            height={212}
            viewBox="0 0 478 412"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="tw-absolute tw-left-[calc(50%-139px)] md:tw-left-[671px] tw-top-[60px] md:tw-top-[137px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* SVG Content */}
          </svg>
          <svg
            width={418}
            height={212}
            viewBox="0 0 718 412"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="tw-absolute tw-left-[calc(50%-209px)] md:tw-left-[431px] tw-top-[-241px] md:tw-top-[-441px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* SVG Content */}
          </svg>
          <div className="tw-w-full md:tw-w-[1280px] tw-h-[391px] tw-absolute tw-left-0 md:tw-left-[-1px] tw-top-0 md:tw-top-[-30px] tw-bg-white/20" />
          <p className="tw-absolute tw-left-[24px] tw-top-[40px] md:tw-left-[57px] md:tw-top-[95px] tw-text-sm tw-font-medium tw-text-left tw-text-black">
            Dongseo University
          </p>
          <p className="tw-absolute tw-left-[24px] tw-top-[60px] md:tw-left-[57px] md:tw-top-[116px] tw-text-xl md:tw-text-[32px] tw-text-left tw-text-black">
            <span className="tw-text-xl md:tw-text-[32px] tw-text-left tw-text-black">MY </span>
            <span className="tw-text-xl md:tw-text-[32px] tw-font-bold tw-text-left tw-text-black">BRIGHT</span>
            <span className="tw-text-xl md:tw-text-[32px] tw-text-left tw-text-black"> FUTURE</span>
          </p>
          <div className="tw-w-[48px] md:tw-w-[81px] tw-h-[2px] md:tw-h-[3px] tw-absolute tw-left-[60px] md:tw-left-[139px] tw-top-[90px] md:tw-top-[177px] tw-bg-[#e11837]" />
          <p className="tw-absolute tw-left-[24px] tw-top-[110px] md:tw-left-[57px] md:tw-top-[209px] tw-text-sm md:tw-text-base tw-font-medium tw-text-left tw-text-black">
            각 분야의 전문가들이 메이커로서 핵심 질문과 아티클을 답으로 제시합니다.
            <br />
            관리자는 클럽을 만들고 학습자들이 함께 풀 문제를 엄선합니다.
            <br />
            학습자는 관리자만 따라가면 대한민국 최고의 전문가로 성장할 수 있습니다.
          </p>
          <div
            onClick={() => {
              console.log(modalIsProfessor);
              const role = roles?.includes('ROLE_ADMIN') || roles?.includes('ROLE_MANAGER') ? 'professor' : 'student';
              if (logged) {
                if (role === 'professor') {
                  setModalIsProfessor(true);
                } else {
                  alert('교수자만 접근할 수 있는 페이지입니다.');
                }
              } else {
                alert('로그인 후 이용해주세요.');
              }
            }}
            className=" tw-cursor-pointer tw-w-36 md:tw-w-48 tw-h-12 md:tw-h-20"
          >
            {/* <div className=" tw-bg-[#478af5] tw-w-36 md:tw-w-48 tw-h-12 md:tw-h-20 tw-absolute tw-left-[170px] md:tw-left-[261.38px] tw-top-[210px] md:tw-top-[373.5px] tw-rounded-lg " /> */}
            <div className="tw-bg-primary tw-w-36 md:tw-w-48 tw-h-12 md:tw-h-20 tw-absolute tw-left-[170px] md:tw-left-[261.38px] tw-top-[210px] md:tw-top-[373.5px] tw-rounded-lg " />
            <div className="tw-absolute tw-left-[185px] md:tw-left-[285px] tw-top-[217px] md:tw-top-[385px] tw-text-xs md:tw-text-lg tw-text-left tw-text-white">
              <div className="tw-flex tw-items-center">
                <img
                  className=" tw-rounded-full tw-w-8 md:tw-w-12 tw-h-8 md:tw-h-12"
                  src="/assets/images/main/teacher1.png"
                />
                <div className="tw-ml-2 md:tw-ml-4">
                  <span className="tw-text-xs md:tw-text-lg tw-font-bold tw-text-left tw-text-white">교수자</span>
                  <br />
                  <span className="tw-text-xs md:tw-text-lg tw-font-medium tw-text-left tw-text-white">체험하기</span>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              router.push('/quiz');
            }}
            className="tw-cursor-pointer tw-w-36 md:tw-w-48 tw-h-12 md:tw-h-20"
          >
            <div className="tw-w-36 md:tw-w-48 tw-h-12 md:tw-h-20 tw-absolute tw-left-[24px] md:tw-left-[46.5px] tw-top-[210px] md:tw-top-[373.5px] tw-rounded-lg tw-bg-[#7ed869]" />
            <div className="tw-absolute tw-left-[44px] md:tw-left-[70px] tw-top-[217px] md:tw-top-[385px] tw-text-xs md:tw-text-lg tw-text-left tw-text-white">
              <div className="tw-flex tw-items-center">
                <img
                  className=" tw-rounded-full tw-w-8 md:tw-w-12 tw-h-8 md:tw-h-12"
                  src="/assets/images/main/teacher2.png"
                />
                <div className="tw-ml-2 md:tw-ml-4">
                  <span className="tw-text-xs md:tw-text-lg tw-font-bold tw-text-left tw-text-white">학습자</span>
                  <br />
                  <span className="tw-text-xs md:tw-text-lg tw-font-medium tw-text-left tw-text-white">체험하기</span>
                </div>
              </div>
            </div>
          </div>
          <img
            className="tw-hidden lg:tw-block tw-w-[180px] md:tw-w-[314px] tw-h-[240px] md:tw-h-[533px] tw-absolute tw-left-[calc(50%-90px)] md:tw-left-[769px] tw-top-[100px] md:tw-top-[43px]"
            src="/assets/images/main/image_2.png"
          />
          <img
            src="/assets/images/main/image_1.png"
            className="tw-hidden lg:tw-block tw-w-[200px] md:tw-w-[406px] tw-h-[240px] md:tw-h-[479px] tw-absolute tw-left-[calc(50%-100px)] md:tw-left-[582px] tw-top-[100px] md:tw-top-[43px] tw-object-cover"
          />
        </div>
      </section>

      <div
        className={cx('main-container tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-pt-12')}
      >
        <div className="tw-w-full md:tw-w-[1120px] tw-flex tw-flex-col md:tw-flex-row tw-gap-4 md:tw-gap-10">
          <div
            className="tw-w-full md:tw-w-[544px] tw-h-[292px] md:tw-h-[392px] tw-overflow-hidden tw-rounded-[20px] tw-m-1 md:tw-m-0"
            style={{ filter: 'drop-shadow(-12px 13px 40px rgba(0,0,0,0.03))' }}
          >
            <div className="tw-w-full md:tw-w-[544px] tw-h-[296px] md:tw-h-[400px] tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-white">
              <img
                src="/assets/images/main/user-interaction-1.png"
                className="tw-w-[120px] md:tw-w-[190px] tw-h-[120px] md:tw-h-[190px] tw-object-cover"
              />
              <p className="tw-w-[352px] tw-text-xl md:tw-text-xl tw-font-bold tw-text-center tw-text-black tw-mt-4 md:tw-mt-6">
                동서대 재학생 여러분!
              </p>
              <p className="tw-w-[352px] tw-text-base md:tw-text-base tw-text-center tw-text-black tw-mt-2 md:tw-mt-4">
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
            </div>
          </div>

          <div
            className="tw-w-full md:tw-w-[544px] tw-h-[292px] md:tw-h-[392px] tw-overflow-hidden tw-rounded-[20px]"
            style={{ filter: 'drop-shadow(-12px 13px 40px rgba(0,0,0,0.03))' }}
          >
            <div className="tw-w-full md:tw-w-[544px] tw-h-[296px] md:tw-h-[400px] tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-white">
              <img
                src="/assets/images/main/branding-badge-1.png"
                className="tw-w-[120px] md:tw-w-[190px] tw-h-[120px] md:tw-h-[190px] tw-object-cover"
              />
              <p className="tw-w-[352px] 6 md:tw-left-24  md:tw-top-[219px] tw-text-xl md:tw-text-xl tw-font-bold tw-text-center tw-text-black">
                동서대 선배님! 교수님!
              </p>
              <p className="tw-w-[352px] md:tw-left-24 tw-text-base md:tw-text-base tw-text-center tw-text-black">
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
            </div>
          </div>
        </div>
      </div>

      <div
        className={cx('main-container tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-pt-12')}
      >
        <div
          className="tw-w-full md:tw-w-[1120px] tw-h-[400px] md:tw-h-[400px] tw-relative tw-overflow-hidden"
          style={{
            backgroundImage: 'url(/assets/images/main/background.png)',
            backgroundPosition: 'center',
            borderRadius: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="tw-w-[250px] md:tw-w-[497.13px] tw-h-[113px]  md:tw-h-[213px]">
            <div className="tw-w-[300px] md:tw-w-[550px] tw-left-[calc(50%-150px)] md:tw-left-[528.87px] tw-top-[240px] md:tw-top-[250px] tw-absolute tw-text-center md:tw-text-right tw-text-black tw-text-base md:tw-text-base tw-font-medium tw-leading-normal tw-font-['Inter']">
              동서대 출신 상위 1% 선배들이 모교와 후배를 위하여 힘을 보탭니다.
              <br />
              실무보다 좋은 수업은 없습니다. 각 분야에 진출한 동서대 최고의 선배들의
              <br />
              경험이 녹아 있는 생생한 퀴즈를 풀면서 함께 성장해보세요.
            </div>
            <p className="tw-w-[120px] md:tw-w-[146.77px] tw-absolute tw-left-[calc(50%-60px)] md:tw-left-[928.36px] tw-top-[75px] md:tw-top-[108px] tw-text-xs md:tw-text-base tw-font-bold tw-text-center md:tw-text-right tw-text-black">
              Dongseo University
            </p>
            <p className="tw-w-[300px] md:tw-w-[497px] tw-absolute tw-left-[calc(50%-150px)] md:tw-left-[578px] tw-top-[200px] md:tw-top-[139px] tw-text-lg md:tw-text-[32px] tw-text-center md:tw-text-right tw-text-black">
              <span className="tw-w-[300px] md:tw-w-[497px] tw-text-lg md:tw-text-[32px] tw-font-bold tw-text-center md:tw-text-right tw-text-black">
                Before
              </span>
              <span className="tw-w-[300px] md:tw-w-[497px] tw-text-lg md:tw-text-[32px] tw-text-center md:tw-text-right tw-text-black">
                {' '}
                Dongseo{' '}
              </span>
              <span className="tw-w-[300px] md:tw-w-[497px] tw-text-lg md:tw-text-[32px] tw-font-bold tw-text-center md:tw-text-right tw-text-black">
                After
              </span>
              <span className="tw-w-[300px] md:tw-w-[497px] tw-text-lg md:tw-text-[32px] tw-text-center md:tw-text-right tw-text-black">
                {' '}
                Dongseo
              </span>
            </p>
            <div className="tw-w-[60px] md:tw-w-[79px] tw-h-[2px] md:tw-h-[3px] tw-absolute tw-left-[calc(50%-30px)] md:tw-left-[855.5px] tw-top-[120px] md:tw-top-[193.5px] tw-bg-[#e11837]" />
            <div className="tw-w-[80px] md:tw-w-[103px] tw-h-[2px] md:tw-h-[3px] tw-absolute tw-left-[calc(50%-40px)] md:tw-left-[603.5px] tw-top-[120px] md:tw-top-[193.5px] tw-bg-[#e11837]" />
          </div>
          <img
            src="/assets/images/main/dsu_1.png"
            className="tw-w-[200px] md:tw-w-[404px] tw-h-[200px] md:tw-h-[404px] tw-absolute tw-left-[calc(50%-100px)] md:tw-left-[50px] tw-top-[-4px] tw-object-cover"
          />
        </div>

        {isClient && modalIsProfessor && (
          <ProfessorExpModal
            title="교수자 체험하기"
            isOpen={modalIsProfessor}
            onRequestClose={() => setModalIsProfessor(false)}
          />
        )}
      </div>
    </div>
  );
}

export default HomeTemplate;
