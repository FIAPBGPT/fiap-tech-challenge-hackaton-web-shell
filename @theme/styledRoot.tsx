'use client';
import { ThemeProvider } from 'styled-components';
import { themed } from './themed';
import GlobalStyles from './GlobalStyles';
import FontStyles from '@/pages/fonts/FontsStyles';

export function StyledRoot({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={themed}>
      <FontStyles />
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}
