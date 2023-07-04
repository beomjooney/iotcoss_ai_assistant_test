import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { Table as AntdTable } from 'antd';
import { AdminPagination, Table, SmartFilter, AdminModal, Toggle } from 'src/stories/components';
import { SearchParamsProps } from 'pages/admin/contents/camenity';
import { useReplies } from 'src/services/admin/camenity/camenity.queries';
import dayjs from 'dayjs';
import { useJobGroups } from 'src/services/code/code.queries';

const cx = classNames.bind(styles);

interface CamenityTemplateProps {
  onSearch?: (searchKeyword: SearchParamsProps) => void;
  onDelete?: (memberId: string) => void;
  onSave?: (data: any) => void;
  onAdd?: (data: any) => void;
  camenitiesList?: any;
  pageProps?: any;
  params?: SearchParamsProps;
  setParams?: React.Dispatch<React.SetStateAction<SearchParamsProps>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

export function CamenityTemplate({
  onSearch,
  onDelete,
  onSave,
  onAdd,
  params,
  pageProps,
  camenitiesList,
}: CamenityTemplateProps) {
  const [postNo, setPostNo] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [basicInfo, setBasicInfo] = useState<any>({});
  const [isEditReaction, setIsEditReaction] = useState<boolean>(false);
  const [isEditReply, setIsEditReply] = useState<boolean>(false);
  const [reply, setReply] = useState<any>({});
  const [reaction, setReaction] = useState<any>({});
  const { data: jobgroup, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: replies } = useReplies(
    paramsWithDefault({
      page: page,
      size: size,
      postNo,
    }),
    data => {
      setBasicInfo(data?.data);
    },
  );
  const [regitserValues, setRegisterValues] = useState<any>({});
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [registerTabValue, setRegisterTabValue] = useState<number>(0);
  const [tabValue, setTabValue] = useState<number>(0);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState<boolean>(false);

  const COLGROUP = ['5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%'];
  const HEADS = [
    '포스트번호',
    '포스트분류',
    '제목',
    '댓글수',
    '키워드들',
    '작성자아이디',
    '연관직군들',
    '연관레벨들',
    '등록일시',
    '수정일시',
  ];

  const onChangeContent = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;

    const data = {
      [name]: value,
    };
    setBasicInfo({
      ...basicInfo,
      ...data,
    });
  };

  const onShowPopup = (id: string) => {
    setPostNo(id);
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
      let params = { ...basicInfo };
      onSave && onSave(params);
    }
  };

  const handleOnAdd = () => {
    if (confirm('저장하시겠습니까?')) {
      let params = { ...basicInfo };
      params = {
        ...regitserValues,
        keywords: regitserValues?.keywords ? regitserValues?.keywords.split(',') : [''],
      };
      onAdd && onAdd(params);
    }
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

  const FIELDS = [
    { name: '포스트번호', field: 'postNo', type: 'text' },
    { name: '포스트분류', field: 'postCategory', type: 'text' },
    { name: '제목', field: 'title', type: 'text' },
    { name: '포스트상태', field: 'postStatus', type: 'text' },
    { name: '작성자아이디', field: 'authorId', type: 'text' },
    { name: '키워드들', field: 'keyword', type: 'text' },
    { name: '댓글수', field: 'replyCount', type: 'text' },
    { name: '좋아요수', field: 'likeReactionCount', type: 'text' },
    { name: '연관레벨들', field: 'relatedLevels', type: 'text' },
    { name: '연관직군들', field: 'relatedJobGroups', type: 'choice', data: jobgroup || [] },
  ];

  const handleCheckboxChange = (e, key) => {
    const { value, checked } = e.target;
    if (popupOpen) {
      const temp = new Set(basicInfo[key]);
      const isNumberType = key === 'recommendLevels';
      if (checked) temp.add(isNumberType ? parseInt(value) : value);
      else temp.delete(value);
      setBasicInfo({ ...basicInfo, [key]: [...temp] });
    } else {
      const temp = new Set(regitserValues[key]);
      const isNumberType = key === 'recommendLevels';
      if (checked) temp.add(isNumberType ? parseInt(value) : value);
      else temp.delete(value);
      setRegisterValues({ ...regitserValues, [key]: [...temp] });
    }
  };

  const onChangeReply = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;

    const data = {
      [name]: value,
    };
    setReply({
      ...reply,
      ...data,
    });
  };

  const onChangeReaction = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;

    const data = {
      [name]: value,
    };
    setReaction({
      ...reaction,
      ...data,
    });
  };

  const handleModifyReply = () => {
    setIsLoading(true);
    const postReplies = basicInfo?.postReplies;
    const index = postReplies?.findIndex(item => item?.postReplyNo === reply?.postReplyNo);
    postReplies[index] = reply;
    setBasicInfo({ ...basicInfo, postReplies });
    setIsEditReply(false);
    setTimeout(() => setIsLoading(false), 3);
  };

  const handleModifyReaction = () => {
    setIsLoading(true);
    const postReactions = basicInfo?.postReactions;
    const index = postReactions?.findIndex(item => item?.reactionNo === reply?.reactionNo);
    postReactions[index] = reply;
    setBasicInfo({ ...basicInfo, postReactions });
    setIsEditReaction(false);
    setTimeout(() => setIsLoading(false), 3);
  };

  const handleDeleteReaction = () => {
    setIsLoading(true);
    const postReactions = basicInfo?.postReactions;
    const index = postReactions?.findIndex(item => item?.reactionNo === reply?.reactionNo);
    postReactions.splice(index, 1);
    setBasicInfo({ ...basicInfo, postReactions });
    setTimeout(() => setIsLoading(false), 3);
  };

  const handleDeleteReply = () => {
    setIsLoading(true);
    const postReplies = basicInfo?.postReplies;
    const index = postReplies?.findIndex(item => item?.postReplyNo === reply?.postReplyNo);
    postReplies.splice(index, 1);
    setBasicInfo({ ...basicInfo, postReplies });
    setTimeout(() => setIsLoading(false), 3);
  };

  return (
    <div className="content">
      <h2 className="tit-type1">커멘니티</h2>
      <div className="path">
        <span>Home</span> <span>커멘니티 목록</span>
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
          items={camenitiesList?.data?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={() => onShowPopup(item.postNo)}>
                <td className="magic" title={item.postNo}>
                  {item.postNo}
                </td>
                <td className="magic" title={item.postCategoryName}>
                  {item.postCategoryName}
                </td>
                <td className="magic" title={item?.title}>
                  {item?.title}
                </td>
                <td className="magic" title={item?.replyCount}>
                  {item?.replyCount}
                </td>
                <td className="magic" title={item?.keywords?.join('')}>
                  {item?.keywords?.join('')}
                </td>
                <td className="magic" title={item?.author?.memberId}>
                  {item?.author?.memberId}
                </td>

                <td className="magic" title={item?.relatedJobGroupNames?.join('')}>
                  {item?.relatedJobGroupNames?.join(',')}
                </td>
                <td className="magic" title={item?.relatedLevels?.join('')}>
                  {item?.relatedLevels?.join(', ')}
                </td>
                <td className="magic" title={dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
                <td className="magic" title={dayjs(item?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
          isEmpty={camenitiesList?.data?.length === 0 || false}
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
              <div className="tit-type2">커멘니티 상세보기</div>
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
                    onDelete && onDelete(basicInfo?.postNo);
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
                댓글
              </a>
            </li>
            <li className={tabValue === 2 ? 'on' : ''}>
              <a href="#" onClick={() => handleTab(2)}>
                리액션
              </a>
            </li>
          </ul>
          <div className="tab-content">
            {popupOpen && tabValue === 0 && (
              <div className="layout-grid">
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      제목
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="title"
                        value={basicInfo.title || ''}
                        onChange={onChangeContent}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      내용
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="body"
                        value={basicInfo.body || ''}
                        onChange={onChangeContent}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">키워드들</div>
                    <div className="inp">
                      <input
                        type="text"
                        className="input-admin"
                        name="keywords"
                        value={basicInfo?.keywords || ''}
                        onChange={onChangeContent}
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
                          if (basicInfo?.relatedJobGroups?.includes(item.id)) {
                            isIncludeContent = true;
                          }
                          return (
                            <span
                              key={item.id}
                              className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}
                            >
                              {popupOpen ? (
                                <Toggle
                                  isActive
                                  label={item.name}
                                  name="relatedJobGroups"
                                  checked={isIncludeContent || false}
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
                    <div className="inp-tit">연관 레벨들</div>
                    <div className="inp">
                      {levelInfo.map(item => {
                        let isIncludeContent = false;
                        if (basicInfo?.relatedLevels?.includes(item.level)) {
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
                              checked={isIncludeContent || false}
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
            )}
            {popupOpen && tabValue === 1 && (
              <div className="layout-grid">
                <div className={cx('btn-area')}>
                  <button className="btn-type1 type6" onClick={() => handleDeleteReply()}>
                    삭제
                  </button>
                </div>
                <div>
                  {isLoading ? (
                    <></>
                  ) : (
                    <AntdTable
                      loading={isLoading}
                      dataSource={basicInfo?.postReplies || []}
                      size="small"
                      columns={NECESSARY_REPLY_COLUMNS}
                      pagination={false}
                      rowKey="postReplyNo"
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: event => {
                            setIsEditReply(true);
                            setReply(record);
                          },
                        };
                      }}
                    />
                  )}
                </div>
              </div>
            )}
            {popupOpen && tabValue === 2 && (
              <div className="layout-grid mt-3">
                <div className={cx('btn-area')}>
                  <button className="btn-type1 type6" onClick={() => handleDeleteReaction()}>
                    삭제
                  </button>
                </div>
                <div>
                  {isLoading ? (
                    <></>
                  ) : (
                    <AntdTable
                      loading={isLoading}
                      dataSource={basicInfo?.postReactions || []}
                      size="small"
                      columns={NECESSARY_REACTION_COLUMNS}
                      pagination={false}
                      rowKey="reactionNo"
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: event => {
                            setIsEditReaction(true);
                            setReaction(record);
                          },
                        };
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
              <div className="tit-type2">포스트 등록</div>
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
                <div className="inp-tit">포스트분류</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="postCategory"
                    value={regitserValues?.postCategory || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">제목</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="title"
                    value={regitserValues?.title || ''}
                    onChange={handleRegister}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">내용</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="body"
                    onChange={handleRegister}
                    value={regitserValues?.body || ''}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25">
              <div className="inpwrap">
                <div className="inp-tit">키워드들</div>
                <div className="inp">
                  <input
                    type="text"
                    className="input-admin"
                    name="keywords"
                    value={regitserValues?.keywords || ''}
                    onChange={handleRegister}
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
                <div className="inp-tit">연관 레벨들</div>
                <div className="inp">
                  {levelInfo.map(item => {
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
          </div>
        </div>
      </div>
      <>
        <AdminModal
          isOpen={isEditReaction}
          onAfterClose={() => setIsEditReaction(false)}
          title="리액션 수정"
          maxWidth="600px"
          maxHeight="700px"
        >
          <div className={cx('')}>
            <div className={cx('modal-body')}>
              <div className={cx('first-row')}>
                <div className={cx('first-row__wrapper')}>
                  <div className={cx('first-row__wrapper__col')}>
                    <label>리액션번호</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="reactionNo"
                      value={reaction?.reactionNo}
                      disabled
                    />
                  </div>
                </div>
                <div className={cx('first-row__wrapper')}>
                  <div className={cx('first-row__wrapper__col')}>
                    <label>회원아이디</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="reactionMemberId"
                      value={reaction?.reactionMemberId}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className={cx('second-row')}>
                <div className={cx('second-row__wrapper')}>
                  <div className={cx('second-row__wrapper__col')}>
                    <label>리액션코드</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="reactionCode"
                      value={reaction?.reactionCode}
                      onChange={onChangeReaction}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={cx('modal-footer')}>
              <div className={cx('footer-wrapper')}>
                <div>
                  <button className="btn-type1 type5" onClick={() => handleModifyReaction}>
                    수정
                  </button>
                  <button className="btn-type1 type6" onClick={() => setIsModalRegisterOpen(false)}>
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AdminModal>
        <AdminModal
          isOpen={isEditReply}
          onAfterClose={() => setIsEditReply(false)}
          title="댓글 수정"
          maxWidth="600px"
          maxHeight="700px"
        >
          <div className={cx('')}>
            <div className={cx('modal-body')}>
              <div className={cx('first-row')}>
                <div className={cx('first-row__wrapper')}>
                  <div className={cx('first-row__wrapper__col')}>
                    <label>댓글번호</label>
                    <input type="text" className="input-admin" name="postReplyNo" value={reply?.postReplyNo} disabled />
                  </div>
                </div>
                <div className={cx('first-row__wrapper')}>
                  <div className={cx('first-row__wrapper__col')}>
                    <label>사용자아이디</label>
                    <input type="text" className="input-admin" name="authorId" value={reply?.authorId} disabled />
                  </div>
                </div>
              </div>
              <div className={cx('second-row')}>
                <div className={cx('second-row__wrapper')}>
                  <div className={cx('second-row__wrapper__col')}>
                    <label>내용</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="body"
                      value={reply?.body}
                      onChange={onChangeReply}
                    />
                  </div>
                  <div className={cx('second-row__wrapper__col')}>
                    <label>댓글상태</label>
                    <input
                      type="text"
                      className="input-admin"
                      name="postReplyStatus"
                      value={reply?.postReplyStatus}
                      onChange={onChangeReply}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={cx('modal-footer')}>
              <div className={cx('footer-wrapper')}>
                <div>
                  <button className="btn-type1 type5" onClick={handleModifyReply}>
                    수정
                  </button>
                  <button className="btn-type1 type6" onClick={() => setIsModalRegisterOpen(false)}>
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AdminModal>
      </>
    </div>
  );
}

export default CamenityTemplate;

const NECESSARY_REPLY_COLUMNS = [
  {
    title: '댓글번호',
    dataIndex: 'postReplyNo',
    key: 'postReplyNo',
    align: 'center',
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: '작성아이디',
    dataIndex: 'authorId',
    key: 'authorId',
    align: 'center',
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: '내용',
    dataIndex: 'body',
    key: 'body',
    align: 'center',
  },
  {
    title: '댓글상태',
    dataIndex: 'postReplyStatusName',
    key: 'postReplyStatusName',
    align: 'center',
  },
] as any;

const NECESSARY_REACTION_COLUMNS = [
  {
    title: '리액션번호',
    dataIndex: 'reactionNo',
    key: 'reactionNo',
    align: 'center',
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: '리액션회원아이디',
    dataIndex: 'authorId',
    key: 'authorId',
    align: 'center',
    render: (text, record) => <div>{record?.author?.memberId}</div>,
  },
  {
    title: '리액션코드',
    dataIndex: 'reactionCode',
    key: 'reactionCode',
    align: 'center',
  },
] as any;
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

const levelInfo = [{ level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }, { level: 5 }];
