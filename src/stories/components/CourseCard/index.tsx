// QuizClubDetailInfo.jsx
import React, { useEffect, useState } from 'react';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useSaveLike, useDeleteLike, useSaveReply, useDeleteReply } from 'src/services/community/community.mutations';
import { getButtonText } from 'src/utils/clubStatus';
import { useSessionStore } from 'src/store/session';

const CourseCard = ({ data, border = false }) => {
  const { roles, memberId } = useSessionStore.getState();
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();
  console.log('CourseCard', data);

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
    // refetch();
  };

  return (
    <div
      onClick={() => {
        if (data.isClubAdmin) {
          // Redirect admins to the dashboard based on the clubType
          data?.clubType === '0100'
            ? (window.location.href = `/quiz-dashboard/${data.clubSequence}`)
            : (window.location.href = `/lecture-dashboard/${data.clubSequence}`);
        } else {
          // Non-admin users go to the regular pages
          data?.clubType === '0100'
            ? (window.location.href = `/quiz/${data.clubSequence}`)
            : (window.location.href = `/lecture/${data.clubSequence}`);
        }
      }}
      className={`tw-h-[142px] tw-cursor-pointer tw-relative tw-overflow-hidden  tw-bg-white ${
        border ? 'border-left border-right border-top tw-rounded-t-lg' : 'border tw-rounded-lg'
      }`}
    >
      <img
        src={data.clubImageUrl || '/assets/images/banner/Rectangle_193.png'}
        className="tw-w-[142px] tw-h-[142px] tw-object-cover tw-float-left"
      />

      <div className="tw-flex tw-justify-start tw-items-start tw-gap-1 tw-ml-[160px] tw-mt-4">
        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-black">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-white">
            {getButtonText(data.clubStatus)}
          </p>
        </div>
        {data?.jobGroups[0]?.name && (
          <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#d7ecff]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#235a8d]">
              {data?.jobGroups[0]?.name || 'N/A'}
            </p>
          </div>
        )}
        {data?.jobs[0]?.name && (
          <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#e4e4e4]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#313b49]">
              {data?.jobs[0]?.name || 'N/A'}
            </p>
          </div>
        )}
        <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-1 tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#ffdede]">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#b83333]">
            {data?.jobLevels[0]?.name || 'N/A'}
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

      <div className="tw-py-0 tw-pr-5">
        <p className="tw-line-clamp-1 tw-ml-[160px] tw-mt-[13px] tw-text-sm tw-font-bold tw-text-left tw-text-black">
          {data?.clubName}
        </p>
        <p className="tw-line-clamp-2 tw-ml-[160px] tw-mt-1 tw-text-sm tw-text-left tw-text-black">
          {data?.description}
        </p>
      </div>
      <div className="tw-ml-[160px] tw-mt-1">
        <p className="tw-text-sm tw-text-left tw-text-black">
          <span className="tw-font-bold">{data.leaderNickname}</span>
          {/* <span className="tw-text-left tw-text-[#9ca5b2] tw-ml-4">
            {data.startAt} ~ {data.endAt} | {data.studyCycle.toString() || 'N/A'} | {data.weekCount || 'N/A'} 주 | 학습{' '}
            {data.studyCount && data.studyCount.length > 0 ? `${data.studyCount}회` : null}
          </span> */}
          <span className="tw-text-left tw-text-[#9ca5b2] tw-ml-4">
            {data?.startAt.split(' ')[0]} ~ {data?.endAt.split(' ')[0]}
            {data?.studyCycle ? ` | ${data?.studyCycle.toString()}` : ''}
            {data?.weekCount ? ` ${data?.weekCount} 주 ` : ''} | 학습 {data?.studyCount || 0}회
          </span>
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
