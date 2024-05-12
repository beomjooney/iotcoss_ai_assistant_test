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
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
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
    <>
      <Desktop>
        <div className={cx('community-board-container', className)}>
          <div className={cx('main-container')}>
            <div className="tw-flex tw-items-center tw-space-x-4 tw-my-5 tw-gap-2 tw-justify-between">
              <div className="tw-flex tw-items-center tw-gap-2">
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
                  <div className="tw-px-2 tw-font-bold tw-text-base tw-text-black">{board?.nickname}</div>
                </div>
                <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-gap-2">
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#d7ecff]">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#235a8d]">
                      소프트웨어융합대학
                    </p>
                  </div>
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#e4e4e4]">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#313b49]">
                      컴퓨터공학과
                    </p>
                  </div>
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#ffdede]">
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#b83333]">2학년</p>
                  </div>
                </div>
              </div>
              <p className="tw-text-xs tw-text-right tw-text-[#9ca5b2]">{board.createdAt.toString()}</p>
            </div>
            <div className="tw-py-1 tw-text-sm tw-text-left tw-text-[#313b49]">{board?.postAnswer}</div>
            <div className="tw-flex tw-items-center tw-space-x-4 tw-my-5 tw-gap-2 tw-justify-between">
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                <svg
                  width={20}
                  height={21}
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M10 16.4947C9.5485 16.1135 9.0382 15.7171 8.4985 15.2953H8.4915C6.59101 13.816 4.43711 12.1422 3.48581 10.1366C3.17328 9.49803 3.00765 8.80332 3.00001 8.09893C2.99792 7.13241 3.40515 6.20588 4.12968 5.52874C4.8542 4.8516 5.83486 4.48102 6.85001 4.50075C7.67645 4.50199 8.48509 4.72935 9.1796 5.15575C9.48478 5.3443 9.7609 5.57238 10 5.83341C10.2404 5.5734 10.5166 5.34546 10.8211 5.15575C11.5153 4.72927 12.3238 4.50189 13.15 4.50075C14.1651 4.48102 15.1458 4.8516 15.8703 5.52874C16.5948 6.20588 17.0021 7.13241 17 8.09893C16.9928 8.80445 16.8272 9.50035 16.5142 10.1399C15.5629 12.1455 13.4097 13.8187 11.5092 15.2953L11.5022 15.3006C10.9618 15.7197 10.4522 16.1162 10.0007 16.5L10 16.4947ZM6.85001 5.83341C6.19797 5.82564 5.56906 6.06319 5.10001 6.49441C4.64808 6.91697 4.3955 7.49593 4.39995 8.09893C4.40794 8.61233 4.53009 9.11831 4.75841 9.58351C5.20747 10.4489 5.81339 11.232 6.54831 11.897C7.24201 12.5633 8.04 13.2083 8.7302 13.7507C8.9213 13.9007 9.1159 14.0519 9.3105 14.2032L9.433 14.2985C9.6199 14.4437 9.8131 14.5943 10 14.7422L10.0091 14.7342L10.0133 14.7309H10.0175L10.0238 14.7262H10.0273H10.0308L10.0434 14.7162L10.0721 14.6943L10.077 14.6903L10.0847 14.6849H10.0889L10.0952 14.6796L10.56 14.3164L10.6818 14.2212C10.8785 14.0686 11.0731 13.9173 11.2642 13.7674C11.9544 13.225 12.7531 12.5807 13.4468 11.911C14.1818 11.2464 14.7878 10.4634 15.2367 9.59817C15.4691 9.12894 15.593 8.61767 15.6 8.09893C15.6029 7.49779 15.3505 6.92105 14.9 6.49974C14.4318 6.06657 13.8028 5.82707 13.15 5.83341C12.3533 5.82696 11.5918 6.14483 11.057 6.70696L10 7.86638L8.943 6.70696C8.40825 6.14483 7.64666 5.82696 6.85001 5.83341Z"
                    fill="#E11837"
                  />
                </svg>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#313b49] tw-mr-3">
                  {likeCount}
                </p>
                <svg
                  width={20}
                  height={21}
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M4.28621 13.4481L4.98621 13.5917C5.01885 13.4317 4.99565 13.2653 4.92049 13.1203L4.28621 13.4481ZM7.05264 16.2146L7.38049 15.5803C7.23549 15.5051 7.0691 15.4819 6.90906 15.5146L7.05264 16.2146ZM3.57192 16.9289L2.87192 16.7853C2.84823 16.9011 2.85364 17.0209 2.88766 17.1341C2.92168 17.2473 2.98324 17.3502 3.06685 17.4338C3.15045 17.5173 3.25347 17.5788 3.36667 17.6127C3.47988 17.6466 3.59973 17.6519 3.71549 17.6281L3.57192 16.9289ZM15.7148 10.5003C15.7148 12.0158 15.1127 13.4693 14.0411 14.5409C12.9695 15.6125 11.516 16.2146 10.0005 16.2146V17.6431C13.9455 17.6431 17.1433 14.4453 17.1433 10.5003H15.7148ZM4.28621 10.5003C4.28621 8.98476 4.88825 7.53131 5.95988 6.45967C7.03152 5.38803 8.48497 4.78599 10.0005 4.78599V3.35742C6.05549 3.35742 2.85764 6.55528 2.85764 10.5003H4.28621ZM10.0005 4.78599C11.516 4.78599 12.9695 5.38803 14.0411 6.45967C15.1127 7.53131 15.7148 8.98476 15.7148 10.5003H17.1433C17.1433 6.55528 13.9455 3.35742 10.0005 3.35742V4.78599ZM4.92049 13.1203C4.50212 12.3104 4.28458 11.4118 4.28621 10.5003H2.85764C2.85764 11.6796 3.14335 12.7939 3.65192 13.776L4.92049 13.1203ZM10.0005 16.2146C9.08897 16.216 8.19043 15.9985 7.38049 15.5803L6.72478 16.8489C7.73731 17.3721 8.86073 17.6445 10.0005 17.6431V16.2146ZM3.58621 13.3046L2.87192 16.7853L4.27192 17.0724L4.98621 13.5917L3.58621 13.3046ZM3.71549 17.6281L7.19621 16.9146L6.90906 15.5146L3.42835 16.2289L3.71549 17.6281Z"
                    fill="#313B49"
                  />
                  <path
                    d="M7.85742 9.07227H12.1431"
                    stroke="#313B49"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.85742 11.9297H12.1431"
                    stroke="#313B49"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#313b49]">
                  {board?.replyCount}
                </p>
              </div>
              <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-8 tw-h-[21px] tw-flex tw-justify-between tw-items-center"></div>
              <div className="tw-flex tw-justify-end tw-items-end tw-relative tw-gap-3">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#e11837] tw-underline ">
                  수정하기
                </p>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xs tw-text-left tw-text-[#31343d] tw-underline ">
                  삭제하기
                </p>
              </div>
            </div>
            <div className="tw-py-7">
              <svg
                width={'100%'}
                height={1}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
              >
                <line y1="0.5" x2="100%" y2="0.5" stroke="#E9ECF2" />
              </svg>
            </div>

            {/* <TextareaAutosize
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
            /> */}

            <div className="">
              {/* <div className="tw-col-span-3">
                <div className="tw-flex tw-items-center tw-gap-4">
                  <span className="tw-flex tw-items-center">
                    <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                    {board?.replyCount}
                  </span>
                  <span className="tw-flex tw-items-center">
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
              </div> */}

              {/* comment */}
              <div className="tw-grid tw-grid-cols-10 tw-items-center tw-gap-3 tw-py-5">
                <div className="tw-col-span-9">
                  <textarea
                    className="tw-form-control tw-w-full tw-py-[8px] tw-p-5"
                    id="floatingTextarea"
                    placeholder="댓글을 입력해주세요."
                    ref={textInput}
                  ></textarea>
                </div>
                <div className="tw-col-span-1">
                  <button
                    onClick={() => onReplySubmit(board?.clubQuizAnswerSequence, textInput.current.value)}
                    className="tw-mb-[1px] tw-py-[21px] tw-w-full tw-h-full tw-rounded tw-bg-white border border-secondary tw-border-[#e9ecf2] tw-text-sm tw-text-center tw-text-[#6a7380]"
                  >
                    댓글달기
                  </button>
                </div>
              </div>

              <div className="tw-col-span-9 tw-flex tw-items-center tw-justify-end ">
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
      </Desktop>
      <Mobile>
        <div className={cx('community-board-container', className)}>
          <div className={cx('main-container')}>
            <div className={cx('board-header', 'row')}>
              <div className="tw-flex tw-items-center tw-space-x-4 tw-my-5 tw-gap-2">
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
              minRows={3}
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

            <div className="tw-grid tw-items-center tw-grid-cols-12 tw-py-3 tw-mt-0">
              <div className="tw-col-span-3">
                <div className="tw-flex tw-items-center tw-gap-1">
                  <span className="tw-flex tw-items-center">
                    <AssignmentOutlinedIcon className="tw-mr-1 tw-w-4" />
                    {board?.replyCount}
                  </span>
                  <span className="tw-flex tw-items-center">
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
                        <FavoriteIcon color="primary" className="tw-mr-1 tw-w-4" />
                      ) : (
                        <FavoriteBorderIcon color="disabled" className="tw-mr-1 tw-w-4" />
                      )}
                      <span>{likeCount}</span>
                    </button>
                  </span>
                </div>
              </div>
              <div className="tw-col-span-9 tw-flex tw-items-center tw-justify-end ">
                <Textfield
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
                  className="tw-bg-gray-400 tw-text-sm tw-text-white tw-px-2 tw-w-20 tw-ml-2 tw-rounded-md tw-h-10"
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
          {isReplyFetched && true && (
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
      </Mobile>
    </>
  );
};

export default CommunityCard;
