import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { BoardType, ReplyType } from 'src/config/entities';
import Chip from '../Chip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React, { useEffect, useRef, useState } from 'react';
import { CommunityCardReply, Textfield, Button } from 'src/stories/components';
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
import { useRouter } from 'next/router';

/** import textarea */
import TextareaAutosize from '@mui/material/TextareaAutosize';

/** import icon */
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
export interface CommunityCardProps {
  /** 게시판 object */
  board: BoardType;
  /** 작성자 */
  writer: User;
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

const CommunityCard = ({
  board,
  writer,
  className,
  memberId,
  onPostDeleteSubmit,
}: // eslint-disable-next-line @typescript-eslint/no-empty-function
CommunityCardProps) => {
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
    setIsLiked(board?.liked);
    setLikeCount(board?.likeReactionCount);
    setReplyCount(board?.replyCount);
  }, [board]);

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
    if (logged) {
      setIsLiked(!isLiked);
      if (isLiked) {
        setLikeCount(likeCount => likeCount - 1);
        onDeleteLike(postNo);
      } else {
        setLikeCount(likeCount => likeCount + 1);
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

  function SkillSelectPage(probs) {
    switch (probs.name) {
      case '개발':
        return (
          <Chip chipColor="develop" variant="outlined" radius={4} className="mr-2">
            {probs.name}
          </Chip>
        );
      case '디자인':
        return (
          <Chip chipColor="design" variant="outlined" radius={4} className="mr-2">
            {probs.name}
          </Chip>
        );
      case '기획':
        return (
          <Chip chipColor="plan" variant="outlined" radius={4} className="mr-2">
            {probs.name}
          </Chip>
        );
      default:
        return (
          <Chip chipColor="engineering" variant="outlined" radius={4} className="mr-2">
            {probs.name}
          </Chip>
        );
    }
  }

  const router = useRouter();
  return (
    <div className={cx('community-board-container tw-p-2', className)}>
      <div className={cx('main-container')}>
        <div className={cx('board-header', 'row')}>
          <div className="tw-flex tw-items-center tw-space-x-4 tw-my-5 tw-gap-2">
            {/* {board.postNo} */}
            <img
              src={
                board?.profileImageUrl.indexOf('http') > -1
                  ? board?.profileImageUrl
                  : `${process.env['NEXT_PUBLIC_GENERAL_API_URL']}/images/${board?.profileImageUrl}`
              }
              alt={'image'}
              className={cx('rounded-circle', 'profile-image', 'tw-h-12')}
            />
            <div>
              {/*TODO 원래 job(직업)임*/}
              <div className="tw-font-bold tw-text-lg tw-text-black">{board?.nickname}</div>
            </div>
            <div>
              <div className="tw-text-sm">{board.createdAt.toString().split(' ')[0]}</div>
            </div>
            <div>{/* <div className="tw-text-sm">{timeForToday(board.createdAt)}</div> */}</div>
          </div>
          <div className={cx('date-area', 'col-md-2')}>
            {/* {memberId == board.author.memberId ? (
              <div>
                <Chip
                  className="mr-2"
                  chipColor="black"
                  radius={4}
                  variant="outlined"
                  onClick={() => onPostDeleteSubmit(board.postNo)}
                >
                  삭제
                </Chip>
                <Chip
                  chipColor="black"
                  radius={4}
                  variant="outlined"
                  onClick={() => router.push(`/community/write/${board.postNo}`)}
                >
                  수정
                </Chip>
              </div>
            ) : (
              <div></div>
            )} */}
          </div>
        </div>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={9}
          placeholder="답변을 25자 이상 입력해주세요."
          style={{
            width: '100%',
            // backgroundColor: '#F9F9F9',
            border: '2px solid #EFEFEF',
            borderRadius: '15px',
            padding: 12,
            resize: 'none',
            maxHeight: '320px', // 최대 높이 설정 (스크롤을 표시하려면 설정)
          }}
          name="introductionMessage"
          value={board?.postAnswer}
        />

        <div className="tw-grid tw-items-center tw-grid-cols-6 tw-py-3 tw-mt-2">
          <div className="tw-col-span-2">
            <div className="tw-flex tw-items-center tw-gap-4">
              <span>
                <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                {board?.replyCount}
              </span>
              <span>
                <StarBorderIcon className="tw-mr-1  tw-w-5" />
                <span>{board?.onePickCount}</span>
              </span>
              <span>
                <FavoriteBorderIcon className="tw-mr-1  tw-w-5" />
                <span>{board?.likeCount}</span>
              </span>
            </div>
          </div>
          <div className="tw-col-span-4 tw-flex tw-justify-end">
            {/* <Textfield width={400} defaultValue="" placeholder="댓글을 입력해주세요." ref={textInput} />
            <button
              className="tw-bg-black tw-text-white px-4  tw-ml-2 tw-rounded-md"
              onClick={() => onReplySubmit(board.postNo, textInput.current.value)}
            >
              입력
            </button> */}
          </div>
        </div>
        {/* <div className={cx('board-footer')}>
          <span className={cx('board-footer__reaction')}>
            <button
              onClick={() => {
                onChangeLike(board.postNo);
              }}
            >
              {isLiked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon color="disabled" />}
            </button>
            <span className={cx('reaction__count', { 'reaction__count--active': isLiked })}>{likeCount}</span>
          </span>
          <button
            className={cx('board-footer__reply')}
            onClick={() => {
              onReply(board.postNo);
            }}
          >
            댓글 {replyCount}개{isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </button>
        </div> */}
      </div>
      {isOpen && (
        <div className={cx('reply-container')}>
          <div className={cx('reply-container__content')}>
            {repliesList.map((reply, i) => {
              return (
                // TODO API Response 보고 댓글 작성자로 수정 필요
                <CommunityCardReply
                  key={i}
                  reply={reply}
                  writer={writer}
                  memberId={memberId}
                  onReplyDeleteSubmit={onReplyDeleteSubmit}
                />
              );
            })}
          </div>
          <div className={cx('reply-container__form', 'row')}>
            <div className={cx('form-input', 'col-md-11')}>
              {/*TODO value를 onReplySubmit에 전달?*/}
              <Textfield defaultValue="" placeholder="댓글을 입력하세요." ref={textInput} />
            </div>
            <div className={cx('form-button', 'col-md-1')}>
              <Button color="gray" label="버튼" onClick={() => onReplySubmit(board.postNo, textInput.current.value)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityCard;
