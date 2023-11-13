import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { AdminPagination, Editor, SmartFilter, Table, Toggle, Textfield, Button } from '../../../stories/components';
import dayjs from 'dayjs';
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { useStore } from 'src/store';
import { usePlaceTypes, useJobs } from 'src/services/code/code.queries';
import { SeminarContent } from 'src/models/recommend';
import { useUploadImage } from 'src/services/image/image.mutations';

const cx = classNames.bind(styles);

interface ClubTemplateProps {
  clubList?: any;
  seminarData?: any;
  seminarParticipantList?: any[];
  jobCodes?: any[];
  seminarTypes?: any[];
  seminarStatus?: any[];
  paymentTypes?: any[];
  pageProps?: any;
  onSeminarInfo?: (seminarId: string) => void;
  onSearch?: (searchKeyword: string) => void;
  onSeminarApply?: (data: any) => void;
  onDelete?: (seminarId: string) => void;
  onSave?: (params: any) => void;
  onAdd?: (data: any) => void;
}

export function AdminClubTemplate({}: ClubTemplateProps) {
  const COLGROUP = ['8%', '8%', '10%', '6%', '6%', '7%', '6%', '6%', '6%', '8%', '8%', '8%'];
  const HEADS = [
    '클럽아이디',
    '회원UUID',
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
  const POPUP_COLGROUP = ['15%', '10%', '15%', '15%', '10%'];
  const POPUP_HEADS = ['신청자 아이디', '이름', '닉네임', '전화번호', '등록일시'];

  const TAB2_COLGROUP = ['10%', '10%', '15%', '10%', '15%', '15%', '10%', '13%'];
  const TAB2_HEADS = ['회원UUID', '이름', '닉네임', '상태', '가입신청일시', '가입승인일시', '학습횟수', '좋아요 수'];

  const TAB3_COLGROUP = ['10%', '10%', '10%', '15%', '13%', '13%', '13%'];
  const TAB3_HEADS = ['퀴즈순서', '학습 주차', '대표 여부', '발행일시', '퀴즈 좋아요 수', '답변 수', '등록일시'];

  const LEVELS = [
    { level: 1, desc: '상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요' },
    { level: 2, desc: '상용서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능' },
    { level: 3, desc: '상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능' },
    { level: 4, desc: '다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더' },
    { level: 5, desc: '본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩' },
  ];

  const FIELDS = [
    { name: '클럽아이디', field: 'seminarId', type: 'text' },
    { name: '클럽명', field: 'seminarTitle', type: 'text' },
    { name: '추천직군', field: 'seminarSubTitle', type: 'text' },
    { name: '추천직무', field: 'seminarIntroduction', type: 'text' },
    { name: '추천레벨', field: 'description', type: 'text' },
    { name: '설명', field: 'seminarStatus', type: 'choice' },
    { name: '공개여부', field: 'seminarType', type: 'choice' },
    { name: '모집회원수', field: 'organizerMemberId', type: 'text' },
    { name: '퀴즈시작일', field: 'lecturerMemberId', type: 'text' },
    { name: '퀴즈종료일', field: 'lecturerName', type: 'text' },
    { name: '학습주수', field: 'recommendJobGroups', type: 'text' },
    { name: '학습주기', field: 'recommendJobGroups', type: 'text' },
    { name: '학습주수', field: 'recommendJobGroups', type: 'text' },
    { name: '상태', field: 'recommendLevels', type: 'text' },
    { name: '등록일시', field: 'keywords', type: 'text' },
  ];

  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [introduceEditor, setIntroduceEditor] = useState<string>('');
  const [curriculumEditor, setCurriculumEditor] = useState<string>('');
  const [faqEditor, setFaqEditor] = useState<string>('');
  const [tabValue, setTabValue] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [seminarParams, setSeminarParams] = useState<any>();
  const [regitserValues, setRegisterValues] = useState<any>({});
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState<boolean>(false);

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

  const { placeTypes, setPlaceTypes } = useStore();
  const { data: jobs } = useJobs();

  const { isFetched: isPlaceTypeFetched } = usePlaceTypes(data => setPlaceTypes(data || []));

  const seminarList = [];
  const jobCodes = [];
  const pageProps = [];
  const paymentTypes = [];
  const seminarStatus = [];
  const seminarTypes = [];
  const seminarData = [];
  const seminarParticipantList = [];

  useEffect(() => {
    let keywords = '';
    if (seminarData) {
      if (seminarData?.keywords?.length > 0) {
        keywords = seminarData?.keywords.join(',');
      }
      setSeminarParams({
        ...seminarData,
        keywords,
        imageUrl1: seminarData?.imageUrl1 || null,
        imageUrl2: seminarData?.imageUrl2 || null,
        imageUrl3: seminarData?.imageUrl3 || null,
      });
    }
  }, [seminarData]);

  useEffect(() => {
    !popupOpen && setTabValue(1);
  }, [popupOpen]);

  const onShowPopup = (seminarId: string) => {
    onSeminarInfo && onSeminarInfo(seminarId);
    setPopupOpen(true);
    setIsRegisterPopupOpen(false);
  };

  const handleSearchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearchKeyword(value);
  };

  const onChangeSeminar = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    setSeminarParams({
      ...seminarParams,
      [name]: value,
    });
  };

  const handleTab = (value: number) => {
    setTabValue(value);
  };

  const handlePickerChange = (moment, key) => {
    const datetime = moment.format('YYYY-MM-DD HH:mm:ss.SSS');
    if (popupOpen) {
      setSeminarParams({
        ...seminarParams,
        [key]: datetime,
      });
    } else {
      setRegisterValues({
        ...regitserValues,
        [key]: datetime,
      });
    }
  };

  const handleCheckboxChange = (event, name) => {
    const { value, checked } = event.target;
    if (popupOpen) {
      const recommendJobGroups = [...seminarParams.recommendJobGroups];
      const recommendLevels = [...seminarParams.recommendLevels];
      let seminarPlaceType = seminarParams.seminarPlaceType;

      if (name === 'recommendJobGroups') {
        if (recommendJobGroups.includes(value)) {
          recommendJobGroups.splice(recommendJobGroups.indexOf(value), 1);
        } else {
          recommendJobGroups.push(value);
        }
      } else if (name === 'recommendLevels') {
        if (recommendLevels.includes(Number(value))) {
          recommendLevels.splice(recommendLevels.indexOf(Number(value)), 1);
        } else {
          recommendLevels.push(Number(value));
        }
      } else if (name === 'seminarPlaceType') {
        seminarPlaceType = value;
      }

      setSeminarParams({
        ...seminarParams,
        recommendJobGroups,
        recommendLevels,
        seminarPlaceType,
      });
    } else {
      const temp = new Set(regitserValues[name]);
      const isNumberType = name === 'recommendLevels';
      if (checked) temp.add(isNumberType ? parseInt(value) : value);
      else temp.delete(value);
      setRegisterValues({ ...regitserValues, [name]: [...temp] });
    }
  };

  const handleSeminarApply = (event: React.MouseEvent<HTMLButtonElement>, memberId: string) => {
    const { name } = event.currentTarget;
    const params = {
      approvalStatus: name === 'apply' ? '0002' : '0003',
      noShow: false,
      memberId,
    };
    onSeminarApply && onSeminarApply(params);
  };

  const handleSave = () => {
    if (!introduceEditor || !curriculumEditor || introduceEditor?.length === 0 || curriculumEditor?.length === 0) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const keywords = seminarParams?.keywords.split(',');
    const params = {
      ...seminarParams,
      keywords,
      imageUrl1: imageUrl1?.toString()?.slice(1) || seminarParams?.imageUrl1,
      imageUrl2: imageUrl2?.toString()?.slice(1) || seminarParams?.imageUrl2,
      imageUrl3: imageUrl3?.toString()?.slice(1) || seminarParams?.imageUrl3,
      seminarIntroduction: introduceEditor,
      seminarCurriculum: curriculumEditor,
      seminarFaq: faqEditor,
      lecturerMemberId: seminarParams.seminarLecturer.memberId,
      lecturerName: seminarParams.seminarLecturer.name,
      organizerMemberId: seminarParams.seminarLecturer.memberId, // 등록자
    };
    onSave && onSave(params);
    setIsEdit(false);
  };

  const onSmartFilterSearch = (params: any) => {
    onSearch && onSearch(params);
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

  const handleOnAdd = () => {
    let params = { ...regitserValues };
    if (!introduceEditor || !curriculumEditor || introduceEditor?.length === 0 || curriculumEditor?.length === 0) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (
      regitserValues.seminarStartDate > regitserValues.seminarEndDate ||
      regitserValues.seminarRegistrationStartDate > regitserValues.seminarRegistrationEndDate
    ) {
      alert('시작일은 종료일 보다 클 수 없습니다.');
      return;
    }

    if (regitserValues.seminarStartDate <= regitserValues.seminarRegistrationEndDate) {
      alert('세미나 시작일은 접수 종료일 이후로 지정해주세요.');
      return;
    }
    const registDate = moment().format('YYYY-MM-DD hh:mm');
    params = {
      ...regitserValues,
      seminarStatus: regitserValues?.seminarStatus || seminarStatus[0]?.id,
      keywords: regitserValues?.keywords ? regitserValues?.keywords.split(',') : [''],
      seminarPlaceType: regitserValues?.seminarPlaceType.join(',') || '',
      seminarType: regitserValues?.seminarType || seminarTypes[0]?.id,
      paymentType: regitserValues?.paymentType || paymentTypes[0]?.id,
      imageUrl1: registerImageUrl1.toString().slice(1),
      imageUrl2: registerImageUrl2.toString().slice(1),
      imageUrl3: registerImageUrl3.toString().slice(1),
      seminarIntroduction: introduceEditor,
      seminarCurriculum: curriculumEditor,
      seminarFaq: faqEditor,
      registDate: `${registDate}:00.000`,
    };
    onAdd && onAdd(params);
  };

  const onShowUpRegisterPopUp = event => {
    setPopupOpen(false);
    setIsRegisterPopupOpen(true);
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

  const closeRegisterPopup = () => {
    setRegisterValues({});
    setCurriculumEditor('');
    setFaqEditor('');
    setIntroduceEditor('');
    setTempImageUrl1('');
    setTempImageUrl2('');
    setTempImageUrl3('');
    setIsRegisterPopupOpen(false);
  };

  return (
    <div className="content manage-seminar-container">
      <h2 className="tit-type1">클럽관리</h2>
      <div className="path">
        <span>Home</span> <span>클럽 목록</span>
      </div>
      <div className="data-top">
        <div className="left">
          {/* <button className="btn-type1 type1" onClick={event => onShowUpRegisterPopUp(event)}>
            등록
          </button> */}
        </div>
        <div className="right">
          <div className="inpwrap">
            <div className="inp search">
              <input
                type="text"
                className="input-admin"
                placeholder="검색어"
                onChange={handleSearchKeyword}
                value={searchKeyword}
                onKeyDown={event => onSearch && event.key === 'Enter' && onSearch(searchKeyword)}
              />
              <button className="btn" onClick={() => onSearch && onSearch(searchKeyword)}>
                <i className="ico i-search"></i>
              </button>
            </div>
          </div>
          <button className="btn-type1 type3" onClick={() => setIsFilter(!isFilter)}>
            <i className="ico i-filter"></i>
            <span>필터</span>
          </button>
        </div>
        <SmartFilter name="mentorFilter" fields={FIELDS} isFilterOpen={isFilter} onSearch={onSmartFilterSearch} />
      </div>
      <div className="data-type1" data-evt="main-table-on">
        <Table
          name="member"
          colgroup={COLGROUP}
          heads={HEADS}
          items={seminarList?.data?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.seminarId)}>
                {/*<td>{item.seminarId}</td>*/}
                <td className="magic" title={dayjs(item.seminarStartDate).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.seminarStartDate).format('YYYY-MM-DD HH:mm:ss')}
                </td>
                <td className="magic" title={item?.seminarLecturer?.name}>
                  {item?.seminarLecturer?.name}
                </td>
                <td className="magic" title={item.seminarTitle}>
                  {item.seminarTitle}
                </td>
                <td className="magic" title={item.seminarLecturer}>
                  {/* {item.seminarLecturer.name} */}
                </td>
                <td className="magic" title={item.seminarStatusName}>
                  {item.seminarStatusName}
                </td>
                <td className="magic" title={item.seminarTypeName}>
                  {item.seminarTypeName}
                </td>
                <td className="magic" title={item.participantCount}>
                  {item.participantCount}
                </td>
                <td
                  className="magic"
                  title={`${item.currentParticipantCount} (${item.approveWaitingParticipantCount})`}
                >
                  {item.currentParticipantCount} ({item.approveWaitingParticipantCount})
                </td>
                <td className="magic" title={item.paymentTypeName}>
                  {item.paymentTypeName}
                </td>
                <td className="magic" title={item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}>
                  {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </td>
                <td className="magic" title={item.recommendJobGroupNames.join(', ')}>
                  {item.recommendJobGroupNames.join(', ')}
                </td>
                <td className="magic" title={item.keywords.join(', ')}>
                  {item.keywords.join(', ')}
                </td>
                <td className="magic" title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
                {/*<td>{dayjs(item.updatedAt).format('YYYY-MM-DD mm:hh:ss')}</td>*/}
              </tr>
            );
          })}
          isEmpty={seminarList?.data?.length === 0 || false}
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
              <div className="tit-type2">클럽 상세 정보</div>
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
                    onDelete && onDelete(seminarData.seminarId);
                  }}
                >
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
            <li className={tabValue === 2 ? 'on' : ''}>
              <a
                href="#"
                onClick={() => {
                  handleTab(2);
                  setIsEdit(false);
                }}
              >
                클럽 회원 정보
              </a>
            </li>
            <li className={tabValue === 3 ? 'on' : ''}>
              <a
                href="#"
                onClick={() => {
                  handleTab(3);
                  setIsEdit(false);
                }}
              >
                클럽 퀴즈 정보
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
                        name="seminarId"
                        disabled
                        value={seminarParams?.seminarId || ''}
                        onChange={onChangeSeminar}
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
                        name="seminarTitle"
                        value={seminarParams?.seminarTitle || ''}
                        onChange={onChangeSeminar}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      회원UUID(리더)<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="seminarSubTitle"
                        value={seminarParams?.seminarSubTitle || ''}
                        onChange={onChangeSeminar}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      개설회원 아이디<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="memberId"
                        value={seminarParams?.seminarLecturer?.memberId || ''}
                        onChange={onChangeSeminar}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div> */}
                {/* <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      강사명<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="lecturerName"
                        value={seminarParams?.seminarLecturer?.name || ''}
                        onChange={onChangeSeminar}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div> */}
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      모집회원 수<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="participantCount"
                        value={seminarParams?.participantCount || ''}
                        onChange={onChangeSeminar}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      결제유형<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <select
                        name="paymentType"
                        onChange={onChangeSeminar}
                        value={seminarParams?.paymentType || ''}
                        disabled={!isEdit}
                      >
                        {paymentTypes?.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div> */}
                {/* <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      가격<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="price"
                        value={seminarParams?.price || 0}
                        onChange={onChangeSeminar}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div> */}
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      키워드(해시태그)<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="keywords"
                        value={seminarParams?.keywords || ''}
                        onChange={onChangeSeminar}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      학습 주수<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="keywords"
                        value={seminarParams?.keywords || ''}
                        onChange={onChangeSeminar}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      학습 주기<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <select
                        name="seminarStatus"
                        onChange={onChangeSeminar}
                        value={seminarParams?.seminarStatus || ''}
                        disabled={!isEdit}
                      >
                        {seminarStatus?.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      클럽 상태<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <select
                        name="seminarStatus"
                        onChange={onChangeSeminar}
                        value={seminarParams?.seminarStatus || ''}
                        disabled={!isEdit}
                      >
                        {seminarStatus?.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      공개 여부<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <select
                        name="seminarStatus"
                        onChange={onChangeSeminar}
                        value={seminarParams?.seminarStatus || ''}
                        disabled={!isEdit}
                      >
                        {seminarStatus?.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      참여코드<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="keywords"
                        value={seminarParams?.keywords || ''}
                        onChange={onChangeSeminar}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      추천직군<span className="star">*</span>
                    </div>
                    <div className="inp">
                      {jobCodes?.map(item => (
                        <span key={item.id} className={cx('col-md-2', 'pl-0')}>
                          <Toggle
                            isActive
                            label={item.name}
                            name={item.name}
                            type="checkBox"
                            value={item.id || ''}
                            checked={seminarParams?.recommendJobGroups?.includes(item.id) || false}
                            onChange={e => handleCheckboxChange(e, 'recommendJobGroups')}
                            disabled={!isEdit}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      추천직무<span className="star">*</span>
                    </div>
                    <div className="inp">
                      {jobCodes?.map(item => (
                        <span key={item.id} className={cx('col-md-2', 'pl-0')}>
                          <Toggle
                            isActive
                            label={item.name}
                            name={item.name}
                            type="checkBox"
                            value={item.id || ''}
                            checked={seminarParams?.recommendJobGroups?.includes(item.id) || false}
                            onChange={e => handleCheckboxChange(e, 'recommendJobGroups')}
                            disabled={!isEdit}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      추천레벨<span className="star">*</span>
                    </div>
                    <div className="inp">
                      {LEVELS.map(item => (
                        <span key={item.level} className={cx('col-md-2', 'pl-0')}>
                          <Toggle
                            isActive
                            label={`${item.level}레벨`}
                            name={`${item.level}레벨`}
                            type="checkBox"
                            value={item.level || ''}
                            checked={seminarParams?.recommendLevels?.includes(item.level) || false}
                            onChange={e => handleCheckboxChange(e, 'recommendLevels')}
                            disabled={!isEdit}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit" style={{ height: 25 }}>
                      퀴즈 시작 일시<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        {/* <DateTimePicker
                          inputFormat="YYYY-MM-DD HH:mm"
                          value={seminarParams?.seminarStartDate || ''}
                          className={cx('basic-info-page__picker')}
                          onChange={e => handlePickerChange(e, 'seminarStartDate')}
                          renderInput={params => <TextField {...params} variant="standard" />}
                          disabled={!isEdit}
                        /> */}
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit" style={{ height: 25 }}>
                      퀴즈 종료 일시<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        {/* <DateTimePicker
                          inputFormat="YYYY-MM-DD HH:mm"
                          value={seminarParams?.seminarEndDate || ''}
                          className={cx('basic-info-page__picker')}
                          onChange={e => handlePickerChange(e, 'seminarEndDate')}
                          renderInput={params => <TextField {...params} variant="standard" />}
                          disabled={!isEdit}
                        /> */}
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
                {/* <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit" style={{ height: 25 }}>
                      세미나 접수 시작 일시<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          inputFormat="YYYY-MM-DD HH:mm"
                          value={seminarParams?.seminarRegistrationStartDate || ''}
                          className={cx('basic-info-page__picker')}
                          onChange={e => handlePickerChange(e, 'seminarRegistrationStartDate')}
                          renderInput={params => <TextField {...params} variant="standard" />}
                          disabled={!isEdit}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div> */}
                {/* <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit" style={{ height: 25 }}>
                      세미나 접수 종료 일시<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          inputFormat="YYYY-MM-DD HH:mm"
                          value={seminarParams?.seminarRegistrationEndDate || ''}
                          className={cx('basic-info-page__picker')}
                          onChange={e => handlePickerChange(e, 'seminarRegistrationEndDate')}
                          renderInput={params => <TextField {...params} variant="standard" />}
                          disabled={!isEdit}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div> */}
                {/* <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit" style={{ height: 25 }}>
                      위치<span className="star">*</span>
                    </div>
                  </div>
                  <div className="inp">
                    {isPlaceTypeFetched &&
                      placeTypes.map((item, i) => (
                        <Toggle
                          key={item.id}
                          label={item.name}
                          name="seminarPlaceType"
                          value={item.id}
                          variant="small"
                          disabled={!isEdit}
                          className={cx(
                            'fixed-width',
                            'seminar-location-area__toggle',
                            `${!isEdit && 'seminar-location-area__disabled'}`,
                          )}
                          isActive
                          checked={seminarParams?.seminarPlaceType.includes(item.id) || false}
                          onChange={e => handleCheckboxChange(e, 'seminarPlaceType')}
                        />
                      ))}
                  </div>
                </div>
                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      장소<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <Textfield
                        name="seminarPlace"
                        isUnderline
                        disabled={!isEdit}
                        value={seminarParams?.seminarPlace || ''}
                        placeholder="세미나 진행 희망 장소를 입력해주세요."
                        onChange={onChangeSeminar}
                      />
                    </div>
                  </div>
                </div> */}
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp">
                      <div className={cx('seminar-image-area')}>
                        <div className={cx('seminar-image-area__upload')}>
                          {imageUploadItem(
                            '클럽 이미지',
                            'imageUrl1',
                            tempImageUrl1 ||
                              `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${seminarParams?.imageUrl1}`,
                          )}
                          {/* {imageUploadItem(
                            '세미나 장표 #1',
                            'imageUrl2',
                            tempImageUrl2 ||
                              `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${seminarParams?.imageUrl2}`,
                          )}
                          {imageUploadItem(
                            '세미나 장표 #2',
                            'imageUrl3',
                            tempImageUrl3 ||
                              `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${seminarParams?.imageUrl3}`,
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-100 mt-5">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      클럽 설명<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <Editor
                        type="seminar"
                        data={seminarParams?.seminarIntroduction || ''}
                        onChange={(event, editor) => {
                          setIntroduceEditor(editor.getData());
                        }}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                {/*
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      커리큘럼<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <Editor
                        type="seminar"
                        data={seminarParams?.seminarCurriculum || ''}
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
                        data={seminarParams?.seminarFaq || ''}
                        onChange={(event, editor) => setFaqEditor(editor.getData())}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          )}
          {tabValue === 2 && popupOpen && (
            <div className="tab-content" data-id="tabLink02">
              <hr className="h40" />
              <div className="data-type1" data-evt="table-on">
                <Table
                  name="seminarMember"
                  colgroup={TAB2_COLGROUP}
                  heads={TAB2_HEADS}
                  items={seminarParticipantList?.map((item, index) => {
                    return (
                      <tr key={`participant-${index}`}>
                        <td>{item.memberId}</td>
                        <td>{item.name}</td>
                        <td>{item.nickname}</td>
                        <td>{item.phoneNumber}</td>
                        <td>{dayjs(item.createdAt).format('YYYY-MM-DD')}</td>
                        <td>
                          <div className="right">
                            {['0001', '0003', '0004'].includes(item.approvalStatus) ? (
                              <button
                                className="btn-type1 type3"
                                name="apply"
                                onClick={event => handleSeminarApply(event, item.memberId)}
                              >
                                승인
                              </button>
                            ) : (
                              <button
                                className="btn-type1 type4"
                                name="cancel"
                                onClick={event => handleSeminarApply(event, item.memberId)}
                              >
                                반려
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  isEmpty={seminarParticipantList?.length === 0 || false}
                />
              </div>
            </div>
          )}
          {tabValue === 3 && popupOpen && (
            <div className="tab-content" data-id="tabLink02">
              <hr className="h40" />
              <div className="data-type1" data-evt="table-on">
                <Table
                  name="seminarMember"
                  colgroup={TAB3_COLGROUP}
                  heads={TAB3_HEADS}
                  items={seminarParticipantList?.map((item, index) => {
                    return (
                      <tr key={`participant-${index}`}>
                        <td>{item.memberId}</td>
                        <td>{item.name}</td>
                        <td>{item.nickname}</td>
                        <td>{item.phoneNumber}</td>
                        <td>{dayjs(item.createdAt).format('YYYY-MM-DD')}</td>
                        <td>
                          <div className="right">
                            {['0001', '0003', '0004'].includes(item.approvalStatus) ? (
                              <button
                                className="btn-type1 type3"
                                name="apply"
                                onClick={event => handleSeminarApply(event, item.memberId)}
                              >
                                승인
                              </button>
                            ) : (
                              <button
                                className="btn-type1 type4"
                                name="cancel"
                                onClick={event => handleSeminarApply(event, item.memberId)}
                              >
                                반려
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  isEmpty={seminarParticipantList?.length === 0 || false}
                />
              </div>
            </div>
          )}
        </div>
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
                <div className="tit-type2">세미나 등록</div>
              </div>
              <div className="right">
                <button className="btn-type1 type2" onClick={handleOnAdd}>
                  저장
                </button>
              </div>
            </div>
            <div className="layout-grid">
              <div className="grid-100">
                <div className="inpwrap">
                  <div className="inp-tit">
                    세미나 명(주제)<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <input
                      type="text"
                      className="input-admin"
                      name="seminarTitle"
                      value={regitserValues?.seminarTitle || ''}
                      onChange={handleRegister}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-100">
                <div className="inpwrap">
                  <div className="inp-tit">
                    세미나 부제목<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <input
                      type="text"
                      className="input-admin"
                      name="seminarSubTitle"
                      value={regitserValues?.seminarSubTitle || ''}
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
                    <textarea
                      className={cx('input-admin', 'input-admin--textarea')}
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
                    개설회원 아이디<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <input
                      type="text"
                      className="input-admin"
                      name="organizerMemberId"
                      value={regitserValues?.organizerMemberId || ''}
                      onChange={handleRegister}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">
                    강사회원 아이디<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <input
                      type="text"
                      className="input-admin"
                      name="lecturerMemberId"
                      value={regitserValues?.lecturerMemberId || ''}
                      onChange={handleRegister}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">
                    강사명<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <input
                      type="text"
                      className="input-admin"
                      name="lecturerName"
                      value={regitserValues?.lecturerName || ''}
                      onChange={handleRegister}
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
                      type="number"
                      className="input-admin"
                      name="participantCount"
                      value={regitserValues?.participantCount || ''}
                      onChange={handleRegister}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">
                    결제유형<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <select name="paymentType" onChange={handleRegister} value={regitserValues?.paymentType || ''}>
                      {paymentTypes?.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">
                    가격<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <input
                      type="number"
                      className="input-admin"
                      name="price"
                      value={regitserValues?.price}
                      onChange={handleRegister}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">
                    키워드(해시태그)<span className="star">*</span>
                  </div>
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
                  <div className="inp-tit">
                    세미나 상태<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <select name="seminarStatus" onChange={handleRegister} value={regitserValues?.seminarStatus}>
                      {seminarStatus?.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">
                    세미나 유형<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <select name="seminarType" onChange={handleRegister} value={regitserValues?.seminarType || ''}>
                      {seminarTypes?.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid-100">
                <div className="inpwrap">
                  <div className="inp-tit">
                    추천직군들<span className="star">*</span>
                  </div>
                  <div className="inp">
                    {jobCodes?.map(item => (
                      <span key={item.id} className={cx('col-md-2', 'pl-0')}>
                        <Toggle
                          isActive
                          label={item.name}
                          name={item.name}
                          type="checkBox"
                          value={item.id || ''}
                          checked={regitserValues?.recommendJobGroups?.includes(item.id) || false}
                          onChange={e => handleCheckboxChange(e, 'recommendJobGroups')}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid-100 mt-3">
                <div className="inpwrap">
                  <div className="inp-tit">추천직무들</div>
                  <div className="inp">
                    {jobs?.map(item => {
                      let isIncludeContent = false;
                      if (regitserValues?.relatedJobs?.includes(item.id)) {
                        isIncludeContent = true;
                      }
                      return (
                        <span key={item.id} className={cx('col-md-2', 'pl-0')}>
                          <Toggle
                            isActive
                            label={item.name}
                            name="relatedJobs"
                            type="checkBox"
                            value={item.id}
                            key={item.id}
                            className={cx('seminar-jobgroup-area')}
                            onChange={e => handleCheckboxChange(e, 'recommendJobs')}
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid-100">
                <div className="inpwrap">
                  <div className="inp-tit">
                    추천레벨<span className="star">*</span>
                  </div>
                  <div className="inp">
                    {LEVELS.map(item => (
                      <span key={item.level} className={cx('col-md-2', 'pl-0')}>
                        <Toggle
                          isActive
                          label={`${item.level}레벨`}
                          name={`${item.level}레벨`}
                          type="checkBox"
                          value={item.level || ''}
                          checked={regitserValues?.recommendLevels?.includes(item.level) || false}
                          onChange={e => handleCheckboxChange(e, 'recommendLevels')}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit" style={{ height: 25 }}>
                    세미나 시작 일시<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      {/* <DateTimePicker
                        inputFormat="YYYY-MM-DD HH:mm"
                        value={regitserValues?.seminarStartDate || ''}
                        className={cx('basic-info-page__picker')}
                        onChange={e => handlePickerChange(e, 'seminarStartDate')}
                        renderInput={params => <TextField {...params} variant="standard" />}
                      /> */}
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit" style={{ height: 25 }}>
                    세미나 종료 일시<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      {/* <DateTimePicker
                        inputFormat="YYYY-MM-DD HH:mm"
                        value={regitserValues?.seminarEndDate || ''}
                        className={cx('basic-info-page__picker')}
                        onChange={e => handlePickerChange(e, 'seminarEndDate')}
                        renderInput={params => <TextField {...params} variant="standard" />}
                      /> */}
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit" style={{ height: 25 }}>
                    세미나 접수 시작 일시<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      {/* <DateTimePicker
                        inputFormat="YYYY-MM-DD HH:mm"
                        value={regitserValues?.seminarRegistrationStartDate || ''}
                        className={cx('basic-info-page__picker')}
                        onChange={e => handlePickerChange(e, 'seminarRegistrationStartDate')}
                        renderInput={params => <TextField {...params} variant="standard" />}
                      /> */}
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit" style={{ height: 25 }}>
                    세미나 접수 종료 일시<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      {/* <DateTimePicker
                        inputFormat="YYYY-MM-DD HH:mm"
                        value={regitserValues?.seminarRegistrationEndDate || ''}
                        className={cx('basic-info-page__picker')}
                        onChange={e => handlePickerChange(e, 'seminarRegistrationEndDate')}
                        renderInput={params => <TextField {...params} variant="standard" />}
                      /> */}
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <div className="grid-100">
                <div className="inpwrap">
                  <div className="inp-tit" style={{ height: 25 }}>
                    위치<span className="star">*</span>
                  </div>
                </div>
                <div className="inp">
                  {/* {isPlaceTypeFetched &&
                    placeTypes.map((item, i) => (
                      <Toggle
                        key={item.id}
                        label={item.name}
                        name="seminarPlaceType"
                        value={item.id}
                        variant="small"
                        className={cx(
                          'fixed-width',
                          'seminar-location-area__toggle',
                          // `${!isEdit && 'seminar-location-area__disabled'}`,
                        )}
                        isActive
                        checked={regitserValues?.seminarPlaceType?.includes(item.id)}
                        onChange={e => handleCheckboxChange(e, 'seminarPlaceType')}
                      />
                    ))} */}
                </div>
              </div>
              <div className="grid-50">
                <div className="inpwrap">
                  <div className="inp-tit">
                    장소<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <Textfield
                      name="seminarPlace"
                      isUnderline
                      value={regitserValues?.seminarPlace || ''}
                      placeholder="세미나 진행 희망 장소를 입력해주세요."
                      onChange={handleRegister}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-100">
                <div className="inpwrap">
                  <div className="inp">
                    <div className={cx('seminar-image-area')}>
                      <div className={cx('seminar-image-area__upload')}>
                        {imageUploadItem('멘토님 상반신 사진', 'imageUrl1', tempImageUrl1)}
                        {imageUploadItem('세미나 장표 #1', 'imageUrl2', tempImageUrl2)}
                        {imageUploadItem('세미나 장표 #2', 'imageUrl3', tempImageUrl3)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-100 mt-5">
                <div className="inpwrap">
                  <div className="inp-tit">
                    세미나 소개<span className="star">*</span>
                  </div>
                  <div className="inp">
                    <Editor
                      type="seminar"
                      data={regitserValues?.seminarIntroduction || ''}
                      onChange={(event, editor) => {
                        setIntroduceEditor(editor.getData());
                      }}
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
                      data={regitserValues?.seminarCurriculum || ''}
                      onChange={(event, editor) => setCurriculumEditor(editor.getData())}
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
                      data={regitserValues?.seminarFaq || ''}
                      onChange={(event, editor) => setFaqEditor(editor.getData())}
                    />
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

export default AdminClubTemplate;
