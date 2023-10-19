import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useAnswersReplies } from 'src/services/monthly/monthly.queries';
import {
  useSaveOnePicked,
  useDeleteOnePicked,
  useSaveLiked,
  useDeleteLiked,
} from 'src/services/monthly/monthly.mutations';
import { QuizzesAnswersResponse, QuizzesAnswers } from 'src/models/monthly';
import { paramProps } from 'src/services/seminars/seminars.queries';
import CommunityCardReply from '../CommunityCardReply';
import { useSessionStore } from 'src/store/session';

import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Avatar from '@mui/material/Avatar';

const cx = classNames.bind(styles);

interface QuizAnswerCardMasterProps {
  key: number;
  contents: QuizzesAnswers;
}

const QuizAnswerCardMaster = ({ key, contents }: QuizAnswerCardMasterProps) => {
  const [page, setPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page });
  const { logged } = useSessionStore.getState();
  const { mutate: onSaveOnePicked, isError, isSuccess: isOnePickedSuccess } = useSaveOnePicked();
  const { mutate: onDeleteOnePicked, isSuccess: isDeleteOnePickedSuccess } = useDeleteOnePicked();
  const { mutate: onSaveLiked } = useSaveLiked();
  const { mutate: onDeleteLiked } = useDeleteLiked();
  const { beforeOnePick, update } = useSessionStore.getState();
  let [quizAnswerSequence, setQuizAnswerSequence] = useState<number>(0);
  let [quizzesAnswersContents, setQuizzesAnswersContents] = useState<QuizzesAnswersResponse>();
  let [answersRepliesContents, setAnswersRepliesContents] = useState([]);
  let [isOpen, setIsOpened] = useState(false);
  let [beforeOnePickedInner, setBeforeOnePickedInner] = useState(0);
  let [isOnePicked, setIsOnePicked] = useState(false);
  let [onePickedCount, setOnePickedCount] = useState(0);
  let [isLiked, setIsLiked] = useState(false);
  let [likedCount, setLikedCount] = useState(0);

  //quizAnswerSequence = 11;

  // 댓글 데이터
  const {
    isFetched: isAnswerRepliesFetched,
    refetch,
    isSuccess: isAnswerRepliesSuccess,
  } = useAnswersReplies(quizAnswerSequence, data => {
    setAnswersRepliesContents(data.data.data.clubQuizReplies.contents);
  });

  const handleReplyDisplayButton = (clubQuizAnswerSequence: number) => {
    setQuizAnswerSequence(clubQuizAnswerSequence);
    setIsOpened(!isOpen);
  };

  // 원픽
  const handleIsOnePicked = (event: React.MouseEvent<HTMLElement>, clubQuizAnswerSequence: number) => {
    //event.preventDefault();
    if (!logged) {
      alert('로그인 후, 클릭 할 수 있습니다.');
      return false;
    }

    if (clubQuizAnswerSequence > 0) {
      onSaveOnePicked(clubQuizAnswerSequence);
      setBeforeOnePickedInner(clubQuizAnswerSequence);
    }
  };

  // 원픽 삭제
  const handleDeleteIsOnePicked = (event: React.MouseEvent<HTMLElement>, clubQuizAnswerSequence: number) => {
    if (!logged) {
      alert('로그인 후, 클릭 할 수 있습니다.');
      return false;
    }

    onDeleteOnePicked(clubQuizAnswerSequence);
  };

  // 좋아요
  const handleIsLiked = (event: React.MouseEvent<HTMLElement>, clubQuizAnswerSequence: number) => {
    //event.preventDefault();

    if (!logged) {
      alert('로그인 후, 클릭 할 수 있습니다.');
      return false;
    }

    setIsLiked(!isLiked);

    if (isLiked) {
      if (likedCount > 0) {
        setLikedCount(likedCount - 1);
      }
      onDeleteLiked(clubQuizAnswerSequence);
    } else {
      setLikedCount(likedCount => likedCount + 1);
      onSaveLiked(clubQuizAnswerSequence);
    }
  };

  useEffect(() => {
    if (quizAnswerSequence > 0) {
      refetch();
    }
  }, [quizAnswerSequence]);

  useEffect(() => {
    if (isError) {
      alert(`원픽은 하나만 선택할 수 있어요.\n기존 원픽을 취소해 주세요.`);
    }
  }, [isError]);
  useEffect(() => {
    if (isDeleteOnePickedSuccess) {
      setIsOnePicked(false);
      if (onePickedCount > 0) {
        setOnePickedCount(onePickedCount - 1);
      }
    }
  }, [isDeleteOnePickedSuccess]);

  useEffect(() => {
    if (isOnePickedSuccess) {
      setIsOnePicked(true);
      setOnePickedCount(onePickedCount + 1);
      update({
        beforeOnePick: beforeOnePickedInner,
      });
    }
  }, [isOnePickedSuccess]);

  useEffect(() => {
    setIsLiked(contents?.isLiked);
    setIsOnePicked(contents?.isOnePicked);
  }, [contents]);

  return (
    <div key={`answer-${contents?.clubQuizSequence}`}>
      <div className={cx('answer-area tw-pt-5')}>
        <div className={cx('content-wrap tw-rounded tw-bg-white border')}>
          <div className="tw-flex p-3 tw-m-1 tw-px-3 tw-py-0.5">
            <div className="tw-w-1/6">
              <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-text-sm tw-font-light">
                {contents?.createdAt.slice(2, 10)}
              </span>
            </div>
            <div className="tw-w-3/4">
              <span className="tw-flex tw-text-black tw-text-sm">
                <Avatar sx={{ width: 32, height: 32 }} src={contents?.profileImageUrl}></Avatar>
                <span className="tw-leading-9 tw-pl-2 tw-font-bold">{contents?.nickname}</span>
              </span>
            </div>
            <div className="tw-w-3/4 tw-text-right">
              <IconButton
                aria-label="more"
                id="long-button"
                size="small"
                aria-haspopup="true"
                onClick={() => {
                  handleReplyDisplayButton(contents?.clubQuizSequence);
                }}
              >
                <ChatBubbleOutlineIcon className="tw-mr-1 tw-w-5" />
                <span className="tw-text-sm">{contents?.replyCount ?? 0}</span>
              </IconButton>
              <IconButton
                aria-label="more"
                id="long-button"
                size="small"
                aria-haspopup="true"
                onClick={e => {
                  isOnePicked
                    ? handleDeleteIsOnePicked(e, contents?.clubQuizAnswerSequence)
                    : handleIsOnePicked(e, contents?.clubQuizAnswerSequence);
                }}
              >
                {isOnePicked ? (
                  <StarIcon color="primary" className="tw-mr-1 tw-w-5" />
                ) : (
                  <StarBorderIcon className="tw-mr-1 tw-w-5" />
                )}
                <span className="tw-text-sm">{onePickedCount ?? contents.onePickCount}</span>
              </IconButton>

              <IconButton
                aria-label="more"
                id="long-button"
                size="small"
                aria-haspopup="true"
                onClick={e => {
                  handleIsLiked(e, contents?.clubQuizAnswerSequence);
                }}
              >
                {isLiked ? (
                  <FavoriteIcon color="primary" className="tw-mr-1 tw-w-5" />
                ) : (
                  <FavoriteBorderIcon className="tw-mr-1 tw-w-5" />
                )}
                <span className="tw-text-sm">{likedCount ?? contents.likeCount}</span>
              </IconButton>
            </div>
          </div>
          <div className="tw-flex p-3 tw-m-1 tw-px-3 tw-py-0.5">
            <span className="tw-flex tw-text-black tw-text-md tw-pl-[120px]">{contents?.postAnswer}</span>
          </div>
          <div className="tw-ml-[140px] tw-mr-[140px]">
            <div>
              <Divider className="tw-mb-7 tw-mt-5 tw-bg-['#efefef'] tw-border-x-8" />
            </div>

            {isAnswerRepliesFetched && isOpen && (
              <div className={cx('reply-container')}>
                <div className={cx('reply-container__content')}>
                  {answersRepliesContents.map((reply, i) => {
                    return <CommunityCardReply key={i} reply={reply} refetch={refetch} />;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnswerCardMaster;
