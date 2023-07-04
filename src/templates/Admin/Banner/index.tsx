import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import { Table } from '../../../stories/components';
import dayjs from 'dayjs';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';

const cx = classNames.bind(styles);

interface BannerTemplateProps {
  bannerList?: any;
  onSearch?: (searchKeyword: string) => void;
  pageProps?: any;
  onSaveBanner?: (data: any) => void;
}

export function BannerTemplate({ bannerList, onSearch, pageProps, onSaveBanner }: BannerTemplateProps) {
  const focusRef = useRef<HTMLDivElement>(null);
  const COLGROUP = ['8%', '8%', '8%', '8%', '8%', '8%'];
  const HEADS = ['배너아이디', '노출시간(초)', '노출시작일시', '노출종료일시', '생성일', '수정일'];

  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    if (bannerList) {
      const tempBanners = [];
      for (const item of bannerList) {
        tempBanners.push({
          bannerId: item.bannerId,
          exposureDurationSec: item.exposureDurationSec,
          exposureEndDate: item.exposureEndDate,
          exposureStartDate: item.exposureStartDate,
          imageUrl: item.imageUrl,
          linkUrl: item.linkUrl,
          order: item.order,
        });
      }
      setBanners(tempBanners || []);
    }
  }, [bannerList]);

  const onShowPopup = event => {
    const { name } = event.target;
    if (!name) {
      setPopupOpen(true);
    }
  };

  const onChangeBanner = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    const { name, value } = event.currentTarget;
    const tempBanners = [...banners];
    tempBanners[index][name] = value;
    setBanners(tempBanners);
  };

  const handlePickerChange = (moment, index, key) => {
    const datetime = moment.format('YYYY-MM-DD HH:mm:ss.SSS');
    const tempBanners = [...banners];
    tempBanners[index][key] = datetime;
    setBanners(tempBanners);
  };

  const addBanner = () => {
    const tempBanners = [...banners];
    if (tempBanners.length >= 10) {
      alert('배너는 최대 10개까지 등록 가능합니다.');
      return;
    }
    tempBanners.push({
      bannerId: '',
      order: tempBanners.length + 1,
      imageUrl: '',
      linkUrl: '',
      exposureDurationSec: '',
      exposureStartDate: '',
      exposureEndDate: '',
    });
    setBanners(tempBanners);
    setTimeout(() => focusRef.current?.lastElementChild.scrollIntoView({ behavior: 'smooth' }), 10);
  };

  const onClosePopup = () => {
    setPopupOpen(false);
    setBanners(bannerList);
  };

  const removeBanner = (index: number) => {
    const tempBanners = [...banners];
    tempBanners.splice(index, 1);
    setBanners(tempBanners);
  };

  return (
    <div className="content">
      <h2 className="tit-type1">배너 관리</h2>
      <div className="path">
        <span>Home</span> <span>배너 목록(세미나)</span>
      </div>
      <div className="data-top">
        <div className="left" style={{ zIndex: 1 }}>
          <button className="btn-type1 type1" onClick={event => onShowPopup(event)}>
            배너 추가/제거
          </button>
        </div>
      </div>
      <div className="data-type1" data-evt="main-table-on">
        <Table
          name="member"
          colgroup={COLGROUP}
          heads={HEADS}
          items={bannerList?.map((item, index) => {
            return (
              <tr key={`tr-${index}`}>
                <td className="magic" title={item.bannerId}>
                  {item.bannerId}
                </td>
                <td className="magic" title={item.exposureDurationSec}>
                  {item.exposureDurationSec}
                </td>
                <td className="magic" title={dayjs(item.exposureStartDate).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.exposureStartDate).format('YYYY-MM-DD HH:mm:ss')}
                </td>
                <td className="magic" title={dayjs(item.exposureEndDate).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.exposureEndDate).format('YYYY-MM-DD HH:mm:ss')}
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
          isEmpty={bannerList?.length === 0 || false}
        />
      </div>
      <div className={cx('side-layer', popupOpen ? 'open' : '')}>
        <div className="dim"></div>
        <div className="side-contents">
          <div className="layer-top">
            <div className="left" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: 30, marginRight: 30 }}>
                <button onClick={onClosePopup}>
                  <i className="ico i-x"></i>
                </button>
              </div>
              <div className="tit-type2">배너 상세 보기</div>
            </div>
            <div className="right">
              <button className="btn-type1 type2" onClick={addBanner}>
                추가
              </button>
              <button className="btn-type1 type1" onClick={() => onSaveBanner(banners)}>
                저장
              </button>
            </div>
          </div>
          <div className="tab-content" data-id="tabLink01">
            <div className="layout-grid" ref={focusRef}>
              {banners?.map((item, index) => {
                return (
                  <div
                    className="grid-100 mb-5"
                    style={{ border: '1px solid #dddd', padding: 30, borderRadius: 5 }}
                    key={`banner-${index}`}
                  >
                    <div style={{ textAlign: 'right' }}>
                      <button className="btn-type1 type2" onClick={() => removeBanner(index)}>
                        제거
                      </button>
                    </div>
                    <div className="inpwrap mb-4">
                      <div className="inp-tit">
                        배너 아이디<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="text"
                          disabled
                          name="bannerId"
                          className="input-admin"
                          value={item.bannerId || ''}
                          onChange={event => onChangeBanner(event, index)}
                        />
                      </div>
                    </div>
                    <div className="inpwrap mb-4">
                      <div className="inp-tit">
                        배너 노출 순서<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="number"
                          name="order"
                          className="input-admin"
                          value={item.order || ''}
                          onChange={event => onChangeBanner(event, index)}
                        />
                      </div>
                    </div>
                    <div className="inpwrap mb-4">
                      <div className="inp-tit">
                        배너 이미지 링크<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="text"
                          name="imageUrl"
                          className="input-admin"
                          value={item.imageUrl || ''}
                          onChange={event => onChangeBanner(event, index)}
                        />
                      </div>
                    </div>
                    <div className="inpwrap mb-4">
                      <div className="inp-tit">
                        배너 링크<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="text"
                          name="linkUrl"
                          className="input-admin"
                          value={item.linkUrl || ''}
                          onChange={event => onChangeBanner(event, index)}
                        />
                      </div>
                    </div>
                    <div className="inpwrap mb-4">
                      <div className="inp-tit">
                        배너 노출 시간(초)<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="number"
                          name="exposureDurationSec"
                          className="input-admin"
                          value={item.exposureDurationSec || ''}
                          onChange={event => onChangeBanner(event, index)}
                        />
                      </div>
                    </div>
                    <div className="inpwrap mb-4">
                      <div className="inp-tit">
                        노출시작일시<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DateTimePicker
                            label="노출시작일시"
                            inputFormat="YYYY-MM-DD HH:mm"
                            value={item.exposureStartDate}
                            className={cx('basic-info-page__picker')}
                            onChange={e => handlePickerChange(e, index, 'exposureStartDate')}
                            renderInput={params => <TextField {...params} variant="standard" />}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="inpwrap mb-4">
                      <div className="inp-tit">
                        노출종료일시<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DateTimePicker
                            label="노출종료일시"
                            inputFormat="YYYY-MM-DD HH:mm"
                            value={item.exposureEndDate}
                            className={cx('basic-info-page__picker')}
                            onChange={e => handlePickerChange(e, index, 'exposureEndDate')}
                            renderInput={params => <TextField {...params} variant="standard" />}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerTemplate;
