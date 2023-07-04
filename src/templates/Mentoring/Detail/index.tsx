import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Banner, Button, Profile, ResumeStory, Toggle } from '../../../stories/components';
import SectionHeader from '../../../stories/components/SectionHeader';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Mobile, Desktop } from 'src/hooks/mediaQuery';
import { useOpenSeminar } from 'src/services/seminars/seminars.mutations';
import { useSessionStore } from 'src/store/session';
import { useStore } from '../../../../src/store';
const { logged } = useSessionStore.getState();

interface MentoringDetailTemplateProps {
  mentorData: any;
  seminarData: any;
  isBanner?: boolean;
}

const cx = classNames.bind(styles);
function SnsContent(url: any) {
  if (url.url.includes('linked')) {
    return (
      <a href={`${url.url}`} target="_blank" rel="noreferrer">
        <Image src="/assets/images/icons/linked.png" alt="카카오" layout="fixed" width={35} height={35} />
      </a>
    );
  } else if (url.url.includes('facebook')) {
    return (
      <a href={`${url.url}`} target="_blank" rel="noreferrer">
        <Image src="/assets/images/icons/facebook.png" alt="페이스북" layout="fixed" width={35} height={35} />
      </a>
    );
  } else if (url.url.includes('youtube')) {
    return (
      <a href={`${url.url}`} target="_blank" rel="noreferrer">
        <Image src="/assets/images/icons/youtube.png" alt="유트브" layout="fixed" width={35} height={35} />
      </a>
    );
  } else if (url.url.includes('instagram')) {
    return (
      <a href={`${url.url}`} target="_blank" rel="noreferrer">
        <Image src="/assets/images/icons/instagram.png" alt="인스타그램" layout="fixed" width={35} height={35} />
      </a>
    );
  } else if (url.url.includes('twitter')) {
    return (
      <a href={`${url.url}`} target="_blank" rel="noreferrer">
        <Image src="/assets/images/icons/twitter.png" alt="트위터" layout="fixed" width={35} height={35} />
      </a>
    );
  } else {
    return (
      <a href={`${url.url}`} target="_blank" rel="noreferrer" className={cx('circle')}>
        <span></span>
      </a>
    );
  }
}

export function MentoringDetailTemplate({ mentorData, seminarData, isBanner = true }: MentoringDetailTemplateProps) {
  const [seminar, setSeminar] = useState<any[]>([]);
  const { mutate: onOpenSeminar } = useOpenSeminar();
  const { user } = useStore();

  useEffect(() => {
    seminarData && setSeminar(seminarData.data);
  }, [seminarData]);

  const onOpenSeminarFnc = () => {
    if (logged) {
      if (confirm('세미나 개설 신청을 하시겠습니까?')) {
        onOpenSeminar({
          memberId: user.memberId,
          mentorId: mentorData?.memberId,
        });
      }
    } else {
      alert('로그인 후 세미나 개설 신청을 할 수 있습니다.');
    }
  };

  //** URL SAMPLE */
  // const snsUrl = [
  //   'https://kr.linkedin.com/in/%EB%B3%91%EC%A1%B0-%EC%B6%94-970858166',
  //   'https://www.facebook.com/people/%EC%B6%94%EB%B3%91%EC%A1%B0/100006813393958/',
  //   'https://www.youtube.com/watch?v=fnKrenszhb8&ab_channel=%ED%85%9CTV',
  //   'https://www.instagram.com/byeongjo.cu/',
  //   'https://twitter.com/chubyeongjo',
  //   'https://www.naver.com',
  // ];

  return (
    <>
      {isBanner && <Banner title="커멘토링" subTitle="커멘토" imageName="top_banner_mentoring.svg" />}
      <Mobile>
        <div className={cx('mentoring-detail-mobile', 'container')}>
          <div className={cx('detail-group')}>
            <div className={cx('mentoring-detail-mobile__mentoring-profile', 'text-center')}>
              <Profile mentorInfo={mentorData} lgSize="col-md-9" showDesc={true} isDetail={true} weight="bold" />
              <div className={cx('sns-group')}>
                {mentorData?.snsUrl?.map((item, index) => (
                  // {snsUrl?.map((item, index) => (
                  <SnsContent key={index} url={item} />
                ))}
              </div>
              {seminar.length === 0 && (
                <>
                  <Button type="button" size="large" disabled={true} className="mb-3">
                    커리어세미나 보러 가기
                  </Button>
                  <Button type="button" size="large" onClick={() => onOpenSeminarFnc()}>
                    커리어세미나 개설 신청
                  </Button>
                </>
              )}
              {seminar.length > 0 && (
                <Button
                  type="button"
                  size="large"
                  disabled={false}
                  onClick={() => (location.href = `/seminar/${seminar.at(0).seminarId}`)}
                >
                  커리어세미나 보러 가기
                </Button>
              )}
            </div>
            <div>
              <div className={cx('mentoring-detail__info')}>
                <SectionHeader
                  title={`${mentorData?.nickname} 멘토를 소개합니다.`}
                  subTitle="ABOUT"
                  className="text-left"
                  weight="lite"
                />
                <div className={cx('desc')}>{mentorData?.introductionMessage}</div>
              </div>
              <div className={cx('mentoring-detail__info')}>
                <SectionHeader title="대표 경험 리스트" subTitle="EXPERIENCE" className="text-left" weight="lite" />
                <div className={cx('desc')}>
                  {mentorData?.experiences?.map((item, index) => {
                    return (
                      <Toggle
                        key={`experience-${index}`}
                        label={item.experienceName}
                        name="skillIds"
                        value={item.experienceId}
                        // onChange={onToggleChange}
                        variant="small"
                        type="multiple"
                        // isActive
                        defaultChecked={true}
                        weight="bold"
                        isBorder={true}
                      />
                    );
                  })}
                  {mentorData?.customExperiences?.map((item, index) => {
                    return (
                      <Toggle
                        key={`experience-${index}`}
                        label={item.experienceName}
                        name="skillIds"
                        value={item.experienceId}
                        // onChange={onToggleChange}
                        variant="small"
                        type="multiple"
                        // isActive
                        defaultChecked={true}
                        weight="bold"
                        isBorder={true}
                      />
                    );
                  })}
                </div>
              </div>
              <div className={cx('mentoring-detail__info')}>
                <SectionHeader
                  title="대표 스킬 리스트"
                  subTitle="SKILL"
                  className={cx('text-left', 'text-lite')}
                  weight="lite"
                />
                <div className={cx('desc')}>
                  {mentorData?.skills?.map((item, index) => {
                    return (
                      <Toggle
                        key={`skill-${index}`}
                        label={item.skillName}
                        name="skillIds"
                        value={item.skillId}
                        // onChange={onToggleChange}
                        variant="small"
                        type="multiple"
                        // isActive
                        defaultChecked={true}
                        weight="bold"
                        isBorder={true}
                      />
                    );
                  })}
                  {mentorData?.customSkills?.map((item, index) => {
                    return (
                      <Toggle
                        key={`skill-${index}`}
                        label={item.skillName}
                        name="skillIds"
                        value={item.skillId}
                        // onChange={onToggleChange}
                        variant="small"
                        type="multiple"
                        // isActive
                        defaultChecked={true}
                        weight="bold"
                        isBorder={true}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={cx('detail-bottom')}>
            <div className={cx('mentoring-detail-mobile__info')}>
              <SectionHeader title="멘토 성장 스토리" subTitle="GROWTH" className="text-left" weight="lite" />
              <div className={cx('desc-story')}>
                {mentorData?.growthStories?.map((item, index) => {
                  return (
                    <div
                      key={`resumeStory-${index}`}
                      className={cx(
                        'borderRadius',
                        'single-promo single-promo-1 rounded text-center white-bg p-5 mb-2',
                      )}
                    >
                      <ResumeStory
                        title={`제 ${item.chapter}장`}
                        titleValue={item.title}
                        startedAtDate={`${item.startedAtYear}년 ${item.startedAtMonth}월`}
                        finishedAtDate={`${item.finishedAtYear}년 ${item.finishedAtMonth}월`}
                        period={item.period}
                        jobStoryList={item.growthNodes}
                        chapterNo={item.chapter}
                        description={item.description}
                        isCloseButton={false}
                        isView={true}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Mobile>
      <Desktop>
        <div className={cx('mentoring-detail', 'container')}>
          <div className={cx('detail-group')}>
            <div className={cx('mentoring-detail__mentoring-profile', 'text-center')}>
              <Profile mentorInfo={mentorData} lgSize="col-md-9" showDesc={true} isDetail={true} weight="bold" />
              <div className={cx('sns-group')}>
                {mentorData?.snsUrl?.map((item, index) => (
                  /* {snsUrl?.map((item, index) => ( */
                  <SnsContent key={index} url={item} />
                ))}
              </div>
              {seminar.length === 0 && (
                <>
                  <Button type="button" size="large" disabled={true} className="mb-3">
                    커리어세미나 보러 가기
                  </Button>
                  <Button type="button" size="large" onClick={() => onOpenSeminarFnc()}>
                    커리어세미나 개설 신청
                  </Button>
                </>
              )}
              {seminar.length > 0 && (
                <Button
                  type="button"
                  size="large"
                  disabled={false}
                  onClick={() => (location.href = `/seminar/${seminar.at(0).seminarId}`)}
                >
                  커리어세미나 보러 가기
                </Button>
              )}
            </div>
            <div>
              <div className={cx('mentoring-detail__info')}>
                <SectionHeader
                  title={`${mentorData?.nickname} 멘토를 소개합니다.`}
                  subTitle="ABOUT"
                  className="text-left"
                  weight="lite"
                />
                <div className={cx('desc')}>{mentorData?.introductionMessage}</div>
              </div>
              <div className={cx('mentoring-detail__info')}>
                <SectionHeader title="대표 경험 리스트" subTitle="EXPERIENCE" className="text-left" weight="lite" />
                <div className={cx('desc')}>
                  {mentorData?.experiences?.map((item, index) => {
                    return (
                      <Toggle
                        key={`experience-${index}`}
                        label={item.experienceName}
                        name="skillIds"
                        value={item.experienceId}
                        // onChange={onToggleChange}
                        variant="small"
                        type="multiple"
                        // isActive
                        defaultChecked={true}
                        weight="bold"
                        isBorder={true}
                      />
                    );
                  })}
                  {mentorData?.customExperiences?.map((item, index) => {
                    return (
                      <Toggle
                        key={`experience-${index}`}
                        label={item.experienceName}
                        name="skillIds"
                        value={item.experienceId}
                        // onChange={onToggleChange}
                        variant="small"
                        type="multiple"
                        // isActive
                        defaultChecked={true}
                        weight="bold"
                        isBorder={true}
                      />
                    );
                  })}
                </div>
              </div>
              <div className={cx('mentoring-detail__info')}>
                <SectionHeader
                  title="대표 스킬 리스트"
                  subTitle="SKILL"
                  className={cx('text-left', 'text-lite')}
                  weight="lite"
                />
                <div className={cx('desc')}>
                  {mentorData?.skills?.map((item, index) => {
                    return (
                      <Toggle
                        key={`skill-${index}`}
                        label={item.skillName}
                        name="skillIds"
                        value={item.skillId}
                        // onChange={onToggleChange}
                        variant="small"
                        type="multiple"
                        // isActive
                        defaultChecked={true}
                        weight="bold"
                        isBorder={true}
                      />
                    );
                  })}
                  {mentorData?.customSkills?.map((item, index) => {
                    return (
                      <Toggle
                        key={`skill-${index}`}
                        label={item.skillName}
                        name="skillIds"
                        value={item.skillId}
                        // onChange={onToggleChange}
                        variant="small"
                        type="multiple"
                        // isActive
                        defaultChecked={true}
                        weight="bold"
                        isBorder={true}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={cx('detail-bottom')}>
            <div className={cx('mentoring-detail__info')}>
              <SectionHeader title="멘토 성장 스토리" subTitle="GROWTH" className="text-left" weight="lite" />
              <div className={cx('desc-story')}>
                {mentorData?.growthStories?.map((item, index) => {
                  return (
                    <div
                      key={`resumeStory-${index}`}
                      className={cx(
                        'borderRadius',
                        'single-promo single-promo-1 rounded text-center white-bg p-5 mb-2',
                      )}
                    >
                      <ResumeStory
                        title={`제 ${item.chapter}장`}
                        titleValue={item.title}
                        startedAtDate={`${item.startedAtYear}년 ${item.startedAtMonth}월`}
                        finishedAtDate={`${item.finishedAtYear}년 ${item.finishedAtMonth}월`}
                        period={item.period}
                        jobStoryList={item.growthNodes}
                        chapterNo={item.chapter}
                        description={item.description}
                        isCloseButton={false}
                        isView={true}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Desktop>
    </>
  );
}

export default MentoringDetailTemplate;
