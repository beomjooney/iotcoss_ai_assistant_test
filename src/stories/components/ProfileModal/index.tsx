import styles from './index.module.scss';
import classNames from 'classnames/bind';
import ReactModal from 'react-modal';
import React, { useEffect, useState } from 'react';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
              zIndex: 4030,
            },
            content: {
              position: 'absolute',
              top: '10%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              transform: 'translateX(-50%)',
              width: '90%',
              height: '80%',
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
            <IconButton
              onClick={() => setIsShow(false)}
              className={cx('closable')}
              size="small"
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#666',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
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
              zIndex: 4030,
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
            <IconButton
              onClick={() => setIsShow(false)}
              className={cx('closable')}
              size="small"
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#666',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
          <div className={cx('content')}>{children}</div>
        </ReactModal>
      </Desktop>
    </>
  );
}

export default ProfileModal;
