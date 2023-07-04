import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { AdminPagination, Table, SmartFilter } from '../../../stories/components';
import MentoringDetailTemplate from '../../Mentoring/Detail';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

interface MentorsTemplateProps {
  mentorList?: any;
  mentorData?: any;
  pageProps?: any;
  onMentorInfo?: (memberId: string) => void;
  onSearch?: (searchKeyword: string) => void;
  onMentorApprove?: (params: any) => void;
  onMentorReject?: (params: any) => void;
  onCertification?: (params: any) => void;
}

export function MentorsTemplate({
  mentorList,
  mentorData,
  onMentorInfo,
  pageProps,
  onSearch,
  onMentorApprove,
  onMentorReject,
  onCertification,
}: MentorsTemplateProps) {
  const COLGROUP = ['8%', '5%', '5%', '8%', '5%', '7%', '5%', '5%', '8%', '5%', '5%', '7%', 'auto'];
  const HEADS = [
    '회원아이디',
    '회원명',
    '닉네임',
    '이메일',
    '연령대',
    '회원유형',
    '직군유형',
    '레벨',
    '인증제공기관',
    '이메일수신여부',
    '문자수신여부',
    '수정일시',
    '멘토거절/멘토승인/멘토인증',
  ];

  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [mentorStory, setMentorStory] = useState<any>({});
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  useEffect(() => {
    mentorData && setMentorStory(mentorData);
  }, [mentorData]);

  const onShowPopup = (event, mentorUri: string) => {
    const { name } = event.target;
    if (!name) {
      onMentorInfo && onMentorInfo(mentorUri);
      setPopupOpen(true);
    }
  };

  const handleSearchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setSearchKeyword(value);
  };

  const handleApprove = (mentorId: string) => {
    onMentorApprove && onMentorApprove(mentorId);
  };

  const handleReject = (mentorId: string) => {
    onMentorReject && onMentorReject(mentorId);
  };

  const handleCertification = (mentorId: string) => {
    onCertification && onCertification(mentorId);
  };

  return (
    <div className="content">
      <h2 className="tit-type1">멘토 신청관리</h2>
      <div className="path">
        <span>Home</span> <span>멘토 신청 목록</span>
      </div>
      <div className="data-top">
        <div className="left"></div>
        <div className="right">
          <div className="inpwrap">
            <div className="inp search">
              <input
                type="text"
                className="input-admin"
                placeholder="검색어"
                onChange={handleSearchKeyword}
                value={searchKeyword}
                onKeyDown={event => onSearch && event.key === 'Enter' && onSearch(searchKeyword)}
              />
              <button className="btn" onClick={() => onSearch && onSearch(searchKeyword)}>
                <i className="ico i-search"></i>
              </button>
            </div>
          </div>
          {/*<button className="btn-type1 type3" onClick={() => setIsFilter(!isFilter)}>*/}
          {/*  <i className="ico i-filter"></i>*/}
          {/*  <span>필터</span>*/}
          {/*</button>*/}
        </div>
        {/*<SmartFilter name="memberFilter" isFilterOpen={isFilter} />*/}
      </div>
      <div className="data-type1" data-evt="main-table-on">
        <Table
          name="member"
          colgroup={COLGROUP}
          heads={HEADS}
          items={mentorList?.data?.map((item, index) => {
            return (
              <tr key={`tr-${index}`} onClick={event => onShowPopup(event, item.memberUri)}>
                <td className="magic" title={item.memberId}>
                  {item.memberId}
                </td>
                <td className="magic" title={item.name}>
                  {item.name}
                </td>
                <td className="magic" title={item.nickname}>
                  {item.nickname}
                </td>
                <td className="magic" title={item.email}>
                  {item.email}
                </td>
                <td className="magic" title={item.ageRange}>
                  {item.ageRange}
                </td>
                <td className="magic" title={item.typeName}>
                  {item.typeName}
                </td>
                <td className="magic" title={item.jobGroupName}>
                  {item.jobGroupName}
                </td>
                <td className="magic" title={item.level}>
                  {item.level}
                </td>
                <td className="magic" title={item?.authProviderName}>
                  {item?.authProviderName}
                </td>
                <td className="magic" title={item.emailReceiveYn ? 'Y' : 'N'}>
                  {item.emailReceiveYn ? 'Y' : 'N'}
                </td>
                <td className="magic" title={item.smsReceiveYn ? 'Y' : 'N'}>
                  {item.smsReceiveYn ? 'Y' : 'N'}
                </td>
                <td className="magic" title={dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </td>
                <td>
                  {item.type !== '0004' && (
                    <>
                      <button className="btn-type1 type2" name="reject" onClick={() => handleReject(item.memberId)}>
                        거절
                      </button>
                      <button className="btn-type1 type1" name="approve" onClick={() => handleApprove(item.memberId)}>
                        승인
                      </button>
                    </>
                  )}
                  {!item.authenticatedYn && (
                    <button
                      className="btn-type1 type1"
                      name="certification"
                      onClick={() => handleCertification(item.memberId)}
                    >
                      인증
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
          isEmpty={mentorList?.data?.length === 0 || false}
        />
        <AdminPagination {...pageProps} />
      </div>
      <div className={cx('side-layer', popupOpen ? 'open' : '')}>
        <div className="dim"></div>
        <div className="side-contents" style={{ width: '1200px' }}>
          <div className="layer-top">
            <div className="left" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: 30, marginRight: 30 }}>
                <a href="#" onClick={() => setPopupOpen(false)}>
                  <i className="ico i-x"></i>
                </a>
              </div>
              <div className="tit-type2">멘토 성장 스토리 보기</div>
            </div>
          </div>
          <div className="tab-content" data-id="tabLink01">
            <div className="layout-grid">
              <div className="grid-100">
                <div className="inpwrap">
                  <MentoringDetailTemplate mentorData={mentorStory} seminarData={{ data: [] }} isBanner={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorsTemplate;
