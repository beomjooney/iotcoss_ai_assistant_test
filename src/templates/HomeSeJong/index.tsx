import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../store/session';
import ChatbotModal from 'src/stories/components/ChatBot';
import ProfessorExpModal from 'src/stories/components/ProfessorExp';

/** date picker */
import React from 'react';

const cx = classNames.bind(styles);
export interface HomeSejongProps {
  logged: boolean;
  tenantName: string;
}

export function HomeSejongTemplate({ logged = false, tenantName = '' }: HomeSejongProps) {
  const router = useRouter();
  const { token } = useSessionStore.getState();

  const [isClient, setIsClient] = useState(false); // 클라이언트 사이드에서만 렌어링하도록 상태 추가
  useEffect(() => {
    setIsClient(true); // 클라이언트 사이드에서 상태를 true로 설정
  }, []);

  const [modalIsProfessor, setModalIsProfessor] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className={cx('career-main')}>
      <div
        className="tw-mt-4 tw-text-white tw-bg-[url('/assets/images/main/Union.webp')]  tw-bg-cover tw-bg-center tw-bg-no-repeat"
        style={{ height: '650px' }}
      >
        <section
          className={cx(
            'top-banner',
            'hero-section',
            'hero-section-3',
            'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center',
          )}
        >
          <div className="tw-w-full md:tw-w-[1120px] tw-h-[320px] md:tw-h-[520px] tw-relative tw-overflow-hidden tw-rounded-[20px]">
            <div className="tw-w-full md:tw-w-[1280px] tw-h-[391px] tw-absolute tw-left-0 md:tw-left-[-1px] tw-top-0" />
            <p className="tw-absolute tw-top-[60px] md:tw-top-[116px] tw-text-xl md:tw-text-[32px] tw-text-left">
              <span className="tw-text-[40px] tw-font-bold tw-text-left">IoT, 더 나은 세상을 위한 연결 </span>
            </p>
            <p className="tw-absolute  tw-top-[100px] md:tw-top-[180px] tw-text-lg md:tw-text-lg tw-font-medium tw-text-left">
              IoT Convergence Open Sharing System & DevUs
            </p>
            <div
              onClick={() => {
                console.log(modalIsProfessor);
                setModalIsProfessor(true);
              }}
              className=" tw-cursor-pointer tw-w-36 md:tw-w-48 tw-h-12 md:tw-h-20"
            >
              <div className="tw-bg-white/10 tw-backdrop-blur-[20px] border tw-px-3 tw-py-3 tw-rounded-lg tw-absolute tw-left-[105px] md:tw-left-[250px] tw-top-[217px] md:tw-top-[285px] tw-text-xs md:tw-text-lg tw-text-left tw-text-white">
                <div className="tw-flex tw-items-center">
                  <img
                    className=" tw-rounded-full tw-w-8 md:tw-w-12 tw-h-8 md:tw-h-12"
                    src="/assets/images/main/man.png"
                  />
                  <div className="tw-flex tw-items-center  tw-gap-3">
                    <div className="tw-ml-2 md:tw-ml-4">
                      <span className="tw-text-xs md:tw-text-lg tw-font-bold tw-text-left tw-text-white">DevUs</span>
                      <br />
                      <span className="tw-text-xs md:tw-text-base tw-font-medium tw-text-left tw-text-white">
                        학습자 체험하기
                      </span>
                    </div>
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 relative"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M16.4666 11.6552L9.25464 4.44319L7.55664 6.13879L13.0766 11.6552L7.55664 17.1704L9.25344 18.8672L16.4666 11.6552Z"
                        fill="#9CA5B2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                router.push('/lecture');
              }}
              className="tw-cursor-pointer tw-w-36 md:tw-w-48 tw-h-12 md:tw-h-20"
            >
              <div className="tw-bg-white/10 tw-backdrop-blur-[20px] border tw-px-3 tw-py-3 tw-rounded-lg tw-absolute  tw-top-[217px] md:tw-top-[285px] tw-text-xs md:tw-text-lg tw-text-left tw-text-white">
                <div className="tw-flex tw-items-center">
                  <img
                    className=" tw-rounded-full tw-w-8 md:tw-w-12 tw-h-8 md:tw-h-12"
                    src="/assets/images/main/girl.png"
                  />
                  <div className="tw-flex tw-items-center tw-gap-3">
                    <div className="tw-ml-2 md:tw-ml-4">
                      <span className="tw-text-xs md:tw-text-lg tw-font-bold tw-text-left tw-text-white">DevUs</span>
                      <br />
                      <span className="tw-text-xs md:tw-text-base tw-font-medium tw-text-left tw-text-white">
                        교수자 체험하기
                      </span>
                    </div>
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 relative"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M16.4666 11.6552L9.25464 4.44319L7.55664 6.13879L13.0766 11.6552L7.55664 17.1704L9.25344 18.8672L16.4666 11.6552Z"
                        fill="#9CA5B2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section
        className={cx(
          'top-banner',
          'hero-section',
          'hero-section-3',
          'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center',
        )}
      >
        <div className="tw-w-full md:tw-w-[1120px] tw-h-[320px] md:tw-h-[450px] tw-relative tw-overflow-hidden tw-rounded-[20px]">
          <div className="tw-w-full md:tw-w-[1280px] tw-h-[391px] tw-absolute tw-left-0 md:tw-left-[-1px] tw-top-0 md:tw-top-[-30px] tw-bg-white/20" />
          <p className="tw-absolute tw-left-[24px] tw-top-[40px] md:tw-left-[57px] md:tw-top-[85px] tw-text-base tw-font-medium tw-text-left tw-text-black">
            IoT Convergence Open Sharing System
          </p>
          <p className="tw-absolute tw-left-[24px] tw-top-[70px] md:tw-left-[57px] md:tw-top-[146px] tw-text-xl md:tw-text-[32px] tw-text-left tw-text-black">
            <span className="tw-text-xl md:tw-text-[32px] tw-text-left tw-text-black">CREATIVE </span>
            <span className="tw-text-xl md:tw-text-[32px] tw-font-bold tw-text-left tw-text-black">LEADERSHIP</span>
          </p>
          <div className="tw-w-[48px] md:tw-w-[190px] tw-h-[2px] md:tw-h-[3px] tw-absolute tw-left-[60px] md:tw-left-[210px] tw-top-[90px] md:tw-top-[190px] tw-bg-[#1B4595]" />
          <p className="tw-absolute tw-left-[24px] tw-top-[110px] md:tw-left-[57px] md:tw-top-[239px] tw-text-sm md:tw-text-base tw-font-medium tw-text-left tw-text-black">
            각 분야의 전문가들이 메이커로서 핵심 질문과 아티클을 답으로 제시합니다.
            <br />
            관리자는 클럽을 만들고 학습자들이 함께 풀 문제를 엄선합니다.
            <br />
            학습자는 관리자만 따라가면 대한민국 최고의 전문가로 성장할 수 있습니다.
          </p>

          <img
            src="/assets/images/main/006_1.png"
            className="tw-hidden lg:tw-block tw-w-[200px] md:tw-w-[360px] tw-h-[290px] md:tw-h-[360px] tw-absolute tw-left-[calc(50%-100px)] md:tw-left-[735px] tw-top-[100px] md:tw-top-[43px] tw-object-cover"
          />
          <img
            src="/assets/images/main/Ellipse_397.png"
            className="tw-hidden lg:tw-block tw-w-[200px] md:tw-w-[360px] tw-h-[290px] md:tw-h-[360px] tw-absolute tw-left-[calc(50%-100px)] md:tw-left-[535px] tw-top-[100px] md:tw-top-[0px] tw-object-cover"
          />
        </div>
      </section>
      <section
        className={cx(
          'top-banner',
          'hero-section',
          'hero-section-3',
          'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center',
        )}
      >
        <div className={cx('main-container tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center')}>
          <div className="tw-w-full tw-flex tw-flex-col md:tw-flex-row tw-gap-4 md:tw-gap-10">
            <img
              src="/assets/images/main/memo1.png"
              className="tw-w-full md:tw-w-1/2 tw-h-[195px] md:tw-h-auto tw-overflow-hidden tw-rounded-[20px] tw-m-1 md:tw-m-0"
            />

            <img
              src="/assets/images/main/memo2.png"
              className="tw-w-full md:tw-w-1/2 tw-h-[195px] md:tw-h-auto tw-object-cover tw-rounded-[20px] tw-m-1 md:tw-m-0"
            />
          </div>
        </div>
      </section>
      <section className={cx('main-container', 'hero-section-3 tw-h-[818px] tw-bg-[#f8f8f8]')}>
        <div className="container mx-auto tw-px-4">
          {/* 첫 번째 섹션 */}
          <div
            className={cx(
              'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-gap-6 md:tw-gap-12 tw-mb-8',
            )}
          >
            <div className="tw-w-full md:tw-w-1/2  tw-mt-20 tw-mb-1 tw-overflow-hidden tw-rounded-[20px] tw-flex tw-flex-col tw-justify-center tw-items-center">
              <div className="tw-text-[#1B4595] tw-text-base tw-font-bold tw-font-['Inter']">Why DevUs</div>
              <div className="tw-text-black tw-text-xl tw-font-bold tw-font-['Inter'] tw-mt-3">
                기초지식부터 IT 마스터가 되기까지!
              </div>
            </div>
            <div className="tw-w-full md:tw-w-1/2 tw-mt-20 tw-mb-1 tw-overflow-hidden tw-rounded-[20px] tw-flex tw-flex-col tw-justify-center tw-items-center">
              <div className="tw-text-[#0A7441] tw-text-base tw-font-bold tw-font-['Inter']">Why DevUs</div>
              <div className="tw-text-black tw-text-xl tw-font-bold tw-font-['Inter'] tw-mt-3">
                데브어스와 함께하는 퀴즈&강의클럽!
              </div>
            </div>
          </div>

          {/* 두 번째 섹션 */}
          <div
            className={cx('tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-gap-6 md:tw-gap-12')}
          >
            <img
              src="/assets/images/main/lec_1.png"
              className="tw-w-full md:tw-w-1/2 tw-h-[195px]  tw-object-cover tw-rounded-[20px] "
            />
            <img
              src="/assets/images/main/lec_2.png"
              className="tw-w-full md:tw-w-1/2 tw-h-[195px] tw-object-cover tw-rounded-[20px] "
            />
          </div>

          {/* 세 번째 섹션 */}
          <div
            className={cx(
              'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-gap-6 md:tw-gap-12 ',
            )}
          >
            <img
              src="/assets/images/main/lec_3.png"
              className="tw-w-full md:tw-w-1/2 tw-h-[195px] tw-object-cover tw-rounded-[20px]"
            />
            <img
              src="/assets/images/main/lec_4.png"
              className="tw-w-full md:tw-w-1/2 tw-h-[195px]  tw-object-cover tw-rounded-[20px]"
            />
          </div>

          {/* 네 번째 섹션 */}
          <div
            className={cx('tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-gap-6 md:tw-gap-12')}
          >
            <img
              src="/assets/images/main/lec_5.png"
              className="tw-w-full md:tw-w-1/2 tw-h-[195px] tw-object-cover tw-rounded-[20px]"
            />
            <img
              src="/assets/images/main/lec_6.png"
              className="tw-w-full md:tw-w-1/2 tw-h-[195px] tw-object-cover tw-rounded-[20px] "
            />
          </div>
        </div>
      </section>
      <div className={cx('container tw-pt-14')}>
        <div className="tw-w-full tw-relative tw-overflow-hidden">
          <img src="/assets/images/main/bottom.png" className="tw-w-full tw-object-cover" />
        </div>

        {isClient && modalIsProfessor && (
          <ProfessorExpModal
            title="교수자 체험하기"
            isOpen={modalIsProfessor}
            onRequestClose={() => setModalIsProfessor(false)}
          />
        )}

        {isClient && !modalIsOpen && logged && (
          <div>
            <div
              className="tw-fixed tw-bottom-0 tw-right-0 tw-w-12 md:tw-w-16 tw-h-12 md:tw-h-16 tw-mr-4 md:tw-mr-10 tw-mb-4 md:tw-mb-8 tw-cursor-pointer tw-z-10"
              onClick={() => setModalIsOpen(true)}
            >
              <img src="/assets/images/main/chatbot.png" />
            </div>
          </div>
        )}
        {isClient && <ChatbotModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} token={token} />}
      </div>
    </div>
  );
}

export default HomeSejongTemplate;
