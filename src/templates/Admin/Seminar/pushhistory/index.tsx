import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { AdminPagination, Table, SmartFilter } from 'src/stories/components';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';
import { SearchParamsProps } from 'pages/admin/pushhistory';
import { usePush, useSendStatus } from 'src/services/code/code.queries';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

interface ReceiverTemplateProps {
  onSearch?: (searchKeyword: SearchParamsProps) => void;
  pushHistoryList?: any;
  pageProps?: any;
  params: SearchParamsProps;
  setParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
}

export function ReceiverTemplate({ onSearch, setParams, params, pageProps, pushHistoryList }: ReceiverTemplateProps) {
  const COLGROUP = ['10%', '10%', '10%', '4%', '5%', '5%', '5%', '5%'];
  const HEADS = ['수신자아이디', '수신자', '발신자아이디', '알림유형', '발송일시', '전송상태', '등록일시', '수정일시'];
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const { data: pushTypes } = usePush();
  const { data: sendStatus } = useSendStatus();

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
    if (key === 'sendDateFrom') {
      datetime = `${datetime} 00:00:00.000`;
    } else {
      datetime = `${datetime} 23:59:00.000`;
    }
    setParams({
      ...params,
      [key]: `${datetime}`,
    });
  };

  const onSmartFilterSearch = (searchParms: any) => {
    onSearch && onSearch(searchParms);
  };

  const FIELDS = [
    { name: '번호', field: 'no', type: 'text' },
    { name: '수신자아이디', field: 'receiverId', type: 'text' },
    { name: '수신자', field: 'receiver', type: 'text' },
    { name: '발신자아이디', field: 'senderId', type: 'text' },
    { name: '알림유형', field: 'pushType', type: 'choice', data: pushTypes || [] },
    { name: '발송상태', field: 'sendStatus', type: 'choice', data: sendStatus || [] },
    { name: '', field: 'blank', type: 'blank' },
    {
      name: '발송일시',
      field: 'sendDate',
      type: 'fromToDate',
      fieldNames: ['sendDateFrom', 'sendDateTo'],
    },
  ];
  console.log(pushTypes);
  return (
    <div className="content">
      <h2 className="tit-type1">메세지발송이력</h2>
      <div className="path">
        <span>Home</span> <span>메세지발송이력 목록</span>
      </div>
      <div className="data-top">
        <div className="left"></div>
        <div className="right">
          <div className={cx('search')}>
            <div className={cx('date')}>
              <div>
                <div className="inpwrap">
                  <div className="inp-tit">발송일시시작일</div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      inputFormat="YYYY-MM-DD"
                      value={params?.sendDateFrom}
                      onChange={e => handlePickerChange(e, 'sendDateFrom')}
                      renderInput={params => <TextField {...params} variant="standard" />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div>-</div>
              <div>
                <div className="inpwrap">
                  <div className="inp-tit">발송일시종료일</div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      inputFormat="YYYY-MM-DD"
                      value={params?.sendDateTo}
                      onChange={e => handlePickerChange(e, 'sendDateTo')}
                      renderInput={params => <TextField {...params} variant="standard" />}
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
                if (!params?.sendDateFrom || !params?.sendDateTo) {
                  alert('기간을 설정해주세요');
                } else {
                  setIsFilter(!isFilter);
                }
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
          items={(pushHistoryList?.data || []).map((item, index) => {
            return (
              <tr key={`tr-${index}`}>
                <td className="magic" title={item?.receiverId}>
                  {item?.receiverId}
                </td>
                <td className="magic" title={item?.receiver}>
                  {item?.receiver}
                </td>
                <td className="magic" title={item?.senderId}>
                  {item?.senderId}
                </td>
                <td className="magic" title={item?.pushType}>
                  {item?.pushType}
                </td>
                <td className="magic" title={dayjs(item?.sendDate).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item?.sendDate).format('YYYY-MM-DD HH:mm:ss')}
                </td>
                <td className="magic" title={item?.sendStatus}>
                  {item?.sendStatus}
                </td>
                <td className="magic" title={dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
                <td className="magic" title={dayjs(item?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={(pushHistoryList?.data || []).length === 0 || false}
        />
        <AdminPagination {...pageProps} />
      </div>
    </div>
  );
}

export default ReceiverTemplate;
