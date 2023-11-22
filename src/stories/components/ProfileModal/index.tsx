import styles from './index.module.scss';
import classNames from 'classnames/bind';
import ReactModal from 'react-modal';
import React, { useEffect, useState } from 'react';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';

const cx = classNames.bind(styles);
ReactModal.setAppElement('body');

export interface ProfileModalProps {
  isOpen: boolean;
  closable?: boolean;
  children?: React.ReactNode;
  onAfterClose?: () => void;
}

function ProfileModal({ isOpen, children, closable = true, onAfterClose }: ProfileModalProps) {
  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    setIsShow(isOpen);
  }, [isOpen]);

  return (
    <>
      <Mobile>
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
              left: '50%',
              transform: 'translateX(-50%)',
              width: '95%',
              height: '85%',
              border: '1px solid #ccc',
              background: '#fff',
              overflow: 'hidden',
              WebkitOverflowScrolling: 'touch',
              borderRadius: '10px',
              outline: 'none',
              padding: '5px',
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
      </Mobile>
      <Desktop>
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
              left: '50%',
              transform: 'translateX(-50%)',
              // width: '45%',
              width: '720px',
              height: '85%',
              border: '1px solid #ccc',
              background: '#fff',
              overflow: 'hidden',
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
      </Desktop>
    </>
  );
}

export default ProfileModal;
