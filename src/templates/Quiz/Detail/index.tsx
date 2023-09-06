import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import BannerDetail from 'src/stories/components/BannerDetail';
import { jobColorKey } from 'src/config/colors';
import Chip from 'src/stories/components/Chip';
import { useStore } from 'src/store';
import { Button, Typography, Profile, Modal, ArticleCard } from 'src/stories/components';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useMySeminarList, useSeminarDetail, useSeminarList } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { ArticleEnum } from 'src/config/types';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import {
  useEncoreSeminar,
  useOpenSeminar,
  useParticipantCancelSeminar,
  useParticipantSeminar,
} from 'src/services/seminars/seminars.mutations';
import { useSessionStore } from 'src/store/session';
import Grid from '@mui/material/Grid';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import { Item } from '@shopify/polaris/build/ts/src/components/ActionList/components';

const cx = classNames.bind(styles);
export interface QuizDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizDetailTemplate({ id }: QuizDetailTemplateProps) {
  const { user } = useStore();
  const [value, setValue] = React.useState(0);
  const [isBookmark, setIsBookmark] = useState(true);
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState<boolean>(false);
  const [myParticipation, setMyParticipation] = useState(null);
  const [restTime, setRestTime] = useState(0);
  const [clubStatus, setClubStatus] = useState('0000');
  const [clubMemberStatus, setClubMemberStatus] = useState('0001');
  const [applicationButton, setApplicationButton] = useState<ReactNode>(null);
  const { memberId, logged } = useSessionStore.getState();

  // const { isFetched: isContentFetched } = useSeminarList({ size: 2, excludeSeminarIds: id }, data => {
  //   setContents(data.data || []);
  // });
  // const { isFetched: isParticipantListFetched } = useMySeminarList(
  //   { enabled: logged && user?.roles?.indexOf('ROLE_USER') >= 0 && user?.roles?.indexOf('ROLE_ADMIN') < 0 },
  //   data => {
  //     setMyParticipation(data.find(item => item.seminarId === id)?.myParticipant);
  //   },
  // );

  const { isFetched: isParticipantListFetched, data } = useSeminarDetail(id, data => {
    setClubMemberStatus(data?.clubMemberStatus);
    // setRestTime(moment(data?.seminarRegistrationEndDate, 'YYYY-MM-DD HH:mm:ss').diff(moment(), 'hours'));
  });

  console.log('detail : ', data);
  const { mutate: onParticipant } = useParticipantSeminar();
  const { mutate: onCancelParticipant } = useParticipantCancelSeminar();
  const { mutate: onEncoreSeminar } = useEncoreSeminar();

  let tabPannelRefs = [];

  const onOpenSeminarFnc = () => {
    if (logged) {
      if (confirm('세미나 앵콜 신청을 하시겠습니까?')) {
        onEncoreSeminar({
          seminarId: id,
          memberId: memberId,
          mentorId: data?.seminarLecturer?.memberId,
        });
      }
    } else {
      alert('로그인 세미나 앵콜 신청을 할 수 있습니다.');
    }
  };

  // REQUESTED("0001") -> 가입 요청
  // CONFIRMED("0002") -> 가입 승인
  // REJECTED("0003") -> 가입 거절
  // BANNED("0004") -> 강퇴
  // DELETED("0005") -> 삭제 (안보임)
  // NONE("0006") -> 클럽과 관계없음 (가입전)

  //   TEMPORARY("0001") -> 임시저장상태
  // REQUESTED("0002") -> 개설요청 대기중
  // PENDING("0003") -> 개설 후 모집기간 전 (아직 이 상태는 안쓰고요)
  // IN_PROGRESS("0004") -> 스터디진행중
  // COMPLETE("0005") -> 스터디 완료
  // RECRUITING("0006") -> 모집중
  // RECRUITMENT_ENDED("0007") -> 모집완료, 시작전
  // REJECTED("0008") -> 개설 거절
  // APPROVAL_EXPIRED("0009") -> 개설 승인 유효기간 종료
  // DELETED("0010") -> 삭제 (안보임)

  const handleParticipant = () => {
    console.log('club join');
    if (!logged) {
      alert('로그인이 필요합니다.');
      return;
    }

    // if (!user?.phoneNumber || user?.phoneNumber?.length === 0) {
    //   alert('마이커리어>회원정보에 휴대전화 등록 후 신청 가능 합니다.');
    //   return;
    // }

    onParticipant({ clubSequence: id });
    setClubMemberStatus('0001');

    //setIsModalOpen(false);
    //setIsModalCancelOpen(false);
    // setApplicationButton(<Button color="lite-gray" label="승인 대기 중" size="large" />);
  };

  const handleCancelParticipant = () => {
    if (!logged) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!user?.phoneNumber || user?.phoneNumber?.length === 0) {
      alert('마이커리어>회원정보에 휴대전화 등록 후 취소 가능 합니다.');
      return;
    }

    onCancelParticipant({ seminarId: id, memberId });
    setIsModalOpen(false);
    setIsModalCancelOpen(false);
    setApplicationButton(
      <Button label="멘토 세미나 참여 신청하기" size="large" onClick={() => setIsModalOpen(true)} />,
    );
  };

  const handleClickTab = index => {
    tabPannelRefs[index].current?.scrollIntoView({ block: 'center' });
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    className?: any;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, className, ...other } = props;
    tabPannelRefs[index] = useRef();

    return (
      <div
        role="tabpanel"
        id={`seminar-tabpanel-${index}`}
        className={cx(`seminar-tabpanel-${index}`, 'seminar-tabpanel', className)}
        aria-labelledby={`simple-tab-${index}`}
        ref={tabPannelRefs[index]}
        {...other}
      >
        {children}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const lectureName = () => {
    return data?.seminarLecturer?.nickname ?? data?.seminarLecturer?.name;
  };

  useEffect(() => {
    if (!logged) {
      setApplicationButton(<Button label="로그인 후 신청 가능합니다" color="lite-gray" size="large" />);
    } else if (isParticipantListFetched) {
      console.log(1111, data?.clubStatus, clubMemberStatus);
      if (data?.clubStatus == '0006' && clubMemberStatus == '0006') {
        if (data?.isLeader) {
          setApplicationButton(
            <button
              type="button"
              className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
            >
              퀴즈풀기
            </button>,
          );
        } else {
          setApplicationButton(
            <button
              type="button"
              onClick={() => handleParticipant()}
              className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
            >
              참여하기
            </button>,
          );
        }
      } else if (data?.clubStatus == '0006' && clubMemberStatus == '0001') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            가입요청 승인중
          </button>,
        );
      } else if (data?.clubStatus == '0006' && clubMemberStatus == '0002') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            가입승인 완료
          </button>,
        );
      } else if (data?.clubStatus == '0006' && clubMemberStatus == '0003') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            진행불가
          </button>,
        );
      } else if (data?.clubStatus == '0006' && clubMemberStatus == '0004') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            모집완료
          </button>,
        );
      } else if (data?.clubStatus == '0007') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            모집완료
          </button>,
        );
      } else if (data?.clubStatus == '0004' && clubMemberStatus == '0002') {
        setApplicationButton(
          <button
            type="button"
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            퀴즈풀기
          </button>,
        );
      } else if (data?.clubStatus == '0005') {
        setApplicationButton(
          <button
            type="button"
            disabled
            className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
          >
            진행 종료
          </button>,
        );
      }
    }
  }, [logged, data, clubMemberStatus]);

  return (
    <>
      <Desktop>
        <div className={cx('seminar-detail-container')}>
          <BannerDetail data={data} title="퀴즈클럽" subTitle="클럽 상세보기" imageName="top_banner_seminar.svg" />
          <div className={cx('container')}>
            {/*바로 밑에 자식만 sticky 적용됨*/}
            <div className={cx('content-wrap')}>
              {data?.isJoined ? (
                <div className={cx('content')}>
                  <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                    <div className="...">
                      <div>나의 실행율 : {data?.myRunRate}</div>
                      <div>
                        나의 실행율 : {data?.myStudyCount} /{data?.studyTotalCount}
                      </div>
                    </div>
                    <div className="...">
                      <div>평균 실행율 : {data?.membersAvgRunRate}</div>
                      <div>
                        나의 실행율 : {data?.membersAvgStudyCount}/ {data?.studyTotalCount}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={cx('content')}>
                  {data?.imageUrl3 && (
                    <Image
                      src={`${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${data?.imageUrl3}`}
                      alt={`${data?.seminarTitle}`}
                      layout="responsive"
                      width="736"
                      height="420"
                      objectFit="fill"
                      unoptimized={true}
                    />
                  )}
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    className={cx('tabs', 'sticky')}
                  >
                    <Tab label="퀴즈클럽 소개" {...a11yProps(0)} onClick={() => handleClickTab(0)} />
                    <Tab label="크루활동" {...a11yProps(1)} onClick={() => handleClickTab(1)} />
                  </Tabs>
                  {/* <article> */}
                  <TabPanel value={value} index={0} className="tw-p-5">
                    <div className="tw-flex tw-items-center tw-space-x-4 tw-my-5">
                      <img
                        className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full"
                        src={data?.leaderProfileImageUrl}
                        alt=""
                      />
                      <div className="tw-text-base tw-font-semibold tw-text-black dark:tw-text-white">
                        <div>{data?.leaderNickname}</div>
                      </div>
                    </div>

                    <div className="tw-text-xl tw-mb-10 tw-font-bold tw-text-black dark:tw-text-gray-400">
                      퀴즈클럽 소개
                    </div>
                    <div className="tw-text-base tw-mb-10 tw-font-normal tw-text-black dark:tw-text-gray-400">
                      {data?.description}
                    </div>

                    <div className="tw-text-xl tw-mb-10 tw-font-bold tw-text-black dark:tw-text-gray-400">
                      퀴즈클럽 질문 미리보기
                    </div>

                    <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-400 dark:tw-text-gray-400">
                      {data?.studyWeekCount}주 총 학습 {data?.studyTotalCount}회 진행
                    </div>

                    {data?.clubQuizzes.map((item, index) => {
                      if (item?.isRepresentative === true) {
                        return (
                          <div key={index} className="">
                            <div className="tw-flex tw-items-center tw-px-0 tw-border mb-2 mt-0 rounded">
                              <span className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded">
                                대표 {index + 1}
                              </span>
                              <div className="tw-flex-auto tw-ml-3">
                                <div className="tw-font-medium tw-text-black">{item.content}</div>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        // 다른 경우에는 렌더링하지 않음
                        return null;
                      }
                    })}
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {/* <Profile
                      showDesc
                      mentorInfo={data?.seminarLecturer}
                      className={cx('seminar-tabpanel-1__profile', 'col-md-4')}
                      imageSize={160}
                      colorMode="primary"
                      isDetail
                    /> */}
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    {/* <Typography type="H3" bold>
                    크루활동
                  </Typography> */}
                    <div
                      dangerouslySetInnerHTML={{ __html: data?.seminarCurriculum }}
                      className={cx('seminar-tabpanel__html-content')}
                    />
                  </TabPanel>
                </div>
              )}
              {applicationButton}
            </div>
          </div>
        </div>
      </Desktop>
    </>
  );
}

export default QuizDetailTemplate;
