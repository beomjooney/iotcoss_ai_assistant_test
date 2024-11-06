import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { BoardType, ReplyType } from 'src/config/entities';
import React, { useEffect, useRef, useState } from 'react';
import { User } from 'src/models/user';
import { useSessionStore } from 'src/store/session';
const { logged } = useSessionStore.getState();
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useSaveFavorite, useDeleteFavorite } from 'src/services/community/community.mutations';
import { getButtonText, getClubStatusMessage, getClubAboutStatus } from 'src/utils/clubStatus';

export interface ClubMiniCardProps {
  /** 게시판 object */
  item: any;
  /** 작성자 */
  xs: number;
  /** className */
  className?: string;
  favorite?: boolean;
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
  favorite = false,
  xs,
  onPostDeleteSubmit,
}: // eslint-disable-next-line @typescript-eslint/no-empty-function
ClubMiniCardProps) => {
  // TODO 좋아요 여부 필드 수정 필요
  let [isLiked, setIsLiked] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [removeIndex, setRemoveIndex] = React.useState('');
  const textInput = useRef(null);

  const { mutate: onSaveFavorite, isSuccess: isSuccessFavorite } = useSaveFavorite();
  const { mutate: onDeleteFavorite, isSuccess: isSuccessDelete } = useDeleteFavorite();

  // console.log('item', item);

  useEffect(() => {
    if (isSuccessDelete) {
      onPostDeleteSubmit();
    }
  }, [isSuccessDelete]);

  const handleMenuItemClick = index => {
    // router.push('/quiz-manage/' + removeIndex);
    router.push('/quiz-dashboard/' + index);
    setAnchorEl(null);
  };
  const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiPaper-root': {
        boxShadow: '0px 0px 0px 0px rgba(0,0,0,0.75);',
      },
    },
  }));

  const onChangeFavorite = function (postNo: number, isFavorites: boolean) {
    console.log(postNo, isFavorites);

    if (logged) {
      setIsLiked(!isLiked);
      console.log(isLiked);
      if (isLiked) {
        onDeleteFavorite(postNo);
      } else {
        onSaveFavorite(postNo);
      }
    } else {
      alert('로그인 후 좋아요를 클릭 할 수 있습니다.');
    }
  };

  useEffect(() => {
    setIsLiked(item?.isFavorite);
  }, [item]);

  const router = useRouter();
  const classes = useStyles();
  return (
    <Grid item xs={xs} className="tw-w-full">
      <div
        onClick={() => {
          favorite ? '' : handleMenuItemClick(item?.clubSequence);
        }}
        className="tw-cursor-pointer tw-flex tw-flex-col border tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg md:tw-flex-row tw-w-full "
      >
        <img
          className="!tw-w-[180px] tw-h-[145px] tw-rounded-l-lg tw-object-cover tw-min-w-[180px]"
          src={item?.clubImageUrl || '/assets/images/banner/Rectangle_193.png'}
          alt=""
        />
        <div className="tw-flex tw-w-full tw-flex-col tw-justify-between tw-px-4  tw-leading-normal">
          <Grid
            className=" tw-mb-2"
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            rowSpacing={0}
          >
            <Grid item xs={11}>
              <div className="tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500">
                <div className="tw-flex tw-gap-[7px] tw-flex-wrap tw-max-h-[50px] tw-overflow-hidden tw-relative">
                  {/* Ensuring the maximum height doesn't exceed 3 lines. Adjust '60px' based on line height */}
                  <div className="tw-bg-black tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                    <p className="tw-text-[12.25px] tw-text-white">{getClubAboutStatus(item?.clubAboutStatus)}</p>
                  </div>
                  {item?.jobGroups[0].name && (
                    <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                      <p className="tw-text-[12.25px] tw-text-[#235a8d]">{item?.jobGroups[0].name || 'N/A'}</p>
                    </div>
                  )}

                  {item?.jobs?.length > 0 &&
                    item.jobs.map(
                      (job, index) =>
                        job.name && (
                          <div key={index} className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                            <p className="tw-text-[12.25px] tw-text-[#b83333]">{job.name}</p>
                          </div>
                        ),
                    )}

                  {item?.jobLevels?.length > 0 &&
                    item.jobLevels.map((jobLevel, index) => (
                      <div key={index} className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                        <p className="tw-text-[12.25px] tw-text-[#313b49]">{jobLevel.name || 'N/A'}</p>
                      </div>
                    ))}
                </div>
              </div>
            </Grid>
            <Grid item xs={1}>
              {favorite && (
                <button
                  onClick={() => {
                    onChangeFavorite(item?.clubSequence, item?.isFavorite);
                  }}
                >
                  {isLiked ? <StarIcon color="error" /> : <StarBorderIcon color="disabled" />}
                </button>
              )}
            </Grid>
          </Grid>
          <div className="tw-text-base tw-font-bold tw-tracking-tight tw-text-gray-900 ">{item?.clubName}</div>
          <div className="tw-my-1 tw-text-sm tw-font-medium tw-tracking-tight tw-text-gray-900">
            {item?.description}
          </div>

          <div className="tw-mb-2 tw-text-sm tw-font-medium tw-tracking-tight tw-text-gray-900">
            <span className="tw-font-bold">{item?.leaderNickname}</span>{' '}
            <span className="tw-text-gray-400 tw-px-3">
              {item?.startAt.split(' ')[0]} ~ {item?.endAt.split(' ')[0]}
            </span>
            <span className="tw-text-gray-400">
              {item?.studyCycle?.length > 0 ? `| ${item?.studyCycle.toString()} ` : ''} | &nbsp;퀴즈클럽 :{' '}
              {item?.weekCount} 주 | 학습 : {item?.weekCount}회
            </span>
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default ClubMiniCard;
