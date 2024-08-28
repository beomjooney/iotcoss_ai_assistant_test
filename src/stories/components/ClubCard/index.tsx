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

export interface ClubCardProps {
  /** 게시판 object */
  item: any;
  /** 작성자 */
  xs: number;
  /** className */
  className?: any;
}

const cx = classNames.bind(styles);

const ClubCard = ({
  item,
  xs,
}: // eslint-disable-next-line @typescript-eslint/no-empty-function
ClubCardProps) => {
  const { logged } = useSessionStore.getState();
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();

  // TODO 좋아요 여부 필드 수정 필요
  let [isLiked, setIsLiked] = useState(false);
  let [isOpen, setIsOpened] = useState(false);
  let [likeCount, setLikeCount] = useState(0);
  let [replyCount, setReplyCount] = useState(0);
  let [postNo, setPostNo] = useState(0);
  let [repliesList, setRepliesList] = useState([]);
  const { mutate: onSaveReply, isSuccess: replyReplySucces } = useSaveReply();
  const { mutate: onDeleteReply, isSuccess: deleteReplySucces } = useDeleteReply();

  useEffect(() => {
    setIsLiked(item?.isFavorite);
  }, [item]);

  const textInput = useRef(null);

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
    <Grid item xs={xs}>
      <a
        href={logged ? '/quiz/' + `${item.clubSequence}` : '#'}
        onClick={e => {
          if (!logged) {
            e.preventDefault();
            alert('로그인 후 이동할 수 있습니다.');
          }
        }}
        className=" tw-flex tw-flex-col tw-bg-white border tw-rounded-lg md:tw-flex-row tw-w-full tw-h-[230px]"
      >
        <img
          className="tw-object-cover tw-min-w-[230px] tw-w-[225px] tw-rounded-t-lg tw-h-[240px] md:tw-h-[230px] md:tw-w-[230px] md:tw-rounded-none md:tw-rounded-l-lg"
          src={item?.clubImageUrl || '/assets/images/banner/Rectangle_193.png'}
          alt=""
        />
        <div className="tw-flex tw-w-full tw-flex-col tw-p-[12px]">
          <Grid container direction="row" justifyContent="space-between" alignItems="center" rowSpacing={0}>
            <Grid item xs={12}>
              <div className="max-lg:tw-h-[100px] tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                <span className="tw-inline-flex tw-bg-blue-100 tw-text-blue-800 tw-text-xs tw-font-medium tw-mr-1 tw-px-2 tw-py-1 tw-rounded">
                  {item?.jobGroups[0].name || 'N/A'}
                </span>
                <span
                  // key={index}
                  className="tw-inline-flex tw-bg-gray-100 tw-text-gray-800 tw-text-xs tw-font-medium tw-mr-1 tw-px-2 tw-py-1 tw-rounded "
                >
                  {item?.jobs?.[0]?.name || 'N/A'}
                </span>
                {/* ))} */}

                {/* {item?.jobLevels?.length > 0 &&
                      item.jobLevels.map((jobLevel, index) => ( */}
                <span
                  // key={index}
                  className="tw-inline-flex tw-bg-red-100 tw-text-red-800 tw-text-xs tw-font-medium tw-mr-1 tw-px-2 tw-py-1 tw-rounded "
                >
                  {item?.jobLevels?.[0]?.name || 'N/A'}
                </span>
                {/* ))} */}
              </div>
            </Grid>
          </Grid>
          <div className="tw-my-[12px] tw-text-[12px] tw-font-bold tw-text-[#9a9a9a]">
            모집마감일 : {item?.recruitDeadlineAt?.split(' ')[0] || 'N/A'}
          </div>
          <div className=" tw-h-[70px]">
            <h6 className="tw-line-clamp-2 max-lg:tw-h-[112px] tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900">
              {item.clubName}
            </h6>
            <div className="tw-line-clamp-2 tw-text-base tw-tracking-tight tw-text-gray-900">{item.description}</div>
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
              className="tw-pl-2 tw-pt-2 tw-ml-auto"
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
