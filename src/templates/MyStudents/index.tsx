import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Pagination } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent } from 'src/models/recommend';
import { useMyStudentsList } from 'src/services/seminars/seminars.queries';
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

// Mock 데이터 추가
const mockStudentsData = [
  {
    id: 1,
    university: 'IT대학',
    department: '컴퓨터공학과',
    studentId: '2025070820',
    grade: '1학년',
    name: '박예환',
    avatar: '/assets/avatars/park.jpg',
    registrationDate: '24.08.15 10:13:15',
  },
  {
    id: 2,
    university: '기계공학',
    department: '기계공학과',
    studentId: '2025070931',
    grade: '2학년',
    name: '김민재',
    avatar: '/assets/avatars/kim.jpg',
    registrationDate: '24.08.15 11:00:05',
  },
  {
    id: 3,
    university: '전기전자공학',
    department: '전기전자공학과',
    studentId: '2025071045',
    grade: '3학년',
    name: '이수빈',
    avatar: '/assets/avatars/lee.jpg',
    registrationDate: '24.08.15 11:30:20',
  },
  {
    id: 4,
    university: '산업공학',
    department: '산업공학과',
    studentId: '2025071156',
    grade: '4학년',
    name: '최영수',
    avatar: '/assets/avatars/choi.jpg',
    registrationDate: '24.08.15 12:15:45',
  },
  {
    id: 5,
    university: '정보통신공학',
    department: '정보통신공학과',
    studentId: '2025071267',
    grade: '2학년',
    name: '정하늘',
    avatar: '/assets/avatars/jung.jpg',
    registrationDate: '24.08.15 12:45:10',
  },
  {
    id: 6,
    university: '화학공학',
    department: '화학공학과',
    studentId: '2025071378',
    grade: '1학년',
    name: '서지우',
    avatar: '/assets/avatars/seo.jpg',
    registrationDate: '24.08.15 13:15:30',
  },
  {
    id: 7,
    university: '컴퓨터공학',
    department: '컴퓨터공학과',
    studentId: '2025070820',
    grade: '1학년',
    name: '박예환',
    avatar: '/assets/avatars/park.jpg',
    registrationDate: '24.08.15 10:13:15',
  },
  {
    id: 8,
    university: '기계공학',
    department: '기계공학과',
    studentId: '2025070931',
    grade: '2학년',
    name: '김민재',
    avatar: '/assets/avatars/kim.jpg',
    registrationDate: '24.08.15 11:00:05',
  },
  {
    id: 9,
    university: '산업공학',
    department: '산업공학과',
    studentId: '2025071156',
    grade: '4학년',
    name: '최영수',
    avatar: '/assets/avatars/choi.jpg',
    registrationDate: '24.08.15 12:15:45',
  },
  {
    id: 10,
    university: '정보통신공학',
    department: '정보통신공학과',
    studentId: '2025071267',
    grade: '2학년',
    name: '정하늘',
    avatar: '/assets/avatars/jung.jpg',
    registrationDate: '24.08.15 12:45:10',
  },
];

export function MyStudentsTemplate() {
  const { logged, roles } = useSessionStore.getState();
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [keyWorld, setKeyWorld] = useState('');
  const [params, setParams] = useState<any>({ size: 10, page, clubViewFilter: '0002', clubType: '0200' });
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredMockData, setFilteredMockData] = useState(mockStudentsData);

  const router = useRouter();
  const { mutate: onDeleteClub, isSuccess: isSuccessDeleteClub } = useDeleteClub();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    isFetched: isContentFetched,
    isLoading: isDataLoading,
    refetch,
  } = useMyStudentsList(params, data => {
    console.log('data', data);
    setContents(data.data.contents || []);
    // setTotalPage(data.data.totalPages);
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
      page,
      keyword: keyWorld,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, keyWorld]);

  useEffect(() => {
    // 검색어가 있을 때 필터링
    if (keyWorld) {
      const filtered = mockStudentsData.filter(
        student =>
          student.name.includes(keyWorld) ||
          student.department.includes(keyWorld) ||
          student.university.includes(keyWorld),
      );
      setFilteredMockData(filtered);
    } else {
      setFilteredMockData(mockStudentsData);
    }
  }, [keyWorld]);

  const handleRowClick = (clubSequence: string) => {
    router.push('/lecture-dashboard/' + clubSequence);
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
                      placeholder="학생명 또는 학과명을 입력하세요."
                      InputProps={{
                        style: { height: '43px' },
                        startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                      }}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          searchKeyworld((e.target as HTMLInputElement).value);
                        }
                      }}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>

          <article>
            <div className={cx('content-area')}>
              <section className={cx('content', 'flex-wrap-container')}>
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
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                              No
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                              대학
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                              학과
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                              아이디
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                              학년
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                              학생명
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                              등록일시
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredMockData.length > 0 ? (
                            filteredMockData.map((student, index) => (
                              <TableRow
                                key={index}
                                onClick={() => handleRowClick(student.studentId)}
                                sx={{
                                  cursor: 'pointer',
                                  '&:hover': {
                                    backgroundColor: '#f9f9f9',
                                  },
                                }}
                              >
                                <TableCell align="center" sx={{ fontSize: '14px' }}>
                                  {student.id}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '14px' }}>
                                  {student.university}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '14px' }}>
                                  {student.department}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '14px' }}>
                                  {student.studentId}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '14px' }}>
                                  {student.grade}
                                </TableCell>
                                <TableCell align="center">
                                  <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
                                    <Avatar src={student.avatar} alt={student.name} sx={{ width: 32, height: 32 }} />
                                    <span className="tw-text-sm tw-font-medium">{student.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '14px', color: '#666' }}>
                                  {student.registrationDate}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#999' }}>
                                데이터가 없습니다.
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
