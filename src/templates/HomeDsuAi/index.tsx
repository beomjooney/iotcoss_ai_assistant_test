import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSessionStore } from '../../store/session';

const cx = classNames.bind(styles);
export interface HomeDsuAiProps {
  logged: boolean;
  tenantName: string;
}

export function HomeDsuAiTemplate({ logged = false, tenantName = '' }: HomeDsuAiProps) {
  const [isClient, setIsClient] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);

  // 클라이언트 사이드에서만 렌더링하도록 상태 관리
  useEffect(() => {
    setIsClient(true);

    // 클라이언트에서만 세션 스토어에 접근
    if (typeof window !== 'undefined') {
      const { roles: sessionRoles } = useSessionStore.getState();
      setRoles(sessionRoles || []);
      console.log(sessionRoles);
    }
  }, []);

  // 클라이언트가 준비되지 않았으면 로딩 상태 표시
  if (!isClient) {
    return (
      <div className={cx('career-main')}>
        <div
          className="tw-mt-4 tw-text-white tw-bg-[url('/assets/images/dsuai/bg-1.svg')] tw-bg-cover tw-bg-center tw-bg-no-repeat"
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
                      <div className="tw-text-left">
                        질문이 망설여진다면 이제는 AI조교에서 편하고 빠르게 질문하세요!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

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
            </div>
          </div>
        </section>
      </div>
      {!logged && (
        <div>
          <section className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center">
            <div className="tw-w-full md:tw-w-[1120px] tw-relative tw-overflow-hidden">
              <div className="tw-mt-24 tw-space-y-3 tw-text-left">
                <div className="tw-text-xl tw-font-bold tw-text-red-500">What is AI조교?</div>
                <div className="tw-text-3xl tw-text-gray-800 tw-font-medium">
                  학습자의 뇌를 깨우는 <span className="tw-font-bold">AI기반 온라인 학습 시스템</span>
                </div>
              </div>

              <div className="tw-flex tw-justify-center tw-items-center tw-pt-16">
                <div className="tw-w-full tw-flex md:tw-flex-row tw-justify-between tw-items-center">
                  <img
                    src="/assets/images/dsuai/login-1.svg"
                    className="tw-w-[544px]  md:tw-h-auto tw-object-cover tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />

                  <img
                    src="/assets/images/dsuai/login-2.svg"
                    className="tw-w-[544px]  md:tw-h-auto tw-object-cover tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center">
            <div className="tw-w-full md:tw-w-[1120px] tw-relative tw-overflow-hidden">
              <div className="tw-mt-24 tw-space-y-3 tw-text-left">
                <div className="tw-text-xl tw-font-bold tw-text-red-500">What is AI조교?</div>
                <div className="tw-text-3xl tw-text-gray-800 tw-font-medium">
                  학습자와 교수자를 연결하는 <span className="tw-font-bold">효과적인 학습 솔루션</span>
                </div>
              </div>

              <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-py-16 tw-gap-1">
                <div className="tw-w-full tw-flex md:tw-flex-row tw-justify-between tw-items-center">
                  <img
                    src="/assets/images/dsuai/login-3.svg"
                    className="tw-w-[564px]  md:tw-h-auto tw-object-cover tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />

                  <img
                    src="/assets/images/dsuai/login-4.svg"
                    className="tw-w-[564px]  md:tw-h-auto tw-object-cover tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />
                </div>
                <div className="tw-w-full tw-flex md:tw-flex-row tw-justify-between tw-items-center">
                  <img
                    src="/assets/images/dsuai/login-5.svg"
                    className="tw-w-[564px]  md:tw-h-auto tw-object-cover tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />

                  <img
                    src="/assets/images/dsuai/login-6.svg"
                    className="tw-w-[564px]  md:tw-h-auto tw-object-cover tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />
                </div>
                <div className="tw-w-full tw-flex md:tw-flex-row tw-justify-between tw-items-center">
                  <img
                    src="/assets/images/dsuai/login-7.svg"
                    className="tw-w-[564px]  md:tw-h-auto tw-object-cover tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />

                  <img
                    src="/assets/images/dsuai/login-8.svg"
                    className="tw-w-[564px]  md:tw-h-auto tw-object-cover tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      {/* 첫 번째 섹션 */}
      {roles.includes('ROLE_INSTRUCTOR') ||
        (roles.includes('ROLE_ADMIN') && (
          <div>
            <section className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-bg-[#fcfcff]">
              <div className="tw-w-full md:tw-w-[1120px] tw-relative tw-overflow-hidden">
                <div className="tw-mt-24 tw-space-y-3 tw-text-left">
                  <div className="tw-text-xl tw-font-bold tw-text-red-500">What is AI조교?</div>
                  <div className="tw-text-3xl tw-text-gray-800 tw-font-medium">
                    학습자의 뇌를 깨우는 <span className="tw-font-bold">AI기반 온라인 학습 시스템</span>
                  </div>
                </div>

                <div className="tw-flex tw-justify-center tw-items-center tw-pt-24">
                  <img
                    src="/assets/images/dsuai/instrator-1.svg"
                    className="tw-w-[800px]  md:tw-h-auto tw-overflow-hidden tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />
                </div>
                <div className="tw-flex tw-justify-center tw-items-center tw-py-24">
                  <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-10 md:tw-gap-10 tw-justify-center tw-items-center">
                    <img
                      src="/assets/images/dsuai/instrator-2.svg"
                      className="tw-w-[308px]  md:tw-h-auto tw-overflow-hidden tw-m-1 md:tw-m-0"
                      alt="AI조교 이미지"
                    />

                    <img
                      src="/assets/images/dsuai/instrator-3.svg"
                      className="tw-w-[362px]  md:tw-h-auto tw-object-cover tw-m-1 md:tw-m-0"
                      alt="AI조교 이미지"
                    />
                    <img
                      src="/assets/images/dsuai/instrator-4.svg"
                      className="tw-w-[308px]  md:tw-h-auto tw-object-cover tw-m-1 md:tw-m-0"
                      alt="AI조교 이미지"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Professor */}
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
                    <img
                      src="/assets/images/dsuai/bg-4.svg"
                      className="md:tw-h-auto tw-overflow-hidden tw-m-1 md:tw-m-0"
                      alt="AI조교 이미지"
                    />
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
                      <img src="/assets/images/dsuai/info_1.svg" alt="AI조교 이미지" />
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-center tw-items-center">
                    <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                      <img src="/assets/images/dsuai/info_2.svg" alt="AI조교 이미지" />
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-center tw-items-center">
                    <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                      <img src="/assets/images/dsuai/info_3.svg" alt="AI조교 이미지" />
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-center tw-items-center">
                    <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                      <img src="/assets/images/dsuai/info_4.svg" alt="AI조교 이미지" />
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-center tw-items-center">
                    <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                      <img src="/assets/images/dsuai/info_5.svg" alt="AI조교 이미지" />
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-center tw-items-center">
                    <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                      <img src="/assets/images/dsuai/info_6.svg" alt="AI조교 이미지" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ))}

      {/* Student */}
      {roles.includes('ROLE_USER') && (
        <div>
          <section className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-bg-[#fcfcff]">
            <div className="tw-w-full md:tw-w-[1120px] tw-relative tw-overflow-hidden">
              <div className="tw-mt-24 tw-space-y-3 tw-text-left">
                <div className="tw-text-xl tw-font-bold tw-text-red-500">What is AI조교?</div>
                <div className="tw-text-3xl tw-text-gray-800 tw-font-medium">
                  학습자의 뇌를 깨우는 <span className="tw-font-bold">AI기반 온라인 학습 시스템</span>
                </div>
              </div>

              <div className="tw-flex tw-justify-center tw-items-center tw-pt-10">
                <div className="tw-w-full tw-flex md:tw-flex-row tw-justify-between tw-items-center">
                  <img
                    src="/assets/images/dsuai/user-1.svg"
                    className="md:tw-h-auto tw-overflow-hidden tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />
                  <img
                    src="/assets/images/dsuai/user-2.svg"
                    className="tw-w-[500px] md:tw-h-auto tw-overflow-hidden tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 두 번째 섹션 */}
          <section className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-pt-16">
            <div className="md:tw-w-[1120px]  tw-relative tw-overflow-hidden">
              <div className="tw-mt-12 tw-space-y-3 tw-text-left">
                <div className="tw-text-xl tw-font-bold tw-text-red-500">AI조교의 특징</div>
                <div className="tw-text-3xl tw-text-gray-800 tw-font-medium">
                  학습자와 교수자의 <span className="tw-font-bold">효과적인 연결</span>
                </div>
              </div>

              <div className="tw-flex tw-justify-center tw-items-center tw-pt-10">
                <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                  <img
                    src="/assets/images/dsuai/bg-4.svg"
                    className="md:tw-h-auto tw-overflow-hidden tw-m-1 md:tw-m-0"
                    alt="AI조교 이미지"
                  />
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
                    <img src="/assets/images/dsuai/info_1.svg" alt="AI조교 이미지" />
                  </div>
                </div>
                <div className="tw-flex tw-justify-center tw-items-center">
                  <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                    <img src="/assets/images/dsuai/info_3.svg" alt="AI조교 이미지" />
                  </div>
                </div>
                <div className="tw-flex tw-justify-center tw-items-center">
                  <div className="tw-w-full tw-flex md:tw-flex-row tw-gap-4 md:tw-gap-28 tw-justify-center tw-items-center">
                    <img src="/assets/images/dsuai/info_4.svg" alt="AI조교 이미지" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      <section className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-bg-[#fff] ">
        <div className="tw-w-full tw-relative tw-overflow-hidden tw-py-20">
          <img src="/assets/images/dsuai/bg-footer.svg" className="tw-w-full tw-object-cover" alt="AI조교 이미지" />
        </div>
      </section>
    </div>
  );
}

export default HomeDsuAiTemplate;
