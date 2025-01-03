import React, { useEffect, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';

import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useDeletePostContent } from 'src/services/community/community.mutations';
import { useContentSaveLike, useContentDeleteLike } from 'src/services/community/community.mutations';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useQuizFileDownload } from 'src/services/quiz/quiz.queries';

const cx = classNames.bind(styles);

const ArticleList: React.FC<any> = ({ data, refetchMyQuizContent }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  let [isLiked, setIsLiked] = useState(false);
  let [likeCount, setLikeCount] = useState(0);
  const [key, setKey] = useState('');
  const [fileName, setFileName] = useState('');

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { mutate: onDeletePostContent, isSuccess: deletePostContentSuccess } = useDeletePostContent();
  const { mutate: onSaveLike, isSuccess } = useContentSaveLike();
  const { mutate: onDeleteLike } = useContentDeleteLike();

  console.log('article list', data);

  const { isFetched: isParticipantListFetcheds, isSuccess: isParticipantListSuccess } = useQuizFileDownload(
    key,
    data => {
      console.log('file download', data, fileName);
      if (data) {
        // blob 데이터를 파일로 저장하는 로직
        // const url = window.URL.createObjectURL(new Blob([data]));
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', fileName); // 다운로드할 파일 이름과 확장자를 설정합니다.
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);

        // blob 데이터를 URL로 변환
        const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));

        // 브라우저에서 PDF를 새 탭에서 열기
        window.open(url, '_blank', 'noopener,noreferrer');

        setKey('');
        setFileName('');
      }
    },
  );

  useEffect(() => {
    setIsLiked(data?.isLiked);
    setLikeCount(data?.likeCount);
  }, [data]);

  useEffect(() => {
    if (deletePostContentSuccess) {
      refetchMyQuizContent();
    }
  }, [deletePostContentSuccess]);

  const onChangeLike = function (postNo: number) {
    event.preventDefault();
    setIsLiked(!isLiked);
    if (isLiked) {
      onDeleteLike(postNo);
      setLikeCount(likeCount - 1);
    } else {
      onSaveLike(postNo);
      setLikeCount(likeCount + 1);
    }
  };

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

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    setKey(key);
    setFileName(fileName);
  };

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <div className={cx('content-area ')}>
          <div className=" tw-p-8 tw-mb-5 tw-rounded-lg border">
            <div className="tw-flex tw-justify-between tw-items-center">
              <p className=" tw-text-base tw-text-left tw-text-black">{data?.name}</p>
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
            <div className="tw-py-5 tw-text-sm tw-font-normal tw-text-gray-500">
              <div className="tw-flex tw-gap-2 tw-flex-wrap">
                {data?.jobGroups[0]?.name && (
                  <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-[10.5px] ">
                    <p className="tw-text-[12.25px] tw-text-[#235a8d]">{data?.jobGroups[0]?.name || 'N/A'}</p>
                  </div>
                )}
                {data?.jobs?.length > 0 &&
                  data?.jobs.map(
                    (job, index) =>
                      job?.name && (
                        <div key={index} className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-[10.5px]">
                          <p className="tw-text-[12.25px] tw-text-[#b83333]">{job?.name || 'N/A'}</p>
                        </div>
                      ),
                  )}

                {data?.jobLevels?.length > 0 &&
                  data?.jobLevels.map((jobLevel, index) => (
                    <div key={index} className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-[10.5px]">
                      <p className="tw-text-[12.25px] tw-text-[#313b49]">{jobLevel?.name || 'N/A'}</p>
                    </div>
                  ))}
                {data.skills?.map((tag, tagIndex) => (
                  <div key={tagIndex} className="tw-rounded-[3.5px] tw-px-[5px]">
                    <p className="tw-text-[12.25px]">#{tag}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Render hashtags */}

            <div className="tw-flex tw-justify-between">
              <div className="tw-flex">
                <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black tw-w-12">URL :</p>
                <p
                  onClick={() => {
                    if (data.contentType === '0320') {
                      onFileDownload(data.url, data.name);
                    } else {
                      window.open(data.url, '_blank');
                    }
                  }}
                  className="tw-underline tw-cursor-pointer tw-text-sm tw-text-left tw-text-gray-500 tw-line-clamp-2 tw-w-full"
                >
                  {data.contentType === '0320' ? data.name : data.url}
                </p>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-gap-2 ">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                  <button
                    className="tw-flex-grow-0 tw-flex-shrink-0 "
                    onClick={() => {
                      onChangeLike(data.contentSequence);
                    }}
                  >
                    {isLiked ? <StarIcon color="error" /> : <StarBorderIcon color="disabled" />}
                  </button>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                    {likeCount}
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
