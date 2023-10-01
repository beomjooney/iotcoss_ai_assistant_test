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
import { useCrewAcceptPost, useCrewBanDelete, useCrewRejectPost } from 'src/services/admin/friends/friends.mutations';

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
  const { refetch } = useClubQuizCrewManage(params, data => {
    setContents(data.contents || []);
    setTotalPage(data.totalPages);
  });

  /**save profile */
  const { mutate: onQuizOrder } = useQuizOrder();

  /** crew accept, reject */
  const { mutate: onCrewAccept, isSuccess: isAcceptSuccess } = useCrewAcceptPost();
  const { mutate: onCrewReject, isSuccess: isRejectSuccess } = useCrewRejectPost();
  const { mutate: onCrewBan, isSuccess: isBanSuccess } = useCrewBanDelete();

  useEffect(() => {
    refetch();
  }, [isAcceptSuccess, isRejectSuccess, isBanSuccess]);

  const handleCrewAccept = async (sequence: string) => {
    if (confirm('승인을 하시겠습니까?')) {
      let params = {
        memberFriendRequestSequence: sequence,
        isAccept: true,
      };
      onCrewReject({ data: params });
    }
  };
  const handleCrewReject = async (sequence: string) => {
    if (confirm('거절 하시겠습니까?')) {
      let params = {
        memberFriendRequestSequence: sequence,
        isAccept: false,
      };
      onCrewAccept(params);
    }
  };
  const handleCrewBan = async (sequence: string) => {
    if (confirm('강퇴 하시겠습니까?')) {
      onCrewBan(sequence);
    }
  };

  useEffect(() => {
    setParams({
      page,
      clubSequence: parseInt(id),
    });
  }, [page]);

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
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex"></Grid>
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
                          <button
                            onClick={() => handleCrewAccept(row.clubMemberSequence)}
                            className="tw-bg-white tw-text-black border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            승인하기
                          </button>
                          <button
                            onClick={() => handleCrewReject(row.clubMemberSequence)}
                            className="border-danger tw-bg-white tw-text-red-500 border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            거절하기
                          </button>
                          <button
                            onClick={() => handleCrewBan(row.clubMemberSequence)}
                            className="border-danger tw-bg-white tw-text-red-500 border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
                            강퇴하기
                          </button>
                        </div>
                      )}
                      {row.clubMemberStatus === '0002' && (
                        <div>
                          <button
                            onClick={() => handleCrewBan(row.clubMemberSequence)}
                            className="border-danger tw-bg-white tw-text-red-500 border tw-text-sm tw-font-right tw-px-4  tw-py-2 tw-rounded"
                          >
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
