'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// next-themes'in ThemeProvider'ını bir istemci bileşeni olarak sarmalıyoruz.
// Bu, App Router ile uyumlu çalışmasını sağlar.
export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}