import styles from './index.module.scss';
import React, { ReactNode, useEffect, useState } from 'react';
import { Footer } from '../../components';
import AdminHeader from '../../components/AdminHeader';
import classNames from 'classnames/bind';
import { useSessionStore } from '../../../store/session';
import { styled, useTheme } from '@mui/material/styles';

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
  resolution?: number;
}

const cx = classNames.bind(styles);

const AdminLayout = ({ darkBg, classOption, title, children, isFooter = true, resolution = 0 }: DefaultLayoutProps) => {
  const { roles } = useSessionStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 0),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (roles[0] !== 'ROLE_ADMIN') {
      timer = setTimeout(() => {
        alert('접근 권한이 없습니다.');
        location.href = '/';
      }, 10);
    } else {
      setIsLoading(false);
    }
    return () => clearTimeout(timer);
  }, []);

  const menuItem = [
    {
      no: 0,
      option: 'nav-item',
      title: '대시보드',
      link: '/admin',
      icon: '/assets/images/icons/dashboard.png',
    },
    {
      no: 1,
      title: '사용자',
      link: '/admin/members',
      icon: '/assets/images/icons/user.png',
    },
    {
      no: 2,
      option: 'nav-item',
      title: '서비스운영',
      link: '/admin/club',
      icon: '/assets/images/icons/service.png',
    },
    // {
    //   no: 3,
    //   option: 'nav-item',
    //   title: '집계/통계',
    //   link: 'javascript:void(0);',
    //   icon: '/assets/images/icons/content.png',
    // },
    {
      no: 4,
      option: 'nav-item',
      title: '콘텐츠',
      link: '/admin/contents/skill',
      icon: '/assets/images/icons/content.png',
    },
    { no: 5, option: 'nav-item', title: '시스템', link: '/admin/terms', icon: '/assets/images/icons/system.png' },
  ];

  return (
    <>
      {!isLoading && (
        <div className="wrapper">
          <div className={cx('container')}>
            <AdminHeader menuItem={menuItem} />
            <main className={cx('main')}>
              <div className={cx('content', `resolution--${resolution}`)}>{children}</div>
            </main>
          </div>
          {/*{isFooter && <Footer />}*/}
        </div>
      )}
    </>
  );
};

export default AdminLayout;
