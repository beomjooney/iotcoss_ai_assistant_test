import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React from 'react';
import { jobColorKey } from '../../../config/colors';
import Link from 'next/link';

export interface GrowthFieldCardProps {
  /** 성장 분야 */
  type: string;
  /** TODO 아이콘 or 이미지? - 연규 과장님 정의 내용에 따른 수정 필요  */
  /** 아이콘 명 */
  icon?: string;
  /** 타이틀 */
  title?: string;
  /** 설명 */
  description?: string;
  /** 링크 */
  link?: string;
  /** bootstrap small device size */
  smSize?: string;
  /** bootstrap large device size */
  lgSize?: string;
}

const cx = classNames.bind(styles);

const GrowthFieldCard = ({
  type,
  icon = 'ti-tag',
  title,
  description,
  link,
  smSize = 'col-sm-6 ',
  lgSize = 'col-lg-4',
}: GrowthFieldCardProps) => {
  return (
    <div className={cx('mb-lg-0')}>
      {/** TODO 반응형 디자인 확정 후 위 클래스 명 조정 필요*/}
      <div
        className={cx(
          'card',
          'single-promo-card',
          'single-promo-hover',
          'growth-filed-card',
          `growth-filed-card--${jobColorKey(type)}`,
        )}
      >
        <div className={cx('card-body')}>
          <div className={cx('icon-area')}>
            {/**
             * TODO 아이콘 or 이미지? - 연규 과장님 정의 내용에 따른 수정 필요
             */}
            <span className={cx('icon', icon, 'icon-md')}></span>
          </div>
          <div>
            <h5>{title}</h5>
            <p className="text-muted mb-0">{description}</p>
          </div>
          <div className={cx('link-area')}>
            {/* <a href={link}>
              {title} 네비게이션
              <span className={cx('ti-angle-right', 'icon-md')}></span>
            </a> */}
            <Link
              className={cx('ti-angle-right', 'icon-md', 'link-area')}
              href={{ pathname: '/diagram', query: { id: link } }}
              as="/diagram"
            >
              <a>{title} 네비게이션&gt;</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthFieldCard;
