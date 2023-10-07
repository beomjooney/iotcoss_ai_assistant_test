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
import Link from '@mui/material/Link';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContentText from '@mui/material/DialogContentText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import Divider from '@mui/material/Divider';
import { UseQueryResult } from 'react-query';
import { useTermsList } from 'src/services/account/account.queries';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useLoginOtp, useLoginOtpVerification, useLoginSignUp } from 'src/services/account/account.mutations';
import isURL from 'validator/lib/isURL';

interface SignUpTemplateProps {
  onSubmitLogin: () => void;
}

const cx = classNames.bind(styles);

export function SignUpTemplate({ onSubmitLogin }: SignUpTemplateProps) {
  const [open, setOpen] = React.useState(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDisabledPhone, setIsDisabledPhone] = useState<boolean>(false);
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
  const [smsSend, setSmsSend] = useState('인증문자 발송');
  const [allTerm, setAllTerm] = useState<boolean>(false);
  const [serviceTerm, setServiceTerm] = useState<boolean>(false);
  const [privateTerm, setPrivateTerm] = useState<boolean>(false);
  const [marketing, setMarketing] = useState<boolean>(false);
  const [email, setEmail] = useState<boolean>(false);
  const [kakao, setKakao] = useState<boolean>(false);
  const [snsFlag, setSnsFlag] = useState(false);
  const [sms, setSms] = useState<boolean>(false);
  const [urlError, setUrlError] = useState('');

  // ** SNS URL
  const [youtubeUrl, setYoutubeUrl] = useState();
  const [instagramUrl, setInstagramUrl] = useState();
  const [twitterUrl, setTitterUrl] = useState();
  const [linkedUrl, setLinked] = useState();
  const [facebookUrl, setFacebook] = useState();
  const [snsUrl, setSns] = useState();

  //** Fouse */
  const focusYoutube_Ref = useRef(null);
  const focusTwitter_Ref = useRef(null);
  const focusLinked_Ref = useRef(null);
  const focusFacebook_Ref = useRef(null);
  const focusInstargram_Ref = useRef(null);
  const focusSns_Ref = useRef(null);

  // ** Timer
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);

  const { mutate: onLoginSignUp } = useLoginSignUp();
  const { mutate: onLoginOtp, isSuccess } = useLoginOtp();
  const { mutate: onLoginOtpVerification, isSuccess: isVerification, data: resultData } = useLoginOtpVerification();

  const router = useRouter();

  const onSnsChange = e => {
    setSnsFlag(e.target.checked);
  };

  // 체크할 시 CheckList에 id 값 전체 넣기, 체크 해제할 시 CheckList에 빈 배열 넣기
  const onChangeAll = e => {
    setCheckList(e.target.checked ? IdList : []);
    setCheckMarketingList(e.target.checked ? marketingList : []);
    setAllTerm(e.target.checked);
    setServiceTerm(e.target.checked);
    setPrivateTerm(e.target.checked);
    setMarketing(e.target.checked);
    setEmail(e.target.checked);
    setSms(e.target.checked);
    setKakao(e.target.checked);
  };

  // 체크박스 전체 선택
  const onChangeMarketingAll = (e, id) => {
    setEmail(e.target.checked);
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
    console.log(id, e.target.checked);
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
    console.log(id, e.target.checked);
    if (id === 'email') {
      setEmail(e.target.checked);
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
    memberId: Yup.string().required('Email is required').email('Email is invalid'),
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

  const validationSchemaPhone = Yup.object().shape({
    phoneNumber: Yup.string().matches(phoneRegExp, '핸도폰 번호 입력이 잘못됬습니다.'),
  });

  const validationSchemaOtp = Yup.object().shape({
    otp: Yup.string()
      .required('otp is required')
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

  const urlPatternValidation = URL => {
    const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
    return regex.test(URL);
  };

  const onSubmit = data => {
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

    //youtube url check
    if ((isURL(data.youtubeUrl) && data.youtubeUrl.includes('youtube')) || data.youtubeUrl === '') {
    } else {
      setUrlError('youtube 주소가 유효하지 않습니다.');
      focusYoutube_Ref.current.focus();
      return;
    }

    if ((isURL(data.twitterUrl) && data.twitterUrl.includes('twitter')) || data.twitterUrl === '') {
    } else {
      setUrlError('twitter 주소가 유효하지 않습니다.');
      focusTwitter_Ref.current.focus();
      return;
    }

    if ((isURL(data.linkedUrl) && data.linkedUrl.includes('linked')) || data.linkedUrl === '') {
    } else {
      setUrlError('linked 주소가 유효하지 않습니다.');
      focusLinked_Ref.current.focus();
      return;
    }

    if ((isURL(data.facebookUrl) && data.facebookUrl.includes('facebook')) || data.facebookUrl === '') {
    } else {
      setUrlError('facebook 주소가 유효하지 않습니다.');
      focusFacebook_Ref.current.focus();
      return;
    }

    if ((isURL(data.instagramUrl) && data.instagramUrl.includes('instagram')) || data.instagramUrl === '') {
    } else {
      setUrlError('instagram 주소가 유효하지 않습니다.');
      focusInstargram_Ref.current.focus();
      return;
    }

    onLoginSignUp({
      // ...data,
      memberId: data.memberId,
      password: data.password,
      name: data.name,
      nickname: data.name,
      phoneNumber: phone,
      email: data.memberId,
      authenticatedYn: privateTerm,
      emailReceiveYn: email,
      smsReceiveYn: sms,
      kakaoReceiveYn: kakao,
      snsUrl: [
        data.youtubeUrl,
        data.twitterUrl,
        data.linkedUrl,
        data.facebookUrl,
        data.snsUrl,
        data.instagramUrl,
      ].filter(function (e) {
        return e === 0 || e;
      }),
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

  useEffect(() => {
    if (resultData) {
      setIsDisabledTimer(false);
      setIsDisabledPhone(true);
      setSmsSend('인증완료');
      setSmsFlag(false);
      setIsDisabled(true);
    }
  }, [resultData]);

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
      <div className={cx('logo-area')}>
        <img src="/assets/images/cm_CI_co_1000x225.png" alt="footer logo" width={162} className="img-fluid mb-3" />
        <p className={cx('logo-area__text')}>
          데브어스에<br></br> 오신 것을 환영합니다!
          <br />
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <TextField
          sx={{
            marginTop: '0px',
            marginBottom: '10px',
            fontSize: 18,
            '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
          }}
          fullWidth
          required
          label="이름"
          type="search"
          id="name"
          name="name"
          variant="standard"
          {...register('name')}
          error={errors.name ? true : false}
          helperText={errors.name?.message}
        />

        <TextField
          sx={{
            marginTop: '5px',
            marginBottom: '15px',
            '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
          }}
          label="이메일"
          fullWidth
          id="memberId"
          name="memberId"
          variant="standard"
          {...register('memberId')}
          error={errors.memberId ? true : false}
          helperText={errors.memberId?.message}
        />
      </form>
      <form onSubmit={handleSubmitPhone(onSubmitPhone, onErrorPhone)}>
        <Grid container spacing={3} direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={7.5}>
            <Box display="flex" justifyContent="flex-start">
              <TextField
                sx={{
                  '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                }}
                fullWidth
                label="휴대폰 번호"
                type="tel"
                inputProps={{
                  maxLength: 11,
                }}
                disabled={isDisabled}
                id="phoneNumber"
                name="phoneNumber"
                variant="standard"
                {...registerPhone('phoneNumber')}
                error={errorsPhone.phoneNumber ? true : false}
                helperText={errorsPhone.phoneNumber?.message}
              />
            </Box>
          </Grid>
          <Grid item xs={4.5}>
            <Box display="flex" justifyContent="flex-end" sx={{ fontWeight: 'bold', marginBottom: '-15px' }}>
              <Button disabled={isDisabledPhone} onClick={() => handleSubmitPhone(onSubmitPhone)}>
                <Typography sx={{ fontWeight: '500', fontSize: 14 }}>{smsSend}</Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      {smsFlag && (
        <form onSubmit={handleSubmitOtp(onSubmitOtp, onErrorOtp)}>
          <Grid
            container
            spacing={3}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ marginBottom: '0px', paddingTop: '0px' }}
          >
            <Grid item xs={6.5}>
              <Box display="flex" justifyContent="flex-start" sx={{ marginTop: '15px' }}>
                <TextField
                  sx={{
                    '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                  }}
                  fullWidth
                  label="인증번호"
                  type="search"
                  id="otp"
                  name="otp"
                  variant="standard"
                  inputProps={{
                    maxLength: 6,
                  }}
                  {...registerOtp('otp')}
                  error={errorsOtp.otp ? true : false}
                  helperText={errorsOtp.otp?.message}
                />
              </Box>
            </Grid>
            <Grid item xs={5.5}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  p: 1,
                  m: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  marginRight: 0,
                  paddingRight: 0,
                  marginBottom: '-15px',
                }}
              >
                <Button disabled={isDisabledOtp} onClick={() => handleSubmitOtp(onSubmitOtp)}>
                  <Typography sx={{ fontWeight: '500', fontSize: 14 }}>인증하기</Typography>
                </Button>
                <Typography variant="h6" sx={{ fontWeight: '600', color: 'black', mr: 2 }}>
                  {min}:{sec < 10 ? `0${sec}` : sec}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
      <form onSubmit={handleSubmit(onSubmit, onError)}>
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
          label="비밀번호"
          type="password"
          variant="standard"
          id="password"
          name="password"
          {...register('password')}
          error={errors.password ? true : false}
          helperText={errors.password?.message}
        />

        <TextField
          sx={{ marginBottom: '30px', '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' } }}
          // inputProps={{
          //   style: { border: '0px !important' },
          // }}
          fullWidth
          label="비밀번호 확인"
          type="password"
          autoComplete="current-password"
          variant="standard"
          id="passwordConfirm"
          name="passwordConfirm"
          {...register('passwordConfirm')}
          error={errors.passwordConfirm ? true : false}
          helperText={errors.passwordConfirm?.message}
        />

        <Box display="flex" justifyContent="flex-start" className="mb-0">
          <FormGroup sx={{ fontWeight: 'bold' }}>
            <FormControlLabel
              control={
                <Checkbox
                  value="sns"
                  onChange={onSnsChange}
                  checked={snsFlag}
                  icon={<CheckCircleOutlineIcon />}
                  checkedIcon={<CheckCircleOutlineIcon />}
                  sx={{
                    color: '#c7c7c7',
                    '& .MuiSvgIcon-root': { fontSize: 24 },
                  }}
                />
              }
              label={
                <Typography variant="h6" sx={{ fontWeight: '600', color: 'black' }}>
                  SNS 링크/공유하기
                </Typography>
              }
            />
          </FormGroup>
        </Box>

        {snsFlag && (
          <>
            <TextField
              sx={{
                marginTop: '0px',
                marginBottom: '10px',
                '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
              }}
              label="유튜브 주소를 입력해주세요."
              fullWidth
              id="filled-error-helper-text"
              inputRef={focusYoutube_Ref}
              name="website"
              variant="standard"
              {...register('youtubeUrl')}
            />

            <TextField
              sx={{
                marginTop: '0px',
                marginBottom: '10px',
                '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
              }}
              label="페이스북 주소를 입력해주세요."
              fullWidth
              inputRef={focusFacebook_Ref}
              id="facebookUrl"
              name="facebookUrl"
              variant="standard"
              {...register('facebookUrl')}
            />

            <TextField
              sx={{
                marginTop: '0px',
                marginBottom: '10px',
                '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
              }}
              label="인스타그램 주소를 입력해주세요."
              fullWidth
              inputRef={focusInstargram_Ref}
              id="instagramUrl"
              name="instagramUrl"
              variant="standard"
              {...register('instagramUrl')}
            />

            <TextField
              sx={{
                marginTop: '0px',
                marginBottom: '10px',
                '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
              }}
              label="트위터 주소 입력해주세요."
              fullWidth
              inputRef={focusTwitter_Ref}
              id="twitterUrl"
              name="twitterUrl"
              variant="standard"
              {...register('twitterUrl')}
            />

            <TextField
              sx={{
                marginTop: '0px',
                marginBottom: '10px',
                '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
              }}
              label="링크드인 주소를 입력해주세요."
              fullWidth
              inputRef={focusLinked_Ref}
              id="linkedUrl"
              name="linkedUrl"
              variant="standard"
              {...register('linkedUrl')}
            />

            <TextField
              sx={{
                marginTop: '0px',
                marginBottom: '30px',
                '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
              }}
              label="기타 SNS주소를 입력해주세요."
              fullWidth
              id="snsUrl"
              name="snsUrl"
              variant="standard"
              {...register('snsUrl')}
            />
          </>
        )}

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
                      icon={<CheckCircleOutlineIcon />}
                      checkedIcon={<CheckCircleOutlineIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={
                    <Typography variant="h6" sx={{ fontWeight: '600', color: 'black' }}>
                      전체 동의하기
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
          </Grid>
          <Box sx={{ marginLeft: 4, fontSize: 14, color: 'black' }}>
            전체동의는 선택목적에 대한 동의를 포함하고 있으며, 선택목적에 대한 동의를 거부해도 서비스 이용이 가능합니다.
          </Box>
        </Grid>
        <Divider variant="middle" sx={{ borderColor: 'rgba(0, 0, 0, 0.9);', margin: '20px 0px 10px 0px' }} />
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
                      icon={<CheckIcon />}
                      checkedIcon={<CheckIcon />}
                      ref={checkboxref}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>
                      [필수] 서비스 이용약관 동의
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" justifyContent="flex-end" sx={{ fontWeight: 'bold' }}>
              <Typography sx={{ fontSize: 14, textDecoration: 'underline' }} display="inline">
                <Link
                  href="#"
                  underline="always"
                  onClick={() => {
                    onReply('0001', 'paper');
                  }}
                >
                  약관보기
                </Link>
              </Typography>
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
                      icon={<CheckIcon />}
                      checkedIcon={<CheckIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>
                      [필수] 개인정보 수집 및 이용 동의
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" justifyContent="flex-end" sx={{ fontWeight: 'bold' }}>
              <Typography sx={{ fontSize: 14, textDecoration: 'underline' }} display="inline">
                <Link
                  href="#"
                  underline="always"
                  onClick={() => {
                    onReply('0002', 'paper');
                  }}
                >
                  약관보기
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider variant="middle" sx={{ borderColor: 'rgba(0, 0, 0, 0.9);', margin: '10px 0px 10px 0px' }} />

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
                      icon={<CheckIcon />}
                      checkedIcon={<CheckIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>
                      [선택] 이벤트 등 프로모션 알림 수신
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" justifyContent="flex-end" sx={{ fontWeight: 'bold' }}>
              <Typography sx={{ fontSize: 14, textDecoration: 'underline' }} display="inline">
                <Link
                  href="#"
                  underline="always"
                  onClick={() => {
                    onReply('0003', 'paper');
                  }}
                >
                  약관보기
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" sx={{ marginLeft: 4 }}>
          <Grid item xs={3}>
            <Box display="flex">
              <FormGroup sx={{ fontWeight: 'bold' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={e => onChangeMarketingEach(e, marketingList[0])}
                      checked={CheckMarketingList.includes(marketingList[0])}
                      value={marketingList[0]}
                      icon={<CheckIcon />}
                      checkedIcon={<CheckIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={<Typography sx={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>이메일</Typography>}
                />
              </FormGroup>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box display="flex" justifyContent="flex-start" sx={{ fontWeight: 'bold' }}>
              <FormGroup sx={{ fontWeight: 'bold' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={e => onChangeMarketingEach(e, marketingList[1])}
                      checked={CheckMarketingList.includes(marketingList[1])}
                      value={marketingList[1]}
                      icon={<CheckIcon />}
                      checkedIcon={<CheckIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={<Typography sx={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>SMS</Typography>}
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
                      icon={<CheckIcon />}
                      checkedIcon={<CheckIcon />}
                      sx={{
                        color: '#c7c7c7',
                        '& .MuiSvgIcon-root': { fontSize: 24 },
                      }}
                    />
                  }
                  label={<Typography sx={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>카카오톡</Typography>}
                />
              </FormGroup>
            </Box>
          </Grid>
        </Grid>
        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
          <Button size="medium" onClick={() => handleSubmit(onSubmit)}>
            <Typography sx={{ fontWeight: '600', fontSize: 14 }}>커리어멘토스 가입하기</Typography>
          </Button>
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
