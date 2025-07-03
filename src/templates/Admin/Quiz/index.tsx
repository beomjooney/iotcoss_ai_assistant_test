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
import { SearchParamsProps } from 'pages/admin/quiz';

const cx = classNames.bind(styles);

interface QuizTemplateProps {
  quizList?: any;
  skillsList?: any;
  experience?: any;
  jobGroup?: any;
  jobs?: any;
  jobCodes?: any;
  contentJobType?: any;
  quizData?: any;
  pageProps?: any;
  onQuizInfo?: (quizId: string) => void;
  onDeleteQuiz?: (quizId: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  onSearch?: (keyword: any) => void;
  params: SearchParamsProps;
  setParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
}

export function QuizTemplate({
  quizList,
  skillsList,
  experience,
  jobGroup,
  jobs,
  jobCodes,
  contentJobType,
  quizData,
  pageProps,
  params,
  onQuizInfo,
  onDeleteQuiz,
  onSave,
  onAdd,
  onSearch,
  setParams,
}: QuizTemplateProps) {
  const COLGROUP = ['12%', '12%', '5%', '5%', '4%', '5%', '4%', '4%', '6%', '6%', '6%'];
  const HEADS = [
    '퀴즈아이디',
    '회원UUID',
    '추천직군들',
    '추천직무들',
    '추천레벨들',
    '연관스킬들',
    '퀴즈활용 수',
    '퀴즈답변 수',
    '해시태그',
    '삭제상태',
    '등록일시',
  ];

  const LEVELS = [
    { level: 1, desc: '상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요' },
    { level: 2, desc: '상용서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능' },
    { level: 3, desc: '상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능' },
    { level: 4, desc: '다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더' },
    { level: 5, desc: '본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩' },
  ];

  const FIELDS = [
    { name: '퀴즈ID', field: 'id', type: 'text' },
    { name: '회원UUID', field: 'memberUUID', type: 'text' },
    { name: '추천직군들', field: 'recommendJobGroupNames', type: 'text' },
    { name: '추천직무들', field: 'recommendJobNames', type: 'text' },
    { name: '추천레벨들', field: 'recommendLevels', type: 'text' },
    { name: '연관스킬들', field: 'relatedSkills', type: 'text' },
    { name: '퀴즈 활용 수', field: 'activeCount', type: 'text' },
    { name: '퀴즈 답변 수', field: 'answerCount', type: 'text' },
    { name: '해시 태그', field: 'hashTags', type: 'text' },
  ];

  const { mutate: onSaveProfileImage, data: profileImage, isSuccess } = useUploadImage();

  const [introduceEditor, setIntroduceEditor] = useState<string>('');
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [quiz, setQuiz] = useState<any>({});
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
  const quizSaveSchema = yup.object().shape({
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
    resolver: yupResolver(quizSaveSchema),
  });

  useEffect(() => {
    quizData && setQuiz(quizData.data);
    if (quizData) {
      setExperienceIds(quizData?.data?.relatedExperiences?.map((item, index) => item) || []);
      setSkillIds(quizData?.data?.relatedSkills?.map((item, index) => item) || []);
      setrecommendJobGroupsIds(quizData?.data?.recommendJobGroups?.map((item, index) => item) || []);
      setrecommendJobsIds(quizData?.data?.recommendJobs?.map((item, index) => item) || []);
      setrecommendLevelsIds(quizData?.data?.recommendLevels?.map((item, index) => item) || []);
    } else {
      setExperienceIds([]);
      setSkillIds([]);
      setrecommendJobGroupsIds([]);
      setrecommendJobsIds([]);
      setrecommendLevelsIds([]);
    }
  }, [quizData]);

  // useEffect(() => {
  //   quizData && setQuiz(quizData.data);
  // }, [quizData]);

  const onShowPopup = (quizId: string) => {
    onQuizInfo && onQuizInfo(quizId);
    setPopupOpen(true);
    setIsRegisterPopupOpen(false);
  };

  const onChangeQuiz = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setQuiz({
      ...quiz,
      ...data,
    });
  };

  const handleDelete = (clubId: string) => {
    setPopupOpen(false);
    setQuiz({});
    onDeleteQuiz && onDeleteQuiz(clubId);
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
      ...quiz,
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
      <h2 className="tit-type1">퀴즈관리</h2>
      <div className="path">
        <span>Home</span> <span>퀴즈목록</span>
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
          items={quizList?.data?.data?.contents?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.sequence)}>
                <td className="magic" title={item.id}>
                  {item.id}
                </td>
                <td className="magic" title={item.memberUUID}>
                  {item.memberUUID}
                </td>
                <td className="magic" title={item.recommendJobGroupNames}>
                  {item.recommendJobGroupNames}
                </td>
                <td className="magic" title={item.recommendJobNames}>
                  {item.recommendJobNames}
                </td>
                <td className="magic" title={item.recommendLevels}>
                  {item.recommendLevels?.length === 5 ? '모든' : item.recommendLevels?.sort().join(',') || 0}
                </td>
                <td className="magic" title={item.relatedSkills}>
                  {item.relatedSkills}
                </td>
                <td className="magic" title={item?.activeCount}>
                  {item?.activeCount || 0}
                </td>
                <td className="magic" title={item.answerCount}>
                  {item?.answerCount || 0}
                </td>
                <td className="magic" title={item.hashTags}>
                  {item.hashTags}
                </td>
                <td className="magic" title={item.deleteStatus ? 'Y' : 'N'}>
                  {item.deleteStatus ? 'Y' : 'N'}
                </td>
                <td className="magic" title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={quizList?.data?.length === 0 || false}
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
                <div className="tit-type2">퀴즈 상세보기</div>
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
                  <button className="btn-type1 type1" onClick={() => handleDelete(quiz?.id)}>
                    삭제
                  </button>
                )}
              </div>
            </div>
            <div className="tab-content" data-id="tabLink01">
              <div className="layout-grid">
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">회원 아이디</div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        {...methods.register('memberId')}
                        disabled
                        value={quiz?.memberId || ''}
                        onChange={onChangeQuiz}
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
                        {...methods.register('memberName')}
                        value={quiz?.memberName || ''}
                        onChange={onChangeQuiz}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">닉네임</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('memberNickname')}
                        value={quiz?.memberNickname}
                        onChange={onChangeQuiz}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">퀴즈 활용 수</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('activeCount')}
                        value={quiz?.activeCount || 0}
                        onChange={onChangeQuiz}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">퀴즈 답변 수</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('answerCount')}
                        value={quiz?.answerCount || 0}
                        onChange={onChangeQuiz}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">키워드(해시태그)</div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        {...methods.register('hashTags')}
                        value={quiz?.hashTags || ''}
                        onChange={onChangeQuiz}
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
                        value={quiz?.createdAt || ''}
                        disabled
                        onChange={onChangeQuiz}
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
                        value={quiz?.updatedAt || ''}
                        disabled
                        onChange={onChangeQuiz}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      질문<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('content')}
                        value={quiz?.content || ''}
                        onChange={onChangeQuiz}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      아티클URL<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        {...methods.register('articleUrl')}
                        value={quiz?.articleUrl || ''}
                        onChange={onChangeQuiz}
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
                      <div className={cx('skill__group')}>
                        {jobCodes?.data?.contents?.map((item, index) => {
                          return (
                            <Toggle
                              key={`recommendJobGroupsIds-${index}`}
                              label={item.name}
                              name="recommendJobGroups"
                              value={item.id}
                              onChange={onToggleChange}
                              className="mr-2 mt-2"
                              variant="small"
                              type="multiple"
                              isActive
                              isBorder
                              checked={
                                !!recommendJobGroupsIds?.find(recommendJobGroups => recommendJobGroups === item.id)
                              }
                              disabled={!isEdit}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-100 mt-3">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      추천직무<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <div className={cx('skill__group')}>
                        {contentJobType?.map((item, index) => {
                          return (
                            <Toggle
                              key={`recommendJobsIds-${index}`}
                              label={item.name}
                              name="recommendJobs"
                              value={item.id}
                              onChange={onToggleChange}
                              className="mr-2 mt-2"
                              variant="small"
                              type="multiple"
                              isActive
                              isBorder
                              checked={!!recommendJobsIds?.find(recommendJobs => recommendJobs === item.id)}
                              disabled={!isEdit}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      추천레벨<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <div className={cx('skill__group')}>
                        {LEVELS?.map((item, index) => {
                          return (
                            <Toggle
                              key={`recommendLevelsIds-${index}`}
                              label={`${item.level}레벨`}
                              name="recommendLevels"
                              value={item.level || ''}
                              onChange={onToggleChange}
                              className="mr-2 mt-2"
                              variant="small"
                              type="multiple"
                              isActive
                              isBorder
                              checked={
                                !!recommendLevelsIds?.find(recommendLevels => parseInt(recommendLevels) === item.level)
                              }
                              disabled={!isEdit}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid-100 mt-3">
                      <div className="inpwrap">
                        <div className="inp-tit">관련 스킬</div>
                        <div className="inp">
                          <div className={cx('filter-area')}>
                            <div className={cx('skill__group')}>
                              {skillsList?.data?.data?.map((item, index) => {
                                return (
                                  <Toggle
                                    key={`skillIds-${index}`}
                                    label={item.name}
                                    name="skillIds"
                                    value={item.id}
                                    onChange={onToggleChange}
                                    className="mr-2 mt-2 custom"
                                    variant="small"
                                    type="multiple"
                                    isActive
                                    isBorder
                                    checked={!!skillIds?.find(skill => skill === item.id)}
                                    disabled={!isEdit}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid-100 mt-3">
                      <div className="inpwrap">
                        <div className="inp-tit">관련 경험</div>
                        <div className="inp">
                          <div className={cx('skill__group')}>
                            {experience?.data?.contents?.map((item, index) => {
                              return (
                                <Toggle
                                  key={`experienceIds-${index}`}
                                  label={item.name}
                                  name="experienceIds"
                                  value={item.name}
                                  onChange={onToggleChange}
                                  className="mr-2 mt-2"
                                  variant="small"
                                  type="multiple"
                                  isActive
                                  isBorder
                                  checked={!!experienceIds?.find(experiences => experiences === item.name)}
                                  disabled={!isEdit}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
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
                <div className="tit-type2">퀴즈 등록</div>
              </div>
              <div className="right">
                <button className="btn-type1 type2" onClick={handleOnAdd}>
                  저장
                </button>
              </div>
            </div>
            <div className="tab-content" data-id="tabLink01">
              <div className="layout-grid">
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      질문<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="content"
                        value={regitserValues?.content || ''}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      아티클URL<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="articleUrl"
                        value={regitserValues?.articleUrl || ''}
                        onChange={handleRegister}
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
                      <div className={cx('skill__group')}>
                        {jobCodes?.data?.contents?.map((item, index) => {
                          return (
                            <Toggle
                              key={`recommendJobGroupsIds-${index}`}
                              label={item.name}
                              name="recommendJobGroups"
                              value={item.id}
                              onChange={onToggleChange}
                              className="mr-2 mt-2"
                              variant="small"
                              type="multiple"
                              isActive
                              isBorder
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-50 mt-3">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      추천직무<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <div className={cx('skill__group')}>
                        {jobs?.data?.contents?.map((item, index) => {
                          return (
                            <Toggle
                              key={`recommendJobsIds-${index}`}
                              label={item.name}
                              name="recommendJobs"
                              value={item.id}
                              onChange={onToggleChange}
                              className="mr-2 mt-2"
                              variant="small"
                              type="multiple"
                              isActive
                              isBorder
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      추천레벨<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <div className={cx('skill__group')}>
                        {LEVELS?.map((item, index) => {
                          return (
                            <Toggle
                              key={`recommendLevelsIds-${index}`}
                              label={`${item.level}레벨`}
                              name="recommendLevels"
                              value={item.level || ''}
                              onChange={onToggleChange}
                              className="mr-2 mt-2"
                              variant="small"
                              type="multiple"
                              isActive
                              isBorder
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid-100 mt-3">
                      <div className="inpwrap">
                        <div className="inp-tit">관련 스킬</div>
                        <div className="inp">
                          <div className={cx('filter-area')}>
                            <div className={cx('skill__group')}>
                              {skillsList?.data?.data?.map((item, index) => {
                                return (
                                  <Toggle
                                    key={`skillIds-${index}`}
                                    label={item.name}
                                    name="skillIds"
                                    value={item.id}
                                    onChange={onToggleChange}
                                    className="mr-2 mt-2 custom"
                                    variant="small"
                                    type="multiple"
                                    isActive
                                    isBorder
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid-100 mt-3">
                      <div className="inpwrap">
                        <div className="inp-tit">관련 경험</div>
                        <div className="inp">
                          <div className={cx('skill__group')}>
                            {experience?.data?.contents?.map((item, index) => {
                              return (
                                <Toggle
                                  key={`experienceIds-${index}`}
                                  label={item.name}
                                  name="experienceIds"
                                  value={item.name}
                                  onChange={onToggleChange}
                                  className="mr-2 mt-2"
                                  variant="small"
                                  type="multiple"
                                  isActive
                                  isBorder
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid-100 mt-4">
                      <div className="inpwrap">
                        <div className="inp-tit">키워드(해시태그)</div>
                        <div className="inp">
                          <input
                            type="text"
                            className="input-admin"
                            name="hashTags"
                            value={regitserValues?.hashTags || ''}
                            onChange={handleRegister}
                          />
                        </div>
                      </div>
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

export default QuizTemplate;
