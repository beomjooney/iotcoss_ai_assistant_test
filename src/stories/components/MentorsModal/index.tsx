import styles from './index.module.scss';
import classNames from 'classnames/bind';
import ReactModal from 'react-modal';
import React, { useEffect, useState } from 'react';

const cx = classNames.bind(styles);
ReactModal.setAppElement('body');

export interface MentorsModalProps {
  isOpen: boolean;
  closable?: boolean;
  children?: React.ReactNode;
  onAfterClose?: () => void;
}

function MentorsModal({ isOpen, children, closable = true, onAfterClose }: MentorsModalProps) {
  const [isShow, setIsShow] = useState<boolean>(false);

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
          position: 'absolute',
          top: '60px',
          left: '22.5%',
          width: '55%',
          height: '80%',
          border: '1px solid #ccc',
          background: '#fff',
          overflow: 'hidden',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '4px',
          outline: 'none',
          padding: '20px',
        },
      }}
    >
      {closable && (
        <div className={cx('closable')} onClick={() => setIsShow(false)}>
          <span className="ti-close" style={{ cursor: 'pointer' }} />
        </div>
      )}
      <div className={cx('content')}>{children}</div>
    </ReactModal>
  );
}

export default MentorsModal;
