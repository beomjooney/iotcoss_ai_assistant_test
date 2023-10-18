import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { BoardType, ReplyType } from 'src/config/entities';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React, { useEffect, useRef, useState } from 'react';
import { CommunityCardReply, Textfield, Button, Pagination } from 'src/stories/components';
import { User } from 'src/models/user';

import { useRepliesList } from 'src/services/community/community.queries';
import { useSessionStore } from 'src/store/session';
const { logged } = useSessionStore.getState();
import Grid from '@mui/material/Grid';
import Tooltip from '../Tooltip';
import { useRouter } from 'next/router';

/** import textarea */
import TextareaAutosize from '@mui/material/TextareaAutosize';

/** like */
import {
  useSaveReply,
  useDeleteReply,
  useQuizLike,
  useQuizDeleteLike,
  useQuizOnePick,
  useQuizDeleteOnePick,
} from 'src/services/community/community.mutations';

/** import icon */
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
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
  const { beforeOnePick, update } = useSessionStore.getState();
  // TODO 좋아요 여부 필드 수정 필요
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [postNo, setPostNo] = useState(0);
  let [isLiked, setIsLiked] = useState(false);
  let [isOnePick, setIsOnePick] = useState(false);
  let [isOpen, setIsOpened] = useState(false);
  let [likeCount, setLikeCount] = useState(0);
  let [onePickCount, setOnePickCount] = useState(0);
  let [replyCount, setReplyCount] = useState(0);
  let [repliesList, setRepliesList] = useState([]);
  let [beforeOnePickInner, setBeforeOnePickInner] = useState(0);
  /** one pick */
  const { mutate: onSaveLike } = useQuizLike();
  const { mutate: onDeleteLike } = useQuizDeleteLike();

  const { mutate: onSaveOnePick, isError, isSuccess } = useQuizOnePick();
  const { mutate: onDeleteOnePick, isSuccess: isDeleteOnePick } = useQuizDeleteOnePick();
  const { mutate: onDeleteOnePickCallBack, isSuccess: isDeleteOnePickCallBack } = useQuizDeleteOnePick();

  /** 댓글 */
  const { mutate: onSaveReply, isSuccess: replyReplySucces } = useSaveReply();
  const { mutate: onDeleteReply, isSuccess: deleteReplySucces } = useDeleteReply();

  const [params, setParams] = useState<any>({ postNo, page, size: 10 });

  /** 댓글 리스트 */
  const {
    isFetched: isReplyFetched,
    refetch,
    isSuccess: replayListSuccess,
  } = useRepliesList(params, data => {
    setRepliesList(data.data.data.clubQuizReplies.contents);
    setTotalPage(data.data.data.clubQuizReplies.totalPages);
  });

  useDidMountEffect(() => {
    refetch();
  }, [replyReplySucces]);

  useDidMountEffect(() => {
    if (page) {
      setParams({
        postNo: postNo,
        page,
        size: 10,
      });
    }
  }, [page]);

  useDidMountEffect(() => {
    if (params) refetch();
  }, [params]);

  // useDidMountEffect(() => {
  //   refetch();
  // }, [replayListSuccess]);

  useEffect(() => {
    if (isError) {
      alert(`원픽은 하나만 선택할 수 있어요.\n기존 원픽을 취소해 주세요.`);
    }
  }, [isError]);
  useEffect(() => {
    if (isDeleteOnePick) {
      setIsOnePick(false);
      // onePickCount가 0보다 클 때만 감소시킵니다.
      if (onePickCount > 0) {
        setOnePickCount(onePickCount - 1);
      }
    }
  }, [isDeleteOnePick]);

  useEffect(() => {
    if (isSuccess) {
      setIsOnePick(true);
      setOnePickCount(onePickCount + 1);
      update({
        beforeOnePick: beforeOnePickInner,
      });
    }
  }, [isSuccess]);

  // refetch();
  // useDidMountEffect(() => {
  //   refetch();
  // }, [postNo]);

  useEffect(() => {
    setIsLiked(board?.isLiked);
    setIsOnePick(board?.isOnePicked);
    setLikeCount(board?.likeCount);
    setReplyCount(board?.replyCount);
    setOnePickCount(board?.onePickCount);
  }, [board]);

  const textInput = useRef(null);

  const onReplySubmit = (postNo: number, text: string) => {
    if (logged) {
      onSaveReply({
        clubQuizAnswerSequence: postNo,
        body: text,
      });
      textInput.current.value = '';
      setReplyCount(replyCount => replyCount + 1);
      setParams({
        postNo: postNo,
        page,
        size: 10,
      });
      setIsOpened(true);
    } else {
      alert('로그인 후 댓글을 입력할 수 있습니다.');
    }
  };

  const onReplyDeleteSubmit = (postReplyNo: number, parentPostNo: number) => {
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
        // onePickCount가 0보다 클 때만 감소시킵니다.
        if (likeCount > 0) {
          setLikeCount(likeCount - 1);
        }
        onDeleteLike(postNo);
      } else {
        setLikeCount(likeCount => likeCount + 1);
        onSaveLike(postNo);
      }
    } else {
      alert('로그인 후 좋아요를 클릭 할 수 있습니다.');
    }
  };

  const onChangeOnePick = function (postNo: number) {
    if (logged) {
      onSaveOnePick(postNo);
      setBeforeOnePickInner(postNo);
    } else {
      alert('로그인 후 원픽을 클릭 할 수 있습니다.');
    }
  };
  const onChangeDeleteOnePick = async function (postNo: number) {
    if (logged) {
      await onDeleteOnePick(postNo);
    } else {
      alert('로그인 후 원픽을 클릭 할 수 있습니다.');
    }
  };

  const onButtonReply = function (postNo: number) {
    setParams({
      postNo: postNo,
      page,
      size: 10,
    });
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
    <div className={cx('community-board-container', className)}>
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
              className={cx('rounded-circle', 'profile-image', 'tw-h-12', 'tw-w-12')}
            />
            <div>
              <div className="tw-font-bold tw-text-lg tw-text-black">{board?.nickname}</div>
            </div>
            <div>
              <div className="tw-text-sm">{board.createdAt.toString().split(' ')[0]}</div>
            </div>
            <div>{/* <div className="tw-text-sm">{timeForToday(board.createdAt)}</div> */}</div>
          </div>
          <div className={cx('date-area', 'col-md-2')}></div>
        </div>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={8}
          placeholder="답변을 25자 이상 입력해주세요."
          style={{
            width: '100%',
            // backgroundColor: '#F9F9F9',
            border: '1px solid #EFEFEF',
            borderRadius: 10,
            fontSize: '14px',
            color: 'black',
            padding: 25,
            resize: 'none',
            overflow: 'auto',
            maxHeight: '320px', // 최대 높이 설정 (스크롤을 표시하려면 설정)
          }}
          name="introductionMessage"
          value={board?.postAnswer}
        />

        <div className="tw-grid tw-items-center tw-grid-cols-12 tw-py-3 tw-mt-1">
          <div className="tw-col-span-3">
            <div className="tw-flex tw-items-center tw-gap-4">
              <span className="tw-flex tw-items-center">
                <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                {board?.replyCount}
              </span>
              <span className="tw-flex tw-items-center">
                {/* <button
                  className="tw-flex tw-items-center"
                  onClick={() => {
                    onChangeOnePick(board?.clubQuizAnswerSequence, board?.isOnePick);
                  }}
                > */}
                {isOnePick ? (
                  <button
                    onClick={() => {
                      onChangeDeleteOnePick(board?.clubQuizAnswerSequence, board?.isOnePick);
                    }}
                  >
                    <StarIcon color="primary" className="tw-mr-1" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onChangeOnePick(board?.clubQuizAnswerSequence, board?.isOnePick);
                    }}
                  >
                    <StarBorderIcon color="disabled" className="tw-mr-1" />
                  </button>
                )}
                <span>{onePickCount}</span>
                {/* </button> */}
              </span>
              <span>
                <button
                  className="tw-flex tw-items-center"
                  onClick={() => {
                    onChangeLike(board?.clubQuizAnswerSequence, board?.isLiked);
                  }}
                >
                  {isLiked ? (
                    <FavoriteIcon color="primary" className="tw-mr-1 tw-w-5" />
                  ) : (
                    <FavoriteBorderIcon color="disabled" className="tw-mr-1 tw-w-5" />
                  )}
                  <span>{likeCount}</span>
                </button>
              </span>
            </div>
          </div>
          <div className="tw-col-span-9 tw-flex tw-items-center tw-justify-end ">
            <Textfield
              width={400}
              defaultValue=""
              placeholder="댓글을 입력해주세요."
              ref={textInput}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  onReplySubmit(board?.clubQuizAnswerSequence, textInput.current.value);
                }
              }}
            />
            <button
              className="tw-bg-gray-400 tw-text-sm tw-text-white tw-px-5 tw-ml-2 tw-rounded-md tw-h-10"
              onClick={() => onReplySubmit(board?.clubQuizAnswerSequence, textInput.current.value)}
            >
              입력
            </button>

            <button
              className={cx('board-footer__reply', 'tw-text-[14px] tw-pl-4')}
              onClick={() => {
                onButtonReply(board.clubQuizAnswerSequence);
              }}
            >
              댓글 {replyCount}개{isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </button>
          </div>
        </div>
      </div>
      {isReplyFetched && isOpen && (
        <div className={cx('reply-container')}>
          <div className={cx('reply-container__content')}>
            {repliesList.map((reply, i) => {
              return (
                // TODO API Response 보고 댓글 작성자로 수정 필요
                <CommunityCardReply key={i} reply={reply} refetch={refetch} />
              );
            })}
          </div>
          <div className="tw-flex tw-justify-center tw-my-5">
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityCard;
