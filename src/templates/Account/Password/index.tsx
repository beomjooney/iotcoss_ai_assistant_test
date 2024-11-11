import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Typography from '@mui/material/Typography';
import { useEmainSend } from 'src/services/account/account.mutations';
import { useEffect, useState } from 'react';
import { useSessionStore } from '../../../store/session';
import { getFirstSubdomain } from 'src/utils';
import { getButtonClass } from 'src/utils/clubStatus';
import Divider from '@mui/material/Divider';
import { useResetPassword } from 'src/services/account/account.mutations';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const cx = classNames.bind(styles);

interface PasswordTemplateProps {
  title: string;
  onSubmitLogin: () => void;
}

export function PasswordTemplate({ title = '', onSubmitLogin }: PasswordTemplateProps) {
  const { mutate: onEmainSend, isSuccess, data: loginData } = useEmainSend();
  const { update, tenantName } = useSessionStore.getState();
  const router = useRouter();
  const key = router.query['key'];
  console.log('key', key);
  const [username, setUserName] = useState('');
  const [step, setStep] = useState('1');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleClickShowPassword1 = () => setShowPassword1(show => !show);

  const { mutate: onResetPassword, isSuccess: isSuccessResetPassword } = useResetPassword();

  const [clientTenantName, setClientTenantName] = useState(null);
  useEffect(() => {
    // 클라이언트에서만 tenantName을 설정
    setClientTenantName(tenantName);
  }, []);

  const onError = (e: any) => {
    console.log('error', e);
  };

  const handlePasswordChange2 = value => {
    setNewPassword(value);
  };

  const handlePasswordChange3 = value => {
    setConfirmPassword(value);
  };

  const handlePasswordChangeSubmit = () => {
    console.log('password change');
    // Add your password change logic here

    // 비밀번호 길이 유효성 검사
    if (newPassword.length < 4 || newPassword.length > 20) {
      alert('비밀번호는 4자리 이상 20자리 이하로 설정해야 합니다.');
      return;
    }

    if (newPassword === confirmPassword) {
      // Password change logic
      console.log('Password changed successfully');
      onResetPassword({
        key: key,
        newPassword: newPassword,
        newPasswordConfirm: confirmPassword,
      });
    } else {
      alert('새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.');
    }
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('비밀번호는 필수 항목입니다.')
      .test(
        'password-complexity',
        '비밀번호는 최소 2가지 종류의 문자를 포함하여 10자 이상이거나, 최소 3가지 종류의 문자를 포함하여 8자 이상이어야 합니다.',
        function (value) {
          if (!value) return false; // 비밀번호가 없을 경우 유효하지 않음
          const hasLower = /[a-z]/.test(value);
          const hasUpper = /[A-Z]/.test(value);
          const hasNumber = /\d/.test(value);
          const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

          const characterTypes = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

          // 2종류 이상이면서 10자리 이상
          if (characterTypes >= 2 && value.length >= 10) {
            return true;
          }

          // 3종류 이상이면서 8자리 이상
          if (characterTypes >= 3 && value.length >= 8) {
            return true;
          }

          return false;
        },
      )
      .max(20, '비밀번호는 20자를 초과할 수 없습니다.'),
    passwordConfirm: Yup.string()
      .required('비밀번호는 필수 항목입니다.')
      .oneOf([Yup.ref('password')], '비밀번호가 일치하지 않습니다.'),
    website: Yup.string().matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!',
    ),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = data => {
    console.log('onSubmit', data);

    onResetPassword({
      key: key,
      newPassword: data.password,
      newPasswordConfirm: data.passwordConfirm,
    });
  };

  return (
    <div className={cx('login-container', 'tw-h-[73vh]')}>
      <div className={cx('logo-area', 'tw-px-10')}>
        {/* <img src="/assets/images/cm_CI_co_1000x225.png" alt="footer logo" width={162} className="img-fluid mb-3" /> */}
        <div>
          <p className={cx('tw-font-bold tw-text-2xl tw-text-black tw-pb-10 tw-text-center tw-mt-32')}>
            변경하실 비밀번호를 입력해주세요.
          </p>

          <Divider className={cx('sign-color')}></Divider>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="">
              <label htmlFor="name" className="tw-mt-10 tw-text-gray-700 tw-font-bold tw-w-40 tw-mb-3">
                새 비밀번호
              </label>
              {/* <TextField
              type="password"
              fullWidth
              sx={{
                backgroundColor: '#F6F7FB',
                borderRadius: '10px',
                marginY: '15px',
                '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                '& fieldset': { border: 'none' },
                '& input': { height: ' 0.8em;' },
              }}
              inputProps={{
                style: { borderBottomColor: '#e3e3e3 !important' },
              }}
              id="password"
              name="password"
              onChange={e => handlePasswordChange2(e.target.value)}
              value={newPassword}
            /> */}
              <TextField
                sx={{
                  '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                  '& input': { height: ' 0.8em;' },
                }}
                fullWidth
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
                id="password"
                name="password"
                {...register('password')}
                error={errors.password ? true : false}
                helperText={errors.password?.message}
              />
            </div>
            <div className=" tw-mt-5 tw-mb-10">
              <label htmlFor="name" className="tw-text-gray-700 tw-font-bold tw-w-40 tw-mb-3">
                새 비밀번호 확인
              </label>
              {/* <TextField
              type="password"
              fullWidth
              sx={{
                backgroundColor: '#F6F7FB',
                borderRadius: '10px',
                marginY: '15px',
                '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                '& fieldset': { border: 'none' },
                '& input': { height: ' 0.8em;' },
              }}
              onChange={e => handlePasswordChange3(e.target.value)}
              value={confirmPassword}
              autoComplete="current-password"
              id="passwordConfirm"
              name="passwordConfirm"
            /> */}
              <TextField
                sx={{
                  '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                  '& input': { height: ' 0.8em;' },
                }}
                fullWidth
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
                autoComplete="current-password"
                id="passwordConfirm"
                name="passwordConfirm"
                {...register('passwordConfirm')}
                error={errors.passwordConfirm ? true : false}
                helperText={errors.passwordConfirm?.message}
              />
            </div>

            <div style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
              <button
                className={`${getButtonClass(
                  clientTenantName,
                )} tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white`}
                // onClick={() => handlePasswordChangeSubmit()}
                onClick={() => handleSubmit(onSubmit)}
              >
                비밀번호 변경
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordTemplate;
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
