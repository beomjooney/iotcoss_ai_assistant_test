import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { ReplyType } from 'src/config/entities';
import Chip from '../Chip';
import { jobColorKey } from 'src/config/colors';
import { User } from 'src/models/user';
import Tooltip from '../Tooltip';
import Grid from '@mui/material/Grid';
import { Textfield, Button } from 'src/stories/components';
import { useRef, useState } from 'react';
import { useSessionStore } from 'src/store/session';
const { logged } = useSessionStore.getState();

export interface CommunityCardReplyProps {
  /** 댓글 */
  reply: ReplyType;
  /** 작성자 */
  writer: User;
  /** className */
  className?: string;
  memberId: string;
  onReplyDeleteSubmit: (...args: any[]) => any;
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

const CommunityCardReply = ({ reply, writer, className, memberId, onReplyDeleteSubmit }: CommunityCardReplyProps) => {
  // const { jobGroupName, jobGroup } = writer;
  // const chipColor = jobColorKey(jobGroup);
  const textInput = useRef(null);
  let [isOpen, setIsOpened] = useState(false);

  const onReplySubmit = () => {
    setIsOpened(!isOpen);
    // if (logged) {
    //   onSaveReply({
    //     postNo: postNo,
    //     data: {
    //       body: text,
    //     },
    //   });
    //   textInput.current.value = '';
    //   setReplyCount(replyCount => replyCount + 1);
    // } else {
    //   alert('로그인 후 댓글을 입력할 수 있습니다.');
    // }
  };

  // TODO 좋아요 여부 필드 수정 필요

  return (
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
      {/* <div className="tw-grid tw-grid-cols-12 tw-items-start tw-justify-center">
        <div className="tw-col-span-1"></div>
        <div className="tw-col-span-11 tw-py-3">
          <button className={cx('tw-text-[12px]', 'tw-text-gray-400')} onClick={() => onReplySubmit()}>
            댓글쓰기
          </button>
        </div>
        <div className="tw-col-span-1"></div>
      </div> */}
      {isOpen && (
        <div className="tw-grid tw-grid-cols-12 tw-items-center tw-justify-center">
          <div className="tw-col-span-1"></div>
          <div className="tw-col-span-10">
            <div className={cx('tw-text-[12px]', 'tw-text-gray-400')}>
              <Textfield defaultValue="" placeholder="댓글을 입력하세요." ref={textInput} />
            </div>
          </div>
          <div className="tw-col-span-1">
            <div>
              <button
                className="tw-bg-gray-400 tw-text-white tw-py-[10px] tw-px-6  tw-ml-2 tw-rounded-md tw-text-sm"
                onClick={() => onReplySubmit(reply.postNo, textInput.current.value)}
              >
                입력
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <div className={cx('profile-wrap', 'col-md-1')}>
        <img
          src={`${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${reply.author?.profileImageUrl}`}
          alt={`${writer.jobGroupName} ${reply.author.nickname}`}
          className={cx('rounded-circle', 'profile-image')}
        />
      </div> */}
      {/* <div className={cx('profile-wrap', 'col-md-20')}>
        <div className={cx('profile-desc')}>
          <Chip chipColor={chipColor} radius={4} variant="outlined">
            {reply.author.jobGroupName}
          </Chip>
          <Chip chipColor={chipColor} radius={4} className="ml-2">
            {reply.author.level}레벨
          </Chip>{' '}
          <div>
            <h5 className={cx('profile-desc__name', 'mt-2')}>
              <Grid container spacing={1}>
                <Grid item xs="auto">
                  {reply.author.nickname}
                </Grid>
                <Grid item xs="auto">
                  {reply.author.typeName === '0001' ? '멘티' : '멘토'}
                </Grid>
                <Grid item xs="auto">
                  <Tooltip content={reply.author.typeName} placement="bottom" trigger="mouseEnter">
                    {reply.author?.type === '0002' && (
                      <img src="/assets/images/level/Mento_lev1.svg" alt={reply.author?.typeName} />
                    )}
                  </Tooltip>
                  <Tooltip content={reply.author?.typeName} placement="bottom" trigger="mouseEnter">
                    {reply.author?.type === '0003' && (
                      <img src="/assets/images/level/Mento_lev2.svg" alt={reply.author?.typeName} />
                    )}
                  </Tooltip>
                  <Tooltip content={reply.author?.typeName} placement="bottom" trigger="mouseEnter">
                    {reply.author?.type === '0004' && (
                      <img src="/assets/images/level/Mento_lev3.svg" alt={reply.author?.typeName} />
                    )}
                  </Tooltip>
                  <Tooltip content={reply.author?.typeName} placement="bottom" trigger="mouseEnter">
                    {reply.author?.type === '0005' && (
                      <img src="/assets/images/level/Mento_lev4.svg" alt={reply.author?.typeName} />
                    )}
                  </Tooltip>
                </Grid>
              </Grid>
            </h5>

            <h6 className={cx('profile-desc__job')}>{writer.jobGroupName}</h6>
          </div>
        </div>
      </div> */}

      {/* <div className={cx('reply-wrap', 'col-md-1')}>
        {memberId == reply.author.memberId ? (
          <Chip
            chipColor={chipColor}
            radius={4}
            variant="outlined"
            onClick={() => onReplyDeleteSubmit(reply.postReplyNo, reply.parentPostNo)}
          >
            삭제
          </Chip>
        ) : (
          <div></div>
        )}
      </div> */}
    </div>
  );
};

export default CommunityCardReply;
