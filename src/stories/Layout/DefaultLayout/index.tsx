import React, { ReactNode, useEffect, useState } from 'react';
import { Footer, Header } from '../../components';
import { Mobile, Desktop } from 'src/hooks/mediaQuery';
import { useSessionStore } from 'src/store/session';

export interface DefaultLayoutProps {
  /** 테마 색상 */
  darkBg?: boolean;
  /** 클래스 옵션 */
  classOption?: string;
  /** 로고 타이틀 (텍스트를 입력하지 않으면 이미지로...) */
  title?: string;
  /** 페이지 내용 */
  children: ReactNode | string;
  /** 푸터 사용 여부 */
  isFooter?: boolean;
}

const DefaultLayout = ({ darkBg, classOption, title, children, isFooter = true }: DefaultLayoutProps) => {
  const { memberId, logged } = useSessionStore.getState();
  const menuItem = [
    { no: 0, option: 'nav-item', title: '퀴즈클럽', link: '/quiz', dropdown: [], login: true },
    { no: 1, option: 'nav-item', title: '라운지', link: '/lounge', dropdown: [], login: true },
    { no: 2, option: 'nav-item', title: '나의 학습방', link: '/studyroom', dropdown: [], login: logged },
  ];

  const menuItemMobile = [
    { no: 0, option: 'nav-item', title: '퀴즈클럽', link: '/quiz', dropdown: [], login: true },
    { no: 1, option: 'nav-item', title: '라운지', link: '/lounge', dropdown: [], login: true },
    { no: 2, option: 'nav-item', title: '나의 학습방', link: '/studyroom', dropdown: [], login: logged },
  ];
  return (
    <div>
      <Desktop>
        <Header darkBg={darkBg} classOption={classOption} title={title} menuItem={menuItem} />
      </Desktop>
      <Mobile>
        <Header darkBg={darkBg} classOption={classOption} title={title} menuItem={menuItemMobile} />
      </Mobile>
      <section className="hero-section ptb-100">{children}</section>
      {isFooter && <Footer />}
    </div>
  );
};

export default DefaultLayout;
