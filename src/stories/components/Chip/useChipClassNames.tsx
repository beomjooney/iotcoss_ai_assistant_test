import { ChipProps } from '.';
import classNames from 'classnames/bind';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

export default function useChipClassNames({ className, variant, radius, ...props }: ChipProps) {
  let radiusClass;

  switch (variant) {
    case 'filled':
    case 'outlined':
      radiusClass = 'radius28';
      break;
    default:
      radiusClass = 'radius4';
  }

  const chipClassNames = cx(
    Object.values({
      ...props,
      ...className?.split(' '),
      ...{
        radius: radius ? `radius${radius}` : radiusClass,
      },
      variant,
    }),
    'chip',
  );

  return {
    chipClassNames,
  };
}
