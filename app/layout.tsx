import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { headers } from 'next/headers';

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Kıvılcım - Otizm Dostu Öğrenme Platformu",
  description: "Otizmli çocuklar için özel olarak tasarlanmış eğitim platformu. Modüler gelişim alanları ile sakin ve öngörülebilir öğrenme deneyimi.",
  keywords: ["otizm", "öğrenme", "çocuk", "eğitim", "gelişim", "kıvılcım"],
  authors: [{ name: "Kıvılcım Geliştirme Ekibi" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Test ortamını kontrol et
  const headersList = await headers();
  const isTestEnv = process.env.NODE_ENV === 'test' || 
                    headersList.get('x-test-environment') === 'true';
  
  return (
    <html lang="tr" className={nunito.variable} data-test-env={isTestEnv ? 'true' : 'false'} suppressHydrationWarning>
      <body className={`${nunito.className} antialiased min-h-screen font-sans`}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
