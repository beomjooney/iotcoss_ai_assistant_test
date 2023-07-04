import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminPagination, Table, SmartFilter, Toggle, Profile, Button } from '../../../stories/components';
import { TextareaAutosize } from '@mui/base';
import { useUploadImage } from 'src/services/image/image.mutations';
import dayjs from 'dayjs';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const cx = classNames.bind(styles);

interface GrowthStoryTemplateProps {
  mentorList?: any;
  mentorData?: any;
  memberCodes?: any;
  pageProps?: any;
  onMentorInfo?: (memberId: string) => void;
  onSearch?: (searchKeyword: string) => void;
  jobCodes?: any[];
  skillList?: any[];
  experience?: any[];
  onSave?: (params: any) => void;
  onDelete?: (mentorId: string) => void;
}

export function GrowthStoryTemplate({
  mentorList,
  mentorData,
  onMentorInfo,
  pageProps,
  memberCodes,
  onSearch,
  jobCodes,
  skillList,
  experience,
  onSave,
  onDelete,
}: GrowthStoryTemplateProps) {
  const COLGROUP = ['8%', '5%', '7%', '8%', '3%', '5%', '3%', '5%', '12%', '8%', '5%', '5%'];
  const HEADS = [
    '회원아이디',
    '회원명',
    '회원URI',
    '회원유형',
    '인기지수',
    '직군유형',
    '레벨',
    '연령대',
    '이메일',
    '전화번호',
    '인증기관',
    '등록일시',
  ];

  const FIELDS = [
    { name: 'UUID', field: 'uuid', type: 'text' },
    { name: '회원아이디', field: 'memberId', type: 'text' },
    { name: '회원고유번호', field: 'memberUri', type: 'text' },
    { name: '회원명', field: 'name', type: 'text' },
    { name: '닉네임', field: 'nickname', type: 'text' },
    { name: '이메일', field: 'email', type: 'text' },
  ];

  const { mutate: onSaveProfileImage, data: profileImage, isSuccess } = useUploadImage();

  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [mentorStory, setMentorStory] = useState<any>({});
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState<number>(1);
  const [profileImageUrl, setProfilImageUrl] = useState(null);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    if (mentorData) {
      setMentorStory(mentorData);
      setExperienceIds(mentorData?.experiences?.map(_ => _.experienceId) || []);
      setSkillIds(mentorData?.skills?.map(_ => _.skillId) || []);
    } else {
      setMentorStory({});
      setExperienceIds([]);
      setSkillIds([]);
    }
  }, [mentorData]);

  const onShowPopup = (event, mentorUri: string) => {
    setTabValue(0);
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

  const onSmartFilterSearch = (params: any) => {
    onSearch && onSearch(params);
  };

  const onChangeStory = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;

    console.log(name, value);
    let data = {};
    const growthStories = [...mentorStory.growthStories];

    if (tabValue === 0) {
      data = {
        [name]: value,
      };
    } else {
      const reuslt = (growthStories[tabValue - 2][name] = value);
      console.log(reuslt);
      data = {
        growthStories,
      };
    }

    setMentorStory({
      ...mentorStory,
      ...data,
    });
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

  const handleTab = (value: number) => {
    setTabValue(value);
  };

  const handleSave = () => {
    let growthStoriesParams = [];
    mentorStory?.growthStories?.forEach($ => {
      $.growthNodeIds = $.growthNodes;
      let item = { ...$ };
      item.growthNodeIds = $.growthNodeIds?.map(_ => _.nodeId);
      growthStoriesParams.push(item);
    });

    const customSkillNames = mentorStory.customSkills.map(item => item.skillName);
    const customExperienceNames = mentorStory.customExperiences.map(item => item.experienceName);

    onSave &&
      onSave({
        ...mentorStory,
        profileImageUrl: profileImage?.toString()?.slice(1) || mentorStory?.profileImageUrl,
        type: 'MENTOR',
        growthStories: growthStoriesParams,
        skillIds: skillIds,
        experienceIds: experienceIds,
        customSkillNames,
        customExperienceNames,
      });
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

  const memberSaveSchema = yup.object().shape({
    name: yup.string().notRequired(),
    nickname: yup.string().notRequired(),
    type: yup.string().notRequired(),
    typeName: yup.string().notRequired(),
  });

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(memberSaveSchema),
  });

  return (
    <div className="content">
      <h2 className="tit-type1">멘토 관리</h2>
      <div className="path">
        <span>Home</span> <span>멘토 목록</span>
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
          <button className="btn-type1 type3" onClick={() => setIsFilter(!isFilter)}>
            <i className="ico i-filter"></i>
            <span>필터</span>
          </button>
        </div>
        <SmartFilter name="mentorFilter" fields={FIELDS} isFilterOpen={isFilter} onSearch={onSmartFilterSearch} />
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
                <td className="magic" title={item.memberUri}>
                  {item.memberUri}
                </td>
                <td className="magic" title={item.typeName}>
                  {item.typeName}
                </td>
                <td className="magic" title={item.popularity}>
                  {item.popularity}
                </td>
                <td className="magic" title={item.jobGroupName}>
                  {item.jobGroupName}
                </td>
                <td className="magic" title={item.level}>
                  {item.level}
                </td>
                <td className="magic" title={item.ageRange}>
                  {item.ageRange}
                </td>
                <td className="magic" title={item.email}>
                  {item.email}
                </td>
                <td className="magic" title={item.phoneNumber}>
                  {item.phoneNumber}
                </td>
                <td className="magic" title={item?.authProviderName}>
                  {item?.authProviderName}
                </td>
                <td className="magic" title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
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
              <div className="tit-type2">멘토 상세보기</div>
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
                <button className="btn-type1 type1" onClick={() => onDelete && onDelete(mentorStory.memberId)}>
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
                보유 스킬/경험
              </a>
            </li>
            {mentorStory?.growthStories?.map((item, index) => {
              return (
                <li className={tabValue === index + 2 ? 'on' : ''} key={`tab-${index}`}>
                  <a href="#" onClick={() => handleTab(index + 2)}>
                    제 {item.chapter}장
                  </a>
                </li>
              );
            })}
          </ul>
          {tabValue > 1 && (
            <div className="tab-content">
              <div className="layout-grid">
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      제목
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        type="text"
                        name="title"
                        className="input-admin"
                        value={mentorStory?.growthStories[tabValue - 2].title}
                        onChange={onChangeStory}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      내용
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        style={{
                          width: '100%',
                          borderRadius: '5px',
                          padding: 12,
                          resize: 'none',
                          color: '#666666',
                        }}
                        name="description"
                        onChange={onChangeStory}
                        value={mentorStory?.growthStories[tabValue - 2].description}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      시작연도
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="startedAtYear"
                        value={mentorStory?.growthStories[tabValue - 2].startedAtYear}
                        onChange={onChangeStory}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      시작월
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="startedAtMonth"
                        value={mentorStory?.growthStories[tabValue - 2].startedAtMonth}
                        onChange={onChangeStory}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      종료연도
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="finishedAtYear"
                        value={mentorStory?.growthStories[tabValue - 2].finishedAtYear}
                        onChange={onChangeStory}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-50">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      종료월
                      <span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="finishedAtMonth"
                        value={mentorStory?.growthStories[tabValue - 2].finishedAtMonth}
                        onChange={onChangeStory}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {tabValue === 0 && (
            <div className="tab-content">
              <div className="layout-grid">
                <div className="grid-100">
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {isEdit ? (
                      <div className={cx('profile-image-item')}>
                        <div className={cx('profile-image')}>
                          <Image
                            src={
                              isSuccess
                                ? profileImageUrl
                                : mentorStory?.profileImageUrl?.indexOf('http') > -1
                                ? mentorStory?.profileImageUrl
                                : `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${mentorStory?.profileImageUrl}`
                            }
                            alt={`${mentorStory?.typeName} ${mentorStory?.nickname}`}
                            className={cx('rounded-circle', 'profile-image__image')}
                            width={`256px`}
                            height={`256px`}
                            objectFit="cover"
                            unoptimized={true}
                          />
                        </div>
                        <div className={cx('profile-image-item__upload-wrap')}>
                          <Button type="button" color="secondary" disabled={!isEdit}>
                            <label htmlFor="profile-image-item__upload">프로필 사진 수정</label>
                            <input
                              hidden
                              disabled={!isEdit}
                              id="profile-image-item__upload"
                              accept="image/*"
                              type="file"
                              onChange={e => onFileChange(e.target?.files)}
                            />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Profile mentorInfo={mentorStory} showDesc isOnlyImage />
                    )}
                  </div>
                </div>

                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      회원 아이디<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <input
                        className="input-admin"
                        type="text"
                        name="memberId"
                        disabled
                        value={mentorStory?.memberId || ''}
                        onChange={onChangeStory}
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
                        type="text"
                        className="input-admin"
                        name="name"
                        value={mentorStory?.name || ''}
                        onChange={onChangeStory}
                        disabled={!isEdit}
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
                        name="nickname"
                        value={mentorStory?.nickname || ''}
                        onChange={onChangeStory}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      회원유형<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <select value={mentorStory?.type || ''} onChange={onChangeStory} name="type" disabled={!isEdit}>
                        {memberCodes?.map(item => (
                          <option key={item.id} value={item.id}>
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
                      직군유형<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <select
                        value={mentorStory?.jobGroup || ''}
                        onChange={onChangeStory}
                        name="jobGroup"
                        disabled={!isEdit}
                      >
                        {jobCodes?.map(item => (
                          <option key={item.id} value={item.id}>
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
                      레벨<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <select value={mentorStory?.level || ''} onChange={onChangeStory} name="level" disabled={!isEdit}>
                        <option value={1}>1레벨</option>
                        <option value={2}>2레벨</option>
                        <option value={3}>3레벨</option>
                        <option value={4}>4레벨</option>
                        <option value={5}>5레벨</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      자기소개 글<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        style={{
                          width: '100%',
                          border: '1px solid #B0B7C1',
                          borderRadius: '5px',
                          padding: 12,
                          resize: 'none',
                          color: '#666666',
                        }}
                        name="introductionMessage"
                        onChange={onChangeStory}
                        value={mentorStory?.introductionMessage || ''}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {tabValue === 1 && (
            <div className="tab-content">
              <div className="layout-grid">
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      보유 스킬<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <div className={cx('filter-area')}>
                        <div className={cx('skill__group')}>
                          {skillList?.map((item, index) => {
                            return (
                              <Toggle
                                key={`skillIds-${index}`}
                                label={item.skillName}
                                name="skillIds"
                                value={item.skillId}
                                onChange={onToggleChange}
                                className="mr-2 mt-2 custom"
                                variant="small"
                                type="multiple"
                                isActive
                                isBorder
                                checked={!!skillIds?.find(skill => skill === item.skillId)}
                                disabled={!isEdit}
                              />
                            );
                          })}
                          {mentorStory?.customSkills?.map((item, index) => {
                            return (
                              <Toggle
                                key={`custom-skill-${index}`}
                                label={item.skillName}
                                name="skillIds"
                                value={item.skillName}
                                onChange={onToggleChange}
                                className={cx('custom')}
                                variant="small"
                                type="multiple"
                                isActive
                                checked={true}
                                disabled={!isEdit}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-100">
                  <div className="inpwrap">
                    <div className="inp-tit">
                      보유 경험<span className="star">*</span>
                    </div>
                    <div className="inp">
                      <div className={cx('skill__group')}>
                        {experience?.map((item, index) => {
                          return (
                            <Toggle
                              key={`experienceIds-${index}`}
                              label={item.experienceName}
                              name="experienceIds"
                              value={item.experienceId}
                              onChange={onToggleChange}
                              className="mr-2 mt-2"
                              variant="small"
                              type="multiple"
                              isActive
                              isBorder
                              checked={!!experienceIds?.find(experiences => experiences === item.experienceId)}
                              disabled={!isEdit}
                            />
                          );
                        })}
                        {mentorStory?.customExperiences?.map((item, index) => {
                          return (
                            <Toggle
                              key={`custom-experience-${index}`}
                              label={item.experienceName}
                              name="skillIds"
                              value={item.experienceName}
                              onChange={onToggleChange}
                              className={cx('custom')}
                              variant="small"
                              type="multiple"
                              isActive
                              checked={
                                !!mentorStory?.customExperiences?.find(
                                  experiences => experiences.experienceId === item.experienceId,
                                )
                              }
                              disabled={!isEdit}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrowthStoryTemplate;
