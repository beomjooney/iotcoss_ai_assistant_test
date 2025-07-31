import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSessionStore } from '../../store/session';
import ChatbotModal from 'src/stories/components/ChatBot';
import ProfessorExpModal from 'src/stories/components/ProfessorExp';
import StudentExpModal from 'src/stories/components/StudentExp';

const cx = classNames.bind(styles);
export interface HomeDsuAiProps {
  logged: boolean;
  tenantName: string;
}

export function HomeDsuAiTemplate({ logged = false, tenantName = '' }: HomeDsuAiProps) {
  const { token, menu } = useSessionStore.getState();

  const [isClient, setIsClient] = useState(false); // 클라이언트 사이드에서만 렌어링하도록 상태 추가
  useEffect(() => {
    setIsClient(true); // 클라이언트 사이드에서 상태를 true로 설정
  }, []);

  const [modalIsProfessor, setModalIsProfessor] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsStudent, setModalIsStudent] = useState(false);

  return (
    <div className={cx('career-main')}>
      <div
        className="tw-mt-4 tw-text-white tw-bg-[url('/assets/images/dsuai/bg-1.svg')]  tw-bg-cover tw-bg-center tw-bg-no-repeat"
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
              <div className="tw-max-w-2xl tw-mx-auto tw-p-8 tw-rounded-lg">
                <div className="tw-space-y-4 tw-text-left">
                  <h4 className="tw-pb-1 tw-font-semibold tw-text-gray-700">강의 자료 기반 온라인 챗봇</h4>

                  <h1 className="tw-text-4xl tw-font-bold tw-text-black">
                    DSU x DevUs - <span className="tw-text-red-500">AI조교</span>
                  </h1>

                  <div className="tw-space-y-0 tw-text-gray-600 tw-leading-relaxed tw-text-xl tw-pt-10 tw-font-semibold">
                    <div className="tw-text-left">누구나 처음은 어렵습니다.</div>
                    <div className="tw-text-left">
                      생소한 키워드, 이해되지 않는 설명, 나만 모르는 것 같은 수업 내용들,
                    </div>
                    <div className="tw-text-left">질문이 망설여진다면 이제는 AI조교에서 편하고 빠르게 질문하세요!</div>
                  </div>
                </div>
              </div>
              {/* {isClient && menu.use_quiz_club && (
                <div>
                  <div
                    onClick={() => {
                      router.push('/quiz');
                      // setModalIsStudent(true);
                    }}
                    className=" tw-cursor-pointer tw-w-36 md:tw-w-48 tw-h-12 md:tw-h-20"
                  >
                    <div className="tw-bg-white/10 tw-backdrop-blur-[20px] border tw-px-3 tw-py-3 tw-rounded-lg tw-absolute tw-left-[105px] md:tw-left-[240px] tw-top-[167px] md:tw-top-[235px] tw-text-xs md:tw-text-lg tw-text-left tw-text-white">
                      <div className="tw-flex tw-items-center">
                        <img
                          className=" tw-rounded-full tw-w-8 md:tw-w-12 tw-h-8 md:tw-h-12"
                          src="/assets/images/dsuai/man.png"
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
                        roles?.includes('ROLE_MANAGER') ||
                        roles?.includes('ROLE_ADMIN') ||
                        roles?.includes('ROLE_INSTRUCTOR')
                          ? 'professor'
                          : 'student';
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
              )} */}
            </div>
          </div>
        </section>
      </div>

      {/* 첫 번째 섹션 */}
      <section className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-bg-[#f8f8f8]">
        <div className="tw-w-full md:tw-w-[1120px] tw-h-[520px] md:tw-h-[1050px] tw-relative tw-overflow-hidden">
          <div className="tw-mt-12 tw-space-y-3 tw-text-left">
            <div className="tw-text-xl tw-font-bold tw-text-red-500">What is AI조교?</div>
            <div className="tw-text-3xl tw-text-gray-800 tw-font-medium">
              학습자의 뇌를 깨우는 <span className="tw-font-bold">AI기반 온라인 학습 시스템</span>
            </div>
          </div>

          <div className={cx('tw-flex tw-justify-center tw-items-center tw-pt-24')}>
            <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
              <img
                src="/assets/images/dsuai/bg-2.svg"
                className="tw-w-[410px]  md:tw-h-auto tw-overflow-hidden tw-m-1 md:tw-m-0"
              />

              <img
                src="/assets/images/dsuai/bg-3.svg"
                className="tw-w-[410px]  md:tw-h-auto tw-object-cover tw-m-1 md:tw-m-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 두 번째 섹션 */}
      <section className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-bg-[#fff]">
        <div className="md:tw-w-[1120px]  tw-relative tw-overflow-hidden">
          <div className="tw-mt-12 tw-space-y-3 tw-text-left">
            <div className="tw-text-xl tw-font-bold tw-text-red-500">AI조교의 특징</div>
            <div className="tw-text-3xl tw-text-gray-800 tw-font-medium">
              학습자와 교수자의 <span className="tw-font-bold">효과적인 연결</span>
            </div>
          </div>

          <div className="tw-flex tw-justify-center tw-items-center tw-pt-10">
            <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
              <img src="/assets/images/dsuai/bg-4.svg" className="md:tw-h-auto tw-overflow-hidden tw-m-1 md:tw-m-0" />
            </div>
          </div>
        </div>
      </section>

      <section className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-bg-[#fff] tw-pt-24">
        <div className="md:tw-w-[1120px]  tw-relative tw-overflow-hidden">
          <div className="tw-mt-12 tw-space-y-3 tw-text-left">
            <div className="tw-text-xl tw-font-bold tw-text-red-500">AI조교의 특징</div>
            <div className="tw-text-3xl tw-text-gray-800 tw-font-medium">
              학습자와 교수자를 연결하는 <span className="tw-font-bold">효과적인 학습 솔루션</span>
            </div>
          </div>

          <div className="tw-space-y-8 tw-mt-10">
            <div className="tw-flex tw-justify-center tw-items-center">
              <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                <img src="/assets/images/dsuai/info_1.svg" />
              </div>
            </div>
            <div className="tw-flex tw-justify-center tw-items-center">
              <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                <img src="/assets/images/dsuai/info_2.svg" />
              </div>
            </div>
            <div className="tw-flex tw-justify-center tw-items-center">
              <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                <img src="/assets/images/dsuai/info_3.svg" />
              </div>
            </div>
            <div className="tw-flex tw-justify-center tw-items-center">
              <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                <img src="/assets/images/dsuai/info_4.svg" />
              </div>
            </div>
            <div className="tw-flex tw-justify-center tw-items-center">
              <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                <img src="/assets/images/dsuai/info_5.svg" />
              </div>
            </div>
            <div className="tw-flex tw-justify-center tw-items-center">
              <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                <img src="/assets/images/dsuai/info_6.svg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-bg-[#fff] ">
        <div className="tw-w-full tw-relative tw-overflow-hidden tw-py-20">
          <img src="/assets/images/dsuai/bg-footer.svg" className="tw-w-full tw-object-cover" />
        </div>
      </section>

      {/* 세 번째 섹션 */}
      <div className={cx('container tw-py-14  ')}>
        {isClient && modalIsProfessor && (
          <ProfessorExpModal
            title="교수자 체험하기"
            isOpen={modalIsProfessor}
            onRequestClose={() => {
              setModalIsProfessor(false);
            }}
          />
        )}

        {isClient && modalIsStudent && (
          <StudentExpModal
            title="학습자 체험하기"
            isOpen={modalIsStudent}
            onRequestClose={() => {
              setModalIsStudent(false);
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

export default HomeDsuAiTemplate;
