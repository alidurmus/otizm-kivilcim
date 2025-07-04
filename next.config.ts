import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CSP ve güvenlik headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js için gerekli
              "style-src 'self' 'unsafe-inline'", // Tailwind için gerekli
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "connect-src 'self' blob:", // API calls ve audio blob'lar için
              "media-src 'self' blob:", // Audio playback için
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors 'none'",
              "form-action 'self'",
            ].join('; ')
          },
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Permissions Policy (önceki Feature-Policy)
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=(self)', // Ses kayıt için gerekebilir
              'geolocation=()',
              'gyroscope=()',
              'magnetometer=()',
              'payment=()',
              'usb=()',
            ].join(', ')
          }
        ],
      },
    ];
  },

  // Güvenlik için optimize edilmiş build ayarları
  experimental: {
    // Modern browser features
    esmExternals: true,
  },

  // Bundle analyzer ve performance optimizasyonu için
  webpack: (config, { dev, isServer }) => {
    // Production optimizasyonları
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
            // React framework ayrı chunk
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
          },
        },
        usedExports: true,
        sideEffects: false,
        concatenateModules: true, // Module concatenation for better tree shaking
      };
    }

    // Bundle analyzer için (ANALYZE=true ile aktif)
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-analyzer-report.html',
        })
      );
    }

    return config;
  },

  // SWC minification ve compression
  swcMinify: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 yıl cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Font optimization
  optimizeFonts: true,

  // Güvenlik için
  poweredByHeader: false,
  
  // Performance optimizasyonu
  compress: true,
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
