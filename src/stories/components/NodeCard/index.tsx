import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

export interface NodeCardProps {
  title?: string;
  content?: string;
  color?: 'plan' | 'design' | 'develop' | 'engine';
  jobCode?: '0100' | '0200' | '0300' | '0400';
  onClickNode?: (jobGroup: string, index: number) => void;
  index: number;
  size?: string;
  isCloseButton?: boolean;
  removeButton?: (chapterNo: number, index: number) => void;
  chapterNo: number;
}

function NodeCard({
  title = '테스트',
  color = 'plan',
  content = '테스트',
  jobCode,
  onClickNode,
  index,
  size,
  isCloseButton,
  removeButton,
  chapterNo,
}: NodeCardProps) {
  const [resultColor, setResultColor] = useState<string>('plan');

  useEffect(() => {
    jobCode && colorSet();
  }, [jobCode]);

  const colorSet = () => {
    if (jobCode === '0100') {
      setResultColor('plan');
    }

    switch (jobCode) {
      case '0100':
        setResultColor('plan');
        break;
      case '0200':
        setResultColor('design');
        break;
      case '0300':
        setResultColor('develop');
        break;
      case '0400':
        setResultColor('engine');
        break;
    }
  };

  return (
    <div
      className={cx(
        'node-card',
        size === 'large' ? 'node-card-header-large' : '',
        isCloseButton ? '' : 'node-card-cursor',
      )}
      onClick={() => onClickNode && onClickNode(jobCode, index)}
    >
      {isCloseButton && (
        <div className={cx('node-card-button')}>
          <button
            className={cx('node-card-close')}
            type="button"
            onClick={() => removeButton && removeButton(chapterNo, index)}
          >
            닫기
          </button>
        </div>
      )}
      {jobCode ? (
        <>
          <div className={cx('header', resultColor, size === 'large' ? 'header-large' : '')}>{title}</div>
          <div className={cx('content', resultColor, size === 'large' ? 'content-large' : '')}>{content}</div>
        </>
      ) : (
        <>
          <div className={cx('header', color && color, size === 'large' ? 'header-large' : '')}>{title}</div>
          <div className={cx('content', color && color, size === 'large' ? 'content-large' : '')}>{content}</div>
        </>
      )}
    </div>
  );
}

export default NodeCard;
