import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Image from 'next/image';
import { Typography } from '../index';
import { Desktop } from 'src/hooks/mediaQuery';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useEffect, useState } from 'react';
import { useDeleteLike, useDeleteReply, useSaveLike, useSaveReply } from 'src/services/community/community.mutations';
import { useSessionStore } from 'src/store/session';
const { logged } = useSessionStore.getState();
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

export interface BannerProps {
  /** 배경 이미지 */
  imageName?: string;
  /** 제목 */
  title: string;
  /** 클래스 */
  data: object;
  className?: string;
  subTitle?: string;
}

const cx = classNames.bind(styles);
// const Banner = ({ imageName = 'top_banner_seminar.jpg', title, subTitle, className }: BannerProps) => {
const BannerDetail = ({ imageName = 'seminar_bg.png', title, subTitle, className, data }: BannerProps) => {
  let [isLiked, setIsLiked] = useState(false);
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();

  useEffect(() => {
    setIsLiked(data?.isFavorite);
  }, [data]);

  const onChangeLike = function (postNo: number) {
    event.preventDefault();
    if (logged) {
      setIsLiked(!isLiked);
      if (isLiked) {
        onDeleteLike(postNo);
      } else {
        onSaveLike(postNo);
      }
    } else {
      alert('로그인 후 좋아요를 클릭 할 수 있습니다.');
    }
  };
  return (
    <div className={cx('content-area', className, 'tw-bg-[#FFFAF1]')}>
      <div className="container tw-p-4 tw-leading-normal tw-text-black tw-font-bold tw-text-xl tw-pt-10 tw-pb-10">
        {title} {'>'} {subTitle}
      </div>
      <div className={cx('banner-container__wrap', ' tw-pb-20')}>
        {/*todo url 경로에 따라 자동 셋팅 구현*/}
        <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow md:tw-flex-row md:tw-max-w-[1100px]">
          <img
            className="tw-object-cover tw-w-[340px] tw-rounded-t-lg tw-h-[340px] md:tw-h-[340px] md:tw-w-[340px] md:tw-rounded-none md:tw-rounded-l-lg"
            src={data?.clubImageUrl}
            alt=""
          />
          <div className="tw-flex tw-w-full tw-flex-col tw-justify-between tw-px-10 tw-leading-normal">
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={8}>
                {data?.recommendJobGroupNames.map((name, i) => (
                  <span
                    key={i}
                    className="tw-bg-blue-100 tw-text-blue-800 tw-text-base tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded"
                  >
                    {name}
                  </span>
                ))}

                {data?.recommendLevels.map((name, i) => (
                  <span
                    key={i}
                    className="tw-bg-gray-100 tw-text-gray-800 tw-text-base tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded "
                  >
                    {name} 레벨
                  </span>
                ))}
                {data?.recommendJobNames.map((name, i) => (
                  <span
                    key={i}
                    className="tw-bg-red-100 tw-text-red-800 tw-text-base tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded "
                  >
                    {name}
                  </span>
                ))}
              </Grid>
              <Grid item xs={4} justifyContent="space-between" alignItems="center" className="tw-flex">
                <div className="tw-font-semibold">모집마감일 : {data?.recruitDeadlineAt.split(' ')[0]}</div>
                <div>
                  <button
                    onClick={() => {
                      onChangeLike(data?.sequence, data?.isFavorite);
                    }}
                  >
                    {isLiked ? <StarIcon color="primary" /> : <StarBorderIcon color="disabled" />}
                  </button>
                </div>
              </Grid>
            </Grid>

            <div className="tw-mb-3 tw-text-sm tw-font-semibold tw-text-gray-500 dark:tw-text-gray-400"></div>
            <h6 className="tw-mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
              {data?.name}
            </h6>
            {/* <p className="tw-line-clamp-2 tw-mb-3 tw-font-normal tw-text-gray-700 dark:tw-text-gray-400">
              {data?.description}
            </p> */}

            <div className="tw-text-base tw-font-bold tw-text-black dark:tw-text-gray-400">
              퀴즈클럽 주수 : {data?.studyWeekCount}주 | 학습 {data?.studyTotalCount}회 ({data?.startAt}~{data?.endAt})
            </div>
            <div className="tw-text-base tw-font-bold tw-text-black dark:tw-text-gray-400">
              퀴즈클럽 주기 : {data?.studyCycle.toString()}
            </div>
            <div className="tw-mb-3 tw-text-base tw-font-bold tw-text-black dark:tw-text-gray-400">
              모집인원 : {data?.recruitMemberCount}명
            </div>
            {/* <div className="tw-mb-3 tw-text-base tw-font-semibold tw-text-gray-400 dark:tw-text-gray-400">
              #프론트엔드 #JAVA #HTML
            </div> */}

            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={8} className="tw-font-bold tw-text-3xl tw-text-black">
                <div className="tw-flex tw-items-center tw-space-x-4">
                  <img className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full" src={data?.leaderProfileImageUrl} alt="" />
                  <div className="tw-text-sm tw-font-semibold tw-text-black dark:tw-text-white">
                    <div>{data?.leaderNickname}</div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4} justifyContent="flex-end" className="tw-flex">
                <button
                  type="button"
                  className="tw-text-white tw-mr-3 tw-bg-blue-500 hover:tw-bg-blue-800 tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
                >
                  참여하기
                </button>
                <button
                  type="button"
                  className="tw-text-white tw-bg-blue-500 hover:tw-bg-blue-800 tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
                >
                  친구초대
                </button>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDetail;
