import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Typography } from '../index';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Divider from '@mui/material/Divider';

const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <>
      <Mobile>
        <div className="main-container tw-flex tw-justify-center tw-bg-[#31343d]">
          <footer className={cx('footer-section ')}>
            <div className="tw-w-[1280px] tw-h-[229px] tw-relative tw-overflow-hidden tw-bg-[#31343d]">
              <div className="tw-absolute tw-left-[-1px] tw-top-0" />
              <img
                src="/assets/images/main/image_4.png"
                className="tw-w-[131px] tw-h-24 tw-absolute tw-left-[122px] tw-top-[59px] tw-object-cover"
              />
              <img
                src="/assets/images/main/image_5.png"
                className="tw-w-[828px] tw-h-32 tw-absolute tw-left-[372px] tw-top-[49px] tw-object-cover"
              />
            </div>
          </footer>
        </div>
      </Mobile>
      <div className="footer-bottom footer-border"></div>
      <Desktop>
        <div className="main-container tw-flex tw-justify-center tw-bg-[#31343d]">
          <footer className={cx('footer-section ')}>
            <div className="tw-w-[1920px] tw-h-[229px] tw-relative tw-overflow-hidden tw-bg-[#31343d] tw-fixed tw-bottom-0">
              <div className="tw-absolute tw-left-[-1px] tw-top-0" />
              <img
                src="/assets/images/main/logo-1.png"
                className="tw-w-[131px] tw-h-[92px] tw-absolute tw-left-[442px] tw-top-[59px] tw-object-cover"
              />
              <div className="tw-w-[276px] tw-h-[21px] tw-absolute tw-left-[646px] tw-top-[60px]">
                <p className="tw-w-[276px] tw-absolute tw-left-0 tw-top-0 tw-text-base tw-text-left tw-text-white">
                  (47011) 부산광역시 사상구 주례로 47
                </p>
              </div>
              <div className="tw-w-[349px] tw-h-[42px] tw-absolute tw-left-[646px] tw-top-[88px]">
                <div className="tw-w-[143px] tw-h-[21px] tw-absolute tw-left-[206px] tw-top-0">
                  <p className="tw-w-[145px] tw-absolute tw-left-0 tw-top-0 tw-text-base tw-text-left tw-text-white">
                    FAX : 051-313-1046
                  </p>
                </div>
                <p className="tw-w-[348px] tw-absolute tw-left-0 tw-top-0 tw-text-base tw-text-left tw-text-white">
                  TEL : 051-313-2001~4
                </p>
              </div>
              <div className="tw-w-[438px] tw-h-6 tw-absolute tw-left-[640px] tw-top-32">
                <p className="tw-w-[361.44px] tw-absolute tw-left-0 tw-top-0 tw-text-base tw-text-left tw-text-[#9ca5b2]">
                  Copyrightⓒ 2017 동서대학교. All rights reserved.
                </p>
              </div>
              <div className="tw-w-[314px] tw-h-6">
                <p className="tw-w-[276px] tw-absolute tw-left-[1203px] tw-top-[59px] tw-text-base tw-text-right tw-text-white">
                  관련사이트 바로가기
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Desktop>
    </>
  );
};

export default Footer;
