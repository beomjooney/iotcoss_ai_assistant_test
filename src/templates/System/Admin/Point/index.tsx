import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import Pagination from 'src/stories/components/Pagination';
import { paramProps, useSeminarMeFavoriteList } from 'src/services/seminars/seminars.queries';
import { useQuizPoint } from 'src/services/quiz/quiz.queries';
import { RecommendContent } from 'src/models/recommend';

/** import table */
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const cx = classNames.bind(styles);

export function MyPointTemplate() {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPoint, setTotalPoint] = useState(0);
  const [params, setParams] = useState<paramProps>({ page });
  const [pointList, setPointList] = useState<RecommendContent[]>([]);

  const [summary, setSummary] = useState({});
  const { isFetched: isQuizPointFetched, data } = useQuizPoint(data => {
    setPointList(data?.pointHistory?.contents);
    setTotalPoint(data?.total);
  });
  interface Column {
    id: 'name' | 'code' | 'population' | 'size' | 'density';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
  }

  const columns: Column[] = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
    {
      id: 'population',
      label: 'Population',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'size',
      label: 'Size\u00a0(km\u00b2)',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'density',
      label: 'Density',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toFixed(2),
    },
  ];

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          {isQuizPointFetched && (
            <div>
              <div className="tw-grid tw-items-center tw-grid-cols-2 tw-py-6 tw-mt-2 tw-p-5 tw-bg-gray-100 tw-rounded-md tw-my-5 tw-py-10">
                <div className="tw-col-span-1 tw-font-bold tw-flex tw-items-center ">
                  <img className="tw-pr-2" src="/assets/images/icons/point.png" alt="포인트" />
                  보유포인트 :
                </div>
                <div className="tw-col-span-1 tw-text-right tw-text-lg tw-font-bold tw-text-blue-500">
                  {totalPoint}P
                </div>
              </div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">날짜</TableCell>
                      <TableCell align="center">활동내역</TableCell>
                      <TableCell align="right">적립포인트</TableCell>
                      <TableCell align="right">누적포인트</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pointList?.map(row => (
                      <TableRow key={row.sequence} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="left">
                          <div className="tw-text-gray-400">{row.createdAt.split('T')[0]}</div>
                        </TableCell>
                        <TableCell align="left">{row.eventText}</TableCell>
                        <TableCell align="right">
                          <span className={parseInt(row.pointsChange) > 0 ? 'tw-text-red-500' : 'tw-text-blue-500'}>
                            {parseInt(row.pointsChange)}P{' '}
                          </span>
                        </TableCell>
                        <TableCell align="right">{row.total}P</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          <div className="tw-mt-10">{/* <Pagination page={page} setPage={setPage} total={totalPage} /> */}</div>
        </div>
      </section>
    </div>
  );
}
