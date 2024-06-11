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
import { useSaveReReply, useDeleteReply } from 'src/services/community/community.mutations';
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
  let [isText, setIsText] = useState(false);
  const [text, setText] = useState('');

  const { mutate: onSaveReReply, isSuccess: replyReplySucces } = useSaveReReply();
  const { mutate: onDeleteReply, isSuccess: deleteReplySucces } = useDeleteReply();

  const handleTextChange = event => {
    setText(event.target.value);
  };
  const onReplyCancel = () => {
    setIsText(false);
  };

  const replyOpen = () => {
    setIsOpened(!isOpen);
  };

  const replyModifyEvent = (body: string, clubSequence: number, memberUUID: string, quizSequence: number) => {
    setText(body);
    setIsText(true);
  };

  const replyModify = (body: string, clubSequence: number, memberUUID: string, quizSequence: number) => {
    if (window.confirm('정말로 수정하시겠습니까?')) {
      console.log(body);
      console.log(clubSequence);
      console.log(memberUUID);
      console.log(quizSequence);
    }
    // onDeleteReply({
    //   postReplyNo: postReplyNo,
    //   parentPostNo: parentPostNo,
    // });
    // setReplyCount(replyCount => replyCount - 1);
  };

  const onReplyDeleteSubmit = (clubSequence: number, memberUUID: string, quizSequence: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      console.log(clubSequence);
      console.log(memberUUID);
      console.log(quizSequence);
      // onDeleteReply({
      //   clubSequence: clubSequence,
      //   quizSequence: quizSequence,
      //   memberUUID: memberUUID,
      //   body: text,
      // });
    }
  };

  useEffect(() => {
    setIsOpened(false);
  }, [reply]);

  useEffect(() => {
    if (replyReplySucces) refetch();
  }, [replyReplySucces]);

  const onReplySubmit = (postNo: number, text: string) => {
    console.log(postNo);
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
          <div className="tw-flex ...">
            <div className="tw-grow">
              <div className="tw-grid tw-grid-cols-12 tw-items-center tw-justify-center">
                <div className="tw-col-span-1">
                  <img
                    src={reply?.replier?.profileImageUrl}
                    alt="profile"
                    className="border tw-rounded-full tw-h-10 tw-w-10"
                  />
                </div>
                <div className="tw-col-span-11 tw-flex tw-items-center tw-space-x-2">
                  <div className="tw-font-medium tw-text-sm tw-text-black">{reply?.replier?.nickname}</div>
                  <div className="tw-font-medium tw-text-sm tw-text-gray-400">{reply?.createAt}</div>
                </div>
              </div>
              <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
                <div className="tw-col-span-0"></div>
                <div className="tw-col-span-11 tw-pt-0 tw-pb-3">
                  {isText ? (
                    <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                      <div className="tw-col-span-10">
                        <textarea
                          value={text}
                          className="tw-form-control tw-w-full tw-py-[8px] tw-p-5"
                          id="floatingTextarea"
                          placeholder="댓글을 입력해주세요."
                          ref={textInput}
                          rows={2} // 두 줄 높이로 설정
                          onChange={handleTextChange}
                        ></textarea>
                      </div>
                      <div className="tw-col-span-1">
                        <button
                          onClick={() =>
                            replyModify(
                              textInput.current.value,
                              reply?.clubSequence,
                              reply?.replier?.memberUUID,
                              reply?.quizSequence,
                            )
                          }
                          className="tw-w-full tw-h-full tw-px-2 tw-py-[17px] tw-rounded tw-bg-white border tw-border-secondary tw-border-[#e9ecf2] tw-text-sm tw-text-center tw-text-[#6a7380]"
                          style={{ height: 'auto' }} // 버튼 높이를 textarea에 맞춤
                        >
                          수정
                        </button>
                      </div>
                      <div className="tw-col-span-1">
                        <button
                          onClick={() => onReplyCancel()}
                          className="tw-w-full tw-h-full tw-px-2 tw-py-[17px] tw-rounded tw-bg-white border tw-border-secondary tw-border-[#e9ecf2] tw-text-sm tw-text-center tw-text-[#6a7380]"
                          style={{ height: 'auto' }} // 버튼 높이를 textarea에 맞춤
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="">{reply?.body}</div>
                  )}
                </div>
              </div>
              <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
                <div className="tw-col-span-1"></div>
                <div className="tw-col-span-11 tw-pt-0 tw-pb-3">
                  {!isText && (
                    <div>
                      <button
                        className={cx('tw-text-[12px]', 'tw-text-gray-400 tw-mr-3 tw-underline')}
                        onClick={() => replyOpen()}
                      >
                        대댓글 쓰기
                      </button>
                      <button
                        className={cx('tw-text-[12px]', 'tw-text-gray-400 tw-mr-3 tw-underline')}
                        onClick={() =>
                          replyModifyEvent(
                            reply?.body,
                            reply?.clubSequence,
                            reply?.replier?.memberUUID,
                            reply?.quizSequence,
                          )
                        }
                      >
                        수정하기
                      </button>
                      <button
                        className={cx('tw-text-[12px]', 'tw-text-gray-400  tw-underline')}
                        onClick={() =>
                          onReplyDeleteSubmit(reply?.clubSequence, reply?.replier?.memberUUID, reply?.quizSequence)
                        }
                      >
                        삭제하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
                <div className="tw-col-span-1"></div>
                <div className="tw-col-span-11 tw-pt-0 tw-pb-3">
                  {isOpen && (
                    <div className="tw-grid tw-grid-cols-12 tw-items-center tw-justify-center tw-gap-2">
                      <div className="tw-col-span-11 ">
                        <textarea
                          className="tw-form-control tw-w-full tw-py-[8px] tw-p-5"
                          id="floatingTextarea"
                          placeholder="댓글을 입력해주세요."
                          ref={textInput}
                        ></textarea>
                      </div>
                      <div className="tw-col-span-1">
                        <button
                          onClick={() => onReplySubmit(reply?.answerReplySequence, textInput.current.value)}
                          className="tw-mb-[5px] tw-py-[17px] tw-w-full tw-h-full tw-rounded tw-bg-white border border-secondary tw-border-[#e9ecf2] tw-text-sm tw-text-center tw-text-[#6a7380]"
                        >
                          댓글달기
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
                    <div className="tw-col-span-12 tw-pt-0">
                      {reply?.replies.map((reply, i) => {
                        return <CommunityCardReReply key={i} reply={reply} />;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
            <div className="tw-col-span-1"></div>
            <div className="tw-col-span-11 tw-py-2">
              <div className="tw-text-sm">{reply.body}</div>
            </div>
            <div className="tw-col-span-1"></div>
          </div>
          <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
            <div className="tw-col-span-1"></div>
            <div className="tw-col-span-11 tw-pt-0 tw-pb-3">
              <button
                className={cx('tw-text-[12px]', 'tw-text-gray-400 tw-mr-3 tw-underline')}
                onClick={() => replyOpen()}
              >
                답글쓰기
              </button>
              <button className={cx('tw-text-[12px]', 'tw-text-gray-400  tw-underline')} onClick={() => replyOpen()}>
                삭제하기
              </button>
            </div>
            <div className="tw-col-span-1"></div>
          </div> */}
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
                <div className="tw-flex tw-justify-start tw-items-center tw-w-full">
                  <div className={cx('tw-text-[12px]', 'tw-text-gray-400')}>
                    <Textfield
                      defaultValue={textInput}
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
