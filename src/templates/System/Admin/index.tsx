import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { useStore } from 'src/store';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Grid from '@mui/material/Grid';
import { useGetProfile, useMemberSummaryInfo } from 'src/services/account/account.queries';
import { useStudyQuizMemberList } from 'src/services/studyroom/studyroom.queries';
import { useSessionStore } from 'src/store/session';

import { Accordion, AccordionSummary, AccordionDetails, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

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
  const [keyword, setKeyword] = useState('');
  const [badgeParams, setBadgeParams] = useState<any>({ page: badgePage, keyword: keyword });
  // const [memberList, setMemberList] = useState<any[]>([]);
  // const { isFetched: isMemberListFetched, refetch: QuizRefetchBadge } = useStudyQuizMemberList(badgeParams, data => {
  //   console.log(data?.data?.content);
  //   setMemberList(data?.data?.content);
  // });

  const showMentorChangeBtn = () => {
    let isUserRole = user?.roles?.find(_ => _ === 'ROLE_USER');
    let isUser = user?.type === '0001'; // 멘티
    setIsShowMentorBtn(!!isUserRole && isUser);
    return !!isUserRole && isUser;
  };

  const currentPath = router.pathname;
  // TODO 위에 타이틀 보여지게 하기 - menus에 다 넣고 옵션 값에 따라 role 맞춰 보여주기
  const menus = [
    {
      no: 0,
      title: '클럽관리',
      role: 'all',
      sub: [
        { no: 0, title: '신규 클럽 승인', link: '/system/admin/club-approval', role: 'all' },
        { no: 1, title: '승인된 클럽 관리', link: '/system/admin/club-management', role: 'all' },
      ],
    },
    {
      no: 1,
      title: '회원관리',
      role: 'all',
      sub: [
        { no: 0, title: '회원정보 관리', link: '/system/admin/club', role: 'all' },
        { no: 1, title: '교수자 권한 관리', link: '/system/admin/role', role: 'all' },
        { no: 2, title: '정책(약관)동의 조회', link: '/system/admin/terms', role: 'all' },
        { no: 3, title: '계정연동테스트', link: '/system/admin/account-link-test', role: 'all' },
      ],
    },
    // {
    //   no: 1,
    //   title: '권한관리',
    //   role: 'all',
    //   sub: [{ no: 0, title: '기업관리 권한 관리', link: '/system/admin/company-management', role: 'all' }],
    // },
    {
      no: 2,
      title: '지식콘텐츠/퀴즈 관리',
      role: 'use_quiz_club',
      sub: [
        { no: 0, title: '지식콘텐츠 관리', link: '/system/admin/knowledge', role: 'all' },
        { no: 1, title: '퀴즈 관리', link: '/system/admin/quiz', role: 'all' },
      ],
    },
    {
      no: 3,
      title: '통계/분석',
      role: 'all',
      sub: [{ no: 0, title: '통계 대시보드', link: '/system/admin/dashboard', role: 'all' }],
    },
  ];

  const currentSubMenu = menus
    .flatMap(menu => menu.sub) // 모든 메뉴의 하위 메뉴만 추출
    .find(subMenu => currentPath.includes(subMenu.link)); // 하위 메뉴에서 경로 일치 확인

  useEffect(() => {
    showMentorChangeBtn();
  }, []);

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

  const [selected, setSelected] = useState('/system/admin/club');

  // useEffect(() => {
  //   // 쿼리 파라미터에서 selected 값을 가져옴
  //   if (router.query.selected) {
  //     setSelected(router.query.selected);
  //   }
  // }, [router.query.selected]);

  const handleClick = (menu, path) => {
    setSelected(menu);
    router.push(
      {
        pathname: path,
        query: { selected: menu }, // 쿼리 파라미터로 selected 값 전달
      },
      `${path}`,
    );
  };
  // const currentMenu = menus.find(menu => currentPath);
  // const isClub = currentPath.includes('/club');
  // const isClubWaiting = currentPath.includes('/club-waiting');
  // const isFavorites = currentPath.includes('/favorites');
  // const isFriends = currentPath.includes('/friends');
  // const isAdminClub = currentPath.includes('/admin-club');
  // const isMemberEdit = currentPath.includes('/member-edit');

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
                주요 관리 기능과 시스템 현황을 한눈에 확인하고 조작할 수 있습니다.
              </Grid>
              <Grid item xs={3} justifyContent="flex-end" className="tw-flex"></Grid>
            </Grid>
          </div>
          <div className={cx('container', 'my-career')}>
            <div className={cx('lnb-area', 'tw-bg-gray-100', 'tw-rounded-lg')}>
              <div className="">
                <div className="tw-p-5">
                  <div className="tw-text-lg tw-pb-4 tw-font-semibold tw-text-black">
                    {/* 안녕하세요! {summary?.member?.nickname}님 */}
                    안녕하세요! 관리자님
                  </div>
                </div>
              </div>

              <ul className={cx('lnb-content', 'tw-px-5', 'tw-pt-0 tw-pb-5')}>
                {menus.map(
                  menua =>
                    (menua.role === 'all' || (menua.role === 'use_quiz_club' && menu.use_quiz_club === true)) && (
                      <Accordion
                        key={menua.no}
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
                          <Typography sx={{ flexGrow: 1, fontWeight: 'bold' }}>{menua.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ backgroundColor: '#fbfbfd' }}>
                          <div className="tw-flex-col tw-items-start tw-justify-between tw-gap-5 tw-pl-4 tw-pr-1">
                            {menua.sub.map(subMenu => (
                              <div
                                key={subMenu.no}
                                className={cx(
                                  'tw-py-3 tw-mt-2 tw-text-black tw-flex tw-items-center tw-justify-between',
                                  { 'tw-font-bold tw-text-blue-500': currentSubMenu.title === subMenu.title }, // Add condition for bold and color change
                                )}
                                onClick={() => handleClick(subMenu.title, subMenu.link)}
                                style={{ cursor: 'pointer' }} // Add pointer cursor for visual feedback
                              >
                                {subMenu.title}
                              </div>
                            ))}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    ),
                )}
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
    </div>
  );
}
