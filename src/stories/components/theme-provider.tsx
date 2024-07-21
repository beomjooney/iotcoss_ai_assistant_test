'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

enum MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

export function ThemeProvider({ children }: React.PropsWithChildren<{}>) {
  return (
    <NextThemeProvider enableSystem={false} defaultTheme={String(MODE)}>
      {children}
    </NextThemeProvider>
  );
}
