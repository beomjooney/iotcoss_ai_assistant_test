import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { AdminPagination, Table, Toggle, SmartFilter } from 'src/stories/components';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { SearchParamsProps } from 'pages/admin/contents/recommend-contents';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import dayjs from 'dayjs';
import {
  useContentTypes,
  useJobGroups,
  useSeminarPaymentTypes,
  useSeminarTypes,
  useJobs,
  usePlaceTypes,
} from 'src/services/code/code.queries';

const cx = classNames.bind(styles);

interface RecommendContentsTemplateProps {
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

export function RecommendContentsTemplate({
  onSearch,
  onDelete,
  onSave,
  onAdd,
  params,
  pageProps,
  recommendList,
}: RecommendContentsTemplateProps) {
  const { data: groups, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: jobs } = useJobs();
  const { data: seminarType, isFetched: isSemianrTypeFetched } = useSeminarTypes();
  const { data: seminarPaymentTypes, isFetched: isPaymentTypeFetched } = useSeminarPaymentTypes();
  const { data: contentsTypeGroup, isFetched: isContentTypeFetched } = useContentTypes();
  const { data: seminarVenueTypes, isFetched: isSeminarVenueTypeFetched } = usePlaceTypes();
  const [regitserValues, setRegisterValues] = useState<any>({});
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState<boolean>(false);
  const [content, setContent] = useState<any>({});
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [memberViewCount, setMemberViewCount] = useState<number[]>([0, 0]);

  const COLGROUP = ['5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%'];
  const HEADS = [
    '콘텐츠아이디',
    '제공사',
    '콘텐츠명',
    '콘텐츠유형',
    '저자',
    '추천직군들',
    '추천직무들',
    '추천레벨들',
    '키워드들',
    '내부추천등급',
    '회원뷰수',
    '발행일자',
    '세미나시작일시',
    '등록일시',
  ];

  const onChangeContent = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    const result = recommendList?.data?.find(item => item?.contentsId === id);
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

  const handleSearchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setSearchKeyword(value);
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

  const onSmartFilterSearch = (params: any) => {
    let result = { ...params };
    result = {
      ...result,
      recommendJobGroups: params?.recommendJobGroups?.join(',') || '',
      recommendJobs: params?.recommendJobs?.join(',') || '',
      recommendLevels: params?.recommendLevels?.join(',') || '',
    };
    onSearch && onSearch(result);
  };

  const handleOnAdd = () => {
    let params = { ...regitserValues };
    params = {
      ...regitserValues,
      internalRecommendLevel: regitserValues?.internalRecommendLevel || 1,
      contentsType: regitserValues?.contentsType || contentsTypeGroup[0]?.id,
      seminarType: regitserValues?.seminarType || seminarType[0]?.id,
      paymentType: regitserValues?.paymentType || seminarPaymentTypes[0]?.id,
      keywords: regitserValues?.keywords ? regitserValues?.keywords.split(',') : [''],
    };
    onAdd && onAdd(params);
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

  const FIELDS = [
    { name: '콘텐츠 아이디', field: 'contentsId', type: 'text' },
    { name: '제공사', field: 'provider', type: 'text' },
    { name: '콘텐츠명', field: 'contentsName', type: 'text' },
    { name: '콘텐츠유형', field: 'contentsType', type: 'choice', data: contentsTypeGroup || [] },
    {
      name: '내부추천등급',
      field: 'internalRecommendLevel',
      type: 'choice',
      data: Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: i + 1 })) || [],
    },
    { name: '저자', field: 'creator', type: 'text' },
    { name: '키워들', field: 'keyword', type: 'text' },
    {
      name: '회원뷰수',
      field: 'memberViewCount',
      type: 'fromTo',
      fieldNames: ['memberViewCountFrom', 'memberViewCountTo'],
    },
    { name: '', field: 'blank', type: 'blank' },
    { name: '추천직군들', field: 'recommendJobGroups', type: 'toggle', data: groups || [] },
    { name: '추천직무들', field: 'recommendJobs', type: 'toggle', data: jobs || [] },
    {
      name: '추천레벨들',
      field: 'recommendLevels',
      type: 'toggle',
      data: Array.from({ length: 6 }, (_, i) => ({ id: i, name: `${i}레벨` })) || [],
    },
    {
      name: '발행일시',
      field: 'registDate',
      type: 'fromToDate',
      fieldNames: ['registDateFrom', 'registDateTo'],
    },
    {
      name: '세미나일시',
      field: 'seminar',
      type: 'fromToDate',
      fieldNames: ['seminarEndDateFrom', 'seminarEndDateTo'],
    },
    {
      name: '등록일시',
      field: 'createdDate',
      type: 'fromToDate',
      fieldNames: ['createdFrom', 'createdTo'],
    },
  ];

  return (
    <div className="content">
      <h2 className="tit-type1">추천콘텐츠</h2>
      <div className="path">
        <span>Home</span> <span>추천콘텐츠 목록</span>
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
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.contentsId)}>
                <td className="magic" title={item.contentsId}>
                  {item.contentsId}
                </td>
                <td className="magic" title={item.provider}>
                  {item.provider}
                </td>
                <td className="magic" title={item.contentsName}>
                  {item.contentsName}
                </td>
                <td className="magic" title={item.contentsTypeName}>
                  {item.contentsTypeName}
                </td>
                <td className="magic" title={item.creator}>
                  {item.creator}
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
                <td className="magic" title={item.keywords}>
                  {item.keywords?.join(',')}
                </td>
                <td className="magic" title={item.internalRecommendLevel}>
                  {item.internalRecommendLevel}
                </td>
                <td className="magic" title={item.memberViewCount}>
                  {item.memberViewCount}
                </td>
                <td className="magic" title={dayjs(item.registDate).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.registDate).format('YYYY-MM-DD HH:mm:ss')}
                </td>
                <td className="magic" title={dayjs(item.seminarStartDate).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.seminarStartDate).format('YYYY-MM-DD HH:mm:ss')}
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
              <div className="tit-type2">추천 콘텐츠 상세보기</div>
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
                <div className="inp-tit">콘텐츠 아이디</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="contentsId"
                    value={content?.contentsId || ''}
                    onChange={onChangeContent}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">제공사</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="provider"
                    value={content?.provider || ''}
                    onChange={onChangeContent}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">콘텐츠명</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="contentsName"
                    value={content?.contentsName || ''}
                    onChange={onChangeContent}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">콘텐츠설명</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="description"
                    value={content?.description || ''}
                    onChange={onChangeContent}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">콘텐츠유형</div>
                <div className="inp">
                  <select
                    value={content?.contentsType}
                    onChange={onChangeContent}
                    name="contentsType"
                    disabled={!isEdit}
                  >
                    {contentsTypeGroup?.map(item => (
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
                    onChange={onChangeContent}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">세미나 유형</div>
                <div className="inp">
                  {isSemianrTypeFetched && (
                    <select
                      value={content?.contentsType || seminarType[0]?.id}
                      onChange={onChangeContent}
                      name="seminarType"
                      disabled={!isEdit}
                    >
                      {seminarType?.map(item => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">결제 유형</div>
                <div className="inp">
                  {isPaymentTypeFetched && (
                    <select
                      value={content?.paymentType || seminarPaymentTypes[0]?.id}
                      onChange={onChangeContent}
                      name="paymentType"
                      disabled={!isEdit}
                    >
                      {seminarPaymentTypes?.map(item => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">장소 유형</div>
                <div className="inp">
                  {isSeminarVenueTypeFetched && (
                    <select
                      value={content?.seminarVenueType}
                      onChange={onChangeContent}
                      name="seminarVenueType"
                      disabled={!isEdit}
                    >
                      {seminarVenueTypes?.map(item => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">저자</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="creator"
                    value={content?.creator || ''}
                    onChange={onChangeContent}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">내부추천등급</div>
                <div className="inp">
                  <select
                    value={content?.internalRecommendLevel}
                    onChange={onChangeContent}
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
                <div className="inp-tit">소요예상시간</div>
                <div className="inp">
                  <input
                    type="number"
                    className="input-admin"
                    name="estimatedViewTime"
                    value={content?.estimatedViewTime || ''}
                    onChange={onChangeContent}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">가격</div>
                <div className="inp">
                  <input
                    type="number"
                    className="input-admin"
                    name="price"
                    value={content?.price || ''}
                    onChange={onChangeContent}
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
                    onChange={onChangeContent}
                    disabled={!isEdit}
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
                    onChange={onChangeContent}
                    disabled={!isEdit}
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
                    onChange={onChangeContent}
                    disabled={!isEdit}
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
                    onChange={onChangeContent}
                    disabled={!isEdit}
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
                    onChange={onChangeContent}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid-50 mt-3">
            <div className="inpwrap">
              <div className="inp-tit">세미나 추천직군</div>
              <div className="inp">
                {isJobGroupFetched &&
                  groups?.map(item => {
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
                          className={cx('fixed-width')}
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
                        className={cx('fixed-width')}
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
              <div className="inp-tit">세미나 추천레벨</div>
              <div className="inp">
                {isJobGroupFetched &&
                  levelInfo.map(item => {
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
                          className={cx('fixed-width__level')}
                          disabled={!isEdit}
                          type="checkBox"
                          value={item.level}
                          onChange={e => handleCheckboxChange(e, 'recommendLevels')}
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
                <div className="inp-tit">세미나시작일</div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    inputFormat="YYYY-MM-DD HH:mm"
                    value={content?.seminarStartDate || ''}
                    className={cx('basic-info-page__picker')}
                    onChange={e => handlePickerContentChange(e, 'seminarStartDate')}
                    renderInput={params => <TextField {...params} variant="standard" />}
                    disabled={!isEdit}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="grid-50">
              <div className="inpwrap">
                <div className="inp-tit">세미나종료일</div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    inputFormat="YYYY-MM-DD HH:mm"
                    value={content?.seminarEndDate || ''}
                    className={cx('basic-info-page__picker')}
                    onChange={e => handlePickerContentChange(e, 'seminarEndDate')}
                    renderInput={params => <TextField {...params} variant="standard" />}
                    disabled={!isEdit}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="grid-50">
              <div className="inpwrap">
                <div className="inp-tit">등록일</div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    inputFormat="YYYY-MM-DD HH:mm"
                    value={content?.registDate || ''}
                    className={cx('basic-info-page__picker')}
                    onChange={e => handlePickerContentChange(e, 'registDate')}
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
              <div className="tit-type2">추천콘텐츠 등록</div>
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
                <div className="inp-tit">콘텐츠 아이디</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="contentsId"
                    value={regitserValues?.contentsId || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">제공사</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="provider"
                    value={regitserValues?.provider || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">콘텐츠명</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="contentsName"
                    value={regitserValues?.contentsName || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">콘텐츠설명</div>
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
                <div className="inp-tit">콘텐츠유형</div>
                <div className="inp">
                  {isRegisterPopupOpen ? (
                    <select
                      value={regitserValues?.contentsType || contentsTypeGroup[0]?.id}
                      onChange={handleRegister}
                      name="contentsType"
                    >
                      {contentsTypeGroup?.map(item => (
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
                <div className="inp-tit">세미나 유형</div>
                <div className="inp">
                  {isRegisterPopupOpen ? (
                    <select
                      value={regitserValues?.seminarType || seminarType[0]?.id}
                      onChange={handleRegister}
                      name="seminarType"
                    >
                      {seminarType?.map(item => (
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
                      value={regitserValues?.paymentType || seminarPaymentTypes[0]?.id}
                      onChange={handleRegister}
                      name="paymentType"
                    >
                      {seminarPaymentTypes?.map(item => (
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
                <div className="inp-tit">장소 유형</div>
                <div className="inp">
                  {isRegisterPopupOpen ? (
                    <select value={regitserValues?.seminarVenueType} onChange={handleRegister} name="seminarVenueType">
                      {seminarVenueTypes?.map(item => (
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
                <div className="inp-tit">저자</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="creator"
                    value={regitserValues?.creator || ''}
                    onChange={handleRegister}
                  />
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
                <div className="inp-tit">소요예상시간</div>
                <div className="inp">
                  <input
                    type="number"
                    className="input-admin"
                    name="estimatedViewTime"
                    value={regitserValues?.estimatedViewTime || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">가격</div>
                <div className="inp">
                  <input
                    type="number"
                    className="input-admin"
                    name="price"
                    value={regitserValues?.price || ''}
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
              <div className="inp-tit">세미나 추천직군</div>
              <div className="inp">
                {isJobGroupFetched &&
                  groups?.map(item => {
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
                          className={cx('fixed-width')}
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
                        className={cx('fixed-width')}
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
              <div className="inp-tit">세미나 추천레벨</div>
              <div className="inp">
                {isJobGroupFetched &&
                  levelInfo.map(item => {
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
                          className={cx('fixed-width__level')}
                          value={item.level}
                          onChange={e => handleCheckboxChange(e, 'recommendLevels', true)}
                        />
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>
          {/* <div className="grid-50 mt-3">
            <div className="inpwrap">
              <div className="inp-tit">연관 스킬들</div>
              <div className="inp">
                {isJobGroupFetched &&
                  levelInfo.map(item => {
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
              <div className="inp-tit">연관 경험들</div>
              <div className="inp">
                {isJobGroupFetched &&
                  levelInfo.map(item => {
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
          </div> */}
          <div className="grid-100 mt-3" style={{ display: 'flex', gap: '20px' }}>
            <div className="grid-50">
              <div className="inpwrap">
                <div className="inp-tit">세미나시작일</div>
                {isRegisterPopupOpen ? (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      inputFormat="YYYY-MM-DD HH:mm"
                      value={regitserValues?.seminarStartDate || ''}
                      className={cx('basic-info-page__picker')}
                      onChange={e => handlePickerContentChange(e, 'seminarStartDate', true)}
                      renderInput={params => <TextField {...params} variant="standard" />}
                    />
                  </LocalizationProvider>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="grid-50">
              <div className="inpwrap">
                <div className="inp-tit">세미나종료일</div>
                {isRegisterPopupOpen ? (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      inputFormat="YYYY-MM-DD HH:mm"
                      value={regitserValues?.seminarEndDate || ''}
                      className={cx('basic-info-page__picker')}
                      onChange={e => handlePickerContentChange(e, 'seminarEndDate', true)}
                      renderInput={params => <TextField {...params} variant="standard" />}
                    />
                  </LocalizationProvider>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="grid-50">
              <div className="inpwrap">
                <div className="inp-tit">등록일</div>
                {isRegisterPopupOpen ? (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      inputFormat="YYYY-MM-DD HH:mm"
                      value={regitserValues?.registDate || ''}
                      className={cx('basic-info-page__picker')}
                      onChange={e => handlePickerContentChange(e, 'registDate', true)}
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

export default RecommendContentsTemplate;

const levelInfo = [{ level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }, { level: 5 }];

const internalRecommendLevel = [
  {
    id: 1,
    name: 1,
  },
  {
    id: 2,
    name: 2,
  },
  {
    id: 3,
    name: 3,
  },
  {
    id: 4,
    name: 4,
  },
  {
    id: 5,
    name: 5,
  },
];
