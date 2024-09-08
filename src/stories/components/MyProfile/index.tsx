import classNames from 'classnames/bind';
import styles from './index.module.scss';
import ProfileModal from 'src/stories/components/ProfileModal';
import TextField from '@mui/material/TextField';
import React, { useEffect, useRef, useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useOptions } from 'src/services/experiences/experiences.queries';
import { Toggle } from 'src/stories/components';
import { useSaveProfile } from 'src/services/account/account.mutations';
import { useUploadImage } from 'src/services/image/image.mutations';

const cx = classNames.bind(styles);

const MyProfile = ({ profile, badgeContents, refetchProfile, admin = false }: any) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const phoneRef = useRef(null);
  const [activeQuiz, setActiveQuiz] = useState('0001');
  const [memberId, setMemberId] = useState('');

  const [universityCode, setUniversityCode] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [jobLevel, setJobLevel] = useState('0001');
  const [introductionMessage, setIntroductionMessage] = useState('');

  /**file image  */
  const [file, setFile] = useState(null);
  const [fileImageUrl, setFileImageUrl] = useState(null);

  const textInput = useRef(null);

  const { isFetched: isOptionFetched, data: optionsData }: UseQueryResult<any> = useOptions();

  /**save profile */
  const { mutate: onSave, isSuccess: onSuccess } = useSaveProfile();

  /**image */
  const { mutate: onSaveImage, data: imageUrl, isSuccess: imageSuccess } = useUploadImage();

  useEffect(() => {
    if (onSuccess) {
      refetchProfile();
    }
  }, [onSuccess]);

  const handleProfileSave = () => {
    // fileImageUrl이 null인 경우 imageUrl을 사용하도록 조건문 추가
    const profileImageKey = imageUrl || profile?.member?.profileImageUrl;

    // const params = {
    //   profileImageUrl: profileImageKey,
    //   jobGroup: universityCode,
    //   job: selectedJob,
    //   memberId: profile?.email,
    //   jobLevel: jobLevel,
    //   introductionMessage: introductionMessage,
    // };

    console.log(universityCode);
    console.log(selectedJob);

    if (universityCode === '' || universityCode === undefined) {
      alert('대학을 선택해주세요.');
      return;
    }

    if (selectedJob === '' || selectedJob === undefined) {
      alert('학과를 선택해주세요.');
      return;
    }

    const formData = new FormData();
    console.log(file);
    formData.append('profileImage', file || '');
    formData.append('jobGroup', universityCode);
    formData.append('job', selectedJob);
    formData.append('memberId', profile?.email);
    formData.append('jobLevel', jobLevel);
    formData.append('introductionMessage', introductionMessage);

    console.log('formData', formData);
    onSave(formData);
    setIsModalOpen(false);
  };

  const handleUniversityChange = e => {
    const selectedCode = e.target.value;
    const selected = optionsData?.data?.jobs?.find(u => u.code === selectedCode);
    setUniversityCode(selectedCode);
    setSelectedUniversity(selectedCode);
    setJobs(selected ? selected.jobs : []);
    console.log(selected.jobs[0].code);
    setSelectedJob(selected.jobs[0].code);
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
    onSaveImage(file);
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
                {profile?.jobLevels[0]?.name || '레벨'}
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
                email:
              </p>
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                {profile?.email || '프로필 수정에서 대학을 선택해주세요.'}
              </p>
            </div>
            <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                phone:
              </p>
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                {profile?.phoneNumber || 'N/A'}
              </p>
            </div>
          </div>
          {admin && (
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
              }}
              className="tw-mt-4 border tw-py-3 tw-px-5 tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-center tw-text-[#6a7380]"
            >
              프로필 수정
            </button>
          )}
        </div>
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        onAfterClose={() => {
          setIsModalOpen(false);
        }}
      >
        <div className="tw-font-bold tw-text-xl tw-text-black tw-mt-0 tw-mb-5 tw-text-center">
          {profile?.member?.nickname}님 데브어스에 오신 것을 환영합니다!
        </div>
        <div className="tw-font-semibold tw-text-base tw-text-black tw-mt-0  tw-text-center">
          대학,학과, 학번 및 학년 등 개인상세정보를 입력해주세요.
        </div>
        <div className="tw-font-semibold tw-text-base  tw-text-black tw-mt-0 tw-mb-10 tw-text-center">
          이후 마이페이지에서 수정이 가능합니다.
        </div>

        <div className="border tw-p-7 tw-rounded-xl">
          <div className="tw-font-bold tw-text-base tw-text-black">개인정보</div>
          <div className=" tw-mt-7 tw-ml-7 tw-relative tw-flex tw-flex-col tw-items-center">
            <img
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
              <div className="tw-px-4 tw-py-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0  tw-flex tw-justify-center tw-items-center">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">이메일</dt>
                <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                  {profile?.email}
                </dd>
              </div>
              <div className="tw-px-4 tw-py-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0  tw-flex tw-justify-center tw-items-center">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">이름</dt>
                <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">{profile?.member?.nickname}</dd>
              </div>
              <div className="tw-px-4 tw-py-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0  tw-flex tw-justify-center tw-items-center">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">전화번호</dt>
                <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">{profile?.phoneNumber}</dd>
              </div>
              {/* <div className="tw-px-4 tw-py-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0  tw-flex tw-justify-center tw-items-center">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">학번</dt>
                <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">
                  <TextField
                    inputRef={phoneRef} // ref를 할당합니다.
                    size="small"
                    id="outlined-basic"
                    label=""
                    name="companyName"
                    variant="outlined"
                    onChange={e => setMemberId(e.target.value)}
                    value={memberId}
                    inputProps={{
                      maxLength: 13,
                      style: {
                        height: '20px',
                      },
                    }}
                  />
                </dd>
              </div> */}
              <div className="tw-px-4 tw-pt-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">대학</dt>
                <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">
                  <select
                    className="form-select"
                    onChange={handleUniversityChange}
                    aria-label="Default select example"
                    value={universityCode}
                  >
                    <option>대학을 선택해주세요.</option>
                    {optionsData?.data?.jobs?.map((university, index) => (
                      <option key={index} value={university.code}>
                        {university.name}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <div className="tw-mt-2 tw-px-4 tw-py-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">학과</dt>
                <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    disabled={jobs.length === 0}
                    onChange={handleJobChange}
                    value={selectedJob}
                  >
                    <option disabled value="">
                      학과를 선택해주세요.
                    </option>
                    {jobs.map((job, index) => (
                      <option key={index} value={job.code}>
                        {job.name}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <div className="tw-mt-2 tw-px-4 tw-pt-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-flex tw-justify-center tw-items-center">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">학년</dt>
                <dd className="tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5">
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

              <div className="tw-px-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0">
                <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900"></dt>
                <dd className="tw-mt-0 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
                  {jobLevel?.toString() === '0001' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      0레벨 : 직무스킬 학습 중. 상용서비스 개발 경험 없음.
                    </div>
                  )}
                  {jobLevel?.toString() === '0002' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      1레벨 : 상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요.
                    </div>
                  )}
                  {jobLevel?.toString() === '0003' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      2레벨 : 상용 서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능.
                    </div>
                  )}
                  {jobLevel?.toString() === '0004' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      3레벨 : 상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능.
                    </div>
                  )}
                  {jobLevel?.toString() === '0005' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      4레벨 : 다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더.
                    </div>
                  )}
                  {jobLevel?.toString() === '0006' && (
                    <div className="tw-text-sm tw-text-gray-500 tw-mt-2 tw-my-0">
                      5레벨 : 본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩.
                    </div>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="border tw-p-7 tw-rounded-xl tw-mt-5 ">
          <div className="tw-font-bold tw-text-base tw-text-black">자기소개(선택정보)</div>
          <div className="tw-px-4 tw-grid tw-grid-cols-6 tw-gap-4 tw-px-0 tw-mt-8">
            <dt className="tw-text-sm tw-font-bold tw-leading-6 tw-text-gray-900">한줄소개</dt>
            <dd className="tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-700 tw-col-span-5 tw-mt-0">
              <textarea
                value={introductionMessage}
                className="tw-form-control tw-w-full tw-py-[8px] tw-p-5"
                id="floatingTextarea"
                placeholder="댓글을 입력해주세요."
                ref={textInput}
                rows={3} // 두 줄 높이로 설정
                onChange={e => {
                  setIntroductionMessage(e.target.value);
                }}
              ></textarea>
            </dd>
          </div>
        </div>
        <div className="tw-p-3 tw-rounded-xl tw-mt-5 tw-text-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="tw-w-[150px] tw-mr-3 tw-text-sm tw-bg-black tw-text-white tw-py-3 tw-px-5 tw-rounded"
          >
            다음에 하기
          </button>
          <button
            type="button"
            onClick={() => handleProfileSave()}
            className="tw-w-[150px] tw-text-sm tw-bg-red-600 tw-text-white tw-py-3 tw-px-5 tw-rounded"
          >
            수정하기
          </button>
        </div>
      </ProfileModal>
    </>
  );
};

export default MyProfile;
