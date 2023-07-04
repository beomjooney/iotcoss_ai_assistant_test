import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { useCodeList } from 'src/services/code/code.queries';
import { AdminPagination, Table, SmartFilter } from 'src/stories/components';
import { SearchParamsProps } from 'pages/admin/system/code-detail/index';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

interface CodeDetailListProps {
  codeDetailList?: any;
  pageProps?: any;
  params?: SearchParamsProps;
  onSearch?: (searchKeyword: SearchParamsProps) => void;
  onDelete?: (memberId: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  setGroupId: React.Dispatch<React.SetStateAction<string>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  setParams?: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
}

export function CodeDetailList({
  onSearch,
  onDelete,
  onSave,
  onAdd,
  params,
  pageProps,
  codeDetailList,
}: CodeDetailListProps) {
  const { data: codeList } = useCodeList('');
  const [content, setContent] = useState<any>({});
  const [regitserValues, setRegisterValues] = useState<any>({});
  const [isRegisterPopupOpenm, setIsRegisterPopupOpen] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const COLGROUP = ['5%', '5%', '5%', '5%', '5%', '5%', '5%'];
  const HEADS = ['코드상세아이디', '코드그룹아이디', '코드그룹명', '설명', '정렬순서', '등록일시', '수정일시'];

  const handleSave = () => {
    onSave && onSave(content);
    setIsEdit(false);
  };

  const onShowPopup = (id: string) => {
    const result = codeDetailList?.find(item => item?.id === id);
    setContent(result);
    setPopupOpen(true);
  };

  const handleSearchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setSearchKeyword(value);
  };

  const onSmartFilterSearch = (params: any) => {
    onSearch && onSearch(params?.id);
  };

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
    onAdd && onAdd(regitserValues);
  };

  const FIELDS = [
    // { name: '코드 그룹', field: 'id', type: 'choice', data: codeList },
    { name: '코드그룹아이디', field: 'groupId', type: 'text' },
    { name: '코드상세아이디', field: 'id', type: 'text' },
    { name: '코드상세명', field: 'name', type: 'text' },
    { name: '설명', field: 'description', type: 'text' },
    { name: '정렬순서', field: 'order', type: 'text' },
    { name: '', field: 'blank', type: 'blank' },
    {
      name: '등록일시',
      field: 'createdDate',
      type: 'fromToDate',
      fieldNames: ['createdFrom', 'createdTo'],
    },
    {
      name: '수정일시',
      field: 'updateDate',
      type: 'fromToDate',
      fieldNames: ['updateDateFrom', 'updateDateTo'],
    },
  ];

  return (
    <div className="content">
      <h2 className="tit-type1">코드상세관리</h2>
      <div className="path">
        <span>Home</span> <span>코드상세관리 목록</span>
      </div>
      <div className="data-top">
        <div className="left">
          <button className="btn-type1 type1" onClick={event => onShowUpRegisterPopUp(event)}>
            등록
          </button>
          <button className="btn-type1 type1">엑셀업로드</button>
        </div>
        <div className="right">
          <div className="inpwrap">
            <div className="inp search">
              <button className="btn-type1 type1 mr-3">엑셀다운로드</button>
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
          items={codeDetailList?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.id)}>
                <td className="magic" title={item.id}>
                  {item.id}
                </td>
                <td className="magic" title={item.groupId}>
                  {item.groupId}
                </td>
                <td className="magic" title={item.name}>
                  {item.name}
                </td>
                <td className="magic" title={item.description}>
                  {item.description}
                </td>
                <td className="magic" title={item.order}>
                  {item.order}
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
          isEmpty={codeDetailList?.length === 0 || false}
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
              <div className="tit-type2">코드 그룹 상세보기</div>
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
                    onDelete && onDelete(content);
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
                <div className="inp-tit">코드상세아이디</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="id"
                    value={content?.id || ''}
                    onChange={onChange}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">코드그룹아이디</div>
                <div className="inp">
                  <select onChange={onChange} name="groupId" disabled={!isEdit} value={content.groupId}>
                    {codeList?.map(item => (
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
                <div className="inp-tit">코드그룹명</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="name"
                    value={content?.name || ''}
                    onChange={onChange}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">설명</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
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
                <div className="inp-tit">정렬순서</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="order"
                    value={content?.order || ''}
                    onChange={onChange}
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cx('side-layer', isRegisterPopupOpenm ? 'open' : '')} id="sidePop2">
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
              <div className="tit-type2">코드 그룹 상세추가</div>
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
                <div className="inp-tit">코드상세아이디</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="id"
                    value={regitserValues?.id || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">코드그룹 아이디</div>
                <div className="inp">
                  <select onChange={handleRegister} name="groupId" value={regitserValues.groupId}>
                    {codeList?.map(item => (
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
                <div className="inp-tit">코드그룹명</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="name"
                    onChange={handleRegister}
                    value={regitserValues?.name || ''}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">설명</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="description"
                    onChange={handleRegister}
                    value={regitserValues?.description || ''}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">정렬순서</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="order"
                    onChange={handleRegister}
                    value={regitserValues?.order || ''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeDetailList;
