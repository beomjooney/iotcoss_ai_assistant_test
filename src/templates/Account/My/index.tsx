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
import { useStudyQuizOpponentBadgeList } from 'src/services/studyroom/studyroom.queries';
import { useSessionStore } from 'src/store/session';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const cx = classNames.bind(styles);

// type roleType = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_GUEST';

interface MyTemplateProps {
  children: ReactNode;
}

export function MyTemplate({ children }: MyTemplateProps) {
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
    { no: 0, title: '나의 활동', link: '/activity', role: 'all' },
    { no: 1, title: '내 지도교수자 관리', link: '/my-advisor-manager', role: 'all' },
    { no: 2, title: '가입승인 대기 클럽목록', link: '/club-waiting', role: 'all' },
    { no: 3, title: '클럽 즐겨찾기 목록', link: '/favorites', role: 'all' },
    { no: 4, title: '내 친구관리', link: '/friends', role: 'all' },
    { no: 5, title: '커뮤니티 작성글', link: '/admin-club', role: 'all' },
    { no: 6, title: '개인정보관리', link: '/member-edit', role: 'all' },
    { no: 7, title: '기업체 정보공유관리', link: '/company-profile-edit', role: 'all' },
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
          <span className="tw-text-gray-400 tw-mr-2">
            <ChevronRightIcon color="action" />
          </span>

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

  return (
    <div>
      <Desktop>
        <div>
          <div className="container tw-py-5">
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black">
                마이페이지
              </Grid>
              <Grid item xs={7} className="tw-font-semi tw-text-base tw-text-black"></Grid>
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
                  <div className="tw-p-5 tw-mb-5 tw-bg-white tw-rounded-lg">
                    <div className="tw-flex tw-justify-between tw-mt-2 tw-gap-2 tw-text-center tw-pb-5">
                      <div className="tw-p-1 tw-flex-1 border-right">
                        <div className="tw-text-[12px] tw-font-bold">보유포인트</div>
                        <div className="tw-text-lg tw-font-bold tw-text-red-500 tw-py-1">
                          {summary?.points?.toLocaleString()}P
                        </div>
                      </div>
                      {menu.use_quiz_club && (
                        <div className="tw-p-1 tw-flex-1 border-right">
                          <div className="tw-text-[12px]  tw-font-bold">푼 퀴즈</div>
                          <div className="tw-text-lg tw-font-bold tw-text-red-500  tw-py-1">
                            {summary?.solvedQuizCount || 0}개
                          </div>
                        </div>
                      )}
                      <div className="tw-p-1 tw-flex-1">
                        <div className="tw-text-[12px]  tw-font-bold">참여중 클럽</div>
                        <div className="tw-text-lg tw-font-bold tw-text-red-500  tw-py-1">
                          {summary?.joinedClubCount?.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="tw-flex tw-justify-between tw-mt-2 tw-gap-5">
                      <button
                        className="tw-py-2.5 tw-w-full tw-bg-black tw-text-white tw-rounded"
                        onClick={() => handleClickProfile(summary?.member?.memberUUID)}
                      >
                        프로필 보기
                      </button>
                      <button className="tw-w-full border tw-text-gray-400 tw-rounded" onClick={handleLogout}>
                        로그아웃
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <ul className={cx('lnb-content', 'tw-px-5', 'tw-pt-0')}>{showMenu}</ul>
            </div>
            <div className={cx('page-area')}>
              <div className={cx('page-area__container')}>
                <div className="tw-font-bold tw-text-xl tw-text-black tw-p-0">{currentMenu?.title}</div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </Desktop>
      <Mobile>
        <div>
          <div className="tw-py-5 tw-mt-10">
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={7} className="tw-font-bold tw-text-3xl tw-text-black">
                마이페이지
              </Grid>
              <Grid item xs={2} className="tw-font-semi tw-text-base tw-text-black"></Grid>
              <Grid item xs={2} justifyContent="flex-end" className="tw-flex"></Grid>
            </Grid>
          </div>
          <div>
            <div className={cx('lnb-area', 'tw-bg-gray-100', 'tw-rounded-lg')}>
              <ul className={cx('lnb-content', 'tw-px-5', 'tw-pt-5', 'tw-bg-gray-100')}>{showMenuMobile}</ul>
              <div className="">
                <div className="tw-p-5">
                  <div className="tw-text-lg tw-pb-4 tw-font-semibold tw-text-black">안녕하세요! {nickname}님</div>
                  <div className="tw-p-5 tw-mb-5 tw-bg-white tw-rounded-lg">
                    <div className="tw-py-5 tw-px-0 tw-text-center ">
                      <div className="tw-flex tw-justify-center tw-py-0">
                        <Image
                          src={summary?.profileImageUrl || 'D'}
                          alt="profile_image"
                          className={cx('rounded-circle', 'image-info__image')}
                          width="110px"
                          height="110px"
                          objectFit="cover"
                          unoptimized={true}
                        />
                      </div>
                      <div className="tw-py-3 tw-font-semibold tw-text-black tw-text-lg">{summary?.nickname}</div>
                      <div className="">
                        {summary?.jobGroupName && (
                          <span className=" tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-[5px] tw-rounded">
                            {summary.jobGroupName}
                          </span>
                        )}
                        {summary?.level && (
                          <span className=" tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-[5px] tw-rounded">
                            {summary.level}레벨
                          </span>
                        )}
                        {summary?.jobName && (
                          <span className=" tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-[5px] tw-rounded">
                            {summary.jobName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="tw-flex tw-justify-between tw-mt-2 tw-gap-2">
                      <Button
                        className="tw-w-full"
                        variant="outlined"
                        sx={{
                          borderColor: 'gray',
                          color: 'gray',
                          fontSize: '15px',
                        }}
                        onClick={() => handleClickProfile()}
                      >
                        프로필 바로가기
                      </Button>
                      <Button
                        className="tw-w-full "
                        variant="outlined"
                        onClick={handleLogout}
                        sx={{
                          borderColor: 'gray',
                          color: 'gray',
                          fontSize: '15px',
                        }}
                      >
                        로그아웃
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={cx('page-area')}>
              <div className={cx('page-area__container')}>
                <h6 className="tw-py-3 tw-px-2 tw-font-bold">{currentMenu?.title}</h6>
                {children}
              </div>
            </div>
          </div>
        </div>
      </Mobile>
      <MentorsModal
        title={'프로필 보기'}
        isOpen={isModalOpen}
        isContentModalClick={false}
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
