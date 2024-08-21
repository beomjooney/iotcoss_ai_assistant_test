import styles from './index.module.scss';
import classNames from 'classnames/bind';
import ReactModal from 'react-modal';
import React, { useEffect, useState } from 'react';

const cx = classNames.bind(styles);
ReactModal.setAppElement('body');

export interface ModalProps {
  title?: string;
  isOpen: boolean;
  closable?: boolean;
  children?: React.ReactNode;
  onAfterClose?: () => void;
  maxWidth?: string;
  maxHeight?: string;
}

function Modal({
  title,
  isOpen,
  children,
  closable = true,
  onAfterClose,
  maxWidth = '572px',
  maxHeight = '368px',
}: ModalProps) {
  const [isShow, setIsShow] = useState<boolean>(false);

  // 모달 오버레이에서 스크롤 방지
  useEffect(() => {
    document.body.style.cssText = `
        position: fixed;
        top: -${window.scrollY}px;
        overflow-y: scroll;
        width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, []);

  useEffect(() => {
    setIsShow(isOpen);
  }, [isOpen]);

  return (
    <ReactModal
      isOpen={isShow}
      onAfterClose={onAfterClose}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 15, 15, 0.79)',
          zIndex: 1030,
        },
        content: {
          overflowY: 'auto',
          position: 'absolute',
          maxWidth,
          maxHeight,
          minWidth: '800px',
          minHeight: '450px',
          border: 'none',
          background: '#fff',
          overflow: 'hidden',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '10px',
          outline: 'none',
          padding: '0px',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      {closable && (
        <div className={cx('closable', 'tw-bg-white', '')} onClick={() => setIsShow(false)}>
          {title && (
            <div className="">
              <span className={cx('modal-header__title', 'tw-px-5 tw-mb-5 tw-font-bold tw-text-[18px] tw-text-black')}>
                {title}
              </span>
            </div>
          )}
          <span className="ti-close" />
        </div>
      )}
      <div className={cx('content-wrap')}>
        <div className={cx('content')}>{children}</div>
      </div>
    </ReactModal>
  );
}

export default Modal;
