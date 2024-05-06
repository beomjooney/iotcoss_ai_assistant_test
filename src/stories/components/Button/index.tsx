import React, { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames/bind';

type ButtonSize = 'small' | 'medium' | 'large' | 'icon' | 'footer' | 'my-page' | 'main' | 'camen' | 'modal';
type ButtonColor = 'primary' | 'secondary' | 'gray' | 'disabled' | 'kakao' | 'lite-gray' | 'lite-blue' | 'red';

export interface ButtonProps {
  /** 버튼 크기 */
  size?: ButtonSize;
  /** 버튼 타입 */
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  /** 버튼 레이블 */
  label?: string;
  /** 버튼 색상 */
  color?: ButtonColor;
  /** 버튼활성화 유무 */
  disabled?: boolean;
  /** 버튼 클릭 이벤트 */
  onClick?: () => void;
  /** 버튼 하위 생성 시 */
  children?: React.ReactNode;
  /** 클래스 */
  className?: string;
}

const cx = classNames.bind(styles);

const Button = forwardRef((props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  const { size = 'small', type, label, color = 'primary', disabled, onClick, children, className } = props;
  const classes = disabled ? cx('button', 'disabled', size) : cx('button', color, size);

  return (
    <button ref={ref} type={type} className={cx(classes, className)} disabled={disabled} onClick={onClick}>
      {children ? children : label}
    </button>
  );
});

export default Button;
