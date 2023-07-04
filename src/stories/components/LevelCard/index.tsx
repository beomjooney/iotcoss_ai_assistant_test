import styles from './index.module.scss';
import React, { memo, ReactNode } from 'react';
import classNames from 'classnames/bind';
import { Typography } from '../index';

export interface LevelCardProps {
  levelTitle: string;
  levelSubTitle: string;
  levelContent: string;
  isActive?: boolean;
  onClick?: () => void;
}

const cx = classNames.bind(styles);

function LevelCard({
  levelTitle = '1레벨',
  levelSubTitle = '직무초보',
  levelContent = '',
  isActive = false,
  onClick,
}: LevelCardProps) {
  return (
    <div className={cx('level-card')} onClick={onClick && onClick}>
      <div className={cx('card mb-lg-0 text-center', isActive && 'active')}>
        <div className="card-body" style={{ cursor: 'pointer' }}>
          <div className={cx('circle-group', 'pb-2')}>
            <div className={cx('circle')}>
              <Typography type="H3" tag="div" weight="bold" extendClass={cx('circle__center')}>
                {levelTitle}
              </Typography>
            </div>
          </div>
          <div className="pt-2 pb-3">
            <Typography type="C1" tag="span" weight="bold">
              {`[${levelSubTitle}]`}
            </Typography>
            <h5>{levelTitle}</h5>
            <hr />
            <Typography type="C1" tag="p">
              {levelContent}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(LevelCard);
