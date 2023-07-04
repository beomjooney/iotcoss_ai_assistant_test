import styles from './index.module.scss';
import { forwardRef, ReactNode, MouseEventHandler, ForwardedRef, HTMLAttributes } from 'react';
import classNames from 'classnames/bind';
import useChipClassNames from './useChipClassNames';

type Variant = 'filled' | 'outlined';
type Color = 'primary' | 'gray' | 'black' | 'plan' | 'design' | 'develop' | 'engineering';

enum Target {
  _self = '_self',
  _blank = '_blank',
}

export interface ChipProps extends HTMLAttributes<HTMLElement> {
  /** 외관 타입 정의 */
  variant?: Variant;
  /** Color 타입 정의 */
  chipColor?: Color | string;
  /** border-radius */
  radius?: 4 | 8 | 15 | 28;

  className?: string;
  children?: ReactNode;

  onClick?: MouseEventHandler<HTMLButtonElement>;
  href?: string;
  target?: keyof typeof Target;
}

const cx = classNames.bind(styles);

function Chip(
  {
    variant = 'filled',
    chipColor = 'primary',
    radius,
    className,
    children,
    onClick,
    href,
    target = '_self',
    ...OtherProps
  }: ChipProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const { chipClassNames } = useChipClassNames({ variant, chipColor, radius, className });
  const renderChildren = () => <span className={classNames(cx('content'), 'chip-content')}>{children}</span>;

  if (href) {
    const linkProps = {
      href,
      target,
      ...((ref && { ref }) as unknown as ForwardedRef<HTMLAnchorElement>),
      ...(target === '_blank' && { rel: 'noopener noreferrer' }),
    };
    return (
      <a className={chipClassNames} {...linkProps} {...OtherProps}>
        {renderChildren()}
      </a>
    );
  }

  if (onClick && typeof onClick === 'function') {
    const buttonProps = {
      ...OtherProps,
      ...((ref && { ref }) as unknown as ForwardedRef<HTMLButtonElement>),
    };
    return (
      <button className={chipClassNames} onClick={onClick} type="button" {...buttonProps}>
        {renderChildren()}
      </button>
    );
  }

  return (
    <span className={chipClassNames} {...OtherProps} ref={ref}>
      {renderChildren()}
    </span>
  );
}

export default forwardRef(Chip);
