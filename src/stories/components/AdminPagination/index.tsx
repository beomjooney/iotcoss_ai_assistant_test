import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';

export interface AdminPaginationProps {
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
  size?: number;
  onChangeSize?: (size: number) => void;
}

const cx = classNames.bind(styles);

const AdminPagination = ({
  total = 1,
  showCount = 10,
  page = 1,
  onChange,
  className,
  setPage,
  size = 15,
  onChangeSize,
}: AdminPaginationProps) => {
  const [isMore, setIsMore] = useState(total > showCount);
  const [content, setContent] = useState([]);

  const sizeList = [10, 15, 25, 50, 100];

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
      <span key={i}>
        <a href="#" className={page === i ? 'on' : ''} onClick={() => changePage(i)}>
          {i}
        </a>
      </span>
    );
  };

  // const moreItem = () => {
  //   return (
  //     <li className={cx({ pagination__item: true }, 'pagination__item--more')}>
  //       <a>...</a>
  //     </li>
  //   );
  // };

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
        // result.push(moreItem());
        for (let i = total - (showCount - half - 1); i <= total; i++) result.push(paginationItem(i));
      } else {
        result.push(paginationItem(1));
        // result.push(moreItem());
        const rest = showCount - 4;
        const restHalf = rest / 2;
        for (let i = Math.ceil(page - restHalf); i < page + restHalf; i++) result.push(paginationItem(i));
        // result.push(moreItem());
        result.push(paginationItem(total));
      }
      setContent(result);
    }
  }, [page, isMore]);

  return (
    <nav className={cx('pagination-container', className)}>
      <div className="paging-wrap">
        <div className="paging">
          {total > 1 && (
            <a href="#" className="btn-page-prev" onClick={() => changePage(page - 1)}>
              이전
            </a>
          )}
          {isMore ? <>{content}</> : paginationItems()}
          {total > 1 && (
            <a href="#" className="btn-page-next" onClick={() => changePage(page + 1)}>
              다음
            </a>
          )}
        </div>
        <span className="paging-total">
          ({' '}
          <b>
            {page}-{total}
          </b>{' '}
          / {total} )
        </span>
        <span className="paging-txt">
          페이지당 줄 수 :{' '}
          {sizeList.map((item, index) => {
            if (item === size) {
              return <b key={`size-${index}`}>{size}, </b>;
            }
            if (index === sizeList.length - 1) {
              return (
                <button
                  type="button"
                  key={`size-${index}`}
                  style={{ color: '#999999' }}
                  onClick={() => onChangeSize(item)}
                >
                  {item}
                </button>
              );
            }
            return (
              <span key={`size-${index}`}>
                <button type="button" style={{ color: '#999999' }} onClick={() => onChangeSize(item)}>
                  {item}
                </button>
                ,{' '}
              </span>
            );
          })}
        </span>
      </div>
    </nav>
  );
};

export default AdminPagination;
