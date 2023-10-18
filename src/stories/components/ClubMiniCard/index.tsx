import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { BoardType, ReplyType } from 'src/config/entities';
import React, { useEffect, useRef, useState } from 'react';
import { User } from 'src/models/user';
import { useSessionStore } from 'src/store/session';
const { logged } = useSessionStore.getState();
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { makeStyles } from '@material-ui/core';

export interface ClubMiniCardProps {
  /** 게시판 object */
  item: BoardType;
  /** 작성자 */
  writer: User;
  xs: number;
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

const ClubMiniCard = ({
  item,
  xs,
  writer,
  className,
  memberId,
  onPostDeleteSubmit,
}: // eslint-disable-next-line @typescript-eslint/no-empty-function
ClubMiniCardProps) => {
  // TODO 좋아요 여부 필드 수정 필요
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [removeIndex, setRemoveIndex] = React.useState('');
  const textInput = useRef(null);

  const handleDropMenuClick = (event: React.MouseEvent<HTMLElement>, removeIndex) => {
    setRemoveIndex(removeIndex);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>) => {
    router.push('/quiz-manage/' + removeIndex);
    setAnchorEl(null);
  };
  const handleMenuItemCrewClick = (event: React.MouseEvent<HTMLElement>) => {
    router.push('/crew-manage/' + removeIndex);
    setAnchorEl(null);
  };
  const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiPaper-root': {
        boxShadow: '0px 0px 0px 0px rgba(0,0,0,0.75);',
      },
    },
  }));

  function ClubStatus({ status }) {
    let statusText;
    let statusClass;
    statusClass =
      'tw-bg-black tw-text-white tw-text-sm tw-font-medium tw-mr-1 tw-px-2.5 tw-py-[5px] tw-py-1 tw-rounded';

    switch (status) {
      case '0004':
        statusText = '진행중';
        break;
      case '0003':
        statusText = '진행예정';
        break;
      case '0005':
        statusText = '진행완료';
        break;
      default:
        // 기본값 처리
        break;
    }

    return <span className={statusClass}>{statusText}</span>;
  }

  const router = useRouter();
  const classes = useStyles();
  return (
    <Grid item xs={xs}>
      <div className="tw-flex tw-flex-col border tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg md:tw-flex-row tw-w-full ">
        <img
          className="tw-object-cover tw-w-[200px] tw-rounded-l-lg tw-h-[145px] md:tw-h-[145px] md:tw-w-[200px]"
          src={item?.clubImageUrl}
          alt=""
        />
        <div className="tw-flex tw-w-full tw-flex-col tw-justify-between tw-p-4 tw-pb-0 tw-leading-normal">
          <Grid
            className=" tw-mb-3"
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            rowSpacing={0}
          >
            <Grid item xs={11}>
              <div className="tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                <ClubStatus status={item?.clubStatus} /> {/* 진행중 */}
                {item?.recommendJobGroupNames.map((name, i) => (
                  <span
                    key={i}
                    className="tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-[5px]  tw-rounded"
                  >
                    {name}
                  </span>
                ))}
                {item?.recommendLevels.map((name, i) => (
                  <span
                    key={i}
                    className="tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-[5px]  tw-rounded "
                  >
                    {name} 레벨
                  </span>
                ))}
                {item?.recommendJobNames.map((name, i) => (
                  <span
                    className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-[5px]  tw-rounded "
                    key={i}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </Grid>
            <Grid item xs={1} className="tw-text-right">
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={event => handleDropMenuClick(event, item.sequence)}
              >
                <MoreVertIcon />
              </IconButton>
              <div>
                <Menu
                  id="lock-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  className={classes.root}
                  MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                    style: {
                      border: '1px solid rgb(218, 226, 237)',
                      boxShadow: 'none !important',
                      borderRadius: '12px',
                    },
                  }}
                >
                  <MenuItem onClick={event => handleMenuItemClick(event)}>퀴즈관리하기</MenuItem>
                  <MenuItem onClick={event => handleMenuItemCrewClick(event)}>크루관리하기</MenuItem>
                </Menu>
              </div>
              {/* <button
                onClick={() => {
                  onChangeLike(item.sequence, item.isFavorite);
                }}
              >
                {isLiked ? <StarIcon color="primary" /> : <StarBorderIcon color="disabled" />}
              </button> */}
            </Grid>
          </Grid>
          <h6 className="tw-mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
            {item.name}
          </h6>

          <Grid
            className=" tw-mb-3"
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            rowSpacing={0}
          >
            <Grid item xs={9}>
              <div className="tw-mb-3 tw-text-sm tw-font-semibold tw-text-gray-400 dark:tw-text-gray-400">
                {item.studyCycle.toString()} | {item.studyCount} 주 | 학습 {item.weekCount}회
              </div>
            </Grid>
            <Grid item xs={3} className="tw-text-right">
              <div>{item?.leaderNickname}</div>
            </Grid>
          </Grid>
        </div>
      </div>
    </Grid>
  );
};

export default ClubMiniCard;
