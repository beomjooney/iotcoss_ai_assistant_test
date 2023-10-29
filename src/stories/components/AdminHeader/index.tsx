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
            children: [{ no: 1011, title: '회원관리', link: '/admin/members' }],
          },
          // {
          //   no: 102,
          //   title: '멘토',
          //   link: '#',
          //   upMenuNo: 1,
          //   toggle: true,
          //   children: [
          //     { no: 1022, title: '멘토 관리', link: '/admin/mentors/growth-story' },
          //     { no: 1021, title: '멘토 신청관리', link: '/admin/mentors' },
          //   ],
          // },
        ]);
        break;
      case 2:
        setSubmenuTitle('서비스 운영');
        setSubMenuList([
          {
            no: 201,
            title: '커리어세미나',
            link: '',
            upMenuNo: 2,
            toggle: true,
            children: [
              { no: 2011, title: '세미나관리', link: '/admin/seminar' },
              { no: 2012, title: '배너관리', link: '/admin/banner/seminar' },
              { no: 2013, title: '메세지발송이력', link: '/admin/pushhistory' },
            ],
          },
        ]);
        break;
      case 3:
        setSubmenuTitle('콘텐츠 관리');
        setSubMenuList([
          {
            no: 301,
            title: '커리어네비게이션',
            link: '#',
            upMenuNo: 3,
            toggle: true,
            children: [
              { no: 3011, title: '성장노드', link: '/admin/contents/growthNode' },
              { no: 3012, title: '성장엣지', link: '/admin/contents/growthEdge' },
            ],
          },
          {
            no: 302,
            title: '직무역량',
            link: '#',
            upMenuNo: 3,
            toggle: true,
            children: [
              { no: 3021, title: '역량', link: '/admin/contents/capability' },
              { no: 3022, title: '역량레벨', link: '/admin/contents/capability-level' },
            ],
          },
          {
            no: 303,
            title: '스킬/경험',
            link: '#',
            upMenuNo: 3,
            toggle: true,
            children: [
              { no: 3031, title: '스킬', link: '/admin/contents/skill' },
              { no: 3032, title: '경험', link: '/admin/contents/experience' },
            ],
          },
          {
            no: 304,
            title: '추천커맨픽',
            link: '#',
            upMenuNo: 3,
            toggle: true,
            children: [
              { no: 3041, title: '추천콘텐츠', link: '/admin/contents/recommend-contents' },
              { no: 3042, title: '추천서비스', link: '/admin/contents/recommend-service' },
            ],
          },
          {
            no: 305,
            title: '게시판',
            link: '#',
            upMenuNo: 3,
            toggle: true,
            children: [{ no: 3051, title: '커멘니티', link: '/admin/contents/camenity' }],
          },
        ]);
        break;
      case 4:
        setSubmenuTitle('시스템관리');
        setSubMenuList([
          {
            no: 401,
            title: '정책관리',
            link: '#',
            upMenuNo: 4,
            toggle: true,
            children: [{ no: 4011, title: '약관관리', link: '#' }],
          },
          {
            no: 402,
            title: '알림관리',
            link: '#',
            upMenuNo: 4,
            toggle: true,
            children: [
              { no: 4021, title: '알람발송이력', link: '#' },
              { no: 4022, title: 'OTP이력', link: '#' },
            ],
          },
          {
            no: 403,
            title: '코드관리',
            link: '#',
            upMenuNo: 4,
            toggle: true,
            children: [
              { no: 4031, title: '코드그룹관리', link: '/admin/system/manage-code' },
              { no: 4032, title: '코드상세관리', link: '/admin/system/code-detail  ' },
            ],
          },
          {
            no: 404,
            title: '오류관리',
            link: '#',
            toggle: true,
            upMenuNo: 4,
            children: [{ no: 4041, title: '시스템오류관리', link: '#' }],
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
      <h1 className="logo">데브어스</h1>
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
