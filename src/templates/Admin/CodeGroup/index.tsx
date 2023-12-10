import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import * as yup from 'yup';
import dayjs from 'dayjs';
import Image from 'next/image';
import moment from 'moment';

import { yupResolver } from '@hookform/resolvers/yup';
import { Profile, AdminPagination, Table, SmartFilter, Button, Toggle, Editor } from '../../../stories/components';
import { TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useUploadImage } from 'src/services/image/image.mutations';
import { SearchParamsProps } from 'pages/admin/codeGroup';

const cx = classNames.bind(styles);

interface CodeGroupTemplateProps {
  codeGroupList?: any;
  skillsList?: any;
  experience?: any;
  jobGroup?: any;
  jobs?: any;
  jobCodes?: any;
  contentJobType?: any;
  codeGroupData?: any;
  pageProps?: any;
  onCodeGroupInfo?: (codeGroupId: string) => void;
  onDeleteCodeGroup?: (codeGroupId: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  onSearch?: (keyword: any) => void;
  params: SearchParamsProps;
  setParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
}

export function CodeGroupTemplate({
  codeGroupList,
  skillsList,
  experience,
  jobGroup,
  jobs,
  jobCodes,
  contentJobType,
  codeGroupData,
  pageProps,
  params,
  onCodeGroupInfo,
  onDeleteCodeGroup,
  onSave,
  onAdd,
  onSearch,
  setParams,
}: CodeGroupTemplateProps) {
  const COLGROUP = ['5%', '5%', '5%', '5%', '5%', '5%'];
  const HEADS = ['코드그룹아이디', '코드그룹명', '설명', '정렬순서', '등록일시', '수정일시'];

  const FIELDS = [
    { name: '코드그룹아이디', field: 'id', type: 'text' },
    { name: '코드그룹명', field: 'name', type: 'text' },
    { name: '설명', field: 'description', type: 'text' },
    { name: '정렬순서', field: 'order', type: 'text' },
    // {
    //   name: '등록일시',
    //   field: 'createdDate',
    //   type: 'fromToDate',
    //   fieldNames: ['createdFrom', 'createdTo'],
    // },
    // {
    //   name: '수정일시',
    //   field: 'updateDate',
    //   type: 'fromToDate',
    //   fieldNames: ['updateDateFrom', 'updateDateTo'],
    // },
  ];

  const { mutate: onSaveProfileImage, data: profileImage, isSuccess } = useUploadImage();

  const [introduceEditor, setIntroduceEditor] = useState<string>('');
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [codeGroup, setCodeGroup] = useState<any>({});
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
  const codeGroupSaveSchema = yup.object().shape({
    id: yup.string().notRequired(),
    name: yup.string().notRequired(),
    description: yup.string().notRequired(),
    order: yup.string().notRequired(),
  });

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(codeGroupSaveSchema),
  });

  // useEffect(() => {
  //   codeGroupData && setCodeGroup(codeGroupData.data);
  // }, [codeGroupData]);

  const onShowPopup = (codeGroupId: string) => {
    const result = codeGroupList?.data?.data?.contents?.find(item => item?.id === codeGroupId);
    let param = result;

    if (result) {
      param = {
        ...result,
      };
    }
    setContent(param);
    setPopupOpen(true);
    setIsRegisterPopupOpen(false);
  };

  // const onShowPopup = (codeGroupId: string) => {
  //   onCodeGroupInfo && onCodeGroupInfo(codeGroupId);
  //   setPopupOpen(true);
  //   setIsRegisterPopupOpen(false);
  // };

  const onChangeCodeGroup = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setContent({
      ...content,
      ...data,
    });
  };

  const handleDelete = (codeGroupId: string) => {
    setPopupOpen(false);
    setContent({});
    onDeleteCodeGroup && onDeleteCodeGroup(codeGroupId);
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
      ...content,
      recommendJobGroups: recommendJobGroupsIds,
      recommendJobs: recommendJobsIds,
      recommendLevels: recommendLevelsIds,
      relatedExperiences: experienceIds,
      relatedSkills: skillIds,
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

    if (params.content === undefined || params.content?.length === 0) {
      alert('질문을 입력해주세요.');
      return;
    }

    if (params.articleUrl === undefined || params.articleUrl?.length === 0) {
      alert('아티클URL을 입력해주세요.');
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
      <h2 className="tit-type1">코드그룹관리</h2>
      <div className="path">
        <span>Home</span> <span>코드그룹목록</span>
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
          items={codeGroupList?.data?.data?.contents?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.id)}>
                <td className="magic" title={item.id}>
                  {item.id}
                </td>
                <td className="magic" title={item.name}>
                  {item.name}
                </td>
                <td className="magic" title={item.description}>
                  {item.description}
                </td>
                <td className="magic" title={item.order}>
                  {item.order}
                </td>
                <td className="magic" title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
                <td className="magic" title={dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={codeGroupList?.data?.length === 0 || false}
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
                <div className="tit-type2">코드 그룹 상세보기</div>
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
                  <button className="btn-type1 type1" onClick={() => handleDelete(content?.id)}>
                    삭제
                  </button>
                )}
              </div>
            </div>
            <div className="tab-content" data-id="tabLink01">
              <div className="layout-grid">
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">코드상세아이디</div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        {...methods.register('id')}
                        disabled={!isEdit}
                        value={content?.id || ''}
                        onChange={onChangeCodeGroup}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">코드그룹명</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('name')}
                        value={content?.name || ''}
                        onChange={onChangeCodeGroup}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">설명</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('description')}
                        value={content?.description}
                        onChange={onChangeCodeGroup}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">정렬순서</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('order')}
                        value={content?.order || 0}
                        onChange={onChangeCodeGroup}
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
                        value={content?.createdAt || ''}
                        disabled
                        onChange={onChangeCodeGroup}
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
                        value={content?.updatedAt || ''}
                        disabled
                        onChange={onChangeCodeGroup}
                      />
                    </div>
                  </div>
                </div>
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
                <div className="tit-type2">코드 등록</div>
              </div>
              <div className="right">
                <button className="btn-type1 type2" onClick={handleOnAdd}>
                  저장
                </button>
              </div>
            </div>
            <div className="tab-content" data-id="tabLink01">
              <div className="layout-grid">
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      코드상세아이디<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="id"
                        value={regitserValues?.id || ''}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      코드그룹명<span className="star">*</span>
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

                <div className="grid-25">
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

                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      정렬순서<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="order"
                        value={regitserValues?.order || ''}
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

export default CodeGroupTemplate;
