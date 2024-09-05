import React, { ReactNode } from 'react';
import { Footer, Header } from '../../components';
import { Mobile, Desktop } from 'src/hooks/mediaQuery';
import { useSessionStore } from 'src/store/session';
import { getFirstSubdomain } from 'src/utils';
import { useState, useEffect, isValidElement, cloneElement } from 'react';

export interface DefaultLayoutProps {
  /** 테마 색상 */
  darkBg?: boolean;
  /** 클래스 옵션 */
  classOption?: string;
  /** 로고 타이틀 (텍스트를 입력하지 않으면 이미지로...) */
  title?: string;
  /** 페이지 내용 */
  children: ReactNode | string;
}

const DefaultLayout = ({ darkBg, classOption, title, children }: DefaultLayoutProps) => {
  const { logged } = useSessionStore.getState();
  const [isContentRendered, setIsContentRendered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const subDomain = getFirstSubdomain();

  const { menu } = useSessionStore.getState();
  // console.log('menu', menu);

  // const menu = {
  //   use_lecture_club: true,
  //   use_quiz_club: true,
  // };

  const menuItem = [
    {
      no: 0,
      option: 'nav-item',
      title: '서비스 소개',
      link: '/',
      // link: subDomain ? `/${subDomain}` : '/',
      dropdown: [],
      login: true,
      menu: 'all',
    },
    {
      no: 1,
      option: 'nav-item',
      title: '퀴즈클럽',
      link: '/quiz',
      dropdown: [],
      login: true,
      menu: 'use_quiz_club',
    },
    {
      no: 2,
      option: 'nav-item',
      title: '강의클럽',
      link: '/lecture',
      dropdown: [],
      login: true,
      menu: 'use_lecture_club',
    },
    {
      no: 3,
      option: 'nav-item',
      title: 'My학습방',
      link: '/studyroom',
      dropdown: [],
      login: logged,
      menu: 'all',
    },
    {
      no: 4,
      option: 'nav-item',
      title: 'My퀴즈',
      link: '/quiz-make',
      dropdown: [],
      login: logged,
      role: 'ROLE_MANAGER',
      menu: 'use_quiz_club',
    },
    {
      no: 5,
      option: 'nav-item',
      title: 'My퀴즈클럽',
      link: '/my-clubs',
      dropdown: [],
      login: logged,
      role: 'ROLE_MANAGER',
      menu: 'use_quiz_club',
    },
    {
      no: 6,
      option: 'nav-item',
      title: 'My강의클럽',
      link: '/my-lecture-clubs',
      dropdown: [],
      login: logged,
      role: 'ROLE_MANAGER',
      menu: 'use_lecture_club',
    },
  ];

  // Check if menuRole is empty
  const isMenuRoleEmpty = Object.keys(menu).length === 0;

  // Filter menu items based on menuRole and the empty case
  const filteredMenuItems = menuItem.filter(item => {
    if (isMenuRoleEmpty) {
      // If menuRole is empty, show all items related to 'use_lecture_club' and 'use_quiz_club'
      // return item.menu === 'all' || item.menu === 'use_quiz_club' || item.menu === 'use_lecture_club';
      return item.menu === 'all' || item.menu === 'use_quiz_club';
    } else {
      // Otherwise, filter based on menuRole
      return item.menu === 'all' || (item.menu && menu[item.menu]);
    }
  });
  // console.log(filteredMenuItems);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setIsContentRendered(true);
    }
  }, [isMounted]);

  const [activeIndex, setActiveIndex] = useState(0);

  // 클라이언트에서만 localStorage를 사용할 수 있도록 useEffect 내부에서 설정
  useEffect(() => {
    const savedIndex = localStorage.getItem('activeIndex');
    if (savedIndex !== null) {
      setActiveIndex(parseInt(savedIndex, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeIndex', activeIndex.toString());
  }, [activeIndex]);

  const renderChildrenWithProps = () => {
    if (isValidElement(children)) {
      return cloneElement(children as React.ReactElement<any>, { setActiveIndex });
    }
    return children;
  };

  return (
    <div>
      <Desktop>
        <Header
          darkBg={darkBg}
          classOption={classOption}
          title={title}
          menuItem={filteredMenuItems}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </Desktop>
      <Mobile>
        <Header darkBg={darkBg} classOption={classOption} title={title} menuItem={filteredMenuItems} />
      </Mobile>

      {/* <section className="hero-section ptb-100">{children}</section> */}
      <section className="hero-section ptb-100"> {renderChildrenWithProps()}</section>
      {isContentRendered && <Footer />}
    </div>
  );
};

export default DefaultLayout;
