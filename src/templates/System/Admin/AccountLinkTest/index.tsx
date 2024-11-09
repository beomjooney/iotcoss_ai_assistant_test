import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { useSessionStore } from 'src/store/session';
import React, { useState } from 'react';
import { useMemberActiveSummaryInfo } from 'src/services/account/account.queries';
import { useLoginList } from 'src/services/studyroom/studyroom.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import router from 'next/router';
import { Mobile, Desktop } from 'src/hooks/mediaQuery';
import { useQuizActivityHistory } from 'src/services/quiz/quiz.queries';
import { Pagination } from 'src/stories/components';
import { useEffect } from 'react';
import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLoginIdTest, useLoginIdPasswordTest } from 'src/services/account/account.mutations';

/**table */
import SettingsIcon from '@mui/icons-material/Settings';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import * as Yup from 'yup';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const cx = classNames.bind(styles);

export function AdminAccountLinkTestTemplate() {
  const { memberId } = useSessionStore.getState();
  const handleClickShowPassword1 = () => setShowPassword1(show => !show);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any>([]);

  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [memberList, setMemberList] = useState<any[]>([]);
  const [startDay, setStartDay] = React.useState<Dayjs | null>(dayjs().subtract(1, 'month'));

  const [endDay, setEndDay] = React.useState<Dayjs | null>(dayjs());
  const [memberParams, setMemberParams] = useState<any>({
    page,
    createdStartAt: startDay.format('YYYY-MM-DDT00:00:00'),
    createdEndAt: endDay.format('YYYY-MM-DDT23:59:59'),
  });
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showPassword1, setShowPassword1] = useState(true);

  const { isFetched: isUserFetched } = useMemberActiveSummaryInfo(data => setSummary(data));
  const {
    mutate: onLoginIdTest,
    isSuccess: isLoginIdTestSuccess,
    isError: isLoginIdTestError,
    data: loginData,
  } = useLoginIdTest();
  const {
    mutate: onLoginIdPasswordTest,
    isSuccess: isLoginIdPasswordTestSuccess,
    isError: isLoginIdPasswordTestError,
    data: loginIdPasswordData,
  } = useLoginIdPasswordTest();

  const { isFetched: isMemberListFetched, refetch: QuizRefetchBadge } = useLoginList(memberParams, data => {
    console.log(data);
    setContents(data?.data?.contents);
    setTotalPage(data?.data?.totalPages);
    setPage(data?.data?.page);
  });

  useEffect(() => {
    if (isLoginIdTestSuccess || isLoginIdPasswordTestSuccess || isLoginIdPasswordTestError || isLoginIdTestError) {
      // alert('계정연동테스트가 완료되었습니다.');
      QuizRefetchBadge();
    }
  }, [isLoginIdTestSuccess, isLoginIdPasswordTestSuccess, isLoginIdPasswordTestError, isLoginIdTestError]);

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const validationSchema = Yup.object().shape({
    // username: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password must be at least 4 characters')
      .max(20, 'Password must not exceed 20 characters'),
  });
  const validationSchemaId = Yup.object().shape({
    username: Yup.string().required('Email is required').email('Email is invalid'),
  });

  const onError = (e: any) => {
    console.log('error', e);
  };

  // T를 공백으로 바꾸고 소수점 부분을 제거하는 함수
  const formatDate = date => {
    return date?.split('.')[0].replace('T', ' '); // T를 공백으로 바꾸고 소수점 이하 제거
  };

  useDidMountEffect(() => {
    setMemberParams({
      createdStartAt: startDay.format('YYYY-MM-DDT00:00:00'),
      createdEndAt: endDay.format('YYYY-MM-DDT23:59:59'),
      memberId: searchKeyword === '' ? null : searchKeyword,
      page,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, searchKeyword]);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 시 기본 동작 방지
      setSearchKeyword(search); // 검색 함수 실행
      setPage(1);
    }
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(validationSchema),
  });

  const onCheckId = () => {
    console.log('onCheckId', username);
    if (username) {
      onLoginIdTest({
        id: username,
        loginMemberType: selectedLoginType,
      });
    } else {
      alert('아이디를 입력해주세요.');
    }
  };

  const onSubmit = data => {
    console.log('onSubmit', data);
    setUserName(data.username);
    setPassword(data.password);

    if (password === '') {
      alert('비밀번호를 입력해주세요.');
      return;
    } else {
      onLoginIdPasswordTest({
        id: username,
        password: password,
        loginMemberType: selectedLoginType,
      });
    }
  };

  const onChangeHandleFromToStartDate = date => {
    if (date) {
      // Convert date to a Dayjs object
      const formattedDate = dayjs(date);
      // Format the date as 'YYYY-MM-DD'
      const formattedDateString = formattedDate.format('YYYY-MM-DD');
      // Set both today and todayEnd
      setStartDay(formattedDate);
    }
  };
  const onChangeHandleFromToEndDate = date => {
    if (date) {
      // Convert date to a Dayjs object
      const formattedDate = dayjs(date);
      // Format the date as 'YYYY-MM-DD'
      const formattedDateString = formattedDate.format('YYYY-MM-DD');
      // Set both today and todayEnd
      setEndDay(formattedDate);
    }
  };

  const [selectedLoginType, setSelectedLoginType] = useState('0001');

  const handleLoginTypeChange = event => {
    console.log('event.target.value', event.target.value);
    setSelectedLoginType(event.target.value);
    setUserName('');
    setPassword('');
  };

  const handleSearch = () => {
    const nextDay3 = dayjs(startDay).format('YYYY-MM-DD');
    const nextDay4 = dayjs(endDay).format('YYYY-MM-DD');

    if (!dayjs(nextDay4).isAfter(dayjs(nextDay3))) {
      alert(`종료일 (${nextDay4})은(는) 시작일 (${nextDay3})보다 뒤에 있어야 합니다.`);
      return; // 혹은 필요에 따라 validation 실패시 코드 실행 중단
    }

    const diffInDays = dayjs(nextDay4).diff(dayjs(nextDay3), 'day');
    if (diffInDays >= 60) {
      alert('기간 조회는 60일까지 가능합니다.');
      return; // 기간이 31일을 초과하면 코드 실행 중단
    }

    console.log('startDay', startDay.format('YYYY-MM-DD'));
    setMemberParams({
      page,
      memberId: search === '' ? null : search,
      createdStartAt: startDay.format('YYYY-MM-DDT00:00:00'),
      createdEndAt: endDay.format('YYYY-MM-DDT23:59:59'),
    });
  };

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          {isMemberListFetched && (
            <>
              <Desktop>
                <div>
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <div className="tw-font-bold tw-text-xl tw-text-black tw-p-0">계정연동테스트</div>
                    <TextField
                      size="small"
                      value={search} // 상태값을 TextField에 반영
                      placeholder="검색"
                      onChange={e => setSearch(e.target.value)} // 입력된 값 업데이트
                      onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
                      InputProps={{
                        style: { height: '38px' },
                        startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                      }}
                    />

                    <div className="tw-font-bold tw-text-lg tw-text-black tw-flex tw-gap-3">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="YYYY-MM-DD"
                          slotProps={{
                            textField: { size: 'small', style: { backgroundColor: 'white', width: '140px' } },
                          }}
                          value={startDay}
                          onChange={e => onChangeHandleFromToStartDate(e)}
                        />
                      </LocalizationProvider>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="YYYY-MM-DD"
                          slotProps={{
                            textField: { size: 'small', style: { backgroundColor: 'white', width: '140px' } },
                          }}
                          value={endDay}
                          onChange={e => onChangeHandleFromToEndDate(e)}
                        />
                      </LocalizationProvider>
                      <button
                        className="tw-text-sm tw-bg-black tw-text-white tw-px-3 tw-py-0 tw-rounded-md"
                        onClick={() => handleSearch()}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                  <div className="tw-flex tw-items-center tw-justify-start tw-gap-3 tw-mt-5">
                    <Typography sx={{ fontSize: 14, color: 'black', fontWeight: '600' }}>회원유형</Typography>

                    <select
                      className="tw-h-12 form-select block tw-w-[90px] tw-font-bold tw-px-4  tw-rounded-xl"
                      onChange={handleLoginTypeChange}
                      value={selectedLoginType}
                      aria-label="Default select example"
                    >
                      <option value="0002">학생</option>
                      <option value="0003">교수</option>
                    </select>
                  </div>
                  <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    className="tw-mt-5  tw-flex tw-justify-between tw-items-center tw-gap-1"
                  >
                    <Typography sx={{ fontSize: 14, color: 'black', fontWeight: '600' }}>
                      {selectedLoginType === '0002' ? '학번' : '교번'}
                    </Typography>
                    <TextField
                      required
                      id="username"
                      name="username"
                      placeholder={`${selectedLoginType === '0002' ? '학번' : '교번'}을 입력해주세요.`}
                      variant="outlined"
                      onChange={e => setUserName(e.target.value)}
                      type="search"
                      value={username} // 추가된 부분: 상태 값 반영
                      sx={{
                        width: '200px',
                        backgroundColor: '#F6F7FB',
                        borderRadius: '10px',
                        marginBottom: '0px',
                        marginTop: '0px',
                        '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                        '& fieldset': { border: 'none' },
                        '& input': { height: ' 0.8em;' },
                      }}
                      margin="dense"
                      // {...register('username')}
                      {...register('username', {
                        onChange: e => {
                          setUserName(e.target.value);
                        },
                      })}
                      error={errors.username ? true : false}
                      helperText={errors.username?.message}
                    />
                    <Typography sx={{ fontSize: 14, color: 'black', fontWeight: '600' }}>비밀번호</Typography>
                    <TextField
                      // required
                      id="password"
                      name="password"
                      placeholder="비밀번호를 입력해주세요."
                      margin="dense"
                      onChange={e => setPassword(e.target.value)}
                      variant="outlined"
                      value={password} // 추가된 부분: 상태 값 반영
                      type={showPassword1 ? 'text' : 'password'}
                      sx={{
                        width: '200px',
                        backgroundColor: '#F6F7FB',
                        borderRadius: '10px',
                        marginBottom: '0px',
                        marginTop: '0px',
                        '& fieldset': { border: 'none' },
                        '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                        '& input': { height: ' 0.8em;' },
                      }}
                      // {...register('password')}
                      {...register('password', {
                        onChange: e => {
                          setPassword(e.target.value);
                        },
                      })}
                      error={errors.password ? true : false}
                      helperText={errors.password?.message}
                    />
                    <button
                      className="tw-bg-blue-500  tw-text-sm tw-font-bold tw-rounded-md tw-w-[90px] tw-h-[40px] tw-text-white"
                      onClick={e => {
                        e.preventDefault(); // 기본 제출 동작 막기
                        onCheckId();
                      }}
                    >
                      아이디 검증
                    </button>
                    <button
                      className="tw-bg-blue-500 tw-text-sm tw-font-bold tw-rounded-md tw-w-[110px] tw-h-[40px] tw-text-white"
                      onClick={() => handleSubmit(onSubmit)}
                    >
                      아이디/비밀번호 검증
                    </button>
                  </form>
                  <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-5 tw-flex tw-items-center tw-justify-between tw-gap-5"></div>
                  <TableContainer
                    style={{
                      overflowY: 'auto', // 높이를 초과하면 스크롤이 생김
                    }}
                  >
                    <Table className="" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                      <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                        <TableRow>
                          <TableCell align="left" width={115}>
                            <div className="tw-text-base tw-font-bold">검증유형</div>
                          </TableCell>
                          <TableCell align="left" width={100}>
                            <div className=" tw-text-base tw-font-bold">회원유형</div>
                          </TableCell>
                          <TableCell align="left" width={130}>
                            <div className=" tw-text-base tw-font-bold">아이디</div>
                          </TableCell>
                          <TableCell align="left" width={110}>
                            <div className=" tw-text-base tw-font-bold">테스트결과</div>
                          </TableCell>
                          <TableCell align="left" width={160}>
                            <div className=" tw-text-base tw-font-bold">테스트일시</div>
                          </TableCell>
                          <TableCell align="left" width={300}>
                            <div className=" tw-text-base tw-font-bold">테스트결과상세</div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contents.length > 0 ? (
                          contents.map((content, index) => (
                            <TableRow key={index}>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-base">
                                  <span className="tw-text-sm tw-font-medium">
                                    {content.requestType === '0101'
                                      ? '로그인'
                                      : content.requestType === '0201'
                                      ? '아이디검증'
                                      : content.requestType === '0202'
                                      ? '패스워드검증'
                                      : ''}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-sm tw-line-clamp-1">
                                  {content.externalMemberType === '0001'
                                    ? '학생'
                                    : content.externalMemberType === '0002'
                                    ? '교수'
                                    : '외부'}
                                </div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-sm">{content.externalMemberId}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-sm">{content.success ? '성공' : '실패'}</div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-sm tw-line-clamp-1">
                                  {dayjs(content.createdAt).format('YYYY-MM-DD·HH:mm:ss')}
                                </div>
                              </TableCell>
                              <TableCell align="left" component="th" scope="row">
                                <div className="tw-text-sm">{content.detailResult}</div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell align="center" colSpan={5}>
                              <div className="tw-text-sm">데이터가 없습니다</div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <div className="tw-mt-10">
                    <Pagination page={page} setPage={setPage} total={totalPage} />
                  </div>
                </div>
              </Desktop>
            </>
          )}
          <div className="tw-mt-10">{/* <Pagination page={page} setPage={setPage} total={totalPage} /> */}</div>
        </div>
      </section>
    </div>
  );
}
