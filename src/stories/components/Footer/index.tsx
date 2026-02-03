import { useSessionStore } from 'src/store/session';
import { useRouter } from 'next/router';
const Footer = () => {
  const { tenantName } = useSessionStore.getState();
  console.log('tenantName', tenantName);
  const router = useRouter();
  return (
    <footer className="tw-border-b-4 border-heading mt-9 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2">
      {tenantName === 'sjunv' || tenantName === 'iotcoss' ? (
        <div className="main-container tw-flex tw-justify-center tw-bg-[#31343d]">
          <div className="tw-h-[129px] tw-relative tw-overflow-hidden tw-bg-[#31343d] tw-fixed tw-bottom-0 tw-flex tw-justify-center tw-items-center">
            <div className="tw-grid tw-grid-cols-1 tw-gap-4 tw-items-center tw-justify-between lg:tw-grid-cols-2 container">
              <div className="tw-flex tw-flex-col tw-col-span-1 tw-hidden lg:tw-flex tw-flex-col tw-items-start">
                <img
                  alt="image_554"
                  src="/assets/images/main/image_554.png"
                  className="tw-w-[280px] tw-object-cover tw-ml-0"
                />
              </div>
              <div className="tw-flex tw-flex-col tw-col-span-1">
                <p className="tw-text-sm tw-text-right tw-text-white">
                  COPYRIGHT(C) IoTCOSS UNIVERSITY. ALL RIGHTS RESERVED
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : tenantName === 'ai' || tenantName === 'quizup' || tenantName === 'skpai' || tenantName === 'skpquiz' ? (
        <div>
          <div className="main-container border-top border-bottom ">
            <div className="tw-relative tw-overflow-hidden tw-fixed tw-bottom-0 tw-flex tw-justify-center tw-items-center">
              <div className="tw-grid tw-grid-cols-1 tw-gap-4 tw-items-center tw-justify-between lg:tw-grid-cols-2 container tw-py-10">
                <div className="tw-flex tw-flex-col tw-col-span-1 tw-hidden lg:tw-flex tw-flex-col tw-items-start">
                  <img
                    alt="devus_footer"
                    src="/assets/images/main/devus_footer.png"
                    className="tw-w-[103px] tw-object-cover tw-ml-0"
                  />
                </div>
              </div>
            </div>
            <div className="tw-grid tw-grid-cols-1 tw-gap-4 tw-items-center tw-justify-between lg:tw-grid-cols-2 container tw-pb-10">
              <div className="tw-flex tw-flex-col tw-col-span-1 tw-hidden lg:tw-flex tw-flex-col tw-items-start tw-text-sm">
                라이프멘토스(주) ㅣ 대표 : 추병조 ㅣ 서비스 문의 : devus@lifementors.co.kr <br />
                서울시 마포구 마포대로8길 35, 흥전빌딩 401호 ㅣ 사업자등록번호 : 530-86-02750
              </div>
            </div>
          </div>
          <div className="tw-flex tw-justify-center tw-items-center tw-py-6">
            <p className="tw-text-sm tw-text-right">Copyright 2024. DevUs Co., Ltd. all rights reserved.</p>
          </div>
        </div>
      ) : tenantName === 'dsuai' ? (
        <div>
          <div className="main-container border-top border-bottom ">
            <div className="tw-relative tw-overflow-hidden tw-flex tw-justify-center tw-items-center">
              <div className="tw-grid tw-grid-cols-1 tw-gap-4 tw-items-center tw-justify-between lg:tw-grid-cols-2 container tw-py-10">
                <div className="tw-flex tw-flex-col tw-col-span-1 tw-hidden lg:tw-flex tw-flex-col tw-items-start">
                  <img
                    alt="devus_footer"
                    src="/assets/images/main/devus_footer.png"
                    className="tw-w-[103px] tw-object-cover tw-ml-0"
                  />
                </div>
              </div>
            </div>
            <div className="tw-grid tw-grid-cols-1 tw-gap-4 tw-items-center tw-justify-between lg:tw-grid-cols-2 container tw-pb-10">
              <div className="tw-space-y-4 tw-flex tw-flex-col tw-col-span-1 tw-hidden lg:tw-flex tw-flex-col tw-items-start tw-text-base ">
                <span
                  className="tw-font-bold tw-cursor-pointer tw-text-[#df2f4a]"
                  onClick={() => {
                    window.open('https://devus.co.kr/policies/privacy');
                  }}
                >
                  개인정보 처리방침
                </span>
                라이프멘토스(주) ㅣ 대표 : 추병조 ㅣ 서비스 문의 : devus@lifementors.co.kr <br />
                서울시 마포구 마포대로8길 35, 흥전빌딩 401호 ㅣ 사업자등록번호 : 530-86-02750
              </div>
              <div
                className="tw-font-bold tw-cursor-pointer tw-text-right"
                onClick={() => {
                  window.open('https://www.dongseo.ac.kr');
                }}
              >
                관련사이트 바로가기
              </div>
            </div>
          </div>
          <div className="tw-flex tw-justify-center tw-items-center tw-py-6">
            <p className="tw-text-sm tw-text-right">Copyright 2024. LifeMentors Co., Ltd. all rights reserved.</p>
          </div>
        </div>
      ) : (
        <div className="main-container tw-flex tw-justify-center tw-bg-[#31343d]">
          <div className="tw-w-full tw-h-[229px] tw-relative tw-overflow-hidden tw-bg-[#31343d] tw-fixed tw-bottom-0 tw-flex tw-justify-center tw-items-center">
            <div className="tw-grid tw-grid-cols-1 tw-gap-4 tw-items-center lg:tw-grid-cols-4">
              <div className="tw-hidden lg:tw-flex tw-flex-col tw-items-center">
                <img
                  alt="logo-1"
                  src="/assets/images/main/logo-1.png"
                  className="tw-w-[131px] tw-h-[92px] tw-object-cover"
                />
              </div>
              <div className="tw-flex tw-flex-col tw-col-span-2 max-sm:tw-px-5">
                <div>
                  <p className="tw-text-base tw-text-white">
                    (47011) 부산광역시 사상구 주례로 47 동서대학교 AI융합교육원
                  </p>
                </div>
                <div className=" tw-flex tw-gap-10">
                  <p className="tw-text-base tw-text-white">TEL : 051-320-4208</p>
                </div>
                <div className="tw-flex tw-mt-4">
                  <p className="tw-text-base tw-text-center tw-text-[#9ca5b2]">
                    Copyrightⓒ 2024 동서대학교. All rights reserved.
                  </p>
                </div>
              </div>
              <div className="tw-flex tw-flex-col tw-items-center">
                <div className="tw-flex tw-flex-row tw-gap-4">
                  <p
                    className="tw-text-base tw-text-center tw-text-white tw-cursor-pointer"
                    onClick={() => {
                      router.push('/policies/privacy/250901');
                    }}
                  >
                    개인정보 처리방침
                  </p>
                  <span className="tw-text-base tw-text-center tw-text-[#9ca5b2] tw-cursor-pointer">|</span>
                  <p
                    className="tw-text-base tw-text-center tw-text-white tw-cursor-pointer"
                    onClick={() => {
                      window.open('https://www.dongseo.ac.kr');
                    }}
                  >
                    관련사이트 바로가기
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
