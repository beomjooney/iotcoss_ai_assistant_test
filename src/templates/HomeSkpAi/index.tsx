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
export interface HomeSkpAiProps {
  logged: boolean;
  tenantName: string;
}

export function HomeSkpAiTemplate({ logged = false, tenantName = '' }: HomeSkpAiProps) {
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
          background: 'url(/assets/images/main/skpbg.png) no-repeat center center',
          backgroundSize: 'cover',
        }}
      >
        <section
          className={cx(
            'top-banner tw-h-full container',
            'hero-section',
            'hero-section-3',
            'tw-flex tw-flex-col md:tw-flex-row tw-justify-start tw-items-center',
          )}
        >
          <div className="tw-flex tw-items-center tw-justify-between tw-relative">
            <div>
              <p className="  tw-top-[110px] tw-text-4xl tw-text-left tw-text-black">
                <span className="tw-text-2xl  tw-text-left tw-text-gray-700">퀴즈를 통해 스스로 성장하는 학습,</span>
                <br />
                <span className="tw-text-2xl tw-font-bold tw-text-left tw-text-black ">
                  [웹풀스택 개발자 과정 7기]와 함께하는
                </span>
              </p>
              <p className=" tw-text-lg tw-text-left tw-text-black tw-py-10 tw-mb-0">
                <span className="tw-text-3xl tw-font-bold tw-text-left tw-text-black">DevUs AI조교</span>
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
                <p className=" tw-text-base tw-font-bold tw-text-center tw-text-white">데브어스 AI조교 체험하기</p>
              </button> */}
              <div className="tw-flex tw-flex-row tw-gap-2 tw-justify-start tw-items-center tw-mt-2">
                <img alt="skp1" src="/assets/images/main/skp1.png" className="tw-h-[40px]" />
                <img alt="skp2" src="/assets/images/main/skp2.png" className="tw-h-[100%]" />
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
          'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-py-20 tw-bg-[#f8f8f8]',
        )}
      >
        <div className={cx(' main-container  md:tw-flex-row tw-justify-center tw-items-center')}>
          <div className="tw-text-[20px] tw-font-bold tw-text-center tw-text-black tw-mb-1">
            수업 중 궁금했던 키워드와 내용을 언제든 실시간으로 물어보고,
          </div>
          <div className="tw-text-[20px] tw-font-bold tw-text-center tw-text-black">
            강의자료를 기반으로 응답하는 나만의 AI조교를 통해 효과적으로 학습해보세요!
          </div>
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
        <div className="tw-w-full md:tw-w-[1120px] tw-h-[320px] md:tw-h-[450px] tw-relative tw-overflow-hidden tw-rounded-[20px]">
          <div className="tw-w-full md:tw-w-[1280px] tw-h-[391px] tw-absolute tw-left-0 md:tw-left-[-1px] tw-top-0 md:tw-top-[-30px] tw-bg-white/20" />
          <p className="tw-absolute tw-left-[24px] tw-top-[40px] md:tw-left-[57px] md:tw-top-[85px] tw-text-base tw-font-bold tw-text-left tw-text-black">
            With SK planet , T아카데미
          </p>
          <div className="tw-mt-[130px] tw-ml-[54px] ">
            <p className="tw-text-[34px] tw-text-left tw-text-black">
              <span className="tw-text-[34px] tw-text-left tw-text-black">MORE </span>
              <span className="tw-text-[34px] tw-font-semibold tw-text-left tw-text-black">QUESTION</span>
              <span className="tw-text-[34px] tw-text-left tw-text-black">, BETTER </span>
              <span className="tw-text-[34px] tw-font-semibold tw-text-left tw-text-black">QUESTION</span>
            </p>
            <div className="tw-flex tw-mt-2">
              <div className="tw-w-[166px] tw-ml-[110px] tw-h-[3px] tw-bg-[#1b4595]" />
              <div className="tw-w-[166px] tw-ml-[154px] tw-h-[3px] tw-bg-[#1b4595]" />
            </div>
          </div>
          <p className="tw-absolute tw-left-[24px] tw-top-[110px] md:tw-left-[57px] md:tw-top-[239px] tw-text-sm md:tw-text-base tw-font-medium tw-text-left tw-text-black">
            누구나 처음은 어렵습니다. 생소한 키워드, 이해되지 않는 설명, 나만 모르는 것 같은 수업 내용들
            <br />
            질문이 망설여진다면 이제는 AI조교에서 편하고 빠르게 질문하세요.
            <br />
            교수님이 직접 큐레이션한 자료와 강의 내용을 기반으로 AI가 실시간으로 답하고,
            <br />
            강의에서 학습자들이 질문한 내용을 교수님께 전달해 더 좋은 수업을 만듭니다.
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

      <section className={cx('main-container', 'hero-section-3 tw-h-[998px] tw-bg-[#f8f8f8]')}>
        <div className="!tw-px-[180px] ">
          {/* 첫 번째 섹션 */}
          <div
            className={cx(
              'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-gap-6 md:tw-gap-12 tw-mb-8 tw-px-10',
            )}
          >
            <div className="tw-w-[553px]  tw-mt-20 tw-mb-1 tw-overflow-hidden tw-rounded-[20px] tw-flex tw-flex-col tw-justify-center tw-items-center">
              <div className="tw-text-[#1B4595] tw-text-base tw-font-bold tw-font-['Inter']">Why AI조교</div>
              <div className="tw-text-black tw-text-xl tw-font-bold tw-font-['Inter'] tw-mt-3">
                이제 궁금한 건 모두 물어보세요!
              </div>
            </div>
            <div className="tw-w-[553px] tw-mt-20 tw-mb-1 tw-overflow-hidden tw-rounded-[20px] tw-flex tw-flex-col tw-justify-center tw-items-center">
              <div className="tw-text-[#0A7441] tw-text-base tw-font-bold tw-font-['Inter']">With AI조교</div>
              <div className="tw-text-black tw-text-xl tw-font-bold tw-font-['Inter'] tw-mt-3">
                학습자와의 거리를 좁히는 AI조교!
              </div>
            </div>
          </div>

          {/* 두 번째 섹션 */}
          <div className={cx('tw-flex tw-justify-center tw-items-start tw-px-0')}>
            <img alt="lec_1" src="/assets/images/main/lec_1.png" className="tw-w-[573px]   tw-object-cover " />
            <img alt="lec_2" src="/assets/images/main/lec_2.png" className="tw-w-[573px]  tw-object-cover " />
          </div>

          {/* 세 번째 섹션 */}
          <div className={cx('tw-flex tw-justify-center tw-items-start tw-px-0 tw-mt-[-40px]')}>
            <img alt="lec_3" src="/assets/images/main/lec_3.png" className="tw-w-[573px]  tw-object-cover " />
            <img alt="lec_4" src="/assets/images/main/lec_4.png" className="tw-w-[573px]   tw-object-cover" />
          </div>

          {/* 네 번째 섹션 */}
          <div className={cx('tw-flex tw-justify-center tw-items-start tw-px-0 tw-mt-[-40px]')}>
            <img alt="lec_5" src="/assets/images/main/lec_5.png" className="  tw-w-[573px]  tw-object-cover " />
            <img alt="lec_6" src="/assets/images/main/lec_6.png" className="tw-w-[573px]  tw-object-cover" />
          </div>
        </div>
      </section>
      <div className={cx('container  ')}>
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
            <img alt="chatbot" className="tw-w-[140px] tw-h-[140px]" src="/assets/images/main/chatbot.png" />
          </div>
        )}
        {isClient && <ChatbotModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} token={token} />}
      </div>
    </div>
  );
}

export default HomeSkpAiTemplate;
