import React from 'react';
import Checkbox from '@mui/material/Checkbox';

const QuizBreakerInfoContentCheck = ({
  userName = 'Unknown User',
  questionText,
  index,
  tags,
  selectedQuizIds = [], // Default to empty array,
  answerText,
  knowledgeContentTitle = '',
  handleCheckboxChange,
}) => {
  return (
    <div>
      <div className="tw-flex tw-items-center tw-relative tw-overflow-visible tw-rounded-lg tw-bg-[#f6f7fb] tw-mb-3 tw-h-20">
        <div className="tw-w-[70px] tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-sm tw-font-medium tw-text-center tw-text-[#31343d]">
          <img
            src={tags?.memberProfileImageUrl || '/assets/images/account/default_profile_image.png'}
            alt="User Avatar"
            className="tw-w-8 tw-h-8 tw-mt-[11px] tw-rounded-full tw-object-cover"
          />
          <p className="tw-mt-[2px] tw-text-[10px] tw-text-center tw-text-black">{userName}</p>
        </div>

        <div className="tw-p-5 tw-w-11/12 tw-line-clamp-2 tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">
          {questionText}
        </div>
        <div className="tw-w-1/12 tw-text-center tw-text-[#31343d]">
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
        </div>
      </div>
      <div className="tw-p-5 tw-my-3 tw-h-[170px] tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border border-[#e9ecf2]">
        <div className="tw-mb-5 tw-flex tw-justify-start tw-items-center tw-top-5 tw-gap-3">
          <div className="tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500">
            <div className="tw-flex tw-gap-[7px] tw-flex-wrap">
              {tags?.jobGroups?.[0]?.name && (
                <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                  <p className="tw-text-[12.25px] tw-text-[#235a8d]">{tags?.jobGroups[0]?.name}</p>
                </div>
              )}
              {tags?.jobs?.length > 0 &&
                tags?.jobs.map(
                  (job, index) =>
                    job?.name ? (
                      <div key={index} className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                        <p className="tw-text-[12.25px] tw-text-[#b83333]">{job?.name}</p>
                      </div>
                    ) : null, // This will render nothing if job.name is null or undefined
                )}

              {tags?.jobLevels?.length > 0 &&
                tags?.jobLevels.map((jobLevel, index) => (
                  <div key={index} className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                    <p className="tw-text-[12.25px] tw-text-[#313b49]">{jobLevel?.name || 'N/A'}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="tw-flex">
          <div className="tw-w-[70px] tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">모범답안 :</div>
          <div className="tw-w-10/12 tw-line-clamp-3 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
            {answerText}
          </div>
        </div>

        <div className="tw-pt-2 tw-flex tw-justify-start tw-items-start  tw-left-[52px] tw-top-[100px] tw-gap-3">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#31343d]">지식콘텐츠</p>
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#9ca5b2]">
            {knowledgeContentTitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizBreakerInfoContentCheck;
