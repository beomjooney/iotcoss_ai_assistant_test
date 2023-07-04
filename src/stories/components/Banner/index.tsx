import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Image from 'next/image';
import { Typography } from '../index';
import { Desktop } from 'src/hooks/mediaQuery';

export interface BannerProps {
  /** 배경 이미지 */
  imageName?: string;
  /** 제목 */
  title: string;
  /** 클래스 */
  className?: string;
  subTitle?: string;
}

const cx = classNames.bind(styles);

// const Banner = ({ imageName = 'top_banner_seminar.jpg', title, subTitle, className }: BannerProps) => {
const Banner = ({ imageName = 'seminar_bg.png', title, subTitle, className }: BannerProps) => {
  return (
    <div className={cx('banner-container', className)}>
      <div className={cx('banner-container__wrap')}>
        <Desktop>
          <Image src={`/assets/images/banner/${imageName}`} alt="background" layout="fill" />
        </Desktop>
        <div className={cx('text-wrap')}>
          <Typography type="A1" weight="bold" extendClass={cx('text-title')}>
            {title}
          </Typography>
          {/*todo url 경로에 따라 자동 셋팅 구현*/}
          <p className="lead">
            <Typography type="B1">
              홈 {'>'} {subTitle}
            </Typography>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
