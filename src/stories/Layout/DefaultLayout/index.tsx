import React, { ReactNode, useEffect, useState } from 'react';
import { Footer, Header } from '../../components';
import { Mobile, Desktop } from 'src/hooks/mediaQuery';
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
  const menuItem = [
    { no: 0, option: 'nav-item', title: '퀴즈클럽', link: '/quiz', dropdown: [] },
    // { no: 1, option: 'nav-item', title: '라운지', link: '/', dropdown: [] },
    // { no: 2, option: 'nav-item', title: '나의학습방', link: '/', dropdown: [] },
    // { no: 0, option: 'nav-item', title: '커멘소개', link: '/business', dropdown: [] },
    // {
    //   no: 1,
    //   title: '커멘네비',
    //   link: '#',
    //   option: 'nav-item dropdown',
    //   dropdown: [
    //     { no: 6, title: '커멘네비', link: '/diagram' },
    //     { no: 7, title: '스킬/경험 소개', link: '/skill' },
    //   ],
    // },
    // {
    //   no: 2,
    //   option: 'nav-item',
    //   title: '커멘토',
    //   link: '/mentoring',
    //   dropdown: [],
    // },
    // { no: 3, option: 'nav-item', title: '커멘세미나', link: '/seminar', dropdown: [] },
    // { no: 4, option: 'nav-item', title: '추천 커멘픽', link: '/contents', dropdown: [] },
    // { no: 5, option: 'nav-item', title: '커멘니티', link: '/community', dropdown: [] },
  ];

  const menuItemMobile = [
    // {
    //   no: 0,
    //   option: 'nav-item dropdown',
    //   title: '퀴즈클럽',
    //   link: '#',
    //   dropdown: [
    //     { no: 6, title: '성장퀴즈클럽', link: '/quiz' },
    //     { no: 7, title: '내가 만든 클럽', link: '/quiz-my' },
    //   ],
    // },
    { no: 0, option: 'nav-item', title: '퀴즈클럽', link: '/quiz', dropdown: [] },
    // { no: 1, option: 'nav-item', title: '라운지', link: '/', dropdown: [] },
    // { no: 2, option: 'nav-item', title: '나의학습방', link: '/', dropdown: [] },
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
