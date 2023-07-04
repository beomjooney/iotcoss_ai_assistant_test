import styles from './index.module.scss';
import React, { memo, ReactNode } from 'react';
import classNames from 'classnames/bind';

const type = {
  A1: 'A1',
  A2: 'A2',
  A3: 'A3',
  H1: 'H1',
  H2: 'H2',
  H3: 'H3',
  B1: 'B1',
  B2: 'B2',
  B3: 'B3',
  C1: 'C1',
};

type TypographyTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'strong'
  | 'em'
  | 'address'
  | 'span'
  | 'p'
  | 'div'
  | 'ul'
  | 'li'
  | 'figcaption';

export interface TypographyProps {
  /** 텍스트 타입 지정(type 별 font-size, letter-spacing, line-height 추후 디자인 가이드에 맞게 수정) */
  type?: keyof typeof type;
  /** HTML 요소로 사용할 문자열 */
  tag?: TypographyTag;
  /** text bold 유무 */
  bold?: boolean;
  /** text font weight */
  weight?: 'regular' | 'medium' | 'bold';
  /** extendClass  */
  extendClass?: string;
  id?: string;
  /** style */
  style?: React.CSSProperties;
  /** text */
  children: ReactNode;
}

const cx = classNames.bind(styles);

export function classesBind(defaultClass: string, addObject: any) {
  const classes = [defaultClass];
  for (const key in addObject) {
    if (addObject[key]) classes.push(key);
  }
  return classes.join(' ');
}

function Typography({
  type = 'B1',
  tag = 'span',
  bold = false,
  weight = 'regular',
  extendClass,
  style,
  children,
  id,
}: TypographyProps) {
  const Component = tag;

  return (
    <Component
      className={classesBind(
        cx({
          typography: true,
          [`typography--${type}`]: type,
          'typography--regular': weight === 'regular',
          'typography--medium': weight === 'medium',
          'typography--bold': bold || weight === 'bold',
        }),
        {
          [`${extendClass}`]: extendClass,
        },
      )}
      id={id}
      style={style}
    >
      {children}
    </Component>
  );
}

export default memo(Typography);
