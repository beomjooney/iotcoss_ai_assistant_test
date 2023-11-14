import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import {
  AdminPagination,
  Editor,
  SmartFilter,
  Table,
  Toggle,
  Textfield,
  Button,
  Profile,
} from '../../../stories/components';
import dayjs from 'dayjs';
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { useStore } from 'src/store';
import { usePlaceTypes, useJobs } from 'src/services/code/code.queries';
import { SeminarContent } from 'src/models/recommend';

import { FormProvider, useForm } from 'react-hook-form';
import Image from 'next/image';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUploadImage } from 'src/services/image/image.mutations';
import { SearchParamsProps } from 'pages/admin/club';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const cx = classNames.bind(styles);

interface ClubQuizTemplateProps {
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

export function AdminClubQuizTemplate({
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
}: ClubQuizTemplateProps) {
  const COLGROUP = ['15%', '15%', '15%', '15%', '15%', '15%', '15%'];
  const HEADS = ['퀴즈순서', '학습주차', '발행일시', '퀴즈 좋아요 수', '답변 수', '질문내용', '대표 여부'];
  const POPUP_COLGROUP = ['15%', '10%', '15%', '15%', '10%'];
  const POPUP_HEADS = ['신청자 아이디', '이름', '닉네임', '전화번호', '등록일시'];

  const TAB2_COLGROUP = ['15%', '15%'];
  const TAB2_HEADS = ['회원명', '타입(좋아요/원픽)'];

  const TAB3_COLGROUP = ['15%', '15%', '15%', '15%', '15%', '16%', '15%'];
  const TAB3_HEADS = ['회원명', '답변상태', '이해상태', '답변 댓글 수', '답변 원픽 수', '답변 좋아요 수', '사전답변'];

  const TAB4_COLGROUP = ['15%'];
  const TAB4_HEADS = ['내용'];

  const TAB5_COLGROUP = ['15%', '15%'];
  const TAB5_HEADS = ['회원명', '타입(좋아요/원픽)'];

  const LEVELS = [
    { level: 1, desc: '상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요' },
    { level: 2, desc: '상용서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능' },
    { level: 3, desc: '상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능' },
    { level: 4, desc: '다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더' },
    { level: 5, desc: '본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩' },
  ];

  const FIELDS = [
    { name: '클럽아이디', field: 'seminarId', type: 'text' },
    { name: '클럽명', field: 'seminarTitle', type: 'text' },
    { name: '추천직군', field: 'seminarSubTitle', type: 'text' },
    { name: '추천직무', field: 'seminarIntroduction', type: 'text' },
    { name: '추천레벨', field: 'description', type: 'text' },
    { name: '설명', field: 'seminarStatus', type: 'choice' },
    { name: '공개여부', field: 'seminarType', type: 'choice' },
    { name: '모집회원수', field: 'organizerMemberId', type: 'text' },
    { name: '퀴즈시작일', field: 'lecturerMemberId', type: 'text' },
    { name: '퀴즈종료일', field: 'lecturerName', type: 'text' },
    { name: '학습주수', field: 'recommendJobGroups', type: 'text' },
    { name: '학습주기', field: 'recommendJobGroups', type: 'text' },
    { name: '학습주수', field: 'recommendJobGroups', type: 'text' },
    { name: '상태', field: 'recommendLevels', type: 'text' },
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

  const clubCodes = [];

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
      searchKeyword: value,
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

  return (
    <div className="content">
      <h2 className="tit-type1">클럽퀴즈관리</h2>
      <div className="path">
        <span>Home</span> <span>클럽퀴즈목록</span>
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
                <div className="tit-type2">클럽퀴즈 상세보기</div>
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
                  클럽퀴즈 리액션
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
                  클럽 퀴즈 답변
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
                  클럽 퀴즈 답변 댓글
                </a>
              </li>
              <li className={tabValue === 5 ? 'on' : ''}>
                <a
                  href="#"
                  onClick={() => {
                    handleTab(5);
                    setIsEdit(false);
                  }}
                >
                  클럽 퀴즈 답변 리액션
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

            {/* 클럽퀴즈리액션 */}
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
                        </tr>
                      );
                    })}
                    isEmpty={clubList?.length === 0 || false}
                  />
                </div>
              </div>
            )}

            {/* 클럽퀴즈답변 */}
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
                          <td></td>
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

            {/* 클럽퀴즈 답변 댓글 */}
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
                        </tr>
                      );
                    })}
                    isEmpty={club?.length === 0 || false}
                  />
                </div>
              </div>
            )}

            {/* 클럽퀴즈 답변 댓글 */}
            {tabValue === 5 && popupOpen && (
              <div className="tab-content" data-id="tabLink02">
                <hr className="h40" />
                <div className="data-type1" data-evt="table-on">
                  <Table
                    name="seminarMember"
                    colgroup={TAB5_COLGROUP}
                    heads={TAB5_HEADS}
                    items={levelInfo?.map((item, index) => {
                      return (
                        <tr key={`clubquiz-${index}`}>
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

export default AdminClubQuizTemplate;

const levelInfo = [{ level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }, { level: 5 }];
