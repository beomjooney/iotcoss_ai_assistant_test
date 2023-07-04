import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { useCodeList, useJobGroups, useJobs } from 'src/services/code/code.queries';
import { AdminPagination, Table, Toggle, SmartFilter, Button } from 'src/stories/components';
import { useUploadImage } from 'src/services/image/image.mutations';

const cx = classNames.bind(styles);

interface ExperienceListProps {
  onSearch?: () => void;
  onDelete?: (memberId: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  experienceList?: any;
  pageProps?: any;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

export function ExperienceList({ onSearch, onDelete, onSave, onAdd, pageProps, experienceList }: ExperienceListProps) {
  const { data: codeList } = useCodeList('');
  const { data: jobgroup, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: jobs } = useJobs();
  const [content, setContent] = useState<any>({});
  const [regitserValues, setRegisterValues] = useState<any>({});
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [tempImageUrl1, setTempImageUrl1] = useState(null);

  const COLGROUP = ['5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%'];
  const HEADS = ['경험명', '설명', '이미지URL', '연관직군들', '연관직무들', '연관레벨들', '트렌드레벨', '활성화레벨'];

  const { mutate: onSaveImage, data: imageUrl1 } = useUploadImage();

  const handleSave = () => {
    const params = {
      ...content,
      imageUrl: imageUrl1?.toString()?.slice(1) || content?.imageUrl,
    };
    onSave && onSave(params);
    setIsEdit(false);
    setContent({});
  };

  const onShowPopup = (id: string) => {
    const result = experienceList?.data?.find(item => item?.experienceId === id);
    setContent(result);
    setPopupOpen(true);
  };

  const handleSearchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setSearchKeyword(value);
  };

  const onSmartFilterSearch = (params: any) => {
    onSearch && onSearch();
  };

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

  const handleCheckboxChange = (e, key) => {
    const { value, checked } = e.target;
    if (popupOpen) {
      const temp = new Set(content[key]);
      const isNumberType = key === 'recommendLevels';
      if (checked) temp.add(isNumberType ? parseInt(value) : value);
      else temp.delete(value);
      setContent({ ...content, [key]: [...temp] });
    } else {
      const temp = new Set(regitserValues[key]);
      const isNumberType = key === 'recommendLevels';
      if (checked) temp.add(isNumberType ? parseInt(value) : value);
      else temp.delete(value);
      setRegisterValues({ ...regitserValues, [key]: [...temp] });
    }
  };

  const readFile = (file, key) => {
    const reader = new FileReader();
    reader.onload = e => {
      const image = e.target.result;
      onSaveImage(file);
      setTempImageUrl1(image);
    };
    reader.readAsDataURL(file);
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
          {imageUrl && <img src={imageUrl} alt={title} />}
          {isEdit && (
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
          )}
        </div>
      </div>
    );
  };

  const FIELDS = [{ name: '코드 그룹', field: 'id', type: 'choice', data: codeList }];

  return (
    <div className="content">
      <h2 className="tit-type1">경험</h2>
      <div className="path">
        <span>Home</span> <span>경험 목록</span>
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
                onKeyDown={event => onSearch && event.key === 'Enter' && onSearch()}
              />
              <button className="btn" onClick={() => onSearch && onSearch()}>
                <i className="ico i-search"></i>
              </button>
            </div>
          </div>
          <button className="btn-type1 type3" onClick={() => setIsFilter(!isFilter)}>
            <i className="ico i-filter"></i>
            <span>필터</span>
          </button>
        </div>
        {/* <SmartFilter name="skillsFilter" fields={FIELDS} isFilterOpen={isFilter} onSearch={onSmartFilterSearch} /> */}
      </div>
      <div className="data-type1" data-evt="main-table-on">
        <Table
          name="content"
          colgroup={COLGROUP}
          heads={HEADS}
          items={experienceList?.data?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.experienceId)}>
                <td className="magic" title={item.experienceName}>
                  {item.experienceName}
                </td>
                <td className="magic" title={item.description}>
                  {item.description}
                </td>
                <td className="magic" title={item.imageUrl}>
                  {item.imageUrl}
                </td>
                <td className="magic" title={item.relatedJobGroupNames}>
                  {item.relatedJobGroupNames?.join(',')}
                </td>
                <td className="magic" title={item.relatedJobNames}>
                  {item.relatedJobNames?.join(',')}
                </td>
                <td className="magic" title={item.relatedLevels}>
                  {item.relatedLevels?.join(',')}
                </td>
                <td className="magic" title={item.trendLevel}>
                  {item.trendLevel}
                </td>
                <td className="magic" title={item.activeLevel}>
                  {item.activeLevel}
                </td>
              </tr>
            );
          })}
          isEmpty={experienceList?.data?.length === 0 || false}
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
              <div className="tit-type2">경험 상세보기</div>
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
                    onDelete && onDelete(content.experienceId);
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
                  <div className="inp-tit">경험 아이디</div>
                  <div className="inp">
                    <input
                      type="text"
                      className="input-admin"
                      name="experienceId"
                      value={content?.experienceId || ''}
                      onChange={onChangeContent}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">경험명</div>
                  <div className="inp">
                    <input
                      className="input-admin"
                      type="text"
                      name="experienceName"
                      value={content?.experienceName || ''}
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
              <div className="grid-25">
                <div className="inpwrap">
                  <div className="inp-tit">이미지URL</div>
                  <div className="inp">
                    <input
                      className="input-admin"
                      type="text"
                      name="imageUrl"
                      disabled={!isEdit}
                      onChange={onChangeContent}
                      value={content?.imageUrl || ''}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-100 mt-3">
                <div className="inpwrap">
                  <div className="inp-tit">연관 직군들</div>
                  <div className="inp">
                    {isJobGroupFetched &&
                      jobgroup?.map(item => {
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
                              className={cx('seminar-jobgroup-area')}
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
                        <span key={item.id} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                          <Toggle
                            isActive
                            label={item.name}
                            name="relatedJobs"
                            type="checkBox"
                            checked={isIncludeContent}
                            value={item.id}
                            key={item.id}
                            className={cx('seminar-jobgroup-area')}
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
                  <div className="inp-tit">연관 레벨들</div>
                  <div className="inp">
                    {levelInfo.map(item => {
                      let isIncludeContent = false;
                      if (content?.relatedLevels?.includes(item.level)) {
                        isIncludeContent = true;
                      }
                      return (
                        <span
                          key={item.level}
                          className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}
                        >
                          <Toggle
                            isActive
                            label={`${item.level}레벨`}
                            name="relatedLevels"
                            checked={isIncludeContent}
                            disabled={!isEdit}
                            type="checkBox"
                            value={item.level}
                            onChange={e => handleCheckboxChange(e, 'relatedLevels')}
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">트렌드 레벨</div>
                <div className="inp">
                  <select value={content.trendLevel} onChange={onChangeContent} name="trendLevel" disabled={!isEdit}>
                    <option value="">-- 선택 --</option>
                    {trendLevel?.map(item => (
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
                <div className="inp-tit">활성화 레벨</div>
                <div className="inp">
                  <select value={content.activeLevel} onChange={onChangeContent} name="activeLevel" disabled={!isEdit}>
                    <option value="">-- 선택 --</option>
                    {activeLevel?.map(item => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
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
              <div className="tit-type2">경험 등록</div>
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
                <div className="inp-tit">경험아이디</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="experienceId"
                    value={regitserValues?.experienceId || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">경험명</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="experienceName"
                    value={regitserValues?.experienceName || ''}
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
                <div className="inp-tit">이미지URL</div>
                <div className="inp">
                  <input
                    className="input-admin"
                    type="text"
                    name="imageUrl"
                    onChange={handleRegister}
                    value={regitserValues?.imageUrl || ''}
                  />
                </div>
              </div>
            </div>
            <div className="grid-100 mt-3">
              <div className="inpwrap">
                <div className="inp-tit">연관 직군들</div>
                <div className="inp">
                  {isJobGroupFetched &&
                    jobgroup?.map(item => {
                      let isIncludeContent = false;
                      if (regitserValues?.relatedJobGroups?.includes(item.id)) {
                        isIncludeContent = true;
                      }
                      return (
                        <span key={item.id} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                          {isRegisterPopupOpen ? (
                            <Toggle
                              isActive
                              label={item.name}
                              name="relatedJobGroups"
                              type="checkBox"
                              value={item.id}
                              key={item.id}
                              className={cx('seminar-jobgroup-area')}
                              onChange={e => handleCheckboxChange(e, 'relatedJobGroups')}
                            />
                          ) : (
                            <></>
                          )}
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
                      <span key={item.id} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                        {isRegisterPopupOpen ? (
                          <Toggle
                            isActive
                            label={item.name}
                            name="relatedJobs"
                            type="checkBox"
                            value={item.id}
                            key={item.id}
                            className={cx('seminar-jobgroup-area')}
                            onChange={e => handleCheckboxChange(e, 'relatedJobs')}
                          />
                        ) : (
                          <></>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="grid-100 mt-3">
              <div className="inpwrap">
                <div className="inp-tit">연관 레벨들</div>
                <div className="inp">
                  {levelInfo.map(item => {
                    let isIncludeContent = false;
                    if (regitserValues?.relatedLevels?.includes(item.level)) {
                      isIncludeContent = true;
                    }
                    return (
                      <span key={item.level} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                        {isRegisterPopupOpen ? (
                          <Toggle
                            isActive
                            label={`${item.level}레벨`}
                            name="relatedLevels"
                            type="checkBox"
                            value={item.level}
                            onChange={e => handleCheckboxChange(e, 'relatedLevels')}
                          />
                        ) : (
                          <></>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">트렌드 레벨</div>
                <div className="inp">
                  {isRegisterPopupOpen ? (
                    <select value={regitserValues.trendLevel} onChange={handleRegister} name="trendLevel">
                      <option value="">-- 선택 --</option>
                      {trendLevel?.map(item => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">트렌드 레벨</div>
                <div className="inp">
                  {isRegisterPopupOpen ? (
                    <select value={regitserValues.activeLevel} onChange={handleRegister} name="activeLevel">
                      <option value="">-- 선택 --</option>
                      {activeLevel?.map(item => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExperienceList;

const levelInfo = [{ level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }, { level: 5 }];
const trendLevel = [
  {
    name: '급하락',
    id: 1,
  },
  {
    name: '하락',
    id: 2,
  },
  {
    name: '일반',
    id: 3,
  },
  {
    name: '상승',
    id: 4,
  },
  {
    name: '급상승',
    id: 5,
  },
];
const activeLevel = [
  {
    name: '신생',
    id: 1,
  },
  {
    name: '일부사용',
    id: 2,
  },
  {
    name: '일반',
    id: 3,
  },
  {
    name: '범용',
    id: 4,
  },
  {
    name: '대세',
    id: 5,
  },
];
