import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import {
  AdminPagination,
  Editor,
  SmartFilter,
  Table,
  Toggle,
  Textfield,
  Button,
  Profile,
} from '../../../stories/components';
import dayjs from 'dayjs';
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { useStore } from 'src/store';
import { usePlaceTypes, useJobs } from 'src/services/code/code.queries';
import { SeminarContent } from 'src/models/recommend';

import { FormProvider, useForm } from 'react-hook-form';
import Image from 'next/image';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUploadImage } from 'src/services/image/image.mutations';
import { SearchParamsProps } from 'pages/admin/club';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const cx = classNames.bind(styles);

interface ClubQuizTemplateProps {
  clubQuizList?: any;
  skillsList?: any;
  experience?: any;
  jobGroup?: any;
  jobCodes?: any;
  clubQuizData?: any;
  pageProps?: any;
  onClubQuizInfo?: (clubSequence: string) => void;
  onDeleteClubQuiz?: (clubSequence: string) => void;
  onSave?: (data: any) => void;
  onSearch?: (searchKeyword: any) => void;
  params: SearchParamsProps;
  setParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
}

export function AdminClubQuizTemplate({
  clubQuizList,
  skillsList,
  experience,
  jobGroup,
  jobCodes,
  clubQuizData,
  pageProps,
  params,
  onClubQuizInfo,
  onDeleteClubQuiz,
  onSave,
  onSearch,
  setParams,
}: ClubQuizTemplateProps) {
  const COLGROUP = ['15%', '15%', '15%', '15%', '15%', '15%', '15%'];
  const HEADS = ['퀴즈순서', '학습주차', '퀴즈 좋아요 수', '답변 수', '발행여부', '대표여부', '발행일시'];
  const POPUP_COLGROUP = ['15%', '10%', '15%', '15%', '10%'];
  const POPUP_HEADS = ['신청자 아이디', '이름', '닉네임', '전화번호', '등록일시'];

  const TAB2_COLGROUP = ['15%', '15%'];
  const TAB2_HEADS = ['회원명', '타입(좋아요/원픽)'];

  const TAB3_COLGROUP = ['15%', '15%', '15%', '15%', '15%', '16%', '15%'];
  const TAB3_HEADS = ['회원명', '답변상태', '이해상태', '답변 댓글 수', '답변 원픽 수', '답변 좋아요 수', '사전답변'];

  const TAB4_COLGROUP = ['15%'];
  const TAB4_HEADS = ['내용'];

  const TAB5_COLGROUP = ['15%', '15%'];
  const TAB5_HEADS = ['회원명', '타입(좋아요/원픽)'];

  const LEVELS = [
    { level: 1, desc: '상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요' },
    { level: 2, desc: '상용서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능' },
    { level: 3, desc: '상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능' },
    { level: 4, desc: '다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더' },
    { level: 5, desc: '본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩' },
  ];

  const FIELDS = [
    { name: '클럽SEQ', field: 'clubId', type: 'text' },
    { name: '퀴즈SEQ', field: 'sequence', type: 'text' },
    { name: '퀴즈순서', field: 'order', type: 'text' },
    { name: '학습주차', field: 'weekNumber', type: 'text' },
    { name: '대표여부', field: 'isRepresentative', type: 'text' },
    { name: '발행일시', field: 'publishDate', type: 'text' },
    { name: '퀴즈좋아요 수', field: 'likeCount', type: 'text' },
    { name: '답변 수', field: 'answerCount', type: 'text' },
    { name: '등록일시', field: 'createdAt', type: 'text' },
  ];

  const { mutate: onSaveProfileImage, data: profileImage, isSuccess } = useUploadImage();

  const [introduceEditor, setIntroduceEditor] = useState<string>('');
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [clubQuiz, setClubQuiz] = useState<any>({});
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [profileImageUrl, setProfilImageUrl] = useState(null);
  const [tabValue, setTabValue] = useState<number>(1);
  const [content, setContent] = useState<any>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const memberSaveSchema = yup.object().shape({
    memberId: yup.string().notRequired(),
    name: yup.string().notRequired(),
    nickname: yup.string().notRequired(),
    email: yup.string().notRequired(),
    ageRange: yup.string().notRequired(),
    birthday: yup.string().notRequired(),
    type: yup.string().notRequired(),
    typeName: yup.string().notRequired(),
  });

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(memberSaveSchema),
  });

  useEffect(() => {
    clubQuizData && setClubQuiz(clubQuizData.data);
  }, [clubQuizData]);

  const onShowPopup = (clubSequence: string) => {
    // 사용자 조회
    onClubQuizInfo && onClubQuizInfo(clubSequence);

    // const result = skillsList?.data?.data?.find(item => item?.relatedJobGroups === memberData?.data?.jobGroup);
    // setContent(result);
    setPopupOpen(true);
  };

  const onChangeClub = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    const data = {
      [name]: value,
    };
    setClubQuiz({
      ...clubQuiz,
      ...data,
    });
  };

  const handleDelete = (clubSequence: string) => {
    setPopupOpen(false);
    setClubQuiz({});
    onDeleteClubQuiz && onDeleteClubQuiz(clubSequence);
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

  const onSmartFilterSearch = (params: any) => {
    onSearch && onSearch(params);
  };

  const handleTab = (value: number) => {
    setTabValue(value);
  };

  const handleSave = (data: any) => {
    const params = {
      ...data,
      ...clubQuiz,
      profileImageUrl: profileImage?.toString()?.slice(1) || clubQuiz?.profileImageUrl,
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

  return (
    <div className="content">
      <h2 className="tit-type1">클럽퀴즈관리</h2>
      <div className="path">
        <span>Home</span> <span>클럽퀴즈목록</span>
      </div>

      <div className="data-top">
        <div className="left">
          {/*<a href="#" className="btn-type1 type1">*/}
          {/*  등록*/}
          {/*</a>*/}
        </div>
        <div className="right">
          <div className={cx('search')}>
            <div className={cx('date')}>
              {/* <div>
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
              </div> */}
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
          items={clubQuizList?.data?.data?.contents?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.sequence)}>
                <td className="magic" title={item.order}>
                  {item.order}
                </td>
                <td className="magic" title={item.weekNumber || 0}>
                  {item.weekNumber || 0}
                </td>
                <td className="magic" title={item.likeCount || 0}>
                  {item.likeCount || 0}
                </td>
                <td className="magic" title={item.answerCount || 0}>
                  {item.answerCount || 0}
                </td>
                <td className="magic" title={item.isPublished ? 'Y' : 'N'}>
                  {item.isPublished ? 'Y' : 'N'}
                </td>
                <td className="magic" title={item.isRepresentative ? 'Y' : 'N'}>
                  {item.isRepresentative ? 'Y' : 'N'}
                </td>
                <td className="magic" title={dayjs(item.publishDate).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.publishDate).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={clubQuizList?.data?.length === 0 || false}
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
                <div className="tit-type2">클럽퀴즈 상세보기</div>
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
                  <button className="btn-type1 type1" onClick={() => handleDelete(clubQuiz?.memberId)}>
                    삭제
                  </button>
                )}
              </div>
            </div>
            <ul className="tab-type1 tab5" data-evt="tab">
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
                  클럽퀴즈 리액션
                </a>
              </li>{' '}
              <li className={tabValue === 3 ? 'on' : ''}>
                <a
                  href="#"
                  onClick={() => {
                    handleTab(3);
                    setIsEdit(false);
                  }}
                >
                  클럽 퀴즈 답변
                </a>
              </li>{' '}
              <li className={tabValue === 4 ? 'on' : ''}>
                <a
                  href="#"
                  onClick={() => {
                    handleTab(4);
                    setIsEdit(false);
                  }}
                >
                  클럽 퀴즈 답변 댓글
                </a>
              </li>
              <li className={tabValue === 5 ? 'on' : ''}>
                <a
                  href="#"
                  onClick={() => {
                    handleTab(5);
                    setIsEdit(false);
                  }}
                >
                  클럽 퀴즈 답변 리액션
                </a>
              </li>
            </ul>

            {tabValue === 1 && popupOpen && (
              <div className="tab-content" data-id="tabLink01">
                <div className="layout-grid">
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        퀴즈아이디<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          className="input-admin"
                          type="text"
                          {...methods.register('name')}
                          value={clubQuiz?.quiz?.quizId || ''}
                          onChange={onChangeClub}
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
                          type="text"
                          className="input-admin"
                          {...methods.register('memberId')}
                          value={clubQuiz?.quiz?.memberId || ''}
                          onChange={onChangeClub}
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
                          type="text"
                          className="input-admin"
                          {...methods.register('memberName')}
                          value={clubQuiz?.quiz?.memberName || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">회원닉네임</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('memberNickname')}
                          value={clubQuiz?.quiz?.memberNickname || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">학습 주 수</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('weekNumber')}
                          value={clubQuiz?.weekNumber || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        학습 주 수<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <select value={clubQuiz?.type || ''} onChange={onChangeClub} name="type" disabled={!isEdit}>
                          {clubCodes?.data?.contents?.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div> */}
                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">좋아요 수</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('likeCount')}
                          value={clubQuiz?.likeCount || 0}
                          onChange={onChangeClub}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">활용 수</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('activeCount')}
                          value={clubQuiz?.quiz?.activeCount || 0}
                          onChange={onChangeClub}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">답변 수</div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('answerCount')}
                          value={clubQuiz?.answerCount || 0}
                          onChange={onChangeClub}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">삭제 상태</div>
                      <div className="inp">
                        <select
                          className="input-admin"
                          value={clubQuiz?.quiz?.deleteStatus?.toString() || ''}
                          onChange={onChangeClub}
                          name="deleteStatus"
                          disabled={!isEdit}
                        >
                          <option value="true">Y</option>
                          <option value="false">N</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid-25">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        해시태그<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <input
                          type="text"
                          className="input-admin"
                          {...methods.register('hashTags')}
                          value={clubQuiz?.quiz?.hashTags || ''}
                          onChange={onChangeClub}
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
                          value={clubQuiz?.quiz?.createdAt || ''}
                          disabled
                          onChange={onChangeClub}
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
                          value={clubQuiz?.quiz?.updatedAt || ''}
                          disabled
                          onChange={onChangeClub}
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
                          type="text"
                          className="input-admin"
                          {...methods.register('content')}
                          value={clubQuiz?.quiz?.content || ''}
                          onChange={onChangeClub}
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
                          type="text"
                          className="input-admin"
                          {...methods.register('articleUrl')}
                          value={clubQuiz?.quiz?.articleUrl || ''}
                          onChange={onChangeClub}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="grid-100 mt-5">
                    <div className="inpwrap">
                      <div className="inp-tit">
                        내용<span className="star">*</span>
                      </div>
                      <div className="inp">
                        <Editor
                          type="seminar"
                          data={clubQuiz?.quiz?.content || ''}
                          onChange={(event, editor) => {
                            setIntroduceEditor(editor.getData());
                          }}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            )}

            {/* 클럽퀴즈리액션 */}
            {tabValue === 2 && popupOpen && (
              <div className="tab-content" data-id="tabLink02">
                <hr className="h40" />
                <div className="data-type1" data-evt="table-on">
                  <Table
                    name="seminarMember"
                    colgroup={TAB2_COLGROUP}
                    heads={TAB2_HEADS}
                    items={clubQuizList.data?.data?.contents?.map((item, index) => {
                      return (
                        <tr key={`participant-${index}`}>
                          <td></td>
                          <td></td>
                        </tr>
                      );
                    })}
                    isEmpty={clubQuizList.length === 0 || false}
                  />
                </div>
              </div>
            )}

            {/* 클럽퀴즈답변 */}
            {tabValue === 3 && popupOpen && (
              <div className="tab-content" data-id="tabLink02">
                <hr className="h40" />
                <div className="data-type1" data-evt="table-on">
                  <Table
                    name="seminarMember"
                    colgroup={TAB3_COLGROUP}
                    heads={TAB3_HEADS}
                    items={levelInfo?.map((item, index) => {
                      return (
                        <tr key={`clubuser-${index}`}>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      );
                    })}
                    isEmpty={clubQuiz?.length === 0 || false}
                  />
                </div>
              </div>
            )}

            {/* 클럽퀴즈 답변 댓글 */}
            {tabValue === 4 && popupOpen && (
              <div className="tab-content" data-id="tabLink02">
                <hr className="h40" />
                <div className="data-type1" data-evt="table-on">
                  <Table
                    name="seminarMember"
                    colgroup={TAB4_COLGROUP}
                    heads={TAB4_HEADS}
                    items={levelInfo?.map((item, index) => {
                      return (
                        <tr key={`clubQuiz-${index}`}>
                          <td></td>
                        </tr>
                      );
                    })}
                    isEmpty={clubQuiz?.length === 0 || false}
                  />
                </div>
              </div>
            )}

            {/* 클럽퀴즈 답변 댓글 */}
            {tabValue === 5 && popupOpen && (
              <div className="tab-content" data-id="tabLink02">
                <hr className="h40" />
                <div className="data-type1" data-evt="table-on">
                  <Table
                    name="seminarMember"
                    colgroup={TAB5_COLGROUP}
                    heads={TAB5_HEADS}
                    items={levelInfo?.map((item, index) => {
                      return (
                        <tr key={`clubquiz-${index}`}>
                          <td></td>
                          <td></td>
                        </tr>
                      );
                    })}
                    isEmpty={clubQuiz?.length === 0 || false}
                  />
                </div>
              </div>
            )}
          </div>
        </FormProvider>
      </div>
    </div>
  );
}

export default AdminClubQuizTemplate;

const levelInfo = [{ level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }, { level: 5 }];
