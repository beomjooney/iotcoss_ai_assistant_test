import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import * as yup from 'yup';
import dayjs from 'dayjs';
import Image from 'next/image';
import moment from 'moment';

import { yupResolver } from '@hookform/resolvers/yup';
import { Profile, AdminPagination, Table, SmartFilter, Button, Toggle, Editor } from '../../../../stories/components';
import { TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useUploadImage } from 'src/services/image/image.mutations';
import { SearchParamsProps } from 'pages/admin/contents/skill';

const cx = classNames.bind(styles);

interface SkillTemplateProps {
  badgeList?: any;
  skillsList?: any;
  experience?: any;
  jobGroup?: any;
  jobs?: any;
  jobCodes?: any;
  contentJobType?: any;
  badgeData?: any;
  pageProps?: any;
  onBadgeInfo?: (badgeId: string) => void;
  onDeleteBadge?: (badgeId: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  onSearch?: (keyword: any) => void;
  params: SearchParamsProps;
  setParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
}

export function BadgeTemplate({
  badgeList,
  skillsList,
  experience,
  jobGroup,
  jobs,
  jobCodes,
  contentJobType,
  badgeData,
  pageProps,
  params,
  onBadgeInfo,
  onDeleteBadge,
  onSave,
  onAdd,
  onSearch,
  setParams,
}: SkillTemplateProps) {
  const COLGROUP = ['7%', '7%', '13%', '25%', '10%', '10%'];
  const HEADS = ['배지아이디', '배지그룹', '배지명', '설명', '등록일시', '수정일시'];

  const FIELDS = [
    { name: '배지SEQ', field: 'badgeSequence', type: 'text' },
    { name: '배지ID', field: 'badgeId', type: 'text' },
    { name: '배지그룹', field: 'badgeGroupType', type: 'text' },
    { name: '배지명', field: 'name', type: 'text' },
  ];

  const BADGES = [
    { id: '0001', name: 'INVINCIBLE' },
    { id: '0002', name: 'MAKER' },
    { id: '0003', name: 'LEADER' },
    { id: '0004', name: 'CREW' },
    { id: '0005', name: 'RELATIONSHIP' },
    { id: '0006', name: 'COMMON' },
    { id: '0007', name: 'DEFAULT_NONE' },
  ];

  const { mutate: onSaveProfileImage, data: profileImage, isSuccess } = useUploadImage();

  const [introduceEditor, setIntroduceEditor] = useState<string>('');
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [badge, setBadge] = useState<any>({});
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [profileImageUrl, setProfilImageUrl] = useState(null);
  const [tabValue, setTabValue] = useState<number>(1);
  const [content, setContent] = useState<any>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<string[]>([]);
  const [recommendJobGroupsIds, setrecommendJobGroupsIds] = useState<string[]>([]);
  const [recommendJobsIds, setrecommendJobsIds] = useState<string[]>([]);
  const [recommendLevelsIds, setrecommendLevelsIds] = useState<string[]>([]);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState<boolean>(false);
  const [regitserValues, setRegisterValues] = useState<any>({});

  // TODO : 밸리데이션 추가 해야 함
  const skillSaveSchema = yup.object().shape({
    name: yup.string().notRequired(),
    description: yup.string().notRequired(),
    memberNickname: yup.string().notRequired(),
    imageUrl: yup.string().notRequired(),
    trendLevel: yup.string().notRequired(),
    activeLevel: yup.string().notRequired(),
  });

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(skillSaveSchema),
  });

  useEffect(() => {
    badgeData && setBadge(badgeData.data);
    if (badgeData) {
      setExperienceIds(badgeData?.data?.relatedExperiences?.map((item, index) => item) || []);
      setSkillIds(badgeData?.data?.relatedSkills?.map((item, index) => item) || []);
      setrecommendJobGroupsIds(badgeData?.data?.relatedJobGroups?.map((item, index) => item) || []);
      setrecommendJobsIds(badgeData?.data?.relatedJobs?.map((item, index) => item) || []);
      setrecommendLevelsIds(badgeData?.data?.relatedLevels?.map((item, index) => item) || []);
    } else {
      setExperienceIds([]);
      setSkillIds([]);
      setrecommendJobGroupsIds([]);
      setrecommendJobsIds([]);
      setrecommendLevelsIds([]);
    }
  }, [badgeData]);

  const onShowPopup = (badgeId: string) => {
    onBadgeInfo && onBadgeInfo(badgeId);
    setPopupOpen(true);
    setIsRegisterPopupOpen(false);
  };

  const onChangeBadge = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setBadge({
      ...badge,
      ...data,
    });
  };

  const handleDelete = (badgeId: string) => {
    setPopupOpen(false);
    setBadge({});
    onDeleteBadge && onDeleteBadge(badgeId);
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

  const onSmartFilterSearch = (searchParms: any) => {
    onSearch && onSearch(searchParms);
  };

  const handleSave = (data: any) => {
    const params = {
      ...data,
      ...badge,
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
    } else if (name === 'relatedJobGroups') {
      const result = [...recommendJobGroupsIds];

      if (result.indexOf(value) > -1) {
        result.splice(result.indexOf(value), 1);
      } else {
        result.push(value);
      }

      setrecommendJobGroupsIds(result);
    } else if (name === 'relatedJobs') {
      const result = [...recommendJobsIds];

      if (result.indexOf(value) > -1) {
        result.splice(result.indexOf(value), 1);
      } else {
        result.push(value);
      }

      setrecommendJobsIds(result);
    } else if (name === 'relatedLevels') {
      const result = [...recommendLevelsIds];

      if (result.indexOf(value) > -1) {
        result.splice(result.indexOf(value), 1);
      } else {
        result.push(value);
      }

      setrecommendLevelsIds(result);
    }
  };

  const handleRegister = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setRegisterValues({
      ...regitserValues,
      ...data,
    });
  };

  const onShowUpRegisterPopUp = event => {
    setPopupOpen(false);
    setIsRegisterPopupOpen(true);
  };

  const closeRegisterPopup = () => {
    setRegisterValues({});
    setIntroduceEditor('');
    setIsRegisterPopupOpen(false);
  };

  const handleOnAdd = () => {
    let params = { ...regitserValues };
    //const registDate = moment().format('YYYY-MM-DD hh:mm');

    params = {
      ...regitserValues,
      recommendJobGroups: recommendJobGroupsIds,
      recommendJobs: recommendJobsIds,
      recommendLevels: recommendLevelsIds,
      relatedSkills: skillIds,
      relatedExperiences: experienceIds,
      //registDate: `${registDate}:00.000`,
    };

    if (params.name === undefined || params.name?.length === 0) {
      alert('스킬명을 입력해주세요.');
      return;
    }

    if (params.description === undefined || params.description?.length === 0) {
      alert('설명을 입력해주세요.');
      return;
    }

    if (params.recommendJobs?.length === 0) {
      alert('추천 직무를 선택해주세요.');
      return;
    }

    if (params.recommendLevels?.length === 0) {
      alert('추천 레벨을 선택해주세요.');
      return;
    }

    onAdd && onAdd(params);
  };

  return (
    <div className="admin-content">
      <h2 className="tit-type1">배지관리</h2>
      <div className="path">
        <span>Home</span> <span>배지목록</span>
      </div>

      <div className="data-top">
        <div className="left">
          <button className="btn-type1 type1" onClick={event => onShowUpRegisterPopUp(event)}>
            등록
          </button>
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
                  name="keyword"
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
          items={badgeList?.data?.data?.contents?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.badgeSequence)}>
                <td className="magic" title={item.badgeId}>
                  {item.badgeId}
                </td>
                <td className="magic" title={item.badgeGroupTypeName}>
                  {item.badgeGroupTypeName}
                </td>
                <td className="magic" title={item.name}>
                  {item.name}
                </td>
                <td className="magic" title={item.description}>
                  {item.description}
                </td>
                <td className="magic" title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>{' '}
                <td className="magic" title={dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={badgeList?.data?.length === 0 || false}
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
                <div className="tit-type2">배지 상세보기</div>
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
                  <button className="btn-type1 type1" onClick={() => handleDelete(badge?.id)}>
                    삭제
                  </button>
                )}
              </div>
            </div>
            <div className="tab-content" data-id="tabLink01">
              <div className="layout-grid">
                <div className="grid-33">
                  <div className="inpwrap">
                    <div className="inp-tit">배지 아이디</div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        {...methods.register('badgeId')}
                        disabled
                        value={badge?.badgeId || ''}
                        onChange={onChangeBadge}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-33">
                  <div className="inpwrap">
                    <div className="inp-tit">배지그룹타입</div>
                    <div className="inp">
                      <select
                        className="input-admin"
                        value={badge?.badgeGroupTypeName || ''}
                        onChange={onChangeBadge}
                        name="badgeGroupTypeName"
                        disabled={!isEdit}
                      >
                        {BADGES?.map(item => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid-33">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      배지명<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('name')}
                        value={badge?.name || ''}
                        onChange={onChangeBadge}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      설명<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('description')}
                        value={badge?.description}
                        onChange={onChangeBadge}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      이미지URL<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('imageUrl')}
                        value={badge?.imageUrl}
                        onChange={onChangeBadge}
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
                        value={badge?.updatedAt || ''}
                        disabled
                        onChange={onChangeBadge}
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
                        value={badge?.updatedAt || ''}
                        disabled
                        onChange={onChangeBadge}
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="grid-100 mt-4">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      내용<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <Editor
                        type="seminar"
                        data={badge?.content || ''}
                        onChange={(event, editor) => {
                          setIntroduceEditor(editor.getData());
                        }}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </FormProvider>
      </div>

      {isRegisterPopupOpen && (
        <div className={cx('side-layer', isRegisterPopupOpen ? 'open' : '')} id="sidePop2">
          <div className="dim"></div>
          <div className="side-contents">
            <div className="layer-top">
              <div className="left" style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: 30, marginRight: 30 }}>
                  <button onClick={() => closeRegisterPopup()}>
                    <i className="ico i-x"></i>
                  </button>
                </div>
                <div className="tit-type2">배지 등록</div>
              </div>
              <div className="right">
                <button className="btn-type1 type2" onClick={handleOnAdd}>
                  저장
                </button>
              </div>
            </div>
            <div className="tab-content" data-id="tabLink01">
              <div className="layout-grid">
                <div className="grid-33">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      배지아이디<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="badgeId"
                        value={regitserValues?.badgeId || ''}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-33">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      배지그룹<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="badgeGroupType"
                        value={regitserValues?.badgeGroupType || ''}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-33">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      배지명<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="name"
                        value={regitserValues?.name || ''}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      설명<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="description"
                        value={regitserValues?.description || ''}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      이미지URL<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="imageUrl"
                        value={regitserValues?.imageUrl || ''}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BadgeTemplate;
