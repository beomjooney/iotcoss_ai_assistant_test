import { useMediaQuery } from 'react-responsive';
import { useComponentHydrated } from 'react-hydration-provider';

export const Desktop = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const hydrated = useComponentHydrated();
  // Show content only if the width is greater than or equal to 1024px
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' }, hydrated ? undefined : { deviceWidth: 1024 });
  return isDesktop ? children : null;
};

export const Mobile = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const hydrated = useComponentHydrated();
  // Show content only if the width is less than 1024px
  const isMobile = useMediaQuery({ query: '(max-width: 1023px)' }, hydrated ? undefined : { deviceWidth: 1024 });
  return isMobile ? children : null;
};

const Tablet = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  return isTablet ? children : null;
};

// mobile이 아닐 때만 출력되는 컴포넌트
const Default = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};
