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
        <p className={cx('logo-area__text')}>
          데브어스에<br></br> 오신 것을 환영합니다!
          <br />
        </p>
        <div className={cx('button-area')}>
          <Button type="submit" color="kakao" size="medium" onClick={handleLogin}>
            <img src="/assets/images/account/kakao.svg" alt="카카오 로그인" className={cx('image-login')} />
            <Typography sx={{ fontWeight: '600', fontSize: 16 }}>카카오 1초 로그인/회원가입</Typography>
          </Button>
        </div>
        {/* <Divider className={cx('sign-color')}>또는 이메일 로그인</Divider> */}
      </div>
      {/* <form onSubmit={handleSubmit(onSubmit, onError)}>
        <TextField
          required
          id="username"
          name="username"
          label="Email"
          variant="standard"
          type="search"
          fullWidth
          sx={{
            marginTop: '20px',
            '& label': { fontSize: 13, color: '#919191', fontWeight: 'bold' },
            // '& input': { height: ' 0.8em;' },
            '& .MuiTextField-root': { marginBottom: 0 },
            '& .MuiFormHelperText-root': {
              position: 'absolute',
              bottom: '-1.4rem',
            },
          }}
          margin="dense"
          {...register('username')}
          error={errors.username ? true : false}
          helperText={errors.username?.message}
        />
        <TextField
          required
          id="password"
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="dense"
          variant="standard"
          sx={{
            marginTop: '28px',
            marginBottom: '20px',
            // '& input': { height: ' 0.8em;' },
            '& label': { fontSize: 13, color: '#919191', fontWeight: 'bold' },
            '& .MuiFormHelperText-root': {
              position: 'absolute',
              bottom: '-1.4rem',
            },
          }}
          {...register('password')}
          error={errors.password ? true : false}
          helperText={errors.password?.message}
        />

        <Grid container spacing={3} direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            <Box display="flex" justifyContent="flex-start">
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
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="flex-end" sx={{ fontWeight: 'bold' }}>
              <Typography>비밀번호 찾기</Typography>
            </Box>
          </Grid>
        </Grid>
        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
          <Button size="medium" onClick={() => handleSubmit(onSubmit)}>
            <Typography sx={{ fontWeight: '600', fontSize: 14 }}>로그인</Typography>
          </Button>
        </div>
      </form>
      <Button size="medium" onClick={() => router.push('/account/signup')}>
        <Typography sx={{ fontWeight: '600', fontSize: 14 }}>이메일로 회원가입</Typography>
      </Button> */}
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
