import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Typography from '@mui/material/Typography';
import { useLogin } from 'src/services/account/account.mutations';
import { usePresets } from 'src/utils/color-presets';
import { useEffect, useState } from 'react';
import { useColorPresets } from 'src/utils/use-theme-color';
import { useColorPresetName } from 'src/utils/use-theme-color';
import { deleteCookie } from 'cookies-next';

interface LoginTemplateProps {
  onSubmitLogin: () => void;
}

const cx = classNames.bind(styles);

interface LoginTemplateProps {
  title: string;
  tenantName: string;
  onSubmitLogin: () => void;
}

function getSubdomain() {
  const { host } = typeof window !== 'undefined' && window.location;
  console.log(host);

  if (host) {
    // 호스트 이름에 '.'이 있으면 공백을 반환
    if (!host.includes('.')) {
      return ''; // 공백 반환
    }

    console.log(host);
    return host;
  }

  return null; // 서브도메인이 없는 경우
}

export function LoginTemplate({ tenantName = '', title = '', onSubmitLogin }: LoginTemplateProps) {
  const { mutate: onLogin, isSuccess, data: loginData } = useLogin();

  const router = useRouter();
  const COLOR_PRESETS = usePresets();
  const { setColorPresetName } = useColorPresetName();
  const { setColorPresets } = useColorPresets();
  const [subdomain, setSubdomain] = useState('');
  const [username, setUserName] = useState('');

  console.log('login page');
  useEffect(() => {
    const subdomain = getSubdomain();
    console.log('subdomain', subdomain);
    setSubdomain(subdomain);

    if (!COLOR_PRESETS || COLOR_PRESETS.length === 0) return;

    const preset = COLOR_PRESETS.find(preset => preset.name === subdomain.split('.')[0]) || COLOR_PRESETS[0];
    setColorPresetName(preset.name);
    setColorPresets(preset.colors);

    console.log(preset.name);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      onSubmitLogin();

      console.log(loginData);
      if (!loginData?.tenant_uri?.includes(tenantName)) {
        const authStore = localStorage.getItem('auth-store');
        if (authStore) {
          try {
            const json = JSON.parse(authStore);
            if (json && json.state) {
              const jsonString = JSON.stringify(json.state);
              // 1. Base64 인코딩 (Node.js 환경에서는 Buffer를 사용)
              const encodedJson = Buffer.from(jsonString).toString('base64');
              // Continue with your logic here
              deleteCookie('access_token');
              localStorage.removeItem('auth-store');
              localStorage.removeItem('app-storage');
              console.log('loginData', loginData?.redirections?.home_url + `?accessToken=${loginData?.access_token}`);
              if (username == 're4@naver.com' || username === 're3@naver.com') {
                location.href = 'http://devus.localhost:3001' + `?authStore=${encodedJson}`;
              } else {
                location.href = loginData?.redirections?.home_url + `?authStore=${encodedJson}`;
              }
              deleteCookie('access_token');
              localStorage.removeItem('auth-store');
              localStorage.removeItem('app-storage');
            } else {
              console.error('Invalid authStore format: missing state property');
            }
          } catch (error) {
            console.error('Failed to parse authStore:', error);
          }
        } else {
          console.warn('authStore is not available in localStorage');
        }
      }
    }
  }, [loginData]);

  const handleLogin = async () => {
    location.href = `${process.env['NEXT_PUBLIC_GENERAL_API_URL']}/oauth2/authorize/kakao?redirect_uri=${process.env['NEXT_PUBLIC_REDIRECT_URL']}`;
  };

  const handleData = async () => {
    onSubmitLogin && onSubmitLogin();
  };

  const validationSchema = Yup.object().shape({
    // username: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password must be at least 4 characters')
      .max(8, 'Password must not exceed 8 characters'),
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
    setUserName(data.username);
    onLogin(
      paramsWithDefault({
        ...data,
        tenant_uri: subdomain,
      }),
    );
  };

  const onError = (e: any) => {
    console.log('error', e);
  };

  return (
    <div className={cx('login-container')}>
      <div className={cx('logo-area')}>
        {/* <img src="/assets/images/cm_CI_co_1000x225.png" alt="footer logo" width={162} className="img-fluid mb-3" /> */}
        <p className={cx('tw-font-bold tw-text-[26px] tw-text-black tw-py-5 tw-text-center')}>{title} 로그인</p>
        {/* <Divider className={cx('sign-color')}>또는 이메일 로그인</Divider> */}
      </div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>학번 또는 이메일</Typography>
        <TextField
          required
          id="username"
          name="username"
          placeholder="학번 또는 이메일을 입렧해주세요."
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
            <Box display="flex" justifyContent="flex-end" sx={{ fontWeight: 'bold' }}>
              <Typography sx={{ fontSize: 12, textDecoration: 'underline' }} className="tw-py-3">
                비밀번호를 잊으셨나요?
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <div style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
          <button
            className="tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-bg-primary tw-text-white"
            // className="tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-bg-[#e11837] tw-text-white"
            onClick={() => handleSubmit(onSubmit)}
          >
            로그인
          </button>
        </div>
      </form>
      <Divider className={cx('sign-color', 'tw-py-3')}>또는</Divider>
      <div style={{ marginBottom: '20px', marginTop: '20px' }}>
        <button className="tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-bg-black tw-text-white">
          <Typography sx={{ fontWeight: '600', fontSize: 16 }}>학번으로 로그인</Typography>
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
