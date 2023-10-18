import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useAnswersReplies } from 'src/services/monthly/monthly.queries';
import { QuizzesAnswersResponse, QuizzesAnswers } from 'src/models/monthly';
import { paramProps } from 'src/services/seminars/seminars.queries';
import CommunityCardReply from '../CommunityCardReply';

import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderIcon from '@mui/icons-material/StarBorder';
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
  let [quizAnswerSequence, setQuizAnswerSequence] = useState<number>(0);
  let [quizzesAnswersContents, setQuizzesAnswersContents] = useState<QuizzesAnswersResponse>();
  let [answersRepliesContents, setAnswersRepliesContents] = useState([]);
  let [isOpen, setIsOpened] = useState(false);

  //quizAnswerSequence = 11;

  // 댓글 데이터
  const {
    isFetched: isAnswerRepliesFetched,
    refetch,
    isSuccess: isAnswerRepliesSuccess,
  } = useAnswersReplies(quizAnswerSequence, data => {
    setAnswersRepliesContents(data.data.data.clubQuizReplies.contents);
  });

  useEffect(() => {
    if (quizAnswerSequence > 0) {
      refetch();
    }
  }, [quizAnswerSequence]);

  const handleReplyDisplayButton = (clubQuizAnswerSequence: number) => {
    setQuizAnswerSequence(clubQuizAnswerSequence);
    setIsOpened(!isOpen);
  };

  const handleIconButton = (event: React.MouseEvent<HTMLElement>) => {};

  return (
    <div>
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
                onClick={e => handleIconButton(e)}
              >
                <StarBorderIcon className="tw-mr-1 tw-w-5" />
                <span className="tw-text-sm">{contents?.onePickCount ?? 0}</span>
              </IconButton>

              <IconButton
                aria-label="more"
                id="long-button"
                size="small"
                aria-haspopup="true"
                onClick={e => handleIconButton(e)}
              >
                <FavoriteBorderIcon className="tw-mr-1 tw-w-5" />
                <span className="tw-text-sm">{contents?.likeCount ?? 0}</span>
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
