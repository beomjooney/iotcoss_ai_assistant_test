import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Typography } from '../index';
import { MouseEventHandler } from 'react';
import Image from 'next/image';

export interface GrowthStoryCardProps {
  /** 타이틀 */
  title?: string;
  /** 서브타이틀 */
  subTitle?: string;
  /** gray 스케일 */
  isGray?: boolean;
  /** 안내 메세지 */
  message: string;
  /** 클릭 이벤트 */
  onClick?: (no: number) => void;
  no?: number;
  buttonSize?: 'small' | 'large';
}

const cx = classNames.bind(styles);

function GrowthStoryCard({
  title,
  subTitle,
  isGray,
  message,
  onClick,
  no,
  buttonSize = 'small',
}: GrowthStoryCardProps) {
  return (
    <div className={cx('growth-story-container')} onClick={() => onClick && onClick(no)}>
      <h5>{title}</h5>
      <p>{subTitle}</p>
      <div className={cx('story-content')}>
        <div
          className={cx(`circle${isGray ? '__bg-withe' : ''}`, `circle__${buttonSize}`)}
          style={{ cursor: 'pointer' }}
        >
          <Typography type="H3" tag="div" extendClass={cx(`circle__${isGray ? 'text-gray' : 'text'}`)} weight="bold">
            <Image
              src="/assets/images/icons/union.svg"
              alt="추가 버튼"
              layout="fixed"
              width={buttonSize === 'large' ? 19 : 11}
              height={buttonSize === 'large' ? 19 : 11}
            />
          </Typography>
        </div>
        <div className={cx('info')}>{message}</div>
      </div>
    </div>
  );
}

export default GrowthStoryCard;
