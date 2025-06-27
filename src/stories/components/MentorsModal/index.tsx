import styles from './index.module.scss';
import classNames from 'classnames/bind';
import ReactModal from 'react-modal';
import React, { useEffect, useState } from 'react';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import CloseIcon from '@mui/icons-material/Close';

const cx = classNames.bind(styles);
ReactModal.setAppElement('body');

export interface MentorsModalProps {
  isOpen: boolean;
  isContentModalClick: boolean;
  title?: string;
  isProfile?: boolean;
  isQuiz?: boolean;
  closable?: boolean;
  children?: React.ReactNode;
  zIndex?: number;
  height?: string;
  onAfterClose?: () => void;
}

function MentorsModal({
  isOpen,
  title,
  children,
  closable = true,
  isProfile = false,
  isQuiz = false,
  isContentModalClick = false,
  zIndex = 3030,
  height = '90%',
  onAfterClose,
}: MentorsModalProps) {
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
              zIndex: zIndex,
            },
            content: {
              position: 'absolute',
              top: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: isProfile ? '55%' : '95%',
              height: '100%',
              border: '1px solid #ccc',
              background: '#fff',
              overflow: 'hidden',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              borderRadius: '10px',
              outline: 'none',
              padding: '5px',
            },
          }}
        >
          {closable && (
            <>
              <div className={cx('closable')} onClick={() => setIsShow(false)}>
                <span className="ti-close" style={{ cursor: 'pointer' }} />
              </div>
            </>
          )}
          <div className={cx('content')}>{children}</div>
        </ReactModal>
      </Mobile>
      <Desktop>
        <ReactModal
          isOpen={isShow}
          onAfterClose={onAfterClose}
          shouldCloseOnOverlayClick={false} // 모달 외부 클릭으로 모달이 닫히지 않도록 설정
          onRequestClose={() => setIsShow(false)} // ESC를 누르거나 모달 외부를 클릭하여 닫을 수 있음
          style={{
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 15, 15, 0.79)',
              zIndex: zIndex,
            },
            content: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)', // translateX에서 translate로 변경하여 Y축도 중앙 정렬
              // transform: 'translateX(-50%)',
              width: isContentModalClick ? '1000px' : isProfile ? '680px' : isQuiz ? '750px' : '55%',
              height: height,
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
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  className={cx('closable tw-font-bold tw-text-xl tw-text-black tw-my-5 tw-mb-2 tw-text-left tw-mt-0')}
                >
                  {title}
                </div>
                <div className={cx('closable')} onClick={() => setIsShow(false)}>
                  <CloseIcon style={{ cursor: 'pointer' }} />
                </div>
              </div>
            </>
          )}
          <div className={cx('content')}>
            <div>{children}</div>
          </div>
        </ReactModal>
      </Desktop>
    </>
  );
}

export default MentorsModal;
