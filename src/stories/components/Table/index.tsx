import styles from './index.module.scss';
import React, { ReactNode } from 'react';
import classNames from 'classnames/bind';

export interface TableProps {
  name: string;
  colgroup: (string | number)[];
  heads: string[];
  items: ReactNode;
  isEmpty?: boolean;
}

const cx = classNames.bind(styles);

const Table = ({ name, colgroup, heads, items, isEmpty }: TableProps) => {
  return (
    <div className="data-type1">
      <table className={cx('table-container')}>
        <colgroup>
          {colgroup.map((item, index) => {
            return <col key={`colgroup-${name}${index}`} style={{ width: item }} />;
          })}
        </colgroup>
        <thead className={cx('table-thead')}>
          <tr>
            {heads.map((item, index) => {
              return (
                <th title={item} className="magic" key={`th-${name}${index}`}>
                  {item}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {items}
          {isEmpty && (
            <tr>
              <td className="nodata" colSpan={colgroup.length}>
                조회된 데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
