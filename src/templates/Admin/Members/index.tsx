import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import Image from 'next/image';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Profile, AdminPagination, Table, SmartFilter, Button, Toggle } from '../../../stories/components';
import dayjs from 'dayjs';
import { useUploadImage } from 'src/services/image/image.mutations';

const cx = classNames.bind(styles);

interface MembersTemplateProps {
  memberList?: any;
  skillsList?: any;
  experience?: any;
  jobGroup?: any;
  jobCodes?: any;
  memberData?: any;
  memberCodes?: any;
  pageProps?: any;
  onMemberInfo?: (memberId: string) => void;
  onDeleteMember?: (memberId: string) => void;
  onSave?: (data: any) => void;
  onSearch?: (searchKeyword: any) => void;
}

export function MembersTemplate({
  memberList,
  skillsList,
  experience,
  jobGroup,
  jobCodes,
  memberData,
  onMemberInfo,
  onDeleteMember,
  onSave,
  memberCodes,
  pageProps,
  onSearch,
}: MembersTemplateProps) {
  const COLGROUP = ['8%', '7%', '8%', '6%', '3%', '5%', '7%', '5%', '7%', '4%', '5%', '5%', '7%'];
  const HEADS = [
    '회원아이디',
    '회원명',
    '이메일',
    '전화번호',
    '연령대',
    '회원유형',
    '직군유형',
    '레벨',
    '이메일수신',
    '문자수신',
    '카카오톡수신',
    '포인트',
    '등록일시',
  ];

  const FIELDS = [
    { name: 'UUID', field: 'uuid', type: 'text' },
    { name: '회원아이디', field: 'memberId', type: 'text' },
    { name: '회원고유번호', field: 'memberUri', type: 'text' },
    { name: '회원명', field: 'name', type: 'text' },
    { name: '닉네임', field: 'nickname', type: 'text' },
    { name: '이메일', field: 'email', type: 'text' },
  ];

  const { mutate: onSaveProfileImage, data: profileImage, isSuccess } = useUploadImage();

  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [member, setMember] = useState<any>({});
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [profileImageUrl, setProfilImageUrl] = useState(null);
  const [tabValue, setTabValue] = useState<number>(1);
  const [content, setContent] = useState<any>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // TODO : 밸리데이션 추가 해야 함
  const memberSaveSchema = yup.object().shape({
    memberId: yup.string().notRequired(),
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
    resolver: yupResolver(memberSaveSchema),
  });

  useEffect(() => {
    memberData && setMember(memberData.data);
  }, [memberData]);

  const onShowPopup = (memberId: string) => {
    // 사용자 조회
    onMemberInfo && onMemberInfo(memberId);

    // const result = skillsList?.data?.data?.find(item => item?.relatedJobGroups === memberData?.data?.jobGroup);
    // setContent(result);
    setPopupOpen(true);
  };

  const onChangeMember = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setMember({
      ...member,
      ...data,
    });
  };

  const handleDelete = (memberId: string) => {
    setPopupOpen(false);
    setMember({});
    onDeleteMember && onDeleteMember(memberId);
  };

  const handleSearchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setSearchKeyword(value);
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
      ...member,
      profileImageUrl: profileImage?.toString()?.slice(1) || member?.profileImageUrl,
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

  const handleCheckboxChange = () => {};

  //console.log(member);

  return (
    <div className="content">
      <h2 className="tit-type1">회원관리</h2>
      <div className="path">
        <span>Home</span> <span>회원목록</span>
      </div>

      <div className="data-top">
        <div className="left">
          {/*<a href="#" className="btn-type1 type1">*/}
          {/*  등록*/}
          {/*</a>*/}
        </div>
        <div className="right">
          <div className="inpwrap">
            <div className="inp search">
              <input
                type="text"
                placeholder="검색어"
                className="input-admin"
                onChange={handleSearchKeyword}
                value={searchKeyword}
                onKeyDown={event => onSearch && event.key === 'Enter' && onSearch(searchKeyword)}
              />
              <button className="btn" onClick={() => onSearch && onSearch(searchKeyword)}>
                <i className="ico i-search"></i>
              </button>
            </div>
          </div>
          <button className="btn-type1 type3" onClick={() => setIsFilter(!isFilter)}>
            <i className="ico i-filter"></i>
            <span>필터</span>
          </button>
        </div>
        <SmartFilter name="memberFilter" fields={FIELDS} isFilterOpen={isFilter} onSearch={onSmartFilterSearch} />
      </div>
      <div className="data-type1" data-evt="main-table-on">
        <Table
          name="member"
          colgroup={COLGROUP}
          heads={HEADS}
          items={memberList?.data?.data?.contents?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.memberId)}>
                <td className="magic" title={item.memberId}>
                  {item.memberId}
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
          isEmpty={memberList?.data?.length === 0 || false}
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
                <div className="tit-type2">회원 상세보기</div>
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
                  <button className="btn-type1 type1" onClick={() => handleDelete(member?.memberId)}>
                    삭제
                  </button>
                )}
              </div>
            </div>
            <ul className="tab-type1 tab5" data-evt="tab">
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
                  스킬
                </a>
              </li>
              <li className={tabValue === 3 ? 'on' : ''}>
                <a
                  href="#"
                  onClick={() => {
                    handleTab(3);
                    setIsEdit(false);
                  }}
                >
                  경험
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
                  배지
                </a>
              </li>{' '}
              <li className={tabValue === 5 ? 'on' : ''}>
                <a
                  href="#"
                  onClick={() => {
                    handleTab(5);
                    setIsEdit(false);
                  }}
                >
                  친구
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
                              : member?.profileImageUrl?.indexOf('http') > -1
                              ? member?.profileImageUrl
                              : `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${member?.profileImageUrl}`
                          }
                          // src={`${process.env['NEXT_PUBLIC_GENERAL_API_URL']}/images/${mentorInfo?.profileImageUrl}`}
                          alt={`${member?.typeName} ${member?.nickname}`}
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
                    <Profile mentorInfo={member} showDesc isOnlyImage />
                  )}
                </div>
                <div className="layout-grid">
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        회원 아이디<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('memberId')}
                          disabled
                          value={member?.memberId || ''}
                          onChange={onChangeMember}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        회원명<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          className="input-admin"
                          type="text"
                          {...methods.register('name')}
                          value={member?.name || ''}
                          onChange={onChangeMember}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">생일</div>
                      <div className="inp">
                        <input
                          className="input-admin"
                          type="text"
                          {...methods.register('birthday')}
                          value={member?.birthday || ''}
                          onChange={onChangeMember}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">닉네임</div>
                      <div className="inp">
                        <input
                          className="input-admin"
                          type="text"
                          {...methods.register('nickname')}
                          value={member?.nickname || ''}
                          onChange={onChangeMember}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        이메일<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('email')}
                          value={member?.email || ''}
                          onChange={onChangeMember}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">연령대</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('ageRange')}
                          value={member?.ageRange || ''}
                          onChange={onChangeMember}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        회원유형<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <select value={member?.type || ''} onChange={onChangeMember} name="type" disabled={!isEdit}>
                          {memberCodes?.data?.contents?.map(item => (
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
                        직군유형<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <select
                          value={member?.jobGroup || ''}
                          onChange={onChangeMember}
                          name="jobGroup"
                          disabled={!isEdit}
                        >
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
                      <div className="inp-tit">레벨</div>
                      <div className="inp">
                        <select value={member?.level || ''} onChange={onChangeMember} name="level" disabled={!isEdit}>
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
                      <div className="inp-tit">인증제공기관</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('authProviderName')}
                          value={member?.authProviderName || ''}
                          disabled
                          onChange={onChangeMember}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">이메일 수신 여부</div>
                      <div className="inp">
                        <select
                          value={member?.emailReceiveYn?.toString() || ''}
                          onChange={onChangeMember}
                          name="emailReceiveYn"
                          disabled={!isEdit}
                        >
                          <option value="true">Y</option>
                          <option value="false">N</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">문자 수신 여부</div>
                      <div className="inp">
                        <select
                          value={member?.smsReceiveYn?.toString() || ''}
                          onChange={onChangeMember}
                          name="smsReceiveYn"
                          disabled={!isEdit}
                        >
                          <option value="true">Y</option>
                          <option value="false">N</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">로그인 실패 횟수</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('loginFailCount')}
                          value={member?.loginFailCount?.toString() || ''}
                          onChange={onChangeMember}
                          disabled={!isEdit}
                        />
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
                          value={member?.createdAt || ''}
                          disabled
                          onChange={onChangeMember}
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
                          value={member?.creatorId || ''}
                          disabled
                          onChange={onChangeMember}
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
                          value={member?.updatedAt || ''}
                          disabled
                          onChange={onChangeMember}
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
                          value={member?.updaterId || ''}
                          disabled
                          onChange={onChangeMember}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tabValue === 2 && popupOpen && (
              <div className="tab-content" data-id="tabLink01">
                <div className="layout-grid">
                  <div className="grid-100 mt-3">
                    <div className="inpwrap">
                      <div className="inp-tit">연관 직군들</div>
                      <div className="inp">
                        {jobGroup?.data?.contents?.map(item => {
                          let isIncludeContent = false;
                          if (member?.jobGroup?.includes(item.id)) {
                            isIncludeContent = true;
                          }
                          return (
                            <span
                              key={item.id}
                              className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}
                            >
                              <Toggle
                                isActive
                                label={item.name}
                                name="relatedJobGroups"
                                type="checkBox"
                                checked={isIncludeContent}
                                value={item.id}
                                key={item.id}
                                disabled={!isEdit}
                                className={cx('seminar-jobgroup-area')}
                                onChange={e => handleCheckboxChange(e, 'relatedJobGroups')}
                              />
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="grid-100 mt-3">
                    <div className="inpwrap">
                      <div className="inp-tit">연관직무들</div>
                      <div className="inp">
                        {jobCodes?.data?.contents?.map(item => {
                          let isIncludeContent = false;
                          if (member?.job?.includes(item.id)) {
                            isIncludeContent = true;
                          }
                          return (
                            <span
                              key={item.id}
                              className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}
                            >
                              <Toggle
                                isActive
                                label={item.name}
                                name="relatedJobs"
                                type="checkBox"
                                checked={isIncludeContent}
                                value={item.id}
                                key={item.id}
                                className={cx('seminar-jobgroup-area')}
                                disabled={!isEdit}
                                onChange={e => handleCheckboxChange(e, 'relatedJobs')}
                              />
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="grid-100 mt-3">
                    <div className="inpwrap">
                      <div className="inp-tit">연관 레벨들</div>
                      <div className="inp">
                        {levelInfo.map(item => {
                          let isIncludeContent = false;
                          if (member?.level === item.level) {
                            isIncludeContent = true;
                          }
                          return (
                            <span
                              key={item.level}
                              className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}
                            >
                              <Toggle
                                isActive
                                label={`${item.level}레벨`}
                                name="relatedLevels"
                                checked={isIncludeContent}
                                disabled={!isEdit}
                                type="checkBox"
                                value={item.level}
                                onChange={e => handleCheckboxChange(e, 'relatedLevels')}
                              />
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FormProvider>
      </div>
    </div>
  );
}

export default MembersTemplate;

const levelInfo = [{ level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }, { level: 5 }];
