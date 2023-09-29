import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Button, Profile, Modal, Textfield, Toggle } from 'src/stories/components';
import { useStore } from 'src/store';
import React, { useEffect, useRef, useState } from 'react';
import {
  useDeleteMember,
  useEditUser,
  useLoginOtp,
  useLoginOtpVerification,
} from 'src/services/account/account.mutations';
import Image from 'next/image';
import { useUploadImage } from 'src/services/image/image.mutations';
import { useMemberInfo, useTermsList } from 'src/services/account/account.queries';
import { useSessionStore } from 'src/store/session';
import { User } from 'src/models/user';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import _TextField from '@mui/material/TextField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import isURL from 'validator/lib/isURL';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Link from '@mui/material/Link';
import CheckIcon from '@mui/icons-material/Check';
import Divider from '@mui/material/Divider';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { UseQueryResult } from 'react-query';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import TextField from '@mui/material/TextField';
const cx = classNames.bind(styles);

export function MemberEditTemplate() {
  const [open, setOpen] = React.useState(false);
  const { user, setUser } = useStore();
  const { memberId } = useSessionStore.getState();
  const [userInfo, setUserInfo] = useState<User>(user);
  const [nickname, setNickname] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [otpNumber, setOtpNumber] = useState('');
  const [nicknameEditMode, setNicknameEditMode] = useState(false);
  const [phoneEditMode, setPhoneEditMode] = useState(false);
  const [emailReceiveYn, setEmailReceiveYn] = useState(false);
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

  // ** SNS URL
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterUrl, setTitterUrl] = useState('');
  const [linkedUrl, setLinked] = useState('');
  const [snsUrl, setSns] = useState('');
  const [facebookUrl, setFacebook] = useState('');

  // ** Timer
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [CheckList, setCheckList] = useState([]);
  const [CheckMarketingList, setCheckMarketingList] = useState([]);
  const [IdList, setIdList] = useState(['serviceTerms', 'privateTerms', 'marketing']);
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

  useMemberInfo(memberId, user => {
    setUserInfo(user);
  });
  const { mutate: onEditUser, status } = useEditUser();
  const { mutate: onSaveImage, data: imageUrl, isSuccess: imageSuccess } = useUploadImage();
  const { mutate: onDeleteMember } = useDeleteMember();

  //otp
  const { mutate: onLoginOtp, isSuccess } = useLoginOtp();
  const { mutate: onLoginOtpVerification, isSuccess: isVerification, data: resultData } = useLoginOtpVerification();

  const handleNickname = e => setNickname(e.target.value);
  const handleYoutube = e => setYoutubeUrl(e.target.value);
  const handleInstgram = e => setInstagramUrl(e.target.value);
  const handleFacebook = e => setFacebook(e.target.value);
  const handleTwitter = e => setTitterUrl(e.target.value);
  const handleLinked = e => setLinked(e.target.value);
  const handleSns = e => setSns(e.target.value);

  const handlePhoneNumber = e => setPhoneNumber(e.target.value);
  const handleOtpNumber = e => setOtpNumber(e.target.value);

  const handleEmailYn = e => {
    setEmailReceiveYn(!emailReceiveYn); // Toggle the value of emailReceiveYn
  };
  const handleKakaoYn = e => {
    setKakaoReceiveYn(!handleKakaoYn); // Toggle the value of emailReceiveYn
  };
  const handleSmsYn = e => {
    setSmsReceiveYn(!smsReceiveYn); // Toggle the value of emailReceiveYn
  };

  //** Fouse */
  const focusYoutube_Ref = useRef(null);
  const focusTwitter_Ref = useRef(null);
  const focusLinked_Ref = useRef(null);
  const focusFacebook_Ref = useRef(null);
  const focusInstargram_Ref = useRef(null);
  const focusSns_Ref = useRef(null);
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

  const handleSubmit = () => {
    if (nicknameEditMode || phoneEditMode) {
      alert("수정 중인 정보가 있습니다. '변경 버튼'을 눌러 저장한 후 '수정 완료'해주세요.");
      return;
    }
    if (phoneNumber?.length > 0 && (phoneNumber.length != 13 || !phoneNumber.startsWith('01'))) {
      alert('휴대전화 정보가 정확하지 않습니다.');
      return;
    }

    if (fileImageUrl) {
      // 이미지도 변경한 경우 업로드부터 시행
      onSaveImage(file);
      setEditing(true);
      return;
    }

    // 이미지 변경 안한 경우 정보만 변경
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
      ...userInfo,
      nickname,
      phoneNumber,
      smsReceiveYn,
      emailReceiveYn,
      kakaoReceiveYn,
      profileImageUrl,
    };

    if ((isURL(youtubeUrl) && youtubeUrl.includes('youtube')) || youtubeUrl === '') {
    } else {
      alert('youtube 주소가 잘못되었습니다.');
      return;
    }

    if ((isURL(twitterUrl) && twitterUrl.includes('twitter')) || twitterUrl === '') {
    } else {
      alert('twitter 주소가 잘못되었습니다.');
      return;
    }

    if ((isURL(linkedUrl) && linkedUrl.includes('linked')) || linkedUrl === '') {
    } else {
      alert('linked 주소가 잘못되었습니다.');
      return;
    }

    if ((isURL(instagramUrl) && instagramUrl.includes('instagram')) || instagramUrl === '') {
    } else {
      alert('instagram 주소가 잘못되었습니다.');
      return;
    }

    if ((isURL(facebookUrl) && facebookUrl.includes('facebook')) || facebookUrl === '') {
    } else {
      alert('facebook 주소가 잘못되었습니다.');
      return;
    }

    onEditUser(params);
    setUserInfo(params);
  };

  // 이미지 업로드 완료 시 최종 정보 수정
  if (imageSuccess && edting) {
    setEditing(false);
    updateMemberInfo();
  }

  useEffect(() => {
    setUser(userInfo); // 전역 정보 업데이트
    setNickname(userInfo.nickname);
    setPhoneNumber(userInfo.phoneNumber);
    setEmailReceiveYn(userInfo.emailReceiveYn);
    setKakaoReceiveYn(userInfo.kakaoReceiveYn);
    setSmsReceiveYn(userInfo.smsReceiveYn);
    userInfo?.snsUrl?.map((item, index) => {
      if (item.includes('linked')) {
        setLinked(item);
      } else if (item.includes('facebook')) {
        setFacebook(item);
      } else if (item.includes('youtube')) {
        setYoutubeUrl(item);
      } else if (item.includes('instagram')) {
        setInstagramUrl(item);
      } else if (item.includes('twitter')) {
        setTitterUrl(item);
      } else {
        setSns(item);
      }
    });

    userInfo.snsUrl = [youtubeUrl, facebookUrl, linkedUrl, twitterUrl, snsUrl, instagramUrl].filter(v => v);
  }, [userInfo]);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const image = e.target.result;
      setFileImageUrl(image);
    };
    reader.readAsDataURL(file);
  }, [file]);

  const onFileChange = files => {
    if (!files || files.length === 0) return;
    setFile(files[0]);
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
      .required('otp is required')
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
    console.log(data);
    onLoginOtpVerification({ phoneNumber: phoneNumber, otpNumber: data.otp });
  };

  const onErrorOtp = (e: any) => {
    console.log('error', e);
    // setSmsFlag(false);
  };

  useEffect(() => {
    if (resultData) {
      setSmsFlag(false);
      setIsDisabledTimer(false);
      setPhoneEditMode(false);
      // setIsDisabledPhone(true);
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

  return (
    <div className={cx('member-edit-container')}>
      <div className={cx('sub-content', 'border', 'tw-rounded-lg', 'tw-mt-5', 'tw-text-center')}>
        <div className="tw-p-10 tw-pb-0 tw-text-black tw-text-base tw-font-semibold">
          <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              이메일
            </Grid>
            <Grid item xs={8}>
              <div className={cx('member-info')}>
                <TextField disabled size="small" id="outlined-disabled" value={userInfo.email || ''} />
                {/* <Textfield id="outlined-disabled" disabled type="email" width={240} /> */}
              </div>
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              이름
            </Grid>
            <Grid item xs={8}>
              <div className="tw-text-left">{userInfo.name || ''}</div>
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              닉네임
            </Grid>
            <Grid item xs={8}>
              <div className={cx('member-info')}>
                <TextField disabled size="small" id="outlined-disabled" value={nickname || ''} />
              </div>
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-py-3">
            <Grid item xs={2}></Grid>
            <Grid item xs={2} className="tw-text-left">
              {/* 휴대전화 */}
            </Grid>
            <Grid item xs={8}>
              <div className={cx('member-info')}>
                {phoneNumber !== userInfo.phoneNumber && !phoneEditMode && <span className={cx('change-dot')} />}
                {/* <TextField size="small" id="outlined-disabled" value={phoneNumber || ''} /> */}
                {/* <Textfield
                  isUnderline={true}
                  isPhoneNumber={true}
                  width={240}
                  required
                  value={phoneNumber || ''}
                  onChange={handlePhoneNumber}
                  // readOnly={!phoneEditMode}
                  readOnly={isDisabledPhone}
                  className={cx('text-field', 'text-field--normal')}
                /> */}
                {/* <Button
                  type="button"
                  color="primary"
                  disabled={false}
                  onClick={() => {
                    // setPhoneEditMode(!phoneEditMode);
                    if (phoneNumber === '') {
                      alert('핸드폰 번호를 입력해주세요');
                      // setPhoneEditMode(true);
                      // setSmsFlag(false);
                    } else {
                      onLoginOtp({ phoneNumber: phoneNumber });
                    }
                  }}
                  className={cx('change-button')}
                >
                  {phoneEditMode ? '인증문자 발송' : '인증 완료'}
                </Button> */}
              </div>
            </Grid>
            <Grid container direction="row" justifyContent="space-between" alignItems="center" className="tw-mt-10">
              <Grid item xs={2}></Grid>
              <Grid item xs={2} className="tw-text-left"></Grid>
              <Grid item xs={8}>
                {/* <div className="tw-float-right">
                  <Chip label="회원탈퇴" variant="outlined" onClick={() => setIsModalOpen(true)} />
                </div> */}
              </Grid>
            </Grid>
          </Grid>

          {smsFlag && (
            <form onSubmit={handleSubmitOtp(onSubmitOtp, onErrorOtp)}>
              <div className={cx('member-info-mobile', 'mb-5')}>
                {/* <div className={cx('member-info')}> */}
                {/* <Textfield
                label="인증번호"
                type="number"
                maxLength={6}
                isUnderline={true}
                required
                value={otpNumber || ''}
                onChange={handleOtpNumber}
                // readOnly={!phoneEditMode}
                className={cx('text-field', 'text-field--long')}
              /> */}
                <_TextField
                  sx={{
                    width: 100,
                    '& label': { fontSize: 14, color: '#919191', fontWeight: 'bold' },
                    '& input': { fontWeight: 700, fontSize: '16px' },
                  }}
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
                    marginBottom: '-5px',
                  }}
                >
                  <Button
                    color="primary"
                    disabled={isDisabledOtp}
                    onClick={() => handleSubmitOtp(onSubmitOtp)}
                    className={cx('change-button')}
                  >
                    {phoneEditMode ? '인증하기' : '변경'}
                  </Button>
                  <Typography variant="h6" sx={{ fontWeight: '600', color: 'black', mr: 2 }}>
                    {min}:{sec < 10 ? `0${sec}` : sec}
                  </Typography>
                  {/* </div> */}
                </Box>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className={cx('sub-content', 'border', 'tw-rounded-lg', 'tw-mt-5')}>
        <div className=" tw-p-14  tw-text-center">
          <div className="tw-text-xl tw-pb-10 tw-text-black">
            <span className="tw-font-bold tw-text-xl">데브어스</span> 이용 약관에 동의해주세요.
          </div>
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item xs={10}>
              <Box display="flex" justifyContent="flex-start">
                {/* <FormGroup sx={{ fontWeight: 'bold' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="ALL"
                        onChange={onChangeAll}
                        checked={CheckList.length === IdList.length}
                        icon={<CheckBoxOutlinedIcon />}
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
                </FormGroup> */}
              </Box>
            </Grid>
          </Grid>
          <Divider variant="middle" sx={{ borderColor: 'rgba(0, 0, 0, 0.4);', margin: '5px 0px 5px 0px' }} />
          <FormGroup sx={{ fontWeight: 'bold', padding: '0px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => onChangeEach(e, IdList[0])}
                  checked={CheckList.includes(IdList[0])}
                  value={IdList[0]}
                  icon={<CheckBoxOutlinedIcon />}
                  checkedIcon={<CheckBoxOutlinedIcon />}
                  ref={checkboxref}
                  sx={{
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
                        checked={CheckList.includes(IdList[1])}
                        value={IdList[1]}
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
                        (필수){' '}
                        <Link
                          href="#"
                          underline="always"
                          onClick={() => {
                            onReply('0001', 'paper');
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

          <Grid container direction="row" alignItems="center" sx={{ marginLeft: 4 }}>
            <Grid item xs={3}>
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
                          color: '#c7c7c7',
                          '& .MuiSvgIcon-root': { fontSize: 24 },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>이메일수신</Typography>
                    }
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
                        onChange={handleSmsYn}
                        checked={smsReceiveYn} // Use emailReceiveYn as the checked state
                        icon={<CheckBoxOutlinedIcon />}
                        checkedIcon={<CheckBoxOutlinedIcon />}
                        sx={{
                          color: '#c7c7c7',
                          '& .MuiSvgIcon-root': { fontSize: 24 },
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>문자 수신</Typography>}
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
                          color: '#c7c7c7',
                          '& .MuiSvgIcon-root': { fontSize: 24 },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>카카오 수신</Typography>
                    }
                  />
                </FormGroup>
              </Box>
            </Grid>
          </Grid>
        </div>
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
            <div dangerouslySetInnerHTML={{ __html: termList?.data?.content }}></div>
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
          <div className={cx('mb-5')}>
            <span className={cx('text-bold')}>회원탈퇴를 원하신다면 </span>
            아래 탈퇴하기 버튼을 눌러주세요.
            <br />
            <span>세미나 신청 취소를 해야만 탈퇴할 수 있습니다.</span>
          </div>
          <div>
            <Button
              color="primary"
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
