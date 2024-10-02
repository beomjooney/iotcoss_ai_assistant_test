import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { Modal } from 'src/stories/components';
import { useStore } from 'src/store';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Grid from '@mui/material/Grid';
import { useGetProfile, useMemberSummaryInfo } from 'src/services/account/account.queries';
import Button from '@mui/material/Button';
import { deleteCookie } from 'cookies-next';
import Image from 'next/image';
import MentorsModal from 'src/stories/components/MentorsModal';
import MyProfile from 'src/stories/components/MyProfile';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useStudyQuizOpponentBadgeList } from 'src/services/studyroom/studyroom.queries';
import { useSessionStore } from 'src/store/session';

import { Accordion, AccordionSummary, AccordionDetails, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const cx = classNames.bind(styles);

// type roleType = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_GUEST';

interface AdminTemplateProps {
  children: ReactNode;
}

export function AdminTemplate({ children }: AdminTemplateProps) {
  const router = useRouter();
  const { user, setUser } = useStore();
  const { memberId, menu } = useSessionStore();
  const [nickname, setNickname] = useState<string>('');
  const [summary, setSummary] = useState<any>([]);
  const [showMenu, setShowMenu] = useState<ReactNode>(null);
  const [showMenuMobile, setShowMenuMobile] = useState<ReactNode>(null);
  const [isShowMentorBtn, setIsShowMentorBtn] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [memberUUID, setMemberUUID] = useState<string>(memberId);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState<boolean>(false);
  // 회원 정보 저장
  const { isFetched: isUserFetched } = useMemberSummaryInfo(data => setSummary(data));

  // 회원 프로필 정보
  const { isFetched: isProfileFetched, refetch: refetchProfile } = useGetProfile(memberUUID, data => {
    console.log(data?.data?.data);
    setProfile(data?.data?.data);
    setUser({ user: data?.data?.data });
  });

  /** get badge */
  const [badgePage, setBadgePage] = useState(1);
  const [badgeParams, setBadgeParams] = useState<any>({ page: badgePage, memberUUID: memberUUID });
  const [badgeContents, setBadgeContents] = useState<any[]>([]);
  const { isFetched: isQuizbadgeFetched, refetch: QuizRefetchBadge } = useStudyQuizOpponentBadgeList(
    badgeParams,
    data => {
      setBadgeContents(data?.data?.contents);
    },
  );

  const showMentorChangeBtn = () => {
    let isUserRole = user?.roles?.find(_ => _ === 'ROLE_USER');
    let isUser = user?.type === '0001'; // 멘티
    setIsShowMentorBtn(!!isUserRole && isUser);
    return !!isUserRole && isUser;
  };

  const currentPath = router.pathname;
  // TODO 위에 타이틀 보여지게 하기 - menus에 다 넣고 옵션 값에 따라 role 맞춰 보여주기
  const menus = [
    { no: 0, title: '신규 클럽 승인', link: '/club', role: 'all' },
    { no: 1, title: '가입승인 대기 클럽목록', link: '/club-waiting', role: 'all' },
    { no: 3, title: '클럽 즐겨찾기 목록', link: '/favorites', role: 'all' },
    { no: 4, title: '내 친구관리', link: '/friends', role: 'all' },
    // { no: 5, title: '포인트 적립 내역', link: '/point', role: 'all' },
    { no: 2, title: '커뮤니티 작성글', link: '/admin-club', role: 'all' },
    { no: 6, title: '개인정보관리', link: '/member-edit', role: 'all' },
    // { no: 1, title: 'MY 레벨&성향', link: '/level-tendency', role: 'all' },
    // { no: 1, title: 'MY 학습 픽', link: '/learning' , role: 'all' },
    // { no: 3, title: '세미나 신청 내역', link: '/seminar-applications', role: 'all' },
    // { no: 4, title: '참여중인 그룹 스터디', link: '/study' , role: 'all' },
    // { no: 6, title: 'MY 멘토 프로필', link: '/growth-story', role: 'mentor' },
    // { no: 7, title: 'MY 멘토 픽', link: '/mentor', role: 'mentor' },
    // { no: 8, title: '새로운 세미나 개설하기', link: '/register-seminar', role: 'admin' },
  ];
  const currentMenu = menus.find(menu => currentPath.includes(menu.link));
  const handleMoveToMentorRegist = () => {
    router.push('/growth-story?type=MENTOR');
  };

  /**logout */
  const handleLogout = async () => {
    deleteCookie('access_token');
    localStorage.removeItem('auth-store');
    localStorage.removeItem('app-storage');
    location.href = '/';
  };

  useEffect(() => {
    showMentorChangeBtn();
  }, []);

  useEffect(() => {
    // console.log('user', user);
    setNickname(user?.nickname);
    setShowMenu(
      menus.map(menu => {
        return menu.role === 'all'
          ? menuItem(menu)
          : menu.role === 'admin' && user?.roles?.indexOf('ROLE_ADMIN') >= 0 && menuItem(menu);
      }),
    );
    setShowMenuMobile(
      menus.map(menu => {
        return menu.role === 'all'
          ? menuIteMobile(menu)
          : menu.role === 'admin' && user?.roles?.indexOf('ROLE_ADMIN') >= 0 && menuIteMobile(menu);
      }),
    );
  }, [user]);

  const menuItem = menu => {
    return (
      <div key={menu.no} className="tw-mt-0 tw-mb-3 tw-bg-white tw-px-5 tw-rounded-lg tw-font-semibold">
        <li
          className={cx({
            'lnb-content__item': true,
            'lnb-content__item--active': menu === currentMenu,
          })}
        >
          <span className={cx('ti-angle-right')} />
          <Link href={`/account/my${menu.link}`} className={cx('lnb-item__link')}>
            {menu.title}
          </Link>
        </li>
      </div>
    );
  };

  const menuIteMobile = menu => {
    return (
      <li
        key={menu.no}
        className={cx(
          {
            'lnb-content__item': true,
            'lnb-content__item--active': menu === currentMenu,
          },
          'tw-bg-white tw-py-4 tw-my-2 tw-rounded-md',
        )}
      >
        <span className={cx('ti-angle-right tw-px-5 tw-text-base')} />
        <Link href={`/account/my${menu.link}`} className={cx('lnb-item__link')}>
          <span className="tw-text-lg">{menu.title}</span>
        </Link>
      </li>
    );
  };

  // 프로필 정보 수정 시 변경 적용
  useEffect(() => {
    if (memberUUID) {
      console.log('memberUUID', memberUUID);
      refetchProfile();
      QuizRefetchBadge();
    }
  }, [memberUUID]);

  const handleClickProfile = memberUUID => {
    refetchProfile();
    setIsModalOpen(true);
    console.log('memberUUID1', memberUUID);
    setMemberUUID(memberUUID);
    setBadgeParams({ page: badgePage, memberUUID: memberUUID });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuClick = event => {
    event.stopPropagation(); // Accordion 토글 방지
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = event => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const [selected, setSelected] = useState('회원정보 관리');

  const handleClick = item => {
    setSelected(item);
  };

  return (
    <div>
      <Desktop>
        <div>
          <div className="container tw-pt-14 tw-pb-10">
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black">
                관리 페이지
              </Grid>
              <Grid item xs={7} className="tw-font-semi tw-text-base tw-text-black">
                관리 메인페이지 설명
              </Grid>
              <Grid item xs={3} justifyContent="flex-end" className="tw-flex"></Grid>
            </Grid>
          </div>
          <div className={cx('container', 'my-career')}>
            <div className={cx('lnb-area', 'tw-bg-gray-100', 'tw-rounded-lg')}>
              <div className="">
                <div className="tw-p-5">
                  <div className="tw-text-lg tw-pb-4 tw-font-semibold tw-text-black">
                    안녕하세요! {summary?.member?.nickname}님
                  </div>
                </div>
              </div>

              <ul className={cx('lnb-content', 'tw-px-5', 'tw-pt-0 tw-pb-5')}>
                <Accordion
                  defaultExpanded
                  elevation={0}
                  sx={{
                    marginTop: '10px',
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ backgroundColor: 'white', borderRadius: '20px', margin: '0px' }}
                  >
                    <Typography sx={{ flexGrow: 1, fontWeight: 'bold' }}>회원관리</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: '#fbfbfd' }}>
                    <div className="tw-flex-col tw-items-start tw-justify-between tw-gap-5 tw-pl-4 tw-pr-1">
                      <div
                        className={cx(
                          'tw-py-3 tw-mt-2 tw-text-black tw-flex tw-items-center tw-justify-between',
                          { 'tw-font-bold tw-text-blue-500': selected === '회원정보 관리' }, // Add condition for bold and color change
                        )}
                        onClick={() => handleClick('회원정보 관리')}
                        style={{ cursor: 'pointer' }} // Add pointer cursor for visual feedback
                      >
                        회원정보 관리
                        <span className={cx('ti-angle-right')} />
                      </div>
                      <div
                        className={cx(
                          'tw-py-3 tw-mt-2 tw-text-black tw-flex tw-items-center tw-justify-between',
                          { 'tw-font-bold tw-text-blue-500': selected === '교수자 권한 관리' }, // Condition for this item
                        )}
                        onClick={() => handleClick('교수자 권한 관리')}
                        style={{ cursor: 'pointer' }}
                      >
                        교수자 권한 관리
                        <span className={cx('ti-angle-right')} />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  defaultExpanded
                  elevation={0}
                  sx={{
                    marginTop: '10px',
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ backgroundColor: 'white', borderRadius: '20px', margin: '0px' }}
                  >
                    <Typography sx={{ flexGrow: 1, fontWeight: 'bold' }}>지식콘텐츠/퀴즈 관리</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: '#fbfbfd' }}>
                    <div className="tw-flex-col tw-items-start tw-justify-between tw-gap-5 tw-pl-4 tw-pr-1">
                      <div
                        className={cx(
                          'tw-py-3 tw-mt-2 tw-text-black tw-flex tw-items-center tw-justify-between',
                          { 'tw-font-bold tw-text-blue-500': selected === '지식콘텐츠 관리' }, // Condition for this item
                        )}
                        onClick={() => handleClick('지식콘텐츠 관리')}
                        style={{ cursor: 'pointer' }}
                      >
                        지식콘텐츠 관리
                        <span className={cx('ti-angle-right')} />
                      </div>
                      <div
                        className={cx(
                          'tw-py-3 tw-mt-2 tw-text-black tw-flex tw-items-center tw-justify-between',
                          { 'tw-font-bold tw-text-blue-500': selected === '퀴즈 관리' }, // Condition for this item
                        )}
                        onClick={() => handleClick('퀴즈 관리')}
                        style={{ cursor: 'pointer' }}
                      >
                        퀴즈 관리
                        <span className={cx('ti-angle-right')} />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </ul>
              {/* <ul className={cx('lnb-content', 'tw-px-5', 'tw-pt-0')}>{showMenu}</ul> */}
            </div>
            <div className={cx('page-area')}>
              <div className={cx('page-area__container')}>
                {/* <div className="tw-font-bold tw-text-xl tw-text-black tw-p-0">{currentMenu?.title}</div> */}
                {/* <div className="tw-font-bold tw-text-xl tw-text-black tw-p-0">회원정보 관리</div> */}
                {children}
              </div>
            </div>
          </div>
        </div>
      </Desktop>
      <MentorsModal
        title={'프로필 보기'}
        isOpen={isModalOpen}
        isProfile={true}
        onAfterClose={() => setIsModalOpen(false)}
      >
        {isProfileFetched && (
          <div>
            <MyProfile admin={true} profile={profile} badgeContents={badgeContents} refetchProfile={refetchProfile} />
          </div>
        )}
      </MentorsModal>
    </div>
  );
}
