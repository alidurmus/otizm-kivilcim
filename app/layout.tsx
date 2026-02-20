import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { headers } from 'next/headers';
import Script from "next/script";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kıvılcım - Otizm Eğitim Platformu",
    template: "%s | Kıvılcım"
  },
  description: "Otizmli çocuklar için özel tasarlanmış Türkçe eğitim platformu. Sesli öğrenme, oyunlar ve interaktif etkinlikler.",
  keywords: [
    "otizm", "eğitim", "çocuk", "türkçe", "öğrenme", "sesli eğitim", 
    "autism", "education", "turkish", "special needs", "learning"
  ],
  authors: [{ name: "Kıvılcım Eğitim Platformu" }],
  creator: "Kıvılcım",
  publisher: "Kıvılcım",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://kivilcim.com",
    siteName: "Kıvılcım - Otizm Eğitim Platformu",
    title: "Kıvılcım - Otizmli Çocuklar İçin Eğitim",
    description: "Otizmli çocuklar için özel tasarlanmış Türkçe eğitim platformu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kıvılcım Eğitim Platformu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kıvılcım - Otizm Eğitim Platformu",
    description: "Otizmli çocuklar için özel tasarlanmış Türkçe eğitim platformu",
    images: ["/og-image.png"],
  },
  // PWA Meta Tags
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kıvılcım",
    startupImage: [
      {
        url: "/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/apple-splash-1668-2388.png", 
        media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/apple-splash-1536-2048.png",
        media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/apple-splash-1125-2436.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      }
    ]
  },
  icons: {
    icon: [
      { url: "/icon-16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/icon-32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/icon-96.svg", sizes: "96x96", type: "image/svg+xml" },
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/icon-192.svg", sizes: "180x180", type: "image/svg+xml" }
    ]
  },
  other: {
    // PWA and mobile optimization
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Kıvılcım",
    "application-name": "Kıvılcım",
    "msapplication-TileColor": "#667eea",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#667eea",
    // Accessibility and autism-friendly meta
    "color-scheme": "light",
    "prefers-reduced-motion": "no-preference",
    "viewport-fit": "cover"
  }
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
    <html lang="tr" className={`${geist.variable} ${geistMono.variable} antialiased min-h-screen font-sans`} data-test-env={isTestEnv ? 'true' : 'false'} suppressHydrationWarning>
      <head>
        {/* PWA Viewport Configuration */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        
        {/* Theme and PWA Colors */}
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-navbutton-color" content="#667eea" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Preload Critical Audio Resources */}
        <link rel="prefetch" href="/audio/letters/a.mp3" />
        <link rel="prefetch" href="/audio/letters/b.mp3" />
        <link rel="prefetch" href="/audio/letters/c.mp3" />
        
        {/* DNS Prefetch for External Services */}
        <link rel="dns-prefetch" href="https://api.elevenlabs.io" />
        <link rel="prefetch" href="/manifest.json" />
        
        {/* Enhanced PWA Support */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Kıvılcım" />
        <meta name="application-name" content="Kıvılcım" />
        <meta name="msapplication-TileColor" content="#667eea" />
        
        {/* Fix icon references to use PNG instead of SVG for better compatibility */}
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Accessibility and Autism-Friendly Features */}
        <meta name="color-scheme" content="light" />
        <meta name="prefers-reduced-motion" content="no-preference" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased min-h-screen font-sans`}>
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
        
        {/* Service Worker Registration */}
        <Script id="sw-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((registration) => {
                    console.log('✅ Service Worker registered:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed') {
                            console.log('🔄 New content available, refresh to update');
                          }
                        });
                      }
                    });
                  })
                  .catch((error) => {
                    console.error('❌ Service Worker registration failed:', error);
                  });
              });
            }
          `}
        </Script>
        
        {/* PWA Install Prompt */}
        <Script id="pwa-install" strategy="afterInteractive">
          {`
            let deferredPrompt;
            
            window.addEventListener('beforeinstallprompt', (e) => {
              console.log('📱 PWA install prompt available');
              e.preventDefault();
              deferredPrompt = e;
              
              // Show custom install button
              const installButton = document.getElementById('pwa-install-btn');
              if (installButton) {
                installButton.style.display = 'block';
                installButton.addEventListener('click', () => {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                      console.log('✅ PWA installed');
                    }
                    deferredPrompt = null;
                  });
                });
              }
            });
            
            // Track PWA usage
            window.addEventListener('appinstalled', () => {
              console.log('🎉 PWA was installed');
              // Track analytics event
            });
          `}
        </Script>
        
        {/* Offline Status Detection */}
        <Script id="offline-detection" strategy="afterInteractive">
          {`
            function updateOnlineStatus() {
              const isOnline = navigator.onLine;
              document.body.setAttribute('data-online', isOnline);
              
              if (!isOnline) {
                console.log('📱 App is offline - cached content available');
              } else {
                console.log('🌐 App is online');
              }
            }
            
            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
            updateOnlineStatus();
          `}
        </Script>
        
        {/* Performance Monitoring */}
        <Script id="performance-monitor" strategy="afterInteractive">
          {`
            // Monitor Core Web Vitals for autism-friendly performance
            function measureWebVitals() {
              if ('PerformanceObserver' in window) {
                // Largest Contentful Paint
                new PerformanceObserver((entryList) => {
                  const entries = entryList.getEntries();
                  const lastEntry = entries[entries.length - 1];
                  console.log('📊 LCP:', lastEntry.startTime);
                }).observe({ entryTypes: ['largest-contentful-paint'] });
                
                // First Input Delay
                new PerformanceObserver((entryList) => {
                  for (const entry of entryList.getEntries()) {
                    console.log('📊 FID:', entry.processingStart - entry.startTime);
                  }
                }).observe({ entryTypes: ['first-input'], buffered: true });
                
                // Cumulative Layout Shift
                new PerformanceObserver((entryList) => {
                  for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                      console.log('📊 CLS:', entry.value);
                    }
                  }
                }).observe({ entryTypes: ['layout-shift'], buffered: true });
              }
            }
            
            window.addEventListener('load', measureWebVitals);
          `}
        </Script>
      </body>
    </html>
  );
}
