import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { BoardType } from 'src/config/entities';
import React, { useEffect, useRef, useState } from 'react';
import { User } from 'src/models/user';
import { useSaveLike, useDeleteLike, useSaveReply, useDeleteReply } from 'src/services/community/community.mutations';
import { useSessionStore } from 'src/store/session';
import Grid from '@mui/material/Grid';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { getClubAboutJoyStatus } from 'src/utils/clubStatus';

export interface ClubCardProps {
  /** 게시판 object */
  item: any;
  /** 작성자 */
  xs: number;
  sm: number;
  /** className */
  className?: any;
}

const cx = classNames.bind(styles);

const ClubCard = ({
  item,
  xs,
  sm = 6,
}: // eslint-disable-next-line @typescript-eslint/no-empty-function
ClubCardProps) => {
  const { logged, roles, memberId } = useSessionStore.getState();
  console.log('clubCard', item, roles, memberId, item.leaderUUID);
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();

  // TODO 좋아요 여부 필드 수정 필요
  let [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(item?.isFavorite);
  }, [item]);

  const onChangeLike = function (postNo: number) {
    event.preventDefault();
    if (logged) {
      setIsLiked(!isLiked);
      if (isLiked) {
        onDeleteLike(postNo);
      } else {
        onSaveLike(postNo);
      }
    } else {
      alert('로그인 후 좋아요를 클릭 할 수 있습니다.');
    }
  };

  return (
    <Grid item xs={xs} md={sm}>
      <a
        // href={logged ? '/quiz/' + `${item.clubSequence}` : '#'}
        href={
          logged
            ? item.isClubAdmin
              ? '/quiz-dashboard/' + `${item.clubSequence}`
              : '/quiz/' + `${item.clubSequence}`
            : '#'
        }
        onClick={e => {
          if (!logged) {
            e.preventDefault();
            alert('로그인 후 이동할 수 있습니다.');
          }
        }}
        className=" tw-flex border tw-rounded-lg tw-flex-row tw-w-full tw-h-[230px]"
      >
        <div className="tw-flex tw-basis-2/5 max-sm:tw-w-[150px]">
          <img
            className="tw-object-cover tw-rounded-l-lg tw-h-[240px] max-sm:tw-h-[200px]"
            src={item?.clubImageUrl || '/assets/images/banner/Rectangle_193.png'}
            alt=""
          />
        </div>

        <div className="tw-flex tw-basis-3/5 tw-w-full tw-flex-col sm:tw-flex-col tw-p-5">
          <div className="tw-flex tw-items-center tw-gap-2 tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
            {item?.isPublic ? (
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-inline-flex tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M3.9974 5.33268H9.9974V3.99935C9.9974 3.44379 9.80295 2.97157 9.41406 2.58268C9.02517 2.19379 8.55295 1.99935 7.9974 1.99935C7.44184 1.99935 6.96962 2.19379 6.58073 2.58268C6.19184 2.97157 5.9974 3.44379 5.9974 3.99935H4.66406C4.66406 3.07713 4.98906 2.29102 5.63906 1.64102C6.28906 0.991016 7.07517 0.666016 7.9974 0.666016C8.91962 0.666016 9.70573 0.991016 10.3557 1.64102C11.0057 2.29102 11.3307 3.07713 11.3307 3.99935V5.33268H11.9974C12.3641 5.33268 12.678 5.46324 12.9391 5.72435C13.2002 5.98546 13.3307 6.29935 13.3307 6.66602V13.3327C13.3307 13.6993 13.2002 14.0132 12.9391 14.2743C12.678 14.5355 12.3641 14.666 11.9974 14.666H3.9974C3.63073 14.666 3.31684 14.5355 3.05573 14.2743C2.79462 14.0132 2.66406 13.6993 2.66406 13.3327V6.66602C2.66406 6.29935 2.79462 5.98546 3.05573 5.72435C3.31684 5.46324 3.63073 5.33268 3.9974 5.33268ZM3.9974 13.3327H11.9974V6.66602H3.9974V13.3327ZM7.9974 11.3327C8.36406 11.3327 8.67795 11.2021 8.93906 10.941C9.20017 10.6799 9.33073 10.366 9.33073 9.99935C9.33073 9.63268 9.20017 9.31879 8.93906 9.05768C8.67795 8.79657 8.36406 8.66602 7.9974 8.66602C7.63073 8.66602 7.31684 8.79657 7.05573 9.05768C6.79462 9.31879 6.66406 9.63268 6.66406 9.99935C6.66406 10.366 6.79462 10.6799 7.05573 10.941C7.31684 11.2021 7.63073 11.3327 7.9974 11.3327Z"
                  fill="#31343D"
                />
              </svg>
            ) : (
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M3.9974 14.666C3.63073 14.666 3.31684 14.5355 3.05573 14.2743C2.79462 14.0132 2.66406 13.6993 2.66406 13.3327V6.66602C2.66406 6.29935 2.79462 5.98546 3.05573 5.72435C3.31684 5.46324 3.63073 5.33268 3.9974 5.33268H4.66406V3.99935C4.66406 3.07713 4.98906 2.29102 5.63906 1.64102C6.28906 0.991016 7.07517 0.666016 7.9974 0.666016C8.91962 0.666016 9.70573 0.991016 10.3557 1.64102C11.0057 2.29102 11.3307 3.07713 11.3307 3.99935V5.33268H11.9974C12.3641 5.33268 12.678 5.46324 12.9391 5.72435C13.2002 5.98546 13.3307 6.29935 13.3307 6.66602V13.3327C13.3307 13.6993 13.2002 14.0132 12.9391 14.2743C12.678 14.5355 12.3641 14.666 11.9974 14.666H3.9974ZM3.9974 13.3327H11.9974V6.66602H3.9974V13.3327ZM7.9974 11.3327C8.36406 11.3327 8.67795 11.2021 8.93906 10.941C9.20017 10.6799 9.33073 10.366 9.33073 9.99935C9.33073 9.63268 9.20017 9.31879 8.93906 9.05768C8.67795 8.79657 8.36406 8.66602 7.9974 8.66602C7.63073 8.66602 7.31684 8.79657 7.05573 9.05768C6.79462 9.31879 6.66406 9.63268 6.66406 9.99935C6.66406 10.366 6.79462 10.6799 7.05573 10.941C7.31684 11.2021 7.63073 11.3327 7.9974 11.3327ZM5.9974 5.33268H9.9974V3.99935C9.9974 3.44379 9.80295 2.97157 9.41406 2.58268C9.02517 2.19379 8.55295 1.99935 7.9974 1.99935C7.44184 1.99935 6.96962 2.19379 6.58073 2.58268C6.19184 2.97157 5.9974 3.44379 5.9974 3.99935V5.33268Z"
                  fill="#9CA5B2"
                />
              </svg>
            )}
            <div className="tw-inline-flex tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-w-[72px] tw-h-6 tw-relative tw-gap-1 tw-px-3 tw-py-0.5 tw-rounded-[20px] tw-bg-[#06c090]/5">
              <svg
                width={17}
                height={16}
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-4 tw-h-4 tw-relative"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M7.65156 10.3996L11.6182 6.44961L10.7682 5.59961L7.65156 8.69961L6.2349 7.29961L5.3849 8.14961L7.65156 10.3996ZM8.50156 14.3996C7.62379 14.3996 6.79601 14.2329 6.01823 13.8996C5.24045 13.5663 4.5599 13.1079 3.97656 12.5246C3.39323 11.9413 2.9349 11.2607 2.60156 10.4829C2.26823 9.70516 2.10156 8.87739 2.10156 7.99961C2.10156 7.11072 2.26823 6.28017 2.60156 5.50794C2.9349 4.73572 3.39323 4.05794 3.97656 3.47461C4.5599 2.89128 5.24045 2.43294 6.01823 2.09961C6.79601 1.76628 7.62379 1.59961 8.50156 1.59961C9.39045 1.59961 10.221 1.76628 10.9932 2.09961C11.7655 2.43294 12.4432 2.89128 13.0266 3.47461C13.6099 4.05794 14.0682 4.73572 14.4016 5.50794C14.7349 6.28017 14.9016 7.11072 14.9016 7.99961C14.9016 8.87739 14.7349 9.70516 14.4016 10.4829C14.0682 11.2607 13.6099 11.9413 13.0266 12.5246C12.4432 13.1079 11.7655 13.5663 10.9932 13.8996C10.221 14.2329 9.39045 14.3996 8.50156 14.3996Z"
                  fill="#478AF5"
                />
              </svg>
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#478af5]">
                {getClubAboutJoyStatus(item.clubAboutStatus)}
              </p>
            </div>
          </div>
          <div className="tw-h-[65px]">
            <h6 className=" tw-mt-3 tw-w-full tw-line-clamp-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900">
              {item.clubName}
            </h6>
            <div className="tw-line-clamp-1 tw-text-base tw-tracking-tight tw-text-gray-900">{item.description}</div>
          </div>
          <div className="tw-my-1 tw-text-[12px] tw-font-bold tw-text-[#9a9a9a] tw-mt-8">
            {item?.startAt?.split(' ')[0] || 'N/A'} ~ {item?.endAt?.split(' ')[0] || 'N/A'}
          </div>
          <div className="tw-text-[12px] tw-mb-[12px] tw-font-bold tw-text-[#9a9a9a]">
            {item.studyCycle.length > 0 ? `${item.studyCycle[0].toString()} | ` : ''}
            {item.weekCount || '0'}주 | 학습 {item.studyCount || '0'}회
          </div>

          <div className="tw-flex tw-items-center tw-w-full tw-justify-center tw-gap-2">
            <img
              className="tw-w-8 tw-h-8 border tw-rounded-full"
              src={item?.leaderProfileImageUrl || '/assets/images/account/default_profile_image.png'}
              alt=""
            />
            <div className="tw-text-sm tw-font-semibold tw-text-black">
              <div>{item?.leaderNickname}</div>
            </div>
            <button
              className="tw-pl-2 tw-ml-auto"
              onClick={() => {
                onChangeLike(item.clubSequence);
              }}
            >
              {isLiked ? <StarIcon color="error" /> : <StarBorderIcon color="disabled" />}
            </button>
          </div>
        </div>
      </a>
    </Grid>
  );
};

export default ClubCard;
