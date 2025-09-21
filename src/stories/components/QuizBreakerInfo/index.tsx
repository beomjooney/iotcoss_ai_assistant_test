import React from 'react';

const QuizBreakerInfo = ({
  avatarSrc = '',
  userName = '',
  publishDate,
  dayOfWeek,
  questionText,
  isPublished,
  index,
  answerText,
  knowledgeContentTitle = '',
  handleCheckboxDelete,
  handleAddClick,
  isDeleteQuiz,
  hasBeenPublished,
  order,
}) => {
  return (
    <div className="tw-mb-1">
      {index === null ? (
        <div>
          <div className=" tw-relative tw-overflow-visible tw-rounded-lg tw-bg-[#f6f7fb] tw-mb-3 tw-grid tw-grid-cols-[60px_1fr_100px_28px_40px] tw-grid-rows-[auto_auto] tw-h-20 tw-z-10"></div>
          <div className=" tw-flex tw-items-center tw-justify-center tw-my-3 tw-h-[137px] tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border border-[#e9ecf2]">
            <button onClick={e => handleAddClick(order)} className="tw-text-sm tw-text-[#9ca5b2]">
              + 퀴즈 등록해주세요.
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="tw-px-2 tw-relative tw-flex tw-items-center tw-overflow-visible tw-rounded-lg tw-bg-[#f6f7fb] tw-mb-3 tw-h-20">
            <div className="tw-w-[70px] tw-flex tw-flex-col tw-items-center">
              <img
                src={avatarSrc || '/assets/images/account/default_profile_image.png'}
                alt="User Avatar"
                className="tw-w-8 tw-h-8 tw-border tw-rounded-full tw-object-cover"
              />
              <p className="tw-mt-[2px] tw-text-[10px] tw-text-center tw-text-black">{userName}</p>
            </div>
            <div
              className={`tw-w-10/12 tw-text-base tw-text-left tw-flex tw-items-center ${
                isPublished ? 'tw-text-black' : 'tw-text-gray-400'
              }`}
            >
              {questionText}
            </div>
            <div className="tw-w-1/12 tw-flex  tw-items-center  tw-justify-center tw-gap-3">
              <svg
                width={28}
                height={28}
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-w-7 tw-h-7 tw-col-start-5 tw-row-start-1 tw-row-end-3 tw-place-self-center tw-text-center"
                preserveAspectRatio="none"
              >
                <rect x="0.5" y="0.5" width={27} height={27} rx="3.5" stroke="#31343D" />
                <path d="M6 10H22" stroke="#31343D" strokeWidth="1.5" />
                <path d="M6 14H22" stroke="#31343D" strokeWidth="1.5" />
                <path d="M6 18H22" stroke="#31343D" strokeWidth="1.5" />
              </svg>

              {isDeleteQuiz && (
                <svg
                  onClick={e => {
                    e.stopPropagation(); // Prevent drag event
                    handleCheckboxDelete(index);
                    console.log(index);
                  }}
                  width={28}
                  height={28}
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tw-cursor-pointer tw-w-7 tw-h-7 tw-col-start-4 tw-row-start-1 tw-row-end-3 tw-place-self-center"
                  preserveAspectRatio="none"
                >
                  <rect width={28} height={28} rx={4} fill="#31343D" />
                  <path d="M20 8L8 20" stroke="white" strokeWidth="1.5" />
                  <path d="M8 8L20 20" stroke="white" strokeWidth="1.5" />
                </svg>
              )}
            </div>
          </div>
          <div className="tw-my-3 tw-h-[137px] tw-mb-4 tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border border-[#e9ecf2]">
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-w-6 tw-h-6 tw-absolute tw-left-4 tw-top-4"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                stroke="#9CA5B2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="tw-absolute tw-left-[52px] tw-top-[19px] tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
              모범답안 :
            </p>
            <p className="tw-pr-5 tw-line-clamp-3 tw-absolute tw-left-[119px] tw-top-[19px] tw-text-sm tw-text-left tw-text-[#31343d]">
              {answerText}
            </p>
            <div className="tw-py-2 tw-flex tw-justify-start tw-items-start tw-absolute tw-left-[52px] tw-top-[73px] tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#31343d]">지식콘텐츠</p>
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#9ca5b2]">
                {knowledgeContentTitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizBreakerInfo;
