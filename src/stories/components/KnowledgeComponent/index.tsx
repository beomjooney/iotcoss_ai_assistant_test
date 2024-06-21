import React, { useState, useEffect } from 'react';
import { Menu, MenuItem } from '@mui/material';
import {
  useDeletePostQuiz,
  useHidePostQuiz,
  usePublishPostQuiz,
  useRecoverPostQuiz,
} from 'src/services/community/community.mutations';
const KnowledgeComponent = ({ data, refetchMyQuiz, refetchMyQuizThresh, thresh = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { mutate: onDeletePostQuiz, isSuccess: deletePostQuizSuccess } = useDeletePostQuiz();
  const { mutate: onRecoverPostQuiz, isSuccess: recoverPostQuizSuccess } = useRecoverPostQuiz();
  const { mutate: onHidePostQuiz, isSuccess: hidePostQuizSuccess } = useHidePostQuiz();
  const { mutate: onPublishPostQuiz, isSuccess: publishPostQuizSuccess } = usePublishPostQuiz();

  useEffect(() => {
    if (deletePostQuizSuccess || hidePostQuizSuccess || publishPostQuizSuccess || recoverPostQuizSuccess) {
      refetchMyQuiz();
      refetchMyQuizThresh();
    }
  }, [deletePostQuizSuccess, hidePostQuizSuccess, publishPostQuizSuccess, recoverPostQuizSuccess]);

  const handleDelete = contentSequence => {
    // Handle delete action
    console.log('Delete clicked', contentSequence);
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      onDeletePostQuiz({
        quizSequence: data.quizSequence,
      });
    }
    handleClose();
  };

  const handleRecover = contentSequence => {
    // Handle delete action
    console.log('Delete clicked', contentSequence);
    if (window.confirm('정말로 복구 하시겠습니까?')) {
      onRecoverPostQuiz({
        quizSequence: data.quizSequence,
      });
    }
    handleClose();
  };

  const handleHide = contentSequence => {
    // Handle delete action
    console.log('Delete clicked', contentSequence);
    if (window.confirm('정말로 비공개하시겠습니까?')) {
      onHidePostQuiz({
        quizSequence: data.quizSequence,
      });
    }
    handleClose();
  };

  const handlePublish = contentSequence => {
    // Handle delete action
    console.log('Delete clicked', contentSequence);
    if (window.confirm('정말로 공개하시겠습니까?')) {
      onPublishPostQuiz({
        quizSequence: data.quizSequence,
      });
    }
    handleClose();
  };

  return (
    <div>
      <div className="tw-pb-6">
        <div className="tw-flex tw-justify-between tw-items-center tw-px-8  tw-h-20 tw-overflow-hidden tw-rounded-lg tw-bg-[#f6f7fb]">
          <div className="tw-flex tw-items-center tw-gap-5  tw-text-base tw-text-left tw-text-black">
            <div className="tw-text-sm tw-text-center tw-text-[#9ca5b2] tw-w-14 tw-text-white tw-bg-black tw-rounded tw-py-1  ">
              {data.publishStatus === '0001' ? '비공개' : '공개'}
            </div>
            <div className=" tw-text-left tw-text-black">{data.question}</div>
          </div>
          <div className="tw-flex tw-justify-end tw-items-center tw-gap-4">
            <p className="tw-text-sm tw-text-right tw-text-[#9ca5b2]">{data.createdAt}</p>
            <svg
              onClick={handleClick}
              width={28}
              height={28}
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-cursor-pointer tw-flex-grow-0 tw-flex-shrink-0 tw-w-7 tw-h-7 tw-relative"
              preserveAspectRatio="xMidYMid meet"
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
          </div>
        </div>

        <div className="tw-p-5 tw-mt-3 tw-flex-grow-0 tw-flex-shrink-0  tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border">
          <div className="tw-pb-5 tw-flex tw-justify-start tw-items-center text-sm tw-left-[52px] tw-top-5 tw-gap-2">
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-w-6 tw-h-6 tw-left-4 tw-top-4"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                stroke="#9CA5B2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
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
              {thresh ? (
                <>
                  <MenuItem onClick={handleRecover}>복구하기</MenuItem>
                  <MenuItem onClick={handleDelete}>영구 삭제하기</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleDelete}>퀴즈 수정하기</MenuItem>
                  <MenuItem onClick={handleDelete}>삭제하기</MenuItem>
                  {data.publishStatus === '0001' ? (
                    <MenuItem onClick={handlePublish}>퀴즈 공개</MenuItem>
                  ) : (
                    <MenuItem onClick={handleHide}>퀴즈 비공개</MenuItem>
                  )}
                </>
              )}
            </Menu>

            {/* Render tags */}
            <div className="tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
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

            {/* Render hashtags */}
            {data.skills?.map((hashtag, hashtagIndex) => (
              <div
                key={hashtagIndex}
                className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-2 tw-py-0.5 tw-rounded tw-border tw-border-[#ced4de]"
              >
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#ced4de]">#{hashtag}</p>
              </div>
            ))}
          </div>
          <div className="tw-flex tw-px-8">
            <p className="tw-w-[80px] text-sm tw-font-bold tw-left-[52px] tw-top-[58px] tw-text-sm tw-pr-3 tw-text-left tw-text-[#31343d]">
              모범답안 :
            </p>
            <p className="tw-w-[973px] text-sm tw-left-[119px] tw-top-[58px] tw-text-sm tw-text-left tw-text-[#31343d]">
              {data.modelAnswer}
            </p>
          </div>

          <div className="tw-flex  tw-justify-between tw-px-8 tw-py-5">
            <div className="tw-flex tw-justify-start tw-items-start">
              <p className=" tw-text-sm tw-text-left tw-text-[#31343d] tw-pr-3 tw-font-bold">지식컨텐츠</p>
              <p
                onClick={() => window.open(data?.contentUrl, '_blank')}
                className="tw-cursor-pointer tw-text-sm tw-font-medium tw-text-left tw-text-[#9ca5b2]"
              >
                {data?.contentDescription}
              </p>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-gap-2">
              <div className="tw-w-10 tw-h-[21px]">
                <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-0 tw-gap-1">
                  <svg
                    width={20}
                    height={21}
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M4.2859 13.4476L4.9859 13.5912C5.01854 13.4312 4.99535 13.2648 4.92019 13.1198L4.2859 13.4476ZM7.05233 16.2141L7.38019 15.5798C7.23518 15.5046 7.06879 15.4814 6.90876 15.5141L7.05233 16.2141ZM3.57162 16.9284L2.87162 16.7848C2.84793 16.9006 2.85333 17.0204 2.88735 17.1336C2.92137 17.2468 2.98294 17.3497 3.06654 17.4333C3.15014 17.5168 3.25316 17.5783 3.36637 17.6122C3.47957 17.6461 3.59943 17.6514 3.71519 17.6276L3.57162 16.9284ZM15.7145 10.4998C15.7145 12.0153 15.1124 13.4688 14.0408 14.5404C12.9692 15.612 11.5157 16.2141 10.0002 16.2141V17.6426C13.9452 17.6426 17.143 14.4448 17.143 10.4998H15.7145ZM4.2859 10.4998C4.2859 8.98427 4.88794 7.53082 5.95958 6.45918C7.03121 5.38754 8.48467 4.78551 10.0002 4.78551V3.35693C6.05519 3.35693 2.85733 6.55479 2.85733 10.4998H4.2859ZM10.0002 4.78551C11.5157 4.78551 12.9692 5.38754 14.0408 6.45918C15.1124 7.53082 15.7145 8.98427 15.7145 10.4998H17.143C17.143 6.55479 13.9452 3.35693 10.0002 3.35693V4.78551ZM4.92019 13.1198C4.50182 12.3099 4.28428 11.4113 4.2859 10.4998H2.85733C2.85733 11.6791 3.14305 12.7934 3.65162 13.7755L4.92019 13.1198ZM10.0002 16.2141C9.08866 16.2155 8.19013 15.998 7.38019 15.5798L6.72447 16.8484C7.73701 17.3716 8.86043 17.6441 10.0002 17.6426V16.2141ZM3.5859 13.3041L2.87162 16.7848L4.27162 17.0719L4.9859 13.5912L3.5859 13.3041ZM3.71519 17.6276L7.1959 16.9141L6.90876 15.5141L3.42805 16.2284L3.71519 17.6276Z"
                      fill="#9CA5B2"
                    />
                    <path
                      d="M7.85712 9.07129H12.1428"
                      stroke="#9CA5b2"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.85712 11.9282H12.1428"
                      stroke="#9CA5b2"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                    {data.answerCount}
                  </p>
                </div>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                <svg
                  width={20}
                  height={21}
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M16.875 3H6.875C6.70924 3 6.55027 3.06585 6.43306 3.18306C6.31585 3.30027 6.25 3.45924 6.25 3.625V6.75H3.125C2.95924 6.75 2.80027 6.81585 2.68306 6.93306C2.56585 7.05027 2.5 7.20924 2.5 7.375V17.375C2.5 17.5408 2.56585 17.6997 2.68306 17.8169C2.80027 17.9342 2.95924 18 3.125 18H13.125C13.2908 18 13.4497 17.9342 13.5669 17.8169C13.6842 17.6997 13.75 17.5408 13.75 17.375V14.25H16.875C17.0408 14.25 17.1997 14.1842 17.3169 14.0669C17.4342 13.9497 17.5 13.7908 17.5 13.625V3.625C17.5 3.45924 17.4342 3.30027 17.3169 3.18306C17.1997 3.06585 17.0408 3 16.875 3ZM12.5 16.75H3.75V8H12.5V16.75ZM16.25 13H13.75V7.375C13.75 7.20924 13.6842 7.05027 13.5669 6.93306C13.4497 6.81585 13.2908 6.75 13.125 6.75H7.5V4.25H16.25V13Z"
                    fill="#9CA5B2"
                  />
                </svg>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#9ca5b2]">
                  {data.activeCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeComponent;
