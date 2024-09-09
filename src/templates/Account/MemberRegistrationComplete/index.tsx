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

interface MemberRegistrationCompleteTemplateProps {
  onSubmitLogin: () => void;
}

const cx = classNames.bind(styles);

export function MemberRegistrationCompleteTemplate({ onSubmitLogin }: MemberRegistrationCompleteTemplateProps) {
  const router = useRouter();

  // ** Timer
  const [subdomain, setSubdomain] = useState('');

  const { mutate: onLoginSignUp, isSuccess: isSignUpSuccess, data: signUpData } = useLoginSignUp();

  useEffect(() => {
    const subdomain = getFirstSubdomain();
    setSubdomain(subdomain);
  }, []);

  useEffect(() => {
    if (isSignUpSuccess) {
      // router.push('/account/login');
    }
  }, [isSignUpSuccess]);

  const onSubmit = data => {
    onLoginSignUp({
      // ...data,
      email: email,
      name: data.name,
      password: data.password,
      nickname: data.name,
      phoneNumber: phone,
      agreedTermsIds: ['service1', 'privacy1'],
      emailReceiveYn: email1,
      smsReceiveYn: sms,
      kakaoReceiveYn: kakao,
      token: resultData.token,
      tenantUri: subdomain,
    });
  };

  const onError = (e: any) => {
    console.log('error', e);
  };

  return (
    <div className={cx('login-container')}>
      <div
        className="tw-w-full tw-h-[825px] "
        style={{
          background:
            'linear-gradient(to right, rgba(216,253,255,0.25) 0%, rgba(222,207,255,0.25) 51.99%, rgba(255,236,186,0.25) 100%)',
        }}
      >
        <div className="tw-text-3xl tw-font-bold tw-text-center tw-text-black tw-pt-[250px] tw-mb-14">
          데브어스에 오신 것을 환영합니다!
        </div>
        <div className="tw-flex tw-items-center tw-justify-center tw-gap-5 ">
          <div
            onClick={() => router.push('/account/login')}
            className="tw-cursor-pointer tw-w-[300px] tw-h-12 tw-relative tw-overflow-hidden tw-rounded tw-bg-[#2474ed] tw-flex tw-items-center tw-justify-center"
          >
            <p className="tw-text-base tw-font-bold tw-text-center tw-text-white">로그인 화면으로 가기</p>
          </div>
          {/* <div className="tw-cursor-pointer tw-w-[300px] tw-h-12 tw-relative tw-overflow-hidden tw-rounded tw-bg-[#31343d] tw-flex tw-items-center tw-justify-center">
            <p className="tw-text-base tw-font-bold tw-text-center tw-text-white">교수자 권한 요청하기</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default MemberRegistrationCompleteTemplate;

const paramsWithDefault = (params: any) => {
  const defaultParams: any = {
    type: '0001',
  };
  return {
    ...defaultParams,
    ...params,
  };
};
