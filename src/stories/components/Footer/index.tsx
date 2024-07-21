const Footer = () => {
  return (
    <footer className="tw-border-b-4 border-heading mt-9 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2">
      <div className="main-container tw-flex tw-justify-center tw-bg-[#31343d]">
        <div className="tw-w-full tw-h-[229px] tw-relative tw-overflow-hidden tw-bg-[#31343d] tw-fixed tw-bottom-0 tw-flex tw-justify-center tw-items-center">
          <div className="tw-grid tw-grid-cols-1 tw-gap-4 tw-items-center lg:tw-grid-cols-4">
            <div className="tw-hidden lg:tw-flex  tw-flex-col tw-items-center">
              <img src="/assets/images/main/logo-1.png" className="tw-w-[131px] tw-h-[92px] tw-object-cover" />
            </div>
            <div className="tw-flex tw-flex-col tw-col-span-2">
              <div className="tw-h-[21px]">
                <p className="tw-text-base tw-text-white">(47011) 부산광역시 사상구 주례로 47</p>
              </div>
              <div className="tw-h-[42px] tw-flex tw-gap-10">
                <p className="tw-text-base tw-text-white">TEL : 051-313-2001~4</p>
                <p className="tw-text-base tw-text-white">FAX : 051-313-1046</p>
              </div>
              <div className="tw-flex tw-mt-4">
                <p className="tw-text-base tw-text-center tw-text-[#9ca5b2]">
                  Copyrightⓒ 2017 동서대학교. All rights reserved.
                </p>
              </div>
            </div>
            <div className="tw-flex tw-flex-col tw-items-center">
              <div className="tw-w-[314px] tw-h-6">
                <p className="tw-text-base tw-text-center tw-text-white">관련사이트 바로가기</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
