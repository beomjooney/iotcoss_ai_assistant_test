import { useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next'); // Modal 접근성 설정

const ChatbotModal = ({ isOpen, onRequestClose, token }) => {
  console.log(token);
  // const url = `http://3.39.99.82:9998/aichatbot?accessToken=${token}`;
  const url = `http://localhost:3000/aichatbot?accessToken=${token}`;

  // useEffect(() => {
  //   if (isOpen) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'auto';
  //   }
  // }, [isOpen]);

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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="tw-fixed tw-bottom-4 tw-right-4 tw-w-[450px] tw-h-[700px]"
      overlayClassName="tw-fixed tw-inset-0"
      contentLabel="Chatbot Modal"
    >
      <div className=" tw-h-[700px] tw-bg-white tw-rounded-lg tw-overflow-hidden tw-shadow-xl tw-transform tw-transition-all sm:tw-w-full sm:tw-max-w-lg md:tw-max-w-2xl lg:tw-max-w-3xl xl:tw-max-w-4xl">
        <div className="tw-border-b">
          {/* <button
            onClick={onRequestClose}
            className="tw-absolute tw-top-4 tw-right-4 tw-text-gray-600 tw-hover:tw-text-gray-900"
          >
            &times;
          </button> */}
        </div>
        <div className="">
          <iframe src={url} className="tw-w-full tw-h-[690px]" frameBorder="0" allowFullScreen title="Chatbot"></iframe>
        </div>
      </div>
    </Modal>
  );
};

export default ChatbotModal;
