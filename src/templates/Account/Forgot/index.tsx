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

const cx = classNames.bind(styles);

interface ForgotTemplateProps {
  title: string;
  onSubmitLogin: () => void;
}

export function ForgotTemplate({ title = '', onSubmitLogin }: ForgotTemplateProps) {
  const { mutate: onEmainSend, isSuccess, data: loginData } = useEmainSend();
  const { update, tenantName } = useSessionStore.getState();
  const router = useRouter();
  const [username, setUserName] = useState('');
  const [step, setStep] = useState('1');

  console.log('login join page', getFirstSubdomain(), tenantName);

  const [clientTenantName, setClientTenantName] = useState(null);
  useEffect(() => {
    // 클라이언트에서만 tenantName을 설정
    setClientTenantName(tenantName);
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Email is required').email('Email is invalid'),
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
    // onEmainSend(
    //   paramsWithDefault({
    //     ...data,
    //     tenant_uri: getFirstSubdomain(),
    //   }),
    // );
    setStep('2');
  };

  const onError = (e: any) => {
    console.log('error', e);
  };

  return (
    <div className={cx('login-container', 'tw-h-[73vh]')}>
      <div className={cx('logo-area')}>
        {/* <img src="/assets/images/cm_CI_co_1000x225.png" alt="footer logo" width={162} className="img-fluid mb-3" /> */}
        {step === '1' && (
          <>
            <p className={cx('tw-font-bold tw-text-[26px] tw-text-black tw-py-5 tw-text-center tw-mt-40')}>
              비밀번호 찾기
            </p>

            <Divider className={cx('sign-color')}></Divider>
            <Typography sx={{ fontSize: 14, marginTop: 3, color: 'black', fontWeight: '500' }}>
              학번 또는 이메일회원 가입시 입력하신 이메일 주소를 입력하시면, 해당 이메일로 비밀번호 변경 링크를
              보내드립니다.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <TextField
                required
                id="username"
                name="username"
                placeholder="이메일을 입렧해주세요."
                variant="outlined"
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
                margin="dense"
                {...register('username')}
                error={errors.username ? true : false}
                helperText={errors.username?.message}
              />
              <div style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
                <button
                  className={`${getButtonClass(
                    clientTenantName,
                  )} tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white`}
                  onClick={() => handleSubmit(onSubmit)}
                >
                  비밀번호 찾기
                </button>
              </div>
            </form>
          </>
        )}
        {step === '2' && (
          <>
            <div className="tw-flex tw-flex-col tw-items-center tw-mt-40">
              <svg className="tw-h-14 tw-w-14" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M28.9992 57.8002C44.905 57.8002 57.7992 44.906 57.7992 29.0002C57.7992 13.0944 44.905 0.200195 28.9992 0.200195C13.0934 0.200195 0.199219 13.0944 0.199219 29.0002C0.199219 44.906 13.0934 57.8002 28.9992 57.8002ZM42.3448 24.3458C43.7507 22.9399 43.7507 20.6605 42.3448 19.2546C40.9389 17.8487 38.6595 17.8487 37.2536 19.2546L25.3992 31.109L20.7448 26.4546C19.3389 25.0487 17.0595 25.0487 15.6536 26.4546C14.2477 27.8605 14.2477 30.1399 15.6536 31.5458L22.8536 38.7458C24.2595 40.1517 26.5389 40.1517 27.9448 38.7458L42.3448 24.3458Z"
                  fill="#34D399"
                ></path>
              </svg>
              <div className="tw-mt-6 tw-text-center tw-text-xl tw-font-bold">
                <p className="tw-flex tw-flex-col">
                  <span className="tw-text-blue-500">{username}</span>
                  <span>으로 안내 메일을 발송하였습니다.</span>
                </p>
              </div>
            </div>

            <div className="tw-mx-4 tw-sm:mx-0 tw-my-10">
              <div className="tw-w-full tw-rounded-md tw-bg-gray-50 tw-p-4 tw-dark:bg-gray-700/50 ">
                <p className="tw-text-center tw-text-sm">
                  <p>해당 이메일을 확인 하시고, 비밀번호 변경이 필요하신 경우 해당 이메일을 통해 변경 가능합니다.</p>
                  <p>* 서비스에 따라 스팸으로 분류되어 있을 수 있습니다.</p>
                  <p>스팸함도 꼭 확인해 주시기 바랍니다.</p>
                </p>
              </div>
              <div className="tw-mt-7 tw-flex tw-justify-center">
                <button
                  className={`${getButtonClass(
                    clientTenantName,
                  )} tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white `}
                  onClick={() => router.push('/account/login')}
                >
                  로그인
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotTemplate;
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
