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
  useQuizLikeReply,
  useQuizDeleteLikeReply,
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
import { useQuizFileDownload, useQuizRoungeInfo } from 'src/services/quiz/quiz.queries';
import { border } from '@mui/system';
export interface CommunityCardProps {
  /** 게시판 object */
  board: any;
  replies: any;
  /** 작성자 */
  writer: User;
  /** className */
  className?: string;
  /** 댓글 작성 버튼 클릭 이벤트 */
  onReplySubmit?: (string) => void;
  /** 좋아요 클릭 이벤트 */
  onChangeLike?: (boolean) => void;
  selectedQuiz: any;
  memberId: string;
  type: string;
  refetchReply: () => void;
  onPostDeleteSubmit: (...args: any[]) => any;
}

const cx = classNames.bind(styles);

const CommunityCard = ({
  board,
  replies,
  selectedQuiz,
  writer,
  className,
  // memberId,
  type,
  refetchReply,
  onPostDeleteSubmit,
}: // eslint-disable-next-line @typescript-eslint/no-empty-function
CommunityCardProps) => {
  const { beforeOnePick, update } = useSessionStore.getState();

  // TODO 좋아요 여부 필드 수정 필요
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [postNo, setPostNo] = useState(0);
  let [isLiked, setIsLiked] = useState(false);
  let [isOnePicked, setIsOnePicked] = useState(false);
  let [isOpen, setIsOpened] = useState(false);
  let [likeCount, setLikeCount] = useState(0);
  let [onePickCount, setOnePickCount] = useState(0);
  let [replyCount, setReplyCount] = useState(0);
  let [repliesList, setRepliesList] = useState([]);
  let [beforeOnePickInner, setBeforeOnePickInner] = useState(0);
  /** one pick */
  const { mutate: onSaveLikeReply } = useQuizLikeReply();
  const { mutate: onDeleteLikeReply } = useQuizDeleteLikeReply();

  const { mutate: onSaveOnePick, isError, isSuccess } = useQuizOnePick();
  const { mutate: onDeleteOnePick, isSuccess: isDeleteOnePick } = useQuizDeleteOnePick();
  const { mutate: onDeleteOnePickCallBack, isSuccess: isDeleteOnePickCallBack } = useQuizDeleteOnePick();

  /** 댓글 */
  const { mutate: onSaveReply, isSuccess: replyReplySucces } = useSaveReply();
  const { mutate: onDeleteReply, isSuccess: deleteReplySucces } = useDeleteReply();

  const { memberId } = useSessionStore();
  console.log(memberId);

  const [params, setParams] = useState<any>({});
  /** 댓글 리스트 */
  const {
    isFetched: isReplyFetched,
    refetch,
    isSuccess: replayListSuccess,
  } = useRepliesList(params, data => {
    console.log(data);
    console.log(data?.data?.data?.contents);
    setRepliesList(data?.data?.data?.contents);
    // setTotalPage(data.data.data.clubQuizReplies.totalPages);
  });

  useDidMountEffect(() => {
    if (replyReplySucces) refetch();
    refetchReply();
  }, [replyReplySucces]);

  useDidMountEffect(() => {
    if (params) {
      console.log(params);
      if (isOpen) {
        refetch();
      }
    }
  }, [params]);

  // useDidMountEffect(() => {
  //   refetch();
  // }, [replayListSuccess]);

  useEffect(() => {
    if (isError) {
      alert(`원픽은 하나만 선택할 수 있어요.\n기존 원픽을 취소해 주세요.`);
      setIsOnePicked(false);
      setOnePickCount(prevCount => prevCount - 1);
    }
  }, [isError]);

  // refetch();
  // useDidMountEffect(() => {
  //   refetch();
  // }, [postNo]);

  useEffect(() => {
    // console.log(board);
    setIsLiked(board?.isLiked);
    setIsOnePicked(board?.isOnePicked);
    setLikeCount(board?.likeCount);
    setReplyCount(board?.replyCount);
    setOnePickCount(board?.onePickCount);
  }, [board]);

  const textInput = useRef(null);

  const onReplySubmit = (postNo: number, member: string, text: string) => {
    if (logged) {
      if (!text.trim()) {
        alert('댓글을 입력해주세요.');
        return;
      }

      onSaveReply({
        clubSequence: selectedQuiz.clubSequence,
        quizSequence: selectedQuiz.quizSequence,
        memberUUID: member,
        body: text,
      });
      textInput.current.value = '';
      setReplyCount(replyCount => replyCount + 1);
      // setParams({
      //   postNo: postNo,
      //   page,
      //   size: 10,
      // });
      // setIsOpened(true);
      // refetchReply();
    } else {
      alert('로그인 후 댓글을 입력할 수 있습니다.');
    }
  };

  const discountReply = () => {
    setReplyCount(replyCount => replyCount - 1);
  };

  const onChangeLike = function (memberUUID: string, isLiked: boolean, quiz) {
    if (logged) {
      const newIsOnePicked = !isLiked;
      console.log(newIsOnePicked);

      setIsLiked(prevIsLiked => {
        if (prevIsLiked !== newIsOnePicked) {
          // Ensure state update only if there is a change
          return newIsOnePicked;
        }
        return prevIsLiked;
      });

      setLikeCount(prevCount => {
        const newCount = newIsOnePicked ? prevCount + 1 : prevCount > 0 ? prevCount - 1 : 0;
        return newCount;
      });

      if (newIsOnePicked) {
        // 좋아요를 누른 경우
        onSaveLikeReply({
          club: selectedQuiz.clubSequence,
          quiz: selectedQuiz.quizSequence,
          memberUUID: memberUUID,
        });
      } else {
        // 좋아요를 취소한 경우
        onDeleteLikeReply({
          club: selectedQuiz.clubSequence,
          quiz: selectedQuiz.quizSequence,
          memberUUID: memberUUID,
        });
      }
    } else {
      alert('로그인 후 좋아요를 클릭 할 수 있습니다.');
    }
  };

  const onChangeOnePick = function (memberUUID: string, isOnePicked) {
    if (logged) {
      const newIsOnePicked = !isOnePicked;
      console.log(newIsOnePicked);
      setIsOnePicked(newIsOnePicked);

      if (newIsOnePicked) {
        // 좋아요를 누른 경우
        onSaveOnePick({
          club: selectedQuiz.clubSequence,
          quiz: selectedQuiz.quizSequence,
          memberUUID: memberUUID,
        });
        setOnePickCount(prevCount => prevCount + 1);
      } else {
        // 좋아요를 취소한 경우
        setOnePickCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
        onDeleteOnePick({
          club: selectedQuiz.clubSequence,
          quiz: selectedQuiz.quizSequence,
          memberUUID: memberUUID,
        });
      }
    } else {
      alert('로그인 후 좋아요를 클릭 할 수 있습니다.');
    }
  };

  let [key, setKey] = useState('');
  let [fileName, setFileName] = useState('');
  const { isFetched: isParticipantListFetched, data } = useQuizFileDownload(key, data => {
    // console.log('file download', data);
    if (data) {
      // blob 데이터를 파일로 저장하는 로직
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // 다운로드할 파일 이름과 확장자를 설정합니다.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    setKey(key);
    setFileName(fileName);
    // onFileDownload(key);
  };

  const onChangeDeleteOnePick = async function (postNo: number) {
    if (logged) {
      await onDeleteOnePick(postNo);
    } else {
      alert('로그인 후 원픽을 클릭 할 수 있습니다.');
    }
  };

  const onButtonReply = function (clubSequence: number, quizSequence: number, memberId: string) {
    setParams({
      clubSequence: clubSequence,
      quizSequence: quizSequence,
      memberId: memberId,
      // page,
      // size: 10,
    });
    console.log(clubSequence, quizSequence, memberId);
    // setPostNo(postNo);
    setIsOpened(!isOpen);
  };

  const router = useRouter();
  return (
    <>
      <Desktop>
        <div
          className={cx('community-board-container border tw-p-5 tw-rounded-lg tw-mb-5', className, {
            'tw-bg-[#FDFDFF]': type === 'my', // type이 'my'일 때 회색 배경 추가
          })}
        >
          <div className={cx('main-container')}>
            <div className="tw-flex ...">
              <div className="tw-flex-none tw-w-2/12 tw-items-center">
                <div className="tw-flex tw-items-center tw-space-x-2 tw-h-14">
                  <img
                    src={board?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
                    alt="profile"
                    className="border tw-rounded-full tw-h-10 tw-w-10"
                  />
                  <div className="tw-font-bold tw-text-base tw-text-black">{board?.member?.nickname}</div>
                </div>
              </div>
              <div className="tw-grow">
                <div className="tw-pt-4 tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
                  {type === 'best' ? (
                    <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2 ">
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-left tw-text-white tw-px-2 tw-rounded tw-py-1 tw-bg-[#e11837]">
                        BEST
                      </p>
                    </div>
                  ) : type === 'my' ? (
                    <div className="tw-flex tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2 ">
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-left tw-text-red-600">
                        내 답변
                      </p>
                    </div>
                  ) : null}
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-bold tw-text-left tw-text-[#313b49]">
                    {board?.answerStatus === '0003' ? '최종답변' : '사전답변'}
                  </p>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                    제출일 : {board?.createdAt?.toString()}
                  </p>
                </div>
                <div className="tw-py-5 tw-text-sm tw-text-left tw-text-[#313b49]">{board?.text}</div>
                {board?.files?.length > 0 && (
                  <div className="tw-flex  tw-py-3">
                    <div className="tw-text-left tw-text-sm">
                      <ul className="tw-flex tw-space-x-2">
                        {board?.files?.map((file, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              onFileDownload(file.key, file.name);
                            }}
                            className="tw-cursor-pointer tw-px-3 tw-rounded-full border tw-p-1 tw-rounded"
                          >
                            {file.name}
                          </div>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-pt-4">
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                    <svg
                      width={20}
                      height={21}
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        d="M4.28572 13.4481L4.98572 13.5917C5.01836 13.4317 4.99516 13.2653 4.92001 13.1203L4.28572 13.4481ZM7.05215 16.2146L7.38 15.5803C7.235 15.5051 7.06861 15.4819 6.90858 15.5146L7.05215 16.2146ZM3.57143 16.9289L2.87143 16.7853C2.84774 16.9011 2.85315 17.0209 2.88717 17.1341C2.92119 17.2473 2.98276 17.3502 3.06636 17.4338C3.14996 17.5173 3.25298 17.5788 3.36618 17.6127C3.47939 17.6466 3.59924 17.6519 3.71501 17.6281L3.57143 16.9289ZM15.7143 10.5003C15.7143 12.0158 15.1123 13.4693 14.0406 14.5409C12.969 15.6125 11.5155 16.2146 10 16.2146V17.6431C13.945 17.6431 17.1429 14.4453 17.1429 10.5003H15.7143ZM4.28572 10.5003C4.28572 8.98476 4.88776 7.53131 5.95939 6.45967C7.03103 5.38803 8.48448 4.78599 10 4.78599V3.35742C6.05501 3.35742 2.85715 6.55528 2.85715 10.5003H4.28572ZM10 4.78599C11.5155 4.78599 12.969 5.38803 14.0406 6.45967C15.1123 7.53131 15.7143 8.98476 15.7143 10.5003H17.1429C17.1429 6.55528 13.945 3.35742 10 3.35742V4.78599ZM4.92001 13.1203C4.50164 12.3104 4.2841 11.4118 4.28572 10.5003H2.85715C2.85715 11.6796 3.14286 12.7939 3.65143 13.776L4.92001 13.1203ZM10 16.2146C9.08848 16.216 8.18994 15.9985 7.38 15.5803L6.72429 16.8489C7.73683 17.3721 8.86025 17.6445 10 17.6431V16.2146ZM3.58572 13.3046L2.87143 16.7853L4.27143 17.0724L4.98572 13.5917L3.58572 13.3046ZM3.71501 17.6281L7.19572 16.9146L6.90858 15.5146L3.42786 16.2289L3.71501 17.6281Z"
                        fill="#555555"
                      />
                    </svg>
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#555]">
                      {board?.replyCount}
                    </p>
                  </div>
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                    <svg
                      width={20}
                      height={21}
                      viewBox="0 0 20 21"
                      onClick={() => {
                        onChangeOnePick(board?.member?.memberUUID, isOnePicked);
                      }}
                      fill="none"
                      // fill={isOnePick ? '#e11837' : ''} // 배경 색상
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                      preserveAspectRatio="none"
                    >
                      <g clipPath="url(#clip0_801_17810)">
                        <path
                          d="M12.5144 7.1812L12.6386 7.40396L12.8874 7.46028L17.1079 8.41576C17.1079 8.41577 17.108 8.41579 17.108 8.4158C17.1723 8.43042 17.2345 8.46297 17.2875 8.5131C17.3408 8.56343 17.3828 8.6298 17.4068 8.70693L17.928 8.54495L17.4068 8.70693C17.4308 8.78414 17.4351 8.86731 17.419 8.94741C17.4029 9.02737 17.3675 9.09908 17.3188 9.15615C17.3187 9.15617 17.3187 9.1562 17.3187 9.15622C17.3187 9.15625 17.3186 9.15628 17.3186 9.15631L14.4416 12.5209L14.2837 12.7056L14.3071 12.9475L14.7426 17.4369L14.7426 17.437C14.7506 17.5189 14.7377 17.6008 14.7063 17.6742C14.6749 17.7474 14.6271 17.8077 14.5701 17.8509C14.5134 17.894 14.4492 17.9191 14.3842 17.9263C14.3193 17.9336 14.253 17.9231 14.1913 17.8947L14.1912 17.8946L10.2393 16.0745L10.0003 15.9644L9.76124 16.0745L5.80943 17.8946L5.80932 17.8947C5.74757 17.9231 5.68127 17.9336 5.61638 17.9263C5.55142 17.9191 5.4872 17.894 5.43045 17.8509L5.08492 18.306L5.43045 17.8509C5.3735 17.8077 5.32564 17.7474 5.29429 17.6742C5.2629 17.6008 5.25001 17.5189 5.25797 17.437L5.25798 17.4369L5.69344 12.9475L5.7169 12.7056L5.55894 12.5209L2.68179 9.15691L2.68164 9.15673C2.63278 9.09966 2.59724 9.02786 2.58106 8.94777C2.56488 8.86763 2.56919 8.7844 2.59319 8.70712C2.61717 8.62993 2.65924 8.56352 2.71253 8.51316C2.76565 8.46297 2.82798 8.43042 2.89236 8.41584C2.89237 8.41584 2.89237 8.41584 2.89237 8.41584L7.11323 7.46028L7.36198 7.40396L7.48617 7.1812L9.65954 3.28262C9.65955 3.2826 9.65957 3.28257 9.65958 3.28255C9.69764 3.21433 9.7504 3.16083 9.81016 3.12494L9.51599 2.63505L9.81016 3.12494C9.86973 3.08917 9.9352 3.07143 10.0003 3.07143C10.0654 3.07143 10.1309 3.08917 10.1904 3.12494C10.2502 3.16084 10.303 3.21437 10.341 3.28262L12.5144 7.1812Z"
                          // stroke="#555555"
                          stroke={isOnePicked ? '#e11837' : '#555555'} // 배경 색상
                          strokeWidth="1.14286"
                        />
                        <path
                          d="M9.3751 13.9282V13.0092L9.37563 9.39533H8.28564V8.69263C8.88758 8.58452 9.30242 8.43781 9.68473 8.21387H10.5714V13.0092V13.9282H9.3751Z"
                          // fill="#555555"
                          fill={isOnePicked ? '#e11837' : ''} // 배경 색상
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_801_17810">
                          <rect width={20} height={20} fill="white" transform="translate(0 0.5)" />
                        </clipPath>
                      </defs>
                    </svg>
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#555]">
                      {onePickCount}
                    </p>
                  </div>
                  <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                    <svg
                      width={20}
                      height={21}
                      viewBox="0 0 20 21"
                      fill="" // 배경을 빨간색으로 설정
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        onChangeLike(board?.member?.memberUUID, isLiked, board?.quizSequence);
                      }}
                      className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        d="M10 16.4947C9.5485 16.1135 9.0382 15.7171 8.4985 15.2953H8.4915C6.59101 13.816 4.43711 12.1422 3.48581 10.1366C3.17328 9.49803 3.00765 8.80332 3.00001 8.09893C2.99792 7.13241 3.40515 6.20588 4.12968 5.52874C4.8542 4.8516 5.83486 4.48102 6.85001 4.50075C7.67645 4.50199 8.48509 4.72935 9.1796 5.15575C9.48478 5.3443 9.7609 5.57238 10 5.83341C10.2404 5.5734 10.5166 5.34546 10.8211 5.15575C11.5153 4.72927 12.3238 4.50189 13.15 4.50075C14.1651 4.48102 15.1458 4.8516 15.8703 5.52874C16.5948 6.20588 17.0021 7.13241 17 8.09893C16.9928 8.80445 16.8272 9.50035 16.5142 10.1399C15.5629 12.1455 13.4097 13.8187 11.5092 15.2953L11.5022 15.3006C10.9618 15.7197 10.4522 16.1162 10.0007 16.5L10 16.4947ZM6.85001 5.83341C6.19797 5.82564 5.56906 6.06319 5.10001 6.49441C4.64808 6.91697 4.3955 7.49593 4.39995 8.09893C4.40794 8.61233 4.53009 9.11831 4.75841 9.58351C5.20747 10.4489 5.81339 11.232 6.54831 11.897C7.24201 12.5633 8.04 13.2083 8.7302 13.7507C8.9213 13.9007 9.1159 14.0519 9.3105 14.2032L9.433 14.2985C9.6199 14.4437 9.8131 14.5943 10 14.7422L10.0091 14.7342L10.0133 14.7309H10.0175L10.0238 14.7262H10.0273H10.0308L10.0434 14.7162L10.0721 14.6943L10.077 14.6903L10.0847 14.6849H10.0889L10.0952 14.6796L10.56 14.3164L10.6818 14.2212C10.8785 14.0686 11.0731 13.9173 11.2642 13.7674C11.9544 13.225 12.7531 12.5807 13.4468 11.911C14.1818 11.2464 14.7878 10.4634 15.2367 9.59817C15.4691 9.12894 15.593 8.61767 15.6 8.09893C15.6029 7.49779 15.3505 6.92105 14.9 6.49974C14.4318 6.06657 13.8028 5.82707 13.15 5.83341C12.3533 5.82696 11.5918 6.14483 11.057 6.70696L10 7.86638L8.943 6.70696C8.40825 6.14483 7.64666 5.82696 6.85001 5.83341Z"
                        fill={isLiked ? '#e11837' : ''} // 배경 색상
                      />
                    </svg>
                    <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#555]">
                      {likeCount}
                    </p>
                  </div>
                </div>
                <>
                  <div className="tw-pt-5 tw-text-sm tw-text-left tw-text-[#313b49]">
                    <div className="tw-py-5">
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

                    <div className="tw-col-span-9 tw-flex tw-items-center tw-justify-end ">
                      <button
                        className={cx('tw-text-[14px] tw-pl-4')}
                        onClick={() => {
                          onButtonReply(board?.clubSequence, board?.quizSequence, board?.member?.memberUUID);
                        }}
                      >
                        댓글 {replyCount}개{isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                      </button>
                    </div>

                    {isReplyFetched && isOpen && (
                      <div className={cx('reply-container')}>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-py-5">
                          <div className="tw-col-span-10">
                            <textarea
                              className="tw-form-control tw-w-full tw-py-[8px] tw-p-5"
                              id="floatingTextarea"
                              placeholder="댓글을 입력해주세요."
                              ref={textInput}
                              rows={2}
                            ></textarea>
                          </div>
                          <div className="tw-col-span-2">
                            <button
                              onClick={() => {
                                onReplySubmit(
                                  board?.clubQuizAnswerSequence,
                                  board?.member?.memberUUID,
                                  textInput.current.value,
                                );
                              }}
                              className="tw-w-full tw-h-full tw-px-2 tw-py-[17px] tw-rounded tw-bg-white border tw-border-secondary tw-border-[#e9ecf2] tw-text-sm tw-text-center tw-text-[#6a7380]"
                              style={{ height: 'auto' }} // 버튼 높이를 textarea에 맞춤
                            >
                              댓글달기
                            </button>
                          </div>
                        </div>

                        <div className={cx('reply-container__content')}>
                          {repliesList?.map((reply, i) => {
                            return (
                              // TODO API Response 보고 댓글 작성자로 수정 필요
                              <CommunityCardReply
                                key={i}
                                reply={reply}
                                refetch={refetch}
                                refetchReply={refetchReply}
                                discountReply={discountReply}
                              />
                            );
                          })}
                        </div>
                        {/* <div className="tw-flex tw-justify-center tw-my-5">
                          <Pagination page={page} setPage={setPage} total={totalPage} />
                        </div> */}
                      </div>
                    )}
                  </div>
                </>
              </div>
            </div>

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
            </div>
          </div>
        </div>
      </Desktop>
    </>
  );
};

export default CommunityCard;
