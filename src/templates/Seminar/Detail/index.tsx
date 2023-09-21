import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Banner from 'src/stories/components/Banner';
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
export interface SeminarDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function SeminarDetailTemplate({ id }: SeminarDetailTemplateProps) {
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
      <Mobile>
        <div className={cx('seminar-detail-container-mobile')}>
          <Banner title="커리어멘토스 세미나" subTitle="커멘세미나 상세" imageName="top_banner_seminar.svg" />

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
          <div className={cx('container')}>
            <aside className={cx('sticky')}>
              <div className={cx('top-area')}>
                {data?.recommendJobGroupNames?.map((name, i) => (
                  <Chip
                    key={`job_${i}`}
                    chipColor={jobColorKey(data?.recommendJobGroups[i])}
                    radius={4}
                    variant="outlined"
                  >
                    {name}
                  </Chip>
                ))}
                <Chip key="seminar" chipColor="gray" radius={4} variant="outlined">
                  {data?.seminarPlaceTypeName} 세미나
                </Chip>
                {/*TODO chipColor 새로 정의하여 적용 필요*/}
                <Chip chipColor="primary" radius={4} variant="filled">
                  {data?.recommendLevels.sort().join(',')}레벨 추천
                </Chip>
                {/*TODO 북마크 기능 개발 필요*/}
                {/*<div className={cx('top-area__bookmark')}>*/}
                {/*  {isBookmark ? <BookmarkOutlinedIcon /> : <BookmarkBorderIcon />}*/}
                {/*</div>*/}
              </div>
              <div className={cx('title-area')}>
                <div className={cx('title-area__title')}>{data?.seminarTitle}</div>
                <p className={cx('title-area__title')}>- {data?.seminarSubTitle} -</p>
                <span className={cx('title-area__tags')}>{data?.keywords.map(tag => `#${tag} `)}</span>
              </div>
              <div className={cx('mentor-area')}>{lectureName()} 멘토</div>
              <div className={cx('detail-area')}>
                <p className={cx('detail-area__date')}>
                  일시 :{' '}
                  <span className={cx('text-bold')}>
                    {toDateDurationText(data?.seminarStartDate, data?.seminarEndDate)}
                  </span>
                </p>
                <p>
                  신청 : {toDatetimeText(data?.seminarRegistrationStartDate)} ~{' '}
                  {toDatetimeText(data?.seminarRegistrationEndDate)}
                </p>
                <p>장소 : {data?.seminarPlaceTypeName}으로 진행하는 행사입니다.</p>
                <p>
                  {data?.seminarPlaceType === '0001' ? '스트리밍' : '위치'} : {data?.seminarPlace}
                </p>
                <p className={cx('detail-area--time', 'text-highlight')}>
                  {restTime >= 0 ? `(약 ${restTime + 1}시간 후 마감)` : `접수 마감`}
                </p>
              </div>
              <div className={cx('recruitment-area')}>
                <p>선착순 모집</p>
                <p className={cx('phone-desc')}>마이커리어 &gt; 회원정보에 휴대전화 등록 후 신청 가능 합니다.</p>
                {logged ? (
                  user?.roles?.indexOf('ROLE_ADMIN') >= 0 ? (
                    //관리자 모집 인원
                    <span className={cx('text-bold')}>
                      모집 인원 : <span className={cx('text-highlight')}>{data?.currentParticipantCount}</span>/
                      {data?.participantCount}명{' '}
                    </span>
                  ) : (
                    <span className={cx('text-bold')}>모집 인원 :{data?.participantCount}명 </span>
                  )
                ) : (
                  //일반 모집 인원
                  <span className={cx('text-bold')}>모집 인원 :{data?.participantCount}명 </span>
                )}
                <span className={cx('recruitment-area__price', 'text-bold')}>Free</span>
              </div>
              {applicationButton}
              <Modal
                isOpen={isModalOpen}
                onAfterClose={() => setIsModalOpen(false)}
                title="세미나 신청"
                maxWidth="500px"
              >
                <div className={cx('seminar-check-popup')}>
                  <div className={cx('mb-5')}>
                    {lectureName()} 멘토의 <span className={cx('text-bold')}>'{data?.seminarTitle}'</span> 세미나를 신청
                    하시겠습니까?
                  </div>
                  <div>
                    <Button
                      color="primary"
                      label="신청"
                      size="modal"
                      className={cx('mr-2')}
                      onClick={() => handleParticipant()}
                    />
                    <Button color="secondary" label="취소" size="modal" onClick={() => setIsModalOpen(false)} />
                  </div>
                </div>
              </Modal>
              <Modal
                isOpen={isModalCancelOpen}
                onAfterClose={() => setIsModalCancelOpen(false)}
                title="세미나 취소"
                maxWidth="500px"
              >
                <div className={cx('seminar-check-popup')}>
                  <div className={cx('mb-5')}>
                    {lectureName()} 멘토의 <span className={cx('text-bold')}>'{data?.seminarTitle}'</span> 세미나를 취소
                    하시겠습니까?
                  </div>
                  <div>
                    <Button
                      color="primary"
                      label="예"
                      size="modal"
                      className={cx('mr-2')}
                      onClick={() => handleCancelParticipant()}
                    />
                    <Button color="secondary" label="아니요" size="modal" onClick={() => setIsModalCancelOpen(false)} />
                  </div>
                </div>
              </Modal>
            </aside>
          </div>
          <div className={cx('container')}>
            {/*바로 밑에 자식만 sticky 적용됨*/}
            <div className={cx('content-wrap')}>
              <div className={cx('content')}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={cx('tabs', 'sticky')}
                >
                  <Tab label="세미나 소개" {...a11yProps(0)} onClick={() => handleClickTab(0)} />
                  <Tab label="멘토 소개" {...a11yProps(1)} onClick={() => handleClickTab(1)} />
                  <Tab label="커리큘럼" {...a11yProps(2)} onClick={() => handleClickTab(2)} />
                  <Tab label="FAQ" {...a11yProps(3)} onClick={() => handleClickTab(3)} />
                  <Tab label="다른 세미나" {...a11yProps(4)} onClick={() => handleClickTab(4)} />
                </Tabs>
                <article>
                  <TabPanel value={value} index={0}>
                    <div
                      dangerouslySetInnerHTML={{ __html: data?.seminarIntroduction }}
                      className={cx('seminar-tabpanel__html-content')}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1} className={cx('row')}>
                    <Profile
                      showDesc
                      mentorInfo={data?.seminarLecturer}
                      className={cx('seminar-tabpanel-1__profile', 'col-md-4')}
                      imageSize={160}
                      colorMode="primary"
                      isDetail
                    />
                    <div className={cx('seminar-tabpanel-1__info', 'col-md-8')}>
                      <Typography type="H3" bold>
                        {lectureName()} 멘토
                      </Typography>
                      <div className={cx('seminar-tabpanel-1__info-desc', 'mt-2')}>
                        {data?.seminarLecturer?.introductionMessage}
                      </div>
                      <Link href={`/mentoring/${data?.seminarLecturer?.memberUri}`}>
                        <Button type="button" color="primary" className={cx('mt-3')}>
                          멘토 소개 페이지 가기
                        </Button>
                      </Link>
                    </div>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Typography type="H3" bold>
                      커리큘럼
                    </Typography>
                    <div
                      dangerouslySetInnerHTML={{ __html: data?.seminarCurriculum }}
                      className={cx('seminar-tabpanel__html-content')}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <Typography type="H3" bold>
                      FAQ
                    </Typography>
                    <div>자주 묻는 질문들에 대한 답변입니다.</div>
                    <div
                      dangerouslySetInnerHTML={{ __html: data?.seminarFaq }}
                      className={cx('seminar-tabpanel__html-content')}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={4}>
                    <Typography type="H3" bold>
                      다른 세미나
                    </Typography>
                    <div className={cx('seminar-content', 'flex-wrap-container')}>
                      <Grid container spacing={{ xs: 1.5, md: 1.5, sm: 1.5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                        {isContentFetched &&
                          (contents.length > 0 ? (
                            contents.map((item, i) => {
                              return (
                                <Grid item xs={6} sm={6} md={3} key={i}>
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
                  </TabPanel>
                </article>
              </div>
            </div>
          </div>
        </div>
      </Mobile>
      <Desktop>
        <div className={cx('seminar-detail-container')}>
          <Banner title="커리어멘토스 세미나" subTitle="커멘세미나 상세" imageName="top_banner_seminar.svg" />
          <div className={cx('container')}>
            {/*바로 밑에 자식만 sticky 적용됨*/}
            <aside className={cx('sticky')}>
              <div className={cx('top-area')}>
                {data?.recommendJobGroupNames?.map((name, i) => (
                  <Chip
                    key={`job_${i}`}
                    chipColor={jobColorKey(data?.recommendJobGroups[i])}
                    radius={4}
                    variant="outlined"
                  >
                    {name}
                  </Chip>
                ))}
                <Chip key="seminar" chipColor="gray" radius={4} variant="outlined">
                  {data?.seminarPlaceTypeName} 세미나
                </Chip>
                {/*TODO chipColor 새로 정의하여 적용 필요*/}
                <Chip chipColor="primary" radius={4} variant="filled">
                  {data?.recommendLevels.sort().join(',')}레벨 추천
                </Chip>
                {/*TODO 북마크 기능 개발 필요*/}
                {/*<div className={cx('top-area__bookmark')}>*/}
                {/*  {isBookmark ? <BookmarkOutlinedIcon /> : <BookmarkBorderIcon />}*/}
                {/*</div>*/}
              </div>
              <div className={cx('title-area')}>
                <div className={cx('title-area__title')}>{data?.seminarTitle}</div>
                <p className={cx('title-area__title')}>- {data?.seminarSubTitle} -</p>
                <span className={cx('title-area__tags')}>{data?.keywords.map(tag => `#${tag} `)}</span>
              </div>
              <div className={cx('mentor-area')}>{lectureName()} 멘토</div>
              <div className={cx('detail-area')}>
                <p className={cx('detail-area__date')}>
                  일시 :{' '}
                  <span className={cx('text-bold')}>
                    {toDateDurationText(data?.seminarStartDate, data?.seminarEndDate)}
                  </span>
                </p>
                <p>
                  신청 : {toDatetimeText(data?.seminarRegistrationStartDate)} ~{' '}
                  {toDatetimeText(data?.seminarRegistrationEndDate)}
                </p>
                <p>장소 : {data?.seminarPlaceTypeName}으로 진행하는 행사입니다.</p>
                <p>
                  {data?.seminarPlaceType === '0001' ? '스트리밍' : '위치'} : {data?.seminarPlace}
                </p>
                <p className={cx('detail-area--time', 'text-highlight')}>
                  {restTime >= 0 ? `(약 ${restTime + 1}시간 후 마감)` : `접수 마감`}
                </p>
              </div>
              <div className={cx('recruitment-area')}>
                <p>선착순 모집</p>
                <p className={cx('phone-desc')}>마이커리어 &gt; 회원정보에 휴대전화 등록 후 신청 가능 합니다.</p>
                {logged ? (
                  user?.roles?.indexOf('ROLE_ADMIN') >= 0 ? (
                    //관리자 모집 인원
                    <span className={cx('text-bold')}>
                      모집 인원 : <span className={cx('text-highlight')}>{data?.currentParticipantCount}</span>/
                      {data?.participantCount}명{' '}
                    </span>
                  ) : (
                    <span className={cx('text-bold')}>모집 인원 :{data?.participantCount}명 </span>
                  )
                ) : (
                  //일반 모집 인원
                  <span className={cx('text-bold')}>모집 인원 :{data?.participantCount}명 </span>
                )}
                <span className={cx('recruitment-area__price', 'text-bold')}>Free</span>
              </div>
              {applicationButton}
              <Modal
                isOpen={isModalOpen}
                onAfterClose={() => setIsModalOpen(false)}
                title="세미나 신청"
                maxWidth="500px"
              >
                <div className={cx('seminar-check-popup')}>
                  <div className={cx('mb-5')}>
                    {lectureName()} 멘토의 <span className={cx('text-bold')}>'{data?.seminarTitle}'</span> 세미나를 신청
                    하시겠습니까?
                  </div>
                  <div>
                    <Button
                      color="primary"
                      label="신청"
                      size="modal"
                      className={cx('mr-2')}
                      onClick={() => handleParticipant()}
                    />
                    <Button color="secondary" label="취소" size="modal" onClick={() => setIsModalOpen(false)} />
                  </div>
                </div>
              </Modal>
              <Modal
                isOpen={isModalCancelOpen}
                onAfterClose={() => setIsModalCancelOpen(false)}
                title="세미나 취소"
                maxWidth="500px"
              >
                <div className={cx('seminar-check-popup')}>
                  <div className={cx('mb-5')}>
                    {lectureName()} 멘토의 <span className={cx('text-bold')}>'{data?.seminarTitle}'</span> 세미나를 취소
                    하시겠습니까?
                  </div>
                  <div>
                    <Button
                      color="primary"
                      label="예"
                      size="modal"
                      className={cx('mr-2')}
                      onClick={() => handleCancelParticipant()}
                    />
                    <Button color="secondary" label="아니요" size="modal" onClick={() => setIsModalCancelOpen(false)} />
                  </div>
                </div>
              </Modal>
            </aside>
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
                  <Tab label="세미나 소개" {...a11yProps(0)} onClick={() => handleClickTab(0)} />
                  <Tab label="멘토 소개" {...a11yProps(1)} onClick={() => handleClickTab(1)} />
                  <Tab label="커리큘럼" {...a11yProps(2)} onClick={() => handleClickTab(2)} />
                  <Tab label="FAQ" {...a11yProps(3)} onClick={() => handleClickTab(3)} />
                  <Tab label="다른 세미나" {...a11yProps(4)} onClick={() => handleClickTab(4)} />
                </Tabs>
                <article>
                  <TabPanel value={value} index={0}>
                    <div
                      dangerouslySetInnerHTML={{ __html: data?.seminarIntroduction }}
                      className={cx('seminar-tabpanel__html-content')}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1} className={cx('row')}>
                    <Profile
                      showDesc
                      mentorInfo={data?.seminarLecturer}
                      className={cx('seminar-tabpanel-1__profile', 'col-md-4')}
                      imageSize={160}
                      colorMode="primary"
                      isDetail
                    />
                    <div className={cx('seminar-tabpanel-1__info', 'col-md-8')}>
                      <Typography type="H3" bold>
                        {lectureName()} 멘토
                      </Typography>
                      <div className={cx('seminar-tabpanel-1__info-desc', 'mt-2')}>
                        {data?.seminarLecturer?.introductionMessage}
                      </div>
                      <Link href={`/mentoring/${data?.seminarLecturer?.memberUri}`}>
                        <Button type="button" color="primary" className={cx('mt-3')}>
                          멘토 소개 페이지 가기
                        </Button>
                      </Link>
                    </div>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Typography type="H3" bold>
                      커리큘럼
                    </Typography>
                    <div
                      dangerouslySetInnerHTML={{ __html: data?.seminarCurriculum }}
                      className={cx('seminar-tabpanel__html-content')}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <Typography type="H3" bold>
                      FAQ
                    </Typography>
                    <div>자주 묻는 질문들에 대한 답변입니다.</div>
                    <div
                      dangerouslySetInnerHTML={{ __html: data?.seminarFaq }}
                      className={cx('seminar-tabpanel__html-content')}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={4}>
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
                  </TabPanel>
                </article>
              </div>
            </div>
          </div>
        </div>
      </Desktop>
    </>
  );
}

export default SeminarDetailTemplate;
