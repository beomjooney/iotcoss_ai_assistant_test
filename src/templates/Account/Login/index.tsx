import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Button } from '../../../stories/components';
import { useRouter } from 'next/router';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Typography from '@mui/material/Typography';
import { useLogin } from 'src/services/account/account.mutations';

interface LoginTemplateProps {
  onSubmitLogin: () => void;
}

const cx = classNames.bind(styles);

export function LoginTemplate({ onSubmitLogin }: LoginTemplateProps) {
  const { mutate: onLogin, isSuccess } = useLogin();
  const router = useRouter();

  const handleLogin = async () => {
    location.href = `${process.env['NEXT_PUBLIC_GENERAL_API_URL']}/oauth2/authorize/kakao?redirect_uri=${process.env['NEXT_PUBLIC_REDIRECT_URL']}`;
  };

  const handleData = async () => {
    onSubmitLogin && onSubmitLogin();
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Email is required').email('Email is invalid'),
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
    onLogin(
      paramsWithDefault({
        ...data,
      }),
    );
  };

  if (isSuccess) {
    onSubmitLogin();
  }

  const onError = (e: any) => {
    console.log('error', e);
  };

  return (
    <div className={cx('login-container')}>
      <div className={cx('logo-area')}>
        {/* <img src="/assets/images/cm_CI_co_1000x225.png" alt="footer logo" width={162} className="img-fluid mb-3" /> */}
        <p className={cx('logo-area__text')}>로그인</p>
        {/* <Divider className={cx('sign-color')}>또는 이메일 로그인</Divider> */}
      </div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '600' }}>학번 및 이메일</Typography>
        <TextField
          required
          id="username"
          name="username"
          label="학번 혹은 이메일을 입력해주세요."
          variant="outlined"
          type="search"
          fullWidth
          sx={{
            marginTop: '10px',
            '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
            // '& input': { height: ' 0.8em;' },
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
          label="비밀번호를 입력해주세요."
          type="password"
          fullWidth
          margin="dense"
          variant="outlined"
          sx={{
            marginTop: '10px',
            '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
            // '& input': { height: ' 0.8em;' },
          }}
          {...register('password')}
          error={errors.password ? true : false}
          helperText={errors.password?.message}
        />

        <Grid container spacing={3} direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            {/* <Box display="flex" justifyContent="flex-start">
              <FormGroup sx={{ fontWeight: 'bold' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={<Typography>자동 로그인</Typography>}
                />
              </FormGroup>
            </Box> */}
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="flex-end" sx={{ fontWeight: 'bold' }}>
              <Typography sx={{ fontSize: 12, textDecoration: 'underline' }} className="tw-py-3">
                비밀번호를 잊으셨나요?
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
          <Button color="red" size="medium" onClick={() => handleSubmit(onSubmit)}>
            <Typography sx={{ fontWeight: '600', fontSize: 16 }}>로그인</Typography>
          </Button>
        </div>
      </form>
      {/* <Button size="medium" onClick={() => router.push('/account/signup')}>
        <Typography sx={{ fontWeight: '600', fontSize: 18 }}>이메일로 회원가입</Typography>
      </Button> */}
      <Divider className={cx('sign-color', 'tw-py-3')}>또는</Divider>
      <div style={{ marginBottom: '20px', marginTop: '20px' }}>
        <Button type="submit" size="medium" color="kakao" onClick={handleLogin}>
          <img src="/assets/images/account/kakao.svg" alt="카카오 로그인" className={cx('image-login')} />
          <Typography sx={{ fontWeight: '600', fontSize: 16 }}>카카오 3초만에 시작하기</Typography>
        </Button>
      </div>
      <Box display="flex" justifyContent="center" sx={{ fontWeight: 'bold' }}>
        <Typography sx={{ fontSize: 14 }}>동서대학교 devus 계정이 없으신가요?</Typography>
      </Box>
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
  };
  return {
    ...defaultParams,
    ...params,
  };
};
