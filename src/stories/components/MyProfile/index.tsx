import classNames from 'classnames/bind';
import styles from './index.module.scss';
import ProfileModal from 'src/stories/components/ProfileModal';
import React, { useEffect, useRef, useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useOptions } from 'src/services/experiences/experiences.queries';
import { Toggle } from 'src/stories/components';
import { useSaveProfile, useRequestProfessor } from 'src/services/account/account.mutations';
import { useUploadImage } from 'src/services/image/image.mutations';
import { useSessionStore } from 'src/store/session';
import { useGetGroupLabel } from 'src/hooks/useGetGroupLabel';
import { truncate } from 'lodash';
import { TextField } from '@mui/material';

const cx = classNames.bind(styles);

const MyProfile = ({
  profile,
  badgeContents,
  refetchProfile,
  admin = false,
  isProfile = true,
  isRequest = truncate,
}: any) => {
  const { roles, jobGroupLabelType } = useSessionStore.getState();
  const { groupLabel, subGroupLabel } = useGetGroupLabel(jobGroupLabelType);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isProfessor, setIsProfessor] = useState<boolean>(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const phoneRef = useRef(null);
  const [activeQuiz, setActiveQuiz] = useState('0001');
  const [memberId, setMemberId] = useState('');
  const [universityCode, setUniversityCode] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [jobLevel, setJobLevel] = useState('0001');
  const [introductionMessage, setIntroductionMessage] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileImageUrl, setFileImageUrl] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');

  // 전화번호 유효성 검사 함수
  const validatePhoneNumber = (phone: string) => {
    // 전화번호가 비어있는 경우는 허용
    if (!phone) return true;

    // 한국 전화번호 정규식 패턴
    const phonePattern = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    return phonePattern.test(phone.replace(/-/g, ''));
  };

  // 전화번호 형식화 함수
  const formatPhoneNumber = (phone: string) => {
    const numbers = phone.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // handlePhoneNumberChange 함수 추가
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedNumber = formatPhoneNumber(value);
    setPhoneNumber(formattedNumber);

    if (!validatePhoneNumber(formattedNumber)) {
      setPhoneNumberError('올바른 전화번호 형식이 아닙니다.');
    } else {
      setPhoneNumberError('');
    }
  };

  const textInput = useRef(null);

  const { isFetched: isOptionFetched, data: optionsData }: UseQueryResult<any> = useOptions();

  /**save profile */
  const { mutate: onSave, isSuccess: onSuccess } = useSaveProfile();
  const { mutate: onRequestSave, isSuccess: onRequestSuccess } = useRequestProfessor();

  /**image */
  const { mutate: onSaveImage, data: imageUrl, isSuccess: imageSuccess } = useUploadImage();

  useEffect(() => {
    if (onSuccess) {
      refetchProfile();
    }
  }, [onSuccess]);

  useEffect(() => {
    if (onRequestSuccess) {
      setIsModalOpen(false);
      setIsProfessor(false);
    }
  }, [onRequestSuccess]);

  useEffect(() => {
    if (profile?.phoneNumber) {
      setPhoneNumber(profile.phoneNumber);
    }
  }, [profile?.phoneNumber]);

  useEffect(() => {
    setCompanyName(profile?.companyName || '');
  }, [profile?.companyName]);

  useEffect(() => {
    setDepartment(profile?.department || '');
  }, [profile?.department]);

  useEffect(() => {
    setTitle(profile?.title || '');
  }, [profile?.title]);

  const handleProfileSave = () => {
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      alert('올바른 전화번호 형식이 아닙니다.');
      return;
    }

    console.log(universityCode);
    console.log(selectedJob);

    if (universityCode === '' || universityCode === undefined) {
      alert(`${groupLabel}을 선택해주세요.`);
      return;
    }

    if (selectedJob === '' || selectedJob === undefined) {
      alert(`${subGroupLabel}을 선택해주세요.`);
      return;
    }

    const formData = new FormData();
    console.log(file);
    formData.append('profileImage', file || '');
    formData.append('jobGroup', universityCode);
    formData.append('job', selectedJob);
    formData.append('memberId', profile?.email || profile?.member?.memberId);
    formData.append('jobLevel', jobLevel);
    formData.append('introductionMessage', introductionMessage);
    formData.append('phoneNumber', phoneNumber.replace(/-/g, '')); // 하이픈 제거 후 저장
    formData.append('companyName', companyName || '');
    formData.append('department', department || '');
    formData.append('title', title || '');

    console.log('formData', formData);
    onSave({ formData, isProfessor: false });
    setIsModalOpen(false);
  };

  const handleRequestSave = () => {
    if (universityCode === '' || universityCode === undefined) {
      alert(`${groupLabel}을 선택해주세요.`);
      return;
    }

    if (selectedJob === '' || selectedJob === undefined) {
      alert(`${subGroupLabel}을 선택해주세요.`);
      return;
    }

    const params = {
      jobGroupId: universityCode,
      jobId: selectedJob,
      requestDescription: requestMessage,
    };
    onRequestSave(params);
    setIsModalOpen(false);

    const formData = new FormData();
    console.log(file);
    formData.append('profileImage', file || '');
    formData.append('jobGroup', universityCode);
    formData.append('job', selectedJob);
    formData.append('memberId', profile?.email || profile?.member?.memberId);
    formData.append('jobLevel', jobLevel);
    formData.append('introductionMessage', introductionMessage);
    formData.append('phoneNumber', phoneNumber); // 전화번호 추가
    formData.append('companyName', companyName || '');
    formData.append('department', department || '');
    formData.append('title', title || '');

    console.log('formData', formData);
    onSave({ formData, isProfessor: true });
  };

  const handleUniversityChange = e => {
    const selectedCode = e.target.value;
    const selected = optionsData?.data?.jobs?.find(u => u.code === selectedCode);
    setUniversityCode(selectedCode);
    setSelectedUniversity(selectedCode);
    setJobs(selected ? selected.jobs : []);
    console.log(selected?.jobs[0]?.code);
    setSelectedJob(selected?.jobs[0]?.code);
    // setJo(selected ? selected.jobs : []);
    // setSelectedJob(''); // Clear the selected job when university changes
  };

  const handleJobChange = e => {
    setSelectedJob(e.target.value);
    const selectedCode = e.target.value;
    const selected = jobs?.find(u => u.code === selectedCode);
    console.log(selected.code);
    setSelectedJob(selected ? selected.code : '');
  };

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const image = e.target.result;
      setFileImageUrl(image);
    };
    reader.readAsDataURL(file);
    // onSaveImage(file);
  }, [file]);

  const onFileChange = files => {
    if (!files || files.length === 0) return;
    console.log(files[0]);
    setFile(files[0]);
  };

  return (
    <>
      <div className="tw-relative tw-rounded-[10px] border ">
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-start tw-absolute tw-left-[172px] tw-top-8 tw-gap-4">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xl tw-text-left tw-text-black">
            <span className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xl tw-font-bold tw-text-left tw-text-black">
              {profile?.member?.nickname}
            </span>
            <span className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xl tw-text-left tw-text-black">님</span>
          </p>
          <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-gap-2 tw-flex-wrap">
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-3 tw-py-1 tw-rounded tw-bg-[#d7ecff]">
              <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#235a8d]">
                {profile?.jobGroup?.name || '직군'}
              </div>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-3 tw-py-1 tw-rounded tw-bg-[#e4e4e4]">
              <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#313b49]">
                {profile?.job?.name || '직무'}
              </div>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-3 tw-py-1 tw-rounded tw-bg-[#ffdede]">
              <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#b83333]">
                {profile?.jobLevels?.[0]?.name || '레벨'}
              </div>
            </div>
          </div>

          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
            {profile?.introductionMessage || '등록된 자기 소개가 없습니다.'}
          </p>
        </div>
        <div className="tw-w-[120px] tw-h-[120px]" style={{ filter: 'drop-shadow(0px 2px 5px rgba(0,0,0,0.15))' }}>
          <div className="tw-left-[30.5px] tw-top-[30.5px]" />
          <div className="tw-w-[120px] tw-h-[127.85px] tw-mt-7 tw-ml-7 ">
            <img
              src={profile?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png'} // 디폴트 이미지 URL
              className=" tw-rounded-full tw-w-[120px] tw-h-[120px] tw-object-cover"
            />
          </div>
        </div>
        <div className="tw-px-10 tw-mb-5 tw-mt-10">
          <p className=" tw-left-8 tw-top-[212px] tw-text-base tw-font-bold tw-text-left tw-text-black tw-py-2">
            Contact
          </p>
          <div className="tw-flex tw-flex-col tw-justify-start tw-items-start  tw-left-8 tw-top-[245px] tw-gap-1">
            <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                {profile?.email ? 'email : ' : '학번 : '}
              </p>
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                {profile?.email || profile?.member?.memberId}
              </p>
            </div>
            <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                phone:
              </p>
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                {profile?.phoneNumber || ''}
              </p>
            </div>
            {profile?.companyName && (
              <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                  회사명:
                </p>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                  {profile.companyName}
                </p>
              </div>
            )}
            {profile?.department && (
              <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                  부서:
                </p>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                  {profile.department}
                </p>
              </div>
            )}
            {profile?.title && (
              <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                  직급:
                </p>
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                  {profile.title}
                </p>
              </div>
            )}
          </div>
          {admin && isProfile && (
            <div>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setUniversityCode(profile.jobGroup?.code || '');
                  const selected = optionsData?.data?.jobs?.find(u => u.code === profile.jobGroup?.code);
                  setJobs(selected ? selected.jobs : []);
                  const selected_code = selected?.jobs?.find(u => u.code === profile.job?.code);
                  setSelectedJob(selected_code?.code);
                  setIntroductionMessage(profile.introductionMessage || '');
                  setMemberId(profile?.memberId || '');
                  setJobLevel(profile?.jobLevels[0]?.code || '');
                  setCompanyName(profile?.companyName || '');
                  setDepartment(profile?.department || '');
                  setTitle(profile?.title || '');
                }}
                className="tw-mt-4 border tw-py-3 tw-px-5 tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-center tw-text-[#6a7380]"
              >
                프로필 수정
              </button>
              {!(roles?.includes('ROLE_ADMIN') || roles?.includes('ROLE_INSTRUCTOR') || profile?.companyName) && (
                <button
                  onClick={() => {
                    setIsProfessor(true);
                    setIsModalOpen(true);
                    setUniversityCode(profile.jobGroup?.code || '');
                    const selected = optionsData?.data?.jobs?.find(u => u.code === profile.jobGroup?.code);
                    setJobs(selected ? selected.jobs : []);
                    const selected_code = selected?.jobs?.find(u => u.code === profile.job?.code);
                    setSelectedJob(selected_code?.code);
                    setIntroductionMessage(profile.introductionMessage || '');
                    setMemberId(profile?.memberId || '');
                    setJobLevel(profile?.jobLevels[0]?.code || '');
                    setCompanyName(profile?.companyName || '');
                    setDepartment(profile?.department || '');
                    setTitle(profile?.title || '');
                  }}
                  className="tw-ml-3 tw-mt-4 border tw-py-3 tw-px-5 tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-center tw-text-[#6a7380]"
                >
                  교수자 권한 요청
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        onAfterClose={() => {
          setIsModalOpen(false);
          setIsProfessor(false);
        }}
      >
        <div className="tw-font-bold tw-text-xl tw-text-black tw-mt-0 tw-mb-5 tw-text-center">
          {profile?.member?.nickname}님 데브어스에 오신 것을 환영합니다!
        </div>
        {isProfessor === true ? (
          <>
            <div className="tw-font-semibold tw-text-base tw-text-black tw-mt-0  tw-text-center">
              교수자 권한 요청에 필요한 상세 정보들을 제출해주세요.
            </div>
            <div className="tw-font-semibold tw-text-base  tw-text-black tw-mt-0 tw-mb-10 tw-text-center">
              이후 마이페이지 - 프로필에서도 권한 요청이 가능합니다.
            </div>
          </>
        ) : (
          <>
            <div className="tw-font-semibold tw-text-base tw-text-black tw-mt-0  tw-text-center">
              {groupLabel}, {subGroupLabel}, 학번 및 학년 등 개인상세정보를 입력해주세요.
            </div>
            <div className="tw-font-semibold tw-text-base  tw-text-black tw-mt-0 tw-mb-10 tw-text-center">
              이후 마이페이지에서 수정이 가능합니다.
            </div>
          </>
        )}

        <div className="border tw-p-7 tw-rounded-xl">
          <div className="tw-font-bold tw-text-base tw-text-black">개인정보</div>
          <div className=" tw-mt-7 tw-ml-7 tw-relative tw-flex tw-flex-col tw-items-center">
            <img
              alt="profile-image"
              src={
                fileImageUrl ?? (profile?.member?.profileImageUrl || '/assets/images/account/default_profile_image.png')
              }
              className="tw-ring-1 tw-rounded-full tw-w-[120px] tw-h-[120px] tw-object-cover"
            />
            <svg
              onClick={() => document.getElementById('input-file').click()}
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-w-6 tw-h-6 tw-mt-[-20px] tw-ml-20 tw-cursor-pointer "
              preserveAspectRatio="none"
            >
              <circle cx={12} cy={12} r="11.5" fill="#9CA5B2" stroke="#CED4DE" />
              <path
                d="M14.9856 6.60537C15.1382 6.42488 15.3269 6.27796 15.5398 6.17398C15.7526 6.07001 15.9849 6.01125 16.2218 6.00146C16.4588 5.99168 16.6952 6.03107 16.916 6.11713C17.1368 6.2032 17.3371 6.33404 17.5042 6.50133C17.6713 6.66862 17.8015 6.86868 17.8865 7.08877C17.9715 7.30885 18.0095 7.54413 17.998 7.7796C17.9865 8.01508 17.9257 8.24559 17.8196 8.45644C17.7136 8.66729 17.5644 8.85385 17.3818 9.00424L9.29473 17.1004L6 18L6.89856 14.7016L14.9856 6.60537Z"
                fill="#E9ECF2"
              />
            </svg>
            <input hidden id="input-file" accept="image/*" type="file" onChange={e => onFileChange(e.target?.files)} />
          </div>
          <div className="tw-mt-2 tw-border-t tw-border-gray-100">
            <dl className="tw-divide-y tw-divide-gray-100">
              <div className="tw-px-4 tw-py-4 tw-grid tw-grid-cols-6 tw-gap-4">
                <dt className="tw-text-base tw-font-bold tw-leading-6 tw-text-gray-900">
                  {profile?.email ? '이메일' : '학번'}
                </dt>
                <dd className=" tw-text-base tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                  {profile?.email || profile?.member?.memberId}
                </dd>
              </div>
              <div className="tw-px-4 tw-py-3 tw-grid tw-grid-cols-6 tw-gap-4 ">
                <dt className="tw-text-base tw-font-bold tw-leading-6 tw-text-gray-900">이름</dt>
                <dd className="tw-text-base tw-leading-6 tw-text-gray-700 tw-col-span-5">
                  {profile?.member?.nickname}
                </dd>
              </div>
              <div className="tw-px-4 tw-pt-3 tw-grid tw-grid-cols-6 tw-gap-4 tw-justify-center tw-items-center">
                <dt className="tw-text-base tw-font-bold tw-leading-6 tw-text-gray-900">전화번호</dt>
                <dd className="tw-text-base tw-leading-6 tw-text-gray-700 tw-col-span-5">
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    error={!!phoneNumberError}
                    helperText={phoneNumberError}
                    placeholder="010-0000-0000"
                  />
                </dd>
              </div>
              <div className="tw-mt-4 tw-px-4 tw-grid tw-grid-cols-6 tw-gap-4  tw-justify-center tw-items-center">
                <dt className="tw-text-base tw-font-bold tw-leading-6 tw-text-gray-900">{groupLabel}</dt>
                <dd className="tw-text-base tw-leading-6 tw-text-gray-700 tw-col-span-5">
                  <select
                    className="form-select"
                    onChange={handleUniversityChange}
                    aria-label="Default select example"
                    value={universityCode}
                  >
                    <option value="">{groupLabel}을 선택해주세요.</option>
                    {optionsData?.data?.jobs?.map((university, index) => (
                      <option key={index} value={university.code}>
                        {university.name}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <div className="tw-pt-4 tw-px-4 tw-py-3 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                <dt className="tw-text-base tw-font-bold tw-leading-6 tw-text-gray-900">{subGroupLabel}</dt>
                <dd className="tw-text-base tw-leading-6 tw-text-gray-700 tw-col-span-5">
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    disabled={jobs.length === 0}
                    onChange={handleJobChange}
                    value={selectedJob}
                  >
                    <option disabled value="">
                      {subGroupLabel}을 선택해주세요.
                    </option>
                    {jobs.map((job, index) => (
                      <option key={index} value={job.code}>
                        {job.name}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <div className="tw-px-4 tw-pt-2 tw-grid tw-grid-cols-6 tw-gap-4 tw-justify-center tw-items-center">
                <dt className="tw-text-base tw-font-bold tw-leading-6 tw-text-gray-900">학년</dt>
                <dd className="tw-text-base tw-leading-6 tw-text-gray-700 tw-col-span-5">
                  {optionsData?.data?.jobLevels?.map((item, i) => (
                    <Toggle
                      key={i}
                      label={item.name}
                      name={item.name}
                      value={item.code}
                      variant="small"
                      checked={jobLevel === item.code}
                      isActive
                      type="tabButton"
                      onChange={() => {
                        setActiveQuiz(item.code);
                        console.log(item);
                        setJobLevel(item.code);
                      }}
                      className={cx('tw-mr-3 !tw-w-[75px] tw-line-clamp-1')}
                    />
                  ))}
                </dd>
              </div>
              {profile?.companyName && (
                <div className="tw-px-4 tw-pt-3 tw-grid tw-grid-cols-6 tw-gap-4 tw-justify-center tw-items-center">
                  <dt className="tw-text-base tw-font-bold tw-leading-6 tw-text-gray-900">회사명</dt>
                  <dd className="tw-text-base tw-leading-6 tw-text-gray-700 tw-col-span-5">
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="회사명을 입력해주세요"
                    />
                  </dd>
                </div>
              )}
              {profile?.companyName && (
                <div className="tw-px-4 tw-pt-3 tw-grid tw-grid-cols-6 tw-gap-4 tw-justify-center tw-items-center">
                  <dt className="tw-text-base tw-font-bold tw-leading-6 tw-text-gray-900">부서</dt>
                  <dd className="tw-text-base tw-leading-6 tw-text-gray-700 tw-col-span-5">
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      placeholder="부서를 입력해주세요"
                    />
                  </dd>
                </div>
              )}
              {profile?.companyName && (
                <div className="tw-px-4 tw-pt-3 tw-grid tw-grid-cols-6 tw-gap-4 tw-justify-center tw-items-center">
                  <dt className="tw-text-base tw-font-bold tw-leading-6 tw-text-gray-900">직급</dt>
                  <dd className="tw-text-base tw-leading-6 tw-text-gray-700 tw-col-span-5">
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="직급을 입력해주세요"
                    />
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        {isProfessor === true ? (
          <>
            <div className="border tw-p-7 tw-rounded-xl tw-mt-5 ">
              <div className="tw-font-bold tw-text-base tw-text-[#6A7380]">교수자 권한 요청</div>
              <div className="tw-px-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-mt-8">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">요청설명</dt>
                <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                  <textarea
                    value={requestMessage}
                    className="tw-form-control tw-w-full tw-py-[8px] tw-p-5"
                    id="floatingTextarea"
                    placeholder="권한 요청에 대한 요청설명을 입력해주세요."
                    ref={textInput}
                    rows={3} // 두 줄 높이로 설정
                    onChange={e => {
                      setRequestMessage(e.target.value);
                    }}
                  ></textarea>
                </dd>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="border tw-p-7 tw-rounded-xl tw-mt-5 ">
              <div className="tw-font-bold tw-text-base tw-text-black">자기소개(선택정보)</div>
              <div className="tw-px-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-mt-8">
                <dt className="tw-text-base tw-font-bold tw-leading-6 tw-text-gray-900">한줄소개</dt>
                <dd className="tw-mt-1 tw-text-base tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                  <textarea
                    value={introductionMessage}
                    className="tw-form-control tw-w-full tw-py-[8px] tw-p-5"
                    id="floatingTextarea"
                    placeholder="자기소개를 입력해주세요."
                    ref={textInput}
                    rows={3} // 두 줄 높이로 설정
                    onChange={e => {
                      setIntroductionMessage(e.target.value);
                    }}
                  ></textarea>
                </dd>
              </div>
            </div>
          </>
        )}
        <div className="tw-p-3 tw-rounded-xl tw-mt-5 tw-text-center">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
              setIsProfessor(false);
            }}
            className="tw-w-[150px] tw-mr-3 tw-text-sm tw-bg-black tw-text-white tw-py-3 tw-px-5 tw-rounded"
          >
            다음에 하기
          </button>
          {isProfessor === true ? (
            <button
              type="button"
              onClick={() => handleRequestSave()}
              className="tw-w-[150px] tw-text-sm tw-bg-blue-600 tw-text-white tw-py-3 tw-px-5 tw-rounded"
            >
              요청하기
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleProfileSave()}
              className="tw-w-[150px] tw-text-sm tw-bg-red-600 tw-text-white tw-py-3 tw-px-5 tw-rounded"
            >
              수정하기
            </button>
          )}
        </div>
      </ProfileModal>
    </>
  );
};

export default MyProfile;
