import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '../index';
import { useRouter } from 'next/router';

export interface AdminNavbarProps {
  /** 하위 메뉴 */
  menuItem?: any[];
  activeNo?: number;
}

const cx = classNames.bind(styles);

const AdminHeader = ({ menuItem, activeNo = 0 }: AdminNavbarProps) => {
  const router = useRouter();
  const [menuOn, setMenuOn] = useState<number>();

  const [subMenuTitle, setSubmenuTitle] = useState<string>('');
  const [subMenuList, setSubMenuList] = useState<any[]>([]);
  const [subMenuOn, setSubMenuOn] = useState<boolean>(false);
  const [thirdMenuOn, setThirdMenuOn] = useState<boolean>(false);
  const [thridTarget, setThirdTarget] = useState<number>(0);

  useEffect(() => {
    menuItem && setMenuOn(activeNo);
  }, [activeNo]);

  const onMenuClick = (menuNo: number, istoggle?: boolean) => {
    setMenuOn(menuNo);
  };

  const onMenuShow = (upMenuNo: number) => {
    setSubMenuOn(true);
    switch (upMenuNo) {
      case 0:
        setSubMenuList([]);
        break;
      case 1:
        setSubmenuTitle('사용자 관리');
        setSubMenuList([
          {
            no: 101,
            title: '회원',
            link: '/admin/members',
            upMenuNo: 1,
            toggle: true,
            children: [{ no: 1011, title: '회원', link: '/admin/members' }],
          },
          {
            no: 102,
            title: '리더',
            link: 'javascript:void(0);',
            upMenuNo: 1,
            toggle: true,
            children: [
              { no: 1021, title: '리더', link: 'javascript:void(0);' },
              // { no: 1022, title: '리더신청', link: '#' },
            ],
          },
        ]);
        break;
      case 2:
        setSubmenuTitle('서비스 운영');
        setSubMenuList([
          {
            no: 201,
            title: '클럽',
            link: '/admin/club',
            upMenuNo: 2,
            toggle: true,
            children: [
              { no: 2011, title: '클럽', link: '/admin/club' },
              { no: 2012, title: '클럽퀴즈', link: '/admin/clubQuiz' },
            ],
          },
          {
            no: 202,
            title: '퀴즈',
            link: 'javascript:void(0);',
            upMenuNo: 2,
            toggle: true,
            children: [{ no: 2021, title: '퀴즈', link: '/admin/quiz' }],
          },
          {
            no: 203,
            title: '배너',
            link: 'javascript:void(0);',
            upMenuNo: 2,
            toggle: true,
            children: [{ no: 2031, title: '배너', link: 'javascript:void(0);' }],
          },
        ]);
        break;
      case 3:
        setSubmenuTitle('집계/통계');
        setSubMenuList([
          {
            no: 301,
            title: '통계',
            link: 'javascript:void(0);',
            upMenuNo: 3,
            toggle: true,
            children: [
              { no: 3011, title: '클럽통계', link: 'javascript:void(0);' },
              { no: 3012, title: '퀴즈통계', link: 'javascript:void(0);' },
              { no: 3013, title: '리더통계', link: 'javascript:void(0);' },
            ],
          },
        ]);
        break;
      case 4:
        setSubmenuTitle('콘텐츠 관리');
        setSubMenuList([
          {
            no: 401,
            title: '스킬/경험',
            link: 'javascript:void(0);',
            upMenuNo: 4,
            toggle: true,
            children: [
              { no: 4011, title: '스킬', link: '/admin/contents/skill' },
              { no: 4012, title: '경험', link: '/admin/contents/experience' },
            ],
          },
          {
            no: 402,
            title: '배지',
            link: 'javascript:void(0);',
            upMenuNo: 4,
            toggle: true,
            children: [{ no: 4021, title: '배지', link: '/admin/contents/badge' }],
          },
          {
            no: 403,
            title: '커리어',
            link: 'javascript:void(0);',
            upMenuNo: 4,
            toggle: true,
            children: [{ no: 4031, title: '커리어', link: 'javascript:void(0);' }],
          },
        ]);
        break;
      case 5:
        setSubmenuTitle('시스템관리');
        setSubMenuList([
          {
            no: 501,
            title: '정책관리',
            link: '/admin/terms',
            upMenuNo: 5,
            toggle: true,
            children: [
              { no: 5011, title: '정책(약관)', link: '/admin/terms' },
              { no: 5012, title: '정책동의', link: '/admin/termsAgree' },
            ],
          },
          {
            no: 502,
            title: '알림관리',
            link: 'javascript:void(0);',
            upMenuNo: 5,
            toggle: true,
            children: [{ no: 5021, title: '알람이벤트이력', link: '/admin/alarm' }],
          },
          {
            no: 503,
            title: '코드관리',
            link: 'javascript:void(0);',
            upMenuNo: 5,
            toggle: true,
            children: [
              { no: 5031, title: '코드그룹', link: 'javascript:void(0);' },
              { no: 5032, title: '코드상세', link: 'javascript:void(0);' },
            ],
          },
          {
            no: 504,
            title: '포인트관리',
            link: 'javascript:void(0);',
            upMenuNo: 5,
            toggle: true,
            children: [{ no: 5041, title: '포인트이력', link: '/admin/point' }],
          },
        ]);
        break;
    }
  };

  const onTitleClick = (menuNo: number, istoggle?: boolean) => {
    const copiedMenuList = [...subMenuList];
    for (let i in subMenuList) {
      if (subMenuList[i].no === menuNo) {
        copiedMenuList[i] = {
          ...subMenuList[i],
          toggle: istoggle,
        };
      }
    }
    setSubMenuList(copiedMenuList);
  };
  return (
    <div className="header-admin" onMouseLeave={() => setSubMenuOn(false)} style={{ zIndex: 70 }}>
      {/* <Image
        src="/assets/images/LOGO.svg"
        alt="커리어멘토스 로고"
        layout="fixed"
        width={100}
        height={40}
        className={cx('image-logo')}
      /> */}
      {/* <h1 className="logo">데브어스</h1> */}
      <div className="gnb-menu" style={{ width: 100 }}>
        <ul>
          {menuItem?.map(item => {
            return (
              <li
                className={item.link === router.asPath ? 'on' : ''}
                key={`admin-menu-${item.no}`}
                onMouseEnter={() => onMenuShow(item.no)}
              >
                <Link href={item.link} className="nav-link" onClick={() => onMenuClick(item.no)}>
                  <img src={item.icon} alt="icon"></img>
                  <span className={cx('title')}>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={subMenuOn && subMenuList.length ? 'gnb-menu-2depth on' : 'gnb-menu-2depth'}>
        <div className="menu-wrap">
          <h2 className="gng-tit">{subMenuTitle}</h2>
          <ul>
            {subMenuList.map(item => {
              return (
                <li className="on" key={item.no} onMouseEnter={() => onMenuClick(item.no)}>
                  <a className={cx('menu-title')} onClick={() => onTitleClick(item.no, !item.toggle)}>
                    <span>{item.title}</span>
                  </a>

                  <ul className="" style={{ display: `${item.toggle ? 'block' : 'none'}` }}>
                    {item?.children?.map(thirdItem => {
                      return (
                        <li key={thirdItem?.no}>
                          <Link href={thirdItem?.link} className="" key={item.no}>
                            <span>{thirdItem?.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/*<div className="user-menu">*/}
      {/*  <a href="javascript:void(0);">*/}
      {/*    <i className="ico i-user"></i>*/}
      {/*  </a>*/}
      {/*  <a href="javascript:void(0);">*/}
      {/*    <i className="ico i-logout"></i>*/}
      {/*  </a>*/}
      {/*</div>*/}
    </div>
  );
};

export default AdminHeader;
