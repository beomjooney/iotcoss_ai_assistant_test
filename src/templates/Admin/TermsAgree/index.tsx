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
import { SearchParamsProps } from 'pages/admin/termsAgree';

const cx = classNames.bind(styles);

interface TermsAgreeTemplateProps {
  termAgreeList?: any;
  skillsList?: any;
  experience?: any;
  jobGroup?: any;
  jobs?: any;
  jobCodes?: any;
  contentJobType?: any;
  termAgreeData?: any;
  pageProps?: any;
  onTermInfo?: (sequence: string) => void;
  onDeleteTerm?: (sequence: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  onSearch?: (keyword: any) => void;
  params: SearchParamsProps;
  setParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
}

export function TermsAgreeTemplate({
  termAgreeList,
  skillsList,
  experience,
  jobGroup,
  jobs,
  jobCodes,
  contentJobType,
  termAgreeData,
  pageProps,
  params,
  onTermInfo,
  onDeleteTerm,
  onSave,
  onAdd,
  onSearch,
  setParams,
}: TermsAgreeTemplateProps) {
  const COLGROUP = ['10%', '10%', '10%', '10%'];
  const HEADS = ['회원아이디', '회원명', '등록일시', '수정일시'];

  const TERMINFO = [
    { id: '0001', name: '이용약관' },
    { id: '0002', name: '개인정보수집' },
    { id: '0003', name: '이벤트 알림 수신' },
  ];

  const FIELDS = [
    { name: '회원아이디', field: 'memberId', type: 'text' },
    { name: '회원명', field: 'memberName', type: 'text' },
  ];

  const { mutate: onSaveProfileImage, data: profileImage, isSuccess } = useUploadImage();

  const [introduceEditor, setIntroduceEditor] = useState<string>('');
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [term, setTerm] = useState<any>({});
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
  const termSaveSchema = yup.object().shape({
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
    resolver: yupResolver(termSaveSchema),
  });

  useEffect(() => {
    termAgreeData && setTerm(termAgreeData.data);
    if (termAgreeData) {
      setExperienceIds(termAgreeData?.data?.relatedExperiences?.map((item, index) => item) || []);
      setSkillIds(termAgreeData?.data?.relatedSkills?.map((item, index) => item) || []);
      setrecommendJobGroupsIds(termAgreeData?.data?.recommendJobGroups?.map((item, index) => item) || []);
      setrecommendJobsIds(termAgreeData?.data?.recommendJobs?.map((item, index) => item) || []);
      setrecommendLevelsIds(termAgreeData?.data?.recommendLevels?.map((item, index) => item) || []);
    } else {
      setExperienceIds([]);
      setSkillIds([]);
      setrecommendJobGroupsIds([]);
      setrecommendJobsIds([]);
      setrecommendLevelsIds([]);
    }
  }, [termAgreeData]);

  // useEffect(() => {
  //   setTerm && setTerm(termAgreeData.data);
  // }, [termAgreeData]);

  const onShowPopup = (sequence: string) => {
    onTermInfo && onTermInfo(sequence);
    setPopupOpen(true);
    setIsRegisterPopupOpen(false);
  };

  const onChangeTermAgree = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setTerm({
      ...term,
      ...data,
    });
  };

  const handleDelete = (sequence: string) => {
    setPopupOpen(false);
    setTerm({});
    onDeleteTerm && onDeleteTerm(sequence);
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
      ...term,
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
    <div className="content">
      <h2 className="tit-type1">정책동의관리</h2>
      <div className="path">
        <span>Home</span> <span>정책(동의)목록</span>
      </div>

      <div className="data-top">
        <div className="left">
          {/* <button className="btn-type1 type1" onClick={event => onShowUpRegisterPopUp(event)}>
            등록
          </button> */}
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
          items={termAgreeList?.data?.data?.contents?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.sequence)}>
                <td className="magic" title={item.memberId}>
                  {item.memberId}
                </td>
                <td className="magic" title={item.memberName}>
                  {item.memberName}
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
          isEmpty={termAgreeList?.data?.length === 0 || false}
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
                <div className="tit-type2">정책동의 상세보기</div>
              </div>
              <div className="right">
                {isEdit ? (
                  <button className="btn-type1 type1" onClick={() => setIsEdit(false)}>
                    취소
                  </button>
                ) : (
                  <button className="btn-type1 type1" onClick={() => handleDelete(term?.id)}>
                    삭제
                  </button>
                )}
              </div>
            </div>
            <div className="tab-content" data-id="tabLink01">
              <div className="layout-grid">
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">약관동의아이디</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('sequence')}
                        value={term?.sequence || 0}
                        onChange={onChangeTermAgree}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">회원아이디</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('memberId')}
                        value={term?.memberId || 0}
                        onChange={onChangeTermAgree}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">회원명</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('name')}
                        value={term?.name || 0}
                        onChange={onChangeTermAgree}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">회원닉네임</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('nickname')}
                        value={term?.nickname || 0}
                        onChange={onChangeTermAgree}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">등록일시</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('createdAt')}
                        value={term?.createdAt}
                        onChange={onChangeTermAgree}
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
                        value={term?.updatedAt}
                        onChange={onChangeTermAgree}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">정책유형</div>
                    <div className="inp">
                      <select
                        className="input-admin"
                        value={term?.type || ''}
                        onChange={onChangeTermAgree}
                        name="type"
                        disabled
                      >
                        {TERMINFO?.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid-100 mt-4">
                  <div className="inpwrap">
                    <div className="inp-tit">정책내용</div>
                    <div className="inp">
                      <Editor
                        type="seminar"
                        data={term?.terms?.content || ''}
                        onChange={(event, editor) => {
                          setIntroduceEditor(editor.getData());
                        }}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit" style={{ height: 25 }}>
                      정책공고일시
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('firmAt')}
                        value={dayjs(term?.terms?.firmAt).format('YYYY-MM-DD')}
                        onChange={onChangeTermAgree}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit" style={{ height: 25 }}>
                      정책시행일시
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('enforcementAt')}
                        value={dayjs(term?.terms?.enforcementAt).format('YYYY-MM-DD')}
                        onChange={onChangeTermAgree}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit" style={{ height: 25 }}>
                      정책등록일시
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('createdAt')}
                        value={dayjs(term?.terms?.createdAt).format('YYYY-MM-DD')}
                        onChange={onChangeTermAgree}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit" style={{ height: 25 }}>
                      정책수정일시
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('updatedAt')}
                        value={dayjs(term?.terms?.updatedAt).format('YYYY-MM-DD')}
                        onChange={onChangeTermAgree}
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

export default TermsAgreeTemplate;
