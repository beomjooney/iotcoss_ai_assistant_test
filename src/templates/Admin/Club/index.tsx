import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import * as yup from 'yup';
import dayjs from 'dayjs';
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import { Profile, AdminPagination, Table, SmartFilter, Button, Toggle } from '../../../stories/components';
import { TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useUploadImage } from 'src/services/image/image.mutations';
import { SearchParamsProps } from 'pages/admin/club';

const cx = classNames.bind(styles);

interface ClubTemplateProps {
  clubList?: any;
  skillsList?: any;
  experience?: any;
  jobGroup?: any;
  jobCodes?: any;
  clubData?: any;
  pageProps?: any;
  onClubInfo?: (clubId: string) => void;
  onDeleteClub?: (clubId: string) => void;
  onSave?: (data: any) => void;
  onSearch?: (searchKeyword: any) => void;
  params: SearchParamsProps;
  setParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
}

export function AdminClubTemplate({
  clubList,
  skillsList,
  experience,
  jobGroup,
  jobCodes,
  clubData,
  pageProps,
  params,
  onClubInfo,
  onDeleteClub,
  onSave,
  onSearch,
  setParams,
}: ClubTemplateProps) {
  const COLGROUP = ['8%', '8%', '10%', '6%', '6%', '7%', '6%', '6%', '6%', '8%', '8%', '8%'];
  const HEADS = [
    '클럽아이디',
    '회원UUID',
    '클럽명',
    '추천직군들',
    '추천직무들',
    '추천레벨들',
    '공개여부',
    '모집회원수',
    '모집된회원 수',
    '퀴즈시작일',
    '클럽상태',
    '생성일시',
  ];
  const POPUP_COLGROUP = ['15%', '10%', '15%', '15%', '10%'];
  const POPUP_HEADS = ['신청자 아이디', '이름', '닉네임', '전화번호', '등록일시'];

  const TAB2_COLGROUP = ['15%', '15%', '15%', '15%', '15%', '15%'];
  const TAB2_HEADS = ['신청자ID', '이름', '닉네임', '상태', '가입신청일시', '가입승인일시'];

  const TAB3_COLGROUP = ['15%', '15%', '15%', '15%', '15%', '15%'];
  const TAB3_HEADS = ['회원ID', '회원명', '전화번호', '가입신청일시', '학습 횟수', '답변 좋아요 수'];

  const TAB4_COLGROUP = ['15%', '15%', '15%', '15%', '15%', '15%'];
  const TAB4_HEADS = ['퀴즈순서', '학습주차', '발행일시', '퀴즈 좋아요 수', '답변 수', '대표 여부'];

  const FIELDS = [
    { name: '클럽아이디', field: 'clubId', type: 'text' },
    { name: '클럽명', field: 'clubName', type: 'text' },
    { name: '추천직군', field: 'seminarSubTitle', type: 'text' },
    { name: '추천직무', field: 'seminarIntroduction', type: 'text' },
    { name: '추천레벨', field: 'description', type: 'choice' },
    { name: '설명', field: 'seminarStatus', type: 'text' },
    { name: '공개여부', field: 'seminarType', type: 'choice' },
    { name: '모집회원수', field: 'organizerMemberId', type: 'text' },
    { name: '퀴즈시작일', field: 'lecturerMemberId', type: 'text' },
    { name: '퀴즈종료일', field: 'lecturerName', type: 'text' },
    { name: '학습주수', field: 'recommendJobGroups', type: 'text' },
    { name: '학습주기', field: 'recommendJobGroups', type: 'text' },
    { name: '학습주수', field: 'recommendJobGroups', type: 'text' },
    { name: '상태', field: 'recommendLevels', type: 'choice' },
    { name: '등록일시', field: 'keywords', type: 'text' },
  ];

  const { mutate: onSaveProfileImage, data: profileImage, isSuccess } = useUploadImage();

  const [popupOpen, setPopupOpen] = useState<boolean>(true);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [club, setClub] = useState<any>({});
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [profileImageUrl, setProfilImageUrl] = useState(null);
  const [tabValue, setTabValue] = useState<number>(1);
  const [content, setContent] = useState<any>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<string[]>([]);

  const clubSaveSchema = yup.object().shape({
    clubId: yup.string().notRequired(),
    name: yup.string().notRequired(),
    nickname: yup.string().notRequired(),
    email: yup.string().notRequired(),
    ageRange: yup.string().notRequired(),
    birthday: yup.string().notRequired(),
    type: yup.string().notRequired(),
    typeName: yup.string().notRequired(),
  });

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(clubSaveSchema),
  });

  useEffect(() => {
    clubData && setClub(clubData.data);
  }, [clubData]);

  const onShowPopup = (clubId: string) => {
    // 사용자 조회
    onClubInfo && onClubInfo(clubId);

    // const result = skillsList?.data?.data?.find(item => item?.relatedJobGroups === memberData?.data?.jobGroup);
    // setContent(result);
    setPopupOpen(true);
  };

  const onChangeClub = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setClub({
      ...club,
      ...data,
    });
  };

  const handleDelete = (clubId: string) => {
    setPopupOpen(false);
    setClub({});
    onDeleteClub && onDeleteClub(clubId);
  };

  const handleSearchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setSearchKeyword(value);
    setParams({
      ...params,
      keyword: value,
    });
  };

  const handlePickerChange = (moment, key) => {
    let datetime = moment?.format('YYYY-MM-DD');
    if (key === 'createdAtTo') {
      datetime = `${datetime} 23:59:59`;
    } else {
      datetime = `${datetime} 00:00:00`;
    }
    setParams({
      ...params,
      [key]: `${datetime}`,
    });
  };

  const onSmartFilterSearch = (params: any) => {
    onSearch && onSearch(params);
  };

  const handleTab = (value: number) => {
    setTabValue(value);
  };

  const handleSave = (data: any) => {
    const params = {
      ...data,
      ...club,
      profileImageUrl: profileImage?.toString()?.slice(1) || club?.profileImageUrl,
    };
    onSave && onSave(params);
  };

  const onError = (error: any) => {
    console.log(error);
  };

  const readFile = file => {
    const reader = new FileReader();
    reader.onload = e => {
      const image = e.target.result;
      setProfilImageUrl(image);
      onSaveProfileImage(file);
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = files => {
    if (!files || files.length === 0) return;
    readFile(files[0]);
  };

  const handleClubApply = () => {};

  const clubCodes = [];

  return (
    <div className="content">
      <h2 className="tit-type1">클럽관리</h2>
      <div className="path">
        <span>Home</span> <span>클럽목록</span>
      </div>

      <div className="data-top">
        <div className="left">
          {/*<a href="#" className="btn-type1 type1">*/}
          {/*  등록*/}
          {/*</a>*/}
        </div>
        <div className="right">
          <div className={cx('search')}>
            <div className={cx('date')}>
              <div>
                <div className="inpwrap">
                  <div className="inp-tit">시작일</div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      format="YYYY-MM-DD"
                      value={dayjs(params?.createdAtFrom)}
                      onChange={e => handlePickerChange(e, 'createdAtFrom')}
                      //renderInput={params => <TextField {...params?.createdAtFrom} variant="standard" />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div>-</div>
              <div>
                <div className="inpwrap">
                  <div className="inp-tit">종료일</div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      format="YYYY-MM-DD"
                      value={dayjs(params?.createdAtTo)}
                      onChange={e => handlePickerChange(e, 'createdAtTo')}
                      //renderInput={params => <TextField {...params} variant="standard" />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>
            <div className="inpwrap">
              <div className="inp search">
                <input
                  type="text"
                  placeholder="검색어"
                  className="input-admin"
                  onChange={handleSearchKeyword}
                  value={searchKeyword}
                  name="searchKeyword"
                  onKeyDown={event => onSearch && event.key === 'Enter' && onSearch(params)}
                />
                <button className="btn" onClick={() => onSearch && onSearch(params)}>
                  <i className="ico i-search"></i>
                </button>
              </div>
            </div>
            <button
              className="btn-type1 type3"
              onClick={() => {
                // if (!params?.createdAtFrom || !params?.createdAtTo) {
                //   alert('기간을 설정해주세요');
                // }

                setIsFilter(!isFilter);
              }}
            >
              <i className="ico i-filter"></i>
              <span>필터</span>
            </button>
          </div>
          <SmartFilter
            name="memberFilter"
            fields={FIELDS}
            isFilterOpen={isFilter}
            onSearch={onSmartFilterSearch}
            params={params}
            setParams={setParams}
          />
        </div>
      </div>
      <div className="data-type1" data-evt="main-table-on">
        <Table
          name="member"
          colgroup={COLGROUP}
          heads={HEADS}
          items={clubList?.data?.data?.contents?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.memberId)}>
                <td className="magic" title={item.memberId}>
                  {item.clubId}
                </td>
                <td className="magic" title={item.name}>
                  {item.name}
                </td>
                <td className="magic" title={item.email}>
                  {item.email}
                </td>
                <td className="magic" title={item.phoneNumber}>
                  {item.phoneNumber}
                </td>
                <td className="magic" title={item.ageRange}>
                  {item.ageRange}
                </td>
                <td className="magic" title={item.typeName}>
                  {item.typeName}
                </td>
                <td className="magic" title={item.jobGroupName}>
                  {item.jobGroupName}
                </td>
                <td className="magic" title={item.level}>
                  {item.level}
                </td>
                <td className="magic" title={item.emailReceiveYn ? 'Y' : 'N'}>
                  {item.emailReceiveYn ? 'Y' : 'N'}
                </td>
                <td className="magic" title={item.smsReceiveYn ? 'Y' : 'N'}>
                  {item.smsReceiveYn ? 'Y' : 'N'}
                </td>
                <td className="magic" title={item.kakaoReceiveYn ? 'Y' : 'N'}>
                  {item.kakaoReceiveYn ? 'Y' : 'N'}
                </td>
                <td className="magic" title={item?.authProviderName}>
                  {item?.points}
                </td>
                <td className="magic" title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={clubList?.data?.length === 0 || false}
        />
        <AdminPagination {...pageProps} />
      </div>
      <div className={cx('side-layer', popupOpen ? 'open' : '')} id="sidePop1">
        <FormProvider {...methods}>
          <div className="dim"></div>
          <div className="side-contents">
            <div className="layer-top">
              <div className="left" style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: 30, marginRight: 30 }}>
                  <button
                    onClick={() => {
                      setPopupOpen(false);
                      setIsEdit(false);
                    }}
                  >
                    <i className="ico i-x"></i>
                  </button>
                </div>
                <div className="tit-type2">클럽 상세보기</div>
              </div>
              <div className="right">
                {isEdit ? (
                  <button className="btn-type1 type2" onClick={methods.handleSubmit(handleSave, onError)}>
                    저장
                  </button>
                ) : (
                  <button className="btn-type1 type2" onClick={() => setIsEdit(true)}>
                    수정
                  </button>
                )}
                {isEdit ? (
                  <button className="btn-type1 type1" onClick={() => setIsEdit(false)}>
                    취소
                  </button>
                ) : (
                  <button className="btn-type1 type1" onClick={() => handleDelete(club?.memberId)}>
                    삭제
                  </button>
                )}
              </div>
            </div>
            <ul className="tab-type1 tab4" data-evt="tab">
              <li className={tabValue === 1 ? 'on' : ''}>
                <a href="#" onClick={() => handleTab(1)}>
                  기본 정보
                </a>
              </li>
              <li className={tabValue === 2 ? 'on' : ''}>
                <a
                  href="#"
                  onClick={() => {
                    handleTab(2);
                    setIsEdit(false);
                  }}
                >
                  클럽가입 승인/취소
                </a>
              </li>{' '}
              <li className={tabValue === 3 ? 'on' : ''}>
                <a
                  href="#"
                  onClick={() => {
                    handleTab(3);
                    setIsEdit(false);
                  }}
                >
                  클럽회원
                </a>
              </li>{' '}
              <li className={tabValue === 4 ? 'on' : ''}>
                <a
                  href="#"
                  onClick={() => {
                    handleTab(4);
                    setIsEdit(false);
                  }}
                >
                  클럽퀴즈
                </a>
              </li>
            </ul>

            {tabValue === 1 && popupOpen && (
              <div className="tab-content" data-id="tabLink01">
                <div style={{ display: 'flex', justifyContent: 'center' }} className="tw-mt-10">
                  {isEdit ? (
                    <div className={cx('profile-image-item')}>
                      <div className={cx('profile-image')}>
                        <Image
                          src={
                            isSuccess
                              ? profileImageUrl
                              : club?.profileImageUrl?.indexOf('http') > -1
                              ? club?.profileImageUrl
                              : `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${club?.profileImageUrl}`
                          }
                          // src={`${process.env['NEXT_PUBLIC_GENERAL_API_URL']}/images/${mentorInfo?.profileImageUrl}`}
                          alt={`${club?.typeName} ${club?.nickname}`}
                          className={cx('rounded-circle', 'profile-image__image')}
                          width={`256px`}
                          height={`256px`}
                          objectFit="cover"
                          unoptimized={true}
                        />
                      </div>
                      <div className={cx('profile-image-item__upload-wrap')}>
                        <Button type="button" color="secondary" disabled={!isEdit}>
                          <label htmlFor="profile-image-item__upload">프로필 사진 수정</label>
                          <input
                            hidden
                            disabled={!isEdit}
                            id="profile-image-item__upload"
                            accept="image/*"
                            type="file"
                            onChange={e => onFileChange(e.target?.files)}
                          />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Profile mentorInfo={club} showDesc isOnlyImage />
                  )}
                </div>
                <div className="layout-grid">
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        클럽 아이디<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('memberId')}
                          disabled
                          value={club?.memberId || ''}
                          onChange={onChangeClub}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        클럽명<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          className="input-admin"
                          type="text"
                          {...methods.register('name')}
                          value={club?.name || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">회원UUID</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('ageRange')}
                          value={club?.ageRange || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">모집회원 수</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('ageRange')}
                          value={club?.ageRange || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">해시태그</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('ageRange')}
                          value={club?.ageRange || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        학습 주 수<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <select value={club?.type || ''} onChange={onChangeClub} name="type" disabled={!isEdit}>
                          {clubCodes?.data?.contents?.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">학습 주기</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('ageRange')}
                          value={club?.ageRange || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        클럽 상태<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <select value={club?.jobGroup || ''} onChange={onChangeClub} name="jobGroup" disabled={!isEdit}>
                          {jobCodes?.data?.contents?.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        공개 여부<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <select value={club?.jobGroup || ''} onChange={onChangeClub} name="jobGroup" disabled={!isEdit}>
                          {jobCodes?.data?.contents?.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">참여 코드</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('ageRange')}
                          value={club?.ageRange || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">레벨</div>
                      <div className="inp">
                        <select value={club?.level || ''} onChange={onChangeClub} name="level" disabled={!isEdit}>
                          <option value={1}>1레벨</option>
                          <option value={2}>2레벨</option>
                          <option value={3}>3레벨</option>
                          <option value={4}>4레벨</option>
                          <option value={5}>5레벨</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">등록일시</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          value={club?.createdAt || ''}
                          disabled
                          onChange={onChangeClub}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">등록자</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          value={club?.creatorId || ''}
                          disabled
                          onChange={onChangeClub}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">수정일시</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          value={club?.updatedAt || ''}
                          disabled
                          onChange={onChangeClub}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">수정자</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          value={club?.updaterId || ''}
                          disabled
                          onChange={onChangeClub}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tabValue === 2 && popupOpen && (
              <div className="tab-content" data-id="tabLink02">
                <hr className="h40" />
                <div className="data-type1" data-evt="table-on">
                  <Table
                    name="seminarMember"
                    colgroup={TAB2_COLGROUP}
                    heads={TAB2_HEADS}
                    items={clubList?.map((item, index) => {
                      return (
                        <tr key={`participant-${index}`}>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>{dayjs(item.createdAt).format('YYYY-MM-DD')}</td>
                          <td>
                            <div className="right">
                              {['0001', '0003', '0004'].includes(item.approvalStatus) ? (
                                <button
                                  className="btn-type1 type3"
                                  name="apply"
                                  onClick={event => handleClubApply(event, item.memberId)}
                                >
                                  승인
                                </button>
                              ) : (
                                <button
                                  className="btn-type1 type4"
                                  name="cancel"
                                  onClick={event => handleClubApply(event, item.memberId)}
                                >
                                  반려
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    isEmpty={clubList?.length === 0 || false}
                  />
                </div>
              </div>
            )}

            {/* 클럽회원 */}
            {tabValue === 3 && popupOpen && (
              <div className="tab-content" data-id="tabLink02">
                <hr className="h40" />
                <div className="data-type1" data-evt="table-on">
                  <Table
                    name="seminarMember"
                    colgroup={TAB3_COLGROUP}
                    heads={TAB3_HEADS}
                    items={levelInfo?.map((item, index) => {
                      return (
                        <tr key={`clubuser-${index}`}>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>{dayjs(item.createdAt).format('YYYY-MM-DD')}</td>
                          <td></td>
                          <td></td>
                        </tr>
                      );
                    })}
                    isEmpty={club?.length === 0 || false}
                  />
                </div>
              </div>
            )}

            {/* 클럽퀴즈 */}
            {tabValue === 4 && popupOpen && (
              <div className="tab-content" data-id="tabLink02">
                <hr className="h40" />
                <div className="data-type1" data-evt="table-on">
                  <Table
                    name="seminarMember"
                    colgroup={TAB4_COLGROUP}
                    heads={TAB4_HEADS}
                    items={levelInfo?.map((item, index) => {
                      return (
                        <tr key={`clubquiz-${index}`}>
                          <td></td>
                          <td></td>
                          <td>{dayjs(item.createdAt).format('YYYY-MM-DD')}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      );
                    })}
                    isEmpty={club?.length === 0 || false}
                  />
                </div>
              </div>
            )}
          </div>
        </FormProvider>
      </div>
    </div>
  );
}

export default AdminClubTemplate;

const levelInfo = [{ level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }, { level: 5 }];
