import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Button } from '../../../stories/components';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import { UseQueryResult } from 'react-query';
import { useIdVerification, useTermsList } from 'src/services/account/account.queries';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useLoginOtp, useLoginOtpVerification, useLoginSignUp } from 'src/services/account/account.mutations';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { getFirstSubdomain } from 'src/utils/date';
import { useJoin } from 'src/services/account/account.mutations';

interface SignupAuthenticationTemplateProps {
  onSubmitLogin: () => void;
}

const cx = classNames.bind(styles);

export function SignupAuthenticationTemplate({ onSubmitLogin }: SignupAuthenticationTemplateProps) {
  const router = useRouter();
  const key = router.query['key'];

  // ** Timer
  const { mutate: onjoin, isSuccess: isSuccessResetPassword, data: joinData } = useJoin();
  console.log('key', key, joinData);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (key) {
      onjoin({
        key: key,
      });
      // router.push('/account/login');
    }
  }, [key]);

  return (
    <div className={cx('login-container', 'tw-h-[73vh]')}>
      {isClient && joinData?.responseCode === '0000' && (
        <div className={cx('logo-area')}>
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
                <span className="tw-text-blue-500">{}</span>
                <span>회원가입 완료</span>
              </p>
            </div>
          </div>

          <div className="tw-mx-4 tw-sm:mx-0 tw-my-10 tw-flex tw-flex-col tw-items-center ">
            <div className="tw-w-1/2 tw-rounded-md tw-bg-gray-50 tw-p-4 tw-dark:bg-gray-700/50 ">
              <p className="tw-text-center tw-text-base">
                <p>회원가입이 성공적으로 완료되었습니다.</p>
                <div>
                  회원가입 내역확인 및 수정은{' '}
                  <span className="tw-font-bold tw-text-blue-500">마이페이지 &gt; 개인정보관리</span>에서 가능합니다.
                </div>
              </p>
            </div>

            <div className="tw-mt-10 tw-flex tw-justify-center">
              <button
                className="tw-px-5 border tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-black"
                onClick={() => (window.location.href = '/account/login')}
              >
                로그인바로하기
              </button>
            </div>
          </div>
        </div>
      )}

      {isClient && joinData?.responseCode === '4016' && (
        <div className={cx('logo-area')}>
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
                <span className="tw-text-blue-500">{}</span>
                <span>세션이 만료되었습니다.</span>
              </p>
            </div>
          </div>
          <div className="tw-mx-4 tw-sm:mx-0 tw-my-10 tw-flex tw-flex-col tw-items-center ">
            <div className="tw-w-1/2 tw-rounded-md tw-bg-gray-50 tw-p-4 tw-dark:bg-gray-700/50 ">
              <p className="tw-text-center tw-text-base">
                <p>회원가입에 실패하였습니다.</p>
              </p>
            </div>

            <div className="tw-mt-10 tw-flex tw-justify-center">
              <button
                className="tw-px-5 border tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-black"
                onClick={() => router.push('/account/signup')}
              >
                회원가입 하러가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupAuthenticationTemplate;

const paramsWithDefault = (params: any) => {
  const defaultParams: any = {
    type: '0001',
  };
  return {
    ...defaultParams,
    ...params,
  };
};
