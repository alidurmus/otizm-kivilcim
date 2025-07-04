'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';

// next-themes'in ThemeProvider'ını bir istemci bileşeni olarak sarmalıyoruz.
// Bu, App Router ile uyumlu çalışmasını sağlar.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}