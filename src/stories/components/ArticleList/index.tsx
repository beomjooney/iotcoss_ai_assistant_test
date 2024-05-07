// ArticleList.tsx
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import styles from './index.module.scss';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Toggle, Pagination, Chip, MentorsModal, Textfield } from 'src/stories/components';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

// JobTags Component
interface JobTagsProps {
  recommendJobGroupNames: string[];
  recommendLevels: string[];
  recommendJobNames: string[];
  hashTags: string[];
}

const JobTags: React.FC<JobTagsProps> = ({ recommendJobGroupNames, recommendLevels, recommendJobNames, hashTags }) => {
  return (
    <div className="tw-p-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
      {recommendJobGroupNames.map((name, i) => (
        <span
          key={i}
          className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600"
        >
          {name}
        </span>
      ))}
      <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
        {recommendLevels.sort().join(',')}레벨
      </span>
      {recommendJobNames.map((name, i) => (
        <span
          key={i}
          className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-100 tw-text-sm tw-font-light tw-text-gray-600"
        >
          {name}
        </span>
      ))}
      {hashTags.map((name, i) => (
        <span
          key={i}
          className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-gray-700"
        >
          {name}
        </span>
      ))}
    </div>
  );
};

// ArticleInfo Component
interface ArticleInfoProps {
  articleUrl: string;
  activeCount: number;
  answerCount: number;
}

const ArticleInfo: React.FC<ArticleInfoProps> = ({ articleUrl, activeCount, answerCount }) => {
  return (
    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-3">
      <div className="tw-col-span-1 tw-text-sm tw-font-bold tw-text-black">아티클</div>
      <div className="tw-col-span-9 tw-text-sm tw-text-gray-600">{articleUrl}</div>
      <div className="tw-col-span-2 tw-text-sm tw-text-right">
        댓글 : {activeCount} 답변 : {answerCount}
      </div>
    </div>
  );
};

// ContentCard Component
interface ContentCardProps {
  item: {
    recommendJobGroupNames: string[];
    recommendLevels: string[];
    recommendJobNames: string[];
    hashTags: string[];
    content: string;
    articleUrl: string;
    activeCount: number;
    answerCount: number;
    createdAt: string;
    sequence: number;
  };
  options: string[];
  handleMenuItemClick: (index: number) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, options, handleMenuItemClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [removeIndex, setRemoveIndex] = React.useState(0);
  const open = Boolean(anchorEl);

  const handleDropMenuClick = (event: React.MouseEvent<HTMLElement>, removeIndex) => {
    setRemoveIndex(removeIndex);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="tw-p-4 tw-border border tw-w-full tw-rounded-xl">
      <div className="tw-flex tw-w-full tw-items-center"></div>
      <div className="tw-flex tw-items-center">
        <div className="tw-flex-auto">
          <div className="tw-font-medium tw-text-black">
            <JobTags
              recommendJobGroupNames={item.recommendJobGroupNames}
              recommendLevels={item.recommendLevels}
              recommendJobNames={item.recommendJobNames}
              hashTags={item.hashTags}
            />
          </div>
        </div>
        <div className="tw-text-gray-400 tw-text-sm tw-mr-5">{item.createdAt}</div>
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
        <Menu id="lock-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
          {options.map((option, index) => (
            <MenuItem
              key={index}
              onClick={event => {
                handleMenuItemClick(removeIndex);
                handleClose();
              }}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div className="tw-flex tw-items-center tw-p-3">
        <div className="tw-flex-auto">
          <div className="tw-font-medium tw-text-black tw-text-base">{item.content}</div>
        </div>
      </div>
      <ArticleInfo articleUrl={item.articleUrl} activeCount={item.activeCount} answerCount={item.answerCount} />
    </div>
  );
};

// Pagination Component
// interface PaginationProps {
//   page: number;
//   setPage: (page: number) => void;
//   total: number;
// }

// const Pagination: React.FC<PaginationProps> = ({ page, setPage, total }) => {
//   const handlePrevClick = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextClick = () => {
//     if (page < total) setPage(page + 1);
//   };

//   return (
//     <div className="tw-flex tw-justify-between tw-mt-4">
//       <button onClick={handlePrevClick} disabled={page <= 1}>
//         Previous
//       </button>
//       <span>
//         Page {page} of {total}
//       </span>
//       <button onClick={handleNextClick} disabled={page >= total}>
//         Next
//       </button>
//     </div>
//   );
// };

// ArticleList Component
interface ArticleListProps {
  myQuizData: {
    contents: {
      recommendJobGroupNames: string[];
      recommendLevels: string[];
      recommendJobNames: string[];
      hashTags: string[];
      content: string;
      articleUrl: string;
      activeCount: number;
      answerCount: number;
      createdAt: string;
      sequence: number;
    }[];
  };
  page: number;
  setPage: (page: number) => void;
  totalPage: number;
  options: string[];
  handleMenuItemClick: (index: number) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({
  myQuizData,
  page,
  setPage,
  totalPage,
  options,
  handleMenuItemClick,
}) => {
  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <article>
          <div className={cx('content-area')}>
            <section className={cx('content', 'flex-wrap-container')}>
              {myQuizData?.contents?.map((item, index) => (
                <div key={index} className="tw-w-full">
                  <ContentCard item={item} options={options} handleMenuItemClick={handleMenuItemClick} />
                </div>
              ))}
            </section>
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleList;
