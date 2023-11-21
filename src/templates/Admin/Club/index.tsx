import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import * as yup from 'yup';
import dayjs from 'dayjs';
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Profile,
  AdminPagination,
  Table,
  SmartFilter,
  Button,
  Toggle,
  ResumeStory,
  Editor,
} from '../../../stories/components';
import SectionHeader from '../../../stories/components/SectionHeader';
import { TextField } from '@mui/material';
import { DesktopDatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useUploadImage } from 'src/services/image/image.mutations';
import { SearchParamsProps } from 'pages/admin/club';

const cx = classNames.bind(styles);

interface ClubTemplateProps {
  clubList?: any;
  skillsList?: any;
  experience?: any;
  jobGroup?: any;
  jobs?: any;
  jobCodes?: any;
  clubData?: any;
  pageProps?: any;
  onClubInfo?: (clubSequence: string) => void;
  onDeleteClub?: (clubSequence: string) => void;
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
  jobs,
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
  const COLGROUP = ['17%', '10%', '12%', '7%', '7%', '6%', '4%', '6%', '6%', '6%', '6%', '8%'];
  const HEADS = [
    '클럽아이디',
    '리더아이디',
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

  const LEVELS = [
    { level: 1, desc: '상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요' },
    { level: 2, desc: '상용서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능' },
    { level: 3, desc: '상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능' },
    { level: 4, desc: '다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더' },
    { level: 5, desc: '본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩' },
  ];

  const dayGroup = [
    {
      id: 'MONDAY',
      groupId: '0001',
      name: '월',
      description: '월',
      order: 1,
    },
    {
      id: 'TUESDAY',
      groupId: '0001',
      name: '화',
      description: '화',
      order: 2,
    },
    {
      id: 'WEDNESDAY',
      groupId: '0001',
      name: '수',
      description: '수',
      order: 3,
    },
    {
      id: 'THURSDAY',
      groupId: '0001',
      name: '목',
      description: '목',
      order: 3,
    },
    {
      id: 'FRIDAY',
      groupId: '0001',
      name: '금',
      description: '금',
      order: 3,
    },
    {
      id: 'SATURDAY',
      groupId: '0001',
      name: '토',
      description: '토',
      order: 4,
    },
    {
      id: 'SUNDAY',
      groupId: '0001',
      name: '일',
      description: '일',
      order: 4,
    },
  ];

  const privateGroup = [
    {
      id: '0100',
      groupId: '0001',
      name: '공개',
      description: '공개',
      active: true,
      order: 1,
    },
    {
      id: '0200',
      groupId: '0001',
      name: '비공개',
      description: '비공개',
      active: false,
      order: 2,
    },
  ];

  const POPUP_COLGROUP = ['15%', '10%', '15%', '15%', '10%'];
  const POPUP_HEADS = ['신청자 아이디', '이름', '닉네임', '전화번호', '등록일시'];

  const TAB2_COLGROUP = ['15%', '15%', '15%', '15%', '15%', '15%'];
  const TAB2_HEADS = ['신청자ID', '이름', '닉네임', '상태', '가입신청일시', '가입승인일시'];

  const TAB3_COLGROUP = ['10%', '10%', '5%', '7%', '8%', '8%'];
  const TAB3_HEADS = ['회원UUID', '닉네임', '상태', '학습 횟수', '답변 좋아요 수', '가입신청일시'];

  const TAB4_COLGROUP = ['15%', '15%', '15%', '15%', '15%', '15%'];
  const TAB4_HEADS = ['퀴즈순서', '퀴즈 좋아요 수', '답변 수', '발행 여부', '대표 여부', '발행일시'];

  const FIELDS = [
    { name: '클럽아이디', field: 'id', type: 'text' },
    { name: '클럽명', field: 'name', type: 'text' },
    { name: '추천직군', field: 'recommendJobGroups', type: 'text' },
    { name: '추천직무', field: 'recommendJobs', type: 'text' },
    { name: '추천레벨', field: 'recommendLevels', type: 'text' },
    { name: '공개여부', field: 'isPublic', type: 'text' },
    { name: '모집회원수', field: 'recruitMemberCount', type: 'text' },
    { name: '모집된 회원수', field: 'studyCount', type: 'text' },
    { name: '퀴즈시작일', field: 'startAtTo', type: 'text' },
    { name: '상태', field: 'clubStatus', type: 'text' },
    { name: '등록일시', field: 'createdAtTo', type: 'text' },
  ];

  const { mutate: onSaveClubImage, data: clubImage, isSuccess } = useUploadImage();

  const [introduceEditor, setIntroduceEditor] = useState<string>('');
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [popupDetailOpen, setPopupDetailOpen] = useState<boolean>(false);
  const [clubQuizIndex, setClubQuizIndex] = useState<number>(0);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [club, setClub] = useState<any>({});
  const [clubQuizzes, setClubQuizzes] = useState<any>({});
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [clubImageUrl, setClubImageUrl] = useState(null);
  const [tabValue, setTabValue] = useState<number>(1);
  const [content, setContent] = useState<any>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<string[]>([]);
  const [recommendJobGroupsIds, setrecommendJobGroupsIds] = useState<string[]>([]);
  const [recommendJobsIds, setrecommendJobsIds] = useState<string[]>([]);
  const [recommendLevelsIds, setrecommendLevelsIds] = useState<string[]>([]);
  const [dayIds, setdayIds] = useState<string[]>([]);

  const [tempImageUrl1, setTempImageUrl1] = useState(null);
  const [tempImageUrl2, setTempImageUrl2] = useState(null);
  const [tempImageUrl3, setTempImageUrl3] = useState(null);

  const {
    mutate: onSaveImage1,
    data: imageUrl1,
    isSuccess: imageSuccess1,
    isLoading: imageLoading1,
  } = useUploadImage();
  const { mutate: onSaveImage2, data: imageUrl2, isSuccess: imageSuccess2 } = useUploadImage();
  const { mutate: onSaveImage3, data: imageUrl3, isSuccess: imageSuccess3 } = useUploadImage();

  const {
    mutate: onSaveRegisterImage1,
    data: registerImageUrl1,
    isSuccess: isRegisterImageSuccess1,
    isLoading: isRegisterImageLoading1,
  } = useUploadImage();
  const {
    mutate: onSaveRegisterImage2,
    data: registerImageUrl2,
    isSuccess: isRegisterImageLoading2,
  } = useUploadImage();
  const {
    mutate: onSaveRegisterImage3,
    data: registerImageUrl3,
    isSuccess: isRegisterImageLoading3,
  } = useUploadImage();

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
    if (clubData) {
      setExperienceIds(clubData?.data?.relatedExperiences?.map((item, index) => item) || []);
      setSkillIds(clubData?.data?.relatedSkills?.map((item, index) => item) || []);
      setrecommendJobGroupsIds(clubData?.data?.recommendJobGroups?.map((item, index) => item) || []);
      setrecommendJobsIds(clubData?.data?.recommendJobs?.map((item, index) => item) || []);
      setrecommendLevelsIds(clubData?.data?.recommendLevels?.map((item, index) => item) || []);
      setdayIds(clubData?.data?.studyCycle?.map((item, index) => item) || []);
    } else {
      setExperienceIds([]);
      setSkillIds([]);
      setrecommendJobGroupsIds([]);
      setrecommendJobsIds([]);
      setrecommendLevelsIds([]);
      setdayIds([]);
    }
  }, [clubData]);

  useEffect(() => {
    clubData && setClubQuizzes(clubData.data.clubQuizzes);
  }, [clubData]);

  const onShowPopup = (clubSequence: string) => {
    // 사용자 조회
    onClubInfo && onClubInfo(clubSequence);

    // const result = skillsList?.data?.data?.find(item => item?.relatedJobGroups === memberData?.data?.jobGroup);
    // setContent(result);
    setPopupOpen(true);
  };

  const onShowPopupDetail = (clubQuizIndex: number) => {
    setClubQuizIndex(clubQuizIndex);
    setPopupDetailOpen(true);
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
      clubImageUrl: clubImage?.toString()?.slice(1) || club?.clubImageUrl,
      recommendJobGroups: recommendJobGroupsIds,
      recommendJobs: recommendJobsIds,
      recommendLevels: recommendLevelsIds,
      studyCycle: dayIds,
      description: introduceEditor,
    };

    onSave && onSave(params);
  };

  const onError = (error: any) => {
    console.log(error);
  };

  const readFile = (file, key) => {
    if (popupOpen) {
      const reader = new FileReader();
      reader.onload = e => {
        const image = e.target.result;
        switch (key) {
          case 'imageUrl1':
            onSaveImage1(file);
            setTempImageUrl1(image);
            break;
          case 'imageUrl2':
            onSaveImage2(file);
            setTempImageUrl2(image);
            break;
          case 'imageUrl3':
            onSaveImage3(file);
            setTempImageUrl3(image);
            break;
          default:
            setClubImageUrl(image);
            onSaveClubImage(file);
            break;
        }
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = e => {
        const image = e.target.result;
        switch (key) {
          case 'imageUrl1':
            onSaveRegisterImage1(file);
            setTempImageUrl1(image);
            break;
          case 'imageUrl2':
            onSaveRegisterImage2(file);
            setTempImageUrl2(image);
            break;
          case 'imageUrl3':
            onSaveRegisterImage3(file);
            setTempImageUrl3(image);
            break;
          default:
            setClubImageUrl(image);
            onSaveClubImage(file);
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onFileChange = (files, key) => {
    if (!files || files.length === 0) return;
    readFile(files[0], key);
  };

  const imageUploadItem = (title, key, imageUrl) => {
    return (
      <div className={cx('seminar-image-item')} key={key}>
        <span className={cx('seminar-image-item__title', 'area-title')}>
          {title} <span className={cx('seminar-image-item__star')}>*</span>
        </span>
        <span className={cx('seminar-image-item__file-size', 'area-desc')}>500kb 이상</span>
        <div className={cx('seminar-image-item__upload-wrap')}>
          {imageUrl ? <img src={imageUrl} alt={title} /> : <></>}
          {popupOpen && !isEdit ? (
            <Button type="button" color="secondary" disabled={!isEdit}>
              <label htmlFor={`input-file-${key}`}>Image Upload</label>
              <input
                hidden
                disabled={!isEdit}
                id={`input-file-${key}`}
                accept="image/*"
                type="file"
                onChange={e => onFileChange(e.target?.files, key)}
              />
            </Button>
          ) : (
            <Button type="button" color="secondary">
              <label htmlFor={`input-file-${key}`}>Image Upload</label>
              <input
                hidden
                id={`input-file-${key}`}
                accept="image/*"
                type="file"
                onChange={e => onFileChange(e.target?.files, key)}
              />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const onToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.currentTarget;

    if (name === 'skillIds') {
      const result = [...skillIds];

      if (result.indexOf(value) > -1) {
        result.splice(result.indexOf(value), 1);
      } else {
        result.push(value);
      }
      setSkillIds(result);
    } else if (name === 'experienceIds') {
      const result = [...experienceIds];

      if (result.indexOf(value) > -1) {
        result.splice(result.indexOf(value), 1);
      } else {
        result.push(value);
      }

      setExperienceIds(result);
    } else if (name === 'recommendJobGroups') {
      const result = [...recommendJobGroupsIds];

      if (result.indexOf(value) > -1) {
        result.splice(result.indexOf(value), 1);
      } else {
        result.push(value);
      }

      setrecommendJobGroupsIds(result);
    } else if (name === 'recommendJobs') {
      const result = [...recommendJobsIds];

      if (result.indexOf(value) > -1) {
        result.splice(result.indexOf(value), 1);
      } else {
        result.push(value);
      }

      setrecommendJobsIds(result);
    } else if (name === 'recommendLevels') {
      const result = [...recommendLevelsIds];

      if (result.indexOf(value) > -1) {
        result.splice(result.indexOf(value), 1);
      } else {
        result.push(value);
      }

      setrecommendLevelsIds(result);
    } else if (name === 'dayIds') {
      const result = [...dayIds];

      if (result.indexOf(value) > -1) {
        result.splice(result.indexOf(value), 1);
      } else {
        result.push(value);
      }

      setdayIds(result);
    }
  };

  const clubStatusTxt = clubStatus => {
    let clubStatusTxt;

    switch (clubStatus) {
      case '0004':
        clubStatusTxt = '진행중';
        break;
      case '0005':
        clubStatusTxt = '진행완료';
        break;
      default:
        clubStatusTxt = '진행예정';
        break;
    }

    return clubStatusTxt;
  };

  const clubMembersStatusTxt = clubMembersStatus => {
    let clubMembersStatusTxt;

    switch (clubMembersStatus) {
      case '0001':
        clubMembersStatusTxt = '승인';
        break;
      case '0002':
        clubMembersStatusTxt = '거절';
        break;
      case '0003':
        clubMembersStatusTxt = '강퇴';
        break;
      case '0009':
        clubMembersStatusTxt = '탈퇴';
        break;
      default:
        clubMembersStatusTxt = '가입신청';
        break;
    }

    return clubMembersStatusTxt;
  };

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
            {/* <div className={cx('date')}>
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
            </div> */}
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
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.sequence)} style={{ textAlign: 'left' }}>
                <td className="magic" title={item.clubId}>
                  {item.clubId}
                </td>
                <td className="magic" title={item.leaderNickname}>
                  {item.leaderNickname}
                </td>
                <td className="magic" title={item.name} style={{ textAlign: 'left' }}>
                  {item.name}
                </td>
                <td className="magic" title={item.recommendJobGroupNames}>
                  {item.recommendJobGroupNames}
                </td>
                <td className="magic" title={item.recommendJobNames?.join(', ')}>
                  {item.recommendJobNames?.join(', ')}
                </td>
                <td className="magic" title={item.recommendLevels}>
                  {item.recommendLevels?.length === 5 ? '모든' : item.recommendLevels?.sort().join(',') || 0}
                </td>
                <td className="magic" title={item.isPublic ? 'Y' : 'N'}>
                  {item.isPublic ? 'Y' : 'N'}
                </td>
                <td className="magic" title={item.recruitMemberCount}>
                  {item.recruitMemberCount || 0}
                </td>
                <td className="magic" title={item.studyCount}>
                  {item.studyCount || 0}
                </td>
                <td className="magic" title={dayjs(item.startAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.startAt).format('YYYY-MM-DD')}
                </td>
                <td className="magic" title={clubStatusTxt(item.clubStatus)}>
                  {clubStatusTxt(item.clubStatus)}
                </td>
                <td className="magic" title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.createdAt).format('YYYY-MM-DD')}
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
              {/* <li className={tabValue === 2 ? 'on' : ''}>
                <a
                  href="#"
                  onClick={() => {
                    handleTab(2);
                    setIsEdit(false);
                  }}
                >
                  클럽가입 승인/취소
                </a>
              </li>{' '} */}
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
                          name="clubId"
                          disabled
                          value={club?.id || ''}
                          onChange={onChangeClub}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        클럽 명<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          name="name"
                          value={club?.name || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        리더 닉네임<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          name="leaderNickname"
                          value={club?.leaderNickname || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        모집인원<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          name="recruitMemberCount"
                          value={club?.recruitMemberCount || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">공개 여부</div>
                      <div className="inp">
                        <select
                          value={club?.isPublic?.toString() || ''}
                          onChange={onChangeClub}
                          name="isPublic"
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
                      <div className="inp-tit">참여 코드</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('participationCode')}
                          value={club?.participationCode || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        상태<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <select
                          name="clubStatus"
                          onChange={onChangeClub}
                          value={club?.clubStatus || ''}
                          disabled={!isEdit}
                        >
                          <option value="0003">진행예정</option>
                          <option value="0004">진행중</option>
                          <option value="0005">진행완료</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid-100">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        추천직군<span className="star">*</span>
                      </div>

                      <div className="inp">
                        <div className={cx('skill__group')}>
                          {jobCodes?.data?.contents?.map((item, index) => {
                            return (
                              <Toggle
                                key={`recommendJobGroupsIds-${index}`}
                                label={item.name}
                                name="recommendJobGroups"
                                value={item.id}
                                onChange={onToggleChange}
                                className="mr-2 mt-2"
                                variant="small"
                                type="multiple"
                                isActive
                                isBorder
                                checked={
                                  !!recommendJobGroupsIds?.find(recommendJobGroups => recommendJobGroups === item.id)
                                }
                                disabled={!isEdit}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid-50 mt-3">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        추천직무<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <div className={cx('skill__group')}>
                          {jobs?.data?.contents?.map((item, index) => {
                            return (
                              <Toggle
                                key={`recommendJobsIds-${index}`}
                                label={item.name}
                                name="recommendJobs"
                                value={item.id}
                                onChange={onToggleChange}
                                className="mr-2 mt-2"
                                variant="small"
                                type="multiple"
                                isActive
                                isBorder
                                checked={!!recommendJobsIds?.find(recommendJobs => recommendJobs === item.id)}
                                disabled={!isEdit}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid-100">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        추천레벨<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <div className={cx('skill__group')}>
                          {LEVELS?.map((item, index) => {
                            return (
                              <Toggle
                                key={`recommendLevelsIds-${index}`}
                                label={`${item.level}레벨`}
                                name="recommendLevels"
                                value={item.level || ''}
                                onChange={onToggleChange}
                                className="mr-2 mt-2"
                                variant="small"
                                type="multiple"
                                isActive
                                isBorder
                                checked={
                                  !!recommendLevelsIds?.find(
                                    recommendLevels => parseInt(recommendLevels) === item.level,
                                  )
                                }
                                disabled={!isEdit}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid-100 mt-3">
                    <div className="inpwrap">
                      <div className="inp-tit">퀴즈 주기</div>
                      <div className="inp">
                        <div className={cx('filter-area')}>
                          <div className={cx('skill__group')}>
                            {dayGroup?.map((item, index) => {
                              return (
                                <Toggle
                                  key={`dayIds-${index}`}
                                  label={item.name}
                                  name="dayIds"
                                  value={item.id}
                                  onChange={onToggleChange}
                                  className="mr-2 mt-2 custom"
                                  variant="small"
                                  type="multiple"
                                  isActive
                                  isBorder
                                  checked={!!dayIds?.find(day => day === item.id)}
                                  disabled={!isEdit}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid-100 mt-3">
                    <div className="inpwrap">
                      <div className="inp-tit">관련 스킬들</div>
                      <div className="inp">
                        <div className={cx('filter-area')}>
                          <div className={cx('skill__group')}>
                            {skillsList?.data?.data?.map((item, index) => {
                              return (
                                <Toggle
                                  key={`skillIds-${index}`}
                                  label={item.name}
                                  name="skillIds"
                                  value={item.id}
                                  onChange={onToggleChange}
                                  className="mr-2 mt-2 custom"
                                  variant="small"
                                  type="multiple"
                                  isActive
                                  isBorder
                                  checked={!!skillIds?.find(skill => skill === item.id)}
                                  disabled={!isEdit}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid-100">
                    <div className="inpwrap">
                      <div className="inp-tit">관련 경험들</div>
                      <div className="inp">
                        <div className={cx('skill__group')}>
                          {experience?.data?.contents?.map((item, index) => {
                            return (
                              <Toggle
                                key={`experienceIds-${index}`}
                                label={item.name}
                                name="experienceIds"
                                value={item.id}
                                onChange={onToggleChange}
                                className="mr-2 mt-2"
                                variant="small"
                                type="multiple"
                                isActive
                                isBorder
                                checked={!!experienceIds?.find(experiences => experiences === item.name)}
                                disabled={!isEdit}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid-100 mt-5">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        클럽 소개<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <Editor
                          type="seminar"
                          data={club?.description || ''}
                          onChange={(event, editor) => {
                            setIntroduceEditor(editor.getData());
                          }}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit" style={{ height: 25 }}>
                        시작 일시<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            format="YYYY-MM-DD"
                            value={dayjs(club?.startAt) || ''}
                            className={cx('basic-info-page__picker')}
                            onChange={e => handlePickerChange(e, 'startAt')}
                            //renderInput={params => <TextField {...params} variant="standard" />}
                            disabled={!isEdit}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit" style={{ height: 25 }}>
                        종료 일시<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            format="YYYY-MM-DD"
                            value={dayjs(club?.endAt) || ''}
                            className={cx('basic-info-page__picker')}
                            onChange={e => handlePickerChange(e, 'endAt')}
                            //renderInput={params => <TextField {...params} variant="standard" />}
                            disabled={!isEdit}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                  {/* <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit" style={{ height: 25 }}>
                        접수 시작 일시<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            format="YYYY-MM-DD HH:mm"
                            value={dayjs(club?.seminarRegistrationStartDate) || ''}
                            className={cx('basic-info-page__picker')}
                            onChange={e => handlePickerChange(e, 'seminarRegistrationStartDate')}
                            //renderInput={params => <TextField {...params} variant="standard" />}
                            disabled={!isEdit}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div> */}
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit" style={{ height: 25 }}>
                        모집 종료 일시<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            format="YYYY-MM-DD"
                            value={dayjs(club?.recruitDeadlineAt) || ''}
                            className={cx('basic-info-page__picker')}
                            onChange={e => handlePickerChange(e, 'recruitDeadlineAt')}
                            //renderInput={params => <TextField {...params} variant="standard" />}
                            disabled={!isEdit}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                  {/* <div className="grid-100">
                    <div className="inpwrap">
                      <div className="inp">
                        <div className={cx('seminar-image-area')}>
                          <div className={cx('seminar-image-area__upload')}>
                            {imageUploadItem(
                              '멘토님 상반신 사진',
                              'imageUrl1',
                              tempImageUrl1 ||
                                `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${club?.imageUrl1}`,
                            )}
                            {imageUploadItem(
                              '세미나 장표 #1',
                              'imageUrl2',
                              tempImageUrl2 ||
                                `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${club?.imageUrl2}`,
                            )}
                            {imageUploadItem(
                              '세미나 장표 #2',
                              'imageUrl3',
                              tempImageUrl3 ||
                                `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${club?.imageUrl3}`,
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="grid-100 mt-5">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        소개<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <Editor
                          type="seminar"
                          data={club?.seminarIntroduction || ''}
                          onChange={(event, editor) => {
                            setIntroduceEditor(editor.getData());
                          }}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-100">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        커리큘럼<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <Editor
                          type="seminar"
                          data={club?.seminarCurriculum || ''}
                          onChange={(event, editor) => setCurriculumEditor(editor.getData())}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-100">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        FAQ<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <Editor
                          type="seminar"
                          data={club?.seminarFaq || ''}
                          onChange={(event, editor) => setFaqEditor(editor.getData())}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            )}

            {/* {tabValue === 2 && popupOpen && (
              <div className="tab-content" data-id="tabLink02">
                <hr className="h40" />
                <div className="data-type1" data-evt="table-on">
                  <Table
                    name="seminarMember"
                    colgroup={TAB2_COLGROUP}
                    heads={TAB2_HEADS}
                    items={clubList?.data?.data?.contents?.map((item, index) => {
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
            )} */}

            {/* 클럽회원 */}
            {tabValue === 3 && popupOpen && (
              <div className="tab-content" data-id="tabLink02">
                <hr className="h40" />
                <div className="data-type1" data-evt="table-on">
                  <Table
                    name="seminarMember"
                    colgroup={TAB3_COLGROUP}
                    heads={TAB3_HEADS}
                    items={club?.clubMembers?.map((item, index) => {
                      return (
                        <tr key={`clubuser-${index}`}>
                          <td>{item.memberUUID}</td>
                          <td>{item.nickName}</td>
                          <td>{clubMembersStatusTxt(item.status)}</td>
                          <td>{item.studyCount || 0}</td>
                          <td>{item.likeReactionCount || 0}</td>
                          <td>{dayjs(item.createdAt).format('YYYY-MM-DD')}</td>
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
                    items={club?.clubQuizzes?.map((item, index) => {
                      return (
                        <tr key={`clubquiz-${index}`} onClick={() => onShowPopupDetail(index)}>
                          <td>{item.order || 0}</td>
                          <td>{item.likeCount || 0}</td>
                          <td>{item.answerCount || 0}</td>
                          <td>{item.isPublished ? 'Y' : 'N'}</td>
                          <td>{item.isRepresentative ? 'Y' : 'N'}</td>
                          <td>{dayjs(item.publishDate).format('YYYY-MM-DD')}</td>
                        </tr>
                      );
                    })}
                    isEmpty={club?.length === 0 || false}
                  />

                  {popupDetailOpen && (
                    /*
                    clubQuizIndex
                    */
                    <div className="tab-content" data-id="tabLink01">
                      <div className="layout-grid">
                        <div className="grid-25">
                          <div className="inpwrap">
                            <div className="inp-tit">회원 UUID</div>
                            <div className="inp">
                              <input
                                type="text"
                                className="input-admin"
                                name="clubId"
                                disabled
                                value={clubQuizzes[clubQuizIndex].quiz?.memberUUID}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid-25">
                          <div className="inpwrap">
                            <div className="inp-tit">회원 아이디</div>
                            <div className="inp">
                              <input
                                type="text"
                                className="input-admin"
                                name="clubId"
                                disabled
                                value={clubQuizzes[clubQuizIndex].quiz?.memberId}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid-25">
                          <div className="inpwrap">
                            <div className="inp-tit">회원 명</div>
                            <div className="inp">
                              <input
                                type="text"
                                className="input-admin"
                                name="clubId"
                                disabled
                                value={clubQuizzes[clubQuizIndex].quiz?.memberName}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid-25">
                          <div className="inpwrap">
                            <div className="inp-tit">닉네임</div>
                            <div className="inp">
                              <input
                                type="text"
                                className="input-admin"
                                name="clubId"
                                disabled
                                value={clubQuizzes[clubQuizIndex].quiz?.memberNickname}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid-25">
                          <div className="inpwrap">
                            <div className="inp-tit">퀴즈 순서</div>
                            <div className="inp">
                              <input
                                type="text"
                                className="input-admin"
                                name="order"
                                disabled
                                value={clubQuizzes[clubQuizIndex].order}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid-25">
                          <div className="inpwrap">
                            <div className="inp-tit">활용 수</div>
                            <div className="inp">
                              <input
                                type="text"
                                className="input-admin"
                                name="clubId"
                                disabled
                                value={clubQuizzes[clubQuizIndex].quiz?.activeCount}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid-25">
                          <div className="inpwrap">
                            <div className="inp-tit">답변 수</div>
                            <div className="inp">
                              <input
                                type="text"
                                className="input-admin"
                                name="clubId"
                                disabled
                                value={clubQuizzes[clubQuizIndex].quiz?.answerCount}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid-25">
                          <div className="inpwrap">
                            <div className="inp-tit">대표 여부</div>
                            <div className="inp">
                              <select
                                value={clubQuizzes[clubQuizIndex].isRepresentative?.toString() || ''}
                                onChange={onChangeClub}
                                name="isRepresentative"
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
                            <div className="inp-tit">등록일자</div>
                            <div className="inp">
                              <input
                                type="text"
                                className="input-admin"
                                name="clubId"
                                disabled
                                value={clubQuizzes[clubQuizIndex].quiz?.createdAt}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid-25">
                          <div className="inpwrap">
                            <div className="inp-tit">수정일자</div>
                            <div className="inp">
                              <input
                                type="text"
                                className="input-admin"
                                name="clubId"
                                disabled
                                value={clubQuizzes[clubQuizIndex].quiz?.updatedAt}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid-100">
                          <div className="inpwrap">
                            <div className="inp-tit">질문</div>
                            <div className="inp">
                              <input
                                type="text"
                                className="input-admin"
                                name="clubId"
                                disabled
                                value={clubQuizzes[clubQuizIndex].quiz?.content}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid-100">
                          <div className="inpwrap">
                            <div className="inp-tit">아티클URL</div>
                            <div className="inp">
                              <input
                                type="text"
                                className="input-admin"
                                name="clubId"
                                disabled
                                value={clubQuizzes[clubQuizIndex].quiz?.articleUrl}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <div className="grid-100 mt-4">
                          <div className="inpwrap">
                            <div className="inp-tit">내용</div>
                            <div className="inp">
                              <Editor type="seminar" data={clubQuizzes[clubQuizIndex].quiz?.content || ''} disabled />
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  )}
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
