// QuizClubDetailInfo.jsx
import React from 'react';

const CourseCard = ({ data }) => {
  return (
    <div className="tw-h-[142px] tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border tw-border-[#e9ecf2]">
      <img src={data.imageSrc} className="tw-w-[132px] tw-h-[142px] tw-object-cover tw-float-left" />

      <div className="tw-flex tw-justify-start tw-items-start tw-gap-1 tw-ml-[148px] tw-mt-4">
        <div
          className={`tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[${
            data.status === '진행중' ? '#313b49' : data.status === '종료' ? '#6c757d' : '#ffc107'
          }]`}
        >
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-white">{data.status}</p>
        </div>
        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#d7ecff]">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#235a8d]">{data.college}</p>
        </div>
        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#e4e4e4]">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#313b49]">{data.department}</p>
        </div>
        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-1 tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#ffdede]">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#b83333]">{data.year}</p>
        </div>
        <div className="tw-flex tw-justify-end tw-items-center tw-ml-auto tw-pr-4">
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="tw-w-6 tw-h-6"
            preserveAspectRatio="none"
          >
            <path
              d="M22 9.24L14.81 8.62L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.55 13.97L22 9.24Z"
              fill="#E11837"
            />
          </svg>
        </div>
      </div>

      <div className="tw-py-2">
        <p className="tw-ml-[148px] tw-mt-[18px] tw-text-sm tw-font-bold tw-text-left tw-text-black">
          {data.courseTitle}
        </p>
        <p className="tw-w-[262px] tw-h-6 tw-ml-[148px] tw-mt-1 tw-text-sm tw-text-left tw-text-black">
          {data.courseDetails}
        </p>
      </div>
      <div className="tw-ml-[148px]">
        <p className="tw-text-xs tw-text-left tw-text-black">
          {data.professor}
          <span className="tw-text-xs tw-text-left tw-text-[#9ca5b2] tw-ml-4">{data.courseSchedule}</span>
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
