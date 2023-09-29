import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { Modal } from 'src/stories/components';
import { useStore } from 'src/store';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Grid from '@mui/material/Grid';
import { useMemberSummaryInfo } from 'src/services/account/account.queries';
import Button from '@mui/material/Button';
import { deleteCookie } from 'cookies-next';
import Image from 'next/image';

const cx = classNames.bind(styles);

// type roleType = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_GUEST';

interface MyTemplateProps {
  children: ReactNode;
}

export function MyTemplate({ children }: MyTemplateProps) {
  const router = useRouter();
  const { user } = useStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('');
  const [summary, setSummary] = useState({});
  const [showMenu, setShowMenu] = useState<ReactNode>(null);
  const [showMenuMobile, setShowMenuMobile] = useState<ReactNode>(null);
  const [isShowMentorBtn, setIsShowMentorBtn] = useState<boolean>(false);
  const { isFetched: isUserFetched } = useMemberSummaryInfo(data => setSummary(data));

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
    { no: 1, title: '가입승인 대기 클럽목록', link: '/club-waiting', role: 'all' },
    { no: 2, title: '개설신청 대기 클럽목록', link: '/admin-club', role: 'all' },
    { no: 3, title: '즐겨찾기', link: '/favorites', role: 'all' },
    { no: 4, title: '포인트 적립 내역', link: '/point', role: 'all' },
    { no: 5, title: '개인정보관리', link: '/member-edit', role: 'all' },
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
    setNickname(user.nickname);
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
          : menu.role === 'admin' && user?.roles?.indexOf('ROLE_ADMIN') >= 0 && menuItem(menu);
      }),
    );
  }, [user]);

  const menuItem = menu => {
    return (
      <div className="tw-mt-0 tw-mb-3 tw-bg-white tw-px-5 tw-rounded-lg tw-font-semibold">
        <li
          key={menu.no}
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
    );
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
                  <div className="tw-text-lg tw-pb-4 tw-font-semibold tw-text-black">안녕하세요! {nickname}님</div>
                  <div className="tw-p-5 tw-mb-5 tw-bg-white tw-rounded-lg">
                    <div className="tw-p-5 tw-text-center ">
                      <div className="tw-flex tw-justify-center tw-py-0">
                        {/* <img
                          className="tw-w-13 tw-h-13 tw-ring-1 tw-rounded-full "
                          src={summary?.profileImageUrl}
                          alt=""
                        /> */}

                        <Image
                          src={summary?.profileImageUrl}
                          alt="profile_image"
                          className={cx('rounded-circle', 'image-info__image')}
                          width="110px"
                          height="110px"
                          objectFit="cover"
                          unoptimized={true}
                        />
                      </div>
                      <div className="tw-py-3 tw-font-semibold tw-text-black tw-text-lg">{summary?.nickname}</div>
                      <div>
                        {summary?.jobGroupName && (
                          <span className="tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
                            {summary.jobGroupName}
                          </span>
                        )}
                        {summary?.level && (
                          <span className="tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
                            {summary.level}레벨
                          </span>
                        )}
                        {summary?.jobName && (
                          <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
                            {summary.jobName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="tw-text-gray-500 tw-text-sm tw-font-medium ">
                      <div className="tw-py-5 tw-flex tw-justify-between">
                        <div> 보유 포인트 </div>
                        <div>{summary?.points}</div>
                      </div>
                      <div className="tw-flex tw-justify-between">
                        <div> 가입일 </div>
                        <div>{summary?.joinDate}</div>
                      </div>
                      <div className="tw-flex tw-justify-between">
                        <div> 방문횟수 </div>
                        <div>{summary?.visitCount}</div>
                      </div>
                      <div className="tw-py-3 ">
                        <div className="tw-flex tw-justify-between">
                          <div> 내가 만든 퀴즈 </div>
                          <div>{summary?.createdQuizCount}</div>
                        </div>
                        <div className="tw-flex tw-justify-between">
                          <div> 내가 만든 클럽 </div>
                          <div>{summary?.createdClubCount}</div>
                        </div>
                      </div>
                      <div className="tw-py-3 ">
                        <div className="tw-flex tw-justify-between">
                          <div> 내가 푼 퀴즈 </div>
                          <div>{summary?.solvedQuizCount}</div>
                        </div>
                        <div className="tw-flex tw-justify-between">
                          <div> 내가 쓴 댓글 </div>
                          <div>{summary?.replyCount}</div>
                        </div>
                        <div className="tw-flex tw-justify-between">
                          <div> 내가 참여한 클럽 </div>
                          <div>{summary?.joinedClubCount}</div>
                        </div>
                      </div>
                    </div>

                    <div className="tw-flex tw-justify-between tw-mt-2 tw-gap-2">
                      <Button
                        className="tw-w-full  "
                        variant="outlined"
                        sx={{
                          borderColor: 'gray',
                          color: 'gray',
                        }}
                        onClick={() => (location.href = '/profile')}
                      >
                        프로필바로가기
                      </Button>
                      <Button
                        className="tw-w-full "
                        variant="outlined"
                        onClick={handleLogout}
                        sx={{
                          borderColor: 'gray',
                          color: 'gray',
                        }}
                      >
                        로그아웃
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <ul className={cx('lnb-content', 'tw-px-5', 'tw-pt-0')}>{showMenu}</ul>

              {/*TODO 성장 스토리 2차 오픈*/}
              {/*<Button*/}
              {/*  color="primary"*/}
              {/*  label="성장 스토리 입력하기 >"*/}
              {/*  size="medium"*/}
              {/*  className={cx('mb-2')}*/}
              {/*  onClick={handleMoveToMentorRegist}*/}
              {/*/>*/}
              {/* {isShowMentorBtn && (
                <Button
                  color="secondary"
                  label="멘토 계정으로 전환하기 >"
                  size="medium"
                  onClick={() => setIsModalOpen(true)}
                />
              )}
              <Modal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} title="멘토 계정 전환 안내">
                <div className={cx('mentor-change-container__card-nodes')}>
                  <div className={cx('mb-5')}>
                    성장 스토리 내역이 없습니다. <br />
                    성장 스토리 입력 후 신청하여 주시기 바랍니다.
                  </div>
                  <div>
                    <Button
                      color="primary"
                      label="성장 스토리 입력하기"
                      size="small"
                      className={cx('mr-2')}
                      onClick={handleMoveToMentorRegist}
                    />
                    <Button color="secondary" label="닫기" size="small" onClick={() => setIsModalOpen(false)} />
                  </div>
                </div>
              </Modal> */}
            </div>
            <div className={cx('page-area')}>
              <div className={cx('page-area__container')}>
                <h3>{currentMenu?.title}</h3>
                {children}
              </div>
            </div>
          </div>
        </div>
      </Desktop>
    </div>
  );
}
