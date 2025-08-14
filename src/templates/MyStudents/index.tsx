import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Pagination } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent } from 'src/models/recommend';
import { useMyStudentsList } from 'src/services/seminars/seminars.queries';
import { StudentContent, MyStudentsListResponse } from 'src/models/user';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import CircularProgress from '@mui/material/CircularProgress';
import { useSessionStore } from 'src/store/session';
// TableContainer 관련 컴포넌트들 추가
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';
import { useDeleteClub } from 'src/services/community/community.mutations';

const cx = classNames.bind(styles);

const ITEMS_PER_PAGE = 10;

export function MyStudentsTemplate() {
  const { logged, roles } = useSessionStore.getState();
  const [contents, setContents] = useState<StudentContent[]>([]);
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [keyWorld, setKeyWorld] = useState('');
  const [params, setParams] = useState<any>({ size: ITEMS_PER_PAGE, page: page, keyword: null });
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const router = useRouter();
  const { mutate: onDeleteClub, isSuccess: isSuccessDeleteClub } = useDeleteClub();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    isFetched: isContentFetched,
    isLoading: isDataLoading,
    refetch,
  } = useMyStudentsList(params, (data: MyStudentsListResponse) => {
    console.log('data', data);
    if (data?.data) {
      setContents(data.data.contents || []);
      setTotalPage(data.data.totalPages || 1);
      setTotalElements(data.data.totalElements || 0);
    }
  });

  useEffect(() => {
    if (isSuccessDeleteClub) {
      setIsLoading(false);
      refetch();
    }
  }, [isSuccessDeleteClub]);

  function searchKeyworld(value) {
    console.log('value', value);
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  useDidMountEffect(() => {
    setParams({
      ...params,
      page: page, // API는 0부터 시작
      keyword: keyWorld || null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, keyWorld]);

  // 검색어 변경 시 페이지를 1로 리셋
  useEffect(() => {
    if (keyWorld !== '') {
      setPage(1);
    }
  }, [keyWorld]);

  const handleRowClick = (memberUUID: string) => {
    router.push('/my-students/' + memberUUID);
  };

  const handleDeleteClub = (clubSequence: string, event: React.MouseEvent) => {
    event.stopPropagation(); // 행 클릭 이벤트 전파 차단
    if (confirm('클럽을 삭제하시겠습니까?')) {
      setIsLoading(true);
      onDeleteClub(clubSequence);
    }
  };

  return (
    <>
      <div className={cx('seminar-container')}>
        <div className={cx('container')}>
          <div className="tw-py-[60px]">
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={12} sm={2} className="tw-font-bold tw-text-3xl tw-text-black">
                My학습자
              </Grid>
              <Grid item xs={12} sm={10} className="tw-font-semi tw-text-base tw-text-black">
                지도교수자로 등록된 학생들 목록입니다
              </Grid>
            </Grid>
          </div>
          <Box sx={{ width: '100%', typography: 'body1', marginTop: '0px', marginBottom: '0px' }}>
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={12} className="tw-font-bold tw-text-3xl tw-text-black">
                <div className="tw-w-full tw-flex tw-justify-end">
                  <div className="tw-flex tw-items-center tw-justify-end tw-text-right">
                    <TextField
                      id="outlined-basic"
                      label=""
                      variant="outlined"
                      placeholder="학습자명, 아이디, 직군, 직업명을 입력하세요."
                      InputProps={{
                        style: { height: '43px' },
                        startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                      }}
                      onChange={e => {
                        searchKeyworld((e.target as HTMLInputElement).value);
                      }}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>

          <article>
            <div className={cx('content-area')}>
              <section className={cx('content', 'flex-wrap-container tw-w-full tw-min-h-[500px]')}>
                {isDataLoading ? (
                  <div className="tw-flex tw-justify-center tw-items-center tw-py-40">
                    <CircularProgress />
                  </div>
                ) : (
                  isContentFetched && (
                    <TableContainer
                      component={Paper}
                      className="tw-rounded-lg"
                      sx={{
                        boxShadow: 'none',
                        border: 'none',
                        '& .MuiTableCell-root': {},
                      }}
                    >
                      <Table sx={{ minWidth: 650, border: 'none' }} aria-label="학습자 테이블">
                        <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'center' }}>
                              No
                            </TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                              대학교
                            </TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                              학과
                            </TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                              아이디
                            </TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                              학생명
                            </TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                              등록일시
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {contents.length > 0 ? (
                            contents.map((studentContent, index) => {
                              const student = studentContent.member;
                              const displayIndex = (page - 1) * ITEMS_PER_PAGE + index + 1;

                              return (
                                <TableRow
                                  key={student.memberUUID}
                                  onClick={() => handleRowClick(student.memberUUID)}
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                      backgroundColor: '#f9f9f9',
                                    },
                                  }}
                                >
                                  <TableCell align="left" sx={{ fontSize: '15px' }}>
                                    {displayIndex}
                                  </TableCell>
                                  <TableCell align="left" sx={{ fontSize: '15px' }}>
                                    {student.jobGroup?.name || '-'}
                                  </TableCell>
                                  <TableCell align="left" sx={{ fontSize: '15px' }}>
                                    {student.job?.name || '-'}
                                  </TableCell>
                                  <TableCell align="left" sx={{ fontSize: '15px' }}>
                                    {student.memberId}
                                  </TableCell>
                                  <TableCell align="left">
                                    <div className="tw-flex tw-items-center tw-justify-start tw-gap-2">
                                      <Avatar
                                        src={student.profileImageUrl || undefined}
                                        alt={student.nickname}
                                        sx={{ width: 32, height: 32 }}
                                      >
                                        {!student.profileImageUrl && student.nickname?.charAt(0)}
                                      </Avatar>
                                      <span className="tw-text-sm tw-font-medium">{student.nickname}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" sx={{ fontSize: '15px', color: '#666' }}>
                                    {new Date(studentContent.registeredAt).toLocaleString('ko-KR', {
                                      year: '2-digit',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                    })}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#999' }}>
                                {isDataLoading ? '데이터를 불러오는 중...' : '등록된 학습자가 없습니다.'}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )
                )}
              </section>
              <div className="tw-flex tw-justify-center tw-items-center tw-py-10">
                <Pagination page={page} setPage={setPage} total={totalPage} />
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

export default MyStudentsTemplate;
