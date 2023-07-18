import React, { FC, useEffect } from 'react';

import { Link } from 'react-router-dom';

import NcImage from '../NcImage/NcImage';
import ListItemtag from './ListItemTag';

export type ArticleLikeUser = {
  userId: string;
  name: string;
  profileImageUrl: string;
};

export type Article = {
  articleId: number | string;
  title: string;
  boardId: number;
  boardName?: string;
  boardType?: string;
  hashtags?: string[]; //태그 리스트
  myLike?: boolean; // 내가 좋아요 눌렀는지 여부
  likeCnt?: number; //좋아요숫자
  likeUsers?: ArticleLikeUser[]; // 좋아요 유저리스트
  replyCnt?: number;
  viewCnt?: number;
  group?: string;
  name: string;
  userId: string;
  profileImageUrl?: string;
  body?: string; // html
  imageFileUrls?: string[];
  imageFiles?: string[];
  previewText?: string;
  previewImageUrl?: string;
  previewImageFilename?: string;
  createDate?: string;
  updateDate: string;
};

interface Card13Props {
  className?: string;
  post: Article;
  handleClick: any;
  active?: boolean;
}

const SecondTechLogCard: FC<Card13Props> = ({ className = '', post, handleClick, active }) => {
  const { previewImageUrl, previewText, createDate, boardName, title, hashtags, myLike, articleId, boardId, likeCnt } =
    post;

  return (
    <div className="flex justify-between w-full border">
      <div
        className={`w-full ${
          active && 'bg-neutral-100 dark:bg-neutral-700'
        }  hover:bg-neutral-100 hover:cursor-pointer hover:dark:bg-neutral-700 pr-2 nc-Card13 relative flex ${className} `}
        data-nc-id="Card13"
        onClick={() => {
          handleClick(post);
        }}
      >
        <div className={`block relative h-full flex-shrink-0 sm:w-40 sm:h-40 sm:h-full sm:mr-3 max-sm:mt-0`}>
          <div className="max-sm:w-20 max-sm:h-20">
            <NcImage
              containerClassName="absolute inset-0"
              className="object-cover w-full h-full max-sm:w-20 max-sm:h-20"
              src={previewImageUrl}
              alt={title}
            />
          </div>
        </div>
        <div className="flex flex-col h-full w-full pt-2">
          {/* <div className="flex justify-between items-center mb-0 line-clamp-1"></div> */}
          <div className="flex justify-between items-center max-sm:w-24 line-clamp-1 sm:min-h-[20px] ">
            <div className="flex items-center">
              {hashtags && hashtags.length > 0 ? (
                hashtags?.map((hashtag: string, index: number) => {
                  return <ListItemtag key={index} hashtag={hashtag} marginClass={'mr-2'} />;
                })
              ) : (
                <></>
              )}
            </div>
            {/* <StarIcon className="w-4 h-4 stroke-1" /> */}
          </div>
          <div className="w-32 mr-2 flex items-center mt-1">
            <span className="sm:text-xs text-gray-400">모집마감일</span>
            <span className="sm:text-xs text-gray-400 ">{createDate && `createDate`}</span>
          </div>
          <h2 className={`nc-card-title block font-semibold text-base mb-6`}>
            <span
              className={`line-clamp-1 mt-1 break-all ${active && 'font-semibold'}`}
              title={title}
              style={{
                fontSize: '14px',
              }}
            >
              {title}
            </span>
          </h2>
          <div className="sm:block mt-1 text-neutral-500 dark:text-neutral-400 sm:min-h-[6px] mb-0">
            <div className="line-clamp-2 break-all text-sm" style={{ fontSize: '5px' }}>
              {`추천 ${likeCnt} | 공감 ${likeCnt} | 좋아요 ${likeCnt}`}
            </div>
          </div>
          <div className="flex justify-start items-start hidden sm:flex mb-2">
            {/* <CustomPostCard meta={post} size="small" /> */}
            {/* <ArticleLikeAndComment
              postData={post}
              enableReply={board?.enableReply}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondTechLogCard;
