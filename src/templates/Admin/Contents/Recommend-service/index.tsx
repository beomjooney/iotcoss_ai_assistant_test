import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { AdminPagination, Table, Toggle, SmartFilter } from 'src/stories/components';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { SearchParamsProps } from 'pages/admin/contents/recommend-service';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import dayjs from 'dayjs';
import {
  useServiceDetails,
  useJobs,
  useJobGroups,
  useSeminarPaymentTypes,
  useSeminarTypes,
  useServicePriceGrade,
  useServiceType,
} from 'src/services/code/code.queries';

const cx = classNames.bind(styles);

interface RecommendServiceTemplateProps {
  onSearch?: (searchKeyword: SearchParamsProps) => void;
  onDelete?: (memberId: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  recommendList?: any;
  pageProps?: any;
  params?: SearchParamsProps;
  setParams?: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

export function RecommendServiceTemplate({
  onSearch,
  onAdd,
  onDelete,
  onSave,
  params,
  pageProps,
  recommendList,
}: RecommendServiceTemplateProps) {
  const { data: jobGroups, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: jobs } = useJobs();
  const { data: serviceDetails } = useServiceDetails();
  const { data: seminarType } = useSeminarTypes();
  const { data: paymentTypes } = useSeminarPaymentTypes();
  const { data: priceLevel } = useServicePriceGrade();
  const { data: serviceTypes } = useServiceType();
  // const { data } = useRecommendLearningGrowth();
  const [regitserValues, setRegisterValues] = useState<any>({});
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState<boolean>(false);
  const [content, setContent] = useState<any>({});
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const COLGROUP = ['5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%'];
  const HEADS = [
    '서비스아이디',
    '회사명',
    '서비스명',
    '서비스유형',
    '추천직군들',
    '추천직무들',
    '추천레벨들',
    '사용자수',
    '인지도등급',
    '가격등급',
    '결제유형',
    '가격',
    '내부추천등급',
    '등록일시',
  ];

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setContent({
      ...content,
      ...data,
    });
  };
  const handleSave = () => {
    let params = { ...content };

    if (content?.keywords) {
      params = {
        ...content,
        keywords: content?.keywords.split(','),
      };
    }
    onSave && onSave(params);
    setIsEdit(false);
  };

  const onShowPopup = (id: string) => {
    const result = recommendList?.data?.find(item => item?.serviceId === id);
    let param = result;

    if (result) {
      param = {
        ...result,
        keywords: result?.keywords?.join(',') || '',
      };
    }

    setContent(param);
    setPopupOpen(true);
  };

  const handleCheckboxChange = (e, key, isRegister?) => {
    const { value, checked } = e.target;
    if (isRegister) {
      const temp = new Set(regitserValues[key]);
      const isNumberType = key === 'recommendLevels';
      if (checked) temp.add(isNumberType ? parseInt(value) : value);
      else temp.delete(value);
      setRegisterValues({ ...regitserValues, [key]: [...temp] });
    } else {
      const temp = new Set(content[key]);
      const isNumberType = key === 'recommendLevels';
      if (checked) temp.add(isNumberType ? parseInt(value) : value);
      else temp.delete(value);
      setContent({ ...content, [key]: [...temp] });
    }
  };

  const handlePickerContentChange = (moment, key, isRegister?) => {
    let datetime = moment?.format('YYYY-MM-DD HH:mm');
    if (isRegister) {
      setRegisterValues({
        ...regitserValues,
        [key]: `${datetime}:00.000`,
      });
      return;
    } else {
      setContent({
        ...content,
        [key]: `${datetime}:00.000`,
      });
      return;
    }
  };
  const handleSearchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setSearchKeyword(value);
  };

  const onSmartFilterSearch = (params: any) => {
    onSearch && onSearch(params);
  };

  const onShowUpRegisterPopUp = event => {
    setIsRegisterPopupOpen(true);
  };

  const handleRegister = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setRegisterValues({
      ...regitserValues,
      ...data,
    });
  };

  const handleOnAdd = () => {
    let params = { ...regitserValues };
    params = {
      ...regitserValues,
      internalRecommendLevel: regitserValues?.internalRecommendLevel || 1,
      serviceType: regitserValues?.serviceType || serviceTypes[0]?.id,
      keywords: regitserValues?.keywords ? regitserValues?.keywords.split(',') : [''],
      priceLevel: regitserValues?.priceLevel || priceLevel[0]?.id,
      paymentType: regitserValues?.paymentType || paymentTypes[0]?.id,
      awarenessLevel: regitserValues?.awarenessLevel || 1,
    };
    onAdd && onAdd(params);
  };

  const FIELDS = [
    { name: '서비스아이디', field: 'serviceId', type: 'text' },
    { name: '회사명', field: 'companyName', type: 'text' },
    { name: '서비스명', field: 'serviceName', type: 'text' },
    { name: '서비스유형', field: 'serviceType', type: 'choice', data: serviceTypes || [] },
    { name: '추천직군들', field: 'recommendJobGroups', type: 'choice', data: jobGroups || [] },
    {
      name: '내부추천등급',
      field: 'internalRecommendLevel',
      type: 'choice',
      data: Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: i + 1 })) || [],
    },
    {
      name: '인지도등급',
      field: 'awarenessLevel',
      type: 'choice',
      data: Array.from({ length: 6 }, (_, i) => ({ id: i, name: `${i}등급` })) || [],
    },
    { name: '가격등급', field: 'priceLevel', type: 'choice', data: priceLevel || [] },
    {
      name: '추천레벨들',
      field: 'recommendLevels',
      type: 'toggle',
      data: Array.from({ length: 6 }, (_, i) => ({ id: i, name: `${i}레벨` })) || [],
    },
    { name: '결제유형', field: 'paymentType', type: 'choice', data: paymentTypes || [] },
    { name: '', field: 'blank', type: 'blank' },
    {
      name: '사용자수',
      field: 'memberCount',
      type: 'fromTo',
      fieldNames: ['memberCountFrom', 'memberCountTo'],
    },
    {
      name: '가격',
      field: 'price',
      type: 'fromTo',
      fieldNames: ['priceFrom', 'priceTo'],
    },
    { name: '', field: 'blank', type: 'blank' },
    {
      name: '등록일시',
      field: 'createdDate',
      type: 'fromToDate',
      fieldNames: ['createdFrom', 'createdTo'],
    },
  ];
  return (
    <div className="content">
      <h2 className="tit-type1">추천서비스</h2>
      <div className="path">
        <span>Home</span> <span>추천서비스 목록</span>
      </div>
      <div className="data-top">
        <div className="left">
          <button className="btn-type1 type1" onClick={event => onShowUpRegisterPopUp(event)}>
            등록
          </button>
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
                name="searchKeyword"
                onKeyDown={event => onSearch && event.key === 'Enter' && onSearch({ ...params, searchKeyword })}
              />
              <button className="btn" onClick={() => onSearch && onSearch({ ...params, searchKeyword })}>
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
          name="content"
          colgroup={COLGROUP}
          heads={HEADS}
          items={recommendList?.data?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.serviceId)}>
                <td className="magic" title={item.serviceId}>
                  {item.serviceId}
                </td>
                <td className="magic" title={item.companyName}>
                  {item.companyName}
                </td>
                <td className="magic" title={item.serviceName}>
                  {item.serviceName}
                </td>
                <td className="magic" title={item.serviceTypeName}>
                  {item.serviceTypeName}
                </td>
                <td className="magic" title={item.recommendJobGroupNames}>
                  {item.recommendJobGroupNames?.join(',')}
                </td>
                <td className="magic" title={item.recommendJobNames}>
                  {item.recommendJobNames?.join(',')}
                </td>
                <td className="magic" title={item.recommendLevels}>
                  {item.recommendLevels?.join(',')}
                </td>
                <td className="magic" title={item.memberCount}>
                  {item.memberCount}
                </td>
                <td className="magic" title={item.awarenessLevel}>
                  {item.awarenessLevel}
                </td>
                <td className="magic" title={item.paymentTypeName}>
                  {item.paymentTypeName}
                </td>
                <td className="magic" title={item.price}>
                  {item.price}
                </td>
                <td className="magic" title={item.internalRecommendLevel}>
                  {item.internalRecommendLevel}
                </td>
                <td className="magic" title={item.memberViewCount}>
                  {item.memberViewCount}
                </td>
                <td className="magic" title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={recommendList?.data?.length === 0 || false}
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
              <div className="tit-type2">추천 서비스 상세보기</div>
            </div>
            <div className="right">
              {isEdit ? (
                <button className="btn-type1 type2" onClick={handleSave}>
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
                <button
                  className="btn-type1 type1"
                  onClick={() => {
                    setIsEdit(false);
                    setPopupOpen(false);
                    onDelete && onDelete(content?.contentsId);
                  }}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
          <div className="layout-grid">
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">서비스 아이디</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="serviceId"
                    value={content?.serviceId || ''}
                    onChange={onChange}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">회사명</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="companyName"
                    value={content?.companyName || ''}
                    onChange={onChange}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">서비스명</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="serviceName"
                    value={content?.serviceName || ''}
                    onChange={onChange}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">서비스설명</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="description"
                    value={content?.description || ''}
                    onChange={onChange}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">서비스유형</div>
                <div className="inp">
                  <select value={content?.serviceType} onChange={onChange} name="serviceType" disabled={!isEdit}>
                    {serviceTypes?.map(item => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">키워드들</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="keywords"
                    value={content?.keywords}
                    onChange={onChange}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">가격 등급</div>
                <div className="inp">
                  <select value={content?.priceLevel} onChange={onChange} name="priceLevel" disabled={!isEdit}>
                    {priceLevel?.map(item => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">결제 유형</div>
                <div className="inp">
                  <select value={content?.paymentType} onChange={onChange} name="paymentType" disabled={!isEdit}>
                    {paymentTypes?.map(item => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="grid-25">
              {/* <div className="inpwrap">
                <div className="inp-tit">추천학승성장성향들</div>
                <div className="inp">
                  <select
                    value={content?.recommendLearningGrowthTendencies}
                    onChange={onChange}
                    name="recommendLearningGrowthTendencies"
                    disabled={!isEdit}
                  >
                    {recommendLearningGrowthTendencieTypes?.map(item => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div> */}
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">내부추천등급</div>
                <div className="inp">
                  <select
                    value={content?.internalRecommendLevel}
                    onChange={onChange}
                    name="internalRecommendLevel"
                    disabled={!isEdit}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">인지도등급</div>
                <div className="inp">
                  <input
                    min={1}
                    max={5}
                    type="number"
                    className="input-admin"
                    name="awarenessLevel"
                    value={content?.awarenessLevel}
                    onChange={onChange}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">회원추천수</div>
                <div className="inp">
                  <input
                    type="number"
                    className="input-admin"
                    name="memberRecommendCount"
                    value={content?.memberRecommendCount || ''}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">회원뷰수</div>
                <div className="inp">
                  <input
                    type="number"
                    className="input-admin"
                    name="memberViewCount"
                    value={content?.memberViewCount || ''}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">추천지수</div>
                <div className="inp">
                  <input
                    type="number"
                    className="input-admin"
                    name="recommendQuotes"
                    value={content?.recommendQuotes || ''}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">URL</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="url"
                    value={content?.url || ''}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">이미지 URL</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="imageUrl"
                    value={content?.imageUrl || ''}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid-50 mt-3">
            <div className="inpwrap">
              <div className="inp-tit">추천직군들</div>
              <div className="inp">
                {isJobGroupFetched &&
                  jobGroups?.map(item => {
                    let isIncludeContent = false;
                    if (content?.recommendJobGroups?.includes(item.id)) {
                      isIncludeContent = true;
                    }
                    return (
                      <span key={item.id} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                        <Toggle
                          isActive
                          label={item.name}
                          name="recommendJobGroups"
                          type="checkBox"
                          checked={isIncludeContent}
                          value={item.id}
                          key={item.id}
                          disabled={!isEdit}
                          className={cx('seminar-jobgroup-area')}
                          onChange={e => handleCheckboxChange(e, 'recommendJobGroups')}
                        />
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="grid-50 mt-3">
            <div className="inpwrap">
              <div className="inp-tit">추천직무들</div>
              <div className="inp">
                {jobs?.map(item => {
                  let isIncludeContent = false;
                  if (content?.recommendJobs?.includes(item.id)) {
                    isIncludeContent = true;
                  }
                  return (
                    <span key={item.id} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                      <Toggle
                        isActive
                        label={item.name}
                        name="recommendJobs"
                        type="checkBox"
                        checked={isIncludeContent}
                        value={item.id}
                        key={item.id}
                        className={cx('seminar-jobgroup-area')}
                        disabled={!isEdit}
                        onChange={e => handleCheckboxChange(e, 'recommendJobs')}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid-50 mt-3">
            <div className="inpwrap">
              <div className="inp-tit">추천레벨들</div>
              <div className="inp">
                {isJobGroupFetched &&
                  levelInfo?.map(item => {
                    let isIncludeContent = false;
                    if (content?.recommendLevels?.includes(item.level)) {
                      isIncludeContent = true;
                    }
                    return (
                      <span key={item.level} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                        <Toggle
                          isActive
                          label={`${item.level}레벨`}
                          name="recommendLevels"
                          checked={isIncludeContent}
                          type="checkBox"
                          value={item.level}
                          disabled={!isEdit}
                          onChange={e => handleCheckboxChange(e, 'recommendLevels')}
                        />
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="grid-50 mt-3">
            <div className="inpwrap">
              <div className="inp-tit">서비스상세유형들</div>
              <div className="inp">
                {serviceDetails?.map(item => {
                  let isIncludeContent = false;
                  if (content?.serviceDetailTypes?.includes(item.id)) {
                    isIncludeContent = true;
                  }
                  return (
                    <span key={item.id} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                      <Toggle
                        isActive
                        label={`${item.name}`}
                        name="serviceDetailTypeNames"
                        checked={isIncludeContent}
                        type="checkBox"
                        disabled={!isEdit}
                        value={item.id}
                        onChange={e => handleCheckboxChange(e, 'serviceDetailTypes')}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid-100 mt-3" style={{ display: 'flex', gap: '20px' }}>
            <div className="grid-50">
              <div className="inpwrap">
                <div className="inp-tit">등록일</div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    inputFormat="YYYY-MM-DD HH:mm"
                    value={content?.createdAt || ''}
                    className={cx('basic-info-page__picker')}
                    onChange={e => handlePickerContentChange(e, 'createdAt')}
                    renderInput={params => <TextField {...params} variant="standard" />}
                    disabled={!isEdit}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cx('side-layer', isRegisterPopupOpen ? 'open' : '')} id="sidePop2">
        <div className="dim"></div>
        <div className="side-contents">
          <div className="layer-top">
            <div className="left" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: 30, marginRight: 30 }}>
                <button
                  onClick={() => {
                    setRegisterValues({});
                    setIsRegisterPopupOpen(false);
                  }}
                >
                  <i className="ico i-x"></i>
                </button>
              </div>
              <div className="tit-type2">등록</div>
            </div>
            <div className="right">
              <button className="btn-type1 type2" onClick={handleOnAdd}>
                저장
              </button>
            </div>
          </div>
          <div className="layout-grid">
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">서비스 아이디</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="serviceId"
                    value={regitserValues?.serviceId || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">회사명</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="companyName"
                    value={regitserValues?.companyName || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">서비스명</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="serviceName"
                    value={regitserValues?.serviceName || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">서비스설명</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="description"
                    value={regitserValues?.description || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">서비스유형</div>
                <div className="inp">
                  {isRegisterPopupOpen ? (
                    <select value={regitserValues?.serviceType} onChange={handleRegister} name="serviceType">
                      {serviceTypes?.map(item => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">키워드들</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="keywords"
                    value={regitserValues?.keywords || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">가격 등급</div>
                <div className="inp">
                  {isRegisterPopupOpen ? (
                    <select value={regitserValues?.priceLevel} onChange={handleRegister} name="priceLevel">
                      {priceLevel?.map(item => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">결제 유형</div>
                <div className="inp">
                  {isRegisterPopupOpen ? (
                    <select
                      value={regitserValues?.paymentType || paymentTypes[0]?.id}
                      onChange={handleRegister}
                      name="paymentType"
                    >
                      {paymentTypes?.map(item => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <> </>
                  )}
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">내부추천등급</div>
                <div className="inp">
                  {isRegisterPopupOpen ? (
                    <select
                      value={regitserValues?.internalRecommendLevel || 1}
                      onChange={handleRegister}
                      name="internalRecommendLevel"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">인지도등급</div>
                <div className="inp">
                  <input
                    min={1}
                    max={5}
                    type="number"
                    className="input-admin"
                    name="awarenessLevel"
                    value={regitserValues?.awarenessLevel || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">회원추천수</div>
                <div className="inp">
                  <input
                    type="number"
                    className="input-admin"
                    name="memberRecommendCount"
                    value={regitserValues?.memberRecommendCount || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">회원뷰수</div>
                <div className="inp">
                  <input
                    type="number"
                    className="input-admin"
                    name="memberViewCount"
                    value={regitserValues?.memberViewCount || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">추천지수</div>
                <div className="inp">
                  <input
                    type="number"
                    className="input-admin"
                    name="recommendQuotes"
                    value={regitserValues?.recommendQuotes || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">URL</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="url"
                    value={regitserValues?.url || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">이미지 URL</div>
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

          <div className="grid-50 mt-3">
            <div className="inpwrap">
              <div className="inp-tit">추천직군들</div>
              <div className="inp">
                {isJobGroupFetched &&
                  jobGroups?.map(item => {
                    let isIncludeContent = false;
                    if (regitserValues?.recommendJobGroups?.includes(item.id)) {
                      isIncludeContent = true;
                    }
                    return (
                      <span key={item.id} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                        <Toggle
                          isActive
                          label={item.name}
                          name="recommendJobGroups"
                          type="checkBox"
                          checked={isIncludeContent}
                          value={item.id}
                          key={item.id}
                          className={cx('seminar-jobgroup-area')}
                          onChange={e => handleCheckboxChange(e, 'recommendJobGroups', true)}
                        />
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="grid-50 mt-3">
            <div className="inpwrap">
              <div className="inp-tit">추천직무들</div>
              <div className="inp">
                {jobs?.map(item => {
                  let isIncludeContent = false;
                  if (regitserValues?.recommendJobs?.includes(item.id)) {
                    isIncludeContent = true;
                  }
                  return (
                    <span key={item.id} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                      <Toggle
                        isActive
                        label={item.name}
                        name="recommendJobs"
                        type="checkBox"
                        checked={isIncludeContent}
                        value={item.id}
                        key={item.id}
                        className={cx('seminar-jobgroup-area')}
                        onChange={e => handleCheckboxChange(e, 'recommendJobs', true)}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid-50 mt-3">
            <div className="inpwrap">
              <div className="inp-tit">추천레벨들</div>
              <div className="inp">
                {isJobGroupFetched &&
                  levelInfo?.map(item => {
                    let isIncludeContent = false;
                    if (regitserValues?.recommendLevels?.includes(item.level)) {
                      isIncludeContent = true;
                    }
                    return (
                      <span key={item.level} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                        <Toggle
                          isActive
                          label={`${item.level}레벨`}
                          name="recommendLevels"
                          checked={isIncludeContent}
                          type="checkBox"
                          value={item.level}
                          onChange={e => handleCheckboxChange(e, 'recommendLevels', true)}
                        />
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="grid-50 mt-3">
            <div className="inpwrap">
              <div className="inp-tit">서비스상세유형들</div>
              <div className="inp">
                {serviceDetails?.map(item => {
                  let isIncludeContent = false;
                  if (regitserValues?.serviceDetailTypes?.includes(item.id)) {
                    isIncludeContent = true;
                  }
                  return (
                    <span key={item.id} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                      <Toggle
                        isActive
                        label={`${item.name}`}
                        name="serviceDetailTypeNames"
                        checked={isIncludeContent}
                        type="checkBox"
                        value={item.id}
                        onChange={e => handleCheckboxChange(e, 'serviceDetailTypes', true)}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid-100 mt-3" style={{ display: 'flex', gap: '20px' }}>
            <div className="grid-50">
              <div className="inpwrap">
                <div className="inp-tit">등록일</div>
                {isRegisterPopupOpen ? (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      inputFormat="YYYY-MM-DD HH:mm"
                      value={regitserValues?.createdAt || ''}
                      className={cx('basic-info-page__picker')}
                      onChange={e => handlePickerContentChange(e, 'createdAt', true)}
                      renderInput={params => <TextField {...params} variant="standard" />}
                    />
                  </LocalizationProvider>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecommendServiceTemplate;

const levelInfo = [{ level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }, { level: 5 }];
