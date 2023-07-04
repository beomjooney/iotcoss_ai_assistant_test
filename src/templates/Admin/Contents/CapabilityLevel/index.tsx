import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { SearchParamsProps } from 'pages/admin/contents/capability/index';
import { AdminPagination, Table, SmartFilter } from 'src/stories/components';

const cx = classNames.bind(styles);

interface capabilityListProps {
  onSearch?: (searchKeyword: SearchParamsProps) => void;
  onDelete?: (memberId: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  capablityLevelList?: any;
  pageProps?: any;
  params?: SearchParamsProps;
  setParams?: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

export function CapavilityLevelTemplate({
  onSearch,
  onDelete,
  onSave,
  onAdd,
  params,
  pageProps,
  capablityLevelList,
}: capabilityListProps) {
  const [regitserValues, setRegisterValues] = useState<any>({});
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState<boolean>(false);
  const [content, setContent] = useState<any>({});
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const COLGROUP = ['5%', '5%', '5%', '5%', '5%'];
  const HEADS = ['역량아이디', '역량레벨', '역량레벨아이디', '역량레벨명', '설명'];

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
    if (confirm('수정하시겠습니까?')) {
      let params = { ...content };
      params = {
        ...content,
        capabilityLevels: content?.capabilityLevels || [],
      };
      onSave && onSave(params);
      setIsEdit(false);
    }
  };

  const handleOnAdd = () => {
    if (confirm('저장하시겠습니까?')) {
      onAdd &&
        onAdd({
          capabilityId: regitserValues.capabilityId,
          capabilityLevels: [
            {
              capabilityLevel: regitserValues?.capabilityLevel,
              capabilityLevelId: regitserValues?.capabilityLevelId || '',
              capabilityLevelName: regitserValues?.capabilityLevelName || '',
              description: regitserValues?.description || '',
            },
          ],
        });
    }
  };

  const onShowPopup = (id: string) => {
    const result = capablityLevelList?.data?.find(item => item?.capabilityLevelId === id);
    setContent(result);
    setPopupOpen(true);
  };

  const handleSearchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setSearchKeyword(value);
  };

  const onSmartFilterSearch = (params: any) => {
    let result = { ...params };
    onSearch && onSearch(result);
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
    { name: '역량아이디', field: 'capabilityId', type: 'text' },
    { name: '역량레벨', field: 'capabilityLevel', type: 'text' },
    { name: '역량레벨아이디', field: 'capabilityLevelId', type: 'text' },
    { name: '역량레벨명', field: 'capabilityLevelName', type: 'text' },
    { name: '설명', field: 'description', type: 'text' },
  ];

  return (
    <div className="content">
      <h2 className="tit-type1">역량레벨</h2>
      <div className="path">
        <span>Home</span> <span>역량레벨 목록</span>
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
        <SmartFilter name="skillsFilter" fields={FIELDS} isFilterOpen={isFilter} onSearch={onSmartFilterSearch} />
      </div>
      <div className="data-type1" data-evt="main-table-on">
        <Table
          name="content"
          colgroup={COLGROUP}
          heads={HEADS}
          items={capablityLevelList?.data?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.capabilityLevelId)}>
                <td className="magic" title={item.capabilityId}>
                  {item.capabilityId}
                </td>
                <td className="magic" title={item.capabilityLevel}>
                  {item.capabilityLevel}
                </td>
                <td className="magic" title={item.capabilityLevelId}>
                  {item.capabilityLevelId}
                </td>
                <td className="magic" title={item.capabilityLevelName}>
                  {item.capabilityLevelName}
                </td>
                <td className="magic" title={item.description}>
                  {item.description}
                </td>
              </tr>
            );
          })}
          isEmpty={capablityLevelList?.data?.length === 0 || false}
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
              <div className="tit-type2">역량 상세보기</div>
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
                    onDelete && onDelete(content.capabilityId);
                  }}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
          <div className="layout-grid">
            <div className="layout-grid">
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">역량아이디</div>
                  <div className="inp">
                    <input
                      type="text"
                      className="input-admin"
                      name="experienceId"
                      value={content?.capabilityId || ''}
                      onChange={onChangeContent}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">역량레벨아이디</div>
                  <div className="inp">
                    <input
                      className="input-admin"
                      type="text"
                      name="capabilityLevelId"
                      value={content?.capabilityLevelId || ''}
                      onChange={onChangeContent}
                      disabled={!isEdit}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">역량레벨</div>
                  <div className="inp">
                    <input
                      className="input-admin"
                      type="text"
                      name="capabilityLevel"
                      value={content?.capabilityLevel || ''}
                      onChange={onChangeContent}
                      disabled={!isEdit}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">역량레벨명</div>
                  <div className="inp">
                    <input
                      className="input-admin"
                      type="text"
                      name="capabilityLevelName"
                      disabled={!isEdit}
                      onChange={onChangeContent}
                      value={content?.capabilityLevelName || ''}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">역량레벨명</div>
                  <div className="inp">
                    <input
                      className="input-admin"
                      type="text"
                      name="description"
                      disabled={!isEdit}
                      onChange={onChangeContent}
                      value={content?.description || ''}
                    />
                  </div>
                </div>
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
              <div className="tit-type2">역량레벨 등록</div>
            </div>
            <div className="right">
              <button className="btn-type1 type2" onClick={handleOnAdd}>
                저장
              </button>
            </div>
          </div>
          <div className="tab-content">
            <div className="layout-grid">
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">역량아이디</div>
                  <div className="inp">
                    <input
                      type="text"
                      className="input-admin"
                      name="capabilityId"
                      value={regitserValues?.capabilityId || ''}
                      onChange={handleRegister}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">역량레벨아이디</div>
                  <div className="inp">
                    <input
                      className="input-admin"
                      type="text"
                      name="capabilityLevelId"
                      value={regitserValues?.capabilityLevelId || ''}
                      onChange={handleRegister}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">역량레벨</div>
                  <div className="inp">
                    <input
                      className="input-admin"
                      type="text"
                      name="capabilityLevel"
                      value={regitserValues?.capabilityLevel || ''}
                      onChange={handleRegister}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">역량레벨명</div>
                  <div className="inp">
                    <input
                      className="input-admin"
                      type="text"
                      name="capabilityLevelName"
                      value={regitserValues?.capabilityLevelName || ''}
                      onChange={handleRegister}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">설명</div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CapavilityLevelTemplate;

const paramsWithDefault = params => {
  const defaultParams = {
    page: 1,
    size: 10,
  };
  return {
    ...defaultParams,
    ...params,
  };
};

const NECESSARY_CAPABILITYID_COLUMNS = [
  {
    title: '역량레벨아이디',
    dataIndex: 'capabilityLevelId',
    key: 'capabilityLevelId',
    width: 100,
    align: 'center',
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: '역량레벨',
    dataIndex: 'capabilityLevel',
    key: 'capabilityLevel',
    width: 80,
    align: 'center',
  },
  {
    title: '역량레벨명',
    dataIndex: 'capabilityLevelName',
    key: 'capabilityLevelName',
    width: 120,
    align: 'center',
  },
  {
    title: '설명',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
    width: 130,
  },
] as any;
