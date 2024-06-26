import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { v4 as uuidv4 } from 'uuid';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';

export interface PaginationProps {
  /** 총 개수 */
  total?: number;
  /** 표시할 개수 */
  showCount?: number;
  /** 현재 페이지 */
  page?: number;
  /** 변화 감지 callback */
  onChange?: (number) => void;
  /** className */
  className?: string;
  /**/
  setPage?;
}

const cx = classNames.bind(styles);

const Pagination = ({ total = 1, showCount = 8, page = 1, onChange, className, setPage }: PaginationProps) => {
  const [isMore, setIsMore] = useState(total > showCount);
  const [content, setContent] = useState([]);
  useEffect(() => {
    setIsMore(total > showCount);
  }, [total, showCount]);

  const changePage = i => {
    if (i > total || i <= 0) return;
    setPage(i);
    if (onChange) onChange.call(this, i);
  };

  const paginationItem = i => {
    return (
      <li
        // key={i}
        key={uuidv4()}
        className={cx({ pagination__item: true, 'pagination__item--active': page === i })}
        onClick={() => changePage(i)}
      >
        <a className="tw-text-sm">{i}</a>
      </li>
    );
  };

  const moreItem = () => {
    return (
      <li key={uuidv4()} className={cx({ pagination__item: true }, 'pagination__item--more')}>
        <a>...</a>
      </li>
    );
  };

  const paginationItems = () => {
    const result = [];
    const N = Math.min(showCount, total);
    for (let i = 1; i <= N; i++) {
      result.push(paginationItem(i));
    }
    return result;
  };

  useEffect(() => {
    const half = Math.ceil(showCount / 2);
    if (isMore) {
      let result = [];
      if (page < half || page > total - (showCount - half)) {
        for (let i = 1; i < half; i++) result.push(paginationItem(i));
        result.push(moreItem());
        for (let i = total - (showCount - half - 1); i <= total; i++) result.push(paginationItem(i));
      } else {
        result.push(paginationItem(1));
        result.push(moreItem());
        const rest = showCount - 4;
        const restHalf = rest / 2;
        for (let i = Math.ceil(page - restHalf); i < page + restHalf; i++) result.push(paginationItem(i));
        result.push(moreItem());
        result.push(paginationItem(total));
      }
      setContent(result);
    }
  }, [page, isMore]);

  return (
    <nav className={cx('pagination-container', className)}>
      <ul className={cx('pagination')}>
        {total > 1 && (
          <li className={cx('pagination__item', 'pagination__item--next')} onClick={() => changePage(page - 1)}>
            <a className="tw-flex tw-items-center tw-justify-center tw-h-full">
              <svg
                width={8}
                height={12}
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path d="M7 11L2 6L7 1" stroke="#9CA5B2" stroke-width="1.5" />
              </svg>
            </a>
          </li>
        )}
        {isMore ? (
          <>
            {/*{paginationItem(1)}*/}
            {content}
            {/*{paginationItem(total)}*/}
          </>
        ) : (
          paginationItems()
        )}
        {total > 1 && (
          <li className={cx('pagination__item', 'pagination__item--next')} onClick={() => changePage(page + 1)}>
            <a className="tw-flex tw-items-center tw-justify-center tw-h-full">
              <svg
                width={8}
                height={12}
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path d="M1 1L6 6L1 11" stroke="#9CA5B2" strokeWidth="1.5" />
              </svg>
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
