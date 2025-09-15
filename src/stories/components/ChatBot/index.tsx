import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { useSessionStore } from '../../../store/session';
import { Dialog } from '@mui/material';
import { Resizable } from 're-resizable';
const defaultSize = { width: 450, height: 700 };

Modal.setAppElement('#__next'); // Modal 접근성 설정

const ChatbotModal = ({ isOpen, onRequestClose, token }) => {
  const [size, setSize] = useState(defaultSize);
  const { roles } = useSessionStore.getState();
  const role =
    roles.length === 1 && roles.includes('ROLE_USER')
      ? 'student'
      : roles.includes('ROLE_INSTRUCTOR') || roles.includes('ROLE_MANAGER')
        ? 'professor'
        : 'student'; // 기본값을 'student'로 설정

  const url = `${process.env['NEXT_PUBLIC_AI_CHATBOT_URL']}/aichatbot?role=${role}&accessToken=${token}`;

  useEffect(() => {
    const handleMessage = event => {
      if (event.data === 'closeChatbotModal') {
        onRequestClose();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onRequestClose]);

  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 로컬 스토리지에서 사이즈를 불러옵니다.
    const storedSize = localStorage.getItem('buttonSize');
    if (storedSize) {
      setSize(JSON.parse(storedSize));
    }
  }, []);

  const handleResizeStop = ref => {
    // 크기 조정이 멈췄을 때 현재 사이즈를 로컬 스토리지에 저장합니다.
    const newSize = {
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    };
    setSize(newSize);
    localStorage.setItem('buttonSize', JSON.stringify(newSize));
  };

  return (
    <Dialog
      sx={{ boxShadow: 3 }}
      open={isOpen}
      onClose={(e, reason) => {
        // 바깥 영역 클릭 시 닫히지 않도록 설정
        if (reason !== 'backdropClick') {
          onRequestClose();
        }
      }}
      maxWidth="xl"
      PaperProps={{
        style: {
          // overflow: 'hidden', // 스크롤바가 보이지 않도록 설정
          zIndex: 2147483647,
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor: 'transparent', // 배경을 완전히 투명하게 설정
        },
      }}
    >
      <Resizable
        className="tw-bg-white"
        size={size}
        onResizeStop={handleResizeStop}
        minWidth={530} // 최소 넓이
        minHeight={680} // 최소 높이
        enable={{
          top: true,
          right: false,
          bottom: false,
          left: true,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        style={{
          position: 'fixed',
          right: '20px', // 오른쪽 고정
          bottom: '20px',
          borderRadius: '10px', // Resizable 모서리 둥글게 설정
          overflow: 'hidden', // 내부 요소에 둥근 모서리 적용
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)', // 그림자 효과 추가
        }}
        handleStyles={{
          left: {
            cursor: 'ew-resize',
            width: '8px',
            height: '90px',
            background: 'white',
            border: '3px solid lightgray',
            borderRadius: '8px',
            textAlign: 'center',
            zIndex: 10,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#e4e4e7',
          },
          top: {
            cursor: 'ns-resize',
            width: '90px',
            height: '8px',
            background: 'white',
            border: '3px solid lightgray',
            borderRadius: '8px',
            textAlign: 'center',
            zIndex: 10,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: '-3px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#e4e4e7',
          },
        }}
      >
        <div className=" ">
          <iframe
            src={url}
            loading="lazy"
            style={{ width: '100%', height: `${size.height}px` }} // iframe 높이 동기화
            frameBorder="0"
            allowFullScreen
            title="Chatbot"
          ></iframe>
        </div>
      </Resizable>
    </Dialog>
  );
};

export default ChatbotModal;
