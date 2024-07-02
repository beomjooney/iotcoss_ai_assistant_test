import React from 'react';
import Tooltip from 'src/stories/components/Tooltip';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Checkbox from '@mui/material/Checkbox';

const cx = classNames.bind(styles);

const QuizBreakerInfoCheck = ({
  avatarSrc = '',
  userName = 'Unknown User',
  questionText,
  index,
  hashtags,
  tags,
  selectedQuizIds = [], // Default to empty array,
  answerText,
  knowledgeContentTitle = '[영상] CircuitBreaker를 이용한 외부 API 장애 관리',
  handleCheckboxChange,
}) => {
  return (
    <div>
      <div className="tw-relative tw-overflow-visible tw-rounded-lg tw-bg-[#f6f7fb] tw-mb-3 tw-grid tw-grid-cols-[60px_1fr_100px] tw-grid-rows-[auto_auto] tw-h-20 tw-z-10">
        <img
          src={avatarSrc}
          alt="User Avatar"
          className="tw-w-8 tw-h-8 tw-col-start-1 tw-row-start-1 tw-row-end-2 tw-mt-[11px] tw-ml-[22px] tw-rounded-full tw-object-cover"
        />
        <p className="tw-col-start-1 tw-row-start-2 tw-row-end-3 tw-mt-[2px] tw-ml-[22px] tw-text-[10px] tw-text-left tw-text-black">
          {userName}
        </p>
        <p className="tw-col-start-2 tw-col-end-3 tw-row-start-1 tw-row-end-3 tw-text-base tw-text-left tw-text-black tw-mt-7 tw-ml-[33px]">
          {questionText}
        </p>
        <p className="tw-w-7 tw-h-5 tw-col-start-3 tw-row-start-1 tw-row-end-1 tw-place-self-center">
          <Checkbox
            disableRipple
            checked={selectedQuizIds.includes(index)}
            onChange={() => handleCheckboxChange(index)}
            name={index}
            size="medium"
            className="tw-mr-3"
            sx={{
              '&.Mui-checked': {
                color: 'red',
              },
              '& .MuiSvgIcon-root': { fontSize: 28 },
            }}
          />
        </p>
      </div>
      <div className="tw-my-3 tw-h-[170px] tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border border-[#e9ecf2]">
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

        <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[52px] tw-top-5 tw-gap-3">
          {/* Render tags */}
          {tags.map((tag, index) => (
            <div
              key={index}
              className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#d7ecff]"
            >
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#235a8d]">{tag}</p>
            </div>
          ))}
          {/* Render hashtags */}
          {hashtags.map((hashtag, index) => (
            <div
              key={index}
              className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-border tw-border-[#ced4de]"
            >
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#ced4de]">#{hashtag}</p>
            </div>
          ))}
        </div>

        <p className="tw-absolute tw-left-[52px] tw-top-[45px] tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
          모범답안 :
        </p>
        <p className="tw-pr-5 tw-line-clamp-3 tw-absolute tw-left-[119px] tw-top-[45px] tw-text-sm tw-text-left tw-text-[#31343d]">
          {answerText}
        </p>
        <div className="tw-pt-2 tw-flex tw-justify-start tw-items-start tw-absolute tw-left-[52px] tw-top-[100px] tw-gap-3">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#31343d]">지식컨텐츠</p>
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#9ca5b2]">
            {knowledgeContentTitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizBreakerInfoCheck;
