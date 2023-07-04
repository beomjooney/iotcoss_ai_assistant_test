import { useMediaQuery } from 'react-responsive';
import { useComponentHydrated } from 'react-hydration-provider';

export const Desktop = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const hydrated = useComponentHydrated();
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' }, hydrated ? undefined : { deviceWidth: 1024 });
  return isDesktop ? children : null;
};

const Tablet = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  return isTablet ? children : null;
};

export const Mobile = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const hydrated = useComponentHydrated();
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' }, hydrated ? undefined : { deviceWidth: 767 });
  return isMobile ? children : null;
};

// mobile이 아닐 때만 출력되는 컴포넌트
const Default = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};
