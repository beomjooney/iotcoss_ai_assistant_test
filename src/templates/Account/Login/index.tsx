import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Typography from '@mui/material/Typography';
import { useLogin } from 'src/services/account/account.mutations';
import { usePresets } from 'src/utils/color-presets';
import React, { useEffect, useState } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import DialogContentText from '@mui/material/DialogContentText';
import { useColorPresets } from 'src/utils/use-theme-color';
import { useColorPresetName } from 'src/utils/use-theme-color';
import { deleteCookie } from 'cookies-next';
import { useSessionStore } from '../../../../src/store/session';
import { getFirstSubdomain } from 'src/utils';
import { getButtonClass } from 'src/utils/clubStatus';
import { useTermsList } from 'src/services/account/account.queries';
import { UseQueryResult } from 'react-query';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useLoginSignUpDSU } from 'src/services/account/account.mutations';

const cx = classNames.bind(styles);

interface LoginTemplateProps {
  title: string;
  onSubmitLogin: () => void;
}

export function LoginTemplate({ title = '', onSubmitLogin }: LoginTemplateProps) {
  const { update, tenantName } = useSessionStore.getState();
  const router = useRouter();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLoginType, setSelectedLoginType] = useState('0001');
  const [termsParams, setTermsParams] = useState<any>({ type: '0001' });
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const { mutate: onLogin, isSuccess, data: loginData } = useLogin();
  const { mutate: onLoginSignUp, isSuccess: isSignUpSuccess, data: signUpData } = useLoginSignUpDSU();

  useEffect(() => {
    console.log('signUpData', signUpData);
    if (signUpData?.data?.responseCode === '0000') {
      onLogin(
        paramsWithDefault({
          username: username,
          password: password,
          grant_type: 'password',
          login_member_type: selectedLoginType,
          tenant_uri: getFirstSubdomain(),
        }),
      );
    }
  }, [signUpData]);

  // 약관 조회
  const {
    data: termList,
    isLoading: termListLoading,
    refetch,
  }: UseQueryResult<any> = useTermsList(
    paramsWithDefault({
      ...termsParams,
    }),
  );

  console.log('login join page', getFirstSubdomain(), tenantName);

  const [clientTenantName, setClientTenantName] = useState(null);
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
    console.log('loginData', loginData);
    if (loginData?.responseCode === '1403') {
      console.log('loginData?.responseCode', loginData?.responseCode);
      onReply('0002', 'paper');
      return;
    }

    if (isSuccess) {
      console.log('isSuccess', isSuccess);
      onSubmitLogin();

      update({
        tenantName: loginData?.tenant_uri?.split('.')[0],
        redirections: loginData?.redirections,
        menu: loginData?.menu,
      });

      // Check if running in the local environment
      const isLocalEnv = process.env.NEXT_PUBLIC_ENV === 'local';
      const isLocalProd = process.env.NEXT_PUBLIC_ENV === 'prod';
      console.log('loginData?.tenant_uri', loginData?.tenant_uri, getFirstSubdomain(), isLocalEnv);

      // if (loginData?.tenant_uri === getFirstSubdomain() || isLocalEnv || isLocalProd) {
      if (loginData?.tenant_uri === getFirstSubdomain() || isLocalEnv) {
        location.href = '/';
      } else {
        const authStore = localStorage.getItem('auth-store');
        if (authStore) {
          const json = JSON.parse(authStore);
          const jsonString = JSON.stringify(json.state);
          // 1. Base64 인코딩 (Node.js 환경에서는 Buffer를 사용)
          const encodedJson = Buffer.from(jsonString).toString('base64');
          // location.href = loginData?.redirections?.home_url + `?authStore=${encodedJson}`;
          deleteCookie('access_token');
          localStorage.removeItem('auth-store');
          localStorage.removeItem('app-storage');
          location.href = loginData?.redirections?.home_url + `?authStore=${encodedJson}`;
          //test
          //location.href = 'http://dsu.localhost:3001/' + `?authStore=${encodedJson}`;
        }
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

  const onSubmit = data => {
    console.log('onSubmit', data);
    setUserName(data.username);
    setPassword(data.password);
    onLogin(
      paramsWithDefault({
        ...data,
        login_member_type: selectedLoginType,
        tenant_uri: getFirstSubdomain(),
      }),
    );
  };

  const onError = (e: any) => {
    console.log('error', e);
  };

  const handleLoginTypeChange = event => {
    console.log('event.target.value', event.target.value);
    setSelectedLoginType(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);

  return (
    <div className={cx('login-container')}>
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
        <option value="0001">외부사용자</option>
        <option value="0002">학생</option>
        <option value="0003">교수</option>
      </select>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
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
          </>
        ) : (
          <>
            {' '}
            <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>
              {selectedLoginType === '0002' ? '학번' : '교번'}
            </Typography>
            <TextField
              required
              id="username"
              name="username"
              placeholder={`${selectedLoginType === '0002' ? '학번' : '교번'}을 입력해주세요.`}
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
            onClick={() => handleSubmit(onSubmit)}
          >
            로그인
          </button>
        </div>
      </form>
      <Box display="center" justifyContent="center" sx={{ fontWeight: 'bold' }}>
        <Typography sx={{ fontSize: 14 }} className="tw-py-3">
          동서대학교 QuizUp 계정이 없으신가요?
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
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        sx={{ maxHeight: '60vh', top: '22%', left: '0', overflowY: 'auto' }}
      >
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
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            <div dangerouslySetInnerHTML={{ __html: termList?.content }}></div>
          </DialogContentText>
        </DialogContent>

        <DialogActions className="tw-flex tw-justify-center tw-gap-4 tw-py-3">
          <button
            className="tw-bg-gray-300 tw-w-[130px] tw-px-5  tw-rounded-md  tw-h-[38px] tw-text-white"
            onClick={handleClose}
          >
            취소
          </button>
          <button
            className="tw-bg-red-500 tw-w-[130px] tw-px-5 tw-rounded-md  tw-h-[38px] tw-text-white"
            onClick={() => {
              onLoginSignUp({
                id: username,
                password: password,
                agreedTermsIds: ['service1', 'privacy1'],
                isEmailReceive: true,
                isSmsReceive: true,
                isKakaoReceive: true,
                tenantUri: getFirstSubdomain(),
                loginMemberType: selectedLoginType,
              });
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
    tenant_uri: '',
  };
  return {
    ...defaultParams,
    ...params,
  };
};
