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
      </Desktop>
    </>
  );
};

export default Footer;
