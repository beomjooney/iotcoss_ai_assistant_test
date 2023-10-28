import classNames from 'classnames/bind';
import styles from './index.module.scss';

export interface SectionHeaderProps {
  /** 제목 */
  title: string;
  /** 서브 타이틀 */
  subTitle?: string;
  /** 사이즈 */
  size?: 'normal' | 'small';
  /** 클래스 */
  className?: string;
  weight?: 'lite' | 'bold';
}

const cx = classNames.bind(styles);

const SectionHeader = ({ title, subTitle, size = 'normal', className = '', weight = 'bold' }: SectionHeaderProps) => {
  return (
    <div className={cx('section-header', `section-header--${size}`, `section-header--${weight}`, className)}>
      <div className="tw-text-black tw-text-[16px] max-sm:!tw-text-lg">{subTitle}</div>
      <h3 className="max-sm:!tw-text-2xl">{title}</h3>
    </div>
  );
};

export default SectionHeader;
