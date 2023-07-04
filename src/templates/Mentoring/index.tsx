import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Image from 'next/image';
import { Button, Modal, Pagination, Profile, Toggle, Typography } from '../../stories/components';
import SectionHeader from '../../stories/components/SectionHeader';
import Banner from '../../stories/components/Banner';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../store/session';
import { useStore } from '../../store';
import React, { useEffect, useState } from 'react';
import { useJobGroups } from '../../services/code/code.queries';
import { useApproveMentor } from '../../../src/services/mentors/mentors.mutations';

interface MentoringTemplateProps {
  mentorList?: any;
  recommendMentorList?: any;
  onRecommendPage?: (params: any) => void;
  onPage?: (params: any) => void;
  recommendPage?: number;
  recommendParams?: any;
  pageProps?: any;
  userResumeStory?: any;
  userType?: any; // 0001 멘티
}

const cx = classNames.bind(styles);

export function MentoringTemplate({
  mentorList,
  recommendMentorList,
  onRecommendPage,
  onPage,
  recommendPage,
  recommendParams,
  pageProps,
  userResumeStory,
  userType,
}: MentoringTemplateProps) {
  const router = useRouter();
  const { logged } = useSessionStore.getState();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { jobGroups, setJobGroups } = useStore();
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);
  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));
  const { mutate: onApproveMentor, isSuccess, isError } = useApproveMentor();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  useEffect(() => {
    recommendParams && setJobGroupsFilter(recommendParams.jobGroups !== '' ? recommendParams.jobGroups.split(',') : []);
    recommendParams && setLevelsFilter(recommendParams.levels !== '' ? recommendParams.levels.split(',') : []);
  }, [recommendParams]);

  useEffect(() => {
    if (isSubmit) {
      onSubmit();
    }
  }, [isSubmit]);

  const onMentorRegister = async () => {
    if (userType !== '0001' && userResumeStory && Object.keys(userResumeStory).length > 0) {
      return;
    }
    if (logged) {
      // 멘토 type 파라미터 (멘토 신청 페이지 이므로)
      await router.push({ pathname: '/growth-story', query: { type: 'MENTOR' } }, '/growth-story');
    } else {
      if (confirm('로그인이 필요한 페이지 입니다.\n로그인 페이지로 이동하시겠습니까?')) {
        await router.push('/account/login');
      }
    }
  };

  const newCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

  const toggleFilter = (id, type: 'jobGroup' | 'level') => {
    if (type === 'jobGroup') {
      const index = jobGroupsFilter.indexOf(id);
      setJobGroupsFilter(prevState => newCheckItem(id, index, prevState));
    } else {
      const index = levelsFilter.indexOf(id);
      setLevelsFilter(prevState => newCheckItem(id, index, prevState));
    }
    setIsSubmit(true);
  };

  const toggleAllCheck = (type: string) => {
    const params = {
      jobGroups: type === 'job' ? '' : jobGroupsFilter.join(','),
      levels: type === 'level' ? '' : levelsFilter.join(','),
      page: 1,
    };
    onPage && onPage(params);
  };

  const onSubmit = () => {
    const params = {
      jobGroups: jobGroupsFilter.join(','),
      levels: levelsFilter.join(','),
      page: 1,
    };
    onPage && onPage(params);
    setIsSubmit(false);
  };

  const handleRecommendPage = (type: string) => {
    let paramsPage;
    if (type === 'prev' && recommendPage > 0) {
      paramsPage = recommendPage - 1;
    } else if (type === 'next' && recommendPage < recommendMentorList.totalPage) {
      paramsPage = recommendPage + 1;
    }

    if (paramsPage > 0) {
      const params = {
        jobGroups: jobGroupsFilter.join(','),
        levels: levelsFilter.join(','),
        page: paramsPage,
      };
      onRecommendPage && onRecommendPage(params);
    }
  };

  const onMentorSubmit = (params: any) => {
    onApproveMentor({
      ...params,
      memberId: params.memberId,
      type: '0002',
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <Banner title="커리어멘토" subTitle="커멘토" imageName="top_banner_mentoring.svg" />
      <div className={cx('mentoring-container', 'container')}>
        <div className={cx('filter-area', 'pt-5')}>
          <div className={cx('mentoring-button__group')}>
            <Typography type="B1" bold>
              직군
            </Typography>
            <Toggle
              label="전체"
              name="mentoring"
              value="ALL"
              variant="small"
              isActive
              checked={jobGroupsFilter.length === 0}
              type="checkBox"
              onChange={() => toggleAllCheck('job')}
            />
            {isJobGroupFetched &&
              jobGroups.map(item => (
                <Toggle
                  key={item.id}
                  label={item.name}
                  name={item.name}
                  value={item.id}
                  variant="small"
                  type="checkBox"
                  checked={jobGroupsFilter.indexOf(item.id) >= 0}
                  isActive
                  onChange={() => toggleFilter(item.id, 'jobGroup')}
                />
              ))}
          </div>
          <div className={cx('mentoring-button__group')}>
            <Typography type="B1" bold>
              레벨
            </Typography>
            <Toggle
              label="전체"
              name="mentoring"
              value="ALL"
              variant="small"
              isActive
              checked={levelsFilter.length === 0}
              type="checkBox"
              onChange={() => toggleAllCheck('level')}
            />
            {isJobGroupFetched &&
              ['1', '2', '3', '4', '5'].map(level => (
                <Toggle
                  key={`level-${level}`}
                  label={`${level}레벨`}
                  name={`level-${level}`}
                  value={level}
                  variant="small"
                  type="checkBox"
                  checked={levelsFilter.indexOf(level) >= 0}
                  isActive
                  onChange={() => toggleFilter(level, 'level')}
                />
              ))}
          </div>
        </div>
        <div className={cx('mentoring-banner')}>
          <div className="hero-section hero-section-3 ptb-100">
            <Image
              className={cx('object-img')}
              src="/assets/images/mentor/mentor.png"
              alt="멘토 모집 이미지"
              layout="fill"
              objectPosition="center"
              // onClick={onMentorRegister}
            />
            {userType === '0001' || userResumeStory?.type === '0003' || userResumeStory?.type === '0001' ? (
              <div className={cx('fit-content')}>
                {userResumeStory && Object.keys(userResumeStory).length > 0 ? (
                  <>
                    <Button size="main" disabled={true} className="mr-4">
                      <Typography type="B1" tag="div" weight="bold">
                        성장 스토리 입력하기
                      </Typography>
                    </Button>

                    <Button
                      size="main"
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                    >
                      <Typography type="B1" tag="div" weight="bold">
                        멘토 신청
                      </Typography>
                    </Button>
                    <Modal
                      isOpen={isModalOpen}
                      onAfterClose={() => setIsModalOpen(false)}
                      title="멘토 신청"
                      maxWidth="500px"
                    >
                      <div className={cx('seminar-check-popup')}>
                        <div className={cx('mb-5')}>멘토를 신청 하시겠습니까?</div>
                        <div>
                          <Button
                            color="primary"
                            label="신청"
                            size="modal"
                            className={cx('mr-2')}
                            onClick={() => onMentorSubmit(userResumeStory)}
                          />
                          <Button color="secondary" label="취소" size="modal" onClick={() => setIsModalOpen(false)} />
                        </div>
                      </div>
                    </Modal>
                  </>
                ) : (
                  <>
                    <Button size="main" className="mr-4" onClick={onMentorRegister}>
                      <Typography type="B1" tag="div" weight="bold">
                        성장 스토리 입력하기
                      </Typography>
                    </Button>

                    <Button size="main" disabled={true}>
                      <Typography type="B1" tag="div" weight="bold">
                        멘토 신청
                      </Typography>
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className={cx('fit-content')}>
                {userResumeStory?.type === '0002' ? (
                  <Button size="main" disabled={true} className="mr-4" onClick={onMentorRegister}>
                    <Typography type="B1" tag="div" weight="bold">
                      멘토 승인 대기 중입니다.
                    </Typography>
                  </Button>
                ) : (
                  <>
                    <Button size="main" className="mr-4" onClick={onMentorRegister}>
                      <Typography type="B1" tag="div" weight="bold">
                        성장 스토리 입력하기
                      </Typography>
                    </Button>

                    <Button size="main" disabled={true}>
                      <Typography type="B1" tag="div" weight="bold">
                        멘토 신청
                      </Typography>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className={cx('mentor-list', 'pt-100')}>
          <div className="col-md-7">
            <SectionHeader title="나에게 딱 맞는 멘토를 찾아보세요." subTitle="GROWTH MAP" className="text-left" />
          </div>
          <div className={cx('col-md-5 text-right')}>
            <Button size="icon" color="secondary" onClick={() => handleRecommendPage('prev')}>
              <img src="/assets/images/icons/arrow_left.svg" alt="우측 아이콘" />
            </Button>
            <Button size="icon" color="secondary" onClick={() => handleRecommendPage('next')}>
              <img src="/assets/images/icons/arrow_right.svg" alt="우측 아이콘" />
            </Button>
          </div>
        </div>
        <div className="justify-content-center">
          <div className={cx('pt-60', 'flex-wrap-container')}>
            {recommendMentorList?.data.map((item, index) => {
              return <Profile key={`recommend-${index}`} mentorInfo={item} showDesc />;
            })}
            {recommendMentorList?.data.length === 0 && (
              <div className={cx('mentoring-container--empty')}>데이터가 없습니다.</div>
            )}
          </div>
        </div>
        <div className={cx('mentor-list', 'pt-100')}>
          <div className="col-md-12">
            <SectionHeader title="커리어멘토스의 멘토들을 소개합니다." subTitle="SKILLED INSTRUCTOR" />
          </div>
        </div>
        <div className="justify-content-center">
          <div className={cx('pt-60', 'flex-wrap-container')}>
            {mentorList?.data.map((item, index) => {
              return <Profile key={`mentor-${index}`} mentorInfo={item} showDesc />;
            })}
            {mentorList?.data.length === 0 && (
              <div className={cx('mentoring-container--empty')}>데이터가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
      <Pagination {...pageProps} />
    </>
  );
}

export default MentoringTemplate;
