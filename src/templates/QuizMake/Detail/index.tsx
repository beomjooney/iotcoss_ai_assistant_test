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
  const [applicationButton, setApplicationButton] = useState<ReactNode>(null);
  const { memberId, logged } = useSessionStore.getState();

  const { isFetched: isContentFetched } = useSeminarList({ size: 2, excludeSeminarIds: id }, data => {
    setContents(data.data || []);
  });
  const { isFetched: isParticipantListFetched } = useMySeminarList(
    { enabled: logged && user?.roles?.indexOf('ROLE_USER') >= 0 && user?.roles?.indexOf('ROLE_ADMIN') < 0 },
    data => {
      setMyParticipation(data.find(item => item.seminarId === id)?.myParticipant);
    },
  );

  const { data } = useSeminarDetail(id, data => {
    setRestTime(moment(data?.seminarRegistrationEndDate, 'YYYY-MM-DD HH:mm:ss').diff(moment(), 'hours'));
  });
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

  const handleParticipant = () => {
    if (!logged) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!user?.phoneNumber || user?.phoneNumber?.length === 0) {
      alert('마이커리어>회원정보에 휴대전화 등록 후 신청 가능 합니다.');
      return;
    }

    onParticipant({ seminarId: id, memberId });
    setIsModalOpen(false);
    setIsModalCancelOpen(false);
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

  const dayText = day => {
    switch (day) {
      case 1:
        return '월';
      case 2:
        return '화';
      case 3:
        return '수';
      case 4:
        return '목';
      case 5:
        return '금';
      case 6:
        return '토';
      case 0:
        return '일';
    }
  };

  const toDateDurationText = (startDateTime, endDateTime) => {
    const startMomented = moment(startDateTime, 'YYYY-MM-DD HH:mm:ss');
    const endMomented = moment(endDateTime, 'YYYY-MM-DD HH:mm:ss');

    // 시간까지 동일하면 하나만 노출
    if (startDateTime === endDateTime)
      return `${startMomented.format('YYYY.MM.DD')}(${dayText(startMomented.day())}) ${startMomented.format('HH:mm')}`;

    // 시간만 다른 경우
    if (startMomented.format('YYYY-MM-DD') === endMomented.format('YYYY-MM-DD')) {
      return `${startMomented.format('YYYY.MM.DD')}(${dayText(startMomented.day())}) ${startMomented.format(
        'HH:mm',
      )} ~ ${endMomented.format('HH:mm')}`;
    }

    // 날짜 부터 다른 경우
    return `${startMomented.format('YYYY.MM.DD')}(${dayText(startMomented.day())}) ${startMomented.format(
      'HH:mm',
    )} ~ ${endMomented.format('YYYY.MM.DD')}(${dayText(endMomented.day())}) ${endMomented.format('HH:mm')}`;
  };

  const toDatetimeText = datetime => {
    const momented = moment(datetime, 'YYYY-MM-DD HH:mm:ss.SSS');
    return `${momented.format('MM월 DD일')}(${dayText(momented.day())}) ${momented.format('HH:mm')}`;
  };

  const lectureName = () => {
    return data?.seminarLecturer?.nickname ?? data?.seminarLecturer?.name;
  };

  //세미나 마감 로직
  const deadlineCount = Math.floor(data?.participantCount / 2) | 0;
  const currentParticipantCount = data?.currentParticipantCount;
  const remainCount = data?.participantCount - currentParticipantCount;

  useEffect(() => {
    if (!logged) {
      if (deadlineCount <= currentParticipantCount) {
        if (remainCount <= 0) {
          setApplicationButton(<Button label="마감완료! 다음에 신청해주세요!" size="large" disabled />);
        } else if (remainCount <= 3) {
          setApplicationButton(<Button label={`${remainCount}자리 남았어요! 로그인 후 신청!`} size="large" disabled />);
        } else {
          setApplicationButton(<Button label="마감임박! 로그인 후 신청 가능!" size="large" disabled />);
        }
      } else {
        setApplicationButton(<Button label="로그인 후 신청 가능합니다" color="lite-gray" size="large" />);
      }
    } else if (user?.roles.indexOf('ROLE_ADMIN') >= 0) setApplicationButton(<></>);
    else if (restTime <= 0 || data?.currentParticipantCount >= data?.participantCount) {
      setApplicationButton(
        <>
          <Button color="lite-gray" label="접수 마감" size="large" className="mb-3" />
          <Button label="커리어세미나 앵콜 신청" size="large" onClick={() => onOpenSeminarFnc()} />
        </>,
      );
    } else if (isParticipantListFetched) {
      if (myParticipation?.approvalStatus == '0001' || myParticipation?.approvalStatus == '0002') {
        setApplicationButton(
          <div className={cx('border-bottom-zero')}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Button color="lite-gray" label={`${myParticipation?.approvalStatusName}`} size="large" />
              </Grid>
              <Grid item xs={6}>
                <Button label={`신청 취소`} size="large" onClick={() => setIsModalCancelOpen(true)} />
              </Grid>
            </Grid>
          </div>,
        );
      } else {
        if (deadlineCount <= currentParticipantCount) {
          if (remainCount <= 0) {
            setApplicationButton(<Button label="마감완료! 다음에 신청해주세요!" size="large" disabled />);
          } else if (remainCount <= 3) {
            setApplicationButton(
              <Button
                label={`${remainCount}자리 남았어요! 참여 신쳥!`}
                size="large"
                onClick={() => setIsModalOpen(true)}
              />,
            );
          } else {
            setApplicationButton(
              <Button label="마감임박! 세미나 참여 신청!" size="large" onClick={() => setIsModalOpen(true)} />,
            );
          }
        } else {
          setApplicationButton(
            <Button label="멘토 세미나 참여 신청하기" size="large" onClick={() => setIsModalOpen(true)} />,
          );
        }
      }
    }
  }, [user, logged, restTime, myParticipation]);
  return (
    <>
      <Desktop>
        <div className={cx('seminar-detail-container')}>
          <BannerDetail
            title="퀴즈"
            subTitle="클럽 상세보기"
            imageName="top_banner_seminar.svg"
            data={undefined}
            setIsModalOpen={function (file: boolean): void {
              throw new Error('Function not implemented.');
            }}
          />
          <div className={cx('container')}>
            {/*바로 밑에 자식만 sticky 적용됨*/}
            <div className={cx('content-wrap')}>
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
                  <Tab label="퀴즈 소개" {...a11yProps(0)} onClick={() => handleClickTab(0)} />
                  <Tab label="크루활동" {...a11yProps(1)} onClick={() => handleClickTab(1)} />
                  {/* <Tab label="커리큘럼" {...a11yProps(2)} onClick={() => handleClickTab(2)} />
                  <Tab label="FAQ" {...a11yProps(3)} onClick={() => handleClickTab(3)} />
                  <Tab label="다른 세미나" {...a11yProps(4)} onClick={() => handleClickTab(4)} /> */}
                </Tabs>
                {/* <article> */}
                <TabPanel value={value} index={0} className="tw-p-5">
                  {/* <div
                      dangerouslySetInnerHTML={{ __html: data?.seminarIntroduction }}
                      className={cx('seminar-tabpanel__html-content')}
                    /> */}

                  <div className="tw-flex tw-items-center tw-space-x-4 tw-my-5">
                    <img
                      className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full"
                      src="https://robohash.org/doloremaliquidquia.png?size=150x150&set=set1"
                      alt=""
                    />
                    <div className="tw-text-base tw-font-semibold tw-text-black dark:tw-text-white">
                      <div>개발자</div>
                    </div>
                  </div>

                  <div className="tw-text-xl tw-mb-10 tw-font-bold tw-text-black dark:tw-text-gray-400">
                    퀴즈 클럽 소개
                  </div>
                  <div className="tw-text-base tw-mb-10 tw-font-normal tw-text-black dark:tw-text-gray-400">
                    비전공자 개발자라면, 컴퓨터 공학 지식에 대한 갈증이 있을텐데요. 혼자서는 끝까지 하기 어려운 이 공부,
                    우리 같이 퀴즈로 해봐요. 멀리 가려면 함께 가라는 말이 있는데, 우리 전원 퀴즈 달성도 100% 만들고,
                    컴퓨터 공학 지식 뿌셔요.
                  </div>

                  <div className="tw-text-xl tw-mb-10 tw-font-bold tw-text-black dark:tw-text-gray-400">
                    퀴즈 질문 미리보기
                  </div>

                  <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-400 dark:tw-text-gray-400">
                    12주 총 학습 36회 진행
                  </div>

                  <div className="tw-text-base tw-mb-3 tw-font-normal tw-text-black dark:tw-text-gray-400">
                    <span className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
                      대표1
                    </span>{' '}
                    ESB와 API Gateway 차이점에 대해서 설명하세요
                  </div>
                  <div className="tw-text-base tw-mb-3 tw-font-normal tw-text-black dark:tw-text-gray-400">
                    <span className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
                      대표2
                    </span>{' '}
                    JWT 토큰 변조방지 기법에 대해서 설명하세요.
                  </div>
                  <div className="tw-text-base tw-mb-24 tw-font-normal tw-text-black dark:tw-text-gray-400">
                    <span className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
                      대표3
                    </span>{' '}
                    MySQL에서 Gap Lock의 필요성에 대해서 설명하세요.
                  </div>

                  <button
                    type="button"
                    className="tw-w-full tw-text-white tw-bg-[#555555] hover:tw-bg-[#555555] tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-semibold tw-text-base tw-px-5 tw-py-5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
                  >
                    참여하기
                  </button>
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
                {/* <TabPanel value={value} index={3}>
                    <Typography type="H3" bold>
                      FAQ
                    </Typography>
                    <div>자주 묻는 질문들에 대한 답변입니다.</div>
                    <div
                      dangerouslySetInnerHTML={{ __html: data?.seminarFaq }}
                      className={cx('seminar-tabpanel__html-content')}
                    />
                  </TabPanel> */}
                {/* <TabPanel value={value} index={4}>
                    <Typography type="H3" bold>
                      다른 세미나
                    </Typography>
                    <div className={cx('seminar-content', 'flex-wrap-container')}>
                      <Grid container spacing={{ xs: 1.5, md: 1.5, sm: 1.5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                        {isContentFetched &&
                          (contents.length > 0 ? (
                            contents.map((item, i) => {
                              return (
                                <Grid item xs={6} sm={6} md={4} key={i}>
                                  <ArticleCard
                                    uiType={ArticleEnum.MENTOR_SEMINAR}
                                    content={item}
                                    key={i}
                                    className={cx('container__item')}
                                    mdSize="col-md-6"
                                  />
                                </Grid>
                              );
                            })
                          ) : (
                            <div className={cx('content--empty')}>데이터가 없습니다.</div>
                          ))}
                      </Grid>
                    </div>
                    <Link href={`/seminar`}>
                      <Button type="button" size="footer" color="primary">
                        모든 멘토 세미나 보러가기
                      </Button>
                    </Link>
                  </TabPanel> */}
                {/* </article> */}
              </div>
            </div>
          </div>
        </div>
      </Desktop>
    </>
  );
}

export default QuizDetailTemplate;
