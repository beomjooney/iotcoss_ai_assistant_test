import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Button, Modal } from 'src/stories/components';
import { useStore } from 'src/store';
import React, { useEffect, useRef, useState } from 'react';
import {
  useDeleteMember,
  useEditUser,
  useLoginOtp,
  useLoginOtpVerification,
  useChangePhone,
  useChangePassword,
  useUserUpdate,
} from 'src/services/account/account.mutations';
import { useUploadImage } from 'src/services/image/image.mutations';
import { usePersonalInfo, useTermsList } from 'src/services/account/account.queries';
import { useSessionStore } from 'src/store/session';
import Typography from '@mui/material/Typography';
import _TextField from '@mui/material/TextField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { UseQueryResult } from 'react-query';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { makeStyles } from '@mui/styles';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';

import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { is } from 'ramda';
const cx = classNames.bind(styles);

export function MemberEditTemplate() {
  const [selectedJobName, setSelectedJobName] = useState('');
  const [open, setOpen] = React.useState(false);
  const { user, setUser } = useStore();
  const { memberId } = useSessionStore.getState();
  const [userInfo, setUserInfo] = useState<any>(user);
  const [nickname, setNickname] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [phoneEditMode, setPhoneEditMode] = useState(false);
  const [emailReceiveYn, setEmailReceiveYn] = useState(true);
  const [smsReceiveYn, setSmsReceiveYn] = useState(true);
  const [kakaoReceiveYn, setKakaoReceiveYn] = useState(true);
  const [edting, setEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [fileImageUrl, setFileImageUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [smsFlag, setSmsFlag] = useState(false);
  const [isDisabledPhone, setIsDisabledPhone] = useState<boolean>(false);
  const [isDisabledOtp, setIsDisabledOtp] = useState<boolean>(true);
  const [isDisabledTimer, setIsDisabledTimer] = useState<boolean>(true);
  const [termsParams, setTermsParams] = useState<any>({ type: '0001' });

  const [previousPassword, setPreviousPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ** Timer
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [email, setEmail] = useState<boolean>(false);
  const [kakao, setKakao] = useState<boolean>(false);
  const [snsFlag, setSnsFlag] = useState(false);
  const [sms, setSms] = useState<boolean>(false);
  const [urlError, setUrlError] = useState('');
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [universityCode, setUniversityCode] = useState<string>('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedUniversityName, setSelectedUniversityName] = useState<string>('');
  const [jobs, setJobs] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [recommendLevels, setRecommendLevels] = useState('');
  const [jobLevelName, setJobLevelName] = useState([]);
  const [passwordFlag, setPasswordFlag] = useState(false);
  const [email1, setEmail1] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleClickShowPassword1 = () => setShowPassword1(show => !show);
  const handleClickShowPassword2 = () => setShowPassword2(show => !show);

  // 유저 정보 조회
  usePersonalInfo({}, user => {
    console.log(user);
    setUserInfo(user);
    console.log(user);
  });

  const { mutate: onEditUser, status } = useEditUser();
  const { mutate: onSaveImage, data: imageUrl, isSuccess: imageSuccess } = useUploadImage();
  const { mutate: onDeleteMember } = useDeleteMember();

  //otp
  const { mutate: onLoginOtp, isSuccess } = useLoginOtp();
  const { mutate: onLoginOtpVerification, isSuccess: isVerification, data: resultData } = useLoginOtpVerification();
  const { mutate: onChangePhone, isSuccess: isSuccessChangePhone } = useChangePhone();
  const {
    mutate: onChangePassword,
    isSuccess: isSuccessChangePassword,
    data: dataChangePassword,
  } = useChangePassword();
  const { mutate: onUserUpdate, isSuccess: isSuccessUserUpdate } = useUserUpdate();

  useEffect(() => {
    if (isSuccessChangePassword) {
      const { responseCode, message } = dataChangePassword as { responseCode: string; message: string };
      if (responseCode === '0000') {
        alert('비밀번호 변경이 완료되었습니다.');
        setPasswordFlag(false);
        reset({ password: '', passwordConfirm: '' });
        setPreviousPassword('');
      } else if (responseCode === '0401') {
        alert(`error : 현재 비밀번호가 올바르지 않습니다`);
      } else {
        alert(`error : [${responseCode}] ${message}`);
      }
    }
  }, [isSuccessChangePassword]);

  useEffect(() => {
    if (resultData) {
      if (resultData.result === true) {
        console.log('inner');
        setSmsFlag(false);
        setIsDisabledTimer(false);
        setPhoneEditMode(false);
        onChangePhone({ phoneNumber: phoneNumber, token: resultData?.token });
      }
    }
  }, [resultData]);

  useEffect(() => {
    if (isSuccess) {
      setIsDisabledOtp(false);
      setIsDisabledTimer(true);
      setMin(3);
      setSmsFlag(true);
      setIsDisabledPhone(true);
    }
  }, [isSuccess]);

  function handlePhoneNumber(value) {
    setPhoneNumber(formatPhoneNumber(value));
  }

  const handleRecommendLevels = (event, newValue) => {
    console.log(newValue);
    if (newValue !== null) {
      const selectedLevel = userInfo?.jobLevelOptions?.find(item => item.code === newValue);
      if (selectedLevel) {
        setRecommendLevels(selectedLevel.code);
        setJobLevelName(selectedLevel.name);
      }
    }
  };

  //** Fouse */
  const checkboxref = useRef(null);

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
  const handlePasswordChange1 = value => {
    setPreviousPassword(value);
  };

  const handleSubmit = () => {
    updateMemberInfo();
  };

  const [agreements, setAgreements] = useState({
    all: false,
    service: false,
    privacy: false,
    promotions: false,
    email: false,
    sms: false,
    kakao: false,
  });

  const handleChange = key => {
    setAgreements(prev => {
      const newAgreements = { ...prev, [key]: !prev[key] };

      // "전체 약관 동의"가 클릭되면 모든 항목을 업데이트
      if (key === 'all') {
        const isAllChecked = !prev.all;
        return {
          all: isAllChecked,
          service: isAllChecked,
          privacy: isAllChecked,
          promotions: isAllChecked,
          email: isAllChecked,
          sms: isAllChecked,
          kakao: isAllChecked,
        };
      }

      // "프로모션 알림 수신"이 변경될 때 이메일, 문자, 카카오 상태를 업데이트
      if (key === 'promotions') {
        if (newAgreements.promotions) {
          newAgreements.email = true;
          newAgreements.sms = true;
          newAgreements.kakao = true;
        } else {
          newAgreements.email = false;
          newAgreements.sms = false;
          newAgreements.kakao = false;
        }
      }

      // 이메일, 문자, 카카오 중 하나라도 체크되면 "프로모션 알림 수신" 체크
      if (['email', 'sms', 'kakao'].includes(key)) {
        newAgreements.promotions = newAgreements.email || newAgreements.sms || newAgreements.kakao;
      }

      // "전체 약관 동의" 업데이트
      newAgreements.all =
        newAgreements.service &&
        newAgreements.privacy &&
        newAgreements.promotions &&
        newAgreements.email &&
        newAgreements.sms &&
        newAgreements.kakao;

      return newAgreements;
    });
  };

  const handleDeleteSubmit = () => {
    // 이미지 변경 안한 경우 정보만 변경
    setIsModalOpen(false);
    onDeleteMember(memberId);
  };

  const updateMemberInfo = () => {
    console.log(email1, sms, kakao);
    const profileImageUrl = imageUrl ? imageUrl.toString().slice(1) : user?.profileImageUrl;
    const params = {
      // ...userInfo,
      jobGroup: universityCode,
      jobLevel: recommendLevels,
      job: selectedJob,
      isEmailReceive: agreements.email,
      isSmsReceive: agreements.sms,
      isKakaoReceive: agreements.kakao,
      agreedTermsIds: ['service1', 'privacy1', ...(agreements.promotions ? ['promotion1'] : [])],
    };

    console.log(params);
    // if (checkMandatoryTerms(CheckList)) {
    if (agreements.privacy && agreements.service) {
      onUserUpdate(params);
    } else {
      alert('필수 약관을 체크해주세요');
    }
    // }
  };

  // 이미지 업로드 완료 시 최종 정보 수정
  if (imageSuccess && edting) {
    setEditing(false);
    updateMemberInfo();
  }

  function formatPhoneNumber(value) {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,4})?(\d{0,4})?$/);
    if (match) {
      const intlCode = match[1] ? `${match[1]}` : '';
      const middle = match[2] ? `-${match[2]}` : '';
      const last = match[3] ? `-${match[3]}` : '';
      return `${intlCode}${middle}${last}`;
    }
    return value;
  }

  useEffect(() => {
    setNickname(userInfo?.personalInfo?.nickname);
    setPhoneNumber(formatPhoneNumber(userInfo?.personalInfo?.phoneNumber));
    setSelectedUniversityName(userInfo?.personalInfo?.jobGroup?.name);
    const selected = userInfo?.jobOptions?.find(u => u.code === userInfo?.personalInfo?.jobGroup?.code);
    setJobs(selected ? selected.jobs : []);
    setUniversityCode(userInfo?.personalInfo?.jobGroup?.code);
    setSelectedJob(userInfo?.personalInfo?.job?.code);

    console.log(selected);

    const serviceAgreement =
      userInfo?.personalInfo?.termsAgreed.find(term => term.termsType === '0001')?.isAgreed || false;
    const privacyAgreement =
      userInfo?.personalInfo?.termsAgreed.find(term => term.termsType === '0002')?.isAgreed || false;
    const promotionsAgreement =
      userInfo?.personalInfo?.termsAgreed.find(term => term.termsType === '0003')?.isAgreed || false;

    setAgreements({
      all:
        serviceAgreement &&
        privacyAgreement &&
        promotionsAgreement &&
        userInfo?.personalInfo?.isEmailReceive &&
        userInfo?.personalInfo?.isSmsReceive &&
        userInfo?.personalInfo?.isKakaoReceive,
      service: serviceAgreement,
      privacy: privacyAgreement,
      promotions: promotionsAgreement,
      email: userInfo?.personalInfo?.isEmailReceive,
      sms: userInfo?.personalInfo?.isSmsReceive,
      kakao: userInfo?.personalInfo?.isKakaoReceive,
    });

    setRecommendLevels(userInfo?.personalInfo?.jobLevel?.code || '');
  }, [userInfo]);

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

  const validationSchemaOtp = Yup.object().shape({
    otp: Yup.string()
      .required('인증번호를 입력해주세요.')
      .matches(/^[0-9]+$/, 'Must be only number')
      .min(6, 'Must be exactly 6 number')
      .max(6, 'Must be exactly 6 number'),
  });

  const {
    register: registerOtp,
    control: controlOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
  } = useForm({
    resolver: yupResolver(validationSchemaOtp),
  });

  const onSubmitOtp = data => {
    onLoginOtpVerification({ phoneNumber: phoneNumber, otpNumber: data.otp });
  };

  const onErrorOtp = (e: any) => {
    console.log('error', e);
    // setSmsFlag(false);
  };

  const handleJobChange = e => {
    setSelectedJob(e.target.value);
    const selectedCode = e.target.value;
    const selected = jobs?.find(u => u.code === selectedCode);
    setSelectedJobName(selected ? selected.name : '');
  };

  const handleUniversityChange = e => {
    const selectedCode = e.target.value;
    const selected = userInfo?.jobOptions?.find(u => u.code === selectedCode);
    console.log(selectedCode, selected);
    setUniversityCode(selectedCode);
    setSelectedUniversity(selectedCode);
    setSelectedUniversityName(selected ? selected.name : '');
    setJobs(selected ? selected.jobs : []);
    setSelectedJob(''); // Clear the selected job when university changes
  };

  const handlePasswordChangeCancel = () => {
    console.log('password change');
    setPasswordFlag(false);
  };
  const handlePasswordChange = () => {
    console.log('password change');
    setPasswordFlag(true);
  };
  const handlePasswordChangeSubmit = () => {
    console.log('password change');
    // Add your password change logic here
    if (newPassword === confirmPassword) {
      // Password change logic
      console.log('Password changed successfully');
      onChangePassword({
        currentPassword: previousPassword,
        newPassword: newPassword,
        newPasswordConfirm: confirmPassword,
      });
    } else {
      alert('새 비밀번호와 이전 비밀번호가 일치하지 않습니다.');
    }
  };

  const useStyles = makeStyles(theme => ({
    selected: {
      '&&': {
        backgroundColor: '#000',
        color: 'white',
      },
    },
  }));

  const classes = useStyles();

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
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
    handleSubmit: handleSubmitPassworld,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onError = (e: any) => {
    console.log('error', e);
  };

  const onSubmit = data => {
    console.log(data, previousPassword);
    onChangePassword({
      currentPassword: previousPassword,
      newPassword: data.password,
      newPasswordConfirm: data.passwordConfirm,
    });
  };

  return (
    <div className={cx('member-edit-container tw-py-4')}>
      <div className={cx('sub-content', 'border', 'tw-rounded-lg', 'tw-mt-5', 'tw-text-center')}>
        <div className="tw-p-10 tw-pb-0 tw-text-black tw-text-base tw-font-semibold">
          <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              {userInfo?.personalInfo?.email ? '이메일' : '학번'}
            </Grid>
            <Grid item xs={8}>
              <div className="tw-text-left tw-font-medium">
                {userInfo?.personalInfo?.email || userInfo?.personalInfo?.memberId}
              </div>
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              비밀번호
            </Grid>
            <Grid item xs={8}>
              <div className="tw-text-left tw-flex tw-text-base tw-gap-3">
                <TextField size="small" disabled id="outlined-disabled" value="sdfasdfasdf" type="password" />
                {passwordFlag ? (
                  <button
                    onClick={handlePasswordChangeCancel}
                    className="border tw-text-gray-500 tw-rounded tw-px-4 tw-py-1 tw-text-sm tw-font-medium"
                  >
                    취소하기
                  </button>
                ) : (
                  <button
                    onClick={handlePasswordChange}
                    className="border tw-text-gray-500 tw-rounded tw-px-4 tw-py-1 tw-text-sm tw-font-medium"
                  >
                    변경하기
                  </button>
                )}
              </div>
            </Grid>
          </Grid>
          {passwordFlag && (
            <>
              <form onSubmit={handleSubmitPassworld(onSubmit, onError)}>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-pt-3">
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2} className="tw-text-left">
                    이전비밀번호
                  </Grid>
                  <Grid item xs={8}>
                    <div className="tw-text-left tw-flex tw-text-base tw-gap-3">
                      <TextField
                        onChange={e => handlePasswordChange1(e.target.value)}
                        size="small"
                        id="outlined-disabled"
                        value={previousPassword}
                        type={showPassword ? 'text' : 'password'}
                        sx={{
                          width: '220px',
                          marginTop: '15px',
                          marginBottom: '10px',
                          '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                                aria-label="toggle password visibility"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>

                <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-pb-3">
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2} className="tw-text-left">
                    새비밀번호
                  </Grid>
                  <Grid item xs={8}>
                    <div className="tw-text-left tw-flex tw-text-base tw-gap-3">
                      <TextField
                        size="small"
                        sx={{
                          width: '220px',
                          marginTop: '15px',
                          marginBottom: '10px',
                          '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                        }}
                        inputProps={{
                          style: { borderBottomColor: '#e3e3e3 !important' },
                        }}
                        fullWidth
                        type={showPassword1 ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword1}
                                edge="end"
                                aria-label="toggle password visibility"
                              >
                                {showPassword1 ? <VisibilityOff /> : <Visibility />}
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
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2} className="tw-text-left">
                    비밀번호 확인
                  </Grid>
                  <Grid item xs={8}>
                    <div className="tw-text-left tw-flex tw-text-base tw-gap-3">
                      <TextField
                        size="small"
                        sx={{ width: '220px', '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' } }}
                        // inputProps={{
                        //   style: { border: '0px !important' },
                        // }}
                        fullWidth
                        type={showPassword2 ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword2}
                                edge="end"
                                aria-label="toggle password visibility"
                              >
                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
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
                      <button
                        // onClick={handlePasswordChangeSubmit}
                        onClick={() => {
                          console.log('click');
                          handleSubmitPassworld(onSubmit);
                        }}
                        className="border tw-text-gray-500 tw-rounded tw-px-4 tw-py-1 tw-h-[38px] tw-text-sm tw-font-medium"
                      >
                        변경하기
                      </button>
                    </div>
                  </Grid>
                </Grid>
              </form>
            </>
          )}
          <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              이름
            </Grid>
            <Grid item xs={8}>
              <div className="tw-text-left tw-font-medium">{userInfo?.personalInfo?.name || ''}</div>
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left ">
              휴대전화
            </Grid>
            <Grid item xs={8}>
              <div className="tw-text-left tw-flex tw-text-base tw-gap-3">
                {/* {phoneNumber !== userInfo.phoneNumber && !phoneEditMode && <span className={cx('change-dot')} />} */}
                <TextField
                  size="small"
                  value={phoneNumber || ''}
                  disabled={isDisabledPhone}
                  onChange={e => handlePhoneNumber(e.target.value)}
                  inputProps={{ readOnly: isDisabledPhone, maxLength: 13 }} // 13 is the maximum length for phone numbers with format xxx-xxxx-xxxx
                  className={cx('text-field', 'text-field--normal')}
                />

                <Button
                  className="border !tw-text-sm !tw-px-4 tw-py-1 tw-font-medium tw-text-gray-500 "
                  type="button"
                  color="white"
                  disabled={false}
                  onClick={() => {
                    if (phoneNumber === '') {
                      alert('핸드폰 번호를 입력해주세요');
                    } else {
                      onLoginOtp({ phoneNumber: phoneNumber });
                    }
                  }}
                >
                  {phoneEditMode ? '인증문자 발송' : '변경하기'}
                </Button>
              </div>
            </Grid>

            <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-5">
              <Grid item xs={2}></Grid>
              <Grid item xs={2} className="tw-text-left">
                {smsFlag && '인증번호'}
              </Grid>
              <Grid item xs={8} className="tw-text-left">
                {smsFlag && (
                  <form onSubmit={handleSubmitOtp(onSubmitOtp, onErrorOtp)}>
                    <div className={cx('tw-text-left tw-flex tw-items-center tw-gap-3')}>
                      <TextField
                        size="small"
                        type="search"
                        id="otp"
                        name="otp"
                        inputProps={{
                          maxLength: 6,
                        }}
                        {...registerOtp('otp')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                color="lite-gray"
                                disabled={isDisabledOtp}
                                onClick={() => handleSubmitOtp(onSubmitOtp)}
                              >
                                {phoneEditMode ? '인증' : '확인'}
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Typography
                        className="tw-text-right"
                        variant="h6"
                        sx={{ fontWeight: '600', color: 'black', mr: 2 }}
                      >
                        {min}:{sec < 10 ? `0${sec}` : sec}
                      </Typography>
                    </div>
                  </form>
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={cx('sub-content', 'border', 'tw-rounded-lg', 'tw-my-10', 'tw-text-center')}>
        <div className="tw-p-10 tw-text-black tw-text-base tw-font-semibold">
          <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              대학
            </Grid>
            <Grid item xs={8}>
              <select
                className="form-select"
                onChange={handleUniversityChange}
                aria-label="Default select example"
                value={universityCode}
              >
                <option value="">대학을 선택해주세요.</option>
                {userInfo?.jobOptions?.map((university, index) => (
                  <option key={index} value={university.code}>
                    {university.name}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              학과
            </Grid>
            <Grid item xs={8}>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={handleJobChange}
                value={selectedJob}
              >
                {jobs.map((job, index) => (
                  <option key={index} value={job.code}>
                    {job.name}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
          {/* <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              학번
            </Grid>
            <Grid item xs={8}>
              <div className="tw-text-left tw-flex tw-text-base tw-gap-3">
                <Textfield className="tw-w-full" size="small" id="outlined-disabled" value="sdfasdfasdf" />
              </div>
            </Grid>
          </Grid> */}
          <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              학년
            </Grid>
            <Grid item xs={8} style={{ padding: 0, margin: 0 }} className="tw-text-left">
              <ToggleButtonGroup
                style={{ display: 'inline' }}
                // value={recommendLevels}
                value={recommendLevels}
                exclusive
                onChange={handleRecommendLevels}
                aria-label="text alignment"
              >
                {userInfo?.jobLevelOptions?.map((item, index) => (
                  <ToggleButton
                    classes={{ selected: classes.selected }}
                    key={`job-2-${index}`}
                    value={item.code}
                    aria-label="fff"
                    className="tw-ring-1 tw-ring-slate-900/10"
                    style={{
                      borderRadius: '5px',
                      borderLeft: '0px',
                      marginRight: '7px',
                      height: '35px',
                      border: '0px',
                    }}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: '#6A7380',
                        color: '#fff',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: '#6A7380',
                      },
                    }}
                  >
                    {item.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <div className="tw-gap-4 tw-px-0 tw-py-3">
                <dt className="tw-text-sm tw-leading-6 tw-text-gray-900"></dt>
                <dd className="tw-mt-0 tw-font-medium tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                  {/* {recommendLevels?.toString() === '0001' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      1학년 : 직무스킬 학습 중. 상용서비스 개발 경험 없음.
                    </div>
                  )}
                  {recommendLevels?.toString() === '0002' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      2학년 : 상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요.
                    </div>
                  )}
                  {recommendLevels?.toString() === '0003' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      3학년 : 상용 서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능.
                    </div>
                  )}
                  {recommendLevels?.toString() === '0004' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      4학년 : 상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능.
                    </div>
                  )}
                  {recommendLevels?.toString() === '0005' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      입문 : 다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더.
                    </div>
                  )}
                  {recommendLevels?.toString() === '0006' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      5레벨 : 본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩.
                    </div>
                  )} */}
                </dd>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

      <div className={cx('sub-content', 'border tw-px-[100px]', 'tw-rounded-lg', 'tw-mt-5')}>
        <div className=" tw-p-14 max-lg:tw-p-5 ">
          <div className="tw-text-xl tw-pb-10 tw-text-black">
            <span className="tw-text-xl tw-font-bold tw-text-left text-black">DevUs </span>
            <span className="tw-font-bold tw-text-xl"></span> 이용 약관에 동의해주세요.
          </div>

          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item xs={10}>
              <Box display="flex" justifyContent="flex-start">
                <FormGroup sx={{ fontWeight: 'bold' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="ALL"
                        // onChange={onChangeAll}
                        onChange={() => handleChange('all')}
                        checked={agreements.all}
                        // checked={CheckList?.length === 3}
                        icon={<CheckBoxOutlineBlankOutlinedIcon />}
                        checkedIcon={<CheckBoxOutlinedIcon />}
                        sx={{
                          '&.Mui-checked': {
                            color: '#CA001f', // 체크된 상태의 색상
                          },
                          color: '##dc2626',
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

          <Divider variant="middle" sx={{ borderColor: 'rgba(0, 0, 0, 0.4);', margin: '5px 0px 5px 0px' }} />
          <FormGroup sx={{ fontWeight: 'bold', padding: '0px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  // onChange={e => onChangeEach(e, IdList[0])}
                  // checked={CheckList?.includes(IdList[0])}
                  // value={IdList[0]}
                  checked={agreements.service}
                  onChange={() => handleChange('service')}
                  icon={<CheckBoxOutlinedIcon />}
                  checkedIcon={<CheckBoxOutlinedIcon />}
                  ref={checkboxref}
                  sx={{
                    '&.Mui-checked': {
                      color: '#CA001f', // 체크된 상태의 색상
                    },
                    color: '#c7c7c7',
                    '& .MuiSvgIcon-root': { fontSize: 24 },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>
                  (필수) 서비스
                  <Link
                    href="#"
                    underline="always"
                    onClick={() => {
                      onReply('0001', 'paper');
                    }}
                  >
                    <span className="tw-underline">이용약관</span>
                  </Link>{' '}
                  동의
                </Typography>
              }
            />
          </FormGroup>

          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item xs={10}>
              <Box display="flex" justifyContent="flex-start">
                <FormGroup sx={{ fontWeight: 'bold' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        // onChange={e => onChangeEach(e, IdList[1])}
                        // checked={CheckList?.includes(IdList[1])}
                        // value={IdList[1]}
                        checked={agreements.privacy}
                        onChange={() => handleChange('privacy')}
                        icon={<CheckBoxOutlinedIcon />}
                        checkedIcon={<CheckBoxOutlinedIcon />}
                        sx={{
                          '&.Mui-checked': {
                            color: '#CA001f', // 체크된 상태의 색상
                          },
                          color: '#c7c7c7',
                          '& .MuiSvgIcon-root': { fontSize: 24 },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>
                        (필수){' '}
                        <Link
                          href="#"
                          underline="always"
                          onClick={() => {
                            onReply('0002', 'paper');
                          }}
                        >
                          <span className="tw-underline">개인정보 처리 방침</span>
                        </Link>
                        에 동의
                      </Typography>
                    }
                  />
                </FormGroup>
              </Box>
            </Grid>
          </Grid>

          {/* <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item xs={10}>
              <Box display="flex" justifyContent="flex-start">
                <FormGroup sx={{ fontWeight: 'bold' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={e => onChangeEach(e, IdList[2])}
                        checked={CheckList?.includes(IdList[2])}
                        value={IdList[2]}
                        icon={<CheckBoxOutlinedIcon />}
                        checkedIcon={<CheckBoxOutlinedIcon />}
                        sx={{
                          '&.Mui-checked': {
                            color: '#CA001f', // 체크된 상태의 색상
                          },
                          color: '#c7c7c7',
                          '& .MuiSvgIcon-root': { fontSize: 24 },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>
                        (선택) 마케팅 정보 수신 및 활용에 동의
                      </Typography>
                    }
                  />
                </FormGroup>
              </Box>
            </Grid>
          </Grid> */}

          <Divider variant="middle" sx={{ borderColor: 'rgba(0, 0, 0, 0.4);', margin: '5px 0px 5px 0px' }} />

          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item xs={10}>
              <Box display="flex" justifyContent="flex-start">
                <FormGroup sx={{ fontWeight: 'bold' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        // onChange={e => {
                        //   onChangeEachPromotion(e, 'promotion1');
                        //   onChangeMarketingAll(e, IdList[2]);
                        // }}
                        // checked={
                        //   CheckMarketingList.length === 0
                        //     ? false
                        //     : true ||
                        //       CheckList?.includes(IdList[0]) ||
                        //       CheckList?.includes(IdList[1]) ||
                        //       CheckList?.includes(IdList[2])
                        // }
                        checked={agreements.promotions}
                        onChange={() => handleChange('promotions')}
                        // value={IdList[2]}
                        icon={<CheckBoxOutlinedIcon />}
                        checkedIcon={<CheckBoxOutlinedIcon />}
                        sx={{
                          '&.Mui-checked': {
                            color: '#CA001f', // 체크된 상태의 색상
                          },
                          color: '#c7c7c7',
                          '& .MuiSvgIcon-root': { fontSize: 24 },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>
                        (선택) 이벤트 등 프로모션 알림 수신
                      </Typography>
                    }
                  />
                </FormGroup>
              </Box>
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>

          <Grid container direction="row" alignItems="center" sx={{ marginLeft: 0 }}>
            <Grid item xs={4}>
              <Box display="flex">
                <FormGroup sx={{ fontWeight: 'bold' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        // onChange={e => onChangeMarketingEach(e, marketingList[0], 'promotion1')}
                        // checked={CheckMarketingList.includes(marketingList[0])}
                        // value={marketingList[0]}
                        checked={agreements.email}
                        onChange={() => handleChange('email')}
                        icon={<CheckBoxOutlineBlankOutlinedIcon />}
                        checkedIcon={<CheckBoxOutlinedIcon />}
                        sx={{
                          '&.Mui-checked': {
                            color: '#CA001f', // 체크된 상태의 색상
                          },
                          color: '#c7c7c7',
                          '& .MuiSvgIcon-root': { fontSize: 24 },
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>이메일</Typography>}
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
                        checked={agreements.sms}
                        onChange={() => handleChange('sms')}
                        // onChange={e => onChangeMarketingEach(e, marketingList[1], 'promotion1')}
                        // checked={CheckMarketingList.includes(marketingList[1])}
                        // value={marketingList[1]}
                        icon={<CheckBoxOutlineBlankOutlinedIcon />}
                        checkedIcon={<CheckBoxOutlinedIcon />}
                        sx={{
                          '&.Mui-checked': {
                            color: '#CA001f', // 체크된 상태의 색상
                          },
                          color: '#c7c7c7',
                          '& .MuiSvgIcon-root': { fontSize: 24 },
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>문자</Typography>}
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
                        checked={agreements.kakao}
                        onChange={() => handleChange('kakao')}
                        // onChange={e => onChangeMarketingEach(e, marketingList[2], 'promotion1')}
                        // checked={CheckMarketingList.includes(marketingList[2])}
                        // value={marketingList[2]}
                        icon={<CheckBoxOutlineBlankOutlinedIcon />}
                        checkedIcon={<CheckBoxOutlinedIcon />}
                        sx={{
                          '&.Mui-checked': {
                            color: '#CA001f', // 체크된 상태의 색상
                          },
                          color: '#c7c7c7',
                          '& .MuiSvgIcon-root': { fontSize: 24 },
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>카카오</Typography>}
                  />
                </FormGroup>
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>

      <div className="tw-text-center tw-py-5 tw-flex tw-justify-between tw-gap-5 tw-text-sm">
        <button
          onClick={() => setIsModalOpen(true)}
          className="tw-bg-[#6A7380] tw-text-white tw-px-10 tw-py-3 tw-rounded"
        >
          회원탈퇴
        </button>
        <button className="tw-bg-[#dc2626] tw-text-white tw-px-10 tw-py-3 tw-rounded" onClick={handleSubmit}>
          저장하기
        </button>
      </div>

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
      {/* <div className="row justify-content-center">
        <Button size="my-page" type="submit" onClick={() => handleSubmit()} className={cx('footer-button', 'mb-5')}>
          수정완료
        </Button>
      </div> */}
      <Modal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} title="회원탈퇴 신청" maxWidth="700px">
        <div className={cx('seminar-check-popup')}>
          <div className="tw-py-20">
            <span className={cx('text-bold')}>회원탈퇴를 원하신다면 </span>
            아래 탈퇴하기 버튼을 눌러주세요.
            <br />
            {/* <span> 탈퇴할 수 있습니다.</span> */}
          </div>
          <div>
            <Button
              color="red"
              label="탈퇴하기"
              size="modal"
              className={cx('mr-2')}
              onClick={() => handleDeleteSubmit()}
            />
            <Button color="secondary" label="취소" size="modal" onClick={() => setIsModalOpen(false)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MemberEditTemplate;
const paramsWithDefault = (params: any) => {
  const defaultParams: any = {
    type: '0001',
  };
  return {
    ...defaultParams,
    ...params,
  };
};
