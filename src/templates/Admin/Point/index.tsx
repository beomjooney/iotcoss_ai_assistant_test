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
import { SearchParamsProps } from 'pages/admin/point';

const cx = classNames.bind(styles);

interface PointTemplateProps {
  pointList?: any;
  skillsList?: any;
  experience?: any;
  jobGroup?: any;
  jobs?: any;
  jobCodes?: any;
  contentJobType?: any;
  pointData?: any;
  pageProps?: any;
  onPointInfo?: (sequence: string) => void;
  onSearch?: (keyword: any) => void;
  params: SearchParamsProps;
  setParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
}

export function PointTemplate({
  pointList,
  skillsList,
  experience,
  jobGroup,
  jobs,
  jobCodes,
  contentJobType,
  pointData,
  pageProps,
  params,
  onPointInfo,
  onSearch,
  setParams,
}: PointTemplateProps) {
  const COLGROUP = ['10%', '10%', '10%', '10%', '12%', '12%'];
  const HEADS = ['타입', '회원아이디', '회원명', '변동 포인트', '현재 포인트', '등록일시'];

  const POINTINFO = [
    { id: '0001', name: '획득' },
    { id: '0002', name: '소모' },
  ];

  const { mutate: onSaveProfileImage, data: profileImage, isSuccess } = useUploadImage();

  const [introduceEditor, setIntroduceEditor] = useState<string>('');
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [point, setPoint] = useState<any>({});
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
  const [pointEventTypeIds, setPointEventTypeIds] = useState<any[]>([]);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState<boolean>(false);
  const [regitserValues, setRegisterValues] = useState<any>({});

  const FIELDS = [
    { name: '회원UUID', field: 'memberUuid', type: 'text' },
    { name: '변동 포인트', field: 'pointsChange', type: 'text' },
    { name: '현재 포인트', field: 'total', type: 'text' },
    { name: '이벤트유형', field: 'eventType', type: 'choice', data: pointEventTypeIds },
    {
      name: '등록일시',
      field: 'createdAt',
      type: 'fromToDate',
      fieldNames: ['createdAtFrom', 'createdAtTo'],
    },
  ];

  // TODO : 밸리데이션 추가 해야 함
  //   const pointSaveSchema = yup.object().shape({
  //     memberId: yup.string().notRequired(),
  //     memberName: yup.string().notRequired(),
  //     memberNickname: yup.string().notRequired(),
  //     articleUrl: yup.string().notRequired(),
  //     activeCount: yup.string().notRequired(),
  //     answerCount: yup.string().notRequired(),
  //     hashTags: yup.string().notRequired(),
  //   });

  //   const methods = useForm({
  //     mode: 'onChange',
  //     reValidateMode: 'onChange',
  //     resolver: yupResolver(pointSaveSchema),
  //   });

  //   useEffect(() => {
  //     pointData && setPoint(pointData.data);
  //     if (pointData) {
  //       setExperienceIds(pointData?.data?.relatedExperiences?.map((item, index) => item) || []);
  //       setSkillIds(pointData?.data?.relatedSkills?.map((item, index) => item) || []);
  //       setrecommendJobGroupsIds(pointData?.data?.recommendJobGroups?.map((item, index) => item) || []);
  //       setrecommendJobsIds(pointData?.data?.recommendJobs?.map((item, index) => item) || []);
  //       setrecommendLevelsIds(pointData?.data?.recommendLevels?.map((item, index) => item) || []);
  //     } else {
  //       setExperienceIds([]);
  //       setSkillIds([]);
  //       setrecommendJobGroupsIds([]);
  //       setrecommendJobsIds([]);
  //       setrecommendLevelsIds([]);
  //     }
  //   }, [pointData]);

  useEffect(() => {
    pointData && setPoint(pointData.data);
    setPointEventTypeIds(POINTINFO?.map((item, index) => item) || []);
  }, [pointData]);

  const pointEventTypeTxt = eventType => {
    let pointEventTypeTxt;

    switch (eventType) {
      case '0001':
        pointEventTypeTxt = '획득';
        break;
      default:
        pointEventTypeTxt = '소모';
        break;
    }

    return pointEventTypeTxt;
  };

  const onShowPopup = (sequence: string) => {
    onPointInfo && onPointInfo(sequence);
    setPopupOpen(true);
    setIsRegisterPopupOpen(false);
  };

  const onChangePoint = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setPoint({
      ...point,
      ...data,
    });
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
    <div className="content">
      <h2 className="tit-type1">포인트 이력 관리</h2>
      <div className="path">
        <span>Home</span> <span>포인트목록</span>
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
          items={pointList?.data?.data?.contents?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.sequence)}>
                <td className="magic" title={pointEventTypeTxt(item.eventType)}>
                  {pointEventTypeTxt(item.eventType)}
                </td>
                <td className="magic" title={item.memberId}>
                  {item.memberId}
                </td>
                <td className="magic" title={item.memberName}>
                  {item.memberName}
                </td>
                <td className="magic" title={item.pointsChange}>
                  {item.pointsChange}
                </td>
                <td className="magic" title={item.total}>
                  {item.total}
                </td>

                <td className="magic" title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={pointList?.data?.length === 0 || false}
        />
        <AdminPagination {...pageProps} />
      </div>
      <div className={cx('side-layer', popupOpen ? 'open' : '')} id="sidePop1">
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
              <div className="tit-type2">포인트 내역 상세보기</div>
            </div>
            <div className="right">
              {/* <button className="btn-type1 type1" onClick={() => setIsEdit(false)}>
                취소
              </button> */}
            </div>
          </div>
          <div className="tab-content" data-id="tabLink01">
            <div className="layout-grid">
              <div className="grid-33">
                <div className="inpwrap">
                  <div className="inp-tit">회원 UUID</div>
                  <div className="inp">
                    <input className="input-admin" type="text" value={point?.memberUuid || 0} disabled />
                  </div>
                </div>
              </div>
              <div className="grid-33">
                <div className="inpwrap">
                  <div className="inp-tit">회원아이디</div>
                  <div className="inp">
                    <input className="input-admin" type="text" value={point?.memberId || 0} disabled />
                  </div>
                </div>
              </div>
              <div className="grid-33">
                <div className="inpwrap">
                  <div className="inp-tit">회원명</div>
                  <div className="inp">
                    <input className="input-admin" type="text" value={point?.memberName || 0} disabled />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">유형</div>
                  <div className="inp">
                    <select className="input-admin" value={point?.eventType || ''} name="type" disabled>
                      {POINTINFO?.map(item => (
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
                  <div className="inp-tit">변동 포인트</div>
                  <div className="inp">
                    <input className="input-admin" type="text" value={point?.pointsChange || 0} disabled />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">현재 포인트</div>
                  <div className="inp">
                    <input className="input-admin" type="text" value={point?.total || 0} disabled />
                  </div>
                </div>
              </div>

              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">등록일시</div>
                  <div className="inp">
                    <input className="input-admin" type="text" value={point?.createdAt} disabled />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointTemplate;
