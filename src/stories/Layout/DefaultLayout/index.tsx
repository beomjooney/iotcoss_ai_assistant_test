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

  const menuItem = [
    {
      no: 0,
      option: 'nav-item',
      title: '서비스 소개',
      link: subDomain ? `/${subDomain}` : '/',
      dropdown: [],
      login: true,
      subdomain: 'common',
    },
    {
      no: 1,
      option: 'nav-item',
      title: '퀴즈클럽',
      link: '/quiz',
      dropdown: [],
      login: true,
      subdomain: 'dsu,iotcoss',
    },
    {
      no: 1,
      option: 'nav-item',
      title: '강의클럽',
      link: '/lecture',
      dropdown: [],
      login: true,
      subdomain: 'iotcoss',
    },
    {
      no: 1,
      option: 'nav-item',
      title: 'My 학습방',
      link: '/studyroom',
      dropdown: [],
      login: logged,
      subdomain: 'common',
    },
    {
      no: 1,
      option: 'nav-item',
      title: 'My 퀴즈',
      link: '/quiz-make',
      dropdown: [],
      login: logged,
      role: 'ROLE_MANAGER',
      subdomain: 'dsu,iotcoss',
    },
    {
      no: 1,
      option: 'nav-item',
      title: 'My 퀴즈클럽',
      link: '/my-clubs',
      dropdown: [],
      login: logged,
      role: 'ROLE_MANAGER',
      subdomain: 'dsu,iotcoss',
    },
    {
      no: 1,
      option: 'nav-item',
      title: 'My 강의클럽',
      link: '/my-lecture-clubs',
      dropdown: [],
      login: logged,
      subdomain: 'iotcoss',
      role: 'ROLE_MANAGER',
    },
  ];

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
          menuItem={menuItem}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </Desktop>
      <Mobile>
        <Header darkBg={darkBg} classOption={classOption} title={title} menuItem={menuItem} />
      </Mobile>

      {/* <section className="hero-section ptb-100">{children}</section> */}
      <section className="hero-section ptb-100"> {renderChildrenWithProps()}</section>
      {isContentRendered && <Footer />}
    </div>
  );
};

export default DefaultLayout;
