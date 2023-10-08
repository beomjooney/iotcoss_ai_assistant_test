import styles from './index.module.scss';
import classNames from 'classnames/bind';
import {
  Toggle,
  SectionHeader,
  LevelCard,
  ResumeStory,
  Button,
  NodeCard,
  MentorsModal,
  Textfield,
  Typography,
} from '../../../stories/components';
import { TextareaAutosize } from '@mui/base';
import Banner from '../../../stories/components/Banner';
import GrowthStoryCard from '../../../stories/components/GrowthStoryCard';
import { ExperiencesResponse } from '../../../models/experiences';
import { SkillResponse } from '../../../models/skills';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getDateDiff } from '../../../utils';
import { useJobGroups } from '../../../services/code/code.queries';
import { useStore } from '../../../store';

interface MentoringEditTemplateProps {
  experiences?: ExperiencesResponse;
  skills?: SkillResponse;
  jobs?: any[];
  onGetJobsData?: () => void;
  onMentorSubmit?: (params: any) => void;
  userInfoData?: any;
}

const cx = classNames.bind(styles);

export function MentoringEditTemplate({
  experiences,
  skills,
  jobs,
  onGetJobsData,
  onMentorSubmit,
  userInfoData = {},
}: MentoringEditTemplateProps) {
  const [userInfo, setUserInfo] = useState({ ...userInfoData });
  const [activeLevel, setActiveLevel] = useState<number>(0);
  const [jobGroup, setJobGroup] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [growthStories, setGrowthStories] = useState<any[]>([]);
  const [paramsGrowthStories, setParamsGrowthStories] = useState<any[]>([]);

  const [introductionMessage, setIntroductionMessage] = useState<string>('');
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [experienceIds, setExperienceIds] = useState<string[]>([]);

  const [description, setDescription] = useState<string>('');
  const [isCustomSkillArea, setIsCustomSkillArea] = useState<boolean>(false);
  const [isCustomExperience, setIsCustomExperience] = useState<boolean>(false);

  const [customSkillList, setCustomSkillList] = useState<any[]>([]);
  const [customExperienceList, setCustomExperienceList] = useState<any[]>([]);
  const [customSkill, setCustomSkill] = useState<string>('');
  const [customExperience, setCustomExperience] = useState<string>('');

  const [userTypeName, setUserTypeName] = useState<string>('');

  const { data: jobGroupDatas } = useJobGroups();
  const { user } = useStore();

  useEffect(() => {
    if (userInfoData?.memberId) {
      setActiveLevel(userInfoData?.level || 0);
      setJobGroup(userInfoData?.jobGroup || '');
      setExperienceIds(userInfoData?.experiences?.map(_ => _.experienceId) || []);
      if (userInfoData?.customExperiences?.length > 0) {
        setCustomExperienceList(userInfoData?.customExperiences?.map(_ => _.experienceName));
      }
      if (userInfoData?.customSkills?.length > 0) {
        setCustomSkillList(userInfoData?.customSkills?.map(_ => _.skillName));
      }
      setSkillIds(userInfoData?.skills?.map(_ => _.skillId) || []);
      setIntroductionMessage(userInfoData?.introductionMessage || '');
      let growtStoriesParams = [];
      let growtStories = [];
      userInfoData?.growthStories?.forEach($ => {
        $.growthNodeIds = $.growthNodes;
        $.growthNodes = undefined;
        $.isEdit = true;
        growtStories.push($);
        let item = { ...$ };
        item.growthNodeIds = $.growthNodeIds?.map(_ => _.nodeId);
        growtStoriesParams.push(item);
      });
      setGrowthStories(growtStories);
      setParamsGrowthStories(growtStoriesParams);
    }
  }, [userInfoData]);

  useEffect(() => {
    setUserTypeName(user?.type === '0001' ? '멘티' : '멘토');
  }, [user]);

  const storyList = [
    { title: '첫번째 도전 추가하기', no: 1 },
    { title: '두번째 도전 추가하기', no: 2 },
    { title: '세번째 도전 추가하기', no: 3 },
    { title: '네번째 도전 추가하기', no: 4 },
    { title: '다섯번째 도전 추가하기', no: 5 },
    { title: '여섯째 도전 추가하기', no: 6 },
    { title: '일곱번째 도전 추가하기', no: 7 },
    { title: '여덟번째 도전 추가하기', no: 8 },
    { title: '아홉번째 도전 추가하기', no: 9 },
    { title: '열번째 도전 추가하기', no: 10 },
  ];

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!

  const [chapterNo, setChapterNo] = useState<number>(0);

  const { register, handleSubmit } = useForm({ defaultValues: { ...userInfoData } });

  const handleToggle = event => {
    const { name, value } = event.currentTarget;
    setJobGroup(value);
  };

  const handleLevel = (level: number) => {
    setActiveLevel(level);
  };

  const handleAddClick = (chapterNo: number) => {
    onGetJobsData && onGetJobsData();
    setIsModalOpen(true);
    setChapterNo(chapterNo);
  };

  const handleNodeCard = (jobGroup: string, index: number) => {
    const result = [...growthStories];
    result[chapterNo - 1].growthNodeIds.push(jobs[index]);
    setGrowthStories(result);

    const params = [...paramsGrowthStories];
    params[chapterNo - 1].growthNodeIds.push(jobs[index].nodeId);
    setParamsGrowthStories(params);
    setIsModalOpen(false);
  };

  const removeButton = (chapterNo: number, index: number) => {
    const result = [...growthStories];
    result[chapterNo - 1].growthNodeIds.splice(index, 1);
    setGrowthStories(result);

    const params = [...paramsGrowthStories];
    params[chapterNo - 1].growthNodeIds.splice(index, 1);
    setParamsGrowthStories(params);
  };

  const addChallenge = (chapterNo: number) => {
    setChapterNo(chapterNo);
    const challenge = [...growthStories];
    challenge.push({
      chapter: chapterNo,
      title: '',
      description: '',
      startedAtYear: '',
      startedAtMonth: '',
      finishedAtYear: '',
      finishedAtMonth: '',
      period: '',
      growthNodeIds: [],
    });
    setGrowthStories(challenge);

    const challenge2 = [...paramsGrowthStories];
    challenge2.push({
      chapter: chapterNo,
      title: '',
      description: '',
      startedAtYear: '',
      startedAtMonth: '',
      finishedAtYear: '',
      finishedAtMonth: '',
      period: '',
      growthNodeIds: [],
    });
    setParamsGrowthStories(challenge2);
  };

  const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    const result = [...growthStories];
    const params = [...paramsGrowthStories];
    // console.log('no');
    // console.log(no);
    // console.log('result');
    // console.log(result[no - 1]);

    if (name === 'introductionMessage') {
      setIntroductionMessage(value);
    } else if (name === 'title') {
      result[no - 1].title = value;
      params[no - 1].title = value;
    } else if (name === 'description') {
      result[no - 1].description = value;
      params[no - 1].description = value;
      setDescription(value);
    } else if (name === 'startedAtYear') {
      result[no - 1].startedAtYear = value;
      params[no - 1].startedAtYear = value;
    } else if (name === 'startedAtMonth') {
      result[no - 1].startedAtMonth = value;
      params[no - 1].startedAtMonth = value;
    } else if (name === 'finishedAtYear') {
      result[no - 1].finishedAtYear = value;
      params[no - 1].finishedAtYear = value;
    } else if (name === 'finishedAtMonth') {
      // console.log('input empty');
      result[no - 1].finishedAtMonth = value;
      params[no - 1].finishedAtMonth = value;
    }

    if (result[no - 1]) {
      if (result[no - 1].finishedAtYear !== '' && result[no - 1].finishedAtMonth !== '') {
        const resultDate = getWorkDate(
          result[no - 1].startedAtYear.toString() + result[no - 1].startedAtMonth.toString(),
          result[no - 1].finishedAtYear.toString() + result[no - 1].finishedAtMonth.toString(),
        );
        result[no - 1].period = resultDate;
        params[no - 1].period = resultDate;
      }
    }
    setGrowthStories(result);
    setParamsGrowthStories(params);
  };

  const getWorkDate = (workStartDate: string, workEndDate: string) => {
    let result;
    const monthDiff = getDateDiff(workStartDate, workEndDate);
    result =
      monthDiff > 12
        ? `${Math.floor(monthDiff / 12)}년` + (monthDiff % 12 !== 0 ? ` ${monthDiff % 12}개월` : '')
        : monthDiff % 12 !== 0 && Math.sign(monthDiff % 12) !== -1
        ? `${monthDiff % 12}개월`
        : '';
    return result;
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

  const onCustomToggle = (event: React.MouseEvent<HTMLInputElement>) => {
    const { name } = event.currentTarget;
    if (name === 'customSkillNames') {
      setIsCustomSkillArea(true);
    } else {
      setIsCustomExperience(true);
    }
  };

  const onCustomSkillArea = () => {
    if (customSkill === '') {
      return;
    }
    const result = [...customSkillList];
    result.push(customSkill);
    setCustomSkillList(result);
    setIsCustomSkillArea(false);
    setCustomSkill('');
  };

  const onCustomExperienceArea = () => {
    if (customExperience === '') {
      return;
    }
    const result = [...customExperienceList];
    result.push(customExperience);
    setCustomExperienceList(result);
    setIsCustomExperience(false);
    setCustomExperience('');
  };

  const onChangeCustomData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (name === 'customSkillNames') {
      setCustomSkill(value);
    } else {
      setCustomExperience(value);
    }
  };

  const onSubmit = (data: any) => {
    const params = {
      ...data,
      jobGroup: jobGroup,
      level: activeLevel,
      growthStories: paramsGrowthStories,
      introductionMessage: introductionMessage,
      skillIds: skillIds,
      experienceIds: experienceIds,
      customSkillNames: customSkillList,
      customExperienceNames: customExperienceList,
      customExperiences: undefined,
      customSkills: undefined,
      experiences: undefined,
      skills: undefined,
    };
    //console.log(params);

    if (params.jobGroup === '') {
      alert('등록을 원하는 분야를 선택해주세요.');
      return;
    }
    if (params.level === 0) {
      alert('내가 생각하는 해당 분야의 레벨을 선택해주세요.');
      return;
    }
    if (paramsGrowthStories.length === 0) {
      alert('나의 성장 스토리를 추가해주세요.');
      return;
    }
    if (paramsGrowthStories.length > 0) {
      const errorArr = paramsGrowthStories;

      for (let i = 0; i < errorArr.length; i++) {
        if (errorArr[i].title === '') {
          alert(`성장스토리 제 ${errorArr[i].chapter}장 제목을 입력해 주세요.`);
          return;
        }
        if (errorArr[i].description === '') {
          alert(`성장스토리 제 ${errorArr[i].chapter}장 경험을 입력해 주세요.`);
          return;
        }
        if (errorArr[i].startedAtYear === '') {
          alert(`성장스토리 제 ${errorArr[i].chapter}장 도전기간을 입력해 주세요.`);
          return;
        }
        if (errorArr[i].startedAtMonth === '') {
          alert(`성장스토리 제 ${errorArr[i].chapter}장 도전기간을 입력해 주세요.`);
          return;
        }

        const patternYear = /^(19|20)\d{2}$/;
        const patternMonth = /^([1-9]|1[012])$/;
        if (!patternYear.test(errorArr[i].startedAtYear)) {
          alert(`성장스토리 제 ${errorArr[i].chapter}장 도전기간을 확인해 주세요.`);
          return;
        }
        if (!patternYear.test(errorArr[i].finishedAtYear)) {
          alert(`성장스토리 제 ${errorArr[i].chapter}장 도전기간을 확인해 주세요.`);
          return;
        }
        if (!patternMonth.test(errorArr[i].startedAtMonth)) {
          alert(`성장스토리 제 ${errorArr[i].chapter}장 도전기간을 확인해 주세요.`);
          return;
        }
        if (!patternMonth.test(errorArr[i].finishedAtMonth)) {
          alert(`성장스토리 제 ${errorArr[i].chapter}장 도전기간을 확인해 주세요.`);
          return;
        }

        if (errorArr[i].startedAtYear > errorArr[i].finishedAtYear) {
          alert(`성장스토리 제 ${errorArr[i].chapter}장 도전기간을 확인해 주세요.`);
          return;
        }
        if (errorArr[i].startedAtYear === errorArr[i].finishedAtYear) {
          if (Number(errorArr[i].finishedAtMonth) < Number(errorArr[i].startedAtMonth)) {
            alert(`성장스토리 제 ${errorArr[i].chapter}장 도전기간을 확인해 주세요.`);
            return;
          }
        }

        if (errorArr[i].finishedAtYear === '') {
          errorArr[i].finishedAtYear = yyyy;
          // alert(`성장스토리 제 ${errorArr[i].chapter}장 도전기간을 입력해 주세요.`);
          // return;
        }
        if (errorArr[i].finishedAtMonth === '') {
          errorArr[i].finishedAtMonth = mm;
          // alert(`성장스토리 제 ${errorArr[i].chapter}장 도전기간을 입력해 주세요.`);
          // return;
        }
        if (errorArr[i].growthNodeIds.length === 0) {
          alert(`성장스토리 제 ${errorArr[i].chapter}장 수행 직무/레벨을 추가해 주세요.`);
          return;
        }
      }
    }
    if (params.skillIds.length === 0) {
      alert(`${userTypeName}님께서 현재 보유하신 스킬을 선택해주세요.`);
      return;
    }
    if (params.experienceIds.length === 0) {
      alert(`${userTypeName}님께서 지금까지 보유하신 경험을 선택해주세요.`);
      return;
    }
    if (params.introductionMessage === '') {
      alert('간단한 자기 소개글을 입력해주세요.');
      return;
    }

    onMentorSubmit && onMentorSubmit(params);
  };

  const errorOrder = [
    'title',
    'description',
    'finishedAtMonth',
    'finishedAtYear',
    'startedAtMonth',
    'startedAtYear',
    'growthNodeIds',
  ];

  const onError = (error: any) => {
    const errorArr = Object.keys(error);
    const firstError = errorArr.reduce((prev, curr) => {
      return Math.min(prev, errorOrder.indexOf(curr));
    }, errorOrder.indexOf(errorArr[0]));
    alert(error[errorOrder[firstError]].message);

    // const inputRef = error[errorOrder[firstError]].ref;
    // setTimeout(() => {
    //   inputRef.focus();
    // }, 100);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Banner title="커리어멘토" subTitle="성장스토리" imageName="top_banner_mentoring.svg" />
      <div className={cx('mentoring-register-container', 'container pl-5 pr-5 pt-100')}>
        <article>
          <SectionHeader title="등록을 원하는 분야를 선택해주세요." subTitle="CHECK 01" />
          <div className={cx('filter-area', 'row pb-5')}>
            <div className={cx('mentoring-button__group', 'col-md-12')}>
              {jobGroupDatas?.map(item => (
                <Toggle
                  label={item.name}
                  name="jobGroup"
                  value={item.id}
                  key={item.id}
                  variant="large"
                  isActive
                  className={cx('fixed-width')}
                  register={register}
                  onChange={handleToggle}
                  type="tabRadio"
                  weight="bold"
                  checked={item.id === jobGroup}
                />
              ))}
            </div>
          </div>
        </article>
        <article className="pt-100">
          <SectionHeader title="내가 생각하는 해당 분야의 레벨을 선택해주세요." subTitle="CHECK 02" />
          <div className={cx('filter-area', 'row pb-5', 'filter-area-scroll')}>
            <div className={cx('container', 'mentoring-button__group', 'col-md-12')}>
              <LevelCard
                levelTitle="1레벨"
                levelSubTitle="직무초보"
                levelContent="상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요"
                onClick={() => handleLevel(1)}
                isActive={activeLevel === 1}
              />
              <LevelCard
                levelTitle="2레벨"
                levelSubTitle="직무실무"
                levelContent="상용서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능"
                onClick={() => handleLevel(2)}
                isActive={activeLevel === 2}
              />
              <LevelCard
                levelTitle="3레벨"
                levelSubTitle="직무리더(전문가)"
                levelContent="상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능"
                onClick={() => handleLevel(3)}
                isActive={activeLevel === 3}
              />
              <LevelCard
                levelTitle="4레벨"
                levelSubTitle="직군리더"
                levelContent="다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더"
                onClick={() => handleLevel(4)}
                isActive={activeLevel === 4}
              />
              <LevelCard
                levelTitle="5레벨"
                levelSubTitle="업계유명인"
                levelContent="본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩"
                onClick={() => handleLevel(5)}
                isActive={activeLevel === 5}
              />
            </div>
          </div>
        </article>
        <article className="pt-100">
          <SectionHeader title="나의 성장 스토리를 추가해주세요." subTitle="CHECK 03" />
          <div className={cx('filter-area', 'row pb-5', 'filter-area-scroll')}>
            <div className={cx('col-md-12')}>
              {growthStories.map((item, index) => {
                return (
                  <div
                    key={`resumeStory-${index}`}
                    className={cx('borderRadius', 'single-promo single-promo-1 rounded text-center white-bg p-5 mb-5')}
                  >
                    <ResumeStory
                      isEdit={item.isEdit}
                      titleValue={item.title}
                      handleAddClick={handleAddClick}
                      jobStoryList={item.growthNodeIds}
                      removeButton={removeButton}
                      chapterNo={item.chapter}
                      onChangeValue={onMessageChange}
                      description={item.description}
                      period={item.period}
                      title={`제 ${item.chapter}장`}
                      startedAtYear={item.startedAtYear}
                      startedAtMonth={item.startedAtMonth}
                      finishedAtYear={item.finishedAtYear}
                      finishedAtMonth={item.finishedAtMonth}
                    />
                  </div>
                );
              })}
              {growthStories.length < 10 && (
                <div className={cx('story-border', 'single-promo rounded text-center white-bg p-5 mb-5')}>
                  <GrowthStoryCard
                    isGray={false}
                    message={storyList[growthStories.length].title}
                    no={storyList[growthStories.length].no}
                    onClick={addChallenge}
                    buttonSize="large"
                  />
                </div>
              )}
            </div>
          </div>
        </article>
        <article className="pt-100">
          <SectionHeader title={`${userTypeName}님께서 현재 보유하신 스킬을 선택해주세요.`} subTitle="CHECK 04" />
          <div className={cx('filter-area', 'row pb-5')}>
            <div className={cx('skill__group', 'col-md-12')}>
              {skillIds.length > 0 &&
                skills?.map((item, index) => {
                  return (
                    <Toggle
                      key={`skillIds-${index}`}
                      label={item.skillName}
                      name="skillIds"
                      value={item.skillId}
                      onChange={onToggleChange}
                      variant="small"
                      type="multiple"
                      isActive
                      isBorder
                      defaultChecked={!!skillIds?.find(_ => _ === item.skillId)}
                    />
                  );
                })}
              {customSkillList?.map((item, index) => {
                return (
                  <Toggle
                    key={`custom-skill-${index}`}
                    label={item}
                    name="skillIds"
                    value={item}
                    // onChange={onToggleChange}
                    variant="small"
                    type="multiple"
                    isActive
                    defaultChecked={true}
                  />
                );
              })}
              <Toggle label="직접입력" name="customSkillNames" value="" variant="small" onClick={onCustomToggle} />
            </div>
          </div>
          {isCustomSkillArea && (
            <div className={cx('custom-skill')}>
              <Textfield
                placeholder="기타:스킬 이름을 입력해 주세요."
                name="customSkillNames"
                onChange={onChangeCustomData}
                width={544}
              />
              <Button color="lite-blue" size="camen" type="button" onClick={onCustomSkillArea}>
                <Typography type="H3">+</Typography>
              </Button>
            </div>
          )}
        </article>
        <article className="pt-100">
          <SectionHeader title={`${userTypeName}님께서 지금까지 보유하신 경험을 선택해주세요.`} subTitle="CHECK 05" />
          <div className={cx('filter-area', 'row pb-5')}>
            <div className={cx('skill__group', 'col-md-12')}>
              {experienceIds.length > 0 &&
                experiences?.map((item, index) => {
                  return (
                    <Toggle
                      key={`experienceIds-${index}`}
                      label={item.experienceName}
                      name="experienceIds"
                      value={item.experienceId}
                      onChange={onToggleChange}
                      variant="small"
                      type="multiple"
                      isActive
                      isBorder
                      defaultChecked={!!experienceIds?.find(_ => _ === item.experienceId)}
                    />
                  );
                })}
              {customExperienceList?.map((item, index) => {
                return (
                  <Toggle
                    key={`custom-experience-${index}`}
                    label={item}
                    name="skillIds"
                    value={item}
                    variant="small"
                    type="multiple"
                    isActive
                    defaultChecked={true}
                  />
                );
              })}
              <Toggle label="직접입력" name="customExperienceNames" value="" variant="small" onClick={onCustomToggle} />
            </div>
          </div>
          {isCustomExperience && (
            <div className={cx('custom-skill')}>
              <Textfield
                placeholder="기타:경험을 입력해 주세요."
                name="customExperienceNames"
                onChange={onChangeCustomData}
                width={544}
              />
              <Button color="lite-blue" size="camen" type="button" onClick={onCustomExperienceArea}>
                <Typography type="H3">+</Typography>
              </Button>
            </div>
          )}
        </article>
        <article className="pt-100">
          <SectionHeader title="간단한 자기 소개글을 입력해주세요." subTitle="CHECK 06" />
          <div className={cx('filter-area', 'row pb-5')}>
            <div className={cx('mentoring-button__group', 'col-md-12')}>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={5}
                placeholder="간단한 자기 소개글을 입력해주세요."
                style={{ width: '100%', border: '1px solid #B0B7C1', borderRadius: '5px', padding: 12, resize: 'none' }}
                name="introductionMessage"
                onChange={onMessageChange}
                value={introductionMessage}
              />
            </div>
          </div>
        </article>
        <article className="pt-100">
          <div className="row">
            <img src="/assets/images/banner/growth_story_banner.svg" alt="오픈 예정 이미지" />
          </div>
        </article>
        <div className="col-md-6 pt-100" style={{ display: 'block', margin: 'auto' }}>
          <Button color="primary" label="성장 스토리 수정하기" size="large" type="submit" />
        </div>
      </div>
      <MentorsModal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
        <div className={cx('mentoring-register-container__card-nodes')}>
          {jobs?.map((item, index) => {
            return (
              <NodeCard
                index={index}
                key={`jobs-${index}`}
                title={`레벨 ${item.level}`}
                content={item.description}
                jobCode={item.jobGroup}
                onClickNode={handleNodeCard}
                chapterNo={chapterNo}
              />
            );
          })}
        </div>
      </MentorsModal>
    </form>
  );
}

export default MentoringEditTemplate;
