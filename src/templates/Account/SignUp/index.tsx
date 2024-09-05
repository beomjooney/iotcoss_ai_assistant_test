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
import { useSessionStore } from '../../../../src/store/session';
import { getButtonClass } from 'src/utils/clubStatus';

interface SignUpTemplateProps {
  onSubmitLogin: () => void;
}

const cx = classNames.bind(styles);

export function SignUpTemplate({ onSubmitLogin }: SignUpTemplateProps) {
  const { tenantName } = useSessionStore.getState();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDisabledPhone, setIsDisabledPhone] = useState<boolean>(false);
  const [isDisabledEmail, setIsDisabledEmail] = useState<boolean>(false);
  const [isDisabledOtp, setIsDisabledOtp] = useState<boolean>(true);
  const [isDisabledTimer, setIsDisabledTimer] = useState<boolean>(true);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [smsFlag, setSmsFlag] = useState(false);
  const [termsParams, setTermsParams] = useState<any>({ type: '0001' });
  const [CheckList, setCheckList] = useState([]);
  const [CheckMarketingList, setCheckMarketingList] = useState([]);
  const [IdList, setIdList] = useState(['serviceTerms', 'privateTerms', 'marketing']);
  const [marketingList, setMarketingList] = useState(['email', 'sms', 'kakao']);
  const [phone, setPhone] = useState('');
  const [allTerm, setAllTerm] = useState<boolean>(false);
  const [serviceTerm, setServiceTerm] = useState<boolean>(false);
  const [privateTerm, setPrivateTerm] = useState<boolean>(false);
  const [marketing, setMarketing] = useState<boolean>(false);
  const [email1, setEmail1] = useState<boolean>(false);
  const [kakao, setKakao] = useState<boolean>(false);
  const [sms, setSms] = useState<boolean>(false);
  const [subdomain, setSubdomain] = useState('');

  // ** Timer
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [email, setEmail] = useState('');
  const [params, setParams] = useState<any>({ email });
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const { mutate: onLoginSignUp, isSuccess: isSignUpSuccess, data: signUpData } = useLoginSignUp();
  const { mutate: onLoginOtp, isSuccess } = useLoginOtp();
  const { mutate: onLoginOtpVerification, isSuccess: isVerification, data: resultData } = useLoginOtpVerification();

  // useEffect(() => {
  //   if (signUpData) {
  //     console.log('resultData', signUpData.data);
  //     if (signUpData.data.responseCode === 'CO4015') {
  //       alert('권한 요청 없습니다.');
  //     } else {
  //       router.push('/account/login');
  //     }
  //   }
  // }, [signUpData]);

  useEffect(() => {
    if (resultData) {
      console.log('resultData', resultData);
      if (resultData?.result) {
        alert('인증에 성공했습니다.');
        setIsDisabledTimer(false);
        setIsDisabledPhone(true);
        setSmsFlag(false);
        setIsDisabled(true);
      } else {
        alert('인증에 실패했습니다.');
      }
    }
  }, [resultData]);

  useEffect(() => {
    const subdomain = getFirstSubdomain();
    setSubdomain(subdomain);
  }, []);

  useEffect(() => {
    if (isSignUpSuccess) {
      // router.push('/account/login');
    }
  }, [isSignUpSuccess]);

  const {
    data: clubQuizList,
    refetch: idRefetch,
    error,
  }: UseQueryResult<any> = useIdVerification(params, data => {
    console.log('data', data);
    if (data.responseCode === '1400') {
      alert('해당 도메인은 사용할 수 없습니다.\n ' + data.data.toString() + ' 메일주소로 가입해주세요.');
    } else if (data.responseCode === '1401') {
      alert('중복된 이메일 입니다.');
    } else if (data.responseCode === '1402') {
      alert('유효하지 않은 이메일 형식입니다.');
    } else {
      alert('가입가능한 이메일입니다.');
      setIsDisabledEmail(true);
    }
  });

  // 체크할 시 CheckList에 id 값 전체 넣기, 체크 해제할 시 CheckList에 빈 배열 넣기
  const onChangeAll = e => {
    setCheckList(e.target.checked ? IdList : []);
    setCheckMarketingList(e.target.checked ? marketingList : []);
    setAllTerm(e.target.checked);
    setServiceTerm(e.target.checked);
    setPrivateTerm(e.target.checked);
    setMarketing(e.target.checked);
    setEmail1(e.target.checked);
    setSms(e.target.checked);
    setKakao(e.target.checked);
  };

  // 체크박스 전체 선택
  const onChangeMarketingAll = (e, id) => {
    setEmail1(e.target.checked);
    setSms(e.target.checked);
    setKakao(e.target.checked);
    if (e.target.checked) {
      setCheckList([...CheckList, id]);
      // 체크 해제할 시 CheckList에서 해당 id값이 `아닌` 값만 배열에 넣기
    } else {
      setCheckList(CheckList.filter(checkedId => checkedId !== id));
    }
    setCheckMarketingList(e.target.checked ? marketingList : []);
  };

  const checkboxref = useRef(null);

  const onChangeEach = (e, id) => {
    if (id === 'serviceTerms') {
      setServiceTerm(e.target.checked);
    } else if (id === 'privateTerms') {
      setPrivateTerm(e.target.checked);
    } else if (id === 'marketing') {
      setMarketing(e.target.checked);
    }

    // 체크할 시 CheckList에 id값 넣기
    if (e.target.checked) {
      setCheckList([...CheckList, id]);
      // 체크 해제할 시 CheckList에서 해당 id값이 `아닌` 값만 배열에 넣기
    } else {
      setCheckList(CheckList.filter(checkedId => checkedId !== id));
    }
  };

  const onChangeMarketingEach = (e, id) => {
    if (id === 'email') {
      setEmail1(e.target.checked);
    } else if (id === 'sms') {
      setSms(e.target.checked);
    } else if (id === 'kakao') {
      setKakao(e.target.checked);
    }
    if (e.target.checked) {
      setCheckMarketingList([...CheckMarketingList, id]);
    } else {
      setCheckMarketingList(CheckMarketingList.filter(checkedId => checkedId !== id));
    }
  };
  const phoneRegExp =
    // /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Must be more than one character').required('Username is required'),
    // memberId: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password must be at least 4 characters')
      .max(8, 'Password must not exceed 8 characters'),
    passwordConfirm: Yup.string()
      .required('Password is required')
      .min(4, 'Password must be at least 4 characters')
      .max(8, 'Password must not exceed 8 characters')
      .oneOf([Yup.ref('password')], 'Passwords do not match'),
    website: Yup.string().matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!',
    ),
  });

  function phone_format(num) {
    return num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
  }

  const validationEmailSchema = Yup.object().shape({
    memberId: Yup.string().email('유효하지 않은 이메일 주소입니다.').required('이메일 주소는 필수입니다.'),
  });

  const validationSchemaPhone = Yup.object().shape({
    phoneNumber: Yup.string().matches(phoneRegExp, '핸드폰 번호 입력이 잘못되었습니다.'),
  });

  const validationSchemaOtp = Yup.object().shape({
    otp: Yup.string()
      .required('인증번호를 입력해주세요.')
      .matches(/^[0-9]+$/, 'Must be only number')
      .min(6, 'Must be exactly 6 number')
      .max(6, 'Must be exactly 6 number'),
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
    if (!isDisabledEmail) {
      alert('이메일 중복확인을 해주세요.');
      return;
    }

    if (!serviceTerm) {
      alert('서비스이용약관을 선택 해주세요.');
      return;
    } else if (!privateTerm) {
      alert('개인정보약관을 선택 해주세요');
      return;
    } else if (!isDisabled) {
      alert('본인인증을 해주세요.');
      return;
    }

    if (resultData.token === null) {
      alert('인증번호를 인증해주세요.');
      return;
    }

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

  useEffect(() => {
    if (isSuccess) {
      setIsDisabledOtp(false);
      setIsDisabledTimer(true);
      setMin(3);
      // setSec(10);
      setSmsFlag(true);
    }
  }, [isSuccess]);

  const {
    register: registerId,
    control: test,
    handleSubmit: handleSubmitId,
    formState: { errors: errorsId },
  } = useForm({
    resolver: yupResolver(validationEmailSchema),
  });

  useEffect(() => {
    if (shouldRefetch) {
      console.log('33');
      idRefetch();
      setShouldRefetch(false); // Reset the state to prevent continuous refetch
    }
  }, [params]);

  const onSubmitId = async data => {
    event.preventDefault();
    console.log('id3133', data);
    setEmail(data.memberId);
    setParams({ email: data.memberId, tenantUri: subdomain });
    setShouldRefetch(true);
  };

  const {
    register: registerPhone,
    control: controlPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: errorsPhone },
  } = useForm({
    resolver: yupResolver(validationSchemaPhone),
  });

  const onSubmitPhone = async data => {
    console.log(phone_format(data.phoneNumber));
    setPhone(phone_format(data.phoneNumber));
    setIsDisabled(true);
    setIsDisabledPhone(true);
    onLoginOtp({ phoneNumber: phone_format(data.phoneNumber) });
  };

  const onErrorPhone = (e: any) => {
    console.log('error', e);
  };

  const onErrorId = (e: any) => {
    console.log('error', e);
  };

  const {
    register: registerOtp,
    control: controlOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
  } = useForm({
    resolver: yupResolver(validationSchemaOtp),
  });
  const onSubmitOtp = data => {
    onLoginOtpVerification({ phoneNumber: phone, otpNumber: data.otp });
  };

  const onErrorOtp = (e: any) => {
    console.log('error', e);
    // setSmsFlag(false);
  };

  useEffect(() => {
    let timer;
    clearInterval(timer);
    if (isDisabledTimer) {
      timer = setInterval(() => {
        if (Number(sec) > 0) {
          setSec(Number(sec) - 1);
        }
        if (Number(sec) === 0) {
          if (Number(min) === 0) {
            //timer 종료
            // console.log('타이머 종료');
            setIsDisabledPhone(false);
            setIsDisabledOtp(true);
            setIsDisabled(false);
            clearInterval(timer);
            // onCheckTime();
          } else {
            setMin(Number(min) - 1);
            setSec(59);
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [min, sec]);

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

  useEffect(() => {
    refetch();
  }, [termsParams]);

  const onReply = function (typeCode: string, scrollType: DialogProps['scroll']) {
    setTermsParams({ type: typeCode });
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div className={cx('login-container')}>
      <p className="tw-text-3xl tw-font-bold tw-text-center tw-text-black tw-pb-10">회원가입</p>
      <form onSubmit={handleSubmitId(onSubmitId, onErrorId)}>
        <div className="tw-flex tw-items-center">
          <label htmlFor="name" className="tw-text-gray-700 tw-font-bold tw-w-40">
            이메일
          </label>
          <TextField
            sx={{
              marginTop: '5px',
              '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
            }}
            fullWidth
            id="memberId"
            name="memberId"
            {...registerId('memberId')}
            error={errorsId.memberId ? true : false}
            helperText={errorsId.memberId?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    className="tw-bg-blue-600"
                    disabled={isDisabledEmail}
                    onClick={() => handleSubmitId(onSubmitId)}
                  >
                    <Typography sx={{ fontSize: 12 }}>중복확인</Typography>
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </form>
      <form onSubmit={handleSubmitPhone(onSubmitPhone, onErrorPhone)}>
        <div className="tw-flex tw-items-center tw-mt-4">
          <label htmlFor="name" className="tw-text-gray-700 tw-font-bold tw-w-40">
            휴대폰번호
          </label>
          <TextField
            sx={{
              '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
            }}
            fullWidth
            type="tel"
            inputProps={{
              maxLength: 11,
            }}
            disabled={isDisabled}
            id="phoneNumber"
            name="phoneNumber"
            {...registerPhone('phoneNumber')}
            error={errorsPhone.phoneNumber ? true : false}
            helperText={errorsPhone.phoneNumber?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    className="tw-bg-blue-600"
                    disabled={isDisabledPhone}
                    onClick={() => handleSubmitPhone(onSubmitPhone)}
                  >
                    <Typography sx={{ fontSize: 12 }}>인증문자 발송</Typography>
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </form>
      {smsFlag && (
        <form onSubmit={handleSubmitOtp(onSubmitOtp, onErrorOtp)}>
          <div className="tw-flex tw-items-center tw-mt-4">
            <label htmlFor="name" className="tw-text-gray-700 tw-font-bold tw-w-[125px]">
              인증번호
            </label>
            <div className="tw-flex tw-items-center ">
              <TextField
                fullWidth
                sx={{
                  '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                }}
                label="인증번호"
                type="search"
                id="otp"
                name="otp"
                inputProps={{
                  maxLength: 6,
                }}
                {...registerOtp('otp')}
                error={errorsOtp.otp ? true : false}
                helperText={errorsOtp.otp?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        className="tw-bg-blue-600"
                        disabled={isDisabledOtp}
                        onClick={() => handleSubmitOtp(onSubmitOtp)}
                      >
                        <Typography sx={{ fontSize: 12 }}>인증하기</Typography>
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography
                className="tw-text-right"
                variant="h6"
                sx={{ fontWeight: '600', color: 'black', width: '70px' }}
              >
                {min}:{sec < 10 ? `0${sec}` : sec}
              </Typography>
            </div>
          </div>
        </form>
      )}
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="tw-flex tw-items-center">
          <label htmlFor="name" className="tw-text-gray-700 tw-font-bold tw-w-40">
            이름
          </label>
          <TextField
            sx={{
              marginTop: '15px',
              fontSize: 18,
              '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
            }}
            fullWidth
            required
            type="search"
            id="name"
            name="name"
            {...register('name')}
            error={errorsId.name ? true : false}
            helperText={errorsId.name?.message}
          />
        </div>
        <div className="tw-flex tw-items-center">
          <label htmlFor="name" className="tw-text-gray-700 tw-font-bold tw-w-40">
            비밀번호
          </label>
          <TextField
            sx={{
              marginTop: '15px',
              marginBottom: '10px',
              '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
            }}
            inputProps={{
              style: { borderBottomColor: '#e3e3e3 !important' },
            }}
            fullWidth
            type="password"
            id="password"
            name="password"
            {...register('password')}
            error={errors.password ? true : false}
            helperText={errors.password?.message}
          />
        </div>
        <div className="tw-flex tw-items-center tw-mt-2 tw-mb-5">
          <label htmlFor="name" className="tw-text-gray-700 tw-font-bold tw-w-40">
            비밀번호 확인
          </label>
          <TextField
            sx={{ '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' } }}
            // inputProps={{
            //   style: { border: '0px !important' },
            // }}
            fullWidth
            type="password"
            autoComplete="current-password"
            id="passwordConfirm"
            name="passwordConfirm"
            {...register('passwordConfirm')}
            error={errors.passwordConfirm ? true : false}
            helperText={errors.passwordConfirm?.message}
          />
        </div>

        <Divider variant="middle" sx={{ borderColor: 'rgba(0, 0, 0, 0.5);', margin: '40px 0px' }} />

        <p className="tw-text-xl tw-text-center tw-text-black tw-pb-10">
          <span className="tw-text-xl tw-text-left tw-text-black">이용 약관에 동의해주세요.</span>
        </p>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Box display="flex" justifyContent="flex-start">
              <FormGroup sx={{ fontWeight: 'bold' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="ALL"
                      onChange={onChangeAll}
                      checked={CheckList.length === IdList.length}
                      icon={<CheckBoxOutlineBlankOutlinedIcon />}
                      checkedIcon={<CheckBoxOutlinedIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={
                    <Typography variant="h6" sx={{ fontWeight: '600', color: 'black' }}>
                      전체 약관 동의
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
          </Grid>
        </Grid>
        <Divider variant="middle" sx={{ borderColor: 'rgba(0, 0, 0, 0.5);', margin: '20px 0px 20px 0px' }} />
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Box display="flex" justifyContent="flex-start">
              <FormGroup sx={{ fontWeight: 'bold' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={e => onChangeEach(e, IdList[0])}
                      checked={CheckList.includes(IdList[0])}
                      value={IdList[0]}
                      icon={<CheckBoxOutlineBlankOutlinedIcon />}
                      checkedIcon={<CheckBoxOutlinedIcon />}
                      ref={checkboxref}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13, color: 'black', fontWeight: '700 ' }}>
                      (필수) 서비스{' '}
                      <span
                        className="tw-underline tw-cursor-pointer"
                        onClick={() => {
                          onReply('0001', 'paper');
                        }}
                      >
                        이용약관
                      </span>{' '}
                      동의
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
          </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Box display="flex" justifyContent="flex-start">
              <FormGroup sx={{ fontWeight: 'bold' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={e => onChangeEach(e, IdList[1])}
                      checked={CheckList.includes(IdList[1])}
                      value={IdList[1]}
                      icon={<CheckBoxOutlineBlankOutlinedIcon />}
                      checkedIcon={<CheckBoxOutlinedIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13, color: 'black', fontWeight: '700 ' }}>
                      (필수){' '}
                      <span
                        className="tw-underline tw-cursor-pointer"
                        onClick={() => {
                          onReply('0002', 'paper');
                        }}
                      >
                        개인정보 처리 방침
                      </span>
                      에 동의
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
          </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Box display="flex" justifyContent="flex-start">
              <FormGroup sx={{ fontWeight: 'bold' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={e => onChangeMarketingAll(e, IdList[2])}
                      checked={CheckMarketingList.length >= 1}
                      value={IdList[2]}
                      icon={<CheckBoxOutlineBlankOutlinedIcon />}
                      checkedIcon={<CheckBoxOutlinedIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13, color: 'black', fontWeight: '700 ' }}>
                      (선택) 이벤트 등 프로모션 알림 수신
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" sx={{ marginLeft: 4 }}>
          <Grid item xs={4}>
            <Box display="flex">
              <FormGroup sx={{ fontWeight: 'bold' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={e => onChangeMarketingEach(e, marketingList[0])}
                      checked={CheckMarketingList.includes(marketingList[0])}
                      value={marketingList[0]}
                      icon={<CheckBoxOutlineBlankOutlinedIcon />}
                      checkedIcon={<CheckBoxOutlinedIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={<Typography sx={{ fontSize: 13, color: 'black', fontWeight: '700 ' }}>이메일 수신</Typography>}
                />
              </FormGroup>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="flex-start" sx={{ fontWeight: 'bold' }}>
              <FormGroup sx={{ fontWeight: 'bold' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={e => onChangeMarketingEach(e, marketingList[1])}
                      checked={CheckMarketingList.includes(marketingList[1])}
                      value={marketingList[1]}
                      icon={<CheckBoxOutlineBlankOutlinedIcon />}
                      checkedIcon={<CheckBoxOutlinedIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={<Typography sx={{ fontSize: 13, color: 'black', fontWeight: '700 ' }}>문자 수신</Typography>}
                />
              </FormGroup>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="flex-start" sx={{ fontWeight: 'bold' }}>
              <FormGroup sx={{ fontWeight: 'bold' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={e => onChangeMarketingEach(e, marketingList[2])}
                      checked={CheckMarketingList.includes(marketingList[2])}
                      value={marketingList[2]}
                      icon={<CheckBoxOutlineBlankOutlinedIcon />}
                      checkedIcon={<CheckBoxOutlinedIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13, color: 'black', fontWeight: '700 ' }}>카카오톡 수신</Typography>
                  }
                />
              </FormGroup>
            </Box>
          </Grid>
        </Grid>
        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
          <button
            className={`${getButtonClass(tenantName)}  tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white`}
            onClick={() => handleSubmit(onSubmit, onError)}
          >
            회원가입
          </button>
        </div>
      </form>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        sx={{ maxHeight: '60vh', top: '22%', left: '0', overflowY: 'auto' }}
      >
        <DialogTitle id="scroll-dialog-title" sx={{ m: 0, p: 2, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>이용약관</Typography>
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
      </Dialog>
    </div>
  );
}

export default SignUpTemplate;

const paramsWithDefault = (params: any) => {
  const defaultParams: any = {
    type: '0001',
  };
  return {
    ...defaultParams,
    ...params,
  };
};
