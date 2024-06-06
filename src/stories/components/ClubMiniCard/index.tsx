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
  console.log('item', item);

  const handleDropMenuClick = (event: React.MouseEvent<HTMLElement>, removeIndex) => {
    setRemoveIndex(removeIndex);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = index => {
    // router.push('/quiz-manage/' + removeIndex);
    router.push('/quiz-dashboard/' + index);
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

  const getButtonText = status => {
    console.log(status);
    switch (status) {
      case '0002':
        return '가입완료';
      case '0200':
        return '개설 예정';
      case '0210':
        return '개설 연기';
      case '0220':
        return '취소';
      case '0300':
        return '모집중';
      case '0310':
        return '모집완료';
      case '4000':
        return '진행중';
      case '0500':
        return '완료';
    }
  };

  const router = useRouter();
  const classes = useStyles();
  return (
    <Grid item xs={xs}>
      <div
        onClick={() => {
          handleMenuItemClick(item?.clubSequence);
        }}
        className="tw-cursor-pointer tw-flex tw-flex-col border tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg md:tw-flex-row tw-w-full "
      >
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
                <div className="tw-flex tw-gap-[7px]">
                  <div className="tw-bg-black tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                    <p className="tw-text-[12.25px] tw-text-white">{getButtonText(item?.clubStatus)}</p>
                  </div>
                  <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                    <p className="tw-text-[12.25px] tw-text-[#235a8d]">{item?.jobGroups[0].name}</p>
                  </div>
                  <div className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                    <p className="tw-text-[12.25px] tw-text-[#313b49]">{item?.jobLevels[0].name}</p>
                  </div>
                  <div className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                    <p className="tw-text-[12.25px] tw-text-[#b83333]">{item?.jobs[0].name}</p>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          <h6 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
            {item?.clubName}
          </h6>
          <h6 className="tw-mb-2 tw-text-xl tw-font-medium tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
            {item?.description}
          </h6>

          <div className="tw-mb-2 tw-text-base tw-font-medium tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
            <span className="tw-font-bold">{item?.leaderNickname}</span>{' '}
            <span className="tw-text-gray-400 tw-px-3">
              {item?.startAt.split(' ')[0]} ~ {item?.endAt.split(' ')[0]}
            </span>
            <span className="tw-text-gray-400">
              | {item?.studyCycle?.toString()} | 퀴즈클럽 : {item?.weekCount} 주 | 학습 {item?.weekCount}회
            </span>
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default ClubMiniCard;
