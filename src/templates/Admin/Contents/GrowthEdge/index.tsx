import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Table as AntdTable } from 'antd';
import { AdminPagination, Table, SmartFilter, AdminModal } from 'src/stories/components';
import { SearchParamsProps } from 'pages/admin/contents/growthEdge';
import dayjs from 'dayjs';
import { useGetDetailGrowthEdge } from 'src/services/admin/growthEdge/growthEdge.queries';
import { useEdgeRecommendTypes, useEdgeTypes } from 'src/services/code/code.queries';
import { useSkills } from 'src/services/admin/skill/skill.queries';
import { useExperience } from 'src/services/admin/experience/experience.queries';

const cx = classNames.bind(styles);

interface GrowthEdgeTemplateProps {
  onSearch?: (searchKeyword: SearchParamsProps) => void;
  onDelete?: (memberId: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  edgeList?: any;
  pageProps?: any;
  params?: SearchParamsProps;
  setParams?: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

export function GrowthEdgeTemplate({
  onSearch,
  onDelete,
  onSave,
  onAdd,
  params,
  pageProps,
  edgeList,
}: GrowthEdgeTemplateProps) {
  const [edgeId, setEdgeId] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchSkill, setSearchSkill] = useState<string>('');
  const [searchPram, setSearchParam] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [detailSelectedRowKeys, setDetailSelectedRowKeys] = useState<any>([]);
  const { data: skillsList, refetch } = useSkills(
    paramsWithDefault({
      page: page,
      size: size,
      searchKeyword: searchPram,
    }),
  );
  const [searchExperience, setSearchExperience] = useState<string>('');
  const [searchPramExperience, setSearchParamExperience] = useState<string>('');
  const [detailSelectedExperienceRowKeys, setDetailSelectedExperienceRowKeys] = useState<any>([]);
  const [selectedExperienceRowKeys, setSelectedExperienceRowKeys] = useState<any>([]);
  const { data: experienceList, refetch: refetchExperience } = useExperience(
    paramsWithDefault({
      page: page,
      size: size,
      searchKeyword: searchPramExperience,
    }),
  );
  const { data: edgeTypes } = useEdgeTypes();
  const { data: edgeRecommendTypes } = useEdgeRecommendTypes();
  const _ = useGetDetailGrowthEdge(edgeId, data => setContent(data?.data));
  const [regitserValues, setRegisterValues] = useState<any>({});
  const [growthEdgeSkills, setGrowthEdgeSkills] = useState<any>([]);
  const [growthEdgeExperiences, setGrowthEdgeExperiences] = useState<any>([]);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState<boolean>(false);
  const [content, setContent] = useState<any>({});
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [skillContent, setSkillContent] = useState<any>({});
  const [experienceContent, setExperienceContent] = useState<any>({});
  const [isSearchModal, setIsSearchModal] = useState<boolean>(false);

  const [registerTabValue, setRegisterTabValue] = useState<number>(0);
  const [tabValue, setTabValue] = useState<number>(0);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState<boolean>(false);

  const COLGROUP = ['5%', '5%', '5%', '5%', '5%', '5%'];
  const HEADS = ['성장엣지아이디', '성장엣지명', '시작노드아이디', '종료노드아이디', '성장엣지유형', '수정일시'];

  const onChangeContent = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;

    if (name === 'exposeDetail') {
      setContent({
        ...content,
        [name]: value === 'Y' ? true : false,
      });
      return;
    }
    const data = {
      [name]: value,
    };
    setContent({
      ...content,
      ...data,
    });
  };

  const onShowPopup = (id: string) => {
    setEdgeId(id);
    setPopupOpen(true);
  };

  const handleSearchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setSearchKeyword(value);
  };

  const onSmartFilterSearch = (params: any) => {
    onSearch && onSearch(params);
  };

  const handleSave = () => {
    if (confirm('수정하시겠습니까?')) {
      let params = { ...content };

      params = {
        ...content,
        growthEdgeSkills: content?.growthEdgeSkills || [],
        growthEdgeExperiences: content?.growthEdgeExperiences || [],
      };

      onSave && onSave(params);
      setIsEdit(false);
    }
  };

  const handleOnAdd = () => {
    if (confirm('저장하시겠습니까?')) {
      const result = growthEdgeSkills.map((item: any) => ({
        skillId: item?.skillId,
        edgeRecommendType: item?.edgeRecommendType,
        edgeRecommendTypeName: '',
        growthEdgeId: '',
      }));
      let params = { ...regitserValues };
      params = {
        ...regitserValues,
        growthEdgeSkills: result || [],
        growthEdgeExperiences: growthEdgeExperiences || [],
      };
      onAdd && onAdd(params);
    }
  };

  const onShowUpRegisterPopUp = event => {
    setIsRegisterPopupOpen(true);
  };

  const handleRegister = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    if (name === 'exposeDetail') {
      setRegisterValues({
        ...regitserValues,
        [name]: value === 'Y' ? true : false,
      });
      return;
    }
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

  const FIELDS = [
    { name: '성장엣지 아이디', field: 'id', type: 'text' },
    { name: '성장엣지명', field: 'edgeName', type: 'text' },
    { name: '시작노드아이디', field: 'fromNodeId', type: 'text' },
    { name: '종료노드아이디', field: 'toNodeId', type: 'text' },
    { name: '성장엣지유형', field: 'edgeType', type: 'choice', data: edgeTypes || [] },
    { name: '', field: 'blank', type: 'blank' },
    {
      name: '수정일시',
      field: 'updateDate',
      type: 'fromToDate',
      fieldNames: ['updateDateFrom', 'updateDateTo'],
    },
  ];

  const onChangeSkillOrExperienceContent = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.currentTarget;
    const data = {
      [name]: type === 'number' ? Number(value) : value,
    };

    if (registerTabValue === 1) {
      setSkillContent({
        ...skillContent,
        ...data,
      });
    } else if (registerTabValue === 2) {
      setExperienceContent({
        ...experienceContent,
        ...data,
      });
    } else if (tabValue === 2) {
      setExperienceContent({
        ...experienceContent,
        ...data,
      });
    } else if (tabValue === 1) {
      setSkillContent({
        ...skillContent,
        ...data,
      });
    }
  };

  const updateSkill = () => {
    setIsLoading(true);
    if (!skillContent?.skillId || !skillContent?.skillName || !skillContent?.edgeRecommendType) {
      alert('필수값을 입력해주세요.');
      return;
    }
    if (isRegisterPopupOpen) {
      let isAdded = growthEdgeSkills?.find(item => item?.skillId === skillContent?.skillId);
      if (!isAdded) {
        let copiedContent = growthEdgeSkills;
        copiedContent?.push({
          skillId: skillContent?.skillId,
          skillName: skillContent?.skillName,
          edgeRecommendType: skillContent?.edgeRecommendType,
          growthEdgeId: '',
        });
        setGrowthEdgeSkills(copiedContent);
      } else {
        alert('이미 추가된 항목입니다.');
      }
    } else {
      let isAdd = content?.growthEdgeSkills?.find(item => item?.skillId === skillContent?.skillId);
      if (!isAdd) {
        let copiedContent = content?.growthEdgeSkills;
        copiedContent?.push({
          skillId: skillContent?.skillId,
          skillName: skillContent?.skillName,
          edgeRecommendType: skillContent?.edgeRecommendType,
          growthEdgeId: '',
        });
        setContent({
          ...content,
          growthEdgeSkills: copiedContent,
        });
      } else {
        alert('이미 추가된 항목입니다.');
      }
    }
    alert('성공적으로 추가되었습니다.');
    setSkillContent({});
    setIsModalRegisterOpen(false);
    setTimeout(() => setIsLoading(false), 3);
  };

  const updateExperience = () => {
    setIsLoading(true);
    if (
      !experienceContent?.experienceId ||
      !experienceContent?.experienceName ||
      !experienceContent?.edgeRecommendType
    ) {
      alert('필수값을 입력해주세요.');
      return;
    }
    if (isRegisterPopupOpen) {
      let isAdded = growthEdgeExperiences?.find(item => item?.experienceId === experienceContent?.experienceId);
      if (!isAdded) {
        let copiedContent = growthEdgeExperiences;
        copiedContent?.push({
          experienceId: experienceContent?.experienceId,
          experienceName: experienceContent?.experienceName,
          edgeRecommendType: experienceContent?.edgeRecommendType,
          growthEdgeId: '',
        });
        setGrowthEdgeExperiences(copiedContent);
      }
    } else {
      let isAdd = content?.growthEdgeExperiences?.find(item => item?.experienceId === experienceContent?.experienceId);
      if (!isAdd) {
        let copiedContent = { ...content };
        const growthEdgeExperiences = copiedContent?.growthEdgeExperiences;
        growthEdgeExperiences?.push({
          experienceId: experienceContent?.experienceId,
          experienceName: experienceContent?.experienceName,
          edgeRecommendType: experienceContent?.edgeRecommendType,
        });
        setContent({
          ...content,
          growthEdgeExperiences,
        });
      }
    }
    alert('성공적으로 추가되었습니다.');
    setExperienceContent({});
    setIsModalRegisterOpen(false);
    setTimeout(() => setIsLoading(false), 3);
  };

  const handleSearchSkill = () => {
    setSearchParam(searchSkill);
    refetch();
  };

  const handleSearchExperience = () => {
    setSearchParamExperience(searchExperience);
    refetchExperience();
  };

  const handleDeleteSkill = () => {
    if (isRegisterPopupOpen) {
      if (registerTabValue === 1) {
        let copiedContent = growthEdgeSkills;
        let filteredContent = copiedContent?.filter(item => !selectedRowKeys.includes(item?.skillId));
        setGrowthEdgeSkills(filteredContent);
      } else if (registerTabValue === 2) {
        let copiedContent = growthEdgeExperiences;
        let filteredContent = copiedContent?.filter(item => !selectedExperienceRowKeys.includes(item?.experienceId));
        setGrowthEdgeExperiences(filteredContent);
      }
    } else {
      if (tabValue === 1) {
        let copiedContent = content?.growthEdgeSkills;
        let filteredContent = copiedContent?.filter(item => !detailSelectedRowKeys.includes(item?.skillId));
        setContent({
          ...content,
          growthEdgeSkills: filteredContent,
        });
      } else if (tabValue === 2) {
        let copiedContent = content?.growthEdgeExperiences;
        let filteredContent = copiedContent?.filter(
          item => !detailSelectedExperienceRowKeys.includes(item?.experienceId),
        );
        setContent({ ...content, growthEdgeExperiences: filteredContent });
      }
    }
  };

  useEffect(() => {
    if (!isRegisterPopupOpen) {
      setGrowthEdgeExperiences([]);
      setGrowthEdgeSkills([]);
    }
  }, [isRegisterPopupOpen]);

  return (
    <div className="content">
      <h2 className="tit-type1">성장엣지</h2>
      <div className="path">
        <span>Home</span> <span>성장엣지 목록</span>
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
          items={edgeList?.data?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.edgeId)}>
                <td className="magic" title={item.edgeId}>
                  {item.edgeId}
                </td>
                <td className="magic" title={item?.edgeName}>
                  {item?.edgeName}
                </td>
                <td className="magic" title={item.fromNodeId}>
                  {item.fromNodeId}
                </td>
                <td className="magic" title={item?.toNodeId}>
                  {item?.toNodeId}
                </td>
                <td className="magic" title={item?.edgeType}>
                  {item?.edgeType}
                </td>
                <td className="magic" title={dayjs(item?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={edgeList?.data?.length === 0 || false}
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
              <div className="tit-type2">성장엣지 상세보기</div>
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
                    onDelete && onDelete(content?.edgeId);
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
                필요스킬
              </a>
            </li>
            <li className={tabValue === 2 ? 'on' : ''}>
              <a href="#" onClick={() => handleTab(2)}>
                필요경험
              </a>
            </li>
          </ul>
          <div className="tab-content">
            {popupOpen && tabValue === 0 && (
              <div className="layout-grid">
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      성장엣지아이디
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="edgeId"
                        value={content.edgeId || ''}
                        onChange={onChangeContent}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      성장엣지명
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="edgeName"
                        value={content.edgeName || ''}
                        onChange={onChangeContent}
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
                        value={content.description || ''}
                        onChange={onChangeContent}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      시작노드아이디
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="fromNodeId"
                        value={content.fromNodeId || ''}
                        onChange={onChangeContent}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      종료노드아이디
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="toNodeId"
                        value={content.toNodeId || ''}
                        onChange={onChangeContent}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">성장엣지 유형</div>
                    <div className="inp">
                      <select value={content.edgeType} onChange={onChangeContent} name="edgeType">
                        <option value="">-- 선택 --</option>
                        {edgeTypes?.map(item => (
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
                    <div className="inp-tit">상세노출 여부</div>
                    <div className="inp">
                      <FormControl>
                        <RadioGroup
                          row
                          onChange={onChangeContent}
                          aria-labelledby="radio-buttons-group-label"
                          name="exposeDetail"
                          value={content?.exposeDetail ? 'Y' : 'N'}
                        >
                          <FormControlLabel value="Y" control={<Radio />} label="Y" />
                          <FormControlLabel value="N" control={<Radio />} label="N" />
                        </RadioGroup>
                      </FormControl>
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
                  <button className="btn-type1 type6" onClick={() => handleDeleteSkill()}>
                    삭제
                  </button>
                </div>
                <div>
                  {isLoading ? (
                    <></>
                  ) : (
                    <AntdTable
                      loading={isLoading}
                      dataSource={content?.growthEdgeSkills || []}
                      size="small"
                      columns={NECESSARY_SKILL_COLUMNS}
                      pagination={false}
                      rowKey="skillId"
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
            {popupOpen && tabValue === 2 && (
              <div className="layout-grid mt-3">
                <div className={cx('btn-area')}>
                  <button className="btn-type1 type5" onClick={() => setIsModalRegisterOpen(true)}>
                    추가
                  </button>
                  <button className="btn-type1 type6" onClick={() => handleDeleteSkill()}>
                    삭제
                  </button>
                </div>
                <div>
                  {isLoading ? (
                    <></>
                  ) : (
                    <AntdTable
                      loading={isLoading}
                      dataSource={content?.growthEdgeExperiences || []}
                      size="small"
                      columns={NECESSARY_EXPERIENCE_COLUMNS}
                      pagination={false}
                      rowKey="experienceId"
                      rowSelection={{
                        type: 'checkbox',
                        onChange(selectedRowKeys) {
                          setDetailSelectedExperienceRowKeys(selectedRowKeys);
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
        {!isRegisterPopupOpen ? (
          <></>
        ) : (
          <>
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
                  <div className="tit-type2">성장엣지 등록</div>
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
                    필요스킬
                  </a>
                </li>
                <li className={registerTabValue === 2 ? 'on' : ''}>
                  <a href="#" onClick={() => handleTab(2, true)}>
                    필요경험
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                {isRegisterPopupOpen && registerTabValue === 0 && (
                  <div className="layout-grid">
                    <div className="grid-25">
                      <div className="inpwrap">
                        <div className="inp-tit">
                          성장엣지아이디
                          <span className="star">*</span>
                        </div>
                        <div className="inp">
                          <input
                            className="input-admin"
                            type="text"
                            name="edgeId"
                            value={regitserValues.edgeId}
                            onChange={handleRegister}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid-25">
                      <div className="inpwrap">
                        <div className="inp-tit">
                          성장엣지명
                          <span className="star">*</span>
                        </div>
                        <div className="inp">
                          <input
                            className="input-admin"
                            type="text"
                            name="edgeName"
                            value={regitserValues.edgeName}
                            onChange={handleRegister}
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
                            value={regitserValues.description}
                            onChange={handleRegister}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid-25">
                      <div className="inpwrap">
                        <div className="inp-tit">
                          시작노드아이디
                          <span className="star">*</span>
                        </div>
                        <div className="inp">
                          <input
                            className="input-admin"
                            type="text"
                            name="fromNodeId"
                            value={regitserValues.fromNodeId}
                            onChange={handleRegister}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid-25">
                      <div className="inpwrap">
                        <div className="inp-tit">
                          종료노드아이디
                          <span className="star">*</span>
                        </div>
                        <div className="inp">
                          <input
                            className="input-admin"
                            type="text"
                            name="toNodeId"
                            value={regitserValues.toNodeId}
                            onChange={handleRegister}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid-25">
                      <div className="inpwrap">
                        <div className="inp-tit">성장엣지 유형</div>
                        <div className="inp">
                          <select value={regitserValues.edgeType} onChange={handleRegister} name="edgeType">
                            <option value="">-- 선택 --</option>
                            {edgeTypes?.map(item => (
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
                        <div className="inp-tit">상세노출 여부</div>
                        <div className="inp">
                          <FormControl>
                            <RadioGroup
                              row
                              onChange={handleRegister}
                              value={regitserValues?.exposeDetail ? 'Y' : 'N'}
                              aria-labelledby="radio-buttons-group-label"
                              name="exposeDetail"
                            >
                              <FormControlLabel value="Y" control={<Radio />} label="Y" />
                              <FormControlLabel value="N" control={<Radio />} label="N" />
                            </RadioGroup>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className={cx(
                    `${isRegisterPopupOpen && registerTabValue === 1 ? 'skillTab-open' : 'skillTab-close'}`,
                  )}
                >
                  <div className="layout-grid">
                    <div className={cx('btn-area')}>
                      <button className="btn-type1 type5" onClick={() => setIsModalRegisterOpen(true)}>
                        추가
                      </button>
                      <button className="btn-type1 type6" onClick={() => handleDeleteSkill()}>
                        삭제
                      </button>
                    </div>
                    <div>
                      {isLoading ? (
                        <></>
                      ) : (
                        <AntdTable
                          loading={isLoading}
                          dataSource={growthEdgeSkills || []}
                          size="small"
                          columns={NECESSARY_SKILL_COLUMNS}
                          pagination={false}
                          rowKey="skillId"
                          rowSelection={{
                            type: 'checkbox',
                            onChange(selectedRowKeys, selectedRows, info) {
                              setSelectedRowKeys(selectedRowKeys);
                            },
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {isRegisterPopupOpen && registerTabValue === 2 && (
                  <div className="layout-grid mt-3">
                    <div className={cx('btn-area')}>
                      <button className="btn-type1 type5" onClick={() => setIsModalRegisterOpen(true)}>
                        추가
                      </button>
                      <button className="btn-type1 type6" onClick={() => handleDeleteSkill()}>
                        삭제
                      </button>
                    </div>
                    <div>
                      {isLoading ? (
                        <></>
                      ) : (
                        <AntdTable
                          loading={isLoading}
                          dataSource={growthEdgeExperiences || []}
                          size="small"
                          columns={NECESSARY_EXPERIENCE_COLUMNS}
                          pagination={false}
                          rowKey="experienceId"
                          rowSelection={{
                            type: 'checkbox',
                            onChange(selectedRowKeys, selectedRows, info) {
                              setSelectedExperienceRowKeys(selectedRowKeys);
                            },
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <AdminModal
        isOpen={isModalRegisterOpen}
        onAfterClose={() => setIsModalRegisterOpen(false)}
        title={registerTabValue === 1 ? '필요스킬 추가' : '필요경험 추가'}
        maxWidth="700px"
        maxHeight="700px"
      >
        <>
          {isRegisterPopupOpen && registerTabValue === 1 && (
            <div className={cx('')}>
              <div className={cx('modal-body')}>
                <div className={cx('search-row')}>
                  <div className={cx('')}>
                    <label>스킬아이디</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="skillId"
                      value={skillContent.skillId || ''}
                      disabled
                    />
                  </div>
                  <div className={cx('')}>
                    <label className={cx('')}>스킬명</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="skillName"
                      value={skillContent.skillName || ''}
                      disabled
                    />
                    <button className="btn" onClick={() => setIsSearchModal(true)}>
                      <i className="ico i-search"></i>
                    </button>
                  </div>
                </div>
                <div className={cx('recommend-type')}>
                  <label>추천유형</label>
                  <select
                    value={skillContent.edgeRecommendType}
                    onChange={onChangeSkillOrExperienceContent}
                    name="edgeRecommendType"
                  >
                    <option value="">-- 선택 --</option>
                    {edgeRecommendTypes?.map(item => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={cx('modal-footer')}>
                <div className={cx('footer-wrapper')}>
                  <div>
                    <button className="btn-type1 type5" onClick={() => updateSkill()}>
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
          {popupOpen && tabValue === 1 && (
            <div className={cx('')}>
              <div className={cx('modal-body')}>
                <div className={cx('search-row')}>
                  <div className={cx('')}>
                    <label>스킬아이디</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="skillId"
                      value={skillContent.skillId || ''}
                      disabled
                    />
                  </div>
                  <div className={cx('')}>
                    <label className={cx('')}>스킬명</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="skillName"
                      value={skillContent.skillName || ''}
                      disabled
                    />
                    <button className="btn" onClick={() => setIsSearchModal(true)}>
                      <i className="ico i-search"></i>
                    </button>
                  </div>
                </div>
                <div className={cx('recommend-type')}>
                  <label>추천유형</label>
                  <select
                    value={skillContent.edgeRecommendType}
                    onChange={onChangeSkillOrExperienceContent}
                    name="edgeRecommendType"
                  >
                    <option value="">-- 선택 --</option>
                    {edgeRecommendTypes?.map(item => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={cx('modal-footer')}>
                <div className={cx('footer-wrapper')}>
                  <div>
                    <button className="btn-type1 type5" onClick={() => updateSkill()}>
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
          {registerTabValue === 2 && (
            <div className={cx('')}>
              <div className={cx('modal-body')}>
                <div className={cx('search-row')}>
                  <div className={cx('')}>
                    <label>경험아이디</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="experienceId"
                      value={experienceContent.experienceId || ''}
                      disabled
                    />
                  </div>
                  <div className={cx('')}>
                    <label className={cx('')}>경험명</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="experienceName"
                      value={experienceContent.experienceName || ''}
                      disabled
                    />
                    <button className="btn" onClick={() => setIsSearchModal(true)}>
                      <i className="ico i-search"></i>
                    </button>
                  </div>
                </div>
                <div className={cx('recommend-type')}>
                  <label>추천유형</label>
                  <select
                    value={experienceContent.edgeRecommendType}
                    onChange={onChangeSkillOrExperienceContent}
                    name="edgeRecommendType"
                  >
                    <option value="">-- 선택 --</option>
                    {edgeRecommendTypes?.map(item => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={cx('modal-footer')}>
                <div className={cx('footer-wrapper')}>
                  <div>
                    <button className="btn-type1 type5" onClick={() => updateExperience()}>
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
          {popupOpen && tabValue === 2 && (
            <div className={cx('')}>
              <div className={cx('modal-body')}>
                <div className={cx('search-row')}>
                  <div className={cx('')}>
                    <label>경험아이디</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="experienceId"
                      value={experienceContent.experienceId || ''}
                      disabled
                    />
                  </div>
                  <div className={cx('')}>
                    <label className={cx('')}>경험명</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="experienceName"
                      value={experienceContent.experienceName || ''}
                      disabled
                    />
                    <button className="btn" onClick={() => setIsSearchModal(true)}>
                      <i className="ico i-search"></i>
                    </button>
                  </div>
                </div>
                <div className={cx('recommend-type')}>
                  <label>추천유형</label>
                  <select
                    value={experienceContent.edgeRecommendType}
                    onChange={onChangeSkillOrExperienceContent}
                    name="edgeRecommendType"
                  >
                    <option value="">-- 선택 --</option>
                    {edgeRecommendTypes?.map(item => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={cx('modal-footer')}>
                <div className={cx('footer-wrapper')}>
                  <div>
                    <button className="btn-type1 type5" onClick={() => updateExperience()}>
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
        title={registerTabValue === 1 ? '필요스킬 검색' : '필요경험 검색'}
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
                  onChange={e => setSearchSkill(e.target.value)}
                />
                <button className="btn-type1 type5" onClick={() => handleSearchSkill()}>
                  검색
                </button>
              </div>
              <div className={cx('table')}>
                <AntdTable
                  dataSource={skillsList?.data}
                  columns={columns}
                  size="small"
                  pagination={{
                    defaultCurrent: 1,
                    total: skillsList?.totalPage,
                    showSizeChanger: false,
                    current: page,
                    pageSize: size,
                    position: ['bottomCenter'],
                    onChange(page, pageSize) {
                      setPage(page);
                      setSize(pageSize);
                    },
                  }}
                  rowKey="skillId"
                  rowSelection={{
                    type: 'radio',
                    onChange: (_, selectedRows) => {
                      setSkillContent(selectedRows[0]);
                      setIsSearchModal(false);
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
                  onChange={e => setSearchSkill(e.target.value)}
                />
                <button className="btn-type1 type5" onClick={() => handleSearchSkill()}>
                  검색
                </button>
              </div>
              <div className={cx('table')}>
                <AntdTable
                  dataSource={skillsList?.data}
                  columns={columns}
                  size="small"
                  pagination={{
                    defaultCurrent: 1,
                    total: skillsList?.totalPage,
                    showSizeChanger: false,
                    current: page,
                    pageSize: size,
                    position: ['bottomCenter'],
                    onChange(page, pageSize) {
                      setPage(page);
                      setSize(pageSize);
                    },
                  }}
                  rowKey="skillId"
                  rowSelection={{
                    type: 'radio',
                    onChange: (_, selectedRows) => {
                      setSkillContent(selectedRows[0]);
                      setIsSearchModal(false);
                    },
                  }}
                />
              </div>
            </div>
          )}
          {isRegisterPopupOpen && registerTabValue === 2 && (
            <div className={cx('modal-content')}>
              <div className={cx('searchKeyword')}>
                <input
                  type="text"
                  className="input-admin"
                  name="searchKeyword"
                  onChange={e => setSearchExperience(e.target.value)}
                />
                <button className="btn-type1 type5" onClick={() => handleSearchExperience()}>
                  검색
                </button>
              </div>
              <div className={cx('table')}>
                <AntdTable
                  dataSource={experienceList?.data}
                  columns={EXPERIENCE_COLUMNS}
                  size="small"
                  pagination={{
                    defaultCurrent: 1,
                    total: experienceList?.totalPage,
                    showSizeChanger: false,
                    current: page,
                    pageSize: size,
                    position: ['bottomCenter'],
                    onChange(page, pageSize) {
                      setPage(page);
                      setSize(pageSize);
                    },
                  }}
                  rowKey="experienceId"
                  rowSelection={{
                    type: 'radio',
                    onChange: (_, selectedRows) => {
                      setExperienceContent(selectedRows[0]);
                      setIsSearchModal(false);
                    },
                  }}
                />
              </div>
            </div>
          )}
          {popupOpen && tabValue === 2 && (
            <div className={cx('modal-content')}>
              <div className={cx('searchKeyword')}>
                <input
                  type="text"
                  className="input-admin"
                  name="searchKeyword"
                  onChange={e => setSearchExperience(e.target.value)}
                />
                <button className="btn-type1 type5" onClick={() => handleSearchExperience()}>
                  검색
                </button>
              </div>
              <div className={cx('table')}>
                <AntdTable
                  dataSource={experienceList?.data}
                  columns={EXPERIENCE_COLUMNS}
                  size="small"
                  pagination={{
                    defaultCurrent: 1,
                    total: experienceList?.totalPage,
                    showSizeChanger: false,
                    current: page,
                    pageSize: size,
                    position: ['bottomCenter'],
                    onChange(page, pageSize) {
                      setPage(page);
                      setSize(pageSize);
                    },
                  }}
                  rowKey="experienceId"
                  rowSelection={{
                    type: 'radio',
                    onChange: (_, selectedRows) => {
                      setExperienceContent(selectedRows[0]);
                      setIsSearchModal(false);
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

export default GrowthEdgeTemplate;

const columns = [
  {
    title: '스킬아이디',
    dataIndex: 'skillId',
    key: 'skillId',
  },
  {
    title: '스킬명',
    dataIndex: 'skillName',
    key: 'skillName',
  },
];

const EXPERIENCE_COLUMNS = [
  {
    title: '경험아이디',
    dataIndex: 'experienceId',
    key: 'experienceId',
  },
  {
    title: '경험명',
    dataIndex: 'experienceName',
    key: 'experienceName',
  },
];

const NECESSARY_SKILL_COLUMNS = [
  {
    title: '스킬아이디',
    dataIndex: 'skillId',
    key: 'skillId',
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: '스킬명',
    dataIndex: 'skillName',
    key: 'skillName',
  },
  {
    title: '추천유형',
    dataIndex: 'edgeRecommendType',
    key: 'edgeRecommendType',
  },
];

const NECESSARY_EXPERIENCE_COLUMNS = [
  {
    title: '경험아이디',
    dataIndex: 'experienceId',
    key: 'experienceId',
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: '경험명',
    dataIndex: 'experienceName',
    key: 'experienceName',
  },
  {
    title: '추천유형',
    dataIndex: 'edgeRecommendType',
    key: 'edgeRecommendType',
  },
];
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
