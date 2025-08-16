import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Spinner from '../../../../public/assets/images/loading/Spinner-1s-200px.svg';
import Image from 'next/image';

const cx = classNames.bind(styles);

function Loading() {
  return (
    <div className={cx('loading')}>
      <div className={cx('loading-text')}>잠시만 기다려 주세요.</div>
      <Image src={Spinner} alt="로딩중" width={100} height={100} />
    </div>
  );
}

export default Loading;
