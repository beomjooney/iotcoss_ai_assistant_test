import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import * as yup from 'yup';
import dayjs from 'dayjs';
import Image from 'next/image';
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
  jobCodes?: any;
  quizData?: any;
  pageProps?: any;
  onQuizInfo?: (quizId: string) => void;
  onDeleteQuiz?: (quizId: string) => void;
  onSave?: (data: any) => void;
  onSearch?: (keyword: any) => void;
  params: SearchParamsProps;
  setParams: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
}

export function QuizTemplate({
  quizList,
  skillsList,
  experience,
  jobGroup,
  jobCodes,
  quizData,
  pageProps,
  params,
  onQuizInfo,
  onDeleteQuiz,
  onSave,
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

  const memberCodes = [];

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
  }, [quizData]);

  const onShowPopup = (quizId: string) => {
    // 조회
    onQuizInfo && onQuizInfo(quizId);
    setPopupOpen(true);
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
    }
  };

  return (
    <div className="content">
      <h2 className="tit-type1">퀴즈관리</h2>
      <div className="path">
        <span>Home</span> <span>퀴즈목록</span>
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
                    <div className="inp-tit">
                      회원 아이디<span className="star">*</span>
                    </div>
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
                    <div className="inp-tit">
                      회원명<span className="star">*</span>
                    </div>
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
                    <div className="inp-tit">아티클URL</div>
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
                    <div className="inp-tit">
                      키워드(해시태그)<span className="star">*</span>
                    </div>
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

                <div className="grid-100 mt-5">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      내용<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <Editor
                        type="seminar"
                        data={quiz?.content || ''}
                        onChange={(event, editor) => {
                          setIntroduceEditor(editor.getData());
                        }}
                        disabled={!isEdit}
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

export default QuizTemplate;
