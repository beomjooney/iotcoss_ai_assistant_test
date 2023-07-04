import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { Table as AntdTable } from 'antd';
import dayjs from 'dayjs';
import { SearchParamsProps } from 'pages/admin/contents/capability/index';
import { AdminPagination, Table, AdminModal, SmartFilter, Textfield } from 'src/stories/components';
import {
  useCapabilitiesLevel,
  useGetDetailCapabilitiesLevel,
} from 'src/services/admin/capabilityLevel/capabilityLevel.queries';

const cx = classNames.bind(styles);

interface capabilityListProps {
  onSearch?: (searchKeyword: SearchParamsProps) => void;
  onDelete?: (memberId: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  capabilityList?: any;
  pageProps?: any;
  params?: SearchParamsProps;
  setParams?: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

export function CapabilityListPage({
  onSearch,
  onDelete,
  onSave,
  onAdd,
  params,
  pageProps,
  capabilityList,
}: capabilityListProps) {
  const [capabilityId, setCapabilityId] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [capabilityLevels, setCapabilityLevels] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [detailSelectedRowKeys, setDetailSelectedRowKeys] = useState<any>([]);
  const [capabilityContent, setCapabilityContent] = useState<any>({});
  const [regitserValues, setRegisterValues] = useState<any>({});
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState<boolean>(false);
  const [content, setContent] = useState<any>({});
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [tabValue, setTabValue] = useState<number>(0);
  const [registerTabValue, setRegisterTabValue] = useState<number>(0);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState<boolean>(false);
  const [isSearchModal, setIsSearchModal] = useState<boolean>(false);
  const [searchPram, setSearchParam] = useState<string>('');
  const [searchCapability, setSearchCapability] = useState<string>('');

  const _ = useGetDetailCapabilitiesLevel(capabilityId, data => setContent(data?.data));
  const {
    data: capabilityLevel,
    isFetched: isSeminarVenueTypeFetched,
    refetch,
  } = useCapabilitiesLevel(
    paramsWithDefault({
      page: page,
      size: size,
      searchKeyword: searchPram,
    }),
  );

  const COLGROUP = ['5%', '5%', '5%', '5%', '5%'];
  const HEADS = ['역량아이디', '역량명', '설명', '등록일시', '수정일시'];

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
      let params = { ...regitserValues };
      params = {
        ...regitserValues,
      };
      onAdd && onAdd(params);
    }
  };

  const onShowPopup = (id: string) => {
    setCapabilityId(id);
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

  const handleTab = (value: number, isRegister = false) => {
    if (isRegister) {
      setRegisterTabValue(value);
    } else {
      setTabValue(value);
    }
  };

  const handleSearchCapability = () => {
    setSearchParam(searchCapability);
    refetch();
  };

  const onChangeCapabilityContent = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.currentTarget;
    const data = {
      [name]: type === 'number' ? Number(value) : value,
    };
    setCapabilityContent({
      ...capabilityContent,
      ...data,
    });
  };

  const updateCapability = () => {
    setIsLoading(true);
    if (
      !capabilityContent?.capabilityLevelId ||
      !capabilityContent?.capabilityLevel ||
      !capabilityContent?.capabilityLevelName
    ) {
      alert('필수값을 입력해주세요.');
      return;
    }
    if (isRegisterPopupOpen) {
      let isAdded = capabilityLevels?.find(
        item =>
          `${item.capabilityLevelId}#${item.capabilityLevel}` ===
          `${capabilityContent.capabilityLevelId}#${capabilityContent.capabilityLevel}`,
      );

      if (!isAdded) {
        let copiedContent = capabilityLevels || [];
        copiedContent?.push({
          capabilityLevelId: capabilityContent?.capabilityLevelId,
          capabilityLevel: capabilityContent?.capabilityLevel,
          capabilityLevelName: capabilityContent?.capabilityLevelName,
          description: capabilityContent?.description,
        });
        setCapabilityLevels(copiedContent);
      } else {
        alert('이미 추가된 항목입니다.');
        setIsSearchModal(true);
        return;
      }
    } else {
      setContent({
        ...content,
      });
    }
    alert('성공적으로 추가되었습니다.');
    setCapabilityContent({});
    setIsModalRegisterOpen(false);
    setTimeout(() => setIsLoading(false), 3);
  };

  const FIELDS = [
    { name: '역량아이디', field: 'capabilityId', type: 'text' },
    { name: '역량명', field: 'capabilityName', type: 'text' },
    { name: '설명', field: 'description', type: 'text' },
    {
      name: '수정일시',
      field: 'updatedDate',
      type: 'fromToDate',
      fieldNames: ['updatedFrom', 'updatedTo'],
    },
    {
      name: '등록일시',
      field: 'createdDate',
      type: 'fromToDate',
      fieldNames: ['createdFrom', 'createdTo'],
    },
  ];

  return (
    <div className="content">
      <h2 className="tit-type1">역량</h2>
      <div className="path">
        <span>Home</span> <span>역량 목록</span>
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
          items={capabilityList?.data?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.capabilityId)}>
                <td className="magic" title={item.capabilityId}>
                  {item.capabilityId}
                </td>
                <td className="magic" title={item.capabilityName}>
                  {item.capabilityName}
                </td>
                <td className="magic" title={item.description}>
                  {item.description}
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
          isEmpty={capabilityList?.data?.length === 0 || false}
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
          <ul className="tab-type1 tab6" data-evt="tab">
            <li className={tabValue === 0 ? 'on' : ''}>
              <a href="#" onClick={() => handleTab(0)}>
                기본 정보
              </a>
            </li>
            <li className={tabValue === 1 ? 'on' : ''}>
              <a href="#" onClick={() => handleTab(1)}>
                역량레벨
              </a>
            </li>
          </ul>
          <div className="tab-content">
            {tabValue === 0 && (
              <div className="layout-grid">
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">역량아이디</div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="capabilityId"
                        value={content?.capabilityId || ''}
                        onChange={onChangeContent}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">역량명</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="capabilityName"
                        value={content?.capabilityName || ''}
                        onChange={onChangeContent}
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
                        className="input-admin"
                        type="text"
                        name="description"
                        value={content?.description || ''}
                        onChange={onChangeContent}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {popupOpen && tabValue === 1 && (
              <div className="layout-grid">
                <div>
                  {isLoading ? (
                    <></>
                  ) : (
                    <AntdTable
                      loading={isLoading}
                      dataSource={content?.capabilityLevels || []}
                      size="small"
                      columns={NECESSARY_CAPABILITYID_COLUMNS}
                      pagination={false}
                      rowKey={record => `${record.capabilityLevelId}#${record.capabilityLevel}`}
                    />
                  )}
                </div>
              </div>
            )}
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
              <div className="tit-type2">역량 등록</div>
            </div>
            <div className="right">
              <button className="btn-type1 type2" onClick={handleOnAdd}>
                저장
              </button>
            </div>
          </div>
          <div className="tab-content">
            {registerTabValue === 0 && (
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
                    <div className="inp-tit">역량명</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="capabilityName"
                        value={regitserValues?.capabilityName || ''}
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
                {/* <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">레벨수</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="number"
                        name="levelCount"
                        value={regitserValues?.levelCount || ''}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            )}
            {registerTabValue === 1 && (
              <div className="layout-grid">
                <div>
                  {isLoading ? (
                    <></>
                  ) : (
                    <AntdTable
                      loading={isLoading}
                      dataSource={capabilityLevels || []}
                      size="small"
                      columns={NECESSARY_CAPABILITYID_COLUMNS}
                      pagination={false}
                      rowKey={record => `${record.capabilityLevelId}#${record.capabilityLevel}`}
                      rowSelection={{
                        type: 'checkbox',
                        onChange(selectedRowKeys) {
                          setSelectedRowKeys(selectedRowKeys);
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AdminModal
        isOpen={isModalRegisterOpen}
        onAfterClose={() => setIsModalRegisterOpen(false)}
        title="필요역량 추가"
        maxWidth="700px"
        maxHeight="700px"
      >
        <>
          {popupOpen && tabValue === 1 && (
            <div className={cx('')}>
              <div className={cx('modal-body')}>
                <div className={cx('first-row')}>
                  <div className={cx('first-row__wrapper')}>
                    <div className={cx('first-row__wrapper__col')}>
                      <label>역량레벨아이디</label>
                      <input
                        type="text"
                        className="input-admin"
                        name="capabilityLevelId"
                        value={capabilityContent?.capabilityLevelId}
                        disabled
                      />
                    </div>
                  </div>
                  <div className={cx('first-row__wrapper')}>
                    <div className={cx('first-row__wrapper__col')}>
                      <div className={cx('first-row__wrapper__col__search')}>
                        <label className={cx('right')}>역량레벨명</label>
                        <input
                          type="text"
                          className="input-admin"
                          name="capabilityLevelName"
                          value={capabilityContent?.capabilityLevelName}
                          disabled
                        />
                        <button className="btn" onClick={() => setIsSearchModal(true)}>
                          <i className="ico i-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={cx('second-row')}>
                  <div className={cx('second-row__wrapper')}>
                    <div className={cx('second-row__wrapper__col')}>
                      <label>역량레벨</label>
                      <input
                        type="text"
                        className="input-admin"
                        name="capabilityLevel"
                        value={capabilityContent?.capabilityLevel}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className={cx('third-row')}>
                  <div className={cx('third-row__wrapper')}>
                    <div className={cx('third-row__wrapper__col')}>
                      <label className={cx('description')}>설명</label>
                      <Textfield
                        type="text"
                        className={cx('third-row__wrapper__col__textArea')}
                        name="description"
                        value={capabilityContent?.description}
                        onChange={onChangeCapabilityContent}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={cx('modal-footer')}>
                <div className={cx('footer-wrapper')}>
                  <div>
                    <button className="btn-type1 type5" onClick={() => updateCapability()}>
                      등록
                    </button>
                    <button className="btn-type1 type6" onClick={() => setIsModalRegisterOpen(false)}>
                      취소
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isRegisterPopupOpen && registerTabValue === 1 && (
            <div className={cx('')}>
              <div className={cx('modal-body')}>
                <div className={cx('first-row')}>
                  <div className={cx('first-row__wrapper')}>
                    <div className={cx('first-row__wrapper__col')}>
                      <label>역량레벨아이디</label>
                      <input
                        type="text"
                        className="input-admin"
                        name="capabilityLevelId"
                        value={capabilityContent?.capabilityLevelId}
                        disabled
                      />
                    </div>
                  </div>
                  <div className={cx('first-row__wrapper')}>
                    <div className={cx('first-row__wrapper__col')}>
                      <div className={cx('first-row__wrapper__col__search')}>
                        <label className={cx('right')}>역량레벨명</label>
                        <input
                          type="text"
                          className="input-admin"
                          name="capabilityLevelName"
                          value={capabilityContent?.capabilityLevelName}
                          disabled
                        />
                        <button className="btn" onClick={() => setIsSearchModal(true)}>
                          <i className="ico i-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={cx('second-row')}>
                  <div className={cx('second-row__wrapper')}>
                    <div className={cx('second-row__wrapper__col')}>
                      <label>역량레벨</label>
                      <input
                        type="text"
                        className="input-admin"
                        name="capabilityLevel"
                        value={capabilityContent?.capabilityLevel}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className={cx('third-row')}>
                  <div className={cx('third-row__wrapper')}>
                    <div className={cx('third-row__wrapper__col')}>
                      <label>설명</label>
                      <Textfield
                        type="text"
                        className={cx('third-row__wrapper__col__textArea')}
                        name="description"
                        value={capabilityContent?.description}
                        onChange={event => onChangeCapabilityContent(event)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={cx('modal-footer')}>
                <div className={cx('footer-wrapper')}>
                  <div>
                    <button className="btn-type1 type5" onClick={() => updateCapability()}>
                      등록
                    </button>
                    <button className="btn-type1 type6" onClick={() => setIsModalRegisterOpen(false)}>
                      취소
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      </AdminModal>
      <AdminModal
        isOpen={isSearchModal}
        onAfterClose={() => setIsSearchModal(false)}
        title="역량레벨 검색"
        maxWidth="600px"
        maxHeight="700px"
      >
        <div className={cx('modal-body')}>
          {isRegisterPopupOpen && registerTabValue === 1 && (
            <div className={cx('modal-content')}>
              <div className={cx('searchKeyword')}>
                <input
                  type="text"
                  className="input-admin"
                  name="searchKeyword"
                  onChange={e => setSearchCapability(e.target.value)}
                />
                <button className="btn-type1 type5" onClick={() => handleSearchCapability()}>
                  검색
                </button>
              </div>
              <div className={cx('table')}>
                <AntdTable
                  dataSource={capabilityLevel?.data}
                  columns={NECESSARY_CAPABILITYID_COLUMNS}
                  size="small"
                  pagination={{
                    defaultCurrent: 1,
                    total: capabilityLevel?.totalPage,
                    showSizeChanger: false,
                    current: page,
                    pageSize: size,
                    position: ['bottomCenter'],
                    onChange(page, pageSize) {
                      setPage(page);
                      setSize(pageSize);
                    },
                  }}
                  rowKey={record => `${record.capabilityLevelId}#${record.capabilityLevel}`}
                  rowSelection={{
                    type: 'radio',
                    onChange: (_, selectedRows) => {
                      if (selectedRows) {
                        setCapabilityContent({
                          capabilityLevelId: selectedRows[0].capabilityLevelId,
                          capabilityLevel: selectedRows[0].capabilityLevel,
                          capabilityLevelName: selectedRows[0].capabilityLevelName,
                        });
                        setIsSearchModal(false);
                      }
                    },
                  }}
                />
              </div>
            </div>
          )}
          {popupOpen && tabValue === 1 && (
            <div className={cx('modal-content')}>
              <div className={cx('searchKeyword')}>
                <input
                  type="text"
                  className="input-admin"
                  name="searchKeyword"
                  onChange={e => setSearchCapability(e.target.value)}
                />
                <button className="btn-type1 type5" onClick={() => handleSearchCapability()}>
                  검색
                </button>
              </div>
              <div className={cx('table')}>
                <AntdTable
                  dataSource={capabilityLevel?.data}
                  columns={NECESSARY_CAPABILITYID_COLUMNS}
                  size="small"
                  pagination={{
                    defaultCurrent: 1,
                    total: capabilityLevel?.totalPage,
                    showSizeChanger: false,
                    current: page,
                    pageSize: size,
                    position: ['bottomCenter'],
                    onChange(page, pageSize) {
                      setPage(page);
                      setSize(pageSize);
                    },
                  }}
                  rowKey={record => `${record.capabilityLevelId}#${record.capabilityLevel}`}
                  rowSelection={{
                    type: 'radio',
                    onChange: (_, selectedRows) => {
                      if (selectedRows) {
                        setCapabilityContent({
                          capabilityLevelId: selectedRows[0].capabilityLevelId,
                          capabilityLevel: selectedRows[0].capabilityLevel,
                          capabilityLevelName: selectedRows[0].capabilityLevelName,
                        });
                        setIsSearchModal(false);
                      }
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </AdminModal>
    </div>
  );
}

export default CapabilityListPage;

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
