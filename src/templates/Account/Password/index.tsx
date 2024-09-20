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

  const { mutate: onResetPassword, isSuccess: isSuccessResetPassword } = useResetPassword();

  console.log('login join page', getFirstSubdomain(), tenantName);

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
      alert('새 비밀번호와 확인이 일치하지 않습니다.');
    }
  };

  return (
    <div className={cx('login-container', 'tw-h-[73vh]')}>
      <div className={cx('logo-area')}>
        {/* <img src="/assets/images/cm_CI_co_1000x225.png" alt="footer logo" width={162} className="img-fluid mb-3" /> */}
        <>
          <p className={cx('tw-font-bold tw-text-[26px] tw-text-black tw-py-5 tw-text-center tw-mt-32')}>
            변경하실 비밀번호를 입력해주세요.
          </p>

          <Divider className={cx('sign-color')}></Divider>
          <div className="">
            <label htmlFor="name" className="tw-mt-10 tw-text-gray-700 tw-font-bold tw-w-40">
              새 비밀번호
            </label>
            <TextField
              type="search"
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
            />
          </div>
          <div className=" tw-mt-2 tw-mb-5">
            <label htmlFor="name" className="tw-text-gray-700 tw-font-bold tw-w-40">
              새 비밀번호 확인
            </label>
            <TextField
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
            />
          </div>
          <div style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
            <button
              className={`${getButtonClass(
                clientTenantName,
              )} tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white`}
              onClick={() => handlePasswordChangeSubmit()}
            >
              비밀번호 변경
            </button>
          </div>
        </>
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
