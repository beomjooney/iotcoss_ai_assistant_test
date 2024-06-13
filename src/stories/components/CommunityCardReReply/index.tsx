import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { ReplyType } from 'src/config/entities';
import { Textfield, Button } from 'src/stories/components';
import { useRef, useState } from 'react';
import { useSessionStore } from 'src/store/session';
import { useSaveReReply } from 'src/services/community/community.mutations';

const { logged } = useSessionStore.getState();

export interface CommunityCardReReplyProps {
  reply: ReplyType;
  className?: string;
}

const cx = classNames.bind(styles);

const CommunityCardReReply = ({ reply, className }: CommunityCardReReplyProps) => {
  // TODO 좋아요 여부 필드 수정 필요
  let [isText, setIsText] = useState(false);
  const [text, setText] = useState('');
  const textInput = useRef(null);
  let [isOpen, setIsOpened] = useState(false);

  const handleTextChange = event => {
    setText(event.target.value);
  };

  const replyModifyEvent = (body: string, clubSequence: number, memberUUID: string, quizSequence: number) => {
    setText(body);
    setIsText(true);
  };

  const onReplyCancel = () => {
    setIsText(false);
  };

  const replyOpen = () => {
    setIsOpened(!isOpen);
  };

  return (
    <div className={cx('community-board-reply-container', 'row tw-my-2', className)}>
      <div className="tw-grid  tw-grid-cols-12  tw-flex tw-items-center  tw-mt-2 tw-gap-2">
        {/* {board.postNo} */}
        <div className="tw-col-span-1 tw-flex tw-items-center tw-justify-center">
          <img
            src={reply?.member?.profileImageUrl}
            alt={'image'}
            className={cx('border rounded-circle', 'profile-image', 'tw-h-10', 'tw-w-10')}
          />
        </div>
        <div className="tw-col-span-11 tw-flex tw-items-center tw-space-x-2">
          <div className="tw-font-medium tw-text-sm tw-text-black">{reply?.member?.nickname} </div>
          {/* <div className="tw-text-[11px] tw-text-gray-400 tw-pl-4">{timeForToday(reply?.createAt)}</div> */}
          <div className="tw-font-medium tw-text-sm tw-text-gray-400">{reply?.createdAt}</div>
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
                      reply?.member?.memberUUID,
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
                onClick={() =>
                  replyModifyEvent(reply?.body, reply?.clubSequence, reply?.member?.memberUUID, reply?.quizSequence)
                }
              >
                수정하기
              </button>
              <button
                className={cx('tw-text-[12px]', 'tw-text-gray-400  tw-underline')}
                onClick={() => onReplyDeleteSubmit(reply?.clubSequence, reply?.member?.memberUUID, reply?.quizSequence)}
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityCardReReply;
