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
export interface HomeB2cProps {
  logged: boolean;
  tenantName: string;
}

export function HomeB2cTemplate({ logged = false, tenantName = '' }: HomeB2cProps) {
  const router = useRouter();
  const { token, roles, menu } = useSessionStore.getState();

  const [isClient, setIsClient] = useState(false); // 클라이언트 사이드에서만 렌어링하도록 상태 추가
  useEffect(() => {
    setIsClient(true); // 클라이언트 사이드에서 상태를 true로 설정
  }, []);

  const [modalIsProfessor, setModalIsProfessor] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className={cx('career-main')}>
      <div
        className="tw-w-full tw-h-[480px] tw-relative tw-overflow-hidden"
        style={{
          background:
            'linear-gradient(to right, rgba(254,226,255,0.59) 0%, rgba(207,238,255,0.59) 64.58%, rgba(186,251,255,0.59) 100%)',
        }}
      >
        <section
          className={cx(
            'top-banner tw-h-full',
            'hero-section',
            'hero-section-3',
            'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center',
          )}
        >
          <div className="tw-flex tw-items-center tw-justify-between tw-relative">
            <div>
              <p className="  tw-top-[124px] tw-text-4xl tw-font-bold tw-text-left tw-text-black">
                <span className="tw-text-4xl tw-font-bold tw-text-left tw-text-black">전문가와 함께하는 학습,</span>
                <br />
                <span className="tw-text-4xl tw-font-bold tw-text-left tw-text-black">데브어스 퀴즈업</span>
              </p>

              <p className=" tw-text-lg tw-text-left tw-text-black tw-py-10">
                <span className="tw-text-lg tw-text-left tw-text-black">
                  AI 기능으로 구축된 체계적이고 효율적인 학습관리 시스템!
                </span>
                <br />
                <span className="tw-text-lg tw-text-left tw-text-black">
                  이 시대 최고의 리더와 함께 학습할 수 있습니다!
                </span>
              </p>
              {/* <button
                onClick={() => {
                  console.log(modalIsProfessor);
                  const role =
                    roles?.includes('ROLE_ADMIN') || roles?.includes('ROLE_INSTRUCTOR') ? 'professor' : 'student';
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
                className="tw-flex tw-items-center tw-justify-center tw-w-60 tw-h-12 tw-overflow-hidden tw-rounded tw-bg-[#2474ed]"
              >
                <p className=" tw-text-base tw-font-bold tw-text-center tw-text-white">데브어스 퀴즈업 체험하기</p>
              </button> */}
              <div className="tw-flex tw-items-center tw-justify-start tw-gap-5">
                <div
                  onClick={() => {
                    console.log(modalIsProfessor);
                    const role =
                      roles?.includes('ROLE_ADMIN') || roles?.includes('ROLE_INSTRUCTOR') ? 'professor' : 'student';
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
                  <div className=" tw-text-xs md:tw-text-lg tw-text-left tw-text-white tw-bg-primary tw-rounded-lg tw-px-3 tw-py-1.5">
                    <div className="tw-flex tw-items-center">
                      <img
                        className=" tw-rounded-full tw-w-8 md:tw-w-12 tw-h-8 md:tw-h-12"
                        src="/assets/images/main/teacher1.png"
                      />
                      <div className="tw-ml-2 md:tw-ml-4">
                        <span className="tw-text-xs md:tw-text-lg tw-font-bold tw-text-left tw-text-white">교수자</span>
                        <br />
                        <span className="tw-text-xs md:tw-text-lg tw-font-medium tw-text-left tw-text-white">
                          체험하기
                        </span>
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
                  <div className="tw-text-xs md:tw-text-lg tw-text-left tw-text-white tw-rounded-lg tw-bg-[#7ed869]  tw-px-3 tw-py-1.5">
                    <div className="tw-flex tw-items-center">
                      <img
                        className=" tw-rounded-full tw-w-8 md:tw-w-12 tw-h-8 md:tw-h-12"
                        src="/assets/images/main/teacher2.png"
                      />
                      <div className="tw-ml-2 md:tw-ml-4">
                        <span className="tw-text-xs md:tw-text-lg tw-font-bold tw-text-left tw-text-white">학습자</span>
                        <br />
                        <span className="tw-text-xs md:tw-text-lg tw-font-medium tw-text-left tw-text-white">
                          체험하기
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-flex tw-items-center tw-justify-center tw-mt-[45px]">
            <img
              src="/assets/images/main/ba02_2.png"
              className="tw-w-[578px] tw-h-[437px]  tw-left-[924px] tw-top-[82px] tw-object-cover"
            />
          </div>
        </section>
      </div>
      {/* <div
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
          <div className="tw-w-full md:tw-w-[1120px] tw-h-[300px] md:tw-h-[510px] tw-relative tw-overflow-hidden tw-rounded-[20px]">
            <div className="tw-w-full md:tw-w-[1280px] tw-h-[381px] tw-absolute tw-left-0 md:tw-left-[-1px] tw-top-0" />
            <div className="tw-absolute tw-top-[60px] md:tw-top-[180px] tw-text-xl md:tw-text-[32px] tw-text-left">
              <div>
                <div className="tw-text-[40px] tw-font-medium tw-text-left">AI조교 </div>
                <div className="tw-text-[40px] tw-font-bold tw-text-left tw-mt-[50px]">
                  IoT, 더 나은 세상을 위한 연결{' '}
                </div>
              </div>
              <div className="tw-absolute  tw-top-[100px] md:tw-top-[120px] tw-text-lg md:tw-text-lg tw-font-medium tw-text-left">
                IoT Convergence Open Sharing System & <span className="tw-font-bold">DevUs</span>
              </div>
              {isClient && menu.use_quiz_club && (
                <div>
                  <div
                    onClick={() => {
                      router.push('/quiz');
                    }}
                    className=" tw-cursor-pointer tw-w-36 md:tw-w-48 tw-h-12 md:tw-h-20"
                  >
                    <div className="tw-bg-white/10 tw-backdrop-blur-[20px] border tw-px-3 tw-py-3 tw-rounded-lg tw-absolute tw-left-[105px] md:tw-left-[250px] tw-top-[167px] md:tw-top-[235px] tw-text-xs md:tw-text-lg tw-text-left tw-text-white">
                      <div className="tw-flex tw-items-center">
                        <img
                          className=" tw-rounded-full tw-w-8 md:tw-w-12 tw-h-8 md:tw-h-12"
                          src="/assets/images/main/man.png"
                        />
                        <div className="tw-flex tw-items-center  tw-gap-3">
                          <div className="tw-ml-2 md:tw-ml-4">
                            <span className="tw-text-xs md:tw-text-lg tw-font-bold tw-text-left tw-text-white">
                              DevUs
                            </span>
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
                      console.log(modalIsProfessor);
                      const role =
                        roles?.includes('ROLE_ADMIN') || roles?.includes('ROLE_INSTRUCTOR') ? 'professor' : 'student';
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
                    className="tw-cursor-pointer tw-w-36 md:tw-w-48 tw-h-12 md:tw-h-20"
                  >
                    <div className="tw-bg-white/10 tw-backdrop-blur-[20px] border tw-px-3 tw-py-3 tw-rounded-lg tw-absolute  tw-top-[167px] md:tw-top-[235px] tw-text-xs md:tw-text-lg tw-text-left tw-text-white">
                      <div className="tw-flex tw-items-center">
                        <img
                          className=" tw-rounded-full tw-w-8 md:tw-w-12 tw-h-8 md:tw-h-12"
                          src="/assets/images/main/girl.png"
                        />
                        <div className="tw-flex tw-items-center tw-gap-3">
                          <div className="tw-ml-2 md:tw-ml-4">
                            <span className="tw-text-xs md:tw-text-lg tw-font-bold tw-text-left tw-text-white">
                              DevUs
                            </span>
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
              )}
            </div>
          </div>
        </section>
      </div> */}
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
          <p className="tw-absolute tw-left-[24px] tw-top-[40px] md:tw-left-[57px] md:tw-top-[85px] tw-text-base tw-font-bold tw-text-left tw-text-black">
            DevUs QuizUp{' '}
          </p>
          <div className="tw-mt-[130px] tw-ml-[54px] ">
            <p className="tw-text-[34px] tw-text-left tw-text-black">
              <span className="tw-text-[34px] tw-text-left tw-text-black">CREATIVE </span>
              <span className="tw-text-[34px] tw-font-semibold tw-text-left tw-text-black">LEADERSHIP</span>
            </p>
            <div className="tw-flex tw-mt-2">
              <div className="tw-w-[200px] tw-ml-[160px] tw-h-[3px] tw-bg-[#1b4595]" />
            </div>
          </div>
          {/* <div className="tw-w-[48px] md:tw-w-[190px] tw-h-[2px] md:tw-h-[3px] tw-absolute tw-left-[60px] md:tw-left-[210px] tw-top-[90px] md:tw-top-[190px] tw-bg-[#1B4595]" /> */}
          <p className="tw-absolute tw-left-[24px] tw-top-[110px] md:tw-left-[57px] md:tw-top-[239px] tw-text-sm md:tw-text-base tw-font-medium tw-text-left tw-text-black">
            각 분야의 전문가들이 메이커로서 핵심 질문과 아티클을 답으로 제시합니다.
            <br />
            교수자는 클럽을 만들고 학습자들이 함께 풀 문제를 엄선합니다.
            <br />
            학습자는 교수자만 따라가면 대한민국 최고의 전문가로 성장할 수 있습니다.
          </p>
          <img
            src="/assets/images/main/006_2.png"
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
          <div className="tw-w-full tw-flex tw-flex-col md:tw-flex-row tw-gap-4 md:tw-gap-5">
            <img
              src="/assets/images/main/main-0.png"
              className="tw-w-[553px]  md:tw-h-auto tw-overflow-hidden tw-rounded-[20px] tw-m-1 md:tw-m-0"
            />

            <img
              src="/assets/images/main/main-1.png"
              className="tw-w-[553px]  md:tw-h-auto tw-object-cover tw-rounded-[20px] tw-m-1 md:tw-m-0"
            />
          </div>
        </div>
      </section>
      <section className={cx('main-container', 'hero-section-3 tw-h-[918px] tw-bg-[#f8f8f8]')}>
        <div className="!tw-px-[180px] ">
          {/* 첫 번째 섹션 */}
          <div
            className={cx(
              'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-gap-6 md:tw-gap-12 tw-mb-8 tw-px-10',
            )}
          >
            <div className="tw-w-[553px]  tw-mt-20 tw-mb-1 tw-overflow-hidden tw-rounded-[20px] tw-flex tw-flex-col tw-justify-center tw-items-center">
              <div className="tw-text-[#1B4595] tw-text-base tw-font-bold tw-font-['Inter']">Why 퀴즈업</div>
              <div className="tw-text-black tw-text-xl tw-font-bold tw-font-['Inter'] tw-mt-3">
                퀴즈로 뇌를 깨우는 효과적인 학습법
              </div>
              <div className="tw-flex tw-flex-col tw-gap-10 tw-mt-10">
                <img src="/assets/images/main/quiz-7.png" className=" tw-object-cover " />
                <img src="/assets/images/main/quiz-9.png" className=" tw-object-cover " />
                <img src="/assets/images/main/quiz-11.png" className=" tw-object-cover " />
              </div>
            </div>
            <div className="tw-w-[553px] tw-mt-20 tw-mb-1 tw-overflow-hidden tw-rounded-[20px] tw-flex tw-flex-col tw-justify-center tw-items-center">
              <div className="tw-text-[#0A7441] tw-text-base tw-font-bold tw-font-['Inter']">With 퀴즈업</div>
              <div className="tw-text-black tw-text-xl tw-font-bold tw-font-['Inter'] tw-mt-3">
                직무 전문가와 함께 하는 AI 멘토
              </div>
              <div className="tw-flex tw-flex-col tw-gap-10 tw-mt-10">
                <img src="/assets/images/main/quiz-8.png" className="  tw-object-cover " />
                <img src="/assets/images/main/quiz-10.png" className="  tw-object-cover " />
                <img src="/assets/images/main/quiz-12.png" className="  tw-object-cover " />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={cx('container tw-py-14  ')}>
        <div className="tw-w-full tw-relative tw-overflow-hidden tw-px-10">
          <img src="/assets/images/main/quiz-bottom.png" className="tw-w-full tw-object-cover" />
        </div>

        {isClient && modalIsProfessor && (
          <ProfessorExpModal
            title="교수자 체험하기"
            isOpen={modalIsProfessor}
            onRequestClose={() => {
              setModalIsProfessor(false);
            }}
          />
        )}

        {isClient && !modalIsOpen && logged && menu.use_lecture_club && (
          <div
            className="tw-fixed tw-bottom-0 tw-right-0  tw-mr-4 md:tw-mr-10 tw-mb-4 md:tw-mb-8 tw-cursor-pointer tw-z-10"
            onClick={() => setModalIsOpen(true)}
          >
            <img className="tw-w-[140px] tw-h-[140px]" src="/assets/images/main/chatbot.png" />
          </div>
        )}
        {isClient && <ChatbotModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} token={token} />}
      </div>
    </div>
  );
}

export default HomeB2cTemplate;
