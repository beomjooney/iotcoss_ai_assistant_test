import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from 'src/stories/components/Button';
import React, { ReactNode, useEffect, useState } from 'react';
import { Modal } from 'src/stories/components';
import { useStore } from 'src/store';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';

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
  const [showMenu, setShowMenu] = useState<ReactNode>(null);
  const [showMenuMobile, setShowMenuMobile] = useState<ReactNode>(null);

  const [isShowMentorBtn, setIsShowMentorBtn] = useState<boolean>(false);

  const showMentorChangeBtn = () => {
    let isUserRole = user?.roles?.find(_ => _ === 'ROLE_USER');
    let isUser = user?.type === '0001'; // 멘티

    setIsShowMentorBtn(!!isUserRole && isUser);

    return !!isUserRole && isUser;
  };
  const currentPath = router.pathname;
  // TODO 위에 타이틀 보여지게 하기 - menus에 다 넣고 옵션 값에 따라 role 맞춰 보여주기
  const menus = [
    // { no: 0, title: '레벨&성향 테스트', link: '/test' , role: 'all' },
    { no: 0, title: 'MY 성장스토리', link: '/growth-story', role: 'all' },
    // { no: 1, title: 'MY 레벨&성향', link: '/level-tendency' , role: 'all' },
    // { no: 1, title: 'MY 학습 픽', link: '/learning' , role: 'all' },
    { no: 2, title: 'MY 멘토 픽', link: '/mentor', role: 'all' },
    { no: 3, title: '세미나 신청 내역', link: '/seminar-applications', role: 'all' },
    // { no: 4, title: '참여중인 그룹 스터디', link: '/study' , role: 'all' },
    { no: 5, title: '회원 정보 수정', link: '/member-edit', role: 'all' },
    //
    { no: 6, title: 'MY 멘토 프로필', link: '/growth-story', role: 'mentor' },
    { no: 7, title: 'MY 멘토 픽', link: '/mentor', role: 'mentor' },
    //
    { no: 8, title: '새로운 세미나 개설하기', link: '/register-seminar', role: 'admin' },
  ];
  const currentMenu = menus.find(menu => currentPath.includes(menu.link));
  const handleMoveToMentorRegist = () => {
    router.push('/growth-story?type=MENTOR');
  };

  useEffect(() => {
    showMentorChangeBtn();
  }, []);

  useEffect(() => {
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
      <Mobile>
        <div className={cx('container', 'my-career-mobile')}>
          <h4 className={cx('lnb-area')}>
            안녕하세요!
            <br />
            {nickname}님
          </h4>
          {isShowMentorBtn && (
            <Button
              color="secondary"
              label="멘토 계정으로 전환하기 >"
              size="large"
              onClick={() => setIsModalOpen(true)}
            />
          )}

          <div className={cx('lnb-area')}>
            <div className={cx('lnb-title')}>
              <ul className={cx('lnb-content')}>
                <div>{showMenu}</div>
              </ul>
              <Modal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} title="멘토 계정 전환 안내">
                <div className={cx('mentor-change-container__card-nodes')}>
                  <div className={cx('mb-5')}>
                    성장 스토리 내역이 없습니다. <br />
                    성장 스토리 입력 후 신청하여 주시기 바랍니다.
                  </div>
                  <div>
                    {/*TODO 성장스토리 여부에 따라 모달 뜨게 할 것*/}
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
              </Modal>
            </div>
          </div>
          <div className={cx('page-area-mobile')}>
            <div className={cx('page-area-mobile__container')}>
              <h3>{currentMenu?.title}</h3>
              {children}
            </div>
          </div>
        </div>
      </Mobile>
      <Desktop>
        <div className={cx('container', 'my-career')}>
          <div className={cx('lnb-area')}>
            <h2 className={cx('lnb-title')}>
              안녕하세요!
              <br />
              {nickname}님
            </h2>
            <ul className={cx('lnb-content')}>{showMenu}</ul>

            {/*TODO 성장 스토리 2차 오픈*/}
            {/*<Button*/}
            {/*  color="primary"*/}
            {/*  label="성장 스토리 입력하기 >"*/}
            {/*  size="medium"*/}
            {/*  className={cx('mb-2')}*/}
            {/*  onClick={handleMoveToMentorRegist}*/}
            {/*/>*/}
            {isShowMentorBtn && (
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
                  {/*TODO 성장스토리 여부에 따라 모달 뜨게 할 것*/}
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
            </Modal>
          </div>
          <div className={cx('page-area')}>
            <div className={cx('page-area__container')}>
              <h3>{currentMenu?.title}</h3>
              {children}
            </div>
          </div>
        </div>
      </Desktop>
    </div>
  );
}
