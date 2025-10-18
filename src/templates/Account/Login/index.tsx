import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Typography from '@mui/material/Typography';
import { useLogin } from 'src/services/account/account.mutations';
import React, { useEffect, useState } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import DialogContentText from '@mui/material/DialogContentText';
import { useSessionStore } from '../../../../src/store/session';
import { useTermsList, useTermsList2 } from 'src/services/account/account.queries';
import { UseQueryResult } from 'react-query';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useLoginSignUpDSU } from 'src/services/account/account.mutations';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { getCookie } from 'cookies-next';
const cx = classNames.bind(styles);

interface LoginTemplateProps {
  title: string;
  onSubmitLogin: () => void;
}

export function LoginTemplate({ title = '', onSubmitLogin }: LoginTemplateProps) {
  const { update, tenantName, tenantUri, loginType, tenantLoginMemberTypes, tenantOrganizationCodes } =
    useSessionStore.getState();

  // const loginType = '0100';
  const router = useRouter();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLoginType, setSelectedLoginType] = useState('0100');
  const [selectedUniversity, setSelectedUniversity] = useState('0100');
  const [termsParams, setTermsParams] = useState<any>({ type: '0001' });
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [activeTab, setActiveTab] = useState('lms');
  const [activeTab2, setActiveTab2] = useState('dsu');
  const [clientTenantName, setClientTenantName] = useState(null);

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleClickShowPassword1 = () => setShowPassword1(show => !show);

  const { mutate: onLogin, isSuccess, data: loginData } = useLogin();
  const { mutate: onLoginSignUp, isSuccess: isSignUpSuccess, data: signUpData } = useLoginSignUpDSU();

  // 로그인시 tenant_login_member_type
  // 회원가입시 tenantLoginMemberType

  useEffect(() => {
    console.log('signUpData', signUpData);
    if (signUpData?.data?.responseCode === '0000') {
      const loginData = {
        username: username,
        password: password,
        grant_type: 'password',
        tenant_uri: tenantUri,
        login_type: '0101',
        tenant_login_member_type: selectedLoginType,
      };

      if (selectedUniversity) {
        loginData['tenant_organization_code'] = selectedUniversity;
      }

      onLogin(loginData);
    }
  }, [signUpData]);

  // 약관 조회
  const {
    data: termList,
    isLoading: termListLoading,
    refetch: refetch1,
  }: UseQueryResult<any> = useTermsList({ type: '0001' });

  const { data: termList2, isLoading: termListLoading2, refetch: refetch2 }: UseQueryResult<any> = useTermsList2();

  useEffect(() => {
    localStorage.setItem('activeIndex', '0');
    setClientTenantName(tenantName);
  }, []);

  const onReply = function (typeCode: string, scrollType: DialogProps['scroll']) {
    console.log('typeCode', typeCode);
    setTermsParams({ type: typeCode });
    setOpen(true);
    setScroll(scrollType);
  };

  useEffect(() => {
    if (isSuccess) {
      console.log('isSuccess', isSuccess);
      refetch1();
      refetch2();
    }
  }, [isSuccess]);

  useEffect(() => {
    console.log('loginData', loginData);
    if (loginData?.responseCode === '1403') {
      console.log('loginData?.responseCode', loginData?.responseCode);
      onReply('0002', 'paper');
      return;
    } else if (loginData?.responseCode === '0400') {
      console.log('loginData?.responseCode', loginData?.responseCode);
      return;
    }
    else if (loginData?.responseCode === 'C06005') {
      console.log('loginData?.responseCode', loginData?.responseCode);
      // alert('학사DB 연동모듈에 오류가 발생하였습니다. 관리자에게 문의 해주세요.');
      return;
    }

    if (isSuccess) {
      console.log('isSuccess', isSuccess);
      onSubmitLogin();

      update({
        // tenantName: loginData?.tenantId,
        // tenantName: loginData?.tenant_uri?.split('.')[0],
        redirections: loginData?.redirections,
        menu: loginData?.menu,
      });

      if (getCookie('redirectionUrl')) {
        location.href = getCookie('redirectionUrl').toString();
      } else {
        location.href = '/';
      }
    }
  }, [loginData]);

  const validationSchema = Yup.object().shape({
    // username: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password must be at least 4 characters')
      .max(20, 'Password must not exceed 20 characters'),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit0001 = data => {
    console.log('onSubmit', data);
    setUserName(data.username);
    setPassword(data.password);
    onLogin(
      paramsWithDefault({
        ...data,
        // login_member_type: selectedLoginType,
        // tenantUri: tenantUri,
        tenant_uri: tenantUri,
        login_type: '0100',
        tenant_login_member_type: selectedLoginType,
      }),
    );
  };

  const onSubmit0002 = data => {
    console.log('onSubmit', data);
    setUserName(data.username);
    setPassword(data.password);
    onLogin(
      paramsWithDefault({
        ...data,
        // login_member_type: selectedLoginType,
        // tenantUri: tenantUri,
        tenant_uri: tenantUri,
        login_type: '0200',
        // tenant_login_member_type: selectedLoginType,
      }),
    );
  };

  const onSubmit0003 = data => {
    console.log('onSubmit', data);
    setUserName(data.username);
    setPassword(data.password);
    onLogin(
      paramsWithDefault({
        ...data,
        tenant_uri: tenantUri,
        login_type: '0101',
        tenant_organization_code: selectedUniversity,
      }),
    );
  };

  const onError = (e: any) => {
    console.log('error', e);
  };

  const handleLoginTypeChange = event => {
    setSelectedLoginType(event.target.value);
  };

  const handleUniversityChange = event => {
    setSelectedUniversity(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // 클라이언트에서만 렌더링 활성화
  }, []);

  // 렌더링 함수들
  const renderLogin0100 = () => (
    <div>
      <div className={cx('logo-area')}>
        {/* <img src="/assets/images/cm_CI_co_1000x225.png" alt="footer logo" width={162} className="img-fluid mb-3" /> */}
        <p className={cx('tw-font-bold tw-text-[26px] tw-text-black tw-py-5 tw-text-center')}>{title} 로그인</p>
      </div>
      <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>회원유형</Typography>

      <select
        className="tw-h-12 form-select block w-full tw-font-bold tw-px-4 tw-mt-2 tw-rounded-xl"
        onChange={handleLoginTypeChange}
        value={selectedLoginType}
        aria-label="Default select example"
      >
        {tenantLoginMemberTypes?.length > 0 ? (
          tenantLoginMemberTypes.map((item, index) => (
            <option key={index} value={item?.code}>
              {item?.name}
            </option>
          ))
        ) : (
          <>
            <option value="0100">학생</option>
            <option value="0200">교수</option>
            <option value="0300">외부사용자</option>
          </>
        )}
      </select>

      <form onSubmit={handleSubmit(onSubmit0001, onError)}>
        {selectedLoginType === '0001' ? (
          <>
            <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>이메일</Typography>
            <TextField
              required
              id="username"
              name="username"
              placeholder="이메일을 입력해주세요."
              variant="outlined"
              type="search"
              fullWidth
              sx={{
                backgroundColor: '#F6F7FB',
                borderRadius: '10px',
                marginTop: '10px',
                '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                '& fieldset': { border: 'none' },
                '& input': { height: ' 0.8em;' },
              }}
              margin="dense"
              {...register('username')}
              error={errors.username ? true : false}
              helperText={errors.username?.message}
            />
            <Typography sx={{ fontSize: 14, marginTop: 2, color: 'black', fontWeight: '600' }}>비밀번호</Typography>
            <TextField
              required
              id="password"
              name="password"
              placeholder="비밀번호를 입력해주세요."
              // type="password"
              fullWidth
              margin="dense"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end" aria-label="toggle password visibility">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: '#F6F7FB',
                borderRadius: '10px',
                marginTop: '10px',
                '& fieldset': { border: 'none' },
                '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                '& input': { height: ' 0.8em;' },
              }}
              {...register('password')}
              error={errors.password ? true : false}
              helperText={errors.password?.message}
            />
          </>
        ) : (
          <>
            <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>
              {selectedLoginType === '0100' ? '학번' : selectedLoginType === '0300' ? '이메일' : '교번'}
            </Typography>
            <TextField
              required
              id="username"
              name="username"
              placeholder={`${selectedLoginType === '0100' ? '학번' : selectedLoginType === '0300' ? '이메일' : '교번'
                }을 입력해주세요.`}
              variant="outlined"
              type="search"
              fullWidth
              sx={{
                backgroundColor: '#F6F7FB',
                borderRadius: '10px',
                marginTop: '10px',
                '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                '& fieldset': { border: 'none' },
                '& input': { height: ' 0.8em;' },
              }}
              margin="dense"
              {...register('username')}
              error={errors.username ? true : false}
              helperText={errors.username?.message}
            />
            <Typography sx={{ fontSize: 14, marginTop: 2, color: 'black', fontWeight: '600' }}>비밀번호</Typography>
            <TextField
              required
              id="password"
              name="password"
              placeholder="비밀번호를 입력해주세요."
              fullWidth
              margin="dense"
              variant="outlined"
              type={showPassword1 ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword1} edge="end" aria-label="toggle password visibility">
                      {showPassword1 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: '#F6F7FB',
                borderRadius: '10px',
                marginTop: '10px',
                '& fieldset': { border: 'none' },
                '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                '& input': { height: ' 0.8em;' },
              }}
              {...register('password')}
              error={errors.password ? true : false}
              helperText={errors.password?.message}
            />
          </>
        )}
        <Grid container spacing={3} direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <Box
              display="flex"
              justifyContent="flex-end"
              sx={{ fontWeight: 'bold' }}
              className="tw-cursor-pointer"
              onClick={() => router.push('/account/forgot')}
            >
              <Typography sx={{ fontSize: 12, textDecoration: 'underline' }} className="tw-pt-2 pb-3">
                비밀번호를 잊으셨나요?
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <div style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
          <button
            className="tw-bg-[#e11837] tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white"
            onClick={() => handleSubmit(onSubmit0001)}
          >
            로그인
          </button>
        </div>
      </form>
      <Box display="center" justifyContent="center" sx={{ fontWeight: 'bold' }}>
        <Typography sx={{ fontSize: 14 }} className="tw-py-3">
          동서대학교 계정이 없으신가요?
        </Typography>
      </Box>
      <Box display="center" justifyContent="center" sx={{ fontWeight: 'bold' }}>
        <Typography
          onClick={() => router.push('/account/signup')}
          sx={{ fontSize: 14, textDecoration: 'underline' }}
          className="tw-pb-3  tw-cursor-pointer"
        >
          회원가입
        </Typography>
      </Box>
    </div>
  );

  const renderLogin0100And0200 = () => (
    <div className="tw-mt-20">
      <div className="tw-w-full tw-max-w-md tw-mx-auto">
        <div className="tw-flex tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-200 tw-border-solid tw-p-1.5 tw-bg-gray-100">
          <button
            className={`tw-flex-1 tw-py-2 tw-text-center tw-font-medium tw-text-sm tw-transition-colors tw-rounded-md ${activeTab2 === 'dsu' ? 'tw-bg-white' : 'tw-bg-gray-100'
              }`}
            onClick={() => setActiveTab2('dsu')}
          >
            DSU 로그인
          </button>
          <button
            className={`tw-flex-1 tw-py-2 tw-text-center tw-font-medium tw-text-sm tw-transition-colors tw-rounded-md ${activeTab2 === 'general' ? 'tw-bg-white' : 'tw-bg-gray-100'
              }`}
            onClick={() => setActiveTab2('general')}
          >
            일반 로그인
          </button>
        </div>

        <div className="tw-mt-4">
          {activeTab2 === 'dsu' && (
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit0001, onError)}
              noValidate
              sx={{ mt: 1, maxWidth: 400, mx: 'auto', px: 0, pb: 18 }}
            >
              <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>회원유형</Typography>
              <select
                className="tw-h-12 form-select block w-full tw-font-bold tw-px-4 tw-mt-2 tw-rounded-xl"
                onChange={handleLoginTypeChange}
                value={selectedLoginType}
                aria-label="Default select example"
              >
                {tenantLoginMemberTypes?.length > 0 ? (
                  tenantLoginMemberTypes.map((item, index) => (
                    <option key={index} value={item?.code}>
                      {item?.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="0100">학생</option>
                    <option value="0200">교수</option>
                    <option value="0300">외부사용자</option>
                  </>
                )}
              </select>

              {selectedLoginType === '0001' ? (
                <>
                  <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>이메일</Typography>
                  <TextField
                    required
                    id="username"
                    name="username"
                    placeholder="이메일을 입력해주세요."
                    variant="outlined"
                    type="search"
                    fullWidth
                    sx={{
                      backgroundColor: '#F6F7FB',
                      borderRadius: '10px',
                      marginTop: '10px',
                      '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                      '& fieldset': { border: 'none' },
                      '& input': { height: ' 0.8em;' },
                    }}
                    margin="dense"
                    {...register('username')}
                    error={errors.username ? true : false}
                    helperText={errors.username?.message}
                  />
                  <Typography sx={{ fontSize: 14, marginTop: 2, color: 'black', fontWeight: '600' }}>
                    비밀번호
                  </Typography>
                  <TextField
                    required
                    id="password"
                    name="password"
                    placeholder="비밀번호를 입력해주세요."
                    // type="password"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: '#F6F7FB',
                      borderRadius: '10px',
                      marginTop: '10px',
                      '& fieldset': { border: 'none' },
                      '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                      '& input': { height: ' 0.8em;' },
                    }}
                    {...register('password')}
                    error={errors.password ? true : false}
                    helperText={errors.password?.message}
                  />
                </>
              ) : (
                <>
                  <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>
                    {selectedLoginType === '0100' ? '학번' : selectedLoginType === '0300' ? '이메일' : '교번'}
                  </Typography>
                  <TextField
                    required
                    id="username"
                    name="username"
                    placeholder={`${selectedLoginType === '0100' ? '학번' : selectedLoginType === '0300' ? '이메일' : '교번'
                      }을 입력해주세요.`}
                    variant="outlined"
                    type="search"
                    fullWidth
                    sx={{
                      backgroundColor: '#F6F7FB',
                      borderRadius: '10px',
                      marginTop: '10px',
                      '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                      '& fieldset': { border: 'none' },
                      '& input': { height: ' 0.8em;' },
                    }}
                    margin="dense"
                    {...register('username')}
                    error={errors.username ? true : false}
                    helperText={errors.username?.message}
                  />
                  <Typography sx={{ fontSize: 14, marginTop: 2, color: 'black', fontWeight: '600' }}>
                    비밀번호
                  </Typography>
                  <TextField
                    required
                    id="password"
                    name="password"
                    placeholder="비밀번호를 입력해주세요."
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    type={showPassword1 ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword1}
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {showPassword1 ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: '#F6F7FB',
                      borderRadius: '10px',
                      marginTop: '10px',
                      '& fieldset': { border: 'none' },
                      '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                      '& input': { height: ' 0.8em;' },
                    }}
                    {...register('password')}
                    error={errors.password ? true : false}
                    helperText={errors.password?.message}
                  />
                </>
              )}
              <Grid container spacing={3} direction="row" justifyContent="space-between" alignItems="center">
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    sx={{ fontWeight: 'bold' }}
                    className="tw-cursor-pointer"
                    onClick={() => router.push('/account/forgot')}
                  >
                    <Typography sx={{ fontSize: 12, textDecoration: 'underline' }} className="tw-py-3">
                      비밀번호를 잊으셨나요?
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <div style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
                <button
                  className="tw-bg-[#e11837] tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white"
                  onClick={() => handleSubmit(onSubmit0001)}
                >
                  로그인
                </button>
              </div>
            </Box>
          )}

          {activeTab2 === 'general' && (
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit0002, onError)}
              noValidate
              sx={{ mt: 1, maxWidth: 400, mx: 'auto', px: 2, pb: 18 }}
            >
              <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>이메일</Typography>
              <TextField
                required
                id="username"
                name="username"
                placeholder="이메일을 입력해주세요."
                variant="outlined"
                type="search"
                fullWidth
                sx={{
                  backgroundColor: '#F6F7FB',
                  borderRadius: '10px',
                  marginTop: '10px',
                  '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                  '& fieldset': { border: 'none' },
                  '& input': { height: ' 0.8em;' },
                }}
                margin="dense"
                {...register('username')}
                error={errors.username ? true : false}
                helperText={errors.username?.message}
              />
              <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>비밀번호</Typography>
              <TextField
                required
                id="password"
                name="password"
                placeholder="비밀번호를 입력해주세요."
                fullWidth
                margin="dense"
                variant="outlined"
                type="password"
                sx={{
                  backgroundColor: '#F6F7FB',
                  borderRadius: '10px',
                  marginTop: '10px',
                  '& fieldset': { border: 'none' },
                  '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                  '& input': { height: ' 0.8em;' },
                }}
                {...register('password')}
                error={errors.password ? true : false}
                helperText={errors.password?.message}
              />

              <Grid container spacing={3} direction="row" justifyContent="space-between" alignItems="center">
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    sx={{ fontWeight: 'bold' }}
                    className="tw-cursor-pointer"
                    onClick={() => router.push('/account/forgot')}
                  >
                    <Typography sx={{ fontSize: 12, textDecoration: 'underline' }} className="tw-py-3">
                      비밀번호를 잊으셨나요?
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <div style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
                <button
                  className="tw-bg-[#e11837] tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white"
                  onClick={() => handleSubmit(onSubmit0002)}
                >
                  로그인
                </button>
              </div>
              <Box display="flex" justifyContent="center" sx={{ fontWeight: 'bold' }}>
                <Typography
                  onClick={() => router.push('/account/signup')}
                  sx={{ fontSize: 14, textDecoration: 'underline' }}
                  className="tw-py-3  tw-cursor-pointer"
                >
                  회원가입
                </Typography>
              </Box>
            </Box>
          )}
        </div>
      </div>
    </div>
  );

  const renderLogin0200And0101 = () => (
    <div className="tw-mt-20">
      <div className="tw-w-full tw-max-w-md tw-mx-auto">
        <div className="tw-flex tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-200 tw-border-solid tw-p-1.5 tw-bg-gray-100">
          <button
            className={`tw-flex-1 tw-py-2 tw-text-center tw-font-medium tw-text-sm tw-transition-colors tw-rounded-md ${activeTab === 'lms' ? 'tw-bg-white' : 'tw-bg-gray-100'
              }`}
            onClick={() => setActiveTab('lms')}
          >
            LMS 로그인
          </button>
          <button
            className={`tw-flex-1 tw-py-2 tw-text-center tw-font-medium tw-text-sm tw-transition-colors tw-rounded-md ${activeTab === 'general' ? 'tw-bg-white' : 'tw-bg-gray-100'
              }`}
            onClick={() => setActiveTab('general')}
          >
            일반 로그인
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'lms' ? (
            <>
              <div className={cx('logo-area')}></div>
              <form onSubmit={handleSubmit(onSubmit0003, onError)}>
                <select
                  className="tw-h-12 form-select block w-full tw-font-bold tw-px-4 tw-mt-2 tw-rounded-xl"
                  onChange={handleUniversityChange}
                  value={selectedUniversity}
                  aria-label="대학교를 선택해주세요."
                >
                  {tenantOrganizationCodes?.length > 0 ? (
                    tenantOrganizationCodes.map((item, index) => (
                      <option key={index} value={item?.code}>
                        {item?.name}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>

                <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>
                  교번/학번
                </Typography>
                <TextField
                  required
                  id="username"
                  name="username"
                  placeholder="이메일을 입력해주세요."
                  variant="outlined"
                  type="search"
                  fullWidth
                  sx={{
                    backgroundColor: '#F6F7FB',
                    borderRadius: '10px',
                    marginTop: '10px',
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    '& fieldset': { border: 'none' },
                    '& input': { height: ' 0.8em;' },
                  }}
                  margin="dense"
                  {...register('username')}
                  error={errors.username ? true : false}
                  helperText={errors.username?.message}
                />
                <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>비밀번호</Typography>
                <TextField
                  required
                  id="password"
                  name="password"
                  placeholder="비밀번호를 입력해주세요."
                  type="password"
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  sx={{
                    backgroundColor: '#F6F7FB',
                    borderRadius: '10px',
                    marginTop: '10px',
                    '& fieldset': { border: 'none' },
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    '& input': { height: ' 0.8em;' },
                  }}
                  {...register('password')}
                  error={errors.password ? true : false}
                  helperText={errors.password?.message}
                />

                <div className="py-5" style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
                  <button
                    className={`tw-bg-black tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white`}
                    onClick={() => handleSubmit(onSubmit0003)}
                  >
                    로그인
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className={cx('logo-area')}></div>
              <form onSubmit={handleSubmit(onSubmit0002, onError)}>
                <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>이메일</Typography>
                <TextField
                  required
                  id="username"
                  name="username"
                  placeholder="이메일을 입력해주세요."
                  variant="outlined"
                  type="search"
                  fullWidth
                  sx={{
                    backgroundColor: '#F6F7FB',
                    borderRadius: '10px',
                    marginTop: '10px',
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    '& fieldset': { border: 'none' },
                    '& input': { height: ' 0.8em;' },
                  }}
                  margin="dense"
                  {...register('username')}
                  error={errors.username ? true : false}
                  helperText={errors.username?.message}
                />
                <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>비밀번호</Typography>
                <TextField
                  required
                  id="password"
                  name="password"
                  placeholder="비밀번호를 입력해주세요."
                  type="password"
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  sx={{
                    backgroundColor: '#F6F7FB',
                    borderRadius: '10px',
                    marginTop: '10px',
                    '& fieldset': { border: 'none' },
                    '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    '& input': { height: ' 0.8em;' },
                  }}
                  {...register('password')}
                  error={errors.password ? true : false}
                  helperText={errors.password?.message}
                />

                <Grid container spacing={3} direction="row" justifyContent="space-between" alignItems="center">
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6}>
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      sx={{ fontWeight: 'bold' }}
                      className="tw-cursor-pointer"
                      onClick={() => router.push('/account/forgot')}
                    >
                      <Typography sx={{ fontSize: 12, textDecoration: 'underline' }} className="tw-py-3">
                        비밀번호를 잊으셨나요?
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <div style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
                  <button
                    className={`tw-bg-black tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white`}
                    onClick={() => handleSubmit(onSubmit0002)}
                  >
                    로그인
                  </button>
                </div>
              </form>
              <Box display="flex" justifyContent="center" sx={{ fontWeight: 'bold' }}>
                <Typography
                  onClick={() => router.push('/account/signup')}
                  sx={{ fontSize: 14, textDecoration: 'underline' }}
                  className="tw-py-3  tw-cursor-pointer"
                >
                  회원가입
                </Typography>
              </Box>
            </>
          )}
        </div>
      </div>

      <div className="tw-mb-40"></div>
    </div>
  );

  const renderLogin0200Only = () => (
    <div className="tw-mt-20">
      <div className="tw-w-full tw-max-w-md tw-mx-auto">
        <div className="mt-4">
          <div className={cx('logo-area')}>
            <p className={cx('tw-font-bold tw-text-[26px] tw-text-black tw-py-5 tw-text-center')}>로그인</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit0002, onError)}>
            <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>이메일</Typography>
            <TextField
              required
              id="username"
              name="username"
              placeholder="이메일을 입력해주세요."
              variant="outlined"
              type="search"
              fullWidth
              sx={{
                backgroundColor: '#F6F7FB',
                borderRadius: '10px',
                marginTop: '10px',
                '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                '& fieldset': { border: 'none' },
                '& input': { height: ' 0.8em;' },
              }}
              margin="dense"
              {...register('username')}
              error={errors.username ? true : false}
              helperText={errors.username?.message}
            />
            <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>비밀번호</Typography>
            <TextField
              required
              id="password"
              name="password"
              placeholder="비밀번호를 입력해주세요."
              type="password"
              fullWidth
              margin="dense"
              variant="outlined"
              sx={{
                backgroundColor: '#F6F7FB',
                borderRadius: '10px',
                marginTop: '10px',
                '& fieldset': { border: 'none' },
                '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                '& input': { height: ' 0.8em;' },
              }}
              {...register('password')}
              error={errors.password ? true : false}
              helperText={errors.password?.message}
            />

            <Grid container spacing={3} direction="row" justifyContent="space-between" alignItems="center">
              <Grid item xs={6}></Grid>
              <Grid item xs={6}>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  sx={{ fontWeight: 'bold' }}
                  className="tw-cursor-pointer"
                  onClick={() => router.push('/account/forgot')}
                >
                  <Typography sx={{ fontSize: 12, textDecoration: 'underline' }} className="tw-py-3">
                    비밀번호를 잊으셨나요?
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <div style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
              <button
                className={`tw-bg-black tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white`}
                onClick={() => handleSubmit(onSubmit0002)}
              >
                로그인
              </button>
            </div>
          </form>
          <Box display="flex" justifyContent="center" sx={{ fontWeight: 'bold' }}>
            <Typography
              onClick={() => router.push('/account/signup')}
              sx={{ fontSize: 14, textDecoration: 'underline' }}
              className="tw-py-3  tw-cursor-pointer"
            >
              회원가입
            </Typography>
          </Box>
        </div>
      </div>

      <div className="tw-mb-40"></div>
    </div>
  );

  // 조건에 따른 렌더링 결정
  const getLoginComponent = () => {
    // 0100과 0200 모두 포함
    if (loginType?.includes('0100') && loginType?.includes('0200')) {
      return renderLogin0100And0200();
    }

    // 0200과 0101 모두 포함
    if (loginType?.includes('0200') && loginType?.includes('0101')) {
      return renderLogin0200And0101();
    }

    // 0200만 포함 (0101 제외)
    if (loginType?.includes('0200') && !loginType?.includes('0101')) {
      return renderLogin0200Only();
    }

    // 0100만 포함
    if (loginType?.includes('0100')) {
      return renderLogin0100();
    }

    // 기본값 (조건에 맞지 않을 때)
    return null;
  };

  if (!isClient) {
    return null; // 클라이언트가 준비되기 전에는 아무것도 렌더링하지 않음
  }

  return (
    <div className={cx('login-container')}>
      {getLoginComponent()}

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        sx={{ maxHeight: '80vh', top: '10%', left: '0', overflowY: 'auto' }}
      >
        <DialogTitle id="scroll-dialog-title" sx={{ m: 0, p: 2, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>서비스 이용약관 동의</Typography>
          {handleClose ? (
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent
          dividers={scroll === 'paper'}
          sx={{
            height: '500px', // 고정 높이 설정
            overflowY: 'auto', // 내용이 높이를 초과할 경우 스크롤 활성화
          }}
        >
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            <div dangerouslySetInnerHTML={{ __html: termList?.content }}></div>
          </DialogContentText>
        </DialogContent>

        <DialogTitle id="scroll-dialog-title" sx={{ m: 0, p: 2, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>개인정보 수집동의</Typography>
          {handleClose ? (
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent
          dividers={scroll === 'paper'}
          sx={{
            height: '500px', // 고정 높이 설정
            overflowY: 'auto', // 내용이 높이를 초과할 경우 스크롤 활성화
          }}
        >
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            <div dangerouslySetInnerHTML={{ __html: termList2?.content }}></div>
          </DialogContentText>
        </DialogContent>

        <DialogActions
          style={{
            display: 'flex',
            justifyContent: 'center', // 가운데 정렬
            gap: '16px', // 버튼 간 간격
            padding: '12px 0', // 상하 패딩
          }}
        >
          <button
            className="tw-bg-gray-300 tw-w-[130px] tw-px-5  tw-rounded-md  tw-h-[38px] tw-text-white"
            onClick={handleClose}
          >
            취소
          </button>
          <button
            className="tw-bg-red-500 tw-w-[130px] tw-px-5 tw-rounded-md  tw-h-[38px] tw-text-white"
            onClick={() => {
              const signUpData = {
                id: username,
                password: password,
                agreedTermsIds: ['service1', 'privacy1'],
                isEmailReceive: true,
                isSmsReceive: true,
                isKakaoReceive: true,
                tenantUri: tenantUri,
                // tenantLoginMemberType: selectedLoginType,
              };

              if (selectedUniversity && tenantUri !== 'dsuai') {
                signUpData['tenantOrganizationCode'] = selectedUniversity;
              }

              if (loginType?.includes('0101')) {
                signUpData['tenantLoginMemberType'] = '0101';
              } else {
                signUpData['tenantLoginMemberType'] = selectedLoginType;
              }

              onLoginSignUp(signUpData);
            }}
          >
            동의
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LoginTemplate;
const paramsWithDefault = (params: any) => {
  const defaultParams: any = {
    username: '',
    password: '',
    grant_type: 'password',
    // tenant_uri: '',
  };
  return {
    ...defaultParams,
    ...params,
  };
};
