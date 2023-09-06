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
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useStore } from 'src/store';
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClicks = (event: React.MouseEvent<HTMLElement>) => {
    console.log('kimcy', event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();
  const { user, setUser } = useStore();
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
    logged
      ? setLogoutButton(
          <li className={cx('custom-item')} id="logoutBtn">
            <Button className="tw-mr-4" size="small" color="primary" onClick={() => (location.href = '/quiz-make')}>
              퀴즈 만들기
            </Button>
            {/* <Button size="small" color="primary" onClick={handleLogout}>
              로그아웃
            </Button> */}
          </li>,
        )
      : setLogoutButton(null);
  }, [logged]);

  // useEffect(() => {
  //   roles.length > 0 && roles[0] === 'ROLE_ADMIN'
  //     ? setAdminButton(
  //         <li className={cx('custom-item')} id="logoutBtn">
  //           <Button size="small" color="primary" onClick={() => (location.href = '/quiz-make')}>
  //             퀴즈 만들기
  //           </Button>
  //         </li>,
  //       )
  //     : setAdminButton(null);
  // }, [roles]);

  // useEffect(() => {
  //   roles.length > 0 && roles[0] === 'ROLE_ADMIN'
  //     ? setAdminButton(
  //         <li className={cx('custom-item')} id="logoutBtn">
  //           <Button size="small" color="primary" onClick={() => (location.href = '/admin')}>
  //             관리자용
  //           </Button>
  //         </li>,
  //       )
  //     : setAdminButton(null);
  // }, [roles]);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  const handleClick = async () => {
    setMenuOpen(false);
    if (logged) {
      await router.push('/account/my/club-waiting');
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
          데브어스
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
          <div key={index}>
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
          </div>
        );
      })}
      <ListItemButton>
        <li className={cx('custom-item', 'pt-3')}>
          {/* <Button size="small" color="primary" onClick={handleClick}>
            {buttonName}
          </Button> */}
        </li>
        <li className={cx('custom-item', 'pt-3')}>{adminButton}</li>
        <li className={cx('custom-item', 'pt-3')}>{logoutButton}</li>
      </ListItemButton>
    </Box>
  );
  return (
    <header className={`header ${classOption}`}>
      <nav
        className={`navbar navbar-expand-lg tw-p-0 fixed-top ${darkBg ? 'bg-transparent' : 'custom-nav white-bg'} ${
          scroll > headerTop ? 'affix' : ''
        }`}
      >
        <div className="container" style={{ alignItems: 'center' }}>
          <div className={cx('header-link', 'navbar-brand')} onClick={handleGoHome}>
            <div className="tw-text-3xl tw-font-black ">DevUs</div>
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
            className={cx(
              'collapse navbar-collapse main-menu',
              'navbar-mobile  tw-mt-2.5 tw-mb-2.5',
              'tw-justify-between',
              isShowMenu ? 'show' : '',
            )}
            id="navbarSupportedContent"
          >
            <ul className={cx('nav-custom', 'navbar-custom-mobile', 'navbar-nav', 'tw-text-lg', 'tw-text-left')}>
              {menuItem?.map((item, index) => {
                return (
                  <li key={`item-` + index} className={item.option}>
                    <Link href={item.link} className="nav-link">
                      <a
                        onClick={() => {
                          if (item.dropdown.length === 0) setIsShowMenu(!isShowMenu);
                        }}
                      >
                        <div className="tw-mr-10 tw-text-base tw-text-black tw-font-bold">{item.title}</div>
                      </a>
                    </Link>
                    <div className="dropdown-menu submenu" aria-labelledby="navbarDropdownHome">
                      {item.dropdown.map((menu, index) => {
                        return (
                          <Link key={`menu-` + index} href={menu.link} className="dropdown-item">
                            <a
                              onClick={() => {
                                setIsShowMenu(!isShowMenu);
                              }}
                            >
                              <div className="tw-text-base tw-font-light">{menu.title}</div>
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
            {!logged && (
              <li className={cx('custom-item')}>
                <button
                  className="tw-mr-2 tw-bg-[#2474ED] tw-rounded-md border tw-text-sm tw-text-white tw-font-bold tw-py-3 tw-px-5 tw-rounded"
                  onClick={handleClick}
                >
                  퀴즈만들기
                </button>
                <button
                  className="tw-bg-white tw-rounded-md border tw-text-sm tw-text-gray-500 tw-font-bold tw-py-3 tw-px-5 tw-rounded"
                  onClick={handleClick}
                >
                  로그인
                </button>
                {/* <Button size="small" color="white" onClick={handleClick}>
                    로그인
                  </Button> */}
              </li>
            )}
            {adminButton}
            {logoutButton}
            {logged && (
              <li className={cx('nav-item')}>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleClicks}
                      size="small"
                      sx={{ ml: 1, p: 0 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <Avatar sx={{ width: 32, height: 32 }} src={user?.profileImageUrl}>
                        M
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleClose}>
                    <Avatar /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleClick}>
                    <Avatar /> My account
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </li>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
