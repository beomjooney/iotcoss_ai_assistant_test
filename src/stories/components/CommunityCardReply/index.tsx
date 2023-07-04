import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { ReplyType } from 'src/config/entities';
import Chip from '../Chip';
import { jobColorKey } from 'src/config/colors';
import { User } from 'src/models/user';
import Tooltip from '../Tooltip';
import Grid from '@mui/material/Grid';

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

const CommunityCardReply = ({ reply, writer, className, memberId, onReplyDeleteSubmit }: CommunityCardReplyProps) => {
  const { jobGroupName, jobGroup } = writer;
  const chipColor = jobColorKey(jobGroup);

  // TODO 좋아요 여부 필드 수정 필요

  return (
    <div className={cx('community-board-reply-container', 'row', className)}>
      <div className={cx('profile-wrap', 'col-md-1')}>
        <img
          src={`${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${reply.author?.profileImageUrl}`}
          alt={`${writer.jobGroupName} ${reply.author.nickname}`}
          className={cx('rounded-circle', 'profile-image')}
        />
      </div>
      <div className={cx('profile-wrap', 'col-md-20')}>
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

            {/*TODO 원래 job(직업)임*/}
            <h6 className={cx('profile-desc__job')}>{writer.jobGroupName}</h6>
          </div>
          {/* <h5 className={cx('profile-desc__name', 'mb-0')}>{reply.author.nickname}</h5> */}
        </div>
      </div>
      <div className={cx('reply-wrap', 'col-md-7')}>{reply.body}</div>
      <div className={cx('reply-wrap', 'col-md-1')}>
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
      </div>
    </div>
  );
};

export default CommunityCardReply;
