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

const CommunityCardReReply = ({ reply, className }: CommunityCardReReplyProps) => {
  // TODO 좋아요 여부 필드 수정 필요

  return (
    <div className={cx('community-board-reply-container', 'row', className)}>
      <div className="tw-grid  tw-grid-cols-12  tw-flex tw-items-center  tw-mt-2 tw-gap-2">
        {/* {board.postNo} */}
        <div className="tw-col-span-1 tw-flex tw-items-center tw-justify-center">
          <img
            src={reply?.replier?.profileImageUrl}
            alt={'image'}
            className={cx('border rounded-circle', 'profile-image', 'tw-h-10', 'tw-w-10')}
          />
        </div>
        <div className="tw-col-span-11 tw-flex tw-items-center tw-space-x-2">
          <div className="tw-font-medium tw-text-sm tw-text-black">{reply?.replier?.nickname} </div>
          {/* <div className="tw-text-[11px] tw-text-gray-400 tw-pl-4">{timeForToday(reply?.createAt)}</div> */}
          <div className="tw-font-medium tw-text-sm tw-text-gray-400">{reply?.createAt}</div>
        </div>
      </div>
      <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
        <div className="tw-col-span-1"></div>
        <div className="tw-col-span-11">
          <div className="tw-text-sm">{reply.body}</div>
        </div>
        <div className="tw-col-span-1"></div>
      </div>
    </div>
  );
};

export default CommunityCardReReply;
