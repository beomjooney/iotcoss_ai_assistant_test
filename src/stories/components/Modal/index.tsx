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

  //  모달 오버레이에서 스크롤 방지
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

  // 모달이 열릴 때 스크롤을 방지하면서 기존 스크롤 위치를 유지
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
    return () => {
      // 모달이 닫힐 때 원래 스크롤 위치로 복구
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(document.body.style.top || '0', 10) * -1);
    };
  }, [isOpen]);

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
        <div className={cx('closable', 'tw-bg-white', '')}>
          {title && (
            <div className="tw-flex tw-justify-between tw-items-center tw-gap-3 tw-px-6 tw-pt-3">
              {/* <span className={cx('modal-header__title', 'tw-px-10 tw-mb-5 tw-font-bold tw-text-[18px] tw-text-black')}> */}
              <span className={cx('', 'tw-font-bold tw-text-[18px] tw-text-black')}>{title}</span>
              <span className="ti-close tw-cursor-pointer" onClick={() => setIsShow(false)} />
            </div>
          )}
        </div>
      )}
      <div className={cx('content-wrap')}>
        <div className={cx('content')}>{children}</div>
      </div>
    </ReactModal>
  );
}

export default Modal;
