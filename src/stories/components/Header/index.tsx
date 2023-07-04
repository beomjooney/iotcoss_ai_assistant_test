import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../store/session';
import { deleteCookie } from 'cookies-next';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import HomeIcon from '@mui/icons-material/Home';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import AttachmentIcon from '@mui/icons-material/Attachment';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import DvrIcon from '@mui/icons-material/Dvr';
import AddLinkIcon from '@mui/icons-material/AddLink';

import { Typography } from '../index';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import ListItem from '@mui/material/ListItem';
export interface NavbarProps {
  /** 테마 색상 */
  darkBg?: boolean;
  /** 클래스 옵션 */
  classOption?: string;
  /** 로고 타이틀 (텍스트를 입력하지 않으면 이미지로...) */
  title?: string;
  /** 하위 메뉴 */
  menuItem?: any[];
}

const cx = classNames.bind(styles);

const Header = ({ darkBg, classOption, title, menuItem }: NavbarProps) => {
  const { logged, roles } = useSessionStore.getState();

  const router = useRouter();
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [buttonName, setButtonName] = useState<string>('로그인');
  const [logoutButton, setLogoutButton] = useState<ReactNode>(null);
  const [adminButton, setAdminButton] = useState<ReactNode>(null);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    logged && setButtonName('마이커리어');
    logged
      ? setLogoutButton(
          <li className={cx('custom-item')} id="logoutBtn">
            <Button size="small" color="primary" onClick={handleLogout}>
              로그아웃
            </Button>
          </li>,
        )
      : setLogoutButton(null);
    !logged && setButtonName('로그인');
  }, [logged]);

  useEffect(() => {
    roles.length > 0 && roles[0] === 'ROLE_ADMIN'
      ? setAdminButton(
          <li className={cx('custom-item')} id="logoutBtn">
            <Button size="small" color="primary" onClick={() => (location.href = '/admin')}>
              관리자용
            </Button>
          </li>,
        )
      : setAdminButton(null);
  }, [roles]);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  const handleClick = async () => {
    setMenuOpen(false);
    if (logged) {
      await router.push('/account/my/growth-story');
    } else {
      await router.push('/account/login');
    }
  };

  const handleLogout = async () => {
    deleteCookie('access_token');
    localStorage.removeItem('auth-store');
    localStorage.removeItem('app-storage');
    location.href = '/';
  };

  const handleGoHome = async () => {
    await router.push('/');
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const handleCloseMenu = () => {
    setMenuOpen(false);
  };
  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const list = (menuItem: any) => (
    <Box role="presentation">
      <div
        className="pt-3 pb-3 footer-nav-wrap text-white"
        style={{ textAlign: 'left', paddingLeft: '20px', backgroundColor: '#a9abaf' }}
      >
        <Typography type="H3" weight="bold">
          커리어멘토스
        </Typography>
      </div>
      <Divider />
      <Link href="/" className="nav-link">
        <ListItem disablePadding sx={{ justifyContent: 'start !important', padding: '0.5 !important' }}>
          <ListItemButton
            onClick={event => {
              setMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            홈
          </ListItemButton>
        </ListItem>
      </Link>
      <Divider variant="inset" component="li" />
      {menuItem?.map((item, index) => {
        return (
          <>
            <Link href={item.link} className="nav-link">
              <ListItem
                key={item.no}
                disablePadding
                sx={{ justifyContent: 'start !important', padding: '0.5 !important' }}
              >
                <ListItemButton
                  onClick={event => {
                    setMenuOpen(false);
                  }}
                >
                  <ListItemIcon>
                    {index === 0 ? (
                      <ContentPasteIcon />
                    ) : index === 1 ? (
                      <ForkRightIcon />
                    ) : index === 2 ? (
                      <AttachmentIcon />
                    ) : index === 3 ? (
                      <EscalatorWarningIcon />
                    ) : index === 4 ? (
                      <DvrIcon />
                    ) : index === 5 ? (
                      <AddLinkIcon />
                    ) : (
                      <AdUnitsIcon />
                    )}
                  </ListItemIcon>
                  {/* <Link href={item.link} className="nav-link"> */}
                  {item.title}
                  {/* </Link> */}
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider variant="inset" component="li" />
          </>
        );
      })}
      <ListItemButton>
        <li className={cx('custom-item', 'pt-3')}>
          <Button size="small" color="primary" onClick={handleClick}>
            {buttonName}
          </Button>
        </li>
        <li className={cx('custom-item', 'pt-3')}>{adminButton}</li>
        <li className={cx('custom-item', 'pt-3')}>{logoutButton}</li>
      </ListItemButton>
    </Box>
  );
  return (
    <>
      <header className={`header ${classOption}`}>
        <nav
          className={`navbar navbar-expand-lg fixed-top ${darkBg ? 'bg-transparent' : 'custom-nav white-bg'} ${
            scroll > headerTop ? 'affix' : ''
          }`}
        >
          <div className="container" style={{ alignItems: 'center' }}>
            <div className={cx('header-link', 'navbar-brand')} onClick={handleGoHome}>
              <Mobile>
                <img
                  src="/assets/images/mobile-CI_color_text.png"
                  width={120}
                  alt="logo"
                  className={cx('image-logo')}
                />
              </Mobile>
              <Desktop>
                <img src="/assets/images/cm_CI_co_1000x225.png" width={147} alt="logo" className={cx('image-logo')} />
              </Desktop>
            </div>
            <Mobile>
              <IconButton
                sx={{
                  padding: '0 !important',
                  '& .MuiSvgIcon-root': { color: '#000', fontSize: 28, padding: 0 },
                }}
                size="large"
                aria-label="open drawer"
                onClick={handleOpenMenu}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Mobile>
            {/* <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              // onClick={() => setIsShowMenu(!isShowMenu)}
              onClick={handleOpenMenu}
            >
              <span className="ti-menu"></span>
            </button> */}
            <SwipeableDrawer
              anchor={'right'}
              open={menuOpen}
              onClose={handleCloseMenu}
              onOpen={handleOpenMenu}
              PaperProps={{
                sx: { width: '70%' },
              }}
            >
              {list(menuItem)}
            </SwipeableDrawer>
            <div
              className={cx('collapse navbar-collapse main-menu', 'navbar-mobile', isShowMenu ? 'show' : '')}
              id="navbarSupportedContent"
            >
              <ul className={cx('nav-custom', 'navbar-custom-mobile', 'navbar-nav ml-auto')}>
                {menuItem?.map(item => {
                  return (
                    <li key={item.no} className={item.option}>
                      <Link href={item.link} className="nav-link">
                        <a
                          onClick={() => {
                            if (item.dropdown.length === 0) setIsShowMenu(!isShowMenu);
                          }}
                        >
                          {item.title}
                        </a>
                      </Link>
                      <div className="dropdown-menu submenu" aria-labelledby="navbarDropdownHome">
                        {item.dropdown.map(menu => {
                          return (
                            <Link key={menu.no} href={menu.link} className="dropdown-item">
                              <a
                                onClick={() => {
                                  setIsShowMenu(!isShowMenu);
                                }}
                              >
                                {menu.title}
                              </a>
                            </Link>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
                <li className={cx('custom-item')}>
                  <Button size="small" color="primary" onClick={handleClick}>
                    {buttonName}
                  </Button>
                </li>
                {adminButton}
                {logoutButton}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
