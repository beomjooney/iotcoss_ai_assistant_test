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
          <div className={cx('custom-item')} id="logoutBtn">
            <button
              className="max-lg: tw-mr-2 tw-bg-[#2474ED] tw-rounded-md border tw-text-sm tw-text-white tw-font-bold tw-py-2.5 tw-px-5 tw-rounded"
              onClick={() => (location.href = '/quiz-make')}
            >
              퀴즈만들기
            </button>
          </div>,
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

  const mobileList = (menuItem: any) => (
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
        className={`navbar navbar-expand-lg max-lg:tw-p-4 tw-p-0 fixed-top ${
          darkBg ? 'bg-transparent' : 'custom-nav white-bg'
        } ${scroll > headerTop ? 'affix' : ''}`}
      >
        <div className="container" style={{ alignItems: 'center' }}>
          <div className={cx('header-link', 'navbar-brand')} onClick={handleGoHome}>
            <div className="tw-text-3xl tw-font-black ">DevUs</div>
          </div>
          <Mobile>
            {!logged && (
              <li className={cx('custom-item', 'max-lg:!tw-pl-26')}>
                <button className="tw-mr-2 tw-bg-[#2474ED] tw-rounded-md border tw-text-sm tw-text-white tw-font-bold tw-py-2.5 tw-px-5 tw-rounded">
                  퀴즈만들기
                </button>
                <button
                  className="tw-bg-white tw-rounded-md border tw-text-sm tw-text-gray-500 tw-font-bold tw-py-2.5 tw-px-5 tw-rounded"
                  onClick={handleClick}
                >
                  로그인
                </button>
              </li>
            )}
            {logged && (
              <div className="row tw-flex tw-items-center tw-justify-between tw-w-80">
                <div className="col-lg-12 tw-flex tw-items-center tw-justify-start max-lg:tw-justify-end lg:tw-mb-0">
                  {logoutButton}
                  <svg
                    className="tw-mx-5  tw-flex-none tw-text-black"
                    fill="none"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C15 15.4 15 16 14.462 16H1.538C1 16 1 15.4 1 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 8 3.464ZM4.54 16a3.48 3.48 0 0 0 6.92 0H4.54Z"
                    />
                  </svg>
                  <li className={cx('nav-item', 'tw-mr-8')}>
                    <Tooltip title="Account settings">
                      <IconButton
                        onClick={handleClicks}
                        size="small"
                        sx={{ ml: 0, p: 0 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                      >
                        <Avatar sx={{ width: 32, height: 32 }} src={user?.profileImageUrl}>
                          M
                        </Avatar>
                      </IconButton>
                    </Tooltip>
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
                          width: '200px',
                          paddingLeft: '8px',
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
                      <MenuItem onClick={() => (location.href = '/quiz-make')}>내가 만든 퀴즈</MenuItem>
                      <Divider />
                      <MenuItem>내 포인트 내역</MenuItem>
                      <Divider />
                      <MenuItem>내 프로필</MenuItem>
                      <Divider />
                      <MenuItem onClick={handleClick}>마이페이지</MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </li>
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
                </div>
              </div>
            )}
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
            {mobileList(menuItem)}
          </SwipeableDrawer>
          <div
            className={cx(
              'collapse navbar-collapse main-menu',
              'navbar-mobile  tw-mt-2.5 tw-mb-2.5 tw-ml-16',
              'tw-justify-between',
              isShowMenu ? 'show' : '',
            )}
            id="navbarSupportedContent"
          >
            <ul className={cx('nav-custom', 'navbar-custom-mobile', 'navbar-nav', 'tw-text-lg', 'tw-text-left')}>
              {menuItem?.map((item, index) => {
                return (
                  item?.login && (
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
                  )
                );
              })}
            </ul>

            {!logged && (
              <li className={cx('custom-item')}>
                <button className="tw-mr-2 tw-bg-[#2474ED] tw-rounded-md border tw-text-sm tw-text-white tw-font-bold tw-py-2.5 tw-px-5 tw-rounded">
                  퀴즈만들기
                </button>
                <button
                  className="tw-bg-white tw-rounded-md border tw-text-sm tw-text-gray-500 tw-font-bold tw-py-2.5 tw-px-5 tw-rounded"
                  onClick={handleClick}
                >
                  로그인
                </button>
              </li>
            )}
            {/* {adminButton} */}
            {logged && (
              <div className="row tw-flex tw-items-center tw-justify-between tw-w-80">
                <div className="col-lg-12 tw-flex tw-items-center tw-justify-end max-lg:tw-justify-end lg:tw-mb-0">
                  {logoutButton}
                  <svg
                    className="tw-mx-5  tw-flex-none tw-text-black"
                    fill="none"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C15 15.4 15 16 14.462 16H1.538C1 16 1 15.4 1 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 8 3.464ZM4.54 16a3.48 3.48 0 0 0 6.92 0H4.54Z"
                    />
                  </svg>
                  <div className={cx('nav-item')}>
                    <Tooltip title="Account settings">
                      <IconButton
                        onClick={handleClicks}
                        size="small"
                        sx={{ ml: 0, p: 0 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                      >
                        <Avatar sx={{ width: 32, height: 32 }} src={user?.profileImageUrl}>
                          M
                        </Avatar>
                      </IconButton>
                    </Tooltip>
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
                          width: '200px',
                          paddingLeft: '8px',
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
                      <MenuItem onClick={() => (location.href = '/quiz-make')}>내가 만든 퀴즈</MenuItem>
                      <Divider />
                      <MenuItem>내 포인트 내역</MenuItem>
                      <Divider />
                      <MenuItem>내 프로필</MenuItem>
                      <Divider />
                      <MenuItem onClick={handleClick}>마이페이지</MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
