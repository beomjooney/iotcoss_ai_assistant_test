import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import { DateTimePicker, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Toggle } from 'src/stories/components';
import { TextField, Slider } from '@mui/material';

export interface SmartFilter {
  name: string;
  isFilterOpen?: boolean;
  fields: any[];
  onSearch?: (params: any) => void;
  params?: any;
  setParams?: (params: any) => void;
}

const cx = classNames.bind(styles);

const SmartFilter = ({ name, isFilterOpen = false, fields, setParams, params, onSearch }: SmartFilter) => {
  const filterRef = useRef();

  const [searchParams, setSearchParams] = useState({});

  const onChangeKeyword = event => {
    const { name, value } = event.currentTarget;

    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const onChange = (name, value) => {
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const timeValues = {
    from: '00:00:00.000',
    to: '23:59:00.000',
  };

  const onChangeHandlePicker = (date, item) => {
    let formattedDate = date?.format('YYYY-MM-DD');
    if (!formattedDate) {
      let time = timeValues[item?.dateType] || '00:00:00.000';
      let datetime = `${formattedDate} ${time}`;
      setSearchParams({
        ...searchParams,
        [item?.field]: '',
      });
    } else {
      let time = timeValues[item?.dateType] || '00:00:00.000';
      let datetime = `${formattedDate} ${time}`;
      setSearchParams({
        ...searchParams,
        [item?.field]: datetime,
      });
    }
  };

  const onChangeHandleFromToDate = (date, item) => {
    let formattedDate = date?.format('YYYY-MM-DD');
    if (!formattedDate) {
      let time = timeValues[item?.dateType] || '00:00:00.000';
      let datetime = `${formattedDate} ${time}`;
      setSearchParams({
        ...searchParams,
        [item?.name]: '',
      });
    } else {
      let time = timeValues[item?.dateType] || '00:00:00.000';
      let datetime = `${formattedDate} ${time}`;
      setSearchParams({
        ...searchParams,
        [item?.name]: datetime,
      });
    }
  };

  const handleSearch = () => {
    if (setParams) {
      let result = { ...params, ...searchParams };
      setParams(result);
      onSearch(result);
    } else {
      onSearch(searchParams);
    }
  };

  const handleSliderChange = (event: Event, newValue: number | number[], item) => {
    setSearchParams({
      ...searchParams,
      [item?.sliderValueName[0]]: newValue[0],
      [item?.sliderValueName[1]]: newValue[1],
    });
  };

  const handleCheckboxChange = (e, key, type = 'string') => {
    const { value, checked } = e.target;
    const values = searchParams[key]?.split(',') || [];

    if (type === 'array') {
      if (checked) {
        setSearchParams({
          ...searchParams,
          [key]: [...values, value],
        });
      } else {
        setSearchParams({
          ...searchParams,
          [key]: values.filter(v => v !== value),
        });
      }
    } else {
      const newValues = checked ? [...values, value] : values.filter(v => v !== value);

      setSearchParams({
        ...searchParams,
        [key]: newValues.join(','),
      });
    }
  };

  return (
    <div className="filter-layer" style={{ display: isFilterOpen ? 'block' : 'none' }} ref={filterRef}>
      <div className="layout-grid">
        {(fields || [])?.map((item, index) => {
          return (
            <>
              {item?.type === 'text' && (
                <div className={`grid-${item.grid || '25'}`}>
                  <div className="inpwrap">
                    <div className="inp-tit">{item.name}</div>
                    <input className="input-admin" type="text" name={item.field} onChange={onChangeKeyword} />
                  </div>
                </div>
              )}
              {item?.type === 'choice' && (
                <div className={`grid-${item.grid || '25'}`}>
                  <div className="inpwrap">
                    <div className="inp-tit">{item.name}</div>
                    <select name={item.field} onChange={onChangeKeyword} style={{ width: '100%' }}>
                      <option value="">-- 선택 --</option>
                      {item?.data?.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {item?.type === 'fromTo' && (
                <div className={`grid-${item.grid || '50'}`}>
                  <div className="inpwrap">
                    <div className="inp-tit">{item.name}</div>
                    <div className={cx('fromTo')}>
                      <input
                        className="input-admin"
                        type="text"
                        name={item?.fieldNames[0]}
                        onChange={onChangeKeyword}
                      />
                      <div>-</div>
                      <input
                        className="input-admin"
                        type="text"
                        name={item?.fieldNames[1]}
                        onChange={onChangeKeyword}
                      />
                    </div>
                  </div>
                </div>
              )}
              {item?.type === 'slider' && (
                <div className={`grid-${item.grid || '25'}`}>
                  <div className="inpwrap">
                    <div className="inp-tit">{item.name}</div>
                    <div className={cx('slider')}>
                      <Slider
                        getAriaLabel={() => item.sliderValueName[0]}
                        value={[searchParams[item.sliderValueName[0]], searchParams[item.sliderValueName[1]]] || [0, 0]}
                        onChange={(event, value) => handleSliderChange(event, value, item)}
                        valueLabelDisplay="auto"
                      />
                    </div>
                  </div>
                </div>
              )}
              {item?.type === 'fromToDate' && (
                <div className={`grid-${item.grid || '50'}`}>
                  <div className="inpwrap">
                    <div className="inp-tit">{item.name}</div>
                    <div className={cx('fromToDate')}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          inputFormat="YYYY-MM-DD"
                          value={searchParams[item?.fieldNames[0]] || null}
                          onChange={e =>
                            onChangeHandleFromToDate(e, { ...item, dateType: 'from', name: item?.fieldNames[0] })
                          }
                          renderInput={params => <TextField {...params} variant="standard" />}
                        />
                      </LocalizationProvider>
                      <div className="mx-2">-</div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          inputFormat="YYYY-MM-DD"
                          value={searchParams[item?.fieldNames[1]] || null}
                          onChange={e =>
                            onChangeHandleFromToDate(e, { ...item, dateType: 'to', name: item?.fieldNames[1] })
                          }
                          renderInput={params => <TextField {...params} variant="standard" />}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
              )}
              {item?.type === 'date' && (
                <div className={`grid-${item.grid || '50'}`}>
                  <div className="inpwrap">
                    <div className="inp-tit">{item.name}</div>
                    <div className="" key={item.field}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          inputFormat="YYYY-MM-DD"
                          value={searchParams[item?.field] || null}
                          onChange={e => onChangeHandlePicker(e, item)}
                          renderInput={params => <TextField {...params} variant="standard" />}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
              )}
              {item.type === 'toggle' && (
                <div className={`grid-${item.grid || '100'}`}>
                  <div className="inpwrap">
                    <div className="inp-tit">{item.name}</div>
                    <div className={cx('toggle')}>
                      {item?.data?.map(option => {
                        return (
                          <span
                            key={option?.id}
                            className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}
                          >
                            <Toggle
                              isActive
                              label={option.name}
                              name="toggle"
                              type="checkBox"
                              className={cx('fixed-width')}
                              value={option.id}
                              key={option.id}
                              onChange={e => handleCheckboxChange(e, item?.field)}
                            />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {item?.type === 'blank' && (
                <div className={`grid-${item.grid || '100'}`} style={{ margin: '0px' }}>
                  <div className="inpwrap"></div>
                </div>
              )}
            </>
          );
        })}
      </div>
      <div className="btn-box">
        <button className="btn-type1 type1" onClick={handleSearch}>
          검색
        </button>
      </div>
    </div>
  );
};

export default SmartFilter;
