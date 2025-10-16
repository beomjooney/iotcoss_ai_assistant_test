import React from 'react';
import Checkbox from '@mui/material/Checkbox';

const QuizBreakerInfoCheckContent = ({
  questionText,
  index,
  // selectedQuizIds = [], // Default to empty array,
  // handleCheckboxChange,
}) => {
  return (
    <div className="tw-flex tw-items-center tw-space-x-3 tw-mb-3">
      <Checkbox
        disableRipple
        // checked={selectedQuizIds.includes(index)}
        // onChange={() => handleCheckboxChange(index)}
        name={index}
        size="medium"
        className="tw-mr-3"
        sx={{
          '&.Mui-checked': {
            color: 'blue',
          },
          '& .MuiSvgIcon-root': { fontSize: 24 },
        }}
      />
      <div className="tw-flex tw-items-center tw-relative tw-overflow-visible tw-rounded-lg border tw-h-12 tw-w-full">
        <div className="tw-p-5 tw-w-11/12 tw-line-clamp-2 tw-text-base tw-font-medium tw-text-left tw-text-[#31343d]">
          {questionText}
        </div>
      </div>
    </div>
  );
};

export default QuizBreakerInfoCheckContent;
