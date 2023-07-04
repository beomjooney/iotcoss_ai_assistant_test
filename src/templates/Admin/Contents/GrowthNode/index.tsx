import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { useCapabilitiesLevel } from 'src/services/admin/capabilityLevel/capabilityLevel.queries';
import { AdminPagination, Table, Toggle, SmartFilter, AdminModal, Textfield } from 'src/stories/components';
import { Table as AntdTable } from 'antd';
import { useGetDetailGrowthNode } from 'src/services/admin/growthNode/growthNode.queries';
import { SearchParamsProps } from 'pages/admin/contents/growthNode';
import dayjs from 'dayjs';
import { useJobGroups, useJobs } from 'src/services/code/code.queries';

const cx = classNames.bind(styles);

interface GrowthNodeTemplateProps {
  onSearch?: (searchKeyword: SearchParamsProps) => void;
  onDelete?: (memberId: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  nodeList?: any;
  pageProps?: any;
  params?: SearchParamsProps;
  setParams?: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

export function GrowthNodeTemplate({
  onSearch,
  onDelete,
  onSave,
  onAdd,
  params,
  pageProps,
  nodeList,
}: GrowthNodeTemplateProps) {
  const [nodeId, setNodeId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchPram, setSearchParam] = useState<string>('');
  const [searchCapability, setSearchCapability] = useState<string>('');
  const [growthNodeCapabilities, setGrowthNodeCapabilities] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [regitserValues, setRegisterValues] = useState<any>({});
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState<boolean>(false);
  const [content, setContent] = useState<any>({});
  const [capabilityContent, setCapabilityContent] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [detailSelectedRowKeys, setDetailSelectedRowKeys] = useState<any>([]);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [tabValue, setTabValue] = useState<number>(0);
  const [registerTabValue, setRegisterTabValue] = useState<number>(0);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState<boolean>(false);
  const [isSearchModal, setIsSearchModal] = useState<boolean>(false);

  const COLGROUP = ['5%', '5%', '5%', '5%', '5%', '5%'];
  const HEADS = ['성장노드아이디', '설명', '레벨', '성장노드직군', '정렬순서', '수정일시'];

  const { data: groups, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: jobs } = useJobs();
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
  const _ = useGetDetailGrowthNode(nodeId, data => setContent(data?.data));
  const [growthNodeDetailData, setGrowthNodeDetailData] = useState<any>({});

  const onChangeContent = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.currentTarget;
    const data = {
      [name]: type === 'number' ? Number(value) : value,
    };
    setContent({
      ...content,
      ...data,
    });
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

  const handleSave = () => {
    if (confirm('수정하시겠습니까?')) {
      let params = { ...content };
      params = {
        ...content,
        growthNodeCapabilities: content?.growthNodeCapabilities || [],
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
        growthNodeCapabilities: growthNodeCapabilities || [],
      };
      onAdd && onAdd(params);
    }
  };

  const onShowPopup = (id: string) => {
    // const result = nodeList?.data?.find(item => item?.nodeId === id);
    setNodeId(id);
    // let param = result;
    // setContent(param);
    setPopupOpen(true);
  };

  const handleCheckboxChange = (e, key, isRegister?) => {
    const { value, checked } = e.target;
    if (isRegister) {
      const temp = new Set(regitserValues[key]);
      const isNumberType = key === 'recommendLevels';
      if (checked) temp.add(isNumberType ? parseInt(value) : value);
      else temp.delete(value);
      setRegisterValues({ ...regitserValues, [key]: [...temp] });
    } else {
      const temp = new Set(content[key]);
      const isNumberType = key === 'recommendLevels';
      if (checked) temp.add(isNumberType ? parseInt(value) : value);
      else temp.delete(value);
      setContent({ ...content, [key]: [...temp] });
    }
  };

  const handleSearchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setSearchKeyword(value);
  };

  const handlePickerContentChange = (moment, key, isRegister?) => {
    let datetime = moment?.format('YYYY-MM-DD HH:mm');
    if (isRegister) {
      setRegisterValues({
        ...regitserValues,
        [key]: `${datetime}:00.000`,
      });
      return;
    } else {
      setContent({
        ...content,
        [key]: `${datetime}:00.000`,
      });
      return;
    }
  };

  const onSmartFilterSearch = (params: any) => {
    onSearch && onSearch(params);
  };

  const onShowUpRegisterPopUp = event => {
    setIsRegisterPopupOpen(true);
  };

  const handleRegister = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.currentTarget;
    const data = {
      [name]: type === 'number' ? Number(value) : value,
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

  const updateCapability = () => {
    setIsLoading(true);
    if (
      !capabilityContent?.capabilityId ||
      !capabilityContent?.capabilityName ||
      !capabilityContent?.capabilityLevel ||
      !capabilityContent?.capabilityPriority ||
      !capabilityContent?.description
    ) {
      alert('필수값을 입력해주세요.');
      return;
    }
    if (isRegisterPopupOpen) {
      let isAdded = growthNodeCapabilities?.find(
        item =>
          `${item?.capabilityId}#${item?.capabilityLevel}` ===
          `${capabilityContent?.capabilityId}#${capabilityContent?.capabilityLevel}`,
      );
      if (!isAdded) {
        let copiedContent = growthNodeCapabilities;
        copiedContent?.push({
          capabilityId: capabilityContent?.capabilityId,
          capabilityName: capabilityContent?.capabilityName,
          capabilityLevel: capabilityContent?.capabilityLevel,
          capabilityLevelName: capabilityContent?.capabilityLevelName,
          capabilityPriority: capabilityContent?.capabilityPriority,
          description: capabilityContent?.description,
        });
        setGrowthNodeCapabilities(copiedContent);
      } else {
        alert('이미 추가된 항목입니다.');
        return;
      }
    } else {
      let isAdded = growthNodeCapabilities?.find(
        item =>
          `${item?.capabilityId}#${item?.capabilityLevel}` ===
          `${capabilityContent?.capabilityId}#${capabilityContent?.capabilityLevel}`,
      );
      if (!isAdded) {
        let copiedContent = content?.growthNodeCapabilities;
        copiedContent?.push({
          capabilityId: capabilityContent?.capabilityId,
          capabilityName: capabilityContent?.capabilityName,
          capabilityLevel: capabilityContent?.capabilityLevel,
          capabilityLevelName: capabilityContent?.capabilityLevelName,
          capabilityPriority: capabilityContent?.capabilityPriority,
          description: capabilityContent?.description,
        });
        setContent({
          ...content,
          growthNodeCapabilities: copiedContent,
        });
      } else {
        alert('이미 추가된 항목입니다.');
        return;
      }
    }
    alert('성공적으로 추가되었습니다.');
    setCapabilityContent({});
    setIsModalRegisterOpen(false);
    setTimeout(() => setIsLoading(false), 3);
  };

  const handleDeleteCapability = () => {
    if (isRegisterPopupOpen) {
      if (registerTabValue === 1) {
        let copiedContent = growthNodeCapabilities;
        let filteredContent = copiedContent?.filter(
          item => !selectedRowKeys.includes(`${item?.capabilityId}#${item?.capabilityLevel}`),
        );
        setGrowthNodeCapabilities(filteredContent);
      }
    } else {
      if (tabValue === 1) {
        let copiedContent = content?.growthNodeCapabilities;
        let filteredContent = copiedContent?.filter(
          item => !detailSelectedRowKeys.includes(`${item?.capabilityId}#${item?.capabilityLevel}`),
        );
        setContent({
          ...content,
          growthNodeCapabilities: filteredContent,
        });
      }
    }
  };

  const handleSearchCapability = () => {
    setSearchParam(searchCapability);
    refetch();
  };

  useEffect(() => {
    if (!isRegisterPopupOpen) {
      setGrowthNodeCapabilities([]);
    }
  }, [isRegisterPopupOpen]);

  const FIELDS = [
    { name: '성장노드 아이디', field: 'nodeId', type: 'text' },
    { name: '설명', field: 'description', type: 'text' },
    { name: '성장노드직군', field: 'nodeJobGroup', type: 'choice', data: groups || [] },
    { name: '정렬순서', field: 'order', type: 'text' },
    { name: '', field: 'blank', type: 'blank' },
  ];

  return (
    <div className="content">
      <h2 className="tit-type1">성장노드</h2>
      <div className="path">
        <span>Home</span> <span>성장노드 목록</span>
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
        <SmartFilter name="memberFilter" fields={FIELDS} isFilterOpen={isFilter} onSearch={onSmartFilterSearch} />
      </div>
      <div className="data-type1" data-evt="main-table-on">
        <Table
          name="content"
          colgroup={COLGROUP}
          heads={HEADS}
          items={nodeList?.data?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.nodeId)}>
                <td className="magic" title={item.nodeId}>
                  {item.nodeId}
                </td>
                <td className="magic" title={item?.description}>
                  {item?.description}
                </td>
                <td className="magic" title={item?.level}>
                  {item?.level}
                </td>
                <td className="magic" title={item.data?.group}>
                  {item.relatedJobGroupNames?.join(', ')}
                </td>
                <td className="magic" title={item?.order}>
                  {item?.order}
                </td>
                <td className="magic" title={dayjs(item?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={nodeList?.data?.length === 0 || false}
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
              <div className="tit-type2">성장노드 상세보기</div>
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
                    onDelete && onDelete(content?.nodeId);
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
                필요역량
              </a>
            </li>
          </ul>
          <div className="tab-content">
            {popupOpen && tabValue === 0 && (
              <div className="layout-grid">
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      성장노드아이디
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="nodeId"
                        value={content.nodeId}
                        onChange={onChangeContent}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      설명
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="description"
                        value={content.description}
                        onChange={onChangeContent}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">레벨</div>
                    <div className="inp">
                      <select value={content.level} onChange={onChangeContent} name="level" disabled={!isEdit}>
                        <option value="">-- 선택 --</option>
                        {LEVELS?.map(item => (
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
                    <div className="inp-tit">
                      정렬순서
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="number"
                        name="order"
                        value={content.order}
                        onChange={onChangeContent}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">부모노드아이디</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="parentNodeId"
                        value={content.parentNodeId}
                        onChange={onChangeContent}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-100 mt-3">
                  <div className="inpwrap">
                    <div className="inp-tit">연관직군</div>
                    <div className="inp">
                      {isJobGroupFetched &&
                        groups?.map(item => {
                          let isIncludeContent = false;
                          if (content?.relatedJobGroups?.includes(item.id)) {
                            isIncludeContent = true;
                          }
                          return (
                            <span
                              key={item.id}
                              className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}
                            >
                              <Toggle
                                isActive
                                label={item.name}
                                name="relatedJobGroups"
                                type="checkBox"
                                checked={isIncludeContent}
                                value={item.id}
                                key={item.id}
                                disabled={!isEdit}
                                className={cx('fixed-width')}
                                onChange={e => handleCheckboxChange(e, 'relatedJobGroups')}
                              />
                            </span>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="grid-100 mt-3">
                  <div className="inpwrap">
                    <div className="inp-tit">연관직무들</div>
                    <div className="inp">
                      {jobs?.map(item => {
                        let isIncludeContent = false;
                        if (content?.relatedJobs?.includes(item.id)) {
                          isIncludeContent = true;
                        }
                        return (
                          <span
                            key={item.id}
                            className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}
                          >
                            <Toggle
                              isActive
                              label={item.name}
                              name="relatedJobs"
                              type="checkBox"
                              checked={isIncludeContent}
                              value={item.id}
                              key={item.id}
                              className={cx('fixed-width')}
                              disabled={!isEdit}
                              onChange={e => handleCheckboxChange(e, 'relatedJobs')}
                            />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="grid-100 mt-3">
                  <div className="inpwrap">
                    <div className="inp-tit">성장노드직군</div>
                    <div className="inp">
                      {isJobGroupFetched &&
                        groups?.map(item => {
                          let isIncludeContent = false;
                          if (content?.relatedJobGroups?.includes(item.id)) {
                            isIncludeContent = true;
                          }
                          return (
                            <span
                              key={item.id}
                              className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}
                            >
                              <Toggle
                                isActive
                                label={item.name}
                                name="relatedJobGroups"
                                type="checkBox"
                                checked={isIncludeContent}
                                value={item.id}
                                key={item.id}
                                disabled={!isEdit}
                                className={cx('fixed-width')}
                                onChange={e => handleCheckboxChange(e, 'relatedJobGroups')}
                              />
                            </span>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {popupOpen && tabValue === 1 && (
              <div className="layout-grid">
                <div className={cx('btn-area')}>
                  <button className="btn-type1 type5" onClick={() => setIsModalRegisterOpen(true)}>
                    추가
                  </button>
                  <button className="btn-type1 type6" onClick={() => handleDeleteCapability()}>
                    삭제
                  </button>
                </div>
                <div>
                  {isLoading ? (
                    <></>
                  ) : (
                    <AntdTable
                      loading={isLoading}
                      dataSource={content?.growthNodeCapabilities || []}
                      size="small"
                      columns={NECESSARY_CAPABILITYID_COLUMNS}
                      pagination={false}
                      rowKey={record => `${record.capabilityId}#${record?.capabilityLevel}`}
                      rowSelection={{
                        type: 'checkbox',
                        onChange(selectedRowKeys) {
                          setDetailSelectedRowKeys(selectedRowKeys);
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
              <div className="tit-type2">성장노드 등록</div>
            </div>
            <div className="right">
              <button className="btn-type1 type2" onClick={handleOnAdd}>
                저장
              </button>
            </div>
          </div>
          <ul className="tab-type1 tab6" data-evt="tab">
            <li className={registerTabValue === 0 ? 'on' : ''}>
              <a href="#" onClick={() => handleTab(0, true)}>
                기본 정보
              </a>
            </li>
            <li className={registerTabValue === 1 ? 'on' : ''}>
              <a href="#" onClick={() => handleTab(1, true)}>
                필요역량
              </a>
            </li>
          </ul>
          <div className="tab-content">
            {isRegisterPopupOpen && registerTabValue === 0 && (
              <div className="layout-grid">
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      성장노드아이디
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="nodeId"
                        value={regitserValues?.nodeId}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      성장노드명
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="nodeName"
                        value={regitserValues?.nodeName}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">성장노드 직군</div>
                    <div className="inp">
                      <select value={regitserValues?.nodeJobGroup} onChange={handleRegister} name="nodeJobGroup">
                        <option value="">-- 선택 --</option>
                        {groups?.map(item => (
                          <option value={item?.id} key={item?.id}>
                            {item?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      설명
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="description"
                        value={regitserValues?.description}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">레벨</div>
                    <div className="inp">
                      <select value={regitserValues?.level} onChange={handleRegister} name="level">
                        <option value="">-- 선택 --</option>
                        {LEVELS?.map(item => (
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
                    <div className="inp-tit">
                      정렬순서
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="number"
                        name="order"
                        value={regitserValues?.order}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">부모노드아이디</div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="parentNodeId"
                        value={regitserValues?.parentNodeId}
                        onChange={handleRegister}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid-100 mt-3">
                  <div className="inpwrap">
                    <div className="inp-tit">연관직군</div>
                    <div className="inp">
                      {isJobGroupFetched &&
                        groups?.map(item => {
                          let isIncludeContent = false;
                          if (regitserValues?.relatedJobGroups?.includes(item.id)) {
                            isIncludeContent = true;
                          }
                          return (
                            <span key={item.id} className={cx('check-area__item', 'col-md-2')}>
                              <Toggle
                                isActive
                                label={item.name}
                                name="relatedJobGroups"
                                type="checkBox"
                                checked={isIncludeContent}
                                value={item.id}
                                key={item.id}
                                className={cx('fixed-width')}
                                onChange={e => handleCheckboxChange(e, 'relatedJobGroups', true)}
                              />
                            </span>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="grid-100 mt-3">
                  <div className="inpwrap">
                    <div className="inp-tit">연관직무들</div>
                    <div className="inp">
                      {jobs?.map(item => {
                        let isIncludeContent = false;
                        if (regitserValues?.relatedJobs?.includes(item.id)) {
                          isIncludeContent = true;
                        }
                        return (
                          <span key={item.id} className={cx('check-area__item', 'col-md-2')}>
                            <Toggle
                              isActive
                              label={item.name}
                              name="relatedJobs"
                              type="checkBox"
                              checked={isIncludeContent}
                              value={item.id}
                              key={item.id}
                              className={cx('fixed-width')}
                              onChange={e => handleCheckboxChange(e, 'relatedJobs', true)}
                            />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isRegisterPopupOpen && registerTabValue === 1 && (
              <div className="layout-grid">
                <div className={cx('btn-area')}>
                  <button className="btn-type1 type5" onClick={() => setIsModalRegisterOpen(true)}>
                    추가
                  </button>
                  <button className="btn-type1 type6" onClick={() => handleDeleteCapability()}>
                    삭제
                  </button>
                </div>
                <div>
                  {isLoading ? (
                    <></>
                  ) : (
                    <AntdTable
                      loading={isLoading}
                      dataSource={growthNodeCapabilities || []}
                      size="small"
                      columns={NECESSARY_CAPABILITYID_COLUMNS}
                      pagination={false}
                      rowKey={record => `${record?.capabilityId}#${record?.capabilityLevel}`}
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
                      <label>역량아이디</label>
                      <input
                        type="text"
                        className="input-admin"
                        name="capabilityId"
                        value={capabilityContent?.capabilityId}
                      />
                    </div>
                    <div className={cx('first-row__wrapper__col')}>
                      <label>역량명</label>
                      <input
                        className="input-admin"
                        name="capabilityName"
                        type="number"
                        value={capabilityContent?.capabilityName}
                      />
                    </div>
                  </div>
                  <div className={cx('first-row__wrapper')}>
                    <div className={cx('first-row__wrapper__col')}>
                      <div className={cx('first-row__wrapper__col__search')}>
                        <label className={cx('right')}>레벨</label>
                        <input
                          type="text"
                          className="input-admin"
                          name="capabilityLevel"
                          value={capabilityContent?.capabilityLevel}
                        />
                        <button className="btn" onClick={() => setIsSearchModal(true)}>
                          <i className="ico i-search"></i>
                        </button>
                      </div>
                    </div>
                    <div className={cx('first-row__wrapper__col')}>
                      <label className={cx('right')}>역량레벨명</label>
                      <input
                        type="text"
                        className="input-admin"
                        value={capabilityContent?.capabilityLevelName}
                        name="capabilityLevelName"
                      />
                    </div>
                  </div>
                </div>
                <div className={cx('second-row')}>
                  <div className={cx('second-row__wrapper')}>
                    <div className={cx('second-row__wrapper__col')}>
                      <label>역량중요도</label>
                      <input
                        type="number"
                        className="input-admin"
                        name="capabilityPriority"
                        value={capabilityContent?.capabilityPriority}
                        onChange={onChangeCapabilityContent}
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
                      <label>역량아이디</label>
                      <input
                        type="text"
                        className="input-admin"
                        name="capabilityId"
                        value={capabilityContent?.capabilityId}
                      />
                    </div>
                    <div className={cx('first-row__wrapper__col')}>
                      <label>역량명</label>
                      <input
                        className="input-admin"
                        name="capabilityName"
                        type="text"
                        value={capabilityContent?.capabilityName}
                      />
                    </div>
                  </div>
                  <div className={cx('first-row__wrapper')}>
                    <div className={cx('first-row__wrapper__col')}>
                      <div className={cx('first-row__wrapper__col__search')}>
                        <label className={cx('right')}>레벨</label>
                        <input
                          type="text"
                          className="input-admin"
                          name="capabilityLevel"
                          value={capabilityContent?.capabilityLevel}
                        />
                        <button className="btn" onClick={() => setIsSearchModal(true)}>
                          <i className="ico i-search"></i>
                        </button>
                      </div>
                    </div>
                    <div className={cx('first-row__wrapper__col')}>
                      <label className={cx('right')}>역량레벨명</label>
                      <input
                        type="text"
                        className="input-admin"
                        value={capabilityContent?.capabilityLevelName}
                        name="capabilityLevelName"
                      />
                    </div>
                  </div>
                </div>
                <div className={cx('second-row')}>
                  <div className={cx('second-row__wrapper')}>
                    <div className={cx('second-row__wrapper__col')}>
                      <label>역량중요도</label>
                      <input
                        type="number"
                        className="input-admin"
                        name="capabilityPriority"
                        value={capabilityContent?.capabilityPriority}
                        onChange={event => onChangeCapabilityContent(event)}
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
                  rowKey={record => `${record.capabilityId}#${record?.capabilityLevel}`}
                  rowSelection={{
                    type: 'radio',
                    onChange: (_, selectedRows) => {
                      if (selectedRows) {
                        setCapabilityContent({
                          capabilityId: selectedRows[0]?.capabilityId,
                          capabilityLevel: selectedRows[0]?.capabilityLevel,
                          capabilityLevelName: selectedRows[0]?.capabilityLevelName,
                          capabilityName: selectedRows[0]?.capabilityName,
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
                  rowKey={record => `${record?.capabilityId}#${record?.capabilityLevel}`}
                  rowSelection={{
                    type: 'radio',
                    onChange: (_, selectedRows) => {
                      if (selectedRows) {
                        setCapabilityContent({
                          capabilityId: selectedRows[0].capabilityId,
                          capabilityLevel: selectedRows[0].capabilityLevel,
                          capabilityLevelName: selectedRows[0].capabilityLevelName,
                          capabilityName: selectedRows[0].capabilityName,
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

export default GrowthNodeTemplate;

const LEVELS = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: i + 1 })) || [];

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
    title: '역량아이디',
    dataIndex: 'capabilityId',
    key: 'capabilityId',
    width: 100,
    align: 'center',
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: '역량명',
    dataIndex: 'capabilityName',
    key: 'capabilityName',
    width: 100,
    align: 'center',
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
    title: '역량중요도',
    dataIndex: 'capabilityPriority',
    key: 'capabilityPriority',
    width: 80,
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
