import React, { CSSProperties, FC } from 'react';

interface Props extends Partial<Omit<HTMLImageElement, 'style'>> {
  fill?: boolean;
  style?: CSSProperties;
  onLoadingComplete?: () => void;
}

const Image: FC<Props> = ({ fill = false, className, alt = '', style, onLoadingComplete, ...args }) => {
  return (
    //   @ts-ignore
    <img
      {...args}
      className={className + (fill ? ' object-cover absolute inset-0 w-full h-full' : '')}
      alt={alt}
      style={style}
      onLoad={onLoadingComplete}
    />
  );
};

export default Image;
