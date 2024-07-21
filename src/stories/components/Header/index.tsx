import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../store/session';
import { deleteCookie } from 'cookies-next';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
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
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import { useStore } from 'src/store';

/**alarm */
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { useQuizAlarmHistory } from 'src/services/quiz/quiz.queries';
import { useCheckAlarm } from 'src/services/community/community.mutations';
import { setCookie } from 'cookies-next';
import { useTheme } from 'next-themes';
import { usePresets } from 'src/utils/color-presets';
import { useColorPresets, useColorPresetName } from 'src/utils/use-theme-color';
import cn from 'src/utils/class-names';

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
  const { theme } = useTheme();
  const COLOR_PRESETS = usePresets();
  const { logged, roles } = useSessionStore.getState();
  const { colorPresetName, setColorPresetName } = useColorPresetName();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElAlarm, setAnchorElAlarm] = useState(null);
  const [contents, setContents] = useState<any>([]);
  const [alarmCount, setAlarmCount] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [params, setParams] = useState<any>({ page, logged });
  console.log(logged);
  const open = Boolean(anchorEl);
  const handleClicks = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseAlarm = () => {
    setAnchorElAlarm(null);
  };

  const handleIconClick = event => {
    setAnchorElAlarm(event.currentTarget);
  };

  const router = useRouter();
  const { update } = useSessionStore.getState();
  const { user, setUser } = useStore();
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [buttonName, setButtonName] = useState<string>('로그인');
  const [logoutButton, setLogoutButton] = useState<ReactNode>(null);
  const [adminButton, setAdminButton] = useState<ReactNode>(null);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const { setColorPresets } = useColorPresets();

  //**alarm */
  const { isFetched: isContentFetched, refetch: refetch } = useQuizAlarmHistory(params, data => {
    let falseCount = 0;
    // jsonData를 반복하여 각 활동의 isChecked 값을 확인
    data?.contents?.forEach(day => {
      day.activities.forEach(activity => {
        if (!activity.isChecked) {
          falseCount++;
        }
      });
    });
    setAlarmCount(falseCount);
    setContents(data);
  });

  const { mutate: onCheckAlarm, isSuccess: isSuccessCheck } = useCheckAlarm();

  useEffect(() => {
    if (isSuccessCheck) {
      refetch();
    }
  }, [isSuccessCheck]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  const handleClick = async () => {
    setMenuOpen(false);
    if (logged) {
      await router.push('/account/my/activity');
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

  const handleThemeChange = event => {
    console.log('handleThemeChange', event.target.value);
    update({
      theme: event.target.value,
    });
    setCookie('theme', event.target.value);

    setColorPresets(event.target.value);
    // setColorPresetName(event.target?.name.toLowerCase());
  };

  const mobileList = (menuItem: any) => (
    <Box role="presentation">
      <div
        className="pt-3 pb-3 footer-nav-wrap text-white"
        style={{ textAlign: 'left', paddingLeft: '20px', backgroundColor: 'black' }}
      >
        <Typography type="H3" weight="bold">
          DSU QuizUp
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
          item?.login &&
          (!item.role || roles.includes(item.role)) && (
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
          )
        );
      })}
      <Link href="/" className="nav-link">
        <ListItem disablePadding sx={{ justifyContent: 'start !important', padding: '0.5 !important' }}>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            로그아웃
          </ListItemButton>
        </ListItem>
      </Link>
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
            <img src="/assets/images/header/image_1.png" width={130} alt="logo" className={cx('image-logo')} />
          </div>
          {COLOR_PRESETS.map(preset => (
            <div key={preset?.name} className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-1 tw-mr-4">
              <button
                title={preset?.name}
                onClick={() => {
                  setColorPresets(preset?.colors);
                  setColorPresetName(preset?.name.toLowerCase());
                }}
                className={cn(
                  'tw-grid tw-h-auto tw-w-[30px] tw-place-content-center tw-gap-2 tw-rounded tw-border-2 tw-border-transparent tw-py-1.5 tw-shadow-sm tw-transition tw-duration-300 focus-visible:tw-outline-none',
                  colorPresetName?.toLowerCase() === preset?.name?.toLowerCase()
                    ? 'tw-ring-1 tw-ring-primary tw-ring-offset-2 dark:tw-ring-offset-gray-100'
                    : 'hover:border-primary',
                )}
                style={{ backgroundColor: preset.colors.default }}
              ></button>
              <span
                className={cn(
                  'tw-line-clamp-1',
                  colorPresetName?.toLowerCase() === preset?.name?.toLowerCase() ? 'font-semibold' : 'font-medium',
                )}
                style={{ color: preset.colors.default }}
              >
                {theme === 'dark' && preset.name === 'Black' ? 'White' : preset.name}
              </span>
            </div>
          ))}
          <Mobile>
            <div>
              {!logged && (
                <div className={cx('custom-item', 'max-lg:!tw-pl-26')}>
                  <button
                    className="tw-bg-white tw-rounded-md tw-text-sm tw-text-gray-500 tw-font-bold tw-py-2.5 tw-px-5 tw-mr-4 tw-rounded"
                    onClick={handleClick}
                  >
                    로그인
                  </button>
                  <IconButton
                    sx={{
                      padding: '0 !important',
                      '& .MuiSvgIcon-root': { color: '#000', fontSize: 28, padding: '0px' },
                    }}
                    size="large"
                    aria-label="open drawer"
                    onClick={handleOpenMenu}
                    edge="start"
                  >
                    <MenuIcon />
                  </IconButton>
                </div>
              )}
              {logged && (
                <div className="row tw-flex tw-items-center tw-justify-between tw-w-80 max-lg:tw-w-0">
                  <div className="col-lg-12 tw-flex tw-items-center tw-justify-start max-lg:tw-justify-end lg:tw-mb-0 max-lg:tw-px-0">
                    {logoutButton}
                    <Tooltip title="Alarm">
                      <div className="tw-px-2">
                        <IconButton
                          onClick={handleIconClick}
                          size="large"
                          aria-label="show 17 new notifications"
                          color="inherit"
                        >
                          <Badge badgeContent={17} color="error" className="tw-px-0">
                            <NotificationsNoneIcon sx={{ fontSize: 30 }} />
                          </Badge>
                        </IconButton>
                        <Popover
                          anchorEl={anchorElAlarm}
                          open={Boolean(anchorElAlarm)}
                          onClose={handleCloseAlarm}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        ></Popover>
                      </div>
                    </Tooltip>
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
                          <Avatar sx={{ width: 32, height: 32 }} src={user?.member?.profileImageUrl}>
                            M
                          </Avatar>
                        </IconButton>
                      </Tooltip>
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
            </div>
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
              'navbar-mobile  tw-mt-2.5 tw-mb-2.5',
              'tw-justify-end',
              isShowMenu ? 'show' : '',
            )}
            id="navbarSupportedContent"
          >
            <ul className={cx('nav-custom', 'navbar-custom-mobile', 'navbar-nav', 'tw-text-lg', 'tw-text-left')}>
              {menuItem.map((item, index) => {
                if (item.login && (!item.role || roles.includes(item.role))) {
                  return (
                    <li key={`item-` + index} className={cn(item.option)}>
                      <Link href={item.link}>
                        <a
                          className="nav-link"
                          onClick={() => {
                            if (item.dropdown.length === 0) setIsShowMenu(!isShowMenu);
                          }}
                        >
                          <div className="tw-mr-2 tw-text-base tw-text-black tw-font-extrabold">{item.title}</div>
                        </a>
                      </Link>
                      {item.dropdown.length > 0 && (
                        <div className="dropdown-menu submenu" aria-labelledby="navbarDropdownHome">
                          {item.dropdown.map((menu, index) => (
                            <Link key={`menu-` + index} href={menu.link}>
                              <a
                                className="dropdown-item"
                                onClick={() => {
                                  setIsShowMenu(!isShowMenu);
                                }}
                              >
                                <div className="tw-text-base tw-font-bold">{menu.title}</div>
                              </a>
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                }
                return null;
              })}
            </ul>

            {!logged && (
              <li className={cx('custom-item')}>
                <button
                  className="tw-bg-white tw-rounded-md border tw-text-sm tw-text-gray-500 tw-font-bold tw-py-2.5 tw-px-5 tw-rounded"
                  onClick={handleClick}
                >
                  로그인
                </button>
              </li>
            )}
            {logged && (
              <div className="row tw-flex tw-items-center tw-justify-between">
                <div className="col-lg-12 tw-flex tw-items-center tw-justify-end max-lg:tw-justify-end lg:tw-mb-0">
                  {logoutButton}

                  <Tooltip title="">
                    <div className="tw-px-2">
                      <IconButton
                        onClick={handleIconClick}
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                      >
                        {contents?.totalElements !== 0 ? (
                          <Badge badgeContent={alarmCount} color="error" className="tw-px-0">
                            <NotificationsNoneIcon sx={{ fontSize: 30 }} />
                          </Badge>
                        ) : (
                          <NotificationsNoneIcon sx={{ fontSize: 30 }} />
                        )}
                      </IconButton>
                      <Popover
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        anchorEl={anchorElAlarm}
                        open={Boolean(anchorElAlarm)}
                        onClose={handleCloseAlarm}
                        disableScrollLock={true}
                      >
                        <div className="popover-content tw-w-[370px]" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          <div className="tw-bg-gray-100 tw-text-gray-500 tw-py-4 tw-text-center tw-text-sm">
                            최근 30일동안의 알림만 보관되며,이후 자동삭제됩니다.
                          </div>
                          {contents?.contents?.map((item, index) => {
                            return (
                              // TODO API Response 보고 댓글 작성자로 수정 필요
                              <div key={index} role="tw-list" className=" tw-divide-y tw-divide-gray-100 border-bottom">
                                <div className="tw-justify-between  ">
                                  <div className="tw-min-w-0 tw-p-3 tw-font-semibold">
                                    {item?.date} {item?.dayOfWeek}
                                  </div>
                                  {item?.activities.map((items, index) => {
                                    return (
                                      <div
                                        onClick={() => onCheckAlarm(items?.activityHistorySequence)}
                                        key={index}
                                        className="tw-cursor-pointer border-top tw-p-3 tw-text-black tw-text-sm"
                                      >
                                        {!items?.isChecked && (
                                          <div className="tw-bottom-auto tw-left-auto tw-right-0 tw-top-0 tw-z-10 tw-inline-block tw-rounded-full tw-bg-red-600 tw-p-[3px] tw-text-sm tw-mx-2 tw-mr-3"></div>
                                        )}
                                        {items?.activityMessage}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Popover>
                    </div>
                  </Tooltip>
                  <div className={cx('nav-item')}>
                    <Tooltip title="">
                      <IconButton
                        onClick={handleClicks}
                        size="small"
                        sx={{ ml: 0, p: 0 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                      >
                        <Avatar sx={{ width: 32, height: 32 }} className="border" src={user?.member?.profileImageUrl}>
                          M
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      disableScrollLock={true}
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
                      {/* <Divider />
                      <MenuItem onClick={() => (location.href = '/account/my/point')}>내 포인트 내역</MenuItem> */}
                      {/* <Divider />
                      <MenuItem onClick={() => (location.href = '/profile')}>내 프로필</MenuItem> */}
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
