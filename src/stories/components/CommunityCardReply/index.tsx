import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { ReplyType } from 'src/config/entities';
import Chip from '../Chip';
import { jobColorKey } from 'src/config/colors';
import { User } from 'src/models/user';
import Tooltip from '../Tooltip';
import Grid from '@mui/material/Grid';
import { Textfield, Button } from 'src/stories/components';
import { useEffect, useRef, useState } from 'react';
import { useSessionStore } from 'src/store/session';
import { useSaveReReply } from 'src/services/community/community.mutations';
import CommunityCardReReply from '../CommunityCardReReply';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
const { logged } = useSessionStore.getState();

export interface CommunityCardReplyProps {
  /** 댓글 */
  reply: ReplyType;
  /** 작성자 */
  /** className */
  className?: string;
  refetch: (...args: any[]) => any;
}

const cx = classNames.bind(styles);

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

const CommunityCardReply = ({ reply, className, refetch }: CommunityCardReplyProps) => {
  const textInput = useRef(null);
  let [isOpen, setIsOpened] = useState(false);
  const { mutate: onSaveReReply, isSuccess: replyReplySucces } = useSaveReReply();

  const replyOpen = () => {
    setIsOpened(!isOpen);
  };

  useEffect(() => {
    setIsOpened(false);
  }, [reply]);

  useEffect(() => {
    refetch();
  }, [replyReplySucces]);

  const onReplySubmit = (postNo: number, text: string) => {
    setIsOpened(!isOpen);
    if (logged) {
      onSaveReReply({
        clubQuizAnswerReplySequence: postNo,
        body: text,
      });
      textInput.current.value = '';
      // setReplyCount(replyCount => replyCount + 1);
      setIsOpened(false);
    } else {
      alert('로그인 후 댓글을 입력할 수 있습니다.');
    }
  };

  // TODO 좋아요 여부 필드 수정 필요

  return (
    <>
      <Desktop>
        <div className={cx('community-board-reply-container', 'row', className)}>
          <div className="tw-grid  tw-grid-cols-12  tw-flex tw-items-center  tw-mt-2 tw-gap-2">
            {/* {board.postNo} */}
            <div className="tw-col-span-1 tw-flex tw-items-end tw-justify-center">
              <img
                src={reply?.imageUrl}
                alt={'image'}
                className={cx('rounded-circle', 'profile-image', 'tw-h-10', 'tw-w-10')}
              />
            </div>
            <div className="tw-col-span-3 tw-text-left tw-flex tw-items-center">
              <div className="tw-font-bold tw-text-lg tw-text-black">{reply?.nickname} </div>
              <div className="tw-text-[11px] tw-text-gray-400 tw-pl-4">{timeForToday(reply.createAt)}</div>
            </div>
            <div className="tw-col-span-7"></div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
            <div className="tw-col-span-1"></div>
            <div className="tw-col-span-11 tw-py-3">
              <div className="tw-text-sm">{reply.body}</div>
            </div>
            <div className="tw-col-span-1"></div>
          </div>
          <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
            <div className="tw-col-span-1"></div>
            <div className="tw-col-span-11 tw-pt-0 tw-pb-3">
              <button className={cx('tw-text-[12px]', 'tw-text-gray-400')} onClick={() => replyOpen()}>
                답글쓰기
              </button>
            </div>
            <div className="tw-col-span-1"></div>
          </div>
          <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
            <div className="tw-col-span-1"></div>
            <div className="tw-col-span-11 tw-pt-0 tw-pb-3">
              {reply?.replies.map((reply, i) => {
                return <CommunityCardReReply key={i} reply={reply} />;
              })}
            </div>
          </div>

          {isOpen && (
            <div className="tw-grid tw-grid-cols-12 tw-items-center tw-justify-center tw-pb-4">
              <div className="tw-col-span-1"></div>
              <div className="tw-col-span-11 ">
                <div className="tw-flex tw-justify-start tw-items-center">
                  <div className={cx('tw-text-[12px]', 'tw-text-gray-400')}>
                    <Textfield
                      width={600}
                      defaultValue=""
                      placeholder="댓글을 입력해주세요."
                      ref={textInput}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          onReplySubmit(reply.sequence, textInput.current.value);
                        }
                      }}
                    />
                  </div>
                  <button
                    className="tw-bg-gray-400 tw-text-white tw-h-10 tw-px-6  tw-ml-2 tw-rounded-md tw-text-sm"
                    onClick={() => onReplySubmit(reply.sequence, textInput.current.value)}
                  >
                    입력
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Desktop>
      <Mobile>
        <div className={cx('community-board-reply-container', 'row', className)}>
          <div className="tw-grid  tw-grid-cols-12  tw-flex tw-items-center  tw-mt-2 tw-gap-2">
            {/* {board.postNo} */}
            <div className="tw-col-span-2 tw-flex tw-items-end tw-justify-center">
              <img
                src={reply?.imageUrl}
                alt={'image'}
                className={cx('rounded-circle', 'profile-image', 'tw-h-10', 'tw-w-10')}
              />
            </div>
            <div className="tw-col-span-4 tw-text-left tw-flex tw-items-center">
              <div className="tw-font-bold tw-text-lg tw-text-black">{reply?.nickname} </div>
              <div className="tw-text-[11px] tw-text-gray-400 tw-pl-4">{timeForToday(reply.createAt)}</div>
            </div>
            <div className="tw-col-span-5"></div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
            <div className="tw-col-span-1"></div>
            <div className="tw-col-span-11 tw-py-3">
              <div className="tw-text-sm">{reply.body}</div>
            </div>
            <div className="tw-col-span-1"></div>
          </div>
          <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
            <div className="tw-col-span-1"></div>
            <div className="tw-col-span-11 tw-pt-0 tw-pb-3">
              <button className={cx('tw-text-[12px]', 'tw-text-gray-400')} onClick={() => replyOpen()}>
                답글쓰기
              </button>
            </div>
            <div className="tw-col-span-1"></div>
          </div>
          <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
            <div className="tw-col-span-1"></div>
            <div className="tw-col-span-11 tw-pt-0 tw-pb-3">
              {reply?.replies.map((reply, i) => {
                return <CommunityCardReReply key={i} reply={reply} />;
              })}
            </div>
          </div>

          {isOpen && (
            <div className="tw-grid tw-grid-cols-12 tw-items-center tw-justify-center tw-pb-4">
              <div className="tw-col-span-1"></div>
              <div className="tw-col-span-11 ">
                <div className="tw-flex tw-justify-start tw-items-center">
                  <div className={cx('tw-text-[12px]', 'tw-text-gray-400')}>
                    <Textfield
                      defaultValue=""
                      placeholder="댓글을 입력해주세요."
                      ref={textInput}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          onReplySubmit(reply.sequence, textInput.current.value);
                        }
                      }}
                    />
                  </div>
                  <button
                    className="tw-bg-gray-400 tw-text-white tw-h-10 tw-px-6  tw-ml-2 tw-rounded-md tw-text-sm"
                    onClick={() => onReplySubmit(reply.sequence, textInput.current.value)}
                  >
                    입력
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Mobile>
    </>
  );
};

export default CommunityCardReply;
