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
import { DesktopDatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useUploadImage } from 'src/services/image/image.mutations';
import { SearchParamsProps } from 'pages/admin/alarm';

const cx = classNames.bind(styles);

interface AlarmTemplateProps {
  alarmList?: any;
  skillsList?: any;
  experience?: any;
  jobGroup?: any;
  jobs?: any;
  jobCodes?: any;
  contentJobType?: any;
  alarmData?: any;
  pageProps?: any;
  onAlarmInfo?: (sequence: string) => void;
  onDeleteAlarm?: (sequence: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  onSearch?: (keyword: any) => void;
  params: SearchParamsProps;
  setParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
}

export function AlarmTemplate({
  alarmList,
  skillsList,
  experience,
  jobGroup,
  jobs,
  jobCodes,
  contentJobType,
  alarmData,
  pageProps,
  params,
  onAlarmInfo,
  onDeleteAlarm,
  onSave,
  onAdd,
  onSearch,
  setParams,
}: AlarmTemplateProps) {
  const COLGROUP = ['10%', '10%', '10%', '10%', '10%', '10%', '10%'];
  const HEADS = [
    '이벤트유형',
    '알림노출 회원아이디',
    '알림노출 회원명',
    '발동 회원아이디',
    '발동 회원명',
    '확인여부',
    '등록일시',
  ];

  const FIELDS = [
    { name: '이벤트유형', field: 'alarmEventType', type: 'text' },
    { name: '알림노출대상회원UUID', field: 'targetMemberUuid', type: 'text' },
    { name: '발동회원UUID', field: 'triggerMemberUuid', type: 'text' },
    { name: '발동리소스SEQ', field: 'triggerSequence', type: 'text' },
    { name: '확인여부', field: 'isChecked', type: 'text' },
  ];

  const { mutate: onSaveProfileImage, data: profileImage, isSuccess } = useUploadImage();

  const [introduceEditor, setIntroduceEditor] = useState<string>('');
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [alarm, setAlarm] = useState<any>({});
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
  const alarmSaveSchema = yup.object().shape({
    memberId: yup.string().notRequired(),
    memberName: yup.string().notRequired(),
    memberNickname: yup.string().notRequired(),
    articleUrl: yup.string().notRequired(),
    activeCount: yup.string().notRequired(),
    answerCount: yup.string().notRequired(),
    hashTags: yup.string().notRequired(),
  });

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(alarmSaveSchema),
  });

  useEffect(() => {
    alarmData && setAlarm(alarmData.data);
    if (alarmData) {
      setExperienceIds(alarmData?.data?.relatedExperiences?.map((item, index) => item) || []);
      setSkillIds(alarmData?.data?.relatedSkills?.map((item, index) => item) || []);
      setrecommendJobGroupsIds(alarmData?.data?.recommendJobGroups?.map((item, index) => item) || []);
      setrecommendJobsIds(alarmData?.data?.recommendJobs?.map((item, index) => item) || []);
      setrecommendLevelsIds(alarmData?.data?.recommendLevels?.map((item, index) => item) || []);
    } else {
      setExperienceIds([]);
      setSkillIds([]);
      setrecommendJobGroupsIds([]);
      setrecommendJobsIds([]);
      setrecommendLevelsIds([]);
    }
  }, [alarmData]);

  // useEffect(() => {
  //   setTerm && setTerm(termAgreeData.data);
  // }, [termAgreeData]);

  const onShowPopup = (sequence: string) => {
    onAlarmInfo && onAlarmInfo(sequence);
    setPopupOpen(true);
    setIsRegisterPopupOpen(false);
  };

  const onChangeAlarm = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setAlarm({
      ...alarm,
      ...data,
    });
  };

  const handleDelete = (sequence: string) => {
    setPopupOpen(false);
    setAlarm({});
    onDeleteAlarm && onDeleteAlarm(sequence);
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
      ...alarm,
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

  return (
    <div className="admin-content">
      <h2 className="tit-type1">알림관리</h2>
      <div className="path">
        <span>Home</span> <span>알림 이벤트이력</span>
      </div>

      <div className="data-top">
        <div className="left">
          {/* <button className="btn-type1 type1" onClick={event => onShowUpRegisterPopUp(event)}>
            등록
          </button> */}
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
          items={alarmList?.data?.data?.contents?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.alarmEventSequence)}>
                <td className="magic" title={item.alarmEventType}>
                  {item.alarmEventType}
                </td>
                <td className="magic" title={item.targetMemberId}>
                  {item.targetMemberId}
                </td>
                <td className="magic" title={item.targetMemberName}>
                  {item.targetMemberName}
                </td>
                <td className="magic" title={item.triggerMemberId}>
                  {item.triggerMemberId}
                </td>
                <td className="magic" title={item.triggerMemberName}>
                  {item.triggerMemberName}
                </td>
                <td className="magic" title={item.isChecked ? 'Y' : 'N'}>
                  {item.isChecked ? 'Y' : 'N'}
                </td>
                <td className="magic" title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={alarmList?.data?.length === 0 || false}
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
                <div className="tit-type2">알림이벤트 상세보기</div>
              </div>
              <div className="right">
                <button className="btn-type1 type1" onClick={() => setIsEdit(false)}>
                  취소
                </button>
              </div>
            </div>
            <div className="tab-content" data-id="tabLink01">
              <div className="layout-grid">
                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">이벤트 유형</div>
                    <div className="inp">
                      <select
                        className="input-admin"
                        value={alarm?.alarmEventType?.toString() || ''}
                        onChange={onChangeAlarm}
                        name="alarmEventType"
                        disabled
                      >
                        <option value="true">Y</option>
                        <option value="false">N</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">확인여부</div>
                    <div className="inp">
                      <select
                        className="input-admin"
                        value={alarm?.isChecked?.toString() || ''}
                        onChange={onChangeAlarm}
                        name="isChecked"
                        disabled
                      >
                        <option value="true">Y</option>
                        <option value="false">N</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">알림노출 대상 회원아이디</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('targetMemberId')}
                        value={alarm?.targetMemberId || ''}
                        onChange={onChangeAlarm}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">알림노출 대상 회원명</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('targetMemberName')}
                        value={alarm?.targetMemberName || ''}
                        onChange={onChangeAlarm}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">발동 회원아이디</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('triggerMemberId')}
                        value={alarm?.triggerMemberId}
                        onChange={onChangeAlarm}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">발동 회원명</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('triggerMemberName')}
                        value={alarm?.triggerMemberName}
                        onChange={onChangeAlarm}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">상세 데이터</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('alarmEventData')}
                        value={alarm?.alarmEventData}
                        onChange={onChangeAlarm}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">생성일시</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('createdAt')}
                        value={dayjs(alarm?.terms?.createdAt).format('YYYY-MM-DD HH:MM:ss')}
                        onChange={onChangeAlarm}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">수정일시</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('updatedAt')}
                        value={dayjs(alarm?.terms?.updatedAt).format('YYYY-MM-DD HH:MM:ss')}
                        onChange={onChangeAlarm}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}

export default AlarmTemplate;
