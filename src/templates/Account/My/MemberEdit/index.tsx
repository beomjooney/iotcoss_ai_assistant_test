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
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { makeStyles } from '@mui/styles';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import InputAdornment from '@mui/material/InputAdornment';
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
  const [CheckList, setCheckList] = useState([]);
  const [CheckMarketingList, setCheckMarketingList] = useState([]);
  const [IdList, setIdList] = useState(['service1', 'privacy1', 'promotion2']);
  const [marketingList, setMarketingList] = useState(['email', 'sms', 'kakao']);
  const [allTerm, setAllTerm] = useState<boolean>(false);
  const [serviceTerm, setServiceTerm] = useState<boolean>(false);
  const [privateTerm, setPrivateTerm] = useState<boolean>(false);
  const [marketing, setMarketing] = useState<boolean>(false);
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
  const { mutate: onChangePassword, isSuccess: isSuccessChangePassword } = useChangePassword();
  const { mutate: onUserUpdate, isSuccess: isSuccessUserUpdate } = useUserUpdate();

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

  const handleEmailYn = e => {
    setEmailReceiveYn(!emailReceiveYn); // Toggle the value of emailReceiveYn
  };
  const handleKakaoYn = e => {
    setKakaoReceiveYn(!kakaoReceiveYn); // Toggle the value of emailReceiveYn
  };
  const handleSmsYn = e => {
    setSmsReceiveYn(!smsReceiveYn); // Toggle the value of emailReceiveYn
  };

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
      setCheckList(prevCheckList => [...prevCheckList, id]);
      // 체크 해제할 시 CheckList에서 해당 id값이 `아닌` 값만 배열에 넣기
    } else {
      setCheckList(prevCheckList => prevCheckList.filter(checkedId => checkedId !== id));
    }
    console.log(CheckList);
  };
  const checkMandatoryTerms = list => {
    if (!list.includes('service1') || !list.includes('privacy1')) {
      alert('필수값 체크를 해주세요');
      return false;
    }
    return true;
  };
  const onChangeAll = e => {
    setCheckList(e.target.checked ? IdList : []);
    setCheckMarketingList(e.target.checked ? marketingList : []);
    setServiceTerm(e.target.checked);
    setPrivateTerm(e.target.checked);
    setMarketing(e.target.checked);
    setKakaoReceiveYn(e.target.checked);
    setEmailReceiveYn(e.target.checked);
    setSmsReceiveYn(e.target.checked);
  };

  const handlePasswordChange1 = value => {
    setPreviousPassword(value);
  };

  const handlePasswordChange2 = value => {
    setNewPassword(value);
  };

  const handlePasswordChange3 = value => {
    setConfirmPassword(value);
  };

  const handleSubmit = () => {
    updateMemberInfo();
  };

  const handleDeleteSubmit = () => {
    // 이미지 변경 안한 경우 정보만 변경
    setIsModalOpen(false);
    onDeleteMember(memberId);
  };

  const updateMemberInfo = () => {
    const profileImageUrl = imageUrl ? imageUrl.toString().slice(1) : user?.profileImageUrl;
    const params = {
      // ...userInfo,
      jobGroup: universityCode,
      jobLevel: recommendLevels,
      job: selectedJob,
      isEmailReceive: emailReceiveYn,
      isSmsReceive: smsReceiveYn,
      isKakaoReceive: kakaoReceiveYn,
      agreedTermsIds: CheckList,
    };

    console.log(params);
    if (checkMandatoryTerms(CheckList)) {
      onUserUpdate(params);
    }
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
    // setUser(userInfo); // 전역 정보 업데이트
    setNickname(userInfo?.personalInfo?.nickname);
    setPhoneNumber(formatPhoneNumber(userInfo?.personalInfo?.phoneNumber));
    setEmailReceiveYn(userInfo?.personalInfo?.isEmailReceive);
    setKakaoReceiveYn(userInfo?.personalInfo?.isKakaoReceive);
    setSmsReceiveYn(userInfo?.personalInfo?.isSmsReceive);
    setSelectedUniversityName(userInfo?.personalInfo?.jobGroup?.name);
    const selected = userInfo?.jobOptions?.find(u => u.code === userInfo?.personalInfo?.jobGroup?.code);
    setJobs(selected ? selected.jobs : []);
    setUniversityCode(userInfo?.personalInfo?.jobGroup?.code);
    setSelectedJob(userInfo?.personalInfo?.job?.code);

    console.log(selected);
    console.log(selected);

    setCheckList(userInfo?.personalInfo?.termsAgreed?.filter(term => term.isAgreed).map(term => term.termsId));
    setRecommendLevels(userInfo?.personalInfo?.jobLevel?.code || '');
    // setRecommendLevels('0001' || []);
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

  return (
    <div className={cx('member-edit-container tw-py-4')}>
      <div className={cx('sub-content', 'border', 'tw-rounded-lg', 'tw-mt-5', 'tw-text-center')}>
        <div className="tw-p-10 tw-pb-0 tw-text-black tw-text-base tw-font-semibold">
          <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              이메일
            </Grid>
            <Grid item xs={8}>
              <div className="tw-text-left tw-font-medium">{userInfo?.personalInfo?.email || ''}</div>
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
              <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
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
                      type="password"
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
                <Grid item xs={2}></Grid>
                <Grid item xs={2} className="tw-text-left">
                  새비밀번호
                </Grid>
                <Grid item xs={8}>
                  <div className="tw-text-left tw-flex tw-text-base tw-gap-3">
                    <TextField
                      onChange={e => handlePasswordChange2(e.target.value)}
                      size="small"
                      id="outlined-disabled"
                      value={newPassword}
                      type="password"
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
                      onChange={e => handlePasswordChange3(e.target.value)}
                      size="small"
                      id="outlined-disabled"
                      value={confirmPassword}
                      type="password"
                    />
                    <button
                      onClick={handlePasswordChangeSubmit}
                      className="border tw-text-gray-500 tw-rounded tw-px-4 tw-py-1 tw-text-sm tw-font-medium"
                    >
                      변경하기
                    </button>
                  </div>
                </Grid>
              </Grid>
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
                  {recommendLevels?.toString() === '0001' && (
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
                  )}
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
                        onChange={onChangeAll}
                        checked={CheckList?.length === IdList?.length}
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
                  onChange={e => onChangeEach(e, IdList[0])}
                  checked={CheckList?.includes(IdList[0])}
                  value={IdList[0]}
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
                        onChange={e => onChangeEach(e, IdList[1])}
                        checked={CheckList?.includes(IdList[1])}
                        value={IdList[1]}
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

          <Grid container direction="row" justifyContent="space-between" alignItems="center">
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
          </Grid>

          <Divider variant="middle" sx={{ borderColor: 'rgba(0, 0, 0, 0.4);', margin: '5px 0px 5px 0px' }} />

          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item xs={10}>
              <Box display="flex" justifyContent="flex-start">
                {/* <FormGroup sx={{ fontWeight: 'bold' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={e => onChangeMarketingAll(e, IdList[2])}
                        checked={CheckMarketingList.length >= 1}
                        value={IdList[2]}
                        icon={<CheckBoxOutlinedIcon />}
                        checkedIcon={<CheckBoxOutlinedIcon />}
                        sx={{
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
                </FormGroup> */}
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
                        onChange={handleEmailYn}
                        checked={emailReceiveYn} // Use emailReceiveYn as the checked state
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
                        onChange={handleSmsYn}
                        checked={smsReceiveYn} // Use emailReceiveYn as the checked state
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
                        onChange={handleKakaoYn}
                        checked={kakaoReceiveYn} // Use emailReceiveYn as the checked state
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
