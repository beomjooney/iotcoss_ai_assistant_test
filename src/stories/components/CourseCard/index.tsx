// QuizClubDetailInfo.jsx
import React, { useEffect, useState } from 'react';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useSaveLike, useDeleteLike, useSaveReply, useDeleteReply } from 'src/services/community/community.mutations';
import { getButtonText } from 'src/utils/clubStatus';

const CourseCard = ({ data, border = false }) => {
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();

  let [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    setIsLiked(data?.isFavorite);
  }, [data]);

  const onChangeLike = function (postNo: number) {
    event.preventDefault();
    setIsLiked(!isLiked);
    if (isLiked) {
      onDeleteLike(postNo);
    } else {
      onSaveLike(postNo);
    }
  };

  return (
    <div
      onClick={() => {
        window.location.href = `/quiz/${data.clubSequence}`;
      }}
      className={`tw-h-[142px] tw-cursor-pointer tw-relative tw-overflow-hidden  tw-bg-white ${
        border ? 'border-left border-right border-top tw-rounded-t-lg' : 'border tw-rounded-lg'
      }`}
    >
      <img src={data.clubImageUrl} className="tw-w-[132px] tw-h-[142px] tw-object-cover tw-float-left" />

      <div className="tw-flex tw-justify-start tw-items-start tw-gap-1 tw-ml-[148px] tw-mt-4">
        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-black">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-white">
            {getButtonText(data.clubStatus)}
          </p>
        </div>
        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#d7ecff]">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#235a8d]">
            {data.jobGroups[0].name || 'N/A'}
          </p>
        </div>
        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#e4e4e4]">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#313b49]">
            {data.jobs[0].name || 'N/A'}
          </p>
        </div>
        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-1 tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#ffdede]">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#b83333]">
            {data.jobLevels[0].name || 'N/A'}
          </p>
        </div>
        <div className="tw-flex tw-justify-end tw-items-center tw-ml-auto tw-pr-4">
          <button
            className="tw-absolute tw-pl-2 tw-pt-2"
            onClick={event => {
              event.stopPropagation();
              onChangeLike(data.clubSequence, data.isFavorite);
            }}
          >
            {isLiked ? <StarIcon color="error" /> : <StarBorderIcon color="disabled" />}
          </button>
        </div>
      </div>

      <div className="tw-py-0">
        <p className="tw-ml-[148px] tw-mt-[18px] tw-text-sm tw-font-bold tw-text-left tw-text-black">{data.clubName}</p>
        <p className="tw-w-[262px] tw-h-6 tw-ml-[148px] tw-mt-1 tw-text-sm tw-text-left tw-text-black">
          {data.description}
        </p>
      </div>
      <div className="tw-ml-[148px]">
        <p className="tw-text-sm tw-text-left tw-text-black">
          <span className="tw-font-bold">{data.leaderNickname}</span>
          <span className="tw-text-left tw-text-[#9ca5b2] tw-ml-4">
            {data.startAt} ~ {data.endAt} | {data.studyCycle.toString() || 'N/A'} | {data.weekCount || 'N/A'} 주 | 학습{' '}
            {data.studyCount || 'N/A'}회
          </span>
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
