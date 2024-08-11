import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { BoardType } from 'src/config/entities';
import React, { useEffect, useRef, useState } from 'react';
import { User } from 'src/models/user';
import { useSaveLike, useDeleteLike, useSaveReply, useDeleteReply } from 'src/services/community/community.mutations';
import { useSessionStore } from 'src/store/session';
import Grid from '@mui/material/Grid';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';

export interface LectureCardProps {
  /** 게시판 object */
  item: any;
  /** 작성자 */
  xs: number;
  className?: string;
  selectedImage: string;
  selectedImageBanner: string;
}

const cx = classNames.bind(styles);

const LectureCard = ({
  item,
  xs,
  selectedImage,
  selectedImageBanner,
  className,
}: // eslint-disable-next-line @typescript-eslint/no-empty-function
LectureCardProps) => {
  console.log('item', item);
  const { logged } = useSessionStore.getState();
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();

  // TODO 좋아요 여부 필드 수정 필요
  let [isLiked, setIsLiked] = useState(false);
  let [isOpen, setIsOpened] = useState(false);
  let [likeCount, setLikeCount] = useState(0);
  let [replyCount, setReplyCount] = useState(0);
  let [postNo, setPostNo] = useState(0);
  let [repliesList, setRepliesList] = useState([]);
  const { mutate: onSaveReply, isSuccess: replyReplySucces } = useSaveReply();
  const { mutate: onDeleteReply, isSuccess: deleteReplySucces } = useDeleteReply();
  // const { isFetched: isReplyFetched, refetch } = useRepliesList(postNo, data => {
  //   setRepliesList(data.data);
  // });

  // useEffect(() => {
  //   refetch();
  // }, [postNo, replyReplySucces, deleteReplySucces]);

  useEffect(() => {
    setIsLiked(item?.isFavorite);
    // setLikeCount(item?.likeReactionCount);
    // setReplyCount(item?.replyCount);
  }, [item]);

  const textInput = useRef(null);

  const onReplySubmit = (postNo: number, text: string) => {
    if (logged) {
      onSaveReply({
        postNo: postNo,
        data: {
          body: text,
        },
      });
      textInput.current.value = '';
      setReplyCount(replyCount => replyCount + 1);
    } else {
      alert('로그인 후 댓글을 입력할 수 있습니다.');
    }
  };

  const onReplyDeleteSubmit = (postReplyNo: number, parentPostNo: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      onDeleteReply({
        postReplyNo: postReplyNo,
        parentPostNo: parentPostNo,
      });
      setReplyCount(replyCount => replyCount - 1);
    }
  };

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

  const onReply = function (postNo: number) {
    setPostNo(postNo);
    setIsOpened(!isOpen);
  };

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

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Desktop>
        <Grid item xs={xs}>
          <a
            href={logged ? '/lecture/' + `${item.clubSequence}` : '#'}
            onClick={e => {
              if (!logged) {
                e.preventDefault();
                alert('로그인 후 이동할 수 있습니다.');
              }
            }}
          >
            {isClient && !logged && (
              <div className="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-h-[300px] tw-bg-gradient-to-t tw-from-white tw-to-transparent tw-pointer-events-none"></div>
            )}
            <div
              style={{ backgroundImage: `url(${item.backgroundImage || '/assets/images/banner/Rectangle_200.png'})` }}
              className="border  tw-h-[235px] tw-relative tw-overflow-hidden tw-rounded-lg  tw-bg-cover tw-bg-no-repeat tw-bg-center tw-border tw-border-[#e9ecf2]"
            >
              <div className="tw-absolute tw-inset-0 tw-bg-white tw-opacity-90 tw-rounded-lg md:tw-rounded-none md:tw-rounded-r-lg"></div>
              <svg
                width={320}
                height={320}
                viewBox="0 0 275 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-absolute tw-left-[268px] tw-top-[-44px] tw-opacity-50"
                preserveAspectRatio="xMidYMid meet"
              >
                <circle opacity="0.5" cx={163} cy={120} r={163} fill="url(#paint0_linear_3000_19130)" />
                <defs>
                  <linearGradient
                    id="paint0_linear_3000_19130"
                    x1={163}
                    y1={-43}
                    x2={163}
                    y2={283}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" stopOpacity={0} />
                    <stop offset={1} stopColor="#2A46AC" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className=" tw-h-60 tw-absolute tw-left-[-1px] tw-top-[-1px]" />
              <button
                className="tw-w-6 tw-h-6 tw-absolute tw-left-[504px] tw-top-4"
                onClick={() => {
                  onChangeLike(item.clubSequence);
                }}
              >
                {isLiked ? <StarIcon color="error" /> : <StarBorderIcon color="disabled" />}
              </button>
              <div className="tw-w-[262px] tw-h-6">
                <p className="tw-w-[262px] tw-h-6 tw-absolute tw-left-5 tw-top-[62px] tw-text-xl tw-font-bold tw-text-left tw-text-black">
                  {item.clubName}
                </p>
              </div>
              <p className="tw-absolute tw-left-5 tw-top-[152px] tw-text-sm tw-text-left tw-text-[#31343d]">
                <span className="tw-text-sm tw-text-left tw-text-[#31343d]">
                  {item.startAt.split(' ')[0]}~{item.endAt.split(' ')[0]}
                </span>
                <br />
                <span className="tw-text-sm tw-text-left tw-text-[#31343d]">
                  강의클럽 {item.weekCount}주{/* 화, 목ㅣ 강의클럽 {item.weekCount}주ㅣ학습 24회 */}
                </span>
              </p>
              <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-5 tw-top-5 tw-gap-1">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#e4e4e4]">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#5f5f5f]">
                    {item?.jobGroups[0].name || 'N/A'}
                  </p>
                </div>

                {item?.jobs?.length > 0 &&
                  item.jobs.map((job, index) => (
                    <div
                      key={index}
                      className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#d7ecff]"
                    >
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#235a8d]">
                        {job.name || 'N/A'}
                      </p>
                    </div>
                  ))}

                {item?.jobLevels?.length > 0 &&
                  item.jobLevels.map((jobLevel, index) => (
                    <div
                      key={index}
                      className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#fffdc8]"
                    >
                      <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#806024]">
                        {jobLevel.name || 'N/A'}
                      </p>
                    </div>
                  ))}
              </div>
              <img
                className="tw-absolute tw-left-[329.5px] tw-top-[17.5px] tw-w-[200px] tw-h-[200px] tw-rounded-full"
                src={item.leaderProfileImageUrl || '/assets/avatars/3.jpg'}
              />
              <p className="tw-absolute tw-left-5 tw-top-[202px] tw-text-sm tw-font-bold tw-text-left tw-text-black">
                {item.leaderNickname}
              </p>
            </div>
          </a>
        </Grid>
        {/* <Grid item xs={xs}>
          <a
            href={logged ? '/lecture/' + `${item.clubSequence}` : '#'}
            onClick={e => {
              if (!logged) {
                e.preventDefault();
                alert('로그인 후 이동할 수 있습니다.');
              }
            }}
            className="tw-relative tw-flex tw-justify-end tw-flex-col tw-bg-white border tw-rounded-lg md:tw-flex-row tw-w-full tw-h-[230px] tw-bg-cover tw-bg-center"
            style={{ backgroundImage: `url(${selectedImageBanner})` }}
          >
            <div className="tw-absolute tw-inset-0 tw-bg-white tw-opacity-90 tw-rounded-lg md:tw-rounded-none md:tw-rounded-r-lg"></div>
            <button
              className="tw-absolute tw-pr-2 tw-pt-2"
              onClick={() => {
                onChangeLike(item.clubSequence);
              }}
            >
              {isLiked ? <StarIcon color="error" /> : <StarBorderIcon color="disabled" />}
            </button>
            <div className="tw-relative tw-flex tw-w-full tw-flex-col tw-p-[12px]">
              <Grid container direction="row" justifyContent="space-between" alignItems="center" rowSpacing={0}>
                <Grid item xs={12}>
                  <div className="max-lg:tw-h-[100px] tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                    <span className="tw-inline-flex tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-1 tw-px-2 tw-py-1 tw-rounded">
                      {item?.jobGroups[0].name || 'N/A'}
                    </span>

                    {item?.jobs?.length > 0 &&
                      item.jobs.map((job, index) => (
                        <span
                          key={index}
                          className="tw-inline-flex tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-1 tw-px-2 tw-py-1 tw-rounded "
                        >
                          {job.name || 'N/A'}
                        </span>
                      ))}

                    {item?.jobLevels?.length > 0 &&
                      item.jobLevels.map((jobLevel, index) => (
                        <span
                          key={index}
                          className="tw-inline-flex tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-1 tw-px-2 tw-py-1 tw-rounded "
                        >
                          {jobLevel.name || 'N/A'}
                        </span>
                      ))}
                  </div>
                </Grid>
              </Grid>
              <div className="tw-my-[12px] tw-text-[12px] tw-font-bold tw-text-[#9a9a9a]">
                모집마감일 : {item?.recruitDeadlineAt?.split(' ')[0] || 'N/A'}
              </div>
              <div className="tw-h-[70px]">
                <h6 className="tw-line-clamp-2 max-lg:tw-h-[112px] tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900">
                  {item.clubName}
                </h6>
                <div className="tw-line-clamp-2 tw-text-sm tw-tracking-tight tw-text-gray-900">
                  {item.description}
                </div>
              </div>
              <div className="tw-text-[12px] tw-mb-[12px] tw-font-bold tw-text-[#9a9a9a]">
                {item.studyCycle.toString() || 'N/A'} | {item.weekCount || 'N/A'} 주 | 학습 {item.studyCount || 'N/A'}회
              </div>

              <div className="tw-flex tw-items-center tw-space-x-4">
                <img
                  className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full"
                  src={item?.leaderProfileImageUrl || '/assets/avatars/3.jpg'}
                  alt=""
                />
                <div className="tw-text-sm tw-font-semibold tw-text-black">
                  <div>{item?.leaderNickname}</div>
                </div>
              </div>
            </div>

            <svg
              width={400}
              height="100%"
              viewBox="0 0 255 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="left-[568px] top-[-154px] opacity-50"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient
                  id="paint0_linear_3000_19130"
                  x1={163}
                  y1={-43}
                  x2={163}
                  y2={283}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity={0} />
                  <stop offset={1} stopColor="#2A46AC" stopOpacity="0.5" />
                </linearGradient>
                <clipPath id="circleView">
                  <circle cx="163" cy="120" r="125" />
                </clipPath>
              </defs>
              <circle opacity="0.5" cx={163} cy={120} r={163} fill="url(#paint0_linear_3000_19130)" />
              <image x="28" y="-35" width="250" height="250" href="/assets/avatars/1.jpg" clipPath="url(#circleView)" />
            </svg>

             <img
              className="tw-object-cover tw-min-w-[230px] tw-w-[225px] tw-rounded-t-lg tw-h-[240px] md:tw-h-[230px] md:tw-w-[230px] md:tw-rounded-none md:tw-rounded-r-lg"
              src={item?.clubImageUrl || 'assets/images/banner/Rectangle_193.png'}
              alt=""
            />
          </a>
        </Grid> */}
      </Desktop>
    </>
  );
};

export default LectureCard;
