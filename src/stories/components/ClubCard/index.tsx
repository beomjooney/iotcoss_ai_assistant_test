import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { BoardType, ReplyType } from 'src/config/entities';
import Chip from '../Chip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React, { useEffect, useRef, useState } from 'react';
import { ClubCardReply, Textfield, Button } from 'src/stories/components';
import { jobColorKey } from 'src/config/colors';
import { User } from 'src/models/user';
import {
  useSaveLike,
  useDeleteLike,
  useSaveReply,
  useDeleteReply,
  useDeletePost,
} from 'src/services/community/community.mutations';
import { useRepliesList } from 'src/services/community/community.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useSessionStore } from 'src/store/session';
const { logged } = useSessionStore.getState();
import Grid from '@mui/material/Grid';
import Tooltip from '../Tooltip';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useRouter } from 'next/router';

export interface ClubCardProps {
  /** 게시판 object */
  item: BoardType;
  /** 작성자 */
  writer: User;
  xs: number;
  /** className */
  className?: string;
  /** 댓글 작성 버튼 클릭 이벤트 */
  onReplySubmit?: (string) => void;
  /** 좋아요 클릭 이벤트 */
  onChangeLike?: (boolean) => void;
  memberId: string;
  onPostDeleteSubmit: (...args: any[]) => any;
}

const cx = classNames.bind(styles);

const ClubCard = ({
  item,
  xs,
  writer,
  className,
  memberId,
  onPostDeleteSubmit,
}: // eslint-disable-next-line @typescript-eslint/no-empty-function
ClubCardProps) => {
  // const { jobGroupName, jobGroup } = writer;
  // const chipColor = jobColorKey(jobGroup);
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
  // const { isFetched: isReplyFetched, refetch } = useRepliesList(postNo, data => {
  //   setRepliesList(data.data);
  // });

  // useEffect(() => {
  //   refetch();
  // }, [postNo, replyReplySucces, deleteReplySucces]);

  useEffect(() => {
    setIsLiked(item?.isFavorite);
    // setLikeCount(item?.likeReactionCount);
    // setReplyCount(item?.replyCount);
  }, [item]);

  const textInput = useRef(null);

  const onReplySubmit = (postNo: number, text: string) => {
    console.log('text : ', text, postNo);
    if (logged) {
      onSaveReply({
        postNo: postNo,
        data: {
          body: text,
        },
      });
      textInput.current.value = '';
      setReplyCount(replyCount => replyCount + 1);
    } else {
      alert('로그인 후 댓글을 입력할 수 있습니다.');
    }
  };

  const onReplyDeleteSubmit = (postReplyNo: number, parentPostNo: number) => {
    console.log('delete post', postReplyNo, parentPostNo);
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      onDeleteReply({
        postReplyNo: postReplyNo,
        parentPostNo: parentPostNo,
      });
      setReplyCount(replyCount => replyCount - 1);
    }
  };

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

  const onReply = function (postNo: number) {
    console.log('onReplay click. ', postNo);
    setPostNo(postNo);
    setIsOpened(!isOpen);
  };

  function timeForToday(value) {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    if (betweenTime < 1) return '방금 전';
    if (betweenTime < 60) {
      return `${betweenTime}분 전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간 전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
      return `${betweenTimeDay}일 전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
  }

  const router = useRouter();
  return (
    <Grid item xs={xs}>
      <a
        href={'/quiz/' + `${item.sequence}`}
        className="tw-flex tw-flex-col tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow md:tw-flex-row tw-w-full "
      >
        <img
          className="tw-object-cover tw-w-[200px] tw-rounded-t-lg tw-h-[240px] md:tw-h-[240px] md:tw-w-[200px] md:tw-rounded-none md:tw-rounded-l-lg"
          src={item?.clubImageUrl}
          alt=""
        />
        <div className="tw-flex tw-w-full tw-flex-col tw-justify-between tw-p-5 tw-leading-normal">
          <Grid
            className=" tw-mb-3"
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            rowSpacing={0}
          >
            <Grid item xs={11}>
              <div className="tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                {/* {item?.recommendJobGroupNames.map((name, i) => (
                  <span
                    key={i}
                    className="tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded"
                  >
                    {name}
                  </span>
                ))} */}
                {/* {item?.recommendLevels.map((name, i) => (
                  <span
                    key={i}
                    className="tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded "
                  >
                    {name} 레벨
                  </span>
                ))} */}
                {/* {item?.recommendJobNames.map((name, i) => (
                  <span
                    className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded "
                    key={i}
                  >
                    {name}
                  </span>
                ))} */}
                <span className="tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
                  {item?.recommendJobGroupNames[0]}
                </span>

                <span className="tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded ">
                  {item?.recommendLevels[0]} 레벨
                </span>

                <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded ">
                  {item?.recommendJobNames[0]}
                </span>

                {/* {item?.relatedExperiences.map((name, i) => (
                  <Chip
                    key={`job_${i}`}
                    chipColor={jobColorKey(item?.relatedExperiences[i])}
                    radius={4}
                    className="tw-mr-2"
                    variant="outlined"
                  >
                    {name}
                  </Chip>
                ))} */}
              </div>
            </Grid>
            <Grid item xs={1} className="">
              <button
                onClick={() => {
                  onChangeLike(item.sequence, item.isFavorite);
                }}
              >
                {isLiked ? <StarIcon color="primary" /> : <StarBorderIcon color="disabled" />}
              </button>
            </Grid>
          </Grid>
          <div className="tw-mb-3 tw-text-sm tw-font-semibold tw-text-gray-500 dark:tw-text-gray-400">
            모집마감일 : {item?.recruitDeadlineAt}
          </div>
          <h6 className="tw-mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
            {item.name}
          </h6>
          {/* <p className="tw-line-clamp-2 tw-mb-3 tw-font-normal tw-text-gray-700 dark:tw-text-gray-400">
            {item.description}
          </p> */}

          <div className="tw-mb-3 tw-text-sm tw-font-semibold tw-text-gray-400 dark:tw-text-gray-400">
            {item.studyCycle.toString()} | {item.studyCount} 주 | 학습 {item.weekCount}회
          </div>

          <div className="tw-flex tw-items-center tw-space-x-4">
            <img className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full" src={item?.leaderProfileImageUrl} alt="" />
            <div className="tw-text-sm tw-font-semibold tw-text-black">
              <div>{item?.leaderNickname}</div>
            </div>
          </div>
        </div>
      </a>
    </Grid>
  );
};

export default ClubCard;
