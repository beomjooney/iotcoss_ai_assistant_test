// ThemeProvider.tsx
import { silverTheme, darkTheme, pinkTheme, mintTheme } from './theme';
import React, { useState, useMemo } from 'react';
import { ThemeContext, ThemeProvider as StyledProvider } from 'styled-components';

interface Props {
  children: React.ReactNode;
}

const THEME: {
  [key in ThemeKey]: Theme;
} = {
  pink: pinkTheme,
  dark: darkTheme,
  silver: silverTheme,
  mint: mintTheme,
};

const ThemeProvider = ({ children }: Props) => {
  const [themeMode, setThemeMode] = useState<ThemeKey>('pink');
  const themeObject = useMemo(() => {
    return THEME[themeMode];
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      <StyledProvider theme={themeObject}>{children}</StyledProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeProvider };
