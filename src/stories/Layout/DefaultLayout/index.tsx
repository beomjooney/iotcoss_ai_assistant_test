import React, { ReactNode } from 'react';
import { Footer, Header } from '../../components';
import { Mobile, Desktop } from 'src/hooks/mediaQuery';
import { useSessionStore } from 'src/store/session';
import { getFirstSubdomain } from 'src/utils';
import { useState, useEffect, isValidElement, cloneElement } from 'react';
import { useGuestTenant } from 'src/services/seminars/seminars.queries';
import { setCookie } from 'cookies-next';

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
  const { logged, update } = useSessionStore.getState();
  const [isContentRendered, setIsContentRendered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // 서브 도메인이 없는 경우 dsu로 설정
  const subDomain = getFirstSubdomain() || 'dsu';

  //미로그인 데이터 처리
  if (!logged) {
    useGuestTenant(subDomain, data => {
      setCookie('access_token', data?.guestToken);
      // console.log('access_data', data);
      update({
        tenantName: data?.tenantId,
        tenantUri: data?.tenantUri,
        loginType: data?.loginTypes,
        // tenantName: data?.tenantName,
        redirections: data?.homeUrl,
        registrationAuthenticationType: data?.registrationAuthenticationType,
        menu: {
          use_lecture_club: data?.lectureClubUseYn === 'YES' ? true : false,

          use_quiz_club: data?.quizClubUseYn === 'YES' ? true : false,
        },
      });
    });
  }

  const { menu, roles } = useSessionStore.getState();
  // console.log('menu', menu);

  const menuItem = [
    {
      no: 0,
      option: 'nav-item',
      title: '서비스 소개',
      link: '/',
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
      role: ['ROLE_MANAGER', 'ROLE_INSTRUCTOR'],
      menu: 'use_quiz_club',
    },
    {
      no: 5,
      option: 'nav-item',
      title: 'My퀴즈클럽',
      link: '/my-clubs',
      dropdown: [],
      login: logged,
      role: ['ROLE_MANAGER', 'ROLE_INSTRUCTOR'],
      menu: 'use_quiz_club',
    },
    {
      no: 6,
      option: 'nav-item',
      title: 'My강의클럽',
      link: '/my-lecture-clubs',
      dropdown: [],
      login: logged,
      role: ['ROLE_MANAGER', 'ROLE_INSTRUCTOR'],
      menu: 'use_lecture_club',
    },
    {
      no: 7,
      option: 'nav-item',
      title: '관리 페이지',
      link: '/system/admin/club-approval',
      dropdown: [],
      login: logged,
      role: ['ROLE_MANAGER'], // Multiple roles
      menu: 'all',
    },
  ];

  // Check if menuRole is empty
  const isMenuRoleEmpty = Object.keys(menu).length === 0;

  // Filter menu items based on menuRole and the empty case
  const filteredMenuItems = menuItem.filter(item => {
    // 접근 권한을 확인하는 함수
    const hasAccess = () => {
      if (!item.role) return true; // role이 지정되지 않은 경우 모든 로그인 사용자에게 표시
      // 사용자 roles 배열과 item.role 배열의 교집합이 있는지 확인
      return item.role.some(role => roles.includes(role));
    };

    if (isMenuRoleEmpty) {
      // If menuRole is empty, show all items related to 'use_lecture_club' and 'use_quiz_club'
      return (item.menu === 'all' || item.menu === 'use_quiz_club') && hasAccess();
    } else {
      // Otherwise, filter based on menuRole
      return (item.menu === 'all' || (item.menu && menu[item.menu])) && hasAccess();
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
