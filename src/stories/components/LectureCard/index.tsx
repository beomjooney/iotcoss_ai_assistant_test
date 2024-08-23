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
              <div
                className="tw-opacity-30 tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-h-[300px] tw-pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0) 70%, rgba(255, 255, 255, 0.05) 0%)',
                  backgroundBlendMode: 'overlay',
                }}
              ></div>
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

                {/* {item?.jobs?.length > 0 &&
                  item.jobs.map((job, index) => ( */}
                <div
                  // key={index}
                  className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#d7ecff]"
                >
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#235a8d]">
                    {item?.jobs[0]?.name || 'N/A'}
                  </p>
                </div>
                {/* ))} */}

                {/* {item?.jobLevels?.length > 0 &&
                  item.jobLevels.map((jobLevel, index) => ( */}
                <div
                  // key={index}
                  className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#fffdc8]"
                >
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#806024]">
                    {item?.jobLevels?.[0]?.name || 'N/A'}
                  </p>
                </div>
                {/* ))} */}
              </div>
              <img
                className="tw-absolute tw-left-[329.5px] tw-top-[17.5px] tw-w-[200px] tw-h-[200px] tw-rounded-full"
                src={item.leaderProfileImageUrl || '/assets/images/account/default_profile_image.png'}
              />
              <p className="tw-absolute tw-left-5 tw-top-[202px] tw-text-sm tw-font-bold tw-text-left tw-text-black">
                {item.leaderNickname}
              </p>
            </div>
          </a>
        </Grid>
      </Desktop>
    </>
  );
};

export default LectureCard;
