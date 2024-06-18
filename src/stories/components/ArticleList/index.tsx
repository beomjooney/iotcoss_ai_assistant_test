import React, { useEffect, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';

import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useDeletePostContent } from 'src/services/community/community.mutations';

const cx = classNames.bind(styles);

const ArticleList: React.FC<any> = ({ data, refetchMyQuizContent }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { mutate: onDeletePostContent, isSuccess: deletePostContentSuccess } = useDeletePostContent();

  console.log(data);
  useEffect(() => {
    if (deletePostContentSuccess) {
      refetchMyQuizContent();
    }
  }, [deletePostContentSuccess]);

  const handleDelete = contentSequence => {
    // Handle delete action
    console.log('Delete clicked', contentSequence);
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      onDeletePostContent({
        contentSequence: data.contentSequence,
      });
    }
    handleClose();
  };

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <div className={cx('content-area ')}>
          <div className=" tw-p-8 tw-mb-5 tw-rounded-lg border">
            <div className="tw-flex tw-justify-between tw-items-center">
              <p className=" tw-text-base tw-text-left tw-text-black">{data?.description}</p>
              <div className="tw-flex tw-justify-end tw-items-center tw-gap-5">
                <p className="tw-text-sm tw-text-right tw-text-[#9ca5b2]">{data.createdDate}</p>
                <svg
                  width={28}
                  height={28}
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-w-7 tw-h-7 tw-relative"
                  preserveAspectRatio="xMidYMid meet"
                  onClick={handleClick}
                >
                  <path
                    d="M14 8.75C14.9665 8.75 15.75 7.9665 15.75 7C15.75 6.0335 14.9665 5.25 14 5.25C13.0335 5.25 12.25 6.0335 12.25 7C12.25 7.9665 13.0335 8.75 14 8.75Z"
                    fill="#6A7380"
                  />
                  <path
                    d="M14 15.75C14.9665 15.75 15.75 14.9665 15.75 14C15.75 13.0335 14.9665 12.25 14 12.25C13.0335 12.25 12.25 13.0335 12.25 14C12.25 14.9665 13.0335 15.75 14 15.75Z"
                    fill="#6A7380"
                  />
                  <path
                    d="M14 22.75C14.9665 22.75 15.75 21.9665 15.75 21C15.75 20.0335 14.9665 19.25 14 19.25C13.0335 19.25 12.25 20.0335 12.25 21C12.25 21.9665 13.0335 22.75 14 22.75Z"
                    fill="#6A7380"
                  />
                </svg>
                <Menu
                  disableScrollLock={true}
                  id="account-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  sx={{
                    '.MuiPaper-root': {
                      boxShadow: 'none',
                      border: '1px solid #E0E0E0',
                    },
                  }}
                >
                  <MenuItem onClick={() => handleDelete(data?.contentSequence)}>삭제하기</MenuItem>
                </Menu>
              </div>
            </div>

            {/* Render tags */}
            <div className="tw-py-5 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
              <div className="tw-flex tw-gap-3">
                <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-[10.5px] ">
                  <p className="tw-text-[12.25px] tw-text-[#235a8d]">{data?.jobGroups[0]?.name || 'N/A'}</p>
                </div>
                <div className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-[10.5px]">
                  <p className="tw-text-[12.25px] tw-text-[#313b49]">{data?.jobLevels[0]?.name || 'N/A'}</p>
                </div>
                <div className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-[10.5px] ">
                  <p className="tw-text-[12.25px] tw-text-[#b83333]">{data?.jobs[0]?.name || 'N/A'}</p>
                </div>
              </div>
            </div>

            {data.skills?.map((tag, tagIndex) => (
              <div
                key={tagIndex}
                className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-bg-[#d7ecff]"
              >
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#235a8d]">{tag}</p>
              </div>
            ))}
            {/* Render hashtags */}

            <div className="tw-flex tw-justify-between">
              <div className="tw-flex">
                <p className="text-sm  tw-text-sm tw-font-bold tw-text-left tw-text-black tw-w-20">URL :</p>
                <p className=" text-sm tw-text-sm tw-text-left tw-text-gray-500 tw-line-clamp-1">{data.url}</p>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-gap-2">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                  <svg
                    width={20}
                    height={21}
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M18.3337 8.20008L12.342 7.68341L10.0003 2.16675L7.65866 7.69175L1.66699 8.20008L6.21699 12.1417L4.85033 18.0001L10.0003 14.8917L15.1503 18.0001L13.792 12.1417L18.3337 8.20008ZM10.0003 13.3334L6.86699 15.2251L7.70033 11.6584L4.93366 9.25842L8.58366 8.94175L10.0003 5.58341L11.4253 8.95008L15.0753 9.26675L12.3087 11.6667L13.142 15.2334L10.0003 13.3334Z"
                      fill="#9CA5B2"
                    />
                  </svg>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                    {data.starCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
