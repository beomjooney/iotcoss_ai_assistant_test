import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import BannerDetail from 'src/stories/components/BannerDetail';
import { jobColorKey } from 'src/config/colors';
import Chip from 'src/stories/components/Chip';
import { useStore } from 'src/store';
import { Button, Typography, Profile, Modal, ArticleCard, MentorsModal } from 'src/stories/components';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { paramProps, useClubQuizCrewManage, useClubQuizManage } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { useSessionStore } from 'src/store/session';
import Grid from '@mui/material/Grid';

/** page import */
import Pagination from 'src/stories/components/Pagination';

/** import table */
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

/** drag list */
import ReactDragList from 'react-drag-list';
import { useQuizOrder } from 'src/services/quiz/quiz.mutations';

const cx = classNames.bind(styles);
export interface QuizCrewManageTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizCrewManageTemplate({ id }: QuizCrewManageTemplateProps) {
  const { user } = useStore();
  const [value, setValue] = React.useState(0);
  const [isBookmark, setIsBookmark] = useState(true);
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [quizOriginList, setQuizOriginList] = useState<RecommendContent[]>([]);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState<boolean>(false);
  const { memberId, logged } = useSessionStore.getState();
  const [itemList, setItemList] = useState<any[]>([]);

  /** crew list */
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page, clubSequence: parseInt(id) });

  console.log(params);
  const { data, refetch } = useClubQuizCrewManage(params, data => {
    setContents(data.contents || []);
  });

  /**save profile */
  const { mutate: onQuizOrder } = useQuizOrder();

  // 드래그해서 변경된 리스트를 브라우저상에 나타나게 만드는것
  const handleUpdate = (evt: any, updated: any) => {
    console.log(evt); // tslint:disable-line
    console.log(updated); // tslint:disable-line
    setItemList([...updated]);
  };

  const handleAddClick = () => {
    console.log(itemList);
    console.log(quizOriginList);
    if (itemList.length === 0) {
      alert('퀴즈 순서를 변경해주세요.');
      return 0;
    }
    // Transforming the data into an array of objects with "clubQuizSequence" and "order" properties
    const transformedData = {
      clubSequence: contents?.clubSequence, // Add the "clubSequence" property with a value of 2
      clubQuizOrders: quizOriginList.map((item, index) => ({
        clubQuizSequence: item,
        order: itemList[index].order,
      })),
    };
    console.log(transformedData);
    onQuizOrder(transformedData);
  };

  useEffect(() => {
    setParams({
      page,
      clubSequence: parseInt(id),
    });
  }, [page]);

  const dragList = (item: any, index: any) => (
    <Grid key={'drag-' + index} container direction="row" justifyContent="left" alignItems="center" rowSpacing={3}>
      <Grid item xs={1}>
        <div className="tw-flex-auto tw-text-center">
          <button
            type="button"
            // onClick={() => handleDeleteQuiz(item.quizSequence)}
            className="tw-text-blue-700 border tw-border-blue-700 tw-font-medium tw-rounded-lg tw-text-sm tw-p-2.5 tw-text-center tw-inline-flex tw-items-center tw-mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="tw-w-6 tw-h-6 tw-text-black"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>

            <span className="sr-only">Icon description</span>
          </button>
        </div>
      </Grid>
      <Grid item xs={11}>
        <div className="tw-flex tw-items-center tw-p-4 tw-border border mb-3 mt-3 rounded  tw-h-[60px]">
          <div className="tw-flex-auto">
            <div className="tw-font-medium tw-text-black">{item?.content}</div>
          </div>

          <div className="">
            {item?.isRepresentative === true && (
              // <div onClick={() => handleClickQuiz(item?.quizSequence, item?.isRepresentative)}>
              <button
                type="button"
                data-tooltip-target="tooltip-default"
                className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
              >
                대표
              </button>
              // </div>
            )}
            {item?.isRepresentative === false && (
              // <div onClick={() => handleClickQuiz(item?.quizSequence, item?.isRepresentative)}>
              <button
                type="button"
                data-tooltip-target="tooltip-default"
                className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
              >
                대표
              </button>
              // </div>
            )}
          </div>
        </div>
      </Grid>
    </Grid>
  );
  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <div className="tw-py-5 tw-mb-16">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={4} className="tw-font-bold tw-text-3xl tw-text-black">
              내가 만든 클럽 &gt; 크루관리
            </Grid>
            <Grid item xs={5} className="tw-font-semi tw-text-base tw-text-black">
              나의 퀴즈클럽 클럽 페이지에 관련 간단한 설명
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                type="button"
                onClick={handleAddClick}
                className="tw-text-white tw-bg-blue-500 tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5 "
              >
                성장퀴즈 추가하기
              </button>
            </Grid>
          </Grid>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: 150 }}>
                  아이디
                </TableCell>
                <TableCell align="center">가입일</TableCell>
                <TableCell align="center">참여도</TableCell>
                <TableCell align="center">받은 좋아요 수</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contents?.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">
                    <div className="tw-flex tw-gap-4 tw-items-center">
                      <img className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full" src={row.profileImageUrl} alt="" />
                      <div>{row.nickName}</div>
                    </div>
                  </TableCell>
                  <TableCell align="center">{row.approvedAt.split(' ')[0]}</TableCell>
                  <TableCell align="center">
                    <div>
                      {row.studyCount} / {row.totalStudyCount}
                    </div>
                  </TableCell>
                  <TableCell align="center">{row.totalStudyCount}</TableCell>
                  <TableCell align="right">
                    <div className="tw-flex tw-items-center tw-justify-end">
                      <button
                        onClick={() => (location.href = '/profile/' + `${row.memberUUID}`)}
                        className="tw-bg-white tw-text-black border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded tw-mr-3 "
                      >
                        프로필 보기
                      </button>
                      {row.clubMemberStatus === '0001' && (
                        <div>
                          <button className="tw-bg-white tw-text-black border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded">
                            승인하기
                          </button>
                          <button className="border-danger tw-bg-white tw-text-red-500 border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded">
                            강퇴하기
                          </button>
                        </div>
                      )}
                      {row.clubMemberStatus === '0002' && (
                        <div>
                          <button className="border-danger tw-bg-white tw-text-red-500 border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded">
                            강퇴하기
                          </button>
                        </div>
                      )}
                      {row.clubMemberStatus === '0003' && (
                        <div>
                          <button
                            disabled
                            className="border-danger tw-bg-white tw-text-red-500 border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            거절됨
                          </button>
                        </div>
                      )}
                      {row.clubMemberStatus === '0004' && (
                        <div>
                          <button
                            disabled
                            className="border-danger tw-bg-white tw-text-red-500 border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            강퇴됨
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="tw-mt-10">
        <Pagination page={page} setPage={setPage} total={totalPage} />
      </div>
    </div>
  );
}

export default QuizCrewManageTemplate;
