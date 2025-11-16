import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Button } from '../../../stories/components';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
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
import CloseIcon from '@mui/icons-material/Close';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import { UseQueryResult } from 'react-query';
import { useIdVerification, useTermsList } from 'src/services/account/account.queries';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  useLoginOtp,
  useLoginOtpVerification,
  useLoginSignUp,
  useEmainJoinSend,
} from 'src/services/account/account.mutations';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { getFirstSubdomain } from 'src/utils/date';
import { useSessionStore } from '../../../store/session';
import { getButtonClass } from 'src/utils/clubStatus';
import { IconButton, InputAdornment, tabClasses } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface CompanySignUpTemplateProps {
  onSubmitLogin: () => void;
}

const cx = classNames.bind(styles);

export function CompanySignUpTemplate({ title = '', onSubmitLogin }: CompanySignUpTemplateProps) {
  const { tenantName, tenantUri, registrationAuthenticationType } = useSessionStore.getState();
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
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleClickShowPassword1 = () => setShowPassword1(show => !show);

  // ** Timer
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('1');
  const [params, setParams] = useState<any>({ email });
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [companyPosition, setCompanyPosition] = useState('');
  const [companyDepartment, setCompanyDepartment] = useState('');

  const { mutate: onLoginSignUp, isSuccess: isSignUpSuccess, data: signUpData } = useLoginSignUp();
  const { mutate: onLoginOtp, isSuccess } = useLoginOtp();
  const { mutate: onLoginOtpVerification, isSuccess: isVerification, data: resultData } = useLoginOtpVerification();
  const { mutate: onEmainSend, isSuccess: isEmainSendSuccess, data: loginData } = useEmainJoinSend();

  const [clientTenantName, setClientTenantName] = useState(null);
  useEffect(() => {
    // 클라이언트에서만 tenantName을 설정
    setClientTenantName(tenantName);
  }, []);

  useEffect(() => {
    if (isEmainSendSuccess) {
      alert('이메일 인증 메일이 발송되었습니다.');
    }
  }, [isEmainSendSuccess]);

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
      // setIsDisabledEmail(true);
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

  // const validationSchema = Yup.object().shape({
  //   name: Yup.string().min(2, 'Must be more than one character').required('Username is required'),
  //   // memberId: Yup.string().required('Email is required').email('Email is invalid'),
  //   password: Yup.string()
  //     .required('Password is required')
  //     .min(4, 'Password must be at least 4 characters')
  //     .max(20, 'Password must not exceed 20 characters'),
  //   passwordConfirm: Yup.string()
  //     .required('Password is required')
  //     .min(4, 'Password must be at least 4 characters')
  //     .max(20, 'Password must not exceed 20 characters')
  //     .oneOf([Yup.ref('password')], 'Passwords do not match'),
  //   website: Yup.string().matches(
  //     /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
  //     'Enter correct url!',
  //   ),
  // });

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, '2자 이상 입력해주세요').required('이름은 필수 항목입니다.'),
    companyName: Yup.string().min(2, '2자 이상 입력해주세요').required('기업이름은 필수 항목입니다.'),
    // memberId: Yup.string().required('Email is required').email('Email is invalid'),
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
    mode: 'onChange',
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
    } else if (registrationAuthenticationType === '0100' && !isDisabled) {
      alert('본인인증을 해주세요.');
      return;
    }

    if (registrationAuthenticationType === '0100') {
      if (resultData.token === null) {
        alert('인증번호를 인증해주세요.');
        return;
      }
    }

    if (data.name.length > 100) {
      alert('이름은 100자를 초과할 수 없습니다.');
      return;
    }

    setPassword(data.password);

    // Conditionally add the token parameter if registrationAuthenticationType is '0100'
    console.log('registrationAuthenticationType', registrationAuthenticationType);
    if (registrationAuthenticationType === '0100') {
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
        token: resultData.token,
        kakaoReceiveYn: kakao,
        tenantUri: tenantUri,
      });
    } else {
      console.log('registrationAuthenticationType', registrationAuthenticationType);
      onEmainSend({
        email: email,
        name: data.name,
        password: data.password,
        phoneNumber: phone,
        agreedTermsIds: ['service1', 'privacy1'],
        emailReceiveYn: email1,
        smsReceiveYn: sms,
        kakaoReceiveYn: kakao,
        tenantUri: tenantUri,
        memberType: '1003',
        companyName: data.companyName,
        department: data.companyDepartment,
        title: data.companyPosition,
      });
      setStep('2');
    }
  };

  const onEmainSendHandler = data => {
    onEmainSend({
      email: email,
      name: data.name,
      password: password,
      name: name,
      phoneNumber: phone,
      agreedTermsIds: ['service1', 'privacy1'],
      emailReceiveYn: email1,
      smsReceiveYn: sms,
      kakaoReceiveYn: kakao,
      tenantUri: tenantUri,
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
    setParams({ email: data.memberId, tenantUri: tenantUri });
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
    console.log('typeCode', typeCode);
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
    <div className={cx('login-container', 'max-sm:tw-p-7 sm:tw-p-20')}>
      {step === '1' ? (
        <>
          <p className="tw-text-3xl tw-font-semibold tw-text-center tw-text-black tw-pb-14">기업회원 회원가입</p>
          <form onSubmit={handleSubmitId(onSubmitId, onErrorId)}>
            <div className="tw-flex tw-items-center tw-justify-start">
              <label htmlFor="name" className="tw-text-black tw-w-40">
                이메일
              </label>
              <TextField
                sx={{
                  width: '100%',
                  '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                }}
                fullWidth
                id="memberId"
                size="small"
                name="memberId"
                {...registerId('memberId')}
                error={errorsId.memberId ? true : false}
                helperText={errorsId.memberId?.message}
                onChange={e => {
                  setIsDisabledEmail(false);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        className="tw-bg-blue-600 tw-ml-2 tw-h-8"
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
          {registrationAuthenticationType === '0100' && (
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
                  size="small"
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
          )}
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
                    size="small"
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
            <div className="tw-flex tw-items-center tw-mt-5">
              <label htmlFor="name" className="tw-text-black tw-w-40">
                이름
              </label>
              <TextField
                sx={{
                  fontSize: 18,
                  '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                }}
                fullWidth
                size="small"
                required
                type="search"
                id="name"
                name="name"
                {...register('name')}
                error={errors.name ? true : false}
                helperText={errors.name?.message}
              />
            </div>
            <div className="tw-flex tw-items-center">
              <label htmlFor="name" className="tw-text-black tw-w-40">
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
                size="small"
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
            <div className="tw-flex tw-items-center tw-mt-2 tw-mb-5">
              <label htmlFor="name" className="tw-text-black tw-w-40">
                비밀번호 확인
              </label>
              <TextField
                sx={{ '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' } }}
                fullWidth
                type={showPassword1 ? 'text' : 'password'}
                size="small"
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
            <div className="tw-flex tw-items-center tw-mt-5">
              <label htmlFor="name" className="tw-text-black tw-w-40">
                기업이름
              </label>
              <TextField
                sx={{
                  fontSize: 18,
                  '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                }}
                fullWidth
                size="small"
                required
                type="search"
                id="companyName"
                name="companyName"
                {...register('companyName')}
                error={errors.companyName ? true : false}
                helperText={errors.companyName?.message}
              />
            </div>
            <div className="tw-flex tw-items-center tw-mt-5">
              <label htmlFor="name" className="tw-text-black tw-w-40">
                부서<span className="tw-text-gray-500">(선택)</span>
              </label>
              <TextField
                sx={{
                  fontSize: 18,
                  '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                }}
                fullWidth
                size="small"
                type="search"
                id="companyDepartment"
                name="companyDepartment"
                {...register('companyDepartment')}
                error={errors.companyDepartment ? true : false}
                helperText={errors.companyDepartment?.message}
              />
            </div>
            <div className="tw-flex tw-items-center tw-mt-5">
              <label htmlFor="name" className="tw-text-black tw-w-40">
                직책<span className="tw-text-gray-500">(선택)</span>
              </label>
              <TextField
                sx={{
                  fontSize: 18,
                  '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                }}
                fullWidth
                size="small"
                type="search"
                id="companyPosition"
                name="companyPosition"
                {...register('companyPosition')}
                error={errors.companyPosition ? true : false}
                helperText={errors.companyPosition?.message}
              />
            </div>

            <Divider variant="middle" sx={{ borderColor: 'rgba(0, 0, 0, 0.5);', margin: '40px 0px' }} />

            <p className="tw-text-xl tw-text-center tw-text-black tw-pb-10">
              <span className="tw-text-xl tw-text-left tw-text-black">DevUs 이용 약관에 동의해주세요.</span>
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
                      label={<Typography sx={{ fontSize: 13, color: 'black', fontWeight: '700 ' }}>이메일</Typography>}
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
                      label={<Typography sx={{ fontSize: 13, color: 'black', fontWeight: '700 ' }}>문자</Typography>}
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
                        <Typography sx={{ fontSize: 13, color: 'black', fontWeight: '700 ' }}>카카오톡</Typography>
                      }
                    />
                  </FormGroup>
                </Box>
              </Grid>
            </Grid>
            <div style={{ marginBottom: '10px', marginTop: '40px' }}>
              <button
                className={`tw-bg-black tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white`}
                onClick={() => handleSubmit(onSubmit, onError)}
              >
                회원가입
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className={cx('logo-area')}>
          <div className="tw-flex tw-flex-col tw-items-center tw-mt-40">
            <svg className="tw-h-14 tw-w-14" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28.9992 57.8002C44.905 57.8002 57.7992 44.906 57.7992 29.0002C57.7992 13.0944 44.905 0.200195 28.9992 0.200195C13.0934 0.200195 0.199219 13.0944 0.199219 29.0002C0.199219 44.906 13.0934 57.8002 28.9992 57.8002ZM42.3448 24.3458C43.7507 22.9399 43.7507 20.6605 42.3448 19.2546C40.9389 17.8487 38.6595 17.8487 37.2536 19.2546L25.3992 31.109L20.7448 26.4546C19.3389 25.0487 17.0595 25.0487 15.6536 26.4546C14.2477 27.8605 14.2477 30.1399 15.6536 31.5458L22.8536 38.7458C24.2595 40.1517 26.5389 40.1517 27.9448 38.7458L42.3448 24.3458Z"
                fill="#34D399"
              ></path>
            </svg>
            <div className="tw-mt-6 tw-text-center tw-text-xl tw-font-bold">
              <p className="tw-flex tw-flex-col">
                <span className="tw-text-blue-500">{email}</span>
                <span>으로 안내 메일을 발송하였습니다.</span>
              </p>
            </div>
          </div>

          <div className="tw-mx-4 tw-sm:mx-0 tw-my-10 tw-flex tw-flex-col tw-items-center ">
            <div className="tw-w-full tw-rounded-md tw-bg-gray-50 tw-p-4 tw-dark:bg-gray-700/50 ">
              <p className="tw-text-center tw-text-sm ">
                <p>인증 메일은 발송 시점으로부터 24시간 동안 유효하며, 재발송시 기존 인증은 만료됩니다.</p>
                <p>반드시 마지막에 수신된 메일을 확인 바랍니다.</p>
                <br />
                <p>* 서비스에 따라 스팸으로 분류되어 있을 수 있습니다.</p>
                <p>스팸함도 꼭 확인해 주시기 바랍니다.</p>
              </p>
            </div>

            <div className="tw-mt-7 tw-flex tw-justify-center tw-gap-4">
              <button
                className="tw-px-5 border tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-black"
                onClick={() => (location.href = '/account/company-login')}
              >
                로그인
              </button>
              <button
                className="tw-px-5 border tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-black"
                onClick={onEmainSendHandler}
              >
                인증 메일 재발송
              </button>
            </div>
          </div>
        </div>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        sx={{ maxHeight: '60vh', top: '22%', left: '0', overflowY: 'auto' }}
      >
        <DialogTitle id="scroll-dialog-title" sx={{ m: 0, p: 2, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>{termList?.title}</Typography>
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

export default CompanySignUpTemplate;

const paramsWithDefault = (params: any) => {
  const defaultParams: any = {
    type: '0001',
  };
  return {
    ...defaultParams,
    ...params,
  };
};
